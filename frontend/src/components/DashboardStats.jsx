import React from 'react';
import { ShieldCheck, Activity, ShieldAlert, Users, Percent, Clock, AlertTriangle } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, colorClass }) => (
  <div className="bg-darkPanel border border-darkBorder rounded-2xl p-4 flex items-center justify-between">
    <div>
      <p className="text-xs text-secondaryText mb-1 flex items-center gap-1.5 font-medium">
        <Icon size={14} className={colorClass.text} /> {title}
      </p>
      <h3 className="text-2xl font-black text-primaryText tracking-tight">{value}</h3>
      {subtitle && <p className="text-[10px] text-secondaryText mt-0.5">{subtitle}</p>}
    </div>
    <div className={`p-3 rounded-2xl bg-opacity-15 ${colorClass.bg} ${colorClass.text}`}>
      <Icon size={24} />
    </div>
  </div>
);

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Brand Active Card */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-darkPanel to-darkPanel border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 col-span-1 md:col-span-2 lg:col-span-1">
        <div className="relative">
          <div className="w-14 h-14 bg-brandGreen rounded-2xl flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <div className="absolute inset-0 bg-brandGreen rounded-2xl opacity-25 animate-ping" />
        </div>
        <div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brandGreen/20 text-brandGreen text-[11px] font-bold mb-1 border border-brandGreen/30">
            <div className="w-1.5 h-1.5 rounded-full bg-brandGreen" />
            XGBoost Active
          </span>
          <h2 className="text-xl font-black text-primaryText">Sahi-UPI</h2>
          <p className="text-xs text-secondaryText">Elderly & Payment Guardian</p>
        </div>
      </div>
      
      {/* Today's Scans */}
      <StatCard 
        icon={Activity} 
        title="Today's Scans" 
        value={stats.todayScans?.toLocaleString() || '2,845'} 
        subtitle="Across all UPI apps"
        colorClass={{ bg: 'bg-blue-500', text: 'text-blue-400' }} 
      />

      {/* Threats Blocked */}
      <StatCard 
        icon={ShieldAlert} 
        title="Threats Blocked" 
        value={stats.threatsBlocked?.toLocaleString() || '157'} 
        subtitle="High-risk PIN intercepts"
        colorClass={{ bg: 'bg-brandRed', text: 'text-brandRed' }} 
      />

      {/* Protection Rate */}
      <div className="bg-darkPanel border border-darkBorder rounded-2xl p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-secondaryText mb-1 flex items-center gap-1.5 font-medium">
              <Percent size={14} className="text-brandPurple" /> Fraud Protection Rate
            </p>
            <h3 className="text-2xl font-black text-primaryText">{stats.protectionRate || 99.8}%</h3>
            <p className="text-[10px] text-secondaryText mt-0.5">Avg Latency: {stats.avgResponseMs || 48} ms</p>
          </div>
        </div>
        <div className="w-full bg-darkBg rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brandPurple to-brandGreen h-full rounded-full transition-all duration-700"
            style={{ width: `${stats.protectionRate || 99.8}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
