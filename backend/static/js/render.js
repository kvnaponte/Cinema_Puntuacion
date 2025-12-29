import { getMovies, addMovie } from "./api.js";

const movieList = document.getElementById("movie-list");
const movieForm = document.getElementById("movie-form");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("movie-modal");
const closeModal = document.getElementById("close-modal");
const modalContent = modal.querySelector(".modal-content");

let allMovies = [];

/* =========================
   Render principal
========================= */
async function renderMovies() {
    allMovies = await getMovies();
    displayMovies(allMovies);
}

/* =========================
   Estrellas y categoría
========================= */
function normalizeRating(rating) {
    return parseFloat(String(rating).replace(",", "."));
}

function getStars(rating) {
    rating = normalizeRating(rating);

    if (rating >= 9.5) return 5;
    if (rating >= 8.8) return 5;      // ← corrección lógica
    if (rating >= 8.0) return 4;
    if (rating >= 7.0) return 3;
    if (rating >= 5.0) return 2;
    return 1;
}

function getCategory(rating) {
    rating = normalizeRating(rating);

    if (rating >= 9.5) return "DIAMOND";
    if (rating >= 8.8) return "GOLD";
    if (rating >= 8.0) return "PLATINUM";
    if (rating >= 7.0) return "GOOD";
    if (rating >= 5.0) return "ACEPTABLE";
    return "BAD";
}

function renderStars(stars) {
    return "★".repeat(stars);
}

/* =========================
   Mostrar películas
========================= */
function displayMovies(movies) {
    movieList.innerHTML = movies.map(m => {
        const stars = getStars(m.rating);
        const category = getCategory(m.rating);

        return `
        <div class="movie-card ${category.toLowerCase()}" data-id="${m.id}">
            <div class="movie-title">${m.title} (${m.year})</div>

            <div class="movie-meta">
                ${m.director} · ${m.country}<br>
                ${m.genre}
            </div>

            <div class="movie-rating">
                <span class="stars">${renderStars(stars)}</span>
                <span class="category ${category.toLowerCase()}">${category}</span>
                · ${m.rating}
            </div>
        </div>
        `;
    }).join("");

    document.querySelectorAll(".movie-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            const movie = allMovies.find(m => m.id == id);
            if (movie) openModal(movie);
        });
    });
}

/* =========================
   Modal detalle + iluminación
========================= */
function openModal(movie) {
    const category = getCategory(movie.rating).toLowerCase();

    /* Resetear clases de iluminación */
    modalContent.className = "modal-content";
    modalContent.classList.add(category);

    modal.classList.remove("hidden");

    document.getElementById("modal-cover").src =
        movie.cover_url || "https://via.placeholder.com/300x450?text=No+Cover";

    document.getElementById("modal-title").textContent =
        `${movie.title} (${movie.year})`;

    document.getElementById("modal-meta").innerHTML = `
        <strong>Director:</strong> ${movie.director}<br>
        <strong>País:</strong> ${movie.country}<br>
        <strong>Productor:</strong> ${movie.producer}<br>
        <strong>Distribuidor:</strong> ${movie.distributor}
    `;

    document.getElementById("modal-genre").textContent =
        `Género: ${movie.genre}`;

    document.getElementById("modal-rating").textContent =
        `Rating: ${movie.rating}`;
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

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
    movie.rating = normalizeRating(movie.rating);

    await addMovie(movie);

    movieForm.reset();
    renderMovies();
});

/* =========================
   Inicializar app
========================= */
renderMovies();
