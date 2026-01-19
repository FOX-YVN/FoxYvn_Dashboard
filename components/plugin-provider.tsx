'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PluginClientSnapshot, PluginNavItem, PluginManifest } from '@/core/types';
import { useEventBusInstance } from '@/components/event-bus-provider';

const LOG_PREFIX = '[PluginSystem]';

interface PluginContextValue {
  manifests: PluginManifest[];
  navItems: PluginNavItem[];
  refresh: () => void;
  eventBus: ReturnType<typeof useEventBusInstance>;
}

const PluginContext = createContext<PluginContextValue | null>(null);

const emptySnapshot: PluginClientSnapshot = { manifests: [], navItems: [] };

export function PluginProvider({
  children,
  initialSnapshot = emptySnapshot,
}: {
  children: React.ReactNode;
  initialSnapshot?: PluginClientSnapshot;
}) {
  const eventBus = useEventBusInstance();
  const [snapshot, setSnapshot] = useState<PluginClientSnapshot>(initialSnapshot);

  useEffect(() => {
    // Синхронизируем клиентский стейт с серверным слепком при каждом ререндере layout
    setSnapshot(initialSnapshot);
  }, [initialSnapshot]);

  const refresh = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(LOG_PREFIX, 'Перезагрузка для обновления модулей');
      window.location.reload();
      return;
    }

    console.log(LOG_PREFIX, 'Обновление модулей отключено в production');
  }, []);

  const value = useMemo(
    () => ({
      manifests: snapshot.manifests,
      navItems: snapshot.navItems,
      refresh,
      eventBus,
    }),
    [snapshot, refresh, eventBus],
  );

  return <PluginContext.Provider value={value}>{children}</PluginContext.Provider>;
}

export function usePluginContext(): PluginContextValue {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginContext должен использоваться внутри PluginProvider');
  }

  return context;
}
