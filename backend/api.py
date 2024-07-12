from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import requests
from scripts.pricing import pricing, inadim_flow, roll
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
jwt = JWTManager(app)

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            dbname=os.getenv('DB_NAME')
        )
        return conn
    except Exception as e:
        app.logger.error('Erro ao conectar ao banco de dados: %s', str(e))
        raise

@app.route('/')
def index():
    return "API Flask está funcionando"

@app.route('/api/pricing', methods=['POST'])
@jwt_required()
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
@jwt_required()
def fetch_cnpj_data(cnpj):
    url = f"https://www.receitaws.com.br/v1/cnpj/{cnpj}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        app.logger.error('Erro ao buscar dados do CNPJ: %s', str(e))
        return jsonify({'error': 'Erro ao buscar dados do CNPJ', 'message': str(e)}), 500

@app.route('/api/fetch_school_name/<school_name>')
@jwt_required()
def fetch_school_name(school_name):
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

@app.route('/api/submit_pricing_form', methods=['POST'])
@jwt_required()
def submit_pricing_form():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        data = request.json
        
        for unit in data['units']:
            print(unit['unitDataType'])
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

            elif unit['unitDataType'] == 'CONSOLIDADO':
                records = []
                for record in unit['unitData']:
                    records.append((
                        unit['unitId'],
                        record['ref_date'],
                        record['tpv'],
                        record['unpaid_tpv']
                    ))
                
                execute_values(cur, """
                    INSERT INTO consolidated_financial_record (
                        id_unit,  
                        ref_date,
                        tpv,
                        unpaid_tpv
                    ) VALUES %s
                """, records)

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'status': 'success', 'message': 'Dados inseridos com sucesso'}), 200
    except Exception as e:
        app.logger.error('Erro ao inserir dados no banco: %s', str(e))
        return jsonify({'error': 'Erro ao inserir dados no banco', 'message': str(e)}), 500

@app.route('/api/get_pricing_data', methods=['GET'])
@jwt_required()
def get_pricing_data():
    school_name = request.args.get('school_name', '')

    if not school_name:
        return jsonify({'error': 'No school name provided'}), 400

    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            query = """
                SELECT * FROM school
                JOIN pricing ON school.id_unit = pricing.id_unit
                WHERE school_name ILIKE %s
            """
            cur.execute(query, ('%' + school_name + '%',))
            rows = cur.fetchall()

            column_names = [desc[0] for desc in cur.description]
            data = [dict(zip(column_names, row)) for row in rows]

        conn.close()

        return jsonify(data)
    except Exception as e:
        return jsonify({'error': 'Erro ao buscar dados', 'message': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = get_db_connection()
        cur = conn.cursor()

        query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cur.execute(query, (username, password))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if user:
            access_token = create_access_token(identity={'username': username})
            return jsonify({'token': access_token}), 200
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
    except Exception as e:
        app.logger.error('Erro ao processar login: %s', str(e))
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
