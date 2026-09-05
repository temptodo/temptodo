import { defineConfig } from 'oxlint';
import defaultConfig from '@repo/configs/oxlint.config';

export default defineConfig({
  extends: [defaultConfig],
  plugins: ['react', 'react-perf', 'nextjs', 'jsx-a11y'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
});
