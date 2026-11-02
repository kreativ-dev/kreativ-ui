import { getAttrs } from "./shared/getAttributes";
import { SegmentedControl } from "./shared/SegmentedControl";
import { Chip } from "./shared/Chip";
import { Repeater } from "@/components/forms/Repeater";
import { Playground } from "./shared/Playground";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components";

type Tag = { id: string; label: string };

const getRandomId = () => {
  return Math.floor(Math.random() * 10);
};
const createTag = (label = ""): Tag => ({ id: `tag-${getRandomId()}`, label });

const inputClass =
  "w-full rounded-md border border-kui-border bg-bg px-2.5 py-1.5 text-xs text-kui-text placeholder:text-kui-text-muted transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kui-brand";

const POSITION_OPTIONS = ["prepend", "0", "1", "append"] as const;
type PositionOption = (typeof POSITION_OPTIONS)[number];

export function RepeaterPlayground() {
  const [tags, setTags] = React.useState<Tag[]>(() => [
    createTag("React"),
    createTag("TypeScript"),
  ]);

  const [position, setPosition] = React.useState<PositionOption>("append");
  const [showAdd, setShowAdd] = React.useState(true);
  const [showMove, setShowMove] = React.useState(true);
  const [showRemove, setShowRemove] = React.useState(true);

  const resolvedPosition = React.useMemo<number | "append" | "prepend">(() => {
    if (position === "append" || position === "prepend") return position;
    return Number(position);
  }, [position]);

  const updateTag = (index: number, label: string) =>
    setTags((prev) => {
      const next = prev.slice();
      next[index] = { ...next[index], label };
      return next;
    });

  const getAttributes = React.useCallback(
    (el: HTMLElement | null) =>
      getAttrs(el, ["name", "placeholder", "data-index"], [], {
        "data-total": String(tags.length),
      }),
    [tags.length],
  );

  const positionLiteral =
    position === "append" || position === "prepend"
      ? `"${position}"`
      : `{${position}}`;

  const code = `<Repeater value={tags} onValueChange={setTags}>
  <Repeater.Items<Tag>>
    {(tag, index) => (
      <Repeater.Item index={index}>
        <input
          value={tag.label}
          onChange={(e) => {
            const next = tags.slice();
            next[index] = { ...next[index], label: e.target.value };
            setTags(next);
          }}
        />
${
  showMove ? "        <Repeater.MoveUp />\n        <Repeater.MoveDown />\n" : ""
}${showRemove ? "        <Repeater.Remove />\n" : ""}      </Repeater.Item>
    )}
  </Repeater.Items>
${
  showAdd
    ? `  <Repeater.Add<Tag>
    position=${positionLiteral}
    createItem={() => ({ id: crypto.randomUUID(), label: "" })}
  >
    Add tag
  </Repeater.Add>\n`
    : ""
}</Repeater>`;

  const controls = (
    <div className="space-y-4">
      <SegmentedControl
        label="add position"
        value={position}
        options={[...POSITION_OPTIONS]}
        onChange={setPosition}
      />

      <div className="flex flex-wrap gap-2 border-t border-kui-border pt-3">
        <Chip active={showAdd} onClick={() => setShowAdd((v) => !v)}>
          add
        </Chip>

        <Chip active={showMove} onClick={() => setShowMove((v) => !v)}>
          move
        </Chip>

        <Chip active={showRemove} onClick={() => setShowRemove((v) => !v)}>
          remove
        </Chip>
      </div>
    </div>
  );

  const preview = (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium text-kui-text">Tags</p>

        <span className="font-mono text-[10px] text-kui-text-muted">
          {tags.length} {tags.length === 1 ? "item" : "items"}
        </span>
      </div>

      <Repeater value={tags} onValueChange={setTags}>
        <div className="space-y-2">
          <Repeater.Items<Tag>>
            {(tag, index) => (
              <Repeater.Item index={index} key={tag.id}>
                <div className="flex items-center gap-2 pl-2">
                  <span className="w-4 shrink-0 font-mono text-[11px] text-kui-text-muted">
                    {index + 1}
                  </span>

                  <Input
                    id={tag.id}
                    name={`tags[${index}]`}
                    className={inputClass}
                    size="xs"
                    embedded
                    value={tag.label}
                    placeholder="Enter a tag…"
                    data-index={index}
                    onValueChange={(value) => updateTag(index, value as string)}
                  />

                  {showMove && (
                    <>
                      <Repeater.MoveUp
                        aria-label={`Move "${tag.label}" up`}
                        className="grid size-8 place-items-center"
                      >
                        <ChevronUp size={14} />
                      </Repeater.MoveUp>

                      <Repeater.MoveDown
                        aria-label={`Move "${tag.label}" down`}
                        className="grid size-8 place-items-center"
                      >
                        <ChevronDown size={14} />
                      </Repeater.MoveDown>
                    </>
                  )}

                  {showRemove && (
                    <Repeater.Remove
                      aria-label={`Remove "${tag.label}"`}
                      className="grid size-8 place-items-center"
                    >
                      <Trash2 size={14} />
                    </Repeater.Remove>
                  )}
                </div>
              </Repeater.Item>
            )}
          </Repeater.Items>

          {showAdd && (
            <Repeater.Add<Tag>
              position={resolvedPosition}
              createItem={() => createTag("")}
              className="flex items-center gap-1.5 rounded-md border border-dashed border-kui-border px-2.5 py-1.5 font-mono text-[11px] text-kui-text-muted transition-colors hover:border-kui-brand hover:text-kui-brand"
            >
              <Plus size={14} />

              <span>Add tag</span>
            </Repeater.Add>
          )}
        </div>
      </Repeater>
    </div>
  );

  return (
    <Playground
      title="Repeater"
      description="A compositional list primitive. Render rows with Repeater.Items, give each row contextual actions through Remove, MoveUp, and MoveDown, and insert new entries with Repeater.Add — at the start, at the end, or at any index."
      controls={controls}
      preview={preview}
      code={code}
      getAttributes={getAttributes}
      attributeSelector="input"
    />
  );
}
