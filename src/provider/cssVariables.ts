import type {
  DesignTokens,
  ResolvedTokens,
  SemanticTokens,
  TokenDefinition,
} from "@/types";


export function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function colorToRgbChannels(value: string): string {
  const trimmed = value.trim();


  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)\s*[,\s]\s*(\d+(?:\.\d+)?)(?:\s*[/,]\s*[\d.]+%?)?\s*\)$/i,
  );

  if (rgbMatch) {
    return `${rgbMatch[1]} ${rgbMatch[2]} ${rgbMatch[3]}`;
  }


  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);

    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);

      return `${r} ${g} ${b}`;
    }


    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      return `${r} ${g} ${b}`;
    }
  }


  if (/^\d+(?:\.\d+)?\s+\d+(?:\.\d+)?\s+\d+(?:\.\d+)?$/.test(trimmed)) {
    return trimmed;
  }

  return value;
}

function getTokenValue(
  reference: string,
  tokens: DesignTokens,
): string | number | undefined {
  const path = reference.replace(/^\{/, "").replace(/\}$/, "").split(".");

  let current: unknown = tokens;

  for (const segment of path) {
    if (
      typeof current !== "object" ||
      current === null ||
      !(segment in current)
    ) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  if (typeof current === "object" && current !== null && "value" in current) {
    const value = (current as TokenDefinition).value;

    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
  }

  return undefined;
}


function resolveReference(
  reference: string,
  tokens: DesignTokens,
  seen = new Set<string>(),
): string | undefined {
  if (seen.has(reference)) {
    console.error(
      `[kreativ-ui] Circular token reference detected: ${reference}`,
    );

    return undefined;
  }

  const nextSeen = new Set(seen);
  nextSeen.add(reference);

  const value = getTokenValue(reference, tokens);

  if (value === undefined) {
    console.warn(
      `[kreativ-ui] Unable to resolve token reference: ${reference}`,
    );

    return undefined;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (value.startsWith("{") && value.endsWith("}")) {
    return resolveReference(value, tokens, nextSeen);
  }

  return value;
}


function resolveValue(
  value: unknown,
  tokens: DesignTokens,
): string | undefined {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value !== "string") {
    return undefined;
  }

  if (value.startsWith("{") && value.endsWith("}")) {
    return resolveReference(value, tokens);
  }

  return value;
}


function flattenTokens(
  value: unknown,
  path: string[],
  result: ResolvedTokens,
  tokens: DesignTokens,
): void {
  if (typeof value !== "object" || value === null) {
    return;
  }

  if ("value" in value) {
    const tokenValue = (value as TokenDefinition).value;

    const resolved = resolveValue(tokenValue, tokens);

    if (resolved !== undefined) {
      result[path.join(".")] = resolved;
    }

    return;
  }

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    flattenTokens(child, [...path, key], result, tokens);
  }
}


function resolveSemanticValue(
  value: unknown,
  mode: "light" | "dark",
  tokens: DesignTokens,
): string | undefined {

  if (
    typeof value === "object" &&
    value !== null &&
    "light" in value &&
    "dark" in value
  ) {
    const modeValue = (
      value as {
        light: unknown;
        dark: unknown;
      }
    )[mode];

    return resolveValue(modeValue, tokens);
  }


  return resolveValue(value, tokens);
}

function resolveSemanticTokens(
  semanticTokens: SemanticTokens,
  tokens: DesignTokens,
  mode: "light" | "dark",
): ResolvedTokens {
  const result: ResolvedTokens = {};

  function walk(value: unknown, path: string[]): void {
    if (typeof value !== "object" || value === null) {
      return;
    }

    if ("value" in value) {
      const semanticValue = (value as TokenDefinition).value;

      const resolved = resolveSemanticValue(semanticValue, mode, tokens);

      if (resolved !== undefined) {
        result[path.join(".")] = resolved;
      }

      return;
    }

    for (const [key, child] of Object.entries(
      value as Record<string, unknown>,
    )) {
      walk(child, [...path, key]);
    }
  }

  walk(semanticTokens, []);

  return result;
}


export function resolveTokens(
  tokens: DesignTokens,
  semanticTokens: SemanticTokens,
  mode: "light" | "dark",
): ResolvedTokens {
  const primitiveTokens: ResolvedTokens = {};

  flattenTokens(tokens, [], primitiveTokens, tokens);

  const resolvedSemanticTokens = resolveSemanticTokens(
    semanticTokens,
    tokens,
    mode,
  );


  return {
    ...primitiveTokens,
    ...resolvedSemanticTokens,
  };
}

export function resolveSemanticTokenReferences(
  tokens: DesignTokens,
  semanticTokens: SemanticTokens,
): SemanticTokens {
  function resolveValue(value: unknown, seen = new Set<string>()): unknown {
    if (typeof value === "string") {
      if (!value.startsWith("{") || !value.endsWith("}")) {
        return value;
      }

      if (seen.has(value)) {
        console.error(
          `[kreativ-ui] Circular token reference detected: ${value}`,
        );

        return value;
      }

      const resolved = getTokenValue(value, tokens);

      if (resolved === undefined) {
        console.warn(
          `[kreativ-ui] Unable to resolve token reference: ${value}`,
        );

        return value;
      }

      const nextSeen = new Set(seen);
      nextSeen.add(value);

      return resolveValue(resolved, nextSeen);
    }

    if (Array.isArray(value)) {
      return value.map((item) => resolveValue(item, seen));
    }

    if (typeof value === "object" && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, child]) => [
          key,
          resolveValue(child, seen),
        ]),
      );
    }

    return value;
  }

  return resolveValue(semanticTokens) as SemanticTokens;
}

export function tokensToCssVars(
  tokens: ResolvedTokens,
  mode: "light" | "dark",
  intensity: number,
): Record<string, string> {
  const cssVars: Record<string, string> = {};

  for (const [path, value] of Object.entries(tokens)) {
    const parts = path.split(".");

    const isSemanticColor = parts.length === 2 && parts[0] === "colors";

    const isPrimitiveColor = parts.length >= 3 && parts[0] === "colors";

    const varName = isSemanticColor
      ? `--kui-${toKebabCase(parts[1])}`
      : `--kui-${parts.map(toKebabCase).join("-")}`;

    const outputValue =
      isSemanticColor || isPrimitiveColor ? colorToRgbChannels(value) : value;

    cssVars[varName] = outputValue;
  }

  return {
    ...cssVars,

    "--kui-mode": mode,
    "--kui-intensity": String(intensity),
  };
}
