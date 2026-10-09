"use client";

import { useState } from "react";

import { createComponent } from "@splenddev/kreativ-core";

import { passwordKindDefaults } from "./Input.constants";
import { Eye, EyeOff, passwordKindIcons } from "./Input.icons";
import type { PasswordInputProps } from "./Input.types";
import { renderBaseInput } from "./Input.base";

export const PasswordInput = createComponent<
  PasswordInputProps,
  HTMLInputElement
>({
  displayName: "PasswordInput",
  __kui: {
    role: "formControl",
    formControl: "single",
    supports: {
      disabled: true,
      invalid: true,
      required: true,
    },
    skeleton: "input-shaped",
    video: {
      id: "password-input",
      safe: true,
      acceptsChildren: false,
      motionGated: true,
      controlled: ["value", "visible"],
    },
    editableProps: [
      { prop: "variant", group: "Appearance", label: "Variant" },
      { prop: "rounded", group: "Appearance", label: "Rounded" },
      { prop: "fullWidth", group: "Layout", label: "Full width" },
      { prop: "clearable", group: "Field", label: "Clearable" },
      { prop: "kind", group: "Field", label: "Kind" },
      { prop: "placeholder", group: "Content", label: "Placeholder" },
      { prop: "disabled", group: "State", label: "Disabled" },
      { prop: "isLoading", group: "State", label: "Loading" },
      { prop: "visible", group: "State", label: "Visible" },
    ],
    typographyProp: {
      prop: "typography",
    },
    sizeProp: {
      prop: "size",
    },
  },
  render: (
    {
      visible: visibleProp,
      defaultVisible = false,
      onVisibleChange,
      kind = "password-current",
      inputMode: inputModeProp,
      autoComplete: autoCompleteProp,
      placeholder: placeholderProp,
      startIcon,
      ...rest
    },
    ref,
  ) => {
    const [uncontrolledVisible, setUncontrolledVisible] =
      useState(defaultVisible);
    const isVisibleControlled = visibleProp !== undefined;
    const visible = isVisibleControlled ? visibleProp : uncontrolledVisible;

    function setVisible(next: boolean) {
      if (!isVisibleControlled) setUncontrolledVisible(next);
      onVisibleChange?.(next);
    }

    const passwordDefaults = passwordKindDefaults[kind];
    const PasswordIcon = passwordKindIcons[kind];

    return renderBaseInput(
      {
        ...rest,
        type: visible ? "text" : "password",
        inputMode: inputModeProp ?? passwordDefaults.inputMode ?? "text",
        autoComplete:
          autoCompleteProp ??
          passwordDefaults.autoComplete ??
          (kind === "password-new" ? "new-password" : "current-password"),
        placeholder: placeholderProp ?? passwordDefaults.placeholder,
        startIcon: startIcon ?? (PasswordIcon ? <PasswordIcon /> : undefined),
        extraEndAdornment: ({ iconSize, iconButtonClass }) => (
          <button
            key="toggle-visibility"
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className={iconButtonClass}
          >
            {visible ? (
              <EyeOff style={{ width: iconSize, height: iconSize }} />
            ) : (
              <Eye style={{ width: iconSize, height: iconSize }} />
            )}
          </button>
        ),
      },
      ref,
    );
  },
});
