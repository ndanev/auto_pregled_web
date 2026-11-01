# Auto Pregled — web

Sajt sa AI analizama polovnih automobila: pouzdanost, troškovi, najčešći kvarovi i saveti pre kupovine.
Ovo je samo frontend; podaci stižu iz zasebnog backend API-ja.

**Tehnologije:** [Nuxt 4](https://nuxt.com) (Vue 3 + TypeScript), [Tailwind CSS](https://tailwindcss.com) preko `@nuxtjs/tailwindcss`.

## Pokretanje

Potreban je Node.js i pokrenut backend API (podrazumevano na `http://localhost:8000`).

```bash
npm install
npm run dev        # http://localhost:3000
```

Ostale komande:

```bash
npm run build      # produkcijski build
npm run preview    # lokalni pregled produkcijskog builda
```

### Promenljive okruženja

| Promenljiva | Podrazumevano | Čemu služi |
|---|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | adresa backend API-ja |
| `NUXT_PUBLIC_SITE_URL` | `http://localhost:3000` | javna adresa sajta (koristi se u `sitemap.xml`) |

> Posle izmene `tailwind.config.ts` ili `nuxt.config.ts` restartuj `npm run dev` — te izmene se ne učitavaju automatski.

## Struktura projekta

```
app/
├── pages/                    Stranice — putanja fajla je URL (Nuxt file-based routing)
│   ├── index.vue                 /                    početna
│   ├── automobili/index.vue      /automobili          lista sa pretragom i filterima
│   ├── automobili/[slug].vue     /automobili/:slug    detalj automobila
│   ├── marke/index.vue           /marke               sve marke
│   ├── marke/[slug].vue          /marke/:slug         automobili jedne marke
│   ├── uporedi/index.vue         /uporedi?a=…&b=…     poređenje dva automobila
│   ├── vodic.vue                 /vodic               vodič za kupovinu, korak po korak
│   ├── recnik.vue                /recnik              rečnik pojmova (DPF, DSG…)
│   └── kako-ocenjujemo.vue       /kako-ocenjujemo     metodologija i značenje ocena
│
├── components/               Vue komponente (automatski uvezene, bez import-a)
│   ├── car-detail/               sekcije stranice automobila  → <CarDetailHero>, <CarDetailCosts>…
│   ├── home/                     blokovi početne stranice     → <HomeHero>, <HomeCompareCta>
│   ├── compare/                  birač i rezultat poređenja   → <ComparePicker>, <CompareResults>, <CompareRow>…
│   └── *.vue                     deljene komponente           → <CarCard>, <ScoreBar>, <TheHeader>…
│                                 za dugačke stranice: <PageHeader>, <SectionNav>, <ContentSection>,
│                                 <BulletList>, <NumberedList>, <InfoCardGrid>
│
├── composables/              Logika koja se deli između komponenti (useNešto)
│   ├── useApi.ts                 HTTP klijent ka backend-u
│   ├── useCarsApi.ts             pozivi /api/cars
│   ├── useBrandsApi.ts           pozivi /api/brands
│   ├── useCompare.ts             automobili izabrani za poređenje (deljeno stanje)
│   └── useCarSeo.ts              meta tagovi i JSON-LD za stranicu automobila
│
├── utils/                    Čiste pomoćne funkcije i konstante (automatski uvezene)
│   ├── carFormat.ts              formatiranje ocena, oznaka, čitanje brojeva iz AI teksta
│   ├── glossary.ts               sadržaj rečnika + findGlossaryTerm()
│   ├── inspection.ts             opšti spisak za pregled (početna i /vodic)
│   ├── compare.ts                ko je bolji u kom redu na /uporedi + predlozi poređenja
│   ├── fuelCost.ts               kalkulator troška goriva: početne cene goriva i račun
│   ├── search.ts                 pretraga u zaglavlju (bez kvačica, crtica i razmaka)
│   ├── carFilters.ts             opcije za gorivo i menjač
│   └── bodyTypeCategories.ts     opcije za karoseriju
│
├── types/                    TypeScript tipovi API odgovora
├── layouts/default.vue       Okvir svake stranice: header, sadržaj, futer, traka za poređenje
└── assets/css/tailwind.css   Globalni stilovi i klasa .site-container

server/routes/sitemap.xml.ts  Generiše /sitemap.xml iz liste automobila i marki
```

### Kako Nuxt pronalazi komponente

Komponente, composable-i i `utils` se **ne uvoze ručno** — Nuxt ih pronalazi sam.
Ime komponente u podfolderu dobija prefiks foldera:

| Fajl | Koristi se kao |
|---|---|
| `components/CarCard.vue` | `<CarCard />` |
| `components/car-detail/Hero.vue` | `<CarDetailHero />` |
| `components/home/Hero.vue` | `<HomeHero />` |

Ako ti editor ne prepoznaje auto-importe, pokreni `npm run dev` jednom — Nuxt tada generiše tipove u `.nuxt/`.

## Tok podataka

1. Stranica poziva API kroz composable, uvek unutar `useAsyncData` (radi i na serveru, pa je sadržaj vidljiv pretraživačima):
   ```ts
   const { fetchCarBySlug } = useCarsApi()
   const { data } = await useAsyncData(`car-${slug}`, () => fetchCarBySlug(slug))
   ```
2. Stranica prosleđuje podatke komponentama kroz props.
3. Komponente formatiraju vrednosti funkcijama iz `utils/carFormat.ts` (`formatScore`, `fuelLabel`, `extractFuel`…).

### Važno: AI analiza vraća slobodan tekst

Polja kao što su potrošnja (`fuel_consumption`) i cene popravki (`estimated_cost`) **nisu brojevi** —
AI nekad vrati `"procena 4.5–5.6 L/100km"`, a nekad celu rečenicu bez broja.
Zato se ne prikazuju direktno, nego preko `extractFuel()` / `extractCost()`, koji vraćaju broj
za prikaz ili `null` (tada komponenta prikazuje originalni tekst). Vidi komentare u `types/car.ts`.

Isto važi za vrednosti kao `fuel_type: 'dizel'` ili `transmission: 'dsg_cvt'` — za prikaz se koriste
`fuelLabel()` / `transmissionLabel()` / `bodyTypeLabel()`, koje vraćaju "Dizel", "DSG/CVT" itd.

## Dizajn sistem

Sve boje i fontovi su definisani u `tailwind.config.ts`. U komponentama koristi tokene, ne hex vrednosti.

| Token | Upotreba | Primer klase |
|---|---|---|
| `page` | pozadina stranice | `bg-page` |
| `sand`, `sand-deep` | tonirane sekcije, info kutije | `bg-sand` |
| `ink` | tekst; svetlije nijanse preko providnosti | `text-ink`, `text-ink/60`, `border-ink/10` |
| `steel` | male sive oznake iznad naslova | `text-steel` |
| `accent`, `accent-dark`, `accent-light` | dugmad, linkovi, aktivna stanja | `bg-accent hover:bg-accent-dark` |
| `positive` / `caution` / `negative` | semafor za ocene, prednosti i mane | `text-positive` |

Fontovi: `font-display` = Bricolage Grotesque (naslovi, u normalnoj rečenici — ne velikim slovima), `font-sans` = Manrope (tekst), `font-data` = Manrope sa ciframa jednake širine (brojevi i oznake). Oba se učitavaju sa Google Fonts u `nuxt.config.ts`.

Najmanja veličina teksta je 14px (`text-data-sm`); za opise i savete koristi `text-body-sm` (15px), a za osnovni tekst `text-body` (17px). Za sivi tekst ne idi ispod `text-ink/55`, inače postaje teško čitljiv.

Za boju ocene koristi `scoreTone(score)` umesto ručnog biranja — tako sve ocene na sajtu imaju iste pragove.

### Dugmad i linkovi

Za dugmad i linkove koristi gotove klase iz `assets/css/tailwind.css` umesto da ponavljaš Tailwind klase:

| Klasa | Izgled | Primer |
|---|---|---|
| `btn-primary` | narandžasto dugme — glavna akcija | `<NuxtLink to="/automobili" class="btn-primary">Pogledaj automobile</NuxtLink>` |
| `btn-secondary` | dugme sa okvirom — sporedna akcija | `<button class="btn-secondary">Počni ispočetka</button>` |
| `link-underline` | tekst sa narandžastom linijom ispod | `<NuxtLink class="text-body-sm link-underline">Prikaži sve →</NuxtLink>` |

Za pun naziv automobila koristi `carName(car)` ("Renault Kadjar"), a za sortiranje po oceni `sortByRating(cars)`.

### Širina stranice

Svaki blok sadržaja koristi klasu `site-container` (definisana u `assets/css/tailwind.css`):
pun ekran sa malim razmakom na telefonu, 80% širine na desktopu, najviše 1800px.

```html
<section class="site-container py-12">…</section>
```

## Kako da…

**…dodam novu sekciju na stranicu automobila**

1. Napravi `components/car-detail/MojaSekcija.vue` i umotaj sadržaj u `<ContentSection id="moja-sekcija" title="Naslov">`.
2. Dodaj `<CarDetailMojaSekcija :analysis="analysis" />` u `pages/automobili/[slug].vue`.
3. Dodaj `{ id: 'moja-sekcija', label: 'Naslov' }` u `navItems` u istoj stranici, da se pojavi u navigaciji.

**…dodam pojam u rečnik**

Dodaj objekat u `GLOSSARY` u `utils/glossary.ts`. Stranica `/recnik` ga prikazuje automatski, a u sekciji
"Poznati problemi" na stranici automobila pojaviće se link ka njemu kad tekst kvara sadrži neku od `keywords`
(mala slova, može i deo reči — npr. `'turbin'` pogađa i "turbina" i "turbine").

**…dodam novu sadržajnu stranicu (kao vodič)**

Napravi fajl u `pages/` i složi ga od `<PageHeader>`, `<SectionNav>` i `<ContentSection>` — pogledaj `pages/vodic.vue`
kao primer. Ne zaboravi link u futeru (`components/TheFooter.vue`) i adresu u `server/routes/sitemap.xml.ts`.

**…dodam novu opciju filtera (npr. novo gorivo)**

Dodaj stavku u `FUEL_TYPE_OPTIONS` u `utils/carFilters.ts`. Filter na `/automobili` i oznake na celom sajtu je preuzimaju automatski.

**…ažuriram početne cene goriva u kalkulatoru**

Promeni `DEFAULT_FUEL_PRICES` u `utils/fuelCost.ts`. Korisnici koji su već upisali svoju cenu i dalje vide svoju
(pamti se u browseru pod ključem `fuel-calculator`).

**…promenim boju akcenta**

Promeni `accent`, `accent-dark` i `accent-light` u `tailwind.config.ts`. Jedini izuzetak je narandžasti odsjaj
u `components/home/Hero.vue`, koji koristi `rgba(…)` vrednost u gradijentu — nju promeni ručno.
