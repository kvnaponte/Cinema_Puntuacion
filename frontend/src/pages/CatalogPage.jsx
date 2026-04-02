import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchMovies } from '../api.js'
import AddMovieForm from '../components/AddMovieForm.jsx'
import MovieModal from '../components/MovieModal.jsx'
import { MarqueeLights, Column, Lantern, HeaderCorner, TheaterBackground, LightSwitch } from '../components/TheaterFrame.jsx'

const PER_PAGE = 10

function catLabel(cat) {
  if (!cat) return '—'
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
}

function formatRating(r) {
  const n = Number(r)
  return n === 10 ? '10' : n.toFixed(1)
}

/* ── Table corner ornament ─────────────────────────────────── */
function SmallCorner({ rot, color = '#7a5a18' }) {
  return (
    <svg viewBox="0 0 22 22" fill="none" style={{ width: 22, height: 22, transform: `rotate(${rot}deg)`, display: 'block' }}>
      <path d="M2 20 L2 2 L20 2" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="2" cy="2" r="2" fill={color}/>
    </svg>
  )
}

/* ── Add-movie modal overlay ───────────────────────────────── */
function AddMovieModal({ onClose, onSuccess }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 900,
        background: 'linear-gradient(160deg, #241a08 0%, #160e04 100%)',
        border: '2px solid #8a6a20',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.8)',
        position: 'relative',
        padding: '10px',
      }}>
        {/* corner ornaments */}
        <div style={{ position: 'absolute', top: 8, left: 8 }}><SmallCorner rot={0} color="#a07828"/></div>
        <div style={{ position: 'absolute', top: 8, right: 8 }}><SmallCorner rot={90} color="#a07828"/></div>
        <div style={{ position: 'absolute', bottom: 8, left: 8 }}><SmallCorner rot={270} color="#a07828"/></div>
        <div style={{ position: 'absolute', bottom: 8, right: 8 }}><SmallCorner rot={180} color="#a07828"/></div>

        <div style={{ padding: '16px 32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{
              fontFamily: "'Cinzel', Georgia, serif",
              color: '#d4a820', fontSize: '1.2rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              textShadow: '0 0 14px rgba(212,168,32,0.6)',
              margin: 0,
            }}>
              Nueva Proyección
            </h2>
            <button onClick={onClose} style={{
              background: 'transparent', border: '1px solid #5a4010',
              color: '#8a6a30', cursor: 'pointer', padding: '4px 10px',
              fontSize: '1rem', lineHeight: 1,
            }}>✕</button>
          </div>
          <AddMovieForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────────── */
export default function CatalogPage({ onlyPending = false }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [allMovies, setAllMovies]         = useState([])
  const [query, setQuery]                 = useState('')
  const [page, setPage]                   = useState(1)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [loading, setLoading]             = useState(true)
  const [fetchError, setFetchError]       = useState('')
  const [showForm, setShowForm]           = useState(searchParams.get('nuevo') === '1')

  const filtered = useMemo(() => {
    let list = onlyPending ? allMovies.filter(m => m.rating == null) : allMovies
    const q = query.trim().toLowerCase()
    list = q ? list.filter(m => m.title?.toLowerCase().includes(q)) : list
    return [...list].sort((a, b) => {
      if (a.rating == null && b.rating == null) return 0
      if (a.rating == null) return 1
      if (b.rating == null) return -1
      return b.rating - a.rating
    })
  }, [allMovies, query, onlyPending])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageMovies = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  async function loadMovies() {
    setLoading(true); setFetchError('')
    try { setAllMovies(await fetchMovies()) }
    catch (err) { setFetchError(err.message ?? 'Error') }
    finally { setLoading(false) }
  }

  async function handleFormSuccess() {
    setShowForm(false); setSearchParams({})
    await loadMovies()
  }

  useEffect(() => { loadMovies() }, [])
  useEffect(() => { setPage(1) }, [query, onlyPending])

  const title = onlyPending ? 'Próximos Estrenos' : 'Cartelera Completa'

  /* ── Shared styles ── */
  const gold   = '#d4a820'
  const dimGold = '#8a6a30'
  const borderCol = '#4a3510'

  return (
    <TheaterBackground>
      <div style={{ position: 'relative', width: '100%', maxWidth: 1180, padding: '32px 0' }}>

        <Column side="left"  />
        <Column side="right" />
        <Lantern side="left"  />
        <Lantern side="right" />
        <LightSwitch />

        {/* ── Main panel ───────────────────────────────────── */}
        <div style={{
          marginLeft: 108, marginRight: 108, position: 'relative',
          background: `
            radial-gradient(ellipse at 50% 0%,   rgba(120,72,10,0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(30,15,0,0.65)   0%, transparent 50%),
            linear-gradient(180deg, #2c1e0a 0%, #1c1206 50%, #221608 100%)
          `,
          border: '3px solid #7a5c18',
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7), 0 0 60px rgba(90,55,8,0.18)',
        }}>

          {/* ── Header band ────────────────────────────────── */}
          <div style={{ background: 'linear-gradient(180deg, #261b07 0%, #1c1205 100%)', borderBottom: '3px solid #7a5c18' }}>
            <div style={{ paddingTop: 10, paddingBottom: 10 }}>
              <MarqueeLights count={46} />
            </div>

            {/* Title panel */}
            <div style={{
              position: 'relative', margin: '0 22px 10px',
              border: '2px solid #9a7428',
              background: 'linear-gradient(180deg, #201608 0%, #160e04 100%)',
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
            }}>
              <div style={{ position: 'absolute', top: 6, left: 6 }}><HeaderCorner rot={0}   /></div>
              <div style={{ position: 'absolute', top: 6, right: 6 }}><HeaderCorner rot={90}  /></div>
              <div style={{ position: 'absolute', bottom: 6, left: 6 }}><HeaderCorner rot={270} /></div>
              <div style={{ position: 'absolute', bottom: 6, right: 6 }}><HeaderCorner rot={180} /></div>

              {/* Star ornaments left/right */}
              <div style={{ position: 'absolute', left: 60, top: '50%', transform: 'translateY(-50%)' }}>
                <svg viewBox="0 0 30 30" style={{ width: 30, height: 30 }}>
                  <circle cx="15" cy="15" r="13" stroke="#a07828" strokeWidth="1.5" fill="none"/>
                  <polygon points="15,4 17.5,11.5 25.5,11.5 19.5,16.5 21.5,24 15,19.5 8.5,24 10.5,16.5 4.5,11.5 12.5,11.5"
                    fill="#d4a820" opacity="0.9"/>
                </svg>
              </div>
              <div style={{ position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)' }}>
                <svg viewBox="0 0 30 30" style={{ width: 30, height: 30 }}>
                  <circle cx="15" cy="15" r="13" stroke="#a07828" strokeWidth="1.5" fill="none"/>
                  <polygon points="15,4 17.5,11.5 25.5,11.5 19.5,16.5 21.5,24 15,19.5 8.5,24 10.5,16.5 4.5,11.5 12.5,11.5"
                    fill="#d4a820" opacity="0.9"/>
                </svg>
              </div>

              <div style={{ textAlign: 'center', padding: '22px 90px 16px' }}>
                <h1 style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', margin: 0, color: '#edd060',
                  textShadow: '0 0 20px rgba(237,210,96,0.95), 0 0 45px rgba(237,195,64,0.6), 1px 4px 6px rgba(0,0,0,0.95)',
                }}>
                  {title}
                </h1>
                <p style={{
                  fontFamily: "'Cinzel', Georgia, serif", fontSize: '0.9rem',
                  fontStyle: 'italic', letterSpacing: '0.18em', marginTop: 6,
                  color: '#b89030', textShadow: '0 0 14px rgba(184,144,48,0.6)',
                }}>
                  Archivo Cinematográfico Personal
                </p>
              </div>
            </div>

            {/* Bottom lights row */}
            <div style={{ paddingBottom: 10, paddingLeft: 30, paddingRight: 30 }}>
              <MarqueeLights count={38} />
            </div>
          </div>

          {/* ── Content ────────────────────────────────────── */}
          <div style={{ padding: '20px 28px 24px' }}>

            {/* Section toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
              paddingBottom: 14, borderBottom: `1px solid ${borderCol}`,
            }}>
              {/* Back button */}
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'transparent', border: `1px solid #4a3510`,
                  color: dimGold, cursor: 'pointer', padding: '6px 12px',
                  fontFamily: "'Cinzel', Georgia, serif", fontSize: '0.78rem',
                  letterSpacing: '0.06em', flexShrink: 0,
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.borderColor = gold }}
                onMouseLeave={e => { e.currentTarget.style.color = dimGold; e.currentTarget.style.borderColor = '#4a3510' }}
              >
                ← Lobby
              </button>

              {/* Section title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${borderCol})` }} />
                <span style={{
                  fontFamily: "'Cinzel', Georgia, serif", fontSize: '0.72rem',
                  letterSpacing: '0.22em', textTransform: 'uppercase', color: dimGold,
                  whiteSpace: 'nowrap',
                }}>
                  ◆ Lista de Películas Guardadas ◆
                </span>
                <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${borderCol})` }} />
              </div>

              {/* Search */}
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar..."
                style={{
                  background: 'rgba(0,0,0,0.35)', border: `1px solid ${borderCol}`,
                  color: '#c9a840', padding: '6px 12px', fontSize: '0.82rem',
                  width: 140, outline: 'none', fontFamily: 'Georgia, serif',
                  flexShrink: 0,
                }}
              />

              {/* Add button */}
              {!onlyPending && (
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    background: 'transparent', border: `1px solid ${gold}`,
                    color: gold, cursor: 'pointer', padding: '6px 14px',
                    fontFamily: "'Cinzel', Georgia, serif", fontSize: '0.78rem',
                    letterSpacing: '0.06em', flexShrink: 0, whiteSpace: 'nowrap',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = gold; e.currentTarget.style.color = '#160e04' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = gold }}
                >
                  + Añadir Nueva Película
                </button>
              )}
            </div>

            {/* ── Table ───────────────────────────────────── */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: dimGold }}>
                <div style={{
                  width: 36, height: 36, margin: '0 auto 14px',
                  border: `2px solid ${gold}`, borderTopColor: 'transparent',
                  borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
                <p style={{ fontFamily: "'Cinzel', Georgia, serif", fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Cargando catálogo...
                </p>
              </div>
            ) : fetchError ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: '#c04040', marginBottom: 12 }}>Error al cargar las películas</p>
                <button onClick={loadMovies} style={{ background: 'transparent', border: `1px solid ${borderCol}`, color: dimGold, cursor: 'pointer', padding: '6px 16px' }}>
                  Reintentar
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: dimGold }}>
                <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1rem' }}>
                  {query.trim() ? 'Sin resultados para tu búsqueda' : onlyPending ? 'No hay películas pendientes' : 'El catálogo está vacío'}
                </p>
              </div>
            ) : (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '24%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '7%'  }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '27%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${borderCol}` }}>
                      {['Título', 'Director', 'Año', 'Género', 'Puntuación'].map((h, i) => (
                        <th key={h} style={{
                          fontFamily: "'Cinzel', Georgia, serif",
                          fontSize: '0.7rem', fontWeight: 700,
                          letterSpacing: '0.18em', textTransform: 'uppercase',
                          color: dimGold, padding: '8px 10px',
                          textAlign: i === 0 ? 'left' : 'center',
                          borderBottom: `2px solid ${borderCol}`,
                        }}>
                          {i === 0 && <span style={{ color: gold, marginRight: 6, fontSize: '0.65rem' }}>◈</span>}
                          {h}
                          {i === 4 && <span style={{ color: gold, marginLeft: 6, fontSize: '0.65rem' }}>◈</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Data rows */}
                    {pageMovies.map((movie, idx) => (
                      <tr
                        key={movie.id}
                        onClick={() => setSelectedMovie(movie)}
                        style={{
                          cursor: 'pointer', height: 44,
                          background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          borderBottom: `1px solid rgba(74,53,16,0.4)`,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,168,32,0.07)'}
                        onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
                      >
                        {/* Title */}
                        <td style={{ padding: '0 10px', color: '#d4c080', fontFamily: 'Georgia, serif', fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {movie.title}
                        </td>
                        {/* Director */}
                        <td style={{ padding: '0 10px', textAlign: 'center', color: '#a08848', fontFamily: 'Georgia, serif', fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {movie.director ?? '—'}
                        </td>
                        {/* Year */}
                        <td style={{ padding: '0 10px', textAlign: 'center', color: '#8a7040', fontFamily: 'Georgia, serif', fontSize: '0.85rem' }}>
                          {movie.year ?? '—'}
                        </td>
                        {/* Genre */}
                        <td style={{ padding: '0 10px', textAlign: 'center', color: '#a08848', fontFamily: 'Georgia, serif', fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {movie.genre ?? '—'}
                        </td>
                        {/* Rating + category from DB */}
                        <td style={{ padding: '0 10px', textAlign: 'center' }}>
                          {movie.rating != null ? (
                            <span>
                              <span style={{ color: gold, fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 700 }}>
                                {formatRating(movie.rating)}
                              </span>
                              {' '}
                              <span style={{ color: '#9a7838', fontFamily: 'Georgia, serif', fontSize: '0.78rem', fontStyle: 'italic' }}>
                                {catLabel(movie.category)}
                              </span>
                            </span>
                          ) : (
                            <span style={{ color: '#5a4820', fontStyle: 'italic', fontSize: '0.82rem' }}>Pendiente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {/* Filler rows to maintain fixed height across all pages */}
                    {Array.from({ length: PER_PAGE - pageMovies.length }).map((_, i) => (
                      <tr key={`filler-${i}`} style={{ height: 44, borderBottom: `1px solid rgba(74,53,16,0.2)` }}>
                        <td colSpan={5} />
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                    marginTop: 20, paddingTop: 16, borderTop: `1px solid ${borderCol}`,
                  }}>
                    <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${borderCol})` }} />
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{
                        background: 'transparent', border: 'none', color: page === 1 ? '#3a2808' : dimGold,
                        cursor: page === 1 ? 'default' : 'pointer', fontSize: '1rem', padding: '0 4px',
                      }}
                    >◄◄</button>
                    <span style={{
                      fontFamily: "'Cinzel', Georgia, serif", fontSize: '0.8rem',
                      letterSpacing: '0.15em', color: dimGold, whiteSpace: 'nowrap',
                    }}>
                      Página {page} de {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{
                        background: 'transparent', border: 'none', color: page === totalPages ? '#3a2808' : dimGold,
                        cursor: page === totalPages ? 'default' : 'pointer', fontSize: '1rem', padding: '0 4px',
                      }}
                    >►►</button>
                    <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${borderCol})` }} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Floor */}
        <div style={{ marginLeft: 108, marginRight: 108, height: 32, background: 'linear-gradient(to bottom, rgba(90,55,8,0.12) 0%, transparent 100%)' }} />

      </div>

      {/* Modals */}
      {showForm && (
        <AddMovieModal onClose={() => setShowForm(false)} onSuccess={handleFormSuccess} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </TheaterBackground>
  )
}
