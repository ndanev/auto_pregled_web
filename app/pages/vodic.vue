<script setup lang="ts">
// Vodič za kupovinu polovnog automobila, korak po korak.
// Tekst je u šablonu ispod; liste su ovde u skripti da bi se lako menjale.
// Spisak za pregled je isti kao na početnoj (utils/inspection.ts) i deli napredak sa njim.

const STEPS = [
  { id: 'budzet', label: 'Budžet' },
  { id: 'izbor', label: 'Izbor modela' },
  { id: 'oglasi', label: 'Oglasi' },
  { id: 'prodavac', label: 'Prodavac' },
  { id: 'pregled', label: 'Pregled' },
  { id: 'test-voznja', label: 'Test vožnja' },
  { id: 'mehanicar', label: 'Mehaničar' },
  { id: 'pregovaranje', label: 'Pregovaranje' },
  { id: 'papiri', label: 'Papiri' },
  { id: 'posle-kupovine', label: 'Posle kupovine' },
]

/** Naslov sekcije sa rednim brojem, npr. "3. Oglasi" — broj se računa iz redosleda u STEPS. */
function stepTitle(id: string, title: string): string {
  return `${STEPS.findIndex((step) => step.id === id) + 1}. ${title}`
}

const HIDDEN_COSTS = [
  { title: 'Prenos vlasništva', text: 'Porez na prenos apsolutnih prava i takse. Iznos zavisi od starosti vozila i zapremine motora.' },
  { title: 'Registracija i osiguranje', text: 'Ako registracija uskoro ističe, računaj i na nju odmah posle kupovine.' },
  { title: 'Prvi servis', text: 'Ulje, filteri, a često i razvodni kaiš ako nema dokaza da je menjan.' },
  { title: 'Gume i kočnice', text: 'Istrošene gume ili kočioni diskovi lako dodaju par stotina evra.' },
]

const MODEL_TIPS = [
  'Dizel ima smisla ako voziš mnogo kilometara po otvorenom putu; za grad je benzinac ili hibrid često bolji izbor.',
  'Automatski menjači su udobni, ali neki tipovi (DSG, CVT) traže redovan servis i skuplji su za popravku.',
  'Suzi izbor na 2–3 modela i uporedi ih pre nego što kreneš da gledaš oglase.',
]

const RED_FLAGS = [
  'Cena osetno ispod tržišne za isti model, godište i kilometražu',
  'Prodavac nije vlasnik i nema ovlašćenje, ili izbegava da pokaže saobraćajnu',
  'Nema servisne istorije, a kilometraža je "mala"',
  'Fotografije su mutne, snimljene po mraku ili kriju delove automobila',
  'Pritisak da odlučiš odmah ("još trojica su zainteresovana")',
  'Traži se kapara pre nego što si video auto',
]

const SELLER_QUESTIONS = [
  'Koliko dugo ste vlasnik i zašto prodajete?',
  'Da li postoji servisna knjižica ili računi sa servisa?',
  'Kada je menjan razvodni kaiš (ili lanac), ulje u menjaču i kvačilo?',
  'Da li je auto bio u udesu i šta je popravljano?',
  'Gde je auto uglavnom vožen — grad ili otvoren put?',
  'Da li mogu da ga odvezem na pregled kod svog mehaničara?',
]

const TEST_DRIVE = [
  'Vozi najmanje 20–30 minuta — po gradu i na otvorenom putu',
  'Proveri da li menjač ubacuje sve brzine glatko, i unapred i u rikverc',
  'Na pravom putu pusti volan na trenutak: auto ne sme da vuče u stranu',
  'Zakoči jače: pedala mora biti čvrsta, bez vibracija i škripe',
  'Prođi preko neravnina i slušaj lupkanje iz trapa',
  'Posle vožnje proveri da li negde curi i da li se pojavila neka lampica',
]

const MECHANIC_CHECKS = [
  'Dijagnostika računarom — i greške koje su obrisane pre tvog dolaska',
  'Pogled ispod auta na dizalici: korozija, curenja, ispusni sistem, trap',
  'Merenje debljine laka — otkriva farbane i kitovane delove',
  'Stanje kočnica, guma i amortizera',
  'Za dizel: stanje DPF-a, EGR-a i turbine; za automatik: ponašanje menjača',
]

const NEGOTIATION_TIPS = [
  'Pregovaraj na osnovu činjenica: nalaz mehaničara, potrebne popravke, istrošene gume',
  'Koristi okvirne cene popravki iz rečnika i analiza kao argument',
  'Uporedi cenu sa sličnim oglasima — isto godište, motor i kilometraža',
  'Budi spreman da odustaneš; ima još automobila',
]

const PAPER_STEPS = [
  'Proveri da se podaci iz saobraćajne dozvole (vlasnik, VIN, motor) poklapaju sa automobilom i ličnom kartom prodavca',
  'Sastavite kupoprodajni ugovor i overite potpise — najčešće kod javnog beležnika',
  'Prijavi prenos i plati porez na prenos apsolutnih prava u propisanom roku',
  'Registruj promenu vlasnika u MUP-u i, ako treba, produži registraciju i osiguranje',
]

const AFTER_PURCHASE = [
  'Zameni ulje i sve filtere, bez obzira šta piše u knjižici',
  'Zameni razvodni kaiš i pumpu za vodu ako nema dokaza o zameni',
  'Proveri kočionu tečnost i antifriz',
  'Zapiši kilometražu i datum — to je početak tvoje servisne istorije',
]

useSeoMeta({
  title: 'Vodič za kupovinu polovnog automobila',
  description: 'Kupovina polovnjaka korak po korak: budžet, oglasi, pitanja za prodavca, pregled, test vožnja, pregovaranje i prenos vlasništva.',
})
</script>

<template>
  <div>
    <PageHeader
      eyebrow="VODIČ ZA KUPCE"
      title="Kako kupiti polovni automobil, korak po korak"
      intro="Od budžeta do ključeva u ruci — šta da proveriš, šta da pitaš i gde ljudi najčešće pogreše. Prođi korake redom ili skoči na onaj koji ti treba."
    />

    <SectionNav :items="STEPS" />

    <div class="site-container py-12">
      <div class="max-w-4xl space-y-16 md:space-y-20">
        <ContentSection
          id="budzet" :title="stepTitle('budzet', 'Postavi realan budžet')"
          intro="Cena iz oglasa nije ukupna cena. Ostavi rezervu za troškove koji stižu odmah posle kupovine."
        >
          <InfoCardGrid :items="HIDDEN_COSTS" class="mt-6" />
        </ContentSection>

        <ContentSection
          id="izbor" :title="stepTitle('izbor', 'Izaberi model — i motor')"
          intro="Isti model može biti odličan sa jednim motorom, a problematičan sa drugim. Zato gledaj konkretnu kombinaciju motora i menjača."
        >
          <BulletList class="mt-6" :items="MODEL_TIPS" />
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/automobili" class="btn-primary">Pretraži automobile</NuxtLink>
            <NuxtLink to="/uporedi" class="btn-secondary">Uporedi dva modela</NuxtLink>
            <NuxtLink to="/kako-ocenjujemo" class="btn-secondary">Kako čitati ocene</NuxtLink>
          </div>
        </ContentSection>

        <ContentSection id="oglasi" :title="stepTitle('oglasi', 'Pretraži oglase — i prepoznaj zamke')" intro="Ako primetiš nešto od ovoga, budi dodatno oprezan ili preskoči oglas.">
          <BulletList class="mt-6" :items="RED_FLAGS" tone="negative" />
        </ContentSection>

        <ContentSection id="prodavac" :title="stepTitle('prodavac', 'Pozovi prodavca pre nego što kreneš')" intro="Pet minuta telefonom može da ti uštedi ceo dan. Pitaj ovo:">
          <BulletList class="mt-6" :items="SELLER_QUESTIONS" />
          <p class="mt-5 rounded-xl bg-sand p-4 text-body-sm text-ink/70">
            Ako prodavac ne dozvoljava pregled kod tvog mehaničara, to je dovoljan razlog da odustaneš.
          </p>
        </ContentSection>

        <ContentSection id="pregled" :title="stepTitle('pregled', 'Pregledaj auto uživo')" intro="Dogovori se da motor ne pali pre tvog dolaska — hladan start otkriva najviše.">
          <div class="mt-6 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8">
            <div>
              <h3 class="text-body font-semibold text-ink">Šta da poneseš</h3>
              <ul class="mt-3 space-y-3">
                <li v-for="item in WHAT_TO_BRING" :key="item.title" class="text-body-sm text-ink/75">
                  <span class="font-semibold text-ink">{{ item.title }}</span> — {{ item.text }}
                </li>
              </ul>
            </div>
            <InspectionChecklist
              :items="GENERAL_INSPECTION_POINTS"
              :storage-key="GENERAL_INSPECTION_STORAGE_KEY"
              title="Opšti pregled polovnog automobila"
            />
          </div>
          <p class="mt-5 text-body-sm text-ink/60">
            Za model koji gledaš postoji i poseban spisak sa njegovim poznatim slabostima — nađi ga u sekciji „Pre kupovine“ na stranici tog automobila.
          </p>
        </ContentSection>

        <ContentSection id="test-voznja" :title="stepTitle('test-voznja', 'Test vožnja')">
          <BulletList class="mt-6" :items="TEST_DRIVE" />
        </ContentSection>

        <ContentSection
          id="mehanicar" :title="stepTitle('mehanicar', 'Odvezi ga kod mehaničara')"
          intro="Najisplativiji novac koji ćeš potrošiti pri kupovini. Dobar pregled obuhvata:"
        >
          <BulletList class="mt-6" :items="MECHANIC_CHECKS" tone="positive" />
          <p class="mt-5 text-body-sm text-ink/60">
            Ne znaš šta znači nešto iz nalaza? Pogledaj <NuxtLink to="/recnik" class="link-underline">rečnik pojmova</NuxtLink>.
          </p>
        </ContentSection>

        <ContentSection id="pregovaranje" :title="stepTitle('pregovaranje', 'Pregovaraj o ceni')">
          <BulletList class="mt-6" :items="NEGOTIATION_TIPS" />
        </ContentSection>

        <ContentSection id="papiri" :title="stepTitle('papiri', 'Papiri i prenos vlasništva')" intro="Ukratko, šta te čeka kad se dogovorite:">
          <NumberedList :items="PAPER_STEPS" class="mt-6" />
          <p class="mt-6 rounded-xl border border-caution/30 bg-caution/10 p-4 text-body-sm text-ink/75">
            Pravila, rokovi i iznosi taksi se menjaju. Pre kupovine proveri aktuelne korake i potrebna dokumenta
            na sajtovima MUP-a i Poreske uprave ili kod javnog beležnika.
          </p>
        </ContentSection>

        <ContentSection id="posle-kupovine" :title="stepTitle('posle-kupovine', 'Prvih nedelju dana posle kupovine')" intro="Kreni sa čistim računom — tako znaš tačno u kakvom je stanju auto od prvog dana.">
          <BulletList class="mt-6" :items="AFTER_PURCHASE" tone="positive" />
        </ContentSection>
      </div>
    </div>
  </div>
</template>
