import type { ElementType, ReactNode, CSSProperties } from "react";
import type { BaseProps, ResponsiveValue, Size, Orientation } from "@/types";

export interface StackProps extends BaseProps {
  /**
   * Layout direction of the stack.
   * @default "vertical"
   */
  orientation?: Orientation;

  gap?: ResponsiveValue<Size | (string & {})>;

  align?: ResponsiveValue<CSSProperties["alignItems"]>;

  justify?: ResponsiveValue<CSSProperties["justifyContent"]>;

  wrap?: ResponsiveValue<CSSProperties["flexWrap"]>;

  /** Renders between each child. */
  divider?: ReactNode;

  as?: ElementType;

  children?: ReactNode;
}
