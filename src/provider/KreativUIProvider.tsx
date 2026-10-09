"use client";
import { useEffect, useMemo, useState, type JSX, type ReactNode } from "react";
import { isDev } from "@/utils/env";
import {
  ColorMode,
  ThemeContext,
  ThemeOverride,
} from "@splenddev/kreativ-core";
import { extendTheme } from "@/theme";
import { resolveTokens, tokensToCssVars } from "@splenddev/kreativ-core/utils";

export interface UIProviderProps {
  children: ReactNode;
  theme?: ThemeOverride;
  defaultMode?: ColorMode;
  as?: keyof JSX.IntrinsicElements;
  fallbackSize?: string;
  background?: string;
  textColor?: string;
}

function useSystemPrefersDark() {
  const [prefersDark, setPrefersDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersDark;
}

export function KreativUIProvider({
  children,
  theme: themeOverride,
  defaultMode = "system",
  as = "div",
  fallbackSize = "md",
  textColor,
  background,
}: UIProviderProps) {
  const [mode, setMode] = useState<ColorMode>(defaultMode);

  const systemPrefersDark = useSystemPrefersDark();
  const resolvedMode: "light" | "dark" =
    mode === "system" ? (systemPrefersDark ? "dark" : "light") : mode;

  const theme = useMemo(() => extendTheme(themeOverride), [themeOverride]);
  const resolvedTokens = useMemo(
    () => resolveTokens(theme.tokens, theme.semanticTokens, resolvedMode),
    [theme.tokens, theme.semanticTokens, resolvedMode],
  );
  const cssVars = useMemo(
    () => tokensToCssVars(resolvedTokens, resolvedMode, theme.intensity),
    [resolvedTokens, resolvedMode, theme.intensity],
  );

  useEffect(() => {
    if (isDev() && !theme.sizes[fallbackSize]) {
      console.error(
        `[kreativ-ui] fallbackSize="${fallbackSize}" is not a registered size in theme.sizes.`,
      );
    }
  }, [theme.sizes, fallbackSize]);

  const contextValue = useMemo(
    () => ({
      theme,
      mode,
      resolvedMode,
      setMode,
      fallbackSize,
      tokens: resolvedTokens,
    }),
    [theme, mode, resolvedMode, fallbackSize, resolvedTokens],
  );

  const Tag = as as keyof JSX.IntrinsicElements;

  return (
    <ThemeContext.Provider value={contextValue}>
      <Tag
        data-kreativ-theme={resolvedMode}
        className={resolvedMode === "dark" ? "dark" : undefined}
        style={{
          ...cssVars,
          ...(background && { background }),
          ...(textColor && { color: textColor }),
        }}
      >
        {children}
      </Tag>
    </ThemeContext.Provider>
  );
}
