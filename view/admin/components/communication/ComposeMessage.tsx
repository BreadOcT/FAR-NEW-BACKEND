
import React, { useState } from 'react';
import { Bold, Italic, Link, List, Send, Eye, EyeOff, Smartphone, Tablet, Laptop } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { DevicePreview, DeviceType } from './DevicePreview';

interface ComposeMessageProps {
    onSend: (data: { title: string, content: string, target: string }) => Promise<void>;
    isSubmitting: boolean;
}

export const ComposeMessage: React.FC<ComposeMessageProps> = ({ onSend, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        target: 'all'
    });
    const [selectedDevice, setSelectedDevice] = useState<DeviceType>('phone');
    const [showPreview, setShowPreview] = useState(true);

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

    const handleSend = () => {
        if (!formData.title.trim()) {
            alert('Judul broadcast tidak boleh kosong');
            return;
        }
        if (!formData.content.trim()) {
            alert('Isi pesan tidak boleh kosong');
            return;
        }
        onSend(formData).then(() => {
            // Optional: reset form or handle externally
            setFormData({ title: '', content: '', target: 'all' });
        });
    };

    return (
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
                        <Button onClick={handleSend} disabled={isSubmitting} className="w-auto">
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
    );
};
