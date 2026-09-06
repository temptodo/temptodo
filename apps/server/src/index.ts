import { createServer } from 'node:http';

import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { Api } from '@repo/api-definition';
import { Effect, Layer, Console } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { AppConfig, AppConfigLive } from '#/config/index.js';

const GroupLayer = HttpApiBuilder.group(Api, 'Greetings', (handlers) =>
  handlers.handle('hello', () =>
    Effect.gen(function* () {
      const config = yield* AppConfig;
      yield* Console.log(config.db.url);
      return 'Hello, World!';
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
