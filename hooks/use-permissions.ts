import { hasAllPermissions, hasAnyPermission, hasPermission } from '@/core/permissions';
import { useUser } from '@/contexts/user-context';

export function usePermissions() {
  const { user, isLoading } = useUser();
  const userPermissions = user?.permissions ?? [];

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
  };
}
