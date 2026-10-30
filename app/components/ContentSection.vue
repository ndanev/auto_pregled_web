<script setup lang="ts">
// Omotač za jednu sekciju dugačke stranice (automobil, vodič, metodologija): naslov, uvod i sadržaj.
// `id` mora da odgovara stavci u SectionNav-u da bi navigacija mogla da skroluje do sekcije.
defineProps<{ id: string; title: string; intro?: string }>()
</script>

<template>
  <section :id="id" class="scroll-mt-32">
    <h2 class="font-display font-bold text-display-sm text-ink">{{ title }}</h2>
    <p v-if="intro" class="mt-2 text-body text-ink/60">{{ intro }}</p>
    <slot />
  </section>
</template>
