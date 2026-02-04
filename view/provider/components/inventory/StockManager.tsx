
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { EmptyState } from '../../../common/EmptyState';
import { FoodItem } from '../../../../types';
import { QualityCheckInventory } from '../QualityCheckInventory';
import { ProductDetailModal } from './ProductDetailModal';
import { StockItemCard } from './StockItemCard';
import { StockHeader } from './StockHeader';
import { StockFilters } from './StockFilters';
import { StockPagination } from './StockPagination';

interface StockManagerProps {
    foodItems: FoodItem[];
    setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>;
}

export const StockManager: React.FC<StockManagerProps> = ({ foodItems, setFoodItems }) => {
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<FoodItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const handleAddNewItem = (newItem: FoodItem) => {
        setFoodItems([newItem, ...foodItems]);
        setIsAddingNew(false);
    };

    const filteredItems = foodItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    if (isAddingNew) {
        return (
            <QualityCheckInventory 
                onBack={() => setIsAddingNew(false)} 
                onSuccess={handleAddNewItem} 
            />
        );
    }

    if (selectedProduct) {
        return (
            <ProductDetailModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
            />
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-left-4">
            <StockHeader onAddNew={() => setIsAddingNew(true)} />
            
            <StockFilters 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                layoutMode={layoutMode} 
                setLayoutMode={setLayoutMode} 
            />
            
            {currentItems.length === 0 ? (
                <EmptyState 
                    icon={Package} 
                    title="Inventory Kosong" 
                    description="Mulai publikasikan donasi makanan pertama Anda hari ini."
                    actionLabel="Tambah Donasi"
                    onAction={() => setIsAddingNew(true)}
                />
            ) : (
                <>
                    <div className={`grid gap-3 md:gap-5 ${layoutMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                        {currentItems.map(item => (
                            <StockItemCard 
                                key={item.id} 
                                item={item} 
                                layoutMode={layoutMode} 
                                onClick={() => setSelectedProduct(item)} 
                            />
                        ))}
                    </div>

                    {filteredItems.length > itemsPerPage && (
                        <StockPagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            setCurrentPage={setCurrentPage} 
                            indexOfFirstItem={indexOfFirstItem} 
                            indexOfLastItem={indexOfLastItem} 
                            totalItems={filteredItems.length} 
                        />
                    )}
                </>
            )}
        </div>
    );
};
