from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
from app.routes import auth_bp, process_bp, main_bp, call_bp, submit_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(process_bp, url_prefix='/process')
    app.register_blueprint(main_bp, url_prefix='/')
    app.register_blueprint(call_bp, url_prefix='/call')
    app.register_blueprint(submit_bp, url_prefix='/submit')

    return app