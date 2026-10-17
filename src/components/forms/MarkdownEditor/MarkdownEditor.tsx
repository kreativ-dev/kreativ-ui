"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import {
  composeRefs,
  createComponent,
  isMotionGated,
  type MotionGatedProps,
  useTheme,
} from "@splenddev/kreativ-core";

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
  Strikethrough as StrikethroughIcon,
  Quote as QuoteIcon,
  ListOrdered as OrderedListIcon,
  ClipboardList as ChecklistIcon,
  Code as CodeIcon,
  Link as LinkIcon,
} from "lucide-react";
import { isDev } from "@/utils/env";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { useOptionalFormField } from "../FormField/FormField.context";
import { TextareaCore } from "../Textarea/Textarea.core";

type Action = (value: string, start: number, end: number) => TextEdit;

type ToolbarItem = {
  label: string;
  icon: typeof BoldIcon;
  action: Action;
  shortcutKey?: string;
};

const TOOLBAR: ToolbarItem[] = [
  {
    label: "Heading",
    icon: HeadingIcon,
    action: (v, s, e) => toggleLinePrefix(v, s, e, "### "),
  },
  {
    label: "Bold",
    icon: BoldIcon,
    action: (v, s, e) => toggleWrap(v, s, e, "**"),
    shortcutKey: "b",
  },
  {
    label: "Italic",
    icon: ItalicIcon,
    action: (v, s, e) => toggleWrap(v, s, e, "_"),
    shortcutKey: "i",
  },
  {
    label: "Strikethrough",
    icon: StrikethroughIcon,
    action: (v, s, e) => toggleWrap(v, s, e, "~~"),
  },
  {
    label: "Quote",
    icon: QuoteIcon,
    action: (v, s, e) => toggleLinePrefix(v, s, e, "> "),
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
  { label: "Link", icon: LinkIcon, action: insertLink, shortcutKey: "k" },
];

const SHORTCUT_MAP = new Map(
  TOOLBAR.filter((item) => item.shortcutKey).map((item) => [
    item.shortcutKey as string,
    item,
  ]),
);

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.platform);
const modLabel = isMac ? "⌘" : "Ctrl";

function shortcutHint(item: ToolbarItem) {
  if (!item.shortcutKey) return item.label;
  return `${item.label} (${modLabel}+${item.shortcutKey.toUpperCase()})`;
}

export const MarkdownEditor = createComponent<
  MarkdownEditorProps & MotionGatedProps,
  HTMLTextAreaElement
>({
  displayName: "MarkdownEditor",
  __kui: {
    role: "formControl",
    formControl: "single",
    supports: { disabled: true, invalid: true, required: true },
    skeleton: "input-shaped",
    video: {
      id: "markdown-editor",
      safe: true,
      acceptsChildren: false,
      interactionStates: ["focus"],
      controlled: ["value", "disabled"],
      motionGated: true,
    },
  },
  render: (
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
      fullWidth,
      variant = "outline",
      success,
      error,
      warning,
      disabled,
      maxLength,
      ...textareaProps
    },
    ref,
  ) => {
    const baseId = useId();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { theme } = useTheme();
    const field = useOptionalFormField();
    const motionGated = isMotionGated(textareaProps);
    const isDisabled = disabled || Boolean(field?.disabled);

    const [uncontrolledTab, setUncontrolledTab] = useState<"write" | "preview">(
      defaultTab,
    );
    const tab = tabProp ?? uncontrolledTab;

    const footerMessage = hint;

    const [draft, setDraft] = useState(() => valueProp ?? defaultValue ?? "");
    const value = valueProp ?? draft;
    const maxLengthReached =
      typeof maxLength === "number" && value.length >= maxLength;

    const state =
      error || maxLengthReached
        ? "error"
        : success
          ? "success"
          : warning
            ? "warning"
            : (field?.status ?? "none");

    const editorClasses = cn(
      resolveRecipe(theme.recipes.MarkdownEditor, {
        variant,
        state,
        fullWidth,
        disabled: isDisabled,
      }),
      className,
    );

    function setTab(next: "write" | "preview") {
      if (tabProp === undefined) setUncontrolledTab(next);
      onTabChange?.(next);
    }

    function commit(next: string) {
      setDraft(next);
      onValueChange?.(next);
    }

    function runAction(action: Action) {
      if (isDisabled) return;

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
      const place = () => {
        el.setSelectionRange(edit.selectionStart, edit.selectionEnd);
      };
      if (motionGated) place();
      else requestAnimationFrame(place);
    }

    // Keyboard shortcuts (Mod+B / Mod+I / Mod+K, ...). Scoped to this
    // editor instance (onKeyDown on the write panel), not a document-wide
    // listener. Skipped while composing with an IME, and only
    // preventDefault when an action actually handles the key so any
    // unmapped combination falls through to native/browser behavior.
    function handleToolbarKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      if (isDisabled) return;
      if (event.nativeEvent.isComposing) return;

      const mod = isMac ? event.metaKey : event.ctrlKey;
      if (!mod || event.altKey) return;

      const key = event.key.toLowerCase();
      const item = SHORTCUT_MAP.get(key);
      if (!item) return;

      event.preventDefault();
      runAction(item.action);
    }

    const writePanelId = `${baseId}-write-panel`;
    const previewPanelId = `${baseId}-preview-panel`;

    const renderedPreview = useMemo(
      () => (renderMarkdown ? renderMarkdown(value) : null),
      [renderMarkdown, value],
    );

    useEffect(() => {
      if (isDev() && !renderMarkdown) {
        console.warn(
          "[kreativ-ui/MarkdownEditor]: no renderMarkdown prop was provided, so the " +
            "Preview tab is showing plain text. Pass renderMarkdown={(value) => ReactNode}.",
        );
      }
    }, [renderMarkdown]);

    return (
      <div className={editorClasses}>
        <div
          role="tablist"
          aria-label="Markdown editor mode"
          id={`${baseId}-tablist`}
          className="flex items-center gap-4 border-b border-kui-border px-3"
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
              disabled={isDisabled}
              className={cn(
                "border-b-2 py-2.5 text-sm capitalize",
                !motionGated && "transition-colors",
                "disabled:pointer-events-none disabled:cursor-not-allowed",
                tab === t
                  ? "border-kui-brand text-kui-text"
                  : "border-transparent text-kui-text-muted hover:text-kui-text",
              )}
            >
              {t}
            </button>
          ))}

          {tab === "write" && (
            <div className="ml-auto flex items-center gap-1 py-1.5 overflow-x-auto kui-scrollbar">
              {TOOLBAR.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  aria-label={shortcutHint(item)}
                  title={shortcutHint(item)}
                  // Prevent the default mousedown so focus/selection never
                  // leaves the textarea before the click fires — otherwise
                  // the selection the action is about to use can already
                  // be gone by the time onClick runs (notably on
                  // Firefox/Safari).
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => runAction(item.action)}
                  disabled={isDisabled}
                  className={cn(
                    "rounded-(--kui-radii-sm) p-1.5 text-kui-text-muted hover:bg-kui-surface-raised hover:text-kui-text disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    !motionGated && "transition-colors",
                  )}
                >
                  <item.icon size={15} />
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
          onKeyDown={handleToolbarKeyDown}
        >
          <TextareaCore
            ref={composeRefs(textareaRef, ref)}
            value={value}
            onValueChange={commit}
            embedded
            resize="vertical"
            disabled={isDisabled}
            maxLength={maxLength}
            {...textareaProps}
          />
        </div>

        <div
          id={previewPanelId}
          role="tabpanel"
          aria-labelledby={`${baseId}-preview-tab`}
          hidden={tab !== "preview"}
          className="min-h-32 p-3 text-sm text-kui-text"
        >
          {renderMarkdown ? (
            renderedPreview
          ) : (
            <span className="text-kui-text-muted">
              No renderMarkdown provided — showing raw text.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-kui-border px-3 py-2 text-xs z-1">
          {footerMessage}
        </div>
      </div>
    );
  },
});
