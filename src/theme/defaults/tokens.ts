import { DesignTokens } from "@/types";
import { defineToken } from "@/theme";

export const defaultTokens: DesignTokens = {
  colors: {
    blue: {
      300: defineToken("#5EA6ED"),
      400: defineToken("#4799EB"),
      500: defineToken("#1A80E6"),
      600: defineToken("#1773CF"),
    },
    red: {
      300: defineToken("#EB4747"),
      400: defineToken("#E83030"),
      500: defineToken("#E61A1A"),
      600: defineToken("#CF1717"),
    },
    green: {
      300: defineToken("#26D997"),
      400: defineToken("#22C388"),
      500: defineToken("#16A249"),
      600: defineToken("#12875C"),
    },
    amber: {
      300: defineToken("#F7B23B"),
      400: defineToken("#F6A823"),
      500: defineToken("#F59F0A"),
      600: defineToken("#D38909"),
    },
    cyan: {
      300: defineToken("#6CC3EF"),
      400: defineToken("#47B4EB"),
      500: defineToken("#1791CF"),
      600: defineToken("#137BAE"),
    },

    indigo: {
      300: defineToken("#818CF8"),
      400: defineToken("#6366F1"),
      500: defineToken("#4F46E5"),
      600: defineToken("#4338CA"),
    },

    emerald: {
      300: defineToken("#6EE7B7"),
      400: defineToken("#34D399"),
      500: defineToken("#10B981"),
      600: defineToken("#059669"),
    },

    violet: {
      300: defineToken("#A78BFA"),
      400: defineToken("#8B5CF6"),
      500: defineToken("#7C3AED"),
      600: defineToken("#6D28D9"),
    },

    rose: {
      300: defineToken("#FDA4AF"),
      400: defineToken("#FB7185"),
      500: defineToken("#F43F5E"),
      600: defineToken("#E11D48"),
    },

    orange: {
      300: defineToken("#FDBA74"),
      400: defineToken("#FB923C"),
      500: defineToken("#F97316"),
      600: defineToken("#EA580C"),
    },
    gray: {
      50: defineToken("#FAFAFA"),
      100: defineToken("#EBEBEB"),
      200: defineToken("#D9D9D9"),
      300: defineToken("#BDBDBD"),
      400: defineToken("#999999"),
      500: defineToken("#666666"),
      600: defineToken("#4D4D4D"),
      700: defineToken("#333333"),
      800: defineToken("#2E2E2E"),
      900: defineToken("#1F1F1F"),
      950: defineToken("#141414"),
      1000: defineToken("#0A0A0A"),
    },
    white: defineToken("#FFFFFF"),
    black: defineToken("#000000"),
  },
  spacing: {
    1: defineToken("0.25rem"),
    2: defineToken("0.5rem"),
    3: defineToken("0.75rem"),
    4: defineToken("1rem"),
    5: defineToken("1.25rem"),
    6: defineToken("1.5rem"),
    8: defineToken("2rem"),
    10: defineToken("2.5rem"),
    12: defineToken("3rem"),
    16: defineToken("4rem"),
    xs: defineToken("0.25rem"),
    sm: defineToken("0.5rem"),
    md: defineToken("1rem"),
    lg: defineToken("1.5rem"),
    xl: defineToken("2rem"),
  },
  radii: {
    none: defineToken("0"),
    sm: defineToken("0.25rem"),
    md: defineToken("0.5rem"),
    lg: defineToken("0.75rem"),
    xl: defineToken("1rem"),
    full: defineToken("9999px"),
  },
  fonts: {
    body: defineToken("Inter, sans-serif"),
    heading: defineToken("Inter, sans-serif"),
    mono: defineToken("ui-monospace, SFMono-Regular, Menlo, monospace"),
  },
  fontSizes: {
    xs: defineToken("0.75rem"),
    sm: defineToken("0.875rem"),
    md: defineToken("1rem"),
    lg: defineToken("1.125rem"),
    xl: defineToken("1.25rem"),
    "2xl": defineToken("1.5rem"),
    "3xl": defineToken("1.875rem"),
    "4xl": defineToken("2.25rem"),
  },
  fontWeights: {
    normal: defineToken("400"),
    medium: defineToken("500"),
    semibold: defineToken("600"),
    bold: defineToken("700"),
  },
  lineHeights: {
    tight: defineToken("1.25"),
    normal: defineToken("1.5"),
    relaxed: defineToken("1.75"),
  },
  letterSpacings: {
    tighter: defineToken("-0.025em"),
    tight: defineToken("-0.01em"),
    normal: defineToken("0"),
    wide: defineToken("0.025em"),
  },
  animations: {
    spin: defineToken("kui-spin 0.6s linear infinite"),

    "fade-in": defineToken("kui-fade-in 0.15s ease-out"),
    "fade-out": defineToken("kui-fade-out 0.15s ease-in"),

    "scale-in": defineToken("kui-scale-in 0.15s ease-out"),
    "scale-out": defineToken("kui-scale-out 0.15s ease-in"),

    "slide-up": defineToken("kui-slide-up 0.2s ease-out"),
    "slide-down": defineToken("kui-slide-down 0.2s ease-out"),
    "slide-left": defineToken("kui-slide-left 0.2s ease-out"),
    "slide-right": defineToken("kui-slide-right 0.2s ease-out"),
    "slide-in-next": defineToken("kui-slide-in-next 0.2s ease-out"),
    "slide-in-prev": defineToken("kui-slide-in-prev 0.2s ease-out"),

    bounce: defineToken("kui-bounce 0.8s infinite"),
    pulse: defineToken("kui-pulse 1.5s ease-in-out infinite"),
    shake: defineToken("kui-shake 0.25s ease-in-out"),
    shimmer: defineToken("kui-shimmer 1.5s linear infinite"),

    expand: defineToken("kui-expand 0.2s ease-out"),
    collapse: defineToken("kui-collapse 0.2s ease-in"),

    ping: defineToken("kui-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite"),

    "state-error": defineToken("kui-state-error 500ms ease-out 3 500ms"),
    "state-success": defineToken("kui-state-success 500ms ease-out 2 500ms"),
    "state-warning": defineToken("kui-state-warning 500ms ease-out 2 500ms"),
  },
  breakpoints: {
    sm: defineToken("640px"),
    md: defineToken("768px"),
    lg: defineToken("1024px"),
    xl: defineToken("1280px"),
    "2xl": defineToken("1536px"),
  },
};
