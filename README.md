# 🛡️ Sahi UPI – Intelligent UPI Payment Safety Platform
**Making Digital Payments Safer, Smarter, and More Secure.**

Sahi UPI is an AI-powered payment safety platform designed to identify suspicious UPI transactions and protect users from digital payment fraud. The platform focuses particularly on improving payment security for **elderly users and individuals vulnerable to online financial scams** (such as collect request fraud, fake lotteries, electricity bill disconnection threats, and remote device takeovers).

By leveraging **Machine Learning (XGBoost, Random Forest, Isolation Forest)**, real-time behavioral risk assessment, and **Explainable AI (XAI)** with **multilingual voice alerts (English, Hindi, Telugu)**, Sahi UPI detects potentially fraudulent transactions and intervenes with clear, actionable safety alerts *before* users authorize risky payments.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [Model Evaluation & Metrics](#-model-evaluation--metrics)
- [Transaction Risk Assessment](#-transaction-risk-assessment)
- [Elderly Protection & Voice Guardian](#-elderly-protection--voice-guardian)
- [Application Workflow](#-application-workflow)
- [Installation and Setup](#-installation-and-setup)
- [API Endpoints](#-api-endpoints)
- [Project Highlights](#-project-highlights)
- [Developed By](#-developed-by)

---

## 🚀 Overview
Unified Payments Interface (UPI) processes billions of transactions monthly across India. However, the surge in digital payments has also escalated financial cyber threats:

- **Fraudulent Collect Requests:** Scammers send requests to debit users claiming it is a "cashback prize" or "lottery reward".
- **Phishing & Impersonation:** Fake customer support or fake electricity board officers threatening immediate power cuts.
- **Unfamiliar / Suspicious UPI IDs:** Private accounts masquerading as registered merchants.
- **Remote / Device Anomalies:** Transactions initiated from unrecognized hardware IDs or mismatched geolocations.
- **Vulnerability of Elderly Users:** Non-technical or senior citizens who may not realize that **entering a UPI PIN always debits money**, never credits it.

**Sahi UPI bridges this critical security gap by providing an intelligent, pre-payment risk assessment safety gate.**

---

## ❗ Problem Statement
Traditional UPI payment systems focus solely on rapid execution: once a user enters their PIN, funds leave their account instantaneously. Traditional systems fail to:
1. Help users understand potential risks before funds are transferred.
2. Educate non-technical or elderly users about social engineering tactics in real time.
3. Intervene when transactions deviate drastically from user historical spending velocity and device patterns.
4. Provide voice-based safety explanations in regional Indian languages.

---

## 💡 Proposed Solution
Sahi UPI introduces an **end-to-end intelligent safety layer** consisting of:
1. **Behavioral Feature Engineering:** Analyzing amount deviation, transaction velocity, device identifiers, time of day, and KYC status.
2. **Machine Learning Classifier:** An XGBoost model trained on 20,000 real-world simulated UPI transactions, combined with Random Forest and Isolation Forest anomaly detection.
3. **Calibrated Risk Scoring (0.00 – 1.00):** Categorizing payments into **Low Risk (Safe)**, **Medium Risk (Caution)**, and **High Risk (Blocked)**.
4. **Pre-Payment Safety Interception:** Halting high-risk transactions before PIN submission and displaying plain-language threat explanations.
5. **Multilingual Voice Guardian:** Speaking voice alerts in **English, Hindi (हिंदी), and Telugu (తెలుగు)** via speech synthesis.
6. **Emergency One-Tap Actions:** Immediate account freezing and automated National Cyber Crime Helpline (1930) reporting.

---

## ✨ Key Features

### 🔍 1. Intelligent Fraud Detection (XGBoost & Ensemble)
- Models complex non-linear fraud signals from transaction records.
- Evaluates transaction velocity, IP geolocation mismatch, new hardware IDs, and amount deviation.
- Sub-model consensus: XGBoost (60%) + Random Forest (25%) + Isolation Forest (15%).

### 📊 2. Calibrated Risk Assessment
| Risk Level | Score Range | Platform Action & Description |
|---|---|---|
| **🟢 LOW RISK** | 0.00 – 0.29 | Safe status. Transaction characteristics align with user profile. Verified. |
| **🟡 MEDIUM RISK** | 0.30 – 0.69 | Caution alert. Unusual characteristics detected (e.g. new recipient, slight velocity increase). |
| **🔴 HIGH RISK** | 0.70 – 1.00 | Fraud warning. Critical indicators flagged (new device + IP mismatch + high amount). PIN entry intercepted. |

### 👴 3. Elderly-Friendly Payment Protection
- **Senior Citizen Mode:** High-contrast, large-font interface with simplified terminology.
- **Golden Rule Reminder:** Prominently teaches users: *"UPI PIN is ONLY for sending money, NEVER to receive funds."*
- **Plain-Language Explanations:** Explains *why* a payment is suspicious without technical jargon.

### 🗣️ 4. Multilingual Voice Guardian
- Built-in Text-to-Speech audio alerts in **English, Hindi (हिंदी), and Telugu (తెలుగు)**.
- Reads out alerts aloud so elderly users do not have to strain their eyes or decipher complex messages.

### 🚨 5. Emergency Controls
- **One-Tap Account Freeze:** Instantly locks outgoing UPI payment privileges in SQLite database.
- **1930 Cyber Cell Reporting:** Generates an official cyber financial crime acknowledgment ticket.

### 📈 6. Security Operations & Analytics
- Live incoming UPI transaction stream with toggleable simulation.
- Real-time KPI dashboard: Scans today, threats blocked, protection rate, response latency.
- Full ML Model Performance tab showing confusion matrix, ROC-AUC, and feature importances.

---

## 💻 Technology Stack

| Technology | Purpose |
|---|---|
| **Python 3.11+** | Core ML training, feature engineering, and inference engine |
| **XGBoost** | Primary gradient boosting fraud classification model |
| **Scikit-learn** | Random Forest, Isolation Forest, model evaluation, and train-test splits |
| **Pandas & NumPy** | Data preprocessing, behavioral feature extraction, and matrix manipulation |
| **FastAPI & Uvicorn** | High-performance asynchronous backend API service |
| **SQLite** | Database storage for transactions, users, alerts, and frozen accounts |
| **React.js & Vite** | Interactive frontend dashboard and elderly UPI application |
| **Tailwind CSS & Lucide Icons** | Modern accessible UI, high-contrast badges, and tactile layout |
| **Web Speech API** | Client-side multilingual voice warning generation (EN / HI / TE) |

---

## 🏗️ System Architecture

```
                       UPI TRANSACTION INGESTION
                                   │
                                   ▼
                 DATA VALIDATION & PREPROCESSING (SQLite)
                                   │
                                   ▼
                       BEHAVIORAL FEATURE EXTRACTION
        (Amount Ratio, Velocity, Device Check, Night Window, Senior Flag)
                                   │
                                   ▼
                     ML ENSEMBLE CLASSIFICATION
               ┌───────────────────┼───────────────────┐
               ▼                   ▼                   ▼
       XGBoost Classifier    Random Forest     Isolation Forest
             (60%)               (25%)               (15%)
               └───────────────────┬───────────────────┘
                                   │
                                   ▼
                    CALIBRATED RISK SCORE GENERATION
                              (0.00 – 1.00)
                                   │
                                   ▼
                    RISK LEVEL CLASSIFICATION
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
          LOW / MEDIUM RISK                      HIGH RISK
                 │                                   │
                 ▼                                   ▼
            SAFE STATUS                     SAFETY INTERCEPT MODAL
        (Verified Payment)              (Explainable Threat Reason)
                 │                                   │
                 └─────────────────┬─────────────────┘
                                   │
                                   ▼
                    EXPLAINABLE AI & VOICE GUARDIAN
                  (English, Hindi, Telugu Audio Alert)
                                   │
                                   ▼
                       FASTAPI BACKEND SERVICE
                                   │
                                   ▼
                       REACT.JS FRONTEND PORTAL
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
    User UPI App             Admin Monitor             ML Intelligence
  (Elderly Mode)          (Real-Time Stream)         (Metrics & Charts)
```

---

## 🤖 Machine Learning Pipeline

### 1. Dataset Overview
- **Dataset Size:** 20,000 transactions across 2,000 users and 400 merchants.
- **Fraud Instances:** 763 positive cases (~3.82% class imbalance).
- **Relational Keys:** `transactions.csv` linked with `users.csv` and `merchants.csv`.

### 2. Feature Engineering
The pipeline derives high-impact signals:
1. `risk_signal_sum`: Weighted composite score of acute fraud signals.
2. `amount_ratio`: Transaction amount relative to user historical average ($Amount / \overline{Amount}_{user}$).
3. `new_device_flag`: 1 if transaction originates from an unrecognized device hardware ID.
4. `ip_location_mismatch`: 1 if IP geolocation differs from user's registered home city.
5. `transaction_velocity`: Count of rapid successive transactions within a 1-hour window.
6. `is_night_transaction`: 1 if transaction occurs between 10 PM and 6 AM.
7. `failed_attempts_last_24h`: Count of recent incorrect UPI PIN attempts.
8. `is_elderly`: Target vulnerability marker for senior users ($55+$).

---

## 📊 Model Evaluation & Metrics

The XGBoost model was evaluated on an independent 20% stratified test set ($4,000$ transactions):

| Metric | Score | Description |
|---|---|---|
| **ROC-AUC** | **0.6869** | Area under the ROC curve measuring class separation power |
| **Accuracy** | **80.47%** | Overall correct classification rate |
| **Fraud Recall** | **33.99%** | Fraction of actual fraud cases caught |
| **Precision** | **7.10%** | Precision at balanced high-recall threshold |
| **F1-Score** | **0.1175** | Harmonic balance between precision and recall |

### Top XGBoost Feature Importances
1. **`risk_signal_sum`** (14.00%) — Composite attack indicator
2. **`new_device_flag`** (13.22%) — Unrecognized device hardware
3. **`transaction_velocity`** (10.24%) — Rapid successive payments
4. **`is_night_transaction`** (9.10%) — Unusual hours (10 PM – 6 AM)
5. **`ip_location_mismatch`** (8.08%) — Geolocation anomaly
6. **`failed_attempts_last_24h`** (5.41%) — PIN brute-force signal
7. **`is_elderly`** (4.75%) — Senior vulnerability factor
8. **`amount_deviation_score`** (4.17%) — Deviation from typical spending

---

## 👴 Elderly Protection & Voice Guardian

Sahi UPI pays special attention to senior citizens who are frequently targeted by scam artists:

- **Pre-Payment Interception:** If a senior citizen initiates a payment to a collect request or high-risk recipient, Sahi UPI opens a high-contrast modal halting PIN entry.
- **Multilingual Spoken Warnings:**
  - **English:** *"Warning! Never enter your UPI PIN to claim prizes or lottery. If you proceed, ₹25,000 will be taken from your bank account."*
  - **Hindi (हिंदी):** *"सावधान! इनाम या लॉटरी पाने के लिए कभी UPI पिन न डालें। ऐसा करने पर आपके खाते से पैसे कट जाएंगे।"*
  - **Telugu (తెలుగు):** *"హెచ్చరిక! బహుమతులు పొందడానికి ఎప్పుడూ UPI పిన్ నమోదు చేయకండి. అలా చేస్తే మీ ఖాతా నుండి డబ్బు కట్ అవుతాయి."*

---

## ⚙️ Installation and Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_GITHUB_REPOSITORY_URL>/sahi_upi.git
cd sahi_upi
```

### 2. Set Up and Train the ML Models (Optional - Pretrained models included)
```bash
cd ml_engine
pip install -r requirements.txt
python train.py
cd ..
```

### 3. Set Up & Run the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
- **Backend API:** `http://127.0.0.1:8000`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

### 4. Set Up & Run the React Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
- **React Frontend:** `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and ML model readiness |
| `POST` | `/api/transaction` | Analyzes transaction, returns risk score, classification, and XAI warnings |
| `GET` | `/api/stats` | Aggregated real-time metrics (scans, blocked threats, protection rate) |
| `GET` | `/api/transactions` | Lists transactions from SQLite with search and status filters |
| `GET` | `/api/model/metrics` | Returns trained XGBoost metrics, confusion matrix, and feature importances |
| `GET` | `/api/scenarios` | Pre-configured test scenarios (Kirana safe, KBC scam, Electricity fraud) |
| `POST` | `/api/emergency/freeze` | Immediately locks user's outgoing UPI payments |
| `POST | `/api/emergency/unfreeze` | Restores payment privileges after verification |
| `POST` | `/api/emergency/report` | Submits fraud incident and generates 1930 Cyber Complaint Ack Number |

---

## 🎯 Project Highlights

- ✅ **XGBoost-Powered Fraud Detection:** Real-time inference classifying transactions into Low, Medium, and High Risk.
- ✅ **Pre-Payment Safety Interception:** Stops fraudulent collect requests and lottery scams before PIN entry.
- ✅ **Elderly-Friendly Accessibility Mode:** Senior Citizen design with large touch targets, simplified terms, and high contrast.
- ✅ **Multilingual Voice Guardian:** Text-to-Speech alerts in **English, Hindi, and Telugu**.
- ✅ **FastAPI & SQLite Architecture:** Complete async backend with persistent database storage.
- ✅ **Interactive Testing Lab:** 1-click test scenarios and live parameters customizer.
- ✅ **Emergency Response Suite:** Immediate account freeze and 1930 Cyber Helpline integration.

---

## 👨‍💻 Developed By

**Karthik Chukkala**  
Artificial Intelligence & Data Science  
**Chaitanya Bharathi Institute of Technology (CBIT)**  

---

⭐ *If you find Sahi UPI interesting or impactful for digital payment safety, please consider giving the repository a star!*

**🛡️ Sahi UPI – Making Every Digital Payment Safer.**
