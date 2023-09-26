from .strategy_interface import RecommenderStrategy
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


class EmbeddingBasedRecommender(RecommenderStrategy):
    def recommend(self, user_data):
        user_job_ids = user_data['jobids']
        # Load the DataFrame from the pickle file
        result_df = pd.read_pickle("/Users/chihui/Desktop/FYP/Final-Year-Project/FYP Website/recommendation_system/app/strategies/ml_data/embedding/embedding_recommendation.pkl")
        user_embeddings_list = result_df[result_df['jobid'].isin(user_job_ids)]['weighted_embedding'].tolist()

        similarities = [
            {
                'JobID': row['jobid'],
                'Similarity': round(np.mean([cosine_similarity(user_embedding.reshape(1, -1), row['weighted_embedding'].reshape(1, -1))[0][0] for user_embedding in user_embeddings_list]), 3)
            }
            for index, row in result_df.iterrows()
        ]

        # Sorting the similarities
        sorted_similarities = sorted(similarities, key=lambda x: x['Similarity'], reverse=True)
        # Retrive top 10
        top_10_job_ids = [item['JobID'] for item in sorted_similarities[:10]]
        return top_10_job_ids
        
