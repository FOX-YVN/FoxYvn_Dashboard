'use client';

import type { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { useUser } from '@/contexts/user-context';

const LOG_PREFIX = '[Permissions]';

export function PermissionGuard({
  required,
  fallback,
  children,
}: {
  required: string[];
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { user, isLoading } = useUser();
  const { hasAllPermissions } = usePermissions();
  const userPermissions = user?.permissions ?? [];
  const hasAccess =
    required.length === 0 || hasAllPermissions(userPermissions, required);

  if (isLoading) {
    return (
      <div className="glass-medium rounded-xl p-6">
        <p className="text-sm text-white/60">Загрузка прав доступа...</p>
      </div>
    );
  }

  if (!user || !hasAccess) {
    const denied = required.find((permission) => !userPermissions.includes(permission));
    if (denied) {
      console.warn(LOG_PREFIX, `Access denied: user lacks "${denied}"`);
    }

    return (
      fallback ?? (
        <div className="glass-medium rounded-xl p-6">
          <h1 className="text-lg font-semibold text-white">Нет доступа</h1>
          <p className="text-sm text-white/60">
            У вас нет прав для просмотра этого раздела.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
