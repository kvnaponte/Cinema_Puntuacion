import { getMovies, addMovie } from "./api.js";

const movieList = document.getElementById("movie-list");
const movieForm = document.getElementById("movie-form");
const searchInput = document.getElementById("search-input");

let allMovies = [];

/* =========================
   Render principal
========================= */
async function renderMovies() {
    allMovies = await getMovies();
    displayMovies(allMovies);
}

/* =========================
   Mostrar películas
========================= */
function displayMovies(movies) {
    if (movies.length === 0) {
        movieList.innerHTML = "<p>No hay películas registradas.</p>";
        return;
    }

    movieList.innerHTML = movies.map(m => `
        <div class="movie-card">
            <div class="movie-title">
                ${m.title} (${m.year})
            </div>

            <div class="movie-meta">
                ${m.director} · ${m.country}<br>
                ${m.genre}
            </div>

            <div class="movie-rating">
                Rating: ${m.rating} · ${m.category}
            </div>
        </div>
    `).join("");
}

/* =========================
   Búsqueda en tiempo real
========================= */
searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase().trim();

    const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(value)
    );

    displayMovies(filtered);
});

/* =========================
   Agregar película
========================= */
movieForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(movieForm);
    const movie = Object.fromEntries(formData.entries());

    movie.year = parseInt(movie.year);
    movie.rating = parseFloat(movie.rating);

    await addMovie(movie);

    movieForm.reset();
    renderMovies();
});

/* =========================
   Inicializar app
========================= */
renderMovies();
