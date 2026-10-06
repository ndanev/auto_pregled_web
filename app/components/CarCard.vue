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
    class="group block rounded-2xl border border-white/10 bg-surface overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
  >
    <div class="relative aspect-[4/3] bg-gradient-to-br from-[#1A2824] to-[#0E1613] overflow-hidden">
      <img
        v-if="car.main_thumbnail_url"
        :src="car.main_thumbnail_url"
        :alt="`${car.brand} ${car.model}`"
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <template v-else>
        <div class="absolute -inset-y-10 left-1/3 w-24 rotate-[20deg] bg-white/10 blur-2xl"></div>
        <div class="absolute -inset-y-10 left-1/2 w-8 rotate-[20deg] bg-white/15 blur-md"></div>
      </template>

      <span class="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full font-mono text-[11px] tracking-wide uppercase">
        {{ car.body_type ?? car.fuel_type }}
      </span>

      <button
        @click="handleToggleCompare"
        class="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border transition-colors"
        :class="isSelected(car.slug) ? 'bg-amber border-amber text-black' : 'bg-white/50 border-white/20 text-white/70 hover:border-white/40'"
        :title="isSelected(car.slug) ? 'Ukloni iz poređenja' : 'Dodaj za poređenje'"
      >
        <span class="text-xs leading-none">✓</span>
      </button>
    </div>

    <div class="p-4">
      <div class="flex items-center gap-2">
        <img v-if="car.brand_logo_url" :src="car.brand_logo_url" :alt="car.brand" class="w-4 h-4 object-contain" />
        <span class="font-mono text-eyebrow text-steel">{{ car.years }} · {{ car.transmission }}</span>
      </div>
      <h3 class="font-display font-bold uppercase text-2xl leading-tight mt-1 text-ink">
        {{ car.brand }} {{ car.model }}
      </h3>
      <p class="font-mono text-data-sm text-ink/50 mt-1.5">
        {{ car.engine }} · {{ car.power_hp }} KS
      </p>

      <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <span class="font-mono text-eyebrow text-ink/40">AI OCENA</span>
        <RatingBadge v-if="car.overall_rating" :rating="car.overall_rating" />
        <span v-else class="font-mono text-data-sm text-ink/30">Uskoro</span>
      </div>
    </div>
  </NuxtLink>
</template>