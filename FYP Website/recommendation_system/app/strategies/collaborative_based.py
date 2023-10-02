from .strategy_interface import RecommenderStrategy
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from collections import OrderedDict
from sklearn.preprocessing import StandardScaler
import pickle
import os

class CollaborativeFilteringRecommender(RecommenderStrategy):
    def __init__(self):
        self._initialize_data()
        self.top_n = 5

    def _initialize_data(self):
        # Define file paths as constants
        SKILLS_FILE_PATH = 'ml_data/collaborative/Skills Collaborative Filtering.csv'
        JOBS_FILE_PATH = 'ml_data/collaborative/Jobs Collaborative Filtering.csv'
        PICKLE_FILE_PATH = 'ml_data/collaborative/collaborative_jobs_data.pkl'

        # Construct absolute file paths
        script_directory = os.path.dirname(__file__)
        skills_file_path = os.path.join(script_directory, SKILLS_FILE_PATH)
        jobs_file_path = os.path.join(script_directory, JOBS_FILE_PATH)
        pickle_file_path = os.path.join(script_directory, PICKLE_FILE_PATH)

        # Load data
        self.df_skills = pd.read_csv(skills_file_path)
        self.df_jobs = pd.read_csv(jobs_file_path)
        with open(pickle_file_path, 'rb') as file:
            self.loaded_data = pickle.load(file)

    def recommend(self, user_data):
        try:
            user_df = self.preprocess_user_data(user_data)
            current_user_row = self.construct_matrix(user_df)
            recommended_job_ids = self.get_top_recc(current_user_row)
            # Implement the logic for collaborative filtering recommendation
            return recommended_job_ids
        except Exception as e:
            print(f"Error: {str(e)}")
            return []

    def preprocess_user_data(self, user_data):
        
        data = user_data['data']
        jobs = user_data['jobids']

        tsc_key_ids_set = set(self.df_skills['TSC Key ID'].values)
        jobs_ids_set = set(self.df_jobs['jobid'].values)

        result = {}
        for item in data:
            keyID = item['keyID']
            proficiency = item['proficiency']
            if keyID not in tsc_key_ids_set:
                continue
            if keyID not in result or proficiency > result[keyID]:
                result[keyID] = proficiency
        final_jobs = []
        for item in jobs:
            if item not in jobs_ids_set:
                continue
            final_jobs.append(item)

        final_data = {
            'Jobs': [final_jobs],
            'Skills': [result]
        }
        user_df = pd.DataFrame(final_data, columns=['Jobs', 'Skills'])
        return user_df

    def construct_matrix(self, user_df):
        df_skills = self.df_skills
        df_jobs = self.df_jobs

        # Create a user-job-skills matrix for input
        scaler = StandardScaler()
        df_skills['Z-Normalized'] = df_skills.groupby('TSC Key ID')['Proficiency Level'].transform(
            lambda x: scaler.fit_transform(x.values.reshape(-1, 1)).squeeze())

        # Create a user-item matrix for skills
        num_users = len(user_df)
        all_skills = df_skills['TSC Key ID'].unique()
        # skills_index_map = {skill: idx for idx, skill in enumerate(all_skills)} # Not important
        skills_matrix = pd.DataFrame(0.0, index=range(num_users), columns=all_skills)

        # Create a user-item matrix for jobs using df_jobs
        all_jobs = df_jobs['jobid'].unique()
        jobs_index_map = {idx: job for idx, job in enumerate(all_jobs)}  # maps index to jobs
        jobs_matrix = pd.DataFrame(0, index=range(num_users), columns=all_jobs)

        # Fill the skills and jobs matrices using the user's history
        for idx, row in user_df.iterrows():
            user_skills = row['Skills']
            user_jobs = row['Jobs']

            # Fill skills matrix
            for skill, proficiency in user_skills.items():
                # Using Z-normalized proficiency levels here, but you can adjust as needed
                skills_matrix.at[idx, skill] = df_skills[
                    (df_skills['TSC Key ID'] == skill) & (df_skills['Proficiency Level'] == proficiency)][
                    'Z-Normalized'].values[0]

            # Fill jobs matrix
            for job in user_jobs:
                jobs_matrix.at[idx, job] = 1

        # Concatenate the skills and jobs matrices
        current_user_row = pd.concat([jobs_matrix, skills_matrix], axis=1)

        current_user_row = current_user_row.values[0]

        return current_user_row

    def get_top_recc(self, current_user_row):
       
        all_jobs = self.df_jobs['jobid'].unique()

        loaded_data = self.loaded_data

        # Access the combined_matrix and jobs_index_map
        combined_matrix = loaded_data['combined_matrix']
        jobs_index_map = loaded_data['jobs_index_map']

        # Calculate cosine similarity between the current user and all other users
        user_similarity_scores = cosine_similarity([current_user_row], combined_matrix)

        # Sort users by similarity
        similar_users = np.argsort(user_similarity_scores[0])[::-1][1:]  # excludes the first user

        # Initialize an OrderedDict to collect recommended job indices
        recommended_job_indices = OrderedDict()

        # Recommend jobs based on similar users' history
        for user in similar_users:
            # Find jobs that the similar user has interacted with
            similar_user_jobs = combined_matrix[user, : len(all_jobs) + 1]  # Include only job columns
            # Filter jobs that the current user hasn't interacted with
            new_jobs_indices = np.where((similar_user_jobs > 0))
            # Update the OrderedDict with new job indices
            for idx in new_jobs_indices[0]:
                recommended_job_indices[idx] = None
            if len(recommended_job_indices) >= self.top_n:
                break

        # Convert the OrderedDict keys to a list of recommended job indices
        recommended_job_indices = list(recommended_job_indices.keys())

        # Map the indices directly to job IDs using the switched jobs_index_map
        recommended_job_ids = [jobs_index_map[idx] for idx in recommended_job_indices]

        # convert to python native int type
        recommended_job_ids = [int(id) for id in recommended_job_ids]

        # Now, you have a list of recommended job IDs
        return recommended_job_ids
