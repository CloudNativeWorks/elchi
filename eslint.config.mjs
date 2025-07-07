import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ["node_modules/**", "src/elchi/versions/**"],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
                jsx: true,
            },
        },
        plugins: {
            react: eslintPluginReact,
            reactHooks: eslintPluginReactHooks,
            '@typescript-eslint': eslintPluginTypescript,
        },
        settings: {
            react: {
                version: '18.2.0',
            },
        },
        rules: {
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-case-declarations': 'off',
            'no-case-declarations': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'no-unused-vars': 'error',
        },
    },
];
