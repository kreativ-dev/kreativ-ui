import ComponentsPlayground from "./components/ComponentsPlayground";
import { useState } from "react";
import { ThemeStudio } from "./components/ThemeStudio";
import { ThemeOverride } from "@splenddev/kreativ-core/types";
import { extendTheme } from "@/theme/extendTheme";
import { KreativUIProvider, PersistMode } from "@/provider";
import { Input } from "@/components";
import { User } from "lucide-react";

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
    <KreativUIProvider
      defaultMode="system"
      fallbackSize="lg"
      theme={theme}
      background="rgb(var(--kui-colors-background, 255 255 255))"
      textColor="rgb(var(--kui-colors-text, 0 0 0))"
    >
      <ThemeStudio
        theme={theme}
        onChange={(nextTheme) => {
          setTheme(extendTheme(nextTheme));
        }}
      />
      <PersistMode />
      <Input startIcon={<User />} endIcon={<User />} size="lg" />
      <ComponentsPlayground />
    </KreativUIProvider>
  );
}
