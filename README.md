# 🛡️ Sahi UPI – Intelligent UPI Payment Safety Platform
**Making Digital Payments Safer, Smarter, and More Secure.**

Sahi UPI is an AI-powered payment safety platform designed to identify suspicious UPI transactions and protect users from potential digital payment fraud. The platform focuses particularly on improving payment security for elderly users and individuals who may be vulnerable to online financial scams.

By leveraging Machine Learning, intelligent risk assessment, and real-time transaction analysis, Sahi UPI aims to detect potentially fraudulent transactions and provide understandable safety alerts before users complete risky payments.

---

## 📌 Table of Contents

- [Overview](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-overview)
- [Problem Statement](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-problem-statement)
- [Proposed Solution](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-proposed-solution)
- [Key Features](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-key-features)
- [Technology Stack](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-technology-stack)
- [System Architecture](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-system-architecture)
- [Machine Learning Pipeline](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-machine-learning-pipeline)
- [Transaction Risk Assessment](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-transaction-risk-assessment)
- [Application Workflow](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-application-workflow)
- [Installation and Setup](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-installation-and-setup)
- [Future Enhancements](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-future-enhancements)
- [Project Highlights](https://chatgpt.com/c/6ae8e03b-1100-83ee-afd3-cb624d8455fb#-project-highlights)

---

## 🚀 Overview
UPI has transformed digital payments in India by making transactions fast and convenient. However, the increasing use of digital payment systems has also created opportunities for fraud, including:

- Fake payment requests.
- Phishing and impersonation scams.
- Suspicious UPI IDs.
- Social engineering attacks.
- Unusual transaction patterns.
- Fraudulent collect requests.
Elderly users and less technically experienced individuals may find it difficult to identify such threats.

**Sahi UPI aims to bridge this security gap by introducing an intelligent transaction monitoring and fraud detection system.**

The platform analyzes transaction-related information, identifies suspicious patterns, calculates risk levels, and communicates potential threats through easy-to-understand alerts.

---

## ❗ Problem Statement
Traditional digital payment systems primarily focus on transaction execution rather than helping users understand the potential risks associated with suspicious payment activity.

Existing challenges include:

1. Difficulty identifying fraudulent UPI requests.
2. Limited awareness of common digital payment scams.
3. Vulnerability to social engineering and impersonation.
4. Lack of understandable risk indicators for non-technical users.
5. Difficulty recognizing unusual transaction behavior.
Sahi UPI aims to provide an additional intelligent safety layer to address these challenges.

---

## 💡 Proposed Solution
Sahi UPI introduces an ML-based fraud detection pipeline that analyzes transaction features and identifies potentially suspicious payment activity.

The system follows this approach:

1. Collect transaction-related information.
2. Preprocess and validate transaction data.
3. Extract relevant behavioral and financial features.
4. Apply a machine learning model to identify suspicious patterns.
5. Generate a fraud probability or risk score.
6. Classify transactions into risk categories.
7. Display appropriate warnings and safety recommendations.
The primary objective is to make fraud detection understandable and accessible to everyday UPI users.

---

## ✨ Key Features

### 🔍 1. Intelligent Fraud Detection

- Analyze transaction information using machine learning.
- Identify suspicious transaction patterns.
- Detect unusual transaction amounts and frequencies.
- Generate transaction risk scores.

### 📊 2. Transaction Risk Assessment
Transactions can be categorized into different risk levels:

Risk LevelDescriptionLow RiskNo significant suspicious indicators detectedMedium RiskUnusual transaction characteristics identifiedHigh RiskMultiple suspicious indicators detected
### 👴 3. Elderly-Friendly Payment Protection

- Simple and understandable security alerts.
- Clear warnings before risky payment actions.
- Easy-to-understand transaction risk explanations.
- User-friendly interface with accessible design.

### 🚨 4. Fraud Alerts and Recommendations

- Highlight suspicious transaction activity.
- Display risk indicators.
- Provide safety recommendations.
- Encourage users to verify unfamiliar recipients before making payments.

### 📈 5. Transaction Monitoring

- Maintain transaction history.
- Identify unusual spending patterns.
- Monitor transaction frequency.
- Provide an overview of transaction risk levels.

---

## 💻 Technology Stack
TechnologyPurposePythonCore development and ML implementationXGBoostMachine learning-based fraud classificationScikit-learnData preprocessing and model evaluationPandasTransaction data manipulationNumPyNumerical computationsFastAPIBackend API developmentReact.jsFrontend developmentSQLiteDatabase managementMatplotlibData visualization*The technology stack represents the proposed implementation architecture; adjust it to match the technologies actually implemented in your repository.*

---

## 🏗️ System Architecture
Sahi UPI follows a modular architecture combining frontend development, backend APIs, machine learning, and database management.

```
              UPI TRANSACTION DATA
                       |
                       v
              DATA PREPROCESSING
                       |
                       v
              FEATURE EXTRACTION
                       |
                       v
              ML FRAUD DETECTION
                 (XGBoost)
                       |
                       v
              RISK SCORE GENERATION
                       |
                       v
              RISK CLASSIFICATION
                       |
             +---------+---------+
             |                   |
             v                   v
        LOW / MEDIUM          HIGH RISK
             |                   |
             v                   v
       SAFE STATUS          FRAUD WARNING
             |                   |
             +---------+---------+
                       |
                       v
                FASTAPI BACKEND
                       |
                       v
                REACT FRONTEND
                       |
                       v
              USER NOTIFICATIONS
```

### Architecture Components

1. **Data Layer:** Stores transaction information and historical transaction records.
2. **Preprocessing Layer:** Cleans transaction data and prepares features for model inference.
3. **ML Layer:** Uses XGBoost to classify potentially fraudulent transactions.
4. **Backend Layer:** FastAPI exposes endpoints for transaction analysis and risk assessment.
5. **Database Layer:** SQLite stores transaction records and relevant application data.
6. **Frontend Layer:** React.js presents transaction information, risk indicators, and security alerts.

---

## 🤖 Machine Learning Pipeline
The machine learning component is responsible for identifying suspicious transaction patterns.

### 1. Data Collection
Transaction datasets can contain features such as:

- Transaction amount.
- Transaction timestamp.
- Transaction frequency.
- Sender and receiver information.
- Transaction type.
- Historical transaction behavior.
- Fraud labels (where available).

### 2. Data Preprocessing
Preprocessing operations include:

- Handling missing values.
- Removing duplicate records.
- Encoding categorical variables.
- Feature scaling where appropriate.
- Preparing training and testing datasets.

### 3. Feature Engineering
Relevant transaction features can be generated to improve fraud detection.

Examples:

- Transaction amount deviation from historical behavior.
- Number of transactions within a given time window.
- Frequency of payments to new recipients.
- Unusual transaction timing.
- Changes in transaction behavior.

### 4. Model Training
**XGBoost (Extreme Gradient Boosting)** is selected as the primary classification algorithm because it can model complex relationships in structured transaction data.

### 5. Model Evaluation
The model can be evaluated using:

MetricPurposeAccuracyOverall classification correctnessPrecisionCorrectness of predicted fraud casesRecallAbility to identify actual fraud casesF1-ScoreBalance between precision and recallROC-AUCAbility to distinguish between fraud and legitimate transactionsFor fraud detection, recall and precision are particularly important because both missed fraud cases and false alarms can negatively affect users.

---

## 📊 Transaction Risk Assessment
Sahi UPI uses a risk assessment mechanism to communicate potential transaction threats.

A sample conceptual risk classification:

```
def classify_risk(risk_score):
    if risk_score < 0.30:
        return "LOW RISK"
    elif risk_score < 0.70:
        return "MEDIUM RISK"
    else:
        return "HIGH RISK"
```
The risk score represents a value between 0 and 1.

Risk ScoreClassification0.00 – 0.29Low Risk0.30 – 0.69Medium Risk0.70 – 1.00High Risk*These are illustrative thresholds, not experimentally validated model thresholds. Actual thresholds should be selected using validation data and fraud detection requirements.*

---

## 🔄 Application Workflow

1. **User Access:** The customer accesses the Sahi UPI application.
2. **Transaction Input:** Transaction-related information is submitted for analysis.
3. **Data Validation:** The backend validates the incoming transaction information.
4. **Feature Extraction:** Relevant transaction features are extracted.
5. **Fraud Prediction:** The trained XGBoost model analyzes the transaction.
6. **Risk Assessment:** A risk score and classification are generated.
7. **Alert Generation:** The application displays an appropriate warning or safety message.
8. **Transaction History:** Relevant analysis results can be stored for future reference.

---

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git
- SQLite

### 1. Clone the Repository

```
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Sahi-UPI
```

### 2. Set Up the Backend

```
cd backend

python -m venv venv
```
Activate the virtual environment.

**Windows:**

```
venv\Scripts\activate
```
Install dependencies:

```
pip install pandas numpy scikit-learn xgboost fastapi uvicorn joblib
```

### 3. Run the FastAPI Server

```
uvicorn main:app --reload
```
Backend API:

```
http://127.0.0.1:8000
```
API documentation:

```
http://127.0.0.1:8000/docs
```

### 4. Set Up the Frontend
Open another terminal:

```
cd frontend
npm install
npm start
```
The React application will generally be available at:

```
http://localhost:3000
```
*Note: Update directory names, entry-point filenames, and commands according to your actual implementation.*

---

## 🔐 Security Considerations

- Validate transaction information on the backend.
- Protect sensitive user information.
- Apply secure authentication and authorization.
- Avoid exposing API credentials.
- Use encrypted communication in production.
- Do not store UPI PINs, OTPs, or other authentication secrets.
- Treat model predictions as risk indicators rather than guaranteed fraud confirmations.
**Important:** Sahi UPI is intended as an additional safety and fraud-risk assessment layer. It does not independently authorize, block, or reverse actual UPI payments unless integrated with an appropriately authorized payment infrastructure.

---

## 🔮 Future Enhancements

- Real-time UPI transaction monitoring through authorized integrations.
- Explainable AI using SHAP to explain fraud predictions.
- NLP-based detection of suspicious payment messages.
- Voice-based fraud warnings for elderly users.
- Multilingual support, including Telugu, Hindi, and English.
- Advanced anomaly detection techniques.
- Integration with authorized fraud intelligence sources.
- Mobile application development.
- Improved accessibility and emergency reporting features.

---

## 🎯 Project Highlights

- Proposed an AI/ML-powered platform to improve UPI payment safety.
- Designed a machine learning pipeline using XGBoost for fraud classification.
- Incorporated transaction behavior analysis and risk assessment.
- Planned FastAPI-based backend services for model inference.
- Designed a React-based interface for displaying transaction risks.
- Focused on accessible fraud warnings and protection for elderly users.

---

## 👨‍💻 Developed By
**Karthik Chukkala**

Artificial Intelligence & Data Science
Chaitanya Bharathi Institute of Technology (CBIT)

---

⭐ If you find this project interesting, consider giving the repository a star!

**Sahi UPI – Making Every Digital Payment Safer.**