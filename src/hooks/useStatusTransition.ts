"use client";

import { FormFieldStatus } from "@/components/forms/FormField/FormField.types";
import { useEffect, useRef, useState } from "react";

type TransitionStatus = Exclude<FormFieldStatus, "none"> | undefined;

const TRANSITION_DURATION = 1500;

export function useStatusTransition(status: FormFieldStatus) {
  const previousStatus = useRef(status);
  const [transitionStatus, setTransitionStatus] = useState<TransitionStatus>();

  useEffect(() => {
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
  }, [status]);

  return transitionStatus;
}
