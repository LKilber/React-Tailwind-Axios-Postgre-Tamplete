from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from app.utils import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        cpf = data.get('cpf')
        password = data.get('password')
        
        conn = get_db_connection()
        cur = conn.cursor()

        
        query = "SELECT * FROM users WHERE cpf = %s AND password = %s"
        cur.execute(query, (cpf, password))
        user = cur.fetchone()
        if user:
            colnames = [desc[0] for desc in cur.description]
            user_dict = dict(zip(colnames, user))

            cur.close()
            conn.close()

            access_token = create_access_token(identity={'user': user_dict})
            
            return jsonify({'token': access_token, 'user': user_dict}), 200
        else:
            cur.close()
            conn.close()
            return jsonify({'error': 'Credenciais inválidas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
