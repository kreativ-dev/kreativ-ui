import { createContext, useContext } from "react";
import type { ButtonGroupSpacing } from "./ButtonGroup.types";
import { Orientation } from "@/types";
import type { ButtonProps } from "../Button/Button.types";

export interface ButtonGroupContextValue {
  orientation: Orientation;
  attached: boolean;
  spacing: ButtonGroupSpacing;
  size?: ButtonProps["size"];
}

export interface ButtonGroupItemContextValue {
  embedded: true;
}


const defaultButtonGroupContext: ButtonGroupContextValue = {
  orientation: 'horizontal',
  attached: false,
  spacing: "md",
  size: "md",
};

export const ButtonGroupContext = createContext<ButtonGroupContextValue>(
  defaultButtonGroupContext,
);

// to differentiate between being inside an item or not.
export const ButtonGroupItemContext =
  createContext<ButtonGroupItemContextValue | null>(null);


/**
 * Hook to consume the button group context.
 * Throws an error if used outside of a `ButtonGroup` provider.
 */
export function useButtonGroupContext(): ButtonGroupContextValue {
  const context = useContext(ButtonGroupContext);
  if (context === undefined) {
    throw new Error(
      "useButtonGroupContext must be used inside a <ButtonGroup /> provider",
    );
  }
  return context;
}

/**
 * Hook to consume the button group context without throwing.
 * Returns the default context if used outside a provider.
 */
export function useOptionalButtonGroupContext(): ButtonGroupContextValue {
  return useContext(ButtonGroupContext);
}

/**
 * Hook to check if a button is embedded inside a `ButtonGroupItem`.
 * Returns `true` if used inside an item, otherwise `false`.
 */
export function useButtonGroupItemContext(): boolean {
  const context = useContext(ButtonGroupItemContext);
  return context !== null;
}

// For advanced usage, also expose a hook that returns the item context value
export function useOptionalButtonGroupItemContext() {
  return useContext(ButtonGroupItemContext);
}
