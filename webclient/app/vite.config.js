import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import {createUnplugin} from 'unplugin'

export default defineConfig(({command}) => {
  if (command === "serve") {
    return {
      plugins: [
        react(),
      ],
      base: "/ai-cockpit/",
      server: {
        proxy: {
          "/ai-cockpit/api": "http://localhost:8081",
          "/ai-cockpit/sbom-frontend.json": "http://localhost:8081",
          "/ai-cockpit/sbom-backend.json": "http://localhost:8081",
          "/ai-cockpit/aic-sbom-frontend.json": "http://localhost:8081",
          "/ai-cockpit/aic-sbom-backend.json": "http://localhost:8081",
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
