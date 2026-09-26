import { pgTable, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: uuid().primaryKey(),
});
