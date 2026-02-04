
import React from 'react';
import { AlertTriangle, X, Package, ShoppingBag, User, Calendar, Shield, Image as ImageIcon, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Report } from '../../../../types';

interface ReportDetailModalProps {
    report: Report;
    onClose: () => void;
    onShowProductDetail: () => void;
    onHandleAction: (status: 'resolved' | 'dismissed') => void;
    onContactAdmin: (report: Report) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ 
    report, 
    onClose, 
    onShowProductDetail, 
    onHandleAction,
    onContactAdmin 
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                {/* Header Modal */}
                <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${report.isUrgent ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-stone-900 dark:text-white leading-tight">{report.title}</h3>
                            <p className="text-xs text-stone-500 font-medium">Laporan ID: {report.id}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content Modal */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    {/* Product & Order Info Section */}
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-stone-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-stone-800 rounded-xl">
                                <Package className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Produk Terkait</p>
                                <p className="font-bold text-stone-900 dark:text-white text-sm">{report.foodName || 'Nasi Kotak'}</p>
                            </div>
                        </div>
                        <Button 
                            variant="outline" 
                            className="h-8 text-[10px] px-3 bg-white border-orange-200 text-orange-600 hover:bg-orange-100 w-auto"
                            onClick={onShowProductDetail}
                        >
                            Cek Detail Produk
                        </Button>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">ID Pesanan</p>
                            <span className="text-xs font-black text-orange-600 dark:text-orange-400">{report.orderId || 'N/A'}</span>
                        </div>
                        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Status</p>
                            <span className={`text-xs font-bold uppercase ${report.status === 'handled' ? 'text-green-600' : 'text-orange-500'}`}>
                                {report.status}
                            </span>
                        </div>
                        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Kategori</p>
                            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{report.category || 'Umum'}</span>
                        </div>
                        <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Tanggal</p>
                            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{report.date}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <h4 className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-2 uppercase tracking-widest">
                            <Shield className="w-4 h-4 text-orange-500" /> Deskripsi Laporan
                        </h4>
                        <div className="bg-[#FDFBF7] dark:bg-stone-900 p-5 rounded-[1.5rem] border border-stone-200 dark:border-stone-800">
                            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {report.description}
                            </p>
                        </div>
                    </div>

                    {/* Evidence Image */}
                    <div className="space-y-3">
                        <h4 className="font-black text-stone-900 dark:text-white text-sm flex items-center gap-2 uppercase tracking-widest">
                            <ImageIcon className="w-4 h-4 text-blue-500" /> Bukti Foto (Screenshot)
                        </h4>
                        {report.evidenceUrl ? (
                            <div className="rounded-[2rem] overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800">
                                <img 
                                    src={report.evidenceUrl} 
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
                            onClick={onClose}
                            className="flex-1 rounded-2xl font-black uppercase tracking-widest text-xs h-12"
                        >
                            Tutup
                        </Button>
                        {report.status === 'new' && (
                            <Button 
                                onClick={() => onContactAdmin(report)}
                                className="flex-1 rounded-2xl font-black uppercase tracking-widest text-xs h-12 bg-[#25D366] hover:bg-[#128C7E] border-none shadow-green-500/20"
                            >
                                <MessageSquare className="w-4 h-4 mr-1" /> Beri Tanggapan
                            </Button>
                        )}
                    </div>
                    {/* Additional Actions Inside Modal (Optional - not in original design but good for completion based on state) */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                         <Button variant="ghost" onClick={() => onHandleAction('dismissed')} className="h-10 text-xs">Tolak Laporan</Button>
                         <Button onClick={() => onHandleAction('resolved')} className="bg-green-600 hover:bg-green-700 h-10 text-xs"><CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Selesai</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
