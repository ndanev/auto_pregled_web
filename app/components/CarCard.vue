<script setup lang="ts">
import type { MockCar } from '~/utils/mockCars'
defineProps<{ car: MockCar }>()
</script>

<template>
  <NuxtLink :to="`/cars/${car.slug}`" class="group block border border-white/10 bg-surface overflow-hidden hover:border-amber/50 transition-colors">
    <div class="relative h-36 bg-gradient-to-br from-[#1F232B] to-[#0C0E12] overflow-hidden">
      <div class="absolute -inset-y-10 left-1/3 w-24 rotate-[20deg] bg-amber/25 blur-2xl"></div>
      <div class="absolute -inset-y-10 left-1/2 w-8 rotate-[20deg] bg-amber/40 blur-md"></div>

      <span class="absolute top-3 left-3 bg-canvas/80 backdrop-blur px-2 py-1 font-mono text-[10px] tracking-widest uppercase text-ink/80 border border-white/10">
        {{ car.bodyType }}
      </span>
      <span class="absolute bottom-3 left-3 font-mono text-[11px] text-ink/50">{{ car.years }}</span>
    </div>

    <div class="p-4 flex items-start justify-between gap-3">
      <div>
        <h3 class="font-display font-bold uppercase text-xl leading-none text-ink group-hover:text-amber transition-colors">
          {{ car.brand }} {{ car.model }}
        </h3>
        <p class="font-mono text-xs text-ink/50 mt-2">
          {{ car.engine }} · {{ car.power }} KS · {{ car.transmission }}
        </p>
      </div>
      <RatingBadge :rating="car.rating" />
    </div>
  </NuxtLink>
</template>