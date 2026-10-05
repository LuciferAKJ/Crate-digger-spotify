import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.config.{js,ts}', '**/vite-env.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Server: Node environment, no React.
  {
    files: ['server/src/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
  // Client: browser environment + React hooks rules.
  {
    files: ['client/src/**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  // Shared package: library code, no environment globals needed.
  {
    files: ['packages/shared/src/**/*.ts'],
  },
  // Project-wide rule overrides.
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
