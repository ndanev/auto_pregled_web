<script setup lang="ts">
// Lista pitanja i odgovora; otvoreno je najviše jedno pitanje (prvo je otvoreno na početku).
const props = defineProps<{ items: { question: string; answer: string }[] }>()

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="border-y border-ink/10 divide-y divide-ink/10">
    <div v-for="(item, index) in props.items" :key="item.question">
      <button
        type="button"
        @click="toggle(index)"
        :aria-expanded="openIndex === index"
        class="w-full flex items-start justify-between gap-6 py-5 text-left group"
      >
        <span class="text-body-lg text-ink font-medium group-hover:text-accent transition-colors">{{ item.question }}</span>
        <span
          class="mt-1 h-6 w-6 shrink-0 rounded-full border border-ink/20 flex items-center justify-center text-ink/60 transition-transform"
          :class="{ 'rotate-45 border-accent text-accent': openIndex === index }"
          aria-hidden="true"
        >+</span>
      </button>
      <div v-if="openIndex === index" class="pb-6 pr-12">
        <p class="text-body text-ink/70">{{ item.answer }}</p>
      </div>
    </div>
  </div>
</template>
