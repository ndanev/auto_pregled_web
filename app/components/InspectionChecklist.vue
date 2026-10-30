<script setup lang="ts">
// Interaktivni spisak za pregled vozila. Štiklirane stavke se čuvaju u localStorage pod `storageKey`.
// Dugme "Odštampaj" štampa samo ovaj spisak (vidi print stilove u assets/css/tailwind.css).
const props = defineProps<{ items: string[]; storageKey: string; title: string }>()

const checked = ref<boolean[]>(props.items.map(() => false))
const doneCount = computed(() => checked.value.filter(Boolean).length)

// Stanje se pamti u browseru da bi spisak preživeo osvežavanje stranice kod prodavca.
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(props.storageKey) ?? '[]')
    if (Array.isArray(saved)) checked.value = props.items.map((_, i) => !!saved[i])
  } catch {}
})

watch(checked, (value) => {
  try {
    localStorage.setItem(props.storageKey, JSON.stringify(value))
  } catch {}
}, { deep: true })

function reset() {
  checked.value = props.items.map(() => false)
}

function printList() {
  document.documentElement.classList.add('print-checklist')
  window.print()
  document.documentElement.classList.remove('print-checklist')
}
</script>

<template>
  <div id="checklist" class="rounded-xl border border-ink/10 bg-white">
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b border-ink/10">
      <div>
        <p class="text-body font-medium text-ink">{{ title }}</p>
        <p class="text-body-sm text-ink/60" data-print-hide>
          {{ doneCount }} od {{ items.length }} provereno
        </p>
      </div>
      <div class="flex items-center gap-2" data-print-hide>
        <button
          v-if="doneCount > 0" type="button" @click="reset"
          class="rounded-full px-3 py-1.5 text-body-sm text-ink/60 hover:text-ink transition-colors"
        >Poništi</button>
        <button
          type="button" @click="printList"
          class="rounded-full border border-ink/15 px-4 py-1.5 text-body-sm text-ink hover:border-ink/40 transition-colors"
        >Odštampaj spisak</button>
      </div>
    </div>

    <div class="h-0.5 bg-ink/5" data-print-hide>
      <div class="h-full bg-positive transition-[width] duration-500" :style="{ width: `${(doneCount / items.length) * 100}%` }"></div>
    </div>

    <ul class="divide-y divide-ink/5">
      <li v-for="(item, index) in items" :key="item">
        <label class="flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-sand/50 transition-colors">
          <input v-model="checked[index]" type="checkbox" class="peer sr-only" />
          <span
            class="mt-0.5 h-5 w-5 shrink-0 rounded border flex items-center justify-center text-xs transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent"
            :class="checked[index] ? 'bg-positive border-positive text-white' : 'border-ink/25 text-transparent'"
            aria-hidden="true"
          >✓</span>
          <span class="text-body transition-colors" :class="checked[index] ? 'text-ink/55 line-through' : 'text-ink/85'">
            {{ capitalize(item) }}
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>
