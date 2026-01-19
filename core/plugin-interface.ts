import type { PluginManifest, PluginModule, PluginNavItem, PluginRoute } from './types';

export abstract class BasePlugin implements PluginModule {
  manifest: PluginManifest;

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
  }

  async initialize(): Promise<void> {
    // Базовая инициализация по умолчанию
  }

  async activate(): Promise<void> {
    // Активация модуля по умолчанию
  }

  async deactivate(): Promise<void> {
    // Деактивация модуля по умолчанию
  }

  getRoutes(): PluginRoute[] {
    return [];
  }

  getNavItems(): PluginNavItem[] {
    return [];
  }

  async onInstall(): Promise<void> {
    // Хук установки модуля
  }

  async onUninstall(): Promise<void> {
    // Хук удаления модуля
  }

  async onUpdate(): Promise<void> {
    // Хук обновления модуля
  }
}
