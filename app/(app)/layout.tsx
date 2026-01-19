'use client';

import { SessionProvider } from 'next-auth/react';
import { Sidebar } from '@/components/sidebar';
import { AuthGuard } from '@/components/auth-guard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>
        <div className="flex h-screen bg-dark-primary">
          <Sidebar />
          <main className="flex-1 overflow-auto main-content">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </AuthGuard>
    </SessionProvider>
  );
}
