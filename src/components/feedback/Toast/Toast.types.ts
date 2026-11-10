import type { ReactNode } from "react";

/**
 * Semantic kind of a toast. Drives:
 *
 * - the accent color and default icon (`Toast.Icon` falls back to a status glyph);
 * - the ARIA role on the item (`"error"` → `role="alert"`, everything else
 *   → `role="status"`), so errors interrupt screen readers and the rest queue;
 * - the exit animation chosen by `Toast.Viewport`.
 *
 * Mirrors the semantic color tokens in `@theme`: `success` → `--color-kui-success`,
 * `warning` → `--color-kui-warning`, `info` → `--color-kui-info`,
 * `error` → `--color-kui-destructive`, `neutral` → `--color-kui-border`.
 *
 * @see ToastItem for the role mapping
 */
export type ToastStatus =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "neutral"
  | "brand";

/**
 * Where `Toast.Viewport` pins the notification region. Logical edges
 * (`start` / `end`) rather than physical (`left` / `right`), so the
 * region stays RTL-safe without any per-locale overrides.
 *
 * The `top-*` / `bottom-*` axis also selects the enter/exit animation
 * (top slides down, bottom slides up) — see the `ToastViewport` recipe.
 *
 * @see ToastViewport for the actual positioning and per-placement recipe
 */
export type ToastPlacement =
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end";

/**
 * A single inline action button rendered by `Toast.Action` on flat /
 * imperative toasts (i.e. entries created with `title` / `description`
 * props instead of compound `children`).
 *
 * Compound toasts (`<Toast.Root><Toast.Action … /></Toast.Root>`) set the
 * label as the button's children and pass `dismissOnAction` directly on the
 * part — this options object only exists to drive the flat template.
 *
 * @example
 * ```ts
 * toast("Message archived", {
 *   action: { label: "Undo", onClick: () => restore(id) },
 * });
 * ```
 */
export interface ToastActionOptions {
  /** Content of the action button. */
  label: ReactNode;
  /**
   * Invoked when the action button is clicked, **before** the toast is
   * dismissed (unless the handler calls `event.preventDefault()` — the
   * `Toast.Action` part checks `defaultPrevented`).
   */
  onClick: () => void;
  /**
   * Dismiss the toast after the action runs.
   *
   * Set to `false` for "retry", "open settings", and other actions where the
   * user may want to try again from the same toast.
   *
   * @default true
   */
  dismissOnAction?: boolean;
}

/**
 * Options accepted by both the imperative API (`toast(...)`,
 * `toast.promise(...)`, etc.) and the declarative `Toast.Root`.
 */
export interface ToastOptions {
  /**
   * Stable identifier. Reusing an id **updates the existing toast in place**
   * rather than adding a second one — this is what makes `toast.update(id, …)`
   * possible and what lets `Toast.Root` react to `open` toggling without
   * spawning duplicates.
   *
   * Auto-generated (`kui-toast-<useId>`) on `Toast.Root` when omitted;
   * auto-generated (monotonic counter) on imperative calls when omitted.
   */
  id?: string;
  /**
   * Primary line of text. Preferred over `description` in the flat template —
   * `Toast.Title` is only rendered when this is non-null.
   */
  title?: ReactNode;
  /**
   * Secondary line of text, rendered under `title` in `Toast.Description`.
   * Omit both `title` and `description` and only the icon + close button render.
   */
  description?: ReactNode;
  /**
   * Overrides the status-driven default icon. Ignored when using compound
   * children — pass `Toast.Icon`'s children instead, which are then used verbatim.
   */
  icon?: ReactNode;
  /**
   * Single inline action. Rendered as `Toast.Action` after the content, before
   * the close button. Toast supports one action per entry by design; for more
   * complex CTAs use compound children and nest as many `Toast.Action`s as needed.
   */
  action?: ToastActionOptions;
  /**
   * Auto-dismiss delay, in milliseconds.
   *
   * - `Infinity` — persistent; user must dismiss manually (or via `action` / `close`).
   * - `undefined` — falls through to `Toast.Provider`'s `duration`.
   * - Fallback chain: `entry.duration ?? provider.duration ?? store default (5000)`.
   *
   * The countdown **pauses** while the viewport is hovered/focused and while
   * the tab is hidden, so users can actually read long toasts.
   */
  duration?: number;
  /**
   * Whether `Toast.Close` is rendered on flat / imperative toasts.
   *
   * Compound toasts are unaffected — include or omit `Toast.Close` in `children`
   * to control dismissal there.
   *
   * @default true
   */
  dismissible?: boolean;
  /**
   * Called exactly once per entry, when it leaves the collection
   * (auto-dismiss, close button, action-dismiss, or programmatic `dismiss`).
   *
   * Useful for cleanup, analytics, or chaining (`onDismiss: () => toast("Next")`).
   * The entry id is passed so a single handler can serve many toasts.
   */
  onDismiss?: (id: string) => void;
  /**
   * Renders a thin progress bar showing the remaining auto-dismiss time.
   *
   * Only meaningful when `duration` is finite; the bar is hidden for
   * `Infinity` / `loading` toasts. Follows the pause/resume of the timer
   * itself — it does not tick independently.
   */
  showProgress?: boolean;
}

/**
 * A single item in the canonical collection rendered by `Toast.Viewport`.
 *
 * Created by `toastStore.upsert`, never by consumers directly. The store
 * assigns `id` and `rev`, and `ToastItem` sets `closing` when the exit
 * animation starts.
 */
export interface ToastEntry extends ToastOptions {
  /** Always present on entries — distinct from the optional `id` on `ToastOptions`. */
  id: string;
  /** Always present — defaults to `"neutral"` at the store boundary. */
  status: ToastStatus;
  /**
   * `toast.promise()` **pending** phase. Makes the entry persistent (ignoring
   * `duration`) and swaps the status icon for a spinner. Cleared when the
   * promise settles and the entry transitions to `success` / `error`.
   */
  loading?: boolean;
  /**
   * Playing its exit animation. Set by `toastStore.dismiss`. When the exit
   * completes (or is skipped under `prefers-reduced-motion`), the entry is
   * removed via `toastStore.remove`.
   *
   * @internal
   */
  closing?: boolean;
  /**
   * Bumped whenever `status` / `duration` / `loading` change so the dismiss
   * timer knows to restart. Never read by consumers.
   *
   * @internal
   */
  rev: number;
  /**
   * Declarative compound content (`Toast.Root` children). When present, the
   * flat template (`ToastIcon` + `ToastContent` + `ToastAction` + `ToastClose`)
   * is bypassed and the children render verbatim.
   *
   * The children must be direct `Toast.*` parts — `useValidateChildren("Toast", …)`
   * enforces this in dev.
   */
  children?: ReactNode;
}

/**
 * Render templates for `toast.promise`. Each phase can be a static node
 * (fast path) or a function of the settled value / rejection reason.
 *
 * @template T Successful resolution type of the wrapped promise.
 *
 * @example
 * ```ts
 * toast.promise(saveDraft(draftId), {
 *   loading: "Saving…",
 *   success: (draft) => `Saved as v${draft.version}`,
 *   error:   (err)   => `Could not save: ${(err as Error).message}`,
 * });
 * ```
 */
export interface ToastPromiseMessages<T> {
  /** Shown while the promise is pending. Also makes the entry persistent. */
  loading: ReactNode;
  /** Shown on resolve. Use the callback form to interpolate the result. */
  success: ReactNode | ((data: T) => ReactNode);
  /** Shown on reject. Use the callback form to interpolate the error. */
  error: ReactNode | ((error: unknown) => ReactNode);
}

/**
 * Options for `toast.update(id, …)` — mutate an existing entry in place
 * without changing its position in the stack.
 *
 * Omitting `status` keeps the current status. Use `message` as a shorthand
 * for `title` if you only need to swap the primary line.
 */
export interface ToastUpdateOptions extends ToastOptions {
  /** New semantic status. Keeps the current one when omitted. */
  status?: ToastStatus;
  /**
   * Shorthand for `title`. Wins over `title` if both are provided.
   * Exists so common update calls stay terse (`toast.update(id, { message: "Retried" })`).
   */
  message?: ReactNode;
}
