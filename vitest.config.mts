import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.test" });
import cssInjectedByJs from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [tsconfigPaths(), react(), svgr(), cssInjectedByJs()],
  css: {
    modules: {
      classNameStrategy: "non-scoped",
    },
  },
  server: {
    deps: {
      inline: ["@mui/x-data-grid", "@mui/x-charts", "@mui/x-date-pickers"],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
        "config/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,tsx,mts}",
        "**/node_modules/**",
        "**/.next/**",
        "**/coverage/**",
        "proxy.ts", // Auth proxy is hard to test in isolation
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 90,
        statements: 90,
      },
    },
  },
});
