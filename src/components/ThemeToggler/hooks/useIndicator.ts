import { useCallback, useLayoutEffect, useRef, useState } from "react";

interface IndicatorRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const useIndicator = (activeKey: string, deps: unknown[] = []) => {
  const groupRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [indicatorRect, setIndicatorRect] = useState<IndicatorRect | null>(
    null,
  );

  const measure = useCallback(() => {
    const group = groupRef.current;
    const activeEl = buttonRefs.current.get(activeKey);

    if (!group || !activeEl) return;

    const groupBox = group.getBoundingClientRect();
    const activeBox = activeEl.getBoundingClientRect();

    const style = getComputedStyle(group);

    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;

    setIndicatorRect({
      top: activeBox.top - groupBox.top - borderTop,
      left: activeBox.left - groupBox.left - borderLeft,
      width: activeBox.width,
      height: activeBox.height,
    });
  }, [activeKey]);

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, ...deps]);

  useLayoutEffect(() => {
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return {
    groupRef,
    buttonRefs,
    indicatorRect,
    measure,
  };
};
