import type { ComponentType } from 'react';

export interface PluginManifest {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  route: string;
  version: string;
  enabled: boolean;
  order?: number;
  dependencies: string[];
  permissions: string[];
}

export interface PluginRoute {
  path: string;
  component: ComponentType;
}

export interface PluginNavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  order?: number;
}

export interface PluginModule {
  manifest: PluginManifest;
  initialize: () => void | Promise<void>;
  activate: () => void | Promise<void>;
  deactivate: () => void | Promise<void>;
  getRoutes: () => PluginRoute[];
  getNavItems: () => PluginNavItem[];
}

export interface PluginEvent {
  type: string;
  payload: unknown;
  source: string;
  timestamp: number;
}

export type PluginConfig = Record<string, unknown>;

export interface PluginClientSnapshot {
  manifests: PluginManifest[];
  navItems: PluginNavItem[];
}
