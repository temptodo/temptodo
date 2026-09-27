'use client';
import { Match } from 'effect';
import type { ReactNode } from 'react';

import { useEffectQuery } from '@/lib/tanstack-query';

export const dynamic = 'force-dynamic';

export default function Home(): ReactNode {
  const { isLoading, data, error } = useEffectQuery('Greetings', 'hello', {});

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return Match.value(error).pipe(
      Match.tag('HttpClientError', (e) => <p>{JSON.stringify(e)}</p>),
      Match.tag('SchemaError', (e) => <p>{JSON.stringify(e)}</p>),
      Match.exhaustive,
    );
  }

  return <p>{data?.value}</p>;
}
