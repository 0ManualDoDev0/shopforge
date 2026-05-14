"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageZoomProps {
  images: string[];
  productName?: string;
}

export default function ProductImageZoom({
  images,
  productName = "Produto",
}: ProductImageZoomProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const src = images[selectedIndex] ?? "/placeholder.png";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted cursor-zoom-in">
        <Image
          src={src}
          alt={`${productName} — imagem ${selectedIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 ease-out hover:scale-150"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                selectedIndex === i
                  ? "border-primary"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
