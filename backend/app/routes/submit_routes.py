from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from app.utils import get_db_connection
from psycopg2.extras import execute_values
import logging, re

submit_bp = Blueprint('submit', __name__)

@submit_bp.route('/pricing_form', methods=['POST'])
@jwt_required()
def pricing_form():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        data = request.json
        if not data or 'units' not in data:
            return jsonify({'error': 'Invalid input data'}), 400
        
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
                    unit.get('fantasyName'),
                    unit.get('companyName'),
                    re.sub(r'\D', '', unit.get('cnpj', '')),
                    unit.get('inep'),
                    re.sub(r'\D', '', unit.get('cep', '')),
                    unit.get('endereco'),
                    unit.get('cidade'),
                    unit.get('uf'),
                    unit.get('unitId')
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
                    unit.get('pricingId'),
                    unit.get('unitId'),
                    data.get('demandDate'),
                    data.get('pricingDate'),
                    unit.get('unitDataType'),
                    unit.get('studentsQtt'),
                    unit.get('ticketAvg'),
                    unit.get('tir0'),
                    unit.get('tir1'),
                    unit.get('tir2'),
                    unit.get('tir3'),
                    unit.get('tir4'),
                    unit.get('tir5'),
                    unit.get('tir6'),
                    data.get('pricingType'),
                    unit.get('executiveName'),
                    unit.get('discountPct'),
                    data.get('schoolID'),
                    unit.get('spcScore'),
                    data.get('riskAlert'),
                )
            )

        for unit in data['units']:
            if unit.get('unitDataType') == 'DETALHADO':
                records = [
                    (
                        unit.get('unitId'),
                        record.get('student_name'),
                        record.get('financial_resp'),
                        record.get('due_date'),
                        record.get('original_value'),
                        record.get('discount'),
                        record.get('payment_value'),
                        record.get('payment_date'),
                        record.get('year_ref')
                    )
                    for record in unit['unitData']
                ]

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

            elif unit.get('unitDataType') == 'CONSOLIDADO':
                records = [
                    (
                        unit.get('unitId'),
                        record.get('ref_date'),
                        record.get('tpv'),
                        record.get('unpaid_tpv')
                    )
                    for record in unit['unitData']
                ]

                execute_values(cur, """
                    INSERT INTO consolidated_financial_record (
                        id_unit,  
                        ref_date,
                        tpv,
                        unpaid_tpv
                    ) VALUES %s
                """, records)

        conn.commit()

        return jsonify({'status': 'success', 'message': 'Dados inseridos com sucesso'}), 200
    except Exception as e:
        logging.error(f"Error inserting data into the database: {e}")
        return jsonify({'error': 'Erro ao inserir dados no banco', 'message': str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
