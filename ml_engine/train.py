import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import joblib
import os

def load_data(data_dir):
    print("Loading datasets...")
    transactions_path = os.path.join(data_dir, 'transactions.csv')
    
    if not os.path.exists(transactions_path):
        print(f"Dataset not found at {data_dir}. Please ensure transactions.csv exists.")
        return None
        
    df = pd.read_csv(transactions_path)
    return df

def feature_engineering(df):
    print("Performing feature engineering...")
    # Mocking 'Transaction Velocity' and 'Distance from Home' if they don't exist
    # Realistically, velocity is computed by grouping user_id and timestamp
    
    if 'transaction_velocity' not in df.columns:
        # Generate synthetic velocity based on amount and label (fraudsters have higher velocity)
        np.random.seed(42)
        df['transaction_velocity'] = np.where(df['is_fraud'] == 1, 
                                              np.random.normal(15, 5, len(df)), 
                                              np.random.normal(2, 1, len(df)))
        df['transaction_velocity'] = np.clip(df['transaction_velocity'], 1, 50).astype(int)

    if 'distance_from_home' not in df.columns:
        # Generate synthetic distance
        df['distance_from_home'] = np.where(df['is_fraud'] == 1, 
                                            np.random.normal(500, 200, len(df)), 
                                            np.random.normal(10, 5, len(df)))
        df['distance_from_home'] = np.clip(df['distance_from_home'], 0, 10000)
    
    if 'amount' not in df.columns:
        df['amount'] = np.random.normal(1000, 500, len(df))
        df['amount'] = np.clip(df['amount'], 10, 100000)

    # Fill NaNs
    df.fillna(0, inplace=True)
    
    features = ['amount', 'transaction_velocity', 'distance_from_home']
    X = df[features]
    y = df['is_fraud']
    
    return X, y, features

def train_models():
    data_dir = '../dataset'
    df = load_data(data_dir)
    
    if df is None:
        return
        
    if 'is_fraud' not in df.columns:
        # if 'is_fraud' label column is named differently, handle it
        # let's assume it's 'is_fraud' for now.
        print("Label column 'is_fraud' not found. Please check data_dictionary.csv")
        return

    X, y, feature_names = feature_engineering(df)
    
    print(f"Original dataset shape: {X.shape}, Fraud cases: {sum(y==1)}")
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    print("Applying SMOTE...")
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
    print(f"Resampled dataset shape: {X_train_res.shape}, Fraud cases: {sum(y_train_res==1)}")
    
    print("Training Random Forest...")
    rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    rf.fit(X_train_res, y_train_res)
    
    print("Training Isolation Forest...")
    # Isolation forest is trained only on normal data (unsupervised anomaly detection)
    X_normal = X_train[y_train == 0]
    iso_forest = IsolationForest(n_estimators=100, contamination=0.01, random_state=42, n_jobs=-1)
    iso_forest.fit(X_train_res) # or X_normal depending on preference, fit on all for generalized anomaly
    
    # Save models
    print("Saving models...")
    os.makedirs('models', exist_ok=True)
    joblib.dump(rf, 'models/random_forest.pkl')
    joblib.dump(iso_forest, 'models/isolation_forest.pkl')
    joblib.dump(feature_names, 'models/feature_names.pkl')
    
    print("Training complete.")

if __name__ == '__main__':
    train_models()
