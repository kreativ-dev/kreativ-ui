import type { ElementType, ReactNode, CSSProperties } from "react";
import type { BaseColor, TypographyProps } from "@/types";

export interface TextProps extends TypographyProps {
  as?: ElementType;
  color?: BaseColor | string;
  align?: "left" | "center" | "right" | "justify";
  truncate?: boolean;
  clampLines?: number;
  weight?: "normal" | "medium" | "semibold" | "bold";
  italic?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}
