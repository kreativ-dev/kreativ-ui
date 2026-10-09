import type { RecipeCollection, Theme } from "@splenddev/kreativ-core/types";
import { defaultTokens } from "./tokens";
import { defaultSemanticTokens } from "./semanticTokens";
import { defaultTypography } from "./typography";
import { defaultSizes } from "./sizes";
import { buttonRecipe } from "./recipes/button";
import { formControlRecipe } from "./recipes/formControl";
import { inputRecipe } from "./recipes/input";
import { textareaRecipe } from "./recipes/textarea";
import { markdownEditorRecipe } from "./recipes/markdownEditor";
import { checkboxRecipe } from "./recipes/checkbox";
import { buttonGroupRecipe } from "./recipes/buttonGroup";
import { switchRecipe } from "./recipes/switch";
import { containerReccipe } from "./recipes/container";
import { linkRecipe } from "./recipes/link";
import { defineTheme } from "@splenddev/kreativ-core";
import {
  repeaterAddRecipe,
  repeaterItemRecipe,
  repeaterItemsRecipe,
  repeaterMoveDownRecipe,
  repeaterMoveUpRecipe,
  repeaterRemoveRecipe,
} from "./recipes/repeater";
import {
  numberStepperButtonRecipe,
  numberStepperButtonsRecipe,
  numberStepperRecipe,
} from "./recipes/numberStepper";

export const defaultRecipes = {
  Button: buttonRecipe,
  FormControl: formControlRecipe,
  Input: inputRecipe,
  Textarea: textareaRecipe,
  MarkdownEditor: markdownEditorRecipe,
  Checkbox: checkboxRecipe,
  ButtonGroup: buttonGroupRecipe,
  Switch: switchRecipe,
  Container: containerReccipe,
  Link: linkRecipe,
  RepeaterRemove: repeaterRemoveRecipe,
  RepeaterMoveUp: repeaterMoveUpRecipe,
  RepeaterMoveDown: repeaterMoveDownRecipe,
  RepeaterAdd: repeaterAddRecipe,
  RepeaterItem: repeaterItemRecipe,
  RepeaterItems: repeaterItemsRecipe,
  NumberStepper: numberStepperRecipe,
  NumberStepperButton: numberStepperButtonRecipe,
  NumberStepperButtons: numberStepperButtonsRecipe,
} satisfies RecipeCollection;

export const defaultTheme = defineTheme({
  tokens: defaultTokens,
  semanticTokens: defaultSemanticTokens,
  typography: defaultTypography,
  recipes: defaultRecipes,
  intensity: 50,
  sizes: defaultSizes,
} as const satisfies Theme);
