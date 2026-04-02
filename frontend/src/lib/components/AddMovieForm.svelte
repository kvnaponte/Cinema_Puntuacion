<script>
  import { createMovie } from '$lib/api.js'

  const { onSuccess } = $props()

  let loading = $state(false)
  let error   = $state('')

  let form = $state({
    title:       '',
    year:        '',
    rating:      '',
    director:    '',
    country:     '',
    producer:    '',
    distributor: '',
    genre:       '',
    cover_url:   ''
  })

  async function handleSubmit(e) {
    e.preventDefault()
    error = ''
    loading = true

    try {
      const ratingStr = form.rating.replace(',', '.')
      const payload = {
        title:       form.title || undefined,
        year:        form.year  ? parseInt(form.year)    : undefined,
        rating:      ratingStr  ? parseFloat(ratingStr)  : undefined,
        director:    form.director    || undefined,
        country:     form.country     || undefined,
        producer:    form.producer    || undefined,
        distributor: form.distributor || undefined,
        genre:       form.genre       || undefined,
        cover_url:   form.cover_url   || undefined,
      }

      await createMovie(payload)

      // Reset form
      form = {
        title: '', year: '', rating: '', director: '',
        country: '', producer: '', distributor: '', genre: '', cover_url: ''
      }

      onSuccess()
    } catch (err) {
      error = err.message ?? 'Error desconocido'
    } finally {
      loading = false
    }
  }
</script>

<form
  onsubmit={handleSubmit}
  class="bg-cinema-surface border border-cinema-border rounded-xl p-6"
>
  <h3 class="text-cinema-gold text-sm uppercase tracking-widest mb-4 font-semibold">
    Nueva Película
  </h3>

  {#if error}
    <div class="mb-4 px-3 py-2 rounded bg-red-900/30 border border-red-700/50 text-red-300 text-sm">
      {error}
    </div>
  {/if}

  <div class="grid grid-cols-2 gap-3">
    <!-- Title (full width) -->
    <div class="col-span-2">
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Título *</label>
      <input
        class="input-cinema"
        placeholder="Título de la película"
        bind:value={form.title}
        required
      />
    </div>

    <!-- Year -->
    <div>
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Año *</label>
      <input
        class="input-cinema"
        type="number"
        placeholder="2024"
        bind:value={form.year}
        required
      />
    </div>

    <!-- Rating -->
    <div>
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Rating *</label>
      <input
        class="input-cinema"
        placeholder="8.5"
        bind:value={form.rating}
        required
      />
    </div>

    <!-- Director -->
    <div>
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Director</label>
      <input
        class="input-cinema"
        placeholder="Nombre del director"
        bind:value={form.director}
      />
    </div>

    <!-- Country -->
    <div>
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">País</label>
      <input
        class="input-cinema"
        placeholder="País de origen"
        bind:value={form.country}
      />
    </div>

    <!-- Producer -->
    <div>
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Productora</label>
      <input
        class="input-cinema"
        placeholder="Productora"
        bind:value={form.producer}
      />
    </div>

    <!-- Distributor -->
    <div>
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Distribuidora</label>
      <input
        class="input-cinema"
        placeholder="Distribuidora"
        bind:value={form.distributor}
      />
    </div>

    <!-- Genre (full width) -->
    <div class="col-span-2">
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Género</label>
      <input
        class="input-cinema"
        placeholder="Drama, Thriller, Ciencia ficción..."
        bind:value={form.genre}
      />
    </div>

    <!-- Cover URL (full width) -->
    <div class="col-span-2">
      <label class="block text-xs text-gray-500 uppercase tracking-wider mb-1">URL Portada</label>
      <input
        class="input-cinema"
        type="url"
        placeholder="https://..."
        bind:value={form.cover_url}
      />
    </div>

    <!-- Submit -->
    <div class="col-span-2 flex justify-end mt-2">
      <button
        type="submit"
        disabled={loading}
        class="px-6 py-2 rounded text-sm font-semibold uppercase tracking-wider
               border border-cinema-gold text-cinema-gold
               hover:bg-cinema-gold hover:text-cinema-bg
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all duration-200"
      >
        {loading ? 'Agregando...' : 'Agregar Película'}
      </button>
    </div>
  </div>
</form>
