<script setup lang="ts">
// Futer sajta sa linkovima i popularnim markama.
const { fetchBrands } = useBrandsApi()
const { data } = await useAsyncData('footer-brands', () => fetchBrands())
const topBrands = computed(() => (data.value?.data ?? []).slice(0, 6))
</script>

<template>
  <footer class="border-t border-ink/10 bg-sand">
    <div class="site-container py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div class="col-span-2 md:col-span-1">
        <NuxtLink to="/" :aria-label="`${SITE_NAME} — početna`">
          <AppLogo class="text-display-sm" />
        </NuxtLink>
        <p class="font-data text-data-sm text-ink/60 mt-3">
          AI analiza polovnih automobila — pouzdanost, troškovi i najčešći kvarovi.
        </p>
      </div>

      <div>
        <span class="font-data text-eyebrow text-steel">SAJT</span>
        <ul class="mt-3 space-y-2">
          <li><NuxtLink to="/automobili" class="font-data text-data-sm text-ink/70 hover:text-accent transition-colors">Svi automobili</NuxtLink></li>
          <li><NuxtLink to="/marke" class="font-data text-data-sm text-ink/70 hover:text-accent transition-colors">Sve marke</NuxtLink></li>
          <li><NuxtLink to="/uporedi" class="font-data text-data-sm text-ink/70 hover:text-accent transition-colors">Uporedi automobile</NuxtLink></li>
        </ul>
      </div>

      <div>
        <span class="font-data text-eyebrow text-steel">VODIČI</span>
        <ul class="mt-3 space-y-2">
          <li><NuxtLink to="/vodic" class="font-data text-data-sm text-ink/70 hover:text-accent transition-colors">Vodič za kupovinu</NuxtLink></li>
          <li><NuxtLink to="/recnik" class="font-data text-data-sm text-ink/70 hover:text-accent transition-colors">Rečnik pojmova</NuxtLink></li>
          <li><NuxtLink to="/kako-ocenjujemo" class="font-data text-data-sm text-ink/70 hover:text-accent transition-colors">Kako ocenjujemo</NuxtLink></li>
        </ul>
      </div>

      <div v-if="topBrands.length > 0" class="col-span-2 md:col-span-2">
        <span class="font-data text-eyebrow text-steel">POPULARNE MARKE</span>
        <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          <li v-for="brand in topBrands" :key="brand.slug">
            <NuxtLink :to="`/marke/${brand.slug}`" class="font-data text-data-sm text-ink/70 hover:text-accent transition-colors">
              {{ brand.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-ink/10">
      <div class="site-container py-6 flex items-center justify-between">
        <span class="font-data text-data-sm text-ink/55">{{ SITE_NAME }} — {{ SITE_TAGLINE }}</span>
        <span class="font-data text-data-sm text-ink/55">© {{ new Date().getFullYear() }}</span>
      </div>
    </div>
  </footer>
</template>