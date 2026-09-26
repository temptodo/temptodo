import { defineConfig } from 'drizzle-kit';
import { Config, Effect, Redacted } from 'effect';

const DatabaseConfig = Config.all({
  url: Config.redacted('URL'),
}).pipe(Config.nested('DATABASE'));

const { url } = Effect.runSync(Config.unwrap(DatabaseConfig));

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema',
  dbCredentials: {
    url: Redacted.value(url),
  },
});
