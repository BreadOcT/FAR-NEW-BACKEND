
import React from 'react';
import { History, Search } from 'lucide-react';
import { Input } from '../../../components/Input';

interface HeaderSectionProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ searchQuery, setSearchQuery }) => (
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
                <History className="w-6 h-6 text-orange-500" /> Riwayat Donasi
            </h2>
            <p className="text-sm text-stone-500">Daftar donasi yang telah selesai didistribusikan.</p>
        </div>
        <div className="w-full md:w-64">
            <Input 
                label="" 
                placeholder="Cari riwayat..." 
                icon={<Search className="w-4 h-4" />} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
            />
        </div>
    </div>
);
