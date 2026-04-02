const COLORS = {
  DIAMOND:   '#c9b37e',
  GOLD:      '#b08d57',
  PLATINUM:  '#9fa3a7',
  GOOD:      '#7d8f6b',
  ACEPTABLE: '#a89f8a',
  BAD:       '#6b6b6b',
}

export default function MovieCard({ movie, onSelect }) {
  const color = COLORS[movie.category] ?? '#6b6b6b'
  const stars = '★'.repeat(movie.stars ?? 1) + '☆'.repeat(5 - (movie.stars ?? 1))

  return (
    <button
      onClick={() => onSelect(movie)}
      className="w-full text-left bg-cinema-surface border border-cinema-border rounded-lg px-4 py-3
                 hover:translate-x-1 hover:bg-cinema-surface2 hover:border-opacity-80
                 transition-all duration-200 cursor-pointer group animate-slide-in"
      style={{ borderLeft: `6px solid ${color}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Title + Year */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm leading-tight truncate" style={{ color }}>
              {movie.title}
            </span>
            {movie.year && (
              <span className="text-xs text-gray-500 shrink-0">({movie.year})</span>
            )}
          </div>

          {/* Director · Country */}
          <p className="text-xs text-gray-400 truncate mb-1">
            {[movie.director, movie.country].filter(Boolean).join(' · ')}
          </p>

          {/* Genre */}
          {movie.genre && (
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{movie.genre}</p>
          )}

          {/* Stars + Category + Rating */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm tracking-widest" style={{ color }}>{stars}</span>
            <span
              className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ color, background: `${color}18`, border: `1px solid ${color}44` }}
            >
              {movie.category}
            </span>
            {movie.rating != null && (
              <span className="text-xs text-gray-400 font-mono">{Number(movie.rating).toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
