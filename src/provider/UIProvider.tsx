"use client";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { ThemeContext } from "./ThemeContext";
import { resolveTokens, tokensToCssVars } from "./cssVariables";
import type { ColorMode, ThemeOverride } from "@/types/theme";
import { isDev } from "@/utils/env";
import { extendTheme } from "@/theme";

export interface UIProviderProps {
  children: ReactNode;
  theme?: ThemeOverride;
  defaultMode?: ColorMode;
  as?: keyof JSX.IntrinsicElements;
  fallbackSize?: string;
  themeTransition?: boolean;
  themeTransitionDuration?: number;
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

export function UIProvider({
  children,
  theme: themeOverride,
  defaultMode = "system",
  as = "div",
  fallbackSize = "md",
  themeTransition = true,
  themeTransitionDuration = 300,
}: UIProviderProps) {
  const [mode, setMode] = useState<ColorMode>(defaultMode);
  const [transitioning, setTransitioning] = useState(false);

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

  // Cross-fade logic
  useEffect(() => {
    if (!themeTransition) return;
    setTransitioning(true);
    const timeout = setTimeout(
      () => setTransitioning(false),
      themeTransitionDuration,
    );
    return () => clearTimeout(timeout);
  }, [resolvedMode, themeTransition, themeTransitionDuration]);

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
        data-kui-transitioning={transitioning ? "true" : undefined}
        className={resolvedMode === "dark" ? "dark" : undefined}
        style={{
          ...cssVars,
          ["--kui-theme-transition-duration" as any]: `${themeTransitionDuration}ms`,
        }}
      >
        {children}
      </Tag>
    </ThemeContext.Provider>
  );
}
