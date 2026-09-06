import { createServer } from 'node:http';

import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { Api } from '@repo/api-definition';
import {
  Config,
  Effect,
  Context,
  Layer,
  Console,
  Redacted,
  Schema,
} from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

const DatabaseConfig = Config.all({
  url: Config.schema(Schema.Redacted(Schema.URL), 'URL'),
}).pipe(Config.nested('DATABASE'));

const appConfig = Config.all({
  db: DatabaseConfig,
});

export class AppConfig extends Context.Service<
  AppConfig,
  Config.Success<typeof appConfig>
>()('AppConfig') {}

const AppConfigLive = Layer.effect(AppConfig, appConfig);

const GroupLayer = HttpApiBuilder.group(Api, 'Greetings', (handlers) =>
  handlers.handle('hello', () =>
    Effect.gen(function* () {
      const config = yield* AppConfig;
      yield* Console.log(Redacted.value(config.db.url));
      return '';
    }),
  ),
);

const ApiLayer = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(GroupLayer),
  HttpRouter.serve,
  Layer.provide(AppConfigLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8000 })),
);

Layer.launch(ApiLayer).pipe(NodeRuntime.runMain);
