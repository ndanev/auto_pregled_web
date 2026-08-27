<script setup lang="ts">
const props = defineProps<{
  images: { url: string; thumbnail_url: string; is_main: boolean }[]
}>()

const activeIndex = ref(
  Math.max(0, props.images.findIndex((img) => img.is_main))
)

const activeImage = computed(() => props.images[activeIndex.value])
</script>

<template>
  <div v-if="images.length > 0">
    <div class="border border-black/10 bg-surface overflow-hidden">
      <img :src="activeImage.url" alt="" class="w-full max-h-[480px] object-cover" />
    </div>

    <div v-if="images.length > 1" class="mt-3 flex gap-3 overflow-x-auto pb-1">
      <button
        v-for="(image, index) in images" :key="image.url"
        @click="activeIndex = index"
        class="shrink-0 w-20 h-14 border-2 overflow-hidden transition-colors"
        :class="index === activeIndex ? 'border-amber' : 'border-black/10 hover:border-black/30'"
      >
        <img :src="image.thumbnail_url" alt="" class="w-full h-full object-cover" />
      </button>
    </div>
  </div>
</template>