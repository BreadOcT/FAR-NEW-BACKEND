
import React from 'react';
import { ArrowLeft, X, MapPin, Package, Truck, Navigation, ShoppingBag, CalendarDays, QrCode, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { ClaimHistoryItem } from '../../../types';

interface ClaimHistoryDetailProps {
    item: ClaimHistoryItem;
    onBack: () => void;
    onComplete?: () => void;
}

export const ClaimHistoryDetail: React.FC<ClaimHistoryDetailProps> = ({ item, onBack, onComplete }) => {
    const openInMaps = () => {
        if (item.location) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lng}`, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-950 z-[100] overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Hero Image Section */}
            <div className="relative h-72 md:h-80 w-full">
                <img src={item.imageUrl} alt={item.foodName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <button 
                    onClick={onBack}
                    className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors z-10"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="absolute bottom-6 left-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 shadow-lg ${
                        item.status === 'completed' ? 'bg-green-500 text-white' : 
                        item.status === 'active' ? 'bg-orange-500 text-white' : 
                        'bg-red-500 text-white'
                    }`}>
                        Status: {item.status}
                    </span>
                    <h1 className="text-3xl font-black text-white leading-tight drop-shadow-md">{item.foodName}</h1>
                    <p className="text-orange-400 font-bold flex items-center gap-1.5 mt-1 drop-shadow-sm">
                        <Package className="w-4 h-4" /> {item.providerName}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 space-y-8 max-w-3xl mx-auto -mt-6 bg-[#FDFBF7] dark:bg-stone-950 rounded-t-[2.5rem] relative pb-32">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-transform hover:scale-[1.02]">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Jumlah Klaim</p>
                        <p className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-orange-500" /> {item.claimedQuantity || '1 Porsi'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm transition-transform hover:scale-[1.02]">
                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">Metode Distribusi</p>
                        <p className="text-xl font-black text-stone-900 dark:text-white capitalize flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-500" /> {item.deliveryMethod === 'pickup' ? 'Mandiri' : 'Relawan'}
                        </p>
                    </div>
                </div>

                {/* Schedule Card */}
                <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-[2rem] border border-orange-100 dark:border-orange-800/50">
                    <h3 className="font-black text-stone-800 dark:text-orange-100 text-sm flex items-center gap-2 mb-4 uppercase tracking-widest">
                        <CalendarDays className="w-5 h-5 text-orange-500" /> Jadwal Pengambilan
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-orange-100 dark:border-stone-800">
                            <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Mulai</p>
                            <p className="text-base font-black text-green-600">{item.distributionHours?.start || '18:30'}</p>
                        </div>
                        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-orange-100 dark:border-stone-800">
                            <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Batas Akhir</p>
                            <p className="text-base font-black text-red-600">{item.distributionHours?.end || '21:00'}</p>
                        </div>
                    </div>
                </div>

                {/* Location & Map Preview Section (Sesuai Permintaan) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-xl text-stone-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-orange-500" /> Lokasi Pengambilan
                        </h3>
                    </div>
                    
                    <p className="text-sm text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 leading-relaxed font-medium">
                        {item.location?.address}
                    </p>
                    
                    {/* Map Iframe Container */}
                    <div className="rounded-[2.5rem] overflow-hidden border border-stone-200 dark:border-stone-800 relative h-64 group cursor-pointer shadow-md transition-all hover:shadow-xl" onClick={openInMaps}>
                        <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight={0} 
                            marginWidth={0} 
                            src={`https://maps.google.com/maps?q=${item.location?.lat || -6.914744},${item.location?.lng || 107.609810}&z=15&output=embed`}
                            className="filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-105"
                        ></iframe>
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                        
                        <button className="absolute bottom-5 right-5 bg-white dark:bg-stone-900 text-stone-900 dark:text-white px-6 py-3 rounded-full text-sm font-black shadow-2xl flex items-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <Navigation className="w-4 h-4 text-orange-500" /> Buka Google Maps
                        </button>
                    </div>
                </div>

                {/* Unique Code Section for Active Claims */}
                {item.status === 'active' && item.uniqueCode && (
                    <div className="bg-stone-900 dark:bg-black p-8 rounded-[2.5rem] text-center space-y-6 shadow-2xl border border-white/5">
                        <div className="space-y-1">
                            <h4 className="text-orange-500 font-black text-xs uppercase tracking-[0.3em]">Kode Unik Penukaran</h4>
                            <p className="text-stone-400 text-[10px]">Tunjukkan kode ini kepada petugas di lokasi</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-3xl inline-block shadow-inner ring-8 ring-stone-800/50">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${item.uniqueCode}`} alt="QR Code" className="w-40 h-40" />
                        </div>
                        
                        <div>
                            <p className="text-4xl font-black text-white tracking-[0.2em] font-mono select-all">
                                {item.uniqueCode}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 z-[110]">
                <div className="max-w-3xl mx-auto flex gap-4">
                    {/* Tombol Tutup Detail dihapus sesuai instruksi */}
                    
                    {item.status === 'active' && (
                        <>
                            {onComplete && (
                                <Button 
                                    onClick={onComplete}
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 shadow-green-500/20"
                                >
                                    <CheckCircle2 className="w-5 h-5 mr-1" /> Pesanan Selesai
                                </Button>
                            )}
                            
                            {/* Tombol Petunjuk Jalan HANYA muncul jika pickup */}
                            {item.deliveryMethod === 'pickup' && (
                                <Button 
                                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest shadow-orange-500/20"
                                    onClick={() => alert("Membuka petunjuk pengambilan...")}
                                >
                                    PETUNJUK JALAN
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
