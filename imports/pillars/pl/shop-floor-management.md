# SEO metadata

| Field | Value |
|---|---|
| Meta title | Shopfloor-Management & Gemba-Walks: Ein praktischer Leitfaden |
| Meta description | Shopfloor-Management erklärt: Tier-Meetings, SQDCP-Boards, KPIs, eine Checkliste für Gemba-Walks, einen Einführungsfahrplan und ein digitales Board in Microsoft 365. |
| Slug | `shop-floor-management` |

# Shopfloor-Management und Gemba-Walks: Der komplette Leitfaden für die Führung dort, wo die Arbeit stattfindet

*Ostatnia aktualizacja: 20 listopada 2026 r. · Szczegóły dotyczące Microsoft zweryfikowano w Microsoft Learn na dzień tej aktualizacji*

> **Krótka odpowiedź:** Zarządzanie na hali produkcyjnej (zapisywane też jako shopfloor management, często nazywane systemem codziennego zarządzania lub zarządzaniem wielopoziomowym) to system przywództwa, w którym kierownicy prowadzą działalność tam, gdzie faktycznie powstaje wartość: na hali produkcyjnej, w magazynie lub w laboratorium. Łączy obecność liderów w gemba (w „prawdziwym miejscu”), wizualne wskaźniki KPI na tablicy na hali, krótkie codzienne spotkania zespołów, które przekazują problemy w górę organizacji, oraz ustrukturyzowane rozwiązywanie problemów, dzięki czemu odchylenia są wychwytywane każdego dnia i usuwane na stałe. Spacer gemba jest rdzeniem rutyny przywódczej.

Niemal każdy producent ma gdzieś tablicę z liczbami. Peter Gelbrich, cytowany za niemieckim instytutem szkoleniowym CETPM, szacuje na podstawie wizyt w zakładach, że około 80 procent firm produkcyjnych stosuje jakieś wizualne narzędzie zarządzania halą [3]. Prawdziwe pytanie nie brzmi więc, czy masz tablicę, lecz czy ona działa. Czy odchylenia są rozwiązywane w ciągu godzin, a nie tygodni? Czy liderzy pojawiają się w gemba z pytaniami, a nie z gotowymi odpowiedziami? I czy problemy, których zespół nie potrafi rozwiązać, w tym samym dniu niezawodnie trafiają na wyższy poziom?

Ten przewodnik wyjaśnia pochodzenie i zasady, szczegółowo opisuje każdy element oraz zawiera macierz spotkań zespołów, układ tablicy, przewodnik po spacerze gemba z listą kontrolną, standardową pracę liderów, plan wdrożenia z mapą drogową oraz architekturę referencyjną cyfrowej tablicy na hali zbudowanej przy użyciu Microsoft Teams, Power BI, Power Apps i Microsoft Fabric. Wiele badań nad zarządzaniem na hali pochodzi z Niemiec, gdzie termin „Shopfloor Management” jest standardowym słownictwem w zakładach; ten przewodnik korzysta z tych źródeł tam, gdzie dodają wartości, i wyjaśnia kontekst dla czytelników z USA. Zwięzła definicja jest także dostępna na stronie encyklopedycznej [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Kluczowe wnioski

- Zarządzanie na hali produkcyjnej to system przywództwa, a nie tablica i nie oprogramowanie. Składa się z liderów obecnych na hali, wizualnego zarządzania, kilku wskaźników KPI, stałego rytmu spotkań, rozwiązywania problemów i standardów.
- Spotkania zespołów na poziomie podstawowym trwają od 10 do 15 minut i są przesunięte w czasie tak, aby problem z pierwszej zmiany trafił do kierownika zakładu tego samego dnia.
- Tablica powinna zawierać cztery do sześciu wskaźników KPI, na które zespół rzeczywiście może wpływać, zwykle uporządkowanych według SQDCP (bezpieczeństwo, jakość, dostawy, koszt, ludzie).
- Spacer gemba jest centralną rutyną przywódczą: ma temat, opiera się na obserwacji i pytaniach otwartych i zawsze kończy się działaniami kontrolnymi.
- Działanie zamyka się dopiero wtedy, gdy jego efekt widać we wskaźniku KPI, a standard został zaktualizowany.
- Najpierw rutyna, potem cyfryzacja. Cyfrowa tablica w Microsoft 365 to zestaw narzędzi; licencje, interwały odświeżania, projekt danych oraz zasady monitorowania pracowników determinują nakład pracy.

### Ścieżki czytania dla zapracowanych

| Jesteś … | Przeczytaj najpierw |
|---|---|
| Liderem zespołu, nadzorcą lub kierownikiem zmiany | Sekcja 5 (spotkania zespołów), 6 (tablica), 9 (spacer gemba), 10 (standardowa praca lidera) |
| Kierownikiem zakładu lub wiceprezesem ds. operacji | Sekcja 3 (korzyści), 13 (kultura i zasady monitorowania pracowników), 14 (wdrożenie), 15 (typowe błędy) |
| Administratorem Microsoft 365 lub Azure | Sekcja 16 (analogowo czy cyfrowo), 17 (Microsoft 365 wraz z planem budowy), 18 (integracja danych) |
| Coachem Lean, menedżerem CI lub kierownikiem projektu | Sekcja 4 (elementy), 8 (rozwiązywanie problemów), 14 (mapa drogowa z kontrolą dojrzałości) |

## Spis treści

1. [Czym jest zarządzanie na hali produkcyjnej? Definicja i zakres](#czym-jest-zarządzanie-na-hali-produkcyjnej-definicja-i-zakres)
2. [Geneza: gemba, genchi genbutsu i Toyota Production System](#początki-gemba-genchi-genbutsu-i-toyota-production-system)
3. [Cele i korzyści](#cele-i-korzyści)
4. [Sześć elementów zarządzania na hali produkcyjnej](#sześć-elementów-zarządzania-na-hali-produkcyjnej)
5. [Spotkania wielopoziomowe: codzienna kaskada](#spotkania-wielopoziomowe-codzienna-kaskada)
6. [Tablica na hali: struktura, pola i przykładowy układ](#tablica-na-hali-struktura-pola-i-przykładowy-układ)
7. [KPI na hali: wybór sprawdzających się wskaźników SQDCP](#wskaźniki-kpi-na-hali-produkcyjnej-dobór-metryk-sqdcp-które-działają)
8. [Rozwiązywanie problemów na hali: od zabezpieczenia do standardu](#rozwiązywanie-problemów-na-hali-produkcyjnej-od-zabezpieczenia-do-standardu)
9. [Obchód gemba: kroki, pytania i lista kontrolna](#gemba-walk-kroki-pytania-i-lista-kontrolna)
10. [Standardowa praca lidera: przywództwo jako rutyna](#standard-pracy-kierownika-przywództwo-jako-rutyna)
11. [Andon: uwidocznienie odchyleń w czasie rzeczywistym](#andon-uwidacznianie-odchyleń-w-czasie-rzeczywistym)
12. [Role i odpowiedzialności](#role-i-odpowiedzialności)
13. [Kultura, bezpieczeństwo psychologiczne i zasady monitorowania pracowników](#kultura-bezpieczeństwo-psychologiczne-i-zasady-monitorowania-pracowników)
14. [Jak wdrożyć zarządzanie na hali: sześcioetapowa mapa drogowa](#jak-wdrożyć-zarządzanie-na-hali-produkcyjnej-sześciofazowa-mapa-drogowa)
15. [Typowe błędy i sposoby ich naprawy](#häufige-fehler-und-wie-sie-sie-beheben)
16. [Analogowo czy cyfrowo? Porównanie cyfrowego zarządzania na hali](#analogowo-czy-cyfrowo-porównanie-cyfrowego-zarządzania-na-hali-produkcyjnej)
17. [Budowa cyfrowej tablicy na hali z Microsoft 365](#budowa-cyfrowej-tablicy-na-hali-produkcyjnej-z-użyciem-microsoft-365)
18. [Integracja danych: MES, ERP i dane z maszyn](#datenintegration-mes-erp-und-maschinendaten)
19. [Wsparcie oprogramowania: przykład iFAKT Polaris](#wsparcie-oprogramowania-przykład-ifakt-polaris)
20. [Słownik pojęć](#słownik-pojęć)
21. [FAQ: zarządzanie na hali i obchody gemba](#faq-zarządzanie-na-hali-produkcyjnej-i-chodzenie-po-gemba)
22. [Podsumowanie](#podsumowanie)

## Czym jest zarządzanie na hali produkcyjnej? Definicja i zakres

Termin łączy „shop floor” (obszar produkcyjny, szerzej miejsce, w którym powstaje wartość) i „management” (zarządzanie). W zakładach w USA ta sama praktyka funkcjonuje pod innymi nazwami: codzienny system zarządzania, odpowiedzialność wielopoziomowa, spotkania tierowe lub tablice huddle. Idea jest jednak taka sama.

Niemiecki Instytut Badań nad Pracą Przemysłową (ifaa, instytut badawczy w dziedzinie inżynierii przemysłowej i ergonomii) opisuje zarządzanie na hali jako kierowanie w miejscu powstawania wartości, łączenie planowania, kontroli, doskonalenia i wykonania na hali tak, aby wykorzystać wiedzę „ekspertów na miejscu” [2]. Niemieckie Stowarzyszenie Naukowe Technologii Produkcji (WGP) określa je jako zintegrowany system zarządzania służący systematycznemu rozwojowi procesów i pracowników na hali [4]. Remco Peters, którego książka z 2009 roku jest standardowym źródłem w krajach niemieckojęzycznych, podkreśla, że zarządzanie na hali to „nie tylko narzędzie kontrolingu, lecz całościowy instrument przywództwa” [1][6].

Z tych definicji wynikają trzy cechy, które odróżniają prawdziwe zarządzanie na hali od ściany wskaźników KPI:

1. **Miejsce:** Przywództwo odbywa się tam, gdzie powstaje wartość, a nie w sali konferencyjnej.
2. **Rytm:** Komunikacja jest zaplanowana, krótka i ustandaryzowana. Przebiega według stałej kaskady przez poziomy organizacji.
3. **Efekt:** Każde odchylenie prowadzi do działania z wyznaczonym właścicielem i terminem, a efekt jest sprawdzany.

### Czym zarządzanie na hali nie jest

W praktyce zarządzanie na hali bywa mylone z pokrewnymi pojęciami. Zwłaszcza w USA termin „shop floor management” używany jest przez dostawców systemów ERP i harmonogramowania na oznaczenie kontroli hali: zwalniania, sekwencjonowania i śledzenia zleceń produkcyjnych. Poniższa tabela rozdziela te pojęcia.

| Termin | Czego dotyczy | Relacja do zarządzania na hali produkcyjnej |
|---|---|---|
| Sterowanie produkcją / kontrola produkcji | Kolejność zleceń, zwalnianie zleceń, bilansowanie zdolności produkcyjnych, śledzenie zleceń pracy | Podzadanie; zarządzanie na hali wykorzystuje jego wyniki, ale samo jest systemem przywództwa |
| MES (system realizacji produkcji) | System IT do rejestrowania i sterowania produkcją | Źródło danych i narzędzie, a nie sam system przywództwa |
| Zarządzanie wizualne | Uwidacznianie statusu i odchyleń | Element zarządzania na hali produkcyjnej |
| Chodzenie po gemba | Lider udaje się tam, gdzie wykonywana jest praca, obserwuje i zadaje pytania | Element i rutyna przywódcza w ramach zarządzania na hali produkcyjnej |
| Ciągłe doskonalenie / kaizen | Doskonalenie w małych, stale powtarzanych krokach | Wynik i siła napędowa; zarządzanie na hali zapewnia codzienną platformę |
| Produkcja szczupła (lean manufacturing) | Ogólna filozofia eliminowania marnotrawstwa | Szersze ramy; zarządzanie na hali jest jej codziennym systemem przywództwa |

Szersze ramy opisuje strona encji [Lean management](https://www.m365.fm/entity/lean-management/) oraz kompendium m365.fm [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/). W Niemczech te ramy są często nazywane „ganzheitliches Produktionssystem” (całościowy system produkcyjny). Seria wytycznych VDI 2870 Stowarzyszenia Inżynierów Niemieckich (VDI) opisuje jego podstawy (część 1, lipiec 2012) oraz katalog metod (część 2, luty 2013). VDI uznało obie części za częściowo wymagające aktualizacji, a nowe wydanie części 2 jest w przygotowaniu [27].

### Hala produkcyjna, biuro i inne obszary

Zarządzanie na hali produkcyjnej powstało w produkcji, ale przenosi się na każdy obszar z powtarzalną pracą i mierzalnym wynikiem: logistykę, utrzymanie ruchu, laboratoria, oddziały szpitalne, obsługę klienta, inżynierię. Dla obszarów pośrednich utrwalił się termin „zarządzanie na piętrze biurowym” (office floor management) [3]. Zasady pozostają te same, zmieniają się wskaźniki KPI. Zamiast wydajności i braków tablica pokazuje np. czas realizacji spraw, terminowe wydanie rysunków lub zaległości zgłoszeń.

## Początki: gemba, genchi genbutsu i Toyota Production System

### Gemba: „prawdziwe miejsce”

„Gemba” (czasem pisane „genba”) to japońskie określenie „rzeczywistego miejsca”. W lean oznacza miejsce, w którym faktycznie wykonywana jest praca tworząca wartość, zwykle halę produkcyjną [7][8]. Blisko z nim związane jest **genchi genbutsu**, mniej więcej „rzeczywiste miejsce, rzeczywista rzecz”. Słownik Lean Lexicon Lean Enterprise Institute (LEI) definiuje je jako udanie się do źródła, by samemu sprawdzić fakty [8]. Michael Ballé z LEI rozróżnia to tak: gemba to miejsce, genchi genbutsu to działanie [8].

Jak centralna jest ta zasada dla Toyoty, widać w „The Toyota Way 2001”. W kwietniu 2001 roku Toyota przedstawiła dwa filary (ciągłe doskonalenie i szacunek dla ludzi) oraz pięć kluczowych wartości. Obok wyzwania, kaizen, szacunku i pracy zespołowej genchi genbutsu jest wprost jedną z nich, tłumaczoną jako „idź do źródła, aby znaleźć fakty” [9].

### Taiichi Ohno i kredowe koło

Taiichi Ohno (1912–1990) uważany jest za architekta Toyota Production System; jego książka „Toyota Production System: Beyond Large-Scale Production” ukazała się po angielsku nakładem Productivity Press w 1988 roku [13]. Z jego osobą wiąże się znana historia: miał ustawiać nowych inżynierów wewnątrz koła narysowanego kredą na hali i kazać im godzinami obserwować, aż naprawdę zobaczą problemy w procesie. Opowieść może być upiększona [12], ale oddaje istotę: zrozumienie bierze się z obserwacji na miejscu, a nie z raportów.

### Masaaki Imai i „Gemba Kaizen”

Masaaki Imai spopularyzował ten termin na Zachodzie książką „Gemba Kaizen: A Commonsense, Low-Cost Approach to Management” (McGraw-Hill, 1997) [10]. Z nią związane „złote zasady zarządzania gemba” brzmią w streszczeniu Kaizen Institute następująco [11]:

1. Gdy pojawia się problem, najpierw idź do gemba.
2. Sprawdź gembutsu (maszynę, narzędzie, materiał, wadliwą część).
3. Podejmij tymczasowe działania zaradcze na miejscu.
4. Znajdź przyczynę źródłową.
5. Ustandaryzuj, aby zapobiec powtórzeniu.

Te pięć kroków nadal stanowi schemat rozwiązywania problemów w zarządzaniu na hali produkcyjnej (zob. rozdział 8).

### Suzaki i upowszechnienie terminu

Kiyoshi Suzaki jest uznawany za pioniera pojęcia „shop floor management" dzięki swojej książce „The New Shop Floor Management: Empowering People for Continuous Improvement" (Free Press, 1993) [5]. Niemiecki instytut szkoleniowy CETPM przytacza słowa Constantina Maya, który nazywa Suzakiego „ojcem shop floor management" [3]. Suzaki do przywództwa na miejscu w hali produkcyjnej dodał dobrą komunikację między kierownikami a pracownikami, zrozumienie klienta w całej firmie, zdolność do uczenia się oraz wymóg najwyższej jakości [1]. W krajach niemieckojęzycznych dyskusję kształtowali Remco Peters (2009) [6] oraz prace prowadzone na Politechnice w Darmstadt (w tym Hertle i in. o rozwoju kompetencji w shop floor management [26]). W USA te same praktyki rozpowszechniały się głównie pod nazwami lean management system, daily management i leader standard work, zwłaszcza dzięki książce Davida Manna „Creating a Lean Culture" [19].

### Jak powszechne jest to dziś?

Według badania z 2018 roku, na które powołuje się WGP, około 82,5 procent uczestniczących firm wdrożyło shop floor management, co oznacza wzrost o około 20 procent w porównaniu z sytuacją sprzed trzech lat. Stosowano go głównie w produkcji i obszarach z nią powiązanych, ale nie na wszystkich poziomach hierarchii [4]. WGP nie podaje nazwy tego badania, dlatego nie można sprawdzić próby ani metody. Wynik wskazuje na podstawowy problem w wielu zakładach, o którym mowa w rozdziale 5: tablica na poziomie zespołu bez działającej kaskady powyżej ma niewielki wpływ. Porównywalnych reprezentatywnych danych dla USA nie udało się znaleźć w badaniach wykorzystanych w tym artykule.

## Cele i korzyści

Shop floor management realizuje pięć wzajemnie zależnych celów:

| Cel | Co faktycznie się dzieje | Mierzone przez |
|---|---|---|
| Przejrzystość | Cel i wynik rzeczywisty są widoczne dla wszystkich na pierwszy rzut oka | Aktualność tablicy, udział wskaźników KPI z określonym celem |
| Szybka reakcja | Odchylenia są wykrywane i obsługiwane w ramach jednej zmiany | Czas od odchylenia do działania, czas eskalacji |
| Trwałe rozwiązywanie problemów | Usuwane są przyczyny źródłowe, a nie objawy | Wskaźnik powtarzalności tej samej wady |
| Zaangażowanie pracowników | Wiedza osób wykonujących pracę trafia do podejmowania decyzji | Liczba wdrożonych pomysłów, udział w krótkich spotkaniach zespołu |
| Rozwój kadry kierowniczej | Liderzy przechodzą od gaszenia pożarów do roli coacha | Udział wykonanego leader standard work, częstotliwość chodzenia po gemba |

### Jakie są dowody?

Solidne, niezależne dane o korzyściach z shop floor management są rzadkie, ponieważ jego efekt trudno oddzielić od innych narzędzi lean. Udokumentowane przykłady są mimo to pouczające:

- **fischer (niemiecki producent elementów złącznych, fischerwerke):** Po dziewięciomiesięcznym projekcie liczba reklamacji spadła o 13 procent, a koszty procesów o 9 procent; liczba dostaw wzrosła o 11 procent przy tej samej obsadzie i terminowo [3].
- **Schinko (austriacki producent obudów z blachy):** Po wdrożeniu cyfrowego shop floor management wydajność w cięciu wzrosła o 20 procent; w gięciu, gdzie system był nowszy, wzrost w chwili powstania raportu wynosił 10 procent. Artykuł napisał szef marketingu dostawcy oprogramowania GFT i należy go czytać z tym na uwadze [42].
- **Badania nad cyfrowym shop floor management:** Studium Instytutu Nauk o Produkcji wbk przy Karlsruher Institut für Technologie (KIT) oraz instytutu IPRI w projekcie ShopfloorPulse wskazuje, że niemal rzeczywiste informacje cyfrowe mogą „znacząco" skrócić czas do usunięcia usterki, podczas gdy analogowe śledzenie działań zależy od dyscypliny poszczególnych osób [24][25]. Badanie opiera się na 18 firmach, jest więc jakościową migawką, a nie reprezentatywnym sondażem.

Wiele stron dostawców w google.com podaje znacznie większe zyski (na przykład 25 do 35 procent wyższej wydajności) bez wskazania źródła. Niniejszy przewodnik nie powtarza takich liczb. Trzeźwy wniosek: shop floor management nie jest narzędziem z gwarantowanym zwrotem z inwestycji, lecz systemem przywództwa, którego efekt zależy od tego, jak konsekwentnie jest prowadzony. Kolejne rozdziały pokazują, od czego ta konsekwencja zależy.

## Sześć elementów zarządzania na hali produkcyjnej

Literatura ujmuje zarządzanie na hali produkcyjnej na różne sposoby. ifaa wyróżnia cztery widoczne elementy składowe (zarządzanie wizualne, KPI, standardową komunikację, systematyczne rozwiązywanie problemów) oraz trzy „niewidoczne” fundamenty (zasady pracy, zrozumienie ról, trwałość) [2]. Peters wskazał cztery podstawowe elementy: przywództwo na miejscu, rozpoznawanie odchyleń, trwałe rozwiązywanie problemów oraz optymalne wykorzystanie zasobów [1]. WGP wskazuje stabilność i standaryzację jako warunki wstępne oraz zarządzanie wynikami, rozwiązywanie problemów i zarządzanie usprawnieniami, przywództwo na miejscu, zarządzanie wizualne oraz rozwój kompetencji jako elementy zarządzania [4]. Wiele amerykańskich stron wymienia zazwyczaj pięć „filarów” o podobnej treści.

Poniższy model łączy te ujęcia i sprawdził się w praktyce:

| Element | Kluczowe pytanie | Główne narzędzia |
|---|---|---|
| 1. Kierownicy obecni na hali | Czy kierownicy sami widzą rzeczywistość? | Gemba walk, standardowa praca kierownika |
| 2. Zarządzanie wizualne | Czy każdy w ciągu kilku sekund widzi, czy wszystko przebiega zgodnie z planem? | Tablica na hali, andon, 5S, lampki statusu |
| 3. KPI | Czy mierzymy to, na co zespół może mieć wpływ? | SQDCP, OEE, wydajność za pierwszym razem (first pass yield) |
| 4. Rytm spotkań (komunikacja wielopoziomowa) | Czy informacje płyną niezawodnie w górę i w dół każdego dnia? | Spotkania poziomowe, zasady eskalacji |
| 5. Rozwiązywanie problemów | Czy przyczyny źródłowe są usuwane na stałe? | PDCA, 5 Whys, diagram Ishikawy (rybiej ości), A3 |
| 6. Standaryzacja | Czy to, czego się nauczyliśmy, jest utrwalone? | Standardowa praca, instrukcje stanowiskowe |

### Element 1: Kierownicy obecni na hali

LEI opisuje podejście gemba w następujący sposób: idziesz do gemba, aby zrozumieć pracę, prowadzić i uczyć się [15]. Fujio Cho, dawniej prezes, a później przewodniczący Toyoty, ujął postawę kierowników lean w trzech zasadach: „Idź i zobacz, pytaj dlaczego, okazuj szacunek” [15]. Obecność nie oznacza kontroli; oznacza bycie osiągalnym i zainteresowanym. Rozdział 9 szczegółowo opisuje, jak wygląda obecność w formie gemba walk.

### Element 2: Zarządzanie wizualne

LEI definiuje zarządzanie wizualne jako umieszczanie wszystkich narzędzi, części, działań produkcyjnych i wskaźników wyników „na widoku”, tak aby stan systemu mógł być zrozumiały na pierwszy rzut oka przez wszystkich zaangażowanych [20]. Zarządzanie wizualne to zatem znacznie więcej niż tablica: oznaczenia na podłodze, tablice cieni, karty kanban, lampki andon i lampy sygnalizacyjne na maszynach są jego częścią. [5S](https://www.m365.fm/entity/5s/) jest często fundamentem, ponieważ odchylenia wyróżniają się tylko w uporządkowanym otoczeniu. Więcej: [Visual management](https://www.m365.fm/entity/visual-management/).

### Element 3: KPI

KPI czynią odchylenia obiektywnymi. Muszą spełniać trzy kryteria: zespół może mieć na nie wpływ, są dostępne na czas i mają wyznaczony cel. Rozdział 7 opisuje, jak je wybierać. Podstawy znajdują się na stronie encji [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) oraz w kompendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Element 4: Rytm spotkań

Rytm spotkań (w źródłach niemieckich „Regelkommunikation”, czyli komunikacja standardowa) oznacza krótkie, zaplanowane i ustandaryzowane spotkania przy tablicy. Jego cechą wyróżniającą jest kaskada: informacje i problemy przepływają od poziomu zespołu przez poziom działu do poziomu zakładu, a wsparcie i decyzje płyną z powrotem [3][58]. Rozdział 5 zawiera kompletną macierz.

### Element 5: Rozwiązywanie problemów

Bez rozwiązywania problemów zarządzanie na hali zamienia się w sesję raportowania. Kluczowe jest oddzielenie szybkiego opanowania skutków od trwałego usunięcia przyczyny źródłowej. Rozdział 8 pokazuje drogę od czerwonej kropki na tablicy do zaktualizowanego standardu.

### Element 6: Standaryzacja

Standardy są jednocześnie warunkiem wstępnym i rezultatem. Bez standardu nie ma odchylenia, a bez aktualizacji standardu każde usprawnienie zostaje ponownie utracone. WGP wyraźnie wskazuje zatem stabilność i standaryzację jako warunki wstępne [4]. Więcej: [Standard work](https://www.m365.fm/entity/standard-work/).

## Spotkania wielopoziomowe: codzienna kaskada

> **W skrócie:** Każdy poziom spotyka się krótko przy swojej tablicy, rozwiązuje to, co może, a resztę przekazuje następnemu poziomowi tego samego dnia. Wymaga to stałych godzin spotkań, jasnych kryteriów eskalacji i obowiązku odpowiedzi.

Spotkania wielopoziomowe (zwane też tier meetings, tiered huddles, stand-upami lub codziennymi spotkaniami rozliczeniowymi) są kręgosłupem rytmu spotkań. Idea jest prosta: każdy poziom spotyka się na krótko, przegląda swoje KPI, rozwiązuje to, co potrafi, i eskaluje resztę do kolejnego poziomu, który spotyka się nieco później. Kaizen Institute opisuje typową strukturę w USA jako cztery poziomy: od zespołów produkcyjnych (poziom 1), przez brygadzistów (poziom 2) i kierowników działów (poziom 3), po kierownictwo zakładu (poziom 4), przy czym problemy są eskalowane tego samego dnia do wyznaczonego właściciela [58]. CETPM opisuje klasyczny rytm w niemieckich zakładach: codziennie lub na zmianę na poziomie zespołu, co tydzień na poziomie działu oraz co miesiąc lub kwartalnie na poziomie zakładu [3]. W wielu zakładach lean codzienne spotkanie jest obecnie równie powszechne na poziomach 2 i 3, tak aby problem z pierwszej zmiany trafił do kierownika zakładu już następnego ranka. Badanie ShopfloorPulse opisuje tę samą strukturę: spotkania kaskadowo wznoszą się od hali produkcyjnej w rytmie dziennym, tygodniowym lub miesięcznym [25]. Więcej o tym pojęciu na stronie hasła [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### Jak długie powinno być spotkanie wielopoziomowe?

Istnieją udokumentowane wartości orientacyjne. Gelbrich podaje około 10 do 12 minut na poziomie operacyjnym i 20 do 30 minut na poziomie kierowniczym; Orth podaje 10, maksymalnie 20 minut dla spotkań stand-up w obszarach pośrednich; Schwarz podaje maksymalnie 15 minut w swoim przykładzie praktycznym, zaznaczając jednak, że wczesne spotkania w fazie wdrożenia często trwają 30 minut lub dłużej [3]. Gelbrich zalicza zbyt długie spotkania, zwłaszcza w fazie wdrożenia, do dziesięciu najczęstszych przyczyn porażki zarządzania na hali produkcyjnej [3].

### Macierz spotkań wielopoziomowych (projekt przykładowy)

Poniższa macierz jest przykładowym projektem dla zakładu pracującego na zmiany, opartym na powszechnej praktyce. Częstotliwość i długość odpowiadają udokumentowanym wartościom orientacyjnym podanym powyżej; godziny i uczestnicy to sugestie do dostosowania do modelu zmianowego i struktury organizacyjnej.

| Cecha | Poziom 1: zespół | Poziom 2: obszar / brygadzista | Poziom 3: dział / kierownik produkcji | Poziom 4: zakład |
|---|---|---|---|---|
| Częstotliwość | każda zmiana, na początku zmiany | codziennie | codziennie (alternatywnie co tydzień) | codziennie lub co tydzień, plus miesięczny przegląd |
| Czas (przykład: pierwsza zmiana zaczyna się o 6:00) | 6:10 do 6:30, przesunięte w zależności od linii | 8:30 | 9:15 | 10:00 |
| Długość | 10 do 15 minut | 15 minut | 15 do 20 minut | 20 do 30 minut |
| Miejsce | tablica przy linii | tablica obszaru | tablica działu na hali | tablica zakładowa (pokój obeya lub hala) |
| Prowadzący | lider zespołu | brygadzista / lider zmiany | kierownik produkcji lub działu | kierownik zakładu |
| Uczestnicy | zespół danej linii lub gniazda | liderzy zespołów obszaru, utrzymanie ruchu i jakość w razie potrzeby | brygadziści, przedstawiciele jakości, utrzymania ruchu, logistyki, BHP (środowisko, zdrowie i bezpieczeństwo) | kierownicy działów, funkcje wspierające (jakość, łańcuch dostaw, zakupy, HR, finanse) |
| Horyzont czasowy | ostatnia zmiana, bieżąca zmiana | ostatnie 24 godziny, dzisiaj | wczoraj, dzisiaj, ten tydzień | tydzień, miesiąc, trend |
| Typowe KPI | zdarzenia BHP, cel sztuk na godzinę vs. wykonanie, złom, przestoje, frekwencja | wydajność, OEE wąskich gardeł, wydajność za pierwszym razem (FPY), zaległości | terminowość dostaw, koszt jakości, produktywność, otwarte eskalacje | widok SQDCP zakładu, reklamacje klientów, koszt, status projektów |
| Decyzje | obsada, działania zabezpieczające, pomysły | przesuwanie ludzi między liniami, priorytety utrzymania ruchu | zasoby między obszarami, dodatkowe zmiany, zespoły rozwiązywania problemów | wydatki inwestycyjne, priorytety, zmiany celów |
| Eskaluj wyżej, gdy | problemu nie da się rozwiązać w ramach zmiany lub brakuje zasobów | problem dotyczy kilku linii lub wymaga funkcji wspierającej | problem dotyczy klientów, budżetu lub kilku działów | sprawy korporacyjne, klienci, dostawcy |

**Druga i trzecia zmiana:** Poziom 1 działa na każdej zmianie; poziomy 2 do 4 zwykle tylko w ciągu dnia. Aby problemy z drugiej i trzeciej zmiany nie zginęły, lider zmiany wpisuje otwarte eskalacje na tablicę lub do dziennika zmiany i przekazuje je osobiście pierwszej zmianie. Poranne spotkanie poziomu 2 zaczyna się od tych punktów.

### Zasady eskalacji, które działają

Kaskada jest tylko tak dobra, jak jej zasady eskalacji. Sprawdziły się cztery zasady:

1. **Jasne wyzwalacze zamiast intuicji.** Dla każdego KPI zdefiniuj, kiedy eskalować, na przykład: „linia stoi dłużej niż 30 minut", „złom powyżej limitu przez dwie kolejne godziny", „wypadek lub zdarzenie bez skutków: zawsze".
2. **Harmonogram, który się zazębia.** Spotkanie wyższego szczebla odbywa się po niższym, tak aby eskalacje docierały tego samego dnia. Moderator niższego spotkania przekazuje eskalację osobiście lub przez tablicę.
3. **Obowiązek odpowiedzi.** Każda eskalacja otrzymuje odpowiedź, najpóźniej na kolejnym spotkaniu niższego szczebla. Milczenie to najszybszy sposób na zniszczenie kultury eskalacji.
4. **Bezpieczeństwo przede wszystkim.** Zagrożenia dla bezpieczeństwa eskaluje się natychmiast, niezależnie od kaskady.

CETPM opisuje wadliwe połączenie między szczeblami zarządzania na hali produkcyjnej jako typową przeszkodę [3]. Zgadza się to z badaniem KIT i IPRI: gdy działania są śledzone na papierze, eskalacja do wyższych szczebli się załamuje, a śledzenie działań „zależy od dyscypliny poszczególnych osób" [24].

### Standardowa agenda spotkania szczebla 1 (maksymalnie 15 minut)

Agenda wykorzystuje górną granicę 15 minut. Dobrze przećwiczone zespoły mieszczą się w 10–12 minutach, czyli w zakresie, który Gelbrich podaje dla szczebla operacyjnego [3].

| Minuta | Punkt | Pytanie przewodnie |
|---|---|---|
| 0–2 | Bezpieczeństwo | Czy są urazy, zdarzenia bez skutków lub niebezpieczne warunki? |
| 2–6 | KPI z wczoraj / z poprzedniej zmiany | Gdzie jesteśmy w czerwieni i dlaczego? |
| 6–9 | Plan na dziś | Jaki jest dzisiejszy cel? Czy są ograniczenia dotyczące ludzi, materiału, maszyn? |
| 9–12 | Działania | Które otwarte działania są do wykonania, co jest zrobione, w czym potrzebna pomoc? |
| 12–14 | Eskalacje | Co przekazujemy na szczebel 2? |
| 14–15 | Podsumowanie | Kto co i do kiedy robi? Czy są uznania za dobrą pracę? |

Ważne: spotkanie szczebla nazywa problemy, przydziela odpowiedzialnych i uzgadnia działania zabezpieczające. Analiza przyczyn źródłowych odbywa się później, w małej grupie, bezpośrednio przy maszynie.

## Tablica na hali: struktura, pola i przykładowy układ

> **W skrócie:** Dobra tablica jest czytelna z odległości około 3 m, pokazuje cztery do sześciu KPI z celami, podąża za agendą spotkania od lewej do prawej i łączy każde KPI w czerwieni z działaniem. Zespół prowadzi ją samodzielnie.

Tablica na hali (nazywana również tablicą huddle, tablicą szczebla, tablicą SQDCP lub tablicą wyników) jest centralnym narzędziem cyklu spotkań. ifaa opisuje jej zadania następująco: wizualizuje wybrane KPI obszaru, pokazuje działania doskonalące wraz ze statusem, tak aby można było śledzić ich wpływ na KPI, i zawiera bieżące informacje kontrolne, przede wszystkim o aktualnej sytuacji zleceń i zdolności produkcyjnych [2]. Jako przykładowe kategorie ifaa wymienia jakość, koszty, logistykę, bezpieczeństwo, personel, zdolności produkcyjne i sytuację zleceń oraz cele i działania (ciągłe doskonalenie); przykładowe KPI to First Pass Yield, wskaźniki ppm, OEE, terminowość dostaw, dane o wypadkach, status 5S i wskaźnik obecności [2].

### Zasady projektowania

- **Czytelność z około 3 m:** Statusy czerwony/zielony i duże liczby, bez tabel z 30 kolumnami.
- **Cztery do sześciu KPI:** CETPM zaleca około czterech do sześciu KPI, na które zespół może wpływać [3]; niemiecki ośrodek szkoleniowy Haufe Akademie podaje pięć do siedmiu jako górną granicę [43].
- **Cel obok wartości rzeczywistej:** Każde KPI ma cel i trend.
- **Opowiedz historię od lewej do prawej:** Tablica podąża za agendą spotkania, więc moderator po prostu przesuwa się od lewej do prawej.
- **Działania widoczne:** Każde KPI w czerwieni jest powiązane z działaniem lub kartą rozwiązywania problemu.
- **Zarządzana przez zespół:** Zespół sam prowadzi tablicę. Tablica wypełniana przez finanse lub IT, której nikt z zespołu nie rozumie, zostanie zignorowana.

### Przykładowy układ tablicy szczebla 1

Poniższy układ przedstawia tablicę dla linii montażowej z trzema wierszami i pięcioma kolumnami. Sprawdzi się na tablicy suchościeralnej (około 2 × 1,2 m) równie dobrze jak na ekranie.

| | Kolumna A: Bezpieczeństwo (S) | Kolumna B: Jakość (Q) | Kolumna C: Terminowość dostaw (D) | Kolumna D: Koszt / produktywność (C) | Kolumna E: Ludzie (P) |
|---|---|---|---|---|---|
| **Wiersz 1: stan na dziś** | Krzyż bezpieczeństwa (miesięczny kalendarz, każdy dzień zielony, żółty lub czerwony) | Złom i poprawki na zmianę w porównaniu z celem | Cel planu dziennego vs. wykonanie, zaległości | Cel jednostek na godzinę vs. wykonanie (wykres godzinowy) | Frekwencja, macierz umiejętności (kto co potrafi) |
| **Wiersz 2: trend** | Zdarzenia potencjalnie niebezpieczne z ostatnich 4 tygodni | Wydajność za pierwszym razem (FPY), 3 najczęstsze rodzaje wad (Pareto) | Dostawy na czas w tym tygodniu | OEE wąskiego gardła, 3 najczęstsze przyczyny przestojów, [micro stops](https://www.m365.fm/entity/micro-stops/) | Plan urlopów i szkoleń |
| **Wiersz 3: działania** | Otwarte działania w zakresie bezpieczeństwa | Arkusze rozwiązywania problemów / A3 w toku | Eskalacje do poziomu 2 i odpowiedzi na nie | Lista działań (co, kto, do kiedy, status) | Pomysły i sugestie wraz ze statusem |

Większość tablic ma też nagłówek z nazwą zespołu, celem obszaru i czasem ostatniej aktualizacji oraz pole „standardy i audyty” (na przykład wynik ostatniego audytu 5S). Uwaga dotycząca kolejności kolumn: niemiecki oryginał tego przewodnika używa skrótu SQCDP, który umieszcza koszt przed terminowością dostaw; zakłady w USA częściej piszą SQDCP. Kolejność C i D ma mniejsze znaczenie niż to, by bezpieczeństwo było na pierwszym miejscu.

### Zawartość tablicy według poziomów

Wraz z każdym poziomem tablica staje się bardziej zagregowana, a horyzont czasowy dłuższy. Dostawca MES Symestic opisuje to jako dwie zasady spójności: wskaźniki KPI są skondensowane i rzadziej przeglądane w miarę wspinania się w górę, ale na każdym poziomie muszą prowadzić do tych samych danych [41].

| Poziom | Szczegółowość | Typowy horyzont czasowy | Przykład jakości |
|---|---|---|---|
| Poziom 1 | stanowisko, godzina | zmiana | wady na godzinę na stanowisku 3 |
| Poziom 2 | linia, zmiana | dzień | wskaźnik złomu na linię |
| Poziom 3 | obszar, dzień | tydzień | wydajność za pierwszym razem i koszt jakości na obszar |
| Poziom 4 | zakład, tydzień | miesiąc | reklamacje klientów w ppm, koszt złej jakości |

## Wskaźniki KPI na hali produkcyjnej: dobór metryk SQDCP, które działają

Większość tablic stosuje ustaloną kolejność wymiarów. Najczęstsza to **SQDCP** (lub SQCDP): bezpieczeństwo, jakość, terminowość dostaw, koszt i ludzie [41]. Warianty to SQDC (bez P), SQDCM (M jak morale) lub SQDCE z środowiskiem. CETPM wymienia tematy bezpieczeństwa, jakości, kosztów, niezawodności dostaw i ludzi jako typowe wymiary [3]. Kolejność jest świadoma: bezpieczeństwo zawsze jest na pierwszym miejscu.

### Trzy pytania przewodnie przy doborze wskaźników

Gelbrich proponuje trzy pytania, z których można wyprowadzić odpowiednie wskaźniki KPI [3]:

1. Jak powinien wyglądać rezultat mojego procesu pod względem czasu i jakości?
2. Jak mogę pokazać skuteczność moich działań pod względem kosztów i zasobów?
3. Co odzwierciedla odpowiedzialne prowadzenie mojego procesu pod względem bezpieczeństwa i środowiska?

Jego główna zasada, sformułowana jako przekształcenie słynnego cytatu Druckera: to, na co zespół nie ma wpływu, nie powinno być mierzone na jego tablicy [3].

### Katalog wskaźników KPI dla tablicy na hali

| Wymiar | KPI | Definicja / obliczenie | Poziom |
|---|---|---|---|
| S | Dni od ostatniego zarejestrowanego urazu | dni kalendarzowe od ostatniego przypadku podlegającego rejestracji OSHA (zob. uwaga poniżej) | 1–4 |
| S | Całkowity wskaźnik rejestrowanych wypadków (TRIR) | liczba rejestrowanych urazów i chorób × 200 000 / łączna liczba przepracowanych godzin; 200 000 godzin to 100 pełnoetatowych pracowników w ciągu roku [51] | 3–4 |
| S | Zdarzenia potencjalnie niebezpieczne (zgłoszone) | zgłoszenia na tydzień (na początku więcej zgłoszeń jest dobrym znakiem) | 1–3 |
| Q | Wskaźnik złomu | ilość złomu / łączna ilość; zob. [scrap rate](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | Wydajność za pierwszym razem (FPY) | dobre części za pierwszym przejściem / rozpoczęte części | 1–3 |
| Q | Reklamacje klientów | liczba lub ppm | 3–4 |
| D | Jednostki cel vs. wykonanie | na godzinę lub na zmianę | 1–2 |
| D | Dostawy na czas | zamówienia dostarczone na czas / wszystkie zamówienia | 2–4 |
| D | Zaległości | otwarta ilość vs. plan | 1–3 |
| C | OEE | dostępność × wydajność × jakość [22] | 1–3 |
| C | Produktywność | dobre części na roboczogodzinę | 2–4 |
| C | Czas przezbrojenia | czas od ostatniej dobrej części do pierwszej dobrej części następnego zlecenia | 1–2 |
| P | Frekwencja / obsada | obecni / zaplanowani pracownicy | 1–2 |
| P | Poziom wielozadaniowości | udział zadań pokrytych w macierzy umiejętności | 1–2 |
| P | Wdrożone pomysły | wdrożone sugestie usprawnień miesięcznie | 1–3 |

**Uwaga dotycząca wskaźników KPI bezpieczeństwa w zakładach w USA:** Liczniki „dni bez wypadku” są popularne, ale OSHA ostrzegała, że nagrody oparte na wskaźnikach (na przykład nagroda za miesiąc bez wypadku) mogą zniechęcać do zgłaszania zdarzeń. W memorandum OSHA z 11 października 2018 r. stwierdza się, że takie programy są dopuszczalne na podstawie 29 CFR 1904.35(b)(1)(iv) tylko wtedy, gdy nie są wdrażane w sposób zniechęcający do zgłaszania, oraz że sama polityka zakazu odwetu „może sama w sobie być niewystarczająca” [50]. OSHA zaleca proces zgłaszania wypadków, chorób, zdarzeń bez strat/prawie wypadków oraz zagrożeń, w tym opcję anonimową [49]. Dla zarządu oznacza to: pokazywać zdarzenia bez strat i zgłoszenia zagrożeń obok liczby wypadków i nigdy nie wiązać nagrody zespołu wyłącznie z czystym wynikiem bezpieczeństwa.

OEE (ogólna efektywność wyposażenia) wywodzi się z całkowitego utrzymania ruchu produktywnego (TPM); LEI wymienia sześć wielkich strat: awarie, przezbrojenia i regulacje, drobne postoje, zmniejszoną prędkość, braki i poprawki [22]. Na tablicy ważniejszy od samego wskaźnika OEE jest podział na rodzaje strat, ponieważ zespół może na jego podstawie wyprowadzić działania. Kompendium m365.fm [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) szczegółowo omawia te wskaźniki.

### Co pokazują badania dotyczące wskaźników KPI w zarządzaniu na hali produkcyjnej

W badaniu KIT i IPRI 94 procent ankietowanych firm śledziło wskaźniki jakości i produktywności w zarządzaniu na hali produkcyjnej, natomiast wskaźniki kosztowe były rzadko stosowane [24][25]. Wykorzystanie cyfrowych wskaźników KPI niemal w czasie rzeczywistym stanowiło wyjątek – nieco ponad 15 procent wzmianek – a prognozowanie odchyleń nie było praktykowane w żadnej z ankietowanych firm [24].

## Rozwiązywanie problemów na hali produkcyjnej: od zabezpieczenia do standardu

Czerwone pole na tablicy to dopiero początek, a nie koniec. Rozwiązywanie problemów w zarządzaniu na hali produkcyjnej przebiega według schematu wynikającego wprost z złotych zasad zarządzania gemba [11]:

| Krok | Co się dzieje | Kto | Kiedy |
|---|---|---|---|
| 1. Wykrycie | Odchylenie staje się widoczne na tablicy lub przez andon | zespół | natychmiast lub na spotkaniu zespołu |
| 2. Zabezpieczenie | Zabezpieczenie chroni klienta (np. kontrola 100 procent, kwarantanna, część zapasowa) | lider zespołu | w tej samej zmianie |
| 3. Zrozumienie | Sprawdzenie gembutsu na miejscu, zebranie danych, obserwacja procesu | mały zespół przy urządzeniu | po spotkaniu |
| 4. Znalezienie przyczyny źródłowej | 5 dlaczego, diagram Ishikawy, A3 dla złożonych problemów | zespół rozwiązywania problemów | od dni do tygodni |
| 5. Korekta | Wdrożenie trwałego działania zaradczego | właściciel wg listy działań | zgodnie z planem |
| 6. Weryfikacja skuteczności | Monitorowanie wskaźnika KPI przez określony okres | lider zespołu | po wdrożeniu |
| 7. Standaryzacja | Aktualizacja standardu, instrukcji stanowiskowej i szkolenia; udostępnienie na inne linie (yokoten) | nadzorca, właściciel procesu | po potwierdzeniu skuteczności |

Działanie uznaje się za zamknięte dopiero wtedy, gdy jego efekt widać we wskaźniku KPI. Zasada brzmi banalnie, ale wiele zakładów ją łamie: listy działań są raportowane jako „zielone”, podczas gdy wada wraca w następnym tygodniu.

### Jaka metoda do jakiego problemu?

| Typ problemu | Charakterystyka | Metoda | Potrzebny czas |
|---|---|---|---|
| Prosty, przyczyna oczywista | przyczyna i rozwiązanie są jasne na spotkaniu | bezpośrednie działanie z terminem | minuty |
| Powtarzalny, przyczyna niejasna | występuje wielokrotnie, zespół nie jest pewien przyczyny | 5 dlaczego, diagram Ishikawy | godziny |
| Złożony, międzyfunkcyjny | kilka przyczyn, kilka działów | rozwiązywanie problemów A3 oparte na PDCA | tygodnie |
| Systemowy, strategiczny | dotyczy strumienia wartości, układu, produktu | wydarzenie kaizen, mapowanie strumienia wartości | tygodnie do miesięcy |

A3 jest szczególnie wartościowe, ponieważ zestawia problem, stan obecny, analizę przyczyn źródłowych, stan docelowy, działania zaradcze i kontrolę skuteczności na jednej kartce A3 (297 × 420 mm, zbliżonej do formatu US tabloid 11 × 17 in., którego używa większość zakładów w USA). Strona encyklopedyczna [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) zawiera wprowadzenie, a kompendium [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) omawia poziom systemowy. Cykl PDCA (planuj, wykonaj, sprawdź, działaj), zwykle przypisywany W. Edwardsowi Demingowi (sam Deming przypisywał jego autorstwo Walterowi A. Shewhartowi), stanowi podstawę wszystkich procesów rozwiązywania problemów [1].

## Gemba walk: kroki, pytania i lista kontrolna

> **W skrócie:** Gemba walk ma temat, zaczyna się przy tablicy, obserwuje pracę przez kilka cykli, zadaje otwarte pytania i kończy się zobowiązującą informacją zwrotną dla zespołu. Bez tematu i kontynuacji to tylko spacer.

Gemba walk to najważniejsza rutyna przywódcza w zarządzaniu na hali produkcyjnej. Lean Lexicon definiuje ją jako „praktykę zarządczą, polegającą na poznaniu aktualnej sytuacji dzięki bezpośredniej obserwacji i pytaniom, zanim podejmie się działanie” [7]. Zwięzłe wprowadzenie znajduje się także we wpisie [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) oraz na stronie hasła [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Trzy rodzaje gemba walk

Jim Womack, założyciel LEI, mówi, że on i Dan Jones po raz pierwszy użyli terminu „gemba walk” na początku lat 90., pierwotnie dla menedżerów przechodzących przez cały strumień wartości produktu, obejmujący różne działy i firmy [14]. Dziś rozróżnia on dwie formy i wyodrębnia trzecie, obecnie powszechne zastosowanie tego terminu [14]:

| Typ | Cel | Typowa częstotliwość | Kto |
|---|---|---|---|
| Spacer po strumieniu wartości | budowanie świadomości potrzeby fundamentalnych usprawnień end-to-end | w miarę potrzeb, np. kwartalnie | kierownictwo zakładu i obszarów, wszystkie funkcje wzdłuż strumienia wartości |
| Spacer po systemie zarządzania | sprawdzenie, czy system zarządzania potrafi utrzymać stabilność (tablice, standardy, eskalacje) | od tygodniowo do codziennie | liderzy na wszystkich poziomach |
| Spacer skoncentrowany na problemie (genchi genbutsu) | dotarcie do sedna konkretnego problemu na miejscu | w miarę potrzeb | właściciele problemów, specjaliści |

Womack krytycznie odnosi się do trzeciego zastosowania i zbliża je do „zarządzania przez chodzenie” („management by walking around”): jeśli codzienne zarządzanie działa, problemy powinny być już rozwiązywane w kaskadzie, zamiast tego, by wyżsi menedżerowie i specjaliści ds. usprawnień biegli na gemba gasić pożary. Ich czas lepiej inwestować w spacery po strumieniu wartości i systemie zarządzania [14].

### Trzy pytania przewodnie LEI: cel, proces, ludzie

LEI zaleca strukturyzowanie gemba walk wokół trzech wymiarów [7]:

1. **Cel:** Jaki problem ten proces rozwiązuje dla klienta?
2. **Proces:** Jak praca faktycznie przebiega, w odróżnieniu od tego, jak opisuje ją standard?
3. **Ludzie:** Czy pracownicy są zaangażowani w tworzenie, utrzymywanie i doskonalenie procesu?

LEI zaleca też prześledzenie jednej rodziny produktów lub procesu obsługującego klienta od początku do końca i włączenie wszystkich zaangażowanych osób, ponieważ wartość przepływa poziomo, przez działy [7].

### Gemba walk a zarządzanie przez chodzenie

Gemba walk bywa utożsamiany z „zarządzaniem przez chodzenie” (MBWA, management by walking around). MBWA wywodzi się z Hewlett-Packard; współzałożyciel David Packard przejął tę praktykę z General Electric. Stała się znana dzięki książce „In Search of Excellence” Toma Petersa i Roberta Watermana (1982) [16]. Różnice są nadal znaczące:

| Cecha | Gemba walk | Zarządzanie przez chodzenie |
|---|---|---|
| Cel | zrozumienie procesu, wykrywanie odchyleń od standardu, budowanie zdolności rozwiązywania problemów | bliskość z pracownikami, nieformalna wymiana, wyczucie nastrojów |
| Struktura | temat, trasa, pytania przewodnie, kontynuacja | w większości nieustrukturyzowane i spontaniczne |
| Punkt odniesienia | standard, KPI, tablica | ludzie i rozmowa |
| Rezultat | konkretne obserwacje, coaching, działania | relacja, informacja |
| Oparcie w | standardowej pracy lidera, stałym rytmie | osobistym stylu przywództwa |

Obie formy nie wykluczają się: przypadkowa, nieformalna rozmowa nie zastępuje gemba walk, ale też jej nie szkodzi. Wpis [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) porównuje obie koncepcje szczegółowo.

### Jak przeprowadzić gemba walk w siedmiu krokach

**1. Ustal temat.** Każdy gemba walk ma swój cel, na przykład „przezbrojenie na linii 4”, „stosowanie nowej instrukcji kontroli” lub „skutki działań z odprawy poziomu 3”. Bez tematu spacer staje się wycieczką.

**2. Przygotuj się.** Przejrzyj KPI i tablicę obszaru, sprawdź otwarte działania, zabierz standard (instrukcję stanowiskową, kartę standardowej pracy). Poinformuj zespół wcześniej, aby wizyta nie była odbierana jako niespodziewana kontrola. We wpisie [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) znajdziesz wskazówki.

**3. Zacznij od tablicy.** Tablica pokazuje, co sam zespół uważa za problem. Zapytaj: „Co mówi wam dziś wasza tablica?"

**4. Obserwuj.** Zatrzymaj się przy jednym stanowisku i obserwuj kilka cykli. Porównuj to, co widzisz, ze standardem. Zapisuj fakty, nie interpretacje.

**5. Zadawaj pytania.** Otwarte, życzliwe pytania do osoby wykonującej pracę. Nie rozdawaj gotowych rozwiązań.

**6. Podsumuj i podziękuj.** Na koniec krótko przedstaw, czego się dowiedziałeś, i uzgodnij, co dalej stanie się z obserwacjami.

**7. Wróć do tematu.** Dokumentuj obserwacje, przekazuj działania na właściwe spotkanie zespołu poziomu, udzielaj zespołowi informacji zwrotnej. Spacer bez informacji zwrotnej podważa zaufanie.

**Nie zapominaj o drugiej i trzeciej zmianie.** W zakładzie pracującym na trzy zmiany kierownik, który chodzi tylko w czasie zmiany dziennej, widzi jedną trzecią działalności. Zaplanuj spacer także na zmianach popołudniowej i nocnej, przynajmniej od czasu do czasu; problemy z obsadą, wsparciem utrzymania ruchu i przekazywaniem zmian często ujawniają się tam najpierw (zalecenie praktyczne).

**Ile powinien trwać gemba walk?** Źródła, na których się opieramy, nie podają stałej wartości. W praktyce skupiony spacer systemu zarządzania w jednym obszarze trwa od 20 do 45 minut; przejście całego strumienia wartości dla rodziny produktów może zająć pół dnia. Przykładowy dzień w punkcie 10 zakłada 30 minut. Są to wartości praktyczne, a nie stwierdzenia źródeł.

### Bank pytań do gemba walk

**Cel i zamierzenia**
- Kto jest klientem tego procesu i czego potrzebuje?
- Jaki jest cel twojej zmiany na dziś i skąd wiesz, czy go osiągasz?
- Który KPI jest dla ciebie teraz najważniejszy i dlaczego?

**Proces i standard**
- Jak ten krok zwykle przebiega? Możesz mi to pokazać?
- Gdzie jest zapisany standard i czy zgadza się z rzeczywistością?
- Jak od razu poznajesz, że tutaj coś jest nie tak?
- Co się dzieje, gdy brakuje materiału albo maszyna staje?
- Gdzie czekasz, szukasz rzeczy albo musisz coś poprawiać?

**Problemy i rozwiązywanie problemów**
- Jaki był ostatni problem, który tu rozwiązałeś?
- Który problem kosztuje cię teraz najwięcej czasu?
- Co się dzieje, gdy zgłaszasz problem? Jak szybko przychodzi pomoc?
- Które działanie na tablicy jest przeterminowane i czego ono potrzebuje?

**Ludzie**
- Co utrudnia ci dobre wykonywanie pracy?
- Co byś zmienił, gdyby decyzja należała do ciebie?
- Kto poza tobą potrafi wykonać to zadanie?
- Jak ja mogę cię wesprzeć?

### Lista kontrolna gemba walk

Wydrukuj ją albo przenieś do formularza cyfrowego (zob. punkt 17). Dłuższa wersja z pytaniami dla poszczególnych ról znajduje się we wpisie [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] Temat i obszar są ustalone.
- [ ] KPI, status tablicy i otwarte działania zostały przejrzane wcześniej.
- [ ] Odpowiedni standard jest pod ręką (wydrukowany lub na tablecie).
- [ ] Zespół lub team leader został poinformowany.
- [ ] Przestrzegane są środki ochrony osobistej (PPE) i zasady bezpieczeństwa obowiązujące w obszarze.
- [ ] Co najmniej jedno stanowisko zostało zaobserwowane przez kilka cykli.
- [ ] Pytania były otwarte; nie dyktowano rozwiązań.
- [ ] Obserwacje zapisano jako fakty (miejsce, czas, co zaobserwowano).
- [ ] Dobra praktyka została doceniona.
- [ ] Uzgodnienia zostały podsumowane.
- [ ] Działania wpisano na listę działań lub na najbliższe spotkanie zespołu poziomu.
- [ ] Zaplanowano informację zwrotną dla zespołu.

### Typowe błędy w gemba walk

| Błąd | Dlaczego szkodzi | Lepiej |
|---|---|---|
| Gemba walk jako kontrola | ludzie ukrywają problemy | pytaj zamiast audytować; traktuj problemy jak dar |
| Dyktowanie rozwiązań na miejscu | zespół przestaje rozwiązywać problemy, a kierownik staje się wąskim gardłem | prowadź pytaniami, pozwól zespołowi wypracować rozwiązanie |
| Brak tematu i trasy | spacer pozostaje powierzchowny | ustal cel, weź ze sobą standard |
| Mówią tylko kierownicy | wiedza ekspertów pozostaje niewykorzystana | słuchaj przez 80 procent czasu |
| Brak kontynuacji | utrata zaufania, „i tak nic się nie dzieje" | informacja zwrotna w ciągu tygodnia |
| Nieregularne spacery | spacer wygląda jak wydarzenie specjalne | stały rytm w standardowej pracy kierownika |
| Szukanie winnych | strach, problemy są ukrywane | kwestionuj proces i system, nie ludzi |

Wiele z tych błędów ma wspólną przyczynę: spacer jest rozumiany jako kontrola. Wpis [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) wchodzi w to głębiej. Womack opisuje swoje podejście tak: „Nigdy niczego nie wynalazłem. Po prostu chodzę, komentuję to, co widzę, i dodaję ludziom odwagi, by spróbowali" (za przedmową Johna Shooka) [15].

## Standard pracy kierownika: przywództwo jako rutyna

Standard pracy kierownika stosuje zasadę standardowej pracy do przełożonych. LEI opisuje ją jako „kaizen dla zarządzania”: w połączeniu z właściwymi zachowaniami przywódczymi standard pracy kierownika przesuwa rolę menedżerów z bycia głównymi rozwiązywaczami problemów na budowanie zdolności rozwiązywania problemów u ich pracowników [18].

W książce „Creating a Lean Culture” David Mann wymienia cztery główne elementy systemu zarządzania lean: standard pracy kierownika, wizualne sterowanie, codzienny proces odpowiedzialności oraz dyscyplinę przywódczą [19]. Udział pracy ustandaryzowanej maleje wraz z każdym poziomem hierarchii: operatorzy mogą pracować według standardu przez 100 procent czasu, brygadzista przez około 80 procent dnia; na wyższych szczeblach udział ten spada dalej [19].

### Przykład: standard pracy kierownika produkcji

| Czas | Działanie | Dowód |
|---|---|---|
| 6:00–6:10 | Przekazanie zmiany, sprawdzenie tablic na wszystkich liniach | Podpisany dziennik przekazania |
| 6:10–6:30 | Udział w dwóch z przesuniętych spotkań poziomu 1 (rotacyjnie) | Lista obecności |
| 6:30–6:45 | Potwierdzenie procesu: sprawdzenie jednego standardu na jednej linii | Karta audytu |
| 6:45–8:15 | Obecność na hali: wsparcie przy awariach, usuwanie braków materiałowych i kadrowych, sprawdzanie tablic | Notatki, lista działań |
| 8:30–8:45 | Prowadzenie spotkania poziomu 2 | Tablica poziomu 2 |
| 8:45–9:00 | Przygotowanie eskalacji dla poziomu 3 | Lista eskalacji |
| 9:15–9:35 | Udział w spotkaniu poziomu 3 | Tablica poziomu 3 |
| 10:00–11:00 | Coaching zespołu rozwiązującego problem (A3) | Status A3 |
| 13:00–13:30 | Obchód gemba na wybrany temat | Notatki, działania |
| 13:30–14:00 | Przygotowanie przekazania zmiany | Dziennik przekazania |

Plan jest przykładem praktycznym, a nie wiążącym źródłem. Na zmianie od 6:00 do 14:00 ustrukturyzowuje on dobrze ponad dwie trzecie dnia; Mann opisuje około 80 procent jako osiągalne na tym poziomie [19]. Reszta celowo pozostaje otwarta na nieoczekiwane sytuacje, sprawy kadrowe i projekty. Sam standard pracy kierownika jest widoczny: wiele zakładów wywiesza rutynowe czynności przełożonych na tablicy i odhacza wykonane pozycje. Tworzy to odpowiedzialność w obie strony.

### Potwierdzenie procesu (warstwowy audyt procesu)

Kluczowym elementem standardu pracy kierownika jest potwierdzenie procesu: przełożeni na różnych szczeblach krótko i w stałym rytmie sprawdzają, czy standard jest przestrzegany i czy nadal odpowiada potrzebom. Kilka poziomów kontroluje te same procesy z różną częstotliwością, na przykład lider zespołu codziennie, brygadzista co tydzień, kierownik zakładu co miesiąc. W zakładach w USA, zwłaszcza w łańcuchach dostaw motoryzacji, praktyka ta zwykle nosi nazwę warstwowego audytu procesu (LPA). Odchylenia nie są karane; traktuje się je jako sygnał, że standard jest nieodpowiedni lub brakuje szkolenia.

## Andon: uwidacznianie odchyleń w czasie rzeczywistym

LEI definiuje andon jako narzędzie wizualnego zarządzania, które pokazuje status operacji w obszarze na pierwszy rzut oka i sygnalizuje każde wystąpienie anomalii [17]. Sygnał uruchamiany jest linką lub przyciskiem na stanowisku pracy albo automatycznie przez czujnik maszyny. W Toyocie linia nadal pracuje po pociągnięciu linki, a zespół próbuje usunąć problem; jeżeli w ciągu cyklu się to nie uda, linia zatrzymuje się w stałej pozycji na końcu stanowiska [17]. Zapalony numer stanowiska wzywa lidera zespołu, od którego oczekuje się szybkiej reakcji [17].

W zarządzaniu na hali produkcyjnej andon wypełnia lukę między zaplanowanymi spotkaniami: spotkanie tierowe analizuje wczoraj i planuje dzisiaj, andon obsługuje tu i teraz. W Toyocie lider zespołu (hancho) kieruje zespołem liczącym od pięciu do ośmiu osób, reaguje na zatrzymania linii i wezwania andon, prowadzi działania doskonalące i codziennie sprawdza przestrzeganie standardowej pracy za pomocą arkuszy audytowych [21]. Ma to znaczenie przy przenoszeniu modelu do zakładów zachodnich: lider zespołu w Toyocie jest pracownikiem godzinowym, nie ma uprawnień dyscyplinarnych i nie ma stałego miejsca na linii; opanował wszystkie zadania zespołu i zastępuje przy przerwach, nieobecnościach lub zaległościach [21]. Jeżeli dołożysz tę rolę do operatora prowadzącego, w pełni związanego z czasem taktu linii, nie uzyskasz szybkiej reakcji na andon. Podobnie jest w przypadku lidera zespołu odpowiedzialnego za 25 osób.

Zdarzenia andon należą na tablicę: liczba wezwań na zmianę, średni czas reakcji i najczęstsze przyczyny. Wiele wezwań nie jest na początku złym znakiem; pokazuje, że zespół uwidacznia problemy.

## Role i odpowiedzialności

| Rola | Zadania w zarządzaniu na hali produkcyjnej |
|---|---|
| Dyrektor zakładu | wzór do naśladowania, prowadzi tier 4, regularnie chodzi na gemba, decyduje o zasobach dla eskalacji, wdraża cele (np. poprzez hoshin kanri) |
| Kierownik działu / produkcji | prowadzi tier 3, coachuje brygadzistów, dba o powiązanie poziomów |
| Brygadzista / lider zmiany | prowadzi tier 2, potwierdzenie procesu, coachuje liderów zespołów |
| Lider zespołu | prowadzi tier 1, prowadzi tablicę wraz z zespołem, reaguje na andon, wdraża zabezpieczenie (containment) |
| Operatorzy i technicy | zgłaszają odchylenia, wnoszą pomysły, odpowiadają za działania, prowadzą części tablicy |
| Funkcje wspierające (jakość, utrzymanie ruchu, łańcuch dostaw, BHP i ochrona środowiska) | uczestniczą w tierach 2 i 3, przejmują eskalowane problemy, dostarczają dane |
| Coach na hali / specjalista lean lub CI | uczestniczy w spotkaniach, udziela informacji zwrotnej o prowadzeniu spotkań, szkoli w rozwiązywaniu problemów |
| Przedstawiciele pracowników (związki zawodowe, komisja bezpieczeństwa; w Niemczech rada zakładowa) | angażowani wcześnie; dbają o to, by wskaźniki KPI nie były wykorzystywane do monitorowania zachowania lub wyników poszczególnych osób (zob. rozdział 13) |

CETPM opisuje coachów na hali, którzy obserwują spotkania i po nich udzielają informacji zwrotnej [3]. Ta rola jest podczas wdrażania często niedoceniana: lider zespołu, który nigdy nie prowadził spotkania, potrzebuje konkretnej informacji zwrotnej w pierwszych tygodniach.

### Jak zmienia się rola kierownika

| Wcześniej | W zarządzaniu na hali produkcyjnej |
|---|---|
| rozwiązuje problemy osobiście | rozwija zdolność zespołu do rozwiązywania problemów |
| odbiera raporty w biurze | widzi rzeczywistość na hali |
| pyta: „Kto to zrobił?” | pyta: „Co w procesie na to pozwoliło?” |
| odpowiada na eskalacje mailem | odpowiada na eskalacje na najbliższym spotkaniu |
| ocenia wskaźniki KPI | używa wskaźników KPI, by rozpocząć rozmowę |

## Kultura, bezpieczeństwo psychologiczne i zasady monitorowania pracowników

Zarządzanie na hali produkcyjnej działa tylko wtedy, gdy problemy są nazywane otwarcie. Brzmi to oczywiście, ale w wielu organizacjach tak nie jest. Czerwone pole na tablicy, które prowadzi do krytyki zespołu, przy następnej okazji zostanie pomalowane na zielono.

Badaczka organizacji Amy Edmondson z Harvardu ukształtowała pojęcie zespołowego bezpieczeństwa psychologicznego: „wspólne przekonanie członków zespołu, że zespół jest bezpieczny dla podejmowania ryzyka w relacjach interpersonalnych” [23]. Jej badanie 51 zespołów pracy u producenta mebli zatrudniającego około 5000 pracowników ukazało się w Administrative Science Quarterly w 1999 roku [23] i jest jedną z najczęściej cytowanych prac o zachowaniach uczenia się w zespołach. Dla zarządzania na hali wynika z tego, że tylko w zespołach z poczuciem bezpieczeństwa psychologicznego zgłasza się błędy, dokumentuje sytuacje prawie-wypadkowe i kwestionuje standardy.

### Jak liderzy budują bezpieczeństwo psychologiczne przy tablicy

- **Czerwony jest mile widziany.** Dziękuj za każdy problem, który staje się widoczny. Reakcja na pierwsze czerwone pole decyduje o wszystkich kolejnych.
- **Proces, nie osoba.** Pytaj o warunki, nie o winnych.
- **Pokazuj własne błędy.** Liderzy, którzy otwarcie przyznają się do własnych potknięć, obniżają próg zgłaszania.
- **Odpowiadaj na eskalacje.** Ludzie, którzy eskalują i nigdy nie dostają odpowiedzi, przestają eskalować.
- **Wdrażaj pomysły.** Widoczne wdrażanie sugestii jest najsilniejszą formą uznania. Badanie KIT i IPRI krytykowało, że pracownicy często nie widzieli statusu swoich propozycji, co obniża motywację [24].
- **Nie karz za zgłoszenia dotyczące bezpieczeństwa.** OSHA oczekuje, że pracownicy „nie doświadczają odwetu”, gdy zgłaszają urazy, choroby i zagrożenia [49]; reakcja przy tablicy decyduje o tym, czy to oczekiwanie staje się rzeczywistością.

Wpis [Kultura doskonałości operacyjnej na hali produkcyjnej](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) opisuje, jak długoterminowo zakotwiczyć taką kulturę; kompendium [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/) umieszcza to w szerszym kontekście. Haufe Akademie wymienia hansei, japońską praktykę samokrytycznej refleksji, jako element budujący pozytywną kulturę błędu [43].

### Zasady monitorowania pracowników: prawo pracy USA i rady zakładowe w Niemczech

Cyfrowa tablica, która pokazuje dane z maszyn obok logowań użytkowników, może zostać odczytana jako system monitoringu. To, jak bardzo ma to znaczenie, zależy od lokalizacji zakładu. Poniższe informacje mają charakter ogólny, nie są poradą prawną; każde cyfrowe wdrożenie powinno zostać sprawdzone przez prawnika specjalizującego się w prawie pracy.

**W USA.** Nie istnieje ogólne prawo współdecydowania porównywalne z niemieckim, ale obowiązuje kilka zasad:

- **Zakłady zrzeszone w związkach:** NLRB traktowała instalowanie i używanie ukrytych kamer monitorujących jako obowiązkowy przedmiot negocjacji (Colgate-Palmolive, 1997), co Siódmy Okręg Apelacyjny potwierdził w sprawie National Steel Corp. v. NLRB (2003) [54]. Czy konkretna cyfrowa tablica z danymi osobowymi podlega obowiązkowi negocjacji, jest kwestią rozstrzyganą indywidualnie; bezpieczną drogą jest zaangażowanie związku przed wdrożeniem.
- **Zakłady niezrzeszone:** W październiku 2022 roku ówczesny Główny Radca NLRB wydał memorandum GC 23-02, w którym argumentowano, że inwazyjny monitoring elektroniczny może naruszać prawa pracowników wynikające z sekcji 7 NLRA, i wzywano do ujawniania technologii monitorujących [52]. 14 lutego 2025 roku pełniący obowiązki Głównego Radcy uchylił to memorandum (GC 25-05) [53]. Sama NLRA się nie zmieniła, więc monitoring, który może odstraszać od działań chronionych prawem, pozostaje ryzykiem.
- **Stanowe przepisy o obowiązku informowania:** Niektóre stany wymagają informowania o monitoringu elektronicznym. Na przykład Nowy Jork nakazuje pracodawcom uprzednie pisemne powiadomienie przy zatrudnieniu pracowników, których użycie telefonu, poczty elektronicznej lub internetu jest monitorowane [55]. Aplikacja na hali produkcyjnej, która rejestruje indywidualne korzystanie z systemu, może podlegać takim przepisom.
- **Zgłaszanie zdarzeń dotyczących bezpieczeństwa:** Jak pokazano w sekcji 7, przepisy OSHA chronią pracowników zgłaszających urazy [49][50]. Tablica, która wskazuje osobę zgłaszającą incydent, działa wbrew tej ochronie.

**W Niemczech (istotne dla amerykańskich firm z fabrykami w Niemczech lub niemieckim podmiotem dominującym).** Zaangażowanie rady zakładowej (Betriebsrat, wybranego przedstawicielstwa pracowników z ustawowymi prawami współdecydowania) nie jest formalnością. ifaa zaleca włączenie jej od samego początku oraz zaprojektowanie wskaźników KPI tak, aby nie wywoływać obaw przed inwigilacją [2]. W przypadku cyfrowych tablic wykorzystujących dane maszynowe i dane osobowe zastosowanie ma § 87 ust. 1 pkt 6 niemieckiej ustawy o ustroju zakładu pracy (BetrVG), zgodnie z którym rada zakładowa ma prawo decydować o „wprowadzeniu i stosowaniu urządzeń technicznych przeznaczonych do monitorowania zachowania lub wydajności pracowników” [44]. Według Federalnego Sądu Pracy (BAG) wystarczy, że system jest obiektywnie przydatny do gromadzenia danych o zachowaniu lub wydajności; zamiar monitorowania ze strony pracodawcy nie ma znaczenia [48]. Ogólnie dotyczy to Power BI, Power Apps lub MES z loginami użytkowników. Ponadto obowiązuje RODO. W praktyce szczegóły reguluje umowa zakładowa (Betriebsvereinbarung).

**Co sprawdza się w obu krajach:** pisemna zasada określająca, jakie dane są prezentowane na jakim poziomie agregacji, kto może widzieć które raporty, jak długo dane są przechowywane oraz że wskaźniki KPI oceniają procesy, a nie ludzi. Taka treść jest tożsama z tym, co obejmuje niemiecka umowa zakładowa, i daje amerykańskim związkom zawodowym lub załodze jasną odpowiedź na pytanie: „Czy to zostanie użyte przeciwko nam?”

## Jak wdrożyć zarządzanie na hali produkcyjnej: sześciofazowa mapa drogowa

> **Krótko:** Zacznij od obszaru pilotażowego, zaprojektuj tablicę wspólnie z zespołem, prowadź ją przez około trzy miesiące z coachingiem i buduj kolejny poziom dopiero wtedy, gdy poziom niższy działa niezawodnie.

ifaa opisał sześciofazowy model wdrożenia i przetestował go w kilku małych i średnich firmach; ocena wykazała, że koncepcję można wprowadzić prostymi środkami [2]. Poniższa mapa drogowa opiera się na tym modelu i dodaje gemba walk, kaskadę oraz cyfryzację.

| Faza | Treść | Uczestnicy | Czas trwania (wartość orientacyjna) |
|---|---|---|---|
| 1. Wyznaczenie celów | określenie celów, obszaru pilotażowego i kryteriów sukcesu; obchód zakładu | kierownictwo, kierownictwo produkcji, kierownik projektu, moderator | pół dnia według ifaa [2] |
| 2. Informowanie i budowanie świadomości | spotkanie informacyjne z pytaniami i odpowiedziami; zaangażowanie przedstawicieli pracowników | kierownictwo, menedżerowie, pracownicy obszaru pilotażowego, związek zawodowy lub rada zakładowa, jeśli dotyczy | pół dnia według wartości podanej przez ifaa [2] |
| 3. Wdrożenie | zaprojektowanie tablicy wspólnie z zespołem, dobór KPI, ćwiczenie prowadzenia spotkań | menedżerowie i pracownicy obszaru pilotażowego, 6 do 8 osób | dwa bloki półdniowe, każdy co najwyżej 4 godziny według ifaa [2] |
| 4. Próba | codzienne spotkania przy tablicy, coaching, iteracyjne ulepszanie tablicy | zespół pilotażowy, coach | około 3 miesięcy według ifaa [2] |
| 5. Kontrola | neutralna obserwacja spotkań, informacja zwrotna | obserwatorzy wewnętrzni lub zewnętrzni | regularnie w trakcie próby [2] |
| 6. Walidacja i rozszerzenie | warsztat ewaluacyjny, standaryzacja tablicy i spotkania, budowa kaskady, kolejne obszary | wszyscy uczestnicy projektu, następnie kolejne obszary | warsztat 2 do 3 godzin według ifaa [2], rozszerzenie zależne od wielkości zakładu |

### Praktyczne zalecenia dla każdej fazy

**Faza 1:** Wybierz obszar pilotażowy o stabilnym procesie, zmotywowanym kierownictwie i widocznym problemie. ifaa mówi o „latarni morskiej”, która niesie późniejsze rozszerzenie [2]. Obszar pogrążony w chaosie się nie nadaje, ponieważ najpierw musi nastać stabilność.

**Faza 2:** Wyjaśnij dlaczego, a nie tylko co. Pokaż jasno, że wskaźniki KPI oceniają procesy, a nie ludzi.

**Faza 3:** Pozwól zespołowi zaprojektować tablicę. Zacznij maksymalnie od czterech do sześciu KPI [3] i prostej listy działań. Doskonała tablica pierwszego dnia nie jest ani konieczna, ani użyteczna.

**Faza 4:** Decydują pierwsze tygodnie. Spotkania na początku trwają dłużej, niż powinny [3]. Coach obserwuje spotkanie i po nim udziela moderatorowi prywatnej informacji zwrotnej. Orth opisuje na to około 15 minut, obejmujące jedną mocną stronę, jeden obszar do rozwoju i jedno konkretne zadanie [3]. W pierwszych tygodniach zwraca się to każdego dnia, później co tydzień. Gemba walks prowadzone przez kolejny szczebel kierownictwa rozpoczynają się w tej fazie.

**Faza 5:** Użyj prostej oceny (zob. poniższą kontrolę dojrzałości), by sprawdzić, czy system działa.

**Faza 6:** Buduj poziom 2 dopiero wtedy, gdy poziom 1 działa niezawodnie, potem poziomy 3 i 4. Zastępuj istniejące spotkania zamiast dokładać nowe. Gelbrich wskazuje to jako typowy błąd, gdy zarządzanie na hali nie zastępuje dotychczasowych spotkań [3].

### Warunki wstępne i czynniki sukcesu według ifaa

ifaa nennt als Voraussetzungen das Commitment des Managements, ein Budget an Zeit und Geld, die unternehmensweite Kommunikation des Projekts, einen definierten Zielzustand (Vision und Mission), die Überzeugung der Beteiligten sowie die Einbindung des Betriebsrats [2]. Für den Erfolg betont sie außerdem Führungskräfte, die an den Besprechungen vor Ort teilnehmen, klar kommunizierte und auf allen Ebenen heruntergebrochene Ziele, die Beteiligung und Schulung der Mitarbeiter sowie Disziplin, Konsequenz und Ausdauer, denn Shopfloor Management ist keine einmalige Kampagne [2]. In US-Werken ohne Betriebsrat gilt dieselbe Logik für die Gewerkschaft oder, in einem gewerkschaftsfreien Werk, für frühe und offene Kommunikation mit der Belegschaft.

### Reifegradprüfung: Funktioniert Ihr Shopfloor Management?

- [ ] Das Board wurde heute aktualisiert, und das Team kann jede KPI erklären.
- [ ] Jede rote KPI hat eine Maßnahme mit Verantwortlichem und Fälligkeitstermin.
- [ ] Besprechungen beginnen pünktlich und bleiben im Zeitrahmen.
- [ ] Eskalationen erreichen die nächste Ebene noch am selben Tag und werden beantwortet.
- [ ] Führungskräfte machen Gemba-Walks in einem festen Rhythmus.
- [ ] Maßnahmen werden erst geschlossen, wenn ihre Wirkung nachgewiesen ist.
- [ ] Die Zahl gemeldeter Probleme und Beinahe-Unfälle ist gestiegen, nicht gesunken.
- [ ] Mindestens eine bestehende Besprechung wurde durch die Tier-Besprechung ersetzt.
- [ ] Verbesserte Prozesse sind in aktualisierten Standards dokumentiert.
- [ ] Mitarbeiter können den Status ihrer Ideen einsehen.

Acht oder mehr Ja-Antworten sprechen für ein wirksames System; weniger als fünf deuten auf ein Board hin, das eher Ritual als Führungsinstrument ist.

## Häufige Fehler und wie Sie sie beheben

Aus Beobachtungen seit 2015 in rund 50 deutschen Unternehmen verschiedener Branchen leitete Gelbrich zehn häufige Gründe ab, warum Shopfloor Management scheitert [3]. Die Tabelle stellt sie den Gegenmaßnahmen gegenüber.

| Fehler (laut Gelbrich [3]) | Gegenmaßnahme |
|---|---|
| unrealistisch hohe Erwartungen ohne direktes Engagement der Führung | der Werksleiter moderiert Tier 4 persönlich und geht regelmäßig ins Gemba |
| fehlerhafte Verknüpfung der Ebenen des Shopfloor Managements | ineinandergreifende Kaskade, definierte Eskalationsauslöser, Reaktionspflicht |
| inhaltliche Überfrachtung mit unnötigen Informationen | vier bis sechs KPIs, alles Übrige vom Board nehmen |
| komplizierte, zeitaufwendige Aktualisierung der Informationen | Datenerfassung vereinfachen, dort automatisieren, wo es sinnvoll ist |
| für den Prozess irrelevante KPIs | KPIs mit den drei Leitfragen neu ableiten |
| KPIs, die das Team nicht beeinflussen kann | auf die nächsthöhere Ebene verlagern |
| lange Aktualisierungszyklen und veraltete Informationen | Aktualisierung als fester Punkt der Schichtübergabe |
| keine Gegenmaßnahmen bei festgestellten Abweichungen | Regel: kein Rot ohne Maßnahme |
| Shopfloor-Besprechungen, die zu lange dauern, besonders während der Einführung | Zeitrahmen, Stehbesprechung, Problemlösung aus der Besprechung auslagern |
| Shopfloor Management ersetzt bestehende Besprechungen nicht | Besprechungsinventur, Doppelungen streichen |

Drei weitere Fehler treten in der Praxis häufig auf:

- **KPI-Theater:** KPIs werden präsentiert, aber nicht diskutiert. Die Frage „Was tun wir jetzt?“ fehlt.
- **Gemba-Tourismus:** Führungskräfte gehen ohne Thema, ohne Fragen und ohne Nachverfolgung durch das Werk.
- **Zu frühe Digitalisierung:** Ein Werk führt Software ein, bevor die Routinen stehen. Digitalisiert wird dann ein Prozess, den niemand lebt.

## Analogowo czy cyfrowo? Porównanie cyfrowego zarządzania na hali produkcyjnej

Pytanie „tablica czy ekran?” bywa traktowane jako kwestia zasad. Można na nie odpowiedzieć rzeczowo. Dostępne badania sugerują, że stan obecny jest w większości analogowy: w badaniu KIT i IPRI (18 firm) zarządzanie na hali odbywało się głównie na papierze i tylko częściowo z cyfrowym wsparciem; tylko około 10 procent spotkań korzystało z cyfrowej tablicy na hali, a cyfrowe wyświetlanie KPI zwykle zaczynało się dopiero na poziomie średniego kierownictwa [24][25]. Badanie opisuje też przerwane przekazywanie informacji między papierem, Excelem i OneNote, bez wiodącego systemu, co utrudnia śledzenie zadań między poziomami [24].

| Kryterium | Tablica analogowa | Tablica cyfrowa |
|---|---|---|
| Koszt wstępny | bardzo niski | licencje, sprzęt, integracja |
| Zaangażowanie w praktyce | zespół pisze na tablicy, silna identyfikacja | ryzyko, że zespół tylko konsumuje dane |
| Aktualność | zależy od ręcznej aktualizacji | automatyczna, niemal w czasie rzeczywistym |
| Jakość danych | błędy przepisywania, luki | spójne, pod warunkiem czystych źródeł |
| Eskalacja między poziomami | ręczna, podatna na błędy | kompleksowa, możliwa do prześledzenia |
| Śledzenie działań | dyscyplina indywidualna | wspierane systemowo, z terminami i przypomnieniami |
| Rozproszone zespoły, wiele zakładów | niemożliwe | możliwe |
| Historia i analiza | zdjęcia, segregatory | możliwość analizy, trendy, wzorce |
| Odporność | zawsze działa | zależy od sieci i systemów |
| Zasady dotyczące monitorowania pracowników | zwykle niekrytyczne | zalecane pisemne zasady dotyczące danych (związki zawodowe, prawo stanowe; w Niemczech porozumienie zakładowe) |
| Bezpieczeństwo OT | nie stanowi problemu | wymagana segmentacja sieci i kontrola dostępu (patrz rozdział 18) |

### Które podejście i kiedy?

- **Zacznij analogowo**, gdy rutyny są nowe, zespół jest mały, a KPI łatwo zebrać ręcznie. Tablica wymusza utrzymanie prostoty.
- **Przejdź do modelu hybrydowego**, gdy dane z maszyn płyną automatycznie na ekran, ale działania i pomysły nadal są ręcznie prowadzone przy tablicy. W wielu zakładach to najlepszy kompromis.
- **Rozwijaj cyfrowo**, gdy trzeba połączyć kilka poziomów, zmian lub zakładów, gdy ręczne zbieranie danych jest zbyt pracochłonne albo gdy działania giną między poziomami.

CETPM odwołuje się do pięcioetapowego modelu digitalizacji według Müllera-Seegersa: definicja projektu i celów, testowanie dostawców i wybór narzędzia, pilotaż (najwyżej cztery tygodnie), faza korekt (tylko w razie potrzeby), wdrożenie i eksploatacja; łącznie spodziewa się około sześciu miesięcy [3]. Ważniejsza od narzędzia jest kolejność: najpierw rutyna, potem cyfryzacja. Wpis [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) pokazuje, jak równolegle usprawnić przepływ materiałów.

## Budowa cyfrowej tablicy na hali produkcyjnej z użyciem Microsoft 365

> **W skrócie:** Teams zapewnia przestrzeń, Power BI – ścianę KPI, Power Apps – rejestrację danych, Lists – listę działań, a Fabric – alerty w czasie rzeczywistym. Największe dźwignie to licencje dla odbiorców, interwał odświeżania w Power BI oraz model danych.

Wielu producentów korzysta już z Microsoft 365 do poczty e-mail, Teams i dokumentów. Ma sens budowanie cyfrowej tablicy na hali właśnie tam, gdzie pracownicy i tak się komunikują. Poniższe elementy budulcowe są udokumentowane w Microsoft Learn; przed wdrożeniem sprawdź wymagania licencyjne i dostępność w swoim tenancie. Dostawcy z sektora publicznego i obronnego w USA, działający w chmurach rządowych Microsoftu (GCC, GCC High), powinni osobno sprawdzić dostępność funkcji w tych środowiskach.

### Architektura referencyjna w skrócie

| Funkcja tablicy | Element Microsoft | Co robi (zgodnie z dokumentacją Microsoft) |
|---|---|---|
| Przestrzeń komunikacyjna dla obszaru | Microsoft Teams (jeden zespół na obszar, jeden kanał na linię lub poziom) | kanały z zakładkami dla tablicy, działań i aplikacji |
| Wizualizacja KPI | Power BI, osadzony jako zakładka w Teams | interaktywne raporty w kanałach i czatach, podglądy linków, powiadomienia w kanale aktywności [28] |
| KPI z celami | Metryki Power BI (scorecards) | metryki z właścicielami, bieżącą wartością i celem, statusem, aktualizacjami; jako zakładka w kanałach lub spotkaniach [31] |
| Rejestracja danych na stanowisku | Power Apps (aplikacja canvas jako zakładka Teams) | niestandardowe ekrany wprowadzania, np. dla przyczyn przestojów, braków, pomysłów [30] |
| Lista działań, rejestr problemów | Microsoft Lists (np. szablon „Issue tracker”) lub Planner | listy z widokami, regułami i powiadomieniami, przechowywane w SharePoint [38] |
| Standardowe zadania w wielu zakładach | Planner z publikowaniem zadań | dystrybucja list zadań do wielu zespołów i śledzenie wykonania w każdej lokalizacji [37] |
| Komunikacja zmianowa | Aplikacje Teams dla pracowników liniowych (Shifts, Walkie Talkie, Approvals, Updates) | grafiki zmian, komunikacja push-to-talk, zatwierdzenia, cykliczne aktualizacje [35][36] |
| Dane w czasie rzeczywistym i alerty | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Real-Time Dashboard, Activator) | przechwytywanie, analiza i wizualizacja danych strumieniowych oraz automatyczne działania przy spełnieniu warunków [32][33] |

### Power BI jako ściana KPI

Raporty Power BI można osadzić jako zakładkę w kanale Teams, dzięki czemu zespół widzi i omawia KPI tam, gdzie już się komunikuje [28]. W praktyce ważne są trzy kwestie:

1. **Uprawnienia:** Osadzenie raportu w Teams nie daje użytkownikom automatycznie prawa do jego przeglądania; uprawnienia trzeba nadać wprost [28].
2. **Licencje:** Użytkownicy z bezpłatną licencją Fabric mogą przeglądać treści w obszarze roboczym na pojemności Premium (SKU P) lub pojemności Fabric F64 lub większej; tworzenie i udostępnianie wymaga licencji Power BI Pro lub Premium Per User [28]. Poniżej F64 każdy odbiorca potrzebuje więc licencji Pro lub PPU. Przy wielu odbiorcach na hali jest to główny czynnik kosztowy; kwestie licencjonowania ekranów wyświetlających na linii wyjaśnij z partnerem licencyjnym Microsoft.
3. **Ograniczenia:** Pulpitów Power BI (w odróżnieniu od raportów) nie można osadzić w zakładce Power BI, a zakładka nie obsługuje filtrów w adresie URL [28].

**Jak aktualna może być tablica Power BI?** Automatyczne odświeżanie strony działa dla źródeł DirectQuery, Direct Lake i niektórych scenariuszy połączeń na żywo, ale nie dla trybu importu [29]. We współdzielonej pojemności (typowej przy samych licencjach Pro) minimalny interwał wynosi 30 minut, a wykrywanie zmian nie jest dostępne. W dedykowanej pojemności (Fabric F, Premium P) oraz przy Premium Per User możliwe są interwały do jednej sekundy w trybie DirectQuery, jeśli administrator pojemności na to zezwoli; domyślne minimum to pięć minut, a dla wykrywania zmian pięć sekund [29]. Wystarcza to tablicy pokazującej sztuki na godzinę; do prawdziwych funkcji andon lepiej nadaje się Real-Time Intelligence.

### Power Apps do rejestracji danych na stanowisku

Aplikacje canvas zbudowane w Power Apps można dodać do kanału Teams przez zakładkę „Power Apps”, pod warunkiem wcześniejszego udostępnienia aplikacji użytkownikom [30]. Typowe aplikacje na hali:

- rejestracja przyczyn przestojów za pomocą kilku dużych przycisków (np. „brak materiału”, „awaria narzędzia”, „jakość”),
- rejestracja braków i poprawek w podziale na godziny,
- pomysły i propozycje usprawnień ze zdjęciem,
- cyfrowa lista kontrolna gemba walk z obserwacjami i działaniami,
- potwierdzanie procesów (warstwowy audyt procesu) na tablecie.

Microsoft wymienia znane ograniczenia, na przykład że czujniki, takie jak lokalizacja czy kompas, nie są obsługiwane w aplikacji desktopowej Teams, a załączników nie można pobrać w aplikacji mobilnej Teams [30]. Ważne dla decyzji architektonicznej: środowiska Dataverse for Teams są wycofywane [30]. Według Microsoft od 15 listopada 2026 r. nie można tworzyć nowych środowisk Dataverse for Teams; środowiska, które nie zostały zaktualizowane, zostaną zawieszone 15 września 2027 r. i wycofane 30 października 2027 r. [45]. Nowe rozwiązania należy zatem budować na standardowym środowisku Dataverse, na listach SharePoint lub innych źródłach danych.

**Pytanie o licencjonowanie Power Apps:** tabele Dataverse, łączniki premium oraz lokalne bramy danych (na przykład do bazy MES na hali produkcyjnej) wymagają uprawnień premium Power Apps [46]. Aplikacja do rejestrowania oparta na listach SharePoint zwykle działa w ramach uprawnień zawartych w Microsoft 365; dokładny zakres opisuje Power Platform Licensing Guide. Ten wariant często decyduje o koszcie na użytkownika przy linii produkcyjnej.

### Działania i zadania

Microsoft Lists, dostępne jako karta w Teams, dobrze nadaje się do listy działań. Microsoft opisuje Lists jako narzędzie do śledzenia informacji, takich jak problemy, zasoby, rutyny lub incydenty, z konfigurowalnymi widokami, regułami i powiadomieniami; dostępny jest szablon „Issue tracker”, a dane znajdują się na witrynie zespołu SharePoint [38]. Lista z kolumnami: problem, KPI, przyczyna źródłowa, działanie, właściciel, termin, status, skuteczność zweryfikowana i poziom eskalacji odzwierciedla kolumnę działań na tablicy. Filtr według poziomu pokazuje dokładnie właściwe pozycje na każdym spotkaniu danego szczebla.

Ustandaryzowane rutyny, na przykład codzienne kontrole 5S czy cotygodniowe potwierdzenia procesu na wszystkich liniach, można rozdzielać za pomocą publikowania zadań w Planner. Microsoft opisuje, jak menedżerowie operacyjni mogą publikować listy zadań zespołom w zdefiniowanej hierarchii i śledzić wykonanie za pomocą raportów dla pojedynczego zadania i dla całej listy; zadania mogą zawierać listy kontrolne z maksymalnie 20 pozycjami [37].

### Czas rzeczywisty i alerty z Microsoft Fabric

W zakładach, które chcą wykorzystywać dane z maszyn w czasie rzeczywistym, Microsoft Fabric Real-Time Intelligence oferuje kilka elementów składowych [32]:

- **Eventstream** przechwytuje, przekształca i kieruje duże ilości danych w czasie rzeczywistym bez kodowania; łączniki obejmują MQTT, Apache Kafka oraz change data capture z baz danych. Źródła Azure, takie jak Event Hubs i IoT Hub, są dostępne w Real-Time hub.
- **Eventhouse** jest zoptymalizowany pod kątem zdarzeń strumieniowych związanych z czasem; zapytania wykorzystują KQL (Kusto Query Language) lub, w KQL queryset, T-SQL.
- **Real-Time Dashboard** wizualizuje dane w ruchu.
- **Activator** monitoruje strumienie danych z małym opóźnieniem (poniżej sekundy dla bezstanowych reguł na danych strumieniowych) i uruchamia działania po osiągnięciu progów lub wykryciu wzorców, w tym braku danych. Działania obejmują wiadomości w Teams do osób, grup lub kanałów, e-maile, przepływy Power Automate oraz elementy Fabric, takie jak potoki czy notatniki [33].

Microsoft wprost wymienia produkcję i IoT jako scenariusze [32]. Dla zarządzania na hali oznacza to, że reguła Activator może na przykład wysłać wiadomość na kanał Teams linii, gdy maszyna stoi dłużej niż zdefiniowany czas. To cyfrowy andon, który trafia do lidera zespołu na smartfonie. Uzupełnia on linkę alarmową i lampę sygnalizacyjną na linii, ale ich nie zastępuje, dopóki nie każdy lider zespołu ma służbowy telefon.

### Przykład: tablica poziomu 1 w Teams

| Karta kanału | Zawartość | Element składowy |
|---|---|---|
| „Tablica” | strona SQDCP z statusem czerwony/zielony, cel godzinowy kontra wynik, 3 najczęstsze przyczyny przestojów | raport Power BI |
| „Rejestracja” | przyczyny przestojów, braki, pomysły | aplikacja canvas Power Apps |
| „Działania” | lista działań przefiltrowana do poziomu 1 | Microsoft Lists |
| „Rutyny” | codzienne kontrole, 5S, potwierdzenie procesu | Planner (opublikowane zadania) |
| „Cele” | cele obszaru z przeglądami postępów | Power BI Metrics |
| Wpisy w kanale | eskalacje, wiadomości andon, przekazanie zmiany | Teams, Activator, Power Automate |

### Plan wdrożenia: sześć kroków do pierwszej cyfrowej tablicy poziomu 1

Dla administratorów Microsoft 365 sprawdziła się następująca kolejność. Zakłada ona, że zespół pilotażowy już pracuje z analogową tablicą.

1. **Das Board fotografieren und die KPIs definieren.** Felder und KPIs des analogen Boards übernehmen; für jede KPI Formel, Datenquelle, Zielwert und benötigte Aktualisierungsfrequenz festlegen.
2. **Team und Kanäle anlegen.** Ein Team pro Bereich, ein Kanal pro Linie oder Ebene; Berechtigungen über Gruppen statt über einzelne Personen.
3. **Maßnahmenliste in Microsoft Lists aufbauen.** Spalten wie unter „Maßnahmen und Aufgaben“ oben, eine Ansicht pro Ebene, Erinnerung am Fälligkeitsdatum.
4. **Erfassungs-App erstellen.** Eine Canvas-App mit wenigen großen Schaltflächen für Stillstandsgründe und Ausschuss; Daten in SharePoint-Listen oder Dataverse (Lizenzfrage beachten).
5. **Power-BI-Bericht anbinden.** Eine Berichtsseite pro Board, Rot-Grün-Logik gegenüber den Zielwerten, DirectQuery oder Direct Lake, falls eine Seitenaktualisierung nötig ist; als Registerkarte in den Kanal einbetten und Leserechte vergeben.
6. **Vier Wochen in der Besprechung testen, dann ausweiten.** Erst wenn das Team das digitale Board in der Besprechung der Ebene 1 selbst betreibt, folgen Activator-Warnungen, Planner-Routinen und die Anbindung an Ebene 2.

Die Datenregeln sind vor Schritt 4 mit den Arbeitnehmervertretungen abzustimmen (in Deutschland zusätzlich mit dem Betriebsrat), denn ab diesem Schritt können Daten entstehen, die sich auf einzelne Personen zurückführen lassen.

### Was Microsoft 365 nicht ersetzt

Microsoft 365 ist ein Werkzeugkasten, kein fertiges System für das Shopfloor Management. Die Kaskadenlogik, die Eskalationsregeln, die Verknüpfung von KPI, Maßnahme und nachgewiesener Wirkung sowie die Moderationsdisziplin müssen Sie selbst gestalten. Ohne ein klares Datenmodell entsteht schnell eine Sammlung unverbundener Listen und Berichte, genau die gebrochenen Übergaben zwischen Werkzeugen, die die Forschung am analogen Shopfloor Management kritisiert [24]. Klären Sie außerdem früh die Hardwarefrage: große Bildschirme an der Linie, robuste Tablets und Gerätekonten für gemeinsam genutzte Geräte verursachen eigenen Aufwand.

## Datenintegration: MES, ERP und Maschinendaten

> **Kurz gesagt:** Stückzahlen und Stillstände kommen automatisch von Maschine oder MES; Stillstandsgründe und Ideen werden einfach von Hand erfasst. Jede KPI wird einmal definiert und auf jeder Ebene gleich berechnet.

Ein digitales Board ist nur so gut wie seine Daten. Typische Quellen:

| Quelle | Daten für das Board | Typischer Weg |
|---|---|---|
| ERP (z. B. SAP, Microsoft Dynamics 365) | Aufträge, Planmengen, Liefertermine, Rückstand | Datenexport oder Konnektor in Power BI bzw. Fabric |
| MES / Betriebsdatenerfassung | Stückzahlen, Stillstände, Stillstandsgründe, OEE, Ausschuss | Datenbank- oder API-Anbindung, Replikation nach Fabric |
| Maschinensteuerungen (SPS, OPC UA) | Zustände, Zähler, Prozesswerte | Edge-Gateway, z. B. Azure IoT Operations mit dem OPC-UA-Konnektor, danach über MQTT |
| Qualitätsmanagementsystem (QMS) | Prüfergebnisse, Reklamationen | Datenbank- oder API-Anbindung |
| HR- und Schichtplanungssysteme | Anwesenheit, Schichtplan | Schnittstelle, aggregiert |
| Manuelle Erfassung | Stillstandsgründe, Ideen, Sicherheitsereignisse | Power Apps, Microsoft Lists |

In den Begriffen von ISA-95 (ANSI/ISA-95, international IEC 62264) setzt das Board auf Ebene 3 (Betriebsführung der Fertigung, etwa MES) und Ebene 4 (Geschäftsplanung und Logistik, etwa ERP) auf; der Standard behandelt vor allem die Schnittstelle zwischen diesen beiden Ebenen [56]. Wer seine Begriffe für Aufträge, Materialien und Betriebsmittel verwendet, gleicht das Datenmodell des Boards leichter mit MES und ERP ab.

Für die Maschinenanbindung beschreibt Microsoft den Konnektor für OPC UA in Azure IoT Operations: Er verbindet sich mit OPC-UA-Servern, liest Daten und veröffentlicht sie als JSON-Nachrichten im OPC-UA-PubSub-Format an den MQTT-Broker; er kann Assets auch automatisch erkennen [34]. Von dort leiten Datenflüsse in Azure IoT Operations die Daten an Ziele wie Microsoft Fabric OneLake, Azure Data Explorer oder einen Kafka-Endpunkt weiter [47]. Die hier ausgewertete Dokumentation beschreibt keinen OPC-UA-Konnektor direkt in Fabric; der Weg führt über das Edge-Gateway.

Sobald Maschinennetze mit Cloud-Diensten verbunden werden, wird die OT-Sicherheit Teil des Projekts. Die Reihe ISA/IEC 62443 behandelt die Sicherheit industrieller Automatisierungs- und Steuerungssysteme und verbindet Betrieb und IT [57]; das NIST Cybersecurity Framework (CSF) 2.0, veröffentlicht am 26. Februar 2024, beschreibt sich selbst als Taxonomie übergeordneter Ergebnisse der Cybersicherheit und kann als Referenz für die Steuerung dieser Arbeit dienen [59]. Ein Shopfloor-Board soll Daten aus dem OT-Netz lesen, nicht einen Zugang in dieses Netz öffnen.

### Grundsätze für die Datenarchitektur

1. **Jedna prawda dla każdego KPI.** Zdefiniuj każdy KPI raz (wzór, źródło, poziom szczegółowości) i stosuj tę definicję na każdym poziomie. Dzięki temu OEE na tablicy poziomu 1 jest zgodne z OEE w raporcie z zakładu.
2. **Automatyzuj to, co jest stabilne.** Ilości i przestoje pochodzą z maszyny lub MES. Powody przestojów, które wymagają oceny przez człowieka, rejestruje się ręcznie, prosto i szybko.
3. **Opóźnienie dopasowane do decyzji.** Poziom 1 potrzebuje wartości godzinowych lub w czasie rzeczywistym, poziom 4 wartości dziennych lub tygodniowych. Nie wszystko musi być w czasie rzeczywistym.
4. **Ochrona prywatności i zasady dotyczące pracowników od samego początku.** Dane osobowe są agregowane; role i uprawnienia są udokumentowane.

Kompendium [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) szczegółowo omawia te zagadnienia z zakresu IT w produkcji, a [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) pokazuje, dokąd prowadzą dane z zakładu w czasie rzeczywistym.

## Wsparcie oprogramowania: przykład iFAKT Polaris

> **Uwaga: Autor pracuje w iFAKT GmbH.**

Oprócz budowania własnej tablicy w Microsoft 365 istnieje wyspecjalizowane oprogramowanie do cyfrowego zarządzania Lean. Jednym z przykładów jest [Polaris](https://www.m365.fm/entity/polaris/) firmy [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) z siedzibą w Stuttgarcie w Niemczech. Rozwiązania Polaris są notowane w Microsoft AppSource, w tym Polaris VSM do cyfrowego mapowania strumienia wartości [39] oraz Polaris BSM do modelowania procesów biznesowych w cyfrowym zarządzaniu Lean [40]. Kompendium [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) szczegółowo opisuje tę rodzinę produktów.

Według dostawcy do zarządzania na hali produkcyjnej istotne są dwa moduły [unverified: informacja pochodzi od dostawcy i nie została niezależnie potwierdzona]:

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** przekazuje zadania bezpośrednio na halę produkcyjną, na przykład działania wynikające ze spotkań zespołów lub z obchodów gemba, tak aby trafiały do właścicieli przy linii, a ich wykonanie można było śledzić.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** wyświetla KPI w pulpitach nawigacyjnych i wspiera ścianę KPI tablicy na różnych poziomach.

Ocena: wyspecjalizowane rozwiązanie nie zaprojektuje za Ciebie kaskady, zasad eskalacji i dyscypliny prowadzenia spotkań w większym stopniu niż rozwiązanie zbudowane samodzielnie. Może jednak wstępnie ustrukturyzować powiązanie między KPI, działaniem a potwierdzonym efektem, a tym samym skrócić pracę nad własnym modelem danych. Kluczowe jest to, czy rozwiązanie pasuje do istniejącego krajobrazu IT; wpis w AppSource wskazuje na nacisk na ekosystem Microsoft.

Oprócz Polaris istnieje wielu innych dostawców, na przykład moduły hali produkcyjnej od dostawców MES albo samodzielne platformy do Lean i wielopoziomowych spotkań. Niezależnie od dostawcy poniższe pytania pomagają przy wyborze:

- Czy oprogramowanie odwzorowuje kaskadę z eskalacją i reakcją na kilku poziomach?
- Czy działanie może zostać zamknięte dopiero po udowodnieniu jego efektu?
- Jakie istnieją interfejsy do ERP, MES i maszyn oraz kto je utrzymuje?
- Czy oprogramowanie agreguje KPI zgodnie z wymogami Twoich zasad dotyczących danych (układ zbiorowy, prawo stanowe, porozumienie zakładowe)?
- Co się dzieje, gdy sieć przy linii przestaje działać?
- Jak licencjonowani są użytkownicy przeglądający dane i ile kosztuje ekran przy linii?

O firmie: iFAKT GmbH ma siedzibę pod adresem Curiestrasse 2, 70563 Stuttgart, Niemcy (rejestr handlowy Stuttgart HRB 22661) [61]. Według firmy została założona w 2001 roku i zatrudnia około 25 osób (informacja firmy, niezweryfikowana niezależnie). Jej strona internetowa pokazuje pieczęć TÜV SÜD potwierdzającą certyfikację ISO 9001 i ISO/IEC 27001 [61], a system Polaris IMS zajął drugie miejsce w kategorii produkcja w konkursie Best of Technology Award 2025 niemieckiego tygodnika biznesowego WirtschaftsWoche [60].

## Słownik pojęć

| Termin | Znaczenie |
|---|---|
| A3 | rozwiązywanie problemów na jednej kartce formatu A3 (w USA zwykle 11 × 17 in.): problem, stan obecny, przyczyna źródłowa, cel, działania zaradcze, kontrola skuteczności |
| Andon | sygnał (linka, przycisk, lampka), który od razu uwidacznia odchylenie i wzywa pomoc |
| Eskalacja | przekazanie problemu na wyższy poziom, gdy zespół nie jest w stanie sam go rozwiązać |
| Gemba | japońskie określenie „właściwego miejsca”; miejsca, w którym tworzona jest wartość |
| Gembutsu | „rzecz rzeczywista” na gemba: maszyna, narzędzie, materiał, wadliwa część |
| Genchi genbutsu | pójście na miejsce i sprawdzenie faktów na własne oczy |
| Hoshin kanri | metoda wdrażania celów firmy na wszystkich poziomach (zwana też policy deployment) |
| Layered process audit (process confirmation) | krótka kontrola standardu przez liderów na kilku poziomach w stałym rytmie |
| Leader standard work | stałe, widoczne codzienne procedury dla liderów |
| Obeya | „duży pokój”; sala spotkań, na której ścianach wiszą wszystkie KPI i projekty |
| OEE | ogólna efektywność urządzeń: dostępność × wydajność × jakość |
| SQDCP | struktura tablicy według bezpieczeństwa, jakości, dostaw, kosztów, ludzi (także SQCDP) |
| Spotkanie tierowe | krótkie, regularne spotkanie przy tablicy na określonym poziomie hierarchii |
| TRIR | całkowity współczynnik zarejestrowanych incydentów: przypadki rejestrowane przez OSHA × 200 000 / przepracowane godziny |
| Yokoten | przeniesienie sprawdzonego rozwiązania na inne linie lub zakłady |
| DirectQuery / Direct Lake | tryby połączenia Power BI, w których dane są odpytywane bezpośrednio zamiast importowane; wymagane do automatycznego odświeżania stron |
| F64 | rozmiar pojemności Microsoft Fabric, od którego odbiorcy mogą oglądać treści bez płatnej licencji Power BI |

## FAQ: zarządzanie na hali produkcyjnej i chodzenie po gemba

### Czym w prostych słowach jest zarządzanie na hali produkcyjnej?

Zarządzanie na hali produkcyjnej oznacza, że liderzy prowadzą tam, gdzie wykonywana jest praca. Zespół krótko spotyka się codziennie przy tablicy z kilkoma KPI, omawia odchylenia, uzgadnia działania i przekazuje problemy, których nie może rozwiązać, na wyższy poziom kierownictwa. Liderzy regularnie chodzą na halę, aby zobaczyć sytuację na własne oczy.

### Jakie są elementy zarządzania na hali produkcyjnej?

Sześć elementów: liderzy obecni na hali (gemba), zarządzanie wizualne, kilka KPI, na które zespół może wpływać, stały rytm spotkań w ramach spotkań tierowych, ustrukturyzowane rozwiązywanie problemów oraz standaryzacja. Niemieckie instytuty badawcze grupują je nieco inaczej [2][4], a amerykańskie strony dostawców często mówią o pięciu filarach [pięciu filarach], lecz treść jest ta sama.

### Co oznacza gemba?

Gemba (także genba) to japońskie określenie „właściwego miejsca”. W lean oznacza miejsce, w którym tworzona jest wartość, zwykle halę produkcyjną [7][8]. Genchi genbutsu, czyli „idź i zobacz na własne oczy”, to powiązane działanie: gemba jest miejscem, genchi genbutsu to to, co się tam robi [8].

### Czym jest chodzenie po gemba?

Chodzenie po gemba to zaplanowana wizyta lidera w miejscu tworzenia wartości. Lider obserwuje pracę, porównuje ją ze standardem i zadaje otwarte pytania, aby zrozumieć sytuację przed podjęciem działań [7]. Dobry spacer ma temat, zaczyna się przy tablicy i kończy informacją zwrotną dla zespołu.

### Jakie są trzy zasady chodzenia po gemba?

Najczęściej cytowana wersja pochodzi od byłego prezesa Toyoty Fujio Cho: „Idź i zobacz, pytaj dlaczego, okazuj szacunek” [15]. LEI dodaje trzy rzeczy do obserwowania podczas spaceru: cel (jaki problem proces rozwiązuje dla klienta), proces (jak naprawdę działa) i ludzi (czy są zaangażowani w jego ulepszanie) [7].

### Jaka jest różnica między zarządzaniem na hali a chodzeniem po gemba?

Zarządzanie na hali produkcyjnej to cały system przywództwa: tablica, KPI, spotkania tierowe, rozwiązywanie problemów i standardy. Chodzenie po gemba to jedna rutyna w ramach tego systemu: lider idzie tam, gdzie wykonywana jest praca, obserwuje i zadaje pytania, aby zrozumieć sytuację przed podjęciem działania [7].

### Ile powinno trwać spotkanie na hali produkcyjnej?

Około 10 do 15 minut na poziomie zespołu i 20 do 30 minut na poziomie kierownictwa. Gelbrich podaje 10 do 12 minut na poziomie operacyjnym i 20 do 30 minut na poziomie kierownictwa; w fazie wdrażania spotkania często trwają dłużej [3].

### Czym jest spotkanie tier 1, tier 2 i tier 3?

Spotkanie tierowe to krótkie, ustandaryzowane spotkanie przy tablicy na jednym poziomie organizacji. Tier 1 to zespół liniowy, tier 2 to nadzorcy obszaru, tier 3 to kierownicy działów, a tier 4 to kierownictwo zakładu [58]. Spotkania są rozłożone w czasie, aby problemy mogły być eskalowane w górę tego samego dnia.

### Czym jest tablica na hali produkcyjnej?

Tablica na hali produkcyjnej (znana też jako huddle board lub tablica SQDCP) to biała tablica lub ekran, przy którym zespół spotyka się na spotkaniu poziomu (tier meeting). Pokazuje kilka wskaźników KPI wraz z celem i trendem, otwarte działania z przypisanymi właścicielami i terminami oraz eskalacje do wyższego poziomu. Typowy układ ma kolumny według SQDCP oraz wiersze dla statusu, trendu i działań.

### Co oznacza SQDCP?

SQDCP oznacza bezpieczeństwo (safety), jakość (quality), dostawy (delivery), koszt (cost) i ludzi (people); zapisywany bywa też jako SQCDP. Kolejność jest przekazem: bezpieczeństwo omawia się jako pierwsze na każdym spotkaniu. Warianty to SQDC, SQDCM (morale) lub SQDCE (environment).

### Jakie wskaźniki KPI powinny znaleźć się na tablicy na hali?

Cztery do sześciu wskaźników, na które zespół może wpływać [3], uporządkowanych według SQDCP: bezpieczeństwo (urazy podlegające rejestracji, zdarzenia prawie wypadkowe), jakość (złom, wydajność za pierwszym razem, first pass yield), dostawy (plan vs. wykonanie, terminowość dostaw), koszt lub produktywność (OEE, sztuki na godzinę) oraz ludzie (frekwencja, wielozadaniowość, pomysły).

### Jak często należy przeprowadzać gemba walk?

Nie ma uniwersalnej liczby. Liczy się stały, niezawodny rytm osadzony w standardowej pracy kierownictwa (leader standard work). W praktyce brygadziści i liderzy zmian robią codziennie spacer tematyczny, kierownicy działów kilka razy w tygodniu, a dyrektor zakładu co najmniej raz w tygodniu; spacery po strumieniu wartości odbywają się w miarę potrzeb. Liderzy zespołów i tak przebywają na gemba cały dzień i zamiast tego stosują codzienne potwierdzanie procesu (daily process confirmation). Ważniejsza niż częstotliwość jest zasada, że każdy spacer ma temat i działania następcze.

### Kto powinien przeprowadzać gemba walk?

Liderzy na każdym poziomie, każdy z innym celem: brygadziści i kierownicy działów przeprowadzają głównie spacery po systemie zarządzania (czy tablice, standardy i eskalacje działają?), kierownictwo zakładu – spacery po strumieniu wartości obejmujące wiele funkcji, a specjaliści – spacery skupione na problemie [14]. Liderzy zespołów i tak pracują na gemba i zamiast tego stosują process confirmation. Warto zabierać osoby, które pracują w danym procesie, zgodnie z zaleceniem LEI [7].

### Jak długo powinien trwać gemba walk?

Przejrzane źródła nie podają stałej długości. Skupiony spacer po jednym obszarze zwykle trwa od 20 do 45 minut; spacer po strumieniu wartości obejmującym rodzinę produktów może zająć pół dnia. Ważniejsze jest obserwowanie kilku cykli przy jednym stanowisku niż przejście jak największego obszaru.

### Jakie pytania zadawać podczas gemba walk?

Najlepiej działają pytania otwarte, na przykład „Jak zwykle przebiega ten krok?", „Po czym poznajesz, że coś jest nie tak?", „Jaki był ostatni problem, który tu rozwiązałeś?" oraz „Jak mogę Cię wesprzeć?". Pełny zbiór pytań znajduje się w sekcji o gemba walk.

### Czy gemba walk to to samo co management by walking around?

Nie. MBWA pochodzi z Hewlett-Packard i stało się znane dzięki książce „In Search of Excellence" (1982) [16]; dotyczy przede wszystkim bliskości i nieformalnej wymiany. Gemba walk jest bardziej uporządkowany, odnosi się do standardów i KPI i służy zrozumieniu procesu oraz budowaniu zdolności do rozwiązywania problemów.

### Czy zarządzanie na hali sprawdza się w małych firmach?

Tak. ifaa przetestowało swój model wdrożeniowy w kilku małych i średnich przedsiębiorstwach i stwierdziło, że można go wprowadzić prostymi środkami [2]. W małych firmach często wystarczają dwa poziomy: spotkanie zespołu i spotkanie kierownictwa.

### Czy do zarządzania na hali potrzebuję oprogramowania?

Na start nie. Do zbudowania rutyn wystarczą tablica, magnesy i markery. Oprogramowanie zwraca się, gdy trzeba połączyć kilka poziomów, zmian lub zakładów, gdy ręczne zbieranie danych staje się zbyt pracochłonne albo gdy działania gubią się między poziomami [24].

### Czy mogę zbudować cyfrową tablicę na hali za pomocą Microsoft Teams i Power BI?

Tak. Raporty Power BI można osadzić jako karty w kanałach Teams [28], Power Apps obsługują rejestrację danych na stanowisku [30], Microsoft Lists prowadzi listę działań [38], a Microsoft Fabric Real-Time Intelligence dostarcza alerty w czasie rzeczywistym [32][33]. Należy uwzględnić wymagania licencyjne dla odbiorców (bezpłatni odbiorcy tylko od pojemności Fabric F64 lub Premium), minimalne interwały automatycznego odświeżania stron w Power BI (30 minut we współdzielonej pojemności) oraz wycofanie Dataverse for Teams [28][29][45].

### Ile czasu zajmuje wdrożenie zarządzania na hali?

Dla obszaru pilotażowego model ifaa przewiduje po ustaleniu celów i warsztatach informacyjnych oraz wprowadzających fazę próbną trwającą około trzech miesięcy [2]. Wdrożenie w całym zakładzie z działającą kaskadą na wszystkich poziomach trwa znacznie dłużej, zależnie od wielkości, ponieważ każdy poziom powinien działać niezawodnie, zanim zbuduje się kolejny.

## Podsumowanie

Shop floor management nie jest tablicą ani oprogramowaniem, lecz systemem przywództwa o jasnej mechanice: liderzy idą tam, gdzie tworzona jest wartość, zespół uwidacznia odchylenia za pomocą kilku wskaźników KPI, na które może wpływać, krótkie, zaplanowane spotkania piętrowe przenoszą problemy tego samego dnia do miejsca, w którym można je rozwiązać, a każde rozwiązanie staje się nowym standardem dopiero po udowodnieniu jego skutku. Gemba walk to rutyna, dzięki której liderzy rozumieją zamiast zakładać.

Udokumentowane doświadczenia pokazują dwie rzeczy. Po pierwsze, shop floor management jest powszechny, ale często zawodzi w tych samych schematach: brak powiązań między poziomami, przeciążone tablice, spotkania trwające zbyt długo i brak zaangażowania kierownictwa [3]. Po drugie, status quo jest w większości analogowy, z zerwanymi przekazaniami między narzędziami, co utrudnia eskalację i śledzenie działań [24]. Digitalizacja może pomóc, ale tylko wtedy, gdy rutyny są już żywe.

Dla firm korzystających z Microsoft 365 oczywistą opcją jest cyfrowa tablica oparta na Teams, Power BI, Power Apps, Lists i Fabric. Zaplanuj model danych, licencje, interwały odświeżania i zasady ochrony danych pracowników od samego początku. I zacznij od tego, od czego powinno zaczynać się każde wdrożenie: od jednego zespołu pilotażowego, jednej prostej tablicy, 15-minutowego limitu czasu i lidera, który słucha.

## Dalsza lektura na m365.fm

**Wpisy na blogu**
- [Czym jest gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Lista kontrolna i pytania do gemba walk](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Gemba walk a management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Przygotowanie gemba walk: zespół i role](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Błędy w gemba walk: kiedy spacer staje się kontrolą](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Kultura doskonałości operacyjnej na hali produkcyjnej](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Optymalizacja shop floor: sposoby poprawy przepływu](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Pojęcia**
[Shop floor management](https://www.m365.fm/entity/shop-floor-management/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [Tier meeting](https://www.m365.fm/entity/tier-meeting/) · [Visual management](https://www.m365.fm/entity/visual-management/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Micro stops](https://www.m365.fm/entity/micro-stops/) · [Scrap rate](https://www.m365.fm/entity/scrap-rate/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**Powiązane przewodniki**
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist der Host von m365.fm und arbeitet bei der [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) in Stuttgart, Deutschland. Auf m365.fm schreibt er über Lean Management, operative Exzellenz und die Digitalisierung der Fertigung mit Microsoft 365 und Azure. Sein Schwerpunkt liegt darauf, wie bewährte Lean-Routinen wie Shopfloor-Management und der Gemba-Walk mit modernen Datenplattformen zusammenwirken können, ohne ihren Kern zu verlieren.

**Hinweis: Der Autor arbeitet bei der iFAKT GmbH.**

# Sources

All sources accessed on November 20, 2026. Sources 1 to 48 are carried over from the German version; sources 49 to 61 were added and verified for the US version. German-language sources are marked (German).

1. Shopfloor Management. Wikipedia (German). https://de.wikipedia.org/wiki/Shopfloor_Management
2. Conrad, R. W.; Eisele, O.: Shopfloor-Management: Führen am Ort der Wertschöpfung. In: Betriebspraxis & Arbeitsforschung 235, ifaa – Institut für angewandte Arbeitswissenschaft e. V., 2019, pp. 18–24 (German). https://www.arbeitswissenschaft.net/fileadmin/Downloads/Angebote_und_Produkte/Publikationen/ifaa_BA_235_Shopfloormanagement.pdf
3. Was ist Shopfloor Management? (glossary). CETPM – Centre of Excellence for Total Performance Management (with references to Gelbrich 2019, Orth, Schwarz, Hartmann/Melas 2020, Müller-Seegers 2020) (German). https://www.cetpm.de/lexikon/was-ist-shopfloor-management/141/
4. Shopfloor Management: Definition, Bedeutung, Kennzahlen. WGP – Wissenschaftliche Gesellschaft für Produktionstechnik (German). https://wgp.de/de/shopfloor-management/
5. Suzaki, K.: The New Shop Floor Management: Empowering People for Continuous Improvement. Free Press, 1993. https://books.google.com/books/about/New_Shop_Floor_Management.html?id=5vMvj0ge92IC
6. Peters, Remco: Shopfloor-Management. Führen am Ort der Wertschöpfung. LOG_X Verlag, Stuttgart 2009, ISBN 978-3-932298-39-4; quote p. 59, core elements p. 39 (cited via [1]; first name per Wikipedia and trade data; German National Library catalog not reachable at the time of access) (German).
7. Gemba Walk (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
8. Ballé, M.: Gemba, workplace, genchi genbutsu, go-and-see … What's the difference? Lean Enterprise Institute, September 14, 2015. https://www.lean.org/the-lean-post/articles/gemba-workplace-genchi-genbutsu-go-and-see-whats-the-difference/
9. Toyota Motor Corporation: 75 Years of Toyota, Section 7: The Functions that Supported Globalization (Toyota Way 2001). https://www.toyota-global.com/company/history_of_toyota/75years/text/leaping_forward_as_a_global_corporation/chapter4/section7/item4.html
10. Imai, M.: Gemba Kaizen: A Commonsense, Low-Cost Approach to Management. McGraw-Hill, 1997, ISBN 978-0-07-031446-7 (Publishers Weekly review). https://www.publishersweekly.com/9780070314467
11. Gemba and Its Meaning: The Heart of Lean Management. Kaizen Institute. https://kaizen.com/insights/gemba-meaning-lean-management/
12. Genchi Genbutsu. Wikipedia (English). https://en.wikipedia.org/wiki/Genchi_Genbutsu
13. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (publisher page, Routledge). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
14. Womack, J.: Value Stream Walk, Management Walk or … Just Walking Around? Lean Enterprise Institute, June 19, 2018. https://www.lean.org/the-lean-post/articles/value-stream-walk-management-walk-or-just-walking-around/
15. Shook, J.: Foreword. In: Womack, J.: Gemba Walks, 2nd edition. Lean Enterprise Institute, 2013. https://www.lean.org/wp-content/uploads/2021/01/gemba-walks-foreward.pdf
16. Tom Peters: The four-letter word every modern manager needs to know: MBWA. Fortune, December 18, 2015. https://fortune.com/2015/12/18/tom-peters-the-four-letter-word-every-modern-manager-needs-to-know-mbwa/
17. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
18. Leader Standard Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/leader-standard-work/
19. Graban, M.: Book Review: Creating a Lean Culture (David Mann). Lean Blog, November 2005. https://leanblog.org/2005/11/book-review-creating-lean-culture
20. Visual Management (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/visual-management/
21. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
22. Overall Equipment Effectiveness (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
23. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, pp. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
24. wbk Institute of Production Science (KIT) and IPRI: Auf dem Weg zum digitalen Shopfloor Management. Eine Studie zum Stand der Echtzeitentscheidungsfähigkeit und des Industrie 4.0-Reifegrads (ShopfloorPulse project; 18 companies from more than eight industries; undated, probably 2018/2019) (German). https://www.wbk.kit.edu/downloads/Auf%20dem%20Weg%20zum%20digitalen%20Shopfloor%20Management.pdf
25. Bundesvereinigung Logistik (BVL), IPRI, wbk (KIT): ShopfloorPulse, final report IGF project 19372 N (2017–2019) (German). https://www.bvl.de/files/1951/2125/2131/2133/Abschlussbericht_ShopfloorPulse_19372_N.pdf
26. Hertle, C.; Siedelhofer, C.; Metternich, J.; Abele, E.: The next generation shop floor management: How to continuously develop competencies in manufacturing environments. 23rd International Conference on Production Research, Manila 2015; TUprints TU Darmstadt, 2016. https://tuprints.ulb.tu-darmstadt.de/5253
27. VDI 2870 Part 2: Lean production systems; list of methods (project page for the new edition, possible publication date according to VDI: June 2027). VDI. https://vdi.de/richtlinien/details/vdi-2870-blatt-2-lean-production-systems-list-of-methods
28. Collaborate with Power BI in Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-collaborate-microsoft-teams
29. Automatic page refresh in Power BI Desktop. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-automatic-page-refresh
30. Embed a canvas app as tab app. Microsoft Learn (Power Apps). https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-tab
31. Use Power BI Metrics to track goals in Microsoft Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/explore-reports/business-user-teams-goals
32. What is Real-Time Intelligence in Microsoft Fabric? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview
33. What is Fabric Activator? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction
34. What is the connector for OPC UA? Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
35. Frontline team collaboration. Microsoft Learn (Microsoft 365 for frontline workers). https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-team-collaboration?view=o365-worldwide
36. Simplify business processes for frontline teams. Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/simplify-business-processes?view=o365-worldwide
37. Publish task lists to define and track work in your organization. Microsoft Support. https://support.microsoft.com/en-us/teams/shifts/publish-task-lists-to-define-and-track-work-in-your-organization
38. Manage the Lists app for your organization. Microsoft Learn (Microsoft Teams). https://learn.microsoft.com/en-us/microsoftteams/manage-lists-app
39. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
40. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
41. What is shopfloor management? SYMESTIC (German page; English page: https://www.symestic.com/en-us/what-is/shopfloor-management). https://www.symestic.com/de-de/was-ist/shopfloor-management
42. Trummer, R. (GFT Technologies SE): Digitales Shopfloor-Management ermöglicht 20 Prozent mehr Produktivität. Digital Manufacturing Magazin, November 2, 2022 (German). https://www.digital-manufacturing-magazin.de/digitales-shopfloor-management-ermoeglicht-20-prozent-mehr-produktivitaet-a-2b00c53c429d27a792ea7f51627fac4a/
43. Shopfloor Management (glossary). Haufe Akademie (German). https://www.haufe-akademie.de/blog/glossar/shopfloor-management/
44. Section 87 Works Constitution Act (Betriebsverfassungsgesetz, BetrVG): co-determination rights. Federal Ministry of Justice, gesetze-im-internet.de (German). https://www.gesetze-im-internet.de/betrvg/__87.html
45. Important changes (deprecations) coming in Power Apps, Power Automate, and Copilot Studio: Deprecation of Microsoft Dataverse for Teams environments. Microsoft Learn. https://learn.microsoft.com/en-gb/power-platform/important-changes-coming
46. Power Apps licensing FAQs. Microsoft Learn (Power Platform). https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq
47. Configure data flow endpoints. Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint
48. Federal Labor Court (Bundesarbeitsgericht), decision of July 16, 2024, 1 ABR 16/23 (headset system; co-determination under Section 87(1) No. 6 BetrVG) (German). https://www.bundesarbeitsgericht.de/wp-content/uploads/2024/11/1-ABR-16-23.pdf
49. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
50. OSHA: Clarification of OSHA's Position on Workplace Safety Incentive Programs and Post-Incident Drug Testing Under 29 C.F.R. § 1904.35(b)(1)(iv). Standard interpretation memorandum, October 11, 2018. https://www.osha.gov/laws-regs/standardinterpretations/2018-10-11
51. TRIR (Total Recordable Incident Rate). National Safety Council, Injury Facts. https://injuryfacts.nsc.org/definitions/trir-total-recordable-incident-rate/
52. Morgan Lewis: Electronic Monitoring and Algorithmic Management: Permissible Labor Practice or Unlawful Oversight? LawFlash, November 8, 2022 (on NLRB GC Memo 23-02, October 31, 2022). https://www.morganlewis.com/pubs/2022/11/electronic-monitoring-and-algorithmic-management-permissible-labor-practice-or-unlawful-oversight
53. NLRB: GC 25-05 Rescission of Certain General Counsel Memoranda. National Labor Relations Board, February 14, 2025. https://www.nlrb.gov/news-outreach/news-story/gc-25-05-rescission-of-certain-general-counsel-memoranda
54. National Steel Corp. v. National Labor Relations Board, 324 F.3d 928 (7th Cir. 2003), discussing Colgate-Palmolive Co., 323 N.L.R.B. 515 (1997). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/324/928/577225/
55. New York Civil Rights Law § 52-c (notice of electronic monitoring by employers). Justia, 2021 New York Laws. https://law.justia.com/codes/new-york/2021/cvr/article-5/52-c-2/
56. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
57. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
58. How should daily management be structured in a manufacturing plant? Kaizen Institute. https://kaizen.com/insights/daily-management-manufacturing-plant/
59. NIST: The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
60. Best of Technology Award 2025: winners (category Produktion: 2nd place iFAKT GmbH, Polaris IMS). WirtschaftsWoche (German). https://award.wiwo.de/bot/gewinner-2025/
61. iFAKT GmbH: imprint (Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart HRB 22661) and home page (TÜV SÜD seal ISO 9001 & ISO/IEC 27001). https://www.ifakt.de/de/imprint and https://www.ifakt.de/
