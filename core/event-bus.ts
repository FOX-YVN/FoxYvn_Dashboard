import type { PluginEvent } from './types';

const LOG_PREFIX = '[EventBus]';
const MAX_HISTORY = 100;

export interface PluginEvents {
  'order.created': { orderId: string; amount: number; customerId: string };
  'order.updated': { orderId: string; status: string };
  'order.deleted': { orderId: string };
  'payment.received': { orderId: string; amount: number; method: string };
  'notification.send': { type: 'sms' | 'email' | 'push'; to: string; message: string };
  'finance.transaction': { type: 'income' | 'expense'; amount: number; category: string };
}

type EventHandler = (event: PluginEvent) => void | Promise<void>;
type HandlerMap = Map<EventHandler, string | undefined>;

function matchEvent(pattern: string, eventType: string): boolean {
  if (pattern === '*') return true;
  if (!pattern.includes('*')) return pattern === eventType;
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  const matcher = new RegExp(`^${escaped}$`);
  return matcher.test(eventType);
}

export class EventBus {
  private handlers = new Map<string, HandlerMap>();
  private subscriberIndex = new Map<string, Array<{ pattern: string; handler: EventHandler }>>();
  private history: PluginEvent[] = [];

  subscribe(pattern: string, handler: EventHandler, subscriberId?: string): () => void {
    if (!this.handlers.has(pattern)) {
      this.handlers.set(pattern, new Map());
    }

    this.handlers.get(pattern)?.set(handler, subscriberId);
    if (subscriberId) {
      const entries = this.subscriberIndex.get(subscriberId) ?? [];
      entries.push({ pattern, handler });
      this.subscriberIndex.set(subscriberId, entries);
    }

    return () => this.unsubscribe(pattern, handler);
  }

  unsubscribe(pattern: string, handler: EventHandler): void {
    const handlers = this.handlers.get(pattern);
    if (!handlers) return;
    const subscriberId = handlers.get(handler);
    handlers.delete(handler);

    if (subscriberId) {
      const entries = this.subscriberIndex.get(subscriberId) ?? [];
      this.subscriberIndex.set(
        subscriberId,
        entries.filter((entry) => entry.pattern !== pattern || entry.handler !== handler),
      );
    }
  }

  unsubscribeAll(subscriberId: string): void {
    const entries = this.subscriberIndex.get(subscriberId) ?? [];
    entries.forEach(({ pattern, handler }) => {
      this.handlers.get(pattern)?.delete(handler);
    });
    this.subscriberIndex.delete(subscriberId);
  }

  getEventHistory(limit = 10): PluginEvent[] {
    return this.history.slice(-limit);
  }

  clearHistory(): void {
    this.history = [];
  }

  async publish(event: PluginEvent, timeoutMs = 5000): Promise<void> {
    this.history.push(event);
    if (this.history.length > MAX_HISTORY) {
      this.history.splice(0, this.history.length - MAX_HISTORY);
    }

    console.log(LOG_PREFIX, `Published: ${event.type} from ${event.source}`);

    const matchedHandlers: Array<{
      handler: EventHandler;
      subscriberId?: string;
    }> = [];

    for (const [pattern, handlers] of this.handlers.entries()) {
      if (!matchEvent(pattern, event.type)) continue;
      handlers.forEach((subscriberId, handler) => {
        matchedHandlers.push({ handler, subscriberId });
      });
    }

    console.log(
      LOG_PREFIX,
      `Delivered to ${matchedHandlers.length} subscribers:`,
      matchedHandlers.map((entry) => entry.subscriberId ?? 'anonymous').join(', '),
    );

    const tasks = matchedHandlers.map(({ handler, subscriberId }) => {
      const startedAt = Date.now();

      return Promise.race([
        Promise.resolve(handler(event)),
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeoutMs),
        ),
      ])
        .then(() => {
          console.log(
            LOG_PREFIX,
            `Handler ${subscriberId ?? 'anonymous'} completed in ${Date.now() - startedAt}ms`,
          );
        })
        .catch((error) => {
          console.warn(
            LOG_PREFIX,
            `Handler ${subscriberId ?? 'anonymous'} failed for ${event.type}`,
            error,
          );
        });
    });

    await Promise.all(tasks);
  }

  publishTyped<T extends keyof PluginEvents & string>(
    type: T,
    payload: PluginEvents[T],
    source = 'system',
  ): Promise<void> {
    return this.publish({ type, payload, source, timestamp: Date.now() });
  }
}

export const pluginEventBus = new EventBus();
