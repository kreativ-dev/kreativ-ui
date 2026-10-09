import * as React from "react";
import { composeRefs, createComponent, useTheme } from "@splenddev/kreativ-core";
import { RepeaterItemContext } from "./Repeater.context";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils";
import { useFlipAnimation } from "@/hooks/useFlipAnimation";

/**
 * Props for one row in a Repeater.
 *
 * `index` is the item's current position. Update it when the list
 * reorders so move and remove actions target the right item.
 */
export interface RepeaterItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Position of this item in the Repeater value. Zero is the first item.
   */
  index: number;
  /**
   * Content for this item, including its fields and item actions.
   */
  children: React.ReactNode;
}

/**
 * One Repeater item.
 *
 * Renders a `div` and provides the item index to `Repeater.Remove`,
 * `Repeater.MoveUp`, and `Repeater.MoveDown` nested inside it. It does
 * not read the list itself.
 */
export const RepeaterItem = createComponent<RepeaterItemProps, HTMLDivElement>({
  displayName: "Repeater.Item",
  __kui: {
    role: "layout",
    skeleton: "preserve",
    groupSlot: "Repeater",
    video: {
      id: "repeaterItem",
      safe: true,
      acceptsChildren: true,
      interactionStates: [],
      controlled: ["index"],
    },
  },
  render: function RepeaterItem({ index, children, className, ...rest }, ref) {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const composedRef = React.useMemo(
      () => composeRefs(ref, internalRef),
      [ref],
    );

    useFlipAnimation(internalRef, [index]);
    const contextValue = React.useMemo(() => ({ index }), [index]);

    const { theme } = useTheme();

    const resolvedRecipe = resolveRecipe(theme.recipes.RepeaterItem);
    const classes = cn(resolvedRecipe, className);

    return (
      <RepeaterItemContext.Provider value={contextValue}>
        <div ref={composedRef} className={classes} {...rest}>
          {children}
        </div>
      </RepeaterItemContext.Provider>
    );
  },
});
