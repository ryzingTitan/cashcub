import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import cssInjectedByJs from "vite-plugin-css-injected-by-js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.test" });

export default defineConfig({
  plugins: [tsconfigPaths(), react(), svgr(), cssInjectedByJs()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
