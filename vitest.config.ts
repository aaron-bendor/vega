import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["lib/simulation/tests/**/*.test.ts"],
    globals: true,
  },
});
