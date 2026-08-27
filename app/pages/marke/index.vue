<script setup lang="ts">
const { fetchBrands } = useBrandsApi()
const { data } = await useAsyncData('all-brands', () => fetchBrands())
const brands = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <span class="font-mono text-eyebrow text-steel">SVE MARKE</span>
    <h1 class="font-display font-extrabold uppercase text-display-md md:text-display-lg mt-2 text-ink">Marke</h1>

    <div v-if="brands.length === 0" class="text-ink/50 font-mono text-data mt-10">
      Trenutno nema dostupnih marki.
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10">
      <NuxtLink
        v-for="brand in brands"
        :key="brand.slug"
        :to="`/marke/${brand.slug}`"
        class="group block border border-black/10 bg-surface p-5 hover:border-amber/50 transition-colors"
      >
        <h3 class="font-display font-bold uppercase text-display-sm text-ink group-hover:text-amber transition-colors">
          {{ brand.name }}
        </h3>
        <p class="font-mono text-data-sm text-ink/50 mt-2">{{ brand.cars_count }} automobila</p>
      </NuxtLink>
    </div>
  </div>
</template>