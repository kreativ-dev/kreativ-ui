import { isValidElement, useMemo, type ElementType } from "react";
import { useTheme } from "@/hooks";
import { resolveLoaderRepresentation } from "@/components/internal/loader/resolveLoaderRepresentation";
import { LoaderSkeleton } from "./LoaderSkeleton";
import { LoaderFallback } from "./LoaderFallback";
import { useLoaderContext } from "./Loader.context";
import type { LoaderItemProps } from "./Loader.types";

export function LoaderItem<P = any>({
  loading: loadingProp,
  as,
  skeleton,
  representation: representationProp,
  animation: animationProp,
  children,
}: LoaderItemProps<P>) {
  const ctx = useLoaderContext();
  const { theme } = useTheme();

  const loading = loadingProp ?? ctx.loading;
  const representation = representationProp ?? ctx.representation;
  const animation = animationProp ?? ctx.animation;

  const { component, componentProps } = useMemo(() => {
    if (as) return { component: as as ElementType, componentProps: {} };
    if (isValidElement(children)) {
      return {
        component: children.type as ElementType,
        componentProps: children.props as Record<string, any>,
      };
    }
    return { component: undefined, componentProps: {} };
  }, [as, children]);

  if (!loading) {
    return <>{children}</>;
  }

  const resolved = resolveLoaderRepresentation({
    component: component as any,
    props: componentProps,
    explicitSkeleton: skeleton,
    representation,
    animation,
    theme,
  });

  switch (resolved.kind) {
    case "node":
      return <>{resolved.node}</>;
    case "skeleton-shape":
      return <LoaderSkeleton {...resolved.shape} animation={animation} />;
    case "fallback":
      return (
        <LoaderFallback
          representation={resolved.representation}
          animation={animation}
        />
      );
  }
}
