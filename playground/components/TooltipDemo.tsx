"use client";

import { useCallback, useMemo, useState } from "react";

import type { Placement } from "@floating-ui/react";
import { Button } from "@splenddev/kreativ-ui";

import {
  Container,
  FormField,
  Input,
  Tooltip,
  TooltipProvider,
} from "@/components";
import { getAttrs } from "./shared/getAttributes";
import { Playground } from "./shared/Playground";

const PLACEMENTS: Placement[] = [
  "top",
  "top-start",
  "top-end",
  "right",
  "right-start",
  "right-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
];

export function TooltipDemo() {
  const [content, setContent] = useState("Add to library");
  const [placement, setPlacement] = useState<Placement>("top");
  const [offsetAmount, setOffsetAmount] = useState(8);
  const [delay, setDelay] = useState(500);
  const [skipDelay, setSkipDelay] = useState(300);
  const [showArrow, setShowArrow] = useState(true);
  const [withProvider, setWithProvider] = useState(true);
  const [forceOpen, setForceOpen] = useState(false);

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const code = useMemo(() => {
    const rootLines: Array<string | null> = [
      `<Tooltip.Root`,
      `  placement="${placement}"`,
      `  offset={${offsetAmount}}`,
      withProvider ? null : `  delay={${delay}}`,
      forceOpen ? `  open` : null,
      `>`,
      `  <Tooltip.Trigger asChild>`,
      `    <Button>Hover me</Button>`,
      `  </Tooltip.Trigger>`,
      `  <Tooltip.Portal>`,
      `    <Tooltip.Content>`,
      showArrow ? `      <Tooltip.Arrow />` : null,
      `      ${JSON.stringify(content)}`,
      `    </Tooltip.Content>`,
      `  </Tooltip.Portal>`,
      `</Tooltip.Root>`,
    ];
    const inner = rootLines.filter(Boolean).join("\n");

    if (!withProvider) return inner;

    return [
      `<TooltipProvider delay={${delay}} skipDelayDuration={${skipDelay}}>`,
      ...inner.split("\n").map((l) => "  " + l),
      `</TooltipProvider>`,
    ].join("\n");
  }, [
    content,
    placement,
    offsetAmount,
    delay,
    skipDelay,
    showArrow,
    withProvider,
    forceOpen,
  ]);

  const getAttributes = useCallback(
    (el: HTMLElement | null) =>
      // `el` is the trigger <button> (Playground's `attributeSelector`).
      // `data-state` and `aria-describedby` are the tooltip-relevant attrs;
      // both are set by Floating UI on the reference element.
      getAttrs(el, ["data-state", "aria-describedby", "type"]),
    [],
  );

  const controls = (
    <Container>
      <div className="flex flex-col gap-3">
        <FormField
          as={Input}
          label="content"
          controlProps={{
            size: "sm",
            placeholder: "Add to library",
            value: content,
            onChange: (e) => setContent(e.target.value),
          }}
        />

        <FormField
          as={Input}
          label="offset (px)"
          controlProps={{
            size: "sm",
            kind: "number",
            placeholder: "8",
            value: offsetAmount || "",
            onChange: (e) => setOffsetAmount(Number(e.target.value) || 0),
          }}
        />

        <label className="flex flex-col gap-1 text-xs">
          <span className="text-kui-text-muted">placement</span>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value as Placement)}
            className="rounded-md border border-kui-border bg-kui-surface px-2 py-1.5 text-xs text-kui-text focus:outline-none focus:ring-1 focus:ring-kui-brand"
          >
            {PLACEMENTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <FormField
          as={Input}
          label="delay (ms)"
          controlProps={{
            size: "sm",
            kind: "number",
            placeholder: "500",
            value: delay || "",
            onChange: (e) => setDelay(Number(e.target.value) || 0),
          }}
        />

        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={withProvider}
            onChange={(e) => setWithProvider(e.target.checked)}
            className="accent-kui-brand"
          />
          <span className="text-kui-text-muted">wrap in TooltipProvider</span>
        </label>

        {withProvider && (
          <FormField
            as={Input}
            label="skipDelayDuration (ms)"
            controlProps={{
              size: "sm",
              kind: "number",
              placeholder: "300",
              value: skipDelay || "",
              onChange: (e) => setSkipDelay(Number(e.target.value) || 0),
            }}
          />
        )}

        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={showArrow}
            onChange={(e) => setShowArrow(e.target.checked)}
            className="accent-kui-brand"
          />
          <span className="text-kui-text-muted">show arrow</span>
        </label>

        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={forceOpen}
            onChange={(e) => setForceOpen(e.target.checked)}
            className="accent-kui-brand"
          />
          <span className="text-kui-text-muted">
            force open (inspect state)
          </span>
        </label>
      </div>
    </Container>
  );

  const tooltipTree = (
    <Tooltip.Root
      open={forceOpen || tooltipOpen}
      onOpenChange={setTooltipOpen}
      placement={placement}
      offset={offsetAmount}
      delay={withProvider ? undefined : delay}
    >
      <Tooltip.Trigger asChild>
        <Button size="sm">Hover me this is a long text</Button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>
          {showArrow && <Tooltip.Arrow />}
          {content}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );

  const preview = (
    <div className="flex min-h-28 w-full items-center justify-center">
      {withProvider ? (
        <TooltipProvider delay={delay} skipDelayDuration={skipDelay}>
          {tooltipTree}
        </TooltipProvider>
      ) : (
        tooltipTree
      )}
    </div>
  );

  return (
    <Playground
      title="Tooltip"
      description="A floating label triggered on hover or focus. Wraps an element with Floating UI and, when grouped under TooltipProvider, lets consecutive tooltips open instantly within skipDelayDuration."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={getAttributes}
      // Only one interactive element in the preview — the trigger button.
      attributeSelector="button"
    />
  );
}
