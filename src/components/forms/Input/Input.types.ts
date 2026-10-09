import type {
  ComponentPropsWithoutRef,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";

import type {
  BaseProps,
  ClearableProps,
  DisabledProps,
  FullWidthProps,
  LoadingProps,
  SizeProps,
  StateProps,
  TrimProps,
  TypographyProps,
  UndoRedoProps,
  ValueProps,
  VariantProps,
} from "@splenddev/kreativ-core/types";
/**
 * Internal. Not part of the public API — do not re-export from the package index.
 * Callers resolve `type` themselves. This function has no password concept.
 */
export type BaseInputExtraAdornmentContext = {
  iconSize: string | number;
  /** Motion-gated icon-button classes. Transition styles are omitted when motion is off. */
  iconButtonClass: string;
};

export type BaseInputProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "size" | "type"
> &
  BaseProps &
  SizeProps &
  VariantProps<InputVariant> &
  DisabledProps &
  LoadingProps &
  FullWidthProps &
  ClearableProps &
  UndoRedoProps &
  ValueProps<string | number> &
  StateProps &
  TrimProps &
  TypographyProps & {
    type: HTMLInputTypeAttribute;

    inputClassName?: string;

    scrollIntoViewOnError?: boolean;

    startIcon?: ReactNode;
    endIcon?: ReactNode;

    rounded?: boolean;
    motion?: boolean;

    validatePattern?: string | RegExp;
    patternMessage?: string;

    embedded?: boolean;

    extraEndAdornment?:
      | ReactNode
      | ((ctx: BaseInputExtraAdornmentContext) => ReactNode);
  };

export type InputVariant = "outline" | "filled" | "ghost";

export type InputSize = "xs" | "sm" | "md" | "lg";

export type InputKind =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "search"
  | "numeric"
  | "number"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week";

export type PasswordKind = "password-current" | "password-new";

type KindDefaultBase = {
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  pattern?: string;
  min?: number;
  max?: number;
  step?: number;
};

export type InputKindDefaults = Record<
  InputKind,
  KindDefaultBase & {
    inputMode?:
      | "none"
      | "text"
      | "decimal"
      | "numeric"
      | "tel"
      | "search"
      | "email"
      | "url";
  }
>;

export type PasswordInputKindDefaults = Record<
  PasswordKind,
  KindDefaultBase & {
    inputMode?: "none" | "text";
  }
>;

export type InputProps = Omit<
  BaseInputProps,
  "type" | "extraEndAdornment" | "motion"
> & {
  kind?: InputKind;
  hideKindIcon?: boolean;
  type?: HTMLInputTypeAttribute;
  motion?: boolean;
};

export type PasswordInputProps = Omit<
  BaseInputProps,
  "type" | "extraEndAdornment" | "motion"
> & {
  motion?: boolean;
  kind?: PasswordKind;
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};
