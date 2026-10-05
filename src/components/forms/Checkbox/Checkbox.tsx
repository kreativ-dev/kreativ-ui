"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/utils/cn";
import { mergeRefs } from "@/utils/mergeRef";
import { useOptionalFormField } from "../FormField/FormField.context";
import type { CheckboxProps } from "./Checkbox.types";
import { useSizeStyle, useStatusTransition, useTheme } from "@/hooks";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { isDev } from "@/utils/env";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      indeterminate = false,
      size = "sm",
      error,
      success,
      status,
      disabled,
      label,
      description,
      id: externalId,
      onChange: onChangeProp,
      required,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const field = useOptionalFormField();
    const { theme } = useTheme();

    const id = field?.id ?? externalId ?? autoId;

    const inputRef = useRef<HTMLInputElement>(null);

    const [internalChecked, setInternalChecked] = useState(
      defaultChecked ?? false,
    );

    const isControlled = checkedProp !== undefined;
    const checked = isControlled ? checkedProp : internalChecked;

    const hasWarned = useRef(false);

    useEffect(() => {
      if (!isDev() || hasWarned.current) return;

      if (label && field?.hasExternalLabel) {
        console.warn(
          "[kreativ-ui/Checkbox] This checkbox has both a `label` prop and a <FormField.Label> ancestor. " +
            "Checkbox owns its label. Use the Checkbox `label` prop instead of <FormField.Label>.",
        );

        hasWarned.current = true;
      }
    }, [label, field?.hasExternalLabel]);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const isInvalid = error ?? field?.invalid ?? false;
    const isSuccess = success ?? false;

    const state = status
      ? status
      : isInvalid
        ? "error"
        : isSuccess
          ? "success"
          : "none";

    const hasLabels = label || description;

    const {
      style: sizeStyle,
      iconSize,
      fontSize,
    } = useSizeStyle(size, !hasLabels, "checkbox", {
      widthFromHeight: true,
      sizeOffset: "7px",
    });

    const checkboxClasses = resolveRecipe(theme.recipes.Checkbox, {
      state,
      checked: checked || indeterminate,
      disabled: !!disabled,
    });

    const statusTransition = useStatusTransition(state);

    const descriptionId = description ? `${id}-description` : undefined;

    const describedBy =
      [field?.describedBy, descriptionId].filter(Boolean).join(" ") ||
      undefined;

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const nextChecked = event.target.checked;

      if (!isControlled) {
        setInternalChecked(nextChecked);
      }

      onCheckedChange?.(nextChecked);
      onChangeProp?.(event);
    }

    const wasInvalidRef = useRef(isInvalid);

    useEffect(() => {
      const justBecameInvalid = isInvalid && !wasInvalidRef.current;

      wasInvalidRef.current = isInvalid;

      if (!justBecameInvalid) {
        return;
      }

      inputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, [isInvalid]);

    return (
      <div
        className={cn(
          "inline-flex items-start gap-2",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <div className="relative inline-flex shrink-0">
          <input
            {...props}
            ref={mergeRefs(inputRef, ref)}
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            required={required ?? field?.required}
            onChange={handleChange}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            data-invalid={isInvalid || undefined}
            className={cn(
              "peer absolute inset-0 z-10 m-0 h-full w-full",
              "cursor-pointer opacity-0",
              "disabled:cursor-not-allowed",
            )}
          />

          <span
            aria-hidden="true"
            className={checkboxClasses}
            style={sizeStyle}
            data-state-transition={statusTransition}
          >
            <span className="absolute inset-0 flex items-center justify-center shrink-0">
              {indeterminate ? (
                <Minus strokeWidth={3} size={iconSize} />
              ) : checked ? (
                <Check strokeWidth={3} size={iconSize} />
              ) : null}
            </span>
          </span>
        </div>

        {hasLabels && (
          <label
            htmlFor={id}
            className={cn(
              "flex flex-col gap-px",
              !disabled && "cursor-pointer",
            )}
          >
            {label && (
              <span className="text-text" style={{ fontSize }}>
                {label}
              </span>
            )}

            {description && (
              <span
                id={descriptionId}
                className="text-text-muted"
                style={{
                  fontSize: fontSize ? `calc(${fontSize} - 1px)` : undefined,
                }}
              >
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
