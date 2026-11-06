import React from 'react';
import {
  BrainCircuit, Activity, Navigation, Info, AlertTriangle, ShieldCheck,
  Cpu, Moon, Smartphone, ShieldAlert, Sparkles, CheckCircle2
} from 'lucide-react';

const AIAnalysisPanel = ({ transaction }) => {
  if (!transaction) {
    return (
      <div className="bg-darkPanel border border-darkBorder rounded-2xl h-[620px] flex flex-col items-center justify-center text-center p-6">
        <BrainCircuit size={48} className="text-darkBorder mb-4 opacity-50" />
        <h3 className="text-primaryText font-semibold">Select a transaction to view AI analysis</h3>
        <p className="text-secondaryText text-xs mt-2">Click on any transaction from the real-time live feed</p>
      </div>
    );
  }

  const { status, risk_score = 0, risk_level, features_used = {}, ai_analysis, risk_indicators = [] } = transaction;
  const isHighRisk = status === 'Blocked' || risk_level === 'HIGH RISK' || risk_score >= 0.70;
  const isMediumRisk = status === 'Suspicious' || risk_level === 'MEDIUM RISK' || (risk_score >= 0.30 && risk_score < 0.70);

  return (
    <div className="bg-darkPanel border border-darkBorder rounded-2xl h-[620px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-darkBorder flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-brandPurple" size={20} />
          <div>
            <h3 className="font-bold text-primaryText text-sm">XGBoost AI Analysis Engine</h3>
            <span className="text-[10px] text-secondaryText">Real-time inference & feature attribution</span>
          </div>
        </div>
        <div className={`px-3 py-1 text-xs font-bold rounded-full border ${
          isHighRisk
            ? 'bg-brandRed/15 text-brandRed border-brandRed/30'
            : isMediumRisk
            ? 'bg-brandYellow/15 text-brandYellow border-brandYellow/30'
            : 'bg-brandGreen/15 text-brandGreen border-brandGreen/30'
        }`}>
          {risk_level || (isHighRisk ? 'HIGH RISK' : isMediumRisk ? 'MEDIUM RISK' : 'LOW RISK')} : {(risk_score * 100).toFixed(1)}%
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        
        {/* Generative AI / Explainable AI Section */}
        {isHighRisk && (
          <div className="bg-brandRed/10 border border-brandRed/30 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-brandRed"></div>
            <h4 className="flex items-center gap-2 font-bold text-brandRed text-sm mb-1.5">
              <AlertTriangle size={16} /> 
              Explainable AI (XAI) Threat Breakdown
            </h4>
            <p className="text-primaryText text-xs leading-relaxed">
              {ai_analysis?.reason_english || "Severe anomaly: Unrecognized hardware login paired with abnormal transaction amount."}
            </p>
          </div>
        )}

        {isMediumRisk && (
          <div className="bg-brandYellow/10 border border-brandYellow/30 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-brandYellow"></div>
            <h4 className="flex items-center gap-2 font-bold text-brandYellow text-sm mb-1.5">
              <AlertTriangle size={16} /> 
              Cautionary Deviation Alert
            </h4>
            <p className="text-primaryText text-xs leading-relaxed">
              {ai_analysis?.reason_english || "Transaction exhibits moderate deviation from normal historical baseline."}
            </p>
          </div>
        )}

        {!isHighRisk && !isMediumRisk && (
          <div className="bg-brandGreen/10 border border-brandGreen/30 rounded-xl p-4 relative overflow-hidden flex items-start gap-3">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-brandGreen"></div>
            <ShieldCheck size={22} className="text-brandGreen shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-brandGreen text-sm mb-1">Transaction Verified Safe</h4>
              <p className="text-primaryText text-xs leading-relaxed">
                {ai_analysis?.reason_english || "All behavioral markers and location parameters align with user historical spending profile."}
              </p>
            </div>
          </div>
        )}

        {/* Risk Indicators Pills */}
        {risk_indicators && risk_indicators.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold text-secondaryText uppercase tracking-wider mb-2">
              Detected Risk Triggers
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {risk_indicators.map((ind, i) => (
                <span key={i} className="text-[11px] bg-darkBg border border-darkBorder text-red-300 px-2.5 py-1 rounded-lg">
                  ⚠️ {ind}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ensemble Sub-Model Probabilities */}
        <div className="bg-darkBg rounded-xl p-3 border border-darkBorder">
          <h4 className="text-[11px] font-bold text-secondaryText uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu size={13} /> Sub-Model Probability Consensus
          </h4>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-darkPanel p-2 rounded-lg border border-darkBorder">
              <span className="text-secondaryText text-[10px] block">XGBoost (60%)</span>
              <strong className="text-purple-400 font-mono">
                {((transaction.xgb_prob || risk_score) * 100).toFixed(1)}%
              </strong>
            </div>
            <div className="bg-darkPanel p-2 rounded-lg border border-darkBorder">
              <span className="text-secondaryText text-[10px] block">Random Forest (25%)</span>
              <strong className="text-blue-400 font-mono">
                {((transaction.rf_prob || risk_score * 0.9) * 100).toFixed(1)}%
              </strong>
            </div>
            <div className="bg-darkPanel p-2 rounded-lg border border-darkBorder">
              <span className="text-secondaryText text-[10px] block">Iso Forest (15%)</span>
              <strong className="text-amber-400 font-mono">
                {((transaction.anomaly_score || 0.42) * 100).toFixed(1)}%
              </strong>
            </div>
          </div>
        </div>

        {/* Feature Attributions */}
        <div>
          <h4 className="text-[11px] font-bold text-secondaryText uppercase tracking-wider mb-2.5">
            Model Behavioral Features
          </h4>
          
          <div className="space-y-2.5">
            {/* Amount */}
            <div className="bg-darkBg rounded-xl p-2.5 border border-darkBorder flex justify-between items-center text-xs">
              <span className="text-secondaryText flex items-center gap-1.5">
                <Info size={13} className="text-purple-400" /> Amount Value
              </span>
              <span className="font-bold text-primaryText font-mono">
                ₹{transaction.amount ? Number(transaction.amount).toLocaleString('en-IN') : '0'}
              </span>
            </div>

            {/* Velocity */}
            <div className="bg-darkBg rounded-xl p-2.5 border border-darkBorder text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-secondaryText flex items-center gap-1.5">
                  <Activity size={13} className="text-blue-400" /> Velocity (Count / hr)
                </span>
                <span className="font-bold text-primaryText font-mono">
                  {features_used?.transaction_velocity || 1}
                </span>
              </div>
              <div className="w-full bg-darkPanel h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full ${(features_used?.transaction_velocity || 1) > 3 ? 'bg-brandRed' : 'bg-blue-400'}`}
                  style={{ width: `${Math.min(100, (features_used?.transaction_velocity || 1) * 20)}%` }}
                />
              </div>
            </div>

            {/* Night Transaction */}
            <div className="bg-darkBg rounded-xl p-2.5 border border-darkBorder flex justify-between items-center text-xs">
              <span className="text-secondaryText flex items-center gap-1.5">
                <Moon size={13} className="text-amber-400" /> Night Window (10PM - 6AM)
              </span>
              <span className={`font-bold ${features_used?.is_night_transaction ? 'text-amber-400' : 'text-emerald-400'}`}>
                {features_used?.is_night_transaction ? 'YES (Active)' : 'NO (Daytime)'}
              </span>
            </div>

            {/* Device & Geolocation */}
            <div className="bg-darkBg rounded-xl p-2.5 border border-darkBorder flex justify-between items-center text-xs">
              <span className="text-secondaryText flex items-center gap-1.5">
                <Smartphone size={13} className="text-orange-400" /> Device / IP Consistency
              </span>
              <span className={`font-bold ${features_used?.new_device_flag || features_used?.ip_location_mismatch ? 'text-red-400' : 'text-emerald-400'}`}>
                {features_used?.new_device_flag || features_used?.ip_location_mismatch ? 'Anomaly Flagged' : 'Verified Device'}
              </span>
            </div>

            {/* Elderly Flag */}
            {features_used?.is_elderly === 1 && (
              <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-2.5 flex justify-between items-center text-xs text-purple-200">
                <span>👴 Senior Citizen Safety Shield</span>
                <span className="font-bold text-purple-300">Active</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIAnalysisPanel;
