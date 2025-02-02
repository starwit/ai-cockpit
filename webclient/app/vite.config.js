import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({command}) => {
  if (command === "serve") {
    return {
      plugins: [
        react(),
      ],
      base: "/ai-cockpit/",
      server: {
        watch: {
          usePolling: true
        },
        proxy: {
          "/ai-cockpit/api": "http://localhost:8080"
        }
      },
    };
  } else {
    return {
      plugins: [react()],
      base: "./"
    };
  }
});
