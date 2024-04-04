import { Options, defineConfig } from "tsup";

const commonOptions: Partial<Options> = {
  entry: { index: "src/index.ts" },
  tsconfig: "./tsconfig.build.json",
  target: "es2019",
  sourcemap: true,
  treeshake: true,
};

export default defineConfig([
  {
    ...commonOptions,
    clean: true,
    format: "esm",
  },
  {
    ...commonOptions,
    dts: true,
    format: "cjs",
  },
]);
