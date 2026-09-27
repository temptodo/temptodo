import { Api } from '@repo/api-definition';
import { Context, Effect, Layer, ManagedRuntime } from 'effect';
import { FetchHttpClient } from 'effect/unstable/http';
import { HttpApiClient } from 'effect/unstable/httpapi';

const apiClientEffect = Effect.gen(function* () {
  return yield* HttpApiClient.make(Api, {
    baseUrl: 'http://localhost:8000',
  });
});

export type ApiClientShape = Effect.Success<typeof apiClientEffect>;

export class ApiClient extends Context.Service<ApiClient, ApiClientShape>()(
  'ApiClient',
) {}

export const ApiClientLive = Layer.effect(ApiClient, apiClientEffect);

export const ApiClientLayer = Layer.provide(
  ApiClientLive,
  FetchHttpClient.layer,
);

export const apiClientRuntime = ManagedRuntime.make(ApiClientLayer);
