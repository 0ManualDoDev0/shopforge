"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlistStore";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export default function WishlistButton({ productId, className = "" }: WishlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { ids, load, toggle } = useWishlistStore();

  useEffect(() => {
    if (session?.user) load();
  }, [session, load]);

  const wishlisted = ids.includes(productId);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    await toggle(productId);
    toast.success(
      wishlisted ? "Removido da lista de desejos" : "Adicionado à lista de desejos"
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={wishlisted ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
      className={`flex size-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95 dark:bg-gray-900/80 ${className}`}
    >
      <Heart
        className={`size-4 transition-colors ${
          wishlisted
            ? "fill-red-500 text-red-500"
            : "fill-transparent text-gray-600 dark:text-gray-300"
        }`}
      />
    </button>
  );
}
