import type { ElementType, ReactNode, CSSProperties } from "react";
import type { BaseProps, ResponsiveValue, Size } from "@/types";

export interface FlexProps extends BaseProps {
  /** @default "row" */
  direction?: ResponsiveValue<CSSProperties["flexDirection"]>;

  /** @default "nowrap" */
  wrap?: ResponsiveValue<CSSProperties["flexWrap"]>;

  align?: ResponsiveValue<CSSProperties["alignItems"]>;

  justify?: ResponsiveValue<CSSProperties["justifyContent"]>;

  /** Token-based gap, e.g. "sm" | "md" | raw CSS length */
  gap?: ResponsiveValue<Size | (string & {})>;

  as?: ElementType;

  children?: ReactNode;
}
