import { TextareaHTMLAttributes } from "react";
import { InputVariant } from "../Input/Input.types";
import type { MarkdownEditorProps } from "../MarkdownEditor/MarkdownEditor.types";
import {
  BaseProps,
  ClearableProps,
  EmbeddedProps,
  FullWidthProps,
  SizeProps,
  StateProps,
  TrimProps,
  TypographyProps,
  ValidateProps,
  ValueProps,
  VariantProps,
} from "@/types";

export type TextareaResize = "none" | "both" | "horizontal" | "vertical";

export interface TextareaCoreProps
  extends
    Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      "size" | "defaultValue" | "value"
    >,
    Omit<BaseProps, "unstyled" | "style">,
    SizeProps,
    StateProps,
    VariantProps<InputVariant>,
    ClearableProps,
    ValueProps,
    FullWidthProps,
    EmbeddedProps,
    StateProps,
    TrimProps,
    ValidateProps<string>,
    TypographyProps {
  resize?: TextareaResize;

  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  characterCounter?: boolean;
  debounceDelay?: number;
}

// Fixed union
export type TextareaProps =
  | ({ allowMarkdown?: false } & TextareaCoreProps)
  | ({ allowMarkdown: true } & Omit<TextareaCoreProps, "resize"> &
      MarkdownEditorProps);
