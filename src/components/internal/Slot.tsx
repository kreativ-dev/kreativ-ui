import { cn } from "@/utils";
import { composeRefs } from "@splenddev/kreativ-core";
import * as React from "react";

type AnyProps = Record<string, any>;

function childRefOf(child: React.ReactElement): React.Ref<any> | undefined {
  // React 19 exposes ref as a prop; React 18 on the element.
  return parseInt(React.version, 10) >= 19 ? (child.props as AnyProps).ref : (child as any).ref;
}

/**
 * asChild composition: inject `slotProps` onto the single child element.
 * Child's own explicit props win over injected defaults, except:
 *  - handlers (on*) compose: child's runs first, ours is skipped if it called preventDefault
 *  - className joins, style merges, refs compose
 */
export function mergeSlotProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps, ...childProps };
  for (const key of Object.keys(slotProps)) {
    const slotVal = slotProps[key];
    const childVal = childProps[key];
    if (/^on[A-Z]/.test(key) && typeof slotVal === "function" && typeof childVal === "function") {
      merged[key] = (...args: any[]) => {
        childVal(...args);
        const ev = args[0];
        if (!(ev && ev.defaultPrevented)) slotVal(...args);
      };
    } else if (key === "className") {
      merged.className = cn(slotVal, childVal);
    } else if (key === "style") {
      merged.style = { ...slotVal, ...childVal };
    }
  }
  return merged;
}

export function renderSlot(
  child: React.ReactNode,
  slotProps: AnyProps,
  ref?: React.Ref<any>,
  where = "asChild",
): React.ReactElement {
  if (!React.isValidElement(child)) {
    throw new Error(`${where} expects a single React element child`);
  }
  const merged = mergeSlotProps(slotProps, child.props as AnyProps);
  return React.cloneElement(child, {
    ...merged,
    ref: composeRefs(ref, childRefOf(child)),
  } as AnyProps);
}
