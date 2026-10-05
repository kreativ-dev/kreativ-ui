import { LoaderContext } from "./Loader.context";
import { LoaderItem } from "./LoaderItem";
import { LoaderSkeleton } from "./LoaderSkeleton";
import { LoaderFallback } from "./LoaderFallback";
import type { LoaderProps } from "./Loader.types";

function LoaderRoot({
  loading = false,
  representation = "skeleton",
  animation = "pulse",
  children,
}: LoaderProps) {
  return (
    <LoaderContext.Provider value={{ loading, representation, animation }}>
      {children}
    </LoaderContext.Provider>
  );
}

export const Loader = Object.assign(LoaderRoot, {
  Item: LoaderItem,
  Skeleton: LoaderSkeleton,
  Fallback: LoaderFallback,
});
