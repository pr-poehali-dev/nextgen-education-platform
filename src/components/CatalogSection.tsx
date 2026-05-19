import Icon from "@/components/ui/icon";

const cars = [
  {
    brand: "Toyota",
    model: "Camry",
    year: 2021,
    price: "1 850 000 ₽",
    mileage: "45 000 км",
    body: "Седан",
    fuel: "Бензин",
    tag: "Популярный",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    brand: "Hyundai",
    model: "Tucson",
    year: 2022,
    price: "2 390 000 ₽",
    mileage: "28 000 км",
    body: "Кроссовер",
    fuel: "Бензин",
    tag: "Новинка",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    brand: "BMW",
    model: "3 Series",
    year: 2020,
    price: "3 100 000 ₽",
    mileage: "62 000 км",
    body: "Седан",
    fuel: "Бензин",
    tag: "Премиум",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    brand: "Kia",
    model: "Sportage",
    year: 2023,
    price: "2 750 000 ₽",
    mileage: "12 000 км",
    body: "Кроссовер",
    fuel: "Дизель",
    tag: "Выгодно",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    brand: "Volkswagen",
    model: "Polo",
    year: 2021,
    price: "1 150 000 ₽",
    mileage: "38 000 км",
    body: "Седан",
    fuel: "Бензин",
    tag: "Бюджет",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    brand: "Mercedes-Benz",
    model: "GLC",
    year: 2022,
    price: "4 900 000 ₽",
    mileage: "19 000 км",
    body: "Кроссовер",
    fuel: "Бензин",
    tag: "Премиум",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
];

export function CatalogSection() {
  return (
    <section id="catalog" className="py-24 md:py-36 relative z-10">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              Каталог
            </p>
            <h2 className="text-4xl md:text-5xl font-sentient">
              Актуальные <i className="font-light">предложения</i>
            </h2>
          </div>
          <p className="font-mono text-xs text-foreground/40 md:text-right">
            Обновлено сегодня · 4 821 объявление
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cars.map((car) => (
            <div
              key={`${car.brand}-${car.model}`}
              className="group border border-border rounded-lg p-6 hover:border-foreground/30 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-1">
                    {car.brand}
                  </p>
                  <h3 className="text-xl font-sentient">{car.model}</h3>
                </div>
                <span
                  className={`font-mono text-xs px-2 py-1 border rounded ${car.color}`}
                >
                  {car.tag}
                </span>
              </div>

              <div className="aspect-video bg-white/5 rounded mb-4 flex items-center justify-center">
                <Icon name="CarFront" size={48} className="text-foreground/20 group-hover:text-foreground/40 transition-colors duration-300" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <p className="font-mono text-xs text-foreground/30 mb-0.5">Год</p>
                  <p className="font-mono text-sm">{car.year}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-foreground/30 mb-0.5">Пробег</p>
                  <p className="font-mono text-sm">{car.mileage}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-foreground/30 mb-0.5">Кузов</p>
                  <p className="font-mono text-sm">{car.body}</p>
                </div>
                <div>
                  <p className="font-mono text-xs text-foreground/30 mb-0.5">Топливо</p>
                  <p className="font-mono text-sm">{car.fuel}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-lg font-sentient">{car.price}</p>
                <span className="font-mono text-xs text-foreground/40 group-hover:text-primary transition-colors duration-150 flex items-center gap-1">
                  Подробнее <Icon name="ArrowRight" size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="font-mono text-sm text-foreground/40 hover:text-foreground transition-colors duration-150 border border-border px-6 py-3 rounded hover:border-foreground/40">
            Показать все объявления
          </button>
        </div>
      </div>
    </section>
  );
}
