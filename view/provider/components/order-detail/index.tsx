
import React, { useState } from 'react';
import { ProviderOrder } from '../../../../types';
import { HeaderSection } from './HeaderSection';
import { OrderInfoCard } from './OrderInfoCard';
import { ReceiverInfo } from './ReceiverInfo';
import { CourierInfo } from './CourierInfo';
import { TimelineDetails } from './TimelineDetails';
import { WarningNote } from './WarningNote';
import { ActionBar } from './ActionBar';

interface OrderDetailProps {
    order: ProviderOrder;
    onBack: () => void;
}

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack }) => {
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = () => {
        // Menggunakan timeout agar UI terasa responsif saat di-klik
        setTimeout(() => {
            const code = prompt("Masukkan Kode Unik dari Penerima (Contoh: FAR-1234):");
            
            if (code) {
                if (code.length < 3) {
                    alert("Kode tidak valid. Mohon periksa kembali.");
                    return;
                }

                setIsVerifying(true);
                
                // Simulasi proses verifikasi ke server
                setTimeout(() => {
                    setIsVerifying(false);
                    alert(`✅ Kode ${code} Terverifikasi! Pesanan berhasil diserahterimakan.`);
                    onBack(); 
                }, 1500);
            }
        }, 100);
    };

    const handleCancel = () => {
        if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini akan memberitahu penerima.")) {
            alert("Pesanan telah dibatalkan.");
            onBack();
        }
    };

    const handleContact = (phone: string, name: string, role: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        const text = `Halo ${role} *${name}*, saya dari Donatur Food AI Rescue mengenai pesanan *${order.foodName}*...`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-[#FDFBF7] dark:bg-stone-950 z-[100] overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
            
            <div className="flex-1 overflow-y-auto pb-40">
                <HeaderSection order={order} onBack={onBack} />

                <div className="px-6 space-y-6 -mt-4 relative z-10">
                    <OrderInfoCard orderId={order.id} />

                    <ReceiverInfo 
                        receiver={order.receiver} 
                        onContact={() => handleContact(order.receiver.phone, order.receiver.name, 'Penerima')} 
                    />

                    {order.deliveryMethod !== 'pickup' && order.courier && (
                        <CourierInfo 
                            courier={order.courier} 
                            onContact={() => handleContact(order.courier!.phone, order.courier!.name, 'Relawan')} 
                        />
                    )}

                    <TimelineDetails 
                        timestamps={order.timestamps} 
                        deliveryMethod={order.deliveryMethod} 
                    />

                    <WarningNote />
                </div>
            </div>

            <ActionBar 
                onCancel={handleCancel} 
                onVerify={handleVerify} 
                isVerifying={isVerifying} 
            />
        </div>
    );
};
