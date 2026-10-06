import type {
  DesignTokens,
  ThemeOverride,
  SemanticTokens,
} from "@splenddev/kreativ-core/types";
import { defaultTokens } from "../defaults/tokens";
import { defaultSemanticTokens } from "../defaults/semanticTokens";
import { deepMerge } from "@splenddev/kreativ-core";

export function extendTokens(override?: ThemeOverride["tokens"]): DesignTokens {
  return deepMerge(defaultTokens, override);
}

export function extendSemanticTokens(
  override?: ThemeOverride["semanticTokens"],
): SemanticTokens {
  return deepMerge(defaultSemanticTokens, override);
}
