import type { ScrollDirection, ScrollSnapAlign } from "./ScrollArea.types";

export type Axis = "x" | "y";

export const axesFor = (d: ScrollDirection): Axis[] =>
  d === "both" ? ["x", "y"] : d === "horizontal" ? ["x"] : ["y"];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const resolveBehavior = (b?: ScrollBehavior): ScrollBehavior =>
  b ?? (prefersReducedMotion() ? "auto" : "smooth");

/** scrollLeft/scrollTop that puts `child` at `align` inside the container's snapport. */
export function childTarget(
  container: HTMLElement,
  child: HTMLElement,
  axis: Axis,
  align: ScrollSnapAlign
): number {
  const h = axis === "x";
  const c = container.getBoundingClientRect();
  const r = child.getBoundingClientRect();
  const cs = getComputedStyle(container);

  const view = h ? container.clientWidth : container.clientHeight;
  const size = h ? r.width : r.height;
  const rel = h
    ? r.left - c.left - container.clientLeft
    : r.top - c.top - container.clientTop;
  const current = h ? container.scrollLeft : container.scrollTop;
  const max = h ? container.scrollWidth - view : container.scrollHeight - view;

  // scroll-padding shrinks the snapport; "auto" parses to NaN → 0 (px values assumed)
  const padStart = parseFloat(h ? cs.scrollPaddingLeft : cs.scrollPaddingTop) || 0;
  const padEnd = parseFloat(h ? cs.scrollPaddingRight : cs.scrollPaddingBottom) || 0;

  let offsetInView: number;
  if (align === "start") offsetInView = padStart;
  else if (align === "end") offsetInView = view - padEnd - size;
  else offsetInView = padStart + (view - padStart - padEnd - size) / 2;

  return Math.min(Math.max(current + rel - offsetInView, 0), Math.max(max, 0));
}

/** children that actually participate in snapping */
export const snapItems = (el: HTMLElement) =>
  (Array.from(el.children) as HTMLElement[]).filter(
    (c) => !getComputedStyle(c).scrollSnapAlign.startsWith("none")
  );

export function snapToNearest(
  el: HTMLElement,
  direction: ScrollDirection,
  align: ScrollSnapAlign
) {
  const items = snapItems(el);
  if (!items.length) return;
  const opts: ScrollToOptions = { behavior: resolveBehavior() };

  for (const axis of axesFor(direction)) {
    const cur = axis === "x" ? el.scrollLeft : el.scrollTop;
    let best = cur;
    let bestDist = Infinity;
    for (const item of items) {
      const t = childTarget(el, item, axis, align);
      const d = Math.abs(t - cur);
      if (d < bestDist) {
        bestDist = d;
        best = t;
      }
    }
    opts[axis === "x" ? "left" : "top"] = best;
  }
  el.scrollTo(opts);
}
