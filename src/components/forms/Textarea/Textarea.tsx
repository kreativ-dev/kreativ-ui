import { forwardRef } from "react";
import { TextareaCore } from "./Textarea.core";
import { MarkdownEditor } from "../MarkdownEditor/MarkdownEditor";
import type { TextareaProps, TextareaCoreProps } from "./Textarea.types";
import type { MarkdownEditorProps } from "../MarkdownEditor/MarkdownEditor.types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ allowMarkdown, ...props }, ref) => {
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
);

Textarea.displayName = "Textarea";
