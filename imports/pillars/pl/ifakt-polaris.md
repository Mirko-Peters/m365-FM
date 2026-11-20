# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software für Wertstromanalyse: Kaufratgeber + iFAKT Polaris |
| Meta description | So wählen Sie Software für Wertstromanalyse: 5 Werkzeugkategorien, Auswahlkriterien, Checkliste und ein belegter Blick auf iFAKT Polaris und seine Grenzen. |
| Slug | `ifakt-polaris` |

# Software für Wertstromanalyse in der Fertigung: Ein Kaufratgeber und eine evidenzbasierte Betrachtung von iFAKT Polaris

> **Uwaga: Autor pracuje w iFAKT GmbH.**

*Stan na 20 listopada 2026 · Każde stwierdzenie dotyczące produktu ma źródło; deklaracje dostawcy są oznaczone jako deklaracje dostawcy.*

> **Krótka odpowiedź:** Oprogramowanie do mapowania strumienia wartości obejmuje narzędzia do rysowania z symbolami lean, dedykowane narzędzia VSM, które obliczają wskaźniki, oraz systemy symulacji i planowania. Jaka kategoria jest potrzebna, zależy od tego, czy chcesz dokumentować strumienie wartości, regularnie oceniać je na podstawie danych, symulować je w czasie, czy przekładać je na harmonogramy dla hali produkcyjnej. Darmowe narzędzia do rysowania, takie jak Lucidchart i Miro oraz szablon Visio, wystarczają do warsztatów; dedykowane narzędzia VSM zwracają się wtedy, gdy mapujesz regularnie; symulacja i APS to osobne kategorie. **iFAKT Polaris** to modułowa platforma firmy iFAKT GmbH (Stuttgart, Niemcy) z siedmioma modułami: VSM (strumienie wartości), BSM (tory procesów), Designer (model produkt-proces-zasób), Simulator, Optimizer (planowanie z uwzględnieniem ograniczeń), Operator (zadania na hali produkcyjnej) oraz Analyzer (pulpity wskaźników KPI). Według dostawcy moduły współdzielą jeden model danych [3]. Autor nie zna żadnych niezależnych testów porównawczych Polaris. Można zweryfikować dwie oferty w Microsoft AppSource [15][16], drugie miejsce w kategorii Production w Best of Technology Award 2025 niemieckiego tygodnika biznesowego WirtschaftsWoche dla Polaris IMS [18] oraz cykl artykułów technicznych w niemieckim czasopiśmie inżynierskim ZWF [21][22][23][24].

Kto szuka oprogramowania do mapowania strumienia wartości, na początku napotyka problem słownictwa. Pod hasłami „value stream mapping software” lub „value stream management software” dostawcy oferują bardzo różne produkty: programy do rysowania z biblioteką symboli, narzędzia lean z formułami, systemy symulacyjne, platformy dla zespołów dostarczających oprogramowanie oraz systemy planowania z cyfrowym bliźniakiem. Zestawienia, które mieszają te kategorie, prowadzą do złych zakupów. Zakład, który mapuje swój strumień wartości raz w roku podczas wydarzenia kaizen, potrzebuje czegoś innego niż producent o dużej różnorodności wyrobów, który co tydzień planuje produkcję przy napiętych zdolnościach produkcyjnych.

Dlatego ten przewodnik ma dwie części. **Część A** neutralnie opisuje rynek: co oprogramowanie do mapowania strumienia wartości musi robić, jakie kategorie istnieją, jak je porównywać i jakie błędy są typowe podczas wyboru i wdrażania. **Część B** szczegółowo opisuje iFAKT Polaris, moduł po module, z dowodami z oficjalnych stron dostawcy, Microsoft Marketplace, literatury technicznej i jury konkursu, a także z jasnym wskazaniem, czego nie udokumentowano i dla kogo produkt się nie nadaje.

Ponieważ autor pracuje w iFAKT GmbH, w tym tekście obowiązuje jedna prosta zasada: każde stwierdzenie dotyczące produktu ma źródło, deklaracje dotyczące korzyści podawane przez dostawcę są oznaczone jako takie i nie są traktowane jako fakty, a część A jest napisana tak, aby służyć jako pomoc decyzyjna, nawet jeśli nigdy nie przeczytasz części B.

### Kluczowe wnioski

- **Najpierw kategoria, potem produkt:** narzędzia do rysowania, dedykowane narzędzia VSM, oprogramowanie do symulacji, systemy APS oraz MES/BI rozwiązują różne problemy. Zacznij od pytania, na które oprogramowanie ma odpowiedzieć.
- **Rysowanie rzadko jest wąskim gardłem.** Liczy się łączność z danymi, logika obliczeń, scenariusze, możliwość modelowania zmienności i asortymentu oraz to, czy analiza przekłada się na działania i harmonogramy.
- **Statyczne mapowanie strumienia wartości operuje średnimi.** Zmienność, asortyment i wspólne zasoby wymagają symulacji, a terminy realizacji przy ograniczeniach wymagają algorytmów harmonogramowania.
- **Darmowe opcje istnieją** w kategorii narzędzi do rysowania (Lucidchart, Miro, Creately i inne) oraz, w przypadku dwóch modułów, w iFAKT Polaris [3]. Sprawdź limity użytkowników, eksport i prawa do danych.
- **iFAKT Polaris** obejmuje, według dostawcy, łańcuch od mapowania strumienia wartości przez symulację i harmonogramowanie po zadania na hali produkcyjnej i raportowanie [3]. Strony modułów wymieniają funkcje, ale nie podają wskaźników korzyści z ujawnioną metodologią.
- **Udokumentowane są:** certyfikat ISO 9001 od października 2014 [4], certyfikat ISO/IEC 27001 wydany przez TÜV SÜD, podany na stronie internetowej [1][3], hosting modułów VSM i BSM w Microsoft Azure West Europe (region zlokalizowany w Holandii) zgodnie ze stronami modułów [6][7][43], dwie oferty w AppSource [15][16] oraz nagroda WirtschaftsWoche [18].
- **Nieudokumentowane** na przeglądanych stronach: funkcja symulacji w module VSM, natywna integracja z Microsoft Teams lub Power BI, region hostingu w USA, raport SOC 2 oraz publiczne cenniki.

## Spis treści

**Część A: Czego wymagać od oprogramowania do mapowania strumienia wartości**

1. [Pojęcia: mapowanie strumienia wartości, projektowanie stanu przyszłego, zarządzanie strumieniem wartości](#1-pojęcia-mapowanie-strumienia-wartości-projektowanie-stanu-przyszłego-zarządzanie-strumieniem-wartości)
2. [Dlaczego papier i Excel osiągają swoje granice](#2-dlaczego-papier-i-excel-osiągają-swoje-granice)
3. [Pięć kategorii oprogramowania do mapowania strumienia wartości](#3-pięć-kategorii-oprogramowania-do-mapowania-strumienia-wartości)
4. [Tabela porównawcza kategorii](#4-tabela-porównawcza-kategorii)
5. [Jak wybrać oprogramowanie do mapowania strumienia wartości: kryteria szczegółowo](#5-jak-wybrać-oprogramowanie-do-mapowania-strumienia-wartości-szczegółowe-kryteria)
6. [Lista kontrolna wyboru](#6-lista-kontrolna-wyboru)
7. [Wdrożenie w sześciu krokach](#7-wdrożenie-w-sześciu-krokach)
8. [Typowe błędy przy wyborze i wdrożeniu](#8-typowe-błędy-przy-wyborze-i-wdrażaniu)
9. [Uzasadnienie biznesowe bez wymyślonych liczb](#9-ein-business-case-ohne-erfundene-zahlen)

**Część B: iFAKT Polaris szczegółowo**

10. [Podstawy i metoda: od metryk do danych zdarzeniowych](#10-tło-i-metoda)
11. [Zasada platformy: jeden model danych, siedem modułów](#11-zasada-platformy-jeden-model-danych-siedem-modułów)
12. [Moduły jeden po drugim](#12-moduły-jeden-po-drugim)
13. [Polaris IMS i nagroda Best of Technology Award 2025](#13-polaris-ims-i-nagroda-best-of-technology-award-2025)
14. [Branże według firmy](#14-branże-według-firmy)
15. [Polaris w ekosystemie Microsoft](#15-polaris-w-ekosystemie-microsoft)
16. [Bezpieczeństwo, hosting i certyfikaty](#16-bezpieczeństwo-hosting-i-certyfikaty)
17. [Co obiecuje dostawca i jak to sprawdzić](#17-co-dostawca-obiecuje-i-jak-to-sprawdzić)
18. [Dla kogo Polaris się nadaje, a dla kogo nie](#18-dla-kogo-polaris-jest-odpowiedni-a-dla-kogo-nie)
19. [FAQ](#19-faq)
20. [Podsumowanie](#20-podsumowanie)

# Część A: Czego wymagać od oprogramowania do mapowania strumienia wartości

## 1. Pojęcia: mapowanie strumienia wartości, projektowanie stanu przyszłego, zarządzanie strumieniem wartości

**Mapowanie strumienia wartości** (VSM, ang. *value stream mapping*) przedstawia przepływ materiału i informacji dla jednej rodziny produktów, od dostawcy do klienta, za pomocą znormalizowanych symboli. Pod każdym polem procesu znajdują się dane takie jak czas cyklu, czas przezbrojenia, czas pracy maszyn i schemat zmian; między polami procesów znajdują się zapasy, przeliczone na dni pokrycia. Oś czasu u dołu pokazuje, jaka część całkowitego czasu przejścia jest wartość dodaną. W USA metoda jest ściśle związana z książką *Learning to See* Mike'a Rothera i Johna Shooka, wydaną przez Lean Enterprise Institute; opisuje ona mapowanie stanu obecnego, projektowanie stanu przyszłego i plan wdrożenia dla fikcyjnego zakładu, Acme Stamping. Zeszyt ćwiczeń otrzymał nagrodę Shingo Research Prize w 1999 roku [41]. Pełna metoda, z symbolami, wzorami i przykładem krok po kroku, znajduje się w kompendium m365.fm [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

**Projektowanie stanu przyszłego** wykorzystuje mapę stanu obecnego do zaprojektowania celu: ciągły przepływ tam, gdzie to możliwe; ciągnienie przez supermarkety tam, gdzie przepływ nie jest możliwy; jeden proces wyznaczający tempo (pacemaker); produkcja wyrównana (*leveled production*). Dopiero stan przyszły i plan wdrożenia zamieniają analizę w usprawnienie. Niemieccy praktycy często używają w tym kroku określenia *Wertstromdesign*, od nazwy standardowego niemieckiego podręcznika autorstwa Klausa Erlacha z Fraunhofer IPA [40].

**Zarządzanie strumieniem wartości** w produkcji oznacza ciągłe zarządzanie przedsiębiorstwem wzdłuż strumieni wartości: odpowiedzialny menedżer strumienia wartości utrzymuje aktualny stan obecny i przyszły, śledzi metryki i działania oraz powtarza analizę, gdy zmienia się asortyment lub popyt. Od 2020 roku istnieje do tego norma międzynarodowa, ISO 22468:2020 „Value stream management (VSM)” [39]. Krótkie wprowadzenie znajduje się we wpisie [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

**Ważne rozróżnienie:** w tworzeniu oprogramowania „value stream management” oznacza odrębną kategorię produktów. Te platformy mierzą przepływ elementów pracy przez potok dostarczania oprogramowania, od zgłoszenia do wdrożenia. Jeśli szukasz hasła „value stream management software” i myślisz o fabryce, zwróć uwagę: w wynikach wyszukiwania w USA kilka zestawień łączy narzędzia DevOps, takie jak LinearB, Copado czy Plutora, z narzędziami dla produkcji [50]. Te platformy nie są zbudowane do obsługi materiału, zapasów i maszyn. Niniejszy przewodnik dotyczy wyłącznie strumieni wartości w produkcji i w otaczających ją procesach biznesowych.

## 2. Dlaczego papier i Excel osiągają swoje granice

Mapowanie strumienia wartości zaczęło się jako metoda wykonywana ołówkiem i na papierze i w przypadku pierwszej mapy nadal jest to właściwy sposób. Ktoś, kto stoi na gemba (miejscu, w którym tworzona jest wartość, czyli na hali produkcyjnej) z ołówkiem i liczy zapasy, lepiej rozumie przepływ niż ktoś, kto przegląda oprogramowanie. Mimo to metoda papierowa napotyka ograniczenia w czterech sytuacjach.

**Po pierwsze: migawka.** Klasyczna mapa strumienia wartości pokazuje jeden punkt w czasie. Prezentując niemiecki projekt badawczy ECOWERT, Markus Böhm z Fraunhofer IPA (niemieckiego instytutu badań stosowanych w inżynierii produkcji) ujął to tak (tłumaczenie z języka niemieckiego): „Zasadniczo mapowanie strumienia wartości to nic innego jak migawka”. Według instytutu wiele firm wykonuje je co najwyżej raz w roku [25]. Gdy zmienia się miks produktowy, popyt lub schemat zmian, mapa jest nieaktualna.

**Po drugie: średnie zamiast rozkładów.** Na papierze każde pole procesu ma jeden czas cyklu, a nie swoją zmienność. Awarie, sekwencje przezbrojeń i wspólne zasoby znikają w średniej. Jeden z dostawców symulacji opisuje tę różnicę następująco: symulacja strumienia wartości dodaje do widoku „sekwencje zależne od czasu, zmienność i wspólne zasoby” (tłumaczenie z języka niemieckiego) [37]. Türck, Weimer, Schubert i Drees opisali to przejście od analizy statycznej do dynamicznej symulacji strumieni wartości już w 2014 roku w ZWF, *Zeitschrift für wirtschaftlichen Fabrikbetrieb*, niemieckim czasopiśmie poświęconym inżynierii produkcji [22].

**Po trzecie: różnorodność produktów.** Metoda analizuje jedną rodzinę produktów. W produkcji o dużym zróżnicowaniu i małych wolumenach wiele wariantów o różnych trasach przebiegu przechodzi jednak przez te same zasoby. Jedna mapa na wariant jest niepraktyczna, a jedna mapa dla wszystkich wariantów zaciera wąskie gardła.

**Po czwarte: nakład obliczeniowy i wersje.** Takt time, dni zapasu, lead time i wskaźnik przepływu można obliczyć w Excelu, ale każda zmiana mapy musi być przenoszona ręcznie. Kilka scenariuszy, kilka zakładów i kilku edytorów szybko tworzy konkurencyjne wersje plików.

Kolejność tych konsekwencji ma znaczenie. Oprogramowanie dość łatwo rozwiązuje pierwszy i czwarty problem, o ile dane są dostępne. Dopiero oprogramowanie, które faktycznie modeluje zmienność i miks produktowy, rozwiązuje drugi i trzeci. A żadne oprogramowanie nie zastąpi dyskusji zespołu o tym, jak powinien wyglądać stan przyszły.

## 3. Pięć kategorii oprogramowania do mapowania strumienia wartości

Krótki wpis Wikipedii o oprogramowaniu do mapowania strumienia wartości rozróżnia dwa podstawowe typy: narzędzia pomagające rysować mapę oraz narzędzia wykonujące obliczenia i analizę [46]. Przy decyzji zakupowej bardziej pomocny jest podział na pięć kategorii niż ranking poszczególnych produktów. Poniższe przykłady nie są ani kompletne, ani rekomendacjami; pokazują, jakiego rodzaju narzędzie można spodziewać się w każdej kategorii. Wszystkie informacje o produktach opierają się na stronach dostawców i ofertach na platformach marketplace.

### 3.1 Narzędzia do rysowania i tablice ttylko do współpracy

**Co robią:** Dostarczają biblioteki symboli dla map strumienia wartości i umożliwiają zespołom wspólną pracę w przeglądarce lub na komputerze. Microsoft Visio zawiera szablon mapy strumienia wartości; artykuł pomocy Microsoft podaje, że szablon wymaga edycji Visio Professional (lub starszej edycji Premium) i nie jest dołączony do Visio Standard, a w sekcji „Dotyczy” wymieniono Visio Plan 2 [27]. Lucidchart oferuje bibliotekę kształtów VSM w bezpłatnym koncie [28]; Miro udostępnia zestaw szablonów map strumienia wartości na swojej tablicy [29]. Creately, EdrawMax, SmartDraw i podobne narzędzia działają w ten sam sposób. Do tej kategorii należą także szablony w Excelu i PowerPoincie.

**Zalety:** niski próg wejścia, dobra współpraca, często bezpłatne poziomy dostępu, znajomy interfejs.

**Ograniczenia:** zazwyczaj brak logiki obliczeniowej stojącej za symbolami. Wskaźniki wpisuje się ręcznie, scenariusze są kopiami rysunku, a brakuje połączenia danych z ERP lub MES.

**Dobre do:** dokumentacji, szkoleń, pierwszych warsztatów kaizen, rozproszonych zespołów potrzebujących wspólnego widoku.

### 3.2 Dedykowane narzędzia do mapowania strumienia wartości (oprogramowanie VSM z logiką obliczeniową)

**Co robią:** Łączą symbole lean z logiką obliczeniową. Wskaźniki takie jak zapas w dniach, czas realizacji i udział czasu wartości dodanej są obliczane automatycznie na podstawie danych procesowych, a scenariusze można porównywać obok siebie. Przykłady: eVSM, który jego dostawca opisuje jako „kompletny zestaw narzędzi lean do mapowania, modelowania i usprawniania strumieni wartości każdego typu” (opis na marketplace z funkcjami zgłaszanymi przez użytkowników, takimi jak mapowanie modeli mieszanych i import z Excela) [42]; SimVSM firmy SimPlan (Niemcy), którego wersja podstawowa obsługuje cyfrowe mapowanie strumienia wartości, „łącznie z ocenami statycznymi” (tłumaczenie z niemieckiego) [30], i automatycznie oblicza wskaźniki, takie jak czas cyklu, przepustowość i zapas [31]; visTable (Niemcy), który łączy strumień wartości i układ fabryki w jednym modelu i według dostawcy automatycznie oblicza czasy realizacji na podstawie danych o procesach, cyklach i zapasach [32]; oraz Polaris VSM firmy iFAKT (patrz część B).

**Zalety:** mniej błędów obliczeniowych, szybkie scenariusze, wersjonowanie, często wbudowane śledzenie działań.

**Ograniczenia:** koszty licencji, krzywa uczenia się, a obliczenia zazwyczaj pozostają statyczne: pracują na średnich, nawet gdy dane napływają automatycznie.

**Dobre do:** firm, które regularnie prowadzą prace nad strumieniem wartości i chcą utrzymać porównywalność kilku strumieni wartości lub zakładów.

### 3.3 Oprogramowanie do symulacji

**Co robi:** Symulacja zdarzeń dyskretnych modeluje zlecenia, zasoby, bufory, zmiany i awarie w czasie. Odpowiada to na pytania, na które statyczna mapa nie odpowie: Gdzie pojawi się wąskie gardło przy tym asortymencie? Czy bufor jest wystarczająco duży przy tym poziomie awarii? Co daje dodatkowa zmiana? Znane narzędzia to Siemens Tecnomatix Plant Simulation, AnyLogic (modelowanie wielometodowe: agentowe, dynamika systemowa i zdarzenia dyskretne) oraz FlexSim (zdarzenia dyskretne z modelowaniem 3D) [34]. Niektórzy dostawcy łączą strumień wartości i symulację bezpośrednio: Siemens oferuje bibliotekę VSM dla Plant Simulation X z gotowymi elementami strumienia wartości, porównywaniem scenariuszy i dynamiczną symulacją strumieni wartości, która zbiera wskaźniki takie jak czas cyklu, czas realizacji, WIP i wykorzystanie zasobów [33]; w SimVSM Pro można symulować scenariusze, na przykład w celu oceny działań lub zidentyfikowania wąskich gardeł [31].

**Zalety:** zmienność, asortyment i wspólne zasoby stają się widoczne; inwestycje można przetestować przed podjęciem zobowiązania.

**Ograniczenia:** zbudowanie i walidacja modelu wymaga czasu i kompetencji. Klasyczne projekty symulacyjne są często jednorazowymi analizami, a model nie jest utrzymywany po podjęciu decyzji.

**Dobre do:** decyzji inwestycyjnych i układowych, produkcji wielowariantowej, pytań o zdolności produkcyjne przy dużej niepewności.

### 3.4 Systemy APS (zaawansowane planowanie i harmonogramowanie)

**Co robią:** Systemy APS tworzą szczegółowe harmonogramy z uwzględnieniem ograniczeń: zdolności produkcyjnych maszyn i personelu, kwalifikacji, sekwencji przezbrojeń, dostępności materiałów oraz terminów realizacji. Siemens opisuje Opcenter Scheduling jako system tworzący „harmonogramy produkcji oparte na dostępności zasobów, ograniczeniach i materiałach wymaganych dla zlecenia” [36]. Szczegółowy przegląd znajduje się w kompendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

**Mocne strony:** realistyczne, wykonalne harmonogramy zamiast planowania grubego względem nieograniczonych zdolności; szybkie przeplanowanie po zakłóceniach.

**Ograniczenia:** wysokie wymagania wobec jakości danych podstawowych (marszruty, czasy, zasoby), nakład pracy na integrację z ERP i MES, akceptacja ze strony planistów.

**Dobre do:** firm z ograniczonymi, współdzielonymi zasobami, dużą liczbą wariantów i presją terminów dostaw.

### 3.5 MES, process mining i BI

**Co robią:** Systemy realizacji produkcji (MES) rejestrują rzeczywiste dane z hali produkcyjnej, a narzędzia BI oraz analityka oparta na danych je oceniają. Niektórzy dostawcy automatycznie odtwarzają strumienie wartości na podstawie tych danych. ONIQ, oferowany przez PwC Store w Niemczech, podaje, że dane zwrotne z systemów IT produkcji „(np. MES, PDA, PPS, IIoT)” mogą być przeniesione do cyfrowego bliźniaka strumienia wartości „bez ręcznego mapowania” [35] (PDA to akwizycja danych produkcyjnych; PPS to niemiecki termin określający systemy planowania i sterowania produkcją).

**Mocne strony:** rzeczywiste dane zamiast szacunków, ciągła analiza zamiast jednorazowych badań.

**Ograniczenia:** wynik jest tylko tak dobry, jak dane zwrotne; stan docelowy i harmonogramy nie pojawiają się automatycznie. MES nie zastępuje mapowania strumienia wartości; dostarcza mu dane.

**Dobre do:** zakładów z dobrą bazą danych, które chcą na bieżąco monitorować odchylenia i trendy. Więcej o wskaźnikach w kompendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/); o codziennych rutynach na hali produkcyjnej w kompendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 3.6 Platformy obejmujące kilka kategorii

Niektórzy dostawcy łączą kilka z tych kategorii w jednym produkcie, na przykład strumień wartości i layout (visTable [32]), strumień wartości i symulację (SimVSM Pro [31], biblioteka VSM w Plant Simulation X [33]) lub strumień wartości, symulację, harmonogramowanie i realizację (iFAKT Polaris, według dostawcy [3]). Zaletą jest ciągłość danych: to, co zostało zarejestrowane podczas mapowania, nie musi być ponownie wprowadzane na potrzeby symulacji. Wadą jest to, że w każdej pojedynczej kategorii wyspecjalizowane narzędzie może pójść głębiej. W przypadku platform należy sprawdzić każdą kategorię osobno pod kątem swoich wymagań, zamiast traktować szerokość zakresu jako jakość samą w sobie.

## 4. Tabela porównawcza kategorii

| Kryterium | Rysunek/tablica | Dedykowane narzędzie VSM | Oprogramowanie do symulacji | System APS | MES / process mining / BI |
|---|---|---|---|---|---|
| Główne pytanie | Jak wygląda przepływ? | Gdzie są marnotrawstwo i dźwignie? | Jak system zachowuje się w czasie? | Kto, co i kiedy robi? | Co faktycznie się wydarzyło? |
| Symbole Lean | tak (szablony) | tak, z logiką | częściowo (biblioteki VSM) | nie | rzadko |
| Metryki automatyczne | nie | tak (statyczne) | tak (dynamiczne, jako rozkłady) | metryki planu (terminy, wykorzystanie) | metryki rzeczywiste |
| Zmienność i awarie | nie | głównie nie | tak | częściowo (przeplanowanie) | widoczne po fakcie |
| Różnorodność produktów | słaba | średnia | dobra | dobra | dobra (dane rzeczywiste) |
| Połączenie z danymi ERP/MES | nie | opcjonalne | import, zwykle w ramach projektu | wymagane | wymagane |
| Wynik | rysunek | mapa z metrykami, scenariusze | ocena scenariuszy | wykonalny harmonogram | raporty, dashboardy |
| Typowy nakład pracy | niski | niski do średniego | średni do wysokiego | wysoki | wysoki |
| Typowi użytkownicy | coachi Lean, zespoły kaizen | menedżerowie strumieni wartości, inżynierowie przemysłowi | inżynierowie symulacji, planiści obiektów | planiści produkcji, harmonogramiści | kierownictwo zakładu, IT, finanse |

Tabela opisuje typowe profile. Poszczególne produkty mogą się różnić, a platformy obejmują kilka kolumn. Przy podejmowaniu decyzji liczy się to, która kolumna odpowiada na Państwa najważniejsze pytanie.

### Szybki przewodnik decyzyjny

- **Chcą Państwo dokumentować strumienie wartości na potrzeby warsztatów i szkoleń** i mapować je najwyżej raz w roku: narzędzie do rysowania z szablonem zwykle wystarczy.
- **Regularnie prowadzą Państwo prace nad strumieniami wartości**, porównują kilka strumieni lub zakładów i chcą metryk bez utrzymywania arkuszy kalkulacyjnych: dedykowane narzędzie VSM.
- **Wąskie gardła przesuwają się wraz z miksem produktów** lub muszą Państwo uzasadnić inwestycję w maszyny, ludzi lub bufory: symulacja, najlepiej na modelu utrzymywanym po zakończeniu badania.
- **Problemem są terminy**, ponieważ wiele zleceń konkuruje o ograniczone maszyny, narzędzia i kompetencje: system APS.
- **Nie wiedzą Państwo, co faktycznie dzieje się na hali**, ponieważ potwierdzenia są niekompletne lub niewiarygodne: najpierw zbieranie danych (MES, zbieranie danych z maszyn), a dopiero potem analiza.
- **Kilka z powyższych sytuacji dotyczy Państwa jednocześnie:** proszę rozważyć platformy łączące kilka kategorii na jednym modelu danych i porównać każdą kategorię z wyspecjalizowanym narzędziem.

## 5. Jak wybrać oprogramowanie do mapowania strumienia wartości: szczegółowe kryteria

### 5.1 Połączenie z danymi ERP, MES i produkcją

Najważniejsze pytanie brzmi: skąd pochodzą dane i jak często są aktualizowane? Narzędzie obsługujące wyłącznie ręczne wprowadzanie danych pozostaje migawką. Narzędzie, którego nie da się uruchomić bez integracji z ERP, opóźnia wszelkie korzyści o miesiące. Dobre rozwiązanie startuje bez integracji i pozwala podłączyć dane później. Pytaj konkretnie o formaty importu (Excel, CSV), standardowe konektory do systemu ERP (SAP, Microsoft Dynamics 365, Epicor, Infor, Oracle lub cokolwiek innego, z czego korzystasz), interfejsy do MES i zbierania danych z maszyn oraz możliwość podłączenia danych maszynowych przez bramkę IIoT (typowe protokoły to OPC UA, MTConnect i MQTT). Ustal też, kto buduje i utrzymuje interfejs: dostawca, partner czy własny zespół IT.

### 5.2 Logika obliczeń i wskaźniki

Sprawdź, jakie wskaźniki oblicza narzędzie i czy widoczne są jego wzory. Czas taktu (czas dostępny podzielony przez popyt klienta), dni zapasów, czas realizacji, wskaźnik wartości dodanej (często raportowany jako efektywność cyklu procesu, PCE), OEE i wskaźnik przepływu powinny dać się prześledzić. Wskaźniki niestandardowe i własne wzory mają znaczenie, ponieważ każdy zakład stosuje własne definicje. Oprogramowanie, którego wyników nikt nie może przeliczyć ponownie, traci wiarygodność w rozmowie z działem finansowym.

### 5.3 Dynamika i symulacja

To kluczowe rozróżnienie: czy narzędzie liczy na podstawie średnich, czy symuluje działanie w czasie? Wielu dostawców nazywa „symulacją” porównanie scenariuszy, mimo że porównywane są jedynie statyczne wskaźniki dwóch wariantów. Pytaj, czy zmienność, awarie, układy zmian, mix produktów i wspólne zasoby są modelowane w czasie oraz co jest wynikiem: średnie, rozkłady, szeregi czasowe wykorzystania. Przy danych stochastycznych (awarie, zmienne czasy) oprogramowanie powinno umożliwiać ocenę wielu replikacji; pojedynczy przebieg to tylko jeden możliwy wynik, a nie wiarygodny rezultat.

### 5.4 Różnorodność produktów i struktura wyrobów

Gdy na tych samych zasobach działa wiele wariantów, model potrzebuje zestawień materiałowych, marszrut i przydziałów zasobów, a nie tylko pudełek procesów. Sprawdź, czy narzędzie modeluje produkty, procesy i zasoby osobno i łączy je ze sobą (często nazywane modelem produkt-proces-zasób, w skrócie PPR), oraz czy uwzględnia zależne od sekwencji czasy przezbrojeń między wariantami.

### 5.5 Od analizy do realizacji

Duża część wartości powstaje po analizie. Pytaj, czy działania, karty kaizen, właściciele i terminy są zarządzane w tym samym narzędziu, czy da się udokumentować cykl PDCA i czy przyszły stan może zamienić się w harmonogram dla produkcji.

### 5.6 Współpraca i zarządzanie

Role i uprawnienia (odczyt, edycja, administrowanie), historia wersji, wielodostępność dla kilku zakładów lub podmiotów prawnych, jednoczesna edycja i ślad audytowy zmian są obowiązkowe, gdy narzędzie używa więcej niż jeden zespół.

### 5.7 Integracja z Microsoft

Wielu amerykańskich producentów korzysta z Microsoft 365 i Microsoft Entra ID (dawniej Azure Active Directory), a niektórzy używają Dynamics 365 jako systemu ERP. Istotne pytania to: Czy oprogramowanie obsługuje jednokrotne logowanie (single sign-on) z Twoim dostawcą tożsamości? Czy istnieje standardowy konektor do Dynamics 365, czy tylko import plików? Czy wskaźniki można eksportować do narzędzia BI, na przykład Power BI? Czy rozwiązanie można kupić przez Microsoft AppSource lub Azure Marketplace? Wpis w AppSource oznacza, że rozwiązanie jest oferowane w marketplace Microsoft; sam w sobie nic nie mówi o tym, jak głęboka jest integracja.

### 5.8 Hosting, ochrona danych i bezpieczeństwo informacji

Dane produkcyjne zawierają zdolności produkcyjne, koszty, zamówienia klientów i dostawców. Ustal, gdzie dane są przechowywane (region, operator centrum danych), jak rozdzielani są najemcy (tenants) i jakie certyfikaty lub potwierdzenia zgodności może przedstawić dostawca. Dla kupujących z USA warto zapytać o cztery punkty:

- **Rezydencja danych.** Zapytaj na piśmie, w którym regionie chmury przechowywane są Twoje dane. Jeśli dostawca hostuje dane wyłącznie w UE, sprawdź, czy jest to zgodne z umowami z klientami i wewnętrznymi politykami. Jeśli dane o łańcuchu wartości obejmują dane techniczne podlegające ITAR lub EAR (częste w lotnictwie i obronności), zaangażuj zespół ds. zgodności eksportowej, zanim umieścisz te dane w jakiejkolwiek usłudze chmurowej.
- **Atestacje.** Wiele amerykańskich zespołów bezpieczeństwa żąda raportu SOC 2, czyli audytu prowadzonego według kryteriów AICPA dotyczących kontroli istotnych dla bezpieczeństwa, dostępności, integralności przetwarzania, poufności lub prywatności [45]. Międzynarodową alternatywą jest certyfikacja ISO/IEC 27001, potwierdzająca audytowany system zarządzania bezpieczeństwem informacji. Obie mogą być akceptowalne; poproś o certyfikat z zakresem i datą ważności lub o sam raport. Istotne jest to, czy tworzenie i eksploatacja oprogramowania mieszczą się w zakresie audytu.
- **Własne ramy ryzyka.** Cybersecurity Framework 2.0 instytutu NIST, opublikowany 26 lutego 2024 r., przeznaczony jest dla organizacji każdej wielkości i sektora i dodał funkcję „Govern” do funkcji Identify, Protect, Detect, Respond i Recover [44]. Możesz go użyć do uporządkowania własnych przeglądów dostawców.
- **Prawo ochrony danych UE.** Przy europejskim dostawcy często napotkasz odniesienia do RODO, czyli ogólnego rozporządzenia UE o ochronie danych (GDPR), oraz do umowy o przetwarzaniu danych (DPA). DPA na podstawie RODO to umowa określająca, jak dostawca przetwarza dane osobowe w Twoim imieniu; w narzędziach produkcyjnych dotyczy to głównie kont użytkowników i imion. Nie jest to certyfikat bezpieczeństwa.

### 5.9 Koszty, wersja próbna i wsparcie

Zapytaj o model licencjonowania (na użytkownika, na zakład, na moduł), bezpłatny poziom lub wersję próbną, szkolenia i nakład wdrożeniowy, a także o doradztwo ze strony dostawcy lub partnera. Amerykańskich kupujących zagranicznego dostawcy powinno również interesować, czy wsparcie działa w godzinach odpowiadających ich strefom czasowym i czy istnieją partnerzy wdrożeniowi w USA. Wielu dostawców na tym rynku nie publikuje cen; to powszechne, ale utrudnia porównanie. Poproś o pisemną wycenę całkowitego kosztu w perspektywie trzech lat, z uwzględnieniem integracji.

## 6. Lista kontrolna wyboru

**Pytanie i zakres**
- [ ] Główne pytanie jest zapisane (dokumentować, oceniać, symulować, harmonogramować lub monitorować).
- [ ] Wybrano odpowiadającą kategorię z rozdziału 3.
- [ ] Wskazano obszar pilotażowy z jedną rodziną produktów i mierzalnym celem.

**Dane**
- [ ] Można rozpocząć bez integracji z systemami.
- [ ] Import z Excela/CSV został przetestowany na własnych danych.
- [ ] Opisano połączenie z ERP i MES (standardowy łącznik lub projekt).
- [ ] Ustalono, kto odpowiada za działanie interfejsów.

**Funkcjonalność**
- [ ] Wskaźniki i formuły są widoczne i można je dostosować.
- [ ] Scenariusze można wersjonować i porównywać.
- [ ] Dynamika (zmienność, awarie, struktura asortymentu) jest modelowana, jeśli jest potrzebna.
- [ ] Warianty, zestawienia materiałowe i sekwencje przezbrojeń można modelować, jeśli są potrzebne.
- [ ] Działania i PDCA są śledzone w narzędziu.

**Eksploatacja i bezpieczeństwo**
- [ ] Region hostingu i operator centrum danych są potwierdzone na piśmie.
- [ ] Dostępny jest raport SOC 2 lub certyfikat ISO/IEC 27001 z zakresem.
- [ ] Dostępna jest umowa o przetwarzaniu danych, jeśli są przetwarzane dane osobowe.
- [ ] Wyjaśniono kwestie kontroli eksportu (ITAR/EAR), jeśli dotyczą.
- [ ] Logowanie jednokrotne (SSO) i model ról pasują do Twojego działu IT.

**Ekonomia**
- [ ] Znany jest całkowity koszt w perspektywie trzech lat, łącznie z integracją i szkoleniami.
- [ ] Hipotezy korzyści są poparte własnymi wartościami bazowymi (patrz rozdział 9).
- [ ] Rozmawiałeś z referencyjnym klientem z Twojej branży.

## 7. Wdrożenie w sześciu krokach

**Krok 1: Ustal cel i obszar pilotażu.** Wybierz rodzinę produktów z widocznym problemem, na przykład długim czasem realizacji lub słabą terminowością dostaw, oraz mierzalny cel. Pilotaż obejmujący od razu wszystkie zakłady zwykle kończy się niepowodzeniem z powodu problemów z koordynacją.

**Krok 2: Zmapuj stan obecny na gemba.** Idź na halę produkcyjną, policz zapasy, zapytaj o czasy. Oprogramowanie służy do rejestrowania danych, a nie zastępuje patrzenia na własne oczy.

**Krok 3: Uzupełnij dane.** Dodaj do obchodu dane z ERP, MES lub systemu zbierania danych z maszyn, na początek w postaci pliku. Różnice między tym, co zaobserwowałeś, a tym, co pokazują systemy, same w sobie są wynikiem: wskazują, gdzie dane podstawowe są błędne.

**Krok 4: Opracuj stan przyszły i scenariusze.** Wypracuj stan przyszły zespołowo i porównaj warianty. Jeśli istotna jest zmienność lub struktura asortymentu, przetestuj warianty w symulacji.

**Krok 5: Wdrażaj i śledź działania.** Przekształć stan przyszły w działania z przypisanymi właścicielami i terminami. Jeśli rozwiązanie obejmuje planowanie i realizację, sprawdź w obszarze pilotażu, czy harmonogramy utrzymują się na hali produkcyjnej.

**Krok 6: Utrzymaj i rozszerzaj.** Ustal, kto odpowiada za strumień wartości, jak często przeglądane są wskaźniki i kiedy analiza jest powtarzana. Dopiero wtedy rozszerzenie na kolejne strumienie wartości ma sens.

## 8. Typowe błędy przy wyborze i wdrażaniu

- **Narzędzie przed metodą:** Jeśli zespół nie opanował mapowania strumienia wartości, oprogramowanie tylko pomaga szybciej rysować błędne mapy. Najpierw wytrenuj metodę.
- **Mylenie kategorii:** Narzędzie do rysowania kupuje się wtedy, gdy na stole leżą pytania o harmonogramowanie, albo system APS, gdy nikt jeszcze nie zna strumienia wartości.
- **Traktowanie porównania scenariuszy jak symulacji:** Dwie statyczne mapy obok siebie nie pokazują wąskich gardeł, które pojawiają się dopiero przez zmienność.
- **Niedocenianie jakości danych:** Marszruty z nieaktualnymi czasami dają nierealistyczne wyniki w każdym oprogramowaniu. Zaplanuj czas na uporządkowanie danych podstawowych.
- **Wymuszanie integracji zbyt wcześnie:** Kilkumiesięczny projekt interfejsu przed pierwszym rezultatem kosztuje poparcie. Zacznij od importu plików.
- **Przyjmowanie deklarowanych przez dostawców korzyści:** Wartości procentowe, takie jak „do 50 procent krótszy czas realizacji”, opisują pojedyncze przypadki w nieznanych warunkach. Takie liczby są powszechne na rynku, od pakietów APS po narzędzia VSM (przykłady w rozdziale 17). Licz na podstawie własnych wartości bazowych.
- **Nikt nie odpowiada za strumień wartości:** Bez menedżera strumienia wartości najlepsza cyfrowa mapa zestarzeje się tak samo jak mapa na papierze pakowym.
- **Pominięcie hali produkcyjnej:** Harmonogramy i zadania, których operatorzy nie rozumieją lub nie mogą potwierdzić, pozostają teorią.

## 9. Ein Business Case ohne erfundene Zahlen

Ein belastbarer Business Case für Software zur Wertstromanalyse beruht auf Ihren eigenen Ausgangswerten, nicht auf Prozentangaben aus Broschüren. Die Logik lässt sich in fünf Hebel und drei Kostenblöcke gliedern.

**Hebel 1: Bestand und Durchlaufzeit.** Nach dem Gesetz von Little gilt im eingeschwungenen Zustand: Work in Process = Durchsatz × Durchlaufzeit. Wenn Sie die Durchlaufzeit bei gleichbleibendem Durchsatz senken, sinkt das gebundene Umlaufvermögen im gleichen Verhältnis. Rechnen Sie mit Ihrem aktuellen WIP, Ihren Kapitalkosten und einer Zielhypothese, die das Projektteam begründen kann.

**Hebel 2: Liefertreue.** Verspätete Lieferungen verursachen vertragliche Strafen, Expressfracht, Eilaufträge und Vertrauensverlust beim Kunden. Erfassen Sie die heutige Liefertreue und die unmittelbar zurechenbaren Kosten verspäteter Aufträge im letzten Jahr.

**Hebel 3: Kapazität und vermiedene Investitionen.** Zeigt eine Simulation, dass ein vermeintlicher Engpass durch Reihenfolgeplanung oder Puffer gelöst werden kann, entfällt eine Investition. Dieser Hebel ist oft der größte, aber er ist einmalig und zählt nur, wenn die Investition tatsächlich eingeplant war.

**Hebel 4: Planungs- und Analyseaufwand.** Zählen Sie die heute aufgewendeten Stunden für Wertstrombegehungen, Pflege von Tabellenkalkulationen und manuelle Terminplanung. Bewerten Sie die Einsparungen vorsichtig: Freigewordene Zeit ist nur dann ein Nutzen, wenn sie für andere Aufgaben eingesetzt wird.

**Hebel 5: Qualität der Entscheidungen.** Schwer quantifizierbar, aber real: schlechte Investitionen, die nicht getätigt werden, und Entscheidungen zur Produktmischung, die vorab getestet werden. Erfassen Sie diesen Hebel qualitativ, statt ihn mit erfundenen Zahlen zu füllen.

**Kosten:** (1) Lizenzen oder Abonnements über die geplante Laufzeit, (2) Implementierung einschließlich Datenaufbereitung, Schnittstellen, Schulung und Beratung, (3) interne Zeit für den Pilotbetrieb, die Pflege der Stammdaten und die laufende Verantwortung für den Wertstrom.

**Vorgehen:** Legen Sie für jeden Hebel eine Ausgangsbasis, eine konservative und eine erwartete Zielhypothese fest und berechnen Sie beide Szenarien gegen die Kosten. Der Pilot dient dazu, die Hypothesen mit realen Daten zu prüfen. Ein Anbieter, der sich auf einen Pilot mit messbaren Kriterien einlässt, ist vertrauenswürdiger als einer, der Nutzenwerte ohne Methodik nennt.

# Teil B: iFAKT Polaris im Detail

> **Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

Die folgenden Abschnitte beschreiben [iFAKT Polaris](https://www.m365.fm/entity/polaris/) auf Grundlage der Produktseiten der [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) (Englisch und Deutsch, abgerufen am 20. November 2026), der Microsoft-AppSource-Einträge, eines Beitrags in der Microsoft Tech Community, der Auszeichnungsseiten der WirtschaftsWoche sowie der Fachliteratur. Wo eine Aussage nur vom Anbieter stammt, wird dies im Text angegeben. Dem Autor sind keine unabhängigen Vergleichstests oder Analystenbewertungen von Polaris bekannt.

## 10. Tło i metoda

iFAKT GmbH ma siedzibę pod adresem Curiestrasse 2, 70563 Stuttgart, Niemcy (rejestr handlowy: Sąd Rejonowy w Stuttgarcie, HRB 22661) [5]. Jej angielska strona firmowa podaje, że biura znajdują się w pobliżu lotniska w Stuttgarcie [4]. Według firmy od ponad 25 lat zajmuje się optymalizacją procesów produkcyjnych i biznesowych [3]. Strona firmy wymienia jako branże motoryzację, lotnictwo, inżynierię mechaniczną i technikę medyczną [4].

Przy ocenie Polaris historia firmy ma mniejsze znaczenie niż metodyczne podstawy tego oprogramowania. Istnieje tu weryfikowalny ślad: Jörg Drees, wymieniony z afiliacją iFAKT GmbH w artykule ZWF z 2023 roku [24], opublikował w latach 2011–2023 kilka artykułów wraz ze współautorami w ZWF, a ostatnio wspólnie z Fraunhofer IPA. ZWF (*Zeitschrift für wirtschaftlichen Fabrikbetrieb*) to niemieckojęzyczne czasopismo inżynierskie, którego archiwum jest obecnie udostępniane przez De Gruyter Brill; poniższe tytuły są przetłumaczone, a oryginalne niemieckie tytuły podano w źródłach. Artykuły wyznaczają ścieżkę, która widoczna jest w strukturze modułów Polaris.

| Rok | Artykuł (tytuł przetłumaczony) | Autorzy | Odniesienie | Powiązanie z Polaris |
|---|---|---|---|---|
| 2011 | Optymalizacja produkcji dzięki metrykom modelowania strumienia wartości | Jörg Drees, Christoph Sack | ZWF 106 (6), s. 466–470, DOI 10.3139/104.110589 [21] | obliczanie metryk w strumieniu wartości (VSM) |
| 2014 | Dynamiczna symulacja strumieni wartości | Stefan Türck, Andreas Weimer, Lars Schubert, Jörg Drees | ZWF 109 (11), s. 839–842, DOI 10.3139/104.111242 [22] | krok od analizy statycznej do symulacji |
| 2018 | Nowe perspektywy metody strumienia wartości: Value Stream Management 4.0, Next Generation | Jörg Drees | ZWF 113 (9), s. 605–609, DOI 10.3139/104.111974 [23] | metoda strumienia wartości i oprogramowanie dla połączonej produkcji (Przemysł 4.0, IIoT) |
| 2023 | Uniwersalny interfejs danych dla cyfrowych usług strumienia wartości | Markus Böhm, Jörg Drees, Brandon Sai, Klaus Erlach, Steffi Stambera, Tim Teriete | ZWF 118 (5), s. 293–297, DOI 10.1515/zwf-2023-1062 [24] | dane zdarzeniowe z maszyn jako wspólna baza danych dla usług strumienia wartości |

**2011: metryki.** Drees i Sack opisują, jak metryki z modelowania strumienia wartości można wykorzystać do optymalizacji produkcji [21]. To jest rdzeń dedykowanego narzędzia VSM: symbole z kryjącą się za nimi logiką obliczeń.

**2014: dynamika.** Według streszczenia artykułu Türcka, Weimera, [Larsa Schuberta](https://www.m365.fm/entity/lars-schubert/) i [Jörga Dreesa](https://www.m365.fm/entity/jorg-drees/) wychodzi on z założenia, że modelowanie strumienia wartości przechodzi od statycznego spojrzenia na strumienie wartości i metryki ku dynamicznej symulacji, i pyta, jakie nowe możliwości, w tym czas, otwiera to dla optymalizacji produkcji [22]. Ta idea żyje dalej w module Simulator, który jednak działa na modelu produkt-proces-zasób z Designera, a nie na mapie strumienia wartości (Sekcja 12).

**2018: łączność.** Drees pyta, jak metoda strumienia wartości i jej oprogramowanie muszą się rozwijać, skoro Przemysł 4.0 i IIoT łączą informacje w całym zakładzie [23].

**2021–2023: dane w czasie rzeczywistym z Fraunhofer IPA.** W projekcie badawczym ECOWERT (skrót od niemieckiego „analiza strumienia wartości w czasie rzeczywistym dla zrównoważonej optymalizacji produkcji”) Fraunhofer IPA współpracował z iFAKT GmbH nad oprogramowaniem, które automatycznie i niemal w czasie rzeczywistym odpytuje i wyświetla dane produkcyjne z systemów ERP i innych źródeł. Projekt jednorocznego trwania, finansowany przez kraj związkowy Badenia-Wirtembergia, trwał do 31 sierpnia 2022 roku i otrzymał około 300 000 EUR z programu Invest BW; ESB Business School Uniwersytetu w Reutlingen pomogła przy budowie demonstratora [25]. Artykuł branżowy Dreesa, Stambery i Böhma opisuje ścieżkę techniczną: dane maszynowe w formacie JSON przez bramkę IIoT (wymienia OPC UA, MTConnect, IO-Link i MQTT; w projekcie użyto MQTT ze Sparkplug), bazę danych szeregów czasowych oraz powiązanie z aplikacją strumienia wartości Polaris VSM, która oblicza metryki za pomocą drzewa KPI dla wybranych okresów i rodzin produktów [26]. Artykuł ZWF z 2023 roku uogólnia to podejście do uniwersalnego interfejsu danych; według autorów usługa strumienia wartości do obliczania i wizualizacji metryk została połączona w ramach ECOWERT [24]. Wśród autorów jest Klaus Erlach z Fraunhofer IPA, autor standardowego niemieckiego podręcznika projektowania strumieni wartości [40].

**Co pokazuje ta ścieżka, a czego nie pokazuje:** Publikacje wskazują, że autorzy od dawna pracują nad metrykami, symulacją i łącznością danych dla strumieni wartości, oraz że instytut badawczy współpracował z iFAKT. Nie dowodzą jednak, że dzisiejsze oprogramowanie jest lepsze od innych. Fraunhofer IPA również nie ocenia żadnego produktu w swoim komunikacie prasowym; opisuje projekt badawczy i według instytutu aplikacje w tamtym czasie nie przedstawiały "jeszcze żadnych sugestii" (tłumaczenie z niemieckiego) [25].

Mapowanie strumienia wartości z danymi na żywo i ciągłym modelem danych jest także tematem odcinka podcastu [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) na m365.fm.

## 11. Zasada platformy: jeden model danych, siedem modułów

Według FAQ dostawcy Polaris jest modułową platformą oprogramowania dla inteligentnych fabryk, która obejmuje optymalizację produkcji: od mapowania strumienia wartości, przez symulację i harmonogramowanie wspomagane AI, po wykonanie na hali produkcyjnej i raportowanie [3]. Na stronie internetowej wymieniono siedem modułów: VSM, BSM, Designer, Simulator, Optimizer, Operator i Analyzer. Według dostawcy wszystkie moduły pracują na tym samym modelu danych, dzięki czemu symulację lub harmonogramowanie można dodać później bez ponownego zbierania danych [3]. Dostawca opisuje przepływ jako pętlę: "Map → Simulate → Optimize → Execute → Analyze" [3].

Na angielskiej stronie głównej iFAKT podsumowuje ofertę tak: "Polaris combines ERP data with a manufacturing digital twin to optimize schedules" [1]. Wymienione główne funkcje to "Constraint-based scheduling (resources, skills, shifts, buffers)", "What-if simulation for disruptions and mix changes" oraz "KPI cockpit: lead time, WIP, utilization, OTD" [1]. Strona podkreśla trzy zasady: połączenie danych z ERP, Excela lub hali produkcyjnej albo start od lekkiego modelu ("plug and play"), jedną platformę do mapowania, symulacji, harmonogramowania i wykonania bez przełączania narzędzi, oraz modelowanie złożoności, takiej jak miks produktów, przezbrojenia, umiejętności, zmiany, sekwencje operacji, bufory i zakłócenia [1][2].

Aby rozpocząć pracę, FAQ wskazuje dwie drogi: moduły VSM i BSM są dostępne w bezpłatnym pakiecie bez karty kredytowej; dla Simulator, Optimizer i Operator dostawca oferuje spersonalizowane demo i wersję próbną [3]. Nie trzeba wdrażać wszystkich modułów; według dostawcy wiele firm zaczyna od VSM, ponieważ nie wymaga on integracji z systemami [3]. Dla symulacji i harmonogramowania FAQ podaje typowy czas wdrożenia wynoszący od dwóch do czterech tygodni, obejmujący integrację danych, konfigurację modelu i szkolenie [3]. Ten czas to deklaracja dostawcy; w praktyce silnie zależy od jakości danych podstawowych i interfejsów.

Aby zrozumieć architekturę, warto przypisać moduły do kategorii z części A:

| Moduł | Kategoria z części A | Podstawa danych według dostawcy | Wynik |
|---|---|---|---|
| VSM | dedykowane narzędzie VSM | ręczne zbieranie danych, opcjonalnie ERP, MES, zbieranie danych z maszyn, hurtownia danych [6] | mapa strumienia wartości z metrykami i scenariuszami |
| BSM | modelowanie procesów (swimlanes) | ręczne modelowanie [7] | mapa procesu z osią czasu i metrykami |
| Designer | modelowanie (graf PPR) | dane z ERP, zestawienia materiałowe, czasy procesów, zasoby [8] | model produkt-proces-zasób, diagram sieciowy |
| Simulator | symulacja | model PPR z Designera [9] | wykorzystanie, wąskie gardła, scenariusze w czasie |
| Optimizer | APS | model PPR, dane z ERP, dostępność zasobów [10] | wykonalny harmonogram produkcji |
| Operator | wykonanie na hali produkcyjnej | harmonogram z Optimizera [11] | zadania dla pracowników, potwierdzenia |
| Analyzer | BI / metryki | metryki ze wszystkich modułów [12] | pulpity, plan vs. wykonanie |

Klasyfikację jako aplikacji biznesowej w taksonomii m365.fm znajdziesz na stronie encji [Business Application](https://www.m365.fm/entity/business-application/).

## 12. Moduły jeden po drugim

### 12.1 Polaris VSM: cyfrowe mapowanie strumienia wartości

**Przeznaczenie:** [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) to moduł do mapowania strumienia wartości. Wpis Microsoftu o profilu na AppSource opisuje go jako „cyfrowe narzędzie zarządzania lean”, którego producenci używają do mapowania łańcuchów dostaw i strumieni wartości; system formuł oraz tablice Kanban i Kaizen mają obliczać, sprawdzać i wyświetlać KPI, a zespoły mogą współpracować zdalnie [17].

**Funkcje według strony producenta** [6][14]:
- import z ERP, MES, systemów zbierania danych maszynowych i hurtowni danych przez Polaris IIoT Gateway, z możliwością łączenia z ręcznymi obserwacjami na hali produkcyjnej
- automatyczne obliczanie „25+ standardowych KPI VSM”, w tym czasu realizacji, udziału wartości dodanej, zapasów, OEE oraz taktu w porównaniu z czasem cyklu; możliwe są własne metryki i formuły
- „50+ predefiniowanych symboli lean” z edytorem i kodowaniem kolorami
- trzy poziomy hierarchii: strumień wartości end-to-end (poziom 1), podprocesy (poziom 2), szczegółowe operacje (poziom 3)
- „Nieograniczone tworzenie scenariuszy (A, B, C, D…)”, analiza wrażliwości i porównanie metryk obok siebie; strumienie wartości można duplikować, aby testować zmiany bez ingerencji w produkcję
- role Admin, Editor i Viewer w architekturze wielodostępnej, równoczesna edycja, historia wersji, śledzenie zmian oraz dokumentacja działań w cyklu PDCA
- „Eksport w wielu formatach (JPEG, Excel, SVG)” oraz szyfrowany eksport do archiwizacji
- wsparcie oznaczone jako „AI-Support” w obszarze raportów i pulpitów, bez dalszego opisu

**Dowody spoza strony producenta:** profil na AppSource [15][17]; zastosowanie jako aplikacja strumienia wartości połączona z bazą szeregów czasowych w artykule branżowym o automatycznie zbieranych danych strumienia wartości [26].

**Deklaracje producenta bez metodologii:** „Kompletny VSM w 2–4 godziny (w porównaniu z 2–3 dniami na papierze i w Excelu)”, „100% dokładność danych (bez ręcznych błędów w Excelu)” oraz „redukcja ryzyka wdrożenia o 30–40%” [6]. Strona produktu mówi także o ukończeniu projektów strumienia wartości w jednej trzeciej czasu [14]. Żadne z tych twierdzeń nie jest poparte metodologią. „100% dokładność danych” może rozsądnie odnosić się wyłącznie do wyeliminowania błędów przepisywania, a nie do jakości danych wejściowych.

**Ograniczenia i to, czego nie udokumentowano:** Strona VSM opisuje scenariusze i analizę wrażliwości, ale **nie dynamiczną symulację** w rozumieniu punktu 5.3 [6]. Jeśli chcesz badać zmienność, awarie lub miks produktów w czasie, potrzebujesz Simulatora lub innego narzędzia symulacyjnego. Strona nie wspomina o integracji z Microsoft Teams ani Power BI. Cen nie publikowano; według FAQ VSM jest dostępny w wersji bezpłatnej [3], której zakresu strona modułu nie opisuje.

**Dalsza lektura:** kompendium [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · wpis [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)

### 12.2 Polaris BSM: procesy biznesowe jako swimlanes

**Przeznaczenie:** [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) (Business Swimlane Modeling) stosuje widok strumienia wartości do procesów biznesowych, takich jak wycena, inżynieria, inżynieria procesu produkcji czy obsługa zamówień (praktycy lean w USA często nazywają to mapowaniem strumienia wartości w biurze lub w procesach transakcyjnych). Wpis na AppSource opisuje go jako „cyfrowe narzędzie do modelowania procesów biznesowych do analizy procesów biznesowych w cyfrowym zarządzaniu lean” [16].

**Funkcje według strony producenta** [7]:
- pule jako kontenery organizacyjne, tory dla ról, kompetencji lub działów, które można pokazywać lub ukrywać
- modelowanie obiektów danych, magazynów danych i systemów IT; widoczne stają się przerwania ciągłości między papierem a formą cyfrową lub między systemami
- oś czasu z czasami trwania aktywności na ścieżce krytycznej oraz czasami wyprzedzeń i opóźnień
- wykres bilansu operatorów (skumulowane słupki udziałów czasu cyklu), pozwalający wykryć nierównowagi
- automatyczne obliczanie ścieżki krytycznej, czasu realizacji, czasu cyklu i udziału wartości dodanej; według strony „10+” standardowych metryk procesu oraz własne metryki
- klasyfikacja na działania dodające wartość i niedodające wartości, kwantyfikacja kosztów marnotrawstwa
- nieograniczona liczba scenariuszy (obecny, przyszły, alternatywy) z analizą wpływu
- karty kaizen tworzone podczas modelowania i powiązane z aktywnościami, uporządkowane w cykle PDCA lub DMAIC

**Plany według AppSource** [16]: P0 „Read Only” (odczyt całej zawartości), P1 „Basic” (nagrania BPMN, szablony swimlane, podstawowe formuły, czas realizacji, wykres równoważenia, widok szybkiej edycji), P2 „Excellence” (wszystkie funkcje z P0 i P1) oraz P3 „Integrate & Customize” (brak opisu). Oferta nie podaje cen.

**Ograniczenia i to, czego nie udokumentowano:** Strona modułu nie wskazuje żadnego standardu notacji; tylko oferta w AppSource wspomina o nagraniach BPMN w planie P1 [7][16]. Nie jest udokumentowane, czy modele BSM można importować lub eksportować w formie zgodnej z BPMN. Strona BSM nie podaje formatów eksportu. Jeśli szukasz pełnego pakietu BPM z wykonywaniem procesów (silnik przepływów pracy), BSM – zgodnie ze swoim opisem – jest narzędziem do analizy i doskonalenia, a nie do automatyzacji procesów.

### 12.3 Polaris Designer: model produkt-proces-zasób

**Cel:** Według dostawcy [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) przekształca dane wejściowe w ustrukturyzowany graf wiedzy produkt-proces-zasób (graf wiedzy PPR), który stanowi wspólną podstawę dla symulacji i optymalizacji [8]. Jest ogniwem łączącym widok strumienia wartości z modułami symulacji i harmonogramowania.

**Funkcje według strony dostawcy** [8]:
- modelowanie PPR: produkt jako zestawienie materiałowe produkcyjne lub konstrukcyjne (MBOM/EBOM), proces z czasami przezbrojenia, pracy maszyn i transportu, zasoby jako stanowiska, zespoły i strefy
- dane wejściowe: dane z ERP, zestawienia materiałowe produkcyjne, czasy procesów, struktury zasobów i ograniczenia
- automatyczne generowanie diagramu sieciowego z logiki produkcji, obliczanie ścieżki krytycznej
- scenariusze typu „co jeśli” i porównanie czasu realizacji obecnego i zoptymalizowanego
- strefy oparte na produktach, które grupują procesy według rodzin produktów i wspierają równoważenie zdolności produkcyjnych

**Ocena:** W przypadku problemu wariantów opisanego w punkcie 5.4 model PPR jest zazwyczaj lepiej dopasowany niż mapa strumienia wartości, ponieważ warianty są reprezentowane przez swoje zestawienia materiałowe i marszruty, a nie przez pojedyncze pola procesów. Strona główna używa określenia „cyfrowy bliźniak” dla tego modelu [1]; o różnych znaczeniach „cyfrowego bliźniaka” piszemy w kompendium [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

**Ograniczenia i to, czego nie udokumentowano:** Strona nie podaje formatów ani mechanizmu importu, wyników ilościowych ani jawnej konfiguracji wariantów (takiej jak zestawy reguł dla produktów konfigurowalnych) [8]. Pozostaje otwarte, jak modelowane są ograniczenia w grafie.

### 12.4 Polaris Simulator: scenariusze w czasie

**Cel:** Według dostawcy [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) uruchamia diagramy sieciowe z Designera w konfigurowalnych modelach stanowisk, linii i hali (poziom budynku), dla pojedynczych i wielu linii [9].

**Funkcje według strony dostawcy** [9]:
- symulacja oparta na rzeczywistej logice procesów z modelu PPR
- scenariusze dotyczące zdolności produkcyjnych, obsady i buforów
- analiza dynamicznych mieszanek produktów na wspólnych zasobach
- wykrywanie wąskich gardeł i nierównomiernego wykorzystania w czasie
- wykorzystanie ludzi i zasobów technicznych w czasie, przeciążenia i niedociążenia
- przejrzystość zdolności produkcyjnych w zmianach i scenariuszach
- elastyczna konfiguracja stanowisk i tras produkcyjnych

**Ocena:** Moduł obejmuje zatem pytania, które część A przypisuje kategorii symulacji, zwłaszcza mieszankę produktów i zasoby współdzielone. Cytat klienta na stronie głównej (Everllance) brzmi: „Symulacja Polaris pomogła nam wskazać problemy w naszych danych planistycznych” [1]; to pojedynczy cytat na stronie dostawcy, a nie badanie.

**Ograniczenia i to, czego nie udokumentowano:** Strona nie określa wprost typu symulacji (na przykład zdarzeniowej dyskretnej), nie definiuje szczegółowo wskaźników wyjściowych, takich jak przepustowość czy WIP, i nie podaje informacji o danych stochastycznych, na przykład rozkładach awarii [9]. Nie opisano, czy wyniki są raportowane jako rozkłady, czy jako pojedyncze wartości. W przypadku systemów przenośników, robotyki czy uruchamiania wirtualnego właściwym wyborem są wyspecjalizowane narzędzia z punktu 3.3; Polaris nie określa się jako symulator przepływu materiałów 3D.

### 12.5 Polaris Optimizer: harmonogramowanie z ograniczeniami

**Cel:** Według dostawcy [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) przekształca graf PPR w wykonalny, zoptymalizowany harmonogram produkcji oparty na danych z ERP i dostępności zasobów [10]. Odpowiada kategorii APS.

**Funkcje według strony dostawcy** [10][13]:
- uwzględnianie zasobów, zmian, stref, kwalifikacji i zdolności produkcyjnych; priorytety zleceń ustalane przez planistów
- planowanie maszyn, pracowników i narzędzi
- wyświetlanie opóźnionych zleceń i zagrożeń terminów dostaw
- wielkość partii według wariantu i maszyny, sekwencjonowanie według czasów przezbrojeń między wariantami
- kompromis między zapasami, kosztami magazynowania i poziomem obsługi
- potwierdzenia z hali produkcyjnej za pośrednictwem Operatora, automatyczna ponowna optymalizacja po zakłóceniach z analizą wpływu
- zasoby współdzielone między projektami
- krótkoterminowe planowanie operacyjne i długoterminowa prognoza zdolności produkcyjnych

Według FAQ Polaris używa „algorytmów optymalizacji opartych na ograniczeniach”, aby generować harmonogramy uwzględniające zdolności maszyn, kwalifikacje pracowników, zmiany, materiały i terminy realizacji [3]. Strona dotycząca planowania i realizacji wymienia również ograniczenia wielozasobowe, sekwencje przezbrojeń i planowanie oparte na priorytetach; do testów dane można importować z pliku, Excela lub eksportu z ERP, a w produkcji występuje ciągła synchronizacja z ERP, MES lub innymi systemami [13].

**Deklaracje dostawcy bez metodologii:** Strona planowania podaje skrócenie czasu realizacji o 50 procent, optymalizację zdolności produkcyjnych o 40 procent i do 80 procent mniej ręcznego wysiłku planistycznego [13]; strona Optymalizatora mówi o minimalnym czasie realizacji i maksymalnej efektywności kosztowej jednym kliknięciem oraz o znacznym skróceniu czasu przezbrojeń [10]. Nie podano punktu odniesienia, próby ani metody pomiaru.

**Ograniczenia i to, czego nie udokumentowano:** Optymalizator opisywany jest jako wspierany przez AI (strona planowania nosi tytuł „Planowanie i harmonogramowanie produkcji wspierane przez AI”), bez wskazania algorytmów ani metod [10][13]. Strona modułu nie zawiera konkretnych szczegółów integracji z ERP; FAQ wspomina o standardowych interfejsach do SAP i Microsoft Dynamics [3]. Nie opisano planowania wielozakładowego ani łańcucha dostaw. Więcej kontekstu w kompendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

### 12.6 Polaris Operator: zadania dla hali produkcyjnej

**Cel:** Według dostawcy [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) przejmuje zoptymalizowany harmonogram bezpośrednio z Optymalizatora i prezentuje go na poziomie zadań na hali produkcyjnej [11].

**Funkcje według strony dostawcy** [11]:
- indywidualny, aktualny widok zadań dla każdego pracownika
- widok ścieżki krytycznej dla liderów zmian
- instrukcje robocze osadzone w zadaniach
- wstrzymywanie lub blokowanie zadań albo oznaczanie ich ustrukturyzowaną informacją zwrotną
- potwierdzenia postępu, opóźnień, zakłóceń, faktycznej obsady i przerw w czasie rzeczywistym
- bieżący przegląd produkcji w toku dla planistów
- dane produkcyjne zwracane do harmonogramowania

**Ocena:** Operator został zaprojektowany jako kanał zwrotny między planem a realizacją: harmonogram jest wart tyle, ile informacja zwrotna o tym, czy utrzymał się na hali produkcyjnej. Funkcjonalnie pokrywa się z częściami MES (kolejka zadań, potwierdzenia), ale nie określa siebie jako MES.

**Ograniczenia i to, czego nie udokumentowano:** Strona nie wymienia obsługiwanych urządzeń ani wskaźników wydajności [11]. Relacja z istniejącym MES (uzupełniająca, zastępująca, równoległa) nie jest opisana; należy ją wyjaśnić na wczesnym etapie projektu, aby uniknąć podwójnych potwierdzeń. Więcej o codziennych rutynach na hali w kompendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 12.7 Polaris Analyzer: pulpity KPI

**Cel:** Według dostawcy [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) zestawia wskaźniki ze wszystkich modułów Polaris w pulpitach [12].

**Funkcje według strony dostawcy** [12]:
- centralne wskaźniki dla wszystkich modułów Polaris
- wizualizacja czasów realizacji, wykorzystania, wąskich gardeł i statusu projektów
- porównanie scenariuszy, harmonogramów i rzeczywistej wydajności
- wykrywanie ograniczeń zdolności produkcyjnych i potencjału usprawnień

**Ograniczenia i to, czego nie udokumentowano:** Strona nie wymienia źródeł danych spoza modułów Polaris, typów pulpitów ani połączenia z zewnętrznymi narzędziami BI, takimi jak Power BI [12]. Jeśli Twoja firma korzysta z centralnego systemu BI, wyjaśnij, w jaki sposób wskaźniki trafiają do niego. Definicje wskaźników opisano w kompendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### 12.8 Przegląd: co udokumentowano dla każdego modułu

| Modul | Opis funkcji na ifakt.de | Zewnętrzne dowody | Dane o korzyściach z opisem metodologii | Najważniejsze otwarte pytanie |
|---|---|---|---|---|
| VSM | szczegółowy [6][14] | AppSource [15], Tech Community [17], artykuł branżowy [26] | nie | zakres bezpłatnej wersji |
| BSM | szczegółowy [7] | AppSource z planami [16] | nie | notacja, eksport |
| Designer | średni [8] | artykuły naukowe o podejściu [22][24] (pośrednio) | nie | formaty importu, logika wariantów |
| Simulator | średni [9] | nagroda WirtschaftsWoche dla Polaris IMS [18] (pośrednio) | nie | typ symulacji, stochastyka |
| Optimizer | szczegółowy [10][13] | nagroda WirtschaftsWoche dla Polaris IMS [18] (pośrednio) | nie (dane bez opisu metodologii) | algorytmy, integracja z ERP |
| Operator | średni [11] | nagroda WirtschaftsWoche dla Polaris IMS [18] (pośrednio) | nie | urządzenia, granica z MES |
| Analyzer | krótki [12] | brak | nie | połączenie z zewnętrznym BI |

## 13. Polaris IMS i nagroda Best of Technology Award 2025

Poza siedmioma nazwami modułów natrafisz na nazwę **Polaris IMS**. Pod tą nazwą firma iFAKT GmbH zgłosiła się do nagrody Best of Technology Award 2025 tygodnika biznesowego WirtschaftsWoche. Na stronie zwycięzców WirtschaftsWoche iFAKT z Polaris IMS (opisanym tam jako system planowania produkcji) figuruje na **drugim miejscu w kategorii Production**, za Skeleton Technologies i przed OMRON Electronics [18]. Pozostałymi finalistami w tej kategorii były remberg oraz UNWARE [19].

Opis jury (w języku niemieckim) określa Polaris IMS jako inteligentny system, który buduje cyfrowy bliźniak produkcji i automatycznie planuje efektywne wykorzystanie zasobów; plan jest realizowany na hali produkcyjnej i monitorowany w danych czasu rzeczywistego, a w razie zakłóceń AI proponuje usprawnienia [18][19]. Zdaniem autora funkcjonalnie odpowiada to współdziałaniu modułów Designer, Simulator, Optimizer i Operator. Nazwy używa także cytat klienta ze strony głównej (Silhouette): „Wykorzystanie Polaris IMS było kolejnym krokiem w kierunku Smart Factory w naszej organizacji” [1]. Na stronie sponsorskiej wydarzenia lean Lean Around The Clock 2025 iFAKT opisuje siebie przy użyciu „POLARIS suite”, złożonego z modułów IMS, BSM i VSM [20].

**Interpretacja:** Na podstawie tych źródeł IMS jest nazwą części platformy wykraczającej poza modelowanie strumienia wartości i procesów, czyli obejmującej modelowanie, symulację, harmonogramowanie i realizację. Obecna strona internetowa dzieli tę część na poszczególne moduły, a nazwy IMS używa wyłącznie w cytacie klienta [1]. Dostawca nie opublikował oficjalnego odwzorowania IMS na dzisiejsze nazwy modułów; to odwzorowanie jest interpretacją autora.

**Co mówi nagroda:** Best of Technology Award to nagroda jury wydana przez publikację biznesową. Pokazuje, że jury wysoko oceniło koncepcję spośród zgłoszeń w kategorii Production. Nie jest to test funkcjonalny ani wydajnościowy i nie zastępuje testu na własnych danych. Dla czytelników z USA: to nagroda przyznana przez niemieckie czasopismo spośród jego zgłoszeń, więc traktuj ją jako jeden punkt danych, a nie jako rekomendację rynku.

## 14. Branże według firmy

Poniższe informacje pochodzą ze strony internetowej iFAKT GmbH. Są to dane podane przez samego dostawcę; zakres i czas trwania poszczególnych relacji z klientami nie zostały określone.

| Branża wg ifakt.de | Opis na stronie internetowej | Wymienione firmy (logotypy, referencje, cytaty) |
|---|---|---|
| Lotnictwo i przemysł lotniczy | wysoka precyzja dla przemysłu lotniczego [2] | Airbus [1] |
| Motoryzacja i mobilność | produkcja just-in-time i just-in-sequence, od produkcji komponentów po montaż końcowy [2] | Magna, Vitesco, ZF, Junghans [1] |
| Inżynieria mechaniczna i automatyka | engineer-to-order do małych serii, BOM-y i produkcja wariantowa [2] | Karl Dungs, Pfannenberg, Weidmüller, GRASS [1] |
| Energetyka i infrastruktura | planowanie produkcji dla infrastruktury krytycznej [2] | MAN Energy, Siemens Energy, Liebherr [1] |

Pasek logotypów na angielskojęzycznej stronie głównej pokazuje również FFG, Fraunhofer, Helbling, Jumo, Liebherr, Pfannenberg, Silhouette, Airbus, Dungs i Eismann [1]. Cytaty pochodzą od Silhouette, Airbus i Everllance [1], a na stronie produktu VSM dodatkowo od Siemens Energy dotyczący coachingu ze strony iFAKT [14]. Strona firmy wymienia również technikę medyczną jako branżę [4]. Sekcja FAQ stwierdza, że Polaris jest "stworzony dla firm produkcyjnych w lotnictwie, motoryzacji, inżynierii mechanicznej i energetyce", a jako docelowych użytkowników wskazuje kierowników produkcji, konsultantów lean oraz zespoły operacyjne [3].

**Co można wywnioskować:** Nacisk położono na produkcję dyskretną i montaż o dużej różnorodności i złożonych produktach. Dla przemysłów procesowych (chemia, farmacja, żywność z recepturami i partiami) dostawca nie podaje żadnych referencji. Wymienieni klienci to w większości firmy europejskie lub europejskie zakłady międzynarodowych grup; przeanalizowane strony nie wskazują amerykańskich zakładów jako referencji.

## 15. Polaris w ekosystemie Microsoft

Dla firm silnie opierających się na Microsoft udokumentowano następujące kwestie:

- **Oferty w AppSource:** Polaris VSM ("Polaris VSM - Digital Value Stream Mapping") oraz Polaris BSM ("Polaris BSM - Business Swimlane Modeling") figurują w Microsoft AppSource jako rozwiązania iFAKT GmbH [15][16].
- **Microsoft Tech Community:** 11 lipca 2024 r. blog Marketplace na Tech Community opublikował wpis o Polaris VSM w ramach "ISV Success for Business Applications". Według Microsoftu program oferuje "platformy, zasoby i wsparcie zaprojektowane tak, aby pomóc partnerom tworzyć, publikować i promować aplikacje biznesowe" [17].
- **Hosting:** Strony modułów VSM i BSM podają "Hosted on Microsoft Azure West Europe" [6][7]. Lista regionów Microsoftu umieszcza West Europe w Holandii [43]. FAQ mówi ogólniej o "bezpiecznej europejskiej infrastrukturze chmurowej" [3].
- **Integracja z ERP:** Według FAQ Polaris może łączyć się z SAP, Microsoft Dynamics i innymi platformami ERP za pomocą standardowych interfejsów oraz może importować dane z arkuszy kalkulacyjnych i plików CSV [3].
- **Status partnera:** Strona firmy wymienia status Microsoft Gold Partner (uzyskany w 2019 r.) oraz kompetencję "Gold Application Development" po raz dziesiąty z rzędu [4]. Według Microsoftu kompetencje Gold i Silver można było odnawiać tylko do 30 września 2022 r.; od 3 października 2022 r. Microsoft przyznaje zamiast tego oznaczenia Solutions Partner [38]. Oświadczenie to opisuje zatem status historyczny.

**Niedokumentowane:** Natywna integracja z Microsoft Teams, łącznik Power BI, logowanie jednokrotne z Microsoft Entra ID ani dostępność jako rozszerzenie Dynamics 365 nie są wymienione na przeanalizowanych stronach. Oferta w AppSource oznacza możliwość zakupu przez marketplace Microsoftu, a nie automatycznie głęboką integrację. Jeśli te kwestie są dla Ciebie istotne, należy je potwierdzić pisemnie podczas wyboru. Więcej informacji o IT produkcyjnym na Azure znajduje się w kompendium [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## 16. Bezpieczeństwo, hosting i certyfikaty

| Aspekt | Stwierdzenie | Źródło | Status |
|---|---|---|---|
| ISO 9001 | certyfikowany zgodnie z DIN EN ISO 9001, obowiązuje od października 2014 | strona firmy [4] | oświadczenie dostawcy, udokumentowane na stronie internetowej |
| ISO/IEC 27001 | "TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified" (odznaka); FAQ: certyfikat ISO 27001 i ISO 9001, audyt przeprowadzony przez TÜV SÜD | strona główna, FAQ [1][2][3] | oświadczenie dostawcy; certyfikat z zakresem nie jest publicznie dostępny |
| Hosting | Microsoft Azure West Europe, zlokalizowany w Holandii (VSM, BSM); "bezpieczna europejska infrastruktura chmurowa" (FAQ) | strony modułów, FAQ, lista regionów Microsoft [3][6][7][43] | oświadczenie dostawcy |
| Szyfrowanie, role, audyty | szyfrowanie, kontrola dostępu oparta na rolach i regularne audyty bezpieczeństwa | FAQ [3] | oświadczenie dostawcy |
| Izolacja najemców, uwierzytelnianie | izolowane środowiska najemców, OAuth 2.0 | strona BSM [7] | oświadczenie dostawcy |
| RODO | "100% zgodne z RODO" | strony VSM i BSM [6][7] | oświadczenie dostawcy; zgodność nie jest certyfikatem |
| SOC 2 | nie wspomniano na przeglądanych stronach | brak | zapytać dostawcę |
| Region hostingu w USA | nie wspomniano na przeglądanych stronach | brak | zapytać dostawcę |

**Jak to odczytywać:** Certyfikacja ISO/IEC 27001 obejmuje system zarządzania organizacji w określonym zakresie. Podczas wyboru poproś o wgląd w certyfikat i sprawdź, czy rozwój i eksploatacja Polaris mieszczą się w zakresie oraz jak długo certyfikat jest ważny. TÜV SÜD to niemiecka jednostka badawcza i certyfikująca. "Zgodność z RODO" to samoocena; liczą się umowa o powierzeniu przetwarzania danych, lista podprzetwarzających oraz środki techniczne i organizacyjne. Jeśli Wasz zespół bezpieczeństwa wymaga raportu SOC 2 (sekcja 5.8), zapytajcie o to wcześnie; przeglądane strony wspominają wyłącznie o certyfikatach ISO. Jeśli potrzebujecie instalacji we własnym centrum danych: opcja lokalna (on-premises) nie jest wymieniona na przeglądanych stronach; FAQ wspomina wyłącznie o eksploatacji na europejskiej infrastrukturze chmurowej [3]. Dla firm z USA oznacza to również, że według przeglądanych stron dane są przechowywane poza USA; sprawdźcie to pod kątem umów z klientami, a w lotnictwie i obronności także pod kątem przepisów o kontroli eksportu.

## 17. Co dostawca obiecuje i jak to sprawdzić

Na stronie głównej jako wyniki podano redukcję czasu realizacji o "Up To 50%" (opisaną jako "Average decrease in production cycle time"), optymalizację wykorzystania zdolności o "Up To 40%" ("Improvement in machine utilization rates") oraz poprawę jakości o "Up To 25%" ("Reduction in schedule deviations and missed deadlines") [1]. Strona planowania podaje ponadto do 80 procent mniej ręcznego nakładu pracy przy planowaniu [13]. Dla żadnej z tych wartości nie opublikowano wartości wyjściowych, liczby projektów ani metody pomiaru. Zwróćcie uwagę na sformułowanie na stronie głównej: "Up To 50%" obok "Average decrease" łączy maksimum ze średnią, co jest kolejnym powodem, by zapytać, jak wyliczono tę wartość.

Takie deklaracje są na tym rynku powszechne. Siemens na przykład podaje dla Opcenter APS do 50 procent niższe zapasy i do 50 procent lepszą terminowość dostaw [36]. Takie wartości należy czytać jako górną granicę z pojedynczych przypadków, a nie jako wartość oczekiwaną, niezależnie od tego, który dostawca je podaje.

Jak zamienić obietnice w sprawdzalne stwierdzenia:

1. **Zapytajcie o obliczenia:** Jakie wartości wyjściowe i docelowe, w jakim okresie, u jakiego klienta, z jaką definicją czasu realizacji?
2. **Poproście o rozmowę referencyjną** z użytkownikiem z Waszej branży i typu produkcji, najlepiej z zakładem w USA, jeśli ma to dla Was znaczenie.
3. **Uzgodnijcie pilotaż z kryteriami zakończenia:** jeden strumień wartości, Wasze własne dane, wcześniej zdefiniowane wskaźniki i cele.
4. **Porównajcie plan z wykonaniem** w pilotażu: Czy harmonogramy z Optimizera utrzymują się na hali produkcyjnej? Jak często trzeba je przeplanowywać?
5. **Oceńcie nakład uczciwie:** Ile czasu zajęło uporządkowanie danych podstawowych, a ile integracja z systemami?

Te kroki testowe dotyczą w równym stopniu każdego dostawcy wymienionego w części A.

## 18. Dla kogo Polaris jest odpowiedni, a dla kogo nie

**Na podstawie opisu funkcji Polaris warto go rozważyć, jeśli**
- prowadzisz produkcję dyskretną lub montaż z wieloma wariantami, zestawieniami materiałowymi (BOM) i zasobami współdzielonymi,
- chcesz połączyć mapowanie strumienia wartości, symulację i harmonogramowanie na wspólnym modelu danych zamiast przenosić dane między narzędziami,
- chcesz zacząć od mapowania strumienia wartości bez integracji systemów, a harmonogramowanie i wykonanie dodać później,
- chcesz przyjrzeć się procesom biznesowym poza produkcją (wycenie, inżynierii, obsłudze zamówień) według tej samej logiki lean (BSM),
- rozwiązanie chmurowe hostowane w UE jest zgodne z Twoją polityką IT.

**Polaris jest prawdopodobnie słabszym wyborem, jeśli**
- mapy strumienia wartości dokumentujesz tylko sporadycznie; wtedy często wystarczy narzędzie do rysowania z szablonem (sekcja 3.1),
- potrzebujesz szczegółowej, trójwymiarowej symulacji przepływu materiałów z przenośnikami, robotyką lub uruchamianiem wirtualnym; do tego służą specjalistyczne narzędzia do symulacji (sekcja 3.3),
- działasz w przemyśle procesowym z recepturami i partiami, do których dostawca nie podaje referencji,
- wymagasz instalacji we własnym centrum danych lub w regionie hostingu w USA, a żadnego z tych rozwiązań nie opisano na przejrzanych stronach,
- raportu SOC 2 potrzebujesz jako warunku wstępnego, a przejrzane strony o nim nie wspominają,
- szukasz pełnego planowania łańcucha dostaw lub planowania wielu zakładów, czego strony poszczególnych modułów nie opisują,
- masz już APS i MES, które odpowiadają na Twoje pytania dotyczące harmonogramowania; wtedy osobno oceń wartość dodaną w porównaniu z czystym narzędziem VSM,
- przed sporządzeniem krótkiej listy wymagasz publicznych cen lub niezależnych ocen analityków.

**Alternatywy według kategorii:** do samej dokumentacji Visio, Lucidchart lub Miro [27][28][29]; dla strumieni wartości z metrykami i opcjonalną symulacją eVSM [42], SimVSM [30][31] lub visTable z kontekstem układu [32]; dla strumieni wartości z symulacją Plant Simulation X z biblioteką VSM [33]; do rekonstrukcji strumienia wartości opartej na danych ONIQ [35]; dla APS na przykład Opcenter APS [36]. To zestawienie służy orientacji, a nie rankingowi.

## 19. FAQ

### Czym jest oprogramowanie do mapowania strumienia wartości?
Oprogramowanie do mapowania strumienia wartości wspiera cyfrowo mapowanie strumienia wartości i projektowanie stanu przyszłego. Zakres obejmuje narzędzia do rysowania z symbolami lean, dedykowane narzędzia z automatycznym obliczaniem metryk i scenariuszami, aż po platformy zawierające symulację i harmonogramowanie produkcji (sekcja 3).

### Które oprogramowanie do mapowania strumienia wartości jest najlepsze?
Nie ma jednego najlepszego narzędzia, ponieważ kategorie odpowiadają na różne pytania. Do warsztatów i dokumentacji zwykle wystarczy narzędzie do rysowania z szablonem VSM. Do regularnej pracy nad strumieniem wartości z metrykami dobrze sprawdza się dedykowane narzędzie VSM. Przy zmienności i mixie produktów potrzebna jest symulacja, a przy terminach realizacji w warunkach ograniczeń — system APS. Skorzystaj z przewodnika decyzyjnego w sekcji 4 i listy kontrolnej w sekcji 6, a z zestawień przygotowanych przez dostawców lub przez nich finansowanych zachowaj ostrożność; dwie najdłuższe amerykańskie strony rankingowe dla tego hasła należą właśnie do takich kategorii [47][48].

### Czy istnieje darmowe oprogramowanie do mapowania strumienia wartości?
Tak, w kilku kategoriach. Narzędzia do rysowania i tablice typu whiteboard, takie jak Lucidchart i Miro, oferują bezpłatne poziomy wejściowe z kształtami lub szablonami VSM [28][29]. W iFAKT Polaris moduły VSM i BSM są dostępne w bezpłatnym poziomie bez karty kredytowej, zgodnie z FAQ [3]; dostawca nie opisuje szczegółowo zakresu tego poziomu. W przypadku każdej bezpłatnej oferty sprawdź limity użytkowników, możliwości eksportu i przechowywanie danych.

### Czy mogę wykonać mapowanie strumienia wartości w Excelu lub Visio?
Tak. Szablony w Excelu nadają się do małych map i prostych obliczeń, ale każdą zmianę trzeba przenosić ręcznie, a wersje szybko się mnożą (sekcja 2). Microsoft Visio ma szablon mapy strumienia wartości; według Microsoftu wymaga on Visio Professional (lub starszej edycji Premium) i nie jest dołączony do Visio Standard [27]. Ani Excel, ani Visio nie symulują zmienności.

### Czym różni się oprogramowanie do mapowania strumienia wartości od oprogramowania do symulacji?
Oprogramowanie do mapowania strumienia wartości zwykle liczy statycznie, na średnich: dni zapasu, czas realizacji, udział czasu wartości dodanej. Oprogramowanie do symulacji modeluje procesy w czasie, uwzględniając zmienność, awarie, mix produktów i zasoby współdzielone [22][33][37]. Porównanie dwóch map obok siebie nie jest symulacją.

### Worin besteht der Unterschied zwischen Wertstrommapping und Prozessmapping?
Eine Wertstromkarte verfolgt eine Produktfamilie über den gesamten Fluss vom Lieferanten bis zum Kunden und zeigt Materialfluss, Informationsfluss, Bestand und eine Durchlaufzeitlinie. Eine Prozesskarte (etwa ein Swimlane-Diagramm oder ein BPMN-Modell) zeigt die Schritte, Rollen und Entscheidungen eines einzelnen Prozesses im Detail. Beide können kombiniert werden: In Polaris deckt VSM die Wertströme ab und BSM die Swimlane-Prozesskarten [6][7].

### Ist "Value-Stream-Management-Software" dasselbe?
Nicht immer. In der Fertigung bedeutet Value Stream Management die laufende Steuerung entlang der Wertströme (ISO 22468 [39]). In der Softwareentwicklung messen Plattformen für „Value Stream Management" den Fluss von Arbeitselementen vom Ticket bis zur Bereitstellung. Mehrere US-Ranglisten vermischen beides [50]. Prüfen Sie, ob ein Tool Material, Bestand und Maschinen abdeckt, bevor Sie es in die engere Auswahl nehmen.

### Was ist iFAKT Polaris?
Eine modulare Softwareplattform der iFAKT GmbH (Stuttgart, Deutschland) zur Produktionsoptimierung, vom Wertstrommapping über Simulation und Feinplanung bis zur Shopfloor-Ausführung und Berichterstattung. Laut Anbieter besteht sie aus sieben Modulen mit einem gemeinsamen Datenmodell: VSM, BSM, Designer, Simulator, Optimizer, Operator und Analyzer [3].

### Was ist Polaris IMS?
Unter dem Namen Polaris IMS belegte iFAKT beim Best of Technology Award 2025 des deutschen Wirtschaftsmagazins WirtschaftsWoche den zweiten Platz in der Kategorie Produktion [18]. Die Jurybeschreibung nennt einen digitalen Zwilling der Produktion, automatisierte Ressourcenplanung, Shopfloor-Ausführung mit Echtzeitüberwachung und KI-Vorschläge bei Störungen [18][19]. Auf der aktuellen Website verteilt sich dieser Umfang auf die Module Designer, Simulator, Optimizer und Operator (Abschnitt 13; die Zuordnung ist die Interpretation des Autors).

### Kann Polaris VSM simulieren?
Die Modulseite von Polaris VSM beschreibt Szenarien, Sensitivitätsanalysen und Kennzahlenvergleiche, aber keine dynamische Simulation [6]. Simulation bietet das separate Modul Simulator, das auf dem Produkt-Prozess-Ressourcen-Modell des Designers arbeitet [9].

### Welche Daten braucht Polaris, und muss ich mein ERP anbinden?
Für VSM und BSM nicht: Laut Anbieter ist zum Start keine Systemintegration nötig [3]. Simulation und Feinplanung benötigen Daten zu Produkten, Stücklisten, Prozesszeiten und Ressourcen; für Tests per Datei, Excel oder ERP-Export, im Produktivbetrieb durch kontinuierliche Synchronisation mit ERP, MES oder anderen Systemen [13]. Laut FAQ gibt es Standardschnittstellen zu SAP und Microsoft Dynamics [3].

### Ist Polaris mit Microsoft 365 oder Teams integriert?
Dokumentiert sind AppSource-Einträge für Polaris VSM und BSM [15][16], ein Beitrag in der Microsoft Tech Community [17] und das Hosting von VSM und BSM auf Microsoft Azure West Europe laut den Modulseiten [6][7]. Eine Integration mit Teams oder Power BI wird auf den geprüften Seiten nicht erwähnt.

### Wo wird Polaris gehostet, und hat iFAKT SOC 2?
Die VSM- und BSM-Seiten nennen Microsoft Azure West Europe [6][7], eine Region in den Niederlanden [43]; die FAQ spricht von europäischer Cloud-Infrastruktur [3]. Die Website nennt die Zertifizierung nach ISO 9001 (seit Oktober 2014) und ISO/IEC 27001 durch TÜV SÜD [1][3][4]. Ein SOC-2-Bericht und eine US-Hosting-Region werden auf den geprüften Seiten nicht erwähnt. Fordern Sie die Zertifikate mit Geltungsbereich an und fragen Sie gezielt nach SOC 2, falls Ihr Sicherheitsteam es verlangt.

### Wie lange dauert die Einführung?
Laut Anbieter brauchen VSM und BSM keine Einrichtung; für Simulation und Feinplanung nennt die FAQ eine übliche Einarbeitungszeit von zwei bis vier Wochen, einschließlich Datenintegration, Modellkonfiguration und Schulung [3]. Die tatsächliche Dauer hängt vor allem von der Qualität der Stammdaten und den Schnittstellen ab.

### Was kostet Polaris?
Der Anbieter veröffentlicht keine Preise. Der AppSource-Eintrag für BSM nennt Pläne von „Read Only" bis „Integrate & Customize" ohne Preise [16]; für Simulator, Optimizer und Operator bietet die FAQ eine Demo mit Testzugang [3].

### Welche Alternativen gibt es zu Polaris?
Das hängt von der Kategorie ab: Zeichenwerkzeuge wie Visio, Lucidchart oder Miro zur Dokumentation [27][28][29]; spezialisierte Werkzeuge wie eVSM, SimVSM oder visTable [42][30][32]; Simulation mit Plant Simulation, AnyLogic oder FlexSim [33][34]; datengetriebene Ansätze wie ONIQ [35]; und APS-Systeme wie Opcenter APS [36]. Abschnitt 4 vergleicht die Kategorien.

## 20. Podsumowanie

Jeśli wybierasz oprogramowanie do mapowania strumienia wartości, nie zaczynaj od nazw produktów; zacznij od pytania, na które oprogramowanie ma odpowiedzieć. Dokumentowanie, regularna ocena z wykorzystaniem metryk, symulacja dynamiczna, harmonogramowanie z uwzględnieniem ograniczeń oraz bieżąca analiza rzeczywistych danych to różne zadania, realizowane przez różne kategorie oprogramowania. Lista kontrolna wyboru z sekcji 6 oraz logika uzasadnienia biznesowego z sekcji 9 pomogą Ci porównywać oferty bez opierania się na liczbach z broszur. Dla nabywców z USA warto na wczesnym etapie dodać do listy region hostingu, zakres SOC 2 lub ISO/IEC 27001 oraz, jeśli dotyczy, kontrolę eksportu.

iFAKT Polaris to jedna z platform łączących kilka kategorii na wspólnym modelu danych: analiza strumienia wartości i procesów (VSM, BSM), modelowanie produkt-proces-zasób (Designer), symulacja, harmonogramowanie z uwzględnieniem ograniczeń (Optimizer), zarządzanie zadaniami na hali produkcyjnej (Operator) oraz raportowanie (Analyzer). Co można zweryfikować: opisy funkcji na stronach producenta, dwie listy w AppSource, wpis na Microsoft Tech Community, drugie miejsce w kategorii Production w rankingu Best of Technology Award 2025, współpracę badawczą ECOWERT z Fraunhofer IPA oraz serię artykułów w czasopiśmie ZWF obejmującą dwanaście lat. Nieudokumentowane: dane o korzyściach z ujawnioną metodologią, symulacja w module VSM, integracja z Teams lub Power BI, region hostingu w USA, raport SOC 2 oraz publiczne cenniki.

Dla producentów dyskretnych o wielu wariantach, którzy chcą przejść od strumienia wartości do harmonogramu, Polaris — na podstawie opisu funkcji — jest kandydatem do pilotażu. Do czystej dokumentacji, trójwymiarowej symulacji przepływu materiałów lub branż procesowych lepiej pasują inne kategorie. W każdym przypadku decyduj na podstawie pilotażu z własnymi danymi i z metrykami zdefiniowanymi z wyprzedzeniem, a nie na podstawie tego lub jakiegokolwiek innego tekstu.

## Dalsza lektura na m365.fm

**Podmioty**
- [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [Business Application](https://www.m365.fm/entity/business-application/)
- Moduły: [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)
- Osoby: [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Wpisy i odcinki**
- [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- Podcast: [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Kompendia**
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Gastgeber von m365.fm und arbeitet bei iFAKT GmbH. Auf m365.fm schreibt er über Wertstrommanagement, Produktionsplanung und die digitale Transformation der Fertigung im Microsoft-Ökosystem.

> **Hinweis: Der Autor arbeitet bei iFAKT GmbH.**

*iFAKT GmbH ([Entitätsseite](https://www.m365.fm/entity/ifakt/)) ist der Anbieter von iFAKT Polaris.*

# Sources

All online sources retrieved on November 20, 2026. Titles of German-language sources are given in the original, with a translation in parentheses where helpful.

1. iFAKT GmbH: Polaris (home page, English). https://www.ifakt.de/en
2. iFAKT GmbH: Polaris (home page, German). https://www.ifakt.de/de
3. iFAKT GmbH: FAQ. https://www.ifakt.de/en/faq
4. iFAKT GmbH: About iFAKT (company page). https://www.ifakt.de/en/company/
5. iFAKT GmbH: Impressum (legal notice): iFAKT GmbH, Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart, HRB 22661. https://www.ifakt.de/de/imprint
6. iFAKT GmbH: Polaris VSM, Value Stream Mapping Software (module page, English and German). https://www.ifakt.de/en/solutions/value-stream-mapping-software · https://www.ifakt.de/de/solutions/value-stream-mapping-software
7. iFAKT GmbH: Polaris BSM, Business Swim Lane Modelling (module page). https://www.ifakt.de/en/solutions/business-swimlane-modelling
8. iFAKT GmbH: Polaris Designer (module page). https://www.ifakt.de/en/solutions/designer
9. iFAKT GmbH: Polaris Simulator (module page). https://www.ifakt.de/en/solutions/simulator
10. iFAKT GmbH: Polaris Optimizer (module page). https://www.ifakt.de/en/solutions/optimizer
11. iFAKT GmbH: Polaris Operator (module page). https://www.ifakt.de/en/solutions/operator
12. iFAKT GmbH: Polaris Analyzer (module page). https://www.ifakt.de/en/solutions/analyzer
13. iFAKT GmbH: Planning & Execution, AI-powered production planning and scheduling (application page). https://www.ifakt.de/en/software/ims/
14. iFAKT GmbH: Polaris VSM, Digital Value Stream Tool in Lean Management (product page). https://www.ifakt.de/en/software/vsm/
15. Microsoft AppSource: Polaris VSM - Digital Value Stream Mapping (iFAKT GmbH). https://appsource.microsoft.com/en-us/product/web-apps/ifaktgmbh.ifakt_vsm_1?tab=Overview
16. Microsoft AppSource: Polaris BSM - Business Swimlane Modeling (iFAKT GmbH). https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
17. Microsoft Tech Community, Marketplace Blog: Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
18. WirtschaftsWoche: Best of Technology Award, Gewinner 2025 (winners 2025), category Produktion (Production). https://award.wiwo.de/bot/gewinner-2025/
19. WirtschaftsWoche: Best of Technology Award, Finalisten 2025 (finalists 2025). https://award.wiwo.de/bot/finalisten-2025/
20. LeanBase: Lean Around The Clock 2025, sponsor iFAKT GmbH. https://leanbase.de/latc/sponsors/2025-ifakt
21. Drees, J.; Sack, C.: Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
22. Türck, S.; Weimer, A.; Schubert, L.; Drees, J.: Dynamische Simulation von Wertströmen. ZWF 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html
23. Drees, J.: Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
24. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
25. Fraunhofer IPA: Die Wertstromanalyse wird ins digitale Zeitalter übertragen (value stream analysis is moving into the digital age), press release, July 5, 2022. https://www.ipa.fraunhofer.de/de/presse/presseinformationen/die-wertstromanalyse-wird-ins-digitale-zeitalter-uebertragen.html (an AI-translated English republication exists at reinraum.de: https://www.reinraum.de/en/news/the-value-stream-analysis-is-being-transferred-into-the-digital-age.html)
26. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen (capturing value stream data automatically). IT&Production, January 12, 2023. https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/
27. Microsoft Support: Create a value stream map (Visio). https://support.microsoft.com/en-us/visio/create-a-value-stream-map
28. Lucid Software: Value stream mapping symbols and icons (Lucidchart VSM shape library). https://lucid.co/diagram/vsm/value-stream-mapping-symbols
29. Miro: Value stream mapping templates. https://miro.com/templates/value-stream-map
30. SimPlan AG: SimVSM, Wertstromanalyse und Simulation in einer App (German product page). https://www.simplan.de/software/simvsm/
31. SimPlan AG: Digital value stream mapping and analysis as the key to informed decisions (English). https://www.simplan.de/en/from-paper-to-digital-value-stream/
32. visTable GmbH: Wertstromanalyse Software (German product page). https://www.vistable.com/de/solutions/wertstromanalyse-software/
33. Siemens: Plant Simulation X value stream mapping (VSM library). https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/
34. Wikipedia: List of discrete event simulation software (entries AnyLogic, FlexSim, Plant Simulation). https://en.wikipedia.org/wiki/List_of_discrete_event_simulation_software
35. PwC Store: ONIQ value stream analysis (English). https://store.pwc.de/en/products/oniq-value-stream-analysis
36. Siemens: Opcenter Advanced Planning and Scheduling (APS). https://www.siemens.com/en-us/products/opcenter/advanced-planning-scheduling-aps/
37. ATS Pro / Simio: Wertstromanalyse und Simulation im Vergleich (value stream mapping vs. simulation, German). https://simio-simulation.de/simulation-vs-wertstromanalyse-vsm
38. Microsoft Tech Community (News from Microsoft Norway): Silver and Gold competency partners, guidance on renewal, April 28, 2023. https://techcommunity.microsoft.com/blog/newsfrommicrosoftnorway/silver-and-gold-competency-partners---guidance-on-renewal/3808345
39. ISO 22468:2020 Value stream management (VSM). International Organization for Standardization. https://committee.iso.org/standard/73292.html?browse=ics
40. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (bibliographic data taken from the m365.fm Value Stream Mapping compendium).
41. Lean Enterprise Institute: Learning to See, by Mike Rother and John Shook (book page). https://www.lean.org/store/book/learning-to-see/
42. G2: eVSM product listing and reviews (vendor description "a complete lean toolkit to map, model and improve value streams of every type"). https://www.g2.com/products/evsm/reviews
43. Microsoft Learn: List of Azure regions (West Europe: Netherlands). https://learn.microsoft.com/azure/reliability/regions-list
44. NIST: NIST Releases Version 2.0 of Landmark Cybersecurity Framework, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
45. AICPA & CIMA: SOC 2 Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy (guide). https://www.aicpa-cima.com/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy
46. Wikipedia: Value-stream-mapping software. https://en.wikipedia.org/wiki/Value-stream-mapping_software
47. Lean Transition Solutions (Data Point): 7 Best Value Stream Mapping software for Manufacturing & Operations Teams (2026) (competitor, vendor-written). https://leandatapoint.com/blog/best-value-stream-mapping-software-for-manufacturing
48. Gitnux: Top 10 Best Value Stream Mapping Software of 2026 (competitor, labeled commissioned research). https://gitnux.org/best/value-stream-mapping-software/
49. ClickUp: 10 Value Stream Mapping Software to Improve Processes in 2026 (competitor, vendor-written). https://clickup.com/blog/value-stream-mapping-software/
50. Project-Management.com: Top Value Stream Mapping Tools & Software (competitor). https://project-management.com/value-stream-mapping-tools-software/
51. Lucidchart: Value stream mapping software (competitor, product page). https://www.lucidchart.com/pages/landing/value_stream_mapping
