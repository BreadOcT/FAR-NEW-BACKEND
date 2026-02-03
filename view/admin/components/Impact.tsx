
import React from 'react';
import { TrendingUp, Leaf } from 'lucide-react';
import { Button } from '../../components/Button';

// Helper Chart
const AdminBarChart = ({ data, labels, colorClass }: { data: number[], labels: string[], colorClass: string }) => {
    const max = Math.max(...data, 10);
    return (
      <div className="flex items-end gap-2 h-40 mt-6 w-full">
        {data.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col justify-end group relative h-full">
            <div className="relative w-full flex-1 flex items-end">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-500 ${colorClass} opacity-80 hover:opacity-100 hover:scale-y-105 origin-bottom`} 
                  style={{ height: `${(val / max) * 100}%`, minHeight: '4px' }}
                ></div>
            </div>
            <p className="text-[10px] text-center text-stone-400 mt-2">{labels[idx]}</p>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              {val}
            </div>
          </div>
        ))}
      </div>
    );
};

export const Impact: React.FC = () => {
  const handleExportImpactCSV = () => alert('Mengunduh Impact Data (CSV)...');
  const handleGenerateReport = () => alert('Membuat Laporan CSR & ESG (PDF)...');

  return (
      <div className="space-y-8 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" /> Laporan Dampak Sosial
              </h2>
              <div className="flex gap-2">
                  <Button variant="outline" className="text-xs h-9 w-auto px-4" onClick={handleExportImpactCSV}>Export Data</Button>
                  <Button className="text-xs h-9 w-auto px-4 bg-orange-500 hover:bg-orange-600" onClick={handleGenerateReport}>Buat Laporan PDF</Button>
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white">Pengurangan Limbah Pangan (Kg)</h3>
                  <AdminBarChart data={[300, 450, 320, 500, 480, 600, 550]} labels={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']} colorClass="bg-[#00C853]" />
              </div>
              <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
                  <h3 className="font-bold text-sm text-stone-900 dark:text-white">Penerima Manfaat Terbantu</h3>
                  <AdminBarChart data={[50, 65, 45, 80, 70, 90, 85]} labels={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']} colorClass="bg-[#2979FF]" />
              </div>
          </div>

          <div className="bg-[#004D40] rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl relative overflow-hidden">
               <div className="relative z-10 flex-1">
                   <h3 className="text-3xl font-black mb-4 tracking-tight">Target Zero Waste 2030</h3>
                   <p className="text-emerald-100 text-lg leading-relaxed mb-6">Kita telah mencapai 24% dari target pengurangan limbah tahunan hanya dalam 3 bulan pertama. Teruskan momentum ini!</p>
                   <div className="flex gap-4">
                       <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                           <p className="text-xs text-emerald-200 uppercase font-bold">Target Q1</p>
                           <p className="text-xl font-bold">50 Ton</p>
                       </div>
                       <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                           <p className="text-xs text-emerald-200 uppercase font-bold">Tercapai</p>
                           <p className="text-xl font-bold">12.5 Ton</p>
                       </div>
                   </div>
               </div>
               
               {/* Progress Circle Visual */}
               <div className="w-48 h-48 relative flex-shrink-0 z-10 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 128 128">
                       <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="transparent" />
                       <circle cx="64" cy="64" r="56" stroke="#00E676" strokeWidth="12" fill="transparent" strokeDasharray="351.86" strokeDashoffset="267.4" strokeLinecap="round" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center font-black text-4xl">24%</div>
               </div>
               
               {/* Background Decor */}
               <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
               <div className="absolute left-10 top-10 opacity-10">
                   <Leaf className="w-64 h-64" />
               </div>
          </div>
      </div>
  );
};
