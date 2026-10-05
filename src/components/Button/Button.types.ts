import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactElement,
  ReactNode,
} from "react";
import type {
  SizeValue,
  BaseVariant,
  BaseProps,
  ColorProps,
  VariantProps,
  DisabledProps,
  LoadingProps,
  FullWidthProps,
  BaseColor,
  TypographyProps,
} from "@/types/common";

export type ButtonSize = SizeValue | "icon";

export type ButtonVariant = BaseVariant | "link";

export type ButtonColor = BaseColor;

export interface ButtonRenderProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
    | "color"
  > {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  "aria-disabled"?: boolean;
  "aria-busy"?: boolean;
  "data-kui-responsive"?: string;
  children?: ReactNode;
}

export interface ButtonProps
  extends
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      | "onDrag"
      | "onDragStart"
      | "onDragEnd"
      | "onAnimationStart"
      | "onAnimationEnd"
      | "onAnimationIteration"
      | "color"
    >,
    BaseProps,
    ColorProps<ButtonColor>,
    VariantProps<ButtonVariant>,
    DisabledProps,
    LoadingProps,
    FullWidthProps,
    TypographyProps {
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  /**
   * Custom rendering escape hatch.
   *
   * Receives the resolved Button props and allows the consumer
   * to render the Button using another element or component.
   *
   * @example
   * ```tsx
   * <Button
   *   render={(props) => (
   *     <a {...props} href="/templates">
   *       Templates
   *     </a>
   *   )}
   * >
   *   Templates
   * </Button>
   * ```
   *
   * @remarks
   * The render function must be created inside a Client Component
   * when using Next.js App Router. Functions cannot be passed from
   * Server Components to Client Components.
   */
  render?: (props: ButtonRenderProps) => ReactElement;
}
