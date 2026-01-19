'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Home,
  LayoutGrid,
  MessageCircle,
  Lock,
  FileText,
  Wallet,
  Bot,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  LogOut,
  User,
  GripVertical,
  Send,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

const defaultMainItems = [
  { id: 'dashboard', label: 'Главная', icon: Home, href: '/dashboard' },
  { id: 'ops', label: 'Операции', icon: LayoutGrid, href: '/ops' },
  { id: 'comms', label: 'Сообщения', icon: MessageCircle, href: '/comms' },
];

const defaultLibraryItems = [
  { id: 'vault', label: 'Хранилище', icon: Lock, href: '/vault' },
  { id: 'mind', label: 'База знаний', icon: FileText, href: '/mind' },
  { id: 'finance', label: 'Финансы', icon: Wallet, href: '/finance' },
  { id: 'ai-core', label: 'AI Ассистент', icon: Bot, href: '/ai-core' },
  { id: 'telegram', label: 'Телеграм', icon: Send, href: '/telegram' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession() || {};
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [indicatorTop, setIndicatorTop] = useState(0);
  const [indicatorVisible, setIndicatorVisible] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Drag & Drop state
  const [libraryItems, setLibraryItems] = useState(defaultLibraryItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  // Calculate indicator position based on active item
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
  }, [pathname, libraryOpen, libraryItems]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== itemId) {
      setDragOverItem(itemId);
    }
  }, [draggedItem]);

  const handleDragLeave = useCallback(() => {
    setDragOverItem(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newItems = [...libraryItems];
    const draggedIndex = newItems.findIndex(item => item.id === draggedItem);
    const targetIndex = newItems.findIndex(item => item.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      setLibraryItems(newItems);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  }, [draggedItem, libraryItems]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverItem(null);
  }, []);

  return (
    <aside 
      className={`sidebar h-screen flex flex-col ${
        collapsed ? 'collapsed w-[72px]' : 'w-[260px]'
      }`}
      style={{ transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="collapse-toggle"
        title={collapsed ? 'Развернуть' : 'Свернуть'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Header */}
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

      {/* Search */}
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

      {/* Navigation container with animated indicator */}
      <div ref={navRef} className="flex-1 overflow-y-auto relative">
        {/* Animated indicator line - Apple Music style */}
        <div 
          className="sidebar-indicator"
          style={{ 
            top: indicatorTop,
            opacity: indicatorVisible ? 1 : 0,
          }}
        />

        {/* Main Navigation */}
        <nav className="sidebar-section">
          {defaultMainItems.map((item) => {
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

        {/* Library Section */}
        <div className="mt-2">
          {!collapsed && (
            <div 
              className="sidebar-section-title flex items-center justify-between cursor-pointer px-4"
              onClick={() => setLibraryOpen(!libraryOpen)}
            >
              <span>Модули</span>
              <div className="flex items-center gap-1">
                <button 
                  className="btn-icon p-1"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Plus size={14} />
                </button>
                {libraryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </div>
          )}
          
          {(libraryOpen || collapsed) && (
            <nav className="sidebar-section">
              {libraryItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                const Icon = item.icon;
                const isDragging = draggedItem === item.id;
                const isDragOver = dragOverItem === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    draggable={!collapsed}
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, item.id)}
                    onDragEnd={handleDragEnd}
                    className={`sidebar-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    {!collapsed && (
                      <GripVertical size={14} className="text-white/20 hover:text-white/40 cursor-grab flex-shrink-0 -ml-1" />
                    )}
                    <Icon size={20} className="sidebar-icon" />
                    {!collapsed && <span className="sidebar-label">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-white/[0.06] p-3">
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
