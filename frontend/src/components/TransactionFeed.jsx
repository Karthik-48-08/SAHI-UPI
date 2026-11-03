import { CheckCircle2, AlertTriangle, ChevronRight, Download, MapPin, Pause, Play, Search, XCircle, Zap } from 'lucide-react';

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

const TransactionFeed = ({ transactions, onSelect, selectedId, totalCount, statusFilter, onStatusFilterChange, searchTerm, onSearchTermChange, isStreaming, onToggleStreaming, onSimulate, onExport, lastEventAt }) => {
  return (
    <div className="bg-darkPanel border border-darkBorder rounded-lg flex flex-col h-[660px] shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
      <div className="p-4 border-b border-darkBorder">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-primaryText">Transaction stream</h3>
            <p className="text-[10px] text-secondaryText mt-1">{transactions.length} shown of {totalCount} events · newest first</p>
          </div>
          <button onClick={onToggleStreaming} className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full ${isStreaming ? 'text-brandGreen bg-brandGreen/10' : 'text-brandYellow bg-brandYellow/10'}`} title={isStreaming ? 'Pause incoming demo events' : 'Resume incoming demo events'}>
            {isStreaming ? <Pause size={12} /> : <Play size={12} />}
            {isStreaming ? 'Live' : 'Paused'}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-1 items-center gap-2 rounded border border-darkBorder bg-darkBg px-3 py-2 text-xs text-secondaryText">
            <Search size={14} />
            <span className="sr-only">Search transactions</span>
            <input value={searchTerm} onChange={(event) => onSearchTermChange(event.target.value)} placeholder="Search merchant or location" className="w-full bg-transparent text-primaryText outline-none placeholder:text-secondaryText/70" />
          </label>
          <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)} className="rounded border border-darkBorder bg-darkBg px-3 py-2 text-xs text-primaryText outline-none">
            <option>All</option>
            <option>Verified</option>
            <option>Suspicious</option>
            <option>Blocked</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => onSimulate(true)} className="flex items-center gap-1.5 rounded border border-brandRed/30 bg-brandRed/10 px-2.5 py-1.5 text-[10px] font-semibold text-brandRed transition hover:bg-brandRed/20"><Zap size={12} /> Simulate high risk</button>
          <button onClick={() => onSimulate(false)} className="rounded border border-darkBorder bg-darkBg px-2.5 py-1.5 text-[10px] font-semibold text-secondaryText transition hover:text-primaryText">Normal payment</button>
          <button onClick={onExport} className="ml-auto flex items-center gap-1.5 rounded border border-darkBorder bg-darkBg px-2.5 py-1.5 text-[10px] font-semibold text-secondaryText transition hover:text-primaryText"><Download size={12} /> Export CSV</button>
        </div>
        <p className="mt-2 text-[10px] text-secondaryText">{lastEventAt ? `Last event ${new Date(lastEventAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Waiting for first event'}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {transactions.length === 0 ? (
          <div className="text-center text-secondaryText py-10">Waiting for transactions...</div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.transaction_id}
              onClick={() => onSelect(tx)}
              onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onSelect(tx); }}
              role="button"
              tabIndex={0}
              aria-label={`View ${tx.status} transaction from ${tx.merchant_name || 'unknown merchant'}`}
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
                      {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-secondaryText" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 bg-darkBg h-1 rounded-full overflow-hidden">
                <div
                  className={`h-full ${tx.status === 'Verified' ? 'bg-brandGreen' :
                      tx.status === 'Suspicious' ? 'bg-brandYellow' : 'bg-brandRed'
                    }`}
                  style={{ width: `${Math.max(10, (tx.risk_score || 0) * 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-semibold text-secondaryText">{((tx.risk_score || 0) * 100).toFixed(0)}% risk</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionFeed;
