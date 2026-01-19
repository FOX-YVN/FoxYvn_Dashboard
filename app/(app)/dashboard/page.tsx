'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import {
  Package,
  MessageCircle,
  Lock,
  FileText,
  Wallet,
  Bot,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalMessages: number;
  totalDocuments: number;
  walletBalance: number;
}

const moduleCards = [
  {
    id: 'ops',
    title: 'Операции',
    description: 'Управление заказами и доставками',
    icon: Package,
    href: '/ops',
  },
  {
    id: 'comms',
    title: 'Сообщения',
    description: 'Telegram интеграция',
    icon: MessageCircle,
    href: '/comms',
  },
  {
    id: 'vault',
    title: 'Хранилище',
    description: 'Зашифрованные файлы',
    icon: Lock,
    href: '/vault',
  },
  {
    id: 'mind',
    title: 'База знаний',
    description: 'Документация и гайды',
    icon: FileText,
    href: '/mind',
  },
  {
    id: 'finance',
    title: 'Финансы',
    description: 'Dash кошелёк',
    icon: Wallet,
    href: '/finance',
  },
  {
    id: 'ai-core',
    title: 'AI Ассистент',
    description: 'Искусственный интеллект',
    icon: Bot,
    href: '/ai-core',
  },
];

export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalMessages: 0,
    totalDocuments: 0,
    walletBalance: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate fetching stats
    setStats({
      totalOrders: 156,
      pendingOrders: 12,
      completedOrders: 144,
      totalMessages: 2847,
      totalDocuments: 89,
      walletBalance: 45230,
    });
  }, []);

  if (!mounted) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`${greeting()}, ${session?.user?.name?.split(' ')[0] || 'User'}`}
        subtitle="Вот что происходит сегодня"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard
          title="Всего заказов"
          value={stats.totalOrders}
          icon={Package}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="В ожидании"
          value={stats.pendingOrders}
          icon={Clock}
        />
        <StatCard
          title="Выполнено"
          value={stats.completedOrders}
          icon={CheckCircle2}
        />
        <StatCard
          title="Сообщений"
          value={stats.totalMessages}
          icon={MessageCircle}
        />
      </div>

      {/* Modules Section */}
      <div className="mb-6">
        <h2 className="section-title">Модули</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {moduleCards.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.id} href={module.href}>
              <div className="module-card group">
                <Icon size={20} className="text-white/50 mb-4" />
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-medium text-white mb-1">{module.title}</h3>
                    <p className="text-[13px] text-white/50">{module.description}</p>
                  </div>
                  <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
