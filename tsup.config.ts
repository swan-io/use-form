import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts" },
    format: ["cjs", "esm"],
    tsconfig: "./tsconfig.build.json",
    target: ["es2019", "chrome80", "edge80", "firefox72", "safari12"],
    treeshake: "safest",
    clean: true,
    sourcemap: true,
  },
  {
    entry: ["src/**/*.{ts,tsx}"],
    format: ["cjs"],
    tsconfig: "./tsconfig.build.json",
    dts: { only: true },
  },
]);
