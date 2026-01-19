'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Phone,
  Clock,
  Package,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  address: string;
  phone: string;
  items: string;
  total: number;
  status: 'pending' | 'processing' | 'delivering' | 'completed' | 'cancelled';
  priority: 'normal' | 'high' | 'urgent';
  courier?: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  processing: 'Готовится',
  delivering: 'Доставляется',
  completed: 'Выполнен',
  cancelled: 'Отменён',
};

export default function OpsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // Use mock data
      setOrders([
        {
          id: '1',
          orderNumber: 'YVN-001',
          customer: 'Александр Петров',
          address: 'ул. Абовяна, 12',
          phone: '+374 91 234567',
          items: '2x Пицца, 1x Кола',
          total: 4500,
          status: 'pending',
          priority: 'high',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          orderNumber: 'YVN-002',
          customer: 'Мария Иванова',
          address: 'пр. Маштоца, 45',
          phone: '+374 93 456789',
          items: '1x Бургер, 1x Фри',
          total: 2800,
          status: 'processing',
          priority: 'normal',
          courier: 'Артур',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          orderNumber: 'YVN-003',
          customer: 'Давид Григорян',
          address: 'ул. Туманяна, 8',
          phone: '+374 99 876543',
          items: '3x Суши сет',
          total: 12000,
          status: 'delivering',
          priority: 'normal',
          courier: 'Гагик',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateOrder = () => {
    toast.success('Заказ создан');
    setShowModal(false);
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Операции"
        subtitle="Управление заказами и доставками"
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Новый заказ
          </button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Поиск заказов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'pending', 'processing', 'delivering', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                filter === status
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-text-muted hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'Все' : statusLabels[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-dark-elevated rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Номер</th>
              <th>Клиент</th>
              <th>Адрес</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Курьер</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <span className="font-medium text-white">{order.orderNumber}</span>
                </td>
                <td>
                  <div>
                    <p className="text-white">{order.customer}</p>
                    <p className="text-text-muted text-xs flex items-center gap-1 mt-0.5">
                      <Phone size={10} />
                      {order.phone}
                    </p>
                  </div>
                </td>
                <td>
                  <p className="text-text-secondary flex items-center gap-1">
                    <MapPin size={12} className="text-text-muted" />
                    {order.address}
                  </p>
                </td>
                <td>
                  <span className="font-medium text-white">֏{order.total.toLocaleString()}</span>
                </td>
                <td>
                  <span className={`badge badge-${order.status}`}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td>
                  <span className="text-text-secondary">{order.courier || '—'}</span>
                </td>
                <td>
                  <button className="btn-icon">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-elevated rounded-xl border border-white/[0.08] w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Новый заказ</h2>
              <button onClick={() => setShowModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Клиент</label>
                <input type="text" placeholder="Имя клиента" className="w-full" />
              </div>
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Адрес</label>
                <input type="text" placeholder="Адрес доставки" className="w-full" />
              </div>
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Телефон</label>
                <input type="tel" placeholder="+374" className="w-full" />
              </div>
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Заказ</label>
                <textarea placeholder="Позиции заказа" rows={3} className="w-full" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Отмена
                </button>
                <button onClick={handleCreateOrder} className="btn-primary flex-1">
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
