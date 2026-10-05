import { type HTMLAttributes, type ReactNode } from "react";

export interface AdornmentProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  position?: "start" | "end";
}
