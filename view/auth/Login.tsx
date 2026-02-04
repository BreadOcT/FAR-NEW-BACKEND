
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircle, Truck, Utensils, ArrowRight, Quote as QuoteIcon, ShieldCheck, Crown, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LOGIN_QUOTES } from '../../constants';
import { UserRole } from '../../types';

interface LoginViewProps {
  onLogin: (data: { role: UserRole; email?: string }) => void;
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>('receiver');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    // Set default credentials for the initial selected role (Receiver)
    setEmail('penerima@demo.com');
    setPassword('Receiver@2025');

    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOGIN_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Definisi Akun Demo yang dipetakan ke tombol
  const roleDefinitions = [
      { id: 'provider', label: 'Donatur', icon: Utensils, email: 'resto@gmail.com', pass: 'Provider@2025' },
      { id: 'receiver', label: 'Penerima', icon: UserCircle, email: 'penerima@gmail.com', pass: 'Receiver@2025' },
      { id: 'volunteer', label: 'Relawan', icon: Truck, email: 'relawan@gmail.com', pass: 'Volunteer@2025' },
      { id: 'admin_manager', label: 'Pengelola', icon: ShieldCheck, email: 'manager@gmail.com', pass: 'Admin@2025' },
      { id: 'super_admin', label: 'Super Admin', icon: Crown, email: 'super@gmail.com', pass: 'Super@2025' }
  ];

  const handleRoleSelect = (roleItem: typeof roleDefinitions[0]) => {
      setSelectedRole(roleItem.id as UserRole);
      // Auto-fill credentials saat tombol ditekan
      setEmail(roleItem.email);
      setPassword(roleItem.pass);
      setErrors({});
  };

  const validateForm = () => {
    // Quick Code Bypass (Dev Mode)
    if (password === '123' || password === 'admin') return true;

    const newErrors: {[key: string]: string} = {};
    
    // Validasi Email (Wajib ada @ dan format standar)
    if (!email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "Email harus memiliki format yang valid (contoh: nama@domain.com)";
    }

    // Validasi Password (8 char, 1 Uppercase, 1 Lowercase, 1 Number, 1 Symbol)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        newErrors.password = "Password wajib: Min. 8 karakter, 1 Huruf Besar, 1 Kecil, 1 Angka, & 1 Simbol.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    setIsLoading(true);
    // Bypass logic: Simulating network delay then directly logging in with selected role
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    
    // Send role AND email to allow parent to find user data
    onLogin({
        role: selectedRole,
        email: email
    });
  };

  const currentQuote = LOGIN_QUOTES[quoteIndex];
  const LEFT_IMAGE_URL = "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop";

  return (
    <div className="flex w-full min-h-screen bg-[#050402] font-sans text-stone-100 overflow-hidden relative selection:bg-orange-500 selection:text-white">
      
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
          
          {/* Mobile Background Image (Subtle) */}
          <div className="lg:hidden absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=1000" className="w-full h-full object-cover opacity-20" />
             <div className="absolute inset-0 bg-[#050402]/90"></div>
          </div>

          <div className="w-full max-w-[420px] space-y-8 py-10 relative z-10">
             
             {/* Mobile Branding */}
             <div className="lg:hidden flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-900/50 mb-4 border border-orange-400/20">
                    <Truck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">Food AI Rescue</h2>
                <p className="text-[10px] text-orange-400 font-bold tracking-[0.2em] uppercase mt-2">Platform Donasi Pangan</p>
             </div>

             <div className="text-center lg:text-left space-y-2 hidden lg:block">
                <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-2 justify-center lg:justify-start">
                    Selamat Datang <Sparkles className="w-6 h-6 text-yellow-500" />
                </h2>
                <p className="text-[#8D6E63] text-base font-medium">Lanjutkan misi kebaikan Anda bersama kami.</p>
             </div>

             {/* Role Selection (Combined with Quick Login) */}
             <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#A1887F] uppercase tracking-[0.2em] ml-1 flex justify-between items-center">
                    <span>Pilih Identitas (Auto-Fill Demo)</span>
                    <span className="text-[9px] bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">Quick Login Active</span>
                </label>
                
                <div className="grid grid-cols-3 gap-3">
                    {roleDefinitions.map((role) => (
                        <button 
                            key={role.id} 
                            type="button" 
                            onClick={() => handleRoleSelect(role)} 
                            className={`
                                flex flex-col items-center justify-center py-4 rounded-2xl transition-all duration-300 border relative overflow-hidden group
                                ${selectedRole === role.id 
                                    ? 'bg-[#2D1B14] border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)] scale-[1.02] z-10 ring-1 ring-orange-500/50' 
                                    : 'bg-[#120D0A] border-[#2C1810] text-[#6D4C41] hover:border-orange-500/30 hover:bg-[#1A1410] hover:text-[#8D6E63]'
                                }
                                ${role.id === 'super_admin' ? 'col-span-3 flex-row gap-2 h-12 py-0' : 'col-span-1'}
                            `}
                        >
                            <role.icon className={`w-6 h-6 ${role.id === 'super_admin' ? 'w-4 h-4' : 'mb-2'} transition-all ${selectedRole === role.id ? 'stroke-orange-500' : 'stroke-current opacity-60'}`} />
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
                        icon={<Mail className="w-5 h-5 text-[#5D4037]" />} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className={`bg-[#0A0604] border-[#2C1810] text-stone-200 placeholder-[#3E2723] focus:border-orange-600 focus:ring-1 focus:ring-orange-600/30 rounded-xl py-4 pl-12 transition-all ${errors.email ? 'border-red-900 focus:border-red-600' : ''}`} 
                        labelClassName="text-[#A1887F] font-bold text-[10px] uppercase tracking-widest"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                    <div className="relative">
                        <Input 
                            label="Password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            icon={<Lock className="w-5 h-5 text-[#5D4037]" />} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className={`bg-[#0A0604] border-[#2C1810] text-stone-200 placeholder-[#3E2723] focus:border-orange-600 focus:ring-1 focus:ring-orange-600/30 rounded-xl py-4 pl-12 transition-all ${errors.password ? 'border-red-900 focus:border-red-600' : ''}`} 
                            labelClassName="text-[#A1887F] font-bold text-[10px] uppercase tracking-widest"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-[#5D4037] hover:text-orange-600 transition-colors">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1 leading-tight">{errors.password}</p>}
                </div>
                
                <div className="flex items-center justify-end text-sm pt-1">
                    <button type="button" onClick={() => onNavigate('forgot-password')} className="text-orange-600 hover:text-orange-400 font-bold transition-colors text-[10px] uppercase tracking-widest">Lupa Password?</button>
                </div>
                
                <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isLoading} 
                    className="w-full h-14 text-sm font-black bg-gradient-to-r from-orange-700 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white shadow-[0_8px_25px_rgba(194,65,12,0.4)] border-0 rounded-xl mt-4 tracking-[0.2em] transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                    MASUK SEKARANG <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
             </form>
             
             <div className="mt-8 pt-6 border-t border-[#2C1810] text-center">
                <p className="text-[#6D4C41] text-xs font-bold uppercase tracking-widest">
                    Belum punya akun? <button onClick={() => onNavigate('register')} className="text-orange-500 hover:text-white transition-colors ml-1 font-black underline decoration-orange-500/30 underline-offset-4 hover:decoration-orange-500">Daftar sekarang</button>
                </p>
             </div>
          </div>
      </div>
    </div>
  );
};
