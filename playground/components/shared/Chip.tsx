import { Button } from "@/components/Button/Button";
import { cn } from "@/utils";

export function Chip({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="xs"
      typography="mono"
      variant="outline"
      color={active ? "brand" : "neutral"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-full font-mono transition-colors",
        !active && "text-text-muted",
      )}
    >
      {children}
    </Button>
  );
}
