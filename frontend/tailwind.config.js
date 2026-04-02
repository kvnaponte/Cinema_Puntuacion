/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: '#121212',
          surface: '#1e1e1e',
          surface2: '#252525',
          text: '#f5f0e1',
          gold: '#bfa26f',
          border: '#3a3a3a',
          diamond: '#c9b37e',
          catgold: '#b08d57',
          platinum: '#9fa3a7',
          good: '#7d8f6b',
          aceptable: '#a89f8a',
          bad: '#6b6b6b',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      }
    }
  }
}
