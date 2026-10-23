import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "hooks/index": "src/hooks/index.ts",
    "components/index": "src/components/index.ts",
    "utils/index": "src/utils/index.ts",
    "types/index": "src/types/index.ts",
    "core/index": "src/theme/index.ts",
  },

  format: ["esm", "cjs"],

  dts: true,
  sourcemap: true,
  clean: true,

  splitting: true,
  treeshake: true,
  keepNames: true,

  minify: false,

  target: "es2020",
  outDir: "dist",

  external: ["react", "react-dom", "react/jsx-runtime"],
});
