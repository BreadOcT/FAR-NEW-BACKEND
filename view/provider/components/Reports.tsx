
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, X, Image as ImageIcon, User, Calendar, Tag, Shield, ShoppingBag, MessageSquare } from 'lucide-react';
import { Report } from '../../../types';
import { EmptyState } from '../../common/EmptyState';
import { Button } from '../../components/Button';

export const ReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports] = useState<Report[]>([
    { 
      id: 'REP-7721', 
      orderId: 'FAR-90122',
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
      title: 'Makanan Dingin', 
      description: 'Makanan sudah dingin saat sampai, sepertinya sudah lama berada di suhu ruang sebelum diambil relawan.', 
      date: '19 Feb 2025', 
      status: 'handled', 
      reporter: 'User #456', 
      isUrgent: false,
      category: 'Suhu Makanan',
      evidenceUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=1000&auto=format&fit=crop'
    },
    // Dummy Data
    ...Array.from({ length: 15 }, (_, i) => ({
        id: `REP-${8000 + i}`,
        orderId: `FAR-${50000 + i}`,
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

  return (
    <div className="space-y-6 animate-in fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Laporan Masuk ({reports.length})</h2>
       </div>
       <div className="space-y-4">
          {currentReports.length === 0 && (
              <EmptyState 
                icon={CheckCircle}
                title="Bebas Laporan"
                description="Luar biasa! Tidak ada laporan masalah pada donasi Anda."
              />
          )}
          {currentReports.map(report => (
            <div 
              key={report.id} 
              onClick={() => setSelectedReport(report)}
              className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-orange-500/50 hover:shadow-md transition-all group"
            >
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-5 h-5 transition-colors ${report.isUrgent ? 'text-red-500' : 'text-orange-500 group-hover:text-orange-600'}`} />
                      <h3 className="font-bold text-lg text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors">{report.title}</h3>
                      {report.isUrgent && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">Urgent</span>}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.status === 'handled' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>{report.status}</span>
               </div>
               <p className="text-sm text-stone-600 dark:text-stone-300 mb-3 line-clamp-1">{report.description}</p>
               <div className="flex justify-between items-center text-xs text-stone-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">
                        <ShoppingBag className="w-3 h-3" /> {report.orderId || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {report.reporter}</span>
                  </div>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
               </div>
            </div>
          ))}
          
          {reports.length > itemsPerPage && (
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, reports.length)} of {reports.length}
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

       {/* Modal Detail Laporan */}
       {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
              {/* Header Modal */}
              <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${selectedReport.isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-stone-900 dark:text-white leading-tight">{selectedReport.title}</h3>
                    <p className="text-xs text-stone-500 font-medium">Laporan ID: {selectedReport.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content Modal */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Meta Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">ID Pesanan</p>
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400">{selectedReport.orderId || 'N/A'}</span>
                  </div>
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={`text-xs font-bold uppercase ${selectedReport.status === 'handled' ? 'text-green-600' : 'text-orange-500'}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Kategori</p>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{selectedReport.category || 'Umum'}</span>
                  </div>
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Tanggal</p>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{selectedReport.date}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h4 className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-2 uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-orange-500" /> Deskripsi Laporan
                  </h4>
                  <div className="bg-[#FDFBF7] dark:bg-stone-950 p-5 rounded-[1.5rem] border border-stone-200 dark:border-stone-800">
                    <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedReport.description}
                    </p>
                  </div>
                </div>

                {/* Evidence Image */}
                <div className="space-y-3">
                  <h4 className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-2 uppercase tracking-widest">
                    <ImageIcon className="w-4 h-4 text-blue-500" /> Bukti Foto (Screenshot)
                  </h4>
                  {selectedReport.evidenceUrl ? (
                    <div className="rounded-[2rem] overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800">
                      <img 
                        src={selectedReport.evidenceUrl} 
                        alt="Bukti Laporan" 
                        className="w-full h-auto max-h-[400px] object-contain hover:scale-[1.02] transition-transform duration-500" 
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-stone-50 dark:bg-stone-800/30 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800">
                      <p className="text-stone-400 text-sm italic">Tidak ada bukti foto yang dilampirkan.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Modal */}
              <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedReport(null)}
                    className="flex-1 rounded-2xl font-black uppercase tracking-widest text-xs h-12"
                  >
                    Tutup
                  </Button>
                  {selectedReport.status === 'new' && (
                    <Button 
                      onClick={() => handleContactAdmin(selectedReport)}
                      className="flex-1 rounded-2xl font-black uppercase tracking-widest text-xs h-12 bg-[#25D366] hover:bg-[#128C7E] border-none shadow-green-500/20"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" /> Beri Tanggapan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
       )}
    </div>
  );
};
