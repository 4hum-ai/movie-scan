import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      '.eslintrc.cjs',
      '*.config.*',
      'dist-electron/**',
      'dist/**',
      'docs/typedoc',
      'docs/typedoc/assets/*',
      'release/**',
      'tailwind.config.js',
      'vite.config.ts',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: { 'vue/multi-word-component-names': 'off' },
  },
  prettierConfig,
])
