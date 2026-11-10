"use client";

import { useCallback, useMemo, useState } from "react";


import {
  Button,
  Container,
  Flex,
  FormField,
  Input,
  Toast,
  ToastPlacement,
  ToastStatus,
} from "@/components";
import { getAttrs } from "./shared/getAttributes";
import { Playground } from "./shared/Playground";
import { Chip } from "./shared/Chip";
import { SegmentedControl } from "./shared/SegmentedControl";

const STATUSES: ToastStatus[] = [
  "neutral",
  "success",
  "error",
  "warning",
  "info",
  "brand",
];

const PLACEMENTS: ToastPlacement[] = [
  "top-start",
  "top-center",
  "top-end",
  "bottom-start",
  "bottom-center",
  "bottom-end",
];

export function ToastDemo() {
  const [status, setStatus] = useState<ToastStatus>("neutral");
  const [title, setTitle] = useState("Saved");
  const [description, setDescription] = useState(
    "Your changes have been saved.",
  );
  const [duration, setDuration] = useState(4000);
  const [dismissible, setDismissible] = useState(true);
  const [placement, setPlacement] = useState<ToastPlacement>("bottom-end");

  const [hasAction, setHasAction] = useState(false);
  const [actionLabel, setActionLabel] = useState("Undo");

  const [open, setOpen] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  const trigger = () => {
    setToastKey((k) => k + 1);
    setOpen(true);
  };

  const action = hasAction
    ? {
        label: actionLabel,
        onClick: () => {},
      }
    : undefined;

  const code = useMemo(() => {
    const lines: string[] = ["<Toast.Root"];
    lines.push(`  status="${status}"`);
    if (title) lines.push(`  title="${title}"`);
    if (description) lines.push(`  description="${description}"`);
    if (duration !== 4000) lines.push(`  duration={${duration}}`);
    if (!dismissible) lines.push(`  dismissible={false}`);
    if (action) {
      lines.push(`  action={{ label: "${action.label}", onClick: () => {} }}`);
    }
    lines.push(`  open={open}`);
    lines.push(`  onOpenChange={setOpen}`);
    lines.push(`/>`);

    return [
      `<Toast.Provider>`,
      `  <Toast.Viewport placement="${placement}" />`,
      ...lines.map((l) => "  " + l),
      `</Toast.Provider>`,
    ].join("\n");
  }, [status, title, description, duration, dismissible, action, placement]);

  const getAttributes = useCallback(
    (el: HTMLElement | null) =>
      getAttrs(
        el,
        ["role", "data-status", "data-state", "data-placement", "aria-atomic"],
        [],
        undefined,
        ["opacity", "transform"],
      ),
    [],
  );

  const controls = (
    <Container>
      <div className="flex flex-col gap-3">
        <FormField
          as={Input}
          label="title"
          controlProps={{
            size: "sm",
            placeholder: "Saved",
            value: title,
            onChange: (e) => setTitle(e.target.value),
          }}
        />
        <FormField
          as={Input}
          label="description"
          controlProps={{
            size: "sm",
            placeholder: "Your changes have been saved.",
            value: description,
            onChange: (e) => setDescription(e.target.value),
          }}
        />
        <FormField
          as={Input}
          label="duration (ms)"
          controlProps={{
            size: "sm",
            kind: "number",
            placeholder: "4000",
            value: duration || "",
            onChange: (e) => setDuration(Number(e.target.value) || 0),
          }}
        />
        <SegmentedControl
          label="status"
          value={status}
          options={STATUSES}
          onChange={setStatus}
        />

        <label className="flex flex-col gap-1 text-xs">
          <span className="text-kui-text-muted">placement</span>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value as ToastPlacement)}
            className="rounded-md border border-kui-border bg-kui-surface px-2 py-1.5 text-xs text-kui-text focus:outline-none focus:ring-1 focus:ring-kui-brand"
          >
            {PLACEMENTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <Flex gap={6}>
          <Chip active={dismissible} onClick={() => setDismissible((v) => !v)}>
            dismissable
          </Chip>
          <Chip active={hasAction} onClick={() => setHasAction((v) => !v)}>
            action button
          </Chip>
        </Flex>

        {hasAction && (
          <FormField
            as={Input}
            label="action label"
            controlProps={{
              size: "sm",
              placeholder: "Undo",
              value: actionLabel,
              onChange: (e) => setActionLabel(e.target.value),
            }}
          />
        )}

        <Button size="sm" onClick={trigger}>
          Show toast
        </Button>
      </div>
    </Container>
  );

  const preview = (
    <div className="relative flex min-h-24 w-full items-center justify-center">
      <Button size="sm" onClick={trigger}>
        Trigger toast
      </Button>

      <Toast.Root
        key={toastKey}
        open={open}
        onOpenChange={setOpen}
        status={status}
        title={title || undefined}
        description={description || undefined}
        duration={duration || undefined}
        dismissible={dismissible}
        action={action}
      />
    </div>
  );

  return (
    <Playground
      title="Toast"
      description="Declarative notifications. Hover the toast to pause its timer; Escape or the close button dismisses it."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={getAttributes}
      attributeSelector="[data-kui-toast]"
    />
  );
}
