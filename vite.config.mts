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
                    manualChunks: (id) => {
                        // React core
                        if (id.includes('react-dom') || id.includes('react-router')) {
                            return 'vendor-react';
                        }
                        // Ant Design
                        if (id.includes('antd') || id.includes('@ant-design')) {
                            return 'vendor-antd';
                        }
                        // State management
                        if (id.includes('@reduxjs/toolkit') || id.includes('react-redux') || id.includes('@tanstack/react-query')) {
                            return 'vendor-state';
                        }
                        // Grafana (heavy - separate chunk)
                        if (id.includes('@grafana')) {
                            return 'vendor-grafana';
                        }
                        // Note: ECharts is NOT separated due to circular dependency issues
                        // It will be bundled with vendor-misc
                        // XYFlow (heavy - separate chunk for lazy loading)
                        if (id.includes('@xyflow') || id.includes('reactflow') || id.includes('elkjs')) {
                            return 'vendor-xyflow';
                        }
                        // Cytoscape (graph visualization)
                        if (id.includes('cytoscape')) {
                            return 'vendor-cytoscape';
                        }
                        // Monaco editor (heavy - separate chunk for lazy loading)
                        if (id.includes('monaco-editor') || id.includes('@monaco-editor')) {
                            return 'vendor-monaco';
                        }
                        // PDF generation
                        if (id.includes('jspdf') || id.includes('html-to-image')) {
                            return 'vendor-pdf';
                        }
                        // Markdown/Code highlighting
                        if (id.includes('react-markdown') || id.includes('prism') || id.includes('remark') || id.includes('rehype') || id.includes('react-syntax-highlighter')) {
                            return 'vendor-markdown';
                        }
                        // Protobuf
                        if (id.includes('protobuf') || id.includes('@bufbuild')) {
                            return 'vendor-protobuf';
                        }
                        // Utilities
                        if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios') || id.includes('date-fns')) {
                            return 'vendor-utils';
                        }
                        // Other node_modules
                        if (id.includes('node_modules')) {
                            return 'vendor-misc';
                        }
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