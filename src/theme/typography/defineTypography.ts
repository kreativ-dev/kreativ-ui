import type { Typography } from "@splenddev/kreativ-core/types";

export function defineTypography<T extends Typography>(typography: T): T {
  return typography;
}
