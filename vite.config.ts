import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig(() => {
    return {
        optimizeDeps: {
            esbuildOptions: {
                target: 'esnext',
            },
        },
        build: {
            target: 'esnext',
            emptyOutDir: true,
            sourcemap: 'inline',
        },
        plugins: [
            vue(),
            viteSingleFile(),
        ],
    }
})
