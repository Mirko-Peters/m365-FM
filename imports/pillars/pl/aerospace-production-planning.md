# SEO metadata

| Field | Value |
|---|---|
| Meta title | Planowanie produkcji lotniczej: kompletny przewodnik dla dostawców |
| Meta description | Planowanie produkcji lotniczej wyjaśnione: AS9100, FAA Part 21/145, identyfikowalność, krzywe uczenia, wzrost tempa produkcji, APS i planowanie MRO z przykładami. |
| Slug | `aerospace-production-planning` |

# Planowanie produkcji lotniczej: kompletny przewodnik dla dostawców i warsztatów MRO

*Stan na dzień 20 listopada 2026 r. · Na podstawie danych branżowych i firmowych, norm IAQG/SAE, przepisów FAA i EASA oraz literatury technicznej (patrz Źródła)*

> **Krótka odpowiedź:** Planowanie produkcji lotniczej polega na dopasowaniu wymaganych przez klientów tempa dostaw do ograniczonych zdolności produkcyjnych, długich czasów realizacji, certyfikowanych procesów specjalnych i pełnej identyfikowalności. W przeciwieństwie do branż wielkoseryjnych nie wystarczy dotrzymać terminu. Trzeba też udowodnić, jak część została wykonana: każda część wymaga udokumentowanego pochodzenia, zatwierdzonej konfiguracji i nadzorowanego procesu, a te dowody trzeba planować tak samo jak godziny maszynowe.

Wtorek rano u dostawcy drugiego poziomu (Tier 2) części konstrukcyjnych. Klient podniósł zapotrzebowanie na dostawy w następnym kwartale o jedną piątą, ponieważ producent samolotów zwiększa tempo produkcji. Gniazda obróbki pięcioosiowej pracują już na trzy zmiany. Obróbka cieplna trafia do zewnętrznego zakładu akredytowanego w ramach Nadcap, z trzytygodniowym czasem realizacji. Właśnie przyszła zmiana konstrukcyjna dla dwóch numerów części, co uruchamia częściową kontrolę pierwszego egzemplarza. A od wczoraj dział jakości szuka certyfikatu materiałowego partii tytanu, ponieważ klient ma pytanie dotyczące partii, która już wysłano.

Każde z tych zadań można rozwiązać osobno. Trudność polega na tym, że wszystkie trafiają w tym samym czasie do tego samego planu. Właśnie to odróżnia planowanie produkcji lotniczej od planowania w wielu innych branżach: planuje ono nie tylko ilości i terminy, ale także dowody, zatwierdzenia i konfiguracje. Dzieje się to na rynku, na którym portfele zamówień producentów samolotów są pełne na lata, a łańcuch dostaw zatrzymuje się w kilku miejscach jednocześnie.

Ten przewodnik jest przeznaczony dla kierowników zakładów, kierowników planowania i harmonogramowania oraz kierowników jakości u dostawców lotniczych, a także dla planistów w warsztatach konserwacji, napraw i remontów (MRO) oraz w stacjach napraw. Czytelnicy szukający informacji o harmonogramowaniu produkcji lotniczej znajdą stronę harmonogramowania (skończone zdolności, APS, kontrola wąskich gardeł) w rozdziałach 5, 10 i 11. Przewodnik omawia sytuację rynkową w 2026 r. z podanymi źródłami liczb, to, co odróżnia tę branżę, właściwe normy i przepisy po obu stronach Atlantyku (FAA i EASA), identyfikowalność i genealogię, krzywe uczenia się Wrighta z przykładem obliczeniowym, planowanie narastania tempa produkcji, planowanie zdolności z APS i symulacją, planowanie MRO z nieplanowanymi ustaleniami, wskaźniki KPI, podejście krok po kroku oraz typowe błędy. Krótkie wprowadzenie do związku między czasem realizacji a identyfikowalnością znajduje się także we wpisie [Aerospace production planning: lead time and traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) na m365.fm.

Uwaga dotycząca kontekstu europejskiego: pierwotna wersja tego przewodnika powstała dla dostawców niemieckich, a znaczna część globalnego łańcucha dostaw dla Airbusa przebiega przez Europę. Tam, gdzie europejskie przepisy (EASA, normy EN) mają znaczenie dla firm z USA, na przykład przy dostawach dla europejskich klientów lub przy posiadaniu podwójnych zatwierdzeń FAA/EASA, przewodnik wyjaśnia je obok ich odpowiedników amerykańskich.

### Kluczowe wnioski

- **Popyt istnieje, zdolności produkcyjnych brakuje.** Airbus miał na koniec września 2026 roku portfel zamówień na 9 310 samolotów komercyjnych [3]; Boeing podał na tę samą datę portfel zamówień komercyjnych przekraczający 6 300 samolotów [47]. Tempo produkcji rośnie wolniej, niż zaplanowano, ponieważ brakuje silników, odlewów i wyprasek, surowców oraz wykwalifikowanej siły roboczej [4][10].
- **Planowanie w tym środowisku oznacza planowanie pod obciążeniem dowodowym.** Norma AS9100D wymaga między innymi zarządzania konfiguracją, identyfikowalności i zapobiegania częściom podrobionym [14][44]. Posiadacze zatwierdzenia produkcji FAA muszą prowadzić system jakości obejmujący nadzór nad dostawcami, zapisy jakościowe oraz wyciekające wady jakości [41]. Każda zmiana konstrukcyjna może wywołać pełną lub częściową kontrolę pierwszego egzemplarza zgodnie z AS9102 [18][46].
- **Czas realizacji to w większości czas oczekiwania.** Prawo Little'a mówi: czas realizacji = praca w toku ÷ przepustowość [27]. Poza procesami specjalnymi typowymi źródłami oczekiwania są pętle kontroli i zatwierdzenia.
- **Krzywe uczenia są danymi wejściowymi planowania.** Wright wykazał w 1936 roku, że nakład pracy na samolot spadał o około 20 % za każdym razem, gdy skumulowana produkcja się podwajała [24][25]. Jeśli planujesz uruchomienie produkcji z normatywnymi godzinami z okresu dojrzałego tempa, planujesz zbyt małe zdolności produkcyjne.
- **Zwiększanie produkcji zawodzi w wąskim gardle, a nie przeciętnie.** Wzrost tempa o 20 % znacznie mocniej uderza w zasób pracujący z wykorzystaniem na poziomie 85 %, niż sugerowałaby całkowita zdolność produkcyjna.
- **Planowanie MRO musi uwzględniać niewiadome.** Zakres wizyty warsztatowej staje się znany dopiero po inspekcji. Dobre planowanie MRO opiera się na prawdopodobieństwach wykrycia uszkodzeń, buforach oraz dostępności części.
- **Żaden algorytm nie naprawi błędnych danych głównych.** APS, symulacje i cyfrowe bliźniaki wymagają poprawnych marszrut, norm czasowych, zdolności produkcyjnych i danych certyfikacyjnych.

### Szybkie ścieżki lektury

| Jesteś… | Najpierw przeczytaj |
|---|---|
| Kierownikiem zakładu u dostawcy, który stoi przed wzrostem tempa produkcji | Rozdziały 1, 9 i 10 (rynek, krzywa uczenia, zwiększanie produkcji z listą kontrolną) |
| Planistą produkcji lub szeregowania z nierealistycznymi planami z ERP | Rozdziały 5, 6 i 11 (poziomy planowania, czas realizacji, APS i symulacja) |
| Kierownikiem ds. jakości | Rozdziały 3, 4 i 8 (normy i przepisy, identyfikowalność, zmiany inżynieryjne) |
| Planistą MRO w stacji napraw | Rozdziały 3, 4 i 13 (Part 145, części o ograniczonym resursie, planowanie MRO) |
| Liderem IT, cyfrowym lub ds. cyberbezpieczeństwa | Rozdziały 3.6, 4, 11, 14 i 16 (ITAR/CMMC, model danych, APS, cyfrowy bliźniak, podejście) |

## Spis treści

1. [Rynek 2026: dlaczego planowanie stało się wąskim gardłem](#1-rynek-2026-dlaczego-planowanie-stało-się-wąskim-gardłem)
2. [Co odróżnia planowanie produkcji w lotnictwie od innych branż](#2-co-wyróżnia-planowanie-produkcji-lotniczej-na-tle-innych-branż)
3. [Normy i przepisy istotne dla planowania](#3-normy-i-przepisy-istotne-dla-planowania)
4. [Identyfikowalność i genealogia](#4-identyfikowalność-i-genealogia)
5. [Poziomy planowania: od tempa dostaw klienta do operacji](#5-poziomy-planowania-od-tempa-klienta-do-operacji)
6. [Zrozumienie i skracanie czasu realizacji](#6-zrozumienie-i-skracanie-czasu-realizacji)
7. [Planowanie procesów specjalnych i operacji zewnętrznych](#7-planowanie-procesów-specjalnych-i-operacji-zewnętrznych)
8. [Zmiany inżynieryjne i zarządzanie konfiguracją](#8-zmiany-inżynieryjne-i-zarządzanie-konfiguracją)
9. [Krzywe uczenia Wrighta: teoria i przykład obliczeniowy](#9-krzywe-uczenia-wrighta-teoria-i-przykład-obliczeniowy)
10. [Planowanie wzrostu tempa produkcji: obliczenia i lista kontrolna](#10-planowanie-zwiększenia-tempa-produkcji-obliczenia-i-lista-kontrolna)
11. [Planowanie zdolności produkcyjnych z APS, zarządzanie wąskimi gardłami i symulacja](#11-planowanie-zdolności-produkcyjnych-z-aps-zarządzanie-wąskimi-gardłami-i-symulacja)
12. [Ryzyka łańcucha dostaw 2022–2026 i ich znaczenie dla planowania](#12-ryzyka-łańcucha-dostaw-w-latach-20222026-i-ich-znaczenie-dla-planowania)
13. [Planowanie MRO: obsługa techniczna z niezaplanowanymi ustaleniami](#13-planowanie-mro-obsługa-z-nieplanowanymi-ustaleniami)
14. [Cyfrowy bliźniak i cyfrowa nić](#14-cyfrowy-bliźniak-i-cyfrowa-nić)
15. [KPI dla planowania i kontroli](#15-kpi-do-planowania-i-sterowania)
16. [Podejście: sześć kroków do niezawodnego planu](#16-podejście-sześć-kroków-do-wiarygodnego-planu)
17. [Typowe błędy i jak ich unikać](#17-typowe-błędy-i-jak-ich-unikać)
18. [iFAKT a lotnictwo](#18-ifakt-i-lotnictwo)
19. [Słowniczek](#19-glosariusz)
20. [FAQ: najczęstsze pytania dotyczące planowania produkcji w lotnictwie](#20-faq-najczęstsze-pytania-dotyczące-planowania-produkcji-lotniczej)
21. [Podsumowanie](#21-podsumowanie)

## 1. Rynek 2026: dlaczego planowanie stało się wąskim gardłem

### 1.1 Rekordowy popyt, ograniczone zdolności dostaw

Lotnictwo komercyjne znajduje się w nietypowej sytuacji: popyt na nowe samoloty nigdy nie był wyższy, ale branża nie jest w stanie dostarczać ich w tempie, którego oczekują klienci. Według badania, które stowarzyszenie linii lotniczych IATA przedstawiło wspólnie z Oliver Wyman w październiku 2025 roku, globalny portfel zamówień na samoloty komercyjne osiągnął rekordowy poziom ponad 17 000 samolotów w 2024 roku. W latach 2010–2019 wynosił średnio około 13 000 [9]. Badanie szacuje, że opóźnienia dostaw kosztowały linie lotnicze ponad 11 mld USD w 2025 roku. Największe pozycje to nadmierne zużycie paliwa przez starsze samoloty (około 4,2 mld USD), dodatkowa obsługa techniczna (3,1 mld USD), dzierżawa silników (2,6 mld USD) oraz wyższe zapasy części zamiennych (1,4 mld USD) [9].

Liczby dla dwóch dużych producentów pokazują obraz szczegółowo:

| Wskaźnik | Airbus | Boeing |
|---|---|---|
| Dostawy 2025 | 793 samoloty komercyjne, w tym 607 z rodziny A320 [2] | 600 samolotów komercyjnych, w tym 447 Boeing 737 [6] |
| Portfel zamówień | 8 754 na koniec 2025 roku [2]; 9 310 na koniec września 2026 roku [3] | ponad 6 100 na koniec 2025 roku, o wartości około 567 mld USD [6]; ponad 6 300 na koniec września 2026 roku, o wartości 611,8 mld USD [47] |
| Cel na 2026 rok | około 870 dostaw [3] | brak prognozy ilościowej w cytowanych źródłach |
| Stan na 2026 rok | 547 dostaw do 30 września [3]; 621 do końca października [5] | 161 dostaw w III kwartale 2026 roku, w tym 124 Boeing 737 [47]; program 737 nadal dąży do ustabilizowanej produkcji na poziomie 47 miesięcznie; 787 stabilnie na poziomie 8 miesięcznie [47] |

### 1.2 Cele tempa produkcji i dlaczego ciągle się zmieniają

Dla dostawców miesięczne tempo produkcji producenta samolotów jest najważniejszym parametrem wejściowym planowania, ponieważ napędza zlecenia na wszystkich poziomach łańcucha dostaw. W raporcie za pierwsze dziewięć miesięcy 2026 roku Airbus podaje następujące cele: 70–75 samolotów rodziny A320 miesięcznie do końca 2027 roku, a następnie stabilizację na poziomie 75; tempo 12 dla A350 w 2028 roku; tempo 13 dla A220 w 2028 roku; oraz tempo 5 dla A330 w 2029 roku [3].

Historia celu „rate 75” pokazuje, jak zmienne mogą być takie założenia. Airbus pierwotnie chciał osiągnąć tę wielkość produkcji w latach 2025–2026. Pod koniec 2024 roku cel przesunięto na 2027 rok [4]. W kwietniu 2026 roku prezes Airbusa Guillaume Faury publicznie obwinił Pratt & Whitney za niedostarczenie zamówionej liczby silników i mówił o niedoborach, które nie odpowiadały ani popytowi, ani zamówieniom [4]. Branżowe media uważają możliwe przesunięcie osiągnięcia rate 75 na 2028 rok [4]. Docelowy przedział od 70 do 75 pod koniec 2027 roku odzwierciedla stan z 28 października 2026 roku [3].

W Boeingu FAA ograniczyła produkcję 737 MAX do 38 samolotów miesięcznie po wypadnięciu zaślepki drzwi w samolocie Alaska Airlines w styczniu 2024 roku. W październiku 2025 roku FAA zatwierdziła podwyższenie limitu do 42 [7]. W maju 2026 roku prezes Boeinga Kelly Ortberg powiedział, że linia pracuje już w tempie 47; kolejny krok do 52 określił jako znacznie większe obciążenie ze względu na poziom zapasów w łańcuchu dostaw [8]. Raport kwartalny Boeinga z 27 października 2026 roku opisuje program 737 jako wciąż postępujący w kierunku ustabilizowanej produkcji na poziomie 47 miesięcznie [47].

**Co to oznacza dla Twojego planowania:** Cele tempa produkcji nie są zobowiązaniami. Są założeniami planistycznymi obarczonymi istotną niepewnością. Dostawca, który buduje zdolności wyłącznie pod oficjalny cel, ryzykuje koszty bezczynności. Dostawca, który buduje za późno, sam staje się wąskim gardłem, w branży, w której jedna brakująca część wstrzymuje cały samolot. Solidne planowanie opiera się więc na scenariuszach (na przykład rate 60, 67 i 75) oraz na z góry zdefiniowanych wyzwalaczach inwestycyjnych.

### 1.3 Branża w liczbach: Stany Zjednoczone i Niemcy

Przemysł lotniczy i obronny USA jest największy na świecie. Według Aerospace Industries Association (AIA) oraz S&P Global Market Intelligence branża osiągnęła w 2025 roku łączną sprzedaż na poziomie 988,6 mld USD (AIA podaje łączną aktywność biznesową na poziomie 1 bln USD) i zapewniła zatrudnienie około 2,1 mln osób. Około 1,1 mln tych miejsc pracy i blisko 483 mld USD aktywności przypada na krajowy łańcuch dostaw. Eksport wyniósł 172,7 mld USD, co oznacza wzrost o 25 % rok do roku [48]. Innymi słowy, około połowa miejsc pracy znajduje się u dostawców, czyli w grupie, do której adresowany jest ten przewodnik.

Niemcy to mniejsza, ale ważna część łańcucha dostaw Airbusa i rodzimy rynek pierwotnej wersji tego przewodnika. Niemieckie Stowarzyszenie Przemysłu Lotniczego i Kosmicznego (BDLI) podało w maju 2026 roku rekordowe wyniki: 62 mld EUR przychodów w 2025 roku (2024: 52 mld EUR, wzrost o 19 %) oraz 130 000 zatrudnionych (rok wcześniej: 120 000). Lotnictwo cywilne jest największym segmentem z przychodami w wysokości 45 mld EUR (wzrost o 15 %), następnie lotnictwo wojskowe z 13,5 mld EUR (wzrost o 35 %) i kosmonautyka z 3,5 mld EUR. Udział eksportu wyniósł 66 %, a nakłady na badania i rozwój wyniosły około 4 mld EUR [1].

Za tymi liczbami, po obu stronach Atlantyku, stoją liczni mali i średni dostawcy obok producentów OEM i dużych integratorów systemów. Wytwarzają elementy konstrukcyjne, komponenty kabin, części silników, układy oraz procesy specjalne, lub świadczą usługi utrzymania ruchu. Szczególnym wyzwaniem planistycznym dla tych firm jest przejście od niedowykorzystania mocy (2020–2022) do trwałego przeciążenia.

### 1.4 Perspektywa dostawców: co pokazują badania

Firma doradcza Roland Berger przebadała na początku 2026 roku 95 firm z łańcucha dostaw lotnictwa [10]. Wyniki są wymowne dla każdego odpowiedzialnego za planowanie:

- 55 % firm zgłasza zakłócenia w łańcuchu dostaw (2025: 64 %).
- Około 80 % widzi średnie do wysokiego ryzyko niedoborów krytycznych surowców; najczęściej wymieniane są tytan, stal, miedź, metale ziem rzadkich i magnesy.
- 56 % zgłasza brak wykwalifikowanych pracowników (rok wcześniej: 65 %). Pozostaje to najczęstszą barierą w zwiększaniu produkcji.
- Prawie 40 % nie ma wystarczających zdolności produkcyjnych.
- Około jedna trzecia działa przy marży EBIT poniżej 5 %, a 40 % zbudowało wyższe zapasy przed rozpoczęciem produkcji, co dodatkowo obciąża marże.
- Długie terminy realizacji dotyczą nie tylko materiałów, ale także usług takich jak badania, obróbka powierzchniowa i wykończenie.

Ankieta przeprowadzona wcześniej wskazuje ten sam kierunek z perspektywy planowania. W ocenie gotowości do zwiększenia tempa produkcji obejmującej ponad 100 dostawców z Azji, Europy i USA firma doradcza Vendigital stwierdziła, że 38 % z nich miało nieodpowiednie procesy planowania mocy produkcyjnych. Jako przyczyny wymieniła braki kompetencji, nieznany stan parku maszynowego i urządzeń, zaniedbane programy utrzymania ruchu oraz słabą komunikację między planistami na wyższym szczeblu a halą produkcyjną [55]. Artykuł nie podaje daty publikacji; odwołuje się do planu Airbusa z 2021 roku, zakładającego osiągnięcie tempa 75 samolotów miesięcznie do 2025 roku, zatem dane mają już kilka lat.

Ostatni punkt z listy Roland Bergera ma kluczowe znaczenie dla planowania: procesy specjalne i inspekcje same stały się wąskimi gardłami w wielu łańcuchach dostaw. Sekcja 7 omawia, jak sobie z tym radzić.

## 2. Co wyróżnia planowanie produkcji lotniczej na tle innych branż

Wiele zasad planowania obowiązuje w każdej produkcji dyskretnej. Przemysł lotniczy łączy jednak kilka cech, które same w sobie są znane, lecz razem wymagają odrębnej logiki planowania.

### 2.1 Duża różnorodność, małe serie i wiele wariantów

Dostawca lotniczy zazwyczaj wytwarza wiele numerów części w małych ilościach. Nawet przy tempie 75 samolotów miesięcznie oznacza to około 3,5 samolotu dziennie roboczego (przy około 21 dniach roboczych w miesiącu). Część montowana raz na samolot ma więc dzienne zapotrzebowanie rzędu pojedynczych sztuk. Do tego dochodzą warianty zależne od klienta (konfiguracja kabiny), zapotrzebowanie na części zamienne oraz części do starszych modeli. Efektem jest środowisko o dużej różnorodności i małej liczbie sztuk (HMLV), w którym przezbrojenia, zmiany programów i nakład inspekcji pochłaniają dużą część zdolności produkcyjnych.

### 2.2 Długie czasy realizacji i głębokie struktury materiałowe

Część konstrukcyjna z tytanu może spędzić wiele tygodni między surowcem a wysyłką: kucie lub odlewanie, obróbka zgrubna, obróbka cieplna, obróbka wykańczająca, badania nieniszczące (NDT), obróbka powierzchniowa, kontrola końcowa. Kilka z tych etapów często odbywa się u zewnętrznych podwykonawców specjalistycznych. Struktury materiałowe dużych zespołów są silnie zagnieżdżone; samolot składa się z milionów części, które łączą się w wielu poziomach dostawców. Konsekwencja jest taka: opóźnienie na niższym poziomie często pojawia się na linii montażu końcowego dopiero po kilku tygodniach. Jeżeli nie rozumiesz i aktywnie nie zarządzasz [czasem realizacji](https://www.m365.fm/entity/lead-time/), planujesz z buforami, o których nie wiesz.

### 2.3 Certyfikacja, kwalifikacja i dowody

W lotnictwie nie wystarczy wykonać część zgodnie z wymiarami. Musi ona powstać przy zwolnionym procesie, na kwalifikowanym sprzęcie, przez wykwalifikowanych pracowników, z certyfikowanego materiału i w zatwierdzonej konfiguracji, a wszystko to musi zostać udokumentowane. Ma to bezpośrednie konsekwencje dla planowania: zlecenia nie można po prostu przenieść na wolną, ale niekwalifikowaną maszynę. Pracownik bez ważnych uprawnień do procesu specjalnego nie stanowi z punktu widzenia planowania zdolności produkcyjnej. Zmiana dostawcy może wymagać nowej inspekcji pierwszej sztuki.

### 2.4 Logika tempa zamiast logiki wielkości partii

Producenci samolotów planują w miesięcznych tempach, które ogłaszane są z wieloletnim wyprzedzeniem i podnoszone krok po kroku. Dostawca musi przełożyć to tempo na własne partie produkcyjne, nie tracąc rytmu dostaw dla klienta. Jednocześnie skoki tempa rzadko są płynne: klient buduje zapasy, przesuwa zwolnienia w czasie lub je przyspiesza. Dobre planowanie oddziela więc tempo klienta (czego klient potrzebuje w długim okresie) od zwolnień (co klient zamawia w krótkim terminie) i śledzi różnicę między nimi.

### 2.5 Długie cykle życia produktu

Typ samolotu jest często budowany przez dziesięciolecia, a eksploatowany jeszcze dłużej. Oznacza to, że rewizje rysunków, specyfikacje materiałowe i zatwierdzenia procesów pozostają ważne przez długi czas, ale stale się zmieniają. Części zamienne do starszych konfiguracji muszą być nadal dostępne. A zapisy trzeba przechowywać przez bardzo długie okresy. Zgodnie z przepisami FAA posiadacz zatwierdzenia produkcji musi przechowywać zapisy jakości co najmniej przez 5 lat dla wyrobów i części wytwarzanych w ramach zatwierdzenia oraz co najmniej przez 10 lat dla części krytycznych [41]; wymagania klientów często idą dalej. W praktyce okresy przechowywania wynikają z zapisów przenoszonych od klientów (flow-down) i obowiązujących przepisów.

### 2.6 Wysoki koszt błędu

Wadliwa część, która trafia do klienta (ucieczka, ang. escape), może wywołać przeróbki na linii montażu końcowego, kontrole dostarczonych samolotów, a w skrajnych przypadkach uziemienie. FAA traktuje to jako odrębny temat systemu jakości: 14 CFR 21.137 wymienia „quality escapes” (ucieczki jakościowe) jako jeden z wymaganych elementów systemu jakości posiadacza zatwierdzenia produkcji [41]. Silnik Pratt & Whitney GTF pokazuje, do czego może doprowadzić wada materiałowa (Rozdział 12). Dla planowania oznacza to, że kontrole jakości nie są buforem, który można skrócić, gdy harmonogram jest napięty. Są stałymi elementami marszruty.

## 3. Normy i przepisy istotne dla planowania

### 3.1 Skrócony przegląd rodziny norm IAQG

Międzynarodowa Grupa Jakości Lotniczej (IAQG, International Aerospace Quality Group) opracowuje normy jakości dla branży. Są one publikowane w Ameryce jako normy AS (przez SAE International), w Europie jako normy EN, a w Azji jako normy JISQ; treść jest identyczna. Podstawową normą jest 9100, uzupełnianą normami dla organizacji utrzymania ruchu (9110), dystrybutorów (9120), kontroli pierwszej sztuki (9102), zarządzania zmiennością charakterystyk kluczowych (9103) i innymi [13]. W USA najczęściej spotyka się oznaczenia AS, np. AS9100D, AS9102C, AS9145; europejscy klienci i dokumenty używają EN 9100 i tak dalej. Odnoszą się one do tych samych wymagań.

Po stronie regulacyjnej dla większości dostawców istotne są dwa systemy: amerykańska Federalna Administracja Lotnictwa (FAA), której przepisy znajdują się w Tytule 14 Kodeksu Przepisów Federalnych (14 CFR), oraz Europejska Agencja ds. Bezpieczeństwa Lotniczego (EASA). Co myląco, oba systemy mają „Part 21” i „Part 145”, a w obu systemach Podczęść G części 21 dotyczy zatwierdzeń produkcji. Treść jest zbliżona pod względem celu, ale nie identyczna.

Poniższa tabela podsumowuje to, co jako kierownik planowania powinien Pan/Pani wiedzieć:

| Norma / przepis | Zawartość | Wpływ na planowanie |
|---|---|---|
| **AS9100D** (EN 9100:2018, JISQ 9100:2016) | System zarządzania jakością dla lotnictwa, przemysłu kosmicznego i obronnego; obejmuje ISO 9001:2015 oraz około 105 dodatkowych wymagań branżowych, w tym zarządzanie konfiguracją, zarządzanie ryzykiem, bezpieczeństwo produktu, zapobieganie częściom podrobionym, identyfikowalność oraz terminowość dostaw [14][44] | Terminowość dostaw staje się wskaźnikiem poddawanym audytowi; identyfikowalność materiału, procesów, narzędzi i osób musi towarzyszyć przepływowi zleceń [14] |
| **AS9102C** (2023; EN 9102:2024) | Kontrola pierwszego egzemplarza (FAI): pełna weryfikacja pierwszej części z procesu produkcyjnego pod kątem wszystkich cech konstrukcyjnych [17][18][46] | Planować nakład pracy FAI jako odrębną operację; zmiany konstrukcji, materiału, źródła, procesu, oprzyrządowania lub lokalizacji oraz przerwa w produkcji dłuższa niż dwa lata wymuszają pełną lub częściową kontrolę FAI [18][34] |
| **AS9103 / EN 9103:2023** | Zarządzanie zmiennością cech kluczowych [19] | Cechy kluczowe wymagają badań zdolności procesu i kart kontrolnych; to angażuje moce kontrolne i wpływa na wielkość partii oraz częstotliwość kontroli |
| **AS9145** (2016; EN 9145:2018) | Zaawansowane planowanie jakości produktu (APQP) i proces zatwierdzania części produkcyjnych (PPAP) w lotnictwie, pięć faz od planowania do produkcji seryjnej [16][35][45] | Gotowość produkcyjną trzeba wykazać przy tempie wymaganym przez klienta (przegląd gotowości produkcyjnej, próbne serie w tempie); planowanie uruchomienia i dowód zdolności produkcyjnej stają się częścią zatwierdzenia [35] |
| **AS9110 / EN 9110:2018** | System zarządzania jakością dla organizacji utrzymania ruchu statków powietrznych [20] | Dodaje wymagania systemu jakości dla Part 145; istotne dla procesów planowania, kontroli dostawców i wskaźników KPI w MRO |
| **AS9120 / EN 9120** | System zarządzania jakością dla dystrybutorów i magazynów [13][14] | Identyfikowalność i łańcuch certyfikatów dla zakupionych części standardowych i surowców |
| **Nadcap** | Branżowy program akredytacji procesów specjalnych, założony w 1990 roku w ramach SAE i administrowany przez Performance Review Institute (PRI); obszary obejmują obróbkę cieplną, obróbkę chemiczną, badania NDT, spawanie, powłoki i kompozyty [21][54] | Wielu klientów dopuszcza do procesów specjalnych wyłącznie zakłady z akredytacją; ogranicza to wybór źródeł i często czyni procesy specjalne wąskim gardłem |
| **FAA 14 CFR Part 21, Subpart G** (certyfikat produkcyjny); także Subpart K (Parts Manufacturer Approval, PMA) i Subpart O (upoważnienie TSO) | Zatwierdzenia produkcyjne; 14 CFR 21.137 wymaga pisemnego systemu jakości z 14 elementami, w tym kontrolą danych konstrukcyjnych, kontrolą dostawców, kontrolą procesu produkcyjnego, kontrolą wyrobów niezgodnych, zapisami jakości i wyciekami jakości [41] | Posiadacz zatwierdzenia kontroluje swoich dostawców; zapisy trzeba przechowywać co najmniej 5 lat (10 lat dla komponentów krytycznych) [41]. Większość dostawców drugiego i trzeciego poziomu nie posiada własnego zatwierdzenia produkcyjnego, lecz działa w ramach kontroli dostawców swojego klienta |
| **FAA 14 CFR Part 145** | Certyfikat stacji napraw; praca wyłącznie w ramach uprawnień i specyfikacji operacyjnych, z aktualnymi danymi serwisowymi, zatwierdzonym przez FAA programem szkoleń i zapisami przechowywanymi co najmniej 2 lata [42] | Planowanie może przydzielać wyłącznie prace, do których stacja jest uprawniona, przeszkolonym pracownikom, z aktualnymi instrukcjami i danymi pod ręką |
| **EASA Part 21 Subpart G** | Zatwierdzenie organizacji produkcyjnej (POA) w UE [22] | Posiadacz zatwierdzenia zwalnia części z formularzem EASA Form 1 i nadzoruje swoich dostawców; procesy i personel muszą odpowiadać zatwierdzeniu. Istotne dla amerykańskich dostawców do europejskich klientów |
| **EASA Part 145** | Zatwierdzenie organizacji utrzymania ruchu (załącznik II do rozporządzenia (UE) nr 1321/2014) [23] | Praca wyłącznie w zatwierdzonym zakresie (uprawnieniach), z certyfikującym personelem i ważnymi danymi serwisowymi. Zakład posiadający zatwierdzenia FAA i EASA może wystawić podwójne zwolnienie na formularzu FAA 8130-3 [43] |
| **EASA Part-CAMO** | Organizacja zarządzania ciągłą zdatnością do lotu, wprowadzona rozporządzeniem (UE) 2019/1383 [23] | Planuje program utrzymania, dyrektywy zdatności do lotu oraz części o ograniczonej żywotności w Europie i przekazuje pakiety prac do MRO |
| **ITAR / EAR** (USA) | Kontrola eksportu produktów obronnych (ITAR, 22 CFR 120–130) i towarów podwójnego zastosowania (EAR, 15 CFR 730–774) [36] | Dostęp do danych technicznych i części może być ograniczony ze względu na osobę i lokalizację; dotyczy to także planowania i systemów IT |
| **DFARS / CMMC 2.0** (programy obronne USA) | Model dojrzałości certyfikacji cyberbezpieczeństwa (CMMC); klauzula DFARS 252.204-7021 obowiązująca od 10 listopada 2025, wdrażana stopniowo przez trzy lata; przepis programu 32 CFR Part 170 [49][50] | Dostawcy przetwarzający informacje o kontrakcie federalnym (FCI) lub niejawne informacje niesklasyfikowane kontrolowane (CUI) w swoich systemach planowania, ERP lub MES potrzebują wymaganego poziomu CMMC; wykonawcy główni muszą sprawdzić status CMMC podwykonawcy przed udzieleniem zamówienia [49] |
| **DFARS 252.225-7009** (metale specjalne) | Metale specjalne, w tym tytan i stopy tytanu, w wyrobach dostarczanych w ramach kontraktów DoD muszą być wytapiane lub produkowane w USA lub w kraju kwalifikowanym; wymóg przenosi się na podwykonawstwa dla wyrobów zawierających metale specjalne [51] | Planowanie materiałowe musi śledzić pochodzenie wytopu według partii wytopowej, a nie tylko gatunek stopu i ilość; tańsza lub szybsza partia z niekwalifikowanego źródła może być nieprzydatna |

### 3.2 AS9100 szczegółowo: co norma oznacza dla planowania

AS9100D przyjmuje strukturę ISO 9001 i dodaje wymagania, które bezpośrednio sięgają planowania [44]. Trzy z nich są szczególnie istotne.

**Zarządzanie konfiguracją.** Musisz w każdej chwili wiedzieć, która wersja konstrukcji obowiązuje dla którego zlecenia i która wersja została faktycznie wykonana. Dotyczy to zwalniania zleceń (zwalniaj wyłącznie ważne wersje), postępowania z otwartymi zleceniami w przypadku zmian oraz dokumentowania odstępstw.

**Identyfikowalność.** Norma wymaga identyfikowalności wszystkich surowców, użytych materiałów i procesów, a także narzędzi i osób [14]. Dla planowania oznacza to, że każde potwierdzenie wykonania operacji musi przynajmniej rejestrować, kto pracował, kiedy, na której maszynie, z jakim materiałem i według której wersji procesu. Sekcja 4 omawia to szczegółowo.

**Dostawy na czas.** AS9100 wprost wymienia dostawy na czas jako wymaganie [14]. Klienci oceniają swoich dostawców pod kątem dostaw na czas (OTD) i jakości. Słaba terminowość dostaw nie jest zatem wyłącznie problemem handlowym, lecz także problemem audytowym.

### 3.3 Zatwierdzenie produkcji FAA: co 14 CFR 21.137 oznacza dla planistów

Jeśli posiadasz certyfikat produkcyjny FAA lub zatwierdzenie producenta części (Parts Manufacturer Approval, PMA; posiadacze PMA muszą spełniać te same wymagania systemu jakości na podstawie 14 CFR 21.307) albo dostarczasz części takiemu posiadaczowi, wymagania systemu jakości z 14 CFR 21.137 kształtują Twoje planowanie [41]. Przepis wymaga, aby każdy wnioskodawca lub posiadacz certyfikatu produkcyjnego ustanowił pisemny system jakości, „który zapewnia, że każdy produkt i wyrób jest zgodny z zatwierdzoną konstrukcją i znajduje się w stanie bezpiecznym do eksploatacji” [41]. Jego 14 elementów czyta się jak listę kontrolną dla działającego procesu planowania:

- **Kontrola danych konstrukcyjnych i kontrola dokumentów:** na halę produkcyjną może trafić wyłącznie bieżąca, zatwierdzona wersja.
- **Kontrola dostawców:** procedury zapewniające, że każdy produkt, wyrób lub usługa dostarczona przez dostawcę jest zgodna z wymaganiami posiadacza zatwierdzenia, oraz proces zgłaszania niezgodności wykrytych po zwolnieniu [41].
- **Kontrola procesu produkcyjnego, kontrola i badania, status kontroli i badań:** trasa technologiczna musi pokazywać, które kontrole odbywają się gdzie, a status każdej części musi być widoczny.
- **Kontrola wyrobów niezgodnych i działania korygujące:** złom, przeróbki i odstępstwa muszą być planowane i dokumentowane, a nie obsługiwane nieformalnie.
- **Kontrola zapisów jakości:** co najmniej 5 lat dla produktów i wyrobów, co najmniej 10 lat dla komponentów krytycznych [41].
- **Informacja zwrotna z eksploatacji i wady ujawnione po dostawie:** ustalenia z terenu i wady, które wymknęły się kontroli, wracają do systemu.

W przypadku dostawcy drugiego lub trzeciego poziomu, który nie posiada własnego zatwierdzenia, wymagania te docierają jako przeniesione na niego zapisy w zamówieniu klienta i w instrukcji jakości dostawcy. Konsekwencja dla planowania pozostaje ta sama: dowody muszą powstawać w przepływie zleceń, a nie być odtwarzane po fakcie.

### 3.4 Perspektywy: AS9100D staje się IA9100

IAQG pracuje nad rewizją normy 9100, która ma zostać opublikowana jako IA9100. Nowa nazwa ma ujednolicić regionalne oznaczenia (AS, EN, JISQ). Według przeglądu dostępnych informacji, na połowę października 2026 r. nie było oficjalnej publikacji ani potwierdzonego terminu; szacunki wahają się od końca 2026 do początku 2027 r. Nie określono również okresu przejściowego dla certyfikatów [15]. Do tego czasu AS9100D (EN 9100:2018) pozostaje obowiązującą edycją, a istniejące certyfikaty zachowują ważność [15]. Zaplanuj przejście jako odrębny projekt, gdy IAQG opublikuje normę, i uzgodnij harmonogram z jednostką certyfikującą.

### 3.5 AS9145: wykazanie gotowości produkcyjnej w tempie klienta

AS9145 wprowadza do lotnictwa metody APQP i PPAP, znane z przemysłu motoryzacyjnego [45]. Ustrukturyzowano w niej drogę do produkcji w pięciu fazach: planowanie; projektowanie i rozwój produktu; projektowanie i rozwój procesu; walidacja produktu i procesu; oraz bieżąca produkcja, eksploatacja i serwis po dostawie [35]. Pakiet PPAP obejmuje m.in. zapisy konstrukcyjne, schemat przebiegu procesu, FMEA procesu, plan kontroli, analizę systemu pomiarowego, wstępne badania zdolności procesu oraz raport z pierwszej sztuki (FAIR) [35].

Fazy 3 i 4 są decydujące dla planowania. W fazie 3 gotowość produkcyjną ocenia się w przeglądzie gotowości produkcyjnej, a procesy powinny spełniać wymagania przy tempie zapotrzebowania klienta. W fazie 4 serie produkcyjne muszą wykazać, że proces dostarcza zgodne z wymaganiami części w tempie klienta [35]. Innymi słowy: dowód zdolności produkcyjnej jest częścią zatwierdzenia. Jeśli Wasza zdolność produkcyjna istnieje tylko na papierze, to właśnie tutaj wyjdzie na jaw.

### 3.6 Programy obronne: CMMC 2.0, kontrola eksportu i metale specjalne

Wielu dostawców lotniczych obsługuje zarówno klientów komercyjnych, jak i obronnych, często na tych samych maszynach i w tym samym systemie ERP. Trzy amerykańskie wymagania sięgają wtedy do planowania:

- **CMMC 2.0.** Przepis DFARS „Assessing Contractor Implementation of Cybersecurity Requirements” wszedł w życie 10 listopada 2025 r. Dodaje klauzulę 252.204-7021 i wprowadza wymagania CMMC etapami w ciągu trzech lat; podstawowy przepis programu, 32 CFR Part 170, wszedł w życie 16 grudnia 2024 r. [49]. Model ma trzy poziomy i jest zgodny z NIST SP 800-171 [50]. Przeniesienie wymagań na podwykonawców dotyczy sytuacji, gdy podwykonawstwo obejmuje FCI lub CUI, a wykonawcy główni muszą potwierdzić bieżący status CMMC podwykonawcy przed udzieleniem zamówienia [49]. Jeśli w Waszym systemie planowania znajdują się rysunki, marszruty lub instrukcje robocze zawierające CUI, to ten system podlega tym wymaganiom.
- **ITAR i EAR.** Dane techniczne dotyczące artykułów obronnych mogą być dostępne wyłącznie dla upoważnionych osób [36]. Należy sprawdzić planistów, zdalne wsparcie IT i dzierżawy chmurowe. Ma to wpływ na to, gdzie przechowywane są dane planistyczne i kto może widzieć które zlecenia.
- **Metale specjalne.** Zgodnie z DFARS 252.225-7009 tytan i stopy tytanu (wśród innych metali specjalnych) w wyrobach dostarczanych w ramach kontraktów DoD muszą być wytopione lub wytworzone w USA lub w kraju kwalifikującym się, a klauzula przenosi się na podwykonawstwa dotyczące wyrobów zawierających metale specjalne [51]. Przydział materiału musi zatem znać pochodzenie wytopu każdej partii.

## 4. Identyfikowalność i genealogia

### 4.1 Dlaczego identyfikowalność jest zadaniem planowania

Identyfikowalność często traktuje się jako czysto jakościowy temat. W rzeczywistości powstaje ona w przepływie zleceń, gdzie praca jest planowana, wykonywana i potwierdzana. Gdy planista przenosi zlecenie na inną maszynę, dzieli partię lub przekierowuje operację zewnętrzną, zmienia się genealogia części. Jeśli późniejsza informacja jest niekompletna, część w najgorszym przypadku może nie nadawać się do wysyłki, ponieważ jej zapis jest niepełny.

Niedawny artykuł w niemieckim czasopiśmie branżowym *Produktion* opisuje dowody i jakość danych jako rzeczywiste wąskie gardło dla średnich dostawców przemysłu obronnego. Powołuje się na badanie BearingPoint, zgodnie z którym tylko 10 % przebadanych firm w Niemczech posiada w pełni zintegrowaną architekturę danych, podczas gdy 38 % pracuje na rozproszonych systemach [37]. Odcinek podcastu m365.fm [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) omawia, jak identyfikowalność i genealogię można wdrożyć technicznie i organizacyjnie w produkcji.

### 4.2 Pojęcia: identyfikowalność, genealogia, as-designed i as-built

- **Identyfikowalność** to zdolność śledzenia pochodzenia części (w przód i wstecz): z jakiego materiału, od jakiego dostawcy, jakim procesem, kiedy i przez kogo?
- **Genealogia** opisuje relacje rodzic–dziecko między częściami, partiami i zespołami. Odpowiada na pytania takie jak: które zespoły zawierają materiał z wytopu X? Których numerów seryjnych dotyczy wadliwa partia obróbki cieplnej?
- **As-designed** to konfiguracja określona przez konstrukcję; **as-built** to konfiguracja faktycznie wykonana, łącznie z zatwierdzonymi odstępstwami. **As-maintained** opisuje stan po naprawie w MRO.

### 4.3 Model danych: co należy rejestrować co najmniej

| Obiekt | Typowe atrybuty | Dlaczego planowanie tego potrzebuje |
|---|---|---|
| Część / numer seryjny | numer części, rewizja, numer seryjny, konfiguracja | powiązanie z zamówieniem klienta i rewizją konstrukcji |
| Partia / lot | numer partii, ilość, podziały i połączenia | wielkość partii, zakres wycofania z obiegu |
| Materiał surowy | materiał, specyfikacja, numer wytopu (heat), dostawca, certyfikat materiałowy, pochodzenie wytopu (dla specjalnych metali według DFARS [51]) | zwolnienie materiału przed rozpoczęciem zlecenia |
| Operacja | maszyna, rewizja programu NC, narzędzie, parametry procesu, start/koniec | potwierdzenie, czas realizacji, uzgodnienie zdolności produkcyjnych |
| Personel | pracownik, kwalifikacje, ważność | przydział wyłącznie wykwalifikowanych osób |
| Proces specjalny | wykonawca, akredytacja, numer wsadu do pieca/wanny, certyfikat | planowanie operacji zewnętrznych, izolowanie odchyleń |
| Kontrola | plan kontroli, przyrząd pomiarowy, wynik, kontroler | zwolnienie, FAI, dowód dla cech kluczowych |
| Odchylenie | odstępstwo, przeróbka, zatwierdzenie odchylenia | dokumentacja stanu wykonania, możliwość wysyłki |
| Dokument zwalniający | certyfikat zgodności (C of C); w zatwierdzonych organizacjach FAA Form 8130-3 lub EASA Form 1 [22][23][43] | zwolnienie do wysyłki; dostawcy bez własnego zatwierdzenia produkcji zwykle dostarczają do posiadacza zatwierdzenia z certyfikatem zgodności |

Uwaga dotycząca dokumentów zwalniających dla czytelników z USA: FAA Form 8130-3 (Authorized Release Certificate, Airworthiness Approval Tag) dokumentuje krajowe zatwierdzenia zdatności do lotu, zatwierdzenia do przywrócenia do eksploatacji oraz zatwierdzenia eksportowe. Może być wystawiany wyłącznie przez osoby i organizacje upoważnione przez FAA, a FAA Order 8130.21H stwierdza, że dostawcy bez zatwierdzenia produkcji zasadniczo nie mogą go wystawiać dla części wysyłanych do posiadacza zatwierdzenia produkcji; dokument ten jest także opisany jako „not a delivery or shipping document” [43]. Zakłady zatwierdzone zarówno przez FAA, jak i EASA mogą wystawić podwójne zwolnienie na 8130-3, które uprawnia część do montażu w samolotach z USA i UE [43]. Europejskim odpowiednikiem dla pojedynczych zwolnień EASA jest EASA Form 1 [22][23].

### 4.4 Części o ograniczonym resursie

Niektóre części, zwłaszcza wirujące elementy silników, takie jak tarcze i wały, mają zatwierdzony resurs w cyklach lub godzinach (life-limited parts, LLP). Ich zużycie musi być dokumentowane bez luk przez cały okres eksploatacji. W USA właściciele i operatorzy muszą prowadzić zapisy „aktualnego stanu części o ograniczonym resursie” dla każdego płatowca, silnika, śmigła, wirnika i wyposażenia, a zapisy te są przechowywane i przekazywane wraz z samolotem w razie jego sprzedaży [53]. W Europie to samo zadanie wchodzi w zakres ciągłej zdatności do lotu zgodnie z przepisami EASA [23]. Jeśli brakuje części historii (tzw. identyfikowalność od narodzin, back-to-birth), technicznie bezbłędna część może okazać się nieprzydatna. Dla producentów oznacza to: zapis „narodzin” części, czyli materiał, wytop, partia kucia i dane produkcyjne, musi być kompletny. Dla warsztatów MRO oznacza to: bez kompletnej historii część nie może zostać ponownie zamontowana, a planowanie musi zapewnić zamiennik.

### 4.5 Części podrobione i niezatwierdzone

AS9100 wprost wymaga środków zapobiegających stosowaniu części podrobionych [14]. Circular Advisory FAA AC 21-29D (2016) opisuje, jak wykrywać i zgłaszać podejrzewane niezatwierdzone części (suspected unapproved parts, SUP); definiuje niezatwierdzoną część jako taką, która nie spełnia kryteriów 14 CFR 21.8 lub 21.9, co obejmuje celowo błędnie oznakowane i podrobione części [52]. Jego wskazówki dotyczące zakupów są bezpośrednio istotne dla planistów: kupować od źródeł, których dokumentacja prowadzi do źródła zatwierdzonego przez FAA, oraz zachować ostrożność wobec sygnałów ostrzegawczych, takich jak cena wyraźnie niższa niż u innych sprzedawców, nietypowo krótki termin dostawy lub brak dokumentacji [52]. Podejrzewane niezatwierdzone części zgłasza się na FAA Form 8120-11 [52].

Dla planowania oznacza to: zakupy mogą pochodzić wyłącznie od zatwierdzonych źródeł, certyfikaty muszą być sprawdzane przy kontroli przyjęcia, a szybko pozyskany zamiennik od nieznanego źródła nie wchodzi w grę, nawet pod presją harmonogramu. Niedobory dostaw podnoszą ryzyko, ponieważ rośnie presja, by sięgnąć po źródła szarego rynku.

### 4.6 W praktyce: wbudowanie identyfikowalności w proces planowania

1. **Zarezerwuj i zwolnij materiał przed rozpoczęciem zlecenia.** Zlecenie może się rozpocząć dopiero wtedy, gdy konkretny materiał (partia wytopu, certyfikat) jest przypisany i sprawdzony.
2. **Odzwierciedl kwalifikacje w modelu zdolności produkcyjnych.** Planowanie przydziela operacje wyłącznie osobom i maszynom posiadającym ważne kwalifikacje.
3. **Rejestruj podziały i połączenia partii w systemie.** Każdy podział partii tworzy nowy numer partii powiązany z jej pochodzeniem.
4. **Planuj operacje zewnętrzne łącznie ze zwrotem certyfikatów.** Część uznaje się za powróconą dopiero wtedy, gdy wróci jej certyfikat.
5. **Rejestruj potwierdzenia na stanowisku pracy, a nie na koniec zmiany.** Im później rejestrujesz, tym więcej brakuje.
6. **Regularnie testuj swoje zapytania.** Przeprowadź próbne wycofanie wyrobu: ile czasu zajmuje znalezienie wszystkich numerów seryjnych dla partii wytopu?

## 5. Poziomy planowania: od tempa klienta do operacji

### 5.1 Cztery poziomy, cztery horyzonty czasowe

Planowanie produkcji lotniczej można podzielić na cztery poziomy. Każdy odpowiada na inne pytanie i wymaga innych danych.

| Poziom | Horyzont | Kluczowe pytanie | Typowe narzędzia |
|---|---|---|---|
| Strategiczne planowanie tempa i zdolności produkcyjnych | 2 do 5 lat | Jakie tempo możemy zapewnić przy jakich inwestycjach? | obliczenia scenariuszowe, symulacja fabryki, planowanie kapitałowe |
| Planowanie sprzedaży i operacji (S&OP) oraz harmonogramowanie główne produkcji | 6 do 24 miesięcy | Jak przełożyć tempa klienta na wykonalny program? | ERP, wstępne planowanie zdolności (rough-cut), APS |
| Planowanie materiałów i zdolności produkcyjnych | 1 do 6 miesięcy | Jaki materiał i jakie zdolności potrzebujemy i kiedy? | ERP/MRP, portale dostawców, APS |
| Szczegółowe harmonogramowanie i sterowanie na hali produkcyjnej | od godzin do 4 tygodni | Które zlecenie, na której maszynie i z kim ma być realizowane i kiedy? | APS, MES, tablica produkcyjna na hali |

Częstą przyczyną słabej terminowości dostaw jest nie jeden słaby poziom, lecz przerwa między poziomami: harmonogram główny zobowiązuje się do tempa 75, harmonogram szczegółowy zna wąskie gardła, które to uniemożliwiają, a nikt systematycznie nie uzgadnia obu tych planów.

### 5.2 ERP, APS i MES: kto za co odpowiada

W większości firm [system planowania zasobów przedsiębiorstwa (ERP)](https://www.m365.fm/entity/enterprise-resource-planning/) jest systemem wiodącym dla zleceń, zestawień materiałowych, marszrut, zapasów i zakupów. Jego klasyczne planowanie potrzeb materiałowych (MRP) w podstawowej postaci operuje stałymi planowanymi czasami realizacji i nie uwzględnia ograniczeń zdolności produkcyjnych. To wystarcza do określenia potrzeb materiałowych, ale nie do stworzenia wykonalnego harmonogramu produkcji.

System [zaawansowanego planowania i harmonogramowania (APS)](https://www.m365.fm/entity/advanced-planning-and-scheduling/), przeciwnie, układa harmonogram w oparciu o skończoną zdolność produkcyjną: maszyny, osoby z kwalifikacjami, narzędzia, zmiany i dostępność materiału są uwzględniane jednocześnie. Metoda ta nazywa się [harmonogramowaniem opartym na ograniczeniach](https://www.m365.fm/entity/constraint-based-scheduling/). Wreszcie system realizacji produkcji (MES) kontroluje i dokumentuje wykonanie na hali i dostarcza potwierdzenia, bez których ani planowanie, ani identyfikowalność nie działają.

Siostrzany przewodnik [Harmonogramowanie produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/) szczegółowo omawia różnice między ERP, APS i MES, ograniczenia logiki MRP oraz sposób wyboru oprogramowania do planowania.

### 5.3 Co model planowania w lotnictwie musi dodatkowo uwzględniać

W porównaniu z ogólną produkcją przemysłową model planowania w lotnictwie wymaga kilku dodatkowych ograniczeń:

- **Macierz kwalifikacji** dla osób (procesy specjalne, uprawnienia do kontroli, uprawnienia do zwolnienia wyrobu)
- **Kwalifikacja maszyn** według numeru części (nie każda maszyna jest zatwierdzona dla każdej części)
- **Operacje zewnętrzne** z realistycznymi czasami realizacji i zobowiązaniami zdolności produkcyjnych podwykonawców
- **Etapy kontroli i zwolnienia** jako operacje podlegające harmonogramowaniu, z własną zdolnością (laboratorium kontroli, kontrolerzy, FAI)
- **Dane konfiguracji i obowiązywania** (która wersja obowiązuje od którego numeru seryjnego lub statku powietrznego)
- **Przydział materiału na poziomie partii wytopu** zamiast samej dostępności ilościowej (wraz z pochodzeniem wytopu tam, gdzie obowiązują zasady DFARS dotyczące metali specjalnych [51])
- **Ograniczenia partii** dla pieców, autoklawów i zbiorników procesowych (minimalne obciążenie, zgodność części i materiałów)
- **Ograniczenia dostępu do danych** dla zleceń kontrolowanych przez ITAR lub CUI (kto może widzieć i planować które prace) [36][49]

## 6. Zrozumienie i skracanie czasu realizacji

### 6.1 Prawo Little'a: związek między zapasem a czasem

W 1961 roku John D. C. Little udowodnił zależność, która obowiązuje w każdym stabilnym systemie produkcyjnym: średni zapas w systemie jest równy przepustowości pomnożonej przez średni czas przebywania w systemie [27]. Po przekształceniu:

**Czas realizacji = zapas w toku (WIP) ÷ przepustowość**

**Przykład liczbowy:** Warsztat komponentów silnikowych wysyła średnio 40 części tygodniowo. W systemie znajduje się 320 części (w obróbce, w oczekiwaniu, u podwykonawcy, na kontroli). Średni czas realizacji wynosi zatem 320 ÷ 40 = 8 tygodni. Jeśli WIP uda się zmniejszyć do 200 części przy tej samej przepustowości, czas realizacji spada do 5 tygodni. Przepustowość się nie zmienia, o ile wąskie gardło pozostaje w pełni zaopatrzone.

Prawo to wyjaśnia, dlaczego zwiększanie liczby zleceń kierowanych na halę produkcyjną nie skraca terminu dostawy, lecz go wydłuża: WIP rośnie, przepustowość pozostaje ta sama, a czas realizacji się wydłuża.

### 6.2 Gdzie ucieka czas

W wielu zakładach rzeczywisty czas obróbki stanowi tylko niewielką część czasu realizacji; większą część zajmuje czas oczekiwania. Jest to powszechnie stosowana reguła praktyczna, a nie ogólnie udokumentowany stosunek [unverified: brak ogólnie przyjętego źródła dla tej proporcji]. Udział ten silnie zależy od firmy i należy go zmierzyć we własnym zakładzie, na przykład za pomocą [mapowania strumienia wartości](https://www.m365.fm/en/learn/value-stream-mapping/). W lotnictwie typowe przyczyny to:

- **Oczekiwanie na procesy specjalne u podwykonawców** (transport tam i z powrotem, kolejka u podwykonawcy, zwrot certyfikatów)
- **Oczekiwanie na kontrolę i zwolnienie** (laboratorium kontrolne, FAI, kontrola u klienta, odstępstwa)
- **Oczekiwanie na materiał lub dokumenty** (brakujące certyfikaty, otwarte zmiany konstrukcyjne)
- **Grupowanie w partie** (części czekają, aż piec lub partia zostanie zapełniona)
- **Przeciążone wąskie gardła** (wysokie wykorzystanie tworzy nieproporcjonalnie długie kolejki)
- **Zakłócanie pracy przez zlecenia pilne** (wyprzedzanie zwykłych zleceń przez zlecenia pilne)

### 6.3 Dźwignie skracania czasu realizacji

1. **Ograniczaj WIP.** Zwalniaj tylko tyle zleceń, ile wąskie gardło jest w stanie przetworzyć. Teoria ograniczeń nazywa to „liną” (rozdział 11).
2. **Grupuj i planuj operacje zewnętrzne.** Stałe dni odbioru i dostaw u podwykonawcy zmniejszają zmienność.
3. **Planuj zdolność kontrolną.** Laboratorium kontrolne i kontrolerzy to zdolność produkcyjna na równi z maszynami i powinni być uwzględniani w planie zdolności.
4. **Wyjaśniaj dokumenty przed startem.** Brak zlecenia bez kompletnych dokumentów; materiał z certyfikatem i ważną wersją konstrukcji.
5. **Nie obciążaj wąskich gardeł powyżej 85–90 % przez długie okresy**, gdy zmienność jest wysoka. Ta reguła praktyczna wynika z teorii kolejek (rozdział 11.1); właściwa wartość zależy od zmienności w zakładzie. Niewielka rezerwa zdolności często kosztuje mniej niż długie kolejki.

## 7. Planowanie procesów specjalnych i operacji zewnętrznych

### 7.1 Dlaczego procesy specjalne często stają się wąskim gardłem

Procesy specjalne to procesy, których wyniku nie można w pełni zweryfikować na gotowym wyrobie bez jego zniszczenia, na przykład obróbka cieplna, obróbka powierzchniowa, spawanie czy niektóre powłoki. Ich jakość musi więc być zapewniona przez kwalifikowane procesy, urządzenia i ludzi. W lotnictwie wielu klientów wymaga dla nich akredytacji Nadcap [21][54].

Dla planowania ma to trzy konsekwencje. Po pierwsze, liczba zatwierdzonych dostawców jest ograniczona; zmiana wymaga kwalifikacji i często nowej inspekcji pierwszego egzemplarza. Po drugie, wiele z tych procesów przebiega partiami (piece, zbiorniki, autoklawy), co powoduje czasy oczekiwania na skompletowanie partii. Po trzecie, dostawcy zgłaszają długie terminy realizacji, zwłaszcza w badaniach i obróbce powierzchniowej [10].

### 7.2 Zasady planowania procesów specjalnych

- **Modeluj proces specjalny jako zasób,** a nie jako płaski czas realizacji. Zewnętrzna obróbka cieplna z dwoma cyklami pieca tygodniowo to zdolność produkcyjna z określonym rytmem, a nie „czas realizacji 10 dni".
- **Uzgadniaj zobowiązania dotyczące zdolności umownie** (sloty tygodniowo) i zapisuj je w planowaniu jako twarde ograniczenie.
- **Planuj grupowanie świadomie.** Które części można przetwarzać razem? Jaki minimalny załadunek ma sens? Jak długo część może maksymalnie czekać na partię?
- **Uczyń potwierdzenie wraz z certyfikatem** warunkiem przejścia do następnej operacji.
- **Kwalifikuj drugich dostawców**, zanim wąskie gardło stanie się krytyczne. Kwalifikacja często trwa miesiące.

### 7.3 Procesy specjalne we własnym zakresie: produkować czy kupować z punktu widzenia zdolności

Wielu dostawców rozważa przeniesienie procesów specjalnych do własnego zakładu, aby zmniejszyć zależność. Może to mieć sens, ale jest to projekt o własnym, długim czasie realizacji: urządzenia, kwalifikacja, akredytacja, personel i zatwierdzenia klientów. Symulacja przyszłego wykorzystania zdolności (rozdział 11.4) pomaga ustalić, czy inwestycja się opłaca, czy też nowe urządzenie własne jedynie stworzy nowe wąskie gardło o niskim wykorzystaniu.

## 8. Zmiany inżynieryjne i zarządzanie konfiguracją

### 8.1 Zmiany są normalne w lotnictwie

W długim cyklu życia programu lotniczego rysunki, materiały, procesy i dostawcy zmieniają się wielokrotnie. Każda zmiana musi zostać oceniona, zatwierdzona i otrzymać efektywność: od którego numeru seryjnego, statku powietrznego lub daty nowa wersja obowiązuje? Dla planowania jest to stałe źródło zakłóceń.

### 8.2 Co zmiana uruchamia w planowaniu

| Wpływ | Konsekwencja dla planowania |
|---|---|
| Nowa wersja konstrukcyjna | przegląd otwartych zleceń: wykorzystać do wyczerpania, przerobić, zezłomować lub wysłać z odstępstwem |
| Nowe lub zmienione operacje | aktualizacja marszruty, norm czasowych, programów NC i planów kontroli |
| Inspekcja pierwszego egzemplarza (pełna lub częściowa) | zaplanować FAI jako osobną operację z zdolnością kontrolną; zatwierdzenie przed dostawami seryjnymi [18][34] |
| Zmiana materiału lub dostawcy | kwalifikacja, ewentualnie nowe FAI, nowe certyfikaty i terminy zakupu |
| Nowe narzędzia lub oprzyrządowanie | czas realizacji zakupu, odbiór, ewentualnie FAI dla zmienionego oprzyrządowania |

Zgodnie z AS9102 zmiana konstrukcyjna wpływająca na kształt, dopasowanie lub funkcję, zmiana źródła produkcji, procesu, lokalizacji lub oprzyrządowania oraz przerwa w produkcji dłuższa niż dwa lata, między innymi, uruchamiają pełną lub częściową inspekcję pierwszego egzemplarza [34]. Wersja C normy AS9102, opublikowana w 2023 roku, kładzie większy nacisk na planowanie, ocenę i powtarzanie inspekcji pierwszych egzemplarzy [18][46]. W Europie odpowiednia edycja została opublikowana jako EN 9102:2024 (w Niemczech jako DIN EN 9102:2025-01) [17].

### 8.3 Praktyczne zasady obsługi zmian

1. **Grupuj zmiany tam, gdzie klient na to pozwala.** Wiele małych, pojedynczych zmian kosztuje więcej niż kilka zgrupowanych.
2. **Ustalaj efektywność wcześnie i przekazuj ją do planowania.** Zlecenie musi od początku wiedzieć, jaką wersję buduje.
3. **Aktywnie zarządzaj zapasem starych wersji.** Uruchamianie dużych partii starej wersji, gdy zmiana jest przewidywalna, generuje złom.
4. **Rezerwuj zdolność FAI.** Zasoby kontrolne dla pierwszych egzemplarzy szybko się przeciążają podczas rozruchów i fal zmian.
5. **Uwidoczniaj status zmian na tablicy planowania.** Zlecenia z otwartymi zmianami to zlecenia wysokiego ryzyka.

## 9. Krzywe uczenia Wrighta: teoria i przykład obliczeniowy

### 9.1 Odkrycie z 1936 roku

W 1936 roku Theodore Paul Wright opublikował artykuł „Factors Affecting the Cost of Airplanes” w czasopiśmie *Journal of the Aeronautical Sciences* (vol. 3, no. 4, s. 122–128) [24]. Stwierdził, że liczba roboczogodzin potrzebnych na jeden samolot spadała o około 20 % przy każdym podwojeniu skumulowanej produkcji [25]. Ta zależność znana jest dziś jako prawo Wrighta lub krzywa uczenia się. Redukcja o 20 % na każde podwojenie nazywana jest krzywą uczenia się 80 %; nazwa podaje pozostały udział [25].

Krzywe uczenia się są nadal standardowym narzędziem szacowania kosztów i planowania zdolności produkcyjnych w lotnictwie i kosmonautyce. Rządowy Urząd Odpowiedzialności Rządowej USA (GAO) opisuje je w swoim przewodniku Cost Estimating and Assessment Guide [26].

### 9.2 Dwa warianty: średnia skumulowana i model jednostkowy

Istnieją dwa powszechnie stosowane warianty [26]:

- **Model średniej skumulowanej (Wright):** *średnia* liczba godzin dla wszystkich dotychczas wyprodukowanych jednostek spada o stały procent przy każdym podwojeniu.
- **Model jednostkowy (model Crawforda):** liczba godzin dla *pojedynczej* jednostki spada o stały procent przy każdym podwojeniu.

Oba wykorzystują tę samą formułę, ale różne wielkości odniesienia [26][40]. Należy zdecydować, którego wariantu używamy, i konsekwentnie się go trzymać. Jeśli przeniesiemy współczynnik uczenia z modelu średniej skumulowanej do modelu jednostkowego, porównujemy wartości rzeczywiste i docelowe, które do siebie nie pasują.

Formuła brzmi: **Y = A · X^b**, gdzie A = godziny dla pierwszej jednostki, X = skumulowana liczba jednostek, a b = log(współczynnik uczenia) ÷ log(2) [26].

### 9.3 Przykład obliczeniowy: uruchomienie nowego montażu

Dostawca przejmuje montaż nowego podzespołu. Pierwsza jednostka wymaga 1 000 roboczogodzin montażu. Na podstawie porównywalnych programów przyjęto krzywą uczenia 85 % (model średniej skumulowanej).

**Krok 1: Obliczenie wykładnika.** b = log(0,85) ÷ log(2) = −0,2345.

**Krok 2: Godziny średnie i jednostkowe.** Godziny dla jednostki N wynikają z różnicy skumulowanych sum: T(N) = N · śr(N) − (N−1) · śr(N−1).

| Skumulowana liczba jednostek N | Średnie godziny na jednostkę | Skumulowane godziny | Godziny dla jednostki N |
|---|---|---|---|
| 1 | 1 000,0 | 1 000 | 1 000,0 |
| 2 | 850,0 | 1 700 | 700,0 |
| 4 | 722,5 | 2 890 | 571,3 |
| 8 | 614,1 | 4 913 | 477,4 |
| 16 | 522,0 | 8 352 | 402,6 |
| 32 | 443,7 | 14 199 | 340,9 |
| 50 | 399,6 | 19 981 | 306,6 |
| 100 | 339,7 | 33 968 | 260,3 |

**Krok 3: Znaczenie dla planowania zdolności produkcyjnych.** Gdyby dostawca zaplanował pierwsze dziesięć jednostek według godzin setnej jednostki (260 godzin), wyszłoby 2 603 godziny. Zgodnie z krzywą uczenia pierwsze dziesięć jednostek faktycznie wymaga 5 828 godzin, czyli ponad dwa razy więcej. Uruchomienie planowane według norm godzinowych dojrzałej produkcji jest zatem systematycznie niedoszacowane.

**Krok 4: Analiza wrażliwości.** Jak silnie wynik zależy od przyjętego współczynnika uczenia? Przy krzywej 90 % zamiast 85 % zapotrzebowanie na pierwsze 100 jednostek wzrasta z 33 968 do 49 659 godzin, czyli o 46 %. Wybór współczynnika uczenia jest więc jednym z najbardziej istotnych założeń w całym planie uruchomienia.

### 9.4 Praktyczne zasady stosowania krzywych uczenia

- **Wyznaczaj współczynniki uczenia na podstawie własnych danych,** a nie przepisuj ich z literatury. Od początku rejestruj rzeczywiste godziny na jednostkę.
- **Rozróżniaj krzywe uczenia według zakresu prac.** Montaż ręczny uczy się szybciej niż obróbka skrawaniem, gdzie czas maszynowy praktycznie się nie skraca.
- **Uwzględniaj przerwy.** Po dłuższych przestojach, zmianach personelu lub przeniesieniach część efektu uczenia się przepada.
- **Śledź wartości rzeczywiste względem docelowych.** Jeżeli rzeczywiste godziny utrzymują się powyżej krzywej, błędne jest albo założenie, albo proces. Planowanie musi wiedzieć, które z nich.
- **Zmiany inżynieryjne częściowo resetują krzywą.** Duża zmiana może uruchomić nowy proces uczenia się.

## 10. Planowanie zwiększenia tempa produkcji: obliczenia i lista kontrolna

### 10.1 Dlaczego zwiększanie tempa kończy się niepowodzeniem na wąskim gardle

Zwiększenie tempa produkcji często ocenia się na podstawie całkowitej zdolności: „Średnio jesteśmy na poziomie 75 % wykorzystania, więc możemy obsłużyć o 20 % więcej.” Zwykle nie jest to prawdą, ponieważ przepustowość wyznacza wąskie gardło, a nie średnia. Eliyahu M. Goldratt spopularyzował tę zasadę w latach 80. XX wieku dzięki [teorii ograniczeń](https://www.m365.fm/entity/theory-of-constraints/) [28].

### 10.2 Przykład obliczeniowy: tempo 60 do tempa 72

Dostawca dostarcza jeden zestaw elementów łączeniowych na samolot. Tempo zamówień klienta ma wzrosnąć z 60 do 72 samolotów miesięcznie (o 20 %). Trzy najważniejsze zasoby prezentują się następująco:

| Zasób | Dostępne godziny/miesiąc | Obciążenie przy tempie 60 | Wykorzystanie przy tempie 60 | Obciążenie przy tempie 72 | Wykorzystanie przy tempie 72 |
|---|---|---|---|---|---|
| Obróbka 5-osiowa | 1 400 | 1 190 | 85 % | 1 428 | 102 % |
| Odgrzewanie i montaż | 2 000 | 1 300 | 65 % | 1 560 | 78 % |
| Laboratorium kontroli (CMM) | 600 | 420 | 70 % | 504 | 84 % |
| Łącznie (ważone godzinami) | 4 000 | 2 910 | 73 % | 3 492 | 87 % |

Łączne wykorzystanie na poziomie 87 % brzmi wykonalnie. Jednak obróbka 5-osiowa, przy 102 %, przekracza swoją zdolność, i to bez uwzględnienia zakłóceń, przezbrojeń dla dodatkowych wariantów czy pierwszych kontroli artykułu po zmianach. Dodatkowo działa efekt opisany w rozdziale 6: im bliżej 100 % jest wykorzystanie, tym szybciej rosną kolejki. Bez działań czas realizacji i opóźnienia dostaw rosną, mimo że zdolność całkowita matematycznie wystarcza.

**Możliwe działania, uporządkowane według czasu wdrożenia:**

1. **Natychmiast:** chronić wąskie gardło (brak bezczynności w przerwach, przygotowanie przezbrojeń poza czasem pracy maszyny, oddzielenie kontroli od maszyny).
2. **Tygodnie:** dodatkowe zmiany weekendowe, przeniesienie części o niższej złożoności na inne kwalifikowane maszyny.
3. **Miesiące:** optymalizacja programów (czas cyklu), oprzyrządowanie umożliwiające wielokrotne mocowania, zlecanie poszczególnych części kwalifikowanym partnerom (z FAI).
4. **Kwartały do lat:** dodatkowa maszyna wraz z czasem dostawy, instalacją, kwalifikacją i zatwierdzeniem przez klienta.

Ostatni punkt pokazuje, dlaczego zwiększanie tempa w lotnictwie wymaga tak długiego czasu przygotowania: między decyzją o nowej maszynie a pierwszą zatwierdzoną dostawą produkcyjną mija często wiele miesięcy.

### 10.3 Lista kontrolna: czy zakład jest gotowy na kolejne tempo?

**Popyt i scenariusze**

- [ ] Tempo klienta, zlecenia zwolnienia i zapotrzebowanie na części zamienne według numeru części są dostępne przez co najmniej 18 miesięcy.
- [ ] Obliczono co najmniej trzy scenariusze tempa (zachowawczy, planowy, ambitny).
- [ ] Z góry zdefiniowano wyzwalacze dla inwestycji i zatrudnienia.

**Zdolność produkcyjna**

- [ ] Wąskie gardło jest znane dla każdego scenariusza, a nie tylko średnie wykorzystanie.
- [ ] Wykorzystanie wąskiego gardła w scenariuszu planowym jest poniżej 85 do 90 %.
- [ ] Krzywe uczenia się dla nowych części są zaplanowane (rozdział 9).
- [ ] Zdolność kontroli i pomiarów jest zaplanowana dla produkcji, FAI i zmian.

**Ludzie**

- [ ] Macierz kwalifikacji pokazuje, ilu ludzi jest dostępnych dla każdego procesu specjalnego i kontroli.
- [ ] Czasy wdrożenia i kwalifikacji nowych pracowników są uwzględnione w planie.
- [ ] Pojedyncze punkty awarii (kwalifikacje posiadane przez jedną osobę) są zidentyfikowane.

**Materiały i dostawcy**

- [ ] Umowy na surowce obejmują wyższe tempo, łącznie z czasami realizacji.
- [ ] Zewnętrzne procesy specjalne mają zobowiązania dotyczące zdolności przy nowym tempie.
- [ ] Drugie źródła dla krytycznych materiałów i procesów są zakwalifikowane lub w trakcie kwalifikacji.
- [ ] W przypadku zleceń obronnych źródła materiałów spełniają przepisy DFARS dotyczące metali specjalnych [51].

**Jakość i zatwierdzenia**

- [ ] Nowe maszyny, oprzyrządowanie i źródła są zaplanowane z uwzględnieniem czasów FAI i zatwierdzenia przez klienta.
- [ ] Przygotowano dowód gotowości produkcyjnej przy tempie klienta (AS9145) [35].
- [ ] Identyfikowalność działa przy większych wolumenach bez ręcznych poprawek.

**Kontrola**

- [ ] Wskaźniki KPI (OTD, czas realizacji, WIP, wykorzystanie wąskiego gardła) są śledzone co tydzień.
- [ ] Zdefiniowano ścieżkę eskalacji dla zakłóceń na wąskim gardle.
- [ ] Plan jest regularnie uzgadniany z rzeczywistymi potwierdzeniami.

## 11. Planowanie zdolności produkcyjnych z APS, zarządzanie wąskimi gardłami i symulacja

### 11.1 Dlaczego wysokie wykorzystanie kosztuje czas

Teoria kolejek dostarcza prostej reguły praktycznej: średni czas oczekiwania na zasobie rośnie wraz z czynnikiem u ÷ (1 − u), gdzie u oznacza wykorzystanie. To przybliżenie pochodzi od J. F. C. Kingmana (1961); w pełnej postaci uwzględnia również zmienność czasów nadejścia i czasów obróbki [38]. Przy wykorzystaniu 80 % czynnik wynosi 4, przy 90 % jest już równy 9, a przy 95 % wynosi 19. Czas oczekiwania na zasobie wykorzystanym w 95 % jest zatem niemal pięciokrotnie dłuższy niż przy 80 %, przy pozostałych warunkach bez zmian.

Jest to szczególnie istotne w lotnictwie, z jego wysoką zmiennością (zmiany, przeróbki, procesy zewnętrzne, zlecenia pilne). Jeśli planujesz wąskie gardło przy wykorzystaniu 98 %, planujesz jednocześnie długie czasy realizacji.

### 11.2 Zarządzanie wąskim gardłem według Teorii ograniczeń

Teoria ograniczeń (TOC) opisuje pięć kroków koncentracji: zidentyfikować ograniczenie, wykorzystać je, podporządkować mu wszystko inne, podnieść jego wydajność, a następnie zacząć od nowa, ponieważ ograniczenie się przemieszcza [28]. Do sterowania produkcją na hali upowszechniła się zasada bęben-bufor-lina (DBR):

- **Bęben:** wąskie gardło wyznacza tempo. Jego harmonogram jest harmonogramem nadrzędnym dla całej hali.
- **Bufor:** bufor czasowy znajduje się przed wąskim gardłem, aby zakłócenia wcześniejszych operacji nie powodowały jego przestojów.
- **Lina:** zwolnienie materiału na początku produkcji jest powiązane z wąskim gardłem. Zwalnia się tylko tyle, ile wąskie gardło jest w stanie przerobić w przewidywalnej przyszłości. Dzięki temu ogranicza się zapasy w toku (WIP).

W lotnictwie wąskie gardło często nie znajduje się we własnym zakładzie, lecz w zewnętrznym procesie specjalnym lub w laboratorium kontrolnym. DBR nadal działa, jeśli traktujesz zewnętrzną operację jako bęben i powiązujesz własne zwolnienia z jej slotami.

### 11.3 APS w lotnictwie: co musi robić

System APS dla dostawcy lotniczego powinien co najmniej umieć:

| Funkcja | Dlaczego jest istotna w lotnictwie |
|---|---|
| Szeregowanie przy skończonej zdolności produkcyjnej | Wąskie gardła to reguła, a nie wyjątek |
| Kwalifikacje ludzi i maszyn | Zaplanować można wyłącznie zasoby posiadające odpowiednie kwalifikacje |
| Operacje zewnętrzne z slotami | Procesy specjalne są często rzeczywistym wąskim gardłem |
| Tworzenie partii | Piece, zbiorniki i autoklawy pracują partiami |
| Etapy kontroli i zwolnienia | Badania FAI i kontrole angażują zdolności produkcyjne |
| Szybkie przeszeregowywanie | Zmiany, przeróbki i zlecenia pilne występują często |
| Scenariusze (what-if) | Ocena scenariuszy tempa, inwestycji, awarii dostawców |
| Informacja zwrotna z hali | Bez danych rzeczywistych każdy plan szybko się dezaktualizuje |
| Integracja z ERP i MES | Dane podstawowe i zlecenia pochodzą z ERP, dane rzeczywiste z MES |
| Kontrola dostępu do danych objętych ograniczeniami | Zlecenia podlegające ITAR i CUI powinny być widoczne wyłącznie dla upoważnionych użytkowników [36][49] |

Towarzyszący przewodnik [Planowanie produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/) zawiera listę kontrolną wyboru systemu APS oraz plan wdrożenia.

### 11.4 Symulacja: sprawdzanie decyzji o zdolnościach przed ich podjęciem

[Symulacja fabryki](https://www.m365.fm/entity/factory-simulation/) odwzorowuje w modelu zasoby, zlecenia, zmienność i reguły oraz przelicza tygodnie lub miesiące w ciągu kilku minut. Odpowiada na pytania, na które statyczny rachunek zdolności produkcyjnych nie daje odpowiedzi:

- Jak kształtują się czas realizacji i terminowość dostaw przy tempie 67 i przy tempie 75?
- Co przynosi dodatkowa maszyna i gdzie pojawi się następne wąskie gardło?
- Co się stanie, jeśli zewnętrzna obróbka cieplna będzie niedostępna przez dwa tygodnie?
- Która reguła zwolnień utrzymuje najniższy poziom WIP przy tej samej terminowości dostaw?
- Czy proces specjalny realizowany we własnym zakresie się opłaca, czy też urządzenie będzie niedostatecznie wykorzystane?

Symulacja nie zastępuje szczegółowego szeregowania; przygotowuje decyzje strategiczne i taktyczne. Jest szczególnie cenna przed inwestycjami o długich czasach realizacji, czyli dokładnie w sytuacji, w jakiej wiele dostawców znajduje się przy obecnych planach tempa produkcji. Na m365.fm znajdziesz także stronę [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) poświęconą planowaniu i symulacji.

## 12. Ryzyka łańcucha dostaw w latach 2022–2026 i ich znaczenie dla planowania

### 12.1 Co wydarzyło się w ostatnich latach

**Silniki.** W 2023 roku Pratt & Whitney ujawnił wadę proszku metalicznego w niektórych częściach silnika turbowentylatorowego z przekładnią (GTF), która może prowadzić do pęknięć. We wrześniu 2023 roku spółka matka RTX ogłosiła, że do 2026 roku trzeba będzie zdemontować dodatkowe 600–700 silników w celu przeglądu warsztatowego, i spodziewała się, że średnio 350 samolotów rodziny A320 rocznie zostanie uziemionych. RTX zaksięgował odpis przed opodatkowaniem w wysokości 3 mld USD; łączne koszty szacowano na do 7 mld USD, z czego część obciąża partnerów, takich jak MTU [11]. W 2026 roku Airbus zarzucił Pratt & Whitney, że stawia obsługę eksploatacyjną w terenie przed dostawami nowych silników i nie dostarcza zamówionych ilości [4]. W połowie 2026 roku Airbus oświadczył, że nie ma już gotowych samolotów czekających wyłącznie na silniki, ale nie ma też żadnego zapasu [39].

**Tytan.** Po ataku Rosji na Ukrainę Boeing w marcu 2022 roku wstrzymał zakupy u rosyjskiego producenta tytanu VSMPO-Avisma. Airbus, który wówczas twierdził, że około połowę swojego tytanu zaopatruje w Rosji, początkowo nadal kupował [12]. Tytan pozostaje jednym z najczęściej wymienianych ryzyk dotyczących surowców w 2026 roku [10]. Dla dostawców w programach obronnych USA klauzula DFARS dotyczącą metali specjalnych dodaje ograniczenie źródeł do problemu dostępności [51].

**Odlewy i kucia.** Roland Berger wskazuje na utrzymujące się w 2026 roku braki odlewów i kuć na komponenty silnikowe i systemowe (np. podwozie) oraz na elementy złączne do konstrukcji. W przypadku łopatek turbin lotnictwo konkuruje z przemysłowymi turbinami gazowymi, których zapotrzebowanie również rośnie ze względu na potrzeby energetyczne centrów danych [10].

**Wykwalifikowana siła robocza.** Brak wykwalifikowanych pracowników pozostaje najczęstszą przeszkodą dla zwiększania produkcji (56% respondentów) [10]. Sytuacja w obsłudze technicznej jest podobna (Rozdział 13).

**Zmiany strukturalne wśród dostawców.** Airbus przejmuje dawne pakiety prac Spirit AeroSystems. Integracja obniżyła wyniki Airbusa za pierwsze dziewięć miesięcy 2026 roku o 235 mln EUR [3]. Takie przesunięcia zmieniają relacje dostawcze na wszystkich poziomach poniżej.

### 12.2 Reakcje planistyczne

| Ryzyko | Reakcja planistyczna |
|---|---|
| Długie i zmienne terminy dostaw materiałów | długoterminowe umowy z zobowiązaniami dotyczącymi zdolności produkcyjnych, zapasy bezpieczeństwa ukierunkowane na krytyczne materiały, regularna aktualizacja czasów realizacji zaopatrzenia |
| Pojedyncze źródła dla procesów specjalnych | kwalifikacja drugich źródeł, zabezpieczenie slotów umownie, modelowanie wąskiego gardła w planie |
| Wahania zleceń od klienta | osobne śledzenie tempa produkcji i zleceń klienta, wczesne zgłaszanie odchyleń |
| Brak pracowników | macierz kwalifikacji, szkolenia krzyżowe, wdrażanie nowych pracowników w planie zdolności produkcyjnych |
| Awaria dostawcy | symulacja scenariuszy, monitorowanie wczesnych wskaźników ostrzegawczych (opóźnienia dostaw, jakość, kondycja finansowa) |
| Tworzenie zapasów jako zabezpieczenie przed zakłóceniami | świadome utrzymywanie zapasów w ograniczonej ilości tam, gdzie chronią wąskie gardło; każda jednostka zapasu wydłuża czas realizacji zgodnie z prawem Little'a |

Ważna uwaga dotycząca ostatniego punktu: zapasy nie są darmową ochroną. Według Rolanda Bergera 40% dostawców zgromadziło wyższe zapasy przed rozpoczęciem produkcji, co wywiera presję na ich już cienkie marże [10]. Ukierunkowane bufory przed wąskim gardłem są skuteczniejsze niż ogólne zapasy bezpieczeństwa dla wszystkich części.

## 13. Planowanie MRO: obsługa z nieplanowanymi ustaleniami

### 13.1 Rynek MRO w 2026 roku

Obsługa, naprawy i remonty (MRO, ang. maintenance, repair and overhaul) to duży i rosnący rynek. W prognozie opublikowanej wspólnie z US Aeronautical Repair Station Association (ARSA) firma Oliver Wyman szacuje światowy rynek MRO lotnictwa cywilnego na 139,6 mld USD w 2026 roku i prognozuje wzrost do 193,1 mld USD do 2036 roku. Obsługa silników jest największym segmentem, wartym 70,1 mld USD. Liczba floty ma wzrosnąć z około 30 000 samolotów cywilnych na początku 2026 roku do około 41 100 w 2036 roku [30]. W odrębnej analizie z września 2026 roku Oliver Wyman wskazuje na niedobory materiałów, długie terminy dostaw odlewów i kuźniczych oraz niewielką liczbę dostawców krytycznych części silników; prawie 30 % respondentów spodziewa się pełnego odbudowania łańcucha dostaw dopiero za ponad trzy lata [29].

Opóźnienia w dostawach nowych samolotów zwiększają presję: linie lotnicze eksploatują starsze samoloty dłużej, a te wymagają więcej obsługi. Badanie IATA szacuje dodatkowe koszty obsługi samego tylko 2025 roku na 3,1 mld USD [9]. Jednocześnie nowa produkcja i obsługa konkurują o te same części i moce przerobowe, na co wskazuje spór między Airbusem a Pratt & Whitney [4].

### 13.2 Ramy regulacyjne

W USA zakład obsługowy zazwyczaj działa na podstawie certyfikatu stacji naprawczej wydanego zgodnie z 14 CFR Part 145. Stacja naprawcza może wykonywać prace wyłącznie na wyrobach, do których jest uprawniona, i w zakresie swoich specyfikacji operacyjnych, i „nie może obsługiwać ani modyfikować żadnego wyrobu, do którego nie jest uprawniona” [42]. Musi utrzymywać aktualne dane serwisowe, takie jak dyrektywy zdatności do lotu, instrukcje obsługi technicznej, instrukcje remontowe i biuletyny serwisowe, „aktualne i dostępne w chwili wykonywania danej pracy”, prowadzić zatwierdzony przez FAA program szkoleń oraz przechowywać dokumentację prac przez co najmniej dwa lata od zatwierdzenia do zwrotu do eksploatacji [42]. Pakiety prac zwykle pochodzą od operatora statku powietrznego, który odpowiada też za dokumentację, taką jak aktualny stan części o ograniczonym czasie eksploatacji zgodnie z 14 CFR 91.417 [53]. Wiele stacji naprawczych posiada również certyfikat AS9110 [20].

W Europie organizacja obsługowa działa na podstawie zatwierdzenia zgodnie z EASA Part 145. Pakiety prac często pochodzą od organizacji zarządzającej ciągłą zdatnością do lotu (Part-CAMO), która zarządza programem obsługi, dyrektywami zdatności do lotu i częściami o ograniczonym czasie eksploatacji [23]. Stacje naprawcze w USA, które posiadają też zatwierdzenie EASA, mogą wystawiać podwójne zwolnienia na formularzu FAA 8130-3 [43].

Z punktu widzenia planowania oba systemy oznaczają to samo: prace są dozwolone wyłącznie w zatwierdzonym zakresie, przez upoważniony personel i zgodnie z obowiązującymi danymi serwisowymi, takimi jak Aircraft Maintenance Manual (AMM) lub Component Maintenance Manual (CMM) w aktualnej wersji. Technik bez odpowiedniego upoważnienia lub szkolenia również nie stanowi tu zdolności produkcyjnej.

### 13.3 Co zasadniczo odróżnia planowanie MRO

W nowej produkcji zakres pracy jest znany przed rozpoczęciem zlecenia. W obsłudze wiadomo to dopiero po otwarciu i zbadaniu samolotu, silnika lub podzespołu. Planowanie musi zatem obejmować trzy rodzaje pracy:

- **Prace rutynowe:** zaplanowane zadania z programu obsługi lub instrukcji warsztatowej, łatwe do zaplanowania
- **Prace nierutynowe (ustalenia):** korozja, pęknięcia, zużycie lub uszkodzenia wykryte podczas przeglądu; zakres i termin są niepewne
- **Prace dodatkowe:** modyfikacje, dyrektywy zdatności do lotu lub życzenia klienta dodane do pakietu prac

Kluczowym wskaźnikiem KPI jest czas obrotu (TAT, ang. turnaround time), czyli czas od przyjęcia do zwrotu klientowi. Każdy dzień, który samolot lub silnik spędza dłużej w zakładzie, kosztuje operatora pieniądze. TAT często wyznacza nie tyle liczba roboczogodzin, ile oczekiwanie na części, decyzje dotyczące ustaleń, zatwierdzenia i specjalistów.

### 13.4 Przykład praktyczny: planuj ustalenia zamiast liczyć na szczęście

Zakład MRO podzespołów planuje remont jednego typu podzespołu. Prace rutynowe to 80 godzin. Z własnej historii zakładu z ostatnich 50 zleceń wynikają trzy typowe ustalenia (wszystkie wartości są założeniami przykładu):

| Ustalenie | Częstotliwość | Dodatkowe godziny | Wymagane części |
|---|---|---|---|
| Korozja, możliwa do naprawy | 40 % | 12 h | nie |
| Pęknięcie, wymiana części | 10 % | 20 h | tak, czas dostawy 15 dni roboczych, brak na stanie |
| Zużycie, część zamienna | 30 % | 6 h | tak, ze stanu magazynowego |

**Oczekiwane dodatkowe godziny:** 0,4 × 12 + 0,1 × 20 + 0,3 × 6 = 4,8 + 2,0 + 1,8 = 8,6 godziny. Średnio można zaplanować około 89 godzin na zlecenie. Przy planowaniu mocy przerobowych dla wielu zleceń ta wartość oczekiwana jest użyteczna.

**Dla zobowiązania TAT to nie wystarcza.** Dla 10 % zleceń doliczane jest 15 dni roboczych oczekiwania na część zamienną. Jeśli zobowiążesz się do TAT jako średniej (matematycznie 1,5 dnia zapasu), na każdym dziesiątym zleceniu wyraźnie go przekroczysz. Lepsze opcje to:

1. **Utrzymywanie części na stanie:** jedna lub dwie części na magazynie znacząco ograniczają ryzyko TAT. Porównaj koszt zapasu z kosztem opóźnienia.
2. **Wcześniejsza inspekcja:** im wcześniej znane jest ustalenie, tym wcześniej można złożyć zamówienie. Zaplanuj inspekcję jako pierwszy krok, z najwyższym priorytetem.
3. **Zobowiązanie TAT według percentyla:** na przykład TAT dotrzymywany w 80 lub 90 % przypadków, z przejrzystą zasadą dla ustaleń wymagających długich terminów dostawy części.
4. **Pula wymiany:** w przypadku częstych ustaleń pula części wymiennych (rotable exchange pool) może oddzielić TAT od cyklu naprawy.

### 13.5 Praktyczne zasady planowania MRO

- **Systematycznie rejestruj historię ustaleń.** Bez danych o częstotliwości i nakładzie pracy przy ustaleniach każdy plan pozostaje szacunkiem.
- **Rezerwuj moce na prace nierutynowe.** Jeśli obciążysz hangar lub warsztat w 100 % pracami rutynowymi, nie będzie miejsca na ustalenia.
- **Sprawdź dostępność części przed przyjęciem zlecenia.** Krytyczne części o długich terminach dostawy stanowią największe ryzyko dla TAT.
- **Sprawdź żywotność i historię części.** Części bez pełnej identyfikowalności nie mogą zostać ponownie zamontowane (sekcja 4.4).
- **Jawnie planuj specjalistów wąskich gardeł.** Inspektorzy NDT, personel uprawniony do zatwierdzania powrotu do eksploatacji oraz wyspecjalizowane warsztaty są często wąskim gardłem.
- **Informuj klientów wcześnie o ustaleniach.** Decyzje klienta dotyczące akceptacji są często najdłuższym oczekiwaniem w procesie.

## 14. Cyfrowy bliźniak i cyfrowa nić

### 14.1 Terminy

[Cyfrowy bliźniak](https://www.m365.fm/entity/digital-twin/) produkcji to model rzeczywistej fabryki, zasilany bieżącymi danymi i wykorzystywany do analiz, planowania i symulacji. Obejmuje zasoby, zlecenia, marszruty, zapasy i reguły. Cyfrowa nić (digital thread) to ciągłe powiązanie danych produktu w całym cyklu życia: od projektowania, przez produkcję i kontrolę, po eksploatację i utrzymanie. W lotnictwie cyfrowa nić jest ściśle związana z identyfikowalnością i zarządzaniem konfiguracją, ponieważ łączy stan zaprojektowany, wykonany i utrzymywany.

### 14.2 Korzyści dla planowania i jakości

- **Planowanie:** bliźniak fabryki umożliwia scenariusze i optymalizację oparte na bieżącym stanie (patrz sekcja 11.4).
- **Identyfikowalność:** cyfrowa nić odpowiada na pytania o partie, procesy i konfiguracje w ciągu minut zamiast dni.
- **Zmiany:** widoczny staje się wpływ zmiany konstrukcyjnej na otwarte zlecenia, zapasy i marszruty.
- **MRO:** powiązanie historii produkcji z ustaleniami z utrzymania pozwala wyciągać wnioski o słabościach procesów i konstrukcji.

### 14.3 Warunki wstępne

Cyfrowy bliźniak jest tak dobry, jak jego dane. Zanim zainwestujesz w modele, sprawdź marszruty, normy czasowe, kalendarze zdolności produkcyjnych, kwalifikacje i jakość potwierdzeń. Firma doradcza 4flow wskazuje jako typowe przeszkody w lotnictwie błędne zestawienia materiałowe, nieaktualne terminy dostaw oraz dane rozproszone między niepołączonymi platformami ERP, PLM i MES, co często sprowadza planistów z powrotem do niepowiązanych arkuszy kalkulacyjnych [33]. Siostrzany przewodnik [Cyfrowy bliźniak w produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/) omawia ten temat szerzej; pytania dotyczące architektury IT, takie jak łączenie danych maszyn i planowania z platformami chmurowymi, opisano w przewodniku [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/). Dla danych podlegających kontroli eksportu lub zasadom CUI miejsce przechowywania i prawa dostępu należy wyjaśnić z góry [36][37][49]. W amerykańskich programach obronnych obejmuje to poziom CMMC wymagany dla systemów przechowujących dane [49][50].

## 15. KPI do planowania i sterowania

| KPI | Definicja | Dlaczego ma znaczenie w lotnictwie |
|---|---|---|
| Terminowość dostaw (OTD) | udział dostaw zrealizowanych w uzgodnionym terminie (definicję i okno tolerancji uzgodnić z klientem) | centralne kryterium ocen dostawców; wymagane w AS9100 [14] |
| Czas realizacji (lead time) | czas od rozpoczęcia zlecenia do jego zakończenia, jako wartość średnia i rozrzut | określa zdolność dostaw oraz zapasy (prawo Little'a) [27] |
| Praca w toku (WIP) | liczba lub wartość zleceń na hali produkcyjnej | wskaźnik wyprzedzający wzrostu czasów realizacji |
| Wykorzystanie wąskiego gardła | czas zajęty ÷ czas dostępny na wąskim gardle | określa przepustowość; powyżej 90 % czasy oczekiwania gwałtownie rosną [38] |
| Dotrzymywanie harmonogramu | udział operacji zakończonych w zaplanowanym oknie czasowym | pokazuje, czy plan jest realistyczny |
| Wyrwania (escapes) | liczba wadliwych części, które trafiają do klienta | najwyższy koszt, często metryka klienta; wymagany element systemu jakości posiadaczy zatwierdzenia produkcji FAA [41] |
| Wydajność za pierwszym razem (FPY) | udział części bez przeróbki i braku | przeróbki zużywają moce wąskiego gardła |
| Czas FAI | czas od wykonania pierwszego egzemplarza do zatwierdzenia | czynnik często niedoszacowany przy uruchomieniach i zmianach |
| Odchylenie krzywej uczenia się | rzeczywiste godziny na sztukę w porównaniu z krzywą docelową | pokazuje, czy założenia uruchomienia się sprawdzają |
| Czas obrotu (TAT) | czas od przyjęcia do zwrotu w MRO, jako wartość średnia i percentyle | główne kryterium klientów MRO |
| Wskaźnik ustaleń | udział zleceń z pracami nierutynowymi oraz ich nakład | podstawa planowania zdolności MRO |

**Uwaga dotycząca pomiaru:** Każdy KPI należy zdefiniować jednoznacznie i stosować tę definicję konsekwentnie. Zwłaszcza definicje OTD różnią się między klientami (odniesienie do pierwszej żądanej lub potwierdzonej daty, dopuszczalna dostawa przed terminem, dostawa częściowa lub kompletna). Wskaźnik, który każdy liczy inaczej, nie steruje niczym. Powiązany przewodnik [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) szczegółowo omawia definicje KPI.

## 16. Podejście: sześć kroków do wiarygodnego planu

**Krok 1: Zmierzyć stan obecny.** Zebrać czasy realizacji, WIP, OTD i wykorzystanie według zasobów w okresie co najmniej trzech miesięcy. Mapa strumienia wartości dla najważniejszych rodzin części pokazuje, gdzie marnuje się czas.

**Krok 2: Zidentyfikować wąskie gardła.** Gdzie piętrzą się zlecenia? Który zasób determinuje przepustowość? Uwzględnić zewnętrzne procesy specjalne, kontrolę oraz kwalifikacje personelu.

**Krok 3: Uporządkować dane podstawowe.** Marszruty, normy czasowe, czasy przezbrojeń, kalendarze zdolności, kwalifikacje, czasy realizacji zaopatrzenia. Bez tej podstawy każde narzędzie planistyczne daje błędne wyniki.

**Krok 4: Wprowadzić reguły sterowania.** Ograniczyć WIP, powiązać zwolnienia do produkcji z wąskim gardłem, chronić wąskie gardło buforem i ustalić reguły priorytetów.

**Krok 5: Wprowadzić harmonogramowanie oparte na ograniczeniach.** Dodać do ERP szczegółowe harmonogramowanie uwzględniające skończone zdolności, kwalifikacje i terminy zewnętrzne. Zacząć od obszaru pilotażowego, najlepiej od wąskiego gardła.

**Krok 6: Ustanowić scenariusze i pętlę sprzężenia zwrotnego.** Wykorzystać symulację do decyzji o tempie produkcji i inwestycjach oraz co tydzień porównywać plan z wykonaniem. Stale poprawiać parametry planistyczne na podstawie potwierdzeń.

> **Szybki test dla kierowników zakładu i planowania: pięć pytań, na które można odpowiedzieć w tym tygodniu**
>
> 1. Który zasób jest dziś waszym wąskim gardłem i jakie było jego wykorzystanie w ciągu ostatnich czterech tygodni?
> 2. Ile zleceń znajduje się obecnie na hali i ile z nich czeka na zewnętrzne procesy specjalne lub kontrolę?
> 3. Ile czasu zajmuje odnalezienie wszystkich numerów seryjnych dla konkretnej partii (wytopu) surowca?
> 4. Jakich norm czasowych używacie dla części dopiero uruchamianych: czasów dla dojrzałego tempa czy krzywej uczenia się?
> 5. Co stanie się z terminowością dostaw, jeśli wasz najważniejszy zewnętrzny wykonawca będzie niedostępny przez dwa tygodnie?
>
> Jeśli na którekolwiek z tych pytań nie możecie odpowiedzieć danymi w ciągu jednego dnia, zacznijcie od Kroku 1.

**Harmonogram:** Kroki 1–4 nie wymagają nowego oprogramowania i według doświadczenia autora w wielu firmach można je wdrożyć w ciągu kilku miesięcy [unverified: brak publicznych danych porównawczych o czasie wdrożenia; ocena oparta na doświadczeniu autora]. Kroki 5 i 6 wymagają wdrożenia oprogramowania; ich czas trwania zależy przede wszystkim od jakości danych podstawowych. Wiarygodnych danych branżowych dotyczących czasu trwania nie ma.

## 17. Typowe błędy i jak ich unikać

1. **Planowanie przy nieskończonej zdolności produkcyjnej.** Logika MRP w ERP ignoruje wąskie gardła. Skutek: plany, które od początku są niewykonalne. *Rozwiązanie:* szczegółowe harmonogramowanie przy skończonej zdolności produkcyjnej.
2. **Zwalnianie większej liczby zleceń, aby dostarczać szybciej.** Zgodnie z prawem Little'a wyższe WIP wydłuża czas realizacji. *Rozwiązanie:* powiązanie zwolnień z wąskim gardłem.
3. **Modelowanie procesów zewnętrznych jako stałego czasu realizacji.** Procesy zewnętrzne mają swoje zdolności, rytmy i zmienność. *Rozwiązanie:* uzgodnienie slotów i planowanie ich jako zasobu.
4. **Zapominanie o kontroli i FAI.** Laboratorium kontroli i kontrolerzy nie są planowani i stają się ukrytym wąskim gardłem. *Rozwiązanie:* kroki kontroli jako operacje o określonej zdolności.
5. **Stosowanie norm czasowych dojrzałej produkcji w fazie uruchamiania.** Krzywe uczenia są ignorowane, uruchomienie jest niedoplanowane. *Rozwiązanie:* krzywa uczenia oparta na własnych danych.
6. **Ocenianie średniej zamiast wąskiego gardła.** Średnie wykorzystanie na poziomie 75 % nic nie mówi o zasobie będącym wąskim gardłem. *Rozwiązanie:* ocena zasób po zasobie, z naciskiem na wąskie gardło.
7. **Odtwarzanie identyfikowalności po fakcie.** Brakujące potwierdzenia są składane w całość na końcu. *Rozwiązanie:* rejestrowanie w trakcie procesu, przypisanie materiału przed startem.
8. **Ignorowanie kwalifikacji.** Plan przydziela zadania osobom bez ważnych kwalifikacji. *Rozwiązanie:* macierz kwalifikacji jako ograniczenie.
9. **Traktowanie celów wydajności jako zobowiązań.** Zdolność buduje się pod oficjalny cel, który następnie się nie realizuje. *Rozwiązanie:* scenariusze z wyzwalaczami.
10. **Składanie zobowiązań na podstawie średniej w MRO.** Zobowiązania TAT oparte na średniej są regularnie niedotrzymywane, gdy pojawiają się ustalenia. *Rozwiązanie:* percentyle i strategia częściowa.
11. **Dopuszczanie, by zlecenia pilne stały się regułą.** Ciągłe przyspieszanie niszczy stabilność harmonogramu. *Rozwiązanie:* jasne zasady priorytetów i prawa interwencji.
12. **Oprogramowanie przed danymi.** APS jest wdrażany, zanim dane główne są poprawne. *Rozwiązanie:* jakość danych jako pierwszy pakiet prac.
13. **Traktowanie danych kontrolowanych jako sprawy drugorzędnej dla IT.** Zlecenia ITAR lub CUI trafiają do systemu planowania lub tenanta chmurowego, który nie jest do nich przystosowany. *Rozwiązanie:* wyjaśnienie zakresu kontroli eksportu i CMMC przed wyborem lub wdrożeniem oprogramowania planistycznego [36][49].

## 18. iFAKT i lotnictwo

> **Uwaga: Autor pracuje w iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), z siedzibą w Stuttgarcie w Niemczech, opracowuje oprogramowanie [Polaris](https://www.m365.fm/entity/polaris/). Według strony internetowej firmy Polaris łączy dane z ERP z cyfrowym bliźniakiem produkcji w celu optymalizacji planów. Platforma obejmuje moduły do modelowania strumienia wartości i procesów biznesowych, symulacji, optymalizacji planowania (Optimizer), realizacji na hali produkcyjnej (Operator) oraz analityki (Analyzer) [31]. Strona internetowa wymienia lotnictwo jako osobną branżę i opisuje wsparcie dla dostawców i producentów o złożonych procesach wytwarzania [31].

Jako referencję lotniczą iFAKT publikuje studium przypadku z Airbus Netherlands. Od 2018 roku zakład wytwarza ramy ciągu dla modułów napędowych rakiety nośnej Ariane 6 (Vulcain Aft Bay i Vinci Thrust Frame). Według studium przypadku moduły Polaris Optimizer, Operator i Analyzer wspierają tę produkcję od siedmiu lat. Wskazane wymagania to: cyfrowa dokumentacja, zapewnienie jakości w trakcie procesu, krótsze czasy realizacji, automatyczne harmonogramowanie zleceń i optymalizacja przydziału zasobów. Studium opisuje wyniki jakościowe, takie jak krótsze czasy oczekiwania dzięki szybszej reakcji na nieplanowane zmiany, krótsze czasy przekazywania oraz dostępność statusu zleceń w dowolnym momencie; nie podaje jednak żadnych liczb [32]. Kierownik AIT w Airbus Netherlands jest cytowany, że narzędzia Polaris pomogły wprowadzić więcej struktury do produkcji [32].

Na swojej stronie głównej iFAKT podaje również wskaźniki poprawy z zastrzeżeniem „do” (na przykład dla czasu realizacji i zdolności produkcyjnej). Ponieważ nie opublikowano metodologii ich wyliczenia, nie są one tutaj wykorzystywane [31].

**Kontekst:** Wymagania opisane w tym przewodniku (harmonogramowanie oparte na ograniczeniach, kwalifikacje, operacje zewnętrzne, symulacja scenariuszy wydajności, informacja zwrotna z hali produkcyjnej) są niezależne od dostawcy. Polaris jest jednym z kilku rozwiązań na rynku. Oceń każdy system według kryteriów z punktu 11.3 oraz w pilotażu opartym na własnych danych. Artykuł siostrzany [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) szczegółowo opisuje to oprogramowanie.

## 19. Glosariusz

**APQP (Advanced Product Quality Planning):** Ustrukturyzowane planowanie jakości nowych wyrobów i procesów; w lotnictwie regulowane przez AS9145 / EN 9145.

**APS (Advanced Planning and Scheduling):** Oprogramowanie do planowania, które harmonogramuje zadania z uwzględnieniem skończonej zdolności produkcyjnej i dostępności materiałów.

**As-built / as-designed:** Konfiguracja faktycznie wykonana w porównaniu z konfiguracją określoną przez konstrukcję.

**Wąskie gardło (ograniczenie):** Zasób, który ogranicza przepustowość całego systemu.

**CAMO (Continuing Airworthiness Management Organisation):** Organizacja zatwierdzona przez EASA, która zarządza ciągłą zdatnością do lotu statku powietrznego (EASA Part-CAMO).

**CMMC (Cybersecurity Maturity Model Certification):** Program Departamentu Obrony USA weryfikujący cyberbezpieczeństwo wykonawców przetwarzających FCI lub CUI; klauzula kontraktowa DFARS 252.204-7021.

**CUI (Controlled Unclassified Information):** Informacje rządowe wymagające ochrony, lecz niebędące tajemnicą państwową; ich obecność w systemach planowania powoduje objęcie tych systemów zakresem CMMC.

**Cyfrowa nić (digital thread):** Ciągłe powiązanie wszystkich danych o wyrobie w całym cyklu życia.

**Drum-buffer-rope (DBR):** Zasada sterowania z teorii ograniczeń (Theory of Constraints), w której wąskie gardło wyznacza tempo pracy i ogranicza zwolnienia do produkcji.

**EASA Form 1:** Certyfikat zwolnienia do użytku części lotniczych wydawany przez organizacje produkcyjne lub remontowe zatwierdzone przez EASA.

**Effectivity:** Oświadczenie określające numer seryjny, statek powietrzny lub datę, od których obowiązuje dana konfiguracja lub zmiana.

**Ucieczka (escape):** Wadliwa część, która dotarła do klienta.

**FAA Form 8130-3:** Certyfikat zwolnienia FAA (Airworthiness Approval Tag) do zatwierdzenia zdatności do lotu w kraju, przywrócenia do eksploatacji i eksportu; wydawany wyłącznie przez osoby i organizacje upoważnione przez FAA.

**FAI (First Article Inspection):** Pełna kontrola pierwszej wyprodukowanej części pod kątem wszystkich charakterystyk konstrukcyjnych zgodnie z AS9102 / EN 9102.

**Genealogia:** Relacje nadrzędności i podrzędności między materiałem, partiami, częściami i zespołami.

**HMLV (high mix, low volume):** Produkcja wielu wariantów w małych ilościach.

**Charakterystyka kluczowa:** Cecha, której zmienność istotnie wpływa na dopasowanie, funkcję, właściwości lub resurs; regulowana przez AS9103 / EN 9103.

**Krzywa uczenia się:** Zależność między skumulowaną liczbą wyrobów a nakładem pracy na jednostkę; wg Wrighta (1936).

**LLP (life-limited part):** Część o zatwierdzonym maksymalnym resursie w cyklach lub godzinach.

**MRO (maintenance, repair and overhaul):** Usługi obsługi, naprawy i remontu statków powietrznych oraz podzespołów.

**Nadcap:** Program akredytacji procesów specjalnych zarządzany przez przemysł, administrowany przez Performance Review Institute (PRI).

**OTD (on-time delivery):** Udział dostaw zrealizowanych w uzgodnionym terminie.

**Part 145:** W USA certyfikat stacji napraw FAA (14 CFR Part 145); w UE zatwierdzenie organizacji technicznej przez EASA.

**Part 21 Subpart G:** W USA certyfikat produkcyjny FAA (14 CFR 21.131 do 21.150); w UE zatwierdzenie organizacji produkcyjnej (POA) przez EASA.

**PMA (Parts Manufacturer Approval):** Zatwierdzenie produkcji przez FAA dla części zamiennych i modyfikacyjnych (14 CFR Part 21, Subpart K).

**PPAP (Production Part Approval Process):** Procedura zatwierdzania części produkcyjnych; w lotnictwie część AS9145 / EN 9145.

**Tempo (rate):** Ilość produkcji na miesiąc, na przykład tempo 75 = 75 statków powietrznych miesięcznie.

**Stacja napraw:** Organizacja techniczna certyfikowana przez FAA zgodnie z 14 CFR Part 145.

**Proces specjalny:** Proces, którego wyniku nie można w pełni zweryfikować na gotowej części bez jej zniszczenia, na przykład obróbka cieplna lub obróbka powierzchni.

**TAT (turnaround time):** Czas od przyjęcia zlecenia obsługowego do zwrotu wyrobu klientowi.

**Dostawca I stopnia / II stopnia (Tier 1 / Tier 2):** Poziomy dostawców; Tier 1 dostarcza bezpośrednio producentowi statków powietrznych, Tier 2 dostarcza Tier 1.

**WIP (work in process):** Zapasy w toku produkcji na hali produkcyjnej.

## 20. FAQ: najczęstsze pytania dotyczące planowania produkcji lotniczej

**Czym jest planowanie produkcji lotniczej?**
To planowanie ilości, terminów, zdolności produkcyjnych i materiałów przy produkcji samolotów, silników i komponentów, zgodnie z wymaganiami branży dotyczącymi dowodów zgodności. Łączy produkcję wielowariantową, małoseryjną, długie czasy realizacji i zewnętrzne procesy specjalne z rygorystyczną identyfikowalnością i kontrolą konfiguracji. Tempo produkcji określone przez klientów, czyli producentów samolotów, wyznacza rytm wszystkich poziomów łańcucha dostaw.

**Dlaczego sam harmonogram z ERP nie wystarcza w lotnictwie?**
Klasyczna logika MRP liczy ze stałymi czasami realizacji i bez ograniczeń zdolności produkcyjnych. Wykonalny harmonogram produkcji musi uwzględniać skończone zdolności, kwalifikacje ludzi i maszyn oraz miejsca u zewnętrznych wykonawców procesów. Robią to systemy APS lub rozszerzona warstwa szczegółowego harmonogramowania.

**Jakie tempo produkcji planuje Airbus dla rodziny A320?**
Według raportu Airbusa za pierwsze dziewięć miesięcy 2026 roku spółka dąży do 70–75 samolotów miesięcznie do końca 2027 roku, a następnie do ustabilizowania produkcji na poziomie 75 [3]. Cel był kilkakrotnie przesuwany, po części z powodu braku silników [4].

**Jakie jest tempo produkcji Boeinga 737?**
W maju 2026 roku prezes Boeinga powiedział, że linia 737 pracuje w tempie 47 [8]. Raport Boeinga za trzeci kwartał 2026 roku opisuje program jako zmierzający do ustabilizowanej produkcji na poziomie 47 miesięcznie [47]. FAA ograniczyła tempo do 38 po styczniu 2024 roku, a w październiku 2025 roku zatwierdziła 42 [7].

**Jakie normy powinien znać dostawca dla lotnictwa?**
Podstawą jest AS9100D (EN 9100:2018). W zależności od zakresu prac dochodzą AS9102 (kontrola pierwszego egzemplarza), AS9103 (charakterystyki kluczowe), AS9145 (APQP/PPAP), AS9120 (dystrybutorzy) i często akredytacja Nadcap dla procesów specjalnych. Posiadacze zatwierdzenia produkcji działają w ramach FAA 14 CFR Part 21 (lub EASA Part 21 Subpart G); dostawcy dla obronności podlegają także wymogom ITAR/EAR, DFARS i CMMC.

**Czym różni się AS9100 od EN 9100?**
Pod względem treści niczym. Norma IAQG jest publikowana jako AS9100 przez SAE International w Ameryce, jako EN 9100 w Europie i jako JISQ 9100 w Azji [13][14].

**Czy AS9100D nadal obowiązuje?**
Tak. IAQG pracuje nad rewizją, która ma zostać opublikowana jako IA9100. Od października 2026 roku data publikacji i okres przejściowy nie zostały potwierdzone, a certyfikaty AS9100D pozostają ważne [15].

**Czego wymaga AS9100 w zakresie identyfikowalności?**
Wymaga identyfikowalności surowców, zastosowanych materiałów i procesów, a także narzędzi i osób [14]. Klienci dodają konkretne wymagania w swoich wymaganiach jakościowych dla dostawców, a posiadacze zatwierdzenia produkcji FAA przenoszą na dostawców własne wymagania systemu jakości [41].

**Kiedy wymagana jest kontrola pierwszego egzemplarza (AS9102)?**
Dla nowych części oraz dla zmian, które mogą wpłynąć na kształt, dopasowanie lub funkcję, na przykład w konstrukcji, materiale, źródle produkcji, procesie, oprzyrządowaniu lub miejscu wytwarzania, a także po przerwie w produkcji dłuższej niż dwa lata. W zależności od zakresu wymagana jest pełna lub częściowa kontrola FAI [34].

**Czym jest krzywa uczenia się w produkcji samolotów i dlaczego ma znaczenie dla planowania?**
Krzywa uczenia się opisuje, jak nakład pracy na jednostkę spada wraz ze wzrostem skumulowanej ilości. Wright wykazał w 1936 roku redukcję o około 20 % przy każdym podwojeniu [25]. Jeśli planuje się uruchomienie produkcji według czasów z tempa dojrzałego, znacznie zaniża się wymaganą zdolność produkcyjną (przykład obliczeniowy w rozdziale 9).

**Jak poprawnie planować narastanie tempa produkcji?**
Oceniaj każdy zasób osobno, zwłaszcza wąskie gardło, zamiast średniego wykorzystania. Licz kilka scenariuszy tempa, uwzględniaj krzywe uczenia się, zdolność kontroli, czasy kwalifikacji i zatwierdzeń oraz zabezpieczaj zewnętrzne moce przerobowe w umowach. Pomaga w tym lista kontrolna z rozdziału 10.3.

**Czym jest Nadcap?**
Nadcap to zarządzany przez branżę program akredytacji procesów specjalnych, takich jak obróbka cieplna, procesy chemiczne, spawanie i badania nieniszczące; został założony w 1990 roku i jest administrowany przez Performance Review Institute [21][54]. Wielu klientów wymaga akredytacji Nadcap dla procesów specjalnych.

**Czy APS może obsługiwać procesy zewnętrzne, takie jak obróbka cieplna?**
Tak, jeśli są modelowane jako zasoby z określoną zdolnością i miejscami, a nie jako płaski czas realizacji. Uzgodnij z wykonawcą cotygodniowe miejsca, zapisz je jako ograniczenie i uczyń zwrot certyfikatu warunkiem następnej operacji (rozdział 7.2).

**Czy CMMC dotyczy dostawców dla branży lotniczej?**
Dotyczy wykonawców i podwykonawców obronnych, których umowy obejmują federalne informacje kontraktowe (FCI) lub niejawne informacje niesklasyfikowane kontrolowane (CUI). Klauzula DFARS weszła w życie 10 listopada 2025 roku i jest wdrażana stopniowo przez trzy lata; obowiązuje w dół łańcucha w podwykonawstwie, gdy obejmuje FCI lub CUI [49].

**Czym planowanie MRO różni się od planowania produkcji?**
W utrzymaniu ruchu zakres prac jest znany dopiero po przeglądzie. Planowanie musi uwzględniać prawdopodobieństwa wykrycia usterek, dostępność części i bufory. Kluczowym KPI jest czas realizacji naprawy (TAT).

**Jak zakład naprawczy może skrócić czas realizacji?**
Przez wczesne przeglądy, magazynowanie krytycznych części lub zapewnienie ich z puli wymiennej, rezerwowanie zdolności produkcyjnych na prace niestandardowe oraz przyspieszanie zatwierdzeń przez klienta. Zobowiązania TAT powinny opierać się na percentylach, a nie na średnich.

**Które KPI są najważniejsze dla dostawców w branży lotniczej?**
Terminowość dostaw (OTD), czas realizacji, zapasy w toku (WIP), wykorzystanie wąskiego gardła, ucieczki wad oraz wskaźnik wyrobów dobrych za pierwszym razem (FPY). W utrzymaniu ruchu dochodzą czas realizacji naprawy i wskaźnik wykrywania usterek.

**Co cyfrowy bliźniak wnosi do produkcji lotniczej?**
Umożliwia analizę scenariuszy tempa produkcji i inwestycji, szybsze przeplanowanie w czasie zakłóceń oraz wraz z cyfrową nicią (digital thread) szybkie odpowiedzi na pytania o identyfikowalność. Warunkiem jest czyste dane podstawowe (master data) i dane potwierdzeń.

**Gdzie w 2026 roku znajdują się największe ryzyka w łańcuchu dostaw?**
Według Roland Berger – w wykwalifikowanej sile roboczej, surowcach takich jak tytan, odlewy i kuźnie, elementach złącznych oraz usługach badań i obróbki powierzchniowej [10]. W przypadku silników niedobory dostaw ograniczają tempo produkcji producentów samolotów [4].

## 21. Podsumowanie

W 2026 roku branża lotnicza ma pełne portfele zamówień, ale łańcuch dostaw może je realizować jedynie powoli. Dla dostawców i warsztatów obsługowych planowanie produkcji stało się czynnikiem konkurencyjności. Ci, którzy znają swoje wąskie gardła, realistycznie planują krzywe uczenia się i procesy specjalne, wbudowują identyfikowalność w przepływ zleceń i z wyprzedzeniem obliczają scenariusze tempa produkcji, mogą przeprowadzić narastanie produkcji bez utraty terminowości dostaw i jakości.

Droga do tego rzadko zaczyna się od oprogramowania. Zaczyna się od pomiaru, czystych danych podstawowych i prostych reguł sterowania, takich jak ograniczony WIP i zwolnienia oparte na wąskim gardle. APS, symulacje i cyfrowe bliźniaki wzmacniają te fundamenty; nie zastępują ich. Mechanizmy są dobrze znane i opisane od dziesięcioleci, od krzywej uczenia Wrighta po prawo Little'a i teorię ograniczeń. Prawdziwym zadaniem jest ich konsekwentne stosowanie.

## Dalsza lektura na m365.fm

**Wpis i podcast**

- [Planowanie produkcji lotniczej: czas realizacji i identyfikowalność](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- Odcinek podcastu [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)

**Strony encji**

[Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [iFAKT](https://www.m365.fm/entity/ifakt/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Powiązane przewodniki**

- [Planowanie produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Cyfrowy bliźniak w produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Manufacturing IT z Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Mapowanie strumienia wartości](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI produkcyjne](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Zarządzanie na hali produkcyjnej](https://www.m365.fm/en/learn/shop-floor-management/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** jest gospodarzem m365.fm i pracuje w iFAKT GmbH. Na m365.fm pisze o planowaniu produkcji, identyfikowalności, symulacji i cyfryzacji wytwarzania. Koncentruje się na tym, jak planowanie oparte na ograniczeniach, cyfrowe bliźniaki i informacje zwrotne z hali produkcyjnej współpracują ze sobą, aby plany sprawdzały się na hali, nawet w wymagających branżach, takich jak lotnictwo.

**Uwaga: Autor pracuje w iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources 41 to 55 were added for the US version and verified online on that date.

1. BDLI (German Aerospace Industries Association): BDLI Industry Data 2026: Aerospace Industry Sets New Records for Revenue and Employment. Press release, Berlin, May 27, 2026. https://www.bdli.de/en/meldungen/bdli-branchendaten-2026-luft-und-raumfahrtindustrie-erreicht-neue-rekorde-bei-umsatz-und
2. Nasdaq/RTTNews: Airbus Delivers 793 Aircraft In 2025 As Order Backlog Reaches Record Level. January 2026. https://www.nasdaq.com/articles/airbus-delivers-793-aircraft-2025-order-backlog-reaches-record-level
3. Airbus: Airbus reports Nine-Month (9m) 2026 results. Press release, October 28, 2026. https://www.airbus.com/en/newsroom/press-releases/2026-10-airbus-reports-nine-month-9m-2026-results
4. Aerospace Global News: Airbus accuses Pratt & Whitney of failing to deliver as A320 ramp up stalls. April 15, 2026. https://aerospaceglobalnews.com/news/airbus-pratt-whitney-a320-ramp-up/
5. Terminair: Airbus delivers 74 aircraft in October, needs 249 more by year-end for its 870 target. November 5, 2026. https://terminair.com/story/113485-airbus-delivers-74-aircraft-in-october-needs-249
6. Boeing: Boeing Reports Fourth-Quarter Results. Press release, January 27, 2026. https://boeing.mediaroom.com/2026-01-27-Boeing-Reports-Fourth-Quarter-Results
7. Assembly Magazine: Boeing Cleared to Boost Production of 737 MAX. October 22, 2025. https://www.assemblymag.com/articles/99622-boeing-cleared-to-boost-production-of-737-max
8. CAPA Centre for Aviation: Boeing testing production rate of 47 aircraft per month, cautious of increasing to 52: CEO. May 28, 2026. https://centreforaviation.com/news/boeing-testing-production-rate-of-47-aircraft-per-month-cautious-of-increasing-to-52-ceo-1360867
9. ADS Group (summary of the IATA release): Supply chain challenges could cost airlines over $11bn in 2025. October 14, 2025; study "Reviving the Commercial Aircraft Supply Chain" by IATA and Oliver Wyman. https://www.adsgroup.org.uk/knowledge/industry-member-news/supply-chain-challenges-could-cost-airlines-over-11bn-in-2025/
10. Roland Berger: Global Aerospace Supply Chain Study 2026. June 2026 (survey of 95 companies, January/February 2026). https://mailing.rolandberger.com/hubfs/07_presse/Aerospace%20Supply%20Chain%20Study%202026%20Roland%20Berger.pdf
11. CNBC: RTX to take $3 billion charge on Pratt & Whitney engine problem. September 11, 2023. https://www.cnbc.com/2023/09/11/rtx-to-take-3-billion-charge-on-pratt-whitney-engine-problem.html
12. Malay Mail (Reuters): Boeing suspends Russian titanium as Airbus keeps buying. March 8, 2022. https://www.malaymail.com/news/money---international/2022/03/08/boeing-suspends-russian-titanium-as-airbus-keeps-buying/2046061
13. IAQG: Standards (overview of the 9100 family). https://ma.iaqg.org/standards
14. TÜV Rheinland: FAQ EN/AS 9100ff. series of standards (German). https://certification.tuv.com/content-media-files/master-content/services/systems/0403-tuv-rheinland-en-as-9100ff-series-of-standards/tuv-rheinland-en-as-9100-faq-de.pdf
15. The QMS Collective: The Current AS9100 Revision, and How to Read Dates That Keep Slipping. October 16, 2026. https://theqmscollective.com/blog/current-as9100-revision-confirmed-vs-expected-ia9100
16. Estonian Centre for Standardisation (EVS): EVS-EN 9145:2018 Aerospace series – Requirements for Advanced Product Quality Planning and Production Part Approval Process. https://www.evs.ee/en/evs-en-9145-2018
17. DIN Media: DIN EN 9102:2025-01, Aerospace series – Quality management systems – First article inspection requirement (EN 9102:2024). https://www.dinmedia.de/en/standard/din-en-9102/377807227
18. Net-Inspect: AS9102 First Article Inspection Report Rev B vs Rev C. https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/
19. IAQG: 9103 Variation Management of Key Characteristics. https://iaqg.org/standard/9103-variation-management-of-key-characteristics/ ; EVS-EN 9103:2023: https://www.evs.ee/en/evs-en-9103-2023
20. EVS: EVS-EN 9110:2018 Quality Management Systems – Requirements for Aviation Maintenance Organizations. https://www.evs.ee/en/evs-en-9110-2018
21. Wikipedia: Nadcap. https://en.wikipedia.org/wiki/Nadcap
22. EASA: Easy Access Rules for Initial Airworthiness and Environmental Protection (Part 21), 21.A.131 Scope (Subpart G). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-initial-airworthiness-and?page=13
23. EASA: Easy Access Rules for Continuing Airworthiness (Regulation (EU) No 1321/2014 with Part-M, Part-145, Part-CAMO; amending Regulation (EU) 2019/1383). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness?page=66
24. Wright, T. P.: Factors Affecting the Cost of Airplanes. Journal of the Aeronautical Sciences, vol. 3, no. 4 (1936), pp. 122–128. Reference: https://en.wikipedia.org/wiki/Theodore_Paul_Wright
25. Wikipedia: Experience curve effect. https://en.wikipedia.org/wiki/Experience_curve_effect
26. U.S. Government Accountability Office (GAO): Cost Estimating and Assessment Guide, Cumulative Average Formulation. https://gaoinnovations.gov/cost-guide/cumulative-average-formulation.html
27. Little, John D. C.: A Proof for the Queuing Formula L = λW. Operations Research, vol. 9, no. 3 (1961), pp. 383–387.
28. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press, 1984.
29. Oliver Wyman: Why engine availability is a growing challenge for aviation. September 24, 2026. https://www.oliverwyman.com/our-expertise/insights/2026/sep/aviation-engine-availaibility-bottlenecks.html
30. Oliver Wyman / ARSA: Global Fleet & MRO Market Forecast 2026–2036, Executive Summary. 2026. https://arsa.org/wp-content/uploads/2026/03/ARSA-OW-2026FleetMROMarketReport-ExecSum-2026.pdf
31. iFAKT GmbH: website (home page, solutions, contact, imprint). https://www.ifakt.de/
32. iFAKT GmbH: Customer Reference Airbus Netherlands. https://www.ifakt.de/references/Airbus_Netherlands_Reference.pdf
33. 4flow: Advanced planning in multi-level production networks in aviation and aerospace. https://4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace
34. InspectionXpert: When to Conduct a First Article Inspection. https://www.inspectionxpert.com/blog/when-to-conduct-a-first-article-inspection
35. IAQG: 9145 Guidance Presentation (APQP phases, PPAP elements). https://ma.iaqg.org/wp-content/uploads/2019/10/9145-Guidance-Presentation.pdf
36. Electronic Code of Federal Regulations: International Traffic in Arms Regulations, 22 CFR Parts 120–130 (https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M); Export Administration Regulations, 15 CFR Parts 730–774 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C).
37. Produktion (German trade journal): Nachweispflicht als Nadelöhr: Warum die Rückverfolgbarkeit über Millionenaufträge in der Verteidigungsindustrie entscheidet ("Evidence requirements as a bottleneck: why traceability decides multi-million defense contracts"). October 27, 2026. https://www.produktion.de/ruestung-aerospace/nachweispflicht-als-nadeloehr-warum-die-rueckverfolgbarkeit-ueber-millionenauftraege-in-der-verteidigungsindustrie-entscheidet/2758489
38. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society, vol. 57, no. 4 (1961), pp. 902–904.
39. Defence Agenda: Airbus Keeps Production Ramp-Up Targets Unchanged. August 1, 2026. https://defenceagenda.com/airbus-production-ramp-up-targets-h1-2026
40. Martin, James R.: Learning Curve Summary (cumulative average model after Wright, incremental unit model after Crawford). Management And Accounting Web. https://maaw.info/LearningCurveSummary.htm
41. 14 CFR 21.137 Quality system (production certificates), 14 CFR 21.307 Quality system (PMA), and table of subparts of 14 CFR Part 21. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/21.137 ; https://www.law.cornell.edu/cfr/text/14/21.307 ; https://www.law.cornell.edu/cfr/text/14/part-21 (official text: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-21/subpart-G)
42. Electronic Code of Federal Regulations: 14 CFR Part 145 Repair Stations (145.1, 145.59, 145.109, 145.163, 145.201, 145.219). https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
43. FAA: Order 8130.21H, Procedures for Completion and Use of the Authorized Release Certificate, FAA Form 8130-3, Airworthiness Approval Tag. Effective February 1, 2014. https://www.faa.gov/documentLibrary/media/Order/FAA_Order_8130.21H.pdf
44. SAE International: AS9100D Quality Management Systems – Requirements for Aviation, Space, and Defense Organizations (revised September 20, 2016). https://saemobilus.sae.org/standards/as9100d-quality-management-systems-requirements-aviation-space-defense-organizations
45. SAE International: AS9145 Aerospace Series – Requirements for Advanced Product Quality Planning and Production Part Approval Process (issued November 8, 2016). https://saemobilus.sae.org/standards/as9145-aerospace-series-requirements-advanced-product-quality-planning-production-part-approval-process
46. ANSI Webstore: SAE AS9102C-2023, Aerospace Series – First Article Inspection Requirements. https://webstore.ansi.org/standards/sae/sae9102c2023
47. Boeing: Boeing Reports Third-Quarter Results. Press release, Arlington, Va., October 27, 2026. https://boeing.mediaroom.com/2026-10-27-Boeing-Reports-Third-Quarter-Results
48. Aerospace Industries Association (AIA): 2026 AIA Facts & Figures: U.S. Aerospace & Defense Industry Leads the World with $1 Trillion in Sales. June 25, 2026 (with S&P Global Market Intelligence, 2025 data). https://www.aia-aerospace.org/?p=27492 ; overview: https://aia-aerospace.org/industry-impact
49. Federal Register, vol. 90, no. 173 (September 10, 2025): Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
50. U.S. Department of Defense, Office of Small Business Programs: Cybersecurity Maturity Model Certification (CMMC) 2.0. https://business.defense.gov/Programs/Cyber-Security-Resources/CMMC-20
51. 48 CFR 252.225-7009 Restriction on Acquisition of Certain Articles Containing Specialty Metals. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/48/252.225-7009
52. FAA: Advisory Circular AC 21-29D, Detecting and Reporting Suspected Unapproved Parts. July 12, 2016. https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_21-29D.pdf
53. 14 CFR 91.417 Maintenance records. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/91.417
54. Boeing Suppliers: Nadcap Accreditation FAQ (Nadcap as an "industry-managed approach to conformity assessment of 'special processes'", administered by PRI). https://www.boeingsuppliers.com/nadcap/nadcap_faq.htm
55. Aerospace Manufacturing (aero-mag.com): Lack of capacity planning adding to ramp-up challenge, report reveals (Vendigital rate readiness assessment, 100+ suppliers). Undated. https://www.aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals
