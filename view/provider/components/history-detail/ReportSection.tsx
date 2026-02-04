
import React from 'react';
import { AlertTriangle, MessageCircle } from 'lucide-react';
import { Button } from '../../../components/Button';
import { ProviderOrder } from '../../../../types';

interface ReportSectionProps {
    report: NonNullable<ProviderOrder['report']>;
    orderId: string;
    foodName: string;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ report, orderId, foodName }) => {
    const handleAppeal = () => {
        const adminPhone = "6285215376975";
        const message = `Halo Admin Food AI Rescue,\n\nSaya ingin mengajukan BANDING atas laporan berikut:\n\n` +
                        `ID Pesanan: *${orderId}*\n` +
                        `Makanan: ${foodName}\n` +
                        `Masalah Dilaporkan: ${report.issue}\n\n` +
                        `Penjelasan Saya:\n[Tulis alasan Anda disini]`;
        
        window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[2rem] border border-red-200 dark:border-red-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-200/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <h3 className="font-black text-red-700 dark:text-red-400 text-lg flex items-center gap-2 mb-3">
                <AlertTriangle className="w-6 h-6" /> Laporan Masalah
            </h3>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-red-100 dark:border-red-900/20 mb-4">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Masalah: {report.issue}</p>
                <p className="text-stone-800 dark:text-stone-200 font-medium text-sm leading-relaxed">
                    "{report.description}"
                </p>
            </div>
            
            <Button 
                onClick={handleAppeal}
                className="bg-white hover:bg-stone-50 text-red-600 border border-red-200 h-10 text-xs font-black uppercase tracking-widest shadow-sm w-auto px-4"
            >
                <MessageCircle className="w-4 h-4 mr-2" /> Ajukan Banding
            </Button>
        </div>
    );
};
