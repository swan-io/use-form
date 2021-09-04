import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-ux-form/",
  build: { sourcemap: true },
  plugins: [reactRefresh()],
  resolve: { dedupe: ["react", "react-dom"] },
});
