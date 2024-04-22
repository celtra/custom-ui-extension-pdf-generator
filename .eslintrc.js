/* eslint-env node */

module.exports = {
    'root': true,
    'plugins': ['@typescript-eslint', 'ts-standard'],
    'env': {
        'browser': true,
        'vue/setup-compiler-macros': true,
    },
    'extends': [
        'eslint:recommended',
        'standard-with-typescript', // https://github.com/standard/standard-with-typescript
        'plugin:@typescript-eslint/stylistic-type-checked'
    ],
    'parserOptions': {
        'parser': '@typescript-eslint/parser',
        'ecmaVersion': 2020,
    },
}
