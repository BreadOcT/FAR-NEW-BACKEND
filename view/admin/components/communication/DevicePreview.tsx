
import React from 'react';
import { Megaphone, Smartphone, Tablet, Laptop } from 'lucide-react';

export type DeviceType = 'phone' | 'tablet' | 'laptop';

interface DevicePreviewProps {
    device: DeviceType;
    title: string;
    content: string;
    target: string;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({ device, title, content, target }) => {
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
