import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    clearScreen: false,
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
            "@contexts": fileURLToPath(new URL("./src/contexts", import.meta.url)),
            "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
        },
    },
    server: {
        host: "0.0.0.0",
        proxy: {
            "/api": {
                target: "http://backend:8000",
            },
        },
    },
});
