import type {
  BaseColor,
  BaseProps,
  OrientationProps,
  ThemeTogglerTransition,
  VariantProps,
} from "@/types";
import type { ButtonVariant, ButtonProps } from "../Button/Button.types";
import type { CSSProperties, ReactNode } from "react";

export type ThemeTogglerVariant = Exclude<ButtonVariant, "link">;
export type ThemeTogglerDisplay = "buttons" | "cycle";

export type ThemeTogglerColor = Exclude<
  BaseColor,
  "destructive" | "warning" | "success" | "white" | "info"
>;

export interface ThemeTogglerProps
  extends
    Omit<BaseProps, "style">,
    OrientationProps,
    VariantProps<ButtonVariant> {
  variant?: ButtonVariant;
  color?: ButtonProps["color"];
  activeVariant?: ButtonVariant;
  activeColor?: ButtonProps["color"];

  size?: ButtonProps["size"];
  iconOnly?: boolean;
  allowSystem?: boolean;

  rounded?: boolean;

  labels?: {
    light?: string;
    dark?: string;
    system?: string;
  };

  icons?: {
    light?: ReactNode;
    dark?: ReactNode;
    system?: ReactNode;
  };

  buttonProps?: ButtonProps;

  display?: "buttons" | "cycle";

  animated?: boolean;
  transition?: ThemeTogglerTransition;

  indicatorClassName?: string;
  indicatorStyle?: CSSProperties;
}
