import { KuiComponent } from "@splenddev/kreativ-core";

export type SingleFormControlComponent<P extends object = any> = KuiComponent<
  P,
  any
> & {
  __kui: { formControl: "single" };
};


export type ValuePropConvention = "value" | "checked";

/** Token names that map to `--kui-spacing-<token>`. */
export type SpaceToken =
  | "none"
  | "2xs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | (string & {}); // escape hatch for project-specific tokens

/**
 * - `"sm"` / `"md"` / … → `var(--kui-spacing-sm)`
 * - `24`               → `"24px"`
 * - `"24px"` / `"1rem"` → used as-is
 */
export type SpaceValue = SpaceToken | number | (string & {});

/** Any color token (`"brand"`, `"surface-raised"`) or raw CSS color. */

export type RadiusValue =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full"
  | (string & {});
