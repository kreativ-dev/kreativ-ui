"use client";

import * as React from "react";

import { isDev } from "@/utils/env";

import { SelectRoot } from "./SelectRoot";
import type { SelectRootProps } from "./Select.types";
import { SelectTrigger } from "./SelectTrigger";
import { SelectContent } from "./SelectContent";
import { SelectItem } from "./SelectItem";
import { SelectValue } from "./SelectValue";
import { SelectGroup } from "./SelectGroup";
import { SelectLabel } from "./SelectLabel";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends SelectRootProps {
  options?: SelectOption[];
}

function SelectImpl(
  { options, children, ...rootProps }: SelectProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const childArray = React.Children.toArray(children);
  const compound = childArray.length > 0;

  if (isDev() && compound && options?.length) {
    console.warn(
      "[kreativ-ui/Select]: options and children were both passed. Children are rendered; options are ignored.",
    );
  }

  return (
    <SelectRoot {...rootProps} ref={ref}>
      {compound ? (
        children
      ) : (
        <>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </>
      )}
    </SelectRoot>
  );
}

const SelectForwardRef = React.forwardRef(SelectImpl);

export const Select = Object.assign(SelectForwardRef, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Value: SelectValue,
  Group: SelectGroup,
  Label: SelectLabel,
  __kui: { formControl: "compound" as const },
});
