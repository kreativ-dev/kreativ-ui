import { z } from "zod";

/**
 * Peels `.optional()`, `.default()`, and `.nullable()` off a Zod type so
 * the generator can see the type underneath.
 */
export function unwrap(zodType: z.ZodType): z.ZodType {
  const isWrapper =
    zodType instanceof z.ZodOptional ||
    zodType instanceof z.ZodDefault ||
    zodType instanceof z.ZodNullable;

  if (!isWrapper) return zodType;

  const withUnwrap = zodType as unknown as {
    unwrap?: () => z.ZodType;
    removeDefault?: () => z.ZodType;
    _def?: { innerType?: z.ZodType };
  };

  const inner =
    withUnwrap.unwrap?.() ??
    withUnwrap.removeDefault?.() ??
    withUnwrap._def?.innerType;

  return inner ? unwrap(inner) : zodType;
}

/**
 * Reads the Zod type's identity via `instanceof` — stable across v3/v4,
 * unlike `_def.typeName`.
 */
export function getZodTypeName(zodType: z.ZodTypeAny): string | undefined {
  if (zodType instanceof z.ZodArray) return "ZodArray";
  if (zodType instanceof z.ZodObject) return "ZodObject";
  if (zodType instanceof z.ZodString) return "ZodString";
  if (zodType instanceof z.ZodNumber) return "ZodNumber";
  if (zodType instanceof z.ZodBoolean) return "ZodBoolean";
  if (zodType instanceof z.ZodEnum) return "ZodEnum";
  return undefined;
}

/** `.shape` off a Zod object, or undefined. */
export function getObjectShape(
  zodType: z.ZodTypeAny,
): Record<string, z.ZodTypeAny> | undefined {
  return zodType instanceof z.ZodObject ? zodType.shape : undefined;
}

/** The `T` in `z.array(T)`. */
export function getArrayElement(zodType: z.ZodType): z.ZodType | undefined {
  const t = zodType as unknown as {
    element?: unknown;
    _def?: { element?: unknown; type?: unknown };
  };
  const candidate = t.element ?? t._def?.element ?? t._def?.type;
  return candidate instanceof z.ZodType ? candidate : undefined;
}

/** Requiredness by asking Zod: if `undefined` or `null` parse, it's optional. */
export function isFieldRequired(zodType: z.ZodTypeAny): boolean {
  if (zodType.safeParse(undefined).success) return false;
  if (zodType.safeParse(null).success) return false;
  return true;
}

/** Empty value matching a Zod type — used when the user clicks "Add". */
export function synthesizeDefault(zodType: z.ZodTypeAny): unknown {
  const unwrapped = unwrap(zodType);
  const typeName = getZodTypeName(unwrapped);

  switch (typeName) {
    case "ZodString":
      return "";
    case "ZodNumber":
      return 0;
    case "ZodBoolean":
      return false;
    case "ZodArray":
      return [];
    case "ZodObject": {
      const shape = getObjectShape(unwrapped) ?? {};
      const result: Record<string, unknown> = {};
      for (const key of Object.keys(shape)) {
        result[key] = synthesizeDefault(shape[key]);
      }
      return result;
    }
    default:
      return undefined;
  }
}

export interface NumberConstraints {
  min?: number;
  max?: number;
}

export interface StringConstraints {
  minLength?: number;
  maxLength?: number;
  inputType?: "email" | "url" | "text";
}

/**
 * Zod v4 has no public getter for min/max on ZodNumber (confirmed: not in
 * the prototype method list). Constraint values are computed into
 * `_zod.bag` internally (`bag.minimum`/`bag.maximum`) — reading that
 * directly since there's no supported public accessor for it.
 */
export function getNumberConstraints(zodType: z.ZodTypeAny): NumberConstraints {
  const bag = (
    zodType as unknown as { _zod?: { bag?: Record<string, unknown> } }
  )._zod?.bag;

  const result: NumberConstraints = {};

  if (typeof bag?.minimum === "number") result.min = bag.minimum;
  if (typeof bag?.maximum === "number") result.max = bag.maximum;

  return result;
}

/**
 * Reads length constraints + format hints (email/url) from a z.string()'s
 * resolved constraint bag.
 *
 * Zod v4 has no public getter for these on ZodString — constraint values
 * are computed into `_zod.bag` internally (confirmed via inspection:
 * bag.minimum/maximum for z.number(), same mechanism applies here).
 * Reading it directly since there's no supported public accessor.
 */
export function getStringConstraints(zodType: z.ZodTypeAny): StringConstraints {
  const bag = (
    zodType as unknown as {
      _zod?: { bag?: Record<string, unknown> };
    }
  )._zod?.bag;

  const result: StringConstraints = {};
  if (!bag) return result;

  if (typeof bag.minimum === "number") result.minLength = bag.minimum;
  if (typeof bag.maximum === "number") result.maxLength = bag.maximum;

  if (bag.format === "email") result.inputType = "email";
  if (bag.format === "url") result.inputType = "url";

  return result;
}