CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    year INTEGER,
    title TEXT NOT NULL,
    director TEXT,
    country TEXT,
    producer TEXT,
    distributor TEXT,
    genre TEXT,
    rating REAL,
    category TEXT,
    cover_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);