
import React, { useMemo } from 'react';
import { Bell } from 'lucide-react'; 
import { DashboardStats } from './components/dashboard'; // Updated import path
import { FoodItem, ClaimHistoryItem } from '../../types';

interface ProviderIndexProps {
  onOpenNotifications: () => void;
  isSubNavOpen: boolean;
  onToggleSubNav: () => void;
  onNavigate: (view: string) => void;
  foodItems?: FoodItem[];
  claimHistory?: ClaimHistoryItem[];
}

export const ProviderIndex: React.FC<ProviderIndexProps> = ({ onOpenNotifications, onNavigate, foodItems = [], claimHistory = [] }) => {
  
  // Hitung statistik secara dinamis berdasarkan data inventory dan history
  const stats = useMemo(() => {
      const activeStock = foodItems.length;
      
      // Simulasi perhitungan dari history (karena history global mungkin milik semua orang, 
      // di real app kita filter by provider ID. Disini kita anggap semua history relevan untuk demo).
      const completedOrders = claimHistory.filter(h => h.status === 'completed').length;
      
      // Hitung total poin (misal 1 pesanan selesai = 50 poin)
      const totalPoints = completedOrders * 50 + (activeStock * 10); 
      
      // Hitung CO2 (misal 1 pesanan = 2.5kg CO2)
      const co2Saved = completedOrders * 2.5;

      const pendingReports = claimHistory.filter(h => h.isReported).length;
      
      return {
          totalPoints,
          co2Saved,
          activeStock,
          completedOrders,
          pendingReports,
          avgRating: 4.8 // Hardcoded for demo complexity reduction
      };
  }, [foodItems, claimHistory]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-32">
        <header className="mb-8 flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">Dashboard Donatur</h1>
                <p className="text-sm text-stone-500 font-medium">Ringkasan aktivitas dan dampak sosial Anda.</p>
            </div>
            
            {/* Notification Icon */}
            <button 
                onClick={onOpenNotifications} 
                className="p-3 bg-white dark:bg-stone-900 rounded-full border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-orange-600 transition-colors shadow-sm"
            >
                <Bell className="w-6 h-6" />
            </button>
        </header>
        
        <DashboardStats setActiveTab={onNavigate} stats={stats} />
    </div>
  );
};
