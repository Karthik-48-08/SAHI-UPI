import { AlertTriangle, Activity, BrainCircuit, CheckCircle2, Flag, Info, Navigation, ShieldCheck, UserCheck } from 'lucide-react';

const AIAnalysisPanel = ({ transaction, reviewStatus, onReviewAction, auditLog }) => {
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
  const transactionAudit = auditLog.filter(entry => entry.transactionId === transaction.transaction_id);

  return (
    <div className="bg-darkPanel border border-darkBorder rounded-lg h-[600px] flex flex-col shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
      <div className="p-4 border-b border-darkBorder flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-brandPurple" size={20} />
          <div>
            <h3 className="font-bold text-primaryText">Decision intelligence</h3>
            <p className="text-[10px] text-secondaryText mt-0.5">Behavioral risk assessment</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 text-xs font-bold rounded-full ${
          isHighRisk ? 'bg-brandRed/10 text-brandRed border border-brandRed/20' : 'bg-brandGreen/10 text-brandGreen border border-brandGreen/20'
        }`}>
          {(risk_score * 100).toFixed(1)}% risk
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6 rounded-lg border border-darkBorder bg-darkBg/60 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-secondaryText">Decision confidence</span>
            <span className="font-semibold text-primaryText">{status}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-darkPanel">
            <div className={`h-full rounded-full ${isHighRisk ? 'bg-brandRed' : 'bg-brandGreen'}`} style={{ width: `${Math.min(100, Math.max(8, risk_score * 100))}%` }}></div>
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-secondaryText"><span>Low risk</span><span>Review zone</span><span>High risk</span></div>
        </div>

        <div className="mb-6 rounded-lg border border-darkBorder bg-darkBg/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-primaryText">Analyst review</h4>
              <p className="mt-1 text-[10px] text-secondaryText">Record the human decision beside the model result.</p>
            </div>
            <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold ${reviewStatus ? 'border-brandPurple/30 bg-brandPurple/10 text-brandPurple' : 'border-darkBorder bg-darkBg text-secondaryText'}`}>
              {reviewStatus || 'Needs review'}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button onClick={() => onReviewAction('Reviewed')} className="flex items-center justify-center gap-1 rounded border border-brandGreen/30 bg-brandGreen/10 px-2 py-2 text-[10px] font-semibold text-brandGreen hover:bg-brandGreen/20"><UserCheck size={12} /> Review</button>
            <button onClick={() => onReviewAction('Escalated')} className="flex items-center justify-center gap-1 rounded border border-brandRed/30 bg-brandRed/10 px-2 py-2 text-[10px] font-semibold text-brandRed hover:bg-brandRed/20"><Flag size={12} /> Escalate</button>
            <button onClick={() => onReviewAction('False positive')} className="flex items-center justify-center gap-1 rounded border border-darkBorder bg-darkBg px-2 py-2 text-[10px] font-semibold text-secondaryText hover:text-primaryText"><CheckCircle2 size={12} /> False positive</button>
          </div>
        </div>
        
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
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-secondaryText uppercase tracking-wider">Evidence captured</h4>
            <span className="text-[10px] text-secondaryText">3 live signals</span>
          </div>
          
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

        {transactionAudit.length > 0 && (
          <div className="mt-6 border-t border-darkBorder pt-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondaryText">Audit trail</h4>
            <div className="mt-3 space-y-2">
              {transactionAudit.slice(0, 3).map(entry => (
                <div key={`${entry.timestamp}-${entry.action}`} className="flex items-center justify-between text-xs">
                  <span className="text-primaryText">{entry.action}</span>
                  <span className="text-[10px] text-secondaryText">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
