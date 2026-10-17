import type { ElementType, ReactNode } from "react";
import type {
  BaseProps,
  ResponsiveValue,
  Size,
} from "@splenddev/kreativ-core/types";
import { SpaceValue } from "@/types";


export interface ContainerProps extends BaseProps {
  /** @default "lg" */
  maxWidth?: Size | (string & {});

  /** Token name ("sm"), pixel number (24), or raw length ("24px"). */
  padding?: ResponsiveValue<SpaceValue>;

  /** @default true */
  centered?: boolean;

  as?: ElementType;
  children?: ReactNode;
}
