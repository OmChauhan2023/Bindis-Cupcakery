"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { lookupPromo } from "@/lib/promo";

export interface CartCustomization {
  label: string;
  value: string;
}

export interface CartItem {
  id: string;
  cartKey?: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  customizations?: CartCustomization[];
  note?: string;
}

export interface AppliedPromo {
  code: string;
  percent: number;
  label: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (cartKey: string, qty: number) => void;
  removeFromCart: (cartKey: string) => void;
  clearCart: () => void;
  promo: AppliedPromo | null;
  applyPromo: (code: string) => { ok: boolean; message: string };
  clearPromo: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function buildCartKey(item: CartItem): string {
  const sig = JSON.stringify({
    c: item.customizations || [],
    n: item.note || "",
  });
  return `${item.id}::${sig}`;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promo, setPromo] = useState<AppliedPromo | null>(null);

  const addToCart = (item: CartItem) => {
    const cartKey = buildCartKey(item);
    setCart((prev) => {
      const existing = prev.find((c) => c.cartKey === cartKey);
      if (existing) {
        return prev.map((c) =>
          c.cartKey === cartKey ? { ...c, qty: c.qty + item.qty } : c
        );
      }
      return [...prev, { ...item, cartKey }];
    });
  };

  const updateQuantity = (cartKey: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartKey === cartKey ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const removeFromCart = (cartKey: string) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const clearCart = () => {
    setCart([]);
    setPromo(null);
  };

  const applyPromo = (code: string) => {
    const found = lookupPromo(code);
    if (!found) {
      setPromo(null);
      return { ok: false, message: "Invalid code. Try BINDI10" };
    }
    setPromo({ code: found.code, percent: found.percent, label: found.label });
    return { ok: true, message: `🎉 ${found.label} applied!` };
  };

  const clearPromo = () => setPromo(null);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        promo,
        applyPromo,
        clearPromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
