"use client";

import { forwardRef, Fragment, Children, isValidElement } from "react";
import { Flex } from "../Flex/Flex";
import type { StackProps } from "./Stack.types";

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ orientation = "vertical", divider, children, ...rest }, ref) => {
    const direction = orientation === "horizontal" ? "row" : "column";

    if (!divider) {
      return (
        <Flex ref={ref} direction={direction} {...rest}>
          {children}
        </Flex>
      );
    }

    const items = Children.toArray(children).filter(isValidElement);

    return (
      <Flex ref={ref} direction={direction} {...rest}>
        {items.map((child, index) => (
          <Fragment key={child.key ?? index}>
            {child}
            {index < items.length - 1 && divider}
          </Fragment>
        ))}
      </Flex>
    );
  },
);

Stack.displayName = "Stack";
