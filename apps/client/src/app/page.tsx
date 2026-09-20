import { Api } from '@repo/api-definition';
import { Effect } from 'effect';
import { FetchHttpClient } from 'effect/unstable/http';
import { HttpApiClient } from 'effect/unstable/httpapi';

const test = Effect.gen(function* test() {
  const client = yield* HttpApiClient.make(Api, {
    baseUrl: 'http://127.0.0.1:8000',
  });
  return yield* client.Greetings.hello();
}).pipe(Effect.provide(FetchHttpClient.layer));

export const dynamic = 'force-dynamic';

export default async function Home(): Promise<React.ReactNode> {
  const res = await Effect.runPromise(test);

  return <div>Hello, World! | {res}</div>;
}
