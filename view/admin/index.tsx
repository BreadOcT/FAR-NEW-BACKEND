
import React, { useState } from 'react';
import { Menu, Search, Bell, Shield, LogOut, BarChart2, Users, AlertTriangle, Truck, TrendingUp, Settings, Megaphone, Layout, Crown, X, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { Overview } from './components/Overview';
import { Community } from './components/community'; // Updated import path
import { Moderation } from './components/Moderation';
import { Distribution } from './components/Distribution';
import { Impact } from './components/Impact';
import { Communication } from './components/communication';
import { ContentCMS } from './components/ContentCMS';
import { SystemConfig } from './components/SystemConfig';
import { AdminList } from './components/AdminList';
import { NotificationsPage } from '../common/Notifications';
import { EditProfile } from '../profile/components/EditProfile';
import { BroadcastMessage, UserData, FoodItem, ClaimHistoryItem, FAQItem } from '../../types';

interface AdminIndexProps {
  role: 'super_admin' | 'admin_manager';
  onLogout: () => void;
  onSendBroadcast?: (message: BroadcastMessage) => void;
  // Global Data Props
  globalUsers?: UserData[];
  setGlobalUsers?: React.Dispatch<React.SetStateAction<UserData[]>>;
  globalInventory?: FoodItem[];
  globalClaims?: ClaimHistoryItem[];
  globalFAQs?: FAQItem[];
  setGlobalFAQs?: React.Dispatch<React.SetStateAction<FAQItem[]>>;
}

export const AdminIndex: React.FC<AdminIndexProps> = ({ 
    role, 
    onLogout, 
    onSendBroadcast,
    globalUsers = [],
    setGlobalUsers,
    globalInventory = [],
    globalClaims = [],
    globalFAQs = [],
    setGlobalFAQs
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Admin Profile State
  const [adminData, setAdminData] = useState({
      name: 'Administrator',
      email: 'admin@foodairescue.com',
      phone: '081234567890',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin123'
  });

  const handleSaveProfile = (data: any) => {
      setAdminData(prev => ({ ...prev, ...data }));
      alert('Profil admin berhasil diperbarui!');
      setActiveTab('overview');
  };

  const SidebarItem = ({ icon: Icon, label, id }: any) => (
      <button 
        onClick={() => {
            setActiveTab(id);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
        }} 
        className={`relative w-full flex items-center gap-3 p-3 my-1 transition-all duration-300 group ${activeTab === id ? 'text-white' : 'text-stone-400 hover:text-white'}`}
      >
          {activeTab === id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
          )}
          <div className={`p-2 rounded-lg transition-colors ${activeTab === id ? 'bg-orange-500/10' : 'group-hover:bg-white/5'}`}>
             <Icon className={`w-5 h-5 ${activeTab === id ? 'text-orange-500' : 'text-stone-400 group-hover:text-stone-200'}`} />
          </div>
          {isSidebarOpen && <span className={`text-sm font-medium ${activeTab === id ? 'font-bold' : ''}`}>{label}</span>}
      </button>
  );

  return (
    <div className="flex h-screen bg-[#F8F9FA] dark:bg-stone-950 overflow-hidden font-sans">
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-[#0F0F0F] z-50 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'} flex flex-col shadow-2xl border-r border-stone-800`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
              {(isSidebarOpen || window.innerWidth < 1024) ? (
                  <h1 className="text-white font-black text-xl tracking-tight">ADMIN <span className="text-orange-500">PANEL</span></h1> 
              ) : (
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white mx-auto">A</div>
              )}
              <button className="lg:hidden p-1 text-stone-500" onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
              <p className={`text-[10px] font-bold text-stone-500 uppercase px-4 mb-2 ${(!isSidebarOpen && window.innerWidth >= 1024) && 'text-center'}`}>{isSidebarOpen ? 'Main Menu' : 'Main'}</p>
              <SidebarItem icon={BarChart2} label="Dashboard" id="overview" />
              <SidebarItem icon={Users} label="Komunitas" id="community" />
              <SidebarItem icon={AlertTriangle} label="Moderasi" id="moderation" />
              <SidebarItem icon={Truck} label="Distribusi" id="distribution" />
              <SidebarItem icon={TrendingUp} label="Dampak" id="impact" />
              
              <div className="h-4"></div>
              <p className={`text-[10px] font-bold text-stone-500 uppercase px-4 mb-2 ${(!isSidebarOpen && window.innerWidth >= 1024) && 'text-center'}`}>{isSidebarOpen ? 'Management' : 'Mng'}</p>
              <SidebarItem icon={Megaphone} label="Komunikasi" id="communication" />
              <SidebarItem icon={Layout} label="Konten CMS" id="content" />
              
              {role === 'super_admin' && (
                <>
                  <div className="h-4"></div>
                  <p className={`text-[10px] font-bold text-stone-500 uppercase px-4 mb-2 ${(!isSidebarOpen && window.innerWidth >= 1024) && 'text-center'}`}>{isSidebarOpen ? 'System' : 'Sys'}</p>
                  <SidebarItem icon={Crown} label="Admin List" id="admins" />
                  <SidebarItem icon={Settings} label="System" id="system" />
                </>
              )}
          </div>
          
          <div className="p-4 border-t border-white/5">
              <button onClick={onLogout} className="flex items-center gap-3 text-stone-400 hover:text-red-400 w-full p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <LogOut className="w-5 h-5" /> {isSidebarOpen && <span className="font-medium text-sm">Keluar</span>}
              </button>
          </div>
      </aside>

      {/* Main Container */}
      <main className={`flex-1 transition-all duration-300 flex flex-col h-full lg:ml-0 ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
          
          {/* Admin Header */}
          <header className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center gap-4">
                  <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-300">
                      <Menu className="w-6 h-6" />
                  </button>
                  <h2 className="hidden md:block font-bold text-stone-800 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h2>
              </div>
              
              <div className="flex items-center gap-4">
                  <div className="relative hidden sm:block">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input 
                        type="text" 
                        placeholder="Search data..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-xs w-48 lg:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all border-none text-stone-900 dark:text-white" 
                      />
                  </div>
                  
                  <button onClick={() => setActiveTab('notifications')} className="relative p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-stone-900 animate-pulse"></span>
                  </button>
                  
                  <div className="relative">
                      <div 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:shadow-lg transition-all border-2 border-white dark:border-stone-800 overflow-hidden"
                      >
                          <img src={adminData.avatar} alt="Admin" className="w-full h-full object-cover" />
                      </div>

                      {showProfileMenu && (
                          <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                              <div className="p-4 bg-stone-50 dark:bg-stone-950 border-b border-stone-100 dark:border-stone-800">
                                  <p className="font-bold text-sm text-stone-900 dark:text-white">{adminData.name}</p>
                                  <p className="text-xs text-stone-500 capitalize">{role.replace('_', ' ')}</p>
                              </div>
                              <div className="p-1">
                                  <button onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg flex items-center gap-2 transition-colors">
                                      <User className="w-4 h-4" /> Edit Profil
                                  </button>
                                  <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2 transition-colors">
                                      <LogOut className="w-4 h-4" /> Keluar
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </header>
          
          {/* Content Area - Filling full screen width */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F8F9FA] dark:bg-stone-950">
              <div className="w-full max-w-[1600px] mx-auto">
                {activeTab === 'notifications' && <NotificationsPage role={role} onBack={() => setActiveTab('overview')} />}
                {activeTab === 'profile' && (
                    <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-4 mb-6">
                            <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-stone-600 dark:text-stone-300" /></button>
                            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Edit Profil Admin</h2>
                        </div>
                        <EditProfile userData={adminData} onSave={handleSaveProfile} />
                    </div>
                )}
                
                {activeTab === 'overview' && (
                    <Overview 
                        onNavigate={setActiveTab} 
                        stats={{
                            usersCount: globalUsers.length,
                            claimsCount: globalClaims.length,
                            inventoryCount: globalInventory.length,
                            reportsCount: globalClaims.filter(c => c.isReported).length
                        }}
                    />
                )}
                
                {/* Pass global users to Community */}
                {activeTab === 'community' && <Community users={globalUsers} setUsers={setGlobalUsers} inventory={globalInventory} claims={globalClaims} />}
                
                {/* Pass claims to Moderation */}
                {activeTab === 'moderation' && <Moderation claims={globalClaims} />}
                
                {/* Pass claims to Distribution */}
                {activeTab === 'distribution' && <Distribution claims={globalClaims} />}
                
                {/* Pass claims to Impact */}
                {activeTab === 'impact' && <Impact claims={globalClaims} />}
                
                {activeTab === 'communication' && <Communication onSendBroadcast={onSendBroadcast} />}
                {activeTab === 'content' && <ContentCMS faqs={globalFAQs} setFaqs={setGlobalFAQs} />}
                {activeTab === 'admins' && (role === 'super_admin' ? <AdminList /> : <div className="text-center py-20 text-stone-500">Access Denied</div>)}
                {activeTab === 'system' && (role === 'super_admin' ? <SystemConfig /> : <div className="text-center py-20 text-stone-500">Access Denied</div>)}
              </div>
          </div>
      </main>
    </div>
  );
};
