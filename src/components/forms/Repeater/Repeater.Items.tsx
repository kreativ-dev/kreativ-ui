import * as React from "react";

import { createComponent, type KuiComponent } from "@splenddev/kreativ-core";

import { useRequiredRepeaterRootContext } from "./Repeater.context";

export interface RepeaterItemsProps<T> {
  children: (item: T, index: number) => React.ReactNode;
}

export const RepeaterItems = createComponent<
  RepeaterItemsProps<unknown>,
  never
>({
  displayName: "Repeater.Items",

  __kui: {
    role: "layout",
    skeleton: "preserve",
    groupSlot: "Repeater",

    video: {
      id: "repeaterItems",
      safe: true,
      acceptsChildren: true,
      needsParentContext: true,
      interactionStates: [],
    },
  },

  render: function RepeaterItems({ children }, _ref) {
    const ctx = useRequiredRepeaterRootContext<unknown>("Repeater.Items");

    return (
      <React.Fragment>
        {ctx.value.map((item, index) => (
          <React.Fragment key={ctx.getKey(item, index)}>
            {children(item, index)}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  },
}) as KuiComponent<RepeaterItemsProps<unknown>, never> &
  (<T>(
    props: RepeaterItemsProps<T> & React.RefAttributes<never>,
  ) => React.ReactElement | null);
