
import React, { useState, useEffect, useRef } from 'react';
import { Users, Gift, PlusCircle, Search, Trash2, X, Image as ImageIcon, Smile, Upload, Edit3, Filter, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { UserData, Badge, UserRole } from '../../../types';
import { ACHIEVEMENT_BADGES } from '../../../constants';

export const Community: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'Restoran Berkah', role: 'Provider', email: 'resto@berkah.com', status: 'active', points: 1250, joinDate: 'Jan 2025' },
    { id: '2', name: 'Budi Santoso', role: 'Volunteer', email: 'budi@gmail.com', status: 'active', points: 3850, joinDate: 'Feb 2025' },
    { id: '3', name: 'Siti Rahmawati', role: 'Receiver', email: 'siti@yahoo.com', status: 'active', points: 450, joinDate: 'Mar 2025' },
    { id: '4', name: 'Warung Tegal Jaya', role: 'Provider', email: 'warteg@jaya.com', status: 'pending', points: 0, joinDate: 'Apr 2025' },
    { id: '5', name: 'Andi Pratama', role: 'Volunteer', email: 'andi@gmail.com', status: 'suspended', points: 120, joinDate: 'Jan 2025' },
    // Adding dummy data to demonstrate pagination
    ...Array.from({ length: 25 }, (_, i) => ({
        id: `dummy-${i}`,
        name: `User Demo ${i + 1}`,
        role: i % 3 === 0 ? 'Provider' : i % 3 === 1 ? 'Volunteer' : 'Receiver',
        email: `user${i}@demo.com`,
        status: i % 5 === 0 ? 'suspended' : 'active',
        points: Math.floor(Math.random() * 5000),
        joinDate: 'May 2025'
    } as UserData))
  ]);
  const [badges, setBadges] = useState<Badge[]>(ACHIEVEMENT_BADGES);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeForm, setBadgeForm] = useState<Badge>({ id: '', name: '', icon: '🏆', image: '', description: '', role: 'all', minPoints: 0, awardedTo: 0 });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Scroll Container Ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter Logic
  const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  // Horizontal Scroll Handler for Mouse Wheel
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      };
      // Use passive: false to allow preventDefault
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  const handleUserAction = (action: 'suspend' | 'activate' | 'save') => {
      if (!selectedUser) return;
      if (action === 'save') {
          if (selectedUser.id === 'new') {
              setUsers([...users, { ...selectedUser, id: Date.now().toString() }]);
          } else {
              setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
          }
      }
      setSelectedUser(null);
  };

  const handleBadgeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setBadgeForm({ ...badgeForm, image: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveBadge = () => {
      if (!badgeForm.name) return alert("Nama badge wajib diisi");
      
      if (badgeForm.id) {
          // Edit existing badge
          setBadges(badges.map(b => b.id === badgeForm.id ? badgeForm : b));
      } else {
          // Create new badge
          setBadges([...badges, { ...badgeForm, id: Date.now().toString() }]);
      }
      setShowBadgeModal(false);
      resetBadgeForm();
  };

  const handleDeleteBadge = () => {
      if (!badgeForm.id) return;
      if (confirm(`Apakah Anda yakin ingin menghapus badge "${badgeForm.name}"?`)) {
          setBadges(badges.filter(b => b.id !== badgeForm.id));
          setShowBadgeModal(false);
          resetBadgeForm();
      }
  };

  const resetBadgeForm = () => {
      setBadgeForm({ id: '', name: '', icon: '🏆', image: '', description: '', role: 'all', minPoints: 0, awardedTo: 0 });
  };

  const openCreateModal = () => {
      resetBadgeForm();
      setShowBadgeModal(true);
  };

  const openEditModal = (badge: Badge) => {
      setBadgeForm(badge);
      setShowBadgeModal(true);
  };

  const emojiList = [
      '🏆', '⭐', '🌟', '🔥', '💎', '🚀', 
      '🌍', '❤️', '🍀', '👑', '🎯', '⚡',
      '🎖️', '🎗️', '🎨', '💡', '🌱', '🛡️',
      '🤝', '🎓', '🥇', '🥈', '🥉', '🎁'
  ];

  return (
    <div className="animate-in fade-in space-y-8">
       {/* Inject custom scrollbar styles for this component */}
       <style>
       {`
         .custom-scrollbar::-webkit-scrollbar {
           height: 8px !important;
           width: 8px !important;
           display: block !important;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
           background: rgba(255, 255, 255, 0.1) !important; 
           border-radius: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
           background: rgba(249, 115, 22, 0.5) !important; 
           border-radius: 4px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
           background: rgba(249, 115, 22, 0.8) !important; 
         }
         /* For Firefox */
         .custom-scrollbar {
           scrollbar-width: thin !important;
           scrollbar-color: rgba(249, 115, 22, 0.5) rgba(255, 255, 255, 0.1) !important;
         }
       `}
       </style>

       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" /> Manajemen User & Reward
          </h2>
          <div className="flex gap-2">
             <Button className="w-auto text-xs h-10 px-4 bg-orange-500 hover:bg-orange-600" onClick={() => setSelectedUser({id:'new', name:'', email:'', role:'Volunteer', status:'active', points:0, joinDate:''})}><PlusCircle className="w-4 h-4 mr-2" /> Tambah Manual</Button>
          </div>
       </div>
       
       {/* Badge Banner - Horizontal Carousel */}
       <div className="bg-gradient-to-br from-[#3E2723] to-black rounded-3xl p-8 text-white relative shadow-2xl border border-orange-900/30">
          {/* Background decorations in a separate container to prevent overflow clipping on main content */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
             <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
             <div>
                 <h3 className="font-bold text-2xl flex items-center gap-2 mb-2 text-orange-100"><Gift className="w-6 h-6 text-orange-500" /> Badge & Achievements</h3>
                 <p className="text-stone-400 text-sm">Koleksi penghargaan untuk apresiasi komunitas</p>
             </div>
             <button onClick={openCreateModal} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-orange-900/20">
                <PlusCircle className="w-4 h-4" /> Tambah Badge
             </button>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-6 relative z-10 snap-x flex-nowrap custom-scrollbar w-full"
          >
             {badges.map(badge => (
                 <div 
                    key={badge.id} 
                    onClick={() => openEditModal(badge)}
                    className="snap-start bg-white/5 backdrop-blur-xl rounded-2xl w-[200px] aspect-[3/4] shrink-0 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group flex flex-col cursor-pointer"
                 >
                    {/* Image Area (Top Half) */}
                    <div className="h-[55%] w-full relative bg-black/20 overflow-hidden">
                        {badge.image ? (
                            <>
                                <img src={badge.image} alt="bg" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a] to-transparent"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900"></div>
                        )}
                        
                        {/* Role Badge */}
                        <div className="absolute top-3 left-3">
                            <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-sm backdrop-blur-md ${
                                badge.role === 'provider' ? 'bg-blue-500/80 text-white' :
                                badge.role === 'volunteer' ? 'bg-green-500/80 text-white' :
                                badge.role === 'receiver' ? 'bg-yellow-500/80 text-black' :
                                'bg-stone-500/80 text-white'
                            }`}>
                                {badge.role}
                            </span>
                        </div>

                        {/* Edit Button (Hover) */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/50 p-1.5 rounded-lg hover:bg-orange-500 transition-colors">
                                <Edit3 className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>

                        {/* Floating Icon */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-stone-800 to-black border-4 border-[#251815] flex items-center justify-center text-3xl shadow-xl z-10 group-hover:scale-110 transition-transform duration-300">
                            {badge.icon}
                        </div>
                    </div>

                    {/* Content Area (Bottom Half) */}
                    <div className="flex-1 pt-9 pb-4 px-4 text-center flex flex-col items-center justify-between bg-gradient-to-b from-[#251815] to-[#1a0f0a]">
                        <div>
                            <h4 className="font-bold text-white text-base leading-tight mb-1">{badge.name}</h4>
                            <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed">{badge.description}</p>
                        </div>
                        
                        <div className="mt-3 w-full">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-900/30 border border-amber-900/50 py-1.5 rounded-lg w-full">
                                <Target className="w-3 h-3" /> Syarat: {badge.minPoints} Poin
                            </div>
                        </div>
                    </div>
                 </div>
             ))}
          </div>
       </div>

       {/* Search & Filter Bar */}
       <div className="flex flex-col md:flex-row gap-4">
           <div className="flex-1 bg-[#FDFBF7] dark:bg-stone-900 p-2 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center gap-2 shadow-sm">
               <Search className="w-5 h-5 text-stone-400 ml-2" />
               <input 
                    type="text" 
                    placeholder="Cari user berdasarkan nama atau email..." 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-stone-900 dark:text-stone-200 placeholder-stone-400" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
               />
           </div>
           
           <div className="flex gap-2">
               <div className="relative">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"><Filter className="w-4 h-4" /></div>
                   <select 
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="h-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm font-medium text-stone-600 dark:text-stone-300 focus:outline-none focus:border-orange-500 appearance-none"
                   >
                       <option value="all">Semua Role</option>
                       <option value="Provider">Provider</option>
                       <option value="Volunteer">Volunteer</option>
                       <option value="Receiver">Receiver</option>
                   </select>
               </div>
               
               <div className="relative">
                   <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-sm font-medium text-stone-600 dark:text-stone-300 focus:outline-none focus:border-orange-500 appearance-none"
                   >
                       <option value="all">Semua Status</option>
                       <option value="active">Active</option>
                       <option value="pending">Pending</option>
                       <option value="suspended">Suspended</option>
                   </select>
               </div>
           </div>
       </div>

       {/* User Table */}
       <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
             <thead className="bg-stone-50 dark:bg-stone-950 text-stone-500 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                    <th className="p-5">User</th>
                    <th className="p-5">Role</th>
                    <th className="p-5 text-center">Points</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Aksi</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {currentUsers.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-10 text-center text-stone-500 dark:text-stone-400">
                            Tidak ada user yang ditemukan sesuai filter.
                        </td>
                    </tr>
                ) : (
                    currentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                        <td className="p-5">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'Provider' ? 'bg-orange-500' : user.role === 'Volunteer' ? 'bg-orange-400' : 'bg-orange-300'}`}>
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-stone-900 dark:text-white">{user.name}</div>
                                    <div className="text-xs text-stone-500">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                user.role === 'Provider' ? 'bg-blue-100 text-blue-700' : 
                                user.role === 'Volunteer' ? 'bg-green-100 text-green-700' : 
                                'bg-purple-100 text-purple-700'
                            }`}>
                                {user.role}
                            </span>
                        </td>
                        <td className="p-5 text-center">
                            <span className="font-bold text-stone-900 dark:text-white">{user.points.toLocaleString()}</span>
                        </td>
                        <td className="p-5">
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide ${user.status === 'active' ? 'bg-green-100 text-green-600' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                {user.status}
                            </span>
                        </td>
                        <td className="p-5 text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" className="h-8 w-auto text-xs px-4" onClick={() => setSelectedUser(user)}>Edit</Button>
                                <button className="p-2 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </td>
                    </tr>
                    ))
                )}
             </tbody>
          </table>
          
          {/* Pagination Footer */}
          {filteredUsers.length > 0 && (
            <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
                </span>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 dark:text-stone-300"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-lg">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-600 dark:text-stone-300"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
          )}
       </div>

       {/* Edit User Modal */}
       {selectedUser && (
           <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                   <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
                   <h3 className="font-bold text-xl text-stone-900 dark:text-white mb-6">{selectedUser.id === 'new' ? 'Tambah User' : 'Edit User'}</h3>
                   <div className="space-y-4">
                       <Input label="Nama Lengkap" value={selectedUser.name} onChange={e => setSelectedUser({...selectedUser, name: e.target.value})} />
                       <Input label="Email Address" value={selectedUser.email} onChange={e => setSelectedUser({...selectedUser, email: e.target.value})} />
                       <div className="space-y-2">
                           <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Role</label>
                           <select 
                                value={selectedUser.role}
                                onChange={e => setSelectedUser({...selectedUser, role: e.target.value})}
                                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                           >
                               <option value="Provider">Provider</option>
                               <option value="Volunteer">Volunteer</option>
                               <option value="Receiver">Receiver</option>
                           </select>
                       </div>
                       {selectedUser.id !== 'new' && (
                           <div className="space-y-2">
                               <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Status Akun</label>
                               <select 
                                    value={selectedUser.status}
                                    onChange={e => setSelectedUser({...selectedUser, status: e.target.value as any})}
                                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white"
                               >
                                   <option value="active">Active</option>
                                   <option value="pending">Pending</option>
                                   <option value="suspended">Suspended</option>
                               </select>
                           </div>
                       )}
                       <div className="flex justify-end gap-3 mt-6">
                           <Button variant="ghost" onClick={() => setSelectedUser(null)}>Batal</Button>
                           <Button onClick={() => handleUserAction('save')}>Simpan Perubahan</Button>
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* Badge Modal (Create & Edit) */}
       {showBadgeModal && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-stone-900 dark:text-white">
                            {badgeForm.id ? 'Edit Badge' : 'Buat Badge Baru'}
                        </h3>
                        <button onClick={() => setShowBadgeModal(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar">
                        <Input label="Nama Badge" value={badgeForm.name} onChange={e => setBadgeForm({...badgeForm, name: e.target.value})} placeholder="Contoh: Top Donatur" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Target Role</label>
                                <select 
                                    value={badgeForm.role || 'all'}
                                    onChange={e => setBadgeForm({...badgeForm, role: e.target.value as UserRole | 'all'})}
                                    className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-900 dark:text-white text-sm"
                                >
                                    <option value="all">Semua Role</option>
                                    <option value="provider">Provider</option>
                                    <option value="volunteer">Volunteer</option>
                                    <option value="receiver">Receiver</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Syarat Poin</label>
                                <Input 
                                    type="number" 
                                    label="" 
                                    placeholder="0"
                                    value={badgeForm.minPoints}
                                    onChange={e => setBadgeForm({...badgeForm, minPoints: parseInt(e.target.value) || 0})}
                                />
                            </div>
                        </div>

                        {/* Emoji Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 dark:text-stone-400 flex items-center gap-2">
                                <Smile className="w-4 h-4 text-orange-500" /> Pilih Ikon Utama (Emoji)
                            </label>
                            <div className="grid grid-cols-6 gap-2 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700">
                                {emojiList.map(emoji => (
                                    <button 
                                        key={emoji} 
                                        onClick={() => setBadgeForm({...badgeForm, icon: emoji})}
                                        className={`text-2xl p-2 rounded-lg hover:bg-white dark:hover:bg-stone-700 transition-all transform hover:scale-110 ${badgeForm.icon === emoji ? 'bg-white dark:bg-stone-700 shadow-md ring-2 ring-orange-500 scale-110' : 'text-stone-900 dark:text-white opacity-70 hover:opacity-100'}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-stone-600 dark:text-stone-400 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-blue-500" /> Upload Gambar Latar (Opsional)
                            </label>
                            
                            <div className="relative border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-1 overflow-hidden hover:border-orange-500 transition-colors bg-stone-50 dark:bg-stone-800/50 group h-32">
                                {badgeForm.image ? (
                                    <>
                                        <img src={badgeForm.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setBadgeForm({...badgeForm, image: ''})} className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg hover:bg-red-600">
                                                <Trash2 className="w-3 h-3" /> Hapus
                                            </button>
                                        </div>
                                        {/* Preview Badge Look */}
                                        <div className="absolute top-2 right-2 text-2xl drop-shadow-md animate-bounce">{badgeForm.icon}</div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <Upload className="w-6 h-6 text-stone-400 mb-2" />
                                        <p className="text-xs text-stone-500 font-medium">Klik untuk upload gambar latar</p>
                                        <p className="text-[10px] text-stone-400 mt-1">Format: JPG/PNG, Max 1MB</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" className={`absolute inset-0 opacity-0 cursor-pointer ${badgeForm.image ? 'pointer-events-none' : ''}`} onChange={handleBadgeImageUpload} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Deskripsi & Syarat</label>
                            <textarea 
                                className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/50 text-stone-900 dark:text-white focus:outline-none focus:border-orange-500 text-sm" 
                                rows={2} 
                                placeholder="Jelaskan kriteria badge ini..."
                                value={badgeForm.description}
                                onChange={e => setBadgeForm({...badgeForm, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-stone-100 dark:border-stone-800 mt-2">
                        {badgeForm.id ? (
                            <Button variant="ghost" onClick={handleDeleteBadge} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-auto px-3">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        ) : <div></div>}
                        
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={() => setShowBadgeModal(false)}>Batal</Button>
                            <Button onClick={handleSaveBadge}>{badgeForm.id ? 'Simpan Perubahan' : 'Buat Badge'}</Button>
                        </div>
                    </div>
                </div>
            </div>
       )}
    </div>
  );
};
