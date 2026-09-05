import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { Effect, Layer, Schema } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
} from 'effect/unstable/httpapi';
import { createServer } from 'node:http';

const Api = HttpApi.make('MyApi').add(
  HttpApiGroup.make('Greetings').add(
    HttpApiEndpoint.get('hello', '/', {
      success: Schema.String,
    }),
  ),
);

const GroupLayer = HttpApiBuilder.group(Api, 'Greetings', (handlers) =>
  handlers.handle('hello', () => Effect.succeed('Hello, World!')),
);

const ApiLayer = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(GroupLayer),
  HttpRouter.serve,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
);

Layer.launch(ApiLayer).pipe(NodeRuntime.runMain);
