from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from neo4j import GraphDatabase
from config import Config
from Services import db as db_services

from flask_cors import CORS
app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=["*"])  # or use "*" to allow all


# Vérification des configs nécessaires
required_keys = ["MONGO_URI", "NEO4J_URI", "NEO4J_USER", "NEO4J_PASSWORD"]
for key in required_keys:
    if not app.config.get(key):
        raise RuntimeError(f"Missing required config key: {key}")

# Initialisation des drivers
mongo = PyMongo(app)
neo4j = GraphDatabase.driver(
    app.config["NEO4J_URI"],
    auth=(app.config["NEO4J_USER"], app.config["NEO4J_PASSWORD"])
)

# Injection dans le service partagé
db_services.mongo = mongo
db_services.neo4j_driver = neo4j
#routes
from Routes.DocteurRoute import doctor_bp
from Routes.PatientRoute import patient_bp
from Routes.AdminRoute import admin_bp
from Routes.authRoute import  auth_route

app.register_blueprint(auth_route, url_prefix='/auth')

app.register_blueprint(doctor_bp, url_prefix='/doctor')

app.register_blueprint(patient_bp, url_prefix='/patient')
app.register_blueprint(admin_bp, url_prefix='/admin')


@app.route('/test')
def test_mongodb():
    try:
        collections = db_services.mongo.db.list_collection_names()
        return jsonify({"message": "Connected to MongoDB!", "collections": collections})
    except Exception as e:
        return jsonify({"message": "Connection failed", "error": str(e)}), 500


@app.route('/test_neo4j')
def test_neo4j():
    try:
        with db_services.neo4j_driver.session() as session:
            result = session.run("MATCH (p:Person) RETURN p.name AS name LIMIT 5")
            names = [record["name"] for record in result]
        return jsonify({"persons": names})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

