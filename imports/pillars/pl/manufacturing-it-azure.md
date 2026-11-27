# SEO metadata

| Field | Value |
|---|---|
| Meta title | Azure dla produkcji: przewodnik architektury 2026 |
| Meta description | Azure dla produkcji w 2026: status usług, architektura referencyjna, bezpieczeństwo OT (IEC 62443, NIST CSF 2.0), identyfikowalność, AI i FinOps. |
| Slug | `manufacturing-it-azure` |

# Azure dla produkcji: kompletny przewodnik po IT produkcji w Microsoft Azure (listopad 2026)

**Krótka odpowiedź:** pod koniec 2026 roku Azure dla przemysłu wytwórczego sprowadza się do trzech warstw: Azure IoT Operations na Kubernetes z włączonym Azure Arc w zakładzie, Microsoft Fabric (Real-Time Intelligence i OneLake) jako platforma danych oraz Microsoft Foundry, Power BI i Copilot do analityki, AI i pracy biurowej. Starsze elementy budulcowe są wycofane (Time Series Insights, podglądy agentów produkcyjnych) lub zaplanowane do wycofania (IoT Central w 2029 roku, bezpieczeństwo OT w Defender for IoT). Sukces zależy mniej od usług, a bardziej od tego, czy posiadasz własny model danych, czy projekt bezpieczeństwa OT jest zgodny z ISA/IEC 62443 i wytycznymi NIST oraz czy wybierasz przypadki użycia z zmierzonym punktem odniesienia.

**Najważniejsze wnioski**

- Planuj nowe połączenia z zakładem na **Azure IoT Operations**, a nie na IoT Central ani na ręcznie budowanych łańcuchach modułów IoT Edge. Wybierz wariant **Standard**, jeśli Twoje maszyny komunikują się przez OPC UA; wariant Essentials nie zawiera łącznika OPC UA.
- Do danych szeregów czasowych używaj **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator). Time Series Insights zostało wycofane 7 lipca 2024 roku.
- Trzymaj logikę biznesową z dala od usług w wersji podglądowej. Microsoft wycofał podgląd modelu danych produkcyjnych i agenta fabrycznego w 2025 roku, około roku po ich uruchomieniu.
- Zaplanuj już teraz zastąpienie **monitoringu OT**. Microsoft w pełni wycofa bezpieczeństwo OT w Defender for IoT w październiku 2029 roku; blog partnera Microsoft podaje 31 maja 2028 roku jako koniec wsparcia.
- Dopasuj swój program bezpieczeństwa do **ISA/IEC 62443** (strefy i kanały komunikacyjne) oraz **NIST CSF 2.0**; dostawcy dla obronności potrzebują również **CMMC** dla systemów przetwarzających FCI lub CUI.
- Zacznij od przypadków użycia, które mają punkt odniesienia i właściciela: monitorowanie OEE w czasie rzeczywistym i identyfikowalność zwykle przynoszą zwrot szybciej niż utrzymanie predykcyjne.

## Spis treści

1. [Czym jest Azure dla przemysłu wytwórczego dzisiaj](#co-oznacza-azure-dla-produkcji-dzisiaj)
2. [Status usług Azure dla produkcji, listopad 2026](#status-usług-azure-dla-przemysłu-listopad-2026)
3. [Najpierw model danych: ISA-95 i unified namespace](#najpierw-model-danych-isa-95-i-unified-namespace)
4. [Referencyjna architektura Azure dla produkcji](#architektura-referencyjna-azure-dla-produkcji)
5. [Konwergencja IT/OT i bezpieczeństwo: ISA/IEC 62443, NIST CSF 2.0, CMMC i NIS2](#konwergencja-itot-i-bezpieczeństwo)
6. [Przypadek użycia 1: Utrzymanie predykcyjne w Azure](#przypadek-użycia-1-utrzymanie-predykcyjne-w-azure)
7. [Przypadek użycia 2: Identyfikowalność i genealogia](#przypadek-użycia-2-identyfikowalność-i-genealogia)
8. [Przypadek użycia 3: Cyfrowe bliźniaki](#przypadek-użycia-3-cyfrowe-bliźniaki)
9. [Przypadek użycia 4: KPI w czasie rzeczywistym, OEE i strumienie wartości](#przypadek-użycia-4-kpi-w-czasie-rzeczywistym-oee-i-strumienie-wartości)
10. [Integracja ERP i MES: SAP, Dynamics 365 i przepływ danych na hali produkcyjnej](#integracja-erp-i-mes)
11. [AI i Copilot w produkcji: co jest realistyczne](#ai-i-copilot-w-produkcji)
12. [FinOps dla IT w przemyśle](#finops-w-it-produkcyjnym)
13. [Budowanie uzasadnienia biznesowego dla Azure w przemyśle](#budowanie-uzasadnienia-biznesowego-dla-azure-w-produkcji)
14. [Mapa drogowa: pięć faz do skalowalnej platformy Azure dla produkcji](#plan-działania-pięć-faz-do-skalowalnej-platformy-produkcyjnej-na-azure)
15. [Typowe błędy w projektach Azure dla produkcji](#typowe-błędy-w-projektach-produkcyjnych-opartych-na-azure)
16. [Zastosowania branżowe w ekosystemie Microsoft: przykład iFAKT Polaris](#zastosowania-branżowe-w-ekosystemie-microsoft)
17. [FAQ](#faq)
18. [Podsumowanie](#podsumowanie)

---

## Co oznacza Azure dla produkcji dzisiaj

Pięć lat temu wyszukiwanie hasła „Azure for manufacturing” lub „Azure IoT for manufacturing” zwracało znajomą listę: IoT Hub, IoT Edge, Stream Analytics, Time Series Insights i Synapse. Ta lista nie opisuje już sytuacji w 2026 roku. Microsoft przebudował swoją strategię przemysłowego IoT w trzech kierunkach:

1. **Edge zamiast urządzenia:** Zbieranie danych w zakładzie działa teraz na **Azure IoT Operations**, zestawie usług danych na klastrach Kubernetes, którymi zarządza się z chmury za pośrednictwem **Azure Arc**. Microsoft opisuje tę usługę jako „unified data plane for the edge” [3]. Ogólną dostępność ogłoszono w listopadzie 2024 roku [5].
2. **Platforma danych zamiast usług punktowych:** Szeregi czasowe, zdarzenia i dane główne trafiają do **Microsoft Fabric**, w szczególności do Real-Time Intelligence z Eventstream, Eventhouse i Activator. Microsoft wycofał Time Series Insights i wskazuje klientom Fabric Eventhouse jako docelowy cel migracji [10].
3. **Platforma zamiast gotowej aplikacji:** W obszarze IoT i produkcji Microsoft wycofuje się z własnych, gotowych aplikacji. IoT Central przestał przyjmować nowe aplikacje 23 września 2026 roku i zostanie wycofany 20 września 2029 roku [8], [64]. Branżowe podglądy „Manufacturing data solutions” i „Factory Operations Agent” zostały wycofane 30 maja 2025 roku [2].

Oferta branżowa nosi teraz nazwę **Microsoft for Manufacturing** (wcześniej „Microsoft Cloud for Manufacturing”). Microsoft organizuje ją w cztery obszary rozwiązań: inżynierię cyfrową, odporne łańcuchy dostaw, inteligentne fabryki oraz połączonych klientów [1]. Dla inteligentnej fabryki Microsoft wymienia cztery scenariusze: modernizację edge i infrastruktury, optymalizację operacji z wykorzystaniem AI, łączenie i wzmacnianie pozycji pracowników oraz utrzymanie ruchu i jakość [1]. Microsoft wskazuje Fabric jako platformę dla „digital thread” [1].

Dla Ciebie jako lidera IT, OT lub transformacji cyfrowej oznacza to, że elementy budulcowe stały się bardziej ogólne, a większa część odpowiedzialności za model danych, integrację i operacje spoczywa na Tobie lub na Twoich partnerach. Ten przewodnik pokazuje, jak tę odpowiedzialność realizować w uporządkowany sposób. Łączy technologię Azure z zagadnieniami, które decydują o sukcesie: model danych, bezpieczeństwo, [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) jako temat organizacyjny, KPI i koszty.

### Dla kogo jest ten przewodnik

- **Liderzy IT i zespoły chmurowe**, które już korzystają z Microsoft 365 i Azure i zostały poproszone o połączenie zakładów.
- **Inżynierowie OT i automatyki**, którzy chcą zrozumieć, co Kubernetes, MQTT i Fabric oznaczają dla ich urządzeń.
- **Kierownicy zakładów, jakości i utrzymania ruchu**, którzy oceniają przypadki użycia, takie jak predykcyjne utrzymanie ruchu czy identyfikowalność.
- **Zespoły finansów i zakupów**, które muszą uczynić koszty chmury w produkcji przewidywalnymi.

### Terminy produkcyjne dla administratorów Microsoft 365 i Azure

Jeśli przychodzisz z korporacyjnego IT, projekty produkcyjne wnoszą własne słownictwo. Oto kluczowe terminy używane w tym przewodniku, każdy w jednym zdaniu:

| Termin | Znaczenie | Najbliższa analogia z IT |
|---|---|---|
| **OT** (operational technology) | Technologia sterująca procesami fizycznymi: maszynami, sterownikami, systemami sterowania | Jak osobne centrum danych, którego awaria zatrzymuje produkcję |
| **PLC** (programmable logic controller) | Przemysłowy komputer sterujący maszyną w czasie rzeczywistym | System wbudowany o czasie eksploatacji 15 lat lub dłuższym |
| **SCADA** | System nadzorczy do monitorowania i obsługi kilku maszyn lub linii | Konsola monitoringu z prawem zapisu |
| **MES** (manufacturing execution system) | Steruje wykonaniem zleceń produkcyjnych w zakładzie i je rejestruje | System przepływu pracy między ERP a maszyną |
| **OPC UA** | Niezależny od producenta przemysłowy standard wymiany danych z modelem informacji i wbudowanymi zabezpieczeniami | REST API plus schemat plus certyfikaty, dla maszyn |
| **MQTT** | Lekki protokół publikacji i subskrypcji | Magistrala komunikatów, podobna do tematów w Event Grid lub Service Bus |
| **Unified namespace (UNS)** | Centralna, hierarchiczna struktura zdarzeń, w której wszystkie systemy publikują swój bieżący stan | Katalog tematów obejmujący całe przedsiębiorstwo |
| **OEE** (overall equipment effectiveness) | Efektywność urządzeń wyliczana z dostępności, wydajności i jakości | SLA dostępności, ale dla maszyn i uwzględniające jakość |
| **KQL** (Kusto Query Language) | Język zapytań Fabric Eventhouse i Azure Data Explorer | Ten sam język, którego używasz w Log Analytics i Microsoft Sentinel |
| **Model Purdue** | Model referencyjny warstwujący systemy zakładu od urządzeń polowych po przedsiębiorstwo; ISA-95 na nim bazuje [26] | Model warstwowania sieci, od VLAN urządzeń po korporacyjną sieć WAN |

Wiersz dotyczący KQL to dobry punkt wyjścia dla administratorów: jeśli znasz KQL z Sentinel lub Log Analytics, od razu możesz wysyłać zapytania do danych maszynowych w Eventhouse.

### Od czego zacząć jako administrator Microsoft 365 lub Azure

Nie musisz zostawać inżynierem automatyki, aby wnieść wartość do projektu produkcyjnego. Pięć zadań zwykle leży po stronie centralnego IT i można je przygotować, zanim podłączona zostanie pierwsza maszyna:

1. **Tożsamości i role:** Utwórz grupy w Microsoft Entra ID oraz role Azure RBAC dla personelu OT, partnerów i zespołów operacyjnych; użyj Privileged Identity Management, aby dostęp uprzywilejowany był ograniczony czasowo.
2. **Landing zone Azure dla zakładów:** Zdefiniuj strukturę subskrypcji i grup zasobów dla każdego zakładu i użyj Azure Policy do wymuszania tagów (zakład, centrum kosztów, przypadek użycia) oraz dozwolonych regionów.
3. **Przetestuj Azure Arc:** Połącz serwer testowy lub klaster Kubernetes z Arc i uzgodnij z zespołem sieciowym zatwierdzenie wymaganych wychodzących punktów końcowych w łańcuchu proxy. W wielu firmach te zatwierdzenia reguł zapory zajmują najwięcej czasu.
4. **Podstawy Fabric:** Ustal pojemność, strukturę obszarów roboczych i model dostępu; przenieś istniejące zasady zarządzania Power BI.
5. **Zbuduj relację roboczą z OT:** Poznaj model stref zakładu, zanim zaproponujesz zmiany w sieci. W OT dostępność ma pierwszeństwo przed poufnością, a okna serwisowe wynikają z harmonogramu produkcji, a nie z Patch Tuesday.

---

## Status usług Azure dla przemysłu, listopad 2026

Microsoft zmienia nazwy usług, uruchamia wersje zapoznawcze i ponownie je wycofuje. W projektach produkcyjnych o okresie eksploatacji od pięciu do dziesięciu lat cykl życia produktu jest więc kryterium architektonicznym. Poniższa tabela podsumowuje zweryfikowany status na dzień 20 listopada 2026 roku.

### Przegląd usług: przeznaczenie, status, źródło

| Usługa | Przeznaczenie w produkcji | Status, listopad 2026 | Źródło |
|---|---|---|---|
| **Azure IoT Operations** | Płaszczyzna danych na brzegu sieci: broker MQTT, konektory (OPC UA, HTTP/REST), przepływy danych, zarządzanie zasobami | Ogólnie dostępna od listopada 2024; regularne wydania. Microsoft Learn wskazuje wersję 1.5.x (wydanie 2610) jako wydanie wprowadzające nowy SKU, **Essentials** (wyłącznie klastry jednowęzłowe, bez konektora OPC UA), obok **Standard** z pełnym zestawem funkcji | [3], [5], [7] |
| **Azure Device Registry** | Chmurowa reprezentacja zasobów i urządzeń, rejestr schematów | Integralna część Azure IoT Operations; integracja z IoT Hub w wersji zapoznawczej | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Chmurowa brama dla bezpośrednio podłączonych urządzeń, cykl życia urządzeń | Aktywna; rekomendowana przez Microsoft jako docelowa dla klientów IoT Central | [8], [64] |
| **Azure IoT Central** | SaaS IoT typu low-code | Brak nowych aplikacji od 23 września 2026; wycofanie 20 września 2029 | [8], [64] |
| **Azure IoT Edge** | Środowisko uruchomieniowe kontenerów dla urządzeń brzegowych (moduły) | Produkt wspierany; wersja 1.5 LTS poza wsparciem od 10 listopada 2026 (podobnie EFLOW 1.5 dla Windows); bieżąca wersja 1.6 LTS (lipiec 2026) wspierana do 14 listopada 2028; na stronie wersji nie ma EFLOW 1.6 LTS (jest tylko ścieżka ciągłych wydań EFLOW) | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time hub) | Strumieniowe pozyskiwanie danych, analityka szeregów czasowych w KQL, alerty | Ogólnie dostępna od konferencji Ignite, listopad 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Centralne miejsce przechowywania danych głównych, transakcyjnych i z czujników | Ogólnie dostępna | [17] |
| **Digital twin builder** (Fabric Real-Time Intelligence) | Oparte na ontologii cyfrowe reprezentacje zasobów i procesów | Wersja zapoznawcza | [15] |
| **Fabric IQ ontology** | Semantyczna warstwa biznesowa dla analityki i agentów | Wersja zapoznawcza; dotychczasowe doświadczenie z ontologiami zostanie wycofane 31 stycznia 2027, a istniejące ontologie trzeba skopiować do nowego środowiska | [16] |
| **Azure Digital Twins** | Bliźniaki oparte na grafach, z użyciem DTDL | Aktywna, brak zapowiedzi wycofania na stronie przeglądowej; 3D Scenes Studio w wersji zapoznawczej | [14] |
| **Azure Data Explorer** | Bazа danych szeregów czasowych w KQL poza Fabric | Aktywna, brak zapowiedzi wycofania; używa KQL jak Fabric Eventhouse | [19] |
| **Microsoft Foundry** (dawniej Azure AI Foundry / Azure AI Studio) | Modele, agenci i narzędzia dla aplikacji AI | Aktywna; „Azure AI Services” są obecnie „Foundry Tools”; prompt flow zostanie wycofany 20 kwietnia 2027 | [20], [34], [37] |
| **Azure Machine Learning** | Trenowanie, wdrażanie i MLOps dla klasycznych modeli ML | Aktywna; Microsoft pozycjonuje Foundry do generatywnej AI, a Azure ML do klasycznego ML i MLOps. Wbudowane etykietowanie danych zostało wycofane 30 września 2026 | [37], [38] |
| **Azure Arc** | Zarządzanie klastrami Kubernetes i serwerami poza Azure | Aktywna; podstawa Azure IoT Operations | [3] |
| **Azure Local** (dawniej Azure Stack HCI) | Infrastruktura hiperkonwergentna w zakładzie | Aktywna; zmiana nazwy w listopadzie 2024 | [21] |
| **Microsoft Defender for IoT (bezpieczeństwo OT)** | Pasywny monitoring sieci OT, inwentaryzacja zasobów, wykrywanie anomalii | Wycofanie oficjalnie ogłoszone 2 listopada 2026; pełne wycofanie w październiku 2029; do tego czasu wyłącznie aktualizacje zabezpieczeń i poprawki błędów, bez nowych funkcji OT. Blog partnera Microsoft podaje 31 maja 2028 jako koniec wsparcia. Konektory dla Armis, Dragos i Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Eksplorator szeregów czasowych (rozwiązanie starsze) | Wycofana 7 lipca 2024; Microsoft wskazuje jako cel migracji Fabric Eventhouse | [10] |
| **Azure Percept** | Zestaw deweloperski AI na brzegu sieci | Wycofany 30 marca 2023 | [11] |
| **Manufacturing data solutions** (Azure) oraz **Factory Operations Agent** (Azure AI i Copilot Studio) | Model danych produkcyjnych i produkcyjny copilot (wersje zapoznawcze) | Wycofane od 30 maja 2025 (ogłoszenie z lutego 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Agent bezpieczeństwa w miejscu pracy (wersja zapoznawcza) | Wycofany od 23 czerwca 2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Model danych produkcyjnych w Fabric (wersja zapoznawcza od kwietnia 2024) | Status niejasny: zawiadomienia o wycofaniu wymieniają „Manufacturing data solutions” bez przyrostka Fabric i nie obejmują ani nie wykluczają wariantu Fabric; od kwietnia 2024 nie ma osobnego wpisu. Nie planować go w nowych projektach; zapytać Microsoft o jego status. | [2] |

### Co oznacza tabela dla Twojej architektury

**Po pierwsze:** Planuj nowe połączenia z zakładem na Azure IoT Operations, a nie na IoT Central ani we własnych łańcuchach modułów IoT Edge, chyba że masz ku temu konkretny powód. IoT Edge pozostaje wspierany, ale jest modelem środowiska uruchomieniowego urządzeń; Azure IoT Operations obsługuje płaszczyznę danych zakładu za pomocą brokera, konektorów i modelu zasobów [3]. Wybierając SKU, pamiętaj, że wersja Essentials nie zawiera konektora OPC UA [3]. W typowym zakładzie z maszynami OPC UA punktem wyjścia jest Standard.

**Po drugie:** Trzymaj logikę biznesową z dala od usług w wersji zapoznawczej. Historia rozwiązań do przetwarzania danych produkcyjnych pokazuje, że model danych produkcji firmy Microsoft może przejść od wersji zapoznawczej do wycofania w nieco ponad rok [2]. Twój model danych należy do Ciebie i powinien być udokumentowany w otwartych formatach (tabele Delta w OneLake, schematy JSON w brokerze, DTDL lub modele informacyjne OPC UA).

**Po trzecie:** Przejrzyj strategię bezpieczeństwa OT. Oficjalne ogłoszenie Azure podaje październik 2029 jako datę zakończenia bezpieczeństwa OT w Defender for IoT, natomiast blog partnera Microsoft wskazuje 31 maja 2028 jako koniec wsparcia [22], [39]. Planuj z wcześniejszą datą: zakup, wdrożenie i odbiór nowych czujników w środowiskach regulowanych często trwają dłużej niż rok.

**Po czwarte:** Przejrzyj swoją flotę urządzeń IoT Edge. Urządzenia z IoT Edge 1.5 nie otrzymują aktualizacji bezpieczeństwa od 10 listopada 2026 roku. Microsoft opisuje przejście na 1.6 LTS jako proste, ponieważ nie zawiera większych zmian funkcji [12]. Ten sam koniec wsparcia dotyczy urządzeń z systemem Windows działających na IoT Edge for Linux on Windows (EFLOW) 1.5; strona wersji nie wymienia EFLOW 1.6 LTS, a jedynie ciągły kanał wydań [12]. Wyjaśnij docelową ścieżkę dla tych urządzeń z Microsoftem lub dostawcą sprzętu.

> **Uwaga o aktualności:** Ta tabela stanowi migawkę stanu. Przed każdą decyzją architektoniczną sprawdź połączone strony Microsoft oraz portal Azure Updates, filtrując według hasła „Retirements”.

---

## Najpierw model danych: ISA-95 i unified namespace

Wiele projektów produkcyjnych kończy się niepowodzeniem nie z powodu chmury, lecz dlatego, że nikt nie zdefiniował, czym jest „maszyna”, „zlecenie” czy „zdarzenie przestoju” w modelu danych. Odpowiedz na to pytanie, zanim wdrożysz pierwszą usługę Azure.

### ISA-95 i piramida automatyzacji

Seria **ANSI/ISA-95** (międzynarodowo IEC 62264) opisuje integrację systemów przedsiębiorstwa i systemów sterowania [26]. ISA opisuje ją jako zbiór norm integrujących systemy logistyczne z systemami sterowania produkcją, opartych na referencyjnym modelu Purdue, mających zastosowanie w produkcji dyskretnej, ciągłej i logistyce; seria liczy osiem części [26]. Daje ona dwie rzeczy przydatne przy każdej architekturze chmurowej:

- **Model poziomów:** Poziomy 0–2 obejmują proces fizyczny, czujniki, siłowniki oraz sterowanie (PLC, SCADA). Poziom 3 to zarządzanie operacjami produkcyjnymi (MES, MOM). Poziom 4 to planowanie biznesowe ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). W Europie tę hierarchię często przedstawia się jako „piramidę automatyzacji”; w Ameryce Północnej bardziej powszechny jest model Purdue.
- **Model obiektowy:** ISA-95 definiuje pojęcia takie jak hierarchia wyposażenia (przedsiębiorstwo, zakład, obszar, stanowisko pracy, jednostka robocza), materiał, personel, zlecenia produkcyjne i dane o wydajności. OPC Foundation odwzorowała ten model we własnej specyfikacji towarzyszącej dla OPC UA [35].

Krytyka piramidy jest dobrze znana: dane przemieszczają się tylko poziom po poziomie, każdy interfejs to integracja punkt-punkt, a nowa aplikacja musi łączyć się z kilkoma systemami. Model obiektowy natomiast pozostaje wartościowy, ponieważ daje IT, OT i biznesowi wspólny język.

### Unified namespace: zdarzenia zamiast piramidy

**Unified namespace (UNS)** to wzorzec architektoniczny, a nie norma. Wszystkie systemy publikują swój bieżący stan jako zdarzenia do centralnego, hierarchicznie zorganizowanego brokera, zazwyczaj MQTT. Odbiorcy subskrybują tematy, których potrzebują. Hierarchia tematów często odpowiada hierarchii wyposażenia ISA-95, na przykład:

```
acme/dayton-plant/assembly/line-3/station-20/state
acme/dayton-plant/assembly/line-3/station-20/order
acme/dayton-plant/assembly/line-3/station-20/quality
```

Azure IoT Operations zawiera natywny dla brzegu (edge) broker MQTT, który obsługuje MQTT 3.1.1 i MQTT 5 [40]. Konektor OPC UA publikuje dane z serwerów OPC UA jako JSON w formacie OPC UA PubSub do tematów brokera, a także może zapisywać wartości z powrotem do węzłów OPC UA; żądania zapisu korzystają ze wzorca żądanie/odpowiedź MQTT 5 [4]. Dzięki temu można zbudować UNS w zakładzie bez uruchamiania osobnego brokera.

Jeśli już prowadzisz UNS na innym brokerze, nie musisz go zastępować: przepływy danych mogą przekazywać komunikaty do zewnętrznych brokerów MQTT [3]. To, czy użyjesz brokera Microsoft jako UNS zakładu, czy jako źródła zasilającego istniejący broker, jest decyzją operacyjną. Istotna jest wiążąca konwencja tematów i ładunków, niezależna od produktu.

### ISA-95 czy UNS? Jedno i drugie.

Produktywna odpowiedź brzmi: użyj **ISA-95 jako słownictwa** i **UNS jako wzorca transportu**. W praktyce:

| Pytanie | Zalecenie |
|---|---|
| Jak nazywać zasoby? | Hierarchia wyposażenia ISA-95, spójna w całym przedsiębiorstwie |
| Jak strukturyzować tematy? | Według hierarchii wyposażenia, z domenami biznesowymi poniżej (stan, zlecenie, jakość, energia) |
| Jak opisywać ładunki? | Schematy JSON w rejestrze schematów Azure Device Registry [3]; dla maszyn preferuj specyfikacje companion OPC UA |
| Gdzie znajdują się dane główne? | W systemie źródłowym (ERP, MES, PLM); UNS rozprowadza jedynie referencje i stany |
| Jak obsługiwać historię? | Nie w brokerze, lecz w Eventhouse lub Lakehouse w Fabric |

### Minimalny model danych produkcyjnych

Niezależnie od narzędzi, przypadki użycia opisane w tym przewodniku wymagają podstawowego modelu z siedmioma encjami:

1. **Zasób** (maszyna, stanowisko, narzędzie) z unikalnym identyfikatorem i miejscem w hierarchii
2. **Sygnał** (tag, mierzona zmienna) z jednostką, częstotliwością próbkowania i powiązaniem z zasobem
3. **Stan** (praca, planowany postój, nieplanowany postój, przezbrojenie) z kodem przyczyny
4. **Zlecenie** (zlecenie produkcyjne, operacja) z powiązaniem z ERP
5. **Materiał oraz numer partii/seryjny** z powiązaniem z listą materiałową
6. **Zdarzenie** (alarm, ustalenie jakościowe, utrzymanie ruchu)
7. **Osoba/zmiana**, w zakresie dozwolonym przez przepisy o ochronie prywatności i umowy o pracę

Jeśli czysto powiążesz te siedem encji, możesz obsługiwać OEE, predykcyjne utrzymanie ruchu, identyfikowalność i cyfrowy bliźniak z tej samej podstawy danych. Omawiamy, jak wyprowadzić taki model ze strumienia wartości, w odcinku [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/); sama metoda jest opisana w naszym przewodniku po [mapowaniu strumienia wartości](https://www.m365.fm/en/learn/value-stream-mapping/).

---

## Architektura referencyjna Azure dla produkcji

Poniższa architektura referencyjna podsumowuje to, co Microsoft opisuje w dokumentacji Azure IoT Operations [3] oraz w architekturze referencyjnej Fabric „Connected Factory” [17], i uzupełnia warstwy, których te źródła nie obejmują: bezpieczeństwo, dane główne i stanowisko pracy.

### Model warstw

| Warstwa | Zadanie | Klocki Azure i Microsoft | Typowe decyzje |
|---|---|---|---|
| **0: Obiekt i sterowanie** | Maszyny, sterowniki PLC, czujniki, stanowiska testowe, kamery | Brak komponentu Azure; serwer OPC UA na sterowniku lub bramce, w razie potrzeby czujniki doposażeniowe | Które maszyny obsługują OPC UA? Gdzie potrzebne jest doposażenie? |
| **1: Infrastruktura brzegowa** | Moc obliczeniowa w zakładzie, segmentacja sieci | Przemysłowe komputery PC lub serwery z Kubernetes (na przykład AKS Edge Essentials na Windows, klastry oparte na Ubuntu) [3] albo Azure Local [21]; zarządzane przez Azure Arc | Klaster jednowęzłowy czy wielowęzłowy? Kto obsługuje sprzęt? Uwaga: wersja Essentials jest ograniczona do jednego węzła [3] |
| **2: Płaszczyzna danych brzegowych** | Zbieranie, normalizacja, buforowanie, lokalny UNS | Azure IoT Operations: broker MQTT, łącznik OPC UA, łącznik HTTP/REST (łączniki Akri), przepływy danych, doświadczenie operacyjne, automatyczne wykrywanie urządzeń i zasobów [3], [4] | Struktura tematów, schematy, agregacja brzegowa, bufor dyskowy brokera, zachowanie w trybie offline (maksymalnie 72 godziny, ewentualnie z ograniczoną funkcjonalnością [3]) |
| **3: Zarządzanie zasobami i urządzeniami** | Który zasób to który? Jakie punkty danych? | Azure Device Registry z przestrzeniami nazw i rejestrem schematów [3]; w przypadku urządzeń bezpośrednio połączonych IoT Hub i DPS [8] | Kto utrzymuje dane główne zasobów? Uzgadnianie z systemem utrzymania ruchu (CMMS)? |
| **4: Strumieniowanie i analityka czasu rzeczywistego** | Przyjmowanie zdarzeń, ich wzbogacanie, generowanie alarmów | Fabric Real-Time Intelligence: Eventstream, Eventhouse (KQL), Activator, pulpity czasu rzeczywistego [17], [18]; alternatywnie Azure Event Hubs i Azure Data Explorer [19] | Pojemność Fabric czy PaaS Azure? Retencja gorąca/zimna? |
| **5: Platforma danych** | Historia, dane kontekstowe, produkty danych | OneLake, Lakehouse, Data Factory dla danych z ERP, MES i zmian [17] | Struktura medalionowa, odpowiedzialność za produkty danych, model dostępu |
| **6: Semantyka i cyfrowy bliźniak** | Znaczenie, relacje, ontologia | Ontologia Fabric IQ (podgląd) [16], Digital Twin Builder (podgląd) [15] lub Azure Digital Twins z DTDL [14] | Czy akceptowalny jest podgląd? Zachowanie własności modelu |
| **7: Analityka i AI** | Modele, prognozy, agenci | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | Gdzie trenować, gdzie uruchamiać wnioskowanie (chmura czy brzeg)? |
| **8: Stanowisko pracy i procesy** | Informowanie ludzi i umożliwianie działania | Power BI, Teams (w tym scenariusze dla pracowników liniowych), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | Która rola widzi co? Urządzenia mobilne na hali produkcyjnej? |
| **Przekrojowo: bezpieczeństwo i zarządzanie** | Tożsamości, sieć, monitorowanie, zgodność | Microsoft Entra ID, Azure Policy, pakiet Microsoft Defender, Microsoft Purview, czujniki OT (Defender for IoT wyłącznie jako rozwiązanie przejściowe, rozwiązania partnerów) [22] | Model stref zgodny z ISA/IEC 62443, profil NIST CSF 2.0, ścieżki zgłaszania incydentów |
| **Przekrojowo: koszty** | Przejrzystość, alokacja, optymalizacja | Microsoft Cost Management, metryki pojemności Fabric, praktyki FinOps [25] | Koszt na zakład, linię, przypadek użycia |

### Przepływ danych w dziesięciu krokach

1. Sterownik udostępnia wartości procesowe przez serwer OPC UA.
2. Konektor OPC UA w Azure IoT Operations odczytuje skonfigurowane punkty danych zasobu i publikuje je do tematu brokera, na przykład `azure-iot-operations/data/<asset>` [4].
3. Konektor może automatycznie wykrywać zasoby na serwerach OPC UA i dodawać ich konfigurację do Azure Device Registry [4].
4. Przepływy danych filtrują, normalizują, przeliczają jednostki i wzbogacają dane o kontekst [3], [31].
5. Lokalne aplikacje (na przykład tablica andon lub kontrola inline) subskrybują bezpośrednio brokera.
6. Przepływ danych przekazuje zagregowane dane do punktu końcowego w chmurze: Event Hubs/Kafka, brokera MQTT Event Grid, Data Lake Storage, Fabric OneLake lub Azure Data Explorer [3].
7. W Fabric Eventstream pobiera dane, a Eventhouse je przechowuje do zapytań KQL [17].
8. Data Factory synchronizuje dane z ERP, MES, zmian i kosztów do OneLake [17].
9. Zdarzenia są wzbogacane o hierarchię zasobów i topologię linii; modele są trenowane i oceniane, a wyniki przechowywane w OneLake [17].
10. Real-Time Dashboards i Power BI wizualizują dane, Activator powiadamia techników, a Copilot odpowiada na pytania w języku naturalnym [17].

Microsoft szacuje, że referencyjna architektura Connected Factory generuje ponad milion zdarzeń IIoT na godzinę z 30 000 tagów w 40 fabrykach [17]. Traktuj to jako orientacyjną wartość, a nie jako gwarancję wydajności w Twoim środowisku.

### Wnioski z projektów

Firma konsultingowa b.telligent opisuje trzy wnioski z projektów z Azure IoT Operations i Fabric [31]:

- **Skonfiguruj magazynowanie w brokerze:** Bez skonfigurowanego trwałego magazynu wiadomości, których nie da się przekazać dalej, mogą zapełnić pamięć. Microsoft potwierdza to pośrednio: bufor wiadomości brokera oparty na dysku można ustawić wyłącznie podczas początkowego wdrożenia, a nie później [40]. Zdecyduj o profilu pamięci i buforze przed wdrożeniem.
- **Utrzymuj stabilne schematy:** Zmieniające się struktury JSON powodują, że dalsze przetwarzanie staje się kruche. Jednolita koperta z metadanymi i ładunkiem pomaga.
- **Konsoliduj Eventstreamy:** Ponieważ każdy Eventstream generuje koszty eksploatacji, wpis zaleca konsolidację na poziomie zakładu, a nie źródła, oraz wykonywanie transformacji w Eventhouse za pomocą zasad aktualizacji i KQL, zamiast w Eventstream.

Te wskazówki pochodzą z wpisu z marca 2025 (zaktualizowanego w czerwcu 2025); sprawdź, czy nadal obowiązują w Twojej wersji.

### Alternatywne ścieżki

Nie każdy producent potrzebuje pełnej architektury. Cztery warianty są powszechne:

| Wariant | Kiedy ma sens | Elementy składowe |
|---|---|---|
| **Bezpośrednio do chmury** | Kilka nowoczesnych, połączonych urządzeń; brak wymagań dotyczących opóźnień | IoT Hub, DPS, Fabric Real-Time Intelligence |
| **Skoncentrowany na brzegu** | Wiele maszyn, OPC UA, lokalne decyzje, sieć OT bez bezpośredniego połączenia z chmurą | Azure IoT Operations on Arc, Fabric |
| **Platforma brzegowa partnera** | Istniejąca przemysłowa platforma brzegowa od dostawcy automatyki | Platforma partnera plus Fabric lub Azure; Microsoft wymienia m.in. uruchamianie modeli Azure AI na Siemens Industrial Edge jako wskazówkę architektoniczną [2] |
| **Mały start (średnia firma produkcyjna, jeden zakład)** | Kilka linii, brak własnego zespołu Kubernetes, pierwszy przypadek użycia to OEE lub monitoring stanu | Jeden klaster jednowęzłowy z Azure IoT Operations Standard (ze względu na OPC UA), mała pojemność Fabric, Power BI; eksploatację klastra ewentualnie zlecić partnerowi |

Dla średniej firmy produkcyjnej z jednym zakładem pełna architektura warstwowa jest obrazem docelowym, a nie punktem wyjścia. Zacznij od warstw 1, 2, 4 i 8, a semantykę, AI i zarządzanie międzyzakładowe dodaj, gdy pierwszy przypadek użycia przyniesie efekty.

---

## Konwergencja IT/OT i bezpieczeństwo

Gdy dane z maszyn trafiają do chmury, zakład staje się częścią powierzchni ataku. Jednocześnie rosną wymagania regulacyjne i wymagania klientów. CISA zalicza do rdzenia amerykańskiego **sektora Critical Manufacturing** produkcję metali podstawowych, maszyn, urządzeń elektrycznych i komponentów oraz sprzętu transportowego [52], więc wiele zakładów przesyłających dane do Azure należy do sektora infrastruktury krytycznej.

Ta sekcja zaczyna od norm kształtujących projekt techniczny (ISA/IEC 62443, NIST CSF 2.0, NIST SP 800-82), następnie omawia obowiązki dotyczące określonych grup producentów (CMMC, SEC, CIRCIA) oraz, dla firm działających w UE lub mających klientów w UE, NIS2 i Cyber Resilience Act.

### ISA/IEC 62443: strefy, kanały komunikacyjne, poziomy bezpieczeństwa

Seria **ISA/IEC 62443** to podstawowe ramy dla bezpieczeństwa systemów automatyki przemysłowej i sterowania. Jej kluczowe pojęcia to strefy (grupy aktywów o tych samych potrzebach ochrony), kanały (conduits, kontrolowane ścieżki komunikacji między strefami) oraz poziomy bezpieczeństwa jako docelowy stan dla każdej strefy, od SL 1 (ochrona przed przypadkowym lub niezamierzonym naruszeniem) do SL 4 (ochrona przed wyrafinowanymi atakującymi dysponującymi rozszerzonymi zasobami) [27]. Norma definiuje też siedem wymagań fundamentalnych, od kontroli identyfikacji i uwierzytelniania po dostępność zasobów [27]. Dla architektury Azure oznacza to:

- **Klaster brzegowy jest osobną strefą:** Klaster Kubernetes uruchamiający Azure IoT Operations nie należy ani do sieci biurowej, ani bezpośrednio do sieci sterowania, lecz do strefy pośredniej (często nazywanej „industrial DMZ”, poziom 3.5 modelu Purdue).
- **Tylko połączenia wychodzące:** Arc i przepływy danych otwierają połączenia od zakładu do chmury. Połączenia przychodzące z internetu do zakładu nie są potrzebne i nie powinny być otwierane.
- **Warstwowe sieci:** Microsoft podaje, że Azure IoT Operations obsługuje bezpieczne zarządzanie urządzeniami w warstwowych sieciach [3]. Zaplanuj łańcuch proxy i zapór z wczesnym udziałem zespołu bezpieczeństwa OT.
- **Zapis wymaga świadomej decyzji:** Konektor OPC UA może zapisywać wartości z powrotem do sterowników [4]. Ta możliwość wymaga własnej oceny ryzyka i procesu zatwierdzania, a najlepiej zaczyna się od wyłączenia.
- **Certyfikaty zamiast haseł:** Dla OPC UA dostępne są nazwa użytkownika z hasłem, certyfikaty X.509 oraz dostęp anonimowy (tylko do testów) [4]. Używaj certyfikatów i listy zaufanych, a odnowienie certyfikatów traktuj jako cykliczny proces operacyjny.

### NIST CSF 2.0 i NIST SP 800-82: amerykańska podstawa

Dla większości amerykańskich producentów **NIST Cybersecurity Framework (CSF) 2.0** jest wspólnym językiem zakładu, działu IT i zarządu. NIST wydał go 26 lutego 2024 r.; rozszerza pięć funkcji: Identify, Protect, Detect, Respond i Recover o nową funkcję **Govern** i ma zastosowanie do organizacji każdej branży i wielkości [49]. Ramy są dobrowolne, ale klienci, ubezpieczyciele i audytorzy coraz częściej żądają profilu CSF.

Dwa dokumenty NIST konkretyzują te ramy dla zakładów:

- **NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security** (wrzesień 2023) obejmuje architektury OT, zagrożenia i środki zaradcze oraz dodaje nakładkę OT z dopasowanymi bazowymi zestawami kontroli SP 800-53 dla systemów OT o niskim, umiarkowanym i wysokim wpływie [50].
- **NIST IR 8183 Rev. 2, Cybersecurity Framework 2.0 Manufacturing Profile**, został opublikowany jako wstępny projekt publiczny 29 września 2025 r.; okres konsultacji zakończył się 17 listopada 2025 r., a od listopada 2026 r. nie ma na liście wersji ostatecznej [51]. Traktuj go jako projekt referencyjny, a nie jako normę ostateczną.

Jak elementy łączą się ze sobą w projekcie Azure:

| Funkcja CSF 2.0 | Co oznacza dla platformy produkcyjnej na Azure |
|---|---|
| Govern | Wyznaczeni właściciele platformy zakładowej, akceptacja ryzyka dla usług w wersji zapoznawczej, lista dostawców (Microsoft, integrator, dostawcy OT) |
| Identify | Inwentarz aktywów OT uzgodniony z Azure Device Registry; mapa przepływów danych dla każdej strefy i każdego kanału łączności |
| Protect | Role Entra ID z zasadą najmniejszych uprawnień, PIM, certyfikaty OPC UA, łączność wyłącznie wychodząca, dostęp do zapisu domyślnie wyłączony |
| Detect | Monitorowanie sieci OT (rozwiązanie partnera po Defender for IoT), scentralizowane logi z brzegu i chmury w Sentinel lub Państwa SIEM |
| Respond | Playbook reagowania na incydenty obejmujący zakład i chmurę, w tym to, kto może odłączyć klaster w czasie produkcji |
| Recover | Przetestowane ponowne wdrożenie klastra brzegowego (infrastruktura jako kod), kopia zapasowa konfiguracji brokera i aktywów |

Mali i średni producenci nie muszą działać samodzielnie: Sieć Krajowa NIST Manufacturing Extension Partnership (MEP) oferuje samooceny oparte na CSF, analizy luk, plany działań naprawczych, plany reagowania na incydenty oraz pomoc w spełnieniu wymagań DFARS [58].

### CMMC dla dostawców dla obronności

Jeśli wytwarzają Państwo części lub świadczą usługi dla Departamentu Obrony USA, do systemów przetwarzających, przechowujących lub przesyłających Federal Contract Information (FCI) lub Controlled Unclassified Information (CUI) ma zastosowanie **Cybersecurity Maturity Model Certification (CMMC)**. Przepis programowy (32 CFR Part 170) wszedł w życie 16 grudnia 2024 r. [53]. Przepis DFARS, który wprowadza CMMC do umów, wszedł w życie 10 listopada 2025 r., z etapowym wdrażaniem: faza 1 rozpoczęła się tego dnia, faza 2 rozpocznie się 10 listopada 2026 r., a faza 3 jest zaplanowana na 10 listopada 2027 r. [54]. Poziomy to: Poziom 1 (samoocena, FCI), Poziom 2 (samoocena lub ocena zewnętrzna C3PAO, oparta na NIST SP 800-171) oraz Poziom 3 (ocena DIBCAC, obejmująca praktyki z NIST SP 800-172) [53], [54].

Co to oznacza dla Azure:

- **Określ zakres danych, a nie chmury.** CMMC dotyczy Państwa systemów, a nie Azure jako platformy; nie istnieje certyfikat CMMC dla samego Azure [55]. Zwykła telemetria maszynowa może nie być CUI, podczas gdy rysunki, specyfikacje i niektóre parametry procesów dla części obronnych już mogą nim być; o tym decydują oznaczenia CUI i warunki umowy Państwa klienta. Zdecydują Państwo, które dane w UNS i w OneLake podlegają zakresowi.
- **Wybierz środowisko chmury świadomie.** Microsoft podaje, że zarówno Azure commercial, jak i Azure Government posiadają autoryzacje FedRAMP High obejmujące NIST SP 800-171, oraz że certyfikację CMMC można uzyskać dla rozwiązań w obu; Azure Government dodaje autoryzacje DoD IL4/IL5 oraz zobowiązania umowne dotyczące przechowywania danych w USA i sprawdzanego personelu z USA, a Microsoft uważa je za lepsze dopasowanie dla większości wykonawców obronnych [55]. Proszę zauważyć, że strona Microsoftu o CMMC była ostatnio aktualizowana w kwietniu 2023 r., więc szczegóły proszę sprawdzić u swojego opiekuna konta Microsoft.
- **Sprawdź dostępność funkcji.** Nie każda usługa opisana w tym przewodniku jest dostępna w Azure Government lub w środowisku Microsoft 365 GCC High. Przed projektowaniem z ich użyciem proszę zweryfikować dostępność Azure IoT Operations, Fabric i Copilot w docelowej chmurze [unverified: dotyczy poszczególnych usług; sprawdzić na stronach Microsoftu o dostępności funkcji w rządzie USA].

### Zgłaszanie incydentów w SEC i CIRCIA

Dwa amerykańskie reżimy raportowania wpływają na sposób projektowania logowania i reagowania na incydenty w platformie zakładowej:

- **Spółki publiczne:** Zgodnie z przepisami SEC przyjętymi 26 lipca 2023 r. emitenci muszą ujawnić istotny incydent cyberbezpieczeństwa w formularzu 8-K (Item 1.05) w ciągu czterech dni roboczych od ustalenia jego istotności oraz opisać zarządzanie ryzykiem cyberbezpieczeństwa, strategię i ład korporacyjny w rocznym formularzu 10-K [56]. Atak ransomware, który zatrzymuje zakład, jest typowym kandydatem do oceny istotności, dlatego Państwa playbook reagowania na incydenty OT musi zawierać szybką ścieżkę do komitetu ds. ujawnień.
- **Infrastruktura krytyczna (CIRCIA):** Ustawa Cyber Incident Reporting for Critical Infrastructure Act wymaga, aby podmioty objęte obowiązkiem zgłaszały do CISA objęte nią incydenty cybernetyczne w ciągu 72 godzin, a płatności okupu w ciągu 24 godzin, jednak dopiero po wejściu w życie ostatecznego przepisu CISA. Według stanu na październik 2026 r. CISA przekazała ostateczny przepis do przeglądu Białemu Domowi i nie został on opublikowany [57]. Proszę śledzić ostateczny przepis; to on określi, którzy producenci są objęci obowiązkiem.

### NIS2 i Cyber Resilience Act dla działalności w UE

Jeśli prowadzisz zakłady w UE lub sprzedajesz tam maszyny, istotne są także dwa europejskie akty prawne. Przykłady niemieckie poniżej pochodzą z oryginalnego niemieckiego wydania tego przewodnika i pokazują, jak przepisy UE wyglądają w praktyce.

**NIS2 (przykład: Niemcy).** Niemiecka ustawa wdrażająca NIS2 (NIS2UmsuCG) weszła w życie 6 grudnia 2025 r.; Federalny Urząd ds. Bezpieczeństwa Informacji (BSI) nadzoruje obecnie około 29 500 podmiotów zamiast około 4 500 [28]. Firmy podlegają regulacji, jeśli należą do jednego z typów podmiotów wymienionych w załącznikach 1 i 2 do ustawy o BSI i spełniają progi z § 28: co najmniej 50 pracowników lub przekroczenie 10 mln EUR zarówno rocznych przychodów, jak i sumy bilansowej [41]. Pozycje produkcyjne w załączniku 2 obejmują wyroby medyczne, komputery, produkty elektroniczne i optyczne, urządzenia elektryczne, maszyny i pojazdy; chemia i żywność to osobne sektory. Kluczowe obowiązki:

- **Rejestracja** w dwóch krokach, za pośrednictwem konta „Mein Unternehmenskonto” i portalu BSI, który został otwarty 6 stycznia 2026 r. [28].
- **Zarządzanie ryzykiem** z odpowiedzialnością na poziomie kierownictwa.
- **Środki techniczne i organizacyjne**, w tym bezpieczeństwo łańcucha dostaw i uwierzytelnianie wieloskładnikowe.
- **Zgłaszanie incydentów** o znaczącym wpływie: wczesne ostrzeżenie w ciągu 24 godzin od uzyskania wiedzy, powiadomienie o incydencie w ciągu 72 godzin, raport końcowy nie później niż miesiąc po powiadomieniu [41].

Firmy muszą samodzielnie ocenić, czy podlegają regulacji; BSI ich o tym nie powiadamia. Urząd udostępnia niewiążący internetowy test samooceny i zaleca konsultację prawną w niejasnych przypadkach [41]. Inne państwa członkowskie UE mają własne akty wykonawcze o podobnej strukturze.

**Cyber Resilience Act.** Jeśli budujesz maszyny lub produkty z elementami cyfrowymi i wprowadzasz je na rynek UE, zastosowanie ma także **Cyber Resilience Act (rozporządzenie (UE) 2024/2847)**, również w przypadku producentów z USA. Od 11 września 2026 r. producenci muszą zgłaszać aktywnie wykorzystywane podatności i poważne incydenty za pośrednictwem jednolitej platformy zgłoszeń ENISA: wczesne ostrzeżenie w ciągu 24 godzin, powiadomienie w ciągu 72 godzin oraz raport końcowy nie później niż 14 dni od udostępnienia poprawki w przypadku podatności lub w ciągu miesiąca w przypadku incydentów [30]. Od 11 grudnia 2027 r. produkty muszą spełniać zasadnicze wymagania w zakresie cyberbezpieczeństwa przed wprowadzeniem na rynek; obejmują one bezpieczne ustawienia domyślne, listę materiałów oprogramowania (SBOM) oraz aktualizacje bezpieczeństwa przez określony okres wsparcia, zazwyczaj co najmniej pięć lat [42]. Dla producentów maszyn, którzy dostarczają urządzenia z usługami chmurowymi, IT produkcyjne staje się kwestią zgodności produktu.

W przypadku architektury Azure NIS2, CSF 2.0 i CMMC wskazują ten sam kierunek: inwentaryzację (co jest połączone z chmurą?), logowanie (kto, co i kiedy zmienił?), przejrzystość łańcucha dostaw (jakie usługi i partnerzy są zaangażowani?) oraz wypróbowaną ścieżkę zgłaszania.

### Monitorowanie OT po wycofaniu Defender for IoT

2 listopada 2026 r. Microsoft oficjalnie ogłosił w Azure Updates, że w październiku 2029 r., po trzyletnim okresie przejściowym, w pełni wycofa komponent bezpieczeństwa OT usługi Defender for IoT [22]. Do tego czasu usługa otrzymuje aktualizacje bezpieczeństwa i poprawki błędów, ale nie nowe funkcje OT; istniejące umowy i odnowienia są honorowane do października 2029 r. [22]. Funkcje IoT dla przedsiębiorstw w Defender for Endpoint oraz wykrywanie urządzeń i ocena podatności nie są objęte zmianami [22]. Nie ma zastępstwa od samego Microsoftu [39]. Microsoft oferuje łączniki dla Armis, Dragos i Forescout, które przenoszą dane o zasobach OT i podatnościach do Microsoft Security Exposure Management oraz portalu Defender; rozwiązania partnerów wymagają własnych licencji i wdrożenia [22], [24].

Sprzeczne daty: blog partnera Microsoftu z listopada 2026 r. podaje **31 maja 2028 r.** jako koniec wsparcia dla bezpieczeństwa OT [39]. W chwili pisania tego tekstu nie wyjaśniono, czy jest to inna data dla niektórych rodzajów umów, czy błąd.

Zalecenie: jeśli wprowadzasz teraz monitorowanie OT, oceń bezpośrednio rozwiązania partnerów. Jeśli używasz Defender for IoT, zaplanuj wymianę tak, aby została ukończona przed połową 2028 r., i potwierdź z zespołem kont Microsoftu datę obowiązującą w Twojej umowie.

### Lista kontrolna bezpieczeństwa dla pierwszego połączenia z zakładem

- [ ] Model stref zgodny z ISA/IEC 62443 udokumentowany dla zakładu
- [ ] Klaster brzegowy (edge) w osobnej strefie, tylko połączenia wychodzące, przez proxy
- [ ] Punkty końcowe Arc i Azure jawnie dozwolone w zaporze, cała reszta zablokowana
- [ ] Połączenia OPC UA z certyfikatami; dostęp do zapisu wyłączony lub podlegający zatwierdzeniu
- [ ] Role Entra ID dla pracowników OT z zasadą najmniejszych uprawnień; uprawnienia uprzywilejowane ograniczone czasowo
- [ ] Logi z brzegu i chmury zbierane centralnie
- [ ] Inwentarz aktywów OT uzgodniony z Azure Device Registry
- [ ] Profil CSF 2.0 (bieżący i docelowy) przygotowany dla platformy zakładowej
- [ ] Zakres CMMC ustalony, jeśli zakład przetwarza FCI lub CUI
- [ ] Ścieżka zgłaszania incydentów przetestowana (SEC, CIRCIA po wejściu w życie, NIS2 dla zakładów w UE)
- [ ] Proces aktualizacji wydań Azure IoT Operations oraz Kubernetes zdefiniowany (okna serwisowe uzgodnione z produkcją)

---

## Przypadek użycia 1: Utrzymanie predykcyjne w Azure

Utrzymanie predykcyjne jest jednym z najczęściej wymienianych przypadków użycia w produkcji na Azure, a zarazem jednym z tych, w których wiele pilotaży się nie udaje. Typowa przyczyna: model pojawia się przed danymi. Szerzej piszemy o tym w odcinku [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Rozróżnienie pojęć

| Strategia | Wyzwalacz | Wymagane dane |
|---|---|---|
| Utrzymanie reaktywne | Awaria | Brak |
| Utrzymanie prewencyjne | Interwał czasowy lub licznikowy | Godziny pracy, cykle |
| Utrzymanie oparte na stanie (monitorowanie stanu) | Przekroczenie progu | Zmienne stanu (drgania, temperatura, prąd) |
| Utrzymanie predykcyjne | Prognoza pozostałego czasu użytkowania lub prawdopodobieństwa awarii | Zmienne stanu, oznaczona historia awarii i kontekst pracy |
| Utrzymanie preskryptywne | Zalecane działanie | Plus znajomość przyczyn i działań |

Wiele firm osiąga większość korzyści samym utrzymaniem opartym na stanie. Modele predykcyjne się opłacają, gdy awarie są kosztowne, dostatecznie częste i fizycznie zapowiadają się z wyprzedzeniem. [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) zapewnia ogólną strategię; jego filary, czyli utrzymanie autonomiczne i planowe, działają także bez AI.

### Wymagania wstępne dotyczące danych

Zanim wytrenujesz model, powinieneś móc odpowiedzieć twierdząco na poniższe pytania:

1. **Czy istnieje historia awarii?** Model nadzorowany potrzebuje awarii z znacznikami czasu i typami usterek. Zwykle znajdują się one w systemie utrzymania ruchu (na przykład SAP PM lub CMMS) i rzadko są kodowane w sposób czysty.
2. **Czy znaczniki czasu są zsynchronizowane?** Czas z czujników, czas sterownika i czas zaksięgowania w ERP muszą dać się ze sobą dopasować. Nieprzypadkowo Microsoft dodał dedykowane komunikaty o stanie dla brakujących lub nieosiągalnych serwerów NTP w sensorach Defender for IoT [23]; to samo dotyczy Twojego potoku danych. Konektor OPC UA przenosi znacznik czasu źródła każdej wartości [4]; należy go używać zamiast czasu dotarcia do chmury.
3. **Czy częstotliwość próbkowania odpowiada rodzajowi awarii?** Uszkodzenie łożyska widoczne jest w widmach drgań w zakresie kiloherców; zużycie opasek grzewczych widoczne jest w wartościach minutowych. Znacznik OPC UA o rozdzielczości jednej sekundy wystarczy do pierwszego przypadku, ale nie do drugiego.
4. **Czy dostępny jest kontekst pracy?** Bez informacji o produkcie, recepturze, zleceniu i stanie (przezbrojenie, produkcja, przestój) model traktuje każdą zmianę produktu jako anomalię.
5. **Czy działanie jest zdefiniowane?** Kto reaguje na ostrzeżenie, z jakim czasem wyprzedzenia i w jaki sposób wynik jest zgłaszany z powrotem?

### Sześć kroków

1. **Wybierz kandydatów:** Zasoby o wysokich kosztach awarii, powtarzających się trybach uszkodzeń i istniejących czujnikach. Analiza Pareto przyczyn przestojów z MES daje listę.
2. **Połącz dane:** Konektor OPC UA w Azure IoT Operations, punkty danych dla każdego zasobu, przepływ danych do Fabric [3], [4]. Agreguj dane drgań o wysokiej częstotliwości na brzegu sieci w cechy (RMS, kurtoza, energie pasm).
3. **Najpierw monitorowanie stanu:** Progi i proste wykrywanie anomalii w Eventhouse i Activator. Activator może bezpośrednio powiadamiać techników [17]. To przynosi wartość w ciągu tygodni, a nie miesięcy, i jednocześnie zbiera etykiety.
4. **Utwórz etykiety:** Przypisz zlecenia serwisowe z kodami awarii do szeregów czasowych. Tu leży prawdziwy wysiłek. Zaplanuj narzędzie do tego: Microsoft wycofał wbudowane etykietowanie danych w Azure Machine Learning 30 września 2026 r. i wskazuje dostawców zewnętrznych [38]. Dla etykiet szeregów czasowych z utrzymania ruchu często wystarczy aplikacja Power App, która zapisuje dane z powrotem do systemu utrzymania ruchu.
5. **Wytrenuj model:** W Fabric Data Science lub Azure Machine Learning; wyniki zapisuj w OneLake [17]. Zacznij od metod interpretowalnych (gradient boosting na cechach), zanim sięgniesz po głębokie uczenie.
6. **Wdróż do eksploatacji:** Wysyłaj predykcje jako zdarzenia do procesu utrzymania ruchu (powiadomienie w systemie utrzymania ruchu, wiadomość w Teams, formularz Power Apps do informacji zwrotnej). Monitoruj jakość modelu i dryf.

### Metryki sukcesu

Mierz wpływ operacyjny, a nie dokładność modelu: nieplanowane przestoje, średni czas między awariami (MTBF), średni czas naprawy (MTTR), udział godzin planowych w całkowitych godzinach utrzymania ruchu oraz stan zapasów części zamiennych. Te [KPI](https://www.m365.fm/entity/key-performance-indicator/) wymagają punktu odniesienia przed rozpoczęciem projektu; w przeciwnym razie nie da się udowodnić żadnej korzyści. Nasz przewodnik po [wskaźnikach produkcyjnych](https://www.m365.fm/en/learn/manufacturing-kpis/) zawiera definicje.

### Brzeg czy chmura dla wnioskowania?

| Kryterium | Wnioskowanie w chmurze | Wnioskowanie na brzegu |
|---|---|---|
| Opóźnienie | Sekundy do minut | Milisekundy |
| Wolumen danych | Wysyłane są tylko dane zagregowane | Surowe dane pozostają lokalnie |
| Eksploatacja | Prostsza (modele centralne) | Rozproszone wdrożenia, wersjonowanie dla każdej fabryki |
| Odporność | Zależy od łączności | Działa offline |
| Typowe zastosowanie | Pozostały czas użytkowania, planowanie utrzymania ruchu | Szybkie wyłączenie, kontrola jakości w linii |

W klasycznym predykcyjnym utrzymaniu ruchu wnioskowanie w chmurze na danych zagregowanych wystarcza w większości przypadków. Od wydania 2603 Microsoft wyraźnie pozycjonuje Azure IoT Operations dla scenariuszy AI bliżej maszyny („Physical AI") [6]; w sprawie wnioskowania na brzegu sprawdź aktualne informacje o wydaniu [7].

### Predykcyjne utrzymanie ruchu na Azure: bloki budowlane w skrócie

| Krok | Blok budowlany Azure i Microsoft | Alternatywa |
|---|---|---|
| Zbieranie danych | Azure IoT Operations (konektor OPC UA, przepływy danych) [3], [4] | IoT Hub dla bezpośrednio podłączonych czujników [36] |
| Przechowywanie i analiza szeregów czasowych | Fabric Eventhouse z KQL [17] | Azure Data Explorer [19] |
| Progi i alerty | Fabric Activator [17] | Azure Monitor lub własna logika |
| Trenowanie modelu | Fabric Data Science, Azure Machine Learning [17], [37] | Własna aplikacja producenta maszyn |
| Uruchomienie działania | Power Automate, Teams, Power Apps, system utrzymania ruchu | Bezpośrednie API do CMMS |

---

## Przypadek użycia 2: Identyfikowalność i genealogia

Identyfikowalność odpowiada na pytanie „Gdzie zamontowano tę część i z czego jest wykonana?”. Genealogia opisuje pełny łańcuch pochodzenia produktu obejmujący materiał, partię, etap procesu, maszynę, parametry, wynik kontroli oraz operatora. W branżach regulowanych jest obowiązkowa; wszędzie indziej przyspiesza obsługę reklamacji i zawęża zakres wycofań. Odcinek [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) omawia ten temat szczegółowo.

### Wymagania według branż

| Branża / przepis | Podstawowe wymaganie dotyczące danych | Uwaga |
|---|---|---|
| Żywność, FDA Food Traceability Rule (FSMA sekcja 204) | Kluczowe elementy danych (KDE) dla każdego krytycznego zdarzenia śledzenia (CTE), takiego jak przyjęcie, przetwarzanie i wysyłka, powiązane z kodem partii identyfikowalności; dokumentacja przekazywana FDA w ciągu 24 godzin od żądania, a w czasie wystąpienia epidemii lub wycofania dodatkowo sortowalny arkusz elektroniczny | [59]; FDA nie będzie egzekwować przepisów przed 20 lipca 2028 r. zgodnie z dyrektywą Kongresu (pierwotny termin 20 stycznia 2026 r.) |
| Wyroby medyczne, FDA QMSR (21 CFR część 820) | Od 2 lutego 2026 r. rozporządzenie o systemie zarządzania jakością włącza przez odniesienie normę ISO 13485:2016, w tym jej wymagania dotyczące identyfikacji i identyfikowalności | [61] |
| Elektroniczne dokumenty regulowane przez FDA, 21 CFR część 11 | Bezpieczne, generowane komputerowo, opatrzone znacznikiem czasu ścieżki audytu, które rejestrują wpisy i zmiany operatorów bez przesłaniania wcześniejszych wpisów, przechowywane przez cały okres przechowywania dokumentów | [60]; istotne dla farmacji, wyrobów medycznych i zapisów żywnościowych prowadzonych elektronicznie |
| Motoryzacja, IATF 16949 | Punkt 8.5.2.1 uzupełnia wymagania dotyczące identyfikacji i identyfikowalności z ISO 9001 (w tym plan identyfikowalności oparty na analizie ryzyka); punkt 7.5.3.2.1 dotyczy przechowywania określonych zapisów, zwykle odczytywanego jako okres dostaw części produkcyjnych i serwisowych plus jeden rok kalendarzowy, chyba że klient lub regulator wymaga inaczej | Tekst normy jest płatny; szczegóły z wtórnych źródeł. Wymagania specyficzne dla klientów OEM (CSR) często są dalej idące |
| Lotnictwo, AS9100D (EN 9100 w Europie, JIS Q 9100 w Japonii) | Identyfikowalność w całym cyklu życia produktu, identyfikacja konfiguracji, możliwość prześledzenia produktów wykonanych z tej samej partii surowca lub z tej samej partii produkcyjnej | AS9100D (2016) to obecna wersja; EN 9100 to technicznie równoważne wydanie europejskie [62]. Odwołanie do klauzuli (8.5.2) nie zostało sprawdzone w oryginalnym tekście normy |
| Baterie sprzedawane w UE, rozporządzenie UE o bateriach (rozporządzenie (UE) 2023/1542) | Elektroniczny paszport baterii od 18 lutego 2027 r. dla baterii trakcyjnych pojazdów elektrycznych, baterii lekkich środków transportu (np. rowery elektryczne, hulajnogi elektryczne) oraz baterii przemysłowych o pojemności powyżej 2 kWh | [29]; harmonogram według Komisji Europejskiej ma charakter orientacyjny; istotne dla amerykańskich eksporterów do UE |
| Produkty sprzedawane w UE na podstawie rozporządzenia o ekoprojekcie (ESPR, rozporządzenie (UE) 2024/1781) | Cyfrowy paszport produktu w zależności od aktu delegowanego; rejestr DPP UE działa od 20 lipca 2026 r. (początkowo w środowisku testowym); akt delegowany dla żelaza i stali planowany na czwarty kwartał 2026 r., dla tekstyliów, aluminium i opon w 2027 r.; co najmniej 18 miesięcy okresu przejściowego po przyjęciu aktu delegowanego | [29]; harmonogram według Komisji Europejskiej ma charakter orientacyjny |

W przypadku lotnictwa Mirko Peters wyjaśnia w swoim wpisie [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/), dlaczego czas realizacji i identyfikowalność są tam ściśle powiązane; nasz przewodnik po [planowaniu produkcji lotniczej](https://www.m365.fm/en/learn/aerospace-production-planning/) obejmuje kontekst AS9100, FAA i kontroli eksportu.

### Model danych genealogii

Solidna genealogia wymaga trzech typów powiązań:

1. **Materiał w materiale:** Partia A i komponent B trafiają do zespołu C (odniesienie do BOM, numer seryjny lub numer partii).
2. **Materiał a proces:** Zespół C został przetworzony w operacji 30 na stanowisku 20 przy zestawie parametrów X przez zmianę Y.
3. **Proces a wynik:** Operacja 30 wygenerowała wynik kontroli Z i, jeśli dotyczy, niezgodność.

Te relacje tworzą graf. W Fabric można go odwzorować jako strukturę tabel w Lakehouse i przeszukiwać ją za pomocą KQL lub SQL albo zamodelować jako graf w cyfrowym bliźniaku (ontologia Fabric lub Azure Digital Twins) [14], [16]. Najważniejsze jest to, że identyfikacja odbywa się u źródła: skanowanie, RFID lub kody Data Matrix na stanowisku, powiązane ze zdarzeniem zlecenia w UNS.

### Wdrożenie na Azure

- **Przechwytywanie zdarzeń na brzegu sieci:** Skanery i stanowiska publikują zdarzenia „część X rozpoczęta/zakończona na stanowisku Y” do brokera MQTT usługi Azure IoT Operations [3]. Parametry procesu napływają przez łącznik OPC UA [4]; „dataset triggering” pozwala, by jeden punkt danych wyzwalał publikację pozostałych, na przykład „cykl zakończony” [4].
- **Zestawianie kontekstu:** W Fabric zdarzenia są łączone z danymi zleceń i BOM z ERP i MES [17].
- **Zapewnienie niezmienności:** Zapisy regulacyjne wymagają niezmiennego magazynu albo co najmniej dziennika zmian odpornego na manipulacje (w przypadku zapisów regulowanych przez FDA – wymóg ścieżki audytu z 21 CFR Part 11 [60]). Polityka niezmienności OneLake obecnie dotyczy wyłącznie logów diagnostycznych, a nie danych biznesowych [43]. Na potrzeby archiwów śledzenia odpornych na audyt należy dodać Azure Blob Storage z politykami niezmienności (WORM); Fabric pozostaje warstwą analityczną.
- **Udostępnianie zapytań:** Typowe zapytania to śledzenie w przód (które gotowe wyroby zawierają partię A?) i śledzenie wstecz (z czego składa się numer seryjny S?). Raport Power BI albo Power App dla kontroli jakości sprawiają, że zapytania te są użyteczne bez znajomości KQL. Zgodnie z FSMA 204 możliwość wyeksportowania sortowalnego arkusza kalkulacyjnego w ciągu 24 godzin [59] jest konkretnym testem akceptacyjnym tej warstwy.

### Od zapisu śledzenia do cyfrowego paszportu produktu

Cyfrowy paszport produktu to zasadniczo dostępny z zewnątrz wyciąg z Twojej genealogii oraz danych o zrównoważonym rozwoju i materiałach. Jeśli zbudujesz dziś czytelną genealogię, wykonałeś najtrudniejszą część przygotowań. Zadbaj o to, by identyfikatory były unikalne i trwałe, oraz o możliwość rozdzielenia danych publicznych, danych przeznaczonych dla organów regulacyjnych i danych wyłącznie wewnętrznych.

---

## Przypadek użycia 3: Cyfrowe bliźniaki

Termin [cyfrowy bliźniak](https://www.m365.fm/entity/digital-twin/) jest używany dla bardzo różnych rzeczy: od modelu 3D, przez model symulacyjny, po żywe odwzorowanie zakładu. Na potrzeby architektury pomocne jest rozróżnienie. Nasz przewodnik po [cyfrowych bliźniakach w produkcji](https://www.m365.fm/en/learn/digital-twin-manufacturing/) wykracza poza ujęcie Azure.

### Trzy rodzaje bliźniaków

| Rodzaj | Pytanie | Dane | Narzędzia w ekosystemie Microsoft |
|---|---|---|---|
| **Bliźniak informacyjny** | Co gdzie się znajduje i jak jest połączone? | Hierarchia zasobów, relacje, stany na żywo | Fabric digital twin builder (podgląd) [15], ontologia Fabric IQ (podgląd) [16], Azure Digital Twins [14] |
| **Bliźniak symulacyjny** | Co się stanie, jeśli …? | Logika procesu, czasy, zdolności produkcyjne, zachowanie przy zakłóceniach | Aplikacje branżowe do symulacji przepływu materiałów i procesów, ewentualnie działające na infrastrukturze Azure |
| **Bliźniak inżynierski** | Jak produkt lub maszyna zachowuje się fizycznie? | CAD, CAE, logika sterowania | PLM/CAE na Azure; Microsoft podaje m.in. wytyczne architektoniczne dla Siemens NX na Azure Virtual Desktop z maszynami wirtualnymi z GPU oraz dla Ansys Discovery na maszynach wirtualnych z GPU [2] |

[Uruchomienie wirtualne](https://www.m365.fm/entity/virtual-commissioning/) łączy bliźniaki inżynierski i symulacyjny: kod sterowania jest testowany na modelu zakładu, zanim istnieje rzeczywiste wyposażenie.

### Azure Digital Twins czy Fabric?

Sam Microsoft zwraca uwagę, że digital twin builder w Fabric to inny produkt niż Azure Digital Twins [14], [15]. Praktyczne różnice:

| Kryterium | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Status | Aktywny, brak zapowiedzi wycofania na stronie przeglądowej [14] | Podgląd [15] |
| Modelowanie | DTDL (Digital Twins Definition Language), wersja 3 [14] | Ontologia z typami encji i relacjami [15] |
| Przechowywanie | Własny graf bliźniaków; historia przez historię danych do Azure Data Explorer [14] | OneLake; dane muszą najpierw znajdować się w lakehouse Fabric [15] |
| Integracja | Trasy zdarzeń do Event Hubs, Event Grid, Service Bus [14] | Natywnie w Fabric Real-Time Intelligence, Power BI |
| Odbiorcy | Zespoły deweloperskie, zorientowane na API | Zespoły danych i biznesowe, low-code |
| Wizualizacja | 3D Scenes Studio (podgląd) [14] | Doświadczenia Fabric, Power BI |

**Zalecenie:** Jeśli Twoją platformą danych jest Fabric, a potrzebujesz analitycznych bliźniaków do KPI i analizy przyczyn źródłowych, obserwuj digital twin builder oraz ontologię Fabric IQ i przeprowadź ich pilotaż, ale nie uzależniaj swojego modelu danych od wersji zapoznawczej. Microsoft nie udokumentował jeszcze, jak te dwa elementy Fabric będą się rozwijać względem siebie; ontologia przeszła już jedną zmianę doświadczenia z obowiązkową migracją [16]. Jeśli dziś budujesz produkcyjną aplikację bliźniaka opartą na API, Azure Digital Twins jest usługą ogólnie dostępną. W obu przypadkach zachowaj kopię swojej ontologii w formacie niezależnym od narzędzi.

### Od czego zacząć?

Najczęstszym błędem jest rozpoczynanie od wizualizacji 3D. Zacznij od pytania, na które bliźniak ma odpowiadać, na przykład „Które zamówienia zostaną dotknięte, jeśli stanowisko 20 przestanie działać?”. To pytanie określa encje i relacje, których potrzebujesz. Mirko Peters opisuje to podejście w artykule [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) oraz drogę od ERP do bliźniaka hali produkcyjnej w artykule [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Implementację techniczną na Azure omawiamy w odcinku [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Przypadek użycia 4: KPI w czasie rzeczywistym, OEE i strumienie wartości

KPI w czasie rzeczywistym są często najszybszym sposobem na uzyskanie wartości z połączenia z halą produkcyjną. Nie wymagają AI, ale potrzebują czystego modelu stanów.

### Poprawne obliczanie OEE

Ogólna efektywność urządzeń (OEE) to iloczyn dostępności, wydajności i jakości. Wzór jest prosty, ale definicje już nie:

- **Dostępność:** Które postoje liczą się jako planowane (przerwy, planowe konserwacje, brak zlecenia)? Ta decyzja może przesunąć OEE o wiele punktów procentowych.
- **Wydajność:** Który czas cyklu jest wzorcem: wartość projektowa, najlepszy osiągnięty czas cyklu, czy norma z ERP?
- **Jakość:** Czy poprawiany wyrób liczy się jako dobra czy zła sztuka?

Uzgodnij te definicje między zakładami, zanim zbudujesz pulpit. W przeciwnym razie zakłady będą porównywać liczby, które nie są porównywalne.

### Architektura KPI w czasie rzeczywistym

1. Stany maszyn i liczniki sztuk płyną przez OPC UA do brokera [4].
2. Przepływ danych mapuje stany na jednolity model statusów (mapowanie kodów specyficznych dla maszyn) [3].
3. Eventhouse oblicza kroczące KPI według stanowiska, linii i zmiany za pomocą KQL.
4. Dashboard czasu rzeczywistego obsługuje halę produkcyjną; raporty Power BI obsługują zarządzanie [17].
5. Activator wysyła alerty, gdy wartości spadają poniżej progów [17].

### Strumień wartości jako żywy model danych

Mapowanie strumienia wartości jest tradycyjnie ćwiczeniem na papierze. Jeśli połączysz pola procesowe strumienia wartości z danymi na żywo, otrzymasz prosty, ale skuteczny model danych: czas realizacji, zapasy między procesami, czasy cyklu i wąskie gardła stają się mierzalne. Odcinek [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) pokazuje, jak to działa w praktyce. Do szczegółowego harmonogramowania opartego na tych danych służą systemy [zaawansowanego planowania i harmonogramowania](https://www.m365.fm/entity/advanced-planning-and-scheduling/); zobacz nasz przewodnik po [harmonogramowaniu produkcji i APS](https://www.m365.fm/en/learn/production-scheduling-aps/). Sposób wykorzystania tych liczb w codziennych spotkaniach zespołów omawiamy w przewodniku po [zarządzaniu na hali produkcyjnej](https://www.m365.fm/en/learn/shop-floor-management/).

### Katalog startowy KPI

| KPI | Źródło danych | Szczegółowość |
|---|---|---|
| OEE i jego czynniki | Stan maszyny, liczniki, wyniki kontroli jakości | Stanowisko, zmiana |
| Czas realizacji | Zdarzenia zleceń (start/koniec na operację) | Zlecenie, produkt |
| Praca w toku | Zapisy magazynowe, skanowanie | Bufor, linia |
| Dostawa na czas | ERP (termin żądany vs. rzeczywisty) | Klient, grupa produktów |
| MTBF / MTTR | Przestoje, zlecenia konserwacyjne | Zasób |
| Energia na dobrą sztukę | Liczniki energii, liczba sztuk | Linia, produkt |
| First pass yield | Wyniki inspekcji | Operacja |

---

## Integracja ERP i MES

Dane z hali produkcyjnej bez kontekstu zleceń i materiałów to pomiary, a nie informacja. O wartości całej platformy decyduje integracja z ERP i MES.

### Który system jest systemem źródłowym?

| Obiekt danych | System źródłowy (typowo) | Rola platformy Azure |
|---|---|---|
| Materiał, BOM, routing | ERP / PLM | Kopia do wzbogacania danych, bez utrzymania |
| Zlecenie produkcyjne (planowanie) | ERP / APS | Kopia; informacja zwrotna o statusie jako zdarzenie |
| Realizacja operacji, potwierdzenie | MES | Zdarzenia w UNS, historia w Fabric |
| Stany maszyn, wartości procesowe | Sterownik / edge | Podstawowe źródło danych |
| Zlecenia utrzymania ruchu | ERP (utrzymanie ruchu) / CMMS | Wyzwalane predykcjami, historia do etykiet |
| Ustalenia jakościowe | QMS / MES | Powiązane z danymi procesowymi |

### Integracja z SAP

Dane SAP można przenieść do Fabric na kilka sposobów: konektory Data Factory, rozwiązania open mirroring od partnerów oraz „SAP Business Data Cloud Connect for Microsoft Fabric”, który ma udostępniać produkty danych SAP w OneLake bez kopiowania; ogólną dostępność tego ostatniego zapowiedziano na trzeci kwartał 2026 roku [44]. Nie mogliśmy potwierdzić faktycznej ogólnej dostępności w chwili pisania [unverified: status ogólnej dostępności nie został potwierdzony w chwili pisania]; przed zaplanowaniem sprawdź bieżący status oraz wymagania licencyjne po stronie SAP. W przypadku integracji z hali produkcyjnej z SAP Digital Manufacturing organizacja DSAG (niemieckojęzyczna grupa użytkowników SAP) opublikowała w kwietniu 2026 roku przewodnik „SAP DM Shopfloor Integration”; strona podsumowująca jest dostępna po angielsku. Według jego wstępu obejmuje architekturę, struktury i modele danych, skalowanie, szablony, model operacyjny oraz zakupy; pełny tekst jest zastrzeżony dla członków DSAG [48]. Zasada podstawowa: potwierdzenia trafiają do SAP przez MES lub zdefiniowane interfejsy API, a nie bezpośrednio z platformy danych.

### Dynamics 365

Jeśli używasz Dynamics 365 Supply Chain Management, korzystasz z jego bliskości do ekosystemu Microsoft: dzięki funkcji „Link to Microsoft Fabric” dane Dataverse, w tym wybrane tabele finansowe i operacyjne, mogą być udostępnione w Fabric bez własnego potoku ETL [45]. Microsoft opisuje swoją ofertę dla produkcji jako połączenie możliwości Dynamics 365, Microsoft 365 i Azure [1].

### Istniejące historiany i SCADA

Wiele zakładów w USA ma już historian procesowy obok SCADA. Traktuj go jako źródło, a nie jako coś do usunięcia: historian nadal obsługuje operatorów i inżynierów procesu lokalnie, a platforma Azure pobiera albo surowe sygnały z warstwy OPC UA, albo wyselekcjonowane dane z historiana. Decyduj dla każdego sygnału osobno, która ścieżka jest systemem źródłowym dla historii, aby nie przechowywać i nie płacić za te same szeregi czasowe dwukrotnie, a przed zaprojektowaniem przepływu danych sprawdź u dostawcy historiana, jakie interfejsy i licencje mają zastosowanie.

### Przepływ danych z hali do ERP

Typowy wzorzec:

1. ERP zwalnia zlecenie; zdarzenie „zlecenie zwolnione” trafia do UNS.
2. MES rozpoczyna operację; zdarzenie „operacja rozpoczęta” zawiera stanowisko i zlecenie.
3. Dane maszynowe są wzbogacane w potoku danych o bieżący numer zlecenia.
4. MES potwierdza ilości i czasy; ERP je księguje.
5. Fabric łączy wszystkie zdarzenia w pełną historię zlecenia do analityki i genealogii.

---

## AI i Copilot w produkcji

Generatywna AI dotarła do produkcji, ale inaczej, niż się spodziewano w 2024 roku. Microsoft wycofał w 2025 roku swoje podglądy agentów specyficznych dla produkcji (Factory Operations Agent, Factory Safety Agent) [2] i zamiast nich stawia na ogólne elementy platformy: Microsoft Foundry dla agentów i modeli [20], Copilot w Fabric do zadawania pytań o dane [17] oraz Copilot Studio i Microsoft 365 Copilot do scenariuszy biurowych. Na konferencji Ignite 2025 pojawiły się w wersji podglądowej Fabric IQ i Foundry IQ, których zadaniem jest odpowiednio zapewnienie agentom warstwy semantycznej i bazy wiedzy [34]. Widok cyklu życia dotyczy tu również: prompt flow, szeroko stosowane narzędzie do wczesnych aplikacji LLM w Foundry i Azure Machine Learning, zostanie wycofane 20 kwietnia 2027 roku; Microsoft zaleca migrację do Microsoft Agent Framework [37].

### Realistyczne scenariusze

| Scenariusz | Elementy składowe | Warunek wstępny |
|---|---|---|
| Pytania w języku naturalnym o dane produkcyjne („Dlaczego linia 3 działała wczoraj wolniej?") | Copilot w Fabric, agenci danych Fabric, ontologia [16], [17] | Czysty model danych, zrozumiałe nazwy tabel i kolumn, zdefiniowane KPI |
| Podsumowania przekazania zmiany i raportów o incydentach | Microsoft 365 Copilot, Teams, Copilot Studio | Ustrukturyzowane zapisy, na przykład w formularzach Power Apps lub Teams |
| Asystent utrzymania ruchu (przeszukiwanie instrukcji i historii awarii) | Microsoft Foundry z wyszukiwaniem, Copilot Studio | Dokumenty cyfrowe i aktualne, utrzymane uprawnienia |
| Wizualna kontrola jakości | Modele widzenia komputerowego, wnioskowanie na krawędzi (edge) | Oznaczone dane obrazowe (zewnętrzne narzędzie do etykietowania, ponieważ etykietowanie danych w Azure ML zostało wycofane [38]), stabilne oświetlenie |
| Asystent planowania (porównywanie scenariuszy) | Aplikacja branżowa (APS, symulacja) plus AI | Poprawny model planowania |

### Microsoft 365 jako pomost do hali produkcyjnej

Dla organizacji, które już korzystają z Microsoft 365, największą dźwignią w krótkim terminie często nie jest wcale Azure, lecz połączenie zdarzeń z hali produkcyjnej ze środowiskiem pracy:

- **Teams dla pracowników liniowych:** komunikacja zmianowa, zadania, powiadomienia z Activator lub Power Automate bezpośrednio w Teams [17].
- **Power BI:** raporty KPI dla kierownictwa i zarządu zakładu, oparte na tych samych danych Fabric.
- **Power Apps:** rejestrowanie przyczyn przestojów, ustaleń dotyczących jakości i informacji zwrotnych z utrzymania ruchu na tabletach przy stanowisku. Dzięki temu powstają dokładnie te etykiety, których potrzebuje predykcyjne utrzymanie ruchu.
- **Copilot:** podsumowania raportów zmianowych, analiz odchyleń i notatek ze spotkań kadry produkcyjnej.
- **Wcześnie uporządkuj licencje:** pracownicy hali zazwyczaj otrzymują licencje dla pracowników liniowych (Microsoft 365 F1 lub F3). Przed wdrożeniem sprawdź, które funkcje, na przykład Power Apps czy Copilot, są w nich uwzględnione, a które wymagają licencji dodatkowych; w przeciwnym razie dobry pilotaż utknie przy skalowaniu.

### Ograniczenia i ład korporacyjny

- **Brak decyzji sterujących podejmowanych przez modele językowe.** Modele językowe służą do wspomagania, a nie do zamkniętej pętli sterowania maszyny.
- **Stosuj ramy zarządzania ryzykiem.** **NIST AI Risk Management Framework (AI RMF 1.0)**, opublikowany 26 stycznia 2023 roku, to dobrowolne ramy zorganizowane wokół czterech funkcji: Govern, Map, Measure i Manage [63]. Stanowią praktyczny sposób dokumentowania ryzyk związanych z AI w kontroli jakości lub planowaniu, na potrzeby klientów i audytorów.
- **Akt o AI UE dla działalności w UE:** Jeśli prowadzisz systemy AI w zakładach w UE lub sprzedajesz tam produkty z AI, sprawdź, czy system jest wykorzystywany jako element bezpieczeństwa produktu lub do zarządzania pracownikami; mogą wynikać z tego obowiązki dla systemów wysokiego ryzyka. „Digital Omnibus on AI" (rozporządzenie (UE) 2026/1744, obowiązujące od końca lipca 2026 roku) przesunął te terminy: na 2 grudnia 2027 roku dla samodzielnych systemów wysokiego ryzyka (na przykład w HR) oraz na 2 sierpnia 2028 roku dla systemów wbudowanych w produkty. AI w maszynach ma być regulowane aktami delegowanymi na podstawie unijnego rozporządzenia o maszynach [46]. Klasyfikację konkretnego systemu należy poddać ocenie prawnej.
- **Siła robocza i stosunki pracy:** Systemy, które mogą oceniać wydajność lub zachowanie pracowników, rodzą pytania dotyczące prawa pracy. W zakładach w USA objętych układami zbiorowymi sprawdź, czy umowa obejmuje monitorowanie wydajności; w zakładach w Niemczech takie systemy zasadniczo wymagają zgody rady zakładowej (Betriebsrat), która ma prawa współdecydowania. W obu przypadkach zaangażuj przedstawicieli pracowników na wczesnym etapie.
- **Uprawnienia:** Copilot pokazuje to, co użytkownik ma prawo zobaczyć. Zbyt szerokie udostępnianie w SharePoint lub Fabric staje się przez AI widoczne.

---

## FinOps w IT produkcyjnym

Koszty chmury w produkcji zachowują się inaczej niż w klasycznych obciążeniach IT: wolumeny danych rosną wraz z każdą podłączoną maszyną, obciążenia działają całą dobę, a część infrastruktury znajduje się w zakładzie. FinOps pomaga uczynić te koszty przewidywalnymi i powiązać je z wartością. Odcinek [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) omawia szczegóły.

### Krótko o FinOps Framework

Wytyczne Microsoftu dotyczące FinOps opierają się na strukturze FinOps Foundation [25]. Składa się ona z sześciu zasad (wśród nich „Teams need to collaborate”, „Business value drives technology decisions” oraz „Take advantage of the variable cost model of the cloud”), trzech faz cyklu życia (Inform, Optimize, Operate) i czterech domen [25]:

| Domena | Co oznacza dla produkcji |
|---|---|
| Understand usage and cost | Uczynić koszty widocznymi dla zakładu, linii i przypadku użycia (tagowanie, osobne pojemności lub obszary robocze Fabric) |
| Quantify business value | Koszt na dobry wyrób, na podłączoną maszynę lub na uniknioną godzinę przestoju |
| Optimize usage and cost | Ograniczać wolumen danych na brzegu, stopniować retencję, dopasowywać rozmiar pojemności |
| Manage the FinOps practice | Odpowiedzialności, polityki, refakturowanie kosztów na zakłady |

Framework zaleca oceniać dojrzałość osobno dla każdej zdolności, a nie ogólnie, oraz przeglądać ją co trzy do sześciu miesięcy [25].

### Dziesięć najważniejszych dźwigni kosztowych

1. **Agregować na brzegu:** Nie każda wartość w rozdzielczości jednej sekundy musi trafiać do chmury. Przepływy danych mogą filtrować i agregować [3]. To najważniejsza pojedyncza dźwignia.
2. **Wysyłać przy zmianie:** Domyślnie konektor OPC UA wysyła tylko zmienione wartości i dodaje okresowe klatki kluczowe ze wszystkimi wartościami, aby odbiorcy mogli odtworzyć stan [4]. Sprawdź też martwe strefy (deadbands) w sterowniku lub serwerze OPC UA, aby szum nie był liczony jako zmiana.
3. **Konsolidować Eventstreams:** Na zakład, a nie na źródło, z transformacjami w Eventhouse [31].
4. **Stopniować retencję:** Dane gorące w pamięci podręcznej Eventhouse przez dni lub tygodnie, starsze dane w magazynie OneLake.
5. **Świadomie dobierać rozmiar pojemności Fabric:** Monitorować wykorzystanie aplikacją Capacity Metrics, oddzielać obciążenia deweloperskie od produkcyjnych, wstrzymywać niepotrzebne pojemności. Wstrzymywanie jest udokumentowane dla SKU F; w momencie wstrzymania zgromadzone przekroczenia są natychmiast rozliczane, a zawartość pojemności jest niedostępna [47]. Pojemność obsługująca Eventstream lub pulpit zakładu nie nadaje się więc do wstrzymywania.
6. **Wybrać właściwe SKU brzegowe:** Od wydania 2610 Azure IoT Operations oferuje tańsze SKU Essentials dla wdrożeń o dużym wolumenie, obok Standard, ograniczone do klastrów jednowęzłowych i bez konektora OPC UA [3]. Pasuje na przykład do zakładów, których dane już napływają przez MQTT lub HTTP. Sprawdzaj dla każdej lokalizacji, z jakich funkcji faktycznie potrzebujesz.
7. **Stosować rezerwacje i plany oszczędnościowe** dla zasobów Azure działających w sposób ciągły.
8. **Alokować koszty:** Wymuszać tagi dla zakładu, centrum kosztów i przypadku użycia (Azure Policy).
9. **Wprowadzić ekonomię jednostkową:** Raportować koszt chmury na wyprodukowaną jednostkę lub na podłączoną maszynę. Dopiero wtedy można porównywać zakłady.
10. **Wycofywać rozwiązania przestarzałe:** Migrować usługi, które są wycofywane (IoT Central, IoT Edge 1.5), zanim równoległe struktury podwoją koszty.

### Nie zapominaj o kosztach brzegu

Sprzęt w zakładzie, operacje Kubernetes, licencje na usługi z włączonym Azure Arc oraz personel do aktualizacji należą do tej samej kalkulacji. Uzasadnienie biznesowe, które patrzy tylko na rachunek z Azure, systematycznie zaniża całkowity koszt. Ten przewodnik celowo nie podaje cen, ponieważ często się zmieniają; aktualne modele cenowe dla Azure IoT Operations (Standard i Essentials), Azure Arc oraz Azure Local znajdziesz na stronach cenowych Azure i w kalkulatorze cen Azure.

---

## Budowanie uzasadnienia biznesowego dla Azure w produkcji

Ogólne deklaracje korzyści z badań branżowych rzadko pomagają uzyskać zatwierdzenie budżetu, ponieważ nie znają Twojego punktu wyjścia. Logika obliczeń, którą wypełniasz własnymi danymi, jest bardziej wiarygodna.

### Kategorie korzyści

| Kategoria | Obliczenie | Źródło danych |
|---|---|---|
| Uniknięte nieplanowane przestoje | Godziny przestojów × marża przyczynkowa na godzinę × oczekiwane ograniczenie | Historia przestojów z MES, finanse |
| Wyższy OEE | Dodatkowe dobre sztuki × marża przyczynkowa na sztukę | Punkt odniesienia OEE |
| Niższe koszty braków i poprawek | Ilość braków × koszt wytworzenia × redukcja | QMS |
| Szybsza obsługa reklamacji | Godziny na reklamację × stawka godzinowa × redukcja; mniejszy zakres wycofania | Historia reklamacji |
| Koszty utrzymania ruchu | Zapasy części zamiennych, usługi wykonawców, nadgodziny | Utrzymanie ruchu w ERP |
| Zgodność | Uniknięty nakład pracy przy ręcznym dostarczaniu dowodów (audyty, żądania FSMA 204, oceny CMMC, DPP) | Zespół ds. jakości i zgodności |

### Kategorie kosztów

- Sprzęt brzegowy i jego eksploatacja w każdym zakładzie
- Bieżące zużycie Azure i Fabric
- Licencje (Power BI, Copilot, aplikacje branżowe, bezpieczeństwo OT tam, gdzie jest potrzebne)
- Wdrożenie (wewnętrzne i zewnętrzne)
- Zarządzanie zmianą i szkolenia
- Doposażenie starszych maszyn w czujniki

### Przykład liczbowy z danymi fikcyjnymi

Linia ma 120 godzin nieplanowanych przestojów rocznie, a marża przyczynkowa wynosi 1600 USD na godzinę. Jeśli monitorowanie stanu i szybsza reakcja pozwolą uniknąć 20 procent tych godzin, to 24 godziny × 1600 USD = 38 400 USD rocznie. Po stronie kosztów znajdują się alokowane koszty: sprzęt brzegowy i jego eksploatacja, zużycie Fabric, licencje oraz godziny pracy wewnętrznej. Liczby są celowo proste. Najważniejsze jest, aby każde założenie miało źródło wewnątrz firmy (historia MES, finanse) i aby po trzech do sześciu miesiącach zmierzyć redukcję w odniesieniu do punktu wyjścia.

### Zasada kciuka przy ustalaniu priorytetów

Zacznij od przypadku użycia, w którym spełnione są trzy warunki: mierzalny punkt odniesienia, dostępne dane oraz właściciel procesu, który chce wykorzystać wyniki. Częściej są to OEE w czasie rzeczywistym lub identyfikowalność niż predykcyjne utrzymanie ruchu.

---

## Plan działania: pięć faz do skalowalnej platformy produkcyjnej na Azure

Poniższy plan opiera się na powszechnym wzorcu „najpierw fundament i jeden przypadek pilotażowy, potem skalowanie". Podane czasy trwania są wytycznymi dla pierwszego zakładu i w dużym stopniu zależą od punktu wyjścia, zatwierdzeń sieciowych oraz dostępnych zasobów.

### Faza 1: Jasność (4 do 8 tygodni)

- Portfel przypadków użycia z szacunkami korzyści; wybór jednego lub dwóch przypadków pilotażowych
- Stan obecny: park maszynowy, protokoły (czy dostępny jest OPC UA?), sieć, istniejące systemy
- Docelowy model danych (hierarchia ISA-95, konwencja tematów UNS)
- Koncepcja bezpieczeństwa obejmująca bezpieczeństwo OT, profil CSF 2.0, zakres CMMC tam, gdzie ma zastosowanie, prywatność oraz przedstawicieli pracowników
- Sprawdzenie cyklu życia wszystkich usług w oparciu o tabelę statusów w tym przewodniku

### Faza 2: Fundament (6 do 12 tygodni)

- Infrastruktura brzegowa w zakładzie pilotażowym, połączenie Arc, Azure IoT Operations
- Struktura obszarów roboczych Fabric, planowanie pojemności, model dostępu
- Pierwsze maszyny podłączone przez OPC UA, zasoby zarejestrowane w Azure Device Registry
- Podstawy FinOps: tagi, budżety, raporty kosztów dla każdego zakładu

### Faza 3: Pierwsza wartość (8 do 12 tygodni)

- Przypadek pilotażowy wdrożony na produkcji, na przykład OEE w czasie rzeczywistym z rejestracją przyczyn przestojów w Power Apps
- Pulpit na hali produkcyjnej i raport dla kierownictwa
- Punkt odniesienia i pierwszy pomiar wpływu

### Faza 4: Pogłębianie (3 do 6 miesięcy)

- Zintegrowany kontekst ERP i MES, historia zleceń i genealogia
- Monitorowanie stanu, gromadzenie etykietowanych danych do predykcyjnego utrzymania ruchu
- Pierwsze scenariusze Copilot na wyselekcjonowanych danych

### Faza 5: Skalowanie (od 9. do 15. miesiąca, zależnie od postępów)

- Rozszerzenie na kolejne linie i zakłady z infrastrukturą jako kodem oraz GitOps
- Wskaźniki KPI obejmujące wiele zakładów, o jednolitych definicjach
- Predykcyjne utrzymanie ruchu dla wybranych zasobów, scenariusze cyfrowych bliźniaków
- Model operacyjny: zespół platformy, właściciele produktów danych w poszczególnych domenach, zarządzanie wydaniami dla zwykle miesięcznych wydań Azure IoT Operations [7]

Kluczowa zmiana polega na przejściu od proof of concept do minimalnego produktu życiowego: PoC dowodzi, że technologia działa. MVP dowodzi, że ludzie dzięki niej pracują lepiej. Jeśli chcesz osadzić tę zmianę w szerszym programie doskonalenia, zapoznaj się z naszymi przewodnikami o [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) i [operational excellence](https://www.m365.fm/en/learn/operational-excellence/).

---

## Typowe błędy w projektach produkcyjnych opartych na Azure

1. **Technologia przed pytaniem:** Budowanie platformy bez jednostki biznesowej, która chce rozwiązać konkretny problem.
2. **Wersja preview jako fundament:** Umieszczanie logiki biznesowej na usługach w wersji preview. Wycofanie Manufacturing data solutions i agentów fabrycznych pokazuje to ryzyko [2].
3. **Nieaktualne elementy budulcowe ze starych przewodników:** Planowanie nowych projektów na IoT Central, Time Series Insights lub IoT Edge 1.5, ponieważ artykuł z 2021 roku je zaleca [8], [10], [12].
4. **Niewłaściwy SKU:** Planowanie Azure IoT Operations Essentials dla zakładu z maszynami OPC UA, mimo że ten SKU nie zawiera łącznika OPC UA [3].
5. **Brak modelu stanów:** Przejmowanie specyficznych dla maszyn kodów statusu bez filtrowania. Porównania między zakładami stają się niemożliwe.
6. **Wszystko do chmury:** Wysyłanie surowych danych w pełnej rozdzielczości i zaskoczenie rachunkiem.
7. **Bezpieczeństwo OT jako dodatek na końcu:** Podłączanie klastra brzegowego do sieci bez koncepcji stref i pozostawianie otwartego dostępu do zapisu w sterownikach.
8. **Zapominanie o etykietach:** Rozpoczynanie utrzymania predykcyjnego bez uporządkowanej historii awarii.
9. **KPI bez definicji:** Budowanie pulpitów OEE, zanim zakłady uzgodnią definicje dostępności.
10. **Niedocenianie eksploatacji:** Regularne wydania, aktualizacje Kubernetes, rotacja certyfikatów i bufor brokera, który można ustawić tylko przy pierwszym wdrożeniu [40], a nikt nie ponosi za to odpowiedzialności.
11. **Pozostawianie ludzi bez informacji:** Pracownicy hali produkcyjnej dowiadują się o projekcie dopiero wtedy, gdy tablet zostaje zamontowany na ich stanowisku.
12. **Ignorowanie zakresu zgodności:** Przesyłanie rysunków lub specyfikacji części dla obronności do wspólnej przestrzeni roboczej Fabric bez decyzji o zakresie CMMC.

---

## Zastosowania branżowe w ekosystemie Microsoft

> **Uwaga: autor pracuje w iFAKT GmbH.**

Platforma zbudowana na Azure IoT Operations i Fabric dostarcza dane, ale nie logikę biznesową dotyczącą planowania, strumieni wartości ani symulacji. Aplikacje branżowe dostępne w Microsoft AppSource lub Microsoft Marketplace wypełniają tę lukę.

Jednym z przykładów jest [Polaris](https://www.m365.fm/entity/polaris/) firmy [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), producenta oprogramowania z siedzibą w Stuttgarcie w Niemczech. Dostawca opisuje Polaris jako oprogramowanie do cyfryzacji, symulacji i optymalizacji produkcji, z modułami VSM/BSM (modelowanie strumienia wartości i swimlane), Simulator, Optimizer (planowanie), Operator oraz Analyzer (analiza KPI). Według dostawcy planowanie jest oparte na ograniczeniach i uwzględnia zasoby, kwalifikacje, zmiany oraz bufory; kokpit KPI pokazuje czas realizacji, zapasy, wykorzystanie i terminowość dostaw. Polaris VSM jest wymieniony jako oferta SaaS w Microsoft Marketplace [33]; Microsoft przedstawił iFAKT jako część programu „ISV Success for Business Applications” [32]. Nasz przewodnik po [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) opisuje produkt bardziej szczegółowo.

W architekturze tego przewodnika taka aplikacja znajduje się w warstwach 6–8: wykorzystuje dane o procesach i zleceniach do modelowania strumieni wartości, symulowania scenariuszy i optymalizacji planów. Jak wygląda konkretna integracja z Państwa platformą danych, należy wyjaśnić z dostawcą; niniejszy artykuł nie formułuje w tej sprawie żadnych twierdzeń.

Niezależnie od dostawcy przy wyborze takich aplikacji pomagają cztery pytania: Czy aplikacja odczytuje dane z otwartych formatów (na przykład tabel Delta w OneLake lub zdarzeń z brokera), czy potrzebuje własnych interfejsów? Który system jest systemem rejestrującym dla danych wzorcowych, takich jak marszruty i zdolności produkcyjne? Gdzie działają dane i obliczenia (region, tenant)? Oraz w jaki sposób wyniki, na przykład zoptymalizowany plan, wracają do ERP lub MES w kontrolowany sposób?

---

## FAQ

### Czym jest Azure dla produkcji?

Azure dla produkcji to zestaw usług chmurowych i brzegowych Microsoft, z których korzystają producenci, aby łączyć zakłady, przechowywać i analizować dane produkcyjne oraz budować na nich aplikacje AI i aplikacje dla pracowników. W 2026 roku trzon stanowią Azure IoT Operations na klastrach Kubernetes z Azure Arc w zakładzie, Microsoft Fabric jako platforma danych oraz Foundry, Power BI i Copilot do analityki i AI [3], [17]. Microsoft pakuje swoją ofertę branżową jako "Microsoft for Manufacturing", łączącą Azure, Dynamics 365 i Microsoft 365 [1].

### Jaka jest różnica między Azure IoT Hub a Azure IoT Operations?

IoT Hub to usługa chmurowa, do której urządzenia łączą się bezpośrednio. Azure IoT Operations to płaszczyzna danych działająca w zakładzie na klastrach Kubernetes z Azure Arc, która łączy maszyny przez OPC UA i inne konektory z lokalnym brokerem MQTT [3]. W fabrykach z wieloma maszynami Azure IoT Operations jest zwykle właściwym punktem wyjścia; IoT Hub sprawdza się przy rozproszonych, bezpośrednio połączonych urządzeniach. Kompromisy względem IoT Edge opisano w artykule [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/).

### Czy Azure IoT Central jest wycofywane?

Tak. Od 23 września 2026 roku nie można tworzyć nowych aplikacji IoT Central; istniejące aplikacje działają do 20 września 2029 roku. Microsoft jako cel migracji wskazuje IoT Hub z Device Provisioning Service, Azure Device Registry i Microsoft Fabric; pulpity i analitykę przenosi się do Fabric Real-Time Intelligence [8], [64]. Powiadomienie o wycofaniu z 31 marca 2027 roku, które pojawiło się w portalu Azure w lutym 2024 roku, Microsoft w tamtym czasie wycofał jako błędny komunikat systemowy [9]. Ogłoszenie z 2026 roku jest natomiast zwykłym powiadomieniem z trzyletnim okresem przejściowym.

### Co zastąpiło Azure Time Series Insights?

Time Series Insights zostało wycofane 7 lipca 2024 roku. Microsoft jako cel migracji wskazuje Eventhouse w Microsoft Fabric Real-Time Intelligence [10]. Jeśli nie korzystasz z Fabric, alternatywą jest Azure Data Explorer, który również używa KQL [19].

### Co stało się z Microsoft Cloud for Manufacturing?

Oferta branżowa nosi teraz nazwę "Microsoft for Manufacturing" i łączy możliwości z Azure, Dynamics 365 i Microsoft 365 [1]. Konkretne podglądy "Manufacturing data solutions" i "Factory Operations Agent" wycofano 30 maja 2025 roku, a "Factory Safety Agent" 23 czerwca 2025 roku [2]. Nie ma osobnego powiadomienia dotyczącego "Manufacturing data solutions in Microsoft Fabric"; nie planuj tego w nowych projektach.

### Jakich usług Azure potrzebuję do inteligentnej fabryki?

W typowym połączeniu zakładowym: Azure Arc i klaster Kubernetes w zakładzie, na nim Azure IoT Operations (broker, konektor OPC UA, przepływy danych), Azure Device Registry dla zasobów, Microsoft Fabric z Eventstream, Eventhouse i Activator dla danych czasu rzeczywistego oraz Power BI do raportowania [3], [17]. Elementy AI (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) i bliźniaki cyfrowe przychodzą później. Ramę stanowią Entra ID, Azure Policy, Cost Management i rozwiązanie bezpieczeństwa OT.

### Jaka jest różnica między Azure IoT Operations Essentials a Standard?

Standard oferuje pełny zestaw funkcji. Essentials, dostępne od wydania 2610, to tańsza opcja dla wdrożeń o dużej liczbie danych; działa wyłącznie na klastrach jednowęzłowych i nie zawiera konektora OPC UA [3]. Dla zakładów z maszynami OPC UA punktem wyjścia jest Standard.

### Czy do Azure IoT Operations potrzebne są umiejętności Kubernetes?

Tak, przynajmniej na potrzeby eksploatacji. Azure IoT Operations działa na klastrach Kubernetes z Azure Arc i jest konfigurowane w sposób typowy dla Kubernetes [3]. Na start Microsoft dokumentuje instalacje na Ubuntu oraz na Windows z AKS Edge Essentials [3]. Zaplanuj rozwój kompetencji lub partnera operacyjnego.

### Czy produkcja będzie działać dalej, jeśli połączenie z internetem zostanie przerwane?

Według Microsoft Azure IoT Operations może działać offline maksymalnie 72 godziny, ewentualnie z ograniczoną funkcjonalnością, i po ponownym połączeniu wraca do pełnej funkcjonalności [3]. Liczba buforowanych w tym czasie wiadomości zależy od konfiguracji brokera, ustawianej przy pierwszym wdrożeniu [40]. Funkcje sterowania nigdy nie mogą zależeć od chmury; sterowanie pozostaje w sterownikach PLC i systemach lokalnych.

### Azure Digital Twins czy digital twin builder w Fabric?

Azure Digital Twins to usługa ogólnie dostępna (GA), oparta na modelach DTDL i z dostępem przez API [14]. Digital twin builder jest częścią Fabric Real-Time Intelligence, pracuje z ontologiami na danych OneLake i jest w wersji przedpremierowej (preview) [15]. Do produkcyjnych bliźniaków cyfrowych budowanych przez deweloperów Azure Digital Twins to dziś bezpieczny wybór; do analitycznych bliźniaków cyfrowych na platformie Fabric warto przeprowadzić pilotaż z digital twin builder. Mirko Peters wyjaśnia pokrewne rozróżnienie, między device twin w IoT Hub a Azure Digital Twins, w artykule [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/).

### Jakich danych potrzebuję do predykcyjnego utrzymania ruchu?

Zmiennych stanu technicznego z odpowiednią częstotliwością próbkowania, zsynchronizowanych znaczników czasu, kontekstu pracy (zlecenie, produkt, stan maszyny) i przede wszystkim historii awarii z etykietami pochodzącej z utrzymania ruchu. Bez historii awarii na początku możliwe jest wyłącznie wykrywanie anomalii.

### Co oznacza wycofanie Defender for IoT dla bezpieczeństwa mojej sieci OT?

2 listopada 2026 r. Microsoft oficjalnie ogłosił, że w październiku 2029 r. w pełni wycofa komponent bezpieczeństwa OT w Defender for IoT; do tego czasu dostępne są tylko aktualizacje bezpieczeństwa i poprawki błędów [22]. Partnerski blog Microsoft podaje natomiast jako datę zakończenia wsparcia 31 maja 2028 r. [39]. Nie ma rozwiązania od firmy Microsoft; firma oferuje konektory dla Armis, Dragos i Forescout, których rozwiązania są licencjonowane osobno [22]. Zaplanuj wymianę tak, aby została zakończona przed połową 2028 r.

### Czy IoT Edge nadal warto stosować?

IoT Edge jako produkt nadal jest wspierany. Wersja 1.5 LTS zakończyła wsparcie 10 listopada 2026 r.; obecna wersja 1.6 LTS jest wspierana do 14 listopada 2028 r. [12]. Dla istniejących flot urządzeń z systemem Linux bezpośrednią ścieżką jest aktualizacja do 1.6. Dla urządzeń z Windows działających na EFLOW 1.5 strona wersji nie wymienia EFLOW 1.6 LTS; w tym przypadku wyjaśnij docelową ścieżkę. Dla nowych płaszczyzn danych w zakładach oceń Azure IoT Operations.

### Czy Azure jest zgodny z CMMC?

Nie ma certyfikacji CMMC dla samego Azure, ponieważ CMMC dotyczy systemów wykonawcy, a nie platformy chmurowej [55]. Microsoft stwierdza, że Azure i Azure Government posiadają autoryzacje FedRAMP High obejmujące NIST SP 800-171, że certyfikację CMMC można uzyskać dla rozwiązań w obu chmurach oraz że większość wykonawców obronnych najlepiej dopasowuje się do Azure Government [55]. Przepis DFARS, który wprowadza wymagania CMMC do kontraktów DoD, jest wdrażany etapami od 10 listopada 2025 r. [54].

### Którego standardu bezpieczeństwa powinien użyć amerykański producent dla Azure i OT?

Używaj ich łącznie. NIST CSF 2.0 zapewnia strukturę zarządzania i wspólny język z zarządem, ubezpieczycielami i klientami [49]; ISA/IEC 62443 daje model techniczny dla OT (strefy, kanały komunikacyjne, poziomy bezpieczeństwa) [27]; NIST SP 800-82 Rev. 3 łączy je, dostarczając wskazówki specyficzne dla OT i nakładki kontrolne [50]. Dodaj CMMC, jeśli obsługujesz FCI lub CUI dla DoD [53], oraz NIS2 dla zakładów w UE [41].

### Ile kosztuje Azure dla produkcji?

Nie ma wiarygodnej jednej liczby. Koszty zależą od liczby zakładów i maszyn, wolumenu danych, okresów przechowywania, wybranej pojemności Fabric, sprzętu brzegowego (edge) i licencji. Największą dźwignią jest agregacja danych na brzegu. Skorzystaj z kalkulatora cen Azure i wprowadź praktyki FinOps od fazy 2 [25].

### Jaką rolę pełni Microsoft 365 w produkcji?

Microsoft 365 to warstwa stanowiska pracy: Teams do komunikacji zmianowej i powiadomień, Power BI do wskaźników KPI, Power Apps do rejestracji danych na stanowisku i Copilot do podsumowań oraz pytań o dane. Dla firm z ugruntowanym środowiskiem Microsoft 365 to połączenie jest często najszybszym sposobem, by dane z hali produkcyjnej stały się użyteczne.

### Od czego zacząć jako administrator Microsoft 365 lub Azure?

Od zadań, które i tak należą do centralnego IT: ról Entra ID dla pracowników OT i partnerów, landing zone w Azure z polityką tagów dla każdego zakładu, klastra testowego Arc wraz z zatwierdzeniem reguł zapory w łańcuchu proxy oraz struktury workspace'ów Fabric. Równolegle spotkaj się z kierownikiem OT, aby zrozumieć model stref w zakładzie. Szczegóły znajdują się w sekcji „Od czego zacząć jako administrator Microsoft 365 lub Azure” na początku tego przewodnika.

---

## Podsumowanie

Azure dla produkcji w 2026 roku to mniej kwestia wyboru usług, a bardziej kwestia dyscypliny. Fundament technologiczny jest jasny: Azure IoT Operations on Arc w zakładzie, Microsoft Fabric jako platforma danych oraz Foundry, Power BI i Copilot do analityki i pracy biurowej. Jednocześnie wycofanie Time Series Insights oraz wersji podglądowych dla produkcji, a także zaplanowane wycofanie IoT Central i zabezpieczeń OT w Defender for IoT pokazują, że zarządzanie cyklem życia jest częścią pracy nad architekturą.

O różnicy decydują trzy rzeczy: własny, neutralny wobec narzędzi model danych oparty na ISA-95, projekt zabezpieczeń oparty na ISA/IEC 62443 i NIST CSF 2.0, który obejmuje także CMMC lub NIS2 tam, gdzie mają zastosowanie, oraz konsekwentne skupienie na przypadkach użycia z zmierzonym punktem wyjścia. Jeśli pracujesz w ten sposób, budujesz platformę, która obsługuje utrzymanie predykcyjne, identyfikowalność, cyfrowe bliźniaki i AI na tym samym fundamencie danych i która przetrwa kolejną zmianę nazwy ze strony Microsoftu.

### Dalsza lektura na m365.fm

**Odcinki**
- [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Artykuły**
- [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/)
- [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)

**Słownik**
- [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) · [Digital twin](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Virtual commissioning](https://www.m365.fm/entity/virtual-commissioning/)

**Powiązane przewodniki**
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** jest prowadzącym m365.fm i pracuje w [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). Na m365.fm pisze o przecięciu planowania produkcji, cyfrowych bliźniaków i chmury Microsoft, tłumacząc tematy produkcyjne, takie jak strumienie wartości, identyfikowalność i utrzymanie predykcyjne, dla odbiorców Microsoft 365 i Azure.

**Uwaga: Autor pracuje w iFAKT GmbH.**

*Ostatni przegląd: 20 listopada 2026 (weryfikacja faktów na podstawie źródeł pierwotnych Microsoft, NIST, CISA, FDA, SEC, BSI i UE). Następny przegląd tabeli statusu usług: luty 2027.*

# Sources

All sources retrieved on November 20, 2026, unless noted. Sources 1 to 48 are carried over from the German edition; 49 to 64 are new for the US edition.

1. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview
2. What's new in Microsoft for Manufacturing. Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/whats-new
3. What is Azure IoT Operations? Microsoft Learn (last updated November 11, 2026). https://learn.microsoft.com/en-us/azure/iot-operations/overview-iot-operations
4. What is the connector for OPC UA? (Azure IoT Operations). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
5. Azure IoT Operations now Generally Available. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-now-generally-available/4282445
6. Azure IoT Operations 2603 is now available: Powering the next era of Physical AI. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-2603-is-now-available-powering-the-next-era-of-physical-ai/4509342
7. Releases: Azure/azure-iot-operations. Microsoft on GitHub. https://github.com/Azure/azure-iot-operations/releases
8. Azure IoT Central is evolving: what you need to know. Microsoft Tech Community (IoT Blog), September 25, 2026. https://techcommunity.microsoft.com/blog/iotblog/azure-iot-central-is-evolving-what-you-need-to-know/4554570
9. Microsoft Confirms Azure IoT Central Commitment. Automation World, February 27, 2024. https://www.automationworld.com/communication/article/33037810/microsoft-confirms-azure-iot-central-commitment
10. Migrating Time Series Insights Gen2 to Real-Time Intelligence in Microsoft Fabric. Microsoft Learn (archived page; newer version at https://learn.microsoft.com/en-us/previous-versions/azure/time-series-insights/migration-to-fabric). https://learn.microsoft.com/en-us/azure/time-series-insights/how-to-tsi-gen2-migration
11. Retirement of Azure Percept DK. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-percept/retirement-of-azure-percept-dk
12. Azure IoT Edge versions and release notes. Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-edge/version-history
13. Azure IoT Edge: Microsoft Lifecycle. Microsoft Learn. https://learn.microsoft.com/en-us/lifecycle/products/azure-iot-edge
14. What is Azure Digital Twins? Microsoft Learn. https://learn.microsoft.com/en-us/azure/digital-twins/overview
15. What is digital twin builder (preview)? Microsoft Fabric, Microsoft Learn (last updated May 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
16. Ontology (preview) overview, Fabric IQ. Microsoft Learn (October 16, 2026). https://learn.microsoft.com/en-us/fabric/iq/ontology/overview
17. Connected Factory Reference Architecture. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/architectures/connected-factory
18. Transform your business with Real-Time Intelligence, now generally available. Microsoft Fabric Updates Blog. https://blog.fabric.microsoft.com/fi-fi/blog/transform-your-business-with-real-time-intelligence-now-generally-available
19. What is Azure Data Explorer? Microsoft Learn (July 23, 2026). https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview
20. What is Microsoft Foundry? Microsoft Learn. https://learn.microsoft.com/azure/foundry/what-is-foundry
21. New name for Azure Stack HCI / Azure Local. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local
22. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, November 2, 2026. https://azure.microsoft.com/updates?id=576255 (full text via the Release Communications API: https://www.microsoft.com/releasecommunications/api/v2/azure/576255; mirror: https://mc.merill.net/message/AZ576255)
23. What's new in Microsoft Defender for IoT? Microsoft Learn. https://learn.microsoft.com/en-us/azure/defender-for-iot/organizations/whats-new
24. Microsoft Defender now integrates with Dragos, Forescout & Armis for OT Security. Microsoft Tech Community, July 2026. https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/microsoft-defender-now-integrates-with-dragos-forescout--armis-for-ot-security/4534936
25. FinOps Framework. Microsoft Learn (Microsoft Cloud FinOps). https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework
26. ISA-95 Standard. International Society of Automation (ISA). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
27. Quick Start Guide: An Overview of ISA/IEC 62443 Standards. ISA Global Cybersecurity Alliance. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
28. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft (NIS2 implementation act in force tomorrow). BSI press release, December 5, 2025 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html; also: Zweiter Schritt zur NIS-2-Registrierung: BSI-Portal ab sofort freigeschaltet (second registration step: BSI portal open). BSI, January 6, 2026 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2026/260601_NIS2_BSI-Portal.html
29. Digital Product Passport (including the Batteries subpage). European Commission, DG GROW. https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en and https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/batteries_en
30. Cyber Resilience Act: Reporting obligations. European Commission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
31. Smart Manufacturing: Unlocking Real-Time Intelligence With Azure IoT Operations and Microsoft Fabric. b.telligent. https://www.btelligent.com/en/blog/real-time-intelligence-azure-iot-microsoft-fabric
32. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource. Microsoft Tech Community (Marketplace Blog), July 11, 2024. https://techcommunity.microsoft.com/blog/marketplace-blog/learn-about-ifakt-gmbhs-isv-success-for-business-applications-solution-in-micros/4182536
33. Polaris VSM: Digital Value Stream Mapping. Microsoft Marketplace. https://marketplace.microsoft.com/en-us/product/saas/ifaktgmbh.ifakt_vsm_1?tab=overview
34. Microsoft Ignite 2025: Ten Things You Need to Know. Directions on Microsoft, November 18, 2025. https://www.directionsonmicrosoft.com/microsoft-ignite-2025-ten-things-you-need-to-know/
35. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
36. Integration with Azure Device Registry (preview). Azure IoT Hub, Microsoft Learn. https://learn.microsoft.com/en-gb/azure/iot-hub/iot-hub-device-registry-overview
37. What is Azure Machine Learning? Microsoft Learn (includes the notice that prompt flow retires on April 20, 2027). https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning?view=azureml-api-2
38. Labeling images and text documents. Azure Machine Learning, Microsoft Learn (retirement notice for data labeling, September 30, 2026). https://learn.microsoft.com/en-us/azure/machine-learning/how-to-label-data?view=azureml-api-2
39. November update: What's new in Security for partners. Microsoft Tech Community (Partner News), November 12, 2026. https://techcommunity.microsoft.com/blog/partnernews/november-update-what%E2%80%99s-new-in-security-for-partners/4572658
40. Publish and subscribe MQTT messages using MQTT broker. Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker
41. Fragen und Antworten zu NIS-2 (NIS2 FAQ). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html; NIS-2-Meldepflicht (NIS2 reporting obligation). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-Infopakete/NIS-2-Meldepflicht/NIS-2-Meldepflicht_node.html
42. Cyber Resilience Act. BSI. https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
43. OneLake Settings: Modify Immutability Policy. Fabric REST API, Microsoft Learn. https://learn.microsoft.com/en-us/rest/api/fabric/core/onelake-settings/modify-immutability-policy
44. SAP and Microsoft accelerate business insights and AI innovation with SAP Business Data Cloud Connect for Microsoft Fabric. Microsoft Fabric Blog. https://blog.fabric.microsoft.com/en-us/blog/29410
45. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric
46. Digital Omnibus on AI has been published (Regulation (EU) 2026/1744). Cuatrecasas, July 2026. https://www.cuatrecasas.com/en/spain/intellectual-property/art/digital-omnibus-ai-has-been-published; also European Commission, Advanced Manufacturing Transition Pathway: AI Act Digital Omnibus: high-risk deadlines postponed, machinery carved out. https://transition-pathways.europa.eu/adv-man/legislation/ai-act-digital-omnibus-high-risk-deadlines-postponed-machinery-carved-out
47. Pause and resume your capacity. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/enterprise/pause-resume
48. SAP DM Shopfloor Integration. DSAG impulsant, May 4, 2026 (guide dated April 2026). https://impulsant.dsag.de/formate/textbeitrag/sap-dm-shopfloor-integration-english/
49. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. NIST news release, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
50. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, September 28, 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final; news release: https://www.nist.gov/news-events/news/2023/09/guide-operational-technology-ot-security-nist-publishes-sp-800-82-revision
51. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, September 29, 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd
52. Critical Manufacturing Sector. Cybersecurity and Infrastructure Security Agency (CISA). https://www.cisa.gov/critical-manufacturing-sector
53. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, October 2024 (summary of 32 CFR Part 170, effective December 16, 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule
54. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (summary of the DFARS rule, effective November 10, 2025). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes
55. Cybersecurity Maturity Model Certification (CMMC). Azure compliance documentation, Microsoft Learn (last updated April 5, 2023). https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc
56. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC press release 2023-139, July 26, 2023. https://www.sec.gov/newsroom/press-releases/2023-139
57. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, October 8, 2026 (secondary source on rulemaking status). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open
58. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services
59. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods
60. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10
61. Quality Management System Regulation (QMSR). U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation
62. AS9100 Certification: Aerospace QMS. ANSI blog (ANAB). https://blog.ansi.org/anab/as9100-certification-aerospace-qms/
63. NIST Risk Management Framework Aims to Improve Trustworthiness of Artificial Intelligence. NIST news release, January 26, 2023. https://www.nist.gov/news-events/news/2023/01/nist-risk-management-framework-aims-improve-trustworthiness-artificial
64. AZ569914, Retirement: Azure IoT Central will be retired on September 20, 2029. Azure Updates notice, published September 29, 2026 (via the Message Center mirror mc.merill.net). https://mc.merill.net/message/AZ569914
