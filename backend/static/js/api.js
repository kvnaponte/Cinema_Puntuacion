const API_URL = "http://127.0.0.1:5000/movies";

export async function getMovies() {
    const res = await fetch(API_URL);
    return await res.json();
}

export async function addMovie(movie) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(movie)
    });
    return await res.json();
}
