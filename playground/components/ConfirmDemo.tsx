"use client";

import { useMemo, useState } from "react";
import {
  Camera,
  ShieldCheck,
  CircleAlert,
  Trash2,
  Check,
  RotateCcw,
} from "lucide-react";

import { Button, confirmAction } from "@/components";
import { Container, FormField, Input } from "@/components";
import { Playground } from "./shared/Playground";
import { Chip } from "./shared/Chip";

type ConfirmStatus = "neutral" | "info" | "success" | "warning" | "error";

type ConfirmIcon = "camera" | "shield" | "alert" | "trash" | "none";

const STATUSES: ConfirmStatus[] = [
  "neutral",
  "info",
  "success",
  "warning",
  "error",
];

const ICONS = {
  camera: Camera,
  shield: ShieldCheck,
  alert: CircleAlert,
  trash: Trash2,
} as const;

const ICON_OPTIONS: ConfirmIcon[] = [
  "camera",
  "shield",
  "alert",
  "trash",
  "none",
];

const ICON_CODE: Record<ConfirmIcon, string> = {
  camera: '<Camera className="size-5" />',
  shield: '<ShieldCheck className="size-5" />',
  alert: '<CircleAlert className="size-5" />',
  trash: '<Trash2 className="size-5" />',
  none: "",
};

export function ConfirmDemo() {
  const [title, setTitle] = useState("Allow camera access?");
  const [message, setMessage] = useState(
    "We need access to your camera to let you capture photos and record videos.",
  );
  const [confirmLabel, setConfirmLabel] = useState("Allow access");
  const [cancelLabel, setCancelLabel] = useState("Not now");
  const [status, setStatus] = useState<ConfirmStatus>("neutral");
  const [icon, setIcon] = useState<ConfirmIcon>("camera");

  // Preview state
  const [result, setResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Icon = icon === "none" ? null : ICONS[icon];
  const iconElement = Icon ? <Icon className="size-5" /> : undefined;

  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const confirmed = await confirmAction({
        key: "confirm-playground",
        title,
        message,
        confirmLabel,
        cancelLabel,
        status,
        icon: iconElement,
      });

      setResult(confirmed);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to open confirmation.",
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTitle("Allow camera access?");
    setMessage(
      "We need access to your camera to let you capture photos and record videos.",
    );
    setConfirmLabel("Allow access");
    setCancelLabel("Not now");
    setStatus("neutral");
    setIcon("camera");
    setResult(null);
    setError("");
  };

  const code = useMemo(() => {
    const iconImport =
      icon === "none"
        ? ""
        : `import { ${
            {
              camera: "Camera",
              shield: "ShieldCheck",
              alert: "CircleAlert",
              trash: "Trash2",
              none: "",
            }[icon]
          } } from "lucide-react";\n`;

    const iconProp = icon === "none" ? "" : `  icon: ${ICON_CODE[icon]},\n`;

    return [
      `import { confirmAction } from "@/components";`,
      iconImport.trimEnd(),
      ``,
      `const confirmed = await confirmAction({`,
      `  key: "camera-permission",`,
      `  title: ${JSON.stringify(title)},`,
      `  message: ${JSON.stringify(message)},`,
      `  confirmLabel: ${JSON.stringify(confirmLabel)},`,
      `  cancelLabel: ${JSON.stringify(cancelLabel)},`,
      `  status: "${status}",`,
      iconProp.trimEnd(),
      `});`,
      ``,
      `if (confirmed) {`,
      `  // Permission granted`,
      `} else {`,
      `  // Permission declined`,
      `}`,
    ]
      .filter((line, index, lines) => {
        return line !== "" || lines[index - 1] !== "";
      })
      .join("\n");
  }, [title, message, confirmLabel, cancelLabel, status, icon]);

  const preview = (
    <div className="relative flex min-h-90 flex-col items-center justify-center gap-5 rounded-xl border border-kui-border bg-kui-surface-muted/40 p-6">
      <Button
        size="sm"
        onClick={handleConfirm}
        disabled={loading}
        className="gap-2"
      >
        {loading ? "Waiting..." : "Open interactive dialog"}
      </Button>

      {result !== null && (
        <div
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
            result
              ? "border-kui-success/30 text-kui-success"
              : "border-kui-border text-kui-text-muted"
          }`}
        >
          {result ? (
            <Check className="size-3.5" />
          ) : (
            <RotateCcw className="size-3.5" />
          )}

          {result
            ? "Confirmed — action approved"
            : "Cancelled — action declined"}
        </div>
      )}

      {error && (
        <p className="max-w-xs text-center text-xs text-kui-destructive">
          {error}
        </p>
      )}
    </div>
  );

  const controls = (
    <Container>
      <div className="space-y-5">
        {/* Content */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-kui-text">Content</p>
            <p className="text-xs text-kui-text-muted">
              Customize the dialog heading and description.
            </p>
          </div>

          <FormField
            as={Input}
            label="Title"
            controlProps={{
              size: "sm",
              value: title,
              onChange: (e) => setTitle(e.target.value),
            }}
          />

          <FormField
            as={Input}
            label="Message"
            controlProps={{
              size: "sm",
              value: message,
              onChange: (e) => setMessage(e.target.value),
            }}
          />
        </section>

        <div className="h-px bg-kui-border" />

        {/* Icon */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-kui-text">Icon</p>
            <p className="text-xs text-kui-text-muted">
              Choose an icon for the dialog header.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((value) => (
              <Chip
                key={value}
                active={icon === value}
                onClick={() => setIcon(value)}
              >
                {value}
              </Chip>
            ))}
          </div>
        </section>

        <div className="h-px bg-kui-border" />

        {/* Actions */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-kui-text">Actions</p>
            <p className="text-xs text-kui-text-muted">
              Customize the dialog button labels.
            </p>
          </div>

          <FormField
            as={Input}
            label="Confirm label"
            controlProps={{
              size: "sm",
              value: confirmLabel,
              onChange: (e) => setConfirmLabel(e.target.value),
            }}
          />

          <FormField
            as={Input}
            label="Cancel label"
            controlProps={{
              size: "sm",
              value: cancelLabel,
              onChange: (e) => setCancelLabel(e.target.value),
            }}
          />
        </section>

        <div className="h-px bg-kui-border" />

        {/* Status */}
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium text-kui-text">Status</p>
            <p className="text-xs text-kui-text-muted">
              Controls the visual intent and initial focus behavior.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUSES.map((value) => (
              <Chip
                key={value}
                active={status === value}
                onClick={() => setStatus(value)}
              >
                {value}
              </Chip>
            ))}
          </div>
        </section>

        <div className="h-px bg-kui-border" />

        {/* Reset */}
        <Button
          type="button"
          variant="outline"
          color="neutral"
          size="sm"
          className="w-full gap-2"
          onClick={reset}
        >
          <RotateCcw className="size-3.5" />
          Reset configuration
        </Button>
      </div>
    </Container>
  );

  return (
    <Playground
      title="Confirm"
      description="An imperative, promise-based confirmation dialog for actions that require explicit user approval."
      controls={controls}
      preview={preview}
      code={code}
    />
  );
}
