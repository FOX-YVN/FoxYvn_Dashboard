export function ExamplePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Пример модуля</h1>
        <p className="text-sm text-white/60">
          Это демонстрационная страница для проверки подключения плагинов.
        </p>
      </header>

      <section className="glass-medium rounded-xl p-6">
        <p className="text-sm text-white/70">
          Здесь можно размещать виджеты, панели управления и любые данные модуля.
        </p>
      </section>
    </div>
  );
}
