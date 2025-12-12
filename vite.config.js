import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/tursib-card.ts",
      name: "TursibCard",
      fileName: "tursib-card"
    },
    rollupOptions: {
      output: {
        format: "es"
      }
    }
  }
});
