import type { ElementType, CSSProperties } from "react";
import type { BaseProps, ResponsiveValue } from "@splenddev/kreativ-core/types";
import { SpaceValue } from "@/types";

export interface FlexProps extends BaseProps {
  /**
   * `display: inline-flex` instead of `flex`.
   * Use when the container should sit in a line of text or shrink to its content.
   * @default false
   */
  inline?: boolean;

  /**
   * `flex-direction`. Main axis of the items.
   * @default "row"
   */
  direction?: ResponsiveValue<CSSProperties["flexDirection"]>;

  /**
   * `flex-wrap`. Whether items stay on one line or wrap onto new lines.
   * @default "nowrap"
   */
  wrap?: ResponsiveValue<CSSProperties["flexWrap"]>;

  /**
   * `align-items`. Alignment on the cross axis.
   * `"stretch"` fills the cross size; `"center"` centers; `"start"` / `"end"` pin to an edge.
   */
  align?: ResponsiveValue<CSSProperties["alignItems"]>;

  /**
   * `justify-content`. Distribution on the main axis.
   * `"between"` pushes the first and last items to the edges; `"center"` groups them in the middle.
   */
  justify?: ResponsiveValue<CSSProperties["justifyContent"]>;

  /**
   * `gap` on both axes. Token (`"sm"`), pixel number (`24`), or raw length (`"24px"`).
   * Overridden per axis by `gapX` / `gapY`.
   */
  gap?: ResponsiveValue<SpaceValue>;

  /**
   * `column-gap`. Space between items on the inline axis.
   * Overrides `gap` for that axis only.
   */
  gapX?: ResponsiveValue<SpaceValue>;

  /**
   * `row-gap`. Space between items on the block axis.
   * Overrides `gap` for that axis only.
   */
  gapY?: ResponsiveValue<SpaceValue>;

  /**
   * `flex-grow`. How much free space this item takes on the main axis.
   * - `true` is `1` (share leftover space).
   * - `false` is `0` (do not grow).
   * - A number, or a responsive map, is passed through.
   */
  grow?: ResponsiveValue<CSSProperties["flexGrow"]> | boolean;

  /**
   * `flex-shrink`. How readily this item gives up space when the line is tight.
   * - `true` is `1` (may shrink; the CSS default).
   * - `false` is `0` (keep its size).
   * - A number, or a responsive map, is passed through.
   */
  shrink?: ResponsiveValue<CSSProperties["flexShrink"]> | boolean;

  /**
   * `flex-basis`. Starting size before free space is distributed.
   * `"auto"` uses the item's width/height. `"0"` ignores content size and shares space by `grow`.
   * Also accepts `"content"`, a length, or a percentage.
   */
  basis?: ResponsiveValue<CSSProperties["flexBasis"]>;

  /** `width: 100%`. */
  fullWidth?: boolean;

  /** `height: 100%`. */
  fullHeight?: boolean;

  /**
   * Element to render.
   * @default "div"
   */
  as?: ElementType;
}
