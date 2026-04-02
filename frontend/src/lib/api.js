const BASE = '/api'

export async function fetchMovies(q = '') {
  const url = q ? `${BASE}/movies?q=${encodeURIComponent(q)}` : `${BASE}/movies`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error al obtener películas')
  return res.json()
}

export async function createMovie(data) {
  const res = await fetch(`${BASE}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al agregar película')
  return res.json()
}
