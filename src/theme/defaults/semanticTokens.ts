import { SemanticTokens } from "@/types";
import { defineToken, defineSemanticToken } from "@/theme";

export const defaultSemanticTokens: SemanticTokens = {
  colors: {
    brand: defineSemanticToken("{colors.blue.500}", "{colors.blue.400}"),

    brandHover: defineSemanticToken("{colors.blue.600}", "{colors.blue.300}"),

    brandFg: defineToken("{colors.white}"),

    background: defineSemanticToken("{colors.gray.50}", "{colors.gray.950}"),

    surface: defineSemanticToken("{colors.white}", "{colors.gray.900}"),

    surfaceRaised: defineSemanticToken("{colors.gray.50}", "{colors.gray.800}"),

    surfaceSunken: defineSemanticToken(
      "{colors.gray.100}",
      "{colors.gray.950}",
    ),

    border: defineSemanticToken("{colors.gray.200}", "{colors.gray.600}"),

    text: defineSemanticToken("{colors.gray.900}", "{colors.gray.50}"),

    textMuted: defineSemanticToken("{colors.gray.500}", "{colors.gray.400}"),

    destructive: defineSemanticToken("{colors.red.500}", "{colors.red.400}"),

    destructiveFg: defineToken("{colors.white}"),

    destructiveHover: defineSemanticToken(
      "{colors.red.600}",
      "{colors.red.300}",
    ),

    success: defineSemanticToken("{colors.green.500}", "{colors.green.400}"),

    successFg: defineToken("{colors.white}"),

    successHover: defineSemanticToken(
      "{colors.green.600}",
      "{colors.green.300}",
    ),

    warning: defineSemanticToken("{colors.amber.500}", "{colors.amber.400}"),

    warningFg: defineToken("{colors.black}"),

    warningHover: defineSemanticToken(
      "{colors.amber.600}",
      "{colors.amber.300}",
    ),

    info: defineSemanticToken("{colors.cyan.500}", "{colors.cyan.400}"),

    infoFg: defineToken("{colors.white}"),

    infoHover: defineSemanticToken("{colors.cyan.600}", "{colors.cyan.300}"),

    shadowColor: defineSemanticToken("{colors.gray.200}", "{colors.gray.600}"),
  },
};
