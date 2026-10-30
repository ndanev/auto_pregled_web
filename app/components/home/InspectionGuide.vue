<script setup lang="ts">
// "Kako pregledati polovnjak": opšti spisak za proveru, koji važi za bilo koji automobil.
// Koristi istu komponentu kao spisak na stranici automobila, samo sa opštim stavkama.
// Za spisak specifičan za model, vidi sekciju "Pre kupovine" na stranici automobila.

const INSPECTION_POINTS = [
  'Servisna knjižica i računi — da li se servisi poklapaju sa kilometražom',
  'Kilometraža — uporedi je sa istrošenošću volana, pedala i sedišta vozača',
  'VIN broj — proveri istoriju vozila (udesi, krađa, uvoz)',
  'Karoserija — razlike u nijansi boje i neravni razmaci između delova ukazuju na popravljan udes',
  'Korozija na pragovima, podvozju i oko blatobrana',
  'Hladan start motora — dim iz auspuha, čudni zvuci, neujednačen rad u leru',
  'Curenje ulja ili tečnosti ispod motora i menjača',
  'Lampice na instrument tabli — sve moraju da se ugase posle paljenja motora',
  'Test vožnja — kočenje, menjanje brzina, vibracije i da li auto vuče u stranu',
  'Gume — dubina šare i ravnomerno trošenje (neravnomerno može značiti problem sa trapom)',
  'Papiri — saobraćajna dozvola i da li je prodavac stvarni vlasnik',
  'Nezavisan pregled kod mehaničara pre bilo kakve uplate',
]

const WHAT_TO_BRING = [
  { title: 'Baterijska lampa', text: 'za pogled ispod auta i u motorni prostor' },
  { title: 'Papirna maramica', text: 'za proveru boje i čistoće ulja na šipki' },
  { title: 'OBD čitač', text: 'jeftin uređaj koji pokazuje obrisane greške u računaru' },
  { title: 'Još jedna osoba', text: 'da posmatra auspuh i svetla dok ti voziš' },
]
</script>

<template>
  <section class="border-t border-ink/10">
    <div class="site-container py-14 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14">
      <div>
        <span class="font-data text-eyebrow text-steel">VODIČ ZA KUPCE</span>
        <h2 class="font-display font-bold uppercase text-display-sm md:text-display-md text-ink mt-2">Kako pregledati polovnjak</h2>
        <p class="mt-4 text-body text-ink/65 max-w-md">
          Bez obzira koji model gledaš, ovih dvanaest stvari proveri pre nego što se dogovoriš oko cene.
          Spisak se pamti u tvom pregledaču, pa možeš da ga štikliraš na licu mesta.
        </p>
        <p class="mt-3 text-body-sm text-ink/50">
          Savet: dogovori se sa prodavcem da motor ne pali pre tvog dolaska — hladan start otkriva najviše.
        </p>

        <h3 class="mt-8 text-body font-semibold text-ink">Šta da poneseš</h3>
        <ul class="mt-3 space-y-3">
          <li v-for="item in WHAT_TO_BRING" :key="item.title" class="flex gap-3">
            <span class="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
            <p class="text-body text-ink/75"><span class="font-medium text-ink">{{ item.title }}</span> — {{ item.text }}</p>
          </li>
        </ul>
      </div>

      <InspectionChecklist :items="INSPECTION_POINTS" storage-key="checklist:opsti-pregled" title="Opšti pregled polovnog automobila" />
    </div>
  </section>
</template>
