
import React, { useState } from 'react';
import { History, Star, AlertTriangle } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { ProviderOrder } from '../../../../types';
import { HistoryDetail } from '../history-detail';
import { HeaderSection } from './HeaderSection';
import { FilterTabs } from './FilterTabs';
import { HistoryItemCard } from './HistoryItemCard';

interface HistoryListProps {
    history?: ProviderOrder[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history = [] }) => {
  const [selectedHistory, setSelectedHistory] = useState<ProviderOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'rated' | 'reported'>('all');

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.receiver.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'rated') {
        return matchesSearch && !!item.rating;
    }
    if (filterType === 'reported') {
        return matchesSearch && !!item.report;
    }
    
    return matchesSearch;
  });

  if (selectedHistory) {
      return <HistoryDetail item={selectedHistory} onBack={() => setSelectedHistory(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
        <HeaderSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <FilterTabs filterType={filterType} setFilterType={setFilterType} />

        {filteredHistory.length === 0 ? (
            <EmptyState 
                icon={filterType === 'reported' ? AlertTriangle : filterType === 'rated' ? Star : History} 
                title={filterType === 'reported' ? "Tidak Ada Laporan" : filterType === 'rated' ? "Belum Ada Ulasan" : "Belum Ada Riwayat"} 
                description={
                    filterType === 'reported' ? "Hebat! Belum ada laporan masalah pada donasi Anda." :
                    filterType === 'rated' ? "Belum ada pesanan yang mendapatkan ulasan." :
                    "Riwayat donasi yang selesai akan muncul di sini."
                }
            />
        ) : (
            <div className="space-y-3">
                {filteredHistory.map((item) => (
                    <HistoryItemCard 
                        key={item.id} 
                        item={item} 
                        onClick={() => setSelectedHistory(item)} 
                    />
                ))}
            </div>
        )}
    </div>
  );
};
