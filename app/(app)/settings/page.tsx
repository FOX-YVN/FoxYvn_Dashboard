'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, HardDrive } from 'lucide-react';

// Компонент заголовка страницы
function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      {subtitle && <p className="text-[14px] text-text-muted mt-1">{subtitle}</p>}
    </div>
  );
}

// Секция настроек
function SettingsSection({ 
  icon: Icon, 
  title, 
  description, 
  children 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="stat-card mb-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-white/70" />
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-medium text-white mb-1">{title}</h3>
          <p className="text-[13px] text-text-muted">{description}</p>
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader 
        title="Настройки" 
        subtitle="Управление аккаунтом и системой" 
      />

      {/* Профиль */}
      <SettingsSection
        icon={User}
        title="Профиль"
        description="Управление данными аккаунта"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-[12px] text-text-muted mb-1">Имя</label>
            <input 
              type="text" 
              defaultValue="John Doe" 
              className="w-full max-w-xs"
            />
          </div>
          <div>
            <label className="block text-[12px] text-text-muted mb-1">Email</label>
            <input 
              type="email" 
              defaultValue="john@doe.com" 
              className="w-full max-w-xs"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Уведомления */}
      <SettingsSection
        icon={Bell}
        title="Уведомления"
        description="Настройка оповещений системы"
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <span className="text-[13px] text-white">Включить уведомления</span>
        </label>
      </SettingsSection>

      {/* Безопасность */}
      <SettingsSection
        icon={Shield}
        title="Безопасность"
        description="Пароль и двухфакторная аутентификация"
      >
        <button className="btn-secondary text-[13px] px-4 py-2">
          Сменить пароль
        </button>
      </SettingsSection>

      {/* Внешний вид */}
      <SettingsSection
        icon={Palette}
        title="Внешний вид"
        description="Тема и настройки интерфейса"
      >
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg bg-white/10 text-[13px] text-white">
            Тёмная
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[13px] text-text-muted">
            Светлая
          </button>
        </div>
      </SettingsSection>

      {/* Язык */}
      <SettingsSection
        icon={Globe}
        title="Язык"
        description="Язык интерфейса"
      >
        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[13px] text-white">
          <option value="ru">Русский</option>
          <option value="en">English</option>
          <option value="hy">Հայերdelays</option>
        </select>
      </SettingsSection>

      {/* Хранилище */}
      <SettingsSection
        icon={HardDrive}
        title="Хранилище"
        description="Использование дискового пространства"
      >
        <div className="w-full max-w-xs">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-[23%] bg-accent rounded-full" />
          </div>
          <p className="text-[12px] text-text-muted mt-2">2.3 GB из 10 GB использовано</p>
        </div>
      </SettingsSection>
    </div>
  );
}
