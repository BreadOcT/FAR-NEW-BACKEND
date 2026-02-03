
import React, { useState } from 'react';
import { Star, MessageSquare, ChevronLeft, ChevronRight, X, ShoppingBag, Image as ImageIcon, Calendar, User } from 'lucide-react';
import { Review } from '../../../types';
import { EmptyState } from '../../common/EmptyState';
import { Button } from '../../components/Button';

export const ReviewsView: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviews] = useState<Review[]>([
    { 
      id: '1', 
      orderId: 'FAR-90122',
      user: 'Ibu Siti Aminah', 
      rating: 5, 
      comment: 'MasyaAllah, rotinya masih sangat empuk dan wangi. Anak-anak di panti asuhan sangat senang menerimanya. Terima kasih donatur!', 
      date: '20 Feb 2025',
      mediaUrls: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600'
      ]
    },
    { 
      id: '2', 
      orderId: 'FAR-88210',
      user: 'Bpk. Rahmad', 
      rating: 4, 
      comment: 'Makanan enak dan porsinya pas. Hanya saja kemasan plastiknya sedikit berminyak di bagian luar, tapi isinya tetap aman.', 
      date: '18 Feb 2025',
      mediaUrls: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600'
      ]
    },
    // Dummy Data
    ...Array.from({ length: 22 }, (_, i) => ({
        id: `dummy-${i}`,
        orderId: `FAR-${55000 + i}`,
        user: `Penerima Manfaat #${i + 100}`,
        rating: 4 + (i % 2),
        comment: 'Terima kasih atas donasinya, sangat bermanfaat bagi keluarga kami di rumah. Semoga berkah selalu.',
        date: '15 Feb 2025',
        mediaUrls: i % 3 === 0 ? ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600'] : []
    }))
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Ulasan Penerima ({reviews.length})</h2>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentReviews.length === 0 && (
             <div className="col-span-full">
                <EmptyState 
                    icon={MessageSquare}
                    title="Belum Ada Ulasan"
                    description="Bagikan lebih banyak donasi untuk mendapatkan ulasan dari penerima manfaat."
                />
             </div>
          )}
          {currentReviews.map(review => (
             <div 
                key={review.id} 
                onClick={() => setSelectedReview(review)}
                className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all group"
             >
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2">
                       <div className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-600 dark:text-stone-300">
                          {review.user.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors">{review.user}</p>
                          <p className="text-[10px] text-stone-500 flex items-center gap-1 font-medium"><ShoppingBag className="w-2.5 h-2.5" /> {review.orderId || 'N/A'}</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-xl">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-black text-yellow-700 dark:text-yellow-400">{review.rating}</span>
                   </div>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-300 italic line-clamp-2 leading-relaxed">"{review.comment}"</p>
                
                {review.mediaUrls && review.mediaUrls.length > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                        <ImageIcon className="w-3 h-3" /> {review.mediaUrls.length} Foto Terlampir
                    </div>
                )}
                
                <div className="mt-4 flex justify-end">
                    <span className="text-[10px] font-bold text-stone-400">{review.date}</span>
                </div>
             </div>
          ))}
          
          {reviews.length > itemsPerPage && (
            <div className="col-span-full flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800 mt-2">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, reviews.length)} of {reviews.length}
                </span>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 dark:text-stone-300"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 dark:text-stone-300"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          )}
       </div>

       {/* Modal Detail Ulasan */}
       {selectedReview && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
               <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                    {/* Header Modal */}
                    <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-xl">
                                {selectedReview.user.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-stone-900 dark:text-white leading-tight">{selectedReview.user}</h3>
                                <p className="text-xs text-stone-500 font-medium">Penerima Manfaat Terverifikasi</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedReview(null)}
                            className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Modal */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">ID Pesanan</p>
                                <div className="flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-black text-stone-800 dark:text-stone-200 tracking-tight">{selectedReview.orderId || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Rating Diberikan</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                className={`w-3.5 h-3.5 ${star <= selectedReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-stone-200'}`} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-black text-stone-800 dark:text-stone-200">{selectedReview.rating}/5</span>
                                </div>
                            </div>
                        </div>

                        {/* Comment Section */}
                        <div className="space-y-3">
                            <h4 className="font-black text-stone-900 dark:text-white text-xs flex items-center gap-2 uppercase tracking-widest">
                                <MessageSquare className="w-4 h-4 text-orange-500" /> Pesan & Kesan
                            </h4>
                            <div className="bg-[#FDFBF7] dark:bg-stone-950 p-6 rounded-[2rem] border border-orange-100 dark:border-stone-800 relative">
                                <span className="absolute top-4 left-4 text-6xl text-orange-500/10 font-serif leading-none">“</span>
                                <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed italic font-medium relative z-10 pl-2">
                                    {selectedReview.comment}
                                </p>
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="space-y-4">
                            <h4 className="font-black text-stone-900 dark:text-white text-xs flex items-center gap-2 uppercase tracking-widest">
                                <ImageIcon className="w-4 h-4 text-blue-500" /> Bukti Foto Penerima
                            </h4>
                            {selectedReview.mediaUrls && selectedReview.mediaUrls.length > 0 ? (
                                <div className={`grid gap-3 ${selectedReview.mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    {selectedReview.mediaUrls.map((url, i) => (
                                        <div key={i} className="rounded-[1.5rem] overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 aspect-video group">
                                            <img 
                                                src={url} 
                                                alt={`Review media ${i + 1}`} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                                    <p className="text-stone-400 text-xs italic">Penerima tidak melampirkan foto pada ulasan ini.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Modal */}
                    <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-stone-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{selectedReview.date}</span>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => setSelectedReview(null)}
                            className="w-auto px-8 rounded-2xl font-black uppercase tracking-widest text-xs h-12 border-2"
                        >
                            Tutup
                        </Button>
                    </div>
               </div>
           </div>
       )}
    </div>
  );
};
