import * as path from "path"

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import unoCSS from "unocss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), unoCSS()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
