import * as React from "react";
import { createComponent, useTheme, type KuiComponent } from "@splenddev/kreativ-core";
import { useRequiredRepeaterRootContext } from "./Repeater.context";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils";

/**
 * Props for the control that inserts a Repeater item.
 *
 * `onClick` is not the button's usual click handler. It receives the
 * item that was just inserted, after the list has been updated.
 */
export interface RepeaterAddProps<T> extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  /**
   * Builds the item to insert. Called on each click.
   */
  createItem: () => T;
  /**
   * Where the new item is inserted.
   *
   * `"append"` adds it at the end and `"prepend"` adds it at the start.
   * A number inserts at that index. Defaults to `"append"`. Several
   * `Repeater.Add` controls can use different positions in the same list.
   */
  position?: number | "append" | "prepend";
  /**
   * Called after the item is inserted.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>, newItem: T) => void;
}


/**
 * Inserts a new item into the nearest Repeater.
 *
 * Place it inside `Repeater`, not inside `Repeater.Item`. The button does
 * not submit a surrounding form unless you pass `type` yourself.
 */
export const RepeaterAdd = createComponent<
  RepeaterAddProps<unknown>,
  HTMLButtonElement
>({
  displayName: "Repeater.Add",
  __kui: {
    role: "action",
    supports: { disabled: true },
    skeleton: "rect",
    groupSlot: "Repeater",
    video: {
      id: "repeaterAdd",
      safe: true,
      acceptsChildren: true,
      needsParentContext: true,
      interactionStates: ["hover", "focus", "pressed"],
      controlled: ["position"],
    },
  },
  render: function RepeaterAdd(
    { createItem, position = "append", onClick, className, ...rest },
    ref,
  ) {
    const root = useRequiredRepeaterRootContext<unknown>("Repeater.Add");

    const { theme } = useTheme();

    const resolvedRecipe = resolveRecipe(theme.recipes.RepeaterAdd);
    const classes = cn(resolvedRecipe, className);

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        onClick={(event) => {
          const newItem = createItem();
          root.insert(newItem, position);
          onClick?.(event, newItem);
        }}
        {...rest}
      />
    );
  },
}) as KuiComponent<RepeaterAddProps<unknown>, HTMLButtonElement> &
  (<T>(
    props: RepeaterAddProps<T> & React.RefAttributes<HTMLButtonElement>,
  ) => React.ReactElement | null);
