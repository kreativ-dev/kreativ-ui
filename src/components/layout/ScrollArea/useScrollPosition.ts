import { useRef, useState, useCallback, useEffect } from "react";
import type { ScrollEdge, ScrollDirection } from "./ScrollArea.types";

export interface ScrollPositionState {
  hasVerticalOverflow: boolean;
  hasHorizontalOverflow: boolean;
  atTop: boolean;
  atBottom: boolean;
  atLeft: boolean;
  atRight: boolean;
}

interface Options {
  direction: ScrollDirection;
  threshold: number;
  onScrollEnd?: (edge: ScrollEdge) => void;
  /** called at the end of every measure(), the engine piggybacks on this */
  onMeasure?: () => void;
}

const initialState: ScrollPositionState = {
  hasVerticalOverflow: false,
  hasHorizontalOverflow: false,
  atTop: true,
  atBottom: false,
  atLeft: true,
  atRight: false,
};

function statesEqual(a: ScrollPositionState, b: ScrollPositionState) {
  return (
    a.hasVerticalOverflow === b.hasVerticalOverflow &&
    a.hasHorizontalOverflow === b.hasHorizontalOverflow &&
    a.atTop === b.atTop &&
    a.atBottom === b.atBottom &&
    a.atLeft === b.atLeft &&
    a.atRight === b.atRight
  );
}

export function useScrollPosition({ direction, threshold, onScrollEnd, onMeasure }: Options) {
  const elRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<ScrollPositionState>(initialState);
  const stateRef = useRef(state); // shallow-compare without a stale closure

  const onMeasureRef = useRef(onMeasure);
  onMeasureRef.current = onMeasure;

  // edges currently "inside" the onScrollEnd zone, kept out of React state
  const inZone = useRef<Record<ScrollEdge, boolean>>({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });

  const fireIfEntering = useCallback(
    (edge: ScrollEdge, isAtEdge: boolean) => {
      if (isAtEdge && !inZone.current[edge]) {
        inZone.current[edge] = true;
        onScrollEnd?.(edge);
      } else if (!isAtEdge && inZone.current[edge]) {
        inZone.current[edge] = false;
      }
    },
    [onScrollEnd]
  );

  const measure = useCallback(() => {
    const el = elRef.current;
    if (!el) return;

    const hasVerticalOverflow = el.scrollHeight > el.clientHeight;
    const hasHorizontalOverflow = el.scrollWidth > el.clientWidth;

    const wantsVertical = direction === "vertical" || direction === "both";
    const wantsHorizontal = direction === "horizontal" || direction === "both";

    let atTop = true,
      atBottom = false,
      atLeft = true,
      atRight = false;

    if (wantsVertical && hasVerticalOverflow) {
      const distTop = el.scrollTop;
      const distBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
      atTop = distTop <= threshold;
      atBottom = distBottom <= threshold;
      fireIfEntering("top", atTop);
      fireIfEntering("bottom", atBottom);
    }

    if (wantsHorizontal && hasHorizontalOverflow) {
      const distLeft = el.scrollLeft;
      const distRight = el.scrollWidth - el.clientWidth - el.scrollLeft;
      atLeft = distLeft <= threshold;
      atRight = distRight <= threshold;
      fireIfEntering("left", atLeft);
      fireIfEntering("right", atRight);
    }

    const next: ScrollPositionState = {
      hasVerticalOverflow,
      hasHorizontalOverflow,
      atTop: wantsVertical ? atTop : true,
      atBottom: wantsVertical ? atBottom : false,
      atLeft: wantsHorizontal ? atLeft : true,
      atRight: wantsHorizontal ? atRight : false,
    };

    if (!statesEqual(stateRef.current, next)) {
      stateRef.current = next;
      setState(next);
    }

    onMeasureRef.current?.();
  }, [direction, threshold, fireIfEntering]);

  const handleScroll = useCallback(() => measure(), [measure]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    measure();

    // container box size (e.g. responsive maxHeight changes)
    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(el);

    // content growth/shrink inside a fixed-size container: this is what actually
    // catches lazy-loaded items changing scrollHeight
    const mutationObserver = new MutationObserver(() => measure());
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [measure]);

  return { elRef, state, handleScroll, measure };
}
