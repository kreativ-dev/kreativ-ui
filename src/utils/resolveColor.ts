import type { BaseColor, ColorProps } from "@splenddev/kreativ-core/types";

const RAW_COLOR = /^(#|rgb|hsl|hwb|lab|lch|oklab|oklch|color\(|var\()/i;

function isRawColor(value: string) {
  return (
    RAW_COLOR.test(value) || value === "transparent" || value === "currentColor"
  );
}

/**
 * Token → `var(--kui-color-<token>)`.
 * A hex, `rgb()`, `hsl()`, `var()`, `transparent`, or `currentColor` is returned as-is.
 */
export function resolveColor(
  value: BaseColor | ColorProps<BaseColor> | string,
): string {
  if (typeof value === "string") {
    return isRawColor(value) ? value : `var(--color-kui-${value})`;
  }

  const token = "color" in value ? value.color : value;
  return typeof token === "string" && isRawColor(token)
    ? token
    : `var(--color-kui-${String(token)})`;
}
