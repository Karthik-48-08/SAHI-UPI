import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Globe, Info } from 'lucide-react';

const VoiceGuardian = ({ transaction }) => {
  const [language, setLanguage] = useState('english');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const ai = transaction?.ai_analysis || {};
  const hasWarning = Boolean(transaction && (transaction.status === 'Blocked' || transaction.status === 'Suspicious' || ai.reason_english));

  const textToSpeak = language === 'telugu'
    ? (ai.warning_telugu || "హెచ్చరిక! ఈ లావాదేవీ అనుమానాస్పదంగా ఉంది. దయచేసి నిర్ధారించండి.")
    : language === 'hindi'
    ? (ai.warning_hindi || "सावधान! यह लेनदेन संदिग्ध लग रहा है। कृपया पुष्टि करें।")
    : (ai.warning_english || ai.reason_english || "Warning! This transaction appears suspicious. Please verify before proceeding.");

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const targetLang = language === 'telugu' ? 'te-IN' : language === 'hindi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.9; // clear, accessible pace

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-darkPanel border border-darkBorder rounded-2xl p-4 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="text-brandPurple" size={18} />
          <div>
            <h3 className="font-bold text-primaryText text-xs">Voice Guardian</h3>
            <p className="text-[10px] text-secondaryText">Elderly Audio Safety Assistant</p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex bg-darkBg rounded-lg p-0.5 border border-darkBorder">
          <button
            onClick={() => setLanguage('english')}
            className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
              language === 'english' ? 'bg-darkBorder text-primaryText' : 'text-secondaryText'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('hindi')}
            className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
              language === 'hindi' ? 'bg-darkBorder text-primaryText' : 'text-secondaryText'
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage('telugu')}
            className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
              language === 'telugu' ? 'bg-darkBorder text-primaryText' : 'text-secondaryText'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Main Mic Button & Audio Indicator */}
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <button
          onClick={handleSpeak}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
            isSpeaking
              ? 'bg-brandPurple text-white animate-pulse shadow-purple-500/50 scale-105'
              : 'bg-darkBg text-secondaryText hover:text-primaryText border border-darkBorder hover:border-brandPurple'
          }`}
          title="Click to play spoken voice alert"
        >
          {isSpeaking ? <Volume2 size={24} /> : <Mic size={22} />}
        </button>

        <p className="text-xs font-semibold text-primaryText mt-2">
          {isSpeaking ? "Speaking Audio Alert..." : hasWarning ? "Tap to Play Voice Warning" : "Voice Ready"}
        </p>
        <p className="text-[10px] text-secondaryText max-w-[220px] mt-0.5 line-clamp-2">
          "{textToSpeak}"
        </p>
      </div>

      {/* Accessibility Note */}
      <div className="bg-darkBg/60 border border-darkBorder rounded-xl p-2 mt-2 flex items-center gap-1.5 text-[10px] text-secondaryText">
        <Globe size={12} className="text-brandPurple shrink-0" />
        <span>Spoken in native {language === 'telugu' ? 'Telugu (తెలుగు)' : language === 'hindi' ? 'Hindi (हिंदी)' : 'Indian English'}</span>
      </div>
    </div>
  );
};

export default VoiceGuardian;
