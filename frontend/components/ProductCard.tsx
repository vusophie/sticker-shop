"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useState } from "react";
import { StickerPeel } from "@/components/StickerPeel";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [isReleasing, setIsReleasing] = useState(false);
  const href = `/products/${product.slug}`;

  const openProduct = () => {
    setIsReleasing(true);
    window.setTimeout(() => router.push(href), 180);
  };

  return (
    <article
      className="sticker-card"
      data-releasing={isReleasing}
      style={
        {
          "--sticker-accent": product.accent,
          "--sticker-rotation": product.rotation,
        } as CSSProperties
      }
    >
      <div className="sticker-card__surface">
        <Link className="sticker-card__link" href={href}>
          <span className="sticker-card__art" aria-hidden="true">
            <StickerPeel
              onPeelComplete={openProduct}
              peelBackHoverPct={28}
              peelDirection={0}
            >
              <span className={`sticker-card__icon shape-${product.shape}`}>
                {product.sku.slice(-1)}
              </span>
            </StickerPeel>
          </span>
          <span className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="flex flex-wrap items-center justify-center gap-3">
              <span className="badge mono-type">{product.sku}</span>
              <span className="mono-type text-lg font-bold text-[var(--soft-ink)]">
                {product.price}
              </span>
            </span>
            <span>
              <span className="display-type block text-xl leading-tight sm:text-2xl">
                {product.name}
              </span>
              <span className="mx-auto mt-2 block max-w-[14rem] text-sm leading-6 text-[var(--soft-ink)] sm:text-base">
                {product.shortDescription}
              </span>
            </span>
            <span className="mono-type text-sm font-bold text-[var(--cobalt)]">
              Drag sticker to open
            </span>
          </span>
        </Link>
      </div>
    </article>
  );
}
