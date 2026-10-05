import { SizeToken } from "@/types";

const CSS_SIZE =
  /^-?\d*\.?\d+(px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|fr)$|^(auto|min-content|max-content|fit-content)$/;

const CSS_KEYWORDS = new Set([
  "auto",
  "min-content",
  "max-content",
  "fit-content",
]);

const SIZE_FIELDS = [
  "height",
  "width",
  "paddingX",
  "paddingY",
  "fontSize",
  "gap",
  "iconSize",
  "radius",
] as const;

function isCssKeyword(value: string) {
  return CSS_KEYWORDS.has(value);
}

export function toPx(value: string): number | undefined {
  if (isCssKeyword(value)) return undefined;

  const num = parseFloat(value);

  if (Number.isNaN(num)) return undefined;

  if (value.endsWith("px")) return num;

  if (value.endsWith("rem") || value.endsWith("em")) {
    return num * 16;
  }

  return undefined;
}

export function validateSizeToken(key: string, token: Partial<SizeToken>) {
  SIZE_FIELDS.forEach((field) => {
    const value = token[field];

    if (value === undefined) return;

    if (!CSS_SIZE.test(value)) {
      console.error(
        `[kreativ-ui] Invalid size "${key}.${field}": "${value}" is not a valid CSS size.`,
      );
      return;
    }

    if (isCssKeyword(value)) return;

    const num = parseFloat(value);

    if (num < 0) {
      console.error(
        `[kreativ-ui] Invalid size "${key}.${field}": "${value}" is negative.`,
      );
    }
  });

  if (token.height && token.fontSize) {
    const heightPx = toPx(token.height);
    const fontSizePx = toPx(token.fontSize);

    if (
      heightPx !== undefined &&
      fontSizePx !== undefined &&
      fontSizePx >= heightPx
    ) {
      console.warn(
        `[kreativ-ui] Size "${key}" has conflicting dimensions: ` +
          `height=${token.height} (${heightPx}px), ` +
          `fontSize=${token.fontSize} (${fontSizePx}px).\n` +
          `Font size meets or exceeds the box height — text may clip or overflow.`,
      );
    }
  }
}
