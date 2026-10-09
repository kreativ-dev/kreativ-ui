import type * as React from "react";
import type { z } from "zod";
import type { UIObjectSchemaForShape } from "./uiSchema.types";
import {
  generateFieldsInternal,
  type GenerateFieldsOptions,
} from "./generateFieldsInternal";

export type InferShape<Shape extends Record<string, z.ZodTypeAny>> = {
  [K in keyof Shape]: z.infer<Shape[K]>;
};

export type { GenerateFieldsOptions };

/**
 * Turns a Zod object shape into React field nodes.
 *
 * @param shape - The Zod object's shape (`{ [key]: ZodTypeAny }`).
 * @param uiSchema - Optional presentation overrides, keyed by field name.
 * @param options - Recursion options; omit at the top level.
 */
export function generateFields<Shape extends Record<string, z.ZodTypeAny>>(
  shape: Shape,
  uiSchema: UIObjectSchemaForShape<InferShape<Shape>> | undefined,
  options: GenerateFieldsOptions = {},
): React.ReactNode[] {
  return generateFieldsInternal(
    shape,
    uiSchema as Parameters<typeof generateFieldsInternal>[1],
    options,
  );
}
