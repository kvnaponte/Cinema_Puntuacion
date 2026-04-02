import { useState } from 'react'
import { createMovie } from '../api.js'

const CRITERIA = [
  { key: 'historia',   label: 'Historia'   },
  { key: 'narrativa',  label: 'Narrativa'  },
  { key: 'guion',      label: 'Guión'      },
  { key: 'personajes', label: 'Personajes' },
  { key: 'visuales',   label: 'Visuales'   },
  { key: 'musica',     label: 'Música'     },
]

const EMPTY_INFO = {
  title: '', director: '', year: '', genre: '',
  country: '', producer: '', distributor: '', cover_url: '',
}
const EMPTY_CRIT = { historia: '', narrativa: '', guion: '', personajes: '', visuales: '', musica: '' }

const CAT_COLOR = {
  DIAMOND:  '#a8d8f0',
  GOLD:     '#d4a820',
  PLATINUM: '#b8bec4',
  GOOD:     '#7aaa60',
  ACEPTABLE:'#c0a060',
  BAD:      '#a06060',
}

function getCategory(r) {
  if (r == null || isNaN(r)) return null
  if (r >= 9.5) return 'DIAMOND'
  if (r >= 8.8) return 'GOLD'
  if (r >= 8.0) return 'PLATINUM'
  if (r >= 7.0) return 'GOOD'
  if (r >= 5.0) return 'ACEPTABLE'
  return 'BAD'
}

function catLabel(cat) {
  if (!cat) return ''
  return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
}

function calcRating(crit) {
  const vals = Object.values(crit)
    .map(v => parseFloat(String(v).replace(',', '.')))
    .filter(v => !isNaN(v) && v >= 0 && v <= 10)
  if (!vals.length) return null
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length
  return Math.round(avg * 10) / 10
}

function formatRating(r) {
  if (r == null) return '—'
  return r === 10 ? '10' : r.toFixed(1)
}

const inputStyle = {
  background: 'rgba(0,0,0,0.45)',
  border: '1px solid #4a3510',
  color: '#c9a840',
  padding: '6px 10px',
  fontSize: '0.82rem',
  fontFamily: 'Georgia, serif',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  fontSize: '0.58rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: '#6a5020',
  display: 'block',
  marginBottom: 3,
  fontFamily: "'Cinzel', Georgia, serif",
}

export default function AddMovieForm({ onSuccess }) {
  const [info, setInfo]       = useState(EMPTY_INFO)
  const [crit, setCrit]       = useState(EMPTY_CRIT)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const rating   = calcRating(crit)
  const category = getCategory(rating)
  const catColor = category ? (CAT_COLOR[category] ?? '#d4a820') : '#3a2808'
  const hasData  = !!(info.title || info.director || rating != null)

  function setI(field) { return e => setInfo(f => ({ ...f, [field]: e.target.value })) }
  function setC(field) { return e => setCrit(f => ({ ...f, [field]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating == null) { setError('Ingresa al menos un criterio de puntuación'); return }
    setError('')
    setLoading(true)
    try {
      await createMovie({
        title:       info.title       || undefined,
        year:        info.year        ? parseInt(info.year) : undefined,
        director:    info.director    || undefined,
        country:     info.country     || undefined,
        producer:    info.producer    || undefined,
        distributor: info.distributor || undefined,
        genre:       info.genre       || undefined,
        cover_url:   info.cover_url   || undefined,
        rating,
      })
      setInfo(EMPTY_INFO)
      setCrit(EMPTY_CRIT)
      onSuccess()
    } catch (err) {
      setError(err.message ?? 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Left: form fields ──────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {error && (
            <div style={{ marginBottom: 10, padding: '7px 12px', background: 'rgba(160,48,48,0.15)', border: '1px solid rgba(160,80,80,0.35)', color: '#c08080', fontSize: '0.8rem', fontFamily: 'Georgia, serif' }}>
              {error}
            </div>
          )}

          {/* Info fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Título *</label>
              <input style={inputStyle} placeholder="Título de la película" value={info.title} onChange={setI('title')} required />
            </div>
            <div>
              <label style={labelStyle}>Director</label>
              <input style={inputStyle} placeholder="Director" value={info.director} onChange={setI('director')} />
            </div>
            <div>
              <label style={labelStyle}>Año</label>
              <input style={inputStyle} type="number" placeholder="2024" value={info.year} onChange={setI('year')} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Género</label>
              <input style={inputStyle} placeholder="Drama, Thriller, Ciencia ficción..." value={info.genre} onChange={setI('genre')} />
            </div>
            <div>
              <label style={labelStyle}>País</label>
              <input style={inputStyle} placeholder="País de origen" value={info.country} onChange={setI('country')} />
            </div>
            <div>
              <label style={labelStyle}>Productora</label>
              <input style={inputStyle} placeholder="Productora" value={info.producer} onChange={setI('producer')} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Distribuidora</label>
              <input style={inputStyle} placeholder="Distribuidora" value={info.distributor} onChange={setI('distributor')} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>URL Portada</label>
              <input style={inputStyle} placeholder="https://..." value={info.cover_url} onChange={setI('cover_url')} />
            </div>
          </div>

          {/* Criteria divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 10px' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #4a3510)' }} />
            <span style={{ color: '#6a4e18', fontSize: '0.58rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              ◆ Criterios de Puntuación ◆
            </span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #4a3510)' }} />
          </div>

          {/* Criteria inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 14 }}>
            {CRITERIA.map(({ key, label }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  style={inputStyle}
                  type="number" min="0" max="10" step="0.1"
                  placeholder="0.0 – 10.0"
                  value={crit[key]}
                  onChange={setC(key)}
                />
              </div>
            ))}
          </div>

          {/* Calculated average */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '8px 0', marginBottom: 14,
            borderTop: '1px solid #3a2808', borderBottom: '1px solid #3a2808',
          }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.74rem', color: '#6a5020' }}>
              Promedio:
            </span>
            <span style={{
              fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700,
              color: rating != null ? '#d4a820' : '#3a2808',
              textShadow: rating != null ? '0 0 12px rgba(212,168,32,0.5)' : 'none',
              transition: 'color 0.4s, text-shadow 0.4s',
            }}>
              {formatRating(rating)}
            </span>
            {category && (
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.72rem', fontStyle: 'italic', color: catColor, transition: 'color 0.4s' }}>
                {catLabel(category)}
              </span>
            )}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'transparent',
                border: '1px solid #d4a820',
                color: '#d4a820',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: '8px 22px',
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.76rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                opacity: loading ? 0.5 : 1,
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#d4a820'; e.currentTarget.style.color = '#160e04' } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d4a820' }}
            >
              {loading ? 'Registrando...' : 'Registrar Película'}
            </button>
          </div>
        </div>

        {/* ── Right: live preview card ─────────────────────────── */}
        <div style={{ width: 272, flexShrink: 0 }}>
          <div style={{
            background: 'linear-gradient(160deg, #241a08 0%, #140c04 100%)',
            border: `2px solid ${hasData ? (catColor) : '#2a1e08'}`,
            boxShadow: hasData && category ? `0 0 22px ${catColor}25, inset 0 0 30px rgba(0,0,0,0.5)` : 'inset 0 0 30px rgba(0,0,0,0.5)',
            transition: 'border-color 0.5s, box-shadow 0.5s',
            overflow: 'hidden',
          }}>
            {/* Card header label */}
            <div style={{ padding: '8px 14px 7px', borderBottom: '1px solid #2a1e08', textAlign: 'center' }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.55rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: '#4a3510' }}>
                ◆ Ficha de Película ◆
              </span>
            </div>

            {/* Poster area */}
            {info.cover_url ? (
              <div style={{ height: 160, overflow: 'hidden', borderBottom: '1px solid #2a1e08' }}>
                <img
                  src={info.cover_url}
                  alt="Portada"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              </div>
            ) : (
              <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #2a1e08' }}>
                <span style={{ color: '#1e1408', fontSize: '1.4rem' }}>🎬</span>
              </div>
            )}

            {/* Movie info */}
            <div style={{ padding: '12px 14px' }}>
              {/* Title */}
              <div style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: info.title.length > 20 ? '0.82rem' : '0.95rem',
                color: info.title ? '#d4c080' : '#2a1e08',
                fontWeight: 700, lineHeight: 1.3, marginBottom: 4,
                minHeight: 22,
                transition: 'color 0.3s',
              }}>
                {info.title || 'Título de la película'}
              </div>

              {/* Director */}
              {info.director && (
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '0.73rem', color: '#8a6838', fontStyle: 'italic', marginBottom: 5 }}>
                  {info.director}
                </div>
              )}

              {/* Year + Genre */}
              {(info.year || info.genre) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 7 }}>
                  {info.year  && <span style={{ fontFamily: 'Georgia', fontSize: '0.7rem', color: '#6a5020' }}>{info.year}</span>}
                  {info.year && info.genre && <span style={{ color: '#3a2808' }}>·</span>}
                  {info.genre && <span style={{ fontFamily: 'Georgia', fontSize: '0.7rem', color: '#6a5020', fontStyle: 'italic' }}>{info.genre}</span>}
                </div>
              )}

              {/* Meta */}
              {(info.country || info.producer || info.distributor) && (
                <div style={{ borderTop: '1px solid #1e1408', paddingTop: 6, marginBottom: 8 }}>
                  {[['País', info.country], ['Productora', info.producer], ['Distribuidora', info.distributor]].map(([lbl, val]) => val ? (
                    <div key={lbl} style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: '0.58rem', color: '#4a3510', fontFamily: "'Cinzel'", textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 60 }}>{lbl}</span>
                      <span style={{ fontSize: '0.7rem', color: '#8a6838', fontFamily: 'Georgia', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
                    </div>
                  ) : null)}
                </div>
              )}

              {/* Rating display */}
              <div style={{ borderTop: '1px solid #1e1408', paddingTop: 10, textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '2.6rem', fontWeight: 700, lineHeight: 1,
                  color: rating != null ? catColor : '#1e1408',
                  textShadow: rating != null ? `0 0 24px ${catColor}77` : 'none',
                  transition: 'color 0.5s, text-shadow 0.5s',
                }}>
                  {formatRating(rating)}
                </div>
                <div style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '0.65rem', letterSpacing: '0.28em',
                  textTransform: 'uppercase', marginTop: 5,
                  color: category ? catColor : '#2a1e08',
                  transition: 'color 0.5s',
                  minHeight: 16,
                }}>
                  {catLabel(category)}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </form>
  )
}
