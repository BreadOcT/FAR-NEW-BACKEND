
import React, { useState } from 'react';
import { Menu, Search, Bell, Shield, LogOut, BarChart2, Users, AlertTriangle, Truck, TrendingUp, Settings, Megaphone, Layout, Crown, X, User, CheckCircle, ArrowLeft } from 'lucide-react';
import { Overview } from './components/Overview';
import { Community } from './components/Community';
import { Moderation } from './components/Moderation';
import { Distribution } from './components/Distribution';
import { Impact } from './components/Impact';
import { Communication } from './components/Communication';
import { ContentCMS } from './components/ContentCMS';
import { SystemConfig } from './components/SystemConfig';
import { AdminList } from './components/AdminList';
import { NotificationsPage } from '../common/Notifications';
import { EditProfile } from '../profile/components/EditProfile';

interface AdminIndexProps {
  role: 'super_admin' | 'admin_manager';
  onLogout: () => void;
}

export const AdminIndex: React.FC<AdminIndexProps> = ({ role, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Interactive Header States
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Admin Profile State
  const [adminData, setAdminData] = useState({
      name: 'Administrator',
      email: 'admin@foodairescue.com',
      phone: '081234567890',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin123'
  });

  const handleSearch = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          alert(`Mencari data sistem dengan kata kunci: "${searchQuery}"`);
          // Implement global search logic here
      }
  };

  const handleSaveProfile = (data: any) => {
      setAdminData(prev => ({ ...prev, ...data }));
      alert('Profil admin berhasil diperbarui!');
      setActiveTab('overview');
  };

  const SidebarItem = ({ icon: Icon, label, id }: any) => (
      <button 
        onClick={() => setActiveTab(id)} 
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
    <div className="flex h-screen bg-[#F8F9FA] dark:bg-stone-950 overflow-hidden font-sans" onClick={() => { setShowNotifications(false); setShowProfileMenu(false); }}>
      <aside className={`fixed top-0 left-0 h-full bg-[#0F0F0F] z-50 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-xl border-r border-stone-800`}>
          <div className="h-20 flex items-center justify-start px-6 border-b border-white/5">
              {isSidebarOpen ? (
                  <h1 className="text-white font-black text-xl tracking-tight">ADMIN <span className="text-orange-500">PANEL</span></h1> 
              ) : (
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">A</div>
              )}
          </div>
          
          <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
              <p className={`text-[10px] font-bold text-stone-500 uppercase px-4 mb-2 ${!isSidebarOpen && 'text-center'}`}>{isSidebarOpen ? 'Main Menu' : 'Main'}</p>
              <SidebarItem icon={BarChart2} label="Dashboard" id="overview" />
              <SidebarItem icon={Users} label="Komunitas" id="community" />
              <SidebarItem icon={AlertTriangle} label="Moderasi" id="moderation" />
              <SidebarItem icon={Truck} label="Distribusi" id="distribution" />
              <SidebarItem icon={TrendingUp} label="Dampak" id="impact" />
              
              <div className="h-4"></div>
              <p className={`text-[10px] font-bold text-stone-500 uppercase px-4 mb-2 ${!isSidebarOpen && 'text-center'}`}>{isSidebarOpen ? 'Management' : 'Mng'}</p>
              <SidebarItem icon={Megaphone} label="Komunikasi" id="communication" />
              <SidebarItem icon={Layout} label="Konten CMS" id="content" />
              
              {role === 'super_admin' && (
                <>
                  <div className="h-4"></div>
                  <p className={`text-[10px] font-bold text-stone-500 uppercase px-4 mb-2 ${!isSidebarOpen && 'text-center'}`}>{isSidebarOpen ? 'System' : 'Sys'}</p>
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

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col h-full`}>
          <header className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
              <div className="flex items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(!isSidebarOpen); }} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-500">
                      <Menu className="w-5 h-5" />
                  </button>
              </div>
              
              <div className="flex items-center gap-6">
                  {/* Search Bar */}
                  <div className="relative hidden md:block">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input 
                        type="text" 
                        placeholder="Search system..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        onClick={(e) => e.stopPropagation()}
                        className="pl-10 pr-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all border border-transparent focus:border-orange-500 text-stone-900 dark:text-white" 
                      />
                  </div>
                  
                  {/* Notifications */}
                  <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                        className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-orange-50 text-orange-500' : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500'}`}
                      >
                          <Bell className="w-5 h-5" />
                          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-stone-900 animate-pulse"></span>
                      </button>

                      {showNotifications && (
                          <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-3 w-80 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                              <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                                  <h4 className="font-bold text-sm text-stone-900 dark:text-white">Notifikasi Admin</h4>
                                  <button onClick={() => setShowNotifications(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white"><X className="w-4 h-4"/></button>
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                  {[
                                      { title: "Laporan Urgent Masuk", desc: "User A melaporkan makanan basi.", time: "2m lalu", icon: AlertTriangle, color: "text-red-500 bg-red-50" },
                                      { title: "Verifikasi Provider", desc: "5 akun resto baru menunggu approval.", time: "1j lalu", icon: CheckCircle, color: "text-green-500 bg-green-50" },
                                      { title: "Server Load High", desc: "Traffic meningkat 80% di area Bandung.", time: "3j lalu", icon: Settings, color: "text-blue-500 bg-blue-50" },
                                  ].map((notif, idx) => (
                                      <div key={idx} className="p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 border-b border-stone-100 dark:border-stone-800 cursor-pointer flex gap-3 items-start transition-colors">
                                          <div className={`p-2 rounded-full shrink-0 ${notif.color}`}>
                                              <notif.icon className="w-4 h-4" />
                                          </div>
                                          <div>
                                              <p className="text-sm font-bold text-stone-900 dark:text-white leading-tight">{notif.title}</p>
                                              <p className="text-xs text-stone-500 mt-0.5 mb-1 line-clamp-1">{notif.desc}</p>
                                              <p className="text-[10px] text-stone-400">{notif.time}</p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              <button onClick={() => { setActiveTab('notifications'); setShowNotifications(false); }} className="w-full p-3 text-xs font-bold text-center text-orange-600 bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors">Lihat Semua Notifikasi</button>
                          </div>
                      )}
                  </div>
                  
                  {/* Profile Menu */}
                  <div className="relative">
                      <div 
                        onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:shadow-lg transition-all border-2 border-white dark:border-stone-800 select-none overflow-hidden"
                      >
                          {adminData.avatar ? (
                              <img src={adminData.avatar} alt="Admin" className="w-full h-full object-cover" />
                          ) : (
                              adminData.name.charAt(0)
                          )}
                      </div>

                      {showProfileMenu && (
                          <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                              <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold overflow-hidden">
                                          {adminData.avatar ? <img src={adminData.avatar} className="w-full h-full object-cover" /> : "A"}
                                      </div>
                                      <div>
                                          <p className="font-bold text-sm text-stone-900 dark:text-white">{adminData.name}</p>
                                          <p className="text-xs text-stone-500 capitalize">{role.replace('_', ' ')}</p>
                                      </div>
                                  </div>
                              </div>
                              <div className="p-1">
                                  <button onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center gap-2 transition-colors">
                                      <User className="w-4 h-4" /> Edit Profil
                                  </button>
                                  <button onClick={() => { setActiveTab('system'); setShowProfileMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg flex items-center gap-2 transition-colors">
                                      <Settings className="w-4 h-4" /> Pengaturan Sistem
                                  </button>
                              </div>
                              <div className="p-1 border-t border-stone-100 dark:border-stone-800">
                                  <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2 transition-colors">
                                      <LogOut className="w-4 h-4" /> Keluar Akun
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F8F9FA] dark:bg-stone-950">
              {activeTab === 'notifications' && <NotificationsPage role={role} onBack={() => setActiveTab('overview')} />}
              {activeTab === 'profile' && (
                  <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-4 mb-6">
                          <button onClick={() => setActiveTab('overview')} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-stone-600 dark:text-stone-300" /></button>
                          <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Edit Profil Admin</h2>
                      </div>
                      <EditProfile userData={adminData} onSave={handleSaveProfile} />
                  </div>
              )}
              
              {activeTab === 'overview' && <Overview onNavigate={setActiveTab} />}
              {activeTab === 'community' && <Community />}
              {activeTab === 'moderation' && <Moderation />}
              {activeTab === 'distribution' && <Distribution />}
              {activeTab === 'impact' && <Impact />}
              {activeTab === 'communication' && <Communication />}
              {activeTab === 'content' && <ContentCMS />}
              {activeTab === 'admins' && (role === 'super_admin' ? <AdminList /> : <div className="text-center py-20 text-stone-500">Access Denied</div>)}
              {activeTab === 'system' && (role === 'super_admin' ? <SystemConfig /> : <div className="text-center py-20 text-stone-500">Access Denied</div>)}
          </div>
      </main>
    </div>
  );
};
