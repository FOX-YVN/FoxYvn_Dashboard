import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';
import { getPluginClientSnapshot } from '@/core/plugin-loader';

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const pluginSnapshot = await getPluginClientSnapshot();

  return <AppShell pluginSnapshot={pluginSnapshot}>{children}</AppShell>;
}
