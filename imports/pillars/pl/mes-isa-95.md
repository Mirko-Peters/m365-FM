# SEO metadata

| Field | Value |
|---|---|
| Meta title | Systemy MES i ISA-95: przewodnik po funkcjach i ROI |
| Meta description | Co robi system MES, jak poziomy i modele aktywności ISA-95 go opisują, MES kontra ERP i SCADA, lista kontrolna dostawców, plan wdrożenia i zwrot z inwestycji. |
| Slug | `mes-isa-95` |

# Manufacturing Execution System (MES) i ISA-95: funkcje, poziomy, wybór i ROI

> **Krótka odpowiedź:** System realizacji produkcji (MES, manufacturing execution system) to warstwa oprogramowania, która zarządza, monitoruje i rejestruje realizację zleceń produkcyjnych na hali produkcyjnej, w czasie rzeczywistym, pomiędzy systemem ERP, który planuje, a systemami sterowania, które sterują maszynami [8]. ISA-95 (ANSI/ISA-95, na poziomie międzynarodowym IEC 62264) to norma, która określa, gdzie znajduje się ta warstwa (poziom 3, zarządzanie operacjami produkcyjnymi), jakie działania obejmuje i jakie informacje wymienia z ERP [1][3].

> **Najważniejsze wnioski**
> - Gartner definiuje MES jako oprogramowanie zorientowane na produkcję, które „zarządza, monitoruje i synchronizuje realizację rzeczywistych procesów fizycznych w czasie rzeczywistym” i koordynuje zlecenia produkcyjne z systemami harmonogramowania, ERP, PLM i jakości [8].
> - ISA-95 składa się z ośmiu części. Część 1 (modele i terminologia) została ponownie opublikowana w 2025 roku; część 3 (modele działań) pochodzi z 2013 roku [1][2].
> - ISA-95 opisuje pięć poziomów. Poziomy 0–2 to proces fizyczny i jego sterowanie, poziom 3 to zarządzanie operacjami produkcyjnymi (MES i powiązane systemy), a poziom 4 to planowanie biznesowe i logistyka (ERP) [1].
> - Model działań z części 3 dzieli poziom 3 na cztery kategorie (produkcja, utrzymanie ruchu, testy jakości, zapasy) i powtarza w każdej z nich tych samych osiem działań: zarządzanie definicjami, zarządzanie zasobami, szczegółowe harmonogramowanie, dyspozycja, zarządzanie wykonaniem, zbieranie danych, śledzenie i analiza wydajności [3].
> - Model MESA International z 1997 roku wymienił 11 funkcji MES; ISA-95 later wchłonęła tę koncepcję [9][12]. MESA zakończyła działalność 30 czerwca 2026 roku, a jej treści przejęło ISA [11].
> - Wspólna przestrzeń nazw (UNS, unified namespace) zmienia sposób przepływu danych; nie zastępuje logiki MES ani słownictwa ISA-95.
> - Uzasadnienie biznesowe wdrożenia MES zwykle opiera się na jednej lub dwóch pozycjach korzyści. W poniższym przykładzie ten sam projekt ma dodatnią wartość NPV w pięcioletnim horyzoncie w scenariuszu bazowym i ujemną w scenariuszu ostrożnym.
> - Zacznij od modelu danych i jednego strumienia wartości, a nie od pełnej listy funkcji.

## Spis treści

1. [Czym jest system realizacji produkcji (MES)?](#czym-jest-system-realizacji-produkcji-mes)
2. [Krótka historia: od AMR i MESA-11 do ISA-95 i dalej](#krótka-historia-od-amr-i-mesa-11-do-isa-95-i-dalej)
3. [ISA-95 wyjaśniona: norma, jej części i poziomy](#isa-95-wyjaśnione-standard-jego-części-i-poziomy)
4. [Modele ISA-95, które mają znaczenie w projekcie MES](#modele-isa-95-które-mają-znaczenie-w-projekcie-mes)
5. [MES kontra ERP kontra MOM kontra SCADA i inne systemy zakładowe](#mes-vs-erp-vs-mom-vs-scada-i-inne-systemy-zakładowe)
6. [Funkcje MES szczegółowo](#funkcje-mes-szczegółowo)
7. [Integracja: B2MML, OPC UA, MTConnect i wspólna przestrzeń nazw](#integracja-b2mml-opc-ua-mtconnect-i-unified-namespace)
8. [MES w branżach regulowanych](#mes-w-branżach-regulowanych)
9. [Opcje wdrożenia i architektury: pakiet, platforma, moduł ERP, chmura](#opcje-wdrożenia-i-architektury)
10. [Budować czy kupować](#budowa-własna-czy-zakup)
11. [Lista kontrolna wyboru dostawcy MES](#lista-kontrolna-wyboru-dostawcy-mes)
12. [Plan wdrożenia MES](#plan-wdrożenia-mes)
13. [Koszt i ROI MES na przykładzie](#koszt-mes-i-roi-na-przykładzie)
14. [KPI MES: co mierzyć i jak](#kpi-mes-co-mierzyć-i-jak)
15. [Ludzie i hala produkcyjna](#ludzie-i-hala-produkcyjna)
16. [Typowe błędy przy wdrażaniu MES](#typowe-błędy-przy-wdrażaniu-mes)
17. [Ograniczenia MES i ISA-95](#ograniczenia-mes-i-isa-95)
18. [Słowniczek](#glosariusz)
19. [FAQ](#faq)
20. [Podsumowanie i pierwsze kroki](#podsumowanie-i-pierwsze-kroki)

## Czym jest system realizacji produkcji (MES)?

System realizacji produkcji to oprogramowanie, które zamienia zlecenie produkcyjne w gotowe, udokumentowane wyroby. ERP określa, *co* ma zostać wyprodukowane, w jakiej ilości i na kiedy. Maszyny i ich sterowniki wytwarzają części. MES działa pomiędzy nimi: zwalnia i szereguje pracę, informuje operatorów i maszyny, co robić dalej, zbiera to, co faktycznie się wydarzyło (ilości, czasy, parametry, materiały, wady, kto to wykonał), i przekazuje wynik z powrotem.

Definicja rynkowa Gartnera jest dobrym punktem odniesienia, ponieważ jest neutralna wobec dostawców i precyzyjna. Nazywa MES „wyspecjalizowaną klasą oprogramowania ukierunkowanego na produkcję”, które „zarządza, monitoruje i synchronizuje w czasie rzeczywistym fizyczne procesy związane z przekształcaniem surowców w półwyroby i/lub wyroby gotowe”. Dodaje, że systemy te koordynują zlecenia pracy z harmonogramowaniem produkcji oraz z systemami przedsiębiorstwa, takimi jak ERP, zarządzanie cyklem życia produktu i zarządzanie jakością, dostarczają informacji zwrotnej o wynikach procesów i wspierają identyfikowalność oraz genealogię aż do poziomu komponentów i materiałów [8].

### Główna idea w jednym zdaniu

MES zamyka pętlę między planem a rzeczywistością, zmiana po zmianie, tak aby każdy, od operatora po kontrolera, pracował na tym samym, aktualnym zapisie tego, co wydarzyło się na hali.

### Co robi MES w typowej zmianie

Konkretny obraz pomaga bardziej niż lista funkcji. Weźmy średniej wielkości zakład, który obrabia i montuje zawory hydrauliczne na czterech liniach:

1. **06:00, start zmiany.** MES pokazuje kierownikowi zmiany listę dyspozycyjną dla Linii 2: dwanaście zleceń zwolnionych z ERP, uszeregowanych przez planistę tak, aby zminimalizować przezbrojenia. Dwa zlecenia są oznaczone, ponieważ jeden przyrząd pomiarowy ma przeterminowaną kalibrację.
2. **06:10.** Operator skanuje kartę obiegową pierwszego zlecenia (lub wybiera je na terminalu). MES sprawdza, czy operator jest uprawniony do tej operacji, czy wersja programu w CNC odpowiada zwolnionemu marszrutowi oraz czy partia surowca w regale należy do zlecenia. Pokazuje aktualną wersję instrukcji roboczej.
3. **06:12 do 13:30.** Maszyna raportuje cykle i stany (praca, bezczynność, alarm) przez OPC UA lub MTConnect. MES liczy dobre i odrzucone części, rejestruje przestoje i prosi operatora o kod przyczyny, gdy postój przekracza dwie minuty. Pomiary w procesie trafiają na karty SPC; punkt poza kontrolą wstrzymuje kolejną operację do czasu zatwierdzenia przez technika.
4. **11:45.** Partia uszczelek okazuje się podejrzana. Ponieważ MES zapisał, która partia trafiła do którego numeru seryjnego zaworu, dział jakości może wyizolować 140 zaworów zamiast całotygodniowej produkcji.
5. **14:00, przekazanie zmiany.** MES raportuje ilości, złom, OEE i otwarte problemy następnej zmianie oraz przekazuje potwierdzone ilości i zużycie materiałów do ERP.

Bez MES dużo z tego odbywa się na papierowych kartach obiegowych, tablicach i arkuszach kalkulacyjnych, wpisywanych do ERP po godzinach lub dniach. To działa, do pewnego momentu. Koszt pojawia się w postaci spóźnionych lub błędnych danych, wolnych wycofań produktów, ucieczek jakościowych i długich dochodzeń. Materiał [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) omawia przejście od papierowych kart obiegowych do cyfrowych instrukcji roboczych, co jest często pierwszym modułem MES, z którego zakład zaczyna korzystać.

### Miejsce MES wśród systemów zakładu

Norma ISA-95 umieszcza MES na **Poziomie 3**, zarządzaniu operacjami produkcyjnymi, pomiędzy planowaniem biznesowym i logistyką na Poziomie 4 (ERP) a warstwami sterowania na Poziomach 0–2 (czujniki, PLC, DCS, SCADA) [1]. Poziom 3 nie jest jednym systemem. Ta sama warstwa obejmuje system zarządzania informacją laboratoryjną (LIMS), system zarządzania magazynem (WMS), system zarządzania utrzymaniem ruchu (CMMS) i inne; razem są często nazywane systemami zarządzania operacjami produkcyjnymi [14]. Sekcja 5 porównuje je.

### Korzyści z MES i to, co mówią dowody

Większość stron o MES wymienia korzyści z imponującymi procentami i bez źródła. Oto, co można stwierdzić z ostrożnością:

| Korzyść | Mechanizm | Co mierzyć | Zastrzeżenie |
|---|---|---|---|
| Szybsze i dokładniejsze dane produkcyjne | Dane rejestrowane u źródła, a nie przepisywane ręcznie | Opóźnienie danych, ręczne wpisy na zlecenie | Tylko wtedy, gdy dane podstawowe (marszruty, BOM) są poprawne |
| Krótsze czasy cyklu | Mniej czekania na dokumentację, szybsze zwolnienie i wysyłka | Czas realizacji zlecenia, czas w kolejce | *Control Engineering* podaje, że MESA International oszacowało średnie skrócenie czasów cyklu produkcyjnego o 45 procent; należy traktować to jako twierdzenie o korelacji, a nie jako wzorzec odniesienia [9] |
| Mniej wycieków jakościowych | Wymuszone kontrole, SPC, blokady przed kolejnym krokiem | Wydajność za pierwszym razem (FPY), reklamacje klientów | Zależy od tego, czy kontrole są faktycznie skonfigurowane jako twarde zatrzymania |
| Szybsze i węższe wycofania produktów | Genealogia partii i numerów seryjnych | Czas identyfikacji dotkniętych jednostek | Wymaga zdyscyplinowanego skanowania materiałów |
| Wyższe OEE na wąskim gardle | Widoczne przyczyny przestojów, szybsza reakcja | OEE, MTTR | Ma wartość pieniężną tylko wtedy, gdy dodatkową produkcję da się sprzedać |
| Gotowość do audytu | Rekordy elektroniczne, ścieżki audytu, podpisy elektroniczne | Godziny na audyt, ustalenia | Nakład walidacji w branżach regulowanych jest znaczny |

Artykuł *Automation World* z 2006 roku podawał, że ponad 40 globalnych producentów użyło ISA-95 do określenia wymagań wobec MES, a czas definiowania wymagań skrócił się z kilku miesięcy do czterech–sześciu tygodni [10]. To skromny, wiarygodny efekt wspólnego słownictwa i dobry powód, by przeczytać kolejne sekcje przed napisaniem dokumentu wymagań.

## Krótka historia: od AMR i MESA-11 do ISA-95 i dalej

Historia wyjaśnia, dlaczego dostawcy, analitycy i normy używają nieco różnych słów na oznaczenie tego samego zjawiska.

### Wczesne lata 90.: termin MES

Według *Automation World* bostońska firma analityczna AMR Research wprowadziła koncepcję MES w 1992 roku jako warstwę między systemami przedsiębiorstwa a systemami sterowania, zapewniającą widoczność i kontrolę [10]. Wcześniej zakłady korzystały z systemów sterowania produkcją warsztatową, zbierania danych i jakości, często budowanych wewnętrznie do jednego zadania; ich funkcje się pokrywały, a systemy rzadko ze sobą współpracowały [14].

### 1997: MESA-11

MESA International (Manufacturing Enterprise Solutions Association) opublikowało w 1997 roku białą księgę o MES [15], a wraz z nią model funkcjonalny znany jako **MESA-11** [12]. Jedenaście funkcji to [9]:

1. Alokacja i status zasobów
2. Szczegółowe planowanie operacji/harmonogramowanie
3. Dyspozycja jednostek produkcyjnych
4. Kontrola dokumentów
5. Akwizycja danych
6. Zarządzanie pracą
7. Zarządzanie jakością
8. Zarządzanie procesem
9. Zarządzanie utrzymaniem ruchu
10. Śledzenie produktu i genealogia
11. Analiza wydajności

Definicja MESA z 1997 roku podkreślała, że MES powinien „dostarczać informacje umożliwiające optymalizację działań produkcyjnych”, a takie sformułowanie *Automation World* nadal uznawało w 2006 roku za praktyczne [10]. Kilka z jedenastu funkcji (utrzymanie ruchu, praca, kontrola dokumentów) jest dziś często realizowanych przez osobne systemy, dlatego model już wtedy krytykowano jako „zbyt szeroki” [9].

### 2000–2013: ISA-95

Komitet ISA95 oparł się na Purdue Reference Model for computer integrated manufacturing [1]. Część 1 ukazała się w 2000 roku, a część 3, z modelami czynności poziomu 3, w 2005 roku; źródła wtórne opisują ISA-95 jako połączenie funkcjonalnego ujęcia MESA z hierarchią Purdue [12][14]. Kolejne części ukazywały się aż do 2020 roku, a część 1 została ponownie wydana w 2025 roku [1][2]. Sekcja 3 zawiera ich wykaz.

### Od 2004: MOM, collaborative MES i późniejsze modele

Ponieważ ISA-95 nazwało poziom 3 „zarządzaniem operacjami produkcyjnymi” (manufacturing operations management), szerszy zakres (produkcja oraz operacje jakości, utrzymania ruchu i magazynowe) zaczęto określać terminem MOM, a MES traktować jako jego rdzeń produkcyjny [10]. Sama MESA opublikowała kilka późniejszych modeli; artykuł *Control Engineering* o pierwotnym modelu zauważa, że był on jednym z ośmiu modeli MESA w tamtym czasie [9]. Nie udało nam się zweryfikować na podstawie źródła pierwotnego nazw i lat późniejszych modeli MESA (często przywoływanych jako c-MES z 2004 roku oraz model MESA z 2008 roku) [unverified]. Strona MESA z historią modeli przekierowuje obecnie do ISA, a ogłoszenie MESA z 2022 roku o najnowszym modelu mówi jedynie, że wydano „trzy (obecnie cztery) modele MESA” [43].

### 2026: MESA rozwiązuje się, a ISA przejmuje jej zawartość

MESA International zagłosowała za zaprzestaniem działalności z dniem 30 czerwca 2026 r.; ISA stwierdza, że „treści i programy edukacyjne MESA zostaną przejęte przez ISA” [11]. Ma to znaczenie praktyczne, ponieważ MESA utrzymywała **B2MML**, implementację ISA-95 w XML, używaną w wielu interfejsach ERP-MES [5]. Zanim określisz w umowie schematy B2MML i przyszłe wersje, sprawdź u ISA, gdzie będą publikowane. Według stanu z listopada 2026 r. schematy B2MML i BatchML nadal są opublikowane w repozytorium MESAInternational na GitHub, a plik README nie wspomina o przeniesieniu [36] [unverified: przyszłe miejsce publikacji po przeniesieniu nie jest udokumentowane].

### Lata 20. XXI wieku: IIoT, chmura i komponowalny MES

Trzy zmiany kształtują obecne projekty MES: dane z maszyn są tańsze w zbieraniu (OPC UA, MTConnect, MQTT), wdrożenia w chmurze i hybrydowe stały się normą, a dostawcy coraz częściej sprzedają MES jako platformę mniejszych aplikacji zamiast monolitycznego pakietu („komponowalny” lub MES „nowej generacji”). Rozdział 9 opisuje, co to oznacza dla Twojej architektury i umowy.

## ISA-95 wyjaśnione: standard, jego części i poziomy

ISA opisuje ISA-95, „znany również jako ANSI/ISA-95 lub IEC 62264”, jako międzynarodowy zestaw norm integracji systemów logistycznych z systemami sterowania produkcją [1]. Porządkuje procesy technologiczne i biznesowe w warstwy zdefiniowane przez czynności wykonywane na każdej z nich i opisuje, jak przedsiębiorstwo może budować interfejsy między warstwami. ISA podkreśla, że architektura oparta na modelu Purdue może być stosowana „niezależnie od użytej technologii”, a hierarchia wyposażenia sprawdza się równie dobrze w przemyśle dyskretnym, ciągłym i logistycznym [1].

Z tego wynikają dwie konsekwencje. Po pierwsze, ISA-95 jest **neutralny technologicznie**: nie mówi nic o tym, jakiej bazy danych, protokołu czy dostawcy używasz. Po drugie, jego głównym przedmiotem jest **interfejs między poziomem 3 a poziomem 4** [1], czyli dokładnie to miejsce, w którym najczęściej utykają projekty MES (kto jest właścicielem trasy produkcji, kiedy ilość uznaje się za „potwierdzoną”, jak księguje się złom).

### ISA-95 i IEC 62264: ta sama treść, inna numeracja

ISA opracowuje serię jako ANSI/ISA-95; IEC publikuje ją jako IEC 62264. Wydanie części 1 z 2025 r. nosi oznaczenie ANSI/ISA-95.00.01-2025 (IEC 62264-1 Mod), gdzie „Mod” oznacza zmodyfikowaną adopcję [1][2]. Wydania nie zawsze są zsynchronizowane. IEC 62264-1 i -2 opublikowano w 2013 r., część 3 w 2016 r., część 4 w 2015 r., a część 5 w 2016 r. [7]; IEC 62264-6, model usług przesyłania komunikatów, ukazał się jako wydanie 1.0 26 czerwca 2020 r. [6]. Kiedy umowa lub dokument wymagań powołuje się na „ISA-95”, podaj numer części i wydanie.

### Osiem części ISA-95

| Część | Tytuł (ANSI/ISA-95) | Aktualne wydanie wg ISA | Zakres prostym językiem |
|---|---|---|---|
| 1 | Modele i terminologia | 2025 (IEC 62264-1 Mod) | Zakres operacji produkcyjnych i sterowania, sposób organizacji aktywów fizycznych, funkcje interfejsów, wspólne informacje |
| 2 | Obiekty i atrybuty do integracji systemów przedsiębiorstwa i sterowania | 2018 | Obiekty i atrybuty wymieniane na interfejsie poziomu 3 / poziomu 4 |
| 3 | Modele czynności w zarządzaniu operacjami produkcyjnymi | 2013 | Czynności wewnątrz poziomu 3 i część danych, którymi wymieniają się |
| 4 | Obiekty i atrybuty do integracji zarządzania operacjami produkcyjnymi | 2018 | Modele obiektów dla informacji przepływających między czynnościami poziomu 3, niezależnie od stopnia automatyzacji |
| 5 | Transakcje biznes-produkcja | 2018 | Transakcje między poziomami 3 i 4 (czasowniki takie jak pobierz, przetwórz, synchronizuj) |
| 6 | Model usług przesyłania komunikatów | 2014 | Przesyłanie komunikatów między poziomami 3 i 4 oraz w obrębie poziomu 3 |
| 7 | Model usług aliasów | 2017 | Odwzorowanie równoważnych identyfikatorów między operacjami produkcyjnymi a innymi dziedzinami |
| 8 | Profile wymiany informacji | 2020 | Profile dla konkretnych interfejsów między poziomami 4 i 3 lub między czynnościami poziomu 3 |

Źródło: strona ISA o ISA-95 [1]. Zwróć uwagę, że ISA podaje rok 2014 dla części 6, podczas gdy wydanie IEC tej części pochodzi z 2020 r. [6].
W większości projektów MES najwięcej pracy wykonują części 1–3: dostarczają słownictwa, modelu poziomów i modelu czynności potrzebnych w dokumencie wymagań. Części 2, 4 i 5 mają znaczenie przy projektowaniu interfejsów i modeli danych. Części 6–8 interesują głównie architektów integracji i dostawców oprogramowania.

### Co się zmieniło w wydaniu Części 1 z 2025 roku

ISA ogłosiła nową Część 1 normy 10 kwietnia 2025 roku. Aktualizuje ona wersję z 2010 roku, odzwierciedla konkretne funkcje przedsiębiorstwa, precyzuje granicę między domeną przedsiębiorstwa a domenami wytwarzania i sterowania oraz poprawia spójność z pozostałymi częściami [2]. Przewodniczący komitetu ISA95, Christian Monchinski, powiązał ją z "coraz bardziej modułowymi architekturami w operacjach biznesowych i produkcyjnych" oraz przejściem do projektów zorientowanych na dane, a także stwierdził, że aktualizacja "potwierdza znaczenie standardowych interfejsów integracyjnych" [2]. Dla praktyków to sygnał: ISA-95 ma pozostać wspólnym słownikiem dla modułowych, sterowanych zdarzeniami architektur, a nie zostać przez nie zastąpiona.

### Pięć poziomów ISA-95

ISA-95 dziedziczy model poziomów po modelu Purdue. Poziomy opisują *funkcje*, a nie komputery ani segmenty sieci [1][4].

| Poziom | Nazwa | Co się tu dzieje (nasze podsumowanie) | Typowe systemy | Typowe ramy czasowe |
|---|---|---|---|---|
| 4 | Planowanie biznesowe i logistyka | Zamówienia, zapotrzebowanie materiałowe, zapasy, wysyłka, kalkulacja kosztów zakładu | ERP, planowanie łańcucha dostaw | Miesiące, tygodnie, dni [4] |
| 3 | Zarządzanie operacjami produkcyjnymi | Sterowanie przepływem pracy i recepturami w celu wytworzenia produktów końcowych; szczegółowe harmonogramowanie, dyspozycja, rejestracja, jakość, utrzymanie ruchu i operacje magazynowe | MES, LIMS, WMS, CMMS, QMS, historian, APS (szczegółowe harmonogramowanie) | Dni, zmiany, godziny, minuty, sekundy [4] |
| 2 | Monitorowanie i sterowanie nadzorcze | Monitorowanie i sterowanie procesem fizycznym | SCADA, HMI, DCS, PLC | Reakcje w czasie rzeczywistym mierzone w ułamkach sekund [4] |
| 1 | Pomiar i manipulacja | Czujniki, siłowniki, inteligentne urządzenia, zawory | Urządzenia polowe | Nieokreślone w źródłach użytych tutaj |
| 0 | Proces fizyczny | Maszyny i przetwarzany materiał | Maszyny, linie, urządzenia procesowe | Nie dotyczy |

Dwie uwagi. Strona ISA umieszcza SCADA w wierszu Poziomu 3 jako przykład systemu Poziomu 3 obok MES [1], natomiast podsumowanie OPC Foundation przypisuje automatykę i sterowanie do Poziomów 1 i 2, a MOM do Poziomu 3 [4]. W praktyce SCADA obejmuje granicę 2/3: jej ekrany i obsługa alarmów to sterowanie nadzorcze (Poziom 2), a funkcje historii i raportowania często służą Poziomowi 3. Nie spierajmy się o pudełka; ustalmy, który system jest systemem źródłowym dla każdego fragmentu danych. Po drugie, OPC Foundation podkreśla, że "każdy poziom ma własną definicję czasu rzeczywistego" [4]. MES, który odświeża pulpit co 30 sekund, jest czasu rzeczywistego dla nadzorcy i zbyt wolny dla blokady maszyny.

### Poziomy to nie strefy sieciowe

Częstym błędem jest traktowanie poziomów ISA-95 i poziomów Purdue używanych w bezpieczeństwie OT jako tego samego. ISA-95 opisuje funkcje i informacje; segmentacja sieci podlega innej logice, obecnie określonej w ISA/IEC 62443 za pomocą stref i kanałów komunikacyjnych (conduits) [23]. ISA zauważa, że ISA-95 opiera się na modelu referencyjnym Purdue przy opisie segmentacji sieci w systemach sterowania przemysłowego [1], ale *funkcja* Poziomu 3 może działać w dzierżawie chmurowej, podczas gdy *serwer* Poziomu 3 w Twoim zakładzie znajduje się w określonej strefie bezpieczeństwa. Przewodnik [OT cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) omawia strefy, kanały komunikacyjne i DMZ; NIST SP 800-82 Rev. 3 to amerykański przewodnik po bezpieczeństwie OT [24].

### Czy ISA-95 nadal jest istotna?

Odpowiedź samej ISA: poziomy nadal pomagają opisywać granice systemów dla Przemysłu 4.0 i inteligentnej produkcji, mimo że model powstał jako hierarchia [1]. To zgadza się z praktyką. Hierarchia jako *ścieżka danych* (każda wartość wspina się poziom po poziomie przez interfejsy punkt-punkt) słabo się zestarzała, a sekcja 7 pokazuje alternatywy. Hierarchia jako *mapa odpowiedzialności i słownictwa* nie straciła na znaczeniu.

## Modele ISA-95, które mają znaczenie w projekcie MES

ISA-95 zawiera kilka modeli. Cztery z nich warto znać z nazwy, zanim napiszesz dokument z wymaganiami dla MES.

### 1. Hierarchia funkcjonalna (poziomy)

Omówiona wyżej. Użyj jej do narysowania diagramu kontekstu systemu, na którym każdy istniejący system zostanie umieszczony na swoim poziomie, a każdy interfejs będzie oznaczoną strzałką.

### 2. Hierarchia wyposażenia

ISA-95 organizuje fizyczny zakład w hierarchię wyposażenia opartą na rolach: **przedsiębiorstwo, zakład, obszar, centrum pracy, jednostka robocza** (nazwy używane w popularnych opracowaniach oraz w siostrzanym przewodniku o Azure) [1][27]. Centra pracy są dodatkowo typizowane, na przykład jako gniazda procesowe (wsad), jednostki produkcyjne (produkcja ciągła), linie produkcyjne (produkcja dyskretna) i strefy magazynowe, z odpowiadającymi im jednostkami roboczymi, takimi jak jednostki, gniazda robocze i jednostki magazynowe. Model informacyjny ISA-95 organizacji OPC Foundation wymienia dokładnie te nazwy poziomów [32], a publiczny szkic części 1 z 1999 roku przypisuje gniazda i jednostki procesowe do wsadu, jednostki produkcyjne do produkcji ciągłej, a linie produkcyjne i gniazda robocze do produkcji dyskretnej [33]. Mapowanie OPC Foundation zauważa, że wyposażenie może być zagnieżdżane, a model opisuje *role*, jakie wyposażenie pełni w produkcji, oddzielnie od fizycznych zasobów, z których się składa [5].

Dlaczego to ważne: hierarchia wyposażenia staje się twoją konwencją nazewniczą w MES, historianie, CMMS, drzewie tematów unified namespace i platformie danych. Zakład, który nazywa tę samą maszynę „L2-CNC3” w jednym systemie, „Linia 2 Mazak” w drugim i „WC-4711” w trzecim, płaci za to przy każdym raporcie i każdej integracji.

**Przykładowa hierarchia dla zakładu zaworów:**

| Poziom | Przykład |
|---|---|
| Przedsiębiorstwo | Acme Fluid Power |
| Zakład | Zakład w Dayton |
| Obszar | Obróbka skrawaniem; Montaż i testy; Magazyn |
| Centrum pracy | Linia 2 (linia produkcyjna); Stanowisko testowe T1 (grupa gniazd roboczych); Magazyn surowców (strefa magazynowa) |
| Jednostka robocza | CNC 3; Stacja mycia; Szczelinomierz LT-1; Strefa regałów A |

### 3. Modele obiektów (część 2 i część 4)

ISA-95 opisuje informacje wymieniane między ERP a MES oraz między czynnościami MES jako modele obiektów z atrybutami. Specyfikacja towarzysząca organizacji OPC Foundation wymienia cztery modele zasobów, którymi wymieniają się systemy ERP i MOM: **materiał** (obejmujący właściwości materiałów i partie), **wyposażenie** (w zakresie dotyczącym wykonywanych operacji), **zasoby fizyczne** (aktywa składające się na wyposażenie) oraz **personel** (role i kwalifikacje) [4][5]. Wokół nich ISA-95 porządkuje wymianę w cztery kategorie informacji, odzwierciedlające cykl życia zlecenia: **definicja produktu** (jak go wytworzyć), **zdolność produkcyjna** (jakie zasoby są dostępne), **harmonogram produkcji** (co i kiedy wytworzyć) oraz **wyniki produkcji** (co zostało wytworzone). Kategorie odpowiadają nazwom czynności z części 3 [3]; publiczny szkic części 1 z 1999 roku grupuje harmonogram i wyniki jako „informacje produkcyjne” [33].

Praktyczna zasada wynikająca z tego modelu: ERP odpowiada za „co i kiedy”, a MES za „jak i co faktycznie się wydarzyło”. Gdy ERP przechowuje marszrutę z czasami operacji, a MES bardziej szczegółową definicję pracy z parametrami i instrukcjami, zdecyduj wprost, który system jest wzorcem dla którego atrybutu i jak przepływają zmiany.

### 4. Model czynności (część 3)

To najbardziej przydatna i najmniej wyjaśniana część ISA-95. Część 3 dzieli zarządzanie operacjami produkcyjnymi na cztery kategorie: **operacje produkcyjne, operacje utrzymania ruchu, operacje badań jakości i operacje magazynowe**. W każdej z nich stosuje się te same osiem ogólnych czynności [3]:

| Czynność ogólna | Operacje produkcyjne | Operacje utrzymania ruchu | Operacje testów jakości | Operacje magazynowe |
|---|---|---|---|---|
| Zarządzanie definicjami | Zarządzanie definicjami produktów (trasy technologiczne, receptury, instrukcje stanowiskowe) | Zarządzanie definicjami utrzymania ruchu (listy zadań, procedury) | Zarządzanie definicjami testów jakości (specyfikacje badań, plany pobierania próbek) | Zarządzanie definicjami magazynowymi (reguły składowania i przemieszczeń) |
| Zarządzanie zasobami | Zarządzanie zasobami produkcyjnymi (ludzie, urządzenia, dostępność i kwalifikacja materiałów) | Zarządzanie zasobami utrzymania ruchu (technicy, części zamienne, narzędzia) | Zarządzanie zasobami testów jakości (sprzęt laboratoryjny, analitycy) | Zarządzanie zasobami magazynowymi (lokalizacje składowania, sprzęt do obsługi materiałów) |
| Szczegółowe planowanie | Szczegółowe planowanie produkcji (kolejność na zasobach) | Szczegółowe planowanie utrzymania ruchu | Szczegółowe planowanie testów jakości | Szczegółowe planowanie magazynowe (przemieszczenia, uzupełnianie zapasów) |
| Dysponowanie | Dysponowanie produkcją (zwalnianie zleceń na stanowiska) | Dysponowanie utrzymaniem ruchu (zlecenia pracy dla techników) | Dysponowanie testami jakości (próbki do laboratorium) | Dysponowanie magazynowe (zlecenia przemieszczeń) |
| Zarządzanie wykonaniem | Zarządzanie wykonaniem produkcji (prowadzenie i weryfikacja wykonania) | Zarządzanie wykonaniem utrzymania ruchu | Zarządzanie wykonaniem testów jakości | Zarządzanie wykonaniem operacji magazynowych |
| Zbieranie danych | Zbieranie danych produkcyjnych (liczba sztuk, czasy, parametry) | Zbieranie danych utrzymania ruchu (ustalenia, godziny, części) | Zbieranie danych testów jakości (wyniki) | Zbieranie danych magazynowych (ruchy, inwentaryzacje) |
| Śledzenie | Śledzenie produkcji (WIP, genealogia, raportowanie do ERP) | Śledzenie utrzymania ruchu (historia per zasób) | Śledzenie testów jakości (wyniki per partia lub numer seryjny) | Śledzenie magazynowe (lokalizacja i status materiału) |
| Analiza wydajności | Analiza wydajności produkcji (OEE, wydajność, czas cyklu) | Analiza wydajności utrzymania ruchu (MTBF, MTTR) | Analiza wydajności testów jakości (zdolność, trendy) | Analiza wydajności magazynowej (rotacje, dokładność) |

Nazwy wierszy i kolumn odpowiadają tytułom klauzul ANSI/ISA-95.00.03-2013 (klauzule 6–9) [3]; przykłady w nawiasach pochodzą od nas. *Automation World* ujął ten sam podział jako „produkcja, utrzymanie ruchu, jakość i magazyn” [13].

**Jak używać macierzy w projekcie:** Wydrukuj ją jako siatkę 4 × 8. Dla każdej z 32 komórek zapisz, który system wykonuje tę czynność dziś (papier, Excel, ERP, MES, CMMS, LIMS, WMS, nikt), oraz który system powinien ją wykonywać po projekcie. Puste komórki oraz komórki z trzema systemami są przedmiotem dyskusji o zakresie. Typowy wynik dla zakładu dyskretnego: kolumna produkcji w większości w MES, kolumna utrzymania ruchu w CMMS, testy jakości podzielone między MES (kontrole w procesie) a LIMS lub QMS (badania laboratoryjne, CAPA), magazyn podzielony między ERP (stany magazynowe) a WMS lub MES (przemieszczenia na linię). Szczegółowe planowanie w kolumnie produkcji często trafia do APS (zob. [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)).

### Uwaga o ISA-88 i VDI 5600

Dwa powiązane standardy pojawiają się w projektach MES. **ISA-88** to standard sterowania wsadowego; jego proceduralny model sterowania (procedury, procedury jednostkowe, operacje, fazy) został przyjęty przez IEC jako IEC 61512-1 [34] i jest zwykłym sposobem strukturyzacji receptur w farmacji, przemyśle spożywczym i chemicznym. BatchML, uzupełnienie B2MML, implementuje ISA-88 [36], a wiele produktów MES implementuje elektroniczne dokumentacje wsadowe na jego bazie [unverified: obserwacja praktyki]. **VDI 5600**, wytyczna Stowarzyszenia Inżynierów Niemieckich (część 1 z października 2016), wymienia zadania MES w sposób podobny do MESA-11 i jest powszechna w niemieckich zakładach oraz w zapytaniach ofertowych niemieckich spółek macierzystych [21].

## MES vs. ERP vs. MOM vs. SCADA i inne systemy zakładowe

„Jaka jest różnica między MES a ERP?” to jedno z najczęstszych pytań dotyczących MES, zaraz po porównaniu MES z SCADA. Krótka wersja: ERP planuje i prowadzi księgowość, MES wykonuje i rejestruje, SCADA nadzoruje maszyny i steruje nimi. Dłuższa wersja wymaga tabeli, ponieważ granice zależą od branży i od produktów, które już posiadasz.

### Tabela porównawcza

| Wymiar | ERP (Poziom 4) | MES (Poziom 3) | MOM (Poziom 3, szerszy zakres) | SCADA / HMI (Poziom 2, częściowo 3) | Historian |
|---|---|---|---|---|---|
| Główne pytanie | Co mamy wytworzyć, kupić i wysłać oraz ile to kosztowało? | Jak dokładnie wykonuje się to zlecenie i co faktycznie się wydarzyło? | Jak współpracują produkcja, jakość, utrzymanie ruchu i operacje magazynowe? | Co maszyna lub proces robi teraz i jak nim sterować? | Jakie były wartości procesowe w czasie? |
| Horyzont czasowy | Miesiące, tygodnie, dni [4] | Zmiany, godziny, minuty, sekundy [4] | Tak samo jak MES | Od ułamków sekund do sekund [4] | Od sekund do lat |
| Jednostka pracy | Zlecenie produkcyjne, zamówienie zakupu, zamówienie sprzedaży | Operacja, krok, partia, numer seryjny | Zlecenie plus badanie, zlecenie serwisowe, zlecenie przesunięcia | Tag, alarm, wartość zadana | Tag szeregu czasowego |
| Typowe dane | BOM, marszruta, koszt standardowy, stany magazynowe, popyt | Instrukcje robocze, rzeczywiste czasy i ilości, parametry, genealogia, defekty, zatwierdzenia | Dane MES oraz wyniki laboratoryjne, historia utrzymania ruchu, przesunięcia materiałów | Wartości na żywo, alarmy, polecenia operatora | Skompresowane szeregi czasowe |
| Użytkownicy | Planowanie, zakupy, finanse, sprzedaż | Operatorzy, brygadziści, jakość, inżynierowie procesu | Kierownictwo zakładu, wszystkie funkcje operacyjne | Operatorzy sterowni, technicy utrzymania ruchu | Inżynierowie, analitycy |
| Źródło prawdy dla | Zapisów finansowych, wartości zapasów, popytu | Rejestru stanu faktycznego (as-built), historii wykonania | Zapisów operacyjnych we wszystkich kategoriach | Stanów sterowania i alarmów | Historii procesu |
| Typowa awaria przy nieprawidłowym użyciu | Potwierdzenia z hali wprowadzane z kilkudniowym opóźnieniem | Używany jako narzędzie planowania lub zrzut danych bez logiki procesu | Zakres tak szeroki, że nic nie wchodzi do użytku | Używany jako system zarządzania zleceniami | Traktowany jako system rejestrowy dla ilości |

MOM to nazwa ISA-95 dla całego Poziomu 3; MES jest zwykle rozumiany jako jego rdzeń produkcyjny [10][14]. Wielu dostawców sprzedaje „pakiety MOM”, które obejmują moduły jakości i utrzymania ruchu. To, czy nazwiesz to MES czy MOM, ma mniejsze znaczenie niż to, czy każda komórka macierzy aktywności z sekcji 4 ma jednego właściciela.

### Inne systemy Poziomu 3 i miejsce, w którym zwykle przebiega granica MES

| System | Główne zadanie | Typowa granica z MES |
|---|---|---|
| QMS (system zarządzania jakością) | Niezgodności, CAPA, audyty, kontrola dokumentów, jakość dostawców | MES rejestruje wyniki w procesie i wstrzymania; QMS zarządza dochodzeniem i działaniami korygującymi. Integracja: niezgodność utworzona w MES, obsługiwana w QMS |
| LIMS (system zarządzania informacją laboratoryjną) | Próbki, badania laboratoryjne, specyfikacje, świadectwa analizy | MES zamawia próbki i otrzymuje decyzje o zwolnieniu; LIMS jest właścicielem zapisu badania |
| CMMS / EAM | Zlecenia utrzymania ruchu, części zamienne, historia urządzeń | MES raportuje stany maszyn i liczniki; CMMS planuje przeglądy. Wspólne identyfikatory urządzeń są niezbędne |
| WMS | Magazynowanie, kompletacja, przesunięcia magazynowe | MES żąda materiału na linię i potwierdza zużycie; WMS wykonuje przesunięcia |
| APS | Planowanie i sekwencjonowanie o ograniczonej pojemności | APS tworzy sekwencję; MES dysponuje zlecenia i raportuje wartości rzeczywiste. Niektóre produkty MES zawierają moduł APS |
| PLM | Projektowanie produktu, konstrukcyjna BOM, zarządzanie zmianami | PLM zwalnia definicję inżynierską; MES korzysta z definicji produkcyjnej (często przez ERP lub narzędzie do planowania procesów produkcyjnych) |
| Platforma danych / analityka | Analiza międzyzakładowa, AI, długoterminowe przechowywanie | MES jest źródłem; nie powinien stać się korporacyjnym jeziorem danych. Zob. [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) |

### Czy SAP to MES? Czy wystarczy sam ERP?

Dostawcy ERP oferują funkcje wykonawcze produkcji, albo wewnątrz ERP (potwierdzenia z hali, proste listy dyspozycyjne), albo jako osobne produkty. SAP na przykład opisuje SAP Digital Manufacturing jako chmurową platformę zarządzania operacjami produkcyjnymi (MOM) i zaleca klientom starszego SAP Manufacturing Execution przejście na nią (opis dostawcy) [35]. To, czy sam ERP wystarczy, zależy od czterech pytań:

1. **Granularność:** Czy trzeba rejestrować dane na poziomie operacji i zlecenia, czy na poziomie kroku, numeru seryjnego i parametru?
2. **Opóźnienie:** Czy wystarczy potwierdzanie na koniec zmiany, czy decyzje zależą od minut?
3. **Egzekwowanie:** Czy system musi *zapobiegać* błędnemu krokowi (błędny materiał, niewykwalifikowany operator, brak kontroli), czy wystarczy, że go zarejestruje?
4. **Regulacje:** Czy potrzebne są elektroniczne rejestry partii lub rejestry historii wyrobu z ścieżkami audytu i podpisami elektronicznymi?

**Sygnały, że wyrosło się poza samo wykonanie w ERP:** potwierdzenia wpisywane z opóźnieniem dłuższym niż jedna zmiana; więcej niż jeden arkusz pomocniczy w danym obszarze; klient lub regulator żąda identyfikowalności, którą można zebrać dopiero po kilku dniach; wycieki jakościowe spowodowane błędnymi wersjami lub materiałami; brygadziści spędzający pierwszą godzinę każdej zmiany na zbieraniu danych.

Jeśli na wszystkie cztery pytania odpowiedź brzmi „ogólnie, na koniec zmiany, tylko rejestracja, nie”, sterowanie produkcją w ERP oraz dobra dyscyplina mogą wystarczyć, zwłaszcza w małych zakładach. Jeśli dwie lub więcej odpowiedzi wskazuje w przeciwnym kierunku, potrzebne są funkcje MES, niezależnie od tego, czy pochodzą od dostawcy ERP, dostawcy MES czy od platformy.

## Funkcje MES szczegółowo

Poniższe funkcje odpowiadają kolumnie produkcyjnej modelu czynności ISA-95 [3], rozszerzonym o funkcje MESA-11, które większość produktów nadal obejmuje [9]. Dla każdej z nich podano: co robi, czego wymaga i jak zwykle zawodzi.

### 1. Zarządzanie definicją produktu (definicje pracy, marszruty, receptury)

**Co robi:** Przechowuje definicję produkcyjną każdego wyrobu: operacje, kroki, parametry, wymagane materiały, narzędzia, kwalifikacje, instrukcje robocze i kontrole. W przemyśle procesowym jest to receptura nadrzędna.

**Czego wymaga:** Jasnego podziału danych podstawowych między ERP i PLM, kontroli wersji oraz procesu zmian inżynieryjnych, który dociera na halę produkcyjną przed rozpoczęciem następnego zlecenia.

**Typowa awaria:** Dwie wersje danych nadrzędnych. Marszruta w ERP przewiduje 12 operacji, MES – 14, i nikt nie wie, które czasy są używane do kalkulacji kosztów.

### 2. Zarządzanie zasobami (ludzie, urządzenia, materiały)

**Co robi:** Wie, które zasoby są dostępne i wykwalifikowane: stan maszyn, żywotność narzędzi, przeszkolenie i certyfikaty operatorów, partie materiałów dostępne na linii.

**Czego wymaga:** Rejestrów szkoleń (często z HR lub systemu szkoleniowego), stanu urządzeń z CMMS i sterowników oraz stanu materiałów z ERP lub WMS.

**Typowa awaria:** MES blokuje operatora, ponieważ rekord szkolenia w HR jest opóźniony o trzy miesiące. Przed włączeniem twardego egzekwowania należy uporządkować proces aktualizacji kwalifikacji. Omówienie [kompetencji pracowników produkcyjnych](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) obejmuje macierze umiejętności.

### 3. Szczegółowe harmonogramowanie

**Co robi:** Przekształca zwolnione zlecenia w sekwencję dla każdego zasobu, uwzględniając zdolności produkcyjne, przezbrojenia, dostępność materiałów i terminy realizacji. MESA-11 nazywa to szeregowaniem operacji/szczegółowym harmonogramowaniem [9].

**Czego wymaga:** Dokładnych czasów wykonania i przezbrojeń, rzeczywistych kalendarzy zasobów oraz faktycznego postępu z hali produkcyjnej.

**Typowa awaria:** „Harmonogram”, który w rzeczywistości jest listą dyspozycyjną z ERP posortowaną według terminu. Jeśli harmonogramowanie jest rzeczywistym ograniczeniem w zakładzie, porównaj moduł MES z samodzielnym APS.

### 4. Dyspozycja

**Co robi:** Zwalnia kolejne zadanie na stanowisko pracy lub operatorowi we właściwym momencie, z gotowymi wszystkimi dokumentami i materiałami. MESA-11: dyspozycja jednostek produkcyjnych [9].

**Typowa awaria:** Listy dyspozycyjne, które operatorzy ignorują, bo nie odzwierciedlają rzeczywistości (brak materiału, awaria maszyny). Rozwiązaniem jest zamknięcie pętli: dyspozycja musi korzystać z bieżącego stanu zasobów.

### 5. Zarządzanie wykonaniem i instrukcje robocze

**Co robi:** Prowadzi operatora lub maszynę przez kolejne kroki, egzekwuje kolejność i kontrole, zbiera podpisy potwierdzające i zatrzymuje proces, gdy wymagany warunek nie jest spełniony. To tutaj MES różni się najbardziej od narzędzia raportującego.

**Czego wymaga:** Dobrze napisanych, wizualnych instrukcji roboczych; decyzji, które kontrole są twardymi blokadami, a które tylko ostrzeżeniami; terminali lub tabletów na stanowisku.

**Granica bezpieczeństwa:** Funkcje bezpieczeństwa (osłony, wyłączniki awaryjne, blokady bezpieczeństwa) należą do sterowania spełniającego wymagania bezpieczeństwa na poziomach 1 i 2, nigdy do MES. MES może zablokować *kolejny krok zlecenia*; nie może być jedynym elementem, który chroni człowieka.

**Typowy błąd:** Cyfryzacja 40-stronicowej papierowej procedury jeden do jednego. Przepisz instrukcje pod ekran, przetestuj je z operatorami i utrzymuj je krótkie. Zobacz [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) oraz [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/).

### 6. Zbieranie danych (data acquisition)

**Co robi:** Rejestruje ilości, czasy, stany, parametry i pomiary, automatycznie z maszyn tam, gdzie to możliwe, a ręcznie tam, gdzie nie jest to możliwe.

**Czego wymaga:** Łączności z maszynami (OPC UA, MTConnect, protokoły producentów lub prosta wymiana sygnałów I/O dla liczników i stanów), modelu czasu (co liczy się jako planowany postój) oraz list kodów przyczyn, z których operatorzy faktycznie mogą korzystać.

**Typowy błąd:** 120 kodów przyczyn przestojów. Operatorzy wybierają pierwszy z listy. Zacznij od ośmiu do piętnastu kodów na obszar i udoskonalaj je wraz z ludźmi, którzy z nich korzystają.

### 7. Zarządzanie jakością w realizacji

**Co robi:** Kontrole w trakcie procesu, SPC, plany pobierania próbek, wstrzymania i zwolnienia, rejestrowanie niezgodności, powiązania z QMS w celu badania przyczyn.

**Czego wymaga:** Planów kontroli i charakterystyk od inżynierii jakości (w motoryzacji PFMEA i plan kontroli), integracji przyrządów pomiarowych, zasad postępowania przy niezaliczonej kontroli.

**Typowy błąd:** Wyniki kontroli są zbierane, ale nigdy nie są wykorzystywane do zatrzymania procesu. Kontrola, która nie może zatrzymać linii, jest zapisem, a nie sterowaniem. Praca nad analizą przyczyn źródłowych należy do systemu jakości; zobacz [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### 8. Śledzenie, identyfikowalność i genealogia

**Co robi:** Śledzi pracę w toku i buduje zapis stanu wykonania: które partie materiałów i komponenty, od których dostawców, weszły do których numerów seryjnych lub partii, przetwarzane na jakim wyposażeniu, z jakimi parametrami, przez kogo. MESA-11: śledzenie produktu i genealogia [9].

**Czego wymaga:** Jednoznacznej identyfikacji (kody kreskowe, kody 2D, RFID), zdyscyplinowanego skanowania w każdym punkcie zużycia materiału, jasnej zasady dla materiałów sypkich (na poziomie partii czy numeru seryjnego).

**Typowy błąd:** Genealogia odtwarzana po fakcie na podstawie dokumentów wysyłkowych. Musi być rejestrowana w trakcie procesu. Prosty test: wybierz losowy numer seryjny wyrobu gotowego i zapytaj, ile czasu zajmie wypisanie wszystkich partii komponentów. Następnie odwróć to: wybierz partię komponentu i wypisz wszystkie wyroby gotowe, które ją zawierają.

### 9. Analiza wydajności

**Co robi:** OEE, wydajność, braki, czas cyklu, dotrzymywanie harmonogramu oraz analiza przestojów według zmiany, linii i produktu; dane wejściowe do codziennych spotkań przy stanowisku. Sekcja 14 opisuje KPI.

**Typowy błąd:** Pulpity, o których nikt nie dyskutuje. Powiąż każde KPI ze spotkaniem i właścicielem, zgodnie z opisem w [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### 10. Kontrola dokumentów

**Co robi:** Dostarcza aktualną wersję rysunków, instrukcji i specyfikacji na stanowisko oraz rejestruje, jaka wersja została użyta. Często jest współdzielona z systemem zarządzania dokumentami lub QMS albo jemu powierzana.

### 11. Zarządzanie pracą

**Co robi:** Rejestruje, kto i przez jak długi czas pracował nad którym zleceniem, na potrzeby kalkulacji kosztów, weryfikacji kwalifikacji i interfejsów z systemem płac. Zwróć uwagę na aspekt ludzki w sekcji 15: śledzenie pracy na poziomie operacji jest wrażliwe i w zakładach zrzeszonych w związkach zawodowych może podlegać negocjacjom.

### 12. Funkcje związane z utrzymaniem ruchu

**Co robi:** Stany maszyn, liczniki i alarmy z MES zasilają utrzymanie ruchu oparte na stanie lub na wykorzystaniu w CMMS. Pełne zarządzanie utrzymaniem ruchu zwykle pozostaje w CMMS. Zobacz [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) oraz [predictive maintenance and IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/).

### 13. Zapasy i przepływ materiałów na linii

**Co robi:** Zamawia materiał na linię, potwierdza zużycie, śledzi bufory WIP i zapasy przy linii. Sygnały kanban mogą być uruchamiane na podstawie danych o zużyciu z MES; zobacz [kanban and pull systems](https://www.m365.fm/en/learn/kanban-pull-system/) oraz [intralogistics](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

### Dyskretna, procesowa i wsadowa: jak zmienia się nacisk

| Typ przemysłu | Typowy nacisk MES | Przykłady |
|---|---|---|
| Dyskretna, duża seria (motoryzacja, elektronika) | Genealogia seryjna, blokady, dane z maszyn, OEE, Andon | Montaż nadwozi, montaż PCB |
| Dyskretna, duża różnorodność, mała seria (maszyny, lotnictwo) | Instrukcje robocze, karty obiegowe, niezgodności, kwalifikacje operatorów, konfiguracja as-built | Montaż obrabiarek, konstrukcje lotnicze |
| Wsadowa (farmacja, żywność, chemia specjalistyczna) | Elektroniczne zapisy wsadowe, realizacja receptur, ważenie i dozowanie, przegląd przez wyjątki, zgodność | Produkcja tabletek, sosy |
| Ciągła (papier, stal, rafinacja) | Śledzenie produkcji według czasu i partii, jakość na podstawie próbek, energia, integracja z DCS i LIMS | Maszyna papiernicza, walcownia gorącej taśmy |

Szczegóły dotyczące lotnictwa (AS9100, kontrola pierwszego egzemplarza, kontrola konfiguracji) znajdują się w [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

## Integracja: B2MML, OPC UA, MTConnect i unified namespace

MES jest tak dobry, jak jego interfejsy. Potrzebuje zleceń i danych referencyjnych z góry, danych maszynowych z dołu, a potwierdzone wyniki musi przekazywać z powrotem. Powtarzają się cztery podstawowe elementy.

### W górę: integracja z ERP i B2MML

Interfejs ERP-MES przenosi niewielką liczbę typów komunikatów, które w prosty sposób odpowiadają kategoriom informacyjnym ISA-95:

| Kierunek | Komunikat | Zawartość | Wyzwalacz |
|---|---|---|---|
| ERP -> MES | Definicja produktu / marszruta | Operacje, BOM, gniazda robocze, normatywne czasy | Zwolnienie zmiany inżynieryjnej |
| ERP -> MES | Zlecenie produkcyjne (harmonogram) | Materiał, ilość, termin, odniesienie do marszruty | Zwolnienie zlecenia |
| ERP -> MES | Dane główne materiałów, partie | Identyfikatory materiałów, cechy partii | Zmiana, przyjęcie |
| MES -> ERP | Potwierdzenie operacji (wydajność) | Ilości dobre i braki, czasy, robocizna | Zakończenie operacji lub okresowo |
| MES -> ERP | Ruchy magazynowe | Zużycie, przyjęcie wyrobów z produkcji | Skan zużycia, zakończenie zlecenia |
| MES -> ERP | Zawiadomienie o jakości | Wady, wstrzymania | Niezgodność |
| MES <-> ERP | Zdolność / status | Dostępność zasobów, status zlecenia | Zmiana statusu |

**B2MML** (Business To Manufacturing Markup Language) to implementacja XML modeli obiektowych ISA-95 opracowana przez MESA; specyfikacja towarzysząca ISA-95 fundacji OPC Foundation podąża, o ile to możliwe, za odwzorowaniem B2MML, aby ułatwić tłumaczenie [5]. Zastosowanie B2MML lub jego odpowiednika w JSON nie sprawia, że interfejs działa bez konfiguracji, ale daje obu stronom te same nazwy i struktury obiektów, co skraca prace specyfikacyjne. Wraz z rozwiązaniem MESA należy potwierdzić, gdzie utrzymywane są schematy (zob. sekcja 2) [11].

**Zasady, które oszczędzają miesiące:**

- Dla każdego atrybutu określ, który system jest nadrzędny, i nigdy nie pozwalaj dwóm systemom zapisywać tego samego pola.
- Uzgodnij *zdarzenie*, które wyzwala potwierdzenie (koniec operacji, co 15 minut, koniec zlecenia), a nie tylko format.
- Projektuj interfejsy jako idempotentne: komunikat wysłany dwukrotnie nie może dwukrotnie zaksięgować ilości.
- Uwzględnij sytuację, w której ERP jest niedostępny. MES musi dalej działać i kolejkować zaksięgowania.

### W dół: integracja z maszynami i sterowaniami przez OPC UA i MTConnect

**OPC UA** jest dominującym, niezależnym od producentów interfejsem między sterowaniami a oprogramowaniem poziomu 3. OPC Foundation utrzymuje specyfikacje towarzyszące, które definiują modele informacyjne dla konkretnych dziedzin, w tym OPC 10030, który odwzorowuje wspólny model obiektowy ISA-95 w OPC UA [4][5]. W Azure IoT Operations firmy Microsoft na przykład konektor OPC UA odczytuje skonfigurowane punkty danych i publikuje je do brokera MQTT [26]; przewodnik towarzyszący [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) opisuje ten stos.

**MTConnect** to otwarty standard danych obrabiarek i urządzeń produkcyjnych, opublikowany jako ANSI/MTC1.4-2018 [22]. Wielu amerykańskich producentów obrabiarek obsługuje go natywnie, co czyni go atrakcyjnym dla warsztatów z urządzeniami CNC.

W przypadku linii pakujących model stanów PackML (z raportu technicznego ISA-TR88.00.02, aktualna edycja z 2022 roku) daje maszynom wspólny zestaw stanów i trybów [37], co upraszcza obliczanie OEE u różnych OEM.

**Czego minimalnie potrzebujesz z maszyny:** stanu (praca, postój, awaria, ustawianie), licznika dobrych sztuk, licznika braków, aktywnego programu lub receptury oraz kodów alarmów. Wszystko inne to dodatek na późniejsze przypadki użycia.

### Na boki i na zewnątrz: zunifikowana przestrzeń nazw (UNS)

**Zunifikowana przestrzeń nazw** (ang. *unified namespace*, UNS) to wzorzec architektoniczny, a nie norma: systemy publikują swój bieżący stan jako zdarzenia do centralnego brokera, zazwyczaj MQTT, zorganizowanego w hierarchiczne drzewo tematów, a inne systemy subskrybują to, czego potrzebują. Drzewo tematów zwykle odzwierciedla hierarchię wyposażenia według ISA-95. [Filar poświęcony Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) przedstawia pełny przykład tematów oraz usługi Azure, które go realizują; ta sekcja koncentruje się na tym, co UNS oznacza dla MES.

```
acme/dayton/machining/line-2/cnc-3/state
acme/dayton/machining/line-2/cnc-3/counts
acme/dayton/machining/line-2/order/current
acme/dayton/assembly/test-cell-t1/lt-1/result
```

**MQTT** to lekki protokół publikacji/subskrypcji; obecni brokerzy obsługują wersje 3.1.1 i 5, co Microsoft dokumentuje dla brokera w Azure IoT Operations [25]. **Sparkplug**, utrzymywany przez Eclipse Sparkplug Working Group, dodaje konwencję ładunku i stanu ponad MQTT; wersja 3.0 jest aktualna. Jego „certyfikaty narodzin i śmierci” informują subskrybentów, czy dane urządzenia są nadal ważne [28]. Własna struktura tematów Sparkplug (grupa, węzeł brzegowy, urządzenie) nie jest hierarchią ISA-95, dlatego zakłady, które jej używają, zwykle odwzorowują hierarchię w identyfikatorze grupy (na przykład `spBv1.0/Plant1:Area3:Line4:Cell2/NDATA/<edge node>`) albo rozdzielają poziomy między brokerów lub drugą przestrzeń nazw zgodną z ISA-95; jeden z dostawców brokerów opisuje oba wzorce i ostrzega, że ograniczona liczba elementów tematu w Sparkplug sprawia, że odwzorowanie jest ciasne [44].

**Co UNS zmienia w MES:**

| Bez UNS | Z UNS |
|---|---|
| MES łączy się punkt-punkt z każdą maszyną, ERP, QMS, pulpitem | MES subskrybuje tematy maszyn i zleceń oraz publikuje własne zdarzenia (zlecenie rozpoczęte, operacja zakończona, wstrzymanie) |
| Nowi odbiorcy (pulpit, model AI) wymagają nowego interfejsu do MES | Nowi odbiorcy subskrybują istniejące tematy |
| Bieżący stan jest rozproszony między systemami | Bieżący stan jest widoczny w jednym miejscu |

**Czego UNS nie zmienia:**

- **Logika biznesowa pozostaje w MES.** Broker przenosi komunikaty; nie wymusza, że użyto właściwego materiału, że operator ma kwalifikacje ani że zapis partii jest kompletny.
- **Rejestry prawdy pozostają w systemach źródłowych.** Broker przechowuje bieżący stan, a nie audytowalną historię. Genealogia, zapisy partii i potwierdzenia muszą być przechowywane transakcyjnie w MES (i w ERP), z śladami audytu tam, gdzie wymaga tego regulacja.
- **Semantyka nadal wymaga modelu.** Temat o nazwie `counts` jest bezużyteczny, jeśli jedna maszyna liczy cykle, a inna liczy dobre sztuki. Obiekty ISA-95 oraz specyfikacje uzupełniające OPC UA dostarczają semantyki ładunku.
- **Bezpieczeństwo staje się trudniejsze, a nie łatwiejsze.** Broker, do którego każdy system może zapisywać, jest celem o wysokiej wartości; kontrola dostępu dla każdego tematu, uwierzytelnieni klienci i segmentacja zgodnie z ISA/IEC 62443 są obowiązkowe [23][24].

**Dyskusja: „UNS zastępuje ISA-95”.** Ta teza pojawia się często. Myli ona dwie rzeczy. Stanowisko samego ISA jest takie, że poziomy nadal pomagają opisywać granice systemów, nawet gdy dane nie płyną już poziom po poziomie [1], a wydanie Części 1 z 2025 roku wprost zmierza ku architekturom zorientowanym na dane i modularnym [2]. Praktyczna synteza: ISA-95 dla słownictwa, hierarchii wyposażenia i podziału odpowiedzialności; UNS (lub inna magistrala zdarzeń) do transportu; MES i ERP jako transakcyjne systemy źródłowe.

### Architektura integracji: porównanie trzech wzorców

| Wzorzec | Jak działa | Dobre dla | Na co uważać |
|---|---|---|---|
| Punkt-punkt | Każdy system ma bezpośrednie interfejsy z pozostałymi | Małe zakłady z 3 do 5 systemami | Do n × (n − 1) ÷ 2 interfejsów: 10 dla 5 systemów, 45 dla 10; kruche aktualizacje |
| Middleware integracyjny / ESB | Centralna warstwa integracyjna transformuje i kieruje komunikaty | Przedsiębiorstwa zorientowane na ERP, z zespołami integracji IT | Może stać się wąskim gardłem zarządzanym przez odległy zespół |
| Magistrala zdarzeń / UNS | Broker publikacji/subskrypcji ze wspólną konwencją tematów i ładunków | Zakłady z wieloma maszynami i wieloma odbiorcami danych | Wymaga zarządzania tematami, ładunkami i dostępem; przepływy transakcyjne nadal potrzebują gwarantowanego dostarczenia |

Większość zakładów kończy z mieszanką: UNS dla danych maszyn i stanów oraz integracja z gwarantowanym dostarczeniem dla transakcji ERP.

## MES w branżach regulowanych

W branżach regulowanych MES jest częścią systemu jakości, a jego zapisy są zapisami prawnymi. Ta sekcja opisuje amerykańskie przepisy, do których trzeba projektować system; nie zastępuje ona porad zespołu ds. spraw regulacyjnych.

### FDA 21 CFR Part 11: rekordy i podpisy elektroniczne

W przypadku systemów zamkniętych 21 CFR 11.10 wymaga m.in. walidacji systemów pod kątem dokładności, niezawodności i spójnego działania zgodnie z przeznaczeniem; możliwości generowania dokładnych i kompletnych kopii rekordów; ochrony rekordów przez cały okres przechowywania; ograniczenia dostępu do systemu do upoważnionych osób; oraz „bezpiecznych, generowanych komputerowo, opatrzonych znacznikiem czasu ścieżek audytu” rejestrujących datę i godzinę wpisów i czynności operatorów, które tworzą, modyfikują lub usuwają rekordy, bez zasłaniania wcześniej zarejestrowanych informacji [19]. Pozostałe punkty obejmują kontrole operacyjne i uprawnień, kontrole urządzeń, szkolenia oraz pisemne polityki.

**Co to oznacza dla MES:** indywidualne konta użytkowników (bez wspólnych loginów przy terminalu), ścieżki audytu przy każdym regulowanym rekordzie, podpisy elektroniczne powiązane z rekordem i pokazujące imię i nazwisko podpisującego, datę, godzinę oraz znaczenie podpisu, a także pakiet walidacyjny. Zaplanuj prace walidacyjne w czasie i budżecie; w farmacji często stanowią dużą część wysiłku wdrożeniowego [unverified: brak publicznego benchmarku tego udziału].

### Farmacja: elektroniczne rekordy partii

Producenci leków muszą prowadzić rekordy produkcji i kontroli partii dla każdej partii zgodnie z przepisami dobrej praktyki wytwarzania w 21 CFR Part 211; sekcja 211.188 stanowi, że „rekordy produkcji i kontroli partii muszą być sporządzane dla każdej partii wyrobu leczniczego” [38]. MES z elektronicznymi rekordami partii (eBR) wymusza kolejność receptury, rejestruje masy i parametry u źródła i wspiera **przegląd wyjątków** (review by exception): recenzent QA sprawdza odchylenia zgłoszone przez system zamiast czytać każdą stronę. Jest to jeden z najmocniejszych argumentów biznesowych za MES w każdej branży, ponieważ czas przeglądu rekordu partii często ogranicza zwolnienie produkcji.

### Wyroby medyczne: QMSR i rekordy historii wyrobu

Od 2 lutego 2026 r. rozporządzenie FDA o systemie zarządzania jakością (Quality Management System Regulation, 21 CFR Part 820) włącza przez odniesienie normę ISO 13485:2016, wraz z jej wymaganiami dotyczącymi identyfikacji i identyfikowalności [20]. Starsze określenie „device history record” (DHR) nadal pojawia się w wielu opisach produktów MES i procedurach zakładowych; strona FDA dotycząca QMSR nie używa tego terminu, dlatego zalecamy odwzorowanie swoich rekordów na wymagania ISO 13485:2016, które QMSR włącza, a nie na dawne numery sekcji Part 820, oraz potwierdzenie tego odwzorowania z zespołem ds. spraw regulacyjnych. MES zazwyczaj tworzy rekord as-built dla każdej partii lub numeru seryjnego: komponenty, operacje, kontrole, urządzenia i personel.

### Żywność: identyfikowalność FSMA 204

Przepis FDA o identyfikowalności żywności (FSMA Section 204) wymaga kluczowych elementów danych dla krytycznych zdarzeń śledzenia (przyjęcie, przetworzenie, wysyłka) powiązanych z kodem partii identyfikowalności, a rekordy należy przekazać FDA w ciągu 24 godzin od żądania; FDA nie będzie egzekwować go przed 20 lipca 2028 r. [29]. Zdarzenia przetworzenia zachodzą w produkcji, więc MES lub moduł identyfikowalności to naturalne miejsce do tworzenia kodów partii i łączenia wejść z wyjściami.

### Motoryzacja i lotnictwo

IATF 16949 i AS9100 dodają wymagania dotyczące identyfikowalności, planu kontroli i pierwszej sztuki; wymagania specyficzne dla klienta często idą dalej. W IATF 16949 punkt 8.5.2.1 uzupełnia wymagania ISO 9001 dotyczące identyfikacji i identyfikowalności o udokumentowane plany identyfikowalności oparte na „poziomach ryzyka lub dotkliwości awarii dla pracowników, klientów i konsumentów”, zgodnie z zestawieniem porównawczym jednostki certyfikującej [39] (źródło wtórne; sama norma jest płatnym tekstem). Obie normy są płatnymi tekstami; przewodnik [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/) szczegółowo omawia AS9100 i AS9102.

### Podejście do walidacji

Ostateczne wytyczne FDA *Computer Software Assurance for Production and Quality Management System Software* (CDRH i CBER, luty 2026) opisują podejście oparte na ryzyku, służące do uzyskania pewności co do oprogramowania produkcyjnego i systemów zarządzania jakością oraz do określenia, gdzie potrzebna jest większa rygorystyczność [40]. Dokument jest skierowany do producentów wyrobów medycznych objętych 21 CFR Part 820; producenci leków mogą traktować go jako wskazówkę orientacyjną, a nie jako własną regulację. W praktyce: sklasyfikuj każdą funkcję MES według ryzyka, testuj funkcje wysokiego ryzyka (podpisy elektroniczne, blokady, obliczenia, identyfikowalność partii) dokładnie, stosując testy zaplanowane, a do konfiguracji niskiego ryzyka wykorzystuj testy niezaplanowane lub dostarczone przez dostawcę. Zapytaj dostawców o ich akceleratory walidacji oraz o certyfikację ich własnego systemu jakości.

## Opcje wdrożenia i architektury

Rynek przeszedł od modelu „jeden duży pakiet MES na zakład” do szerszego zestawu opcji. Różnią się one miejscem działania oprogramowania oraz sposobem jego struktury.

### Gdzie działa: lokalnie, w chmurze, hybrydowo

| Opcja | Opis | Zalety | Wady |
|---|---|---|---|
| Lokalnie (on-premises) | Serwery MES w zakładzie lub w centrum danych firmy | Działa, gdy WAN jest niedostępny; pełna kontrola; znane zespołom walidacyjnym | Sprzęt, łatanie i aktualizacje są po stronie firmy; aktualizacje są często odkładane przez lata |
| Chmura (SaaS) | Dostawca uruchamia MES w swojej chmurze; zakład łączy się przez bramy | Szybszy start, aktualizacje zarządzane przez dostawcę, koszt subskrypcji | Zależność od WAN; opóźnienia dla blokad; rezydencja danych; wymuszony rytm aktualizacji musi pasować do walidacji |
| Hybrydowo / brzeg (edge) plus chmura | Wykonanie krytyczne czasowo na węźle brzegowym w zakładzie, analityka i zarządzanie w chmurze | Działa podczas awarii; skaluje analitykę | Dwa środowiska do obsługi i zabezpieczenia; logika synchronizacji |

**Zasada praktyczna:** wszystko, co ma zatrzymać błędny krok lub utrzymać linię w ruchu, musi działać przy braku połączenia z internetem. Poproś każdego dostawcę chmury o zademonstrowanie zachowania offline, a nie tylko o jego opis.

### Jak jest zbudowane: pakiet, platforma, moduł ERP

| Podejście | Co otrzymujesz | Pasuje do | Ryzyka |
|---|---|---|---|
| Branżowy pakiet MES | Szeroka, gotowa funkcjonalność dla jednej lub kilku branż, często z funkcjami regulacyjnymi | Regulowane, złożone zakłady; standaryzacja wielozakładowa | Długie projekty, rozbudowana personalizacja, uzależnienie od dostawcy, wysoki koszt licencji |
| Komponowalna / platforma aplikacyjna („MES nowej generacji”) | Platforma z narzędziami low-code i konektorami; zakład buduje lub konfiguruje aplikacje do konkretnych zastosowań | Zakłady, które chcą zacząć od małej skali i rozwijać się; produkcja wysokomieszana; silne zespoły wewnętrzne | Wiele małych aplikacji bez wspólnego modelu danych; zarządzanie; walidacja aplikacji tworzonych przez użytkowników |
| MES zintegrowany z ERP | Moduł MES lub produkt towarzyszący od dostawcy ERP | Firmy skoncentrowane na ERP o umiarkowanej złożoności hali produkcyjnej | Użyteczność na hali i integracja z maszynami mogą ustępować specjalistycznym produktom |
| Budowa na zamówienie | Własne oprogramowanie na ogólnej platformie | Unikalne procesy, silny zespół programistyczny | Utrzymanie spoczywa na Tobie na zawsze (sekcja 10) |

„Komponowalny MES” to termin marketingowy dostawców i analityków, a nie standardowa kategoria. Leżąca u podstaw idea, czyli małe funkcje dzielące jeden model danych i dodawane z czasem, jest słuszna i odpowiada ujęciu ISA-95 na poziomie czynności. Ryzyko jest przeciwieństwem monolitu: dwadzieścia aplikacji, z których każda inaczej definiuje „zlecenie” i „maszynę”. Hierarchia wyposażenia i modele obiektów ISA-95 są lekarstwem na ten problem.

### Szablony wielozakładowe

W firmach z kilkoma zakładami pytanie brzmi mniej „który MES” niż „jak dalece standaryzować”. Częste podejście to **szablon globalny** (model danych, procesy podstawowe, interfejsy, wskaźniki KPI) z lokalnymi rozszerzeniami. Ogranicz szablon do tego, co musi być porównywalne między zakładami (definicje KPI zgodnie z ISO 22400, identyfikowalność, interfejs ERP); pozwól zakładom różnić się tam, gdzie ich procesy się różnią.

## Budowa własna czy zakup?

Większość zakładów powinna kupić (lub wykupić subskrypcję) i skonfigurować rozwiązanie. Budowa własna ma sens w mniejszej liczbie przypadków, niż lubią myśleć zespoły inżynierskie, ale w większej, niż przyznają dostawcy.

### Czynniki decyzyjne

| Czynnik | Przemawia za zakupem | Przemawia za budową lub budową na platformie |
|---|---|---|
| Unikalność procesu | Procesy odpowiadają praktyce branżowej | Procesy są realnym wyróżnikiem konkurencyjnym i często się zmieniają |
| Regulacje | Środowisko zwalidowane i regulowane (Part 11, GMP) | Środowisko niereglamentowane lub lekko reglamentowane |
| Zdolności wewnętrzne | Brak zespołu programistycznego lub zespół w pełni zajęty ERP | Doświadczony zespół, który może utrzymywać oprogramowanie przez 10+ lat |
| Zakres | Szeroki: wykonanie, jakość, genealogia, planowanie | Wąski: zbieranie danych i OEE, cyfrowe instrukcje stanowiskowe |
| Czas | Potrzebne wyniki w ciągu miesięcy | Możliwość inwestycji w dłuższą budowę |
| Całkowity koszt w ciągu 10 lat | Licencja plus konfiguracja są tańsze niż zespół | Koszt zespołu jest już poniesiony i stabilny |
| Ryzyko uzależnienia od kluczowej osoby | Nieakceptowalne | Ograniczone dokumentacją i wielkością zespołu |

### Ukryty koszt budowy

Własny MES nie wiąże się z opłatą licencyjną, ale płaci się za wymagania, rozwój, testowanie, dokumentację, hosting, łatanie zabezpieczeń, aktualizacje platformy bazowej, wsparcie o 3 w nocy, a w branżach regulowanych także za walidację każdej zmiany. Najczęstsza awaria nie dotyczy pierwszej wersji; dotyczy piątego roku, gdy oryginalny programista odszedł, a zakład działa na oprogramowaniu, którego nikt nie odważy się zmienić.

### Ścieżka pośrednia

Wiele zakładów kupuje platformę lub MES jako rdzeń (wykonanie, genealogia, interfejs do ERP), a następnie buduje własne aplikacje lub pulpity na jego bazie, korzystając z API lub narzędzi low-code. To działa, gdy zakupiony rdzeń zarządza modelem danych, a elementy własne jedynie odczytują dane lub korzystają z udokumentowanych API.

## Lista kontrolna wyboru dostawcy MES

Poniższa tabela to lista kontrolna wyboru zawierająca 30 kryteriów w ośmiu grupach. Nadaj wagi grupom zgodnie ze swoją sytuacją (sugerowane wagi pasują do średniej wielkości zakładu dyskretnego o niewielkim stopniu regulacji), oceniaj każdego dostawcę w skali od 0 do 4 dla każdego kryterium i, co najważniejsze, korzystaj z kolumny **metoda testu**: żadnego kryterium nie należy oceniać na podstawie prezentacji slajdów.

| # | Grupa (sugerowana waga) | Kryterium | Jak to sprawdzić |
|---|---|---|---|
| 1 | Dopasowanie funkcjonalne (25%) | Obejmuje Twoje najważniejsze przypadki użycia z macierzy działań ISA-95 | Zaskryptowane demo z Twoimi produktami, marszrutami i rzeczywistym zleceniem |
| 2 | Dopasowanie funkcjonalne | Instrukcje robocze: wizualne, wersjonowane, wymuszanie kolejności kroków | Operator tworzy i wykonuje jedną instrukcję podczas demo |
| 3 | Dopasowanie funkcjonalne | Genealogia na potrzebnym Ci poziomie (partia, numer seryjny, oba) | Śledzenie w przód i wstecz na danych demonstracyjnych w ciągu 60 sekund |
| 4 | Dopasowanie funkcjonalne | Jakość w realizacji: kontrole, SPC, wstrzymania, niezgodności | Wymuś niezaliczoną kontrolę i pokaż, co zatrzymuje proces |
| 5 | Dopasowanie funkcjonalne | Przestoje i OEE zgodnie z Twoim modelem czasu | Skonfiguruj Twoje kody przyczyn i reguły planowanych postojów |
| 6 | Dopasowanie funkcjonalne | Głębia harmonogramowania i dyspozycji (lub integracja z APS) | Ponowne sekwencjonowanie po awarii maszyny |
| 7 | Integracja (15%) | Łącznik ERP dla Twojego ERP i jego wersji | Referencyjny klient z tym samym ERP; przegląd dokumentacji interfejsu |
| 8 | Integracja | Łączność z maszynami: OPC UA, MTConnect, marki Twoich sterowników PLC | Podłącz jedną z Twoich maszyn w ramach proof of concept |
| 9 | Integracja | Otwarte API (REST, zdarzenia), udokumentowane i wersjonowane | Programista czyta dokumentację API i buduje proste zapytanie |
| 10 | Integracja | Obsługa obiektów ISA-95 lub B2MML | Poproś o mapowanie modelu danych do ISA-95 |
| 11 | Integracja | Publikacja zdarzeń do MQTT / UNS | Pokaż zdarzenia na brokerze podczas demo |
| 12 | Dane i architektura (10%) | Model danych odpowiada hierarchii wyposażenia ISA-95 lub ją odwzorowuje | Przegląd konfiguracji modelu wyposażenia |
| 13 | Dane i architektura | Możliwość pracy offline na brzegu sieci (edge) | Odłącz WAN podczas proof of concept |
| 14 | Dane i architektura | Eksport danych i ich własność: możesz pobrać wszystkie dane w otwartych formatach | Klauzula w umowie oraz testowy eksport |
| 15 | Dane i architektura | Możliwość szablonów dla wielu zakładów | Referencja z trzema lub więcej zakładami |
| 16 | Użyteczność (10%) | Ekrany operatorskie użyteczne w rękawicach, na tabletach, w hałasie | Dwóch operatorów testuje bez szkolenia przez 30 minut |
| 17 | Użyteczność | Konfiguracja przez nadzorców i inżynierów bez kodowania | Inżynier zmienia krok marszruty i kontrolę |
| 18 | Użyteczność | Języki, którymi czyta Twoja załoga | Pokaż ekrany w każdym języku |
| 19 | Zgodność i bezpieczeństwo (10%) | Funkcje zgodne z Part 11, jeśli są potrzebne (ścieżka audytu, podpis elektroniczny) | Demo ścieżki audytu dla zmienionego rekordu |
| 20 | Zgodność i bezpieczeństwo | Bezpieczny rozwój oprogramowania i certyfikacja bezpieczeństwa produktu (np. ISA/IEC 62443-4-1/4-2) | Certyfikaty i polityka ujawniania podatności dostawcy [23] |
| 21 | Zgodność i bezpieczeństwo | Integracja tożsamości (SSO, MFA dla administratorów, model ról) | Konfiguracja ról dla operatora, nadzorcy, jakości |
| 22 | Zgodność i bezpieczeństwo | Dokumenty wsparcia walidacji | Przegląd pakietu walidacyjnego |
| 23 | Dostawca i partner (10%) | Stabilność finansowa i własność | Raporty roczne lub sprawdzenie wiarygodności; zmiany własności w ciągu ostatnich pięciu lat |
| 24 | Dostawca i partner | Partner wdrożeniowy z referencjami w Twojej branży i regionie | Zadzwoń do dwóch referencji bez obecności dostawcy |
| 25 | Dostawca i partner | Plan rozwoju produktu i częstotliwość wydań | Plan rozwoju objęty NDA; jak często klienci faktycznie aktualizują system? |
| 26 | Dostawca i partner | Model wsparcia i godziny pracy | Treść SLA; kto odpowiada o 2 w nocy w sobotę? |
| 27 | Koszt (15%) | Całkowity koszt posiadania w pięcioletnim okresie | Twój model TCO (sekcja 13) wypełniony ofertami dostawców |
| 28 | Koszt | Model licencjonowania odpowiada wzrostowi (na zakład, użytkownika, maszynę, zużycie) | Wycen teraz scenariusz rozbudowy na 3 lata |
| 29 | Koszt | Koszt aktualizacji i dostosowań | Zapytaj, ile kosztowała aktualizacja u klienta referencyjnego |
| 30 | Wyjście (5%) | Plan wyjścia: dane, konfiguracje, dokumentacja przy rozwiązaniu umowy | Klauzula w umowie; zapytaj, jak dawny klient przeniósł się do innego systemu |

**Scoring:** weighted score = sum over groups of (group weight × average criterion score ÷ 4). A vendor with 78 percent beats one with 72 percent only if neither has a knockout: any criterion scored 0 in functional fit, offline capability (if required) or compliance should eliminate the vendor regardless of total.

**Process tips:**

- Napisz zapytanie ofertowe (RFP) wokół przypadków użycia i macierzy aktywności, a nie 600-pozycyjnej listy funkcji. Listy funkcji zawsze dostają „tak” przy każdej pozycji.
- Wymagaj płatnego proof of concept na jednej linii z Twoimi danymi przed ostateczną decyzją. Typowy zakres to dwa do sześciu tygodni [unverified: practitioner estimate].
- Niech operatorzy i brygadziści oceniają użyteczność, a finanse koszt; oceny trzymaj osobno aż do końca.
- Jako neutralny dla dostawców punkt wyjścia analizy rynkowe (Gartner Peer Insights zawiera listę rynku MES [8]) oraz referencje od zakładów-partnerów są bardziej przydatne niż rankingi dostawców publikowane przez samych dostawców.

## Plan wdrożenia MES

Poniższy plan dotyczy pojedynczego średniej wielkości zakładu. Czasy trwania to założenia planistyczne dla produktu skonfigurowanego, a nie wartości referencyjne; zakłady regulowane i rozwiązania szyte na miarę zajmują więcej czasu [unverified: practitioner estimates].

| Faza | Czas trwania (typowe założenie) | Główne działania | Kryteria zakończenia |
|---|---|---|---|
| 0. Uzasadnienie i zakres | 4 do 8 tygodni | Opis problemu, przejście strumienia wartości, macierz aktywności ISA-95 stan obecny, bazowe KPI, wstępny business case | Zatwierdzony sponsor, widełki budżetu i jeden pilotażowy strumień wartości |
| 1. Wymagania i wybór | 8 do 16 tygodni | Przypadki użycia, model danych (hierarchia urządzeń, właściciel danych głównych), RFP, zaplanowane demo, proof of concept | Wybrany dostawca i partner, umowa z klauzulami wyjścia i danych |
| 2. Projekt | 6 do 10 tygodni | Projekt rozwiązania, specyfikacje interfejsów, model czasu i kody przyczyn, standardy instrukcji stanowiskowych, plan walidacji (jeśli regulowany), projekt bezpieczeństwa | Podpisany projekt, plan testów |
| 3. Budowa i testy pilota | 10 do 20 tygodni | Konfiguracja, połączenie z maszynami, interfejs ERP, migracja danych, cykle testów, szkolenie operatorów | Akceptacja użytkownika na linii pilotażowej |
| 4. Uruchomienie pilota i stabilizacja | 6 do 12 tygodni | Uruchomienie z hipercare, dzienny przegląd problemów, porównanie KPI z wartościami bazowymi | KPI stabilne przez 4 kolejne tygodnie; otwarte defekty poniżej uzgodnionego progu |
| 5. Wdrożenie | 3 do 6 miesięcy na falę | Kolejne linie i obszary; udoskonalenie szablonu | Wszystkie objęte zakresem obszary uruchomione |
| 6. Ciągłe doskonalenie | Stale | Nowe przypadki użycia, aktualizacje, doskonalenie sterowane KPI | Własność zakładu, a nie projektu |

### Faza 0 szczegółowo: zacznij od strumienia wartości

Najpierw przejdź strumień wartości. Zmapuj miejsca, w których informacja jest opóźniona, przepisywana ręcznie lub brakuje jej, oraz miejsca, z których pochodzą ucieczki jakości i długie czasy realizacji. Przewodnik po [mapowaniu strumienia wartości](https://www.m365.fm/en/learn/value-stream-mapping/) pokazuje, jak to zrobić; mapa stanu obecnego z naniesionym przepływem informacji to najlepszy dokument wymagań MES, jaki można przygotować w tydzień. Wybierz pilota na tyle ważnego, by miał znaczenie, i na tyle ograniczonego, by dało się go ukończyć: jedna linia lub jedna rodzina produktów z wyraźnym problemem.

### Faza 1 szczegółowo: model danych przed oprogramowaniem

Zdefiniuj hierarchię urządzeń (sekcja 4), właściciela danych głównych dla każdego obiektu (materiał, marszruta, urządzenia, personel), model czasu dla OEE (czym jest planowany czas produkcji) oraz model statusów zleceń i operacji. Jeśli nie uzgodnisz tego z ERP, jakością i utrzymaniem ruchu przed wyborem, żaden dostawca tego za Ciebie nie rozwiąże.

### Lista kontrolna przed uruchomieniem

| Sprawdzenie | Zrobione |
|---|---|
| Dane główne dla produktów pilotażowych zweryfikowane na hali (kroki marszruty, BOM, instrukcje) | ☐ |
| Każdy operator przeszkolony na własnym stanowisku na rzeczywistych zleceniach, a nie tylko w sali szkoleniowej | ☐ |
| Procedura awaryjna (papierowy traveler) wydrukowana i przetestowana na wypadek awarii MES | ☐ |
| Interfejs ERP przetestowany w przypadkach błędnych (ERP niedostępny, zduplikowany komunikat, błędna ilość) | ☐ |
| Kody przyczyn i kontrole przejrzane z operatorami | ☐ |
| Grafik hipercare na pierwsze dwa tygodnie, wszystkie zmiany | ☐ |
| Bazowe KPI zamrożone do porównania | ☐ |
| Bezpieczeństwo: konta, role, MFA dla administratorów, przetestowane kopie zapasowe | ☐ |
| Regulowane: raport podsumowujący walidację zatwierdzony przed użyciem produkcyjnym | ☐ |

### Role

| Rola | Odpowiedzialność |
|---|---|
| Sponsor wykonawczy (kierownik zakładu lub wiceprezes ds. operacji) | Rozstrzyga konflikty zakresu, chroni zasoby |
| Właściciel produktu z operacji | Odpowiada za przypadki użycia i priorytety, zatwierdza odbiór |
| Lider MES / architekt rozwiązania | Projekt, model danych, integracja |
| Inżynier IT/OT | Infrastruktura, sieci, połączenie maszyn, bezpieczeństwo |
| Jakość i zgodność regulacyjna | Kontrole, zapisy, walidacja |
| Kluczowi użytkownicy w każdym obszarze i zmianie | Testowanie, szkolenie kolegów, przekazywanie uwag |
| Partner finansowy | Business case, śledzenie korzyści |
| Dostawca / integrator | Konfiguracja, wiedza o produkcie |

## Koszt MES i ROI na przykładzie

„Ile kosztuje MES?” nie ma uczciwej jednej odpowiedzi. Ceny zależą od zakresu, liczby linii i użytkowników, modelu wdrożenia, wymogów regulacyjnych i nakładu na integrację, a dostawcy rzadko je publikują. Niektóre strony podają widełki bez źródła; my ich nie powtarzamy. Zamiast tego przedstawiamy strukturę własnej analizy całkowitego kosztu posiadania (TCO) oraz przykład liczbowy z **ilustracyjnymi założeniami**, które należy zastąpić własnymi ofertami i wartościami wyjściowymi.

### Struktura kosztów

| Blok kosztów | Jednorazowo | Cyklicznie | Uwagi |
|---|---|---|---|
| Oprogramowanie | Licencja wieczysta (jeśli dotyczy) | Subskrypcja lub utrzymanie (często procent licencji rocznie) | Sprawdź metrykę: zakład, użytkownik, maszyna, zużycie |
| Usługi wdrożeniowe | Konfiguracja, interfejsy, migracja danych, zarządzanie projektem | Zmiany zakresu | Zwykle największy blok jednorazowy |
| Sprzęt i sieć | Terminale, tablety, skanery, drukarki etykiet, serwery brzegowe, Wi-Fi, okablowanie | Cykl wymiany | Często niedoszacowane w starszych zakładach |
| Łączność z maszynami | Bramki, programowanie PLC, modernizacje starych maszyn | Utrzymanie | Cena za typ maszyny, nie za sztukę |
| Zespół wewnętrzny | Zespół projektowy, key userzy, zastępstwa za ich bieżące zadania | Wsparcie MES, administracja, ciągłe doskonalenie | Uwzględnij koszt obciążony |
| Szkolenia | Projekt szkoleń i sesje | Nowi pracownicy, szkolenia przypominające | |
| Walidacja (sektory regulowane) | Plan walidacji, protokoły, wykonanie | Ponowna walidacja po zmianach i aktualizacjach | |
| Hosting i eksploatacja | Konfiguracja | Opłaty za chmurę lub utrzymanie serwerów, kopie zapasowe, monitoring bezpieczeństwa | |

**Nakłady inwestycyjne a koszty operacyjne:** MES w modelu subskrypcyjnym jest zwykle kosztem operacyjnym (opex); licencje wieczyste, sprzęt i część kosztów wdrożenia mogą być kapitalizowane, zależnie od przyjętej polityki rachunkowej. Według US GAAP wewnętrznie używane oprogramowanie regulowane jest przez ASC 350-40. Od ASU 2018-15 (sierpień 2018) koszty wdrożenia umowy chmurowej, która jest umową o świadczenie usług, podlegają tym samym etapom kapitalizacji, ale kapitalizowane koszty prezentuje się jak przedpłacone opłaty za hosting, amortyzuje w okresie hostingu i ujmuje w tej samej pozycji rachunku zysków i strat co opłata [41]. ASU 2025-06 (wrzesień 2025) ponownie zmienia ASC 350-40, z obowiązywaniem dla rocznych okresów rozpoczynających się po 15 grudnia 2027, przy dopuszczalnym wcześniejszym zastosowaniu [42]. Uzgodnij sposób ujęcia z audytorem. Wybór rachunkowy zmienia EBITDA i czas ponoszenia kosztów, nie ekonomikę przedsięwzięcia.

### Struktura korzyści

| Pozycja korzyści | Wzór | Źródło danych |
|---|---|---|
| Dodatkowa przepustowość na wąskim gardle | Dodatkowe godziny produktywne × marża pokrycia na godzinę | MES lub ręczny dziennik przestojów, finanse (tylko jeśli istnieje popyt) |
| Redukcja braków i przeróbek | Roczny koszt braków i przeróbek × oczekiwana redukcja | Raporty kosztów jakości |
| Czas pracy na dokumentację i wprowadzanie danych | Zaoszczędzone godziny × obciążona stawka godzinowa × udział faktycznie przesunięty do innych zadań | Badanie czasu pracy, wywiady |
| Redukcja WIP i zapasów | Jednorazowe uwolnienie gotówki; koszt utrzymania zapasów × redukcja rocznie | Wycena zapasów |
| Szybsze zwolnienie partii lub zleceń | Skrócenie czasu realizacji × wartość (zapasy, terminowość dostaw) | Czasy przeglądów jakości, dane zleceń |
| Uniknięte koszty zgodności i wycofań | Prawdopodobieństwo × skutek, zwykle poza scenariuszem bazowym | Rejestr ryzyk |

### Przykład liczbowy: zakład zaworów zatrudniający 220 osób

**Sytuacja (wszystkie kwoty ilustracyjne):** cztery linie, dwie zmiany, przychody 85 mln USD. Linia 2 jest wąskim gardłem. Papierowe karty technologiczne, potwierdzenia w ERP na koniec zmiany, brak automatycznego rejestrowania przestojów.

**Koszty jednorazowe (rok 0):**

| Pozycja | Kwota |
|---|---|
| Usługi wdrożeniowe | 450 000 USD |
| Sprzęt, sieć, łączność z maszynami | 160 000 USD |
| Wewnętrzny zespół projektowy (2,5 FTE przez 12 miesięcy po 120 000 USD obciążonych) | 300 000 USD |
| Szkolenia i zastępstwa | 60 000 USD |
| **Razem koszty jednorazowe** | **970 000 USD** |

**Koszty cykliczne (od roku 1):** subskrypcja 180 000 USD + wewnętrzne wsparcie MES 1 FTE 120 000 USD = **300 000 USD rocznie**.

**Korzyści przy pełnym efekcie (scenariusz bazowy):**

| Korzyść | Obliczenie | Rocznie |
|---|---|---|
| OEE na linii 2 z 62% do 67% | 4 000 planowanych godzin × 5 punktów = 200 dodatkowych godzin produktywnych × 2 000 USD marży pokrycia na godzinę | 400 000 USD |
| Redukcja braków | 1,2 mln USD kosztu braków × 15% | 180 000 USD |
| Czas na dokumentację | 4 000 godzin × 45 USD obciążonych × 50% przesunięte do innych zadań | 90 000 USD |
| Koszt utrzymania WIP | 3,0 mln USD WIP × 10% redukcji × 20% stopy kosztu utrzymania | 60 000 USD |
| **Łączna korzyść roczna** | | **730 000 USD** |

Dodatkowo jednorazowe uwolnienie gotówki z WIP: 3,0 mln USD × 10% = 300 000 USD (założone w roku 2).

**Narastanie efektów:** w pierwszym roku projekt dostarcza 40 procent rocznej korzyści (pilotaż i wdrożenie), w latach 2–5 – 100 procent.

**Przepływy pieniężne (w tysiącach USD), stopa dyskontowa 10%:**

| Rok | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Scenariusz bazowy | −970 | 730 × 0,4 − 300 = −8 | 730 − 300 + 300 = 730 | 430 | 430 | 430 |
| Skumulowane | −970 | −978 | −248 | 182 | 612 | 1 042 |

NPV przy 10% = −970 − 8/1,1 + 730/1,1² + 430/1,1³ + 430/1,1⁴ + 430/1,1⁵ ≈ **+510 000 USD**. Prosty okres zwrotu: skumulowane przepływy stają się dodatnie w trakcie trzeciego roku, około 2,6 roku od rozpoczęcia projektu (248 ÷ 430 = 0,58 trzeciego roku).

**Scenariusz zachowawczy:** zysk OEE wynosi tylko połowę (lub nie cała dodatkowa produkcja może zostać sprzedana): 200 000 USD zamiast 400 000 USD; redukcja braków 10 procent (120 000 USD) zamiast 15 procent. Roczna korzyść wynosi 470 000 USD, a wynik netto 170 000 USD rocznie.

| Rok | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Scenariusz zachowawczy | −970 | 470 × 0,4 − 300 = −112 | 470 − 300 + 300 = 470 | 170 | 170 | 170 |
| Skumulowane | −970 | −1 082 | −612 | −442 | −272 | −102 |

NPV przy 10% ≈ **−334 000 USD**; w ciągu pięciu lat brak zwrotu nakładów.

**Analiza wrażliwości:** przy korzyściach z braków, dokumentacji i produkcji w toku na poziomie scenariusza bazowego projekt osiąga próg rentowności (NPV = 0 przy 10%) przy korzyści z przepustowości wynoszącej około 243 000 USD rocznie, co odpowiada około 121 dodatkowym produktywnym godzinom lub około 3 punktom OEE na Linii 2 zamiast 5. Jeśli zrealizuje się tylko połowa zysku OEE, a wszystkie pozostałe założenia się potwierdzą, NPV wynosi około −139 000 USD. Wrażliwość na to jedno założenie jest rzeczywistym wnioskiem z tego przykładu.

**Czego uczy ten przykład:**

1. **Jedna linia dominuje.** Korzyść z przepustowości stanowi ponad połowę scenariusza bazowego. Zanim ją uwzględnisz, potwierdź z działem sprzedaży, że zakład jest ograniczony zdolnością produkcyjną na tej linii, lub najpierw użyj przewodnika [teorii ograniczeń](https://www.m365.fm/en/learn/theory-of-constraints/), aby zidentyfikować rzeczywiste wąskie gardło.
2. **Koszty cykliczne są ważniejsze, niż sugeruje pozycja licencyjna.** Wsparcie wewnętrzne stanowi tu 40 procent kosztów cyklicznych i często jest pomijane.
3. **Narastanie efektów zabija NPV.** Pilotaż, który trwa 18 miesięcy zamiast 12, przesuwa scenariusz zachowawczy jeszcze głębiej na minus. Szybkość osiągnięcia pierwszej stabilnej linii jest zmienną finansową.
4. **Korzyści niewyrażone liczbowo są realne, ale odrębne.** Zmniejszenie zakresu wycofań, gotowość do audytu i wymagania klientów mogą same w sobie uzasadniać MES w łańcuchach dostaw regulowanych lub napędzanych przez OEM. Pokaż je obok liczb, a nie wewnątrz nich.
5. **Śledź korzyści po uruchomieniu** w odniesieniu do zamrożonej linii bazowej, razem z działem finansowym, przez co najmniej dwa lata.

Definicje wskaźników KPI i kosztów stojących za tymi pozycjami znajdziesz w przewodniku [wskaźniki KPI w produkcji](https://www.m365.fm/en/learn/manufacturing-kpis/).

## KPI MES: co mierzyć i jak

MES dostarcza dane dla większości wskaźników KPI na hali produkcyjnej. Istotne są dwie grupy: wskaźniki operacyjne, które MES oblicza, oraz wskaźniki pokazujące, czy sam MES działa prawidłowo.

### Definicje standardowe: ISO 22400

ISO 22400-2:2014 określa kluczowe wskaźniki efektywności (KPI) dla zarządzania operacjami produkcyjnymi, z wzorem, jednostką, sposobem określania czasu i grupą użytkowników dla każdego z nich [16]; źródła wtórne liczą 34 KPI w normie [18], a nowelizacja z 2017 roku dodała KPI zarządzania energią [16]. Stosowanie jej definicji sprawia, że KPI są porównywalne między liniami i zakładami. Badacze NIST opublikowali hierarchiczną strukturę tych KPI z wzorami, dostępną bezpłatnie [17].

### Wskaźniki operacyjne z MES

| KPI | Wzór (uproszczony) | Typowe zastosowanie |
|---|---|---|
| OEE | Dostępność × wydajność × jakość | Wąskie gardło i kluczowe maszyny |
| Dostępność | Czas pracy ÷ planowany czas produkcji | Skupienie na przestojach |
| Wydajność | (Idealny czas cyklu × łączna liczba) ÷ czas pracy | Straty prędkości, mikroprzestoje |
| Jakość (wskaźnik) | Liczba dobrych sztuk ÷ łączna liczba | Złom i przeróbki |
| First pass yield | Sztuki przechodzące bez przeróbki ÷ sztuki rozpoczęte | Zdolność procesu |
| Wskaźnik złomu | Ilość złomu ÷ ilość wyprodukowana | Strata materiału |
| Dotrzymanie harmonogramu | Zlecenia (lub ilość) wykonane zgodnie z planem ÷ zaplanowane | Stabilność planu |
| Przepustowość | Dobre sztuki na godzinę | Zdolność produkcyjna |
| WIP | Sztuki lub wartość między pierwszą a ostatnią operacją | Przepływ |
| Czas realizacji zlecenia | Czas zakończenia − czas zwolnienia | Reakcja na potrzeby klienta |
| MTBF / MTTR | Czas pracy ÷ liczba awarii; czas naprawy ÷ liczba awarii | Utrzymanie ruchu |

**Przykład obliczenia OEE (jedna zmiana na Linii 2):** planowany czas produkcji 450 minut, nieplanowane przestoje 60 minut, zatem czas pracy 390 minut. Idealny czas cyklu 1,0 minuty, łączna liczba 340, liczba dobrych sztuk 323.

- Dostępność = 390 ÷ 450 = 86,7%
- Wydajność = (1,0 × 340) ÷ 390 = 87,2%
- Jakość = 323 ÷ 340 = 95,0%
- OEE = 0,867 × 0,872 × 0,950 = **71,8%**

Kontrola krzyżowa: liczba dobrych sztuk × idealny czas cyklu ÷ planowany czas produkcji = 323 ÷ 450 = 71,8%. Jeśli wynik w MES nie przechodzi tej kontroli, jego model czasu jest niespójny. Muchiri i Pintelon analizują definicje OEE stosowane w praktyce oraz ich pułapki [30]; przewodnik [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) omawia temat szerzej.

### Wskaźniki dotyczące samego MES

| KPI | Definicja | Kierunek celu |
|---|---|---|
| Opóźnienie danych | Czas od zdarzenia na hali do dostępności w MES / ERP | W dół (minuty, nie dni) |
| Wskaźnik automatycznego zbierania | Udział ilości i stanów zebranych z maszyn w stosunku do wpisywanych ręcznie | W górę |
| Wskaźnik ręcznych korekt | Korekty na 100 zleceń | W dół |
| Pokrycie kodami przyczyn | Udział minut przestojów z ważnym kodem przyczyny | W górę (powyżej 90% to częsty cel) |
| Czas identyfikowalności | Minuty potrzebne na pełną identyfikację wsteczną jednego numeru seryjnego lub partii | W dół |
| Adopcja | Udział zleceń prowadzonych w całości w MES (bez obejścia papierowego, z wyjątkiem udokumentowanej procedury awaryjnej) | W górę (stan docelowy to 100%; trwałe obejścia wskazują na problem projektowy, a nie operatora) |
| Wskaźnik błędów interfejsu | Nieudane lub odrzucone zaksięgowania dziennie | W dół |
| Dostępność MES | Czas pracy systemu w godzinach produkcji | W górę |

## Ludzie i hala produkcyjna

MES zmienia sposób pracy operatorów przez każdą minutę zmiany. Zakłady, które traktują go jak projekt IT, zwykle dostają obejścia; zakłady, które traktują go jako zmianę sposobu pracy, dostają adopcję.

**Co zyskują operatorzy:** aktualne instrukcje na stanowisku zamiast segregatora, mniej formularzy, szybszą pomoc, gdy coś pójdzie nie tak (wezwania andon z terminala; zobacz [andon](https://www.m365.fm/en/learn/shop-floor-management/andon/), szczegółowe omówienie), oraz mniej obwiniania, gdy system pokazuje, że postój został spowodowany wcześniej w procesie.

**Czego operatorzy się obawiają, często słusznie:** monitorowania co minutę, blokowania przez system, który się myli, oraz utraty własnego osądu na rzecz ekranu. Należy odnieść się do każdej z tych obaw wprost:

- **Monitorowanie:** Określ i podaj do wiadomości, jakie dane o pracy ludzi rejestruje MES, kto je widzi i do czego są wykorzystywane. Dane o wydajności wykorzystuj do poprawy procesu, a nie do rankingowania poszczególnych osób. W zakładach z organizacjami związkowymi wprowadzenie elektronicznego monitorowania i zmiany zasad pracy mogą być obowiązkowym przedmiotem negocjacji zbiorowych; zaangażuj związek wcześnie i zasięgnij opinii prawnika ds. pracy [unverified: ocena prawna zależy od umowy zbiorowej i aktualnej doktryny NLRB].
- **Blokowanie przez błędny system:** Zapewnij operatorom szybki, widoczny sposób zgłaszania błędnej instrukcji lub błędnej blokady, i usuwaj te zgłoszenia w ciągu kilku dni. Każde nierozwiązane zgłoszenie uczy halę, jak znaleźć obejście.
- **Osąd:** Stosuj twarde blokady wyłącznie w krokach krytycznych dla bezpieczeństwa i jakości. W pozostałych przypadkach ostrzegaj i rejestruj.

**Zaangażuj operatorów w projektowanie.** Dwóch lub trzech operatorów z każdego obszaru w warsztatach projektowych, operatorzy testujący ekrany przed uruchomieniem oraz operatorzy jako szkoleniowcy-koledzy są tani i skuteczni. Szacunek dla ludzi to dane wejściowe projektu, a nie slajd o zarządzaniu zmianą; zasadę tę opisuje [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

**Ergonomia i bezpieczeństwo przy terminalach:** umieszczaj terminale tam, gdzie wykonywana jest praca, na wysokości stania, czytelne przy oświetleniu zakładu i obsługiwane w rękawicach. Skanery nie powinny zwiększać chodzenia. MES, który dodaje 30 sekund do każdej operacji przy takcie 60 sekund, zawodzi jeszcze przed uruchomieniem.

## Typowe błędy przy wdrażaniu MES

| # | Błąd | Co się dzieje | Lepiej |
|---|---|---|---|
| 1 | Kupowanie funkcji przed zdefiniowaniem modelu danych | Interfejsy się psują na niezgodnych identyfikatorach, KPI różnią się między systemami | Najpierw hierarchia urządzeń, właściciele danych podstawowych i model czasu |
| 2 | Jeden do jednego cyfryzowanie obecnego procesu papierowego | Ta sama marnotrawstwo, tylko na ekranie | Najpierw uprościć proces podczas przeglądu strumienia wartości |
| 3 | Zakres „wszystko z listy MESA-11” | Projekt wieloletni, nic nie działa na żywo | Jeden strumień wartości, trzy do pięciu przypadków użycia, działające w ciągu miesięcy |
| 4 | Dostosowywanie zamiast konfigurowania | Aktualizacje stają się projektami; dostawca odmawia wsparcia | Akceptować standardowe procesy tam, gdzie nie są wyróżnikiem |
| 5 | Brak udziału operatorów | Obejścia, cieniowe systemy papierowe | Operatorzy w projektowaniu, testach i szkoleniu |
| 6 | ERP i MES zarządzają tymi samymi danymi | Sprzeczne ilości i czasy | Jeden właściciel każdego atrybutu, udokumentowany |
| 7 | Twarde blokady wszędzie | Linie stają z błahych powodów; zaufanie upada | Twarde blokady wyłącznie tam, gdzie wymagają tego bezpieczeństwo lub jakość |
| 8 | Ignorowanie sieci i terminali | Wolne ekrany, zgubione skany | Badanie terenu i modernizacja sieci w fazie 2 |
| 9 | Brak rezerwy na awarie | Produkcja staje, gdy MES lub WAN zawiedzie | Przetestowany papierowy plan awaryjny i zdolność pracy offline na brzegu sieci |
| 10 | Słaby projekt bezpieczeństwa | Płaska sieć między biurem a maszynami | Strefy i kanały zgodnie z ISA/IEC 62443; zasada najmniejszych uprawnień [23][24] |
| 11 | Brak właściciela po uruchomieniu | MES niszczeje; jakość danych spada | Zespół MES należący do zakładu i wskaźnik KPI adopcji |
| 12 | Korzyści nigdy nie są mierzone | Biznes-case kolejnego zakładu nie ma dowodów | Zamrożona baza odniesienia, finanse śledzą korzyści przez dwa lata |
| 13 | Niedoszacowana walidacja (sektory regulowane) | Opóźnienia o miesiące | Walidacja oparta na ryzyku, zaplanowana od fazy 1 |
| 14 | Traktowanie UNS lub platformy danych jako MES | Dane wszędzie, brak egzekwowania, brak zapisów | MES do wykonania i zapisów; UNS do dystrybucji |

## Ograniczenia MES i ISA-95

Uczciwe przyjrzenie się ograniczeniom pomaga zdecydować, czego nie kupować.

### Ograniczenia MES

1. **MES nie naprawia zepsutego procesu.** Jeśli marszruty są błędne, materiały brakują lub produkcja odbywa się bez standardowej pracy, MES tylko szybciej uwidacznia te problemy. To jest przydatne, ale nie jest rozwiązaniem. Najpierw podstawy Lean; zob. [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) oraz [5S i wizualne zarządzanie](https://www.m365.fm/en/learn/5s-visual-management/).
2. **Jakość danych zależy od ludzi.** Wpisy ręczne, skanowanie i kody przyczyn są tak dobre, jak dyscyplina pracowników i projekt ekranów.
3. **Sztywne systemy opierają się zmianom.** Silnie dostosowany MES może spowolnić wprowadzanie nowych produktów i zmiany procesów, co jest przeciwieństwem tego, czego potrzebują zakłady o dużej różnorodności produkcji.
4. **Koszty i nakład pracy są wysokie dla małych zakładów.** Dla warsztatu zatrudniającego 30 osób sterowanie produkcją w ERP, prosty sposób zbierania danych i dobre wizualne zarządzanie mogą przynieść większość wartości.
5. **Planowanie to nie realizacja.** MES z modułem harmonogramowania nie zastępuje planowania sprzedaży i operacji ani MRP; zob. [S&OP, MRP i planowanie produkcji](https://www.m365.fm/en/learn/sop-mrp-production-planning/).
6. **Analityka na dużą skalę powinna znajdować się gdzie indziej.** Analityka obejmująca wiele zakładów, AI i długoterminowa historia zwykle należą do platformy danych zasilanej przez MES, a nie do wnętrza MES. Przewodnik o [cyfrowym bliźniaku](https://www.m365.fm/en/learn/digital-twin-manufacturing/) oraz szczegółowe omówienie [process mining](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) pokazują, co mogą zasilić dane z MES.

### Ograniczenia ISA-95

1. **Jest abstrakcyjna.** ISA-95 jest z założenia niezależna od technologii [1]. Mówi, co nazywać i jak wymieniać dane, a nie jak je zbudować, więc dwa produkty określane jako „zgodne z ISA-95” mogą mimo to być trudne do zintegrowania.
2. **Model poziomów nie jest ścieżką danych.** Czytany dosłownie, hierarchia sugeruje, że dane przemieszczają się poziom po poziomie przez interfejsy punkt-punkt. Nowoczesne architektury (UNS, strumieniowanie zdarzeń, chmura) tak nie działają; sama ISA obecnie podkreśla, że poziomy są granicami, a nie rurociągami [1][2].
3. **Teksty normy są płatne i obszerne.** Wiele zespołów pracuje na podstawie wtórnych streszczeń, co prowadzi do niespójnych interpretacji. Kupcie przynajmniej części 1 i 3 do biblioteki projektowej.
4. **Zgodność nie jest certyfikowana.** Nie istnieje formalna certyfikacja ISA-95 dla produktów, w sposób, w jaki ISA/IEC 62443 posiada programy certyfikacji bezpieczeństwa produktów [unverified: nie znaleziono programu certyfikacji produktów ISA-95]. Sformułowanie „zgodne z ISA-95” w broszurze to deklaracja dostawcy.
5. **Granice w praktyce wyznacza się inaczej.** Harmonogramowanie, jakość i utrzymanie ruchu znajdują się w różnych systemach w każdym zakładzie; model czynności to uwzględnia, ale nie rozstrzyga tego za Ciebie.

## Glosariusz

| Termin | Znaczenie |
|---|---|
| Model czynności | Model czynności Poziomu 3 według ISA-95 Część 3: cztery kategorie operacji, po osiem czynności ogólnych każda [3] |
| APS | Zaawansowane planowanie i harmonogramowanie; oprogramowanie do szeregowania z ograniczoną zdolnością produkcyjną |
| Zapis powykonawczy | Zapis tego, jak faktycznie wytworzono konkretną jednostkę lub partię |
| B2MML | Business To Manufacturing Markup Language; implementacja XML obiektów ISA-95, opracowana przez MESA [5] |
| Zapis partii (eBR) | Zapis produkcji i kontroli dla jednej partii; elektroniczny zapis partii, gdy jest prowadzony w MES |
| CMMS / EAM | Komputerowy system zarządzania utrzymaniem ruchu / przedsiębiorstwowe zarządzanie aktywami |
| Composable MES | Określenie producenta na MES zbudowany z mniejszych aplikacji na wspólnej platformie |
| Szczegółowe szeregowanie | Czynność ISA-95 układająca pracę na zasobach w ramach Poziomu 3 [3] |
| Rejestr historii wyrobu (DHR) | Termin z zakresu wyrobów medycznych: zapis produkcji wyrobu lub partii; zob. QMSR [20] |
| Dyspozycja | Zwolnienie kolejnego zlecenia do zasobu [3] |
| Hierarchia wyposażenia | Struktura oparta na rolach według ISA-95: przedsiębiorstwo, zakład, obszar, gniazdo pracy, jednostka robocza |
| ERP | Planowanie zasobów przedsiębiorstwa; system biznesowy Poziomu 4 według ISA-95 |
| Genealogia | Powiązania między materiałami wejściowymi a jednostkami wyjściowymi (śledzenie w przód i wstecz) |
| Historian | Baza danych szeregów czasowych dla wartości procesowych |
| IEC 62264 | Międzynarodowa publikacja ISA-95 [1][7] |
| ISA-88 | Norma sterowania wsadowego, używana dla struktur receptur |
| ISA-95 | ANSI/ISA-95, Integracja systemów przedsiębiorstwa i sterowania, osiem części [1] |
| ISA/IEC 62443 | Seria norm dotyczących bezpieczeństwa systemów automatyki i sterowania przemysłowego [23] |
| ISO 22400 | Norma wskaźników KPI w zarządzaniu operacjami produkcyjnymi [16] |
| LIMS | System informatyczny zarządzania laboratorium |
| MES | System realizacji produkcji; oprogramowanie produkcyjne Poziomu 3 do realizacji i rejestrowania produkcji [8] |
| MESA-11 | Model MESA International z 1997 r. obejmujący 11 funkcji MES [9][12] |
| MOM | Zarządzanie operacjami produkcyjnymi; Poziom 3 według ISA-95 jako całość |
| MQTT | Lekki protokół przesyłania komunikatów typu publish/subscribe, powszechny w IIoT |
| MTConnect | Otwarty standard danych z urządzeń produkcyjnych (ANSI/MTC1.4-2018) [22] |
| OEE | Całkowita efektywność urządzeń = dostępność × wydajność × jakość |
| OPC UA | Niezależny od producentów standard komunikacji przemysłowej i modelowania informacji fundacji OPC Foundation |
| Część 11 | 21 CFR Część 11, przepisy FDA dotyczące zapisów i podpisów elektronicznych [19] |
| Model Purdue | Purdue Reference Model dla zintegrowanej produkcji komputerowej, podstawa poziomów ISA-95 [1] |
| QMS | System zarządzania jakością (oprogramowanie do niezgodności, CAPA, dokumentów, audytów) |
| Przegląd przez wyjątek | Przegląd zapisu partii skoncentrowany na odchyleniach oznaczonych przez system |
| SCADA | Nadzór i akwizycja danych; oprogramowanie nadzorcze Poziomu 2 |
| Sparkplug | Specyfikacja Eclipse działająca ponad MQTT, określająca ładunki i stany (certyfikaty narodzin i śmierci) [28] |
| Zunifikowana przestrzeń nazw (UNS) | Wzorzec architektury: centralny broker z hierarchicznym drzewem tematów przechowującym bieżący stan przedsiębiorstwa |
| WMS | System zarządzania magazynem |
| Gniazdo pracy / jednostka robocza | Poziomy hierarchii wyposażenia według ISA-95 poniżej obszaru |

## FAQ

### Czym w prostych słowach jest system realizacji produkcji?

To oprogramowanie, które mówi hali produkcyjnej, co robić dalej, i rejestruje, co faktycznie się wydarzyło, zlecenie po zleceniu i krok po kroku. Gartner definiuje go jako oprogramowanie produkcyjne, które zarządza, monitoruje i synchronizuje w czasie rzeczywistym wykonanie procesów fizycznych przekształcających surowce w produkty [8].

### Jakie są główne funkcje MES?

Model działań ISA-95 wymienia osiem ogólnych działań w operacjach produkcyjnych: zarządzanie definicją produktu, zarządzanie zasobami, szczegółowe harmonogramowanie, dyspozycja, zarządzanie wykonaniem, zbieranie danych, śledzenie i analiza wydajności [3]. Model MESA z 1997 roku wymieniał 11 funkcji, dodając kontrolę dokumentów, zarządzanie pracą, zarządzanie jakością, zarządzanie procesami i zarządzanie utrzymaniem ruchu [9].

### Jakie są korzyści z MES?

Dane produkcyjne rejestrowane u źródła zamiast przepisywanych ręcznie, krótsze czasy realizacji zleceń dzięki szybszemu zwalnianiu i dyspozycji, mniej wycieków jakościowych dzięki wymuszonym kontrolom, szybsze i węższe wycofania dzięki genealogii partii i numerów seryjnych, lepiej widoczne przestoje na wąskim gardle oraz zapisy elektroniczne gotowe do audytu. Każda z tych korzyści zależy od warunku: poprawnych danych wzorcowych, kontroli skonfigurowanych jako twarde blokady, dyscypliny skanowania materiałów i wyjścia, które da się faktycznie sprzedać. Sekcja 1 wymienia, co mierzyć dla każdej z nich.

### Czym w prostych słowach jest ISA-95?

ISA-95 (IEC 62264) to międzynarodowa norma integracji systemów przedsiębiorstwa, takich jak ERP, z systemami sterowania produkcją. Określa poziomy, hierarchię urządzeń, modele obiektów i modele działań, aby IT, OT i biznes posługiwały się tym samym słownictwem [1].

### Jakie są pięć poziomów ISA-95?

Poziom 0 to proces fizyczny, poziom 1 to czujniki i manipulacja, poziom 2 to monitorowanie i sterowanie nadzorcze, poziom 3 to zarządzanie operacjami produkcyjnymi (MES i powiązane systemy), a poziom 4 to planowanie biznesowe i logistyka (ERP) [1].

### Czy ISA-95 to to samo co IEC 62264?

Treść jest zgodna: ISA publikuje ANSI/ISA-95, a IEC publikuje IEC 62264. Wydania i numeracja się różnią; ANSI/ISA-95 część 1 z 2025 roku jest zmodyfikowanym przyjęciem IEC 62264-1 [1][2], a IEC 62264-6 ukazała się w 2020 roku [6]. Zawsze podawaj część i wydanie.

### Ile części ma ISA-95?

Osiem: modele i terminologia; obiekty i atrybuty integracji sterowania przedsiębiorstwa; modele działań MOM; obiekty i atrybuty integracji MOM; transakcje biznes-produkcja; model usług komunikacyjnych; model usług aliasów; profile wymiany informacji [1].

### Co to jest poziom 3 w ISA-95?

Poziom 3 to zarządzanie operacjami produkcyjnymi: działania, które zamieniają plany w produkty, w ramach przedziałów czasu wyrażonych w dniach, zmianach, godzinach, minutach i sekundach [4]. Obejmuje operacje produkcyjne, utrzymania ruchu, testów jakościowych i magazynowe [3]. MES jest najczęstszym systemem poziomu 3.

### Jaka jest różnica między MES a ERP?

ERP (poziom 4) planuje, co wytwarzać, i rozlicza to w przedziale od miesięcy do dni. MES (poziom 3) realizuje i rejestruje, jak każde zlecenie jest faktycznie wykonywane, w skali zmian do sekund [4]. ERP przechowuje zapis finansowy; MES przechowuje zapis as-built. Wymieniają one zlecenia, potwierdzenia i ruchy materiałowe.

### Czy potrzebuję MES, jeśli mam już ERP?

Niekoniecznie. Zadaj cztery pytania: czy musisz rejestrować dane na poziomie kroku, numeru seryjnego i parametru, a nie tylko na poziomie operacji; czy decyzje zależą od minut, a nie od potwierdzeń na koniec zmiany; czy system ma zapobiegać złemu krokowi, a nie tylko go rejestrować; oraz czy potrzebujesz elektronicznych zapisów historii partii i urządzeń? Jeśli wszystkie odpowiedzi brzmią nie, wystarczyć może sterowanie produkcją w ERP. Jeśli dwie lub więcej odpowiedzi brzmi tak, potrzebujesz funkcji MES: od dostawcy ERP, dostawcy MES lub z platformy (sekcja 5).

### Jaka jest różnica między MES a SCADA?

SCADA nadzoruje i steruje maszynami oraz procesami w czasie rzeczywistym (zmienne, alarmy, wartości zadane). MES zarządza zleceniami, materiałami, ludźmi, jakością i zapisami. SCADA wie, że maszyna pracuje; MES wie, dla którego zlecenia, której partii materiału i którego operatora pracuje.

### Jaka jest różnica między MES a MOM?

MOM (manufacturing operations management) to termin ISA-95 obejmujący cały poziom 3, w tym operacje produkcyjne, jakościowe, utrzymania ruchu i magazynowe. MES zwykle odnosi się do rdzenia produkcyjnego; wiele „pakietów MOM” to produkty MES z dodatkowymi modułami [10].

### Czym jest B2MML?

B2MML to implementacja XML modeli obiektowych ISA-95, stworzona przez MESA International i wykorzystywana w wielu interfejsach ERP-MES; mapowanie ISA-95 w OPC UA podąża za nią tam, gdzie to możliwe [5]. Po rozwiązaniu MESA 30 czerwca 2026 r. ISA przejęło treści MESA [11].

### Jak ISA-95 integruje się z systemami ERP?

ISA-95 definiuje interfejs między poziomem 4 (ERP) a poziomem 3 (MES i inne systemy operacyjne). Części 2 i 4 określają wymieniane obiekty, a część 5 – transakcje. W praktyce ERP przesyła w dół definicje produktów, zlecenia produkcyjne i dane o materiałach; MES przesyła w górę potwierdzenia operacji, ruchy towarów, powiadomienia o jakości i statusy. B2MML implementuje modele obiektowe ISA-95 w XML [5]. Wspólny model skraca pracę nad specyfikacją, lecz każdy projekt nadal musi zdecydować, który system jest nadrzędny dla każdego pola oraz które zdarzenie uruchamia zaksięgowanie (sekcja 7).

### Czy unified namespace zastępuje ISA-95 lub MES?

Nie. UNS to sposób przesyłania i udostępniania danych o bieżącym stanie za pośrednictwem brokera. Wymaga ISA-95 (lub podobnego modelu) do nazewnictwa i semantyki oraz MES i ERP do logiki biznesowej i rejestrów podlegających audytowi.

### Ile kosztuje MES?

Zależy to od zakresu, liczby linii, modelu wdrożenia, integracji i wymogów regulacyjnych, a dostawcy rzadko publikują ceny. Zbuduj własny pięcioletni całkowity koszt posiadania, korzystając z bloków kosztów w sekcji 13; w naszym przykładowym zakładzie zatrudniającym 220 osób koszty jednorazowe wyniosły 970 000 USD, a koszty cykliczne 300 000 USD rocznie.

### Ile trwa wdrożenie MES?

Dla jednego zakładu z jednym skonfigurowanym produktem planuj mniej więcej sześć do dwunastu miesięcy do stabilnego pilotażu, a kolejne fale po trzy do sześciu miesięcy [unverified: praktyczne założenie planistyczne]. Zakłady regulowane i rozwiązania szyte na miarę zajmują więcej czasu.

### Czy SAP to MES?

Podstawowy ERP SAP ma funkcje sterowania na hali produkcyjnej; SAP sprzedaje też osobne produkty do realizacji produkcji. To, czy same funkcje ERP wystarczą, zależy od szczegółowości, opóźnień, egzekwowania i potrzeb regulacyjnych opisanych w sekcji 5.

### Czy małe firmy produkcyjne potrzebują MES?

Nie zawsze. Mały warsztat zleceniowy może często uzyskać większość korzyści dzięki potwierdzeniom produkcji w ERP, prostemu monitoringowi maszyn i dobremu zarządzaniu wizualnemu. MES staje się konieczny, gdy potrzebujesz egzekwowania kroków, genealogii seryjnej, elektronicznych rejestrów partii lub decyzji niemal w czasie rzeczywistym. Program NIST Manufacturing Extension Partnership (MEP), skupiony na małych i średnich producentach, to niezależne od dostawców miejsce, gdzie można poprosić o ocenę [31].

### Czym jest chmurowy MES lub composable MES?

Chmurowy MES działa jako usługa w chmurze dostawcy; composable MES jest zbudowany z mniejszych aplikacji na wspólnej platformie. Oba podejścia mogą działać; sprawdź zachowanie w trybie offline na brzegu sieci, wspólny model danych oraz – jeśli system jest regulowany – to, jak cykl wydań dostawcy pasuje do Twojej walidacji.

### Czy ISA-95 jest nadal istotne przy IIoT i platformach chmurowych?

Tak. ISA stwierdza, że poziomy nadal pomagają opisywać granice systemów dla Przemysłu 4.0 [1], a wydanie części 1 z 2025 r. powstało z myślą o modularnych, zorientowanych na dane architekturach [2]. Przestarzałe jest natomiast przekonanie, że dane muszą wspinać się po poziomach jeden po drugim.

### Jakie są wady ISA-95?

Jest abstrakcyjny i mówi, co nazwać i czego wymieniać, a nie jak to zbudować. Czytany dosłownie, jego model poziomów sugeruje, że dane muszą wspinać się poziom po poziomie, czego nie robią nowoczesne architektury sterowane zdarzeniami. Teksty normy są płatne i obszerne, więc zespoły często pracują na niespójnych streszczeniach. „Zgodność z ISA-95” to deklaracja dostawcy, a nie certyfikat. Ponadto norma nie rozstrzyga, gdzie w zakładzie przebiega granica między systemami MES, jakości i utrzymania ruchu (sekcja 17).

### Jakie KPI powinien śledzić MES?

OEE i jego składowe, wydajność za pierwszym razem (first pass yield), wskaźnik braków, zgodność z harmonogramem, przepustowość, WIP, czas realizacji oraz MTBF/MTTR, zdefiniowane zgodnie z ISO 22400-2 [16][17]. Śledź również sam MES: opóźnienie danych, wskaźnik automatycznego zbierania danych, poziom wykorzystania i czas identyfikowalności.

### Czego 21 CFR Part 11 wymaga od MES?

W przypadku systemów zamkniętych: walidacji, dokładnych kopii rekordów, ochrony rekordów, dostępu ograniczonego do upoważnionych osób oraz bezpiecznych, generowanych przez komputer, opatrzonych znacznikiem czasu ścieżek audytu, które nie przesłaniają wcześniejszych wpisów, wśród innych kontroli [19]. Podpisy elektroniczne muszą być powiązane ze swoimi rekordami.

## Podsumowanie i pierwsze kroki

System wykonawczy produkcji (MES) zwraca koszt, gdy zamyka pętlę między planem a rzeczywistością szybciej i pewniej, niż ludzie z papierem i arkuszami kalkulacyjnymi. ISA-95 daje na to mapę: poziomy pokazują, gdzie znajduje się MES, hierarchia sprzętu nadaje każdemu systemowi te same nazwy, modele obiektów określają, czego wymieniają się ERP i MES, a macierz modelu czynności 4 × 8 pokazuje, który system powinien odpowiadać za które zadanie. Zunifikowana przestrzeń nazw i platformy chmurowe zmieniają infrastrukturę, a nie te odpowiedzialności.

Projekty, które się udają, mają wspólny schemat: zaczynają od strumienia wartości i modelu danych, pilotują jedną linię z zamrożoną linią bazową, angażują operatorów od pierwszych warsztatów, utrzymują twarde zatrzymania dla tego, co naprawdę ma znaczenie, i przez lata mierzą korzyści razem z finansami. Przykład z opracowania to pokazuje: ten sam MES jest dobrą lub złą inwestycją w zależności od tego, czy zysk na ograniczeniu da się sprzedać i jak szybko pilotaż się ustabilizuje.

**Twoje pierwsze 30 dni:**

- [ ] Przejdź przez jeden strumień wartości i zaznacz każde miejsce, w którym informacja jest ponownie wpisywana, opóźniona lub brakuje jej
- [ ] Wypełnij macierz czynności ISA-95 (4 × 8) dla tego strumienia wartości: kto dziś wykonuje każdą czynność?
- [ ] Sporządź projekt hierarchii sprzętu dla obszaru pilotażowego i uzgodnij nazwy z utrzymaniem ruchu i IT
- [ ] Zamroź linię bazową: OEE na ograniczeniu, koszt braków, czas realizacji zamówienia, czas zapewnienia identyfikowalności
- [ ] Zapytaj dział sprzedaży i finanse, czy dodatkową produkcję na ograniczeniu można sprzedać i przy jakiej marży na wkładzie
- [ ] Spisz swoje wymagania regulacyjne dotyczące zapisów (Part 11, QMSR, FSMA 204, wymagania klientów)
- [ ] Porozmawiaj z dwoma podobnymi zakładami, które używają MES, bez obecności dostawców
- [ ] Kup ISA-95 części 1 i 3 do biblioteki projektu

---

## Dalsza lektura na m365.fm

**Powiązane przewodniki**
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/): architektura chmurowa, zunifikowana przestrzeń nazw na Azure IoT Operations, platforma danych
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [OT Cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Predictive Maintenance and IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [S&OP, MRP and Production Planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/)
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [5S and Visual Management](https://www.m365.fm/en/learn/5s-visual-management/)

**Szczegółowe omówienia**
- [Paperless Manufacturing and Digital Work Instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Andon System](https://www.m365.fm/en/learn/shop-floor-management/andon/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Process Mining in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/)
- [Manufacturing Workforce Skills](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Hasła słownikowe (encje)**
[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** jest gospodarzem m365.fm i pracuje w iFAKT GmbH. Na m365.fm pisze o produkcji typu lean, doskonaleniu operacyjnym i cyfrowej transformacji produkcji, w tym o systemach i modelach danych łączących halę produkcyjną z planowaniem.

**Uwaga: Autor pracuje w iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Status: **(F)** = opened and checked for this article; **(S)** = opened and checked on November 20, 2026 by the fact check of a related guide on m365.fm (file named), cited here with the same wording, not re-fetched for this article because the shared web-fetch budget was exhausted.

1. ISA-95 Standard: Enterprise-Control System Integration (parts list with editions, Levels 0–4, Purdue basis, scope of each part). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard (F)
2. Update to ISA-95 Standard Addresses Integration of Enterprise and Manufacturing Control Systems. ISA press release, Durham, N.C., April 10, 2025 (ANSI/ISA-95.00.01-2025, IEC 62264-1 Mod; quotes by Christian Monchinski). https://www.isa.org/news-press-releases/2025/april/update-to-isa-95-standard-addresses-integration-of (F)
3. ANSI/ISA-95.00.03-2013, Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management, preview incl. table of contents (clauses 6–9). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISA/preview_ANSI+ISA+95.00.03-2013.pdf ; ISA preview with scope: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (F)
4. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95 (levels, time frames, information types). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3 (F)
5. OPC 10030: ISA-95 Common Object Model, section 4.2 ISA-95 Summary (object models, nesting, B2MML by MESA, OPC UA mapping follows B2MML). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2 (F)
6. IEC 62264-6:2020, Enterprise-control system integration – Part 6: Messaging service model, edition 1.0, 2020-06-26. IEC Webstore. https://webstore.iec.ch/publication/59706 (F)
7. IEC 62264 (list of parts and IEC editions). Wikipedia (secondary source). https://en.wikipedia.org/wiki/IEC_62264 (F)
8. Manufacturing Execution Systems, market definition. Gartner Peer Insights. https://www.gartner.com/reviews/market/manufacturing-execution-systems (F)
9. What Isn't an MES? (MESA International MES functional model with 11 functions, one of eight MESA models; 45 percent cycle-time claim attributed to MESA). Control Engineering. https://www.controleng.com/what-isnt-an-mes (F)
10. MES Definition Work Continues (AMR Research 1992; MESA 1997 definition; ISA-95 MOM categories; 40+ manufacturers, requirements time reduced to four to six weeks). Automation World, March 1, 2006. https://automationworld.com/products/control/news/13302768/mes-definition-work-continues (F)
11. ISA Receives MESA International Content (MESA to cease operations effective June 30, 2026; content and educational programs assumed by ISA). International Society of Automation. https://programs.isa.org/isa-receives-mesa-international-content (F)
12. Manufacturing execution system (MES), definition (MESA-11 in 1997; ISA-95 merged MESA-11 with the Purdue Reference Model). TechTarget. https://www.techtarget.com/searcherp/definition/manufacturing-execution-system-MES (F)
13. The Five Parts of ISA-95. Automation World, May 6, 2013. https://automationworld.com/products/software/article/13309288/the-five-parts-of-isa-95 (F)
14. Manufacturing execution system. Wikipedia (secondary source; ISA-95 Part 1 2000, Part 3 2005; Level 3 systems as MOMS; B2MML). https://en.wikipedia.org/wiki/Manufacturing_execution_system (F)
15. HPImpact: Report "clarifies" MES for management (MESA white paper "MES: A High Level Vision"). Hydrocarbon Processing, December 1997 issue. https://www.hydrocarbonprocessing.com/magazine/1997/december-1997/misc/hpimpact-report-clarifies-mes-for-management (F; page metadata shows a 2016 upload date)
16. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html (F, re-fetched November 20, 2026)
17. Kang, N.; Zhao, C.; Li, J.; Horst, J. A. (2016): A hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54(21), pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754 (F, re-fetched November 20, 2026)
18. ISO 22400 KPI Selection Guide (secondary source for the count of 34 KPIs). Fabrico. https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/ (F, re-fetched November 20, 2026)
19. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10 (F, re-fetched November 20, 2026)
20. Quality Management System Regulation (QMSR): effective February 2, 2026; incorporates ISO 13485:2016 and clause 3 of ISO 9000:2015 by reference. U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation (F)
21. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 (F, re-fetched November 20, 2026)
22. MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals. MTConnect Institute. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf (F, re-fetched November 20, 2026)
23. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards (F, re-fetched November 20, 2026)
24. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3) (S: digital-twin-manufacturing.md)
25. Publish and subscribe MQTT messages using MQTT broker (Azure IoT Operations; MQTT 3.1.1 and MQTT 5). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker (F, re-fetched November 20, 2026)
26. What is the connector for OPC UA? Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector (F, re-fetched November 20, 2026)
27. What is ISA-95? The Five Levels, IEC 62264 and the Automation Pyramid (secondary source for the equipment hierarchy names enterprise, site, area, work center, work unit; vendor page). OPC Router. https://www.opc-router.com/what-is-isa-95/ (F)
28. Eclipse Sparkplug (Sparkplug Specification Version 3.0; birth and death certificates; TLS). Eclipse Foundation, Sparkplug Working Group. https://sparkplug.eclipse.org/ (F)
29. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods (F, re-fetched November 20, 2026)
30. Muchiri, P.; Pintelon, L. (2008): Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46(13), pp. 3517–3535. DOI: 10.1080/00207540601142645 (S: manufacturing-kpis.md)
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep (F, re-fetched November 20, 2026)
32. 7.4.1 ISA95EquipmentElementLevelEnum, OPC 10030: ISA-95 Common Object Model. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/7.4.1 (F, accessed November 20, 2026)
33. Enterprise-Control System Integration, Part 1: Models and Terminology, ISA-dS95.01-1999, Draft 14, November 1999 (historical public draft, section 5.2 equipment hierarchy, section 7.1 information categories; not the current edition). https://xml.coverpages.org/ISA95Part1-Draft14-NIST.pdf (F, accessed November 20, 2026)
34. ISA-88. Wikipedia (secondary source; procedural control model; adopted by the IEC in 1997 as IEC 61512-1). https://en.wikipedia.org/wiki/ISA-88 (F, accessed November 20, 2026)
35. SAP Digital Manufacturing (product page, vendor description; MOM platform on SAP Business Technology Platform; SAP Manufacturing Execution customers advised to transition). SAP. https://www.sap.com/products/scm/digital-manufacturing.html (F, accessed November 20, 2026)
36. B2MML-BatchML (README: B2MML implements ANSI/ISA-95, BatchML implements ANSI/ISA-88). MESA International, GitHub. https://github.com/MESAInternational/B2MML-BatchML (F, accessed November 20, 2026)
37. ISA-TR88.00.02-2022, Machine and Unit States: An Implementation Example of ISA-88 (PackML), preview (sections 4 to 6: state model, modes). International Society of Automation. https://www.isa.org/getmedia/300dbd50-d549-41ac-b372-a5e52f32fc97/tr_880002_preview.pdf (F, accessed November 20, 2026; full title per ISA catalog not shown in the preview)
38. 21 CFR 211.188, Batch production and control records. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.188 (F, accessed November 20, 2026)
39. IATF 16949:2016 vs. ISO/TS 16949:2009 comparison matrix (section 8.5.2.1). DNV (secondary source). https://www.dnv.com/siteassets/images/pdf-documents/iatf-2009-to-2016-comparison-matrix.pdf (F, accessed November 20, 2026)
40. Computer Software Assurance for Production and Quality Management System Software, final guidance, February 2026 (CDRH, CBER). U.S. Food and Drug Administration. https://fda.gov/regulatory-information/search-fda-guidance-documents/computer-software-assurance-production-and-quality-management-system-software (F, accessed November 20, 2026)
41. FASB Amends Guidance on Cloud Computing Arrangements (ASU 2018-15, issued August 29, 2018). Deloitte DART, Heads Up. https://dart.deloitte.com/USDART/home/publications/archive/deloitte-publications/heads-up/2018/fasb-amends-guidance-cloud-computing-arrangements (F, accessed November 20, 2026)
42. FASB Amends Guidance on the Accounting for and Disclosure of Software Costs (ASU 2025-06, September 18, 2025). Deloitte DART. https://dart.deloitte.com/USDART/home/news/all-news/2025/sep/fasb-amends-guidance-on-software-costs (F, accessed November 20, 2026)
43. New MESA Model: A Framework for Smarter Manufacturing. Automation.com, April 22, 2022. https://www.automation.com/article/mesa-model-a-framework-smarter-manufacturing (F, accessed November 20, 2026)
44. Manditereza, K.: Implementing Unified Namespace (UNS) With MQTT Sparkplug. HiveMQ blog (vendor source), first published December 20, 2022, updated February 22, 2026. https://hivemq.com/blog/implementing-unified-namespace-uns-mqtt-sparkplug (F, accessed November 20, 2026)
