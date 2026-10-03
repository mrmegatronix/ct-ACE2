import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { viteSingleFile } from "vite-plugin-singlefile"
import { defineConfig, type Plugin } from "vite"

function devRedirectPlugin(): Plugin {
  return {
    name: "dev-redirect",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const parsedUrl = new URL(req.url, "http://localhost");
          if (parsedUrl.pathname === "/" || parsedUrl.pathname === "/index.html") {
            req.url = "/dev.html" + parsedUrl.search;
          }
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [devRedirectPlugin(), react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2018",
    cssTarget: "chrome80",
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL("./dev.html", import.meta.url)),
      },
    },
  },
})
