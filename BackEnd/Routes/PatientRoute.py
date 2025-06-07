from flask import Blueprint, request, jsonify
from bson import ObjectId
from functools import wraps
from typing import Dict, Any

# Import des services
from BackEnd.Services.PatientServices import (
    create_patient,
    get_patient,
    update_patient,
    delete_patient,
    list_patients,
    assign_patient_to_doctor,
    create_consultation
)
from BackEnd.Services.DocteurService import get_consultations_by_patient, get_doctor

patient_bp = Blueprint('patient', __name__)


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


@patient_bp.route('', methods=['POST'])
@handle_service_errors
def add_patient():
    data: Dict[str, Any] = request.json
    required_fields = ['nom', 'prenom', 'email', 'mot_de_passe']

    if not all(field in data for field in required_fields):
        return jsonify({"error": "Champs requis manquants"}), 400

    patient_id = create_patient(data)
    return jsonify({
        "message": "Patient créé avec succès",
        "patient_id": patient_id
    }), 201


@patient_bp.route('/<string:patient_id>', methods=['GET'])
@handle_service_errors
def get_patient_route(patient_id: str):
    patient = get_patient(patient_id)
    if not patient:
        return jsonify({"error": "Patient non trouvé"}), 404
    return jsonify(patient)


@patient_bp.route('/<string:patient_id>', methods=['PUT'])
@handle_service_errors
def update_patient_route(patient_id: str):
    data: Dict[str, Any] = request.json
    if not data:
        return jsonify({"error": "Aucune donnée fournie"}), 400

    updated_patient = update_patient(patient_id, data)
    return jsonify({
        "message": "Patient mis à jour",
        "patient": updated_patient
    })


@patient_bp.route('/<string:patient_id>', methods=['DELETE'])
@handle_service_errors
def delete_patient_route(patient_id: str):
    delete_patient(patient_id)
    return jsonify({"message": "Patient supprimé avec succès"})


@patient_bp.route('', methods=['GET'])
@handle_service_errors
def list_patients_route():
    patients = list_patients()
    return jsonify({
        "count": len(patients),
            "patients": patients
    })


@patient_bp.route('/<string:patient_id>/consultations', methods=['GET'])
@handle_service_errors
def get_patient_consultations(patient_id: str):
    consultations = get_consultations_by_patient(patient_id)
    return jsonify({
        "count": len(consultations),
        "consultations": consultations
    })


@patient_bp.route('/<string:patient_id>/doctor', methods=['GET'])
@handle_service_errors
def get_patient_doctor(patient_id: str):
    patient = get_patient(patient_id)
    if not patient:
        return jsonify({"error": "Patient non trouvé"}), 404

    if not patient.get("doctor_id"):
        return jsonify({"message": "Aucun docteur assigné"}), 200

    doctor = get_doctor(str(patient["doctor_id"]))
    if not doctor:
        return jsonify({"error": "Docteur non trouvé"}), 404

    return jsonify(doctor)


@patient_bp.route('/<string:patient_id>/assign-doctor/<string:doctor_id>', methods=['POST'])
@handle_service_errors
def assign_doctor_to_patient(patient_id: str, doctor_id: str):
    assign_patient_to_doctor(patient_id, doctor_id)
    return jsonify({
        "message": "Docteur assigné avec succès",
        "patient_id": patient_id,
        "doctor_id": doctor_id
    })


@patient_bp.route('/<string:patient_id>/consultations', methods=['POST'])
@handle_service_errors
def create_patient_consultation(patient_id: str):
    data: Dict[str, Any] = request.json
    required_fields = ['doctor_id', 'date']

    if not all(field in data for field in required_fields):
        return jsonify({"error": "doctor_id et date requis"}), 400

    consultation_id = create_consultation(
        patient_id=patient_id,
        doctor_id=data['doctor_id'],
        date=data['date'],
        etat="demandée",
        description=data.get('description', "")
    )

    return jsonify({
        "message": "Consultation créée avec succès",
        "consultation_id": consultation_id
    }), 201