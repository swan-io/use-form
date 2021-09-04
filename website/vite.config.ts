import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  dedupe: ["react", "react-dom"],
  plugins: [reactRefresh()],
});
