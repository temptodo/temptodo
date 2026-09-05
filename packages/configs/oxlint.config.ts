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
    'vitest',
  ],
  rules: {
    'eslint/no-unused-vars': 'error',
  },
});
