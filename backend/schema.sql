CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    year INTEGER,
    title TEXT NOT NULL,

    director TEXT,
    country TEXT,
    producer TEXT,
    distributor TEXT,

    genre TEXT,

    rating REAL,
    category TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
