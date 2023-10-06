from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required
from dotenv import load_dotenv
import os

from .context import Context
from .strategies.content_based import ContentBasedRecommender
from .strategies.collaborative_based import CollaborativeFilteringRecommender
from .strategies.embedding_based import EmbeddingBasedRecommender
from .data_handler import fetch_user_data

# Load the .env file
load_dotenv()

context = Context(ContentBasedRecommender())


def configure_routes(app):

    @app.route('/recommend', methods=['GET'])
    @jwt_required()  # Protects the endpoint
    def recommend():
        user_id = request.args.get('user_id')
        strategy_type = request.args.get('strategy_type', 'content') # defaults to content if nothing is passed in
        # Fetch and preprocess user data
        user_data = fetch_user_data(user_id)
        if strategy_type == 'collaborative':
            context.set_strategy(CollaborativeFilteringRecommender())
        elif strategy_type == 'content':
            context.set_strategy(ContentBasedRecommender())
        elif strategy_type == 'embedding':
            context.set_strategy(EmbeddingBasedRecommender())
        
        recommendations = context.execute_strategy(user_data)
        return jsonify({"recommendations": recommendations})
