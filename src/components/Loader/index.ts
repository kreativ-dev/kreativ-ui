export { Loader } from "./Loader";
export { useLoaderContext } from "./Loader.context";

export { defineSkeleton, resolveSkeleton } from "./defineSkeleton";
export type { SkeletonDefinition, SkeletonResolver } from "./defineSkeleton";

export {
  isKreativComponent,
  tagKuiComponent,
  KUI_COMPONENT_METADATA,
} from "./Loader.types";

export type {
  LoaderRepresentation,
  LoaderAnimation,
  SkeletonShape,
  KuiComponentMetadata,
  KuiComponentSlot,
  LoaderProps,
  LoaderItemProps,
} from "./Loader.types";

export { registerSkeleton } from "@/components/internal/loader/skeletonRegistry";
