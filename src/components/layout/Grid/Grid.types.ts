import type { ElementType, ReactNode, CSSProperties } from "react";
import type { BaseProps, ResponsiveValue, Size } from "@/types";

export interface GridProps extends BaseProps {
  /**
   * Shorthand for equal-width columns, e.g. `columns={3}` → repeat(3, 1fr).
   * Ignored if `templateColumns` is set.
   */
  columns?: ResponsiveValue<number>;

  /** Raw escape hatch for gridTemplateColumns, e.g. "200px 1fr 1fr". */
  templateColumns?: ResponsiveValue<string>;

  /** Raw escape hatch for gridTemplateRows. */
  templateRows?: ResponsiveValue<string>;

  /** Raw escape hatch for gridTemplateAreas. Not responsive — rarely varies by breakpoint. */
  templateAreas?: string;

  gap?: ResponsiveValue<Size | (string & {})>;
  columnGap?: ResponsiveValue<Size | (string & {})>;
  rowGap?: ResponsiveValue<Size | (string & {})>;

  align?: ResponsiveValue<CSSProperties["alignItems"]>;
  justify?: ResponsiveValue<CSSProperties["justifyContent"]>;

  as?: ElementType;
  children?: ReactNode;
}
