import { usePluginContext } from '@/components/plugin-provider';

export function usePlugins() {
  return usePluginContext();
}
