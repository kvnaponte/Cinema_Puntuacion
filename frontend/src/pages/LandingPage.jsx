import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMovies } from '../api.js'
import { MarqueeLights, HeaderCorner, TheaterBackground } from '../components/TheaterFrame.jsx'

function formatRating(r) {
  const n = Number(r)
  return n === 10 ? '10' : n.toFixed(1)
}

/* ── Ornate card corners ───────────────────────────────────── */
function CardCorners({ color = '#8a6a20' }) {
  const C = ({ rot }) => (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 34, height: 34, transform: `rotate(${rot}deg)`, display: 'block' }}>
      <path d="M3 33 L3 3 L33 3" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M3 19 L11 11" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.65"/>
      <path d="M3 27 L7 23" stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
      <circle cx="3"  cy="3"  r="2.8" fill={color}/>
      <circle cx="19" cy="3"  r="1.4" fill={color} opacity="0.55"/>
      <circle cx="3"  cy="19" r="1.4" fill={color} opacity="0.55"/>
    </svg>
  )
  return (
    <>
      <div style={{ position: 'absolute', top: 6, left: 6,   pointerEvents: 'none' }}><C rot={0}   /></div>
      <div style={{ position: 'absolute', top: 6, right: 6,  pointerEvents: 'none' }}><C rot={90}  /></div>
      <div style={{ position: 'absolute', bottom: 6, left: 6,  pointerEvents: 'none' }}><C rot={270} /></div>
      <div style={{ position: 'absolute', bottom: 6, right: 6, pointerEvents: 'none' }}><C rot={180} /></div>
    </>
  )
}

/* ── Card data ─────────────────────────────────────────────── */
const CARDS = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 44 }}>
        <rect x="3" y="11" width="33" height="26" rx="3" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M36 18L45 13V35L36 30" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <circle cx="19" cy="24" r="6" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
        <line x1="3" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
        <line x1="3" y1="30" x2="36" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.35"/>
      </svg>
    ),
    title: ['Cartelera', 'Completa'],
    desc: 'Explorar todas las películas registradas',
    to: '/catalogo',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 44 }}>
        <path d="M11 6H37V15C37 23 29 25 24 25C19 25 11 23 11 15V6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M11 42H37V33C37 25 29 23 24 23C19 23 11 25 11 33V42Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <line x1="7" y1="6" x2="41" y2="6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="7" y1="42" x2="41" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M19 35C19 31 24 29 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
      </svg>
    ),
    title: ['Próximos', 'Estrenos'],
    desc: 'Películas que aún no has visto',
    to: '/pendientes',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 44 }}>
        <line x1="24" y1="7" x2="24" y2="41" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <line x1="7" y1="24" x2="41" y2="24" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    title: ['Nueva', 'Proyección'],
    desc: 'Registrar una nueva experiencia cinematográfica',
    to: '/catalogo?nuevo=1',
  },
]

/* ── Main page ─────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()
  const [top5, setTop5] = useState([])

  useEffect(() => {
    fetchMovies()
      .then(movies =>
        setTop5(
          [...movies]
            .filter(m => m.rating != null)
            .sort((a, b) => Number(b.rating) - Number(a.rating))
            .slice(0, 5)
        )
      )
      .catch(() => {})
  }, [])

  return (
    <TheaterBackground>
      <div style={{ position: 'relative', width: '100%', maxWidth: 1300, padding: '40px 0' }}>

        {/* ── Top-5 panel — over left wall area ─── */}
        <div style={{
          position: 'absolute',
          top: 210, left: 32,
          width: 190,
          zIndex: 5,
          background: 'rgba(12,8,2,0.82)',
          border: '1px solid #5a4010',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)',
        }}>
          {/* Header */}
          <div style={{ padding: '10px 10px 8px', borderBottom: '2px solid #4a3510' }}>
            <MarqueeLights count={14} size={7} />
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '0.6rem', letterSpacing: '0.22em',
                color: '#8a6a30', textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(138,106,48,0.45)',
              }}>
                ◆ Mejores Valoradas ◆
              </span>
            </div>
          </div>

          {/* Rows */}
          {top5.length > 0 ? top5.map((movie, i) => (
            <div
              key={movie.id}
              style={{
                padding: '9px 12px',
                borderBottom: i < 4 ? '1px solid rgba(74,53,16,0.25)' : 'none',
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}
            >
              <span style={{
                color: '#5a4018', fontFamily: "'Cinzel'",
                fontSize: '0.68rem', minWidth: 16, paddingTop: 2,
              }}>
                {i + 1}.
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  color: '#d4c080', fontFamily: 'Georgia, serif',
                  fontSize: '0.78rem', lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {movie.title}
                </div>
                <div style={{
                  color: '#7a5838', fontFamily: 'Georgia, serif',
                  fontSize: '0.68rem', fontStyle: 'italic',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  marginBottom: 2,
                }}>
                  {movie.director ?? '—'}
                </div>
                <span style={{
                  color: '#d4a820', fontFamily: "'Cinzel'",
                  fontSize: '0.65rem', fontWeight: 700,
                }}>
                  {formatRating(movie.rating)}
                </span>
              </div>
            </div>
          )) : (
            <div style={{ padding: '28px 12px', textAlign: 'center', color: '#3a2808', fontFamily: 'Georgia', fontStyle: 'italic', fontSize: '0.75rem' }}>
              Sin datos
            </div>
          )}

          {/* Footer lights */}
          <div style={{ borderTop: '1px solid #3a2808', padding: '8px 10px' }}>
            <MarqueeLights count={14} size={7} />
          </div>
        </div>

        {/* ── Main facade ── */}
        <div style={{
          marginLeft: 240 , marginRight: 80, position: 'relative',
          background: 'rgba(14,9,2,0.78)',
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)',
        }}>

          {/* Header band */}
          <div style={{
            background: 'rgba(20,13,3,0.6)',
            borderBottom: '2px solid #5a4010',
          }}>
            <div style={{ paddingTop: 11, paddingBottom: 11 }}>
              <MarqueeLights count={42} />
            </div>

            {/* Title panel */}
            <div style={{
              position: 'relative', margin: '0 24px 12px',
              border: '1px solid #7a5c18',
              background: 'rgba(10,6,1,0.55)',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5)',
            }}>
              <div style={{ position: 'absolute', top: 6, left: 6 }}><HeaderCorner rot={0}   /></div>
              <div style={{ position: 'absolute', top: 6, right: 6 }}><HeaderCorner rot={90}  /></div>
              <div style={{ position: 'absolute', bottom: 6, left: 6 }}><HeaderCorner rot={270} /></div>
              <div style={{ position: 'absolute', bottom: 6, right: 6 }}><HeaderCorner rot={180} /></div>
              <div style={{ textAlign: 'center', padding: '28px 60px 22px' }}>
                <h1 style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', margin: 0, color: '#edd060',
                  textShadow: '0 0 20px rgba(237,210,96,0.95), 0 0 45px rgba(237,195,64,0.6), 0 0 90px rgba(237,185,40,0.28), 1px 4px 6px rgba(0,0,0,0.95)',
                }}>
                  Cronos Project
                </h1>
                <p style={{
                  fontFamily: "'Cinzel', Georgia, serif", fontSize: '1rem',
                  fontStyle: 'italic', letterSpacing: '0.2em', marginTop: 8,
                  color: '#b89030', textShadow: '0 0 16px rgba(184,144,48,0.7)',
                }}>
                  Archivo Cinematográfico Personal
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 14, paddingLeft: 40, paddingRight: 40 }}>
              <MarqueeLights count={34} />
              <MarqueeLights count={34} />
            </div>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, padding: '28px 32px 28px' }}>
            {CARDS.map(({ icon, title, desc, to }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                style={{
                  position: 'relative', textAlign: 'center', cursor: 'pointer',
                  transition: 'transform 0.28s ease',
                  background: 'rgba(12,7,1,0.72)',
                  border: '2px solid #7a5a18',
                  boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6), 0 0 0 1px #2e2005, 0 6px 28px rgba(0,0,0,0.5)',
                  padding: 0, borderRadius: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.035)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <CardCorners />
                <div style={{ paddingTop: 12, paddingBottom: 4 }}>
                  <MarqueeLights count={12} size={7} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '16px 20px 32px' }}>
                  <div style={{ color: '#c9a840', filter: 'drop-shadow(0 0 10px rgba(201,168,64,0.8))' }}>{icon}</div>
                  <h3 style={{
                    fontFamily: "'Cinzel', Georgia, serif", fontSize: '1.05rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.3, margin: 0,
                    color: '#d4b040', textShadow: '0 0 16px rgba(212,176,64,0.65)',
                  }}>
                    {title.map((line, i) => <span key={i} style={{ display: 'block' }}>{line}</span>)}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #7a5a18)' }} />
                    <span style={{ color: '#8a6a20', fontSize: 8 }}>◆</span>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, #7a5a18)' }} />
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.55, margin: 0, color: '#907848', maxWidth: 145, textAlign: 'center' }}>{desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Quote */}
          <div style={{ borderTop: '1px solid #3a2808', padding: '20px 40px 26px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, #7a5a18)' }} />
              <span style={{ color: '#6a4e18', fontSize: 18 }}>❧</span>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, #7a5a18)' }} />
            </div>
            <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.95rem', color: '#a08848', textShadow: '0 0 10px rgba(160,136,72,0.4)', margin: '0 auto', maxWidth: 580, lineHeight: 1.8 }}>
              "Una película no se termina cuando acaba,<br />sino cuando deja de pensarse."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 10 }}>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, #7a5a18)' }} />
              <span style={{ color: '#6a4e18', fontSize: 14 }}>◈</span>
              <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, #7a5a18)' }} />
            </div>
          </div>

        </div>

        {/* Floor */}
        <div style={{ marginLeft: 240, marginRight: 80, height: 20 }} />

      </div>
    </TheaterBackground>
  )
}
