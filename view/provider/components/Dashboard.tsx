
import React, { useState } from 'react';
import { Trophy, TrendingUp, Leaf, Info, AlertTriangle, Star, X, ChevronRight, Target, Zap } from 'lucide-react';
import { SOCIAL_SYSTEM } from '../../../constants';

// Perbaikan SimpleBarChart: Menambahkan label hari di bagian bawah
const SimpleBarChart = ({ data, colorClass }: { data: number[], colorClass: string }) => {
  const max = Math.max(...data, 1);
  const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-end gap-1.5 h-20 px-1">
        {data.map((val, idx) => {
          const heightPercent = Math.max((val / max) * 100, 5);
          return (
              <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
                <div 
                    className={`w-full rounded-t-md transition-all duration-700 ease-out shadow-sm ${colorClass}`} 
                    style={{ height: `${heightPercent}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl pointer-events-none">
                    {val}
                </div>
              </div>
          );
        })}
      </div>
      {/* Label Hari */}
      <div className="flex items-center gap-1.5 px-1">
        {days.map((day, i) => (
          <span key={i} className="flex-1 text-center text-[9px] font-black text-stone-400 group-hover:text-stone-600 transition-colors uppercase">
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

export const DashboardStats: React.FC<{setActiveTab: (t: any) => void}> = ({setActiveTab}) => {
  const [showRankDetails, setShowRankDetails] = useState(false);
  
  const providerSystem = SOCIAL_SYSTEM.provider;
  const currentPoints = 2450;
  
  // Logic to determine current and next rank
  const currentRank = providerSystem.tiers.slice().reverse().find(t => currentPoints >= t.minPoints) || providerSystem.tiers[0];
  const nextRank = providerSystem.tiers.find(t => t.minPoints > currentPoints);
  const progress = nextRank 
    ? Math.min(((currentPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100, 100)
    : 100;

  const currentStats = {
      points: currentPoints,
      weeklyMeals: [12, 18, 15, 22, 10, 25, 30], // Data dummy nyata untuk chart poin
      weeklyCo2: [8.5, 12.2, 10.4, 15.1, 7.2, 18.3, 21.0], // Data dummy nyata untuk chart dampak
      co2Reduced: 156.4
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Rank Progress Card - DESAIN BARU YANG LEBIH RAPI */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-[2rem] p-7 md:p-9 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden group border border-white/10">
         {/* Decorative Patterns */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
         
         <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div className="flex items-center md:items-start gap-5">
               {/* Ikon dikunci ukurannya agar tidak gepeng */}
               <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-xl text-4xl aspect-square">
                  {currentRank.icon}
               </div>
               
               <div className="space-y-2">
                  <div>
                    <p className="text-orange-100 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] mb-1 opacity-80">
                        Status Keaktifan
                    </p>
                    <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight italic drop-shadow-md">
                        {currentRank.name}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {currentRank.benefits.map((benefit, idx) => (
                          <span key={idx} className="text-[9px] md:text-[10px] font-bold bg-white/15 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
                            {benefit}
                          </span>
                      ))}
                  </div>
               </div>
            </div>

            <button 
                onClick={() => setShowRankDetails(true)}
                className="flex-shrink-0 px-5 py-2.5 bg-black/20 hover:bg-black/40 border border-white/20 rounded-2xl transition-all duration-300 text-white backdrop-blur-md text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 self-end md:self-start"
            >
                <Info className="w-3.5 h-3.5" /> Info Level
            </button>
         </div>

         <div className="relative z-10 mt-10 space-y-3">
            <div className="flex justify-between items-end text-sm font-black italic">
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase tracking-widest text-orange-100 opacity-70 mb-0.5">Poin Terkumpul</span>
                 <span className="text-xl md:text-2xl">{currentStats.points.toLocaleString()} <span className="text-xs opacity-80 not-italic">PTS</span></span>
               </div>
               <div className="text-right">
                 <span className="text-[10px] uppercase tracking-widest text-orange-100 opacity-70 mb-0.5 block">Target Berikutnya</span>
                 <span className="text-xs md:text-sm text-white/90">{nextRank ? `${nextRank.name} (${nextRank.minPoints})` : 'Level Tertinggi!'}</span>
               </div>
            </div>
            
            <div className="relative h-4 w-full bg-black/20 rounded-2xl overflow-hidden backdrop-blur-md border border-white/5 shadow-inner">
               <div 
                 className="absolute inset-y-0 left-0 bg-gradient-to-r from-white via-white/90 to-orange-100 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-1000 ease-out" 
                 style={{width: `${progress}%`}}
               >
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
               </div>
            </div>
         </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button onClick={() => setActiveTab('reports')} className="p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center text-red-600 dark:text-red-200 group-hover:scale-110 transition-transform"><AlertTriangle className="w-6 h-6" /></div>
            <div className="text-left"><p className="text-sm font-medium text-stone-500">Laporan Masuk</p><p className="text-xl font-bold text-stone-900 dark:text-white">2 Masalah</p></div>
         </button>
         <button onClick={() => setActiveTab('reviews')} className="p-5 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 flex items-center gap-4 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center text-yellow-600 dark:text-yellow-200 group-hover:scale-110 transition-transform"><Star className="w-6 h-6" /></div>
            <div className="text-left"><p className="text-sm font-medium text-stone-500">Rating Toko</p><p className="text-xl font-bold text-stone-900 dark:text-white">4.8/5.0</p></div>
         </button>
      </div>

      {/* Main Stats Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card: Total Point Sosial */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-600 dark:text-stone-400">Total Point Sosial</span>
                </div>
             </div>
             <div>
                <p className="text-5xl font-extrabold text-stone-900 dark:text-white mb-2 tracking-tighter">{currentStats.points.toLocaleString()}</p>
                
                <div className="mt-2 mb-6">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Aktivitas Point Mingguan</p>
                    <SimpleBarChart data={currentStats.weeklyMeals} colorClass="bg-indigo-500 dark:bg-indigo-600" />
                </div>

                <div className="space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-500" /> Cara Dapat Point:
                    </p>
                    {providerSystem.rules.slice(0, 2).map((rule, i) => (
                        <div key={i} className="flex justify-between items-center text-xs bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                            <span className="text-stone-700 dark:text-stone-300 font-medium">{rule.action}</span>
                            <span className="font-black text-green-600">+{rule.points}</span>
                        </div>
                    ))}
                    <button 
                        onClick={() => setShowRankDetails(true)}
                        className="w-full mt-2 text-[11px] font-bold text-orange-600 hover:text-orange-500 transition-colors flex items-center justify-center gap-1 py-1"
                    >
                        Lihat lebih lengkap <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
             </div>
        </div>

        {/* Card: Dampak Carbon (Chart Perbaikan) */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold text-stone-600 dark:text-stone-400">Dampak Lingkungan</span>
                </div>
             </div>
             <div>
                <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-extrabold text-stone-900 dark:text-white mb-1 tracking-tighter">{currentStats.co2Reduced}</p>
                    <span className="text-lg font-bold text-emerald-500">kg</span>
                </div>
                <p className="text-xs text-stone-500 font-medium mb-4">Jejak Karbon (CO2) Terselamatkan</p>
                
                <div className="mb-6">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Tren Reduksi CO2 (Mingguan)</p>
                    <SimpleBarChart data={currentStats.weeklyCo2} colorClass="bg-emerald-500 dark:bg-emerald-600" />
                </div>

                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                    <p className="text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                        <span className="text-lg">🌳</span> Setara kontribusi menanam 12 pohon
                    </p>
                </div>
             </div>
        </div>
      </div>

      {/* Rank & Points Rules Modal */}
      {showRankDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] w-full max-w-lg max-h-[85vh] flex flex-col relative shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800">
            <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/50 dark:bg-stone-950 backdrop-blur-sm z-10">
                <div>
                    <h3 className="text-lg font-black text-stone-900 dark:text-white uppercase tracking-tighter italic">Syarat & Jenjang Karir</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Tingkatkan reputasi & poin sosial anda</p>
                </div>
                <button onClick={() => setShowRankDetails(false)} className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                <div className="p-6 border-b border-stone-100 dark:border-stone-800 bg-orange-50/50 dark:bg-orange-900/10">
                    <h4 className="font-black text-stone-900 dark:text-white text-sm mb-4 flex items-center gap-2 uppercase tracking-widest"><Target className="w-4 h-4 text-orange-500" /> Cara Mendapatkan Poin</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {providerSystem.rules.map((rule, idx) => (
                            <div key={idx} className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 shadow-sm flex justify-between items-center group hover:border-orange-200 transition-colors">
                                <div className="flex-1">
                                    <span className="text-sm font-bold text-stone-800 dark:text-stone-200 block mb-1">{rule.action}</span>
                                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">{rule.description}</p>
                                </div>
                                <div className="ml-4">
                                    <span className="text-sm font-black text-green-600 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full">+{rule.points}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <h4 className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-2 uppercase tracking-widest"><Trophy className="w-4 h-4 text-amber-500" /> Tingkatan & Benefit</h4>
                    {providerSystem.tiers.map((rank) => {
                        const isCurrent = rank.id === currentRank.id;
                        return (
                            <div key={rank.id} className={`p-5 rounded-[2rem] border transition-all duration-500 ${isCurrent ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 ring-1 ring-orange-500 shadow-lg' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 opacity-60 hover:opacity-100'}`}>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="text-3xl filter drop-shadow-sm">{rank.icon}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-black text-stone-900 dark:text-white text-base">{rank.name}</h4>
                                            {isCurrent && <span className="bg-orange-500 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">Aktif</span>}
                                        </div>
                                        <p className="text-xs text-stone-500 font-bold">Minimal {rank.minPoints.toLocaleString()} Poin</p>
                                    </div>
                                </div>
                                <div className="pl-12">
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Keuntungan:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {rank.benefits.map((b, i) => (
                                            <span key={i} className="text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">{b}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            
            <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800">
                <button 
                    onClick={() => setShowRankDetails(false)}
                    className="w-full py-4 bg-stone-900 dark:bg-stone-800 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-black transition-colors shadow-lg"
                >
                    Tutup Detail
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
