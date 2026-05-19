import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export function ContactSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 md:py-36 relative z-10">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-4">
              Контакты
            </p>
            <h2 className="text-4xl md:text-5xl font-sentient">
              Есть вопрос? <i className="font-light">Напишите</i>
            </h2>
            <p className="font-mono text-sm text-foreground/60 mt-4 max-w-md mx-auto">
              Поможем с подбором или ответим на любые вопросы о платформе
            </p>
          </div>

          {sent ? (
            <div className="border border-border rounded-lg p-10 text-center">
              <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center mx-auto mb-4">
                <Icon name="Check" size={20} className="text-primary" />
              </div>
              <h3 className="text-xl font-sentient mb-2">Сообщение отправлено!</h3>
              <p className="font-mono text-sm text-foreground/60">
                Мы свяжемся с вами в ближайшее время.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 md:p-10 space-y-5">
              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Петров"
                  className="w-full bg-transparent border border-border rounded px-4 py-3 font-mono text-sm placeholder:text-foreground/20 focus:outline-none focus:border-primary transition-colors duration-150"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (999) 000-00-00"
                  className="w-full bg-transparent border border-border rounded px-4 py-3 font-mono text-sm placeholder:text-foreground/20 focus:outline-none focus:border-primary transition-colors duration-150"
                  required
                />
              </div>
              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-foreground/40 block mb-2">
                  Сообщение
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ищу кроссовер до 2 млн, до 80 000 км..."
                  rows={4}
                  className="w-full bg-transparent border border-border rounded px-4 py-3 font-mono text-sm placeholder:text-foreground/20 focus:outline-none focus:border-primary transition-colors duration-150 resize-none"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit">
                  [Отправить сообщение]
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="container mt-20 pt-10 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-foreground/30">
            © 2024 AutoFi · Умный подбор автомобилей
          </p>
          <div className="flex gap-6">
            {["Каталог", "Как это работает", "Преимущества"].map((link) => (
              <a
                key={link}
                href={`#${link}`}
                className="font-mono text-xs text-foreground/30 hover:text-foreground/60 transition-colors duration-150"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
