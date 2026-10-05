import type { SkeletonShape } from "./Loader.types";

export type SkeletonResolver<P = any> = (props: Partial<P>) => SkeletonShape;

export type SkeletonDefinition<P = any> = {
  resolve: SkeletonResolver<P>;
  defaults?: SkeletonShape;
};

/** Identity function for type inference, mirrors defineRecipe's convention. */
export function defineSkeleton<P = any>(
  resolve: SkeletonResolver<P>,
  options?: { defaults?: SkeletonShape },
): SkeletonDefinition<P> {
  return { resolve, defaults: options?.defaults };
}

export function resolveSkeleton<P = any>(
  definition: SkeletonDefinition<P>,
  props: Partial<P>,
): SkeletonShape {
  const resolved = definition.resolve(props);
  return definition.defaults
    ? { ...definition.defaults, ...resolved }
    : resolved;
}
