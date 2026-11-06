import React, { useState, useEffect } from 'react';
import DashboardStats from './components/DashboardStats';
import TransactionFeed from './components/TransactionFeed';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import VoiceGuardian from './components/VoiceGuardian';
import MLIntelligencePanel from './components/MLIntelligencePanel';
import SimulationLab from './components/SimulationLab';
import ElderlySafetyModal from './components/ElderlySafetyModal';
import {
  fetchStats, submitTransaction, fetchTransactions,
  freezeAccount, unfreezeAccount, reportFraud
} from './services/api';
import {
  Shield, PhoneCall, Lock, ChevronRight, Bell, ChevronDown, Home,
  Clock3, Gift, MoreHorizontal, QrCode, ReceiptText, Search,
  ShieldCheck, Smartphone, User, WalletCards, Landmark, Zap,
  AlertTriangle, Volume2, Sparkles, CheckCircle2, ShieldAlert,
  Flame, HelpCircle, Activity, BrainCircuit, FlaskConical, Award
} from 'lucide-react';

const MOCK_MERCHANTS = [
  'Fresh Mart Grocery', 'Apollo Pharmacy', 'Swiggy Food',
  'Electricity Bill SPDCL', 'KBC Lottery Claim', 'Unknown Overseas Wallet',
  'Amazon India', 'Local Tea Stall'
];
const MOCK_LOCATIONS = ['Hyderabad, TS', 'Secunderabad, TS', 'Warangal, TS', 'Vijayawada, AP', 'Remote/VPN'];

// -------------------------------------------------------------
// 1. ADMIN MONITOR INTERFACE
// -------------------------------------------------------------
function AdminInterface({ onOpenFreezeModal, onOpenReportModal }) {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [isLive, setIsLive] = useState(true);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await fetchStats();
    if (s) setStats(s);
    const txList = await fetchTransactions({ limit: 30 });
    if (txList && txList.length > 0) {
      setTransactions(txList);
      setSelectedTxId(txList[0].transaction_id);
    }
  };

  // Mock transaction streaming
  useEffect(() => {
    if (!isLive) return;

    const generateMockTx = async () => {
      const isFraud = Math.random() > 0.75;
      const isElderly = Math.random() > 0.5;

      const tx = {
        amount: isFraud ? Math.floor(Math.random() * 45000) + 12000 : Math.floor(Math.random() * 2500) + 80,
        merchant_name: isFraud
          ? (Math.random() > 0.5 ? 'KBC Lottery Claim' : 'Unknown Overseas Wallet')
          : MOCK_MERCHANTS[Math.floor(Math.random() * 4)],
        receiver_upi_id: isFraud ? 'win_cash99@ybl' : 'merchant@upi',
        location_name: isFraud ? 'Remote/VPN' : MOCK_LOCATIONS[Math.floor(Math.random() * 4)],
        lat: isFraud ? 40.7128 : 17.3850,
        lon: isFraud ? -74.0060 : 78.4867,
        new_device_flag: isFraud ? 1 : 0,
        ip_location_mismatch: isFraud ? 1 : 0,
        failed_attempts_last_24h: isFraud ? Math.floor(Math.random() * 3) + 1 : 0,
        transaction_velocity: isFraud ? Math.floor(Math.random() * 4) + 2 : 1,
        hour_of_day: isFraud ? 23 : 14,
        is_elderly: isElderly ? 1 : 0,
        user_id: 'user_001'
      };

      const result = await submitTransaction(tx);
      if (result && result.transaction_id) {
        setTransactions(prev => [result, ...prev.slice(0, 49)]);
      }
    };

    const interval = setInterval(generateMockTx, 4500);
    return () => clearInterval(interval);
  }, [isLive]);

  const selectedTx = transactions.find(t => t.transaction_id === selectedTxId) || transactions[0];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Feed */}
        <div className="lg:col-span-4">
          <TransactionFeed
            transactions={transactions}
            onSelect={(tx) => setSelectedTxId(tx.transaction_id)}
            selectedId={selectedTxId}
            isLive={isLive}
            onToggleLive={() => setIsLive(!isLive)}
          />
        </div>

        {/* Middle: AI Analysis */}
        <div className="lg:col-span-5">
          <AIAnalysisPanel transaction={selectedTx} />
        </div>

        {/* Right: Emergency & Voice Guardian */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          {/* Emergency Panel */}
          <div className="bg-darkPanel border border-darkBorder rounded-2xl p-4">
            <h3 className="font-bold text-primaryText flex items-center gap-2 mb-1 text-sm">
              <Shield size={16} className="text-brandRed" /> Emergency Response Actions
            </h3>
            <p className="text-[10px] text-secondaryText mb-3">Instant account protection controls</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onOpenFreezeModal('user_001')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-brandRed/30 bg-brandRed/10 hover:bg-brandRed/20 transition-all text-left"
              >
                <div>
                  <p className="text-xs font-bold text-brandRed">Emergency Freeze Account</p>
                  <p className="text-[10px] text-secondaryText">Lock outgoing debits immediately</p>
                </div>
                <ChevronRight size={16} className="text-brandRed" />
              </button>

              <button
                onClick={() => onOpenReportModal(selectedTx)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-brandYellow/30 bg-brandYellow/10 hover:bg-brandYellow/20 transition-all text-left"
              >
                <div>
                  <p className="text-xs font-bold text-brandYellow">Log 1930 Cyber Complaint</p>
                  <p className="text-[10px] text-secondaryText">Forward details to National Cyber Cell</p>
                </div>
                <ChevronRight size={16} className="text-brandYellow" />
              </button>

              <a
                href="tel:1800111363"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall size={16} className="text-blue-400" />
                  <div>
                    <p className="text-xs font-bold text-blue-400">NPCI Safety Helpline</p>
                    <p className="text-[10px] text-secondaryText">1800-111-363 (24x7 Toll-Free)</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-blue-400" />
              </a>
            </div>
          </div>

          {/* Voice Guardian */}
          <div className="flex-1">
            <VoiceGuardian transaction={selectedTx} />
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. USER UPI APP (ELDERLY-FRIENDLY CONSUMER INTERFACE)
// -------------------------------------------------------------
const walletContacts = [
  { name: 'Priya Sharma', upi: 'priya@okhdfcbank', letter: 'P', color: '#7c3aed' },
  { name: 'Arjun Verma', upi: 'arjun@okaxis', letter: 'A', color: '#2563eb' },
  { name: 'KBC Prize Desk', upi: 'claim_prize99@ybl', letter: 'K', color: '#dc2626', isScam: true },
  { name: 'Electricity Office', upi: 'power_bill@okaxis', letter: 'E', color: '#ea580c', isScam: true }
];

function UserInterface({ onTriggerSafetyModal, isSeniorMode, onToggleSeniorMode, isAccountFrozen }) {
  const [payOpen, setPayOpen] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [recipientUpi, setRecipientUpi] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState(null);

  const [transactions, setTransactions] = useState([
    { id: 'TXN1048', name: 'Priya Sharma', detail: 'Family transfer', amount: 1250, type: 'credit', time: 'Today, 10:42 AM' },
    { id: 'TXN1047', name: 'Fresh Mart Grocery', detail: 'Paid via SAHI UPI', amount: 684, type: 'debit', time: 'Yesterday, 7:18 PM' },
    { id: 'TXN1046', name: 'Apollo Pharmacy', detail: 'Medicine order', amount: 350, type: 'debit', time: 'Yesterday, 1:05 PM' }
  ]);

  const selectContact = (contact) => {
    setRecipient(contact.name);
    setRecipientUpi(contact.upi);
    if (contact.isScam) {
      setAmount('25000');
    } else {
      setAmount('750');
    }
    setPayOpen(true);
  };

  const handlePay = async () => {
    if (!recipient.trim() || !amount || Number(amount) <= 0) return;
    setPaying(true);

    const isSuspiciousPayee = recipient.toLowerCase().includes('kbc') ||
                              recipient.toLowerCase().includes('prize') ||
                              recipient.toLowerCase().includes('office') ||
                              recipient.toLowerCase().includes('bill');

    const txPayload = {
      amount: Number(amount),
      merchant_name: recipient.trim(),
      receiver_upi_id: recipientUpi || `${recipient.toLowerCase().replace(/\s+/g, '')}@upi`,
      receiver_type: isSuspiciousPayee ? 'User' : 'Merchant',
      location_name: isSuspiciousPayee ? 'Remote/VPN' : 'Hyderabad, TS',
      new_device_flag: isSuspiciousPayee ? 1 : 0,
      ip_location_mismatch: isSuspiciousPayee ? 1 : 0,
      failed_attempts_last_24h: isSuspiciousPayee ? 2 : 0,
      transaction_velocity: isSuspiciousPayee ? 3 : 1,
      hour_of_day: isSuspiciousPayee ? 23 : 14,
      is_elderly: isSeniorMode ? 1 : 0,
      user_id: 'user_001',
      note: note.trim()
    };

    const response = await submitTransaction(txPayload);
    setPaying(false);

    if (!response) {
      setResult({ status: 'Failed', message: 'Payment service unavailable. Try again.' });
      return;
    }

    // If High or Medium Risk, intercept with Elderly Safety Modal
    if (response.risk_level === 'HIGH RISK' || response.risk_level === 'MEDIUM RISK' || response.status === 'Blocked') {
      setPayOpen(false);
      onTriggerSafetyModal(response);
      return;
    }

    // Normal verified transaction
    setTransactions(prev => [{
      id: response.transaction_id,
      name: recipient.trim(),
      detail: note.trim() || 'Paid via Sahi UPI',
      amount: Number(amount),
      type: 'debit',
      time: 'Just now',
      status: 'Verified'
    }, ...prev]);

    setResult({
      status: 'Completed',
      message: `₹${Number(amount).toLocaleString('en-IN')} sent safely to ${recipient.trim()}`
    });
  };

  return (
    <div className={`upi-app ${isSeniorMode ? 'senior-mode' : ''}`}>
      {/* Top Bar */}
      <header className="upi-topbar">
        <div className="upi-profile-row">
          <div className="upi-avatar">KS</div>
          <div>
            <div className="upi-account">SBI Account •••• 4821</div>
            <div className="upi-name">Karthik Sharma (Senior)</div>
          </div>
        </div>
        <div className="upi-top-actions">
          <button
            onClick={onToggleSeniorMode}
            className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
              isSeniorMode ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/20 text-white'
            }`}
            title="Toggle Senior Citizen Mode"
          >
            👴 Senior Mode: {isSeniorMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>

      {/* Account Frozen Banner */}
      {isAccountFrozen && (
        <div className="bg-red-600 text-white p-3 text-center text-xs font-bold flex items-center justify-center gap-2">
          <Lock size={16} /> ACCOUNT FROZEN: All outgoing payments are temporarily locked for safety.
        </div>
      )}

      <main className="upi-main">
        {/* Balance Card */}
        <section className="upi-balance-card">
          <div>
            <span>Available Balance</span>
            <strong>₹24,680.00</strong>
          </div>
          <div className="upi-bank">
            <Landmark size={15} /> State Bank of India
          </div>
        </section>

        {/* Quick Action Grid */}
        <section className="upi-actions">
          <button onClick={() => setPayOpen(true)}>
            <span className="upi-action purple"><QrCode /></span>
            <span>Scan & Pay</span>
          </button>
          <button onClick={() => setPayOpen(true)}>
            <span className="upi-action blue"><Smartphone /></span>
            <span>Pay Phone</span>
          </button>
          <button onClick={() => setPayOpen(true)}>
            <span className="upi-action orange"><Landmark /></span>
            <span>Bank Transfer</span>
          </button>
          <button onClick={() => setPayOpen(true)}>
            <span className="upi-action green"><User /></span>
            <span>To Self</span>
          </button>
          <button onClick={() => setPayOpen(true)}>
            <span className="upi-action pink"><ReceiptText /></span>
            <span>Pay Bills</span>
          </button>
          <button onClick={() => setPayOpen(true)}>
            <span className="upi-action teal"><WalletCards /></span>
            <span>Recharge</span>
          </button>
        </section>

        {/* Protection Active Badge */}
        <section className="upi-protection">
          <ShieldCheck />
          <div>
            <strong>Sahi UPI AI Guardian Active</strong>
            <span>Payments checked against scams & fake collect requests in real time</span>
          </div>
          <ChevronRight size={20} />
        </section>

        {/* Quick Contacts with Scam Test Options */}
        <section>
          <div className="upi-section-heading">
            <h2>Quick Contacts & Demo Payees</h2>
            <span className="text-[11px] text-purple-700 font-bold">Tap to test</span>
          </div>
          <div className="upi-contacts">
            {walletContacts.map(contact => (
              <button
                key={contact.name}
                onClick={() => selectContact(contact)}
                className="group relative"
              >
                <span style={{ background: contact.color }} className="group-hover:scale-105 transition-transform">
                  {contact.letter}
                </span>
                <span className="truncate max-w-[70px] text-center font-medium">
                  {contact.name}
                </span>
                {contact.isScam && (
                  <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold">
                    Test Scam
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Scam Warning Callout for Seniors */}
        <section className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-3">
            <HelpCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <strong className="block font-bold text-amber-950 mb-1">
                👴 Senior Citizen Safety Tip
              </strong>
              If someone claims you won a prize or asks you to enter your UPI PIN to receive money into your bank, <strong>DO NOT DO IT!</strong> Entering your PIN always sends money away.
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="upi-history">
          <div className="upi-section-heading">
            <h2>Recent Transactions</h2>
            <button>View All</button>
          </div>
          <div className="upi-transaction-list">
            {transactions.map(tx => (
              <div className="upi-transaction" key={`${tx.id}-${tx.time}`}>
                <div className={tx.type}>{tx.type === 'credit' ? <Zap /> : <ReceiptText />}</div>
                <div className="upi-tx-copy">
                  <strong>{tx.name}</strong>
                  <span>{tx.detail}</span>
                  <small>{tx.time}</small>
                </div>
                <div className="upi-tx-amount">
                  <strong className={tx.type}>
                    {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </strong>
                  <span className="text-emerald-600 font-bold">{tx.status || 'Verified'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="upi-bottom-nav">
        <button className="active"><Home /><span>Home</span></button>
        <button><Clock3 /><span>History</span></button>
        <button className="upi-pay" onClick={() => setPayOpen(true)} aria-label="Pay"><QrCode /></button>
        <button><Gift /><span>Rewards</span></button>
        <button><MoreHorizontal /><span>More</span></button>
      </nav>

      {/* Payment Sheet */}
      {payOpen && (
        <div
          className="upi-sheet-backdrop"
          onMouseDown={e => e.target === e.currentTarget && setPayOpen(false)}
        >
          <div className="upi-payment-sheet">
            <div className="upi-sheet-grip" />
            <div className="upi-sheet-heading">
              <div>
                <span>Sahi Protected Payment</span>
                <h2>Send Money</h2>
              </div>
              <button onClick={() => setPayOpen(false)}>×</button>
            </div>

            <label>
              Pay to Name or UPI ID
              <div className="upi-recipient">
                <User size={18} />
                <input
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="Recipient Name, UPI ID or Phone"
                />
              </div>
            </label>

            <label>
              Amount (₹)
              <div className="upi-amount">
                <span>₹</span>
                <input
                  inputMode="decimal"
                  value={amount}
                  onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="0"
                />
              </div>
            </label>

            <label>
              Note <small>(optional)</small>
              <input
                className="upi-note"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What is this payment for?"
              />
            </label>

            {result && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 mb-3">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>{result.message}</span>
              </div>
            )}

            <button
              className="upi-pay-now"
              disabled={paying || !recipient.trim() || !amount}
              onClick={handlePay}
            >
              {paying ? 'Checking Sahi AI Guardian...' : `Sahi Pay ₹${amount || '0'}`}
            </button>

            <div className="upi-secure">
              <ShieldCheck size={14} /> Protected by Sahi UPI XGBoost Fraud Detection
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 3. MAIN APPLICATION ROOT COMPONENT
// -------------------------------------------------------------
export default function App() {
  const [activeTab, setActiveTab] = useState('user'); // 'user', 'admin', 'ml', 'simulation'
  const [isSeniorMode, setIsSeniorMode] = useState(true);
  const [isAccountFrozen, setIsAccountFrozen] = useState(false);
  const [interceptedTx, setInterceptedTx] = useState(null);

  // Freeze Modal State
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetTx, setReportTargetTx] = useState(null);
  const [reportSuccess, setReportSuccess] = useState(null);

  const handleTriggerSafetyModal = (tx) => {
    setInterceptedTx(tx);
  };

  const handleEmergencyFreeze = async () => {
    await freezeAccount('user_001', 'Emergency freeze initiated by user');
    setIsAccountFrozen(true);
    setFreezeModalOpen(false);
    alert("🛡️ Your UPI Account has been securely FROZEN. No outgoing payments can be made until unfrozen.");
  };

  const handleUnfreeze = async () => {
    await unfreezeAccount('user_001');
    setIsAccountFrozen(false);
    alert("✅ Account unfrozen. Normal payment privileges restored.");
  };

  const handleReportFraud = async (tx) => {
    const res = await reportFraud({
      transaction_id: tx?.transaction_id,
      user_id: 'user_001',
      suspect_upi_id: tx?.receiver_upi_id || 'fraud_suspect@upi',
      scam_category: 'Collect Request Fraud / Lottery Scam',
      description: `Reported from Sahi UPI safety platform: ${tx?.merchant_name || 'Suspicious Payee'}`
    });
    if (res) {
      setReportSuccess(res);
      setReportModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Platform Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-tight">Sahi UPI</h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AI Safety Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Intelligent Financial Fraud Detection & Elderly Payment Protection
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('user')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'user' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} /> User UPI
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'admin' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={14} /> Admin Monitor
            </button>
            <button
              onClick={() => setActiveTab('ml')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'ml' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit size={14} /> XGBoost ML
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'simulation' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FlaskConical size={14} /> Fraud Lab
            </button>
          </div>

          {/* Emergency Quick Actions Bar */}
          <div className="flex items-center gap-2">
            {isAccountFrozen ? (
              <button
                onClick={handleUnfreeze}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md"
              >
                <Lock size={12} /> Unfreeze Account
              </button>
            ) : (
              <button
                onClick={() => setFreezeModalOpen(true)}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 flex items-center gap-1"
              >
                <Lock size={12} /> Emergency Freeze
              </button>
            )}

            <a
              href="tel:1930"
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1"
              title="National Cyber Crime Reporting Helpline"
            >
              <PhoneCall size={12} className="text-amber-400" /> 1930
            </a>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'user' && (
          <div className="py-2">
            <UserInterface
              onTriggerSafetyModal={handleTriggerSafetyModal}
              isSeniorMode={isSeniorMode}
              onToggleSeniorMode={() => setIsSeniorMode(!isSeniorMode)}
              isAccountFrozen={isAccountFrozen}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminInterface
            onOpenFreezeModal={() => setFreezeModalOpen(true)}
            onOpenReportModal={(tx) => {
              setReportTargetTx(tx);
              handleReportFraud(tx);
            }}
          />
        )}

        {activeTab === 'ml' && (
          <MLIntelligencePanel />
        )}

        {activeTab === 'simulation' && (
          <SimulationLab
            onTransactionCreated={(tx) => {
              if (tx.risk_level === 'HIGH RISK' || tx.risk_level === 'MEDIUM RISK') {
                handleTriggerSafetyModal(tx);
              }
            }}
          />
        )}
      </main>

      {/* Footer & Developer Attribution */}
      <footer className="border-t border-slate-800 bg-slate-950 py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck size={16} className="text-purple-400" />
            <strong className="text-slate-300">Sahi UPI</strong> – Intelligent UPI Payment Safety Platform
          </div>

          <div className="text-slate-400">
            Developed By: <strong className="text-purple-400">Karthik Chukkala</strong> • Artificial Intelligence & Data Science, CBIT
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>XGBoost Classifier</span>
            <span>•</span>
            <span>FastAPI & SQLite</span>
            <span>•</span>
            <span>Explainable AI (XAI)</span>
          </div>
        </div>
      </footer>

      {/* Elderly Safety Interception Modal */}
      <ElderlySafetyModal
        isOpen={Boolean(interceptedTx)}
        onClose={() => setInterceptedTx(null)}
        transaction={interceptedTx}
        onConfirmPayment={(tx) => {
          alert(`Payment of ₹${tx.amount} authorized with manual override.`);
        }}
        onEmergencyFreeze={handleEmergencyFreeze}
        onReportFraud={handleReportFraud}
      />

      {/* Freeze Confirmation Modal */}
      {freezeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <Lock size={28} />
              <h3 className="text-lg font-bold text-white">Emergency Freeze Account</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Are you sure you want to freeze your UPI payments? This will immediately reject all
              outgoing payment attempts to protect your money against unauthorized debits.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setFreezeModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyFreeze}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
              >
                Yes, Freeze Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Fraud Acknowledgment Modal */}
      {reportModalOpen && reportSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Cyber Complaint Registered</h3>
            <p className="text-xs text-slate-400 mb-4">
              Your incident report has been securely logged and forwarded to the National Cyber Crime Reporting Portal.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs font-mono text-purple-300">
              Ack No: {reportSuccess.acknowledgment_number}
            </div>
            <button
              onClick={() => {
                setReportModalOpen(false);
                setReportSuccess(null);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
