import { Config, Context, Layer } from 'effect';

const DatabaseConfig = Config.all({
  url: Config.redacted('URL'),
}).pipe(Config.nested('DATABASE'));

const appConfig = Config.all({
  db: DatabaseConfig,
});

export class AppConfig extends Context.Service<
  AppConfig,
  Config.Success<typeof appConfig>
>()('AppConfig') {}

export const AppConfigLive = Layer.effect(AppConfig, appConfig);
