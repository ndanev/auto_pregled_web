<script setup lang="ts">
import type { CarSummary } from '~/types/car'

const props = defineProps<{ car: CarSummary }>()
const { toggle, isSelected } = useCompare()

function handleToggleCompare(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  toggle({ slug: props.car.slug, label: `${props.car.brand} ${props.car.model}` })
}
</script>

<template>
  <NuxtLink
    :to="`/automobili/${car.slug}`"
    class="group block border border-black/10 bg-surface overflow-hidden hover:border-amber/40 transition-colors relative"
  >
    <button
      @click="handleToggleCompare"
      class="absolute top-3 right-3 z-10 w-6 h-6 flex items-center justify-center border transition-colors"
      :class="isSelected(car.slug) ? 'bg-amber border-amber text-white' : 'bg-canvas/80 border-black/15 text-ink/60 hover:border-amber/50'"
      :title="isSelected(car.slug) ? 'Ukloni iz poređenja' : 'Dodaj za poređenje'"
    >
      <span class="text-xs leading-none">✓</span>
    </button>

    <div class="relative h-36 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      <img
        v-if="car.main_thumbnail_url"
        :src="car.main_thumbnail_url"
        :alt="`${car.brand} ${car.model}`"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <template v-else>
        <div class="absolute -inset-y-10 left-1/3 w-24 rotate-[20deg] bg-black/10 blur-2xl"></div>
        <div class="absolute -inset-y-10 left-1/2 w-8 rotate-[20deg] bg-black/15 blur-md"></div>
      </template>

      <span class="absolute top-3 left-3 bg-canvas/85 backdrop-blur px-2 py-1 font-mono text-eyebrow text-ink/80 border border-black/10">
        {{ car.body_type ?? car.fuel_type }}
      </span>
      <span class="absolute bottom-3 left-3 font-mono text-data-sm text-ink/50">{{ car.years }}</span>
    </div>

    <div class="p-4 flex items-start justify-between gap-3">
      <div>
        <h3 class="font-display font-bold uppercase text-display-sm leading-none text-ink group-hover:text-amber transition-colors">
          {{ car.brand }} {{ car.model }}
        </h3>
        <p class="font-mono text-data-sm text-ink/50 mt-2">
          {{ car.engine }} · {{ car.power_hp }} KS · {{ car.transmission }}
        </p>
      </div>
      <RatingBadge v-if="car.overall_rating" :rating="car.overall_rating" />
    </div>
  </NuxtLink>
</template>