import * as React from "react";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingTree,
  useFloatingParentNodeId,
  useListItem,
  type Placement,
} from "@floating-ui/react";
import { OverlayPortal } from "../overlay/OverlayPortal";
import {
  MenuContext,
  MenuPortalContext,
  MenuRadioGroupContext,
  useMenuContext,
  type MenuLevel,
} from "./Menu.context";
import { useMenuLevel } from "./useMenuLevel";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import {
  createFromProps,
  composeRefs,
  createComponent,
  useTheme,
} from "@splenddev/kreativ-core";
import { useControllableState } from "@splenddev/kreativ-core/hooks";

/* ───────────────────────── Root / Sub (pure context providers) ─────────────────────────
 * Neither renders a DOM node of its own, so neither goes through createComponent
 * (same precedent as Popover.Root / Calendar.Root). */

export interface MenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: number;
  children?: React.ReactNode;
}

function LevelProvider({
  level,
  children,
}: {
  level: MenuLevel;
  children?: React.ReactNode;
}) {
  return (
    <MenuContext.Provider value={level}>
      <FloatingNode id={level.nodeId}>{children}</FloatingNode>
    </MenuContext.Provider>
  );
}

function MenuRootInner({ children, ...opts }: MenuRootProps) {
  const level = useMenuLevel({ nested: false, ...opts });
  return <LevelProvider level={level}>{children}</LevelProvider>;
}

function MenuRoot(props: MenuRootProps) {
  // The Root owns the FloatingTree unless it already lives inside one.
  const parentId = useFloatingParentNodeId();
  const inner = <MenuRootInner {...props} />;
  return parentId === null ? <FloatingTree>{inner}</FloatingTree> : inner;
}

export interface MenuSubProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function MenuSub({ children, ...opts }: MenuSubProps) {
  useMenuContext("Menu.Sub");
  const level = useMenuLevel({ nested: true, ...opts });
  return <LevelProvider level={level}>{children}</LevelProvider>;
}

/** Optional at the consumer level: Content portals itself when no Menu.Portal wraps it. */
function MenuPortal({ children }: { children?: React.ReactNode }) {
  const ctx = useMenuContext("Menu.Portal");
  if (!ctx.open) return null;
  return (
    <OverlayPortal>
      <MenuPortalContext.Provider value>{children}</MenuPortalContext.Provider>
    </OverlayPortal>
  );
}

/* ───────────────────────── Trigger ───────────────────────── */

export interface MenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function MenuTriggerView({
  asChild,
  children,
  forwardedRef,
  ...rest
}: MenuTriggerProps & { forwardedRef: React.ForwardedRef<HTMLButtonElement> }) {
  const ctx = useMenuContext("Menu.Trigger");
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

const MenuTrigger = createComponent<MenuTriggerProps, HTMLButtonElement>({
  __kui: { role: "overlay", groupSlot: "Menu" },
  displayName: "Menu.Trigger",
  render: (props, ref) => <MenuTriggerView {...props} forwardedRef={ref} />,
});

/* ───────────────────────── Content / SubContent ───────────────────────── */

export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum height of the menu.
   * Defaults to the available viewport height.
   */
  maxHeight?: number | string;
}

function MenuPanel({
  forwardedRef,
  portal,
  children,
  className,
  style,
  maxHeight,
  ...rest
}: MenuContentProps & {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  portal: boolean;
}) {
  const ctx = useMenuContext("Menu.Content");
  const { theme } = useTheme();
  const ref = React.useMemo(
    () =>
      composeRefs<HTMLDivElement>(
        forwardedRef,
        ctx.refs.setFloating as React.Ref<HTMLDivElement>,
      ),
    [forwardedRef, ctx.refs.setFloating],
  );


  if (!ctx.open) return null;

  const node = (
    <FloatingFocusManager
      context={ctx.floatingContext}
      modal={false}
      initialFocus={ctx.nested ? -1 : 0}
      returnFocus={!ctx.nested}
    >
      <div
        {...ctx.getFloatingProps(rest)}
        ref={ref}
        style={{ ...ctx.floatingStyles, ...style }}
        className={resolveRecipe(theme.recipes.MenuContent, {}, className)}
        data-state="open"
        data-menu-content=""
        data-max-height={
          maxHeight == null
            ? undefined
            : typeof maxHeight === "number"
              ? `${maxHeight}px`
              : maxHeight
        }
        aria-orientation="vertical"
      >
        <FloatingList elementsRef={ctx.elementsRef} labelsRef={ctx.labelsRef}>
          {children}
        </FloatingList>
      </div>
    </FloatingFocusManager>
  );
  return portal ? <OverlayPortal>{node}</OverlayPortal> : node;
}

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

const MenuLabel = createComponent<MenuLabelProps, HTMLDivElement>({
  __kui: { role: "display", groupSlot: "Menu" },
  displayName: "Menu.Label",

  render: ({ className, ...rest }, ref) => {
    const { theme } = useTheme();

    return (
      <div
        {...rest}
        ref={ref}
        className={resolveRecipe(theme.recipes.MenuLabel, {}, className)}
      />
    );
  },
});

function MenuContentView(
  props: MenuContentProps & {
    forwardedRef: React.ForwardedRef<HTMLDivElement>;
  },
) {
  const inPortal = React.useContext(MenuPortalContext);
  return <MenuPanel {...props} portal={!inPortal} />;
}

const MenuContent = createComponent<MenuContentProps, HTMLDivElement>({
  __kui: { role: "overlay", groupSlot: "Menu" },
  displayName: "Menu.Content",
  render: (props, ref) => <MenuContentView {...props} forwardedRef={ref} />,
});

const MenuSubContent = createComponent<MenuContentProps, HTMLDivElement>({
  __kui: { role: "overlay", groupSlot: "Menu" },
  displayName: "Menu.SubContent",
  // Sub levels always portal themselves: they render inside the parent's React tree
  // but must not be positioned relative to its DOM.
  render: (props, ref) => <MenuPanel {...props} forwardedRef={ref} portal />,
});

/* ───────────────────────── Items ───────────────────────── */

interface ItemBaseProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect"
> {
  disabled?: boolean;
  /** Typeahead label; derived from `children` when that is a plain string. */
  textValue?: string;
  /** Called on activation. `event.preventDefault()` keeps the menu open. */
  onSelect?: (event: Event) => void;
}

const labelOf = (textValue: string | undefined, children: React.ReactNode) =>
  textValue ?? (typeof children === "string" ? children : null);

/** Select-and-close for plain items; persistent items skip the close. */
function activate(
  ctx: MenuLevel,
  onSelect: ItemBaseProps["onSelect"],
  close: boolean,
) {
  const event = new Event("kui.menu.select", { cancelable: true });
  onSelect?.(event);
  if (close && !event.defaultPrevented) {
    if (ctx.tree) ctx.tree.events.emit("click");
    else ctx.setOpen(false);
  }
}

function useItemProps(
  part: string,
  { disabled, textValue, children, onSelect, onClick, ...rest }: ItemBaseProps,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
  opts: { role: string; close: boolean; onActivate?: () => void },
) {
  const ctx = useMenuContext(part);
  const item = useListItem({
    label: disabled ? null : labelOf(textValue, children),
  });
  const isActive = ctx.activeIndex === item.index;
  const ref = React.useMemo(
    () => composeRefs<HTMLButtonElement>(item.ref, forwardedRef),
    [item.ref, forwardedRef],
  );

  const props = ctx.getItemProps({
    ...rest,
    onClick(e: React.MouseEvent<HTMLButtonElement>) {
      onClick?.(e);
      if (disabled) return;
      opts.onActivate?.();
      activate(ctx, onSelect, opts.close);
    },
  });
  return {
    ctx,
    domProps: {
      ...props,
      ref,
      role: opts.role,
      type: "button" as const,
      disabled,
      tabIndex: isActive ? 0 : -1,
      "data-active": isActive || undefined,
      "data-disabled": disabled || undefined,
    },
  };
}

export interface MenuItemProps extends ItemBaseProps {
  tone?: "default" | "destructive";
  inset?: boolean;
}

function MenuItemView({
  forwardedRef,
  tone = "default",
  inset = false,
  ...props
}: MenuItemProps & {
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
}) {
  const { domProps } = useItemProps("Menu.Item", props, forwardedRef, {
    role: "menuitem",
    close: true,
  });

  const { theme } = useTheme();

  return (
    <button
      {...domProps}
      className={resolveRecipe(
        theme.recipes.MenuItem,
        {
          kind: "item",
          tone,
          inset,
        },
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}

const MenuItem = createComponent<MenuItemProps, HTMLButtonElement>({
  __kui: { role: "action", groupSlot: "Menu" },
  displayName: "Menu.Item",
  render: (props, ref) => <MenuItemView {...props} forwardedRef={ref} />,
});

export interface MenuCheckboxItemProps extends ItemBaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function MenuCheckboxItemView({
  forwardedRef,
  checked: checkedProp,
  defaultChecked,
  onCheckedChange,
  ...props
}: MenuCheckboxItemProps & {
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
}) {
  const [checked, setChecked] = useControllableState({
    value: checkedProp,
    defaultValue: defaultChecked ?? false,
    onChange: onCheckedChange,
  });
  const { domProps } = useItemProps("Menu.CheckboxItem", props, forwardedRef, {
    role: "menuitemcheckbox",
    close: false,
    onActivate: () => setChecked(!checked),
  });
  const { theme } = useTheme();

  return (
    <button
      {...domProps}
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={resolveRecipe(
        theme.recipes.MenuItem,
        { kind: "checkbox" },
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
const MenuCheckboxItem = createComponent<
  MenuCheckboxItemProps,
  HTMLButtonElement
>({
  __kui: { role: "action", groupSlot: "Menu" },
  displayName: "Menu.CheckboxItem",
  render: (props, ref) => (
    <MenuCheckboxItemView {...props} forwardedRef={ref} />
  ),
});

/* RadioGroup is NOT in the locked spec — added because RadioItem needs somewhere to keep its value. */
export interface MenuRadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

function MenuRadioGroupView({
  forwardedRef,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...rest
}: MenuRadioGroupProps & { forwardedRef: React.ForwardedRef<HTMLDivElement> }) {
  const [value, setValue] = useControllableState<string | undefined>({
    value: valueProp,
    defaultValue,
    onChange: (v) => v !== undefined && onValueChange?.(v),
  });
  const ctxValue = React.useMemo(
    () => ({ value, setValue: (v: string) => setValue(v) }),
    [value, setValue],
  );
  return (
    <MenuRadioGroupContext.Provider value={ctxValue}>
      <div {...rest} ref={forwardedRef} role="group" />
    </MenuRadioGroupContext.Provider>
  );
}
const MenuRadioGroup = createComponent<MenuRadioGroupProps, HTMLDivElement>({
  __kui: { role: "layout", groupSlot: "Menu" },
  displayName: "Menu.RadioGroup",
  render: (props, ref) => <MenuRadioGroupView {...props} forwardedRef={ref} />,
});

export interface MenuRadioItemProps extends ItemBaseProps {
  value: string;
}

function MenuRadioItemView({
  forwardedRef,
  value,
  ...props
}: MenuRadioItemProps & {
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
}) {
  const group = React.useContext(MenuRadioGroupContext);
  if (!group)
    throw new Error(
      "<Menu.RadioItem> must be rendered inside <Menu.RadioGroup>.",
    );
  const checked = group.value === value;
  const { domProps } = useItemProps("Menu.RadioItem", props, forwardedRef, {
    role: "menuitemradio",
    close: false,
    onActivate: () => group.setValue(value),
  });
  const { theme } = useTheme();

  return (
    <button
      {...domProps}
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className={resolveRecipe(
        theme.recipes.MenuItem,
        { kind: "radio" },
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}
const MenuRadioItem = createComponent<MenuRadioItemProps, HTMLButtonElement>({
  __kui: { role: "action", groupSlot: "Menu" },
  displayName: "Menu.RadioItem",
  render: (props, ref) => <MenuRadioItemView {...props} forwardedRef={ref} />,
});

const MenuSeparator = createComponent<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>({
  __kui: { role: "display", groupSlot: "Menu" },
  displayName: "Menu.Separator",
  render: ({ className, ...rest }, ref) => {
    const { theme } = useTheme();

    return (
      <div
        {...rest}
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={resolveRecipe(theme.recipes.MenuSeparator, {}, className)}
      />
    );
  },
});

/* ───────────────────────── SubTrigger ───────────────────────── */

export interface MenuSubTriggerProps extends Omit<ItemBaseProps, "onSelect"> {}

function MenuSubTriggerView({
  forwardedRef,
  disabled,
  textValue,
  children,
  className,
  onClick,
  ...rest
}: MenuSubTriggerProps & {
  forwardedRef: React.ForwardedRef<HTMLButtonElement>;
}) {
  const sub = useMenuContext("Menu.SubTrigger");
  const parent = sub.parent;
  if (!parent)
    throw new Error("<Menu.SubTrigger> must be rendered inside <Menu.Sub>.");

  const item = useListItem({
    label: disabled ? null : labelOf(textValue, children),
  });
  const isActive = parent.activeIndex === item.index;
  const ref = React.useMemo(
    () =>
      composeRefs<HTMLButtonElement>(
        sub.refs.setReference as React.Ref<HTMLButtonElement>,
        item.ref,
        forwardedRef,
      ),
    [sub.refs.setReference, item.ref, forwardedRef],
  );

  const props = sub.getReferenceProps(
    parent.getItemProps({ ...rest, onClick }),
  );
  const { theme } = useTheme();

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="menuitem"
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      data-active={isActive || undefined}
      data-disabled={disabled || undefined}
      data-state={sub.open ? "open" : "closed"}
      className={resolveRecipe(
        theme.recipes.MenuItem,
        { kind: "sub" },
        className,
      )}
    >
      {children}
    </button>
  );
}
const MenuSubTrigger = createComponent<MenuSubTriggerProps, HTMLButtonElement>({
  __kui: { role: "action", groupSlot: "Menu" },
  displayName: "Menu.SubTrigger",
  render: (props, ref) => <MenuSubTriggerView {...props} forwardedRef={ref} />,
});

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Portal: MenuPortal,
  Label: MenuLabel,
  Content: MenuContent,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Separator: MenuSeparator,
  Sub: MenuSub,
  SubTrigger: MenuSubTrigger,
  SubContent: MenuSubContent,
};
