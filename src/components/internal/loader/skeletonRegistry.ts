import type { ComponentType } from "react";
import type { SkeletonDefinition } from "@/components/Loader/defineSkeleton";

/**
 * Maps a component reference to its registered skeleton definition.
 * Exact-identity lookup only. INTERNAL — components call the public
 * `registerSkeleton` re-export from Loader's index, they don't import
 * this module directly.
 */
const registry = new WeakMap<ComponentType<any>, SkeletonDefinition<any>>();

export function registerSkeleton<P>(
  component: ComponentType<P>,
  definition: SkeletonDefinition<P>,
): void {
  registry.set(component, definition);
}

export function getRegisteredSkeleton<P>(
  component: ComponentType<P> | undefined | null,
): SkeletonDefinition<P> | undefined {
  if (!component) return undefined;
  return registry.get(component);
}

export function hasRegisteredSkeleton(
  component: ComponentType<any> | undefined | null,
): boolean {
  return !!component && registry.has(component);
}
