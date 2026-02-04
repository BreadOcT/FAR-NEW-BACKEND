
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, FoodItem, ClaimHistoryItem, SavedItem, UserData, FAQItem } from './types';
import { LoginView } from './view/auth/Login';
import { RegisterView } from './view/auth/Register';
import { ForgotPasswordView } from './view/auth/ForgotPassword';
import { ProviderIndex } from './view/provider';
import { ReceiverIndex } from './view/receiver';
import { VolunteerIndex } from './view/volunteer';
import { AdminIndex } from './view/admin';
import { ProfileIndex } from './view/profile';
import { NotificationsPage } from './view/common/Notifications';
import { InventoryManager } from './view/provider/components/Inventory';
import { ReportsView } from './view/provider/components/Reports';
import { ReviewsView } from './view/provider/components/Reviews';
import { Home, User, Box } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('login');
  const [role, setRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
  const [isSubNavOpen, setIsSubNavOpen] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [claimHistory, setClaimHistory] = useState<ClaimHistoryItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  
  // 1. Centralized Global Users Data (Initialized with Dummies for Admin Verification)
  const [globalUsers, setGlobalUsers] = useState<UserData[]>([
      { id: 'u1', name: 'Restoran Berkah', email: 'resto@gmail.com', role: 'Provider', status: 'active', points: 1200, joinDate: '2025-01-10', phone: '628123456789' },
      { id: 'u2', name: 'Budi Santoso', email: 'relawan@gmail.com', role: 'Volunteer', status: 'active', points: 550, joinDate: '2025-01-15', phone: '628129876543' },
      { id: 'u3', name: 'Siti Aminah', email: 'penerima@gmail.com', role: 'Receiver', status: 'active', points: 100, joinDate: '2025-02-01', phone: '628121112223' },
      { id: 'u4', name: 'Warung Tegal Bahari', email: 'warteg@gmail.com', role: 'Provider', status: 'pending', points: 0, joinDate: '2025-02-24', phone: '628123334445', address: 'Jl. Sudirman No. 45' },
      { id: 'u5', name: 'Yayasan Peduli', email: 'yayasan@gmail.com', role: 'Receiver', status: 'pending', points: 0, joinDate: '2025-02-24', phone: '628125556667', address: 'Jl. Ahmad Yani No. 12' }
  ]);

  // 2. Centralized FAQ Data
  const [globalFAQs, setGlobalFAQs] = useState<FAQItem[]>([
      { id: 'f1', question: 'Apa itu Food AI Rescue?', answer: 'Platform penghubung donatur makanan surplus dengan penerima manfaat menggunakan teknologi AI untuk verifikasi kelayakan.', category: 'Umum' },
      { id: 'f2', question: 'Bagaimana cara mendonasikan makanan?', answer: 'Daftar sebagai Donatur, upload foto makanan untuk audit AI, dan tentukan jadwal pengambilan.', category: 'SOP Donatur' },
      { id: 'f3', question: 'Apakah ada biaya?', answer: 'Tidak ada biaya untuk donatur maupun penerima manfaat. Platform ini 100% nirlaba.', category: 'Umum' }
  ]);

  // Mock Data Seeding (Optional: Could be moved to a separate service)
  useEffect(() => {
      // Initialize with empty arrays or load from local storage/API
  }, []);

  // Calculate Profile Stats Dynamically
  const profileStats = useMemo(() => {
    const completedHistory = claimHistory.filter(c => c.status === 'completed');
    const activeHistory = claimHistory.filter(c => c.status === 'active');

    if (role === 'provider') {
        // Provider: Donasi aktif + selesai
        const ratingSum = completedHistory.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        const avgRating = completedHistory.length ? (ratingSum / completedHistory.length).toFixed(1) : '5.0';
        return {
            label1: 'Donasi', value1: foodItems.length + completedHistory.length,
            label2: 'Rating', value2: parseFloat(avgRating),
            label3: 'Poin', value3: (completedHistory.length * 50) + (foodItems.length * 10) + (currentUser?.points || 0)
        };
    } 
    else if (role === 'volunteer') {
        // Volunteer: Misi delivery selesai
        const missions = completedHistory.filter(c => c.deliveryMethod !== 'pickup').length; 
        const basePoints = currentUser?.points || 0;
        return {
            label1: 'Misi', value1: missions,
            label2: 'Jam', value2: Math.floor(missions * 0.8) + 2, // Dummy calculation for hours
            label3: 'Poin', value3: (missions * 150) + basePoints
        };
    } 
    else { 
        // Receiver: Klaim
        const claims = completedHistory.length + activeHistory.length;
        const basePoints = currentUser?.points || 0;
        return {
            label1: 'Klaim', value1: claims,
            label2: 'Disimpan', value2: savedItems.length,
            label3: 'Poin', value3: (claims * 10) + basePoints
        };
    }
  }, [role, claimHistory, foodItems, savedItems, currentUser]);

  const handleLogin = (data: { role: UserRole; email?: string }) => {
      setRole(data.role);
      setCurrentUser({
          id: '1',
          name: data.role === 'provider' ? 'Restoran Berkah' : data.role === 'volunteer' ? 'Budi Santoso' : data.role === 'admin_manager' ? 'Admin Manager' : 'Siti Aminah',
          email: data.email || 'user@foodairescue.com',
          role: data.role || 'receiver',
          status: 'active',
          points: 100,
          joinDate: '2025-01-01',
          phone: '08123456789'
      });
      setCurrentView('dashboard');
  };

  const handleRegister = (formData: any) => {
      // Add logic to add to globalUsers if needed, or just simulate login
      handleLogin({ role: formData.role, email: formData.email });
  };

  const handleLogout = () => {
      setRole(null);
      setCurrentUser(null);
      setCurrentView('login');
  };

  const handleAcceptMission = (claimId: string, volunteerName: string) => {
      setClaimHistory(prev => prev.map(c => 
          c.id === claimId 
            ? { ...c, courierName: volunteerName, courierStatus: 'picking_up' } 
            : c
      ));
  };

  const handleClaimFood = (item: FoodItem, quantity: string) => {
      const newClaim: ClaimHistoryItem = {
          id: `CLM-${Date.now()}`,
          foodName: item.name,
          providerName: item.providerName,
          date: new Date().toLocaleDateString('id-ID'),
          status: 'active',
          imageUrl: item.imageUrl,
          uniqueCode: `CODE-${Math.floor(Math.random() * 10000)}`,
          claimedQuantity: quantity,
          deliveryMethod: item.deliveryMethod,
          location: item.location,
          distributionHours: { start: '18:00', end: '21:00' },
          description: item.description
      };
      setClaimHistory([newClaim, ...claimHistory]);
      
      setFoodItems(prev => prev.map(f => f.id === item.id ? { ...f, currentQuantity: Math.max(0, f.currentQuantity - 1) } : f));
  };

  const renderContent = () => {
      if (currentView === 'login') return <LoginView onLogin={handleLogin} onNavigate={setCurrentView as any} />;
      if (currentView === 'register') return <RegisterView onNavigate={setCurrentView as any} onRegister={handleRegister} />;
      if (currentView === 'forgot-password') return <ForgotPasswordView onNavigate={setCurrentView as any} />;
      
      if (currentView === 'notifications') return <NotificationsPage role={role} onBack={() => setCurrentView('dashboard')} />;
      
      if (currentView === 'profile') return (
          <ProfileIndex 
            role={role!} 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            isDarkMode={false} 
            toggleTheme={() => {}} 
            savedItems={savedItems}
            setSavedItems={setSavedItems}
            claimHistory={claimHistory}
            setClaimHistory={setClaimHistory}
            availableFoodForDetail={foodItems}
            onClaim={handleClaimFood}
            globalFAQs={globalFAQs} // Pass Global FAQs
            stats={profileStats} 
          />
      );

      if (role === 'provider') {
          if (currentView === 'inventory') return <InventoryManager foodItems={foodItems} setFoodItems={setFoodItems} claimHistory={claimHistory} setClaimHistory={setClaimHistory} />;
          if (currentView === 'reports') return <ReportsView />;
          if (currentView === 'reviews') return <ReviewsView />;
          
          return (
            <ProviderIndex 
                onOpenNotifications={() => setCurrentView('notifications')} 
                onNavigate={setCurrentView}
                isSubNavOpen={isSubNavOpen} 
                onToggleSubNav={() => setIsSubNavOpen(!isSubNavOpen)}
                foodItems={foodItems}
                claimHistory={claimHistory}
            />
          );
      }

      if (role === 'receiver') {
          return (
            <ReceiverIndex 
                onOpenNotifications={() => setCurrentView('notifications')} 
                onNavigateToHistory={() => setCurrentView('profile')}
                foodItems={foodItems}
                savedItems={savedItems}
                onToggleSave={(item) => {
                    if (savedItems.some(s => s.id === item.id)) {
                        setSavedItems(savedItems.filter(s => s.id !== item.id));
                    } else {
                        setSavedItems([...savedItems, { id: item.id, name: item.name, provider: item.providerName, image: item.imageUrl, status: 'available' }]);
                    }
                }}
                onClaim={handleClaimFood}
            />
          );
      }

      if (role === 'volunteer') {
          return (
            <VolunteerIndex 
                onOpenNotifications={() => setCurrentView('notifications')} 
                isSubNavOpen={isSubNavOpen} 
                onToggleSubNav={() => setIsSubNavOpen(!isSubNavOpen)}
                activeClaims={claimHistory}
                onAcceptMission={handleAcceptMission}
                currentUser={currentUser}
            />
          );
      }

      if (role === 'admin_manager' || role === 'super_admin') {
          return (
            <AdminIndex 
                role={role} 
                onLogout={handleLogout} 
                globalUsers={globalUsers} // Pass Global Users
                setGlobalUsers={setGlobalUsers} // Pass Setter
                globalInventory={foodItems}
                globalClaims={claimHistory}
                globalFAQs={globalFAQs} // Pass Global FAQs
                setGlobalFAQs={setGlobalFAQs} // Pass Setter
            />
          );
      }

      return <div>Unknown Role</div>;
  };

  const showBottomNav = role && !['login', 'register', 'forgot-password'].includes(currentView) && !role.includes('admin');

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen text-stone-900 dark:text-white font-sans">
      {renderContent()}
      
      {showBottomNav && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex justify-around py-3 z-50">
              <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-orange-600' : 'text-stone-400'}`}>
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Home</span>
              </button>
              
              {role === 'provider' && (
                  <button onClick={() => setCurrentView('inventory')} className={`flex flex-col items-center gap-1 ${currentView === 'inventory' ? 'text-orange-600' : 'text-stone-400'}`}>
                      <Box className="w-5 h-5" />
                      <span className="text-[10px] font-bold">Stok</span>
                  </button>
              )}

              <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center gap-1 ${currentView === 'profile' ? 'text-orange-600' : 'text-stone-400'}`}>
                  <User className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Profil</span>
              </button>
          </div>
      )}
    </div>
  );
};

export default App;
