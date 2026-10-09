import { z } from "zod";
import {
  cn,
  defineUIField,
  type KuiFormControlComponent,
  UIObjectSchemaFor,
} from "../../src";
import { KuiFormControlValueProps } from "@/components/forms/form/FromSchema/uiSchema.types";

export const profileSchema = z.object({
  fullName: z.string().min(1),
  bio: z.string().max(280).optional(),
  role: z.enum(["admin", "editor", "viewer"]),
  marketingOptIn: z.boolean().default(false),
  age: z.number().min(13).max(120),
  favoriteColor: z.string(),
  website: z.url().optional(),
  notification: z.boolean().optional().default(true),

  phones: z.array(z.string()).default([]),
  contacts: z
    .array(
      z.object({
        name: z.string().min(1),
        email: z.email(),
        age: z.number().min(1).optional(),
      }),
    )
    .default([]),
});

interface ColorSwatchPickerProps extends KuiFormControlValueProps<string> {
  presetColors?: string[];
}

const ColorSwatchPicker: KuiFormControlComponent<ColorSwatchPickerProps> =
  Object.assign(
    (props: ColorSwatchPickerProps) => {
      const presets = props.presetColors ?? [
        "#F43F5E",
        "#F59E0B",
        "#10B981",
        "#3B82F6",
        "#8B5CF6",
      ];
      return (
        <div style={{ display: "flex", gap: 8 }}>
          {presets.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-pressed={props.value === hex}
              onClick={() => props.onValueChange?.(hex)}
              className={cn(
                "w-6 h-6 rounded-full border-4",
                props.value === hex
                  ? "border-kui-primary"
                  : "border-transparent",
              )}
              style={{
                background: hex,
              }}
            />
          ))}
        </div>
      );
    },
    { __kui: { formControl: "single" as const } },
  );

export const profileUiSchema: UIObjectSchemaFor<typeof profileSchema> = {
  fullName: defineUIField({
    widget: "input",
    label: "Full name",
    order: 0,
    gridArea: "name",
    props: {
      placeholder: "Ada Lovelace",
      autoComplete: "name",
    },
  }),

  role: defineUIField({
    widget: "select",
    label: "Role",
    description: "Controls what this member can see and edit.",
    order: 1,
    gridArea: "role",
    props: {
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
      placeholder: "Choose a role",
    },
  }),

  bio: defineUIField({
    widget: "textarea",
    label: "Bio",
    description: "A short blurb shown on your public profile.",
    order: 2,
    gridArea: "bio",
    props: {
      placeholder: "Tell us a bit about yourself…",
      minRows: 2,
      maxRows: 4,
      autoResize: true,
      maxLength: 280,
      characterCounter: true,
      allowMarkdown: true,
    },
  }),

  age: defineUIField({
    widget: "number-stepper",
    gridArea: "age",
    props: { clampOn: "never" },
  }),

  marketingOptIn: defineUIField({
    widget: "switch",
    label: "Marketing emails",
    description: "Occasional product updates — unsubscribe anytime.",
    order: 4,
    gridArea: "marketing",
  }),

  website: defineUIField<string>({
    label: "Website",
    order: 5,
    gridArea: "website",
    render: ({ field, fieldState, controlProps }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <label htmlFor={controlProps.id}>Personal website</label>
        <input
          {...controlProps}
          type="url"
          value={field.value ?? ""}
          onChange={(e) => field.onChange(e.target.value)}
          onBlur={field.onBlur}
          name={field.name}
          placeholder="https://example.com"
        />
        {fieldState.invalid && (
          <span style={{ color: "crimson", fontSize: 12 }}>
            {fieldState.error}
          </span>
        )}
      </div>
    ),
  }),

  favoriteColor: defineUIField({
    widget: ColorSwatchPicker,
    label: "Favorite color",
    order: 6,
    gridArea: "color",
    props: {
      presetColors: [
        "#F43F5E",
        "#F59E0B",
        "#10B981",
        "#3B82F6",
        "#8B5CF6",
        "#111827",
      ],
    },
  }),

  phones: {
    label: "Phone numbers",
    description: "Add as many as you like.",
    addLabel: "Add phone",
    gridArea: "phones",
    item: defineUIField({
      widget: "input",
      props: { placeholder: "+1 555 0100" },
    }),
  },

  contacts: {
    label: "Contacts",
    description: "People we can reach on your behalf.",
    addLabel: "Add contact",
    removable: true,
    reorderable: true,
    itemLabel: "Contacting",
    gridArea: "contacts",
    item: {
      name: defineUIField({
        widget: "input",
        label: "Name",
        order: 0,
        props: { placeholder: "Jane Doe" },
      }),
      email: defineUIField({
        widget: "input",
        label: "Email",
        order: 1,
        props: { placeholder: "jane@example.com", type: "email" },
      }),
    },
  },

  $sections: [
    {
      label: "Identity",
      description: "Who you are on Kreativ.",
      order: 0,
      layout: `
        "name  name  role"
        "bio   bio   role"
        "age   color color"
      `,
      fields: ["fullName", "role", "bio", "age", "favoriteColor"],
    },
    {
      label: "Contact & preferences",
      description: "How we reach you, and what you'd like to hear about.",
      order: 1,
      layout: `
        "website   marketing"
        "phones    phones"
        "contacts  contacts"
      `,
      fields: ["website", "marketingOptIn", "phones", "contacts"],
    },
  ],
};