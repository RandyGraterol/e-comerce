import { useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  currency: string;
  quantity: number;
  variant?: string;
  store: 'shein' | 'amazon' | 'aliexpress';
}

const CART_STORAGE_KEY = 'shopping_cart';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    setItems(newItems);
  };

  const addItem = (item: Omit<CartItem, 'id' | 'quantity'>, quantity: number = 1) => {
    const existingItem = items.find(
      i => i.productId === item.productId && i.variant === item.variant
    );

    if (existingItem) {
      const newItems = items.map(i =>
        i.id === existingItem.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      );
      saveCart(newItems);
    } else {
      const newItem: CartItem = {
        ...item,
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        quantity
      };
      saveCart([...items, newItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const newItems = items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const removeItem = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    saveCart(newItems);
  };

  const clearCart = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};
