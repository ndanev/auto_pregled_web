import type { Config } from 'tailwindcss'

// Dizajn tokeni sajta. Boje se koriste kao Tailwind klase, npr. `bg-page`, `text-ink/60`, `border-accent`.
// Ako menjaš paletu, menjaš je ovde — komponente ne bi trebalo da sadrže hex vrednosti.
export default {
  content: ['./app/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Pozadine
        page: '#FBFAF7', // osnovna pozadina stranice (topla skoro-bela)
        sand: '#F3F0E8', // tonirane sekcije: futer, info kutije, placeholder slika
        'sand-deep': '#E6E1D6', // tamniji kraj gradijenta za placeholder slike

        // Tekst
        ink: '#14213D', // glavni tekst i naslovi; svetlije nijanse preko opacity-ja (`text-ink/60`)
        steel: '#5A6B7B', // male sive oznake (eyebrow)

        // Akcenat brenda: dugmad, linkovi, aktivna stanja
        accent: '#D9530E',
        'accent-dark': '#B5420A', // hover stanje
        'accent-light': '#FF7A33', // akcenat na crnoj pozadini (hero)

        // Semafor za ocene i prednosti/mane (vidi scoreTone u utils/carFormat.ts)
        positive: '#178A55',
        caution: '#A87F00',
        negative: '#C8312B',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'], // veliki naslovi (uvek uppercase)
        sans: ['"IBM Plex Sans"', 'sans-serif'], // osnovni tekst
        data: ['"Inter"', 'sans-serif'], // brojevi i oznake; poravnate cifre (vidi tailwind.css)
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
