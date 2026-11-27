# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software do planowania produkcji: przewodnik APS (2026) |
| Meta description | Software do planowania produkcji i APS wyjaśnione: skończona zdolność, wąskie gardła, drum-buffer-rope, EOQ, zapas bezpieczeństwa, przykłady i lista kontrolna. |
| Slug | `production-scheduling-aps` |

# Software do planowania produkcji i APS: kompletny przewodnik po harmonogramach, które utrzymują się na hali produkcyjnej

> **Krótka odpowiedź:** Oprogramowanie do planowania produkcji z APS (advanced planning and scheduling, zaawansowane planowanie i harmonogramowanie) planuje zlecenia produkcyjne jednocześnie względem skończonej zdolności produkcyjnej i dostępnego materiału. Klasyczna logika MRP w systemie ERP zakłada nieograniczoną zdolność i stałe terminy realizacji. APS modeluje maszyny, ludzi, narzędzia, przezbrojenia, zmiany i wąskie gardła, więc sekwencja i terminy, które tworzy, są terminami, których zakład może rzeczywiście dotrzymać.

Poniedziałkowy poranek w dziale kontroli produkcji. Weekendowe uruchomienie MRP utworzyło 140 zleceń produkcyjnych z datą startu „w tym tygodniu". Gniazdo obróbki skrawaniem ma na karku prawie dwa tygodnie pracy, montaż czeka na części, a dział sprzedaży chce terminu wysyłki, którego nikt nie może poważnie potwierdzić. Harmonogram jest więc przebudowywany: w Excelu, na tablicy, w rozmowie na korytarzu z brygadzistą. Do środy znów jest nieaktualny.

Jeśli to brzmi znajomo, przyczyną rzadko jest brak dyscypliny. Chodzi o logikę planowania. Planowanie potrzeb materiałowych (MRP, material requirements planning) zostało zbudowane po to, by odpowiedzieć na jedno pytanie: *Jakiego materiału potrzebuję i kiedy?* Na pytanie *Czy mój zakład faktycznie może wykonać tę pracę w tej kolejności?* odpowiada tylko w przybliżeniu albo wcale. Do tego drugiego pytania służą szczegółowe harmonogramowanie i APS.

Ten przewodnik omawia podstawy planowania i sterowania produkcją, strukturalne słabości MRP, fizykę fabryki, sposób działania systemów APS, teorię ograniczeń (TOC) i metodę bufor-bęben-lina (DBR), elementy lean takie jak heijunka i równoważenie linii, klasyczne wzory na wielkość partii i zapas bezpieczeństwa wraz z przykładami obliczeń oraz wybór i wdrożenie oprogramowania do harmonogramowania produkcji z możliwościami APS. Krótką definicję znajdziesz na stronie pojęcia m365.fm [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/).

### Kluczowe wnioski

- **ERP planuje materiał, APS planuje wykonalność.** Logika MRP w ERP, w swojej podstawowej postaci, zakłada nieograniczoną zdolność i stałe planowane terminy realizacji. APS harmonogramuje przy skończonej zdolności i dostępności materiału jednocześnie.
- **Czas realizacji to głównie czas oczekiwania.** Prawo Little'a mówi, że czas cyklu = praca w toku ÷ przepustowość [9]. Ogranicz WIP bez głodzenia wąskiego gardła, a czas realizacji się skróci.
- **Wysokie wykorzystanie kosztuje czas.** Czas w kolejce rośnie wraz z czynnikiem u/(1−u), a nie liniowo. Przy 95% wykorzystania czekanie trwa prawie pięciokrotnie dłużej niż przy 80% [10][11].
- **Wąskie gardło wyznacza tempo.** Teoria ograniczeń (TOC) i metoda bufor-bęben-lina (DBR) dostosowują zwalnianie zleceń i sekwencjonowanie do ograniczenia [1][2].
- **Klasyczne wzory to punkt wyjścia, a nie prawda objawiona.** Ekonomiczna wielkość zamówienia (EOQ) i wzór na zapas bezpieczeństwa opierają się na uproszczonych założeniach. Krzywa kosztów EOQ jest płaska, a czas przezbrojenia zwykle jest większą dźwignią.
- **APS jest tak dobry, jak jego dane główne.** Marszruty, normy czasowe, macierze przezbrojeń i kalendarze zdolności produkcyjnej decydują o jakości harmonogramu bardziej niż sam algorytm.

### Od czego zacząć, według roli

| Jesteś … | Przeczytaj najpierw |
|---|---|
| Planistą produkcji lub harmonogramistą, który pracuje z nierealistycznymi harmonogramami z ERP | Sekcje 3, 4 i 5 (słabości MRP, fizyka fabryki, jak działa APS) |
| W kontroli produkcji, inżynierii produkcji lub kierownictwie hali produkcyjnej | Sekcje 7 i 8 (wąskie gardło, DBR, takt, heijunka) |
| W łańcuchu dostaw, planowaniu materiałów lub zapasów | Sekcje 9 i 10 (wielkość partii, zapas bezpieczeństwa) |
| Prowadzisz wybór lub wdrożenie APS | Sekcje 13–16 (wybór, dane, plan wdrożenia, błędy) |
| Dyrektorem zakładu lub kadrą kierowniczą operacji | Krótka odpowiedź, Sekcja 11 (KPI) i Sekcja 21 (Podsumowanie) |

## Spis treści

1. [Dlaczego harmonogramy z ERP zawodzą na hali produkcyjnej](#1-dlaczego-harmonogramy-z-erp-zawodzą-na-hali-produkcyjnej)
2. [Podstawy: co obejmuje planowanie i sterowanie produkcją](#2-podstawy-co-obejmuje-planowanie-i-sterowanie-produkcją)
3. [Słabe strony klasycznej logiki MRP](#3-słabości-klasycznej-logiki-mrp)
4. [Fizyka fabryki: prawo Little'a, krzywe operacyjne i zmienność](#4-fizyka-fabryki-prawo-littlea-krzywe-operacyjne-i-zmienność)
5. [Czym jest system APS i jak liczy](#5-czym-jest-system-aps-i-jak-oblicza)
6. [ERP vs. APS vs. MES](#6-erp-vs-aps-vs-mes)
7. [Teoria ograniczeń, drum-buffer-rope i zarządzanie buforami](#7-teoria-ograniczeń-drum-buffer-rope-i-zarządzanie-buforami)
8. [Elementy Lean w harmonogramowaniu: takt, heijunka, równoważenie linii, pull](#8-elementy-lean-w-szeregowaniu-takt-heijunka-równoważenie-linii-pull)
9. [Wielkość partii: EOQ, przykład liczbowy i ograniczenia](#9-wielkość-partii-eoq-przykład-liczbowy-i-ograniczenia)
10. [Zapas bezpieczeństwa: wzór i przykład liczbowy](#10-zapas-bezpieczeństwa-wzór-i-przykład-liczbowy)
11. [KPI planowania produkcji](#11-wskaźniki-kpi-planowania-produkcji)
12. [Cyfrowy bliźniak i symulacja](#12-cyfrowy-bliźniak-i-symulacja)
13. [Jak wybrać oprogramowanie do harmonogramowania produkcji: kryteria i lista kontrolna](#13-jak-wybrać-oprogramowanie-do-harmonogramowania-produkcji-kryteria-i-lista-kontrolna)
14. [Wymagania dotyczące danych i jakość danych bazowych](#14-wymagania-dotyczące-danych-i-jakość-danych-głównych)
15. [Plan wdrożenia APS](#15-plan-wdrożenia-aps)
16. [Typowe błędy i jak ich unikać](#16-typowe-błędy-i-jak-ich-unikać)
17. [Dowody: co raportują badania i użytkownicy](#17-dowody-co-podają-badania-i-użytkownicy)
18. [Planowanie oparte na ograniczeniach z iFAKT Polaris](#18-planowanie-oparte-na-ograniczeniach-z-ifakt-polaris)
19. [Słowniczek](#19-glosariusz)
20. [FAQ: oprogramowanie do harmonogramowania produkcji i APS](#20-faq-oprogramowanie-do-harmonogramowania-produkcji-i-aps)
21. [Podsumowanie](#21-zakończenie)

## 1. Dlaczego harmonogramy z ERP zawodzą na hali produkcyjnej

Większość producentów planuje produkcję w systemie ERP i ma ku temu dobry powód: tam znajdują się zamówienia klientów, struktury wyrobów, marszruty i stany magazynowe. System [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) jest systemem źródłowym dla ilości, wartości i terminów. Logika planowania wbudowana w większość systemów ERP opiera się jednak na metodzie opracowanej w latach 60. i 70. XX wieku, udokumentowanej przez Josepha Orlicky'ego w jego standardowym podręczniku z 1975 roku: planowaniu potrzeb materiałowych (MRP) [24].

Planiści rozpoznają objawy w chwili, gdy ta logika dochodzi do swoich granic:

- **Przeciążone gniazda robocze na papierze:** ERP wpisuje zlecenia w tydzień, w którym zdolność gniazda dawno się wyczerpała.
- **Terminy wysyłek ustalane na wyczucie:** Terminy obietnicy opierają się na standardowych czasach realizacji, a nie na bieżącym obciążeniu.
- **Równoległe harmonogramowanie w Excelu:** Rzeczywisty szczegółowy harmonogram żyje poza ERP, w arkuszach kalkulacyjnych, na tablicach lub w głowach doświadczonych brygadzistów.
- **Pilne zlecenia wypychają resztę:** Każde przyspieszenie tworzy nowe spóźnione zamówienia w innym miejscu.
- **Wysokie zapasy i mimo to braki:** Na hali jest mnóstwo materiału, tylko nie tego, którego montaż potrzebuje w danej chwili.
- **Planiści jako strażacy:** Znaczna część tygodnia idzie na przeplanowywanie zamiast na planowanie.

Jak powszechne jest to zjawisko, pokazuje badanie, które IDC przeprowadziło na zlecenie dostawcy oprogramowania planistycznego Kinaxis. IDC zbadało ponad 1800 liderów łańcucha dostaw w dziewięciu krajach, w tym w USA i Kanadzie, w grudniu 2023 roku; 83% stwierdziło, że ich organizacja nie jest w stanie zareagować na zakłócenie w łańcuchu dostaw w ciągu 24 godzin [32]. Wśród 200 respondentów z Niemiec niemiecki dziennik branżowy Logistik Heute podał, że 37% polegało wyłącznie na Excelu lub na Excelu połączonym z samodzielnymi narzędziami przy planowaniu łańcucha dostaw, a 89% nie mogło zareagować na zakłócenia w ciągu 24 godzin [25]. Badanie jest finansowane przez dostawcę i obejmuje planowanie łańcucha dostaw ogólnie, a nie harmonogramowanie na hali produkcyjnej konkretnie, a opublikowany komunikat nie podaje liczby dotyczącej arkuszy kalkulacyjnych właściwej dla USA. Mimo to pokazuje skalę problemu.

Dobra wiadomość: przyczyny są dobrze poznane. Leżą w trzech obszarach, które ten przewodnik omawia po kolei: w logice planowania (Rozdział 3), w fizyce kolejek i zapasów (Rozdział 4) oraz w brakującym skupieniu na wąskim gardle (Rozdział 7). Krótsza wersja pierwszego argumentu znajduje się we wpisie m365.fm [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/).

## 2. Podstawy: co obejmuje planowanie i sterowanie produkcją

### 2.1 Definicje

**Planowanie i sterowanie produkcją (PPC, production planning and control)** obejmuje wszystkie zadania, za pomocą których firma decyduje, *co*, *ile*, *kiedy* i *gdzie* produkować, oraz uruchamia i monitoruje realizację. Planowanie tworzy cele; sterowanie realizuje je na hali produkcyjnej i reaguje na odchylenia. W praktyce amerykańskiej ten sam zakres często nazywa się manufacturing planning and control (MPC). Wiedzę fachową utrzymuje ASCM, Association for Supply Chain Management, w ramach certyfikatu APICS CPIM, którego moduły obejmują planowanie sprzedaży i operacji (S&OP), zaopatrzenie wewnętrzne, zapasy i szczegółowe harmonogramy [33].

Dwa pojęcia regularnie wprowadzają zamieszanie: **planowanie** i **szeregowanie**. Planowanie (planowanie zgrubne lub agregatowe) operuje zagregowanymi ilościami, tygodniowymi lub miesięcznymi okresami oraz grupami gniazd produkcyjnych. **Szczegółowe szeregowanie** decyduje dla każdej pojedynczej operacji, na którym zasobie się ona wykona, w jakiej kolejności i o jakiej godzinie. Pracuje w dniach, zmianach lub minutach i stanowi istotę tego, co robi system APS. Praktyka niemiecka używa pary *Grobplanung* i *Feinplanung* dla tego samego rozróżnienia; określenie „Feinplanung” spotkasz w niemieckiej literaturze producentów.

### 2.2 Poziomy planowania w skrócie

Literatura organizuje planowanie hierarchicznie: od długoterminowego planu sprzedaży i zdolności produkcyjnych aż po kolejność na pojedynczej maszynie [7][12]. Tabela podsumowuje poziomy. Horyzonty są typowymi rzędami wielkości i różnią się w zależności od branży i typu produkcji.

| Poziom | Typowy horyzont | Kluczowe pytanie | Wynik | Typowy system |
|---|---|---|---|---|
| Planowanie sprzedaży i operacji (S&OP) | 12 do 24 miesięcy | Co sprzedamy i jakie zdolności produkcyjne są potrzebne? | Plan sprzedaży i zdolności wg rodzin produktów | ERP, narzędzia planistyczne, Excel |
| Główny harmonogram produkcji (MPS) | tygodnie do miesięcy | Które wyroby gotowe budujemy, kiedy i w jakiej ilości? | Popyt niezależny, program produkcji | ERP |
| Planowanie potrzeb materiałowych (MRP) | tygodnie | Jakich podzespołów, części i surowców potrzebujemy i kiedy? | Popyt zależny, zlecenia planowane, zapotrzebowania zakupowe | ERP |
| Planowanie potrzeb zdolności produkcyjnych (CRP) | dni do tygodni | Kiedy wykonywane są operacje i czy zdolności wystarczają? | Terminy kamieni milowych, obciążenie zdolności | ERP (zgrubnie), APS (precyzyjnie) |
| Szczegółowe szeregowanie | godziny do dni, z przesunięciem na kilka tygodni | Która operacja wykonywana jest na którym zasobie i w jakiej kolejności? | Harmonogram zasobów, kolejność (wykres Gantta) | APS, moduł szeregowania MES, tablica planistyczna |
| Kontrola bieżąca produkcji / dyspozycja | zmiana do minut | Które zlecenie zostaje uruchomione i co się dzieje, gdy coś się zepsuje? | Zwolnienia, potwierdzenia, wyzwalacze przeplanowania | MES, APS, hala produkcyjna |

Hermann Lödding, niemiecki badacz sterowania produkcją, dzieli sterowanie produkcją na cztery zadania: generowanie zleceń, zwalnianie zleceń, kontrolę zdolności i szeregowanie [12]. Ten podział jest użyteczny, ponieważ pokazuje, że sam dobry harmonogram nie wystarcza. Decyzja o tym, *kiedy* zlecenie wchodzi na halę, często wpływa na WIP i czas realizacji bardziej niż kolejność na jednej maszynie.

### 2.3 Modele referencyjne: ISA-95, ASCM i model PPC z Akwizgranu

Amerykańscy producenci zazwyczaj orientują się na dwa układy odniesienia. Hierarchia planowania ASCM/APICS pokazana w tabeli powyżej (S&OP, MPS, MRP, CRP, szczegółowe szeregowanie, realizacja) jest wspólnym językiem planistów i specjalistów łańcucha dostaw [33]. ANSI/ISA-95 (opublikowana międzynarodowo jako IEC 62264) wyznacza granicę między planowaniem biznesowym a logistyką (poziom 4, zazwyczaj ERP) a zarządzaniem operacjami produkcyjnymi (poziom 3, zazwyczaj MES i szeregowanie). Część 3, ANSI/ISA-95.00.03-2013, opisuje modele czynności zarządzania operacjami produkcyjnymi i definiuje szeregowanie z uwzględnieniem skończonej zdolności jako metodę, w której prace są szeregowane dla zbioru zasobów produkcyjnych tak, że żadna zaplanowana zdolność nie przekracza dostępnej zdolności [31].

W krajach niemieckojęzycznych dominującym modelem referencyjnym jest **model PPC z Aachen** (*Aachener PPS-Modell*) opracowany przez instytut FIR przy Uniwersytecie RWTH Aachen. Jest opisany w kilku wydaniach standardowego niemieckiego podręcznika *Produktionsplanung und -steuerung*; czwarte wydanie zredagowali Günther Schuh i Volker Stich w 2012 roku [7]. Model grupuje zadania planowania i sterowania w trzy kategorie:

- **Zadania sieciowe:** strategiczne projektowanie sieci produkcyjnej, takie jak decyzje o lokalizacji zakładów i wyborze dostawców.
- **Zadania główne:** zadania, które przesuwają zlecenie do przodu, a mianowicie planowanie programu produkcji, planowanie potrzeb produkcyjnych, planowanie i sterowanie produkcją własną oraz planowanie i sterowanie zakupami zewnętrznymi.
- **Zadania przekrojowe:** zarządzanie zleceniami, zarządzanie zapasami i controlling, które integrują funkcje i optymalizują je w poprzek.

Wartość wszystkich trzech ram koncepcyjnych tkwi w czytelnym rozdzieleniu zadań. Pomagają one odpowiedzieć na pytanie, który system powinien być odpowiedzialny za które zadanie: ERP zwykle obejmuje planowanie programu i potrzeb, APS obejmuje szczegółowe harmonogramowanie produkcji własnej, a MES obejmuje realizację i potwierdzenia.

### 2.4 Od MRP do MRP II i APS

Historia systemów planowania wyjaśnia wiele dzisiejszych problemów:

1. **Punkty ponownego zamówienia i wzory na wielkość partii (od 1913 r.):** Ford Whitman Harris opublikował wzór na ekonomiczną wielkość partii w 1913 roku [17]. W krajach niemieckojęzycznych stał się znany dzięki Kurtowi Andlerowi (1929) i nadal nosi tam nazwę *wzór Andlera* [18].
2. **MRP (lata 60. i 70. XX wieku):** Komputery umożliwiły rozwinięcie popytu przez struktury wyrobów i przesunięcie go w czasie o planowane terminy realizacji. Orlicky opisał tę metodę wszechstronnie w 1975 roku [24].
3. **MRP II (początek lat 80.):** Planowanie zasobów produkcyjnych dodało planowanie harmonogramu głównego, planowanie zdolności produkcyjnych w zarysie, planowanie potrzeb zdolności produkcyjnych (CRP) oraz powiązanie z planowaniem finansowym. Sprawdzenie zdolności produkcyjnych pozostało jednak krokiem następczym: najpierw harmonogram, potem prezentacja obciążenia [10].
4. **ERP (lata 90.):** Systemy ERP zintegrowały finanse, sprzedaż, zakupy i kadry. Rdzeń planowania często pozostawał MRP II.
5. **APS (od lat 90.):** Zaawansowane systemy planowania atakują późne sprawdzanie zdolności produkcyjnych, planując materiały i zdolności łącznie za pomocą metod optymalizacyjnych. Nie zastępują ERP; dodają planowanie uwzględniające skończone zdolności produkcyjne [13].

## 3. Słabości klasycznej logiki MRP

Logika MRP nie jest błędna. Do ustalania, jakie materiały są potrzebne i w jakiej ilości, jest niezastąpiona. Problem pojawia się wtedy, gdy jej wynik jest wykorzystywany bez weryfikacji jako harmonogram produkcji. Wallace Hopp i Mark Spearman krytykują w *Factory Physics*, że podstawowy model MRP zakłada stałe czasy realizacji, które nie zależą od obciążenia. Stałe czasy realizacji byłyby jednak możliwe tylko przy nieograniczonej zdolności produkcyjnej [10].

### 3.1 Nieskończona zdolność produkcyjna

MRP planuje każde zlecenie planowane, cofając planowany czas realizacji od terminu zakończenia. Nie sprawdza, czy gniazdo robocze jest wolne w tym czasie. Nazywa się to **planowaniem przy nieskończonej zdolności produkcyjnej**. Następujące po nim planowanie potrzeb zdolności produkcyjnych (CRP) pokazuje przeciążenia, ale ich nie rozwiązuje. Pozostaje to w gestii planisty.

**Przykład: przeciążenie, którego MRP nie widzi**

Centrum obróbcze pracuje na dwie zmiany, pięć dni w tygodniu, po 8 godzin na zmianę: 80 godzin zdolności produkcyjnej tygodniowo. Przebieg MRP tworzy takie obciążenie:

| Tydzień | Zdolność (h) | Obciążenie MRP (h) | Różnica (h) | Obciążenie |
|---|---|---|---|---|
| Tydzień 12 | 80 | 112 | −32 | 140% |
| Tydzień 13 | 80 | 54 | +26 | 68% |
| Tydzień 14 | 80 | 96 | −16 | 120% |
| **Razem** | **240** | **262** | **−22** | **109%** |

Nawet jeśli planista idealnie wyrówna obciążenie i przeniesie pracę z tygodnia 12 do tygodnia 13, w ciągu trzech tygodni pozostanie 22 godziny pracy, której nie da się wykonać. Trzeba wtedy zaplanować nadgodziny, outsourcing lub alternatywną maszynę, albo przynajmniej jedno zlecenie zakończy się z opóźnieniem. ERP nadal jednak pokazuje każde zlecenie z pierwotnym terminem, a sprzedaż przyjmuje terminy wysyłek właśnie na tej podstawie. APS zaplanowałby zlecenia w ramach 80 godzin tygodniowo i podałby najwcześniejszy realistyczny termin zakończenia.

### 3.2 Stałe planowane czasy realizacji

Drugie założenie to **stały planowany czas realizacji** dla pozycji lub trasy, na przykład „frezowanie: 5 dni roboczych”. W rzeczywistości czas realizacji silnie zależy od bieżącego obciążenia, jak pokazuje rozdział 4. Gdy warsztat jest pusty, zlecenie przechodzi przez produkcję w dwa dni. Gdy jest pełny, zajmuje dwa tygodnie. Stała wartość jest więc prawie zawsze albo zbyt długa (skutek: wysokie zapasy, przedwczesne zwolnienie zleceń), albo zbyt krótka (skutek: spóźnione zlecenia).

Planowany czas realizacji zawiera zwykle także dużą część czasu przemieszczania i oczekiwania w kolejce. Peter Nyhuis i Hans-Peter Wiendahl z Uniwersytetu Leibniza w Hanowerze rozróżniają czas operacji (przygotowanie i obróbka) oraz czas międzyoperacyjny (oczekiwanie przed i po obróbce oraz transport) [8]. W warsztatach typu job shop czas międzyoperacyjny stanowi zwykle większą część. Wpisanie tego czasu oczekiwania do danych podstawowych jako stałej wartości utrwala go.

### 3.3 Syndrom czasu realizacji

Co się dzieje, gdy planiści, reagując na opóźnione zlecenia, zwiększają planowane czasy realizacji? Ten efekt znany jest od dziesięcioleci jako **syndrom czasu realizacji** i omawia się go głównie w kontekście MRP [23]:

1. Zlecenia kończą się z opóźnieniem.
2. Planiści zwiększają planowane czasy realizacji, aby dmuchać na zimne.
3. W efekcie zlecenia są zwalniane wcześniej.
4. W warsztacie równocześnie znajduje się więcej zleceń; rośnie WIP.
5. Zgodnie z prawem Little'a, przy stałej przepustowości, rzeczywisty czas realizacji rośnie.
6. Zlecenia znów kończą się z opóźnieniem i cykl zaczyna się od nowa.

W 2023 roku Matthias Thürer, Nuno Fernandes, Stefan Haeussler i Mark Stevenson za pomocą symulacji sprawdzili, czy dynamicznie korygowane planowane czasy realizacji szkodzą warsztatom typu make-to-order. Odpowiedź brzmi: tak, ale nie w sposób, którego można by się spodziewać. Szkoda wynika głównie ze skracania planowanych czasów realizacji w okresach małego obciążenia, co następnie zwiększa obciążenie w późniejszych okresach szczytowych [23]. W praktyce: korygowanie planowanych czasów realizacji bez kontroli zwalniania zleceń tylko przesuwa problem.

Lekarstwem są zwalnianie zleceń oparte na obciążeniu lub na wąskim gardle (rozdziały 7 i 8) oraz szeregowanie przy skończonej zdolności produkcyjnej, które wyprowadza czasy realizacji z rzeczywistego harmonogramu zamiast je narzucać.

### 3.4 Planowanie sekwencyjne

Trzecia słabość to **planowanie sekwencyjne**: najpierw program, potem materiał, potem terminy, potem zdolność produkcyjna. Każdy krok traktuje poprzedni wynik jako stały. Sprzężenie zwrotne typu „ta maszyna jest pełna, więc przenoszę zapotrzebowanie, a wraz z nim zamówienie zakupu” nie jest uwzględnione w konstrukcji. Efektem są plany spójne na każdym etapie, ale niewykonalne jako całość.

| Założenie MRP | Rzeczywistość na hali produkcyjnej | Konsekwencja |
|---|---|---|
| Zdolność produkcyjna jest nieograniczona | Zdolność produkcyjna jest ograniczona na każdym stanowisku | przeciążone tygodnie, nierealistyczne terminy |
| Czasy realizacji są stałe | Czasy realizacji zależą od obciążenia | zlecenia zwalniane zbyt wcześnie lub zbyt późno |
| Wielkości partii są niezależne od kolejności | Czasy przezbrojeń zależą od poprzedniego wariantu | utracona zdolność na wąskim gardle |
| Etapy planowania przebiegają jeden po drugim | Materiał, zdolność i terminy wzajemnie na siebie wpływają | plany, które działają tylko na papierze |
| Popyt i stany magazynowe są znane dokładnie | Prognozy się zmieniają, a zapisy magazynowe zawierają błędy | nerwowość, braki, bufory bezpieczeństwa |

## 4. Fizyka fabryki: prawo Little'a, krzywe operacyjne i zmienność

Aby zrozumieć, dlaczego harmonogramy zawodzą, potrzebne są trzy zależności, które obowiązują niezależnie od branży i oprogramowania. Hopp i Spearman podsumowali je pod nazwą *Factory Physics* [10].

### 4.1 Prawo Little'a: WIP, przepustowość i czas cyklu

W 1961 roku John D. C. Little udowodnił zależność, która obowiązuje w każdym stabilnym systemie z napływem i odpływem [9]. W ujęciu produkcyjnym:

> **Czas cyklu (CT) = praca w toku (WIP) ÷ przepustowość (TH)**

Wzór obowiązuje dla średnich długookresowych, niezależnie od rozkładu czasów obróbki i reguły kolejkowania. Uwaga dotycząca terminów: w prawie Little'a „czas cyklu” oznacza czas, jaki zlecenie spędza w systemie (czas przepływu lub wiodący czas produkcji), a nie czas cyklu stanowiska, który porównuje się z taktem w rozdziale 8.

**Przykład liczbowy:** Warsztat obróbki części kończy średnio 40 zleceń produkcyjnych dziennie. Na hali przebywa średnio 600 zwolnionych, ale jeszcze niezakończonych zleceń.

- CT = 600 ÷ 40 = **15 dni roboczych**

Jeśli kontrolowane zwalnianie zleceń obniży WIP do 320 zleceń, a wąskie gardło pozostanie w pełni zasilane, a przepustowość utrzyma się na poziomie 40 zleceń dziennie:

- CT = 320 ÷ 40 = **8 dni roboczych**

Czas realizacji niemal się zmniejszył o połowę, bez przyspieszenia choćby jednej maszyny. Dlatego kontrola WIP i zwalnianie zleceń należą do najskuteczniejszych i najtańszych dźwigni w planowaniu produkcji. Więcej informacji o tym wskaźniku znajduje się na stronie hasła [Lead Time](https://www.m365.fm/entity/lead-time/).

**Ważne zastrzeżenie:** Prawo Little'a nie mówi, że każde obniżenie WIP skraca czas realizacji bez skutków ubocznych. Jeśli WIP przed wąskim gardłem spadnie tak bardzo, że stanowisko zacznie pracować na sucho, spadnie także przepustowość. Krzywe operacyjne opisują właśnie tę zależność.

### 4.2 Krzywe operacyjne i model lejka

Badacze z Instytutu Systemów Produkcyjnych i Logistyki (IFA) na Uniwersytecie Leibniza w Hanowerze opracowali **model lejka**: stanowisko pracy traktuje się jak lejek, do którego wpływają zlecenia, a po obróbce je opuszczają. Wyprowadzony z niego **diagram przepustowości** pokazuje WIP, wydajność wyjściową i czas realizacji w czasie [8]. Na tej podstawie Nyhuis i Wiendahl sformułowali **logistyczne krzywe operacyjne**, które pokazują, jak wydajność wyjściowa i czas realizacji systemu pracy zależą od WIP [8]:

- Przy **niskim WIP** wydajność rośnie niemal liniowo wraz z każdym dodanym zleceniem, a czas realizacji pozostaje bliski czystemu czasowi obróbki. Stanowisko grozi jednak brakiem materiału.
- Od **średniego WIP** wydajność zbliża się do maksimum. Dodatkowy WIP prawie nie daje już wzrostu wydajności.
- Przy **wysokim WIP** wydajność pozostaje na stałym poziomie, a czas realizacji rośnie proporcjonalnie do WIP. Dodatkowy WIP to czysty czas oczekiwania.

Z tego wynika podstawowa zasada planowania: każde stanowisko ma zakres WIP, w którym wydajność jest pewna, a czas realizacji wciąż krótki. Harmonogramowanie i zwalnianie zleceń powinny utrzymywać halę w tym zakresie. Hopp i Spearman opisują pokrewną koncepcję, **krytyczny WIP**: poziom WIP, przy którym idealna linia właśnie osiąga maksymalną przepustowość przy minimalnym czasie cyklu [10]. Nyhuis i Wiendahl wyraźnie łączą oba podejścia i wiążą teorię krzywych operacyjnych z prawem Little'a [8].

### 4.3 Zmienność i wykorzystanie: dlaczego 95% może być za dużo

Trzecie prawo dotyczy czasu oczekiwania przed zasobem. John Kingman opublikował w 1961 roku przybliżenie dla kolejek w warunkach dużego obciążenia ruchem [11]. Hopp i Spearman wykorzystują je w *Factory Physics* jako **równanie VUT** (zmienność × wykorzystanie × czas) [10]:

> **Średni czas oczekiwania w kolejce przy zasobie ≈ V × U × T**
>
> V = (c_a² + c_e²) ÷ 2 (zmienność napływu i czasów obróbki)
> U = u ÷ (1 − u) (współczynnik wykorzystania, u = wykorzystanie między 0 a 1)
> T = t_e (średni efektywny czas obróbki)

c_a i c_e to współczynniki zmienności (odchylenie standardowe podzielone przez średnią) czasów między przybyciami i czasów przetwarzania. Przybliżenie dotyczy pojedynczego zasobu i jest najdokładniejsze przy wysokim wykorzystaniu.

**Przykład obliczeniowy:** Maszyna ma średni efektywny czas przetwarzania wynoszący 1 godzinę na zlecenie. Przybycia i czasy przetwarzania zmieniają się umiarkowanie; oba współczynniki zmienności wynoszą 1, zatem V = (1 + 1) ÷ 2 = 1.

| Wykorzystanie u | U = u ÷ (1 − u) | Średni czas oczekiwania w kolejce (h) | Czas przy maszynie łącznie z przetwarzaniem (h) |
|---|---|---|---|
| 80% | 4,0 | 4,0 | 5,0 |
| 85% | 5,7 | 5,7 | 6,7 |
| 90% | 9,0 | 9,0 | 10,0 |
| 95% | 19,0 | 19,0 | 20,0 |

Wzrost wykorzystania z 80% do 95% zwiększa obciążenie o 15 punktów procentowych, ale mnoży czas oczekiwania w kolejce prawie pięciokrotnie. Z tego wynikają trzy wnioski planistyczne:

1. **Pełne wykorzystanie wszystkich gniazd nie jest rozsądnym celem.** Jeśli każde gniazdo zaplanujemy na 95%, otrzymamy długie i silnie zmienne czasy realizacji.
2. **Redukcja zmienności działa jak dodanie zdolności produkcyjnej.** Zmniejszenie V o połowę, na przykład dzięki stabilniejszym przezbrojeniom, mniejszym i równiejszym partiom czy wygładzonemu zwalnianiu zleceń, skraca czas oczekiwania w kolejce o połowę przy tym samym wykorzystaniu.
3. **Wysokie wykorzystanie jest pożądane w wąskim gardle, ale wyłącznie z buforem.** Wąskie gardło nigdy nie powinno być pozbawione pracy. Jest to możliwe tylko wtedy, gdy przed nim znajduje się celowo dobrany bufor, a pozostałe zasoby mają wolne moce (Rozdział 7).

## 5. Czym jest system APS i jak oblicza

### 5.1 Definicja

**Advanced planning and scheduling (APS)**, czyli zaawansowane planowanie i harmonogramowanie, oznacza systemy programowe i metody, które planują i harmonogramują zlecenia produkcyjne, uwzględniając jednocześnie dostępność materiałów oraz skończone zdolności produkcyjne. Literatura dotycząca łańcucha dostaw używa szerszej definicji: Bernhard Fleischmann, Herbert Meyr i Michael Wagner umieszczają planowanie zaawansowane w macierzy planowania, rozciągającej się od długoterminowego projektowania sieci po krótkoterminowe harmonogramowanie obejmujące zaopatrzenie, produkcję, dystrybucję i sprzedaż [13]. Na hali produkcyjnej określenie „APS” zwykle oznacza część odpowiedzialną za szczegółowe harmonogramowanie i ustalanie kolejności w produkcji. Wiele produktów wymienianych w amerykańskich katalogach w kategorii „oprogramowanie do harmonogramowania produkcji” obejmuje tę warstwę, jako samodzielny produkt lub jako moduł ERP czy MES; inne pozycje z tych samych zestawień to narzędzia do planowania projektów lub zasobów (Rozdział 13.1).

Słowo **„zaawansowane”** odnosi się do trzech różnic w stosunku do klasycznej logiki MRP:

- **Harmonogramowanie przy skończonych zdolnościach:** Każdy zasób ma ograniczoną, zależną od kalendarza zdolność. Operacja jest planowana wyłącznie tam, gdzie zasób jest wolny. ISA-95 definiuje harmonogramowanie przy skończonych zdolnościach właśnie w tych kategoriach: żadna zaplanowana zdolność nie może przekraczać dostępnej zdolności [31].
- **Jednoczesne planowanie:** Materiał, zdolności i terminy są uwzględniane łącznie. Jeśli brakuje materiału, operacja się przesuwa; jeśli maszyna jest zajęta, wymóg materiałowy się przesuwa.
- **Optymalizacja:** Zamiast wyliczać jedną odpowiedź, system przeszukuje wiele wykonalnych rozwiązań w poszukiwaniu dobrego, najlepiej najlepszego według zdefiniowanych celów.

### 5.2 Harmonogramowanie oparte na ograniczeniach: co modeluje APS

APS nie planuje względem „zdolności” jako jednej liczby, lecz względem sieci ograniczeń. Nazywa się to **[harmonogramowaniem opartym na ograniczeniach](https://www.m365.fm/entity/constraint-based-scheduling/)**. Typowe ograniczenia:

| Ograniczenie | Przykład | Dlaczego ma znaczenie |
|---|---|---|
| Zdolność zasobów | Maszyna A: 2 zmiany, od poniedziałku do piątku | podstawa każdego szczegółowego harmonogramu |
| Zasoby alternatywne | Część może być wykonana na maszynie A lub B, na B o 20% wolniej | wyjście awaryjne, gdy zasób jest przeciążony |
| Praca i kwalifikacje | Tylko trzech operatorów ma uprawnienia na stanowisku testowym | robocizna jest często prawdziwym wąskim gardłem |
| Narzędzia i oprzyrządowanie | Tylko jedna forma wtryskowa na wariant | dwie maszyny nie mogą jednocześnie wykonywać tego samego wariantu |
| Przezbrojenia zależne od sekwencji | Z jasnego na ciemny kolor: 10 min; z ciemnego na jasny: 45 min | sekwencja określa dostępną zdolność |
| Kolejność operacji i nakładanie | Montaż rozpoczyna się dopiero po malowaniu; dozwolony transfer w partiach częściowych | czas realizacji i synchronizacja |
| Minimalne i maksymalne czasy oczekiwania | Klej musi schnąć 24 h; część może czekać między myciem a powlekaniem nie dłużej niż 4 h | minimalne i maksymalne czasy technologiczne |
| Materiały i części kupowane | Elektronika przychodzi w czwartek | materiał ogranicza najwcześniejszy start |
| Strefy i powierzchnia hali | W strefie montażu jednocześnie mieszczą się tylko dwie sekcje kadłuba | typowe w montażu dużych urządzeń i w lotnictwie |
| Kampanie i partie | Piec pracuje wyłącznie pełnymi partiami w tej samej temperaturze | grupowanie kontra terminy realizacji |

Im więcej tych ograniczeń obowiązuje, tym mniej wiarygodnie harmonogram można zbudować ręcznie lub w Excelu, a tym większa korzyść z APS.

### 5.3 Jak duży jest problem: eksplozja kombinatoryczna

Nawet na pojedynczej maszynie liczba możliwych sekwencji rośnie w tempie silni liczby zleceń:

- 4 zlecenia: 4! = 24 sekwencje
- 10 zleceń: 10! = 3 628 800 sekwencji
- 15 zleceń: 15! = 1 307 674 368 000 sekwencji, czyli około 1,3 biliona

W rzeczywistym warsztacie typu job shop, z dziesiątkami maszyn, setkami zleceń i wieloetapowymi trasami, sprawdzenie wszystkich wariantów jest beznadziejne. W 1976 roku Michael Garey, David Johnson i Ravi Sethi wykazali, że minimalizacja czasu realizacji (makespan) jest problemem NP-zupełnym w flow shopie z trzema lub więcej maszynami oraz w job shopie z dwiema lub więcej maszynami [14]. Dla takich problemów nie zna się metody, która gwarantowałaby znalezienie optimum dla dowolnie dużych instancji w rozsądnym czasie. Dlatego systemy APS łączą reguły, heurystyki i optymalizację.

### 5.4 Metody: od reguł priorytetowych do optymalizacji matematycznej

**Reguły dyspozytorskie** (reguły priorytetowe) decydują, które czekające zlecenie zostanie uruchomione następne. Są proste, szybkie i przejrzyste:

| Reguła | Logika | Zaleta | Wada |
|---|---|---|---|
| FIFO (pierwszy przyszedł, pierwszy obsłużony) | kto pierwszy, ten pierwszy | sprawiedliwa, prosta, mała wariancja | ignoruje terminy |
| EDD (najwcześniejszy termin) | najpierw najwcześniejszy termin | na jednej maszynie minimalizuje maksymalne opóźnienie | ignoruje czasy wykonania |
| SPT (najkrótszy czas wykonania) | najpierw najkrótsza operacja | na jednej maszynie minimalizuje średni czas przepływu | długie zlecenia mogą być wiecznie odkładane |
| CR (współczynnik krytyczny) | pozostały czas do terminu ÷ pozostała praca | uwzględnia termin i pozostałą pracę | niestabilna przy częstym przeplanowywaniu |
| Luz (slack) | czas do terminu minus pozostały czas wykonania, najmniejszy najpierw | dobra dla zleceń wieloetapowych | wymaga wiarygodnych pozostałych czasów |
| Zoptymalizowana pod przezbrojenia | grupowanie zleceń z tej samej rodziny przezbrojeń | oszczędza czas przezbrojeń na wąskim gardle | może naruszać terminy |

To, że EDD minimalizuje maksymalne opóźnienie, a SPT średni czas przepływu na jednej maszynie, to klasyczne wyniki teorii szeregowania [29].

**Przykład obliczeniowy: trzy reguły, cztery zlecenia, jedna maszyna**

Cztery zlecenia czekają przy maszynie w chwili 0, w kolejności przybycia A, B, C, D. Czasy w godzinach:

| Zlecenie | Czas wykonania | Termin |
|---|---|---|
| A | 4 | 6 |
| B | 2 | 4 |
| C | 6 | 14 |
| D | 3 | 9 |

| Reguła | Sekwencja | Czasy zakończenia | Spóźnienie | Spóźnione zlecenia | Łączne spóźnienie | Średni czas przepływu |
|---|---|---|---|---|---|---|
| FIFO | A, B, C, D | A 4, B 6, C 12, D 15 | B 2, D 6 | 2 | 8 h | (4+6+12+15)÷4 = 9,25 h |
| SPT | B, D, A, C | B 2, D 5, A 9, C 15 | A 3, C 1 | 2 | 4 h | (2+5+9+15)÷4 = 7,75 h |
| EDD | B, A, D, C | B 2, A 6, D 9, C 15 | C 1 | 1 | 1 h | (2+6+9+15)÷4 = 8,00 h |

Ta sama maszyna, ta sama praca, ta sama zdolność: sama sekwencja decyduje o tym, czy spóźnione są jedno czy dwa zlecenia i czy łączne spóźnienie wynosi 1, czy 8 godzin. SPT daje najkrótszy średni czas przepływu, EDD – najlepsze wyniki pod względem terminów. To, która reguła jest „właściwa”, zależy od celu. W wieloetapowym warsztacie z przezbrojeniami zależnymi od sekwencji żadna pojedyncza reguła nie wystarcza i właśnie wtedy APS zaczyna się opłacać.

**Heurystyki** szybko dostarczają dobre, lecz niegwarantowanie optymalne rozwiązania. Obejmują metody konstrukcyjne, które budują harmonogram zlecenie po zleceniu (na przykład zasada wąskiego gardła: najpierw obciąż wąskie gardło, a następnie dopasuj do niego pozostałe zasoby), oraz metody usprawniające, które krok po kroku zmieniają istniejący harmonogram.

**Metaheurystyki**, takie jak algorytmy genetyczne, symulowane wyżarzanie czy wyszukiwanie tabu, systematycznie eksplorują przestrzeń rozwiązań i potrafią wyjść z optimów lokalnych. Są powszechne w komercyjnych systemach APS do optymalizacji sekwencji.

**Optymalizacja matematyczna** formułuje problem szeregowania jako model z funkcją celu i ograniczeniami, na przykład jako mieszane programowanie całkowitoliczbowe liniowe (MILP) lub model programowania z ograniczeniami (CP). Solwery znajdują rozwiązania optymalne dla małych i średnich problemów albo przynajmniej podają granicę tego, o ile znalezione rozwiązanie może odbiegać od optimum. Duże, szczegółowe problemy szeregowania są często dekomponowane, na przykład według okna czasowego lub grupy zasobów.

**Sztuczna inteligencja** pełni w systemach APS kilka ról: przewiduje czasy obróbki i przezbrojeń na podstawie danych rzeczywistych, przewiduje zakłócenia, uczy się polityk szeregowania (na przykład za pomocą uczenia przez wzmacnianie) oraz umożliwia interakcję w języku naturalnym. Wiarygodni dostawcy wykorzystują ją do poprawy danych wejściowych i przyspieszenia przeszukiwania, a nie do zastąpienia optymalizacji. Szeregowanie wspomagane AI jest tylko tak dobre, jak dane potwierdzone na hali produkcyjnej, z których się uczy.

### 5.5 Cele i kompromisy

APS nigdy nie optymalizuje „harmonogramu” jako takiego; optymalizuje ważoną kombinację celów. Typowe cele:

- terminowość dostaw (minimalizacja opóźnień lub ważonych opóźnień)
- krótkie czasy realizacji i niski poziom WIP
- wysokie wykorzystanie wąskiego gardła
- niski czas przezbrojeń
- mało nadgodzin i równomierne obciążenie pracowników
- stabilność harmonogramu (niewielka liczba zmian w porównaniu z poprzednim harmonogramem)

Cele te są ze sobą sprzeczne. Niemiecka literatura biznesowa nazywa istotę tego konfliktu „dylematem szeregowania” (*Dilemma der Ablaufplanung*): wysokie wykorzystanie wymaga kolejek, a krótkie czasy realizacji wymagają wolnych mocy. Punkt 4.3 pokazuje, dlaczego tak jest matematycznie. Jednym z najważniejszych zadań przy wdrażaniu APS jest zatem uzgodnienie wag celów ze sprzedażą, produkcją i logistyką.

### 5.6 Kierunek szeregowania, ATP i CTP

Pytanie „jakie są rodzaje szeregowania produkcji?” sprowadza się zwykle do dwóch par: zdolności skończonej i nieskończonej (punkt 3.1) oraz kierunku szeregowania:

- **Szeregowanie w przód (forward):** Operacje są szeregowane od najwcześniejszego możliwego startu. Wynikiem jest najwcześniejszy możliwy termin zakończenia.
- **Szeregowanie wstecz (backward):** Operacje są szeregowane wstecz od terminu wymagalności. Wynikiem jest najpóźniejszy możliwy start, co oszczędza zapasy, ale nie pozostawia rezerwy czasu.
- **Szeregowanie oparte na wąskim gardle:** Najpierw obciążane jest wąskie gardło; operacje wcześniejsze są następnie szeregowane wstecz, a późniejsze w przód.

Dwie funkcje są szczególnie cenne dla sprzedaży:

- **Available to promise (ATP):** Jaka ilość może zostać obiecana na jaki termin z zapasów i zaplanowanych dostaw?
- **Capable to promise (CTP):** Jaki termin jest osiągalny dla nowego zlecenia z uwzględnieniem materiału *i* zdolności produkcyjnych?

CTP jest typową funkcją APS, ponieważ wykonuje próbne szeregowanie nowego zlecenia względem bieżącego obciążenia. Zamienia obietnice terminów wysyłki z szacunku w obliczenie.

## 6. ERP vs. APS vs. MES

Te trzy klasy systemów nie konkurują ze sobą; uzupełniają się. Norma ANSI/ISA-95 umieszcza ERP na poziomie 4 (planowanie biznesowe i logistyka), a zarządzanie operacjami produkcyjnymi na poziomie 3; modele czynności w części 3 obejmują harmonogram pracy (nazywany „szczegółowym harmonogramem produkcji” w wydaniu z 2005 r.) oraz jego realizację [31]. Niemiecka wytyczna VDI 5600 część 1 (październik 2016), powszechnie stosowana w Europie, idzie dalej i wprost wymienia „szczegółowe planowanie i szczegółowe sterowanie” jako jedno z dziesięciu zadań systemu realizacji produkcji, obok zarządzania zleceniami, zarządzania urządzeniami, zarządzania materiałami, zarządzania personelem, akwizycji danych, analizy wydajności, zarządzania jakością, zarządzania informacją i zarządzania energią [15]. W praktyce szczegółowe szeregowanie zapewniane jest albo w MES, albo w samodzielnym APS, albo w module APS systemu ERP.

| Cecha | ERP (moduł planowania) | APS | MES |
|---|---|---|---|
| Główne zadanie | ilości, wartości, materiał, terminy kamieni milowych | wykonalne terminy i sekwencje przy uwzględnieniu ograniczeń | realizacja, potwierdzanie, widoczność w czasie rzeczywistym |
| Horyzont planowania | od tygodni do miesięcy | od godzin do tygodni, kroczący | od zmiany do minuty |
| Model zdolności produkcyjnych | nieskończony w podstawowej postaci, wyświetlanie obciążenia w dalszej kolejności | skończony, wiele zasobów jednocześnie | mierzy faktycznie wykorzystane zdolności |
| Ziarnistość czasu | dni, tygodnie | minuty do godzin | sekundy do minut |
| Logika planowania | MRP, planowanie wsteczne ze stałymi czasami realizacji | heurystyki, metaheurystyki, optymalizacja matematyczna | reguły zwalniania i dyspozycji, czasem własny harmonogramista |
| Typowe pytanie | Co musi być zrobione do kiedy, którego materiału brakuje? | Która operacja, kiedy i na którym zasobie? | Co działa teraz, jak daleko jest każde zlecenie, dlaczego maszyna stoi? |
| Dane | dane główne, zamówienia klientów i zamówienia planowane | dane ERP oraz macierze przezbrojeń, kalendarze, ograniczenia, potwierdzenia | dane maszynowe, produkcyjne i jakościowe |
| Reakcja na zakłócenia | następny cykl planowania, często w nocy | przeplanowanie w ciągu minut, porównanie scenariuszy | rejestracja, alarm, wyzwolenie przeplanowania |
| Użytkownicy | planiści materiałowi, zakupy, sprzedaż, finanse | planowanie produkcji, sterowanie produkcją, łańcuch dostaw | nadzorcy, operatorzy, utrzymanie ruchu, jakość |
| Ograniczenie | planuje w oparciu o założenia, a nie rzeczywistość | wymaga dobrych danych głównych i potwierdzeń | często planuje tylko krótkoterminowo i lokalnie |

**Jak systemy współpracują:** ERP przekazuje zlecenia, zestawienia materiałowe, marszruty i stany magazynowe do APS. APS szereguje przy uwzględnieniu skończonej zdolności produkcyjnej i zwraca realistyczne terminy oraz sekwencje, które ERP wykorzystuje do terminów wysyłek i potrzeb materiałowych. MES realizuje sekwencję na hali i przekazuje faktyczne czasy, ilości oraz zakłócenia z powrotem do APS i ERP. Dopiero ta zamknięta pętla sprawia, że harmonogram jest wiarygodny. Sposób domknięcia drogi od ERP do hali produkcyjnej za pomocą cyfrowego bliźniaka opisano we wpisie [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/).

**Kiedy wystarczy ERP?** Jeśli zlecenia mają kilka operacji, przezbrojenia prawie nie zależą od kolejności, wyraźnie widoczne wąskie gardło można prowadzić prostą regułą zwalniania, a zdolności produkcyjne rzadko są napięte, dobrze utrzymywany plan w ERP wraz z tablicą harmonogramowania bywa wystarczający. Im więcej ograniczeń z punktu 5.2 ma zastosowanie, tym wyraźniej przemawia to za APS.

## 7. Teoria ograniczeń, drum-buffer-rope i zarządzanie buforami

### 7.1 Teoria ograniczeń

Eliyahu M. Goldratt wprowadził **[teorię ograniczeń](https://www.m365.fm/entity/theory-of-constraints/)** (TOC) w 1984 roku w powieści biznesowej *Cel* (*The Goal*), napisanej wspólnie z Jeffem Coxem [1]. Główne przesłanie: każdy system ma co najmniej jedno ograniczenie, które limituje jego przepustowość. Godzina stracona na wąskim gardle to godzina straty dla całego systemu. Godzina zaoszczędzona na zasobie niebędącym wąskim gardłem nie ma wartości, o ile nie odciąża wąskiego gardła.

Goldratt sformułował pięć kroków koncentracji, znanych jako proces ciągłego doskonalenia (POOGI) [3]:

1. **Zidentyfikować** ograniczenie systemu.
2. **Wykorzystać** ograniczenie: brak przestojów, brak przetwarzania braku, przezbrojenia poza czasem wąskiego gardła tam, gdzie to możliwe.
3. **Podporządkować** wszystko inne ograniczeniu: zwolnienia, wielkości partii i kolejności pozostałych zasobów wynikają z wąskiego gardła.
4. **Podnieść** ograniczenie: dopiero teraz dodaje się zmiany, inwestuje lub zleca na zewnątrz.
5. **Zapobiegać bezwładności:** jeśli ograniczenie się przesunęło, wróć do kroku 1.

Kolejność ma znaczenie. Wiele firm przechodzi od razu do kroku 4 i kupuje nową maszynę, mimo że istniejące wąskie gardło wciąż traci zdolności przez przestoje, czekanie na materiał, złe kolejności i zbędne przezbrojenia.

### 7.2 Znajdowanie wąskiego gardła: analiza wąskiego gardła w praktyce

Wąskie gardło nie zawsze jest maszyną z największą liczbą awarii ani z najwyższą ceną. Sprawdzone wskaźniki:

- **Kolejki:** Zlecenia piętrzą się na stałe przed wąskim gardłem, podczas gdy zasoby za nim stoją bezczynnie.
- **Obciążenie a zdolność:** Dla każdego zasobu porównaj planowane obciążenie (wraz z czasami przezbrojeń) z dostępną zdolnością w ciągu kilku tygodni. Zasób z najwyższym stosunkiem jest kandydatem.
- **Wykresy przepustowości:** Tam, gdzie WIP pozostaje wysoki, a krzywa wyjścia wciąż nie staje się bardziej stroma, występuje wąskie gardło zdolnościowe [8].
- **Zapytaj ekspertów, a potem sprawdź:** Brygadziści zwykle wiedzą, gdzie się zacina. Weryfikuj danymi, bo „odczuwane” wąskie gardła to często zasoby z wieloma widocznymi awariami.

Uważaj na **przesuwające się wąskie gardła**. Przy zmieniającym się mixie produktowym wąskie gardło może przemieszczać się między zasobami z tygodnia na tydzień. Statyczne sterowanie wąskim gardłem nie wystarcza wtedy, a APS, który oblicza przyszłe obciążenie każdego zasobu dla bieżącego portfela zleceń, staje się szczególnie wartościowy. Wąskimi gardłami nie są też zawsze maszyny: często są nimi wykwalifikowani pracownicy, stanowiska kontroli, narzędzia lub sam dział planowania.

### 7.3 Drum-buffer-rope

W *Wyścigu* (*The Race*, 1986) Goldratt i Robert E. Fox opisali metodę sterowania, która przekłada pięć kroków na sterowanie na hali produkcyjnej: **drum-buffer-rope** (DBR) [2]. Metafora pochodzi z *Celu*, gdzie oddział harcerzy może maszerować tylko tak szybko, jak jego najwolniejszy członek:

- **Bęben (drum):** Wąskie gardło wyznacza tempo. Jego harmonogram to jedyny szczegółowy harmonogram, którego trzeba dotrzymać.
- **Bufor (buffer):** **Bufor czasowy** znajduje się przed wąskim gardłem (oraz przed punktami wysyłki i montażu, gdzie części z wąskiego gardła spotykają się z innymi). Chroni wąskie gardło przed zmiennością po stronie wejściowej.
- **Lina (rope):** Materiał jest wprowadzany do hali tylko z tempem, w jakim wąskie gardło jest w stanie go przetworzyć. Lina wiąże zwolnienia z harmonogramem wąskiego gardła, przesuniętym o czas bufora.

**Przykład obliczeniowy zwolnienia w DBR:** Wąskim gardłem jest stanowisko obróbki cieplnej. Zlecenie 4711 ma wystartować tam w czwartek o 6:00. Bufor czasowy przed wąskim gardłem wynosi 3 dni robocze. Materiał do zlecenia 4711 jest więc zwalniany w poniedziałek o 6:00, a nie wcześniej. Wcześniejsze zwolnienie tylko podnosi WIP i, zgodnie z prawem Little'a, czas realizacji, bez zwiększenia przepustowości.

Bufor czasowy na początku ustala się pragmatycznie. Często przytaczana w praktyce TOC wartość początkowa to około połowy obecnego czasu realizacji do wąskiego gardła [unverified: wartość podawana w literaturze praktyków, bez potwierdzonego źródła]. Następnie koryguje się ją w ramach zarządzania buforami.

### 7.4 Zarządzanie buforami

**[Zarządzanie buforami](https://www.m365.fm/entity/buffer-management/)** to mechanizm sprzężenia zwrotnego w DBR [4]. Dla każdego zwolnionego zlecenia śledzi się, jaka część jego bufora czasowego została już zużyta. Powszechny jest podział na trzy strefy:

| Strefa | Zużyty bufor | Znaczenie | Reakcja |
|---|---|---|---|
| Zielona | do około jednej trzeciej | zlecenie jest na czas | brak działania |
| Żółta | około jednej do dwóch trzecich | zlecenie robi się napięte | znaleźć przyczynę, przygotować działanie |
| Czerwona | więcej niż dwie trzecie | wąskie gardło może zostać bez materiału lub termin jest zagrożony | przyspieszyć: nadać zleceniu priorytet, usunąć przeszkodę |

Podział na trzy części to powszechna konwencja, a nie prawo natury. Dwie korzyści są najistotniejsze:

1. **Codzienne priorytety:** Zamiast wielu sprzecznych list pilności obowiązuje jedna reguła: najpierw zlecenia czerwone, potem żółte, a na końcu zielone.
2. **Systematyczne doskonalenie:** Rejestrując i analizując przyczyny zleceń czerwonych, otrzymujesz listę Pareto źródeł zakłóceń. Jeśli wiele zleceń jest stale czerwonych, bufor jest zbyt mały lub proces zbyt niestabilny. Jeśli niemal wszystkie są zielone, bufor można zmniejszyć, co obniża WIP i czas realizacji.

Wariant **uproszczony DBR** (S-DBR) dla producentów pracujących na zamówienie rezygnuje ze szczegółowego harmonogramu wąskiego gardła i opiera się na buforze czasowym wysyłki oraz sprawdzeniu obciążenia wąskiego gardła przy przyjmowaniu zamówienia. Jest opisany w *Theory of Constraints Handbook* obok klasycznego DBR [4].

### 7.5 DBR i APS: przeciwieństwa czy uzupełnienie?

Praktycy TOC przez długi czas podchodzili sceptycznie do złożonego oprogramowania planistycznego, ponieważ szczegółowy harmonogram każdego zasobu szybko traci aktualność, gdy pojawiają się zakłócenia. Nowoczesne systemy APS potrafią jednak dobrze modelować zasady DBR: szeregowanie oparte na wąskim gardle, zwolnienie z buforem czasowym oraz wyświetlanie stanu bufora da się skonfigurować w wielu systemach. Z kolei DBR zyskuje na APS, gdy wąskie gardło się przesuwa, gdy trzeba optymalizować sekwencje przezbrojeń na wąskim gardle lub gdy jednocześnie obowiązuje wiele ograniczeń. Rozsądne stanowisko: DBR dostarcza filozofię sterowania, a APS moc obliczeniową.

## 8. Elementy Lean w szeregowaniu: takt, heijunka, równoważenie linii, pull

Produkcja Lean i APS są często przedstawiane jako przeciwieństwa: po jednej stronie pull i wizualne sterowanie, po drugiej centralne planowanie algorytmiczne. W praktyce się uzupełniają. Lean stabilizuje przepływ i ogranicza zmienność; APS planuje tam, gdzie sam przepływ nie wystarcza, na przykład przy dużej różnorodności wyrobów, długich czasach realizacji lub wspólnych zasobach. Szczegóły strony Lean znajdziesz w przewodniku m365.fm [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

### 8.1 Czas taktu

**[Czas taktu](https://www.m365.fm/entity/takt-time/)** to interwał, w którym należy ukończyć jedną jednostkę, aby zaspokoić popyt klienta:

> **Czas taktu = dostępny czas pracy w okresie ÷ popyt klienta w okresie**

**Przykład liczbowy:** Linia montażowa pracuje w dwóch zmianach po 7,5 godziny netto czasu pracy (po odjęciu planowanych przerw), czyli 900 minut dziennie. Popyt klienta wynosi 450 jednostek dziennie.

- Czas taktu = 900 min ÷ 450 jednostek = **2,0 minuty na jednostkę** (120 sekund)

Czas taktu to tempo popytu, a nie miara wydajności. Rzeczywisty czas cyklu każdego stanowiska musi być poniżej niego, aby popyt został zaspokojony.

### 8.2 Równoważenie linii

**[Równoważenie linii](https://www.m365.fm/entity/line-balancing/)** rozdziela zakres pracy między stanowiska tak, aby każde z nich pozostawało poniżej czasu taktu przy możliwie małym czasie bezczynności. Nils Boysen, Malte Fliedner i Armin Scholl systematycznie sklasyfikowali liczne warianty tego problemu [22].

**Przykład liczbowy (ciąg dalszy):** Całkowity zakres pracy na jednostkę wynosi 9,6 minuty.

- Teoretyczna minimalna liczba stanowisk = 9,6 min ÷ 2,0 min = 4,8, zaokrąglone w górę do **5 stanowisk**
- Ze względu na graf kolejności operacji i niepodzielne elementy pracy w praktyce potrzebne są **6 stanowisk**.
- Sprawność równoważenia = 9,6 min ÷ (6 × 2,0 min) = 9,6 ÷ 12,0 = **80%**
- Opóźnienie równoważenia = 100% − 80% = **20%** zdolności linii

Dla szeregowania oznacza to: przy 6 stanowiskach linia pokrywa 450 jednostek dziennie, ale każde stanowisko czeka średnio 20% czasu. Jeśli popyt wzrośnie, linię trzeba przerównoważyć lub wydłużyć czas pracy.

### 8.3 Heijunka

**[Heijunka](https://www.m365.fm/entity/heijunka/)** (japońsk. wyrównywanie) to podstawowa zasada Toyota Production System opisanego przez Taiichi Ohno [20]. Lean Enterprise Institute definiuje ją jako wyrównywanie rodzaju i ilości produkcji w stałym okresie [34]. Zamiast budować duże partie jednego wariantu po drugim, mieszankę rozkłada się równomiernie w czasie.

**Przykład:** Zakład buduje tygodniowo 200 jednostek wariantu A, 100 wariantu B i 100 wariantu C, w pięciu dniach.

| Podejście | Poniedziałek | Wtorek | Środa | Czwartek | Piątek |
|---|---|---|---|---|---|
| Partia po partii | 80 A | 80 A | 40 A, 40 B | 60 B, 20 C | 80 C |
| Wyrównane (heijunka) | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C |

W planie wyrównanym szczytowe obciążenie procesów wcześniejszych spada, zapas wyrobów gotowych na każdy wariant się zmniejsza, a klienci każdego wariantu mogą być obsługiwani codziennie. Ceną są częstsze przezbrojenia. Heijunka wymaga zatem krótkich czasów przezbrojeń i właśnie tutaj spotykają się lean i APS: APS może obliczyć najkorzystniejszą pod względem przezbrojeń sekwencję w ramach dnia dla wyrównanego asortymentu.

### 8.4 Kanban, pull i CONWIP

**[System pull](https://www.m365.fm/entity/pull-system/)** ogranicza WIP, rozpoczynając nową pracę dopiero wtedy, gdy odbiorca na dalszym etapie zgłasza zapotrzebowanie. Najbardziej znaną formą jest **[kanban](https://www.m365.fm/entity/kanban/)**: karty lub elektroniczne sygnały między procesami uruchamiają uzupełnianie, a liczba kart ogranicza zapas.

Kanban sprawdza się dla części o regularnym popycie i przy możliwej do opanowania liczbie wariantów. W produkcji jednostkowej i małoseryjnej, wysoko zróżnicowanej, osiąga swoje granice, ponieważ każdy wariant wymagałby zapasu. Alternatywą jest **CONWIP** (constant work in process), zaproponowany w 1990 roku przez Marka Spearmana, Davida Woodruffa i Wallace'a Hoppa jako alternatywa pull dla kanbanu [21]. CONWIP nie ogranicza zapasu w odniesieniu do pojedynczej części, lecz łączną liczbę zleceń na linii: nowe zlecenie jest zwalniane dopiero wtedy, gdy zakończy się inne. Prawo Little'a staje się regułą sterowania. Pokrewną metodą z IFA w Hanowerze jest **belastungsorientierte Auftragsfreigabe** (zwalnianie zleceń zorientowane na obciążenie), które zwalnia zlecenia tylko wtedy, gdy obciążenie przed gniazdem roboczym pozostaje poniżej limitu; Lödding opisuje ją wraz z CONWIP i sterowaniem wąskim gardłem jako metody zwalniania zleceń [12]. W literaturze anglojęzycznej tę rodzinę metod omawia się zwykle pod hasłem kontroli obciążenia (workload control).

**Co to oznacza dla harmonogramowania:** Kanban i CONWIP decydują *kiedy* zwolnić zlecenie i ograniczają WIP. APS decyduje *co* wytwarzać, w jakiej kolejności i czy terminy są osiągalne. Wiele zakładów stosuje oba podejścia: części standardowe działają w pętli kanban, a zlecenia indywidualne są planowane w APS i zwalniane w ramach limitu WIP.

## 9. Wielkość partii: EOQ, przykład liczbowy i ograniczenia

### 9.1 Podstawowy problem

Każda partia niesie stałe koszty przygotowania, obsługi zlecenia i rozruchu, niezależnie od ilości. Duże partie rozkładają te koszty na wiele sztuk, ale zwiększają zapas i zamrożony kapitał. Małe partie zmniejszają zapas, lecz oznaczają częstsze przezbrojenia. **[Wielkość partii](https://www.m365.fm/entity/batch-size/)** jest więc klasycznym kompromisem.

### 9.2 Klasyczny wzór: Harris (EOQ) i Andler

Ford Whitman Harris opublikował wzór pierwiastkowy na ekonomiczną wielkość partii w 1913 roku w czasopiśmie *Factory, The Magazine of Management*. Dziś jest znany jako ekonomiczna wielkość zamówienia (economic order quantity, EOQ); Donald Erlenkotter wyjaśnił jego autorstwo w 1990 roku [17]. Gdy wzór stosuje się do partii produkcyjnych, a nie zamówień zakupowych, teksty amerykańskie często nazywają go ekonomiczną wielkością produkcji lub ekonomiczną wielkością partii. W krajach niemieckojęzycznych znany jest jako **wzór Andlera**, od książki Kurta Andlera z 1929 roku [18]:

> **Q* = √(2 × D × S ÷ H)**
>
> Q* = optymalna wielkość partii (sztuki)
> D = popyt w okresie (sztuki rocznie)
> S = stały koszt na partię, tj. koszt przezbrojenia i zamówienia (USD na partię)
> H = koszt utrzymania jednostki w okresie (USD na sztukę rocznie), często obliczany jako koszt jednostkowy × stopa kosztu magazynowania

Wzór minimalizuje sumę kosztów przezbrojeń (D ÷ Q × S) i kosztów utrzymania zapasu (Q ÷ 2 × H). W optimum obie składowe kosztów są sobie równe.

### 9.3 Przykład liczbowy

Część toczona (tokarska) ma roczny popyt 12 000 sztuk. Jedno przezbrojenie kosztuje 300 USD, łącznie z czasem maszyny i pracy. Koszt jednostkowy wynosi 40 USD, a stopa kosztu magazynowania 20% rocznie. (Oryginał niemiecki używa tych samych wartości w euro; liczby mają charakter ilustracyjny, bez przeliczania.)

- H = 40 USD × 0,20 = 8 USD na sztukę rocznie
- Q* = √(2 × 12 000 × 300 ÷ 8) = √(7 200 000 ÷ 8) = √900 000 ≈ **949 sztuk**
- Partii rocznie = 12 000 ÷ 949 ≈ 12,6
- Koszt przezbrojeń rocznie = 12 000 ÷ 949 × 300 USD ≈ 3 793 USD
- Koszt utrzymania zapasu rocznie = 949 ÷ 2 × 8 USD = 3 796 USD
- **Koszt całkowity ≈ 7 589 USD** rocznie

Jak wrażliwy jest koszt na odchylenia od Q*?

| Wielkość partii | Koszt przezbrojeń (USD/rok) | Koszt utrzymania (USD/rok) | Koszt całkowity (USD/rok) | Odchylenie od optimum |
|---|---|---|---|---|
| 500 | 7 200 | 2 000 | 9 200 | +21,2% |
| 600 | 6 000 | 2 400 | 8 400 | +10,7% |
| 949 | 3 793 | 3 796 | 7 589 | 0% |
| 1 200 | 3 000 | 4 800 | 7 800 | +2,8% |
| 2 000 | 1 800 | 8 000 | 9 800 | +29,1% |

Krzywa kosztów jest płaska wokół optimum: wielkość partii większa o około jedną czwartą kosztuje mniej niż 3% więcej. W praktyce można zaokrąglać wielkości partii do wartości praktycznych, takich jak ilości w pojemnikach lub dzienne zapotrzebowanie, bez istotnej straty kosztowej.

**Czas przezbrojenia jest większą dźwignią:** Jeśli redukcja czasu przezbrojenia zmniejsza koszt przezbrojenia o połowę, z 300 do 150 USD, optymalna wielkość partii spada do √(2 × 12 000 × 150 ÷ 8) ≈ **671 sztuk**. Całkowity koszt spada do około 5 367 USD rocznie, czyli o ok. 29%, ponieważ całkowity koszt w optimum jest proporcjonalny do pierwiastka kwadratowego z S. Średni zapas cyklowy spada również o ok. 29%. Metody redukcji czasu przezbrojenia, takie jak SMED (przezbrojenie w czasie jednej minuty, single-minute exchange of die), zwracają się więc podwójnie. Więcej na stronie hasła [Setup Time](https://www.m365.fm/entity/setup-time/).

### 9.4 Ograniczenia wzoru EOQ

Wzór jest użytecznym punktem wyjścia, ale jego założenia na hali produkcyjnej niemal nigdy nie są spełnione:

- **Stały, znany popyt:** Rzeczywisty popyt waha się i jest niepewny.
- **Nieograniczona zdolność produkcyjna:** Wzór ignoruje, że przezbrojenia zużywają zdolność wąskiego gardła. Na wąskim gardle godzina przezbrojenia to godzina utraconej przepustowości; na stanowisku niebędącym wąskim gardłem kosztuje prawie nic. TOC wnioskuje, że partie powinny być zwykle większe na wąskim gardle, a mniejsze na pozostałych stanowiskach.
- **Jeden produkt, brak interakcji:** Kilka produktów dzieli te same maszyny; przezbrojenia zależne od sekwencji nie są modelowane.
- **Natychmiastowa produkcja:** W podstawowej postaci cała partia jest dostępna od razu. Dla skończonej szybkości produkcji istnieje rozszerzony wzór (ekonomiczna wielkość produkcji), w którym koszty utrzymania są ważone współczynnikiem (1 − szybkość popytu ÷ szybkość produkcji).
- **Brak wpływu na czas realizacji:** Duże partie wydłużają czas realizacji każdego następnego zlecenia na tej samej maszynie i zwiększają zmienność. Tego efektu nie uwzględnia rachunek kosztów.
- **Trudne do ustalenia stawki kosztów:** Koszt przezbrojenia i stopa kosztu utrzymania zapasu to często wartości szacunkowe, obarczone dużą dowolnością.

Dla popytu dynamicznego istnieją metody takie jak algorytm Wagnera-Whitina oraz heurystyki, np. part-period balancing i Silver-Meal. APS idzie o krok dalej: wyznacza wielkości partii i kolejność razem, uwzględniając zdolność produkcyjną, macierze przezbrojeń i terminy realizacji.

## 10. Zapas bezpieczeństwa: wzór i przykład liczbowy

### 10.1 Do czego służy zapas bezpieczeństwa

**[Zapas bezpieczeństwa](https://www.m365.fm/entity/safety-stock/)** chroni przed dwiema niepewnościami: zmiennością popytu w czasie realizacji uzupełnienia oraz zmiennością samego czasu realizacji. Nie jest lekarstwem na słabe planowanie, lecz świadomie opłaconym ubezpieczeniem od losowości.

### 10.2 Wzór dla zmiennego popytu

Jeśli dzienny popyt ma w przybliżeniu rozkład normalny, a czas realizacji uzupełnienia jest stały [19]:

> **SS = z × σ_D × √L**
>
> SS = zapas bezpieczeństwa (szt.)
> z = współczynnik bezpieczeństwa z standardowego rozkładu normalnego dla żądanego poziomu obsługi
> σ_D = odchylenie standardowe dziennego popytu (szt.)
> L = czas realizacji uzupełnienia (dni)

Stosowany tu poziom obsługi to **cykliczny poziom obsługi** (prawdopodobieństwo braku brakującej dostawy w cyklu uzupełniania, w literaturze niemieckiej nazywany poziomem obsługi α). Nie jest on tym samym co **wskaźnik realizacji zamówień** (udział ilości popytu zrealizowanej natychmiast z zapasu, poziom obsługi β). Pomylenie ich prowadzi do systematycznie błędnie dobranych zapasów.

**Przykład liczbowy:** Część zakupowa jest zużywana średnio po 100 sztuk dziennie; odchylenie standardowe wynosi 30 sztuk dziennie. Czas realizacji uzupełnienia to 9 dni roboczych.

| Cykliczny poziom obsługi | z | Obliczenie | Zapas bezpieczeństwa |
|---|---|---|---|
| 90% | 1,282 | 1,282 × 30 × √9 = 1,282 × 30 × 3 | ≈ 115 szt. |
| 95% | 1,645 | 1,645 × 30 × 3 | ≈ 148 szt. |
| 99% | 2,326 | 2,326 × 30 × 3 | ≈ 209 szt. |

Przejście z 95% do 99% kosztuje ponad 40% więcej zapasu bezpieczeństwa. Wysokie poziomy obsługi stają się nieproporcjonalnie drogie.

### 10.3 Wzór dla zmiennego popytu i zmiennego czasu realizacji

Jeśli zmienia się także czas realizacji, wzór się rozszerza [19]:

> **SS = z × √(L × σ_D² + d² × σ_L²)**
>
> d = średni dzienny popyt, σ_L = odchylenie standardowe czasu realizacji (dni)

**Przykład liczbowy (ciąg dalszy):** Dostawca dostarcza w średnio 9 dni, ale z odchyleniem standardowym 2 dni.

- L × σ_D² = 9 × 30² = 8 100
- d² × σ_L² = 100² × 2² = 40 000
- √(8 100 + 40 000) = √48 100 ≈ 219,3
- SS (95%) = 1,645 × 219,3 ≈ **361 szt.**

Zapas bezpieczeństwa rośnie ze 148 do 361 sztuk, czyli prawie dwa i pół razy, wyłącznie z powodu niestabilnego czasu realizacji. Zmienność czasu realizacji odpowiada tu za około 83% wariancji. Poprawa terminowości dostaw dostawcy często zmniejsza zapasy bardziej niż jakakolwiek poprawa prognozy.

### 10.4 Ograniczenia wzoru

- Rozkład normalny słabo pasuje do popytu przerywanego (wiele okresów bez zużycia). Tam lepsze są inne rozkłady lub symulacja.
- Wzór zakłada niezależność popytu. Dla części o popycie zależnym wynikającym ze struktur materiałowych zapas bezpieczeństwa zwykle nie jest właściwym narzędziem; lepiej sprawdzają się bezpieczny czas realizacji lub bufory w wybranych punktach.
- Zapas bezpieczeństwa, który jest stale zużywany, nie jest już zapasem bezpieczeństwa, lecz błędem planowania. Regularnie sprawdzaj, jak często i dlaczego jest naruszany.

## 11. Wskaźniki KPI planowania produkcji

Bez wskaźników KPI nie da się udowodnić wartości APS ani usprawnić planowania. Przed wdrożeniem zdefiniuj każdy wskaźnik jednoznacznie i zmierz wartość bazową. Osobny przewodnik m365.fm o [wskaźnikach KPI w produkcji](https://www.m365.fm/en/learn/manufacturing-kpis/) omawia szerszy zestaw.

| KPI | Wzór | Co pokazuje | Pułapki |
|---|---|---|---|
| Dostawa w terminie i w całości (OTIF) | pozycje dostarczone w terminie i komplet ÷ wszystkie pozycje z terminem | perspektywa klienta | zdefiniuj punkt odniesienia: termin żądany czy potwierdzony; ustal okno tolerancji |
| Terminowość dostaw (OTD) | pozycje dostarczone w terminie ÷ wszystkie pozycje z terminem | jak OTIF, ale bez kryterium ilości | dostawy częściowe zniekształcają obraz |
| Czas realizacji (czas cyklu produkcji) | zakończenie minus zwolnienie (na zlecenie), średnia i rozrzut | szybkość przepływu | sama średnia nie wystarcza; rozrzut decyduje o wiarygodności terminów wysyłki |
| Współczynnik przepływu | średni czas realizacji ÷ średni czas operacji | ile dłużej zlecenie czeka, niż jest nad nim pracowane [8] | używaj tej samej jednostki czasu (godziny robocze lub godziny kalendarzowe) |
| Produkcja w toku (WIP) | liczba lub zakres pracy zwolnionych, niezakończonych zleceń | czynnik czasu realizacji zgodnie z prawem Little'a | mierz w godzinach zawartości pracy, a nie tylko w sztukach |
| Wykorzystanie | czas zajętości ÷ czas dostępny | wykorzystanie zdolności produkcyjnych | wysokie wykorzystanie w obszarach niebędących wąskim gardłem nie jest sukcesem |
| Wykorzystanie wąskiego gardła | czas produktywny w wąskim gardle ÷ dostępny czas w wąskim gardle | najważniejszy wskaźnik wykorzystania w TOC | raportuj osobno czas przezbrojeń i przestojów w wąskim gardle |
| Udział przezbrojeń | czas przezbrojenia ÷ (czas przezbrojenia + czas przetwarzania) | zdolność tracona na przezbrojenia | szczególnie krytyczne w wąskim gardle |
| Ogólna skuteczność urządzeń (OEE) | dostępność × wydajność × jakość | skuteczność maszyny | dotyczy urządzeń, nie oceny harmonogramu |
| Zgodność z harmonogramem | operacje rozpoczęte lub zakończone zgodnie z harmonogramem ÷ wszystkie zaplanowane operacje | jak realistyczny i stabilny jest harmonogram? | zdefiniuj tolerancję, np. ± 1 zmiana |
| Stabilność harmonogramu | zmienione operacje w horyzoncie zamrożonym ÷ wszystkie operacje | nerwowość planowania | zbyt wiele zmian wskazuje na słabe dane lub brak strefy zamrożenia |
| Status buforów | udział zleceń w strefie czerwonej, żółtej i zielonej | wczesne ostrzeganie w zarządzaniu buforami | ma sens tylko przy zdefiniowanych buforach |

**Przykład obliczeniowy, wydajność dostaw:** W październiku 480 pozycji zamówień miało termin potwierdzony na dany dzień. 432 wysłano na czas; spośród nich 410 wysłano także w komplecie.

- Terminowość dostaw (OTD) = 432 ÷ 480 = **90,0%**
- OTIF = 410 ÷ 480 ≈ **85,4%**

**Przykład obliczeniowy, udział przezbrojeń i współczynnik przepływu:** W ciągu jednego tygodnia wąskie gardło spędziło 18 godzin na przezbrojeniach i 62 godziny na przetwarzaniu. Udział przezbrojeń = 18 ÷ (18 + 62) = **22,5%**. Zlecenie z 6 godzinami czasu operacji spędziło w zakładzie 120 godzin roboczych (15 dni po 8 godzin). Współczynnik przepływu = 120 ÷ 6 = **20**: zlecenie przebywało w zakładzie dwudziestokrotnie dłużej, niż ktokolwiek nad nim pracował.

**Zestaw KPI przy wdrożeniu APS:** Przed uruchomieniem zmierz co najmniej OTIF, czas realizacji (średnią i rozrzut), WIP i wykorzystanie wąskiego gardła, a potem miesięcznie. Te cztery wskaźniki są powiązane prawem Little'a i krzywymi operacyjnymi i razem pokazują, czy lepszy harmonogram przełożył się na lepszy przepływ.

## 12. Cyfrowy bliźniak i symulacja

**Symulacja** modeluje system produkcyjny i uruchamia go w czasie. Niemiecka wytyczna VDI 3633 część 1 obejmuje podstawy symulacji systemów logistycznych, przepływu materiałów i produkcji [16]. Symulacja odpowiada na pytania, na które nie da rady statyczny rachunek zdolności produkcyjnych, ponieważ uwzględnia losowość, zakłócenia i wzajemne zależności: Jak awaria maszyny wpłynie na terminy wysyłek w ciągu najbliższych dwóch tygodni? Co daje trzecia zmiana na wąskim gardle? Jak nowa struktura asortymentu zmieni czasy realizacji?

**Cyfrowy bliźniak produkcji** idzie krok dalej: jest to model stale synchronizowany z danymi z ERP, MES i maszyn. Do harmonogramowania produkcji pełni trzy funkcje:

1. **Podstawa planowania:** APS układa harmonogram na modelu odzwierciedlającym zasoby, ograniczenia i aktualny stan w czasie rzeczywistym.
2. **Analiza scenariuszy:** Przed podjęciem decyzji, na przykład przyjęciem zlecenia pilnego lub inwestycji, symuluje się alternatywy i porównuje je na podstawie KPI.
3. **Pętla uczenia się:** Odchylenia między planem a rzeczywistym przebiegiem wracają jako informacja zwrotna i poprawiają normy czasowe oraz ograniczenia.

Rozróżniaj model symulacyjny zbudowany jednorazowo na potrzeby badania od bliźniaka utrzymywanego w sposób ciągły i używanego w operacjach. Ten drugi przynosi większą wartość, ale wymaga stabilnej integracji danych oraz jasnego przypisania odpowiedzialności za utrzymanie modelu. Sposób połączenia danych z ERP, bliźniaka i hali produkcyjnej pokazano we wpisie [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Przewodnik m365.fm [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) wchodzi głębiej w temat; stronę chmurową i danych omówiono w [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

**Najpierw mapowanie strumienia wartości:** Zanim zamodelujesz bliźniaka lub APS, zmapuj strumień wartości. Pokazuje on, gdzie zalega zapas, gdzie podejrzewa się wąskie gardło i jakie przepływy informacji napędzają dziś planowanie. Zob. przewodnik [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 13. Jak wybrać oprogramowanie do harmonogramowania produkcji: kryteria i lista kontrolna

### 13.1 Przed krótką listą: określ cele i punkt wyjścia

Niezależnie od tego, czy szukasz hasła „oprogramowanie do harmonogramowania produkcji”, „oprogramowanie APS”, „oprogramowanie do harmonogramowania o skończonej zdolności” czy „oprogramowanie do planowania zdolności produkcyjnych”, w produkcji liczy się to, czy system harmonogramuje zdolności jako skończone i z uwzględnieniem rzeczywistych ograniczeń. Wiele narzędzi pojawiających się w wynikach dla tych haseł to narzędzia do zarządzania projektami lub planowania zasobów zespołu. Są przydatne przy projektach, ale zwykle nie modelują marszrut, czasów przezbrojeń zależnych od sekwencji ani dostępności materiałów. Zestawienia „najlepszego oprogramowania do harmonogramowania produkcji” na google.com łączą obie kategorie, dlatego każdego kandydata sprawdź w tabeli ograniczeń z punktu 5.2.

Zanim porozmawiasz z dostawcami, odpowiedz na trzy pytania:

1. **Jaki problem ma zostać rozwiązany?** Na przykład: podnieść OTIF z 78% do ponad 90%, skrócić czas realizacji o połowę, ograniczyć nakład pracy planistów, podawać wiarygodne terminy wysyłek już przy przyjmowaniu zamówienia.
2. **Które ograniczenia naprawdę mają znaczenie?** Przejrzyj tabelę z punktu 5.2 i zaznacz to, co dotyczy Twojego zakładu.
3. **Jak dobre są Twoje dane?** Przed wyborem sprawdź marszruty, normy czasowe i jakość potwierdzeń (punkt 14).

### 13.2 Kryteria wyboru

| Kryterium | Pytanie do zadania | Waga (przykład) |
|---|---|---|
| Modelowanie ograniczeń | Czy system modeluje wszystkie istotne ograniczenia bez własnego kodu? | wysoka |
| Jakość harmonogramu | Jak dobre są harmonogramy dla *Twoich* danych, mierzone Twoimi celami? | wysoka |
| Czas obliczeń | Ile trwa pełne przeplanowanie przy realistycznej ilości danych? | średnia do wysokiej |
| Planowanie interaktywne | Czy planiści mogą przeciągać i upuszczać zlecenia, a system natychmiast sprawdza konsekwencje? | wysoka |
| Wyjaśnialność | Czy planiści widzą, dlaczego zlecenie zostało zaplanowane właśnie tam? | wysoka |
| Scenariusze i symulacja | Czy warianty można obliczać równolegle i porównywać na podstawie KPI? | średnia |
| Integracja z ERP | Czy istnieją standardowe łączniki do Twojego ERP, w jakim kierunku i jak często? | wysoka |
| Integracja z MES i potwierdzeniami | Jak dane rzeczywiste trafiają do APS i jak szybko? | wysoka |
| Użyteczność | Czy planiści i brygadziści akceptują interfejs? | wysoka |
| Skalowalność | Wiele zakładów, więcej zasobów, więcej zleceń? | średnia |
| Operacje i bezpieczeństwo | Chmura czy instalacja lokalna, region hostingu, certyfikaty (np. ISO/IEC 27001, SOC 2), model ról i uprawnień, zgodność z Twoimi ramami bezpieczeństwa (np. NIST CSF 2.0 [35]); dla dostawców dla sektora obronnego w USA wymagania CMMC dotyczące danych, których to dotyczy [36] | średnia |
| Dostawca i partnerzy | Doświadczenie w branży, referencje z porównywalną produkcją, wsparcie, plan rozwoju | średnia |
| Całkowity koszt posiadania | Licencje, wdrożenie, czyszczenie danych, szkolenia, eksploatacja przez 5 lat | średnia |

**A cena?** Ceny w tej kategorii wahają się od abonamentów SaaS za użytkownika dla prostych narzędzi po wyceny korporacyjne dla APS obejmującego wiele zakładów, a większość dostawców APS nie publikuje cenników. Katalogi oprogramowania, które pojawiają się w wynikach dla najpopularniejszego hasła, pokazują ten sam wzorzec: wiele wpisów podaje „cena na zapytanie”, a przynajmniej jeden ranking nadal prezentuje dane cenowe zebrane w 2019 roku. Porównuj całkowity koszt posiadania w perspektywie pięciu lat, wliczając wewnętrzny nakład pracy na czyszczenie danych i integrację, a nie tylko cenę licencji.

### 13.3 Lista kontrolna wyboru

Użyj tej listy jako listy kontrolnej podczas spotkań z dostawcami i testów koncepcji (proof of concept):

- [ ] Cele i KPI z wartościami wyjściowymi są udokumentowane.
- [ ] Istotne ograniczenia są uszeregowane według priorytetu (musi, powinno, mile widziane).
- [ ] Gotowy jest reprezentatywny zbiór testowy z rzeczywistymi zleceniami, marszrutami i czasami przezbrojeń.
- [ ] Każdy dostawca planuje **ten sam** zbiór testowy; wyniki porównuje się na tych samych KPI.
- [ ] Przetestowano scenariusz zakłócenia (awaria maszyny, zlecenie pilne, opóźniony materiał).
- [ ] Zmierzono czas obliczeń pełnego przeplanowania.
- [ ] Własni planiści pracowali z systemem praktycznie, a nie tylko oglądali demonstrację.
- [ ] Interfejs z ERP jest określony (obiekty, kierunek, częstotliwość, obsługa błędów).
- [ ] Ścieżka potwierdzeń z hali produkcyjnej jest zdefiniowana (MES, terminal, aplikacja mobilna).
- [ ] System wyjaśnia swoje decyzje planistyczne w sposób zrozumiały dla planistów.
- [ ] Role i uprawnienia można odwzorować (kto może planować, zwalniać, zamrażać?).
- [ ] Przeprowadzono osobiście rozmowę z co najmniej jednym referencyjnym klientem o porównywalnym typie produkcji.
- [ ] Obliczono całkowity koszt w ciągu pięciu lat, łącznie z nakładem wewnętrznym.
- [ ] Ochrona danych, hosting i bezpieczeństwo informacji zostały uzgodnione z działem IT (a w przypadku pracy dla sektora obronnego – z osobą odpowiedzialną za zgodność z CMMC).
- [ ] Wyjaśniono opcję wyjścia (eksport danych, okres obowiązywania umowy).

**Wskazówka:** Najbardziej wymowny test to **pilotaż na Twoich własnych danych**. Demonstracje dostawców na czystych danych przykładowych niewiele mówią o tym, jak system radzi sobie z niekompletnymi marszrutami i przypadkami szczególnymi.

## 14. Wymagania dotyczące danych i jakość danych głównych

APS oblicza precyzyjnie, nawet na podstawie błędnych danych. Harmonogram oparty na normach czasowych odchylonych o 30% jest precyzyjnie błędny. Jakość danych jest zatem najczęstszą przyczyną, dla której projekty APS trwają dłużej, niż zaplanowano.

| Obiekt danych | Minimalne wymaganie | Typowe luki | Jak sprawdzić |
|---|---|---|---|
| Marszruty | kompletna sekwencja operacji, poprawna grupa gniazd roboczych | brakujące operacje, nieaktualne zasoby | porównać próbki z rzeczywistym przebiegiem produkcji |
| Normy czasowe (obróbka) | odchylenie od rzeczywistości w określonym przedziale tolerancji | normy z kalkulacji kosztów zamiast z pomiarów | plan vs. wykonanie na podstawie potwierdzeń |
| Czasy przezbrojeń | zależne od sekwencji tam, gdzie to istotne (macierz przezbrojeń) | jeden płaski czas przezbrojenia na operację | analiza rejestrów przezbrojeń |
| Zasoby i kalendarze | układy zmian, przerwy, okna serwisowe, postoje zakładu | kalendarze nieutrzymywane w ERP | porównanie z harmonogramem zmian |
| Zasoby zastępcze | dopuszczalne zamienniki ze współczynnikiem wydajności | znane tylko brygadzistom | wywiady, a następnie wprowadzenie do systemu |
| Pracownicy i kwalifikacje | macierz kwalifikacji, planowanie obecności | niedostępne cyfrowo | sporządzenie macierzy kwalifikacji |
| Narzędzia i oprzyrządowanie | liczba, przypisanie do operacji | nieuwzględnione jako zasób | uzgodnienie z listą narzędzi |
| Zapasy i terminy dostaw | prawidłowe stany, wiarygodne terminy dostaw | zaległości w księgowaniu, niepotwierdzone terminy dostaw | rozbieżności z inwentaryzacji cyklicznej, dotrzymywanie terminów przez dostawców |
| Potwierdzenia | terminowe, dla każdej operacji, z ilością i czasem | potwierdzenie zbiorcze na koniec zmiany lub brak potwierdzeń | pomiar wskaźnika potwierdzeń i opóźnień |
| Zlecenia i priorytety | jasne terminy realizacji, priorytet klienta | terminy przyspieszane „na wszelki wypadek" | przegląd historii terminów realizacji |

**Zasada kciuka dla kolejności:** Zacznij od wąskiego gardła. Jeśli marszruty, normy czasowe i czasy przezbrojeń na zasobach wąskiego gardła są poprawne, harmonogram jest już znacznie lepszy niż wcześniej, nawet jeśli zasoby niebędące wąskimi gardłami nadal zawierają niedokładności. Następnie przechodź wzdłuż przepływu materiałów.

**Potwierdzenia są kluczowe:** Bez terminowych potwierdzeń z hali produkcyjnej APS nie wie, gdzie znajduje się zlecenie, i planuje na podstawie stanu, który już nie istnieje. Równie ważne: tylko potwierdzenia umożliwiają porównanie plan vs. wykonanie, które z czasem poprawia normy czasowe.

## 15. Plan wdrożenia APS

Poniższy plan opisuje sprawdzone fazy. Podane czasy trwania są orientacyjnymi wartościami dla zakładu jednolokacyjnego średniej wielkości i silnie zależą od jakości danych, nakładu integracji oraz zasobów projektu [unverified: nie znaleziono solidnego badania dotyczącego czasu trwania wdrożenia].

| Faza | Zakres | Rezultat | Wartość orientacyjna |
|---|---|---|---|
| 1. Ocena | cele, KPI z wartościami wyjściowymi, strumień wartości i wąskie gardła, ograniczenia, jakość danych | specyfikacja wymagań, wyniki analizy danych, uzasadnienie biznesowe | 4 do 8 tygodni |
| 2. Wybór | długa lista dostawców, zbiór testowy, proof of concept, rozmowy referencyjne | decyzja o systemie, umowa | 6 do 12 tygodni |
| 3. Oczyszczenie danych | marszruty, normy czasowe i czasy przezbrojeń, kalendarze, kwalifikacje; zaczynając od wąskiego gardła | dane główne nadające się do planowania | równolegle do faz 2 i 4, często najdłuższy blok |
| 4. Modelowanie i integracja | model zasobów, ograniczenia, wagi funkcji celu, interfejsy ERP i MES | działający model harmonogramowania | 8 do 16 tygodni |
| 5. Pilotaż | jeden obszar, najlepiej obejmujący wąskie gardło; równoległy przebieg ze starym procesem | potwierdzenie jakości harmonogramu, akceptacja użytkowników | 6 do 12 tygodni |
| 6. Wdrożenie na pozostałych obszarach | kolejne obszary, wycofanie równoległego harmonogramowania, reguły zwolnień, strefa zamrożona | praca produkcyjna w pełnym zakresie | zależy od zakresu |
| 7. Ciągłe doskonalenie | plan a wykonanie, utrzymanie norm czasowych, analiza przyczyn buforów, przegląd KPI | system planowania, który się uczy | w sposób ciągły |

**Czynniki sukcesu we wszystkich fazach:**

- **Angażuj planistów od pierwszego dnia.** APS, któremu planiści nie ufają, jest omijany, a arkusz Excel pozostaje w użyciu.
- **Ustal reguły planowania przed oprogramowaniem.** Kto może zmieniać priorytety? Jak długa jest strefa zamrożona? Jaka reguła rządzi zwolnieniami?
- **Zaczynaj od małej skali, ucz się szybko.** Pilotaż przy wąskim gardle pokaże w ciągu kilku tygodni, czy dane i model się sprawdzają.
- **Mierz sukces.** Bez wartości wyjściowych nie da się udowodnić korzyści, a dyskusja o projekcie zamienia się w opinie.
- **Włącz halę produkcyjną.** Harmonogram pomaga tylko wtedy, gdy trafia na halę jako zadania, a potwierdzenia wracają z powrotem. Codzienne procedury, które to umożliwiają, opisuje przewodnik [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 16. Typowe błędy i jak ich unikać

| Błąd | Konsekwencja | Lepsze rozwiązanie |
|---|---|---|
| APS jako substytut doskonalenia procesów | niestabilne procesy są tylko precyzyjniej harmonogramowane | najpierw ustabilizować przezbrojenia, awarie i zwolnienia, harmonogramowanie prowadzić równolegle |
| Modelowanie wszystkich ograniczeń naraz | projekt się opóźnia, model staje się nieczytelny | zacząć od ograniczeń działających na wąskie gardło |
| Pobieranie norm czasowych z kalkulacji kosztów | harmonogramy są systematycznie zbyt optymistyczne lub zbyt pesymistyczne | używać rzeczywistych czasów z potwierdzeń i regularnie je aktualizować |
| Harmonogramowanie wszystkich zasobów przy maksymalnym wykorzystaniu | długie kolejki, chaotyczne terminy realizacji | w pełni obciążyć wąskie gardło, zostawić rezerwę na pozostałych stanowiskach |
| Brak horyzontu zamrożenia | ciągłe przeplanowywanie, zamieszanie na hali | zdefiniować strefę zamrożoną, np. najbliższe 1 do 3 zmian |
| Zwolnienia bez limitu WIP | syndrom długiego czasu realizacji, narastanie zapasów | zwalniać według wąskiego gardła lub przy limicie WIP |
| Ogólne wydłużanie planowanych czasów realizacji, gdy zlecenia się spóźniają | wcześniejsze zwolnienia zwiększają WIP i spóźnienia | usuwać przyczyny przy wąskim gardle, kontrolować zwolnienia |
| Niewynegocjowane cele | sprzedaż, produkcja i logistyka oceniają harmonogram różnie | wspólnie uzgodnić i udokumentować wagi funkcji celu |
| Brak udziału planistów | system jest omijany, równoległe harmonogramowanie pozostaje | angażować planistów przy wyborze, modelowaniu i pilotażu |
| Potwierdzenia tylko na koniec zmiany | APS planuje na podstawie nieaktualnego stanu | potwierdzać na bieżąco każdą operację |
| Brak pomiaru sukcesu | korzyść pozostaje deklaracją | zebrać wartości wyjściowe przed uruchomieniem |
| Optymalizacja typu czarna skrzynka | planiści nie rozumieją harmonogramu i mu nie ufają | wybrać system z wyjaśnialnymi decyzjami harmonogramowania |

**Szybkie usprawnienia bez nowego oprogramowania:** Jeśli chcesz zacząć już jutro, pięć kroków nie wymaga inwestycji:

1. Przez ostatnie osiem tygodni porównaj obciążenie i zdolność produkcyjną każdego zasobu i wskaż wąskie gardło.
2. Policz WIP i użyj prawa Little'a, aby obliczyć średni czas realizacji. Jeśli wynik wyraźnie odbiega od planowanych czasów realizacji w ERP, wiadomo, dlaczego terminy nie są dotrzymywane.
3. Ustal regułę zwolnień: nowe zlecenia wchodzą do produkcji tylko wtedy, gdy kolejka przed wąskim gardłem jest poniżej określonego limitu.
4. Na wąskim gardle ustalaj kolejność według terminu realizacji i rodziny przezbrojeń, a nie według tego, kto głośniej krzyczy.
5. Porównaj normy czasu i czasy przezbrojeń na wąskim gardle z rzeczywistymi wartościami i popraw największe odchylenia.

## 17. Dowody: co podają badania i użytkownicy

**Teoria ograniczeń w literaturze:** Victoria Mabin i Steven Balderstone przeanalizowali ponad 80 udanych wdrożeń TOC, dla których w literaturze podano wyniki ilościowe [5]. Według podsumowania Roberto Panizzolo, w tych przypadkach raportowano średnie poprawy: 70% w czasie realizacji od zamówienia do dostawy, 65% w czasie cyklu produkcyjnego, 49% w zapasach, 63% w przepustowości lub przychodach oraz 44% w dotrzymywaniu terminów [6]. Te liczby należy traktować ostrożnie: analizowano wyłącznie opublikowane historie sukcesu i w literaturze nie znaleziono żadnych porażek [5]. To pozytywna selekcja, a nie oczekiwana średnia dla dowolnego wdrożenia. Kierunek wyników jest jednak zgodny z prawem Little'a i krzywymi operacyjnymi: mniej WIP przy chronionym wąskim gardle oznacza krótsze czasy realizacji.

**Raporty użytkowników dostawców APS:** Dostawcy publikują wiele przykładów wdrożeń. Niemiecki dostawca MES MPDV podaje na przykład, że jego klient VACOM, który planuje około 1200 zleceń z maksymalnie 20 operacjami każde, osiągnął mniej więcej 50% oszczędności czasu w planowaniu [30]. Takie liczby są deklaracjami dostawców bez ujawnionej metody pomiaru. Pokazują, jakie efekty są możliwe, ale nie zastępują pilotażu na własnych danych. To samo dotyczy danych o wdrożeniach na amerykańskich stronach dostawców, które pojawiają się w wynikach wyszukiwania hasła „production scheduling software”.

**Lotnictwo jako przypadek skrajny:** Produkcja lotnicza łączy długie czasy realizacji, strefy montażu o ograniczonej powierzchni, wymagania dotyczące umiejętności i certyfikacji oraz pełną identyfikowalność. Planowanie w tej branży musi chronić nie tylko terminy, lecz także dokumentację. Wymagania dotyczące czasu realizacji i identyfikowalności opisano we wpisie [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/). Pełny przewodnik: [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

**Co daje się uogólnić:** We wszystkich badaniach i raportach powtarzają się trzy wzorce. Po pierwsze, większość korzyści wynika nie z algorytmu, lecz z przejrzystości w zakresie zdolności produkcyjnej i wąskiego gardła. Po drugie, limity WIP i kontrolowane zwalnianie zleceń dają szybkie i tanie efekty. Po trzecie, trwałość wyników zależy od tego, czy potwierdzenia z hali produkcyjnej oraz porównanie planu z wykonaniem nadal działają.

## 18. Planowanie oparte na ograniczeniach z iFAKT Polaris

> **Uwaga: autor pracuje w iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) z siedzibą w Stuttgarcie w Niemczech rozwija rodzinę oprogramowania [iFAKT Polaris](https://www.m365.fm/entity/polaris/). Według strony internetowej firmy Polaris łączy dane z ERP z cyfrowym bliźniakiem produkcji i wymienia jako funkcje: planowanie oparte na ograniczeniach (zasoby, kwalifikacje, zmiany, bufory), symulacje typu what-if dla zakłóceń i zmian asortymentu oraz kokpit KPI z czasem realizacji, WIP, wykorzystaniem i terminowością [28]. Na stronie wymieniono branże: lotniczą, motoryzacyjną, maszynową i automatyki oraz energetyczną i infrastrukturalną [28]. Dwa moduły są istotne dla tematów tego przewodnika:

**[Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/)**, według strony producenta, tworzy zoptymalizowany, wykonalny harmonogram produkcji na podstawie danych z ERP, dostępności zasobów i ograniczeń operacyjnych [26]. Wymienione możliwości:

- automatyczne planowanie maszyn, pracowników i narzędzi z uwzględnieniem zmian, stref, kwalifikacji i zdolności produkcyjnych
- wykrywanie wąskich gardeł, priorytetyzację zleceń oraz widoczność opóźnionych zleceń i ryzyk dostaw
- analizę wpływu i ponowną optymalizację po zakłóceniach, także na podstawie informacji zwrotnych z hali produkcyjnej
- moduł optymalizacji wielkości partii, który wyznacza wielkości partii dla każdego wariantu i maszyny, sekwencję zoptymalizowaną pod kątem przezbrojeń oraz poziomy zapasów równoważące koszt magazynowania z gotowością do dostawy
- wsparcie dla krótkoterminowego planowania operacyjnego i długoterminowego prognozowania zdolności produkcyjnych

**[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)**, według strony producenta, przejmuje zoptymalizowane harmonogramy i przekazuje je pracownikom oraz liderom zmian na hali jako zadania czasowe [27]. Wymienione są: indywidualny widok zadań dla każdego pracownika, widoczność ścieżki krytycznej dla liderów zmian, instrukcje robocze osadzone w zadaniach, możliwość wstrzymania, blokowania lub oznaczania zadań z ustrukturyzowaną informacją zwrotną oraz podgląd WIP na żywo dla planistów. Informacje zwrotne o postępie, opóźnieniach i zakłóceniach wracają do planowania [27].

Opisane funkcje odnoszą się zatem do dwóch punktów, które ten przewodnik uznaje za krytyczne: harmonogramowania z uwzględnieniem rzeczywistych ograniczeń (sekcja 5.2) oraz zamkniętej pętli planu, wykonania i informacji zwrotnej (sekcje 6 i 14). iFAKT GmbH pokazuje na swojej stronie certyfikaty ISO 9001 i ISO/IEC 27001 [27]. Strony produktów nie podają liczby klientów ani wyników liczbowych z ujawnioną metodą [26][27]. Wszystkie powyższe stwierdzenia o możliwościach to deklaracje producenta.

**Perspektywa:** Polaris jest jednym z wielu rozwiązań na rynku. Oceniaj go jak każdy inny system, za pomocą listy kontrolnej z sekcji 13.3 oraz pilotażu na własnych danych. Osobny przewodnik, [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/), jest w przygotowaniu.

## 19. Glosariusz

| Termin | Wyjaśnienie |
|---|---|
| APS (advanced planning and scheduling) | oprogramowanie i metody harmonogramowania z uwzględnieniem skończonej zdolności produkcyjnej i dostępności materiałów, z optymalizacją |
| ATP (available to promise) | ilość, którą można obiecać z zapasu i zaplanowanych dostaw |
| Buffer management | sterowanie oparte na zużyciu buforów czasowych w strefach (zielona, żółta, czerwona) |
| Changeover matrix | tabela zależnych od kolejności czasów przezbrojenia między wariantami |
| CONWIP | sterowanie typu pull ze stałą łączną liczbą zleceń w linii |
| CTP (capable to promise) | osiągalny termin wysyłki z uwzględnieniem materiałów i zdolności produkcyjnej |
| CRP (capacity requirements planning) | etap planowania zdolności produkcyjnych w MRP II; pokazuje obciążenie, ale nie rozwiązuje przeciążeń |
| Cycle time (prawo Little'a) | czas, jaki zlecenie spędza w systemie od zwolnienia do zakończenia; patrz [Lead Time](https://www.m365.fm/entity/lead-time/) |
| Detailed scheduling | harmonogramowanie poszczególnych operacji na zasobach w kolejności i w czasie (niem. *Feinplanung*) |
| Drum-buffer-rope (DBR) | sterowanie wg TOC: wąskie gardło wyznacza tempo, bufor czasowy je chroni, zwolnienie materiału jest z nim powiązane |
| EOQ (economic order quantity) | wzór na optymalną wielkość partii z pierwiastkiem, autorstwa Harrisa (1913); w tekstach niemieckich nazywany wzorem Andlera |
| Finite capacity scheduling | harmonogramowanie, w którym żadna zaplanowana zdolność nie przekracza dostępnej (ISA-95) |
| Flow factor | stosunek czasu realizacji do czasu operacji |
| Frozen zone | zamrożony horyzont planowania, w którym nie są już wykonywane zmiany harmonogramu |
| Heijunka | wyrównywanie wolumenu i asortymentu w czasie |
| Lead time syndrome | błędne koło dłuższych planowanych czasów realizacji, wcześniejszego zwalniania zleceń, większego WIP i jeszcze dłuższych czasów realizacji |
| Prawo Little'a | cycle time = WIP ÷ przepustowość |
| Lot size | ilość produkowana bez przerwy na przezbrojenie; patrz [Batch Size](https://www.m365.fm/entity/batch-size/) |
| MES (manufacturing execution system) | system do realizacji produkcji, zbierania danych i sterowania na hali (ISA-95 poziom 3; VDI 5600) |
| MPS (master production schedule) | program produkcji wyrobów gotowych |
| MRP (material requirements planning) | planowanie materiałowe przez rozwinięcie BOM z planowanymi czasami realizacji |
| MRP II (manufacturing resource planning) | rozszerzenie MRP o planowanie główne, zdolności produkcyjne i planowanie finansowe |
| OTIF (on time in full) | udział pozycji dostarczonych terminowo i w całości |
| PPC | planowanie i sterowanie produkcją (niem. PPS) |
| Setup time | czas przezbrojenia zasobu między dwoma zleceniami; patrz [Setup Time](https://www.m365.fm/entity/setup-time/) |
| Safety stock | zapas chroniący przed wahaniami popytu i czasu realizacji |
| Takt time | czas dostępny ÷ popyt klienta |
| Bottleneck (constraint) | zasób ograniczający przepustowość całego systemu |
| TOC (theory of constraints) | podejście zarządcze, które dopasowuje system do jego ograniczenia |
| WIP (work in process) | zwolnione, jeszcze niezakończone zlecenia na hali produkcyjnej |

## 20. FAQ: oprogramowanie do harmonogramowania produkcji i APS

### Czym jest oprogramowanie do harmonogramowania produkcji?

Oprogramowanie do harmonogramowania produkcji określa, która operacja ma być wykonana na której maszynie lub gnieździe roboczym, w jakiej kolejności i o jakiej godzinie. Dobre narzędzia harmonogramują w oparciu o skończoną zdolność produkcyjną i rzeczywiste ograniczenia, takie jak zmiany, kwalifikacje pracowników, narzędzia i przezbrojenia zależne od kolejności. Wiele narzędzi sprzedawanych pod tą nazwą to planery projektowe lub zasobów; w produkcji sprawdź, czy modelują marszruty, przezbrojenia i dostępność materiałów.

### Czym jest system APS?

APS (advanced planning and scheduling, zaawansowane planowanie i harmonogramowanie) to oprogramowanie planistyczne, które harmonogramuje zlecenia produkcyjne w oparciu o skończoną zdolność maszyn, ludzi i narzędzi oraz dostępność materiałów. Tworzy wykonalne sekwencje i terminy, wykorzystując heurystyki i optymalizację matematyczną.

### Jaka jest różnica między APS a MRP?

MRP oblicza, jakie materiały są potrzebne i kiedy, poprzez rozwinięcie zestawień materiałowych i cofanie się o stałe planowane czasy realizacji. W podstawowej postaci zakłada nieograniczoną zdolność produkcyjną. APS harmonogramuje operacje jednocześnie z uwzględnieniem skończonej zdolności i materiałów, dzięki czemu jego terminy są wykonalne. MRP odpowiada na pytanie „co jest potrzebne”, a APS na pytanie „co faktycznie możemy wyprodukować i kiedy”.

### Jaka jest różnica między APS a ERP? Czy APS zastępuje ERP?

Nie, APS nie zastępuje ERP. ERP jest systemem źródłowym dla zleceń, materiałów, zapasów i finansów. Jego logika planowania (MRP) w podstawowej postaci zakłada nieograniczoną zdolność i stałe czasy realizacji. APS dodaje harmonogramowanie w oparciu o rzeczywistą zdolność i ograniczenia i zwraca realistyczne terminy do ERP.

### Jaka jest różnica między APS a MES?

APS planuje, co i kiedy ma być wykonywane na danym zasobie. MES steruje wykonaniem w czasie rzeczywistym i je rejestruje. ISA-95 umieszcza zarówno harmonogram pracy, jak i jego wykonanie w zarządzaniu operacjami produkcyjnymi (poziom 3) [31], a niemiecka norma VDI 5600 wymienia szczegółowe harmonogramowanie jako zadanie MES [15]. W praktyce harmonogramowanie realizowane jest albo przez moduł MES, albo przez samodzielny APS wymieniający dane z MES.

### Jaka jest różnica między planowaniem produkcji a harmonogramowaniem produkcji?

Planowanie operuje na zagregowanych ilościach, w tygodniowych lub miesięcznych okresach i grupach gniazd roboczych, aby ustalić program i zapotrzebowanie na materiały. Harmonogramowanie przypisuje pojedyncze operacje do zasobów wraz z kolejnością i czasem rozpoczęcia, zazwyczaj w godzinach lub zmianach.

### Jakie są rodzaje harmonogramowania produkcji?

Najbardziej przydatne rozróżnienia to harmonogramowanie przy skończonej i nieskończonej zdolności oraz kierunek harmonogramowania: w przód (najwcześniejszy start, najwcześniejsze zakończenie), wstecz (od terminu realizacji, najpóźniejszy start) oraz oparte na wąskim gardle (najpierw obciążenie wąskiego gardła, następnie harmonogramowanie operacji wcześniejszych wstecz i późniejszych w przód).

### Czy Excel wystarcza do harmonogramowania produkcji?

Czasami. Przy niewielkiej liczbie zleceń, przezbrojeniach prawie niezależnych od kolejności i stabilnym wąskim gardle często wystarcza arkusz kalkulacyjny lub tablica harmonogramowa wraz z dyscypliną sterowania wąskim gardłem (DBR). Oprogramowanie staje się konieczne, gdy liczba ograniczeń i przeplanowań przekracza to, co planowanie ręczne może niezawodnie obsłużyć; pomaga w tym tabela ograniczeń w punkcie 5.2.

### Kiedy APS się opłaca?

Zazwyczaj wtedy, gdy spełnionych jest kilka z poniższych warunków: wiele operacji na zlecenie, przezbrojenia zależne od kolejności, zmienne lub wielokrotne wąskie gardła, deficyt wykwalifikowanej kadry, częste zlecenia pilne, duży nakład pracy na przeplanowania oraz dotrzymywanie terminów, które rozczarowuje mimo wysokich zapasów. Nie ma uniwersalnego progu wielkości firmy.

### Czy APS nadaje się dla małych i średnich producentów?

Tak. Liczy się złożoność planowania, a nie wielkość firmy. Dla małych i średnich producentów dobrze sprawdzają się systemy ze standardowymi łącznikami do ERP, konfiguracją bez kodu niestandardowego i krokowym startem od wąskiego gardła.

### Ile kosztuje oprogramowanie do harmonogramowania produkcji?

Nie istnieje wiarygodny, publicznie dostępny punkt odniesienia cenowego. Proste narzędzia sprzedawane są w abonamencie za użytkownika; większość dostawców APS wycenia według zakładu, zasobów i zakresu. Planuj całkowity koszt posiadania w perspektywie pięciu lat, uwzględniając oczyszczanie danych, integrację, szkolenia i nakład pracy wewnętrznej, i poproś każdego dostawcę o wycenę dla tego samego zakresu.

### Jak znaleźć wąskie gardło w zakładzie?

Dla każdego zasobu porównaj zaplanowane obciążenie, łącznie z przezbrojeniami, z dostępną zdolnością produkcyjną w ciągu kilku tygodni, obserwuj, gdzie trwale tworzą się kolejki, i sprawdź, który zasób powoduje bezczynność obszarów za nim. Wąskim gardłem mogą być także ludzie, stanowiska kontrolne lub narzędzia, a ich położenie przesuwa się wraz ze zmianą asortymentu.

### Czym jest drum-buffer-rope w prostych słowach?

Wąskie gardło to bęben, który wyznacza tempo. Bufor czasowy przed nim chroni go przed zakłóceniami. Lina (rope) wiąże wydawanie materiału z harmonogramem wąskiego gardła, tak aby do produkcji nie wchodziło więcej pracy, niż wąskie gardło jest w stanie przetworzyć [2].

### Jak skrócić czas realizacji w produkcji?

Najszybszą dźwignią jest zwykle ograniczenie WIP, ponieważ zgodnie z prawem Little'a czas realizacji maleje proporcjonalnie do WIP przy stałej przepustowości [9]. Inne dźwignie to mniejsze partie z krótkimi przezbrojeniami, mniejsza zmienność oraz utrzymywanie wykorzystania zasobów niebędących wąskim gardłem poniżej poziomu, przy którym kolejki gwałtownie rosną.

### Jak poprawić dotrzymywanie terminów dostaw?

Planuj z uwzględnieniem skończonej zdolności produkcyjnej, aby obiecane terminy były wykonalne, kontroluj zwolnienia do produkcji na wąskim gardle, ustalaj priorytety dziennych zadań według stanu buforów i systematycznie analizuj przyczyny opóźnionych zamówień. Mierz wyniki dostaw w sposób spójny, na przykład jako OTIF względem potwierdzonego terminu.

### Jak oblicza się ekonomiczną wielkość zamówienia?

Klasyczny wzór EOQ to Q* = √(2 × roczny popyt × koszt przezbrojenia lub zamówienia na partię ÷ roczny koszt utrzymania jednostki). Przy popycie 12 000 sztuk, koszcie przezbrojenia 300 USD i koszcie utrzymania 8 USD wynik wynosi około 949 sztuk. Wzór pomija zdolność produkcyjną i kolejność i jest jedynie wartością wyjściową.

### Jak oblicza się zapas bezpieczeństwa?

Przy zmiennym popycie i stałym czasie realizacji: SS = z × σ_D × √L. Przy odchyleniu standardowym 30 sztuk dziennie, czasie realizacji 9 dni i poziomie obsługi cyklu 95% (z = 1,645) otrzymujesz około 148 sztuk. Jeśli czas realizacji również ulega zmianom, wartość ta gwałtownie rośnie.

### Czy AI może przejąć planowanie produkcji?

AI poprawia prognozy czasów obróbki i przezbrojeń, wykrywa wzorce zakłóceń i przyspiesza wyszukiwanie dobrych harmonogramów. Nie zastępuje czystych danych wzorcowych ani uzgodnienia celów i reguł. Bez wiarygodnych danych potwierdzeń AI uczy się również na złych danych.

### Ile trwa wdrożenie APS?

Zależy to przede wszystkim od jakości danych, nakładu prac integracyjnych i zakresu. Pilotaż w obszarze wąskiego gardła może działać w ciągu kilku miesięcy; pełne wdrożenie w kilku obszarach trwa dłużej. Brak jest solidnych, niezależnych badań dotyczących typowych czasów wdrożenia.

### Czy APS zastępuje planistów produkcji?

Nie. APS przejmuje obliczenia, a nie decyzje. Planiści ustalają priorytety, utrzymują reguły i dane, obsługują wyjątki i wybierają między scenariuszami. W udanych wdrożeniach planiści poświęcają mniej czasu na odbudowę harmonogramów, a więcej na przyczyny opóźnień.

## 21. Zakończenie

Harmonogramy produkcyjne rzadko zawodzą dlatego, że planiści nie dokładają starań. Zawodzą, ponieważ logika planowania zakłada nieograniczoną zdolność produkcyjną i stałe czasy realizacji. Fizyka fabryki jest jasna: czas realizacji wynika z WIP i przepustowości, kolejki gwałtownie rosną przy wysokim wykorzystaniu, a wąskie gardło determinuje, ile zakład jest w stanie dostarczyć.

APS odpowiada dokładnie na ten problem. Planuje w oparciu o ograniczoną zdolność produkcyjną i rzeczywiste ograniczenia, umożliwia obliczenie terminów wysyłek i pokazuje konsekwencje zakłóceń oraz pilnych zleceń, zanim one wystąpią. Przynosi wyniki tylko razem z trzema rzeczami, których żadne oprogramowanie nie zapewni: wyraźnym skupieniem na wąskim gardle, kontrolowanym zwalnianiem zleceń oraz danymi wzorcowymi i potwierdzeniami zgodnymi z rzeczywistością.

Zacznij więc od prostej kolejności: zidentyfikuj wąskie gardło, zmierz i ogranicz WIP, uporządkuj dane wąskiego gardła, a następnie przetestuj oprogramowanie do planowania produkcji z funkcjami APS w pilotażu na własnych danych. Dzięki temu arkusz Excel pełniący rolę cienia harmonogramu zostanie zastąpiony nie nową czarną skrzynką, lecz harmonogramem, któremu zaufają produkcja, sprzedaż i klienci.

## Dalsza lektura na m365.fm

**Wpisy**

- [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/)
- [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)

**Strony encyklopedyczne**

[Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Buffer Management](https://www.m365.fm/entity/buffer-management/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Line Balancing](https://www.m365.fm/entity/line-balancing/) · [Batch Size](https://www.m365.fm/entity/batch-size/) · [Safety Stock](https://www.m365.fm/entity/safety-stock/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [iFAKT](https://www.m365.fm/entity/ifakt/)

**Powiązane przewodniki**

- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** jest prowadzącym m365.fm i pracuje w iFAKT GmbH. Na m365.fm pisze o planowaniu i harmonogramowaniu produkcji, szczupłym wytwarzaniu oraz cyfrowej transformacji produkcji. W [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), twórcy [iFAKT Polaris](https://www.m365.fm/entity/polaris/), zajmuje się tym, jak planowanie oparte na ograniczeniach, cyfrowe bliźniaki i informacje zwrotne z hali produkcyjnej łączą się tak, aby harmonogramy utrzymywały się na hali produkcyjnej.

**Uwaga: Autor pracuje w iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press 1984 (3rd rev. ed. 2004, ISBN 978-0-88427-178-9).
2. Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
3. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html
4. Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, Mokshagundam L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
5. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636
6. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
7. Schuh, Günther; Stich, Volker (eds.): Produktionsplanung und -steuerung 1. Grundlagen der PPS [Production planning and control 1: Fundamentals]. 4th rev. ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-642-25422-2. (German)
8. Nyhuis, Peter; Wiendahl, Hans-Peter: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-540-92838-6. DOI: 10.1007/978-3-540-92839-3 (German). English edition: Nyhuis, Peter; Wiendahl, Hans-Peter: Fundamentals of Production Logistics. Theory, Tools and Applications. Springer, Berlin/Heidelberg 2009 (published October 2008), ISBN 978-3-540-34210-6, DOI: 10.1007/978-3-540-34211-3
9. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383
10. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
11. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
12. Lödding, Hermann: Verfahren der Fertigungssteuerung. Grundlagen, Beschreibung, Konfiguration [Production control methods]. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2016, ISBN 978-3-662-48458-6 (print), 978-3-662-48459-3 (e-book). (German)
13. Fleischmann, Bernhard; Meyr, Herbert; Wagner, Michael: Advanced Planning. In: Stadtler, Hartmut; Kilger, Christoph; Meyr, Herbert (eds.): Supply Chain Management and Advanced Planning. Concepts, Models, Software, and Case Studies. 5th ed., Springer, Berlin/Heidelberg 2015, pp. 71–95. DOI: 10.1007/978-3-642-55309-7_4 (book: DOI 10.1007/978-3-642-55309-7)
14. Garey, M. R.; Johnson, D. S.; Sethi, Ravi: The Complexity of Flowshop and Jobshop Scheduling. Mathematics of Operations Research 1 (1976) 2, pp. 117–129. DOI: 10.1287/moor.1.2.117
15. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 ; table of contents: https://www.vdi.de/fileadmin/pages/vdi_de/redakteure/richtlinien/inhaltsverzeichnisse/2436698.pdf (German guideline of the Association of German Engineers)
16. VDI 3633 Part 1: Simulation of systems in materials handling, logistics and production – Fundamentals. Edition December 2014. https://din.de/de/wdc-beuth:din21:149034959 (German guideline)
17. Harris, Ford W.: How Many Parts to Make at Once. Factory, The Magazine of Management 10 (1913) 2, pp. 135–136; and Erlenkotter, Donald: Ford Whitman Harris and the Economic Order Quantity Model. Operations Research 38 (1990) 6, pp. 937–946. DOI: 10.1287/opre.38.6.937
18. Andler, Kurt: Rationalisierung der Fabrikation und optimale Losgröße. Oldenbourg, Munich/Berlin 1929 [unverified: bibliographic details and first name not verified online, original not consulted; formula and assumptions per University of Duisburg-Essen, exercise "Statische Losgröße – Andler-Modell": https://www.uni-due.de/imperia/md/content/tul/de_ss2013_lm01_uebung_statische_losgroesse_andler_modell.pdf].
19. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4th ed., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
20. Ohno, Taiichi: Toyota Production System. Beyond Large-Scale Production. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-14-0.
21. Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
22. Boysen, Nils; Fliedner, Malte; Scholl, Armin: A classification of assembly line balancing problems. European Journal of Operational Research 183 (2007) 2, pp. 674–693. Reference: https://econpapers.repec.org/RePEc:eee:ejores:v:183:y:2007:i:2:p:674-693
23. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193
24. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975.
25. Logistik Heute: SCM-Studie: Mehr als ein Drittel der deutschen Unternehmen nutzt Excel als Rückgrat für die Lieferkettenplanung (IDC for Kinaxis), April 18, 2024. https://logistik-heute.de/news/scm-studie-mehr-als-ein-drittel-der-deutschen-unternehmen-nutzt-excel-als-rueckgrat-fuer-die-lieferkettenplanung-104313.html (German)
26. iFAKT GmbH: Polaris Optimizer. https://www.ifakt.de/en/solutions/optimizer
27. iFAKT GmbH: Polaris Operator. https://www.ifakt.de/en/solutions/operator
28. iFAKT GmbH: Home page. https://www.ifakt.de/
29. Pinedo, Michael L.: Scheduling. Theory, Algorithms, and Systems. 5th ed., Springer, Cham 2016. DOI: 10.1007/978-3-319-26580-3
30. MPDV Mikrolab GmbH: APS-Systeme einfach erklärt (Smart Factory glossary, with VACOM customer example). https://www.mpdv.com/industrie-4-0/smart-factory-glossar/advanced-planning-and-scheduling-system-aps (German)
31. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation. Preview incl. clause 3.1 definition of finite capacity scheduling: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf
32. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis, 1,800 respondents in nine countries incl. USA and Canada, fielded December 2023), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours
33. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf
34. Lean Enterprise Institute: Lean Lexicon, "Heijunka." https://www.lean.org/lexicon-terms/heijunka/
35. National Institute of Standards and Technology (NIST): The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
36. U.S. Department of Defense: Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), final rule. Federal Register 90 (2025) 173, September 10, 2025, effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
