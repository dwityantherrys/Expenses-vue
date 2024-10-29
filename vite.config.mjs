import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: '192.168.22.90', // Set your desired network IP
        port: 5173, // Set the desired port
        strictPort: true, // Ensures Vite will fail if the port is already in use
        proxy: {
            '/api': {
                target: 'http://192.168.125.20:5252', // API server
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '') // Removes '/api' prefix from the URL
            }
        }
    },

    optimizeDeps: {
        noDiscovery: true
    },

    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
