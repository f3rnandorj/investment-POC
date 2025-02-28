import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [["src/domain/**/controllers/__tests__/**/*.{test,spec}.ts", "prisma"]],
    coverage: {
      provider: "v8",
      include: [
        "src/domain/**/useCases/**/*.ts", 
        "src/domain/**/controllers/**/*.ts", 
        "src/utils/**/*.ts", 
      ],
      reportsDirectory: "coverage", 
      reporter: ["text", "html"], 
    },
  },
});
