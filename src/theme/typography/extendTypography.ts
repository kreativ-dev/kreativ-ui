import type { ThemeOverride, Typography } from "@/types";
import { defaultTypography } from "../defaults/typography";

export function extendTypography(
  override?: ThemeOverride["typography"],
): Typography {
  if (!override) {
    return { ...defaultTypography };
  }

  const result: Typography = { ...defaultTypography };

  for (const key of Object.keys(override)) {
    const variant = key as keyof typeof defaultTypography;

    result[variant] = {
      ...defaultTypography[variant],
      ...override[variant],
    };
  }

  return result;
}
