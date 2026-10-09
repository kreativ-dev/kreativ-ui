import type {
  UIArraySchema,
  UIFieldSchema,
  UIObjectSchema,
} from "./uiSchema.types";

/** True when a uiSchema entry is a repeatable array — it has an `item` key. */
export function isUIArraySchema(entry: unknown): entry is UIArraySchema {
  return (
    Boolean(entry) && typeof entry === "object" && "item" in (entry as object)
  );
}

/** True when a uiSchema entry is a single field. */
export function isUIFieldSchema(entry: unknown): entry is UIFieldSchema {
  if (!entry || typeof entry !== "object") return false;
  if (isUIArraySchema(entry)) return false;
  const obj = entry as Record<string, unknown>;
  return "widget" in obj || "render" in obj || "props" in obj;
}

/** True when a uiSchema entry is a nested group. */
export function isUIObjectSchema(entry: unknown): entry is UIObjectSchema {
  if (!entry || typeof entry !== "object") return false;
  if (isUIArraySchema(entry)) return false;
  if (isUIFieldSchema(entry)) return false;
  return true;
}
