"use client";

import { useCartStore } from "@/store/cartStore";

export function useCart() {
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = items.length === 0;

  return { items, total, itemCount, isEmpty, addItem, removeItem, updateQuantity, clearCart };
}
