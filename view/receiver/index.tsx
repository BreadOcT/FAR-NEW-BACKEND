
import React, { useState } from 'react';
import { FoodItem, SavedItem } from '../../types';
import { FoodList } from './components/FoodList';
import { FoodDetail } from './components/FoodDetail';

interface ReceiverIndexProps {
  onOpenNotifications: () => void;
  onNavigateToHistory: () => void;
  foodItems: FoodItem[];
  savedItems: SavedItem[];
  onToggleSave: (item: FoodItem) => void;
  onClaim: (item: FoodItem, quantity: string) => void;
}

export const ReceiverIndex: React.FC<ReceiverIndexProps> = ({ 
  onOpenNotifications, 
  onNavigateToHistory, 
  foodItems, 
  savedItems,
  onToggleSave,
  onClaim
}) => {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  if (selectedItem) {
      return (
        <FoodDetail 
            item={selectedItem} 
            onBack={() => setSelectedItem(null)} 
            onClaim={(qty) => {
              onClaim(selectedItem, qty);
              setSelectedItem(null);
            }} 
            isSaved={savedItems.some(s => s.id === selectedItem.id)}
            onToggleSave={() => onToggleSave(selectedItem)}
        />
      );
  }

  return (
    <FoodList 
        onOpenNotifications={onOpenNotifications} 
        onSelectItem={setSelectedItem} 
        foodItems={foodItems} 
        savedIds={new Set(savedItems.map(s => s.id))}
        onToggleSave={onToggleSave}
    />
  );
};
