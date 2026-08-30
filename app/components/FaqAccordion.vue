<script setup lang="ts">
const props = defineProps<{ items: { question: string; answer: string }[] }>()

const openIndex = ref<number | null>(null)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="rounded-2xl border border-black/10 divide-y divide-black/10 overflow-hidden">
    <div v-for="(item, index) in props.items" :key="item.question">
      <button
        @click="toggle(index)"
        class="w-full flex items-center justify-between px-5 py-4 text-left bg-canvas hover:bg-black/[0.02] transition-colors"
      >
        <span class="font-mono text-data text-ink font-medium pr-4">{{ item.question }}</span>
        <span
          class="font-mono text-data text-ink/40 shrink-0 transition-transform"
          :class="{ 'rotate-45': openIndex === index }"
        >+</span>
      </button>
      <div v-if="openIndex === index" class="px-5 pb-4 bg-canvas">
        <p class="text-body-sm text-ink/70 leading-relaxed">{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>