<script setup lang="ts">
// Zaglavlje sadržajnih stranica (vodič, rečnik, metodologija): oznaka, naslov i uvodni tekst.
defineProps<{ eyebrow: string; title: string; intro?: string }>()
</script>

<template>
  <header class="site-container pt-12 pb-8 md:pt-16">
    <span class="font-data text-eyebrow text-steel">{{ eyebrow }}</span>
    <h1 class="mt-2 font-display font-extrabold text-display-md md:text-display-lg text-ink max-w-4xl">{{ title }}</h1>
    <p v-if="intro" class="mt-5 text-body-lg text-ink/70 max-w-3xl">{{ intro }}</p>
    <slot />
  </header>
</template>
