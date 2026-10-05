import type { ComponentType } from "react";
import type { Theme } from "@/types";
import { isResponsiveValue } from "@/utils/responsive";
import {
  isKreativComponent,
  KUI_COMPONENT_METADATA,
  type SkeletonShape,
} from "@/components/Loader/Loader.types";

/**
 * Automatic generation — only ever runs for components tagged via
 * tagKuiComponent/KUI_COMPONENT_METADATA at definition time. No component
 * qualifies by prop-shape alone. INTERNAL to the Loader resolution pipeline.
 */
export function generateSkeletonFromProps(
  component: ComponentType<any> | undefined,
  props: Record<string, any>,
  theme: Theme,
): SkeletonShape | null {
  if (!isKreativComponent(component)) return null;

  const metadata = component[KUI_COMPONENT_METADATA];

  const sizeKey = isResponsiveValue(props.size) ? props.size.base : props.size;
  const sizeToken =
    metadata.usesSizeScale && sizeKey && theme.sizes[sizeKey]
      ? theme.sizes[sizeKey]
      : theme.sizes.md;

  if (!sizeToken) return null;

  const shape: SkeletonShape = {
    height: sizeToken.height,
    radius: sizeToken.radius,
    width: props.fullWidth ? "100%" : (sizeToken.width ?? 160),
  };

  if (metadata.slots?.includes("icon") || metadata.slots?.includes("avatar")) {
    shape.avatar = { size: "sm", shape: "square" };
  }
  if (metadata.slots?.includes("text")) {
    shape.rows = 1;
  }

  return shape;
}
