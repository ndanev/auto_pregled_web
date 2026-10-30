<script setup lang="ts">
// Galerija na stranici automobila: velika slika, strelice i sličice ispod (kad ima više slika).
import type { CarImage } from '~/types/car'

const props = defineProps<{ images: CarImage[]; alt: string }>()

const activeIndex = ref(
  Math.max(0, props.images.findIndex((img) => img.is_main))
)

const activeImage = computed(() => props.images[activeIndex.value])

function step(direction: 1 | -1) {
  activeIndex.value = (activeIndex.value + direction + props.images.length) % props.images.length
}
</script>

<template>
  <div v-if="images.length > 0">
    <div class="group relative aspect-[16/10] rounded-xl bg-sand overflow-hidden">
      <img v-if="activeImage" :src="activeImage.url" :alt="alt" class="absolute inset-0 w-full h-full object-cover" />

      <template v-if="images.length > 1">
        <button
          type="button" @click="step(-1)" aria-label="Prethodna fotografija"
          class="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm hover:bg-white transition-colors"
        >←</button>
        <button
          type="button" @click="step(1)" aria-label="Sledeća fotografija"
          class="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm hover:bg-white transition-colors"
        >→</button>
        <span class="absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 font-data text-data-sm text-ink backdrop-blur-sm">
          {{ activeIndex + 1 }} / {{ images.length }}
        </span>
      </template>
    </div>

    <div v-if="images.length > 1" class="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
      <button
        v-for="(image, index) in images" :key="image.url"
        type="button"
        @click="activeIndex = index"
        :aria-label="`Fotografija ${index + 1}`"
        :aria-current="index === activeIndex"
        class="shrink-0 w-20 h-14 rounded-lg overflow-hidden ring-2 ring-offset-2 ring-offset-page transition"
        :class="index === activeIndex ? 'ring-accent' : 'ring-transparent opacity-60 hover:opacity-100'"
      >
        <img :src="image.thumbnail_url" alt="" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>
