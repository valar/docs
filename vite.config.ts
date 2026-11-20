/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { docs } from "./src/markdown/plugin.ts";

export default defineConfig({
  plugins: [react(), tailwindcss(), docs({ dir: "content", homepage: "getting-started/cli-setup.md" })],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
