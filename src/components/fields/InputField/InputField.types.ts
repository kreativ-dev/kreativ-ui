import { FormFieldStatus } from "@/components/forms/FormField";
import { InputProps } from "@/components/forms/Input";
import { ReactNode, LabelHTMLAttributes } from "react";

/**
 * Represents the visual state of the field for feedback and styling.
 */

export interface InputFieldProps extends InputProps {
  /**
   * The primary label for the input. Supports React nodes for rich formatting
   * (e.g., icons, badges, or custom typography).
   */
  label?: ReactNode;

  /**
   * Helper text displayed near the input (usually below the label or the input itself).
   * Use this for permanent instructions or contextual guidance.
   */
  description?: ReactNode;

  /**
   * Content (e.g., an icon, badge, or avatar) rendered inline at the start of the label.
   */
  labelStart?: ReactNode;

  /**
   * Content (e.g., a badge, status indicator, or small action button)
   * rendered inline at the end of the label.
   */
  labelEnd?: ReactNode;

  /**
   * An optional tooltip, info icon, or popover trigger rendered next to the label.
   * Ideal for providing supplementary explanations without cluttering the UI.
   */
  tooltip?: ReactNode;

  /**
   * The current validation or status state of the field.
   * Drives the visual appearance (border color, label color, message styling).
   *
   * @default 'none'
   */
  status?: FormFieldStatus;

  /**
   * Feedback message displayed below the input.
   * Typically paired with `status` to show success confirmations or error details.
   *
   * @example "Please enter a valid email address."
   */
  message?: string;

  /**
   * A subtle, temporary hint displayed below the input, distinct from `description`.
   * Great for showing formatting rules, password requirements, or dynamic suggestions.
   */
  hint?: ReactNode;

  /**
   * Marks the field as required. Automatically appends a required indicator
   * (e.g., an asterisk `*`) to the label.
   *
   * @default false
   */
  required?: boolean;

  /**
   * Controls whether the field displays an optional indicator
   * (e.g., "(optional)") next to the label.
   * This is typically ignored if `required` is `true`.
   *
   * @default false
   */
  optional?: boolean;

  /**
   * Visually hides the label while keeping it accessible to screen readers.
   * Useful for search bars or compact forms where layout space is limited.
   *
   * @default false
   */
  labelHidden?: boolean;

  /**
   * Defines the layout relationship between the label and the input.
   * - `'vertical'`: Label sits above the input (default for most forms).
   * - `'horizontal'`: Label and input sit side-by-side (common in admin panels).
   *
   * @default 'vertical'
   */
  orientation?: "vertical" | "horizontal";

  /**
   * Enables a character counter (e.g., "0 / 100") displayed near the input.
   * Automatically uses the `maxLength` prop from the underlying `InputProps`.
   *
   * @default false
   */
  showCounter?: boolean;

  /**
   * The unique ID for the underlying input element.
   * Used to link the `<label>` (via `htmlFor`) and description/error messages
   * (via `aria-describedby`) for improved screen-reader support.
   */
  id?: string;

  /**
   * Props forwarded directly to the underlying `<label>` element,
   * allowing fine-grained control over attributes like `className` or `onClick`.
   */
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;

  /**
   * Custom class name applied to the root wrapper container of the entire field.
   */
  wrapperClassName?: string;

  /**
   * Custom class name applied specifically to the label element.
   */
  labelClassName?: string;

  /**
   * Custom class name applied to the container holding the description,
   * feedback message, and hint.
   */
  messageClassName?: string;

  /**
   * Custom class name applied to the wrapper around the input element itself.
   * Useful for adding padding, backgrounds, or borders to the input's parent.
   */
  inputWrapperClassName?: string;
}
