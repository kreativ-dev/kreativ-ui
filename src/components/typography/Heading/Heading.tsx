import { forwardRef } from "react";
import { Text } from "../Text/Text";
import type { HeadingProps } from "./Heading.types";

const levelTag = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

const levelTypography = {
  1: "heading",
  2: "heading",
  3: "headingSmall",
  4: "headingSmall",
  5: "headingSmall",
  6: "headingSmall",
} as const;

export const Heading = forwardRef<HTMLElement, HeadingProps>(
  ({ level = 2, typography: typographyName, weight = "bold", ...rest }, ref) => {
    return (
      <Text
        ref={ref}
        as={levelTag[level]}
        typography={typographyName ?? levelTypography[level]}
        weight={weight}
        {...rest}
      />
    );
  },
);

Heading.displayName = "Heading";
