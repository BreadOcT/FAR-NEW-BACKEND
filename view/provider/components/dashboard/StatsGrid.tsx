
import React from 'react';
import { TrendingUp, Zap, Leaf } from 'lucide-react';
import { SocialSystemConfig } from '../../../../types';

// Perbaikan SimpleBarChart: Menambahkan label hari di bagian bawah
const SimpleBarChart = ({ data, colorClass }: { data: number[], colorClass: string }) => {
    const max = Math.max(...data, 1);
    const days = ['S', 'S', 'R', 'K', 'J', 'S', 'M'];
  
    return (
      <div className="space-y-1 md:space-y-2 mt-2 md:mt-4">
        <div className="flex items-end gap-1 md:gap-1.5 h-16 md:h-20 px-1">
          {data.map((val, idx) => {
            const heightPercent = Math.max((val / max) * 100, 5);
            return (
                <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
                  <div 
                      className={`w-full rounded-t-sm md:rounded-t-md transition-all duration-700 ease-out shadow-sm ${colorClass}`} 
                      style={{ height: `${heightPercent}%` }}
                  ></div>
                </div>
            );
          })}
        </div>
        {/* Label Hari */}
        <div className="flex items-center gap-1 px-1">
          {days.map((day, i) => (
            <span key={i} className="flex-1 text-center text-[7px] md:text-[9px] font-black text-stone-400 group-hover:text-stone-600 transition-colors uppercase">
              {day}
            </span>
          ))}
        </div>
      </div>
    );
};

interface StatsGridProps {
    stats: {
        totalPoints: number;
        co2Saved: number;
    };
    weeklyPoints: number[];
    weeklyCo2: number[];
    providerSystem: SocialSystemConfig;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, weeklyPoints, weeklyCo2, providerSystem }) => {
    return (
        <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Card: Total Point Sosial */}
            <div className="bg-white dark:bg-stone-900 p-3 md:p-6 rounded-2xl md:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="text-xs md:text-base font-bold text-stone-600 dark:text-stone-400 leading-tight">Total Poin</span>
                    </div>
                </div>
                <div>
                    <p className="text-2xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-1 md:mb-2 tracking-tighter truncate">{stats.totalPoints.toLocaleString()}</p>
                    
                    <div className="mt-1 md:mt-2 mb-2 md:mb-6">
                        <p className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Mingguan</p>
                        <SimpleBarChart data={weeklyPoints} colorClass="bg-indigo-500 dark:bg-indigo-600" />
                    </div>

                    {/* Hidden on Mobile to save space */}
                    <div className="hidden md:block space-y-2 border-t border-stone-100 dark:border-stone-800 pt-4">
                        <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Zap className="w-3 h-3 text-amber-500" /> Cara Dapat Point:
                        </p>
                        {providerSystem.rules.slice(0, 2).map((rule, i) => (
                            <div key={i} className="flex justify-between items-center text-xs bg-stone-50 dark:bg-stone-800/50 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                                <span className="text-stone-700 dark:text-stone-300 font-medium">{rule.action}</span>
                                <span className="font-black text-green-600">+{rule.points}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card: Dampak Carbon (Updated: Remove Trees, Support Decimals) */}
            <div className="bg-white dark:bg-stone-900 p-3 md:p-6 rounded-2xl md:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Leaf className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <span className="text-xs md:text-base font-bold text-stone-600 dark:text-stone-400 leading-tight">Dampak CO2</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-baseline gap-1 md:gap-2">
                        <p className="text-2xl md:text-5xl font-extrabold text-stone-900 dark:text-white mb-1 tracking-tighter truncate">
                            {stats.co2Saved.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                        </p>
                        <span className="text-xs md:text-lg font-bold text-emerald-500">kg</span>
                    </div>
                    <p className="text-[9px] md:text-xs text-stone-500 font-medium mb-2 md:mb-4 line-clamp-1">Jejak Karbon Terselamatkan</p>
                    
                    <div className="mb-2 md:mb-6">
                        <p className="text-[8px] md:text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Tren Mingguan</p>
                        <SimpleBarChart data={weeklyCo2} colorClass="bg-emerald-500 dark:bg-emerald-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};
