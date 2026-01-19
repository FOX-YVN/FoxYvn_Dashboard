'use client';

import { SessionProvider } from 'next-auth/react';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { AuthGuard } from '@/components/auth-guard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>
        <div className="flex h-screen bg-dark-primary">
          {/* Десктопный сайдбар */}
          <Sidebar />
          
          {/* Мобильная навигация */}
          <MobileNav />
          
          {/* Основной контент */}
          <main className="flex-1 overflow-auto main-content">
            <div className="p-8 md:p-8 p-4">
              {children}
            </div>
          </main>
        </div>
      </AuthGuard>
    </SessionProvider>
  );
}
