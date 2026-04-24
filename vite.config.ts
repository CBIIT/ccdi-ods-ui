import react from "@vitejs/plugin-react";
import { defineConfig, configDefaults } from "vitest/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

const testExcludes: string[] = [
  "conf/**",
  "public/**",
  "src/setupTests.ts",
  "src/**/*.d.ts",
];

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    exclude: [...configDefaults.exclude, ...testExcludes],
    coverage: {
      provider: "v8",
      reporter: ["lcov", "json", "html"],
      enabled: true,
      include: ["src/**/*.{ts,tsx}"],
    },
    testTimeout: 10_000,
  },
});
