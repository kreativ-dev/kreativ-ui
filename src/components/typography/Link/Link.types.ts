import type { AnchorHTMLAttributes, ElementType } from "react";
import type {
  BaseProps,
  BaseColor,
  VariantProps,
  BaseVariant,
  DisabledProps,
  ColorProps,
} from "@/types";

export interface LinkProps
  extends
    BaseProps,
    VariantProps<BaseVariant>,
    ColorProps<BaseColor>,
    DisabledProps,
    Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "color" | "className" | "style" | "children"
    > {
  /** Polymorphic root, e.g. Next.js Link or React Router Link. */
  as?: ElementType;
  /** @default "hover" */
  underline?: "always" | "hover" | "none";
  /** Adds target=_blank, rel=noopener, and an external-link icon affordance. */
  external?: boolean;
}
