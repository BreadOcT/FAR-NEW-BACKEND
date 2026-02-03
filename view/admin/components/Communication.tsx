
import React, { useState, useEffect } from 'react';
import { Megaphone, Send, Inbox, Smartphone, Laptop, Tablet, Image, Bold, Italic, Link, List, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { EmptyState } from '../../common/EmptyState';
import { BroadcastMessage } from '../../../types';

type DeviceType = 'phone' | 'tablet' | 'laptop';

// Device Preview Component
const DevicePreview: React.FC<{
    device: DeviceType;
    title: string;
    content: string;
    target: string;
}> = ({ device, title, content, target }) => {
    const getDeviceFrame = () => {
        switch (device) {
            case 'phone':
                return {
                    wrapper: 'w-[280px] h-[580px]',
                    screen: 'w-full h-full rounded-[32px] border-[12px] border-stone-800 dark:border-stone-700',
                    notch: true
                };
            case 'tablet':
                return {
                    wrapper: 'w-[480px] h-[360px]',
                    screen: 'w-full h-full rounded-[20px] border-[16px] border-stone-800 dark:border-stone-700',
                    notch: false
                };
            case 'laptop':
                return {
                    wrapper: 'w-[560px] h-[380px]',
                    screen: 'w-full h-[calc(100%-40px)] rounded-t-xl border-[8px] border-b-0 border-stone-800 dark:border-stone-700',
                    notch: false,
                    hasBase: true
                };
            default:
                return { wrapper: '', screen: '', notch: false };
        }
    };

    const frame = getDeviceFrame();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex flex-col items-center">
            <div className={`${frame.wrapper} relative`}>
                <div className={`${frame.screen} bg-stone-100 dark:bg-stone-900 overflow-hidden relative`}>
                    {/* Phone notch */}
                    {frame.notch && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-800 dark:bg-stone-700 rounded-b-2xl z-10" />
                    )}

                    {/* Status bar */}
                    <div className="h-8 bg-stone-200 dark:bg-stone-800 flex items-center justify-between px-4 text-xs text-stone-600 dark:text-stone-400">
                        <span>{timeStr}</span>
                        <div className="flex items-center gap-1">
                            <div className="w-4 h-2 border border-current rounded-sm">
                                <div className="w-3/4 h-full bg-current rounded-sm" />
                            </div>
                        </div>
                    </div>

                    {/* App header */}
                    <div className="h-14 bg-gradient-to-r from-orange-500 to-amber-500 flex items-center px-4 gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Megaphone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-bold">Food AI Rescue</p>
                            <p className="text-white/70 text-[10px]">Notifikasi</p>
                        </div>
                    </div>

                    {/* Notification card */}
                    <div className="p-4">
                        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-4 border border-stone-200 dark:border-stone-700">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shrink-0">
                                    <Megaphone className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-stone-900 dark:text-white truncate">
                                        {title || 'Judul Broadcast'}
                                    </h4>
                                    <p className="text-xs text-stone-500">Baru saja • {
                                        target === 'all' ? 'Semua User' :
                                            target === 'provider' ? 'Provider' :
                                                target === 'volunteer' ? 'Relawan' : 'Penerima'
                                    }</p>
                                </div>
                            </div>
                            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                                {content || 'Isi pesan broadcast akan ditampilkan di sini...'}
                            </p>
                            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center">
                                <span className="text-[10px] text-stone-400">Dari: Admin</span>
                                <button className="text-xs text-orange-500 font-bold">Lihat Detail →</button>
                            </div>
                        </div>

                        {/* Older notifications (mock) */}
                        <div className="mt-4 space-y-3 opacity-50">
                            <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-stone-200 dark:bg-stone-700 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-2 w-24 bg-stone-200 dark:bg-stone-700 rounded" />
                                        <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded mt-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-stone-800 rounded-xl p-3 border border-stone-200 dark:border-stone-700">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-stone-200 dark:bg-stone-700 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-2 w-20 bg-stone-200 dark:bg-stone-700 rounded" />
                                        <div className="h-2 w-3/4 bg-stone-100 dark:bg-stone-800 rounded mt-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Laptop base */}
                {(frame as any).hasBase && (
                    <div className="h-10 bg-stone-700 dark:bg-stone-600 rounded-b-xl relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-stone-600 dark:bg-stone-500 rounded-b" />
                    </div>
                )}
            </div>

            <p className="text-xs text-stone-500 mt-3 font-medium">
                {device === 'phone' ? 'Tampilan Mobile' : device === 'tablet' ? 'Tampilan Tablet' : 'Tampilan Desktop'}
            </p>
        </div>
    );
};

export const Communication: React.FC = () => {
    const [broadcastTab, setBroadcastTab] = useState<'compose' | 'history'>('compose');
    const [messages, setMessages] = useState<BroadcastMessage[]>([
        { id: '1', title: 'Update Sistem v2.0', content: 'Kami telah memperbarui sistem poin dan menambahkan fitur baru. Terima kasih atas dukungan Anda!', target: 'all', status: 'sent', sentAt: '20 Feb 2025', readCount: 850 },
        { id: '2', title: 'Maintenance Server', content: 'Server akan mengalami maintenance pada 25 Feb 2025 pukul 02:00-04:00 WIB.', target: 'all', status: 'sent', sentAt: '18 Feb 2025', readCount: 720 },
        { id: '3', title: 'Selamat Hari Raya!', content: 'Selamat Hari Raya Idul Fitri 1446 H. Mohon maaf lahir dan batin. Mari terus berbagi kebaikan!', target: 'all', status: 'sent', sentAt: '10 Mar 2025', readCount: 2340 },
        { id: '4', title: 'Tips Donasi Makanan', content: 'Pastikan makanan yang Anda donasikan masih dalam kondisi baik dan layak konsumsi. Cek tanggal kedaluwarsa sebelum mengirim.', target: 'provider', status: 'sent', sentAt: '5 Feb 2025', readCount: 320 },
        { id: '5', title: 'Misi Baru Area Bandung', content: 'Ada banyak misi pengantaran baru di area Bandung Timur. Segera cek dan ambil misi!', target: 'volunteer', status: 'sent', sentAt: '1 Feb 2025', readCount: 156 },
        { id: '6', title: 'Promo Poin Double', content: 'Minggu ini dapatkan poin 2x lipat untuk setiap klaim makanan. Jangan lewatkan!', target: 'receiver', status: 'sent', sentAt: '28 Jan 2025', readCount: 1890 },
        { id: '7', title: 'Fitur AI Score', content: 'Kami baru saja meluncurkan fitur AI Score untuk membantu Anda memastikan kelayakan makanan. Coba sekarang!', target: 'all', status: 'sent', sentAt: '15 Jan 2025', readCount: 1650 }
    ]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        target: 'all'
    });

    const [selectedDevice, setSelectedDevice] = useState<DeviceType>('phone');
    const [showPreview, setShowPreview] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendBroadcast = async () => {
        if (!formData.title.trim()) {
            alert('Judul broadcast tidak boleh kosong');
            return;
        }
        if (!formData.content.trim()) {
            alert('Isi pesan tidak boleh kosong');
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newMsg: BroadcastMessage = {
            id: Date.now().toString(),
            title: formData.title,
            content: formData.content,
            target: formData.target,
            status: 'sent',
            sentAt: 'Baru saja',
            readCount: 0
        };

        setMessages([newMsg, ...messages]);
        setFormData({ title: '', content: '', target: 'all' });
        setIsSubmitting(false);
        setBroadcastTab('history');
    };

    const insertFormatting = (format: string) => {
        const textarea = document.getElementById('broadcast-content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formData.content.substring(start, end);

        let formattedText = '';
        switch (format) {
            case 'bold':
                formattedText = `**${selectedText || 'teks tebal'}**`;
                break;
            case 'italic':
                formattedText = `_${selectedText || 'teks miring'}_`;
                break;
            case 'link':
                formattedText = `[${selectedText || 'link text'}](url)`;
                break;
            case 'list':
                formattedText = `\n• ${selectedText || 'item list'}`;
                break;
        }

        const newContent = formData.content.substring(0, start) + formattedText + formData.content.substring(end);
        setFormData({ ...formData, content: newContent });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-orange-500" /> Komunikasi Broadcast
                </h2>
            </div>

            <div className="flex gap-2 mb-4 bg-stone-100 dark:bg-stone-900 p-1 rounded-xl w-fit">
                <button onClick={() => setBroadcastTab('compose')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${broadcastTab === 'compose' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>Tulis Pesan</button>
                <button onClick={() => setBroadcastTab('history')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${broadcastTab === 'history' ? 'bg-white dark:bg-stone-800 shadow-sm text-stone-900 dark:text-white' : 'text-stone-500'}`}>Riwayat</button>
            </div>

            {broadcastTab === 'compose' && (
                <div className="flex gap-6 flex-col xl:flex-row">
                    {/* Form Section */}
                    <div className="flex-1 bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                        <div className="space-y-4">
                            <Input
                                label="Judul Broadcast"
                                placeholder="Contoh: Info Pemeliharaan Sistem"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Target Penerima</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { value: 'all', label: 'Semua', icon: '👥' },
                                        { value: 'provider', label: 'Provider', icon: '🏪' },
                                        { value: 'volunteer', label: 'Relawan', icon: '🚴' },
                                        { value: 'receiver', label: 'Penerima', icon: '👤' }
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, target: opt.value })}
                                            className={`p-3 rounded-xl border text-center transition-all ${formData.target === opt.value
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
                                                }`}
                                        >
                                            <div className="text-xl mb-1">{opt.icon}</div>
                                            <p className={`text-xs font-bold ${formData.target === opt.value ? 'text-orange-600' : 'text-stone-500'}`}>
                                                {opt.label}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-stone-600 dark:text-stone-400">Isi Pesan</label>
                                    <div className="flex gap-1">
                                        <button onClick={() => insertFormatting('bold')} className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded" title="Bold">
                                            <Bold className="w-4 h-4 text-stone-500" />
                                        </button>
                                        <button onClick={() => insertFormatting('italic')} className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded" title="Italic">
                                            <Italic className="w-4 h-4 text-stone-500" />
                                        </button>
                                        <button onClick={() => insertFormatting('link')} className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded" title="Link">
                                            <Link className="w-4 h-4 text-stone-500" />
                                        </button>
                                        <button onClick={() => insertFormatting('list')} className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded" title="List">
                                            <List className="w-4 h-4 text-stone-500" />
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    id="broadcast-content"
                                    className="w-full h-40 p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none focus:border-orange-500 text-stone-900 dark:text-stone-200 resize-none"
                                    placeholder="Tulis pesan anda disini..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                                <p className="text-xs text-stone-400">{formData.content.length} karakter</p>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 text-sm text-stone-500 hover:text-orange-500"
                                >
                                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {showPreview ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
                                </button>
                                <Button onClick={handleSendBroadcast} disabled={isSubmitting} className="w-auto">
                                    {isSubmitting ? (
                                        <>Mengirim...</>
                                    ) : (
                                        <><Send className="w-4 h-4 mr-2" /> Kirim Broadcast</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    {showPreview && (
                        <div className="xl:w-auto bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-2">
                                    <Eye className="w-4 h-4" /> Preview
                                </h3>
                                <div className="flex gap-1 bg-white dark:bg-stone-800 p-1 rounded-lg">
                                    {[
                                        { type: 'phone' as DeviceType, icon: Smartphone },
                                        { type: 'tablet' as DeviceType, icon: Tablet },
                                        { type: 'laptop' as DeviceType, icon: Laptop }
                                    ].map(({ type, icon: Icon }) => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedDevice(type)}
                                            className={`p-2 rounded transition-all ${selectedDevice === type
                                                ? 'bg-orange-500 text-white'
                                                : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center overflow-x-auto py-4">
                                <DevicePreview
                                    device={selectedDevice}
                                    title={formData.title}
                                    content={formData.content}
                                    target={formData.target}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {broadcastTab === 'history' && (
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <EmptyState
                            icon={Inbox}
                            title="Belum Ada Pesan"
                            description="Riwayat pesan broadcast yang dikirim akan muncul di sini."
                        />
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-stone-900 dark:text-white">{msg.title}</h4>
                                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded font-bold uppercase">{msg.status}</span>
                            </div>
                            <p className="text-stone-600 dark:text-stone-300 mb-3 whitespace-pre-wrap">{msg.content}</p>
                            <div className="flex justify-between text-xs text-stone-500">
                                <span>Target: {msg.target === 'all' ? 'Semua User' : msg.target}</span>
                                <span>Dibaca: {msg.readCount} users</span>
                                <span>{msg.sentAt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
