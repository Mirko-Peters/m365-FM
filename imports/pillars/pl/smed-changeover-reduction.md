# SEO metadata

| Field | Value |
|---|---|
| Meta title | SMED: szybkie przezbrojenia i skrócenie czasu przestawiania |
| Meta description | SMED (wymiana matrycy w mniej niż 10 minut) wyjaśniony: szybkie przezbrojenie w 8 krokach, przezbrojenie wewnętrzne i zewnętrzne, wzory, przykłady i OSHA LOTO. |
| Slug | `smed-changeover-reduction` |

# SMED: Redukcja czasu wymiany matrycy i przezbrojenia krok po kroku

> **Krótka odpowiedź:** SMED (single-minute exchange of die) to metoda przezbrajania maszyny lub linii z jednego produktu na następny w możliwie najkrótszym czasie, z celem poniżej dziesięciu minut, czyli wartością jednocyfrową w minutach. Jej podstawowa idea pochodzi od Shigeo Shingo: oddzielić czynności przezbrojenia, które można wykonać tylko przy zatrzymanej maszynie (przezbrojenie wewnętrzne), od czynności, które można wykonać podczas pracy maszyny (przezbrojenie zewnętrzne), przenieść jak najwięcej pracy wewnętrznej na zewnętrzną, a następnie usprawnić wszystko, co pozostało [1][6].

> **Kluczowe wnioski**
> - Czas przezbrojenia biegnie od ostatniej dobrej sztuki starego zlecenia do pierwszej dobrej sztuki nowego zlecenia, przy normalnej prędkości. Rozruch i regulacja wliczają się do czasu przezbrojenia [2][21].
> - SMED działa w stałej kolejności: obserwacja, oddzielenie czynności wewnętrznych od zewnętrznych, przeniesienie czynności wewnętrznych na zewnętrzne, usprawnienie czynności wewnętrznych, usprawnienie czynności zewnętrznych, standaryzacja, powtórzenie [5].
> - Większość wczesnych zysków pochodzi z organizacji (przygotowania materiałów, listy kontrolne, wózki, równoległa praca), a nie z drogiego sprzętu [19][20].
> - Krótsze przezbrojenie w pełni się opłaca tylko wtedy, gdy wykorzystasz zyskany czas: mniejsze partie, częstsze przezbrojenia i krótszy EPEI albo większą zdolność wąskiego gardła. Przed rozpoczęciem projektu zdecyduj, który z tych celów jest najważniejszy.
> - Wielkość partii i zapasy rosną wraz z czasem przezbrojenia. W klasycznym wzorze na wielkość ekonomiczną partii obniżenie kosztu przezbrojenia o 75 procent zmniejsza ekonomiczną wielkość partii o połowę.
> - Każdy krok przezbrojenia wewnętrznego odbywa się na zatrzymanym urządzeniu. W USA przezbrajanie jest traktowane jako "serwisowanie" w rozumieniu standardu OSHA dotyczącego blokady i oznakowania (lockout/tagout), chyba że zastosowanie ma wąski wyjątek [8][9].
> - Zyski z przezbrojeń szybko słabną bez standardowej pracy, audytów i wskaźnika przezbrojeń na tablicy przy stanowisku. Badania krytykowały praktykę SMED za niedostateczne wykorzystanie konstrukcji urządzeń i słabe utrzymanie efektów [12][13].
> - Dobre wskaźniki KPI: średni czas przezbrojenia i jego rozrzut, odsetek przezbrojeń mieszczących się w standardzie, braki po rozruchu, liczba przezbrojeń na tydzień, EPEI i dni zapasu.

## Spis treści

1. [Czym jest SMED? Definicja i główna idea](#czym-jest-smed-definicja-i-główna-idea)
2. [Dlaczego czas przezbrojenia ma znaczenie: wielkość partii, zapasy, elastyczność i OEE](#dlaczego-czas-przezbrojenia-ma-znaczenie-wielkość-partii-zapasy-elastyczność-i-oee)
3. [Historia: od Taylora i Forda do Shingo i Toyoty](#historia-od-taylora-i-forda-do-shingo-i-toyoty)
4. [Jak poprawnie mierzyć czas przezbrojenia](#jak-poprawnie-mierzyć-czas-przezbrojenia)
5. [Metoda SMED w 8 krokach](#metoda-smed-w-8-krokach)
6. [Osiem technik Shingo z przykładami](#osiem-technik-shingo-z-przykładami)
7. [Techniki przezbrojeń według typu urządzenia](#techniki-przezbrajania-według-typu-urządzenia)
8. [Przykład SMED: pełny projekt na wtryskarce](#przykład-smed-kompletny-projekt-na-wtryskarce)
9. [Od krótszych przezbrojeń do mniejszych partii: EPEI i wielkość partii](#od-krótszych-przezbrojeń-do-mniejszych-partii-epei-i-wielkość-partii)
10. [Bezpieczeństwo: przezbrojenia, blokada i oznakowanie (lockout/tagout) oraz ergonomia](#bezpieczeństwo-przezbrojenia-blokowanie-i-oznakowanie-energii-oraz-ergonomia)
11. [Jakość: zatwierdzanie pierwszej sztuki, zapobieganie błędom i regulowane czyszczenie linii](#jakość-zatwierdzanie-pierwszej-sztuki-poka-yoke-i-kontrolowane-czyszczenie-linii)
12. [Ludzie i role: kto co robi przy przezbrojeniu](#ludzie-i-role-kto-co-robi-podczas-przezbrojenia)
13. [Szablony i listy kontrolne SMED](#szablony-i-listy-kontrolne-smed)
14. [Plan wdrożenia: od pilotażu do systemu przezbrojeń w całym zakładzie](#plan-wdrożenia-od-pilotażu-do-systemu-szybkiej-zmiany-przezbrojeń-w-całym-zakładzie)
15. [Wskaźniki KPI przezbrojeń: jak mierzyć postęp](#wskaźniki-kpi-przezbrojeń-jak-mierzyć-postęp)
16. [Uzasadnienie biznesowe: koszty, ROI i rozliczanie zapasów](#uzasadnienie-biznesowe-koszty-roi-i-rachunkowość-zapasów)
17. [SMED a inne narzędzia Lean](#smed-i-inne-narzędzia-lean)
18. [Udokumentowane przykłady SMED](#udokumentowane-przykłady-smed)
19. [Typowe błędy w SMED](#typowe-błędy-w-smed)
20. [Ograniczenia i krytyka SMED](#ograniczenia-i-krytyka-smed)
21. [SMED w wersji cyfrowej: dane, wideo, MES i planowanie](#smed-w-wersji-cyfrowej-dane-wideo-mes-i-harmonogramowanie)
22. [Słowniczek SMED](#glosariusz-smed)
23. [FAQ: pytania o SMED i przezbrojenia](#faq-smed-i-pytania-dotyczące-przezbrojeń)
24. [Podsumowanie i pierwsze kroki](#wnioski-i-pierwsze-kroki)

## Czym jest SMED? Definicja i główna idea

Lean Enterprise Institute (LEI) definiuje [SMED](https://www.m365.fm/entity/smed/) jako proces przezbrajania sprzętu produkcyjnego z jednego numeru części na inny w jak najkrótszym czasie [1]. Określenie „single-minute” nie oznacza jednej minuty. Oznacza jednocyfrową liczbę minut, czyli poniżej dziesięciu [1]. Nazwa „die” pochodzi od pras tłoczących, w których metodę zastosowano po raz pierwszy, ale SMED dotyczy każdego przezbrojenia: form, przyrządów, narzędzi skrawających, płyt drukarskich, części formatowych na linii pakującej, receptur na maszynie napełniającej.

[Przezbrojenie](https://www.m365.fm/entity/setup-time/) (zwane też setup) to czynność przełączenia maszyny lub powiązanej grupy maszyn, takiej jak gniazdo lub linia montażowa, z jednego produktu na inny [2]. LEI mierzy czas przezbrojenia od chwili, gdy ostatnia sztuka zakończonej serii opuszcza proces, do chwili, gdy z procesu schodzi pierwsza dobra sztuka następnej serii [2]. Ta granica ma znaczenie i wrócimy do niej w części o pomiarach.

### Przezbrojenie wewnętrzne i zewnętrzne

Kluczowe spostrzeżenie Shingo polegało na podziale każdego przezbrojenia na dwa rodzaje pracy [1]:

| Rodzaj | Definicja | Przykłady |
|---|---|---|
| **Przezbrojenie wewnętrzne** | Prace, które można wykonać wyłącznie przy zatrzymanej maszynie | Odmocowanie i zdjęcie starej matrycy, montaż nowej, wymiana części formatowych wewnątrz osłony, regulacja pierwszej sztuki |
| **Przezbrojenie zewnętrzne** | Prace, które można wykonać, gdy maszyna wciąż pracuje na poprzedniej serii lub już pracuje na następnej | Pobranie nowej matrycy, narzędzi i materiału; podgrzanie formy; sprawdzenie nowej matrycy pod kątem uszkodzeń; odłożenie starej matrycy do magazynu; dokumentacja |

W przezbrojeniu nieulepszonym prawie wszystko dzieje się przy stojącej maszynie: ustawiacz zatrzymuje maszynę, a dopiero potem szuka matrycy, suwnicy, właściwego klucza i rysunku. SMED przenosi „szukanie” i „pobieranie” poza czas postoju, a następnie koncentruje się na pracach, które rzeczywiście wymagają zatrzymanej maszyny.

### SMED, szybkie przezbrojenie i redukcja czasu przezbrojenia: pojęcia

Pojęcia się pokrywają, a zakłady w USA używają ich zamiennie:

- **SMED (single-minute exchange of die):** nazwa Shingo dla metody i jej celu, jednocyfrowych minut [1][6].
- **Quick changeover (QCO):** powszechny w amerykańskich zakładach termin dla tej samej praktyki, używany m.in. przez centra NIST MEP [18].
- **Setup reduction / setup time reduction:** ogólne określenie obejmujące SMED oraz zmiany inżynieryjne w urządzeniach.
- **OTED (one-touch exchange of die):** surowszy cel, przezbrojenie poniżej 100 sekund [5].
- **Redukcja czasu przezbrojenia:** rezultat. SMED jest najszerzej stosowaną metodą jego osiągania, ale nie jedyną dźwignią; wkład mają także konstrukcja produktu, konstrukcja urządzeń i planowanie [13][15].

### Główna idea w jednym zdaniu

Nie zatrzymuj maszyny na nic, co można zrobić, gdy ona pracuje, a to, co musi się wydarzyć podczas postoju, uczyń tak prostym, by nie wymagało szukania, regulowania ani próbnych części.

W praktyce podejście SMED oddziela zadania przezbrojeniowe wymagające zatrzymania maszyny od tych, które można wykonać, gdy maszyna wciąż pracuje, przenosi jak najwięcej pracy do tej drugiej grupy, a następnie skraca to, co pozostało. Czyni to SMED metodą ciągłego doskonalenia procesu przezbrojenia i jednym ze standardowych narzędzi lean manufacturing.

### Korzyści z SMED

Wiele stron internetowych podaje korzyści z procentami, których rzadko towarzyszy źródło. Poniższe korzyści to mechanizmy; wielkość każdej z nich zależy od punktu wyjścia.

1. **Zdolności produkcyjne:** każda minuta usunięta z przezbrojenia wewnętrznego zwraca minutę czasu pracy maszyny. Przy wąskim gardle jest to produkcja, którą zyskuje cały zakład.
2. **Mniejsze partie i mniejsze zapasy:** gdy przezbrojenie jest tanie, można częściej wytwarzać każdy produkt w mniejszych ilościach. LEI zauważa, że EPEx maszyny (every product every interval) zależy bezpośrednio od czasów jej przezbrojeń [3].
3. **Krótsze terminy realizacji i lepsza dotrzymywalność dostaw:** mniej produkcji w toku oznacza krótsze kolejki; małe partie pozwalają reagować na zmiany popytu w ciągu dni zamiast tygodni.
4. **Jakość:** standaryzowane przezbrojenia ze stałymi nastawami ograniczają metodę prób i błędów, braki rozruchowe i awarie pierwszej sztuki. Mniej części wytwarzanych w jednej partii oznacza też mniej części zagrożonych, gdy wykryta zostanie wada.
5. **Bezpieczeństwo i ergonomia:** dobrze zaprojektowane przezbrojenie eliminuje niewygodne podnoszenie, sięganie do wnętrza matryc i pośpiech, pod warunkiem że bezpieczeństwo zostało zaprojektowane w procesie, a nie pominięte (zob. sekcja o bezpieczeństwie).

## Dlaczego czas przezbrojenia ma znaczenie: wielkość partii, zapasy, elastyczność i OEE

Długie przezbrojenia wpychają zakłady w przewidywalną pułapkę. Jeśli przezbrojenie trwa dwie godziny, nikt nie chce go wykonywać często, więc zakład produkuje duże partie. Duże partie generują zapasy, długie czasy realizacji i potrzebę prognozowania popytu klientów z większym wyprzedzeniem. Prognozy są tym częściej błędne, im dalej sięgają, więc zakład buduje jeszcze większe zapasy bezpieczeństwa. Przezbrojenie staje się ukrytą przyczyną połowy zapasów w hali.

### Pułapka wielkości partii w liczbach

**Przykład obliczeniowy (poglądowy):** Prasa tłoczarska pracuje 16 godzin dziennie (960 minut). Każde przezbrojenie trwa 90 minut. Prasa wytwarza 8 numerów części.

- Jeśli prasa przezbraja się dwa razy dziennie, traci 180 minut, czyli 18,8 procent swojego czasu (180 / 960). Wytworzenie wszystkich 8 numerów części zajmuje wtedy 4 dni, więc każda część jest wytwarzana średnio co 4 dni, a zakład musi utrzymywać około 4 dni zapasu dla każdej części, plus zapas bezpieczeństwa.
- Aby wytwarzać każdą część każdego dnia, prasa musiałaby wykonywać 8 przezbrojeń dziennie: 8 × 90 = 720 minut, czyli 75 procent jej czasu. Nie jest to możliwe, jeśli części wymagają więcej niż 240 minut czasu pracy.
- Skrócenie przezbrojenia do 15 minut sprawia, że 8 przezbrojeń kosztuje 120 minut, czyli 12,5 procent dnia. Każdą część można wtedy wytwarzać codziennie, a zapas cyklowy spada z około 4 dni do około 1 dnia.

To właśnie dlatego Toyota inwestowała w skracanie przezbrojeń na długo przed tym, zanim stało się to modne: bez szybkich przezbrojeń produkcja just-in-time w małych partiach nie działa.

### Czas przezbrojenia w OEE

Ogólna efektywność wyposażenia (OEE) mnoży dostępność, wydajność i jakość [4]. LEI zalicza regulacje do sześciu głównych strat, na które celuje OEE [4]; w większości schematów OEE zaplanowane przezbrojenia są ujmowane jako strata dostępności, a scrap po uruchomieniu po przezbrojeniu jako strata jakości. Ma to dwie konsekwencje:

- Skrócenie przezbrojenia przekłada się na dostępność w OEE tylko wtedy, gdy zaoszczędzony czas zostanie przeznaczony na produkcję. Jeśli zakład po prostu pracuje mniej godzin, dostępność w OEE się nie zmienia.
- Jeśli zakład wykorzysta zaoszczędzony czas na częstsze przezbrojenia (aby zmniejszyć wielkość partii), dostępność w OEE może pozostać na tym samym poziomie, a nawet spaść, podczas gdy zapasy i czas realizacji się poprawiają. To dobry wynik. Oceniaj SMED według wybranego celu, a nie wyłącznie według OEE.

Szczegółowe definicje OEE omówiono w przewodniku [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/), a stronę utrzymania ruchu OEE w przewodniku o [TPM i OEE](https://www.m365.fm/en/learn/tpm-oee/).

### Trzy sposoby wykorzystania zyskanego czasu

| Opcja | Kiedy pasuje | Co mierzymy |
|---|---|---|
| **Większa zdolność produkcyjna** (ta sama liczba przezbrojeń) | Maszyna jest wąskim gardłem, popyt przekracza zdolność | Wydajność tygodniowa, godziny nadliczbowe, dostępność OEE |
| **Mniejsze partie** (więcej przezbrojeń, ten sam łączny czas przezbrojeń) | Maszyna ma wolne moce, wysokie zapasy, długie czasy realizacji, wiele wariantów | EPEI, wielkość partii, dni zapasu, czas realizacji |
| **Mieszany** (część zdolności, część mniejszych partii) | Większość rzeczywistych zakładów | Oba zestawy wskaźników, z jawnym podziałem uzgodnionym z planowaniem |

Najczęstszym powodem, dla którego projekty SMED rozczarowują, jest to, że nikt nie podjął tej decyzji. Przezbrojenie staje się szybsze, planowanie zachowuje dotychczasowe wielkości partii, a zaoszczędzony czas znika w dłuższych okresach bezczynności. Wrócimy do tego w sekcji o błędach.

## Historia: od Taylora i Forda do Shingo i Toyoty

Redukcja czasu przezbrojenia jest starsza niż sama nazwa. Frederick Winslow Taylor analizował nie wnoszące wartości dodanej elementy przezbrojeń w *Shop Management* (1911), Frank Gilbreth opisał skracanie czasu przezbrojenia w *Motion Study* (1911), a fabryki Henry'ego Forda udokumentowały redukcję przezbrojeń w *Ford Methods and Ford Shops* (1915) [5]. Żaden z nich nie zamienił tego w uporządkowaną, powszechnie stosowaną metodę [5]. Przez większą część XX wieku standardową odpowiedzią na długie przezbrojenia była matematyka: ekonomiczna wielkość zamówienia, która traktuje koszt przezbrojenia jako dane wejściowe i wylicza „właściwą” dużą partię [5].

### Toyota i szybka wymiana matryc

W Toyocie przezbrojenia narzędzi według doniesień trwały w pierwszych latach powojennych od dwóch do ośmiu godzin; artykuł w Wikipedii oznacza tę liczbę jako wymagającą cytowania [5]. Taiichi Ohno objął kierownictwo warsztatów maszynowych Toyoty w 1945 roku, a w 1955 roku obserwował prasy tłoczące Danly w Stanach Zjednoczonych; Toyota później kupiła kilka z nich dla zakładu Motomachi [5]. Wewnętrzny program Toyoty „szybkiej wymiany matryc” wykorzystywał pytania ECRS (eliminuj, łącz, zmieniaj kolejność, upraszczaj), które pochodzą z amerykańskiego programu Training Within Industry z czasów II wojny światowej [5][33]. Według tego samego źródła czasy przezbrojeń Toyoty spadły z godzin do 15 minut w latach 60. i do 3 minut w latach 70. [5].

### Shigeo Shingo

Shigeo Shingo (1909–1990) był inżynierem przemysłowym i konsultantem w Japan Management Association od 1945 roku [6]. Doświadczenia z usprawnień zdobywał w Toyo Kogyo (dzisiejsze Mazda) w 1950 roku oraz w Mitsubishi Heavy Industries w Hiroszimie w 1957 roku, a od 1969 roku pracował w Toyocie nad skróceniem czasu wymiany matryc na prasach, gdzie wymiany trwające od jednej do dwóch godzin, czasem pół dnia, spadły do kilku minut [6]. LEI umieszcza jego kluczowe spostrzeżenia, czyli rozdzielenie przezbrojenia wewnętrznego i zewnętrznego oraz zamianę pracy wewnętrznej na zewnętrzną, w latach 50. i 60. [1].

Shingo opublikował tę metodę po angielsku w 1985 roku jako *A Revolution in Manufacturing: The SMED System* (Productivity Press) [6][7]. Książka podaje, że w jego przypadkach z lat 1975–1985 czasy przezbrojeń spadły średnio do około 2,5 procent pierwotnej wartości, czyli czterdziestokrotnie [5]. Traktuj tę liczbę jako podsumowanie przypadków konsultingowych samego Shingo, a nie jako niezależny punkt odniesienia.

W 1988 roku wydział biznesu Utah State University ustanowił na jego cześć Shingo Prize; obecnie nagrodę prowadzi Shingo Institute w Jon M. Huntsman School of Business [6][30].

### SMED w USA

Amerykańscy producenci zetknęli się ze SMED dzięki tłumaczeniom książek Shingo w latach 80., rozpowszechnieniu just-in-time i sukcesom japońskich producentów samochodów. Dziś jest to standardowy moduł szkoleń lean, obejmujący także oferty szybkiego przezbrajania ośrodków NIST Manufacturing Extension Partnership (MEP) [18][31]. Szerszy kontekst lean omawia przewodnik [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

## Jak poprawnie mierzyć czas przezbrojenia

Większość danych o przezbrojeniach w zakładach jest błędna, i nie dlatego, że ludzie kłamią. Są błędne, bo nikt nie uzgodnił, gdzie przezbrojenie się zaczyna, a gdzie kończy. System ERP często zalicza jako „przygotowanie” czas między dwoma potwierdzeniami zleceń; operatorzy często zapisują czas, w którym „maszyna stała rozebrana”; inżynierowie często mierzą tylko wymianę narzędzia. Wszystkie te czasy są krótsze niż rzeczywista strata.

### Definicja: od ostatniej dobrej sztuki do pierwszej dobrej sztuki

Używaj granicy LEI: od ostatniej dobrej jednostki starego przebiegu do pierwszej dobrej jednostki nowego przebiegu [2]. Dwa uszczegółowienia czynią tę definicję szczelną:

1. **Przy normalnej prędkości.** Nowy przebieg uznaje się za uruchomiony dopiero wtedy, gdy produkuje dobre sztuki z prędkością standardową. Leanproduction.com definiuje koniec jako pierwszą dobrą sztukę przy pełnej prędkości [19]. Jeśli linia po ruszeniu pracuje przez 20 minut z połową prędkości, te 20 minut są częścią straty przezbrojenia.
2. **Wliczając wytracanie prędkości.** Jeśli stary przebieg zwalnia przed zatrzymaniem (na przykład linia jest opróżniana i pracuje częściowo), też to wlicz. Niektóre zakłady nazywają to „3 Ups”: czyszczenie, ustawianie i uruchamianie [24].

### Trzy fazy przezbrojenia

| Faza | Co się dzieje | Typowe ukryte straty |
|---|---|---|
| **Wytracanie / czyszczenie** | Ostatnie sztuki starego zlecenia, opróżnianie linii, usuwanie materiału, czyszczenie | Linia pracuje ze zmniejszoną prędkością; operatorzy odchodzą po następne zadanie |
| **Ustawianie (wymiana)** | Demontaż i montaż narzędzi, matryc, części formatowych; zmiana nastaw | Szukanie, czekanie na suwnicę lub wózek widłowy, brakujące części, śruby |
| **Rozruch / uruchamianie** | Pierwsze sztuki, pomiary, regulacja, zatwierdzenie, dochodzenie do pełnej prędkości | Regulacje metodą prób i błędów, czekanie na zatwierdzenie jakości, złom |

Podział czasu konwencjonalnego ustawiania według Shingo, przytoczony na Wikipedii, przypisuje około 30 procent przygotowaniu i sprawdzeniu materiałów oraz narzędzi; około 5 procent montażowi i demontażowi; około 15 procent centrowaniu, wymiarowaniu i ustawieniu warunków; oraz około 50 procent próbnym przebiegom i regulacjom [5]. Otwarty podręcznik inżynierski o produkcji szczupłej przedstawia podobny obraz dla tłoczenia metali, z około 20 do 50 procentami czasu ustawiania zajętymi regulacją [36]. Praktyczna lekcja: sama wymiana jest małą częścią. Duże części to przygotowanie i faza rozruchu.

### Wzory na przezbrojenie

**Czas przezbrojenia (na zdarzenie):**
Czas przezbrojenia = czas pierwszej dobrej sztuki przy prędkości standardowej − czas ostatniej dobrej sztuki poprzedniego przebiegu

**Średni czas przezbrojenia:**
Średni czas przezbrojenia = suma wszystkich czasów przezbrojeń / liczba przezbrojeń

**Udział przezbrojeń w czasie dostępnym:**
Udział przezbrojeń = łączny czas przezbrojeń / planowany czas produkcji × 100%

**Wskaźnik wewnętrzny:**
Wskaźnik wewnętrzny = wewnętrzny czas ustawiania / całkowity zakres pracy ustawiania × 100%

**Koszt jednego przezbrojenia (uproszczony model):**
Koszt przezbrojenia = utracona marża przyczynkowa (tylko jeśli maszyna jest wąskim gardłem lub produkcja jest wyprzedana) + koszt robocizny ekipy przezbrajającej + złom z rozruchu + materiały eksploatacyjne

MachineMetrics, dostawca rozwiązań do monitorowania maszyn, stosuje porównywalny podział: utracony koszt robocizny = godziny przestoju × liczba pracowników × koszt robocizny za godzinę, a utracona wartość produktu = cena jednostkowa × standardowe tempo × godziny przestoju [21]. Ostrożnie z drugim członem: liczy się jako rzeczywista strata tylko wtedy, gdy utracona produkcja mogłaby zostać sprzedana. Na maszynie z wolnymi mocami produkcyjnymi koszt przezbrojenia to głównie robocizna i złom, a korzyść z SMED tkwi w mniejszych partiach, a nie w odzyskanej produkcji.

**Przykład obliczeniowy (poglądowy):** Centrum obróbcze CNC pracuje w dwóch 8-godzinnych zmianach, 5 dni w tygodniu, z 60 minutami planowanych przerw dziennie: planowany czas produkcji = (16 − 1) × 60 × 5 = 4 500 minut tygodniowo. W zeszłym tygodniu było 9 przezbrojeń, które trwały 52, 68, 47, 95, 61, 58, 73, 49 i 87 minut.

- Suma = 590 minut; średnia = 590 / 9 = 65,6 minuty.
- Udział przezbrojeń = 590 / 4 500 = 13,1 procent.
- Rozrzut: najkrótsze 47, najdłuższe 95 minut, zakres 48 minut. Tak szeroki zakres zwykle oznacza brak standardu; długie przezbrojenia to te, w których brakowało narzędzi lub programów.
- Koszt: ekipa 1 ustawiacza po stawce obciążonej 48 USD za godzinę (poglądowo) = 590 / 60 × 48 USD = 472 USD tygodniowo w robociźnie. Jeśli maszyna jest wąskim gardłem z marżą przyczynkową 180 USD za godzinę, utracona marża wynosi 590 / 60 × 180 USD = 1 770 USD tygodniowo, czyli około 92 000 USD rocznie przy 52 tygodniach. To ta liczba uzasadnia projekt.

### Jak zbierać dane

1. **Najpierw wideo.** Nagraj jedną pełną zmianę ustawienia od ostatniej dobrej sztuki do pierwszej dobrej sztuki, z widocznym zegarem. Jedna kamera na maszynie, najlepiej druga, śledząca ustawiacza. Najpierw poproś zespół o zgodę i wyjaśnij cel: wideo dotyczy procesu, a nie ludzi. Centrum Michigan w ramach NIST MEP użyło wideo, diagramu spaghetti i wykresu analizy ustawiania w projekcie Brighton NC Machine [17].
2. **Diagram spaghetti.** Naniesz na plan zakładu trasę chodzenia ustawiacza. Zmiany ustawienia często obejmują setki lub tysiące stóp chodzenia; w przykładzie Brighton wynosiło to 9 121 stóp na zmianę przed usprawnieniem [17].
3. **Lista elementów.** Podziel wideo na elementy trwające od kilku sekund do kilku minut: „dojście do magazynu narzędzi, 3:20”, „odkręcenie 8 śrub mocujących, 4:10”. Według leanproduction.com typowe ustawienie rozkłada się na około 30 do 50 elementów [19].
4. **Dwa tygodnie danych bazowych.** Zbierz czasy rozpoczęcia i zakończenia wszystkich zmian ustawienia przez co najmniej dwa tygodnie przed jakąkolwiek zmianą, aby znać średnią i rozrzut [19]. Vorne ostrzega, że zespoły zmieniają zachowanie, gdy wiedzą, że są obserwowane (efekt Hawthorne), więc pierwsza nagrana zmiana może przebiegać szybciej niż zwykle [20].

Szablon listy elementów znajduje się w [sekcji szablonów](#szablony-i-listy-kontrolne-smed).

## Metoda SMED w 8 krokach

Shingo opisał cztery etapy koncepcyjne, często nazywane etapami SMED: w etapie wstępnym ustawienie wewnętrzne i zewnętrzne są wymieszane; etap 1 je rozdziela; etap 2 zamienia wewnętrzne na zewnętrzne; etap 3 usprawnia wszystkie aspekty ustawienia [5]. Źródła praktyczne rozwijają to w siedem podstawowych kroków: obserwacja, rozdzielenie, konwersja, usprawnienie wewnętrzne, usprawnienie zewnętrzne, dokumentacja, powtórzenie [5]. Poniższe osiem kroków dodaje krok, który pomija większość przewodników: przygotowanie projektu, w tym bezpieczeństwo i decyzję, jak wykorzystany zostanie zaoszczędzony czas.

| Krok | Etap Shingo | Wynik |
|---|---|---|
| 0. Przygotowanie: wybór maszyny, zespołu, celu i sposobu wykorzystania zaoszczędzonego czasu | (wstępny) | Karta projektu, dane bazowe, przegląd bezpieczeństwa |
| 1. Zapis obecnego ustawienia | etap wstępny | Wideo, lista elementów z czasami, diagram spaghetti |
| 2. Rozdzielenie elementów wewnętrznych i zewnętrznych | etap 1 | Każdy element oznaczony I lub E; lista kontrolna i plan przygotowania |
| 3. Zamiana wewnętrznych na zewnętrzne | etap 2 | Lista działań: przygotowanie, standaryzacja funkcji, pośrednie przyrządy |
| 4. Usprawnienie elementów wewnętrznych | etap 3 | Szybkie zaciski, wyeliminowane regulacje, prace równoległe |
| 5. Usprawnienie elementów zewnętrznych | etap 3 | Wózki, tablice narzędziowe, magazynowanie w pobliżu maszyny |
| 6. Standaryzacja i szkolenie | (kontynuacja) | Standardowy arkusz ustawienia, zapisy szkoleń |
| 7. Utrzymanie i powtarzanie | (kontynuacja) | KPI na tablicy, audyty, kolejny cykl |

### Krok 0: Przygotowanie projektu

**Wybierz maszynę pilotażową.** Dobre piloty mają ustawienie trwające mniej więcej 30 do 90 minut, wykonywane kilka razy w tygodniu, z chętnym zespołem i widocznym problemem biznesowym (wąskie gardło, wysokie zapasy, opóźnione zamówienia). Vorne sugeruje pilotażowe ustawienie trwające 30 do 60 minut [20]; leanproduction.com zaleca SMED, gdy ustawienia stanowią co najmniej 20 procent utraconego czasu produktywnego, a w przeciwnym razie najpierw TPM [19]. Obie są regułami kciuka dostawców, a nie normami, ale wskazują właściwy kierunek: nie zaczynaj od 12-godzinnego ustawienia ani 5-minutowego.

**Utwórz zespół.** Operator(zy) i ustawiacz(e), którzy wykonują ustawienie codziennie, technik utrzymania ruchu, inżynier produkcji, technik jakości odpowiedzialny za zatwierdzenie pierwszej sztuki oraz przedstawiciel ds. bezpieczeństwa. Sponsorem zespołu jest przełożony. Wielkość od czterech do siedmiu osób jest wykonalna.

**Uzgodnij cel i sposób wykorzystania zaoszczędzonego czasu.** Zapisz dane bazowe (średnia i zakres), cel (np. 50-procentowe skrócenie w pierwszym cyklu, jak sugeruje Vorne [20]) oraz to, co planowanie zrobi z czasem: zdolność produkcyjną, mniejsze partie lub podział.

**Przegląd bezpieczeństwa.** Wypisz źródła energii (elektryczna, hydrauliczna, pneumatyczna, grawitacyjna, termiczna) oraz obowiązującą procedurę kontroli energii. Przed warsztatem ustal, które kroki podlegają blokadzie i oznakowaniu (lockout/tagout). Nigdy nie akceptuj pomysłów „szybszych”, które pomijają odizolowanie energii (zob. sekcja o bezpieczeństwie).

### Krok 1: Zarejestruj obecną wymianę

Nagraj ją na wideo, zbuduj listę elementów i narysuj diagram spaghetti. Zapisz elementy w kolejności, w jakiej się odbywały, z godziną rozpoczęcia, czasem trwania i wskazaniem, kto je wykonał. Od razu oznacz oczywiste marnotrawstwo: szukanie, chodzenie, czekanie na suwnicę, próbne przebiegi.

Pytania do zadania przy każdym elemencie (sprawdzają się też klasyczne pytania w stylu „pięciu dlaczego”):

- Dlaczego to w ogóle się robi? (Czy można to wyeliminować?)
- Dlaczego właśnie teraz, gdy maszyna stoi? (Czy może być wykonane zewnętrznie?)
- Dlaczego w ten sposób? (Czy można to zrobić prościej?)
- Dlaczego wykonuje to ta osoba? (Czy dwie osoby mogą pracować równolegle lub czy może to zrobić operator?)

### Krok 2: Oddziel elementy wewnętrzne od zewnętrznych

Oznacz każdy element jako I (wymaga zatrzymanej maszyny) lub E (może być wykonany, gdy maszyna pracuje). Na tym etapie nie zmieniaj jeszcze metody; po prostu przestań wykonywać podczas postoju pracę zewnętrzną. Ten krok ma przede wszystkim charakter organizacyjny:

- **Lista kontrolna przed wymianą:** wszystko, czego potrzebuje następne zlecenie (matryca, narzędzia, oprzyrządowanie, wkładki, materiał, program, rysunek, przyrządy pomiarowe, opakowanie), jest spisane i sprawdzone przed zatrzymaniem maszyny.
- **Kontrola funkcjonalna:** nowa matryca jest sprawdzana pod kątem uszkodzeń i kompletności przed montażem, a nie po pierwszej wadliwej części.
- **Transport:** nowa matryca jest ustawiona przy maszynie przed postojem; stara matryca wraca do magazynu po ponownym uruchomieniu.

Leanproduction.com zwraca uwagę, że przeniesienie elementów do kategorii zewnętrznych może skrócić czas wymiany niemal o połowę [19]. Jest to zgodne z doświadczeniem praktyków, ale zależy w pełni od tego, ile szukania i pobierania odbywa się obecnie.

### Krok 3: Zamień wewnętrzne na zewnętrzne

Teraz ponownie przyjrzyj się każdemu pozostałemu elementowi I i zapytaj, co musiałoby się zmienić, aby stał się zewnętrzny. Shingo opisuje tu techniki przygotowania warunków pracy z wyprzedzeniem, standaryzacji funkcji i stosowania przyrządów pośrednich [5]:

- **Podgrzewaj** formy i matryce poza maszyną, aby pierwsze wypraski nie musiały doprowadzać ich do temperatury.
- **Ustawiaj wstępnie** narzędzia w przyrządzie do presetowania lub na drugim oprzyrządowaniu, podczas gdy maszyna pracuje.
- **Standaryzuj** wymiary istotne dla maszyny (wysokość mocowania, pozycje bazowania, punkty przyłączy), tak aby nowa matryca nie wymagała regulacji.
- **Przyrządy pośrednie**: zamontuj następny przedmiot obrabiany lub matrycę na standardowej palecie lub podpłycie poza maszyną, a następnie wymień całą paletę.

### Krok 4: Usprawnij elementy wewnętrzne

To, co pozostaje wewnętrzne, ma zostać wykonane szybko i prosto:

- **Zaciski funkcjonalne** zamiast śrub: szybkozłączki ćwierćobrotowe, zaciski mimośrodowe, rowki w kształcie litery U, dzięki którym śruba wymaga tylko półobrotu, mocowanie hydrauliczne lub magnetyczne.
- **Eliminuj regulacje:** stałeograniczniki, kołki bazujące, skale i znaczniki, ustawienia zapisane jako receptury. Regulacja to największa pojedyncza kategoria czasu przezbrojenia w zestawieniu Shingo [5].
- **Operacje równoległe:** dwie osoby po przeciwnych stronach maszyny, każda z określoną sekwencją, mogą skrócić czas rzeczywisty ponad o połowę, eliminując chodzenie wokół maszyny. Potrzebują one jasnego systemu sygnalizacji, a w ramach blokady i oznakowania (lockout/tagout) każda osoba zakłada własną kłódkę.
- **Jedno narzędzie, jeden rozmiar:** standaryzuj rozmiary śrub, aby jedno narzędzie pasowało wszędzie.

### Krok 5: Usprawnij elementy zewnętrzne

Praca zewnętrzna nie zatrzymuje maszyny, ale angażuje ludzi i może opóźnić rozpoczęcie wymiany. Usprawnij ją dzięki wózkom do wymiany uporządkowanym według sekwencji, tablicom cieniowym, przechowywaniu matryc i narzędzi w miejscu użycia zgodnie z [5S](https://www.m365.fm/en/learn/5s-visual-management/) oraz wyraźnym sygnałom wizualnym („następne zlecenie gotowe”).

### Krok 6: Standaryzuj i szkol

Spisz nową metodę jako standardowy arkusz wymiany: sekwencję elementów, kto co robi, kluczowe punkty (bezpieczeństwo, jakość), czasy i potrzebne narzędzia. LEI opisuje [standaryzowaną pracę](https://www.m365.fm/entity/standard-work/) jako ustalanie precyzyjnych procedur dla pracy każdego operatora [26]. Szkol wszystkich, którzy wykonują wymianę, a nie tylko zespół pilotażowy; metoda TWI Job Instruction, która rozbija zadanie na ważne kroki i kluczowe punkty, to praktyczny format [33]. Zestaw materiałów o [standardowej pracy](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) opisuje ten format szczegółowo.

### Krok 7: Utrzymanie i powtarzanie

Umieść czas przezbrojenia na tablicy przy linii produkcyjnej, codziennie przeglądaj odchylenia i regularnie audytuj standard. SMED to ciągła pętla doskonalenia, a nie jednorazowe wydarzenie. Uruchom kolejny cykl: podsumowanie praktyki SMED w Wikipedii mówi, że do osiągnięcia poniżej dziesięciu minut może być potrzebnych kilka iteracji [5]. Drugi cykl zazwyczaj obejmuje elementy zależne od sprzętu, które pierwszy cykl odłożył na później.

## Osiem technik Shingo z przykładami

Shingo podsumował swoje podejście w ośmiu technikach [5]. Tabela przedstawia każdą z nich prostym wyjaśnieniem oraz przykładami z różnych branż.

| # | Technika | Co oznacza | Przykłady |
|---|---|---|---|
| 1 | Oddziel przezbrojenie wewnętrzne od zewnętrznego | Nie zatrzymuj maszyny na czynności, którą można wykonać podczas jej pracy | Lista kontrolna, przygotowanie matrycy i materiału przed zatrzymaniem |
| 2 | Przekształć przezbrojenie wewnętrzne w zewnętrzne | Zmień metodę tak, aby czynności przeniosły się poza postój | Podgrzewanie form, wstępne ustawianie narzędzi, wstępny montaż części formatowych |
| 3 | Standaryzuj funkcję, a nie kształt | Standaryzuj tylko te cechy, z którymi maszyna się styka, a nie całe narzędzie | Ta sama wysokość mocowania i ta sama krawędź dla każdej matrycy dzięki klockom dystansowym; to samo sprzęgło w każdej formie |
| 4 | Stosuj funkcjonalne zaciski lub eliminuj łączniki | Mocuj jednym ruchem albo wcale | Śruby ćwierćobrotowe, dźwignie krzywkowe, otwory gruszkowe, zaciski hydrauliczne, płyty magnetyczne |
| 5 | Stosuj przyrządy pośrednie | Przygotuj na standardowym nośniku poza maszyną i wymieniaj nośnik | Palety z zerowym punktem mocowania na centrach obróbczych, podpłyty do matryc prasowych |
| 6 | Wprowadź operacje równoległe | Więcej niż jedna osoba pracuje jednocześnie według określonej sekwencji | Dwóch ustawiaczy po obu stronach prasy, operator przygotowuje materiał, gdy ustawiacz wymienia matrycę |
| 7 | Eliminuj regulacje | Zastąp metodę prób i błędów stałymi pozycjami i zapisanymi nastawami | Kołki ustalające, ograniczniki, skale, pobieranie receptur, wskaźniki cyfrowe |
| 8 | Mechanizacja | Stosuj wspomaganie napędowe tam, gdzie naprawdę pomaga, dopiero po pozostałych siedmiu | Wózki do matryc z rolkami, podnośniki matryc, zmotoryzowane osie regulacji |

Dwie uwagi do tej listy. Po pierwsze, mechanizacja jest celowo na ostatnim miejscu. Sprzęt kupiony przed krokami organizacyjnymi często automatyzuje marnotrawstwo. Po drugie, „standaryzuj funkcję, a nie kształt” jest najmniej wykorzystywaną techniką. Zakład nie musi przebudowywać 200 matryc; często wystarcza zestaw klocków dystansowych lub płytek adapterowych, które doprowadzają wszystkie matryce do tej samej wysokości mocowania i tej samej krawędzi ustalającej.

## Techniki przezbrajania według typu urządzenia

Zasady są wszędzie takie same, ale główne dźwignie różnią się w zależności od procesu. Poniższe tabele to lista kontrolna oparta na praktyce, a nie wzorcowy benchmark poparty źródłami.

### Prasy tłoczące

| Dźwignia | Przykład |
|---|---|
| Standardowa wysokość matrycy i ustalanie | Podkładki równoległe lub bloki dystansowe doprowadzają wszystkie matryce do tej samej wysokości zamknięcia; kołki ustalające lub zderzak tylny centrują matrycę |
| Transport matryc | Wózki na matryce lub przetaczane stoły (bolstery) ustawione przy prasie; tory rolkowe lub kulkowe na stole |
| Mocowanie | Hydrauliczne lub szybkodziałające mechaniczne zaciski; rowki U i jeden rozmiar śrub, jeśli śruby pozostają |
| Nastawy | Wysokość zamknięcia, ciśnienie przeciwwagi i nastawy posuwu zapisane dla każdej matrycy; oznaczone skale |
| Bezpieczeństwo | Bloki zabezpieczające zawsze, gdy matryca jest regulowana lub naprawiana w prasie, zgodnie z wymogiem OSHA [10]; procedura ustawiania matrycy zgodnie z 29 CFR 1910.217(d)(9) |

### Wtryskarki

| Dźwignia | Przykład |
|---|---|
| Podgrzewanie | Forma podgrzewana na osobnym regulatorze temperatury przed wymianą |
| Przyłącza | Wielopołączenia dla wody i gorącego kanału, oznaczone kolorami |
| Materiał | Następny materiał wysuszony i gotowy; związek czyszczący i procedura płukania ustandaryzowane |
| Mocowanie | Systemy szybkiej wymiany formy (magnetyczne lub hydrauliczne płyty), ustandaryzowana grubość płyt formy |
| Nastawy | Parametry procesu pobierane z receptury zamiast dostrajane z pamięci |

### Obróbka CNC

| Dźwignia | Przykład |
|---|---|
| Wstępne ustawianie narzędzi | Narzędzia mierzone offline w przyrządzie do ustawiania, korekcje przenoszone do sterowania |
| Mocowanie przedmiotu | Mocowanie w punkcie zerowym, ustandaryzowane palety, dedykowane przyrządy przechowywane przy maszynie |
| Programy | Sprawdzone programy zwalniane i ładowane z wyprzedzeniem; brak edycji przy maszynie |
| Pierwsza sztuka | Pomiar sondą w maszynie zastępuje ręczny pomiar przy ustawianiu przesunięć punktu zerowego |
| Rodziny narzędzi | Standardowa biblioteka narzędzi, tak aby większość zleceń wymagała niewielu zmian narzędzi |

### Linie pakujące i napełniające

| Dźwignia | Przykład |
|---|---|
| Części formatowe | Oznaczone kolorami części formatowe dla każdego rozmiaru produktu, przechowywane na wózku w kolejności przezbrajania |
| Regulacje | Stałe ograniczniki i ponumerowane skale zamiast swobodnej regulacji; osie serwo z zapisanymi pozycjami |
| Czyszczenie | Ustandaryzowana sekwencja czyszczenia; najpierw czyszczenie na sucho; równoległe czyszczenie zdjętych części |
| Etykiety i materiały | Lista kontrolna oczyszczenia linii; przygotowanie etykiet, kartonów i nakrętek przed zatrzymaniem |
| Rozruch | Określone kontrole pierwszej sztuki; procedura narastania prędkości |

### Przezbrajania zdominowane przez czyszczenie i regulowane (żywność, farmacja, chemia)

W zakładach spożywczych, napojowych, farmaceutycznych i chemicznych sama „wymiana” jest często niewielka, a czyszczenie i weryfikacja są duże. Myślenie SMED nadal ma zastosowanie: przygotować wcześniej środki czyszczące, narzędzia i dokumenty; czyścić wymienne części offline, podczas gdy maszyna jest składana z drugim zestawem; sekwencjonować produkty tak, aby zminimalizować pełne czyszczenia (od jasnych do ciemnych, najpierw wolne od alergenów, potem zawierające alergeny). Różnica polega na tym, że niektóre kroki są nakazane i nie można ich skrócić przez pominięcie:

- Producenci leków w USA muszą sprawdzić zakłady pakowania i etykietowania bezpośrednio przed użyciem, aby upewnić się, że wszystkie produkty lecznicze oraz nieodpowiednie materiały opakowaniowe i etykiety z poprzednich operacji zostały usunięte, i udokumentować wyniki w dokumentacji produkcji partii (21 CFR 211.130(e)) [11].
- Zakłady spożywcze w USA objęte przepisem o kontrolach zapobiegawczych muszą mieć kontrolę alergenów obejmującą procedury chroniące żywność przed krzyżowym zanieczyszczeniem alergenami podczas przechowywania, obsługi i użytkowania (21 CFR 117.135(c)(2)) [37].

Tutaj SMED skraca pracę wokół nakazanych kroków oraz sprawia, że te kroki są szybsze i bardziej niezawodne, na przykład dzięki liście kontrolnej oczyszczenia linii i stałej sekwencji. Nigdy ich nie eliminuje.

### Linie montażowe i gniazda

Przezbrajania w montażu dotyczą głównie materiału i informacji: innych zestawów komponentów, innych instrukcji roboczych, innych przyrządów na kilku stanowiskach. Dźwignie to kompletowanie (kitting) następnego wariantu przed przezbrojeniem, przyrządy obejmujące kilka wariantów, cyfrowe instrukcje robocze przełączane wraz ze zleceniem oraz przezbrajania „kroczące”, w których każde stanowisko przełącza się, gdy dotrze pierwsza sztuka nowego wariantu, dzięki czemu linia jako całość nigdy się nie zatrzymuje.

## Przykład SMED: kompletny projekt na wtryskarce

Poniższy przykład jest ilustracyjny. Liczby są realistyczne dla średniej wielkości zakładu formowania wtryskowego, ale nie opisują rzeczywistej fabryki. Pokazują, jak poszczególne kroki się łączą i jak obliczyć efekt.

**Sytuacja.** Wtryskarka 300-tonowa obsługuje 6 form do rodziny obudów. Pracuje na 3 zmiany po 8 godzin, z 30 minutami przerw na zmianę, 5 dni w tygodniu: planowany czas produkcji = 3 × 7,5 × 60 × 5 = 6 750 minut tygodniowo. Zmienia formy 5 razy w tygodniu. Wartość wyjściowa z dwóch tygodni: średni czas przezbrojenia 96 minut, zakres od 78 do 131 minut. Maszyna nie jest wąskim gardłem; problemem jest 11 dni zapasu wyrobów gotowych i częste zlecenia pilne.

**Cel uzgodniony z planowaniem.** Skrócić średni czas przezbrojenia o co najmniej 50 procent w pierwszym cyklu i wykorzystać zyskany czas na więcej przezbrojeń, tak aby każda forma pracowała co najmniej co 3 dni zamiast co 6.

### Krok 1: lista elementów (przed)

| # | Element | Czas (min) | W/Z dziś | Mogłoby być |
|---|---|---|---|---|
| 1 | Ostatnie cykle, opróżnienie leja, zatrzymanie maszyny | 6 | W | W (częściowo Z: opróżnienie leja przed końcem serii) |
| 2 | Przejście do magazynu form, znalezienie następnej formy, pobranie suwnicy | 14 | W | Z |
| 3 | Odłączenie przewodów wody i gorącego kanału (12 pojedynczych złączek) | 8 | W | W, usprawnić |
| 4 | Odblokowanie formy (8 śrub), wyjęcie | 9 | W | W, usprawnić |
| 5 | Wstawienie nowej formy, ustawienie na oko, zamocowanie (8 śrub) | 13 | W | W, usprawnić |
| 6 | Podłączenie przewodów wody i gorącego kanału, szukanie właściwego węża do każdego przyłącza | 10 | W | W, usprawnić |
| 7 | Szukanie materiału, suszenie | 7 | W | Z |
| 8 | Nagrzewanie formy do temperatury | 12 | W | Z (podgrzewanie wstępne) |
| 9 | Ustawienie parametrów wg karty przezbrojenia, korekty | 9 | W | W, wyeliminować korekty |
| 10 | Próbne cykle, korekty, oczekiwanie na zatwierdzenie jakości | 8 | W | W, usprawnić |
| **Razem czas wewnętrzny (rzeczywisty)** | | **96** | | |

Dwa kandydaty zewnętrzne (elementy 2 i 7) oraz podgrzewanie (element 8) sumują się do 33 minut postoju maszyny, który nie wymaga zatrzymanej maszyny.

### Kroki 2 i 3: oddzielenie i przekształcenie

- Elementy 2 i 7 stają się zewnętrzne dzięki liście kontrolnej przed przezbrojeniem, uruchamianej 45 minut przed planowanym końcem serii: forma, miejsce na suwnicę, materiał (wysuszony), węże, dokumenty, wzorcowy przyrząd do pierwszej sztuki. Oszczędność: 21 minut.
- Element 8 staje się zewnętrzny dzięki stanowisku podgrzewania, na którym następna forma jest doprowadzana do temperatury, gdy poprzednia nadal pracuje. Oszczędność: około 10 minut (2 minuty pozostają na stabilizację w maszynie).
- Element 1: lej jest opróżniany w ostatnich minutach serii, a nie po zatrzymaniu maszyny. Oszczędność: 3 minuty.

Wynik po pierwszych dwóch krokach: 96 − 21 − 10 − 3 = **62 minuty**, osiągnięte głównie dzięki liście kontrolnej, podgrzewaczowi i dyscyplinie.

### Krok 4: usprawnienie czynności wewnętrznych

| # | Działanie | Przed (min) | Po (min) |
|---|---|---|---|
| 3 + 6 | Płyty z wielokrotnymi złączkami dla wody i gorącego kanału, oznaczone kolorami | 18 | 4 |
| 4 + 5 | Ujednolicony pierścień centrujący i gniazda mocujące, szybkomocujące zaciski; druga osoba do pracy równoległej | 22 | 9 |
| 9 | Parametry procesu zapisane dla każdej formy i ładowane ze sterownika | 9 | 2 |
| 10 | Kontrola pierwszej sztuki dedykowanym przyrządem przy maszynie, technik jakości wcześniej powiadomiony | 8 | 5 |
| 1 | Zakończenie serii z już opróżnionym lejem | 3 | 3 |
| 8 | Stabilizacja po podgrzewaniu | 2 | 2 |
| **Razem** | | **62** | **25** |

Czas rzeczywisty wynosi teraz 25 minut. Warto zauważyć, że praca równoległa dwóch osób skraca czas rzeczywisty, ale nie czas pracy: pracochłonność elementów 4 i 5 wynosi nadal około 18 minut-osobo.

### Krok 6: standaryzacja

Nowa sekwencja zostaje zapisana w standardowej karcie przezbrojenia z dwiema kolumnami (ustawiacz A, ustawiacz B), przeszkolono z niej wszystkie trzy zmiany i przez miesiąc kontrolowano co tydzień. Po czterech tygodniach średnia wynosi 27 minut, a zakres od 23 do 34 minut.

### Efekt

| Wskaźnik | Przed | Po |
|---|---|---|
| Średni czas przezbrojenia | 96 min | 27 min (−72%) |
| Zakres czasu przezbrojenia | 78–131 min | 23–34 min |
| Przezbrojenia w tygodniu | 5 | 10 |
| Łączny czas przezbrojeń w tygodniu | 480 min | 270 min |
| Udział przezbrojeń w czasie planowanym | 7,1% | 4,0% |
| Interwał, w którym pracuje każda forma (EPEI) | około 6 dni | około 3 dni |
| Zapas wyrobów gotowych (zapas cyklowy) | około 11 dni | około 6 dni (cel) |

Maszyna przestawia się teraz dwa razy częściej, a mimo to spędza o 210 minut tygodniowo mniej na przezbrojeniach. Zapas cyklowy spada w przybliżeniu proporcjonalnie do interwału. Nakład inwestycyjny: stanowisko podgrzewania, sześć zestawów szybkozłączek wielokrotnych, standaryzacja mocowań oraz dwa dni czasu zespołu. Uzasadnienie biznesowe tego rodzaju projektu jest obliczane w [sekcji o uzasadnieniu biznesowym](#uzasadnienie-biznesowe-koszty-roi-i-rachunkowość-zapasów).

## Od krótszych przezbrojeń do mniejszych partii: EPEI i wielkość partii

SMED tworzy potencjał; planowanie przekłada go na wyniki. Dwa narzędzia łączą czas przezbrojenia z wielkością partii i zapasem: EPEI oraz klasyczny wzór na wielkość partii.

### Co oznacza EPEI

EPEI to skrót od „every part every interval” (co każdą część w każdym interwale; słownik LEI używa obecnie terminu EPEx, „every product every interval”). Opisuje, jak często maszyna lub proces cyklicznie przechodzi przez wszystkie swoje numery części: jeśli maszynę przezbraja się tak, by produkowała każdy numer części co trzy dni, jej EPEx wynosi trzy dni [3]. LEI zauważa, że EPEx zależy od czasów przezbrojeń i liczby numerów części; długie przezbrojenia i wiele numerów części podnoszą go, dopóki czas przezbrojenia nie zostanie skrócony [3]. Krótszy EPEI oznacza mniejsze partie i mniejsze zapasy. W [mapowaniu strumienia wartości](https://www.m365.fm/en/learn/value-stream-mapping/) EPEI jest standardową pozycją w ramce danych procesu z przezbrojeniami [35].

### Jak obliczyć EPEI

Powszechnie stosowany w praktyce wzór (wyprowadzony z bilansu czasu procesu; nie jest to wzór LEI):

EPEI = łączny czas przezbrojeń na jeden pełny cykl przez wszystkie części / (dostępny czas dzienny − czas pracy potrzebny dziennie)

Idea: każdego dnia maszyna potrzebuje stałej ilości czasu pracy, by zaspokoić popyt. Pozostały czas może zostać przeznaczony na przezbrojenia. Im więcej czasu przezbrojeń wymaga pełny cykl przez wszystkie części, tym więcej dni trwa cykl.

**Przykład obliczeniowy (poglądowy):** Maszyna ma 900 minut dostępnego czasu dziennie. Produkuje 4 części o następującym dziennym popycie i czasach cyklu:

| Część | Dzienny popyt (sztuki) | Czas cyklu (min/szt.) | Dzienny czas pracy (min) | Czas przezbrojenia (min) |
|---|---|---|---|---|
| A | 400 | 0,8 | 320 | 40 |
| B | 300 | 0,8 | 240 | 40 |
| C | 150 | 1,0 | 150 | 60 |
| D | 50 | 1,2 | 60 | 60 |
| **Razem** | | | **770** | **200** |

- Czas pozostały na przezbrojenia dziennie: 900 − 770 = 130 minut.
- Jeden pełny cykl przez wszystkie cztery części wymaga 200 minut czasu przezbrojeń.
- EPEI = 200 / 130 = 1,54 dnia, w praktyce zaokrąglane w górę do **2 dni**: każda część jest wytwarzana co 2 dni.
- Wielkości partii przy EPEI 2 dni = 2 dni popytu: A 800, B 600, C 300, D 100 sztuk.

**Teraz zastosujmy SMED.** Przezbrojenia spadają do 15 minut dla A i B oraz 20 minut dla C i D: razem = 70 minut.

- EPEI = 70 / 130 = 0,54 dnia, zaokrąglone w górę do **1 dnia**: każda część co dzień.
- Wielkości partii są o połowę mniejsze: A 400, B 300, C 150, D 50 sztuk.
- Średni zapas cyklowy (około połowa partii, przy stałym popycie) spada z około 1 dnia popytu do około pół dnia.
- Czas rezerwowy: przy EPEI 1 dzień przezbrojenia wymagają 70 z 130 wolnych minut; 60 minut pozostaje jako bufor na awarie i szczyty popytu.

Dwie praktyczne uwagi. Po pierwsze, nigdy nie planuj bez czasu rezerwowego; rzeczywiste maszyny ulegają awariom, a EPEI wykorzystujący każdą wolną minutę załamuje się przy pierwszym gorszym dniu. Po drugie, EPEI może być inny dla części o dużym i małym obrocie: A i B co dzień, C i D co drugi dzień jest często lepszym kompromisem niż jednolity interwał. Tutaj SMED spotyka się z [heijunką](https://www.m365.fm/entity/heijunka/), czyli wyrównywaniem produkcji pod względem wolumenu i asortymentu [25].

### Wzór na wielkość partii i dlaczego koszt przezbrojenia ma znaczenie

Ekonomiczna wielkość zamówienia (EOQ), opracowana przez Forda W. Harrisa w 1913 roku [39] i przez dziesięciolecia standardowe podejście do wielkości partii [5], równoważy koszt przezbrojenia z kosztem utrzymania zapasu:

EOQ = √(2 × D × S / H)

gdzie D = roczny popyt, S = koszt jednego przezbrojenia (lub zamówienia), H = roczny koszt utrzymania jednostki zapasu. Dla produkcji o skończonej szybkości wytwarzania ekonomiczna wielkość produkcji (EPQ) dodaje współczynnik korygujący √(1 / (1 − d/p)), gdzie d to intensywność popytu, a p – szybkość produkcji. Szczegóły obu wzorów, łącznie z ich założeniami, opisano w zagadnieniu o [wielkości partii](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

Kluczowy wniosek dla SMED dotyczy pierwiastka kwadratowego. Jeśli koszt przezbrojenia S spadnie do jednej czwartej, ekonomiczna wielkość partii zmaleje o połowę (√0,25 = 0,5). Jeśli S spadnie do jednej dziewiątej, wielkość partii spadnie do jednej trzeciej.

**Przykład poglądowy:** D = 24 000 sztuk rocznie, H = 2,40 USD za sztukę rocznie (na przykład 20 procent kosztu utrzymania zapasu przy części wartej 12 USD), S = 160 USD za przezbrojenie (dwie godziny pracy dwuosobowej ekipy po 40 USD za godzinę, z obciążeniami).

- EOQ = √(2 × 24 000 × 160 / 2,40) = √3 200 000 ≈ **1 789 sztuk**, czyli około 13 partii rocznie (24 000 / 1 789 ≈ 13,4).
- Po SMED przezbrojenie trwa 30 minut przy tej samej ekipie: S = 40 USD.
- EOQ = √(2 × 24 000 × 40 / 2,40) = √800 000 ≈ **894 sztuki**, czyli około 27 partii rocznie (24 000 / 894 ≈ 26,8).
- Średni zapas cyklowy (EOQ / 2) spada z około 894 do około 447 sztuk; przy 12 USD za sztukę uwalnia to około 5 400 USD zamrożonego kapitału wyłącznie dla tej jednej części.

Wzór ma dobrze znane ograniczenia: zakłada stały popyt, znane koszty i brak ograniczeń zdolności produkcyjnych, a „koszt przezbrojenia” trudno precyzyjnie określić, gdy przezbrajający i tak jest opłacany. Praktycy Lean traktują go zatem jako argument dla kierunku („niższy koszt przezbrojenia uzasadnia mniejsze partie”), a nie jako regułę planowania. System ciągnięty z [kanban](https://www.m365.fm/en/learn/kanban-pull-system/) i harmonogramem opartym na EPEI zwykle go zastępuje [34].

### Kontrola zdolności: czy stać nas na więcej przezbrojeń?

Zanim zaplanujesz zmniejszenie wielkości partii, sprawdź bilans zdolności produkcyjnych:

Wymagany czas w tygodniu = Σ (popyt × czas cyklu) + liczba przezbrojeń × średni czas przezbrojenia

Musi on pozostawać wyraźnie poniżej dostępnego czasu. Na wąskim gardle krótsze przezbrojenie jest przede wszystkim zyskiem zdolności; to, czy przeznaczysz go na mniejsze partie, jest decyzją świadomą, co szczegółowo omawia przewodnik o [teorii ograniczeń](https://www.m365.fm/en/learn/theory-of-constraints/). Na stanowisku niebędącym wąskim gardłem wolne moce istnieją z definicji i zwykle mądrzej jest przeznaczyć zaoszczędzony czas przezbrojenia na częstsze przezbrojenia.

## Bezpieczeństwo: przezbrojenia, blokowanie i oznakowanie energii oraz ergonomia

Żadna z dwunastu szeroko czytanych stron przeanalizowanych na potrzeby tego przewodnika nie dotyczy blokowania i oznakowania energii (lockout/tagout), mimo że niemal każdy wewnętrzny element przezbrojenia odbywa się w strefie zagrożenia maszyny. W USA nie jest to opcjonalne.

### Przezbrajanie to serwisowanie zgodnie z normą OSHA dotyczącą blokowania i oznakowania energii

Norma OSHA dotycząca kontroli niebezpiecznej energii, 29 CFR 1910.147, obejmuje serwisowanie i konserwację maszyn oraz urządzeń, w których nieoczekiwane załączenie, uruchomienie lub uwolnienie zgromadzonej energii mogłyby zagrozić pracownikom [8]. Jej definicja „serwisowania i/lub konserwacji” wyraźnie obejmuje przygotowanie i regulację, a „przygotowanie” zdefiniowano jako każdą pracę wykonywaną w celu przygotowania maszyny lub urządzenia do normalnej pracy produkcyjnej [8]. Przezbrojenie jest zatem domyślnie czynnością serwisową w rozumieniu normy.

Norma wymaga udokumentowanej procedury kontroli energii, szkoleń oraz ustalonej kolejności działań: przygotowanie do wyłączenia, wyłączenie maszyny, odizolowanie źródeł energii, założenie urządzeń blokujących lub oznakowujących, rozładowanie zgromadzonej energii oraz weryfikację odizolowania [8]. Pracodawcy muszą przeglądać każdą procedurę kontroli energii co najmniej raz w roku [8].

### Wyjątek dla drobnego serwisowania: wąski, a nie furtka

Uwaga do zakresu normy wyłącza drobne zmiany narzędzi i regulacje oraz inne drobne czynności serwisowe wykonywane w trakcie normalnej pracy produkcyjnej, jeśli są rutynowe, powtarzalne i integralnie związane z użytkowaniem urządzenia do produkcji, i tylko wtedy, gdy praca jest wykonywana z zastosowaniem alternatywnych środków zapewniających skuteczną ochronę [8]. Narzędzie eTool OSHA dotyczące blokowania i oznakowania wyjaśnia, że takie czynności podlegają wówczas wymaganiom dotyczącym osłon maszyn z podpunktu O i wymienia przykłady alternatywnych środków: specjalnie zaprojektowane narzędzia, urządzenia zdalne, osłony barierowe z blokadą, lokalne odłączniki i przełączniki sterujące pozostające w wyłącznej kontroli pracownika wykonującego pracę [9]. Jeśli którykolwiek warunek wyjątku nie jest spełniony, obowiązuje blokowanie i oznakowanie energii [9].

Co to oznacza dla SMED:

- Pełna wymiana matrycy lub formy zwykle nie jest „drobną" wymianą narzędzia podczas normalnej produkcji; należy ją zaplanować z zastosowaniem blokady i oznakowania (lockout/tagout). Czy konkretne zadanie kwalifikuje się do wyjątku, to ocena prawna i bezpieczeństwa należąca do specjalisty ds. bezpieczeństwa, a nie do zespołu SMED.
- SMED ma sprawić, że blokada będzie szybsza i łatwiejsza, a nigdy nie może jej pominąć. Przykłady: punkty blokady pogrupowane i oznakowane przy maszynie, stanowisko blokady w wózku do przezbrojenia, skrzynki blokad grupowych dla prac równoległych, w których każda osoba zakłada własną kłódkę, oraz kroki weryfikacji zapisane w standardowej karcie przezbrojenia.
- Standard czasu przezbrojenia, który można osiągnąć wyłącznie przez pominięcie izolacji energii, jest błędnym standardem. Czas blokady należy uwzględnić w celu.

### Prasy mechaniczne

W przypadku pras mechanicznych OSHA wymaga procedury ustawiania matryc, która zapewnia zgodność z zasadami zabezpieczania strefy pracy, obrotowe dźwignie z sprężyną tam, gdzie prasa jest do nich przystosowana, zderzaki matryc w prasach pochylonych, bloki bezpieczeństwa za każdym razem, gdy matryce są regulowane lub naprawiane w prasie, oraz narzędzia, takie jak szczotki lub pistolety do smarowania, aby operatorzy i ustawiacze matryc nie sięgali w strefę pracy w celu nasmarowania [10]. Muszą one być uwzględnione w każdym standardzie przezbrojenia prasy.

### Ergonomia

Przezbrojenia wiążą się z ciężkimi, niewygodnymi czynnościami: podnoszeniem matryc, części formatowych i uchwytów, pracą pochyloną w osłonach, sięganiem po śruby. OSHA opisuje ergonomię jako dopasowanie pracy do pracownika w celu ograniczenia zaburzeń układu mięśniowo-szkieletowego [32]. SMED i ergonomia zazwyczaj wskazują ten sam kierunek: wózki do matryc, prowadnice rolkowe, urządzenia do podnoszenia, uchwyty na wysokości pasa i mniejsza liczba śrub przyspieszają pracę i są łatwiejsze dla ciała. Ryzyko leży w celach czasowych: gdy zespół jest pod presją, by pobić zegar, pomijane są technika podnoszenia i podnoszenie przez dwie osoby. Cele czasowe trzeba ustalać tak, by dało się je osiągnąć w zrównoważonym tempie.

### Lista kontrolna bezpieczeństwa dla projektów SMED

| Kontrola | Wykonano |
|---|---|
| Wymienione źródła energii maszyny (elektryczna, hydrauliczna, pneumatyczna, grawitacyjna, termiczna, chemiczna) | ☐ |
| Przejrzano obowiązującą procedurę kontroli energii; zidentyfikowano kroki przezbrojenia objęte blokadą i oznakowaniem | ☐ |
| Specjalista ds. bezpieczeństwa przejrzał każde twierdzenie, że krok podlega wyjątkowi dla drobnych czynności serwisowych | ☐ |
| Kroki blokady i weryfikacji zapisane w standardowej karcie przezbrojenia wraz z czasem | ☐ |
| Prace równoległe: każda osoba zakłada własną kłódkę; określone sygnały komunikacyjne | ☐ |
| Prasy: procedura ustawiania matryc, bloki bezpieczeństwa, dźwignie obrotowe i zderzaki matryc sprawdzone [10] | ☐ |
| Zidentyfikowano ciężkie podnoszenia; określono urządzenia wspomagające lub podnoszenie przez dwie osoby | ☐ |
| Zidentyfikowano gorące powierzchnie (podgrzane formy, podgrzewane matryce); określono rękawice i sposób postępowania | ☐ |
| Nowe szybkomocujące osprzęty sprawdzone pod kątem siły zacisku i zachowania w razie awarii | ☐ |
| Pierwsze przezbrojenie według nowego standardu obserwowane przez przełożonego | ☐ |

## Jakość: zatwierdzanie pierwszej sztuki, poka-yoke i kontrolowane czyszczenie linii

Rozruch i regulacja stanowią największą część wielu przezbrojeń [5]. Problemy jakościowe po przezbrojeniu zwykle mają te same przyczyny: niewłaściwe narzędzie lub program, ustawienia według pamięci, brak kontroli pierwszej sztuki albo zatwierdzanie pierwszej sztuki, które czeka na inspektora zajętego czymś innym.

### Zatwierdzanie pierwszej sztuki bez czekania

- **Zdefiniuj kontrolę** w standardowym arkuszu przezbrojenia: jakie charakterystyki, jaki przyrząd pomiarowy, jaka wielkość próby.
- **Doprowadź przyrząd pomiarowy do maszyny** i przeszkol operatora w pomiarach, a technik jakości zatwierdza tylko tam, gdzie wymaga tego plan kontroli.
- **Powiadom jakość z wyprzedzeniem** za pomocą listy kontrolnej przed przezbrojeniem, tak aby inspektor był obecny, gdy zejdzie pierwsza sztuka.
- **Zapisz wynik pierwszej sztuki** razem ze zleceniem, aby był możliwy do prześledzenia.

### Poka-yoke w przezbrojeniu

Urządzenia [poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) zapobiegają błędom lub je wykrywają [28]. W przezbrojeniach typowe przykłady to:

| Błąd | Poka-yoke |
|---|---|
| Niewłaściwa matryca lub forma do zlecenia | Kodowana matryca (RFID, kod kreskowy lub klucz mechaniczny), którą sterowanie maszyny sprawdza względem zlecenia |
| Niewłaściwy program lub receptura | Receptura wywoływana automatycznie z numeru zlecenia |
| Węże podłączone do niewłaściwych przyłączy | Płyty wielozłączowe lub złącza pasujące tylko w jednym położeniu, oznaczone kolorami |
| Część formatowa zamontowana w niewłaściwym położeniu | Asymetryczne kołki ustalające |
| Stare etykiety lub materiały pozostawione na linii | Lista kontrolna czyszczenia linii z podpisem; dedykowane pojemniki na usunięte materiały |

### Branże regulowane

W zakładach podlegających regulacjom przezbrojenie jest częścią systemu jakości. W amerykańskim opakowalnictwie farmaceutycznym kontrola czystości linii przed użyciem oraz jej udokumentowanie w dokumentacji partii są wymagane przez 21 CFR 211.130(e) [11]. W przemyśle spożywczym przezbrojenia związane z alergenami stanowią część kontroli alergenów wymaganych na mocy 21 CFR 117.135(c)(2) [37]. W łańcuchach dostaw motoryzacji (IATF 16949) i lotnictwa (AS9100) plany kontroli i wymagania specyficzne dla klienta mogą wymagać weryfikacji ustawień lub weryfikacji pierwszej sztuki po przezbrojeniach; sprawdź umowy i plany kontroli, zamiast zakładać ogólną regułę. Przewodnik [planowanie produkcji w lotnictwie](https://www.m365.fm/en/learn/aerospace-production-planning/) omawia kontekst lotniczy. Projekty SMED w tych środowiskach powinny od pierwszego dnia obejmować kierownika jakości i zatwierdzać każdą zmianę kroków czyszczenia lub weryfikacji, zanim zostanie użyta.

### Ujęcie statystyczne

Przezbrojenie jest również źródłem zmienności. Jeśli części z początku każdej serii systematycznie się różnią, karta kontrolna podzielona na „pierwsze 30 minut po przezbrojeniu” i „pozostała część serii” pozwala to zobaczyć. Cakmakci wykorzystał zdolność procesu (Cpk) w badaniu SMED w motoryzacji, aby ocenić związek między redukcją czasu przezbrojenia a konstrukcją urządzeń [16]. Przewodnik [Six Sigma i analiza przyczyn źródłowych](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) omawia analizę zdolności i karty kontrolne.

## Ludzie i role: kto co robi podczas przezbrojenia

SMED jest często opisywane jako metoda techniczna. W praktyce zmienia pracę operatorów i ustawiaczy bardziej niż jakiekolwiek inne narzędzie Lean, więc sukces lub porażka zależą od nich.

### Role

| Rola | W projekcie SMED | W codziennym przezbrojeniu |
|---|---|---|
| Operator | Członek zespołu; zna szczegóły, nagrywa i jest nagrywany | Wykonuje przygotowanie zewnętrzne, część prac wewnętrznych, pomiar pierwszej sztuki |
| Ustawiacz / ustawiacz narzędzi | Kluczowy członek zespołu; odpowiada za metodę | Wykonuje wymianę wewnętrzną, kieruje pracami równoległymi |
| Technik utrzymania ruchu | Buduje i utrzymuje urządzenia szybkiej wymiany, złącza, zaciski | Wspiera złożone przezbrojenia; dba o stan narzędzi i form |
| Inżynier produkcji | Prowadzi warsztaty, analizuje wideo, projektuje rozwiązania techniczne | Odpowiada za standard; doskonali go |
| Technik jakości | Określa kontrole pierwszej sztuki i zabezpieczenia przed błędami | Zatwierdza pierwsze sztuki tam, gdzie jest to wymagane |
| Przełożony | Sponsor; zapewnia czas zespołowi | Planuje przezbrojenia zgodnie z harmonogramem; sprawdza przestrzeganie standardu |
| Planista produkcji | Uzgadnia sposób wykorzystania zaoszczędzonego czasu; zmienia wielkości partii | Ustala kolejność zleceń tak, aby zminimalizować wysiłek przezbrojeń |
| Przedstawiciel ds. bezpieczeństwa | Sprawdza kontrolę energii i ergonomię | Audytuje blokady (lockout) podczas przezbrojeń |

### Co się zmienia dla operatorów i ustawiaczy

SMED zwykle przesuwa pracę: operatorzy przejmują przygotowanie zewnętrzne i część przezbrojenia wewnętrznego, a ustawiacze spędzają mniej czasu na szukaniu i więcej na krokach technicznych. To zmiana zakresu obowiązków. W zakładach z organizacjami związkowymi opisy stanowisk, klasyfikacje i grupy płacowe są często określone w układzie zbiorowym, dlatego przed wdrożeniem nowego standardu uzgodnij nowy podział zadań ze związkiem zawodowym. W zakładach bez związków zawodowych to samo pytanie pojawia się nieformalnie: kto zostanie przeszkolony, kto ponosi odpowiedzialność, jeśli pierwsza sztuka nie przejdzie kontroli, i czy nowe zadania zostaną uznane.

### Szacunek dla ludzi

Trzy zasady z praktyki decydują o tym, czy projekt SMED zostanie poparty przez załogę, czy napotka opór:

1. **Filmuj proces, nie osobę.** Wyjaśnij cel przed nagraniem. Pozwól ustawiaczowi najpierw skomentować nagranie; zwykle wie dokładnie, gdzie są marnotrawstwa. W zakładach związkowych poinformuj wcześnie przedstawicieli związku i uzgodnij, jak przechowywane i wykorzystywane będą nagrania.
2. **Nie zamieniaj zaoszczędzonego czasu na redukcje etatów.** Jeśli SMED prowadzi do zwolnień, kolejny projekt usprawnień nie otrzyma żadnych pomysłów od załogi. Wykorzystaj czas na zwiększenie zdolności produkcyjnych, mniejsze partie lub szkolenia.
3. **Ustalaj cele, które można osiągnąć bezpiecznie.** Standard przezbrojenia opisuje dobrą metodę wykonywaną w normalnym tempie. Analogie do pit stopu pomagają wyjaśnić pracę równoległą i przygotowanie, ale ekipa pit stopu trenuje jedną zmianę opony w warunkach wyścigowych; ustawiacz wykonuje to samo przezbrojenie na końcu długiej zmiany, wiele razy w roku.

Vorne zaleca rozpoczęcie od usprawnień „ludzkich”, czyli przygotowania i organizacji, przed zmianami technicznymi [20]; leanproduction.com przedstawia tę samą rekomendację [19]. Ta kolejność buduje też zaufanie: zespół widzi szybkie rezultaty własnych pomysłów, zanim zostaną wydane pieniądze.

## Szablony i listy kontrolne SMED

Poniższe szablony można skopiować do arkusza kalkulacyjnego lub wydrukować na arkuszach A3 lub 11 × 17 cali. To sprawdzone w praktyce formaty robocze, a nie norma.

### Szablon 1: arkusz obserwacji przezbrojenia (lista elementów)

| # | Element (czasownik + obiekt) | Start (mm:ss) | Czas trwania (min) | Osoba | W/Z dziś | Rodzaj marnotrawstwa (szukanie, chodzenie, czekanie, regulacja, inne) | Pomysł | Mogłoby być W/Z |
|---|---|---|---|---|---|---|---|---|
| 1 | Zatrzymać maszynę, ostatnia dobra sztuka | 00:00 | | | W | | | |
| 2 | | | | | | | | |
| … | | | | | | | | |
| | **Razem wewnętrzne** | | | | | | | |
| | **Razem zewnętrzne** | | | | | | | |

Wskazówki: jeden wiersz na element, czasowniki na początku („poluzować”, „przejść”, „szukać”), czasy odczytane z nagrania wideo. Jeśli chodzenie jest znaczące, dodaj kolumnę „przebyta odległość”.

### Szablon 2: arkusz przekształcenia czynności wewnętrznych w zewnętrzne

| Element wewnętrzny | Dlaczego maszyna musi być zatrzymana? | Co musiałoby się zmienić, aby był zewnętrzny? | Technika (przygotować, standaryzować funkcję, przyrząd pośredni) | Koszt (niski / średni / wysoki) | Odpowiedzialny | Termin |
|---|---|---|---|---|---|---|
| Podgrzać formę | Forma nagrzewa się tylko w maszynie | Oddzielne stanowisko podgrzewania | Przygotować warunki pracy | Średni | | |
| Wyrównać matrycę na oko | Brak punktu odniesienia | Kołek ustalający i ogranicznik oporowy | Standaryzować funkcję | Niski | | |
| | | | | | | |

### Szablon 3: lista kontrolna przed przezbrojeniem (przygotowanie zewnętrzne)

| Pozycja na następne zlecenie | Lokalizacja | Sprawdził | Czas | OK |
|---|---|---|---|---|
| Matryca / forma / nr zestawu formatowego … (sprawdzona, kompletna, czysta) | Przygotowana przy maszynie, pozycja … | | | ☐ |
| Narzędzia (lista), zaciski, zapasowe śruby | Wózek do przezbrojeń | | | ☐ |
| Materiał / komponenty (ilość, partia, w razie potrzeby osuszone) | | | | ☐ |
| Program / receptura zwolniona i załadowana | Sterownik | | | ☐ |
| Rysunek, plan kontroli, sprawdzian pierwszej sztuki | Wózek | | | ☐ |
| Opakowania i etykiety na następne zlecenie | | | | ☐ |
| Suwnica / wózek widłowy / druga osoba zarezerwowane na godzinę … | | | | ☐ |
| Powiadomiony technik jakości (jeśli wymagana akceptacja) | | | | ☐ |
| Blokady bezpieczeństwa i procedura blokowania pod ręką | Stanowisko blokowania | | | ☐ |

Wyzwalacz: stały czas przed końcem bieżącej serii (na przykład, gdy zaczyna się ostatnie 45 minut), pokazany na maszynie lub w harmonogramie.

### Szablon 4: standardowy arkusz przezbrojenia (wersja dwuosobowa)

| Krok | Ustawiacz A | Czas (min) | Ustawiacz B | Czas (min) | Kluczowy punkt (bezpieczeństwo / jakość) |
|---|---|---|---|---|---|
| 1 | Zatrzymać maszynę, założyć blokadę | 0–2 | Założyć własną blokadę | 0–2 | Sprawdzić brak energii przed wejściem |
| 2 | Odłączyć przyłącza (strona operatora) | 2–4 | Odłączyć przyłącza (strona tylna) | 2–4 | Gorące powierzchnie: rękawice |
| 3 | Odblokować, wyjąć starą formę | 4–8 | Prowadzić suwnicę, ustawić na wózku | 4–8 | Sygnał podnoszenia dwuosobowego |
| … | | | | | |
| n | Kontrola pierwszej sztuki, zwolnienie | | Odłożyć starą formę do magazynu | | Zapisać wynik pierwszej sztuki |
| | **Docelowy czas całkowity** | | | | |

### Szablon 5: audyt przezbrojenia (co tydzień w pierwszym miesiącu, potem co miesiąc)

| Pytanie | Tak / Nie | Komentarz |
|---|---|---|
| Czy lista kontrolna przed przezbrojeniem została wypełniona przed zatrzymaniem? | | |
| Czy przestrzegano standardowej sekwencji? | | |
| Czy blokowanie i weryfikacja zostały wykonane zgodnie z opisem? | | |
| Czy wszystkie narzędzia i części były na miejscu użycia (bez szukania)? | | |
| Czy kontrola pierwszej sztuki została wykonana zgodnie z definicją? | | |
| Czy zarejestrowano czas przezbrojenia (od ostatniej dobrej sztuki do pierwszej dobrej)? | | |
| Odchylenie od celu, przyczyna zarejestrowana? | | |
| Czy pomysł usprawnienia od zespołu został zapisany? | | |

### Szablon 6: karta projektu SMED (jedna strona)

| Pole | Treść |
|---|---|
| Maszyna / linia | |
| Problem (z danymi) | np. średnie przezbrojenie 96 min, zakres 78–131 min, 11 dni zapasu |
| Cel | np. −50% w pierwszym cyklu, każda forma co 3 dni |
| Wykorzystanie zaoszczędzonego czasu (uzgodnione z planowaniem) | zdolność produkcyjna / mniejsze partie / podział |
| Zespół | nazwiska i role |
| Przegląd bezpieczeństwa wykonał | |
| Harmonogram | daty: punkt wyjścia, warsztat, wdrożenie, standaryzacja |
| Limit budżetu na sprzęt | |
| Sponsor | |

## Plan wdrożenia: od pilotażu do systemu szybkiej zmiany przezbrojeń w całym zakładzie

Poniższy harmonogram to szacunek praktyczny dla średniej wielkości zakładu produkcji dyskretnej; ramy czasowe zależą od wyposażenia, czasów dostawy sprzętu i tego, ile czasu zespół otrzyma [unverified: szacunek oparty na doświadczeniu praktyków, nie na danych].

| Faza | Ramy czasowe | Działania | Rezultat |
|---|---|---|---|
| 1. Przygotowanie | Tygodnie 1–3 | Wybór maszyny pilotażowej, zebranie danych bazowych przez co najmniej dwa tygodnie [19], karta projektu, przegląd bezpieczeństwa, uzgodnienie wykorzystania zaoszczędzonego czasu | Karta projektu podpisana, znany poziom bazowy |
| 2. Warsztat pilotażowy | Tydzień 4 (3–5 dni) | Filmowanie i analiza przezbrojenia, oddzielenie czynności wewnętrznych od zewnętrznych i ich konwersja, szybkie usprawnienia na hali, pierwsza próba nowej sekwencji | Pierwszy nowy standard, lista działań |
| 3. Wdrożenie | Tygodnie 5–10 | Sprzęt (złączki, zaciski, wózki), podgrzewanie lub wstępne ustawianie, druga próba, szkolenie wszystkich zmian | Nowy standard przeszkolony |
| 4. Stabilizacja | Tygodnie 11–16 | Wskaźnik KPI dzienny na tablicy, cotygodniowe audyty, korekta wielkości partii i harmonogramu | Stabilny czas, zmniejszone partie |
| 5. Upowszechnienie | Miesiące 5–12 | Kolejne 3–5 maszyn, przeszkoleni wewnętrzni trenerzy SMED, standard przezbrojeń jako część specyfikacji nowego wyposażenia | System przezbrojeń w całym obszarze |

### Wybór kolejnych maszyn

Szereguj kandydatów według wpływu i nakładu pracy:

| Kryterium | Waga | Pytanie |
|---|---|---|
| Wąskie gardło | Wysoka | Czy maszyna jest ograniczeniem strumienia wartości? |
| Częstotliwość × czas przezbrojeń | Wysoka | Ile godzin tygodniowo tracimy na przezbrojenia? |
| Ból związany z zapasami / czasem realizacji | Średnia | Czy ta maszyna generuje duże partie i wysokie zapasy w dalszych etapach? |
| Zmienność czasu przezbrojeń | Średnia | Czy zakres jest szeroki (oznaka braku standardów)? |
| Gotowość zespołu | Średnia | Czy zespół jest chętny i czy supervisor sponsoruje zmianę? |
| Nakład na sprzęt | Niska (ujemna) | Czy przed uzyskaniem efektów potrzebna jest duża inwestycja? |

### Uczyń przezbrojenia wymogiem projektowym

Najtańszy projekt SMED to ten, którego nie trzeba realizować. Wpisuj wymagania dotyczące przezbrojeń do specyfikacji nowego wyposażenia, narzędzi i form: maksymalny czas przezbrojenia, znormalizowane wysokości mocowania i złącza, zapisane nastawy, brak regulacji. Braglia i współpracownicy proponują ustrukturyzowaną metodę, projektowanie szybkiej zmiany (quick changeover design, QCD), która ma pomóc producentom maszyn projektować pod kątem szybkich przezbrojeń od samego początku [15]. Za to muszą odpowiadać zakupy i inżynieria, a nie wyłącznie zespół Lean.

## Wskaźniki KPI przezbrojeń: jak mierzyć postęp

| KPI | Wzór / definicja | Dlaczego jest ważny | Typowy przegląd |
|---|---|---|---|
| Średni czas przezbrojenia | Σ czasów przezbrojeń / liczba przezbrojeń (od ostatniej dobrej sztuki do pierwszej dobrej) | Główny wynik | Codziennie na maszynę, tygodniowy trend |
| Rozstęp lub odchylenie standardowe czasu przezbrojenia | Max − min lub odchylenie standardowe z ostatnich 20 przezbrojeń | Pokazuje, czy istnieje standard i czy jest przestrzegany | Tygodniowo |
| Przezbrojenia w standardzie | Przezbrojenia ≤ czas docelowy / wszystkie przezbrojenia × 100% | Przestrzeganie standardu | Codziennie na tablicy |
| Czas przezbrojenia wewnętrznego | Suma elementów wewnętrznych | Postęp w oddzielaniu i konwersji | Na cykl SMED |
| Czas rozruchu i braki | Czas i braki od ponownego uruchomienia do prędkości i jakości standardowej | Często największa ukryta strata | Na każde przezbrojenie |
| Pierwsza sztuka dobra za pierwszym razem | Pierwsze sztuki zatwierdzone przy pierwszej kontroli / wszystkie pierwsze sztuki × 100% | Jakość przezbrojenia | Tygodniowo |
| Liczba przezbrojeń na tydzień | Liczba | Pokazuje, czy zyski są wykorzystywane do mniejszych partii | Tygodniowo z planowaniem |
| Udział przezbrojeń w planowanym czasie | Σ czasu przezbrojeń / planowany czas produkcji × 100% | Ujęcie zdolności produkcyjnych | Tygodniowo |
| EPEI | Interwał, w którym wszystkie części są wyprodukowane po jednym razie | Elastyczność | Miesięcznie |
| Średnia wielkość partii i dni zapasu | Sztuki w partii; zapas / średnie dzienne zapotrzebowanie | Wynik biznesowy | Miesięcznie |
| Dostępność OEE | Zgodnie z definicją w Twoim schemacie OEE | Efekt na poziomie maszyny, jeśli czas jest wykorzystywany do produkcji | Tygodniowo |

Utrzymuj tablicę prostą: jeden wykres na maszynę z dziennymi czasami przezbrojeń w porównaniu z celem oraz jedna linia z powodem, gdy przezbrojenie przekroczyło cel. Ogólne zasady tablic KPI omówiono w przewodniku [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

**Słowo o celach:** „poniżej dziesięciu minut” to aspiracja Shingo, a nie uniwersalny benchmark. Dobry czas przezbrojenia to taki, który jest stabilny, bezpieczny i wystarczająco krótki, by obsłużyć EPEI, jakiego potrzebują Twoi klienci. Dla dużej linii prasowej 20 minut może być znakomitym wynikiem; dla małej tokarki CNC 20 minut może być powolne.

## Uzasadnienie biznesowe: koszty, ROI i rachunkowość zapasów

Zespoły finansowe zadają trzy pytania dotyczące SMED: ile to kosztuje, co przynosi i kiedy widać to w liczbach. Odpowiedzi w dużym stopniu zależą od tego, czy maszyna jest wąskim gardłem.

### Koszty

| Pozycja kosztowa | Typowy charakter | Ujęcie księgowe |
|---|---|---|
| Czas zespołu na warsztat i dalsze działania | Godziny operatorów, ustawiaczy, inżynierów | Koszt operacyjny |
| Tanie wyposażenie (wózki, tablice cieni, bloki dystansowe, kodowanie kolorami) | Niewielkie | Zwykle koszt operacyjny, zależnie od progu kapitalizacji |
| Szybkozłączki (sprzęgła, systemy mocowania, podgrzewacze, presettery) | Średnie do wysokich | Często nakłady inwestycyjne, jeśli przekraczają próg |
| Szkolenie | Godziny | Koszt operacyjny |
| Strata produkcji podczas prób | Zwykle niewielka, jeśli próby przebiegają w planowanych przezbrojeniach | Koszt operacyjny |

### Zwroty

1. **Zdolność produkcyjna przy wąskim gardle:** zaoszczędzone godziny przezbrojeń × marża wkładu na godzinę, jeśli dodatkowa produkcja może zostać sprzedana. W powyższym przykładzie CNC 590 minut przezbrojeń tygodniowo kosztuje około 92 000 USD rocznie utraconej marży; ich zredukowanie o połowę odzyska około 46 000 USD rocznie, ale tylko wtedy, gdy dodatkowa produkcja znajdzie nabywców.
2. **Redukcja zapasów:** jednorazowe uwolnienie gotówki (bilans) oraz bieżące oszczędności na kosztach utrzymania zapasów (rachunek zysków i strat).
3. **Mniej pilnych zleceń i przezbrojeń awaryjnych:** nadgodziny, przesyłki ekspresowe i zakłócenie zaplanowanej pracy.
4. **Braki i poprawki:** krótsze i bardziej stabilne rozruchy.
5. **Robocizna:** czasem niższa, często podobna; praca równoległa skraca czas realizacji, ale nie zawsze zawartość pracy ludzkiej.

### Przykład obliczenia zwrotu z inwestycji (ilustracyjny, kontynuacja przykładu formowania)

| Pozycja | Kwota |
|---|---|
| Inwestycja: stanowisko podgrzewania | $12,000 |
| Inwestycja: 6 zestawów szybkozłączek wielokrotnych po $1,500 | $9,000 |
| Inwestycja: standaryzacja zacisków i punktów bazowania | $6,000 |
| Czas zespołu: 6 osób × 16 godzin × $45 koszt obciążony | $4,320 |
| **Łączny koszt jednorazowy** | **$31,320** |
| Zmniejszenie zapasu wyrobów gotowych o 5 dni przy $6,000 dziennie kosztu wytworzenia sprzedanych wyrobów | $30,000 jednorazowe uwolnienie gotówki |
| Oszczędność kosztu utrzymania zapasu przy 20% rocznie od $30,000 | $6,000 rocznie |
| Mniej pilnych zleceń i nadgodzin (szacunek na podstawie zapisów z ubiegłego roku) | $8,000 rocznie |
| Braki na etapie rozruchu: 15 mniej braków na przezbrojenie × 10 przezbrojeń × 50 tygodni × $0.90 | $6,750 rocznie |
| **Korzyść cykliczna** | **$20,750 rocznie** |
| **Prosty czas zwrotu z korzyści cyklicznych** | 31,320 / 20,750 ≈ 1.5 roku |

Gotówka uwolniona z zapasów ($30,000) prawie pokrywa inwestycję w pierwszym roku, ale jest to efekt bilansowy, a nie zysk. W uzasadnieniu biznesowym należy je rozdzielić i nie liczyć tej samej oszczędności dwukrotnie.

### Efekt kosztowania pełnego (absorption costing)

Przy kosztowaniu pełnym [38], które w istocie wymaga US GAAP w zewnętrznym sprawozdawaniu zapasów (ASC 330-10-30-1 i 30-3 obejmują alokację stałych kosztów produkcji ogólnej w oparciu o normalny poziom zdolności produkcyjnej, a 330-10-30-8 stwierdza, że wyłączenie wszystkich kosztów ogólnych z kosztu zapasów nie jest dopuszczalną procedurą rachunkowości [40]; zapytaj swojego głównego księgowego, jak Twoja firma to stosuje), część stałych kosztów produkcji ogólnej jest kapitalizowana w zapasach. Gdy zapasy spadają, koszty ogólne zakapitalizowane w zmniejszonym zapasie są przenoszone do kosztu sprzedanych wyrobów w tym okresie. Zysk raportowany może zatem przejściowo spaść podczas redukcji zapasów, mimo że gotówka się poprawia.

**Przykład liczbowy (ilustracyjny):** Jeśli 30 procent wartości zapasu wynoszącej $30,000 stanowią stałe koszty produkcji ogólnej, redukcja zapasu uwalnia około $9,000 kosztów ogólnych do kosztu sprzedanych wyrobów w danym okresie. Controllerzy zakładowi powinni wyjaśnić to kierownictwu przed rozpoczęciem programu SMED, aby sukces w ramach Lean nie wyglądał jak przekroczenie kosztów. Przewodnik [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) omawia, jak przedstawiać takie efekty na tablicy wskaźników zakładu.

## SMED i inne narzędzia lean

SMED rzadko działa samodzielnie. Opiera się na kilku narzędziach i umożliwia działanie kolejnych.

| Narzędzie | Relacja do SMED |
|---|---|
| [5S](https://www.m365.fm/en/learn/5s-visual-management/) | Warunek wstępny: narzędzia i matryce w określonych miejscach eliminują szukanie, czyli największą stratę zewnętrzną [27] |
| [Standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) | Utrwala zyski: nowe przezbrojenie staje się standardem [26] |
| [TPM](https://www.m365.fm/en/learn/tpm-oee/) | Utrzymuje matryce, formy i oprzyrządowanie szybkiej wymiany w dobrym stanie; leanproduction.com zaleca najpierw TPM, gdy utracony czas wynika głównie z awarii, a nie z przezbrojeń [19][29] |
| [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) | Zapobiega użyciu błędnych narzędzi, programów lub połączeń [28] |
| [Kanban i pull](https://www.m365.fm/en/learn/kanban-pull-system/) | Wykorzystuje mniejsze partie; wielkości kanban maleją wraz ze skracaniem przezbrojeń [34] |
| [Heijunka](https://www.m365.fm/entity/heijunka/) | Wyrównywanie według asortymentu wymaga częstych, krótkich przezbrojeń [25] |
| [Mapowanie strumienia wartości](https://www.m365.fm/en/learn/value-stream-mapping/) | Pokazuje, które przezbrojenia generują zapasy i czas realizacji; czas przezbrojenia i EPEI są pozycjami w karcie danych [35] |
| [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) | Warsztat SMED jest klasycznym formatem wydarzenia kaizen |
| [Teoria ograniczeń](https://www.m365.fm/en/learn/theory-of-constraints/) | Kieruje wysiłek SMED przede wszystkim na wąskie gardło, gdzie zaoszczędzony czas przekłada się na wydajność systemu |
| [Planowanie produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/) | Sekwencjonuje zlecenia tak, aby zminimalizować wysiłek przezbrojeń, a krótsze przezbrojenia przekładają się na mniejsze partie |

## Udokumentowane przykłady SMED

Wiele stron internetowych podaje „typowe” redukcje o 50 do 90 procent bez podania źródła. Poniższe przykłady są udokumentowane, wraz z ich ograniczeniami.

### Przezbrojenia pras w Toyocie

Wikipedia, opierając się na książkach Shingo, podaje, że przezbrojenia w Toyocie spadły z godzin do 15 minut do lat 60., a do 3 minut do lat 70. [5]; własna relacja Shingo opisuje zmiany matryc trwające od jednej do dwóch godzin, czasem pół dnia, które po jego rozpoczęciu pracy w Toyocie w 1969 roku skrócono do kilku minut [6]. Otwarty podręcznik inżynierski podaje, że przezbrojenie prasy 1000-tonowej w Toyocie skrócono z czterech godzin do trzech minut [36]. Dane pochodzą z relacji Shingo i Toyoty i nie zostały niezależnie zweryfikowane, ale są spójne między źródłami.

### Brighton NC Machine Corporation (Michigan, NIST MEP)

Brighton NC Machine, producent z Michigan zatrudniający ponad 100 pracowników, współpracował z Michigan Manufacturing Technology Center, częścią sieci NIST MEP National Network [17]. Przed projektem przezbrojenia mogły być wykonywane wyłącznie na pierwszej zmianie, trwały 8 godzin i 20 minut i wymagały 9121 stóp przejazdów pracowników [17]. Wydarzenie kaizen z nagraniem wideo, diagramem spaghetti i wykresem analizy przezbrojeń doprowadziło do 70-procentowej redukcji czasu przezbrojenia i 98-procentowej redukcji czasu przejazdów; firma podała 460 000 dolarów nowej sprzedaży i 125 000 dolarów oszczędności kosztów [17]. Wyniki są podane zgodnie z relacją firmy i MEP; historie sukcesu MEP są zgłaszane przez klientów.

### Przypadki konsultingowe Shingo

Shingo podał, że w jego przypadkach redukcji czasu przezbrojenia w latach 1975–1985 czasy przezbrojeń spadły średnio do około 2,5 procent wartości wyjściowej [5]. Jest to średnia z wybranych przypadków od twórcy metody, a zatem raczej górny punkt odniesienia niż oczekiwany wynik.

### Przegląd badań

Przegląd stanu wiedzy autorstwa da Silvy i Godinho Filho w *International Journal of Advanced Manufacturing Technology* (2019) sklasyfikował 130 artykułów o SMED według obszaru, metody, narzędzi, wdrożenia i wyników [14]. Literatura pokazuje zastosowanie SMED w przemyśle motoryzacyjnym, obróbce metali, pakowaniu, poligrafii, przemyśle spożywczym i farmaceutycznym. Jeden przypadek z przemysłu poligraficznego, przytoczony w otwartym podręczniku, odnotował 46-procentową redukcję wewnętrznego czasu przezbrojenia [36]. Opublikowane przypadki zwykle opisują sukcesy; nieudane lub wygasłe projekty rzadko są opisywane, dlatego średnie z literatury przypadków należy traktować ostrożnie.

## Typowe błędy w SMED

| Błąd | Dlaczego szkodzi | Lepiej |
|---|---|---|
| Brak decyzji, jak wykorzystać zaoszczędzony czas | Zyski znikają w czasie przestojów; partie pozostają takie same | Uzgodnić z planowaniem przed projektem: zdolność produkcyjna, mniejsze partie lub podział |
| Najpierw zakup sprzętu | Automatyzuje marnotrawstwo; budżet wyczerpany, zanim uporządkowana zostanie organizacja | Najpierw wyczerpać separację i konwersję; mechanizację na końcu [5] |
| Mierzenie tylko „przezbrojenia” | Pomija rozruch i regulację, często największą część | Od ostatniej dobrej sztuki do pierwszej dobrej sztuki przy prędkości standardowej [2] |
| Filmowanie bez wyjaśnienia | Ekipa czuje się obserwowana; opór | Wyjaśnić cel, zaangażować ustawiacza w analizę, uzgodnić wykorzystanie nagrań |
| Pilotaż na najtrudniejszej maszynie | Długie, kosztowne, powolne efekty | Pilotaż na przezbrojeniu trwającym 30–90 minut, które występuje często |
| Jedno „bohaterskie” przezbrojenie | Rejestrowany czas z inżynierami obecnymi na miejscu, nie do powtórzenia | Standaryzować, przeszkolić wszystkie zmiany, mierzyć przez tygodnie |
| Pomijanie blokady i oznakowania (lockout/tagout), by zaoszczędzić czas | Poważne ryzyko obrażeń; naruszenie przepisów OSHA | Zapisać blokadę w standardzie; uczynić ją szybszą, nigdy jej nie pomijać [8] |
| Brak standardu i brak audytu | Czasy wracają do dawnych wartości w ciągu miesięcy | Standardowa karta przezbrojenia, audyty, KPI na tablicy |
| Ignorowanie harmonogramu | Losowe sekwencje wywołują pełne przezbrojenia, które mogłyby być częściowe | Sekwencjonować według rodzin produktów; planować przezbrojenia o stałych porach |
| Rozpoczynanie przezbrojenia tuż przed zmianą | Przekazanie w trakcie przezbrojenia wewnętrznego; kroki są pomijane lub powtarzane, blokady zmieniają właściciela | Planować przezbrojenia tak, by jedna ekipa je kończyła, albo określić formalny punkt przekazania z przeniesieniem blokad, zgodnie z wymogami procedury kontroli energii |
| Koszt przezbrojenia w systemie planowania nigdy nieaktualizowany | ERP nadal wylicza duże partie | Zaktualizować czasy przezbrojenia i reguły wielkości partii w ERP po wdrożeniu SMED |
| Traktowanie SMED jako jednorazowego projektu | Brak drugiego cyklu; etap sprzętowy nigdy nie następuje | Planować cykle; uczynić SMED częścią rutyny doskonalenia |

Przedostatni punkt łatwo przeoczyć. Wiele systemów ERP wylicza wielkości partii na podstawie czasów przezbrojenia zapisanych w marszrutach. Jeśli pozostają na dawnych wartościach, system planowania nadal zaleca dawne duże partie. Przewodnik [S&OP i MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) wyjaśnia, gdzie te parametry się znajdują.

## Ograniczenia i krytyka SMED

SMED jest jednym z najlepiej udokumentowanych narzędzi lean, ma jednak swoje ograniczenia, na które wskazuje literatura naukowa.

### 1. Zbyt dużo organizacji, za mało projektowania

McIntosh i współpracownicy twierdzili w 1996 roku, że powszechna interpretacja SMED skłoniła praktyków do faworyzowania tanich, zespołowych zmian organizacyjnych i do pomijania rozwiązań projektowych, które mogłyby poprawić przezbrojenia w sposób bardziej fundamentalny; szczególną uwagę zwracali na problem utrzymania osiągniętych usprawnień [13]. Ta sama grupa badawcza opublikowała później krytyczną ocenę metodologii Shingo w *International Journal of Production Research* (2000) [12]. Badanie Cakmakciego dotyczące branży motoryzacyjnej podobnie wiąże problemy z przezbrojeniem z niewystarczającym wyposażeniem i konstrukcją matryc [16], a Braglia i współpracownicy opracowali projektowanie szybkiego przezbrajania, aby uwzględnić zdolność przezbrajania już na etapie projektowania maszyn [15]. Wniosek praktyczny: prowadź warsztaty SMED, ale wpisuj również wymagania dotyczące przezbrajania do specyfikacji nowego wyposażenia i projektów produktów.

### 2. Utrzymanie osiągniętych korzyści

Czasy przezbrojeń mają tendencję do powrotu do poprzedniego poziomu, gdy standard nie jest przekazywany nowym pracownikom, wózek do przezbrojeń traci narzędzia lub nie są utrzymywane oprzyrządowania szybkiej wymiany. McIntosh i współpracownicy wskazali utrzymanie usprawnień jako centralną słabość [13]. Środki zaradcze są mało efektowne: standardowa praca, audyty, wskaźnik KPI na tablicy oraz utrzymanie oprzyrządowania w ramach TPM.

### 3. Nie każdy proces zyskuje w równym stopniu

- **Przemysł procesowy** (chemiczny, spożywczy, farmaceutyczny) często ma przezbrojenia zdominowane przez mycie, walidację i wymagane kontrole. SMED skraca pracę wokół nich, ale planowanie kampanii i sekwencjonowanie produktów (od jasnych do ciemnych, najpierw bez alergenów) mogą mieć większe znaczenie.
- **Warsztaty o dużym asortymencie i małych wielkościach produkcji** mają wiele unikalnych przezbrojeń, które występują jednorazowo. Analiza element po elemencie pojedynczego przezbrojenia przynosi mniejsze korzyści; większe dają ustandaryzowane mocowanie przedmiotów, biblioteki narzędzi, programowanie offline i grupowanie według rodzin części.
- **Maszyny z nadmiarową zdolnością i niskim zapasem** zyskują niewiele na SMED. Najpierw sprawdź udział przezbrojeń w czasie straconym [19].

### 4. Korzyści, które nie trafiają do wyniku finansowego

Jeśli zaoszczędzony czas nie zostanie wykorzystany (zob. trzy opcje powyżej), SMED poprawi wskaźnik na wykresie i nic poza tym. Metoda sama tego nie zapobiegnie; musi to zrobić zarząd, i to jest najczęstsza przyczyna rozczarowania SMED.

### 5. Presja na ludzi

Cele dotyczące szybkości i pomiary z użyciem stopera mogą tworzyć presję, pośpiech w pracy i skróty omijające bezpieczeństwo. Sama metoda tego nie wymaga, ale jej wdrożenie może. Dobra praktyka ustala cele na zrównoważonym poziomie tempa, chroni czas blokady (lockout) i nie wykorzystuje zaoszczędzonego czasu do cięcia zadań.

## SMED w wersji cyfrowej: dane, wideo, MES i harmonogramowanie

Narzędzia cyfrowe nie zastępują metody SMED, ale przyspieszają analizę i ułatwiają utrzymanie wyników.

### Automatyczny pomiar przezbrojeń

Ręczne rejestry przezbrojeń są często niekompletne. Systemy monitorowania maszyn mogą wykrywać przezbrojenia na podstawie stanów maszyn i liczby wyprodukowanych sztuk, dzięki czemu każde przezbrojenie otrzymuje czas rozpoczęcia, zakończenia i czas trwania bez dokumentacji papierowej; dostawcy, tacy jak MachineMetrics, twierdzą, że automatyczne zbieranie danych jest bardziej wiarygodne niż ręczne rejestrowanie [21] (twierdzenie dostawcy). Operator nadal musi wpisać przyczynę, gdy przezbrojenie się przedłuża. Przewodnik po [systemie realizacji produkcji (MES) i ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) wyjaśnia, jak takie dane wpisują się w architekturę systemów zakładu, a [Manufacturing IT z Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) opisuje opcje chmurowe do ich gromadzenia.

Urządzenia do szybkiej wymiany są coraz częściej połączone: kodowane matryce i formy, które sterownik sprawdza względem zlecenia, pobieranie receptur, systemy mocowania z czujnikami. Każdy z nich jest zasobem OT w sieci zakładowej, z tymi samymi pytaniami dotyczącymi łatek i dostępu co w przypadku każdego sterownika; przewodnik o [cyberbezpieczeństwie OT i ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) opisuje, jak je zabezpieczyć.

### Analiza wideo

Nagrania ze smartfona lub kamery sportowej wystarczają w większości warsztatów SMED. Oprogramowanie, które pozwala zespołowi podzielić film na elementy i oznaczyć je jako wewnętrzne lub zewnętrzne, oszczędza godziny ręcznego mierzenia czasu. Uzgodnijcie kwestie ochrony danych: kto ogląda nagrania, jak długo są przechowywane i że nie są wykorzystywane do oceny wydajności poszczególnych osób.

### Cyfrowe instrukcje stanowiskowe i receptury

Cyfrowe instrukcje stanowiskowe mogą przełączać się automatycznie wraz ze zleceniem, pokazywać standardowy arkusz przezbrojenia krok po kroku z obrazkami i rejestrować wynik pierwszej sztuki; zagadnienie to omawia klaster o [produkcji bezpapierowej](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/). Zarządzanie recepturami, w którym ustawienia maszyn są zapisywane dla każdego produktu i pobierane ze zlecenia, eliminuje regulowanie jako źródło czasu i błędów. W branżach regulowanych oba rozwiązania muszą zostać zwalidowane.

### Harmonogramowanie z przezbrojeniami zależnymi od kolejności

Gdy czasy przezbrojeń zależą od kolejności (od jasnych do ciemnych kolorów, od małych do dużych formatów, najpierw wolne od alergenów), narzędzie do harmonogramowania może tak uszeregować zlecenia, by zminimalizować łączny czas przezbrojeń. Systemy zaawansowanego planowania i harmonogramowania (APS) potrafią modelować macierze przezbrojeń zależnych od kolejności; przewodnik [planowanie produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/) wyjaśnia, jak one działają i czego potrzebują od hali produkcyjnej. Macierz przezbrojeń w APS trzeba aktualizować po każdym cyklu SMED, w przeciwnym razie harmonogramista optymalizuje na podstawie starych czasów.

### Symulacja i modele strumienia wartości

Zanim zakład zmniejszy wielkość partii w strumieniu wartości, może przetestować wpływ krótszych przezbrojeń na EPEI, zapasy i czas realizacji w modelu strumienia wartości lub symulacji zdarzeń dyskretnych. Przewodnik [cyfrowy bliźniak w produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/) oraz klaster o [symulacji produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) wyjaśniają to podejście. Oprogramowanie do strumienia wartości, takie jak iFAKT Polaris, jest przykładem narzędzia, które przechowuje czasy przezbrojeń i wielkości partii dla każdego etapu procesu i oblicza ich wpływ na strumień wartości; zob. profil [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). **Uwaga: Autor pracuje w iFAKT GmbH.**

### Ograniczenia

Narzędzia cyfrowe wzmacniają standard pracy, ale go nie tworzą. Pulpit monitorowania maszyn pokazujący 90-minutowe przezbrojenia nic nie zmienia, dopóki zespół nie nagra przezbrojenia i nie naprawi go. Zacznijcie od papieru i wideo, a zbieranie danych zcyfrowajcie dopiero wtedy, gdy standard i rutyna wskaźników KPI już działają.

## Glosariusz SMED

| Termin | Znaczenie |
|---|---|
| **Regulacja** | Ustawianie metodą prób i błędów po zamontowaniu narzędzia; największa kategoria czasu przezbrojenia w podziale Shingo [5] |
| **Przezbrojenie** | Przełączenie maszyny lub linii z jednego produktu na inny; nazywane też przygotowaniem (setup) [2] |
| **Czas przezbrojenia** | Czas od ostatniej dobrej sztuki starej serii do pierwszej dobrej sztuki nowej serii [2], najlepiej przy prędkości standardowej |
| **Wózek przezbrojeniowy** | Wózek mieszczący wszystkie narzędzia i części do przezbrojenia, ułożone w kolejności użycia |
| **Zapas cyklowy** | Zapas powstający z wielkości partii; przy stałym popycie średnio około połowy partii |
| **Matryca (die)** | Narzędzie w prasie służące do cięcia lub kształtowania materiału; źródło litery „D” w SMED |
| **ECRS** | Eliminuj, łącz, zmieniaj kolejność, upraszczaj: pytania usprawniające z Training Within Industry, używane w programie szybkiej wymiany matryc w Toyocie [5] |
| **EOQ / EPQ** | Ekonomiczna wielkość zamówienia / ekonomiczna wielkość produkcji: wzory na wielkość partii równoważące koszt przezbrojenia i koszt utrzymania zapasu |
| **EPEI / EPEx** | Every part (product) every interval: jak często proces przechodzi przez wszystkie swoje wyroby [3] |
| **Przezbrojenie zewnętrzne** | Prace przygotowawcze, które można wykonać podczas pracy maszyny [1] |
| **Zatwierdzenie pierwszej sztuki** | Kontrola pierwszej sztuki po przezbrojeniu, zanim produkcja będzie kontynuowana |
| **Zacisk funkcjonalny** | Element mocujący, który zaciska jednym ruchem, np. dźwignia krzywkowa lub śruba na ćwierć obrotu [5] |
| **Przyrząd pośredni** | Standardowy nośnik (paleta, płyta podstawowa), na którym następne narzędzie lub detal jest przygotowywane poza maszyną [5] |
| **Przezbrojenie wewnętrzne** | Prace przygotowawcze, które można wykonać tylko przy zatrzymanej maszynie [1] |
| **Kontrola czystości linii (line clearance)** | Kontrola, czy wszystkie materiały poprzedniej serii zostały usunięte, zanim rozpocznie się następna; wymagana w amerykańskim pakowaniu farmaceutycznym [11] |
| **Blokada i oznakowanie energii (LOTO)** | Procedury i urządzenia kontrolujące niebezpieczną energię podczas serwisu, w tym przezbrojenia, zgodnie z 29 CFR 1910.147 [8] |
| **Wyjątek dla drobnych czynności serwisowych** | Wąski wyjątek od LOTO dla rutynowych, powtarzalnych i integralnych drobnych wymian narzędzi podczas normalnej produkcji, przy skutecznej alternatywnej ochronie [8][9] |
| **OTED** | Wymiana matrycy jednym dotknięciem: przezbrojenie w mniej niż 100 sekund [5] |
| **Operacje równoległe** | Dwie lub więcej osób pracujących nad przezbrojeniem jednocześnie, według określonej sekwencji [5] |
| **Szybkie przezbrojenie (QCO)** | Powszechny w USA termin oznaczający praktykę SMED [18] |
| **Receptura** | Zapisany zestaw parametrów maszyny dla danego produktu, pobierany zamiast ustawiany ręcznie |
| **Rozruch (run-up)** | Faza po ponownym uruchomieniu, do momentu pojawienia się dobrych sztuk przy prędkości standardowej |
| **Blok bezpieczeństwa** | Blok umieszczany między połówkami matrycy prasy podczas regulacji lub naprawy matryc; wymagany przez OSHA dla mechanicznych pras zasilanych [10] |
| **Karta analizy przezbrojenia** | Lista elementów przezbrojenia z czasami i klasyfikacją wewnętrzne/zewnętrzne [17] |
| **Diagram spaghetti** | Rysunek ścieżek przemieszczania się na planie stanowiska |
| **Standaryzuj funkcję, nie kształt** | Standaryzacja tylko tych cech narzędzia, które współdziałają z maszyną, np. wysokości mocowania [5] |
| **3 Ups** | Clean-up, set-up, start-up: uproszczony model faz przezbrojenia [24] |

## FAQ: SMED i pytania dotyczące przezbrojeń

### Co oznacza skrót SMED?

SMED to skrót od angielskiego *single-minute exchange of die* (czasami pisane „dies”). Określenie „single-minute” oznacza czas wyrażony jednocyfrową liczbą minut, czyli przezbrojenie trwające poniżej dziesięciu minut [1]. Metoda dotyczy każdego przezbrojenia, nie tylko wymiany matryc prasowych.

### Kto wynalazł SMED?

Shigeo Shingo (1909–1990), japoński inżynier przemysłowy, opracował tę metodę od lat 50. XX wieku, pracując w Toyo Kogyo (Mazda), Mitsubishi Heavy Industries, a od 1969 roku w Toyocie [6]. Opublikował ją po angielsku w 1985 roku jako *A Revolution in Manufacturing: The SMED System* [6].

### Jakie są etapy SMED?

Obserwacja i zapis przezbrojenia, oddzielenie czynności wewnętrznych od zewnętrznych, przeniesienie czynności wewnętrznych na zewnętrzne, usprawnienie czynności wewnętrznych, usprawnienie czynności zewnętrznych, standaryzacja i powtórzenie cyklu [5]. Ten przewodnik dodaje na początku etap przygotowania (pilotaż, zespół, przegląd bezpieczeństwa, wykorzystanie zaoszczędzonego czasu).

### Jaka jest różnica między przezbrojeniem wewnętrznym a zewnętrznym?

Przezbrojenie wewnętrzne może być wykonane wyłącznie przy zatrzymanej maszynie, na przykład montaż matrycy. Przezbrojenie zewnętrzne może być wykonane przy pracującej maszynie, na przykład pobranie i sprawdzenie następnej matrycy [1]. SMED przenosi jak najwięcej pracy z kategorii wewnętrznej do zewnętrznej.

### Jak oblicza się czas przezbrojenia?

Mierzy się od ostatniej dobrej sztuki poprzedniego przebiegu do pierwszej dobrej sztuki nowego przebiegu przy prędkości standardowej [2][21]. Średni czas przezbrojenia to suma wszystkich czasów przezbrojeń podzielona przez liczbę przezbrojeń; udział przezbrojeń to całkowity czas przezbrojeń podzielony przez planowany czas produkcji. Wzory i przykład dla CNC znajdują się w części o pomiarach.

### Jaka jest różnica między czasem przezbrojenia a czasem ustawienia?

W codziennym użyciu oba pojęcia często oznaczają to samo, choć niektóre źródła wyraźnie je rozdzielają [23]. Ściśle rzecz biorąc, wielu praktyków używa terminu „czas ustawienia” dla samej wymiany, a „czas przezbrojenia” dla całej straty od ostatniej dobrej sztuki do pierwszej dobrej sztuki, łącznie z wybiegiem i rozruchem. W pracach doskonalących warto stosować szerszą definicję.

### Jaki czas przezbrojenia jest dobry?

Aspiracją Shingo jest czas poniżej dziesięciu minut [1]. Praktyczna odpowiedź: dobry czas przezbrojenia jest stabilny (wąski zakres), bezpieczny i wystarczająco krótki, by obsłużyć wielkości partii i EPEI, których potrzebują klienci. Przy dużych liniach prasowych 20 minut może być znakomitym wynikiem, a przy małej maszynie może być zbyt wolno.

### Czym jest OTED?

One-touch exchange of die: przezbrojenie trwające poniżej 100 sekund [5]. Jest to kolejny cel po SMED, zwykle osiągany dopiero przy specjalnym sprzęcie do szybkiej wymiany.

### Jak SMED wiąże się z OEE?

Przezbrojenia zwykle są ujmowane jako straty dostępności, a wybrak po rozruchu jako straty jakości w OEE [4]. Krótsze przezbrojenia podnoszą dostępność w OEE tylko wtedy, gdy zaoszczędzony czas zostanie wykorzystany na produkcję. Jeśli zostanie przeznaczony na częstsze przezbrojenia, wskaźnik OEE może pozostać na tym samym poziomie, podczas gdy zapasy i czas realizacji ulegną poprawie.

### Czy SMED wymaga blokady i oznakowania (lockout/tagout)?

W USA przygotowanie maszyny wchodzi w zakres „obsługi i/lub konserwacji” w standardzie OSHA dotyczącym blokady i oznakowania, 29 CFR 1910.147, więc wewnętrzne etapy przezbrojenia na urządzeniach z niebezpieczną energią domyślnie podlegają temu standardowi [8]. Wąski wyjątek obejmuje drobne zmiany narzędzi podczas normalnej produkcji, które są rutynowe, powtarzalne i integralne, i tylko przy skutecznej alternatywnej ochronie [8][9]. Decyzję, które etapy się kwalifikują, powinien podjąć specjalista ds. bezpieczeństwa.

### Czym jest EPEI i jak SMED na nie wpływa?

EPEI (every part every interval; LEI: EPEx) to czas, w którym proces wytwarza wszystkie swoje numery części po jednym razie [3]. Zależy od czasów przezbrojeń i liczby części. Powszechnie stosowany wzór to całkowity czas przezbrojeń dla wszystkich części podzielony przez dzienny czas pozostały po odjęciu czasu pracy. W przykładzie z tego przewodnika skrócenie przezbrojeń z 200 do 70 minut na cykl zmniejsza EPEI z 2 dni do 1 dnia i o połowę redukuje partie.

### Dlaczego usprawnienia przezbrojeń z czasem tracą skuteczność?

Ponieważ standard nie jest przeszkolony na wszystkich zmianach, wózek do przezbrojeń traci narzędzia, sprzęt do szybkiej wymiany nie jest konserwowany albo nikt nie monitoruje wskaźnika KPI. Badania wskazały utrzymanie efektów jako główną słabość praktyki SMED [13]. Źródła praktyczne wskazują te same przyczyny, takie jak niespójne wykonywanie i sprzęt niegotowy do pracy [22]. Przeciwdziałają temu standardowa praca, audyty oraz codzienny wskaźnik KPI przezbrojeń na tablicy.

### Czy SMED jest częścią TPM?

Nie. SMED i TPM to odrębne metody lean, ale są ze sobą powiązane. TPM utrzymuje matryce, formy i oprzyrządowanie szybkiej wymiany w dobrym stanie, a leanproduction.com zaleca rozpoczęcie od TPM, gdy to awarie, a nie przezbrojenia, dominują w stratach czasu [19][29]. W większości schematów OEE zarówno przezbrojenia, jak i awarie są księgowane jako straty dostępności.

### Czy SMED dotyczy wyłącznie matryc i pras?

Nie. Nazwa pochodzi od pras tłoczących, ale LEI definiuje SMED jako proces przezbrajania dowolnego urządzenia produkcyjnego z jednego numeru części na inny w jak najkrótszym czasie [1]. Te same kroki sprawdzają się przy przezbrojeniu linii pakującej, wymianie formy, zmianie uchwytu na centrum obróbczym lub zmianie produktu na linii montażowej.

### Jaka jest różnica między wydarzeniem SMED a programem SMED?

Wydarzenie SMED to skoncentrowane warsztaty, zwykle wydarzenie kaizen, dotyczące jednej maszyny lub jednej linii. Program SMED to系统 w skali zakładu, który za nim stoi: standardowy szablon przezbrojenia, przeszkolone zespoły, wskaźniki KPI przezbrojeń na tablicy na hali oraz plan wdrażania od maszyny do maszyny. Wydarzenia przynoszą pierwsze wyniki; program je utrzymuje i rozprzestrzenia (zob. mapa drogowa wdrażania).

### Jakie branże stosują SMED?

Każda branża z przezbrojeniami: motoryzacja i tłoczenie metali, tworzywa sztuczne, obróbka skrawaniem, opakowania, poligrafia, elektronika, spożywcza i napojowa oraz farmaceutyczna. Przegląd 130 artykułów o SMED obejmował szeroki zakres sektorów [14]. W przemyśle procesowym dominują często czyszczenie i obowiązkowe kontrole, dlatego SMED łączy się z planowaniem sekwencji i kampanii.

### Ile trwa projekt SMED?

Pierwszy cykl SMED na jednej maszynie często trwa około trzech do czterech miesięcy od punktu wyjścia do stabilnego nowego standardu: kilka tygodni przygotowań i pomiaru bazowego, warsztaty trwające od trzech do pięciu dni, kilka tygodni na sprzęt i szkolenia oraz miesiąc stabilizacji [unverified: szacunek praktyków]. Terminy dostaw sprzętu mogą to wydłużyć.

### Ile kosztuje SMED?

Pierwszy cykl bywa tani: czas zespołu, listy kontrolne, wózki, oznaczenia kolorami i podkładki dystansowe. Oprzyrządowanie szybkiej wymiany, takie jak szybkozłącza wielokrotne, hydrauliczne mocowanie czy stanowiska podgrzewania, kosztuje więcej i powinno następować po krokach organizacyjnych. Przykład obliczenia ROI w tym przewodniku szacuje zwrot inwestycji na około 1,5 roku dla wtryskarki; Twoje liczby będą inne.

### Czy SMED może działać w warsztacie o dużym asortymencie i małych seriach?

Tak, ale z innym naciskiem. Gdy większość ustawień jest unikalna, standaryzuj to, co się powtarza: mocowanie przedmiotów, biblioteki narzędzi, programowanie offline, presetting i rodziny części. Analizuj proces przezbrajania, a nie jedno konkretne przezbrojenie.

## Wnioski i pierwsze kroki

SMED jest jedną z najbardziej praktycznych metod lean, ponieważ jego logika jest prosta, a wyniki są mierzalne: nie zatrzymuj maszyny na prace, które można wykonać podczas jej pracy, i spraw, by to, co musi się wydarzyć podczas postoju, było proste, bezpieczne i pozbawione regulacji. Spostrzeżenie Shingo z lat 50. i 60. XX wieku nadal obowiązuje, a pierwsze duże zyski nadal pochodzą z list kontrolnych, przygotowania z wyprzedzeniem i równoległej pracy, a nie z drogiego sprzętu.

Metoda zwraca się tylko wtedy, gdy zaoszczędzony czas zostanie wykorzystany. Krótsza przezbrojenie to potencjalna zdolność produkcyjna lub potencjalna elastyczność; zakład musi zdecydować, która z nich, a następnie zmienić wielkości partii, serie produkcyjne, harmonogramy i parametry ERP, aby dopasować je do popytu klientów. Liczby w tym przewodniku pokazują, dlaczego warto: w przykładzie EPEI skrócenie czasu przezbrojenia na cykl z 200 do 70 minut zmniejsza o połowę wielkości partii, a we wzorze na wielkość partii ekonomicznej jedna czwarta kosztu przezbrojenia oznacza połowę partii ekonomicznej.

Należy także zwrócić uwagę na ograniczenia. Organizacyjne SMED osiąga pułap tam, gdzie zaczyna dominować konstrukcja urządzeń i produktu, zyski zanikają bez standardów i audytów, a przyspieszenie nigdy nie może odbywać się kosztem blokady/oznakowania energii (lockout/tagout) ani ergonomii.

**Twoje pierwsze kroki w ciągu 30 dni**

- [ ] Wybierz jedną maszynę z częstymi przezbrojeniami trwającymi od 30 do 90 minut i widocznym problemem biznesowym
- [ ] Zapisuj początek i koniec każdego przezbrojenia przez dwa tygodnie (ostatnia dobra sztuka do pierwszej dobrej sztuki)
- [ ] Uzgodnij z planowaniem, jak zostanie wykorzystany zaoszczędzony czas: zdolność produkcyjna, mniejsze partie czy podział
- [ ] Przejrzyj z pracownikiem ds. bezpieczeństwa procedurę kontroli energii tej maszyny
- [ ] Nagraj jedno przezbrojenie za zgodą zespołu i opracuj listę elementów
- [ ] Oznacz każdy element jako wewnętrzny lub zewnętrzny i wprowadź listę kontrolną przed przezbrojeniem
- [ ] Oblicz bieżący EPEI i wynikające z niego wielkości partii
- [ ] Umieść czas przezbrojenia na tablicy na hali z celem i kolumną z przyczyną
- [ ] Sprawdź, czy centrum NIST MEP w Twoim stanie oferuje warsztat szybkiego przezbrojenia [18][31]

---

## Dalsza lektura na m365.fm

**Przewodniki w tej ścieżce edukacyjnej**
- [Lean Manufacturing: Principles, Tools, Implementation, and Limits](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [5S and Visual Management](https://www.m365.fm/en/learn/5s-visual-management/)
- [Total Productive Maintenance (TPM) and OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP and Production Planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/)

**Artykuły pogłębione**
- [Kaizen and kaizen events](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)
- [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/)
- [PDCA cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/)
- [Standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Paperless manufacturing and digital work instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Lot sizing: EOQ and EPQ](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Manufacturing inventory management](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Manufacturing simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Manufacturing workforce skills and TWI](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Terminy glosariusza (encje)**
[SMED](https://www.m365.fm/entity/smed/) · [Czas przezbrojenia](https://www.m365.fm/entity/setup-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Standardowa praca](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [5S](https://www.m365.fm/entity/5s/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/) · [TPM](https://www.m365.fm/entity/total-productive-maintenance/) · [Mapowanie strumienia wartości](https://www.m365.fm/entity/value-stream-mapping/) · [Zarządzanie Lean](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** jest gospodarzem m365.fm i pracuje w iFAKT GmbH. Na m365.fm pisze o produkcji typu lean, doskonaleniu operacyjnym i cyfrowej transformacji produkcji, koncentrując się na tym, jak modele strumienia wartości, symulacja i analiza wskaźników KPI pomagają zakładom wdrażać metody takie jak SMED.

**Uwaga: Autor pracuje w iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Regulatory texts and LEI definitions were opened and checked on that date; vendor pages are cited for vendor guidance and labeled as such in the text.

1. Single Minute Exchange of Die. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
2. Changeover. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/changeover/
3. Every Product Every Interval (EPEx). Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/every-product-every-interval/
4. Overall Equipment Effectiveness. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
5. Single-minute exchange of die (history, Shingo's eight techniques, four stages, seven basic steps, setup time breakdown, OTED; citing Shingo 1985 and 1989). Wikipedia. https://en.wikipedia.org/wiki/Single-minute_exchange_of_die
6. Shigeo Shingo. Wikipedia. https://en.wikipedia.org/wiki/Shigeo_Shingo
7. Shingo, S. (translated by Dillon, A. P.): A Revolution in Manufacturing: The SMED System. Productivity Press, Cambridge, MA, 1985, 386 pp., ISBN 978-0-915299-03-4 (publisher page, Routledge: https://www.routledge.com/A-Revolution-in-Manufacturing-The-SMED-System-1st-Edition/Shingo/p/book/9780915299034; book text not consulted directly).
8. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147 (verbatim text cross-checked at https://www.law.cornell.edu/cfr/text/29/1910.147)
9. Lockout/Tagout eTool: Minor servicing exception (relationship to Subpart O). OSHA. https://www.osha.gov/etools/lockout-tagout/hot-topics/relationship-subpart-o/minor-servicing-exception
10. 29 CFR 1910.217, Mechanical power presses, paragraph (d)(9) Diesetting. OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.217
11. 21 CFR 211.130, Packaging and labeling operations, paragraph (e). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/211.130
12. McIntosh, R. I. et al.: A critical evaluation of Shingo's "SMED" (Single Minute Exchange of Die) methodology. International Journal of Production Research, Vol. 38, No. 11 (2000), pp. 2377–2395. Record: https://acnpsearch.tweb-dev.unibo.it/singlejournalindex/73565535 (DOI not confirmed online)
13. McIntosh, R.; Culley, S.; Gest, G.; Mileham, T.; Owen, G.: An assessment of the role of design in the improvement of changeover performance. International Journal of Operations & Production Management, Vol. 16, No. 9 (1996), pp. 5–22. https://doi.org/10.1108/01443579610125552
14. da Silva, I. B.; Godinho Filho, M.: Single-minute exchange of die (SMED): a state-of-the-art literature review. International Journal of Advanced Manufacturing Technology, Vol. 102 (2019), pp. 4289–4307. https://doi.org/10.1007/s00170-019-03484-w
15. Braglia, M.; Di Paco, F.; Frosolini, M.; Marrazzini, L.: Quick changeover design: a new Lean methodology to support the design of machines in terms of rapid changeover capability. Journal of Manufacturing Technology Management, Vol. 34, No. 9 (2023), pp. 84–114. https://doi.org/10.1108/JMTM-12-2022-0430
16. Cakmakci, M.: Process improvement: performance analysis of the setup time reduction-SMED in the automobile industry. International Journal of Advanced Manufacturing Technology, Vol. 41, No. 1 (2009), pp. 168–179. https://doi.org/10.1007/s00170-008-1434-4
17. Success Story: Improvement Effort Reduces Changeover Time (Brighton NC Machine Corporation, Michigan Manufacturing Technology Center), April 6, 2018. NIST Manufacturing Innovation Blog. https://www.nist.gov/blogs/manufacturing-innovation-blog/success-story-improvement-effort-reduces-changeover-time
18. Quick Changeover (April 16, 2024). WMEP Manufacturing Solutions (Wisconsin), part of the MEP National Network. https://wmep.org/quick-changeover/
19. SMED (Single-Minute Exchange of Die). leanproduction.com (vendor-operated knowledge page). https://leanproduction.com/smed
20. Single-Minute Exchange of Die (SMED). Vorne Industries (vendor). https://www.vorne.com/tools/single-minute-exchange-of-die.htm
21. How to Reduce Changeover Time. MachineMetrics (vendor). https://www.machinemetrics.com/blog/changeover-time
22. How to Reduce Changeover Time in Manufacturing: A Practical Playbook for Maintenance and Operations. MaintainX (vendor). https://www.getmaintainx.com/blog/how-to-reduce-changeover-time-in-manufacturing
23. How To Reduce Changeover Time in Manufacturing. Tulip Interfaces (vendor). https://tulip.co/blog/reduce-changeover-time-in-manufacturing/
24. How to Reduce Changeover Time with Connected Workforce Software. L2L (vendor). https://l2l.com/blog/reduce-changeover-time
25. Heijunka. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/
26. Standardized Work. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/standardized-work/
27. 5S. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/five-s/
28. Poka-Yoke. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/poka-yoke/
29. Total Productive Maintenance. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/total-productive-maintenance/
30. About the Shingo Institute. Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/about-the-shingo-institute/
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep
32. Ergonomics. OSHA. https://www.osha.gov/ergonomics
33. Training Within Industry. Wikipedia. https://en.wikipedia.org/wiki/Training_Within_Industry
34. Kanban. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/
35. Value-Stream Mapping. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/value-stream-mapping/
36. Chapter 5: Single Minute Exchange of Die (SMED). In: Statistical Process Control and Lean Manufacturing (open textbook, Creative Commons). PALNI Pressbooks. https://pressbooks.palni.org/spcleanmanufacturing/?p=35
37. 21 CFR 117.135, Preventive controls, paragraph (c)(2) Food allergen controls. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/117.135
38. Total absorption costing. Wikipedia. https://en.wikipedia.org/wiki/Total_absorption_costing
39. Economic order quantity. Wikipedia (formula Q* = √(2DK/h); Harris 1913). https://en.wikipedia.org/wiki/Economic_order_quantity (accessed November 20, 2026)
40. Handbook: Inventory (2025), sections on ASC 330-10-30-1, 30-3, 30-6 to 30-8. KPMG LLP. https://kpmg.com/kpmg-us/content/dam/kpmg/frv/pdf/2025/inventory.pdf (accessed November 20, 2026)
