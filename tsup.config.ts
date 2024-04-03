import { Options, defineConfig } from "tsup";

const commonOptions: Partial<Options> = {
  entry: { index: "src/index.ts" },
  tsconfig: "./tsconfig.build.json",
  target: "es2017",
  sourcemap: true,
  treeshake: true,
};

export default defineConfig([
  {
    ...commonOptions,
    clean: true,
    format: "esm",
    outExtension: () => ({ js: ".es.js" }),
  },
  {
    ...commonOptions,
    dts: true,
    format: "cjs",
  },
]);
