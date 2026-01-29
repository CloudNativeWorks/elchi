import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import eslintPlugin from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteCompression from 'vite-plugin-compression';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
    const isProduction = mode === 'production';
    const base = '/';

    return {
        esbuild: {
            logOverride: { 'duplicate-case': 'silent' },
        },
        base,
        build: {
            outDir: 'dist',
            sourcemap: false,
            rollupOptions: {
                output: {
                    // Use static chunks - safer than function approach
                    // Vite handles code splitting for lazy-loaded routes automatically
                    manualChunks: {
                        // React core
                        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                        // Ant Design
                        'vendor-antd': ['antd', '@ant-design/icons', '@ant-design/cssinjs'],
                        // State management
                        'vendor-state': ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query'],
                        // Utilities
                        'vendor-utils': ['lodash', 'dayjs', 'axios'],
                    },
                },
            },
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
            // Compression plugins (only for production)
            ...(isProduction
                ? [
                    viteCompression({
                        algorithm: 'gzip',
                        ext: '.gz',
                        threshold: 1024,
                        deleteOriginFile: false,
                    }),
                    viteCompression({
                        algorithm: 'brotliCompress',
                        ext: '.br',
                        threshold: 1024,
                        deleteOriginFile: false,
                    }),
                ]
                : []),
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