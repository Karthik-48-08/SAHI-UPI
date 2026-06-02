import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';

const VoiceGuardian = ({ transaction }) => {
  const [language, setLanguage] = useState('english');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // If a new suspicious transaction comes in, auto-play or suggest playing
    if (transaction && (transaction.status === 'Blocked' || transaction.status === 'Suspicious')) {
      // In a real browser, auto-play might be blocked without user interaction.
      // But we can trigger it if the user has already engaged with the page.
    }
  }, [transaction]);

  const handleSpeak = () => {
    if (!transaction || !transaction.ai_analysis) return;

    // Check if browser supports Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const textToSpeak = language === 'telugu' 
        ? transaction.ai_analysis.warning_telugu 
        : language === 'hindi'
        ? transaction.ai_analysis.warning_hindi
        : (transaction.ai_analysis.warning_english || transaction.ai_analysis.reason_english || "Warning, suspicious transaction detected.");

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Try to set appropriate language
      const targetLang = language === 'telugu' ? 'te-IN' : language === 'hindi' ? 'hi-IN' : 'en-IN';
      utterance.lang = targetLang;
      
      // Check if voice exists for the language
      const voices = window.speechSynthesis.getVoices();
      const hasVoice = voices.some(voice => voice.lang.startsWith(targetLang.split('-')[0]));
      
      if (!hasVoice && language === 'telugu') {
        alert("Telugu voice not found on your system! Please install the Telugu language pack in Windows Settings -> Time & Language -> Language, or try using Microsoft Edge which has built-in cloud voices.");
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.error("Speech Synthesis Error:", e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text to speech!");
    }
  };

  const hasWarning = transaction?.ai_analysis != null;

  return (
    <div className="bg-darkPanel border border-darkBorder rounded-lg p-4 h-[300px] flex flex-col mt-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Volume2 className="text-brandPurple" size={20} />
          <div>
            <h3 className="font-bold text-primaryText">Voice Guardian</h3>
            <p className="text-[10px] text-secondaryText">Audio fraud detection assistant</p>
          </div>
        </div>
        
        {/* Language Toggle */}
        <div className="flex bg-darkBg rounded p-1 border border-darkBorder">
          <button 
            onClick={() => setLanguage('english')}
            className={`text-[10px] px-2 py-1 rounded ${language === 'english' ? 'bg-darkBorder text-primaryText' : 'text-secondaryText'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('hindi')}
            className={`text-[10px] px-2 py-1 rounded ${language === 'hindi' ? 'bg-darkBorder text-primaryText' : 'text-secondaryText'}`}
          >
            A/अ
          </button>
          <button 
            onClick={() => setLanguage('telugu')}
            className={`text-[10px] px-2 py-1 rounded ${language === 'telugu' ? 'bg-darkBorder text-primaryText' : 'text-secondaryText'}`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isSpeaking ? 'bg-brandPurple text-white animate-pulse' : 'bg-darkBg text-secondaryText border border-darkBorder'}`}>
          <Mic size={24} />
        </div>
        
        <p className="text-sm text-secondaryText mb-4">
          {hasWarning ? "Tap to activate voice check" : "Select a suspicious transaction"}
        </p>

        <button 
          onClick={handleSpeak}
          disabled={!hasWarning}
          className={`px-4 py-2 rounded font-semibold w-full flex justify-center items-center gap-2 transition-all ${
            hasWarning 
              ? 'bg-brandPurple hover:bg-purple-600 text-white' 
              : 'bg-darkBorder text-secondaryText cursor-not-allowed'
          }`}
        >
          {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
          {isSpeaking ? 'Stop Audio' : 'Activate Voice Guardian'}
        </button>

        <p className="text-[10px] text-secondaryText mt-3 mt-auto">
          Voice Guardian speaks alerts in English, Hindi and Telugu for accessibility
        </p>
      </div>
    </div>
  );
};

export default VoiceGuardian;
