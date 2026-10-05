// Text.tsx
import { forwardRef } from "react";
import { useTheme } from "@/hooks";
import { cn } from "@/utils/cn";
import type { TextProps } from "./Text.types";

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as: Tag = "p",
      typography: typographyName = "body",
      color,
      align,
      truncate,
      clampLines,
      weight,
      italic,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const textStyle =
      theme.typography?.[typographyName] ?? theme.typography?.body;

    const resolvedStyle: React.CSSProperties = {
      fontFamily: textStyle?.fontFamily,
      fontWeight: weight ? undefined : textStyle?.fontWeight,
      lineHeight: textStyle?.lineHeight,
      letterSpacing: textStyle?.letterSpacing,
      color: color ? `var(--kui-${color}, ${color})` : undefined,
      textAlign: align,
      fontStyle: italic ? "italic" : undefined,
      ...style,
    };

    return (
      <Tag
        ref={ref}
        className={cn(
          "kui-text",
          //   "kui-text",
          weight && `font-${weight}`,
          truncate && "truncate",
          clampLines && "overflow-hidden text-ellipsis",
          className,
        )}
        style={{
          ...resolvedStyle,
          ...(clampLines
            ? {
                display: "-webkit-box",
                WebkitLineClamp: clampLines,
                WebkitBoxOrient: "vertical",
              }
            : {}),
        }}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

Text.displayName = "Text";
