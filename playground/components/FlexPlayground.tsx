import { useState } from "react";
import { Flex, Stack, Select, Switch } from "@/components";
import { Playground } from "./shared/Playground";
import { Container } from "lucide-react";

function DemoBox({ label, width }: { label: string; width?: number }) {
  return (
    <div
      className="flex h-16 items-center justify-center rounded-lg border border-border bg-bg font-mono text-xs text-text-muted"
      style={{ width }}
    >
      {label}
    </div>
  );
}

const directions = ["row", "row-reverse", "column", "column-reverse"] as const;
const justifyOptions = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
] as const;
const alignOptions = ["stretch", "flex-start", "center", "flex-end"] as const;
const gaps = ["xs", "sm", "md", "lg", "xl"] as const;

export function FlexPlayground() {
  const [direction, setDirection] =
    useState<(typeof directions)[number]>("row");
  const [justify, setJustify] =
    useState<(typeof justifyOptions)[number]>("flex-start");
  const [align, setAlign] = useState<(typeof alignOptions)[number]>("stretch");
  const [gap, setGap] = useState<(typeof gaps)[number]>("md");
  const [wrap, setWrap] = useState(false);

  const code = `<Flex
  direction="${direction}"
  justify="${justify}"
  align="${align}"
  gap="${gap}"${wrap ? '\n  wrap="wrap"' : ""}
>
  <Box>1</Box>
  <Box>2</Box>
  <Box>3</Box>
</Flex>`;

  return (
    <Playground
      title="Flex"
      description="A flexbox layout primitive with token-based gap and responsive props."
      code={code}
      attributeSelector="[data-kui-responsive]"
      getAttributes={(el) => ({
        "flex-direction": el ? getComputedStyle(el).flexDirection : null,
        "justify-content": el ? getComputedStyle(el).justifyContent : null,
        "align-items": el ? getComputedStyle(el).alignItems : null,
        gap: el ? getComputedStyle(el).gap : null,
      })}
      controls={
        <Stack gap="md">
          <Select
            value={direction}
            onValueChange={(v) => setDirection(v as typeof direction)}
          >
            <Select.Label>direction</Select.Label>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {directions.map((d) => (
                <Select.Item key={d} value={d}>
                  {d}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Select
            value={justify}
            onValueChange={(v) => setJustify(v as typeof justify)}
          >
            <Select.Label>justify</Select.Label>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {justifyOptions.map((j) => (
                <Select.Item key={j} value={j}>
                  {j}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Select
            value={align}
            onValueChange={(v) => setAlign(v as typeof align)}
          >
            <Select.Label>align</Select.Label>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {alignOptions.map((a) => (
                <Select.Item key={a} value={a}>
                  {a}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Select value={gap} onValueChange={(v) => setGap(v as typeof gap)}>
            <Select.Label>gap</Select.Label>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {gaps.map((g) => (
                <Select.Item key={g} value={g}>
                  {g}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Switch checked={wrap} onCheckedChange={setWrap} className="mt-3">
            wrap
          </Switch>
        </Stack>
      }
      preview={
        <Flex
          direction={direction}
          justify={justify}
          align={align}
          gap={gap}
          wrap={wrap ? "wrap" : "nowrap"}
        >
          <DemoBox label="1" width={40} />
          <Container/>
          <DemoBox label="2" width={40} />
          <Container/>
          <DemoBox label="3" width={40} />
        </Flex>
      }
    />
  );
}
