
import React, { useState, useEffect } from 'react';
import { UserRole, ClaimHistoryItem, SavedItem, Address, FoodItem } from '../../types';
import { User, MapPin, Shield, HelpCircle, Moon, Sun, LogOut, ChevronRight, ArrowLeft, Heart, Store } from 'lucide-react';
import { Button } from '../components/Button';
import { ProfileHeader } from './components/ProfileHeader';
import { EditProfile } from './components/EditProfile';
import { AddressList } from './components/AddressList';
import { SecuritySettings } from './components/SecuritySettings';
import { FaqSection } from './components/FaqSection';
import { SavedItems } from './components/SavedItems';
import { ClaimHistory } from './components/ClaimHistory';
import { FoodDetail } from '../receiver/components/FoodDetail';
import { ClaimHistoryDetail } from './components/ClaimHistoryDetail';

interface ProfileIndexProps {
  role: UserRole;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  initialView?: 'main' | 'history';
  savedItems: SavedItem[];
  setSavedItems: React.Dispatch<React.SetStateAction<SavedItem[]>>;
  claimHistory: ClaimHistoryItem[];
  setClaimHistory: React.Dispatch<React.SetStateAction<ClaimHistoryItem[]>>;
  availableFoodForDetail: FoodItem[]; 
}

type ProfileView = 'main' | 'edit' | 'address' | 'security' | 'faq' | 'saved' | 'history';

export const ProfileIndex: React.FC<ProfileIndexProps> = ({ 
  role, onLogout, isDarkMode, toggleTheme, initialView = 'main',
  savedItems, setSavedItems, claimHistory, setClaimHistory, availableFoodForDetail
}) => {
  const [currentView, setCurrentView] = useState<ProfileView>(initialView);
  const [selectedSavedItem, setSelectedSavedItem] = useState<FoodItem | null>(null);
  const [selectedClaimDetail, setSelectedClaimDetail] = useState<ClaimHistoryItem | null>(null);
  
  const [userData, setUserData] = useState({
    name: role === 'provider' ? "Restoran Berkah" : role === 'volunteer' ? "Budi Santoso" : "Ibu Siti Aminah",
    email: "user@foodairescue.com",
    phone: "812-3456-7890",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`
  });
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Rumah', fullAddress: 'Jl. Asia Afrika No. 1, Bandung', receiverName: 'Siti Aminah', phone: '081234567890', isPrimary: true }
  ]);

  useEffect(() => { setCurrentView(initialView) }, [initialView]);

  const renderHeader = (title: string, action?: React.ReactNode) => (
    <div className="flex items-center justify-between mb-6 px-6 pt-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('main')} className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
          <ArrowLeft className="w-5 h-5 dark:text-white" />
        </button>
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  );

  const handleViewSavedDetail = (savedItem: SavedItem) => {
        const found = availableFoodForDetail.find(f => f.id === savedItem.id);
        if (found) setSelectedSavedItem(found);
        else {
          alert("Data makanan tidak lagi tersedia.");
          setSavedItems(prev => prev.filter(s => s.id !== savedItem.id));
        }
  };

  const MenuButton = ({ icon: Icon, label, onClick, last }: any) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${!last ? 'border-b border-stone-100 dark:border-stone-800' : ''}`}>
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-stone-500 dark:text-stone-400"><Icon className="w-4 h-4 text-orange-500 dark:text-stone-400" /></div>
            <span className="text-stone-900 dark:text-stone-200 text-sm font-medium">{label}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-stone-400" />
    </button>
  );

  // View: Full Detail Page for Saved Items
  if (selectedSavedItem) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">
            <FoodDetail 
                item={selectedSavedItem}
                onBack={() => setSelectedSavedItem(null)}
                isSaved={savedItems.some(s => s.id === selectedSavedItem.id)}
                onToggleSave={() => setSavedItems(prev => prev.filter(s => s.id !== selectedSavedItem.id))}
                onClaim={() => {
                  alert("Fitur klaim dari bookmark memerlukan redirect ke Home.");
                  setSelectedSavedItem(null);
                }}
            />
        </div>
      );
  }

  // View: Full Detail Page for Claim History (Halaman Baru sesuai instruksi)
  if (selectedClaimDetail) {
      return (
          <ClaimHistoryDetail 
            item={selectedClaimDetail} 
            onBack={() => setSelectedClaimDetail(null)} 
          />
      );
  }

  if (currentView === 'edit') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Edit Profil")}<EditProfile userData={userData} onSave={(data) => {setUserData(data); setCurrentView('main');}} /></div>;
  if (currentView === 'address') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Alamat Tersimpan")}<AddressList addresses={addresses} onAddAddress={(addr) => setAddresses([...addresses, addr])} /></div>;
  if (currentView === 'security') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Keamanan")}<SecuritySettings /></div>;
  if (currentView === 'faq') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Bantuan")}<FaqSection /></div>;
  if (currentView === 'saved') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Disimpan")}<SavedItems items={savedItems} onDelete={(ids) => setSavedItems(prev => prev.filter(i => !ids.has(i.id)))} onDetail={handleViewSavedDetail} /></div>;
  if (currentView === 'history') return <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950">{renderHeader("Riwayat Klaim")}<ClaimHistory history={claimHistory} onSelectItem={setSelectedClaimDetail} /></div>;

  return (
    <div className="pb-24 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen transition-colors duration-300">
        <ProfileHeader 
            userData={userData} 
            role={role} 
            bannerImage={bannerImage} 
            onEditBanner={() => { 
                const url = prompt("Masukkan URL Gambar Banner:");
                if(url) setBannerImage(url); 
            }}
            onEditAvatar={(e) => {
                if(e.target.files?.[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => setUserData({...userData, avatar: reader.result as string});
                    reader.readAsDataURL(e.target.files[0]);
                }
            }}
        />

        <div className="mt-8 px-4 space-y-3 max-w-lg mx-auto">
            {role === 'receiver' && (
                <>
                    <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2 ml-2">Aktivitas</h3>
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
                        <MenuButton icon={Store} label="Riwayat Klaim" onClick={() => setCurrentView('history')} />
                        <MenuButton icon={Heart} label="Makanan Tersimpan" onClick={() => setCurrentView('saved')} last />
                    </div>
                </>
            )}
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2 mt-6 ml-2">Akun</h3>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
                <MenuButton icon={User} label="Edit Profil" onClick={() => setCurrentView('edit')} />
                <MenuButton icon={MapPin} label="Alamat Tersimpan" onClick={() => setCurrentView('address')} />
                <MenuButton icon={Shield} label="Keamanan & Privasi" onClick={() => setCurrentView('security')} />
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-950 flex items-center justify-center text-stone-500 dark:text-stone-400">{isDarkMode ? <Moon className="w-4 h-4 text-orange-400" /> : <Sun className="w-4 h-4 text-orange-500" />}</div>
                        <span className="text-stone-900 dark:text-stone-200 text-sm font-medium">Tema Aplikasi</span>
                    </div>
                    <span className="text-xs text-stone-500 mr-2">{isDarkMode ? 'Gelap' : 'Terang'}</span>
                </button>
                <MenuButton icon={HelpCircle} label="Bantuan & FAQ" onClick={() => setCurrentView('faq')} last />
            </div>
            
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden p-2 shadow-sm mt-6">
                <Button variant="danger" onClick={onLogout} className="flex items-center justify-center gap-2"><LogOut className="w-4 h-4" /> Keluar Akun</Button>
            </div>
        </div>
        <div className="mt-8 text-center text-xs text-stone-500 pb-8">Food AI Rescue v1.3.0</div>
    </div>
  );
};
