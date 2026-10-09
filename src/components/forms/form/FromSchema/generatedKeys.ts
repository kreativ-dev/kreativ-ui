// generatedKeys.ts
let counter = 0;

export function nextGeneratedKey(): string {
  counter += 1;
  return `kui-repeater-${counter}`;
}

const REPEATER_KEY = "__repeaterKey";

/**
 * Derives a stable key for a repeater item. Reads a key stamped onto
 * the item itself (REPEATER_KEY) rather than tracking by object
 * reference — necessary because item objects get rebuilt (new
 * reference) on every field edit via spread (`{ ...item, field: v }`),
 * which a WeakMap-by-reference approach can't survive.
 *
 * The stamped key IS an enumerable own property, so it survives
 * `{ ...item }` spreads (which is exactly what we need it to survive)
 * but will also appear in Object.keys/JSON.stringify/form submission
 * data unless stripped before submit — see stripRepeaterKeys below.
 */
export function keyFor(item: unknown): string {
  if (item && typeof item === "object") {
    const existing = (item as Record<string, unknown>)[REPEATER_KEY];
    if (typeof existing === "string") return existing;
    return String(item);
  }
  return String(item);
}

export function stampKey<T>(item: T): T {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (REPEATER_KEY in item) return item;
  return { ...item, [REPEATER_KEY]: nextGeneratedKey() } as T;
}

export function stripRepeaterKey<T extends object>(item: T): T {
  if (!(REPEATER_KEY in item)) return item;
  const { [REPEATER_KEY]: _discard, ...rest } = item as Record<string, unknown>;
  return rest as T;
}
