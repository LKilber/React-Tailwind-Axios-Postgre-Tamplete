from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import requests
from scripts.pricing import pricing, inadim_flow, roll
import psycopg2
from psycopg2.extras import execute_values


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

@app.route('/api/submit_pricing_form', methods=['POST'])
def submit_pricing_form():
    database_credentials = {
        'host': 'supabase.scio.site',
        'port': '5432',
        'user': 'precificacao',
        'password': 'precificacao@2024',
        'dbname': 'postgres'
    }

    conn_string = "host={host} port={port} dbname={dbname} user={user} password={password}".format(
        host=database_credentials['host'],
        port=database_credentials['port'],
        dbname=database_credentials['dbname'],
        user=database_credentials['user'],
        password=database_credentials['password']
    )

    try:
        conn = psycopg2.connect(conn_string)
        cur = conn.cursor()

        data = request.json
        
        for unit in data['units']:
            cur.execute(
                """
                INSERT INTO school (
                    id_school, 
                    school_name, 
                    fantasy_name, 
                    company_name, 
                    cnpj, 
                    inep, 
                    cep,
                    address,
                    city,
                    uf,
                    id_unit
                ) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    data['schoolID'],
                    data['schoolName'],
                    unit['fantasyName'],
                    unit['companyName'],
                    unit['cnpj'],
                    unit['inep'],
                    unit['cep'],
                    unit['endereco'],
                    unit['cidade'],
                    unit['uf'],
                    unit['unitId']
                )
            )

        for unit in data['units']:
            cur.execute(
                """
                INSERT INTO pricing (
                    id_pricing, 
                    id_unit,  
                    demand_date, 
                    pricing_date, 
                    financial_data_type, 
                    students_qtt, 
                    avg_ticket,
                    tir0,
                    tir1,
                    tir2,
                    tir3,
                    tir4,
                    tir5,
                    tir6,
                    grouped_pricing,
                    executive,
                    discount,
                    id_school,
                    spc_score,
                    risk_level
                ) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    unit['pricingId'],
                    unit['unitId'],
                    data['demandDate'],
                    data['pricingDate'],
                    unit['unitDataType'],
                    unit['studentsQtt'],
                    unit['ticketAvg'],
                    unit['tir0'],
                    unit['tir1'],
                    unit['tir2'],
                    unit['tir3'],
                    unit['tir4'],
                    unit['tir5'],
                    unit['tir6'],
                    data['pricingType'],
                    unit['executiveName'],
                    unit['discountPct'],
                    data['schoolID'],
                    unit['spcScore'],
                    data['riskAlert'],
                )
            )

        for unit in data['units']:
            if unit['unitDataType'] == 'DETALHADO':
                records = []
                for record in unit['unitData']:
                    records.append((
                        unit['unitId'],
                        record['student_name'],
                        record['financial_resp'],
                        record['due_date'],
                        record['original_value'],
                        record['discount'],
                        record['payment_value'],
                        record['payment_date'],
                        record['year_ref']
                    ))

                execute_values(cur, """
                    INSERT INTO detailed_financial_record (
                        id_unit,  
                        student_name,
                        financial_resp,
                        due_date,
                        original_value,
                        discount,
                        payment_value,
                        payment_date,
                        year_ref
                    ) VALUES %s
                """, records)

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'status': 'success', 'message': 'Dados inseridos com sucesso'}), 200
    except Exception as e:
        app.logger.error('Erro ao inserir dados no banco: %s', str(e))
        return jsonify({'error': 'Erro ao inserir dados no banco', 'message': str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
