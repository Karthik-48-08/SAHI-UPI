# Requirements Document: Sahi-UPI AI Guardian

## Introduction

Sahi-UPI AI Guardian is a fraud protection system designed to protect rural and non-tech-savvy Indian users from UPI (Unified Payments Interface) fraud. The system provides real-time transaction monitoring, AI-powered fraud detection, voice-based alerts, and emergency response capabilities. The interface is designed to be accessible, trustworthy, and easy to understand for users with limited technical literacy.

## Glossary

- **UPI**: Unified Payments Interface - India's instant payment system
- **Transaction_Monitor**: Component that observes and records UPI transactions in real-time
- **AI_Fraud_Analyzer**: Component that evaluates transactions using Gemini API to detect fraud patterns
- **Voice_Guardian**: Component that provides audio fraud warnings with visual feedback
- **Dashboard_UI**: User interface displaying security status, transactions, and fraud analysis
- **Emergency_Controller**: Component that handles fraud reporting and account freezing
- **Risk_Score**: Numerical value (0-100%) indicating fraud probability
- **Sense_Think_Act_Logic**: Three-stage AI reasoning process for fraud detection
- **QR_Code_Scam**: Common fraud pattern where malicious QR codes trick users into unauthorized payments
- **Bilingual_Support**: System capability to display content in English and Telugu languages

## Requirements

### Requirement 1: Real-time Transaction Monitoring

**User Story:** As a UPI user, I want to see my recent transactions in real-time, so that I can verify all payment activity on my account.

#### Acceptance Criteria

1. WHEN a UPI transaction occurs, THE Transaction_Monitor SHALL capture the transaction details within 2 seconds
2. WHEN displaying transactions, THE Dashboard_UI SHALL show transaction amount, recipient, timestamp, and status
3. THE Dashboard_UI SHALL display transactions in reverse chronological order with the most recent transaction first
4. WHEN a transaction is captured, THE Dashboard_UI SHALL update the transaction feed without requiring page refresh
5. THE Transaction_Monitor SHALL maintain a history of at least the 50 most recent transactions

### Requirement 2: AI-Powered Fraud Detection

**User Story:** As a UPI user, I want the system to automatically analyze transactions for fraud, so that I can be protected from scams without needing technical knowledge.

#### Acceptance Criteria

1. WHEN a transaction is captured, THE AI_Fraud_Analyzer SHALL evaluate it using the Gemini API within 3 seconds
2. WHEN analyzing a transaction, THE AI_Fraud_Analyzer SHALL generate a Risk_Score between 0 and 100 percent
3. WHEN the Risk_Score exceeds 70 percent, THE AI_Fraud_Analyzer SHALL classify the transaction as Suspicious
4. WHEN the Risk_Score exceeds 90 percent, THE AI_Fraud_Analyzer SHALL classify the transaction as Blocked
5. WHEN the Risk_Score is below 70 percent, THE AI_Fraud_Analyzer SHALL classify the transaction as Verified
6. THE AI_Fraud_Analyzer SHALL detect QR_Code_Scam patterns and flag them appropriately
7. WHEN generating a Risk_Score, THE AI_Fraud_Analyzer SHALL provide human-readable reasoning in both English and Telugu

### Requirement 3: Sense-Think-Act Logic Display

**User Story:** As a UPI user, I want to understand why the system flagged a transaction, so that I can learn to recognize fraud patterns myself.

#### Acceptance Criteria

1. WHEN displaying fraud analysis, THE Dashboard_UI SHALL show the Sense stage with detected transaction attributes
2. WHEN displaying fraud analysis, THE Dashboard_UI SHALL show the Think stage with AI reasoning process
3. WHEN displaying fraud analysis, THE Dashboard_UI SHALL show the Act stage with recommended action
4. THE Dashboard_UI SHALL present Sense_Think_Act_Logic in simple language appropriate for non-tech-savvy users
5. THE Dashboard_UI SHALL display all fraud analysis explanations in both English and Telugu

### Requirement 4: Voice-Based Fraud Warnings

**User Story:** As a non-tech-savvy user, I want to hear audio warnings about suspicious transactions, so that I can understand fraud alerts even if I cannot read the screen.

#### Acceptance Criteria

1. WHEN a transaction is classified as Suspicious or Blocked, THE Voice_Guardian SHALL generate an audio warning within 2 seconds
2. WHEN generating audio warnings, THE Voice_Guardian SHALL synthesize speech in the user's selected language
3. WHEN playing audio, THE Dashboard_UI SHALL display a visual waveform animation
4. WHEN audio is playing, THE Dashboard_UI SHALL show synchronized bilingual captions in English and Telugu
5. THE Voice_Guardian SHALL support voice synthesis for both English and Telugu languages
6. WHERE the user has enabled audio alerts, THE Voice_Guardian SHALL automatically play warnings for high-risk transactions

### Requirement 5: Security Status Display

**User Story:** As a UPI user, I want to see my overall security status at a glance, so that I know if my account is safe.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL display a hero header showing current security status
2. WHEN no suspicious activity is detected, THE Dashboard_UI SHALL show "Protected" status with Safety Green color
3. WHEN suspicious activity is detected, THE Dashboard_UI SHALL show "Alert" status with Alert Red color
4. WHEN displaying Protected status, THE Dashboard_UI SHALL animate the status indicator with a pulse effect
5. THE Dashboard_UI SHALL display the total number of users protected by the system
6. THE Dashboard_UI SHALL update security status within 3 seconds of any status change

### Requirement 6: Emergency Response Actions

**User Story:** As a UPI user experiencing fraud, I want to quickly report fraud and freeze my account, so that I can stop unauthorized transactions immediately.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL display a Report Fraud button that is always visible and accessible
2. THE Dashboard_UI SHALL display a Freeze Account button that is always visible and accessible
3. WHEN the user clicks Report Fraud, THE Emergency_Controller SHALL record the fraud report with timestamp and transaction details
4. WHEN the user clicks Freeze Account, THE Emergency_Controller SHALL initiate account freeze procedures within 1 second
5. WHEN emergency actions are triggered, THE Dashboard_UI SHALL display confirmation messages in both English and Telugu
6. THE Emergency_Controller SHALL prevent accidental activation by requiring user confirmation for Freeze Account action

### Requirement 7: Fraud Trend Monitoring

**User Story:** As a system administrator, I want to see fraud trends over time, so that I can understand attack patterns and improve protection.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL display a chart showing fraud detection trends over the past 30 days
2. WHEN displaying trends, THE Dashboard_UI SHALL show counts of Verified, Suspicious, and Blocked transactions
3. THE Dashboard_UI SHALL update trend charts daily with new fraud statistics
4. THE Dashboard_UI SHALL display the total number of fraud attempts blocked
5. THE Dashboard_UI SHALL show fraud trend data using clear visual indicators with Safety Green, Alert Red, and Trust Blue colors

### Requirement 8: Bilingual User Interface

**User Story:** As a Telugu-speaking user, I want to use the system in my native language, so that I can understand all fraud warnings and instructions.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL support display of all text content in English and Telugu
2. WHEN the user selects a language preference, THE Dashboard_UI SHALL persist the selection across sessions
3. THE Dashboard_UI SHALL display transaction status tags in the selected language
4. THE Dashboard_UI SHALL display all button labels and instructions in the selected language
5. WHEN language is changed, THE Dashboard_UI SHALL update all visible text within 1 second without page refresh

### Requirement 9: Accessible Visual Design

**User Story:** As a non-tech-savvy user, I want a clean and trustworthy interface, so that I feel confident using the fraud protection system.

#### Acceptance Criteria

1. THE Dashboard_UI SHALL use Safety Green color for verified and safe status indicators
2. THE Dashboard_UI SHALL use Alert Red color for suspicious and blocked status indicators
3. THE Dashboard_UI SHALL use Trust Blue color for informational elements and primary actions
4. THE Dashboard_UI SHALL use Lucide-react icons for all visual indicators
5. THE Dashboard_UI SHALL maintain sufficient color contrast ratios for readability
6. THE Dashboard_UI SHALL use clear typography appropriate for users with limited literacy
7. THE Dashboard_UI SHALL organize information in logical sections with clear visual hierarchy

### Requirement 10: Transaction Status Classification

**User Story:** As a UPI user, I want to quickly identify which transactions are safe and which are suspicious, so that I can take appropriate action.

#### Acceptance Criteria

1. WHEN displaying transactions, THE Dashboard_UI SHALL show a status tag for each transaction
2. THE Dashboard_UI SHALL display Verified tags in Safety Green for low-risk transactions
3. THE Dashboard_UI SHALL display Suspicious tags in Alert Red for medium-risk transactions
4. THE Dashboard_UI SHALL display Blocked tags in Alert Red with additional warning indicators for high-risk transactions
5. THE Dashboard_UI SHALL show the Risk_Score percentage alongside each transaction status
6. WHEN a user clicks on a transaction, THE Dashboard_UI SHALL display detailed fraud analysis for that transaction
