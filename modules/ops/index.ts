import type { PluginManifest, PluginNavItem, PluginRoute } from '@/core/types';
import { BasePlugin } from '@/core/plugin-interface';
import manifestData from './manifest.json';
import OpsPage from './page';

const manifest = manifestData as PluginManifest;

class OpsPlugin extends BasePlugin {
  constructor() {
    super(manifest);
  }

  getRoutes(): PluginRoute[] {
    return [
      {
        path: this.manifest.route,
        component: OpsPage,
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

export default new OpsPlugin();
