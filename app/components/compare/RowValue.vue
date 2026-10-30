<script setup lang="ts">
// Vrednost jednog automobila u redu poređenja, sa opcionom trakom za ocenu.
// Bolji je podebljan i ima ✓, slabiji je bleđi. Sve je poravnato ka sredini reda (`align`).
const props = defineProps<{
  value: string
  score?: number // ocena 0–10; kad postoji, ispod vrednosti se crta traka
  result: 'winner' | 'loser' | 'tie'
  align: 'left' | 'right'
}>()

const isRight = computed(() => props.align === 'right')

const TEXT_CLASSES = {
  winner: 'font-semibold text-ink',
  loser: 'text-ink/55',
  tie: 'text-ink/80',
}
</script>

<template>
  <div :class="isRight ? 'text-right' : 'text-left'">
    <span class="inline-flex items-center gap-1.5 font-data text-data" :class="TEXT_CLASSES[result]">
      <span v-if="isRight && result === 'winner'" class="text-positive" aria-label="bolji">✓</span>
      {{ value }}
      <span v-if="!isRight && result === 'winner'" class="text-positive" aria-label="bolji">✓</span>
    </span>

    <!-- Traka raste od sredine reda ka ivici, pa dve trake zajedno izgledaju kao "leptir" -->
    <div v-if="score !== undefined" class="mt-1.5 flex" :class="isRight ? 'justify-end' : 'justify-start'" aria-hidden="true">
      <div class="flex h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-ink/5" :class="isRight && 'justify-end'">
        <div
          class="h-full rounded-full"
          :class="[scoreTone(score).bg, result === 'loser' && 'opacity-50']"
          :style="{ width: `${score * 10}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>
