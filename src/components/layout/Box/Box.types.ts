import type { ElementType } from "react";
import type {
  BaseColor,
  BaseProps,
  ColorProps,
  ResponsiveValue,
} from "@splenddev/kreativ-core/types";
import type { RadiusValue, SpaceValue } from "@/types";

export interface BoxProps extends BaseProps {
  /**
   * Element to render.
   * @default "div"
   */
  as?: ElementType;

  /** Padding. Token, pixel number, or raw length. */
  p?: ResponsiveValue<SpaceValue>;
  /** Padding on the inline axis. Overrides `p`. */
  px?: ResponsiveValue<SpaceValue>;
  /** Padding on the block axis. Overrides `p`. */
  py?: ResponsiveValue<SpaceValue>;

  /** Margin. `"auto"` centers on that axis. */
  m?: ResponsiveValue<SpaceValue | "auto">;
  /** Margin on the inline axis. Overrides `m`. */
  mx?: ResponsiveValue<SpaceValue | "auto">;
  /** Margin on the block axis. Overrides `m`. */
  my?: ResponsiveValue<SpaceValue | "auto">;

  /** Background. Token or raw CSS color. */
  bg?: ResponsiveValue<ColorProps<BaseColor> | string>;
  /** Foreground. Token or raw CSS color. */
  color?: ResponsiveValue<ColorProps<BaseColor> | string>;

  /**
   * Border. `true` is a 1px solid line in the default border color.
   * A color paints that line in the given color.
   * @default false
   */
  border?: boolean | ResponsiveValue<ColorProps<BaseColor> | string>;

  /** Corner radius. */
  rounded?: ResponsiveValue<RadiusValue>;

  /** Width. `"full"` is 100%, `"fit"` is max-content. */
  w?: ResponsiveValue<SpaceValue | "auto" | "full" | "fit">;
  /** Height. `"full"` is 100%, `"fit"` is max-content. */
  h?: ResponsiveValue<SpaceValue | "auto" | "full" | "fit">;
}
