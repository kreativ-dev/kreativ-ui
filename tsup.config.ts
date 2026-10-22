import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],

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
