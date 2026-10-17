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
import { containerRecipe } from "./recipes/container";
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
import {
  cardBodyRecipe,
  cardFooterRecipe,
  cardHeaderRecipe,
  cardMediaRecipe,
  cardOverlayRecipe,
  cardRecipe,
} from "./recipes/card";
import { scrollAreaRecipe } from "./recipes/scrollArea";
import { boxRecipe } from "./recipes/box";
import { flexRecipe } from "./recipes/flex";
import { gridRecipe } from "./recipes/grid";

export const defaultRecipes = {
  Box: boxRecipe,
  Button: buttonRecipe,
  ButtonGroup: buttonGroupRecipe,
  Checkbox: checkboxRecipe,
  Flex: flexRecipe,
  FormControl: formControlRecipe,
  Input: inputRecipe,
  Textarea: textareaRecipe,
  MarkdownEditor: markdownEditorRecipe,
  Switch: switchRecipe,
  Container: containerRecipe,
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
  CardBody: cardBodyRecipe,
  CardFooter: cardFooterRecipe,
  CardHeader: cardHeaderRecipe,
  CardMedia: cardMediaRecipe,
  CardOverlay: cardOverlayRecipe,
  Card: cardRecipe,
  ScrollArea: scrollAreaRecipe,
  Grid: gridRecipe,
} satisfies RecipeCollection;

export const defaultTheme = defineTheme({
  tokens: defaultTokens,
  semanticTokens: defaultSemanticTokens,
  typography: defaultTypography,
  recipes: defaultRecipes,
  intensity: 50,
  sizes: defaultSizes,
} as const satisfies Theme);
