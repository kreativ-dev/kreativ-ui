import { KuiComponent } from "@splenddev/kreativ-core";

export type SingleFormControlComponent<P extends object = any> = KuiComponent<
  P,
  any
> & {
  __kui: { formControl: "single" };
};

/**
 * Forge sets this on a safe, motionGated component at render-start.
 * Data attributes stringify, so both the boolean prop and the "true"
 * attribute count as gated.
 */
export interface MotionGatedProps {
  "data-kui-motion-gated"?: boolean | "true" | "false";
}

export type ValuePropConvention = "value" | "checked";