from flask import Blueprint, request, jsonify
from werkzeug.exceptions import Unauthorized, BadRequest
from BackEnd.Services.AuthService import hash_password,verify_password  # Assuming you have this
from BackEnd.Services.db import mongo

auth_route = Blueprint('auth', __name__)


@auth_route.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('mot_de_passe')  # or 'password' depending on your field name

        if not email or not password:
            raise BadRequest("Email and password are required")

        # Check all user collections
        user_collections = [
            ('patient', mongo.db.patients),
            ('doctor', mongo.db.doctors),
            ('admin', mongo.db.admins)
        ]

        for role, collection in user_collections:
            user = collection.find_one({"email": email})
            if user:


                # Verify the hashed password

                print(user)
                print(password)
                print(verify_password(user.get('mot_de_passe'), password))
                if verify_password(user.get('mot_de_passe'), password):
                    # Convert ObjectId to string and prepare response
                    user['_id'] = str(user['_id'])
                    user['role'] = role

                    # Remove sensitive data before returning
                    user.pop('mot_de_passe', None)
                    user.pop('password', None)

                    return jsonify(user)

        # If we get here, no valid user was found
        raise Unauthorized("Invalid email or password")

    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Unauthorized as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500