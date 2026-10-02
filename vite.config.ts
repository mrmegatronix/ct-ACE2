import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
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
  plugins: [devRedirectPlugin(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL("./dev.html", import.meta.url)),
      },
      output: {
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
})
