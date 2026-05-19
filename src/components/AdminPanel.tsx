import { useState } from "react";
import Icon from "@/components/ui/icon";

const SYNC_URL = "https://functions.poehali.dev/23e2dd87-f1ab-424d-a7df-2657181d8f32";

interface SyncResult {
  synced: number;
  fetched: number;
  pages_requested: number;
  errors: string[];
  source: string;
  // diag fields
  ok?: boolean;
  error?: string;
  count?: number;
}

export function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(3);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const call = async (body: object) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(SYNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const raw = await res.json();
      const data: SyncResult = typeof raw === "string" ? JSON.parse(raw) : raw;
      setResult(data);
    } catch (e) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleSync = () => call({ pages });
  const handleDiag = () => call({ diag: true });

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center hover:bg-primary/20 transition-colors"
        title="Панель администратора"
      >
        <Icon name="Settings" size={16} className="text-primary" />
      </button>

      {open && (
        <div className="absolute bottom-14 right-0 w-80 bg-background border border-border rounded-lg p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Администратор</p>
            <button onClick={() => setOpen(false)}>
              <Icon name="X" size={14} className="text-foreground/40 hover:text-foreground" />
            </button>
          </div>

          <div className="mb-4">
            <p className="font-mono text-xs text-foreground/40 mb-2">Парсинг Onliner.by</p>
            <div className="flex items-center gap-3 mb-3">
              <label className="font-mono text-xs text-foreground/60">Страниц:</label>
              <div className="flex items-center gap-2">
                {[1, 3, 5, 10].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPages(p)}
                    className={`font-mono text-xs w-8 h-7 border rounded transition-colors ${
                      pages === p
                        ? "border-primary text-primary"
                        : "border-border text-foreground/40 hover:border-foreground/30"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <p className="font-mono text-xs text-foreground/30 mb-3">
              ~{pages * 25} объявлений
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDiag}
                disabled={loading}
                className="flex-none font-mono text-xs py-2 px-3 border border-border text-foreground/40 rounded hover:border-foreground/30 transition-colors disabled:opacity-50"
                title="Проверить доступность источника"
              >
                <Icon name="Stethoscope" size={12} />
              </button>
              <button
                onClick={handleSync}
                disabled={loading}
                className="flex-1 font-mono text-xs py-2 border border-primary text-primary rounded hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={12} className="animate-spin" />
                    Парсим...
                  </>
                ) : (
                  <>
                    <Icon name="RefreshCw" size={12} />
                    Запустить парсинг
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className="border-t border-border pt-4">
              {"ok" in result ? (
                // Diag result
                result.ok ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={14} className="text-emerald-400" />
                      <p className="font-mono text-xs text-emerald-400">Источник доступен</p>
                    </div>
                    <p className="font-mono text-xs text-foreground/60">
                      Объявлений в ответе: <span className="text-foreground">{result.count}</span>
                    </p>
                    <p className="font-mono text-xs text-foreground/30">Можно запускать парсинг</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="XCircle" size={14} className="text-red-400" />
                      <p className="font-mono text-xs text-red-400">Источник недоступен</p>
                    </div>
                    <p className="font-mono text-xs text-red-400/70 break-words">{result.error}</p>
                  </div>
                )
              ) : (
                // Sync result
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={result.synced > 0 ? "CheckCircle" : "AlertCircle"} size={14} className={result.synced > 0 ? "text-emerald-400" : "text-amber-400"} />
                    <p className={`font-mono text-xs ${result.synced > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      {result.synced > 0 ? "Готово" : "Завершено с ошибками"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-foreground/60">
                      Получено: <span className="text-foreground">{result.fetched}</span>
                    </p>
                    <p className="font-mono text-xs text-foreground/60">
                      Сохранено: <span className="text-foreground">{result.synced}</span>
                    </p>
                    {result.errors?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {result.errors.map((e, i) => (
                          <p key={i} className="font-mono text-xs text-red-400/70 break-words">{e}</p>
                        ))}
                      </div>
                    )}
                  </div>
                  {result.synced > 0 && (
                    <p className="font-mono text-xs text-foreground/30 mt-3">
                      Обновите страницу чтобы увидеть объявления
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {error && (
            <div className="border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={14} className="text-red-400" />
                <p className="font-mono text-xs text-red-400">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}