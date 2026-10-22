"use client";

import { useId, useRef, useState, forwardRef, useMemo, useEffect } from "react";
import { cn } from "@/utils/cn";
import {
  toggleWrap,
  toggleLinePrefix,
  toggleListPrefix,
  toggleCode,
  insertLink,
  type TextEdit,
} from "./markdownActions";
import type { MarkdownEditorProps } from "./MarkdownEditor.types";
import {
  Heading as HeadingIcon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  ListOrdered as OrderedListIcon,
  ClipboardList as ChecklistIcon,
  Code as CodeIcon,
  Link as LinkIcon,
} from "lucide-react";
import { TextareaCore } from "../Textarea";
import { isDev } from "@/utils/env";

type Action = (value: string, start: number, end: number) => TextEdit;

const TOOLBAR: Array<{ label: string; icon: typeof BoldIcon; action: Action }> =
  [
    {
      label: "Heading",
      icon: HeadingIcon,
      action: (v, s, e) => toggleLinePrefix(v, s, e, "### "),
    },
    {
      label: "Bold",
      icon: BoldIcon,
      action: (v, s, e) => toggleWrap(v, s, e, "**"),
    },
    {
      label: "Italic",
      icon: ItalicIcon,
      action: (v, s, e) => toggleWrap(v, s, e, "_"),
    },
    {
      label: "Ordered list",
      icon: OrderedListIcon,
      action: (v, s, e) => toggleListPrefix(v, s, e, (i) => `${i + 1}. `),
    },
    {
      label: "Checklist",
      icon: ChecklistIcon,
      action: (v, s, e) => toggleListPrefix(v, s, e, () => "- [ ] "),
    },
    { label: "Code", icon: CodeIcon, action: toggleCode },
    { label: "Link", icon: LinkIcon, action: insertLink },
  ];

export const MarkdownEditor = forwardRef<
  HTMLTextAreaElement,
  MarkdownEditorProps
>(
  (
    {
      renderMarkdown,
      tab: tabProp,
      defaultTab = "write",
      onTabChange,
      hint = "Markdown is supported",
      value: valueProp,
      defaultValue,
      onValueChange,
      className,
      ...textareaProps
    },
    ref,
  ) => {
    const baseId = useId();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [uncontrolledTab, setUncontrolledTab] = useState<"write" | "preview">(
      defaultTab,
    );
    const tab = tabProp ?? uncontrolledTab;

    const [draft, setDraft] = useState(() => valueProp ?? defaultValue ?? "");
    const value = valueProp ?? draft;

    function setTab(next: "write" | "preview") {
      if (tabProp === undefined) setUncontrolledTab(next);
      onTabChange?.(next);
    }

    function commit(next: string) {
      setDraft(next);
      onValueChange?.(next);
    }

    function runAction(action: Action) {
      const el = textareaRef.current;
      if (!el) return;

      const { selectionStart, selectionEnd } = el;
      const edit = action(
        value,
        selectionStart ?? value.length,
        selectionEnd ?? value.length,
      );

      commit(edit.value);
      el.focus();
      requestAnimationFrame(() => {
        el.setSelectionRange(edit.selectionStart, edit.selectionEnd);
      });
    }

    const tablistId = `${baseId}-tablist`;
    const writePanelId = `${baseId}-write-panel`;
    const previewPanelId = `${baseId}-preview-panel`;

    const renderedPreview = useMemo(
      () => (renderMarkdown ? renderMarkdown(value) : null),
      [renderMarkdown, value],
    );

    useEffect(() => {
      if (isDev() && !renderMarkdown) {
        console.warn(
          "[kreativ-ui/MarkdownEditor]: no `renderMarkdown` prop was provided, so the " +
            "Preview tab is just showing plain text with no markdown formatting applied. " +
            "Pass a `renderMarkdown={(value) => ReactNode}` function — e.g. using " +
            "react-markdown — to enable a real preview:\n\n" +
            "  import ReactMarkdown from 'react-markdown';\n" +
            "  <Textarea allowMarkdown renderMarkdown={(v) => <ReactMarkdown>{v}</ReactMarkdown>} />",
        );
      }
    }, [renderMarkdown]);

    return (
      <div
        className={cn(
          "rounded-(--kui-radii-md) border border-border",
          className,
        )}
      >
        <div
          role="tablist"
          aria-label="Markdown editor mode"
          id={tablistId}
          className="flex items-center gap-4 border-b border-border px-3"
        >
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`${baseId}-${t}-tab`}
              aria-selected={tab === t}
              aria-controls={t === "write" ? writePanelId : previewPanelId}
              onClick={() => setTab(t)}
              className={cn(
                "border-b-2 py-2.5 text-sm capitalize transition-colors",
                tab === t
                  ? "border-brand text-text"
                  : "border-transparent text-text-muted hover:text-text",
              )}
            >
              {t}
            </button>
          ))}

          {tab === "write" && (
            <div className="ml-auto flex items-center gap-1 py-1.5">
              {TOOLBAR.map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => runAction(action)}
                  className="rounded-(--kui-radii-sm) p-1.5 text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          id={writePanelId}
          role="tabpanel"
          aria-labelledby={`${baseId}-write-tab`}
          hidden={tab !== "write"}
        >
          <TextareaCore
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref)
                (ref as { current: HTMLTextAreaElement | null }).current = node;
            }}
            value={value}
            onValueChange={commit}
            resize="vertical"
            variant="ghost"
            className="rounded-none border-0"
            {...textareaProps}
          />
        </div>

        <div
          id={previewPanelId}
          role="tabpanel"
          aria-labelledby={`${baseId}-preview-tab`}
          hidden={tab !== "preview"}
          className="min-h-32 p-3 text-sm text-text"
        >
          {renderMarkdown ? (
            renderedPreview
          ) : (
            <span className="text-text-muted">
              No renderMarkdown provided — showing raw text.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-border px-3 py-2 text-xs text-text-muted">
          {hint}
        </div>
      </div>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";
