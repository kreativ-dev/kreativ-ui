# Kreativ UI

A modern, themeable React component library built with **React**, **TypeScript**, **Tailwind CSS v4**, and **CSS Variables**. Kreativ UI provides a runtime theme engine that lets you customize colors, typography, radius, sizes, and component styles **without rebuilding CSS**.

---

## ✨ Features

- Runtime theme switching (`light`, `dark`, `system`)
- Built-in `ThemeToggler` with optional animated transitions
- CSS‑variable‑driven design tokens
- Primitive + semantic token architecture
- Component‑level theme overrides
- Fully accessible (ARIA, keyboard navigation, focus management)
- TypeScript‑first and tree‑shakable
- Theme extension APIs for composable customization

---

## 📦 Installation

```bash
npm install @splenddev/kreativ-ui
```

Import the stylesheet **once** in your application entry:

```tsx
import "@splenddev/kreativ-ui/styles.css";
```

---

## 🚀 Quick Start

Wrap your app with `UIProvider` and use the `Button` component:

```tsx
import { UIProvider, Button } from "@splenddev/kreativ-ui";
import "@splenddev/kreativ-ui/styles.css";

export default function App() {
  return (
    <UIProvider defaultMode="system">
      <Button>Click me</Button>
    </UIProvider>
  );
}
```

---

## Core Concepts

Kreativ UI is more than a collection of components — it's a design-system foundation built around a layered theme architecture.

### Runtime Theming

The theme system resolves values at runtime using CSS variables. When you switch between light and dark modes, the UI updates instantly without rebuilding your application.

### Theme Architecture

The theme consists of several independent layers:

```text
Theme
├── tokens          → primitive design values
├── semanticTokens  → role-based values (mode-aware)
├── typography      → text presentation presets
├── recipes         → component visual behavior
├── sizes            → component dimensions and spacing
└── intensity       → color intensity scaling
```

Each layer can be customized independently, making it easy to extend or override specific aspects of the design system.

---

## Theme System

### Primitive Tokens

Primitive tokens represent raw design values — the building blocks of your theme.

Examples of primitive tokens include:

- Colors (`tokens.colors.blue.500`, `tokens.colors.gray.900`)
- Spacing (`tokens.spacing.md`)
- Radii (`tokens.radii.md`)
- Fonts (`tokens.fonts.body`)
- Font sizes (`tokens.fontSizes.md`)
- Font weights (`tokens.fontWeights.bold`)
- Line heights (`tokens.lineHeights.normal`)

Primitive tokens are defined using `defineToken` or `defineTokens`.

---

### Semantic Tokens

Semantic tokens represent UI meaning rather than raw values. They reference primitive tokens and provide mode-specific values.

```ts
semanticTokens.colors.brand = {
  value: {
    light: "{colors.blue.500}",
    dark: "{colors.blue.400}",
  },
};

semanticTokens.colors.text = {
  value: {
    light: "{colors.gray.900}",
    dark: "{colors.gray.50}",
  },
};
```

Semantic tokens make components easier to maintain because they reference meaningful roles instead of hard-coded colors. Changing the brand color updates every component that uses the `brand` semantic token.

---

### Sizes

The centralized size system controls component dimensions and layout properties.

Built-in sizes include:

| Size | Height  | Padding X | Font Size | Gap      | Icon Size | Radius  |
| ---- | ------- | --------- | --------- | -------- | --------- | ------- |
| `xs` | 1.75rem | 0.5rem    | 0.75rem   | 0.25rem  | 0.875rem  | 0.65rem |
| `sm` | 2rem    | 0.75rem   | 0.8125rem | 0.375rem | 1rem      | 0.8rem  |
| `md` | 2.5rem  | 1rem      | 0.875rem  | 0.5rem   | 1.125rem  | 1rem    |
| `lg` | 3rem    | 1.5rem    | 1rem      | 0.625rem | 1.25rem   | 1.15rem |

You can extend the size system with custom sizes.

Sizes can also be supplied responsively using the theme's configured breakpoints:

```tsx
<Button
  size={{
    base: "sm",
    md: "md",
    lg: "lg",
  }}
>
  Button
</Button>
```

In this example:

- `sm` is used by default.
- `md` is applied at the `md` breakpoint.
- `lg` is applied at the `lg` breakpoint.

Responsive sizing is handled by Kreativ UI rather than requiring component-specific responsive CSS.

---

### Responsive Values

Kreativ UI provides a generic `ResponsiveValue<T>` type for values that can change across breakpoints.

A responsive value can either be a single value:

```ts
size = "md";
```

or a breakpoint map:

```ts
size={{
  base: "sm",
  md: "md",
  lg: "lg",
}}
```

The general structure is:

```ts
type ResponsiveValue<T> =
  | T
  | {
      base?: T;
      sm?: T;
      md?: T;
      lg?: T;
      xl?: T;
      "2xl"?: T;
    };
```

The exact breakpoint keys are determined by the theme's configured breakpoint tokens.

Responsive values are resolved progressively using CSS media queries. The `base` value provides the default style, while breakpoint values override it at their respective minimum viewport widths.

For example:

```tsx
<Button
  size={{
    base: "xs",
    sm: "sm",
    lg: "lg",
  }}
>
  Responsive Button
</Button>
```

Conceptually, this produces:

```css
/* base */
height: ...;

/* sm */
@media (min-width: ...) {
  height: ...;
}

/* lg */
@media (min-width: ...) {
  height: ...;
}
```

This approach keeps responsive behavior inside the component API while still allowing the browser to perform the actual breakpoint switching through CSS.

Responsive values are not limited to sizes. The same pattern can be used by other APIs that need breakpoint-aware values.

---

### Typography

Typography controls text presentation independently from component sizing.

A typography preset defines:

- `fontFamily`
- `fontSize`
- `fontWeight`
- `lineHeight`
- `letterSpacing`

This separation is a key architectural principle:

```text
Component
├── Recipe       → visual variant/color behavior
├── Size         → dimensions and layout
└── Typography   → text presentation
```

Using `size="lg"` and `typography="bodySmall"` together gives you a large button with small text — the size controls the button's dimensions while typography controls the text appearance.

---

### Recipes

Recipes define component visual behavior such as variants and semantic colors.

Each component can have its own recipe, and recipes can be extended or overridden through the theme.

---

## Theme API

Kreativ UI provides a set of theme extension helpers for composing custom themes without manually manipulating the internal theme structure.

## `extendTheme`

The recommended way to create a custom theme configuration:

```tsx
import { extendTheme, UIProvider } from "@splenddev/kreativ-ui";

const theme = extendTheme({
  tokens: {
    // custom primitive tokens
  },
  semanticTokens: {
    // custom semantic tokens
  },
  typography: {
    // custom typography presets
  },
  sizes: {
    // custom sizes
  },
  recipes: {
    // custom component recipes
  },
});
```

---

## Tokens

### `defineToken`

Creates a single primitive token definition:

```ts
import { defineToken } from "@splenddev/kreativ-ui";

const bodyFont = defineToken("Inter, sans-serif");
```

### `defineTokens`

Creates a collection of token definitions:

```ts
import { defineTokens } from "@splenddev/kreativ-ui";

const fonts = defineTokens({
  body: "Inter, sans-serif",
  heading: "Poppins, sans-serif",
  mono: "JetBrains Mono, monospace",
});
```

### `extendTokens`

Extends existing token definitions:

```ts
import { extendTokens } from "@splenddev/kreativ-ui";

const customFonts = extendTokens({
  display: "Georgia, serif",
});
```

---

## Semantic Tokens

### `extendSemanticToken`

Extends semantic token definitions:

```ts
import { extendSemanticToken } from "@splenddev/kreativ-ui";

const customSemanticColors = extendSemanticToken({
  accent: {
    value: {
      light: "{colors.purple.500}",
      dark: "{colors.purple.300}",
    },
  },
});
```

---

## Sizes

### `defineSize`

Creates a reusable size definition:

```ts
import { defineSize } from "@splenddev/kreativ-ui";

const xlSize = defineSize({
  height: "3.5rem",
  paddingX: "2rem",
  fontSize: "1rem",
  gap: "0.75rem",
  iconSize: "1.25rem",
  radius: "1.25rem",
});
```

### `defineSizes`

Defines multiple size definitions:

```ts
import { defineSizes } from "@splenddev/kreativ-ui";

const customSizes = defineSizes({
  xl: {
    height: "3.5rem",
    paddingX: "2rem",
    fontSize: "1rem",
    gap: "0.75rem",
    iconSize: "1.25rem",
    radius: "1.25rem",
  },
});
```

### `extendSizes`

Extends the existing size system:

```ts
import { extendSizes } from "@splenddev/kreativ-ui";

const sizes = extendSizes({
  xl: {
    height: "3.5rem",
    paddingX: "2rem",
    fontSize: "1rem",
    gap: "0.75rem",
    iconSize: "1.25rem",
    radius: "1.25rem",
  },
});
```

### Responsive Sizes

Once a size exists in the theme, components can consume it responsively without creating separate size definitions:

```tsx
<Button
  size={{
    base: "sm",
    md: "md",
    lg: "xl",
  }}
>
  Button
</Button>
```

This keeps the size scale centralized while allowing components to select different size tokens at different breakpoints.

---

## Typography

### `defineTypography`

Creates a typography preset:

```ts
import { defineTypography } from "@splenddev/kreativ-ui";

const heading = defineTypography({
  fontFamily: "{fonts.heading}",
  fontSize: "{fontSizes.2xl}",
  fontWeight: "{fontWeights.bold}",
  lineHeight: "{lineHeights.tight}",
});
```

### `extendTypography`

Extends existing typography presets:

```ts
import { extendTypography } from "@splenddev/kreativ-ui";

const typography = extendTypography({
  display: {
    fontFamily: "{fonts.heading}",
    fontSize: "4rem",
    fontWeight: "{fontWeights.bold}",
    lineHeight: "1",
    letterSpacing: "-0.04em",
  },
});
```

---

## Recipes

### `defineRecipe`

Defines a component recipe:

```ts
import { defineRecipe } from "@splenddev/kreativ-ui";

const ButtonRecipe = defineRecipe({
  // recipe configuration
});
```

### `extendRecipe`

Extends an existing component recipe:

```ts
import { extendRecipe } from "@splenddev/kreativ-ui";

const customButtonRecipe = extendRecipe({
  // custom recipe overrides
});
```

## ☀️ UIProvider

The `UIProvider` component provides the theme context and manages the active color mode. It must wrap any part of your application that uses Kreativ UI components.

### Modes

| Mode     | Description                                    |
| -------- | ---------------------------------------------- |
| `light`  | Forces light mode                              |
| `dark`   | Forces dark mode                               |
| `system` | Follows the user's operating system preference |

### Props

| Prop           | Type                            | Default       | Description                              |
| -------------- | ------------------------------- | ------------- | ---------------------------------------- |
| `children`     | `ReactNode`                     | –             | Application content                      |
| `theme`        | `Theme`                         | default theme | Custom theme configuration               |
| `defaultMode`  | `"light" \| "dark" \| "system"` | `"system"`    | Initial color mode                       |
| `as`           | `ElementType`                   | `"div"`       | Root element type                        |
| `fallbackSize` | `string`                        | `"md"`        | Fallback size when theme size is missing |

### Example

```tsx
import { UIProvider } from "@splenddev/kreativ-ui";

<UIProvider defaultMode="system">
  <App />
</UIProvider>;
```

---

### `useTheme`

Access and change the current color mode anywhere in your app:

```tsx
import { useTheme } from "@splenddev/kreativ-ui";

function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  return (
    <>
      <button onClick={() => setMode("light")}>Light</button>
      <button onClick={() => setMode("dark")}>Dark</button>
      <button onClick={() => setMode("system")}>System</button>
    </>
  );
}
```

---

## 🌗 ThemeToggler

A ready‑to‑use theme switcher that integrates with `UIProvider`.

### Basic Usage

```tsx
import { ThemeToggler } from "@splenddev/kreativ-ui";

<ThemeToggler />;
```

### With System Mode

```tsx
<ThemeToggler allowSystem />
```

### Icon Only

```tsx
<ThemeToggler iconOnly allowSystem />
```

### Custom Variants

```tsx
<ThemeToggler variant="outline" activeVariant="solid" />
```

### Vertical Layout

```tsx
<ThemeToggler orientation="vertical" allowSystem />
```

### Custom Labels & Icons

```tsx
import { SunMedium, MoonStar, LaptopMinimal } from "lucide-react";

<ThemeToggler
  allowSystem
  labels={{ light: "Day", dark: "Night", system: "Auto" }}
  icons={{
    light: <SunMedium size={18} />,
    dark: <MoonStar size={18} />,
    system: <LaptopMinimal size={18} />,
  }}
/>;
```

### Cycle Mode with Animation

```tsx
<ThemeToggler
  display="cycle"
  allowSystem
  transition={{ type: "rotate", duration: 400, easing: "ease-in-out" }}
/>
```

Supported transition types: `none`, `fade`, `slide`, `scale`, `rotate`.

### Props

| Prop            | Type                                                            | Default            | Description                                 |
| --------------- | --------------------------------------------------------------- | ------------------ | ------------------------------------------- |
| `variant`       | `ThemeTogglerVariant`                                           | `"ghost"`          | Variant for inactive buttons                |
| `activeVariant` | `ThemeTogglerVariant`                                           | `"solid"`          | Variant for active button                   |
| `size`          | `"xs" \| "sm" \| "md" \| "lg" \| "xl"`                          | `"sm"`             | Button size                                 |
| `iconOnly`      | `boolean`                                                       | `false`            | Hide labels, show only icons                |
| `allowSystem`   | `boolean`                                                       | `false`            | Show system theme option                    |
| `orientation`   | `"horizontal" \| "vertical"`                                    | `"horizontal"`     | Layout direction                            |
| `rounded`       | `boolean`                                                       | `true`             | Rounded container corners                   |
| `unstyled`      | `boolean`                                                       | `false`            | Remove wrapper styles                       |
| `display`       | `"buttons" \| "cycle"`                                          | `"buttons"`        | Show all buttons or a single cycling button |
| `transition`    | `{ type?: TransitionType; duration?: number; easing?: string }` | `{ type: "none" }` | Animation configuration for cycle mode      |
| `labels`        | `Partial<Record<"light" \| "dark" \| "system", string>>`        | –                  | Override labels                             |
| `icons`         | `Partial<Record<"light" \| "dark" \| "system", ReactNode>>`     | –                  | Override icons                              |
| `buttonProps`   | `Partial<ButtonProps>`                                          | –                  | Props passed to every internal button       |
| `className`     | `string`                                                        | –                  | Additional wrapper class                    |

---

## 🧩 Button

A versatile, theme-aware button component with support for variants, sizes, typography, responsive sizing, loading states, icons, full-width layouts, and custom rendering.

### Basic Usage

```tsx
import { Button } from "@splenddev/kreativ-ui";

<Button>Click me</Button>;
```

By default, the Button uses:

- `variant="solid"`
- `color="brand"`
- `size="md"`
- `typography="body"`
- `fullWidth={false}`
- `isLoading={false}`
- `disabled={false}`

### Variants

Use `variant` to control the Button's visual treatment.

```tsx
<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="soft">Soft</Button>
<Button variant="link">Learn more</Button>
```

### Colors

```tsx
<Button color="brand">Brand</Button>
<Button color="success">Success</Button>
<Button color="destructive">Delete</Button>
<Button color="warning">Warning</Button>
<Button color="info">Info</Button>
<Button color="neutral">Neutral</Button>
```

### Sizes

Buttons support the standard Kreativ UI size scale:

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

Sizes can also be responsive:

```tsx
<Button
  size={{
    base: "sm",
    md: "md",
    lg: "lg",
  }}
>
  Responsive Button
</Button>
```

The `base` value is used by default, while breakpoint values are applied at their corresponding theme breakpoints.

### Typography

Button typography is controlled independently from its size:

```tsx
<Button typography="body">Default</Button>
<Button typography="bodySmall">Small Text</Button>
<Button typography="headingSmall">Heading Style</Button>
```

You can combine size and typography independently:

```tsx
<Button size="lg" typography="bodySmall">
  Large Button, Small Typography
</Button>
```

### Loading State

Use `isLoading` when an operation is in progress.

```tsx
<Button isLoading>
  Saving...
</Button>
```

When loading:

- A loading indicator is displayed.
- The Button becomes disabled.
- The Button receives `aria-busy="true"`.
- Normal icon rendering is suppressed.

### Icons

```tsx
<Button leftIcon={<SearchIcon />}>
  Search
</Button>

<Button rightIcon={<ArrowRightIcon />}>
  Continue
</Button>

<Button
  leftIcon={<DownloadIcon />}
  rightIcon={<ArrowRightIcon />}
>
  Download
</Button>
```

### Icon Only

```tsx
<Button iconOnly aria-label="Search">
  <SearchIcon />
</Button>
```

> **Accessibility:** Always provide an accessible label when the Button contains no visible text.

### Full Width

```tsx
<Button leftIcon={<SearchIcon />}>
  Search
</Button>
```

### Disabled

```tsx
<Button disabled>Unavailable</Button>
```

### Combining Props

Button features can be composed freely:

```tsx
<Button variant="outline" color="success" size="lg" leftIcon={<CheckIcon />}>
  Confirm
</Button>
```

### Custom Rendering

The `render` prop provides an advanced escape hatch for rendering the Button's resolved styles and content using another element or component:

```tsx
<Button
  render={(props) => (
    <a {...props} href="/templates">
      Templates
    </a>
  )}
>
  Templates
</Button>
```

The render function receives the resolved Button properties, including:

- `className`
- `style`
- `disabled`
- `aria-disabled`
- `aria-busy`
- `data-kui-responsive`
- `children`

#### Next.js Server Component Note

Since `render` is a function prop, it should be used from a Client Component:

```tsx
"use client";

import { Button } from "@splenddev/kreativ-ui";

export function TemplatesButton() {
  return (
    <Button
      render={(props) => (
        <a {...props} href="/templates">
          Templates
        </a>
      )}
    >
      Templates
    </Button>
  );
}
```

### Props

| Prop         | Type                                         | Default   | Description                                      |
| ------------ | -------------------------------------------- | --------- | ------------------------------------------------ |
| `variant`    | `ButtonVariant`                              | `"solid"` | Visual variant                                   |
| `color`      | `ButtonColor`                                | `"brand"` | Semantic color                                   |
| `size`       | `ResponsiveValue<ButtonSize>`                | `"md"`    | Component dimensions and icon sizing             |
| `typography` | `string`                                     | `"body"`  | Typography preset                                |
| `isLoading`  | `boolean`                                    | `false`   | Shows loading indicator and disables interaction |
| `leftIcon`   | `ReactNode`                                  | –         | Icon before content                              |
| `rightIcon`  | `ReactNode`                                  | –         | Icon after content                               |
| `iconOnly`   | `boolean`                                    | `false`   | Optimizes layout for icon-only content           |
| `fullWidth`  | `boolean`                                    | `false`   | Fills available width                            |
| `disabled`   | `boolean`                                    | `false`   | Disables interaction                             |
| `render`     | `(props: ButtonRenderProps) => ReactElement` | –         | Custom rendering escape hatch                    |
| `className`  | `string`                                     | –         | Additional CSS classes                           |
| `style`      | `React.CSSProperties`                        | –         | Inline style overrides                           |
| `children`   | `ReactNode`                                  | –         | Button content                                   |

All standard HTML `<button>` attributes and event handlers are also supported.

---

## 🧩 Input

A flexible text input with support for variants, sizes, validation states, adornments, password visibility, clearing, and loading states.

### Basic Usage

```tsx
import { Input } from "@splenddev/kreativ-ui";

<Input placeholder="Enter your name" />;
```

### Variants

```tsx
<Input variant="outline" />
<Input variant="filled" />
<Input variant="ghost" />
```

### Sizes

```tsx
<Input inputSize="sm" />
<Input inputSize="md" />
<Input inputSize="lg" />
```

### Input Kinds

The `kind` prop sets sensible defaults for `type`, `inputMode`, `autoComplete`, and sometimes a placeholder and icon:

```tsx
<Input kind="email" />
<Input kind="tel" />
<Input kind="url" />
<Input kind="search" />
<Input kind="numeric" />
<Input kind="password-current" />   // autoComplete="current-password" + show/hide toggle
<Input kind="password-new" />       // autoComplete="new-password" + show/hide toggle
```

To suppress the icon that comes with certain kinds:

```tsx
<Input kind="email" hideKindIcon />
```

### Validation States

```tsx
<Input error />
<Input success />
```

### Disabled & Loading

```tsx
<Input disabled />
<Input isLoading />  // shows a spinner, makes the field read‑only
```

### Adornments (Icons)

```tsx
<Input startIcon={<SearchIcon />} />
<Input endIcon={<MailIcon />} />
```

### Clearable

```tsx
<Input clearable onClear={() => console.log("cleared")} />
```

### Controlled & Uncontrolled

```tsx
// Controlled
const [value, setValue] = useState("");
<Input value={value} onChange={(e) => setValue(e.target.value)} />

// Uncontrolled
<Input defaultValue="Initial value" />
```

### Props

| Prop             | Type                               | Default     | Description                                                            |
| ---------------- | ---------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `variant`        | `"outline" \| "filled" \| "ghost"` | `"outline"` | Visual style                                                           |
| `inputSize`      | `"sm" \| "md" \| "lg"`             | `"md"`      | Height, padding, font size                                             |
| `kind`           | `InputKind`                        | `"text"`    | Sets defaults for type, inputMode, autoComplete, placeholder, and icon |
| `hideKindIcon`   | `boolean`                          | `false`     | Suppress the default icon from `kind`                                  |
| `error`          | `boolean`                          | `false`     | Danger styling and `aria-invalid`                                      |
| `success`        | `boolean`                          | `false`     | Success styling                                                        |
| `disabled`       | `boolean`                          | `false`     | Disables the input                                                     |
| `isLoading`      | `boolean`                          | `false`     | Shows spinner and marks read‑only                                      |
| `clearable`      | `boolean`                          | `false`     | Shows clear button when value is present                               |
| `onClear`        | `() => void`                       | –           | Called after clear                                                     |
| `rounded`        | `boolean`                          | `false`     | Fully rounded wrapper                                                  |
| `fullWidth`      | `boolean`                          | `true`      | Stretch to container width                                             |
| `startIcon`      | `ReactNode`                        | –           | Content before the input                                               |
| `endIcon`        | `ReactNode`                        | –           | Content after the input                                                |
| `className`      | `string`                           | –           | Additional wrapper class                                               |
| `inputClassName` | `string`                           | –           | Additional class for the native input element                          |

All standard `<input>` attributes (except `size`) are forwarded to the underlying `<input>`.

---

## 🧩 FormField

`FormField` is a compound component for building accessible form fields. It provides shared field context for labels, descriptions, controls, and validation messages while automatically coordinating IDs and accessibility attributes.

`FormField` can be used with controls such as `Input`, but it is not limited to a specific control component.

### Basic Structure

```tsx
import { FormField, Input } from "@splenddev/kreativ-ui";

<FormField>
  <FormField.Label>Email address</FormField.Label>

  <FormField.Description>We'll only send receipts here.</FormField.Description>

  <FormField.Control>
    <Input kind="email" placeholder="you@company.com" />
  </FormField.Control>
</FormField>;
```

### ⚠️ Important: Use `FormField.Control`

**`FormField.Control` should be used around the actual form control** when using `FormField`.

`FormField` provides the field context, but `FormField.Control` is responsible for connecting that context to the underlying control. This includes applying the generated field ID and relevant accessibility attributes such as `aria-describedby`, `aria-invalid`, and `aria-required`.

```tsx
<FormField>
  <FormField.Label>Email</FormField.Label>

  <FormField.Control>
    <Input kind="email" />
  </FormField.Control>
</FormField>
```

> Avoid placing the control directly inside `FormField`:

```tsx
{
  /* ❌ Avoid */
}
<FormField>
  <FormField.Label>Email</FormField.Label>
  <Input kind="email" />
</FormField>;
```

> Without `FormField.Control`, the control is not connected to the `FormField` accessibility context.

---

The compound API consists of:

| Component               | Purpose                                                                        |
| ----------------------- | ------------------------------------------------------------------------------ |
| `FormField`             | Provides field context, IDs, validation state, and accessibility relationships |
| `FormField.Label`       | Associates a visible label with the field                                      |
| `FormField.Description` | Provides supporting or descriptive text                                        |
| `FormField.Control`     | Connects the actual form control to the field context                          |
| `FormField.Message`     | Displays validation or custom feedback                                         |

---

### `FormField`

The root `FormField` component owns the field's shared state and accessibility information.

```tsx
<FormField>
  <FormField.Label>Username</FormField.Label>

  <FormField.Control>
    <Input />
  </FormField.Control>
</FormField>
```

If an `id` is not supplied, `FormField` generates a unique ID automatically.

The generated field IDs are used to coordinate:

- the control ID
- label association
- description association
- validation message association
- `aria-describedby`
- `aria-invalid`
- `aria-required`

### Props

| Prop        | Type              | Default        | Description                                                   |
| ----------- | ----------------- | -------------- | ------------------------------------------------------------- |
| `id`        | `string`          | auto-generated | Explicit ID for the form control                              |
| `status`    | `FormFieldStatus` | `"none"`       | Controls the field's validation status                        |
| `message`   | `string`          | —              | Validation or feedback message controlled by the parent field |
| `required`  | `boolean`         | `false`        | Marks the field as required                                   |
| `className` | `string`          | —              | Additional classes for the root wrapper                       |
| `children`  | `ReactNode`       | —              | Field content                                                 |

> The exact available values for `status` depend on the exported `FormFieldStatus` type. The root component explicitly supports `"none"` and `"error"`.

---

## Validation Status

Validation state is controlled through the `status` prop.

```tsx
<FormField status="error">
  <FormField.Label>Email</FormField.Label>

  <FormField.Control>
    <Input kind="email" />
  </FormField.Control>
</FormField>
```

The `status` contributes to the field's invalid state.

For example:

```tsx
<FormField status="error" message="Please enter a valid email address">
  ...
</FormField>
```

The field becomes invalid because its status is `"error"`.

---

## Validation Messages

`FormField` supports two ways of providing validation feedback:

1. A controlled `message` supplied to the root `FormField`.
2. A custom `<FormField.Message>` placed inside the field.

### Controlled Message

```tsx
<FormField status="error" message="Please enter a valid email address">
  <FormField.Label>Email address</FormField.Label>

  <FormField.Control>
    <Input kind="email" />
  </FormField.Control>
</FormField>
```

When no custom `FormField.Message` is present, the root automatically renders one.

This means consumers do not need to manually render:

```tsx
<FormField.Message />
```

for the common controlled-message case.

---

## Custom Messages

A custom `FormField.Message` can also be placed inside the field.

```tsx
<FormField status="error">
  <FormField.Label>Email address</FormField.Label>

  <FormField.Control>
    <Input kind="email" />
  </FormField.Control>

  <FormField.Message>Please enter a valid email address.</FormField.Message>
</FormField>
```

When a custom `FormField.Message` exists, the root `FormField` does not render an additional automatic message.

This allows the message content to be controlled directly at the composition level.

### One Custom Message

A `FormField` should contain at most one custom `FormField.Message`.

In development, Kreativ UI detects multiple custom message components and warns:

```text
[Kreativ UI] Multiple <FormField.Message /> components were detected inside the same <FormField>. Only one custom message should be provided.
```

---

## Native Control Validation

`FormField` can also receive validity information reported by the connected control.

The field maintains an internal validity state and can receive a `ReportedValidity` result through its context.

When the reported validity indicates an invalid control, the field can use the reported validation message.

Conceptually:

```text
Native/control validity
        ↓
ReportedValidity
        ↓
FormField
        ↓
reported message
        ↓
FormField.Message
```

A parent-provided `message` takes precedence over a message reported by the control.

The effective message is resolved as:

```text
message prop
    ↓
reported validity message
    ↓
no message
```

In other words, an explicitly supplied `message` overrides the automatically reported validity message.

---

## Required Fields

Set `required` on the root `FormField`:

```tsx
<FormField required>
  <FormField.Label>Email address</FormField.Label>

  <FormField.Control>
    <Input kind="email" />
  </FormField.Control>
</FormField>
```

The required state is exposed through the field context so that the associated components can apply the appropriate accessibility behavior.

---

## Labels

Use `FormField.Label` to provide the field's visible label.

```tsx
<FormField>
  <FormField.Label>First name</FormField.Label>

  <FormField.Control>
    <Input placeholder="Felix" />
  </FormField.Control>
</FormField>
```

The label is associated with the generated or supplied field ID.

`FormField` also tracks whether a label component is present. This allows the field to distinguish between a field with an external/registered label and one without one.

For accessibility, form controls should generally have an accessible name.

---

## Description

`FormField.Description` provides supporting information for the control.

```tsx
<FormField>
  <FormField.Label>Password</FormField.Label>

  <FormField.Description>Use at least 8 characters.</FormField.Description>

  <FormField.Control>
    <Input type="password" />
  </FormField.Control>
</FormField>
```

The description receives an ID derived from the field ID and participates in the control's `aria-describedby` relationship.

---

## Control

`FormField.Control` connects the actual form control to the surrounding `FormField` context.

```tsx
<FormField>
  <FormField.Label>Username</FormField.Label>

  <FormField.Control>
    <Input />
  </FormField.Control>
</FormField>
```

The control is responsible for receiving the field's relevant accessibility information, including the generated field ID and description relationships.

This allows the root field to manage accessibility relationships without requiring consumers to manually coordinate IDs.

---

## Accessibility Relationships

A typical field establishes relationships similar to:

```text
FormField
│
├── Label
│     └── htmlFor → field ID
│
├── Description
│     └── description ID
│
├── Control
│     ├── id → field ID
│     └── aria-describedby → description/message IDs
│
└── Message
      └── message ID
```

When the field has a message or custom message, its message ID is included in the control's `aria-describedby`.

When the field is invalid, the field context exposes the invalid state so the control can apply the appropriate `aria-invalid` behavior.

When `required` is enabled, the required state is also exposed to the control.

---

## Message Resolution

The root component resolves the displayed message using the following precedence:

```text
FormField.message
       ↓
reported validity message
       ↓
undefined
```

Therefore, this:

```tsx
<FormField
  status="error"
  message="Email is required"
>
```

takes precedence over a validation message reported by the connected control.

A custom:

```tsx
<FormField.Message>...</FormField.Message>
```

is handled separately as an explicit message component and prevents the root from rendering its automatic message component.

---

## Complete Example

```tsx
import { useState } from "react";
import { FormField, Input } from "@splenddev/kreativ-ui";

function EmailField() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function validateEmail(value: string) {
    if (!value) {
      setMessage("Email address is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(value)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("");
  }

  return (
    <FormField
      id="email"
      required
      status={message ? "error" : "none"}
      message={message || undefined}
    >
      <FormField.Label>Email address</FormField.Label>

      <FormField.Description>
        We'll only send receipts to this address.
      </FormField.Description>

      <FormField.Control>
        <Input
          kind="email"
          value={email}
          placeholder="you@example.com"
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => validateEmail(email)}
        />
      </FormField.Control>
    </FormField>
  );
}
```

This example demonstrates the intended separation of responsibilities:

```text
FormField
│
├── Field identity
│   └── id
│
├── Validation state
│   ├── status
│   └── message
│
├── Accessibility
│   ├── label relationship
│   ├── description relationship
│   ├── message relationship
│   └── required / invalid state
│
└── Control
    └── Input
```

### Standalone Control vs FormField

Use a standalone component such as `Input` when the surrounding UI does not require the full field composition.

Use `FormField` when you need a coordinated:

- label
- description
- validation state
- validation message
- required state
- accessibility relationship

The `FormField` system is designed to keep these concerns connected without requiring consumers to manually manage the generated IDs and ARIA relationships.

---

## 🧩 Select

A fully accessible, customizable select component with keyboard navigation, grouped options, and clearable selections.

### Basic Usage

```tsx
import { Select } from "@splenddev/kreativ-ui";

<Select placeholder="Select a country">
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>

  <Select.Content>
    <Select.Item value="us">United States</Select.Item>
    <Select.Item value="ca">Canada</Select.Item>
    <Select.Item value="mx">Mexico</Select.Item>
  </Select.Content>
</Select>;
```

### Controlled Select

```tsx
import { useState } from "react";

function ControlledSelect() {
  const [value, setValue] = useState<string | undefined>("");

  return (
    <Select value={value} onValueChange={setValue}>
      <Select.Trigger>
        <Select.Value placeholder="Choose a framework" />
      </Select.Trigger>

      <Select.Content>
        <Select.Item value="react">React</Select.Item>
        <Select.Item value="vue">Vue</Select.Item>
        <Select.Item value="svelte">Svelte</Select.Item>
      </Select.Content>
    </Select>
  );
}
```

### Uncontrolled Select

```tsx
<Select defaultValue="react">
  <Select.Trigger>
    <Select.Value placeholder="Choose a framework" />
  </Select.Trigger>

  <Select.Content>
    <Select.Item value="react">React</Select.Item>
    <Select.Item value="vue">Vue</Select.Item>
    <Select.Item value="angular">Angular</Select.Item>
  </Select.Content>
</Select>
```

### Props

| Prop            | Type                               | Default     | Description                                        |
| --------------- | ---------------------------------- | ----------- | -------------------------------------------------- |
| `value`         | `string`                           | –           | Controlled selected value                          |
| `defaultValue`  | `string`                           | –           | Uncontrolled initial value                         |
| `onValueChange` | `(value?: string) => void`         | –           | Called when selection changes                      |
| `placeholder`   | `string`                           | –           | Text shown when no value is selected               |
| `required`      | `boolean`                          | `false`     | Marks the field as required                        |
| `name`          | `string`                           | –           | Name for the hidden input used in form submissions |
| `disabled`      | `boolean`                          | `false`     | Disables the entire select                         |
| `clearable`     | `boolean`                          | `false`     | Shows a clear button                               |
| `variant`       | `"outline" \| "filled" \| "ghost"` | `"outline"` | Visual style                                       |
| `size`          | `"sm" \| "md" \| "lg"`             | `"md"`      | Size of the trigger and content                    |
| `error`         | `boolean`                          | `false`     | Shows error state                                  |
| `success`       | `boolean`                          | `false`     | Shows success state                                |
| `rounded`       | `boolean`                          | `false`     | Applies fully rounded corners to the trigger       |
| `className`     | `string`                           | –           | Additional class names for the root container      |

### Compound Components

#### `Select.Trigger`

The interactive button that toggles the dropdown:

```tsx
<Select.Trigger>
  <Select.Value />
</Select.Trigger>
```

#### `Select.Value`

Renders the current selection or the placeholder:

```tsx
<Select.Value placeholder="Choose an option" />
```

#### `Select.Content`

The dropdown container:

```tsx
<Select.Content>{/* items */}</Select.Content>
```

#### `Select.Item`

A single selectable option:

```tsx
<Select.Item value="react" disabled>
  React
</Select.Item>
```

#### `Select.Group`

Groups related options:

```tsx
<Select.Group>
  <Select.Label>Frontend</Select.Label>
  <Select.Item value="react">React</Select.Item>
  <Select.Item value="vue">Vue</Select.Item>
</Select.Group>
```

#### `Select.Label`

A heading for a group of options:

```tsx
<Select.Label>Backend</Select.Label>
```

### Clearable Select

```tsx
<Select clearable defaultValue="react">
  <Select.Trigger>
    <Select.Value placeholder="Pick a framework" />
  </Select.Trigger>

  <Select.Content>
    <Select.Item value="react">React</Select.Item>
    <Select.Item value="vue">Vue</Select.Item>
  </Select.Content>
</Select>
```

### FormField Integration

```tsx
<FormField required error="Please select a country">
  <FormField.Label>Country</FormField.Label>
  <FormField.Description>
    Select your country of residence.
  </FormField.Description>

  <Select>
    <Select.Trigger>
      <Select.Value placeholder="Select a country" />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="us">United States</Select.Item>
      <Select.Item value="ca">Canada</Select.Item>
    </Select.Content>
  </Select>

  <FormField.Message />
</FormField>
```

---

## 📝 Typography System

Kreativ UI provides a centralized, theme-aware typography system for controlling how text is rendered across your application.

### How It Works

Typography is built around four layers:

```
Primitive Tokens
      ↓
Semantic Tokens
      ↓
Typography Presets
      ↓
useTypography()
      ↓
React.CSSProperties
      ↓
Component
```

### Using `useTypography()`

Use the hook when creating a custom component:

```tsx
import { useTypography } from "@splenddev/kreativ-ui";

function MyCustomCard() {
  const headingStyles = useTypography("heading");
  const bodyStyles = useTypography("body");

  return (
    <div>
      <h2 style={headingStyles}>Card Title</h2>
      <p style={bodyStyles}>This is the card content.</p>
    </div>
  );
}
```

### Creating a Typography-Aware Custom Component

```tsx
import { TypographyProps, useTypography } from "@splenddev/kreativ-ui";

interface MyTextProps extends TypographyProps {
  children: React.ReactNode;
}

function MyText({ typography = "body", children }: MyTextProps) {
  const styles = useTypography(typography);

  return <p style={styles}>{children}</p>;
}
```

### Loading Fonts

Kreativ UI does **not** load fonts itself. Your application is responsible for loading fonts, and Kreativ UI consumes the font family values through the theme.

#### Next.js `next/font` Example

```tsx
import { Geist, Geist_Mono } from "next/font/google";
import { UIProvider, defineToken } from "@splenddev/kreativ-ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const theme = extendTheme({
  tokens: {
    fonts: {
      body: defineToken("var(--font-geist-sans)"),
      heading: defineToken("var(--font-geist-sans)"),
      mono: defineToken("var(--font-geist-mono)"),
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <UIProvider theme={theme}>{children}</UIProvider>
      </body>
    </html>
  );
}
```

### Best Practices

- **Prefer semantic typography names**: Use `typography="heading"` instead of `typography="font24"`
- **Use tokens for reusable values**: `fontSize: "{fontSizes.md}"` instead of `fontSize: "0.875rem"`
- **Let the application load fonts**: Kreativ UI should consume fonts rather than own the font-loading mechanism
- **Keep typography separate from layout**: Typography controls text properties; size controls dimensions

---

## ♿ Accessibility

Kreativ UI components are built with accessibility in mind:

- All interactive elements support keyboard navigation
- Focus management and visible focus indicators
- ARIA attributes are applied automatically where needed (`aria-label`, `aria-describedby`, `aria-invalid`)
- Color contrast respects system‑level settings
- FormField automatically manages `aria-describedby` relationships
- Loading states communicate `aria-busy="true"`
- Icon‑only buttons require `aria-label`

---

## 📦 Browser Support

Kreativ UI works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires React 18 or later.

---

## 🔧 TypeScript

Kreativ UI is TypeScript‑first, with typed theme configuration, component props, and extension APIs.

All theme helpers (`defineToken`, `extendTheme`, `defineSize`, etc.) are fully typed for a safe and predictable customization experience.

---

## 🎯 API Design Philosophy

Kreativ UI is designed around several key principles:

- **Separation of concerns**: Typography, sizing, and visual variants are independent layers
- **Composable customization**: Theme extension helpers provide type‑safe, intentional customization
- **Runtime theming**: CSS variables enable instant mode switching without rebuilding
- **Accessibility first**: ARIA, keyboard navigation, and focus management are built in
- **TypeScript‑first**: All APIs are fully typed for a great developer experience

---

## 🚧 Future Direction

> **Note:** The following describes future work that is not yet available in the current release.

The long‑term direction for Kreativ UI includes a broader ecosystem involving UI tooling, templates, CLI functionality, exports, analytics, and other developer/design tools. These features will be documented as they become available.

---

## 📄 License

MIT

---

**More component documentation (Checkbox, RadioGroup, Switch, Textarea, MarkdownEditor, Combobox, MultiSelect, InputField) coming soon.**  
Visit the [GitHub repository](https://github.com/Vincentvirtuoso/kreativ-ui) for updates.
