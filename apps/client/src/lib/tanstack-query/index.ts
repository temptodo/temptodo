import {
  useMutation,
  useQuery,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { Effect } from 'effect';
import type { HttpClientResponse } from 'effect/unstable/http';

import {
  ApiClient,
  apiClientRuntime,
  type ApiClientShape,
} from '@/lib/api-client';

// oxlint-disable-next-line typescript/no-explicit-any
type AnyFunction = (...args: any[]) => any;

type GetRequestParams<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
> = ApiClientShape[G][E] extends AnyFunction
  ? Parameters<ApiClientShape[G][E]>[0]
  : never;

type GetReturnType<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
> = ApiClientShape[G][E] extends AnyFunction
  ? ReturnType<ApiClientShape[G][E]>
  : never;

function apiEffect<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
>(section: G, method: E, params: GetRequestParams<G, E>): GetReturnType<G, E> {
  const res = Effect.gen(function* () {
    const client = yield* ApiClient;
    const sectionObj = client[section];
    const methodFn = sectionObj[method];
    if (typeof methodFn !== 'function') {
      throw new TypeError(
        `Method ${String(section)}.${String(method)} is not a function`,
      );
    }
    return yield* methodFn(params);
  }) as GetReturnType<G, E>;
  return res;
}

type ExcludeHttpResponseTuple<T> = Exclude<
  T,
  readonly [unknown, HttpClientResponse.HttpClientResponse]
>;

type GetCleanSuccessType<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
> = ExcludeHttpResponseTuple<Effect.Success<GetReturnType<G, E>>>;

type GetCleanErrorType<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
> = ExcludeHttpResponseTuple<Effect.Error<GetReturnType<G, E>>>;

type PromiseSuccess<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
> = Promise<GetCleanSuccessType<G, E>>;

export function apiEffectRunner<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
>(section: G, method: E, params: GetRequestParams<G, E>): PromiseSuccess<G, E> {
  const program = apiEffect(section, method, params);
  return apiClientRuntime.runPromise(program);
}

// oxlint-disable-next-line typescript/explicit-function-return-type
export function useEffectQuery<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
>(
  section: G,
  method: E,
  params: GetRequestParams<G, E>,
  useQueryParams?: Omit<
    UseQueryOptions<GetCleanSuccessType<G, E>, GetCleanErrorType<G, E>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: [section, method, params],
    queryFn: () => apiEffectRunner(section, method, params),
    ...useQueryParams,
  });
}

// oxlint-disable-next-line typescript/explicit-function-return-type
export function useEffectMutation<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
>(
  section: G,
  method: E,
  useMutationParams?: Omit<
    UseMutationOptions<
      GetCleanSuccessType<G, E>,
      GetCleanErrorType<G, E>,
      GetRequestParams<G, E>
    >,
    'mutationFn'
  >,
) {
  return useMutation({
    mutationFn: (params: GetRequestParams<G, E>) =>
      apiEffectRunner(section, method, params),
    ...useMutationParams,
  });
}

export function getQueryKey<
  G extends keyof ApiClientShape,
  E extends keyof ApiClientShape[G],
>(
  section: G,
  method: E,
  params: GetRequestParams<G, E>,
): [G, E, GetRequestParams<G, E>] {
  return [section, method, params] as const;
}
