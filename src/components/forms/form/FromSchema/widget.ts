// widget.ts
import * as React from "react";
import { z } from "zod";
import { Input } from "../../Input/Input";
import { Select } from "../../Select/Select";
import { Switch } from "../../Switch/Switch";
import { Textarea } from "../../Textarea/Textarea";
import { Checkbox } from "../../Checkbox/Checkbox";
import type { UIFieldSchema } from "./uiSchema.types";
import type { ComponentKey } from "./ComponentPropsMap";
import { isDev } from "@/utils/env";
import { ValuePropConvention } from "@/types";
import { getNumberConstraints, getStringConstraints } from "./zodHelpers";
import { NumberStepper } from "../../NumberStepper";

/**
 * Turns a field name into a label: `firstName` -> `"First Name"`,
 * `first_name` -> `"First Name"`.
 *
 * Used as the fallback when a field's uiSchema entry doesn't supply its
 * own label.
 */
export function humanizeFieldName(name: string): string {
  const spaced = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return spaced
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * The component + props a field will actually render with, after Zod
 * inference and uiSchema overrides have both been applied.
 */

export interface ResolvedWidget {
  component: React.ComponentType<any> & {
    __kui: { formControl: "single" | "compound" };
  };
  props: Record<string, unknown>;
  formControl: "single" | "compound";
  /** Defaults to "value" when not set by the resolution path. */
  valuePropConvention: ValuePropConvention;
}

/**
 * Which value-prop convention each built-in widget expects. Checked only
 * for widget-KEY resolutions (WIDGET_REGISTRY lookups) — a direct
 * component reference's convention isn't knowable from here, so that path
 * defaults to "value" (see resolveWidget's component-reference branch).
 */
const WIDGET_VALUE_CONVENTIONS: Partial<
  Record<ComponentKey, ValuePropConvention>
> = {
  switch: "checked",
  checkbox: "checked",
};

/**
 * The built-in widgets, keyed by the same names used in `widget: "..."` on
 * a uiSchema entry — `"input"`, `"select"`, `"switch"`, `"textarea"`,
 * `"checkbox"`.
 *
 * Typed as a full `Record<ComponentKey, ...>` rather than a partial one on
 * purpose: adding a new key to `ComponentPropsMap` won't compile until you
 * also register the component here. So the map and the registry can't drift
 * apart without you noticing.
 */
const WIDGET_REGISTRY: Record<ComponentKey, ResolvedWidget["component"]> = {
  input: Input as unknown as ResolvedWidget["component"],
  select: Select as unknown as ResolvedWidget["component"],
  switch: Switch as unknown as ResolvedWidget["component"],
  textarea: Textarea as unknown as ResolvedWidget["component"],
  checkbox: Checkbox as unknown as ResolvedWidget["component"],
  "number-stepper": NumberStepper as unknown as ResolvedWidget["component"],
};

/**
 * Reads the allowed values out of a `z.enum([...])` and turns them into
 * `{ label, value }` options for the auto-selected Select widget.
 *
 * `label` is the value run through {@link humanizeFieldName} — so
 * `"admin"` renders as `"Admin"`, `"readOnly"` as `"Read Only"`. Pass your
 * own `options` in the uiSchema if you want different labels.
 *
 * Returns undefined for anything that isn't an enum.
 */
function getEnumOptions(
  zodType: z.ZodTypeAny,
): Array<{ label: string; value: string }> | undefined {
  const asEnum = zodType as unknown as { options?: readonly string[] };
  const values = Array.isArray(asEnum.options)
    ? asEnum.options
    : (() => {
        const entries = (
          zodType as unknown as { _def?: { entries?: Record<string, string> } }
        )._def?.entries;
        return entries ? Object.values(entries) : undefined;
      })();

  if (!values) return undefined;
  return values.map((value) => ({ label: humanizeFieldName(value), value }));
}

/**
 * Picks a widget from a field's Zod type alone, with no uiSchema input.
 *
 * The mapping:
 * - `z.string()` / `z.number()` -> text input
 * - `z.boolean()` -> switch
 * - `z.enum([...])` -> select, with the enum values pre-filled as options
 * - anything else -> text input
 *
 * `z.object()` and `z.array()` never reach here — the generator handles
 * those structurally, one layer up. This function only deals with fields
 * that map to a single widget.
 */
export function resolveDefaultWidget(zodType: z.ZodTypeAny): ResolvedWidget {
  if (zodType instanceof z.ZodNumber) {
    const { min, max } = getNumberConstraints(zodType);

    const registered = WIDGET_REGISTRY["number-stepper"];
    return {
      component: registered,
      props: {
        type: "number",
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max }),
      },
      formControl: resolveFormControl(
        registered,
        'the "number-stepper" widget',
      ),
      valuePropConvention: "value",
    };
  }

  if (zodType instanceof z.ZodString) {
    const { minLength, maxLength, inputType } = getStringConstraints(zodType);
    return {
      component: WIDGET_REGISTRY.input,
      props: {
        ...(inputType && inputType !== "text" && { type: inputType }),
        ...(minLength !== undefined && { minLength }),
        ...(maxLength !== undefined && { maxLength }),
      },
      formControl: "single",
      valuePropConvention: "value",
    };
  }

  if (zodType instanceof z.ZodBoolean) {
    return {
      component: WIDGET_REGISTRY.checkbox,
      props: {},
      formControl: "single",
      valuePropConvention: "checked",
    };
  }

  if (zodType instanceof z.ZodEnum) {
    const options = getEnumOptions(zodType);
    return {
      component: WIDGET_REGISTRY.select,
      props: options ? { options } : {},
      formControl: "single",
      valuePropConvention: "value",
    };
  }

  return {
    component: WIDGET_REGISTRY.input,
    props: {},
    formControl: "single",
    valuePropConvention: "value",
  };
}

type KuiMetadata = { __kui?: { formControl?: "single" | "compound" } };

function resolveFormControl(
  component: unknown,
  sourceDescription: string,
): "single" | "compound" {
  const meta = (component as KuiMetadata).__kui;
  if (!meta?.formControl) {
    if (isDev()) {
      console.warn(
        `[kreativ-ui/Form.FromSchema]: ${sourceDescription} is missing __kui metadata ` +
          '(expected `__kui: { formControl: "single" | "compound" }`). ' +
          'Falling back to "single". Attach the metadata to the component to silence this.',
      );
    }
    return "single";
  }
  return meta.formControl;
}

/**
 * Works out the component and props a field should render with, combining
 * its Zod type with its uiSchema entry.
 *
 * What you put in `widget` decides how this resolves:
 *
 * - **A component reference** (e.g. `widget: ColorSwatchPicker`) — used
 *   as-is. Whether it's treated as single or compound comes from the
 *   component's own `__kui.formControl` metadata.
 * - **A string key** that's registered (e.g. `widget: "select"`) — looked
 *   up in the built-in registry.
 * - **A string key** that isn't registered — falls back to the Zod-inferred
 *   widget. In dev you'll get a console warning pointing at the bad key.
 * - **No widget at all** — falls straight through to the Zod-inferred
 *   default.
 *
 * Any `props` you set on the uiSchema entry are shallow-merged on top of
 * whatever the Zod inference produced. So you only specify the props you
 * want to change — everything else stays at the inferred default.
 */
export function resolveWidget(
  zodType: z.ZodTypeAny,
  uiField: UIFieldSchema | undefined,
): ResolvedWidget {
  const inferred = resolveDefaultWidget(zodType);
  const uiProps = uiField?.props as Record<string, unknown> | undefined;

  if (!uiField || !uiField.widget) {
    return {
      component: inferred.component,
      props: { ...inferred.props, ...uiProps },
      formControl: inferred.formControl,
      valuePropConvention: inferred.valuePropConvention,
    };
  }

  if (typeof uiField.widget === "string") {
    if (uiField.widget in WIDGET_REGISTRY) {
      const key = uiField.widget as ComponentKey;
      const registered = WIDGET_REGISTRY[uiField.widget as ComponentKey];
      return {
        component: registered,
        props: { ...inferred.props, ...uiProps },
        formControl: resolveFormControl(
          registered,
          `widget key "${uiField.widget}"`,
        ),
        valuePropConvention:
          WIDGET_VALUE_CONVENTIONS[key as ComponentKey] ?? "value",
      };
    }

    if (isDev()) {
      console.warn(
        `[kreativ-ui/Form.FromSchema]: widget key "${uiField.widget}" is not a key of ComponentPropsMap — ` +
          "falling back to the Zod-inferred default. Register a component under that key " +
          "or use a direct component reference instead.",
      );
    }
    return {
      component: inferred.component,
      props: { ...inferred.props, ...uiProps },
      formControl: inferred.formControl,
      valuePropConvention: inferred.valuePropConvention,
    };
  }

  return {
    component: uiField.widget,
    props: { ...uiProps },
    formControl: resolveFormControl(
      uiField.widget,
      "the uiSchema.widget component",
    ),
    valuePropConvention: "value",
  };
}
