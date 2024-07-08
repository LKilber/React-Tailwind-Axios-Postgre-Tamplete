from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import requests
from scripts.pricing import pricing, inadim_flow, roll

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "API Flask está funcionando"

@app.route('/api/pricing', methods=['POST'])
def excel_endpoint():
    try:
        if 'file' not in request.files:
            app.logger.error('Nenhum arquivo enviado')
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']

        if not file.filename.endswith(('.xlsx', '.xls')):
            app.logger.error('Formato de arquivo inválido')
            return jsonify({'error': 'Formato de arquivo inválido'}), 400

        app.logger.info('Processando o arquivo')
        df_pricing = pricing(file)
        df_inadim_flow = inadim_flow(file)
        df_roll = roll(file)

        json_pricing = df_pricing.to_dict(orient='records')
        json_inadim_flow = df_inadim_flow.to_dict(orient='records')
        json_roll = df_roll.to_dict(orient='records')

        return jsonify({'pricing': json_pricing, 'inadim_flow': json_inadim_flow, 'roll': json_roll, 'status': 'success'})
    
    except Exception as e:
        app.logger.error('Erro ao processar o arquivo: %s', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/fetch_cnpj_data/<cnpj>')
def fetch_cnpj_data(cnpj):
    url = f"https://www.receitaws.com.br/v1/cnpj/{cnpj}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise HTTPError for bad responses
        data = response.json()
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        app.logger.error('Erro ao buscar dados do CNPJ: %s', str(e))
        return jsonify({'error': 'Erro ao buscar dados do CNPJ', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
