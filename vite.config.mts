import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';
    const base = '/';

    return {
        define: {
            'import.meta.env.DEV': !isProduction,
            'import.meta.env.PROD': isProduction,
            'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
        },
        esbuild: {
            logOverride: { 'duplicate-case': 'silent' },
        },
        base,
        build: {
            outDir: 'dist',
            sourcemap: false,
        },
        server: {
            port: 3000,
            watch: {
                usePolling: true,
            },
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
                '@redux': resolve(__dirname, './src/redux'),
                '@utils': resolve(__dirname, './src/utils'),
                '@components': resolve(__dirname, './src/elchi/components'),
                '@versions': resolve(__dirname, './src/elchi/versions'),
                '@elchi': resolve(__dirname, './src/elchi'),
                '@handlers': resolve(__dirname, './src/elchi/handlers'),
            },
        },
        plugins: [
            react(),
            eslintPlugin({
                lintOnStart: false,
                include: ['src/**/*.{ts,tsx}'],
                exclude: ['node_modules', 'dist'],
                emitWarning: false,
            }),
            tsconfigPaths(),
            createHtmlPlugin({
                minify: isProduction,
                entry: resolve(__dirname, './src/main.tsx'),
                template: './index.html',
                inject: {
                    data: {
                        title: 'Elchi',
                    },
                },
            }),
        ],
        optimizeDeps: {
            include: [
                'long',
                'protobufjs/minimal',
                '@grafana/data',
                '@grafana/ui',
                '@grafana/runtime'],
        },
    };
});