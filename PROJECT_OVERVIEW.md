# Sahi-UPI Project Overview

## 1. Project in One Sentence

Sahi-UPI is an AI-assisted UPI transaction protection platform that analyzes transaction behavior in real time, identifies suspicious activity, explains the risk, and gives users an optional multilingual voice warning.

## 2. Why This Project Exists

Digital payments are convenient because they are immediate, but the same speed makes fraud difficult to stop. A payment may be suspicious because of a combination of signals rather than one obvious rule:

- The amount is much larger than the user's normal behavior.
- Many payments are attempted within a short period.
- The transaction occurs far from the user's usual location.
- The payment is made from a new or unusual device.
- The transaction occurs at an unusual time.
- The user's recent activity does not match their established profile.

Sahi-UPI demonstrates how these signals can be combined into a real-time risk decision that is easier for a human to understand and act upon.

## 3. Who Are the Users?

### Primary users: Fraud-monitoring teams

Banks, payment service providers, fintech companies, and UPI operations teams can use a system like this to monitor transaction risk. They need a rapid view of incoming activity, alerts for unusual behavior, and enough context to decide whether an event needs investigation.

### Secondary users: Customer-support and fraud-investigation teams

Support and investigation teams can use the risk score, model features, transaction history, and explanation to respond to customers who report suspicious activity. The explanation helps them communicate why a transaction was flagged.

### End users: UPI customers

A customer can receive an understandable warning before or after a suspicious payment. The multilingual voice capability is intended to make alerts more accessible to users who prefer English, Hindi, or Telugu.

### Technical users: Data scientists and developers

Data scientists can use the synthetic dataset and training pipeline to experiment with fraud features and models. Developers can use the project as a reference for connecting a web application, an API, and a Python machine-learning service.

### Educational users

Students and project reviewers can use the application to understand the complete path from data preparation to model inference to user-facing explainability.

## 4. What Existing Systems Does It Represent?

Sahi-UPI is a prototype representation of several systems that commonly exist in a real payment ecosystem:

| Existing system | Role represented by Sahi-UPI |
| --- | --- |
| UPI transaction gateway | Produces transaction events that need to be checked. |
| Fraud-detection engine | Scores each transaction using behavioral and statistical models. |
| Customer profile or feature store | Keeps recent user behavior used to calculate risk features. |
| Case-management or fraud-operations dashboard | Shows transactions, risk levels, and explanations to monitoring teams. |
| Explainable-AI service | Converts a technical model result into a human-readable reason. |
| Notification or voice-alert system | Communicates warnings to the customer in multiple languages. |
| Merchant and user data systems | Provide context about users, merchants, locations, and transaction history. |

The repository does not connect to a real bank, NPCI, UPI switch, or production customer database. Those systems are represented with synthetic data, mock statistics, an in-memory store, and a local demonstration dashboard.

## 5. How the Project Works

The project has four major layers:

```text
User or demo transaction
          |
          v
React dashboard
          |
          v
Express API
          |
          +--> Feature store: velocity and location features
          |
          +--> Python ML engine: fraud and anomaly scores
          |
          +--> Explanation service: reason and warning message
          |
          v
Risk status, explanation, and optional voice alert
```

### Step 1: A transaction is created

The current dashboard creates synthetic transactions automatically every five seconds. Each transaction contains information such as amount, merchant, location, latitude, longitude, and user ID.

In a future deployment, this event would come from a payment gateway or transaction-streaming system instead of the demo generator.

### Step 2: The API receives the transaction

The frontend sends the transaction as JSON to:

```text
POST /api/transaction
```

The Express backend assigns an ID when one is not supplied and uses a default user when required fields are missing.

### Step 3: Behavioral features are calculated

The feature store looks at the user's recent in-memory transactions and calculates:

- Transaction amount.
- Number of transactions during the previous hour.
- Approximate distance from the user's first recorded location.

These features describe how different the current payment is from recent behavior.

### Step 4: The machine-learning models score the event

The backend sends the features to a long-running Python process. The Python process loads two stored models:

- A Random Forest classifier estimates the probability of known fraud patterns.
- An Isolation Forest estimates how unusual the transaction is compared with normal data.

The two values are combined into one risk score.

### Step 5: The backend makes a decision

The score is converted into a user-facing status:

- `Verified`: low risk.
- `Suspicious`: intermediate risk and worth reviewing.
- `Blocked`: high risk according to the current prototype rules.

If the Python process is unavailable, the backend uses a simple fallback rule based on amount and distance so the API can still respond.

### Step 6: The system explains the decision

For suspicious and blocked transactions, the application requests an explanation from Gemini when an API key is configured. Without a key, a local fallback explanation is used.

The explanation includes:

- The primary reason for the risk.
- An English warning.
- A Hindi warning.
- A Telugu warning.

### Step 7: The dashboard presents the result

The dashboard shows the transaction status, risk score, model features, explanation, and a voice-control panel. The user can select a language and ask the browser to speak the warning.

## 6. Main Components

### Frontend: React and Vite

The frontend is the visual control center of the project. It contains:

- A dashboard summary.
- A real-time transaction feed.
- An AI-analysis panel.
- Risk feature indicators.
- Emergency-action controls.
- A multilingual Voice Guardian panel.

The frontend communicates with the backend using HTTP and JSON.

### Backend: Node.js and Express

The backend coordinates the application. It:

- Accepts API requests.
- Generates transaction IDs.
- Calculates behavioral features.
- Stores recent transactions in memory.
- Requests model predictions.
- Applies risk thresholds.
- Requests explanations.
- Returns one combined response to the frontend.

### Machine-learning engine: Python

The Python engine is separated from Node so that model training and inference can use the Python data-science ecosystem. It communicates with Node using newline-delimited JSON through standard input and output.

### Feature store

The current feature store is a simple in-memory JavaScript object organized by user ID. It is intentionally easy to understand for a prototype. It is not durable and is cleared whenever the backend restarts.

### Dataset

The dataset is synthetic and models a UPI ecosystem containing transactions, users, merchants, and fraud labels. It includes behavioral, time, location, device, payment-app, KYC, and transaction-status fields.

### Explanation and voice systems

Gemini is used as an optional explainability layer. The browser's Web Speech API provides optional audio output. These layers do not make the fraud decision; they communicate the result produced by the risk pipeline.

## 7. How It Can Be Used

### Use case 1: Live transaction monitoring

An operations analyst opens the dashboard and watches incoming transactions. Verified transactions remain available in the feed, while suspicious and blocked events are visually emphasized.

### Use case 2: Customer warning

A customer-support agent selects a suspicious transaction, reads the explanation, and plays the warning in the customer's preferred language.

### Use case 3: Fraud-model demonstration

A data-science team can modify the training features, retrain the models, save new artifacts, and observe how risk scores change in the live application.

### Use case 4: Feature-engineering experiment

Developers can alter velocity, distance, amount, or other behavioral features and use the dashboard to see how those changes affect risk classification.

### Use case 5: Academic or project presentation

The application demonstrates a complete applied-AI pipeline: data, training, model serving, backend integration, explainability, frontend visualization, and accessibility.

### Use case 6: Operator review and evidence capture

The dashboard supports a small but realistic review workflow. An operator can pause the event stream, search for a merchant or location, filter the queue by `Verified`, `Suspicious`, or `Blocked`, trigger a controlled high-risk scenario, and export the visible transaction history as CSV. These functions make the system easier to evaluate during a presentation and provide a clear bridge toward a future case-management workflow.

The selected transaction also supports simulated human actions: `Reviewed`, `Escalated`, and `False positive`. Account freeze/unfreeze is represented as a visible demo action, and each action is written to a local audit trail and included in CSV evidence. This models the operator-response gap found in many scoring-only prototypes without changing the underlying ML decision.

## 8. Presentation Demonstration Flow

A clear demonstration can follow this sequence:

1. Open the dashboard at `http://localhost:5173`.
2. Explain that the feed is receiving synthetic transactions.
3. Select a transaction from the live feed.
4. Show the risk score and the three model features.
5. Point out the status: Verified, Suspicious, or Blocked.
6. Select a suspicious transaction when available.
7. Show the generated explanation and warning message.
8. Switch the Voice Guardian language.
9. Play the warning using the browser speech feature.
10. Open the backend endpoint or terminal to show that the frontend is connected to a live API.

For a controlled demonstration, submit a transaction manually with a large amount or distant coordinates. The current backend fallback logic treats an amount above 50,000 or a distance above 500 kilometers as high risk when model inference is unavailable.

## 9. Inputs and Outputs

### Transaction input

A transaction may contain:

```json
{
  "amount": 500,
  "merchant_name": "Local Mart",
  "location_name": "Hyderabad, TS",
  "lat": 17.385,
  "lon": 78.4867,
  "user_id": "user_001"
}
```

### Transaction output

The API returns the original transaction together with:

```json
{
  "transaction_id": "generated-id",
  "status": "Verified",
  "risk_score": 0.119,
  "features_used": {
    "amount": 500,
    "transaction_velocity": 1,
    "distance_from_home": 0
  },
  "ai_analysis": null
}
```

For a suspicious or blocked transaction, `ai_analysis` contains the reason and localized warning messages.

## 10. What Makes the Solution Useful?

### Behavioral context

The system does not treat every transaction with the same baseline. It considers the user's recent velocity and location, making the decision more personalized than a single global amount threshold.

### Hybrid detection

The combination of Random Forest and Isolation Forest allows the prototype to detect both known fraud patterns and unusual behavior that may not exactly match labeled examples.

### Explainability

A risk score alone is difficult for a customer or support agent to act upon. The explanation layer turns the result into a short reason and warning.

### Accessibility

Multilingual text and browser-based voice output make the warning easier to understand for users with different language preferences.

### Modular design

The frontend, API, feature store, ML engine, and explanation service are separate components. Each can be replaced or expanded without redesigning the whole project.

### Human-in-the-loop review

The operator is not forced to accept an opaque automated decision. The dashboard exposes the event stream, risk evidence, filtering controls, controlled demo scenarios, and export capability so a reviewer can inspect what happened and preserve evidence for a discussion or investigation.

### Case-response simulation

The prototype demonstrates what happens after a risk decision: an analyst can review or escalate the event, record a false-positive outcome, simulate account protection, and inspect an audit trail. In a production system, these actions would connect to a case-management system, customer-notification service, or account-control API.

## 10A. Research-Informed Design Basis

The monitoring workflow is informed by the [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), which describes voluntary practices for improving trustworthiness in AI systems. The project applies those ideas at prototype scale through visible risk evidence, human review controls, exportable transaction records, repeatable evaluation scenarios, and an explicit separation between a working demonstration and validated production performance.

This is design guidance, not a compliance claim.

## 11. Current Scope and Assumptions

The current application is a demonstration prototype with the following assumptions:

- Transactions are synthetic.
- The dashboard generates demo transactions automatically.
- User history is stored only in process memory.
- The feature set is intentionally small.
- Dashboard statistics are mock values.
- Model thresholds are fixed in the backend.
- Gemini is optional and has a local fallback.
- Authentication and authorization are not implemented.
- The application does not execute or reverse real payments.
- The current model artifacts may have been produced with a different scikit-learn version than the runtime.

## 12. What This Project Is Not

Sahi-UPI is not:

- A real UPI payment gateway.
- A replacement for a bank's fraud-operations platform.
- A production-grade risk engine.
- A regulatory compliance system.
- A guaranteed fraud detector.
- A system that should block real payments without additional validation.

Its purpose is to demonstrate the architecture and user experience of an explainable, behavior-aware transaction-risk system.

## 13. Expected Benefits in a Real Deployment

With production engineering, a system based on this design could help organizations:

- Reduce the time needed to review suspicious transactions.
- Prioritize high-risk events for human investigation.
- Provide more useful customer warnings than generic decline messages.
- Detect behavior that does not match a user's normal profile.
- Improve communication between fraud models, support teams, and customers.
- Create an auditable risk-decision workflow.

These benefits would need to be measured with real operational data and carefully selected metrics such as recall, precision, false-positive rate, customer-impact rate, detection latency, and prevented-loss value.

## 14. Future Evolution

A production-oriented version would add:

1. A durable transaction and feature store.
2. Streaming ingestion from a payment-event platform.
3. More reliable geospatial, device, and account features.
4. Model monitoring, drift detection, and retraining workflows.
5. Calibrated thresholds for different transaction types and user segments.
6. Formal evaluation using precision, recall, F1-score, PR-AUC, ROC-AUC, and cost-based metrics.
7. Secure authentication, authorization, rate limiting, and audit logs.
8. Robust process supervision and health endpoints for the Python service.
9. Versioned model artifacts and pinned training/runtime dependencies.
10. Human review workflows for disputed or borderline transactions.

## 15. Final Presentation Summary

Sahi-UPI demonstrates how a modern fraud-protection workflow can connect data engineering, machine learning, backend services, explainable AI, and an accessible frontend in one application.

The key message for a presentation is:

> Sahi-UPI does not only assign a fraud score. It turns behavioral signals into a decision, an explanation, and an understandable warning that a human can act upon.

The current implementation proves the end-to-end integration. The next stage is to replace the prototype elements with persistent data, formal model evaluation, stronger reliability, security controls, and production-grade monitoring.
