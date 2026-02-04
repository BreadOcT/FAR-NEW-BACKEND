
import React from 'react';
import { Package, Truck, MapPin } from 'lucide-react';
import { ProviderOrder } from '../../../../types';

interface TimelineDetailsProps {
    timestamps: ProviderOrder['timestamps'];
    deliveryMethod: ProviderOrder['deliveryMethod'];
}

export const TimelineDetails: React.FC<TimelineDetailsProps> = ({ timestamps, deliveryMethod }) => {
    return (
        <div className="bg-stone-50 dark:bg-stone-900/50 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 space-y-6">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Waktu Klaim</p>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200">{timestamps.claimedAt} WIB</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Metode</p>
                    <p className="text-sm font-bold text-stone-800 dark:text-stone-200 capitalize flex items-center gap-1 justify-end">
                        {deliveryMethod === 'pickup' ? 'Ambil Sendiri' : 'Diantar'} 
                        {deliveryMethod === 'pickup' ? <Package className="w-4 h-4 text-orange-500" /> : <Truck className="w-4 h-4 text-blue-500" />}
                    </p>
                </div>
            </div>
            
            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Lokasi Tujuan (Estimasi)</p>
                <div className="flex items-start gap-2 text-stone-700 dark:text-stone-300 text-xs font-medium">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                    Jl. Kebon Jati No. 50 (± 2.5 km dari lokasi Anda)
                </div>
            </div>
        </div>
    );
};
