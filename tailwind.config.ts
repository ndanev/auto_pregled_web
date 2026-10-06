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
        canvas: '#121312',
        surface: '#0d0d0d',
        ink: '#F4F6F5',
        amber: '#1763f0',
        'amber-dark': '#1763f0',
        steel: '#8FA3B0',
        diagnostic: '#4FB380',
        rust: '#E07A5F',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
        'data-sm': ['0.8125rem', { lineHeight: '1.4' }],
        data: ['0.9375rem', { lineHeight: '1.4' }],
        'data-lg': ['1.25rem', { lineHeight: '1.2' }],
        'data-xl': ['1.875rem', { lineHeight: '1' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        body: ['1rem', { lineHeight: '1.7' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'display-sm': ['1.75rem', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-md': ['2.75rem', { lineHeight: '0.9', letterSpacing: '-0.01em' }],
        'display-lg': ['3.5rem', { lineHeight: '0.88', letterSpacing: '-0.01em' }],
        'display-xl': ['4.5rem', { lineHeight: '0.86', letterSpacing: '-0.01em' }],
      },
    },
  },
  plugins: [],
} satisfies Config