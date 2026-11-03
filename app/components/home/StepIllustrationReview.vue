<script setup lang="ts">
// Ilustracija za korak "Pročitaj AI pregled" u sekciji Kako radi (HomeHowItWorks):
// kartica sa ocenom i trakama po oblastima. Brojevi su primer, ne pravi podaci.
// Boje prate scoreTone iz utils/carFormat.ts: 8,0 je zeleno, a slabija oblast žuta.

const BARS = [
  { label: 'Pouzdanost', width: '82%', color: 'bg-positive' },
  { label: 'Potrošnja', width: '74%', color: 'bg-positive' },
  { label: 'Održavanje', width: '56%', color: 'bg-caution' },
]
</script>

<template>
  <div class="w-full max-w-[260px] rounded-2xl bg-white p-4 shadow-lg shadow-ink/10 ring-1 ring-ink/10">
    <div class="flex items-center justify-between">
      <span class="font-display text-display-sm font-bold text-positive">8,0</span>
      <span class="rounded-full bg-positive/10 px-2.5 py-1 text-data-sm font-medium text-positive">Vrlo dobar izbor</span>
    </div>

    <div class="mt-3 space-y-2">
      <div v-for="bar in BARS" :key="bar.label">
        <span class="block text-left text-data-sm text-ink/60">{{ bar.label }}</span>
        <div class="mt-1 h-1.5 rounded-full bg-ink/10">
          <div class="h-full rounded-full" :class="bar.color" :style="{ width: bar.width }"></div>
        </div>
      </div>
    </div>
  </div>
</template>
