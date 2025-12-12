import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "src/tursib-card.ts",
      output: {
        format: "es",
        entryFileNames: "tursib-card.js",
        inlineDynamicImports: true
      }
    }
  }
});
