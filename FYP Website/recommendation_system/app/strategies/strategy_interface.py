from abc import ABC, abstractmethod

class RecommenderStrategy(ABC):
    @abstractmethod
    def recommend(self, user_id):
        pass
