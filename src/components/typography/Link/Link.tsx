// Link.tsx
import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import type { LinkProps } from "./Link.types";
import { resolveRecipe } from "@/theme/recipes/resolveRecipe";
import { useTheme } from "@/hooks";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      as: Tag = "a",
      variant = "solid",
      color,
      underline = "hover",
      external,
      disabled,
      unstyled,
      className,
      style,
      children,
      href,
      ...rest
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const recipeClasses = unstyled
      ? ""
      : resolveRecipe(theme.recipes.Link, { variant, underline, disabled });

    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <Tag
        ref={ref}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={cn(recipeClasses, className)}
        style={{
          color: color ? `var(--kui-${color}, ${color})` : undefined,
          ...style,
        }}
        {...externalProps}
        {...rest}
      >
        {children}
        {external && (
          <svg
            aria-hidden="true"
            className="kui-link-external-icon"
            width="0.75em"
            height="0.75em"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M4 2h6v6M10 2 2 10"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Tag>
    );
  },
);

Link.displayName = "Link";
