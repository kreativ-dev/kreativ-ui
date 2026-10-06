import type { ThemeOverride, Typography } from "@splenddev/kreativ-core/types";
import { defaultTypography } from "../defaults/typography";

type TypographyKeys = Extract<keyof typeof defaultTypography, string>;

export function extendTypography(
  override?: ThemeOverride["typography"],
): Typography {
  if (!override) {
    return { ...defaultTypography };
  }

  const result: Typography = { ...defaultTypography };

  for (const key of Object.keys(override) as TypographyKeys[]) {
    const variant = key as TypographyKeys;

    result[variant] = {
      ...defaultTypography[variant],
      ...override[variant],
    };
  }

  return result;
}
