import { memo, useState, useEffect, useRef, useCallback } from "react";
import { RadioGroupPlayground as RadioDemo } from "./RadioGroupPlayground";
import {
  ComboboxDemo,
  MultiSelectDemo,
  SwitchDemo,
} from "./ControlsPlayground";
import { SelectDemo } from "./SelectPlayground";
import { TextareaPlayground } from "./TextareaPlayground";
import { InputDemo } from "./InputDemo";
import { CheckboxDemo } from "./CheckboxDemo";
import { ThemeTogglerPlayground as ThemeToggleDemo } from "./ThemeTogglerPlayground";
import { ButtonPlayground } from "./ButtonPlayground";
import { Chip } from "./shared/Chip";
import { ButtonGroupDemo } from "./ButtonGroupDemo";
import { cn } from "@/utils";
import { FlexPlayground } from "./FlexPlayground";
import { GridPlayground } from "./GridPlayground";
import { CardPlayground } from "./CardPlayground";

const SECTIONS = [
  { key: "card", label: "Card", render: () => <CardPlayground /> },
  { key: "grid", label: "Grid", render: () => <GridPlayground /> },
  {
    key: "layout",
    label: "Layout",
    render: () => <FlexPlayground />,
  },
  {
    key: "theme-toggle",
    label: "Theme Toggle",
    render: () => <ThemeToggleDemo />,
  },
  { key: "button", label: "Button", render: () => <ButtonPlayground /> },
  {
    key: "button-group",
    label: "Button Group",
    render: () => <ButtonGroupDemo />,
  },
  { key: "input", label: "Input", render: () => <InputDemo /> },
  { key: "textarea", label: "Textarea", render: () => <TextareaPlayground /> },
  { key: "select", label: "Select", render: () => <SelectDemo /> },
  { key: "checkbox", label: "Checkbox", render: () => <CheckboxDemo /> },
  { key: "radio", label: "Radio", render: () => <RadioDemo /> },
  { key: "switch", label: "Switch", render: () => <SwitchDemo /> },
  { key: "combobox", label: "Combobox", render: () => <ComboboxDemo /> },
  {
    key: "multiselect",
    label: "MultiSelect",
    render: () => <MultiSelectDemo />,
  },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

export function ComponentsPlayground() {
  const [active, setActive] = useState<SectionKey>("theme-toggle");
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const activeSection = SECTIONS.find((s) => s.key === active)!;

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
    <div className="space-y-8 text-text">
      <header
        ref={headerRef}
        className={`
          sticky top-0 z-10 
          transition-colors duration-200 
          ${isScrolled ? "bg-background" : "bg-transparent"}
          mb-6 pt-4 pb-2 px-4 border-b border-border

        `}
      >
        <p className="mb-1 font-mono text-xs text-brand">kui / playground</p>
        <h1 className="text-xl font-medium">Component Explorer</h1>

        <nav className={cn("flex flex-wrap gap-1.5 pb-4 mt-4")}>
          {SECTIONS.map((s) => (
            <Chip
              key={s.key}
              active={active === s.key}
              onClick={() => setActive(s.key)}
            >
              {s.label}
            </Chip>
          ))}
        </nav>
      </header>
      
      <div className="p-5">{activeSection.render()}</div>
    </div>
  );
}

export default memo(ComponentsPlayground);
