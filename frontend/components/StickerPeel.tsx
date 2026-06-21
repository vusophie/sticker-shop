"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import styles from "./StickerPeel.module.css";

type StickerPeelProps = {
  children: ReactNode;
  className?: string;
  peelDirection?: number;
  peelBackHoverPct?: number;
  isPeeling?: boolean;
  onPeelComplete?: () => void;
};

type StickerPeelStyle = CSSProperties & {
  "--peel-direction": string;
  "--sticker-peelback-hover": string;
};

export function StickerPeel({
  children,
  className,
  peelDirection = 0,
  peelBackHoverPct = 30,
  isPeeling = false,
  onPeelComplete,
}: StickerPeelProps) {
  const startYRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const [dragPct, setDragPct] = useState(peelBackHoverPct);
  const [isDragging, setIsDragging] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  const completePeel = () => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    setIsDragging(false);
    setIsReleased(true);
    window.setTimeout(() => onPeelComplete?.(), 260);
  };

  const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    if (!onPeelComplete || completedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    startYRef.current = event.clientY;
    setIsDragging(true);
    setDragPct(peelBackHoverPct);
  };

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!isDragging || startYRef.current === null) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const distance = Math.abs(event.clientY - startYRef.current);
    const progress = Math.min(distance / 92, 1);
    setDragPct(Math.max(peelBackHoverPct, Math.round(progress * 100)));

    if (progress >= 1) {
      completePeel();
    }
  };

  const handlePointerEnd = (event: PointerEvent<HTMLSpanElement>) => {
    if (!isDragging) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    startYRef.current = null;
    setIsDragging(false);
    setDragPct(peelBackHoverPct);
  };

  return (
    <span
      className={[styles.container, className].filter(Boolean).join(" ")}
      data-dragging={isDragging}
      data-peeling={isPeeling || isDragging}
      data-released={isReleased}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      style={
        {
          "--peel-direction": `${peelDirection}deg`,
          "--sticker-peelback-hover": `${isDragging ? dragPct : peelBackHoverPct}%`,
        } as StickerPeelStyle
      }
    >
      <span className={styles.main}>{children}</span>
      <span aria-hidden="true" className={styles.flap}>
        {children}
      </span>
    </span>
  );
}
