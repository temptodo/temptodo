import { PgClient } from '@effect/sql-pg';
import * as PgDrizzle from 'drizzle-orm/effect-postgres';
import { Context, Effect, Layer } from 'effect';

import { AppConfig } from '#/config/index.js';

export const PgClientLive = Layer.unwrap(
  Effect.gen(function* () {
    const config = yield* AppConfig;

    return PgClient.layer({
      url: config.db.url,
    });
  }),
);

export class Db extends Context.Service<Db, Effect.Success<typeof dbEffect>>()(
  'Db',
) {}

const dbEffect = PgDrizzle.make({}).pipe(
  Effect.provide(PgDrizzle.DefaultServices),
);

export const DbLive = Layer.effect(Db, dbEffect);
