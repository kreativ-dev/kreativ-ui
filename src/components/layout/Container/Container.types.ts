import type { ElementType, ReactNode } from "react";
import type { BaseProps, ResponsiveValue, Size } from "@/types";

export interface ContainerProps extends BaseProps {
  /**
   * Max-width of the container, mapped to the Container recipe's `size` variant.
   * @default "lg"
   */
  maxWidth?: Size | (string & {});

  /**
   * Horizontal padding. Token-based (Size) or a raw responsive CSS value.
   */
  padding?: ResponsiveValue<Size | (string & {})>;

  /**
   * Centers the container horizontally via margin-inline: auto.
   * @default true
   */
  centered?: boolean;

  /**
   * Element type to render as.
   * @default "div"
   */
  as?: ElementType;

  children?: ReactNode;
}
