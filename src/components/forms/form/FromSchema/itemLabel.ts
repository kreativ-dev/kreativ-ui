import type * as React from "react";

/**
 * Singularizes a plural label so "Addresses" -> "Address",
 * "Categories" -> "Category", "Boxes" -> "Box". Returns undefined when the
 * label isn't a string or is already singular — in which case ArrayField's
 * own default ("Item") applies.
 */
export function deriveItemLabel(label: React.ReactNode): string | undefined {
  if (typeof label !== "string" || label.length === 0) return undefined;

  if (label.endsWith("ies")) return label.slice(0, -3) + "y";
  if (/(?:s|x|z|ch|sh)es$/i.test(label)) return label.slice(0, -2);
  if (label.endsWith("s") && !label.endsWith("ss")) return label.slice(0, -1);

  return label;
}
