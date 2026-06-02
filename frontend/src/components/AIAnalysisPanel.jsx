import React from 'react';
import { BrainCircuit, Activity, Navigation, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const AIAnalysisPanel = ({ transaction }) => {
  if (!transaction) {
    return (
      <div className="bg-darkPanel border border-darkBorder rounded-lg h-[600px] flex flex-col items-center justify-center text-center p-6">
        <BrainCircuit size={48} className="text-darkBorder mb-4 opacity-50" />
        <h3 className="text-primaryText font-semibold">Select a transaction to view AI analysis</h3>
        <p className="text-secondaryText text-sm mt-2">Click on any transaction from the feed</p>
      </div>
    );
  }

  const { status, risk_score, features_used, ai_analysis } = transaction;
  const isHighRisk = status === 'Blocked' || status === 'Suspicious';

  return (
    <div className="bg-darkPanel border border-darkBorder rounded-lg h-[600px] flex flex-col">
      <div className="p-4 border-b border-darkBorder flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-brandPurple" size={20} />
          <h3 className="font-bold text-primaryText">AI Analysis Engine</h3>
        </div>
        <div className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          isHighRisk ? 'bg-brandRed/10 text-brandRed border border-brandRed/20' : 'bg-brandGreen/10 text-brandGreen border border-brandGreen/20'
        }`}>
          Risk Score: {(risk_score * 100).toFixed(1)}%
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        
        {/* Generative AI Explanation Section */}
        {isHighRisk && ai_analysis && (
          <div className="mb-6 bg-brandRed/5 border border-brandRed/20 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brandRed"></div>
            <h4 className="flex items-center gap-2 font-semibold text-brandRed mb-2">
              <AlertTriangle size={16} /> 
              GenAI Threat Explanation
            </h4>
            <p className="text-primaryText text-sm leading-relaxed">
              {ai_analysis.reason_english}
            </p>
          </div>
        )}

        {/* Normal Verified State */}
        {!isHighRisk && (
           <div className="mb-6 bg-brandGreen/5 border border-brandGreen/20 rounded-lg p-4 relative overflow-hidden flex items-start gap-3">
             <div className="absolute top-0 left-0 w-1 h-full bg-brandGreen"></div>
             <ShieldCheck size={24} className="text-brandGreen shrink-0 mt-1" />
             <div>
               <h4 className="font-semibold text-brandGreen mb-1">Transaction Verified</h4>
               <p className="text-primaryText text-sm leading-relaxed">
                 Behavioral patterns match the user's historical profile. No anomalies detected.
               </p>
             </div>
           </div>
        )}

        {/* ML Features Section */}
        <div>
          <h4 className="text-sm font-semibold text-secondaryText uppercase tracking-wider mb-3">Model Features</h4>
          
          <div className="space-y-4">
            <div className="bg-darkBg rounded p-3 border border-darkBorder">
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2 text-sm text-primaryText">
                  <Activity size={14} className="text-blue-400" />
                  Transaction Velocity
                </span>
                <span className="text-sm font-bold text-primaryText">{features_used?.transaction_velocity || 0} / hr</span>
              </div>
              <div className="w-full bg-darkPanel h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${features_used?.transaction_velocity > 5 ? 'bg-brandYellow' : 'bg-blue-400'}`} 
                  style={{ width: `${Math.min(100, (features_used?.transaction_velocity || 0) * 10)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-darkBg rounded p-3 border border-darkBorder">
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2 text-sm text-primaryText">
                  <Navigation size={14} className="text-orange-400" />
                  Distance from Home
                </span>
                <span className="text-sm font-bold text-primaryText">{features_used?.distance_from_home?.toFixed(1) || 0} km</span>
              </div>
              <div className="w-full bg-darkPanel h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${features_used?.distance_from_home > 50 ? 'bg-brandRed' : 'bg-orange-400'}`} 
                  style={{ width: `${Math.min(100, (features_used?.distance_from_home || 0) / 10)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-darkBg rounded p-3 border border-darkBorder">
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2 text-sm text-primaryText">
                  <Info size={14} className="text-brandPurple" />
                  Transaction Amount
                </span>
                <span className="text-sm font-bold text-primaryText">₹{transaction.amount?.toLocaleString() || 0}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
