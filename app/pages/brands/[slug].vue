<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { fetchBrandBySlug } = useBrandsApi()
const { data, error } = await useAsyncData(`brand-${slug}`, () => fetchBrandBySlug(slug))

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Marka nije pronađena' })
}

const brand = computed(() => data.value!.data)

useSeoMeta({
  title: `${brand.value.name} — svi modeli`,
  description: `Pregled svih ${brand.value.name} modela sa AI analizom pouzdanosti, troškova i najčešćih kvarova.`,
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-12">
    <span class="font-mono text-eyebrow text-steel">MARKA</span>
    <h1 class="font-display font-extrabold uppercase text-display-lg md:text-display-xl mt-2 text-ink">
      {{ brand.name }}
    </h1>

    <div v-if="brand.models.length === 0" class="text-ink/50 font-mono text-data mt-10">
      Trenutno nema dostupnih modela za ovu marku.
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-10">
      <NuxtLink
        v-for="model in brand.models"
        :key="model.slug"
        :to="`/cars?model_slug=${model.slug}`"
        class="group block border border-white/10 bg-surface p-5 hover:border-amber/50 transition-colors"
      >
        <h3 class="font-display font-bold uppercase text-display-sm text-ink group-hover:text-amber transition-colors">
          {{ model.name }}
        </h3>
        <p class="font-mono text-data-sm text-ink/50 mt-2">{{ model.cars_count }} automobila</p>
      </NuxtLink>
    </div>
  </div>
</template>