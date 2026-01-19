import type { PluginManifest, PluginNavItem, PluginRoute } from '@/core/types';
import { BasePlugin } from '@/core/plugin-interface';
import manifestData from './manifest.json';
import VaultPage from './page';

const manifest = manifestData as PluginManifest;

class VaultPlugin extends BasePlugin {
  constructor() {
    super(manifest);
  }

  getRoutes(): PluginRoute[] {
    return [
      {
        path: this.manifest.route,
        component: VaultPage,
      },
    ];
  }

  getNavItems(): PluginNavItem[] {
    return [
      {
        id: this.manifest.name,
        label: this.manifest.displayName,
        href: this.manifest.route,
        icon: this.manifest.icon,
      },
    ];
  }
}

export default new VaultPlugin();
