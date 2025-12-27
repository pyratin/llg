import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import { jsdoc as eslintPluginJsdoc } from 'eslint-plugin-jsdoc';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended']
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended']
  },
  { settings: { react: { version: 'detect' } } },
  eslintPluginPrettierRecommended,
  eslintPluginReactHooks.configs.flat['recommended-latest'],
  eslintPluginJsdoc({ config: 'flat/recommended' }),
  {
    rules: {
      'no-console': 'error',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true }
      ],
      'react/no-unknown-property': [
        'error',
        { ignore: ['texture', 'anchor', 'eventMode'] }
      ]
    }
  }
]);
