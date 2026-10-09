import * as React from "react";
import { Input } from "../Input/Input";
import {
  validateNumberStepper,
  clampNumberStepper,
} from "./NumberStepper.validate";
import type { NumberStepperProps } from "./NumberStepper.types";
import { createComponent, useTheme } from "@splenddev/kreativ-core";
import { useControllableState } from "@/hooks";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { useOptionalFormField } from "../FormField/FormField.context";
import { Minus, Plus } from "lucide-react";

function formatValue(
  value: number | undefined,
  precision: number | undefined,
): string {
  if (value === undefined) return "";
  return precision !== undefined ? value.toFixed(precision) : String(value);
}

export const NumberStepper = createComponent<
  NumberStepperProps,
  HTMLInputElement
>({
  __kui: {
    formControl: "single",
    role: "formControl",
    skeleton: "input-shaped",
    video: { id: "number-stepper", safe: true },
  },
  displayName: "NumberStepper",
  render(props, ref) {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      precision,
      clampOn = "blur",
      onValidate,
      buttonLayout = "horizontal",
      disabled = false,
      required = false,
      name,
      size = "md",
      className,
      style,
      "aria-label": ariaLabel,
      variant = "outline",
      error,
      success,
      rounded = false,
      fullWidth = true,
      ...rest
    } = props;

    const [committedValue, setCommittedValue] = useControllableState<
      number | undefined
    >({
      value: valueProp,
      defaultValue: defaultValue ?? min,
      onChange: onValueChange as (value: number | undefined) => void,
    });

    const [text, setText] = React.useState<string>(() =>
      formatValue(committedValue, precision),
    );
    const lastCommittedRef = React.useRef(committedValue);

    React.useEffect(() => {
      if (committedValue !== lastCommittedRef.current) {
        lastCommittedRef.current = committedValue;
        setText(formatValue(committedValue, precision));
      }
    }, [committedValue, precision]);

    const { theme } = useTheme();
    const field = useOptionalFormField();
    const isInvalid = error ?? field?.invalid ?? false;
    const isDisabled = disabled || Boolean(field?.disabled);
    const isRequired = required || Boolean(field?.required);

    const reportToFormField = React.useCallback(
      (result: ReturnType<typeof validateNumberStepper>) => {
        if (!field) return;

        if (!result.valid) {
          const message = result.errors.includes("min")
            ? `Must be at least ${min}`
            : result.errors.includes("max")
              ? `Must be at most ${max}`
              : result.errors.includes("step")
                ? `Must be a multiple of ${step}`
                : result.errors.includes("required")
                  ? "This field is required"
                  : "Invalid value";

          field.reportValidity({ invalid: true, message });
        } else {
          field.reportValidity({ invalid: false });
        }
      },
      [field, min, max, step],
    );

    const runValidation = React.useCallback(
      (raw: string) => {
        const result = validateNumberStepper({
          raw,
          min,
          max,
          step,
          precision,
          required: isRequired,
        });
        console.log("validate", { raw, min, max, step, precision, result });

        onValidate?.(result);
        reportToFormField(result);
        return result;
      },
      [min, max, step, precision, onValidate, reportToFormField, isRequired],
    );

    const applyResolvedValue = React.useCallback(
      (
        result: ReturnType<typeof validateNumberStepper>,
        shouldClamp: boolean,
      ) => {
        if (result.value === null) return;

        const finalValue =
          shouldClamp &&
          (result.errors.includes("min") ||
            result.errors.includes("max") ||
            result.errors.includes("step"))
            ? clampNumberStepper(result.value, min, max, step)
            : result.value;

        setCommittedValue(finalValue);
      },
      [min, max, step, setCommittedValue],
    );

    const handleChange = (raw: string | number) => {
      setText(`${raw}`);
      if (clampOn === "change") {
        const result = runValidation(raw as string);
        applyResolvedValue(result, true);
      } else if (clampOn === "never") {
        runValidation(raw as string);
      }
    };

    const handleBlur = () => {
      if (clampOn === "blur") {
        const result = runValidation(text);
        applyResolvedValue(result, true);
      }
    };

    const commit = () => {
      if (clampOn === "commit") {
        const result = runValidation(text);
        applyResolvedValue(result, true);
      }
    };

    const step_ = (direction: 1 | -1) => {
      if (isDisabled) return;
      const base = committedValue ?? min ?? 0;
      let next = base + direction * step;
      if (min !== undefined) next = Math.max(min, next);
      if (max !== undefined) next = Math.min(max, next);

      setCommittedValue(next);
      onValidate?.({ valid: true, value: next, errors: [] });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        commit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        step_(1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        step_(-1);
      }
    };

    const canIncrement = max === undefined || (committedValue ?? 0) < max;
    const canDecrement = min === undefined || (committedValue ?? 0) > min;

    const state = isInvalid ? "error" : success ? "success" : "none";

    const describedBy = field?.describedBy;

    const formControlClassName = resolveRecipe(theme.recipes.FormControl, {
      variant,
      state,
      rounded,
      fullWidth,
      disabled: isDisabled,
      embedded: false,
      hasAdornment: false,
    });

    const rootClassName = resolveRecipe(theme.recipes.NumberStepper, {
      buttonLayout,
      disabled: isDisabled,
    } as never);

    const wrapperClasses = [
      formControlClassName,
      "overflow-hidden",
      rootClassName,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const buttonGroupClassName = resolveRecipe(
      theme.recipes.NumberStepperButtons,
      {} as never,
    );

    const buttonClassName = resolveRecipe(
      theme.recipes.NumberStepperButton,
      {} as never,
    );

    return (
      <div className={wrapperClasses} style={style} data-state={state}>
        {name && (
          <input
            type="hidden"
            name={name}
            value={committedValue ?? ""}
            readOnly
          />
        )}
        <Input
          ref={ref}
          kind="numeric"
          value={text}
          onValueChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          size={size}
          variant={variant}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={committedValue}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          aria-required={isRequired || undefined}
          embedded
          {...rest}
        />
        <div className={buttonGroupClassName} data-button-layout={buttonLayout}>
          <button
            type="button"
            className={buttonClassName}
            disabled={isDisabled || !canIncrement}
            aria-label="Increment"
            data-action="increment"
            onClick={() => step_(1)}
          >
            <Plus size={13} />
          </button>
          <button
            type="button"
            className={buttonClassName}
            disabled={isDisabled || !canDecrement}
            aria-label="Decrement"
            data-action="decrement"
            onClick={() => step_(-1)}
          >
            <Minus size={13} />
          </button>
        </div>
      </div>
    );
  },
});
