const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const mlProcess = require('./services/mlProcess');
const geminiService = require('./services/geminiService');
const featureStore = require('./store/featureStore');

const app = express();
app.use(cors());
app.use(express.json());

// Start the ML Child Process
mlProcess.start();

// Mock Transaction Endpoint
app.post('/api/transaction', async (req, res) => {
  try {
    const transaction = req.body;
    const txId = transaction.transaction_id || uuidv4();
    const userId = transaction.user_id || 'user_123';
    
    // 1. Get/Calculate Features
    const features = featureStore.getFeatures(
      userId, 
      transaction.amount || 500, 
      transaction.lat || 17.3850, 
      transaction.lon || 78.4867
    );

    // 2. Add to store
    featureStore.addTransaction({
      ...transaction,
      transaction_id: txId,
      user_id: userId
    });

    // 3. Get Risk Score from ML Process
    // Ensure features are floats/ints as expected by python
    let riskScore = 0;
    let isFraud = false;
    
    try {
      const mlResult = await mlProcess.predict(features, txId);
      riskScore = mlResult.risk_score;
      isFraud = mlResult.is_fraud;
    } catch (e) {
      console.error("ML Prediction Error:", e);
      // Fallback logic
      riskScore = features.amount > 50000 || features.distance_from_home > 500 ? 0.8 : 0.1;
      isFraud = riskScore > 0.5;
    }

    let status = isFraud ? 'Blocked' : 'Verified';
    if (riskScore > 0.4 && riskScore <= 0.6) status = 'Suspicious';

    // 4. If Suspicious/Fraud, Get XAI from Gemini
    let aiExplanation = null;
    if (status !== 'Verified') {
      aiExplanation = await geminiService.generateExplanation(transaction, riskScore, features);
    }

    res.json({
      ...transaction,
      transaction_id: txId,
      status: status,
      risk_score: riskScore,
      features_used: features,
      ai_analysis: aiExplanation
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint for Dashboard Stats (Mock Data)
app.get('/api/stats', (req, res) => {
  res.json({
    protectionRate: 99.7,
    avgResponseMs: 142,
    todayScans: 2847,
    threatsBlocked: 156,
    usersProtected: "48.2K"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
