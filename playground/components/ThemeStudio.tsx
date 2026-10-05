import type { ThemeOverride } from "@/types/theme";
import { TokenEditor } from "./ThemeControls/TokenEditor";
import { SizeEditor } from "./ThemeControls/SizeEditor";
import { ThemePresetManager } from "./ThemeControls/ThemePresetManager";
import { useCallback, useEffect, useRef, useState } from "react";
import { RecipeEditor } from "./ThemeControls/RecipeEditor/RecipeEditor";

interface Props {
  theme: ThemeOverride;
  onChange(theme: ThemeOverride): void;
}

export function ThemeStudio({ theme, onChange }: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const scrolled = rect.top <= 0;
      setIsScrolled(scrolled);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  return (
    <section className=" space-y-8 rounded-lg text-text">
      <header
        ref={headerRef}
        className={`sticky top-0 z-10 transition-colors duration-200 ${isScrolled ? "bg-background" : "bg-transparent"} mb-4 px-4 pt-4 pb-2 border-b border-border`}
      >
        <p className="mb-1 font-mono text-md text-brand uppercase">
          Kreativ UI{" "}
        </p>
        <h1 className="font-medium text-xl">Theme Studio</h1>
        <p className="text-sm text-text-muted">Runtime theme overrides</p>
      </header>
      <div className="p-5 space-y-5">
        <ThemePresetManager theme={theme} onChange={onChange} />

        <div className="border-t border-border pt-6">
          <TokenEditor theme={theme} onChange={onChange} />
        </div>

        <div className="border-t border-border pt-6">
          <SizeEditor theme={theme} onChange={onChange} />
        </div>

        <div className="border-t border-border pt-6">
          <RecipeEditor theme={theme} onChange={onChange} />
          <p className="mt-2 text-xs text-text-muted">
            Raw class overrides — advanced usage, applied on top of everything
            above.
          </p>
        </div>
      </div>
    </section>
  );
}
