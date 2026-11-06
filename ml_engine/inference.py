import sys
import json
import joblib
import os
import pandas as pd
import numpy as np

class MLPredictor:
    def __init__(self, models_dir=None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
        self.models_dir = models_dir
        self.is_ready = False
        self._load_models()

    def _load_models(self):
        try:
            self.xgb_model = joblib.load(os.path.join(self.models_dir, 'xgboost_model.pkl'))
            self.rf_model = joblib.load(os.path.join(self.models_dir, 'random_forest.pkl'))
            self.iso_model = joblib.load(os.path.join(self.models_dir, 'isolation_forest.pkl'))
            self.feature_names = joblib.load(os.path.join(self.models_dir, 'feature_names.pkl'))
            metrics_path = os.path.join(self.models_dir, 'metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    self.metrics = json.load(f)
            else:
                self.metrics = {}
            self.is_ready = True
        except Exception as e:
            print(f"Warning: Failed to load trained models from {self.models_dir}: {e}", file=sys.stderr)
            self.is_ready = False

    def classify_risk(self, risk_score):
        """
        Risk classification as per Sahi UPI specifications:
        0.00 - 0.29 : LOW RISK (Safe status, verified)
        0.30 - 0.69 : MEDIUM RISK (Caution status, suspicious)
        0.70 - 1.00 : HIGH RISK (Fraud warning, blocked)
        """
        if risk_score < 0.30:
            return "LOW RISK", "Verified"
        elif risk_score < 0.70:
            return "MEDIUM RISK", "Suspicious"
        else:
            return "HIGH RISK", "Blocked"

    def _normalize_raw_probability(self, raw_prob):
        """
        Calibrates raw weighted model probability into the standard 0.00 - 1.00 risk scale.
        Normal baseline (around 0.40 raw) maps to 0.10 - 0.22 (Low Risk).
        Elevated risk (0.50 - 0.70 raw) maps to 0.35 - 0.65 (Medium Risk).
        High anomaly (0.80+ raw) maps to 0.75 - 0.95 (High Risk).
        """
        if raw_prob <= 0.44:
            return 0.04 + (raw_prob / 0.44) * 0.18
        elif raw_prob <= 0.70:
            return 0.22 + ((raw_prob - 0.44) / 0.26) * 0.43
        else:
            return 0.65 + ((raw_prob - 0.70) / 0.30) * 0.30

    def predict(self, raw_features):
        """
        Accepts raw feature dictionary and returns detailed risk analysis.
        """
        data = dict(raw_features)

        # Extract features with sensible defaults
        amount = float(data.get('amount', 500.0))
        user_avg = float(data.get('user_avg_txn_value', amount if amount > 0 else 500.0))
        amount_ratio = float(amount / (user_avg + 1.0))
        
        hour = int(data.get('hour_of_day', 14))
        is_night = int(data.get('is_night_transaction', 1 if (hour < 6 or hour >= 22) else 0))
        is_weekend = int(data.get('is_weekend', 0))
        new_device = int(data.get('new_device_flag', 0))
        ip_mismatch = int(data.get('ip_location_mismatch', 0))
        failed_attempts = int(data.get('failed_attempts_last_24h', 0))
        velocity = float(data.get('transaction_velocity', 1.0))
        amount_dev = float(data.get('amount_deviation_score', 0.1))
        user_avg_monthly = float(data.get('user_avg_monthly_txn', 28.0))
        loyalty = float(data.get('user_loyalty_score', 0.68))
        freq_score = float(data.get('transaction_frequency_score', min(1.0, user_avg_monthly / 50.0)))
        is_high_risk = int(data.get('is_high_risk_user', 0))
        is_elderly = int(data.get('is_elderly', 1 if str(data.get('age_group', '')).strip() in ['55+', 'elderly', 'senior'] else 0))

        # Risk signal sum
        risk_signal_sum = (
            new_device * 2.5 +
            ip_mismatch * 2.0 +
            is_night * 1.5 +
            (1 if failed_attempts >= 2 else 0) * 2.0 +
            (1 if velocity >= 3 else 0) * 2.0 +
            (1 if amount_dev >= 2.0 else 0) * 1.5 +
            is_high_risk * 1.5
        )

        record = {
            'amount': amount,
            'amount_ratio': amount_ratio,
            'hour_of_day': hour,
            'is_weekend': is_weekend,
            'is_night_transaction': is_night,
            'new_device_flag': new_device,
            'ip_location_mismatch': ip_mismatch,
            'failed_attempts_last_24h': failed_attempts,
            'transaction_velocity': velocity,
            'amount_deviation_score': amount_dev,
            'user_avg_monthly_txn': user_avg_monthly,
            'user_avg_txn_value': user_avg,
            'user_loyalty_score': loyalty,
            'transaction_frequency_score': freq_score,
            'risk_signal_sum': risk_signal_sum,
            'is_elderly': is_elderly
        }

        # If models loaded successfully, run ML inference
        if self.is_ready:
            df = pd.DataFrame([record])[self.feature_names]
            raw_xgb = float(self.xgb_model.predict_proba(df)[0][1])
            raw_rf = float(self.rf_model.predict_proba(df)[0][1])
            iso_decision = float(self.iso_model.decision_function(df)[0])
            iso_prob = float(np.clip((1.0 - iso_decision) / 2.0, 0.0, 1.0))

            # Calibrate ML probability
            calibrated_xgb = self._normalize_raw_probability(raw_xgb)
            calibrated_rf = self._normalize_raw_probability(raw_rf)

            # Ensemble: 60% XGBoost + 25% Random Forest + 15% Isolation Forest Anomaly
            combined_risk = (0.60 * calibrated_xgb) + (0.25 * calibrated_rf) + (0.15 * min(0.35, iso_prob))

            # Specific domain rules for acute attacks
            if new_device and ip_mismatch:
                combined_risk = max(combined_risk, 0.78)
            if failed_attempts >= 2 and velocity >= 3:
                combined_risk = max(combined_risk, 0.82)
            if amount >= 20000 and (new_device or ip_mismatch or failed_attempts > 0):
                combined_risk = max(combined_risk, 0.85)
            if is_elderly and (new_device or ip_mismatch) and amount > 5000:
                combined_risk = max(combined_risk, 0.88)
            
            # Clean daytime normal transaction guarantee
            if not new_device and not ip_mismatch and failed_attempts == 0 and not is_night and velocity <= 2 and amount_ratio < 2.0:
                combined_risk = min(combined_risk, 0.22)
        else:
            # Fallback heuristic rule engine
            heuristic = 0.08
            if new_device: heuristic += 0.35
            if ip_mismatch: heuristic += 0.25
            if is_night: heuristic += 0.15
            if failed_attempts > 0: heuristic += 0.15 * min(failed_attempts, 3)
            if velocity > 2: heuristic += 0.20
            if amount_ratio > 2.5: heuristic += 0.20
            if is_elderly: heuristic += 0.05
            combined_risk = min(0.95, heuristic)
            calibrated_xgb = combined_risk
            calibrated_rf = combined_risk
            iso_prob = 0.3

        risk_score = round(float(np.clip(combined_risk, 0.02, 0.98)), 4)
        risk_level, status = self.classify_risk(risk_score)

        # Risk indicator flags
        indicators = []
        if new_device:
            indicators.append("Unrecognized Device Login (New Hardware ID)")
        if ip_mismatch:
            indicators.append("IP Geolocation Mismatch from Registered City")
        if is_night:
            indicators.append("Unusual Night-time Transaction (10 PM - 6 AM)")
        if failed_attempts > 0:
            indicators.append(f"{failed_attempts} Failed UPI PIN Attempts in last 24h")
        if velocity >= 3:
            indicators.append(f"Rapid Successive Transaction Velocity ({int(velocity)}/hr)")
        if amount_ratio >= 2.0:
            indicators.append(f"Amount {amount_ratio:.1f}x higher than typical average")
        if is_elderly and risk_score >= 0.30:
            indicators.append("Elderly User Vulnerability Safeguard Triggered")

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "status": status,
            "is_fraud": bool(risk_score >= 0.70),
            "xgb_prob": round(float(calibrated_xgb), 4),
            "rf_prob": round(float(calibrated_rf), 4),
            "anomaly_score": round(float(iso_prob), 4),
            "risk_indicators": indicators,
            "features_used": record
        }

_predictor = None

def get_predictor():
    global _predictor
    if _predictor is None:
        _predictor = MLPredictor()
    return _predictor

def main():
    predictor = get_predictor()
    for line in sys.stdin:
        if not line.strip():
            continue
        try:
            payload = json.loads(line)
            tx_id = payload.get("transaction_id", "unknown")
            prediction = predictor.predict(payload)
            prediction["transaction_id"] = tx_id
            print(json.dumps(prediction), flush=True)
        except Exception as e:
            print(json.dumps({"error": str(e), "transaction_id": payload.get("transaction_id", "unknown") if 'payload' in locals() else "unknown"}), flush=True)

if __name__ == '__main__':
    main()
