
import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, ArrowLeft, Trash2, Clock, Gift, ShieldAlert } from 'lucide-react';
import { Notification, UserRole } from '../../types';

interface NotificationsPageProps {
  role: UserRole;
  onBack: () => void;
  extraNotifications?: Notification[]; // Prop untuk notifikasi tambahan dari state global (broadcast)
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ role, onBack, extraNotifications = [] }) => {
  
  const getNotificationsByRole = (currentRole: UserRole): Notification[] => {
      const common: Notification[] = [
          {
            id: 'sys-1',
            type: 'info',
            title: 'Update Aplikasi v1.3',
            message: 'Fitur AI Scanner kini lebih cepat! Coba sekarang untuk analisis makanan.',
            date: '1 Hari lalu',
            isRead: true
          }
      ];

      // Filter notifikasi broadcast agar hanya muncul sesuai target role atau 'all'
      const broadcasts = extraNotifications.filter(n => n.targetRole === 'all' || n.targetRole === currentRole);

      let roleBased: Notification[] = [];

      switch(currentRole) {
          case 'provider': // Donatur
              roleBased = [
                  {
                      id: 'p-1',
                      type: 'success',
                      title: 'Donasi Berhasil Diklaim',
                      message: 'Makanan "Nasi Kotak Berkah" telah berhasil diklaim oleh penerima. Siapkan untuk pengambilan.',
                      date: '5 Menit lalu',
                      isRead: false
                  },
                  {
                      id: 'p-2',
                      type: 'warning',
                      title: 'Stok Hampir Kedaluwarsa',
                      message: 'Item "Roti Tawar Jumbo" akan kedaluwarsa dalam 2 jam. Pertimbangkan untuk memprioritaskannya.',
                      date: '30 Menit lalu',
                      isRead: false
                  },
                  {
                      id: 'p-3',
                      type: 'success',
                      title: 'Ulasan Bintang 5!',
                      message: 'Anda mendapatkan ulasan positif dari penerima manfaat. Pertahankan kualitas donasi Anda!',
                      date: '4 Jam lalu',
                      isRead: true
                  }
              ];
              break;
          case 'receiver': // Penerima
              roleBased = [
                  {
                      id: 'r-1',
                      type: 'success',
                      title: 'Klaim Disetujui',
                      message: 'Permintaan klaim "Paket Sayur Segar" disetujui. Silakan ambil sebelum pukul 18:00.',
                      date: '10 Menit lalu',
                      isRead: false
                  },
                  {
                      id: 'r-2',
                      type: 'info',
                      title: 'Makanan Baru di Sekitarmu',
                      message: 'Ada 5 donasi makanan baru dalam radius 2km dari lokasi Anda. Cek sekarang sebelum kehabisan!',
                      date: '1 Jam lalu',
                      isRead: false
                  },
                  {
                      id: 'r-3',
                      type: 'warning',
                      title: 'Pengingat Pengambilan',
                      message: 'Jangan lupa untuk mengambil "Roti Manis" di Bakery Lestari. Batas waktu tinggal 1 jam lagi.',
                      date: '2 Jam lalu',
                      isRead: true
                  }
              ];
              break;
          case 'volunteer': // Relawan
              roleBased = [
                  {
                      id: 'v-1',
                      type: 'info',
                      title: 'Misi Baru Tersedia',
                      message: 'Dibutuhkan relawan pengantar dari "Resto Padang" ke "Panti Asuhan". Jarak 3km. Reward: 150 Poin.',
                      date: 'Baru Saja',
                      isRead: false
                  },
                  {
                      id: 'v-2',
                      type: 'success',
                      title: 'Poin Misi Masuk',
                      message: 'Selamat! Misi pengantaran #TX-998 selesai. +200 Poin telah ditambahkan ke akun Anda.',
                      date: '3 Jam lalu',
                      isRead: true
                  },
                  {
                      id: 'v-3',
                      type: 'warning',
                      title: 'Misi Belum Selesai',
                      message: 'Anda memiliki misi aktif yang belum diselesaikan. Segera selesaikan untuk menghindari pinalti.',
                      date: '5 Jam lalu',
                      isRead: true
                  }
              ];
              break;
          case 'admin_manager':
          case 'super_admin':
              roleBased = [
                  {
                      id: 'a-1',
                      type: 'report',
                      title: 'Laporan Mendesak',
                      message: 'Ada 3 laporan kualitas makanan yang perlu ditinjau segera.',
                      date: '15 Menit lalu',
                      isRead: false,
                      priority: 'high'
                  },
                  {
                      id: 'a-2',
                      type: 'info',
                      title: 'Verifikasi User',
                      message: '5 Akun Provider baru menunggu verifikasi dokumen.',
                      date: '2 Jam lalu',
                      isRead: false
                  },
                  {
                      id: 'a-3',
                      type: 'error',
                      title: 'System Alert',
                      message: 'Deteksi traffic tinggi pada server region Bandung.',
                      date: '1 Hari lalu',
                      isRead: true
                  }
              ];
              break;
          default:
              roleBased = [];
      }

      // Menggabungkan Broadcast -> Role Specific -> Common
      return [...broadcasts, ...roleBased, ...common];
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
      setNotifications(getNotificationsByRole(role));
  }, [role, extraNotifications]); // Re-run effect when role or extraNotifications change

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    if(confirm("Hapus semua notifikasi?")) setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <Clock className="w-5 h-5 text-amber-500" />; // Changed to Clock for deadline vibes
      case 'report': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'error': return <ShieldAlert className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRoleLabel = () => {
      if(role === 'provider') return 'Donatur';
      if(role === 'receiver') return 'Penerima';
      if(role === 'volunteer') return 'Relawan';
      if(role?.includes('admin')) return 'Administrator';
      return 'User';
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen pb-24 animate-in slide-in-from-right">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-900 dark:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">Notifikasi</h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">Halo, {getRoleLabel()}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={markAllRead} className="text-xs font-medium text-orange-500 hover:text-orange-600 bg-orange-50 dark:bg-orange-900/10 px-3 py-1.5 rounded-lg transition-colors">Baca Semua</button>
           <button onClick={clearAll} className="p-2 text-stone-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {notifications.length === 0 && (
            <div className="text-center py-20 text-stone-500 dark:text-stone-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 opacity-30" />
                </div>
                <p>Tidak ada notifikasi saat ini.</p>
            </div>
        )}
        
        {notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-xl border transition-all flex gap-4 relative overflow-hidden group ${
                notif.isRead 
                ? 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800' 
                : 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 shadow-sm'
            }`}
          >
            {/* Highlight bar for unread */}
            {!notif.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
            
            <div className={`mt-1 p-2 rounded-full h-fit ${notif.isRead ? 'bg-stone-100 dark:bg-stone-800' : 'bg-white dark:bg-stone-900 shadow-sm'}`}>
                {getIcon(notif.type)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-bold ${notif.isRead ? 'text-stone-700 dark:text-stone-300' : 'text-stone-900 dark:text-white'}`}>
                      {notif.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap ml-2">{notif.date}</span>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${notif.isRead ? 'text-stone-500 dark:text-stone-500' : 'text-stone-600 dark:text-stone-300'}`}>
                  {notif.message}
              </p>
              
              {/* Action hints based on type */}
              {!notif.isRead && notif.type === 'info' && role === 'volunteer' && (
                  <button className="mt-3 text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:underline">
                      Lihat Misi <ArrowLeft className="w-3 h-3 rotate-180" />
                  </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
