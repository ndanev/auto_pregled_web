<script setup lang="ts">
const { fetchBrands } = useBrandsApi()
const { data } = await useAsyncData('footer-brands', () => fetchBrands())
const topBrands = computed(() => (data.value?.data ?? []).slice(0, 6))
</script>

<template>
  <footer class="border-t border-black/10 bg-canvas">
    <div class="mx-auto max-w-6xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div class="col-span-2 md:col-span-1">
        <span class="font-display font-extrabold uppercase text-display-sm text-ink">VOZIQ</span>
        <p class="font-mono text-data-sm text-ink/50 mt-3">
          AI analiza polovnih automobila — pouzdanost, troškovi i najčešći kvarovi.
        </p>
      </div>

      <div>
        <span class="font-mono text-eyebrow text-steel">SAJT</span>
        <ul class="mt-3 space-y-2">
          <li><NuxtLink to="/automobili" class="font-mono text-data-sm text-ink/70 hover:text-amber-dark transition-colors">Svi automobili</NuxtLink></li>
          <li><NuxtLink to="/marke" class="font-mono text-data-sm text-ink/70 hover:text-amber-dark transition-colors">Sve marke</NuxtLink></li>
          <li><NuxtLink to="/uporedi" class="font-mono text-data-sm text-ink/70 hover:text-amber-dark transition-colors">Uporedi automobile</NuxtLink></li>
        </ul>
      </div>

      <div v-if="topBrands.length > 0" class="col-span-2 md:col-span-2">
        <span class="font-mono text-eyebrow text-steel">POPULARNE MARKE</span>
        <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <li v-for="brand in topBrands" :key="brand.slug">
            <NuxtLink :to="`/marke/${brand.slug}`" class="font-mono text-data-sm text-ink/70 hover:text-amber-dark transition-colors">
              {{ brand.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-black/10">
      <div class="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
        <span class="font-mono text-data-sm text-ink/40">AUTO PREGLED — AI analiza automobila</span>
        <span class="font-mono text-data-sm text-ink/40">© {{ new Date().getFullYear() }}</span>
      </div>
    </div>
  </footer>
</template>