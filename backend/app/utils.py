import psycopg2
from flask import current_app

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=current_app.config['DB_HOST'],
            port=current_app.config['DB_PORT'],
            user=current_app.config['DB_USER'],
            password=current_app.config['DB_PASSWORD'],
            dbname=current_app.config['DB_NAME']
        )
        return conn
    except Exception as e:
        current_app.logger.error('Erro ao conectar ao banco de dados: %s', str(e))
        raise
