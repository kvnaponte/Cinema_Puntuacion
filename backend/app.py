import sqlite3
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

# -----------------------------
# RUTA PRINCIPAL (HOME)
# -----------------------------
@app.route("/")
def home():
    return render_template("index.html")

# -----------------------------
# API - OBTENER PELÍCULAS
# -----------------------------
@app.route("/movies", methods=["GET"])
def get_movies():
    conn = get_db_connection()
    movies = conn.execute("SELECT * FROM movies").fetchall()
    conn.close()
    return jsonify([dict(movie) for movie in movies])

# -----------------------------
# API - AGREGAR PELÍCULA
# -----------------------------
@app.route("/movies", methods=["POST"])
def add_movie():
    data = request.get_json()

    conn = get_db_connection()
    conn.execute("""
    INSERT INTO movies (
        year, title, director, country,
        producer, distributor, genre,
        rating, category, cover_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", (
    data["year"],
    data["title"],
    data["director"],
    data["country"],
    data["producer"],
    data["distributor"],
    data["genre"],
    data["rating"],
    data["category"],
    data.get("cover_url")
))

    conn.commit()
    conn.close()

    return jsonify({"message": "Película agregada"}), 201

if __name__ == "__main__":
    app.run(debug=True)
