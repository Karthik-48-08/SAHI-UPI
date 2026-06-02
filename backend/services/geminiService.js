const { GoogleGenerativeAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

// The new @google/genai SDK works slightly differently.
// Let's use the standard @google/generative-ai for simplicity if @google/genai isn't available, but we installed @google/genai.
// Actually, the new SDK `@google/genai` is available. Let me set it up properly or default to standard REST if needed.
// To be safe, I'll use the prompt approach with standard generative-ai or the newer genai if the user has it.
// Let's mock the SDK call if the key is invalid.

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      try {
        // Fallback to fetch if SDK isn't exactly matching
        this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`;
      } catch (e) {
        console.error("Gemini SDK Init Error:", e);
      }
    }
  }

  async generateExplanation(transaction, riskScore, features) {
    if (!this.apiKey) {
      return this._mockExplanation(transaction, riskScore, features);
    }

    const prompt = `
      Act as an Explainable AI (XAI) for Sahi-UPI, a real-time behavioral anomaly detection system for financial fraud.
      A transaction has been flagged as suspicious.
      
      Transaction Details:
      - Amount: ₹${transaction.amount}
      - Risk Score: ${(riskScore * 100).toFixed(1)}%
      - Transaction Velocity (last hr): ${features.transaction_velocity}
      - Distance from Home: ${features.distance_from_home.toFixed(2)} km
      - Merchant: ${transaction.merchant_name}
      
      Provide a brief, human-readable 'Fraud Reason' explaining why this is flagged in 2 sentences. 
      Then, provide a localized warning message in English, Telugu, and Hindi that a voice assistant could speak to warn the user.
      
      Return ONLY a JSON object with this exact structure:
      {
        "reason_english": "...",
        "warning_english": "...",
        "warning_hindi": "...",
        "warning_telugu": "..."
      }
    `;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const text = data.candidates[0].content.parts[0].text;
        return JSON.parse(text);
      } else {
        throw new Error("Invalid Gemini response");
      }

    } catch (error) {
      console.error("Gemini API Error:", error);
      return this._mockExplanation(transaction, riskScore, features);
    }
  }

  _mockExplanation(transaction, riskScore, features) {
    let reason = "Unusual activity detected.";
    if (features.transaction_velocity > 5) reason = "High frequency of transactions in a short period.";
    if (features.distance_from_home > 500) reason = "Transaction location is suspiciously far from home.";

    return {
      reason_english: reason,
      warning_english: `Warning! This transaction of ₹${transaction.amount} appears suspicious. Please verify before proceeding.`,
      warning_hindi: "सावधान! यह लेनदेन संदिग्ध लग रहा है। कृपया पुष्टि करें।",
      warning_telugu: "హెచ్చరిక! ఈ లావాదేవీ అనుమానాస్పదంగా ఉంది. దయచేసి నిర్ధారించండి."
    };
  }
}

module.exports = new GeminiService();
