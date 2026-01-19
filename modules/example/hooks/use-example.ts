import { useMemo } from 'react';
import type { ExampleConfig } from '../config';

export function useExample(config?: ExampleConfig): string {
  return useMemo(() => config?.greeting ?? 'Привет', [config?.greeting]);
}
