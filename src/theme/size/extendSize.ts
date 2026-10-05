import type { ThemeOverride, SizeScale } from "@/types";
import { defaultSizes } from "../defaults/sizes";

export function extendSizes(override?: ThemeOverride["sizes"]): SizeScale {
  const result: SizeScale = {
    ...defaultSizes,
  };

  if (!override) {
    return result;
  }

  for (const [key, value] of Object.entries(override)) {
    result[key] = {
      ...(defaultSizes[key as keyof typeof defaultSizes] ?? {}),
      ...value,
    };
  }

  return result;
}
