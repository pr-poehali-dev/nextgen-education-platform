import { useState } from "react";
import { Button } from "@/components/ui/button";

const brands = ["Любая", "Toyota", "BMW", "Mercedes", "Hyundai", "Kia", "Volkswagen", "Audi", "Lada"];
const bodyTypes = ["Любой", "Седан", "Кроссовер", "Хэтчбек", "Универсал", "Минивэн", "Купе"];
const budgets = ["до 500 000 ₽", "500 000 — 1 млн ₽", "1 — 2 млн ₽", "2 — 3 млн ₽", "от 3 млн ₽"];
const mileages = ["Новый", "до 50 000 км", "до 100 000 км", "до 150 000 км", "любой пробег"];

interface SearchSectionProps {
  onSearch: (filters: { brand: string; body: string; budget: string; mileage: string }) => void;
  loading?: boolean;
}

export function SearchSection({ onSearch, loading }: SearchSectionProps) {
  const [brand, setBrand] = useState("Любая");
  const [body, setBody] = useState("Любой");
  const [budget, setBudget] = useState("1 — 2 млн ₽");
  const [mileage, setMileage] = useState("любой пробег");

  const handleSearch = () => {
    onSearch({ brand, body, budget, mileage });
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="search" className="py-24 md:py-36 relative z-10">
      <div className="container">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
            Поиск
          </p>
          <h2 className="text-4xl md:text-5xl font-sentient">
            Найдите свой <i className="font-light">автомобиль</i>
          </h2>
          <p className="font-mono text-sm text-foreground/60 mt-4 max-w-md mx-auto">
            Укажите параметры — мы подберём подходящие варианты из тысяч объявлений
          </p>
        </div>

        <div className="border border-border rounded-lg p-6 md:p-10 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-2">
                Марка
              </label>
              <div className="flex flex-wrap gap-2">
                {brands.slice(0, 6).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`font-mono text-xs px-3 py-1.5 border rounded transition-colors duration-150 ${
                      brand === b
                        ? "border-primary text-primary"
                        : "border-border text-foreground/50 hover:border-foreground/40"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-2">
                Тип кузова
              </label>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.slice(0, 5).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBody(b)}
                    className={`font-mono text-xs px-3 py-1.5 border rounded transition-colors duration-150 ${
                      body === b
                        ? "border-primary text-primary"
                        : "border-border text-foreground/50 hover:border-foreground/40"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-2">
                Бюджет
              </label>
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBudget(b)}
                    className={`font-mono text-xs px-3 py-1.5 border rounded transition-colors duration-150 ${
                      budget === b
                        ? "border-primary text-primary"
                        : "border-border text-foreground/50 hover:border-foreground/40"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-2">
                Пробег
              </label>
              <div className="flex flex-wrap gap-2">
                {mileages.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMileage(m)}
                    className={`font-mono text-xs px-3 py-1.5 border rounded transition-colors duration-150 ${
                      mileage === m
                        ? "border-primary text-primary"
                        : "border-border text-foreground/50 hover:border-foreground/40"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-6">
            <p className="font-mono text-xs text-foreground/40">
              {brand} · {body} · {budget} · {mileage}
            </p>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "[Поиск...]" : "[Найти автомобиль]"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
