import { SpaceValue } from "@/types";

const LENGTH_RE =
  /^[+-]?[\d.]+(px|rem|em|%|vw|vh|vmin|vmax|ch|ex|dvh|svh|lvh)$/i;
const FN_RE = /^[a-z-]+\(/i;
const TOKEN_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i;

export function resolveSpace(
  value: SpaceValue | undefined,
): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "number") return `${value}px`;

  const s = String(value).trim();
  if (LENGTH_RE.test(s) || FN_RE.test(s)) return s;
  if (TOKEN_RE.test(s)) return `var(--kui-spacing-${s})`;
  return s;
}
