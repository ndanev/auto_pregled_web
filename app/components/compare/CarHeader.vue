<script setup lang="ts">
// Jedan automobil na vrhu rezultata poređenja: slika, naziv, ocena i link ka celoj analizi.
// `align` poravnava sadržaj ka sredini stranice: levi auto udesno, desni ulevo.
import type { CarDetail } from '~/types/car'

const props = defineProps<{ car: CarDetail; align: 'left' | 'right' }>()

// Glavna slika (označena sa is_main), ili prva ako nijedna nije označena
const imageUrl = computed(() => (props.car.images.find((image) => image.is_main) ?? props.car.images[0])?.url)

const isRight = computed(() => props.align === 'right')
</script>

<template>
  <div class="min-w-0" :class="isRight ? 'text-right' : 'text-left'">
    <div class="aspect-[16/10] overflow-hidden rounded-xl bg-gradient-to-br from-sand to-sand-deep">
      <img v-if="imageUrl" :src="imageUrl" :alt="carName(car)" class="h-full w-full object-cover" />
    </div>

    <h2 class="mt-4 font-display font-bold text-xl sm:text-display-sm text-ink">{{ carName(car) }}</h2>
    <p class="mt-1 text-body-sm text-ink/60">{{ car.engine }} · {{ car.years }}</p>

    <!-- Na telefonu ocena i opis idu jedno ispod drugog, na većem ekranu u jednom redu -->
    <div
      v-if="car.overall_rating"
      class="mt-3 flex flex-col sm:flex-row sm:items-baseline gap-x-2"
      :class="isRight ? 'items-end sm:justify-end' : 'items-start'"
    >
      <span class="font-display font-bold text-display-sm sm:text-display-md text-ink">{{ formatScore(car.overall_rating) }}</span>
      <span class="text-body-sm font-medium" :class="scoreTone(car.overall_rating).text">{{ scoreVerdict(car.overall_rating) }}</span>
    </div>

    <NuxtLink :to="`/automobili/${car.slug}`" class="mt-3 inline-block text-body-sm link-underline">
      Cela analiza →
    </NuxtLink>
  </div>
</template>
