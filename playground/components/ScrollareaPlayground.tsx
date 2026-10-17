"use client";

import { useMemo, useState } from "react";
import { Playground } from "./shared/Playground";
import {
  Checkbox,
  Flex,
  FormField,
  Input,
  ScrollArea,
  ScrollbarVariant,
  ScrollSnap,
  Select,
} from "@/components";
import { getAttrs } from "./shared/getAttributes";

type Direction = "vertical" | "horizontal" | "both";
type ShowScrollbar = "auto" | "always" | "never";
// type Snap = "none" | "proximity" | "mandatory";
type SnapAlign = "start" | "center" | "end";

const ITEMS = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

const SCROLL_AREA_ATTRS = [
  "data-direction",
  "data-fade-top",
  "data-fade-bottom",
  "data-fade-left",
  "data-fade-right",
  "data-snap-align",
  "data-drag-scroll",
];

const BASE_ATTRS_TO_EXCLUDE = [
  "id",
  "aria-invalid",
  "aria-describedby",
  "disabled",
];

const DIRECTIONS: readonly Direction[] = ["vertical", "horizontal", "both"];
const SHOW_SCROLLBAR: readonly ShowScrollbar[] = ["auto", "always", "never"];
const SCROLLBAR_VARIANTS: readonly ScrollbarVariant[] = ["thin", "default"];
const SNAPS: readonly ScrollSnap[] = ["none", "proximity", "mandatory"];
const SNAP_ALIGNS: readonly SnapAlign[] = ["start", "center", "end"];

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <FormField label={label}>
      <FormField.Control>
        <Select
          value={value}
          onValueChange={(v) => onChange(v as T)}
          options={options.map((opt) => ({ value: opt, label: opt }))}
        />
      </FormField.Control>
    </FormField>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormField label={label}>
      <FormField.Control>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormField.Control>
    </FormField>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <FormField label={label}>
      <FormField.Control>
        <Checkbox checked={checked} onCheckedChange={onChange} />
      </FormField.Control>
    </FormField>
  );
}

export function ScrollAreaPlayground() {
  const [direction, setDirection] = useState<Direction>("vertical");
  const [showScrollbar, setShowScrollbar] = useState<ShowScrollbar>("auto");
  const [scrollbarVariant, setScrollbarVariant] =
    useState<ScrollbarVariant>("thin");
  const [snap, setSnap] = useState<ScrollSnap>("none");
  const [snapAlign, setSnapAlign] = useState<SnapAlign>("start");
  const [fadeEdges, setFadeEdges] = useState(true);
  const [fadeSize, setFadeSize] = useState("24px");
  const [dragToScroll, setDragToScroll] = useState(false);
  const [maxHeight, setMaxHeight] = useState("320px");
  const [showSticky, setShowSticky] = useState(true);
  const [showScene, setShowScene] = useState(true);

  const code = useMemo(() => {
    const lines = [
      "<ScrollArea",
      `  direction="${direction}"`,
      `  showScrollbar="${showScrollbar}"`,
      `  scrollbarVariant="${scrollbarVariant}"`,
      `  snap="${snap}"`,
      `  snapAlign="${snapAlign}"`,
      `  fadeEdges={${fadeEdges}}`,
      `  fadeSize="${fadeSize}"`,
      `  maxHeight="${maxHeight}"`,
      dragToScroll ? "  dragToScroll" : null,
      ">",
      showSticky
        ? "  <ScrollArea.Sticky top={0}>Sticky</ScrollArea.Sticky>"
        : null,
      showScene
        ? "  <ScrollArea.Scene>Scene progress</ScrollArea.Scene>"
        : null,
      "  {items}",
      "</ScrollArea>",
    ];
    return lines.filter(Boolean).join("\n");
  }, [
    direction,
    showScrollbar,
    scrollbarVariant,
    snap,
    snapAlign,
    fadeEdges,
    fadeSize,
    maxHeight,
    dragToScroll,
    showSticky,
    showScene,
  ]);

  return (
    <Playground
      title="ScrollArea"
      description="Direction, scrollbar, fade edges, snap, drag-to-scroll, Scene progress, and Sticky."
      attributeSelector="[data-kui-scroll-area]"
      getAttributes={(el) =>
        getAttrs(el, SCROLL_AREA_ATTRS, BASE_ATTRS_TO_EXCLUDE)
      }
      code={code}
      controls={
        <div className="grid gap-3 text-sm">
          <SelectField
            label="direction"
            value={direction}
            onChange={setDirection}
            options={DIRECTIONS}
          />
          <SelectField
            label="showScrollbar"
            value={showScrollbar}
            onChange={setShowScrollbar}
            options={SHOW_SCROLLBAR}
          />
          <SelectField
            label="scrollbarVariant"
            value={scrollbarVariant}
            onChange={setScrollbarVariant}
            options={SCROLLBAR_VARIANTS}
          />
          <SelectField
            label="snap"
            value={snap}
            onChange={setSnap}
            options={SNAPS}
          />
          <SelectField
            label="snapAlign"
            value={snapAlign}
            onChange={setSnapAlign}
            options={SNAP_ALIGNS}
          />
          <TextField label="fadeSize" value={fadeSize} onChange={setFadeSize} />
          <TextField
            label="maxHeight"
            value={maxHeight}
            onChange={setMaxHeight}
          />
          <Flex wrap="wrap" gap="sm" justify="space-between">
            <ToggleField
              label="fadeEdges"
              checked={fadeEdges}
              onChange={setFadeEdges}
            />
            <ToggleField
              label="dragToScroll"
              checked={dragToScroll}
              onChange={setDragToScroll}
            />
            <ToggleField
              label="Sticky"
              checked={showSticky}
              onChange={setShowSticky}
            />
            <ToggleField
              label="Scene"
              checked={showScene}
              onChange={setShowScene}
            />
          </Flex>
        </div>
      }
      preview={
        <ScrollArea
          direction={direction}
          showScrollbar={showScrollbar}
          scrollbarVariant={scrollbarVariant}
          snap={snap}
          snapAlign={snapAlign}
          fadeEdges={fadeEdges}
          fadeSize={fadeSize}
          maxHeight={maxHeight}
          dragToScroll={dragToScroll}
          className="w-full"
        >
          <div
            className={
              direction === "vertical"
                ? "grid gap-3 p-3"
                : "flex w-max gap-3 p-3"
            }
          >
            {showSticky && (
              <ScrollArea.Sticky
                {...(direction === "horizontal"
                  ? { left: 10 }
                  : direction === "vertical"
                    ? { top: 10 }
                    : { top: 10, left: 10 })}
                className="rounded-md bg-kui-text px-3 py-2 text-sm text-kui-surface"
              >
                Sticky
              </ScrollArea.Sticky>
            )}
            {ITEMS.map((item) => (
              <div
                key={item}
                className="min-w-40 rounded-lg border border-kui-border bg-kui-surface p-3 text-sm"
              >
                {item}
              </div>
            ))}
            {showScene && (
              <ScrollArea.Scene className="min-w-48 rounded-lg border border-kui-border p-3 text-sm">
                <p>Scene</p>
                <p className="font-mono text-xs text-kui-text-muted">
                  --kui-scene-progress
                </p>
              </ScrollArea.Scene>
            )}
            {ITEMS.map((item) => (
              <div
                key={`${item}-b`}
                className="min-w-40 rounded-lg border border-kui-border bg-kui-surface p-3 text-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </ScrollArea>
      }
    />
  );
}
