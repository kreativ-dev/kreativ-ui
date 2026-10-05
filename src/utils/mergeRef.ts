import type { Ref } from "react";

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}
