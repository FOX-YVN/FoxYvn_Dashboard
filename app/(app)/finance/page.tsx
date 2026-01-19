'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Send,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  QrCode,
  RefreshCw,
  Clock,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  address: string;
  status: 'pending' | 'confirmed';
  date: string;
  confirmations: number;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'receive', amount: 0.5, address: 'XpLq...8kNm', status: 'confirmed', date: '14:32', confirmations: 6 },
  { id: '2', type: 'send', amount: 0.15, address: 'XrTw...2jKp', status: 'confirmed', date: '12:15', confirmations: 12 },
  { id: '3', type: 'receive', amount: 1.2, address: 'XmNb...9qWe', status: 'pending', date: '10:45', confirmations: 2 },
  { id: '4', type: 'send', amount: 0.08, address: 'XvCx...4hLa', status: 'confirmed', date: 'Вчера', confirmations: 156 },
];

export default function FinancePage() {
  const [balance] = useState(2.847);
  const [usdRate] = useState(28.45);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const walletAddress = 'XpLq7Kx9mNwR4tYbVcE2sHfJ8kNmQwZa';

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Адрес скопирован');
  };

  const handleSend = () => {
    toast.success('Транзакция отправлена');
    setShowSendModal(false);
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Финансы" subtitle="Dash кошелёк" />

      {/* Balance Card */}
      <div className="bg-dark-elevated rounded-xl border border-white/[0.08] p-8 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] text-text-muted mb-2">Баланс</p>
            <div className="flex items-baseline gap-3">
              <span className="text-[48px] font-semibold text-white tracking-tight">{balance.toFixed(3)}</span>
              <span className="text-[20px] text-text-muted">DASH</span>
            </div>
            <p className="text-[15px] text-text-muted mt-2">≈ ${(balance * usdRate).toFixed(2)} USD</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowSendModal(true)} className="btn-primary flex items-center gap-2">
              <Send size={16} />
              Отправить
            </button>
            <button onClick={() => setShowReceiveModal(true)} className="btn-secondary flex items-center gap-2">
              <Download size={16} />
              Получить
            </button>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">Адрес кошелька</p>
          <div className="flex items-center gap-3">
            <code className="text-[14px] text-white font-mono">{walletAddress}</code>
            <button onClick={copyAddress} className="btn-icon">
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">История транзакций</h2>
          <button className="btn-icon">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="bg-dark-elevated rounded-xl border border-white/[0.08] overflow-hidden">
          {transactions.map((tx, idx) => (
            <div
              key={tx.id}
              className={`flex items-center gap-4 px-6 py-4 ${idx !== transactions.length - 1 ? 'border-b border-white/[0.08]' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'receive' ? 'bg-white/[0.06]' : 'bg-white/[0.06]'
              }`}>
                {tx.type === 'receive' ? (
                  <ArrowDownLeft size={18} className="text-[#30D158]" />
                ) : (
                  <ArrowUpRight size={18} className="text-white/70" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-white">
                  {tx.type === 'receive' ? 'Получено' : 'Отправлено'}
                </p>
                <p className="text-[12px] text-text-muted font-mono">{tx.address}</p>
              </div>
              <div className="text-right">
                <p className={`text-[14px] font-medium ${
                  tx.type === 'receive' ? 'text-[#30D158]' : 'text-white'
                }`}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.amount} DASH
                </p>
                <p className="text-[11px] text-text-muted flex items-center gap-1 justify-end">
                  <Clock size={10} />
                  {tx.date}
                  {tx.status === 'pending' && (
                    <span className="ml-1 text-white/50">(ожидается)</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-elevated rounded-xl border border-white/[0.08] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Отправить DASH</h2>
              <button onClick={() => setShowSendModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Адрес получателя</label>
                <input type="text" placeholder="X..." className="w-full font-mono" />
              </div>
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Сумма</label>
                <div className="relative">
                  <input type="number" placeholder="0.00" step="0.001" className="w-full pr-20" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">DASH</span>
                </div>
                <p className="text-[11px] text-text-muted mt-1">Доступно: {balance} DASH</p>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowSendModal(false)} className="btn-secondary flex-1">
                  Отмена
                </button>
                <button onClick={handleSend} className="btn-primary flex-1">
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-elevated rounded-xl border border-white/[0.08] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Получить DASH</h2>
              <button onClick={() => setShowReceiveModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-4">
                <QrCode size={120} className="text-black" />
              </div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">Ваш адрес</p>
              <code className="text-[13px] text-white font-mono break-all">{walletAddress}</code>
              <button onClick={copyAddress} className="btn-secondary w-full mt-4">
                <Copy size={14} className="mr-2" />
                Скопировать адрес
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
