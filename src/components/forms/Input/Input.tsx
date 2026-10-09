"use client";

import type { ReactNode } from "react";

import { createComponent } from "@splenddev/kreativ-core/utils";

import { inputKindDefaults } from "./Input.constants";
import { inputKindIcons } from "./Input.icons";
import type { InputProps } from "./Input.types";
import { renderBaseInput } from "./Input.base";

export const Input = createComponent<InputProps, HTMLInputElement>({
  displayName: "Input",
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
      id: "input",
      safe: true,
      acceptsChildren: false,
      motionGated: true,
      controlled: ["value"],
    },
    editableProps: [
      { prop: "variant", group: "Appearance", label: "Variant" },
      { prop: "rounded", group: "Appearance", label: "Rounded" },
      { prop: "fullWidth", group: "Layout", label: "Full width" },
      { prop: "kind", group: "Field", label: "Kind" },
      { prop: "hideKindIcon", group: "Field", label: "Hide kind icon" },
      { prop: "clearable", group: "Field", label: "Clearable" },
      { prop: "placeholder", group: "Content", label: "Placeholder" },
      { prop: "disabled", group: "State", label: "Disabled" },
      { prop: "isLoading", group: "State", label: "Loading" },
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
      kind = "text",
      hideKindIcon = false,
      type: typeProp,
      inputMode: inputModeProp,
      autoComplete: autoCompleteProp,
      placeholder: placeholderProp,
      startIcon,
      ...rest
    },
    ref,
  ) => {
    const kindDefaults = inputKindDefaults[kind];
    const KindIcon = inputKindIcons[kind];

    const resolvedStartIcon: ReactNode =
      startIcon ?? (!hideKindIcon && KindIcon ? <KindIcon /> : undefined);

    return renderBaseInput(
      {
        ...rest,
        type: typeProp! ?? kindDefaults.type,
        inputMode: inputModeProp ?? kindDefaults.inputMode,
        autoComplete: autoCompleteProp ?? kindDefaults.autoComplete,
        placeholder: placeholderProp ?? kindDefaults.placeholder,
        startIcon: resolvedStartIcon,
      },
      ref,
    );
  },
});
