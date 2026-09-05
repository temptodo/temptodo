import defaultConfig from '@repo/configs/oxlint.config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [defaultConfig],
  plugins: ['nextjs', 'jsx-a11y'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
});
