import * as React from "react";
import {
  FloatingDelayGroup,
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  type Placement,
} from "@floating-ui/react";
import { OverlayPortal } from "../overlay/OverlayPortal";
import { useControllableState } from "@splenddev/kreativ-core/hooks";
import {
  createComponent,
  createFromProps,
  composeRefs,
  useTheme,
} from "@splenddev/kreativ-core";
import {
  TooltipContext,
  TooltipProviderContext,
  useTooltipContext,
  type TooltipDelay,
} from "./Tooltip.context";
import { tooltipArrowRecipe, tooltipContentRecipe } from "./Tooltip.recipe";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils";

const DEFAULT_DELAY: TooltipDelay = { open: 500, close: 0 };

export interface TooltipProviderProps {
  /** Open/close delay shared by every Tooltip.Root underneath (ms, or `{ open, close }`). Default 500. */
  delay?: TooltipDelay;
  /** After one tooltip closes, how long (ms) the next one opens instantly. Default 300. */
  skipDelayDuration?: number;
  children?: React.ReactNode;
}

export function TooltipProvider({
  delay = 500,
  skipDelayDuration = 300,
  children,
}: TooltipProviderProps) {
  const value = React.useMemo(() => ({ delay }), [delay]);
  return (
    <TooltipProviderContext.Provider value={value}>
      <FloatingDelayGroup delay={delay} timeoutMs={skipDelayDuration}>
        {children}
      </FloatingDelayGroup>
    </TooltipProviderContext.Provider>
  );
}

export interface TooltipRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: number;
  delay?: TooltipDelay;
  children?: React.ReactNode;
}

function TooltipRoot({
  open: openProp,
  defaultOpen,
  onOpenChange,
  placement: placementProp = "top",
  offset: offsetProp = 8,
  delay,
  children,
}: TooltipRootProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const arrowRef = React.useRef<HTMLElement | null>(null);
  const id = React.useId();
  const provider = React.useContext(TooltipProviderContext);

  const { refs, floatingStyles, context, placement, middlewareData } =
    useFloating({
      open,
      onOpenChange: setOpen,
      placement: placementProp,
      middleware: [
        offset(offsetProp),
        flip(),
        shift({ padding: 8 }),
        arrowMiddleware({ element: arrowRef }),
      ],
      whileElementsMounted: autoUpdate,
    });

  const group = useDelayGroup(context, { id });
  const hoverDelay = delay ?? (provider ? group.delay : DEFAULT_DELAY);

  const hover = useHover(context, {
    move: false,
    delay: hoverDelay,
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context, { outsidePress: false });
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  const value = {
    open,
    setOpen,
    refs,
    floatingStyles,
    floatingContext: context,
    getReferenceProps,
    getFloatingProps,
    placement,
    arrowRef,
    arrow: { x: middlewareData.arrow?.x, y: middlewareData.arrow?.y },
  };
  return (
    <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
  );
}

export interface TooltipTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function TooltipTriggerView({
  asChild,
  children,
  forwardedRef,
  ...rest
}: TooltipTriggerProps & {
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
}) {
  const ctx = useTooltipContext("Tooltip.Trigger");
  const generated = ctx.getReferenceProps();
  const dataState = ctx.open ? "open" : "closed";

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, any>>;
    const { ref: childRef, ...childProps } = child.props;
    const merged = createFromProps<Record<string, any>>({
      generatedProps: generated,
      consumerProps: { ...rest, ...childProps },
    });
    return React.cloneElement(child, {
      ...merged,
      "data-state": dataState,
      ref: composeRefs(
        ctx.refs.setReference as React.Ref<HTMLElement>,
        forwardedRef as React.Ref<HTMLElement>,
        childRef,
      ),
    });
  }

  const merged = createFromProps<Record<string, any>>({
    generatedProps: generated,
    consumerProps: rest,
  });
  return (
    <button
      type="button"
      {...merged}
      data-state={dataState}
      ref={composeRefs(
        ctx.refs.setReference as React.Ref<HTMLButtonElement>,
        forwardedRef,
      )}
    >
      {children}
    </button>
  );
}

const TooltipTrigger = createComponent<TooltipTriggerProps, HTMLButtonElement>({
  __kui: { role: "overlay", groupSlot: "Tooltip" },
  displayName: "Tooltip.Trigger",
  render: (props, ref) => <TooltipTriggerView {...props} forwardedRef={ref} />,
});

function TooltipPortal({ children }: { children?: React.ReactNode }) {
  const ctx = useTooltipContext("Tooltip.Portal");
  if (!ctx.open) return null;
  return <OverlayPortal>{children}</OverlayPortal>;
}

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const sideOf = (placement: Placement) =>
  placement.split("-")[0] as "top" | "bottom" | "left" | "right";

function TooltipContentView({
  forwardedRef,
  children,
  className,
  style,
  ...rest
}: TooltipContentProps & { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const ctx = useTooltipContext("Tooltip.Content");
  const ref = React.useMemo(
    () =>
      composeRefs<HTMLDivElement>(
        forwardedRef,
        ctx.refs.setFloating as React.Ref<HTMLDivElement>,
      ),
    [forwardedRef, ctx.refs.setFloating],
  );
  const { theme } = useTheme();
  if (!ctx.open) return null;

  return (
    <div
      {...ctx.getFloatingProps(rest)}
      ref={ref}
      style={{ ...ctx.floatingStyles, ...style }}
      className={resolveRecipe(theme.recipes.TooltipContent, {}, className)}
      data-state="open"
      data-side={sideOf(ctx.placement)}
    >
      {children}
    </div>
  );
}

const TooltipContent = createComponent<TooltipContentProps, HTMLDivElement>({
  __kui: { role: "overlay", groupSlot: "Tooltip" },
  displayName: "Tooltip.Content",
  render: (props, ref) => <TooltipContentView {...props} forwardedRef={ref} />,
});

export interface TooltipArrowProps extends React.HTMLAttributes<HTMLDivElement> {}

function TooltipArrowView({
  forwardedRef,
  className,
  style,
  ...rest
}: TooltipArrowProps & { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const ctx = useTooltipContext("Tooltip.Arrow");
  const side = sideOf(ctx.placement);
  const ref = React.useMemo(
    () =>
      composeRefs<HTMLDivElement>(
        forwardedRef,
        ctx.arrowRef as React.Ref<HTMLDivElement>,
      ),
    [forwardedRef, ctx.arrowRef],
  );
  const vars: Record<string, string> = {};
  if (ctx.arrow.x != null) vars["--kui-tooltip-arrow-x"] = `${ctx.arrow.x}px`;
  if (ctx.arrow.y != null) vars["--kui-tooltip-arrow-y"] = `${ctx.arrow.y}px`;

  const { theme } = useTheme();

  return (
    <div
      {...rest}
      ref={ref}
      aria-hidden
      data-side={side}
      style={{ ...vars, ...style }}
      className={resolveRecipe(theme.recipes.TooltipArrow, { side }, className)}
    />
  );
}

const TooltipArrow = createComponent<TooltipArrowProps, HTMLDivElement>({
  __kui: { role: "display", groupSlot: "Tooltip" },
  displayName: "Tooltip.Arrow",
  render: (props, ref) => <TooltipArrowView {...props} forwardedRef={ref} />,
});

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
};
