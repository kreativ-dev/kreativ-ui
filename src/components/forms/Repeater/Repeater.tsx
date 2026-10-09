import { RepeaterRoot } from "./Repeater.Root";
import { RepeaterItems } from "./Repeater.Items";
import { RepeaterItem } from "./Repeater.Item";
import { RepeaterRemove, RepeaterMoveUp, RepeaterMoveDown } from "./Repeater.Actions";
import { RepeaterAdd } from "./Repeater.Add";

export const Repeater = Object.assign(RepeaterRoot, {
  Root: RepeaterRoot,
  Items: RepeaterItems,
  Item: RepeaterItem,
  Remove: RepeaterRemove,
  MoveUp: RepeaterMoveUp,
  MoveDown: RepeaterMoveDown,
  Add: RepeaterAdd,
});

export type { RepeaterRootProps } from "./Repeater.Root";
export type { RepeaterItemsProps } from "./Repeater.Items";
export type { RepeaterItemProps } from "./Repeater.Item";
export type { RepeaterAddProps } from "./Repeater.Add";
