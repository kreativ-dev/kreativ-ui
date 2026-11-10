import { toast, ToastStatus } from "@/components/feedback";
import { confirmAction, ConfirmOptions, Tooltip } from "@/components/overlays";
import { isDev } from "@/utils/env";
import { composeRefs, createComponent } from "@splenddev/kreativ-core/utils";
import * as React from "react";

const devWarn = (msg: string) => {
  if (isDev()) console.warn(`[kreativ-ui/ActionGuard] ${msg}`);
};

export type ActionGuardReaction = "tooltip" | "toast" | "confirm";

export interface ActionGuardProps {
  /**
   * true = intercept the action. For `reaction="confirm"` it means "ask first": approval runs the
   * original onClick. Boolean-only in v1.
   */
  blocked: boolean;
  /** Why it's blocked (tooltip body, toast message, or confirm message). */
  message: React.ReactNode;
  /** Default "tooltip". */
  reaction?: ActionGuardReaction;
  /** Toast only. Default "warning". */
  status?: ToastStatus;
  /** Confirm only: confirmAction options minus the key/message ActionGuard supplies. */
  confirm?: Omit<ConfirmOptions, "key" | "message">;
  /** An attempt was stopped (tooltip/toast shown, or confirm declined). */
  onBlocked?: () => void;
  /** Exactly one action element (Button, Link, ...). */
  children: React.ReactElement<Record<string, any>>;
}

const REVEAL_MS = 3000;

function ActionGuardView({
  blocked,
  message,
  reaction = "tooltip",
  status = "warning",
  confirm,
  onBlocked,
  children,
  forwardedRef,
}: ActionGuardProps & { forwardedRef: React.ForwardedRef<HTMLElement> }) {
  const id = React.useId();
  const [tipOpen, setTipOpen] = React.useState(false);
  const revealTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const confirming = React.useRef(false);
  const mounted = React.useRef(true);

  const child = React.isValidElement(children)
    ? (children as React.ReactElement<Record<string, any>>)
    : null;
  const childRef = child?.props.ref as React.Ref<HTMLElement> | undefined;
  const mergedRef = React.useMemo(
    () => composeRefs<HTMLElement>(forwardedRef, childRef),
    [forwardedRef, childRef],
  );

  const latest = React.useRef({
    message,
    status,
    confirm,
    onBlocked,
    onClick: child?.props.onClick,
  });
  latest.current = {
    message,
    status,
    confirm,
    onBlocked,
    onClick: child?.props.onClick,
  };

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(revealTimer.current);
    };
  }, []);

  React.useEffect(() => {
    if (!blocked) {
      clearTimeout(revealTimer.current);
      setTipOpen(false);
    }
  }, [blocked]);

  const reveal = () => {
    setTipOpen(true);
    clearTimeout(revealTimer.current);
    revealTimer.current = setTimeout(() => setTipOpen(false), REVEAL_MS);
  };

  const showToast = () => {
    const { message: m, status: s } = latest.current;
    const opts = { id: `action-guard:${id}` };
    if (s === "neutral") toast(m, opts);
    else toast[s](m, opts);
  };

  const ask = async (event: React.MouseEvent<HTMLElement>) => {
    if (confirming.current) return;
    confirming.current = true;
    try {
      const ok = await confirmAction({
        ...latest.current.confirm,
        key: `action-guard:${id}`,
        message: latest.current.message,
      } as ConfirmOptions);
      if (!mounted.current) return;
      if (ok) latest.current.onClick?.(event);
      else latest.current.onBlocked?.();
    } catch (error) {
      devWarn(`confirmAction rejected: ${String(error)}`);
      if (mounted.current) latest.current.onBlocked?.();
    } finally {
      confirming.current = false;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (reaction === "confirm") {
      void ask(event);
      return;
    }
    if (reaction === "toast") showToast();
    else reveal();
    latest.current.onBlocked?.();
  };

  if (!child) {
    devWarn("expects exactly one React element as its child.");
    return <>{children}</>;
  }
  if (blocked && child.props.disabled) {
    devWarn(
      "the child has a native `disabled` prop, so it never fires click and the guard can't react. Remove `disabled` and let `blocked` drive it.",
    );
  }

  const guarded = blocked
    ? React.cloneElement(child, {
        ref: mergedRef,
        "aria-disabled": true,
        "data-blocked": "",
        onClick: handleClick,
      })
    : forwardedRef
      ? React.cloneElement(child, { ref: mergedRef })
      : child;

  if (reaction !== "tooltip") return guarded;

  return (
    <Tooltip.Root
      open={blocked && tipOpen}
      onOpenChange={(open) => {
        if (!blocked) return;
        if (!open) clearTimeout(revealTimer.current);
        setTipOpen(open);
      }}
    >
      <Tooltip.Trigger asChild>{guarded}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>
          <Tooltip.Arrow />
          {message}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/**
 * Wraps one action and, while `blocked`, stops it and reacts with a tooltip, toast, or confirm.
 * Flat-only: a single wrapped child, nothing independently composable.
 */
export const ActionGuard = createComponent<ActionGuardProps, HTMLElement>({
  __kui: { role: "action", video: { id: "action-guard", safe: false } },
  displayName: "ActionGuard",
  render: (props, ref) => <ActionGuardView {...props} forwardedRef={ref} />,
});
