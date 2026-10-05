"use client";

import { forwardRef, useId, useState } from "react";

import { cn } from "@/utils/cn";

import { useOptionalFormField } from "../FormField/FormField.context";

import { switchThumbConfig } from "./Switch.constants";

import type { SwitchProps } from "./Switch.types";

import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { useSizeToken, useTheme } from "@/hooks";

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      size = "md",
      disabled = false,
      label,
      description,
      className,
      id: externalId,
      onChange: onChangeProp,
      error,
      success,
      children,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const field = useOptionalFormField();
    const { theme } = useTheme();

    const id = externalId ?? field?.id ?? autoId;

    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const checked = checkedProp !== undefined ? checkedProp : internalChecked;

    const descriptionId = description ? `${id}-description` : undefined;

    const { thumb, translate } = switchThumbConfig[size];

    const state = error ? "error" : success ? "success" : "none";

    const switchClasses = resolveRecipe(theme.recipes.Switch, {
      checked,
      disabled,
      state,
    });

    const fontSize = useSizeToken(size, "fontSize");
    const width = useSizeToken(size, "width", "-2px");
    const height = useSizeToken(size, "height", "12px");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const next = event.target.checked;

      if (checkedProp === undefined) {
        setInternalChecked(next);
      }

      onCheckedChange?.(next);
      onChangeProp?.(event);
    }

    return (
      <div
        className={cn(
          "flex gap-2.5",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <div className="relative inline-flex shrink-0">
          <input
            {...props}
            type="checkbox"
            role="switch"
            ref={ref}
            id={id}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            aria-describedby={field?.describedBy ?? descriptionId}
            aria-invalid={field?.status === "error" || undefined}
            className="peer absolute inset-0 z-10 m-0
            cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />

          <div
            aria-hidden="true"
            className={cn(switchClasses, "")}
            style={{ width, height }}
          >
            <div
              className={cn(
                "absolute left-1 rounded-full bg-white shadow top-1/2 -translate-y-1/2",
                "transition-transform duration-(--kui-duration-fast)",
                thumb,
                checked && translate,
              )}
            />
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={id}
                className={cn("text-text", !disabled && "cursor-pointer")}
                style={{ fontSize }}
              >
                {label}
              </label>
            )}

            {description && (
              <p
                id={descriptionId}
                className="text-text-muted"
                style={{
                  fontSize: fontSize ? `calc(${fontSize} - 3px)` : undefined,
                }}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children && (
          <label
            htmlFor={id}
            className={cn("text-text inline-flex items-center", !disabled && "cursor-pointer")}
            style={{ fontSize }}
          >
            {children}
          </label>
        )}
      </div>
    );
  },
);

Switch.displayName = "Switch";
