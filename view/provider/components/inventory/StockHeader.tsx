
import React from 'react';
import { Button } from '../../../components/Button';

interface StockHeaderProps {
    onAddNew: () => void;
}

export const StockHeader: React.FC<StockHeaderProps> = ({ onAddNew }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
                <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Manajemen Stok</h2>
                <p className="text-sm text-stone-500 font-medium">Kelola ketersediaan makanan untuk didonasikan.</p>
            </div>
            <Button className="w-full md:w-auto px-8 h-12 font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 rounded-xl" onClick={onAddNew}>
                + Tambah Donasi
            </Button>
        </div>
    );
};
