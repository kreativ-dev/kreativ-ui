"use client";

import type { FormFieldStatus } from "@splenddev/kreativ-core/types";
import { useEffect, useRef, useState } from "react";

type TransitionStatus = Exclude<FormFieldStatus, "none"> | undefined;

const TRANSITION_DURATION = 1500;

export function useStatusTransition(
  status: FormFieldStatus,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const previousStatus = useRef(status);
  const [transitionStatus, setTransitionStatus] = useState<TransitionStatus>();

  useEffect(() => {
    if (!enabled) {
      previousStatus.current = status;
      setTransitionStatus(undefined);
      return;
    }

    if (status === previousStatus.current) {
      return;
    }

    previousStatus.current = status;

    if (status === "none") {
      setTransitionStatus(undefined);
      return;
    }

    setTransitionStatus(status);

    const timeout = window.setTimeout(() => {
      setTransitionStatus(undefined);
    }, TRANSITION_DURATION);

    return () => window.clearTimeout(timeout);
  }, [status, enabled]);

  return enabled ? transitionStatus : undefined;
}
