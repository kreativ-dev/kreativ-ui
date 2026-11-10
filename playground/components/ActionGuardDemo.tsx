"use client";

import { useCallback, useMemo, useState } from "react";
import { Lock, ShieldCheck, RotateCcw, Zap } from "lucide-react";

import { ActionGuard, Button, Container, FormField, Input } from "@/components";
import { getAttrs } from "./shared/getAttributes";
import { Playground } from "./shared/Playground";
import { Chip } from "./shared/Chip";

type Reaction = "tooltip" | "toast" | "confirm";
type GuardStatus = "neutral" | "success" | "warning" | "error";

const REACTIONS: Reaction[] = ["tooltip", "toast", "confirm"];
const STATUSES: GuardStatus[] = ["neutral", "success", "warning", "error"];

export function ActionGuardDemo() {
  const [blocked, setBlocked] = useState(true);
  const [reaction, setReaction] = useState<Reaction>("tooltip");
  const [message, setMessage] = useState(
    "You don't have permission to perform this action.",
  );
  const [status, setStatus] = useState<GuardStatus>("warning");
  const [actionCount, setActionCount] = useState(0);
  const [lastResult, setLastResult] = useState("Try clicking the action.");

  const reset = () => {
    setBlocked(true);
    setReaction("tooltip");
    setMessage("You don't have permission to perform this action.");
    setStatus("warning");
    setActionCount(0);
    setLastResult("Try clicking the action.");
  };

  const code = useMemo(() => {
    const lines: string[] = [];
    lines.push(`<ActionGuard`);
    lines.push(`  blocked={${blocked}}`);
    lines.push(`  reaction="${reaction}"`);
    lines.push(`  message=${JSON.stringify(message)}`);
    if (reaction === "toast") {
      lines.push(`  status="${status}"`);
    }
    if (reaction === "confirm") {
      lines.push(`  confirm={{`);
      lines.push(`    title: "Continue with this action?",`);
      lines.push(`    confirmLabel: "Continue",`);
      lines.push(`    cancelLabel: "Cancel",`);
      lines.push(`    status: "${status}",`);
      lines.push(`  }}`);
    }
    lines.push(`  onBlocked={() => {}}`);
    lines.push(`>`);
    lines.push(`  <Button onClick={() => {}}>`);
    lines.push(`    Perform action`);
    lines.push(`  </Button>`);
    lines.push(`</ActionGuard>`);
    return lines.join("\n");
  }, [blocked, reaction, message, status]);

  const getAttributes = useCallback(
    (el: HTMLElement | null) =>
      getAttrs(
        el,
        ["role", "data-state", "aria-disabled", "data-status"],
        [],
        undefined,
        ["opacity"],
      ),
    [],
  );

  const handleAction = () => {
    setActionCount((count) => count + 1);
    setLastResult("Action executed successfully.");
  };

  const controls = (
    <Container>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip active={blocked} onClick={() => setBlocked(true)}>
            blocked
          </Chip>
          <Chip active={!blocked} onClick={() => setBlocked(false)}>
            unblocked
          </Chip>
        </div>

        <div className="flex flex-wrap gap-2">
          {REACTIONS.map((item) => (
            <Chip
              key={item}
              active={reaction === item}
              onClick={() => setReaction(item)}
            >
              {item}
            </Chip>
          ))}
        </div>

        <FormField
          as={Input}
          label="blocked message"
          controlProps={{
            size: "sm",
            placeholder: "Enter a message...",
            value: message,
            onChange: (e) => setMessage(e.target.value),
          }}
        />

        {reaction !== "tooltip" && (
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((item) => (
              <Chip
                key={item}
                active={status === item}
                onClick={() => setStatus(item)}
              >
                {item}
              </Chip>
            ))}
          </div>
        )}

        <Button size="sm" variant="ghost" onClick={reset}>
          <RotateCcw size={14} />
          Reset
        </Button>
      </div>
    </Container>
  );

  const preview = (
    <div className="flex min-h-80 w-full flex-col items-center justify-center gap-5 rounded-xl border border-kui-border bg-kui-surface-raised/30 p-6">
      <div className="flex size-12 items-center justify-center rounded-xl border border-kui-border bg-kui-surface text-kui-text-muted">
        {blocked ? <Lock size={21} /> : <ShieldCheck size={21} />}
      </div>

      <div className="max-w-sm space-y-1 text-center">
        <h3 className="text-base font-semibold text-kui-text">
          {blocked ? "Action restricted" : "Action available"}
        </h3>
        <p className="text-sm leading-relaxed text-kui-text-muted">
          {blocked
            ? "This action is currently restricted. Try interacting with the button below."
            : "The restriction has been lifted. The action can now execute normally."}
        </p>
      </div>

      <ActionGuard
        blocked={blocked}
        reaction={reaction}
        message={message}
        status={status}
        confirm={{
          title: "Continue with this action?",
          confirmLabel: "Continue",
          cancelLabel: "Cancel",
          status,
        }}
        onBlocked={() => {
          setLastResult("The action was intercepted.");
        }}
      >
        <Button onClick={handleAction}>
          <Zap size={15} />
          Perform action
        </Button>
      </ActionGuard>

      <div className="w-full max-w-sm rounded-lg border border-kui-border bg-kui-surface p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-kui-text-muted">Executed actions</span>
          <span className="font-mono text-sm font-semibold text-kui-text">
            {actionCount}
          </span>
        </div>
        <p className="mt-2 text-xs text-kui-text-muted">{lastResult}</p>
      </div>
    </div>
  );

  return (
    <Playground
      title="ActionGuard"
      description="Intercept actions and guide users with contextual feedback."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={getAttributes}
      attributeSelector="button"
    />
  );
}
