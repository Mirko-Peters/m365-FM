# SEO metadata

| Field | Value |
|---|---|
| Meta title | Digitaler Zwilling in der Fertigung: Der komplette Leitfaden |
| Meta description | Digitaler Zwilling in der Fertigung erklärt: Twin vs. Shadow vs. Simulation, Fabriksimulation, virtuelle Inbetriebnahme, FTF, ISO 23247 und Fahrplan. |
| Slug | `digital-twin-manufacturing` |

# Digitaler Zwilling in der Fertigung: Der vollständige Leitfaden zu Fabriksimulation, Materialfluss und virtueller Inbetriebnahme

*Ostatnia aktualizacja: 20 listopada 2026 r. · Przegląd techniczny przeprowadzony na podstawie norm, źródeł pierwotnych i publikacji wymienionych w sekcji Źródła*

> **Krótka odpowiedź:** Cyfrowy bliźniak w produkcji to wykonywalna cyfrowa reprezentacja produktów, procesów i zasobów fabryki, która jest aktualizowana danymi z rzeczywistych operacji, najlepiej automatycznie. Używa się go do symulowania działań, wcześniejszej oceny wąskich gardeł i scenariuszy, wirtualnego uruchamiania oprogramowania sterującego oraz podejmowania decyzji, zanim cokolwiek zmieni się na rzeczywistej hali produkcyjnej.

Pojęcie „cyfrowy bliźniak” jest używane tak swobodnie, że prawie przestało cokolwiek znaczyć. Model 3D budynku nazywa się cyfrowym bliźniakiem. Tak samo nazywa się pulpit z danymi z maszyn, a czasem arkusz planowania mocy produkcyjnych z komórkami w kolorze czerwonym, żółtym i zielonym. Dla kierowników zakładów i działów operacyjnych to realny problem: jeśli nie wiadomo dokładnie, co chce się zbudować, kupuje się niewłaściwe rozwiązanie, zbiera dane bez pytania, na które mają odpowiedzieć, i po roku zostaje kosztowny projekt wizualizacyjny, który nie poprawia żadnej decyzji.

Ten przewodnik wyjaśnia terminologię i omawia każdą warstwę: od genezy koncepcji u Michaela Grievesa i NASA, przez normy (ISO 23247, ISA-95, Asset Administration Shell oraz niemieckie wytyczne VDI dotyczące symulacji i wirtualnego uruchamiania, na których nadal opiera się znaczna część przemysłu), po praktyczne pytanie, jak wyprowadzić użyteczny bliźniak produkcji z danych, które już znajdują się w systemie ERP. Uwaga koncentruje się na tym, co faktycznie rozstrzygają zespoły produkcyjne: planowaniu fabryki i układu, zdolnościach produkcyjnych i wąskich gardłach, mix produktowym, jakości harmonogramu, wirtualnym uruchamianiu oraz doborze floty pojazdów z automatycznym prowadzeniem (AGV). Zwięzła definicja znajduje się na stronie hasła [Digital Twin](https://www.m365.fm/entity/digital-twin/).

### Kluczowe wnioski

- **Cyfrowy bliźniak** różni się od modelu cyfrowego i cienia cyfrowego **automatycznym przepływem danych w obu kierunkach** [5]. W planowaniu fabryki wiele skutecznych rozwiązań celowo działa jako model lub cień i nie jest to wada.
- Rdzeniem bliźniaka produkcji jest **model produkt-proces-zasób (PPR)**: co się wytwarza (zestawienie materiałowe), jak (marszruta, czasy, sekwencje) i z czego (maszyny, ludzie, powierzchnia, transport wewnętrzny). Większość tych danych już znajduje się w Twoim **systemie ERP**.
- **Symulacja** zamienia model w narzędzie decyzyjne. W produkcji i logistyce dominuje **symulacja zdarzeń dyskretnych**; klasycznym źródłem metodycznym jest niemiecka wytyczna VDI 3633 [13], a standardowym amerykańskim podręcznikiem jest *Simulation Modeling and Analysis* Lawa [41].
- Kluczowe normy to **ISO 23247** (struktura cyfrowego bliźniaka w produkcji, części 1–4 z 2021 r., części 5 i 6 z 2026 r.) [6][7][8], **IEC 63278-1** (Asset Administration Shell) [10] oraz **ISA-95 / IEC 62264** (integracja przedsiębiorstwa ze sterowaniem) [58]. NIST wspiera ISO 23247 wytycznymi dotyczącymi zastosowań i implementacjami referencyjnymi dla producentów z USA [47][48].
- Zacznij od **jednej konkretnej decyzji**, a nie od platformy. Bliźniak bez pytania staje się cmentarzyskiem danych.
- O sukcesie lub porażce decyduje **jakość danych**: normatywy czasowe, czasy przezbrojeń, kalendarze zmian i zapisy przestojów są często mniej dokładne, niż sugerują dane podstawowe.
- W Microsoft **Azure Digital Twins** to ogólnie dostępna usługa PaaS obsługująca DTDL w wersjach v2 i v3 [21][22]; **digital twin builder w Microsoft Fabric** jest w chwili pisania tego tekstu oznaczony jako **wersja zapoznawcza** [23].

### Ścieżki lektury dla zajętych czytelników

| Jesteś ... | Najpierw przeczytaj |
|---|---|
| Inżynierem produkcji lub planistą fabryki | Rozdziały 2, 6, 7 i 10 (definicje, symulacja, przypadki użycia, plan wdrożenia) |
| Kierownikiem zakładu, wiceprezesem ds. operacji, członkiem zarządu | Krótką odpowiedź, rozdziały 4, 12 i 13 (dojrzałość, koszty i korzyści, częste błędy) |
| Inżynierem sterowania lub automatyki | Rozdział 7.5 (wirtualne uruchamianie) oraz 14 (normy) |
| Kierownikiem projektu intralogistyki, AGV/AMR | Rozdział 7.6 (planowanie floty AGV i AMR) |
| Administratorem M365/Azure, architektem IT/OT | Rozdziały 5, 8 i 16 (architektura, usługi Microsoft, bezpieczeństwo) |

## Spis treści

1. [Czym jest cyfrowy bliźniak w produkcji?](#1-czym-jest-cyfrowy-bliźniak-w-produkcji)
2. [Model cyfrowy vs. cień cyfrowy vs. cyfrowy bliźniak](#2-model-cyfrowy-vs-cień-cyfrowy-vs-bliźniak-cyfrowy)
3. [Rodzaje cyfrowych bliźniaków w produkcji](#3-rodzaje-cyfrowych-bliźniaków-w-produkcji)
4. [Poziomy dojrzałości: od reprezentacji do samooptymalizującego się systemu](#4-poziomy-dojrzałości-od-reprezentacji-do-systemu-samooptymalizującego-się)
5. [Architektura i fundament danych: ERP, MES, PLM, IoT](#5-architektura-i-fundament-danych-erp-mes-plm-iot)
6. [Symulacja w centrum: symulacja fabryki, przepływu materiałów i strumienia wartości](#6-symulacja-w-centrum-uwagi-symulacja-fabryki-przepływu-materiałów-i-strumienia-wartości)
7. [Przypadki użycia i dane, których każdy z nich wymaga](#7-zastosowania-i-dane-których-każde-z-nich-wymaga)
8. [Cyfrowe bliźniaki z Microsoft Azure i Fabric](#8-cyfrowe-bliźniaki-z-microsoft-azure-i-fabric)
9. [Sztuczna inteligencja a cyfrowy bliźniak](#9-sztuczna-inteligencja-a-cyfrowy-bliźniak)
10. [Mapa drogowa: wdrożenie w sześciu fazach](#10-plan-wdrożenia-realizacja-w-sześciu-fazach)
11. [Jakość danych: niedoceniany warunek wstępny](#11-jakość-danych-niedoceniany-warunek-wstępny)
12. [Koszt i korzyść, ocenione rzetelnie](#12-koszty-i-korzyści-ocenione-uczciwie)
13. [Typowe błędy i jak ich unikać](#13-typowe-błędy-i-jak-ich-unikać)
14. [Normy i wytyczne w skrócie](#14-normy-i-wytyczne-w-skrócie)
15. [Kategorie oprogramowania: neutralne porównanie](#15-kategorie-oprogramowania-porównanie-neutralne)
16. [Bezpieczeństwo, własność danych i regulacje](#16-bezpieczeństwo-własność-danych-i-regulacje)
17. [Budowa bliźniaka na podstawie danych z ERP i strumienia wartości z iFAKT Polaris](#17-budowa-bliźniaka-cyfrowego-na-podstawie-danych-erp-i-strumienia-wartości-z-ifakt-polaris)
18. [Słowniczek](#18-glosariusz)
19. [FAQ: cyfrowe bliźniaki w produkcji](#19-faq-cyfrowe-bliźniaki-w-produkcji)
20. [Podsumowanie](#20-zakończenie)

## 1. Czym jest cyfrowy bliźniak w produkcji?

### Robocza definicja

W praktyce produkcyjnej sprawdziła się robocza definicja z trzema warunkami:

1. **Reprezentuje rzeczywisty odpowiednik.** Bliźniak odwzorowuje konkretny obiekt (maszynę, linię, zakład) lub konkretny proces, a nie ogólną klasę.
2. **Jest wykonywalny.** Zawiera nie tylko strukturę i geometrię, ale także zachowanie. Potrafi przesuwać stany, przeprowadzać operacje i odpowiadać na pytania typu „co się stanie, jeśli ...?”.
3. **Jest połączony z rzeczywistością danymi.** Jest aktualizowany na podstawie danych z eksploatacji, najlepiej automatycznie, a jego wyniki wracają do decyzji lub sterowania.

Bez punktu 2 mamy bazę danych lub model 3D. Bez punktu 3 mamy model symulacyjny. Oba są użyteczne, ale żaden z nich nie jest bliźniakiem w wąskim znaczeniu.

Instytucje amerykańskie definiują ten termin w podobny sposób. Definicja Digital Twin Consortium z 3 grudnia 2020 r. określa cyfrowego bliźniaka jako „wirtualną reprezentację rzeczywistych podmiotów i procesów, zsynchronizowaną z określoną częstotliwością i wiernością” [51]. Raport konsensusowy z 2024 r. Narodowych Akademii Nauk, Inżynierii i Medycyny, sponsorowany przez Departament Obrony USA, Departament Energii, Narodowe Instytuty Zdrowia i Narodową Fundację Nauki, opisuje cyfrowego bliźniaka jako zbiór wirtualnych konstrukcji informacyjnych, które odwzorowują strukturę, kontekst i zachowanie systemu, „są dynamicznie aktualizowane danymi ze swojego fizycznego bliźniaka, mają zdolność predykcji i wspierają decyzje przynoszące wartość”, i dodaje: „Dwukierunkowa interakcja między tym, co wirtualne, a tym, co fizyczne, jest sednem cyfrowego bliźniaka” [50]. NIST opisuje cyfrowych bliźniaków jako elektroniczne reprezentacje rzeczywistych podmiotów, które pozwalają obserwować te podmioty i zmiany ich stanu, oraz analizuje kwestie bezpieczeństwa i zaufania, jakie one rodzą [49]. Wszystkie trzy definicje zawierają te same elementy co powyższa robocza definicja: rzeczywisty odpowiednik, zachowanie i połączenie z danymi.

### Cyfrowy bliźniak, inteligentna fabryka, cyfrowa fabryka: uporządkowanie pojęć

W języku angielskim można spotkać określenia „digital twin in manufacturing", „manufacturing digital twin", „factory digital twin" i „production digital twin" używane dla tego samego pojęcia. **Inteligentna fabryka** (smart factory, smart manufacturing) to coś innego: połączony, w dużej mierze samoorganizujący się zakład jako docelowy obraz Przemysłu 4.0. Cyfrowy bliźniak jest jednym z jej narzędzi, a nie synonimem. **Fabryka cyfrowa** (digital factory) to starszy, zorientowany na planowanie termin nadrzędny z niemieckiej wytycznej VDI 4499, obejmujący cyfrowe modele, metody i narzędzia (patrz niżej); w Ameryce Północnej najbliższe potoczne określenia to „digital manufacturing" i „virtual manufacturing". Terminy takie jak symulacja produkcji, symulacja fabryki i symulacja przepływu materiałów opisują metody, z których cyfrowy bliźniak może korzystać. **Cyfrowa nić** (digital thread) opisuje połączony przepływ informacji w całym cyklu życia; ISO 23247-5 odnosi się do niej obecnie wprost [7].

### Źródła: od Grievesa i NASA do Przemysłu 4.0

Koncepcja wywodzi się z zarządzania cyklem życia produktu (PLM). Michael Grieves przedstawił w 2002 roku model łączący przestrzeń rzeczywistą, przestrzeń wirtualną oraz przepływ danych i informacji między nimi. Pierwszą prezentację datuje na forum menedżerskie Society of Manufacturing Engineers (SME) w październiku 2002 roku oraz na wystąpienie na University of Michigan w grudniu 2002 roku [2]. Model nazywano najpierw „Mirrored Spaces Model" (2005), potem „Information Mirroring Model" (2006), a później „Digital Twin"; według Grievesa sama koncepcja pozostała ta sama [2]. Grieves przypisuje nazwę „digital twin" Johnowi Vickersowi z NASA [1][2]. Inni autorzy wskazują, że historia pochodzenia pojęcia nie jest udokumentowana bez luk i że istniały wcześniejsze poprzedniki, takie jak badania nad wirtualnym wytwarzaniem w latach 90. XX wieku [4].

Termin zyskał szeroki rozgłos dzięki lotnictwu i kosmonautyce. NASA opisała cyfrowego bliźniaka w swojej mapie drogowej technologii „Modeling, Simulation, Information Technology & Processing" (Shafto i in., wersja robocza 2010) [4]. W 2012 roku Glaessgen i Stargel sformułowali często cytowaną definicję cyfrowego bliźniaka dla NASA i sił powietrznych USA jako „zintegrowana, wielofizyczna, wieloskalowa, probabilistyczna symulacja rzeczywiście zbudowanego pojazdu lub systemu", która łączy symulację o bardzo wysokiej wierności z monitorowaniem stanu technicznego, historią konserwacji i danymi o flocie, by odzwierciedlać cykl życia swojego latającego bliźniaka [3].

W niemieckim przemyśle termin związał się z Industrie 4.0 od połowy lat 10. XXI wieku. Spotkał tam starszą, niezależną tradycję: **fabrykę cyfrową** (VDI 4499) i **symulację zdarzeń dyskretnych przepływu materiałów** (VDI 3633). W USA symulacja fabryk wyrosła z badań operacyjnych i inżynierii przemysłowej, z podręcznikami takimi jak Lawa [41] oraz komercyjnymi narzędziami do symulacji zdarzeń dyskretnych. Po obu stronach Atlantyku wiele narzędzi sprzedawanych dziś jako cyfrowi bliźniacy jest metodologicznie potomkami tej symulacji fabrycznej. Więcej kontekstu znajduje się na stronie encji [Industry 4.0](https://www.m365.fm/entity/industry-4-0/).

### Formalne definicje w normach

Formalne normy istnieją od 2021 roku. **ISO 23247** („Automation systems and integration: Digital twin framework for manufacturing") określa ramy cyfrowych bliźniaków w produkcji. Części 1–4 (przegląd, architektura referencyjna, cyfrowa reprezentacja elementów produkcyjnych, wymiana informacji) opublikowano w październiku 2021 roku (część 1 — 21 października 2021) [6]. Część 5 („Digital thread for digital twin") i część 6 („Digital twin composition", opublikowana 14 lipca 2026) pojawiły się w 2026 roku [7][8]. **ISO/IEC 30173:2023** ustala międzybranżowe terminy i pojęcia, w tym procesy cyklu życia, typy cyfrowych bliźniaków, widok funkcjonalny i interesariuszy [9].

Dla producentów z USA NIST oferuje praktyczny punkt wejścia do ISO 23247. Jego raport *Use Case Scenarios for Digital Twin Implementation Based on ISO 23247* (NIST AMS 400-2, Guodong Shao, maj 2021) powstał wyraźnie po to, by ograniczyć zamieszanie wokół cyfrowych bliźniaków wśród małych i średnich producentów, i omawia trzy przypadki użycia zbudowane na tej ramie [47]. Trwający projekt NIST „Digital Twins for Advanced Manufacturing" wspiera ISO 23247, pracuje nad implementacją referencyjną części 5 (cyfrowa nić) i proponuje ramy weryfikacji, walidacji i kwantyfikacji niepewności (VVUQ) jako przyszłą część 7; wskazuje „brak norm" jako główną barierę wdrożeniową [48].

W planowaniu fabryki wciąż wpływowa jest niemiecka definicja Cyfrowej Fabryki zawarta w VDI 4499 część 1. Wydanie z 2008 roku brzmi (nasze tłumaczenie): „Cyfrowa Fabryka to ogólne określenie obejmujące kompleksową sieć cyfrowych modeli, metod i narzędzi, w tym symulację i trójwymiarową wizualizację, zintegrowanych przez ciągłe zarządzanie danymi. Jej celem jest całościowe planowanie, ocena i stałe doskonalenie wszystkich istotnych struktur, procesów i zasobów rzeczywistej fabryki w powiązaniu z produktem.” [17] Nowe wydanie VDI 4499 część 1 ukazało się w kwietniu 2026 roku i obejmuje pojęcie, cele, procesy, zarządzanie danymi oraz architekturę systemu Cyfrowej Fabryki [16]. Jeśli cytujesz tę normę, sprawdź, czy brzmienie nowego wydania się różni.

Zwróć uwagę na sformułowanie „struktur, procesów i zasobów ... w powiązaniu z produktem”. Zawiera ono już myślenie w kategoriach produkt–proces–zasób, na którym opiera się bliźniak produkcyjny (zob. rozdział 5, „Model produkt–proces–zasób w centrum uwagi”).

## 2. Model cyfrowy vs. cień cyfrowy vs. bliźniak cyfrowy

Najczęściej cytowane rozróżnienie w odniesieniu do produkcji pochodzi od Kritzingera, Karnera, Traara, Henjesa i Sihna (Fraunhofer Austria) z 2018 roku [5]. Wyróżniają oni trzy poziomy integracji w zależności od tego, jak dane przepływają między obiektem fizycznym a cyfrowym.

| Atrybut | Model cyfrowy | Cień cyfrowy | Bliźniak cyfrowy |
|---|---|---|---|
| Przepływ danych fizyczny → cyfrowy | ręczny | automatyczny | automatyczny |
| Przepływ danych cyfrowy → fizyczny | ręczny | ręczny | automatyczny |
| Typowy przykład | model symulacyjny planowanej linii, układ CAD | model symulacyjny aktualizowany codziennie zleceniami i potwierdzeniami z ERP/MES | model, który automatycznie przesyła sekwencje produkcyjne lub parametry z powrotem do systemu sterowania |
| Stan obiektu fizycznego | nie musi istnieć | istnieje, jest obserwowany | istnieje, jest obserwowany i oddziaływany |
| Typowe zastosowanie | planowanie fabryki, greenfield, decyzja o inwestycji kapitałowej | monitorowanie, analiza stanu obecnego, prognozowanie, weryfikacja harmonogramu | sterowanie w pętli zamkniętej, szczegółowe szeregowanie, autonomiczna optymalizacja |
| Wymagania wobec IT i zarządzania | niskie | średnie (interfejsy, jakość danych) | wysokie (czas rzeczywisty, bezpieczeństwo, procesy zatwierdzania) |

W swoim przeglądzie literatury Kritzinger i in. stwierdzili, że publikacje dotyczące najwyższego poziomu, prawdziwego bliźniaka, są rzadkie, podczas gdy modele i cienie są opisywane znacznie częściej [5]. Odpowiada to praktyce: w planowaniu fabryki i produkcji automatyczne sprzężenie zwrotne do systemów sterowania często nie jest nawet pożądane. Planista chce porównywać scenariusze, a następnie podejmować świadomą decyzję. Model, który zmienia kolejność produkcji bez zatwierdzenia, byłby w wielu zakładach nie do przyjęcia, zarówno organizacyjnie, jak i pod względem odpowiedzialności.

Konsekwencja dla Twojego projektu: nie pytaj „Czy mamy prawdziwego bliźniaka?”. Zapytaj „Jakiego poziomu integracji wymaga decyzja, którą chcemy usprawnić?”. Do decyzji kapitałowej dotyczącej nowego budynku montażowego wystarczy dobrze zwalidowany model. Do codziennego sprawdzania, czy harmonogram na dany tydzień jest realistyczny, potrzebujesz cienia z automatycznym zasilaniem danymi. Pełny bliźniak opłaca się dopiero przy sterowaniu w pętli zamkniętej, na przykład przy automatycznym szeregowaniu na wąskim gardle.

**Drugie spojrzenie na „cień”:** W niemieckiej inżynierii produkcji określenie „cień cyfrowy” bywa używane węziej – jako wystarczająco dokładny, dostosowany do zadania obraz danych produkcyjnych, bez możliwości symulacji. Niektórzy dostawcy opisują też cień jako „statyczną kopię danych historycznych”. Te odczytania różnią się od ujęcia Kritzingera i in. Źródła amerykańskie rzadko w ogóle używają terminu „cień cyfrowy” i często nazywają bliźniakiem każdy poziom. Jeśli użyjesz któregokolwiek z tych terminów w zapytaniu ofertowym (RFP) lub dokumencie wymagań, zdefiniuj je wyraźnie.

## 3. Rodzaje cyfrowych bliźniaków w produkcji

Cyfrowe bliźniaki można klasyfikować według obiektu, który odwzorowują, oraz według fazy cyklu życia. Poniższa klasyfikacja jest powszechna w literaturze i w praktyce, ale nie jest znormalizowana; norma ISO/IEC 30173 opisuje rodzaje cyfrowych bliźniaków na poziomie bardziej ogólnym [9]. W amerykańskich opracowaniach popularnych często stosuje się czteropoziomowy podział na bliźniaki komponentów (lub części), bliźniaki zasobów, bliźniaki systemów (lub jednostek) i bliźniaki procesów, spopularyzowany przez IBM [52]. Poniższa tabela jest bardziej szczegółowa i odnosi się do produkcji.

| Typ | Odwzorowuje | Typowe pytania | Główne źródła danych |
|---|---|---|---|
| Bliźniak produktu | produkt w całym cyklu życia (geometria, warianty, właściwości, stan w eksploatacji) | Czy konstrukcja spełnia wymagania? Jak produkt zachowuje się w użytkowaniu? | CAD, PLM, analizy (MES, CFD, FEA), dane z eksploatacji |
| Bliźniak procesu | proces wytwórczy (frezowanie, spawanie, wtrysk, montaż) | Jakie parametry zapewniają stabilną jakość? Gdzie powstają braki i przeróbki? | sterowania maszyn, czujniki, dane jakościowe, modele procesowe |
| Bliźniak maszyny lub zasobu | maszynę lub urządzenie z kinematyką, logiką sterowania i stanem | Czy logika PLC działa poprawnie? Kiedy należy wykonać konserwację? | mechaniczny CAD, elektryczny CAD, program PLC, dane o stanie |
| Bliźniak produkcji lub fabryki | współdziałanie zleceń, procesów, zasobów, przepływu materiałów i logistyki | Czy jest wystarczająca zdolność produkcyjna? Gdzie jest wąskie gardło? Jaki układ, jaki bufor, ile AGV? | ERP, MES, dane o strumieniu wartości, układ, harmonogramy zmian |
| Bliźniak wydajności lub operacyjny | bieżące wskaźniki wydajności systemu | Jakie są trendy OEE, czasu realizacji, terminowości dostaw i zużycia energii? | MES, system zbierania danych produkcyjnych, liczniki energii, IoT |
| Bliźniak łańcucha dostaw | dostawców, zakłady, transport, zapasy | Co się stanie, jeśli dostawca zawiedzie? Gdzie utrzymywać zapas bezpieczeństwa? | ERP, SCM, dane logistyczne |

Typy te nie są ostro rozdzielone; zagnieżdżają się one wzajemnie. Bliźniak fabryki może zawierać bardziej szczegółowy bliźniak zasobu dla jednej maszyny stanowiącej wąskie gardło. Kompozycję kilku bliźniaków obejmuje właśnie nowa część 6 normy ISO 23247 [8].

**Fazy cyklu życia:** Wielu autorów rozróżnia też bliźniaka „jak zaprojektowany” (stan planistyczny), „jak zbudowany” (faktycznie wykonany) oraz „jak eksploatowany” lub „jak utrzymywany” (w eksploatacji). Ma to znaczenie przy planowaniu fabryki: model planistyczny opisuje zakład, który jeszcze nie istnieje, dlatego nie wolno go mylić z danymi eksploatacyjnymi, których jeszcze nie może być.

**Poziomy szczegółowości:** W symulacji zdarzeń dyskretnych rozróżnia się także poziomy agregacji, od poziomu sieci i zakładu, przez obszar, linię i gniazdo, aż do pojedynczej maszyny. Wytyczne VDI 3633 obejmują symulację na poziomie maszyny z ruchem 3D, a symulację procesu w osobnej części [13]. Sztuką jest wybrać poziom możliwie ogólny, lecz tak szczegółowy, jak to konieczne.

## 4. Poziomy dojrzałości: od reprezentacji do systemu samooptymalizującego się

Modele dojrzałości pomagają ocenić punkt wyjścia i wyznaczyć realistyczne cele. W krajach niemieckojęzycznych szeroko stosowany jest **acatech Industrie 4.0 Maturity Index** (acatech to Niemiecka Akademia Nauk i Inżynierii). Opisuje on sześć etapów rozwoju i ocenia zasoby, systemy informatyczne, kulturę oraz strukturę organizacyjną; zaktualizowana wersja ukazała się w 2020 roku [20]. Etapy to: komputeryzacja, łączność, widoczność, przejrzystość, zdolność predykcyjna i adaptacyjność.

W odniesieniu do cyfrowego bliźniaka przekłada się to na praktyczną skalę:

| Poziom | Pytanie przewodnie | Co dostarcza bliźniak | Warunek wstępny |
|---|---|---|---|
| 1 Reprezentować | Co mamy? | ustrukturyzowany model produktów, procesów, zasobów (dane podstawowe, układ) | utrzymywane dane podstawowe, spójne nazewnictwo |
| 2 Obserwować | Co się dzieje? | aktualny stan z potwierdzeń, danych maszynowych, zapasów (widoczność) | interfejsy do ERP/MES, znaczniki czasu |
| 3 Rozumieć | Dlaczego tak się dzieje? | analiza przyczyn źródłowych, identyfikacja wąskich gardeł, analiza odchyleń (przejrzystość) | dane historyczne, definicje wskaźników |
| 4 Przewidywać | Co się wydarzy? | symulacja i prognozowanie czasu realizacji, wykorzystania, terminów | zwalidowany model symulacyjny, dane planistyczne |
| 5 Rekomendować | Co powinniśmy zrobić? | porównanie scenariuszy, optymalizacja, rekomendowane działania | funkcja celu, metody optymalizacji |
| 6 Działać | Co dzieje się automatycznie? | zamknięta pętla sterowania (adaptacyjność) | koncepcja zatwierdzania, bezpieczeństwo IT, jasno określona odpowiedzialność |

W materiałach konsultingowych i dostawców często spotyka się krótszy podział na bliźniaki opisowe, predykcyjne i preskryptywne. Odpowiada on w przybliżeniu poziomom 2–3, 4 oraz 5–6 z tabeli.

**Ważne:** Poziomy nie są obowiązkową sekwencją. Bliźniak do planowania fabryki może być bardzo wartościowy już na poziomie 4, nigdy nie osiągając poziomu 2, ponieważ planowany zakład jeszcze nie istnieje. Z kolei pulpit monitorujący na poziomie 2 nie jest krokiem do symulacji, jeśli jego model danych nie zawiera logiki procesów. Planuj poziomy na podstawie pytania, a nie modelu.

## 5. Architektura i fundament danych: ERP, MES, PLM, IoT

### Model referencyjny ISO 23247

ISO 23247-2 organizuje cyfrowego bliźniaka produkcji w domeny [6][43]:

- **Obserwowalne elementy produkcji:** personel, wyposażenie, materiał, procesy produkcyjne, obiekty, otoczenie, produkty i dokumenty pomocnicze [6]. Znajdują się poza bliźniakiem, ale są przez niego reprezentowane.
- **Komunikacja urządzeń:** zbieranie danych i sterowanie urządzeniami, np. połączenia ze sterownikami, czujniki i bramki.
- **Cyfrowy bliźniak (rdzeń):** reprezentacja, synchronizacja, aplikacje i usługi, takie jak symulacja, analityka i walidacja harmonogramu.
- **Użytkownik:** osoby i aplikacje korzystające z bliźniaka, np. stanowiska planistów lub systemy przedsiębiorstwa, takie jak ERP i MES.
- **Funkcje międzysystemowe:** translacja danych, zapewnienie jakości danych i bezpieczeństwo.

Ten model jest neutralny dostawcowo i dobrze nadaje się jako szkielet dokumentu wymagań lub zapytania ofertowego (RFP). NIST zastosował dokładnie tę strukturę w swoich trzech scenariuszach przypadków użycia ISO 23247 [47]. Przede wszystkim jasno pokazuje jedno: bliźniak to nie wizualizacja. To warstwa pośrednia, która reprezentuje, synchronizuje i oblicza.

### Systemy według poziomów ISA-95: kto dostarcza jakie dane?

Norma ISA-95 (ANSI/ISA-95, w wersji międzynarodowej IEC 62264) porządkuje systemy zakładu na poziomy oparte na modelu Purdue [58][19][42]: poziom 0 to proces fizyczny, poziom 1 to czujniki i elementy wykonawcze, poziom 2 to sterowanie procesem (PLC, SCADA, HMI), poziom 3 to zarządzanie operacjami produkcyjnymi (MES), a poziom 4 to planowanie biznesowe i logistyka (ERP). ISA zauważa, że norma dotyczy przede wszystkim interfejsu między poziomami 3 i 4 [58]. Dla cyfrowego bliźniaka daje to przejrzystą mapę danych:

| System (poziom) | Dostarcza do bliźniaka | Typowa szczegółowość | Typowe słabe strony |
|---|---|---|---|
| ERP (4) | dane główne materiałów, zestawienia materiałowe, marszruty, gniazda robocze, zdolności produkcyjne, kalendarze zmian, zlecenia sprzedaży i produkcyjne, potwierdzenia | zlecenie, operacja, dzień/zmiana | nieaktualne normy czasowe, płaskie czasy przezbrojeń, zbyt grube grupy gniazd roboczych |
| MES (3) | rzeczywiste czasy, przyczyny przestojów, ilości, braki, przydział pracowników, kolejności | operacja, minuta | niespójne kody przyczyn przestojów, luki w ręcznych wpisach |
| PLM/CAD | struktura wyrobu (EBOM), geometria, warianty, poziomy zmian | część, wersja | EBOM i zestawienie materiałowe produkcyjne (MBOM) niezsynchronizowane |
| Układ/CAD hali | powierzchnia, przejścia, pozycje, przenośniki | stopa/metr | układy nieaktualne, obiekty istniejące często nieudokumentowane |
| PLC/SCADA (2) | stany, czasy cykli, sygnały | milisekunda do sekundy | niewiele znaczą bez kontekstu (które zlecenie?) |
| IoT/czujniki (1) | energia, temperatura, drgania, pozycja (np. AGV) | sekunda | duża objętość danych, brak mapowania zasobów |
| Magazyn/logistyka wewnętrzna (WMS, system zarządzania flotą AGV) | zapasy, zlecenia transportowe, czasy przejazdów | zlecenie, sekunda | czasy przejazdów często nie są archiwizowane |

Dla bliźniaka produkcji i hali fabrycznej większość potrzebnej struktury znajduje się na poziomach 3 i 4. Dane z maszyn z poziomów 1 i 2 poprawiają rozkłady i modele przestojów, ale rzadko są punktem wyjścia. Jeśli łączysz maszyny, najważniejsze są dwa otwarte standardy: OPC UA (IEC 62541) oraz, powszechny w amerykańskich warsztatach maszynowych, **MTConnect**, otwarty standard interoperacyjności danych produkcyjnych, opublikowany również jako norma ANSI (ANSI/MTC1.4-2018) [57]. NIST wymienia interfejs MTConnect dla bliźniaków cyfrowych wśród swoich prac projektowych [48]. Wpis [From ERP to the shop floor: the digital twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/) pokazuje, jak w praktyce wygląda ten most od ERP do hali produkcyjnej. Podstawy ERP znajdziesz na stronie hasła [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/).

### Model produkt-proces-zasób jako rdzeń

W praktyce fabryki cyfrowej zasadą strukturyzującą stał się **model produkt-proces-zasób (PPR)**. Łączy on trzy widoki:

- **Produkt:** Co jest wytwarzane? Wyroby końcowe, zespoły, części i ich powiązania (zestawienie materiałowe, warianty).
- **Proces:** Jak jest wytwarzane? Operacje, sekwencje, zależności poprzednik-następnik, czasy (przezbrojenie, czas wykonania, transport), wielkości partii.
- **Zasób:** Za pomocą czego jest wytwarzane? Maszyny, gniazda robocze, ludzie o określonych kwalifikacjach, oprzyrządowanie, powierzchnia, środki transportu wewnętrznego, schematy zmianowe.

Wartość tkwi w **krawędziach** między węzłami: która operacja zużywa który zespół, na jakim zasobie, w jakim czasie, przy jakim ograniczeniu? Jeśli zamodelujesz tę sieć jako graf, można z niego automatycznie wyprowadzić schematy sieciowe, ścieżki krytyczne, zasoby wąskie gardła i modele symulacyjne. Taki graf jest także semantycznym fundamentem, na którym mogą działać algorytmy planowania i usługi AI.

Przewaga nad czystym bliźniakiem 3D lub IoT jest praktyczna: model PPR odpowiada na pytania, które planiści produkcji i hali zadają codziennie (zdolności, czas realizacji, wąskie gardło, zapotrzebowanie na pracę), a dużą ich część można zbudować z danych, które już istnieją.

### Budowa bliźniaka na podstawie danych ERP i strumienia wartości

Typowa historia bliźniaka cyfrowego zaczyna się od czujników. W pytaniach produkcyjnych to często zły punkt startu. Twój system ERP już zawiera plan Twojej fabryki w uporządkowanej formie:

| Obiekt ERP | Rola w bliźniaku |
|---|---|
| Dane główne materiału i zestawienie materiałowe (manufacturing BOM, MBOM) | struktura wyrobu, rozwinięcie zapotrzebowania, kolejność montażu |
| Marszruta z operacjami | logika procesu, kolejność, normy czasowe przezbrojenia i wykonania |
| Gniazdo robocze lub grupa gniazd roboczych | zasoby, dostępne zdolności, centrum kosztów |
| Kalendarz fabryczny i schematy zmian | dostępny czas, przerwy, dodatkowe zmiany |
| Zlecenia sprzedaży i prognozy | obciążenie, struktura asortymentu, terminy realizacji |
| Zlecenia produkcyjne i potwierdzenia | rzeczywiste czasy, rzeczywiste ilości, braki, postęp |
| Parametry zapasów i MRP | bufory, zapas bezpieczeństwa, reguły wielkości partii |

**Mapowanie strumienia wartości** zapewnia drugi, uzupełniający widok: uwidacznia przepływy materiałów i informacji, zapasy między procesami oraz logikę sterowania (push, pull, supermarket, FIFO), których tabele ERP zawierają jedynie w sposób pośredni. Mike Rother i John Shook spopularyzowali tę metodę w 1998 roku w książce *Learning to See*, wydanej przez Lean Enterprise Institute [40]. Połączcie logikę strumienia wartości z danymi głównymi ERP i potwierdzeniami produkcji, a otrzymacie model, który oddaje zarówno strukturę, jak i dynamikę systemu produkcyjnego. Odcinek [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) pokazuje, jak mapa strumienia wartości staje się żywym modelem danych; samą metodę wyjaśnia strona hasła [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/), a szczegółowo – nasz przewodnik po [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

Ta dyskusja nie jest w literaturze nowa. Już w 2014 roku Türck, Weimer, Schubert i Drees opisali w niemieckim czasopiśmie *Zeitschrift für wirtschaftlichen Fabrikbetrieb* (ZWF) przejście od statycznego mapowania strumieni wartości i jego metryk do dynamicznej symulacji strumieni wartości, pytając, jakie możliwości optymalizacji otwierają się po dodaniu czasu jako wymiaru [31]. W 2023 roku Böhm, Drees, Sai, Erlach, Stambera i Teriete przedstawili w ZWF uniwersalny interfejs danych dla cyfrowych usług strumienia wartości, który wykorzystuje oparte na zdarzeniach dane produkcyjne jako wspólną podstawę do obliczania metryk i wizualizacji; został on przetestowany w niemieckim projekcie badawczym ECOWERT [32].

### Semantyka i interoperacyjność: Asset Administration Shell, OPC UA, DTDL

Bliźniak cyfrowy, który istnieje wyłącznie w zastrzeżonej bazie danych, trudno rozbudować. Trzy standardy kształtują interoperacyjność:

- **Asset Administration Shell (AAS):** Koncepcja niemieckiej Plattform Industrie 4.0 dotycząca znormalizowanej cyfrowej reprezentacji zasobu. IEC 63278-1:2023 (opublikowana 14 grudnia 2023 roku) definiuje jej strukturę i ma umożliwić aplikacjom programowym jednolitą i bezpieczną wymianę informacji; dotyczy zasobów fizycznych, cyfrowych i niematerialnych w całym cyklu życia [10]. Treść jest uporządkowana w submodele, na przykład dla danych technicznych lub danych eksploatacyjnych. Niemiecki Referencyjny Model Architektury Industrie 4.0 (RAMI 4.0, DIN SPEC 91345:2016) opisuje strukturę i zachowanie komponentu Industrie 4.0, który wirtualnie reprezentuje zasób [12]; w koncepcji Plattform Industrie 4.0 AAS jest cyfrową częścią tego komponentu. Jej dalszy rozwój prowadzi **Industrial Digital Twin Association (IDTA)**, założone 24 września 2020 roku przez niemieckie stowarzyszenia branży inżynieryjnej i elektrotechnicznej VDMA i ZVEI wraz z Bitkom oraz 20 firmami [11]. Implementacją open-source jest Eclipse BaSyx, rozwijany m.in. przez Fraunhofer IESE [29].
- **OPC UA (IEC 62541):** Powszechnie stosowany, niezależny od producentów standard komunikacji z maszynami, z modelami informacji. Dla bliźniaka OPC UA ma znaczenie głównie na poziomach 1–3.
- **DTDL (Digital Twins Definition Language):** Oparty na JSON język modelowania firmy Microsoft dla Azure Digital Twins. Azure Digital Twins obsługuje DTDL w wersjach v2 i v3; Microsoft zaleca v3 [22].

Żaden z tych standardów sam w sobie nie wystarcza dla bliźniaków planowania produkcji, ponieważ opisują głównie zasoby, a nie logikę procesów i dynamikę zleceń. W praktyce łączy się więc model planowania (PPR, symulacja) ze znormalizowanymi opisami zasobów na potrzeby łączności.

## 6. Symulacja w centrum uwagi: symulacja fabryki, przepływu materiałów i strumienia wartości

### Czym jest symulacja i dlaczego obliczenia statyczne nie wystarczają

Wytyczna VDI 3633 Part 1 (wydanie z grudnia 2014), niemiecki dokument referencyjny, opisuje podstawy symulacji systemów logistycznych, przepływu materiałów i systemów produkcyjnych i jest adresowana do planistów, dostawców i operatorów [13]. Definiuje ona symulację jako odtwarzanie systemu wraz z jego dynamicznymi procesami w modelu, na którym można prowadzić eksperymenty, aby uzyskać wnioski możliwe do przeniesienia na rzeczywistość [13][30]. Podręcznik Lawa, szeroko stosowany na amerykańskich kierunkach inżynierii przemysłowej, omawia to samo zagadnienie od strony statystycznej [41].

Decydujący jest aspekt **dynamiki**. Arkuszowe obliczenie zdolności produkcyjnych operuje wartościami średnimi: zapotrzebowanie pomnożone przez czas obróbki, podzielone przez dostępny czas, daje wykorzystanie. Jeśli wszystkie wartości są poniżej 100 procent, plan wydaje się wykonalny. W rzeczywistości czasy napływu, obróbki, przezbrojeń i awarii ulegają zmianom. Teoria kolejek pokazuje, że przy zmiennych czasach czasy oczekiwania rosną nieproporcjonalnie wraz ze wzrostem wykorzystania, a przed stanowiskiem pracującym blisko granicy zdolności tworzą się duże kolejki. Interakcji między stanowiskami (blokowanie, głodzenie, wspólne zasoby, takie jak operatorzy czy suwnice) obliczenie statyczne w ogóle nie uchwyci.

**Przykład obliczeniowy:** Dla pojedynczego stanowiska przybliżenie Kingmana daje wyobrażenie o skali [46]. Średni czas oczekiwania przed stanowiskiem wynosi w przybliżeniu W ≈ (cₐ² + cₛ²) / 2 · u / (1 − u) · t, gdzie u to wykorzystanie, t to średni czas obróbki, a cₐ i cₛ to współczynniki zmienności czasów międzyprzybyć i obróbki. Załóżmy czas obróbki 10 minut i umiarkowaną zmienność (oba współczynniki zmienności równe 1):

| Wykorzystanie u | Czynnik u / (1 − u) | Średni czas oczekiwania przed stanowiskiem |
|---|---|---|
| 70% | 2,3 | ok. 23 minuty |
| 80% | 4 | ok. 40 minut |
| 90% | 9 | ok. 90 minut |
| 95% | 19 | ok. 190 minut |

Arkusz zdolności produkcyjnych we wszystkich czterech przypadkach pokazuje „mieści się”. W rzeczywistości czas oczekiwania prawie się pięciokrotnie zwiększa między 80 a 95 procentami wykorzystania. W linii z kilkoma stanowiskami, przezbrojeniami i awariami efekt jest jeszcze silniejszy i trudny do opanowania analitycznie. Tutaj właśnie pojawia się symulacja.

**Prawo Little'a** pozostaje użyteczną kontrolą poprawności: w stanie ustalonym średni zapas w systemie równa się średniemu natężeniu przepływu pomnożonemu przez średni czas przejścia (L = λ · W) [37]. Prawo Little'a mówi, jaki czas przejścia odpowiada danemu zapasowi, ale nie mówi, jaki zapas wynika z danego poziomu zmienności. Do tego potrzebna jest symulacja.

### Porównanie typów symulacji

| Cecha | Symulacja zdarzeniowa dyskretna (DES) | Symulacja ciągła / dynamika systemów | Symulacja agentowa (ABS) | Symulacja fizyczna i ruchu 3D |
|---|---|---|---|---|
| Postęp czasu | skoki od zdarzenia do zdarzenia (napływ, koniec obróbki, awaria) | ciągły, w małych krokach czasowych, równania różniczkowe | sterowana zdarzeniami lub krokami czasowymi, zależnie od narzędzia | drobne kroki czasowe, kinematyka i dynamika |
| Elementy modelu | źródła, ujścia, stanowiska, bufory, przenośniki, zasoby, zamówienia | zasoby, przepływy, pętle sprzężenia zwrotnego | autonomiczne agenty z regułami i stanami (pojazdy, ludzie, zamówienia) | bryły sztywne, przeguby, czujniki, sygnały sterujące |
| Typowe pytania | przepustowość, czas przejścia, wykorzystanie, wąskie gardło, wielkości buforów, zapotrzebowanie na pracowników | strategiczna zdolność produkcyjna i rozwój rynku, efekt bicza (bullwhip) | ruch AGV, przepływy pieszych, zdecentralizowane sterowanie, logika negocjacji | osiągalność, kolizje, czas cyklu gniazda robota, testowanie sterowania |
| Poziom szczegółowości | od linii do zakładu | od zakładu do sieci, silnie zagregowany | od lokalnego do sieciowego | gniazdo, maszyna |
| Zalety | ugruntowana, łatwa do walidacji, losowość wbudowana | szybka, dobra do sprzężeń zwrotnych i długich horyzontów | zachowania emergentne, reguły indywidualne | realistyczna geometria i fizyka |
| Ograniczenia | geometria zwykle uproszczona | brak pojedynczych zamówień | wymagające parametryzacji i walidacji | wymagająca obliczeniowo, mały wycinek systemu |
| Źródło | VDI 3633 [13], Law [41] | Forrester, *Industrial Dynamics* (MIT) [38] | nieznana dedykowana wytyczna VDI [unverified: brak potwierdzonego źródła w dostępnych materiałach] | VDI 3633 Part 8 (symulacja na poziomie maszyny) [13], VDI/VDE 3693 [14] |

W produkcji i symulacji fabryki dominuje **symulacja zdarzeń dyskretnych**. Wiele nowoczesnych narzędzi łączy paradygmaty, np. dyskretną symulację produkcji z modelowaniem agentowym pojazdów lub ciągłym modelem energetycznym. Podręcznik Law'a szczegółowo opisuje metodologiczne podstawy symulacji zdarzeń dyskretnych, od liczb losowych i rozkładów wejściowych po analizę statystyczną [41].

### Symulacja przepływu materiału i symulacja fabryki

Te pojęcia są często używane zamiennie, mają jednak różne akcenty:

- **Symulacja przepływu materiału** śledzi drogę materiału i zleceń przez produkcję i logistykę: przenośniki, bufory, magazynowanie, obsługę materiału, kompletację. Pytania przewodnie: Czy system przenośników jest wystarczający? Jak duże muszą być bufory? Gdzie materiał się piętrzy?
- **Symulacja fabryki** patrzy na zakład jako całość: asortyment produktów, zdolności produkcyjne, modele zmianowe, zatrudnienie, układ, logistykę i reguły sterowania. Pytania przewodnie: Czy zakład poradzi sobie z wolumenem? Który układ jest odporny na zmiany? Ile kosztuje trzecia zmiana w porównaniu z dodatkową maszyną?
- **Symulacja produkcji** jest często używana jako pojęcie nadrzędne dla obu powyższych.

Więcej o symulacji fabryki znajdziesz na stronie hasłowej [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Symulacja strumienia wartości: dynamiczne mapowanie strumienia wartości

Klasyczne mapowanie strumienia wartości jest migawką opartą na średnich. Pokazuje zapasy, czasy realizacji i przepływ w danym dniu, ale nie pokazuje, jak strumień wartości zachowuje się przy zmianie asortymentu, awariach lub zmianie wielkości partii. Symulacja strumienia wartości wypełnia tę lukę, traktując mapę strumienia wartości jako wykonywalny model. Wspomniana wyżej publikacja ZWF z 2014 roku opisuje właśnie ten krok od statycznych wskaźników do dynamicznego widoku w czasie [31].

Praktyczna zaleta: mapa strumienia wartości jest znana i akceptowana w firmie. Jeśli na jej podstawie zbudujesz model symulacyjny, zespoły operacyjne nie muszą uczyć się nowego świata modelowania. Ograniczeniem są bardzo złożone przepływy materiału z przenośnikami i logiką magazynową; wymagają one klasycznej symulacji przepływu materiału.

### Jak przebiega badanie symulacyjne

Wytyczna VDI 3633 opisuje przygotowanie, przeprowadzenie i ocenę badań symulacyjnych [13]. Sprawdziła się następująca kolejność:

1. **Cel:** Jaką decyzję przygotowujesz? Które wskaźniki o niej przesądzają (przepustowość, czas realizacji, terminowość dostaw, koszt)?
2. **Granice systemu:** Co wchodzi do modelu, a co nie? Jaki poziom szczegółowości jest potrzebny?
3. **Zbieranie i przygotowanie danych:** dane główne, czasy, rozkłady, awarie, modele zmian (patrz rozdział 11).
4. **Budowa modelu:** najpierw model koncepcyjny, potem model wykonywalny.
5. **Weryfikacja i walidacja:** Czy model jest zbudowany poprawnie (weryfikacja)? Czy wystarczająco dokładnie odzwierciedla rzeczywistość (walidacja)? Porównaj z rzeczywistymi danymi i sprawdź z ekspertami merytorycznymi.
6. **Projekt eksperymentu:** scenariusze, okres rozgrzewania, długość przebiegu, liczba replikacji.
7. **Przeprowadzenie i analiza:** wskaźniki z przedziałami ufności zamiast pojedynczych wartości, analizy wrażliwości.
8. **Dokumentacja i przekazanie:** założenia, ograniczenia, rekomendacje.

Dwa punkty są w praktyce szczególnie często zaniedbywane: **okres rozgrzewania** (model, który startuje pusty, daje zniekształcone wskaźniki w pierwszych symulowanych dniach) oraz **replikacje** (model stochastyczny daje przy każdym przebiegu inne wyniki; tylko kilka przebiegów pozwala na wiarygodne stwierdzenie) [41]. Tę samą logikę weryfikacji i walidacji NIST chce sformalizować dla bliźniaków produkcyjnych w proponowanych ramach VVUQ [48].

## 7. Zastosowania i dane, których każde z nich wymaga

Poniższa tabela porządkuje najważniejsze zastosowania w produkcji według poziomu integracji i wymagań dotyczących danych. Traktuj ją jako pomoc w planowaniu: w swoim przypadku najpierw sprawdź kolumnę „Minimalne dane”.

| Zastosowanie | Typowa decyzja | Poziom integracji | Minimalne dane | Dodatkowe dane zwiększające wartość |
|---|---|---|---|---|
| Planowanie fabryki i układu | konstrukcja budynku, rozmieszczenie, powierzchnia, przejścia | model | program produktów, marszruty, czasy, wymagania przestrzenne, warianty układu | macierze transportu, ograniczenia budynkowe, skan 3D |
| Planowanie zdolności produkcyjnych i inwestycji kapitałowych | dodatkowa maszyna, zmiana lub outsourcing | model lub shadow | prognozy, marszruty, gniazda robocze, harmonogramy zmian, dostępność | rozkłady awarii, macierze przezbrojeń |
| Analiza wąskich gardeł | Gdzie inwestować, gdzie odciążyć? | shadow | potwierdzenia z znacznikami czasu, rzeczywiste czasy, zapasy | stany maszyn, przyczyny przestojów |
| Analiza miksu produktów i scenariuszy | nowy produkt, mix wariantów, wielkości partii | model lub shadow | zestawienia materiałowe, marszruty, scenariusze miksu | rodziny przezbrojeń, reguły sekwencjonowania |
| Walidacja harmonogramu i APS | Czy harmonogram na ten tydzień jest wykonalny? Jaka sekwencja? | shadow do twin | zlecenia, terminy, marszruty, zdolności, bieżący postęp | dostępność materiałów, ludzie z odpowiednimi kwalifikacjami |
| Wirtualne uruchamianie (virtual commissioning) | testowanie oprogramowania sterującego przed fizycznym uruchomieniem | model (model urządzenia z rzeczywistym lub emulowanym sterownikiem) | konstrukcja mechaniczna i elektryczna, program PLC, listy I/O, modele zachowania | funkcje bezpieczeństwa, koncepcje obsługi |
| Planowanie floty AGV i AMR | liczba pojazdów, trasy, strategia ładowania | model, później shadow | zlecenia transportowe (źródło, cel, ilość, czas), układ, dane pojazdów | reguły ruchu, infrastruktura ładowania, ruch mieszany |
| Ocena energii i CO2 | szczytowe obciążenia, przesunięcia zmian, strategie wyłączeń | shadow | pobór mocy w każdym stanie, dane o stanach, harmonogramy zmian | ceny energii, dane pomiarowe dla każdej maszyny |
| Utrzymanie ruchu | terminy przeglądów, stany magazynowe części zamiennych | shadow do twin | historia awarii, godziny pracy, dane o stanie technicznym | czujniki, modele uszkodzeń |

### 7.1 Planowanie fabryki i układu

Planowanie fabryki to klasyczna dziedzina cyfrowej fabryki. W projekcie greenfield zakład jeszcze nie istnieje, więc nie ma danych operacyjnych. Cyfrowy bliźniak jest tu **modelem planistycznym** zbudowanym na podstawie programu produktów, marszrut i wariantów układu. Jego zadaniem jest porównywanie wariantów w warunkach niepewności: który układ pozostanie produktywny, jeśli miks się zmieni lub wolumen wzrośnie o jedną trzecią?

Projekty brownfield są inne: dane istnieją, ale często brakuje aktualnego układu. Skanowanie laserowe i chmury punktów 3D pomagają uchwycić stan budynku w rzeczywistości. Mimo to o wyniku decyduje logika procesu. Fotorealistyczny model budynku bez marszrut nie odpowie na żadne pytanie o zdolności produkcyjne. Niektóre anglojęzyczne opracowania nazywają to „pułapką wizualizacji”.

Sprawdzonymi wskaźnikami do porównywania wariantów są przepustowość, czas realizacji, praca w toku (WIP), nakład transportowy (tonokilometry lub kursy na godzinę), powierzchnia i zapotrzebowanie na pracę.

### 7.2 Analiza zdolności produkcyjnych i wąskich gardeł

**Teoria ograniczeń** Goldratta zakłada, że wydajność systemu jest ograniczona przez jedno wąskie gardło, a poprawa poza nim nie podnosi przepustowości [39]. Praktyczny problem: wąskie gardło nie zawsze znajduje się tam, gdzie arkusz kalkulacyjny pokazuje najwyższe wykorzystanie. Przesuwa się wraz z miksem produktów, przezbrojeniami i awariami. Model symulacyjny pokazuje, gdzie zlecenia faktycznie się piętrzą i które stanowisko blokuje inne lub je głodzi. Więcej o tej metodzie znajdziesz na stronie hasła [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/).

McKinsey opisuje konkretny przykład: na jednej linii produkcyjnej zoptymalizowana sekwencja na stanowisku wąskiego gardła skróciła łączny czas przetwarzania o około cztery procent [26]. Liczby tego rzędu brzmią skromnie, ale przy rzeczywistym wąskim gardle przekładają się bezpośrednio na przepustowość.

### 7.3 Analiza miksu produktów i scenariuszy

Nowe produkty, więcej wariantów, mniejsze wielkości partii: każda z tych zmian przesuwa obciążenie między zasobami. Bliźniak zbudowany na modelu PPR może wczytać nowe zestawienia materiałowe i marszruty i pokazać, które zasoby staną się wąskie, zanim powstanie pierwsza sztuka. McKinsey opisuje zakład obróbki metali, którego bliźniak z agentem uczenia przez wzmocnienie ocenił tysiące możliwych kombinacji produktów na czterech równoległych liniach produkcyjnych [26]. Typowe scenariusze obejmują:

- zmiany miksu między rodzinami produktów,
- wprowadzenie nowego produktu na istniejących zasobach,
- redukcję wielkości partii i jej wpływ na udział czasu przezbrojeń,
- zmianę modelu zmianowego (dwie do trzech zmian, zmiany weekendowe),
- utratę kluczowego zasobu lub dostawcy.

### 7.4 Harmonogramowanie produkcji i zaawansowane planowanie i harmonogramowanie (APS)

Systemy APS tworzą harmonogramy i sekwencje z uwzględnieniem ograniczeń zdolności produkcyjnych. Symulacyjny bliźniak uzupełnia je na dwa sposoby: może **z wyprzedzeniem przeprowadzić harmonogram** i pokazać, czy wytrzyma on realistyczną zmienność, oraz może służyć jako **funkcja oceny** dla metod optymalizacyjnych, które generują wiele wariantów harmonogramu. McKinsey opisuje zakład montażowy, w którym przeprojektowany harmonogram produkcji zmniejszył nadgodziny i przyniósł miesięczne oszczędności kosztów na poziomie 5–7 procent [26]. Strona encji [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) wyjaśnia podstawy planowania z uwzględnieniem ograniczeń zdolności, a nasz przewodnik po [oprogramowaniu do harmonogramowania produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/) wchodzi w szczegóły.

Warto jasno rozdzielić role: klasyczne planowanie w ERP (MRP II) działa sekwencyjnie (ilości, potem terminy, potem zdolności), często przy założeniu nieskończonej zdolności. Bliźniak nie zastępuje systemu ERP. Sprawdza jego wyniki i je ulepsza.

### 7.5 Uruchomienie wirtualne

**Uruchomienie wirtualne** testuje oprogramowanie sterujące maszyną lub linią na modelu symulacyjnym, zanim fizyczne urządzenia zostaną zainstalowane. Najbardziej szczegółowa wytyczna jest niemiecka: VDI/VDE 3693 część 1 (sierpień 2016) definiuje uruchomienie wirtualne dla automatyki procesowej i fabrycznej, z celem wykrywania i usuwania błędów z inżynierii systemów automatyki, oraz opisuje typy modeli i pojęcia [14]. Część 2 (grudzień 2018) dotyczy wdrażania uruchomienia wirtualnego w firmach; VDI zapowiedziało jej rewizję [15]. Nie znaleźliśmy normy ANSI ani ISA poświęconej wyłącznie uruchomieniu wirtualnemu [unverified: brak potwierdzonej normy ANSI/ISA]; amerykańscy integratorzy zazwyczaj pracują z tymi pojęciami oraz z własnymi metodami dostawców narzędzi.

Powszechne są trzy warianty sprzężenia:

| Wariant | Sterownik | Urządzenia | Zastosowanie |
|---|---|---|---|
| Model-in-the-loop (MiL) | jako model | jako model | wczesna weryfikacja koncepcji |
| Software-in-the-loop (SiL) | rzeczywisty program sterujący na emulowanym lub wirtualnym PLC | jako model | testowanie logiki PLC bez sprzętu |
| Hardware-in-the-loop (HiL) | rzeczywisty sprzętowy sterownik | jako model czasu rzeczywistego | testowanie z uwzględnieniem zachowania czasowego i systemów magistrali terenowej |

Korzyść polega na przeniesieniu usuwania usterek z kosztownej fazy uruchomienia na miejscu do wcześniejszej, tańszej fazy. Wiarygodnych, obowiązujących w całej branży procentów oszczędności czasu jest niewiele; wiele opublikowanych liczb to deklaracje dostawców. Jeden udokumentowany przykład: na linii wstępnego montażu w zakładzie w Saarbrücken w Niemczech firma ZF, współpracując z Fraunhofer IESE, spodziewała się uruchomienia około 30 procent szybszego dzięki bliźniakowi cyfrowemu i middleware Eclipse BaSyx; w 2021 roku była to oczekiwana wartość, a nie wynik zmierzony w wielu projektach [28]. Badanie Fraunhofer IWU z 2024 roku wśród producentów maszyn i urządzeń w niemieckim landzie Saksonia wykazało, że ponad 90 procent badanych firm zna uruchomienie wirtualne, ale tylko nieliczne wykorzystują jego potencjał w praktyce [27].

**Uruchomienie wirtualne a bliźniak fabryki:** Uruchomienie wirtualne działa na poziomie sygnałów i sterowania, często w milisekundach. Bliźniak fabryki działa na poziomie zleceń i zasobów, w skali minut do zmian. Oba mogą wykorzystywać ten sam układ, ale odpowiadają na różne pytania. Więcej na stronie encji [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/).

### 7.6 Planowanie floty AGV i AMR

Zautomatyzowane pojazdy kierowane (AGV) i autonomiczne roboty mobilne (AMR) to podręcznikowy przykład zastosowania symulacji, ponieważ ich zachowanie wynika z interakcji: pojazdy blokują się nawzajem na skrzyżowaniach, czekają na stanowiskach przekazania, wracają puste i muszą się ładować. Obliczenie statyczne (zlecenia transportowe na godzinę razy średni czas przejazdu) regularnie zaniża liczbę potrzebnych pojazdów, ponieważ pomija przejazdy puste, czasy oczekiwania i przerwy na ładowanie.

Pod względem bezpieczeństwa projekty te opierają się na dwóch normach amerykańskich. **ANSI/ITSDF B56.5-2024**, *Safety Standard for Guided Industrial Vehicles*, określa wymagania bezpieczeństwa dla projektowania, eksploatacji i konserwacji napędzanych, bezzałogowych, automatycznie kierowanych pojazdów przemysłowych oraz systemów, których są częścią [53]. **ANSI/A3 R15.08-1-2020 (R2026)**, *Industrial Mobile Robots: Safety Requirements, Part 1*, dotyczy producentów przemysłowych robotów mobilnych i opiera się na ocenie ryzyka w udokumentowanym środowisku pracy [54]. W Niemczech wytyczna **VDI 2510** obejmuje systemy AGV do wewnątrzzakładowego przepływu materiałów; obowiązująca edycja pochodzi z 2005 roku, a projekt z lipca 2025 roku dotyczy systemów AGV i AMR, w tym typów pojazdów, sterowania flotą, nawigacji, zasilania, transmisji danych, infrastruktury i bezpieczeństwa [18]. Symulacja nie zastępuje oceny ryzyka wymaganej przez te normy, ale pokazuje wcześnie, gdzie zasady ruchu, strefy prędkości i ruch mieszany z ludźmi tworzą konflikty.

Typowe pytania dla symulacji AGV:

- Ilu pojazdów potrzebujemy przy obciążeniu szczytowym, a ilu średnio?
- Które trasy, reguły ruchu jednokierunkowego i miejsca oczekiwania zapobiegają zatorom?
- Która strategia ładowania (ładowanie okazjonalne, wymiana baterii) utrzymuje wysoką dostępność?
- Jak ruch mieszany z wózkami widłowymi i pieszymi wpływa na wydajność?
- Co się stanie, gdy pojazd lub stanowisko przekazania ulegnie awarii?

**Przykład z wartościami ilustracyjnymi:** Załóżmy, że obszar montażu wymaga 60 transportów na godzinę, a przejazd z ładunkiem trwa średnio 3 minuty. Naiwne obliczenie daje 60 × 3 = 180 minut jazdy na godzinę, czyli 3 pojazdy. Dodajmy przejazd pusty do następnego odbioru (tu również 3 minuty) oraz po 1 minucie na odbiór i odstawienie, a każdy transport zajmie 8 minut, czyli 480 minut na godzinę: 8 w pełni wykorzystanych pojazdów. Przy docelowym wykorzystaniu na poziomie 80 procent i dostępności 85 procent z powodu ładowania otrzymujemy 8 / (0,8 × 0,85) ≈ 11,8, czyli 12 pojazdów. Zatory na skrzyżowaniach i oczekiwanie na stanowiskach przekazania nie są jeszcze uwzględnione; takie zjawiska pokazuje dopiero symulacja.

Wymagania dotyczące danych są wykonalne, ale często niedoceniane: potrzebna jest **macierz transportowa** (skąd dokąd, jak często, kiedy), którą można wyprowadzić z marszrut, zestawień materiałowych i koncepcji zaopatrzenia przy linii. Tutaj model PPR się opłaca, ponieważ zna już zapotrzebowanie materiałowe dla każdej operacji. Do sterowania rzeczywistymi, mieszanymi flotami coraz częściej stosuje się oparte na fizyce środowiska 3D; NVIDIA na przykład opisuje swój blueprint „Mega” (zaprezentowany jako wersja podglądowa w 2025 roku) jako referencyjny proces testowania flot robotów w cyfrowych bliźniakach obiektów [25]. Więcej na stronie encji [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/).

### 7.7 Energia i CO2

Bliźniak produkcyjny może modelować zużycie energii według stanów: maszyna pobiera inną moc podczas przetwarzania, biegu jałowego, przezbrajania i postoju. W połączeniu z przepływem zleceń symulacja pokazuje szczyty obciążenia oraz wpływ działań, takich jak przesunięcie zmian, automatyczne wyłączanie w czasie przerw czy zmienione kolejności. Warunkiem jest znajomość wartości mocy dla każdego stanu, które albo zmierzymy, albo wyprowadzimy z danych producenta. Wiarygodne liczby dotyczące potencjału oszczędności silnie zależą od konkretnego przypadku; należy podchodzić sceptycznie do ogólnych procentów.

### 7.8 Konserwacja

Konserwację predykcyjną często przywołuje się jako główny przykład bliźniaka cyfrowego. W praktyce są to dwie różne dyscypliny: monitorowanie stanu i prognozowanie awarii opierają się na danych z czujników oraz statystycznych lub fizycznych modelach uszkodzeń na poziomie środka trwałego. Bliźniak produkcyjny może z tego skorzystać, przyjmując przewidywany przestój jako scenariusz i pokazując, które zlecenia zostaną dotknięte oraz kiedy okno konserwacyjne wyrządzi najmniej szkód.

## 8. Cyfrowe bliźniaki z Microsoft Azure i Fabric

Wielu producentów prowadzi korporacyjne IT w oparciu o Microsoft 365 i Azure. Dla nich pytanie brzmi, które usługi Microsoft nadają się do cyfrowych bliźniaków i jaki jest ich status. Odcinek [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) przedstawia przegląd roli Azure.

### Azure Digital Twins

**Azure Digital Twins** to usługa platformy jako usługi (PaaS) do tworzenia grafów bliźniaków opartych na cyfrowych modelach całych środowisk, takich jak budynki, fabryki, sieci energetyczne czy miasta [21]. Modele zapisuje się w **Digital Twins Definition Language (DTDL)**. Azure Digital Twins obsługuje DTDL v2 i v3, a Microsoft zaleca v3 ze względu na rozszerzone możliwości; interfejs v3 może rozszerzać interfejs v2, ale nie odwrotnie [22]. Microsoft udostępnia także ontologie, które łączą modele DTDL oparte na standardach branżowych [22]. Strona przeglądu nie zawierała informacji o wycofaniu usługi w momencie, gdy ją sprawdzaliśmy [21].

Azure Digital Twins to platforma do modelowania i grafów, a nie oprogramowanie do symulacji. Reprezentuje relacje i stany oraz przetwarza zdarzenia; symulacja zdarzeń dyskretnych, porównywanie scenariuszy czy optymalizacja muszą pochodzić z innych narzędzi.

### Digital twin builder w Microsoft Fabric (wersja podglądowa)

Dzięki **digital twin builder** Microsoft w 2025 roku wprowadził element w obciążeniu Real-Time Intelligence w Microsoft Fabric. Służy on do modelowania pojęć biznesowych, takich jak zasoby i procesy, w **ontologii**, mapowania danych z różnych systemów źródłowych na instancje tych typów encji oraz tworzenia między nimi relacji semantycznych; dane znajdują się w OneLake [23]. Na dzień pisania tego tekstu Microsoft wyraźnie oznacza digital twin builder jako **wersję podglądową** (Microsoft Learn, strona ostatnio aktualizowana 20 maja 2026; sprawdzono 20 listopada 2026) [23]. Microsoft zwraca też uwagę, że digital twin builder to inna usługa niż Azure Digital Twins [21][23]. We wpisie blogowym o Fabric Microsoft podaje przykłady z produkcji, takie jak bliźniaki maszyn i procesów do analizy przyczyn źródłowych oraz pytań typu co-jeśli, a także partnerów dostarczających schematy danych produkcyjnych i zapytania KPI, na przykład dla ogólnej efektywności wyposażenia (OEE) [24].

### Która usługa do jakiego celu?

| Potrzeba | Odpowiednie podejście | Uwaga |
|---|---|---|
| Graf zasobów, przestrzeni i wyposażenia z przetwarzaniem zdarzeń, w produkcji | Azure Digital Twins z DTDL v3 [21][22] | usługa PaaS dostępna ogólnie; symulację należy dodać osobno |
| Ontologia nad danymi z ERP, MES i czujników na platformie danych Fabric | digital twin builder w Fabric [23] | wersja podglądowa: do pilotaży i ocen; użycie produkcyjne sprawdzić względem warunków wersji podglądowej Microsoft |
| Zdolność produkcyjna, wąskie gardła, scenariusze, układ | narzędzie symulacyjne (rozdział 15), wyniki w Fabric lub Power BI | ani Azure Digital Twins, ani digital twin builder nie są oprogramowaniem do symulacji |

### Co wnoszą administratorzy M365 i Azure

Bliźniak produkcyjny nie jest czystym projektem OT. IT wnosi istotne elementy składowe:

- **Tożsamość i uprawnienia:** kto może tworzyć scenariusze, a kto zatwierdzać wyniki? Role w Microsoft Entra ID, osobne uprawnienia do modelowania, analizy i zapisu zwrotnego.
- **Platforma danych:** podłączenie ERP i MES do centralnej platformy danych, historyzacja, reguły jakości danych, katalogi.
- **Governance:** klasyfikacja danych produkcyjnych i klientów, retencja, dzienniki dostępu. W przypadku dostawców dla obronności obejmuje to postępowanie z informacjami niejawnymi nieklasyfikowanymi (CUI) zgodnie z DFARS i CMMC; nasz przewodnik po [planowaniu produkcji lotniczej](https://www.m365.fm/en/learn/aerospace-production-planning/) omawia te zasady.
- **Raportowanie i współpraca:** publikowanie wyników symulacji w Power BI, kanały Teams do decyzji o scenariuszach, wersjonowanie stanów modelu.
- **Bezpieczeństwo:** segmentacja sieci między IT a OT, brak bezpośredniego zapisu z chmury do sterowników bez zdefiniowanego łańcucha zatwierdzeń (zob. rozdział 16).

Nasz przewodnik po [Azure dla produkcji](https://www.m365.fm/en/learn/manufacturing-it-azure/) szczegółowo omawia IT produkcyjne w Azure.

## 9. Sztuczna inteligencja a cyfrowy bliźniak

AI i cyfrowy bliźniak uzupełniają się w obu kierunkach: bliźniak dostarcza AI ustrukturyzowanego kontekstu i bezpiecznego miejsca do eksperymentów, a AI przyspiesza i rozszerza bliźniaka. W produkcji istotne są pięć wzorców:

1. **Przygotowanie danych:** Uczenie maszynowe wykrywa wartości odstające w potwierdzeniach, szacuje brakujące czasy i wyprowadza rozkłady z rzeczywistych danych. Jest to mało spektakularne, ale często jest to największa praktyczna dźwignia.
2. **Modele zastępcze (surrogate):** Szczegółowy model symulacyjny jest używany do „wytrenowania” sieci neuronowej lub innego modelu zastępczego na wielu przebiegach; model zastępczy następnie dostarcza przybliżenia w ciągu sekund. Przydatne w optymalizacjach wymagających bardzo wielu ewaluacji. Ograniczenia leżą poza zakresem trenowania.
3. **Optymalizacja i uczenie przez wzmacnianie:** Agenci uczą się reguł sterowania wewnątrz modelu symulacyjnego, na przykład do sekwencjonowania lub dysponowania pojazdami, bez zakłócania rzeczywistej produkcji. Przykład McKinsey z obróbki metali w punkcie 7.3 wykorzystywał to podejście [26]. Reguły są tak dobre, jak wierność odwzorowania modelu.
4. **Generatywna AI jako interfejs:** Modele językowe tłumaczą pytania typu „Co się stanie, jeśli linia 3 stoi przez tydzień?” na scenariusze i wyjaśniają wyniki. Warunkiem jest semantycznie czysty model (ontologia, graf PPR), aby AI nie zgadywało.
5. **Physical AI i robotyka:** Fizykalne trójwymiarowe bliźniaki służą jako środowiska treningowe i testowe dla robotów i pojazdów autonomicznych; NVIDIA pozycjonuje w tym celu Omniverse oraz blueprint Mega oparty na OpenUSD [25].

**Trzeźwa ocena:** AI nie zastępuje walidacji ani wiedzy dziedzinowej. Model językowy pracujący na wadliwym routingu szybko produkuje wiarygodnie brzmiące, ale błędne odpowiedzi. Kolejność jest więc następująca: najpierw fundament danych i model, potem AI.

## 10. Plan wdrożenia: realizacja w sześciu fazach

Poniższy plan jest przewodnikiem dla bliźniaka zakładu produkcyjnego lub fabryki. Czasy trwania to doświadczenie autora dla zakładu średniej wielkości z wyraźnie zakresowanym pierwszym przypadkiem użycia [unverified]; McKinsey podaje zakres od dwóch do trzech miesięcy do ponad roku dla projektów bliźniaczych, w zależności od kompetencji zespołu i złożoności zakładu [26]. Wpis [Digital twin in manufacturing: where to start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) opisuje także, jak wykonać pierwszy krok.

| Faza | Zawartość | Rezultat | Typowy czas trwania |
|---|---|---|---|
| 1 Pytanie | nazwać decyzję, ustalić metryki i cele, przypisać właścicieli | jednostronicowa karta projektu z pytaniem przewodnim, metrykami, granicą systemu | 2–4 tygodnie |
| 2 Inwentaryzacja danych | przegląd danych ERP, MES i układu zakładu, sprawdzenie jakości danych, zamknięcie luk | mapa danych, raport jakości, lista działań | 3–6 tygodni |
| 3 Model pilotażowy | model PPR dla jednego strumienia wartości lub obszaru, wykonywalny model symulacyjny | zwalidowany model pilotażowy | 6–12 tygodni |
| 4 Walidacja i pierwsza decyzja | porównanie z rzeczywistymi danymi, uruchomienie scenariuszy, przygotowanie decyzji | udokumentowana decyzja z założeniami | 2–6 tygodni |
| 5 Operacjonalizacja | automatyczne zasilanie danymi, role, procesy utrzymania, regularna walidacja harmonogramu | tryb shadow w rutynowej eksploatacji | 2–6 miesięcy |
| 6 Skalowanie | więcej obszarów, zakładów, przypadków użycia, sprzężenie z APS, energią, AGV | portfel bliźniaków na wspólnym fundamencie danych | ciągłe |

**Zasady przewodnie planu:**

- **Najpierw jedna decyzja.** Bliźniak, który poprawia konkretną decyzję inwestycyjną lub planistyczną, finansuje kolejną fazę.
- **Dane przed platformą.** Sprawdź jakość danych, zanim wybierzesz narzędzia.
- **Operacje na czele.** Planiści i nadzór muszą rozumieć model i mu ufać. Model, którym potrafi operować tylko grupa symulacyjna, upada wraz z następną zmianą obsady.
- **Utrzymanie od pierwszego dnia.** Ustal wcześnie, kto aktualizuje model, gdy zmieniają się routingi, układy lub wzorce zmian.

**Pomoc dla małych i średnich producentów:** W USA Manufacturing Extension Partnership (MEP) w ramach National Institute of Standards and Technology Departamentu Handlu, z ponad 450 punktami usługowymi we wszystkich 50 stanach i w Puerto Rico, jest częstym punktem wyjścia dla mniejszych producentów, którzy chcą zewnętrznego wsparcia w projektach cyfryzacji [60]. Raport NIST o przypadkach użycia ISO 23247 powstał właśnie z myślą o tej grupie odbiorców [47].

## 11. Jakość danych: niedoceniany warunek wstępny

W wielu projektach cyfrowych bliźniaków już pierwszy przegląd danych pokazuje ten sam problem: dane główne w systemie ERP opisują zakład raczej tak, jak był kiedyś planowany, niż tak, jak działa dziś. Nie jest to krytyka zarządzania danymi głównymi. Wynika to z faktu, że systemy ERP utrzymuje się przede wszystkim z myślą o kalkulacji kosztów i planowaniu materiałowym, a nie o symulacji.

### Typowe problemy z danymi

- **Normy czasowe** pochodzą z kalkulacji kosztów lub z badań czasu wykonanych przed laty (w Niemczech często badania REFA, niemiecki odpowiednik klasycznego badania czasu w inżynierii przemysłowej) i znacznie odbiegają od rzeczywistych czasów.
- **Czasy przezbrojeń** są zapisane jako stałe wartości, mimo że w rzeczywistości zależą od kolejności (macierz przezbrojeń).
- **Grupy gniazd roboczych** łączą maszyny, które w rzeczywistości się różnią (wiek, dostępność, umiejętności operatorów).
- **Kalendarze zmian** nie odzwierciedlają dodatkowych zmian, okresów skróconego czasu pracy (w Niemczech: *Kurzarbeit*, dofinansowywany przez państwo krótki czas pracy) ani braków kadrowych.
- **Przestoje** w ogóle nie są rejestrowane w systemie ERP, a w MES są zapisywane z niespójnymi kodami przyczyn.
- **Zestawienia materiałowe produkcyjne** odbiegają od konstrukcyjnych zestawień materiałowych, a odchylenia nie są dokumentowane.
- **Potwierdzenia** są wprowadzane zbiorczo na koniec zmiany, więc znaczniki czasu nie odzwierciedlają rzeczywistej kolejności zdarzeń.
- **Czasy transportu** i trasy wewnątrzzakładowe całkowicie brakuje.

### Lista kontrolna przed zbudowaniem modelu

| Kontrola | Pytanie | Metoda |
|---|---|---|
| Kompletność | Czy każdy istotny materiał ma marszrutę, a każda operacja gniazdo robocze? | zapytanie o brakujące powiązania |
| Aktualność | Kiedy ostatnio przeglądano normy czasowe? | data zmiany na marszrucie |
| Wiarygodność | Jak duża jest różnica między czasami normatywnymi a rzeczywistymi? | porównanie z potwierdzeniami z okresu od trzech do sześciu miesięcy |
| Szczegółowość | Czy gniazda robocze są wystarczająco szczegółowe dla danego pytania? | weryfikacja z układem zakładu i obchód gemba |
| Spójność | Czy nazwy zgadzają się między ERP, MES i układem zakładu? | tabela mapowania |
| Znaczniki czasu | Czy potwierdzenia są rejestrowane terminowo? | rozkład czasów rejestracji w ciągu zmiany |
| Przestoje | Czy istnieje jeden katalog przyczyn przestojów? | analiza częstotliwości przyczyn |
| Odpowiedzialność | Kto utrzymuje które dane i kto zatwierdza zmiany? | macierz RACI |

**Zasada praktyczna:** Model symulacyjny może wypełniać luki w danych założeniami, pod warunkiem że założenia są udokumentowane i sprawdzone w analizach wrażliwości. Bliźniak, który po cichu liczy na błędnych normach czasowych, jest niebezpieczny, ponieważ wygląda na precyzyjny.

Efekt uboczny, który wiele firm nie docenia: sama inwentaryzacja danych dla bliźniaka często poprawia jakość planowania w systemie ERP, ponieważ ujawnia nieaktualne marszruty i błędne zdolności produkcyjne.

## 12. Koszty i korzyści, ocenione uczciwie

### Czynniki kosztowe

Według oceny autora koszt bliźniaka produkcyjnego zwykle nie wynika z oprogramowania, lecz z pracy nad danymi i modelowaniem. Główne czynniki kosztowe to:

- **Przygotowanie danych:** interfejsy, czyszczenie, mapowanie, uzgadnianie z biznesem.
- **Modelowanie i walidacja:** budowa modelu PPR i modelu symulacyjnego oraz porównanie z rzeczywistością.
- **Utrzymanie:** aktualizacje przy zmianach produktów, procesów lub układów. Tej pozycji brakuje w wielu studiach przypadku.
- **Szkolenia:** szkolenie planistów i kluczowych użytkowników, budowa kompetencji wewnątrz firmy.
- **Oprogramowanie i infrastruktura:** licencje, zasoby chmurowe, integracja.

W przypadku badań symulacyjnych niemiecka firma świadcząca usługi symulacyjne podaje jako regułę kciuka, że koszt nie powinien przekraczać 1 procent danej inwestycji, i powołuje się na badania i benchmarki (w tym VDI), według których stosunek korzyści do kosztów wynosi średnio około 1:6 [30]. Wartości te pochodzą ze źródła dostawcy; przed użyciem w własnym studium przypadku sprawdź oryginalne badania.

### Udokumentowane przykłady korzyści

Wiarygodne, niezależnie zebrane dane o korzyściach są rzadkie. Poniższe wartości mają źródło, ale dotyczą pojedynczych przypadków:

| Źródło | Kontekst | Wartość |
|---|---|---|
| McKinsey (2024) [26] | zakład montażowy, przeprojektowany harmonogram produkcji | 5–7% miesięcznych oszczędności kosztowych dzięki mniejszej liczbie godzin nadliczbowych |
| McKinsey (2024) [26] | optymalizacja sekwencji na stanowisku wąskim gardła | około 4% krótszy całkowity czas przetwarzania |
| McKinsey (2024) [26] | ankieta wśród 75 wyższych menedżerów przemysłowych (czerwiec 2022) | 86% uważa bliźniaki za przydatne, 44% wdrożyło już jeden, 15% planuje wdrożenie |
| ZF / Fraunhofer IESE (2021) [28] | linia wstępnego montażu, Saarbrücken (Niemcy), middleware Eclipse BaSyx | około 30% szybsze uruchamianie (oczekiwanie, nie średnia) |
| Fraunhofer IWU (2024) [27] | ankieta wśród producentów maszyn i urządzeń w Saksonii (Niemcy) | ponad 90% zna wirtualne uruchamianie, tylko nieliczni wykorzystują jego potencjał |

Dla kontekstu inwestycyjnego w USA: w Deloitte 2025 Smart Manufacturing and Operations Survey (600 kadr kierowniczych w amerykańskich producentach o przychodach co najmniej 500 mln USD, badanie przeprowadzone od sierpnia do września 2024) 78 procent liderów stwierdziło, że przeznacza ponad 20 procent swojego budżetu na usprawnienia na inicjatywy smart manufacturing; respondenci raportowali wzrost wydajności produkcji o do 20 procent [56]. Są to dane samodzielnie zgłoszone, dotyczące smart manufacturing jako całości, a nie bliźniaków cyfrowych w szczególności.

### Studium przypadku w pięciu pytaniach

1. **Jaką decyzję** poprawia bliźniak i jak często ta decyzja jest podejmowana (raz w projekcie inwestycyjnym czy co tydzień w harmonogramowaniu)?
2. **Ile kosztuje błędna decyzja** (zbyt duża lub zbyt mała inwestycja, opóźnione dostawy, godziny nadliczbowe, braki w magazynie)?
3. **O ile dokładniejsza** staje się decyzja dzięki bliźniakowi? Pilotaż daje pierwsze porównanie planu, symulacji i rzeczywistych wyników.
4. **Ile kosztuje bliźniak** w okresie trzech do pięciu lat, łącznie z utrzymaniem?
5. **Jakie korzyści uboczne** się pojawiają (lepsze dane wzorcowe, szybsze sprawdzanie ofert, ponowne wykorzystanie w innych obszarach)?

Przy decyzjach kapitałowych rzędu milionów dolarów jedno uniknięte błędne wymiarowanie może uzasadnić projekt symulacyjny. W przypadku bieżących bliźniaków planistycznych o opłacalności decyduje częstotliwość użycia.

## 13. Typowe błędy i jak ich unikać

| Błąd | Konsekwencja | Przeciwdziałanie |
|---|---|---|
| technologia przed pytaniem | kosztowna platforma bez korzyści | jednostronicowa karta projektu z konkretną decyzją i metryką przed wyborem jakiegokolwiek narzędzia |
| mylenie wizualizacji 3D z cyfrowym bliźniakiem | ładne obrazy, brak odpowiedzi na pytania o zdolności produkcyjne | najpierw logika procesów (PPR), potem geometria |
| modelowanie wszystkiego naraz | projekt nigdy się nie kończy | jeden strumień wartości lub obszar jako pilotaż |
| przyjmowanie danych wzorcowych bez sprawdzenia | precyzyjnie wyglądające, ale błędne wyniki | kontrola jakości danych (rozdział 11), porównanie z rzeczywistymi czasami |
| brak walidacji | utrata zaufania przy pierwszym odchyleniu | systematyczne porównanie z danymi rzeczywistymi, udokumentowane założenia |
| średnie zamiast rozkładów | wąskie gardła i zapasy niedoszacowane | rozkłady z danych rzeczywistych, rozbicie modelu |
| pojedyncze powtórzenie symulacji | przypadkowy wynik sprzedawany jako prawda | kilka powtórzeń, przedziały ufności [41] |
| brak planu utrzymania | model nieaktualny po kilku miesiącach | role, procesy i budżet na utrzymanie |
| model tylko dla specjalistów | wiedza odchodzi wraz z jedną osobą | zrozumiałe interfejsy, szkolenia, dokumentacja |
| pętla sprzężenia zwrotnego bez zatwierdzenia | ryzyko bezpieczeństwa i odpowiedzialności | zatwierdzanie przez człowieka, rejestrowanie zdarzeń, koncepcja bezpieczeństwa IT/OT |
| niezdefiniowane pojęcia | nieporozumienia w zapytaniach ofertowych i umowach | jednoznaczne określenie poziomu integracji (model, shadow, twin) [5] |

## 14. Normy i wytyczne w skrócie

| Norma/wytyczna | Tytuł (skrócony) | Status | Znaczenie |
|---|---|---|---|
| ISO 23247-1 do -4 | Ramy cyfrowego bliźniaka dla produkcji: przegląd, architektura referencyjna, reprezentacja cyfrowa, wymiana informacji | 2021 [6] | ramy i struktura bliźniaków produkcyjnych |
| ISO 23247-5 | Cyfrowa nić dla cyfrowego bliźniaka | 2026 (w katalogu ISO wydanie 1, 2026-06, nadal oznaczone jako „w publikacji” 20 listopada 2026) [7] | łączenie informacji z całego cyklu życia |
| ISO 23247-6 | Kompozycja cyfrowego bliźniaka | opublikowana 14 lipca 2026 [8] | łączenie kilku bliźniaków |
| NIST AMS 400-2 | Use Case Scenarios for Digital Twin Implementation Based on ISO 23247 | maj 2021 [47] | amerykańskie wytyczne wdrożeniowe dla ISO 23247 |
| ISO/IEC 30173 | Digital twin: Concepts and terminology | listopad 2023 [9] | terminologia ponadbranżowa |
| NIST IR 8356 | Security and Trust Considerations for Digital Twin Technology | luty 2025 [49] | bezpieczeństwo i zaufanie |
| IEC 63278-1 | Asset Administration Shell for industrial applications, Part 1: Structure | 14 grudnia 2023 [10] | powłoka administracji aktywami (Asset Administration Shell) |
| DIN SPEC 91345 | Reference Architecture Model Industrie 4.0 (RAMI 4.0) | 2016 [12] | ramy Przemysłu 4.0 (niemiecka) |
| ANSI/ISA-95 (IEC 62264) | Integracja systemów przedsiębiorstwa i sterowania | seria norm [58][19] | poziomy ERP/MES/sterowanie, modele danych |
| ANSI/MTC1.4-2018 (MTConnect) | interoperacyjność danych produkcyjnych | wydanie 2018 [57] | dane z maszyn, powszechne w amerykańskich zakładach obróbki |
| IEC 62541 (OPC UA) | OPC Unified Architecture | seria norm | komunikacja maszyn i modele informacyjne |
| VDI 3633 Part 1 | Simulation of systems in materials handling, logistics and production: fundamentals | grudzień 2014 [13] | metoda badania symulacyjnego (niemiecka) |
| VDI/VDE 3693 Part 1 | Virtual commissioning: model types and glossary | sierpień 2016 [14] | terminy uruchomienia wirtualnego (niemiecka) |
| VDI/VDE 3693 Part 2 | Virtual commissioning: introduction in companies | grudzień 2018, zapowiedziana rewizja [15] | wdrażanie uruchomienia wirtualnego (niemiecka) |
| VDI 4499 Part 1 | Digital factory: fundamentals | nowe wydanie kwiecień 2026 (pierwsze wydanie luty 2008) [16] | pojęcie i architektura fabryki cyfrowej (niemiecka) |
| ANSI/ITSDF B56.5-2024 | Safety Standard for Guided Industrial Vehicles | 2024 [53] | bezpieczeństwo AGV (USA) |
| ANSI/A3 R15.08-1-2020 (R2026) | Industrial Mobile Robots: Safety Requirements, Part 1 | potwierdzona 2026 [54] | bezpieczeństwo AMR (USA) |
| VDI 2510 | Automated guided vehicle systems (AGVS) | październik 2005, projekt lipiec 2025 [18] | AGV i AMR (niemiecka) |
| ISA/IEC 62443 | Security for industrial automation and control systems | seria norm [59] | bezpieczeństwo systemów automatyki |
| NIST SP 800-82 Rev. 3 | Guide to Operational Technology (OT) Security | wrzesień 2023 [55] | wytyczne bezpieczeństwa OT (USA) |

## 15. Kategorie oprogramowania: porównanie neutralne

Rynek jest trudny do rozeznania, ponieważ wielu dostawców nazywa swój produkt „cyfrowym bliźniakiem”. Pomocniejsza jest klasyfikacja według funkcji:

| Kategoria | Podstawowa funkcja | Mocne strony | Ograniczenia | Typowi użytkownicy |
|---|---|---|---|---|
| Narzędzia symulacji zdarzeń dyskretnych | symulacja przepływu materiału i fabryki | duża swoboda modelowania, ugruntowana metoda | budowa modelu jest pracochłonna, wymaga wiedzy specjalistycznej | eksperci symulacji, planowanie fabryki |
| Narzędzia symulacji wielometodowej | połączenie zdarzeń dyskretnych, agentów i dynamiki systemowej | elastyczność przy pytaniach mieszanych | stroma krzywa uczenia się | eksperci symulacji i logistyki |
| Pakiety fabryki cyfrowej i PLM | układ, robotyka, planowanie procesów, symulacja w kontekście PLM | ciągłość od projektu do produkcji | złożoność, koszt licencji | duże przedsiębiorstwa, motoryzacja |
| Narzędzia uruchomienia wirtualnego | modele urządzeń ze sprzężeniem PLC (SiL/HiL) | testowanie sterowania przed instalacją | skupienie na urządzeniu, nie na zakładzie | inżynierowie sterowania, producenci maszyn |
| Narzędzia planowania oparte na strumieniu wartości i PPR | model z danych ERP i strumienia wartości, symulacja, scenariusze | szybkie budowanie z istniejących danych, bliskość operacji | słabiej nadają się do szczegółowych systemów przenośników | planowanie produkcji, lean, kierownictwo zakładu |
| Systemy APS | planowanie i sekwencjonowanie z ograniczeniem zdolności | planowanie operacyjne | symulacja często ograniczona | planowanie i sterowanie produkcją |
| Platformy IoT i bliźniaków | modele aktywów, przetwarzanie zdarzeń, grafy (np. Azure Digital Twins) | skala, integracja, czas rzeczywisty | brak symulacji w standardzie | IT, zespoły platform danych |
| Platformy 3D i fizyczne | sceny fotorealistyczne, fizyka, trening robotów (np. na OpenUSD) | wizualizacja, robotyka, trening AI | logika procesów i dynamika zleceń nie są w centrum | robotyka, duże projekty |

**Kryteria wyboru:** Czy narzędzie pasuje do pytania i poziomu szczegółowości? Jak szybko można zbudować model z istniejących danych? Czy personel operacyjny może z niego korzystać samodzielnie? Jak wygląda jego utrzymanie? Jakie istnieją interfejsy do ERP, MES i Twojej platformy danych? Które standardy są obsługiwane (AAS, OPC UA, MTConnect, DTDL)? Gdzie znajdują się dane i kto ma do nich dostęp?

## 16. Bezpieczeństwo, własność danych i regulacje

Bliźniak produkcyjny przechowuje wrażliwe informacje: struktury produktów, czasy procesów, zdolności produkcyjne i zamówienia klientów opisują know-how firmy i jej pozycję konkurencyjną. Im wyższy poziom integracji, tym większe ryzyko.

- **Rozdzielenie IT/OT:** Bliźniak, który zapisuje dane do sterowników, wymaga koncepcji stref i kanałów (zones-and-conduits) zgodnie z ISA/IEC 62443, serią definiującą wymagania i procesy bezpiecznych systemów automatyki i sterowania przemysłowego [59], a także zdefiniowanych przejść i rejestrowania zdarzeń. NIST SP 800-82 Rev. 3 (wrzesień 2023) to amerykański rządowy przewodnik po zabezpieczaniu technologii operacyjnej, zawierający typowe architektury, zagrożenia i środki zaradcze [55].
- **Ryzyka specyficzne dla bliźniaków:** NIST IR 8356 (wersja końcowa, luty 2025) analizuje tradycyjne i nowe wyzwania cyberbezpieczeństwa architektur cyfrowych bliźniaków i odnosi kwestie zaufania do istniejących wytycznych NIST [49]. Stosuj go jako listę kontrolną, gdy bliźniak zbiera dane z wielu systemów w jednym miejscu.
- **Łańcuchy zatwierdzania:** Rekomendacje bliźniaka powinny być zatwierdzane przez ludzi, zanim wejdą w życie w ERP, MES lub sterowaniu – przynajmniej dopóki nie zostanie wykazana ich niezawodność.
- **Własność danych:** Ustal w umowie, kto jest właścicielem modeli i danych pochodnych, gdzie są przetwarzane i czy dostawcy mogą je wykorzystywać do własnych celów (np. do trenowania AI).
- **Regulacje dla eksporterów do UE:** Unijne **Cyber Resilience Act** (rozporządzenie (UE) 2024/2847) określa wymagania cyberbezpieczeństwa dla produktów z elementami cyfrowymi sprzedawanych w UE. Obowiązki raportowania dotyczące aktywnie wykorzystywanych podatności obowiązują od 11 września 2026 r.; pozostałe obowiązki stosuje się od 11 grudnia 2027 r. [36]. Dla amerykańskich producentów połączonych maszyn i oprogramowania sprzedawanego do UE ma to bezpośrednie znaczenie; dla operatorów zakładów – pośrednie, poprzez wymagania, jakie stawiają swoim dostawcom.

## 17. Budowa bliźniaka cyfrowego na podstawie danych ERP i strumienia wartości z iFAKT Polaris

> **Uwaga: Autor pracuje w firmie iFAKT GmbH.**

Ta sekcja opisuje jedno z rozwiązań zgodnych z zasadą wyjaśnioną w sekcji 5: budowę bliźniaka cyfrowego produkcji na podstawie istniejących danych ERP i strumienia wartości, za pomocą modelu produkt-proces-zasób. Informacje pochodzą ze stron produktowych iFAKT GmbH i można je tam sprawdzić; autor nie przeprowadził własnych testów porównawczych.

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), z siedzibą w Stuttgarcie w Niemczech, podaje, że działa od ponad 25 lat i tworzy oprogramowanie do mapowania strumienia wartości, symulacji produkcji, planowania i optymalizacji [35]. Firma opisuje swoją platformę [iFAKT Polaris](https://www.m365.fm/entity/polaris/) jako sposób łączenia danych ERP z cyfrowym bliźniakiem produkcji w celu optymalizacji planów i wskazywania wąskich gardeł; platforma obejmuje moduły modelowania strumienia wartości i swimlane (VSM/BSM), Designer, Simulator, Optimizer, Operator i Analyzer [35].

**Polaris Designer:** Według strony dostawcy Designer przekształca dane wejściowe w ustrukturyzowany **graf wiedzy PPR**, który w jednym modelu łączy produkty (zestawienia materiałowe produkcyjne i inżynierskie, MBOM/EBOM), procesy (czasy przezbrojenia, pracy maszyn i manipulacji) oraz zasoby (stanowiska, zespoły, strefy) wraz z ich ograniczeniami. Danymi wejściowymi są dane ERP, zestawienia materiałowe produkcyjne, czasy procesów, struktury zasobów i ograniczenia. Na tej podstawie Designer automatycznie generuje diagramy sieciowe oparte na rzeczywistej logice produkcji, pokazuje ścieżkę krytyczną i zasoby krytyczne, podkreśla procesy wąskiego gardła, porównuje bieżące i zoptymalizowane czasy realizacji oraz przypisuje strefy na podstawie powiązań produkt-proces. Dostawca przedstawia graf jako wspólną podstawę („jedyne źródło prawdy”) dla symulacji i optymalizacji [33]. Więcej na stronie podmiotu [Polaris Designer](https://www.m365.fm/entity/polaris-designer/).

**Polaris Simulator:** Według dostawcy Simulator opiera się na grafie PPR utworzonym w Designerze i uruchamia diagramy sieciowe poprzez konfigurowalne modele stanowisk, linii i hal produkcyjnych, dla pojedynczych i wielu linii. Ma zapewniać przejrzystość wykorzystania mocy produkcyjnych w zmianach i scenariuszach, wykrywać wąskie gardła oraz nierównomierności obciążenia w czasie, pokazywać przeciążenie i niedociążenie, a także czasowe wykorzystanie pracy, oraz oceniać scenariusze dotyczące mocy produkcyjnych, obsady pracowników i buforów, a także dynamicznych mieszanek produktów na wspólnych zasobach [34]. Więcej na stronie podmiotu [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/).

**Kontekst techniczny:** Pracownicy iFAKT publikowali o podstawowych zagadnieniach w niemieckiej prasie branżowej, na przykład o dynamicznej symulacji strumieni wartości (ZWF 109(11), 2014) [31] oraz, wraz z partnerami badawczymi, o uniwersalnym interfejsie danych dla cyfrowych usług strumienia wartości (ZWF 118(5), 2023) [32].

**Ocena:** Podejście oparte na PPR i strumieniu wartości szczególnie dobrze nadaje się do zagadnień planowania produkcji, mocy produkcyjnych, wąskich gardeł i obsady pracowników w obszarach montażu i wytwarzania o dużej różnorodności. Do szczegółowych systemów przenośników, gniazd robotów czy uruchamiania wirtualnego na poziomie sygnałów lepiej pasują wyspecjalizowane kategorie z sekcji 15. Jak w przypadku każdego narzędzia, sprawdź w pilotażu na własnych danych, czy wyniki odpowiadają na Twoje pytanie. Nasz dedykowany przewodnik po [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) omawia platformę dokładniej.

## 18. Glosariusz

| Termin | Wyjaśnienie |
|---|---|
| Advanced planning and scheduling (APS) | oprogramowanie do planowania i szeregowania uwzględniającego ograniczenia zdolności produkcyjnych |
| Agent-based simulation (ABS) | modelowanie jednostek autonomicznych (agentów) o własnych regułach, których interakcje wytwarzają zachowanie systemu |
| AGV / AMR | automatyczny pojazd prowadzony / autonomiczny robot mobilny [53][54] |
| Asset Administration Shell (AAS) | ustandaryzowana cyfrowa reprezentacja zasobu zgodnie z IEC 63278 [10] |
| Bottleneck (constraint) | zasób ograniczający przepustowość całego systemu [39] |
| Digital factory | nadrzędne pojęcie obejmujące modele cyfrowe, metody i narzędzia do planowania i doskonalenia rzeczywistej fabryki (niemiecka wytyczna VDI 4499) [16][17] |
| Digital model | cyfrowa reprezentacja bez automatycznej wymiany danych z obiektem fizycznym [5] |
| Digital shadow | reprezentacja z automatycznym przepływem danych od obiektu fizycznego do cyfrowego, ale ręcznym przepływem w odwrotnym kierunku [5] |
| Digital thread | połączone powiązanie informacji w całym cyklu życia; omówione w ISO 23247-5 [7] |
| Digital twin | reprezentacja z automatycznym przepływem danych w obu kierunkach [5]; w praktyce często używane w szerszym znaczeniu |
| Discrete event simulation (DES) | symulacja, w której zegar przeskakuje od zdarzenia do zdarzenia; standard w symulacji produkcji |
| DTDL | Digital Twins Definition Language, oparty na JSON język modelowania dla Azure Digital Twins [22] |
| ERP | planowanie zasobów przedsiębiorstwa, główny system biznesowy z danymi podstawowymi, zleceniami i planowaniem materiałów |
| HiL / SiL / MiL | warianty sprzęgania dla wirtualnego uruchamiania: hardware-, software-, model-in-the-loop |
| ISA-95 / IEC 62264 | seria norm dotyczących integracji systemów przedsiębiorstwa i systemów sterowania [58] |
| Little's Law | L = λ · W: średni zapas równa się intensywności przepływu pomnożonej przez czas przejścia w stanie ustalonym [37] |
| Material flow simulation | symulacja przepływów materiałów i zleceń przez produkcję i logistykę, zwykle dyskretna |
| MBOM / EBOM | zestawienie materiałowe produkcyjne / konstrukcyjne |
| MES | system realizacji produkcji, zarządzanie operacyjne na poziomie 3 wg ISA-95 |
| MTConnect | otwarty standard interoperacyjności danych produkcyjnych, opublikowany jako ANSI/MTC1.4-2018 [57] |
| OPC UA | niezależny od producentów standard komunikacji z modelami informacyjnymi (IEC 62541) |
| PPR model | model produkt-proces-zasób, zasada strukturyzacji fabryki cyfrowej |
| Replication | powtórne uruchomienie symulacji z innymi liczbami losowymi w celu uzyskania przedziałów ufności [41] |
| Validation | sprawdzenie, czy model odwzorowuje rzeczywistość wystarczająco dokładnie do swojego celu |
| Value stream simulation | dynamiczna symulacja mapy strumienia wartości w czasie [31] |
| Verification | sprawdzenie, czy model został poprawnie zaimplementowany |
| Virtual commissioning | testowanie oprogramowania sterującego na modelu symulacyjnym przed uruchomieniem fizycznym [14] |
| VVUQ | weryfikacja, walidacja i kwantyfikacja niepewności; proponowane przez NIST jako przyszła część ISO 23247 [48] |
| Warm-up period | początkowa faza przebiegu symulacji, której wyniki są odrzucane ze względu na pusty stan początkowy |

## 19. FAQ: cyfrowe bliźniaki w produkcji

### Czym jest cyfrowy bliźniak w produkcji, prostymi słowami?
Cyfrowy bliźniak to wykonywalny model komputerowy Twojej produkcji, aktualizowany danymi z rzeczywistej działalności. Można go używać do przeprowadzania symulacji operacji, znajdowania wąskich gardeł i testowania zmian, zanim zostaną wprowadzone na rzeczywistej hali produkcyjnej.

### Jakie są 4 typy cyfrowych bliźniaków?
Powszechny czterostopniowy podział wyróżnia bliźniaki komponentów (części), bliźniaki aktywów, bliźniaki systemów (jednostek) i bliźniaki procesów [52]. Dla decyzji produkcyjnych bardziej użyteczny jest podział na bliźniaki produktu, procesu, aktywów, fabryki, wydajności i łańcucha dostaw (zob. sekcja 3). Żadna z tych klasyfikacji nie jest znormalizowana; norma ISO/IEC 30173 opisuje typy bliźniaków jedynie na poziomie ogólnym [9].

### Jaka jest różnica między cyfrowym bliźniakiem a cyfrowym cieniem?
Według Kritzingera i in., w cyfrowym cieniu dane płyną automatycznie od obiektu fizycznego do cyfrowego, ale droga powrotna jest ręczna. W cyfrowym bliźniaku dane płyną automatycznie w obu kierunkach [5]. Model cyfrowy nie ma żadnej automatycznej wymiany danych.

### Jakie są przykłady cyfrowych bliźniaków w produkcji?
Typowe przykłady to model fabryki porównujący warianty układu przed zatwierdzeniem nowego budynku, symulacja zasilana codziennie z ERP i MES, sprawdzająca, czy harmonogram na dany tydzień jest wykonalny, wirtualne uruchamianie (virtual commissioning), które testuje kod PLC przed instalacją linii, oraz model floty AGV dobierający liczbę pojazdów i ładowarek. McKinsey opisuje przypadki, takie jak przeprojektowany harmonogram montażu z miesięcznymi oszczędnościami kosztów na poziomie 5–7 procent oraz sekwencja wąskiego gardła, która skróciła czas przetwarzania o około cztery procent [26].

### Jaka jest różnica między cyfrowym bliźniakiem a symulacją?
Symulacja to model, na którym przeprowadza się eksperymenty. Staje się cyfrowym cieniem lub bliźniakiem, gdy jest automatycznie zasilana danymi operacyjnymi, a jej wyniki wracają do decyzji lub sterowania. Wiele bliźniaków zawiera w swoim rdzeniu symulację.

### Czy model 3D lub model BIM jest cyfrowym bliźniakiem?
Nie sam z siebie. Skan 3D, układ CAD czy model informacji o budynku (BIM) oddają geometrię. Bez logiki procesu (marszruty, czasy, zasoby) i połączenia z danymi operacyjnymi nie odpowiedzą na pytania o zdolności produkcyjne ani terminy realizacji. Może być jednak użyteczną warstwą bliźniaka, zwłaszcza przy planowaniu układu w istniejących obiektach (brownfield).

### Jaka jest różnica między symulacją produkcji a wirtualnym uruchamianiem?
Symulacja produkcji ocenia działanie na poziomie zleceń i zasobów (przepustowość, czas realizacji, wąskie gardła). Wirtualne uruchamianie testuje oprogramowanie sterujące maszyny na poziomie sygnałów, w oparciu o model urządzenia, zanim zostanie zbudowane fizyczne wyposażenie [14].

### Jakich danych potrzebuje cyfrowy bliźniak produkcji?
Dla bliźniaka produkcji i fabryki potrzebne są przede wszystkim zestawienia materiałowe, marszruty z czasami, gniazda robocze i ich zdolności, schematy zmian, zlecenia i potwierdzenia. Dane te pochodzą głównie z ERP i MES. Dane z maszyn i czujników poprawiają model, ale rzadko są punktem wyjścia.

### Czy można zbudować cyfrowego bliźniaka na podstawie danych z ERP?
Tak. W kwestiach zdolności produkcyjnych, czasu realizacji i harmonogramowania system ERP jest najważniejszym źródłem. Przechowuje dane o produktach, procesach i zasobach w postaci ustrukturyzowanej. Kontrola jakości danych jest niezbędna, ponieważ czasy normatywne i czasy przezbrojeń często odbiegają od rzeczywistości.

### Jakiego typu symulacja jest stosowana w produkcji?
Najczęściej symulacja zdarzeń dyskretnych, w której zegar przeskakuje od zdarzenia do zdarzenia. Dynamikę systemową stosuje się do pytań strategicznych, symulację agentową do pojazdów i ludzi, a symulację 3D opartą na fizyce do komórek robotów i testowania sterowania.

### Jak dokładny musi być cyfrowy bliźniak?
Na tyle dokładny, na ile wymaga decyzja, którą wspiera, i nie bardziej. Model należy zweryfikować względem danych rzeczywistych dla istotnych wskaźników (na przykład przepustowości lub czasu realizacji), udokumentować założenia i przeprowadzić analizy wrażliwości. NIST pracuje nad ramami weryfikacji, walidacji i oceny niepewności dla bliźniaków produkcyjnych [48].

### Jakie normy obowiązują dla cyfrowych bliźniaków w produkcji?
Podstawowe normy to ISO 23247 (ramy cyfrowego bliźniaka dla produkcji, części 1–6) [6][7][8], ISO/IEC 30173 (terminologia) [9], IEC 63278-1 (Asset Administration Shell) [10] oraz ISA-95 / IEC 62264 [58]. W zakresie bezpieczeństwa stosuje się ISA/IEC 62443 [59] i NIST SP 800-82 [55]. NIST AMS 400-2 pokazuje, jak zastosować ISO 23247 [47]. Wytyczne niemieckie (VDI 3633 dla symulacji, VDI/VDE 3693 dla uruchamiania wirtualnego, VDI 4499 dla fabryki cyfrowej) dodają szczegóły metodyczne [13][14][16].

### Czy cyfrowe bliźniaki pasują do małych i średnich producentów?
Tak, jeśli zaczniesz od wyraźnie zakreślonego pytania. Pilotaż dla jednego strumienia wartości lub jednego obszaru, oparty na istniejących danych z ERP, wymaga znacznie mniej wysiłku niż projekt IoT obejmujący cały zakład i szybciej przynosiweryfikowalną korzyść. Raport NIST o zastosowaniach ISO 23247 kieruje się właśnie do tej grupy [47], a centra NIST MEP oferują zewnętrzne wsparcie [60].

### Ile kosztuje cyfrowy bliźniak?
Zależy to od zakresu, sytuacji z danymi i poziomu integracji. Największe pozycje kosztów to zwykle przygotowanie danych, modelowanie, walidacja i utrzymanie, a nie samo oprogramowanie. Niemiecka firma świadcząca usługi symulacyjne podaje regułę kciuka: najwyżej 1 procent inwestycji, której dotyczy, na badania symulacyjne [30].

### Jak długo trwa wdrożenie?
McKinsey podaje zakres od dwóch do trzech miesięcy do ponad roku dla projektów bliźniaczych, w zależności od kompetencji zespołu i złożoności zakładu [26]. Pilotaż skupiony na jednej konkretnej decyzji jest zwykle możliwy w ciągu kilku miesięcy.

### Jak cyfrowy bliźniak pomaga planować floty AGV i AMR?
Symuluje pojazdy z przejazdami, przejazdami jałowymi, czasami oczekiwania, konfliktami na skrzyżowaniach i przerwami na ładowanie. Dzięki temu można ustalić liczbę pojazdów, trasy i strategię ładowania, co statyczne obliczenia regularnie zaniżają.

### Jaką rolę odgrywa sztuczna inteligencja?
AI pomaga przygotowywać dane, przyspiesza symulacje dzięki modelom zastępczym, uczy reguł sterowania wewnątrz modelu i czyni bliźniaki użytecznymi dzięki językowi naturalnemu. Wymaga zwalidowanego modelu i czystych danych.

### Czy Azure Digital Twins to to samo co digital twin builder w Fabric?
Nie. Microsoft wyraźnie stwierdza, że są to różne usługi [21][23]. Azure Digital Twins to usługa PaaS dla grafów bliźniaczych z użyciem DTDL; digital twin builder to narzędzie do ontologii i mapowania w Microsoft Fabric, które w chwili pisania tego tekstu jest w wersji zapoznawczej [23].

### Kto wynalazł cyfrowego bliźniaka?
Koncepcja sięga Michaela Grievesa, który przedstawił ją w 2002 roku w kontekście zarządzania cyklem życia produktu; Grieves przypisuje nazwę „cyfrowy bliźniak” Johnowi Vickersowi z NASA [1][2]. Inni autorzy wskazują wcześniejsze poprzedniki, na przykład w badaniach nad wytwarzaniem wirtualnym [4].

## 20. Zakończenie

Cyfrowy bliźniak w produkcji to mniej nowa technologia, a bardziej konsekwentne połączenie trzech sprawdzonych elementów: ustrukturyzowanego modelu produktów, procesów i zasobów; symulacji, która oddaje dynamikę i zmienność; oraz strumienia danych z rzeczywistych operacji. Standardy istnieją, od ISO 23247 i ISA-95 po Asset Administration Shell, NIST dostarcza wytycznych wdrożeniowych dla USA, a metoda symulacji fabryk jest testowana od dekad.

Najczęstszym błędem nie jest zła technologia, lecz brak celu. Zacznij od decyzji, która dziś zbyt często opiera się na intuicji lub arkuszu kalkulacyjnym: inwestycji kapitałowej, nowego miksu produktów, floty AGV czy tygodniowego harmonogramu, który regularnie się nie sprawdza. Rzetelnie sprawdź dane z ERP, zbuduj zwalidowany model pilotażowy, a następnie zdecyduj, jaki poziom integracji uzasadnia kolejny krok. Tak powstaje bliźniak, który nie tylko dobrze wygląda, ale poprawia decyzje.

## Dalsza lektura na m365.fm

**Wpisy na blogu i odcinki**

- [Cyfrowy bliźniak w produkcji: od czego zacząć](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Od ERP do hali produkcyjnej: cyfrowy bliźniak](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Odcinek: Cyfrowe bliźniaki na Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Odcinek: Mapowanie strumienia wartości jako model danych na żywo](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Strony encji**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/) · [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/)
- [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/)
- [iFAKT](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

**Powiązane przewodniki**

- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Host von m365.fm und arbeitet bei iFAKT GmbH. Auf m365.fm schreibt er über die Digitalisierung der Produktion mit Microsoft 365 und Azure, Wertstrommethoden, Produktionsplanung und digitale Zwillinge. Sein Schwerpunkt liegt darauf, wie sich aus bestehenden ERP- und Wertstromdaten verlässliche Modelle für Planung und Investitionsentscheidungen ableiten lassen.

**Hinweis: Der Autor arbeitet bei iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources [1] to [46] are carried over from the German version; [47] to [61] are new US/English sources, each opened and verified for this version.

1. Grieves, M.; Vickers, J. (2017): Digital Twin: Mitigating Unpredictable, Undesirable Emergent Behavior in Complex Systems. In: Kahlen, F.-J.; Flumerfelt, S.; Alves, A. (eds.): Transdisciplinary Perspectives on Complex Systems. Springer, Cham. DOI: [10.1007/978-3-319-38756-7_4](https://doi.org/10.1007/978-3-319-38756-7_4)
2. Grieves, M.: Digital and Physical Twins (book chapter, provided in the ASME resource library). https://event.asme.org/Events/media/library/resources/digital-twin/Digital-and-Physical-Twins.pdf
3. Glaessgen, E. H.; Stargel, D. S. (2012): The Digital Twin Paradigm for Future NASA and U.S. Air Force Vehicles. 53rd AIAA/ASME/ASCE/AHS/ASC Structures, Structural Dynamics and Materials Conference, Honolulu, April 23–26, 2012. NASA Technical Reports Server 20120008178. https://ntrs.nasa.gov/citations/20120008178
4. Zhou, J.; Zhang, S.; Gu, M. (2022): Revisiting Digital Twins: Origins, Fundamentals and Practices. arXiv:2203.12867 (with reference to Shafto et al. 2010, NASA Modeling, Simulation, Information Technology & Processing Roadmap). https://arxiv.org/abs/2203.12867
5. Kritzinger, W.; Karner, M.; Traar, G.; Henjes, J.; Sihn, W. (2018): Digital Twin in manufacturing: A categorical literature review and classification. IFAC-PapersOnLine 51(11), pp. 1016–1022. DOI: [10.1016/j.ifacol.2018.08.474](https://doi.org/10.1016/j.ifacol.2018.08.474)
6. ISO 23247-1:2021 Automation systems and integration: Digital twin framework for manufacturing, Part 1: Overview and general principles (Parts 2 to 4 also 2021). Catalog entry: https://iteh.eu/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021
7. ISO 23247-5 Automation systems and integration: Digital twin framework for manufacturing, Part 5: Digital thread for digital twin (Edition 1, 2026-06; status "under publication" when checked on November 20, 2026). https://www.iso.org/standard/87425.html
8. ISO 23247-6:2026 Automation systems and integration: Digital twin framework for manufacturing, Part 6: Digital twin composition (published July 14, 2026, stage 60.60). https://committee.iso.org/standard/87426.html
9. ISO/IEC 30173:2023 Digital twin: Concepts and terminology (November 2023). https://www.iso.org/standard/81442.html
10. IEC 63278-1:2023 Asset Administration Shell for industrial applications, Part 1: Asset Administration Shell structure (December 14, 2023). https://webstore.iec.ch/en/publication/65628
11. ZVEI (2020): User organization Industrial Digital Twin Association founded (founded September 24, 2020). https://www.zvei.org/en/press-media/pressarea/user-organization-industrial-digital-twin-association-founded
12. DIN SPEC 91345:2016-04 Reference Architecture Model Industrie 4.0 (RAMI4.0). https://www.dinmedia.de/de/technische-regel/din-spec-91345/250940128
13. VDI 3633 Part 1:2014-12 Simulation of systems in materials handling, logistics and production: Fundamentals. https://vdi.de/richtlinien/details/vdi-3633-blatt-1-simulation-of-systems-in-materials-handling-logistics-and-production-fundamentals ; VDI 3633 Part 8 (machine-oriented simulation, 3D motion and process simulation): https://www.vdi.de/mitgliedschaft/vdi-richtlinien/details/vdi-3633-blatt-8-simulation-of-systems-in-materials-handling-logistics-and-production-machine-oriented-simulation-3d-motion-and-process-simulation
14. VDI/VDE 3693 Part 1:2016-08 Virtual commissioning: Model types and glossary. https://vdi.de/richtlinien/details/vdivde-3693-blatt-1-virtual-commissioning-model-types-and-glossary
15. VDI/VDE 3693 Part 2:2018-12 Virtual commissioning: Introduction of virtual commissioning in companies; revision announced. https://vdi.de/en/home/vdi-standards/details/vdivde-3693-blatt-2-virtual-commissioning-introduction-of-virtual-commissioning-in-companies ; edition history: https://dinmedia.de/en/draft-technical-rule/vdi-vde-3693-blatt-2/276110751
16. VDI 4499 Part 1:2026-04 Digital factory: Fundamentals. https://vdi.de/richtlinien/details/vdi-4499-blatt-1-digital-factory-fundamentals
17. University of Duisburg-Essen, Chair VIP: lecture notes "Digitale Fabrik" (quotes the definition from VDI 4499 Part 1:2008; in German). https://www.uni-due.de/imperia/md/content/vip/scriptum_digitalefabrik.pdf
18. VDI 2510:2005-10 Automated guided vehicle systems (AGVS). https://vdi.de/richtlinien/details/vdi-2510-automated-guided-vehicle-systems-agvs ; draft VDI 2510:2025-07: https://www.dinmedia.de/de/technische-regel-entwurf/vdi-2510/388587666
19. OPC Foundation: OPC 10030 ISA-95 Common Object Model, section 4.2.3 ISA-95. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
20. Schuh, G.; Anderl, R.; Dumitrescu, R.; Krüger, A.; ten Hompel, M. (2020): Industrie 4.0 Maturity Index. Managing the Digital Transformation of Companies. Update 2020 (acatech STUDY). https://en.acatech.de/publication/industrie-4-0-maturity-index-update-2020/
21. Microsoft Learn: What is Azure Digital Twins? https://learn.microsoft.com/azure/digital-twins/overview
22. Microsoft Learn: Learn about twin models and how to define them in Azure Digital Twins (DTDL v2 and v3). https://learn.microsoft.com/en-ca/azure/digital-twins/concepts-models
23. Microsoft Learn: What Is Digital Twin Builder (Preview)? (last updated May 20, 2026; preview label re-checked November 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
24. Microsoft Fabric Blog: Digital twin builder in Microsoft Fabric Real-Time Intelligence. https://blog.fabric.microsoft.com/en-us/blog/digital-twin-builder-in-microsoft-fabric-real-time-intelligence-revolutionizing-digital-twin-creation-and-management
25. NVIDIA Blog (March 31, 2025): Industrial Ecosystem Adopts Mega NVIDIA Omniverse Blueprint to Train Physical AI in Digital Twins. https://blogs.nvidia.com/blog/mega-omniverse-blueprint-industrial-digital-twins/
26. Camarella, S.; Conway, M. P.; Goering, K.; Huntington, M. (2024): Digital twins: The next frontier of factory optimization. McKinsey & Company, January 10, 2024. https://www.mckinsey.com/capabilities/operations/our-insights/digital-twins-the-next-frontier-of-factory-optimization
27. Fraunhofer IWU (2024): Sächsische Maschinenbauer nutzen Vorteile der Virtuellen Inbetriebnahme oft noch nicht (press release on the SaxoVI study, August 13, 2024; in German). https://www.iwu.fraunhofer.de/content/dam/iwu/de/documents/Presse/2024-Saechsische-Maschinenbauer-nutzen-Vorteile-der-Virtuellen-Inbetriebnahme-oft-noch-nicht.pdf
28. Poll, D. (2021): Digitalisierung bei ZF: Neue Methode spart 30 Prozent Zeit. produktion.de, June 16, 2021 (in German). https://www.produktion.de/technik/digitalisierung-bei-zf-neue-methode-spart-30-prozent-zeit/1656151
29. Fraunhofer IESE: Digitaler Zwilling in der Produktion & Industrie 4.0 (in German). https://www.iese.fraunhofer.de/de/leistungen/digitaler-zwilling.html
30. SimPlan AG: FAQ Simulation (definition according to VDI 3633, cost-benefit rules of thumb). https://www.simplan.de/en/knowledge/faq-simulation-en
31. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (2014): Dynamische Simulation von Wertströmen [Dynamic simulation of value streams]. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109(11), pp. 839–842. DOI: [10.3139/104.111242](https://doi.org/10.3139/104.111242)
32. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (2023): Universelle Datenschnittstelle für digitale Wertstromdienste [Universal data interface for digital value stream services]. ZWF 118(5), pp. 293–297. DOI: [10.1515/zwf-2023-1062](https://doi.org/10.1515/zwf-2023-1062)
33. iFAKT GmbH: Polaris Designer (product page). https://www.ifakt.de/en/solutions/designer
34. iFAKT GmbH: Polaris Simulator (product page). https://www.ifakt.de/en/solutions/simulator
35. iFAKT GmbH: home page (company and Polaris platform). https://www.ifakt.de/
36. European Commission: Cyber Resilience Act, summary (Regulation (EU) 2024/2847). https://digital-strategy.ec.europa.eu/en/policies/cra-summary
37. Little, J. D. C. (1961): A Proof for the Queuing Formula: L = λW. Operations Research 9(3), pp. 383–387. DOI: [10.1287/opre.9.3.383](https://doi.org/10.1287/opre.9.3.383)
38. Forrester, J. W. (1961): Industrial Dynamics. MIT Press, Cambridge, MA.
39. Goldratt, E. M.; Cox, J. (1984): The Goal: A Process of Ongoing Improvement. North River Press.
40. Rother, M.; Shook, J. (1998): Learning to See: Value Stream Mapping to Add Value and Eliminate Muda. Lean Enterprise Institute, Brookline, MA.
41. Law, A. M. (2015): Simulation Modeling and Analysis. 5th ed., McGraw-Hill Education, New York.
42. SYMESTIC: Was ist ISA-95? (level model, relation to IEC 62264; in German). https://www.symestic.com/de-de/was-ist/isa-95
43. Umbrex: ISO 23247 Digital Twin Framework for Manufacturing (overview of parts and reference architecture). https://umbrex.com/resources/frameworks/manufacturing-industrial-equipment-frameworks/iso-23247-digital-twin-framework-for-manufacturing/
44. NEURONwriter: analysis "digitaler zwilling fertigung", google.de, query f5135b90c13e4c59 (internal analysis for the German version, accessed November 20, 2026).
45. NEURONwriter: analysis "produktionssimulation", google.de, query 3ee168d2a2cb38f1 (internal analysis for the German version, accessed November 20, 2026).
46. Kingman, J. F. C. (1961): The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57(4), pp. 902 ff. DOI: [10.1017/S0305004100036094](https://doi.org/10.1017/S0305004100036094)
47. Shao, G. (2021): Use Case Scenarios for Digital Twin Implementation Based on ISO 23247. NIST Advanced Manufacturing Series (NIST AMS) 400-2, May 4, 2021. DOI: [10.6028/NIST.AMS.400-2](https://doi.org/10.6028/NIST.AMS.400-2); publication page: https://www.nist.gov/publications/use-case-scenarios-digital-twin-implementation-based-iso-23247
48. NIST: Digital Twins for Advanced Manufacturing (project page; ISO 23247 Part 5 reference implementation, proposed VVUQ framework as Part 7, MTConnect interface, NIST Digital Twin Testbed). https://nist.gov/programs-projects/digital-twins-advanced-manufacturing
49. Voas, J.; Mell, P.; Laplante, P.; Piroumian, V. (2025): Security and Trust Considerations for Digital Twin Technology. NIST IR 8356 (final), February 14, 2025 (initial public draft 2021 titled "Considerations for Digital Twin Technology and Emerging Standards"). DOI: [10.6028/NIST.IR.8356](https://doi.org/10.6028/NIST.IR.8356); https://csrc.nist.gov/pubs/ir/8356/final
50. National Academies of Sciences, Engineering, and Medicine (2024): Foundational Research Gaps and Future Directions for Digital Twins. Consensus Study Report, The National Academies Press, Washington, DC (definition and quotes on p. 22). https://www.nationalacademies.org/our-work/foundational-research-gaps-and-future-directions-for-digital-twins ; chapter: https://www.nationalacademies.org/read/26894/chapter/4
51. Digital Twin Consortium (2020): Digital Twin Consortium Defines Digital Twin (definition released December 3, 2020). https://www.digitaltwinconsortium.org/2020/12/digital-twin-consortium-defines-digital-twin ; current definition page: https://www.digitaltwinconsortium.org/initiatives/the-definition-of-a-digital-twin/
52. IBM: What Is a Digital Twin? (component, asset, system and process twins). https://www.ibm.com/think/topics/what-is-a-digital-twin
53. ANSI/ITSDF B56.5-2024: Safety Standard for Guided Industrial Vehicles. ANSI Blog summary: https://blog.ansi.org/ansi/ansi-itsdf-b56-5-2024-guided-industrial-vehicles/
54. ANSI/A3 R15.08-1-2020 (R2026): Industrial Mobile Robots, Safety Requirements, Part 1: Requirements for the Industrial Mobile Robot (reaffirmed 2026, no technical changes). ANSI Webstore: https://webstore.ansi.org/standards/ria/ansia3r15082020r2026
55. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3); https://csrc.nist.gov/pubs/sp/800/82/r3/final
56. Deloitte (2025): 2025 Smart Manufacturing and Operations Survey, press release May 1, 2025 (600 executives, US manufacturers with $500 million+ revenue, survey August–September 2024). https://www.deloitte.com/us/en/about/press-room/deloitte-2025-smart-manufacturing-survey.html
57. MTConnect Institute: MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals, Version 1.4.0. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf ; about MTConnect: https://www.mtconnect.org/about
58. International Society of Automation (ISA): ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
59. International Society of Automation (ISA): ISA/IEC 62443 Series of Standards. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
60. NIST: Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep
61. Federal Trade Commission: Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, § 255.5 (disclosure of material connections, including an employee example); FTC notice on the revised Guides. https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf
