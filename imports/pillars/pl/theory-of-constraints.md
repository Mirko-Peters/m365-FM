# SEO metadata

| Field | Value |
|---|---|
| Meta title | Engpasstheorie in der Fertigung: 5 Schritte, Engpässe |
| Meta description | Engpasstheorie in der Fertigung: fünf Fokussierungsschritte, Engpassanalyse, Drum-Buffer-Rope mit Zahlen, Durchsatzrechnung und Vorlagen. |
| Slug | `theory-of-constraints` |

# Theorie der Engpässe: Die fünf Fokussierungsschritte, Engpässe und Drum-Buffer-Rope

> **Krótka odpowiedź:** Teoria ograniczeń (theory of constraints, TOC) to podejście zarządcze opracowane przez Eliyahu M. Goldratta i wprowadzone w powieści biznesowej *Cel* z 1984 roku. Mówi ona, że wydajność każdego systemu ogranicza bardzo niewiele ograniczeń, często pojedyncze wąskie gardło, dlatego wysiłek doskonalenia należy kierować przede wszystkim właśnie tam. TOC przekłada tę zasadę na praktykę za pomocą pięciu kroków koncentracji (identyfikacja, eksploatacja, podporządkowanie, podniesienie, zapobieganie bezwładności), metody harmonogramowania drum-buffer-rope oraz rachunku przepustowości (throughput accounting) [1][4][6].

> **Kluczowe wnioski**
> - *Cel* autorstwa Eliyahu M. Goldratta i Jeffa Coxa został po raz pierwszy opublikowany w 1984 roku przez North River Press; do 2011 roku sprzedano ponad 5 milionów egzemplarzy w 35 językach [1][2].
> - Pięć kroków koncentracji to: zidentyfikować ograniczenie, eksploatować je, podporządkować mu wszystko pozostałe, podnieść jego wydajność i nie dopuścić, by bezwładność stała się ograniczeniem [4].
> - Godzina straty na ograniczeniu to godzina straty dla całego zakładu. Godzina zaoszczędzona w miejscu, które nie jest ograniczeniem, nic nie zmienia, chyba że odciąża ograniczenie.
> - Drum-buffer-rope (DBR) planuje ograniczenie (bęben, drum), chroni je buforem czasowym (buffer) i zwalnia materiał wyłącznie w tempie, jakie ograniczenie jest w stanie przyjąć (lina, rope) [6][8].
> - Rachunek przepustowości ocenia decyzje na podstawie przepustowości (sprzedaż pomniejszona o rzeczywiście zmienny koszt), zapasów/inwestycji i kosztów operacyjnych oraz szereguje wyroby według przepustowości przypadającej na minutę ograniczenia, co może odwrócić kolejność wynikającą ze standardowej rachunkowości kosztów [6][19][20].
> - Wykrywanie wąskich gardeł powinno opierać się na danych: sprawdzeniu obciążenia zdolności produkcyjnych, obserwacji kolejek i, tam gdzie istnieją dane o stanie maszyn, metodzie okresów aktywności (active period method), która pokazuje również przesuwające się wąskie gardła [13][14][15].
> - Przegląd z 2003 roku, obejmujący ponad 80 opublikowanych zastosowań TOC, wykazał duże korzyści operacyjne i finansowe oraz brak zgłoszonych porażek, co również mówi coś o tym, które przypadki trafiają do publikacji [10].
> - TOC, lean i Six Sigma działają najlepiej razem: TOC wskazuje, na czym się skupić, lean eliminuje marnotrawstwo i tworzy przepływ, a Six Sigma redukuje zmienność w miejscu, które ma znaczenie.

## Spis treści

1. [Czym jest teoria ograniczeń? Definicja i główna idea](#czym-jest-teoria-ograniczeń-definicja-i-główna-idea)
2. [Historia: Eliyahu Goldratt, OPT i *Cel*](#historia-eliyahu-goldratt-opt-i-the-goal)
3. [Ograniczenie a wąskie gardło: rodzaje ograniczeń](#ograniczenie-a-wąskie-gardło-rodzaje-ograniczeń)
4. [Pięć kroków koncentracji](#pięć-kroków-koncentracji)
5. [Przykład teorii ograniczeń: pięć kroków koncentracji w zakładzie produkującym kolektory](#przykład-teorii-ograniczeń-pięć-kroków-koncentracji-w-zakładzie-produkującym-kolektory)
6. [Analiza wąskiego gardła: jak zidentyfikować wąskie gardło (sześć metod)](#analiza-wąskiego-gardła-jak-zidentyfikować-wąskie-gardło-sześć-metod)
7. [Harmonogramowanie drum-buffer-rope na liczbach](#harmonogramowanie-typu-drum-buffer-rope-z-liczbami)
8. [Uproszczony drum-buffer-rope (S-DBR) dla produkcji na zamówienie](#uproszczony-drum-buffer-rope-s-dbr-dla-produkcji-na-zamówienie)
9. [Zarządzanie buforami: pętla sprzężenia zwrotnego](#zarządzanie-buforami-pętla-sprzężenia-zwrotnego)
10. [Fizyka fabryki u podstaw TOC: prawo Little'a i zmienność](#fizyka-fabryki-stojąca-za-toc-prawo-littlea-i-zmienność)
11. [Rachunek przepustowości a rachunek kosztów](#rachunkowość-przepustowości-a-rachunkowość-kosztów)
12. [Procesy myślowe](#procesy-myślowe)
13. [TOC a lean a Six Sigma](#toc-vs-lean-vs-six-sigma)
14. [Poza zakładem: łańcuch krytyczny i uzupełnianie zapasów](#poza-halą-łańcuch-krytyczny-i-uzupełnianie-zapasów)
15. [Szablony do pracy z TOC](#szablony-do-pracy-z-toc)
16. [Plan wdrożenia: pierwsze sześć miesięcy](#plan-wdrożenia-pierwsze-sześć-miesięcy)
17. [Wskaźniki KPI TOC: jak mierzyć postęp](#toc-kpi-jak-mierzyć-postęp)
18. [Typowe błędy](#częste-błędy)
19. [Krytyka i ograniczenia teorii ograniczeń](#krytyka-i-ograniczenia-teorii-ograniczeń)
20. [Ludzie i bezpieczeństwo przy ograniczeniu](#ludzie-i-bezpieczeństwo-przy-ograniczeniu)
21. [TOC w cyfrowej fabryce: dane, symulacja i APS](#toc-w-cyfrowej-fabryce-dane-symulacja-i-aps)
22. [Słowniczek](#glosariusz)
23. [FAQ: pytania o teorię ograniczeń](#faq-pytania-dotyczące-teorii-ograniczeń)
24. [Podsumowanie i pierwsze kroki](#podsumowanie-i-pierwsze-kroki)

**Która sekcja odpowiada Twojej roli?**

| Jesteś ... | Zacznij od |
|---|---|
| Kierownik zakładu lub dyrektor operacyjny | Rozdziały 4, 5, 16 i 18 |
| Planista produkcji lub harmonogramista | Rozdziały 6–10 |
| Kontroler zakładu lub CFO | Rozdziały 11 i 17 |
| Lider CI, Lean lub Six Sigma | Rozdziały 12, 13 i 15 |
| Student lub osoba początkująca w TOC | Rozdziały 1–5, następnie słowniczek |

## Czym jest teoria ograniczeń? Definicja i główna idea

Teoria ograniczeń to sposób zarządzania organizacją jako łańcuchem zależnych od siebie etapów. Jej punkt wyjścia jest prosty: każdy system, który ma jakiś cel, ma co najmniej jeden czynnik ograniczający to, jak dużo tego celu może osiągnąć. TOC Institute posługuje się analogią łańcucha: łańcuch jest tak mocny, jak jego najsłabsze ogniwo, a wzmacnianie innego ogniwa nie czyni łańcucha mocniejszym [4]. Późniejsze książki Goldratta oraz społeczność TOC rozszerzyły tę ideę z hali produkcyjnej na dystrybucję, projekty, finanse i strategię [6].

W przypadku zakładu produkcyjnego cel zwykle określa się jako zarabianie pieniędzy teraz i w przyszłości. Czynnikiem ograniczającym może być maszyna, umiejętność, dostawca, polityka lub sam rynek. TOC nazywa go ograniczeniem. Podstawowa teza brzmi, że większość systemów ma w danym momencie tylko jedno lub bardzo nieliczne ograniczenia. TOC Institute stwierdza, że większość systemów ma jeden zasób ograniczający zdolność produkcyjną, a rzadko więcej niż dwa lub trzy [4].

### Główna idea w jednym akapicie

Jeśli wydajność zakładu jest ograniczona przez jeden zasób, to wydajność zakładu równa się wydajności tego zasobu. Każda minuta, którą ten zasób traci, to minuta produkcji, którą zakład traci bezpowrotnie. Każda minuta zaoszczędzona gdzie indziej to co najwyżej nadmiarowa zdolność, a w najgorszym razie dodatkowe zapasy czekające przed ograniczeniem. Dlatego TOC mówi, że lokalne usprawnienia na stanowiskach nieograniczających nie sumują się do wyniku zakładu. Optymalizowanie każdego etapu osobno to zmarnowany wysiłek; TOC usprawnia cały system poprzez jego ograniczenie.

### Teoria ograniczeń w produkcji: dlaczego ma znaczenie w praktyce

Trzy codzienne sytuacje w zakładzie pokazują tę ideę:

| Sytuacja | Typowa reakcja bez TOC | Reakcja z TOC |
|---|---|---|
| Zamówienia są spóźnione, a WIP leży wszędzie | przyspieszanie realizacji, nadgodziny wszędzie, rozpoczynanie zleceń wcześniej | znaleźć jeden zasób ograniczający wydajność i wprowadzać pracę w jego tempie |
| Maszyna nieograniczająca stoi bezczynnie | znaleźć jej zajęcie, by utrzymać wysoką „efektywność” | pozwolić jej czekać; bezczynność na stanowisku nieograniczającym jest normalna i tania |
| Proponowany jest nowy park maszynowy | zatwierdzić, bo dział jest zajęty | zapytać, czy zwiększa zdolność na ograniczeniu i jaki ma wpływ na przepustowość |

### Korzyści z teorii ograniczeń

Najczęściej raportowane korzyści to krótsze czasy realizacji, lepsza dotrzymywalność terminów, niższe zapasy i wyższa przepustowość. Przegląd opublikowanych zastosowań, przeprowadzony przez Mabina i Balderstone'a, a streszczony przez Panizzolo, wykazał średnie poprawy: 70 procent w czasie realizacji od zamówienia do dostawy, 65 procent w czasie cyklu produkcyjnego, 49 procent w zapasach, 63 procent w przepustowości lub przychodach oraz 44 procent w dotrzymywaniu terminów [11]. Panizzolo przypisuje te średnie obszernemu przeglądowi Mabina i Balderstone'a *The World of the Theory of Constraints* (2000); artykuł z 2003 roku autorów tego samego zespołu analizuje ten sam zbiór ponad 80 przypadków [10][11]. Te liczby należy traktować jako górną granicę tego, co jest możliwe: pochodzą z opublikowanych historii sukcesu, a oryginalny przegląd nie znalazł żadnych doniesień o porażkach [10]. Rozdział 19 omawia, co to oznacza.

Poza liczbami TOC daje zakładowi wspólną odpowiedź na pytanie „od czego zacząć?”. To często najważniejsza zmiana: mniej projektów usprawnień procesów, skierowanych tam, gdzie zmieniają wynik.

## Historia: Eliyahu Goldratt, OPT i The Goal

Eliyahu M. Goldratt urodził się 31 marca 1947 roku, a zmarł 11 czerwca 2011 roku w swoim domu w Izraelu. Posiadał tytuł licencjata (BSc) Uniwersytetu Tel Awiwskiego oraz tytuł magistra (MSc) i doktora (PhD) Uniwersytetu Bar-Ilan [2][3]. Zanim TOC otrzymała swoją nazwę, pracował w firmie Creative Output, która sprzedawała Optimized Production Technology (OPT), oprogramowanie do harmonogramowania produkcji [3].

| Rok | Kamień milowy | Źródło |
|---|---|---|
| przed 1984 | Oprogramowanie do harmonogramowania OPT sprzedawane przez Creative Output, techniczne źródło drum-buffer-rope (dokładny rok premiery [unverified]) | [3] |
| 1984 | *The Goal: Excellence in Manufacturing* autorstwa Goldratta i Jeffa Coxa, North River Press, 262 strony | [1] |
| ok. 1985 | Założenie Avraham Y. Goldratt Institute po odejściu Goldratta z Creative Output | [3] |
| 1986 | *The Race* (z Robertem E. Foxem) szczegółowo opisuje drum-buffer-rope; poprawione pierwsze wydanie *The Goal* | [3][7][8] |
| 1990 do 1991 | *The Haystack Syndrome*: przepustowość, zapasy i koszty operacyjne jako miary decyzyjne | [3][20] |
| 1992 | drugie poprawione wydanie *The Goal* | [3][7] |
| 1994 | *It's Not Luck*: procesy myślowe dla marketingu i strategii | [3][12] |
| 1997 | *Critical Chain*: TOC zastosowana do zarządzania projektami | [3] |
| 2000 | *Necessary But Not Sufficient*: TOC a oprogramowanie dla przedsiębiorstw | [3] |
| 2004 | trzecie poprawione wydanie *The Goal* | [7] |
| 2009 | *Isn't It Obvious?* (handel detaliczny i dystrybucja) | [3] |
| 2010 | *Theory of Constraints Handbook* (red. Cox i Schleier), standardowe źródło wiedzy o DBR, S-DBR i zarządzaniu buforami | [9] |
| 2011 | Śmierć Goldratta; *The Goal* znalazła się przez magazyn Time na liście 25 najbardziej wpływowych książek o zarządzaniu biznesem (lista Time cytowana przez Wikipedię) | [2][7] |
| 2014 | czwarte poprawione wydanie *The Goal* (30. rocznica; lista wydań z nieopatrzonego źródłem infoboksu) | [7] |

### The Goal: powieść jako podręcznik

*The Goal* opowiada historię Alexa Rogo, kierownika zakładu, który ma trzy miesiące na odwrócenie złej sytuacji zakładu. Jego dawny profesor fizyki, Jonah, prowadzi go przez pytania, a nie odpowiedzi [7]. Najczęściej cytowana scena to wędrówka harcerska: drużyna może poruszać się tylko tak szybko, jak jej najwolniejszy chłopak, Herbie, a luki w szyku rosną, gdy szybcy wędrowcy narzucają tempo. Rogo rozwiązuje problem, stawiając Herbiego na czele, odciążając jego plecak i łącząc grupę liną. To pięć kroków koncentracji i drum-buffer-rope w jednym popołudniu: zidentyfikować Herbiego, wykorzystać go (lżejszy plecak), podporządkować drużynę jego tempu i skrócić szyk.

Forma powieści sprawiła, że idee stały się zrozumiałe dla nadzorców i operatorów, a nie tylko dla inżynierów. Wydawnictwo North River Press poinformowało w 2011 roku, że książka sprzedała się w ponad 5 milionach egzemplarzy w 35 językach [2].

### Od OPT do filozofii zarządzania

TOC rozwijała się etapami. Pierwszym było harmonogramowanie (OPT, potem DBR). Drugim pomiar (rachunkowość przepustowości). Trzecim ogólna metoda rozwiązywania problemów (procesy myślowe). Czwartym było zastosowanie tej logiki do projektów (critical chain) i dystrybucji (uzupełnianie zapasów) [6][12]. Dziś Theory of Constraints International Certification Organization (TOCICO), amerykańska organizacja non-profit działająca na podstawie 501(c)(3), certyfikuje praktyków na trzech poziomach: egzaminy z podstaw, egzaminy praktyków i ocenę wdrożeniowca [5].

## Ograniczenie a wąskie gardło: rodzaje ograniczeń

Terminy „ograniczenie” i „wąskie gardło” są często używane jako synonimy. Nie są one jednak dokładnie tym samym.

- **Wąskie gardło** to zasób, którego zdolność przerobowa jest mniejsza niż zapotrzebowanie na niego. Jest to pojęcie związane z mocą produkcyjną.
- **Ograniczenie** to wszystko, co ogranicza wydajność systemu w dążeniu do celu. Może nim być wąskie gardło, ale także rynek, materiał, polityka lub sposób myślenia.
- **Zasób ograniczony zdolnością (CCR)** to zasób, który w średniej nie jest wąskim gardłem, ale nim się staje, jeśli nie jest starannie zarządzany, na przykład z powodu szczytów w strukturze produktów.

Każde wąskie gardło ogranicza przepustowość tylko wtedy, gdy znajduje się na ścieżce zleceń, które mają znaczenie. Zakład może mieć maszynę będącą „wąskim gardłem”, przeciążoną pracą o niskim priorytecie, podczas gdy prawdziwym ograniczeniem jest rynek. TOC dlatego najpierw pyta: co ogranicza cel?

### Rodzaje ograniczeń

| Rodzaj | Przykład | Jak go rozpoznać | Typowy pierwszy krok |
|---|---|---|---|
| Fizyczne: urządzenia | centrum obróbcze 5-osiowe, piec do obróbki cieplnej, linia malowania | stała kolejka przed zasobem, bezczynne zasoby za nim | eksploatacja: brak straconych minut |
| Fizyczne: ludzie i umiejętności | tylko dwóch certyfikowanych spawaczy na zmianę | praca czeka na konkretne osoby | szkolenia krzyżowe, planowanie grafiku pod kątem umiejętności |
| Materiałowe | odlew z czasem realizacji 16 tygodni | montaż czeka na jedną część | bufor uzupełnień, drugie źródło dostaw |
| Rynkowe | popyt poniżej zdolności zakładu | wszędzie wolne moce, sprzedaż poniżej planu | ograniczenie leży na zewnątrz; poprawić ofertę i czas realizacji |
| Polityczne | „uruchamiać tylko pełne partie”, „utrzymywać każdą maszynę powyżej 85% wydajności” | reguły wymuszające błędne zachowania | procesy myślowe, zmiana reguły |
| Paradygmat | „zapasy są aktywem”, „zajęty zakład to dobry zakład” | opór wobec bezczynności zasobów nieograniczających | edukacja, gry symulacyjne |

W praktyce ograniczenia polityczne wymagają szczególnej uwagi: ograniczenie fizyczne jest często hamowane przez regułę (minimalne partie, reguły zwolnień, cele wykorzystania), a nie przez jego rzeczywistą zdolność. Przykład z rozdziału 5 pokazuje dwie takie reguły.

### Wąskie gardła statyczne, dynamiczne i przesuwające się

Wąskie gardło **statyczne** pozostaje na tym samym zasobie przez miesiące. Wąskie gardło **dynamiczne** lub **przesuwające się** przemieszcza się między zasobami wraz ze strukturą produktów, awariami lub obsadą. Różnica ma znaczenie przy wyborze metody: statyczne wąskie gardło można prowadzić stałym ustawieniem DBR, natomiast przesuwające się wymaga danych i często APS do obliczenia obciążenia każdego zasobu dla bieżącego portfela zleceń [13][14]. Rozdział 6 pokazuje, jak je odróżnić.

### VATI: typ zakładu kształtuje ograniczenie

TOC klasyfikuje zakłady według kształtu przepływu materiału, znanego jako analiza VATI [6][9]:

| Typ | Kształt przepływu | Przykład | Typowy problem |
|---|---|---|---|
| V | kilka surowców rozgałęzia się w wiele produktów | stal, papier, chemikalia, wytłaczanie | błędna alokacja: materiał przypisany zbyt wcześnie do niewłaściwego produktu |
| A | wiele części zbiega się w kilka produktów | montaż lotniczy, budowa maszyn | części przychodzą niezsynchronizowane, montaż czeka na ostatnią część |
| T | kilka komponentów, składanych późno w wiele wariantów | elektronika, sprzęt AGD | części „podbierane” między wariantami, niezgodność wyrobów gotowych |
| I | linia prosta | proste linie obróbcze | klasyczne zachowanie wąskiego gardła |

Większość rzeczywistych zakładów to kombinacje. Typ zakładu wskazuje, gdzie należy umieścić bufory: przed montażem w zakładzie typu A, przed rozgałęzieniem w zakładzie typu V.

## Pięć kroków koncentracji

Pięć kroków koncentracji to rdzeń procedury TOC. Instytut TOC formułuje je następująco: zidentyfikuj ograniczenie systemu, wykorzystaj ograniczenie, podporządkuj mu wszystko inne, podnieś ograniczenie i zapobiegaj temu, by bezwładność nie stała się ograniczeniem [4]. Goldratt nazwał ten cykl procesem ciągłego doskonalenia (POOGI), który jest także podtytułem późniejszych wydań *Celu* [6]. Ponieważ krok 5 prowadzi z powrotem do kroku 1, pięć kroków tworzy ciągły cykl doskonalenia: gdy jedno ograniczenie systemu zostanie przełamane, nowe pojawia się gdzie indziej i praca zaczyna się od nowa.

Przed krokiem 1 należy odpowiedzieć na dwa pytania: jaki jest cel systemu i jak mierzyć postęp w jego kierunku? W przedsiębiorstwie TOC posługuje się jako miarami przepustowością, zapasami (lub inwestycjami) oraz kosztami operacyjnymi (rozdział 11).

| Krok | Pytanie | Co to oznacza w zakładzie | Czego to nie oznacza |
|---|---|---|---|
| 1. Identyfikacja | Co aktualnie ogranicza przepustowość? | znajdź zasób, materiał, rynek lub politykę, która wyznacza tempo | wybór maszyny z największą liczbą awarii lub najwyższą ceną |
| 2. Wykorzystanie | Jak wycisnąć maksimum z tego, co mamy? | zero straconych minut, zero wadliwej pracy, właściwy miks produktów | kupowanie zdolności produkcyjnych |
| 3. Podporządkowanie | Jak wszystko inne wspiera krok 2? | zwolnienia, wielkości partii, utrzymanie ruchu, jakość i obsada podążają za ograniczeniem | utrzymywanie wszystkich zasobów w ciągłym obciążeniu |
| 4. Podniesienie | Jeśli wciąż za mało, jak dodać zdolności? | nadgodziny, outsourcing, druga maszyna, nowy dostawca | pierwszy odruch |
| 5. Zapobieganie bezwładności | Czy ograniczenie się przesunęło? Czy stare reguły są teraz ograniczeniem? | wróć do kroku 1, przejrzyj reguły stworzone dla dawnego ograniczenia | ogłaszanie zwycięstwa |

### Krok 1: Identyfikacja ograniczenia

Ograniczeniem jest zasób, którego zdolność jest najniższa w stosunku do obciążenia, jakie na niego przypada. W praktyce zacznij od obliczenia obciążenia (zapotrzebowanie pomnożone przez czas procesu, porównane z dostępnym czasem), a następnie potwierdź to na hali: gdzie tworzy się kolejka, gdzie ludzie czekają na zasób, o który kierownicy pytają bez przerwy? Instytut TOC dodaje, że błędnie zidentyfikowane ograniczenie łatwo skorygować bez trwałych szkód, co jest dobrym powodem, by nie czekać na idealne dane [4]. Rozdział 6 opisuje sześć metod wykrywania.

### Krok 2: Wykorzystanie ograniczenia

Wykorzystanie oznacza maksymalne zwiększenie wydajności ograniczenia bez znaczących wydatków. Instytut TOC twierdzi, że ograniczenie bywa wykorzystywane przez mniej niż 50 procent czasu w trybie 24/7, a pierwsze trzy kroki zwykle ujawniają co najmniej 30 procent ukrytej zdolności w ciągu kilku miesięcy; obie tezy nie mają opublikowanego zbioru danych, więc zweryfikuj je we własnym zakładzie [4]. Typowe działania wykorzystujące:

- zabezpiecz przerwy, zmiany i narady tak, by ograniczenie cały czas pracowało;
- przenieś przygotowanie przezbrojeń poza czas pracy ograniczenia (przezbrojenie zewnętrzne, zob. przewodnik [SMED i skracanie przezbrojeń](https://www.m365.fm/en/learn/smed-changeover-reduction/));
- kontroluj przed ograniczeniem, aby nigdy nie obrabiało części, która już jest złomem (w środowiskach AS9100 lub IATF 16949 przeniesienie punktu kontroli wymaga aktualizacji planu kontroli i PFMEA);
- sprawdzaj jakość bezpośrednio za ograniczeniem, ponieważ część odrzucona później kosztuje czas ograniczenia;
- utrzymuj bufor pracy przed nim, aby nigdy nie zabrakło mu materiału;
- nadaj mu priorytet w utrzymaniu ruchu, programowaniu, oprzyrządowaniu i transporcie materiałów;
- dobieraj miks produktów według przepustowości na minutę pracy ograniczenia (rozdział 11);
- przekazuj inne zasoby pracę, którą mogą wykonać, nawet mniej wydajnie.

### Krok 3: Podporządkowanie wszystkiego pozostałego

Podporządkowanie jest najtrudniejszym krokiem, ponieważ działa wbrew lokalnym miernikom wydajności. Zasoby nieograniczające muszą mieć zapas zdolności, który powinny wykorzystać do ochrony ograniczenia, a nie do budowania zapasów. Przykłady:

- **Zwolnienia:** materiał wchodzi do zakładu w tempie ograniczenia (lina w DBR).
- **Wielkości partii:** zasoby nieograniczające mogą pracować małymi partiami i wykonywać więcej przezbrojeń, bo mają zapas zdolności; ograniczenie może potrzebować większych partii, by oszczędzić czas przezbrojeń.
- **Utrzymanie ruchu:** awaria w ograniczeniu dostaje następnego technika; przegląd prewencyjny ograniczenia planuje się w zaplanowanych postojach.
- **Jakość:** zatwierdzenie pierwszej sztuki w ograniczeniu ma pierwszeństwo przed innymi kontrolami pierwszej sztuki.
- **Pomiary:** przestań nagradzać działy nieograniczające za wykorzystanie zdolności lub „wypracowane godziny”.

Instytut TOC zauważa, że często zmieniające się ograniczenia zakłócają działanie polityk, procedur i ludzi [4]. Podporządkowanie powinno zatem obejmować ochronę pozycji ograniczenia, na przykład przez utrzymywanie pozostałych zasobów znacznie powyżej zdolności produkcyjnej ograniczenia.

### Krok 4: Podnieś ograniczenie

Dopiero po wykonaniu kroków 2 i 3 należy wydawać pieniądze na zwiększenie zdolności. Opcje podniesienia obejmują nadgodziny lub dodatkową zmianę tylko na ograniczeniu, zlecenie na zewnątrz części jego pracy, zwiększenie liczby pracowników, zakup urządzeń lub przeprojektowanie produktu tak, by wymagał mniej czasu ograniczenia. Wiele zakładów przechodzi od razu do tego kroku i kupuje maszynę, podczas gdy istniejące ograniczenie nadal traci ćwierć swojego czasu na przerwy, przezbrojenia i brak materiału.

### Krok 5: Nie pozwól, by bezwładność stała się ograniczeniem

Gdy eksploatacja i podnoszenie zdolności działają, ograniczenie często się przesuwa, a pojawia się nowe: na innej maszynie, u dostawcy lub na rynku. Reguły, które były słuszne dla starego ograniczenia, zaczynają szkodzić. Typowa bezwładność: duża wielkość partii dawnego wąskiego gardła pozostaje w marszrucie, reguła zwalniania zleceń powiązana ze starym bębnem pozostaje w ERP, albo dział sprzedaży nadal ogranicza przyjmowanie zamówień, choć zakład ma już wolne moce. Wróć do kroku 1 i przejrzyj reguły.

## Przykład teorii ograniczeń: pięć kroków koncentracji w zakładzie produkującym kolektory

Poniższy przykład został skonstruowany na potrzeby tego przewodnika. Liczby są wiarygodne dla małego amerykańskiego warsztatu maszynowego, ale nie są danymi z rzeczywistej firmy.

### Zakład

Zakład zatrudniający 60 osób, położony na Środkowym Zachodzie, produkuje bloki kolektorów hydraulicznych w dwóch rodzinach produktów:

- **Produkt A** (kolektor standardowy): cena 900 USD, materiał i części kupowane 400 USD.
- **Produkt B** (kolektor na zamówienie): cena 1200 USD, materiał i części kupowane 450 USD.

Zakład pracuje na dwie 8-godzinne zmiany, pięć dni w tygodniu: 80 godzin, czyli 4800 minut dostępnego czasu na zasób tygodniowo. Tygodniowy popyt wynosi 100 szt. A i 60 szt. B. Koszty operacyjne (cała praca, pensje, czynsz, energia, amortyzacja; wszystko z wyjątkiem rzeczywiście zmiennego materiału) wynoszą 62 000 USD tygodniowo.

### Krok 1: Zidentyfikuj ograniczenie za pomocą tabeli obciążeń

Czasy operacji w minutach na sztukę, z marszrut i zweryfikowane pomiarem na hali:

| Zasób | A (min/szt.) | B (min/szt.) | Obciążenie A (100 szt.) | Obciążenie B (60 szt.) | Łączne obciążenie (min) | Obciążenie vs. 4800 min |
|---|---|---|---|---|---|---|
| Piła | 8 | 10 | 800 | 600 | 1400 | 29% |
| Gniazdo CNC 5-osiowe | 25 | 40 | 2500 | 2400 | 4900 | **102%** |
| Odgratowanie i mycie | 12 | 12 | 1200 | 720 | 1920 | 40% |
| Montaż | 15 | 20 | 1500 | 1200 | 2700 | 56% |
| Próba ciśnieniowa | 10 | 15 | 1000 | 900 | 1900 | 40% |

**Obliczenie dla gniazda CNC:** 100 × 25 + 60 × 40 = 2500 + 2400 = 4900 minut wobec 4800 dostępnych, obciążenie 4900 ÷ 4800 = 102 procent. Nawet na papierze gniazdo CNC nie jest w stanie zaspokoić popytu.

Tabela obciążeń uwzględnia wyłącznie czas teoretyczny. Rzeczywisty obraz jest gorszy. Dwutygodniowe badanie czasu na gnieździe CNC (dziennik zmian oraz dane o stanie maszyny) pokazało, gdzie podziało się 4800 minut:

| Wykorzystanie czasu CNC w tygodniu | Minuty | Udział |
|---|---|---|
| Produktywna obróbka dobrych części | 3600 | 75,0% |
| Przerwy i przekazanie zmiany bez zastępstwa (2 zmiany × 30 min × 5 dni) | 300 | 6,3% |
| Przezbrojenia (15 w tygodniu × 30 min) | 450 | 9,4% |
| Głodówka: oczekiwanie na materiał, programy lub mocowania | 250 | 5,2% |
| Nieplanowane przestoje | 100 | 2,1% |
| Obrobione części, później odrzucone przy próbie ciśnieniowej | 100 | 2,1% |
| **Razem** | **4800** | **100%** |

Zatem efektywna zdolność ograniczenia to 3600 minut tygodniowo, wobec popytu 4900. Zakład może zaspokoić około 73 procent popytu (3600 ÷ 4900).

Pracownicy hali potwierdzili te liczby: średnio 2,5 dnia pracy czekało przed gniazdem CNC, podczas gdy montaż i próba ciśnieniowa regularnie czekały na części. Brygadziści wskazywali montaż jako wąskie gardło, bo „zawsze się spóźnia", ale montaż się spóźniał, ponieważ był głodzony przez gniazdo CNC.

### Krok 2a: Eksploatuj przez mix produktowy

Mając 3600 efektywnych minut, zakład nie może wyprodukować wszystkiego. Które produkty powinien wytwarzać w pierwszej kolejności? Tutaj rachunkowość przepływu (throughput accounting) i standardowa rachunkowość kosztów dają różne odpowiedzi (Rozdział 11 szczegółowo wyjaśnia tę logikę).

| | Produkt A | Produkt B |
|---|---|---|
| Cena | 900 USD | 1 200 USD |
| Rzeczywiście zmienny koszt (materiał) | 400 USD | 450 USD |
| Przepływ (throughput) na jednostkę (T) | 500 USD | 750 USD |
| Minuty CNC na jednostkę | 25 | 40 |
| **Przepływ na minutę CNC** | **20,00 USD** | **18,75 USD** |
| Marża kosztu standardowego na jednostkę (patrz sekcja 11) | 161,20 USD | 280,52 USD |

Produkt B wygląda lepiej w przeliczeniu na jednostkę, zarówno w jednej, jak i w drugiej metodzie. Jednak na minutę ograniczenia produkt A przynosi większy zysk.

- **Mix 1, najpierw B (to sugeruje raport kosztów):** 60 szt. B zużywa 2 400 min; pozostałe 1 200 min daje 48 szt. A. Przepływ = 60 × 750 USD + 48 × 500 USD = 45 000 USD + 24 000 USD = **69 000 USD**. Zysk netto = 69 000 USD − 62 000 USD = **7 000 USD tygodniowo**.
- **Mix 2, najpierw A (przepływ na minutę ograniczenia):** 100 szt. A zużywa 2 500 min; pozostałe 1 100 min daje 27 szt. B (27 × 40 = 1 080 min). Przepływ = 100 × 500 USD + 27 × 750 USD = 50 000 USD + 20 250 USD = **70 250 USD**. Zysk netto = 70 250 USD − 62 000 USD = **8 250 USD tygodniowo**.

Mix oparty na ograniczeniu przynosi 1 250 USD więcej tygodniowo, czyli około 65 000 USD rocznie przy 52 tygodniach, bez żadnych inwestycji. Zmienia to także rozmowę z działem sprzedaży: klienci produktu B potrzebują dłuższych zadeklarowanych terminów realizacji albo ceny odzwierciedlającej wykorzystanie ograniczenia przez B.

### Krok 2b: Eksploatacja przez utracony czas

Zespół następnie zajął się stratami z badania czasu:

| Miara | Koszt | Odzyskane minuty tygodniowo |
|---|---|---|
| Przesunięte przerwy; przeszkolony operator zastępczy utrzymuje gniazdo w ruchu | 1 500 USD tygodniowo (część etatu operatora zastępczego) | 300 |
| Przygotowanie przezbrojenia zewnętrznego: narzędzia, oprzyrządowanie i programy przygotowane przed zatrzymaniem maszyny; przezbrojenie z 30 do 18 min | około 6 000 USD jednorazowo za prezetter narzędzi i wózki | 180 (15 × 12 min) |
| Materiał i programy przygotowane z wyprzedzeniem jednej zmiany (bufor czasowy, patrz sekcja 7) | brak | 200 |
| Krytyczne wymiary otworów sprawdzane zaraz po obróbce zamiast przy próbie ciśnieniowej | szablony pomiarowe, około 2 500 USD jednorazowo | 70 |
| Konserwacja zapobiegawcza przeniesiona na zaplanowane okno weekendowe | brak | 50 |
| **Razem** | | **800** |

Efektywna zdolność rośnie z 3 600 do 4 400 minut tygodniowo, czyli o 22 procent (800 ÷ 3 600). Przy Mixie 2 zakład produkuje teraz 100 szt. A (2 500 min) i 47 szt. B (47 × 40 = 1 880 min, razem 4 380 min).

Przepływ = 100 × 500 USD + 47 × 750 USD = 50 000 USD + 35 250 USD = **85 250 USD tygodniowo**. Koszty operacyjne rosną o operatora zastępczego: 62 000 USD + 1 500 USD = 63 500 USD. Zysk netto = 85 250 USD − 63 500 USD = **21 750 USD tygodniowo**, wobec 8 250 USD wcześniej. Jednorazowe wydatki około 8 500 USD zwracają się w mniej niż tydzień.

To typowy wzorzec TOC: ponieważ koszty operacyjne są w krótkim okresie w większości stałe, każda dodatkowa minuta ograniczenia przechodzi niemal w całości na zysk.

### Krok 3: Podporządkowanie reszty zakładu

Aby utrzymać 800 minut, pozostała część zakładu musiała się zmienić:

- Piła przestała ciąć „żeby być zajętą". Teraz tnie tylko to, czego wymaga harmonogram CNC, zwalniany z wyprzedzeniem jednej zmiany (lina).
- Gniazdo CNC realizuje stałą tygodniową sekwencję, grupującą produkty według rodziny oprzyrządowania; piła i odgrzybianie/odgratowanie podążają za tą sekwencją.
- Konserwacja najpierw obsługuje wezwania z CNC; docelowy czas reakcji to 10 minut.
- Laboratorium jakości wykonuje kontrole pierwszej sztuki na CNC przed każdym innym zleceniem.
- Brygadziści piły i odgratowania nie są już oceniani według wykorzystania. Ich miarą jest: „CNC nigdy na nas nie czeka".

Wykorzystanie piły spada z około 45 procent (wtedy gromadziła zapasy) do 29 procent. Jest to zamierzone. W kategoriach TOC bezczynność piły to cena za chronione ograniczenie.

### Krok 4: Podniesienie ograniczenia

Po eksploatacji nadal niezaspokojonych pozostaje 13 szt. B tygodniowo (60 − 47). Trzy opcje podniesienia:

| Opcja | Dodatkowe minuty ograniczenia | Dodatkowy przepływ tygodniowo | Dodatkowe koszty operacyjne tygodniowo | Efekt netto tygodniowo | Komentarz |
|---|---|---|---|---|---|
| Sobotnia zmiana wyłącznie na gnieździe CNC (8 h, obsadzona na zasadzie zgłoszeń ochotniczych lub zgodnie z zasadami nadgodzin z układu zbiorowego) | 480 | 12 szt. B × 750 USD = 9 000 USD | 1 200 USD dodatek za nadgodziny i obsługa | **+7 800 USD** | szybkie, odwracalne |
| Zlecenie obróbki zgrubnej B na zewnątrz do warsztatu kooperacyjnego, 180 USD za sztukę | 13 szt. B nie wymaga pełnych 40 min | 13 × (750 USD − 180 USD) = 7 410 USD | koordynacja, około 300 USD | **+7 110 USD** | T na jednostkę spada do 570 USD, ponieważ koszt warsztatu jest rzeczywiście zmienny |
| Zakup drugiej maszyny 5-osiowej, 650 000 USD | 4 800 | 13 szt. B × 750 USD = 9 750 USD (popyt ogranicza zysk) | 4 000 USD (operator, amortyzacja, serwis) | **+5 750 USD** | zwrot około 650 000 USD ÷ 5 750 USD = 113 tygodni, chyba że popyt wzrośnie |

Zmiana sobotnia rozwiązuje problem. Druga maszyna ma sens tylko wtedy, gdy sprzedaż ją zapełni, ponieważ po jej zainstalowaniu ograniczeniem staje się rynek. Kontrola finansowa jest prosta: czy ta opcja podnosi T minus OE i o ile w stosunku do nakładu inwestycyjnego? Wzory znajdują się w sekcji 11.

### Krok 5: Zapobieganie bezwładności

Dzięki zmianie sobotniej gniazdo CNC dysponuje 4 880 efektywnymi minutami, co wystarcza na prawie cały popyt wynoszący 4 900 minut, minus kilka minut, więc to już popyt jest ograniczeniem. Nowy obraz obciążenia:

| Zasób | Obciążenie przy pełnym popycie | Obciążenie w stosunku do dostępnego czasu |
|---|---|---|
| Gniazdo CNC (z sobotą) | 4 900 | około 100% czasu efektywnego |
| Montaż | 2 700 | 56% |
| Próba ciśnieniowa | 1 900 | 40% |

Ograniczenie wkrótce przesunie się na rynek. Podczas przeglądu wykryto dwie pułapki bezwładności:

1. W ERP nadal figurowała stara minimalna partia dla produktu B, wynosząca 40 sztuk, ustalona przed laty, aby oszczędzać przezbrojenia CNC. Przy szybszych przezbrojeniach blokowała ona krótkie terminy realizacji. Partię obniżono do 10 sztuk.
2. Dział sprzedaży nadal podawał klientom sześć tygodni dla produktu B, „ponieważ zakład jest zawsze zapełniony”. Podany termin skrócono do trzech tygodni, co w ciągu kwartału pozyskało dwóch nowych klientów produktu B.

Wracając do kroku 1: jeśli nowi klienci produktu B podniosą popyt, gniazdo CNC znów stanie się ograniczeniem i opcja drugiej maszyny wymaga nowej kalkulacji. Ta pętla to właśnie proces ciągłego doskonalenia.

### Czego uczy ten przykład

| Wniosek | Dowód w przykładzie |
|---|---|
| Widoczne wąskie gardło może nie być ograniczeniem | nadzorcy obwiniali montaż, który był głodzony |
| Lepsze wykorzystanie bije inwestycję | 800 minut za 8 500 $ jednorazowo plus 1 500 $ tygodniowo, wobec 650 000 $ |
| Rachunek kosztów może błędnie uszeregować produkty | B wyglądał lepiej na sztukę, A zarabia więcej na minutę ograniczenia |
| Obiekty nieograniczające powinny mieć czas bezczynności | piła spadła z 45% do 29% wykorzystania |
| Stare reguły przeżywają stare ograniczenia | partia 40 sztuk i sześciotygodniowa oferta |

## Analiza wąskiego gardła: jak zidentyfikować wąskie gardło (sześć metod)

Analiza wąskiego gardła to praca polegająca na znalezieniu zasobu ograniczającego przepustowość, zmierzeniu, ile produkcji kosztuje, i sprawdzeniu, czy ten zasób się nie przesuwa. Jest to krok 1 z pięciu kroków koncentracji i należy ją powtarzać, ilekroć zmienia się miks produktów, popyt lub harmonogram produkcji.

Wąskim gardłem nie zawsze jest najdroższa maszyna, ta, która najczęściej się psuje, ani dział, którego kierownik najgłośniej protestuje. Należy stosować więcej niż jedną metodę i sprawdzać, czy dają zgodne wyniki.

### Metoda 1: Obliczenie obciążenia zdolności produkcyjnych

Dla każdego zasobu porównuje się czas, którego wymaga popyt, z czasem dostępnym.

**Wzór:** Obciążenie (%) = Σ (popyt na produkt × czas procesu na jednostkę, łącznie z przezbrojeniami) ÷ dostępny czas × 100

Zasób z najwyższym obciążeniem jest kandydatem na wąskie gardło. Sekcja 5 pokazuje obliczenie; gniazdo CNC miało 102 procent przy czasach teoretycznych. Dwa udoskonalenia czynią tę metodę wiarygodną:

1. **Używaj czasu efektywnego, a nie nominalnego.** Podziel obciążenie teoretyczne przez udział czasu, w którym zasób faktycznie wytwarza dobre części (dostępność × jakość lub zmierzony udział produktywny). Zasób obciążony w 85 procentach na papierze i mający udział produktywny 75 procent jest w rzeczywistości obciążony w 113 procentach (85 ÷ 0,75).
2. **Używaj rzeczywistego miksu produktów w planowanym okresie.** Zasób może być wąskim gardłem w tygodniu z przewagą produktu B, a nie być nim w tygodniu z przewagą produktu A.

Zaleta: wymaga tylko marszrut, popytu i kalendarza. Wada: marszruty są często błędne, a metoda pomija zmienność i przesuwanie się wąskich gardeł.

### Metoda 2: Obserwacja kolejek i WIP

Praca piętrzy się przed wąskim gardłem, a zasoby za nim czekają. Należy policzyć pracę przed każdym zasobem (w godzinach pracy, a nie w sztukach) w tym samym czasie, w kilku dniach. Zasób z dużą, trwale utrzymującą się kolejką i głodzonymi zasobami za nim jest prawdopodobnym wąskim gardłem. Uwaga: kolejka może też tworzyć się przed zasobem zasilanym dużymi partiami lub zasobem, którego polityka polega na produkowaniu z wyprzedzeniem.

### Metoda 3: Chód po wąskim gardle

Christoph Roser zaleca chód po wąskim gardle jako metodę na hali produkcyjnej, gdy brakuje danych o stanie maszyn [15]. Przechodź wzdłuż linii kilka razy na zmianę i notuj dla każdego procesu, czy pracuje, czy jest głodzony (czeka na wsad), czy zablokowany (nie może przekazać pracy dalej). Proces, który w większości pracuje, z zablokowanymi procesami przed nim i głodzonymi za nim, jest wąskim gardłem. Powtarzaj obserwację przez kilka dni, aby sprawdzić, czy wąskie gardło się przesuwa.

| Obchód o | Piła | Gniazdo CNC | Odgrzybianie | Montaż | Test |
|---|---|---|---|---|---|
| 07:30 | zablokowana | pracuje | bez materiału | bez materiału | pracuje |
| 09:00 | pracuje | pracuje | pracuje | bez materiału | bez materiału |
| 10:30 | zablokowana | pracuje | bez materiału | pracuje | bez materiału |
| 13:00 | zablokowana | awaria (narzędzie) | bez materiału | bez materiału | bez materiału |
| Wzorzec | często zablokowana | zawsze pracuje | często bez materiału | często bez materiału | często bez materiału |

### Metoda 4: Wykorzystanie (procent czasu aktywnego)

Dane maszynowe z MES, platformy IIoT lub sterowania maszyny pokazują udział czasu, w którym każdy zasób jest aktywny. Zasób o najwyższym udziale czasu aktywnego jest kandydatem na wąskie gardło. Roser, Nakano i Tanaka nazywają tę metodę metodą obciążenia i wykorzystują ją jako punkt odniesienia w swojej pracy z 2001 roku [13]. Jest łatwa do zautomatyzowania, ale nie uwzględnia kolejności, w jakiej zasoby sobie nawzajem przerywają pracę: dwa zasoby pracujące w 85 procentach czasu wyglądają tak samo, nawet jeśli jeden z nich zatrzymuje drugi.

### Metoda 5: Metoda okresów aktywnych

Metodę okresów aktywnych opublikowali Roser, Nakano i Tanaka na konferencji Winter Simulation Conference w 2001 roku, a w 2002 roku rozszerzyli ją o przesuwające się wąskie gardła [13][14]. Wymaga ona rejestru stanów ze znacznikami czasu dla każdego zasobu.

- **Stany aktywne** to stany, w których zasób może spowodować czekanie innych: przetwarzanie, ale także przezbrajanie, awarię, naprawę i konserwację [14][15].
- **Stany nieaktywne** to stany, w których zasób czeka na inne: brak materiału (oczekiwanie na materiał lub transport) oraz zablokowanie [14][15].
- **Okres aktywny** to nieprzerwany ciąg stanów aktywnych [13].
- W każdym momencie **zasób z najdłuższym nieprzerwanym okresem aktywnym jest chwilowym wąskim gardłem** [14].
- Tam, gdzie okres aktywny bieżącego wąskiego gardła nachodzi na okres poprzedniego lub następnego wąskiego gardła, wąskie gardło **przesuwa się** między nimi; poza nakładaniem się zasób jest **jedynym** wąskim gardłem [14].

**Przykład obliczeniowy (dwie godziny ilustracyjnego rejestru zmiany):**

| Zasób | Okresy aktywne | Okresy nieaktywne |
|---|---|---|
| Piła | 08:00–08:20, 08:35–08:55, 09:10–09:30, 09:45–10:00 | zablokowana między nimi |
| Gniazdo CNC | 08:00–09:05 (65 min), 09:15–10:00 (45 min) | 09:05–09:15 bez materiału |
| Montaż | 08:00–08:10, 08:30–09:10 (40 min), 09:40–10:00 | bez materiału 08:10–08:30 oraz 09:10–09:40 |

Krok po kroku:

1. 08:00–09:05: 65-minutowy okres aktywny gniazda CNC jest najdłuższym trwającym okresem, więc gniazdo CNC jest chwilowym wąskim gardłem.
2. 09:05–09:10: gniazdo CNC jest bez materiału. Najdłuższy okres aktywny w tym czasie należy do montażu (08:30–09:10). Montaż jest wąskim gardłem.
3. 09:10–09:15: aktywna jest tylko piła (09:10–09:30). Piła jest wąskim gardłem.
4. 09:15–10:00: drugi okres gniazda CNC (45 minut) jest najdłuższy. Gniazdo CNC jest wąskim gardłem.
5. Nakładanie się: okres CNC 08:00–09:05 nakłada się na okres montażu 08:30–09:10 przez 35 minut (08:30–09:05), więc wąskie gardło przesuwa się tam między CNC a montażem. Okres piły 09:10–09:30 nakłada się na okres CNC 09:15–10:00 przez 15 minut, czyli przesunięcie między piłą a CNC.

| Zasób | Jedyne wąskie gardło | Przesuwające się wąskie gardło | Suma | Udział z 120 min (jedyne / suma) |
|---|---|---|---|---|
| Gniazdo CNC | 08:00–08:30 oraz 09:30–10:00 = 60 min | 35 + 15 = 50 min | 110 min | 50% / 92% |
| Montaż | 09:05–09:10 = 5 min | 35 min | 40 min | 4% / 33% |
| Piła | 09:10–09:15 = 5 min | 15 min | 20 min | 4% / 17% |

Roser interpretuje udział jedynego wąskiego gardła jako dolną granicę, a sumę jako górną granicę wpływu usprawnienia: jeśli gniazdo CNC jest jedynym wąskim gardłem przez 50 procent czasu, a jedynym lub przesuwającym się wąskim gardłem przez 92 procent, to zysk jednej minuty w gnieździe CNC powinien zwiększyć wydajność systemu mniej więcej o 0,5 do 0,9 minuty [15]. Dwie godziny danych wystarczą tylko do pokazania mechanizmu; rzeczywista analiza wymaga tygodni rejestrów.

Porównanie z metodą 4: gniazdo CNC było aktywne 110 z 120 minut (92 procent), piła 80 (67 procent), a montaż 70 (58 procent). Wykorzystanie wskazuje tutaj ten sam zasób, ale uszeregowałoby piłę przed montażem, choć montaż częściej wchodzi w skład przesuwającego się wąskiego gardła.

**Skąd pochodzą dane:** stany maszyn z MES, bramki IIoT odczytujące sterownik lub dziennik zdarzeń symulacji dyskretnej. Roser zauważa, że metoda jest najprostsza przy symulacji lub silnie zautomatyzowanych systemach, i zaleca obchód wąskiego gardła tam, gdzie brakuje takich danych [15]. Przewodnik [MES i ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) wyjaśnia, jak zakłady zbierają stany urządzeń.

### Metoda 6: Symulacja i testy wrażliwości

Model symulacji zdarzeń dyskretnych linii pozwala bezpośrednio sprawdzić pytanie: co się stanie, jeśli każdy zasób po kolei otrzyma 10 procent więcej zdolności produkcyjnych, i która zmiana zwiększy wydajność? Zasób, którego usprawnienie najbardziej podnosi wydajność, jest ograniczeniem dla danego miksu produktowego. Symulacja pokazuje też przesuwające się wąskie gardła przy zmienności, których statyczne tabele obciążeń nie wykrywają. Przewodnik [symulacja produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) opisuje, jak taki model zbudować.

### Typowe przyczyny wąskich gardeł

Analiza wąskiego gardła powinna kończyć się wskazaniem przyczyny, a nie tylko lokalizacji. Najczęstsze przyczyny w zakładzie:

- zdolność produkcyjna niższa niż popyt przy obecnym miksie produktów (rzeczywiste ograniczenie zdolności)
- nieplanowane przestoje i wolne naprawy na krytycznym zasobie
- długie przezbrojenia w połączeniu z dużymi zasadami wielkości partii
- brak umiejętności lub obsady: tylko nieliczni potrafią obsługiwać lub przezbrajać zasób
- straty jakościowe: złom i przeróbki, które zużywają czas ograniczenia podwójnie
- głodzenie: materiał, narzędzia, programy lub praca z poprzedniego etapu docierają z opóźnieniem
- polityki, takie jak cele wykorzystania, które utrzymują zajęte zasoby niebędące ograniczeniem, podczas gdy praca piętrzy się w niewłaściwym miejscu

Przyczyna decyduje o naprawie. Pierwszych pięć wymaga najpierw eksploatacji (rozdział 4, krok 2), a podniesienia zdolności tylko wtedy, gdy to nie wystarcza; głodzenie wymaga podporządkowania (krok 3); polityki wymagają zmiany reguł, często z pomocą procesów myślowych (rozdział 12).

### Którą metodę kiedy stosować?

| Metoda | Potrzebne dane | Wykrywa przesuwające się wąskie gardła | Nakład | Najlepsze zastosowanie |
|---|---|---|---|---|
| Obciążenie zdolności | marszruty, popyt, kalendarz | nie | niski | pierwsza kontrola, planowanie, wycena |
| Obserwacja kolejek | liczenie na hali | częściowo | niski | potwierdzenie |
| Obchód wąskiego gardła | powtarzane obchody | częściowo | niski do średniego | zakłady bez danych z maszyn |
| Wykorzystanie | stany maszyn | nie | niski po uruchomieniu przepływu danych | pulpity wskaźników |
| Analiza okresów aktywności | stany ze znacznikami czasu | tak | średni | linie zautomatyzowane, dane MES, symulacja |
| Symulacja | model i dane | tak | średni do wysokiego | wysoki miks, decyzje inwestycyjne |

### Sześć pytań, które demaskują fałszywe wąskie gardło

1. Czy zasób rzeczywiście pracuje przez cały dostępny czas, czy często jest głodzony?
2. Czy kolejka przed nim jest stała, czy to tylko napływająca partia?
3. Czy zasoby po jego stronie czekają właśnie na niego, czy na coś innego?
4. Gdyby jutro otrzymał 10 procent więcej zdolności, czy wysyłki by wzrosły?
5. Czy "wąskie gardło" jest zajęte pracą, która nie jest w tej chwili potrzebna?
6. Czy prawdziwym ograniczeniem jest reguła, na przykład minimalne wielkości partii lub stały schemat zmian?

## Harmonogramowanie typu drum-buffer-rope z liczbami

Drum-buffer-rope (DBR) to metoda TOC do harmonogramowania i sterowania produkcją. Goldratt i Robert E. Fox opisali ją w książce *The Race* (1986), rozwijając metaforę drużyny zwiadowców z *The Goal* [3][8]. *Theory of Constraints Handbook* opisuje aktualną postać metody, w tym zarządzanie buforami i klasyfikację przepływu VATI [9].

- **Bęben (drum):** harmonogram ograniczenia. Jest to jedyny szczegółowy harmonogram w zakładzie, który musi być dotrzymany.
- **Bufor (buffer):** bufory czasowe, które chronią przepustowość zakładu przed zmiennością. Tradycyjne DBR stosuje bufory przy ograniczeniu, w punktach montażu, gdzie części z ograniczenia spotykają się z częściami spoza ograniczenia, oraz przy wysyłce [6].
- **Lina (rope):** mechanizm zwalniania materiału. Materiał wchodzi do zakładu na jeden bufor czasowy przed chwilą, gdy jest potrzebny przy ograniczeniu; zwolnienie wcześniej tylko zwiększa WIP [6].

Bufory w DBR mierzy się w **czasie**, a nie w sztukach [6]. Bufor 16-godzinny przy ograniczeniu oznacza, że materiał zwalnia się 16 godzin roboczych przed jego zaplanowanym startem przy ograniczeniu.

### Krok 1: Zbuduj harmonogram bębna

Wracając do zakładu produkującego kolektory, gniazdo CNC jest bębnem. Jego harmonogram na środę (zmiana 1: 06:00–14:00, zmiana 2: 14:00–22:00), z przezbrojeniami po 18 minut z rozdziału 5:

| Zlecenie | Produkt i ilość | Przezbrojenie + przebieg (min) | Start CNC | Koniec CNC |
|---|---|---|---|---|
| 1041 | A × 10 | 18 + 250 = 268 | Śr 06:00 | Śr 10:28 |
| 1042 | B × 5 | 18 + 200 = 218 | Śr 10:28 | Śr 14:06 |
| 1043 | A × 10 | 268 | Śr 14:06 | Śr 18:34 |
| 1044 | B × 4 | 18 + 160 = 178 | Śr 18:34 | Śr 21:32 |

Sekwencja wynika z decyzji o miksie produktowym z rozdziału 5 oraz z popytu tygodniowego, przy partiach dostatecznie małych, by utrzymać krótkie czasy realizacji. Pozostałe na koniec zmiany 28 minut przeznaczono na zaplanowany przegląd narzędzi.

### Krok 2: Ustaw bufory

- **Bufor przy ograniczeniu:** 16 godzin roboczych (dwie zmiany). Piła i obsługa materiału wymagają mniej niż godziny czasu pracy na zlecenie; reszta chroni przed awariami piły, brakiem materiału i problemami z programami.
- **Bufor wysyłkowy:** 16 godzin roboczych za gniazdem CNC. Odgrzybianie (odgrzaty), montaż i test wymagają około godziny czasu pracy na zlecenie.
- **Fizyczny obszar buforowy:** wyznaczona na podłodze strefa przed gniazdem CNC, wielkości na około jeden dzień pracy, z pasami FIFO według rodziny oprzyrządowania. Jeśli obszar się przepełni, zwalnianie wyprzedza linę; jeśli jest pusty, gniazdo CNC jest zagrożone.

Jak duży powinien być bufor na starcie? Gray, Felan, Umble i Umble zauważają, że istnieją reguły kciuka, ale ich zdaniem wielkości buforów zwykle ustala się tak, by osiągnąć stabilny system, a następnie koryguje [24]; zarządzanie buforami (rozdział 9) wykonuje tę korektę. Wartość początkowa często podawana w praktyce TOC to około połowa aktualnego czasu realizacji dla danego odcinka [unverified for the value as a rule of thumb, not checked against a source]. W przykładzie praca czekała przed gniazdem CNC 2,5 dnia; zespół zaczął od jednego dnia i zaplanował korektę.

### Krok 3: Zwiąż linę

Czas zwolnienia = zaplanowany start przy ograniczeniu − bufor przy ograniczeniu.

| Zlecenie | Start CNC | Bufor przy ograniczeniu | Zwolnienie do piły | Termin wysyłki (koniec CNC + bufor wysyłkowy) |
|---|---|---|---|---|
| 1041 | Śr 06:00 | 16 h | Wt 06:00 | Czw 10:28 |
| 1042 | Śr 10:28 | 16 h | Wt 10:28 | Czw 14:06 |
| 1043 | Śr 14:06 | 16 h | Wt 14:06 | Czw 18:34 |
| 1044 | Śr 18:34 | 16 h | Wt 18:34 | Czw 21:32 |

Żaden materiał nie jest zwalniany przed swoim czasem zwolnienia, nawet gdy piła stoi bezczynnie. To właśnie utrzymuje niski WIP i krótki czas realizacji.

### Krok 4: Prowadź zakład według stanu buforów

Elementy spoza ograniczenia nie dostają szczegółowego harmonogramu. Pracują w kolejności stanu buforów (rozdział 9): najpierw zlecenia, których bufor jest najbardziej zużyty. Gniazdo CNC trzyma się swojej sekwencji.

### DBR a push z MRP: co się zmienia

| Zagadnienie | MRP push | DBR |
|---|---|---|
| Zwalnianie | planowane czasy realizacji dla każdej operacji, często zawyżone | harmonogram ograniczenia minus bufor |
| Szczegółowe harmonogramy | dla każdego gniazda | tylko dla ograniczenia |
| WIP | rośnie, gdy czasy realizacji są zawyżone | ograniczony przez linę |
| Priorytety na hali | listy gorących zleceń, pośpiech | kolory stanu buforów |
| Reakcja na zmienność | więcej czasu realizacji, więcej WIP | bufory w kilku punktach, dobrane i korygowane |

Przewodnik [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) wyjaśnia, jak DBR wpisuje się w planowanie o skończonej zdolności produkcyjnej i kiedy APS daje wartość dodaną.

### DBR w zakładach montażowych (typu A)

W zakładzie typu A części z ograniczenia spotykają się z częściami spoza ograniczenia na montażu. Tradycyjne DBR dodaje **bufor montażowy**: części spoza ograniczenia są zwalniane tak, aby czekały na montażu, zanim nadejdzie część z ograniczenia, dzięki czemu wyjście z ograniczenia nigdy nie czeka na brakujący wspornik [6][9]. W lotnictwie i budowie maszyn, gdzie zespoły wymagają setek części, to często tutaj DBR przynosi największe korzyści; przewodnik [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/) opisuje to środowisko.

## Uproszczony drum-buffer-rope (S-DBR) dla produkcji na zamówienie

Uproszczony DBR (S-DBR) opracowano dla zakładów produkujących na zamówienie, gdzie ograniczeniem jest zwykle rynek, a nie zasób wewnętrzny, lub gdzie wewnętrzne ograniczenie nie jest silnie obciążone. Używa tylko jednego bufora, **bufora wysyłkowego**, i zastępuje szczegółowy harmonogram bębna sprawdzeniem **planowanego obciążenia** zasobu ograniczającego zdolność produkcyjną (CCR) [6][9].

### Jak działa S-DBR

1. **Bufor wysyłkowy:** każde zamówienie jest zwalniane na stały czas buforowy przed terminem realizacji.
2. **Planowane obciążenie:** zakład prowadzi bieżącą sumę pracy już zobowiązanej na CCR, wyrażoną w dniach.
3. **Ustalanie terminu realizacji:** nowemu zamówieniu przypisuje się termin nie wcześniejszy niż data, w której CCR może je przetworzyć, plus część bufora wysyłkowego na pracę po CCR. Typową konwencją jest data planowanego obciążenia plus połowa bufora wysyłkowego [unverified].
4. **Zarządzanie buforem** ustala priorytety na hali według udziału zużytego bufora wysyłkowego.

### Przykład: ustalanie terminu realizacji w S-DBR

Załóżmy, że zakład produkujący kolektory przeszedł na produkcję na zamówienie i przez większość tygodni to rynek jest ograniczeniem. Gniazdo CNC traktujemy jako CCR o 4 400 efektywnych minutach tygodniowo, czyli 880 minutach dziennie w dniu roboczym.

- Zamówienia już zobowiązane na gnieździe CNC: 3 520 minut. Planowane obciążenie = 3 520 ÷ 880 = **4,0 dnia roboczego**.
- Bufor wysyłkowy: **6 dni roboczych** (obecny całkowity czas realizacji wynosi 12 dni; zespół zaczyna od połowy).
- Nowe zamówienie: 10 sztuk B, po 40 minut każda = 400 minut = 0,45 dnia na gnieździe CNC.

Bezpieczny termin realizacji = dziś + planowane obciążenie + czas CNC nowego zamówienia + połowa bufora wysyłkowego = 0 + 4,0 + 0,45 + 3,0 = **7,45, czyli 8 dni roboczych**. Data zwolnienia = termin realizacji − bufor wysyłkowy = dzień 8 − 6 = **dzień 2**.

Jeśli dział sprzedaży chce obiecać 5 dni, sprawdzenie pokazuje, że zamówienie wyprzedziłoby kolejkę na gnieździe CNC i opóźniło inne zamówienia. Ta rozmowa odbywa się przy przyjmowaniu zamówienia, a nie na hali dwa tygodnie później.

### DBR czy S-DBR?

| Kryterium | Tradycyjne DBR | S-DBR |
|---|---|---|
| Ograniczenie | wewnętrzne i silnie obciążone | rynek lub wewnętrzne, ale umiarkowanie obciążone |
| Bufory | ograniczenie, montaż, wysyłka | tylko wysyłka |
| Harmonogram ograniczenia | szczegółowa sekwencja | sprawdzenie planowanego obciążenia |
| Nakład pracy | wyższy | niższy |
| Typowe zastosowanie | stabilne wąskie gardło, zakłady typu A lub I | warsztaty produkujące na zamówienie, duża różnorodność |

## Zarządzanie buforami: pętla sprzężenia zwrotnego

Zarządzanie buforami to pętla kontroli i doskonalenia DBR i S-DBR [9]. Dla każdego otwartego zlecenia zakład śledzi, jaka część jego bufora została zużyta, i oznacza je odpowiednim kolorem. Streszczenie TOC na Wikipedii opisuje kodowanie czerwony, żółty i zielony według penetracji bufora [6].

**Wzór (dla zlecenia, które jeszcze nie dotarło do chronionego punktu):**
Penetracja bufora (%) = (1 − pozostały czas do zaplanowanego dotarcia do chronionego punktu ÷ wielkość bufora) × 100

| Strefa | Penetracja bufora | Znaczenie | Reakcja |
|---|---|---|---|
| Zielona | 0 do 33% | na czas | brak |
| Żółta | 33 do 67% | robi się ciasno | sprawdzić, gdzie jest zlecenie, przygotować działanie |
| Czerwona | 67 do 100% | chroniony punkt może czekać | przyspieszyć: przesunąć zlecenie na przód, usunąć przyczynę |
| Czarna (niektóre zakłady) | powyżej 100% | już spóźnione | eskalować, poinformować klienta, jeśli to bufor wysyłkowy |

Podział na trzy części jest konwencją, a nie prawem przyrody.

### Przykład: stan bufora w środę o 06:00

Bufor ograniczenia: 16 godzin roboczych. Na początku zmiany żadne z czterech zleceń nie dotarło jeszcze do gniazda CNC.

| Zlecenie | Zaplanowany start na CNC | Pozostałe godziny robocze | Penetracja | Strefa | Działanie |
|---|---|---|---|---|---|
| 1041 | Śr 06:00 | 0 | 100% | czerwona/czarna | CNC będzie czekać; znaleźć zlecenie teraz |
| 1042 | Śr 10:28 | 4,5 | 1 − 4,5 ÷ 16 = 72% | czerwona | przyspieszyć przy pile |
| 1043 | Śr 14:06 | 8,1 | 1 − 8,1 ÷ 16 = 49% | żółta | sprawdzić status |
| 1044 | Śr 18:34 | 12,6 | 1 − 12,6 ÷ 16 = 21% | zielona | brak |

W dobrym dniu zlecenia, które mają termin w ciągu najbliższych godzin, już znajdują się w buforze przed gniazdem CNC. Brak zlecenia 1041 o 06:00 oznacza, że gniazdo CNC wkrótce straci czas.

### Wykorzystanie danych z buforów do doskonalenia

Zapisywać przyczynę za każdym razem, gdy zlecenie staje się czerwone: brak materiału, awaria piły, niezwolniony program, wstrzymanie jakościowe. Po kilku tygodniach wykres Pareto przyczyn jest listą usprawnień dla obszarów nieograniczających. Dwie reguły kciuka przy doborze wielkości:

- Jeśli wiele zleceń jest czerwonych, bufor jest za mały lub proces wcześniejszy zbyt niestabilny. Najpierw usunąć główne przyczyny, dopiero potem rozważyć większy bufor.
- Jeśli prawie wszystkie zlecenia pozostają zielone, bufor jest za duży. Zmniejszać go stopniowo; WIP i czas realizacji spadną wraz z nim.

W przypadku buforów magazynowych w dystrybucji reguła dynamicznego zarządzania buforami, streszczona na Wikipedii, brzmi: zmniejszyć bufor o jedną trzecią, jeśli zapas przez cały czas uzupełnienia utrzymuje się w górnej trzeciej części, i zwiększyć o jedną trzecią, jeśli zbyt długo pozostaje w dolnej trzeciej części [6].

## Fizyka fabryki stojąca za TOC: prawo Little'a i zmienność

TOC bywa przedstawiane jako filozofia. Jednak jego reguły planowania produkcji wynikają również z teorii kolejek.

### Prawo Little'a

John D. C. Little udowodnił w 1961 roku, że w stabilnym systemie średnia liczba elementów w systemie jest równa intensywności napływu pomnożonej przez średni czas przebywania w systemie [16]. W języku fabryki (Hopp i Spearman) [17]:

**WIP = przepustowość × czas cyklu**, lub **czas cyklu = WIP ÷ przepustowość**

**Przykład obliczeniowy (zakład produkcji kolektorów, przed i po DBR):**

| | Przed (wypychanie) | Po (DBR) |
|---|---|---|
| WIP między piłą a wysyłką | 640 sztuk | 90 sztuk |
| Przepustowość | 127 sztuk tygodniowo | 147 sztuk tygodniowo |
| Czas cyklu = WIP ÷ przepustowość | 640 ÷ 127 = 5,0 tygodnia | 90 ÷ 147 = 0,61 tygodnia, około 3 dni robocze |

WIP spadł, ponieważ lina przestała wypuszczać materiał zbyt wcześnie; przepustowość wzrosła, bo ograniczenie zostało wykorzystane. Czas realizacji skrócił się o ponad 80 procent. Prawo Little'a wskazuje też granicę: jeśli WIP przed ograniczeniem spadnie tak bardzo, że zabraknie materiału, przepustowość również spadnie. Dlatego DBR utrzymuje bufor wyłącznie przy ograniczeniu, a nigdzie indziej.

### Zmienność i wykorzystanie

Przybliżenie Kingmana dla pojedynczego stanowiska pokazuje, dlaczego zasoby nieograniczające potrzebują rezerwy mocy [17][18]:

**Czas oczekiwania ≈ ((ca² + ce²) ÷ 2) × (u ÷ (1 − u)) × te**

gdzie ca i ce to współczynniki zmienności napływu i czasów obróbki, u to wykorzystanie, a te to średni czas obróbki. Jest to przybliżenie dla pojedynczego stanowiska z dowolnymi rozkładami napływu i czasu obróbki (G/G/1) i jest najdokładniejsze przy wysokim wykorzystaniu [17][18].

| Wykorzystanie u | u ÷ (1 − u) | Czas oczekiwania przy ca = ce = 1, te = 40 min |
|---|---|---|
| 70% | 2,3 | 93 min |
| 85% | 5,7 | 227 min |
| 95% | 19,0 | 760 min |

Przy wzroście wykorzystania z 85 do 95 procent czas oczekiwania ponad potrojony. Zakład, który dąży do 95 procent wykorzystania każdego zasobu, tworzy długie kolejki wszędzie. Odpowiedzią TOC jest prowadzenie ograniczenia przy bardzo wysokim wykorzystaniu, chronionym celowo utworzonym buforem, oraz utrzymywanie zasobów nieograniczających znacznie poniżej tego poziomu.

## Rachunkowość przepustowości a rachunkowość kosztów

Rachunkowość przepustowości jest systemem pomiarowym TOC. Goldratt przedstawił jej trzy miary w *The Goal* i *The Haystack Syndrome* [20]; *Throughput Accounting* Thomasa Corbetta (North River Press) jest standardowym opracowaniem w formie książkowej [21].

### Trzy miary

| Miara | Definicja (Goldratt, w ujęciu MAAW) [20] | Praktyczna definicja w zakładzie |
|---|---|---|
| Przepustowość (T) | tempo, w którym system generuje pieniądze poprzez sprzedaż | sprzedaż minus koszty w pełni zmienne, zwykle surowce, części zakupione, prowizje i obróbka zewnętrzna na jednostkę [6][22] |
| Zapasy (I), później często określane jako „inwestycja” | pieniądze, które system zainwestował w zakup rzeczy, które zamierza sprzedać | surowce, WIP i wyroby gotowe wyceniane według kosztu materiału, a w szerszej definicji także maszyny i budynki [22] |
| Koszty operacyjne (OE) | wszystkie pieniądze, które system wydaje na przekształcanie zapasów w przepustowość | wynagrodzenia i pensje (w tym robocizna bezpośrednia), czynsz, energia, utrzymanie ruchu, amortyzacja |

Robocizna bezpośrednia należy do OE, a nie do T. To kluczowa różnica względem klasycznej rachunkowości kosztów: w większości zakładów w krótkim okresie płace nie rosną ani nie maleją wraz z każdą dodatkową jednostką.

### Miary pochodne

| Miara | Wzór | Zakład kolektorów po wykorzystaniu ograniczenia (tygodniowo) |
|---|---|---|
| Zysk netto (NP) | T − OE | $85 250 − $63 500 = $21 750 |
| Zwrot z inwestycji (ROI) | (T − OE) ÷ I | przy I = $1 200 000: $21 750 × 52 ÷ $1 200 000 = 94% rocznie |
| Produktywność | T ÷ OE | $85 250 ÷ $63 500 = 1,34 |
| Obrót inwestycją | T ÷ I | $85 250 × 52 ÷ $1 200 000 = 3,7 rocznie |

Zestawienie Lean Production wymienia te same miary pochodne oraz priorytet decyzyjny TOC: najpierw zwiększać przepustowość, następnie redukować inwestycję, a dopiero potem koszty operacyjne [22]. Wartość inwestycji $1 200 000 jest założeniem przyjętym na potrzeby przykładu.

### Reguła decyzyjna: przepustowość na jednostkę ograniczenia

Gdy istnieje ograniczenie, produkty należy szeregować według przepustowości przypadającej na jednostkę czasu ograniczenia, a nie według marży na jednostkę. W podręcznikach rachunkowości jest to znane jako „marża pokrycia na jednostkę czynnika ograniczającego”; zespół egzaminacyjny ACCA opisuje wersję opartą na przepustowości, posługując się zwrotem z godziny pracy fabryki oraz wskaźnikiem rachunkowości przepustowości (TPAR) [19]:

- **Przychód na godzinę pracy wydziału** = przychód na jednostkę ÷ godziny na jednostkę na wąskim gardle
- **Koszt na godzinę pracy wydziału** = całkowity koszt wydziału ÷ całkowite godziny dostępne na wąskim gardle
- **TPAR** = przychód na godzinę pracy wydziału ÷ koszt na godzinę pracy wydziału; zwykle powinien być większy niż 1 [19].

### Przykład obliczeniowy: rachunek kosztów standardowych a rachunek przepustowości

Rachunek kosztów standardowych w zakładzie manifoldów przypisuje koszty operacyjne do produktów według standardowych minut pracy. Budżetowane standardowe minuty przy zapotrzebowaniu: A 70 minut na jednostkę (8 + 25 + 12 + 15 + 10) × 100 jednostek = 7 000; B 97 minut (10 + 40 + 12 + 20 + 15) × 60 jednostek = 5 820; razem 12 820 minut. Stawka narzutu = 62 000 $ ÷ 12 820 = **4,84 $ za standardową minutę**.

| | Produkt A | Produkt B |
|---|---|---|
| Cena | 900,00 $ | 1 200,00 $ |
| Materiał | 400,00 $ | 450,00 $ |
| Robocizna i narzuty (70 × 4,84 $; 97 × 4,84 $) | 338,80 $ | 469,48 $ |
| **Standardowa marża na jednostkę** | **161,20 $** | **280,52 $** |
| Standardowa marża % | 17,9% | 23,4% |
| Przychód na jednostkę | 500 $ | 750 $ |
| Godziny CNC na jednostkę | 0,417 | 0,667 |
| **Przychód na godzinę CNC** | **1 200 $** | **1 125 $** |

Koszt na godzinę pracy wydziału, przy kosztach operacyjnych po eksploatacji: 63 500 $ ÷ (4 400 ÷ 60 = 73,3 godziny CNC) = **865,91 $**. TPAR A = 1 200 ÷ 865,91 = **1,39**; TPAR B = 1 125 ÷ 865,91 = **1,30**. Oba produkty przynoszą zysk, ale A przynosi więcej na godzinę pracy ograniczenia.

Rachunek kosztów standardowych mówi: „stawiaj na B”, ponieważ ma wyższą marżę na jednostkę i procentowo. Rachunek przepustowości mówi: „najpierw zapełnij ograniczenie produktem A”. Sekcja 5 pokazała wynik: przy ustawieniu według przepustowości zysk netto jest wyższy o 1 250 $ tygodniowo. Rachunek kosztów standardowych nie jest błędny jako arytmetyka. Odpowiada jednak na inne pytanie (średni pełny koszt jednostki w okresie), a to nie jest pytanie, na które potrzebna jest decyzja o miksie produktów przy ograniczeniu.

### Przykład obliczeniowy: zamówienie wykorzystujące tylko wolne moce

Klient zamawia 40 płyt przyłączeniowych tygodniowo po 260 $ za sztukę. Materiał kosztuje 150 $. Płyty wymagają piły (15 minut), odgrzybiania (10 minut) i montażu (25 minut), ale **nie wymagają czasu CNC**. Razem: 50 standardowych minut.

| | Widok kosztów standardowych | Widok przepustowości |
|---|---|---|
| Materiał | 150,00 $ | 150,00 $ |
| Robocizna i narzuty (50 × 4,84 $) | 242,00 $ | nie na jednostkę: koszty operacyjne się nie zmieniają, zasoby mają wolne moce |
| Marża na jednostkę | 260 $ − 392 $ = **−132 $** | T = 260 $ − 150 $ = **+110 $** |
| Decyzja | odrzucić | przyjąć |
| Wpływ na tygodniowy zysk netto (40 płyt) | | +4 400 $, o ile piła, odgrzybianie i montaż pozostaną poniżej swoich mocy |

Sprawdzenie obciążeń: piła +600 minut (do 2 000, 42 procent), odgrzybianie +400 (do 2 320, 48 procent), montaż +1 000 (do 3 700, 77 procent). Montaż zbliża się do stania się ograniczeniem, więc zamówienie należy przyjąć z limitem wolumenu i monitorować. Przy rachunku kosztów standardowych zakład odrzuciłby 4 400 $ tygodniowo.

### Zapasy a raportowany zysk

Przy rachunku kosztów pełnych narzuty są przenoszone na zapasy. Jeśli zakład manifoldów wyprodukuje 50 dodatkowych jednostek A na magazyn, 50 × 338,80 $ = **16 940 $** narzutów z okresu przechodzi do bilansu zamiast do rachunku wyników, a raportowany zysk rośnie o tę kwotę. Gotówka spada o zakupiony materiał, 50 × 400 $ = 20 000 $. Przy rachunku przepustowości zysk netto się nie zmienia, a zapasy rosną o 20 000 $. Dlatego praktycy TOC ostrzegają, że budowanie zapasów może sprawić, że zakład wygląda lepiej na papierze, podczas gdy pogarsza się jego sytuacja gotówkowa i czas realizacji.

Zewnętrzna sprawozdawczość finansowa w USA wymaga, aby koszty wytwarzania były uwzględniane w wycenie zapasów (rachunek kosztów pełnych): zgodnie z ASC 330 koszt zapasów to suma nakładów i obciążeń bezpośrednio lub pośrednio poniesionych, aby doprowadzić pozycję do jej obecnego stanu i miejsca, a stałe koszty produkcyjne są przypisywane do zapasów na podstawie normalnej zdolności wytwórczej obiektów [28][29]. To, jak zakład to stosuje, decyduje kontroler. Rachunek przepustowości jest zatem narzędziem decyzyjnym wewnętrznym. Większość zakładów, które go stosują, prowadzi sprawozdania zgodne z GAAP do celów zewnętrznych i uzgadnia oba podejścia.

### Na co powinien zwracać uwagę kontroler zakładu

| Ryzyko | Dlaczego ma znaczenie | Środek zaradczy |
|---|---|---|
| Definicja „naprawdę zmiennych" zbyt wąska lub zbyt szeroka | T jest zawyżone lub zaniżone | uzgodnić na piśmie listę: materiał, części kupowane, obróbka zewnętrzna, fracht wychodzący, jeśli liczony za sztukę, prowizje handlowe |
| OE traktowane jako stałe w długim okresie | duże zmiany wolumenu rzeczywiście zmieniają OE | ponownie sprawdzać założenia OE przy decyzjach wykraczających poza kwartał |
| Ignorowanie położenia ograniczenia | przepustowość na minutę ograniczenia jest bezsensowna, jeśli ograniczenie się przesuwa | przeliczać, gdy zmienia się tabela obciążeń |
| Trwałe ustalanie cen poniżej pełnego kosztu | znika zapas mocy produkcyjnych i OE musi rosnąć | limity wolumenu, przegląd co kwartał |
| Dwa zestawy liczb | zamieszanie na spotkaniach zarządu | jeden arkusz uzgodnień; TA do decyzji, GAAP do sprawozdań |
| Robocizna, która rzeczywiście zmienia się wraz z ilością | płace akordowe lub praca agencyjna księgowane za sztukę są naprawdę zmienne | włączyć do naprawdę zmiennych kosztów; zwykłe wynagrodzenia pozostają w OE |

Przewodnik [KPI produkcyjne](https://www.m365.fm/en/learn/manufacturing-kpis/) omawia rotację zapasów i inne miary finansowo-operacyjne.

## Procesy myślowe

Procesy myślowe (TP) to narzędzia TOC do problemów, które nie są problemami zdolności produkcyjnej: ograniczeń polityk, konfliktów i zarządzania zmianą. Powieść Goldratta *It's Not Luck* (1994) przybliżyła je szerokiemu gronu odbiorców; Kim, Mabin i Davies przeanalizowali literaturę badawczą na ich temat od 1994 roku, czyli od tej książki, do początku 2006 roku, i stwierdzili, że TOC rozwijało się głównie w praktyce, z wieloma obszarami zastosowań i podejściami wielometodowymi [12].

TP odpowiadają na trzy pytania: co zmienić, na co to zmienić i jak wywołać zmianę.

| Narzędzie | Pytanie | Logika | Wynik |
|---|---|---|---|
| Drzewo bieżącej rzeczywistości (CRT) | co zmienić? | związek przyczynowo-skutkowy („jeśli ... to ...") od kilku przyczyn źródłowych do wielu niepożądanych efektów (UDE) | główny problem |
| Chmura parowania (EC), diagram rozwiązywania konfliktu | na co to zmienić? | konieczność („aby ... musimy ...") | założenie, którego złamanie rozwiązuje konflikt |
| Drzewo przyszłej rzeczywistości (FRT) | na co to zmienić? | wystarczalność, z wstrzyknięciami | rozwiązanie i jego efekty uboczne (gałęzie negatywne) |
| Drzewo warunków wstępnych (PRT) | jak wywołać zmianę? | przeszkody i cele pośrednie | sekwencja kamieni milowych |
| Drzewo przejścia (TrT) | jak wywołać zmianę? | działanie, uzasadnienie, efekt | plan krok po kroku |

### Przykład: chmura parowania dla wielkości partii

W zakładzie produkcji kolektorów nadzorca CNC i kierownik sprzedaży spierali się o wielkość partii dla wyrobu B.

| Pole | Treść |
|---|---|
| A (wspólny cel) | prowadzić zakład rentownie |
| B (potrzeba 1) | dobrze wykorzystać zdolność gniazda CNC |
| C (potrzeba 2) | szybko realizować zamówienia na B |
| D (chęć 1, służy B) | produkować duże partie B (40 sztuk), by oszczędzić przezbrojenia |
| D' (chęć 2, służy C) | produkować małe partie B (10 sztuk) |
| Konflikt | D i D' nie mogą być zrealizowane jednocześnie |

Założenie między B a D: „przezbrojenie w gnieździe CNC trwa 30 minut, więc każde dodatkowe przezbrojenie kosztuje 30 minut czasu ograniczenia." Wstrzyknięcie: skrócić przezbrojenie do 18 minut dzięki przygotowaniu zewnętrznemu i grupować warianty B według rodzin oprzyrządowania, aby małe partie kosztowały niewiele czasu ograniczenia. Chmura „paruje", ponieważ założenie leżące u podstaw konfliktu przestaje być prawdziwe.

### Przykład: małe drzewo bieżącej rzeczywistości

Niepożądane efekty (UDE) wskazane przez zespół kierowniczy: opóźnione zamówienia, wysoki poziom WIP, częste pośpieszanie zleceń, nadgodziny w montażu, nadzorcy kłócący się o priorytety. Czytając drzewo od dołu:

1. Jeśli nadzorcy są oceniani według wykorzystania, to zlecają pracę wcześnie, by utrzymać maszyny w ruchu.
2. Jeśli pracę zleca się wcześnie, to WIP rośnie i rosną kolejki przed gniazdem CNC.
3. Jeśli kolejki są długie, to gniazdo CNC obrabia to, co jest na wierzchu, a nie to, co jest pilne.
4. Jeśli gniazdo CNC obrabia niewłaściwe zlecenia, to pilne zamówienia są opóźnione, a po nich następują pośpieszanie i nadgodziny montażu.

Główny problem: miara wykorzystania (ograniczenie polityki). Rozwiązaniem nie jest więcej zdolności, lecz inna miara i reguła zlecania, czyli DBR.

### Dobre stosowanie TP

- Na początku utrzymuj małe drzewa. Dla jednego obszaru wystarczy pięć do dziesięciu UDE.
- Sprawdź każdą strzałkę: czy przyczyna rzeczywiście prowadzi do skutku? Czy są inne przyczyny?
- Pracuj w grupie, która obejmuje operatorów; znają oni efekty, których menedżerowie nie widzą.
- Chmura parowania jest najłatwiejszym narzędziem na start i najbardziej przydatnym w codziennych konfliktach.

## TOC vs. lean vs. Six Sigma

TOC, lean i Six Sigma są często przedstawiane jako konkurenci. W praktyce odpowiadają na różne pytania.

| Temat | Teoria ograniczeń | Lean | Six Sigma |
|---|---|---|---|
| Pochodzenie | Goldratt, lata 80., Izrael i USA [1][3] | Toyota Production System, Japonia | Motorola, lata 80., USA [27] |
| Główne pytanie | gdzie jest dźwignia? | gdzie jest marnotrawstwo? | gdzie jest zmienność? |
| Fokus | ograniczenie i globalna przepustowość | przepływ i wartość dla klienta w całym strumieniu wartości | wady i zdolność procesu |
| Główne narzędzia | pięć kroków koncentracji, DBR, zarządzanie buforami, rachunek przepustowości, procesy myślowe | mapowanie strumienia wartości, 5S, SMED, kanban, standardowa praca, kaizen | DMAIC, statystyka, karty kontrolne, planowanie eksperymentów |
| Podejście do zdolności | chronić nadmiarową zdolność w nie-ograniczeniach | wyrównać do taktu, redukować nadmiar zdolności jako marnotrawstwo | nie jest kluczowe |
| Podejście do zapasów | bufory w kilku wybranych punktach, w czasie | minimalizować wszędzie | nie jest kluczowe |
| Ujęcie finansowe | przepustowość, zapasy, koszty operacyjne | czas realizacji, koszt, jakość | koszt złej jakości |
| Typowa słabość | wąski fokus może ignorować marnotrawstwo poza ograniczeniem | stosowanie narzędzi wszędzie naraz | projekty wybierane bez spojrzenia systemowego |

### Jak działają razem

1. **TOC wyznacza fokus.** Pięć kroków koncentracji wybiera miejsce, w którym poprawa zmienia wynik zakładu.
2. **Lean wykorzystuje ograniczenie.** SMED skraca przezbrojenia na ograniczeniu, TPM podnosi jego dostępność, standardowa praca i 5S go stabilizują. Zob. przewodniki: [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/), [SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) i [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/).
3. **Six Sigma usuwa zmienność na ograniczeniu i przed nim.** Braki na ograniczeniu oraz późne, niestabilne dostawy do jego bufora to dobre projekty DMAIC. Zob. [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).
4. **TOC mierzy wynik.** Rachunek przepustowości pokazuje, co każdy projekt zrobił z T, I i OE.

### Gdzie lean i TOC naprawdę się różnią

- **Równoważenie linii.** Lean równoważy zawartość pracy do taktu. TOC celowo utrzymuje nie-ograniczenia niezrównoważone, z wolną zdolnością, aby chronić ograniczenie. Na linii montażowej prowadzonej taktem cała linia działa jako ograniczenie; różnica ma większe znaczenie w produkcji jednostkowej i warsztatowej.
- **Bufory.** Lean traktuje zapasy jako marnotrawstwo, a bufory jako tymczasowy środek zaradczy. TOC traktuje wymiarowany bufor czasowy na ograniczeniu jako stałą ochronę. Oba podejścia znacznie redukują łączne WIP w porównaniu z systemem wypychanym.
- **Mechanizmy ciągnięcia.** Kanban ogranicza WIP między każdą parą procesów; DBR ogranicza go między zwolnieniem a ograniczeniem, podobnie do CONWIP, który Spearman, Woodruff i Hopp zaproponowali jako alternatywę dla kanbanu [23]. Zob. przewodnik [kanban and pull system](https://www.m365.fm/en/learn/kanban-pull-system/).

### OEE na ograniczeniu

OEE (dostępność × wydajność × jakość) jest najbardziej użyteczne na ograniczeniu, gdzie każda stracona minuta kosztuje przepustowość. Na nie-ograniczeniu niskie OEE może po prostu oznaczać, że maszyna czeka, jak powinna. Jeśli zakład raportuje jedną liczbę OEE dla wszystkich maszyn, wydziel ograniczenie.

## Poza halą: łańcuch krytyczny i uzupełnianie zapasów

### Zarządzanie projektami metodą łańcucha krytycznego

W książce *Critical Chain* (1997) Goldratt zastosował TOC do projektów [3]. Najważniejsze idee w skrócie:

- **Łańcuch krytyczny** to najdłuższy łańcuch zależnych zadań, uwzględniający zarówno zależności między zadaniami, jak i zależności od zasobów. Ścieżka krytyczna ignoruje konflikty zasobów.
- **Agresywne szacunki zadań.** Czas rezerwowy jest usuwany z poszczególnych zadań.
- **Zagregowane bufory.** Usunięty zapas czasu jest gromadzony w **buforze projektu** na końcu oraz w **buforach zasilających** w miejscach, gdzie niekrytyczne łańcuchy łączą się z łańcuchem krytycznym.
- **Zarządzanie buforami.** Postęp śledzony jest za pomocą wykresu gorączki: zużycie bufora w zestawieniu z ukończoną częścią łańcucha.
- **Brak szkodliwego wielozadaniowości.** Zasoby kończą jedno zadanie, zanim rozpoczną następne.

Porównanie PMI dotyczące buforowania w DBR i w łańcuchu krytycznym opisuje wspólną logikę: oba podejścia chronią ograniczenie systemu zagregowanymi buforami czasu, a nie lokalnym zapasem bezpieczeństwa na każdym etapie [24]. W projektach narzędziowych, rozbudowie zakładów i wprowadzaniu nowych produktów łańcuch krytyczny bywa zwykle drugim zastosowaniem TOC po DBR.

### Uzupełnianie zapasów i dystrybucja

Dla wyrobów magazynowych (make-to-stock) i części zamiennych TOC zastępuje prognozy dla każdej lokalizacji buforami, które uzupełniane są w miarę faktycznego zużycia. Bufor dobiera się do maksymalnego oczekiwanego zużycia w średnim czasie uzupełnienia, z dodatkowym marginesem na zawodność dostaw; następnie koryguje się go o jedną trzecią w górę lub w dół, zależnie od tego, jak długo zapas przebywa w strefie czerwonej lub zielonej [6]. Przewodnik [zarządzanie zapasami produkcyjnymi](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) porównuje to z klasycznymi formułami zapasu bezpieczeństwa, a przewodnik [S&OP i MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) pokazuje, gdzie to podejście mieści się w planowaniu.

## Szablony do pracy z TOC

Skopiuj te tabele do arkusza kalkulacyjnego lub na tablicę na hali produkcyjnej. Są celowo proste.

### Szablon 1: Arkusz identyfikacji ograniczenia

| Zasób | Obciążenie sterowane popytem (min/tydz.) | Dostępne (min/tydz.) | Udział produktywny | Obciążenie efektywne % | Śr. kolejka przed zasobem (godziny pracy) | Przejście wąskiego gardła: % pracy | Okres aktywny: % wyłączny / suma | Wniosek |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Szablon 2: Dziennik strat ograniczenia (na zmianę)

| Data | Zmiana | Planowane minuty | Minuty produktywne | Przerwa niepokryta | Przezbrojenie | Brak materiału | Blokada | Awaria | Złom/przeróbka | Uwagi |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

### Szablon 3: Mix produktów według przepustowości na minutę ograniczenia

| Produkt | Cena | Rzeczywiście zmienny koszt | T na sztukę | Minuty ograniczenia na sztukę | T na minutę ograniczenia | Popyt | Ranga | Planowana ilość |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Szablon 4: Tablica statusu buforów

| Zlecenie | Punkt chroniony (ograniczenie / montaż / wysyłka) | Termin w punkcie chronionym | Wielkość bufora (h) | Pozostało (h) | Penetracja % | Strefa | Obecna lokalizacja | Odpowiedzialny |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Szablon 5: Dziennik przyczyn zleceń w strefie czerwonej

| Data | Zlecenie | Osiągnięta strefa | Kategoria przyczyny (materiał, maszyna, jakość, program, ludzie, inne) | Szczegóły przyczyny | Minuty straty na ograniczeniu | Działanie zaradcze | Odpowiedzialny |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Szablon 6: Arkusz decyzji o podniesieniu wydajności ograniczenia

| Opcja | Dodatkowe minuty ograniczenia/tydz. | Δ T na tydz. | Δ OE na tydz. | Δ I (jednorazowo) | Δ NP na tydz. (ΔT − ΔOE) | Zwrot w tygodniach (ΔI ÷ ΔNP) | Dokąd przechodzi ograniczenie? |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Szablon 7: Chmura ewaporacyjna

| A: wspólny cel | B: potrzeba 1 | C: potrzeba 2 | D: chcę służący B | D': chcę służący C | Założenia B–D | Założenia C–D' | Założenia D vs. D' | Wstrzyknięcie |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Szablon 8: Dzienne spotkanie przy ograniczeniu (10 minut, na stanowisku ograniczenia)

| Minuta | Temat | Dane wejściowe |
|---|---|---|
| 0–2 | wczoraj: minuty produktywne względem planu, największa strata | Szablon 2 |
| 2–5 | bufor: zlecenia czerwone i żółte, kto działa | Szablon 4 |
| 5–8 | przyczyny czerwonych, otwarte działania zaradcze | Szablon 5 |
| 8–10 | dziś: sekwencja, obsada, okno utrzymania ruchu | harmonogram bębna |

Przewodnik [zarządzanie na hali produkcyjnej](https://www.m365.fm/en/learn/shop-floor-management/) pokazuje, jak osadzić takie spotkanie w wielopoziomowym systemie narad.

## Plan wdrożenia: pierwsze sześć miesięcy

Poniższy plan dotyczy jednego zakładu lub jednego strumienia wartości. Zakłada on ograniczenie fizyczne wewnątrz zakładu; jeśli analiza w miesiącu 1 pokaże, że ograniczeniem jest rynek, przejdź do S-DBR i obszaru sprzedaży.

| Faza | Tygodnie | Cele | Kluczowe działania | Kryteria wyjścia |
|---|---|---|---|---|
| 0. Przygotowanie | 1–2 | wspólne zrozumienie | kierownictwo czyta *The Goal* lub przeprowadza grę symulacyjną TOC; uzgodnienie celu i miar (T, I, OE); wczesne włączenie związku zawodowego lub przedstawicieli pracowników | wyznaczony sponsor, ustalony zespół główny, uzgodnione miary |
| 1. Identyfikacja | 3–6 | znalezienie ograniczenia na podstawie danych | tabela obciążeń (Metoda 1), liczenie kolejek, przejścia po wąskich gardłach, dane z maszyn lub analiza okresów aktywności, jeśli są dostępne | ograniczenie potwierdzone danymi i przez produkcję |
| 2. Eksploatacja | 5–12 | odzyskanie utraconego czasu ograniczenia | dziennik strat ograniczenia, przerwy kryjące, przezbrojenia zewnętrzne, jakość przed i za ograniczeniem, priorytet konserwacji, miks produktów wg T na minutę ograniczenia | liczba minut produktywnych rośnie, wykres Pareto strat jest w użyciu |
| 3. Podporządkowanie | 9–16 | ochrona ograniczenia, redukcja WIP | pilotaż DBR lub S-DBR: harmonogram bębna, bufory, zwalnianie zleceń metodą liny; zaprzestanie celów wykorzystania w obiektach nieograniczających | reguła zwalniania w codziennym użyciu, WIP maleje |
| 4. Zarządzanie buforami | 12–20 | codzienna kontrola i uczenie się | tablica statusu buforów, dziennik przyczyn zleceń czerwonych, codzienne 10-minutowe spotkanie przy ograniczeniu, pierwsza korekta wielkości buforów | mniej zleceń czerwonych, przyczyny są usuwane |
| 5. Pomiar i decyzje | 16–24 | finanse przy stole | widok rachunkowości przepustowości przy decyzjach o miksie i zleceniach, uzgodnienie z kosztami standardowymi | TA użyta przynajmniej w jednej rzeczywistej decyzji |
| 6. Podniesienie i przegląd | 20–26 | dodawanie mocy tylko tam, gdzie jest uzasadnione; sprawdzenie bezwładności | arkusz decyzji o podniesieniu (Szablon 6), przegląd tras, reguł partii i reguł wyceny | ponownie sprawdzone położenie ograniczenia, zaplanowany następny cykl |

### Role

| Rola | Odpowiedzialność |
|---|---|
| Sponsor (kierownik zakładu) | cel, miary, usuwanie ograniczeń polityki, takich jak cele wykorzystania |
| Właściciel ograniczenia (przełożony ograniczenia) | dzienne minuty produktywne, dziennik strat, spotkanie przy ograniczeniu |
| Planista lub harmonogramista | harmonogram bębna, zwalnianie, wielkość buforów, wycena terminów |
| Kontroler zakładu | definicje T, I, OE; decyzje o miksie produktów i zleceniach; uzgodnienia |
| Lider utrzymania ruchu | czas reakcji na ograniczenie, planowane okna serwisowe |
| Lider jakości | kontrola przed i za ograniczeniem, przyczyny zleceń czerwonych w jakości |
| Operatorzy przy ograniczeniu i wokół niego | przyczyny strat, poprawa przezbrojeń, pomysły; są właścicielami działań zaradczych |

### Kryteria obszaru pilotażowego

Wybierz strumień wartości, w którym (1) jedno ograniczenie jest wyraźnie widoczne, (2) terminowość dostaw lub czas realizacji szkodzi klientom, (3) przełożony jest chętny, oraz (4) dane istnieją lub mogą być zebrane ręcznie przez kilka tygodni. Przewodnik [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) pokazuje, jak zmapować przepływ i zobaczyć, gdzie w strumieniu wartości znajduje się ograniczenie.

## TOC KPI: jak mierzyć postęp

| KPI | Wzór | Poziom | Częstotliwość | Komentarz |
|---|---|---|---|---|
| Przepustowość (T) | sprzedaż − rzeczywiście zmienne koszty | zakład | tygodniowo, miesięcznie | główna miara celu |
| Koszty operacyjne (OE) | wszystkie pozostałe wydatki | zakład | miesięcznie | powinny rosnąć wolniej niż T |
| Zapasy/inwestycje (I) | wartość materiałowa zapasów i WIP (plus aktywa w szerszym ujęciu) | zakład | miesięcznie | część WIP powinna spadać wraz z DBR |
| Zysk netto | T − OE | zakład | miesięcznie | |
| ROI | (T − OE) ÷ I | zakład | kwartalnie | |
| Produktywne minuty wąskiego gardła | minuty dobrych części na wąskim gardle ÷ dostępne minuty | wąskie gardło | na zmianę | codzienny puls |
| Zgodność harmonogramu wąskiego gardła | zlecenia rozpoczęte w planowanym oknie ÷ zlecenia zaplanowane | wąskie gardło | codziennie | pokazuje, czy bęben się trzyma |
| Udział czerwonych zleceń | czerwone zlecenia ÷ otwarte zlecenia | bufor | codziennie | zbyt wysoki: bufor za mały lub proces niestabilny |
| Terminowość dostaw | zlecenia wysłane w terminie lub wcześniej ÷ zlecenia wysłane | klient | tygodniowo | najbardziej widoczny wynik |
| Czas realizacji | od zwolnienia do wysyłki, mediana i 90. percentyl | strumień wartości | tygodniowo | sprawdzić prawem Little'a |
| WIP w dniach | WIP ÷ średnia dzienna przepustowość | strumień wartości | tygodniowo | |
| Dolar-dni przepustowości (TDD) | Σ (wartość T spóźnionego zlecenia × dni spóźnienia) | odpowiedzialność | tygodniowo | miara TOC „rzeczy, które należało zrobić"; pochodzenie w pracach pomiarowych Goldratta [unverified: źródło pochodzenia nieprzypisane]|
| Dolar-dni zapasów (IDD) | Σ (wartość zapasu × dni przechowywania) | odpowiedzialność | tygodniowo | mierzy „rzeczy, których nie należało robić" [unverified: źródło pochodzenia nieprzypisane] |

Dwie zasady dla tablicy KPI: pokazuj KPI wąskiego gardła przy wąskim gardle i nie traktuj wykorzystania nie-wąskich gardeł jako celu wydajnościowego. Przewodnik po [KPI produkcyjnych](https://www.m365.fm/en/learn/manufacturing-kpis/) definiuje standardowe wskaźniki produkcyjne, które działają obok tych.

## Częste błędy

| Błąd | Dlaczego szkodzi | Lepiej |
|---|---|---|
| Wybór wąskiego gardła na podstawie przeczucia | widoczny problem jest często objawem (montaż był głodny) | tabela obciążeń plus kontrola na hali, w miarę możliwości dane z okresu aktywnego |
| Przeskakiwanie do kroku 4 | pieniądze wydane, podczas gdy wąskie gardło nadal traci 20 do 25% swojego czasu | najpierw eksploatacja i podporządkowanie |
| Utrzymywanie celów wykorzystania na nie-wąskich gardłach | wczesne zwalnianie, więcej WIP, wąskie gardło wykonuje złą pracę | mierzyć nie-wąskie gardła wskaźnikiem „wąskie gardło nigdy nie czeka na nas" |
| Zwalnianie pracy wcześniej „na wszelki wypadek" | rosną WIP i czasy realizacji; priorytety giną | ścisłe zwalnianie według liny |
| Bufory ustawione raz i zapomniane | za duże: WIP pozostaje wysoki; za małe: stałe czerwone zlecenia | korygować na podstawie danych o czerwonych zleceniach |
| Brak bramki jakości przed wąskim gardłem | maszyny wąskiego gardła obrabiają części, które już są złomem | kontrola lub poka-yoke przed wąskim gardłem |
| Złom wykrywany daleko za procesem | czas wąskiego gardła marnuje się po cichu | sprawdzać krytyczne cechy zaraz za wąskim gardłem |
| Ignorowanie rynkowego wąskiego gardła | zakład z wolnymi mocami wszędzie wciąż „optymalizuje" maszyny | S-DBR, oferty z czasem realizacji, zaangażowanie sprzedaży |
| Miks produktów według marży na jednostkę | niższy zysk przy tej samej zdolności | szeregować według T na minutę wąskiego gardła |
| Dwa konkurencyjne systemy priorytetów | listy „gorących" zleceń i kolory buforów są ze sobą sprzeczne | jedna zasada: status bufora |
| Wąskie gardło się przesuwa, zasady zostają | stare wielkości partii i wyceny blokują kolejny zysk | przegląd kroku 5 w każdym cyklu |
| Operatorzy wąskiego gardła pozostawieni samym sobie | osoby, które widzą straty, nie są o nie pytane | operatorzy są odpowiedzialni za przyczyny strat i działania zaradcze |

## Krytyka i ograniczenia teorii ograniczeń

TOC ma silne wyniki w praktyce i słabsze poparcie w badaniach. Poważny przewodnik musi omawiać jedno i drugie.

### 1. Dowody: historie sukcesów i błąd publikacyjny

Mabin i Balderstone przeanalizowali ponad 80 opublikowanych udanych zastosowań TOC i stwierdzili znaczące poprawy operacyjne i finansowe; mimo szeroko zakrojonych poszukiwań nie znaleźli jednak żadnych doniesień o porażkach [10]. Jest to ostrzeżenie w tym samym stopniu, co rekomendacja. Opublikowane przypadki piszą konsultanci, dostawcy i entuzjastyczne firmy; nieudane wdrożenia rzadko trafiają do druku. Gupta i Snyder (2009) argumentowali, że TOC nie wykazała jeszcze swojej skuteczności w literaturze akademickiej, i wezwali do badań łączących wdrożenie z wynikami finansowymi, co podsumowano na Wikipedii [6]. Ankieta Panizzolo przeprowadzona w 61 europejskich zakładach wykazała, że niektóre praktyki TOC, zwłaszcza DBR, nieograniczenia z nadmiarem zdolności oraz harmonogram główny oparty na ograniczeniu, wiązały się z lepszymi wynikami, jednak rezultaty różniły się w zależności od kraju i opierały się na własnych ocenach menedżerów [11].

### 2. Optymalność i badania nad harmonogramowaniem

Badacze z zakresu badań operacyjnych krytykowali heurystyki TOC za brak optymalności. Trietsch twierdził, że DBR jest gorsze od konkurencyjnych metod, a Linhares (2009) argumentował, że reguła doboru asortymentu TOC (szeregowanie według przepustowości na jednostkę ograniczenia) nie może w ogólności gwarantować wyników optymalnych, ponieważ problem doboru asortymentu przy wielu ograniczeniach jest obliczeniowo trudny [6]. Praktyczny wniosek: reguła „T na minutę ograniczenia” jest wiarygodna przy jednym wyraźnym ograniczeniu. Przy dwóch lub większej liczbie wzajemnie oddziałujących ograniczeń należy stosować programowanie liniowe lub APS.

### 3. Oryginalność

Krytycy wskazywali, że wiele idei TOC istniało wcześniej: wkład na jednostkę czynnika ograniczającego w rachunkowości zarządczej (Noreen, Smith i Mackey, 1995), elementy dynamiki systemów i statystycznej kontroli procesu, PERT/CPM w zarządzaniu projektami [6]. Sam Goldratt przypisywał zasługi wcześniejszym pracom, w szczególności Toyota Production System i fordowskim ideom przepływu, w swoim artykule z 2009 roku „Standing on the Shoulders of Giants” [6]. Dla praktyka oryginalność ma mniejsze znaczenie niż to, czy zestawienie tych elementów działa; dla studenta warto jednak wiedzieć, skąd pochodzą poszczególne elementy.

### 4. Ludzie i polityka

Nave (2002) argumentował, że TOC ma tendencję do ignorowania pracowników i nie traktuje nieudanych polityk jako ograniczeń, co podsumowano na Wikipedii [6]. W praktyce istnieje ryzyko, że „podporządkowanie” zostanie odczytane jako „posłuszeństwo”, a presja spadnie wyłącznie na operatorów ograniczenia. Rozdział 20 omawia tę kwestię.

### 5. Gdzie TOC pasuje gorzej

- **Zbalansowane, taktowane linie** o stałym tempie i niewielkiej zmienności: sama linia jest ograniczeniem, a lepszym narzędziem jest lean balansowanie linii.
- **Silnie zmieniające się wąskie gardła** w warsztatach o wysokim zróżnicowaniu asortymentu: trudno zdefiniować pojedynczy bębien. Lepiej sprawdzają się S-DBR, kontrola obciążenia lub APS.
- **Zakłady, w których przez lata ograniczeniem jest rynek**: wewnętrzny DBR wnosi niewiele; dźwignia tkwi w sprzedaży, czasie realizacji i projektowaniu ofert.
- **Dojrzałość pomiarowa:** rachunkowość przepustowości wymaga zespołu finansowego gotowego prowadzić drugi widok. Bez tego decyzje wracają do kosztu standardowego.

### 6. Kontekst komercyjny

Znaczna część literatury o TOC jest wydawana przez North River Press oraz przez firmy konsultingowe założone przez Goldratta lub jego współpracowników. Nie czyni to jej błędną, ale oznacza, że wiele źródeł nie jest niezależnych. Niniejszy przewodnik korzysta z recenzowanych źródeł tam, gdzie istnieją, i oznacza jako takie twierdzenia praktyków (na przykład liczbę „30 procent ukrytej zdolności” podawaną przez TOC Institute) [4].

## Ludzie i bezpieczeństwo przy ograniczeniu

TOC może poprawić pracę ludzi przy ograniczeniu albo ją pogorszyć. Sama metoda jest neutralna; o efekcie decyduje sposób jej wprowadzenia.

### Co operatorzy zauważają najpierw

- **Większa uwaga:** kierownicy nagle interesują się każdą minutą pracy jednej maszyny. Może to być odbierane jako kontrola. Wyjaśnij, dlaczego tak jest, i pozwól operatorom samodzielnie rejestrować straty.
- **Przerwy:** „zastępowanie na przerwach” oznacza, że maszynę obsługuje pracownik zastępczy, a nigdy, że ludzie rezygnują z przerw.
- **Bezczynność w innych miejscach:** operatorzy na stanowiskach nieograniczających mogą obawiać się o pracę, gdy słyszą, że nie mają budować zapasów. Wyjaśnij, że wolne moce są zamierzone, i wykorzystaj je na szkolenia, usprawnianie przezbrojeń, 5S, szkolenia krzyżowe dla obsługi ograniczenia oraz pracę nad jakością.
- **Uznanie:** usprawnienia zespołu obsługującego ograniczenie (jak skrócenie przezbrojenia z 30 do 18 minut) powinny być widoczne na tablicy, z nazwiskami, jeśli zainteresowani się na to zgodzą.

### Zasady bezpieczeństwa nie uginają się przed ograniczeniem

Presja, by utrzymać ograniczenie w ruchu, nigdy nie może prowadzić do skrótów w kwestii bezpieczeństwa. Serwisowanie i konserwacja maszyn, na których nieoczekiwane załączenie zasilania mogłoby zranić ludzi, podlega normie OSHA dotyczącej kontroli niebezpiecznej energii (lockout/tagout, 29 CFR 1910.147) [25]. Szybsze przezbrojenia trzeba zaprojektować w samej procedurze (mocowania szybkiego zwalniania, wcześniej ustawione narzędzia, etapowe dostarczanie materiału), a nie osiągać przez pominięcie blokady energii. Dotyczy to także osłon i ergonomii: pracownik zastępczy potrzebuje tego samego szkolenia i kwalifikacji co regularny operator.

### Kontekst związkowy i pracowniczy

W zakładach ze związkami zawodowymi przesunięte przerwy, pracownicy zastępczy, zmiany sobotnie i zmiany w pomiarach często dotyczą układu zbiorowego prawa pracy. Zaangażuj związek lub przedstawicieli pracowników już w fazie 0 planu wdrożenia, wyjaśnij cel i uzgodnij, jak przydzielane będą nadgodziny i role zastępcze. Wdrożenie TOC, które zaczyna się od skargi na harmonogram przerw, traci miesiące.

### Szacunek dla ludzi w ujęciu TOC

Chmura parowania (rozdział 12) jest praktycznym narzędziem szacunku dla ludzi: zakłada, że obie strony konfliktu mają uzasadnione potrzeby, i szuka błędnego założenia leżącego u podstaw konfliktu. Stosowana w zespole, do którego należą operatorzy, zamienia konflikt „operatorzy kontra planiści” we wspólny problem ze wspólnym celem.

## TOC w cyfrowej fabryce: dane, symulacja i APS

TOC powstało wraz z oprogramowaniem: OPT było programem do szeregowania, zanim stało się filozofią [3]. Dziś narzędzia cyfrowe pomagają w czterech obszarach.

### 1. Dane do wykrywania wąskich gardeł

Platformy MES i IIoT dostarczają oznaczone czasem stany maszyn, których wymaga metoda okresów aktywnych (Rozdział 6). Większość zakładów ma już stany (praca, bezczynność, awaria, przezbrojenie), ale nie rozróżnia stanów „głodowania” i „blokady” od „bezczynności”. Dodanie tych dwóch stanów jest często najbardziej użyteczną pojedynczą zmianą dla analizy TOC. Uzgodnij z operatorami i, tam gdzie to dotyczy, ze związkami zawodowymi, że dane o stanach maszyn służą do wykrywania strat systemowych, a nie do oceny poszczególnych osób. Zbieraj dane w trybie tylko do odczytu ze sterowników i utrzymuj segmentację sieci OT; przewodnik [Cyberbezpieczeństwo OT i ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) opisuje, jak to zrobić. Sprawdź, czy zegary maszyn są zsynchronizowane, ponieważ metoda okresów aktywnych porównuje znaczniki czasu między zasobami. Przewodniki [MES i ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) oraz [predykcyjne utrzymanie ruchu i IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) wyjaśniają ścieżkę przepływu danych; przewodnik [IT produkcyjne z Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) opisuje analitykę chmurową dla takich danych.

### 2. Symulacja przesuwających się wąskich gardeł i doboru buforów

Symulacja zdarzeń dyskretnych pozwala przetestować wielkości buforów, reguły zwalniania i opcje podnoszenia wydajności, zanim zmienisz halę produkcyjną. Roser, Nakano i Tanaka opracowali metodę okresów aktywnych na danych symulacyjnych [13][14]. Typowe pytania: Jak często wąskie gardło się przesuwa przy miksie produkcji na następny kwartał? Jak duży musi być bufor ograniczenia, aby udział zleceń opóźnionych utrzymać poniżej 10 procent? Czy druga maszyna przesunie ograniczenie na montaż? Przewodnik [cyfrowy bliźniak w produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/) wyjaśnia, kiedy model symulacyjny staje się cyfrowym bliźniakiem.

### 3. APS do szeregowania metodą bębna

APS może szeregować bęben z uwzględnieniem czasów przezbrojeń zależnych od sekwencji, obliczać terminy zwolnień z buforów i pokazywać stan buforów. DBR dostarcza logikę sterowania; APS zapewnia moc obliczeniową, zwłaszcza gdy ograniczenie się przesuwa lub gdy kilka ograniczeń wzajemnie oddziałuje (tam, gdzie prosta reguła miksu produkcji zawodzi, patrz Rozdział 19). Przewodnik [szeregowanie produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/) omawia to szczegółowo, w tym kiedy wystarcza ERP.

### 4. Modele strumienia wartości dla widoku systemowego

Cyfrowy model strumienia wartości pokazuje ograniczenie w kontekście całego przepływu: czasy cyklu, dostępność, wielkości partii i zapasy. Jednym z przykładów takiego oprogramowania jest iFAKT Polaris, łączący modelowanie strumienia wartości z symulacją; według dostawcy jego moduły obejmują optymalizację szeregowania [26]. To opis dostawcy, a nie niezależny test. **Uwaga: autor pracuje w iFAKT GmbH.** Przewodnik [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) opisuje go bardziej szczegółowo; inne narzędzia do strumienia wartości i symulacji mogą wykonywać tę samą analizę TOC.

### Kolejność: najpierw metoda, potem oprogramowanie

Zacznij od dziennika strat ograniczenia i tablicy buforów na papierze lub w arkuszu kalkulacyjnym. Automatyzuj, gdy metoda działa, a ludzie ufają liczbom. Ekran stanu buforów, którego nikt nie wykorzystuje, jest gorszy niż tablica w hali, która napędza codzienne spotkanie.

## Glosariusz

| Termin | Definicja |
|---|---|
| Okres aktywny | nieprzerwany ciąg stanów aktywnych zasobu; podstawa metody okresów aktywnych [13] |
| Metoda okresów aktywnych | metoda wykrywania wąskiego gardła: w danym momencie wąskim gardłem jest zasób z najdłuższym nieprzerwanym okresem aktywnym [13][14] |
| Bufor montażowy | bufor czasowy, który sprawia, że części nieograniczające czekają na montażu na część ograniczającą |
| Wąskie gardło | zasób, którego zdolność produkcyjna jest niższa niż zapotrzebowanie na niego |
| Obchód wąskiego gardła | metoda na hali produkcyjnej polegająca na notowaniu stanów pracy, głodzenia i blokowania podczas powtarzanych obchodów [15] |
| Zarządzanie buforami | śledzenie zużycia buforów w strefach kolorystycznych w celu ustalania priorytetów i znajdowania przyczyn usprawnień [9] |
| Penetracja bufora | udział już zużytego bufora czasowego |
| Zasób ograniczony zdolnością (CCR) | zasób pracujący blisko swojej zdolności, który może stać się ograniczeniem, jeśli nie zostanie odpowiednio zarządzany |
| Ograniczenie | wszystko, co ogranicza wydajność systemu w kierunku jego celu |
| Bufor ograniczenia | bufor czasowy przed ograniczeniem |
| CONWIP | constant work in process (stała ilość pracy w toku); system ciągnący, który ogranicza całkowite WIP na linii [23] |
| Łańcuch krytyczny | najdłuższy łańcuch zależnych zadań uwzględniający zależności zadań i zasobów |
| Drzewo obecnej rzeczywistości (CRT) | narzędzie procesu myślowego łączące niepożądane skutki z przyczynami źródłowymi |
| Bęben | harmonogram ograniczenia, który wyznacza tempo pracy zakładu |
| Bęben-bufor-lina (DBR) | metoda harmonogramowania TOC: zaplanuj ograniczenie, chroń je buforami czasowymi, zwalniaj materiał w jego tempie [6][8] |
| Podnieś (Elevate) | krok 4: zwiększ zdolność przy ograniczeniu |
| Chmura parowania (EC) | narzędzie procesu myślowego służące do rozwiązywania konfliktu przez zakwestionowanie założenia |
| Wykorzystaj (Exploit) | krok 2: maksymalnie wykorzystaj ograniczenie przy istniejących zasobach |
| Bufor zasilający | w łańcuchu krytycznym bufor, w którym łańcuch niekrytyczny dołącza do łańcucha krytycznego |
| Pięć kroków koncentracji | zidentyfikuj, wykorzystaj, podporządkuj, podnieś, zapobiegaj bezwładności [4] |
| Drzewo przyszłej rzeczywistości (FRT) | narzędzie procesu myślowego do testowania rozwiązania i jego skutków ubocznych |
| Bezwładność | reguły i nawyki, które przeżywają ograniczenie, dla którego je stworzono |
| Zapasy/inwestycje (I) | pieniądze zamrożone w rzeczach, które system zamierza sprzedać (a w szerszym ujęciu także w aktywach) [20] |
| Prawo Little'a | WIP = przepustowość × czas cyklu [16] |
| Koszty operacyjne (OE) | wszystkie pieniądze wydane na zamianę zapasów w przepustowość [20] |
| Planowe obciążenie | w S-DBR zobowiązana praca na CCR wyrażona w czasie |
| POOGI | process of ongoing improvement (proces ciągłego doskonalenia); pięć kroków koncentracji jako cykl |
| Drzewo wymagań wstępnych (PRT) | narzędzie procesu myślowego wymieniające przeszkody i cele pośrednie |
| Bufor projektowy | w łańcuchu krytycznym zagregowany czas bezpieczeństwa na końcu projektu |
| Lina (Rope) | mechanizm zwalniania materiału, który wiąże jego uwalnianie z harmonogramem ograniczenia |
| S-DBR (uproszczony bęben-bufor-lina) | wariant DBR z buforem wysyłkowym i kontrolą planowego obciążenia, dla produkcji na zamówienie [6][9] |
| Przesuwające się wąskie gardło | wąskie gardło przemieszczające się między zasobami w czasie [14] |
| Bufor wysyłkowy | bufor czasowy chroniący termin dostawy |
| Podporządkuj | krok 3: dostosuj wszystkie elementy nieograniczające do ograniczenia |
| Przepustowość (T) | tempo, w jakim system generuje pieniądze przez sprzedaż: sprzedaż minus rzeczywiście zmienny koszt [20] |
| Rachunkowość przepustowości | rachunkowość zarządcza oparta na T, I i OE |
| Wskaźnik rachunkowości przepustowości (TPAR) | zwrot na godzinę pracy zakładu ÷ koszt na godzinę pracy zakładu [19] |
| Drzewo przejścia (TrT) | narzędzie procesu myślowego do wdrażania krok po kroku |
| TOCICO | Theory of Constraints International Certification Organization, amerykańska organizacja non-profit 501(c)(3) [5] |
| Niepożądany skutek (UDE) | zaobserwowany negatywny skutek wykorzystywany jako dane wejściowe do drzewa obecnej rzeczywistości |
| VATI | klasyfikacja zakładów według kształtu przepływu materiałów: V, A, T, I [6] |

## FAQ: pytania dotyczące teorii ograniczeń

### Czym jest teoria ograniczeń w prostych słowach?

Każdy system ma jedno lub kilka słabych ogniw, które ograniczają to, ile może wyprodukować. Teoria ograniczeń mówi: znajdź to słabe ogniwo, wykorzystaj je maksymalnie, podporządkuj mu wszystko inne, a dopiero potem inwestuj w nie. Została opracowana przez Eliyahu M. Goldratta i przedstawiona w książce *Cel* w 1984 roku [1].

### Jakie są 5 kroków teorii ograniczeń?

Zidentyfikuj ograniczenie, wykorzystaj ograniczenie, podporządkuj mu wszystko inne, podnieś wydajność ograniczenia, a następnie nie dopuść, by inercja stała się ograniczeniem, i zacznij od nowa [4].

### Jaki jest przykład teorii ograniczeń?

W zakładzie produkcji kolektorów z punktu 5 gniazdo CNC ograniczało wielkość produkcji. Pokrycie przerw, szybsze przezbrajanie, etapowe dostarczanie materiału i wcześniejsze kontrole jakości zwiększyły jego czas produktywny o 800 minut tygodniowo (22 procent), a zmiana asortymentu według przepustowości na minutę ograniczenia zwiększyła zysk bez inwestycji. Druga maszyna za 650 000 dolarów okazała się najsłabszą opcją.

### Jaka jest różnica między wąskim gardłem a ograniczeniem?

Wąskie gardło to zasób o mniejszej zdolności niż wymagane na nim obciążenie. Ograniczenie to wszystko, co ogranicza cel systemu: wąskie gardło, ale także rynek, materiał, polityka lub sposób myślenia. Każde wąskie gardło ograniczające produkcję jest ograniczeniem; nie każde ograniczenie jest wąskim gardłem.

### Jak zidentyfikować wąskie gardło w procesie?

Zacznij od tabeli obciążenia zdolności (popyt × czas procesu w porównaniu z dostępnym czasem), a następnie potwierdź to na hali za pomocą liczby kolejek i obchodu wąskiego gardła. Jeśli masz dane o stanach maszyn ze znacznikami czasu, użyj metody okresów aktywnych, która pokazuje również przesuwające się wąskie gardła [13][14][15]. Punkt 6 porównuje sześć metod.

### Czym jest analiza wąskiego gardła?

Analiza wąskiego gardła wskazuje zasób, który ogranicza proces, określa, ile wydajności kosztuje, i sprawdza, czy z czasem się przesuwa. W zakładzie zacznij od obliczenia obciążenia zdolności, potwierdź je liczbą kolejek i obchodem wąskiego gardła, a tam, gdzie masz dane o stanach maszyn, użyj metody okresów aktywnych (punkt 6).

### Jak usunąć wąskie gardło?

Postępuj według pięciu kroków koncentracji. Najpierw wykorzystaj je (bez utraconych minut, bez wadliwej pracy, właściwy asortyment), następnie podporządkuj resztę zakładu jego tempu, a dopiero potem podnieś jego wydajność dzięki nadgodzinom, outsourcingowi lub nowemu sprzętowi. W przykładzie z kolektorami z punktu 5 samo wykorzystanie zwiększyło czas produktywny ograniczenia o 22 procent, zanim poniesiono jakiekolwiek inwestycje.

### Czym są ograniczenia produkcyjne?

Wszystko, co ogranicza to, ile zakład może wyprodukować i wysłać: zdolność maszyn, ludzie i kwalifikacje, materiały i dostawcy, rynek oraz własne polityki zakładu, takie jak zasady wielkości partii lub wykorzystania. Ograniczenie produkcyjne nie zawsze jest maszyną (punkt 3).

### Jakie są cztery rodzaje ograniczeń?

Listy się różnią. Pogrupowane w cztery, rodzaje z punktu 3 to ograniczenia fizyczne (sprzęt, ludzie, materiały), ograniczenia rynkowe, ograniczenia polityki i ograniczenia paradygmatu. Tabela w punkcie 3 dzieli typ fizyczny na trzy, co daje sześć.

### Czym jest drum-buffer-rope?

Drum-buffer-rope to metoda harmonogramowania TOC. Bęben to harmonogram ograniczenia, bufor to bufor czasowy chroniący ograniczenie i termin wysyłki, a lina zwalnia materiał dopiero na jeden czas buforowy przed tym, jak ograniczenie go potrzebuje [6][8]. Punkt 7 pokazuje harmonogram zwolnień z liczbami.

### Czym jest uproszczony drum-buffer-rope (S-DBR)?

S-DBR to wariant dla zakładów produkujących na zamówienie. Używa tylko bufora wysyłkowego i sprawdza planowane obciążenie zasobu ograniczającego zdolność w momencie ustalania terminów realizacji, zamiast prowadzić szczegółowy harmonogram ograniczenia [6][9].

### Czym jest zarządzanie buforami?

Zarządzanie buforami śledzi, jaka część bufora czasowego każdego zamówienia została zużyta, i oznacza zamówienia kolorami zielonym, żółtym lub czerwonym. Zamówienia czerwone otrzymują priorytet, a przyczyny czerwonych zamówień stają się listą usprawnień [9].

### Czym jest rachunkowość przepustowości?

Rachunkowość przepustowości to rachunkowość zarządcza TOC. Wykorzystuje przepustowość (sprzedaż minus rzeczywiście zmienne koszty), zapasy lub inwestycje oraz koszty operacyjne; zysk netto to T − OE, a ROI to (T − OE) ÷ I [20][22]. W warunkach ograniczenia klasyfikuje produkty według przepustowości na minutę ograniczenia.

### Czym rachunkowość przepływu różni się od rachunkowości kosztów?

Standardowa rachunkowość kosztów rozkłada koszty pracy i kosztów ogólnych na jednostki produkcji i klasyfikuje produkty według marży na jednostkę. Rachunkowość przepływu traktuje koszty pracy i koszty ogólne jako koszty operacyjne, które w krótkim okresie nie zmieniają się wraz z każdą wyprodukowaną jednostką, i klasyfikuje produkty według przepływu (throughput) na jednostkę czasu ograniczenia. Obie metody mogą dać przeciwstawne wyniki, co pokazuje przykład w rozdziale 11.

### Jaka jest różnica między lean a teorią ograniczeń?

Lean szuka marnotrawstwa w całym strumieniu wartości i tworzy przepływ oraz produkcję ciągniętą. TOC szuka jednego ograniczenia i koncentruje doskonalenie właśnie na nim. Lean wyrównuje pracę do taktu; TOC utrzymuje zapasowe zdolności w stanowiskach nieograniczających. Stosowane łącznie, TOC wskazuje narzędziom lean, takim jak SMED i TPM, miejsce, w którym należy zacząć.

### Czy TOC i Six Sigma można łączyć?

Tak. TOC wybiera miejsce, a Six Sigma redukuje zmienność w tym miejscu, na przykład braki w ograniczeniu lub niestabilne dostawy do jego bufora. Rachunkowość przepływu pokazuje następnie efekt finansowy każdego projektu.

### Czym są procesy myślowe w TOC?

Zestaw narzędzi logicznych do problemów niefizycznych: drzewo rzeczywistości bieżącej, chmura ewaporacyjna, drzewo rzeczywistości przyszłej, drzewo warunków wstępnych i drzewo przejścia. Odpowiadają one na pytania: co zmienić, na co to zmienić i jak wywołać zmianę [12].

### Czym jest zarządzanie projektami metodą łańcucha krytycznego?

Zastosowanie TOC przez Goldratta do projektów, opisane w jego książce *Critical Chain* z 1997 roku [3]. Metoda planuje najdłuższy łańcuch zależności zadań i zasobów, usuwa zapas bezpieczeństwa z poszczególnych zadań i gromadzi go w buforach projektowych i buforach zasilających.

### Czym jest teoria ograniczeń w zarządzaniu łańcuchem dostaw?

W łańcuchach dostaw TOC zastępuje zapasy planowane na podstawie prognoz w każdej lokalizacji buforami, które uzupełnia się do rzeczywistego zużycia i których wielkość koryguje się według stanu buforów [6]. Traktuje najsłabsze ogniwo, często dostawcę, zakład lub rynek, jako ograniczenie wyznaczające tempo dla całego systemu. Zasady uzupełniania podsumowano w rozdziale 14.

### Jakie są krytyki teorii ograniczeń?

Główne zarzuty to stronniczość publikacji w badaniach sukcesu, brak optymalności heurystyk TOC, gdy współdziała wiele ograniczeń, ograniczona oryginalność części idei oraz tendencja do pomijania ludzi i polityk [6][10]. Każdemu z nich poświęcono rozdział 19.

### Czy teoria ograniczeń wciąż ma znaczenie?

Tak. Zakłady nadal mają ograniczenia, a połączenie lepszych danych z maszyn, symulacji i APS ułatwia wykrywanie przesuwających się wąskich gardeł i planowanie bębna. Zmieniło się to, że TOC rzadko stosuje się samodzielnie; zwykle łączy się ją z lean, Six Sigma i cyfrowym planowaniem.

### Kto stworzył teorię ograniczeń?

Eliyahu M. Goldratt (1947–2011), izraelski fizyk i autor książek o biznesie. Wprowadził TOC w książce *The Goal* (1984), napisanej wspólnie z Jeffem Coxem [1][2].

### Ile trwa wdrożenie teorii ograniczeń?

W jednym zakładzie lub strumieniu wartości pierwsze mierzalne rezultaty zwykle pojawiają się w ciągu kilku tygodni dzięki eksploatacji ograniczenia, ponieważ wymaga ona niewielkich nakładów. Stabilna rutyna DBR lub S-DBR z zarządzaniem buforami zajmuje kilka miesięcy; plan z rozdziału 16 przewiduje sześć miesięcy na pierwszy pełny cykl. Te czasy są założeniami planistycznymi, a nie wynikami z badań porównawczych.

### Czy istnieje certyfikacja w zakresie teorii ograniczeń?

TOCICO oferuje certyfikację na trzech poziomach: egzaminy podstawowe, egzaminy praktyków oraz ocenę wdrożeniowca, w obszarach takich jak operacje, łańcuch dostaw, zarządzanie projektami (CCPM), procesy myślowe i finanse [5].

## Podsumowanie i pierwsze kroki

Teoria ograniczeń wychodzi z prostej obserwacji: wydajność zakładu wyznacza bardzo niewielka liczba ograniczeń, zwykle jedno. To zmienia, co powinni robić menedżerowie. Zamiast ulepszać wszystko naraz, należy znaleźć ograniczenie, przestać marnować jego czas, sprawić, by reszta zakładu mu służyła, i wydawać pieniądze dopiero wtedy, gdy to zostanie zrobione. Bęben-bufor-lina przekłada tę logikę na harmonogram, zarządzanie buforami przekłada ją na codzienne priorytety, a rachunkowość przepustowości przekłada ją na decyzje finansowe, których raporty ze standardowych kosztów mogą nie uwzględniać.

Przykład z opracowania pokazuje skalę tego, co często jest możliwe bez inwestycji: 22 procent więcej czasu ograniczenia dzięki przerwom, przezbrojeniom, przygotowaniu materiałów i kontrolom jakości oraz zmianę asortymentu, której standardowa kalkulacja kosztów by nie zasugerowała. Pokazuje też granice: po wykorzystaniu ograniczenie się przesuwa, a dawne reguły stają się kolejnym problemem. TOC najlepiej działa przy jednym wyraźnym ograniczeniu i wymaga innych narzędzi (optymalizacji, APS, równoważenia linii metodą lean) tam, gdzie ograniczenia się przesuwają lub wzajemnie oddziałują. Baza dowodowa składa się głównie z historii sukcesów, dlatego sprawdź te twierdzenia we własnym zakładzie.

**Twoje pierwsze kroki w ciągu 30 dni**

- [ ] Zbuduj tabelę obciążenia dla głównej rodziny produktów (popyt × czas procesu vs. dostępny czas) i wskaż kandydata na ograniczenie
- [ ] Potwierdź go liczbami kolejek i trzema obchodami wąskich gardeł na zmianę przez jeden tydzień
- [ ] Rozpocznij dziennik strat ograniczenia (Szablon 2) przy kandydacie i wypełniaj go co zmianę przez dwa tygodnie
- [ ] Oblicz przepustowość na minutę ograniczenia dla 10 najważniejszych produktów (Szablon 3) z kontrolerem finansowym
- [ ] Wybierz dwie największe straty i podejmij działania (pokrycie przerw, przezbrojenie zewnętrzne, kontrola jakości przed ograniczeniem)
- [ ] Wycofaj przynajmniej jeden cel wykorzystania dla obszarów niebędących ograniczeniem
- [ ] Poinformuj związki zawodowe lub przedstawicieli pracowników o celach, pokryciu przerw i roli rezerwowej zdolności produkcyjnej
- [ ] Zapytaj dział IT, czy dane z maszyn pozwalają odróżnić stany „głodzenia” i „blokowania” od „bezczynności” na potrzeby metody okresów aktywnych
- [ ] Przeprowadzaj 10-minutowe codzienne spotkanie przy ograniczeniu (Szablon 8)

---

## Dalsza lektura na m365.fm

**Powiązane przewodniki**
- [Planowanie produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Produkcja Lean](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Mapowanie strumienia wartości](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI produkcyjne](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Doskonałość operacyjna](https://www.m365.fm/en/learn/operational-excellence/)
- [Zarządzanie na hali produkcyjnej i obchody Gemba](https://www.m365.fm/en/learn/shop-floor-management/)
- [Cyfrowy bliźniak w produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [IT produkcyjne z Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planowanie produkcji lotniczej](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Nowe przewodniki w tej serii**
- [SMED i skracanie przezbrojeń](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM i OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban i systemy ciągnione](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma i analiza przyczyn źródłowych](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP i planowanie produkcji](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES i ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Utrzymanie predykcyjne i IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [Symulacja produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Wielkość partii](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Zarządzanie zapasami w produkcji](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)

**Hasła słownikowe (encje)**
[Teoria ograniczeń](https://www.m365.fm/entity/theory-of-constraints/) · [Harmonogramowanie oparte na ograniczeniach](https://www.m365.fm/entity/constraint-based-scheduling/) · [Zarządzanie buforami](https://www.m365.fm/entity/buffer-management/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Mapowanie strumienia wartości](https://www.m365.fm/entity/value-stream-mapping/) · [SMED](https://www.m365.fm/entity/smed/) · [Kanban](https://www.m365.fm/entity/kanban/) · [System ciągniony](https://www.m365.fm/entity/pull-system/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Gastgeber von m365.fm und arbeitet bei der iFAKT GmbH. Auf m365.fm schreibt er über Lean Manufacturing, operative Exzellenz, Produktionsplanung und die digitale Transformation der Produktion, mit Schwerpunkt darauf, wie Wertstrommodelle, Simulation und KPI-Analysen Werken helfen, ihre Engpässe zu finden und zu steuern.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked (S) were taken over from the source list of the related guide *Production Scheduling and APS* (`production-scheduling-aps.md`), where they were verified on the same date; they could not be re-fetched in this session because the shared web search and fetch budget ran out.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal: Excellence in Manufacturing. North River Press, Croton-on-Hudson (NY) 1984, 262 pp., ISBN 978-0-88427-060-7, LCCN 85021827. Catalog record: Open Library. https://openlibrary.org/books/OL2540561M/The_goal
2. North River Press: Eliyahu M. Goldratt, Renowned Business Guru and Author of International Best Selling Business Novel The Goal, Dies at Age 64. Press release via PR Newswire, June 14, 2011. https://prnewswire.com/news-releases/eliyahu-m-goldratt-renowned-business-guru-and-author-of-international-best-selling-business-novel-the-goal-dies-at-age-64-123796619.html
3. Eliyahu M. Goldratt (biography, Creative Output and OPT, Avraham Y. Goldratt Institute, bibliography with years). Wikipedia. https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt
4. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html (and the overview page https://www.tocinstitute.org/theory-of-constraints.html)
5. Theory of Constraints International Certification Organization (TOCICO): About us (501(c)(3) status, certification levels, TOC Innovation Summit). https://www.tocico.org/about-us
6. Theory of constraints (five focusing steps, buffers and buffer management, DBR and S-DBR, VATI, throughput accounting, critical chain, criticism section citing Trietsch, Linhares 2009, Noreen/Smith/Mackey 1995, Gupta/Snyder 2009, Nave 2002 and Goldratt 2009). Wikipedia. https://en.wikipedia.org/wiki/Theory_of_constraints
7. The Goal (novel) (editions, characters, Time 2011 list citing Rawlings, N.: The 25 Most Influential Business Management Books, Time, August 9, 2011). Wikipedia. https://en.wikipedia.org/wiki/The_Goal_(novel)
8. (S) Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
9. (S) Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, M. L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
10. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636. https://www.emeraldinsight.com/doi/abs/10.1108/01443570310476636
11. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
12. Kim, Sanghyun; Mabin, Victoria J.; Davies, John: The theory of constraints thinking processes: retrospect and prospect. International Journal of Operations & Production Management 28 (2008) 2, pp. 155–184. DOI: 10.1108/01443570810846883
13. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: A Practical Bottleneck Detection Method. In: Peters, B. A.; Smith, J. S.; Medeiros, D. J.; Rohrer, M. W. (eds.): Proceedings of the 2001 Winter Simulation Conference, pp. 949–953. https://informs-sim.org/wsc01papers/126.PDF
14. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: Shifting Bottleneck Detection. In: Yücesan, E.; Chen, C.-H.; Snowdon, J. L.; Charnes, J. M. (eds.): Proceedings of the 2002 Winter Simulation Conference, pp. 1079–1086. https://www.informs-sim.org/wsc02papers/145.pdf
15. Roser, Christoph: Mathematically Accurate Bottleneck Detection 2 – The Active Period Method. AllAboutLean.com, June 29, 2014 (updated May 13, 2026). https://www.allaboutlean.com/active-period-method
16. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383 (bibliographic data confirmed via Crossref, November 20, 2026)
17. (S) Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
18. (S) Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
19. ACCA (Performance Management examining team): Throughput accounting and the theory of constraints, part 2. Association of Chartered Certified Accountants, technical article. https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/throughput-constraints2.html
20. Murphy, Sean: Summary of Goldratt, E. M.: The Haystack Syndrome: Sifting Information Out of the Data Ocean. North River Press, New York 1990. Management and Accounting Web (MAAW, J. R. Martin). https://maaw.info/ArticleSummaries/ArtSumHaystackSyndrome90.htm
21. Corbett, Thomas: Throughput Accounting. North River Press, 174 pp., ISBN 978-0-88427-158-1 (retailer listing dated January 1, 1999; publisher page: https://www.toc-goldratt.com/en/product/Throughput-Accounting). Listing: https://www.booktopia.com.au/throughput-accounting-thomas-corbett/book/9780884271581.html
22. Theory of Constraints (TOC): throughput accounting measures, derived measures and decision priority. Lean Production (Vorne Industries). https://www.leanproduction.com/theory-of-constraints/
23. (S) Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
24. Gray, Virginia; Felan, Joe; Umble, Elisabeth; Umble, Michael: A comparison of drum-buffer-rope (DBR) and critical chain (CC) buffering techniques. Paper presented at PMI Research Conference 2000, Paris. Project Management Institute. https://www.pmi.org/learning/library/drum-buffer-rope-critical-chain-buffering-8526
25. Occupational Safety and Health Administration (OSHA): 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
26. iFAKT GmbH: Polaris Optimizer (vendor page; site navigation also lists Simulator and Value Stream Mapping). https://www.ifakt.de/en/solutions/optimizer
27. National Institute of Standards and Technology (NIST): Malcolm Baldrige National Quality Award 1988 recipient profile, Motorola Inc. ("Six Sigma Quality"). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
28. PwC Viewpoint: Inventory guide, section 1.3 Cost (definition of inventory cost as the sum of applicable expenditures and charges directly or indirectly incurred; references ASC 330-10-30-3 to 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html (accessed November 20, 2026)
29. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (fixed production overhead allocated based on normal capacity; ASC 330-10-30-6 on abnormally low production). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf (accessed November 20, 2026)
