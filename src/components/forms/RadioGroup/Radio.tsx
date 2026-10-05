import { cn } from "@/utils/cn";
import { useRadioGroupContext } from "./RadioGroup.context";
import { radioBubbleVariants, radioDotSizes } from "./Radio.styles";
import type { RadioProps } from "./Radio.types";

export function Radio({
  value,
  disabled: itemDisabled,
  label,
  description,
  className,
  ...props
}: RadioProps) {
  const group = useRadioGroupContext();
  const id = `${group.name}-${value}`;

  const checked = group.value === value;
  const disabled = itemDisabled || group.disabled;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div className={cn("flex gap-2.5", disabled && "cursor-not-allowed opacity-50", className)}>
      <div className="relative mt-0.5 inline-flex">
        <input
          type="radio"
          id={id}
          name={group.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => group.onValueChange(value)}
          aria-describedby={descriptionId}
          className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          data-invalid={group.state === "error" || undefined}
          {...props}
        />

        <div
          aria-hidden="true"
          className={cn(
            radioBubbleVariants({ size: group.size, state: group.state, checked, disabled }),
            "peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-1"
          )}
        >
          {checked && <div className={cn("rounded-full bg-brand", radioDotSizes[group.size])} />}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label htmlFor={id} className={cn("text-sm text-text", !disabled && "cursor-pointer", group.size==='sm' && "text-xs")}>
              {label}
            </label>
          )}
          {description && (
            <p id={descriptionId} className={cn("text-xs text-text-muted", group.size==='sm' && "text-[10px]")}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}