'use client';

import { createContext, useContext } from 'react';
import { pluginEventBus } from '@/core/event-bus';

// Глобальный провайдер шины событий
const EventBusContext = createContext(pluginEventBus);

export function EventBusProvider({ children }: { children: React.ReactNode }) {
  return <EventBusContext.Provider value={pluginEventBus}>{children}</EventBusContext.Provider>;
}

export function useEventBusInstance() {
  return useContext(EventBusContext);
}
