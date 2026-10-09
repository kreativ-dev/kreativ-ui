"use client";

import * as React from "react";
import { useId, useState } from "react";

import { createComponent, useTheme } from "@splenddev/kreativ-core";
import { useSizeToken } from "@splenddev/kreativ-core/hooks";

import { cn } from "@/utils/cn";
import { useOptionalFormField } from "../FormField/FormField.context";
import { switchThumbConfig } from "./Switch.constants";
import type { SwitchProps } from "./Switch.types";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { isMotionGated } from "@/utils";
import type { MotionGatedProps } from "@/types";

export const Switch = createComponent<
  SwitchProps & MotionGatedProps,
  HTMLInputElement
>({
  displayName: "Switch",
  __kui: {
    role: "formControl",
    formControl: "single",
    supports: { disabled: true, invalid: true, required: true },
    skeleton: "input-shaped",
    video: {
      id: "switch",
      safe: true,
      acceptsChildren: true,
      interactionStates: ["focus"],
      controlled: ["checked", "disabled"],
      motionGated: true,
    },
  },
  render: (
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
      required,
      children,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const field = useOptionalFormField();
    const { theme } = useTheme();
    const motionGated = isMotionGated(props);

    const id = externalId ?? field?.id ?? autoId;
    const isDisabled = disabled || Boolean(field?.disabled);
    const isRequired = required ?? field?.required;
    const isInvalid =
      error || field?.invalid || field?.status === "error" || false;

    const [internalChecked, setInternalChecked] = useState(defaultChecked);

    const checked = checkedProp !== undefined ? checkedProp : internalChecked;

    const descriptionId = description ? `${id}-description` : undefined;

    const { thumb, translate } = switchThumbConfig[size];

    const state = isInvalid ? "error" : success ? "success" : "none";

    const switchClasses = resolveRecipe(theme.recipes.Switch, {
      checked,
      disabled: isDisabled,
      state,
    });

    const fontSize = useSizeToken(size, "fontSize");
    const width = useSizeToken(size, "width", "-2px");
    const height = useSizeToken(size, "height", "12px");

    const describedBy =
      [field?.describedBy, descriptionId].filter(Boolean).join(" ") ||
      undefined;

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
          isDisabled && "cursor-not-allowed opacity-50",
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
            disabled={isDisabled}
            required={isRequired}
            onChange={handleChange}
            aria-describedby={describedBy}
            aria-invalid={isInvalid || undefined}
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
                !motionGated &&
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
                className={cn("text-kui-text", !isDisabled && "cursor-pointer")}
                style={{ fontSize }}
              >
                {label}
              </label>
            )}

            {description && (
              <p
                id={descriptionId}
                className="text-kui-text-muted"
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
            className={cn(
              "text-kui-text inline-flex items-center",
              !isDisabled && "cursor-pointer",
            )}
            style={{ fontSize }}
          >
            {children}
          </label>
        )}
      </div>
    );
  },
});
