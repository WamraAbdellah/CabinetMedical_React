from datetime import datetime

from flask import Blueprint, request, jsonify
from bson import ObjectId
from functools import wraps
from typing import Dict, List, Any

from werkzeug.security import generate_password_hash

from BackEnd.Services.db import  mongo

# Import des services
from BackEnd.Services.DocteurService import (
    create_doctor,
    get_doctor,
    update_doctor,
    delete_doctor,
    list_doctors,
    get_consultations_by_doctor,
    update_consultation_status
)
from BackEnd.Services.PatientServices import get_patient


doctor_bp = Blueprint('doctor', __name__)


def handle_service_errors(f):
    """Décorateur pour la gestion centralisée des erreurs"""

    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        except Exception as e:
            return jsonify({"error": f"Erreur serveur: {str(e)}"}), 500

    return wrapper


@doctor_bp.route('', methods=['POST'])
@handle_service_errors
def add_doctor():
    data: Dict[str, Any] = request.json
    required_fields = ['nom', 'prenom', 'email', 'mot_de_passe', 'specialite']

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Champs requis manquants"}), 400

    doctor_id = create_doctor(data)
    return jsonify({
        "message": "Docteur créé avec succès",
        "doctor_id": doctor_id
    }), 201


@doctor_bp.route('/<string:doctor_id>', methods=['GET'])
@handle_service_errors
def get_doctor_route(doctor_id: str):
    doctor = get_doctor(doctor_id)
    if not doctor:
        return jsonify({"error": "Docteur non trouvé"}), 404
    return jsonify(doctor)


@doctor_bp.route('/<string:doctor_id>', methods=['PUT'])
@handle_service_errors
def update_doctor_route(doctor_id: str):
    data: Dict[str, Any] = request.json
    if not data:
        return jsonify({"error": "Aucune donnée fournie"}), 400

    updated_doctor = update_doctor(doctor_id, data)
    return jsonify({
        "message": "Docteur mis à jour",
        "doctor": updated_doctor
    })


@doctor_bp.route('/<string:doctor_id>', methods=['DELETE'])
@handle_service_errors
def delete_doctor_route(doctor_id: str):
    delete_doctor(doctor_id)
    return jsonify({"message": "Docteur supprimé avec succès"})


@doctor_bp.route('', methods=['GET'])
@handle_service_errors
def list_doctors_route():
    doctors = list_doctors()
    return jsonify({
        "count": len(doctors),
        "doctors": doctors
    })


@doctor_bp.route('/<string:doctor_id>/patients', methods=['GET'])
@handle_service_errors
def list_doctor_patients(doctor_id: str):
    doctor = get_doctor(doctor_id)
    if not doctor:
        return jsonify({"error": "Docteur non trouvé"}), 404

    patients = []
    for patient_id in doctor.get("patient_ids", []):
        patient = get_patient(str(patient_id))
        if patient:
            patients.append(patient)

    return jsonify({
        "count": len(patients),
        "patients": patients
    })


@doctor_bp.route('/<string:doctor_id>/consultations', methods=['GET'])
@handle_service_errors
def list_doctor_consultations(doctor_id: str):
    consultations = get_consultations_by_doctor(doctor_id)
    return jsonify({
        "count": len(consultations),
        "consultations": consultations
    })


@doctor_bp.route('/<string:doctor_id>/consultations/pending', methods=['GET'])
@handle_service_errors
def list_pending_consultations(doctor_id: str):
    consultations = get_consultations_by_doctor(doctor_id)
    pending = [c for c in consultations if c.get("etat") == "demandée"]
    return jsonify({
        "count": len(pending),
        "consultations": pending
    })


@doctor_bp.route('/<string:doctor_id>/consultations/<string:consultation_id>/accept', methods=['POST'])
@handle_service_errors
def accept_consultation(doctor_id: str, consultation_id: str):
    updated = update_consultation_status(consultation_id, "acceptée")
    return jsonify({
        "message": "Consultation acceptée",
        "consultation": updated
    })


@doctor_bp.route('/<string:doctor_id>/consultations/<string:consultation_id>/reject', methods=['POST'])
@handle_service_errors
def reject_consultation(doctor_id: str, consultation_id: str):
    updated = update_consultation_status(consultation_id, "rejetée")
    return jsonify({
        "message": "Consultation rejetée",
        "consultation": updated
    })

@doctor_bp.route('/admin/request', methods=['POST'])
def submit_doctor_request():
    try:
        data = request.get_json()

        # Basic validation
        required_fields = ["nom", "prenom", "email", "mot_de_passe", "specialite","tel"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Check if email exists
        existing_doctor = mongo.db.doctors.find_one({"email": data["email"]})
        existing_pending = mongo.db.pending_doctors.find_one({"email": data["email"]})
        if existing_doctor or existing_pending:
            return jsonify({"error": "Email already exists in the system"}), 400

        # Hash password and create request
        doctor_request = {
            **data,
            "status": "pending",
            "created_at": datetime.utcnow(),
            "mot_de_passe": generate_password_hash(data["mot_de_passe"])  # Hashing here
        }

        result = mongo.db.pending_doctors.insert_one(doctor_request)
        return jsonify({
            "message": "Registration submitted for admin approval",
            "request_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500