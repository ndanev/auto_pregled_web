<script setup lang="ts">
// Bočna kolona: tabela tehničkih podataka i dugme za poređenje.
import type { CarDetail } from '~/types/car'

const props = defineProps<{ car: CarDetail }>()

/** Dodaje jedinicu samo kada vrednost postoji, inače prikazuje "—". */
function withUnit(value: number | null, unit: string): string {
  return value ? `${value} ${unit}` : '—'
}

const specs = computed(() => [
  { label: 'Generacija', value: props.car.generation },
  { label: 'Proizvodnja', value: props.car.years },
  { label: 'Karoserija', value: bodyTypeLabel(props.car.body_type) },
  { label: 'Motor', value: props.car.engine },
  { label: 'Zapremina', value: withUnit(props.car.displacement_cc, 'cm³') },
  { label: 'Snaga', value: withUnit(props.car.power_hp, 'KS') },
  { label: 'Obrtni moment', value: withUnit(props.car.torque_nm, 'Nm') },
  { label: 'Gorivo', value: fuelLabel(props.car.fuel_type) },
  { label: 'Menjač', value: transmissionLabel(props.car.transmission) },
  { label: 'Pogon', value: capitalize(props.car.drivetrain) },
])
</script>

<template>
  <aside class="lg:sticky lg:top-32 lg:self-start space-y-6">
    <div class="rounded-xl border border-ink/10">
      <h2 class="px-5 pt-4 pb-3 text-body font-semibold text-ink">Tehnički podaci</h2>
      <dl class="divide-y divide-ink/5 border-t border-ink/10">
        <div v-for="spec in specs" :key="spec.label" class="flex items-baseline justify-between gap-4 px-5 py-2.5">
          <dt class="text-body-sm text-ink/60">{{ spec.label }}</dt>
          <dd class="text-body-sm text-ink text-right">{{ spec.value }}</dd>
        </div>
      </dl>
    </div>

    <div class="rounded-xl bg-sand p-5">
      <p class="text-body-sm text-ink/70">Dvoumiš se između dva modela?</p>
      <CompareToggleButton :slug="car.slug" :label="`${car.brand} ${car.model}`" class="mt-3 w-full !py-2" />
    </div>
  </aside>
</template>
