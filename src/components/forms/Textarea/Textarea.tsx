"use client";

import { createComponent } from "@splenddev/kreativ-core";

import { TextareaCore } from "./Textarea.core";
import { MarkdownEditor } from "../MarkdownEditor/MarkdownEditor";
import type { TextareaProps, TextareaCoreProps } from "./Textarea.types";
import type { MarkdownEditorProps } from "../MarkdownEditor/MarkdownEditor.types";

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
  render: ({ allowMarkdown, ...props }, ref) => {
    if (allowMarkdown) {
      return (
        <MarkdownEditor
          ref={ref}
          {...(props as MarkdownEditorProps)}
          embedded
        />
      );
    }
    return <TextareaCore ref={ref} {...(props as TextareaCoreProps)} />;
  },
});
