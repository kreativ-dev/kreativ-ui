import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from "react";
import { ScrollEngine, SceneHandle } from "./ScrollEngine";
import type { ProgressStore, ScrollProgress, SceneRange } from "./ScrollArea.types";

export const ScrollEngineContext = createContext<ScrollEngine | null>(null);

export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useScrollEngine(hookName: string): ScrollEngine {
  const engine = useContext(ScrollEngineContext);
  if (!engine) throw new Error(`${hookName} must be used inside <ScrollArea>`);
  return engine;
}

/** Container progress. Subscribe-based, so it never re-renders anything by itself. */
export function useScrollProgress(): ProgressStore<ScrollProgress> {
  return useScrollEngine("useScrollProgress").progress;
}

export interface ScrollSceneOptions {
  range?: SceneRange; 
  axis?: "x" | "y"; 
}

/** Progress of an element through the surrounding ScrollArea's viewport. */
export function useElementScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { range = "through", axis = "y" }: ScrollSceneOptions = {}
): ProgressStore<number> {
  const engine = useScrollEngine("useElementScrollProgress");
  const [handle] = useState(() => new SceneHandle(engine));

  useIsoLayoutEffect(() => {
    handle.el = ref.current;
    handle.axis = axis;
    handle.range = range;
    return engine.register(handle);
  }, [engine, handle, ref, axis, range]);

  return handle;
}
