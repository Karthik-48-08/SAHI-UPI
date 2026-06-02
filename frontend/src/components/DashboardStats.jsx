import React from 'react';
import { ShieldCheck, Activity, ShieldAlert, Users, Percent } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, colorClass }) => (
  <div className="bg-darkPanel border border-darkBorder rounded-lg p-4 flex items-center justify-between">
    <div>
      <p className="text-sm text-secondaryText mb-1 flex items-center gap-1">
        <Activity size={14} /> {title}
      </p>
      <h3 className="text-2xl font-bold text-primaryText">{value}</h3>
    </div>
    <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.bg} ${colorClass.text}`}>
      <Icon size={24} />
    </div>
  </div>
);

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-darkPanel border border-darkBorder rounded-lg p-4 flex items-center gap-4 col-span-1 md:col-span-2 lg:col-span-1">
        <div className="relative">
          <div className="w-16 h-16 bg-brandGreen rounded-full flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div className="absolute inset-0 bg-brandGreen rounded-full opacity-30 animate-ping"></div>
        </div>
        <div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brandGreen/20 text-brandGreen text-xs font-medium mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brandGreen"></div>
            Shield Active
          </span>
          <h2 className="text-xl font-bold text-primaryText">Sahi-UPI</h2>
          <p className="text-sm text-secondaryText">AI Guardian Protection</p>
        </div>
      </div>
      
      <StatCard 
        icon={Activity} 
        title="Today's Scans" 
        value={stats.todayScans?.toLocaleString() || '0'} 
        colorClass={{bg: 'bg-blue-500', text: 'text-blue-500'}} 
      />
      <StatCard 
        icon={ShieldAlert} 
        title="Threats Blocked" 
        value={stats.threatsBlocked?.toString() || '0'} 
        colorClass={{bg: 'bg-brandRed', text: 'text-brandRed'}} 
      />
      <div className="bg-darkPanel border border-darkBorder rounded-lg p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-secondaryText mb-1 flex items-center gap-1">
               <Percent size={14} /> Success Rate
            </p>
            <h3 className="text-2xl font-bold text-primaryText">{stats.protectionRate}%</h3>
          </div>
        </div>
        <div className="w-full bg-darkBg rounded-full h-2 mt-2">
          <div className="bg-brandPurple h-2 rounded-full" style={{ width: `${stats.protectionRate}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
