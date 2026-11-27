# SEO metadata

| Field | Value |
|---|---|
| Meta title | Azure untuk Manufaktur: Panduan Arsitektur 2026 |
| Meta description | Azure untuk manufaktur di 2026: status layanan, arsitektur referensi, keamanan OT (IEC 62443, NIST CSF 2.0), keterlacakan, AI, dan FinOps. |
| Slug | `manufacturing-it-azure` |

# Azure untuk Manufaktur: Panduan Lengkap TI Manufaktur di Microsoft Azure (November 2026)

**Jawaban singkat:** Pada akhir 2026, Azure untuk manufaktur terdiri dari tiga lapisan: Azure IoT Operations di atas Kubernetes yang diaktifkan Azure Arc di pabrik, Microsoft Fabric (Real-Time Intelligence dan OneLake) sebagai platform data, dan Microsoft Foundry, Power BI serta Copilot untuk analitik, AI, dan area kerja. Blok bangunan lama sudah dihentikan (Time Series Insights, pratinjau agen manufaktur) atau dijadwalkan untuk dihentikan (IoT Central pada 2029, keamanan OT di Defender for IoT). Keberhasilan lebih bergantung pada kepemilikan model data Anda, adanya desain keamanan OT yang selaras dengan ISA/IEC 62443 dan panduan NIST, serta pemilihan kasus penggunaan dengan baseline yang terukur daripada pada layanannya sendiri.

**Poin-poin utama**

- Rencanakan koneksi pabrik baru di **Azure IoT Operations**, bukan di IoT Central atau rantai modul IoT Edge yang dibangun secara manual. Pilih SKU **Standard** jika mesin Anda menggunakan OPC UA; Essentials tidak menyertakan konektor OPC UA.
- Gunakan **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator) untuk data deret waktu. Time Series Insights dihentikan pada 7 Juli 2024.
- Jauhkan logika bisnis dari layanan pratinjau. Microsoft menghentikan model data manufaktur dan pratinjau agen pabrik pada 2025, sekitar satu tahun setelah peluncurannya.
- Rencanakan penggantian **pemantauan OT** Anda sekarang. Microsoft akan sepenuhnya menghentikan keamanan OT di Defender for IoT pada Oktober 2029; sebuah blog mitra Microsoft menyebutkan 31 Mei 2028 sebagai akhir dukungan.
- Petakan program keamanan Anda ke **ISA/IEC 62443** (zona dan conduit) dan **NIST CSF 2.0**; pemasok pertahanan juga memerlukan **CMMC** untuk sistem yang menangani FCI atau CUI.
- Mulailah dengan kasus penggunaan yang memiliki baseline dan pemilik: OEE real-time serta ketertelusuran biasanya memberikan manfaat lebih dulu dibandingkan pemeliharaan prediktif.

## Daftar isi

1. [Apa arti Azure untuk manufaktur saat ini](#apa-arti-azure-untuk-manufaktur-saat-ini)
2. [Status layanan manufaktur Azure, November 2026](#status-layanan-manufaktur-azure-november-2026)
3. [Model data terlebih dahulu: ISA-95 dan unified namespace](#model-data-terlebih-dahulu-isa-95-dan-unified-namespace)
4. [Arsitektur referensi Azure untuk manufaktur](#arsitektur-referensi-azure-untuk-manufaktur)
5. [Konvergensi IT/OT dan keamanan: ISA/IEC 62443, NIST CSF 2.0, CMMC dan NIS2](#konvergensi-itot-dan-keamanan)
6. [Kasus penggunaan 1: Pemeliharaan prediktif di Azure](#use-case-1-pemeliharaan-prediktif-di-azure)
7. [Kasus penggunaan 2: Ketertelusuran dan genealogi](#kasus-penggunaan-2-keterlacakan-dan-silsilah)
8. [Kasus penggunaan 3: Digital twin](#use-case-3-digital-twin)
9. [Kasus penggunaan 4: KPI real-time, OEE, dan value stream](#use-case-4-kpi-real-time-oee-dan-value-stream)
10. [Integrasi ERP dan MES: SAP, Dynamics 365 dan aliran data lantai produksi](#integrasi-erp-dan-mes)
11. [AI dan Copilot dalam manufaktur: apa yang realistis](#ai-dan-copilot-dalam-manufaktur)
12. [FinOps untuk TI manufaktur](#finops-untuk-ti-manufaktur)
13. [Menyusun business case untuk Azure dalam manufaktur](#menyusun-business-case-untuk-azure-di-manufaktur)
14. [Peta jalan: lima fase menuju platform manufaktur Azure yang skalabel](#peta-jalan-lima-fase-menuju-platform-manufaktur-azure-yang-dapat-diskalakan)
15. [Kesalahan umum dalam proyek manufaktur Azure](#kesalahan-umum-dalam-proyek-manufaktur-azure)
16. [Aplikasi industri dalam ekosistem Microsoft: contoh iFAKT Polaris](#aplikasi-industri-dalam-ekosistem-microsoft)
17. [FAQ](#faq)
18. [Kesimpulan](#kesimpulan)

---

## Apa arti Azure untuk manufaktur saat ini

Lima tahun lalu, pencarian "Azure for manufacturing" atau "Azure IoT for manufacturing" menghasilkan daftar yang sudah familiar: IoT Hub, IoT Edge, Stream Analytics, Time Series Insights, dan Synapse. Daftar itu tidak lagi menggambarkan situasi di tahun 2026. Microsoft telah membangun ulang strategi IoT industrinya ke dalam tiga arah:

1. **Edge alih-alih perangkat:** Pengumpulan data di pabrik sekarang berjalan di **Azure IoT Operations**, sekumpulan layanan data pada klaster Kubernetes yang dikelola dari cloud melalui **Azure Arc**. Microsoft menyebut layanan ini sebagai "unified data plane for the edge" [3]. Ketersediaan umum diumumkan pada November 2024 [5].
2. **Platform data alih-alih layanan titik:** Deret waktu, peristiwa, dan data master masuk ke **Microsoft Fabric**, khususnya di Real-Time Intelligence dengan Eventstream, Eventhouse, dan Activator. Microsoft menghentikan Time Series Insights dan mengarahkan pelanggan ke Fabric Eventhouse sebagai target migrasi [10].
3. **Platform alih-alih aplikasi siap pakai:** Di bidang IoT dan manufaktur, Microsoft menarik diri dari aplikasi prakonfigurasi miliknya sendiri. IoT Central berhenti menerima aplikasi baru pada 23 September 2026 dan akan dihentikan pada 20 September 2029 [8], [64]. Pratinjau khusus industri "Manufacturing data solutions" dan "Factory Operations Agent" dihentikan pada 30 Mei 2025 [2].

Penawaran industri kini bernama **Microsoft for Manufacturing** (sebelumnya "Microsoft Cloud for Manufacturing"). Microsoft mengelompokkannya ke dalam empat area solusi: digital engineering, supply chain yang tangguh, intelligent factory, dan connected customer [1]. Untuk intelligent factory, Microsoft menyebut empat skenario: memodernisasi edge dan infrastruktur, mengoptimalkan operasi dengan AI, menghubungkan dan memberdayakan tenaga kerja, serta pemeliharaan dan kualitas [1]. Microsoft menunjuk Fabric sebagai platform untuk "digital thread" [1].

Bagi Anda sebagai pemimpin IT, OT, atau transformasi digital, ini berarti blok bangunannya menjadi lebih generik, dan lebih banyak tanggung jawab atas model data, integrasi, dan operasi berada pada Anda atau mitra Anda. Panduan ini menunjukkan cara memikul tanggung jawab tersebut secara terstruktur. Panduan ini menghubungkan teknologi Azure dengan topik-topik yang menentukan keberhasilan: model data, keamanan, [Industri 4.0](https://www.m365.fm/entity/industry-4-0/) sebagai topik organisasi, KPI, dan biaya.

### Untuk siapa panduan ini

- **Pemimpin IT dan tim cloud** yang sudah menjalankan Microsoft 365 dan Azure dan diminta menghubungkan pabrik.
- **Insinyur OT dan otomasi** yang ingin memahami arti Kubernetes, MQTT, dan Fabric bagi peralatan mereka.
- **Manajer pabrik, kualitas, dan pemeliharaan** yang mengevaluasi kasus penggunaan seperti pemeliharaan prediktif atau keterlacakan.
- **Tim keuangan dan pengadaan** yang perlu membuat biaya cloud di manufaktur dapat diprediksi.

### Istilah manufaktur untuk admin Microsoft 365 dan Azure

Jika Anda berasal dari IT perusahaan, proyek manufaktur membawa kosakatanya sendiri. Berikut istilah-istilah kunci yang digunakan dalam panduan ini, masing-masing dalam satu kalimat:

| Istilah | Arti | Analogi terdekat di IT |
|---|---|---|
| **OT** (operational technology) | Teknologi yang mengendalikan proses fisik: mesin, pengontrol, sistem kendali | Seperti pusat data terpisah tempat gangguan berarti produksi berhenti |
| **PLC** (programmable logic controller) | Komputer industri yang mengendalikan mesin secara real time | Sistem tertanam dengan masa pakai 15 tahun atau lebih |
| **SCADA** | Sistem pengawas untuk memantau dan mengoperasikan beberapa mesin atau lini | Konsol pemantauan dengan akses tulis |
| **MES** (manufacturing execution system) | Mengendalikan dan mencatat pelaksanaan order produksi di pabrik | Sistem alur kerja di antara ERP dan mesin |
| **OPC UA** | Standar industri netral vendor untuk pertukaran data dengan model informasi dan keamanan bawaan | REST API ditambah skema ditambah sertifikat, untuk mesin |
| **MQTT** | Protokol publish/subscribe yang ringan | Message bus, serupa dengan topik Event Grid atau Service Bus |
| **Unified namespace (UNS)** | Struktur event hierarkis terpusat tempat semua sistem mempublikasikan status terkini | Direktori topik untuk seluruh perusahaan |
| **OEE** (overall equipment effectiveness) | Efektivitas peralatan dari ketersediaan, performa, dan kualitas | SLA ketersediaan, tetapi untuk mesin dan mencakup kualitas |
| **KQL** (Kusto Query Language) | Bahasa kueri Fabric Eventhouse dan Azure Data Explorer | Bahasa yang sama dengan yang Anda gunakan di Log Analytics dan Microsoft Sentinel |
| **Purdue model** | Model referensi yang menata lapisan sistem pabrik dari perangkat lapangan hingga tingkat perusahaan; ISA-95 dibangun di atasnya [26] | Model pengelompokan jaringan, dari VLAN perangkat hingga WAN perusahaan |

Baris KQL merupakan titik awal yang baik bagi admin: jika Anda sudah mengenal KQL dari Sentinel atau Log Analytics, Anda dapat langsung mengkueri data mesin di Eventhouse.

### Titik awal bagi admin Microsoft 365 atau Azure

Anda tidak perlu menjadi insinyur otomasi untuk memberikan nilai tambah dalam proyek manufaktur. Lima tugas biasanya berada di tangan IT pusat dan dapat disiapkan sebelum mesin pertama dihubungkan:

1. **Identitas dan peran:** Buat grup Microsoft Entra ID dan peran Azure RBAC untuk staf OT, mitra, dan tim operasi; gunakan Privileged Identity Management untuk membatasi akses istimewa dengan jangka waktu.
2. **Landing zone Azure untuk pabrik:** Tentukan struktur subscription dan resource group per pabrik, dan gunakan Azure Policy untuk menegakkan tag (pabrik, pusat biaya, kasus penggunaan) dan region yang diizinkan.
3. **Uji Azure Arc:** Hubungkan server uji atau klaster Kubernetes ke Arc dan minta persetujuan endpoint outbound yang diperlukan melalui rantai proxy bersama tim jaringan Anda. Di banyak perusahaan, persetujuan firewall ini memakan waktu paling lama.
4. **Dasar-dasar Fabric:** Putuskan kapasitas, struktur workspace, dan model akses; bawa serta tata kelola Power BI yang sudah ada.
5. **Bangun hubungan kerja dengan OT:** Pahami model zona pabrik sebelum Anda mengusulkan perubahan jaringan. Di OT, ketersediaan didahulukan daripada kerahasiaan, dan jendela pemeliharaan mengikuti jadwal produksi, bukan Patch Tuesday.

---

## Status layanan manufaktur Azure, November 2026

Microsoft mengganti nama layanan, meluncurkan pratinjau, dan kemudian menghentikannya kembali. Untuk proyek manufaktur dengan masa pakai lima sampai sepuluh tahun, siklus hidup produk karena itu menjadi kriteria arsitektur. Tabel di bawah ini merangkum status terverifikasi per 20 November 2026.

### Ikhtisar layanan: tujuan, status, sumber

| Layanan | Tujuan dalam manufaktur | Status, November 2026 | Sumber |
|---|---|---|---|
| **Azure IoT Operations** | Data plane edge: broker MQTT, konektor (OPC UA, HTTP/REST), alur data, manajemen aset | Tersedia umum sejak November 2024; rilis rutin. Microsoft Learn menyebut versi 1.5.x (rilis 2610) sebagai rilis yang memperkenalkan SKU baru, **Essentials** (hanya klaster node tunggal, tanpa konektor OPC UA), di samping **Standard** dengan set fitur lengkap | [3], [5], [7] |
| **Azure Device Registry** | Representasi cloud untuk aset dan perangkat, registri skema | Bagian terintegrasi dari Azure IoT Operations; integrasi dengan IoT Hub dalam pratinjau | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Gateway cloud untuk perangkat yang terhubung langsung, siklus hidup perangkat | Aktif; direkomendasikan Microsoft sebagai target untuk pelanggan IoT Central | [8], [64] |
| **Azure IoT Central** | SaaS IoT low-code | Tidak ada aplikasi baru sejak 23 September 2026; pensiun pada 20 September 2029 | [8], [64] |
| **Azure IoT Edge** | Runtime kontainer untuk perangkat edge (modul) | Produk didukung; versi 1.5 LTS tidak lagi didukung sejak 10 November 2026 (begitu juga EFLOW 1.5 untuk Windows); versi saat ini 1.6 LTS (Juli 2026) didukung hingga 14 November 2028; tidak ada EFLOW 1.6 LTS yang tercantum di halaman versi (hanya jalur rilis berkelanjutan EFLOW) | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time hub) | Ingesti streaming, analitik time-series dengan KQL, peringatan | Tersedia umum sejak Ignite, November 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Penyimpanan terpusat untuk data master, transaksional, dan sensor | Tersedia umum | [17] |
| **Digital twin builder** (Fabric Real-Time Intelligence) | Representasi digital berbasis ontologi untuk aset dan proses | Pratinjau | [15] |
| **Fabric IQ ontology** | Lapisan bisnis semantik untuk analitik dan agen | Pratinjau; pengalaman ontologi lama pensiun pada 31 Januari 2027, dan ontologi yang ada harus disalin ke pengalaman baru | [16] |
| **Azure Digital Twins** | Twin berbasis graf dengan DTDL | Aktif, tidak ada pemberitahuan pensiun di halaman ikhtisar; 3D Scenes Studio dalam pratinjau | [14] |
| **Azure Data Explorer** | Basis data time-series KQL di luar Fabric | Aktif, tidak ada pemberitahuan pensiun; menggunakan KQL seperti Fabric Eventhouse | [19] |
| **Microsoft Foundry** (sebelumnya Azure AI Foundry / Azure AI Studio) | Model, agen, dan alat untuk aplikasi AI | Aktif; "Azure AI Services" kini menjadi "Foundry Tools"; prompt flow pensiun pada 20 April 2027 | [20], [34], [37] |
| **Azure Machine Learning** | Pelatihan, penerapan, dan MLOps untuk model ML klasik | Aktif; Microsoft memposisikan Foundry untuk AI generatif dan Azure ML untuk ML klasik dan MLOps. Pelabelan data bawaan dihentikan pada 30 September 2026 | [37], [38] |
| **Azure Arc** | Manajemen Kubernetes dan server di luar Azure | Aktif; fondasi Azure IoT Operations | [3] |
| **Azure Local** (sebelumnya Azure Stack HCI) | Infrastruktur hiperkonvergen di pabrik | Aktif; diganti nama November 2024 | [21] |
| **Microsoft Defender for IoT (keamanan OT)** | Pemantauan jaringan OT pasif, inventaris aset, deteksi anomali | Penghentian resmi diumumkan 2 November 2026; penghentian penuh pada Oktober 2029; hingga saat itu hanya pembaruan keamanan dan perbaikan bug, tanpa fitur OT baru. Sebuah blog mitra Microsoft menyebut 31 Mei 2028 sebagai akhir dukungan. Konektor untuk Armis, Dragos, dan Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Penjelajah time-series (lama) | Dihentikan 7 Juli 2024; Microsoft menyebut Fabric Eventhouse sebagai target migrasi | [10] |
| **Azure Percept** | Kit pengembangan AI edge | Dihentikan 30 Maret 2023 | [11] |
| **Manufacturing data solutions** (Azure) dan **Factory Operations Agent** (Azure AI dan Copilot Studio) | Model data manufaktur dan copilot manufaktur (pratinjau) | Dihentikan per 30 Mei 2025 (diumumkan Februari 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Agen keselamatan kerja (pratinjau) | Dihentikan per 23 Juni 2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Model data manufaktur di Fabric (pratinjau sejak April 2024) | Status tidak jelas: pemberitahuan penghentian menyebut "Manufacturing data solutions" tanpa akhiran Fabric dan tidak mencakup maupun mengecualikan varian Fabric; tidak ada entri terpisah sejak April 2024. Jangan rencanakan untuk proyek baru; tanyakan status-nya kepada Microsoft. | [2] |

### Apa arti tabel ini untuk arsitektur Anda

**Pertama:** Rencanakan koneksi pabrik baru di Azure IoT Operations, bukan di IoT Central dan bukan di rangkaian modul IoT Edge buatan sendiri, kecuali ada alasan khusus. IoT Edge tetap didukung, tetapi itu adalah model runtime perangkat; Azure IoT Operations menangani data plane pabrik dengan broker, connector, dan model aset [3]. Saat memilih SKU, perhatikan bahwa Essentials tidak menyertakan connector OPC UA [3]. Untuk pabrik tipikal dengan mesin OPC UA, Standard adalah titik awal.

**Kedua:** Jauhkan logika bisnis dari layanan pratinjau. Riwayat Manufacturing data solutions menunjukkan bahwa model data manufaktur Microsoft dapat beralih dari pratinjau ke penghentian dalam waktu sedikit lebih dari satu tahun [2]. Model data Anda adalah milik Anda sendiri dan sebaiknya didokumentasikan dalam format terbuka (tabel Delta di OneLake, skema JSON di broker, DTDL atau model informasi OPC UA).

**Ketiga:** Tinjau strategi keamanan OT Anda. Pemberitahuan resmi Azure menyebut Oktober 2029 sebagai akhir keamanan OT di Defender for IoT, sementara sebuah blog mitra Microsoft memberikan 31 Mei 2028 sebagai akhir dukungan [22], [39]. Rencanakan dengan tanggal yang lebih awal: pengadaan, penerapan, dan penerimaan sensor baru sering memakan waktu lebih dari satu tahun di lingkungan yang diatur.

**Keempat:** Tinjau armada IoT Edge Anda. Perangkat pada IoT Edge 1.5 belum menerima pembaruan keamanan sejak 10 November 2026. Microsoft menggambarkan perpindahan ke 1.6 LTS sebagai hal yang sederhana karena tidak memuat perubahan fitur besar [12]. Akhir dukungan yang sama berlaku untuk perangkat Windows yang menjalankan IoT Edge for Linux on Windows (EFLOW) 1.5; halaman versi tidak mencantumkan EFLOW 1.6 LTS, hanya jalur rilis berkelanjutan [12]. Perjelas jalur target untuk perangkat ini dengan Microsoft atau vendor perangkat keras Anda.

> **Catatan tentang kemutakhiran:** Tabel ini merupakan potret pada waktu tertentu. Sebelum setiap keputusan arsitektur, periksa halaman Microsoft yang ditautkan dan portal Azure Updates yang difilter dengan "Retirements".

---

## Model data terlebih dahulu: ISA-95 dan unified namespace

Banyak proyek manufaktur gagal bukan karena cloud, melainkan karena tidak ada yang mendefinisikan apa itu "mesin", "pesanan", atau "kejadian downtime" dalam model data. Jawab pertanyaan itu sebelum Anda menerapkan layanan Azure pertama.

### ISA-95 dan piramida otomasi

Rangkaian **ANSI/ISA-95** (secara internasional IEC 62264) menjelaskan integrasi sistem perusahaan dan sistem kontrol [26]. ISA menggambarkannya sebagai rangkaian standar untuk mengintegrasikan sistem logistik dengan sistem kontrol manufaktur, dibangun di atas model referensi Purdue dan berlaku untuk industri diskret, kontinu, dan logistik; rangkaian ini terdiri dari delapan bagian [26]. Ini memberi Anda dua hal yang berguna untuk arsitektur cloud apa pun:

- **Model level:** Level 0 hingga 2 mencakup proses fisik, sensor, aktuator, dan kontrol (PLC, SCADA). Level 3 adalah manajemen operasi manufaktur (MES, MOM). Level 4 adalah perencanaan bisnis ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). Di Eropa hierarki ini sering digambarkan sebagai "piramida otomasi"; di Amerika Utara model Purdue lebih umum digunakan.
- **Model objek:** ISA-95 mendefinisikan istilah seperti hierarki peralatan (enterprise, site, area, work center, work unit), material, personel, pesanan produksi, dan data kinerja. OPC Foundation telah memetakan model ini ke dalam companion specification-nya sendiri untuk OPC UA [35].

Kritik terhadap piramida ini sudah dikenal luas: data hanya bergerak level demi level, setiap antarmuka adalah integrasi titik-ke-titik, dan aplikasi baru harus terhubung ke beberapa sistem. Model objek, sebaliknya, tetap bernilai karena memberikan bahasa bersama bagi TI, OT, dan bisnis.

### Unified namespace: peristiwa sebagai pengganti piramida

**Unified namespace (UNS)** adalah pola arsitektur, bukan standar. Semua sistem mempublikasikan keadaan terkini mereka sebagai peristiwa ke broker pusat yang terstruktur secara hierarkis, biasanya MQTT. Konsumen berlangganan topik yang mereka butuhkan. Hierarki topik sering mengikuti hierarki peralatan ISA-95, misalnya:

```
acme/dayton-plant/assembly/line-3/station-20/state
acme/dayton-plant/assembly/line-3/station-20/order
acme/dayton-plant/assembly/line-3/station-20/quality
```

Azure IoT Operations menyertakan broker MQTT native-edge yang mendukung MQTT 3.1.1 dan MQTT 5 [40]. Connector OPC UA mempublikasikan data dari server OPC UA sebagai JSON dalam format OPC UA PubSub ke topik broker dan juga dapat menulis nilai kembali ke node OPC UA; permintaan tulis menggunakan pola request/response MQTT 5 [4]. Dengan begitu, Anda dapat membangun UNS di pabrik tanpa menjalankan broker terpisah.

Jika Anda sudah menjalankan UNS di broker lain, Anda tidak harus menggantinya: data flow dapat meneruskan pesan ke broker MQTT eksternal [3]. Apakah Anda menggunakan broker Microsoft sebagai UNS pabrik atau sebagai pengumpan ke broker yang sudah ada adalah keputusan operasional. Yang penting adalah konvensi topik dan payload yang mengikat, yang tidak bergantung pada produk.

### ISA-95 atau UNS? Keduanya.

Jawaban yang produktif adalah: gunakan **ISA-95 sebagai kosakata** dan **UNS sebagai pola transport**. Dalam praktiknya:

| Pertanyaan | Rekomendasi |
|---|---|
| Bagaimana saya memberi nama aset? | Hierarki peralatan ISA-95, konsisten di seluruh perusahaan |
| Bagaimana saya menyusun topik? | Berdasarkan hierarki peralatan, dengan domain bisnis di bawahnya (status, order, kualitas, energi) |
| Bagaimana saya mendeskripsikan payload? | Skema JSON di schema registry Azure Device Registry [3]; untuk mesin, utamakan spesifikasi companion OPC UA |
| Di mana data master berada? | Di system of record (ERP, MES, PLM); UNS hanya mendistribusikan referensi dan status |
| Bagaimana saya menangani riwayat? | Tidak di broker, melainkan di Eventhouse atau Lakehouse di Fabric |

### Model data manufaktur minimum

Terlepas dari alatnya, use case dalam panduan ini memerlukan model inti dengan tujuh entitas:

1. **Aset** (mesin, stasiun, alat) dengan ID unik dan posisi dalam hierarki
2. **Sinyal** (tag, variabel terukur) dengan satuan, laju sampling, dan tautan ke aset
3. **Status** (berjalan, downtime terencana, downtime tak terencana, changeover) dengan kode alasan
4. **Order** (order produksi, operasi) dengan tautan ke ERP
5. **Material dan nomor lot/serial** dengan tautan ke bill of materials
6. **Event** (alarm, temuan kualitas, pemeliharaan)
7. **Orang/shift**, sejauh aturan privasi dan perjanjian kerja mengizinkan

Jika Anda menghubungkan ketujuh entitas ini dengan rapi, Anda dapat melayani OEE, predictive maintenance, traceability, dan digital twin dari fondasi data yang sama. Kami membahas cara menurunkan model seperti ini dari value stream dalam episode [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/); metodenya sendiri dibahas dalam panduan kami tentang [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

---

## Arsitektur referensi Azure untuk manufaktur

Arsitektur referensi di bawah ini merangkum apa yang dijelaskan Microsoft dalam dokumentasi Azure IoT Operations [3] dan dalam arsitektur referensi Fabric "Connected Factory" [17], serta menambahkan lapisan yang tidak tercakup oleh sumber-sumber tersebut: keamanan, data master, dan tempat kerja.

### Model lapisan

| Lapisan | Fungsi | Blok bangunan Azure dan Microsoft | Keputusan tipikal |
|---|---|---|---|
| **0: Lapangan dan kontrol** | Mesin, PLC, sensor, bangku uji, kamera | Tidak ada komponen Azure; server OPC UA pada pengontrol atau gateway, sensor retrofit bila diperlukan | Mesin mana yang menggunakan OPC UA? Di mana retrofit diperlukan? |
| **1: Infrastruktur edge** | Komputasi di pabrik, segmentasi jaringan | PC industri atau server dengan Kubernetes (misalnya AKS Edge Essentials pada Windows, klaster berbasis Ubuntu) [3], atau Azure Local [21]; dikelola melalui Azure Arc | Klaster simpul tunggal atau multi-simpul? Siapa yang mengoperasikan perangkat keras? Catatan: SKU Essentials terbatas pada simpul tunggal [3] |
| **2: Bidang data edge** | Pengumpulan, normalisasi, buffering, UNS lokal | Azure IoT Operations: broker MQTT, konektor OPC UA, konektor HTTP/REST (konektor Akri), data flow, pengalaman operasi, penemuan perangkat dan aset otomatis [3], [4] | Struktur topik, skema, agregasi edge, buffer disk broker, perilaku saat offline (maksimum 72 jam, mungkin terdegradasi [3]) |
| **3: Manajemen aset dan perangkat** | Aset mana yang mana? Titik data mana? | Azure Device Registry dengan namespace dan schema registry [3]; untuk perangkat yang terhubung langsung, IoT Hub dan DPS [8] | Siapa yang memelihara data master aset? Rekonsiliasi dengan sistem pemeliharaan (CMMS)? |
| **4: Streaming dan analitik real-time** | Menyerap peristiwa, memperkaya, memicu peringatan | Fabric Real-Time Intelligence: Eventstream, Eventhouse (KQL), Activator, Real-Time Dashboards [17], [18]; alternatifnya Azure Event Hubs dan Azure Data Explorer [19] | Kapasitas Fabric atau PaaS Azure? Retensi panas/dingin? |
| **5: Platform data** | Riwayat, data konteks, produk data | OneLake, Lakehouse, Data Factory untuk data ERP, MES, dan shift [17] | Struktur medallion, kepemilikan produk data, model akses |
| **6: Semantik dan kembaran digital** | Makna, relasi, ontologi | Ontologi Fabric IQ (pratinjau) [16], digital twin builder (pratinjau) [15] atau Azure Digital Twins dengan DTDL [14] | Apakah pratinjau dapat diterima? Mempertahankan kepemilikan model |
| **7: Analitik dan AI** | Model, prakiraan, agen | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | Di mana melatih, di mana menjalankan inferensi (cloud atau edge)? |
| **8: Tempat kerja dan proses** | Menginformasikan orang dan memungkinkan mereka bertindak | Power BI, Teams (termasuk skenario frontline), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | Peran mana melihat apa? Perangkat seluler di lantai produksi? |
| **Lintas lapisan: keamanan dan tata kelola** | Identitas, jaringan, pemantauan, kepatuhan | Microsoft Entra ID, Azure Policy, rangkaian Microsoft Defender, Microsoft Purview, sensor OT (Defender for IoT hanya sebagai masa transisi, solusi mitra) [22] | Model zona sesuai ISA/IEC 62443, profil NIST CSF 2.0, jalur pelaporan insiden |
| **Lintas lapisan: biaya** | Transparansi, alokasi, optimasi | Microsoft Cost Management, metrik kapasitas Fabric, praktik FinOps [25] | Biaya per pabrik, lini, kasus penggunaan |

### Alur data dalam sepuluh langkah

1. Controller mengekspos nilai proses melalui server OPC UA.
2. Konektor OPC UA di Azure IoT Operations membaca titik data yang dikonfigurasi dari sebuah aset dan mempublikasikannya ke topik broker, misalnya `azure-iot-operations/data/<asset>` [4].
3. Konektor dapat menemukan aset secara otomatis pada server OPC UA dan menambahkan konfigurasinya ke Azure Device Registry [4].
4. Data flow menyaring, menormalkan, mengonversi satuan, dan memperkaya data dengan konteks [3], [31].
5. Aplikasi lokal (misalnya papan andon atau inspeksi inline) berlangganan langsung ke broker.
6. Sebuah data flow meneruskan data agregat ke endpoint cloud: Event Hubs/Kafka, broker MQTT Event Grid, Data Lake Storage, Fabric OneLake, atau Azure Data Explorer [3].
7. Di Fabric, Eventstream menyerap data dan Eventhouse menyimpannya untuk kueri KQL [17].
8. Data Factory menyinkronkan data ERP, MES, shift, dan biaya ke OneLake [17].
9. Event diperkaya dengan hierarki aset dan topologi lini; model dilatih dan diberi skor, dan hasilnya disimpan di OneLake [17].
10. Real-Time Dashboards dan Power BI memvisualisasikan data, Activator memberi notifikasi kepada teknisi, dan Copilot menjawab pertanyaan dalam bahasa alami [17].

Microsoft memperkirakan referensi Connected Factory menghasilkan lebih dari satu juta event IIoT per jam dari 30.000 tag di 40 pabrik [17]. Anggap angka itu sebagai gambaran orientasi, bukan jaminan kinerja untuk lingkungan Anda.

### Pelajaran dari proyek

Konsultan b.telligent menjelaskan tiga pelajaran dari proyek dengan Azure IoT Operations dan Fabric [31]:

- **Konfigurasikan penyimpanan broker:** Tanpa penyimpanan persisten yang dikonfigurasi, pesan yang tidak dapat diteruskan dapat memenuhi memori. Microsoft mengonfirmasi hal ini secara tidak langsung: buffer pesan berbasis disk pada broker hanya dapat diatur selama deployment awal, tidak setelahnya [40]. Tentukan profil memori dan buffer sebelum peluncuran.
- **Jaga kestabilan skema:** Perubahan struktur JSON membuat pemrosesan hilir menjadi rapuh. Amplop seragam dengan metadata dan payload membantu.
- **Konsolidasikan Eventstream:** Karena setiap Eventstream menimbulkan biaya operasional, posting ini merekomendasikan konsolidasi per pabrik, bukan per sumber, serta melakukan transformasi di Eventhouse dengan update policy dan KQL, bukan di Eventstream.

Tips ini berasal dari posting Maret 2025 (diperbarui Juni 2025); periksa apakah tips tersebut masih berlaku untuk rilis Anda.

### Jalur alternatif

Tidak setiap produsen membutuhkan arsitektur lengkap. Empat varian umum:

| Varian | Kapan masuk akal | Blok pembangun |
|---|---|---|
| **Langsung ke cloud** | Perangkat sedikit, modern, terhubung; tanpa kebutuhan latensi | IoT Hub, DPS, Fabric Real-Time Intelligence |
| **Berpusat di edge** | Banyak mesin, OPC UA, keputusan lokal, jaringan OT tanpa koneksi cloud langsung | Azure IoT Operations on Arc, Fabric |
| **Edge mitra** | Platform edge industri yang sudah ada dari vendor otomasi | Platform mitra plus Fabric atau Azure; Microsoft mencantumkan, misalnya, menjalankan model Azure AI di Siemens Industrial Edge sebagai panduan arsitektur [2] |
| **Awal kecil (produsen menengah, satu pabrik)** | Beberapa lini, tanpa tim Kubernetes internal, use case pertama OEE atau pemantauan kondisi | Satu klaster single-node dengan Azure IoT Operations Standard (karena OPC UA), kapasitas Fabric kecil, Power BI; operasi klaster mungkin melalui mitra |

Untuk produsen menengah dengan satu pabrik, arsitektur lapisan lengkap adalah gambaran target, bukan titik awal. Mulailah dengan lapisan 1, 2, 4, dan 8, lalu tambahkan semantik, AI, dan tata kelola lintas pabrik setelah use case pertama memberikan hasil.

---

## Konvergensi IT/OT dan keamanan

Setelah data mesin mengalir ke cloud, pabrik menjadi bagian dari permukaan serangan Anda. Pada saat yang sama, persyaratan regulasi dan pelanggan semakin ketat. CISA memasukkan manufaktur logam primer, mesin, peralatan dan komponen listrik, serta peralatan transportasi sebagai inti dari **Critical Manufacturing Sector** AS [52], sehingga banyak pabrik yang mengirim data ke Azure termasuk dalam sektor infrastruktur kritis.

Bagian ini dimulai dengan standar yang membentuk desain teknis (ISA/IEC 62443, NIST CSF 2.0, NIST SP 800-82), lalu membahas kewajiban yang berlaku untuk kelompok produsen tertentu (CMMC, SEC, CIRCIA) dan, bagi perusahaan dengan operasi di UE atau pelanggan di UE, NIS2 dan Cyber Resilience Act.

### ISA/IEC 62443: zona, conduit, tingkat keamanan

Seri **ISA/IEC 62443** adalah kerangka acuan untuk keamanan sistem otomasi dan kendali industri. Konsep intinya adalah zona (kelompok aset dengan kebutuhan proteksi yang sama), conduit (jalur komunikasi terkendali antar-zona), dan tingkat keamanan sebagai target per zona, dari SL 1 (proteksi terhadap pelanggaran yang tidak disengaja atau kebetulan) hingga SL 4 (proteksi terhadap penyerang canggih dengan sumber daya yang besar) [27]. Standar ini juga mendefinisikan tujuh persyaratan dasar, mulai dari kontrol identifikasi dan autentikasi hingga ketersediaan sumber daya [27]. Untuk arsitektur Azure, artinya:

- **Klaster edge adalah zona tersendiri:** Klaster Kubernetes yang menjalankan Azure IoT Operations tidak berada di jaringan kantor maupun langsung di jaringan kendali, melainkan di zona perantara (sering disebut "industrial DMZ", Purdue level 3.5).
- **Hanya koneksi keluar:** Arc dan aliran data membuka koneksi dari pabrik ke cloud. Koneksi masuk dari internet ke dalam pabrik tidak diperlukan dan sebaiknya tidak dibuka.
- **Jaringan berlapis:** Microsoft menyatakan bahwa Azure IoT Operations mendukung pengelolaan perangkat yang aman dalam jaringan berlapis [3]. Rencanakan rantai proxy dan firewall sejak awal bersama tim keamanan OT.
- **Berikan akses tulis secara sengaja:** Konektor OPC UA dapat menulis nilai kembali ke kontroler [4]. Kemampuan ini memerlukan penilaian risiko dan proses persetujuan tersendiri, dan idealnya dimulai dalam keadaan nonaktif.
- **Sertifikat, bukan kata sandi:** Untuk OPC UA, tersedia username/password, sertifikat X.509, dan akses anonim (hanya untuk pengujian) [4]. Gunakan sertifikat dan trust list, serta perlakukan pembaruan sertifikat sebagai proses operasi yang berulang.

### NIST CSF 2.0 dan NIST SP 800-82: dasar acuan AS

Bagi sebagian besar produsen di AS, **NIST Cybersecurity Framework (CSF) 2.0** adalah bahasa bersama antara pabrik, IT, dan dewan direksi. NIST merilisnya pada 26 Februari 2024; framework ini memperluas lima fungsi Identify, Protect, Detect, Respond, dan Recover dengan fungsi baru **Govern** dan berlaku bagi organisasi dari sektor dan ukuran apa pun [49]. Framework ini bersifat sukarela, tetapi pelanggan, perusahaan asuransi, dan auditor semakin sering meminta profil CSF.

Dua dokumen NIST membuat framework ini konkret bagi pabrik:

- **NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security** (September 2023) membahas arsitektur, ancaman, dan penanggulangan OT serta menambahkan overlay OT dengan baseline kontrol SP 800-53 yang disesuaikan untuk sistem OT berdampak rendah, sedang, dan tinggi [50].
- **NIST IR 8183 Rev. 2, Cybersecurity Framework 2.0 Manufacturing Profile**, dipublikasikan sebagai draf publik awal pada 29 September 2025; masa komentar berakhir pada 17 November 2025, dan hingga November 2026 belum ada versi final yang tercantum [51]. Gunakan sebagai referensi draf, bukan sebagai standar final.

Cara bagian-bagian ini saling terhubung dalam proyek Azure:

| Fungsi CSF 2.0 | Artinya untuk platform manufaktur Azure |
|---|---|
| Govern | Pemilik bernama untuk platform pabrik, penerimaan risiko untuk layanan pratinjau, daftar pemasok (Microsoft, integrator, vendor OT) |
| Identify | Inventaris aset OT yang direkonsiliasi dengan Azure Device Registry; peta aliran data per zona dan conduit |
| Protect | Peran Entra ID dengan hak akses minimum, PIM, sertifikat OPC UA, konektivitas hanya keluar, akses tulis dinonaktifkan secara default |
| Detect | Pemantauan jaringan OT (solusi mitra setelah Defender for IoT), log terpusat dari edge dan cloud di Sentinel atau SIEM Anda |
| Respond | Playbook insiden yang mencakup pabrik dan cloud, termasuk siapa yang boleh memutus koneksi klaster selama produksi |
| Recover | Redeployment klaster edge yang telah diuji (infrastructure as code), cadangan konfigurasi broker dan aset |

Produsen kecil dan menengah tidak harus melakukannya sendiri: jaringan nasional NIST Manufacturing Extension Partnership (MEP) menawarkan self-assessment berbasis CSF, analisis kesenjangan, rencana tindakan korektif, rencana respons insiden, dan bantuan untuk persyaratan DFARS [58].

### CMMC untuk pemasok pertahanan

Jika Anda membuat suku cadang atau menyediakan layanan untuk Departemen Pertahanan AS, **Cybersecurity Maturity Model Certification (CMMC)** berlaku untuk sistem yang memproses, menyimpan, atau mengirimkan Federal Contract Information (FCI) atau Controlled Unclassified Information (CUI). Aturan program (32 CFR Part 170) mulai berlaku pada 16 Desember 2024 [53]. Aturan DFARS yang memasukkan CMMC ke dalam kontrak mulai berlaku pada 10 November 2025, dengan penerapan bertahap: fase 1 dimulai pada tanggal tersebut, fase 2 pada 10 November 2026, dan fase 3 dijadwalkan pada 10 November 2027 [54]. Tingkatannya adalah Level 1 (self-assessment, FCI), Level 2 (self-assessment atau asesmen pihak ketiga C3PAO, berdasarkan NIST SP 800-171), dan Level 3 (asesmen DIBCAC, menambahkan praktik NIST SP 800-172) [53], [54].

Artinya untuk Azure:

- **Tentukan cakupan data, bukan cloud.** CMMC berlaku untuk sistem Anda, bukan untuk Azure sebagai platform; tidak ada sertifikat CMMC untuk Azure itu sendiri [55]. Telemetri mesin biasa mungkin bukan CUI, sedangkan gambar teknik, spesifikasi, dan sebagian parameter proses untuk suku cadang pertahanan bisa termasuk CUI; penandaan CUI dan ketentuan kontrak dari pelanggan Anda yang menentukan. Tentukan data mana di UNS dan di OneLake yang masuk dalam cakupan.
- **Pilih lingkungan cloud secara sengaja.** Microsoft menyatakan bahwa Azure komersial dan Azure Government sama-sama memiliki otorisasi FedRAMP High yang mencakup NIST SP 800-171, dan bahwa Anda dapat memperoleh sertifikasi CMMC untuk solusi di kedua lingkungan tersebut; Azure Government menambahkan otorisasi DoD IL4/IL5 serta komitmen kontraktual tentang penyimpanan data di AS dan personel AS yang telah diperiksa, dan Microsoft menganggapnya lebih sesuai bagi sebagian besar kontraktor pertahanan [55]. Perlu diketahui bahwa halaman CMMC Microsoft terakhir diperbarui pada April 2023, jadi periksa rinciannya dengan tim akun Microsoft Anda.
- **Periksa ketersediaan fitur.** Tidak setiap layanan dalam panduan ini tersedia di Azure Government atau di lingkungan Microsoft 365 GCC High. Verifikasi ketersediaan Azure IoT Operations, Fabric, dan Copilot untuk target cloud Anda sebelum merancang dengan mengandalkannya [unverified: ketersediaan untuk layanan individual; periksa halaman ketersediaan fitur US Government dari Microsoft].

### Pengungkapan SEC dan pelaporan insiden CIRCIA

Dua rezim pelaporan AS memengaruhi cara Anda merancang logging dan respons insiden untuk platform pabrik:

- **Perusahaan terbuka:** Berdasarkan aturan SEC yang diadopsi pada 26 Juli 2023, emiten wajib mengungkapkan insiden keamanan siber material melalui Form 8-K (Item 1.05) dalam empat hari kerja setelah menetapkan bahwa insiden tersebut material, dan menjelaskan manajemen risiko, strategi, dan tata kelola keamanan siber mereka dalam Form 10-K tahunan [56]. Serangan ransomware yang menghentikan pabrik adalah kandidat khas untuk penilaian materialitas, jadi playbook insiden OT Anda memerlukan jalur cepat menuju komite pengungkapan.
- **Infrastruktur kritis (CIRCIA):** Cyber Incident Reporting for Critical Infrastructure Act mewajibkan entitas yang tercakup untuk melaporkan insiden siber yang tercakup ke CISA dalam 72 jam dan pembayaran tebusan dalam 24 jam, tetapi hanya setelah aturan final CISA berlaku. Per Oktober 2026, CISA telah mengirimkan aturan final tersebut ke Gedung Putih untuk ditinjau, dan aturan itu belum dipublikasikan [57]. Pantau aturan final tersebut; aturan itu akan menentukan produsen mana yang tercakup.

### NIS2 dan Cyber Resilience Act untuk operasi di UE

Jika Anda menjalankan pabrik di UE atau menjual mesin di sana, dua undang-undang Eropa juga berlaku. Contoh dari Jerman di bawah ini berasal dari edisi asli panduan ini dalam bahasa Jerman dan menunjukkan bagaimana aturan UE diterapkan dalam praktik.

**NIS2 (contoh: Jerman).** Undang-undang penerapan NIS2 Jerman (NIS2UmsuCG) mulai berlaku pada 6 Desember 2025; Badan Federal untuk Keamanan Informasi Jerman (BSI) kini mengawasi sekitar 29.500 entitas, bukan sekitar 4.500 [28]. Perusahaan termasuk dalam cakupan jika termasuk salah satu jenis entitas dalam Lampiran 1 dan 2 UU BSI serta memenuhi ambang batas dalam Pasal 28: minimal 50 karyawan, atau lebih dari EUR 10 juta baik untuk pendapatan tahunan maupun total neraca [41]. Entri manufaktur dalam Lampiran 2 mencakup perangkat medis, komputer, produk elektronik dan optik, peralatan listrik, mesin, dan kendaraan; bahan kimia dan makanan merupakan sektor tersendiri. Kewajiban utama:

- **Pendaftaran** dalam dua langkah, melalui akun "Mein Unternehmenskonto" dan portal BSI, yang dibuka pada 6 Januari 2026 [28].
- **Manajemen risiko** dengan akuntabilitas di tingkat manajemen.
- **Tindakan teknis dan organisasional**, termasuk keamanan rantai pasok dan autentikasi multifaktor.
- **Pelaporan insiden** untuk insiden signifikan: peringatan dini dalam 24 jam sejak mengetahui, notifikasi insiden dalam 72 jam, dan laporan akhir paling lambat satu bulan setelah notifikasi [41].

Perusahaan harus menilai sendiri apakah mereka termasuk dalam cakupan; BSI tidak memberi tahu mereka. BSI menyediakan pemeriksaan mandiri daring yang tidak mengikat dan merekomendasikan konsultasi hukum dalam kasus yang tidak jelas [41]. Negara anggota UE lainnya memiliki undang-undang penerapan sendiri dengan struktur serupa.

**Cyber Resilience Act.** Jika Anda membuat mesin atau produk dengan elemen digital dan memasarkannya di pasar UE, **Cyber Resilience Act (Regulasi (EU) 2024/2847)** juga berlaku, termasuk bagi produsen AS. Sejak 11 September 2026, produsen wajib melaporkan kerentanan yang dieksploitasi secara aktif dan insiden berat melalui Single Reporting Platform ENISA: peringatan dini dalam 24 jam, notifikasi dalam 72 jam, dan laporan akhir paling lambat 14 hari setelah perbaikan tersedia untuk kerentanan, atau dalam satu bulan untuk insiden [30]. Mulai 11 Desember 2027, produk harus memenuhi persyaratan keamanan siber esensial sebelum ditempatkan di pasar; ini mencakup pengaturan default yang aman, software bill of materials (SBOM), dan pembaruan keamanan selama masa dukungan yang dinyatakan, umumnya minimal lima tahun [42]. Bagi pembuat mesin yang mengirimkan peralatan dengan layanan cloud, TI manufaktur menjadi bagian dari kepatuhan produk.

Untuk arsitektur Azure, NIS2, CSF 2.0 dan CMMC menunjuk ke arah yang sama: inventaris (apa yang terhubung ke cloud?), pencatatan log (siapa mengubah apa, dan kapan?), transparansi rantai pasok (layanan dan mitra apa saja yang terlibat?), serta jalur pelaporan yang sudah dilatih.

### Pemantauan OT setelah penghentian Defender for IoT

Pada 2 November 2026, Microsoft secara resmi mengumumkan di Azure Updates bahwa komponen keamanan OT dari Defender for IoT akan dihentikan sepenuhnya pada Oktober 2029, setelah masa transisi tiga tahun [22]. Hingga saat itu layanan ini menerima pembaruan keamanan dan perbaikan bug tetapi tidak ada fitur OT baru; perjanjian dan perpanjangan yang ada dihormati hingga Oktober 2029 [22]. Kemampuan IoT perusahaan di Defender for Endpoint, serta penemuan perangkat dan penilaian kerentanan, tidak terpengaruh [22]. Tidak ada pengganti dari Microsoft sendiri [39]. Microsoft menawarkan konektor untuk Armis, Dragos dan Forescout yang membawa data aset dan kerentanan OT ke Microsoft Security Exposure Management dan portal Defender; solusi mitra memerlukan lisensi dan penerapan tersendiri [22], [24].

Tanggal yang bertentangan: sebuah blog mitra Microsoft dari November 2026 menyebut **31 Mei 2028** sebagai akhir dukungan untuk keamanan OT [39]. Apakah ini tanggal berbeda untuk jenis kontrak tertentu atau kesalahan belum diklarifikasi pada saat penulisan.

Rekomendasi: jika Anda memperkenalkan pemantauan OT sekarang, evaluasi langsung solusi mitra. Jika Anda menjalankan Defender for IoT, rencanakan penggantiannya agar selesai sebelum pertengahan 2028, dan pastikan tanggal yang berlaku untuk kontrak Anda dengan tim akun Microsoft Anda.

### Daftar periksa keamanan untuk koneksi pabrik pertama

- [ ] Model zona sesuai ISA/IEC 62443 didokumentasikan untuk pabrik
- [ ] Klaster edge berada di zonanya sendiri, hanya koneksi keluar, melalui proxy
- [ ] Endpoint Arc dan Azure diizinkan secara eksplisit di firewall, selainnya diblokir
- [ ] Koneksi OPC UA menggunakan sertifikat; akses tulis dinonaktifkan atau tunduk pada persetujuan
- [ ] Peran Entra ID untuk staf OT dengan hak akses minimum; akses istimewa dibatasi waktu
- [ ] Log dari edge dan cloud dikumpulkan secara terpusat
- [ ] Inventaris aset OT disesuaikan dengan Azure Device Registry
- [ ] Profil CSF 2.0 (saat ini dan target) disusun untuk platform pabrik
- [ ] Ruang lingkup CMMC ditetapkan jika pabrik menangani FCI atau CUI
- [ ] Jalur pelaporan insiden diuji (SEC, CIRCIA setelah berlaku, NIS2 untuk lokasi di UE)
- [ ] Proses pembaruan untuk rilis Azure IoT Operations dan Kubernetes ditetapkan (jendela pemeliharaan disepakati dengan produksi)

---

## Use case 1: Pemeliharaan prediktif di Azure

Pemeliharaan prediktif adalah salah satu use case manufaktur yang paling sering disebut di Azure, dan juga salah satu yang sering gagal dalam tahap pilot. Penyebab umumnya: model datang sebelum data. Kami membahas hal ini lebih dalam dalam episode [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Pisahkan istilah-istilahnya

| Strategi | Pemicu | Data yang dibutuhkan |
|---|---|---|
| Pemeliharaan reaktif | Kegagalan | Tidak ada |
| Pemeliharaan preventif | Interval waktu atau penghitung | Jam operasi, siklus |
| Pemeliharaan berbasis kondisi (condition monitoring) | Ambang batas terlampaui | Variabel kondisi (getaran, suhu, arus) |
| Pemeliharaan prediktif | Perkiraan sisa umur pakai atau probabilitas kegagalan | Variabel kondisi plus riwayat kegagalan yang diberi label plus konteks operasi |
| Pemeliharaan preskriptif | Tindakan yang direkomendasikan | Ditambah pengetahuan tentang penyebab dan tindakan |

Banyak perusahaan sudah memperoleh sebagian besar manfaatnya hanya dengan pemeliharaan berbasis kondisi. Model prediktif baru sepadan ketika kegagalan mahal, cukup sering terjadi, dan secara fisik dapat diketahui sebelumnya. [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) memberikan strategi secara keseluruhan; pilar pemeliharaan otonom dan terencana juga berjalan tanpa AI.

### Prasyarat data

Sebelum melatih model, Anda sebaiknya dapat menjawab ya untuk pertanyaan-pertanyaan berikut:

1. **Apakah ada riwayat kegagalan?** Model supervised membutuhkan kegagalan dengan cap waktu dan jenis kegagalan. Data ini biasanya berada di sistem pemeliharaan (misalnya SAP PM atau CMMS) dan jarang dikodekan dengan rapi.
2. **Apakah cap waktunya tersinkronisasi?** Waktu sensor, waktu pengontrol, dan waktu pencatatan di ERP harus dapat dicocokkan. Bukan kebetulan Microsoft menambahkan pesan kesehatan khusus untuk server NTP yang hilang atau tidak dapat dijangkau pada sensor Defender for IoT [23]; hal yang sama berlaku untuk pipeline data Anda. Konektor OPC UA membawa cap waktu sumber dari setiap nilai [4]; gunakan itu, bukan waktu kedatangan di cloud.
3. **Apakah laju sampling sesuai dengan mode kegagalan?** Kerusakan bantalan terlihat pada spektrum getaran dalam rentang kilohertz; keausan pada pita pemanas terlihat dalam nilai per menit. Tag OPC UA dengan resolusi satu detik cukup untuk yang pertama, tetapi tidak untuk yang kedua.
4. **Apakah konteks operasi tersedia?** Tanpa informasi tentang produk, resep, pesanan, dan status (pergantian produk, produksi, downtime), model akan menganggap setiap pergantian produk sebagai anomali.
5. **Apakah tindakannya sudah ditetapkan?** Siapa yang merespons peringatan, dengan waktu tunggu berapa lama, dan bagaimana hasilnya dilaporkan kembali?

### Enam langkah

1. **Pilih kandidat:** Aset dengan biaya kegagalan tinggi, mode kegagalan yang berulang, dan sensor yang sudah ada. Analisis Pareto atas alasan downtime dari MES akan menghasilkan daftar ini.
2. **Hubungkan data:** Konektor OPC UA di Azure IoT Operations, titik data per aset, alur data ke Fabric [3], [4]. Agregasi data getaran frekuensi tinggi di edge menjadi fitur (RMS, kurtosis, energi pita).
3. **Pemantauan kondisi terlebih dahulu:** Ambang batas dan deteksi anomali sederhana di Eventhouse dan Activator. Activator dapat langsung memberi notifikasi kepada teknisi [17]. Pendekatan ini menghasilkan nilai dalam hitungan minggu, bukan bulan, sekaligus mengumpulkan label.
4. **Buat label:** Lekatkan pesanan pemeliharaan beserta kode kegagalan pada deret waktu. Di sinilah upaya nyata diperlukan. Rencanakan alat untuk itu: Microsoft menghentikan pelabelan data bawaan di Azure Machine Learning pada 30 September 2026 dan mengarahkan ke penyedia pihak ketiga [38]. Untuk label deret waktu dari pemeliharaan, Power App yang menulis kembali ke sistem pemeliharaan sering kali sudah cukup.
5. **Latih model:** Di Fabric Data Science atau Azure Machine Learning; simpan hasilnya di OneLake [17]. Mulailah dengan metode yang dapat diinterpretasikan (gradient boosting pada fitur) sebelum menggunakan deep learning.
6. **Operasionalkan:** Kirim prediksi sebagai event ke dalam proses pemeliharaan (notifikasi di sistem pemeliharaan, pesan Teams, formulir Power Apps untuk umpan balik). Pantau kualitas model dan drift.

### Metrik keberhasilan

Ukur dampak operasional, bukan akurasi model: downtime tidak terencana, mean time between failures (MTBF), mean time to repair (MTTR), proporsi jam pemeliharaan terencana dari total, dan inventaris suku cadang. [KPI](https://www.m365.fm/entity/key-performance-indicator/) ini memerlukan baseline sebelum proyek dimulai; tanpa itu, Anda tidak dapat membuktikan manfaat apa pun. Panduan kami tentang [KPI manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/) membahas definisinya.

### Edge atau cloud untuk inferensi?

| Kriteria | Inferensi di cloud | Inferensi di edge |
|---|---|---|
| Latensi | Detik hingga menit | Milidetik |
| Volume data | Hanya data yang diagregasi yang dikirim | Data mentah tetap di lokasi |
| Operasi | Lebih sederhana (model terpusat) | Deployment terdistribusi, versioning per pabrik |
| Ketahanan | Bergantung pada konektivitas | Berfungsi secara offline |
| Penggunaan tipikal | Remaining useful life, perencanaan pemeliharaan | Shutdown cepat, kualitas inline |

Untuk predictive maintenance klasik, inferensi cloud pada data yang diagregasi sudah cukup dalam sebagian besar kasus. Sejak rilis 2603, Microsoft secara eksplisit memposisikan Azure IoT Operations untuk skenario AI yang lebih dekat dengan mesin ("Physical AI") [6]; untuk inferensi di edge, periksa catatan rilis terkini [7].

### Predictive maintenance di Azure: blok bangunan sekilas

| Langkah | Blok bangunan Azure dan Microsoft | Alternatif |
|---|---|---|
| Kumpulkan data | Azure IoT Operations (konektor OPC UA, data flow) [3], [4] | IoT Hub untuk sensor yang terhubung langsung [36] |
| Simpan dan analisis deret waktu | Fabric Eventhouse dengan KQL [17] | Azure Data Explorer [19] |
| Ambang batas dan peringatan | Fabric Activator [17] | Azure Monitor atau logika kustom |
| Latih model | Fabric Data Science, Azure Machine Learning [17], [37] | Aplikasi milik pembuat mesin |
| Picu tindakan | Power Automate, Teams, Power Apps, sistem pemeliharaan | API langsung ke CMMS |

---

## Kasus penggunaan 2: Keterlacakan dan silsilah

Keterlacakan menjawab pertanyaan "Di mana bagian ini dipasang, dan dibuat dari apa?". Silsilah (genealogy) menggambarkan rantai asal lengkap sebuah produk, mencakup material, lot, langkah proses, mesin, parameter, hasil inspeksi, dan operator. Di industri yang diatur, hal ini wajib; di tempat lain, hal ini mempercepat penanganan keluhan dan mempersempit cakupan penarikan produk (recall). Episode [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) membahas topik ini secara mendalam.

### Persyaratan menurut industri

| Industri / aturan | Persyaratan data inti | Catatan |
|---|---|---|
| Pangan, FDA Food Traceability Rule (FSMA Section 204) | Elemen data kunci (key data elements, KDE) untuk setiap peristiwa pelacakan kritis (critical tracking event, CTE) seperti penerimaan, transformasi, dan pengiriman, yang ditautkan dengan kode lot keterlacakan; catatan diserahkan kepada FDA dalam 24 jam sejak permintaan, ditambah spreadsheet elektronik yang dapat diurutkan selama wabah atau penarikan produk | [59]; FDA tidak akan menegakkan aturan sebelum 20 Juli 2028 sesuai arahan Kongres (tanggal semula 20 Januari 2026) |
| Perangkat medis, FDA QMSR (21 CFR Part 820) | Sejak 2 Februari 2026, Quality Management System Regulation memasukkan ISO 13485:2016 sebagai acuan, termasuk persyaratan identifikasi dan keterlacakannya | [61] |
| Catatan elektronik yang diatur FDA, 21 CFR Part 11 | Jejak audit yang aman, dihasilkan komputer, dan diberi cap waktu, yang merekam entri dan perubahan operator tanpa menutupi entri sebelumnya, disimpan selama catatan tersebut ada | [60]; relevan untuk farmasi, perangkat medis, dan catatan pangan yang disimpan secara elektronik |
| Otomotif, IATF 16949 | Klausul 8.5.2.1 melengkapi persyaratan identifikasi dan keterlacakan ISO 9001 (termasuk rencana keterlacakan berdasarkan analisis risiko); Klausul 7.5.3.2.1 mengatur penyimpanan catatan tertentu, yang umumnya dibaca sebagai masa pasokan produksi dan suku cadang servis ditambah satu tahun kalender kecuali pelanggan atau regulator mensyaratkan lain | Teks standar berbayar; rincian dari sumber sekunder. Persyaratan khusus pelanggan OEM (customer-specific requirements, CSR) sering kali lebih ketat |
| Dirgantara, AS9100D (EN 9100 di Eropa, JIS Q 9100 di Jepang) | Keterlacakan sepanjang siklus hidup produk, identifikasi konfigurasi, dan kemampuan melacak produk yang dibuat dari lot bahan baku atau batch produksi yang sama | AS9100D (2016) adalah revisi terkini; EN 9100 adalah edisi Eropa yang setara secara teknis [62]. Kutipan klausul (8.5.2) belum diperiksa terhadap teks standar asli |
| Baterai yang dijual di UE, EU Battery Regulation (Regulation (EU) 2023/1542) | Paspor baterai elektronik mulai 18 Februari 2027 untuk baterai traksi kendaraan listrik, baterai moda transportasi ringan (misalnya sepeda listrik, skuter listrik), dan baterai industri di atas 2 kWh | [29]; jadwal menurut Komisi Eropa bersifat indikatif; relevan bagi eksportir AS ke UE |
| Produk yang dijual di UE berdasarkan Ecodesign Regulation (ESPR, Regulation (EU) 2024/1781) | Paspor produk digital bergantung pada delegated act; registri DPP UE beroperasi sejak 20 Juli 2026 (awalnya dengan lingkungan uji); delegated act untuk besi dan baja direncanakan pada Q4 2026, tekstil, aluminium, dan ban pada 2027; minimal 18 bulan masa transisi setelah delegated act diadopsi | [29]; jadwal menurut Komisi Eropa bersifat indikatif |

Untuk dirgantara, Mirko Peters menjelaskan dalam tulisannya [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) mengapa lead time dan keterlacakan sangat terkait di sana; panduan kami tentang [perencanaan produksi dirgantara](https://www.m365.fm/en/learn/aerospace-production-planning/) membahas konteks AS9100, FAA, dan kontrol ekspor.

### Model data silsilah

Silsilah yang andal memerlukan tiga jenis hubungan:

1. **Material-dalam-material:** Lot A dan komponen B masuk ke perakitan C (referensi BOM, nomor seri atau lot).
2. **Material-ke-proses:** Perakitan C diproses pada operasi 30 di stasiun 20 dengan set parameter X oleh shift Y.
3. **Proses-ke-hasil:** Operasi 30 menghasilkan hasil inspeksi Z dan, jika ada, ketidaksesuaian (nonconformance).

Hubungan-hubungan ini membentuk sebuah graf. Anda dapat merepresentasikannya di Fabric sebagai struktur tabel di Lakehouse dan menelusurinya dengan KQL atau SQL, atau memodelkannya sebagai graf dalam digital twin (ontologi Fabric atau Azure Digital Twins) [14], [16]. Yang penting adalah identifikasi terjadi di sumbernya: pemindaian, RFID, atau kode Data Matrix di stasiun, yang dikaitkan dengan peristiwa pesanan di UNS.

### Implementasi di Azure

- **Tangkap peristiwa di edge:** Pemindai dan stasiun mempublikasikan "bagian X dimulai/selesai di stasiun Y" ke broker MQTT Azure IoT Operations [3]. Parameter proses masuk melalui konektor OPC UA [4]; "dataset triggering" memungkinkan satu titik data memicu publikasi titik-titik data lainnya, misalnya "siklus selesai" [4].
- **Satukan konteks:** Di Fabric, peristiwa-peristiwa tersebut digabungkan dengan data pesanan dan BOM dari ERP dan MES [17].
- **Pastikan tidak dapat diubah:** Catatan regulasi memerlukan penyimpanan yang tidak dapat diubah atau setidaknya log perubahan yang dapat mendeteksi manipulasi (untuk catatan yang diatur FDA, persyaratan jejak audit Part 11 [60]). Kebijakan immutability OneLake saat ini hanya berlaku untuk log diagnostik, bukan data bisnis [43]. Untuk arsip ketelusuran yang tahan audit, tambahkan Azure Blob Storage dengan kebijakan penyimpanan tidak dapat diubah (WORM); Fabric tetap menjadi lapisan analitik.
- **Sediakan kueri:** Kueri yang umum adalah pelacakan maju (produk jadi mana yang mengandung lot A?) dan pelacakan mundur (terbuat dari apa nomor seri S?). Laporan Power BI atau Power App untuk jaminan kualitas membuat kueri ini dapat digunakan tanpa keterampilan KQL. Berdasarkan FSMA 204, kemampuan mengekspor spreadsheet yang dapat diurutkan dalam 24 jam [59] merupakan uji penerimaan yang konkret untuk lapisan ini.

### Dari catatan ketelusuran ke paspor produk digital

Paspor produk digital pada dasarnya adalah ekstrak genealogi Anda yang dapat diakses dari luar, ditambah data keberlanjutan dan material. Jika Anda membangun genealogi yang bersih saat ini, Anda telah menyelesaikan pekerjaan dasar yang paling berat. Pastikan identifikator bersifat unik dan permanen, dan bahwa Anda dapat memisahkan data mana yang bersifat publik, mana yang untuk regulator, dan mana yang hanya internal.

---

## Use case 3: Digital twin

Istilah [digital twin](https://www.m365.fm/entity/digital-twin/) digunakan untuk hal-hal yang sangat berbeda: mulai dari model 3D, model simulasi, hingga representasi langsung sebuah pabrik. Untuk keperluan arsitektur, perbedaan ini membantu. Panduan kami tentang [digital twin dalam manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/) melampaui sudut pandang Azure.

### Tiga jenis twin

| Jenis | Pertanyaan | Data | Alat di ekosistem Microsoft |
|---|---|---|---|
| **Information twin** | Apa yang ada di mana, dan bagaimana keterhubungannya? | Hierarki aset, relasi, status langsung | Fabric digital twin builder (pratinjau) [15], ontologi Fabric IQ (pratinjau) [16], Azure Digital Twins [14] |
| **Simulation twin** | Apa yang terjadi jika …? | Logika proses, waktu, kapasitas, perilaku saat gangguan | Aplikasi industri untuk simulasi aliran material dan proses, mungkin di atas infrastruktur Azure |
| **Engineering twin** | Bagaimana produk atau mesin berperilaku secara fisik? | CAD, CAE, logika kontrol | PLM/CAE di Azure; Microsoft mencantumkan panduan arsitektur untuk Siemens NX di Azure Virtual Desktop dengan VM GPU dan Ansys Discovery di VM GPU, antara lain [2] |

[Virtual commissioning](https://www.m365.fm/entity/virtual-commissioning/) menghubungkan engineering twin dan simulation twin: kode kontrol diuji terhadap model pabrik sebelum peralatan nyata tersedia.

### Azure Digital Twins atau Fabric?

Microsoft sendiri menegaskan bahwa digital twin builder di Fabric adalah produk yang berbeda dari Azure Digital Twins [14], [15]. Perbedaan praktisnya:

| Kriteria | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Status | Aktif, tanpa pemberitahuan penghentian di halaman ikhtisar [14] | Pratinjau [15] |
| Pemodelan | DTDL (Digital Twins Definition Language), versi 3 [14] | Ontologi dengan tipe entitas dan relasi [15] |
| Penyimpanan | Graf twin sendiri; riwayat melalui data history ke Azure Data Explorer [14] | OneLake; data harus terlebih dahulu berada di lakehouse Fabric [15] |
| Integrasi | Rute peristiwa ke Event Hubs, Event Grid, Service Bus [14] | Asli di Fabric Real-Time Intelligence, Power BI |
| Audiens | Tim pengembang, berpusat pada API | Tim data dan bisnis, low-code |
| Visualisasi | 3D Scenes Studio (pratinjau) [14] | Pengalaman Fabric, Power BI |

**Rekomendasi:** Jika platform data Anda adalah Fabric dan Anda memerlukan kembaran analitis untuk KPI dan analisis akar masalah, pantau digital twin builder dan ontologi Fabric IQ serta lakukan pilot terhadapnya, tetapi jangan membuat model data Anda bergantung pada fitur pratinjau. Microsoft belum mendokumentasikan bagaimana dua komponen Fabric tersebut akan berkembang satu terhadap yang lain; ontologi sudah pernah mengalami satu perubahan pengalaman dengan migrasi wajib [16]. Jika Anda saat ini membangun aplikasi kembaran produksi berbasis API, Azure Digital Twins adalah layanan yang tersedia secara umum (generally available). Apa pun pilihannya, simpan salinan ontologi Anda dalam format yang tidak bergantung pada alat tertentu.

### Dari mana memulai?

Kesalahan yang paling umum adalah memulai dengan visualisasi 3D. Mulailah dengan pertanyaan yang harus dijawab oleh kembaran, misalnya "Pesanan mana saja yang terdampak jika stasiun 20 mati?". Pertanyaan itu menentukan entitas dan relasi yang Anda butuhkan. Mirko Peters menjelaskan pendekatan ini dalam [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) dan jalur dari ERP ke kembaran lantai produksi dalam [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Kami membahas implementasi teknisnya di Azure dalam episode [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Use case 4: KPI real-time, OEE dan value stream

KPI real-time sering kali menjadi cara tercepat untuk memperoleh nilai dari koneksi lantai produksi. KPI ini tidak memerlukan AI, tetapi memerlukan model status yang bersih.

### Menghitung OEE dengan benar

Overall equipment effectiveness (OEE) adalah hasil kali ketersediaan, kinerja, dan kualitas. Rumusnya sederhana; definisinya tidak:

- **Ketersediaan:** Henti mana yang dihitung sebagai terencana (istirahat, perawatan terencana, tidak ada pesanan)? Keputusan ini dapat menggeser OEE hingga banyak poin persentase.
- **Kinerja:** Waktu siklus mana yang menjadi acuan: nilai desain, waktu siklus terbaik yang pernah dicapai, atau standar di ERP?
- **Kualitas:** Apakah pengerjaan ulang dihitung sebagai bagian baik atau bagian buruk?

Sepakati definisi-definisi ini di seluruh pabrik sebelum Anda membangun dasbor. Jika tidak, pabrik-pabrik akan membandingkan angka yang tidak sebanding.

### Arsitektur untuk KPI real-time

1. Status mesin dan penghitung part mengalir melalui OPC UA ke broker [4].
2. Sebuah data flow memetakan status ke model status yang seragam (pemetaan kode khusus mesin) [3].
3. Eventhouse menghitung KPI bergulir per stasiun, lini, dan shift dengan KQL.
4. Real-Time Dashboard melayani lantai produksi; Power BI melayani laporan manajemen [17].
5. Activator memicu peringatan ketika nilai turun di bawah ambang batas [17].

### Value stream sebagai model data langsung

Value stream mapping secara tradisional adalah latihan di atas kertas. Jika Anda menghubungkan kotak-kotak proses dalam sebuah value stream ke data langsung, Anda memperoleh model data yang sederhana namun efektif: lead time, persediaan antarproses, waktu siklus, dan bottleneck menjadi dapat diukur. Episode [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) menunjukkan cara kerjanya dalam praktik. Untuk penjadwalan rinci berdasarkan data ini, sistem [advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) berperan; lihat panduan kami tentang [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/). Bagaimana angka-angka ini digunakan dalam rapat tier harian menjadi bahasan panduan [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) kami.

### Katalog KPI awal

| KPI | Sumber data | Granularitas |
|---|---|---|
| OEE dan faktor-faktornya | Status mesin, penghitung, temuan kualitas | Stasiun, shift |
| Lead time | Event pesanan (mulai/selesai per operasi) | Pesanan, produk |
| Work in process | Posting persediaan, pemindaian | Buffer, lini |
| On-time delivery | ERP (tanggal diminta vs. tanggal aktual) | Pelanggan, kelompok produk |
| MTBF / MTTR | Downtime, order perawatan | Aset |
| Energi per bagian baik | Meter energi, jumlah part | Lini, produk |
| First pass yield | Hasil inspeksi | Operasi |

---

## Integrasi ERP dan MES

Data lantai produksi tanpa konteks pesanan dan material hanyalah pengukuran, bukan informasi. Integrasi dengan ERP dan MES menentukan nilai keseluruhan platform.

### Sistem mana yang menjadi system of record?

| Objek data | System of record (umumnya) | Peran platform Azure |
|---|---|---|
| Material, BOM, routing | ERP / PLM | Salinan untuk pengayaan, tanpa pemeliharaan |
| Pesanan produksi (perencanaan) | ERP / APS | Salinan; umpan balik status sebagai event |
| Eksekusi operasi, konfirmasi | MES | Event di UNS, riwayat di Fabric |
| Status mesin, nilai proses | Controller / edge | Sumber data primer |
| Pesanan pemeliharaan | Pemeliharaan ERP / CMMS | Dipicu oleh prediksi, riwayat untuk label |
| Temuan kualitas | QMS / MES | Ditautkan dengan data proses |

### Integrasi SAP

Ada beberapa cara membawa data SAP ke Fabric: konektor Data Factory, solusi open mirroring dari mitra, dan "SAP Business Data Cloud Connect for Microsoft Fabric", yang dimaksudkan agar produk data SAP tersedia di OneLake tanpa disalin; ketersediaan umum untuk yang terakhir diumumkan pada kuartal ketiga 2026 [44]. Kami tidak dapat memastikan ketersediaan umum yang sebenarnya pada saat penulisan [unverified: belum ada konfirmasi dari sumber resmi]; periksa status terkini dan persyaratan lisensi di sisi SAP sebelum Anda merencanakan. Untuk integrasi lantai produksi dengan SAP Digital Manufacturing, DSAG (grup pengguna SAP berbahasa Jerman) menerbitkan panduan "SAP DM Shopfloor Integration" pada April 2026; halaman ringkasannya tersedia dalam bahasa Inggris. Menurut pengantarnya, panduan ini mencakup arsitektur, struktur dan model data, penskalaan, templat, model operasi, dan pengadaan; teks lengkapnya hanya untuk anggota DSAG [48]. Aturan dasarnya: konfirmasi masuk ke SAP melalui MES atau API yang telah ditentukan, bukan langsung dari platform data.

### Dynamics 365

Jika Anda menggunakan Dynamics 365 Supply Chain Management, Anda diuntungkan oleh kedekatannya dengan ekosistem Microsoft: dengan "Link to Microsoft Fabric", data Dataverse, termasuk tabel keuangan dan operasi tertentu, dapat tersedia di Fabric tanpa pipeline ETL sendiri [45]. Microsoft menggambarkan penawaran manufakturnya sebagai kombinasi kemampuan Dynamics 365, Microsoft 365, dan Azure [1].

### Historian dan SCADA yang sudah ada

Banyak pabrik di AS sudah menjalankan process historian di samping SCADA. Perlakukan sebagai sumber, bukan sesuatu yang harus dicabut: historian tetap melayani operator dan insinyur proses secara lokal, sementara platform Azure mengambil sinyal mentah dari lapisan OPC UA atau data yang telah dikurasi dari historian. Tentukan per sinyal jalur mana yang menjadi system of record untuk riwayat, agar Anda tidak menyimpan dan membayar deret waktu yang sama dua kali, dan periksa dengan vendor historian antarmuka serta lisensi mana yang berlaku sebelum merancang alur data.

### Alur data lantai produksi ke ERP

Pola umum:

1. ERP merilis pesanan; event "order released" masuk ke UNS.
2. MES memulai operasi; event "operation started" memuat stasiun dan pesanan.
3. Data mesin diperkaya dalam alur data dengan nomor pesanan yang berlaku.
4. MES mengonfirmasi kuantitas dan waktu; ERP membukukannya.
5. Fabric menggabungkan semua event menjadi riwayat pesanan yang lengkap untuk analitik dan genealogi.

---

## AI dan Copilot dalam manufaktur

AI generatif telah masuk ke manufaktur, tetapi dengan cara yang berbeda dari yang diperkirakan pada 2024. Microsoft menghentikan pratinjau agen khusus manufaktur (Factory Operations Agent, Factory Safety Agent) pada 2025 [2] dan sebagai gantinya mengandalkan komponen dasar platform yang bersifat umum: Microsoft Foundry untuk agen dan model [20], Copilot in Fabric untuk pertanyaan tentang data [17], serta Copilot Studio dan Microsoft 365 Copilot untuk skenario kerja. Pada Ignite 2025, Fabric IQ dan Foundry IQ hadir sebagai pratinjau, masing-masing dimaksudkan untuk memberi agen lapisan semantik dan basis pengetahuan [34]. Pandangan siklus hidup juga berlaku di sini: prompt flow, alat yang banyak dipakai untuk aplikasi LLM awal di Foundry dan Azure Machine Learning, dihentikan pada 20 April 2027; Microsoft menyarankan migrasi ke Microsoft Agent Framework [37].

### Skenario yang realistis

| Skenario | Komponen dasar | Prasyarat |
|---|---|---|
| Pertanyaan dalam bahasa alami tentang data produksi ("Mengapa lini 3 lebih lambat kemarin?") | Copilot in Fabric, Fabric data agents, ontology [16], [17] | Model data yang bersih, nama tabel dan kolom yang mudah dipahami, KPI yang terdefinisi |
| Meringkas serah terima shift dan laporan insiden | Microsoft 365 Copilot, Teams, Copilot Studio | Pencatatan terstruktur, misalnya melalui formulir Power Apps atau Teams |
| Asisten pemeliharaan (mencari manual dan riwayat kerusakan) | Microsoft Foundry dengan retrieval, Copilot Studio | Dokumen digital dan mutakhir, izin akses terpelihara |
| Inspeksi kualitas visual | Model computer vision, inferensi di edge | Data gambar yang dilabeli (alat pelabelan pihak ketiga, karena data labeling Azure ML telah dihentikan [38]), pencahayaan yang stabil |
| Asisten perencanaan (membandingkan skenario) | Aplikasi industri (APS, simulasi) ditambah AI | Model perencanaan yang valid |

### Microsoft 365 sebagai jembatan ke lantai produksi

Bagi organisasi yang sudah menjalankan Microsoft 365, peluang jangka pendek terbesar sering kali bukan di Azure, melainkan dalam menghubungkan peristiwa di lantai produksi dengan lingkungan kerja:

- **Teams untuk pekerja lini depan:** Komunikasi shift, tugas, notifikasi dari Activator atau Power Automate langsung di Teams [17].
- **Power BI:** Laporan KPI untuk manajemen dan pimpinan pabrik, dibangun di atas data Fabric yang sama.
- **Power Apps:** Mencatat alasan downtime, temuan kualitas, dan umpan balik pemeliharaan di tablet pada stasiun kerja. Ini menghasilkan label yang tepat dibutuhkan pemeliharaan prediktif.
- **Copilot:** Ringkasan laporan shift, analisis penyimpangan, dan catatan rapat dari manajemen lantai produksi.
- **Atur lisensi sejak awal:** Karyawan lantai produksi biasanya mendapat lisensi frontline (Microsoft 365 F1 atau F3). Periksa sebelum peluncuran kemampuan apa saja yang disertakan, seperti Power Apps atau Copilot, dan lisensi add-on apa yang Anda perlukan; jika tidak, pilot yang baik akan macet saat diperluas.

### Batasan dan tata kelola

- **Tidak ada keputusan kendali oleh model bahasa.** Model bahasa termasuk dalam bantuan, bukan dalam loop kendali tertutup sebuah mesin.
- **Gunakan kerangka kerja risiko.** **NIST AI Risk Management Framework (AI RMF 1.0)**, dirilis pada 26 Januari 2023, adalah kerangka sukarela yang disusun di sekitar empat fungsi: Govern, Map, Measure dan Manage [63]. Ini adalah cara praktis untuk mendokumentasikan risiko AI dalam inspeksi kualitas atau perencanaan bagi pelanggan dan auditor.
- **EU AI Act untuk operasi di UE:** Jika Anda menjalankan sistem AI di pabrik UE atau menjual produk berkemampuan AI di sana, periksa apakah sebuah sistem digunakan sebagai komponen keselamatan suatu produk atau untuk mengelola pekerja; kewajiban risiko tinggi dapat berlaku. "Digital Omnibus on AI" (Regulation (EU) 2026/1744, berlaku sejak akhir Juli 2026) menunda tenggat ini: hingga 2 Desember 2027 untuk sistem risiko tinggi yang berdiri sendiri (misalnya di SDM) dan hingga 2 Agustus 2028 untuk sistem yang tertanam dalam produk. AI pada mesin akan diatur melalui delegated acts berdasarkan EU Machinery Regulation [46]. Klasifikasi sistem spesifik Anda memerlukan tinjauan hukum.
- **Tenaga kerja dan hubungan industrial:** Sistem yang dapat menilai kinerja atau perilaku karyawan menimbulkan pertanyaan ketenagakerjaan. Di pabrik AS yang berserikat, periksa apakah perjanjian kerja bersama Anda mencakup pemantauan kinerja; di pabrik Jerman, sistem semacam itu umumnya memerlukan persetujuan dewan pekerja (Betriebsrat), yang memiliki hak co-determination. Libatkan perwakilan pekerja sejak dini dalam kedua kasus.
- **Izin akses:** Copilot menampilkan apa yang boleh dilihat pengguna. Pembagian yang terlalu luas di SharePoint atau Fabric menjadi terlihat melalui AI.

---

## FinOps untuk TI manufaktur

Biaya cloud di manufaktur berperilaku berbeda dibandingkan beban kerja TI klasik: volume data bertambah seiring setiap mesin yang terhubung, beban kerja berjalan sepanjang waktu, dan sebagian infrastrukturnya berada di pabrik. FinOps membantu membuat biaya ini dapat diprediksi dan dikaitkan dengan nilai. Episode [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) membahas kekhususannya.

### Ringkasan FinOps Framework

Microsoft mendasarkan panduan FinOps-nya pada kerangka kerja FinOps Foundation [25]. Kerangka kerja ini terdiri dari enam prinsip (di antaranya "Teams need to collaborate", "Business value drives technology decisions" dan "Take advantage of the variable cost model of the cloud"), tiga fase siklus hidup (Inform, Optimize, Operate) dan empat domain [25]:

| Domain | Artinya untuk manufaktur |
|---|---|
| Understand usage and cost | Buat biaya per pabrik, lini dan kasus penggunaan terlihat (tagging, kapasitas atau workspace Fabric terpisah) |
| Quantify business value | Biaya per part yang baik, per mesin terhubung, atau per jam downtime yang dihindari |
| Optimize usage and cost | Kurangi volume data di edge, atur tingkatan retensi, sesuaikan ukuran kapasitas |
| Manage the FinOps practice | Tanggung jawab, kebijakan, chargeback ke pabrik |

Kerangka kerja ini merekomendasikan penilaian tingkat kematangan per kapabilitas, bukan secara menyeluruh, dan peninjauan setiap tiga hingga enam bulan [25].

### Sepuluh pengungkit biaya terpenting

1. **Agregasi di edge:** Tidak setiap nilai dengan resolusi satu detik perlu dikirim ke cloud. Alur data dapat menyaring dan mengagregasi [3]. Ini merupakan pengungkit tunggal terbesar.
2. **Kirim saat berubah:** Secara default, konektor OPC UA hanya mengirim nilai yang berubah dan menambahkan key frame berkala dengan semua nilai agar konsumen dapat memulihkan keadaan [4]. Periksa juga deadband di controller atau server OPC UA agar noise tidak dihitung sebagai perubahan.
3. **Konsolidasikan Eventstream:** Per pabrik, bukan per sumber, dengan transformasi di Eventhouse [31].
4. **Atur tingkatan retensi:** Data panas di cache Eventhouse selama hari atau minggu, data lama di penyimpanan OneLake.
5. **Ukur kapasitas Fabric dengan sengaja:** Pantau pemanfaatan dengan aplikasi Capacity Metrics, pisahkan beban kerja pengembangan dan produksi, jeda kapasitas yang tidak Anda butuhkan. Penjedaan didokumentasikan untuk SKU F; saat dijeda, kelebihan pemakaian yang terakumulasi langsung ditagihkan dan konten kapasitas tidak tersedia [47]. Kapasitas yang melayani Eventstream atau dasbor pabrik karena itu bukan kandidat untuk dijeda.
6. **Pilih SKU edge yang tepat:** Sejak rilis 2610, Azure IoT Operations menawarkan SKU Essentials berbiaya lebih rendah untuk penerapan bervolume tinggi di samping Standard, terbatas pada klaster node tunggal dan tanpa konektor OPC UA [3]. Misalnya, ini cocok untuk lokasi yang datanya sudah masuk melalui MQTT atau HTTP. Periksa per lokasi fitur apa saja yang benar-benar Anda perlukan.
7. **Gunakan reservasi dan savings plan** untuk sumber daya Azure yang berjalan terus-menerus.
8. **Alokasikan biaya:** Terapkan tag untuk pabrik, pusat biaya, dan kasus penggunaan (Azure Policy).
9. **Terapkan unit economics:** Laporkan biaya cloud per unit yang diproduksi atau per mesin terhubung. Hanya dengan cara itu pabrik dapat dibandingkan.
10. **Hentikan layanan lama:** Migrasikan layanan yang akan dihentikan (IoT Central, IoT Edge 1.5) sebelum struktur paralel menggandakan biaya Anda.

### Jangan lupakan biaya edge

Perangkat keras pabrik, operasi Kubernetes, lisensi untuk layanan yang diaktifkan Azure Arc, dan staf untuk pembaruan termasuk dalam perhitungan yang sama. Studi kelayakan yang hanya melihat tagihan Azure secara sistematis meremehkan total biaya. Panduan ini sengaja tidak mencantumkan harga karena sering berubah; Anda dapat menemukan model harga terkini untuk Azure IoT Operations (Standard dan Essentials), Azure Arc, dan Azure Local di halaman harga Azure dan di kalkulator harga Azure.

---

## Menyusun business case untuk Azure di manufaktur

Klaim manfaat secara umum dari studi industri jarang membantu Anda mendapatkan persetujuan anggaran, karena klaim tersebut tidak mengetahui titik awal Anda. Logika perhitungan yang Anda isi dengan angka Anda sendiri jauh lebih kuat.

### Kategori manfaat

| Kategori | Perhitungan | Sumber data |
|---|---|---|
| Penghindaran downtime tak terencana | Jam downtime × margin kontribusi per jam × pengurangan yang diharapkan | Riwayat downtime MES, keuangan |
| OEE yang lebih tinggi | Tambahan part baik × margin kontribusi per part | Baseline OEE |
| Pengurangan biaya scrap dan rework | Jumlah scrap × biaya manufaktur × pengurangan | QMS |
| Penanganan keluhan yang lebih cepat | Jam per keluhan × tarif per jam × pengurangan; cakupan recall yang lebih kecil | Riwayat keluhan |
| Biaya pemeliharaan | Persediaan suku cadang, layanan kontraktor, lembur | Pemeliharaan ERP |
| Kepatuhan | Upaya yang dihindari untuk bukti manual (audit, permintaan FSMA 204, penilaian CMMC, DPP) | Tim kualitas dan kepatuhan |

### Kategori biaya

- Perangkat keras edge dan operasinya per pabrik
- Konsumsi Azure dan Fabric (berkelanjutan)
- Lisensi (Power BI, Copilot, aplikasi industri, keamanan OT bila diperlukan)
- Implementasi (internal dan eksternal)
- Manajemen perubahan dan pelatihan
- Retrofit sensor untuk mesin lama

### Contoh perhitungan dengan angka fiktif

Sebuah lini memiliki 120 jam downtime tak terencana per tahun, dan margin kontribusinya adalah $1.600 per jam. Jika condition monitoring dan respons yang lebih cepat menghindari 20 persen dari jam tersebut, itu berarti 24 jam × $1.600 = $38.400 per tahun. Di sisi lain ada biaya yang dialokasikan: perangkat keras edge dan operasinya, konsumsi Fabric, lisensi, dan jam kerja internal. Angkanya sengaja dibuat sederhana. Yang penting adalah setiap asumsi memiliki sumber di dalam perusahaan Anda (riwayat MES, keuangan) dan Anda mengukur pengurangan terhadap baseline setelah tiga hingga enam bulan.

### Aturan praktis untuk prioritas

Mulailah dari kasus penggunaan yang memenuhi tiga kondisi: baseline yang dapat diukur, data yang tersedia, dan pemilik proses yang ingin memanfaatkan hasilnya. Itu lebih sering berupa OEE real-time atau traceability daripada pemeliharaan prediktif.

---

## Peta jalan: lima fase menuju platform manufaktur Azure yang dapat diskalakan

Peta jalan di bawah mengikuti pola umum "fondasi dan satu kasus penggunaan percontohan lebih dulu, kemudian skalakan". Durasinya adalah panduan untuk pabrik pertama dan sangat bergantung pada titik awal Anda, persetujuan jaringan, dan sumber daya.

### Fase 1: Kejelasan (4 hingga 8 minggu)

- Portofolio kasus penggunaan dengan estimasi manfaat; pilih satu atau dua kasus penggunaan percontohan
- Kondisi saat ini: kumpulan mesin, protokol (apakah OPC UA tersedia?), jaringan, sistem yang ada
- Model data target (hierarki ISA-95, konvensi topik UNS)
- Konsep keamanan yang mencakup keamanan OT, profil CSF 2.0, cakupan CMMC bila relevan, privasi dan perwakilan pekerja
- Pemeriksaan siklus hidup semua layanan terhadap tabel status dalam panduan ini

### Fase 2: Fondasi (6 hingga 12 minggu)

- Infrastruktur edge di pabrik percontohan, koneksi Arc, Azure IoT Operations
- Struktur workspace Fabric, perencanaan kapasitas, model akses
- Mesin pertama terhubung melalui OPC UA, aset di Azure Device Registry
- Dasar FinOps: tag, anggaran, laporan biaya per pabrik

### Fase 3: Nilai pertama (8 hingga 12 minggu)

- Kasus penggunaan percontohan di produksi, misalnya OEE real-time dengan pencatatan alasan downtime di Power App
- Dasbor lantai produksi dan laporan manajemen
- Baseline dan pengukuran dampak pertama

### Fase 4: Pendalaman (3 hingga 6 bulan)

- Konteks ERP dan MES terintegrasi, riwayat pesanan dan genealogi
- Condition monitoring, pengumpulan label untuk pemeliharaan prediktif
- Skenario Copilot pertama pada data yang dikurasi

### Fase 5: Penskalaan (dari bulan ke-9 hingga ke-15, tergantung kemajuan)

- Penerapan ke lebih banyak lini dan pabrik dengan infrastructure as code dan GitOps
- KPI lintas pabrik dengan definisi yang seragam
- Pemeliharaan prediktif untuk aset terpilih, skenario digital twin
- Model operasi: tim platform, pemilik produk data per domain, manajemen rilis untuk rilis Azure IoT Operations yang umumnya bulanan [7]

Pergeseran kuncinya adalah dari proof of concept ke minimum viable product: PoC membuktikan bahwa teknologinya bekerja. MVP membuktikan bahwa orang bekerja lebih baik dengannya. Jika Anda ingin menjangkarkan pergeseran ini dalam program peningkatan yang lebih luas, lihat panduan kami tentang [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) dan [operational excellence](https://www.m365.fm/en/learn/operational-excellence/).

---

## Kesalahan umum dalam proyek manufaktur Azure

1. **Teknologi sebelum pertanyaan:** Membangun platform tanpa unit bisnis yang ingin menyelesaikan masalah spesifik.
2. **Preview sebagai fondasi:** Menempatkan logika bisnis pada layanan preview. Penghentian Manufacturing data solutions dan factory agents menunjukkan risikonya [2].
3. **Blok pembangun usang dari panduan lama:** Merencanakan proyek baru dengan IoT Central, Time Series Insights, atau IoT Edge 1.5 karena artikel dari 2021 merekomendasikannya [8], [10], [12].
4. **SKU yang salah:** Merencanakan Azure IoT Operations Essentials untuk pabrik dengan mesin OPC UA, padahal SKU tersebut tidak menyertakan konektor OPC UA [3].
5. **Tidak ada model status:** Mengambil alih kode status khusus mesin tanpa penyaringan. Perbandingan antarpabrik menjadi tidak mungkin.
6. **Semuanya ke cloud:** Mengirim data mentah dengan resolusi penuh lalu terkejut dengan tagihannya.
7. **Keamanan OT sebagai pemikiran belakangan:** Menempatkan klaster edge di jaringan tanpa konsep zona dan membiarkan akses tulis ke controller terbuka.
8. **Lupa label:** Memulai pemeliharaan prediktif tanpa riwayat kegagalan yang terstruktur.
9. **KPI tanpa definisi:** Membangun dasbor OEE sebelum pabrik-pabrik menyepakati definisi ketersediaan.
10. **Meremehkan operasional:** Rilis rutin, pembaruan Kubernetes, rotasi sertifikat, dan buffer broker yang hanya dapat diatur pada penerapan awal [40], tanpa ada yang bertanggung jawab.
11. **Meninggalkan orang-orang:** Karyawan lantai produksi baru mengetahui proyek ini ketika tablet dipasang di stasiun kerja mereka.
12. **Mengabaikan cakupan kepatuhan:** Memasukkan gambar atau spesifikasi untuk suku cadang pertahanan ke ruang kerja Fabric bersama tanpa keputusan penentuan cakupan CMMC.

---

## Aplikasi industri dalam ekosistem Microsoft

> **Catatan: Penulis bekerja di iFAKT GmbH.**

Platform yang dibangun di atas Azure IoT Operations dan Fabric menyediakan data, tetapi tidak menyediakan logika bisnis untuk perencanaan, aliran nilai, atau simulasi. Aplikasi industri yang tersedia melalui Microsoft AppSource atau Microsoft Marketplace mengisi celah tersebut.

Salah satu contohnya adalah [Polaris](https://www.m365.fm/entity/polaris/) dari [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), sebuah perusahaan perangkat lunak yang berkantor pusat di Stuttgart, Jerman. Vendor menggambarkan Polaris sebagai perangkat lunak untuk mendigitalkan, mensimulasikan, dan mengoptimalkan produksi, dengan modul VSM/BSM (pemodelan aliran nilai dan swimlane), Simulator, Optimizer (perencanaan), Operator, dan Analyzer (analisis KPI). Menurut vendor, perencanaan bersifat berbasis kendala dan memperhitungkan sumber daya, kualifikasi, shift, dan buffer; sebuah KPI cockpit menampilkan lead time, persediaan, utilisasi, dan ketepatan waktu pengiriman. Polaris VSM terdaftar sebagai penawaran SaaS di Microsoft Marketplace [33]; Microsoft menampilkan iFAKT sebagai bagian dari program "ISV Success for Business Applications" [32]. Panduan kami tentang [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) menjelaskan produk ini lebih rinci.

Dalam arsitektur panduan ini, aplikasi semacam itu berada di lapisan 6 hingga 8: ia menggunakan data proses dan pesanan untuk memodelkan aliran nilai, mensimulasikan skenario, dan mengoptimalkan rencana. Seperti apa integrasi konkret dengan platform data Anda adalah hal yang perlu diklarifikasi dengan vendor; artikel ini tidak membuat klaim mengenai hal tersebut.

Terlepas dari vendornya, empat pertanyaan membantu ketika Anda memilih aplikasi semacam ini: Apakah aplikasi tersebut membaca data dari format terbuka (misalnya tabel Delta di OneLake atau event dari broker), atau memerlukan antarmukanya sendiri? Sistem mana yang menjadi system of record untuk data master seperti routing dan kapasitas? Di mana data dan komputasi dijalankan (wilayah, tenant)? Dan bagaimana hasil, seperti rencana yang sudah dioptimalkan, kembali ke ERP atau MES secara terkendali?

---

## FAQ

### Apa itu Azure untuk manufaktur?

Azure untuk manufaktur adalah kumpulan layanan cloud dan edge Microsoft yang digunakan produsen untuk menghubungkan pabrik, menyimpan dan menganalisis data produksi, serta membangun aplikasi AI dan tempat kerja di atasnya. Pada 2026, intinya adalah Azure IoT Operations di Kubernetes berkemampuan Arc di pabrik, Microsoft Fabric sebagai platform data, dan Foundry, Power BI serta Copilot untuk analitik dan AI [3], [17]. Microsoft mengemas kisah industrinya sebagai "Microsoft for Manufacturing", yang menggabungkan Azure, Dynamics 365 dan Microsoft 365 [1].

### Apa perbedaan antara Azure IoT Hub dan Azure IoT Operations?

IoT Hub adalah layanan cloud tempat perangkat individual terhubung langsung. Azure IoT Operations adalah data plane yang berjalan di pabrik pada Kubernetes berkemampuan Arc dan menghubungkan mesin melalui OPC UA dan konektor lain ke broker MQTT lokal [3]. Untuk pabrik dengan banyak mesin, Azure IoT Operations biasanya merupakan titik awal yang tepat; IoT Hub cocok untuk perangkat terdistribusi yang terhubung langsung. Untuk pertimbangan terhadap IoT Edge, lihat [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/).

### Apakah Azure IoT Central akan dihentikan?

Ya. Sejak 23 September 2026, tidak ada aplikasi IoT Central baru yang dapat dibuat; aplikasi yang sudah ada tetap berjalan hingga 20 September 2029. Microsoft merekomendasikan IoT Hub dengan Device Provisioning Service, Azure Device Registry dan Microsoft Fabric sebagai target; dasbor dan analitik beralih ke Fabric Real-Time Intelligence [8], [64]. Pemberitahuan penghentian untuk 31 Maret 2027 yang muncul di portal Azure pada Februari 2024 ditarik kembali oleh Microsoft saat itu sebagai pesan sistem yang keliru [9]. Pengumuman 2026, sebaliknya, adalah pemberitahuan biasa dengan masa transisi tiga tahun.

### Apa yang menggantikan Azure Time Series Insights?

Time Series Insights dihentikan pada 7 Juli 2024. Microsoft menyebut Eventhouse di Microsoft Fabric Real-Time Intelligence sebagai target migrasi [10]. Jika Anda tidak menggunakan Fabric, Azure Data Explorer adalah alternatif yang juga menggunakan KQL [19].

### Apa yang terjadi dengan Microsoft Cloud for Manufacturing?

Penawaran industri kini bernama "Microsoft for Manufacturing" dan menggabungkan kemampuan dari Azure, Dynamics 365 dan Microsoft 365 [1]. Pratinjau spesifik "Manufacturing data solutions" dan "Factory Operations Agent" dihentikan pada 30 Mei 2025, dan "Factory Safety Agent" pada 23 Juni 2025 [2]. Tidak ada pemberitahuan terpisah untuk "Manufacturing data solutions in Microsoft Fabric"; jangan merencanakannya dalam proyek baru.

### Layanan Azure apa yang saya butuhkan untuk pabrik pintar?

Untuk koneksi pabrik yang umum: Azure Arc dan klaster Kubernetes di pabrik, Azure IoT Operations di atasnya (broker, konektor OPC UA, data flow), Azure Device Registry untuk aset, Microsoft Fabric dengan Eventstream, Eventhouse dan Activator untuk data real-time, serta Power BI untuk pelaporan [3], [17]. Blok bangunan AI (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) dan digital twin datang kemudian. Entra ID, Azure Policy, Cost Management dan solusi keamanan OT membentuk kerangkanya.

### Apa perbedaan antara Azure IoT Operations Essentials dan Standard?

Standard menawarkan rangkaian fitur lengkap. Essentials, tersedia sejak rilis 2610, adalah opsi biaya lebih rendah untuk penerapan volume tinggi; ia hanya berjalan pada klaster node tunggal dan tidak menyertakan konektor OPC UA [3]. Untuk pabrik dengan mesin OPC UA, Standard adalah titik awalnya.

### Apakah saya memerlukan keterampilan Kubernetes untuk Azure IoT Operations?

Ya, setidaknya untuk operasional. Azure IoT Operations berjalan pada klaster Kubernetes berkemampuan Arc dan dikonfigurasi dengan cara Kubernetes [3]. Untuk memulai, Microsoft mendokumentasikan instalasi di Ubuntu dan di Windows dengan AKS Edge Essentials [3]. Rencanakan pengembangan keterampilan atau mitra operasional.

### Apakah produksi tetap berjalan jika koneksi internet gagal?

Menurut Microsoft, Azure IoT Operations dapat beroperasi secara offline maksimal 72 jam, mungkin dengan penurunan kemampuan, dan kembali berfungsi penuh saat tersambung kembali [3]. Berapa banyak pesan yang di-buffer selama waktu itu bergantung pada konfigurasi broker, yang ditetapkan saat penerapan awal [40]. Fungsi kontrol tidak boleh bergantung pada cloud; kontrol tetap berada di PLC dan sistem lokal.

### Azure Digital Twins atau digital twin builder di Fabric?

Azure Digital Twins adalah layanan yang sudah tersedia secara umum (generally available) dengan model DTDL dan akses API [14]. Digital twin builder merupakan bagian dari Fabric Real-Time Intelligence, bekerja dengan ontologi pada data OneLake, dan saat ini masih dalam tahap preview [15]. Untuk twin produksi yang dikembangkan oleh developer, Azure Digital Twins adalah pilihan yang aman saat ini; untuk twin analitis pada platform Fabric, pilot dengan digital twin builder layak dilakukan. Mirko Peters menjelaskan perbedaan terkait antara device twin di IoT Hub dan Azure Digital Twins dalam [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/).

### Data apa yang saya perlukan untuk pemeliharaan prediktif?

Variabel kondisi dengan laju sampling yang sesuai, timestamp yang tersinkronisasi, konteks operasi (order, produk, status mesin) dan, yang terpenting, riwayat kegagalan yang diberi label dari pemeliharaan. Tanpa riwayat kegagalan, pada awalnya hanya deteksi anomali yang dapat dilakukan.

### Apa arti pensiunnya Defender for IoT bagi keamanan OT saya?

Pada 2 November 2026, Microsoft secara resmi mengumumkan bahwa komponen keamanan OT dari Defender for IoT akan sepenuhnya dihentikan pada Oktober 2029; sampai saat itu hanya tersedia pembaruan keamanan dan perbaikan bug [22]. Sebuah blog mitra Microsoft justru menyebut 31 Mei 2028 sebagai akhir dukungan [39]. Tidak ada pengganti dari Microsoft sendiri; Microsoft menawarkan konektor untuk Armis, Dragos dan Forescout, yang solusinya dilisensikan secara terpisah [22]. Rencanakan penggantian agar selesai sebelum pertengahan 2028.

### Apakah IoT Edge masih layak digunakan?

IoT Edge sebagai produk masih didukung. Versi 1.5 LTS mencapai akhir dukungan pada 10 November 2026; versi 1.6 LTS yang berlaku saat ini didukung hingga 14 November 2028 [12]. Untuk armada perangkat Linux yang sudah ada, pembaruan ke 1.6 adalah jalur langsung. Untuk perangkat Windows dengan EFLOW 1.5, halaman versi tidak mencantumkan EFLOW 1.6 LTS; perjelas jalur tujuannya di sana. Untuk bidang data pabrik yang baru, evaluasi Azure IoT Operations.

### Apakah Azure memenuhi CMMC?

Tidak ada sertifikasi CMMC untuk Azure itu sendiri, karena CMMC berlaku untuk sistem kontraktor, bukan untuk platform cloud [55]. Microsoft menyatakan bahwa Azure dan Azure Government sama-sama memiliki otorisasi FedRAMP High yang mencakup NIST SP 800-171, bahwa Anda dapat memperoleh sertifikasi CMMC untuk solusi di kedua cloud tersebut, dan bahwa sebagian besar kontraktor pertahanan paling sesuai dengan Azure Government [55]. Aturan DFARS yang memasukkan persyaratan CMMC ke dalam kontrak DoD telah diberlakukan secara bertahap sejak 10 November 2025 [54].

### Kerangka keamanan mana yang sebaiknya digunakan manufaktur AS untuk Azure dan OT?

Gunakan secara bersamaan. NIST CSF 2.0 memberi Anda struktur tata kelola dan bahasa bersama dengan manajemen, perusahaan asuransi, dan pelanggan [49]; ISA/IEC 62443 memberi Anda model teknis untuk OT (zona, conduit, tingkat keamanan) [27]; NIST SP 800-82 Rev. 3 menghubungkan keduanya dengan panduan khusus OT dan overlay kontrol [50]. Tambahkan CMMC jika Anda menangani FCI atau CUI untuk DoD [53], dan NIS2 untuk lokasi di UE [41].

### Berapa biaya Azure untuk manufaktur?

Tidak ada angka pasti yang berlaku umum. Biaya bergantung pada jumlah pabrik dan mesin, volume data, retensi, kapasitas Fabric yang dipilih, perangkat keras edge, dan lisensi. Faktor pengungkit terbesar adalah agregasi data di edge. Gunakan kalkulator harga Azure dan terapkan praktik FinOps mulai fase 2 [25].

### Apa peran Microsoft 365 dalam manufaktur?

Microsoft 365 adalah lapisan tempat kerja: Teams untuk komunikasi dan notifikasi antarshift, Power BI untuk KPI, Power Apps untuk pencatatan data di stasiun kerja, dan Copilot untuk ringkasan dan pertanyaan tentang data. Bagi perusahaan yang sudah memiliki lingkungan Microsoft 365 yang mapan, koneksi ini sering kali menjadi cara tercepat untuk membuat data lantai produksi dapat digunakan.

### Dari mana saya mulai sebagai admin Microsoft 365 atau Azure?

Dengan tugas-tugas yang memang berada di bawah IT pusat: peran Entra ID untuk staf OT dan mitra, landing zone Azure dengan kebijakan tag per pabrik, klaster uji Arc termasuk persetujuan firewall melalui rantai proxy, dan struktur workspace Fabric. Secara paralel, temui pimpinan OT untuk memahami model zona pabrik. Rinciannya ada di bagian "Dari mana memulai sebagai admin Microsoft 365 atau Azure" di awal panduan ini.

---

## Kesimpulan

Azure untuk manufaktur pada 2026 lebih merupakan soal disiplin daripada sekadar memilih layanan. Fondasi teknisnya jelas: Azure IoT Operations on Arc di pabrik, Microsoft Fabric sebagai platform data, dan Foundry, Power BI serta Copilot untuk analitik dan tempat kerja. Pada saat yang sama, pensiunnya Time Series Insights dan pratinjau manufaktur, serta pensiun terjadwal IoT Central dan keamanan OT di Defender for IoT, menunjukkan bahwa pengelolaan siklus hidup merupakan bagian dari pekerjaan arsitektur.

Tiga hal membuat perbedaan: model data Anda sendiri yang netral terhadap alat dan berbasis ISA-95, desain keamanan yang berbasis ISA/IEC 62443 dan NIST CSF 2.0 yang juga mencakup CMMC atau NIS2 di mana itu berlaku, serta fokus yang konsisten pada kasus penggunaan dengan baseline yang terukur. Jika Anda bekerja dengan cara ini, Anda membangun platform yang melayani pemeliharaan prediktif, ketertelusuran, digital twin, dan AI dari fondasi data yang sama, dan yang bertahan melewati pergantian nama Microsoft berikutnya.

### Bacaan lebih lanjut di m365.fm

**Episode**
- [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Artikel**
- [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/)
- [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)

**Glosarium**
- [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) · [Digital twin](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Virtual commissioning](https://www.m365.fm/entity/virtual-commissioning/)

**Panduan terkait**
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

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** adalah pembawa acara m365.fm dan bekerja di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). Di m365.fm ia menulis tentang persinggungan antara perencanaan produksi, kembaran digital (digital twin), dan cloud Microsoft, menerjemahkan topik manufaktur seperti aliran nilai, keterlacakan, dan pemeliharaan prediktif untuk audiens Microsoft 365 dan Azure.

**Catatan: Penulis bekerja di iFAKT GmbH.**

*Terakhir ditinjau: 20 November 2026 (pemeriksaan fakta terhadap sumber primer Microsoft, NIST, CISA, FDA, SEC, BSI, dan UE). Tinjauan berikutnya untuk tabel status layanan: Februari 2027.*

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
