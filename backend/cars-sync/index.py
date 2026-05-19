"""
Парсинг объявлений об автомобилях с Onliner.by (открытый JSON API) и сохранение в БД.
Вызывается вручную для обновления каталога.
"""
import json
import os
import psycopg2
import urllib.request
import urllib.error


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

ONLINER_API = "https://ab.onliner.by/api/search/cars"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "ru-RU,ru;q=0.9",
    "Referer": "https://ab.onliner.by/",
    "X-Requested-With": "XMLHttpRequest",
}


def fetch_onliner_page(page: int, limit: int, extra_params: dict) -> dict:
    params = {"limit": limit, "page": page}
    params.update(extra_params)
    query = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"{ONLINER_API}?{query}"

    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def parse_offer(offer: dict) -> dict:
    price_info = offer.get("price", {}) or {}
    usd = price_info.get("usd", {}) or {}
    price_usd = usd.get("amount")
    price_rub = int(float(price_usd) * 90) if price_usd else None

    location = offer.get("location", {}) or {}
    city = location.get("city", {}).get("name", "") if location.get("city") else ""

    photos = offer.get("photos", {}) or {}
    photo_list = list(photos.values()) if photos else []
    image_url = photo_list[0].get("medium", "") if photo_list else ""

    car = offer.get("car", {}) or {}
    brand = car.get("brand", {}).get("name", "") if car.get("brand") else ""
    model = car.get("model", {}).get("name", "") if car.get("model") else ""
    year = car.get("year")
    body_type = car.get("body_type", {}).get("name", "") if car.get("body_type") else ""
    transmission = car.get("transmission", {}).get("name", "") if car.get("transmission") else ""
    fuel_type = car.get("engine_type", {}).get("name", "") if car.get("engine_type") else ""
    engine_volume = car.get("engine_capacity")
    if engine_volume:
        engine_volume = round(float(engine_volume) / 1000, 1)
    power = car.get("engine_power")
    mileage = car.get("odometer", {}).get("value") if car.get("odometer") else None

    external_id = str(offer.get("id", ""))
    url = offer.get("html_url", "")

    return {
        "external_id": external_id,
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
        "url": url,
        "city": city,
    }


def upsert_car(cursor, car: dict):
    cursor.execute("""
        INSERT INTO cars
            (external_id, source, brand, model, year, price, mileage,
             body_type, fuel_type, transmission, engine_volume,
             power, image_url, url, city, updated_at)
        VALUES
            (%s, 'onliner', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        ON CONFLICT (external_id) DO UPDATE SET
            price = EXCLUDED.price,
            mileage = EXCLUDED.mileage,
            image_url = EXCLUDED.image_url,
            updated_at = NOW()
    """, (
        car["external_id"], car["brand"], car["model"], car["year"],
        car["price"], car["mileage"], car["body_type"], car["fuel_type"],
        car["transmission"], car["engine_volume"], car["power"],
        car["image_url"], car["url"], car["city"],
    ))


def handler(event: dict, context) -> dict:
    """Парсит объявления с Onliner.by и сохраняет в базу данных"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    pages_to_fetch = min(int(body.get("pages", 3)), 10)
    limit = 25
    extra_params = {}
    if body.get("brand"):
        extra_params["brand[]"] = body["brand"]

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    saved = 0
    errors = []
    total_fetched = 0

    for page in range(1, pages_to_fetch + 1):
        try:
            data = fetch_onliner_page(page, limit, extra_params)
            offers = data.get("adverts", [])
            if not offers:
                break
            total_fetched += len(offers)
            for offer in offers:
                try:
                    car = parse_offer(offer)
                    if car["brand"] and car["model"]:
                        upsert_car(cur, car)
                        saved += 1
                except Exception as e:
                    errors.append(f"offer parse: {e}")
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
            "pages": pages_to_fetch,
            "errors": errors[:5],
            "source": "onliner.by"
        }, ensure_ascii=False)
    }
