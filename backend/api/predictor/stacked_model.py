import os
import pickle
import joblib
import numpy as np
import pandas as pd
import warnings
warnings.simplefilter(action='ignore') #I was getting xgboost future update..so
class RatePrediction:
    def __init__(self):
        self.model = None
        self.data = None
        self.pickup_l = None
        self._processed_data = {}

    def load_model_and_data(self):
        # Use the path relative to this script (post_processor.py)
        base_dir = os.path.dirname(__file__)  # This gets path to predictor/
        pickle_dir = os.path.join(base_dir, 'pickle_models')
        with open(os.path.join(pickle_dir, 'Stacked_model_fast.pkl'), 'rb') as f:
            self.model = joblib.load(f)
        with open(os.path.join(pickle_dir, 'input_data.pkl'), 'rb') as f:
            self.data = pickle.load(f)
        with open(os.path.join(pickle_dir, 'pickup_l1.pkl'), 'rb') as f:
            self.pickup_l = pickle.load(f)
        with open(os.path.join(pickle_dir, 'drop_loc.pkl'), 'rb') as f:
            self.drop_l = pickle.load(f)

    def predict_driver(self, hooked_up_loc):
        if self.model is None:
            print("your fucking model is not loaded")
            return[]
        df = self.data[self.data['pickup_loc']==self.pickup_l[hooked_up_loc]].copy()
        slots = []
        for drop_loc in df['drop_loc'].unique():
            for dist in df[df['drop_loc'] == drop_loc]['distance'].unique():
                        for t in range(0, 1440, 5):
                            slots.append({
                                'pickup_loc': self.pickup_l[hooked_up_loc],
                                'drop_loc': drop_loc,
                                'distance': dist,
                                'pickup_time_sin': np.sin(2 * np.pi * t / 1440),
                                'pickup_time_cos': np.cos(2 * np.pi * t / 1440),
                              
                            })
                                
        df_slots = pd.DataFrame(slots)
        df_slots['pred_amt'] = self.model.predict(df_slots)
        df_slots['original_time_after_pred'] = (
            np.arctan2(df_slots['pickup_time_sin'], df_slots['pickup_time_cos']) * (1440 / (2 * np.pi))
        )%1440
        self._processed_data[hooked_up_loc] = df_slots
    
        return df_slots
    def predict_customer(self, hooked_up_loc,drop_loc):
        if self.model is None:
            print("your fucking model is not loaded")
            return[]
        df = self.data[(self.data['pickup_loc']==self.pickup_l[hooked_up_loc]) & (self.data['drop_loc']==self.drop_l[drop_loc])].copy()
        slots = []
        for dist in df['distance'].unique():
                        for t in range(0, 1440, 5):
                            slots.append({
                                'pickup_loc': self.pickup_l[hooked_up_loc],
                                'drop_loc': self.drop_l[drop_loc],
                                'distance': dist,
                                'pickup_time_sin': np.sin(2 * np.pi * t / 1440),
                                'pickup_time_cos': np.cos(2 * np.pi * t / 1440),
                              
                            })
                                
        df_slots = pd.DataFrame(slots)
        df_slots['pred_amt'] = self.model.predict(df_slots)
        df_slots['original_time_after_pred'] = (
            np.arctan2(df_slots['pickup_time_sin'], df_slots['pickup_time_cos']) * (1440 / (2 * np.pi))
        )%1440
        self._processed_data[hooked_up_loc] = df_slots
        return df_slots