<script setup lang="ts">
// Pretraga u zaglavlju. Dugme otvara prozor (<dialog>) sa poljem za pretragu i rezultatima.
// - Prečice: "/" ili Ctrl+K (⌘K na Mac-u) otvaraju pretragu, Esc je zatvara (to radi sam <dialog>).
// - Strelice gore/dole biraju rezultat, Enter ga otvara.
// - Lista automobila se učitava tek kad korisnik prvi put otvori pretragu, i pretražuje se u browseru
//   (carMatchesSearch u utils/search.ts), pa su prikazani svi pogoci. Pretraga je namerno lokalna:
//   API-jev ?q= ne prepoznaje npr. "c3" za "C-3". Kad automobila bude mnogo, ovo treba prebaciti na API.
import type { CarSummary } from '~/types/car'

const { fetchCars } = useCarsApi()
const router = useRouter()
const route = useRoute()

// ---------------------------------------------------------------------------
// Podaci i rezultati
// ---------------------------------------------------------------------------

const dialog = ref<HTMLDialogElement | null>(null)
const input = ref<HTMLInputElement | null>(null)

const query = ref('')
const cars = ref<CarSummary[]>([])
// idle = još nije otvarana, loading = učitava listu, ready = lista je tu, error = API nije odgovorio
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const activeIndex = ref(0) // rezultat označen strelicama

const results = computed(() => cars.value.filter((car) => carMatchesSearch(car, query.value)))

// Novi upit → označen je opet prvi rezultat
watch(query, () => {
  activeIndex.value = 0
})

/** Učitava listu automobila samo prvi put (i ponovo, ako je prethodni pokušaj pao). */
async function loadCars() {
  if (status.value === 'ready' || status.value === 'loading') return
  status.value = 'loading'
  try {
    cars.value = (await fetchCars()).data
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

// ---------------------------------------------------------------------------
// Otvaranje i zatvaranje
// ---------------------------------------------------------------------------

function open() {
  dialog.value?.showModal()
  input.value?.focus()
  loadCars()
}

function close() {
  dialog.value?.close()
}

// Klik na tamnu pozadinu oko prozora zatvara pretragu
function handleDialogClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}

// ---------------------------------------------------------------------------
// Tastatura
// ---------------------------------------------------------------------------

// Strelica dole/gore. Posle poslednjeg rezultata ide se na prvi, a pre prvog na poslednji.
function selectNext() {
  const lastIndex = results.value.length - 1
  activeIndex.value = activeIndex.value >= lastIndex ? 0 : activeIndex.value + 1
}

function selectPrevious() {
  const lastIndex = results.value.length - 1
  activeIndex.value = activeIndex.value <= 0 ? lastIndex : activeIndex.value - 1
}

function openActiveResult() {
  const car = results.value[activeIndex.value]
  if (car) router.push(`/automobili/${car.slug}`)
}

// Posle navigacije zatvaramo prozor i brišemo upit
watch(() => route.fullPath, () => {
  close()
  query.value = ''
})

// Globalne prečice za otvaranje
function handleShortcut(event: KeyboardEvent) {
  const target = event.target as HTMLElement
  const isTyping = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)

  const isCtrlK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'
  const isSlash = event.key === '/' && !isTyping

  if (isCtrlK || isSlash) {
    event.preventDefault()
    open()
  }
}

onMounted(() => window.addEventListener('keydown', handleShortcut))
onBeforeUnmount(() => window.removeEventListener('keydown', handleShortcut))
</script>

<template>
  <!-- Desktop: polje-dugme sa tekstom i prečicom -->
  <button
    type="button"
    class="hidden lg:flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-body-sm text-ink/55 hover:border-ink/35 hover:text-ink transition-colors"
    @click="open"
  >
    <SearchIcon :size="16" />
    <span class="xl:pr-6">Pretraži</span>
    <kbd class="hidden xl:inline rounded border border-ink/15 px-1.5 font-data text-data-sm text-ink/45">/</kbd>
  </button>

  <!-- Telefon i tablet: samo ikonica -->
  <button
    type="button"
    class="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/5 transition-colors"
    aria-label="Pretraži automobile"
    @click="open"
  >
    <SearchIcon :size="21" />
  </button>

  <dialog
    ref="dialog"
    class="mt-[10vh] w-[calc(100%-2rem)] max-w-xl rounded-2xl bg-page p-0 text-ink shadow-2xl shadow-ink/20 backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    aria-label="Pretraga automobila"
    @click="handleDialogClick"
  >
    <div class="flex items-center gap-3 border-b border-ink/10 px-5">
      <SearchIcon :size="20" class="shrink-0 text-ink/45" />
      <input
        ref="input"
        v-model="query"
        type="search"
        placeholder="Marka, model, motor ili gorivo — npr. golf tdi"
        aria-label="Pretraži automobile"
        autocomplete="off"
        class="w-full bg-transparent py-4 text-body text-ink placeholder:text-ink/40 focus:outline-none"
        @keydown.down.prevent="selectNext"
        @keydown.up.prevent="selectPrevious"
        @keydown.enter.prevent="openActiveResult"
      >
      <button type="button" class="shrink-0 rounded-md px-2 py-1 text-body-sm text-ink/55 hover:text-ink" @click="close">
        Zatvori
      </button>
    </div>

    <div class="max-h-[60vh] overflow-y-auto p-2">
      <p v-if="!query.trim()" class="px-3 py-6 text-center text-body-sm text-ink/55">
        Počni da kucaš — pretražujemo marke, modele, motore, gorivo i karoseriju.
      </p>
      <p v-else-if="status === 'loading'" class="px-3 py-6 text-center text-body-sm text-ink/55">Učitavam automobile…</p>
      <p v-else-if="status === 'error'" class="px-3 py-6 text-center text-body-sm text-negative">
        Pretraga trenutno ne radi. Pokušaj ponovo za koji trenutak.
      </p>
      <p v-else-if="results.length === 0" class="px-3 py-6 text-center text-body-sm text-ink/55">
        Nema automobila za „{{ query.trim() }}“.
        <NuxtLink to="/automobili" class="link-underline">Pogledaj sve automobile</NuxtLink>
      </p>

      <ul v-else>
        <li v-for="(car, index) in results" :key="car.slug">
          <NuxtLink
            :to="`/automobili/${car.slug}`"
            class="flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors"
            :class="index === activeIndex ? 'bg-accent/10' : 'hover:bg-ink/5'"
            @mouseenter="activeIndex = index"
          >
            <div class="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-sand to-sand-deep">
              <img v-if="car.main_thumbnail_url" :src="car.main_thumbnail_url" alt="" class="h-full w-full object-cover">
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-body font-semibold text-ink">{{ carName(car) }}</p>
              <p class="truncate text-body-sm text-ink/60">{{ car.generation }} · {{ car.engine }}</p>
            </div>
            <span
              v-if="car.overall_rating !== null"
              class="shrink-0 font-display text-data-lg font-bold"
              :class="scoreTone(car.overall_rating).text"
            >{{ formatScore(car.overall_rating) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </dialog>
</template>
