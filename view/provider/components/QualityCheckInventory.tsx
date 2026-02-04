
import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldCheck, Zap, CheckCircle2, AlertOctagon, 
  Clock, List, FileText, ShieldAlert, BookOpen, AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/Button';
import { FoodItem } from '../../../types';
import { QualityCheckInventoryInput } from './QualityCheckInventoryInput';

interface QualityCheckInventoryProps {
  onBack: () => void;
  onSuccess: (item: FoodItem) => void;
}

export const QualityCheckInventory: React.FC<QualityCheckInventoryProps> = ({ onBack, onSuccess }) => {
  const [view, setView] = useState<'input' | 'result'>('input');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const handleAnalysisComplete = (result: any, image: string, data: any) => {
    setAnalysisResult(result);
    setPreviewImage(image);
    setFormData(data);
    setView('result');
  };

  const handleFinalPublish = () => {
      if (!analysisResult || !formData) return;
      
      const qtyNum = parseInt(formData.quantity) || 0;
      const newItem: FoodItem = {
          id: Date.now().toString(),
          name: formData.name,
          description: analysisResult.reasoning,
          quantity: `${formData.quantity} ${formData.quantityUnit}`,
          initialQuantity: qtyNum,
          currentQuantity: qtyNum,
          expiryTime: formData.distributionEnd ? formData.distributionEnd.split('T')[1] : '23:59',
          createdAt: formData.madeDateTime,
          imageUrl: previewImage!,
          providerName: "Donatur Berkah",
          location: { lat: -6.914744, lng: 107.60981, address: "Jl. Asia Afrika No. 1, Bandung" },
          status: 'available',
          deliveryMethod: formData.deliveryMethod,
          aiVerification: { 
              isEdible: analysisResult.qualityPercentage > 70.01,
              halalScore: analysisResult.halalScore || 0,
              reason: analysisResult.reasoning,
              ingredients: analysisResult.detectedItems?.map((i:any) => i.name) || []
          },
          socialImpact: analysisResult.socialImpact
      };
      onSuccess(newItem);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm min-h-[80vh] flex flex-col relative overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between sticky top-0 bg-white dark:bg-stone-900 z-10 text-stone-900 dark:text-white">
            <div className="flex items-center gap-3">
                <button onClick={view === 'result' ? () => setView('input') : onBack} className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold">
                    {view === 'input' ? 'Daftarkan Donasi Baru' : 'Hasil Audit Kualitas AI'}
                </h2>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 md:px-8">
            {view === 'input' ? (
                <QualityCheckInventoryInput 
                    onAnalysisComplete={handleAnalysisComplete} 
                    onBack={onBack} 
                />
            ) : (
                <div className="w-full max-w-3xl mx-auto py-8 space-y-8 pb-32 animate-in slide-in-from-bottom-12 duration-700">
                     
                     {/* Alert jika kualitas rendah */}
                     {analysisResult.qualityPercentage < 70.01 && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-8 rounded-[2.5rem] text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto text-red-600 border border-red-200">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-red-700 italic">Kualitas di Bawah Standar</h3>
                                <p className="text-sm text-stone-500 mt-2">Dibutuhkan minimal 70.01% untuk publikasi ke publik.</p>
                            </div>
                            <Button variant="outline" className="w-auto px-8 mx-auto h-12 rounded-2xl border-red-200 text-red-600 font-bold" onClick={() => setView('input')}>
                                Coba Foto Lain
                            </Button>
                        </div>
                     )}

                     {/* CARD UTAMA HASIL AI (Dibuat Elegan) */}
                     <div className="bg-[#1A1D27] dark:bg-[#0F1117] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        
                        <div className="relative z-10">
                            <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">QUALITY PERCENTAGE</p>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                <div className="text-8xl font-black text-[#00E676] tracking-tighter italic leading-none">
                                    {analysisResult.qualityPercentage}%
                                </div>
                                <div className={`inline-flex px-6 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest ${analysisResult.qualityPercentage >= 70 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                    {analysisResult.qualityPercentage >= 70 ? (
                                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> APPROVED</span>
                                    ) : (
                                        <span className="flex items-center gap-2"><AlertOctagon className="w-4 h-4" /> REJECTED</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col justify-center">
                                    <p className="text-stone-500 text-[9px] font-black uppercase tracking-widest mb-1">HYGIENE SCORE</p>
                                    <p className="text-2xl font-bold flex items-center gap-2 text-yellow-400">
                                        <Zap className="w-5 h-5 fill-current" /> {analysisResult.hygieneScore}/100
                                    </p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col justify-center">
                                    <p className="text-stone-500 text-[9px] font-black uppercase tracking-widest mb-1">STATUS HALAL</p>
                                    <p className="text-2xl font-bold flex items-center gap-2 text-emerald-400">
                                        <ShieldCheck className="w-5 h-5" /> {analysisResult.isHalal ? 'Terverifikasi' : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <FileText className="w-3.5 h-3.5" /> DESKRIPSI HASIL ANALISIS
                                </h4>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                                    {/* NARASI MINIMAL SATU PARAGRAF */}
                                    <p className="text-stone-200 text-sm leading-relaxed font-medium italic">
                                        "{analysisResult.reasoning}"
                                    </p>
                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[10px] text-stone-400 font-black uppercase mb-1">Catatan Keamanan Pangan:</p>
                                        <p className="text-xs text-stone-400 leading-relaxed font-medium">
                                            {analysisResult.halalReasoning || "Berdasarkan audit visual, makanan memiliki kemasan yang bersih dan bahan-bahan yang terdeteksi secara alami adalah halal. Makanan direkomendasikan untuk segera didistribusikan."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>

                     {/* Item Terdeteksi Section */}
                     <div className="space-y-4">
                        <h4 className="font-black text-sm text-stone-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                            <List className="w-4 h-4 text-orange-500" /> Item Terdeteksi dalam Foto
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.detectedItems?.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl">
                                    <span className="text-sm font-black text-blue-700 dark:text-blue-300 uppercase tracking-tighter">{item.name}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                                    <span className="text-[10px] font-black text-blue-400 uppercase">{item.category}</span>
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Alergen & Prediksi Simpan */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                            <h4 className="font-black text-xs text-stone-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" /> Peringatan Alergen
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.allergens?.length > 0 ? analysisResult.allergens.map((alg: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100">{alg}</span>
                                )) : <span className="text-stone-400 text-xs italic">Tidak ada alergen terdeteksi.</span>}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-200 dark:border-stone-800 shadow-sm">
                            <h4 className="font-black text-xs text-stone-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" /> Masa Simpan Aman
                            </h4>
                            <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                                Prediksi hingga: <span className="text-blue-600 dark:text-blue-400">{analysisResult.shelfLifePrediction}</span>
                            </p>
                            <p className="text-[10px] text-stone-400 mt-1 italic">*Dihitung dari lokasi simpan {formData.storageLocation}</p>
                        </div>
                     </div>

                     {/* Tips AI */}
                     <div className="bg-[#FDFBF7] dark:bg-stone-950 p-8 rounded-[2.5rem] border border-orange-100 dark:border-stone-800 shadow-inner">
                        <h4 className="font-black text-sm text-stone-900 dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-orange-500" /> Tips Penyimpanan Auditor AI
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                            {analysisResult.storageTips?.map((tip: string, i: number) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-md">{i + 1}</div>
                                    <p className="text-sm text-stone-700 dark:text-stone-300 font-medium leading-relaxed">{tip}</p>
                                </div>
                            ))}
                        </div>
                     </div>

                     {/* Action Buttons */}
                     {analysisResult.qualityPercentage >= 70.01 ? (
                        <Button onClick={handleFinalPublish} className="h-16 text-lg font-black tracking-widest uppercase shadow-xl shadow-orange-500/20 rounded-2xl">
                            PUBLIKASIKAN DONASI SEKARANG
                        </Button>
                     ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" onClick={() => setView('input')} className="h-16 text-xs font-black uppercase rounded-2xl">AMBIL FOTO ULANG</Button>
                            <Button variant="ghost" onClick={onBack} className="h-16 text-xs font-black uppercase rounded-2xl">BATALKAN</Button>
                        </div>
                     )}
                </div>
            )}
        </div>
    </div>
  );
};
