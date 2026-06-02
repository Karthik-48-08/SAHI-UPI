import sys
import json
import joblib
import os
import pandas as pd
import numpy as np

def calculate_ensemble_risk(rf_prob, iso_score):
    # rf_prob is probability of fraud (0 to 1)
    # iso_score is anomaly score (-1 for anomaly, 1 for normal). 
    # We can normalize iso_score: map [-1, 1] to [1, 0] anomaly probability
    iso_prob = (1 - iso_score) / 2
    
    # Weighting strategy: Give more weight to RF for specific known fraud, and use IF for general anomalies.
    # We need high recall, low FP.
    combined_risk = (0.7 * rf_prob) + (0.3 * iso_prob)
    return combined_risk

def main():
    # Load models
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    try:
        rf_model = joblib.load(os.path.join(models_dir, 'random_forest.pkl'))
        iso_model = joblib.load(os.path.join(models_dir, 'isolation_forest.pkl'))
        feature_names = joblib.load(os.path.join(models_dir, 'feature_names.pkl'))
    except Exception as e:
        print(json.dumps({"error": f"Failed to load models: {str(e)}"}), flush=True)
        return

    # Read lines from stdin
    for line in sys.stdin:
        try:
            data = json.loads(line)
            # Ensure the features are in the expected order
            df = pd.DataFrame([data])
            X = df[feature_names]
            
            # Predict
            rf_prob = rf_model.predict_proba(X)[0][1] # probability of class 1
            iso_score = iso_model.decision_function(X)[0] # anomaly score
            
            risk_score = calculate_ensemble_risk(rf_prob, iso_score)
            
            is_fraud = bool(risk_score > 0.5)
            
            result = {
                "transaction_id": data.get("transaction_id", "unknown"),
                "risk_score": float(risk_score),
                "is_fraud": is_fraud,
                "rf_prob": float(rf_prob),
                "iso_score": float(iso_score)
            }
            
            print(json.dumps(result), flush=True)
            
        except Exception as e:
            print(json.dumps({"error": str(e)}), flush=True)

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    main()
