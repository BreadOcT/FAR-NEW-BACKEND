
import React from 'react';
import { Leaf, Users, Globe, AlertTriangle, Package, Truck, UserPlus, FileText, Megaphone, ArrowRight } from 'lucide-react';

interface OverviewProps {
    onNavigate: (tab: string) => void;
    stats?: {
        usersCount: number;
        claimsCount: number;
        inventoryCount: number;
        reportsCount: number;
    };
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate, stats }) => {
  // Use passed stats or defaults
  const totalUsers = stats?.usersCount || 0;
  const totalClaims = stats?.claimsCount || 0;
  const totalInventory = stats?.inventoryCount || 0;
  const totalReports = stats?.reportsCount || 0;

  // Calculate some derived metrics based on input
  const co2Saved = (totalClaims * 2.5).toFixed(1); // 2.5kg per claim roughly

  const dashboardStats = [
    { label: "TOTAL PENYELAMATAN", value: `${totalClaims * 5} kg`, unit: "", subValue: `${totalClaims} Klaim`, trend: "up", icon: Leaf, color: "text-green-600", bg: "bg-green-100" },
    { label: "KOMUNITAS AKTIF", value: `${totalUsers}`, unit: "User", subValue: "+Active", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "JEJAK KARBON (C02)", value: `-${co2Saved}`, unit: "Kg", subValue: "-Est", trend: "down", icon: Globe, color: "text-teal-600", bg: "bg-teal-100" },
    { label: "LAPORAN MASUK", value: `${totalReports}`, unit: "", subValue: "Need Action", trend: "neutral", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" }
  ];

  const recentActivities = [
      { id: 1, text: "Restoran Berkah mendonasikan 15kg makanan", time: "5 menit lalu", icon: Package, color: "bg-green-100 text-green-600" },
      { id: 2, text: "Budi mengantarkan ke Yayasan Kasih", time: "12 menit lalu", icon: Truck, color: "bg-blue-100 text-blue-600" },
      { id: 3, text: "Pengguna baru bergabung: Warung Sederhana", time: "30 menit lalu", icon: UserPlus, color: "bg-purple-100 text-purple-600" },
      { id: 4, text: "Laporan baru: Makanan tidak segar", time: "1 jam lalu", icon: AlertTriangle, color: "bg-red-100 text-red-600" },
  ];

  const quickActions = [
      { label: "Kelola User", icon: Users, color: "bg-blue-50 text-blue-600", desc: `${totalUsers} pengguna terdaftar`, target: 'community' },
      { label: "Laporan", icon: AlertTriangle, color: "bg-red-50 text-red-600", desc: `${totalReports} perlu tindakan`, target: 'moderation' },
      { label: "Broadcast", icon: Megaphone, color: "bg-purple-50 text-purple-600", desc: "Kirim notifikasi", target: 'communication' },
      { label: "CMS", icon: FileText, color: "bg-orange-50 text-orange-600", desc: "Edit konten", target: 'content' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
       {/* Hero Banner */}
       <div className="bg-gradient-to-r from-[#E65100] to-[#FB8C00] rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
             <h2 className="text-3xl font-black mb-3 tracking-tight">Halo, Admin!</h2>
             <p className="text-orange-50 font-medium text-lg leading-relaxed mb-8">Sistem berjalan optimal. Saat ini ada <strong className="bg-white/20 px-2 py-0.5 rounded text-white">{totalInventory}</strong> item donasi aktif tersedia.</p>
             <div className="flex gap-4">
                <button 
                    onClick={() => onNavigate('moderation')}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all border border-white/20 flex items-center gap-2"
                >
                    Lihat Laporan <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onNavigate('distribution')}
                    className="bg-[#bf360c] hover:bg-[#a02c08] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2"
                >
                    Pantau Distribusi <Truck className="w-4 h-4" />
                </button>
             </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-20 -top-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-20 -bottom-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-2xl pointer-events-none"></div>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, idx) => (
             <div key={idx} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color} ${stat.bg}`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-black text-stone-900 dark:text-white">{stat.value}</span>
                    <span className="text-sm font-bold text-stone-500">{stat.unit}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${stat.trend === 'up' || stat.trend === 'neutral' ? 'bg-green-50 text-green-600' : 'bg-green-50 text-green-600'}`}>
                    {stat.subValue}
                </span>
             </div>
          ))}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Recent Activity (Still Mock for now, but linked conceptually) */}
           <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-stone-900 dark:text-white">Aktivitas Terbaru</h3>
                    <button onClick={() => onNavigate('community')} className="text-orange-500 text-xs font-bold hover:underline">Lihat Semua</button>
                </div>
                <div className="space-y-6">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex gap-4 items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                                <activity.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{activity.text}</p>
                                <p className="text-xs text-stone-400 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
           </div>

           {/* Quick Actions */}
           <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
               <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-6">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-4">
                   {quickActions.map((action, idx) => (
                       <button 
                            key={idx} 
                            onClick={() => onNavigate(action.target)}
                            className="flex flex-col p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-left group"
                        >
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
                               <action.icon className="w-5 h-5" />
                           </div>
                           <span className="font-bold text-stone-900 dark:text-white text-sm">{action.label}</span>
                           <span className="text-xs text-stone-500 dark:text-stone-400">{action.desc}</span>
                       </button>
                   ))}
               </div>
           </div>
       </div>
    </div>
  );
};
