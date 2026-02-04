
import React from 'react';
import { ChevronRight, Star, AlertTriangle, Zap, Leaf } from 'lucide-react';
import { ProviderOrder } from '../../../../types';

interface HistoryItemCardProps {
    item: ProviderOrder;
    onClick: () => void;
}

export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({ item, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-orange-500/30 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-all group flex items-center gap-4"
    >
        <img src={item.imageUrl} className="w-20 h-20 rounded-xl object-cover bg-stone-100" alt={item.foodName} />
        
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-stone-900 dark:text-white truncate pr-4">{item.foodName}</h3>
                <span className="text-[10px] text-stone-400 font-mono hidden sm:block">{item.timestamps.completedAt}</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 mb-2 line-clamp-1">{item.description}</p>
            
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-lg">
                    <div className="w-4 h-4 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-[8px] font-bold">
                        {item.receiver.avatar.charAt(0)}
                    </div>
                    <span className="font-bold text-stone-700 dark:text-stone-300 truncate max-w-[80px]">{item.receiver.name}</span>
                </div>
                
                {/* Badge Poin & CO2 (Simulasi) */}
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <Zap className="w-3 h-3 fill-current" /> 50 Poin
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    <Leaf className="w-3 h-3 fill-current" /> 2.5kg CO2
                </div>

                {/* Indikator Rating */}
                {item.rating && (
                    <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                        <Star className="w-3 h-3 fill-current" /> {item.rating.stars}.0
                    </div>
                )}

                {/* Indikator Report dengan Animasi */}
                {item.report && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 animate-bounce">
                        <AlertTriangle className="w-3 h-3" /> Laporan
                    </div>
                )}
            </div>
        </div>

        <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
        </div>
    </div>
);
