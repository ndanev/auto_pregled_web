<script setup lang="ts">
// "Pronađi auto za sebe": tri pitanja, jedno po jedno. Svaki odgovor je jedan filter liste automobila,
// pa na kraju vodimo korisnika na /automobili sa već postavljenim filterima.
// Broj odgovarajućih modela računamo odmah iz liste koju je početna već učitala.
import type { CarSummary } from '~/types/car'

const props = defineProps<{ cars: CarSummary[] }>()

// Ključ pitanja je ujedno i ime query parametra na /automobili (vidi pages/automobili/index.vue).
type FilterKey = 'fuel_type' | 'body_type' | 'transmission'

interface Choice {
  label: string
  hint?: string
  value: string // '' znači "svejedno" — taj filter se ne primenjuje
}

interface Question {
  key: FilterKey
  title: string
  choices: Choice[]
}

const QUESTIONS: Question[] = [
  {
    key: 'fuel_type',
    title: 'Gde najviše voziš?',
    choices: [
      { label: 'Po gradu', hint: 'Benzinac — dizel ne voli kratke vožnje (DPF filter)', value: 'benzin' },
      { label: 'Na duge relacije', hint: 'Dizel — štedljiv na autoputu', value: 'dizel' },
      { label: 'Svega po malo', hint: 'Prikaži sve vrste goriva', value: '' },
    ],
  },
  {
    key: 'body_type',
    title: 'Šta ti je najvažnije?',
    choices: [
      { label: 'Lako parkiranje', hint: 'Hečbek — kompaktan i praktičan', value: 'hecbek' },
      { label: 'Veliki prtljažnik', hint: 'Karavan — za porodicu i putovanja', value: 'karavan' },
      { label: 'Viša pozicija za volanom', hint: 'SUV — pregledniji i udobniji za ulazak', value: 'suv' },
      { label: 'Komfor na putu', hint: 'Limuzina — mirna i prostrana', value: 'limuzina' },
    ],
  },
  {
    key: 'transmission',
    title: 'Koji menjač želiš?',
    choices: [
      ...TRANSMISSION_OPTIONS.map((option) => ({ label: option.label, value: option.value })),
      { label: 'Svejedno mi je', value: '' },
    ],
  },
]

const step = ref(0)
const answers = reactive<Record<FilterKey, string>>({ fuel_type: '', body_type: '', transmission: '' })

const isFinished = computed(() => step.value >= QUESTIONS.length)
const currentQuestion = computed(() => QUESTIONS[step.value])

function choose(value: string) {
  if (!currentQuestion.value) return
  answers[currentQuestion.value.key] = value
  step.value++
}

function goBack() {
  if (step.value > 0) step.value--
}

function restart() {
  answers.fuel_type = ''
  answers.body_type = ''
  answers.transmission = ''
  step.value = 0
}

// Automobili koji odgovaraju dosadašnjim odgovorima (prazan odgovor = bez filtera)
const matches = computed(() =>
  props.cars.filter((car) =>
    (Object.keys(answers) as FilterKey[]).every((key) => !answers[key] || car[key] === answers[key])
  )
)

// Query za /automobili: samo filteri koji su stvarno izabrani
const resultsQuery = computed(() => Object.fromEntries(Object.entries(answers).filter(([, value]) => value)))
</script>

<template>
  <section class="site-container py-14">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-14 rounded-3xl border border-ink/10 bg-white p-6 sm:p-10">
      <!-- Levo: uvod -->
      <div>
        <span class="font-data text-eyebrow text-steel">NE ZNAŠ ODAKLE DA KRENEŠ?</span>
        <h2 class="font-display font-bold text-display-sm md:text-display-md text-ink mt-2">Pronađi auto za sebe</h2>
        <p class="mt-4 text-body text-ink/65 max-w-md">
          Odgovori na tri kratka pitanja i pokazaćemo ti modele koji odgovaraju tvom načinu vožnje.
        </p>
        <p class="mt-6 font-data text-data-sm text-ink/60">
          <span class="text-data-lg font-semibold text-ink">{{ matches.length }}</span>
          {{ matches.length === 1 ? 'model odgovara' : 'modela odgovara' }} tvom izboru
        </p>
      </div>

      <!-- Desno: trenutno pitanje ili rezultat -->
      <div>
        <template v-if="!isFinished && currentQuestion">
          <div class="flex items-center justify-between text-body-sm text-ink/60">
            <span>Pitanje {{ step + 1 }} od {{ QUESTIONS.length }}</span>
            <button v-if="step > 0" type="button" @click="goBack" class="hover:text-ink transition-colors">← Nazad</button>
          </div>
          <div class="mt-2 grid grid-cols-3 gap-1.5" aria-hidden="true">
            <span v-for="(_, index) in QUESTIONS" :key="index" class="h-1 rounded-full" :class="index <= step ? 'bg-accent' : 'bg-ink/10'"></span>
          </div>

          <h3 class="mt-6 text-body-lg md:text-xl font-semibold text-ink">{{ currentQuestion.title }}</h3>
          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="choice in currentQuestion.choices" :key="choice.label"
              type="button"
              @click="choose(choice.value)"
              class="group rounded-xl border px-4 py-3.5 text-left transition-colors"
              :class="answers[currentQuestion.key] === choice.value && choice.value
                ? 'border-accent bg-accent/5'
                : 'border-ink/15 hover:border-accent hover:bg-accent/5'"
            >
              <span class="block text-body font-medium text-ink group-hover:text-accent-dark">{{ choice.label }}</span>
              <span v-if="choice.hint" class="block mt-0.5 text-body-sm text-ink/55">{{ choice.hint }}</span>
            </button>
          </div>
        </template>

        <div v-else class="flex h-full flex-col justify-center">
          <template v-if="matches.length > 0">
            <h3 class="text-body-lg md:text-xl font-semibold text-ink">
              {{ matches.length === 1 ? 'Ovaj model ti odgovara:' : 'Ovi modeli ti odgovaraju:' }}
            </h3>
            <ul class="mt-4 space-y-2">
              <li v-for="car in matches.slice(0, 3)" :key="car.slug">
                <NuxtLink :to="`/automobili/${car.slug}`" class="flex items-center justify-between gap-4 rounded-xl border border-ink/10 px-4 py-3 hover:border-accent transition-colors">
                  <span class="text-body font-medium text-ink">{{ car.brand }} {{ car.model }} <span class="font-normal text-ink/60">· {{ car.engine }}</span></span>
                  <span v-if="car.overall_rating" class="font-data text-data font-semibold" :class="scoreTone(car.overall_rating).text">{{ formatScore(car.overall_rating) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </template>
          <template v-else>
            <h3 class="text-body-lg md:text-xl font-semibold text-ink">Još nemamo model koji se poklapa sa svim odgovorima</h3>
            <p class="mt-2 text-body text-ink/60">Probaj da na nekom pitanju izabereš "svejedno" ili pogledaj celu bazu.</p>
          </template>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <NuxtLink
              :to="{ path: '/automobili', query: matches.length > 0 ? resultsQuery : {} }"
              class="rounded-full bg-accent px-5 py-2.5 text-body-sm font-medium text-white hover:bg-accent-dark transition-colors"
            >
              {{ matches.length > 0 ? `Prikaži sve rezultate (${matches.length})` : 'Prikaži sve automobile' }}
            </NuxtLink>
            <button type="button" @click="restart" class="rounded-full border border-ink/20 px-5 py-2.5 text-body-sm font-medium text-ink hover:border-ink/50 transition-colors">
              Počni ispočetka
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
