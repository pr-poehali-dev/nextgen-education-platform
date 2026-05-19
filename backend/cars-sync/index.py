"""
Парсинг объявлений об автомобилях с нескольких источников и сохранение в БД.
Поддерживает Onliner.by и диагностический режим.
"""
import json
import os
import psycopg2
import urllib.request
import urllib.error
import ssl


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json, text/javascript, */*",
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
}

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE


def do_get(url: str, extra_headers: dict = None) -> dict:
    h = dict(HEADERS)
    if extra_headers:
        h.update(extra_headers)
    req = urllib.request.Request(url, headers=h)
    with urllib.request.urlopen(req, timeout=20, context=SSL_CTX) as resp:
        return json.loads(resp.read().decode("utf-8"))


def try_onliner(page: int, limit: int) -> list:
    url = f"https://ab.onliner.by/api/search/cars?limit={limit}&page={page}"
    data = do_get(url, {"Referer": "https://ab.onliner.by/", "X-Requested-With": "XMLHttpRequest"})
    return data.get("adverts", [])


def parse_onliner_offer(offer: dict) -> dict:
    price_info = offer.get("price") or {}
    usd = price_info.get("usd") or {}
    price_usd = usd.get("amount")
    price_rub = int(float(price_usd) * 90) if price_usd else None

    location = offer.get("location") or {}
    city_obj = location.get("city") or {}
    city = city_obj.get("name", "")

    photos = offer.get("photos") or {}
    photo_list = list(photos.values()) if photos else []
    image_url = photo_list[0].get("medium", "") if photo_list else ""

    car = offer.get("car") or {}
    brand = (car.get("brand") or {}).get("name", "")
    model = (car.get("model") or {}).get("name", "")
    year = car.get("year")
    body_type = (car.get("body_type") or {}).get("name", "")
    transmission = (car.get("transmission") or {}).get("name", "")
    fuel_type = (car.get("engine_type") or {}).get("name", "")
    engine_volume = car.get("engine_capacity")
    if engine_volume:
        engine_volume = round(float(engine_volume) / 1000, 1)
    power = car.get("engine_power")
    odo = car.get("odometer") or {}
    mileage = odo.get("value")

    return {
        "external_id": f"onliner_{offer.get('id', '')}",
        "source": "onliner",
        "brand": brand,
        "model": model,
        "year": year,
        "price": price_rub,
        "mileage": mileage,
        "body_type": body_type,
        "fuel_type": fuel_type,
        "transmission": transmission,
        "engine_volume": engine_volume,
        "power": power,
        "image_url": image_url,
        "url": offer.get("html_url", ""),
        "city": city,
    }


def upsert_car(cursor, car: dict):
    cursor.execute("""
        INSERT INTO cars
            (external_id, source, brand, model, year, price, mileage,
             body_type, fuel_type, transmission, engine_volume,
             power, image_url, url, city, updated_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
        ON CONFLICT (external_id) DO UPDATE SET
            price = EXCLUDED.price,
            mileage = EXCLUDED.mileage,
            image_url = EXCLUDED.image_url,
            updated_at = NOW()
    """, (
        car["external_id"], car["source"], car["brand"], car["model"],
        car["year"], car["price"], car["mileage"],
        car["body_type"], car["fuel_type"], car["transmission"],
        car["engine_volume"], car["power"],
        car["image_url"], car["url"], car["city"],
    ))


def handler(event: dict, context) -> dict:
    """Парсит объявления с Onliner.by и сохраняет в базу данных"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    pages_to_fetch = min(int(body.get("pages", 3)), 10)
    limit = 25
    diag = body.get("diag", False)

    # Диагностика: просто проверяем доступность Onliner без сохранения
    if diag:
        try:
            offers = try_onliner(1, 3)
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "ok": True,
                    "count": len(offers),
                    "sample": offers[0] if offers else None
                }, ensure_ascii=False, default=str)
            }
        except Exception as e:
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False)
            }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    saved = 0
    errors = []
    total_fetched = 0

    for page in range(1, pages_to_fetch + 1):
        try:
            offers = try_onliner(page, limit)
            if not offers:
                errors.append(f"page {page}: пустой ответ")
                break
            total_fetched += len(offers)
            for offer in offers:
                try:
                    car = parse_onliner_offer(offer)
                    if car["brand"] and car["model"]:
                        upsert_car(cur, car)
                        saved += 1
                except Exception as e:
                    errors.append(f"parse: {e}")
            conn.commit()
        except Exception as e:
            errors.append(f"page {page}: {e}")
            break

    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({
            "synced": saved,
            "fetched": total_fetched,
            "pages_requested": pages_to_fetch,
            "errors": errors[:10],
            "source": "onliner.by"
        }, ensure_ascii=False)
    }
