import { GL } from "./gl";
import { Pill } from "./Pill";
import { Button } from "./ui/button";
import { useState } from "react";
import { Header } from "./Header";

export function Hero() {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="flex flex-col h-svh justify-between relative z-10">
      <GL hovering={hovering} />
      <Header />

      <div className="pb-16 mt-auto text-center relative">
        <Pill className="mb-6">УМНЫЙ ПОДБОР АВТО</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          Найдите свой <br />
          <i className="font-light">идеальный</i> автомобиль
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-8 max-w-[440px] mx-auto">
          Без бесконечного скролла объявлений — только подходящие варианты за минуты
        </p>

        <a className="contents max-sm:hidden" href="#search">
          <Button
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Начать поиск]
          </Button>
        </a>
        <a className="contents sm:hidden" href="#search">
          <Button
            size="sm"
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Начать поиск]
          </Button>
        </a>
      </div>
    </div>
  );
}