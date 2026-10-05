import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface CardPaginationProps<T> {
  items: T[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  renderCard: (item: T) => React.ReactNode;
  itemLabel?: (item: T, index: number) => string;
}

export function CardPagination<T>({
  items,
  currentIndex,
  onIndexChange,
  renderCard,
  itemLabel,
}: CardPaginationProps<T>) {
  const currentItem = items[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
  }, [currentIndex]);

  const goTo = (index: number) => {
    if (index === currentIndex) return;

    setDirection(index > currentIndex ? "next" : "prev");
    onIndexChange(index);
  };

  const handlePrev = () => {
    if (hasPrev) goTo(currentIndex - 1);
  };

  const handleNext = () => {
    if (hasNext) goTo(currentIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  if (!currentItem) return null;

  return (
    <div
      className="space-y-3"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Item pagination"
    >
      {/* Card */}
      <div className="relative overflow-hidden">
        <div
          key={currentIndex}
          className={cn(
            "will-change-transform",
            direction === "next"
              ? "animate-kui-slide-in-next"
              : "animate-kui-slide-in-prev",
          )}
        >
          {renderCard(currentItem)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={!hasPrev}
            className={cn(
              "flex items-center gap-1 rounded-md border px-2 py-1.5 transition-all",
              hasPrev
                ? "border-border text-text-muted hover:border-brand hover:text-brand"
                : "cursor-not-allowed border-border/50 text-text-muted/50",
            )}
            aria-label="Previous item"
          >
            <ChevronLeft size={14} />
            <span className="font-mono text-xs">Prev</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!hasNext}
            className={cn(
              "flex items-center gap-1 rounded-md border px-2 py-1.5 transition-all",
              hasNext
                ? "border-border text-text-muted hover:border-brand hover:text-brand"
                : "cursor-not-allowed border-border/50 text-text-muted/50",
            )}
            aria-label="Next item"
          >
            <span className="font-mono text-xs">Next</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-text-muted">
            {currentIndex + 1} / {items.length}
          </span>

          {itemLabel && (
            <span className="ml-1 text-xs text-text-muted/70">
              {itemLabel(currentItem, currentIndex)}
            </span>
          )}
        </div>

        {items.length <= 7 && (
          <div className="flex gap-1">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  idx === currentIndex
                    ? "w-5 bg-brand"
                    : "w-1.5 bg-border hover:bg-text-muted/40",
                )}
                aria-label={`Go to item ${idx + 1}`}
                aria-current={idx === currentIndex ? "page" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
