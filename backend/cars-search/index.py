"""
Поиск и фильтрация автомобилей из базы данных.
Принимает фильтры и возвращает список подходящих объявлений.
"""
import json
import os
import psycopg2
import psycopg2.extras


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

PRICE_RANGES = {
    "до 500 000 ₽":       (0, 500000),
    "500 000 — 1 млн ₽":  (500000, 1000000),
    "1 — 2 млн ₽":        (1000000, 2000000),
    "2 — 3 млн ₽":        (2000000, 3000000),
    "от 3 млн ₽":         (3000000, 999999999),
}

MILEAGE_LIMITS = {
    "Новый":          0,
    "до 50 000 км":   50000,
    "до 100 000 км":  100000,
    "до 150 000 км":  150000,
    "любой пробег":   None,
}


def handler(event: dict, context) -> dict:
    """Поиск автомобилей с фильтрами: марка, кузов, бюджет, пробег"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}

    brand = params.get("brand", "")
    body_type = params.get("body_type", "")
    budget = params.get("budget", "")
    mileage_label = params.get("mileage", "")
    page = int(params.get("page", 1))
    limit = int(params.get("limit", 12))
    offset = (page - 1) * limit

    conditions = []
    values = []

    if brand and brand.lower() not in ("любая", "any"):
        conditions.append("LOWER(brand) = LOWER(%s)")
        values.append(brand)

    if body_type and body_type.lower() not in ("любой", "any"):
        conditions.append("LOWER(body_type) LIKE LOWER(%s)")
        values.append(f"%{body_type}%")

    if budget and budget in PRICE_RANGES:
        price_min, price_max = PRICE_RANGES[budget]
        conditions.append("price >= %s AND price <= %s")
        values.extend([price_min, price_max])

    if mileage_label and mileage_label in MILEAGE_LIMITS:
        max_km = MILEAGE_LIMITS[mileage_label]
        if max_km is not None:
            if max_km == 0:
                conditions.append("(mileage = 0 OR mileage IS NULL)")
            else:
                conditions.append("mileage <= %s")
                values.append(max_km)

    where_clause = "WHERE " + " AND ".join(conditions) if conditions else ""

    count_query = f"SELECT COUNT(*) FROM cars {where_clause}"
    data_query = f"""
        SELECT id, external_id, brand, model, year, price, mileage,
               body_type, fuel_type, transmission, color,
               engine_volume, power, image_url, url, city
        FROM cars
        {where_clause}
        ORDER BY updated_at DESC
        LIMIT %s OFFSET %s
    """

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(count_query, values)
    total = cur.fetchone()["count"]

    cur.execute(data_query, values + [limit, offset])
    rows = cur.fetchall()

    cur.close()
    conn.close()

    cars = [dict(row) for row in rows]
    for car in cars:
        if car.get("price"):
            car["price_formatted"] = f"{car['price']:,} ₽".replace(",", " ")
        if car.get("mileage"):
            car["mileage_formatted"] = f"{car['mileage']:,} км".replace(",", " ")

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({
            "cars": cars,
            "total": total,
            "page": page,
            "pages": (total + limit - 1) // limit
        }, ensure_ascii=False, default=str)
    }
