import React, { useState, useEffect } from 'react';
import {
  BrainCircuit, Activity, BarChart3, CheckCircle2, ShieldCheck,
  TrendingUp, Award, Layers, Cpu, Database, RefreshCw
} from 'lucide-react';
import { fetchModelMetrics } from '../services/api';

export default function MLIntelligencePanel() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    const data = await fetchModelMetrics();
    if (data && !data.error) {
      setMetrics(data);
    }
    setLoading(false);
  };

  const cm = metrics?.confusion_matrix || {
    true_negatives: 3167,
    false_positives: 680,
    false_negatives: 101,
    true_positives: 52
  };

  const featImportances = metrics?.feature_importances?.slice(0, 8) || [
    { feature: 'risk_signal_sum', importance: 0.1400 },
    { feature: 'new_device_flag', importance: 0.1322 },
    { feature: 'transaction_velocity', importance: 0.1024 },
    { feature: 'is_night_transaction', importance: 0.0910 },
    { feature: 'ip_location_mismatch', importance: 0.0808 },
    { feature: 'failed_attempts_last_24h', importance: 0.0541 },
    { feature: 'is_elderly', importance: 0.0475 },
    { feature: 'user_loyalty_score', importance: 0.0433 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-slate-900 to-indigo-950/80 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Cpu size={14} /> Production Machine Learning Pipeline
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                XGBoost Active
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">XGBoost & Ensemble Fraud Classifier</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Trained on 20,000 realistic Indian UPI transactions to detect subtle behavioral anomalies,
              rapid velocity spikes, night-time outliers, and high-risk elder vulnerability patterns.
            </p>
          </div>
          <button
            onClick={loadMetrics}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Metrics
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <Award size={14} className="text-purple-400" /> ROC-AUC Score
          </p>
          <h3 className="text-2xl font-black text-purple-400">{metrics?.roc_auc || '0.6869'}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Class separation power</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-400" /> Overall Accuracy
          </p>
          <h3 className="text-2xl font-black text-emerald-400">
            {metrics?.accuracy ? `${(metrics.accuracy * 100).toFixed(1)}%` : '80.5%'}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">4,000 test transactions</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <TrendingUp size={14} className="text-blue-400" /> Fraud Recall
          </p>
          <h3 className="text-2xl font-black text-blue-400">
            {metrics?.recall ? `${(metrics.recall * 100).toFixed(1)}%` : '34.0%'}
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Identified fraud instances</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <Activity size={14} className="text-amber-400" /> F1-Score
          </p>
          <h3 className="text-2xl font-black text-amber-400">{metrics?.f1_score || '0.1175'}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Harmonic precision/recall</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <Database size={14} className="text-indigo-400" /> Dataset Volume
          </p>
          <h3 className="text-2xl font-black text-indigo-400">20,000</h3>
          <p className="text-[10px] text-slate-500 mt-1">2,000 users, 400 merchants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Feature Importances */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BarChart3 size={18} className="text-purple-400" /> XGBoost Feature Importances
            </h3>
            <span className="text-xs text-slate-400">Top Signals</span>
          </div>

          <div className="space-y-3">
            {featImportances.map((item, idx) => {
              const pct = (item.importance * 100) / 0.15; // normalized for display
              return (
                <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200">
                      {idx + 1}. {item.feature.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(item.importance * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(8, pct))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl text-xs text-purple-200">
            <strong>Key Insight:</strong> <code>new_device_flag</code>, <code>transaction_velocity</code>, and <code>is_night_transaction</code> contribute over 32% of total fraud split gain, closely mirroring actual UPI attack surfaces in India.
          </div>
        </div>

        {/* Right Column: Confusion Matrix & Risk Thresholds */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Confusion Matrix Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <Layers size={18} className="text-emerald-400" /> Test Set Confusion Matrix
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">True Negatives</span>
                <span className="text-xl font-black text-white">{cm.true_negatives.toLocaleString()}</span>
                <p className="text-[10px] text-slate-400 mt-1">Normal verified correctly</p>
              </div>

              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">False Positives</span>
                <span className="text-xl font-black text-white">{cm.false_positives.toLocaleString()}</span>
                <p className="text-[10px] text-slate-400 mt-1">Normal flagged for caution</p>
              </div>

              <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">False Negatives</span>
                <span className="text-xl font-black text-white">{cm.false_negatives.toLocaleString()}</span>
                <p className="text-[10px] text-slate-400 mt-1">Missed fraud attempts</p>
              </div>

              <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3">
                <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">True Positives</span>
                <span className="text-xl font-black text-white">{cm.true_positives.toLocaleString()}</span>
                <p className="text-[10px] text-slate-400 mt-1">Fraud detected & blocked</p>
              </div>
            </div>
          </div>

          {/* Risk Level Tiers Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-400" /> Sahi Risk Classification
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between">
                <div>
                  <strong className="text-emerald-400">0.00 – 0.29: LOW RISK</strong>
                  <p className="text-[11px] text-slate-300">Safe Status. No suspicious indicators.</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full">Safe</span>
              </div>

              <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 flex items-center justify-between">
                <div>
                  <strong className="text-amber-400">0.30 – 0.69: MEDIUM RISK</strong>
                  <p className="text-[11px] text-slate-300">Unusual characteristics. Caution warning.</p>
                </div>
                <span className="text-xs font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-full">Caution</span>
              </div>

              <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-950/20 flex items-center justify-between">
                <div>
                  <strong className="text-rose-400">0.70 – 1.00: HIGH RISK</strong>
                  <p className="text-[11px] text-slate-300">Multiple red flags. PIN entry intercepted.</p>
                </div>
                <span className="text-xs font-bold text-rose-400 px-2 py-0.5 bg-rose-500/10 rounded-full">Blocked</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
