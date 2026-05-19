import Icon from "@/components/ui/icon";

const features = [
  {
    icon: "Zap",
    title: "Быстрый результат",
    description: "Подборка готова за 30 секунд. Никакого ручного скролла — только релевантные предложения.",
  },
  {
    icon: "ShieldCheck",
    title: "Проверенные объявления",
    description: "Фильтруем дубликаты, подозрительные цены и неполные объявления автоматически.",
  },
  {
    icon: "TrendingDown",
    title: "Выгодные цены",
    description: "Алгоритм сравнивает цену с рыночной и подсвечивает выгодные предложения.",
  },
  {
    icon: "RefreshCw",
    title: "Живые данные",
    description: "База обновляется каждый час — вы всегда видите актуальные объявления.",
  },
  {
    icon: "Smartphone",
    title: "Удобно с телефона",
    description: "Интерфейс адаптирован для мобильных — ищите авто где угодно.",
  },
  {
    icon: "MessageCircle",
    title: "Прямой контакт",
    description: "Связывайтесь с продавцом напрямую — без посредников и лишних звонков.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-36 relative z-10">
      <div className="container">
        <div className="text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            Преимущества
          </p>
          <h2 className="text-4xl md:text-5xl font-sentient">
            Почему <i className="font-light">AutoFi</i>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group border border-border rounded-lg p-6 hover:border-foreground/30 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded border border-border flex items-center justify-center mb-4 group-hover:border-primary transition-colors duration-300">
                <Icon name={f.icon as "Zap"} size={18} className="text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 border border-border rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-mono text-xs uppercase tracking-widest text-foreground/40 mb-2">Статистика</p>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 mt-4">
              {[
                { value: "4 800+", label: "объявлений ежедневно" },
                { value: "30 сек", label: "время подборки" },
                { value: "93%", label: "пользователей находят авто" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-sentient text-primary">{stat.value}</p>
                  <p className="font-mono text-xs text-foreground/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
