"""
Синхронизация объявлений с Авто.ру в базу данных.
Вызывается вручную или по расписанию для обновления каталога.
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


def fetch_autoru_listings(api_key: str, params: dict) -> list:
    """Запрос объявлений с Авто.ру API"""
    base_url = "https://apiauto.ru/1.0/search/cars"
    query = "&".join(f"{k}={v}" for k, v in params.items())
    url = f"{base_url}?{query}&page_size=50"

    req = urllib.request.Request(url, headers={
        "x-authorization": api_key,
        "Accept": "application/json",
    })

    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode())
            return data.get("offers", [])
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"Авто.ру API ошибка {e.code}: {e.reason}")


def upsert_car(cursor, offer: dict):
    """Сохраняем или обновляем объявление в БД"""
    vehicle = offer.get("vehicle_info", {})
    price_info = offer.get("price_info", {})
    state = offer.get("state", {})
    docs = offer.get("documents", {})
    seller = offer.get("seller", {})

    external_id = offer.get("id", "")
    brand = vehicle.get("mark_info", {}).get("name", "")
    model = vehicle.get("model_info", {}).get("name", "")
    year = docs.get("year", None)
    price = price_info.get("price", None)
    mileage = state.get("mileage", None)
    body_type = vehicle.get("tech_param", {}).get("human_name", "")
    fuel_type = vehicle.get("tech_param", {}).get("engine_type", "")
    transmission = vehicle.get("tech_param", {}).get("transmission", "")
    color = offer.get("color_hex", "")
    engine_volume = vehicle.get("tech_param", {}).get("displacement", None)
    power = vehicle.get("tech_param", {}).get("power", None)
    description = offer.get("description", "")
    image_url = offer.get("main_photo", {}).get("sizes", {}).get("640x480", "")
    url = f"https://auto.ru/cars/used/sale/{external_id}/"
    city = seller.get("location", {}).get("region_info", {}).get("name", "")

    if engine_volume:
        engine_volume = round(engine_volume / 1000, 1)

    cursor.execute("""
        INSERT INTO cars
            (external_id, source, brand, model, year, price, mileage,
             body_type, fuel_type, transmission, color, engine_volume,
             power, description, image_url, url, city, updated_at)
        VALUES
            (%s, 'autoru', %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        ON CONFLICT (external_id) DO UPDATE SET
            price = EXCLUDED.price,
            mileage = EXCLUDED.mileage,
            description = EXCLUDED.description,
            image_url = EXCLUDED.image_url,
            updated_at = NOW()
    """, (
        external_id, brand, model, year, price, mileage,
        body_type, fuel_type, transmission, color, engine_volume,
        power, description, image_url, url, city
    ))


def handler(event: dict, context) -> dict:
    """Синхронизация объявлений с Авто.ру в базу данных"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    api_key = os.environ.get("AUTORU_API_KEY", "")
    if not api_key:
        return {
            "statusCode": 503,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "error": "AUTORU_API_KEY не настроен",
                "hint": "Добавьте ключ Авто.ру в секреты проекта"
            }, ensure_ascii=False)
        }

    body = json.loads(event.get("body") or "{}")
    params = {
        "category": "cars",
        "section": "used",
        "mark": body.get("brand", ""),
        "model": body.get("model", ""),
        "price_from": body.get("price_from", ""),
        "price_to": body.get("price_to", ""),
        "km_age_to": body.get("mileage_to", ""),
        "year_from": body.get("year_from", ""),
    }
    params = {k: v for k, v in params.items() if v != ""}

    offers = fetch_autoru_listings(api_key, params)

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    saved = 0
    errors = []
    for offer in offers:
        try:
            upsert_car(cur, offer)
            saved += 1
        except Exception as e:
            errors.append(str(e))

    conn.commit()
    cur.close()
    conn.close()

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({
            "synced": saved,
            "total": len(offers),
            "errors": errors[:5]
        }, ensure_ascii=False)
    }
