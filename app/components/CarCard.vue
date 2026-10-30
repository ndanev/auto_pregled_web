<script setup lang="ts">
// Kartica automobila u listama. Cela kartica je link; dugme "+ Uporedi" ne sme da pokrene navigaciju.
import type { CarSummary } from '~/types/car'

const props = defineProps<{ car: CarSummary }>()
const { toggle, isSelected } = useCompare()

const selected = computed(() => isSelected(props.car.slug))

function handleToggleCompare(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  toggle({ slug: props.car.slug, label: `${props.car.brand} ${props.car.model}` })
}
</script>

<template>
  <NuxtLink
    :to="`/automobili/${car.slug}`"
    class="group flex flex-col rounded-xl border border-ink/10 bg-white overflow-hidden hover:border-ink/25 hover:shadow-lg hover:shadow-ink/5 transition-colors"
  >
    <div class="relative aspect-[4/3] bg-gradient-to-br from-sand to-sand-deep overflow-hidden">
      <img
        v-if="car.main_thumbnail_url"
        :src="car.main_thumbnail_url"
        :alt="`${car.brand} ${car.model}`"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
      />

      <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-ink px-2.5 py-1 rounded-md text-xs font-medium">
        {{ bodyTypeLabel(car.body_type ?? car.fuel_type) }}
      </span>

      <button
        type="button"
        @click="handleToggleCompare"
        class="absolute top-3 right-3 rounded-md px-2.5 py-1 text-xs font-medium backdrop-blur-sm transition-colors"
        :class="selected ? 'bg-accent text-white' : 'bg-white/90 text-ink/80 hover:text-ink hover:bg-white'"
        :aria-pressed="selected"
      >
        {{ selected ? '✓ U poređenju' : '+ Uporedi' }}
      </button>
    </div>

    <div class="flex flex-1 flex-col p-4">
      <div class="flex items-center gap-2 text-body-sm text-ink/50">
        <img v-if="car.brand_logo_url" :src="car.brand_logo_url" alt="" class="w-4 h-4 object-contain opacity-80" />
        <span>{{ car.years }}</span>
      </div>
      <h3 class="font-display font-bold uppercase text-2xl leading-tight mt-1 text-ink group-hover:text-accent transition-colors">
        {{ car.brand }} {{ car.model }}
      </h3>
      <p class="text-body-sm text-ink/50 mt-1">
        {{ car.engine }}<template v-if="car.power_hp"> · {{ car.power_hp }} KS</template> · {{ transmissionLabel(car.transmission) }}
      </p>

      <div class="mt-auto pt-4">
        <div class="flex items-center justify-between border-t border-ink/10 pt-3">
          <template v-if="car.overall_rating">
            <span class="text-body-sm" :class="scoreTone(car.overall_rating).text">{{ scoreVerdict(car.overall_rating) }}</span>
            <span class="font-data text-data-lg font-semibold text-ink">
              {{ formatScore(car.overall_rating) }}<span class="text-data-sm font-normal text-ink/40">/10</span>
            </span>
          </template>
          <span v-else class="text-body-sm text-ink/40">Analiza uskoro</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
