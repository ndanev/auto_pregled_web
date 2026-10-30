<script setup lang="ts">
// Rečnik pojmova. Sadržaj je u utils/glossary.ts; ova stranica samo pretražuje i prikazuje.
// Svaki pojam ima anchor (npr. /recnik#dpf), pa se može linkovati direktno.

const search = ref('')

/** Pojmovi grupisani po kategoriji, filtrirani po pretrazi (naziv, pun naziv i opis). */
const groups = computed(() => {
  const query = search.value.trim().toLowerCase()
  const visible = GLOSSARY.filter((term) =>
    !query || [term.term, term.fullName ?? '', term.what].some((text) => text.toLowerCase().includes(query))
  )
  return GLOSSARY_CATEGORIES
    .map((category) => ({ category, terms: visible.filter((term) => term.category === category) }))
    .filter((group) => group.terms.length > 0)
})

useSeoMeta({
  title: 'Rečnik pojmova — DPF, EGR, DSG i ostalo',
  description: 'Šta su DPF, EGR, DSG, dvomaseni zamajac i drugi delovi o kojima se priča pri kupovini polovnjaka — kako se prepoznaje kvar i koliko košta popravka.',
})
</script>

<template>
  <div>
    <PageHeader
      eyebrow="REČNIK POJMOVA"
      title="Šta znači DPF, a šta dvomaseni zamajac?"
      intro="Pojmovi koje ćeš sresti u analizama i oglasima, objašnjeni bez stručnog žargona — šta je taj deo, kako se prepoznaje da nešto ne valja i koliko otprilike košta popravka."
    >
      <div class="mt-8 flex max-w-md rounded-full border border-ink/15 bg-white overflow-hidden">
        <input
          v-model="search"
          type="search" placeholder="Pretraži pojam, npr. turbina"
          aria-label="Pretraga rečnika"
          class="flex-1 bg-transparent px-5 py-2.5 text-body-sm placeholder:text-ink/55 focus:outline-none text-ink"
        />
      </div>
    </PageHeader>

    <div class="site-container pb-16 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16">
      <!-- Spisak pojmova sa strane (samo desktop) -->
      <nav class="hidden lg:block lg:sticky lg:top-24 lg:self-start" aria-label="Pojmovi">
        <div v-for="group in groups" :key="group.category" class="mb-6">
          <p class="font-data text-eyebrow text-steel">{{ group.category.toUpperCase() }}</p>
          <ul class="mt-2 space-y-1.5">
            <li v-for="term in group.terms" :key="term.id">
              <a :href="`#${term.id}`" class="text-body-sm text-ink/70 hover:text-accent transition-colors">{{ term.term }}</a>
            </li>
          </ul>
        </div>
      </nav>

      <div>
        <p v-if="groups.length === 0" class="text-body text-ink/60">
          Nismo pronašli pojam "{{ search }}". Probaj drugačiji naziv ili skraćenicu.
        </p>

        <section v-for="group in groups" :key="group.category" class="mb-14">
          <h2 class="font-display font-bold text-display-sm text-ink">{{ group.category }}</h2>

          <div class="mt-6 space-y-4">
            <article
              v-for="term in group.terms" :id="term.id" :key="term.id"
              class="scroll-mt-24 rounded-xl border border-ink/10 bg-white p-5 md:p-6 target:border-accent target:ring-2 target:ring-accent/20"
            >
              <h3 class="text-body-lg font-semibold text-ink">
                {{ term.term }}
                <span v-if="term.fullName" class="font-normal text-ink/60"> — {{ term.fullName }}</span>
              </h3>
              <p class="mt-2 text-body text-ink/75">{{ term.what }}</p>

              <div class="mt-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
                <div>
                  <p class="text-body-sm font-semibold text-ink">Kako se prepoznaje kvar</p>
                  <ul class="mt-2 space-y-1.5">
                    <li v-for="symptom in term.symptoms" :key="symptom" class="flex gap-3 text-body-sm text-ink/75">
                      <span class="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-negative" aria-hidden="true"></span>
                      {{ symptom }}
                    </li>
                  </ul>
                </div>
                <div class="md:w-64 rounded-lg bg-sand px-4 py-3 self-start">
                  <p class="text-body-sm font-semibold text-ink">Okvirna cena</p>
                  <p class="mt-1 text-body-sm text-ink/75">{{ term.cost }}</p>
                </div>
              </div>

              <p v-if="term.tip" class="mt-5 border-l-2 border-accent pl-4 text-body-sm text-ink/75">
                <span class="font-semibold text-ink">Savet:</span> {{ term.tip }}
              </p>
            </article>
          </div>
        </section>

        <p class="rounded-xl bg-sand p-5 text-body-sm text-ink/65">
          Cene su okvirne i odnose se na nezavisne servise — zavise od modela, delova (original ili zamenski) i
          servisa. Uzmi ih kao orijentaciju pri pregovaranju, a tačnu procenu traži od mehaničara.
        </p>
      </div>
    </div>
  </div>
</template>
