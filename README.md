# 🎬 Proyecto Cronos — Cinemateca Personal

> Archivo cinematográfico privado para catalogar, evaluar y archivar películas con criterio propio. Interfaz de estética cine clásico, búsqueda en tiempo real y sistema de categorías por puntuación.

---

## ✨ Vista general

```
┌─────────────────────────────────────────────────────────┐
│                   P R O Y E C T O   C R O N O S         │
│            ══════════════════════════════════           │
│   🔍 [Buscar película...              ]  [+ Agregar]    │
│                                                         │
│  ┌─────────────────────────┐  ┌────────────────────┐   │
│  │ ▌ Inception       ★★★★★ │  │ ▌ 2001: A Space... │   │
│  │   2010 · Nolan · USA    │  │   1968 · Kubrick   │   │
│  │   GOLD  8.8             │  │   DIAMOND  9.7     │   │
│  └─────────────────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠 Stack tecnológico

| Capa       | Tecnología                              |
|------------|-----------------------------------------|
| Frontend   | SvelteKit 2 · Svelte 5 · Tailwind CSS 3 |
| Backend    | FastAPI · Python 3.12 · Uvicorn         |
| Base datos | PostgreSQL 17 · psycopg2                |
| Deploy     | Docker · Docker Compose                 |

---

## 🏆 Sistema de categorías

Cada película recibe una categoría automática según su puntuación (escala 0–10):

| Categoría    | Rango     | Estrellas | Color          |
|--------------|-----------|-----------|----------------|
| 💎 DIAMOND   | ≥ 9.5     | ★★★★★     | Dorado claro   |
| 🥇 GOLD      | 8.8–9.49  | ★★★★★     | Dorado         |
| 🥈 PLATINUM  | 8.0–8.79  | ★★★★☆     | Plateado       |
| ✅ GOOD      | 7.0–7.99  | ★★★☆☆     | Verde oliva    |
| 🟡 ACEPTABLE | 5.0–6.99  | ★★☆☆☆     | Beige          |
| ⬛ BAD       | < 5.0     | ★☆☆☆☆     | Gris           |

> La categoría y las estrellas se calculan **automáticamente** en el servidor al registrar o editar una película. No necesitas ingresarlas manualmente.

---

## 📁 Estructura del proyecto

```
Cinema/
├── backend/
│   ├── app.py          ← API FastAPI (endpoints, lógica de negocio)
│   ├── schema.sql      ← Esquema de base de datos PostgreSQL
│   ├── import.py       ← Script de migración SQLite → PostgreSQL
│   └── database.db     ← Base de datos SQLite original (fuente de migración)
├── frontend/
│   └── src/
│       ├── routes/
│       │   └── +page.svelte          ← Página principal
│       └── lib/components/
│           ├── MovieCard.svelte      ← Tarjeta de película en la lista
│           ├── MovieModal.svelte     ← Modal con detalle completo
│           └── AddMovieForm.svelte   ← Formulario para agregar película
├── docker-compose.yml  ← Orquestación de los 3 servicios
├── dockerfile          ← Imagen Docker del backend
├── requirements.txt    ← Dependencias Python
└── .env                ← Variables de entorno (no subir a git)
```

---

## 🚀 Inicio rápido con Docker

> **Requisito:** tener Docker y Docker Compose instalados.

```bash
# 1. Clonar el repositorio
git clone https://github.com/kvnaponte/Cinema_Puntuacion.git
cd Cinema_Puntuacion

# 2. Levantar todos los servicios
docker compose up

# 3. Abrir en el navegador
#    Frontend → http://localhost:5173
#    API      → http://localhost:8000
```

Para correr en segundo plano:

```bash
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Detener servicios
docker compose down

# Detener y borrar la base de datos
docker compose down -v
```

---

## 🔧 Desarrollo local (sin Docker)

### Prerrequisitos

- Python 3.12+
- Node.js 20+
- PostgreSQL 17 corriendo localmente

### 1. Backend

```bash
# Crear entorno virtual
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Instalar dependencias
pip install -r requirements.txt

# Crear la base de datos y aplicar el esquema
createdb -U kevin movies
psql -U kevin -d movies -f backend/schema.sql

# Iniciar el servidor
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend

```bash
cd frontend

npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

---

## 🌐 Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=movies
DB_USER=kevin
DB_PASSWORD=1234
```

Para el frontend (opcional, el valor por defecto ya apunta a localhost):

```env
API_URL=http://localhost:8000
```

> En Docker Compose estas variables se inyectan automáticamente. El archivo `.env` solo es necesario para desarrollo local.

---

## 📡 API — Referencia de endpoints

Base URL: `http://localhost:8000`

---

### `GET /movies` — Listar películas

Devuelve todas las películas, ordenadas por fecha de inserción (más recientes primero).

**Parámetro opcional:**

| Parámetro | Tipo   | Descripción                                    |
|-----------|--------|------------------------------------------------|
| `q`       | string | Filtro por título (parcial, sin distinción de mayúsculas) |

**Ejemplos:**

```bash
# Todas las películas
curl http://localhost:8000/movies

# Buscar por título
curl "http://localhost:8000/movies?q=nolan"
```

**Respuesta `200 OK`:**

```json
[
  {
    "id": 1,
    "title": "Inception",
    "year": 2010,
    "director": "Christopher Nolan",
    "country": "USA",
    "producer": "Emma Thomas",
    "distributor": "Warner Bros",
    "genre": "Sci-Fi Thriller",
    "rating": 8.8,
    "category": "GOLD",
    "stars": 5,
    "cover_url": "https://image.tmdb.org/...",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

---

### `POST /movies` — Agregar película

Registra una nueva película. La `category` y `stars` se calculan automáticamente.

**Body (JSON):**

| Campo         | Tipo    | Requerido | Descripción                    |
|---------------|---------|-----------|--------------------------------|
| `title`       | string  | ✅        | Título de la película          |
| `year`        | integer | ❌        | Año de estreno                 |
| `rating`      | float   | ❌        | Puntuación (0.0–10.0)          |
| `director`    | string  | ❌        | Nombre del director            |
| `country`     | string  | ❌        | País de origen                 |
| `producer`    | string  | ❌        | Productora                     |
| `distributor` | string  | ❌        | Distribuidora                  |
| `genre`       | string  | ❌        | Género                         |
| `cover_url`   | string  | ❌        | URL del póster                 |

**Ejemplo:**

```bash
curl -X POST http://localhost:8000/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Interstellar",
    "year": 2014,
    "rating": 8.6,
    "director": "Christopher Nolan",
    "country": "USA",
    "genre": "Sci-Fi Drama",
    "cover_url": "https://image.tmdb.org/..."
  }'
```

**Respuesta `201 Created`:**

```json
{
  "id": 2,
  "title": "Interstellar",
  "year": 2014,
  "rating": 8.6,
  "category": "PLATINUM",
  "stars": 4,
  "director": "Christopher Nolan",
  "country": "USA",
  "producer": null,
  "distributor": null,
  "genre": "Sci-Fi Drama",
  "cover_url": "https://image.tmdb.org/...",
  "created_at": "2024-01-15T11:45:00",
  "updated_at": "2024-01-15T11:45:00"
}
```

---

## 🗄 Esquema de base de datos

```sql
CREATE TABLE IF NOT EXISTS movies (
    id           SERIAL PRIMARY KEY,
    year         INTEGER,
    title        TEXT NOT NULL,
    director     TEXT,
    country      TEXT,
    producer     TEXT,
    distributor  TEXT,
    genre        TEXT,
    rating       REAL,
    category     TEXT,
    cover_url    TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📦 Migración desde SQLite

Si tenés datos en la base de datos SQLite anterior (`backend/database.db`), podés migrarlos a PostgreSQL con el script incluido.

**Pasos:**

```bash
# 1. Asegurarse de que PostgreSQL esté corriendo (con Docker):
docker compose up -d db

# 2. Activar el entorno virtual
source venv/bin/activate

# 3. Ir al directorio backend y ejecutar el script
cd backend
python3 import.py
```

**Salida esperada:**

```
Migrando 247 registros...
Migración completa 🚀
```

> El script convierte automáticamente los separadores decimales europeos (coma → punto) en las puntuaciones.

---

## 🐳 Servicios Docker

| Servicio   | Contenedor         | Puerto host | Puerto interno |
|------------|--------------------|-------------|----------------|
| Base datos | `postgres_db`      | 5433        | 5432           |
| Backend    | `fastapi_backend`  | 8000        | 8000           |
| Frontend   | `svelte_frontend`  | 5173        | 5173           |

El backend espera a que la base de datos esté lista (healthcheck) antes de arrancar.

---

## 🧩 Componentes del frontend

### `MovieCard.svelte`
Tarjeta compacta en la lista principal. Muestra título, año, director, género, estrellas y categoría. El borde izquierdo y el color del título cambian según la categoría de la película. Clic para abrir el modal de detalle.

### `MovieModal.svelte`
Modal de pantalla completa con efecto de proyector al abrir. Muestra el póster, toda la información de la película y un brillo de borde dinámico según la categoría. Se cierra con el botón ✕, clic fuera del modal o tecla `Escape`.

### `AddMovieForm.svelte`
Formulario en grilla de 2 columnas. Acepta puntuaciones con coma o punto decimal. Muestra estado de carga durante el envío y refresca la lista automáticamente al agregar una película.

---

## 🎨 Paleta de colores

```
Cinema theme:
  bg          #121212   ← Fondo principal
  surface     #1e1e1e   ← Superficie de tarjetas
  text        #f5f0e1   ← Texto principal
  gold        #bfa26f   ← Acento dorado

Categorías:
  diamond     #c9b37e
  catgold     #b08d57
  platinum    #9fa3a7
  good        #7d8f6b
  aceptable   #a89f8a
  bad         #6b6b6b
```
