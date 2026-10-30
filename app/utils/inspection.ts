// Opšti spisak za pregled polovnog automobila — važi za bilo koji model.
// Koristi se na početnoj (HomeInspectionGuide) i u vodiču (/vodic). Obe stranice čuvaju napredak
// pod istim ključem, pa štiklirano na jednoj ostaje štiklirano i na drugoj.

export const GENERAL_INSPECTION_STORAGE_KEY = 'checklist:opsti-pregled'

export const GENERAL_INSPECTION_POINTS = [
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

export const WHAT_TO_BRING = [
  { title: 'Baterijska lampa', text: 'za pogled ispod auta i u motorni prostor' },
  { title: 'Papirna maramica', text: 'za proveru boje i čistoće ulja na šipki' },
  { title: 'OBD čitač', text: 'jeftin uređaj koji pokazuje obrisane greške u računaru' },
  { title: 'Još jedna osoba', text: 'da posmatra auspuh i svetla dok ti voziš' },
]
