import { FormFieldStatus } from "@/components";
import type { CSSProperties, ReactNode } from "react";
import { ResponsiveValue } from "./responsive";

/**
 * Predefined size keys for components. `"xs"` is the smallest, `"xl"` the largest.
 * Custom string sizes can also be used via `SizeValue`.
 */
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Layout orientation of a group or container.
 */
export type Orientation = "horizontal" | "vertical";

/**
 * A size value that can be either a predefined `Size` or any custom string.
 * This allows theme extensions with additional size tokens.
 */
export type SizeValue = ResponsiveValue<Size | (string & {})>;

/**
 * Base visual variants supported by most components.
 * - `"solid"`: filled background with high contrast.
 * - `"outline"`: bordered with transparent background.
 * - `"ghost"`: minimal, often transparent with subtle hover.
 * - `"soft"`: subtle background with less contrast than `solid`.
 */
export type BaseVariant = "solid" | "outline" | "ghost" | "soft";

/**
 * Default responsive breakpoints supported by the design system.
 * These breakpoints are used to define responsive behavior across different screen sizes.
 * The order from smallest to largest is: `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`.
 *
 * - `"sm"`: small screens (e.g., mobile phones)
 * - `"md"`: medium screens (e.g., tablets)
 * - `"lg"`: large screens (e.g., desktops)
 * - `"xl"`: extra large screens (e.g., large desktops)
 * - `"2xl"`: 2x extra large screens (e.g., ultra-wide displays)
 */
export type BaseBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

/**
 * Base color palette keys. These map to theme-defined colors.
 * - `"brand"`: primary brand color.
 * - `"destructive"`: for errors or dangerous actions.
 * - `"success"`: for positive outcomes.
 * - `"warning"`: for cautionary states.
 * - `"info"`: for informational highlights.
 * - `"neutral"`: default or muted color.
 * - `"white"`: white color (useful on dark backgrounds).
 * - `"inherit"`: inherits the parent's color.
 */
export type BaseColor =
  | "brand"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "neutral"
  | "white"
  | "inherit";

/**
 * Generic variant type; currently aliased to `BaseVariant`.
 * Can be extended in the future.
 */
export type Variant = BaseVariant;

/**
 * Interface for components that accept a CSS class name for styling customisation.
 */
export interface Styleable {
  /** Additional CSS class names to apply. */
  className?: string;
}

/**
 * Animation types for theme-based transitions.
 * - `"none"`: no animation.
 * - `"fade"`: opacity transition.
 * - `"rotate"`: rotation animation.
 * - `"slide"`: sliding motion.
 * - `"scale"`: scaling effect.
 */
export type ThemeAnimation = "none" | "fade" | "rotate" | "slide" | "scale";

/**
 * Recursively makes all properties of `T` optional.
 * Useful for partial theme overrides or deep configuration objects.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extends `CSSProperties` to allow custom CSS variables (e.g., `--my-var`).
 */
export type CSSPropertiesWithVars = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

/**
 * Represents the result of a validity check.
 * - `invalid`: `true` if the value is invalid.
 * - `message`: optional error message to display.
 */
export type ReportedValidity = {
  invalid: boolean;
  message?: string;
};

/**
 * Base properties shared by most components.
 * Includes styling, children, and unstyled mode.
 */
export interface BaseProps {
  /**
   * Additional CSS classes to merge with the component's default styles.
   */
  className?: string;

  /**
   * Inline styles to apply to the root element.
   * These take precedence over className styles.
   */
  style?: CSSProperties;

  /**
   * The content to render inside the component.
   */
  children?: ReactNode;

  /**
   * When `true`, removes all default styling (useful for custom styling from scratch).
   * @default false
   */
  unstyled?: boolean;
}

/**
 * Props for components that support a `size` property.
 */
export interface SizeProps {
  /**
   * The size of the component. Can be a predefined size or a custom string.
   * @default "md"
   */
  size?: SizeValue;
}

/**
 * Props for components that support a `color` property.
 * @template Color - The color type (defaults to `string`).
 */
export interface ColorProps<Color extends string = string> {
  /**
   * The color of the component. Typically matches the theme's color palette.
   */
  color?: Color;
}

/**
 * Props for components that support a `variant` property.
 * @template Variant - The variant type (defaults to `string`).
 */
export interface VariantProps<Variant extends string = string> {
  /**
   * The visual style variant of the component.
   * Common variants: `"solid"`, `"outline"`, `"ghost"`, `"soft"`.
   */
  variant?: Variant;
}

/**
 * Props for components that apply typography styles from the theme.
 */
export interface TypographyProps {
  /**
   * The typography style to apply, matching a key defined in the theme's typography configuration.
   * For example, `"heading1"`, `"bodyLarge"`, etc.
   */
  typography?: string;
}

/**
 * Props for components that can be disabled.
 */
export interface DisabledProps {
  /**
   * When `true`, the component is non-interactive and visually dimmed.
   * @default false
   */
  disabled?: boolean;
}

/**
 * Props for components that can display a loading state.
 */
export interface LoadingProps {
  /**
   * When `true`, shows a loading indicator and blocks user interaction.
   * @default false
   */
  isLoading?: boolean;
}

/**
 * Props for components that can expand to full width.
 */
export interface FullWidthProps {
  /**
   * When `true`, the component spans the full available width of its container.
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Props for components that support clearing their current value.
 */
export interface ClearableProps {
  /**
   * When `true`, a clear button or action is shown to reset the value.
   * @default false
   */
  clearable?: boolean;

  /**
   * Callback invoked when the value is cleared (e.g., click on clear button).
   */
  onClear?: () => void;
}

/**
 * Props for enabling undo/redo functionality on the input value.
 */
export interface UndoRedoProps {
  /**
   * Callback invoked when an undo action is performed.
   * The new value is passed to allow external state synchronisation.
   */
  onUndo?: (value: string | number | undefined) => void;

  /**
   * Callback invoked when a redo action is performed.
   * The new value is passed to allow external state synchronisation.
   */
  onRedo?: (value: string | number | undefined) => void;
}

/**
 * Props for components that can display visual feedback states.
 * Typically used for form fields or interactive elements.
 */
export interface StateProps {
  /**
   * When `true`, applies an error style (e.g., red border, error icon).
   * @default false
   */
  error?: boolean;

  /**
   * When `true`, applies a success style (e.g., green border, checkmark).
   * @default false
   */
  success?: boolean;

  /**
   * When `true`, applies a warning style (e.g., yellow/orange border, warning icon).
   * @default false
   */
  warning?: boolean;

  /**
   * When `true`, automatically scrolls the input into view when it
   * transitions into an error state.
   * @default false
   */
  scrollIntoViewOnError?: boolean;
}

/**
 * Props for components that support a status indicator.
 * Typically used with `FormFieldStatus` from the design system.
 */
export interface StatusProps {
  /**
   * The status of the component. Can be `"success"`, `"error"`, `"warning"`, or `"none"`.
   * This influences the visual appearance (color, icon, etc.).
   */
  status?: FormFieldStatus;
}

/**
 * Props for components that arrange children in a group with a specific layout direction.
 */
export interface OrientationProps {
  /**
   * The layout direction of the group.
   * - `"horizontal"`: children are placed side by side.
   * - `"vertical"`: children are stacked vertically.
   * @default "horizontal"
   */
  orientation?: Orientation;
}

/**
 * Generic props for controlling a value with both controlled and uncontrolled modes.
 * Allows customising the property names for value, default value, and onChange.
 *
 * @template T - The type of the value.
 * @template TValueProp - The name of the controlled value property (default: `"value"`).
 * @template TDefaultProp - The name of the uncontrolled default property (default: `"defaultValue"`).
 * @template TOnChangeProp - The name of the change callback property (default: `"onValueChange"`).
 */
export type ControlledProps<
  T,
  TValueProp extends string = "value",
  TDefaultProp extends string = "defaultValue",
  TOnChangeProp extends string = "onValueChange",
  TIsRequired extends boolean = false,
> = TIsRequired extends true
  ? {
      /** Controlled value. */
      [K in TValueProp]: T;
    } & {
      /** Initial value for uncontrolled usage. */
      [K in TDefaultProp]: T;
    } & {
      /** Called when the value changes. */
      [K in TOnChangeProp]: (value: T) => void;
    }
  : {
      /** Controlled value. */
      [K in TValueProp]?: T;
    } & {
      /** Initial value for uncontrolled usage. */
      [K in TDefaultProp]?: T;
    } & {
      /** Called when the value changes. */
      [K in TOnChangeProp]?: (value: T) => void;
    };

/**
 * Props for a controlled or uncontrolled stateful component.
 *
 * @typeParam T - The state value type.
 * @typeParam TStateProp - The controlled state prop name.
 * @typeParam TSetStateProp - The state change callback prop name.
 */
/**
 * Defines optional state control props for a component: a state value and its setter.
 *
 * This is useful for components that can be used in both controlled and uncontrolled modes,
 * where the caller may provide state and setter optionally.
 *
 * @template T - The type of the state value (default: `boolean`).
 * @template TStateProp - The name of the state prop (default: `"state"`).
 * @template TSetStateProp - The name of the setter prop (default: `"setState"` based on `TStateProp`).
 *
 * @example
 * ```ts
 * interface MyComponentProps extends StateControlProps<string, "value", "onValueChange"> {
 *   label: string;
 * }
 * // Result:
 * // {
 * //   label: string;
 * //   value?: string;
 * //   onValueChange?: (value: string) => void;
 * // }
 * ```
 *
 * @example
 * ```ts
 * // Default prop names: "state" and "setState"
 * type Props = StateControlProps<number>;
 * // => { state?: number; setState?: (value: number) => void }
 * ```
 */
export type StateControlProps<
  T = boolean,
  TStateProp extends string = "state",
  TSetStateProp extends string = `set${Capitalize<TStateProp>}`,
> = {
  [K in TStateProp]?: T;
} & {
  [K in TSetStateProp]?: (value: T) => void;
};

/**
 * Defines **required** state control props for a component: a mandatory state value and its setter.
 *
 * Use this when your component **must** be controlled externally – the caller is forced to provide
 * the state and the setter function.
 *
 * @template T - The type of the state value (default: `boolean`).
 * @template TStateProp - The name of the state prop (default: `"state"`).
 * @template TSetStateProp - The name of the setter prop (default: `"setState"` based on `TStateProp`).
 *
 * @example
 * ```ts
 * interface ControlledInputProps extends RequiredStateControlProps<string, "value", "onChange"> {
 *   placeholder?: string;
 * }
 * // Result:
 * // {
 * //   placeholder?: string;
 * //   value: string;
 * //   onChange: (value: string) => void;
 * // }
 * ```
 *
 * @example
 * ```ts
 * // Default prop names: "state" and "setState"
 * type Props = RequiredStateControlProps<number>;
 * // => { state: number; setState: (value: number) => void }
 * ```
 */
export type RequiredStateControlProps<
  T = boolean,
  TStateProp extends string = "state",
  TSetStateProp extends string = `set${Capitalize<TStateProp>}`,
> = {
  [K in TStateProp]: T;
} & {
  [K in TSetStateProp]: (value: T) => void;
};

/**
 * Props for a string-based value component (e.g., input, select, textarea).
 * Uses `value`, `defaultValue`, and `onValueChange` as the controlled props.
 * @template T - The value type (defaults to `string`).
 */
export type ValueProps<
  T = string,
  TIsRequired extends boolean = false,
> = TIsRequired extends true
  ? ControlledProps<T, "value", "defaultValue", "onValueChange", true>
  : ControlledProps<T, "value", "defaultValue", "onValueChange">;

/**
 * Props for components that can trim whitespace from the value.
 */
export interface TrimProps {
  /**
   * When `true`, removes leading and trailing whitespace from the value
   * when the value is committed (e.g., on blur or form submit).
   * @default false
   */
  trim?: boolean;
}

/**
 * Props for components that can be embedded inside a parent container.
 * When `embedded`, the component drops its own container styling (borders, radius, focus ring)
 * to blend seamlessly into the parent.
 */
export interface EmbeddedProps {
  /**
   * When `true`, renders the component without its standalone container styling.
   * Useful for components placed inside a parent that already provides a visual container.
   * @default false
   */
  embedded?: boolean;
}

/**
 * A validation result: either `true` (valid), `false` (invalid with default message),
 * or a `string` (invalid with custom message).
 */
export type ValidationResult = boolean | string;

/**
 * Determines when validation should be triggered.
 * - `"change"`: on every value change.
 * - `"blur"`: when the element loses focus.
 * - `"both"`: on both change and blur.
 */
export type ValidateOn = "change" | "blur" | "both";

/**
 * Props for components that support validation of their value.
 * @template T - The type of the value being validated.
 */
export interface ValidateProps<T = string> {
  /**
   * A validation function that receives the current value and returns:
   * - `true` if valid,
   * - `false` if invalid (default error message),
   * - a `string` if invalid (custom error message).
   */
  validate?: (value: T) => ValidationResult;

  /**
   * When to run the validation.
   * @default "blur"
   */
  validateOn?: ValidateOn;
}

export interface ValueProps {
  /**
   * Passed value
   */
  value?: string;

  /**
   * For uncontrolled form control
   */

  defaultValue?: string;

  /**
   * Called when value is changed
   *
   * @param newValue
   * @returns void
   */

  onValueChange?: (newValue: string) => void;
}
