import type { RecipeCollection } from "@/types";
import { defaultTokens } from "./tokens";
import { defaultSemanticTokens } from "./semanticTokens";
import { defaultTypography } from "./typography";
import { buttonRecipe } from "./recipes/button";
import { formControlRecipe } from "./recipes/formControl";
import { inputRecipe } from "./recipes/input";
import { textareaRecipe } from "./recipes/textarea";
import { markdownEditorRecipe } from "./recipes/markdownEditor";
import { defaultSizes } from "./sizes";
import { checkboxRecipe } from "./recipes/checkbox";
import { buttonGroupRecipe } from "./recipes/buttonGroup";
import { switchRecipe } from "./recipes/switch";
import { defineTheme } from "../defineTheme";
import { containerReccipe } from "./recipes/container";
import { linkRecipe } from "./recipes/link";

export const defaultRecipes: RecipeCollection = {
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
};

export const defaultTheme = defineTheme({
  tokens: defaultTokens,
  semanticTokens: defaultSemanticTokens,
  typography: defaultTypography,
  recipes: defaultRecipes,
  intensity: 50,
  sizes: defaultSizes,
});
