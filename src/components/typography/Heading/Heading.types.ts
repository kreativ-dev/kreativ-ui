import type { TextProps } from "../Text/Text.types";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps extends Omit<TextProps, "as" | "typography"> {
  level?: HeadingLevel;
  typography?: "heading" | "headingSmall";
}
