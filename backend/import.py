import sqlite3
import psycopg2

# Conectar SQLite
sqlite_conn = sqlite3.connect("database.db")
sqlite_conn.row_factory = sqlite3.Row
sqlite_cursor = sqlite_conn.cursor()

# Conectar PostgreSQL
pg_conn = psycopg2.connect(
    host="localhost",
    database="movies",
    user="kevin",
    password="1234",
    port=5433
)
pg_cursor = pg_conn.cursor()

# Leer datos
sqlite_cursor.execute("SELECT * FROM movies")
rows = sqlite_cursor.fetchall()

print(f"Migrando {len(rows)} registros...")

for row in rows:
    pg_cursor.execute("""
        INSERT INTO movies (
            year, title, director, country,
            producer, distributor, genre,
            rating, category, cover_url
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        row["year"],
        row["title"],
        row["director"],
        row["country"],
        row["producer"],
        row["distributor"],
        row["genre"],
        float(str(row["rating"]).replace(",", ".")) if row["rating"] else None,
        row["category"],
        row["cover_url"]
    ))

pg_conn.commit()

sqlite_conn.close()
pg_conn.close()

print("Migración completa 🚀")