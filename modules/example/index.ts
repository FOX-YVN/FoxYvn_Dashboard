import type { PluginManifest, PluginNavItem, PluginRoute } from '@/core/types';
import { BasePlugin } from '@/core/plugin-interface';
import manifestData from './manifest.json';
import { ExamplePage } from './components/ExamplePage';

const manifest = manifestData as PluginManifest;

class ExamplePlugin extends BasePlugin {
  constructor() {
    super(manifest);
  }

  getRoutes(): PluginRoute[] {
    return [
      {
        path: this.manifest.route,
        component: ExamplePage,
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

export const examplePlugin = new ExamplePlugin();
export default examplePlugin;
