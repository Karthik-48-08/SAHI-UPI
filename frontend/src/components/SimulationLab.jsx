import React, { useState } from 'react';
import {
  FlaskConical, Play, ShieldAlert, ShieldCheck, AlertTriangle,
  RotateCcw, Sparkles, Volume2, CheckCircle2, Sliders, Smartphone
} from 'lucide-react';
import { submitTransaction } from '../services/api';

const SCENARIOS = [
  {
    id: 'safe_kirana',
    title: '🟢 Normal Neighborhood Kirana Store',
    tag: 'Safe / Low Risk',
    color: 'emerald',
    desc: 'Regular morning grocery purchase of ₹340 to a local registered merchant.',
    payload: {
      amount: 340,
      merchant_name: 'Lakshmi Kirana Store',
      receiver_upi_id: 'lakshmi.general@icici',
      receiver_type: 'Merchant',
      payment_app: 'PhonePe',
      location_name: 'Hyderabad, TS',
      new_device_flag: 0,
      ip_location_mismatch: 0,
      failed_attempts_last_24h: 0,
      transaction_velocity: 1,
      hour_of_day: 10,
      is_elderly: 1
    }
  },
  {
    id: 'kbc_collect',
    title: '🔴 KBC Lottery / Cash Prize Collect Trap',
    tag: 'High Risk Fraud',
    color: 'rose',
    desc: 'Unsolicited collect request targeting senior user claiming ₹25,000 lottery winnings.',
    payload: {
      amount: 25000,
      merchant_name: 'KBC Lottery Claim Cell',
      receiver_upi_id: 'claim_prize99@ybl',
      receiver_type: 'User',
      payment_app: 'GPay',
      location_name: 'Remote/VPN',
      new_device_flag: 1,
      ip_location_mismatch: 1,
      failed_attempts_last_24h: 2,
      transaction_velocity: 4,
      hour_of_day: 23,
      is_elderly: 1
    }
  },
  {
    id: 'electricity_scam',
    title: '🟡 Electricity Disconnection SMS Scam',
    tag: 'Medium Risk',
    color: 'amber',
    desc: 'Urgent demand to pay electricity bill to personal UPI address under threat of power cut.',
    payload: {
      amount: 4200,
      merchant_name: 'SPDCL Bill Officer Desk',
      receiver_upi_id: 'power_officer_help@okaxis',
      receiver_type: 'User',
      payment_app: 'Paytm',
      location_name: 'Secunderabad, TS',
      new_device_flag: 0,
      ip_location_mismatch: 1,
      failed_attempts_last_24h: 0,
      transaction_velocity: 2,
      hour_of_day: 20,
      is_elderly: 1
    }
  },
  {
    id: 'night_takeover',
    title: '🔴 Late-Night Device Hijack & Velocity Drain',
    tag: 'Critical Threat',
    color: 'rose',
    desc: 'Rapid succession of 5 failed PINs and ₹49,000 transfer at 2:30 AM from new hardware.',
    payload: {
      amount: 49000,
      merchant_name: 'Foreign Crypto Swap',
      receiver_upi_id: 'cryptoswap99@paytm',
      receiver_type: 'User',
      payment_app: 'BHIM',
      location_name: 'Unknown Location',
      new_device_flag: 1,
      ip_location_mismatch: 1,
      failed_attempts_last_24h: 3,
      transaction_velocity: 5,
      hour_of_day: 2,
      is_elderly: 0
    }
  }
];

export default function SimulationLab({ onTransactionCreated }) {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[1]);
  const [form, setForm] = useState(SCENARIOS[1].payload);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const selectScenario = (sc) => {
    setActiveScenario(sc);
    setForm(sc.payload);
    setResult(null);
  };

  const runSimulation = async () => {
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await submitTransaction(form);
      setResult(res);
      if (onTransactionCreated && res) {
        onTransactionCreated(res);
      }
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
            <FlaskConical size={14} /> Interactive Testing Lab
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300">
            Real-Time Inference
          </span>
        </div>
        <h2 className="text-2xl font-black text-white">Fraud Pattern Simulation & Experimentation</h2>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Test how Sahi UPI's XGBoost models, behavioral heuristics, and Explainable AI react to
          classic Indian digital payment attack vectors in real-time.
        </p>
      </div>

      {/* 1-Click Scenario Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          1. Select a Pre-Configured Test Scenario:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {SCENARIOS.map((sc) => {
            const isSelected = activeScenario?.id === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => selectScenario(sc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/20 scale-[1.02]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sc.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    sc.color === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {sc.tag}
                  </span>
                  <span className="text-xs font-bold text-white">₹{sc.payload.amount.toLocaleString()}</span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{sc.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sc.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenario Parameters Form & Live Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Param Customizer */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Sliders size={18} className="text-purple-400" /> Transaction Parameters
            </h3>
            <span className="text-xs text-purple-400 font-semibold">{activeScenario.title}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Amount (₹)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Payee Name</label>
              <input
                type="text"
                value={form.merchant_name}
                onChange={(e) => setForm({ ...form, merchant_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Recipient UPI ID</label>
              <input
                type="text"
                value={form.receiver_upi_id}
                onChange={(e) => setForm({ ...form, receiver_upi_id: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Payment App</label>
              <select
                value={form.payment_app}
                onChange={(e) => setForm({ ...form, payment_app: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="GPay">Google Pay (GPay)</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm</option>
                <option value="BHIM">BHIM UPI</option>
              </select>
            </div>
          </div>

          {/* Toggle Switches for Attack Signals */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Fraud & Risk Signals
            </span>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.new_device_flag === 1}
                  onChange={(e) => setForm({ ...form, new_device_flag: e.target.checked ? 1 : 0 })}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300">New Device (Unrecognized)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.ip_location_mismatch === 1}
                  onChange={(e) => setForm({ ...form, ip_location_mismatch: e.target.checked ? 1 : 0 })}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300">IP Geolocation Mismatch</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_elderly === 1}
                  onChange={(e) => setForm({ ...form, is_elderly: e.target.checked ? 1 : 0 })}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300">Elderly User Profile (55+)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hour_of_day < 6 || form.hour_of_day >= 22}
                  onChange={(e) => setForm({ ...form, hour_of_day: e.target.checked ? 2 : 14 })}
                  className="rounded text-purple-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300">Late Night (10PM - 6AM)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Failed PIN Attempts (Last 24h): {form.failed_attempts_last_24h}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={form.failed_attempts_last_24h}
                  onChange={(e) => setForm({ ...form, failed_attempts_last_24h: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Tx Velocity (Count in 1h): {form.transaction_velocity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.transaction_velocity}
                  onChange={(e) => setForm({ ...form, transaction_velocity: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={analyzing}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>Evaluating with XGBoost Engine...</>
            ) : (
              <>
                <Play size={16} fill="white" /> Execute Real-Time Fraud Assessment
              </>
            )}
          </button>
        </div>

        {/* Live Inference Output Display */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" /> Sahi Assessment Output
              </h3>
              {result && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Latency: {result.inference_latency_ms || 42} ms
                </span>
              )}
            </div>

            {!result ? (
              <div className="h-[340px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
                <Smartphone size={40} className="text-slate-600 mb-3" />
                <p className="text-slate-300 font-semibold text-sm">Awaiting Simulation Run</p>
                <p className="text-slate-500 text-xs mt-1 max-w-xs">
                  Click "Execute Real-Time Fraud Assessment" on the left to trigger the XGBoost pipeline.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Result Card */}
                <div className={`p-4 rounded-xl border ${
                  result.risk_level === 'HIGH RISK'
                    ? 'bg-red-950/40 border-red-500/40 text-red-200'
                    : result.risk_level === 'MEDIUM RISK'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-slate-900 border">
                      {result.risk_level} • STATUS: {result.status}
                    </span>
                    <span className="text-xl font-black">
                      Score: {((result.risk_score || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs font-medium mt-1">
                    {result.ai_analysis?.reason_english || "Transaction risk assessed."}
                  </p>
                </div>

                {/* Ensemble Model Breakdown */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ensemble Sub-Model Probabilities
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">XGBoost</span>
                      <strong className="text-purple-400 font-mono">
                        {((result.xgb_prob || result.risk_score) * 100).toFixed(1)}%
                      </strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Random Forest</span>
                      <strong className="text-blue-400 font-mono">
                        {((result.rf_prob || result.risk_score * 0.9) * 100).toFixed(1)}%
                      </strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Isolation Forest</span>
                      <strong className="text-amber-400 font-mono">
                        {((result.anomaly_score || 0.45) * 100).toFixed(1)}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Multilingual Voice Preview */}
                {result.ai_analysis && (
                  <div className="bg-indigo-950/30 border border-indigo-500/20 p-3 rounded-xl text-xs space-y-1.5">
                    <span className="text-indigo-300 font-bold block flex items-center gap-1">
                      <Volume2 size={13} /> Voice Guardian Script (Hindi & Telugu):
                    </span>
                    <p className="text-slate-300 text-[11px]">
                      <strong>Hindi:</strong> {result.ai_analysis.warning_hindi}
                    </p>
                    <p className="text-slate-300 text-[11px]">
                      <strong>Telugu:</strong> {result.ai_analysis.warning_telugu}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
