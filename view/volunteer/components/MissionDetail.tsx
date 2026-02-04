
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Phone, Clock, Navigation, CheckCircle, Package, ChevronRight, PlayCircle, Bike, Car, Box, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/Button';
import { VolunteerTask } from '../../../types';

interface MissionDetailProps {
    task: VolunteerTask;
    onBack: () => void;
    onAccept?: () => void;
}

export const MissionDetail: React.FC<MissionDetailProps> = ({ task, onBack, onAccept }) => {
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);

    // Deteksi rekomendasi kendaraan berdasarkan kuantitas
    const isLargeQuantity = task.quantity?.toLowerCase().includes('box') && parseInt(task.quantity) > 5;
    const vehicleRecommendation = isLargeQuantity ? 'Mobil' : 'Motor';

    const handleRoute = (targetLat?: number, targetLng?: number) => {
        if (!targetLat || !targetLng) return alert("Lokasi tidak valid");
        
        setIsLoadingRoute(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setIsLoadingRoute(false);
                    const { latitude, longitude } = position.coords;
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${targetLat},${targetLng}&travelmode=driving`;
                    window.open(url, '_blank');
                },
                (error) => {
                    setIsLoadingRoute(false);
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

    const handleContact = (phone?: string) => {
        if(phone) window.open(`https://wa.me/${phone.replace(/\D/g,'')}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-950 z-[100] overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header / Navbar */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 p-4 flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-stone-800 dark:text-white" />
                </button>
                <div>
                    <h2 className="font-black text-lg text-stone-900 dark:text-white leading-none">Detail Misi</h2>
                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-0.5">#{task.id} • {task.distanceStr}</p>
                </div>
            </div>

            <div className="p-6 pb-40 space-y-6 max-w-2xl mx-auto">
                
                {/* 1. Map Route Info Card (Pengganti Embed Map) */}
                <div className="bg-white dark:bg-stone-900 p-2 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                    <div className="bg-stone-100 dark:bg-stone-800 rounded-[1.5rem] p-6 md:p-8 text-center relative overflow-hidden flex flex-col items-center justify-center gap-4 group">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_placeholder.png')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"></div>
                        
                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-full flex items-center justify-center mb-1 shadow-inner">
                                <Navigation className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">Total Jarak Tempuh</p>
                                <h3 className="text-4xl font-black text-stone-900 dark:text-white tracking-tight">{task.distanceStr}</h3>
                            </div>
                            <p className="text-[10px] text-stone-500 max-w-xs mx-auto leading-relaxed mb-2">
                                Pilih tujuan navigasi di bawah ini untuk membuka Google Maps.
                            </p>
                        </div>

                        {/* Navigation Buttons Grid */}
                        <div className="relative z-10 w-full grid grid-cols-2 gap-3 mt-2">
                            <Button
                                onClick={() => handleRoute(task.donorLocation?.lat, task.donorLocation?.lng)}
                                className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20 border-0 flex flex-col items-center justify-center gap-0.5 leading-none"
                            >
                                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Ke Jemput</span>
                                <span className="text-[8px] opacity-80 font-medium">(Donatur)</span>
                            </Button>
                            <Button
                                onClick={() => handleRoute(task.receiverLocation?.lat, task.receiverLocation?.lng)}
                                className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border-0 flex flex-col items-center justify-center gap-0.5 leading-none"
                            >
                                <span className="flex items-center gap-1.5"><Navigation className="w-3 h-3" /> Ke Antar</span>
                                <span className="text-[8px] opacity-80 font-medium">(Penerima)</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 2. Kartu Rekomendasi & Reward */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col justify-center items-center text-center">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Rekomendasi</p>
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-black text-lg">
                            {vehicleRecommendation === 'Motor' ? <Bike className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                            {vehicleRecommendation}
                        </div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex flex-col justify-center items-center text-center">
                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">Reward Misi</p>
                        <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 font-black text-lg">
                            <span className="text-2xl">{task.points}</span> PTS
                        </div>
                    </div>
                </div>

                {/* 3. Manifest Muatan (Detail Makanan) */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h3 className="font-black text-stone-900 dark:text-white text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Box className="w-4 h-4 text-orange-500" /> Manifest Muatan
                    </h3>
                    
                    <div className="flex gap-4 items-start mb-6">
                        <img src={task.imageUrl} alt={task.items} className="w-20 h-20 rounded-2xl object-cover bg-stone-100" />
                        <div>
                            <h4 className="font-bold text-lg text-stone-900 dark:text-white leading-tight">{task.items}</h4>
                            <p className="text-sm text-stone-500 font-medium mt-1">{task.quantity}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Kondisi {task.foodCondition}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-100 dark:border-stone-800">
                        <p className="text-xs text-stone-500 leading-relaxed italic">
                            "{task.description}"
                        </p>
                        {task.ingredients && (
                            <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Kandungan Utama:</p>
                                <p className="text-xs font-medium text-stone-700 dark:text-stone-300">{task.ingredients.join(', ')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Timeline Rute (Logistik) */}
                <div className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                    <h3 className="font-black text-stone-900 dark:text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-orange-500" /> Rencana Perjalanan
                    </h3>
                    
                    <div className="relative pl-4 space-y-8 border-l-2 border-dashed border-stone-200 dark:border-stone-700 ml-2">
                        {/* Jemput */}
                        <div className="relative">
                            <div className="absolute -left-[23px] top-0 w-6 h-6 bg-orange-500 rounded-full border-4 border-white dark:border-stone-900 shadow-sm flex items-center justify-center text-[10px] text-white font-bold">1</div>
                            <div>
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">TITIK PENJEMPUTAN</p>
                                <h4 className="font-bold text-stone-900 dark:text-white">{task.from}</h4>
                                <p className="text-xs text-stone-500 mt-0.5">{task.donorLocation?.address}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-stone-600 dark:text-stone-400 font-bold flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Buka: {task.donorOpenHours}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Antar */}
                        <div className="relative">
                            <div className="absolute -left-[23px] top-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-white dark:border-stone-900 shadow-sm flex items-center justify-center text-[10px] text-white font-bold">2</div>
                            <div>
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">TITIK PENGANTARAN</p>
                                <h4 className="font-bold text-stone-900 dark:text-white">{task.to}</h4>
                                <p className="text-xs text-stone-500 mt-0.5">{task.receiverLocation?.address}</p>
                                <p className="text-[10px] text-orange-600 font-bold mt-1 bg-orange-50 dark:bg-orange-900/10 px-2 py-0.5 rounded w-fit">
                                    Jarak tempuh: {task.receiverDistanceStr}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tombol Navigasi & Kontak (Hanya Aktif jika status 'active') */}
                {task.status === 'active' && (
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => handleContact(task.donorPhone)}>
                            <Phone className="w-4 h-4 mr-2" /> Hubungi Donatur
                        </Button>
                        <Button variant="outline" onClick={() => handleContact(task.receiverPhone)}>
                            <Phone className="w-4 h-4 mr-2" /> Hubungi Penerima
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar (Fixed) */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 z-[110] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto flex gap-4">
                    {task.status === 'available' ? (
                        <Button 
                            onClick={onAccept}
                            className="h-14 rounded-2xl text-base font-black uppercase tracking-widest bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-xl shadow-orange-900/30 border-0 flex-1"
                        >
                            <PlayCircle className="w-5 h-5 mr-2 fill-current" /> AMBIL MISI INI
                        </Button>
                    ) : (
                        <div className="flex gap-3 w-full">
                            <Button 
                                onClick={() => handleRoute(task.donorLocation?.lat, task.donorLocation?.lng)}
                                className="flex-1 h-14 rounded-2xl text-sm font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white shadow-lg border-0"
                            >
                                <Navigation className="w-5 h-5 mr-2" /> GPS JEMPUT
                            </Button>
                            <Button 
                                onClick={() => handleRoute(task.receiverLocation?.lat, task.receiverLocation?.lng)}
                                className="flex-1 h-14 rounded-2xl text-sm font-black uppercase tracking-widest bg-green-600 hover:bg-green-500 text-white shadow-lg border-0"
                            >
                                <Navigation className="w-5 h-5 mr-2" /> GPS ANTAR
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
