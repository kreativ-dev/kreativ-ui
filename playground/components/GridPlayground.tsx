import { useState } from "react";
import { Grid, Stack, Select, Switch, Button } from "@/components";
import { Playground } from "./shared/Playground";
import { getAttrs } from "./shared/getAttributes";
import { Grid2X2 } from "lucide-react";

function DemoBox({ label }: { label: string }) {
  return (
    <div className="flex h-16 items-center justify-center rounded-lg border border-border bg-bg font-mono text-xs text-text-muted">
      {label}
    </div>
  );
}

const columnOptions = [1, 2, 3, 4, 6] as const;
const gaps = ["xs", "sm", "md", "lg", "xl"] as const;
const alignOptions = ["stretch", "flex-start", "center", "flex-end"] as const;
const justifyOptions = [
  "flex-start",
  "center",
  "flex-end",
  "space-between",
  "space-around",
] as const;

export function GridPlayground() {
  const [columns, setColumns] = useState<(typeof columnOptions)[number]>(3);
  const [gap, setGap] = useState<(typeof gaps)[number]>("md");
  const [align, setAlign] = useState<(typeof alignOptions)[number]>("stretch");
  const [justify, setJustify] =
    useState<(typeof justifyOptions)[number]>("flex-start");
  const [useAreas, setUseAreas] = useState(false);

  const code = useAreas
    ? `<Grid
  templateColumns="200px 1fr"
  templateAreas={\`"sidebar main" "sidebar footer"\`}
  gap="${gap}"
>
  <div style={{ gridArea: "sidebar" }}><Box>Sidebar</Box></div>
  <div style={{ gridArea: "main" }}><Box>Main</Box></div>
  <div style={{ gridArea: "footer" }}><Box>Footer</Box></div>
</Grid>`
    : `<Grid
  columns={${columns}}
  gap="${gap}"
  align="${align}"
  justify="${justify}"
>
  <Box>1</Box>
  <Box>2</Box>
  ...
</Grid>`;

  // {
  //         "grid-template-columns": el
  //           ? getComputedStyle(el).gridTemplateColumns
  //           : null,
  //         "grid-template-areas": el
  //           ? getComputedStyle(el).gridTemplateAreas
  //           : null,
  //         gap: el ? getComputedStyle(el).gap : null,
  //         "align-items": el ? getComputedStyle(el).alignItems : null,
  //         "justify-content": el ? getComputedStyle(el).justifyContent : null,
  //       }

  const extraAttributes = [
    "grid-template-columns",
    "grid-template-areas",
    "gap",
    "align-items",
    "justify-content",
  ];

  return (
    <Playground
      title="Grid"
      description="A CSS grid layout primitive with a columns shorthand, token-based gap, and raw template escape hatches."
      code={code}
      attributeSelector="[data-kui-responsive]"
      getAttributes={(el) => getAttrs(el, [], [], undefined, extraAttributes)}
      controls={
        <Stack gap="md">
          <Switch checked={useAreas} onCheckedChange={setUseAreas}>
            use template areas
          </Switch>

          {!useAreas && (
            <>
              <Select
                value={String(columns)}
                onValueChange={(v) => setColumns(Number(v) as typeof columns)}
              >
                <Select.Label>columns</Select.Label>
                <Select.Trigger />
                <Select.Content>
                  {columnOptions.map((c) => (
                    <Select.Item key={c} value={String(c)}>
                      {c}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>

              <Select
                value={align}
                onValueChange={(v) => setAlign(v as typeof align)}
              >
                <Select.Label>align</Select.Label>
                <Select.Trigger />
                <Select.Content>
                  {alignOptions.map((a) => (
                    <Select.Item key={a} value={a}>
                      {a}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>

              <Select
                value={justify}
                onValueChange={(v) => setJustify(v as typeof justify)}
              >
                <Select.Label>justify</Select.Label>
                <Select.Trigger />
                <Select.Content>
                  {justifyOptions.map((j) => (
                    <Select.Item key={j} value={j}>
                      {j}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </>
          )}

          <Select value={gap} onValueChange={(v) => setGap(v as typeof gap)}>
            <Select.Label>gap</Select.Label>
            <Select.Trigger />
            <Select.Content>
              {gaps.map((g) => (
                <Select.Item key={g} value={g}>
                  {g}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </Stack>
      }
      preview={
        useAreas ? (
          <Grid
            templateColumns="200px 1fr"
            templateAreas={`"sidebar main" "sidebar footer"`}
            gap={gap}
            className="min-h-40"
          >
            <div style={{ gridArea: "sidebar" }}>
              <DemoBox label="Sidebar" />
            </div>
            <div style={{ gridArea: "main" }}>
              <DemoBox label="Main" />
            </div>
            <div style={{ gridArea: "footer" }}>
              <DemoBox label="Footer" />
            </div>
          </Grid>
        ) : (
          <Grid columns={columns} gap={gap} align={align} justify={justify}>
            {Array.from({ length: columns * 2 }, (_, i) => (<>
                <Button variant="soft" color="neutral" size="sm" iconOnly leftIcon={<Grid2X2/>}></Button>
                <DemoBox key={i} label={String(i + 1)} />
            </>
            ))}
          </Grid>
        )
      }
    />
  );
}
