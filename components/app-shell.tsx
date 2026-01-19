'use client';

import type { ReactNode } from 'react';
import type { PluginClientSnapshot } from '@/core/types';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { AuthGuard } from '@/components/auth-guard';
import { PluginProvider } from '@/components/plugin-provider';
import { UserProvider } from '@/contexts/user-context';
import { EventBusProvider } from '@/components/event-bus-provider';
import { EventDebugger } from '@/components/dev/event-debugger';

export function AppShell({
  children,
  pluginSnapshot,
}: {
  children: ReactNode;
  pluginSnapshot: PluginClientSnapshot;
}) {
  return (
    <UserProvider>
      <EventBusProvider>
        <PluginProvider initialSnapshot={pluginSnapshot}>
          <AuthGuard>
            <div className="flex h-screen bg-dark-primary">
              <Sidebar />
              <MobileNav />
              <main className="flex-1 overflow-auto main-content">
                <div className="p-8 md:p-8 p-4">{children}</div>
              </main>
              {process.env.NODE_ENV === 'development' ? <EventDebugger /> : null}
            </div>
          </AuthGuard>
        </PluginProvider>
      </EventBusProvider>
    </UserProvider>
  );
}
