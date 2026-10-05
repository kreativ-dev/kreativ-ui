import type { ReactNode } from "react";
import { TextareaCoreProps } from "../Textarea";

export type MarkdownEditorTabs = "write" | "preview";

export interface MarkdownEditorProps extends Omit<
  TextareaCoreProps,
  "resize" | "autoResize"
> {
  /** Renders the Preview tab. Omit and Preview shows raw text with a dev warning. */
  renderMarkdown?: (value: string) => ReactNode;

  tab?: MarkdownEditorTabs;
  defaultTab?: MarkdownEditorTabs;
  onTabChange?: (tab: MarkdownEditorTabs) => void;

  hint?: ReactNode;
}
