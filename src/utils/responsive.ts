import type { BaseBreakpoint, ResponsiveValue } from "@/types";

export function isResponsiveValue<T>(
  value: ResponsiveValue<T>,
): value is Partial<Record<"base" | BaseBreakpoint, T>> {
  return typeof value === "object" && value !== null;
}

export interface ResolvedResponsiveValue<T> {
  base?: T;
  responsive: Record<string, T>;
}

export function resolveResponsiveValue<T, B extends string = string>(
  value: ResponsiveValue<T, B>,
): ResolvedResponsiveValue<T> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return {
      base: value,
      responsive: {},
    };
  }

  const responsiveValue = value as Partial<Record<"base" | B, T>>;

  const { base, ...responsive } = responsiveValue;

  return {
    base,
    responsive: Object.fromEntries(
      Object.entries(responsive).filter(([, value]) => value !== undefined),
    ) as Record<string, T>,
  };
}

export function toResponsiveClasses<T>(
  value: ResolvedResponsiveValue<T>,
  resolve: (value: T) => string,
): string {
  const classes: string[] = [];

  if (value.base !== undefined) {
    classes.push(resolve(value.base));
  }

  for (const [breakpoint, item] of Object.entries(value.responsive)) {
    classes.push(
      item
        ? item
            .toString()
            .split(" ")
            .map((className) => `${breakpoint}:${className}`)
            .join(" ")
        : "",
    );
  }

  return classes.filter(Boolean).join(" ");
}

export function mergeResponsiveValue<T, B extends string = string>(
  defaults: ResponsiveValue<T, B>,
  value?: ResponsiveValue<T, B>,
): ResolvedResponsiveValue<T> {
  const defaultValue = resolveResponsiveValue(defaults);

  if (value === undefined) {
    return defaultValue;
  }

  const overrideValue = resolveResponsiveValue(value);

  return {
    base: overrideValue.base ?? defaultValue.base,
    responsive: {
      ...defaultValue.responsive,
      ...overrideValue.responsive,
    },
  };
}
