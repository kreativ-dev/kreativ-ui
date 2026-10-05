import { Container } from "@/components";
import { ReactNode, useEffect, useRef, useState } from "react";

interface PlaygroundProps {
  title: string;
  description: string;
  controls: ReactNode;
  preview: ReactNode;
  code: string;
  getAttributes?: (el: HTMLElement | null) => Record<string, string | null>;
  attributeSelector?: string;
}

export function Playground({
  title,
  description,
  controls,
  preview,
  code,
  getAttributes,
  attributeSelector = "button",
}: PlaygroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [domAttrs, setDomAttrs] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!getAttributes) return;
    const el = wrapperRef.current?.querySelector(attributeSelector);

    if (!el) return;

    setDomAttrs(getAttributes(el as HTMLElement));
  }, [getAttributes, preview]);

  return (
    <div className="mx-auto max-w-6xl text-text">
      <header className="mb-8">
        <p className="mb-1 font-mono text-xs text-brand">kui / {title}</p>
        <h1 className="mb-1 text-xl font-medium">{title}</h1>
        <p className="max-w-prose text-sm text-text-muted">{description}</p>
      </header>

      <div className="grid min-w-0 grid-cols-[300px_minmax(0,1fr)] gap-6 max-lg:grid-cols-1">
        <Container>{controls}</Container>
        {/* <div className="rounded-xl border border-border bg-surface p-5"></div> */}
        <div className="min-w-0">
          <div
            ref={wrapperRef}
            className="flex min-h-35 items-center justify-center rounded-xl border border-border bg-surface p-6"
          >
            <div className="w-full max-w-sm">{preview}</div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface p-5 min-w-0">
            <p className="mb-2 font-mono text-[11px] text-text-muted">
              generated jsx
            </p>
            <pre className="min-w-0 max-w-full overflow-x-auto whitespace-pre-wrap rounded-(--kui-radii-md) border border-border    bg-bg p-3.5 font-mono text-xs leading-relaxed text-text-muted  ">
              {code}
            </pre>
          </div>

          {getAttributes && (
            <div className="mt-5 rounded-xl border border-border bg-surface p-5">
              <p className="mb-2 font-mono text-[11px] text-text-muted">
                resolved dom attributes
              </p>
              <div className="divide-y divide-border">
                {Object.entries(domAttrs).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-3 py-1.5 font-mono text-xs"
                  >
                    <span className="text-text-muted">{k}</span>
                    <span className={v ? "text-brand" : "text-text-muted"}>
                      {v ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
