import type { CSSProperties } from "react";
import type { DesignTokens, TypographyStyle } from "@/types";
import { resolveTokenReference } from "@/utils/resolveTokenReference";


export function resolveTypography(
  typography: TypographyStyle | undefined,
  tokens: DesignTokens,
): CSSProperties {
  if (!typography) return {};

  return {
    fontFamily: resolveTokenReference(typography.fontFamily, tokens) as string,
    fontSize: resolveTokenReference(typography.fontSize, tokens) as string,
    fontWeight: resolveTokenReference(typography.fontWeight, tokens),
    lineHeight: resolveTokenReference(typography.lineHeight, tokens),
    letterSpacing: resolveTokenReference(
      typography.letterSpacing,
      tokens,
    ) as string,
  };
}