import {
  containerProgress,
  sceneProgress,
  createStore,
} from "./scrollProgress";
import type {
  ProgressStore,
  ScrollProgress,
  SceneRange,
} from "./ScrollArea.types";

const EPS = 1;
const round = (n: number) => Math.round(n * 10000) / 10000;
const progressEqual = (a: ScrollProgress, b: ScrollProgress) =>
  a.x === b.x && a.y === b.y;

export type StickyEdge = "top" | "bottom" | "left" | "right";
export const STICKY_EDGES: StickyEdge[] = ["top", "bottom", "left", "right"];

export class StickyHandle {
  el: HTMLElement | null = null;
  edges: StickyEdge[] = [];
  offsets: Partial<Record<StickyEdge, number>> = {};
  stuck = "";
  dirty = true;
  onStuckChange?: (stuck: boolean) => void;

  resolve() {
    if (!this.el) return;
    const cs = getComputedStyle(this.el);
    this.offsets = {};
    for (const edge of this.edges) {
      const px = parseFloat(cs[edge]);
      if (!Number.isNaN(px)) this.offsets[edge] = px;
    }
    this.dirty = false;
  }
}

export class SceneHandle implements ProgressStore<number> {
  el: HTMLElement | null = null;
  axis: "x" | "y" = "y";
  range: SceneRange = "through";
  readonly store = createStore(0);

  constructor(private engine: ScrollEngine) {}

  get = (): number => {
    const container = this.engine.el;
    return this.el && container
      ? round(sceneProgress(this.el, container, this.axis, this.range))
      : 0;
  };

  subscribe = (fn: (v: number) => void) => {
    const off = this.store.subscribe(fn);
    this.engine.schedule();
    return off;
  };
}

export class ScrollEngine {
  el: HTMLElement | null = null;

  private trackVars = false;
  private varsDirty = false;
  private offsetsDirty = false;
  private frame = 0;
  private resizeObserver: ResizeObserver | null = null;
  private scenes = new Set<SceneHandle>();
  private stickies = new Set<StickyHandle>();
  private viewport = { w: -1, h: -1 };
  private containerStore = createStore<ScrollProgress>(
    { x: 0, y: 0 },
    progressEqual,
  );

  readonly progress: ProgressStore<ScrollProgress> = {
    get: () => (this.el ? containerProgress(this.el) : { x: 0, y: 0 }),
    subscribe: (fn) => {
      const off = this.containerStore.subscribe(fn);
      this.schedule();
      return off;
    },
  };

  attach(el: HTMLElement) {
    this.el = el;
    this.resizeObserver = new ResizeObserver(() => {
      this.offsetsDirty = true;
      this.syncViewport();
      this.schedule();
    });
    this.resizeObserver.observe(el);

    this.scenes.forEach((s) => s.el && this.resizeObserver!.observe(s.el));
    this.syncViewport();
    this.schedule();
  }

  detach() {
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.el = null;
    this.viewport = { w: -1, h: -1 };
  }

  setTrackProgress(on: boolean) {
    if (this.trackVars === on) return;
    this.trackVars = on;
    if (on) {
      this.varsDirty = true;
    } else {
      this.el?.style.removeProperty("--kui-scroll-x");
      this.el?.style.removeProperty("--kui-scroll-y");
    }
    this.schedule();
  }

  register(scene: SceneHandle) {
    this.scenes.add(scene);
    if (scene.el) this.resizeObserver?.observe(scene.el);
    this.schedule();
    return () => {
      this.scenes.delete(scene);
      if (scene.el) this.resizeObserver?.unobserve(scene.el);
    };
  }

  registerSticky(s: StickyHandle) {
    this.stickies.add(s);
    this.schedule();
    return () => {
      this.stickies.delete(s);
    };
  }

  private isActive() {
    return (
      this.trackVars ||
      this.scenes.size > 0 ||
      this.stickies.size > 0 ||
      this.containerStore.size > 0
    );
  }

  schedule = () => {
    if (this.frame || !this.el || !this.isActive()) return;
    this.frame = requestAnimationFrame(this.flush);
  };

  private syncViewport() {
    const el = this.el;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w === this.viewport.w && h === this.viewport.h) return;
    this.viewport = { w, h };
    el.style.setProperty("--kui-scroll-viewport-width", `${w}px`);
    el.style.setProperty("--kui-scroll-viewport-height", `${h}px`);
  }

  private flush = () => {
    this.frame = 0;
    const el = this.el;
    if (!el) return;

    const c = containerProgress(el);
    const rounded = { x: round(c.x), y: round(c.y) };

    const sceneValues: [SceneHandle, number][] = [];
    this.scenes.forEach((s) => {
      if (s.el)
        sceneValues.push([s, round(sceneProgress(s.el, el, s.axis, s.range))]);
    });

    const stickyStates: [StickyHandle, string][] = [];
    if (this.stickies.size > 0) {
      const cr = el.getBoundingClientRect();
      const portTop = cr.top + el.clientTop;
      const portLeft = cr.left + el.clientLeft;
      const portBottom = portTop + el.clientHeight;
      const portRight = portLeft + el.clientWidth;
      const maxY = el.scrollHeight - el.clientHeight;
      const maxX = el.scrollWidth - el.clientWidth;

      this.stickies.forEach((s) => {
        if (!s.el) return;
        if (s.dirty || this.offsetsDirty) s.resolve();

        const r = s.el.getBoundingClientRect();
        const o = s.offsets;
        const hit: StickyEdge[] = [];

        if (
          o.top !== undefined &&
          Math.abs(r.top - (portTop + o.top)) <= EPS &&
          el.scrollTop > EPS
        )
          hit.push("top");
        if (
          o.bottom !== undefined &&
          Math.abs(r.bottom - (portBottom - o.bottom)) <= EPS &&
          el.scrollTop < maxY - EPS
        )
          hit.push("bottom");
        if (
          o.left !== undefined &&
          Math.abs(r.left - (portLeft + o.left)) <= EPS &&
          el.scrollLeft > EPS
        )
          hit.push("left");
        if (
          o.right !== undefined &&
          Math.abs(r.right - (portRight - o.right)) <= EPS &&
          el.scrollLeft < maxX - EPS
        )
          hit.push("right");

        stickyStates.push([s, hit.join(" ")]);
      });
    }
    this.offsetsDirty = false;

    const changed = this.containerStore.set(rounded);
    if (this.trackVars && (changed || this.varsDirty)) {
      el.style.setProperty("--kui-scroll-x", String(rounded.x));
      el.style.setProperty("--kui-scroll-y", String(rounded.y));
      this.varsDirty = false;
    }

    for (const [s, v] of sceneValues) {
      if (s.store.set(v) && s.el)
        s.el.style.setProperty("--kui-scene-progress", String(v));
    }

    for (const [s, stuck] of stickyStates) {
      if (!s.el || s.stuck === stuck) continue;
      const was = s.stuck !== "";
      s.stuck = stuck;
      if (stuck) s.el.setAttribute("data-stuck", stuck);
      else s.el.removeAttribute("data-stuck");
      if (was !== (stuck !== "")) s.onStuckChange?.(stuck !== "");
    }
  };
}
