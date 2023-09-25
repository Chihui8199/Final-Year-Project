from .strategies.strategy_interface import RecommenderStrategy

class Context:
    def __init__(self, strategy: RecommenderStrategy):
        self._strategy = strategy
    
    def set_strategy(self, strategy: RecommenderStrategy):
        self._strategy = strategy
    
    def execute_strategy(self, user_id):
        return self._strategy.recommend(user_id)
