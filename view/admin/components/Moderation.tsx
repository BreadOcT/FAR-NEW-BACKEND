
import React, { useState, useEffect } from 'react';
import { Shield, X, AlertOctagon, CheckCircle2, Clock, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Report } from '../../../types';

export const Moderation: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([
    { id: '101', type: 'quality', reporter: 'Penerima A', target: 'Penyedia (Provider)', description: 'Makanan basi dan tidak layak konsumsi. Sudah melewati tanggal kedaluwarsa.', status: 'new', date: '10:30 AM', priority: 'high', title: 'Makanan Basi' },
    { id: '102', type: 'behavior', reporter: 'Provider C', target: 'Relawan (Volunteer)', description: 'Relawan tidak mengambil makanan sesuai jadwal yang ditentukan.', status: 'investigating', date: 'Kemarin', priority: 'medium', title: 'Pengambilan Telat' },
    { id: '103', type: 'quality', reporter: 'User E', target: 'Bug Aplikasi', description: 'Aplikasi crash ketika mencoba upload foto makanan.', status: 'new', date: '2 hari lalu', priority: 'high', title: 'App Crash' },
    { id: '104', type: 'behavior', reporter: 'User F', target: 'Bug Akun', description: 'Tidak bisa login, password reset tidak bekerja.', status: 'resolved', date: '3 hari lalu', priority: 'medium', title: 'Login Issue' },
    // Dummy Data for Pagination
    ...Array.from({length: 18}, (_, i) => ({
        id: `dummy-${i}`,
        type: i % 2 === 0 ? 'quality' : 'behavior',
        reporter: `User ${i}`,
        target: 'System',
        description: 'Auto generated report for testing pagination.',
        status: i % 3 === 0 ? 'new' : 'resolved',
        date: '1 week ago',
        priority: i % 4 === 0 ? 'high' : 'low',
        title: `Issue #${i}`
    } as Report))
  ]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'investigating' | 'resolved'>('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAction = (status: 'resolved' | 'dismissed') => {
      if(selectedReport) {
          setReports(reports.map(r => r.id === selectedReport.id ? { ...r, status } : r));
          setSelectedReport(null);
      }
  };

  const filteredReports = reports.filter(r => filterStatus === 'all' || r.status === filterStatus);

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  // Reset pagination on filter change
  useEffect(() => {
      setCurrentPage(1);
  }, [filterStatus]);

  return (
    <div className="space-y-8 animate-in fade-in">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" /> Moderasi Laporan
          </h2>
       </div>

       {/* Top Summary Cards */}
       <div className="grid grid-cols-4 gap-4">
           <div 
                onClick={() => setFilterStatus('all')}
                className={`p-5 rounded-2xl border-l-4 border-stone-800 shadow-sm cursor-pointer transition-all hover:scale-[1.02] ${filterStatus === 'all' ? 'bg-stone-100 dark:bg-stone-800 ring-2 ring-stone-200 dark:ring-stone-700' : 'bg-white dark:bg-stone-900'}`}
            >
               <h3 className="text-3xl font-black text-stone-900 dark:text-white">{reports.length}</h3>
               <p className="text-xs text-stone-500 uppercase font-bold mt-1">Total Laporan</p>
           </div>
           <div 
                onClick={() => setFilterStatus('new')}
                className={`p-5 rounded-2xl border-l-4 border-red-500 shadow-sm bg-red-50/50 cursor-pointer transition-all hover:scale-[1.02] ${filterStatus === 'new' ? 'ring-2 ring-red-200' : ''}`}
            >
               <h3 className="text-3xl font-black text-red-600">{reports.filter(r => r.status === 'new').length}</h3>
               <p className="text-xs text-red-500 uppercase font-bold mt-1">Baru</p>
           </div>
           <div 
                onClick={() => setFilterStatus('investigating')}
                className={`p-5 rounded-2xl border-l-4 border-orange-500 shadow-sm bg-orange-50/50 cursor-pointer transition-all hover:scale-[1.02] ${filterStatus === 'investigating' ? 'ring-2 ring-orange-200' : ''}`}
            >
               <h3 className="text-3xl font-black text-orange-600">{reports.filter(r => r.status === 'investigating').length}</h3>
               <p className="text-xs text-orange-500 uppercase font-bold mt-1">Diproses</p>
           </div>
           <div 
                onClick={() => setFilterStatus('resolved')}
                className={`p-5 rounded-2xl border-l-4 border-green-500 shadow-sm bg-green-50/50 cursor-pointer transition-all hover:scale-[1.02] ${filterStatus === 'resolved' ? 'ring-2 ring-green-200' : ''}`}
            >
               <h3 className="text-3xl font-black text-green-600">{reports.filter(r => r.status === 'resolved').length}</h3>
               <p className="text-xs text-green-500 uppercase font-bold mt-1">Selesai</p>
           </div>
       </div>

       {/* Search & Filter */}
       <div className="flex gap-4 items-center">
           <input 
                type="text" 
                placeholder="Cari laporan..." 
                className="flex-1 p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-[#FDFBF7] dark:bg-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
           />
           <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <span className="text-sm font-bold text-stone-600 dark:text-stone-300">Filter:</span>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-2.5 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 focus:outline-none focus:border-orange-500"
                >
                    <option value="all">Semua Status</option>
                    <option value="new">Baru</option>
                    <option value="investigating">Diproses</option>
                    <option value="resolved">Selesai</option>
                </select>
           </div>
       </div>

       {/* Report List */}
       <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
           <table className="w-full text-left border-collapse">
               <thead className="bg-stone-50 dark:bg-stone-950 text-stone-500 text-[10px] uppercase font-bold tracking-wider">
                   <tr>
                       <th className="p-5">Laporan</th>
                       <th className="p-5">Kategori</th>
                       <th className="p-5">Prioritas</th>
                       <th className="p-5">Status</th>
                       <th className="p-5 text-right">Aksi</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                   {currentReports.length === 0 ? (
                       <tr>
                           <td colSpan={5} className="p-8 text-center text-stone-500">
                               Tidak ada laporan dengan status ini.
                           </td>
                       </tr>
                   ) : (
                       currentReports.map(report => (
                       <tr key={report.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                           <td className="p-5">
                               <p className="font-bold text-sm text-stone-900 dark:text-white mb-1">{report.title}</p>
                               <p className="text-xs text-stone-500 line-clamp-1 max-w-xs">{report.description}</p>
                               <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400">
                                   <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {report.reporter}</span>
                                   <span>•</span>
                                   <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {report.date}</span>
                               </div>
                           </td>
                           <td className="p-5">
                               <div className="flex items-center gap-2 text-sm text-stone-600">
                                   {report.target.includes('Provider') && <span className="p-1.5 bg-blue-100 rounded text-blue-600"><Shield className="w-4 h-4" /></span>}
                                   {report.target.includes('Volunteer') && <span className="p-1.5 bg-green-100 rounded text-green-600"><Shield className="w-4 h-4" /></span>}
                                   {report.target.includes('Bug') && <span className="p-1.5 bg-yellow-100 rounded text-yellow-600"><AlertOctagon className="w-4 h-4" /></span>}
                                   <span className="font-medium">{report.target}</span>
                               </div>
                           </td>
                           <td className="p-5">
                               <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${report.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                   {report.priority === 'high' ? 'Urgent' : 'Medium'}
                               </span>
                           </td>
                           <td className="p-5">
                               <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${report.status === 'new' ? 'bg-red-50 text-red-600 border border-red-100' : report.status === 'resolved' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                   {report.status.replace('_', ' ')}
                               </span>
                           </td>
                           <td className="p-5 text-right">
                               <Button variant="outline" className="h-9 w-auto text-xs px-4" onClick={() => setSelectedReport(report)}>Detail</Button>
                           </td>
                       </tr>
                   )))}
               </tbody>
           </table>

           {/* Pagination Footer */}
           {filteredReports.length > 0 && (
            <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredReports.length)} of {filteredReports.length} reports
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                    </button>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-200 px-2">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                    </button>
                </div>
            </div>
          )}
       </div>
       
       {selectedReport && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setSelectedReport(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
                    
                    <div className="mb-6">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase mb-2 ${selectedReport.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                            {selectedReport.priority} Priority
                        </span>
                        <h3 className="text-xl font-bold text-stone-900 dark:text-white">{selectedReport.title}</h3>
                        <p className="text-stone-500 text-sm mt-1">{selectedReport.date} • Oleh {selectedReport.reporter}</p>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-xl border border-stone-100 dark:border-stone-700 mb-6">
                        <p className="text-sm font-bold text-stone-900 dark:text-white mb-2">Deskripsi Masalah</p>
                        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{selectedReport.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <Button variant="ghost" onClick={() => handleAction('dismissed')}>Tolak Laporan</Button>
                         <Button onClick={() => handleAction('resolved')} className="bg-green-600 hover:bg-green-700"><CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Selesai</Button>
                    </div>
                </div>
            </div>
       )}
    </div>
  );
};
