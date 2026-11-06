import React, { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, PhoneCall, Lock, Volume2,
  X, CheckCircle, Info, HelpCircle, ArrowRight
} from 'lucide-react';

export default function ElderlySafetyModal({
  isOpen,
  onClose,
  transaction,
  onConfirmPayment,
  onEmergencyFreeze,
  onReportFraud
}) {
  if (!isOpen || !transaction) return null;

  const [activeLang, setActiveLang] = useState('english');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  const riskScore = transaction.risk_score || 0;
  const isHighRisk = transaction.risk_level === 'HIGH RISK' || transaction.status === 'Blocked' || riskScore >= 0.70;
  const isMediumRisk = transaction.risk_level === 'MEDIUM RISK' || transaction.status === 'Suspicious';

  const ai = transaction.ai_analysis || {};
  const spokenText = activeLang === 'telugu'
    ? (ai.warning_telugu || "హెచ్చరిక! ఈ లావాదేవీ అనుమానాస్పదంగా ఉంది.")
    : activeLang === 'hindi'
    ? (ai.warning_hindi || "सावधान! यह लेनदेन संदिग्ध लग रहा है।")
    : (ai.warning_english || ai.reason_english || "Warning! Suspicious transaction detected.");

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(spokenText);
      const targetLang = activeLang === 'telugu' ? 'te-IN' : activeLang === 'hindi' ? 'hi-IN' : 'en-IN';
      utterance.lang = targetLang;
      utterance.rate = 0.9; // Slightly slower for elderly comprehension
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border transition-all ${
        isHighRisk
          ? 'bg-slate-900 border-red-500/50 text-slate-100 shadow-red-500/20'
          : 'bg-slate-900 border-amber-500/50 text-slate-100 shadow-amber-500/20'
      }`}>
        
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {isHighRisk ? <ShieldAlert size={32} className="animate-pulse" /> : <AlertTriangle size={32} />}
            </div>
            <div>
              <span className={`text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full ${
                isHighRisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {isHighRisk ? '🛑 HIGH RISK FRAUD WARNING' : '⚠️ CAUTION: UNUSUAL PAYMENT'}
              </span>
              <h2 className="text-xl font-bold mt-1 text-white">
                {isHighRisk ? 'Wait! Do Not Enter Your PIN' : 'Review Before Paying'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 mb-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">Paying To</p>
            <p className="text-base font-bold text-white">{transaction.merchant_name || 'Recipient'}</p>
            <p className="text-xs text-slate-400">{transaction.receiver_upi_id || 'UPI Payment'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Amount</p>
            <p className="text-2xl font-black text-white">₹{Number(transaction.amount || 0).toLocaleString('en-IN')}</p>
            <span className="text-[11px] font-semibold text-red-400">
              Risk Score: {(riskScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Golden Rule for Elderly Protection */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 mb-4 flex items-start gap-3">
          <HelpCircle size={22} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 leading-relaxed">
            <strong className="block text-amber-300 font-bold mb-0.5">Golden Safety Rule:</strong>
            Entering your UPI PIN is <u>ONLY</u> used to <strong>SEND money</strong> from your account. You <strong>NEVER</strong> need to enter a UPI PIN to receive money, lottery prizes, or cashback!
          </div>
        </div>

        {/* Threat Explanation */}
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 mb-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Info size={14} className="text-indigo-400" /> Why Sahi UPI Flagged This
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">
            {ai.reason_english || "Unusual transaction characteristics detected by our XGBoost AI guardian."}
          </p>

          {/* Risk Indicator Tags */}
          {transaction.risk_indicators && transaction.risk_indicators.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {transaction.risk_indicators.map((ind, i) => (
                <span key={i} className="text-[11px] bg-red-950/60 border border-red-500/30 text-red-300 px-2.5 py-0.5 rounded-full">
                  • {ind}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Multilingual Voice Warning Section */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3.5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Volume2 size={16} /> Listen in your Language:
            </span>
            <div className="flex gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setActiveLang('english')}
                className={`px-2 py-0.5 rounded font-medium ${activeLang === 'english' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                English
              </button>
              <button
                onClick={() => setActiveLang('hindi')}
                className={`px-2 py-0.5 rounded font-medium ${activeLang === 'hindi' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setActiveLang('telugu')}
                className={`px-2 py-0.5 rounded font-medium ${activeLang === 'telugu' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                తెలుగు
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-300 italic truncate flex-1">
              "{spokenText}"
            </p>
            <button
              onClick={handleSpeak}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSpeaking ? 'bg-indigo-500 text-white animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Volume2 size={14} /> {isSpeaking ? 'Speaking...' : 'Play Voice'}
            </button>
          </div>
        </div>

        {/* Safety Actions */}
        <div className="space-y-2.5">
          {/* Main Action: Cancel & Protect */}
          <button
            onClick={() => {
              if (onReportFraud) onReportFraud(transaction);
              onClose();
            }}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <Lock size={16} /> Cancel Payment & Report Fraud
          </button>

          {/* Emergency Helpline button */}
          <a
            href="tel:1930"
            className="w-full py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <PhoneCall size={14} className="text-amber-400" /> Call Cyber Helpline (1930) / Family Guardian
          </a>

          {/* Emergency Freeze account */}
          <button
            onClick={() => {
              if (onEmergencyFreeze) onEmergencyFreeze();
              onClose();
            }}
            className="w-full py-2 rounded-xl text-xs font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 border border-amber-500/20 transition-colors"
          >
            Freeze My Account Immediately (Stop All Debits)
          </button>

          {/* Secondary Override with acknowledgment */}
          {!isHighRisk && (
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  onConfirmPayment(transaction);
                  onClose();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline font-medium"
              >
                I know this recipient, proceed anyway
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
