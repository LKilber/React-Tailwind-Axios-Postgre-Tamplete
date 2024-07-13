from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
from app.routes import auth_bp, pricing_bp, main_bp, cnpj_call_bp, pricing_call_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(pricing_bp, url_prefix='/process')
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(cnpj_call_bp, url_prefix='/call')
    app.register_blueprint(pricing_call_bp, url_prefix='/call')

    return app