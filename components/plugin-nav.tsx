'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Brain, Lock, Package, Shield, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { usePlugins } from '@/hooks/use-plugins';
import { usePermissions } from '@/hooks/use-permissions';

const iconMap: Record<string, LucideIcon> = {
  bot: Bot,
  brain: Brain,
  lock: Lock,
  package: Package,
  shield: Shield,
  wallet: Wallet,
};

export function PluginNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { navItems, manifests } = usePlugins();
  const { hasAllPermissions, userPermissions } = usePermissions();
  const manifestMap = useMemo(
    () => new Map(manifests.map((manifest) => [manifest.name, manifest])),
    [manifests],
  );
  const sortedItems = [...navItems].sort((a, b) => {
    const orderA = manifestMap.get(a.id)?.order ?? a.order ?? 100;
    const orderB = manifestMap.get(b.id)?.order ?? b.order ?? 100;
    return orderA - orderB;
  });

  if (sortedItems.length === 0) {
    return (
      !collapsed && (
        <div className="px-4 py-6 text-center">
          <Package size={32} className="mx-auto text-white/20 mb-2" />
          <p className="text-[12px] text-white/40">Нет установленных модулей</p>
          <button className="mt-2 text-[12px] text-accent hover:text-accent-light transition-colors">
            + Добавить модуль
          </button>
        </div>
      )
    );
  }

  return (
    <>
      {sortedItems.map((item) => {
        const manifest = manifestMap.get(item.id);
        const requiredPermissions = manifest?.permissions ?? [];
        const hasAccess =
          requiredPermissions.length === 0 ||
          hasAllPermissions(userPermissions, requiredPermissions);
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        const iconKey = item.icon?.toLowerCase() ?? '';
        const Icon = iconMap[iconKey] ?? Package;

        if (!hasAccess) {
          return (
            <div
              key={item.id}
              className={`sidebar-item opacity-50 cursor-not-allowed ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title={collapsed ? item.label : 'Нет доступа'}
              aria-disabled
            >
              <Icon size={20} className="sidebar-icon" />
              {!collapsed && (
                <>
                  <span className="sidebar-label">{item.label}</span>
                  <Lock size={14} className="ml-auto text-white/40" />
                </>
              )}
            </div>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`sidebar-item ${isActive ? 'active' : ''} ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title={collapsed ? item.label : undefined}
          >
            <Icon size={20} className="sidebar-icon" />
            {!collapsed && <span className="sidebar-label">{item.label}</span>}
          </Link>
        );
      })}
    </>
  );
}
