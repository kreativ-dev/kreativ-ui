export function getAttrs(
  el: HTMLElement | null,
  extra: string[] = [],
  exclude: string[] = [],
  extraAttrs?: Record<string, string | null>,
  styleProps: string[] = [], // new: style properties to read
): Record<string, string | null> {
  const target =
    (el?.querySelector("input, textarea, [role='combobox']") as HTMLElement) ??
    el;

  // --- Attributes ---
  const base: Record<string, string | null> = {
    id: target?.getAttribute("id") ?? null,
    "aria-invalid": target?.getAttribute("aria-invalid") ?? null,
    "aria-describedby": target?.getAttribute("aria-describedby") ?? null,
    disabled: (target as HTMLInputElement)?.disabled ? "true" : null,
  };

  const extras = Object.fromEntries(
    extra.map((k) => [k, target?.getAttribute(k) ?? null]),
  );

  // --- Computed styles ---
  let styles: Record<string, string | null> = {};
  if (target && styleProps.length > 0) {
    const computed = window.getComputedStyle(target);
    styles = Object.fromEntries(
      styleProps.map((prop) => [prop, computed.getPropertyValue(prop) || null]),
    );
  }

  const result = { ...base, ...extras, ...styles, ...extraAttrs };

  const excludeSet = new Set(exclude);
  return Object.fromEntries(
    Object.entries(result).filter(([key]) => !excludeSet.has(key)),
  );
}
