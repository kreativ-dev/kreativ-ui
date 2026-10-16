"use client";

import { useMemo, useState } from "react";
import { Playground } from "./shared/Playground";
import { ScrollArea, ScrollbarVariant } from "@/components";
import { getAttrs } from "./shared/getAttributes";

type Direction = "vertical" | "horizontal" | "both";
type ShowScrollbar = "auto" | "always" | "never";
type Snap = "none" | "proximity" | "mandatory";
type SnapAlign = "start" | "center" | "end";

const ITEMS = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

/** Data attributes exposed by <ScrollArea> that we want to surface in the playground. */
const SCROLL_AREA_ATTRS = [
  "data-direction",
  "data-fade-top",
  "data-fade-bottom",
  "data-fade-left",
  "data-fade-right",
  "data-snap-align",
  "data-drag-scroll",
];

/** getAttrs always reports these; they aren't meaningful for a ScrollArea. */
const BASE_ATTRS_TO_EXCLUDE = [
  "id",
  "aria-invalid",
  "aria-describedby",
  "disabled",
];

export function ScrollAreaPlayground() {
  const [direction, setDirection] = useState<Direction>("vertical");
  const [showScrollbar, setShowScrollbar] = useState<ShowScrollbar>("auto");
  const [scrollbarVariant, setScrollbarVariant] =
    useState<ScrollbarVariant>("thin");
  const [snap, setSnap] = useState<Snap>("none");
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
          <Field label="direction">
            <Select
              value={direction}
              onChange={setDirection}
              options={["vertical", "horizontal", "both"]}
            />
          </Field>
          <Field label="showScrollbar">
            <Select
              value={showScrollbar}
              onChange={setShowScrollbar}
              options={["auto", "always", "never"]}
            />
          </Field>
          <Field label="scrollbarVariant">
            <Select
              value={scrollbarVariant}
              onChange={(value) =>
                setScrollbarVariant(value as ScrollbarVariant)
              }
              options={["thin", "none"]}
            />
          </Field>
          <Field label="snap">
            <Select
              value={snap}
              onChange={setSnap}
              options={["none", "proximity", "mandatory"]}
            />
          </Field>
          <Field label="snapAlign">
            <Select
              value={snapAlign}
              onChange={setSnapAlign}
              options={["start", "center", "end"]}
            />
          </Field>
          <Field label="fadeSize">
            <input
              value={fadeSize}
              onChange={(e) => setFadeSize(e.target.value)}
              className="w-full rounded-md border border-kui-border bg-kui-surface px-2 py-1.5"
            />
          </Field>
          <Field label="maxHeight">
            <input
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
              className="w-full rounded-md border border-kui-border bg-kui-surface px-2 py-1.5"
            />
          </Field>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={fadeEdges}
              onChange={(e) => setFadeEdges(e.target.checked)}
            />
            fadeEdges
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={dragToScroll}
              onChange={(e) => setDragToScroll(e.target.checked)}
            />
            dragToScroll
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showSticky}
              onChange={(e) => setShowSticky(e.target.checked)}
            />
            Sticky
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showScene}
              onChange={(e) => setShowScene(e.target.checked)}
            />
            Scene
          </label>
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
                top={0}
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="font-mono text-[11px] text-kui-text-muted">{label}</span>
      {children}
    </label>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: T[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-md border border-kui-border bg-kui-surface px-2 py-1.5"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
