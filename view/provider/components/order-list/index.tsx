
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { ProviderOrder } from '../../../../types';
import { OrderDetail } from '../order-detail';
import { OrderHeader } from './OrderHeader';
import { OrderItemCard } from './OrderItemCard';

interface OrderListProps {
    orders?: ProviderOrder[];
}

export const OrderList: React.FC<OrderListProps> = ({ orders = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<ProviderOrder | null>(null);

  const filteredOrders = orders.filter(order => 
    order.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.receiver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedOrder) {
      return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in">
        <OrderHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {filteredOrders.length === 0 ? (
            <EmptyState 
                icon={ShoppingBag} 
                title="Tidak Ada Pesanan Aktif" 
                description="Semua donasi Anda belum ada yang mengklaim atau sudah selesai didistribusikan."
            />
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders.map(order => (
                    <OrderItemCard 
                        key={order.id} 
                        order={order} 
                        onClick={() => setSelectedOrder(order)} 
                    />
                ))}
            </div>
        )}
    </div>
  );
};
