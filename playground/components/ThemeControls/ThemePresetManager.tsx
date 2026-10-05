import { defineSemanticTokens, defineTokens, extendTheme } from "@/theme";
import type { ThemeOverride } from "@/types/theme";
import { Check } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface Props {
  theme: ThemeOverride;
  onChange(theme: ThemeOverride): void;
}

type Preset = ThemeOverride;

const PRESETS: Record<string, ThemeOverride> = {
  midnight: {
    tokens: {
      colors: {
        indigo: defineTokens({
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
        }),
      },
    },

    semanticTokens: {
      colors: defineSemanticTokens({
        surface: {
          light: "{colors.gray.50}",
          dark: "{colors.gray.950}",
        },
        text: {
          light: "{colors.gray.900}",
          dark: "{colors.gray.50}",
        },
        brand: {
          light: "{colors.indigo.600}",
          dark: "{colors.indigo.400}",
        },
        brandHover: {
          light: "{colors.indigo.500}",
          dark: "{colors.indigo.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },

  emerald: {
    tokens: {
      colors: {
        emerald: defineTokens({
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        }),
      },
    },

    semanticTokens: {
      colors: defineSemanticTokens({
        brand: {
          light: "{colors.emerald.600}",
          dark: "{colors.emerald.400}",
        },
        brandHover: {
          light: "{colors.emerald.500}",
          dark: "{colors.emerald.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },

  ocean: {
    semanticTokens: {
      colors: defineSemanticTokens({
        brand: {
          light: "{colors.blue.600}",
          dark: "{colors.blue.400}",
        },
        brandHover: {
          light: "{colors.blue.500}",
          dark: "{colors.blue.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },

  violet: {
    tokens: {
      colors: {
        violet: defineTokens({
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        }),
      },
    },

    semanticTokens: {
      colors: defineSemanticTokens({
        brand: {
          light: "{colors.violet.600}",
          dark: "{colors.violet.400}",
        },
        brandHover: {
          light: "{colors.violet.500}",
          dark: "{colors.violet.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },

  rose: {
    tokens: {
      colors: {
        rose: defineTokens({
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
        }),
      },
    },

    semanticTokens: {
      colors: defineSemanticTokens({
        brand: {
          light: "{colors.rose.600}",
          dark: "{colors.rose.400}",
        },
        brandHover: {
          light: "{colors.rose.500}",
          dark: "{colors.rose.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },

  amber: {
    semanticTokens: {
      colors: defineSemanticTokens({
        brand: {
          light: "{colors.amber.600}",
          dark: "{colors.amber.400}",
        },
        brandHover: {
          light: "{colors.amber.500}",
          dark: "{colors.amber.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },

  monochrome: {
    semanticTokens: {
      colors: defineSemanticTokens({
        brand: {
          light: "{colors.gray.900}",
          dark: "{colors.gray.100}",
        },
        brandHover: {
          light: "{colors.gray.700}",
          dark: "{colors.gray.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },

  sunset: {
    tokens: {
      colors: {
        orange: defineTokens({
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
        }),
      },
    },

    semanticTokens: {
      colors: defineSemanticTokens({
        brand: {
          light: "{colors.orange.600}",
          dark: "{colors.orange.400}",
        },
        brandHover: {
          light: "{colors.orange.500}",
          dark: "{colors.orange.300}",
        },
        brandFg: {
          light: "{colors.white}",
          dark: "{colors.gray.900}",
        },
      }),
    },
  },
} as const;

type PresetName = keyof typeof PRESETS;

export function ThemePresetManager({ theme, onChange }: Props) {
  const [activeTheme, setActiveTheme] = useState<PresetName | null>(null);

  const presetEntries = useMemo(
    () => Object.entries(PRESETS) as [PresetName, Preset][],
    [],
  );

  const applyPreset = useCallback(
    (name: PresetName) => {
      const preset = PRESETS[name];

      setActiveTheme(name);

      onChange(
        extendTheme({
          ...theme,

          tokens: {
            ...theme.tokens,
            ...preset.tokens,

            colors: {
              ...theme.tokens?.colors,
              ...preset.tokens?.colors,
            },
          },

          semanticTokens: {
            ...theme.semanticTokens,
            ...preset.semanticTokens,

            colors: {
              ...theme.semanticTokens?.colors,
              ...preset.semanticTokens?.colors,
            },
          },
        }),
      );
    },
    [theme, onChange],
  );

  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-mono text-xs uppercase text-text-muted">Presets</h3>

        <p className="mt-1 text-xs text-text-muted">
          Start with a predefined visual direction, then customize it below.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {presetEntries.map(([name]) => {
          const isActive = activeTheme === name;

          return (
            <button
              key={name}
              type="button"
              aria-pressed={isActive}
              onClick={() => applyPreset(name)}
              className={[
                "group relative overflow-hidden rounded-lg border",
                "bg-background text-left",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-md",
                "focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-brand",
                "focus-visible:ring-offset-2",
                isActive
                  ? "border-brand ring-2 ring-brand/20"
                  : "border-border hover:border-brand",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute right-2 top-2 z-1",
                  "flex h-5 w-5 items-center justify-center",
                  "rounded-full bg-brand text-brand-fg",
                  "transition-all duration-200",
                  isActive
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0",
                ].join(" ")}
                aria-hidden="true"
              >
                <Check size={13} strokeWidth={2.5} />
              </span>

              <span className="block p-2">
                <span
                  className={[
                    "relative flex h-20 flex-col overflow-hidden",
                    "rounded-md border border-border",
                    "bg-surface p-2",
                  ].join(" ")}
                >
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-brand" />
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-hover" />
                      <span className="h-2.5 w-2.5 rounded-full bg-brand-fg shadow" />
                    </span>

                    <span className="h-2 w-7 rounded-full bg-text-muted/30" />
                  </span>

                  <span className="mt-auto flex items-end gap-2">
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="h-2 w-3/4 rounded-full bg-text/20" />
                      <span className="h-1.5 w-1/2 rounded-full bg-text-muted/20" />
                    </span>

                    <span className="h-5 w-10 rounded bg-brand">
                      <span className="block h-full w-full rounded bg-brand" />
                    </span>
                  </span>
                </span>
              </span>

              <span
                className={[
                  "flex items-center justify-between",
                  "border-t px-3 py-2.5",
                  isActive ? "border-brand/20 bg-brand/5" : "border-border",
                ].join(" ")}
              >
                <span className="text-sm font-medium capitalize text-text">
                  {name}
                </span>

                <span
                  className={[
                    "text-[10px] font-medium uppercase tracking-wide",
                    "transition-opacity",
                    isActive
                      ? "text-brand opacity-100"
                      : "text-text-muted opacity-0 group-hover:opacity-100",
                  ].join(" ")}
                >
                  {isActive ? "Active" : "Apply"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
