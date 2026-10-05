import { useState } from "react";
import { Card } from "@/components/layout/Card";
import { Select } from "@/components/forms/Select";
import { Switch } from "@/components/forms/Switch";
import type {
  CardVariant,
  CardSize,
} from "@/components/layout/Card/Card.types";
import { Playground } from "./shared/Playground";
import { getAttrs } from "./shared/getAttributes";

const variants: CardVariant[] = [
  "solid",
  "outline",
  "ghost",
  "elevated",
  "compact",
];
const sizes: CardSize[] = ["sm", "md", "lg"];

export function CardPlayground() {
  const [variant, setVariant] = useState<CardVariant>("outline");
  const [size, setSize] = useState<CardSize>("md");
  const [hasImage, setHasImage] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [noPadding, setNoPadding] = useState(false);
  const [withHeader, setWithHeader] = useState(true);
  const [withFooter, setWithFooter] = useState(true);

  const code = [
    `<Card`,
    `  variant="${variant}"`,
    `  size="${size}"`,
    hasImage && `  hasImage`,
    fullWidth && `  fullWidth`,
    noPadding && `  noPadding`,
    `>`,
    hasImage &&
      `  <img src="..." alt="" className="aspect-video w-full object-cover" />`,
    withHeader &&
      `  <Card.Header>\n    <span className="font-medium">Card title</span>\n  </Card.Header>`,
    `  <Card.Body>`,
    `    <p className="text-sm text-muted">Card body content goes here.</p>`,
    `  </Card.Body>`,
    withFooter &&
      `  <Card.Footer>\n    <button className="text-sm text-brand">Action</button>\n  </Card.Footer>`,
    `</Card>`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <Playground
      title="Card"
      description="A flexible surface for grouping related content, with optional Header/Body/Footer slots."
      controls={
        <div className="flex flex-col gap-4">
          <Select
            value={variant}
            onValueChange={(v) => setVariant(v as CardVariant)}
          >
            <Select.Label>Variant</Select.Label>
            <Select.Trigger />
            <Select.Content>
              {variants.map((v) => (
                <Select.Item key={v} value={v}>
                  {v}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Select value={size} onValueChange={(v) => setSize(v as CardSize)}>
            <Select.Label>Size</Select.Label>
            <Select.Trigger />
            <Select.Content>
              {sizes.map((s) => (
                <Select.Item key={s} value={s}>
                  {s}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <div className="flex items-center justify-between">
            <span className="text-sm">Has image</span>
            <Switch checked={hasImage} onCheckedChange={setHasImage} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Full width</span>
            <Switch checked={fullWidth} onCheckedChange={setFullWidth} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">No padding</span>
            <Switch checked={noPadding} onCheckedChange={setNoPadding} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">With header</span>
            <Switch checked={withHeader} onCheckedChange={setWithHeader} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">With footer</span>
            <Switch checked={withFooter} onCheckedChange={setWithFooter} />
          </div>
        </div>
      }
      preview={
        <Card
          variant={variant}
          size={size}
          hasImage={hasImage}
          fullWidth={fullWidth}
          noPadding={noPadding}
          className="max-w-md"
        >
          {hasImage && (
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=340&fit=crop"
              alt=""
              className="aspect-video w-full object-cover"
            />
          )}

          {withHeader && (
            <Card.Header>
              <span className="font-medium">Card title</span>
            </Card.Header>
          )}

          <Card.Body>
            <p className="text-sm text-muted">Card body content goes here.</p>
          </Card.Body>

          {withFooter && (
            <Card.Footer>
              <button className="text-sm text-brand">Action</button>
            </Card.Footer>
          )}
        </Card>
      }
      code={code}
      getAttributes={(el) =>
        getAttrs(el, ["class"], [], {
          "data-variant": variant,
          "data-size": size,
        })
      }
      attributeSelector="[data-kui-card], div"
    />
  );
}
