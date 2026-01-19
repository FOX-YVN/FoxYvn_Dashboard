import { useSession } from 'next-auth/react';

export function useRefreshPermissions() {
  const { update } = useSession();

  const refreshPermissions = async () => {
    await update();
    console.log('[Permissions] Refreshed from database');
  };

  return { refreshPermissions };
}
