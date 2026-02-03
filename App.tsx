
import React, { useState } from 'react';
import { AuthProvider } from './AuthContext';
import { LoginView } from './view/auth/Login';
import { RegisterView } from './view/auth/Register';
import { ForgotPasswordView } from './view/auth/ForgotPassword';
import { ProviderIndex } from './view/provider/index';
import { ReceiverIndex } from './view/receiver/index';
import { VolunteerIndex } from './view/volunteer/index';
import { AdminIndex } from './view/admin/index';
import { ProfileIndex } from './view/profile/index';
import { NotificationsPage } from './view/common/Notifications';
import { UserRole, FoodItem, SavedItem, ClaimHistoryItem } from './types';
import { LogOut, Home, User, Bell, Truck } from 'lucide-react';

const AppContent: React.FC = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot-password'>('login');
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'notifications'>('dashboard');
  const [initialProfileView, setInitialProfileView] = useState<'main' | 'history'>('main');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSubNavOpen, setIsSubNavOpen] = useState(true);

  // --- Receiver Centralized State (CRUD) ---
  const [availableFood, setAvailableFood] = useState<FoodItem[]>([
    {
      id: 'f1', name: 'Roti Manis Assorted', description: 'Sisa produksi hari ini, masih sangat layak. Berbagai rasa coklat dan keju.', quantity: '10 Pcs', expiryTime: '21:00',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop', providerName: 'Bakery Lestari',
      location: { lat: -6.914744, lng: 107.609810, address: 'Jl. Lengkong Besar No. 45' }, status: 'available', deliveryMethod: 'pickup',
      aiVerification: { isEdible: true, reason: 'Tekstur lembut, kemasan utuh.', halalScore: 98, ingredients: ['Tepung', 'Telur', 'Gula'] }
    },
    {
      id: 'f2', name: 'Nasi Box Ayam Bakar', description: 'Kelebihan pesanan catering rapat. Ayam bakar madu dengan lalapan.', quantity: '5 Box', expiryTime: '19:00',
      imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=2080&auto=format&fit=crop', providerName: 'Catering Bu Hajjah',
      location: { lat: -6.92, lng: 107.61, address: 'Jl. Burangrang No. 10' }, status: 'available', deliveryMethod: 'delivery',
      aiVerification: { isEdible: true, reason: 'Baru dimasak 2 jam lalu.', halalScore: 100, ingredients: ['Ayam', 'Nasi', 'Kecap'] }
    }
  ]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [claimHistory, setClaimHistory] = useState<ClaimHistoryItem[]>([]);

  const toggleSaveFood = (item: FoodItem) => {
    setSavedItems(prev => {
      const isAlreadySaved = prev.some(s => s.id === item.id);
      if (isAlreadySaved) return prev.filter(s => s.id !== item.id);
      return [...prev, { id: item.id, name: item.name, provider: item.providerName, image: item.imageUrl, status: 'available' }];
    });
  };

  const handleClaimFood = (item: FoodItem, quantity: string) => {
    const historyEntry: ClaimHistoryItem = {
      id: `cl-${Date.now()}`,
      foodName: item.name,
      providerName: item.providerName,
      date: 'Baru Saja',
      status: 'active',
      imageUrl: item.imageUrl,
      uniqueCode: `FAR-${Math.floor(1000 + Math.random() * 9000)}`,
      claimedQuantity: quantity,
      deliveryMethod: item.deliveryMethod,
      location: item.location,
      distributionHours: { start: '18:30', end: '21:00' },
      description: item.description
    };
    setClaimHistory(prev => [historyEntry, ...prev]);
    setAvailableFood(prev => prev.filter(f => f.id !== item.id));
    setSavedItems(prev => prev.filter(s => s.id !== item.id));
    handleNavigateToHistory();
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleOpenNotifications = () => setCurrentView('notifications');

  const handleNavigateToHistory = () => {
    setInitialProfileView('history');
    setCurrentView('profile');
  };

  const renderContent = () => {
    if (role === 'super_admin' || role === 'admin_manager') {
       return <AdminIndex role={role} onLogout={() => setRole(null)} />;
    }

    if (currentView === 'notifications') {
        return <NotificationsPage role={role} onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'profile' && role) {
      return (
        <ProfileIndex 
          role={role} 
          onLogout={() => setRole(null)} 
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          initialView={initialProfileView}
          savedItems={savedItems}
          setSavedItems={setSavedItems}
          claimHistory={claimHistory}
          setClaimHistory={setClaimHistory}
          availableFoodForDetail={availableFood}
        />
      );
    }

    switch (role) {
      case 'provider': 
        return <ProviderIndex 
                  onOpenNotifications={handleOpenNotifications} 
                  isSubNavOpen={isSubNavOpen}
                  onToggleSubNav={() => setIsSubNavOpen(!isSubNavOpen)}
               />;
      case 'receiver': 
        return <ReceiverIndex 
                  onOpenNotifications={handleOpenNotifications} 
                  onNavigateToHistory={handleNavigateToHistory} 
                  foodItems={availableFood}
                  savedItems={savedItems}
                  onToggleSave={toggleSaveFood}
                  onClaim={handleClaimFood}
               />;
      case 'volunteer': 
        return <VolunteerIndex 
                  onOpenNotifications={handleOpenNotifications}
                  isSubNavOpen={isSubNavOpen}
                  onToggleSubNav={() => setIsSubNavOpen(!isSubNavOpen)}
               />;
      default: return null;
    }
  };

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setCurrentView('dashboard');
    setInitialProfileView('main');
    setIsSubNavOpen(true); 
  };

  const handleNavClick = (view: 'dashboard' | 'profile') => {
    if (view === 'dashboard') {
      if (currentView === 'dashboard') setIsSubNavOpen(!isSubNavOpen);
      else { setCurrentView('dashboard'); setIsSubNavOpen(true); }
    } else {
      if (view === 'profile') setInitialProfileView('main');
      setCurrentView(view);
    }
  }

  if (!role) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
         {authView === 'login' && (
            <LoginView onLogin={handleLogin} onNavigate={setAuthView} />
         )}
         {authView === 'register' && (
            <RegisterView onNavigate={setAuthView} onRegister={(selectedRole) => handleLogin(selectedRole)} />
         )}
         {authView === 'forgot-password' && (
            <ForgotPasswordView onNavigate={setAuthView} />
         )}
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen w-full bg-[#FDFBF7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300">
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 z-40 flex items-center justify-between px-4 md:px-8 shadow-sm">
             <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavClick('dashboard')}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                   <Truck className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-white">Food AI Rescue</span>
             </div>
             <div className="hidden md:flex items-center gap-4">
                 <button onClick={() => handleNavClick('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'dashboard' ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-500' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'}`}>
                    <Home className="w-4 h-4" /> Beranda
                 </button>
                 <button onClick={() => handleNavClick('profile')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentView === 'profile' ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-500' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'}`}>
                    <User className="w-4 h-4" /> Profil
                 </button>
                 <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 mx-2"></div>
                 <button onClick={handleOpenNotifications} className="relative p-2.5 rounded-full text-stone-500 hover:text-orange-500">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-stone-900"></span>
                 </button>
                 <button onClick={() => setRole(null)} className="flex items-center gap-2 px-5 py-2.5 ml-2 bg-stone-900 dark:bg-stone-800 text-white hover:bg-red-600 rounded-full transition-all text-sm font-bold shadow-md">
                    <LogOut className="w-4 h-4" /> Keluar
                 </button>
             </div>
        </header>

        <main className="pt-20 pb-24 md:pb-12 max-w-5xl mx-auto min-h-screen">
          {renderContent()}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl dark:bg-stone-900/95 border-t border-stone-200 dark:border-stone-800 pb-safe pt-2 px-6 z-50 md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
          <div className="flex justify-around items-center h-16">
              <button onClick={() => handleNavClick('dashboard')} className={`group flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'dashboard' ? 'text-orange-600 dark:text-orange-500' : 'text-stone-400'}`}>
                <div className="relative">
                    <Home className={`w-6 h-6 ${currentView === 'dashboard' ? 'fill-current' : ''}`} />
                    {currentView === 'dashboard' && role !== 'receiver' && (
                        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 transition-opacity ${isSubNavOpen ? 'opacity-100' : 'opacity-0'}`}></div>
                    )}
                </div>
                <span className="text-[10px] font-bold">Beranda</span>
              </button>
              <div className="w-12"></div> 
              <button onClick={handleOpenNotifications} className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white shadow-lg">
                 <Bell className="w-6 h-6" />
              </button>
              <button onClick={() => handleNavClick('profile')} className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === 'profile' ? 'text-orange-600 dark:text-orange-500 scale-105' : 'text-stone-400'}`}>
                <User className={`w-6 h-6 ${currentView === 'profile' ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Profil</span>
              </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
