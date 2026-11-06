import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report, roc_curve
)
from sklearn.ensemble import RandomForestClassifier, IsolationForest
import xgboost as xgb
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def load_and_preprocess_data(dataset_dir):
    print("-> Loading dataset from:", dataset_dir)
    tx_path = os.path.join(dataset_dir, 'transactions.csv')
    users_path = os.path.join(dataset_dir, 'users.csv')
    
    if not os.path.exists(tx_path):
        raise FileNotFoundError(f"transactions.csv not found in {dataset_dir}")
        
    df = pd.read_csv(tx_path)
    print(f"   Loaded {len(df)} transactions.")
    
    # Merge with users if available to extract elderly flag & user risk profile
    if os.path.exists(users_path):
        users = pd.read_csv(users_path)
        df = df.merge(
            users[['user_id', 'age_group', 'is_high_risk_user']],
            on='user_id',
            how='left'
        )
        df['is_elderly'] = (df['age_group'] == '55+').astype(int)
        df['is_high_risk_user'] = df['is_high_risk_user'].fillna(0).astype(int)
    else:
        df['is_elderly'] = 0
        df['is_high_risk_user'] = 0

    # Handle missing values
    df['transaction_velocity'] = df['transaction_velocity'].fillna(0.0)
    df['amount_deviation_score'] = df['amount_deviation_score'].fillna(0.0)
    df['user_avg_txn_value'] = df['user_avg_txn_value'].fillna(df['amount'])
    
    # Feature Engineering
    df['amount_ratio'] = df['amount'] / (df['user_avg_txn_value'] + 1.0)
    df['risk_signal_sum'] = (
        df['new_device_flag'] * 2.5 +
        df['ip_location_mismatch'] * 2.0 +
        df['is_night_transaction'] * 1.5 +
        (df['failed_attempts_last_24h'] >= 2).astype(int) * 2.0 +
        (df['transaction_velocity'] >= 3).astype(int) * 2.0 +
        (df['amount_deviation_score'] >= 2.0).astype(int) * 1.5 +
        df['is_high_risk_user'] * 1.5
    )

    feature_cols = [
        'amount',
        'amount_ratio',
        'hour_of_day',
        'is_weekend',
        'is_night_transaction',
        'new_device_flag',
        'ip_location_mismatch',
        'failed_attempts_last_24h',
        'transaction_velocity',
        'amount_deviation_score',
        'user_avg_monthly_txn',
        'user_avg_txn_value',
        'user_loyalty_score',
        'transaction_frequency_score',
        'risk_signal_sum',
        'is_elderly'
    ]

    X = df[feature_cols].copy()
    y = df['is_fraud'].astype(int)
    
    return X, y, feature_cols, df

def train_and_evaluate(dataset_dir='../dataset', output_dir='models'):
    os.makedirs(output_dir, exist_ok=True)
    X, y, feature_cols, raw_df = load_and_preprocess_data(dataset_dir)

    print(f"-> Splitting dataset: {len(X)} rows, {sum(y)} fraud instances ({sum(y)/len(y)*100:.2f}%)")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Calculate class balance weight for XGBoost
    scale_pos_weight = (len(y_train) - sum(y_train)) / max(1, sum(y_train))
    print(f"   Calculated scale_pos_weight for XGBoost: {scale_pos_weight:.2f}")

    # 1. Train Primary XGBoost Model
    print("-> Training Primary XGBoost Classifier...")
    xgb_model = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.06,
        subsample=0.85,
        colsample_bytree=0.85,
        scale_pos_weight=scale_pos_weight,
        random_state=42,
        eval_metric='logloss'
    )
    xgb_model.fit(X_train, y_train)

    # 2. Train Random Forest Model
    print("-> Training Random Forest Classifier...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)

    # 3. Train Isolation Forest (unsupervised anomaly detection on normal transactions)
    print("-> Training Isolation Forest for Anomaly Detection...")
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.04,
        random_state=42,
        n_jobs=-1
    )
    iso_forest.fit(X_train[y_train == 0])

    # 4. Model Evaluation on Test Set
    print("-> Evaluating Models on Test Set...")
    xgb_probs = xgb_model.predict_proba(X_test)[:, 1]
    rf_probs = rf_model.predict_proba(X_test)[:, 1]
    iso_scores = iso_forest.decision_function(X_test)
    iso_probs = np.clip((1.0 - iso_scores) / 2.0, 0.0, 1.0)

    # Ensemble Risk Score = 60% XGBoost + 25% Random Forest + 15% Isolation Forest
    ensemble_probs = (0.60 * xgb_probs) + (0.25 * rf_probs) + (0.15 * iso_probs)

    xgb_preds = (xgb_probs >= 0.5).astype(int)
    ensemble_preds = (ensemble_probs >= 0.5).astype(int)

    acc = float(accuracy_score(y_test, xgb_preds))
    prec = float(precision_score(y_test, xgb_preds, zero_division=0))
    rec = float(recall_score(y_test, xgb_preds, zero_division=0))
    f1 = float(f1_score(y_test, xgb_preds, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, xgb_probs))
    cm = confusion_matrix(y_test, xgb_preds).tolist()

    # Threshold sweeps for risk categorization
    thresholds = [0.20, 0.30, 0.40, 0.50, 0.60, 0.70]
    thresh_perf = []
    for t in thresholds:
        tp_pred = (ensemble_probs >= t).astype(int)
        thresh_perf.append({
            "threshold": t,
            "precision": round(float(precision_score(y_test, tp_pred, zero_division=0)), 4),
            "recall": round(float(recall_score(y_test, tp_pred, zero_division=0)), 4),
            "f1": round(float(f1_score(y_test, tp_pred, zero_division=0)), 4)
        })

    # Feature importances from XGBoost
    importances = xgb_model.feature_importances_
    feat_imp = []
    for name, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True):
        feat_imp.append({"feature": name, "importance": round(float(imp), 4)})

    metrics = {
        "primary_model": "XGBoost Classifier",
        "ensemble": "XGBoost (60%) + Random Forest (25%) + Isolation Forest (15%)",
        "dataset_size": len(raw_df),
        "test_size": len(X_test),
        "fraud_cases": int(sum(y)),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "confusion_matrix": {
            "true_negatives": cm[0][0],
            "false_positives": cm[0][1],
            "false_negatives": cm[1][0],
            "true_positives": cm[1][1]
        },
        "feature_importances": feat_imp,
        "threshold_analysis": thresh_perf,
        "risk_levels": {
            "low": {"range": "0.00 - 0.29", "description": "No significant suspicious indicators detected. Safe to proceed."},
            "medium": {"range": "0.30 - 0.69", "description": "Unusual characteristics detected. Caution recommended."},
            "high": {"range": "0.70 - 1.00", "description": "Multiple high-risk indicators detected. Action blocked / safety warning."}
        }
    }

    # Save artifacts
    print("-> Saving model artifacts...")
    joblib.dump(xgb_model, os.path.join(output_dir, 'xgboost_model.pkl'))
    joblib.dump(rf_model, os.path.join(output_dir, 'random_forest.pkl'))
    joblib.dump(iso_forest, os.path.join(output_dir, 'isolation_forest.pkl'))
    joblib.dump(feature_cols, os.path.join(output_dir, 'feature_names.pkl'))
    
    with open(os.path.join(output_dir, 'metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=2)

    # Generate visual evaluation plots
    try:
        # 1. Feature Importance Plot
        plt.figure(figsize=(10, 6))
        sorted_feats = sorted(feat_imp, key=lambda x: x['importance'])
        names = [f['feature'].replace('_', ' ').title() for f in sorted_feats[-10:]]
        vals = [f['importance'] for f in sorted_feats[-10:]]
        plt.barh(names, vals, color='#8b5cf6')
        plt.xlabel('XGBoost Relative Importance')
        plt.title('Sahi UPI: Top 10 Fraud Detection Signals')
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'feature_importance.png'), dpi=150)
        plt.close()

        # 2. ROC Curve Plot
        fpr, tpr, _ = roc_curve(y_test, xgb_probs)
        plt.figure(figsize=(7, 6))
        plt.plot(fpr, tpr, color='#10b981', lw=2, label=f'XGBoost (AUC = {roc_auc:.3f})')
        plt.plot([0, 1], [0, 1], color='#64748b', linestyle='--')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate (Recall)')
        plt.title('Sahi UPI: Fraud Detection ROC Curve')
        plt.legend(loc='lower right')
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'roc_curve.png'), dpi=150)
        plt.close()
        print("   Generated ROC and Feature Importance charts.")
    except Exception as e:
        print("   Warning: Could not save plots:", e)

    print("-> Training successfully completed!")
    print(f"   Accuracy: {acc*100:.2f}% | Recall: {rec*100:.2f}% | ROC-AUC: {roc_auc:.4f}")
    return metrics

if __name__ == '__main__':
    train_and_evaluate(dataset_dir='../dataset', output_dir='models')
