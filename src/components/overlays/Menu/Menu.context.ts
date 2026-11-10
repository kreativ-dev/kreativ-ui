import * as React from "react";
import type {
  FloatingTreeType,
  useFloating,
  useInteractions,
} from "@floating-ui/react";

type Interactions = ReturnType<typeof useInteractions>;
type Floating = ReturnType<typeof useFloating>;

/** One per menu LEVEL: the Root is level 0, every Menu.Sub adds a level. */
export interface MenuLevel {
  open: boolean;
  setOpen: (open: boolean) => void;
  nested: boolean;
  refs: Floating["refs"];
  floatingStyles: React.CSSProperties;
  floatingContext: Floating["context"];
  getReferenceProps: Interactions["getReferenceProps"];
  getFloatingProps: Interactions["getFloatingProps"];
  getItemProps: Interactions["getItemProps"];
  activeIndex: number | null;
  elementsRef: React.RefObject<(HTMLElement | null)[]>;
  labelsRef: React.RefObject<(string | null)[]>;
  tree: FloatingTreeType | null;
  nodeId: string | undefined;
  parent: MenuLevel | null;
}

export const MenuContext = React.createContext<MenuLevel | null>(null);

export function useMenuContext(part: string): MenuLevel {
  const ctx = React.useContext(MenuContext);
  if (!ctx) throw new Error(`<${part}> must be rendered inside <Menu.Root>.`);
  return ctx;
}

/** True inside an explicit <Menu.Portal>, so Content doesn't portal a second time. */
export const MenuPortalContext = React.createContext(false);

export interface MenuRadioGroupValue {
  value: string | undefined;
  setValue: (value: string) => void;
}
export const MenuRadioGroupContext =
  React.createContext<MenuRadioGroupValue | null>(null);
