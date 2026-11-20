# SEO metadata

| Field | Value |
|---|---|
| Meta title | Fertigungskennzahlen: Formeln, Beispiele & Power BI-Leitfaden |
| Meta description | Fertigungskennzahlen mit Formeln und Praxisbeispielen: Takt, Zykluszeit, Durchlaufzeit, OEE, Ausschuss, FPY, OTIF, MTBF, TRIR und ein Power BI-Dashboard. |
| Slug | `manufacturing-kpis` |

# Kennzahlen in der Fertigung: Der vollständige Leitfaden zu Produktionskennzahlen, Formeln, Praxisbeispielen und Power BI-Dashboards

> **Krótka odpowiedź:** Wskaźniki KPI w produkcji to miary, które wyrażają w liczbach szybkość, jakość, dotrzymywanie terminów, koszty i bezpieczeństwo procesu produkcyjnego. Najważniejsze z nich to takt time, cycle time, manufacturing lead time, OEE, scrap rate, first pass yield, on-time in-full delivery (OTIF), days of supply, MTBF/MTTR, koszt jednostkowy oraz wskaźnik bezpieczeństwa, taki jak TRIR. Działają tylko wtedy, gdy każdy KPI ma jedną uzgodnioną definicję, wiarygodne dane i stały rytm spotkań, na których odchylenia przekładają się na działania.

> **Kluczowe wnioski**
> - **Najpierw zdefiniuj, potem buduj dashboard:** ISO 22400-2:2014 opisuje 34 KPI dla zarządzania operacjami produkcyjnymi, każdy z wzorem, jednostką i określeniem czasu [1][38]. ISA-95 umieszcza te KPI na poziomie 3, między warstwą sterowania a ERP [40]. W Niemczech wytyczna VDMA 66412-1 dodaje definicje KPI dla MES [4].
> - **Takt time to nie czas maszyny:** takt to czas dostępny podzielony przez popyt klienta [9]. Cycle time jest mierzony; lead time obejmuje również cały czas kolejek i oczekiwania [10].
> - **OEE = Availability × Performance × Quality.** Popularny cel 85 % „klasy światowej” wywodzi się od Nakajimy, ale nie jest uniwersalnym benchmarkiem [6][8].
> - **Prawo Little'a** łączy zapasy, przepustowość i lead time: jeśli nie zmniejszysz WIP, nie skrócisz lead time na dłuższą metę [13].
> - **Bezpieczeństwo jest na pierwszym miejscu i ma amerykański wzór standardowy:** wskaźnik zachorowalności OSHA to liczba przypadków × 200 000 ÷ przepracowane godziny [42]. W 2025 roku w amerykańskim sektorze prywatnym odnotowano 2,3 przypadków rejestrowalnych na 100 pracowników w przeliczeniu na pełne etaty [43].
> - **Mniej znaczy więcej (zalecenie):** pięć do ośmiu KPI na poziom, uporządkowanych według Safety, Quality, Cost, Delivery i People (SQCDP), wystarcza do prowadzenia operacji.
> - **KPI używane jako cele tracą wartość**, gdy się je nagradza zamiast rozumieć (prawo Goodharta) [23][24].
> - **Power BI** dobrze sprawdza się w dashboardach KPI, jeśli model danych to schemat gwiazdy, a OEE jest liczone z zsumowanych czasów, a nie ze średnich procentów [27].

## Spis treści

1. Czym są wskaźniki KPI w produkcji?
2. Ściąga wskaźników KPI w produkcji: wszystkie wzory w skrócie
3. Przykład „Linia 3”: dane wejściowe
4. Metryki czasowe: takt time, cycle time, lead time, processing time, flow factor
5. Takt time vs. cycle time vs. lead time
6. Czas przezbrojenia, SMED i micro-stops
7. OEE: jak obliczyć całkowitą efektywność urządzeń
8. KPI jakości: scrap rate, first pass yield, rework rate, PPM
9. KPI dostaw i zapasów: OTIF, schedule adherence, WIP, days of supply
10. Zdolność i produktywność: wykorzystanie, efektywność wykorzystania, produktywność pracy
11. KPI utrzymania ruchu: MTBF, MTTR i inherent availability
12. Energia, bezpieczeństwo (TRIR, DART, LTIFR) i koszt jednostkowy
13. Systemy KPI: hierarchia, wskaźniki wyprzedzające i opóźnione, SQCDP
14. Zbieranie danych i jakość danych
15. Wizualizacja: tablice na hali i dashboardy Power BI
16. Jak ustalać cele KPI
17. Typowe błędy i jak ich unikać
18. Plan wdrożenia: wprowadzenie wskaźników KPI w produkcji w 90 dni
19. KPI z modelowania strumienia wartości: iFAKT Polaris
20. Słowniczek
21. FAQ: wskaźniki KPI w produkcji
22. Podsumowanie

## 1. Czym są wskaźniki KPI w produkcji?

Wskaźniki KPI w produkcji (nazywane także metrykami produkcyjnymi, wskaźnikami KPI produkcji lub kluczowymi wskaźnikami efektywności w produkcji) to skondensowane liczby, które pozwalają zmierzyć jeden aspekt produkcji. Jak szybko zlecenie przepływa przez zakład? Jaką część zaplanowanego czasu maszyna faktycznie spędza na wytwarzaniu dobrych części? Ile wysyłek trafia do klienta na czas i w komplecie? Każdy wskaźnik KPI składa się z czterech elementów: **definicji** (dokładnie tego, co jest liczone), **wzoru**, **jednostki** i **okresu czasu**. Jeśli brakuje któregoś z nich, pojawia się znajome spotkanie, na którym dwa działy używają tej samej nazwy dla dwóch różnych liczb.

Nie każda metryka jest [kluczowym wskaźnikiem efektywności (KPI)](https://www.m365.fm/entity/key-performance-indicator/). KPI to metryka bezpośrednio powiązana z celem, która regularnie wpływa na decyzje. Liczba wyprodukowanych części to metryka. Terminowa dostawa do klienta jest dla większości zakładów wskaźnikiem KPI, ponieważ od niej zależą przychody i utrzymanie klientów.

### Normy stojące za wzorami: ISO 22400, ISA-95, SEMI i VDMA 66412

Nie musisz wymyślać własnych definicji wskaźników KPI. Międzynarodowa norma **ISO 22400-2:2014** „Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions” definiuje wybór popularnych wskaźników KPI wraz ze wzorem, harmonogramem, jednostką, grupą użytkowników i metodyką produkcyjną, do której się odnoszą [1]. Źródła wtórne liczą 34 wskaźniki KPI [38][3]. ISO oznacza normę jako „do rewizji”; Poprawka 1 dodała w 2017 roku zestaw wskaźników KPI dotyczących energii [1].

Norma opiera się na precyzyjnym modelu czasu. Kang i in., w artykule opublikowanym za pośrednictwem amerykańskiego National Institute of Standards and Technology (NIST), podają podstawowe wzory: dostępność = rzeczywisty czas produkcji (APT) ÷ zaplanowany czas zajętości (PBT), a efektywność = zaplanowany czas pracy na sztukę (PRI) × wyprodukowana ilość (PQ) ÷ APT [3]. Zatem norma używa określenia „efektywność” tam, gdzie literatura TPM mówi „wydajność” (performance).

Dla czytelników z USA **ISA-95** (ANSI/ISA-95, na poziomie międzynarodowym IEC 62264) zapewnia architekturę wokół tych wskaźników KPI. Oparta na modelu referencyjnym Purdue, definiuje pięć poziomów: od procesu fizycznego (Poziom 0) przez czujniki, sterowanie nadzorcze i **Poziom 3, zarządzanie operacjami produkcyjnymi (MOM), gdzie działają MES i SCADA**, aż po planowanie biznesowe i logistykę w ERP (Poziom 4) [40]. Wskaźniki KPI z ISO 22400 są z nazwy wskaźnikami zarządzania operacjami produkcyjnymi, dlatego oblicza się je na Poziomie 3 ISA-95 i raportuje w górę. W fabrykach półprzewodników wiodącymi odniesieniami branżowymi są SEMI E10 (niezawodność, dostępność, łatwość utrzymania i wykorzystanie sprzętu) oraz SEMI E79 (produktywność sprzętu, w tym OEE) [41].

W Niemczech grupa robocza VDMA (niemieckiego stowarzyszenia przemysłu maszynowego) opublikowała wytyczną **VDMA 66412-1 „Manufacturing Execution Systems (MES) – KPIs”** (wydanie 2009-10, 36 stron, zmieniona przez A1:2010-05) [4]. Definiuje ona standardowe wskaźniki KPI oraz sposób ich obliczania na podstawie stanów maszyn [5]. Przesłanie dla Ciebie jako praktyka jest takie samo w każdym kraju: w miarę możliwości przyjmuj standardowe terminy i dokumentuj każde odstępstwo. Ułatwia to porównania między zakładami i integrację z MES.

### Do czego służą wskaźniki KPI w produkcji

Wskaźniki KPI spełniają trzy zadania. **Uwidaczniają** to, co ginie w codziennej pracy, na przykład to, że maszyna działa cały czas, ale daje tylko dwie trzecie możliwego wyniku. **Koncentrują uwagę** na największej dźwigni, ponieważ dzielą straty na kategorie. I **testują działania zaradcze**: czy nowa metoda przezbrojeń rzeczywiście skróciła czas przezbrojenia, czy strata po prostu przeniosła się do fazy rozruchu? Bez liczby to pytanie pozostaje kwestią opinii.

Czwarty cel jest często pomijany: wskaźniki KPI są narzędziem **komunikacji**. W [zarządzaniu na hali produkcyjnej](https://www.m365.fm/entity/shop-floor-management/) stanowią wspólny język operatorów, kierowników zmian i kierownictwa zakładu. Spełniają tę rolę tylko wtedy, gdy wszyscy znają definicję i widzą tę samą liczbę.

## 2. Ściągawka KPI produkcyjnych: wszystkie wzory w skrócie

Tabela zestawia wszystkie wskaźniki KPI omówione w tym przewodniku. Kolumna „Poziom" pokazuje typowy poziom zarządzania (M = maszyna/stanowisko, L = linia/obszar, P = zakład). Wzory opierają się na źródłach wymienionych w każdej sekcji.

| KPI | Wzór (skrócony) | Jednostka | Kierunek | Poziom |
|---|---|---|---|---|
| Takt time | dostępny czas produkcji ÷ popyt klienta | s/szt. | dane wejściowe, nie wielkość do optymalizacji | L |
| Cycle time | zmierzony czas między dwiema gotowymi sztukami | s/szt. | ≤ takt | M, L |
| Czas realizacji produkcji (manufacturing lead time) | koniec − początek (zlecenia lub części); średnio WIP ÷ przepustowość | h, dni | ↓ | L, P |
| Czas obróbki (processing time) | suma czasów, w których część jest rzeczywiście obrabiana | s, min | ↓ (bez utraty jakości) | M, L |
| Współczynnik przepływu (Wiendahl) | czas realizacji ÷ czas operacji | stosunek (≥ 1) | ↓ | L |
| Udział wartości dodanej (VSM) | czas obróbki ÷ czas realizacji × 100 | % | ↑ | L, P |
| Czas przezbrojenia | ostatnia dobra sztuka starej serii do pierwszej dobrej sztuki nowej serii | min | ↓ | M |
| Udział przezbrojeń | czas przezbrojenia ÷ planowany czas produkcji × 100 | % | ↓ | M, L |
| Mikroprzestoje | liczba lub czas krótkich postojów poniżej ustalonego progu | liczba, min | ↓ | M |
| Dostępność (OEE) | czas pracy ÷ planowany czas produkcji | % | ↑ | M |
| Wydajność (OEE) | idealny czas cyklu × łączna liczba sztuk ÷ czas pracy | % | ↑ | M |
| Wskaźnik jakości (OEE) | liczba dobrych sztuk ÷ łączna liczba sztuk | % | ↑ | M |
| OEE | dostępność × wydajność × jakość | % | ↑ | M, L |
| TEEP | OEE × obciążenie (czas planowany ÷ czas kalendarzowy) | % | ↑ | M, P |
| Wskaźnik braków | liczba braków ÷ łączna liczba sztuk × 100 | % | ↓ | M, L, P |
| First pass yield (FPY) | sztuki dobre za pierwszym razem ÷ łączna liczba sztuk × 100 | % | ↑ | M, L |
| Wskaźnik poprawek | liczba poprawianych sztuk ÷ łączna liczba sztuk × 100 | % | ↓ | M, L |
| PPM | wadliwe części ÷ części skontrolowane lub wysłane × 1 000 000 | ppm | ↓ | P |
| OTIF | pozycje dostarczone na czas i w całości ÷ wszystkie pozycje do dostarczenia × 100 | % | ↑ | P |
| Dotrzymanie harmonogramu produkcji | zlecenia zrealizowane zgodnie z harmonogramem ÷ wszystkie zlecenia do realizacji × 100 | % | ↑ | L, P |
| WIP | ilość lub wartość produkcji w toku | szt., $ | ↓ (do minimum koniecznego) | L |
| Dni zapasu (days of supply) | zapas ÷ średnie dzienne zużycie | dni | ↓ (do poziomu zapasu bezpieczeństwa) | L, P |
| Wykorzystanie zdolności produkcyjnych | obciążenie ÷ dostępna zdolność × 100 | % | pasmo docelowe, nie maksimum | L, P |
| Efektywność wykorzystania (ISO) | rzeczywisty czas produkcji ÷ rzeczywisty czas zajętości jednostki | % | ↑ | M |
| Produktywność pracy | liczba dobrych sztuk ÷ godziny pracy | szt./h | ↑ | L, P |
| MTBF | czas pracy ÷ liczba awarii | h, min | ↑ | M |
| MTTR | łączny czas napraw ÷ liczba awarii | min | ↓ | M |
| Energia na sztukę | zużyta energia ÷ liczba dobrych sztuk | kWh/szt. | ↓ | M, P |
| TRIR (OSHA) | przypadki rejestrowalne × 200 000 ÷ przepracowane godziny | na 100 FTE | ↓ | P |
| DART rate (OSHA) | przypadki DART × 200 000 ÷ przepracowane godziny | na 100 FTE | ↓ | P |
| LTIFR | urazy z utratą czasu pracy ÷ przepracowane godziny × 1 000 000 | na 1 mln h | ↓ | P |
| Koszt jednostkowy | koszt okresu ÷ liczba dobrych sztuk | $/szt. | ↓ | L, P |

## 3. Przykład obliczeniowy „Linia 3": dane wejściowe

Aby wzory były konkretne, ten przewodnik oblicza każdy wskaźnik KPI na jednej fikcyjnej linii montażowej. Liczby dobrano tak, by się wzajemnie sprawdzały: jeśli OEE jest poprawne, musi być zgodne z liczbą dobrych sztuk, a jeśli czas realizacji jest poprawny, musi być zgodny z WIP i przepustowością.

| Dane wejściowe | Wartość |
|---|---|
| Schemat zmian | 2 zmiany po 8 h (480 min), 5 dni w tygodniu |
| Przerwy na zmianę | 30 min (nie są planowanym czasem produkcji) |
| Planowany czas produkcji na zmianę | 450 min |
| Popyt klienta | 900 sztuk dziennie, tj. 450 sztuk na zmianę |
| Idealny czas cyklu (stanowisko wąskiego gardła) | 50 s/szt. |
| Awarie na zmianę | 25 min |
| Przezbrojenia na zmianę | 2 przezbrojenia po 10 min = 20 min |
| Łączna liczba sztuk na zmianę | 432 sztuki |
| z tego dobre za pierwszym razem | 410 sztuk |
| z tego poprawione, a następnie dobre | 12 sztuk |
| z tego złom | 10 sztuk |
| Obsada | 6 operatorów na zmianę |

Te dane wejściowe powracają w każdej sekcji. Każde obliczenie zostało ponownie sprawdzone; zaokrąglenia stosowane są tylko w wyniku. Koszty w sekcji 12 podano w dolarach amerykańskich; liczby są orientacyjne, podobnie jak sama linia.

## 4. Metryki czasowe: takt time, czas cyklu, czas realizacji, czas przetwarzania, współczynnik przepływu

Metryki czasowe są najczęściej mylonymi wskaźnikami produkcyjnymi. Terminy brzmią podobnie, a firmy stosują je w praktyce różnie. Zapisz raz definicje obowiązujące w swoim zakładzie i odsyłaj do nich na każdej tablicy.

### Jak obliczyć takt time

[Takt time](https://www.m365.fm/entity/takt-time/) mówi, jak często gotowa sztuka musi opuszczać linię, aby zaspokoić popyt klienta. Lean Enterprise Institute (LEI) definiuje go jako dostępny czas produkcji podzielony przez popyt klienta [9]. Rother i Shook wymieniają „Produkuj zgodnie z taktem" jako pierwszą zasadę szczupłego strumienia wartości i opisują takt jako zastępstwo popytu klienta [2][12].

> **Takt time = dostępny czas produkcji w okresie ÷ popyt klienta w okresie**

Słowo pochodzi z niemieckiego („Takt" oznacza takt lub miarę). Według LEI takt po raz pierwszy zastosowano jako narzędzie zarządzania produkcją w niemieckim przemyśle lotniczym w latach 30. XX wieku [9].

**Przykład dla Linii 3:** dostępny czas na zmianę 450 min = 27 000 s; popyt na zmianę 450 sztuk.
Takt time = 27 000 s ÷ 450 sztuk = **60 s/szt.**

Jako kontrola: przykład LEI – 480 minut dziennie i popyt 240 sztuk dają takt 2 minuty [9].

**Typowe błędy:**
- **Nieodejmowanie przerw.** Użycie 480 zamiast 450 minut daje takt 64 s. Na papierze linia zostałaby wtedy zaprojektowana zbyt wolno.
- **Odejmowanie nieplanowanych przestojów.** Awarie nie należą do dostępnego czasu dla taktu. Są stratą, którą linia musi pokryć z rezerwy zdolności. Ich odejmowanie ukrywa problem w takcie.
- **Traktowanie taktu jako czegoś do optymalizacji.** Takt ustala klient, nie produkcja. Optymalizuje się czas cyklu tak, by niezawodnie spełniał takt.
- **Mylenie taktu z szybkością.** Takt to czas na sztukę, nie sztuki w czasie. Jego odwrotność (1 sztuka co 60 s = 60 sztuk na godzinę) to wymagana szybkość wyjściowa.

### Czas cyklu

Według LEI [czas cyklu](https://www.m365.fm/entity/cycle-time/) to „czas wymagany do wyprodukowania części lub zakończenia procesu, mierzony rzeczywistym pomiarem" [10]. W mapowaniu strumienia wartości opisuje, jak często proces kończy jedną część. Kluczowe słowo to „zmierzony": czas cyklu jest wartością rzeczywistą. **Idealny czas cyklu** (zwany też normatywnym, projektowym lub znamionowym) to najlepszy technicznie możliwy czas i podstawa wydajności w OEE.

> **Średni rzeczywisty czas cyklu = czas pracy ÷ wyprodukowane sztuki**

**Przykład dla Linii 3:** czas pracy 405 min (450 min minus 25 min awarii minus 20 min przezbrojeń) = 24 300 s; wyprodukowano 432 sztuki.
Rzeczywisty czas cyklu = 24 300 s ÷ 432 = **56,25 s/szt.**
Idealny czas cyklu wynosi 50 s. Różnica 6,25 s na sztukę mieści się w mikropostojach i obniżonej prędkości, czyli w stracie wydajności (sekcja 7).

Dla maszyn LEI definiuje także **efektywny czas cyklu maszyny**: czas cyklu maszyny plus czas załadunku i rozładunku plus czas przezbrojenia podzielony przez liczbę sztuk wykonanych między przezbrojeniami [10]. Pokazuje on, czy maszyna w ogóle może utrzymać takt, biorąc pod uwagę, jak często jest przezbrajana.

**Częsty błąd:** utożsamianie czasu taktu z czasem cyklu. Oba wyrażane są w sekundach na sztukę, ale takt jest wielkością popytową, a czas cyklu wielkością procesową. Co najmniej jedna wysoko notowana angielskojęzyczna strona podaje wzór na czas cyklu odwrotnie (sztuki ÷ czas pracy); to jest wskaźnik szybkości, a nie czas cyklu.

### Jak obliczyć czas realizacji w produkcji

[Czas realizacji](https://www.m365.fm/entity/lead-time/) (czas realizacji produkcji, zwany też czasem przepływu) to „czas potrzebny produktowi na przejście przez cały proces lub strumień wartości od początku do końca” [10]. Oprócz obróbki obejmuje wszystkie czasy transportu, kolejkowania i oczekiwania. Niemiecka inżynieria produkcji dzieli go na czas operacji (przygotowanie i obróbka), czas przejścia (kolejkowanie i transport) oraz czas oczekiwania międzyoperacyjnego [15]. Hans-Peter Wiendahl uczynił czas realizacji centralnym pojęciem sterowania produkcją dzięki swojemu modelowi lejka [15][14].

Istnieją dwa sposoby jego wyznaczania:

**1. Bezpośrednio, dla zlecenia lub detalu:**

> **Czas realizacji = znacznik czasu zakończenia − znacznik czasu rozpoczęcia (lub zwolnienia zlecenia)**

Należy określić, czy liczymy dni kalendarzowe, dni robocze (dni kalendarza zmianowego) czy godziny oraz od kiedy biegnie zegar (wprowadzenie zlecenia, zwolnienie, pierwsza operacja). Różne punkty startowe to najczęstsza przyczyna sporów między sprzedażą a produkcją o to, jaki jest „właściwy” czas realizacji.

**2. Pośrednio, za pomocą prawa Little’a:**

W 1961 roku John D. C. Little udowodnił, że w stabilnym systemie średnia liczba elementów w systemie równa się intensywności napływu pomnożonej przez średni czas przebywania w systemie (L = λW) [13]. Zastosowane do produkcji:

> **Średni czas realizacji = średnie WIP ÷ średnia przepustowość**

**Przykład dla linii 3:** średnio 2 700 detali znajduje się w linii i jej buforach; linia wysyła średnio 900 detali na dzień roboczy.
Czas realizacji = 2 700 ÷ 900 = **3 dni robocze**.

Prawo Little’a obowiązuje dla średnich w dostatecznie długim okresie, w którym WIP ani nie rośnie, ani nie maleje. WIP i przepustowość muszą być wyrażone w tej samej jednostce (sztukach lub złotych, nie mieszane). Jego duża wartość praktyczna: pokazuje, że przy stałej przepustowości krótszy czas realizacji jest możliwy wyłącznie przy mniejszym WIP. Same szybsze maszyny niewiele dają, dopóki detale czekają przed nimi.

### Czas obróbki i czas normatywny (REFA)

**Czas obróbki** to czas, w którym produkt faktycznie jest przetwarzany [10]; zwykle stanowi niewielki ułamek czasu realizacji. Do planowania i kalkulacji kosztów niemieckie zakłady stosują kategorie czasu REFA, niemieckiego stowarzyszenia zajmującego się projektowaniem pracy i inżynierią przemysłową (pod względem roli porównywalnego z konwencjami czasu normatywnego w amerykańskiej inżynierii przemysłowej). REFA dzieli czas zlecenia na czas przygotowawczo-zakończeniowy i czas wykonania, z których każdy składa się z części podstawowej, przerw i zapasów; po stronie maszyny odpowiednikiem jest czas zajętości urządzenia [16][17]:

> **Czas zlecenia T = czas przygotowawczo-zakończeniowy t_r + czas wykonania t_a**, przy **t_a = wielkość zlecenia m × czas na jednostkę t_e**

**Przykład:** zlecenie 400 jednostek idzie na stanowisku wąskim gardle: przygotowanie 20 min, czas na jednostkę 50 s.
T = 20 min + 400 × 50 s ÷ 60 = 20 + 333,3 = **353,3 min** (około 5,9 h).

Nyhuis i Wiendahl wyprowadzają **czas operacji** kroku roboczego ze czasu zlecenia i wyrażają go w dniach kalendarza zmianowego, odnosząc czas zlecenia do dziennej zdolności produkcyjnej gniazda [14]. [unverified: dokładny zapis wzoru u Nyhuisa/Wiendahla, rozdział 2.1.1, zweryfikowany wyłącznie na podstawie spisu treści i wykazu skrótów] Aby przykłady były porównywalne, poradnik upraszcza obliczenia i prowadzi je w minutach czasu pracy; dla pojedynczej maszyny czas operacji jest wtedy równy czasowi zlecenia.

### Współczynnik przepływu i wskaźnik wartości dodanej

Krążą dwa różne wskaźniki KPI o podobnych nazwach i nie należy ich mylić.

**Współczynnik przepływu według Wiendahla (ujęcie logistyczne):** stosunek czasu realizacji do czasu operacji kroku roboczego lub zlecenia [14][15]. Wartość 1 oznacza, że zlecenie przebiegło bez oczekiwania; wartość 6 oznacza, że zlecenie spędziło w systemie sześciokrotnie więcej czasu, niż wymagały przygotowanie i obróbka.

> **Współczynnik przepływu = czas realizacji ÷ czas operacji**

**Przykład:** zlecenie z przykładu REFA ma czas operacji 353,3 min. Przed operacją czeka dwa dni robocze (2 × 900 min = 1 800 min czasu pracy).
Czas realizacji operacji = 1 800 + 353,3 = 2 153,3 min. Współczynnik przepływu = 2 153,3 ÷ 353,3 = **6,09**.

**Wskaźnik wartości dodanej (ujęcie strumienia wartości):** w [mapowaniu strumienia wartości](https://www.m365.fm/entity/value-stream-mapping/) częsty jest także odwrotny ujęcie: udział czasu przetwarzania w czasie realizacji, w procentach. (Węższy wskaźnik LEI, „czas tworzący wartość”, liczy tylko te elementy pracy, za które klient jest gotów zapłacić [10].) Niemiecka Wikipedia nazywa ten wskaźnik „Fließgrad”, a jego odwrotność „Flussgrad”, i podaje udział działań dodających wartość w niemieckim przemyśle na poziomie 5–15 procent [15]. [unverified: primary source for this range not clearly documented in Wikipedia] Niektóre podręczniki dotyczące strumienia wartości nazywają ten procent także współczynnikiem przepływu. Dlatego zawsze sprawdzaj, czy chodzi o wartość powyżej 1, czy poniżej 100 %.

> **Wskaźnik wartości dodanej = czas przetwarzania ÷ czas realizacji × 100 %**

**Przykład dla linii 3:** czasy przetwarzania czterech stanowisk sumują się do 190 s. Czas realizacji wynosi 3 dni robocze po 900 min czasu pracy każdy = 162 000 s.
Wskaźnik wartości dodanej = 190 ÷ 162 000 × 100 % = **0,117 %**.

Wartości poniżej jednego procenta są normalne w operacjach z buforami i partiami. Liczy się trend oraz podstawa czasowa: w czasie kalendarzowym wartość spada jeszcze bardziej. Metoda jest szczegółowo opisana w przewodniku [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 5. Takt time a cycle time a lead time

Pytanie „jaka jest różnica między taktem a czasem cyklu?” należy do najczęstszych wokół wskaźników KPI w produkcji. Tabela zestawia wszystkie trzy wielkości obok siebie. LEI podsumowuje tę kolejność tak: „Zwykle czas tworzący wartość jest krótszy niż czas cyklu, który z kolei jest krótszy niż czas realizacji produkcji” [10].

| Atrybut | Takt time | Cycle time | Lead time |
|---|---|---|---|
| Pytanie | Co jak często **musi** zostać ukończone? | Co jak często **jest** kończone? | Ile czasu część **przechodzi** przez system? |
| Źródło | popyt klienta i czas pracy | pomiar na procesie | znaczniki czasu lub prawo Little'a |
| Wzór | dostępny czas ÷ popyt | czas pracy ÷ sztuki (zmierzony) | koniec − początek, lub WIP ÷ przepustowość |
| Typowa jednostka | s/szt. | s/szt. | h, dni |
| Linia 3 | 60 s | 56,25 s (idealnie 50 s) | 3 dni robocze |
| Kto wpływa? | sprzedaż, klient, układ zmian | inżynieria, metoda, utrzymanie ruchu | harmonogramowanie, WIP, wielkość partii |
| Sensowny kierunek | brak; jest to wartość zadana | ≤ takt z zapasem | jak najkrótszy |
| Częsty błąd | nieodjęte przerwy | użycie wartości idealnej zamiast rzeczywistej | niezdefiniowany punkt startu |

**Kluczowa obserwacja z przykładu:** rzeczywisty czas cyklu wynoszący 56,25 s jest poniżej taktu 60 s. Mimo to linia 3 nie realizuje popytu, jak pokazują kolejne sekcje, ponieważ czas cyklu dotyczy wyłącznie czasu pracy. Awarie, przezbrojenia i braki nie są w tym ujęciu uwzględnione. Dla projektowania linii liczy się **efektywny czas cyklu na dobrą sztukę**, czyli planowany czas produkcji podzielony przez liczbę dobrych sztuk.

## 6. Czas przezbrojenia, SMED i mikroprzestoje

### Czas przezbrojenia i udział przezbrojeń

[Czas przezbrojenia](https://www.m365.fm/entity/setup-time/) (setup time) to czas potrzebny na przestawienie maszyny lub linii z jednego produktu na inny. W praktyce najlepiej mierzyć go od ostatniej dobrej sztuki poprzedniego zlecenia do pierwszej dobrej sztuki nowego zlecenia, ponieważ obejmuje to regulację i rozruch. [unverified: ta konwencja jest powszechna w praktyce, ale nie została sformułowana dosłownie w sprawdzonych tu źródłach.] W systemie REFA czas przezbrojenia jest częścią czasu zlecenia [16].

> **Udział przezbrojeń = czas przezbrojenia ÷ planowany czas produkcji × 100 %**

**Przykład dla linii 3:** 20 min przezbrojenia ÷ 450 min = **4,44 %**.

### SMED: przezbrojenia w jednocyfrowej liczbie minut

[SMED](https://www.m365.fm/entity/smed/) (Single-Minute Exchange of Die) to metoda skracania przezbrojeń do minimum; celem jest czas przezbrojenia w jednocyfrowej liczbie minut, czyli poniżej dziesięciu minut [11]. Shigeo Shingo opracował podstawowe idee w latach 50. i 60. XX wieku: oddzielił czynności wewnętrzne, które można wykonać tylko przy zatrzymanej maszynie, od czynności zewnętrznych, które mogą być wykonane przy pracującej maszynie, i jak najwięcej z nich przeniósł na zewnątrz [11].

**Przykład dla linii 3:** jeśli oba przezbrojenia skrócą się z 10 do 6 min, linia zyska 8 min czasu pracy na zmianie. Przy niezmienionej wydajności 88,9 % oznacza to 8 × 60 ÷ 50 × 0,889 = **około 8,5 dodatkowej sztuki** na zmianę. Alternatywnie linia może utrzymać ten sam łączny czas przezbrojeń, przezbrajać częściej i produkować mniejsze partie, co zmniejsza zapasy w toku i czas realizacji.

**Częsty błąd:** traktowanie czasu przezbrojenia wyłącznie jako straty. Krótsze przezbrojenia są przede wszystkim dźwignią do zmniejszania partii. Jeśli cały zyskany czas przeznaczy się na dłuższe serie, traci się korzyść logistyczną.

### Mikroprzestoje

[Mikroprzestoje](https://www.m365.fm/entity/micro-stops/) (minor stops) to krótkie przerwy, na przykład zacięcie detalu lub zadziałanie czujnika, które pojedynczo ledwo są zauważalne. W ramach TPM według Nakajimy należą do sześciu wielkich strat jako „straty na biegu jałowym i drobnych przestojach” i obniżają wydajność, a nie dostępność [7]. Każda firma sama ustala próg rozróżnienia między mikroprzestojem a awarią; powszechne są progi rzędu kilku minut. [unverified: nie znaleziono normy z wiążącym progiem.] Muchiri i Pintelon zwracają uwagę, że ręczne rejestrowanie często pomija drobne przestoje [7].

**Przykład dla linii 3:** łączna strata wydajności to czas pracy minus czas idealny dla wyprodukowanych sztuk: 405 min − 432 × 50 s ÷ 60 = 405 − 360 = **45 min**. Sterownik maszyny zlicza 120 mikroprzestojów po 15 s każdy = 30 min. Pozostałe 15 min to obniżona prędkość. Bez automatycznego zbierania danych te 30 minut mikroprzestojów prawdopodobnie zostałoby zapisane w raporcie zmianowym jako „linia pracowała”.

## 7. OEE: jak obliczyć całkowitą efektywność urządzeń

Całkowita efektywność urządzeń (OEE, ang. overall equipment effectiveness) to najbardziej znany wskaźnik KPI w produkcji. Pojęcie to wywodzi się od Seiichiego Nakajimy i jest kluczowym elementem [Total Productive Maintenance (TPM)](https://www.m365.fm/entity/total-productive-maintenance/) [8][6]. Glosariusz ASQ opisuje OEE jako miarę tego, jak dobrze jednostka produkcyjna działa w stosunku do swojej projektowej zdolności w okresach, w których jest zaplanowana do pracy, łącząc czas sprawnej pracy, prędkość oraz udział produkcji dobrej [36]. OEE odpowiada na jedno pytanie: jaki udział zaplanowanego czasu produkcji wykorzystano na wytwarzanie dobrych detali przy idealnej prędkości?

### Trzy czynniki

> **OEE = Dostępność × Wydajność × Jakość**

| Czynnik | Wzór | Straty, które obejmuje |
|---|---|---|
| Dostępność | czas pracy ÷ planowany czas produkcji | awarie, przezbrojenia i regulacje |
| Wydajność (ISO: effectiveness) | idealny czas cyklu × łączna liczba ÷ czas pracy | mikroprzestoje, obniżona prędkość |
| Jakość | liczba dobrych ÷ łączna liczba | braki, poprawki, straty w rozruchu |

Muchiri i Pintelon definiują dostępność jako czas pracy wyrażony procentowo w stosunku do czasu obciążenia, wydajność jako teoretyczny czas cyklu pomnożony przez rzeczywistą produkcję i podzielony przez czas pracy, a wskaźnik jakości jako całkowitą produkcję pomniejszoną o wady w stosunku do całkowitej produkcji [7]. ISO 22400-2 stosuje tę samą logikę, z własnymi określeniami czasu [3].

### Sześć wielkich strat

Nakajima przypisuje straty do sześciu kategorii [7]:

1. **Awarie** (straty z powodu awarii) → dostępność
2. **Przezbrojenie i regulacja** → dostępność
3. **Bezczynność i drobne postoje** → wydajność
4. **Obniżona prędkość** → wydajność
5. **Wady jakościowe i poprawki** → jakość
6. **Obniżony uzysk w rozruchu** → jakość

To przypisanie jest prawdziwą wartością OEE. Sam wynik ogólny niewiele mówi; dopiero rozbicie pokazuje, czy największą dźwignię ma utrzymanie ruchu, zespół przezbrojeń, czy jakość.

### Jak obliczyć OEE: przykład linii 3

**Krok 1, dostępność:** planowany czas produkcji 450 min; awarie 25 min, przezbrojenia 20 min; czas pracy 405 min.
Dostępność = 405 ÷ 450 = **90,0 %**.

**Krok 2, wydajność:** 432 sztuki × 50 s = 21 600 s idealnego czasu; czas pracy 405 min = 24 300 s.
Wydajność = 21 600 ÷ 24 300 = **88,9 %**.

**Krok 3, jakość:** 410 detali dobrych za pierwszym razem na 432 sztuki.
Jakość = 410 ÷ 432 = **94,9 %**.

**Krok 4, OEE:** 0,900 × 0,8889 × 0,9491 = **75,9 %**.

**Kontrola przez czas:** liczba dobrych sztuk razy idealny czas cyklu podzielona przez planowany czas produkcji = 410 × 50 s ÷ 27 000 s = 20 500 ÷ 27 000 = **75,9 %**. Obie metody muszą dać ten sam wynik; jeśli nie, dane wejściowe są błędne.

**Co OEE oznacza dla taktu:** efektywny czas cyklu na jeden dobry detal wynosi 50 s ÷ 0,759 = 65,9 s, czyli więcej niż takt wynoszący 60 s. W ciągu 27 000 s linia wytwarza 410 dobrych detali za pierwszym razem, a 422 wliczając 12 detali poprawianych. Zapotrzebowanie 450 sztuk na zmianę jest niespełnione o 28 sztuk. Aby pokryć je wyłącznie dobrymi detalami za pierwszym razem, linia 3 potrzebowałaby OEE na poziomie 450 × 50 ÷ 27 000 = 83,3 %.

### Poprawki: dobre czy złe?

W logice TPM poprawka jest stratą jakościową [7]; dlatego w przykładzie liczone są tylko 410 detali dobrych za pierwszym razem. Kang i in. stosują wskaźnik jakości, który traktuje detale poprawiane jako dobre [3]. Przy 422 zamiast 410 detalach jakość wzrosłaby do 97,7 %, a OEE do 78,1 %. Oba warianty są uzasadnione, ale trzeba wybrać jeden i nie wolno porównywać zakładów stosujących różne definicje.

### TEEP: OEE w odniesieniu do czasu kalendarzowego

Całkowita efektywna wydajność urządzeń (TEEP, ang. total effective equipment performance) odnosi OEE do całkowitego czasu kalendarzowego, a nie tylko do czasu planowanego [8]:

> **TEEP = OEE × obciążenie**, gdzie **obciążenie = planowany czas produkcji ÷ czas kalendarzowy**

**Przykład linii 3:** 10 zmian × 450 min = 4 500 min planowanego czasu na tydzień; czas kalendarzowy 7 × 24 × 60 = 10 080 min.
Obciążenie = 4 500 ÷ 10 080 = 44,6 %. TEEP = 75,9 % × 44,6 % = **33,9 %**.

TEEP jest właściwym wskaźnikiem do decyzji inwestycyjnych: zanim kupi się drugą maszynę, pokazuje, ile niewykorzystanego czasu kalendarzowego ma już istniejąca. Warto zauważyć, że niektóre anglojęzyczne źródła podają dla OEE, OOE i TEEP ten sam wzór; to błąd, ponieważ te trzy wskaźniki różnią się bazą czasu.

### Jaka jest dobra wartość OEE? Skąd wzięło się 85 % jako benchmark i dlaczego jest kwestionowany

Wartość 85 % jako „klasy światowej OEE" jest w artykułach branżowych regularnie przypisywana Nakajimie; często wyprowadza się ją z dostępności 90 %, wydajności 95 % i jakości 99,9 % (0,90 × 0,95 × 0,999 = 85,4 %) [37]. W źródłach pierwotnych i przeglądowych sprawdzonych na potrzeby tego artykułu podziału na składowe nie udało się odnaleźć dosłownie. [unverified: oryginalny fragment w Nakajima 1988] Angielska Wikipedia wprost stwierdza, że 85 % nie jest właściwym celem w wielu przypadkach, na przykład gdy nie wszystkie straty są rejestrowane lub gdy wymagania jakościowe w danej branży są wyższe [8].

Kolejne zastrzeżenia [8]:

- OEE zachowuje się jak średnia geometryczna i karze nierówne czynniki: 20 % × 80 % = 16 %, 50 % × 50 % = 25 %.
- Definicje różnią się między firmami, dlatego OEE słabo nadaje się do porównań między zakładami lub typami maszyn.
- OEE nie jest miarą indywidualnej wydajności pracownika.

Stosuj OEE jako wskaźnik doskonalenia tego samego składnika majątku w czasie, a nie jako tabelę ligową. Zakład procesowy pracujący 24/7 i warsztat produkcji jednostkowej z wieloma przezbrojeniami mają strukturalnie różne wartości.

### Poprawne agregowanie OEE dla wielu maszyn

Częstym błędem raportowym jest uśrednianie procentów OEE. Przykład: maszyna A ma OEE 80 % przy planowanym czasie 450 min, maszyna B 50 % przy 150 min.

- Błędnie (średnia nieważona): (80 % + 50 %) ÷ 2 = 65,0 %
- Poprawnie (ważona czasem): (0,80 × 450 + 0,50 × 150) ÷ (450 + 150) = (360 + 75) ÷ 600 = **72,5 %**

Najczystszym podejściem jest przeliczanie OEE na każdym poziomie z zsumowanych czasów: suma czasu dodającego wartość (liczba dobrych sztuk × idealny czas cyklu) podzielona przez sumę czasu planowanego. Sekcja 15 pokazuje odpowiadającą jej formułę DAX.

## 8. Wskaźniki jakości: wskaźnik braków, wydajność za pierwszym razem, wskaźnik poprawek, PPM

Wskaźniki jakości odpowiadają na dwa różne pytania: ile materiału i czasu jest tracone wewnątrz zakładu (wewnętrznie) i ile wad trafia do klienta (zewnętrznie)? Każde z tych ujęć wymaga własnych wskaźników. ISO 22400-2 obejmuje m.in. współczynnik jakości, współczynnik braków, współczynnik poprawek i wydajność za pierwszym razem [3]; wskaźniki braków i poprawek pojawiają się też na liście 34 wskaźników ISO według Fabrico [38].

### Formuła wskaźnika braków

[Wskaźnik braków](https://www.m365.fm/entity/scrap-rate/) mierzy udział sztuk, których nie można już wykorzystać i które są złomowane lub poddawane recyklingowi. W prezentacji Kanga i in. formuła ISO to ilość braków podzielona przez ilość wyprodukowaną [3].

> **Wskaźnik braków = liczba braków ÷ łączna liczba sztuk × 100 %**

**Przykład dla linii 3:** 10 zezłomowanych sztuk ÷ 432 sztuki × 100 % = **2,31 %**.

**Typowe błędy:**
- **Zmiana podstawy.** Czasem używa się łącznej liczby sztuk, czasem liczby dobrych (10 ÷ 422 = 2,37 %). Przy niskich wskaźnikach różnica jest niewielka; przy wysokich ma znaczenie.
- **Pomijanie braków z rozruchu.** Sztuki odrzucane podczas dostrajania po przezbrojeniu często nie są liczone. A właśnie one pokazują, czy przezbrojenia są pod kontrolą.
- **Liczenie tylko sztuk, bez wartości.** Zezłomowana część na końcu łańcucha wartości kosztuje wielokrotnie więcej niż surowiec. Dodaj koszt braków do wskaźnika sztukowego.

### Wydajność za pierwszym razem (FPY)

Wydajność za pierwszym razem (także first time through lub right first time) mierzy udział jednostek, które przechodzą proces za pierwszym razem, bez poprawek i bez złomowania. ASQ opisuje FPY, zwany także wskaźnikiem jakości, jako procent jednostek, które kończą proces i spełniają wytyczne jakościowe, bez bycia złomowanymi, ponownie uruchamianymi, ponownie testowanymi, zwracanymi lub kierowanymi do pozaliniowego obszaru naprawczego [36]. Kang i in. podają wzór jako ilość dobrą za pierwszym przejściem podzieloną przez ilość wyprodukowaną [3].

> **FPY = jednostki dobre za pierwszym przejściem ÷ łączna liczba sztuk × 100 %**

**Przykład dla linii 3:** 410 ÷ 432 × 100 % = **94,9 %**.

W przypadku kilku etapów procesu należy pomnożyć wartości FPY poszczególnych etapów, aby otrzymać **skumulowaną wydajność przepływu (RTY, rolled throughput yield)**. Trzy stanowiska z FPY 98 % każde dają 0,98 × 0,98 × 0,98 = 94,1 %. RTY pokazuje, ile części przechodzi przez cały łańcuch bez żadnej korekty. [unverified: RTY jest powszechne w literaturze Six Sigma, ale nie zostało sprawdzone w źródle pierwotnym na potrzeby tego artykułu.]

**Jakość w OEE a FPY:** jeśli traktujesz poprawki jako stratę, FPY i wskaźnik jakości OEE są identyczne (oba 94,9 % w przykładzie). Jeśli poprawione sztuki liczysz jako dobre, jakość OEE równa się końcowej wydajności: (410 + 12) ÷ 432 = 97,7 %.

### Wskaźnik poprawek

> **Wskaźnik poprawek = liczba poprawianych sztuk ÷ łączna liczba sztuk × 100 %**

**Przykład dla linii 3:** 12 ÷ 432 × 100 % = **2,78 %**.

Kontrola: FPY + wskaźnik poprawek + wskaźnik braków = 94,91 % + 2,78 % + 2,31 % = 100 %. Ta kontrola sumy powinna działać automatycznie w każdym dashboardzie; jeśli się nie zgadza, brakuje transakcji.

Przeróbki są często niedoszacowane, ponieważ ostatecznie część jest dobra. Pochłaniają jednak ludzi, tworzą WIP i wydłużają czas realizacji. Rejestruj zarówno czas przeróbki, jak i jej ilość.

### PPM (części na milion)

ASQ definiuje PPM jako wskaźnik przedstawiający liczbę wad przeliczoną na populację jednego miliona, co ułatwia porównania [36]. Stosuje się go głównie do reklamacji klientów i ocen dostawców.

> **PPM = wadliwe części ÷ części wysłane (lub sprawdzone) × 1 000 000**

**Przykład:** w kwartale zakład wysyła 250 000 części; klient odrzuca 18. PPM = 18 ÷ 250 000 × 1 000 000 = **72 ppm**.

Ustal z klientem, czy liczą się odrzucone części, odrzucone dostawy czy uznane reklamacje. Wyrażanie wewnętrznego złomu w PPM (Linia 3: 10 ÷ 432 × 1 000 000 = 23 148 ppm) jest możliwe, ale mało intuicyjne; w tym przypadku lepiej sprawdza się procent.

## 9. Wskaźniki dostaw i zapasów: OTIF, dotrzymanie harmonogramu, WIP, dni zapasu

### Terminowość dostaw i OTIF

Wskaźnik efektywności dostaw mierzy, jak wiarygodnie zakład dotrzymuje obietnic złożonych klientom. Najczęstszą postacią jest **OTIF** (on time in full, terminowo i w całości): dostawa liczy się tylko wtedy, gdy jest terminowa **i** kompletna.

> **OTIF = pozycje zamówień dostarczone terminowo i w całości ÷ wszystkie pozycje zamówień due × 100 %**

Nie istnieje wiążąca standardowa definicja. McKinsey zauważył w 2019 r., że bez standardowej definicji OTIF jest interpretowany bardzo różnie; w badaniu 24 dużych północnoamerykańskich detalistów i producentów dóbr konsumpcyjnych 79 % opowiedziało się za jednym, łącznym wskaźnikiem OTIF zamiast osobnych pomiarów, a nie było konsensusu co do szerokości okna dostawy [18].

**Przykład:** w miesiącu przypada 200 pozycji zamówień. 184 dostarczono terminowo, 190 w całości, 178 terminowo i w całości.
- Terminowo = 184 ÷ 200 = 92,0 %
- W całości = 190 ÷ 200 = 95,0 %
- OTIF = 178 ÷ 200 = **89,0 %**

Zwróć uwagę, że OTIF nie jest iloczynem obu wskaźników (0,92 × 0,95 = 87,4 %); liczy się go z pozycji, które spełniły oba warunki jednocześnie.

**Musisz zdefiniować:** datę odniesienia (żądaną lub potwierdzoną), okno tolerancji (na przykład ±1 dzień), poziom (zamówienie, pozycja, ilość) oraz czy dostawy przedterminowe liczą się jako terminowe. Duzi klienci często ustalają reguły za Ciebie: Walmart na przykład w 2019 r. wymagał od dostawców dostarczania pełnych naczep w dwudniowym oknie w 87 % przypadków i karał chybienia kwotą 3 % kosztu sprzedanych towarów [47]. Takie programy się zmieniają, więc przed porównaniem sprawdź aktualną definicję każdego klienta.

### Dotrzymanie harmonogramu w produkcji

Dotrzymanie harmonogramu (terminowe zakończenie produkcji) mierzy, czy zlecenia produkcyjne kończą się w zaplanowanym terminie. To wewnętrzny wskaźnik KPI i wskaźnik wyprzedzający dla OTIF u klienta.

> **Dotrzymanie harmonogramu = zlecenia produkcyjne zakończone zgodnie z harmonogramem ÷ wszystkie zlecenia produkcyjne due × 100 %**

**Przykład:** 102 z 120 zleceń due zakończono zgodnie z harmonogramem: **85,0 %**.

Nyhuis i Wiendahl uzasadniają swój model krzywych operacyjnych logistyki częściowo niezadowalającym osiąganiem celów logistycznych w wielu firmach [14]. [unverified: abstrakt urwany w pobranej wersji po tej części zdania] Dodaj do wskaźnika średnie odchylenie od harmonogramu w dniach; 85 % dotrzymania z jednodniowym opóźnieniem to coś innego niż 85 % z opóźnieniem dwutygodniowym.

### WIP (produkcja w toku)

Produkcja w toku obejmuje wszystkie niedokończone wyroby od wydania materiału do zakończenia. Raportuje się ją w sztukach (do kontroli) lub w dolarach (dla finansów). Prawo Little'a łączy WIP bezpośrednio z czasem realizacji [13]: Linia 3 ma 2 700 części WIP przy dziennej przepustowości 900 części, czyli 3 dni czasu realizacji. Jeśli zespół obniży WIP do 1 800 części przy tej samej przepustowości, czas realizacji spadnie do 2 dni.

### Dni zapasu (pokrycie zapasów)

> **Dni zapasu = zapas ÷ średnie dzienne zużycie (lub popyt)**

**Przykład:** zapas wyrobów gotowych 2 250 jednostek, popyt 900 jednostek dziennie. Dni zapasu = 2 250 ÷ 900 = **2,5 dnia**.

Matematycznie dni zapasu to prawo Little'a zastosowane do jednego punktu zapasu. Używaj popytu prognozowanego, gdy popyt silnie się waha; w przeciwnym razie pokrycie oparte na historii może wyglądać złudnie wysoko lub nisko.

## 10. Wykorzystanie zdolności produkcyjnych i produktywność: obciążenie, efektywność wykorzystania, produktywność pracy

### Wykorzystanie zdolności produkcyjnych

Wskaźnik wykorzystania porównuje obciążenie (zdolność wymaganą według norm czasowych) z dostępną zdolnością produkcyjną.

> **Wykorzystanie zdolności produkcyjnych = obciążenie ÷ dostępna zdolność produkcyjna × 100 %**

**Przykład:** zlecenia z 4 050 min czasu normatywnego są zaplanowane na stanowisku wąskim na dany tydzień; dostępna zdolność wynosi 4 500 min. Wykorzystanie = 4 050 ÷ 4 500 = **90,0 %**.

**Dlaczego 100 % nie jest celem:** logistyczne krzywe robocze Nyhuisa i Wiendahla opisują zależność między WIP, wydajnością i czasem realizacji systemu pracy [14]. W miarę zbliżania się wykorzystania do granicy zdolności kolejki i czasy realizacji rosną nieproporcjonalnie, ponieważ żadne zakłócenie i żadne wahania nie mogą już zostać zaabsorbowane. Stanowisko wąskie powinno być wysoko wykorzystane; stanowiska niewąskie potrzebują rezerwy. Ustal pasmo docelowe, a nie maksimum.

### Wykorzystanie to nie efektywność wykorzystania

Terminy są często mylone. **Wykorzystanie zdolności produkcyjnych** to wskaźnik planistyczny (ile pracy zostało obciążone na zdolności?). **Efektywność wykorzystania** (ISO 22400) to wskaźnik wykonawczy: stosunek rzeczywistego czasu produkcji (APT) do rzeczywistego czasu zajętości jednostki (AUBT) [3]. Maszyna może być obciążona w 95 %, a mimo to mieć słabą efektywność wykorzystania, jeśli znaczna część zajętego czasu przepada na awarie i oczekiwanie. Dla linii 3 stosunek czasu pracy do czasu zajętości wynosi 405 ÷ 450 = 90 %, co w tym prostym przypadku równa się dostępności OEE; w zakładach rejestrujących czasy przezbrojeń i zajętości osobno wartości te się różnią.

### Produktywność

Produktywność to stosunek wyniku do nakładu. W produkcji zwykle mierzy się **produktywności cząstkowe**, ponieważ czynników nakładu nie da się sensownie zsumować.

> **Produktywność pracy = liczba dobrych sztuk ÷ przepracowane godziny pracy**

**Przykład dla linii 3:** 422 dobre sztuki (w tym poprawione) ÷ (6 operatorów × 8 h) = 422 ÷ 48 = **8,79 sztuki na godzinę pracy**.

**Typowe błędy:** mylenie produktywności ze wskaźnikiem wydajności (rzeczywista vs. normatywna wydajność to wskaźnik wydajności lub sprawności, a nie produktywność), liczenie całkowitej zamiast dobrej produkcji oraz porównywanie produktywności między wyrobami o różnej zawartości pracy. W zakładach o dużej różnorodności asortymentu lepszą miarą są wypracowane godziny normatywne na godzinę obecności.

## 11. Wskaźniki utrzymania ruchu: MTBF, MTTR i dostępność inherentna

ISO 22400 uwzględnia MTBF i MTTR jako wskaźniki utrzymania ruchu [38][3]. Rozdzielają one utratę dostępności spowodowaną awariami na dwa pytania: jak często maszyna ulega awarii i jak długo trwa, zanim znów zacznie pracować?

> **MTBF (średni czas między awariami) = czas pracy ÷ liczba awarii**
> **MTTR (średni czas naprawy) = łączny czas naprawy ÷ liczba awarii**

**Przykład dla linii 3, jeden miesiąc:** 40 zmian po 405 min czasu pracy każda = 16 200 min; 40 awarii o łącznym czasie 1 000 min.
- MTBF = 16 200 ÷ 40 = **405 min** (6,75 h)
- MTTR = 1 000 ÷ 40 = **25 min**

Na tej podstawie można wyliczyć **dostępność inherentną (techniczną)**, która uwzględnia wyłącznie awarie:

> **Dostępność inherentna = MTBF ÷ (MTBF + MTTR)**

405 ÷ (405 + 25) = 405 ÷ 430 = **94,2 %**. Dostępność w OEE wynosząca 90 % jest niższa, ponieważ uwzględnia także czas przezbrojeń.

**Typowe błędy:** MTTR może obejmować wyłącznie naprawę, a nie czas reakcji do chwili przybycia technika; należy zdecydować, o jaki czas chodzi, i mierzyć reakcję oraz naprawę osobno. Średnia z kilku zdarzeń jest też silnie losowa; MTBF staje się wiarygodny dopiero po kilku miesiącach. Nie należy także mylić MTBF z MTTF (średni czas do uszkodzenia), który dotyczy elementów nienaprawialnych; niektóre czołowe anglojęzyczne strony zacierają tę różnicę.

## 12. Energia, bezpieczeństwo (TRIR, DART, LTIFR) i koszt na jednostkę

### Energia na jednostkę

W wielu zakładach energia stała się blokiem kosztowym, który zasługuje na własny wskaźnik KPI. ISO 22400-2 został rozszerzony o wskaźniki energetyczne w 2017 r. [1]; w zakresie zarządzania energią ISO 50006:2023 (drugie wydanie, zastępujące wersję z 2014 r.) opisuje, jak budować wskaźniki efektywności energetycznej (EnPI) i linie bazowe zużycia energii [22][34].

> **Jednostkowe zużycie energii = energia zużyta w okresie ÷ liczba dobrych sztuk**

**Przykład dla linii 3:** 1 520 kWh na zmianę ÷ 422 dobre sztuki = **3,60 kWh na sztukę**.

Należy zwrócić uwagę na obciążenie podstawowe: linia, która podczas postoju utrzymuje pracę sprężarek powietrza i ogrzewania, wypada znacznie gorzej w przeliczeniu na sztukę przy niskiej produkcji. Prosta linia regresji z komponentem podstawowym i komponentem zależnym od wolumenu mówi więcej niż zwykły stosunek.

### Wskaźniki bezpieczeństwa: OSHA TRIR i wskaźnik DART

W systemie wskaźników SQCDP bezpieczeństwo idzie na pierwszym miejscu. W USA punktem odniesienia jest przepis OSHA dotyczący prowadzenia rejestrów (29 CFR Part 1904). OSHA oblicza wskaźniki zachorowalności według jednego wzoru [42]:

> **Wskaźnik zachorowalności = liczba urazów i chorób × 200 000 ÷ przepracowane roboczogodziny pracowników**

Liczba 200 000 to liczba godzin, jaką 100 pracowników przepracowuje przy 40 godzinach tygodniowo przez 50 tygodni w roku [42], więc wynik odczytuje się jako „przypadki na 100 pracowników w przeliczeniu na pełen etat”. Standardowe są dwa warianty:

- **TRIR** (total recordable incident rate, także total case incident rate): wszystkie przypadki podlegające rejestracji. Przypadki podlegające rejestracji to związane z pracą urazy i choroby, które skutkują zgonem, utratą przytomności, nieobecnością w pracy, pracą ograniczoną lub przeniesieniem na inne stanowisko, lub leczeniem wykraczającym poza pierwszą pomoc, według m.in. innych kryteriów [46].
- **Wskaźnik DART:** wyłącznie przypadki skutkujące nieobecnością w pracy, ograniczeniem aktywności zawodowej lub przeniesieniem na inne stanowisko [46].

**Przykład:** 5 przypadków podlegających rejestracji, z czego 3 to przypadki DART, w zakładzie z 420 000 przepracowanych godzin rocznie.
TRIR = 5 × 200 000 ÷ 420 000 = **2,38**. Wskaźnik DART = 3 × 200 000 ÷ 420 000 = **1,43**.

Dla kontekstu: według Bureau of Labor Statistics prywatny sektor przemysłowy w USA odnotował w 2025 r. całkowity wskaźnik przypadków podlegających rejestracji na poziomie 2,3 przypadku na 100 pracowników w przeliczeniu na pełen etat (opublikowany 18 listopada 2026 r.) [43]. Wykres BLS dla 2025 r. pokazuje 2,5 przypadku na 100 pracowników pełnoetatowych w przemyśle wytwórczym, przy 304 200 przypadkach [44][43]. Są to średnie krajowe, a nie wzorce dla Twojego zakładu; porównuj z własną branżą NAICS.

Niezależnie od wskaźników OSHA wymaga, aby pracodawcy zgłaszali śmiertelny wypadek przy pracy w ciągu 8 godzin, a hospitalizację, amputację lub utratę oka w ciągu 24 godzin (29 CFR 1904.39) [45].

### LTIFR i niemiecki wskaźnik na 1000 pracowników

Grupy międzynarodowe często stosują także **LTIFR** (lost time injury frequency rate), który opiera się na bazie miliona godzin zamiast 200 000:

> **LTIFR = liczba wypadków z utratą czasu pracy ÷ przepracowane godziny × 1 000 000**

Safe Work Australia definiuje LTIFR jako liczbę wypadków z utratą czasu pracy na milion przepracowanych godzin; wypadek z utratą czasu pracy to taki, który skutkuje co najmniej jednym pełnym dniem lub zmianą nieobecności w pracy [21].

**Przykład:** 3 wypadki z utratą czasu pracy przy 420 000 przepracowanych godzinach rocznie: 3 ÷ 420 000 × 1 000 000 = **7,14**. Warto zauważyć, że to ta sama fabryka, o której mowa wyżej: wskaźnik DART wynoszący 1,43 i wskaźnik LTIFR wynoszący 7,14 opisują te same trzy przypadki (1,43 × 5 = 7,14), jeśli wszystkie trzy przypadki DART wiązały się z dniami nieobecności w pracy. DART uwzględnia również przypadki pracy z ograniczeniami i przeniesienia na inne stanowisko, które większość definicji LTI wyłącza. Przy porównywaniu zakładów zawsze podawaj podstawę obliczeń.

Zakłady w Niemczech raportują tzw. wskaźnik na 1000 pracowników: zgłaszane wypadki na 1000 pracowników w przeliczeniu na pełne etaty. Wypadek podlega zgłoszeniu w Niemczech, jeśli ubezpieczony zmarł lub nie mógł wykonywać pracy przez ponad trzy dni (§ 193 ust. 1 niemieckiego Kodeksu Socjalnego, księga VII) [20]. Niemieckie ustawowe ubezpieczenie wypadkowe DGUV podało, że w 2025 roku zgłoszono 19,9 wypadków przy pracy na 1000 pracowników w przeliczeniu na pełne etaty, czyli o 3,2 % mniej niż rok wcześniej [19]. **Przykład:** 4 zgłoszone wypadki przy 250 pracownikach w przeliczeniu na pełne etaty dają 4 ÷ 250 × 1000 = **16,0**. Ponieważ progi zgłaszania są różne, tego wskaźnika nie można bezpośrednio porównywać ze wskaźnikiem OSHA.

Uzupełnij te wskaźniki opóźnione wskaźnikami wyprzedzającymi, takimi jak zgłoszone zdarzenia bez skutków (near miss) i zrealizowane działania w zakresie bezpieczeństwa. Spadająca liczba zgłaszanych zdarzeń bez skutków może być sygnałem ostrzegawczym, jeśli odzwierciedla słabszą kulturę zgłaszania.

### Koszt jednostkowy

> **Koszt jednostkowy = koszt okresu ÷ liczba dobrych sztuk**

**Przykład dla linii 3, jedna zmiana (ilustracyjne kwoty w dolarach amerykańskich):**
- Robocizna: 6 × 8 h × 45 $/h = 2160 $
- Maszyna (amortyzacja, konserwacja, powierzchnia hali): 8 h × 60 $/h = 480 $
- Materiał: 432 sztuki × 4,00 $ = 1728 $ (złom również zużywa materiał)
- Razem: 4368 $

Koszt jednostkowy = 4368 $ ÷ 422 dobre sztuki = **10,35 $ za sztukę**.

Obliczenie pokazuje związek z OEE: gdyby wszystkie 432 sztuki były dobre już za pierwszym razem, koszt jednostkowy spadłby do 4368 $ ÷ 432 = 10,11 $, bez zmiany jakiegokolwiek wskaźnika. Przy kosztach stałych główną rolę odgrywa wielkość produkcji, dlatego koszt jednostkowy trudno interpretować bez informacji o wolumenie. Przy decyzjach typu make-or-buy lub przy ustalaniu cen potrzebne są też osobno koszty stałe i zmienne. Jak przekształcić usprawnienia w solidne uzasadnienie biznesowe, opisano we wpisie [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/).

## 13. Systemy KPI: hierarchia, wskaźniki wyprzedzające i opóźnione, SQCDP

Pojedyncze KPI to pomiary. **System KPI** układa je tak, aby każdy poziom widział wskaźniki, na które może wpływać, a wskaźniki niższych poziomów logicznie sumowały się we wskaźniki wyższych poziomów.

### Hierarchia: zakład, obszar, linia, stanowisko

| Poziom | Typowe KPI | Rytm | Forum |
|---|---|---|---|
| Zakład | OTIF, koszt na jednostkę, PPM u klienta, TRIR, dni zapasu | tygodniowo, miesięcznie | spotkanie kierownictwa zakładu |
| Obszar | zgodność z harmonogramem, czas realizacji, OEE wąskiego gardła, koszt złomu, produktywność | dziennie, tygodniowo | spotkanie obszaru (Tier 3) |
| Linia | plan vs. wykonanie sztuk na godzinę, OEE, FPY, najczęstsze przyczyny przestojów, otwarte działania | na zmianę | spotkanie linii (Tier 2) |
| Stanowisko/maszyna | sztuki na godzinę vs. takt, awarie, mikroprzestoje, odchylenia jakościowe | co godzinę, na zmianę | krótka odprawa zespołu (Tier 1) |

Poziomy łączą łańcuchy przyczynowo-skutkowe: spadek OTIF na poziomie zakładu można prześledzić przez zgodność z harmonogramem w obszarze aż do OEE i przyczyn przestojów pojedynczej maszyny. Dokładnie tego łańcucha używa [spotkanie tierowe](https://www.m365.fm/entity/tier-meeting/): każdy poziom przegląda swoje wskaźniki, eskaluje to, czego nie potrafi rozwiązać samodzielnie, i otrzymuje informację zwrotną z góry. Przewodnik [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) szczegółowo opisuje te procedury.

### Wskaźniki wyprzedzające i opóźnione

**Wskaźniki opóźnione** mierzą wyniki, które już nastąpiły: OTIF, koszt na jednostkę, wskaźnik złomu z danego miesiąca, TRIR. Są ważne dla oceny osiągania celów, ale pojawiają się zbyt późno, by można było podjąć działania korygujące.

**Wskaźniki wyprzedzające** mierzą czynniki przewidujące wynik: zgodność z harmonogramem procesu poprzedzającego, WIP przed wąskim gardłem, czas przezbrojenia, zgodność z planem konserwacji zapobiegawczej, zdarzenia potencjalnie niebezpieczne, sztuki na godzinę w odniesieniu do taktu. Fabrico słusznie podkreśla, że KPI musi uruchamiać działanie [35]; wskaźniki wyprzedzające robią to wtedy, gdy jeszcze jest czas na reakcję.

Dobra zasada praktyczna: na niższych poziomach dominują wskaźniki wyprzedzające, na poziomie zakładu wskaźniki opóźnione. Każde opóźnione KPI na poziomie zakładu powinno mieć co najmniej jeden przypisany wskaźnik wyprzedzający na poziomie linii.

### SQCDP: struktura dla tablic i spotkań

Wiele zakładów grupuje KPI według **SQCDP**: Safety (bezpieczeństwo), Quality (jakość), Cost (koszt), Delivery (dostawa) i People (ludzie). Kolejność jest celowa: bezpieczeństwo przed jakością, jakość przed kosztem. [unverified: SQCDP to konwencja praktyczna, a nie norma; jego pochodzenia nie da się jednoznacznie udokumentować.] Zakłady stosują też warianty o innej kolejności lub bez kategorii People (na przykład SQDC).

| Kategoria | Linia 3, przykładowe KPI |
|---|---|
| S | urazy i zdarzenia potencjalnie niebezpieczne w zmianie, otwarte działania w zakresie bezpieczeństwa |
| Q | FPY 94,9 %, wskaźnik złomu 2,31 %, reklamacje klientów |
| C | koszt na jednostkę 10,35 $, energia 3,60 kWh/jednostkę |
| D | plan 450 / wykonanie 422 dobre sztuki, OEE 75,9 %, zgodność z harmonogramem |
| P | frekwencja, macierz umiejętności, wdrożone pomysły usprawnień |

Kategorie chronią przed jednostronnym skupieniem się na wydajności. Jeśli mierzy się tylko wydajność, uzyskuje się wydajność kosztem jakości i bezpieczeństwa.

## 14. Zbieranie danych i jakość danych

Najlepsza formuła jest bezużyteczna, jeśli dane wejściowe są błędne. W praktyce projekty KPI częściej upadają z powodu danych niż z powodu metody.

### Porównanie metod zbierania danych

| Metoda | Opis | Zalety | Wady |
|---|---|---|---|
| Ręczna (karta kontrolna, dziennik zmianowy, Excel) | operatorzy zapisują liczby sztuk i postoje | szybki start, buduje świadomość, nie wymaga IT | pomijane mikropostoje, zaokrąglenia, wpisy po fakcie, duży nakład pracy |
| Terminale danych produkcyjnych | terminale do rozpoczęcia/zakończenia zlecenia, ilości, powodów przestojów | ustrukturyzowane powody, kontekst zlecenia | zależy od dyscypliny rejestracji |
| Zbieranie danych z maszyn | sygnały ze sterownika (praca, postój, licznik) | pełne czasy, uwzględnione krótkie postoje | brak powodów bez udziału operatora |
| MES | integruje dane produkcyjne i maszynowe, kontrolę jakości i zleceń; wskaźniki KPI wg ISO 22400, ISA-95 poziom 3 (VDMA 66412-1 w Niemczech) | spójne definicje, czas rzeczywisty | nakład wdrożenia, utrzymanie danych wzorcowych |
| Modernizacja IoT | czujniki i bramki na istniejących maszynach, dane na platformie chmurowej | działa na starszych maszynach, skalowalne | kontekst (zlecenie, produkt) trzeba dodać osobno |

Pragmatyczna droga to połączenie: sygnały z maszyn dostarczają czasów i liczników, a operatorzy na terminalu dodają powód postoju i decyzje dotyczące jakości. Muchiri i Pintelon wskazują dokładność zbierania danych jako jedno z największych wyzwań pomiaru OEE [7]. Sposób technicznego połączenia maszyn, MES i chmury opisano w przewodniku [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Pięć zasad rzetelnych KPI

1. **Jeden model czasu dla wszystkich.** Ustal, które czasy należą do planowanego czasu produkcji (przerwy? konserwacja? próby? brak zleceń?). ISO 22400-2 i VDMA 66412-1 oferują szablon [1][4].
2. **Jeden katalog powodów przestojów o co najwyżej dwóch poziomach.** Zbyt wiele powodów prowadzi do kategorii „inne”, zbyt mało – do bezsensownych analiz Pareta. Każdy powód jednoznacznie przypisz do jednej kategorii strat OEE.
3. **Utrzymuj idealne czasy cyklu.** Wydajność OEE zależy wyłącznie od tych danych wzorcowych. Zbyt łagodny standard prowadzi do wydajności powyżej 100 % lub ukrywa straty.
4. **Automatyzuj kontrole poprawności.** FPY + przeróbki + braki = 100 %; czas pracy ≤ czas planowany; wydajność ≤ 100 %; suma postojów ≤ długość zmiany.
5. **Uczyń definicję widoczną.** Każde KPI ma kartę definicji wskaźnika z celem, wzorem, źródłem danych, właścicielem, częstotliwością i wartością docelową.

### Karta definicji KPI

| Pole | Przykład: OEE linia 3 |
|---|---|
| Cel | uwidocznić straty maszyny wąskiego gardła i nadać im priorytety |
| Wzór | dostępność × wydajność × jakość; kontrola krzyżowa: liczba dobrych sztuk × idealny czas cyklu ÷ czas planowany |
| Źródło danych | dane z maszyn (praca/postój, licznik), terminal (powód przestoju, braki, przeróbki) |
| Definicje | czas planowany = zmiana minus przerwy; przezbrojenia liczą się jako strata dostępności; przeróbki liczą się jako strata jakości |
| Właściciel | kierownik zmiany linii 3 |
| Częstotliwość | na zmianę, trend tygodniowy |
| Cel | 80 % do końca Q2 (wartość bazowa 75,9 %, patrz rozdział 16) |
| Eskalacja | dwie kolejne zmiany poniżej 70 % → spotkanie poziomu 2 |

## 15. Wizualizacja: tablice na hali produkcyjnej i pulpity Power BI

### Tablica na hali produkcyjnej

Na stanowisku pracy ważniejsza jest czytelność w ciągu kilku sekund niż kompletność. [Zarządzanie wizualne](https://www.m365.fm/entity/visual-management/) oznacza tutaj: plan i wykonanie na godzinę, wyraźne czerwone/zielone w odniesieniu do celu, trzy najczęstsze przyczyny przestojów oraz listę działań z odpowiedzialnymi osobami i terminami. Dobrze sprawdzają się tablice godzinowe: zespół wpisuje planowaną i rzeczywistą liczbę sztuk dla każdej godziny (linia 3: 60 sztuk w każdej pełnej godzinie produkcyjnej przy takcie 60 s, odpowiednio mniej w godzinach z przerwą) i od razu podaje krótkie uzasadnienie każdego odchylenia. Jak połączyć przepływ i tablicę, opisano we wpisie [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

Cyfrowe tablice nie zastępują automatycznie tablicy z białą powierzchnią. Zwracają się wtedy, gdy dane są już zbierane automatycznie, gdy kilka zmian lub zakładów potrzebuje tego samego widoku i gdy działania muszą być śledzone. Dyskusja zespołu pozostaje ta sama.

### Pulpit Power BI: struktura

Na poziomie obszaru i zakładu Power BI jest oczywistym narzędziem, jeśli firma korzysta już z Microsoft 365. Sprawdzona trzystronicowa struktura:

1. **Przegląd (zakład):** kafelki SQCDP z wykonaniem, celem i trendem; sygnalizacja świetlna tylko tam, gdzie zdefiniowano cel.
2. **Linia:** OEE jako wykres wodospadowy od czasu planowanego przez sześć kategorii strat do czasu wartości dodanej; diagram Pareto przyczyn przestojów; FPY i złom w czasie.
3. **Szczegóły i działania:** tabele zmian i zleceń z drill-through, powiązane z listą działań.

Do celów, punktów kontrolnych i właścicieli Power BI oferuje także scorecardy z celami. Według Microsoft tworzenie i udostępnianie scorecardów jest funkcją wersji Pro; przeglądanie jest możliwe z licencją Pro lub jako użytkownik bezpłatny w obszarze roboczym na pojemności Premium lub Fabric F64 albo większej [29].

### Model danych: schemat gwiazdy

Microsoft zaleca dla Power BI schemat gwiazdy: tabele wymiarów opisują byty biznesowe i służą do filtrowania oraz grupowania, tabele faktów przechowują zdarzenia i służą do agregacji [27]. Dla wskaźników produkcyjnych oznacza to:

| Tabela | Typ | Zawartość (przykładowe kolumny) |
|---|---|---|
| FactProduction | fakt | Date, ShiftID, LineID, ProductID, PlannedMin, BreakdownMin, ChangeoverMin, TotalQty, GoodFirstPass, Rework, Scrap, IdealCycleSec |
| FactDowntime | fakt | Start, End, DurationMin, LineID, ReasonID |
| DimDate | wymiar | Date, Week, Month, WorkingDay yes/no |
| DimShift | wymiar | ShiftID, Name, Start, End |
| DimLine | wymiar | LineID, Line, Area, Plant |
| DimProduct | wymiar | ProductID, Product, ProductFamily |
| DimDowntimeReason | wymiar | ReasonID, Reason, LossCategory (breakdown, changeover, micro-stop …) |

Kolumna LossCategory w wymiarze przyczyn jest kluczem do kaskady strat: przypisuje każdą przyczynę przestoju do jednej z sześciu wielkich strat.

### Przykład DAX: poprawne agregowanie OEE

Poniższe miary obliczają OEE tak, aby sumowało się poprawnie na każdym poziomie (zmiana, linia, tydzień, zakład), ponieważ jest budowane z sumowanych czasów, a nie ze średnich. `DIVIDE` zwraca BLANK zamiast błędu, gdy mianownik wynosi zero [25]; Microsoft zaleca tę funkcję, gdy mianownik może być zerem lub pusty, a operator `/`, gdy mianownik jest stałą [26].

```dax
Planned Min =
SUM ( FactProduction[PlannedMin] )

Run Min =
[Planned Min]
    - SUM ( FactProduction[BreakdownMin] )
    - SUM ( FactProduction[ChangeoverMin] )

Ideal Min =
SUMX (
    FactProduction,
    FactProduction[TotalQty] * FactProduction[IdealCycleSec] / 60
)

Value Adding Min =
SUMX (
    FactProduction,
    FactProduction[GoodFirstPass] * FactProduction[IdealCycleSec] / 60
)

Availability =
DIVIDE ( [Run Min], [Planned Min] )

Performance =
DIVIDE ( [Ideal Min], [Run Min] )

Quality (time-weighted) =
DIVIDE ( [Value Adding Min], [Ideal Min] )

OEE =
DIVIDE ( [Value Adding Min], [Planned Min] )
```

**Dlaczego jakość jest tu ważona czasem:** dla pojedynczego produktu `Value Adding Min ÷ Ideal Min` jest identyczne z liczbą dobrych sztuk podzieloną przez liczbę wszystkich sztuk. Przy kilku produktach o różnych czasach idealnych ta postać waży każdą sztukę jej czasem idealnym. Tylko wtedy dostępność × wydajność × jakość = OEE zachodzi dokładnie na każdym poziomie agregacji, ponieważ czas pracy i czas idealny się skracają. Wskaźnik jakości liczony w sztukach jest przydatną miarą dodatkową, ale nie powinien wchodzić do mnożenia OEE.

**Sprawdzenie dla linii 3:** czas planowany 450, czas pracy 405, czas idealny 432 × 50 ÷ 60 = 360, czas wartości dodanej 410 × 50 ÷ 60 = 341,67 min. Dostępność 90,0 %, wydajność 88,9 %, jakość 94,9 %, OEE 341,67 ÷ 450 = 75,9 %. Miary odtwarzają obliczenie ręczne z sekcji 7.

Jeszcze jedna miara do kontroli taktu:

```dax
Effective Cycle Time per Good Part Sec =
DIVIDE (
    [Planned Min] * 60,
    SUM ( FactProduction[GoodFirstPass] )
)
```

Dla linii 3 wynik to 27 000 ÷ 410 = 65,9 s, czyli powyżej taktu 60 s.

Wskaźniki jakości z sekcji 8 mają tę samą strukturę:

```dax
FPY =
DIVIDE (
    SUM ( FactProduction[GoodFirstPass] ),
    SUM ( FactProduction[TotalQty] )
)

Scrap Rate =
DIVIDE (
    SUM ( FactProduction[Scrap] ),
    SUM ( FactProduction[TotalQty] )
)

Rework Rate =
DIVIDE (
    SUM ( FactProduction[Rework] ),
    SUM ( FactProduction[TotalQty] )
)

Quality Sum Check =
[FPY] + [Scrap Rate] + [Rework Rate]
```

`Quality Sum Check` musi być równe 100 %; formatowanie warunkowe, które oznacza odchylenia na czerwono, sprawia, że brakujące transakcje są od razu widoczne.

**Dwie pułapki dla deweloperów Power BI:**
- **Podwójne liczenie przestojów.** Jeśli minuty awarii i przezbrojeń są zapisane zarówno w `FactProduction`, jak i w `FactDowntime`, czas pracy należy obliczać tylko z jednej z tych tabel. Najbardziej niezawodne podejście to utrzymać `FactProduction` na poziomie zmiana, linia, produkt i agregować minuty przestojów z `FactDowntime` w Power Query.
- **Ziarnistość czasu planowanego.** Jeśli na zmianie pracuje więcej niż jeden produkt, czas planowany trzeba rozdzielić między produkty (na przykład według czasu rozpoczęcia i zakończenia zleceń). Jeśli cały czas zmiany znajduje się w każdym wierszu produktu, przy sumowaniu jest liczony wielokrotnie.

### Uwagi licencyjne

Według Microsoft Learn (strona zaktualizowana 24 sierpnia 2026): użytkownicy z licencją darmową mogą tworzyć raporty do własnego użytku, ale nie mogą ich udostępniać. Publikowanie i udostępnianie wymaga Power BI Pro. Użytkownicy darmowi mogą przeglądać udostępnione treści tylko wtedy, gdy znajdują się one w obszarze roboczym na pojemności Power BI Premium lub pojemności Fabric F64 lub większej. Przy Premium Per User (PPU) treści mogą być udostępniane wyłącznie innym użytkownikom PPU, chyba że znajdują się w pojemności Premium [28]. W przypadku dashboardu na hali produkcyjnej, który wielu brygadzistów tylko przegląda, licencjonowanie jest więc decyzją architektoniczną. Aktualne ceny i warunki należy sprawdzić u Microsoftu; celowo nie są tutaj podawane.

## 16. Jak ustalać cele KPI

Cele są miejscem, w którym KPI najczęściej przynoszą szkodę. Pomagają trzy zasady.

**1. Wychodź z własnej wartości bazowej, a nie z benchmarku.** Zanim ustalisz cel, mierz rzetelnie przez co najmniej cztery do ośmiu tygodni. Linia 3 z OEE na poziomie 75,9 % niewiele zyska na celu światowej klasy wynoszącym 85 %, dopóki nikt nie wie, którą stratę należy zaadresować w pierwszej kolejności.

**2. Wyprowadzaj cele z popytu.** W przykładzie cel wynika wprost z klienta: przy 450 dobrych sztukach na zmianę Linia 3 potrzebuje OEE na poziomie 83,3 %, jeśli liczą się tylko dobre sztuki za pierwszym razem (Sekcja 7). Rozsądnym celem pośrednim jest 80 %; to odległość 4,1 punktu procentowego. Matematycznie oznacza to (0,800 − 0,759) × 450 min = około 18,3 min czasu wartość dodającego na zmianę, osiągalnego na przykład dzięki mniejszej liczbie mikroprzestojów (potencjał 30 min) lub krótszym przezbrojeniom (potencjał 8 min dzięki SMED).

**3. Dla KPI z kompromisami stosuj pasma celów zamiast wartości punktowych.** Wykorzystanie, WIP i dni zapasu nie podlegają zasadzie „im wyżej, tym lepiej". Pasmo (na przykład dni zapasu 2 do 3 dni) powstrzymuje zespół przed tak głębokim ograniczaniem zapasów, że pogorszy się dostawność. Drees i Sack opisują dokładnie to napięcie między redukcją zapasów, wydajnością zasobów, zdolnością do dostaw i skracaniem czasu realizacji w KPI strumienia wartości [32].

**O zewnętrznych benchmarkach:** wartości branżowe dla OEE, braków czy MTTR, podawane na wielu stronach dostawców, zwykle pochodzą z ich własnych danych klientów, bez ujawnionej metody [37]. Traktuj je co najwyżej jako przybliżoną orientację, nigdy jako cel. Wyjątkiem są oficjalne statystyki z opublikowaną metodologią, takie jak wskaźniki urazów BLS według branż NAICS [43].

## 17. Typowe błędy i jak ich unikać

| Błąd | Konsekwencja | Przeciwdziałanie |
|---|---|---|
| Przeciążenie KPI: 30 wskaźników na tablicy | nikt nie wie, co jest ważne; spotkania zamieniają się w wykłady | 5 do 8 KPI na poziom, uporządkowane według SQCDP |
| KPI bez definicji | każdy dział liczy inaczej; porównania są bezwartościowe | karta definicji, terminy zgodne z ISO 22400 (VDMA 66412-1 w Niemczech) |
| Uśrednianie procentów | zniekształcone OEE zakładu | przeliczać KPI na każdym poziomie z sum |
| KPI jako ocena indywidualnych wyników | manipulacja danymi, ukrywanie awarii | KPI dla procesów, nie dla ludzi |
| Cel bez ścieżki | frustracja, upiększanie liczb | każdy cel poparty analizą strat i planem działań |
| Wyłącznie wskaźniki opóźnione | przeciwdziałania przychodzą za późno | przypisać wskaźnik wyprzedzający do każdego opóźnionego |
| Zbyt hojne normy czasowe | wydajność powyżej 100 % lub ukryte straty | technicznie uzasadniać czasy idealne i przeglądać je co roku |
| Dane bez rutyny | tablica przestaje być otwierana po trzech miesiącach | stałe cykle spotkań z KPI jako agendą |
| Porównywanie wskaźników bezpieczeństwa o różnych bazach | mieszanie TRIR, DART, LTIFR i niemieckich wskaźników | zawsze podawać wzór i bazę (200 000 h, 1 mln h, 1000 FTE) |

### Prawo Goodharta

W 1975 roku brytyjski ekonomista Charles Goodhart zauważył, że każda zaobserwowana prawidłowość statystyczna zwykle się załamuje, gdy zaczyna być wykorzystywana do celów kontrolnych [24]. Antropolog Marilyn Strathern streściła to w 1997 roku znanym zdaniem: „Gdy miara staje się celem, przestaje być dobrą miarą" [23]. Na hali wygląda to następująco: jeśli OEE jest powiązane z premiami, przezbrojenia zaczyna się unikać (większe partie, więcej zapasów), przestoje są przepisywane jako „planowane", albo normy czasowe są rozciągane. KPI rośnie; zakład nie staje się lepszy.

Trzy antidotum: zawsze patrzeć na KPI razem z wskaźnikiem przeciwwagi (OEE z zapasami i OTIF), utrzymywać definicje centralnie i rejestrować zmiany, a KPI na spotkaniach traktować jako powód do zadawania pytań, a nie jako wyrok.

## 18. Plan wdrożenia wskaźników produkcyjnych w 90 dni

Poniższy plan działa jako ramy dla linii lub obszaru. Nie wymaga oprogramowania; oprogramowanie przyspiesza fazy 2 i 3.

**Faza 1, tygodnie 1–3: cel i definicje**
- Doprecyzuj cele obszaru (czego oczekuje klient? gdzie są największe straty?).
- Wybierz 5–8 KPI, co najmniej po jednym w każdej kategorii SQCDP.
- Zdefiniuj model czasu, katalog przyczyn przestojów i karty definicji; sprawdź idealne czasy cyklu.

**Faza 2, tygodnie 4–8: mierzyć i uczyć się**
- Rozpocznij zbieranie danych, na początku ręcznie lub częściowo automatycznie, jeśli to konieczne.
- Sprawdzaj wiarygodność danych codziennie; doprecyzowuj definicje tam, gdzie pojawiają się pytania.
- Ustal wartości bazowe w okresie co najmniej czterech tygodni.

**Faza 3, tygodnie 9–12: zarządzać**
- Wyprowadź cele z popytu i wartości bazowych.
- Zbuduj tablicę wizualizacji oraz, tam gdzie to użyteczne, raport w Power BI.
- Ustal rutyny tierów: Tier 1 co zmianę, Tier 2 codziennie, Tier 3 co tydzień.
- Wybierz pierwsze tematy doskonalenia z analiz Pareto strat i realizuj je metodą PDCA.

**Dalej:** raz na kwartał sprawdzaj, czy każdy KPI nadal wpływa na decyzje. Wskaźniki, z których nikt nie korzysta, są usuwane. Osadzanie KPI w szerszym systemie doskonalenia opisano w przewodnikach [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) i [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Cele dla wąskiego gardła trafiają również bezpośrednio do harmonogramowania, zob. [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

## 19. KPI z modelowania strumienia wartości: iFAKT Polaris

> **Uwaga: Autor pracuje w iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), z siedzibą w Stuttgarcie w Niemczech, tworzy oprogramowanie do planowania i optymalizacji procesów logistycznych i produkcyjnych opartego na technologii Microsoft [33]. Firma od dawna zajmuje się KPI: w 2011 roku Jörg Drees i Christoph Sack pokazali w niemieckim czasopiśmie ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb), że KPI strumienia wartości łatwo wchodzą w konflikty między redukcją zapasów, wydajnością zasobów, zdolnością dostaw i skracaniem czasu realizacji, oraz że celowo dobrany zestaw KPI połączony z metodami lean umożliwia trwałe pętle kontroli [32].

Według dostawcy rodzina oprogramowania [iFAKT Polaris](https://www.m365.fm/entity/polaris/) obejmuje Value Stream Mapping, Business Swim Lane Mapping, Designer, Simulator, Optimizer, Operator i Analyzer [31]. Dwa z nich są istotne dla KPI produkcyjnych:

- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)**, według ifakt.de, zestawia KPI ze wszystkich modułów Polaris w uporządkowanych pulpitach, wizualizuje czasy realizacji, wykorzystanie, wąskie gardła i status projektów, pokazuje limity zdolności i potencjał usprawnień oraz porównuje scenariusze, plany i rzeczywiste wyniki [30]. Strona dostawcy nie podaje informacji o integracjach, modelu wdrożenia ani cenach.
- **Polaris VSM**, według dostawcy, automatycznie wylicza wskaźniki lean, takie jak czas realizacji, czas cyklu, WIP, udział wartości dodanej i współczynnik przepływu, z modelu strumienia wartości; oferuje pulpity dla czasu realizacji, WIP, udziału wartości dodanej i OEE oraz porównuje KPI scenariuszy obok siebie [31].

**Ocena:** takie narzędzie nie zastępuje czystych definicji ani rutyny spotkań. Jego wartość polega na spójnym wyliczaniu KPI z jednego modelu i porównywaniu scenariuszy przed wdrożeniem, na przykład wpływu limitu WIP na czas realizacji i OTIF. Czy pasuje do Państwa zakładu, należy sprawdzić jak każde inne rozwiązanie: na podstawie własnych danych, własnego krajobrazu IT i decyzji, które te KPI mają wspierać. Więcej o rodzinie produktów znajduje się w przewodniku [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/).

## 20. Glosariusz

| Termin | Wyjaśnienie |
|---|---|
| Dostępność (OEE) | czas pracy ÷ planowany czas produkcji [7] |
| Czas cyklu | zmierzony czas wykonania jednej jednostki na danym procesie [10] |
| Wskaźnik DART | wskaźnik OSHA przypadków z dniami nieobecności, ograniczoną pracą lub przeniesieniem na inne stanowisko na 100 FTE [42][46] |
| Dni zapasu | zapas ÷ średnie dzienne zużycie |
| Efektywność (ISO 22400) | odpowiada wydajności w OEE: planowany czas pracy na sztukę × ilość ÷ rzeczywisty czas produkcji [3] |
| Współczynnik przepływu | czas realizacji ÷ czas operacji (Wiendahl) [14][15] |
| FPY | wydajność za pierwszym razem, udział jednostek dobrych bez poprawek i braku [36] |
| ISA-95 | ANSI/ISA-95 (IEC 62264); poziom 3 = zarządzanie operacjami produkcyjnymi [40] |
| Wskaźnik opóźniony | KPI mierzący wynik, który już nastąpił |
| Czas realizacji | czas od rozpoczęcia do zakończenia zlecenia, łącznie z całym czasem oczekiwania, kolejkowania i transportu [10][15] |
| Wskaźnik wyprzedzający | KPI przewidujący przyszły wynik |
| Prawo Little'a | L = λW: średnie WIP = przepustowość × średni czas realizacji [13] |
| Obciążenie | planowany czas produkcji ÷ czas kalendarzowy; czynnik TEEP [8] |
| MES | system realizacji produkcji; ISA-95 poziom 3 [40]; wytyczna KPI VDMA 66412-1 w Niemczech [4] |
| MTBF / MTTR | średni czas pracy między awariami / średni czas naprawy |
| OEE | dostępność × wydajność × jakość [7] |
| Czas operacji | czas przygotowania plus czas obróbki kroku roboczego (Wiendahl) [14][15] |
| Czas zlecenia (REFA) | czas przygotowania plus czas przebiegu (ilość × czas na sztukę) [16][17] |
| OTIF | na czas i w komplecie; brak standardowej definicji [18] |
| PPM | części na milion, wady znormalizowane do miliona [36] |
| SMED | metoda przezbrojeń mająca na celu czas poniżej dziesięciu minut [11] |
| SQCDP | Safety, Quality, Cost, Delivery, People: schemat porządkowania KPI |
| Takt time | czas dostępny ÷ popyt klienta [9] |
| TEEP | OEE × obciążenie [8] |
| TRIR | całkowity wskaźnik rejestrowanych incydentów OSHA: przypadki rejestrowane × 200 000 ÷ przepracowane godziny [42] |
| WIP | praca w toku |

## 21. FAQ: wskaźniki KPI w produkcji

**Czym są wskaźniki KPI w produkcji?**
Wskaźniki KPI w produkcji to miary ilościowo określające czas, wydajność, jakość, terminowość dostaw, koszty i bezpieczeństwo działalności produkcyjnej, na przykład takt time, OEE, wskaźnik braków czy OTIF. Każdy KPI wymaga definicji, wzoru, jednostki i okresu.

**Jaka jest różnica między KPI a miernikiem?**
Każdy KPI jest miernikiem, ale nie każdy miernik jest KPI. KPI jest bezpośrednio powiązany z celem i regularnie wpływa na decyzje, jak OTIF czy OEE wąskiego gardła. Liczba wyprodukowanych sztuk to miernik; sam w sobie rzadko uruchamia działanie.

**Jakie są najważniejsze wskaźniki KPI w produkcji?**
Dla większości zakładów wystarczy podstawowy zestaw: OEE wąskiego gardła, FPY lub wskaźnik braków, OTIF, czas realizacji lub WIP, koszt jednostkowy oraz wskaźnik bezpieczeństwa, taki jak TRIR. To, które KPI są „najważniejsze", zależy od tego, gdzie występują największe straty.

**Jakie jest 5 kluczowych wskaźników efektywności w produkcji?**
Nie ma oficjalnej piątki. Praktyczny zestaw obejmuje po jednym KPI z każdej kategorii SQCDP: TRIR (bezpieczeństwo), first pass yield (jakość), koszt jednostkowy (koszt), OTIF (dostawy) oraz miernik dotyczący ludzi, na przykład wdrożone pomysły usprawnień, a także OEE wąskiego gardła.

**Jak oblicza się takt time?**
Takt time = dostępny czas produkcji ÷ popyt klienta. Przykład: 450 min (27 000 s) dostępnego czasu na zmianę i popyt 450 sztuk dają 60 s na sztukę. Odejmij przerwy, ale nie nieplanowane przestoje.

**Jaka jest różnica między takt time a czasem cyklu?**
Takt time wynika z popytu klienta i mówi, jak często musi być gotowa część. Czas cyklu jest mierzony na procesie i mówi, jak często część jest faktycznie gotowa. Czas cyklu powinien być poniżej taktu, z zapasem.

**Jak oblicza się czas realizacji w produkcji?**
Bezpośrednio jako znacznik czasu zakończenia minus znacznik czasu rozpoczęcia dla każdego zlecenia, lub pośrednio z prawa Little'a: średnie WIP ÷ średnia przepustowość. 2 700 części WIP przy dziennej przepustowości 900 części daje 3 dni robocze.

**Jak oblicza się OEE?**
OEE = dostępność × wydajność × jakość. Przy dostępności 90 %, wydajności 88,9 % i jakości 94,9 % OEE wynosi 75,9 %. Kontrola krzyżowa: liczba dobrych sztuk × idealny czas cyklu ÷ planowany czas produkcji.

**Jaki wynik OEE jest dobry?**
Wartość 85 % bywa podawana jako „światowa klasa" i przypisywana Nakajimie, ale liczba ta jest kwestionowana i zależy od branży [8]. Lepszym celem jest taki, który wynika z własnej bazy odniesienia i popytu klientów.

**Jak obliczyć wskaźnik braków?**
Wskaźnik braków = liczba braków ÷ łączna liczba sztuk × 100 %. 10 odrzuconych sztuk na 432 wyprodukowane daje 2,31 %.

**Jaka jest różnica między wskaźnikiem braków a wydajnością za pierwszym razem?**
Wskaźnik braków uwzględnia wyłącznie sztuki ostatecznie odrzucone. FPY (First Pass Yield) uwzględnia wyłącznie sztuki dobre bez żadnej korekty, a więc także bez przeróbki. FPY, wskaźnik przeróbek i wskaźnik braków sumują się do 100 %.

**Co oznacza OTIF?**
On time in full: udział dostaw lub pozycji zamówień, które dotrą do klienta na czas i w komplecie. Nie istnieje standardowa definicja; trzeba ustalić datę odniesienia, tolerancję i poziom [18].

**Jak obliczyć TRIR?**
TRIR = liczba przypadków rejestrowalnych wg OSHA × 200 000 ÷ łączna liczba przepracowanych godzin [42]. 5 rejestrowalnych przypadków przy 420 000 godzinach daje 2,38. Liczba 200 000 odpowiada 100 pracownikom pełnoetatowym pracującym 40 godzin tygodniowo przez 50 tygodni.

**Jaka jest różnica między wykorzystaniem zdolności produkcyjnej a efektywnością wykorzystania?**
Wykorzystanie zdolności produkcyjnej to wskaźnik planistyczny (obciążenie w stosunku do zdolności). Efektywność wykorzystania mierzy w trakcie realizacji, jaka część zajętego czasu była faktycznie produktywna. Wysokie wykorzystanie nie jest celem samym w sobie, ponieważ czasy realizacji gwałtownie rosną w pobliżu granicy zdolności.

**Ile wskaźników KPI powinien śledzić zakład?**
Pięć do ośmiu KPI na każdy poziom zarządzania, uporządkowanych według SQCDP, przy czym każdy wskaźnik opóźniony jest powiązany ze wskaźnikiem wyprzedzającym. Większa liczba KPI zwiększa nakład pracy związany ze zbieraniem danych, nie poprawiając kontroli.

**Która norma definiuje wskaźniki KPI w produkcji?**
ISO 22400-2:2014 definiuje wskaźniki KPI dla zarządzania operacjami produkcyjnymi, z wzorami, jednostkami i określeniem czasu [1]. ISA-95 definiuje kontekst poziomu 3, w którym są one obliczane [40]; w Niemczech szeroko stosowana jest także wytyczna VDMA 66412-1 dotycząca wskaźników KPI systemów MES [4].

**Czy mogę zbudować wskaźniki KPI produkcji w Power BI?**
Tak. Kluczowe jest schemat gwiazdy z tabelami faktów i wymiarów [27] oraz miary obliczające wskaźniki KPI z zsumowanych czasów. Udostępnianie wymaga licencji Power BI Pro; odbiorcy bez licencji Pro potrzebują treści w pojemności Premium lub Fabric F64 albo większej [28].

**Czym są MTBF i MTTR?**
MTBF to średni czas pracy między dwiema awariami, MTTR to średni czas przywrócenia maszyny do pracy. 16 200 min czasu pracy i 40 awarii o łącznym czasie trwania 1 000 min dają MTBF równy 405 min i MTTR równy 25 min.

## 22. Podsumowanie

Wskaźniki KPI w produkcji nie są celem samym w sobie. Ich wartość wynika z trzech elementów: jednoznacznej definicji opartej na ISO 22400-2 (a dla kontekstu systemowego na ISA-95), wiarygodnej bazy danych pochodzącej z sygnałów maszyn i wprowadzanych przez operatorów oraz rutyny, w której odchylenia prowadzą do pytań i działań. Przykład linii 3 pokazuje, jak ściśle wskaźniki są ze sobą powiązane: czas cyklu poniżej taktu nie gwarantuje terminowych dostaw, dopóki awarie, przezbrojenia i straty jakościowe obniżają OEE do 75,9 %; brakujące 28 sztuk na zmianę można prześledzić w podziale na poszczególne kategorie strat i minuty. Zacznij od kilku wskaźników, licz je na każdym poziomie z sum, wyznaczaj cele na podstawie popytu klientów, stawiaj bezpieczeństwo na pierwszym miejscu z prawidłowo wyliczonym wskaźnikiem i traktuj każdy wskaźnik KPI jako powód do rozmowy na gemba.

### Dalsza lektura na m365.fm

- Przewodniki: [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) · [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/) · [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) · [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) · [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) · [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- Blog: [Shop Floor Optimization: Ways to Improve Flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) · [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/)
- Pojęcia: [Takt Time](https://www.m365.fm/entity/takt-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Micro Stops](https://www.m365.fm/entity/micro-stops/) · [Scrap Rate](https://www.m365.fm/entity/scrap-rate/) · [Key Performance Indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [SMED](https://www.m365.fm/entity/smed/) · [Shop Floor Management](https://www.m365.fm/entity/shop-floor-management/) · [Visual Management](https://www.m365.fm/entity/visual-management/) · [Tier Meeting](https://www.m365.fm/entity/tier-meeting/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Gastgeber von m365.fm und arbeitet bei der [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Deutschland. Auf m365.fm schreibt er über Lean Manufacturing, Fertigungskennzahlen, Wertstrommethoden und die Digitalisierung der Fertigung mit Microsoft 365, Power BI und Azure. Sein Schwerpunkt liegt darauf, wie Kennzahlen so definiert und visualisiert werden, dass sie zu Entscheidungen in der Produktion führen.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources [1] to [39] keep the German numbering; [35], [36] and [38] now point to English sources, and [40] to [47] were added for the US version. All new or replaced sources were verified online.

1. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html
2. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/
3. Kang, N.; Zhao, C.; Li, J.; Horst, J. A.: A Hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54 (21), 2016, pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754
4. VDMA 66412-1:2009-10 Manufacturing Execution Systems (MES) – Kennzahlen (KPIs). 36 pages; amended by VDMA 66412-1/A1:2010-05. DIN Media: https://6sku3uaup9f9.din.de/en/technical-rule/vdma-66412-1/122410632
5. Schließmann, A.; Strahlberger, M.: Kennzahlen und Prozessgrößen wohl definiert. MES-Kennzahlen basierend auf Maschinenzuständen (well-defined KPIs: MES KPIs based on machine states). ZWF 109 (7–8), 2014, pp. 549–551. DOI: 10.3139/104.111180. https://www.degruyterbrill.com/document/doi/10.3139/104.111180/html
6. Nakajima, S.: Introduction to TPM: Total Productive Maintenance. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-23-2 (bibliographic data per [8]).
7. Muchiri, P.; Pintelon, L.: Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46 (13), 2008, pp. 3517–3535. DOI: 10.1080/00207540601142645. https://scispace.com/pdf/performance-measurement-using-overall-equipment-3udssbfefm.pdf
8. Overall equipment effectiveness. Wikipedia (English), with references to Nakajima 1982/1988/1989 and Hartmann 1992 (TEEP). https://en.wikipedia.org/wiki/Overall_equipment_effectiveness
9. Takt Time (lexicon term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/
10. Cycle Time (lexicon term, with lead time, processing time, value-creating time, effective machine cycle time). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/cycle-time/
11. Single Minute Exchange of Die (lexicon term). Lean Enterprise Institute, referring to Shingo, S.: A Revolution in Manufacturing: The SMED System. Productivity Press, 1985. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
12. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, Brookline (MA) 1998 (Shingo Research Prize 1999); current edition LEI 2018. https://www.lean.org/store/workbooks/learning-to-see/
13. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html
14. Nyhuis, P.; Wiendahl, H.-P.: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer, Berlin/Heidelberg 2012 (VDI-Buch), ISBN 978-3-540-92838-6 (English edition: Fundamentals of Production Logistics: Theory, Tools and Applications, Springer, Berlin/Heidelberg 2009, ISBN 978-3-540-34210-6). Sample (table of contents and abbreviations): https://lesejury.de/media/samples/393/9783540928393_leseprobe.pdf · Chapter "Zusammenfassung und Ausblick": https://rd.springer.com/content/pdf/10.1007%2F978-3-540-92839-3_10.pdf
15. Durchlaufzeit. Wikipedia (German), referring to Wiendahl, H.-P.: Fertigungsregelung. Hanser, Munich 1997, ISBN 3-446-19084-8. https://de.wikipedia.org/wiki/Durchlaufzeit
16. REFA (ed.): Lexikon der Betriebsorganisation. Carl Hanser, Munich 1993, ISBN 3-446-17523-7, p. 195 (bibliographic data per [17]).
17. Auftragszeit. Wikipedia (German). https://de.wikipedia.org/wiki/Auftragszeit
18. Davies, A.; Lal, S.; Perez, F.; Potdar, S.: Defining 'on-time, in-full' in the consumer sector. McKinsey & Company, June 13, 2019. https://www.mckinsey.com/capabilities/operations/our-insights/defining-on-time-in-full-in-the-consumer-sector
19. DGUV: Unfallrisiko bei der Arbeit 2025 erneut gesunken (workplace accident risk fell again in 2025). Press release, September 22, 2026. https://dguv.de/de/mediencenter/pm/pressearchiv/2026/quartal_3/details_3_713348.jsp
20. Section 193 SGB VII (German Social Code, Book VII): employer's duty to report an insured event. https://www.gesetze-im-internet.de/sgb_7/__193.html
21. Lost time injury frequency rates (LTIFR). Safe Work Australia. https://data.safeworkaustralia.gov.au/node/33
22. ISO 50006:2023 Energy management systems – Evaluating energy performance using energy performance indicators and energy baselines. https://www.iso.org/standard/79367.html
23. Strathern, M.: 'Improving ratings': audit in the British University system. European Review 5 (3), 1997, pp. 305–321. DOI: 10.1002/(SICI)1234-981X(199707)5:3<305::AID-EURO184>3.0.CO;2-4
24. Goodhart, C.: Problems of Monetary Management: The UK Experience. Papers in Monetary Economics, Vol. 1, Reserve Bank of Australia, Sydney 1975 (bibliographic data per https://en.wikipedia.org/wiki/Goodhart%27s_law).
25. DIVIDE function (DAX). Microsoft Learn. https://learn.microsoft.com/en-us/dax/divide-function-dax
26. DIVIDE function vs. divide operator (/) in DAX. Microsoft Learn. https://learn.microsoft.com/en-us/dax/best-practices/dax-divide-function-operator
27. Understand star schema and the importance for Power BI. Microsoft Learn (updated December 30, 2024). https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
28. Power BI service per-user and capacity-based licenses. Microsoft Learn (updated August 24, 2026; re-checked November 20, 2026). https://learn.microsoft.com/en-us/power-bi/service-features-license-type
29. Get started with goals and scorecards in Power BI. Microsoft Learn (updated March 5, 2026). https://learn.microsoft.com/power-bi/create-reports/service-goals-introduction
30. Polaris Analyzer (vendor page). iFAKT GmbH. https://www.ifakt.de/en/solutions/analyzer
31. Polaris VSM (vendor page, with overview of the Polaris suite). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/
32. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (production optimization through value stream modeling KPIs). ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
33. About iFAKT (company page). iFAKT GmbH. https://www.ifakt.de/en/company/
34. ISO 50006:2023, preview pages (second edition 2023-05, replaces ISO 50006:2014). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISO/preview_ISO+50006-2023.pdf
35. Manufacturing KPIs: The Metrics That Actually Drive the Floor. Fabrico (vendor blog), published June 29, 2026, updated October 26, 2026. https://www.fabrico.io/blog/manufacturing-kpis/
36. Quality Glossary of Terms, Acronyms & Definitions (entries "first pass yield", "overall equipment effectiveness", "parts per million"). ASQ. https://asq.org/quality-resources/quality-glossary
37. World-Class OEE: What Is It and How Close Are You Actually? TEEPTRAK (vendor page, benchmarks from own data). https://teeptrak.com/en/world-class-oee-benchmark/
38. ISO 22400 KPI Selection Guide. Fabrico (secondary source for the count of 34 KPIs and the categories). https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/
39. Competitor pages: https://netsuite.com/portal/resource/articles/erp/manufacturing-kpis-metrics.shtml · https://www.insightsoftware.com/blog/30-manufacturing-kpis-and-metric-examples/ · https://www.dataparc.com/blog/manufacturing-kpi-examples-10-formulas-for-measuring-success/ · https://machinemetrics.com/blog/manufacturing-kpis · https://tulip.co/blog/manufacturing/how-to-calculate-34-manufacturing-kpis/ · https://www.cascade.app/blog/manufacturing-kpis · https://scw.ai/blog/manufacturing-kpis/ · https://upkeep.com/learning/what-are-the-best-metrics-and-kpis-for-manufacturing-companies/ · https://safetyculture.com/topics/kpi/manufacturing-kpis/ (redirects to mitti.com) · https://www.vorne.com/learning-center/kpi.htm
40. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264; Purdue-based Levels 0–4, Level 3 = manufacturing operations management). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
41. Equipment Performance Metrics (SEMI E10 RAM and utilization; SEMI E79 equipment productivity incl. OEE). SEMI. https://semi.org/en/products-services/standards/step/equipment-performance-metrics
42. OSHA: Clarification on how the formula is used by OSHA to calculate incident rates. Standard interpretation letter, August 23, 2016. https://www.osha.gov/laws-regs/standardinterpretations/2016-08-23
43. U.S. Bureau of Labor Statistics: Employer-Reported Workplace Injuries and Illnesses – 2025. News release, November 18, 2026. https://www.bls.gov/news.release/osh.nr0.htm
44. U.S. Bureau of Labor Statistics: Number and rate of nonfatal work injuries and illnesses in private industries, 2025 (chart). https://www.bls.gov/charts/injuries-and-illnesses/number-and-rate-of-nonfatal-work-injuries-and-illnesses-by-industry.htm
45. 29 CFR 1904.39 – Reporting fatalities, hospitalizations, amputations, and losses of an eye as a result of work-related incidents to OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.39
46. U.S. Bureau of Labor Statistics: Occupational Safety and Health Definitions (recordable cases, DART, days away from work). https://www.bls.gov/iif/definitions/occupational-safety-and-health-definitions.htm
47. Supply Chain Dive: news brief on Walmart's on-time, in-full requirement for suppliers (87 %, two-day window, 3 % fine). March 8, 2019. https://www.supplychaindive.com/news/walmart-on-time-in-full-87-suppliers/550083/
