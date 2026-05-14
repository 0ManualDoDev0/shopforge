"use client";

import { create } from "zustand";

interface WishlistStore {
  ids: string[];
  loaded: boolean;
  loading: boolean;
  load: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
  reset: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  ids: [],
  loaded: false,
  loading: false,

  load: async () => {
    const { loaded, loading } = get();
    if (loaded || loading) return;
    set({ loading: true });
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = (await res.json()) as { ids: string[] };
        set({ ids: data.ids, loaded: true });
      }
    } catch {
      // ignore — will retry on next mount
    } finally {
      set({ loading: false });
    }
  },

  toggle: async (productId) => {
    const wasIn = get().ids.includes(productId);
    // Optimistic update
    set((s) => ({
      ids: wasIn ? s.ids.filter((id) => id !== productId) : [...s.ids, productId],
    }));
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on error
      set((s) => ({
        ids: wasIn ? [...s.ids, productId] : s.ids.filter((id) => id !== productId),
      }));
    }
  },

  isWishlisted: (productId) => get().ids.includes(productId),

  reset: () => set({ ids: [], loaded: false, loading: false }),
}));
