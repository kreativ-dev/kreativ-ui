import type { NumberStepperValidationResult } from "./NumberStepper.types";

export interface ValidateNumberStepperInput {
  raw: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  required?: boolean;
}

/**
 * Parses + validates a raw typed string against min/max/step/precision.
 * Pure — no clamping side effect decided here; callers (per their own
 * `clampOn` timing) decide whether to apply `result.value` back into
 * state or merely report it via onValidate. `value: null` means the
 * raw text failed validation and was rejected outright (empty when
 * required, or genuinely unparseable) — distinct from a number that
 * exists but violates min/max/step, which still returns a `value`
 * (the parsed number) alongside its error list, since a min/max/step
 * violation is something a caller might clamp INTO the valid value
 * rather than reject outright.
 */
export function validateNumberStepper(input: ValidateNumberStepperInput): NumberStepperValidationResult {
  const { raw, min, max, step, precision, required = false } = input;
  const errors: NumberStepperValidationResult["errors"] = [];

  const trimmed = raw.trim();

  if (trimmed === "") {
    if (required) {
      errors.push("required");
      return { valid: false, value: null, errors };
    }
    return { valid: true, value: null, errors };
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    errors.push("invalid");
    return { valid: false, value: null, errors };
  }

  if (min !== undefined && parsed < min) errors.push("min");
  if (max !== undefined && parsed > max) errors.push("max");
  if (step !== undefined && step > 0) {
    const base = min ?? 0;
    const remainder = Math.abs((parsed - base) % step);
    const tolerance = 1e-9;
    if (remainder > tolerance && Math.abs(remainder - step) > tolerance) {
      errors.push("step");
    }
  }

  const roundedValue =
    precision !== undefined ? Number(parsed.toFixed(precision)) : parsed;

  return { valid: errors.length === 0, value: roundedValue, errors };
}

/** Clamps a numeric value into [min, max] and snaps to the nearest step from min. */
export function clampNumberStepper(
  value: number,
  min?: number,
  max?: number,
  step?: number,
): number {
  let result = value;
  if (step !== undefined && step > 0) {
    const base = min ?? 0;
    result = base + Math.round((result - base) / step) * step;
  }
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  return result;
}
