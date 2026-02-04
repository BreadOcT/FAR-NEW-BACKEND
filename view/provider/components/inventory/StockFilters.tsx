
import React from 'react';
import { Search, LayoutGrid, StretchHorizontal } from 'lucide-react';
import { Input } from '../../../components/Input';

interface StockFiltersProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    layoutMode: 'list' | 'grid';
    setLayoutMode: (mode: 'list' | 'grid') => void;
}

export const StockFilters: React.FC<StockFiltersProps> = ({ searchQuery, setSearchQuery, layoutMode, setLayoutMode }) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <Input 
                label="" 
                placeholder="Cari menu makanan..." 
                icon={<Search className="w-5 h-5" />} 
                containerClassName="flex-1" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 border-stone-200 dark:border-stone-800 shadow-sm"
            />
            <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl w-full md:w-auto border border-stone-200 dark:border-stone-700">
                <button 
                    onClick={() => setLayoutMode('grid')}
                    className={`flex-1 md:w-14 h-10 rounded-xl flex items-center justify-center transition-all ${layoutMode === 'grid' ? 'bg-white dark:bg-stone-700 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setLayoutMode('list')}
                    className={`flex-1 md:w-14 h-10 rounded-xl flex items-center justify-center transition-all ${layoutMode === 'list' ? 'bg-white dark:bg-stone-700 text-orange-600 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    <StretchHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
