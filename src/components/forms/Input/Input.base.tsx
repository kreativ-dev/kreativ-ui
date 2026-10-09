"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ChangeEvent,
  type FocusEvent,
  type ForwardedRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { composeRefs, useTheme } from "@splenddev/kreativ-core";
import { useSizeStyle, useTypography } from "@splenddev/kreativ-core/hooks";

import { cn } from "@/utils";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import {
  useClearableField,
  useKeyboardShortcuts,
  useStatusTransition,
} from "@/hooks";

import { ClearIcon, Spinner } from "./Input.icons";
import { Adornment } from "../../Adornment";
import { useOptionalFormField } from "../FormField/FormField.context";
import { BaseInputProps } from "./Input.types";

function StaticSpinnerMark({ size }: { size: number | string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block rounded-full border-2 border-current opacity-70"
      style={{ width: size, height: size }}
    />
  );
}

function iconButtonClass(motion: boolean) {
  return cn(
    "flex items-center justify-center text-kui-text-muted hover:text-kui-text",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    motion && "transition-colors",
  );
}

function ClearButton({
  size,
  className,
  onClear,
}: {
  size: number | string;
  className: string;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label="Clear input"
      className={className}
    >
      <ClearIcon style={{ width: size, height: size }} />
    </button>
  );
}

export function renderBaseInput(
  {
    className,
    inputClassName,

    variant = "outline",
    size = "md",

    error,
    success,
    warning,
    scrollIntoViewOnError,

    startIcon,
    endIcon,

    fullWidth = true,
    disabled = false,
    rounded = false,

    isLoading = false,

    clearable = false,
    onClear,
    onUndo,
    onRedo,

    id: externalId,

    trim = false,

    type,
    inputMode,
    autoComplete,
    placeholder,

    onChange: onChangeProp,
    onValueChange: onValueChangeProp,
    onBlur: onBlurProp,

    value,
    defaultValue,

    style,
    typography: typographyName = "body",

    motion = true,
    extraEndAdornment,
    pattern: patternProp,
    patternMessage,

    embedded = false,

    ...props
  }: BaseInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const autoId = useId();
  const internalRef = useRef<HTMLInputElement>(null);

  const { theme } = useTheme();
  const field = useOptionalFormField();
  const typography = useTypography(typographyName);

  const { hasValue, setHasValue, clear, undo, redo, canUndo, canRedo } =
    useClearableField(internalRef, value ?? defaultValue, {
      onClear,
      onRedo,
      onUndo,
    });

  const shortcutRef = useKeyboardShortcuts(
    clearable,
    { "ctrl+z": undo, "ctrl+shift+z": redo },
    [clearable, canUndo, canRedo, undo, redo],
  );

  const id = externalId ?? field?.id ?? autoId;
  const isRequired = field?.required ?? props.required;
  const describedBy = field?.describedBy;

  const state = error
    ? "error"
    : success
      ? "success"
      : warning
        ? "warning"
        : (field?.status ?? "none");

  const isInvalid = state === "error";
  const isDisabled = disabled || isLoading;

  const statusTransition = useStatusTransition(state, { enabled: motion });

  const { style: sizeStyle, iconSize } = useSizeStyle(size, false, "input");
  const resolvedIconSize = iconSize || 14;

  const composedInputRef = useMemo(
    () => composeRefs(internalRef, ref, shortcutRef),
    [ref, shortcutRef],
  );

  const wrapperClasses = useMemo(
    () =>
      cn(
        resolveRecipe(theme.recipes.FormControl, {
          variant,
          state,
          rounded,
          fullWidth,
          disabled: isDisabled,
          embedded,
          hasAdornment:
            Boolean(startIcon) ||
            Boolean(endIcon) ||
            clearable ||
            isLoading ||
            Boolean(extraEndAdornment),
        }),
        className,
      ),
    [
      theme,
      variant,
      state,
      rounded,
      fullWidth,
      isDisabled,
      startIcon,
      endIcon,
      clearable,
      isLoading,
      extraEndAdornment,
      className,
    ],
  );

  const inputClasses = useMemo(
    () => cn(resolveRecipe(theme.recipes.Input, { variant }), inputClassName),
    [theme, variant, inputClassName],
  );

  const resolvedStyle = useMemo(
    () => ({ ...typography, ...sizeStyle, ...style }),
    [typography, sizeStyle, style],
  );

  const buttonClass = iconButtonClass(motion);

  const extra =
    typeof extraEndAdornment === "function"
      ? extraEndAdornment({
          iconSize: resolvedIconSize,
          iconButtonClass: buttonClass,
        })
      : extraEndAdornment;

  useEffect(() => {
    if (value !== undefined) setHasValue(Boolean(value));
  }, [value, setHasValue]);

  const wasInvalidRef = useRef(isInvalid);
  useEffect(() => {
    const justBecameInvalid = isInvalid && !wasInvalidRef.current;
    wasInvalidRef.current = isInvalid;

    if (!justBecameInvalid || !scrollIntoViewOnError) return;

    internalRef.current?.scrollIntoView({
      behavior: motion ? "smooth" : "auto",
      block: "center",
    });
  }, [isInvalid, scrollIntoViewOnError, motion]);

  useEffect(() => {
    const el = internalRef.current;
    if (!el || !patternMessage) return;

    const apply = () => {
      if (el.validity.patternMismatch) {
        el.setCustomValidity(patternMessage);
      } else if (el.validationMessage === patternMessage) {
        el.setCustomValidity("");
      }
    };

    apply();
    el.addEventListener("input", apply);

    return () => {
      el.removeEventListener("input", apply);
      if (el.validationMessage === patternMessage) {
        el.setCustomValidity("");
      }
    };
  }, [patternMessage]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(event.target.value));
      onChangeProp?.(event);
      onValueChangeProp?.(event.target.value);
    },
    [setHasValue, onChangeProp, onValueChangeProp],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const el = event.currentTarget;

      if (trim && !isDisabled) {
        const trimmed = el.value.trim();

        if (trimmed !== el.value) {
          if (value === undefined) {
            el.value = trimmed;
          }
          setHasValue(Boolean(trimmed));
          onValueChangeProp?.(trimmed);
        }
      }

      onBlurProp?.(event);
    },
    [trim, isDisabled, value, setHasValue, onValueChangeProp, onBlurProp],
  );

  const builtInEnd: ReactNode[] = [];

  if (extra) builtInEnd.push(extra);

  if (clearable && hasValue && !isDisabled) {
    builtInEnd.push(
      <ClearButton
        key="clear"
        size={resolvedIconSize}
        className={buttonClass}
        onClear={clear}
      />,
    );
  }

  const endAdornment = isLoading ? (
    <Adornment position="end">
      {motion ? (
        <Spinner size={resolvedIconSize} />
      ) : (
        <StaticSpinnerMark size={resolvedIconSize} />
      )}
    </Adornment>
  ) : endIcon || builtInEnd.length > 0 ? (
    <Adornment position="end">
      {endIcon && (
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: resolvedIconSize, height: resolvedIconSize }}
          aria-hidden="true"
        >
          {endIcon}
        </span>
      )}
      {builtInEnd}
    </Adornment>
  ) : null;

  return (
    <div
      className={wrapperClasses}
      style={resolvedStyle}
      data-state={state}
      data-state-transition={motion ? statusTransition : undefined}
    >
      {startIcon && (
        <Adornment position="start">
          <span
            className="flex shrink-0 items-center justify-center"
            style={{ width: resolvedIconSize, height: resolvedIconSize }}
          >
            {startIcon}
          </span>
        </Adornment>
      )}

      <input
        {...props}
        ref={composedInputRef}
        id={id}
        type={type}
        inputMode={
          inputMode as InputHTMLAttributes<HTMLInputElement>["inputMode"]
        }
        pattern={patternProp}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy}
        aria-required={isRequired || undefined}
        className={inputClasses}
        data-disabled={disabled || undefined}
        data-loading={isLoading || undefined}
        data-size={size}
        data-state={state}
        data-variant={variant}
      />

      {endAdornment}
    </div>
  );
}
