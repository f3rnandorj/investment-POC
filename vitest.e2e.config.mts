import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["src/domain/**/controllers/__tests__/**/*.{test,spec}.ts"],
    environmentMatchGlobs: [["src/domain/**/controllers/__tests__/**/*.{test,spec}.ts", "prisma"]],
  },
});
