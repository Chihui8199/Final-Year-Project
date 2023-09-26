from .strategy_interface import RecommenderStrategy
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from collections import OrderedDict
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import pickle

class CollaborativeFilteringRecommender(RecommenderStrategy):
    def recommend(self, user_data):
        # TODO: No user history for other sectorrs so exclude all jobs if user has history in one sector
        user_df = self.preprocess_user_data(user_data)
        current_user_row = self.construct_matrix(user_df)
        recommended_job_ids = self.get_top_recc(current_user_row)
        # Implement the logic for collaborative filtering recommendation
        return f"Collaborative filtering recommendations for user {recommended_job_ids}"
    
    def preprocess_user_data(self, user_data):
        data = user_data['data']
        jobs = user_data['jobids']
        # TODO:Takes the maxProficiency if there are duplicate keys   
        result = {}
        for item in data:
            keyID = item['keyID']
            proficiency = item['proficiency']
            if keyID not in result or proficiency > result[keyID]:
                result[keyID] = proficiency
        final_data = {
            'Jobs': [jobs], 
            'Skills': [result]
        }
        user_df = pd.DataFrame(final_data, columns=['Jobs', 'Skills'])
        return user_df

    def construct_matrix(self, user_df):
        df_skills = pd.read_csv('/Users/chihui/Desktop/FYP/Final-Year-Project/FYP Website/recommendation_system/app/strategies/ml_data/collaborative/Skills Collaborative Filtering.csv')
        df_jobs = pd.read_csv('/Users/chihui/Desktop/FYP/Final-Year-Project/FYP Website/recommendation_system/app/strategies/ml_data/collaborative/Jobs Collaborative Filtering.csv')
        
        # Create a user-job-skills matrix for input
        scaler = StandardScaler()
        df_skills['Z-Normalized'] = df_skills.groupby('TSC Key ID')['Proficiency Level'].transform(lambda x: scaler.fit_transform(x.values.reshape(-1,1)).squeeze())
        # Assuming user_df is your user data DataFrame and df_jobs is your jobs data DataFrame

        # Create a user-item matrix for skills
        num_users = len(user_df)
        all_skills = df_skills['TSC Key ID'].unique()
        #skills_index_map = {skill: idx for idx, skill in enumerate(all_skills)} # Not important
        skills_matrix = pd.DataFrame(0.0, index=range(num_users), columns=all_skills)

        # Create a user-item matrix for jobs using df_jobs
        all_jobs = df_jobs['jobid'].unique()
        jobs_index_map = {idx: job for idx, job in enumerate(all_jobs)} # maps index to jobs
        jobs_matrix = pd.DataFrame(0, index=range(num_users), columns=all_jobs)

        # Fill the skills and jobs matrices using the user's history
        for idx, row in user_df.iterrows():
            user_skills = row['Skills']
            user_jobs = row['Jobs']

            # Fill skills matrix
            for skill, proficiency in user_skills.items():
                # Using Z-normalized proficiency levels here, but you can adjust as needed
                skills_matrix.at[idx, skill] = df_skills[(df_skills['TSC Key ID'] == skill) & (df_skills['Proficiency Level'] == proficiency)]['Z-Normalized'].values[0]

            # Fill jobs matrix
            for job in user_jobs:
                jobs_matrix.at[idx, job] = 1

        # Concatenate the skills and jobs matrices
        current_user_row = pd.concat([jobs_matrix, skills_matrix], axis=1)

        current_user_row = current_user_row.values[0]

        return current_user_row

    def get_top_recc(self, current_user_row):
        # Load the data from the pickle file
        # TODO: change to relative path
        # TODO: for now
        df_jobs = pd.read_csv('/Users/chihui/Desktop/FYP/Final-Year-Project/FYP Website/recommendation_system/app/strategies/ml_data/collaborative/Jobs Collaborative Filtering.csv')

        all_jobs = df_jobs['jobid'].unique()


        with open('/Users/chihui/Desktop/FYP/Final-Year-Project/FYP Website/recommendation_system/app/strategies/ml_data/collaborative/collaborative_jobs_data.pkl', 'rb') as file:
            loaded_data = pickle.load(file)

        # Access the combined_matrix and jobs_index_map
        combined_matrix = loaded_data['combined_matrix']
        jobs_index_map = loaded_data['jobs_index_map']

        # Calculate cosine similarity between the current user and all other users
        user_similarity_scores = cosine_similarity([current_user_row], combined_matrix)

        # Sort users by similarity
        similar_users = np.argsort(user_similarity_scores[0])[::-1][1:] # excludes the first user

        # Initialize an OrderedDict to collect recommended job indices
        recommended_job_indices = OrderedDict()

        # Recommend jobs based on similar users' history
        for user in similar_users:
            # Find jobs that the similar user has interacted with
            similar_user_jobs = combined_matrix[user, : len(all_jobs)+1]  # Include only job columns
            # Filter jobs that the current user hasn't interacted with
            new_jobs_indices = np.where((similar_user_jobs > 0))
            # Update the OrderedDict with new job indices
            for idx in new_jobs_indices[0]:
                recommended_job_indices[idx] = None
            # You can break after collecting a certain number of recommendations, e.g., 5
            if len(recommended_job_indices) >= 5:
                break

        # Convert the OrderedDict keys to a list of recommended job indices
        recommended_job_indices = list(recommended_job_indices.keys())

        # Map the indices directly to job IDs using the switched jobs_index_map
        recommended_job_ids = [jobs_index_map[idx] for idx in recommended_job_indices]

        # Now, you have a list of recommended job IDs
        return recommended_job_ids
