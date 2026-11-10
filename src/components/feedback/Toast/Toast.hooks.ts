import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toastStore } from "./Toast.store";

export function useToasts() {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

interface TimerArgs {
  duration: number;
  paused: boolean;
  resetKey: number;
  onExpire: () => void;
}

interface TimerResult {
  remaining: number;
  progress: number;
}

export function useToastTimer({
  duration,
  paused,
  resetKey,
  onExpire,
}: TimerArgs): TimerResult {
  const remainingRef = useRef(duration);
  const expireRef = useRef(onExpire);

  const [remaining, setRemaining] = useState(duration);

  expireRef.current = onExpire;

  useEffect(() => {
    remainingRef.current = duration;
    setRemaining(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    if (!Number.isFinite(duration) || paused) return;

    const initialRemaining = Math.max(remainingRef.current, 0);
    const startedAt = performance.now();

    let frame = 0;

    const updateProgress = () => {
      const elapsed = performance.now() - startedAt;
      const nextRemaining = Math.max(initialRemaining - elapsed, 0);

      setRemaining(nextRemaining);

      if (nextRemaining > 0) {
        frame = requestAnimationFrame(updateProgress);
      }
    };

    frame = requestAnimationFrame(updateProgress);

    const timer = window.setTimeout(
      () => expireRef.current(),
      initialRemaining,
    );

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);

      const elapsed = performance.now() - startedAt;

      remainingRef.current = Math.max(initialRemaining - elapsed, 0);
    };
  }, [duration, paused, resetKey]);

  const progress =
    Number.isFinite(duration) && duration > 0
      ? Math.min(100, Math.max(0, (remaining / duration) * 100))
      : 0;

  return { remaining, progress };
}
