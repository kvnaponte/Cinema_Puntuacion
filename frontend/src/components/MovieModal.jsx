import { useEffect } from 'react'

const COLORS = {
  DIAMOND:   '#c9b37e',
  GOLD:      '#b08d57',
  PLATINUM:  '#9fa3a7',
  GOOD:      '#7d8f6b',
  ACEPTABLE: '#a89f8a',
  BAD:       '#6b6b6b',
}

const GLOWS = {
  DIAMOND:   '0 0 40px rgba(201,179,126,0.45), 0 0 80px rgba(201,179,126,0.2)',
  GOLD:      '0 0 40px rgba(176,141,87,0.45), 0 0 80px rgba(176,141,87,0.2)',
  PLATINUM:  '0 0 40px rgba(159,163,167,0.35), 0 0 80px rgba(159,163,167,0.15)',
  GOOD:      '0 0 40px rgba(125,143,107,0.35), 0 0 80px rgba(125,143,107,0.15)',
  ACEPTABLE: '0 0 30px rgba(168,159,138,0.3)',
  BAD:       '0 0 20px rgba(107,107,107,0.25)',
}

const META = [
  ['Director',     'director'],
  ['País',         'country'],
  ['Productora',   'producer'],
  ['Distribuidora','distributor'],
]

export default function MovieModal({ movie, onClose }) {
  const color = COLORS[movie.category] ?? '#6b6b6b'
  const glow  = GLOWS[movie.category] ?? 'none'
  const stars = '★'.repeat(movie.stars ?? 1) + '☆'.repeat(5 - (movie.stars ?? 1))

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Detalles de película"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="relative film-grain projector-on w-full max-w-2xl rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #3a2a1a 0%, #1f150d 60%, #0d0a06 100%)',
          border: `6px solid ${color}`,
          boxShadow: glow,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Glass overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-xl"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full
                     text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Content */}
        <div className="relative z-10 p-6 flex gap-6">
          {/* Poster */}
          {movie.cover_url && (
            <div
              className="shrink-0 w-36 rounded-lg overflow-hidden shadow-2xl"
              style={{ border: `2px solid ${color}44` }}
            >
              <img
                src={movie.cover_url}
                alt={`Portada de ${movie.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h2
              className="text-2xl font-bold leading-tight mb-1"
              style={{ color, fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {movie.title}
            </h2>

            {movie.year && (
              <p className="text-sm text-gray-400 mb-4">{movie.year}</p>
            )}

            {/* Metadata */}
            <dl className="space-y-2 mb-4">
              {META.map(([label, key]) => movie[key] && (
                <div key={key} className="flex gap-3 pl-3" style={{ borderLeft: `3px solid ${color}66` }}>
                  <dt className="text-xs text-gray-500 uppercase tracking-wider w-24 shrink-0 pt-0.5">{label}</dt>
                  <dd className="text-sm text-cinema-text">{movie[key]}</dd>
                </div>
              ))}
            </dl>

            {movie.genre && (
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">{movie.genre}</p>
            )}

            {/* Rating + Stars + Category */}
            <div className="flex items-center gap-4 flex-wrap">
              {movie.rating != null && (
                <span className="text-3xl font-bold font-mono" style={{ color }}>
                  {Number(movie.rating) === 10 ? '10' : Number(movie.rating).toFixed(1)}
                </span>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xl tracking-widest" style={{ color }}>{stars}</span>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded self-start"
                  style={{ color, background: `${color}1a`, border: `1px solid ${color}55` }}
                >
                  {movie.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
