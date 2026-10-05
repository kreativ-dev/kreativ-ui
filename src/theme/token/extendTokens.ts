import type { DesignTokens, ThemeOverride, SemanticTokens } from "@/types";
import { defaultTokens } from "../defaults/tokens";
import { deepMerge } from "@/utils/deepMerge";
import { defaultSemanticTokens } from "../defaults/semanticTokens";

export function extendTokens(override?: ThemeOverride["tokens"]): DesignTokens {
  return deepMerge(defaultTokens, override);
}

export function extendSemanticTokens(
  override?: ThemeOverride["semanticTokens"],
): SemanticTokens {
  return deepMerge(defaultSemanticTokens, override);
}
