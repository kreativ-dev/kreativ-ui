import * as React from "react";
import type { z } from "zod";
import type { UIObjectSchema, UIFieldSchema } from "./uiSchema.types";
import {
  getArrayElement,
  getObjectShape,
  getZodTypeName,
  unwrap,
} from "./zodHelpers";
import {
  isUIArraySchema,
  isUIFieldSchema,
  isUIObjectSchema,
} from "./uiSchemaGuards";
import { renderLeafField } from "./renderLeafField";
import { RenderField } from "./RenderField";
import { ArrayField } from "./ArrayField";
import { deriveItemLabel } from "./itemLabel";
import { humanizeFieldName } from "./widget";

export interface GenerateFieldsOptions {
  pathPrefix?: string;
}

/**
 * A `UIFieldSchema` entry only opts a compound Zod value (object, and in
 * future array) out of group-recursion when it carries an explicit
 * `render` or `widget`. Bare inferred entries (`{}`, `{ label }`,
 * `{ order }`) stay ambiguous and default to group semantics — otherwise
 * `{ address: {} }` would silently become one leaf input for the whole
 * nested object.
 */
function isLeafOptIn(entry: unknown): entry is UIFieldSchema {
  if (!isUIFieldSchema(entry)) return false;
  return Boolean(entry.render || entry.widget);
}

function wrapForGridArea(
  key: string,
  node: React.ReactNode,
  gridArea: string | undefined,
): React.ReactNode {
  if (!gridArea) return node;
  return (
    <div key={`${key}-grid-wrap`} style={{ gridArea }}>
      {node}
    </div>
  );
}

function renderLeaf(
  fullName: string,
  unwrapped: z.ZodTypeAny,
  entry: UIFieldSchema | undefined,
  label: React.ReactNode,
  description: React.ReactNode,
): React.ReactNode {
  const node = entry?.render ? (
    <RenderField key={fullName} name={fullName} render={entry.render} />
  ) : (
    renderLeafField(fullName, unwrapped, entry, label, description)
  );
  return wrapForGridArea(fullName, node, entry?.gridArea);
}

export function generateFieldsInternal(
  shape: Record<string, z.ZodTypeAny>,
  uiSchema: UIObjectSchema | undefined,
  options: GenerateFieldsOptions = {},
): React.ReactNode[] {
  const pathPrefix = options.pathPrefix;
  const fieldNames = Object.keys(shape);

  const entries = fieldNames.map((fieldName) => {
    const uiEntry = uiSchema?.[fieldName];
    const order =
      uiEntry && isUIFieldSchema(uiEntry) ? uiEntry.order : undefined;
    return { fieldName, uiEntry, order };
  });

  entries.sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER),
  );

  const built = new Map<string, React.ReactNode>();

  for (const { fieldName, uiEntry } of entries) {
    const fullName = pathPrefix ? `${pathPrefix}.${fieldName}` : fieldName;
    const zodType = shape[fieldName];
    const unwrapped = unwrap(zodType);
    const typeName = getZodTypeName(unwrapped);

    if (isUIFieldSchema(uiEntry) && uiEntry.hidden) continue;

    if (typeName === "ZodArray") {
      // Arrays stay group-only for now. To mirror the ZodObject leaf escape
      // hatch: widen `UIFieldSchemaFor`'s array branch to include
      // `UIFieldSchema<...>`, then add an `isLeafOptIn(uiEntry)` check here
      // that delegates to `renderLeaf`.
      const arrayUiEntry = isUIArraySchema(uiEntry) ? uiEntry : undefined;
      const elementType = getArrayElement(unwrapped);
      if (!elementType) continue;

      const arrayLabel = arrayUiEntry?.label ?? humanizeFieldName(fieldName);
      const itemLabel = arrayUiEntry?.itemLabel ?? deriveItemLabel(arrayLabel);

      const arrayNode = (
        <ArrayField
          key={fullName}
          name={fullName}
          label={arrayLabel}
          description={arrayUiEntry?.description}
          itemLabel={itemLabel}
          elementType={elementType}
          itemUiSchema={arrayUiEntry?.item}
          addLabel={arrayUiEntry?.addLabel}
          removable={arrayUiEntry?.removable ?? true}
          reorderable={arrayUiEntry?.reorderable ?? false}
        />
      );

      built.set(
        fieldName,
        wrapForGridArea(fullName, arrayNode, arrayUiEntry?.gridArea),
      );

      continue;
    }

    if (typeName === "ZodObject") {
      if (isLeafOptIn(uiEntry)) {
        // Consumer opted this object out of group-recursion — the widget or
        // render function owns the entire nested value.
        const label = uiEntry.label ?? humanizeFieldName(fieldName);
        built.set(
          fieldName,
          renderLeaf(fullName, unwrapped, uiEntry, label, uiEntry.description),
        );
        continue;
      }

      const nestedShape = getObjectShape(unwrapped) ?? {};
      const nestedUiSchema = isUIObjectSchema(uiEntry) ? uiEntry : undefined;

      built.set(
        fieldName,
        <div key={fullName} data-form-from-schema-group={fullName}>
          {generateFieldsInternal(nestedShape, nestedUiSchema, {
            pathPrefix: fullName,
          })}
        </div>,
      );
      continue;
    }

    const fieldUiEntry = isUIFieldSchema(uiEntry) ? uiEntry : undefined;
    const label = fieldUiEntry?.label ?? humanizeFieldName(fieldName);

    built.set(
      fieldName,
      renderLeaf(
        fullName,
        unwrapped,
        fieldUiEntry,
        label,
        fieldUiEntry?.description,
      ),
    );
  }

  const sections = !pathPrefix ? uiSchema?.$sections : undefined;

  if (!sections || sections.length === 0) {
    return Array.from(built.values());
  }

  const sorted = [...sections].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const claimed = new Set(sorted.flatMap((s) => s.fields));

  const sectionNodes = sorted.map((section, i) => (
    <div key={`section-${i}`} className="kui-form-section">
      {section.label && (
        <h3 className="kui-form-section__label">{section.label}</h3>
      )}
      {section.description && (
        <p className="kui-form-section__description">{section.description}</p>
      )}
      <div
        className={
          section.layout ? "kui-form-section__grid" : "kui-form-section__stack"
        }
        style={
          section.layout
            ? {
                gridTemplateAreas: section.layout,
                ...(section.columns && {
                  gridTemplateColumns: section.columns,
                }),
              }
            : undefined
        }
      >
        {section.fields.map((key) => built.get(key))}
      </div>
    </div>
  ));

  const unclaimedNodes = entries
    .map((e) => e.fieldName)
    .filter((name) => !claimed.has(name))
    .map((name) => built.get(name));

  return [...sectionNodes, ...unclaimedNodes];
}
