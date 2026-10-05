import { isValidElement, type ComponentType, type ReactNode } from "react";
import type { Theme } from "@/types";
import { getRegisteredSkeleton } from "./skeletonRegistry";
import { generateSkeletonFromProps } from "./generateSkeletonFromProps";
import { resolveSkeleton } from "@/components/Loader/defineSkeleton";
import type {
  LoaderAnimation,
  LoaderRepresentation,
  SkeletonShape,
} from "@/components/Loader/Loader.types";

export type ResolveLoaderRepresentationArgs = {
  component?: ComponentType<any>;
  props?: Record<string, any>;
  explicitSkeleton?: ReactNode | SkeletonShape;
  representation: LoaderRepresentation;
  animation: LoaderAnimation;
  theme: Theme;
};

export type ResolvedRepresentation =
  | { kind: "node"; node: ReactNode; animation: LoaderAnimation }
  | {
      kind: "skeleton-shape";
      shape: SkeletonShape;
      source: "explicit" | "registered" | "generated";
      animation: LoaderAnimation;
    }
  | {
      kind: "fallback";
      representation: LoaderRepresentation;
      animation: LoaderAnimation;
    };

export function resolveLoaderRepresentation({
  component,
  props = {},
  explicitSkeleton,
  representation,
  animation,
  theme,
}: ResolveLoaderRepresentationArgs): ResolvedRepresentation {
  if (explicitSkeleton !== undefined) {
    if (isValidElement(explicitSkeleton)) {
      return { kind: "node", node: explicitSkeleton, animation };
    }
    return {
      kind: "skeleton-shape",
      shape: explicitSkeleton as SkeletonShape,
      source: "explicit",
      animation,
    };
  }

  const registered = getRegisteredSkeleton(component);
  if (registered) {
    const shape = resolveSkeleton(registered, props);
    return { kind: "skeleton-shape", shape, source: "registered", animation };
  }

  const generated = generateSkeletonFromProps(component, props, theme);
  if (generated) {
    return {
      kind: "skeleton-shape",
      shape: generated,
      source: "generated",
      animation,
    };
  }

  return { kind: "fallback", representation, animation };
}
