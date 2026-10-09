import { MotionGatedProps } from "@/types";

export function isMotionGated(props: MotionGatedProps): boolean {
  return (
    props["data-kui-motion-gated"] === true ||
    props["data-kui-motion-gated"] === "true"
  );
}
