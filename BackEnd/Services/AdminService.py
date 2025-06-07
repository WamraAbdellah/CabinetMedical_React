from flask_pymongo import PyMongo
from bson import ObjectId
from werkzeug.security import generate_password_hash

from .db import mongo
def create_admin(data):
    email = data.get("email")

    # Check if email is already used by any user (admin, patient, or doctor)
    existing_admin = mongo.db.admins.find_one({"email": email})
    existing_patient = mongo.db.patients.find_one({"email": email})
    existing_doctor = mongo.db.doctors.find_one({"email": email})

    if existing_admin or existing_patient or existing_doctor:
        raise ValueError("Cet email est déjà utilisé par un autre utilisateur.")

    # Validate required fields
    required_fields = ["nom", "prenom", "email", "mot_de_passe"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Le champ {field} est obligatoire.")

    # Hash the password
    data["mot_de_passe"] = generate_password_hash(data["mot_de_passe"])

    # Insert the admin into MongoDB
    result = mongo.db.admins.insert_one(data)
    admin_id = str(result.inserted_id)

    return admin_id

def get_admin(admin_id):
    admin = mongo.db.admins.find_one({"_id": ObjectId(admin_id)})
    if admin:
        admin["_id"] = str(admin["_id"])
    return admin

def get_admin(admin_id):
    admin = mongo.db.admins.find_one({"_id": ObjectId(admin_id)})
    if admin:
        admin["_id"] = str(admin["_id"])
    return admin


def list_admins():
    admins = mongo.db.admins.find()
    return [{**adm, "_id": str(adm["_id"])} for adm in admins]
