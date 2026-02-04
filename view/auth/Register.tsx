
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCircle, Truck, Utensils, ArrowRight, User, ArrowLeft, CheckCircle, Phone } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { UserRole } from '../../types';

interface RegisterViewProps {
  onNavigate: (view: 'login' | 'register' | 'forgot-password') => void;
  onRegister: (formData: any) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate, onRegister }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('receiver');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validasi Email (Wajib ada @)
    if (!formData.email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Email tidak valid (harus menyertakan '@')";
    }

    // Validasi Nomor HP
    if (!formData.phone || formData.phone.length < 9) {
        newErrors.phone = "Nomor WhatsApp wajib diisi (min. 9 digit)";
    }

    // Validasi Password (Standard Web: Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Symbol)
    // Regex explanation:
    // (?=.*[a-z]) -> minimal 1 huruf kecil
    // (?=.*[A-Z]) -> minimal 1 huruf besar
    // (?=.*\d)    -> minimal 1 angka
    // (?=.*[\W_]) -> minimal 1 simbol (non-word char atau underscore)
    // .{8,}       -> minimal panjang 8 karakter (karakter apa saja)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    
    if (!passwordRegex.test(formData.password)) {
        newErrors.password = "Password minimal 8 karakter, minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 simbol.";
    }

    // Validasi Konfirmasi Password
    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password tidak cocok!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Send full data back to App
    onRegister({
        ...formData,
        role: selectedRole
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Hanya mengizinkan angka
      const val = e.target.value.replace(/\D/g, '');
      setFormData({...formData, phone: val});
  };

  const LEFT_IMAGE_URL = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="flex w-full min-h-screen bg-[#050505] font-sans text-stone-100 overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-[#3E2723]">
        <div className="absolute inset-0 z-0">
            <img src={LEFT_IMAGE_URL} alt="Register Background" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#3E2723]/80 to-orange-900/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 animate-in slide-in-from-top-8 duration-700">
            <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 backdrop-blur-sm transition-all border border-white/5 group-hover:border-white/20">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Kembali ke Login</span>
            </button>
        </div>
        <div className="relative z-10 space-y-4 max-w-lg mt-auto mb-12 animate-in slide-in-from-left-8 duration-1000">
            <h1 className="text-5xl font-black leading-tight tracking-tight">
                <span className="text-stone-100">GABUNG DALAM</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 drop-shadow-lg">GERAKAN KEBAIKAN.</span>
            </h1>
            <p className="text-lg text-stone-300 font-medium leading-relaxed border-l-4 border-orange-600 pl-6">
                Setiap pendaftaran adalah langkah awal untuk menyelamatkan ribuan porsi makanan dan membantu sesama.
            </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-[#0a0a0a] overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0f05] to-[#2c1810] opacity-60"></div>
          
          <div className="w-full max-w-md relative z-10 py-10">
             <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h2>
                <p className="text-stone-400 text-sm">Lengkapi data diri untuk mulai berkontribusi.</p>
             </div>

             <div className="mb-8">
                <label className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest mb-3 block ml-1">Saya ingin mendaftar sebagai</label>
                <div className="grid grid-cols-3 gap-3">
                    {[{ id: 'provider', label: 'Donatur', icon: Utensils, desc: 'Pemilik Resto' }, { id: 'receiver', label: 'Penerima', icon: UserCircle, desc: 'Individu' }, { id: 'volunteer', label: 'Relawan', icon: Truck, desc: 'Pengantar' }].map((role) => (
                        <button 
                            key={role.id} 
                            type="button" 
                            onClick={() => setSelectedRole(role.id as UserRole)} 
                            className={`
                                relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 border text-center h-28 
                                ${selectedRole === role.id 
                                    ? 'bg-gradient-to-b from-[#3E2723] to-[#1a0f0a] border-orange-500/80 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] transform scale-[1.02]' 
                                    : 'bg-[#141414] border-stone-800 text-stone-500 hover:bg-[#1f1f1f] hover:text-stone-300 hover:border-stone-700'
                                }
                            `}
                        >
                            {selectedRole === role.id && (<div className="absolute top-2 right-2 text-orange-500"><CheckCircle className="w-4 h-4" /></div>)}
                            <role.icon className={`w-6 h-6 mb-2 ${selectedRole === role.id ? 'stroke-orange-400' : 'stroke-current'}`} />
                            <span className="text-xs font-bold uppercase tracking-wide block">{role.label}</span>
                            <span className="text-[10px] text-stone-500 mt-1 leading-tight block opacity-80">{role.desc}</span>
                        </button>
                    ))}
                </div>
             </div>

             <form onSubmit={handleRegister} className="space-y-4">
                <Input 
                    label="Nama Lengkap / Nama Usaha" 
                    placeholder="Contoh: Budi Santoso" 
                    icon={<User className="w-5 h-5" />} 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="bg-[#121212] border-stone-800 text-white focus:border-orange-500 rounded-xl py-3 pl-12 transition-all hover:border-stone-700 placeholder-stone-600" 
                />
                
                <div>
                    <Input 
                        label="Email Address" 
                        type="text" 
                        placeholder="nama@email.com" 
                        icon={<Mail className="w-5 h-5" />} 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        className={`bg-[#121212] border-stone-800 text-white focus:border-orange-500 rounded-xl py-3 pl-12 transition-all hover:border-stone-700 placeholder-stone-600 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`} 
                    />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
                </div>

                <div>
                    <Input 
                        label="Nomor WhatsApp" 
                        type="tel" 
                        placeholder="812-3456-7890" 
                        leftAddon={<span className="text-stone-400 font-bold px-1">+62</span>}
                        value={formData.phone} 
                        onChange={handlePhoneChange}
                        className={`bg-[#121212] border-stone-800 text-white focus:border-orange-500 rounded-r-xl py-3 transition-all hover:border-stone-700 placeholder-stone-600 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.phone}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Input 
                            label="Password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••" 
                            icon={<Lock className="w-5 h-5" />} 
                            value={formData.password} 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            className={`bg-[#121212] border-stone-800 text-white focus:border-orange-500 rounded-xl py-3 pl-12 transition-all hover:border-stone-700 placeholder-stone-600 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`} 
                        />
                    </div>
                    <div className="relative">
                        <Input 
                            label="Konfirmasi" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••" 
                            icon={<Lock className="w-5 h-5" />} 
                            value={formData.confirmPassword} 
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                            className={`bg-[#121212] border-stone-800 text-white focus:border-orange-500 rounded-xl py-3 pl-12 transition-all hover:border-stone-700 placeholder-stone-600 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`} 
                        />
                    </div>
                </div>
                
                {errors.password && <p className="text-red-500 text-[10px] mt-0 ml-1 leading-tight">{errors.password}</p>}
                {errors.confirmPassword && !errors.password && <p className="text-red-500 text-[10px] mt-0 ml-1">{errors.confirmPassword}</p>}
                
                <div className="flex justify-end">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-stone-500 hover:text-orange-400 flex items-center gap-1 transition-colors select-none">
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />} {showPassword ? 'Sembunyikan' : 'Lihat Password'}
                    </button>
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        variant="primary" 
                        isLoading={isLoading} 
                        className="w-full h-14 text-base font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-orange-600 hover:from-yellow-400 hover:via-orange-400 hover:to-orange-500 text-[#2c1810] shadow-lg shadow-orange-900/30 border-0 rounded-xl tracking-wide transition-all duration-300 hover:scale-[1.02]"
                    >
                        DAFTAR SEKARANG <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                </div>
             </form>

             <p className="mt-8 text-center text-stone-600 text-sm font-medium">
                Sudah punya akun? <button onClick={() => onNavigate('login')} className="font-bold text-stone-300 hover:text-orange-400 transition-colors underline decoration-stone-800 underline-offset-4 decoration-2 hover:decoration-orange-500/50">Masuk disini</button>
             </p>
          </div>
      </div>
    </div>
  );
};
