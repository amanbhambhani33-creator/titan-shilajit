import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductPack } from '../types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number, selectedPack?: ProductPack) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('titan_cart');
      if (!saved) return [];
      const parsed: CartItem[] = JSON.parse(saved);
      return parsed.map((item) => ({
        ...item,
        id: item.id || (item.selectedPack ? `${item.product.id}-${item.selectedPack.id}` : item.product.id),
      }));
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('titan_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, quantity: number = 1, selectedPack?: ProductPack) => {
    const itemKey = selectedPack ? `${product.id}-${selectedPack.id}` : product.id;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => (item.id || item.product.id) === itemKey);
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity, selectedPack: selectedPack || item.selectedPack }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          product,
          quantity,
          selectedPack,
          selectedSize: selectedPack ? selectedPack.quantityText : product.size,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => (item.id || item.product.id) !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        (item.id || item.product.id) === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => {
    const price = item.selectedPack ? item.selectedPack.price : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
