# SEO metadata

| Field | Value |
|---|---|
| Meta title | Wertstromanalyse: Symbole, Kennzahlen & Praxisbeispiel |
| Meta description | Wertstromanalyse (VSM) Schritt für Schritt: Symbole, Taktzeit- und Durchlaufzeitformeln, ein vollständig berechnetes Beispiel, Zukunftszustand und VSM-Software. |
| Slug | `value-stream-mapping` |

# Wertstromanalyse: Der vollständige Leitfaden zu VSM-Symbolen, Kennzahlen, Zukunftszustandsgestaltung und Wertstrommanagement

> **Krótka odpowiedź:** Mapowanie strumienia wartości (VSM, ang. *value stream mapping*; niem. *Wertstromanalyse*) to metoda Lean polegająca na narysowaniu przepływu materiałów i informacji dla jednej rodziny produktów, od dostawcy do klienta, na jednej stronie, za pomocą standardowych symboli. Oś czasu z czasem realizacji (lead time), czasem obróbki i dniami zapasów pokazuje, jak mała część całkowitego czasu dodaje wartość. Mapa stanu przyszłego projektuje następnie bardziej szczupły przepływ, a plan wdrożenia sprawia, że staje się on rzeczywistością.

W wielu zakładach zamówienie przebywa w fabryce trzy lub cztery tygodnie, podczas gdy rzeczywista praca nad nim trwa kilka minut. Niemieckojęzyczna Wikipedia podaje typowy przykład: cztery tygodnie czasu realizacji wobec dziesięciu minut czystego czasu obróbki [27]. Jeśli patrzy się tylko na pojedyncze maszyny, tej luki się nie widzi. Mapowanie strumienia wartości wymusza spojrzenie na cały przepływ: Gdzie leżą materiały? Dlaczego tam leżą? Kto i kiedy mówi każdemu procesowi, co ma produkować dalej?

Ten przewodnik wyjaśnia metodę od podstaw. Otrzymujesz pełny zestaw symboli, instrukcję krok po kroku, każdy ważny wskaźnik z wzorem oraz w pełni policzony przykład, zasady projektowania stanu przyszłego, ograniczenia metody papierowej, dynamiczne i cyfrowe mapowanie strumienia wartości, Value Stream 4.0, zarządzanie strumieniem wartości jako zadanie kierownicze oraz neutralny przegląd kategorii oprogramowania. Zwięzła definicja znajduje się na stronie encyklopedycznej m365.fm [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/).

Uwaga o źródłach: mapowanie strumienia wartości (niem. *Wertstromanalyse*) ma w Niemczech silną tradycję badawczą, m.in. w Fraunhofer IPA i na TU Darmstadt. Tam, gdzie niemieckie źródło wnosi coś, czego brakuje literaturze anglojęzycznej, pozostaje ono w tekście wraz z krótkim wyjaśnieniem.

### Najważniejsze wnioski

- Mapowanie strumienia wartości zawsze dotyczy jednej **rodziny produktów** i całego przepływu od bramy do bramy, a nie pojedynczych maszyn czy działów.
- Mapę rysuje się **od klienta wstecz**, w kierunku wejścia procesu, ołówkiem, na hali produkcyjnej w gemba (japońskie określenie „rzeczywistego miejsca”, tu: hali produkcyjnej).
- Podstawowe wskaźniki to **takt time, cycle time, dni zapasów, lead time i wskaźnik przepływu** (zwany także process cycle efficiency lub activity ratio). Dni zapasów wynikają z prawa Little'a: zapas podzielony przez popyt.
- Mapa stanu obecnego to tylko połowa metody. Rezultaty przynosi **mapa stanu przyszłego**, zbudowana według jasnych zasad projektowania, oraz **plan wdrożenia** z wyznaczonymi odpowiedzialnymi i terminami.
- Klasyczna mapa jest **migawką** opartą na średnich. Przy dużej różnorodności produktów i zmiennym popycie analizę uzupełniają symulacja dynamiczna i automatycznie zbierane dane.
- **Zarządzanie strumieniem wartości** zamienia jednorazowy warsztat w stałe zadanie kierownicze z odpowiedzialnym menedżerem strumienia wartości.

### Ścieżki lektury dla zajętych czytelników

| Jesteś… | Czytaj najpierw |
|---|---|
| Nowy w Lean lub studentem | Części 1–4 (definicja, historia, cele, symbole) |
| Facylitatorem warsztatu po raz pierwszy lub coachem Lean | Części 5–8 (instrukcja krok po kroku z agendą warsztatu, wskaźniki, przykład, projektowanie stanu przyszłego) oraz 14 (typowe błędy) |
| Kierownikiem zakładu lub osobą odpowiedzialną za operacje | Część 7 (przykład z liczbami stanu obecnego i przyszłego), części 10–13 (ograniczenia, dynamiczne i cyfrowe VSM, Value Stream 4.0, zarządzanie strumieniem wartości) |
| Liderem IT, MES lub Microsoft 365/Azure | Części 11 (dynamiczne i cyfrowe VSM), 12 (Value Stream 4.0) i 15 (kategorie oprogramowania) |

## Spis treści

1. Czym jest mapowanie strumienia wartości? Definicja i różnice względem mapowania procesów
2. Historia: od diagramu przepływu materiałów i informacji Toyoty do „Learning to See”
3. Cele i korzyści mapowania strumienia wartości
4. Symbole mapowania strumienia wartości: pełna tabela referencyjna
5. Jak stworzyć mapę strumienia wartości: przewodnik krok po kroku dla stanu obecnego
6. Metryki i wzory mapowania strumienia wartości
7. Przykład mapowania strumienia wartości: jeden strumień wartości w pełni obliczony
8. Mapowanie stanu przyszłego: wytyczne projektowe Rother/Shook i Erlacha
9. Znajdowanie marnotrawstwa: 8 rodzajów marnotrawstwa i diagram spaghetti
10. Ograniczenia tradycyjnego mapowania strumienia wartości
11. Dynamiczne i cyfrowe mapowanie strumienia wartości
12. Value Stream 4.0: logistyka informacji jako drugi wymiar
13. Zarządzanie strumieniem wartości: prowadzenie strumienia wartości jako zadanie kierownicze
14. Typowe błędy mapowania strumienia wartości i jak ich unikać
15. Oprogramowanie do mapowania strumienia wartości: porównanie kategorii
16. Cyfrowe mapowanie strumienia wartości z iFAKT Polaris VSM i BSM
17. Zarządzanie strumieniem wartości w dostarczaniu oprogramowania: czym się różni
18. Dowody i publikacje badawcze
19. FAQ: odpowiedzi na pytania dotyczące mapowania strumienia wartości
20. Podsumowanie

## 1. Czym jest mapowanie strumienia wartości? Definicja i różnice względem mapowania procesów

Lean Enterprise Institute (LEI) definiuje mapowanie strumienia wartości jako „diagramowanie każdego kroku w przepływach materiałowych i informacyjnych potrzebnych do doprowadzenia produktu od zamówienia do dostawy” [45]. ASQ określa je jako „narzędzie lean, które wykorzystuje diagram przepływu dokumentujący każdy krok procesu” [46]. Mówiąc precyzyjniej: dla jednej rodziny produktów mapa strumienia wartości pokazuje wszystkie działania potrzebne, aby doprowadzić produkt od surowca do klienta. Obejmuje to działania dodające wartość i niedodające wartości, fizyczny przepływ materiału oraz przepływ informacji, który nim steruje. Wynik mieści się na jednym dużym arkuszu, zwykle formatu 11 × 17 in (tabloid, zbliżonego do formatu A3 używanego w Europie), i jest rysowany standardowymi symbolami.

**Strumień wartości** to suma tych działań. W języku angielskim „value stream mapping” i „VSM” są standardowymi terminami; używa się też określenia „value stream analysis”, głównie dla prac nad stanem obecnym. Klaus Erlach z Fraunhofer Institute for Manufacturing Engineering and Automation IPA w Stuttgarcie wyraźnie rozgranicza **analizę strumienia wartości** (rejestrowanie i ocenę stanu obecnego) oraz **projektowanie strumienia wartości** (projektowanie stanu przyszłego) [3][4]. Razem tworzą metodę strumienia wartości. Niemiecka organizacja inżynierii przemysłowej REFA definiuje analizę w podobny sposób, jako metodę pokazywania wszystkich procesów i przepływów procesu wartości dodanej [37].

Od marca 2020 roku istnieje międzynarodowa norma, **ISO 22468:2020 „Value stream management (VSM)”**. ISO opisuje ją jako wytyczne do zbierania, oceny i ciągłego doskonalenia danych strumienia wartości oraz do oceny strumieni wartości za pomocą zdefiniowanych KPI, mających zastosowanie do procesów związanych z materiałami, energią i danymi [40]. Spis treści (opublikowany przez DIN, niemiecką jednostkę normalizacyjną) strukturyzuje zarządzanie strumieniem wartości na: procedurę podstawową, analizę strumienia wartości, projektowanie strumienia wartości, planowanie strumienia wartości oraz ocenę i korekty strumieni wartości, z informacyjnym załącznikiem o boksach danych i przykładach zastosowań [40]. ISO potwierdziło aktualność normy w przeglądzie z 2025 roku [40]. To przydatne odniesienie, jeśli chcesz osadzić tę metodę w firmowym systemie produkcyjnym.

### Czym VSM różni się od pokrewnych metod

| Metoda | Obszar zainteresowania | Różnica względem mapowania strumienia wartości |
|---|---|---|
| Mapowanie procesów / diagram przepływu | pojedyncze procedury, często w jednym dziale | brak przepływu informacji, zapasów i osi czasu |
| Analiza przepływu materiałów | trasy transportu, ilości, układ | analizuje logistykę, a nie to, jak informacja steruje przepływem |
| Analiza wartości / inżynieria wartości (w Niemczech: VDI 2800) | funkcje i koszt produktu | dotyczy produktu, a nie przepływu |
| Łańcuch wartości Portera | strategiczne działania firmy | model zarządczy, a nie operacyjny diagram przepływu; angielska Wikipedia opisuje to rozróżnienie tak samo [49] |
| Diagram swimlane / BPMN | procesy biznesowe z przypisaniem odpowiedzialności | mocny w biurze, słabszy w zakresie zapasów i taktu |
| Symulacja | zależne od czasu zachowanie systemu | dynamiczna i szczegółowa, lecz wymagająca większego nakładu; uzupełnia VSM (zob. punkt 11) |

To, co odróżnia mapowanie strumienia wartości, to połączenie trzech elementów na jednej stronie: przepływu materiału, przepływu informacji i osi czasu. Wprowadzenie do *Learning to See* wyjaśnia, że Toyota uczy trzech przepływów w produkcji (materiału, informacji oraz ludzi/procesu), a metoda mapowania obejmuje dwa pierwsze, dzięki czemu producenci "myślą o przepływie zamiast o dyskretnych procesach produkcyjnych" [1].

## 2. Historia: od diagramu przepływu materiału i informacji Toyoty do "Learning to See"

Mapowanie strumienia wartości wywodzi się z Toyota Production System. W Toyocie narzędzie nazywa się "Material and Information Flow Mapping" (mapowanie przepływu materiału i informacji). Praktycy Toyoty używali go do przedstawiania stanów bieżących i docelowych podczas planowania wdrożeń Lean, a nie jako narzędzia szkoleniowego [1]. Sama fraza "value stream" w Toyocie rzadko się słyszy [1]. Słownik LEI również opisuje to narzędzie jako rozwiązanie opracowane przez Toyotę, które Toyota nazywa diagramem przepływu materiału i informacji [45].

Mike Rother zauważył tę metodę mapowania, studiując praktyki wdrażania Lean w Toyocie, sformalizował ją i zbudował wokół niej metodę szkoleniową [1]. Wraz z Johnem Shookiem, który spędził jedenaście lat w Toyocie w Japonii i w USA [1], opublikował w 1998 roku z wydawnictwem LEI podręcznik **"Learning to See"** (wprowadzenie jest podpisane w Ann Arbor w stanie Michigan i datowane na maj 1998; podtytuł pierwszego wydania brzmiał "Value Stream Mapping to Create Value and Eliminate Muda", obecny to "… to Add Value and Eliminate Muda") [1]. Książka otrzymała w 1999 roku nagrodę Shingo Research and Professional Publication Award [1]. Jej studium przypadku fikcyjnej tłoczni "Acme Stamping" prowadzi czytelnika od stanu bieżącego, przez poszukiwanie marnotrawstwa, do stanu docelowego [1]. Obecne wydanie LEI pochodzi z 2018 roku (ISBN 978-0-9667843-0-5, 148 stron) [1].

W krajach niemieckojęzycznych na upowszechnienie metody wpłynęły trzy książki, z których jedna ukazała się później po angielsku:

- **Rother/Shook: "Sehen lernen"**, niemieckie wydanie podręcznika LEI, wydane przez Lean Management Institut w Aachen (wersja 1.1, 2004, ISBN 978-3-9809521-1-8) [2].
- **Klaus Erlach: "Wertstromdesign. Der Weg zur schlanken Fabrik"** (Springer; wyd. 1, 2007, wyd. 2, 2010, ISBN 978-3-540-89867-2; wyd. 3, 2020, ISBN 978-3-662-58906-9) [3]. Erlach systematyzuje metodę na potrzeby planowania fabryk. Angielskie wydanie, **"Value Stream Design: The Way Towards a Lean Factory"**, ukazało się nakładem Springera w 2012 roku (prawa autorskie 2013, ISBN 978-3-642-12568-3) [4].
- **Thomas Klevers: "Wertstrom-Mapping und Wertstrom-Design"** (mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9) [5].

Metodę przeniesiono później na pracę biurową i pracę wiedzy, najgłośniej dzięki Karen Martin i Mike'owi Osterlingowi w książce "Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation" (McGraw-Hill, wydana w październiku 2013, prawa autorskie 2014, ISBN 978-0-07-182891-8) [6].

W USA metoda jest częścią standardowego zestawu narzędzi Lean nauczanego przez LEI, ASQ oraz NIST Manufacturing Extension Partnership (MEP). NIST MEP nazywa VSM "często pierwszym krokiem w stosowaniu usprawnień procesów metodą lean" [47]. W Niemczech jest ona częścią tzw. holistycznych systemów produkcji, których podstawy opisuje wytyczna **VDI 2870 Część 1** (lipiec 2012) Stowarzyszenia Inżynierów Niemieckich (VDI). Według VDI wytyczna jest częściowo nadal obowiązująca i jest w trakcie rewizji [7].

## 3. Cele i korzyści mapowania strumienia wartości

Nadrzędnym celem jest przepływ zorientowany na klienta: materiał powinien przemieszczać się przez zakład z możliwie najmniejszym czasem oczekiwania, a każdy proces powinien wytwarzać wyłącznie to, czego rzeczywiście potrzebuje następny proces. Prowadzi to do konkretnych celów:

- **Skrócenie czasu realizacji.** Oś czasu pokazuje, jaka część całkowitego czasu realizacji to oczekiwanie. Ponieważ zapasy zwykle stanowią największą część czasu realizacji, ich redukcja jest najsilniejszą dźwignią.
- **Uwidocznienie marnotrawstwa.** Nadprodukcja, zapasy, oczekiwanie i zbędny transport są bezpośrednio widoczne na mapie.
- **Uproszczenie harmonogramowania.** Mapa pokazuje, do ilu punktów system ERP wysyła zlecenia. Celem jest planowanie w jednym punkcie, tam gdzie jest to możliwe.
- **Stworzenie wspólnego języka.** Produkcja, logistyka, planowanie i sprzedaż omawiają ten sam przepływ na tej samej stronie.
- **Ustalanie priorytetów usprawnień.** Zamiast optymalizacji lokalnej otrzymujesz plan wdrożenia ukierunkowany na cały przepływ.

### Kiedy mapowanie strumienia wartości się opłaca?

Metoda najlepiej sprawdza się w produkcji powtarzalnej i mieszanej o cyklicznych produktach, wysokich zapasach i długich terminach dostaw, przed zmianami układu, nowymi projektami zakładów czy inwestycjami w moce produkcyjne, gdy terminowość dostaw jest słaba mimo wysokiego wykorzystania zdolności, a także jako punkt wyjścia do programu Lean. Klasyczna forma słabiej pasuje do czystej produkcji jednostkowej (job shop) lub produkcji na zamówienie inżynierskie ze zmiennymi trasami przepływu, ponieważ stabilnej rodziny produktów trudno tam zdefiniować. W takich przypadkach pomagają rozszerzone podejścia, takie jak symulacja lub analiza oparta na danych (zob. rozdział 11). Mali i średni producenci z USA, którzy chcą skorzystać z zewnętrznego wsparcia, mogą zwrócić się do centrów NIST MEP, które wśród metod Lean, których wdrażaniu pomagają, wymieniają mapowanie strumienia wartości [47].

### Zalety i wady w skrócie

| Zalety | Wady |
|---|---|
| kompleksowy obraz przepływu z perspektywy klienta | obraz migawkowy oparty na średnich |
| proste, standardowe symbole | niewielka szczegółowość dotycząca wariantów i sekwencji przezbrojeń |
| niski próg wejścia: papier, ołówek, stoper | ręczne zbieranie danych jest czasochłonne i szybko się dezaktualizuje |
| wyniki ilościowe (czas realizacji, wskaźnik przepływu) | zmienność, awarie i efekty wielkości partii nie są pokazane |
| łączy przepływ materiałów z przepływem informacji | stanów przyszłych nie można testować na papierze |
| mocna podstawa do działań usprawniających i komunikacji | efekt zależy od zdyscyplinowanego wdrożenia |

Prawa kolumna wyjaśnia, dlaczego od ponad dziesięciu lat badania i przemysł rozwijają tę metodę w kierunku dynamicznym i cyfrowym [16][23]. Więcej na ten temat od rozdziału 10.

## 4. Symbole mapowania strumienia wartości: kompletna tabela referencyjna

Symbole pochodzą z książki *Learning to See* [1][2] i są celowo proste, aby każdy mógł je narysować ołówkiem. Książki i biblioteki programowe różnią się nieco. Ważne jest, aby zespół uzgodnił legendę i konsekwentnie jej używał. Poniższe tabele opisują popularne symbole, tak jak są stosowane przez Rothera/Shooka i Erlacha [1][3].

### Symbole przepływu procesu i materiału

| Symbol (wygląd) | Nazwa | Znaczenie i zastosowanie |
|---|---|---|
| budynek fabryczny z dachem piłokształtnym | klient / dostawca (źródło zewnętrzne) | klient w prawym górnym rogu, dostawca w lewym górnym rogu; poniżej pole danych z popytem, częstotliwością dostaw i opakowaniem |
| prostokąt z linią nagłówka i nazwą procesu | pole procesu | jeden proces, przez który materiał przepływa w sposób ciągły; nowe pole zaczyna się tam, gdzie przepływ się zatrzymuje i narasta zapas |
| prostokąt pod polem procesu | pole danych | dane procesu: czas cyklu, czas przezbrojenia, czas pracy/dostępność, wielkość partii, liczba operatorów, zmiany, braki |
| trójkąt z literą „I” | zapas | materiał znajdujący się między dwoma procesami; ilość i zapas w dniach są zapisane pod nim |
| szeroka strzałka w paski | strzałka wypychania | materiał jest wypychany przez proces wcześniejszy zgodnie z jego własnym harmonogramem, a nie zgodnie z potrzebami następnego procesu |
| szeroka strzałka pusta w środku | dostawa | surowiec od dostawcy do zakładu lub wyroby gotowe z zakładu do klienta |
| ciężarówka (lub pociąg, samolot, statek) | dostawa zewnętrzna | środek transportu z częstotliwością dostaw, np. „2× w tygodniu” |
| regał otwarty z lewej strony | supermarket | kontrolowany zapas buforowy, z którego pobiera proces klienta; proces dostawcy uzupełnia wyłącznie to, co zostało pobrane |
| strzałka w kształcie okręgu | pobranie (ciągnięcie) | fizyczne pobranie z supermarketu przez proces następny |
| strzałka z napisem „FIFO” i maksymalną ilością | linia FIFO | ograniczona kolejka między dwoma procesami; części idą w kolejności przybycia, a proces dostawcy zatrzymuje się po osiągnięciu maksimum |
| trójkąt z adnotacją o bezpieczeństwie | zapas bezpieczeństwa lub buforowy | zapas na wypadek wahań popytu (bufor) lub awarii procesów (zabezpieczenie) |
| okrąg z głową operatora | operator | liczba osób przy procesie |

### Symbole przepływu informacji

| Symbol (wygląd) | Nazwa | Znaczenie i zastosowanie |
|---|---|---|
| cienka prosta strzałka | ręczny przepływ informacji | informacja na papierze lub ustnie, np. karta trasy, dowód dostawy, polecenie ustne |
| strzałka w kształcie błyskawicy (zygzak) | elektroniczny przepływ informacji | komunikaty EDI, ERP lub MES, poczta elektroniczna |
| prostokąt „Production Control” | sterowanie produkcją | planowanie, MRP lub ERP, często z częstotliwością planowania |
| karta z przyciętym rogiem, pełna | kanban produkcyjny | sygnał dla procesu do wytworzenia określonej ilości |
| karta z przyciętym rogiem, z kreskowaniem lub innym oznaczeniem zależnie od biblioteki | kanban pobrania | polecenie dla operatora transportu wewnętrznego, by pobrał części z supermarketu |
| trójkąt stojący na czubku | kanban sygnałowy | uruchamia partię, gdy zapas w supermarkecie osiągnie punkt ponownego zamówienia; typowe dla procesów z przezbrojeniami |
| symbol przypominający skrzynkę pocztową | punkt kanban | miejsce, w którym zbiera się kanbany do odbioru |
| przerywana strzałka z kanbanem | ścieżka kanban | trasa kart z powrotem do procesu dostawcy |
| pudełko z siatką gniazd „OXOX” | pudełko heijunka (pudełko wyrównywania obciążenia) | narzędzie do wyrównywania wolumenu i asortymentu na procesie prowadzącym |
| okulary | harmonogramowanie przez kontrolę wzrokową | harmonogramowanie przez wizualną kontrolę zamiast systematycznych sygnałów; znak, że potrzebne jest doskonalenie |

### Symbole ogólne

| Symbol (wygląd) | Nazwa | Znaczenie i zastosowanie |
|---|---|---|
| poszarpany wybuch („kaizen burst”) | potrzeba doskonalenia | oznacza miejsce na mapie stanu obecnego lub przyszłego, w którym potrzebne jest doskonalenie |
| fala kwadratowa wzdłuż dołu | oś czasu (drabinka czasu przejścia) | czasy oczekiwania (dni zapasu) na jednym poziomie, czasy przetwarzania na drugim; sumy czasu przejścia i czasu przetwarzania po prawej stronie |

Niektóre poradniki internetowe opisują przerywaną strzałkę jako elektroniczny przepływ informacji [38]. W *Learning to See* strzałka w kształcie błyskawicy oznacza informację elektroniczną, a cienka prosta strzałka informację ręczną [1]. Trzymajcie się tej konwencji, aby mapy były czytelne w różnych zakładach i narzędziach programowych. Ilustrowany przewodnik po symbolach znajduje się we wpisie [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/).

W procesach biurowych, na przykład w obsłudze zamówień przed produkcją, Polaris BSM dodaje do symboli mapowania strumienia wartości tory pływackie BPMN [30]. Badania podjęły tę samą ideę: podejście Value Stream Mapping 4.0 z TU Darmstadt wyraźnie obejmuje wszystkie działy obsługi zamówień, począwszy od pierwszego kontaktu z klientem [14].

## 5. Jak stworzyć mapę strumienia wartości: przewodnik krok po kroku dla stanu obecnego

Poniższy przewodnik opiera się na logice Rothera/Shooka oraz Erlacha [1][3] i dodaje praktyczne szczegóły. Przy pierwszej mapie w miarę przejrzystego strumienia wartości zaplanuj jeden do dwóch dni z małym zespołem [unverified: brak potwierdzonych danych o czasie trwania]. Zalecenia dotyczące wielkości zespołu się różnią: ASQ uważa za idealne około 10 członków i sugeruje trzydniowe wydarzenie kaizen na rozpoczęcie [46], natomiast niemiecki poradnik praktyczny Mind Logistik preferuje mały zespół liczący do sześciu osób [42]. Obie są zaleceniami praktycznymi, a nie wynikami badań. Wybierz mniejszy zespół, jeśli strumień wartości jest krótki, a większy, jeśli w procesie uczestniczy wiele działów.

> **Jeśli prowadzisz warsztat po raz pierwszy: sprawdzony plan**
>
> - **Zespół:** osoby z produkcji (brygadzista lub kierownik zmiany), logistyki, planowania produkcji, utrzymania ruchu i jakości; w razie problemu z czasem dostawy dołącz sprzedaż lub obsługę zamówień. Uczestniczy przyszły właściciel strumienia wartości.
> - **Materiały:** papier 11 × 17 cali lub rolka brązowego papieru, ołówek i gumka, podkładka, stoper, arkusz do spisu zapasów oraz wcześniej uzgodniona legenda symboli.
> - **Wyjaśnij z wyprzedzeniem:** rodzinę produktów, popyt klientów z ostatnich miesięcy, system zmian i przerwy. Zapowiedz obchód w zainteresowanych obszarach i wyjaśnij, że oceniane są procesy, a nie ludzie.
> - **Dzień 1:** wprowadzenie do celu i symboli (około godziny), przejście przepływu wstecz od wysyłki w parach, połączenie danych w jedną mapę, obliczenie wskaźników.
> - **Dzień 2 lub kolejne spotkanie:** weryfikacja mapy z obszarami, dodanie kaizen bursts, przepracowanie pytań o stan przyszły (sekcja 8), rozpoczęcie planu wdrożenia z przypisanymi odpowiedzialnymi.
>
> Czas trwania i skład zespołu to wartości wynikające z doświadczenia i zależą od wielkości strumienia wartości [unverified: brak źródła dla tych wartości].

### Krok 1: Określ cel i zakres

Przed pierwszym obchodem zdecyduj, na jakie pytanie ma odpowiadać mapa. Przykłady: Dlaczego nasz czas dostawy wynosi 15 dni, skoro klient oczekuje 5? Ile powierzchni produkcyjnej zyskamy, redukując zapasy? Wyznacz granice. Zwykły zakres to „od bramy do bramy” (door to door), od przyjęcia do wysyłki w obrębie jednego zakładu [1]. Strumień wartości obejmujący kilka zakładów lub dostawców (rozszerzony strumień wartości) to drugi etap, a nie pierwszy.

Wyznacz też właściciela. Rother i Shook zalecają powierzyć odpowiedzialność za strumień wartości jednej osobie, menedżerowi strumienia wartości, zamiast dzielić ją między działy. LEI definiuje tę rolę jako „osobę wyznaczoną z jasną odpowiedzialnością za sukces strumienia wartości” [10]. Więcej w sekcji 13.

### Krok 2: Określ rodzinę produktów

Rodzina produktów to grupa produktów, które przechodzą podobne etapy obróbki na wspólnym wyposażeniu. Narzędziem jest **macierz produkt-proces**: produkty lub warianty w wierszach, procesy w kolumnach. Produkty, które w większości mają te same zaznaczenia, tworzą rodzinę. ASQ sugeruje szukanie produktów, które wspólnie mają około 80% etapów [46]. Jako zasada praktyczna zakres pracy produktów w jednej rodzinie nie powinien się znacząco różnić [unverified: brak potwierdzonego źródła]. Niemieckojęzyczna Wikipedia podkreśla, że strumienie wartości tworzy się wzdłuż łańcuchów procesów lub przepływów materiałów, a podział według funkcji jest nietypowy, ponieważ działa przeciwko krótkim czasom realizacji [27].

Do pierwszej mapy wybierz rodzinę o dużym udziale w przychodach lub z palącym problemem. Pomocna jest analiza Pareto (ABC) według wolumenu i przychodów.

### Krok 3: Zmierz popyt klienta

Zacznij mapę od symbolu klienta w prawym górnym rogu. W polu danych zapisz popyt (np. sztuki miesięcznie), mix wariantów, wielkość partii lub opakowania, częstotliwość dostaw i wymagany czas dostawy. Z popytu i dostępnego czasu pracy oblicz **takt time** (wzór w sekcji 6). Takt time jest punktem odniesienia dla każdej innej oceny.

### Krok 4: Przejdź proces w gemba, wstecz od wysyłki

Przechodź przepływ pod prąd, od wysyłki do przyjęcia. Rother i Shook wyjaśniają, że w ten sposób zaczynasz od procesów najbliższych klienta, które powinny wyznaczać tempo [1]. Niemieckojęzyczna Wikipedia również opisuje zapis wstecz, od klienta przez producenta do dostawcy [27].

Narysuj ramkę procesu dla każdej sekcji, w której materiał płynie w sposób ciągły. Tam, gdzie materiał leży, ramka procesu się kończy, a zaczyna się trójkąt zapasu. Korzystaj z własnych obserwacji i stopera, a nie z danych ERP. System ERP zna czasy standardowe z marszrut, a nie to, co faktycznie dzieje się na stanowisku pracy.

### Krok 5: Wypełnij pola danych

Zapisz co najmniej następujące dane dla każdego procesu:

| Pole danych | Skrót | Wyjaśnienie |
|---|---|---|
| Czas cyklu | C/T | czas między dwiema dobrymi sztukami na wyjściu z procesu |
| Czas przetwarzania (czas wartości dodanej) | P/T, VA | czas, w którym praca faktycznie dodaje wartość do detalu |
| Czas przezbrojenia | C/O | czas od ostatniej dobrej sztuki starej partii do pierwszej dobrej sztuki nowej partii |
| Czas pracy / dostępność | | udział zaplanowanego czasu, w którym urządzenie faktycznie może produkować; zdecyduj, czy przezbrojenia są wliczane, czy rejestrowane osobno |
| Wielkość partii / EPEI | | liczba sztuk w partii lub „every part every interval”: jak często produkowany jest każdy wariant |
| Operatorzy | | liczba osób na zmianę |
| Zmiany | | liczba zmian i dostępny czas na zmianę po przerwach |
| Braki / poprawki | | udział wadliwych sztuk |

W przypadku procesów z kilkoma maszynami pracującymi równolegle podaj liczbę maszyn i oblicz efektywny czas cyklu procesu (czas cyklu na jedną maszynę podzielony przez liczbę maszyn).

### Krok 6: Policz zapasy

Licz zapasy na hali produkcyjnej, a nie w systemie. Zapisz ilość pod każdym trójkątem zapasu i przelicz ją na **dni zapasu**, używając dziennego popytu. Policz także zapasy, które „się nie liczą”: detale w strefach oczekiwania, na wózkach, w kącikach poprawek. Tam często ukrywa się większość czasu oczekiwania.

### Krok 7: Dodaj zewnętrzne przepływy materiałów

W lewym górnym rogu narysuj głównego dostawcę (lub dostawców najważniejszych surowców) i połącz dostawcę, przyjęcie towaru, wysyłkę i klienta symbolami ciężarówek oraz częstotliwościami dostaw.

### Krok 8: Narysuj przepływ informacji

Przepływ informacji to część, którą zespoły najczęściej zaniedbują, mimo że wyjaśnia, dlaczego materiał leży. Pytaj na każdym procesie: skąd ten proces wie, co wyprodukować następnie? Typowe odpowiedzi to tygodniowy harmonogram z systemu ERP, dzienna lista od brygadzisty, kanban, okrzyk przez korytarz albo „co akurat jest”. Narysuj kontrolę produkcji na górze, po środku, połącz klienta i dostawcę strzałkami elektronicznymi lub ręcznymi i pokaż, które informacje docierają do każdego procesu. Tam, gdzie proces otrzymuje kilka sygnałów lub harmonogramów przez obserwację, dodaj okulary oznaczające harmonogramowanie typu go-see.

Następnie oznacz przepływy materiałów między procesami jako push (strzałka w paski), FIFO lub pull (supermarket i pobranie).

### Krok 9: Narysuj oś czasu i oblicz wskaźniki

Oś czasu umieść pod procesami. Na jednym poziomie wpisz dni zapasu, na drugim czasy przetwarzania procesów. Po prawej dodaj oba składniki, aby uzyskać **lead time** i **czas przetwarzania**, i oblicz **współczynnik przepływu** (flow ratio). W rozgałęzionych strumieniach wartości o czasie realizacji decyduje najdłuższa ścieżka [41].

### Krok 10: Oznacz marnotrawstwo i zweryfikuj

Zaznacz problemy kaizen burstami: procesy z czasami cyklu powyżej taktu, wysokie zapasy, długie przezbrojenia, niską dostępność, wiele punktów harmonogramowania. Przejrzyj gotową mapę z pracownikami z dotkniętych obszarów. Weryfikacja przez ludzi z hali chroni zespół warsztatowy przed narysowaniem strumienia wartości, który nie istnieje w zakładzie.

### Lista kontrolna stanu obecnego

- [ ] Zdefiniowano cel, zakres i właściciela strumienia wartości
- [ ] Zdefiniowano rodzinę produktów za pomocą macierzy produkt-proces
- [ ] Ustalono popyt klienta, warianty i takt time
- [ ] Zarejestrowano wszystkie procesy na hali, w kierunku do przodu i wstecz
- [ ] Wypełniono pola danych zmierzonymi wartościami
- [ ] Policzono zapasy i przeliczono je na dni
- [ ] Narysowano dostawców, klienta i transport
- [ ] Wyjaśniono przepływ informacji dla każdego procesu
- [ ] Obliczono oś czasu, lead time, czas przetwarzania i współczynnik przepływu
- [ ] Dodano kaizen busty i zweryfikowano mapę z pracownikami

## 6. Wzory i metryki mapowania strumienia wartości

Metryki sprawiają, że mapy strumienia wartości można ze sobą porównywać. W ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb, niemieckojęzyczne czasopismo z zakresu inżynierii produkcji wydawane przez De Gruyter) Jörg Drees i Christoph Sack pokazują, że metryki strumienia wartości, takie jak redukcja zapasów, wykorzystanie zasobów, zdolność dostaw i krótkie czasy realizacji, wydają się dążyć do sprzecznych celów, lecz przy poprawnym zastosowaniu dają spójne rekomendacje. Proponują podstawowy zestaw metryk, które wraz z ukierunkowanymi metodami Lean tworzą pętle sterowania [19]. Poniższe wzory obejmują ten podstawowy zestaw. Więcej definicji znajduje się na stronach encji [Lead Time](https://www.m365.fm/entity/lead-time/), [Cycle Time](https://www.m365.fm/entity/cycle-time/) i [Takt Time](https://www.m365.fm/entity/takt-time/).

**Uwaga terminologiczna.** Amerykańskie przewodniki stosują kilka nazw dla tego samego wskaźnika. To, co niemieckie teksty nazywają *Flussgrad*, w języku angielskim występuje jako flow ratio, process cycle efficiency (PCE), value-added ratio, flow efficiency lub, w terminologii Karen Martin, activity ratio („suma czasów procesów wszystkich pojedynczych kroków podzielona przez całkowity czas realizacji”) [44]. Niniejszy przewodnik konsekwentnie używa terminu **flow ratio**. Podobnie „inventory days”, „days of supply” i „days of inventory” oznaczają to samo.

### Takt time

> **Takt time = dostępny czas pracy w okresie ÷ popyt klienta w okresie**

LEI podaje przykład fabryki widgetów, która pracuje 480 minut dziennie, podczas gdy klienci zamawiają 240 widgetów dziennie, co daje takt time równy dwóch minutom [8]. ASQ stosuje ten sam wzór z 22 000 sekund i 200 sztukami, co daje 110 sekund na sztukę [46]. Dostępny czas pracy to czas zmiany pomniejszony o zaplanowane przerwy. Nieplanowane przestoje nie są odejmowane; należą do dostępności. Słowo „takt” pochodzi z języka niemieckiego (oznacza takt, rytm, jak w muzyce). Według LEI takt po raz pierwszy zastosowano jako narzędzie zarządzania produkcją w niemieckim przemyśle lotniczym w latach 30. XX wieku, a szeroko używany był w Toyocie w latach 50. [8].

### Cycle time i effective cycle time

Cycle time to czas między dwoma dobrymi sztukami na wyjściu procesu. Aby porównać go z takt time, należy uwzględnić dostępność i braki:

> **Effective cycle time = cycle time ÷ (dostępność × first-pass yield)**

Proces o cycle time wynoszącym 98 sekund i dostępności 85% efektywnie produkuje jedną sztukę co 115 sekund. Wobec takt time równego 117 sekund jest prawie w pełni obciążony, mimo że nominalny cycle time sugeruje 16% zapasu mocy.

Należy uważać na częsty błąd: niektóre angielskojęzyczne przewodniki używają terminu „cycle time” na określenie całkowitego czasu, jaki jednostka spędza w procesie, a nawet czasu dostawy od dostawcy. Na mapie strumienia wartości cycle time zawsze oznacza odstęp między dwoma dobrymi sztukami na wyjściu jednego procesu.

### Inventory days i prawo Little'a

> **Inventory days = zapas (sztuki) ÷ dzienny popyt (sztuki dziennie)**

Niemieckojęzyczna Wikipedia oblicza, że 280 sztuk przy dziennym popycie 80 sztuk to 3,5 dnia zapasu [27]. Ten rachunek stosuje **prawo Little'a**, które John D. C. Little udowodnił w 1961 roku w czasopiśmie Operations Research [12]:

> **L = λ × W**, po przekształceniu: **W = L ÷ λ**

L to średni zapas w systemie, λ – średnie tempo przepływu, a W – średni czas przebywania w systemie. Zastosowane do strumienia wartości: średni czas oczekiwania sztuki w buforze równa się zapasowi podzielonemu przez tempo zużycia. Prawo Little'a obowiązuje dla stabilnych systemów w długim okresie. Dla pojedynczych dni ze skokami popytu lub dla systemu w fazie rozruchu wzór jest tylko przybliżeniem. Jest to jeden z powodów, dla których istnieje dynamiczne mapowanie strumienia wartości (rozdział 11).

### Lead time

> **Production lead time = Σ inventory days + Σ czasy przetwarzania (wzdłuż najdłuższej ścieżki)**

Ponieważ czasy przetwarzania mierzy się zwykle w sekundach lub minutach, a zapasy w dniach, suma inventory days dominuje wynik. Praca dyplomowa na Hochschule Mittweida (niemieckiej uczelni zawodowej) przedstawia definicję czasu realizacji produkcji według Erlacha jako sumę czasów przetwarzania i czasów procesów oraz zakresów zapasów, przy czym decydująca jest najdłuższa ścieżka [41]. Glosariusz Martin ujmuje to ogólniej: lead time równa się czasowi procesu plus czasowi oczekiwania [44].

### Processing time i process time

**Czas przetwarzania** to czas, w którym część jest obrabiana. Erlach odróżnia także **czas procesu** dla operacji takich jak suszenie, utwardzanie czy obróbka cieplna, które trwają, ale nikt wtedy nie pracuje nad częścią [41]. Oba te czasy wliczają się do wskaźnika przepływu.

### Wskaźnik przepływu (process cycle efficiency)

> **Wskaźnik przepływu = (czas przetwarzania + czas procesu) ÷ czas przejścia × 100%**

Niemieckojęzyczna Wikipedia opisuje wskaźnik przepływu jako udział czystego czasu przetwarzania w całkowitym czasie przejścia i nazywa go kluczowym miernikiem analizy strumienia wartości [27]. Zwróć uwagę na podstawę czasową. Jeśli czas przejścia podano w dniach roboczych, przelicz go na sekundy, korzystając z dziennego czasu pracy, tak jak robi to czynnik „dziennego czasu pracy” we wzorze Erlacha [41]. Jeśli liczysz w dniach kalendarzowych, wskaźnik przepływu spadnie jeszcze bardziej. Wybierz jedną konwencję i trzymaj się jej, inaczej stan bieżący i przyszły nie będą porównywalne.

### Pozostałe wskaźniki

| Wskaźnik | Wzór / definicja | Zastosowanie |
|---|---|---|
| Obciążenie względem taktu | efektywny czas cyklu ÷ czas taktu | wartości powyżej 100% wskazują wąskie gardło |
| Potrzebna liczba operatorów | Σ zawartość pracy ÷ czas taktu | podstawa do równoważenia linii |
| EPEI | czas do wyprodukowania każdego wariantu co najmniej raz | pokazuje elastyczność i wpływ wielkości partii |
| Udział przezbrojeń | (liczba przezbrojeń × czas przezbrojenia) ÷ czas dostępny | pokazuje, ile zdolności produkcyjnej zostaje wolne na mniejsze partie |
| Obciążenie wraz z przezbrojeniami | (dzienne zapotrzebowanie × czas cyklu + przezbrojenia × czas przezbrojenia) ÷ (czas dostępny × dostępność) | sprawdza, czy przyszły stan z małymi partiami nadal może spełnić takt (przykład w rozdziale 7) |
| Terminowość dostaw | zamówienia dostarczone na czas ÷ wszystkie zamówienia | wskaźnik wyniku z perspektywy klienta |
| %C&A (percent complete and accurate) | udział pracy, którą kolejny etap otrzymuje kompletną i bezbłędną | jakość przekazań; stosowany głównie w strumieniach wartości w biurze [44] |
| OEE | dostępność × wydajność × jakość | efektywność urządzeń; w polu danych często skracany do uptime |

Wykres bilansu operatorów (słupkowy wykres efektywnych czasów cyklu z poziomą linią czasu taktu) pozwala od razu zobaczyć wąskie gardła i nadwyżki mocy. Erlach używa go, aby pokazać, jak dobrze zdolności produkcyjne są dopasowane do taktu [3]. Niemieckojęzyczna Wikipedia zauważa, że czasy cyklu zbliżone do taktu wskazują na wąskie gardła, a czasy cyklu wyraźnie krótsze od taktu wskazują na nadwyżkę mocy i marnotrawstwo [27].

## 7. Przykład mapowania strumienia wartości: jeden strumień wartości w pełnym obliczeniu

Poniższy przykład jest **fikcyjny i przygotowany na potrzeby tego przewodnika**. Pokazuje, jak wskaźniki są ze sobą powiązane, oraz pozwala przeprowadzić stan obecny i przyszły na tych samych danych wyjściowych.

### Punkt wyjścia

Dostawca produkuje rodzinę produktów – obudowy zaworów hydraulicznych w pięciu wariantach o tym samym przebiegu procesu: cięcie, toczenie, frezowanie, mycie, montaż. Klient zamawia średnio 9 200 sztuk miesięcznie, rozłożonych na 20 dni roboczych. Zakład pracuje na dwie zmiany po 8 godzin, każda z 30-minutową przerwą.

**Krok A: obliczenie czasu taktu**

- Dzienne zapotrzebowanie: 9 200 sztuk ÷ 20 dni = **460 sztuk dziennie**
- Dostępny czas pracy: 2 × (480 min − 30 min) = 900 min = **54 000 s dziennie**
- Czas taktu: 54 000 s ÷ 460 sztuk = **117,4 s na sztukę**

### Stan obecny: dane procesów

| Proces | Czas cyklu | Czas przezbrojenia | Dostępność | Efektywny czas cyklu | Obciążenie w stosunku do taktu |
|---|---|---|---|---|---|
| Cięcie | 45 s | 30 min | 95% | 47,4 s | 40% |
| Toczenie | 98 s | 60 min | 85% | 115,3 s | 98% |
| Frezowanie | 125 s | 45 min | 90% | 138,9 s | **118%** |
| Mycie | 40 s | 0 min | 98% | 40,8 s | 35% |
| Montaż | 105 s | 15 min | 95% | 110,5 s | 94% |

Uproszczenia: czas obróbki jest tutaj równy czasowi cyklu, ponieważ każdy proces obrabia jedną część po drugiej. Braki produkcyjne są pominięte. Dostępność uwzględnia wyłącznie awarie; przezbrojenia traktowane są osobno.

**Wniosek o wąskim gardle:** Frezowanie przekracza takt już przy nominalnym czasie 125 s, a przy efektywnym 138,9 s – o 18%. W ciągu jednego dnia frezowanie wykonuje 54 000 s × 0,90 ÷ 125 s = **389 sztuk** zamiast potrzebnych 460. Przezbrojenia zmniejszają tę liczbę jeszcze bardziej. Zakład zamyka lukę dzięki nadgodzinom w soboty. Toczenie na papierze nie wydaje się krytyczne (98 s), ale po uwzględnieniu dostępności jest obciążone w 98%. Jeśli zignorujesz dostępność, przeoczysz to drugie prawie wąskie gardło.

### Stan obecny: zapasy i oś czasu

| Zapas | Ilość | Dni zapasu (ilość ÷ 460) |
|---|---|---|
| Surowiec przed cięciem | 4 600 sztuk | 10,0 dni |
| Po cięciu | 1 380 sztuk | 3,0 dni |
| Po toczeniu | 920 sztuk | 2,0 dni |
| Po frezowaniu | 690 sztuk | 1,5 dnia |
| Po myciu | 460 sztuk | 1,0 dzień |
| Wyroby gotowe | 1 150 sztuk | 2,5 dnia |
| **Razem** | **9 200 sztuk** | **20,0 dni** |

- **Czas obróbki:** 45 + 98 + 125 + 40 + 105 = **413 s** (nieco poniżej 7 minut)
- **Czas realizacji:** 20,0 dni roboczych + 413 s ≈ **20 dni roboczych**
- **Wskaźnik przepływu (oparty na czasie pracy):** 413 s ÷ (20 × 54 000 s) = 413 ÷ 1 080 000 = **0,038%**
- **Wskaźnik przepływu (oparty na czasie kalendarzowym):** 20 dni roboczych odpowiada około 28 dniom kalendarzowym; 413 s ÷ (28 × 86 400 s) = **0,017%**

**Sprawdzenie poprawności prawem Little'a:** łączny zapas 9 200 sztuk ÷ przepustowość 460 sztuk dziennie = 20 dni [12]. Suma dni zapasu poszczególnych etapów i wynik ogólnego obliczenia są zgodne. Jeśli to sprawdzenie nie wychodzi na Twojej mapie, oznacza to, że pominięto zapas albo pomieszano wartości referencyjne.

**Wniosek dotyczący przepływu informacji:** Planowanie produkcji wysyła tygodniowy harmonogram do wszystkich pięciu procesów. Każdy proces produkuje według własnego harmonogramu i przesuwa materiał dalej. Między procesami nie ma żadnego ograniczenia ilościowego, więc zapasy piętrzą się przed wąskim gardłem. Kierownik montażu codziennie interweniuje ze zleceniami pilnymi (planowanie oparte na bezpośrednim nadzorze, go-see scheduling).

### Stan przyszły: działania usprawniające

Korzystając z wytycznych projektowych z rozdziału 8, zespół projektuje następujący stan przyszły:

1. **Usunięcie wąskiego gardła przy frezowaniu:** ulepszenia narzędzi i uchwytów skracają czas cyklu z 125 do 95 s; inicjatywa TPM (total productive maintenance, produktywne utrzymanie ruchu z udziałem operatorów) podnosi dostępność z 90 do 95%.
2. **Stabilizacja toczenia:** optymalizacja programu skraca czas cyklu z 98 do 90 s; TPM podnosi dostępność z 85 do 92%.
3. **Wyrównanie montażu:** zakres pracy zostaje przerozdzielony, a czas cyklu spada z 105 do 95 s.
4. **Skrócenie czasów przezbrojeń (SMED):** ponieważ każdy wariant będzie wytwarzany każdego dnia, każdy proces wymaga pięciu przezbrojeń dziennie. SMED (single-minute exchange of die: przygotowanie przezbrojenia podczas pracy maszyny) skraca czas przezbrojenia przy toczeniu z 60 do 10 min, przy frezowaniu z 45 do 10 min, a przy montażu z 15 do 5 min. Bez tego kroku stan przyszły byłby niewykonalny: pięć przezbrojeń po 60 minut nie mieści się w wolnej zdolności toczenia.
5. **Połączenia FIFO:** toczenie, frezowanie, mycie i montaż łączą trzy linie FIFO o maksymalnych ilościach 60, 30 i 30 sztuk.
6. **Supermarket za cięciem:** ponieważ cięcie jest znacznie szybsze i wymaga przezbrojeń, supermarket z zapasem półdniowym (230 sztuk) oddziela je od reszty procesu. Sygnałowy kanban uruchamia nowe partie.
7. **Montaż jako pacemaker:** planowanie wysyła zamówienia klientów wyłącznie do montażu. Skrzynka heijunka rozkłada pięć wariantów równomiernie w ciągu dnia. Przy wielkości opakowania 20 sztuk takt wynosi 20 × 117,4 s ≈ 39 minut.
8. **Supermarket wyrobów gotowych:** jednodniowy zapas (460 sztuk) buforuje wahania zamówień odbiorców.
9. **Powiązanie z dostawcami:** dostawy surowca wzrastają z jednej do dwóch w tygodniu; zapas surowca spada do pięciu dni (2300 sztuk).

### Stan przyszły: kontrola zdolności z uwzględnieniem przezbrojeń

Stan przyszły musi spełniać takt nawet przy codziennych przezbrojeniach. Kontrola oblicza zatem dwie wartości: efektywny czas cyklu w porównaniu z taktem oraz obciążenie z uwzględnieniem przezbrojeń.

> **Obciążenie z uwzględnieniem przezbrojeń = (dzienne zapotrzebowanie × czas cyklu + liczba przezbrojeń × czas przezbrojenia) ÷ (dostępny czas × dostępność)**

| Proces | Czas cyklu | Czas przezbrojenia | Dostępność | Efektywny czas cyklu | Obciążenie vs. takt | Obciążenie wraz z 5 przezbrojeniami |
|---|---|---|---|---|---|---|
| Cięcie | 45 s | 30 min | 95% | 47,4 s | 40% | 58% |
| Toczenie | 90 s | 10 min | 92% | 97,8 s | 83% | 89% |
| Frezowanie | 95 s | 10 min | 95% | 100,0 s | 85% | **91%** |
| Mycie | 40 s | 0 min | 98% | 40,8 s | 35% | 35% |
| Montaż | 95 s | 5 min | 95% | 100,0 s | 85% | 88% |

Przykład dla frezowania: (460 × 95 s + 5 × 600 s) ÷ (54 000 s × 0,95) = 46 700 ÷ 51 300 = 91%. Wszystkie procesy pozostają poniżej 100%, przy czym najwyższa wartość występuje przy frezowaniu. Pacemaker, montaż, ma pewną rezerwę na wahania zamówień, na poziomie 88%.

### Stan przyszły: wynik

| Wskaźnik | Obecnie | Przyszłość | Zmiana |
|---|---|---|---|
| Łączne zapasy | 9200 sztuk | 2300 + 230 + 120 + 460 = 3110 sztuk | −66% |
| Czas realizacji (Little) | 20,0 dni roboczych | 3110 ÷ 460 = 6,8 dnia roboczego | −66% |
| Czas przetwarzania | 413 s | 45 + 90 + 95 + 40 + 95 = 365 s | −12% |
| Wskaźnik przepływu (oparty na czasie pracy) | 0,038% | 365 ÷ (6,76 × 54 000) = 0,100% | czynnik 2,6 |
| Wąskie gardło | frezowanie 118% (bez przezbrojeń) | najwyższe obciążenie frezowania 91% wraz z przezbrojeniami | takt spełniony bez zmian sobotnich |
| Punkty harmonogramowania | 5 (harmonogram tygodniowy dla wszystkich) | 1 (pacemaker: montaż) | prostsze planowanie |

Linie FIFO są liczone przy ich maksymalnych ilościach (60 + 30 + 30 = 120 sztuk). W praktyce rzadko są pełne, więc przyszły zapas stanowi ostrożną górną granicę.

Dwie wnioski z przykładu. Po pierwsze, działania w zakresie harmonogramowania i zapasów przynoszą większość skrócenia czasu realizacji, a nie szybsze maszyny. Czas przetwarzania spada o 12%, czas realizacji o 66%. Po drugie, nawet ulepszony wskaźnik przepływu wynoszący 0,1% pozostaje niski. Jest to typowe dla zakładów z buforem surowca. Liczy się kierunek oraz takt, który można niezawodnie osiągać nawet przy codziennych przezbrojeniach.

## 8. Mapa stanu przyszłego: wytyczne projektowe Rothera/Shooka i Erlacha

Projekt stanu przyszłego odpowiada na pytanie, jak ma przepływać strumień wartości. *Learning to See* prowadzi czytelnika od stanu obecnego do „mapy szczuplejszej przyszłości” oraz do planu strumienia wartości, który kieruje wdrażaniem i jest regularnie przeglądany [1].

### Kluczowe pytania dotyczące stanu przyszłego według Rothera/Shooka

Rother/Shook strukturyzują projekt za pomocą serii kluczowych pytań [1] (w parafrazie):

1. Jaki jest takt time?
2. Czy produkujemy do magazynu wyrobów gotowych, czy bezpośrednio do wysyłki?
3. Gdzie możemy zastosować ciągły przepływ?
4. Gdzie potrzebujemy systemów ciągnięcia z supermarketów?
5. W którym pojedynczym punkcie łańcucha produkcyjnego (procesie pacemaker) planujemy produkcję?
6. Jak wyrównać mix produkcyjny na procesie pacemaker?
7. Jaki przyrost pracy konsekwentnie zwalniamy i odbieramy na pacemakerze?
8. Jakie usprawnienia procesów są potrzebne, aby stan przyszły zadziałał?

### Wytyczne Rothera i Shooka

W artykule dla LEI's Lean Post (19 października 2022) Mike Rother i John Shook podsumowują wytyczne dla szczupłego strumienia wartości w następujący sposób [11]:

| Nr | Wytyczna (oryginalne brzmienie) | Co to oznacza |
|---|---|---|
| 1 | „Produkuj zgodnie z taktem” | dopasuj produkcję do popytu klienta |
| 2 | „Rozwijaj ciągły przepływ tam, gdzie to możliwe” | twórz przepływ jednej sztuki wszędzie tam, gdzie to możliwe |
| 3 | „Używaj supermarketów do sterowania produkcją tam, gdzie ciągły przepływ nie sięga w górę strumienia” | stosuj supermarkety tam, gdzie przepływ jest niemożliwy |
| 4 | „Staraj się przesyłać harmonogram klienta tylko do jednego procesu produkcyjnego” | przekazuj zamówienia klienta tylko do jednego procesu (pacemaker) |
| 5 | „Rozkładaj równomiernie produkcję różnych produktów w określonym czasie na procesie pacemaker” | wyrównuj mix produktów na pacemakerze (heijunka) |
| 6 | „Stwórz „wstępne ciągnięcie”, zwalniając i odbierając małe, stałe przyrosty pracy na procesie pacemaker” | wyrównuj wielkość produkcji |

Źródła wtórne wymieniają siódmą wytyczną z *Learning to See*: zdolność do wytwarzania każdej części każdego dnia w procesach znajdujących się w górze strumienia względem pacemakera („every part every day”), a później każdej zmiany lub każdej godziny [1] [unverified: nie sprawdzono względem tekstu książki]. Przykład z sekcji 7 pokazuje, dlaczego ta wytyczna wymaga krótkich czasów przezbrojenia.

### Wytyczne projektowe Erlacha

Klaus Erlach porządkuje projekt strumienia wartości w osiem wytycznych projektowych, które wzajemnie się uzupełniają [3]. Dzielą się na trzy grupy: projekt procesów produkcyjnych (wytyczne 1 i 2), sterowanie produkcją (3–5) oraz planowanie produkcji (6–8). Nazwy poniżej są zgodne z niemieckojęzyczną książką Erlacha i przeglądem na jego stronie internetowej; angielskie wydanie (Springer 2012/2013) jest opisywane przez wydawcę jako przedstawiające „dziesięć wytycznych projektowych” [4], więc numeracja w tekście angielskim może się różnić.

| Nr | Wytyczna projektowa [3] | Kluczowe pytanie dla Twojego strumienia wartości |
|---|---|---|
| 1 | Dostosowanie do taktu | Czy wszystkie procesy są zaprojektowane tak, by niezawodnie spełniać takt i gdzie występuje nadwyżka mocy produkcyjnych? |
| 2 | Integracja procesów | Które etapy procesu można połączyć fizycznie i organizacyjnie w ciągły przepływ? |
| 3 | Sprzężenie FIFO | Gdzie procesy mogą być połączone ograniczonymi torami FIFO zamiast nieograniczonych magazynów? |
| 4 | Sterowanie kanban | Gdzie potrzebny jest supermarket z kanbanem, ponieważ procesy mają różne czasy cyklu lub przezbrojenia? |
| 5 | Proces pacemaker | W którym pojedynczym procesie planowane są zamówienia klientów? |
| 6 | Definiowanie jednostki zwolnienia | W jakim przedziale czasu praca jest zwalniana na pacemakerze (pitch)? |
| 7 | Wyrównywanie mixu produkcyjnego | Jak równomiernie rozkładać warianty i gdzie sensowne jest budowanie kampanii? |
| 8 | Sterowanie wąskim gardłem | Jak kontrolować pozostałe wąskie gardło, aby nigdy nie pozostawało bez pracy? |

Kolejność odpowiada logice trzech grup: wyrównany mix produkcyjny (wytyczna 7) zakłada, że procesy są dopasowane do taktu i że sterowanie przez FIFO, kanban i pacemaker działa (wytyczne 1–5).

### Terminy stanu przyszłego w skrócie

- **Przepływ ciągły (one-piece flow):** detale przemieszczają się pojedynczo od procesu do procesu, bez magazynowania pośredniego.
- **Supermarket i kanban:** proces następny pobiera materiał, a proces dostawczy uzupełnia wyłącznie to, co zostało pobrane. Więcej na stronach hasłowych [Kanban](https://www.m365.fm/entity/kanban/) oraz [Pull System](https://www.m365.fm/entity/pull-system/).
- **Pas FIFO:** kolejka o maksymalnej ilości; gdy jest pełna, proces dostawczy się zatrzymuje. FIFO jest prostsze od kanbanu i nadaje się do detali o dużej różnorodności, których nie należy produkować na magazyn.
- **Proces taktujący (pacemaker):** jedyny proces, który otrzymuje zamówienia klientów. Procesy wcześniejsze są sterowane przez pull z supermarketu lub pasy FIFO; procesy późniejsze pracują w przepływie ciągłym lub FIFO.
- **Heijunka:** wyrównywanie wolumenu i asortymentu, na przykład przy użyciu pudełka heijunka z przegrodą na każdy przedział czasu.
- **Pitch / jednostka zwolnienia:** przedział czasu, w którym zwalniana jest praca i odbierane są wyroby gotowe: takt time × ilość w opakowaniu, w przykładzie z rozdziału 7 20 × 117,4 s ≈ 39 minut.
- **SMED i TPM:** SMED skraca czasy przezbrojeń, przygotowując czynności przezbrojeniowe, gdy maszyna jeszcze pracuje; TPM podnosi dostępność dzięki utrzymaniu ruchu zapobiegawczym. Oba często są warunkiem wstępnym przyszłego stanu z małymi partiami.

### Od przyszłego stanu do planu wdrożenia

Przyszły stan bez planu to tylko ładny plakat. Podziel przyszły stan na **pętle strumienia wartości**: pętlę pacemakera (od pacemakera do klienta) oraz pętle wcześniejsze, aż do każdego supermarketu. Każda pętla otrzymuje cele, działania, właścicieli i terminy. Rother i Shook zalecają rozpoczęcie od pętli pacemakera, ponieważ jest najbliżej klienta [unverified: brak wskazanego źródła strony]. Planuj w cyklach kilkumiesięcznych i regularnie przeglądaj postępy, na przykład podczas miesięcznego przeglądu strumienia wartości.

Wycena jest częstą przeszkodą. Busch, Niehues i Maassen opisują w ZWF, że przemysł często nie wykorzystuje potencjału strumienia wartości, ponieważ korzyści są słabo ilościowo określone. Rozszerzają metodę strumienia wartości o model wyceny oparty na kosztach, który łączy wskaźniki operacyjne i strategiczne [25]. Dla Twojego planu wdrożenia oznacza to: przed wnioskiem o budżet przelicz redukcję zapasów, zyskaną powierzchnię i skrócenie czasu przepływu na pieniądze.

## 9. Wykrywanie marnotrawstwa: 8 rodzajów marnotrawstwa i diagram spaghetti

Mapowanie strumienia wartości to narzędzie do wykrywania marnotrawstwa (jap.: muda). Klasyfikacja siedmiu rodzajów marnotrawstwa sięga Taiichi Ohno [9][32]; LEI wymienia je jako nadprodukcja, oczekiwanie, transport, przetwarzanie, zapasy, ruch i poprawki [9]. Jeffrey Liker dodał ósmy rodzaj w książce "The Toyota Way" (2004): niewykorzystaną kreatywność i umiejętności pracowników [33]. W USA osiem rodzajów często uczy się za pomocą akronimu DOWNTIME: defekty, overproduction (nadprodukcja), waiting (oczekiwanie), non-utilized talent (niewykorzystany potencjał), transportation (transport), inventory (zapasy), motion (ruch), extra processing (zbędne przetwarzanie) [51]. Zwięzły przegląd znajduje się na stronie hasła [Eight Wastes](https://www.m365.fm/entity/eight-wastes/).

| Nr | Marnotrawstwo | Jak je rozpoznać na mapie strumienia wartości |
|---|---|---|
| 1 | Nadprodukcja | strzałki "push", duże partie, zapasy za szybkimi procesami; według LEI "najgorsza forma marnotrawstwa, ponieważ przyczynia się do pozostałych sześciu" [9] |
| 2 | Oczekiwanie | operatorzy czekają na maszyny, materiał lub zatwierdzenia; niskie obciążenie w stosunku do taktu |
| 3 | Transport | wiele strzałek transportowych i wózków, magazyny pośrednie między procesami |
| 4 | Nadmierne przetwarzanie | etapy procesu bez wartości dla klienta, zdublowane kontrole |
| 5 | Zapasy | trójkąty zapasów z wieloma dniami, supermarkety bez maksymalnych ilości |
| 6 | Ruch | długie przejścia pracowników, szukanie części i narzędzi (lepiej widoczne na diagramie spaghetti) |
| 7 | Defekty / poprawki | złom i przeróbki w polu danych, strzałki przepływu zwrotnego |
| 8 | Niewykorzystany potencjał | planowanie wizyt "go-see", brak udziału w rysowaniu mapy, brak propozycji usprawnień |

### Diagram spaghetti jako uzupełnienie

Mapa strumienia wartości pokazuje przepływ na poziomie abstrakcyjnym. Nie pokazuje, jak daleko w rzeczywistości przemieszczają się części i ludzie. Do tego służy **diagram spaghetti**: na skalowym planie hali prowadzi się ołówkiem każdą trasę części lub osoby. Wynik często przypomina talerz spaghetti i pozwala jednocześnie zobaczyć marnotrawstwo transportu i ruchu. LEI opisuje przypadek Thrustmaster of Texas, producenta urządzeń napędowych do statków z Houston, gdzie diagram spaghetti obszaru montażu sterów ujawnił ponad siedem mil chodzenia i prawie 10 godzin czasu bez wartości dodanej na jednostkę; po przeprojektowaniu układu skoncentrowanym na przepływie i standardowej pracy firma odnotowała 18 miesięcy później 100% terminowości dostaw [43]. Diagram spaghetti stosujcie po mapie strumienia wartości, dla procesów z najbardziej widocznymi zrywami kaizen. Szczegóły na stronie hasła [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/).

## 10. Grenzen der traditionellen Wertstromanalyse

Die papierbasierte Wertstromanalyse ist bewusst einfach gehalten. Diese Einfachheit ist ihre Stärke und zugleich ihre Grenze. Die Fachliteratur nennt vor allem fünf Schwächen.

**1. Momentaufnahme.** Die Karte zeigt den Zustand eines Tages oder einer Woche. In der ZWF weisen Lugert und Winkler darauf hin, dass der statische Charakter der Wertstromanalyse unter den aktuellen Megatrends der Produktion zunehmend zum Problem wird, und sie fordern ein dynamisches Wertstrommanagement [23]. Das Fraunhofer IPA fragt, ob einzelne Momentaufnahmen ausreichen, um einen Produktionsprozess vollständig zu analysieren [22].

**2. Durchschnitte statt Verteilungen.** Datenkästchen enthalten Mittelwerte. Schwankende Zykluszeiten, Störungen und Nachfragespitzen verschwinden im Mittel. Das Gesetz von Little gilt für den langfristigen Durchschnitt stabiler Systeme [12], sagt aber nichts über die Streuung einzelner Aufträge aus.

**3. Produktvielfalt.** Bereits 2011 verwiesen Drees und Sack auf komplexere Wertschöpfungsketten, eine wachsende Zahl von Produktvarianten und alltägliche Nachfrageschwankungen [19]. Bei Hunderten von Varianten und unterschiedlichen Arbeitsfolgen wird es nahezu unmöglich, eine Produktfamilie mit einheitlichen Zykluszeiten zu bilden.

**4. Manuelle Datenerfassung.** Laut Fraunhofer IPA sind Daten aus Notizzetteln und geschätzte Mittelwerte weniger aktuell, genau und vollständig als digital erfasste Daten [22]. In vielen Unternehmen werden die Daten für die Wertstromanalyse nur manuell und als Momentaufnahme erhoben [21]. Der Aufwand führt dazu, dass die Karten selten aktualisiert werden.

**5. Kein Test des Zielzustands.** Ob FIFO-Bahnen mit 30 Teilen ausreichen oder ob ein Supermarkt bei Nachfragespitzen leer läuft, lässt sich auf dem Papier nicht prüfen. Türck, Weimer, Schubert und Drees (iFAKT GmbH) fragen deshalb, welche neuen Optimierungsmöglichkeiten sich ergeben, wenn der Zeitfaktor berücksichtigt wird [16].

Außerdem besteht eine inhaltliche Lücke: Die klassische Methode verbessert vor allem den Materialfluss. Der Informationsfluss wird zwar eingezeichnet, aber kaum bewertet. Hier setzt die Wertstromanalyse 4.0 an (Abschnitt 12) [13][15].

## 11. Dynamische und digitale Wertstromanalyse

Die Methode entwickelt sich entlang zweier Achsen weiter: **dynamisch** (Simulation des zeitlichen Verhaltens und der Variabilität) und **digital** (automatische Datenerfassung und kontinuierliche Berechnung der Kennzahlen). Beide Achsen ergänzen die klassische Methode; keine ersetzt sie.

### Von der statischen Karte zur Simulation

Bereits 2014 beschrieben Stefan Türck, Andreas Weimer, Lars Schubert und Jörg Drees von der iFAKT GmbH in der ZWF den Weg von der statischen Analyse der Wertströme und ihrer Kennzahlen zur **dynamischen Simulation** [16]. Ausgangspunkt war, dass die Modellierung von Wertströmen in vielen Fertigungsunternehmen etabliert ist und digitale Werkzeuge dafür zunehmend Akzeptanz finden [16]. Die dynamische Wertstromanalyse fragt nicht nur, wie hoch der durchschnittliche Bestand ist, sondern wie er sich im Zeitverlauf entwickelt, wenn Aufträge schwanken, Maschinen ausfallen oder Rüstfolgen sich ändern.

In der Praxis wird die Wertstromkarte zu einem Modell, in dem jedes Symbol ein Verhalten hat. Ein Prozess hat nicht mehr eine feste Zykluszeit, sondern eine Verteilung; ein Supermarkt hat einen Bestellpunkt und einen Maximalbestand; die Kundennachfrage folgt einer Zeitreihe. Die Simulation zeigt, ob der Zielzustand unter realistischen Bedingungen funktioniert, wo Puffer zu klein sind und welche Durchlaufzeitverteilung zu erwarten ist. Mehr zur Fabriksimulation allgemein finden Sie auf der Entitätsseite [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Vergleich: statische vs. dynamische Wertstromanalyse

| Kriterium | Statische (klassische) WSA | Dynamische WSA / Simulation |
|---|---|---|
| Datenbasis | Mittelwerte aus einer Vor-Ort-Erfassung | Verteilungen, Zeitreihen, Ereignisdaten |
| Zeitbezug | Momentaufnahme | Entwicklung über Tage, Wochen, Monate |
| Produktvielfalt | Produktfamilie mit einheitlichen Werten | Varianten mit eigenen Arbeitsabläufen und Rüstfolgen |
| Schwankungen und Ausfälle | nicht abgebildet | über Verteilungen und Ausfallprofile modelliert |
| Kennzahlen | Durchlaufzeit, Flussgrad, Bestandstage als Einzelwerte | zusätzlich Streuung, Perzentile, Auslastung über die Zeit |
| Prüfung des Zielzustands | nicht möglich, nur Expertenurteil | Szenarien vor der Umsetzung vergleichbar |
| Aufwand | gering: Papier und Stoppuhr | höher: Modellierung und Datenpflege |
| Werkzeuge | Papier, Whiteboard, Diagrammsoftware | spezielle WSA-Software mit Simulationsanbindung, Simulationssuiten |
| Stärke | Verständnis, Kommunikation, Einbindung | Absicherung von Investitionen und Puffergrößen |
| Typischer Einsatz | Einstieg, Workshop, Lean-Training | Werksplanung, Produktion mit hoher Variantenvielfalt, Kapazitätsentscheidungen |

### Digitale Wertstromanalyse: Daten aus dem Werk statt vom Klemmbrett

Die zweite Achse ist die Datenerfassung. In ZWF zeigt Christian Urnauer, wie **Process Mining** aus Produktionszeitstempeln Prozesse, deren Verknüpfungen und Leistungskennzahlen ableiten kann und so der Wertstromanalyse eine datengetriebene Perspektive gibt [24].

Das Fraunhofer IPA verfolgt einen ähnlichen Weg unter dem Motto „Wir automatisieren den Gemba-Walk“: von der digitalen Datenerfassung in der Fertigung bis zu visualisierten Wertstromkennzahlen, mit aktuellen Auswertungen, konsistenten datenbasierten Kennzahlen und einfacher Integration von Kennzahlen zu Energie und CO₂-Fußabdruck [22]. Auch für die Umweltseite gibt es eine öffentliche Referenz aus den USA: Das Lean & Environment Toolkit der EPA empfiehlt, „ein oder zwei Umweltleistungskennzahlen für jeden Prozess im Wertstrom“ auszuwählen, etwa die Menge gefährlicher Abfälle pro Schicht, und sie neben Taktzeit und Verfügbarkeit in die Prozesskästen einzutragen [48].

In den Begriffen von ISA-95 (ANSI/ISA-95, international als IEC 62264 bekannt) stammen die Daten für einen digitalen Wertstrom aus Systemen der Ebene 4 wie ERP, aus Fertigungsleitsystemen der Ebene 3 wie MES sowie aus Steuerungssystemen und Sensoren der Ebene 2 [50]. Diese Schichtung hilft bei der Abstimmung mit der IT, welches System welches Datenfeld liefert.

Ein konkretes Beispiel ist das Forschungsprojekt **ECOWERT** („echtzeitorientierte Wertstromanalyse für eine nachhaltige Produktionsoptimierung“) von Fraunhofer IPA und iFAKT GmbH. Es lief vom 1. September 2021 bis zum 31. August 2022, hatte ein Volumen von 500.000 € und wurde vom Land Baden-Württemberg über das Programm Invest BW gefördert [20]. Ziel war eine Wertstromanalyse, die ERP-, MES-, Maschinen- und Sensordaten automatisch erfasst, laufend aktualisiert und Energie-Wertstromdaten ergänzt [20]. Jörg Drees und Steffi Stambera (iFAKT) sowie Markus Böhm (Fraunhofer IPA) beschreiben die Architektur: Rohdaten gelangen über ein IIoT-Gateway und MQTT (mit der Sparkplug-Payload-Spezifikation) in eine Zeitreihendatenbank und werden von der Software Polaris VSM ausgewertet. Ihr Fazit: Der Ansatz liefert Wertstromanalysen nahezu in Echtzeit, und die Nachrüstung von Maschinen mit einfachen Sensoren reicht bereits aus, um die Daten zu erzeugen [21].

Um diese Daten wiederzuverwenden, haben Böhm, Drees, Sai, Erlach, Stambera und Teriete eine **universelle Datenschnittstelle für digitale Wertstromdienste** entwickelt. Sie behandeln Ereignisse aus der Fertigung als strukturierte Rohdaten für Optimierungsdienste und standardisieren den Datenstrom, damit sich Dienste über eine einzige Schnittstelle anbinden lassen. Ein Dienst zur Berechnung und Visualisierung von Kennzahlen wurde im Projekt ECOWERT angebunden [18]. Zu den Autoren gehört Klaus Erlach (Fraunhofer IPA), Autor des Standardwerks zur Wertstromgestaltung [18][3].

### Vom digitalen Wertstrom zum digitalen Zwilling

Gdy mapa strumienia wartości jest stale aktualizowana na podstawie danych w czasie rzeczywistym i połączona z modelem symulacyjnym, staje się elementem składowym cyfrowego bliźniaka produkcji. Siemens na przykład oferuje dodatek VSM Library do Plant Simulation X, który pozwala użytkownikom „uruchamiać dynamiczne symulacje strumieni wartości” oraz „tworzyć i porównywać wiele scenariuszy”, takich jak stan obecny i przyszły [35]. Więcej o tej koncepcji znajduje się na stronie hasła [Digital Twin](https://www.m365.fm/entity/digital-twin/) oraz w przewodniku [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

Sposób, w jaki strumień wartości działa jako żywy model danych, omówiono też w odcinku m365.fm [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

**Ważne zastrzeżenie:** cyfryzacja nie naprawia złego przepływu. Politechnika w Darmstadt (TU Darmstadt) wyraźnie zaleca, aby najpierw ustabilizować przepływ zgodny z zasadami lean, stosując klasyczne projektowanie strumienia wartości, a dopiero potem zajmować się usprawnieniami cyfrowymi. Odradza digitalizowanie złożonych procesów przed ich ustabilizowaniem [14].

## 12. Value Stream 4.0: logistyka informacji jako drugi wymiar

**Value Stream Mapping 4.0** opracowano w Instytucie Zarządzania Produkcją, Technologii i Obrabiarek (PTW) na Politechnice w Darmstadt (TU Darmstadt) w Niemczech. Tobias Meudt, Joachim Metternich i Eberhard Abele zaprezentowali tę metodę w 2017 roku w czasopiśmie CIRP Annals pod tytułem „Value stream mapping 4.0: Holistic examination of value stream and information logistics in production” [13]. Następnie ukazała się angielska książka „Value Stream 4.0: A Systems View of Information Flow for Digitalization” autorstwa Metternicha, Meudta i Hartmanna (CRC Press, premiera w lipcu 2025, prawa autorskie 2026) [15].

Główna idea jest następująca: obok przepływu materiałów systematycznie analizuje się **logistykę informacji**. Informacje powinny być dostępne we właściwym czasie, w odpowiednim miejscu, w odpowiedniej ilości i jakości, przy jak najmniejszej ilości marnotrawstwa [14]. Według przewodnika „Industrie 4.0 trifft Lean” (Przemysł 4.0 spotyka Lean), wydanego przez niemiecki Stowarzyszenie Przemysłu Maszynowego VDMA i opracowanego naukowo przez Metternicha, Meudta i Hartmanna, metoda obejmuje następujące elementy [14]:

- **Szerszy zakres:** od pierwszego kontaktu z klientem do użytkowania produktu, obejmujący wszystkie działy zajmujące się realizacją zamówień.
- **Rozszerzone pola procesów:** z wskazaniem źródeł informacji, interwałów rejestrowania, sposobu rejestrowania (zautomatyzowany, półautomatyczny, ręczny) oraz wartości bieżących.
- **Nośniki informacji jako linie:** papier, ERP, MES, Excel i inne nośniki są przedstawiane jako poziome linie i połączone ze źródłami pionowymi liniami.
- **Osiem rodzajów marnotrawstwa w logistyce informacji**, uporządkowanych wzdłuż cyklu życia danych: na etapie tworzenia i przekazywania (wybór danych, jakość danych, rejestracja danych, przekazywanie danych), na etapie przetwarzania i przechowywania (oczekiwanie i zapasy informacji; transport, ruch i szukanie) oraz na etapie wykorzystania (analiza danych, wsparcie decyzji).
- **Wskaźniki:** dostępność informacji, wykorzystanie informacji oraz stopień cyfryzacji.

W przykładzie producenta maszyn specjalnych analiza wykazała dwanaście używanych nośników informacji, ręczne wielokrotne wprowadzanie tych samych danych oraz stopień cyfryzacji i wykorzystania danych wynoszący w każdym przypadku zero procent [14].

Bega i współpracownicy rozszerzyli metodę Value Stream Mapping 4.0 w 2023 roku w czasopiśmie Production Engineering, aby kompleksowo identyfikować przepływy danych i informacji [26]. Pokazuje to, że Value Stream 4.0 nie jest gotową metodą, lecz aktywnym obszarem badań.

W 2018 roku Jörg Drees przedstawił pokrewne podejście z perspektywy dostawcy oprogramowania w czasopiśmie ZWF, pod tytułem „Wertstrom Management 4.0: Next Generation”: rosnące powiązanie informacji dzięki Przemysłowi 4.0 i przemysłowemu internetowi rzeczy (IIoT) stwarza nowe oczekiwania, a metoda i oprogramowanie muszą dostosować się do nowych form organizowania i sterowania łańcuchem wartości [17].

## 13. Value Stream Management: Prowadzenie strumienia wartości jako zadanie kierownicze

Projekt mapowania strumienia wartości ma swój początek i koniec. **Zarządzanie strumieniem wartości** jest procesem ciągłym. Oznacza prowadzenie strumienia wartości ponad granicami działów w długim horyzoncie, z regularnymi aktualizacjami mapy, celami na poziomie strumienia wartości i jasno przypisaną odpowiedzialnością. Szczegółowe wprowadzenie znajduje się we wpisie [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

Lugert i Winkler twierdzą, że same techniczne rozwiązania Industry 4.0 nie wystarczą, aby przekształcić statyczne mapowanie strumienia wartości w dynamiczne podejście zarządcze. Organizację i ludzi trzeba uwzględnić w równym stopniu [23]. Norma ISO 22468:2020 odzwierciedla ten cykl w swojej strukturze: analizę, projektowanie, planowanie, ocenę i korektę strumieni wartości [40].

### Cykl zarządzania strumieniem wartości

1. **Analiza:** zarejestrowanie stanu obecnego, najlepiej na podstawie automatycznie zbieranych danych.
2. **Projektowanie:** narysowanie stanu przyszłego zgodnie z wytycznymi projektowymi, najlepiej zweryfikowanego symulacją.
3. **Planowanie:** plan wdrożenia dla każdej pętli strumienia wartości, z celami i właścicielami.
4. **Wdrażanie:** działania w ramach wydarzeń kaizen i codziennej pracy.
5. **Ocena:** ciągłe śledzenie wskaźników i wycena wpływu w pieniądzu [25].
6. **Korekta:** aktualizacja mapy i wyprowadzenie kolejnego stanu przyszłego.

### Rola menedżera strumienia wartości

LEI opisuje menedżera strumienia wartości jako „osobę wyznaczoną z jasną odpowiedzialnością za sukces strumienia wartości”. Ta osoba identyfikuje wartość z perspektywy klienta, projektuje strumień wartości i dąży do coraz szybszego przepływu. Ponieważ pieniądze, aktywa i ludzie zwykle podlegają działom funkcjonalnym, menedżer strumienia wartości „prowadzi poprzez wpływ, a nie poprzez stanowisko”. LEI wskazuje na chief engineera z Toyoty jako wzór dla tej roli [10].

W praktyce menedżer strumienia wartości zazwyczaj:

- jest właścicielem map stanu obecnego i przyszłego oraz planu wdrożenia
- prowadzi regularny przegląd strumienia wartości
- śledzi wskaźniki strumienia wartości (lead time, zapasy, terminowość dostaw, produktywność)
- rozstrzyga konflikty celów między działami
- eskaluje przeszkody do kierownictwa zakładu

Wpis [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/) szczegółowo opisuje profil, uprawnienia i typowe pułapki tej roli. Sposób, w jaki oprogramowanie wspiera zarządzanie strumieniem wartości w produkcji, omówiono w [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/).

Zarządzanie strumieniem wartości jest ściśle powiązane z [zarządzaniem Lean](https://www.m365.fm/entity/lean-management/) jako całością; zob. przewodniki [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) i [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Codzienne rutyny, które utrzymują stan przyszły przy życiu, takie jak wielopoziomowe spotkania i gemba walk, są tematem przewodnika [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 14. Typowe błędy w mapowaniu strumienia wartości i jak ich unikać

| Błąd | Skutek | Środek zaradczy |
|---|---|---|
| mapowanie przy biurku na podstawie danych z ERP | mapa pokazuje czasy normatywne, nie rzeczywistość | rejestrować w gemba ze stoperem i liczeniem |
| nie zdefiniowano rodziny produktów | mapa staje się przeładowana i nie daje się ocenić | macierz produkt-proces przed pierwszym obchodem |
| zbyt dużo szczegółów | zespół warsztatowy gubi się w pojedynczych krokach | rysować blok procesu tylko tam, gdzie przepływ się zatrzymuje |
| pominięty przepływ informacji | przyczyna zapasów pozostaje niejasna | przy każdym procesie pytać: skąd wie, co ma produkować? |
| nieuwzględniona dostępność | wąskie gardła zostają przeoczone | porównać efektywny czas cyklu z taktem |
| tylko stan obecny, bez stanu przyszłego | analiza bez wpływu na wyniki | projekt stanu przyszłego i plan wdrożenia są obowiązkowe |
| stan przyszły jako idealny obraz bez planu | frustracja, nic się nie dzieje | pętle strumienia wartości z celami, właścicielami i terminami |
| pracownicy nie są zaangażowani | opór i błędne dane | zweryfikować mapę wspólnie z obszarami |
| jednorazowy projekt bez właściciela | mapa jest nieaktualna po kilku tygodniach | wyznaczyć menedżera strumienia wartości, ustalić rytm przeglądów |
| cyfryzacja przed ustabilizowaniem | marnotrawstwo zostaje zautomatyzowane | najpierw ustabilizować przepływ, potem cyfryzować [14] |
| różne podstawy czasu dla stanu obecnego i przyszłego | wskaźniki przepływu nie są porównywalne | ustalić konwencję (dni robocze lub kalendarzowe) raz na zawsze |

## 15. Oprogramowanie do mapowania strumienia wartości: porównanie kategorii

Osoby szukające „oprogramowania do mapowania strumienia wartości” chcą przede wszystkim wiedzieć, które narzędzie pasuje, jakie funkcje powinno mieć i czy istnieją opcje darmowe. Zamiast rankingu pojedynczych produktów pomocny jest podział na kategorie, ponieważ narzędzia różnią się mniej rysowaniem, a bardziej tym, co dzieje się po narysowaniu.

| Kategoria | Typowe przykłady | Mocne strony | Ograniczenia | Najlepsze zastosowanie |
|---|---|---|---|---|
| Papier i tablica | papier pakowy, karteczki samoprzylepne, ołówek | maksymalne zaangażowanie, brak wymogu umiejętności narzędziowych, bezpłatne | brak obliczeń, trudne udostępnianie i wersjonowanie | pierwsza mapa w gemba, szkolenia |
| Ogólne oprogramowanie diagramowe i tablicowe | Microsoft Visio, Lucidchart, Miro, EdrawMax | biblioteki symboli, współpraca, często bezpłatne wersje podstawowe | wskaźniki zwykle ręczne, brak logiki za symbolami | dokumentacja, zespoły rozproszone |
| Specjalistyczne oprogramowanie VSM z obliczaniem wskaźników | iFAKT Polaris VSM, SimVSM (SimPlan), visTable | symbole z wbudowanymi wzorami, automatyczna oś czasu, porównanie wariantów i scenariuszy | koszty licencji, krzywa uczenia się | regularna praca nad strumieniem wartości, zarządzanie strumieniem wartości |
| Oprogramowanie VSM z powiązaniem z symulacją | SimVSM Pro [34], Plant Simulation X z biblioteką VSM [35] | analiza dynamiczna, testowanie stanu przyszłego | większy nakład modelowania i danych | produkcja wysokomieszana, decyzje inwestycyjne |
| Analiza oparta na danych / process mining | ONIQ [36], podejścia badawcze, takie jak ECOWERT [20] | wskaźniki z danych produkcyjnych, analiza ciągła zamiast jednorazowej | jakość danych i integracja z IT są decydujące | zakłady z bazą danych MES/ERP |
| Platformy zarządzania strumieniem wartości (dostarczanie oprogramowania) | platformy zgodnie z definicją rynku Gartnera [31] | kompleksowy pomiar łańcucha dostarczania oprogramowania | nie są projektowane dla produkcji fizycznej | organizacje IT i programistyczne |

Deklaracje producentów należy czytać krytycznie. ONIQ na przykład deklaruje, że automatyzacja zmniejsza nakład pracy na analizę strumienia wartości nawet o 90% [36]; żadna niezależna metodyka nie została opublikowana. SimPlan opisuje SimVSM jako obejmujący cyfrową rejestrację i wskaźniki statyczne, a SimVSM Pro dodaje parametry dynamiczne oraz interfejs do symulacji [34].

### Kryteria wyboru

- **Symbole:** Unterstützt das Werkzeug die gängigen Rother/Shook-Symbole, und können Sie eigene ergänzen?
- **Berechnungslogik:** Werden Takt-Zeit, Bestandsreichweite, Durchlaufzeit und Flussgrad automatisch berechnet? Sind die Formeln transparent und anpassbar?
- **Szenarien:** Können Sie Ist-, Zielzustände und Zwischenzustände versionieren und vergleichen?
- **Dynamik:** Gibt es eine Simulation oder eine Anbindung an ein Simulationswerkzeug?
- **Datenanbindung:** Kann das Werkzeug ohne ERP- oder MES-Anbindung starten und die Daten später automatisch übernehmen?
- **Umsetzung:** Werden Maßnahmen, Kaizen-Blitze und Verantwortliche im selben Werkzeug verwaltet?
- **Zusammenarbeit und Betrieb:** Rollen und Berechtigungen, Mandantenfähigkeit, Cloud oder On-Premises, Integration in die bestehende IT-Landschaft (für Microsoft-basierte Werke siehe den Leitfaden [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)).
- **Kosten:** Lizenzmodell, Testphase, Schulungsaufwand.

Eine gute Prüffrage lautet: Hilft das Werkzeug nur, den Ist-Zustand zu dokumentieren, oder unterstützt es auch die Steuerung des Zielzustands, während sich das Werk Woche für Woche verändert?

## 16. Digitales Wertstrommapping mit iFAKT Polaris VSM und BSM

> **Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

Die [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) mit Sitz in Stuttgart wurde nach Angaben des Unternehmens im Jahr 2001 gegründet [19]. Mitarbeitende des Unternehmens haben mehrere der in diesem Leitfaden zitierten ZWF-Beiträge zum dynamischen und digitalen Wertstrommapping verfasst (Überblick in Abschnitt 18, „Forschungspublikationen“). Aus dieser Arbeit ist die Softwarefamilie [iFAKT Polaris](https://www.m365.fm/entity/polaris/) hervorgegangen; einen eigenen Leitfaden dazu gibt es unter [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). Für das Wertstrommapping sind zwei Module relevant:

**[Polaris VSM](https://www.m365.fm/entity/polaris-vsm/)** ist ein digitales Lean-Management-Werkzeug, mit dem Hersteller Lieferketten und Wertströme abbilden. Laut Microsofts Beitrag zu dem Eintrag auf AppSource lassen sich Kennzahlen über ein Formelsystem berechnen, prüfen und visualisieren; ergänzt werden Kanban- und Kaizen-Boards sowie die Zusammenarbeit von jedem Standort aus [29]. Auf ifakt.de listet der Anbieter diese Funktionen auf [28]:

- Drag-and-Drop-Wertstromkarten mit Standardsymbolen und mehrstufigen Hierarchien
- automatische Kennzahlen wie Durchlaufzeit, Zykluszeit, Wertschöpfungsanteil und OEE in Dashboards, mit exportfähigen Berichten
- unbegrenzte Szenarien, Sensitivitätsanalyse, Versionshistorie mit Rollback und Vergleich der Kennzahlen nebeneinander
- rollenbasierte Berechtigungen, Mandantenfähigkeit und PDCA-Dokumentation
- Start ohne ERP- oder MES-Anbindung, mit optionaler Datenanbindung zu einem späteren Zeitpunkt

Im Forschungsprojekt ECOWERT diente Polaris VSM als Auswertungswerkzeug für automatisch erfasste Daten (siehe Abschnitt 11) [21]. Eine Simulationsfunktion im engeren Sinne listet der Anbieter nicht; für die dynamische Analyse benötigen Sie ein Werkzeug aus der Kategorie „Simulationsanbindung“ (Abschnitt 15). Nutzenangaben auf der Anbieterseite (etwa 25 % kürzere Durchlaufzeit) werden hier nicht wiederholt, da keine Methodik angegeben ist.

**[Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)** (Business Swimlane Modeling) ergänzt die Wertstromsicht um Geschäftsprozesse. Laut AppSource-Eintrag werden Prozessschritte in Pools und Lanes gruppiert, Zeitfaktoren und Kennzahlen erfasst und verglichen; die Pläne reichen von „Read Only“ über „Basic“ (BPMN-Aufnahmen, Swimlane-Vorlagen, einfache Formeln, Durchlaufzeit- und Balkendiagramm) bis „Excellence“ und „Integrate & Customize“ [30]. Das ist nützlich, wenn der Wertstrom nicht in der Produktion, sondern bei Angebotserstellung, Konstruktion und Auftragsabwicklung beginnt.

Beide Module sind auf Microsoft AppSource gelistet [29][30]. Der Anbieter veröffentlicht keine Preise; eine Demo ist auf Anfrage verfügbar [30].

**Bewertung:** Ein Werkzeug wie Polaris VSM ersetzt nicht den Gang ins Gemba und nicht die Gestaltung des Zielzustands. Es übernimmt Berechnungen, macht Szenarien vergleichbar und kann die Karte aktuell halten, wenn Daten automatisch einfließen. Ob es zu Ihrem Werk passt, hängt von Produktvielfalt, verfügbaren Daten und IT-Landschaft ab. Prüfen Sie es wie jede andere Lösung anhand der Auswahlkriterien in Abschnitt 15.

## 17. Zarządzanie strumieniem wartości w dostarczaniu oprogramowania: czym się różni

Jeśli wyszukasz hasła „value stream mapping” lub „value stream management” w google.com, wiele wyników pochodzi z obszaru tworzenia oprogramowania i DevOps. Gartner opisuje platformy zarządzania strumieniem wartości jako narzędzia, które „umożliwiają organizacjom optymalizację dostarczania produktu od początku do końca i poprawę wyników biznesowych”; są niezależne od konkretnych narzędzi i łączą się z istniejącymi narzędziami w całym cyklu życia dostarczania oprogramowania [31]. Mik Kersten w książce „Project to Product” (IT Revolution, 2018) wprowadził dla tego obszaru Flow Framework z metrykami takimi jak czas przepływu (flow time) i obciążenie przepływu (flow load) [39].

Podstawowa idea jest taka sama jak w fabryce: uczynić przepływ od zamówienia klienta do dostawy widocznym i ograniczyć czekanie. Różnice są jednak duże. W dostarczaniu oprogramowania przepływają elementy pracy, a nie materiał, zapasem są niedokończone zgłoszenia, a takt time trudno zdefiniować w sensowny sposób. Martin i Osterling przenieśli tę metodę do pracy biurowej i pracy opartej na wiedzy, a w centrum postawili metryki takie jak procent ukończonych i poprawnych prac (%C&A): udział pracy, którą kolejny etap uznaje za kompletną i wolną od błędów. Pomnożony przez wszystkie etapy daje skumulowane %C&A, które w glosariuszu Martina nazywa się rolled first pass yield [6][44]. W produkcji klasyczna metoda z taktem, zapasami i osią czasu pozostaje punktem odniesienia.

## 18. Dowody i publikacje badawcze

Solidne, niezależnie opublikowane dane z przypadków wdrożeń mapowania strumienia wartości są rzadsze, niż sugerują liczne deklaracje sukcesu w internecie. Udokumentowane są następujące:

- **Producent maszyn specjalnych (TU Darmstadt / VDMA):** dwanaście nośników danych i stopień cyfryzacji wynoszący zero procent (szczegóły w rozdziale 12) [14].
- **ECOWERT (Fraunhofer IPA i iFAKT):** analiza strumienia wartości niemal w czasie rzeczywistym z doposażonymi czujnikami (szczegóły w rozdziale 11) [20][21].
- **HELLA (ZWF 2018):** opracowanie kosztowego modelu wyceny działań w strumieniu wartości wspólnie z niemieckim dostawcą motoryzacyjnym HELLA GmbH & Co. KGaA, w celu ustalania priorytetów konkurujących ze sobą usprawnień w ujęciu biznesowym [25].
- **Schaeffler (ZWF 2017):** Andreas Lugert, odpowiedzialny za Lean management w Schaeffler AG, i Herwig Winkler (BTU Cottbus-Senftenberg) opisują drogę od statycznego mapowania strumienia wartości do dynamicznego zarządzania strumieniem wartości [23].
- **Thrustmaster of Texas (LEI):** opis przypadku dotyczący wykresu spaghetti jako uzupełnienia analizy przepływu, z raportowanymi 100% terminowych dostaw po 18 miesiącach [43].

Znany podręcznikowy przypadek „Acme Stamping” z *Learning to See* jest fikcyjny [1], ale dobrze nadaje się do ćwiczeń.

### Publikacje badawcze o dynamicznym i cyfrowym mapowaniu strumienia wartości

Poniższe artykuły napisali autorzy z iFAKT GmbH, częściowo wspólnie z Fraunhofer IPA. Są opublikowane po niemiecku i można je sprawdzić po DOI u wydawcy. Razem pokazują rozwój od obliczania metryk, przez symulację, po zdarzeniowy interfejs danych:

| Rok | Tytuł (tłumaczenie na angielski) | Autorzy | Publikacja |
|---|---|---|---|
| 2011 | Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (Optymalizacja produkcji dzięki metrykom modelowania strumienia wartości) | J. Drees, C. Sack | ZWF 106 (6), s. 466–470, DOI 10.3139/104.110589 [19] |
| 2014 | Dynamische Simulation von Wertströmen (Dynamiczna symulacja strumieni wartości) | S. Türck, A. Weimer, [L. Schubert](https://www.m365.fm/entity/lars-schubert/), [J. Drees](https://www.m365.fm/entity/jorg-drees/) | ZWF 109 (11), s. 839–842, DOI 10.3139/104.111242 [16] |
| 2018 | Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation (Nowe perspektywy dla metody strumienia wartości) | J. Drees | ZWF 113 (9), s. 605–609, DOI 10.3139/104.111974 [17] |
| 2023 | Universelle Datenschnittstelle für digitale Wertstromdienste (Uniwersalny interfejs danych dla cyfrowych usług strumienia wartości) | M. Böhm, J. Drees, B. Sai, K. Erlach, S. Stambera, T. Teriete | ZWF 118 (5), s. 293–297, DOI 10.1515/zwf-2023-1062 [18] |
| 2023 | Daten für Wertstromanalysen automatisch erfassen (Automatyczne zbieranie danych do analiz strumienia wartości) | J. Drees, S. Stambera, M. Böhm | IT&Production, 12 stycznia 2023 [21] |

Dalsze niezależne artykuły w ZWF dotyczące rozszerzania metody to Lugert/Winkler (2017) [23], Busch/Niehues/Maassen (2018) [25] oraz Urnauer (2019) [24]. W języku angielskim główne nurty badań reprezentują Meudt i in. w CIRP Annals (2017) [13] oraz Bega i in. w Production Engineering (2023) [26].

## 19. FAQ: Pytania i odpowiedzi dotyczące mapowania strumienia wartości

### Czym jest mapowanie strumienia wartości w prostych słowach?
Mapa strumienia wartości to jednostronicowa mapa przepływu produkcji. Proste symbole pokazują, przez jakie procesy przechodzi produkt, gdzie zalega materiał, ile czasu to zajmuje i jakie informacje sterują procesami. Pokazuje, jak mała część czasu realizacji zamówienia faktycznie dodaje wartość.

### Jakie są etapy mapowania strumienia wartości?
Określenie celu i zakresu, zdefiniowanie rodziny produktów, zebranie popytu klienta i czasu taktu, przejście procesu wstecz od wysyłki, wypełnienie pól danych, policzenie zapasów, dodanie dostawców i transportu, narysowanie przepływu informacji, narysowanie osi czasu i obliczenie wskaźników, a następnie oznaczenie marnotrawstwa i weryfikacja mapy. Potem następują mapa stanu przyszłego i plan wdrożenia. Punkt 5 opisuje każdy z tych etapów.

### Czym różni się mapa stanu obecnego od mapy stanu przyszłego?
Mapa stanu obecnego rejestruje, jak materiał i informacja przepływają dziś, z danymi pomiarowymi. Mapa stanu przyszłego projektuje, jak powinny przepływać, zgodnie z wytycznymi takimi jak produkcja w takcie, przepływ ciągły tam, gdzie to możliwe, supermarkety tam, gdzie przepływ nie jest możliwy, oraz jeden proces prowadzący [11]. Razem tworzą metodę strumienia wartości, po której następuje plan wdrożenia.

### Czym różni się mapowanie strumienia wartości od mapowania procesów?
Mapa procesu pokazuje etapy jednej procedury, często w obrębie jednego działu. Mapa strumienia wartości obejmuje jedną rodzinę produktów od wejścia do wyjścia i dodaje to, czego brakuje mapie procesu: zapasy między etapami, przepływ informacji sterujący produkcją oraz oś czasu z czasem realizacji i czasem przetwarzania.

### Czym różni się mapowanie strumienia wartości od zarządzania strumieniem wartości?
Mapowanie strumienia wartości jest projektem: zespół rejestruje stan obecny i projektuje stan przyszły. Zarządzanie strumieniem wartości to bieżące kierowanie strumieniem przez odpowiedzialnego menedżera strumienia wartości, z regularnie aktualizowaną mapą, wskaźnikami i przeglądami. Norma ISO 22468:2020 opisuje ten cykl analizy, projektowania, planowania, oceny i korekty [40].

### Jakie symbole stosuje się w mapowaniu strumienia wartości?
Najważniejsze to pole procesu, pole danych, trójkąt zapasu, strzałka wypychania, supermarket, pas FIFO, ciężarówka, symbole kanban, ręczne i elektroniczne strzałki informacji, pudełko heijunka, wybuch kaizen oraz oś czasu. Pełne zestawienie znajduje się w punkcie 4.

### Jakie wskaźniki umieszcza się na mapie strumienia wartości?
Dla każdego procesu: czas cyklu, czas przezbrojenia, dostępność (czas pracy maszyny), wielkość partii i obsadę. Dla każdego punktu zapasu: ilość i dni zapasu. Dla całego strumienia: takt, czas realizacji, czas przetwarzania i wskaźnik przepływu. Wzory znajdują się w punkcie 6.

### Jak oblicza się wskaźnik efektywności cyklu procesu (wskaźnik przepływu)?
Dzieli się czas przetwarzania (wraz z czasem procesu, np. utwardzania) przez czas realizacji i mnoży przez 100%. Oba wielkości wyraża się w tej samej jednostce i na tej samej podstawie (dni robocze lub kalendarzowe). W przykładzie z punktu 7: 413 s ÷ 1 080 000 s = 0,038%.

### Dlaczego mapuje się od klienta wstecz?
Ponieważ to klient wyznacza tempo. Jeśli zaczniesz od wysyłki i pójdziesz w górę strumienia, najpierw zarejestrujesz procesy, które powinny sterować przepływem, a wszystkie pozostałe ocenisz względem popytu klienta [1][27].

### Ile trwa mapowanie strumienia wartości?
Dla łatwego do opanowania strumienia w jednym zakładzie realistyczne są jeden do dwóch dni na stan obecny i kolejne warsztaty na stan przyszły [unverified: brak źródła dla tych szacunków]. ASQ opisuje trzydniowe wydarzenie kaizen jako start [46]. Najwięcej wysiłku wymaga wdrożenie, które trwa miesiące.

### Czy mapowanie strumienia wartości to Lean czy Six Sigma?
To narzędzie Lean z Toyota Production System, a ASQ zalicza je do Lean [46]. Angielska Wikipedia określa je jako „uznaną metodę stosowaną w ramach metodologii Lean Six Sigma” [49]. Do działania nie wymaga statystyki Six Sigma.

### Jakie są wady mapowania strumienia wartości?
Jest migawką opartą na średnich, słabo pokazuje różnorodność produktów i zmienność, wymaga ręcznego zbierania danych i nie pozwala przetestować stanu przyszłego [22][23]. Symulacja dynamiczna i automatyczne zbieranie danych częściowo usuwają te braki.

### Czym jest dynamiczne mapowanie strumienia wartości?
Mapowanie strumienia wartości uwzględniające zachowanie w czasie. Procesy otrzymują rozkłady zamiast średnich, popyt podąża za szeregami czasowymi, a symulacja pokazuje, jak zapasy i czasy realizacji zmieniają się w czasie [16].

### Czy istnieje norma dla mapowania strumienia wartości?
Tak. ISO 22468:2020 "Value stream management (VSM)" obejmuje analizę strumienia wartości, projektowanie strumienia wartości, planowanie strumienia wartości oraz ocenę i dostosowywanie strumieni wartości [40]. ISO potwierdziła jej aktualność w 2025 roku. W Niemczech istotna jest również wytyczna VDI 2870 dotycząca ujednoliconych systemów produkcyjnych [7].

### Czy istnieje darmowe oprogramowanie do mapowania strumienia wartości?
Wiele ogólnych narzędzi do tworzenia diagramów oferuje bezpłatne poziomy dostępu z symbolami VSM, a szablony w arkuszach kalkulacyjnych są powszechne. Zazwyczaj nie obliczają one automatycznie wskaźników. Specjalistyczne oprogramowanie VSM jest zwykle płatne, często z okresem próbnym. Do pierwszej mapy najlepszym bezpłatnym wyborem pozostają papier i ołówek.

### Czy MES może zastąpić mapowanie strumienia wartości?
Nie. System MES dostarcza wartościowych danych, takich jak czasy cyklu, przestoje i zapasy, które mogą zasilać cyfrową mapę strumienia wartości [20]. Projektowanie przepływu, czyli decydowanie o supermarketach, pasach FIFO i pacemakerze, pozostaje zadaniem metody strumienia wartości oraz osób, które ją stosują.

## 20. Podsumowanie

Od ukazania się "Learning to See" w 1998 roku mapowanie strumienia wartości jest standardowym narzędziem do uwidaczniania przepływu w produkcji [1]. Jego wartość nie leży w samej mapie, lecz w tym, co ona uruchamia: wspólne zrozumienie całego przepływu, rzetelną liczbę dla wskaźnika przepływu oraz stan przyszły zaprojektowany według jasnych wytycznych [3][11].

Warto zapamiętać trzy punkty. Po pierwsze, licz dokładnie. Takt time, efektywny czas cyklu, dni zapasu wynikające z prawa Little'a oraz wskaźnik przepływu na stałej bazie czasowej zamieniają rysunek w wiarygodną podstawę decyzji. Po drugie, nie zatrzymuj się na stanie bieżącym. Projekt stanu przyszłego, plan wdrożenia i odpowiedzialny menedżer strumienia wartości decydują o tym, czy cokolwiek się zmieni. Po trzecie, stosuj rozszerzenia tam, gdzie klasyczna metoda osiąga swoje granice. Symulacja dynamiczna, automatycznie zbierane dane oraz widok logistyki informacyjnej z Value Stream 4.0 przygotowują metodę na dużą różnorodność produktów i cyfrowe zakłady [13][16][18], pod warunkiem wcześniejszej stabilizacji przepływu [14].

Zacznij od papieru, ołówka i jednej rodziny produktów. Przejdź na narzędzia cyfrowe, gdy będziesz chciał regularnie aktualizować mapę.

## Dalsza lektura na m365.fm

**Wpisy na blogu**
- [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/)
- [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/)

**Odcinek podcastu**
- [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Glosariusz**
[Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Eight Wastes](https://www.m365.fm/entity/eight-wastes/) · [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)

**Firmy i osoby**
[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Powiązane przewodniki**
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei der [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Deutschland. Auf m365.fm schreibt er über Lean Management, Wertstromanalyse und die Digitalisierung der Fertigung mit Microsoft 365 und Azure. Sein Schwerpunkt liegt darauf, wie bewährte Lean-Werkzeuge wie die Wertstromanalyse mit Echtzeitdaten, Simulation und modernen Datenplattformen zusammenwirken, ohne ihren methodischen Kern zu verlieren.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.** Die zitierten Forschungsarbeiten der iFAKT können über den DOI in ZWF überprüft werden.

# Sources

All sources accessed November 20, 2026. Sources marked "verified 11/20/2026" were opened for this English version; the others were verified for the German original on the same date and spot-checked.

1. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, 1998 (introduction dated May 1998, Ann Arbor); current edition subtitled "… to Add Value and Eliminate Muda", LEI, September 2018, 148 pages, ISBN 978-0-9667843-0-5. Publisher page (Shingo award 1999, Shook eleven years at Toyota): https://www.lean.org/store/workbooks/learning-to-see/ · Introduction (PDF): https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-introduction.pdf (verified 11/20/2026)
2. Rother, M.; Shook, J.: Sehen lernen. Mit Wertstromdesign die Wertschöpfung erhöhen und Verschwendung beseitigen. German edition, version 1.1. Lean Management Institut, Aachen 2004, ISBN 978-3-9809521-1-8 (German Digital Library catalog).
3. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. Springer, 1st ed. 2007; 2nd ed. 2010 (VDI-Buch), ISBN 978-3-540-89867-2; 3rd ed. Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (eBook 978-3-662-58907-6). Sample of 2nd ed.: https://lesejury.de/media/samples/672/9783540898672_leseprobe.pdf · Overview with the eight design guidelines: http://www.wertstromdesign.de/wertstromdesign.html (verified 11/20/2026)
4. Erlach, K.: Value Stream Design: The Way Towards a Lean Factory. Springer, Lecture Notes in Logistics, published September 2012 (copyright 2013), ISBN 978-3-642-12568-3 (hardcover), eBook 978-3-642-12569-0. https://link.springer.com/978-3-642-12568-3 · Publisher description ("ten design guidelines") via https://ebooks.mpdl.mpg.de/ebooks/Record/EB000384257 (verified 11/20/2026)
5. Klevers, T.: Wertstrom-Mapping und Wertstrom-Design. Verschwendung erkennen – Wertschöpfung steigern. mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9 (bibliographic data per [27]).
6. Martin, K.; Osterling, M.: Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation. McGraw-Hill, New York, published October 2013 (copyright 2014), ISBN 978-0-07-182891-8. https://www.mheducation.com/highered/mhp/product/value-stream-mapping-how-visualize-work-align-leadership-organizational-transformation.html (verified 11/20/2026)
7. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review. VDI (Association of German Engineers), July 2012. https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
8. Takt Time (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/ (verified 11/20/2026)
9. Seven Wastes (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/ (verified 11/20/2026)
10. Value-Stream Manager (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-manager/ (verified 11/20/2026)
11. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/ (verified 11/20/2026)
12. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://econpapers.repec.org/RePEc:inm:oropre:v:9:y:1961:i:3:p:383-387 (verified 11/20/2026)
13. Meudt, T.; Metternich, J.; Abele, E.: Value stream mapping 4.0: Holistic examination of value stream and information logistics in production. CIRP Annals 66 (1), 2017, pp. 413–416. DOI: 10.1016/j.cirp.2017.04.005 (bibliographic data per the reference list of [26]).
14. VDMA / PTW TU Darmstadt (Metternich, J.; Meudt, T.; Hartmann, L.): Leitfaden Industrie 4.0 trifft Lean, excerpt on Value Stream Mapping 4.0 (German). https://www.ptw.tu-darmstadt.de/media/fachgebietptw/dokumente_3/wissenssammlung_ptw/leitfaeden_2/Leitfaden_I40_Lean.pdf
15. Metternich, J.; Meudt, T.; Hartmann, L.: Value Stream 4.0: A Systems View of Information Flow for Digitalization. CRC Press, released July 20, 2025 (copyright 2026), ISBN 978-1-032-95831-6. https://www.routledge.com/Value-Stream-40-A-Systems-View-of-Information-Flow-for-Digitalization/Metternich-Meudt-Hartmann/p/book/9781032958316 (verified 11/20/2026)
16. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (iFAKT GmbH): Dynamische Simulation von Wertströmen. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html (verified 11/20/2026)
17. Drees, J. (iFAKT GmbH): Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
18. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
19. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
20. ECOWERT – Echtzeitorientierte Wertstromanalyse für die nachhaltige Produktionsoptimierung (reference project). Fraunhofer IPA. https://www.ipa.fraunhofer.de/de/referenzprojekte/ECOWERT.html (verified 11/20/2026)
21. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen. IT&Production, January 12, 2023 (updated July 23, 2024). https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/ (verified 11/20/2026)
22. Digitalized value stream analysis: We are automating the gemba walk. Fraunhofer IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/production-management-and-value-stream-mapping-and-design/WertstromDigital.html (verified 11/20/2026)
23. Lugert, A.; Winkler, H.: Von der Wertstromanalyse zum Wertstrommanagement. ZWF 112 (4), 2017, pp. 261–265. DOI: 10.3139/104.111703. https://www.degruyterbrill.com/document/doi/10.3139/104.111703/html
24. Urnauer, C.: Die digitale Wertstrommethode. ZWF 114, 2019 (issue and pages not shown at access). DOI: 10.3139/104.112203. https://www.degruyterbrill.com/document/doi/10.3139/104.112203/html
25. Busch, O.; Niehues, M.; Maassen, K.: Die monetäre Bewertung von Wertströmen. ZWF 113 (6), 2018, pp. 389–392. DOI: 10.3139/104.111935. https://www.degruyterbrill.com/document/doi/10.3139/104.111935/html
26. Bega, M.; Sapel, P.; Ercan, F.; Schramm, T.; Spitz, M.; Kuhlenkötter, B.; Hopmann, C.: Extension of value stream mapping 4.0 for comprehensive identification of data and information flows within the manufacturing domain. Production Engineering 17 (6), 2023, pp. 915–927. DOI: 10.1007/s11740-023-01207-5. https://link.springer.com/10.1007/s11740-023-01207-5
27. Wertstromanalyse. Wikipedia (German-language). https://de.wikipedia.org/wiki/Wertstromanalyse (verified 11/20/2026)
28. Polaris VSM – Digital Value Stream Tool in Lean Management (vendor page). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/ (verified 11/20/2026)
29. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536 (verified 11/20/2026)
30. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1 (verified 11/20/2026)
31. Value Stream Management Platforms. Gartner Peer Insights. https://www.gartner.com/reviews/market/value-stream-management-platforms (verified 11/20/2026)
32. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (Japanese original 1978). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
33. Liker, J. K.: The Toyota Way: 14 Management Principles from the World's Greatest Manufacturer. McGraw-Hill, New York 2004, ISBN 978-0-07-139231-0.
34. SimVSM – digital value stream analysis. SimPlan AG. https://www.simplan.de/en/software/simvsm (verified 11/20/2026)
35. Plant Simulation X – Value Stream Mapping. Siemens. https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/ (verified 11/20/2026)
36. Was ist eine Wertstromanalyse? (What is a value stream analysis?) ONIQ (German). https://oniq.com/de/ressourcen/was-ist-eine-wertstromanalyse (verified 11/20/2026)
37. Wertstromanalyse (REFA lexicon). REFA Bundesverband. https://refa.de/service/refa-lexikon/wertstromanalyse
38. Wertstromanalyse: Anleitung, Kennzahlen, Symbole. Industriezeitschrift (German). https://industriezeitschrift.de/qualitaet/wertstromanalyse/
39. Kersten, M.: Project to Product: How to Survive and Thrive in the Age of Digital Disruption with the Flow Framework. IT Revolution Press, Portland 2018, ISBN 978-1-942788-39-3.
40. ISO 22468:2020 Value stream management (VSM). ISO/TC 154, published March 9, 2020, confirmed June 25, 2025. https://committee.iso.org/standard/73292.html (verified 11/20/2026) · Table of contents (DIN): https://www.din.de/de/mitwirken/normenausschuesse/nia/veroeffentlichungen/wdc-beuth:din21:322285827/toc-3156892/download
41. Fuchs, H.-W.: Wertstrom-Methode (diploma thesis). Hochschule Mittweida. https://monami.hs-mittweida.de/frontdoor/deliver/index/docId/796/file/DA_Wertstrommethode.pdf
42. Wertstromanalyse (Value Stream Mapping). Mind Logistik (German). https://mind-logistik.de/knowhow/wertstromanalyse/
43. Small Chart, Big Impact: How a Simple Spaghetti Chart Led to Huge Wins at Thrustmaster of Texas. Lean Enterprise Institute, The Lean Post, February 4, 2016. https://www.lean.org/the-lean-post/articles/small-chart-big-impact-how-a-simple-spaghetti-chart-led-to-huge-wins-at-thrustmaster-of-texas/ (verified 11/20/2026)
44. The Karen Martin Group: Lean Terminology (glossary, PDF, 2014): definitions of activity ratio, lead time, process time, %C&A and rolled first pass yield. https://tkmg.com/wp-content/files/Lean-Terminology.pdf (verified 11/20/2026)
45. Value-Stream Mapping (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/ (verified 11/20/2026)
46. Value Stream Mapping. ASQ, Quality Resources (adapted from "Lean Lessons: Value Stream Mapping – An Introduction", Quality Progress). https://asq.org/quality-resources/lean/value-stream-mapping (verified 11/20/2026)
47. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (verified 11/20/2026)
48. Lean & Environment Toolkit, Chapter 3 (Value Stream Mapping). US Environmental Protection Agency. https://epa.gov/sustainability/lean-environment-toolkit-chapter-3 (verified 11/20/2026)
49. Value-stream mapping. Wikipedia (English). https://en.wikipedia.org/wiki/Value-stream_mapping (verified 11/20/2026)
50. ISA-95 framework and layers. Siemens. https://www.siemens.com/en-us/technology/isa-95-framework-layers/ (verified 11/20/2026)
51. 8 Wastes (DOWNTIME). GoLeanSixSigma.com. https://goleansixsigma.com/8-wastes/ (verified 11/20/2026)
