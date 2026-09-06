import defaultConfig from '@repo/configs/oxlint.config';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [defaultConfig],
  ignorePatterns: ['apps/*', 'packages/*'],
});
