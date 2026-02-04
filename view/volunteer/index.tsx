
import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, History, Trophy, Bell, ChevronDown, BarChart3, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { StatsDashboard } from './components/StatsDashboard';
import { MissionList } from './components/MissionList';
import { Leaderboard } from './components/Leaderboard';
import { HistoryList } from './components/HistoryList';
import { MissionDetail } from './components/MissionDetail';
import { VolunteerTask, RankLevel, DailyQuest, LeaderboardItem, ClaimHistoryItem, UserData } from '../../types';
import { SOCIAL_SYSTEM } from '../../constants';

interface VolunteerIndexProps {
  onOpenNotifications: () => void;
  isSubNavOpen: boolean;
  onToggleSubNav: () => void;
  // New props for global data connection
  activeClaims?: ClaimHistoryItem[];
  onAcceptMission?: (claimId: string, volunteerName: string) => void;
  currentUser?: UserData | null;
}

export const VolunteerIndex: React.FC<VolunteerIndexProps> = ({ 
    onOpenNotifications, 
    isSubNavOpen, 
    onToggleSubNav,
    activeClaims = [],
    onAcceptMission,
    currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'rank_stats' | 'history'>('available');
  const [showScanner, setShowScanner] = useState(false);
  const [scanningForTaskId, setScanningForTaskId] = useState<string | number | null>(null);
  const [selectedTask, setSelectedTask] = useState<VolunteerTask | null>(null);

  const userName = currentUser?.name || 'Budi Santoso';

  // --- MAP GLOBAL CLAIMS TO TASKS ---
  const globalTasks: VolunteerTask[] = useMemo(() => {
      return activeClaims
        .filter(claim => claim.deliveryMethod !== 'pickup') // Hanya delivery
        .map((claim): VolunteerTask | null => {
            const isAssignedToMe = claim.courierName === userName; 
            const isUnassigned = !claim.courierName;
            
            // Tentukan status tugas berdasarkan status klaim
            let taskStatus: 'available' | 'active' | 'history' = 'available';
            if (claim.status === 'completed' && isAssignedToMe) taskStatus = 'history';
            else if (claim.status !== 'completed' && isAssignedToMe) taskStatus = 'active';
            else if (!isUnassigned) return null; // Assigned to others, hide it

            // Filter out nulls later
            if (taskStatus === 'available' && !isUnassigned) return null;

            return {
                id: claim.id,
                claimId: claim.id,
                from: claim.providerName,
                to: 'Penerima Manfaat', // Nama penerima tidak diexpose di list awal untuk privasi
                distance: 2.5, // Dummy distance calculator
                distanceStr: '2.5 km',
                items: `${claim.foodName} (${claim.claimedQuantity || '1 Porsi'})`,
                status: taskStatus,
                stage: claim.courierStatus === 'picking_up' ? 'pickup' : 'dropoff',
                imageUrl: claim.imageUrl,
                description: claim.description || 'Pengantaran Makanan',
                ingredients: [],
                foodCondition: 100,
                donorLocation: claim.location,
                receiverLocation: { lat: -6.920000, lng: 107.615000, address: 'Lokasi Penerima' }, // Mock receiver loc
                donorOpenHours: '09:00 - 21:00',
                receiverDistanceStr: '2.5 km',
                quantity: claim.claimedQuantity,
                donorPhone: '08123456789',
                receiverPhone: '08198765432',
                points: 150
            };
        })
        .filter((t): t is VolunteerTask => t !== null); // Remove nulls
  }, [activeClaims, userName]);

  // Combine with local history dummy data if needed, or rely on global
  
  const availableTasks = globalTasks.filter(t => t.status === 'available');
  const myActiveTasks = globalTasks.filter(t => t.status === 'active');
  
  // History List: Base points (100) + completed missions
  const historyList = useMemo(() => {
      const baseHistory = [
          { id: 100, date: 'Bergabung', from: 'System', to: '-', items: 'Bonus Pendaftaran', points: 100, distance: 0 }
      ];
      
      const missionHistory = globalTasks
          .filter(t => t.status === 'history')
          .map(t => ({
              id: t.id as any, 
              date: 'Baru Saja', 
              from: t.from, 
              to: t.to, 
              items: t.items, 
              points: t.points || 150, 
              distance: t.distance
          }));

      return [...baseHistory, ...missionHistory];
  }, [globalTasks]);

  // 2. Kalkulasi Stats Secara Real-time (Dynamic)
  const stats = useMemo(() => {
      const totalPoints = historyList.reduce((acc, curr) => acc + curr.points, 0);
      const missionsCompleted = historyList.filter(h => h.from !== 'System').length;
      const totalDistance = historyList.reduce((acc, curr) => acc + (curr.distance || 0), 0);
      
      const totalMinutes = (missionsCompleted * 30) + (totalDistance * 10);
      const hoursContributed = Math.max(1, Math.floor(totalMinutes / 60));

      const volunteerSystem = SOCIAL_SYSTEM.volunteer;
      const currentRankObj = volunteerSystem.tiers.slice().reverse().find(t => totalPoints >= t.minPoints) || volunteerSystem.tiers[0];
      const nextRankObj = volunteerSystem.tiers.find(t => t.minPoints > totalPoints);
      
      const progressToNext = nextRankObj 
        ? Math.min(((totalPoints - currentRankObj.minPoints) / (nextRankObj.minPoints - currentRankObj.minPoints)) * 100, 100)
        : 100;

      const weeklyActivity = [0, 0, 0, 0, 0, 0, 0];
      // Simple mock distribution for activity chart based on points
      const today = new Date().getDay();
      weeklyActivity[today] = missionsCompleted; 

      return {
        points: totalPoints,
        missionsCompleted,
        totalDistance: parseFloat(totalDistance.toFixed(1)),
        hoursContributed,
        currentRank: currentRankObj.name,
        nextRank: nextRankObj?.name || "Max Level",
        progressToNext,
        weeklyActivity
      };
  }, [historyList]);

  const RANK_SYSTEM: RankLevel[] = SOCIAL_SYSTEM.volunteer.tiers.map(t => ({
      id: parseInt(t.id),
      name: t.name,
      minPoints: t.minPoints,
      description: t.benefits[0] || "Relawan Food AI Rescue",
      icon: t.icon
  }));

  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([
    { id: 1, title: "Login Harian", target: 1, current: 1, reward: 10, completed: true },
    { id: 2, title: "Selesaikan 1 Misi", target: 1, current: historyList.filter(h => h.from !== 'System').length, reward: 100, completed: historyList.filter(h => h.from !== 'System').length >= 1 },
    { id: 3, title: "Antar Jarak > 5km", target: 1, current: 0, reward: 150, completed: false },
  ]);

  const leaderboardData: LeaderboardItem[] = useMemo(() => {
      const baseData = [
          { id: 1, name: 'Siti Aminah', points: 4500, rank: 0, avatar: 'SA' },
          { id: 2, name: userName, points: stats.points, rank: 0, avatar: userName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() }, 
          { id: 3, name: 'Joko Anwar', points: 3200, rank: 0, avatar: 'JA' },
          { id: 4, name: 'Rina Nose', points: 2900, rank: 0, avatar: 'RN' },
          { id: 5, name: 'Dedi Corb', points: 2500, rank: 0, avatar: 'DC' },
      ];
      return baseData.sort((a,b) => b.points - a.points).map((item, idx) => ({...item, rank: idx + 1}));
  }, [stats.points, userName]);

  const handleStartScan = (taskId: string | number) => {
      setScanningForTaskId(taskId);
      setShowScanner(true);
  };

  const handleScanSuccess = () => {
    if (scanningForTaskId === null) return;
    if (navigator.vibrate) navigator.vibrate(200);
    
    // Simulate updating stage logic locally for feedback, 
    // In real app, this would verify QR code with backend
    alert("QR Code Terverifikasi!");
    setShowScanner(false);
    setScanningForTaskId(null);
  };

  const acceptTask = (task: VolunteerTask) => {
      if (onAcceptMission && task.claimId) {
          onAcceptMission(task.claimId, userName);
          alert("Misi diambil! Silakan menuju lokasi penjemputan.");
          setActiveTab('active');
          setSelectedTask(null);
      }
  };

  if (selectedTask) {
      return (
          <MissionDetail 
            task={selectedTask}
            onBack={() => setSelectedTask(null)}
            onAccept={() => acceptTask(selectedTask)}
          />
      );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-32 pt-20"> {/* Added pt-20 to push content below fixed app header */}
       
       {/* Sticky Header fixed to fit nicely under main app header */}
       <div 
         onClick={onToggleSubNav} 
         className="sticky top-16 z-30 bg-[#FDFBF7]/95 dark:bg-stone-950/95 backdrop-blur-md -mx-4 md:-mx-8 px-4 md:px-8 py-3 mb-6 border-b border-stone-200 dark:border-stone-800 transition-all cursor-pointer shadow-sm"
       >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-stone-900 dark:text-white">Misi Relawan</h1>
                <ChevronDown className={`w-4 h-4 text-orange-500 transition-transform ${isSubNavOpen ? 'rotate-180' : ''}`} />
            </div>
            <button onClick={(e) => {e.stopPropagation(); onOpenNotifications();}} className="p-2 bg-white dark:bg-stone-900 rounded-full border shadow-sm hover:bg-stone-50"><Bell className="w-4 h-4" /></button>
          </div>
          
          <div onClick={(e) => e.stopPropagation()} className={`flex gap-2 overflow-x-auto transition-all duration-300 pb-2 scrollbar-hide ${isSubNavOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden py-0 mb-0'}`}>
                {[
                  {id: 'available', label: `Misi (${availableTasks.length})`}, 
                  {id: 'active', label: `Aktif (${myActiveTasks.length})`}, 
                  {id: 'rank_stats', label: 'Pencapaian'}, 
                  {id: 'history', label: 'Riwayat'}, 
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-200'}`}>{tab.label}</button>
                ))}
          </div>
       </div>

       {activeTab === 'rank_stats' && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
             <div className="space-y-4">
                 <div className="flex items-center gap-2 px-1">
                     <div className="p-2 bg-orange-100 rounded-lg">
                        <Trophy className="w-5 h-5 text-orange-600" />
                     </div>
                     <h2 className="text-lg font-black uppercase tracking-tighter text-stone-900 dark:text-white">Papan Peringkat</h2>
                 </div>
                 <Leaderboard data={leaderboardData} />
             </div>

             <div className="space-y-4">
                 <StatsDashboard stats={stats} ranks={RANK_SYSTEM} quests={dailyQuests} />
             </div>
          </div>
       )}

       {(activeTab === 'available' || activeTab === 'active') && (
           <MissionList 
              tasks={activeTab === 'available' ? availableTasks : myActiveTasks} 
              activeTab={activeTab === 'available' ? 'available' : 'active'} 
              onAcceptTask={(id) => { /* Handled inside MissionDetail mostly, or pass logic here */ }} 
              onScanQr={handleStartScan}
              onSelectTask={setSelectedTask}
           />
       )}

       {activeTab === 'history' && <HistoryList history={historyList} />}

       {/* Mobile Floating Nav (Bottom) */}
       <div 
        className={`md:hidden fixed bottom-[64px] left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-40 px-4 transition-all duration-500 ease-in-out transform overflow-hidden ${isSubNavOpen ? 'max-h-20 translate-y-0 h-14' : 'max-h-0 translate-y-full h-0 border-none'}`}
       >
         <div className="grid grid-cols-4 h-full items-center">
            <button onClick={() => setActiveTab('available')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'available' ? 'text-orange-600' : 'text-stone-400'}`}>
               <MapPin className="w-5 h-5" />
               <span className="text-[9px] font-bold uppercase">Misi</span>
            </button>
            <button onClick={() => setActiveTab('active')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'active' ? 'text-orange-600' : 'text-stone-400'}`}>
               <Navigation className="w-5 h-5" />
               <span className="text-[9px] font-bold uppercase">Aktif</span>
            </button>
            <button onClick={() => setActiveTab('rank_stats')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'rank_stats' ? 'text-orange-600' : 'text-stone-400'}`}>
               <Trophy className="w-5 h-5" />
               <span className="text-[9px] font-bold uppercase">Pencapaian</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'history' ? 'text-orange-600' : 'text-stone-400'}`}>
               <History className="w-5 h-5" />
               <span className="text-[9px] font-bold uppercase">Riwayat</span>
            </button>
         </div>
      </div>

       {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
           <div className="w-64 h-64 border-2 border-orange-500 rounded-3xl relative mb-8 overflow-hidden bg-black/50">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-xl z-20"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-xl z-20"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-xl z-20"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-xl z-20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.8)] z-10" style={{animation: 'scan 1.5s infinite linear'}} />
            <div className="absolute inset-0 z-30 cursor-pointer" onClick={handleScanSuccess}></div>
          </div>
          <p className="text-white font-bold text-lg mb-1">Scan QR Code</p>
          <p className="text-stone-400 text-xs mb-6">Arahkan kamera ke QR Code transaksi</p>
          <Button variant="outline" onClick={() => setShowScanner(false)} className="border-white/20 text-white hover:bg-white/10">Batal</Button>
          <style>{`@keyframes scan { 0% { top: 0; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
        </div>
      )}
    </div>
  );
};
