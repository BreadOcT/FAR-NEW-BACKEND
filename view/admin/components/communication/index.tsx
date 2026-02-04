
import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { ComposeMessage } from './ComposeMessage';
import { BroadcastHistory } from './BroadcastHistory';
import { BroadcastMessage } from '../../../../types';

interface CommunicationProps {
    onSendBroadcast?: (message: BroadcastMessage) => void;
}

export const Communication: React.FC<CommunicationProps> = ({ onSendBroadcast }) => {
    const [broadcastTab, setBroadcastTab] = useState<'compose' | 'history'>('compose');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [messages, setMessages] = useState<BroadcastMessage[]>([
        { id: '1', title: 'Update Sistem v2.0', content: 'Kami telah memperbarui sistem poin dan menambahkan fitur baru. Terima kasih atas dukungan Anda!', target: 'all', status: 'sent', sentAt: '20 Feb 2025', readCount: 850 },
        { id: '2', title: 'Maintenance Server', content: 'Server akan mengalami maintenance pada 25 Feb 2025 pukul 02:00-04:00 WIB.', target: 'all', status: 'sent', sentAt: '18 Feb 2025', readCount: 720 },
        { id: '3', title: 'Selamat Hari Raya!', content: 'Selamat Hari Raya Idul Fitri 1446 H. Mohon maaf lahir dan batin. Mari terus berbagi kebaikan!', target: 'all', status: 'sent', sentAt: '10 Mar 2025', readCount: 2340 },
        { id: '4', title: 'Tips Donasi Makanan', content: 'Pastikan makanan yang Anda donasikan masih dalam kondisi baik dan layak konsumsi. Cek tanggal kedaluwarsa sebelum mengirim.', target: 'provider', status: 'sent', sentAt: '5 Feb 2025', readCount: 320 },
        { id: '5', title: 'Misi Baru Area Bandung', content: 'Ada banyak misi pengantaran baru di area Bandung Timur. Segera cek dan ambil misi!', target: 'volunteer', status: 'sent', sentAt: '1 Feb 2025', readCount: 156 },
        { id: '6', title: 'Promo Poin Double', content: 'Minggu ini dapatkan poin 2x lipat untuk setiap klaim makanan. Jangan lewatkan!', target: 'receiver', status: 'sent', sentAt: '28 Jan 2025', readCount: 1890 },
        { id: '7', title: 'Fitur AI Score', content: 'Kami baru saja meluncurkan fitur AI Score untuk membantu Anda memastikan kelayakan makanan. Coba sekarang!', target: 'all', status: 'sent', sentAt: '15 Jan 2025', readCount: 1650 }
    ]);

    const handleSendBroadcast = async (data: { title: string, content: string, target: string }) => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newMsg: BroadcastMessage = {
            id: Date.now().toString(),
            title: data.title,
            content: data.content,
            target: data.target,
            status: 'sent',
            sentAt: 'Baru saja',
            readCount: 0
        };

        setMessages([newMsg, ...messages]);
        
        if (onSendBroadcast) {
            onSendBroadcast(newMsg);
        }

        setIsSubmitting(false);
        setBroadcastTab('history');
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
                <ComposeMessage onSend={handleSendBroadcast} isSubmitting={isSubmitting} />
            )}

            {broadcastTab === 'history' && (
                <BroadcastHistory messages={messages} />
            )}
        </div>
    );
};
