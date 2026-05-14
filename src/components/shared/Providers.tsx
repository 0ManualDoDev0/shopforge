"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useCartStore } from "@/store/cartStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Manually rehydrate after client mount — cartStore uses skipHydration: true
    // to prevent SSR/client mismatch when localStorage has persisted cart data.
    useCartStore.persist.rehydrate();
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
