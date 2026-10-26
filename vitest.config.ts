import { defineConfig, mergeConfig } from "vitest/config";
import tsconfig from "./tsconfig.json";
import tsconfigPaths from 'vite-tsconfig-paths'

export default mergeConfig(
  tsconfig,
  defineConfig({
    plugins: [
        tsconfigPaths()
    ],
    test: {
      environment: "jsdom",
      exclude: ["**/node_modules/**", "**/dist/**"],
    },
  }),
);
