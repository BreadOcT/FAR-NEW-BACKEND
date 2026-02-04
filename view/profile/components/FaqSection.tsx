
import React, { useState, useMemo } from 'react';
import { Shield, User, Store, ChevronUp, ChevronDown, MessageSquare, BookOpen, Truck } from 'lucide-react';
import { Button } from '../../components/Button';
import { FAQItem } from '../../../types';

interface FaqSectionProps {
    faqs?: FAQItem[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs = [] }) => {
    const [openCategory, setOpenCategory] = useState<string | null>('Umum');
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    // Group FAQs by Category
    const groupedFaqs = useMemo(() => {
        const groups: { [key: string]: FAQItem[] } = {};
        const listToUse = faqs.length > 0 ? faqs : [
            // Fallback default
            { question: "Apa itu Food AI Rescue?", answer: "Platform penyelamatan makanan.", category: "Umum" }
        ];

        listToUse.forEach(item => {
            const cat = item.category || 'Umum';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [faqs]);

    const getIcon = (cat: string) => {
        if (cat.includes('Donatur')) return Store;
        if (cat.includes('Penerima')) return User;
        if (cat.includes('Relawan')) return Truck;
        return BookOpen;
    };

    const handleContactCS = () => {
        window.open(`https://wa.me/6285215376975`, '_blank');
    };

    return (
        <div className="p-4 md:p-6 bg-[#FDFBF7] dark:bg-stone-950 min-h-screen animate-in fade-in">
            <div className="space-y-6 max-w-3xl mx-auto">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-200 shrink-0">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-blue-700 dark:text-blue-400 mb-1">Pusat Bantuan & SOP</h4>
                        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">Temukan jawaban atas pertanyaan umum dan pelajari Standar Operasional Prosedur (SOP) untuk menjaga kualitas dan keamanan komunitas Food AI Rescue.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {Object.keys(groupedFaqs).map((category, idx) => {
                        const Icon = getIcon(category);
                        return (
                            <div key={idx} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                <button 
                                    onClick={() => setOpenCategory(openCategory === category ? null : category)} 
                                    className={`w-full flex justify-between items-center p-5 text-left transition-colors ${openCategory === category ? 'bg-orange-50 dark:bg-orange-900/10' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'}`}
                                >
                                    <span className="flex gap-3 items-center font-bold text-stone-800 dark:text-stone-200 text-lg">
                                        <div className={`p-2 rounded-lg ${openCategory === category ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        {category}
                                    </span>
                                    {openCategory === category ? <ChevronUp className="w-5 h-5 text-orange-500" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
                                </button>
                                
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openCategory === category ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-2 space-y-2">
                                        {groupedFaqs[category].map((item, i) => (
                                            <div key={i} className="rounded-xl overflow-hidden border border-transparent hover:border-stone-200 dark:hover:border-stone-700 transition-colors">
                                                <button 
                                                    onClick={() => setOpenFaq(openFaq === `${idx}-${i}` ? null : `${idx}-${i}`)} 
                                                    className={`w-full flex justify-between items-start gap-4 p-4 text-left font-semibold text-sm transition-colors ${openFaq === `${idx}-${i}` ? 'text-orange-600 bg-orange-50/50 dark:bg-orange-900/5' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                                                >
                                                    {item.question}
                                                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform mt-0.5 ${openFaq === `${idx}-${i}` ? 'rotate-180 text-orange-500' : 'text-stone-400'}`} />
                                                </button>
                                                <div 
                                                    className={`overflow-hidden transition-all duration-300 ${openFaq === `${idx}-${i}` ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                                >
                                                    <div className="p-4 pt-0 pl-4 text-sm text-stone-600 dark:text-stone-400 leading-relaxed bg-orange-50/50 dark:bg-orange-900/5 border-l-2 border-orange-200 dark:border-orange-800 ml-4 mb-2 mr-4 rounded-r-lg">
                                                        {item.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 p-8 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-stone-900 dark:to-stone-800 rounded-3xl border border-orange-100 dark:border-stone-800 text-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl"></div>
                    
                    <h4 className="font-bold text-xl text-stone-900 dark:text-white mb-2 relative z-10">Masih Butuh Bantuan?</h4>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-6 max-w-md mx-auto relative z-10">Tim Customer Service kami siap membantu Anda 24/7 untuk masalah teknis atau darurat.</p>
                    
                    <Button onClick={handleContactCS} className="w-auto bg-[#25D366] hover:bg-[#128C7E] border-0 text-white shadow-lg shadow-green-500/20 mx-auto relative z-10 px-8 py-3 h-auto">
                        <MessageSquare className="w-5 h-5 mr-2" /> Hubungi WhatsApp Support
                    </Button>
                </div>
                
                <p className="text-center text-xs text-stone-400 mt-8 pb-8">
                    Terakhir diperbarui: 24 Februari 2025 • Versi 1.3.0
                </p>
            </div>
        </div>
    );
};
