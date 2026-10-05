import { SwitchSize } from "./Switch.types";

export const switchThumbConfig: Record<
  SwitchSize,
  { thumb: string; translate: string }
> = {
  xs: { thumb: "h-3 w-3", translate: "translate-x-3" },
  sm: { thumb: "h-3 w-3", translate: "translate-x-3" },
  md: { thumb: "h-4 w-4", translate: "translate-x-4" },
  lg: { thumb: "h-5 w-5", translate: "translate-x-5" },
};
