/// <reference types="vitest" />
import { defineConfig } from "vite";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
