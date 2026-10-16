import type { ScrollProgress, SceneRange } from "./ScrollArea.types";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Container progress. Returns 0 on an axis with no overflow (never NaN). */
export function containerProgress(el: HTMLElement): ScrollProgress {
  const maxY = el.scrollHeight - el.clientHeight;
  const maxX = el.scrollWidth - el.clientWidth;
  return {
    x: maxX > 0 ? clamp01(el.scrollLeft / maxX) : 0,
    y: maxY > 0 ? clamp01(el.scrollTop / maxY) : 0,
  };
}

/**
 * Element progress measured against the container's scrollport.
 *  - "through": 0 as the scene's leading edge enters the viewport, 1 as its trailing edge leaves
 *  - "pinned":  0 when the scene's top hits the viewport top, 1 when its bottom hits the viewport bottom
 */
export function sceneProgress(
  scene: HTMLElement,
  container: HTMLElement,
  axis: "x" | "y",
  range: SceneRange
): number {
  const c = container.getBoundingClientRect();
  const s = scene.getBoundingClientRect();
  const vertical = axis === "y";

  const view = vertical ? container.clientHeight : container.clientWidth;
  const size = vertical ? s.height : s.width;
  const offset = vertical
    ? s.top - c.top - container.clientTop
    : s.left - c.left - container.clientLeft;

  if (range === "through") {
    const total = view + size;
    return total > 0 ? clamp01((view - offset) / total) : 0;
  }
  const travel = size - view;
  return travel > 0 ? clamp01(-offset / travel) : 0;
}

export interface Store<T> {
  get(): T;
  /** returns true if the value actually changed */
  set(next: T): boolean;
  subscribe(fn: (value: T) => void): () => void;
  readonly size: number;
}

export function createStore<T>(
  initial: T,
  equals: (a: T, b: T) => boolean = Object.is
): Store<T> {
  let value = initial;
  const listeners = new Set<(v: T) => void>();
  return {
    get: () => value,
    set(next) {
      if (equals(value, next)) return false;
      value = next;
      listeners.forEach((l) => l(next));
      return true;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    get size() {
      return listeners.size;
    },
  };
}
