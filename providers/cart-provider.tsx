"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { CartItem, CartProductSnapshot } from "@/lib/types/store";

const CART_STORAGE_KEY = "khaiy-code-cart";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (snapshot: CartProductSnapshot) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  hasProduct: (productId: number) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw) as CartItem[]);
      }
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  function addItem(snapshot: CartProductSnapshot) {
    setItems((current) => {
      if (current.some((item) => item.productId === snapshot.productId)) {
        return current;
      }

      return [
        ...current,
        {
          productId: snapshot.productId,
          quantity: 1,
          addedAt: new Date().toISOString(),
          snapshot,
        },
      ];
    });
  }

  function removeItem(productId: number) {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function hasProduct(productId: number) {
    return items.some((item) => item.productId === productId);
  }

  const value: CartContextValue = {
    items,
    count: items.length,
    subtotal: items.reduce((sum, item) => sum + item.snapshot.price, 0),
    hydrated,
    addItem,
    removeItem,
    clearCart,
    hasProduct,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
