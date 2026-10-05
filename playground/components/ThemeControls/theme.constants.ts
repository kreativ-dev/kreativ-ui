import { SizeToken } from "@/types";

export const COLOR_KEYS = [
  "brand",
  "brandHover",
  "brandFg",
  "surface",
  "surfaceRaised",
  "surfaceSunken",
  "border",
  "text",
  "textMuted",
  "destructive",
  "destructiveFg",
  "destructiveHover",
  "success",
  "successFg",
  "successHover",
  "warning",
  "warningFg",
  "warningHover",
  "info",
  "infoFg",
  "infoHover",
] as const;

export type ColorKey = (typeof COLOR_KEYS)[number];

export const COLOR_GROUPS: {
  name: string;
  keys: readonly ColorKey[];
}[] = [
  { name: "Brand", keys: ["brand", "brandHover", "brandFg"] },
  {
    name: "Surface",
    keys: ["surface", "surfaceRaised", "surfaceSunken", "border"],
  },
  { name: "Text", keys: ["text", "textMuted"] },
  {
    name: "Destructive",
    keys: ["destructive", "destructiveFg", "destructiveHover"],
  },
  { name: "Success", keys: ["success", "successFg", "successHover"] },
  { name: "Warning", keys: ["warning", "warningFg", "warningHover"] },
  { name: "Info", keys: ["info", "infoFg", "infoHover"] },
];

export const SIZE_KEYS = [
  "height",
  "paddingX",
  "fontSize",
  "gap",
  "iconSize",
  "radius",
  "width"
] as const satisfies readonly (keyof SizeToken)[];
