import { PgClient } from '@effect/sql-pg';
import * as PgDrizzle from 'drizzle-orm/effect-postgres';
import { Context, Effect, Layer } from 'effect';
import { types } from 'pg';

import { AppConfig } from '#/config/index.js';

const typesToParseByDrizzle = [
  1184, 1114, 1082, 1186, 1231, 1115, 1185, 1187, 1182,
];

export const PgClientLive = Layer.unwrap(
  Effect.gen(function* () {
    const config = yield* AppConfig;

    return PgClient.layer({
      url: config.db.url,
      types: {
        getTypeParser: (typeId: number, format) => {
          if (typesToParseByDrizzle.includes(typeId)) {
            return (val: unknown): unknown => val;
          }
          return types.getTypeParser(typeId, format);
        },
      },
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
