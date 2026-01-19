'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  MessageCircle,
  Settings,
  Package,
  User,
  LogOut,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

// Основные пункты меню
const navItems = [
  { id: 'dashboard', label: 'Главная', icon: Home, href: '/dashboard' },
  { id: 'comms', label: 'Сообщения', icon: MessageCircle, href: '/comms' },
  { id: 'modules', label: 'Модули', icon: Package, href: '/modules' },
  { id: 'settings', label: 'Настройки', icon: Settings, href: '/settings' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Мобильный хедер - Apple Music стиль */}
      <header className="mobile-header">
        <button 
          className="burger-button"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src="https://cdn.abacus.ai/images/9c860aec-6088-4ded-9ecd-91672e0ead25.png"
              alt="FOX YVN"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[15px] font-semibold text-white">FOX YVN</span>
        </div>

        {/* Иконка пользователя справа - Apple Music стиль */}
        <Link href="/settings" className="user-avatar-button">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </Link>
      </header>

      {/* Оверлей */}
      <div 
        className={`mobile-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Мобильный сайдбар */}
      <aside className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Хедер сайдбара */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image
                src="https://cdn.abacus.ai/images/9c860aec-6088-4ded-9ecd-91672e0ead25.png"
                alt="FOX YVN"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[15px] font-semibold text-white">FOX YVN</span>
          </div>
          <button 
            className="burger-button"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Меню */}
        <nav className="flex-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
                  isActive 
                    ? 'bg-accent/20 text-accent' 
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon size={20} />
                <span className="text-[14px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Пользователь */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <User size={18} className="text-white/60" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-white">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-[12px] text-white/50">
                {session?.user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-white/60 hover:bg-white/5 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-[13px]">Выйти</span>
          </button>
        </div>
      </aside>

      {/* Нижняя навигация */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={22} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
