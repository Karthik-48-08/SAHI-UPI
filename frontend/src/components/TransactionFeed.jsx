import React, { useState } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, ChevronRight, MapPin,
  Search, Filter, Play, Pause
} from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Verified': return <CheckCircle2 className="text-brandGreen" size={18} />;
    case 'Suspicious': return <AlertTriangle className="text-brandYellow" size={18} />;
    case 'Blocked': return <XCircle className="text-brandRed" size={18} />;
    default: return <CheckCircle2 className="text-brandGreen" size={18} />;
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

const TransactionFeed = ({
  transactions = [],
  onSelect,
  selectedId,
  isLive = true,
  onToggleLive
}) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((tx) => {
    if (filter !== 'ALL' && tx.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = (tx.merchant_name || tx.receiver_name || '').toLowerCase().includes(q);
      const matchId = (tx.transaction_id || '').toLowerCase().includes(q);
      const matchUpi = (tx.receiver_upi_id || '').toLowerCase().includes(q);
      if (!matchName && !matchId && !matchUpi) return false;
    }
    return true;
  });

  return (
    <div className="bg-darkPanel border border-darkBorder rounded-2xl flex flex-col h-[620px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-darkBorder flex justify-between items-center">
        <div>
          <h3 className="font-bold text-primaryText text-sm">Real-Time UPI Stream</h3>
          <p className="text-[10px] text-secondaryText">Live transaction threat monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          {onToggleLive && (
            <button
              onClick={onToggleLive}
              className={`text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-bold transition-all ${
                isLive
                  ? 'bg-brandGreen/20 text-brandGreen border border-brandGreen/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isLive ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-brandGreen animate-pulse" />
                  Live (Streaming)
                </>
              ) : (
                <>
                  <Pause size={10} /> Paused
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-darkBorder bg-darkBg/60 space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-secondaryText" />
          <input
            type="text"
            placeholder="Search payee, UPI ID, or TXN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-darkPanel border border-darkBorder rounded-xl pl-9 pr-3 py-1.5 text-xs text-primaryText placeholder-secondaryText focus:outline-none focus:border-brandPurple"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1">
          {['ALL', 'Verified', 'Suspicious', 'Blocked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                filter === tab
                  ? 'bg-darkBorder text-primaryText'
                  : 'text-secondaryText hover:text-primaryText'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center text-secondaryText py-16 text-xs">
            No transactions match the selected filter.
          </div>
        ) : (
          filtered.map((tx) => {
            const isSelected = selectedId === tx.transaction_id;
            const displayName = tx.merchant_name || tx.receiver_name || 'UPI Payee';
            return (
              <div
                key={tx.transaction_id}
                onClick={() => onSelect(tx)}
                className={`p-3 rounded-xl border cursor-pointer transition-all hover:bg-darkBorder/40 ${
                  isSelected
                    ? 'bg-darkBorder/40 border-brandPurple shadow-md shadow-brandPurple/10'
                    : 'border-transparent bg-darkBg/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-xl shrink-0 ${StatusColor(tx.status)}`}>
                      <StatusIcon status={tx.status} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-primaryText text-xs truncate max-w-[130px]">
                          {displayName}
                        </h4>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${StatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-secondaryText flex items-center gap-1 mt-0.5 truncate">
                        <MapPin size={10} className="shrink-0" /> {tx.location_name || 'Hyderabad, TS'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-right shrink-0">
                    <div>
                      <p className="font-bold text-primaryText text-xs">
                        ₹{tx.amount ? Number(tx.amount).toLocaleString('en-IN') : '0'}
                      </p>
                      <p className="text-[9px] text-secondaryText">
                        {typeof tx.timestamp === 'string' && tx.timestamp.includes(':')
                          ? tx.timestamp.split(' ')[1] || tx.timestamp
                          : new Date(tx.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-secondaryText" />
                  </div>
                </div>

                {/* Risk Progress Bar */}
                <div className="w-full bg-darkPanel h-1 mt-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      tx.status === 'Verified' ? 'bg-brandGreen' :
                      tx.status === 'Suspicious' ? 'bg-brandYellow' : 'bg-brandRed'
                    }`}
                    style={{ width: `${Math.max(10, (tx.risk_score || 0) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionFeed;
