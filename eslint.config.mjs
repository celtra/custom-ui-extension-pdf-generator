/* eslint-env node */
import pluginVue from 'eslint-plugin-vue'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

export default defineConfigWithVueTs(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylisticTypeChecked,
  ...pluginVue.configs['flat/vue2-recommended'],
  vueTsConfigs.recommended,
  {
    name: 'overrides',
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
          'argsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_',
      }],
    }
  }
)
