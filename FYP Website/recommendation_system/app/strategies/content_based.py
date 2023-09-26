from .strategy_interface import RecommenderStrategy
import pickle
from itertools import groupby
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ContentBasedRecommender(RecommenderStrategy):
    def recommend(self, user_data):
        user_skills_dict, jobs_dict = self.preprocess_user_data(user_data)
        top_10_job_ids = self.get_top_recc(user_skills_dict, jobs_dict)
        return top_10_job_ids

    def preprocess_user_data(self, user_data):
        def get_jobs_dict():
            # TODO: change to relative path later on
            with open('/Users/chihui/Desktop/FYP/Final-Year-Project/FYP Website/recommendation_system/app/strategies/ml_data/content/content_jobs_data.pkl', 'rb') as handle:
                jobs_dict = pickle.load(handle)
            return jobs_dict
        # We don't want to recommend repeated jobs to user 
        exclude_jobs = user_data['jobids']
        jobs_dict = get_jobs_dict()
        # Filter out the unwanted job IDs when constructing the matrix
        jobs_dict = {key: val for key, val in jobs_dict.items() if key not in exclude_jobs}

        user_skills = user_data['data']
        user_skills.sort(key=lambda x: x['keyID'])
        filtered_user_skills = [next(g) for k, g in groupby(user_skills, key=lambda x: x['keyID'])]
        user_skills_dict = {skill['keyID']: skill['proficiency'] for skill in filtered_user_skills} # TODO: what happends if user has multiple levels of proficiency
        return user_skills_dict, jobs_dict
    
    def get_top_recc(self, user_skills_dict, jobs_dict):
        # Construct matrix
        # Convert dictionaries to vectors for calculation
        all_skills = set(user_skills_dict.keys()) | set(s for job_skills in jobs_dict.values() for s in job_skills.keys())
        user_vector = [user_skills_dict.get(skill, 0) for skill in all_skills]
        jobs_matrix = [[job_skills.get(skill, 0) for skill in all_skills] for job_skills in jobs_dict.values()]

        # Compute similarity scores
        similarities = cosine_similarity([user_vector], jobs_matrix)[0]

        # Get the top 10 job IDs based on similarity scores
        top_10_indices = np.argsort(similarities)[-10:][::-1]  # -10: gets the last 10 values, [::-1] reverses the array
        top_10_job_ids = [list(jobs_dict.keys())[i] for i in top_10_indices]
        print(top_10_job_ids)
        return top_10_job_ids

    