import type { Typography } from "@/types";

export function defineTypography<T extends Typography>(typography: T): T {
  return typography;
}
