import { useCallback, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import type {
  DefaultRecipeCollection,
  RecipeDefinition,
  ThemeOverride,
} from "@/types";

import { cn } from "@/utils/cn";
import { getRecipeNames } from "@/theme/recipes";
import { RecipePanel } from "./sections/RecipePanel";

type ComponentName = keyof DefaultRecipeCollection;

const COMPONENT_DESCRIPTIONS: Partial<Record<ComponentName, string>> = {
  Button: "Configure the visual recipe used by Button.",
  FormControl: "Configure the visual recipe used by FormControl.",
  Input: "Configure the visual recipe used by Input.",
  Textarea: "Configure the visual recipe used by Textarea.",
  MarkdownEditor: "Configure the visual recipe used by MarkdownEditor.",
  Checkbox: "Configure the visual recipe used by Checkbox.",
  ButtonGroup: "Configure the visual recipe used by ButtonGroup.",
};

interface Props {
  theme: ThemeOverride;
  onChange: (theme: ThemeOverride) => void;
}

export function RecipeEditor({ theme, onChange }: Props) {
  const components = useMemo(() => getRecipeNames(), []);

  const [openComponent, setOpenComponent] = useState<ComponentName | null>(
    "Button",
  );

  const updateRecipe = useCallback(
    (component: ComponentName, update: Partial<RecipeDefinition>) => {
      const recipes = theme.recipes ?? {};
      const current = recipes[component] ?? {};

      onChange({
        ...theme,
        recipes: {
          ...recipes,
          [component]: {
            ...current,
            ...update,
          },
        },
      });
    },
    [theme, onChange],
  );

  const removeRecipeProperty = useCallback(
    (component: ComponentName, key: keyof RecipeDefinition) => {
      const recipes = theme.recipes ?? {};
      const current = recipes[component];

      if (!current) return;

      const nextRecipe = { ...current };

      delete nextRecipe[key];

      const nextRecipes = { ...recipes };

      if (Object.keys(nextRecipe).length === 0) {
        delete nextRecipes[component];
      } else {
        nextRecipes[component] = nextRecipe;
      }

      onChange({
        ...theme,
        recipes: nextRecipes,
      });
    },
    [theme, onChange],
  );

 const hasOverride = useCallback(
   (component: ComponentName) => {
     const recipe = theme.recipes?.[component];

     return Boolean(recipe && Object.keys(recipe).length > 0);
   },
   [theme.recipes],
 );

  return (
    <div className="space-y-3">
      <header>
        <h3 className="font-mono text-xs uppercase text-text-muted">Recipes</h3>

        <p className="mt-1 max-w-xl text-xs leading-relaxed text-text-muted">
          Customize component recipes without modifying Kreativ UI defaults.
          Empty sections continue to use the default recipe.
        </p>
      </header>

      <div className="space-y-2">
        {components.map((component) => {
          const recipe = theme.recipes?.[component];
          const isOpen = openComponent === component;
          const customized = hasOverride(component);

          return (
            <section
              key={component}
              className={cn(
                "overflow-hidden rounded-lg border bg-background transition-all",
                isOpen ? "border-brand/50 shadow-sm" : "border-border",
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenComponent(isOpen ? null : component)}
                className="
                  flex w-full items-center justify-between
                  gap-3 px-3 py-3 text-left
                  transition-colors
                  hover:bg-surface/50
                "
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text">
                      {component}
                    </span>

                    {customized && (
                      <span
                        className="
                          rounded-full
                          bg-brand/10
                          px-1.5 py-0.5
                          font-mono text-[9px]
                          uppercase tracking-wide
                          text-brand
                        "
                      >
                        customized
                      </span>
                    )}
                  </span>

                  <span className="mt-0.5 block text-xs text-text-muted">
                    {COMPONENT_DESCRIPTIONS[component] ??
                      `Configure the visual recipe used by ${component}.`}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-text-muted transition-transform",
                    isOpen && "rotate-180 text-brand",
                  )}
                />
              </button>

              {isOpen && (
                <RecipePanel
                  component={component}
                  recipe={recipe}
                  updateRecipe={updateRecipe}
                  removeRecipeProperty={removeRecipeProperty}
                />
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
