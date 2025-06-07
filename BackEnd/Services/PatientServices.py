from bson import ObjectId
from datetime import datetime, timedelta
from BackEnd.Constantes import specialites
from BackEnd.Modules.Consultation import Consultation
from BackEnd.Modules.Patient import Patient
from BackEnd.Services.AuthService import hash_password
from BackEnd.Services.db import mongo, neo4j_driver


def create_patient(data):
    email = data.get("email")

    # Check if email is unique in both patients and doctors collections
    existing_patient = mongo.db.patients.find_one({"email": email})
    existing_doctor = mongo.db.doctors.find_one({"email": email})

    if existing_patient or existing_doctor:
        raise ValueError("Cet email est déjà utilisé par un autre utilisateur.")

    # Validate required fields
    required_fields = ["nom", "prenom", "email", "mot_de_passe", "date_naissance"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Le champ {field} est obligatoire.")

    # MongoDB - store only patient attributes, no relationships
    data["mot_de_passe"] = hash_password(data["mot_de_passe"])
    patient = Patient(**data)
    patient_dict = patient.to_dict()

    # Remove any relationship fields that might be in the data
    patient_dict.pop('doctor_id', None)

    result = mongo.db.patients.insert_one(patient_dict)
    patient_id = str(result.inserted_id)

    # Neo4j - store the patient node
    with neo4j_driver.session() as session:
        session.run(
            "CREATE (p:Patient {id: $id, nom: $nom, prenom: $prenom, email: $email})",
            id=patient_id,
            nom=data["nom"],
            prenom=data["prenom"],
            email=data["email"]
        )

    return patient_id


def get_patient(patient_id):
    if not ObjectId.is_valid(patient_id):
        raise ValueError("ID patient invalide")

    pat = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    if not pat:
        raise ValueError("Patient non trouvé")

    pat["_id"] = str(pat["_id"])

    # If you need relationship data, fetch it from Neo4j
    with neo4j_driver.session() as session:
        result = session.run(
            "MATCH (p:Patient {id: $id})-[:EST_SUIVI_PAR]->(d:Doctor) "
            "RETURN d.id as doctor_id",
            id=patient_id
        )
        doctor_data = result.single()
        if doctor_data:
            pat["doctor_id"] = doctor_data["doctor_id"]

    return pat


def update_patient(patient_id, data):
    if not ObjectId.is_valid(patient_id):
        raise ValueError("ID patient invalide")

    # Check if patient exists
    existing_patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    if not existing_patient:
        raise ValueError("Patient non trouvé")

    # If email is being updated, check for uniqueness
    if "email" in data:
        existing_with_email = mongo.db.patients.find_one({
            "email": data["email"],
            "_id": {"$ne": ObjectId(patient_id)}
        })
        if existing_with_email:
            raise ValueError("Cet email est déjà utilisé par un autre patient.")

    # MongoDB - update only patient attributes
    if "mot_de_passe" in data:
        data["mot_de_passe"] = hash_password(data["mot_de_passe"])

    # Remove relationship fields if they were accidentally included
    data.pop('doctor_id', None)

    mongo.db.patients.update_one({"_id": ObjectId(patient_id)}, {"$set": data})

    # Neo4j - update patient node properties
    if any(field in data for field in ['nom', 'prenom', 'email']):
        with neo4j_driver.session() as session:
            session.run(
                "MATCH (p:Patient {id: $id}) "
                "SET p.nom = COALESCE($nom, p.nom), "
                "p.prenom = COALESCE($prenom, p.prenom), "
                "p.email = COALESCE($email, p.email)",
                id=patient_id,
                nom=data.get("nom"),
                prenom=data.get("prenom"),
                email=data.get("email")
            )

    return get_patient(patient_id)


def delete_patient(patient_id):
    if not ObjectId.is_valid(patient_id):
        raise ValueError("ID patient invalide")

    # Check if patient exists
    existing_patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    if not existing_patient:
        raise ValueError("Patient non trouvé")

    # MongoDB - delete patient document
    mongo.db.patients.delete_one({"_id": ObjectId(patient_id)})

    # Neo4j - Delete patient and all related nodes/relationships
    with neo4j_driver.session() as session:
        session.run(
            "MATCH (p:Patient {id: $id}) "
            "DETACH DELETE p",
            id=patient_id
        )

    return True


def list_patients():
    pats = mongo.db.patients.find()
    patients_list = [{**pat, "_id": str(pat["_id"])} for pat in pats]

    # If you need relationship data for each patient, fetch from Neo4j
    with neo4j_driver.session() as session:
        for patient in patients_list:
            result = session.run(
                "MATCH (p:Patient {id: $id})-[:EST_SUIVI_PAR]->(d:Doctor) "
                "RETURN d.id as doctor_id",
                id=patient["_id"]
            )
            doctor_data = result.single()
            if doctor_data:
                patient["doctor_id"] = doctor_data["doctor_id"]

    return patients_list


def assign_patient_to_doctor(patient_id, doctor_id):
    if not ObjectId.is_valid(patient_id):
        raise ValueError("ID patient invalide")
    if not ObjectId.is_valid(doctor_id):
        raise ValueError("ID docteur invalide")

    # Check if patient exists
    patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise ValueError("Patient non trouvé")

    # Check if doctor exists
    doctor = mongo.db.doctors.find_one({"_id": ObjectId(doctor_id)})
    if not doctor:
        raise ValueError("Docteur non trouvé")

    # No need to update MongoDB - relationships are stored in Neo4j only

    # Neo4j - handle the relationship
    with neo4j_driver.session() as session:
        # Remove any existing EST_SUIVI_PAR relationship first
        session.run(
            "MATCH (p:Patient {id: $patient_id})-[r:EST_SUIVI_PAR]->() "
            "DELETE r",
            patient_id=patient_id
        )

        # Create new EST_SUIVI_PAR relationship
        session.run(
            "MATCH (p:Patient {id: $patient_id}), (d:Doctor {id: $doctor_id}) "
            "MERGE (p)-[:EST_SUIVI_PAR]->(d)",
            patient_id=patient_id,
            doctor_id=doctor_id
        )

    return True


def create_consultation(patient_id, doctor_id, date, etat="prévue", description=None):
    if not ObjectId.is_valid(patient_id):
        raise ValueError("ID patient invalide")
    if not ObjectId.is_valid(doctor_id):
        raise ValueError("ID docteur invalide")

    # Check if patient exists
    patient = mongo.db.patients.find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise ValueError("Patient non trouvé")

    # Check if doctor exists
    doctor = mongo.db.doctors.find_one({"_id": ObjectId(doctor_id)})
    if not doctor:
        raise ValueError("Docteur non trouvé")

    # Parse and validate date
    try:
        # Parse input string to datetime
        consultation_date = datetime.strptime(date, "%Y-%m-%d %H:%M")
        if consultation_date < datetime.now():
            raise ValueError("La date de consultation ne peut pas être dans le passé")

        # Calculate end time (assuming 1 hour consultation by default)
        end_time = consultation_date + timedelta(hours=1)

        # ISO formats for Neo4j
        iso_start = consultation_date.isoformat()
        iso_end = end_time.isoformat()

        # String format for MongoDB
        mongo_date_str = consultation_date.strftime("%Y-%m-%d %H:%M")
    except ValueError:
        raise ValueError("Format de date invalide. Utilisez le format YYYY-MM-DD HH:MM")

    # Check for scheduling conflicts in Neo4j
    with neo4j_driver.session() as session:
        # Doctor availability check
        result = session.run(
            """
            MATCH (d:Doctor {id: $doctor_id})-[:A_CONSULTATION]->(c:Consultation)
            WHERE c.etat <> 'annulée' AND 
                  datetime($start_time) < datetime(c.end_time) AND
                  datetime($end_time) > datetime(c.start_time)
            RETURN count(c) > 0 as has_conflict
            """,
            doctor_id=doctor_id,
            start_time=iso_start,
            end_time=iso_end
        )
        if result.single()["has_conflict"]:
            raise ValueError("Le docteur a déjà une consultation prévue pendant cette période")

        # Patient availability check
        result = session.run(
            """
            MATCH (p:Patient {id: $patient_id})-[:A_CONSULTATION]->(c:Consultation)
            WHERE c.etat <> 'annulée' AND 
                  datetime($start_time) < datetime(c.end_time) AND
                  datetime($end_time) > datetime(c.start_time)
            RETURN count(c) > 0 as has_conflict
            """,
            patient_id=patient_id,
            start_time=iso_start,
            end_time=iso_end
        )
        if result.single()["has_conflict"]:
            raise ValueError("Le patient a déjà une consultation prévue pendant cette période")

    # Create in MongoDB - store both string and datetime formats
    consultation_data = {
        "date_str": mongo_date_str,  # String version for display
        "date": consultation_date,  # Datetime object for queries
        "etat": etat,
        "description": description,
        "created_at": datetime.now()
    }
    result = mongo.db.consultations.insert_one(consultation_data)
    consultation_id = str(result.inserted_id)

    # Create relationships in Neo4j with proper datetime objects
    with neo4j_driver.session() as session:
        session.run(
            """
            MATCH (p:Patient {id: $patient_id}), (d:Doctor {id: $doctor_id})
            CREATE (c:Consultation {
                id: $consultation_id,
                start_time: datetime($start_time),
                end_time: datetime($end_time),
                etat: $etat,
                description: $description,
                mongo_id: $consultation_id  
            })
            CREATE (p)-[:A_CONSULTATION]->(c)
            CREATE (d)-[:A_CONSULTATION]->(c)
            """,
            patient_id=patient_id,
            doctor_id=doctor_id,
            consultation_id=consultation_id,
            start_time=iso_start,
            end_time=iso_end,
            etat=etat,
            description=description
        )

    return consultation_id