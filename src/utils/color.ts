const HEX_RE = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

/**
 * Converts an RGB colour string to a 6‑digit uppercase hex string.
 * Supports the following input formats:
 * - Hex: `"#fff"`, `"#FFFFFF"`
 * - CSS rgb/rgba: `"rgb(255, 0, 0)"`, `"rgba(255, 0, 0, 0.5)"`
 * - Space‑separated numbers: `"255 0 0"`
 * - Comma‑separated numbers: `"255,0,0"`
 *
 * @param value - The colour string to convert.
 * @returns A 6‑digit uppercase hex string (e.g. `"#FF0000"`).
 *          If the input cannot be parsed, returns `"#000000"`.
 */
export function rgbToHex(value: string): string {
  const trimmed = value.trim();

  if (HEX_RE.test(trimmed)) {
    if (
      trimmed.length === 4 ||
      (trimmed.length === 3 && !trimmed.startsWith("#"))
    ) {
      const clean = trimmed.replace("#", "");
      const expanded = clean
        .split("")
        .map((ch) => ch + ch)
        .join("");
      return `#${expanded.toUpperCase()}`;
    }
    return trimmed.startsWith("#")
      ? trimmed.toUpperCase()
      : `#${trimmed.toUpperCase()}`;
  }

  const stripped = trimmed
    .replace(/^rgba?\(/i, "")
    .replace(/\)$/, "")
    .trim();

  const parts = stripped.split(/[\s,]+/).filter(Boolean);

  const numbers = parts
    .slice(0, 3)
    .map((p) => {
      const cleaned = p.replace(/%$/, "");
      return Number(cleaned);
    })
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 255);

  if (numbers.length !== 3) {
    return "#000000";
  }

  const hex = numbers
    .map((n) => Math.round(n).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  return `#${hex}`;
}

export function hexToRgbString(hex: string): string | null {
  if (!HEX_RE.test(hex)) return null;

  const full =
    hex.length === 4 ? "#" + [...hex.slice(1)].map((c) => c + c).join("") : hex;

  const r = parseInt(full.slice(1, 3), 16);
  const g = parseInt(full.slice(3, 5), 16);
  const b = parseInt(full.slice(5, 7), 16);

  return `${r} ${g} ${b}`;
}
