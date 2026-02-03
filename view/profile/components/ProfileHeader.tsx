
import React, { useState } from 'react';
import { Store, Truck, User, Edit, Mail, Phone, Package, Star, Zap, CheckCircle, Clock, Award, Image, X, ChevronRight, Lock } from 'lucide-react';
import { UserRole } from '../../../types';
import { ACHIEVEMENT_BADGES, SOCIAL_SYSTEM } from '../../../constants';

interface ProfileHeaderProps {
    userData: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
    };
    role: UserRole;
    bannerImage: string | null;
    onEditBanner: () => void;
    onEditAvatar: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, role, bannerImage: initialBanner, onEditBanner, onEditAvatar }) => {
    // State management for Cover System
    const [coverMode, setCoverMode] = useState<'image' | 'badge'>('image');
    const [customBanner, setCustomBanner] = useState<string | null>(initialBanner);
    const [selectedBadgeId, setSelectedBadgeId] = useState<string>('');
    
    // UI States
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [showBadgeSelector, setShowBadgeSelector] = useState(false);

    // Mock scores based on role (Simulation for Points)
    const donaturScores = { totalDonations: 1250, rating: 4.8, responseRate: '98%', points: 2450 };
    const volunteerScores = { missions: 42, hours: 34, points: 3850 };
    const receiverScores = { claims: 15, points: 450 };

    // Determine current user points based on role for badge locking logic
    const currentUserPoints = role === 'provider' ? donaturScores.points : role === 'volunteer' ? volunteerScores.points : receiverScores.points;

    // Get Badges (Achievements) distinct from Rank
    const availableBadges = ACHIEVEMENT_BADGES.filter(b => b.role === 'all' || b.role === role);
    const activeBadge = availableBadges.find(b => b.id === selectedBadgeId);

    const handleOptionClick = (type: 'upload' | 'badge') => {
        setShowEditMenu(false);
        if (type === 'upload') {
            setCoverMode('image');
            onEditBanner(); 
            const url = prompt("Masukkan URL Gambar Banner:");
            if (url) setCustomBanner(url);
        } else {
            setShowBadgeSelector(true);
        }
    };

    const applyBadgeCover = (badgeId: string) => {
        setSelectedBadgeId(badgeId);
        setCoverMode('badge');
        setShowBadgeSelector(false);
    };

    return (
        <div className="mb-8">
            <div className="relative mx-4 mt-4 h-48">
                {/* Main Cover Container */}
                <div className={`h-full relative rounded-3xl shadow-xl shadow-orange-500/20 overflow-hidden group transition-all duration-500 bg-gradient-to-br ${coverMode === 'badge' && activeBadge ? 'from-stone-900 to-black' : !customBanner ? 'from-orange-400 to-amber-500' : ''}`}>
                    
                    {/* Mode: Image Upload */}
                    {coverMode === 'image' && customBanner && (
                        <>
                            <img src={customBanner} alt="Banner" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </>
                    )}

                    {/* Mode: Badge Display */}
                    {coverMode === 'badge' && activeBadge && (
                        <div className="absolute inset-0 flex items-center justify-between px-10 overflow-hidden">
                            {/* Background Image from Badge */}
                            {activeBadge.image && (
                                <>
                                    <img src={activeBadge.image} alt="Badge BG" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                                </>
                            )}
                            
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

                            <div className="relative z-10 text-white">
                                <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-1 block text-orange-400">Achievement Unlocked</span>
                                <h2 className="text-3xl font-black italic tracking-tighter drop-shadow-lg">{activeBadge.name}</h2>
                                <p className="text-xs text-stone-300 max-w-[200px] mt-1 line-clamp-2">{activeBadge.description}</p>
                            </div>
                            
                            <div className="relative z-10 transform translate-x-4">
                                <div className="text-[80px] drop-shadow-2xl filter saturate-150 animate-in zoom-in duration-700">{activeBadge.icon}</div>
                            </div>
                        </div>
                    )}

                    {/* Edit Button & Menu */}
                    <div className="absolute top-4 right-4 z-30">
                        <button 
                            onClick={() => setShowEditMenu(!showEditMenu)} 
                            className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/10"
                        >
                            <Edit className="w-3 h-3" /> Ganti Cover
                        </button>

                        {/* Dropdown Menu */}
                        {showEditMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <button 
                                    onClick={() => handleOptionClick('upload')}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800"
                                >
                                    <Image className="w-4 h-4 text-orange-500" /> Upload Foto
                                </button>
                                <button 
                                    onClick={() => handleOptionClick('badge')}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center gap-2"
                                >
                                    <Award className="w-4 h-4 text-purple-500" /> Pilih Badge
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Avatar Section */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-24 h-24 rounded-full bg-white dark:bg-stone-900 border-4 border-stone-50 dark:border-stone-950 p-1 shadow-lg relative group/avatar">
                        <div className="w-full h-full rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 overflow-hidden relative">
                            <img src={userData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-opacity">
                                <Edit className="w-6 h-6 text-white" />
                                <input type="file" accept="image/*" className="hidden" onChange={onEditAvatar} />
                            </label>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-1.5 border-2 border-white dark:border-stone-950 shadow-md">
                        {role === 'provider' && <Store className="w-3 h-3 text-white" />}
                        {role === 'volunteer' && <Truck className="w-3 h-3 text-white" />}
                        {role === 'receiver' && <User className="w-3 h-3 text-white" />}
                    </div>
                </div>
            </div>

            <div className="mt-14 text-center px-4">
                <h1 className="text-xl font-bold text-stone-900 dark:text-white">{userData.name}</h1>
                <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                    {role === 'provider' ? 'Donatur Terverifikasi' : role === 'volunteer' ? 'Relawan' : 'Penerima Manfaat'}
                </p>

                <div className="flex justify-center gap-4 mt-4 text-sm text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {userData.email}</div>
                </div>
                <div className="flex justify-center gap-4 mt-1 text-sm text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {userData.phone}</div>
                </div>

                {/* Score Cards */}
                {role === 'provider' && (
                    <div className="grid grid-cols-3 gap-3 px-4 mt-6 max-w-md mx-auto">
                        <ScoreCard icon={Package} value={donaturScores.totalDonations} label="Donasi" color="orange" />
                        <ScoreCard icon={Star} value={donaturScores.rating} label="Rating" color="yellow" />
                        <ScoreCard icon={Award} value={donaturScores.points} label="Poin" color="blue" />
                    </div>
                )}
                {role === 'volunteer' && (
                    <div className="grid grid-cols-3 gap-3 px-4 mt-6 max-w-md mx-auto">
                        <ScoreCard icon={CheckCircle} value={volunteerScores.missions} label="Misi" color="blue" />
                        <ScoreCard icon={Clock} value={volunteerScores.hours} label="Jam" color="purple" />
                        <ScoreCard icon={Award} value={volunteerScores.points} label="Poin" color="orange" />
                    </div>
                )}
            </div>

            {/* Badge Selection Modal */}
            {showBadgeSelector && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-stone-900 dark:text-white">Pilih Badge Sampul</h3>
                                <p className="text-xs text-stone-500">Gunakan pencapaian Anda sebagai cover</p>
                            </div>
                            <button onClick={() => setShowBadgeSelector(false)} className="text-stone-400 hover:text-stone-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-3 bg-stone-50 dark:bg-stone-950/50">
                            {availableBadges.length > 0 ? (
                                availableBadges.map(badge => {
                                    const isLocked = currentUserPoints < badge.minPoints;
                                    return (
                                        <button 
                                            key={badge.id}
                                            onClick={() => !isLocked && applyBadgeCover(badge.id)}
                                            disabled={isLocked}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all group text-left relative overflow-hidden ${
                                                isLocked 
                                                ? 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 opacity-70 cursor-not-allowed' 
                                                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-orange-500 dark:hover:border-orange-500 cursor-pointer'
                                            }`}
                                        >
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm z-10 ${badge.id === selectedBadgeId ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-stone-100 dark:bg-stone-800'}`}>
                                                {isLocked ? <Lock className="w-5 h-5 text-stone-400" /> : badge.icon}
                                            </div>
                                            <div className="flex-1 z-10">
                                                <h4 className={`font-bold transition-colors ${isLocked ? 'text-stone-500' : 'text-stone-900 dark:text-white group-hover:text-orange-500'}`}>{badge.name}</h4>
                                                <p className="text-xs text-stone-500">{isLocked ? `Butuh ${badge.minPoints} Poin` : badge.description}</p>
                                            </div>
                                            {!isLocked && <ChevronRight className="w-5 h-5 text-stone-300 group-hover:text-orange-500 z-10" />}
                                            
                                            {/* Hover Gradient Effect */}
                                            {!isLocked && <div className="absolute inset-0 bg-orange-50 dark:bg-orange-900/10 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="text-center text-stone-500 text-sm py-8">Belum ada badge yang tersedia untuk role ini.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ScoreCard = ({ icon: Icon, value, label, color }: any) => {
    const colors: any = {
        orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
        yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
        blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    };
    return (
        <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col items-center">
            <div className={`p-2 rounded-full mb-1 ${colors[color]}`}><Icon className="w-4 h-4" /></div>
            <p className="text-lg font-bold text-stone-900 dark:text-white">{value}</p>
            <p className="text-[10px] text-stone-500 uppercase font-bold tracking-wide">{label}</p>
        </div>
    );
};
