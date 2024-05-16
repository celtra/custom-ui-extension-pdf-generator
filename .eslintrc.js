/* eslint-env node */

module.exports = {
    'root': true,
    'plugins': [
        '@typescript-eslint',
    ],
    'env': {
        'browser': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/stylistic-type-checked',
        '@vue/eslint-config-typescript',
    ],
    "parser": "vue-eslint-parser",
    'parserOptions': {
        'parser': '@typescript-eslint/parser',
        'ecmaVersion': 2020,
        'project': './tsconfig.json',
    },
    "ignorePatterns": '.eslintrc.js',
}
