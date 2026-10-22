"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type MutableRefObject,
  type Ref,
  type CSSProperties,
} from "react";
import { cn } from "@/utils/cn";
import { useOptionalFormField } from "../FormField/FormField.context";
import { useSizeStyle } from "@/hooks/useSizeStyle";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { ClearIcon } from "../Input/Input.icons";
import { textareaBase, textareaResizeVariants } from "./Textarea.styles";
import type { TextareaCoreProps } from "./Textarea.types";
import { useTheme } from "@/hooks";

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((r) => {
      if (!r) return;
      if (typeof r === "function") r(node);
      else (r as MutableRefObject<T | null>).current = node;
    });
  };
}

export const TextareaCore = forwardRef<HTMLTextAreaElement, TextareaCoreProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue,
      size = "md",
      fullWidth = true,
      resize = "vertical",
      autoResize = false,
      minRows,
      maxRows,
      clearable = false,
      onClear,
      characterCounter = false,
      debounceDelay = 0,
      trimOnBlur = false,
      error,
      success,
      onValidate,
      disabled,
      id: externalId,
      maxLength,
      variant = "outline",
      onValueChange: onValueChangeProp,
      onChange: onChangeProp,
      onBlur: onBlurProp,
      rows,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const field = useOptionalFormField();
    const id = field?.id ?? externalId ?? autoId;
    const {theme}=useTheme()

    const internalRef = useRef<HTMLTextAreaElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [draft, setDraft] = useState(() => valueProp ?? defaultValue ?? "");

    useEffect(() => {
      if (valueProp !== undefined) setDraft(valueProp);
    }, [valueProp]);

    const [internalValidation, setInternalValidation] = useState<{
      invalid?: boolean;
      message?: string;
    }>({});

    const isInvalid =
      error ?? field?.invalid ?? internalValidation.invalid ?? false;
    const isSuccess =
      success ?? (onValidate ? internalValidation.invalid === false : false);
    const state = isInvalid ? "error" : isSuccess ? "success" : "none";

    useEffect(
      () => () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
      },
      [],
    );

    function commitValue(next: string, { immediate = false } = {}) {
      setDraft(next);

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      if (debounceDelay > 0 && !immediate) {
        debounceTimer.current = setTimeout(() => {
          onValueChangeProp?.(next);
        }, debounceDelay);
      } else {
        onValueChangeProp?.(next);
      }
    }

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
      commitValue(e.target.value);
      onChangeProp?.(e);
    }

    function runValidation(next: string) {
      if (!onValidate || error !== undefined || success !== undefined) return;

      const result = onValidate(next);
      const parsed =
        result === true
          ? { invalid: false, message: undefined }
          : result === false
            ? { invalid: true, message: undefined }
            : { invalid: true, message: result };

      setInternalValidation(parsed);
      field?.reportValidity(parsed.invalid ? parsed : null);
    }

    function handleBlur(e: FocusEvent<HTMLTextAreaElement>) {
      let finalValue = draft;

      if (trimOnBlur) {
        const trimmed = draft.trim();
        if (trimmed !== draft) {
          commitValue(trimmed, { immediate: true });
          finalValue = trimmed;
        }
      }

      runValidation(finalValue);
      onBlurProp?.(e);
    }

    function handleClear() {
      commitValue("", { immediate: true });
      internalRef.current?.focus();
      setInternalValidation({});
      field?.reportValidity(null);
      onClear?.();
    }

    useLayoutEffect(() => {
      if (!autoResize) return;
      const el = internalRef.current;
      if (!el) return;

      const computed = window.getComputedStyle(el);
      const lineHeight =
        parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2;
      const paddingY =
        parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
      const borderY =
        parseFloat(computed.borderTopWidth) +
        parseFloat(computed.borderBottomWidth);

      const minHeight = minRows
        ? lineHeight * minRows + paddingY + borderY
        : undefined;
      const maxHeight = maxRows
        ? lineHeight * maxRows + paddingY + borderY
        : undefined;

      el.style.height = "auto";
      let next = el.scrollHeight;
      if (minHeight) next = Math.max(next, minHeight);
      if (maxHeight) next = Math.min(next, maxHeight);
      el.style.height = `${next}px`;
      el.style.overflowY =
        maxHeight && el.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [autoResize, draft, minRows, maxRows]);

    const hasValue = draft.length > 0;
    const showClear = clearable && hasValue && !disabled;
    const showCounter = characterCounter;
    const nearLimit = maxLength ? draft.length >= maxLength * 0.9 : false;
    const needsBottomSpace = showClear || showCounter;

    const messageId =
      !field?.describedBy && (isInvalid || isSuccess)
        ? `${id}-message`
        : undefined;
    const counterId = showCounter ? `${id}-counter` : undefined;
    const describedBy =
      cn(field?.describedBy, messageId, counterId).trim() || undefined;

    const wrapperClassName = cn(
      resolveRecipe(theme.recipes.FormControl, {
        variant,
        state,
        fullWidth,
        disabled: !!disabled,
      }),
      "items-start",
      className,
    );

    const { style: sizeStyle } = useSizeStyle(size, false, "textarea", {
      includeHeight: false,
    });

    const textareaStyle: CSSProperties = { ...sizeStyle };
    if (needsBottomSpace) {
      const existingBottom = sizeStyle.paddingBottom;
      textareaStyle.paddingBottom = existingBottom
        ? `calc(${existingBottom} + 1.25rem)`
        : "1.5rem";
    }

    return (
      <div className={wrapperClassName}>
        <textarea
          ref={mergeRefs(internalRef, ref)}
          id={id}
          value={draft}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={maxLength}
          rows={autoResize ? undefined : (rows ?? minRows)}
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          style={textareaStyle}
          className={cn(
            textareaBase,
            !autoResize && textareaResizeVariants[resize],
            autoResize && "resize-none overflow-hidden",
          )}
          data-size={size}
          data-invalid={isInvalid || undefined}
          data-success={isSuccess || undefined}
          data-disabled={disabled || undefined}
          data-autoresize={autoResize || undefined}
          {...props}
        />

        {showClear && (
          <button
            type="button"
            aria-label="Clear textarea"
            onClick={handleClear}
            className="absolute right-2 top-2 flex items-center justify-center text-text-muted transition-colors hover:text-text"
          >
            <ClearIcon size={14} />
          </button>
        )}

        {showCounter && (
          <div
            id={counterId}
            className={cn(
              "pointer-events-none absolute bottom-1.5 right-2.5 font-mono text-[11px]",
              nearLimit ? "text-danger" : "text-text-muted",
            )}
          >
            {draft.length}
            {maxLength ? `/${maxLength}` : ""}
          </div>
        )}

        {internalValidation.message && !field && (
          <p
            id={messageId}
            role="alert"
            className="mt-1.5 px-0.5 text-xs text-danger"
          >
            {internalValidation.message}
          </p>
        )}
      </div>
    );
  },
);

TextareaCore.displayName = "TextareaCore";
