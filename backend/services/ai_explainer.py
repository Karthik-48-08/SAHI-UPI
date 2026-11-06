import os
import json
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

class AIExplainer:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.model = None
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                print("Gemini SDK Init Notice:", e)
                self.model = None

    def explain(self, transaction, risk_score, risk_indicators, is_elderly=False):
        """
        Generates human-readable, elderly-friendly explainable safety advice
        and voice warning scripts in English, Telugu, and Hindi.
        """
        amount = transaction.get("amount", 0)
        receiver = transaction.get("merchant_name") or transaction.get("receiver_name") or "Unknown Recipient"
        upi_id = transaction.get("receiver_upi_id", "")
        tx_type = transaction.get("transaction_type", "P2P")
        indicators_str = ", ".join(risk_indicators) if risk_indicators else "None"

        # Try Gemini API if key is configured
        if self.model:
            try:
                prompt = f"""
                You are Sahi UPI, an AI safety guardian protecting users (especially senior citizens) in India from digital payment fraud.
                A transaction has been assessed with a Risk Score of {risk_score * 100:.1f}%.
                
                Transaction Details:
                - Recipient: {receiver} ({upi_id})
                - Amount: ₹{amount}
                - Type: {tx_type}
                - Elderly User Flag: {is_elderly}
                - Suspicious Indicators: {indicators_str}
                
                Please generate:
                1. "reason_english": A 1-2 sentence clear, calm, plain-English explanation of why this transaction is suspicious or risky.
                2. "warning_english": A spoken alert suitable for voice-over text-to-speech warning the user.
                3. "warning_hindi": The same spoken warning in simple Hindi (Devanagari script).
                4. "warning_telugu": The same spoken warning in clear Telugu script.
                5. "safety_tips": List of 2 specific actionable tips for the user (e.g., 'Never enter PIN to receive money').
                
                Return JSON only with keys: reason_english, warning_english, warning_hindi, warning_telugu, safety_tips.
                """
                response = self.model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                if response and response.text:
                    parsed = json.loads(response.text)
                    return parsed
            except Exception as err:
                print("Gemini API fallback to rule-based explainer:", err)

        # Context-Aware Rule-Based Explainer Engine
        return self._rule_based_explain(transaction, risk_score, risk_indicators, is_elderly)

    def _rule_based_explain(self, transaction, risk_score, risk_indicators, is_elderly):
        amount = transaction.get("amount", 0)
        receiver = (transaction.get("merchant_name") or transaction.get("receiver_name") or "the recipient").lower()
        new_device = any("Device" in ind for ind in risk_indicators)
        ip_mismatch = any("IP" in ind or "Geolocation" in ind for ind in risk_indicators)
        night_tx = any("Night" in ind for ind in risk_indicators)
        failed_attempts = any("Failed" in ind for ind in risk_indicators)
        velocity = any("Velocity" in ind for ind in risk_indicators)

        # Scenario 1: High Risk & Potential Collect Request / Lottery / Impersonation
        if "lottery" in receiver or "win" in receiver or "kbc" in receiver or "prize" in receiver or "cashback" in receiver:
            reason = f"Urgent collect request pretending to be a lottery or reward. Entering your UPI PIN is only for sending money, never receiving cash rewards."
            warn_en = f"Attention! Never enter your UPI PIN to claim prizes or lottery. If you proceed, ₹{amount:,.0f} will be taken from your bank account."
            warn_hi = f"सावधान! इनाम या लॉटरी पाने के लिए कभी UPI पिन न डालें। ऐसा करने पर आपके खाते से ₹{amount:,.0f} कट जाएंगे।"
            warn_te = f"హెచ్చరిక! బహుమతులు పొందడానికి ఎప్పుడూ UPI పిన్ నమోదు చేయకండి. అలా చేస్తే మీ ఖాతా నుండి ₹{amount:,.0f} కట్ అవుతాయి."
            tips = [
                "You NEVER need to enter your UPI PIN to receive money.",
                "Real banks and lotteries never ask for UPI payments to release funds."
            ]
        # Scenario 2: Utility / Bill Disconnection scam
        elif "bill" in receiver or "electricity" in receiver or "support" in receiver or "customer" in receiver:
            reason = f"Payment request to an unverified private UPI account masquerading as utility or customer support."
            warn_en = f"Warning! Do not pay electricity or utility bills to private UPI addresses. Please verify through your official electricity board app."
            warn_hi = f"चेतावनी! किसी भी निजी UPI आईडी पर बिजली बिल का भुगतान न करें। कृपया आधिकारिक ऐप से पुष्टि करें।"
            warn_te = f"హెచ్చరిక! ప్రైవేట్ UPI ఐడీలకు విద్యుత్ బిల్లులు చెల్లించవద్దు. అధికారిక యాప్ ద్వారా నిర్ధారించుకోండి."
            tips = [
                "Electricity boards never disconnect power without official SMS notices with your Consumer Number.",
                "Always pay bills inside authorized apps like PhonePe, GPay, or official government portals."
            ]
        # Scenario 3: Device or Location anomaly
        elif new_device or ip_mismatch:
            reason = f"Transaction initiated from an unrecognized device or unusual geolocation differs from your registered city."
            warn_en = f"Caution! An unfamiliar device is attempting a payment of ₹{amount:,.0f}. If you did not initiate this, freeze your UPI immediately."
            warn_hi = f"सावधान! एक नए डिवाइस से ₹{amount:,.0f} के भुगतान का प्रयास किया गया है। यदि यह आप नहीं हैं, तो तुरंत खाता फ्रीज करें।"
            warn_te = f"జాగ్రత్త! కొత్త డివైస్ నుండి ₹{amount:,.0f} చెల్లింపు ప్రయత్నం జరిగింది. ఇది మీరు కాకపోతే వెంటనే మీ UPI ని ఫ్రీజ్ చేయండి."
            tips = [
                "Verify that your phone has not been cloned or accessed remotely via AnyDesk/TeamViewer.",
                "Do not share OTP or UPI PIN with anyone claiming to help you."
            ]
        # Scenario 4: High Amount or Rapid Velocity for Seniors
        elif is_elderly and risk_score >= 0.50:
            reason = f"Unusually large transaction amount ({amount:,.0f} INR) detected for a senior citizen profile with elevated risk indicators."
            warn_en = f"Sahi UPI Safety Alert: This payment of ₹{amount:,.0f} is higher than your regular spending. Please verify the recipient's phone number before entering your PIN."
            warn_hi = f"सही UPI सुरक्षा चेतावनी: यह ₹{amount:,.0f} का भुगतान आपके सामान्य खर्च से अधिक है। कृपया पिन डालने से पहले प्राप्तकर्ता की पुष्टि करें।"
            warn_te = f"సహీ UPI భద్రతా హెచ్చరిక: ఈ ₹{amount:,.0f} చెల్లింపు మీ సాధారణ ఖర్చు కంటే చాలా ఎక్కువ. పిన్ ఎంటర్ చేసే ముందు గ్రహీతను నిర్ధారించండి."
            tips = [
                "Call the recipient directly on their known phone number to verify payment details.",
                "Ask a trusted family member if someone guided you to make this payment."
            ]
        # Scenario 5: General Suspicious
        elif risk_score >= 0.30:
            reason = f"Unusual payment pattern detected with deviation from normal spending behavior."
            warn_en = f"Notice: This payment of ₹{amount:,.0f} has unusual patterns. Verify the recipient before authorizing."
            warn_hi = f"सूचना: इस लेनदेन में असामान्य पैटर्न पाया गया है। कृपया आगे बढ़ने से पहले विवरण जांचें।"
            warn_te = f"గమనిక: ఈ లావాదేవీలో అసాధారణ విధానం గమనించబడింది. దయచేసి వివరాలను సరిచూసుకోండి."
            tips = [
                "Double check the UPI ID name matches the intended recipient.",
                "Ensure you initiated this payment deliberately."
            ]
        # Safe / Low Risk
        else:
            reason = "Transaction behavior matches your standard profile and verified merchant criteria."
            warn_en = f"Verified safe transaction of ₹{amount:,.0f}."
            warn_hi = f"सत्यापित सुरक्षित लेनदेन ₹{amount:,.0f}।"
            warn_te = f"ధృవీకరించబడిన సురక్షిత లావాదేవీ ₹{amount:,.0f}."
            tips = [
                "Safe to proceed.",
                "Keep your UPI PIN confidential at all times."
            ]

        return {
            "reason_english": reason,
            "warning_english": warn_en,
            "warning_hindi": warn_hi,
            "warning_telugu": warn_te,
            "safety_tips": tips
        }

_explainer = None

def get_explainer():
    global _explainer
    if _explainer is None:
        _explainer = AIExplainer()
    return _explainer
