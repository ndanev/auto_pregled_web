<script setup lang="ts">
// Poređenje dva automobila. Izbor se čuva u URL-u (?a=slug&b=slug) da bi link mogao da se podeli.
// Bez oba parametra prikazuje se birač (ComparePicker), a sa njima — rezultat (CompareResults).
import type { CarDetail } from '~/types/car'

const route = useRoute()
const router = useRouter()
const { fetchCars, fetchCarBySlug } = useCarsApi()

const slugA = computed(() => route.query.a as string | undefined)
const slugB = computed(() => route.query.b as string | undefined)

const { data: allCarsData } = await useAsyncData('compare-all-cars', () => fetchCars())
const allCars = computed(() => allCarsData.value?.data ?? [])

const { data: comparedData } = await useAsyncData(
  'compare-cars',
  async () => {
    if (!slugA.value || !slugB.value) return null
    const [a, b] = await Promise.all([fetchCarBySlug(slugA.value), fetchCarBySlug(slugB.value)])
    return [a.data, b.data] as [CarDetail, CarDetail]
  },
  { watch: [slugA, slugB] }
)
const compared = computed(() => comparedData.value ?? null)

function startComparison(a: string, b: string) {
  router.push({ path: '/uporedi', query: { a, b } })
}

// Povratak na birač: zadržavamo izbor, da korisnik promeni samo jedan automobil ako želi
function changeSelection() {
  router.push({ path: '/uporedi', query: { a: slugA.value } })
}

useSeoMeta({
  title: () => (compared.value ? `${carName(compared.value[0])} vs ${carName(compared.value[1])}` : 'Uporedi automobile'),
  description: 'Uporedi dva polovna automobila jedan pored drugog: pouzdanost, troškovi, vožnja i AI zaključak.',
})
</script>

<template>
  <div>
    <PageHeader
      eyebrow="POREĐENJE"
      title="Uporedi dva automobila"
      :intro="compared ? undefined : 'Izaberi dva modela i vidi ih jedan pored drugog — red po red, sa jasno označenim boljim u svakoj oblasti.'"
    />

    <div class="site-container pb-16">
      <CompareResults v-if="compared" :car-a="compared[0]" :car-b="compared[1]" @change="changeSelection" />
      <ComparePicker v-else :cars="allCars" :initial-a="slugA" :initial-b="slugB" @compare="startComparison" />
    </div>
  </div>
</template>
