import { cn } from "@/utils";
import { Button } from "@/components/Button/Button";

export function SegmentedControl<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: T[];
    onChange: (v: T) => void;
}) {
    return (
      <div className="mb-5">
        <p className="mb-2 font-mono text-[11px] text-text-muted">{label}</p>
        <div className="inline-flex max-w-full gap-1 rounded-(--kui-radii-md) border border-border bg-surface p-0.75 overflow-x-auto kui-scrollbar">
          {options.map((opt) => (
            <Button
              key={opt}
              type="button"
              size="xs"
              variant={value === opt ? "solid" : "soft"}
              color={value === opt ? "brand" : "neutral"}
              onClick={() => onChange(opt)}
              className={cn(
                "shrink-0 rounded-[calc(var(--kui-radii-md)-3px)] px-2 py-1.5 font-mono text-xs transition-colors whitespace-nowrap",
              )}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>
    );
}