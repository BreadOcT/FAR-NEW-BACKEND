
import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, AlertCircle, Eye, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/Button';
import { UserData, FoodItem, ClaimHistoryItem } from '../../../../types';
import { UserModal } from './UserModal';
import { VerificationModal } from './VerificationModal';

interface UserListProps {
    users: UserData[];
    setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
    inventory: FoodItem[];
    claims: ClaimHistoryItem[];
    pendingCount: number;
}

export const UserList: React.FC<UserListProps> = ({ users, setUsers, inventory, claims, pendingCount }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [verificationUser, setVerificationUser] = useState<UserData | null>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    // Calculate points logic
    const calculatePoints = (user: UserData): number => {
        let points = user.points || 0;
        if (user.role === 'Provider') {
            const completedOrders = claims.filter(c => c.providerName === user.name && c.status === 'completed').length;
            const activeStock = inventory.filter(i => i.providerName === user.name).length;
            points += (completedOrders * 50) + (activeStock * 10);
        } else if (user.role === 'Volunteer') {
            const missions = claims.filter(c => c.courierName === user.name && c.status === 'completed').length;
            points += (missions * 150);
        } else if (user.role === 'Receiver') {
            const myClaims = claims.filter(c => c.status === 'completed').length;
            points += (myClaims * 10);
        }
        return points;
    };

    const processedUsers = users
        .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        })
        .sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return 0;
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = processedUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(processedUsers.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, roleFilter, statusFilter]);

    const handleSaveUser = (user: UserData) => {
        if (user.id === 'new') {
            setUsers(prev => [{ ...user, id: Date.now().toString() }, ...prev]);
        } else {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
        }
        setIsUserModalOpen(false);
        setSelectedUser(null);
    };

    const processVerification = (status: 'active' | 'suspended') => {
        if (!verificationUser) return;
        const confirmMsg = status === 'active'
            ? `Aktifkan akun ${verificationUser.name}? User akan dapat login segera.`
            : `Tolak pendaftaran ${verificationUser.name}?`;

        if (confirm(confirmMsg)) {
            setUsers(prev => prev.map(u => u.id === verificationUser.id ? { ...u, status: status } : u));
            setVerificationUser(null);
        }
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-left duration-400">
            {/* Header User */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                    <h2 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tight italic flex items-center gap-2">
                        Manajemen Pengguna
                        {pendingCount > 0 && (
                            <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full not-italic font-bold tracking-normal border border-red-200 animate-pulse">
                                {pendingCount} Verifikasi Pending
                            </span>
                        )}
                    </h2>
                    <p className="text-[10px] text-stone-500 font-medium">Monitoring hak akses dan verifikasi anggota baru.</p>
                </div>
                <Button
                    className="w-full sm:w-auto h-10 px-5 bg-orange-600 font-black uppercase text-[10px] tracking-widest"
                    onClick={() => { setSelectedUser(null); setIsUserModalOpen(true); }}
                >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> TAMBAH USER
                </Button>
            </div>

            {/* Filter User */}
            <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex-1 bg-white dark:bg-stone-900 p-0.5 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
                    <Search className="w-4 h-4 text-stone-400 ml-3 shrink-0" />
                    <input
                        type="text"
                        placeholder="Cari nama atau email..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-xs py-2 text-stone-900 dark:text-stone-200 placeholder-stone-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-2 lg:flex gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2 rounded-xl text-[10px] font-bold text-stone-700 dark:text-stone-300 focus:outline-none focus:border-orange-500 appearance-none shadow-sm min-w-[110px]"
                    >
                        <option value="all">Semua Peran</option>
                        <option value="Provider">Provider</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Receiver">Receiver</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2 rounded-xl text-[10px] font-bold text-stone-700 dark:text-stone-300 focus:outline-none focus:border-orange-500 appearance-none shadow-sm min-w-[110px]"
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Table User */}
            <div className="bg-white dark:bg-stone-900 rounded-[1.25rem] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead className="bg-stone-50 dark:bg-stone-950 text-stone-400 text-[9px] uppercase font-black tracking-[0.1em] border-b border-stone-100 dark:border-stone-800">
                            <tr>
                                <th className="px-3 py-3 w-full">Identitas</th>
                                <th className="px-3 py-3 w-px whitespace-nowrap">Peran</th>
                                <th className="px-3 py-3 w-px whitespace-nowrap text-center">Poin</th>
                                <th className="px-3 py-3 w-px whitespace-nowrap">Status</th>
                                <th className="px-3 py-3 w-px whitespace-nowrap text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {currentUsers.map(user => {
                                const isPending = user.status === 'pending';
                                const displayPoints = calculatePoints(user);
                                return (
                                    <tr
                                        key={user.id}
                                        className={`
                                        transition-all group
                                        ${isPending
                                                ? 'bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 border-l-4 border-l-amber-500'
                                                : 'hover:bg-stone-50/50 dark:hover:bg-stone-800/30 border-l-4 border-l-transparent'
                                            }
                                    `}
                                    >
                                        <td className="px-3 py-3">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-black shadow-sm shrink-0 text-[10px] ${user.role === 'Provider' ? 'bg-orange-600' : user.role === 'Volunteer' ? 'bg-orange-500' : 'bg-orange-400'
                                                    }`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-black text-xs text-stone-900 dark:text-white truncate">{user.name}</p>
                                                        {isPending && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                                                    </div>
                                                    <p className="text-[9px] text-stone-500 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest whitespace-nowrap border ${isPending ? 'bg-white/50 border-amber-200 text-amber-700' : 'bg-stone-100 dark:bg-stone-800 border-transparent text-stone-500'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className={`font-black text-sm tracking-tighter ${isPending ? 'text-amber-700 dark:text-amber-500' : 'text-stone-900 dark:text-white'}`}>
                                                {displayPoints.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] uppercase font-black tracking-widest whitespace-nowrap flex items-center gap-1 w-fit ${user.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    user.status === 'pending' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {user.status === 'pending' && <AlertCircle className="w-2.5 h-2.5" />}
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-right">
                                            {isPending ? (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => setVerificationUser(user)}
                                                        className="h-8 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 text-[9px] font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 border border-blue-600 group/btn"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> REVIEW DETAIL
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-1">
                                                    <button onClick={() => { setSelectedUser(user); setIsUserModalOpen(true); }} className="p-1.5 bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                                                    <button className="p-1.5 bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">
                        Data {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, processedUsers.length)} / {processedUsers.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-200 disabled:opacity-30 transition-all shadow-sm flex items-center justify-center"
                        >
                            <ChevronLeft className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                        </button>
                        <div className="px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-[9px] font-black text-orange-600 uppercase tracking-widest shadow-sm">Hal {currentPage} / {totalPages}</div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-200 disabled:opacity-30 transition-all shadow-sm flex items-center justify-center"
                        >
                            <ChevronRight className="w-4 h-4 text-stone-600 dark:text-stone-300" />
                        </button>
                    </div>
                </div>
            </div>

            {verificationUser && (
                <VerificationModal
                    user={verificationUser}
                    onClose={() => setVerificationUser(null)}
                    onProcess={processVerification}
                />
            )}

            {isUserModalOpen && (
                <UserModal
                    user={selectedUser}
                    onClose={() => { setIsUserModalOpen(false); setSelectedUser(null); }}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};
