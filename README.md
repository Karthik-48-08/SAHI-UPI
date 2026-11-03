# Sahi-UPI: Real-Time UPI Fraud Detection and AI Guardian

Sahi-UPI is a full-stack prototype for detecting suspicious UPI transactions using behavioral features, machine-learning models, explainable AI, and multilingual voice alerts. The application combines a React dashboard, an Express API, an in-memory feature store, and a Python inference process that runs a Random Forest and an Isolation Forest model together.

The project uses a fully synthetic UPI dataset. It is intended for education, demonstration, research prototyping, and experimentation; it is not a production banking or payment-processing system.

## 1. Problem Statement

UPI transactions are fast, high-volume, and increasingly distributed across users, devices, locations, merchants, and payment applications. A fraud-detection system must identify unusual activity quickly without blocking legitimate users unnecessarily.

The project addresses the following problem:

> Given a transaction and a user's recent behavioral history, estimate the probability that the transaction is fraudulent or anomalous, classify its risk, and provide an understandable warning when intervention may be required.

The system focuses on signals such as transaction amount, transaction velocity, and distance from the user's usual location. It also provides a user-facing explanation and voice warning for suspicious activity.

## 2. Idea of the Solution

Sahi-UPI uses a layered risk-detection workflow:

1. Receive a transaction from the dashboard or an API client.
2. Maintain a short-term in-memory history for the user.
3. Derive behavioral features from the current transaction and that history.
4. Send the features to a long-running Python inference process.
5. Combine supervised fraud probability with unsupervised anomaly detection.
6. Convert the combined score into `Verified`, `Suspicious`, or `Blocked`.
7. Generate an explanation using Gemini when configured, or use a deterministic local explanation when it is not.
8. Display the result and optionally speak the warning in English, Hindi, or Telugu.

The design combines two complementary model types:

- **Random Forest:** Detects patterns similar to labeled historical fraud examples.
- **Isolation Forest:** Detects observations that look unusual relative to the training data.

The ensemble risk score is calculated as:

```text
risk_score = 0.7 * random_forest_fraud_probability
           + 0.3 * normalized_isolation_forest_anomaly_score
```

## 3. Objectives of the Solution

### Primary objectives

- Detect potentially fraudulent UPI transactions in near real time.
- Use behavioral context instead of relying only on transaction amount.
- Combine known-fraud classification with general anomaly detection.
- Return a risk score and an actionable status for every transaction.
- Explain suspicious decisions in language understandable to a user.
- Provide multilingual voice warnings for accessibility.
- Provide a dashboard for monitoring recent transactions and risk indicators.

### Secondary objectives

- Keep the system modular so the ML model can be replaced independently.
- Support local execution without requiring a live Gemini API key.
- Use synthetic data so the project can be demonstrated without exposing personal financial information.
- Provide a foundation for future additions such as persistent storage, richer features, and formal model evaluation.

## 4. Data Understanding and Preparation

### Dataset contents

The `dataset` directory contains synthetic data representing one year of UPI activity:

| File | Description |
| --- | --- |
| `transactions.csv` | Main transaction table with 20,000 transaction records and behavioral, temporal, device, status, and fraud fields. |
| `fraud_labels.csv` | Compact fraud-label table containing selected transaction risk signals and `is_fraud`. |
| `users.csv` | 2,000 synthetic user profiles and historical behavioral attributes. |
| `merchants.csv` | 400 synthetic merchant records with category, location, size, registration, and rating information. |
| `data_dictionary.csv` | Column definitions, types, examples, and value descriptions. |

The main relational keys are:

- `user_id`: connects transactions with users.
- `receiver_id`: connects merchant transactions with merchants or user-to-user transactions with users.
- `transaction_id`: uniquely identifies a transaction.

### Important dataset characteristics

- The data covers January through December 2024.
- The dataset is intentionally imbalanced, with an approximate fraud rate of 3.8 percent.
- Amounts follow a skewed distribution to resemble real payment behavior.
- Some behavioral columns contain missing values by design.
- The data includes time, device, KYC, location, payment-app, velocity, and amount-deviation signals.
- All records are synthetic and contain no real banking credentials or personally identifiable information.

### Preparation performed by the training pipeline

The current training pipeline in `ml_engine/train.py` performs the following preparation steps:

1. Loads `dataset/transactions.csv` with pandas.
2. Checks that `is_fraud` is available as the target column.
3. Ensures the required model features exist:
   - `amount`
   - `transaction_velocity`
   - `distance_from_home`
4. Creates synthetic values for missing engineered fields when necessary.
5. Replaces missing values with zero.
6. Splits the data into training and test partitions using stratification.
7. Applies SMOTE to the training partition to address class imbalance.
8. Saves the trained models and feature-name list as joblib artifacts.

### Current preparation limitations

The training script is suitable for a prototype, but it does not yet:

- Calculate and print test-set metrics.
- Persist the train/test split.
- Version the feature schema.
- Fit preprocessing transformations separately from inference.
- Compute `distance_from_home` from the source dataset in a reproducible way.
- Validate that production features have the same distributions as training features.

## 5. Proposed Methodology

### 5.1 Feature engineering

For a live transaction, `backend/store/featureStore.js` derives:

- **Amount:** The transaction value.
- **Transaction velocity:** Number of transactions observed for that user during the previous hour, including the current transaction.
- **Distance from home:** Approximate geographic distance from the first recorded location for that user.

The current distance calculation uses a simple latitude/longitude Euclidean approximation multiplied by 111 kilometers per degree. It is intentionally lightweight for the prototype and should be replaced by a geodesic calculation in a production system.

### 5.2 Model training

The training workflow uses:

- `RandomForestClassifier` with 100 trees and maximum depth 10.
- `IsolationForest` with 100 trees and 1 percent contamination.
- `SMOTE` to balance the supervised model's training data.
- A fixed random seed of 42 for repeatability.

The generated artifacts are:

- `ml_engine/models/random_forest.pkl`
- `ml_engine/models/isolation_forest.pkl`
- `ml_engine/models/feature_names.pkl`

### 5.3 Online inference

`ml_engine/inference.py` stays alive as a child process. Node sends one JSON object per line through stdin. Python loads the serialized models once, predicts for each input line, and writes one JSON result per line to stdout.

Each result contains:

- `transaction_id`
- `risk_score`
- `is_fraud`
- `rf_prob`
- `iso_score`

### 5.4 Risk classification

The backend classifies the ensemble score as follows:

| Condition | Status |
| --- | --- |
| `risk_score <= 0.4` | `Verified` |
| `0.4 < risk_score <= 0.6` | `Suspicious` |
| `risk_score > 0.6` and fraud prediction is true | `Blocked` |

If ML inference fails, the backend uses a fallback rule based on amount and distance. This keeps the API responsive but is not a substitute for a healthy model service.

### 5.5 Explainability and voice response

For suspicious or blocked transactions, the backend requests an explanation from `backend/services/geminiService.js` when `GEMINI_API_KEY` is configured. If no key is available or the API request fails, a local explanation is returned.

The frontend's `VoiceGuardian` component uses the browser Web Speech API and selects the appropriate warning in English, Hindi, or Telugu.

## 6. Implementation Strategy

### Frontend

The frontend is a React application built with Vite and Tailwind CSS. Its main responsibilities are:

- Fetch dashboard statistics.
- Generate demonstration transactions every five seconds.
- Submit transactions to the backend.
- Maintain a recent transaction feed.
- Pause and resume the demonstration stream during a review.
- Search and filter transactions by merchant, location, or risk status.
- Trigger controlled normal and high-risk scenarios for demonstrations.
- Export the current transaction review queue as CSV.
- Record analyst decisions such as reviewed, escalated, or false positive.
- Simulate account freeze and unfreeze actions with visible confirmation.
- Maintain a local audit trail for selected transaction actions.
- Show the selected transaction's risk analysis.
- Provide emergency-action UI and multilingual voice playback.

Important frontend files include:

- `frontend/src/App.jsx`
- `frontend/src/services/api.js`
- `frontend/src/components/DashboardStats.jsx`
- `frontend/src/components/TransactionFeed.jsx`
- `frontend/src/components/AIAnalysisPanel.jsx`
- `frontend/src/components/VoiceGuardian.jsx`

### Backend

The backend is an Express application:

- `POST /api/transaction`: processes and scores a transaction.
- `GET /api/stats`: returns dashboard statistics currently represented as mock values.

`server.js` coordinates the feature store, ML process, fallback logic, and explanation service. The feature store is currently in memory, so all history is lost when the Node process stops.

### ML service

The Node backend starts Python using:

```text
python ml_engine/inference.py
```

The service communicates through newline-delimited JSON. A one-second timeout prevents an HTTP request from waiting indefinitely for inference.

### Suggested implementation phases

1. **Prototype phase:** current React dashboard, Express API, Python models, mock data, and local fallback explanations.
2. **Data-quality phase:** add schema validation, reproducible feature engineering, missing-value policies, and feature versioning.
3. **Evaluation phase:** add precision, recall, F1-score, ROC-AUC, PR-AUC, confusion matrices, and threshold analysis.
4. **Reliability phase:** add persistent storage, process restart handling, request correlation cleanup, structured logging, and health checks.
5. **Production phase:** replace the in-memory store, secure the API, containerize services, manage secrets, and add monitoring and drift detection.

## 7. Result Analysis and Interpretation

### Verified implementation results

The running prototype was validated with the following checks:

- Node.js backend syntax validation passed.
- Python model inference completed successfully using the stored model artifacts.
- `GET /api/stats` returned the dashboard payload.
- `POST /api/transaction` returned a transaction ID, risk score, and status.
- The frontend production build completed successfully with Vite.
- The frontend root page returned HTTP 200 on port 5173.

A live smoke transaction returned a risk score of approximately `0.119` and was classified as `Verified`.

### Interpretation of the current results

The successful round trip demonstrates that the application architecture is connected correctly: the browser can call Express, Express can derive features, Node can communicate with Python, and Python can load and apply the serialized models.

The result does **not** represent a statistically validated fraud-detection performance measurement. The current training script does not report test-set metrics, and the dashboard's displayed protection statistics are mock values. Therefore, claims about accuracy, precision, recall, false-positive rate, or financial benefit should not be made until an evaluation pipeline is added.

The current behavior should be interpreted as:

- A working end-to-end technical demonstration.
- A proof of model-serving integration.
- A visual demonstration of risk classification and explainability.
- A starting point for formal experimentation and production hardening.

### Known model compatibility note

The checked-in model artifacts were produced with a different scikit-learn version than the active runtime, which produces compatibility warnings during loading. Inference currently succeeds, but the models should be retrained and loaded with a pinned, matching dependency environment before relying on the scores.

## 8. Project Structure

```text
SAHI-UPI/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── services/
│   │   ├── geminiService.js
│   │   └── mlProcess.js
│   └── store/
│       └── featureStore.js
├── dataset/
│   ├── transactions.csv
│   ├── fraud_labels.csv
│   ├── users.csv
│   ├── merchants.csv
│   ├── data_dictionary.csv
│   └── README.md
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
├── ml_engine/
│   ├── train.py
│   ├── inference.py
│   ├── requirements.txt
│   └── models/
└── README.md
```

## 9. Setup and Execution

### Prerequisites

- Node.js and npm.
- Conda or another Python environment manager.
- Python packages listed in `ml_engine/requirements.txt`.
- A compatible scikit-learn version for the serialized model artifacts.

### Activate the ML environment

```powershell
conda activate mlopsv1
```

### Install dependencies

```powershell
cd backend
npm install

cd ..\frontend
npm install
```

For the Python environment:

```powershell
conda activate mlopsv1
pip install -r ml_engine\requirements.txt
```

### Start the backend

Run from the repository root with the ML environment active:

```powershell
cd backend
node server.js
```

The backend starts on port 5000 by default.

### Start the frontend

In a second terminal:

```powershell
cd frontend
npx vite --host 127.0.0.1
```

The frontend starts on port 5173 by default.

### Optional Gemini configuration

Create a backend `.env` file containing:

```text
GEMINI_API_KEY=your_api_key_here
```

Without this key, the application uses its local explanation fallback.

## 10. API Examples

### Get dashboard statistics

```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/stats -Method Get
```

### Submit a transaction

```powershell
$body = @{
  amount = 500
  merchant_name = "Local Mart"
  location_name = "Hyderabad, TS"
  lat = 17.3850
  lon = 78.4867
  user_id = "user_001"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri http://localhost:5000/api/transaction `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## 11. Future Enhancements

The following enhancements would move Sahi-UPI from an end-to-end prototype toward a reliable, measurable, and production-ready fraud-detection platform.

### Model and data improvements

- Add a reproducible evaluation pipeline with precision, recall, F1-score, ROC-AUC, PR-AUC, confusion matrices, and threshold analysis.
- Use time-based train, validation, and test splits to better represent real deployment conditions.
- Expand the feature set with device fingerprints, beneficiary history, login context, merchant reputation, and graph-based transaction relationships.
- Version the feature schema and model artifacts, and monitor model drift and data-quality changes.
- Calibrate risk probabilities and tune decision thresholds according to the operational cost of false positives and false negatives.
- Retrain models periodically with reviewed outcomes and newly labeled fraud cases.

### Platform and reliability improvements

- Replace the in-memory feature store with a durable database or bounded low-latency cache.
- Add schema-based request validation, idempotency keys, correlation IDs, structured logging, and health checks.
- Replace chunk-based ML stdout parsing with a buffered protocol parser and handle Python process failures explicitly.
- Containerize the frontend, backend, and ML service for repeatable deployment.
- Add automated unit, integration, browser, load, and regression tests.

### Security and operations improvements

- Add authentication, authorization, rate limiting, secure CORS configuration, and encrypted transport.
- Move API URLs, model thresholds, and service settings into validated environment configuration.
- Replace mock dashboard values with real-time aggregates and an auditable event store.
- Add monitoring, alerting, audit retention, incident response procedures, and controlled model rollback.
- Complete privacy, regulatory, fairness, and human-oversight reviews before using the system with real financial data.

## 12. Conclusion Slide

### Sahi-UPI: From prototype to safer digital payments

- **Problem addressed:** UPI transactions need fast, context-aware detection of suspicious behavior.
- **Solution demonstrated:** A React dashboard, Express API, Python ML service, behavioral feature store, explainable risk decisions, and multilingual voice alerts working together in one flow.
- **Key takeaway:** The prototype proves the technical integration and provides a foundation for human-assisted fraud review.
- **What comes next:** Measure model performance with real evaluation metrics, strengthen security and reliability, use richer behavioral data, and validate the system responsibly before production adoption.
- **Final message:** Sahi-UPI is a practical starting point for building transparent, user-centered, and continuously improving fraud protection.

> **Conclusion:** The application demonstrates how real-time behavioral signals and explainable machine learning can support safer UPI experiences, while responsible evaluation and production hardening remain essential next steps.

## 13. Privacy and Disclaimer

The included data is synthetic and does not represent real users, merchants, accounts, or financial institutions. The project is for demonstration and research purposes only. It must not be used to approve, deny, block, or monitor real financial transactions without extensive validation, security review, regulatory review, and operational safeguards.

## 14. Research-Informed Product Design

The operator-facing additions are guided by the [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), which emphasizes trustworthy AI practices including governance, measurement, transparency, and risk management. In this prototype, those principles appear as:

- **Human review:** operators can pause the stream, search events, filter by status, and inspect a selected transaction.
- **Transparency:** the dashboard exposes the risk score, behavioral evidence, decision status, and explanation instead of showing only a binary decision.
- **Traceability:** the current event set can be exported as CSV for review or presentation evidence.
- **Controlled evaluation:** normal and high-risk simulation controls make it possible to demonstrate the full workflow repeatedly without editing source data.
- **Clear boundaries:** the interface labels the system as a prototype and does not present mock dashboard statistics as measured model performance.

This reference informs the product design; it does not represent a compliance certification for Sahi-UPI.
