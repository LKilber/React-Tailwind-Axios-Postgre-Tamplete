import logging
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from app.utils import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        cpf = data.get('cpf')
        password = data.get('password')

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                query = "SELECT * FROM users WHERE cpf = %s"
                cur.execute(query, (cpf,))
                user = cur.fetchone()
                
                if user:
                    colnames = [desc[0] for desc in cur.description]
                    user_dict = dict(zip(colnames, user))
                    
                    if check_password_hash(user_dict['password'], password):
                        access_token = create_access_token(identity={'user': user_dict})
                        return jsonify({'token': access_token, 'user': user_dict}), 200
                    else:
                        return jsonify({'error': 'Credenciais inválidas'}), 401
                else:
                    return jsonify({'error': 'Credenciais inválidas'}), 401
    except Exception as e:
        logging.error(f"Erro ao tentar logar: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        cpf = data.get('cpf')
        password = data.get('password')
        email = data.get('email')
        sector = data.get('sector')
        level = data.get('level')
        name = data.get('name')
        role = data.get('role')
        hashed_password = generate_password_hash(password)

        with get_db_connection() as conn:
            with conn.cursor() as cur:
                query = """
                INSERT INTO users (cpf, password, email, sector, level, name, role)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """
                cur.execute(query, (cpf, hashed_password, email, sector, level, name, role))
                conn.commit()

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        logging.error(f"Erro ao registrar usuário: {str(e)}")
        return jsonify({'error': str(e)}), 500
