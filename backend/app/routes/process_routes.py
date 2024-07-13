from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.services.pricing_service import process_pricing_file

pricing_bp = Blueprint('process', __name__)

@pricing_bp.route('/pricing', methods=['POST'])
@jwt_required()
def pricing():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']

        if not file.filename.endswith(('.xlsx', '.xls')):
            return jsonify({'error': 'Formato de arquivo inválido'}), 400

        result = process_pricing_file(file)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
