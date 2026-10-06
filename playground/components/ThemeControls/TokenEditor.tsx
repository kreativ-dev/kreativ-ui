import { useMemo, useState, useCallback } from "react";
import type { ThemeOverride } from "@/types/theme";
import { ColorEditor } from "./ColorEditor";
import { COLOR_GROUPS } from "./theme.constants";
import { resolveSemanticTokenReferences } from "@/provider/cssVariables";
import { extendTheme } from "@/theme";

interface TokenEditorProps {
  theme: ThemeOverride;
  onChange(theme: ThemeOverride): void;
}

export function TokenEditor({ theme, onChange }: TokenEditorProps) {
  const [activeGroup, setActiveGroup] = useState(COLOR_GROUPS[0]?.name ?? "");

  const resolvedTheme = useMemo(() => extendTheme(theme), [theme]);

  const resolvedSemanticTokens = useMemo(
    () =>
      resolveSemanticTokenReferences(
        resolvedTheme.tokens,
        resolvedTheme.semanticTokens,
      ),
    [resolvedTheme],
  );

  const selectedGroup = useMemo(
    () => COLOR_GROUPS.find((group) => group.name === activeGroup),
    [activeGroup],
  );

  const getCurrentModeValues = useCallback(
    (key: string): { light: string; dark: string } => {
      const resolved = resolvedSemanticTokens.colors?.[key]?.value;

      if (typeof resolved === "string") {
        return {
          light: resolved,
          dark: resolved,
        };
      }

      if (resolved && typeof resolved === "object") {
        return {
          light: typeof resolved.light === "string" ? resolved.light : "",
          dark: typeof resolved.dark === "string" ? resolved.dark : "",
        };
      }

      return {
        light: "",
        dark: "",
      };
    },
    [resolvedSemanticTokens],
  );

  const getModeValue = useCallback(
    (mode: "light" | "dark", key: string) => {
      const values = getCurrentModeValues(key);

      return mode === "light" ? values.light : values.dark;
    },
    [getCurrentModeValues],
  );

  const updateToken = useCallback(
    (mode: "light" | "dark", key: string, value: string) => {
      const current = getCurrentModeValues(key);

      onChange({
        ...theme,
        semanticTokens: {
          ...theme.semanticTokens,
          colors: {
            ...theme.semanticTokens?.colors,
            [key]: {
              ...theme.semanticTokens?.colors?.[key],
              value: {
                light: mode === "light" ? value : current.light,
                dark: mode === "dark" ? value : current.dark,
              },
            },
          },
        },
      });
    },
    [theme, onChange, getCurrentModeValues],
  );

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-mono text-xs uppercase text-kui-text-muted">Colors</h3>

        <p className="mt-1 text-xs text-kui-text-muted">
          Select a color group to customize its tokens.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-kui-border bg-kui-background">
        <div className="relative overflow-hidden border-b border-kui-border">
          <div className="bg-kui-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-kui-text">Theme palette</p>
                <p className="text-xs text-kui-text-muted">
                  Select a palette below to edit its values.
                </p>
              </div>

              <span className="rounded-full border border-kui-border px-2 py-1 font-mono text-[10px] text-kui-text-muted">
                {activeGroup}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.5fr_1fr]">
              <div className="rounded-lg border border-kui-border bg-kui-surface p-4">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-kui-brand" />
                  <span className="h-2 w-24 rounded-full bg-kui-surface-sunken" />
                </div>

                <div className="space-y-2">
                  <div className="h-2 w-3/4 rounded-full bg-kui-surface-sunken" />
                  <div className="h-2 w-1/2 rounded-full bg-kui-surface-sunken" />
                </div>

                <div className="mt-5 flex gap-2">
                  <div className="h-7 w-20 rounded-md bg-kui-brand" />
                  <div className="h-7 w-16 rounded-md border border-kui-border" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {["brand", "success", "warning", "destructive"].map((token) => (
                  <div
                    key={token}
                    className="flex items-center gap-2 rounded-lg border border-kui-border p-3"
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${
                        token === "brand"
                          ? "bg-kui-brand"
                          : token === "success"
                            ? "bg-kui-success"
                            : token === "warning"
                              ? "bg-kui-warning"
                              : "bg-kui-destructive"
                      }`}
                    />

                    <span className="font-mono text-[10px] text-kui-text-muted">
                      {token}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {COLOR_GROUPS.map((group) => {
              const isActive = activeGroup === group.name;

              return (
                <button
                  key={group.name}
                  type="button"
                  onClick={() => setActiveGroup(group.name)}
                  aria-pressed={isActive}
                  className={[
                    "group relative rounded-lg border p-2 text-left bg-kui-brand-fg dark:bg-kui-surface",
                    "transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kui-brand",
                    isActive
                      ? "border-kui-brand bg-kui-brand/5 shadow-sm"
                      : "border-kui-border hover:border-kui-brand/50 hover:bg-kui-surface-raised",
                  ].join(" ")}
                >
                  <div className="mb-2 flex h-6 items-center -space-x-1.5">
                    {group.keys.slice(0, 5).map((token) => {
                      const value = getModeValue("light", token);

                      return (
                        <span
                          key={token}
                          className={[
                            "h-5 w-5 rounded-full border-2 border-kui-background",
                            "shadow-sm",
                          ].join(" ")}
                          style={{
                            backgroundColor: value ? `${value}` : undefined,
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={[
                        "truncate text-xs font-medium capitalize",
                        isActive ? "text-kui-brand" : "text-kui-text",
                      ].join(" ")}
                    >
                      {group.name}
                    </span>

                    <span className="font-mono text-[9px] text-kui-text-muted">
                      {group.keys.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedGroup && (
        <section className="overflow-hidden rounded-xl border border-kui-border bg-kui-background">
          <div className="flex items-center justify-between border-b border-kui-border px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-1.5">
                {selectedGroup.keys.slice(0, 5).map((token) => {
                  const value = getModeValue("light", token);

                  return (
                    <span
                      key={token}
                      className="h-5 w-5 rounded-full border-2 border-kui-background"
                      style={{
                        backgroundColor: value ? `${value}` : undefined,
                      }}
                    />
                  );
                })}
              </div>

              <div>
                <h4 className="text-sm font-medium capitalize text-kui-text">
                  {selectedGroup.name}
                </h4>

                <p className="font-mono text-[10px] text-kui-text-muted">
                  {selectedGroup.keys.length} tokens
                </p>
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-[120px_1fr_1fr] gap-4 border-b border-kui-border bg-kui-surface/30 px-4 py-2 sm:grid">
            <span className="font-mono text-[10px] uppercase tracking-wide text-kui-text-muted">
              Token
            </span>

            <span className="font-mono text-[10px] uppercase tracking-wide text-kui-text-muted">
              Light
            </span>

            <span className="font-mono text-[10px] uppercase tracking-wide text-kui-text-muted">
              Dark
            </span>
          </div>

          <div className="divide-y divide-kui-border">
            {selectedGroup.keys.map((token) => (
              <div
                key={token}
                className="grid gap-2 px-4 py-3 sm:grid-cols-[120px_1fr_1fr] sm:items-center sm:gap-4"
              >
                <div>
                  <span className="font-mono text-xs text-kui-text">{token}</span>
                </div>

                <ColorEditor
                  value={getModeValue("light", token)}
                  onChange={(value) => updateToken("light", token, value)}
                />

                <ColorEditor
                  value={getModeValue("dark", token)}
                  onChange={(value) => updateToken("dark", token, value)}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
