import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
    nursery: 'error',
    pedantic: 'error',
    perf: 'error',
    restriction: 'error',
    style: 'error',
    suspicious: 'error',
  },
  plugins: [
    'eslint',
    'typescript',
    'unicorn',
    'oxc',
    'import',
    'jsdoc',
    'node',
    'promise',
  ],
  rules: {
    'eslint/no-unused-vars': 'error',
    'import/no-default-export': 'off',
    'import/no-named-export': 'off',
    'import/prefer-default-export': 'off',
    'sort-imports': 'off',
    'sort-keys': 'off',
    'import/no-unassigned-import': 'off',
    'new-cap': 'off',
    'one-var': 'off',
    'import/no-nodejs-modules': 'off',
    'func-style': 'off',
    'oxc/no-async-await': 'off',
    'capitalized-comments': 'off',
  },
});
