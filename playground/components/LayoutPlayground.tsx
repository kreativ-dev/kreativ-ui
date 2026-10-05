import { useState } from "react";
import { Container, Flex, Stack, Grid } from "@/components";

function DemoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-16 items-center justify-center rounded-lg border border-border bg-bg font-mono text-xs text-text-muted transition-colors">
      {children}
    </div>
  );
}

// A simple control row
function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs font-medium text-text-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export function LayoutPlaygroundPage() {
  // Stack controls
  const [stackOrientation, setStackOrientation] = useState<
    "vertical" | "horizontal"
  >("vertical");
  const [stackGap, setStackGap] = useState<"sm" | "md" | "lg">("sm");
  const [stackShowDivider, setStackShowDivider] = useState(false);

  // Flex controls
  const [flexDirection, setFlexDirection] = useState<{
    base: string;
    md: string;
  }>({
    base: "column",
    md: "row",
  });
  const [flexWrap, setFlexWrap] = useState<"wrap" | "nowrap">("wrap");
  const [flexJustify, setFlexJustify] = useState<
    "space-between" | "center" | "flex-start" | "flex-end"
  >("space-between");
  const [flexAlign, setFlexAlign] = useState<
    "stretch" | "center" | "flex-start" | "flex-end"
  >("stretch");
  const [flexGap, setFlexGap] = useState<"sm" | "md" | "lg">("sm");

  // Grid controls
  const [gridColumns, setGridColumns] = useState<{
    base: number;
    sm: number;
    lg: number;
  }>({
    base: 1,
    sm: 2,
    lg: 4,
  });
  const [gridGap, setGridGap] = useState<"sm" | "md" | "lg">("md");
  const [gridTemplateAreas, setGridTemplateAreas] = useState(
    `"sidebar main" "sidebar footer"`,
  );

  return (
    <Container maxWidth="lg" padding="md">
      <Stack gap="xl">
        {/* ===== Stack Section ===== */}
        <section>
          <h2 className="mb-3 font-mono text-xs text-brand">
            Stack (interactive)
          </h2>
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border border-border p-3">
            <ControlGroup label="Orientation">
              <select
                value={stackOrientation}
                onChange={(e) => setStackOrientation(e.target.value as any)}
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Gap">
              <select
                value={stackGap}
                onChange={(e) => setStackGap(e.target.value as any)}
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Divider">
              <input
                type="checkbox"
                checked={stackShowDivider}
                onChange={(e) => setStackShowDivider(e.target.checked)}
                className="h-4 w-4"
              />
            </ControlGroup>
          </div>

          <Stack
            orientation={stackOrientation}
            gap={stackGap}
            divider={
              stackShowDivider ? (
                <div className="w-px self-stretch bg-border" />
              ) : undefined
            }
          >
            <DemoBox>Item 1</DemoBox>
            <DemoBox>Item 2</DemoBox>
            <DemoBox>Item 3</DemoBox>
          </Stack>
        </section>

        {/* ===== Flex Section ===== */}
        <section>
          <h2 className="mb-3 font-mono text-xs text-brand">
            Flex (interactive)
          </h2>
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border border-border p-3">
            <ControlGroup label="Direction">
              <select
                value={flexDirection.base}
                onChange={(e) =>
                  setFlexDirection({
                    ...flexDirection,
                    base: e.target.value as any,
                  })
                }
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="column">Column</option>
                <option value="row">Row</option>
              </select>
              <span className="text-xs text-text-muted">
                (md: {flexDirection.md})
              </span>
            </ControlGroup>
            <ControlGroup label="Wrap">
              <select
                value={flexWrap}
                onChange={(e) => setFlexWrap(e.target.value as any)}
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="wrap">Wrap</option>
                <option value="nowrap">No Wrap</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Justify">
              <select
                value={flexJustify}
                onChange={(e) => setFlexJustify(e.target.value as any)}
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="flex-start">Start</option>
                <option value="center">Center</option>
                <option value="flex-end">End</option>
                <option value="space-between">Space Between</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Align">
              <select
                value={flexAlign}
                onChange={(e) => setFlexAlign(e.target.value as any)}
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="stretch">Stretch</option>
                <option value="center">Center</option>
                <option value="flex-start">Start</option>
                <option value="flex-end">End</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Gap">
              <select
                value={flexGap}
                onChange={(e) => setFlexGap(e.target.value as any)}
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </ControlGroup>
          </div>

          <Flex
            direction={flexDirection}
            wrap={flexWrap}
            justify={flexJustify}
            align={flexAlign}
            gap={flexGap}
          >
            <DemoBox>Flex 1</DemoBox>
            <DemoBox>Flex 2</DemoBox>
            <DemoBox>Flex 3</DemoBox>
            <DemoBox>Flex 4</DemoBox>
          </Flex>
        </section>

        {/* ===== Grid Section ===== */}
        <section>
          <h2 className="mb-3 font-mono text-xs text-brand">
            Grid (interactive)
          </h2>
          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border border-border p-3">
            <ControlGroup label="Columns (base/sm/lg)">
              <input
                type="number"
                value={gridColumns.base}
                onChange={(e) =>
                  setGridColumns({
                    ...gridColumns,
                    base: Number(e.target.value),
                  })
                }
                className="w-14 rounded border-border bg-bg px-1 py-1 text-sm"
                min={1}
                max={6}
              />
              <input
                type="number"
                value={gridColumns.sm}
                onChange={(e) =>
                  setGridColumns({ ...gridColumns, sm: Number(e.target.value) })
                }
                className="w-14 rounded border-border bg-bg px-1 py-1 text-sm"
                min={1}
                max={6}
              />
              <input
                type="number"
                value={gridColumns.lg}
                onChange={(e) =>
                  setGridColumns({ ...gridColumns, lg: Number(e.target.value) })
                }
                className="w-14 rounded border-border bg-bg px-1 py-1 text-sm"
                min={1}
                max={6}
              />
            </ControlGroup>
            <ControlGroup label="Gap">
              <select
                value={gridGap}
                onChange={(e) => setGridGap(e.target.value as any)}
                className="rounded border-border bg-bg px-2 py-1 text-sm"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </ControlGroup>
            <ControlGroup label="Template Areas">
              <input
                type="text"
                value={gridTemplateAreas}
                onChange={(e) => setGridTemplateAreas(e.target.value)}
                className="w-48 rounded border-border bg-bg px-2 py-1 text-sm font-mono"
                placeholder='e.g. "sidebar main"'
              />
            </ControlGroup>
          </div>

          <Grid
            columns={gridColumns}
            gap={gridGap}
            templateAreas={gridTemplateAreas}
            className="min-h-40"
          >
            <div style={{ gridArea: "sidebar" }}>
              <DemoBox>Sidebar</DemoBox>
            </div>
            <div style={{ gridArea: "main" }}>
              <DemoBox>Main</DemoBox>
            </div>
            <div style={{ gridArea: "footer" }}>
              <DemoBox>Footer</DemoBox>
            </div>
          </Grid>
        </section>

        {/* ===== Reset / Info ===== */}
        <div className="mt-4 flex justify-end gap-3 text-xs text-text-muted">
          <button
            onClick={() => {
              setStackOrientation("vertical");
              setStackGap("sm");
              setStackShowDivider(false);
              setFlexDirection({ base: "column", md: "row" });
              setFlexWrap("wrap");
              setFlexJustify("space-between");
              setFlexAlign("stretch");
              setFlexGap("sm");
              setGridColumns({ base: 1, sm: 2, lg: 4 });
              setGridGap("md");
              setGridTemplateAreas(`"sidebar main" "sidebar footer"`);
            }}
            className="rounded border-border px-3 py-1 hover:bg-bg-hover"
          >
            Reset All
          </button>
        </div>
      </Stack>
    </Container>
  );
}
