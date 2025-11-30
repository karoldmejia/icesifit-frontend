import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx}'],
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        rules: {
            // Variables
            'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-use-before-define': 'error',

            // Buenas prácticas
            'eqeqeq': 'error',
            'curly': 'error',
            'no-debugger': 'error',
            'no-console': 'error',

            // Estilo
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'indent': ['error', 2],
            'comma-dangle': ['error', 'always-multiline'],
        },
    },
]);
