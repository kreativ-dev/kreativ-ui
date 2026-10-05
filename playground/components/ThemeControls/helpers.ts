import { defineSemanticTokens, defineTokens, extendTheme } from "@/theme";
import type { ThemeOverride } from "@/types/theme";

interface Props {
  theme: ThemeOverride;
  onChange(theme: ThemeOverride): void;
}

function definePreset<
  TColors extends Record<string, Record<string, string>>,
  TSemantic extends Record<string, { light: string; dark: string }>,
>(colors: TColors, semanticTokens: TSemantic): ThemeOverride {
  return {
    tokens: {
      colors: Object.fromEntries(
        Object.entries(colors).map(([name, scale]) => [
          name,
          defineTokens(scale),
        ]),
      ),
    },

    semanticTokens: {
      colors: defineSemanticTokens(semanticTokens),
    },
  };
}
