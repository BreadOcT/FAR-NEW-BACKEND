
import React, { useState, useEffect } from 'react';
import { Truck, ArrowRight, MapPin, X, Navigation } from 'lucide-react';
import { Button } from '../../components/Button';
import { DistributionTask, ClaimHistoryItem } from '../../../types';

interface DistributionProps {
    claims?: ClaimHistoryItem[];
}

export const Distribution: React.FC<DistributionProps> = ({ claims = [] }) => {
  // Filter claims that need distribution (not pickup)
  const [activeDeliveries, setActiveDeliveries] = useState<DistributionTask[]>([]);
  const [showAssignVolunteerModal, setShowAssignVolunteerModal] = useState<string | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState<DistributionTask | null>(null);

  // Sync props to internal state representation
  useEffect(() => {
      const tasks: DistributionTask[] = claims
        .filter(c => c.deliveryMethod !== 'pickup')
        .map(c => ({
            id: c.id,
            volunteer: c.courierName || 'Belum Ditugaskan',
            from: c.providerName,
            to: 'Penerima',
            status: c.status === 'completed' ? 'completed' : c.courierStatus === 'picking_up' ? 'picking_up' : c.courierStatus === 'delivering' ? 'delivering' : 'pending',
            startTime: c.date,
            priority: 'normal',
            distance: '2.5 km' // Mock distance
        }));
      setActiveDeliveries(tasks);
  }, [claims]);

  const handleAssignVolunteer = (taskId: string, volunteerName: string) => {
      // In a real app, this would call an API to update the ClaimHistoryItem in App.tsx
      // For now, we update local state to reflect UI change
      setActiveDeliveries(prev => prev.map(d => d.id === taskId ? { ...d, volunteer: volunteerName, status: 'picking_up' } : d));
      setShowAssignVolunteerModal(null);
      alert(`Tugas berhasil diberikan kepada ${volunteerName}`);
  };

  const pendingCount = activeDeliveries.filter(d => d.status === 'pending').length;
  const activeCount = activeDeliveries.filter(d => d.status === 'picking_up' || d.status === 'delivering').length;

  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Truck className="w-6 h-6 text-orange-500" /> Distribusi & Logistik
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Total Pengiriman</h4>
                <p className="text-2xl font-bold text-stone-900 dark:text-white">{activeDeliveries.length}</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Sedang Berjalan</h4>
                <p className="text-2xl font-bold text-orange-500">{activeCount}</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm">
                <h4 className="text-sm font-bold text-stone-500 uppercase">Butuh Relawan</h4>
                <p className="text-2xl font-bold text-red-500">{pendingCount}</p>
            </div>
        </div>

        <div className="space-y-4">
            {activeDeliveries.length === 0 ? (
                <div className="text-center py-12 text-stone-500">Belum ada aktivitas distribusi.</div>
            ) : (
                activeDeliveries.map(task => (
                    <div key={task.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-500">{task.id}</span>
                                {task.priority === 'urgent' && <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">URGENT</span>}
                                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <div>
                                    <p className="text-xs text-stone-500">Dari</p>
                                    <p className="font-bold text-sm text-stone-800 dark:text-stone-200">{task.from}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-stone-400" />
                                <div>
                                    <p className="text-xs text-stone-500">Ke</p>
                                    <p className="font-bold text-sm text-stone-800 dark:text-stone-200">{task.to}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium mb-2 text-stone-800 dark:text-stone-300">{task.volunteer !== 'Belum Ditugaskan' ? task.volunteer : <span className="text-red-500 italic">Belum ada relawan</span>}</p>
                            {task.status === 'pending' ? (
                                <Button className="h-9 text-xs" onClick={() => setShowAssignVolunteerModal(task.id)}>Tugaskan</Button>
                            ) : (
                                <Button variant="outline" className="h-9 text-xs" onClick={() => setShowTrackingModal(task)}>Lacak</Button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>

        {showAssignVolunteerModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl w-full max-w-sm border border-stone-200 dark:border-stone-800">
                    <h3 className="font-bold text-lg mb-4 text-stone-900 dark:text-white">Pilih Relawan</h3>
                    <div className="space-y-2">
                        <button onClick={() => handleAssignVolunteer(showAssignVolunteerModal, 'Budi Santoso')} className="w-full p-3 text-left hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300">Budi Santoso (0.5km)</button>
                        <button onClick={() => handleAssignVolunteer(showAssignVolunteerModal, 'Siti Aminah')} className="w-full p-3 text-left hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300">Siti Aminah (1.2km)</button>
                    </div>
                    <Button variant="ghost" className="mt-4" onClick={() => setShowAssignVolunteerModal(null)}>Batal</Button>
                </div>
            </div>
        )}

        {showTrackingModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden">
                    <button 
                        onClick={() => setShowTrackingModal(null)}
                        className="absolute top-4 right-4 z-10 bg-white/50 dark:bg-black/50 p-2 rounded-full backdrop-blur-md text-stone-600 dark:text-stone-300 hover:text-red-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    
                    <div className="h-64 bg-stone-200 relative group">
                        {/* Fake Map */}
                        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Map_placeholder.png')] bg-cover bg-center opacity-50"></div>
                        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                             <div className="bg-orange-500 text-white p-2 rounded-full border-4 border-white shadow-xl">
                                <Truck className="w-6 h-6" />
                             </div>
                             <div className="bg-white px-2 py-1 rounded text-[10px] font-bold shadow mt-1">
                                {showTrackingModal.volunteer}
                             </div>
                        </div>
                        <div className="absolute top-1/4 right-1/4">
                             <MapPin className="w-8 h-8 text-green-600 drop-shadow-lg" fill="currentColor" />
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-xl text-stone-900 dark:text-white">Pelacakan Langsung</h3>
                                <p className="text-sm text-stone-500">ID Pengiriman: <span className="font-mono">{showTrackingModal.id}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-stone-900 dark:text-white">5 min</p>
                                <p className="text-xs text-stone-500 uppercase">Estimasi Tiba</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-800 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
                             <div className="flex-1">
                                 <p className="text-xs text-stone-400 font-bold uppercase mb-1">Status Terkini</p>
                                 <p className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {showTrackingModal.status === 'completed' ? 'Pengantaran Selesai' : 'Relawan sedang menuju lokasi'}
                                 </p>
                             </div>
                             <Button className="w-auto h-10 px-4">
                                <Navigation className="w-4 h-4 mr-2" /> Detail Rute
                             </Button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
