
import React, { useState } from 'react';
import { QrCode, MessageSquare, AlertTriangle, X, Star, Send, CheckCircle, Loader2, ChevronLeft, ChevronRight, MapPin, Package, Truck, Navigation, CalendarDays, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/Button';
import { ClaimHistoryItem } from '../../../types';

interface ReviewModalProps {
    item: ClaimHistoryItem;
    onClose: () => void;
    onSubmit: (rating: number, review: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ item, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Mohon berikan rating');
            return;
        }
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onSubmit(rating, review);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl max-w-md w-full relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-white">
                    <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-stone-800">
                    <img src={item.imageUrl} alt={item.foodName} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                        <h3 className="text-lg font-bold text-stone-900 dark:text-white">{item.foodName}</h3>
                        <p className="text-sm text-stone-500">{item.providerName}</p>
                    </div>
                </div>
                <div className="text-center mb-6">
                    <p className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-3">Bagaimana pengalaman Anda?</p>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-10 h-10 transition-colors ${star <= (hoverRating || rating)
                                        ? 'text-yellow-500 fill-yellow-500'
                                        : 'text-stone-300 dark:text-stone-600'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tulis ulasan Anda..."
                    rows={4}
                    className="w-full p-3 border rounded-xl dark:bg-stone-800 dark:text-white mb-6 focus:outline-none focus:border-orange-500"
                />
                <Button onClick={handleSubmit} disabled={rating === 0 || isSubmitting} className="w-full">
                    {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </Button>
            </div>
        </div>
    );
};

interface ReportModalProps {
    item: ClaimHistoryItem;
    onClose: () => void;
    onSubmit: (reason: string, description: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ item, onClose, onSubmit }) => {
    const [reason, setReason] = useState('Kualitas Makanan Buruk');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!description.trim()) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        onSubmit(reason, description);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl max-w-md w-full relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
                    <X className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold mb-4 dark:text-white">Laporkan Masalah</h3>
                <div className="space-y-4 mb-6">
                    <select 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-3 border rounded-xl dark:bg-stone-800 dark:text-white focus:outline-none focus:border-red-500"
                    >
                        <option>Kualitas Makanan Buruk</option>
                        <option>Jumlah Tidak Sesuai</option>
                        <option>Donatur Tidak Ditemukan</option>
                        <option>Lainnya</option>
                    </select>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Deskripsi masalah..."
                        rows={4}
                        className="w-full p-3 border rounded-xl dark:bg-stone-800 dark:text-white focus:outline-none focus:border-red-500"
                    />
                </div>
                <Button onClick={handleSubmit} disabled={!description.trim() || isSubmitting} className="w-full bg-red-600 hover:bg-red-700">
                    Kirim Laporan
                </Button>
            </div>
        </div>
    );
};

export const ClaimHistory: React.FC<{ history: ClaimHistoryItem[], onSelectItem: (item: ClaimHistoryItem) => void }> = ({ history: initialHistory, onSelectItem }) => {
    const [localHistory, setLocalHistory] = useState<ClaimHistoryItem[]>(initialHistory);
    const [showQr, setShowQr] = useState<string | null>(null);
    const [reviewItem, setReviewItem] = useState<ClaimHistoryItem | null>(null);
    const [reportItem, setReportItem] = useState<ClaimHistoryItem | null>(null);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredHistory = localHistory.filter(item => filter === 'all' || item.status === filter);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    const handleReviewSubmit = (rating: number, review: string) => {
        if (reviewItem) {
            setLocalHistory(prev => prev.map(item =>
                item.id === reviewItem.id ? { ...item, rating, review, status: 'completed' as const } : item
            ));
            setReviewItem(null);
        }
    };

    const handleReportSubmit = (reason: string, description: string) => {
        if (reportItem) {
            setLocalHistory(prev => prev.map(item =>
                item.id === reportItem.id ? { ...item, isReported: true } : item
            ));
            setReportItem(null);
        }
    };

    return (
        <div className="p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['all', 'active', 'completed', 'cancelled'].map(tab => (
                    <button key={tab} onClick={() => { setFilter(tab as any); setCurrentPage(1); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${filter === tab ? 'bg-orange-500 text-white' : 'bg-white dark:bg-stone-800 text-stone-600 border'}`}>
                        {tab === 'all' ? 'Semua' : tab === 'active' ? 'Aktif' : tab === 'completed' ? 'Selesai' : 'Batal'}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {currentItems.length === 0 ? (
                    <div className="text-center py-12 text-stone-500">Tidak ada riwayat klaim.</div>
                ) : (
                    currentItems.map(item => (
                        <div key={item.id} className="bg-white dark:bg-stone-900 p-4 rounded-xl border flex flex-col md:flex-row gap-4">
                            <div className="flex gap-4 flex-1">
                                <img src={item.imageUrl} alt={item.foodName} className="w-20 h-20 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-stone-900 dark:text-white">{item.foodName}</h4>
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${item.status === 'completed' ? 'bg-green-100 text-green-600' : item.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 mt-1">{item.providerName}</p>
                                    <p className="text-[10px] text-stone-400 mt-2">{item.date}</p>
                                    {item.rating && (
                                        <div className="flex items-center gap-1 mt-2">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="text-[10px] text-stone-500">{item.review}</span>
                                        </div>
                                    )}
                                    {item.isReported && <div className="mt-2 text-[10px] text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">Laporan dikirim</div>}
                                </div>
                            </div>
                            <div className="flex md:flex-col justify-end items-end gap-2 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
                                <Button variant="outline" className="h-9 text-xs px-4" onClick={() => onSelectItem(item)}>Detail</Button>
                                {item.status === 'active' && <Button className="h-9 text-xs px-4" onClick={() => setShowQr(item.uniqueCode || 'ERR')}><QrCode className="w-3 h-3 mr-1" /> Kode</Button>}
                                {item.status === 'completed' && !item.rating && (
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="h-9 text-xs" onClick={() => setReviewItem(item)}><MessageSquare className="w-3 h-3" /> Ulas</Button>
                                        {!item.isReported && <Button variant="ghost" className="h-9 text-xs text-red-500" onClick={() => setReportItem(item)}><AlertTriangle className="w-3 h-3" /> Lapor</Button>}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showQr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl max-w-sm w-full text-center relative">
                        <button onClick={() => setShowQr(null)} className="absolute top-4 right-4"><X className="w-6 h-6 text-stone-400" /></button>
                        <h3 className="font-bold dark:text-white mb-4">Kode Penukaran</h3>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${showQr}`} alt="QR" className="w-48 h-48 mx-auto mb-4 p-2 border rounded-xl" />
                        <p className="text-2xl font-mono font-bold text-stone-900 dark:text-white">{showQr}</p>
                    </div>
                </div>
            )}
            {reviewItem && <ReviewModal item={reviewItem} onClose={() => setReviewItem(null)} onSubmit={handleReviewSubmit} />}
            {reportItem && <ReportModal item={reportItem} onClose={() => setReportItem(null)} onSubmit={handleReportSubmit} />}
        </div>
    );
};
