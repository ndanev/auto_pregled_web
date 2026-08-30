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
      class="group flex flex-col items-center text-center rounded-2xl border border-black/10 p-6 hover:border-amber transition-colors"
    >
      <div class="w-14 h-14 flex items-center justify-center mb-3">
        <img v-if="brand.logo_url" :src="brand.logo_url" :alt="brand.name" class="w-full h-full object-contain" />
        <span v-else class="font-display font-bold text-2xl text-ink/20">{{ brand.name[0] }}</span>
      </div>
      <h3 class="font-display font-bold uppercase text-display-sm text-ink group-hover:text-amber-dark transition-colors">
        {{ brand.name }}
      </h3>
      <p class="font-mono text-data-sm text-ink/50 mt-1">{{ brand.cars_count }} automobila</p>
    </NuxtLink>
    </div>
  </div>
</template>