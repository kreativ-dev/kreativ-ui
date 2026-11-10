"use client";

import { useCallback, useMemo, useState } from "react";
import type { Placement } from "@floating-ui/react";
import {
  FilePlus2,
  FolderOpen,
  Copy,
  Pencil,
  Share2,
  Trash2,
  ChevronRight,
  Check,
  Circle,
  Grid2X2,
  Ruler,
  Download,
  MoreHorizontal,
} from "lucide-react";

import { Button, Menu } from "@/components";

import { Container, FormField, Input } from "@/components";
import { getAttrs } from "./shared/getAttributes";
import { Playground } from "./shared/Playground";
import { Chip } from "./shared/Chip";
import { cn } from "@/utils";

const PLACEMENTS: Placement[] = [
  "top-start",
  "top",
  "top-end",
  "right-start",
  "right",
  "right-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
];

const ZOOM_LEVELS = ["50", "75", "100", "150", "200"];

export function MenuDemo() {
  // Configuration
  const [placement, setPlacement] = useState<Placement>("bottom-start");
  const [offset, setOffset] = useState(6);

  // Optional features
  const [showCheckbox, setShowCheckbox] = useState(true);
  const [showRadio, setShowRadio] = useState(true);
  const [showSub, setShowSub] = useState(true);
  const [showSeparator, setShowSeparator] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [showDestructive, setShowDestructive] = useState(true);

  // Preview state
  const [open, setOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [zoom, setZoom] = useState("100");

  const getAttributes = useCallback(
    (el: HTMLElement | null) =>
      getAttrs(
        el,
        [
          "role",
          "data-state",
          "data-active",
          "data-disabled",
          "data-menu-content",
          "aria-orientation",
          "aria-checked",
          "tabindex",
        ],
        [],
        undefined,
        ["opacity", "transform", "background-color"],
      ),
    [],
  );

  // Generate code from active configuration.
  const code = useMemo(() => {
    const lines: string[] = [];

    lines.push(`<Menu.Root placement="${placement}" offset={${offset}>`);
    lines.push(`  <Menu.Trigger asChild>`);
    lines.push(`    <Button size="sm">Open menu</Button>`);
    lines.push(`  </Menu.Trigger>`);
    lines.push(`  <Menu.Content>`);

    if (showLabel) {
      lines.push(`    <Menu.Label>Document</Menu.Label>`);
    }

    lines.push(`    <Menu.Item>New file</Menu.Item>`);
    lines.push(`    <Menu.Item>Open...</Menu.Item>`);
    lines.push(`    <Menu.Item>Duplicate</Menu.Item>`);

    if (showSeparator) {
      lines.push(`    <Menu.Separator />`);
    }

    if (showCheckbox) {
      lines.push(`    <Menu.CheckboxItem checked={showGrid}>`);
      lines.push(`      Show grid`);
      lines.push(`    </Menu.CheckboxItem>`);
      lines.push(`    <Menu.CheckboxItem checked={showRulers}>`);
      lines.push(`      Show rulers`);
      lines.push(`    </Menu.CheckboxItem>`);
    }

    if (showRadio) {
      if (showSeparator) lines.push(`    <Menu.Separator />`);

      lines.push(`    <Menu.RadioGroup value={zoom} onValueChange={setZoom}>`);

      ZOOM_LEVELS.forEach((value) => {
        lines.push(
          `      <Menu.RadioItem value="${value}">${value}%</Menu.RadioItem>`,
        );
      });

      lines.push(`    </Menu.RadioGroup>`);
    }

    if (showSub) {
      if (showSeparator) lines.push(`    <Menu.Separator />`);

      lines.push(`    <Menu.Sub>`);
      lines.push(`      <Menu.SubTrigger>Share`);
      lines.push(`        <ChevronRight />`);
      lines.push(`      </Menu.SubTrigger>`);
      lines.push(`      <Menu.SubContent>`);
      lines.push(`        <Menu.Item>Email</Menu.Item>`);
      lines.push(`        <Menu.Item>Copy link</Menu.Item>`);
      lines.push(`      </Menu.SubContent>`);
      lines.push(`    </Menu.Sub>`);
    }

    if (showDestructive) {
      if (showSeparator) lines.push(`    <Menu.Separator />`);

      lines.push(
        `    <Menu.Item tone="destructive">Delete document</Menu.Item>`,
      );
    }

    lines.push(`  </Menu.Content>`);
    lines.push(`</Menu.Root>`);

    return lines.join("\n");
  }, [
    placement,
    offset,
    showCheckbox,
    showRadio,
    showSub,
    showSeparator,
    showLabel,
    showDestructive,
  ]);

  const preview = (
    <div className="relative flex min-h-90 w-full items-center justify-center overflow-hidden rounded-xl border border-kui-border bg-kui-surface-muted/40 p-6">
      {/* Subtle editor preview */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="flex h-10 items-center border-b border-kui-border px-4">
          <div className="h-2 w-20 rounded-full bg-kui-border" />
          <div className="ml-auto h-2 w-12 rounded-full bg-kui-border" />
        </div>

        <div className="mx-auto mt-10 max-w-55 space-y-3">
          <div className="h-3 w-2/3 rounded bg-kui-border" />
          <div className="h-2 w-full rounded bg-kui-border" />
          <div className="h-2 w-4/5 rounded bg-kui-border" />
          <div className="h-20 rounded-lg border border-kui-border" />
        </div>
      </div>

      <Menu.Root
        open={open}
        onOpenChange={setOpen}
        placement={placement}
        offset={offset}
      >
        <Menu.Trigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="relative z-1 gap-2 shadow-sm"
          >
            <MoreHorizontal className="size-4" />
            Open menu
          </Button>
        </Menu.Trigger>

        <Menu.Content maxHeight={300} className="z-1">
          {showLabel && <Menu.Label>Document</Menu.Label>}

          <Menu.Item>
            <FilePlus2 />
            New file
          </Menu.Item>

          <Menu.Item>
            <FolderOpen />
            Open...
          </Menu.Item>

          <Menu.Item>
            <Copy />
            Duplicate
          </Menu.Item>

          <Menu.Item>
            <Pencil />
            Rename
          </Menu.Item>

          {showSeparator && <Menu.Separator />}

          {showCheckbox && (
            <>
              <Menu.CheckboxItem
                checked={showGrid}
                onCheckedChange={setShowGrid}
              >
                <Grid2X2 />
                Show grid
                {showGrid && <Check className="absolute right-2 size-4" />}
              </Menu.CheckboxItem>

              <Menu.CheckboxItem
                checked={showRulers}
                onCheckedChange={setShowRulers}
              >
                <Ruler />
                Show rulers
                {showRulers && <Check className="absolute right-2 size-4" />}
              </Menu.CheckboxItem>
            </>
          )}

          {showRadio && (
            <>
              {showSeparator && <Menu.Separator />}

              <Menu.Label>Zoom level</Menu.Label>

              <Menu.RadioGroup value={zoom} onValueChange={setZoom}>
                {ZOOM_LEVELS.map((value) => (
                  <Menu.RadioItem key={value} value={value}>
                    <span className="flex-1">{value}%</span>
                    <Circle
                      className={cn(
                        "size-2",
                        zoom === value ? "fill-current" : "",
                      )}
                    />
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </>
          )}

          {showSub && (
            <>
              {showSeparator && <Menu.Separator />}

              <Menu.Sub>
                <Menu.SubTrigger>
                  <span className="flex items-center gap-2">
                    <Share2 />
                    Share
                  </span>
                  <ChevronRight className="size-4 opacity-60" />
                </Menu.SubTrigger>

                <Menu.SubContent>
                  <Menu.Item>
                    <Copy />
                    Copy link
                  </Menu.Item>

                  <Menu.Item>
                    <Download />
                    Export
                  </Menu.Item>
                </Menu.SubContent>
              </Menu.Sub>
            </>
          )}

          {showDestructive && (
            <>
              {showSeparator && <Menu.Separator />}

              <Menu.Item tone="destructive">
                <Trash2 />
                Delete document
              </Menu.Item>
            </>
          )}
        </Menu.Content>
      </Menu.Root>

      <div className="absolute bottom-3 left-3 text-[10px] text-kui-text-muted">
        Interactive preview
      </div>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[10px] text-kui-text-muted">
        <span className="size-1.5 rounded-full bg-kui-success" />
        Live
      </div>
    </div>
  );

  const controls = (
    <Container>
      <div className="space-y-5">
        {/* Position */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-kui-text">Position</p>
            <p className="text-xs text-kui-text-muted">
              Configure menu placement and spacing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              as={Input}
              label="Offset (px)"
              controlProps={{
                size: "sm",
                kind: "number",
                min: 0,
                max: 48,
                value: offset,
                onChange: (e) =>
                  setOffset(
                    Math.max(0, Math.min(48, Number(e.target.value) || 0)),
                  ),
              }}
            />

            <label className="flex flex-col gap-1 text-xs">
              <span className="text-kui-text-muted">Placement</span>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as Placement)}
                className="h-8 rounded-md border border-kui-border bg-kui-surface px-2 text-xs text-kui-text outline-none focus:ring-1 focus:ring-kui-brand"
              >
                {PLACEMENTS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="h-px bg-kui-border" />

        {/* Features */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-kui-text">Menu features</p>
            <p className="text-xs text-kui-text-muted">
              Toggle the components displayed in the preview.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={showLabel} onClick={() => setShowLabel((v) => !v)}>
              labels
            </Chip>

            <Chip
              active={showCheckbox}
              onClick={() => setShowCheckbox((v) => !v)}
            >
              checkbox
            </Chip>

            <Chip active={showRadio} onClick={() => setShowRadio((v) => !v)}>
              radio group
            </Chip>

            <Chip active={showSub} onClick={() => setShowSub((v) => !v)}>
              submenu
            </Chip>

            <Chip
              active={showSeparator}
              onClick={() => setShowSeparator((v) => !v)}
            >
              separators
            </Chip>

            <Chip
              active={showDestructive}
              onClick={() => setShowDestructive((v) => !v)}
            >
              destructive
            </Chip>
          </div>
        </section>

        <div className="h-px bg-kui-border" />

        {/* Preview state */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-kui-text">Preview state</p>
            <p className="text-xs text-kui-text-muted">
              Current interactive menu settings.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Chip active={showGrid} onClick={() => setShowGrid((v) => !v)}>
              grid {showGrid ? "on" : "off"}
            </Chip>

            <Chip active={showRulers} onClick={() => setShowRulers((v) => !v)}>
              rulers {showRulers ? "on" : "off"}
            </Chip>
          </div>

          <p className="text-xs text-kui-text-muted">
            Zoom: <span className="font-medium text-kui-text">{zoom}%</span>
          </p>
        </section>
      </div>
    </Container>
  );

  return (
    <Playground
      title="Menu"
      description="A flexible, keyboard-navigable contextual menu with selection items, nested menus and customizable positioning."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={getAttributes}
      attributeSelector="[role='menu']"
    />
  );
}
