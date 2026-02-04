
import React from 'react';
import { ArrowLeft, Sparkles, Truck, ShoppingBag, Timer, Clock } from 'lucide-react';
import { Button } from '../../../components/Button';
import { FoodItem } from '../../../../types';

interface ProductDetailModalProps {
    product: FoodItem;
    onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product: p, onClose }) => {
    const progressPercent = (p.currentQuantity / p.initialQuantity) * 100;

    return (
        <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-950 z-[100] overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-100 dark:border-stone-800 p-4 flex items-center gap-4 text-stone-900 dark:text-white">
                <button onClick={onClose} className="p-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="font-black text-lg truncate uppercase tracking-tight">Detail Produk Inventory</h2>
            </div>

            <div className="max-w-4xl mx-auto p-6 md:p-10 pb-32 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 relative group">
                            <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <span className="bg-white/90 backdrop-blur-md text-stone-900 px-4 py-1.5 rounded-full text-xs font-black shadow-xl uppercase tracking-widest flex items-center gap-2 border border-white/20">
                                    <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> AI Score {p.aiVerification?.halalScore || 98}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-stone-900 p-6 rounded-[2.5rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Status Ketersediaan</p>
                                    <h3 className="text-3xl font-black text-orange-600 italic leading-none">{p.currentQuantity} <span className="text-sm not-italic text-stone-400">/ {p.initialQuantity} Sisa</span></h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-bold text-stone-900 dark:text-white">{Math.round(100 - progressPercent)}% Terklaim</span>
                                </div>
                            </div>
                            <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 shadow-lg" style={{width: `${progressPercent}%`}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-stone-900 dark:text-white leading-tight mb-4">{p.name}</h1>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-orange-100 dark:border-orange-800 flex items-center gap-1.5">
                                    <Truck className="w-3 h-3" /> {p.deliveryMethod === 'both' ? 'Pick-up & Diantar' : p.deliveryMethod}
                                </span>
                                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase border border-blue-100 dark:border-orange-800 flex items-center gap-1.5">
                                    <ShoppingBag className="w-3 h-3" /> Min: {p.minQuantity || 1} • Max: {p.maxQuantity || 5}
                                </span>
                            </div>
                            <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed font-medium">"{p.description}"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Dibuat Pada</p>
                                <p className="font-bold text-stone-900 dark:text-stone-200 text-sm flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-orange-500" /> {new Date(p.createdAt).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div className="p-4 bg-stone-50 dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Expired Jam</p>
                                <p className="font-bold text-red-600 text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {p.expiryTime}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 z-50 flex gap-4">
                <Button variant="outline" onClick={onClose} className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest">
                    KEMBALI KE LIST
                </Button>
            </div>
        </div>
    );
};
