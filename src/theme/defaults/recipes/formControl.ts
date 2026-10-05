import { defineRecipe } from "@/theme/recipes";

export const formControlBase =
  "group relative inline-flex items-center " +
  "rounded-[var(--kui-radii-md)] " +
  "transition-[border-color,box-shadow] duration-[var(--kui-duration-fast)] " +
  "focus-within:outline-none " +
  "focus-within:ring-offset-2 " +
  "focus-within:ring-offset-surface";

export const formControlVariants = {
  outline: "border border-border bg-transparent text-text",

  filled: "border border-transparent bg-surface-raised text-text",

  ghost: "border border-transparent bg-transparent text-text",
} as const;

const standaloneStates = {
  none: "hover:border-brand focus-within:ring-2 focus-within:ring-brand/20",

  error:
    "border-destructive hover:border-destructive " +
    "focus-within:ring-2 focus-within:ring-destructive/20",

  success:
    "border-success hover:border-success " +
    "focus-within:ring-2 focus-within:ring-success/20",

  warning:
    "border-warning hover:border-warning " +
    "focus-within:ring-2 focus-within:ring-warning/20",
} as const;

const borderlessControl =
  "rounded-none border-0! shadow-none! " +
  "hover:border-0! hover:bg-transparent! " +
  "focus-within:ring-0! focus-within:ring-offset-0! focus-within-outline-none!";

export const formControlRecipe = defineRecipe({
  base: formControlBase,

  variants: {
    variant: formControlVariants,

    embedded: {
      true: borderlessControl,
      false: "",
    },

    groupItem: {
      true: borderlessControl,
      false: "",
    },

    state: standaloneStates,

    rounded: {
      true: "rounded-full",
      false: "",
    },

    fullWidth: {
      true: "w-full",
      false: "",
    },

    disabled: {
      true:
        "cursor-not-allowed " +
        "opacity-50 " +
        "border-border " +
        "hover:border-border " +
        "focus-within:ring-0",

      false: "",
    },

    attached: {
      true: "rounded-r-none",
      false: "",
    },

    hasAdornment: {
      true: "px-2",
      false: "",
    },
  },

  compoundVariants: [
    {
      conditions: {
        embedded: true,
        state: "none",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        embedded: true,
        state: "error",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        embedded: true,
        state: "success",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        embedded: true,
        state: "warning",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        groupItem: true,
        state: "none",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        groupItem: true,
        state: "error",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        groupItem: true,
        state: "success",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        groupItem: true,
        state: "warning",
      },
      className: "border-0! shadow-none! focus-within:ring-0! hover:border-0!",
    },

    {
      conditions: {
        disabled: true,
        state: "error",
      },
      className: "border-border hover:border-border focus-within:ring-0",
    },

    {
      conditions: {
        disabled: true,
        state: "success",
      },
      className: "border-border hover:border-border focus-within:ring-0",
    },

    {
      conditions: {
        disabled: true,
        state: "warning",
      },
      className: "border-border hover:border-border focus-within:ring-0",
    },

    {
      conditions: {
        embedded: true,
        disabled: true,
      },
      className:
        "border-0! hover:border-0! focus-within:ring-0! cursor-default",
    },

    {
      conditions: {
        groupItem: true,
        disabled: true,
      },
      className:
        "border-0! hover:border-0! focus-within:ring-0! cursor-default",
    },
  ],

  defaultVariants: {
    variant: "outline",
    state: "none",

    embedded: false,
    groupItem: false,

    rounded: false,
    fullWidth: true,
    disabled: false,
    hasAdornment: false,

    attached: false,
  },
});
