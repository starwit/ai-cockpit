import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import { createUnplugin } from 'unplugin'

export default defineConfig(({command}) => {
  if (command === "serve") {
    return {
      plugins: [
        react(),
      ],
      base: "/smartparkingconfig/",
      server: {
        proxy: {
          "/smartparkingconfig/api": "http://localhost:8081"
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
