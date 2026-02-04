
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Report, FoodItem } from '../../../../types';
import { EmptyState } from '../../../common/EmptyState';
import { ReportsHeader } from './ReportsHeader';
import { ReportItemCard } from './ReportItemCard';
import { ReportDetailModal } from './ReportDetailModal';
import { ProductDetailOverlay } from './ProductDetailOverlay';
import { ReportsPagination } from './ReportsPagination';

export const ReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('grid');
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Mock Data
  const [reports, setReports] = useState<Report[]>([
    { 
      id: 'REP-7721', 
      orderId: 'FAR-90122',
      foodName: 'Nasi Kotak Ayam Bakar',
      title: 'Kemasan Rusak', 
      description: 'Penerima melaporkan kemasan penyok saat diterima. Isi makanan sedikit tumpah ke plastik pembungkus luar.', 
      date: '20 Feb 2025', 
      status: 'new', 
      reporter: 'User #123', 
      isUrgent: true,
      category: 'Kualitas Fisik',
      evidenceUrl: 'https://images.unsplash.com/photo-1584263343361-901ce5794591?q=80&w=1000&auto=format&fit=crop'
    },
    { 
      id: 'REP-7745', 
      orderId: 'FAR-88210',
      foodName: 'Roti Manis Assorted',
      title: 'Makanan Dingin', 
      description: 'Makanan sudah dingin saat sampai, sepertinya sudah lama berada di suhu ruang sebelum diambil relawan.', 
      date: '19 Feb 2025', 
      status: 'handled', 
      reporter: 'User #456', 
      isUrgent: false,
      category: 'Suhu Makanan',
      evidenceUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=1000&auto=format&fit=crop'
    },
    // Dummy Data Generator
    ...Array.from({ length: 15 }, (_, i) => ({
        id: `REP-${8000 + i}`,
        orderId: `FAR-${50000 + i}`,
        foodName: i % 2 === 0 ? 'Paket Sayur Matang' : 'Donat Kentang',
        title: `Laporan #${i + 3}`,
        description: 'Laporan otomatis untuk testing pagination dan detail view. Deskripsi ini menunjukkan bahwa sistem pelaporan bekerja dengan baik untuk menampung keluhan pengguna.',
        date: '18 Feb 2025',
        status: i % 3 === 0 ? 'new' : 'handled',
        reporter: `User #${i + 500}`,
        isUrgent: i % 5 === 0,
        category: i % 2 === 0 ? 'Kualitas Layanan' : 'Lainnya',
        evidenceUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'
    } as Report))
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reports.length / itemsPerPage);

  const handleContactAdmin = (report: Report) => {
    const adminPhone = "6285215376975";
    const message = encodeURIComponent(
        `Halo Admin Food AI Rescue,\n\nSaya ingin menanggapi laporan berikut:\n- ID Laporan: ${report.id}\n- ID Pesanan: ${report.orderId || '-'}\n- Judul: ${report.title}\n\nBerikut tanggapan saya: `
    );
    window.open(`https://wa.me/${adminPhone}?text=${message}`, '_blank');
  };

  const handleAction = (status: 'resolved' | 'dismissed') => {
      if (selectedReport) {
          // Update local state to reflect change immediately in UI (Mock backend update)
          const updatedReports = reports.map(r => r.id === selectedReport.id ? {...r, status: status } : r);
          setReports(updatedReports);
          setSelectedReport(null);
          alert(`Laporan ditandai sebagai ${status}.`);
      }
  };

  // Helper untuk mendapatkan dummy item berdasarkan report (untuk demo detail view)
  const getDummyProduct = (report: Report): FoodItem => ({
      id: report.orderId || 'dummy',
      name: report.foodName || 'Produk Tidak Dikenal',
      description: 'Ini adalah detail produk dari makanan yang dilaporkan. Data diambil dari database inventory.',
      quantity: 'Habis',
      initialQuantity: 10,
      currentQuantity: 0,
      expiryTime: '23:00',
      createdAt: report.date,
      imageUrl: report.evidenceUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
      providerName: 'Anda (Donatur)',
      location: {lat: 0, lng: 0, address: '-'},
      status: 'delivered',
      deliveryMethod: 'delivery'
  });

  return (
    <div className="space-y-6 animate-in fade-in">
       <ReportsHeader 
            count={reports.length} 
            layoutMode={layoutMode} 
            setLayoutMode={setLayoutMode} 
       />

       <div className={`grid gap-3 md:gap-4 ${layoutMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {currentReports.length === 0 && (
              <div className="col-span-full">
                <EmptyState 
                    icon={CheckCircle}
                    title="Bebas Laporan"
                    description="Luar biasa! Tidak ada laporan masalah pada donasi Anda."
                />
              </div>
          )}
          {currentReports.map(report => (
            <ReportItemCard 
                key={report.id} 
                report={report} 
                layoutMode={layoutMode} 
                onClick={() => setSelectedReport(report)} 
            />
          ))}
          
          {reports.length > itemsPerPage && (
            <ReportsPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
                totalItems={reports.length}
            />
          )}
       </div>

       {selectedReport && (
           <ReportDetailModal 
                report={selectedReport}
                onClose={() => setSelectedReport(null)}
                onShowProductDetail={() => setShowProductDetail(true)}
                onHandleAction={handleAction}
                onContactAdmin={handleContactAdmin}
           />
       )}

       {showProductDetail && selectedReport && (
           <ProductDetailOverlay 
              item={getDummyProduct(selectedReport)} 
              onBack={() => setShowProductDetail(false)} 
           />
       )}
    </div>
  );
};
