function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(base: T, override?: unknown): T {
  if (override === undefined) {
    return base;
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override as T;
  }

  const result: Record<string, unknown> = {
    ...base,
  };

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];

    if (isPlainObject(existing) && isPlainObject(value)) {
      result[key] = deepMerge(existing, value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
