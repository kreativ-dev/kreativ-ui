import { defineRecipe } from "@splenddev/kreativ-core";

export const numberStepperRecipe = defineRecipe({
  base: "kui-number-stepper",
  variants: {
    buttonLayout: {
      horizontal: "kui-number-stepper--horizontal",
      vertical: "kui-number-stepper--vertical",
    },
    disabled: {
      true: "kui-number-stepper--disabled",
      false: "",
    },
  },
  defaultVariants: {
    buttonLayout: "horizontal",
  },
});

export const numberStepperButtonsRecipe = defineRecipe({
  base: "kui-number-stepper__buttons",
});

export const numberStepperButtonRecipe = defineRecipe({
  base: "kui-number-stepper__button",
});
