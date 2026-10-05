import { useState } from "react";
import { Button } from "@/components/Button/Button";

import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { Playground } from "./shared/Playground";
import { getAttrs } from "./shared/getAttributes";
import { ButtonGroup, ButtonGroupSpacing, Input, InputField } from "@/components";
import { Orientation } from "@/types";

type Size = "sm" | "md" | "lg";

const ORIENTATIONS: Orientation[] = ["horizontal", "vertical"];

const SPACINGS: ButtonGroupSpacing[] = ["none", "sm", "md", "lg"];

const SIZES: Size[] = ["sm", "md", "lg"];

export function ButtonGroupDemo() {
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [size, setSize] = useState<Size>("md");
  const [spacing, setSpacing] = useState<ButtonGroupSpacing>("md");

  const [attached, setAttached] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [overrideButtonSize, setOverrideButtonSize] = useState(false);

  const controls = (
    <>
      <SegmentedControl
        label="orientation"
        value={orientation}
        options={ORIENTATIONS}
        onChange={setOrientation}
      />

      <SegmentedControl
        label="size"
        value={size}
        options={SIZES}
        onChange={setSize}
      />

      {!attached && (
        <SegmentedControl
          label="spacing"
          value={spacing}
          options={SPACINGS}
          onChange={setSpacing}
        />
      )}

      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">flags</p>

        <div className="flex flex-wrap gap-1.5">
          <Chip active={attached} onClick={() => setAttached((v) => !v)}>
            attached
          </Chip>

          <Chip active={showText} onClick={() => setShowText((v) => !v)}>
            Text
          </Chip>

          <Chip active={showLabel} onClick={() => setShowLabel((v) => !v)}>
            Label
          </Chip>

          <Chip
            active={overrideButtonSize}
            onClick={() => setOverrideButtonSize((v) => !v)}
          >
            button size override
          </Chip>
        </div>
      </div>
    </>
  );

  const preview = (
    <ButtonGroup
      orientation={orientation}
      size={size}
      spacing={attached ? "none" : spacing}
      attached={attached}
      aria-label="Search group"
    >
      {showLabel && <ButtonGroup.Label>Search</ButtonGroup.Label>}
      <ButtonGroup.Item>
        <Input placeholder="Search…" />
      </ButtonGroup.Item>

      <Button size={overrideButtonSize ? "lg" : undefined}>Search</Button>

      {showText && <ButtonGroup.Text>Press Enter</ButtonGroup.Text>}
    </ButtonGroup>
  );

  const attrLines = [
    orientation !== "horizontal" && `orientation="${orientation}"`,
    size !== "md" && `size="${size}"`,
    !attached && spacing !== "md" && `spacing="${spacing}"`,
    attached && "attached",
    `aria-label="Search group"`,
    showText && "<ButtonGroup.Text>Press Enter</ButtonGroup.Text>",
    showLabel && "<ButtonGroup.Label>Search</ButtonGroup.Label>",
    overrideButtonSize && '<Button size="lg">Search</Button>',
  ].filter(Boolean) as string[];

  const code = [
    `<ButtonGroup`,
    attrLines
      .filter(
        (line) =>
          !line.startsWith("<ButtonGroup.") &&
          !line.startsWith("<Button size="),
      )
      .map((line) => `  ${line}`)
      .join("\n"),
    `>`,
    showLabel ? `  <ButtonGroup.Label>Search</ButtonGroup.Label>` : "",
    `  <input type="text" placeholder="Search…" className="flex-1 ..." />`,
    overrideButtonSize
      ? `  <Button size="lg">Search</Button>`
      : `  <Button>Search</Button>`,
    showText ? `  <ButtonGroup.Text>Press Enter</ButtonGroup.Text>` : "",
    `</ButtonGroup>`,
  ]
    .filter(Boolean)
    .join("\n");

  const extraAttributes = [
    "role",
    "data-kui-button-group",
    "data-orientation",
    "data-attached",
    "aria-label",
    "aria-labelledby",
  ];

  const excludeAttributes = ["aria-describedby"];

  return (
    <Playground
      title="ButtonGroup"
      description="A composable group for coordinating buttons and inputs, shared sizing, attached layouts, labels, and supporting text."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={(el) => getAttrs(el, extraAttributes, excludeAttributes)}
    />
  );
}
