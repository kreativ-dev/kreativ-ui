import * as React from "react";
import { FloatingFocusManager, useFloating } from "@floating-ui/react";

import { OverlayPortal } from "../overlay/OverlayPortal";
import { useDialogState } from "../Dialog/DialogProvider";
import type { ConfirmOptions } from "./Confirm.types";

import { resolveRecipe } from "@/theme/recipes/resolveRecipe";

import {
  createFromProps,
  composeRefs,
  createComponent,
  useTheme,
} from "@splenddev/kreativ-core";

export interface ConfirmDialogProps
  extends
    Omit<ConfirmOptions, "key">,
    Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Stack identity, supplied by ConfirmHost from the pending request. */
  id: string;
  onResolve: (result: boolean) => void;
}

const CONFIRM_DEFAULTS = {
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  status: "neutral",
} as const;

type ViewProps = ConfirmDialogProps & {
  contentRef: React.ForwardedRef<HTMLDivElement>;
};

function ConfirmDialogView({ contentRef, ...raw }: ViewProps) {
  const props = createFromProps<ConfirmDialogProps>({
    defaultProps: CONFIRM_DEFAULTS,
    consumerProps: raw,
  });

  const {
    id,
    title,
    message,
    confirmLabel,
    cancelLabel,
    status,
    onResolve,
    className,
    icon,
    ...rest
  } = props;

  const { stack, isTopmost, isSuspended } = useDialogState(id);

  const uid = React.useId();
  const titleId = `${uid}-title`;
  const messageId = `${uid}-message`;

  const cautious = status === "warning" || status === "error";

  // Prevent multiple resolutions during the closing lifecycle.
  const resolvedRef = React.useRef(false);

  const resolve = React.useCallback(
    (result: boolean) => {
      if (resolvedRef.current) return;

      resolvedRef.current = true;
      onResolve(result);
    },
    [onResolve],
  );

  // Register with the shared dialog stack.
  React.useEffect(() => {
    stack.register(id);

    return () => stack.unregister(id);
  }, [stack, id]);

  // Only the topmost dialog handles Escape.
  React.useEffect(() => {
    if (!isTopmost || isSuspended) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.repeat) return;

      event.preventDefault();
      event.stopPropagation();

      resolve(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isTopmost, isSuspended, resolve]);

  const { refs, context } = useFloating({
    open: true,
  });

  const mergedRef = React.useMemo(
    () =>
      composeRefs<HTMLDivElement>(
        contentRef,
        refs.setFloating as React.Ref<HTMLDivElement>,
      ),
    [contentRef, refs.setFloating],
  );

  const confirmRef = React.useRef<HTMLButtonElement>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const { theme } = useTheme();

  return (
    <OverlayPortal>
      <div
        className={resolveRecipe(theme.recipes.ConfirmLayer)}
        data-kui-part="confirm-layer"
        data-state={isSuspended ? "suspended" : "open"}
        inert={isSuspended}
        aria-hidden={isSuspended || undefined}
      >
        <div
          className={resolveRecipe(theme.recipes.ConfirmOverlay)}
          data-kui-part="confirm-overlay"
          aria-hidden="true"
        />

        <FloatingFocusManager
          context={context}
          modal
          disabled={isSuspended}
          initialFocus={cautious ? cancelRef : confirmRef}
          returnFocus
        >
          <div
            {...rest}
            ref={mergedRef}
            role={cautious ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={message ? messageId : undefined}
            tabIndex={-1}
            data-kui-part="confirm-content"
            data-status={status}
            className={resolveRecipe(
              theme.recipes.ConfirmContent,
              {},
              className,
            )}
          >
            <div
              className={resolveRecipe(theme.recipes.ConfirmHeader)}
              data-kui-part="confirm-header"
            >
              {icon && (
                <div
                  className={resolveRecipe(theme.recipes.ConfirmIcon, {
                    status,
                  })}
                  data-kui-part="confirm-icon"
                  aria-hidden="true"
                >
                  {icon}
                </div>
              )}

              <h2
                id={titleId}
                className={resolveRecipe(theme.recipes.ConfirmTitle)}
                data-kui-part="confirm-title"
              >
                {title}
              </h2>

              {message && (
                <p
                  id={messageId}
                  className={resolveRecipe(theme.recipes.ConfirmMessage)}
                  data-kui-part="confirm-message"
                >
                  {message}
                </p>
              )}
            </div>

            <div
              className={resolveRecipe(theme.recipes.ConfirmActions)}
              data-kui-part="confirm-actions"
            >
              <button
                ref={cancelRef}
                type="button"
                data-kui-part="confirm-cancel"
                className={resolveRecipe(theme.recipes.ConfirmButton, {
                  intent: "cancel",
                })}
                onClick={() => resolve(false)}
              >
                {cancelLabel}
              </button>

              <button
                ref={confirmRef}
                type="button"
                data-kui-part="confirm-submit"
                className={resolveRecipe(theme.recipes.ConfirmButton, {
                  intent: "confirm",
                  status,
                })}
                onClick={() => resolve(true)}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </FloatingFocusManager>
      </div>
    </OverlayPortal>
  );
}

export const ConfirmDialog = createComponent<
  ConfirmDialogProps,
  HTMLDivElement
>({
  __kui: {
    role: "overlay",
    skeleton: "preserve",
  },

  displayName: "ConfirmDialog",

  render: (props, ref) => <ConfirmDialogView {...props} contentRef={ref} />,
});
