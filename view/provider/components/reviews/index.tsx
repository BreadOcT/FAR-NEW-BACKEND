
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Review, FoodItem } from '../../../../types';
import { EmptyState } from '../../../common/EmptyState';
import { ReviewsHeader } from './ReviewsHeader';
import { ReviewItemCard } from './ReviewItemCard';
import { ReviewDetailModal } from './ReviewDetailModal';
import { ProductDetailOverlay } from './ProductDetailOverlay';
import { ReviewsPagination } from './ReviewsPagination';

export const ReviewsView: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('grid');
  const [showProductDetail, setShowProductDetail] = useState(false);
  
  const [reviews] = useState<Review[]>([
    { 
      id: '1', 
      orderId: 'FAR-90122',
      foodName: 'Roti Manis Assorted',
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
      foodName: 'Nasi Kotak Ayam Bakar',
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
        foodName: i % 2 === 0 ? 'Paket Sayur Matang' : 'Donat Kentang',
        user: `Penerima Manfaat #${i + 100}`,
        rating: 4 + (i % 2),
        comment: 'Terima kasih atas donasinya, sangat bermanfaat bagi keluarga kami di rumah. Semoga berkah selalu.',
        date: '15 Feb 2025',
        mediaUrls: i % 3 === 0 ? ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600'] : []
    } as Review))
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const getDummyProduct = (review: Review): FoodItem => ({
      id: review.orderId || 'dummy',
      name: review.foodName || 'Produk Tidak Dikenal',
      description: 'Ini adalah detail produk dari makanan yang diulas. Data diambil dari database inventory.',
      quantity: 'Habis',
      initialQuantity: 10,
      currentQuantity: 0,
      expiryTime: '23:00',
      createdAt: review.date,
      imageUrl: (review.mediaUrls && review.mediaUrls[0]) || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
      providerName: 'Anda (Donatur)',
      location: {lat: 0, lng: 0, address: '-'},
      status: 'delivered',
      deliveryMethod: 'delivery'
  });

  return (
    <div className="space-y-6 animate-in fade-in">
       <ReviewsHeader 
            count={reviews.length} 
            layoutMode={layoutMode} 
            setLayoutMode={setLayoutMode}
       />

       <div className={`grid gap-3 md:gap-4 ${layoutMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
             <ReviewItemCard 
                key={review.id} 
                review={review} 
                layoutMode={layoutMode} 
                onClick={() => setSelectedReview(review)} 
             />
          ))}
          
          {reviews.length > itemsPerPage && (
            <ReviewsPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                totalItems={reviews.length}
            />
          )}
       </div>

       {selectedReview && (
           <ReviewDetailModal 
                review={selectedReview}
                onClose={() => setSelectedReview(null)}
                onShowProductDetail={() => setShowProductDetail(true)}
           />
       )}

       {showProductDetail && selectedReview && (
           <ProductDetailOverlay 
              item={getDummyProduct(selectedReview)} 
              onBack={() => setShowProductDetail(false)} 
           />
       )}
    </div>
  );
};
