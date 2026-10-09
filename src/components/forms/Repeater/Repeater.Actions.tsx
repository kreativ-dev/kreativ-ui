import * as React from "react";
import { createComponent, useTheme } from "@splenddev/kreativ-core";
import {
  useRequiredRepeaterItemContext,
  useRequiredRepeaterRootContext,
} from "./Repeater.context";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { cn } from "@/utils";
export type RepeaterActionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const RepeaterRemove = createComponent<
  RepeaterActionButtonProps,
  HTMLButtonElement
>({
  displayName: "Repeater.Remove",
  __kui: {
    role: "action",
    supports: { disabled: true },
    skeleton: "rect",
    groupSlot: "Repeater",
    video: {
      id: "repeaterRemove",
      safe: true,
      acceptsChildren: true,
      needsParentContext: true,
      interactionStates: ["hover", "focus", "pressed"],
    },
  },
  render: function RepeaterRemove(props, ref) {
    const root = useRequiredRepeaterRootContext("Repeater.Remove");
    const item = useRequiredRepeaterItemContext("Repeater.Remove");
    const { className, ...rest } = props;

    const { theme } = useTheme();

    const resolvedRecipe = resolveRecipe(theme.recipes.RepeaterRemove);
    const classes = cn(resolvedRecipe, className);

    return (
      <button
        ref={ref}
        type="button"
        className={classes}
        onClick={(event) => {
          props.onClick?.(event);
          root.remove(item.index);
        }}
        {...rest}
      />
    );
  },
});

export const RepeaterMoveUp = createComponent<
  RepeaterActionButtonProps,
  HTMLButtonElement
>({
  displayName: "Repeater.MoveUp",
  __kui: {
    role: "action",
    supports: { disabled: true },
    skeleton: "rect",
    groupSlot: "Repeater",
    video: {
      id: "repeaterMoveUp",
      safe: true,
      acceptsChildren: true,
      needsParentContext: true,
      interactionStates: ["hover", "focus", "pressed"],
      controlled: ["disabled"],
    },
  },
  render: function RepeaterMoveUp(props, ref) {
    const root = useRequiredRepeaterRootContext("Repeater.MoveUp");
    const item = useRequiredRepeaterItemContext("Repeater.MoveUp");
    const { className, ...rest } = props;

    const { theme } = useTheme();

    const resolvedRecipe = resolveRecipe(theme.recipes.RepeaterMoveUp);
    const classes = cn(resolvedRecipe, className);

    return (
      <button
        ref={ref}
        type="button"
        disabled={item.index === 0}
        className={classes}
        onClick={(event) => {
          props.onClick?.(event);
          root.moveUp(item.index);
        }}
        {...rest}
      />
    );
  },
});

export const RepeaterMoveDown = createComponent<
  RepeaterActionButtonProps,
  HTMLButtonElement
>({
  displayName: "Repeater.MoveDown",
  __kui: {
    role: "action",
    supports: { disabled: true },
    skeleton: "rect",
    groupSlot: "Repeater",
    video: {
      id: "repeaterMoveDown",
      safe: true,
      acceptsChildren: true,
      needsParentContext: true,
      interactionStates: ["hover", "focus", "pressed"],
      controlled: ["disabled"],
    },
  },
  render: function RepeaterMoveDown(props, ref) {
    const root = useRequiredRepeaterRootContext("Repeater.MoveDown");
    const item = useRequiredRepeaterItemContext("Repeater.MoveDown");
    const { className, ...rest } = props;

    const { theme } = useTheme();

    const resolvedRecipe = resolveRecipe(theme.recipes.RepeaterMoveDown);
    const classes = cn(resolvedRecipe, className);

    return (
      <button
        ref={ref}
        type="button"
        disabled={item.index === root.value.length - 1}
        className={classes}
        onClick={(event) => {
          props.onClick?.(event);
          root.moveDown(item.index);
        }}
        {...rest}
      />
    );
  },
});
