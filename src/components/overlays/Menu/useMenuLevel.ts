import * as React from "react";
import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  type Placement,
} from "@floating-ui/react";
import { MenuContext, type MenuLevel } from "./Menu.context";
import { useControllableState } from "@splenddev/kreativ-core/hooks";
import { useMenuSize } from "./useMenuSize";

export interface UseMenuLevelOptions {
  nested: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offset?: number;
  maxHeight?: number | string;
}

/** Everything a menu level (Root or Sub) needs, built on @floating-ui/react. */
export function useMenuLevel(opts: UseMenuLevelOptions): MenuLevel {
  const { nested } = opts;
  const enclosing = React.useContext(MenuContext);

  const [open, setOpen] = useControllableState({
    value: opts.open,
    defaultValue: opts.defaultOpen ?? false,
    onChange: opts.onOpenChange,
  });

  const menuSize = useMenuSize();
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const elementsRef = React.useRef<(HTMLElement | null)[]>([]);
  const labelsRef = React.useRef<(string | null)[]>([]);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();

  const { refs, floatingStyles, context } = useFloating({
    nodeId,
    open,
    onOpenChange: setOpen,
    placement: nested ? "right-start" : (opts.placement ?? "bottom-start"),
    middleware: [
      offset(
        nested
          ? { mainAxis: 0, alignmentAxis: -4 }
          : { mainAxis: opts.offset ?? 4 },
      ),
      flip(),
      shift({ padding: 8 }),
      menuSize,
    ],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    enabled: nested,
    delay: { open: 75 },
    handleClose: safePolygon({ blockPointerEvents: true }),
  });
  const click = useClick(context, {
    event: nested ? "click" : "mousedown",
    toggle: !nested,
  });
  const role = useRole(context, { role: "menu" });

  const dismiss = useDismiss(context, { bubbles: true });

  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    nested,
    onNavigate: setActiveIndex,
  });

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: open ? setActiveIndex : undefined,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [hover, click, role, dismiss, listNavigation, typeahead],
  );

  React.useEffect(() => {
    if (!tree) return;
    const onItemClick = () => setOpen(false);
    const onMenuOpen = (e: { parentId: string | null; nodeId: string }) => {
      if (e.nodeId !== nodeId && e.parentId === parentId) setOpen(false);
    };
    tree.events.on("click", onItemClick);
    tree.events.on("menuopen", onMenuOpen);
    return () => {
      tree.events.off("click", onItemClick);
      tree.events.off("menuopen", onMenuOpen);
    };
  }, [tree, nodeId, parentId, setOpen]);

  React.useEffect(() => {
    if (open && tree) tree.events.emit("menuopen", { parentId, nodeId });
  }, [tree, open, nodeId, parentId]);

  React.useEffect(() => {
    if (!open) setActiveIndex(null);
  }, [open]);

  return {
    open,
    setOpen,
    nested,
    refs,
    floatingStyles,
    floatingContext: context,
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    activeIndex,
    elementsRef,
    labelsRef,
    tree,
    nodeId,
    parent: nested ? enclosing : null,
  };
}
