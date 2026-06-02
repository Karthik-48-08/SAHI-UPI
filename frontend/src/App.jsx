import React, { useState, useEffect } from 'react';
import DashboardStats from './components/DashboardStats';
import TransactionFeed from './components/TransactionFeed';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import VoiceGuardian from './components/VoiceGuardian';
import { fetchStats, submitTransaction } from './services/api';
import { Shield, PhoneCall, Lock, ChevronRight } from 'lucide-react';

const MOCK_MERCHANTS = ['Amazon India', 'Local Mart', 'Swiggy', 'Zomato', 'Unknown Vendor', 'Flipkart'];
const MOCK_LOCATIONS = ['Delhi, DL', 'Mumbai, MH', 'Hyderabad, TS', 'Bangalore, KA', 'Chennai, TN', 'Remote/VPN'];

function App() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedTxId, setSelectedTxId] = useState(null);
  
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
    const generateMockTx = async () => {
      const isFraud = Math.random() > 0.8; // 20% chance of generating a "fraud" looking tx
      
      const tx = {
        amount: isFraud ? Math.floor(Math.random() * 50000) + 10000 : Math.floor(Math.random() * 2000) + 50,
        merchant_name: MOCK_MERCHANTS[Math.floor(Math.random() * MOCK_MERCHANTS.length)],
        location_name: isFraud ? 'Remote/VPN' : MOCK_LOCATIONS[Math.floor(Math.random() * 5)],
        lat: isFraud ? 40.7128 : 17.3850, // NY vs HYD
        lon: isFraud ? -74.0060 : 78.4867,
        user_id: 'user_001',
        timestamp: Date.now()
      };

      const result = await submitTransaction(tx);
      if (result && result.transaction_id) {
        setTransactions(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return [result, ...prevArray].slice(0, 50);
        });
      }
    };

    // Generate a transaction every 5 seconds
    const interval = setInterval(generateMockTx, 5000);
    // Generate one immediately
    generateMockTx();
    
    return () => clearInterval(interval);
  }, []);

  const selectedTx = transactions.find(t => t.transaction_id === selectedTxId);

  return (
    <div className="min-h-screen p-6 bg-darkBg text-primaryText font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Stats */}
        <DashboardStats stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Transaction Feed */}
          <div className="lg:col-span-4">
            <TransactionFeed 
              transactions={transactions} 
              onSelect={(tx) => setSelectedTxId(tx.transaction_id)}
              selectedId={selectedTxId}
            />
          </div>
          
          {/* Middle Column: AI Analysis */}
          <div className="lg:col-span-5">
            <AIAnalysisPanel transaction={selectedTx} />
          </div>
          
          {/* Right Column: Voice & Emergency Actions */}
          <div className="lg:col-span-3 flex flex-col">
            
            {/* Emergency Actions Panel */}
            <div className="bg-darkPanel border border-darkBorder rounded-lg p-4 mb-4">
              <h3 className="font-bold text-primaryText flex items-center gap-2 mb-1">
                <Shield size={16} className="text-brandRed" /> 
                Emergency Actions
              </h3>
              <p className="text-[10px] text-secondaryText mb-4">Quick actions for urgent situations</p>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-brandRed/30 bg-brandRed/5 hover:bg-brandRed/10 transition-colors">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-brandRed">Report Fraud</p>
                    <p className="text-[10px] text-secondaryText">Report suspicious activity immediately</p>
                  </div>
                  <ChevronRight size={16} className="text-brandRed" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-brandYellow/30 bg-brandYellow/5 hover:bg-brandYellow/10 transition-colors">
                  <div className="text-left flex items-center gap-2">
                    <Lock size={16} className="text-brandYellow" />
                    <div>
                      <p className="text-sm font-semibold text-brandYellow">Freeze Account</p>
                      <p className="text-[10px] text-secondaryText">Temporarily block all transactions</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-brandYellow" />
                </button>

                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
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
    </div>
  );
}

export default App;
