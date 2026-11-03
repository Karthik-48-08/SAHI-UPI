import { useState, useEffect } from 'react';
import DashboardStats from './components/DashboardStats';
import TransactionFeed from './components/TransactionFeed';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import VoiceGuardian from './components/VoiceGuardian';
import { fetchStats, submitTransaction } from './services/api';
import { Activity, ArrowUpRight, ChevronRight, Database, Lock, PhoneCall, Radio, Shield, Sparkles } from 'lucide-react';

const MOCK_MERCHANTS = ['Amazon India', 'Local Mart', 'Swiggy', 'Zomato', 'Unknown Vendor', 'Flipkart'];
const MOCK_LOCATIONS = ['Delhi, DL', 'Mumbai, MH', 'Hyderabad, TS', 'Bangalore, KA', 'Chennai, TN', 'Remote/VPN'];

const createMockTransaction = (forceRisk = null) => {
  const isFraud = forceRisk === null ? Math.random() > 0.8 : forceRisk;

  return {
    amount: isFraud ? Math.floor(Math.random() * 50000) + 10000 : Math.floor(Math.random() * 2000) + 50,
    merchant_name: MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)],
    location_name: isFraud ? 'Remote/VPN' : MOCK_LOCATIONS[Math.floor(Math.random() * 5)],
    lat: isFraud ? 40.7128 : 17.3850,
    lon: isFraud ? -74.0060 : 78.4867,
    user_id: 'user_001',
    timestamp: Date.now()
  };
};

function App() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastEventAt, setLastEventAt] = useState(null);
  const [reviewStates, setReviewStates] = useState({});
  const [auditLog, setAuditLog] = useState([]);
  const [accountFrozen, setAccountFrozen] = useState(false);
  const [notice, setNotice] = useState('');
  
  // Initial fetch for stats
  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchStats();
      if (data) setStats(data);
    };
    loadStats();
  }, []);

  // Mock transaction generator
  useEffect(() => {
    if (!isStreaming) return undefined;

    const generateMockTx = async () => {
      const result = await submitTransaction(createMockTransaction());
      if (result && result.transaction_id) {
        setTransactions(prev => [result, ...(Array.isArray(prev) ? prev : [])].slice(0, 50));
        setLastEventAt(Date.now());
      }
    };

    const interval = setInterval(generateMockTx, 5000);
    generateMockTx();

    return () => clearInterval(interval);
  }, [isStreaming]);

  const simulateTransaction = async (forceRisk) => {
    const result = await submitTransaction(createMockTransaction(forceRisk));
    if (result && result.transaction_id) {
      setTransactions(prev => [result, ...(Array.isArray(prev) ? prev : [])].slice(0, 50));
      setSelectedTxId(result.transaction_id);
      setLastEventAt(Date.now());
    }
  };

  const recordAction = (action) => {
    if (!selectedTx) {
      setNotice('Select a transaction before taking an operator action.');
      return;
    }

    const timestamp = new Date().toISOString();
    setReviewStates(prev => ({ ...prev, [selectedTx.transaction_id]: action }));
    setAuditLog(prev => [{ action, transactionId: selectedTx.transaction_id, timestamp }, ...prev].slice(0, 20));
    setNotice(`${action} · ${selectedTx.transaction_id.slice(0, 8)}`);
    setTimeout(() => setNotice(''), 3500);
  };

  const toggleAccountFreeze = () => {
    const nextState = !accountFrozen;
    setAccountFrozen(nextState);
    setNotice(nextState ? 'Demo account frozen. New payments would be held for review.' : 'Demo account unfrozen.');
    setTimeout(() => setNotice(''), 3500);
    if (selectedTx) {
      const timestamp = new Date().toISOString();
      setAuditLog(prev => [{ action: nextState ? 'Account frozen' : 'Account unfrozen', transactionId: selectedTx.transaction_id, timestamp }, ...prev].slice(0, 20));
    }
  };

  const exportTransactions = () => {
    const headers = ['transaction_id', 'merchant_name', 'location_name', 'amount', 'status', 'review_state', 'risk_score', 'timestamp'];
    const rows = transactions.map(tx => headers.map(header => JSON.stringify(header === 'review_state' ? reviewStates[tx.transaction_id] || 'Unreviewed' : tx[header] ?? '')).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sahi-upi-review-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedTx = transactions.find(t => t.transaction_id === selectedTxId);
  const liveThreats = transactions.filter(tx => tx.status === 'Blocked' || tx.status === 'Suspicious').length;
  const latestTransaction = transactions[0];
  const filteredTransactions = transactions.filter(tx => {
    const matchesStatus = statusFilter === 'All' || tx.status === statusFilter;
    const searchableText = `${tx.merchant_name || ''} ${tx.location_name || ''} ${tx.status || ''}`.toLowerCase();
    return matchesStatus && searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen px-4 py-5 text-primaryText font-sans sm:px-6 lg:px-8">
      <div className="max-w-[1480px] mx-auto space-y-6">
        <header className="flex flex-col gap-5 border-b border-darkBorder/70 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-secondaryText">
              <span className="h-2 w-2 rounded-full bg-brandGreen shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              Financial protection console
            </div>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-primaryText sm:text-4xl">Sahi-UPI</h1>
              <span className="rounded border border-brandGreen/30 bg-brandGreen/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-brandGreen">Live guard</span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-secondaryText">A behavior-aware view of every payment decision, from signal capture to explainable customer warning.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-secondaryText">
            <div className="flex items-center gap-2 rounded-lg border border-darkBorder bg-darkPanel/70 px-3 py-2">
              <Radio size={14} className="text-brandGreen" />
              <span>Stream connected</span>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-darkBorder bg-darkPanel/70 px-3 py-2 sm:flex">
              <Activity size={14} className="text-brandPurple" />
              <span>{transactions.length} events in view</span>
            </div>
          </div>
        </header>

        <section className="grid gap-3 rounded-xl border border-darkBorder bg-darkPanel/50 p-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-darkBg/60 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400"><Database size={17} /></div>
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-secondaryText">1. Capture</p><p className="text-sm font-medium text-primaryText">Transaction stream</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-darkBg/60 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brandPurple/10 text-brandPurple"><Sparkles size={17} /></div>
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-secondaryText">2. Assess</p><p className="text-sm font-medium text-primaryText">ML risk ensemble</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-darkBg/60 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brandGreen/10 text-brandGreen"><ArrowUpRight size={17} /></div>
            <div><p className="text-[10px] font-semibold uppercase tracking-wider text-secondaryText">3. Act</p><p className="text-sm font-medium text-primaryText">Explain and protect</p></div>
          </div>
        </section>
        
        <DashboardStats stats={stats} />

        <div className="flex flex-col gap-2 rounded-lg border border-darkBorder/70 bg-darkPanel/30 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-secondaryText"><Activity size={15} className="text-brandGreen" /><span>Decision stream is processing transactions automatically every 5 seconds.</span></div>
          <div className="text-xs text-secondaryText"><span className="text-brandYellow">{liveThreats}</span> elevated event{liveThreats === 1 ? '' : 's'} in current view{latestTransaction ? ` · latest ${latestTransaction.status}` : ''}</div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Transaction Feed */}
          <div className="lg:col-span-4">
            <TransactionFeed 
              transactions={filteredTransactions} 
              onSelect={(tx) => setSelectedTxId(tx.transaction_id)}
              selectedId={selectedTxId}
              totalCount={transactions.length}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              isStreaming={isStreaming}
              onToggleStreaming={() => setIsStreaming(prev => !prev)}
              onSimulate={simulateTransaction}
              onExport={exportTransactions}
              lastEventAt={lastEventAt}
            />
          </div>
          
          {/* Middle Column: AI Analysis */}
          <div className="lg:col-span-5">
            <AIAnalysisPanel transaction={selectedTx} reviewStatus={selectedTx ? reviewStates[selectedTx.transaction_id] : null} onReviewAction={recordAction} auditLog={auditLog} />
          </div>
          
          {/* Right Column: Voice & Emergency Actions */}
          <div className="lg:col-span-3 flex flex-col">
            
            {/* Emergency Actions Panel */}
            <div className="bg-darkPanel border border-darkBorder rounded-lg p-4 mb-4 shadow-[0_12px_30px_rgba(0,0,0,0.14)]">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-bold text-primaryText flex items-center gap-2">
                <Shield size={16} className="text-brandRed" /> 
                Emergency Actions
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondaryText">Operator tools</span>
              </div>
              <p className="text-[10px] text-secondaryText mb-4">Escalate a risk signal when a customer needs immediate help.</p>
              
              <div className="space-y-3">
                <button onClick={() => recordAction('Reported to fraud desk')} className="w-full flex items-center justify-between p-3 rounded-lg border border-brandRed/30 bg-brandRed/5 hover:bg-brandRed/10 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-brandRed">Report Fraud</p>
                    <p className="text-[10px] text-secondaryText">Report suspicious activity immediately</p>
                  </div>
                  <ChevronRight size={16} className="text-brandRed" />
                </button>

                <button onClick={toggleAccountFreeze} className="w-full flex items-center justify-between p-3 rounded-lg border border-brandYellow/30 bg-brandYellow/5 hover:bg-brandYellow/10 transition-colors">
                  <div className="text-left flex items-center gap-2">
                    <Lock size={16} className="text-brandYellow" />
                    <div>
                        <p className="text-sm font-semibold text-brandYellow">{accountFrozen ? 'Unfreeze Account' : 'Freeze Account'}</p>
                        <p className="text-[10px] text-secondaryText">{accountFrozen ? 'Resume the demo payment stream' : 'Temporarily block all transactions'}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-brandYellow" />
                </button>

                <button onClick={() => recordAction('Helpline opened')} className="w-full flex items-center justify-between p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                  <div className="text-left flex items-center gap-2">
                    <PhoneCall size={16} className="text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-blue-500">Emergency Helpline</p>
                      <p className="text-[10px] text-secondaryText">1800-111-363 (NPCI Helpline)</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-blue-500" />
                </button>
              </div>
            </div>

            {/* Voice Guardian Panel */}
            <div className="flex-1">
              <VoiceGuardian transaction={selectedTx} />
            </div>

          </div>
        </div>
      </div>
      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-brandPurple/40 bg-darkPanel px-4 py-3 text-xs font-medium text-primaryText shadow-2xl">{notice}</div>}
    </div>
  );
}

export default App;
