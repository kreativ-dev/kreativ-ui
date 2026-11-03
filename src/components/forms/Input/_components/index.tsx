import { ClearIcon } from "../Input.icons";

export function StaticSpinnerMark({ size }: { size: number | string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block rounded-full border-2 border-current opacity-70"
      style={{ width: size, height: size }}
    />
  );
}

export function ClearButton({
  size,
  className,
  onClear,
}: {
  size: number | string;
  className: string;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label="Clear input"
      className={className}
    >
      <ClearIcon style={{ width: size, height: size }} />
    </button>
  );
}
