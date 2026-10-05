"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
} from "react";

import { cn } from "@/utils/cn";
import { useOptionalFormField } from "../FormField/FormField.context";
import { ClearIcon } from "../Input/Input.icons";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { useSizeStyle, useTheme, useTypography } from "@/hooks";
import type { TextareaCoreProps } from "./Textarea.types";
import { mergeRefs } from "@/utils/mergeRef";

function resolveFieldState({
  error,
  success,
  warning,
  hasReachedMaxLength,
  internalInvalid,
  fieldInvalid,
}: {
  error?: boolean;
  success?: boolean;
  warning?: boolean;
  hasReachedMaxLength: boolean;
  internalInvalid?: boolean;
  fieldInvalid?: boolean;
}) {
  const isInvalid =
    error === true ||
    hasReachedMaxLength ||
    internalInvalid === true ||
    fieldInvalid === true;

  const isSuccess = !isInvalid && (success ?? internalInvalid === false);
  const isWarning = !isInvalid && !isSuccess && warning === true;

  const state = isInvalid
    ? ("error" as const)
    : isSuccess
      ? ("success" as const)
      : isWarning
        ? ("warning" as const)
        : ("none" as const);

  return { isInvalid, isSuccess, isWarning, state };
}

export const TextareaCore = forwardRef<HTMLTextAreaElement, TextareaCoreProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onValueChange: onValueChangeProp,
      onChange: onChangeProp,
      onBlur: onBlurProp,

      className,
      style: customStyle,
      typography: typographyName = "body",

      size = "md",
      variant = "outline",
      resize = "vertical",

      fullWidth = true,
      embedded = false,

      autoResize = false,
      minRows,
      maxRows,

      clearable = false,
      onClear,

      characterCounter = false,
      debounceDelay = 0,
      trim = false,

      error,
      success,
      warning,

      validate,
      validateOn = "blur",

      disabled,
      id: externalId,
      required,

      maxLength,
      rows,

      ...props
    },
    ref,
  ) => {
    const autoId = useId();

    const field = useOptionalFormField();
    const { theme } = useTheme();

    const id = field?.id ?? externalId ?? autoId;

    const internalRef = useRef<HTMLTextAreaElement>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const typography = useTypography(typographyName);

    const { style: sizeStyle } = useSizeStyle(size, false, "textarea", {
      includeHeight: false,
    });

    const [draft, setDraft] = useState(() => valueProp ?? defaultValue ?? "");

    useEffect(() => {
      if (valueProp !== undefined) {
        setDraft(valueProp);
      }
    }, [valueProp]);

    const [internalValidation, setInternalValidation] = useState<{
      invalid?: boolean;
      message?: string;
    }>({});

    const maxLengthExceeded =
      maxLength !== undefined && draft.length > maxLength;

    const hasValue = draft.length > 0;
    const hasMaxLength = typeof maxLength === "number";
    const hasReachedMaxLength = hasMaxLength && draft.length >= maxLength;

    const maxLengthMessage = hasReachedMaxLength
      ? `Maximum length of ${maxLength} characters reached.`
      : undefined;

    const { isInvalid, isSuccess, isWarning, state } = useMemo(
      () =>
        resolveFieldState({
          error,
          success,
          warning,
          hasReachedMaxLength,
          internalInvalid: internalValidation.invalid,
          fieldInvalid: field?.invalid,
        }),
      [
        error,
        success,
        warning,
        hasReachedMaxLength,
        internalValidation.invalid,
        field?.invalid,
      ],
    );

    useEffect(() => {
      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }, []);

    function commitValue(
      next: string,
      { immediate = false }: { immediate?: boolean } = {},
    ) {
      setDraft(next);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (debounceDelay > 0 && !immediate) {
        debounceTimer.current = setTimeout(() => {
          onValueChangeProp?.(next);
        }, debounceDelay);
      } else {
        onValueChangeProp?.(next);
      }
    }

    function getValidationResult(value: string) {
      if (maxLength !== undefined && value.length >= maxLength) {
        return {
          invalid: true,
          message: maxLengthMessage,
        };
      }

      if (!validate) {
        return null;
      }

      const result = validate(value);

      if (result === true) {
        return {
          invalid: false,
          message: undefined,
        };
      }

      if (result === false) {
        return {
          invalid: true,
          message: undefined,
        };
      }

      return {
        invalid: true,
        message: result,
      };
    }

    function runValidation(value: string) {
      const result = getValidationResult(value);

      setInternalValidation(result ?? {});

      field?.reportValidity(result?.invalid ? result : null);
    }

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
      const next = event.target.value;

      commitValue(next);
      onChangeProp?.(event);

      const shouldValidate = validateOn === "change" || validateOn === "both";

      if (shouldValidate) {
        runValidation(next);
      } else if (internalValidation.invalid) {
        setInternalValidation({});
        field?.reportValidity(null);
      }
    }

    function handleBlur(event: FocusEvent<HTMLTextAreaElement>) {
      let finalValue = draft;

      if (trim) {
        const trimmed = draft.trim();

        if (trimmed !== draft) {
          commitValue(trimmed, {
            immediate: true,
          });

          finalValue = trimmed;
        }
      }

      if (validateOn === "blur" || validateOn === "both") {
        runValidation(finalValue);
      }
      onBlurProp?.(event);
    }

    function handleClear() {
      commitValue("", {
        immediate: true,
      });

      setInternalValidation({});

      field?.reportValidity(null);

      internalRef.current?.focus();

      onClear?.();
    }

    useLayoutEffect(() => {
      if (!autoResize) return;

      const element = internalRef.current;

      if (!element) return;

      const computed = window.getComputedStyle(element);

      const lineHeight =
        parseFloat(computed.lineHeight) || parseFloat(computed.fontSize) * 1.2;

      const paddingY =
        parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);

      const borderY =
        parseFloat(computed.borderTopWidth) +
        parseFloat(computed.borderBottomWidth);

      const minHeight =
        minRows !== undefined
          ? lineHeight * minRows + paddingY + borderY
          : undefined;

      const maxHeight =
        maxRows !== undefined
          ? lineHeight * maxRows + paddingY + borderY
          : undefined;

      element.style.height = "auto";

      let nextHeight = element.scrollHeight;

      if (minHeight !== undefined) {
        nextHeight = Math.max(nextHeight, minHeight);
      }

      if (maxHeight !== undefined) {
        nextHeight = Math.min(nextHeight, maxHeight);
      }

      element.style.height = `${nextHeight}px`;

      element.style.overflowY =
        maxHeight !== undefined && element.scrollHeight > maxHeight
          ? "auto"
          : "hidden";
    }, [autoResize, draft, minRows, maxRows]);

    const showClear = clearable && hasValue && !disabled;

    const showCounter = characterCounter;
    const nearLimit =
      hasMaxLength && draft.length >= Math.max(0, maxLength - 10);

    const needsBottomSpace = showClear || showCounter;

    const messageId =
      !field?.describedBy && (isInvalid || isSuccess)
        ? `${id}-message`
        : undefined;

    const counterId = showCounter ? `${id}-counter` : undefined;

    const describedBy =
      cn(field?.describedBy, messageId, counterId).trim() || undefined;

    const wrapperClassName = resolveRecipe(theme.recipes.FormControl, {
      variant,
      state,
      fullWidth,
      disabled: !!disabled,
      embedded,
    });

    const textareaClasses = resolveRecipe(theme.recipes.Textarea, {
      variant,
      resize,
      autoResize,
    });

    const textareaStyle: CSSProperties = {
      ...typography,
      ...sizeStyle,
      ...customStyle,
    };

    if (needsBottomSpace) {
      const existingBottom = sizeStyle.paddingBottom;

      textareaStyle.paddingBottom = existingBottom
        ? `calc(${existingBottom} + 1.25rem)`
        : "1.5rem";
    }

    const counterClassName = cn(
      "pointer-events-none absolute",
      "bottom-1.5 right-2.5",
      "font-mono text-[11px]",
      maxLengthExceeded
        ? "text-destructive"
        : hasReachedMaxLength
          ? "text-warning"
          : nearLimit
            ? "text-warning"
            : "text-text-muted",
    );

    return (
      <div className={cn(wrapperClassName, "items-start py-2")}>
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
          aria-required={required}
          required={required}
          style={textareaStyle}
          className={cn(textareaClasses, className)}
          data-size={size}
          data-invalid={isInvalid || undefined}
          data-success={isSuccess || undefined}
          data-warning={isWarning || undefined}
          data-disabled={disabled || undefined}
          data-autoresize={autoResize || undefined}
          data-maxlength-reached={hasReachedMaxLength || undefined}
          {...props}
        />

        {showClear && (
          <button
            type="button"
            aria-label="Clear textarea"
            onClick={handleClear}
            className={cn(
              "absolute right-2 top-2",
              "flex items-center justify-center",
              "text-text-muted",
              "transition-colors",
              "hover:text-text",
            )}
          >
            <ClearIcon size={14} />
          </button>
        )}

        {showCounter && (
          <div id={counterId} className={counterClassName}>
            {draft.length}
            {maxLength ? `/${maxLength}` : ""}
          </div>
        )}

        {internalValidation.message && !field && (
          <p
            id={messageId}
            role="alert"
            className={cn("mt-1.5 px-0.5", "text-xs text-destructive")}
          >
            {internalValidation.message}
          </p>
        )}
      </div>
    );
  },
);

TextareaCore.displayName = "TextareaCore";
