'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-primary">
        <Loader2 className="animate-spin text-white/60" size={40} />
      </div>
    );
  }

  return <AuthGuardInner>{children}</AuthGuardInner>;
}

function AuthGuardInner({ children }: AuthGuardProps) {
  const sessionData = useSession();
  const status = sessionData?.status ?? 'loading';
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-primary">
        <Loader2 className="animate-spin text-white/60" size={40} />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-primary">
        <Loader2 className="animate-spin text-white/60" size={40} />
      </div>
    );
  }

  return <>{children}</>;
}
