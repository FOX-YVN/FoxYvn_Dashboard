import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import type { PluginClientSnapshot, PluginManifest, PluginModule, PluginNavItem } from './types';
import { pluginRegistry } from './plugin-registry';
import { logger } from '@/lib/logger';

const LOG_PREFIX = '[PluginSystem]';

const manifestSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string(),
  icon: z.string().min(1),
  route: z.string().min(1),
  version: z.string().min(1),
  enabled: z.boolean(),
  order: z.number().int().optional(),
  dependencies: z.array(z.string()),
  permissions: z.array(z.string()),
});

const { promises: fsPromises } = fs;
const modulesDir = path.join(process.cwd(), 'modules');
let cachedModules: PluginModule[] | null = null;
let cacheDirty = true;
let watcherReady = false;

function logError(message: string, error: unknown): void {
  logger.error(LOG_PREFIX, message, error instanceof Error ? error.message : error);
}

function isPluginModule(value: unknown): value is PluginModule {
  if (!value || typeof value !== 'object') return false;
  const module = value as PluginModule;
  return (
    typeof module.initialize === 'function' &&
    typeof module.activate === 'function' &&
    typeof module.deactivate === 'function' &&
    typeof module.getRoutes === 'function' &&
    typeof module.getNavItems === 'function' &&
    !!module.manifest
  );
}

async function ensureWatcher(): Promise<void> {
  if (watcherReady || process.env.NODE_ENV === 'production') return;
  watcherReady = true;

  try {
    const watcher = fs.watch(modulesDir, { recursive: true });
    watcher.on('change', () => {
      cacheDirty = true;
      logger.info(LOG_PREFIX, 'Изменения в модулях: кэш сброшен');
    });
  } catch (error) {
    logger.warn(LOG_PREFIX, 'Не удалось включить hot-reload модулей', error);
  }
}

async function readManifest(moduleName: string): Promise<PluginManifest | null> {
  const manifestPath = path.join(modulesDir, moduleName, 'manifest.json');

  try {
    const raw = await fsPromises.readFile(manifestPath, 'utf-8');
    const data = JSON.parse(raw) as unknown;
    return manifestSchema.parse(data);
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;
    if (typedError.code === 'ENOENT') {
      return null;
    }

    logError(`Ошибка чтения manifest.json для ${moduleName}`, error);
    return null;
  }
}

async function importPlugin(moduleName: string): Promise<PluginModule | null> {
  if (
    moduleName.includes('..') ||
    moduleName.includes('/') ||
    moduleName.includes('\\')
  ) {
    logger.warn(
      LOG_PREFIX,
      'Invalid module name (path traversal attempt):',
      moduleName,
    );
    return null;
  }

  if (!/^[a-z0-9-_]+$/i.test(moduleName)) {
    logger.warn(
      LOG_PREFIX,
      'Invalid module name (invalid characters):',
      moduleName,
    );
    return null;
  }

  try {
    const modulePath = `@/modules/${moduleName}`;
    const imported = (await import(modulePath)) as Record<string, unknown>;
    const candidate =
      imported.default ??
      imported.plugin ??
      Object.values(imported).find((value) => isPluginModule(value));

    if (!isPluginModule(candidate)) {
      logger.warn(LOG_PREFIX, `Модуль ${moduleName} не соответствует интерфейсу PluginModule`);
      return null;
    }

    return candidate;
  } catch (error) {
    logError(`Ошибка импорта модуля ${moduleName}`, error);
    return null;
  }
}

async function buildModules(): Promise<PluginModule[]> {
  await ensureWatcher();

  try {
    const entries = await fsPromises.readdir(modulesDir, { withFileTypes: true });
    const moduleNames = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    const availableIds = new Set(moduleNames);
    const loaded: PluginModule[] = [];

    for (const moduleName of moduleNames) {
      const manifest = await readManifest(moduleName);
      if (!manifest || !manifest.enabled) {
        continue;
      }

      const pluginModule = await importPlugin(moduleName);
      if (!pluginModule) {
        continue;
      }

      pluginModule.manifest = manifest;

      if (!pluginRegistry.register(pluginModule, availableIds)) {
        continue;
      }

      try {
        await pluginModule.initialize();
        await pluginModule.activate();
      } catch (error) {
        logError(`Ошибка запуска модуля ${moduleName}`, error);
        continue;
      }

      loaded.push(pluginModule);
    }

    return loaded;
  } catch (error) {
    logError('Ошибка сканирования папки modules', error);
    return [];
  }
}

export async function loadPlugins(): Promise<PluginModule[]> {
  if (cachedModules && !cacheDirty) {
    return cachedModules;
  }

  cacheDirty = false;
  cachedModules = await buildModules();
  return cachedModules;
}

export async function getPluginByName(name: string): Promise<PluginModule | null> {
  const modules = await loadPlugins();
  return modules.find((module) => module.manifest.name === name) ?? null;
}

export async function getPluginClientSnapshot(): Promise<PluginClientSnapshot> {
  const modules = await loadPlugins();
  const manifests = modules.map((module) => module.manifest);
  const navItems: PluginNavItem[] = modules.flatMap((module) => {
    try {
      return module.getNavItems();
    } catch (error) {
      logError(`Ошибка получения navItems для ${module.manifest.name}`, error);
      return [];
    }
  });

  return { manifests, navItems };
}
