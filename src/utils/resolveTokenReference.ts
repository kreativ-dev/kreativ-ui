import type { DesignTokens } from "@splenddev/kreativ-core/types";

export function resolveTokenReference(
  value: unknown,
  tokens: DesignTokens,
): string | number {
  if (typeof value !== "string") {
    return typeof value === "number" ? value : "";
  }

  const match = value.match(/^\{(.+)\}$/);

  if (!match) {
    return value;
  }

  const path = match[1].split(".");

  let current: unknown = tokens;

  for (const key of path) {
    if (typeof current !== "object" || current === null || !(key in current)) {
      return "";
    }

    current = (current as Record<string, unknown>)[key];
  }

  if (typeof current === "object" && current !== null && "value" in current) {
    const tokenValue = (current as { value: unknown }).value;

    if (typeof tokenValue === "string" || typeof tokenValue === "number") {
      return tokenValue;
    }

    return "";
  }

  return typeof current === "string" || typeof current === "number"
    ? current
    : "";
}
