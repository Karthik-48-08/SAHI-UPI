import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, MapPin } from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Verified': return <CheckCircle2 className="text-brandGreen" size={20} />;
    case 'Suspicious': return <AlertTriangle className="text-brandYellow" size={20} />;
    case 'Blocked': return <XCircle className="text-brandRed" size={20} />;
    default: return <CheckCircle2 className="text-brandGreen" size={20} />;
  }
};

const StatusColor = (status) => {
  switch (status) {
    case 'Verified': return 'text-brandGreen bg-brandGreen/10 border-brandGreen/20';
    case 'Suspicious': return 'text-brandYellow bg-brandYellow/10 border-brandYellow/20';
    case 'Blocked': return 'text-brandRed bg-brandRed/10 border-brandRed/20';
    default: return 'text-brandGreen bg-brandGreen/10 border-brandGreen/20';
  }
};

const TransactionFeed = ({ transactions, onSelect, selectedId }) => {
  return (
    <div className="bg-darkPanel border border-darkBorder rounded-lg flex flex-col h-[600px]">
      <div className="p-4 border-b border-darkBorder flex justify-between items-center">
        <h3 className="font-bold text-primaryText">Real-time Transactions</h3>
        <span className="flex items-center gap-2 text-xs text-brandGreen font-medium px-2 py-1 bg-brandGreen/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-brandGreen animate-pulse"></div>
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {transactions.length === 0 ? (
          <div className="text-center text-secondaryText py-10">Waiting for transactions...</div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.transaction_id}
              onClick={() => onSelect(tx)}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-darkBorder/50 ${selectedId === tx.transaction_id ? 'bg-darkBorder/30 border-brandPurple' : 'border-transparent bg-darkBg/50'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${StatusColor(tx.status)}`}>
                    <StatusIcon status={tx.status} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-primaryText text-sm truncate max-w-[120px]">
                        {tx.merchant_name || 'Unknown User'}
                      </h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${StatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="text-xs text-secondaryText flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {tx.location_name || 'Unknown Location'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="font-bold text-primaryText">₹ {tx.amount ? tx.amount.toLocaleString() : '0'}</p>
                    <p className="text-[10px] text-secondaryText">
                      {new Date(tx.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-secondaryText" />
                </div>
              </div>

              {/* Progress bar line for visual effect based on risk score */}
              <div className="w-full bg-darkBg h-0.5 mt-3 rounded-full overflow-hidden">
                <div
                  className={`h-full ${tx.status === 'Verified' ? 'bg-brandGreen' :
                      tx.status === 'Suspicious' ? 'bg-brandYellow' : 'bg-brandRed'
                    }`}
                  style={{ width: `${Math.max(10, (tx.risk_score || 0) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionFeed;
