import { createServer } from 'node:http';

import { NodeHttpServer, NodeRuntime } from '@effect/platform-node';
import { Api } from '@repo/api-definition';
import { sql } from 'drizzle-orm';
import { Effect, Layer } from 'effect';
import { HttpRouter } from 'effect/unstable/http';
import { HttpApiBuilder } from 'effect/unstable/httpapi';

import { AppConfigLive } from '#/config/index.js';
import { Db, DbLive, PgClientLive } from '#/db/index.js';

const GroupLayer = HttpApiBuilder.group(Api, 'Greetings', (handlers) =>
  handlers.handle('hello', () =>
    Effect.gen(function* () {
      const db = yield* Db;
      const result = yield* db.execute<{ id: string }>(
        sql`SELECT 'Hello, World!' as id`,
      );

      return { value: result[0]?.id ?? 'fail' };
    }).pipe(
      Effect.catchTag('EffectDrizzleQueryError', () =>
        Effect.succeed({ value: 'fail :(' }),
      ),
    ),
  ),
);

const ApiLayer = HttpApiBuilder.layer(Api).pipe(
  Layer.provide(GroupLayer),
  Layer.provide(
    HttpRouter.cors({
      allowedOrigins: ['http://127.0.0.1:3000'],
      credentials: true,
    }),
  ),
  HttpRouter.serve,
  Layer.provide(Layer.provideMerge(DbLive, PgClientLive)),
  Layer.provide(AppConfigLive),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 8000 })),
);

Layer.launch(ApiLayer).pipe(NodeRuntime.runMain);
