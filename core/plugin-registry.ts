import type { PluginModule } from './types';
import { logger } from '@/lib/logger';

const LOG_PREFIX = '[PluginSystem]';

class PluginRegistry {
  private modules = new Map<string, PluginModule>();

  register(module: PluginModule, availableIds?: Set<string>): boolean {
    const id = module.manifest.name;
    if (this.modules.has(id)) {
      logger.warn(LOG_PREFIX, `Модуль уже зарегистрирован: ${id}`);
      return false;
    }

    const dependencies = module.manifest.dependencies ?? [];
    const missing = dependencies.filter((dep) => !(availableIds?.has(dep) || this.modules.has(dep)));
    if (missing.length > 0) {
      logger.warn(LOG_PREFIX, `Пропущен модуль ${id}: нет зависимостей ${missing.join(', ')}`);
      return false;
    }

    this.modules.set(id, module);
    logger.info(LOG_PREFIX, `Зарегистрирован модуль: ${id}`);
    return true;
  }

  unregister(id: string): void {
    if (!this.modules.has(id)) {
      logger.warn(LOG_PREFIX, `Не найден модуль для удаления: ${id}`);
      return;
    }

    this.modules.delete(id);
    logger.info(LOG_PREFIX, `Удален модуль: ${id}`);
  }

  get(id: string): PluginModule | undefined {
    return this.modules.get(id);
  }

  getAll(): PluginModule[] {
    return Array.from(this.modules.values());
  }

  getEnabled(): PluginModule[] {
    return this.getAll().filter((module) => module.manifest.enabled);
  }
}

export const pluginRegistry = new PluginRegistry();
