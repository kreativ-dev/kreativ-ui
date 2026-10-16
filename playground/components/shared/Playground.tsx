import { Container } from "@/components";
import { Check, Copy, CopyCheck, X } from "lucide-react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

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
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!getAttributes) return;

    const el = wrapperRef.current?.querySelector(attributeSelector);

    if (!el) {
      setDomAttrs({});
      return;
    }

    setDomAttrs(getAttributes(el as HTMLElement));
  }, [getAttributes, attributeSelector, preview]);

  useEffect(() => {
    if (!isCodeOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCodeOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isCodeOpen]);

  useEffect(() => {
    if (!isCodeOpen) {
      setCopied(false);
    }
  }, [isCodeOpen]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Clipboard unavailable.
    }
  }, [code]);

  return (
    <div className="mx-auto max-w-6xl text-kui-text">
      <header className="mb-8">
        <p className="mb-1 font-mono text-xs text-kui-brand">kui / {title}</p>

        <h1 className="mb-1 text-xl font-medium">{title}</h1>

        <p className="max-w-prose text-sm text-kui-text-muted">{description}</p>
      </header>

      <div className="grid min-w-0 grid-cols-[300px_minmax(0,1fr)] gap-6 max-lg:grid-cols-1">
        <Container>{controls}</Container>

        <div className="min-w-0">
          <div
            ref={wrapperRef}
            className="relative flex min-h-35 items-center justify-center rounded-xl border border-kui-border bg-kui-surface p-6"
          >
            <div className="w-full max-w-sm">{preview}</div>

            <button
              type="button"
              onClick={() => setIsCodeOpen(true)}
              className="absolute right-3 top-3 rounded-md border border-kui-border bg-kui-surface/90 px-2.5 py-1.5 font-mono text-[11px] text-kui-text-muted backdrop-blur transition-colors hover:border-kui-brand hover:text-kui-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kui-brand"
            >
              {"</>"} view code
            </button>
          </div>

          {getAttributes && (
            <div className="mt-5 rounded-xl border border-kui-border bg-kui-surface p-5">
              <p className="mb-2 font-mono text-[11px] text-kui-text-muted">
                resolved dom attributes
              </p>

              <div className="divide-y divide-kui-border">
                {Object.entries(domAttrs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between gap-3 py-1.5 font-mono text-xs"
                  >
                    <span className="text-kui-text-muted">{key}</span>

                    <span
                      className={
                        value ? "text-kui-brand" : "text-kui-text-muted"
                      }
                    >
                      {value ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isCodeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — generated JSX`}
          onClick={() => setIsCodeOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-kui-border bg-kui-surface shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-kui-border px-5 py-3">
              <div>
                <p className="font-mono text-[11px] text-kui-text-muted">
                  generated jsx
                </p>

                <p className="mt-0.5 text-xs text-kui-text">{title}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-md border border-kui-border px-2.5 py-2 font-mono text-[11px] text-kui-text-muted transition-colors hover:border-kui-brand hover:text-kui-brand"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>

                <button
                  type="button"
                  autoFocus
                  onClick={() => setIsCodeOpen(false)}
                  aria-label="Close code preview"
                  className="rounded-md border border-kui-border px-2.5 py-2 font-mono text-[11px] text-kui-text-muted transition-colors hover:border-kui-brand hover:text-kui-brand"
                >
                  <X size={16}/>
                </button>
              </div>
            </header>

            <pre className="min-w-0 flex-1 overflow-auto whitespace-pre-wrap bg-bg p-5 font-mono text-xs leading-relaxed text-kui-text-muted kui-scrollbar">
              {code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
