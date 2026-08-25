import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0C0E12',
        surface: '#171A20',
        ink: '#F3F1EA',
        amber: '#E8A33D',
        steel: '#7C93B3',
        diagnostic: '#5FA980',
        rust: '#C75B3D',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        // Mono — uvek uppercase labele/eyebrow tekst kroz ceo sajt
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        // Mono — vrednosti podataka (specifikacije, cene, brojevi)
        'data-sm': ['0.8125rem', { lineHeight: '1.4' }],
        data: ['0.9375rem', { lineHeight: '1.4' }],
        'data-lg': ['1.25rem', { lineHeight: '1.2' }],
        'data-xl': ['1.875rem', { lineHeight: '1' }],
        // Sans — telo teksta
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.7' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        // Display — naslovi
        'display-sm': ['1.75rem', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-md': ['2.75rem', { lineHeight: '0.9', letterSpacing: '-0.01em' }],
        'display-lg': ['3.5rem', { lineHeight: '0.88', letterSpacing: '-0.01em' }],
        'display-xl': ['4.5rem', { lineHeight: '0.86', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [],
} satisfies Config