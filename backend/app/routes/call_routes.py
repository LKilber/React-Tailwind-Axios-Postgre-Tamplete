from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils import get_db_connection
import requests

cnpj_call_bp = Blueprint('cnpj_call', __name__)
pricing_call_bp = Blueprint('pricing_call', __name__)

@cnpj_call_bp.route('/cnpj_data/<cnpj>')
def cnpj_data(cnpj):
    print(cnpj)
    url = f"https://www.receitaws.com.br/v1/cnpj/{cnpj}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Erro ao buscar dados do CNPJ', 'message': str(e)}), 500

@pricing_call_bp.route('/pricing_data/<school_name>')
@jwt_required()
def pricing_data(school_name):
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = "SELECT * FROM school WHERE school_name ILIKE %s"
        cur.execute(query, ('%' + school_name + '%',))
        rows = cur.fetchall()

        column_names = [desc[0] for desc in cur.description]

        data = [dict(zip(column_names, row)) for row in rows]

        cur.close()
        conn.close()

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': 'Erro ao buscar dados', 'message': str(e)}), 500