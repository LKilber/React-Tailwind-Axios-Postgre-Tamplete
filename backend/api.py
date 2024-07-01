# backend_flask/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import io
import pandas as pd
from scripts.pricing import pricing, inadim_flow, roll

app = Flask(__name__)
CORS(app) 

@app.route('/api/pricing', methods=['POST'])
def excel_endpoint():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']

        if not file.filename.endswith(('.xlsx', '.xls')):
            return jsonify({'error': 'Formato de arquivo inválido'}), 400

        df_pricing = pricing(file)
        df_inadim_flow = inadim_flow(file)
        df_roll = roll(file)

        json_pricing = df_pricing.to_dict(orient='records')
        json_inadim_flow = df_inadim_flow.to_dict(orient='records')
        json_roll = df_roll.to_dict(orient='records')

        return jsonify({'pricing': json_pricing, 'inadim_flow': json_inadim_flow, 'roll': json_roll, 'status': 'success'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
