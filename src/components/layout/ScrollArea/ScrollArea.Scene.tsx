import { forwardRef, useRef } from "react";
import { useElementScrollProgress } from "./useScrollProgress";
import type { ScrollAreaSceneProps } from "./ScrollArea.types";
import { composeRefs } from "@splenddev/kreativ-core";

/**
 * Wrapper that publishes its own progress through the ScrollArea as
 * `--kui-scene-progress` (0 → 1), inherited by every descendant.
 */
export const ScrollAreaScene = forwardRef<HTMLElement, ScrollAreaSceneProps>(
  function ScrollAreaScene({ range, axis, as: Tag = "div", ...rest }, forwardedRef) {
    const ref = useRef<HTMLElement>(null);
    useElementScrollProgress(ref, { range, axis });
    return <Tag ref={composeRefs(ref, forwardedRef)} data-kui-scroll-scene {...rest} />;
  }
);
