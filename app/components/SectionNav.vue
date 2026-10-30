<script setup lang="ts">
// Lepljiva navigacija kroz sekcije stranice. Ističe sekciju koja je trenutno na ekranu.
const props = defineProps<{ items: { id: string; label: string }[] }>()

const activeId = ref(props.items[0]?.id)
let observer: IntersectionObserver | null = null

onMounted(() => {
  // Sekcija je "aktivna" kada njen vrh pređe gornju trećinu ekrana.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeId.value = entry.target.id
      }
    },
    { rootMargin: '-140px 0px -60% 0px' }
  )
  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav class="sticky top-16 z-10 border-b border-ink/10 bg-page/90 backdrop-blur" aria-label="Sadržaj stranice">
    <div class="site-container">
      <ul class="flex gap-6 overflow-x-auto no-scrollbar">
        <li v-for="item in items" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="block whitespace-nowrap py-3.5 text-body-sm border-b-2 -mb-px transition-colors"
            :class="activeId === item.id ? 'border-accent text-ink' : 'border-transparent text-ink/50 hover:text-ink'"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
