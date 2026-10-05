import { useState } from "react";

import {
  ThemeToggler,
  type ThemeTogglerDisplay,
  type ThemeTogglerVariant,
  type ThemeTogglerColor,
} from "@/components/ThemeToggler";

import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { Playground } from "./shared/Playground";

import type { ThemeAnimation, Orientation, Size } from "@/types";

const SIZES: Size[] = ["xs", "sm", "md", "lg", "xl"];

const ORIENTATIONS: Orientation[] = ["horizontal", "vertical"];

const DISPLAYS: ThemeTogglerDisplay[] = ["buttons", "cycle"];

const VARIANTS: ThemeTogglerVariant[] = ["solid", "outline", "ghost", "soft"];

const COLORS: ThemeTogglerColor[] = ["brand", "neutral"];

const TRANSITIONS: ThemeAnimation[] = [
  "none",
  "fade",
  "rotate",
  "slide",
  "scale",
];

export function ThemeTogglerPlayground() {
  const [variant, setVariant] = useState<ThemeTogglerVariant>("ghost");

  const [color, setColor] = useState<ThemeTogglerColor>("brand");

  const [size, setSize] = useState<Size>("sm");

  const [iconOnly, setIconOnly] = useState(false);
  const [allowSystem, setAllowSystem] = useState(false);
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [rounded, setRounded] = useState(false);
  const [unstyled, setUnstyled] = useState(false);

  const [display, setDisplay] = useState<ThemeTogglerDisplay>("buttons");

  const [animated, setAnimated] = useState(false);

  const [transition, setTransition] = useState<ThemeAnimation>("fade");

  const controls = (
    <>
      <SegmentedControl
        label="variant"
        value={variant}
        options={VARIANTS}
        onChange={setVariant}
      />

      <SegmentedControl
        label="color"
        value={color}
        options={COLORS}
        onChange={setColor}
      />

      <SegmentedControl
        label="size"
        value={size}
        options={SIZES}
        onChange={setSize}
      />

      <SegmentedControl
        label="orientation"
        value={orientation}
        options={ORIENTATIONS}
        onChange={setOrientation}
      />

      <SegmentedControl
        label="display"
        value={display}
        options={DISPLAYS}
        onChange={setDisplay}
      />

      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">flags</p>

        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={animated}
            onClick={() => setAnimated((value) => !value)}
          >
            animated
          </Chip>

          <Chip
            active={iconOnly}
            onClick={() => setIconOnly((value) => !value)}
          >
            iconOnly
          </Chip>

          <Chip
            active={allowSystem}
            onClick={() => setAllowSystem((value) => !value)}
          >
            allowSystem
          </Chip>

          <Chip active={rounded} onClick={() => setRounded((value) => !value)}>
            rounded
          </Chip>

          <Chip
            active={unstyled}
            onClick={() => setUnstyled((value) => !value)}
          >
            unstyled
          </Chip>
        </div>
      </div>

      {display === "cycle" && animated && (
        <SegmentedControl
          label="transition"
          value={transition}
          options={TRANSITIONS}
          onChange={setTransition}
        />
      )}
    </>
  );

  const preview = (
    <ThemeToggler
      variant={variant}
      color={color}
      size={size}
      iconOnly={iconOnly}
      allowSystem={allowSystem}
      orientation={orientation}
      rounded={rounded}
      unstyled={unstyled}
      display={display}
      animated={animated}
      transition={
        animated && display === "cycle" && transition !== "none"
          ? { type: transition }
          : undefined
      }
    />
  );

  const attrLines = [
    variant !== "ghost" && `variant="${variant}"`,

    color !== "brand" && `color="${color}"`,

    size !== "sm" && `size="${size}"`,

    iconOnly && "iconOnly",

    allowSystem && "allowSystem",

    orientation !== "horizontal" && `orientation="${orientation}"`,

    rounded && "rounded",

    unstyled && "unstyled",

    display !== "buttons" && `display="${display}"`,

    animated && "animated",

    animated &&
      display === "cycle" &&
      transition !== "none" &&
      `transition={{ type: "${transition}" }}`,
  ].filter(Boolean) as string[];

  const code = [
    "<ThemeToggler",
    attrLines.length ? `\n  ${attrLines.join("\n  ")}\n` : " ",
    "/>",
  ].join("\n");

  return (
    <Playground
      title="ThemeToggler"
      description="Live props against the real component — the readout at the bottom reflects the actual DOM attributes they produced, not a simulation."
      controls={controls}
      preview={preview}
      code={code}
    />
  );
}
