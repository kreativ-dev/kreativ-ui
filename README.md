# Kreativ UI

A composable, themeable React component library built on [Kreativ Core](https://github.com/Vincentvirtuoso/kreativ-core).

Kreativ UI is the component layer of the Kreativ design system: layouts, forms, data displays, overlays, and interaction patterns, all written in TypeScript and all drawing from the same tokens, sizes, and recipes. Use it as a ready-made library, or as the starting point for your own design language.

> **Status:** actively evolving. The API may change while we finish extracting the design-system layer into Core. For production apps, pin your versions and read the release notes before upgrading.

## Why Kreativ UI?

The design system should be the foundation, not an afterthought. Every component shares the same tokens, semantic colors, typography, size scales, recipes, and interaction conventions, so things look and behave consistently, and re-theming doesn't mean touching components.

- **Themeable:** customize tokens, semantic colors, typography, sizes, and recipes
- **Light and dark mode:** including system preference
- **Composable:** compound components and flexible composition patterns
- **Responsive:** breakpoints come from the theme
- **Accessible:** semantic HTML, keyboard support, focus management
- **TypeScript-first:** strongly typed component APIs
- **Toolable:** component metadata lets tools like the CLI and Playground understand your components

## Install

```bash
npm install @splenddev/kreativ-ui
```

Import the styles and wrap your app with `KreativUIProvider`:

```tsx
import "@splenddev/kreativ-ui/styles.css";
import { KreativUIProvider } from "@splenddev/kreativ-ui";

export function App() {
  return (
    <KreativUIProvider>
      {/* your application */}
    </KreativUIProvider>
  );
}
```

## Quick start

```tsx
import { Button, Card, Input, Stack, KreativUIProvider } from "@splenddev/kreativ-ui";

export default function App() {
  return (
    <KreativUIProvider>
      <Card>
        <Stack gap="md">
          <Input placeholder="Your name" />
          <Button>Continue</Button>
        </Stack>
      </Card>
    </KreativUIProvider>
  );
}
```

## Components

**Layout:** `Container`, `Stack`, `Flex`, `Grid`, `Center`, `AspectRatio`, `Separator`, `ScrollArea`, `Resizable`, `Masonry`, `Background`, `BackgroundOverlay`, `Card`

**Forms:** `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Radio`, `RadioGroup`, `Slider`, `Combobox`, `Form`, `FormField`, `NumberStepper`, `DatePicker`, `TimePicker`, `DateTimePicker`, `FileUpload`, `PinInput`. Form controls share the same state conventions, and the form infrastructure is built to work with schema-driven validation.

**Data display:** `DataTable`, `List`, `DescriptionList`, `Tree`, `Timeline`, `Stat`, `Badge`, `Tag`, `Avatar`, `Kbd`

**Overlays:** `Tooltip`, `Popover`, `Dialog`, `DropdownMenu`, `ContextMenu`, `HoverCard`, `Sheet`. They're built around explicit composition and predictable state ownership.

## Patterns

### Compound components

Complex components are split into parts, so relationships are explicit and each piece stays composable:

```tsx
<Card>
  <Card.Header>
    <Card.Title>Account</Card.Title>
  </Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>
    <Button>Save</Button>
  </Card.Footer>
</Card>
```

### Controlled and uncontrolled

Interactive components support both modes where it makes sense:

```tsx
<Tooltip defaultOpen>...</Tooltip>                         {/* uncontrolled */}
<Tooltip open={open} onOpenChange={setOpen}>...</Tooltip>  {/* controlled */}
```

### `asChild`

Components that support `asChild` apply their behavior to your element instead of adding a wrapper:

```tsx
<Tooltip.Trigger asChild>
  <Button>Save</Button>
</Tooltip.Trigger>
```

The child stays the rendered element and receives the generated props and behavior.

### Component defaults

Set default props for any component once, from the provider:

```tsx
<KreativUIProvider defaults={{ button: { size: "sm" } }}>
  <App />
</KreativUIProvider>
```

Defaults are typed per component. Props you pass directly always win:

```
provider defaults → component defaults → generated props → your props
```

## Theming

Everything flows through one layered theme: primitive tokens → semantic tokens → typography → sizes → recipes → components. The default theme ships with Kreativ UI, and you can customize it without rebuilding anything.

```tsx
import { KreativUIProvider } from "@splenddev/kreativ-ui";
import { defineSemanticToken } from "@splenddev/kreativ-core";

const theme = {
  tokens: {
    colors: { brand: { 500: "#7c3aed" } },
  },
  semanticTokens: {
    colors: { brand: defineSemanticToken("{colors.brand.500}") },
  },
};

export function App() {
  return (
    <KreativUIProvider theme={theme}>
      ...
    </KreativUIProvider>
  );
}
```

You can customize tokens, semantic tokens, typography, recipes, size scales, intensity, and metadata. The theme API itself lives in Kreativ Core, so see its docs for the details.

### Color modes

```tsx
<KreativUIProvider defaultMode="light" />
<KreativUIProvider defaultMode="dark" />
<KreativUIProvider defaultMode="system" />  {/* follows prefers-color-scheme */}
```

Components use semantic tokens instead of hard-coded light and dark values, so one implementation works in every theme.

### The default design language

- **Colors:** a structured scale with semantic roles: `brand`, `background`, `surface`, `border`, `text`, `muted text`, `destructive`, `success`, `warning`, `info`
- **Typography:** semantic presets for common interface roles
- **Sizes:** a shared `xs`, `sm`, `md`, `lg`, `xl` scale covering height, width, padding, font size, gap, icon size, and radius
- **Motion:** reusable animation tokens for common transitions and states
- **Intensity:** a theme value that the runtime and component styles can read

### Recipes

Components are styled with recipes: base styles, variants, default variants, and compound variants. Styling stays declarative and theme-aware.

```ts
const recipe = defineRecipe({
  base: "...",
  variants: { variant: { solid: "...", outline: "...", ghost: "..." } },
  defaultVariants: { variant: "solid" },
});
```

Recipes are powered by Kreativ Core.

### Responsive design

Breakpoints come from the active theme, and the runtime generates the responsive rules. Components never hard-code breakpoint values.

## Component metadata

Components can describe themselves through `__kui`: their role, compound group, form-control behavior, supported states, and skeleton behavior.

```ts
{ __kui: { role: "overlay", groupSlot: "Tooltip" } }
```

This gives tools a machine-readable layer to build on: the Kreativ CLI, Playground, and Forge, plus component inspection, composition tooling, and code generation.

Skeleton behavior is declared the same way, with hints of `"text"`, `"rect"`, `"circle"`, `"input-shaped"`, or `"preserve"`.

## Accessibility

Components aim for accessible defaults: semantic HTML, keyboard interaction, focus management, appropriate ARIA, accessible states, and predictable overlay positioning and dismissal. Behavior varies by component, so check each component's docs for specifics.

## Kreativ Core

Kreativ UI is built on Core, and the split is simple: **Core defines how the design system works, and Kreativ UI defines what the default one looks and feels like.** Tokens, themes, recipes, validation, CSS variables, and component metadata live in Core. The components, default theme, and the React-specific behavior live here.

`KreativUIProvider` is a thin wrapper around Core's `ThemeProvider`. It adds the default theme, the overlay root for popovers, dialogs, and toasts, and typed per-component defaults.

## The Kreativ ecosystem

- **Kreativ Core:** the design-system foundation
- **Kreativ UI:** the React component library
- **Kreativ CLI:** developer tooling for the ecosystem
- **Kreativ Playground:** a visual environment for exploring and composing Kreativ UI
- **Kreativ Forge:** turns Kreativ UI compositions into polished visual content

## Development

```bash
git clone https://github.com/Vincentvirtuoso/kreativ-ui.git
cd kreativ-ui
npm install
npm run dev     # development environment
npm run build   # build the package
```

## Contributing

Contributions are welcome. Please keep these in mind:

- prefer composition over unnecessary abstraction
- keep component APIs predictable
- reuse the theme system instead of adding isolated design values
- keep accessibility part of the component contract
- prefer explicit state ownership
- preserve TypeScript inference
- keep framework-specific behavior separated where practical
- add metadata when a component takes part in Kreativ's component model

## License

See the repository license.
