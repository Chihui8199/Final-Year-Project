from flask import Flask 
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from app.routes import  configure_routes

app = Flask(__name__)
 # Set the JWT secret key
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET')  # Ensure this is a secure key in production
jwt = JWTManager(app)
configure_routes(app)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
