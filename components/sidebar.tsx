'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Home,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  User,
  Settings,
  Package,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

// Базовые пункты меню (заводское состояние)
const mainItems = [
  { id: 'dashboard', label: 'Главная', icon: Home, href: '/dashboard' },
  { id: 'comms', label: 'Сообщения', icon: MessageCircle, href: '/comms' },
];

// TODO: Модули будут загружаться из lib/modules.ts
const installedModules: Array<{ id: string; label: string; icon: typeof Package; href: string }> = [];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const [modulesOpen, setModulesOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Вычисление позиции индикатора активного пункта
  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return;
      
      const activeItem = navRef.current.querySelector('.sidebar-item.active') as HTMLElement;
      if (activeItem) {
        const navRect = navRef.current.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        setIndicatorTop(itemRect.top - navRect.top + (itemRect.height / 2) - 10);
        setIndicatorVisible(true);
      } else {
        setIndicatorVisible(false);
      }
    };

    updateIndicator();
    const timer = setTimeout(updateIndicator, 50);
    return () => clearTimeout(timer);
  }, [pathname, modulesOpen]);

  return (
    <aside 
      className={`sidebar h-screen flex flex-col ${
        collapsed ? 'collapsed w-[72px]' : 'w-[260px]'
      }`}
      style={{ transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Кнопка сворачивания */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="collapse-toggle"
        title={collapsed ? 'Развернуть' : 'Свернуть'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Логотип */}
      <div className="flex items-center gap-3 px-4 py-4">
        <div className="relative w-8 h-8 flex-shrink-0">
          <Image
            src="https://cdn.abacus.ai/images/9c860aec-6088-4ded-9ecd-91672e0ead25.png"
            alt="FOX YVN"
            fill
            className="object-contain"
          />
        </div>
        {!collapsed && (
          <span className="logo-text text-[15px] font-semibold text-white">
            FOX YVN
          </span>
        )}
      </div>

      {/* Поиск */}
      {!collapsed && (
        <div className="search-wrapper px-3 mb-4">
          <div className="relative">
            <Search 
              size={15} 
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${
                searchFocused ? 'text-white/70' : 'text-white/40'
              }`}
            />
            <input
              type="text"
              placeholder="Найти"
              className="search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
      )}

      {/* Навигация */}
      <div ref={navRef} className="flex-1 overflow-y-auto relative">
        {/* Индикатор активного пункта */}
        <div 
          className="sidebar-indicator"
          style={{ 
            top: indicatorTop,
            opacity: indicatorVisible ? 1 : 0,
          }}
        />

        {/* Основное меню */}
        <nav className="sidebar-section">
          {mainItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="sidebar-icon" />
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Раздел Модули */}
        <div className="mt-4">
          {!collapsed && (
            <div 
              className="sidebar-section-title flex items-center justify-between cursor-pointer px-4"
              onClick={() => setModulesOpen(!modulesOpen)}
            >
              <span>Модули</span>
              <div className="flex items-center gap-1">
                <button 
                  className="btn-icon p-1"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    // TODO: Открыть модальное окно добавления модуля
                  }}
                  title="Добавить модуль"
                >
                  <Plus size={14} />
                </button>
                {modulesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>
          )}
          
          {(modulesOpen || collapsed) && (
            <nav className="sidebar-section">
              {installedModules.length === 0 ? (
                // Пустое состояние
                !collapsed && (
                  <div className="px-4 py-6 text-center">
                    <Package size={32} className="mx-auto text-white/20 mb-2" />
                    <p className="text-[12px] text-white/40">Нет установленных модулей</p>
                    <button className="mt-2 text-[12px] text-accent hover:text-accent-light transition-colors">
                      + Добавить модуль
                    </button>
                  </div>
                )
              ) : (
                // Список установленных модулей
                installedModules.map((module) => {
                  const isActive = pathname === module.href || pathname?.startsWith(module.href + '/');
                  const Icon = module.icon;
                  return (
                    <Link
                      key={module.id}
                      href={module.href}
                      className={`sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
                      title={collapsed ? module.label : undefined}
                    >
                      <Icon size={20} className="sidebar-icon" />
                      {!collapsed && <span className="sidebar-label">{module.label}</span>}
                    </Link>
                  );
                })
              )}
            </nav>
          )}
        </div>
      </div>

      {/* Нижняя секция: Настройки + Пользователь */}
      <div className="border-t border-white/[0.06] p-3 space-y-1">
        {/* Настройки */}
        <Link
          href="/settings"
          className={`sidebar-item ${pathname === '/settings' ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Настройки' : undefined}
        >
          <Settings size={20} className="sidebar-icon" />
          {!collapsed && <span className="sidebar-label">Настройки</span>}
        </Link>

        {/* Пользователь */}
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'} py-2`}>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
            <User size={16} className="text-white/60" />
          </div>
          {!collapsed && (
            <div className="user-name flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">
                {session?.user?.name || 'User'}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="btn-icon p-1"
              title="Выйти"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
