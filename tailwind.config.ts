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
        display: ['"Bricolage Grotesque"', 'sans-serif'], // naslovi
        sans: ['Manrope', 'sans-serif'], // osnovni tekst
        data: ['Manrope', 'sans-serif'], // brojevi i oznake; cifre jednake širine (vidi tailwind.css)
      },
      // Oba fonta su varijabilna, pa težine ne moraju biti okrugle stotine.
      // Manrope je po prirodi tanak — zato je "normal" 450 umesto 400, da tekst ne deluje bledo.
      fontWeight: {
        normal: '450',
        medium: '560',
        semibold: '650',
        bold: '720',
        extrabold: '800',
      },
      fontSize: {
        // Najmanja veličina teksta na sajtu je 14px (data-sm), osim eyebrow oznaka koje su uvek velikim slovima.
        eyebrow: ['0.8125rem', { lineHeight: '1', letterSpacing: '0.14em' }], // 13px, MALE OZNAKE IZNAD NASLOVA
        'data-sm': ['0.875rem', { lineHeight: '1.45' }], // 14px
        data: ['1rem', { lineHeight: '1.45' }], // 16px
        'data-lg': ['1.375rem', { lineHeight: '1.2' }], // 22px
        'data-xl': ['2rem', { lineHeight: '1.05' }], // 32px
        'body-sm': ['0.9375rem', { lineHeight: '1.6' }], // 15px — opisi, saveti, sporedni tekst
        body: ['1.0625rem', { lineHeight: '1.7' }], // 17px — osnovni tekst
        'body-lg': ['1.1875rem', { lineHeight: '1.65' }], // 19px — uvodi i istaknut tekst
        'display-sm': ['1.875rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 30px — naslovi sekcija
        'display-md': ['2.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }], // 40px
        'display-lg': ['3.25rem', { lineHeight: '1', letterSpacing: '-0.03em' }], // 52px
        'display-xl': ['4.25rem', { lineHeight: '0.98', letterSpacing: '-0.035em' }], // 68px — glavni naslov stranice
      },
    },
  },
  plugins: [],
} satisfies Config
