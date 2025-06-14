from .stacked_model import RatePrediction

predictor = RatePrediction()
predictor.load_model_and_data()

def fetch_prediction_data(location_name,drop_location=None):
    if drop_location and drop_location.strip():
        df = predictor.predict_customer(location_name, drop_location)
        if df is None or df.empty:
            return({'error': 'No data available for the given inputs'})
        
        df['hour'] = (df['original_time_after_pred'] // 60).astype(int)
        grouped_hourly = df.groupby('hour').agg({'pred_amt': 'min'}).reset_index()
        x = grouped_hourly['hour']
        y = grouped_hourly['pred_amt']
        df['minute'] = (df['original_time_after_pred'] // 5) * 5
        grouped_5min = df.groupby('minute').agg({'pred_amt': 'min'}).reset_index()
        min_row = grouped_5min.loc[grouped_5min['pred_amt'].idxmin()]
        return  ({
            'x': x.tolist(),
            'y': y.tolist(),
            'min_time': f"{int(min_row['minute'] // 60):02}:{int(min_row['minute'] % 60):02}",
            'min_price': float(min_row['pred_amt']),
            'drop_location': drop_location,
            'chart_type': 'min',
            'hourly_table': []
        })
    else:
        df = predictor.predict_driver(location_name)
        if df is None or df.empty:
            return  ({'error': 'No data available for the given inputs'} )
        df = df[['original_time_after_pred', 'pred_amt', 'drop_loc']]
        df['hour'] = (df['original_time_after_pred'] // 60).astype(int)
        grouped = df.groupby(['hour', 'drop_loc']).agg({'pred_amt': 'max'}).reset_index()
        max_rows = grouped.loc[grouped.groupby('hour')['pred_amt'].idxmax()]
        x = max_rows['hour']
        y = max_rows['pred_amt']
        reverse_drop_map = {v: k for k, v in predictor.drop_l.items()}
        max_row = max_rows.loc[max_rows['pred_amt'].idxmax()]
        hourly_table = []
        used_drop_locations = set()
        hours_sorted = sorted(max_rows['hour'].unique())
        grouped_sorted = grouped.sort_values('pred_amt', ascending=False)
        for hour in hours_sorted:
            hour_data = grouped_sorted[grouped_sorted['hour'] == hour]
            selected_drop = None
            selected_earning = 0
            for _, row in hour_data.iterrows():
                drop_loc_val = row['drop_loc']
                drop_name = reverse_drop_map.get(drop_loc_val, f"Loc {drop_loc_val}")
                if drop_name not in used_drop_locations:
                    selected_drop = drop_name
                    selected_earning = float(row['pred_amt'])
                    used_drop_locations.add(drop_name)
                    break
            if selected_drop is None:
                best_row = hour_data.iloc[0]
                selected_drop = reverse_drop_map.get(best_row['drop_loc'], f"Loc {best_row['drop_loc']}")
                selected_earning = float(best_row['pred_amt'])
            hourly_table.append({
                'hour': int(hour),
                'max_money': selected_earning,
                'drop_locations': [selected_drop]
            })
        return  ({
            'x': x.tolist(),
            'y': y.tolist(),
            'max_earning': float(max_row['pred_amt']),
            'best_drop': reverse_drop_map.get(max_row['drop_loc'], f"Loc {max_row['drop_loc']}"),
            'best_hour': int(max_row['hour']),
            'chart_type': 'max',
            'hourly_table': hourly_table
        })
if __name__ == "__main__":
    data=fetch_prediction_data("MG Road")
    from pprint import pprint 
    pprint(data)