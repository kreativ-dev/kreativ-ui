import { BaseProps, OrientationProps, SizeProps } from "@/types";
import type { HTMLAttributes } from "react";

export type ButtonGroupSpacing = "none" | "sm" | "md" | "lg";

export interface ButtonGroupProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "color" | "size">,
    Omit<BaseProps, "unstyled">,
    SizeProps,
    OrientationProps {
  /**
   * Whether adjacent buttons should visually connect.
   *
   * @default false
   */
  attached?: boolean;

  /**
   * Space between group items when not attached.
   *
   * @default "md"
   */
  spacing?: ButtonGroupSpacing;
}

export interface ButtonGroupSeparatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">, OrientationProps {}

export interface ButtonGroupTextProps
  extends HTMLAttributes<HTMLSpanElement>, Omit<BaseProps, "unstyled"> {}

export interface ButtonGroupLabelProps
  extends HTMLAttributes<HTMLSpanElement>, Omit<BaseProps, "unstyled"> {}

export interface ButtonGroupItemProps extends HTMLAttributes<HTMLDivElement> {}
