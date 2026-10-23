import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    hooks: "src/hooks/index.ts",
    components: "src/components/index.ts",
    utils: "src/utils/index.ts",
    types: "src/types/index.ts",
    core: "src/theme/index.ts",
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
