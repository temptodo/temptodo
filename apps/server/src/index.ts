import { createServer } from 'node:http';

import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { Api } from '@repo/api-definition';
import { Effect, Layer } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

const GroupLayer = HttpApiBuilder.group(Api, 'Greetings', (handlers) =>
  handlers.handle('hello', () => Effect.succeed('Hello, World!')),
);

const ApiLayer = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(GroupLayer),
  HttpRouter.serve,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8000 })),
);

Layer.launch(ApiLayer).pipe(NodeRuntime.runMain);
