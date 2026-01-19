'use client';

import { useEffect, useState } from 'react';
import { pluginEventBus } from '@/core/event-bus';
import type { PluginEvent } from '@/core/types';
import { useEvent } from '@/hooks/use-event-bus';

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

export function EventDebugger() {
  const [events, setEvents] = useState<PluginEvent[]>(() =>
    pluginEventBus.getEventHistory(10),
  );
  const [collapsed, setCollapsed] = useState(false);

  useEvent('*', () => {
    setEvents(pluginEventBus.getEventHistory(10));
  }, [], 'event-debugger');

  useEffect(() => {
    setEvents(pluginEventBus.getEventHistory(10));
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] w-80">
      <div className="glass-medium rounded-xl border border-white/[0.08] shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
          <span className="text-[13px] font-semibold text-white">Event Debugger</span>
          <div className="flex items-center gap-2">
            <button
              className="text-[11px] text-white/60 hover:text-white"
              onClick={() => {
                pluginEventBus.clearHistory();
                setEvents([]);
              }}
            >
              Очистить
            </button>
            <button
              className="text-[11px] text-white/60 hover:text-white"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              {collapsed ? 'Развернуть' : 'Свернуть'}
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-2">
            {events.length === 0 ? (
              <p className="text-[12px] text-white/50">Нет событий</p>
            ) : (
              events.map((event, index) => (
                <div
                  key={`${event.type}-${event.timestamp}-${index}`}
                  className="text-[11px] text-white/70 border-b border-white/[0.06] pb-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">{event.type}</span>
                    <span className="text-white/40">{formatTime(event.timestamp)}</span>
                  </div>
                  <div className="text-white/40">Источник: {event.source}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
