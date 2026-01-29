declare module 'vite-plugin-eslint' {
    import { Plugin } from 'vite';

    interface ESLintOptions {
        cache?: boolean;
        fix?: boolean;
        include?: string | string[];
        exclude?: string | string[];
        eslintPath?: string;
        formatter?: string;
        lintOnStart?: boolean;
        emitWarning?: boolean;
        emitError?: boolean;
        failOnWarning?: boolean;
        failOnError?: boolean;
    }

    export default function eslintPlugin(options?: ESLintOptions): Plugin;
}
