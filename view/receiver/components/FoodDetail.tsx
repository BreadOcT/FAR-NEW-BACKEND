
import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Clock, CheckCircle, MapPin, Navigation, Minus, Plus, CalendarDays, Heart, MessageCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { FoodItem } from '../../../types';
import { StoreIcon } from './StoreIcon';

interface FoodDetailProps {
  item: FoodItem;
  onBack: () => void;
  onClaim: (quantity: string) => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const FoodDetail: React.FC<FoodDetailProps> = ({ item, onBack, onClaim, isSaved, onToggleSave }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimQuantity, setClaimQuantity] = useState(1);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const maxStock = parseInt(item.quantity.replace(/\D/g, '')) || 1;

  const handleClaimClick = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      onClaim(`${claimQuantity} Porsi`);
    }, 1500);
  };

  const increment = () => {
    if (claimQuantity < maxStock) setClaimQuantity(prev => prev + 1);
  };

  const decrement = () => {
    if (claimQuantity > 1) setClaimQuantity(prev => prev - 1);
  };

  // Implementasi handleRoute yang sama dengan modul Relawan
  const handleRoute = (targetLat?: number, targetLng?: number) => {
    if (!targetLat || !targetLng) return alert("Lokasi tidak valid");
    
    setIsLoadingRoute(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLoadingRoute(false);
                const { latitude, longitude } = position.coords;
                // Menggunakan mode 'driving' dan endpoint navigasi
                const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${targetLat},${targetLng}&travelmode=driving`;
                window.open(url, '_blank');
            },
            (error) => {
                setIsLoadingRoute(false);
                // Fallback jika GPS gagal atau ditolak
                const url = `https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`;
                window.open(url, '_blank');
            }
        );
    } else {
        setIsLoadingRoute(false);
        const url = `https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`;
        window.open(url, '_blank');
    }
  };

  const handleChatToProvider = () => {
    const phoneNumber = "6285215376975";
    // Format tanggal upload
    const uploadDate = new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    // Nama penanya otomatis (Simulasi akun logged-in)
    const userName = "Siti Aminah"; 

    // Format pesan tanpa emoji
    const message = `Halo Donatur *${item.providerName}*,\n\n` +
        `Saya *${userName}* tertarik dengan donasi makanan ini:\n\n` +
        `Nama: ${item.name}\n` +
        `ID: ${item.id}\n` +
        `Diupload: ${uploadDate}\n\n` +
        `Saya ingin bertanya: `;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-950 z-[60] overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="relative h-72 md:h-80 w-full">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors z-10"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
                    <ShieldCheck className="w-3 h-3" /> AI Score {item.aiVerification?.halalScore}
                </span>
                <span className="bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    Sisa {item.quantity}
                </span>
            </div>
        </div>

        <div className="p-6 space-y-8 max-w-3xl mx-auto -mt-6 bg-[#FDFBF7] dark:bg-stone-950 rounded-t-3xl relative pb-48 md:pb-40">
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                    <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white leading-tight mb-3">{item.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-stone-600 dark:text-stone-400">
                        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-xl">
                            <StoreIcon className="w-4 h-4 text-orange-500" />
                            <span className="font-bold text-sm">{item.providerName}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-xl text-red-600 dark:text-red-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="font-bold text-xs">Exp: {item.expiryTime}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center">
                    <button 
                        onClick={onToggleSave}
                        className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border-2 transition-all active:scale-90 ${
                            isSaved 
                            ? 'bg-orange-500 border-orange-600 text-white' 
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 hover:text-orange-500 hover:border-orange-500'
                        }`}
                        title={isSaved ? "Hapus dari Simpanan" : "Simpan Makanan Ini"}
                    >
                        <Heart className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 ${isSaved ? 'text-orange-600' : 'text-stone-400'}`}>simpan</span>
                </div>
            </div>

            {/* Jadwal Distribusi */}
            <div className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-3xl border border-orange-100 dark:border-orange-800/50">
                <h3 className="font-black text-stone-800 dark:text-orange-100 text-sm flex items-center gap-2 mb-3 uppercase tracking-wider">
                    <CalendarDays className="w-4 h-4 text-orange-500" /> Jadwal Distribusi Surplus
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl border border-orange-100 dark:border-stone-800">
                        <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Mulai Ambil</p>
                        <p className="text-base font-black text-stone-900 dark:text-white">18:30</p>
                    </div>
                    <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl border border-orange-100 dark:border-stone-800">
                        <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Batas Akhir</p>
                        <p className="text-base font-black text-red-600 dark:text-red-400">21:00</p>
                    </div>
                </div>
                <p className="text-[10px] text-stone-500 mt-3 italic font-medium">*Mohon datang sesuai jadwal untuk memastikan kesegaran makanan.</p>
            </div>

            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h3 className="font-bold text-lg text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" className="w-4 h-4" alt="AI" />
                    </div>
                    Analisis Kualitas AI
                </h3>
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-base font-bold text-stone-900 dark:text-white mb-1">Layak Konsumsi</p>
                            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{item.aiVerification?.reason}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-stone-50 dark:bg-stone-950/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                        <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wide">Prediksi Bahan Utama</p>
                        <div className="flex flex-wrap gap-2">
                            {item.aiVerification?.ingredients?.map((ing, i) => (
                                <span key={i} className="text-sm px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-medium">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xl text-stone-900 dark:text-white">Lokasi Pengambilan</h3>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 flex items-start gap-2 bg-stone-100 dark:bg-stone-900 p-3 rounded-xl">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" /> {item.location.address}
                </p>
                
                {/* Map Container dengan Button Navigasi */}
                <div 
                    className="rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 relative h-56 group cursor-pointer shadow-sm" 
                    onClick={() => handleRoute(item.location.lat, item.location.lng)}
                >
                    <iframe 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        scrolling="no" 
                        marginHeight={0} 
                        marginWidth={0} 
                        src={`https://maps.google.com/maps?q=${item.location.lat},${item.location.lng}&z=15&output=embed`}
                        className="filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                    <button 
                        className="absolute bottom-4 right-4 bg-white text-stone-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRoute(item.location.lat, item.location.lng);
                        }}
                    >
                        <Navigation className="w-4 h-4" /> 
                        {isLoadingRoute ? 'Memuat Rute...' : 'Navigasi GPS'}
                    </button>
                </div>
            </div>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 md:pb-6 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 z-[70] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] md:max-w-3xl md:mx-auto md:bottom-6 md:rounded-3xl md:border md:shadow-2xl">
            <div className="flex flex-col gap-4">
                {/* Quantity & Method Row */}
                <div className="flex items-center justify-between border-b md:border-b-0 border-stone-100 dark:border-stone-800 pb-3 md:pb-0">
                    <div className="flex flex-col">
                        <p className="text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase tracking-[0.15em] mb-1">Jumlah Ambil</p>
                        <div className="flex items-center gap-4 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl w-fit">
                            <button 
                                onClick={decrement}
                                disabled={claimQuantity <= 1}
                                className="w-10 h-10 rounded-lg flex items-center justify-center bg-white dark:bg-stone-700 text-stone-600 dark:text-white shadow-sm hover:bg-stone-50 disabled:opacity-30 transition-all"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-xl font-black text-stone-900 dark:text-white min-w-[2ch] text-center">{claimQuantity}</span>
                            <button 
                                onClick={increment}
                                disabled={claimQuantity >= maxStock}
                                className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-500 text-white shadow-sm hover:bg-orange-600 disabled:opacity-30 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] text-stone-400 dark:text-stone-500 font-black uppercase tracking-[0.15em] mb-1">Metode</p>
                        <p className="text-sm font-extrabold text-stone-900 dark:text-white capitalize leading-none">
                          {item.deliveryMethod === 'pickup' 
                            ? 'Ambil Sendiri' 
                            : item.deliveryMethod === 'delivery' 
                                ? 'Antar Relawan' 
                                : 'Pickup & Antar'}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-1">Maks: {item.quantity}</p>
                    </div>
                </div>

                {/* Buttons Row */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={handleChatToProvider}
                        className="h-14 px-4 sm:px-6 rounded-2xl border-2 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-black uppercase tracking-widest hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="hidden sm:inline">Chat Donatur</span>
                    </button>

                    <Button 
                        onClick={handleClaimClick} 
                        isLoading={isClaiming} 
                        className="h-14 flex-1 text-base rounded-2xl shadow-xl shadow-orange-500/30 font-black tracking-widest uppercase bg-gradient-to-r from-orange-600 to-amber-500 border-0 active:scale-[0.97]"
                    >
                        KLAIM SEKARANG
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};
