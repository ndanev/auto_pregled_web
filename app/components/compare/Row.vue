<script setup lang="ts">
// Jedan red poređenja: vrednost levog automobila | naziv reda | vrednost desnog.
import type { CompareRowData, Side } from '~/utils/compare'

const props = defineProps<{ row: CompareRowData }>()

/** Kako je prošla jedna strana u ovom redu. */
function resultFor(side: Side): 'winner' | 'loser' | 'tie' {
  if (props.row.winner === null) return 'tie'
  return props.row.winner === side ? 'winner' : 'loser'
}
</script>

<template>
  <div class="grid grid-cols-[1fr_minmax(96px,auto)_1fr] sm:grid-cols-[1fr_180px_1fr] items-center gap-x-3 sm:gap-x-6 py-3.5">
    <CompareRowValue :value="row.a" :score="row.scores?.[0]" :result="resultFor('a')" align="right" />
    <span class="text-center text-body-sm text-ink/60">{{ row.label }}</span>
    <CompareRowValue :value="row.b" :score="row.scores?.[1]" :result="resultFor('b')" align="left" />
  </div>
</template>
