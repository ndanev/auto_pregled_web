<script setup lang="ts">
const { fetchBrands } = useBrandsApi()
const { data } = await useAsyncData('all-brands', () => fetchBrands())
const brands = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="site-container py-12">
    <span class="font-data text-eyebrow text-steel">SVE MARKE</span>
    <h1 class="font-display font-extrabold text-display-md md:text-display-lg mt-2 text-ink">Marke</h1>

    <div v-if="brands.length === 0" class="text-ink/60 font-data text-data mt-10">
      Trenutno nema dostupnih marki.
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-10">
    <NuxtLink
      v-for="brand in brands"
      :key="brand.slug"
      :to="`/marke/${brand.slug}`"
      class="group flex flex-col items-center text-center rounded-2xl border border-ink/10 bg-white p-6 hover:border-accent transition-colors"
    >
      <div class="w-14 h-14 flex items-center justify-center mb-3">
        <img v-if="brand.logo_url" :src="brand.logo_url" :alt="brand.name" class="w-full h-full object-contain" />
        <span v-else class="font-display font-bold text-2xl text-ink/20">{{ brand.name[0] }}</span>
      </div>
      <h3 class="font-display font-bold text-display-sm text-ink group-hover:text-accent-dark transition-colors">
        {{ brand.name }}
      </h3>
      <p class="font-data text-data-sm text-ink/60 mt-1">{{ brand.cars_count }} automobila</p>
    </NuxtLink>
    </div>
  </div>
</template>