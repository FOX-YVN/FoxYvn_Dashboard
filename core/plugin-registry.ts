import type { PluginModule } from './types';

const LOG_PREFIX = '[PluginSystem]';

class PluginRegistry {
  private modules = new Map<string, PluginModule>();

  register(module: PluginModule, availableIds?: Set<string>): boolean {
    const id = module.manifest.name;
    if (this.modules.has(id)) {
      console.warn(LOG_PREFIX, `Модуль уже зарегистрирован: ${id}`);
      return false;
    }

    const dependencies = module.manifest.dependencies ?? [];
    const missing = dependencies.filter((dep) => !(availableIds?.has(dep) || this.modules.has(dep)));
    if (missing.length > 0) {
      console.warn(LOG_PREFIX, `Пропущен модуль ${id}: нет зависимостей ${missing.join(', ')}`);
      return false;
    }

    this.modules.set(id, module);
    console.log(LOG_PREFIX, `Зарегистрирован модуль: ${id}`);
    return true;
  }

  unregister(id: string): void {
    if (!this.modules.has(id)) {
      console.warn(LOG_PREFIX, `Не найден модуль для удаления: ${id}`);
      return;
    }

    this.modules.delete(id);
    console.log(LOG_PREFIX, `Удален модуль: ${id}`);
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
