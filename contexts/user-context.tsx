'use client';

import { createContext, useContext, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import type { Permission } from '@/core/permissions';

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: Permission[];
}

interface UserContextValue {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const value = useMemo<UserContextValue>(() => {
    if (!session?.user) {
      return { user: null, isLoading: status === 'loading' };
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        permissions: session.user.permissions ?? [],
      },
      isLoading: status === 'loading',
    };
  }, [session, status]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  return useContext(UserContext);
}
