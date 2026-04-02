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
| Backend    | FastAPI · Python 3.12                   |
| Base datos | PostgreSQL 17                           |
| Deploy     | Docker · Docker Compose                 |

---

## 🏆 Sistema de categorías

Cada película recibe una categoría automática según su puntuación (escala 0–10):

| Categoría    | Rango     | Estrellas | Color        |
|--------------|-----------|-----------|--------------|
| 💎 DIAMOND   | ≥ 9.5     | ★★★★★     | Dorado claro |
| 🥇 GOLD      | 8.8–9.49  | ★★★★★     | Dorado       |
| 🥈 PLATINUM  | 8.0–8.79  | ★★★★☆     | Plateado     |
| ✅ GOOD      | 7.0–7.99  | ★★★☆☆     | Verde oliva  |
| 🟡 ACEPTABLE | 5.0–6.99  | ★★☆☆☆     | Beige        |
| ⬛ BAD       | < 5.0     | ★☆☆☆☆     | Gris         |

> La categoría y las estrellas se asignan **automáticamente** al registrar una película. Solo hay que ingresar la puntuación.

---

## 🎨 Paleta de colores

```
Tema cine:
  Fondo          #121212   ← Negro profundo
  Superficie     #1e1e1e   ← Gris oscuro para tarjetas
  Texto          #f5f0e1   ← Blanco crema
  Acento         #bfa26f   ← Dorado

Por categoría:
  💎 Diamond     #c9b37e
  🥇 Gold        #b08d57
  🥈 Platinum    #9fa3a7
  ✅ Good        #7d8f6b
  🟡 Aceptable   #a89f8a
  ⬛ Bad         #6b6b6b
```

---

## 🚀 Inicio rápido

> **Requisito:** tener [Docker](https://www.docker.com/) instalado.

```bash
# 1. Clonar el repositorio
git clone https://github.com/kvnaponte/Cinema_Puntuacion.git
cd Cinema_Puntuacion

# 2. Levantar todos los servicios
docker compose up
```

Listo. Abrir en el navegador:

| Servicio  | URL                       |
|-----------|---------------------------|
| App       | http://localhost:5173     |
| API       | http://localhost:8000     |

---

## 📦 Migración desde la base de datos anterior

Si tenés películas en la base de datos SQLite original, podés migrarlas con un solo comando:

```bash
# Con Docker corriendo
cd backend
python3 import.py
```

```
Migrando 247 registros...
Migración completa 🚀
```

---

## 🐳 Servicios Docker

| Contenedor        | Función    | Puerto |
|-------------------|------------|--------|
| `svelte_frontend` | Interfaz   | 5173   |
| `fastapi_backend` | API REST   | 8000   |
| `postgres_db`     | Base datos | 5433   |
