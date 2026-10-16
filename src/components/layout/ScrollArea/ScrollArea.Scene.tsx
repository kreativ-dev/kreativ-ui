"use client";

import { useRef } from "react";

import { composeRefs, createComponent, MotionGatedProps } from "@splenddev/kreativ-core";

import { useElementScrollProgress } from "./useScrollProgress";
import type { ScrollAreaSceneProps } from "./ScrollArea.types";
import { isMotionGated } from "@/utils";

/**
 * Wrapper that publishes its own progress through the ScrollArea as
 * `--kui-scene-progress` (0 → 1), inherited by every descendant.
 *
 * Ref already went to the Tag. createComponent keeps that.
 * motionGated skips the progress subscription; the CSS var stays unset.
 */
export const ScrollAreaScene = createComponent<
  ScrollAreaSceneProps & MotionGatedProps,
  HTMLElement
>({
  displayName: "ScrollArea.Scene",
  __kui: {
    role: "layout",
    skeleton: "preserve",
    groupSlot: "ScrollArea",
    video: {
      id: "scroll-area-scene",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
      motionGated: true,
    },
  },
  render: ({ range, axis, as: Tag = "div", ...rest }, forwardedRef) => {
    const ref = useRef<HTMLElement>(null);
    void isMotionGated(rest);

    useElementScrollProgress(ref, { range, axis });

    return (
      <Tag ref={composeRefs(ref, forwardedRef)} data-kui-scroll-scene {...rest} />
    );
  },
});
