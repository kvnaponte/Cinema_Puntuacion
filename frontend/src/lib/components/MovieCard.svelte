<script>
  import { fly } from 'svelte/transition'

  const { movie, onselect } = $props()

  const COLORS = {
    DIAMOND:  '#c9b37e',
    GOLD:     '#b08d57',
    PLATINUM: '#9fa3a7',
    GOOD:     '#7d8f6b',
    ACEPTABLE:'#a89f8a',
    BAD:      '#6b6b6b'
  }

  const color = $derived(COLORS[movie.category] ?? '#6b6b6b')
  const stars = $derived('★'.repeat(movie.stars ?? 1) + '☆'.repeat(5 - (movie.stars ?? 1)))
</script>

<button
  in:fly={{ x: -10, duration: 200 }}
  onclick={() => onselect(movie)}
  class="w-full text-left bg-cinema-surface border border-cinema-border rounded-lg px-4 py-3
         hover:translate-x-1 hover:bg-cinema-surface2 hover:border-opacity-80
         transition-all duration-200 cursor-pointer group"
  style="border-left: 6px solid {color};"
>
  <div class="flex items-start justify-between gap-3">
    <div class="flex-1 min-w-0">
      <!-- Title + Year -->
      <div class="flex items-baseline gap-2 mb-1">
        <span
          class="font-semibold text-sm leading-tight truncate"
          style="color: {color};"
        >
          {movie.title}
        </span>
        {#if movie.year}
          <span class="text-xs text-gray-500 shrink-0">({movie.year})</span>
        {/if}
      </div>

      <!-- Director · Country -->
      <p class="text-xs text-gray-400 truncate mb-1">
        {#if movie.director}{movie.director}{/if}{#if movie.director && movie.country} · {/if}{#if movie.country}{movie.country}{/if}
      </p>

      <!-- Genre -->
      {#if movie.genre}
        <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">{movie.genre}</p>
      {/if}

      <!-- Stars + Category + Rating -->
      <div class="flex items-center gap-3 flex-wrap">
        <span class="text-sm tracking-widest" style="color: {color};">{stars}</span>
        <span
          class="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
          style="color: {color}; background: {color}18; border: 1px solid {color}44;"
        >
          {movie.category}
        </span>
        {#if movie.rating != null}
          <span class="text-xs text-gray-400 font-mono">{Number(movie.rating).toFixed(1)}</span>
        {/if}
      </div>
    </div>
  </div>
</button>
