
import React, { useState } from 'react';
import { SOCIAL_SYSTEM } from '../../../../constants';
import { RankCard } from './RankCard';
import { QuickActions } from './QuickActions';
import { StatsGrid } from './StatsGrid';
import { RankDetailsModal } from './RankDetailsModal';

interface DashboardStatsProps {
    setActiveTab: (t: any) => void;
    stats: {
        totalPoints: number;
        co2Saved: number;
        activeStock: number;
        completedOrders: number;
        pendingReports: number;
        avgRating: number;
    };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({setActiveTab, stats}) => {
  const [showRankDetails, setShowRankDetails] = useState(false);
  
  const providerSystem = SOCIAL_SYSTEM.provider;
  const currentPoints = stats.totalPoints;
  
  // Logic to determine current and next rank
  const currentRank = providerSystem.tiers.slice().reverse().find(t => currentPoints >= t.minPoints) || providerSystem.tiers[0];
  const nextRank = providerSystem.tiers.find(t => t.minPoints > currentPoints);
  const progress = nextRank 
    ? Math.min(((currentPoints - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100, 100)
    : 100;

  // Simulasi data grafik berdasarkan total poin saat ini agar terlihat hidup
  const weeklyPoints = Array.from({length: 7}, () => Math.floor(Math.random() * (currentPoints / 10)));
  const weeklyCo2 = weeklyPoints.map(p => parseFloat((p * 0.15).toFixed(1)));

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in">
        
      <RankCard 
        currentRank={currentRank}
        nextRank={nextRank}
        currentPoints={currentPoints}
        progress={progress}
        onShowDetails={() => setShowRankDetails(true)}
      />

      <QuickActions 
        setActiveTab={setActiveTab}
        pendingReports={stats.pendingReports}
        avgRating={stats.avgRating}
      />

      <StatsGrid 
        stats={{ totalPoints: currentPoints, co2Saved: stats.co2Saved }}
        weeklyPoints={weeklyPoints}
        weeklyCo2={weeklyCo2}
        providerSystem={providerSystem}
      />

      {showRankDetails && (
        <RankDetailsModal 
            onClose={() => setShowRankDetails(false)}
            providerSystem={providerSystem}
            currentRank={currentRank}
            currentPoints={currentPoints}
        />
      )}
    </div>
  );
};
