<script>
  import { fade, fly } from 'svelte/transition'

  const { movie, onclose } = $props()

  const COLORS = {
    DIAMOND:  '#c9b37e',
    GOLD:     '#b08d57',
    PLATINUM: '#9fa3a7',
    GOOD:     '#7d8f6b',
    ACEPTABLE:'#a89f8a',
    BAD:      '#6b6b6b'
  }

  const GLOWS = {
    DIAMOND:  '0 0 40px rgba(201,179,126,0.45), 0 0 80px rgba(201,179,126,0.2)',
    GOLD:     '0 0 40px rgba(176,141,87,0.45), 0 0 80px rgba(176,141,87,0.2)',
    PLATINUM: '0 0 40px rgba(159,163,167,0.35), 0 0 80px rgba(159,163,167,0.15)',
    GOOD:     '0 0 40px rgba(125,143,107,0.35), 0 0 80px rgba(125,143,107,0.15)',
    ACEPTABLE:'0 0 30px rgba(168,159,138,0.3)',
    BAD:      '0 0 20px rgba(107,107,107,0.25)'
  }

  const color = $derived(COLORS[movie.category] ?? '#6b6b6b')
  const glow  = $derived(GLOWS[movie.category] ?? 'none')
  const stars = $derived('★'.repeat(movie.stars ?? 1) + '☆'.repeat(5 - (movie.stars ?? 1)))

  function handleKeydown(e) {
    if (e.key === 'Escape') onclose()
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Backdrop -->
<div
  transition:fade={{ duration: 200 }}
  role="dialog"
  aria-modal="true"
  aria-label="Detalles de película"
  class="fixed inset-0 z-50 flex items-center justify-center p-4"
  style="background: rgba(0,0,0,0.85);"
  onclick={onclose}
>
  <!-- Modal content -->
  <div
    transition:fly={{ y: 30, duration: 300 }}
    onclick={(e) => e.stopPropagation()}
    class="relative film-grain projector-on w-full max-w-2xl rounded-xl overflow-hidden"
    style="
      background: linear-gradient(135deg, #3a2a1a 0%, #1f150d 60%, #0d0a06 100%);
      border: 6px solid {color};
      box-shadow: {glow};
      max-height: 90vh;
      overflow-y: auto;
    "
  >
    <!-- Glass overlay -->
    <div
      class="absolute inset-0 pointer-events-none z-0 rounded-xl"
      style="background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);"
    ></div>

    <!-- Close button -->
    <button
      onclick={onclose}
      class="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full
             text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-lg leading-none"
      aria-label="Cerrar"
    >
      ✕
    </button>

    <!-- Inner content -->
    <div class="relative z-10 p-6 flex gap-6">
      <!-- Poster -->
      {#if movie.cover_url}
        <div class="shrink-0 w-36 rounded-lg overflow-hidden shadow-2xl"
             style="border: 2px solid {color}44;">
          <img
            src={movie.cover_url}
            alt="Portada de {movie.title}"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      {/if}

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <h2
          class="text-2xl font-bold leading-tight mb-1"
          style="color: {color}; font-family: 'Cinzel', Georgia, serif;"
        >
          {movie.title}
        </h2>

        {#if movie.year}
          <p class="text-sm text-gray-400 mb-4">{movie.year}</p>
        {/if}

        <!-- Metadata list -->
        <dl class="space-y-2 mb-4">
          {#each [
            ['Director', movie.director],
            ['País', movie.country],
            ['Productora', movie.producer],
            ['Distribuidora', movie.distributor],
          ] as [label, value]}
            {#if value}
              <div class="flex gap-3 pl-3" style="border-left: 3px solid {color}66;">
                <dt class="text-xs text-gray-500 uppercase tracking-wider w-24 shrink-0 pt-0.5">{label}</dt>
                <dd class="text-sm text-cinema-text">{value}</dd>
              </div>
            {/if}
          {/each}
        </dl>

        <!-- Genre -->
        {#if movie.genre}
          <p class="text-xs uppercase tracking-widest text-gray-500 mb-4">{movie.genre}</p>
        {/if}

        <!-- Rating + Stars + Category -->
        <div class="flex items-center gap-4 flex-wrap">
          {#if movie.rating != null}
            <span
              class="text-3xl font-bold font-mono"
              style="color: {color};"
            >
              {Number(movie.rating).toFixed(1)}
            </span>
          {/if}
          <div class="flex flex-col gap-1">
            <span class="text-xl tracking-widest" style="color: {color};">{stars}</span>
            <span
              class="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded self-start"
              style="color: {color}; background: {color}1a; border: 1px solid {color}55;"
            >
              {movie.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
