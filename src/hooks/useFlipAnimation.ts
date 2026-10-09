import * as React from "react";

export function useFlipAnimation<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  deps: React.DependencyList,
) {
  const previousRect = React.useRef<DOMRect | null>(null);
  const animation = React.useRef<Animation | null>(null);

  // Capture position before the dependency-triggered update.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const nextRect = el.getBoundingClientRect();
    const previous = previousRect.current;

    previousRect.current = nextRect;

    if (!previous) return;

    const deltaX = previous.left - nextRect.left;
    const deltaY = previous.top - nextRect.top;

    if (deltaX === 0 && deltaY === 0) return;

    animation.current?.cancel();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    animation.current = el.animate(
      [
        {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`,
        },
        {
          transform: "translate3d(0, 0, 0)",
        },
      ],
      {
        duration: 240,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );

    animation.current.onfinish = () => {
      animation.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  React.useEffect(() => {
    return () => {
      animation.current?.cancel();
    };
  }, []);
}
