'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <Icon size={20} className="text-white/50" />
        {trend && (
          <span className={`text-xs font-medium ${trend.isPositive ? 'text-[#30D158]' : 'text-[#FF453A]'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{title}</p>
    </div>
  );
}
