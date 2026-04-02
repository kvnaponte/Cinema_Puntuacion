import os
from datetime import datetime
from typing import Optional

import psycopg2
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="Proyecto Cronos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.getenv("DB_NAME", "movies"),
        user=os.getenv("DB_USER", "kevin"),
        password=os.getenv("DB_PASSWORD", "1234"),
        client_encoding="UTF8",
    )


def get_stars(rating) -> int:
    if rating is None:
        return 1
    rating = float(rating)
    if rating >= 9.5:
        return 5
    if rating >= 8.8:
        return 5
    if rating >= 8.0:
        return 4
    if rating >= 7.0:
        return 3
    if rating >= 5.0:
        return 2
    return 1


def get_category(rating) -> str:
    if rating is None:
        return "BAD"
    rating = float(rating)
    if rating >= 9.5:
        return "DIAMOND"
    if rating >= 8.8:
        return "GOLD"
    if rating >= 8.0:
        return "PLATINUM"
    if rating >= 7.0:
        return "GOOD"
    if rating >= 5.0:
        return "ACEPTABLE"
    return "BAD"


def serialize_movie(row: tuple, columns: list) -> dict:
    m = dict(zip(columns, row))
    for key, value in m.items():
        if isinstance(value, datetime):
            m[key] = value.isoformat()
    m["stars"] = get_stars(m.get("rating"))
    m["category"] = get_category(m.get("rating"))
    return m


class MovieIn(BaseModel):
    year: Optional[int] = None
    title: str
    director: Optional[str] = None
    country: Optional[str] = None
    producer: Optional[str] = None
    distributor: Optional[str] = None
    genre: Optional[str] = None
    rating: Optional[float] = None
    cover_url: Optional[str] = None


@app.get("/movies")
def get_movies(q: Optional[str] = Query(default=None)):
    conn = get_connection()
    cur = conn.cursor()
    try:
        if q:
            cur.execute(
                "SELECT * FROM movies WHERE LOWER(title) LIKE %s ORDER BY id DESC",
                (f"%{q.lower()}%",),
            )
        else:
            cur.execute("SELECT * FROM movies ORDER BY id DESC")
        rows = cur.fetchall()
        columns = [desc[0] for desc in cur.description]
    finally:
        cur.close()
        conn.close()

    return [serialize_movie(row, columns) for row in rows]


@app.post("/movies", status_code=201)
def add_movie(movie: MovieIn):
    rating = movie.rating
    category = get_category(rating)

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            """
            INSERT INTO movies (
                year, title, director, country,
                producer, distributor, genre,
                rating, category, cover_url
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
            """,
            (
                movie.year,
                movie.title,
                movie.director,
                movie.country,
                movie.producer,
                movie.distributor,
                movie.genre,
                rating,
                category,
                movie.cover_url,
            ),
        )
        row = cur.fetchone()
        columns = [desc[0] for desc in cur.description]
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()

    return serialize_movie(row, columns)


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000)
