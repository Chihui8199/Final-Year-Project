from .strategy_interface import RecommenderStrategy
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class EmbeddingBasedRecommender(RecommenderStrategy):
    # Define the path to the pickle file relative to the current script
    pickle_file_path = "app/strategies/ml_data/embedding/embedding_recommendation.pkl"

    def recommend(self, user_data):
        try:
            user_job_ids = user_data['jobids']

            # Load the DataFrame from the pickle file using a relative path
            result_df = pd.read_pickle(self.pickle_file_path)

            user_embeddings_list = result_df[result_df['jobid'].isin(user_job_ids)]['weighted_embedding'].tolist()

            top_10_job_ids = self.generate_recommendations(user_embeddings_list, result_df)
            return top_10_job_ids
        except:
            return []

    def calculate_similarity(self, user_embeddings_list, job_embedding):
        return np.mean([cosine_similarity(user_embedding.reshape(1, -1), job_embedding.reshape(1, -1))[0][0] for user_embedding in user_embeddings_list])

    def generate_recommendations(self, user_embeddings_list, result_df):
        similarities = [
            {
                'JobID': row['jobid'],
                'Similarity': round(self.calculate_similarity(user_embeddings_list, row['weighted_embedding']), 3)
            }
            for _, row in result_df.iterrows()
        ]

        # Sorting the similarities
        sorted_similarities = sorted(similarities, key=lambda x: x['Similarity'], reverse=True)
        # Retrieve the top 10
        top_10_job_ids = [item['JobID'] for item in sorted_similarities[:10]]
        return top_10_job_ids
