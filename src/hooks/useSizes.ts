import { useTheme } from "@/hooks/useTheme";
import type { Size, Theme } from "@/types";

export function getSizes(theme: Theme): Size[] {
  return Object.keys(theme.sizes ?? {}) as Size[];
}

export function useSizes(): Size[] {
  const { theme } = useTheme();
  return getSizes(theme);
}
