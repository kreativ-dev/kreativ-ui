import type { SemanticToken, TokenValue } from "@/types";

export function defineToken<T extends TokenValue>(value: T) {
  return {
    value,
  };
}

export function defineTokens<T extends Record<string, TokenValue>>(tokens: T) {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [key, defineToken(value)]),
  ) as {
    [K in keyof T]: ReturnType<typeof defineToken<T[K]>>;
  };
}

/**
 * Defines a semantic token that shares a single value across both light and dark modes.
 */

export function defineSemanticToken<T extends TokenValue>(
  value: T,
): SemanticToken<T>;
export function defineSemanticToken<T extends TokenValue>(
  light: T,
  dark: T,
): SemanticToken<T>;
export function defineSemanticToken<T extends TokenValue>(
  lightOrValue: T,
  dark?: T,
): SemanticToken<T> {
  if (dark === undefined) {
    return {
      value: {
        sameForBothModes: true,
        value: lightOrValue,
      },
    };
  }

  return {
    value: {
      sameForBothModes: false,
      light: lightOrValue,
      dark,
    },
  };
}

type SemanticTokenInput<T extends TokenValue> = T | { light: T; dark: T };

export function defineSemanticTokens<
  T extends Record<string, SemanticTokenInput<TokenValue>>,
>(
  tokens: T,
): {
  [K in keyof T]: SemanticToken<T[K] extends { light: infer V; dark: infer _ }
    ? V extends TokenValue
      ? V
      : never
    : T[K] extends TokenValue
      ? T[K]
      : never>;
} {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, entry]) => [
      key,
      entry !== null &&
      typeof entry === "object" &&
      "light" in entry &&
      "dark" in entry
        ? defineSemanticToken(entry.light, entry.dark)
        : defineSemanticToken(entry as TokenValue),
    ]),
  ) as ReturnType<typeof defineSemanticTokens<T>>;
}