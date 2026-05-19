import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const SEARCH_URL = "https://functions.poehali.dev/1713d9a4-e7d5-4441-987c-652c33f0aef4";

interface Car {
  id: number;
  external_id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  price_formatted: string;
  mileage: number;
  mileage_formatted: string;
  body_type: string;
  fuel_type: string;
  image_url: string;
  url: string;
  city: string;
}

interface CatalogSectionProps {
  filters?: { brand: string; body: string; budget: string; mileage: string };
  onLoadingChange?: (loading: boolean) => void;
}

const MOCK_CARS: Car[] = [
  { id: 1, external_id: "1", brand: "Toyota", model: "Camry", year: 2021, price: 1850000, price_formatted: "1 850 000 ₽", mileage: 45000, mileage_formatted: "45 000 км", body_type: "Седан", fuel_type: "Бензин", image_url: "", url: "#", city: "Москва" },
  { id: 2, external_id: "2", brand: "Hyundai", model: "Tucson", year: 2022, price: 2390000, price_formatted: "2 390 000 ₽", mileage: 28000, mileage_formatted: "28 000 км", body_type: "Кроссовер", fuel_type: "Бензин", image_url: "", url: "#", city: "Санкт-Петербург" },
  { id: 3, external_id: "3", brand: "BMW", model: "3 Series", year: 2020, price: 3100000, price_formatted: "3 100 000 ₽", mileage: 62000, mileage_formatted: "62 000 км", body_type: "Седан", fuel_type: "Бензин", image_url: "", url: "#", city: "Казань" },
  { id: 4, external_id: "4", brand: "Kia", model: "Sportage", year: 2023, price: 2750000, price_formatted: "2 750 000 ₽", mileage: 12000, mileage_formatted: "12 000 км", body_type: "Кроссовер", fuel_type: "Дизель", image_url: "", url: "#", city: "Новосибирск" },
  { id: 5, external_id: "5", brand: "Volkswagen", model: "Polo", year: 2021, price: 1150000, price_formatted: "1 150 000 ₽", mileage: 38000, mileage_formatted: "38 000 км", body_type: "Седан", fuel_type: "Бензин", image_url: "", url: "#", city: "Екатеринбург" },
  { id: 6, external_id: "6", brand: "Mercedes-Benz", model: "GLC", year: 2022, price: 4900000, price_formatted: "4 900 000 ₽", mileage: 19000, mileage_formatted: "19 000 км", body_type: "Кроссовер", fuel_type: "Бензин", image_url: "", url: "#", city: "Москва" },
];

export function CatalogSection({ filters, onLoadingChange }: CatalogSectionProps) {
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [total, setTotal] = useState(MOCK_CARS.length);
  const [loading, setLoading] = useState(false);
  const [fromApi, setFromApi] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchCars = async (f: typeof filters, p = 1) => {
    setLoading(true);
    onLoadingChange?.(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "12" });
      if (f?.brand && f.brand !== "Любая") params.set("brand", f.brand);
      if (f?.body && f.body !== "Любой") params.set("body_type", f.body);
      if (f?.budget) params.set("budget", f.budget);
      if (f?.mileage) params.set("mileage", f.mileage);

      const res = await fetch(`${SEARCH_URL}?${params.toString()}`);
      const data = await res.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      if (parsed.cars && parsed.cars.length > 0) {
        setCars(parsed.cars);
        setTotal(parsed.total);
        setPage(parsed.page);
        setPages(parsed.pages);
        setFromApi(true);
      } else if (parsed.cars && parsed.cars.length === 0 && f) {
        setCars([]);
        setTotal(0);
        setFromApi(true);
      }
    } catch {
      // fallback to mock
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  useEffect(() => {
    if (filters) {
      setPage(1);
      fetchCars(filters, 1);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars(undefined, 1);
  }, []);

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
            {loading ? "Загружаем..." : `Найдено · ${total} объявлений`}
            {fromApi && !loading && (
              <span className="block text-primary/60">данные с Авто.ру</span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded mb-3 w-1/2" />
                <div className="h-6 bg-white/5 rounded mb-4 w-3/4" />
                <div className="aspect-video bg-white/5 rounded mb-4" />
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-8 bg-white/5 rounded" />
                  ))}
                </div>
                <div className="h-8 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 border border-border rounded-lg">
            <Icon name="SearchX" size={48} className="text-foreground/20 mx-auto mb-4" />
            <p className="font-mono text-sm text-foreground/40">По вашим фильтрам ничего не найдено</p>
            <p className="font-mono text-xs text-foreground/20 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cars.map((car) => (
              <a
                key={car.id}
                href={car.url !== "#" ? car.url : undefined}
                target={car.url !== "#" ? "_blank" : undefined}
                rel="noreferrer"
                className="group border border-border rounded-lg p-6 hover:border-foreground/30 transition-colors duration-300 cursor-pointer block no-underline"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs text-foreground/40 uppercase tracking-widest mb-1">
                      {car.brand}
                    </p>
                    <h3 className="text-xl font-sentient text-foreground">{car.model}</h3>
                  </div>
                  {car.city && (
                    <span className="font-mono text-xs px-2 py-1 border border-border rounded text-foreground/40">
                      {car.city}
                    </span>
                  )}
                </div>

                <div className="aspect-video bg-white/5 rounded mb-4 overflow-hidden flex items-center justify-center">
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Icon name="CarFront" size={48} className="text-foreground/20 group-hover:text-foreground/40 transition-colors duration-300" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div>
                    <p className="font-mono text-xs text-foreground/30 mb-0.5">Год</p>
                    <p className="font-mono text-sm text-foreground">{car.year}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-foreground/30 mb-0.5">Пробег</p>
                    <p className="font-mono text-sm text-foreground">{car.mileage_formatted || `${car.mileage} км`}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-foreground/30 mb-0.5">Кузов</p>
                    <p className="font-mono text-sm text-foreground">{car.body_type || "—"}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-foreground/30 mb-0.5">Топливо</p>
                    <p className="font-mono text-sm text-foreground">{car.fuel_type || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <p className="text-lg font-sentient text-foreground">{car.price_formatted || `${car.price} ₽`}</p>
                  <span className="font-mono text-xs text-foreground/40 group-hover:text-primary transition-colors duration-150 flex items-center gap-1">
                    Подробнее <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {pages > 1 && !loading && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => fetchCars(filters, page - 1)}
              className="font-mono text-xs border border-border px-4 py-2 rounded hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Назад
            </button>
            <span className="font-mono text-xs text-foreground/40">
              {page} / {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => fetchCars(filters, page + 1)}
              className="font-mono text-xs border border-border px-4 py-2 rounded hover:border-foreground/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Вперёд →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
