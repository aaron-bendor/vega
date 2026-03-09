import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    include: [
      "lib/simulation/tests/**/*.test.ts",
      "lib/vega-financial/tests/**/*.test.ts",
      "lib/routes.test.ts",
      "components/landing/algorithms/**/*.test.ts",
    ],
    globals: true,
  },
});
