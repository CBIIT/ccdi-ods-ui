import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    // setupFiles: ["./src/setupTests.tsx"],
    // globalSetup: "./src/vitest.global-setup.ts",
    // exclude: [...configDefaults.exclude, ...testExcludes],
    coverage: {
      provider: "v8",
      reporter: ["lcov", "json", "html"],
      enabled: true,
      // exclude: [...configDefaults.coverage.exclude, ...testExcludes],
    },
    testTimeout: 10_000,
  },
});
