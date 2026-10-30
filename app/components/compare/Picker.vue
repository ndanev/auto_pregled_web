<script setup lang="ts">
// Birač dva automobila: dve kartice jedna naspram druge + predložena poređenja.
// Početni izbor dolazi iz URL-a (?a=…&b=…), a ako ga nema — iz trake za poređenje (useCompare).
import type { CarSummary } from '~/types/car'

const props = defineProps<{ cars: CarSummary[]; initialA?: string; initialB?: string }>()
const emit = defineEmits<{ compare: [slugA: string, slugB: string] }>()

const { selected: compareBarSelection } = useCompare()

const slugA = ref(props.initialA ?? compareBarSelection.value[0]?.slug)
const slugB = ref(props.initialB ?? compareBarSelection.value[1]?.slug)

const canCompare = computed(() => !!slugA.value && !!slugB.value && slugA.value !== slugB.value)

function submit() {
  if (slugA.value && slugB.value && canCompare.value) {
    emit('compare', slugA.value, slugB.value)
  }
}

const suggestions = computed(() => suggestPairs(props.cars))
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-center">
      <ComparePickerSlot v-model="slugA" title="Prvi automobil" :cars="cars" :disabled-slug="slugB" class="self-stretch" />
      <VsBadge class="mx-auto" />
      <ComparePickerSlot v-model="slugB" title="Drugi automobil" :cars="cars" :disabled-slug="slugA" class="self-stretch" />
    </div>

    <div class="mt-6 flex justify-center">
      <button
        type="button"
        @click="submit"
        :disabled="!canCompare"
        class="btn-primary !px-8 !py-3 !text-body font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Uporedi
      </button>
    </div>

    <section v-if="suggestions.length > 0" class="mt-16">
      <h2 class="font-display font-bold text-display-sm text-ink">Predložena poređenja</h2>
      <p class="mt-2 text-body text-ink/60">Najbolje ocenjeni modeli iz iste klase — jedan klik do poređenja.</p>
      <ul class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <li v-for="[first, second] in suggestions" :key="`${first.slug}-${second.slug}`">
          <button
            type="button"
            @click="emit('compare', first.slug, second.slug)"
            class="group flex w-full items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white px-5 py-4 text-left hover:border-accent transition-colors"
          >
            <span class="text-body font-medium text-ink">
              {{ carName(first) }} <span class="text-ink/55 font-normal">vs</span> {{ carName(second) }}
            </span>
            <span class="shrink-0 text-body-sm text-ink/55 group-hover:text-accent transition-colors">
              {{ bodyTypeLabel(first.body_type) }} →
            </span>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
