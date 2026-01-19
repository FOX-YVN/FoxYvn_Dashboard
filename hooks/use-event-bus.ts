import { useCallback, useEffect } from 'react';
import type { PluginEvent } from '@/core/types';
import type { PluginEvents } from '@/core/event-bus';
import { usePlugins } from './use-plugins';

type EventHandler = (event: PluginEvent) => void | Promise<void>;

export function useEventBus() {
  const { eventBus } = usePlugins();

  const subscribe = useCallback(
    (eventType: string, handler: EventHandler, subscriberId?: string) => {
      return eventBus.subscribe(eventType, handler, subscriberId);
    },
    [eventBus],
  );

  const publish = useCallback(
    (type: string, payload: object, source = 'user-action') => {
      return eventBus.publish({ type, payload, source, timestamp: Date.now() });
    },
    [eventBus],
  );

  return { subscribe, publish, eventBus };
}

export function useEvent<T>(
  eventType: string,
  handler: (payload: T, event: PluginEvent) => void,
  deps: unknown[] = [],
  subscriberId?: string,
) {
  const { subscribe } = useEventBus();

  useEffect(() => {
    return subscribe(
      eventType,
      (event) => handler(event.payload as T, event),
      subscriberId,
    );
  }, [eventType, subscriberId, subscribe, ...deps]);
}

export type EventPayload<T extends keyof PluginEvents & string> = PluginEvents[T];
