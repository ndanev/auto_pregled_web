// Rečnik pojmova za stranicu /recnik.
//
// Novi pojam se dodaje samo ovde: stranica ga prikazuje automatski, a sekcija "Poznati problemi"
// na stranici automobila linkuje ka njemu kad tekst kvara sadrži neku od ključnih reči (`keywords`).
//
// Cene su okvirne (u evrima, nezavisni servis u Srbiji) i služe samo za orijentaciju —
// pre objave ih treba proveriti sa nekim iz struke i povremeno osvežavati.

export type GlossaryCategory = 'Motor' | 'Menjač i prenos' | 'Izduvni sistem' | 'Elektrika i elektronika'

export interface GlossaryTerm {
  id: string // anchor na stranici, npr. /recnik#dpf
  term: string
  fullName?: string
  category: GlossaryCategory
  what: string // šta je i čemu služi
  symptoms: string[] // kako se prepoznaje da nešto nije u redu
  cost: string // okvirna cena popravke
  tip?: string // praktičan savet za kupca
  keywords: string[] // mala slova; traže se u tekstu AI analize
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = ['Motor', 'Menjač i prenos', 'Izduvni sistem', 'Elektrika i elektronika']

export const GLOSSARY: GlossaryTerm[] = [
  // --- Izduvni sistem --------------------------------------------------------
  {
    id: 'dpf',
    term: 'DPF',
    fullName: 'Filter čestica dizela',
    category: 'Izduvni sistem',
    what: 'Filter u izduvnom sistemu dizel motora koji zadržava čađ. Povremeno se sam čisti sagorevanjem čađi (regeneracija), ali samo pri dužoj vožnji na višem broju obrtaja.',
    symptoms: ['Lampica DPF-a na instrument tabli', 'Auto gubi snagu ili ulazi u "sigurnosni režim"', 'Ventilator radi i posle gašenja motora', 'Povećana potrošnja'],
    cost: 'Čišćenje oko 100–250 €, novi filter 500–1.500 €',
    tip: 'Dizel sa DPF-om koji se uglavnom vozio po gradu čest je izvor problema. Pitaj prodavca kako je auto korišćen.',
    keywords: ['dpf', 'filter čestica', 'filter čađi', 'regeneracij'],
  },
  {
    id: 'egr',
    term: 'EGR ventil',
    fullName: 'Ventil za recirkulaciju izduvnih gasova',
    category: 'Izduvni sistem',
    what: 'Vraća deo izduvnih gasova nazad u motor radi manje emisije štetnih gasova. Vremenom se zaprlja naslagama čađi i počne da se zaglavljuje.',
    symptoms: ['Neujednačen rad motora u leru', 'Gubitak snage i "šteka" pri ubrzanju', 'Crni dim iz auspuha', 'Lampica motora (check engine)'],
    cost: 'Čišćenje oko 50–150 €, zamena 150–500 €',
    keywords: ['egr'],
  },
  {
    id: 'adblue',
    term: 'AdBlue',
    fullName: 'SCR sistem sa rastvorom uree',
    category: 'Izduvni sistem',
    what: 'Tečnost koja se ubrizgava u izduvni sistem novijih dizel motora i smanjuje emisiju azotnih oksida. Dosipa se u poseban rezervoar.',
    symptoms: ['Upozorenje o AdBlue sistemu na tabli', 'Odbrojavanje kilometara do zabrane paljenja', 'Kristali (beli talog) oko čepa rezervoara'],
    cost: 'Dosipanje tečnosti nekoliko evra po litru; kvar pumpe ili grejača 300–1.500 €',
    keywords: ['adblue', 'scr'],
  },
  {
    id: 'katalizator',
    term: 'Katalizator',
    category: 'Izduvni sistem',
    what: 'Deo izduvnog sistema koji hemijski pretvara štetne gasove u manje štetne. Česta meta krađe zbog plemenitih metala.',
    symptoms: ['Zvuk "zveckanja" ispod auta', 'Miris pokvarenih jaja', 'Lampica motora', 'Pad snage'],
    cost: 'Zamena oko 300–1.200 €',
    keywords: ['katalizator'],
  },

  // --- Motor ----------------------------------------------------------------
  {
    id: 'turbina',
    term: 'Turbina (turbo punjač)',
    category: 'Motor',
    what: 'Koristi izduvne gasove da ubaci više vazduha u motor i tako poveća snagu. Ima je većina dizel i mnogi noviji benzinski motori.',
    symptoms: ['Zviždanje koje raste sa gasom', 'Plavi ili beli dim iz auspuha', 'Gubitak snage', 'Ulje u crevima usisa'],
    cost: 'Reparacija oko 300–600 €, nova turbina 600–1.500 €',
    tip: 'Turbina najduže traje uz redovnu zamenu ulja i kratko čekanje u leru pre gašenja posle brze vožnje.',
    keywords: ['turbin', 'turbo'],
  },
  {
    id: 'razvod',
    term: 'Razvodni kaiš / lanac',
    category: 'Motor',
    what: 'Povezuje radilicu i bregasto vratilo tako da se ventili otvaraju u pravom trenutku. Kaiš se menja preventivno po intervalu proizvođača; lanac bi trebalo da traje duže, ali kod nekih motora se isteže.',
    symptoms: ['Zveckanje pri hladnom startu (istegnut lanac)', 'Motor ne pali ili radi neravnomerno', 'Ako kaiš pukne — često teško oštećenje motora'],
    cost: 'Preventivna zamena kaiša 150–400 €, zamena lanca 500–1.500 €',
    tip: 'Ako nema dokaza da je kaiš menjan po intervalu, računaj da ga menjaš odmah posle kupovine.',
    keywords: ['razvod', 'zupčast', 'lanac', 'kaiš'],
  },
  {
    id: 'injektori',
    term: 'Injektori (dizne)',
    category: 'Motor',
    what: 'Ubrizgavaju gorivo u cilindre pod visokim pritiskom. Kod dizela su osetljivi na kvalitet goriva.',
    symptoms: ['Težak start', 'Neujednačen rad i vibracije', 'Crni dim', 'Povećana potrošnja', 'Lupkanje motora'],
    cost: 'Servis ili reparacija oko 80–200 € po komadu, novi 200–500 € po komadu',
    keywords: ['injektor', 'dizn', 'brizgaljk'],
  },
  {
    id: 'grejaci',
    term: 'Grejači (svećice za grejanje)',
    category: 'Motor',
    what: 'Zagrevaju cilindre dizel motora pre paljenja, da bi motor lakše upalio po hladnom vremenu.',
    symptoms: ['Težak start po hladnom', 'Beli dim odmah posle paljenja', 'Lampica sa spiralom trepće'],
    cost: 'Zamena kompleta oko 50–200 €',
    keywords: ['grejač', 'svećice za grejanje'],
  },
  {
    id: 'potrosnja-ulja',
    term: 'Potrošnja ulja',
    category: 'Motor',
    what: 'Svaki motor troši malo ulja, ali kod nekih modela su poznati problemi sa prstenovima klipa ili ventilima zbog kojih potrošnja postaje velika.',
    symptoms: ['Često dolivanje ulja između servisa', 'Plavičast dim iz auspuha', 'Zauljene svećice'],
    cost: 'Od jeftine provere do remonta motora od 1.000 € i više',
    tip: 'Pitaj koliko često se ulje dosipa i pogledaj nivo na šipki — prazna šipka kod prodavca je loš znak.',
    keywords: ['potrošnja ulja', 'troši ulje', 'prstenov'],
  },

  // --- Menjač i prenos --------------------------------------------------------
  {
    id: 'dsg',
    term: 'DSG',
    fullName: 'Menjač sa dvostrukim kvačilom',
    category: 'Menjač i prenos',
    what: 'Automatski menjač (VW grupa) sa dva kvačila koji menja brzine veoma brzo. Upravlja ga elektronski sklop — mehatronika.',
    symptoms: ['Trzaji pri kretanju ili na malim brzinama', 'Kašnjenje pri ubacivanju u brzinu', 'Lampica menjača i rad u "nuždi"'],
    cost: 'Servis ulja 150–300 €, kvačila 600–1.500 €, mehatronika 800–2.000 €',
    tip: 'Traži dokaz o zameni ulja u menjaču. Na test vožnji obrati pažnju na polazak i sporu vožnju u koloni.',
    keywords: ['dsg', 'dvostruk', 'mehatronik'],
  },
  {
    id: 'cvt',
    term: 'CVT',
    fullName: 'Kontinualno varijabilni menjač',
    category: 'Menjač i prenos',
    what: 'Automatski menjač bez klasičnih stepeni prenosa — prenos se menja kontinuirano. Vožnja je glatka, ali osećaj ubrzanja je drugačiji ("motor zavija").',
    symptoms: ['Zujanje ili cviljenje', 'Proklizavanje — obrtaji rastu, a auto ne ubrzava', 'Trzaji pri kretanju'],
    cost: 'Servis ulja 100–250 €, popravka ili zamena 1.500–4.000 €',
    keywords: ['cvt', 'varijabil'],
  },
  {
    id: 'zamajac',
    term: 'Dvomaseni zamajac',
    category: 'Menjač i prenos',
    what: 'Zamajac između motora i kvačila koji ublažava vibracije motora. Čest kod dizela; menja se obično zajedno sa kvačilom.',
    symptoms: ['Lupkanje ili zveckanje pri gašenju i paljenju', 'Vibracije u leru i pri kretanju', 'Metalni zvuk pri pritiskanju kvačila'],
    cost: 'Zajedno sa kvačilom oko 400–1.000 €',
    keywords: ['zamajac', 'dvomasen'],
  },
  {
    id: 'kvacilo',
    term: 'Kvačilo',
    category: 'Menjač i prenos',
    what: 'Odvaja motor od menjača dok menjaš brzinu. Troši se postepeno, brže pri gradskoj vožnji i čestom kretanju uzbrdo.',
    symptoms: ['Kvačilo "hvata" visoko', 'Obrtaji rastu, a auto ne ubrzava (proklizavanje)', 'Miris paljevine posle kretanja uzbrdo'],
    cost: 'Zamena oko 250–600 € (više ako se menja i zamajac)',
    keywords: ['kvačil', 'kvacil'],
  },

  // --- Elektrika i elektronika ----------------------------------------------
  {
    id: 'hibridna-baterija',
    term: 'Hibridna baterija',
    category: 'Elektrika i elektronika',
    what: 'Velika baterija koja pokreće elektromotor hibrida. Kod većine proizvođača traje dugo, ali kapacitet opada sa godinama.',
    symptoms: ['Elektromotor radi sve kraće', 'Benzinski motor se pali češće nego ranije', 'Upozorenje hibridnog sistema'],
    cost: 'Zamena ćelija ili reparacija oko 800–2.000 €, nova baterija skuplje',
    tip: 'Kod ovlašćenog servisa se može uraditi provera stanja baterije — vredi je platiti pre kupovine.',
    keywords: ['hibridn', 'baterij'],
  },
  {
    id: 'klima-kompresor',
    term: 'Kompresor klime',
    category: 'Elektrika i elektronika',
    what: 'Srce klima uređaja — sabija rashladni gas. Kvari se češće ako klima dugo ne radi ili sistem curi.',
    symptoms: ['Klima ne hladi ni posle dopune gasa', 'Glasno zujanje kad se klima uključi'],
    cost: 'Dopuna gasa oko 30–60 €, novi kompresor 300–700 €',
    keywords: ['klim', 'kompresor'],
  },
  {
    id: 'infotainment',
    term: 'Infotainment i elektronika',
    category: 'Elektrika i elektronika',
    what: 'Ekran, navigacija, senzori i komfor elektronika. Kod starijih modela česti su sitni kvarovi koji nisu opasni, ali umeju da nerviraju.',
    symptoms: ['Ekran se zamrzava ili restartuje', 'Senzori za parkiranje lažno pište', 'Neispravni prozori ili brave'],
    cost: 'Od nekoliko desetina evra (softver, senzor) do nekoliko stotina (ekran, modul)',
    tip: 'Na pregledu isprobaj svako dugme — to je najbrži način da nađeš sitne kvarove.',
    keywords: ['infotainment', 'multimedij', 'elektronik'],
  },
]

/**
 * Pronalazi pojam iz rečnika koji se pominje u tekstu (npr. u opisu kvara iz AI analize).
 * Vraća prvi pojam čija se ključna reč pojavljuje u tekstu, ili undefined.
 */
export function findGlossaryTerm(text: string): GlossaryTerm | undefined {
  const lower = text.toLowerCase()
  return GLOSSARY.find((term) => term.keywords.some((keyword) => lower.includes(keyword)))
}
