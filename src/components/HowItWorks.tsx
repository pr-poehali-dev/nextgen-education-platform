import Icon from "@/components/ui/icon";

const steps = [
  {
    number: "01",
    icon: "SlidersHorizontal",
    title: "Укажите параметры",
    description:
      "Выберите марку, бюджет, тип кузова и пробег. Займёт не больше минуты.",
  },
  {
    number: "02",
    icon: "Sparkles",
    title: "Получите подборку",
    description:
      "Алгоритм анализирует тысячи объявлений и отбирает только подходящие варианты.",
  },
  {
    number: "03",
    icon: "CarFront",
    title: "Выбирайте и покупайте",
    description:
      "Сравните отфильтрованные предложения и свяжитесь с продавцом напрямую.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 md:py-36 relative z-10">
      <div className="container">
        <div className="text-center mb-16">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            Процесс
          </p>
          <h2 className="text-4xl md:text-5xl font-sentient">
            Как это <i className="font-light">работает</i>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-3rem)] h-px bg-border" />
              )}
              <div className="flex flex-col items-start md:items-center md:text-center gap-4">
                <div className="flex items-center gap-4 md:flex-col md:gap-3">
                  <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                    <Icon name={step.icon as "SlidersHorizontal"} size={22} className="text-primary" />
                  </div>
                  <span className="font-mono text-xs text-foreground/30">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="font-mono text-sm text-foreground/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
