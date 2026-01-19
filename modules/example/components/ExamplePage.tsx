import { toast } from 'react-hot-toast';
import { useEventBus } from '@/hooks/use-event-bus';

export function ExamplePage() {
  const { publish } = useEventBus();

  const createTestOrder = () => {
    const orderId = `ORD-${Date.now()}`;
    publish('order.created', {
      orderId,
      amount: 1500,
      customerId: 'test-customer',
    });
    toast.success('Событие order.created отправлено!');
  };

  const simulatePayment = () => {
    const orderId = `ORD-${Date.now()}`;
    publish('payment.received', {
      orderId,
      amount: 1500,
      method: 'card',
    });
    toast.success('Событие payment.received отправлено!');
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Пример модуля</h1>
        <p className="text-sm text-white/60">
          Это демонстрационная страница для проверки подключения плагинов.
        </p>
      </header>

      <section className="glass-medium rounded-xl p-6">
        <p className="text-sm text-white/70">
          Здесь можно размещать виджеты, панели управления и любые данные модуля.
        </p>
      </section>

      <section className="glass-medium rounded-xl p-6 space-y-3">
        <p className="text-sm text-white/70">Тест событий:</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={createTestOrder} className="btn-primary">
            Создать тестовый заказ
          </button>
          <button onClick={simulatePayment} className="btn-secondary">
            Симулировать оплату
          </button>
        </div>
      </section>
    </div>
  );
}
