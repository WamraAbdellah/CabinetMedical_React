from bson import ObjectId
from datetime import datetime
from BackEnd.Constantes import specialites
from BackEnd.Modules.Docteur import Docteur
from neo4j import GraphDatabase
from BackEnd.Services.AuthService import hash_password
from BackEnd.Services.db import neo4j_driver, mongo


# ---------------------- Neo4j Helpers ----------------------

def create_doctor_node(tx, doctor_id, nom, prenom, specialite, email):
    tx.run("""
        CREATE (d:Doctor {id: $id, nom: $nom, prenom: $prenom, specialite: $specialite, email: $email})
    """, id=doctor_id, nom=nom, prenom=prenom, specialite=specialite, email=email)


def update_doctor_node(tx, doctor_id, fields):
    set_clause = ", ".join([f"d.{key} = ${key}" for key in fields])
    query = f"""
        MATCH (d:Doctor {{id: $id}})
        SET {set_clause}
    """
    tx.run(query, id=doctor_id, **fields)


def delete_doctor_node(tx, doctor_id):
    tx.run("""
        MATCH (d:Doctor {id: $id}) DETACH DELETE d
    """, id=doctor_id)


def create_patient_relationship(tx, doctor_id, patient_id):
    tx.run("""
        MATCH (d:Doctor {id: $did}), (p:Patient {id: $pid})
        MERGE (p)-[:EST_SUIVI_PAR]->(d)
    """, did=doctor_id, pid=patient_id)


def delete_patient_relationship(tx, doctor_id, patient_id):
    tx.run("""
        MATCH (p:Patient {id: $pid})-[r:EST_SUIVI_PAR]->(d:Doctor {id: $did})
        DELETE r
    """, pid=patient_id, did=doctor_id)


def create_consultation_relationship(tx, consultation_id, patient_id, doctor_id, date, etat, description):
    tx.run("""
        MATCH (p:Patient {id: $pid}), (d:Doctor {id: $did})
        CREATE (c:Consultation {id: $cid, date: $date, etat: $etat, description: $description})
        CREATE (p)-[:A_CONSULTATION]->(c)
        CREATE (d)-[:A_CONSULTATION]->(c)
    """, pid=patient_id, did=doctor_id, cid=consultation_id,
           date=date, etat=etat, description=description)


def update_consultation_status_in_neo4j(tx, consultation_id, new_status):
    tx.run("""
        MATCH (c:Consultation {id: $cid})
        SET c.etat = $status
    """, cid=consultation_id, status=new_status)


# ---------------------- Mongo + Neo4j Logic ----------------------

def create_doctor(data):
    # Validate required fields
    required_fields = ["nom", "prenom", "email", "mot_de_passe", "specialite"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Le champ {field} est obligatoire.")

    # Validate speciality
    if data["specialite"] not in specialites:
        raise ValueError(f"Spécialité invalide. Options valides: {', '.join(specialites)}")

    # Check email uniqueness across both doctors and patients
    email = data["email"]
    existing_doctor = mongo.db.doctors.find_one({"email": email})
    existing_patient = mongo.db.patients.find_one({"email": email})

    if existing_doctor or existing_patient:
        raise ValueError("Cet email est déjà utilisé par un autre utilisateur.")

    # Hash password and create doctor
    data["mot_de_passe"] = hash_password(data["mot_de_passe"])
    doctor = Docteur(**data)
    doctor_dict = doctor.to_dict()

    # Remove patient_ids as relationships are stored in Neo4j
    doctor_dict.pop('patient_ids', None)

    # MongoDB insertion
    result = mongo.db.doctors.insert_one(doctor_dict)
    doctor_id = str(result.inserted_id)

    # Neo4j insertion
    with neo4j_driver.session() as session:
        session.write_transaction(
            create_doctor_node,
            doctor_id,
            data["nom"],
            data["prenom"],
            data["specialite"],
            data["email"]
        )

    return doctor_id

def create_doctor_nohash(data):
    # Validate required fields
    required_fields = ["nom", "prenom", "email", "mot_de_passe", "specialite"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Le champ {field} est obligatoire.")

    # Validate speciality
    if data["specialite"] not in specialites:
        raise ValueError(f"Spécialité invalide. Options valides: {', '.join(specialites)}")

    # Check email uniqueness across both doctors and patients
    email = data["email"]
    existing_doctor = mongo.db.doctors.find_one({"email": email})
    existing_patient = mongo.db.patients.find_one({"email": email})

    if existing_doctor or existing_patient:
        raise ValueError("Cet email est déjà utilisé par un autre utilisateur.")

    # Hash password and create doctor

    doctor = Docteur(**data)
    doctor_dict = doctor.to_dict()

    # Remove patient_ids as relationships are stored in Neo4j
    doctor_dict.pop('patient_ids', None)

    # MongoDB insertion
    result = mongo.db.doctors.insert_one(doctor_dict)
    doctor_id = str(result.inserted_id)

    # Neo4j insertion
    with neo4j_driver.session() as session:
        session.write_transaction(
            create_doctor_node,
            doctor_id,
            data["nom"],
            data["prenom"],
            data["specialite"],
            data["email"]
        )

    return doctor_id


def get_doctor(doctor_id):
    if not ObjectId.is_valid(doctor_id):
        raise ValueError("ID docteur invalide")

    doc = mongo.db.doctors.find_one({"_id": ObjectId(doctor_id)})
    if not doc:
        raise ValueError("Docteur non trouvé")

    doc["_id"] = str(doc["_id"])

    # Get patient relationships from Neo4j
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (p:Patient)-[:EST_SUIVI_PAR]->(d:Doctor {id: $id})
            RETURN p.id as patient_id
        """, id=doctor_id)
        doc["patient_ids"] = [record["patient_id"] for record in result]

    return doc


def update_doctor(doctor_id, data):
    if not ObjectId.is_valid(doctor_id):
        raise ValueError("ID docteur invalide")

    # Check if doctor exists
    existing_doctor = mongo.db.doctors.find_one({"_id": ObjectId(doctor_id)})
    if not existing_doctor:
        raise ValueError("Docteur non trouvé")

    # Validate speciality if being updated
    if "specialite" in data and data["specialite"] not in specialites:
        raise ValueError(f"Spécialité invalide. Options valides: {', '.join(specialites)}")

    # Check email uniqueness if being updated
    if "email" in data:
        existing_with_email = mongo.db.doctors.find_one({
            "email": data["email"],
            "_id": {"$ne": ObjectId(doctor_id)}
        })
        if existing_with_email:
            raise ValueError("Cet email est déjà utilisé par un autre docteur.")

    # Hash password if being updated
    if "mot_de_passe" in data:
        data["mot_de_passe"] = hash_password(data["mot_de_passe"])

    # MongoDB update
    mongo.db.doctors.update_one({"_id": ObjectId(doctor_id)}, {"$set": data})

    # Sync Neo4j for relevant fields
    fields_to_update = {k: v for k, v in data.items() if k in ["nom", "prenom", "specialite", "email"]}
    if fields_to_update:
        with neo4j_driver.session() as session:
            session.write_transaction(update_doctor_node, doctor_id, fields_to_update)

    return get_doctor(doctor_id)


def delete_doctor(doctor_id):
    if not ObjectId.is_valid(doctor_id):
        raise ValueError("ID docteur invalide")

    # Check if doctor exists
    doctor = get_doctor(doctor_id)
    if not doctor:
        raise ValueError("Docteur non trouvé")

    # Check if doctor has assigned patients (from Neo4j now)
    if doctor.get("patient_ids") and len(doctor["patient_ids"]) > 0:
        raise ValueError("Impossible de supprimer un docteur avec des patients assignés.")

    # Check if doctor has upcoming consultations (query Neo4j)
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (d:Doctor {id: $id})-[:A_CONSULTATION]->(c:Consultation)
            WHERE c.etat IN ['prévue', 'acceptée'] AND c.date >= datetime()
            RETURN count(c) > 0 as has_upcoming
        """, id=doctor_id)
        if result.single()["has_upcoming"]:
            raise ValueError("Impossible de supprimer un docteur avec des consultations à venir")

    # MongoDB deletion
    mongo.db.doctors.delete_one({"_id": ObjectId(doctor_id)})

    # Neo4j deletion
    with neo4j_driver.session() as session:
        session.write_transaction(delete_doctor_node, doctor_id)

    return True


def list_doctors():
    docs = mongo.db.doctors.find()
    doctors_list = [{**doc, "_id": str(doc["_id"])} for doc in docs]

    # Optionally add patient counts from Neo4j
    with neo4j_driver.session() as session:
        for doctor in doctors_list:
            result = session.run("""
                MATCH (p:Patient)-[:EST_SUIVI_PAR]->(d:Doctor {id: $id})
                RETURN count(p) as patient_count
            """, id=doctor["_id"])
            doctor["patient_count"] = result.single()["patient_count"]

    return doctors_list


def assign_patient_to_doctor(doctor_id, patient_id):
    if not ObjectId.is_valid(doctor_id) or not ObjectId.is_valid(patient_id):
        raise ValueError("ID invalide")

    # Check if both doctor and patient exist
    if not mongo.db.doctors.find_one({"_id": ObjectId(doctor_id)}):
        raise ValueError("Docteur non trouvé")
    if not mongo.db.patients.find_one({"_id": ObjectId(patient_id)}):
        raise ValueError("Patient non trouvé")

    # Create relationship in Neo4j only
    with neo4j_driver.session() as session:
        # Remove any existing relationship first
        session.write_transaction(delete_patient_relationship, doctor_id, patient_id)
        # Create new relationship
        session.write_transaction(create_patient_relationship, doctor_id, patient_id)

    return True


def create_consultation(patient_id, doctor_id, date, etat="prévue", description=None):
    if not ObjectId.is_valid(patient_id) or not ObjectId.is_valid(doctor_id):
        raise ValueError("ID invalide")

    # Check if both exist
    if not mongo.db.patients.find_one({"_id": ObjectId(patient_id)}):
        raise ValueError("Patient non trouvé")
    if not mongo.db.doctors.find_one({"_id": ObjectId(doctor_id)}):
        raise ValueError("Docteur non trouvé")

    # Parse and validate date
    try:
        consultation_date = datetime.strptime(date, "%Y-%m-%d %H:%M")
        if consultation_date < datetime.now():
            raise ValueError("La date de consultation ne peut pas être dans le passé")
    except ValueError:
        raise ValueError("Format de date invalide. Utilisez le format YYYY-MM-DD HH:MM")

    # Check for scheduling conflicts in Neo4j
    with neo4j_driver.session() as session:
        # Doctor availability check
        result = session.run("""
            MATCH (d:Doctor {id: $did})-[:A_CONSULTATION]->(c:Consultation {date: $date})
            WHERE c.etat <> 'annulée'
            RETURN count(c) > 0 as has_conflict
        """, did=doctor_id, date=date)
        if result.single()["has_conflict"]:
            raise ValueError("Le docteur a déjà une consultation prévue à cette heure")

        # Patient availability check
        result = session.run("""
            MATCH (p:Patient {id: $pid})-[:A_CONSULTATION]->(c:Consultation {date: $date})
            WHERE c.etat <> 'annulée'
            RETURN count(c) > 0 as has_conflict
        """, pid=patient_id, date=date)
        if result.single()["has_conflict"]:
            raise ValueError("Le patient a déjà une consultation prévue à cette heure")

    # Create minimal consultation document in MongoDB
    consultation_data = {
        "date": date,
        "etat": etat,
        "description": description
    }
    result = mongo.db.consultations.insert_one(consultation_data)
    consultation_id = str(result.inserted_id)

    # Create relationships in Neo4j
    with neo4j_driver.session() as session:
        session.write_transaction(
            create_consultation_relationship,
            consultation_id,
            patient_id,
            doctor_id,
            date,
            etat,
            description
        )

    return consultation_id


def update_consultation_status(consultation_id, new_status):
    if not ObjectId.is_valid(consultation_id):
        raise ValueError("ID consultation invalide")

    valid_statuses = ["prévue", "acceptée", "rejetée", "annulée", "terminée"]
    if new_status not in valid_statuses:
        raise ValueError(f"Statut de consultation invalide. Options valides: {', '.join(valid_statuses)}")

    # Check if consultation exists
    consultation = mongo.db.consultations.find_one({"_id": ObjectId(consultation_id)})
    if not consultation:
        raise ValueError("Consultation introuvable")

    # Prevent modifying completed consultations
    if consultation.get("etat") == "terminée" and new_status != "terminée":
        raise ValueError("Impossible de modifier une consultation terminée")

    # MongoDB update
    mongo.db.consultations.update_one(
        {"_id": ObjectId(consultation_id)},
        {"$set": {"etat": new_status}}
    )

    # Neo4j update
    with neo4j_driver.session() as session:
        session.write_transaction(
            update_consultation_status_in_neo4j,
            consultation_id,
            new_status
        )

    return get_consultation(consultation_id)


def get_consultation(consultation_id):
    if not ObjectId.is_valid(consultation_id):
        raise ValueError("ID consultation invalide")

    # Get from MongoDB first
    consultation = mongo.db.consultations.find_one({"_id": ObjectId(consultation_id)})
    if not consultation:
        raise ValueError("Consultation non trouvée")

    # Convert to proper response format
    result = {
        "_id": str(consultation["_id"]),
        "date": consultation["date_str"],  # Use the string version
        "etat": consultation["etat"],
        "description": consultation.get("description", "")
    }

    # Optionally get relationships from Neo4j if needed
    with neo4j_driver.session() as session:
        rels = session.run(
            """
            MATCH (p:Patient)-[:A_CONSULTATION]->(c:Consultation {mongo_id: $id})
            MATCH (d:Doctor)-[:A_CONSULTATION]->(c)
            RETURN p.id as patient_id, d.id as doctor_id
            """,
            id=consultation_id
        ).single()

        if rels:
            result.update({
                "patient_id": rels["patient_id"],
                "doctor_id": rels["doctor_id"]
            })

    return result


def get_consultations_by_doctor(doctor_id):
    if not ObjectId.is_valid(doctor_id):
        raise ValueError("ID docteur invalide")

    # Get consultations from Neo4j
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (d:Doctor {id: $did})-[:A_CONSULTATION]->(c:Consultation)
            MATCH (p:Patient)-[:A_CONSULTATION]->(c)
            RETURN c.id as consultation_id, p.id as patient_id, 
                   c.date as date, c.etat as etat, c.description as description
            ORDER BY c.date
        """, did=doctor_id)

        consultations = []
        for record in result:
            # Get additional details from MongoDB if needed
            mongo_consult = mongo.db.consultations.find_one(
                {"_id": ObjectId(record["consultation_id"])}
            )
            if mongo_consult:
                consultation = {
                    "_id": record["consultation_id"],
                    "patient_id": record["patient_id"],
                    "doctor_id": doctor_id,
                    "date": record["date"],
                    "etat": record["etat"],
                    "description": record["description"],
                    # Add any additional fields from MongoDB
                    **{k: v for k, v in mongo_consult.items()
                       if k not in ["_id", "date", "etat", "description"]}
                }
                consultations.append(consultation)

    return consultations


def get_consultations_by_patient(patient_id):
    if not ObjectId.is_valid(patient_id):
        raise ValueError("ID patient invalide")

    # Get consultations from Neo4j
    with neo4j_driver.session() as session:
        result = session.run("""
            MATCH (p:Patient {id: $pid})-[:A_CONSULTATION]->(c:Consultation)
            MATCH (d:Doctor)-[:A_CONSULTATION]->(c)
            RETURN c.id as consultation_id, d.id as doctor_id, 
                   c.date as date, c.etat as etat, c.description as description
            ORDER BY c.date
        """, pid=patient_id)

        consultations = []
        for record in result:
            # Get additional details from MongoDB if needed
            mongo_consult = mongo.db.consultations.find_one(
                {"_id": ObjectId(record["consultation_id"])}
            )
            if mongo_consult:
                consultation = {
                    "_id": record["consultation_id"],
                    "patient_id": patient_id,
                    "doctor_id": record["doctor_id"],
                    "date": record["date"],
                    "etat": record["etat"],
                    "description": record["description"],
                    # Add any additional fields from MongoDB
                    **{k: v for k, v in mongo_consult.items()
                       if k not in ["_id", "date", "etat", "description"]}
                }
                consultations.append(consultation)

    return consultations
