"use client";

import { createComponent } from "@splenddev/kreativ-core";

import { TextareaCore } from "./Textarea.core";
import type { TextareaProps, TextareaCoreProps } from "./Textarea.types";

export const Textarea = createComponent<TextareaProps, HTMLTextAreaElement>({
  displayName: "Textarea",
  __kui: {
    role: "formControl",
    formControl: "single",
    supports: { disabled: true, invalid: true, required: true },
    skeleton: "input-shaped",
    video: {
      id: "textarea",
      safe: true,
      acceptsChildren: false,
      interactionStates: ["focus"],
      controlled: ["value", "disabled"],
      motionGated: true,
    },
  },
  render: (props, ref) => {
    return <TextareaCore ref={ref} {...(props as TextareaCoreProps)} />;
  },
});
