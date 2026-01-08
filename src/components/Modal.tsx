"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

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

  // 🔒 LOCK BACKGROUND SCROLL
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) setOffset(diff);
  };

  const onTouchEnd = () => {
    if (offset > 120) onClose();
    setOffset(0);
    startY.current = null;
  };

  return (
    <div className="fixed inset-0 bottom-20 z-50 dark:bg-black/50 flex items-end justify-center">
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: `translateY(${offset}px)` }}
        className="
          bg-white dark:bg-black w-full md:max-w-lg
          rounded-t-2xl
          max-h-[85vh]
          flex flex-col
          transition-transform
        "
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-muted rounded mx-auto mt-2" />

        {/* Header */}
        <div className="flex  dark:bg-black bg-white items-center justify-between px-4 py-3 border-b">
          <span className="text-sm text-black dark:text-white font-semibold">Comments</span>
          <button title="close" onClick={onClose} className="p-1">
            <X className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 dark:bg-black bg-white overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
