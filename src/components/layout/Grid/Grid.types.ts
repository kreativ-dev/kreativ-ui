import type { ElementType, CSSProperties } from "react";
import type {
  BaseProps,
  ResponsiveValue,
  Size,
} from "@splenddev/kreativ-core/types";
import type { SpaceValue } from "@/types";

export interface GridProps extends BaseProps {
  /**
   * Equal columns. `columns={3}` is `repeat(3, minmax(0, 1fr))`.
   * Do not combine with `minChildWidth` or `templateColumns`.
   */
  columns?: ResponsiveValue<number>;

  /**
   * Wrap columns to the container. `minChildWidth="200px"` is
   * `repeat(auto-fit, minmax(200px, 1fr))`.
   * Do not combine with `columns` or `templateColumns`.
   */
  minChildWidth?: ResponsiveValue<Size | (string & {})>;

  /**
   * Raw `grid-template-columns`. Wins over `columns` and `minChildWidth`.
   */
  templateColumns?: ResponsiveValue<string>;

  /** Raw `grid-template-rows`. */
  templateRows?: ResponsiveValue<string>;

  /**
   * Raw `grid-template-areas`.
   * Not responsive. Areas rarely change by breakpoint.
   */
  templateAreas?: string;

  /**
   * `grid-auto-flow`. `"row dense"` packs holes.
   */
  autoFlow?: ResponsiveValue<CSSProperties["gridAutoFlow"]>;

  /**
   * `gap` on both axes. Token, pixel number, or raw length.
   * Overridden per axis by `gapX` / `gapY`.
   */
  gap?: ResponsiveValue<SpaceValue>;

  /** `column-gap`. Overrides `gap` on the inline axis. */
  gapX?: ResponsiveValue<SpaceValue>;

  /** `row-gap`. Overrides `gap` on the block axis. */
  gapY?: ResponsiveValue<SpaceValue>;

  /** `align-items`. Alignment inside the cell, on the block axis. */
  align?: ResponsiveValue<CSSProperties["alignItems"]>;

  /** `justify-items`. Alignment inside the cell, on the inline axis. */
  justifyItems?: ResponsiveValue<CSSProperties["justifyItems"]>;

  /**
   * `display: inline-grid` instead of `grid`.
   * @default false
   */
  inline?: boolean;

  /**
   * Element to render.
   * @default "div"
   */
  as?: ElementType;
}

export interface GridItemProps extends BaseProps {
  /**
   * `grid-column`. A number is `span <n>`. `"full"` is `1 / -1`.
   */
  span?: ResponsiveValue<number | "full">;

  /**
   * `grid-row`. A number is `span <n>`. `"full"` is `1 / -1`.
   */
  rowSpan?: ResponsiveValue<number | "full">;

  /**
   * Element to render.
   * @default "div"
   */
  as?: ElementType;
}
