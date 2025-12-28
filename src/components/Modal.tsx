"use client";

import { useRef, useState } from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const startY = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);

  if (!open) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const diff = e.touches[0].clientY - startY.current;

    if (diff > 0) {
      setOffset(diff);
    }
  };

  const onTouchEnd = () => {
    if (offset > 120) {
      onClose(); // 🔥 swipe-down close
    }
    setOffset(0);
    startY.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: `translateY(${offset}px)` }}
        className="
          bg-bg w-full md:max-w-lg
          rounded-t-2xl md:rounded-2xl
          p-4 max-h-[80vh] overflow-y-auto
          transition-transform
        "
      >
        {/* drag handle */}
        <div className="w-10 h-1 bg-muted rounded mx-auto mb-2" />
        {children}
      </div>
    </div>
  );
}
