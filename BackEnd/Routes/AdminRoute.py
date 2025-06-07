from bson import ObjectId
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from BackEnd.Services.AdminService import create_admin
from BackEnd.Services import db as db_services
from BackEnd.Services.DocteurService import create_doctor, create_doctor_nohash
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route('/patients', methods=['GET'])
def get_all_patients():

    try:
        # In a real implementation, you would check admin privileges here
        # For example: if not current_user.is_admin: return forbidden()

        patients = list(db_services.mongo.db.patients.find({}))

        # Convert ObjectId to string and format the response
        formatted_patients = []
        for patient in patients:
            patient['_id'] = str(patient['_id'])
            if 'doctor_id' in patient:
                patient['doctor_id'] = str(patient['doctor_id'])
            formatted_patients.append(patient)

        return jsonify(formatted_patients), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/doctors', methods=['GET'])
def get_all_doctors():

    try:
        # Check admin privileges here

        doctors = list(db_services.mongo.db.doctors.find({}))

        formatted_doctors = []
        for doctor in doctors:
            doctor['_id'] = str(doctor['_id'])
            if 'patient_ids' in doctor:
                doctor['patient_ids'] = [str(pid) for pid in doctor['patient_ids']]
            formatted_doctors.append(doctor)

        return jsonify(formatted_doctors), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@admin_bp.route('/pending-doctors', methods=['GET'])
def get_pending_doctors():
    try:
        pending = list(db_services.mongo.db.pending_doctors.find({}))
        for doc in pending:
            doc['_id'] = str(doc['_id'])
        return jsonify(pending), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/review-doctor/<doctor_id>', methods=['POST'])
def review_doctor(doctor_id):
    try:
        action = request.json.get("action")
        admin_id = request.json.get("admin_id")
        reason = request.json.get("reason", "No reason provided")

        # Validate admin
        if not admin_id:
            return jsonify({"error": "Admin ID is required"}), 400
        try:
            admin_obj_id = ObjectId(admin_id)
        except:
            return jsonify({"error": "Invalid admin ID format"}), 400
        if not db_services.mongo.db.admins.find_one({"_id": admin_obj_id}):
            return jsonify({"error": "Admin not found"}), 404

        # Get doctor request
        doctor = db_services.mongo.db.pending_doctors.find_one({"_id": ObjectId(doctor_id)})
        if not doctor:
            return jsonify({"error": "Doctor not found"}), 404

        # Cleanup data
        doctor.pop('_id', None)
        doctor.pop('status', None)
        timestamp = datetime.utcnow().isoformat()
        admin_id_str = str(admin_obj_id)

        if action == "approve":

            # Check email uniqueness
            if db_services.mongo.db.doctors.find_one({"email": doctor['email']}):
                return jsonify({"error": "Email already in use by a doctor"}), 400
            if db_services.mongo.db.patients.find_one({"email": doctor['email']}):
                return jsonify({"error": "Email already in use by a patient"}), 400
            print(doctor)



            new_id = create_doctor_nohash(doctor)

            # Neo4j relationship
            with db_services.neo4j_driver.session() as session:
                session.run("""
                    MERGE (a:Admin {id: $admin_id})
                    WITH a
                    MATCH (d:Doctor {email: $email})
                    CREATE (a)-[:APPROVED {at: datetime($timestamp)}]->(d)
                """, {
                    "admin_id": admin_id_str,
                    "email": doctor['email'],
                    "timestamp": timestamp
                })

            message = f"Doctor approved with id {new_id}"

        elif action == "reject":
            # Rejection logic (unchanged)
            doctor['rejected_by'] = admin_id_str
            doctor['rejected_at'] = timestamp
            doctor['rejection_reason'] = reason
            db_services.mongo.db.rejected_doctors.insert_one(doctor)

            with db_services.neo4j_driver.session() as session:
                session.run("""
                    MERGE (a:Admin {id: $admin_id})
                    CREATE (d:RejectedDoctor {email: $email, nom: $nom, prenom: $prenom})
                    CREATE (a)-[:REJECTED {at: datetime($timestamp), reason: $reason}]->(d)
                """, {
                    "admin_id": admin_id_str,
                    "email": doctor['email'],
                    "nom": doctor['nom'],
                    "prenom": doctor['prenom'],
                    "timestamp": timestamp,
                    "reason": reason
                })

            message = "Doctor rejected and logged"
        else:
            return jsonify({"error": "Invalid action"}), 400

        # Cleanup pending request
        db_services.mongo.db.pending_doctors.delete_one({"_id": ObjectId(doctor_id)})
        return jsonify({"message": message}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
@admin_bp.route('/create-admin', methods=['POST'])
def add_admin():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Verify admin privileges (uncomment when auth is implemented)
        # if not current_user.is_admin:
        #     return jsonify({"error": "Unauthorized"}), 403

        # Create admin using your service function
        admin_id = create_admin(data)

        return jsonify({
            "message": "Admin created successfully",
            "admin_id": admin_id
        }), 201

    except ValueError as e:
        # Handle validation errors from create_admin
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500