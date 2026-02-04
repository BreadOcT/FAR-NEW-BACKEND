
import React, { useState } from 'react';
import { 
  Package, ShoppingBag, History
} from 'lucide-react';
import { FoodItem, ClaimHistoryItem, ProviderOrder } from '../../../types';
import { StockManager } from './inventory/StockManager';
import { OrderList } from './order-list';
import { HistoryList } from './history-list';

interface InventoryManagerProps {
    foodItems: FoodItem[];
    setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
    claimHistory: ClaimHistoryItem[];
    setClaimHistory: React.Dispatch<React.SetStateAction<ClaimHistoryItem[]>>;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ 
    foodItems, 
    setFoodItems, 
    claimHistory, 
    setClaimHistory 
}) => {
  // State navigasi internal: Stok, Pesanan, Riwayat
  const [currentView, setCurrentView] = useState<'stock' | 'orders' | 'history'>('stock');

  // --- MAPPING HELPERS FOR ORDERS & HISTORY ---
  // Kita perlu mengubah format ClaimHistoryItem (yang digunakan di App.tsx) menjadi format ProviderOrder
  // yang diharapkan oleh OrderList dan HistoryList komponen.
  
  const mapClaimToOrder = (claim: ClaimHistoryItem): ProviderOrder => ({
      id: claim.id,
      foodName: claim.foodName,
      description: claim.description || 'Tidak ada deskripsi',
      quantity: claim.claimedQuantity || '1 Porsi',
      imageUrl: claim.imageUrl,
      status: claim.status === 'active' ? 'claimed' : claim.status, // Map 'active' to 'claimed' for order list
      deliveryMethod: claim.deliveryMethod || 'pickup',
      receiver: { 
          name: 'Penerima (User)', // Di real app, data ini ada di relasi user
          avatar: 'U', 
          phone: '08123456789' 
      }, 
      timestamps: { 
          claimedAt: claim.date,
          completedAt: claim.status === 'completed' ? claim.date : undefined
      },
      rating: claim.rating ? {
          stars: claim.rating,
          comment: claim.review || '',
          mediaUrls: []
      } : undefined,
      report: claim.isReported ? {
          issue: 'Dilaporkan',
          description: 'Ada laporan masalah pada pesanan ini.',
          isUrgent: true
      } : undefined
  });

  // Filter Active Orders (Status: active)
  const activeOrders = claimHistory
    .filter(c => c.status === 'active')
    .map(mapClaimToOrder);

  // Filter Completed History (Status: completed or cancelled)
  const completedHistory = claimHistory
    .filter(c => c.status === 'completed' || c.status === 'cancelled')
    .map(mapClaimToOrder);


  // --- MAIN COMPONENT RENDER ---
  return (
    <div className="space-y-6 animate-in fade-in">
        
        {/* 3-Option Segmented Toggle (Stok, Pesanan, Riwayat) */}
        <div className="bg-stone-100 dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 grid grid-cols-3 gap-1">
            <button
                onClick={() => setCurrentView('stock')}
                className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${currentView === 'stock' 
                        ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}
                `}
            >
                <Package className="w-4 h-4" />
                <span className="hidden md:inline">Stok Makanan</span>
                <span className="md:hidden">Stok</span>
            </button>

            <button
                onClick={() => setCurrentView('orders')}
                className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${currentView === 'orders' 
                        ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}
                `}
            >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden md:inline">Pesanan Masuk</span>
                <span className="md:hidden">Pesanan</span>
            </button>

            <button
                onClick={() => setCurrentView('history')}
                className={`
                    flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                    ${currentView === 'history' 
                        ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                        : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'}
                `}
            >
                <History className="w-4 h-4" />
                <span className="hidden md:inline">Riwayat Pemesanan</span>
                <span className="md:hidden">Riwayat</span>
            </button>
        </div>

        {/* VIEW: STOCK MANAGEMENT */}
        {currentView === 'stock' && (
            <StockManager foodItems={foodItems} setFoodItems={setFoodItems} />
        )}

        {/* VIEW: ORDERS */}
        {currentView === 'orders' && <OrderList orders={activeOrders} />}

        {/* VIEW: HISTORY */}
        {currentView === 'history' && <HistoryList history={completedHistory} />}
    </div>
  );
};
