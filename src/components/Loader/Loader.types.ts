import type { ComponentType, ReactNode } from "react";
import type { Size } from "@/types";

/** What shape the loading placeholder takes. */
export type LoaderRepresentation =
  | "skeleton"
  | "spinner"
  | "progress"
  | "empty";

/** How that shape animates. Independent of representation. */
export type LoaderAnimation = "none" | "pulse" | "shimmer";

export type SkeletonShape = {
  rows?: number;
  avatar?:
    | boolean
    | { size?: Extract<Size, "xs" | "sm" | "md">; shape?: "circle" | "square" };
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  gap?: string | number;
};

export const KUI_COMPONENT_METADATA = Symbol("kui.component.metadata");

export type KuiComponentSlot = "icon" | "avatar" | "text";

export type KuiComponentMetadata = {
  name: string;
  usesSizeScale?: boolean;
  slots?: KuiComponentSlot[];
};

export type KuiTaggedComponent<P = any> = ComponentType<P> & {
  [KUI_COMPONENT_METADATA]: KuiComponentMetadata;
};

export function isKreativComponent(
  component: ComponentType<any> | undefined | null,
): component is KuiTaggedComponent {
  return !!component && KUI_COMPONENT_METADATA in (component as object);
}

/**
 * Convenience helper for component authors — tags a component with metadata
 * in one call instead of assigning the symbol key by hand.
 *
 *   tagKuiComponent(Card, { name: "Card", usesSizeScale: true, slots: ["avatar", "text"] })
 */
export function tagKuiComponent<P>(
  component: ComponentType<P>,
  metadata: KuiComponentMetadata,
): void {
  (component as any)[KUI_COMPONENT_METADATA] = metadata;
}

export type LoaderProps = {
  loading?: boolean;
  representation?: LoaderRepresentation;
  animation?: LoaderAnimation;
  children?: ReactNode;
};

export type LoaderItemProps<P = any> = {
  loading?: boolean;
  as?: ComponentType<P>;
  skeleton?: ReactNode | SkeletonShape;
  representation?: LoaderRepresentation;
  animation?: LoaderAnimation;
  children?: ReactNode;
};
