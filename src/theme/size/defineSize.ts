import type { SizeScale, SizeToken } from "@/types";

export function defineSize<T extends SizeToken>(size: T): T {
  return size;
}

export function defineSizes<T extends SizeScale>(sizes: T): T {
  return sizes;
}
