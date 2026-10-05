import { UIProvider, extendTheme, type ThemeOverride } from "../src";
import ComponentsPlayground from "./components/ComponentsPlayground";
import { useState } from "react";
import { ThemeStudio } from "./components/ThemeStudio";

export function App() {
  const [theme, setTheme] = useState<ThemeOverride>(() =>
    extendTheme({
      sizes: {
        xl: {
          height: "4.5rem",
          paddingX: "2.5rem",
          fontSize: "1.125rem",
          gap: "0.75rem",
          radius: "1rem",
          iconSize: "1.5rem",
        },
      },
    }),
  );

  return (
    <UIProvider
      defaultMode="system"
      fallbackSize="lg"
      theme={theme}
      themeTransition
      themeTransitionDuration={100000}
    >
      <div
        style={{
          color: "rgb(var(--kui-text, 0 0 0))",
          background: "rgb(var(--kui-background, 255 255 255))",
        }}
      >
        <ThemeStudio
          theme={theme}
          onChange={(nextTheme) => {
            setTheme(extendTheme(nextTheme));
          }}
        />

        <ComponentsPlayground />
      </div>
    </UIProvider>
  );
}
