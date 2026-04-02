<script>
  import { onMount } from 'svelte'
  import { fetchMovies } from '$lib/api.js'
  import MovieCard from '$lib/components/MovieCard.svelte'
  import MovieModal from '$lib/components/MovieModal.svelte'
  import AddMovieForm from '$lib/components/AddMovieForm.svelte'

  let allMovies     = $state([])
  let query         = $state('')
  let selectedMovie = $state(null)
  let loading       = $state(true)
  let showForm      = $state(false)
  let fetchError    = $state('')

  const filteredMovies = $derived(
    query.trim()
      ? allMovies.filter(m => m.title?.toLowerCase().includes(query.trim().toLowerCase()))
      : allMovies
  )

  async function loadMovies() {
    loading = true
    fetchError = ''
    try {
      allMovies = await fetchMovies()
    } catch (err) {
      fetchError = err.message ?? 'Error desconocido'
    } finally {
      loading = false
    }
  }

  async function handleFormSuccess() {
    showForm = false
    await loadMovies()
  }

  onMount(loadMovies)
</script>

<svelte:head>
  <title>Proyecto Cronos</title>
</svelte:head>

<!-- Page wrapper -->
<div class="min-h-screen bg-cinema-bg relative overflow-x-hidden">

  <!-- Ambient top glow -->
  <div
    class="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-20 blur-3xl z-0"
    style="background: radial-gradient(ellipse at top, #bfa26f 0%, transparent 70%);"
  ></div>

  <!-- Main container -->
  <div class="relative z-10 max-w-3xl mx-auto px-4 py-10">

    <!-- ──────────── HEADER ──────────── -->
    <header class="text-center mb-10">
      <div class="inline-block relative">
        <!-- Film strip decoration top -->
        <div class="flex justify-center gap-2 mb-3 opacity-30">
          {#each Array(8) as _}
            <span class="w-4 h-2.5 border border-cinema-gold rounded-sm bg-transparent"></span>
          {/each}
        </div>

        <h1
          class="text-4xl md:text-5xl font-bold tracking-[0.2em] uppercase mb-1"
          style="
            font-family: 'Cinzel', Georgia, serif;
            color: #bfa26f;
            text-shadow: 0 0 30px rgba(191,162,111,0.5), 0 0 60px rgba(191,162,111,0.2);
          "
        >
          Proyecto Cronos
        </h1>

        <p class="text-xs uppercase tracking-[0.35em] text-gray-500 mt-2">
          Catálogo personal de cine
        </p>

        <!-- Film strip decoration bottom -->
        <div class="flex justify-center gap-2 mt-3 opacity-30">
          {#each Array(8) as _}
            <span class="w-4 h-2.5 border border-cinema-gold rounded-sm bg-transparent"></span>
          {/each}
        </div>
      </div>

      <!-- Separator -->
      <div class="mt-6 flex items-center gap-4">
        <div class="flex-1 h-px" style="background: linear-gradient(to right, transparent, #bfa26f55);"></div>
        <span class="text-cinema-gold text-lg opacity-60">◆</span>
        <div class="flex-1 h-px" style="background: linear-gradient(to left, transparent, #bfa26f55);"></div>
      </div>
    </header>

    <!-- ──────────── TOOLBAR ──────────── -->
    <div class="flex gap-3 mb-4">
      <!-- Search -->
      <div class="relative flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm pointer-events-none">⌕</span>
        <input
          class="input-cinema pl-8"
          type="search"
          placeholder="Buscar película..."
          bind:value={query}
        />
      </div>

      <!-- Toggle form -->
      <button
        onclick={() => showForm = !showForm}
        class="px-4 py-2 rounded text-sm font-semibold uppercase tracking-wider border shrink-0
               transition-all duration-200"
        style={showForm
          ? 'background: #bfa26f; color: #121212; border-color: #bfa26f;'
          : 'background: transparent; color: #bfa26f; border-color: #bfa26f55;'}
      >
        {showForm ? '✕ Cerrar' : '+ Agregar'}
      </button>
    </div>

    <!-- ──────────── FORM ──────────── -->
    {#if showForm}
      <div class="mb-6">
        <AddMovieForm onSuccess={handleFormSuccess} />
      </div>
    {/if}

    <!-- ──────────── STATS ──────────── -->
    {#if !loading && !fetchError && allMovies.length > 0}
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xs text-gray-600 uppercase tracking-widest">
          {filteredMovies.length} {filteredMovies.length === 1 ? 'película' : 'películas'}
          {query.trim() ? `· "${query.trim()}"` : ''}
        </span>
        <div class="flex-1 h-px bg-cinema-border opacity-50"></div>
      </div>
    {/if}

    <!-- ──────────── MOVIE LIST ──────────── -->
    {#if loading}
      <div class="flex flex-col items-center justify-center py-20 gap-4">
        <div
          class="w-10 h-10 rounded-full border-2 border-cinema-gold border-t-transparent animate-spin"
        ></div>
        <p class="text-xs uppercase tracking-widest text-gray-600">Cargando catálogo...</p>
      </div>

    {:else if fetchError}
      <div class="text-center py-16">
        <p class="text-red-400 mb-2">Error al cargar las películas</p>
        <p class="text-xs text-gray-600 mb-4">{fetchError}</p>
        <button
          onclick={loadMovies}
          class="text-xs text-cinema-gold border border-cinema-gold/40 px-4 py-2 rounded hover:bg-cinema-gold/10 transition-colors"
        >
          Reintentar
        </button>
      </div>

    {:else if filteredMovies.length === 0}
      <div class="text-center py-16">
        <p class="text-4xl mb-4 opacity-20">🎬</p>
        <p class="text-gray-500 text-sm">
          {query.trim() ? 'No se encontraron resultados' : 'El catálogo está vacío'}
        </p>
      </div>

    {:else}
      <div class="flex flex-col gap-2">
        {#each filteredMovies as movie (movie.id)}
          <MovieCard {movie} onselect={(m) => selectedMovie = m} />
        {/each}
      </div>
    {/if}

  </div><!-- /max-w -->
</div><!-- /page wrapper -->

<!-- ──────────── MODAL ──────────── -->
{#if selectedMovie}
  <MovieModal movie={selectedMovie} onclose={() => selectedMovie = null} />
{/if}
