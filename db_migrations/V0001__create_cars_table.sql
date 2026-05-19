CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  external_id VARCHAR(100) UNIQUE,
  source VARCHAR(50) DEFAULT 'autoru',
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  price INTEGER,
  mileage INTEGER,
  body_type VARCHAR(50),
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  color VARCHAR(50),
  engine_volume DECIMAL(3,1),
  power INTEGER,
  description TEXT,
  image_url TEXT,
  url TEXT,
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_body_type ON cars(body_type);
