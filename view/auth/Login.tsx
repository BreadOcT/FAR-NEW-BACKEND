
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircle, Truck, Utensils, ArrowRight, Quote as QuoteIcon, ShieldCheck, Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LOGIN_QUOTES } from '../../constants';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLogin: (role: UserRole) => void;
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('receiver');

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOGIN_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Bypass logic: Simulating network delay then directly logging in with selected role
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    onLogin(selectedRole);
  };

  const currentQuote = LOGIN_QUOTES[quoteIndex];
  const LEFT_IMAGE_URL = "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop";

  return (
    <div className="flex w-full min-h-screen bg-[#050402] font-sans text-stone-100 overflow-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Left Side - Image & Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between p-16 overflow-hidden border-r border-[#2C1810]">
        <div className="absolute inset-0 z-0">
            <img src={LEFT_IMAGE_URL} alt="Background" className="w-full h-full object-cover opacity-40 scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-[#1a0b08]/90 to-[#2C1810]/70 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4 animate-in slide-in-from-top-8 duration-700">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] border border-orange-500/30 backdrop-blur-md">
                <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
                <span className="text-3xl font-black tracking-tight text-white drop-shadow-xl block leading-none">FOOD AI</span>
                <span className="text-sm font-bold text-orange-500 tracking-[0.35em] block mt-1">RESCUE</span>
            </div>
        </div>

        <div className="relative z-10 space-y-10 max-w-2xl mt-auto mb-12 animate-in slide-in-from-left-8 duration-1000">
            <h1 className="text-7xl font-black leading-[0.9] tracking-tight drop-shadow-2xl">
                <span className="text-stone-100">AKSI NYATA</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 filter drop-shadow-lg">BERBAGI.</span>
            </h1>
            <div className="relative pl-8 border-l-4 border-orange-600 py-6 backdrop-blur-md bg-black/40 rounded-r-3xl pr-8 border border-white/5 shadow-2xl">
                 <QuoteIcon className="absolute -top-5 -left-4 w-10 h-10 text-orange-500 fill-orange-500 opacity-50" />
                 <p className="text-2xl text-stone-200 font-serif italic leading-relaxed">"{currentQuote.text}"</p>
                 <div className="mt-4 flex items-center gap-3">
                    <div className="h-0.5 w-10 bg-orange-600"></div>
                    <p className="text-sm font-bold text-orange-500 uppercase tracking-widest">{currentQuote.author}</p>
                 </div>
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 lg:p-12 relative z-10 bg-[#0F0A05]/98 border-l border-white/5 overflow-y-auto">
          <div className="w-full max-w-[420px] space-y-8 py-10">
             
             {/* Mobile Branding */}
             <div className="lg:hidden flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-900/50 mb-4">
                    <Truck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Food AI Rescue</h2>
             </div>

             <div className="text-center lg:text-left space-y-2">
                <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-2 justify-center lg:justify-start">
                    Selamat Datang <Sparkles className="w-6 h-6 text-yellow-500" />
                </h2>
                <p className="text-[#8D6E63] text-base font-medium">Lanjutkan misi kebaikan Anda bersama kami.</p>
             </div>

             {/* Role Selection */}
             <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#A1887F] uppercase tracking-[0.2em] ml-1">Pilih Identitas Anda</label>
                
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'provider', label: 'Donatur', icon: Utensils }, 
                        { id: 'receiver', label: 'Penerima', icon: UserCircle }, 
                        { id: 'volunteer', label: 'Relawan', icon: Truck },
                        { id: 'admin_manager', label: 'Pengelola', icon: ShieldCheck },
                        { id: 'super_admin', label: 'Super Admin', icon: Crown }
                    ].map((role) => (
                        <button 
                            key={role.id} 
                            type="button" 
                            onClick={() => setSelectedRole(role.id as UserRole)} 
                            className={`
                                flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 border relative overflow-hidden group
                                ${selectedRole === role.id 
                                    ? 'bg-[#2D1B14] border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)] scale-[1.02] z-10' 
                                    : 'bg-[#120D0A] border-stone-800 text-[#6D4C41] hover:border-orange-500/30 hover:bg-[#1A1410]'
                                }
                                ${role.id === 'super_admin' ? 'col-span-2' : 'col-span-1'}
                            `}
                        >
                            <role.icon className={`w-6 h-6 mb-2 transition-all ${selectedRole === role.id ? 'stroke-orange-500' : 'stroke-current opacity-60'}`} />
                            <span className="text-[10px] font-black tracking-widest uppercase">{role.label}</span>
                            {selectedRole === role.id && <div className="absolute inset-0 bg-orange-500/5 animate-pulse"></div>}
                        </button>
                    ))}
                </div>
             </div>

             {/* Login Form */}
             <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                    <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="nama@email.com" 
                        icon={<Mail className="w-5 h-5" />} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="bg-[#18120E] border-stone-800 text-white placeholder-stone-600 focus:border-orange-500 focus:ring-orange-500/10 rounded-xl py-4 pl-12 transition-all" 
                        labelClassName="text-[#A1887F] font-bold text-[10px] uppercase tracking-widest"
                    />
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <Input 
                            label="Password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            icon={<Lock className="w-5 h-5" />} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="bg-[#18120E] border-stone-800 text-white placeholder-stone-600 focus:border-orange-500 focus:ring-orange-500/10 rounded-xl py-4 pl-12 transition-all" 
                            labelClassName="text-[#A1887F] font-bold text-[10px] uppercase tracking-widest"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-[#5D4037] hover:text-orange-500 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center justify-between text-sm pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                        <div className="relative">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="w-5 h-5 border-2 border-stone-800 rounded bg-[#120D0A] peer-checked:bg-orange-600 peer-checked:border-orange-600 transition-all"></div>
                            <svg className="absolute top-1 left-1 w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="text-[#8D6E63] group-hover:text-stone-300 transition-colors font-bold text-[10px] uppercase tracking-wider">Ingat saya</span>
                    </label>
                    <button type="button" onClick={() => onNavigate('forgot-password')} className="text-orange-500 hover:text-orange-400 font-black transition-colors text-[10px] uppercase tracking-widest">Lupa Password?</button>
                </div>
                
                <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isLoading} 
                    className="w-full h-14 text-sm font-black bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white shadow-[0_8px_25px_rgba(194,65,12,0.4)] border-0 rounded-xl mt-8 tracking-[0.2em] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                    MASUK SEKARANG <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
             </form>
             
             <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[#6D4C41] text-xs font-bold uppercase tracking-widest">
                    Belum punya akun? <button onClick={() => onNavigate('register')} className="text-orange-500 hover:text-white transition-colors ml-1 font-black underline decoration-orange-500/30 underline-offset-4">Daftar sekarang</button>
                </p>
             </div>
          </div>
      </div>
    </div>
  );
};
