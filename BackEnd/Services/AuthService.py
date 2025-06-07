from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
# supposés définis quelque part
from flask_pymongo import PyMongo
mongo = PyMongo()  # sera initialisé avec app plus tard

def hash_password(password):
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)

def get_role(user_id):
    # Check in doctors
    if mongo.db.doctors.find_one({"_id": ObjectId(user_id)}):
        return "doctor"
    # Check in patients
    if mongo.db.patients.find_one({"_id": ObjectId(user_id)}):
        return "patient"
    # Check in admins
    if mongo.db.admins.find_one({"_id": ObjectId(user_id)}):
        return "admin"
    return None
