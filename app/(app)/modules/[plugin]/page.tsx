import { getPluginByName } from '@/core/plugin-loader';
import { PermissionGuard } from '@/components/permission-guard';

const LOG_PREFIX = '[PluginSystem]';

export const dynamic = 'force-dynamic';

export default async function PluginPage({
  params,
}: {
  params: { plugin: string };
}) {
  const plugin = await getPluginByName(params.plugin);

  if (!plugin) {
    return (
      <div className="glass-medium rounded-xl p-6">
        <h1 className="text-lg font-semibold text-white">Модуль не найден</h1>
        <p className="text-sm text-white/60">
          Проверьте, что модуль установлен и его manifest.json корректен.
        </p>
      </div>
    );
  }

  try {
    const routes = plugin.getRoutes();
    const matchedRoute =
      routes.find((route) => route.path === plugin.manifest.route) ?? routes[0];

    if (!matchedRoute) {
      return (
        <div className="glass-medium rounded-xl p-6">
          <h1 className="text-lg font-semibold text-white">Нет страницы модуля</h1>
          <p className="text-sm text-white/60">
            Добавьте маршрут через getRoutes() в модуле.
          </p>
        </div>
      );
    }

    const PageComponent = matchedRoute.component;
    const requiredPermissions = plugin.manifest.permissions ?? [];
    return (
      <PermissionGuard required={requiredPermissions}>
        <PageComponent />
      </PermissionGuard>
    );
  } catch (error) {
    console.error(LOG_PREFIX, `Ошибка рендера модуля ${plugin.manifest.name}`, error);
    return (
      <div className="glass-medium rounded-xl p-6">
        <h1 className="text-lg font-semibold text-white">Ошибка модуля</h1>
        <p className="text-sm text-white/60">
          Модуль не удалось отрендерить, проверьте консоль.
        </p>
      </div>
    );
  }
}
