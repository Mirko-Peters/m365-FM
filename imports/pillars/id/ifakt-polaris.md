# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software für Wertstrom-Mapping: Kaufratgeber + iFAKT Polaris |
| Meta description | So wählen Sie Software für Wertstrom-Mapping: 5 Werkzeugkategorien, Auswahlkriterien, eine Checkliste und ein belegter Blick auf iFAKT Polaris und seine Grenzen. |
| Slug | `ifakt-polaris` |

# Software für Wertstrom-Mapping in der Fertigung: Ein Kaufratgeber und eine evidenzbasierte Betrachtung von iFAKT Polaris

> **Catatan: Penulis bekerja di iFAKT GmbH.**

*Per 20 November 2026 · Setiap pernyataan produk memiliki sumber; klaim vendor diberi label sebagai klaim vendor.*

> **Jawaban singkat:** Perangkat lunak value stream mapping mencakup rentang mulai dari alat gambar dengan simbol lean, melalui alat VSM khusus yang menghitung metrik, hingga sistem simulasi dan perencanaan. Kategori mana yang Anda butuhkan bergantung pada apakah Anda ingin mendokumentasikan value stream, mengevaluasinya secara berkala dengan data, mensimulasikannya dari waktu ke waktu, atau mengubahnya menjadi jadwal untuk lantai produksi. Alat gambar gratis seperti Lucidchart dan Miro, serta templat Visio, sudah cukup untuk workshop; alat VSM khusus baru terbayar jika Anda memetakan secara rutin; simulasi dan APS merupakan kategori tersendiri. **iFAKT Polaris** adalah platform modular dari iFAKT GmbH (Stuttgart, Jerman) dengan tujuh modul: VSM (value stream), BSM (swimlane proses), Designer (model produk-proses-sumber daya), Simulator, Optimizer (penjadwalan berbasis kendala), Operator (tugas di lantai produksi) dan Analyzer (dasbor KPI). Menurut vendor, modul-modul tersebut berbagi satu model data [3]. Penulis tidak mengetahui adanya uji perbandingan independen terhadap Polaris. Yang dapat diverifikasi antara lain dua daftar Microsoft AppSource [15][16], peringkat kedua pada kategori Produksi Best of Technology Award 2025 dari majalah bisnis mingguan Jerman WirtschaftsWoche untuk Polaris IMS [18], serta serangkaian artikel teknis di jurnal teknik Jerman ZWF [21][22][23][24].

Bagi siapa pun yang mencari perangkat lunak value stream mapping, masalah pertama adalah kosakata. Di bawah istilah "value stream mapping software" atau "value stream management software," vendor menjual hal-hal yang sangat berbeda: program diagram dengan pustaka simbol, alat lean dengan rumus, sistem simulasi, platform untuk tim pengiriman perangkat lunak, dan sistem perencanaan dengan digital twin. Perbandingan yang mencampuradukkan kategori-kategori ini menghasilkan keputusan pembelian yang keliru. Pabrik yang memetakan value stream-nya setahun sekali dalam acara kaizen membutuhkan sesuatu yang berbeda dari produsen high-mix yang menjadwalkan produksi setiap minggu dengan kapasitas yang ketat.

Panduan ini karena itu memiliki dua bagian. **Bagian A** memetakan pasar secara netral: apa yang harus dilakukan perangkat lunak value stream mapping, kategori apa saja yang ada, cara membandingkannya, serta kesalahan umum selama pemilihan dan penerapan. **Bagian B** menjelaskan iFAKT Polaris secara rinci, modul demi modul, dengan bukti dari halaman vendor, marketplace Microsoft, literatur teknis, dan dewan juri penghargaan, serta pernyataan yang jelas tentang apa yang tidak terdokumentasi dan siapa yang tidak cocok dengan produk ini.

Karena penulis bekerja di iFAKT GmbH, satu aturan sederhana berlaku untuk teks ini: setiap pernyataan produk memiliki sumber, klaim manfaat vendor diberi label sebagai demikian dan tidak diperlakukan sebagai fakta, dan Bagian A ditulis agar dapat berfungsi sebagai alat bantu keputusan meskipun Anda tidak pernah membaca Bagian B.

### Poin-poin utama

- **Kategori sebelum produk:** Alat gambar, alat VSM khusus, perangkat lunak simulasi, sistem APS, dan MES/BI memecahkan masalah yang berbeda. Mulailah dari pertanyaan yang harus dijawab oleh perangkat lunak tersebut.
- **Menggambar jarang menjadi hambatan.** Yang penting adalah konektivitas data, logika kalkulasi, skenario, kemampuan memodelkan variabilitas dan bauran produk, serta apakah analisis berujung pada tindakan dan jadwal.
- **Pemetaan value stream statis bekerja dengan rata-rata.** Variabilitas, bauran produk, dan sumber daya bersama memerlukan simulasi; tanggal jatuh tempo di bawah kendala memerlukan algoritma penjadwalan.
- **Opsi gratis tersedia** di kategori gambar (Lucidchart, Miro, Creately, dan lainnya) dan, untuk dua modul, di iFAKT Polaris [3]. Periksa batas pengguna, ekspor, dan kepemilikan data.
- **iFAKT Polaris** mencakup, menurut vendor, rangkaian mulai dari pemetaan value stream, melalui simulasi dan penjadwalan, hingga tugas di lantai produksi dan pelaporan [3]. Halaman modul mencantumkan fungsi tetapi tidak mencantumkan angka manfaat dengan metodologi yang diungkapkan.
- **Yang terdokumentasi** adalah sertifikasi ISO 9001 sejak Oktober 2014 [4], sertifikasi ISO/IEC 27001 oleh TÜV SÜD yang disebutkan di situs web [1][3], hosting VSM dan BSM di Microsoft Azure West Europe (wilayah yang berlokasi di Belanda) menurut halaman modul [6][7][43], dua daftar AppSource [15][16], dan penghargaan WirtschaftsWoche [18].
- **Yang tidak terdokumentasi** pada halaman yang ditinjau: fungsi simulasi di dalam modul VSM, integrasi asli dengan Microsoft Teams atau Power BI, wilayah hosting di AS, laporan SOC 2, dan harga publik.

## Daftar isi

**Bagian A: Apa yang harus dilakukan perangkat lunak value stream mapping**

1. [Istilah: value stream mapping, desain kondisi masa depan, value stream management](#1-istilah-value-stream-mapping-desain-kondisi-masa-depan-value-stream-management)
2. [Mengapa kertas dan Excel mencapai batasnya](#2-mengapa-kertas-dan-excel-mencapai-batasnya)
3. [Lima kategori perangkat lunak value stream mapping](#3-lima-kategori-perangkat-lunak-value-stream-mapping)
4. [Tabel perbandingan kategori](#4-tabel-perbandingan-kategori)
5. [Cara memilih perangkat lunak value stream mapping: kriteria secara rinci](#5-cara-memilih-perangkat-lunak-value-stream-mapping-kriteria-secara-rinci)
6. [Daftar periksa pemilihan](#6-daftar-periksa-pemilihan)
7. [Penerapan dalam enam langkah](#7-penerapan-dalam-enam-langkah)
8. [Kesalahan umum dalam pemilihan dan penerapan](#8-kesalahan-umum-dalam-pemilihan-dan-penerapan)
9. [Studi kelayakan bisnis tanpa angka yang dibuat-buat](#9-studi-kasus-bisnis-tanpa-angka-yang-dikarang)

**Bagian B: iFAKT Polaris secara rinci**

10. [Latar belakang dan metode: dari metrik ke data kejadian](#10-latar-belakang-dan-metode)
11. [Prinsip platform: satu model data, tujuh modul](#11-prinsip-platform-satu-model-data-tujuh-modul)
12. [Modul satu per satu](#12-modul-satu-per-satu)
13. [Polaris IMS dan Best of Technology Award 2025](#13-polaris-ims-und-der-best-of-technology-award-2025)
14. [Industri menurut perusahaan](#14-industri-menurut-perusahaan)
15. [Polaris dalam ekosistem Microsoft](#15-polaris-dalam-ekosistem-microsoft)
16. [Keamanan, hosting dan sertifikasi](#16-keamanan-hosting-dan-sertifikasi)
17. [Apa yang dijanjikan vendor dan cara mengujinya](#17-apa-yang-dijanjikan-vendor-dan-cara-mengujinya)
18. [Untuk siapa Polaris cocok dan untuk siapa tidak](#18-untuk-siapa-polaris-cocok-dan-untuk-siapa-tidak)
19. [FAQ](#19-faq)
20. [Kesimpulan](#20-kesimpulan)

# Bagian A: Apa yang harus dilakukan perangkat lunak value stream mapping

## 1. Istilah: value stream mapping, desain kondisi masa depan, value stream management

**Value stream mapping** (VSM) menunjukkan aliran material dan informasi dari satu keluarga produk, dari pemasok hingga pelanggan, dengan simbol standar. Di bawah setiap kotak proses terdapat data seperti cycle time, changeover time, uptime dan pola shift; di antara kotak proses terdapat persediaan, yang dikonversi menjadi hari cakupan. Garis waktu di bagian bawah menunjukkan berapa bagian dari total lead time yang bernilai tambah. Di AS, metode ini erat kaitannya dengan *Learning to See* karya Mike Rother dan John Shook, yang diterbitkan oleh Lean Enterprise Institute; buku ini membahas pemetaan kondisi saat ini, desain kondisi masa depan, dan rencana implementasi untuk sebuah pabrik fiktif, Acme Stamping. Buku kerja tersebut menerima Shingo Research Prize pada 1999 [41]. Metode lengkap dengan simbol, rumus, dan contoh kerja tersedia dalam kompendium m365.fm [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

**Desain kondisi masa depan** menggunakan peta kondisi saat ini untuk merancang target: aliran kontinu jika memungkinkan; pull melalui supermarket jika aliran tidak memungkinkan; satu proses pacemaker yang menentukan ritme; dan produksi yang diratakan (leveled). Hanya kondisi masa depan dan rencana implementasi yang mengubah analisis menjadi perbaikan. Praktisi Jerman sering menggunakan istilah *Wertstromdesign* untuk langkah ini, mengacu pada buku teks standar Jerman karya Klaus Erlach dari Fraunhofer IPA [40].

**Value stream management** dalam manufaktur berarti mengelola bisnis sepanjang value stream secara berkelanjutan: seorang value stream manager yang bertanggung jawab menjaga kondisi saat ini dan masa depan tetap mutakhir, melacak metrik dan tindakan, serta mengulangi analisis ketika bauran produk atau permintaan berubah. Sejak 2020 terdapat standar internasional untuk ini, ISO 22468:2020 "Value stream management (VSM)" [39]. Pengantar singkatnya ada pada artikel [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

**Perbedaan penting:** Dalam pengembangan perangkat lunak, "value stream management" merujuk pada kategori produk yang terpisah. Platform ini mengukur aliran item kerja melalui pipeline pengiriman perangkat lunak, dari tiket hingga deployment. Jika Anda mencari "value stream management software" dan yang dimaksud adalah pabrik, perhatikan dengan saksama: pada SERP AS, beberapa daftar mencampur alat DevOps seperti LinearB, Copado, atau Plutora dengan alat manufaktur [50]. Platform tersebut tidak dirancang untuk material, persediaan, dan mesin. Panduan ini hanya membahas value stream dalam manufaktur dan proses bisnis di sekitarnya.

## 2. Mengapa kertas dan Excel mencapai batasnya

Value stream mapping dimulai sebagai metode dengan pensil dan kertas, dan untuk peta pertama hal itu tetap cara yang tepat. Seseorang yang berdiri di gemba (tempat nilai diciptakan, yaitu lantai produksi) dengan pensil dan menghitung persediaan memahami aliran itu lebih baik daripada seseorang yang hanya mengklik-klik perangkat lunak. Namun, metode kertas menemui batasnya dalam empat situasi.

**Pertama: potret sesaat.** Value stream map klasik menunjukkan satu titik waktu. Saat mempresentasikan proyek riset Jerman ECOWERT, Markus Böhm dari Fraunhofer IPA (lembaga riset terapan Jerman untuk teknik manufaktur) mengatakannya seperti ini (diterjemahkan dari bahasa Jerman): "Pada dasarnya, value stream mapping tidak lebih dari sebuah potret sesaat." Menurut lembaga tersebut, banyak perusahaan melakukannya paling banyak sekali setahun [25]. Ketika bauran produk, permintaan, atau pola shift berubah, peta tersebut menjadi usang.

**Kedua: rata-rata sebagai pengganti distribusi.** Di atas kertas, setiap kotak proses hanya memuat satu cycle time, bukan variasinya. Kerusakan mesin, urutan changeover, dan sumber daya bersama hilang dalam angka rata-rata. Salah satu vendor simulasi menggambarkan perbedaannya sebagai berikut: value stream simulation menambahkan "urutan yang bergantung waktu, variasi, dan sumber daya bersama" ke dalam tampilan (diterjemahkan dari bahasa Jerman) [37]. Türck, Weimer, Schubert, dan Drees menguraikan langkah dari analisis statis ke simulasi dinamis value stream ini pada 2014 dalam ZWF, *Zeitschrift für wirtschaftlichen Fabrikbetrieb*, jurnal Jerman untuk teknik produksi [22].

**Ketiga: keragaman produk.** Metode ini memandang satu keluarga produk. Namun, dalam manufaktur dengan bauran tinggi dan volume rendah, banyak varian dengan routing yang berbeda berjalan melalui sumber daya yang sama. Satu peta per varian tidak praktis; satu peta untuk semua varian mengaburkan bottleneck.

**Keempat: upaya perhitungan dan versi.** Takt time, hari persediaan, lead time, dan flow ratio dapat dihitung di Excel, tetapi setiap perubahan pada peta harus dipindahkan secara manual. Beberapa skenario, beberapa pabrik, dan beberapa editor dengan cepat menghasilkan versi file yang saling bersaing.

Urutan konsekuensinya penting. Perangkat lunak cukup mudah menyelesaikan masalah pertama dan keempat, asalkan data tersedia. Hanya perangkat lunak yang benar-benar memodelkan variabilitas dan bauran produk yang dapat menyelesaikan masalah kedua dan ketiga. Dan tidak ada perangkat lunak yang menggantikan diskusi tim tentang seperti apa kondisi masa depan seharusnya.

## 3. Lima kategori perangkat lunak value stream mapping

Entri singkat Wikipedia tentang perangkat lunak value-stream-mapping membedakan dua jenis dasar: alat yang membantu menggambar peta dan alat yang melakukan perhitungan serta analisis [46]. Untuk keputusan pembelian, pembagian yang lebih rinci menjadi lima kategori lebih membantu daripada peringkat produk satu per satu. Contoh di bawah ini bukan daftar lengkap dan bukan rekomendasi; contoh tersebut hanya menunjukkan jenis alat yang dapat diharapkan di setiap kategori. Semua pernyataan produk didasarkan pada halaman vendor sendiri atau daftar di marketplace.

### 3.1 Alat menggambar dan papan tulis digital

**Fungsinya:** Menyediakan pustaka simbol untuk value stream map dan memungkinkan tim bekerja bersama di browser atau desktop. Microsoft Visio menyertakan templat value stream map; artikel dukungan Microsoft menyatakan bahwa templat tersebut memerlukan Visio Professional (atau edisi Premium yang lebih lama) dan tidak termasuk dalam Visio Standard, serta artikel tersebut mencantumkan Visio Plan 2 pada "Berlaku untuk" [27]. Lucidchart menawarkan pustaka bentuk VSM dalam akun gratisnya [28]; Miro menawarkan sejumlah templat value stream map pada papan tulisnya [29]. Creately, EdrawMax, SmartDraw dan alat sejenis bekerja dengan cara yang sama. Templat Excel dan PowerPoint juga termasuk dalam kategori ini.

**Kekuatan:** ambang masuk rendah, kolaborasi yang baik, sering kali tersedia tingkat gratis, antarmuka yang familiar.

**Keterbatasan:** biasanya tidak ada logika perhitungan di balik simbol-simbol tersebut. Metrik diketik secara manual, skenario berupa salinan gambar, dan tidak ada koneksi data ke ERP atau MES.

**Cocok untuk:** dokumentasi, pelatihan, lokakarya kaizen awal, tim tersebar yang membutuhkan pandangan bersama.

### 3.2 Alat value stream mapping khusus (perangkat lunak VSM dengan logika perhitungan)

**Fungsinya:** Menggabungkan simbol lean dengan logika perhitungan. Metrik seperti hari persediaan, lead time dan rasio nilai tambah dihitung otomatis dari data proses, dan skenario dapat dibandingkan berdampingan. Contoh: eVSM, yang oleh vendornya digambarkan sebagai "toolkit lean lengkap untuk memetakan, memodelkan, dan memperbaiki value stream dari segala jenis" (daftar marketplace dengan fitur yang dilaporkan pengguna seperti pemetaan model campuran dan impor Excel) [42]; SimVSM dari SimPlan (Jerman), yang versi dasarnya mendukung value stream mapping digital "termasuk evaluasi statis" (diterjemahkan dari bahasa Jerman) [30] dan menghitung angka kunci seperti cycle time, throughput dan persediaan secara otomatis [31]; visTable (Jerman), yang menghubungkan value stream dan tata letak pabrik dalam satu model dan, menurut vendornya, menghitung lead time secara otomatis dari data proses, siklus dan persediaan [32]; serta Polaris VSM dari iFAKT (lihat Bagian B).

**Kekuatan:** lebih sedikit kesalahan perhitungan, skenario cepat, versioning, sering kali dilengkapi pelacakan tindakan bawaan.

**Keterbatasan:** biaya lisensi, kurva belajar, dan perhitungan biasanya tetap statis: alat bekerja dengan rata-rata, meskipun datanya masuk secara otomatis.

**Cocok untuk:** perusahaan yang secara rutin melakukan pekerjaan value stream dan ingin menjaga beberapa value stream atau pabrik tetap dapat dibandingkan.

### 3.3 Perangkat lunak simulasi

**Fungsinya:** Simulasi berbasis kejadian diskret memodelkan pesanan, sumber daya, buffer, shift dan kerusakan sepanjang waktu. Itu menjawab pertanyaan yang tidak dapat dijawab oleh peta statis: Di mana bottleneck muncul dengan bauran produk ini? Apakah buffer cukup besar pada tingkat kerusakan ini? Apa untungnya menambah satu shift? Alat yang dikenal luas meliputi Siemens Tecnomatix Plant Simulation, AnyLogic (pemodelan multi-metode: berbasis agen, system dynamics dan berbasis kejadian diskret) dan FlexSim (berbasis kejadian diskret dengan pemodelan 3D) [34]. Beberapa vendor menghubungkan value stream dan simulasi secara langsung: Siemens menawarkan pustaka VSM untuk Plant Simulation X dengan elemen value stream yang telah dikonfigurasi, perbandingan skenario dan simulasi dinamis value stream yang mengumpulkan metrik seperti cycle time, lead time, WIP dan utilisasi sumber daya [33]; di SimVSM Pro, skenario dapat disimulasikan, misalnya untuk mengevaluasi tindakan atau mengidentifikasi bottleneck [31].

**Kekuatan:** variabilitas, bauran produk dan sumber daya bersama menjadi terlihat; investasi dapat diuji sebelum Anda berkomitmen.

**Keterbatasan:** membangun dan memvalidasi model membutuhkan waktu dan keahlian. Proyek simulasi klasik sering kali merupakan studi sekali pakai yang modelnya tidak dipelihara setelah keputusan diambil.

**Cocok untuk:** keputusan investasi dan tata letak, manufaktur bauran tinggi, pertanyaan kapasitas dengan ketidakpastian tinggi.

### 3.4 Sistem APS (advanced planning and scheduling)

**Apa yang mereka lakukan:** Sistem APS membuat jadwal terperinci dengan mempertimbangkan kendala: kapasitas mesin dan tenaga kerja, keterampilan, urutan changeover, ketersediaan material, dan tanggal jatuh tempo. Siemens menggambarkan Opcenter Scheduling sebagai sistem yang membuat "jadwal produksi berdasarkan ketersediaan sumber daya, kendala, dan material yang dibutuhkan oleh pesanan" [36]. Ikhtisar mendetail tersedia dalam kompendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

**Kekuatan:** jadwal yang realistis dan dapat dieksekusi, bukan perencanaan kasar terhadap kapasitas tak terbatas; penjadwalan ulang yang cepat setelah gangguan.

**Keterbatasan:** tuntutan tinggi terhadap kualitas master data (routing, waktu, sumber daya), usaha integrasi dengan ERP dan MES, serta penerimaan dari para perencana.

**Cocok untuk:** perusahaan dengan sumber daya yang terbatas dan dipakai bersama, banyak varian produk, dan tekanan pengiriman.

### 3.5 MES, process mining, dan BI

**Apa yang mereka lakukan:** Manufacturing execution system (MES) merekam data aktual dari lantai produksi; alat BI dan analitik berbasis data mengevaluasinya. Beberapa vendor merekonstruksi aliran nilai secara otomatis dari data tersebut. ONIQ, yang ditawarkan melalui PwC Store di Jerman, menyatakan bahwa data umpan balik dari sistem TI produksi "(misalnya, MES, PDA, PPS, IIoT)" dapat dialihkan menjadi kembaran digital aliran nilai "tanpa pemetaan manual" [35] (PDA adalah production data acquisition, akuisisi data produksi; PPS adalah istilah Jerman untuk sistem perencanaan dan pengendalian produksi).

**Kekuatan:** data aktual sebagai pengganti perkiraan, analisis yang berkelanjutan dan bukan sekali jalan.

**Keterbatasan:** hasilnya hanya sebaik data umpan balik; kondisi masa depan dan jadwal tidak muncul secara otomatis. MES tidak menggantikan value stream mapping; MES hanya memasok datanya.

**Cocok untuk:** pabrik dengan fondasi data yang baik yang ingin memantau deviasi dan tren secara terus-menerus. Informasi lebih lanjut tentang metrik ada dalam kompendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/); tentang rutinitas harian di lantai produksi ada dalam kompendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 3.6 Platform yang mencakup beberapa kategori

Beberapa vendor menggabungkan beberapa kategori tersebut dalam satu produk, misalnya aliran nilai dan tata letak (visTable [32]), aliran nilai dan simulasi (SimVSM Pro [31], pustaka VSM Plant Simulation X [33]), atau aliran nilai, simulasi, penjadwalan, dan eksekusi (iFAKT Polaris, menurut vendor [3]). Keuntungannya adalah kesinambungan data: apa yang dicatat saat pemetaan tidak perlu dimasukkan ulang untuk simulasi. Kelemahannya: di setiap kategori tunggal, alat khusus dapat menggali lebih dalam. Pada platform, periksa setiap kategori secara terpisah terhadap kebutuhan Anda, dan jangan menganggap keluasan fitur sebagai kualitas dengan sendirinya.

## 4. Tabel perbandingan kategori

| Kriteria | Gambar/papan tulis | Alat VSM khusus | Perangkat lunak simulasi | Sistem APS | MES / process mining / BI |
|---|---|---|---|---|---|
| Pertanyaan utama | Seperti apa aliran prosesnya? | Di mana pemborosan dan titik pengungkit? | Bagaimana sistem berperilaku dari waktu ke waktu? | Siapa melakukan apa, dan kapan? | Apa yang sebenarnya terjadi? |
| Simbol Lean | ya (templat) | ya, dengan logika | sebagian (pustaka VSM) | tidak | jarang |
| Metrik otomatis | tidak | ya (statis) | ya (dinamis, sebagai distribusi) | metrik rencana (tanggal jatuh tempo, utilisasi) | metrik aktual |
| Variabilitas dan kerusakan | tidak | umumnya tidak | ya | sebagian (penjadwalan ulang) | terlihat setelah kejadian |
| Keragaman produk | lemah | sedang | baik | baik | baik (data aktual) |
| Koneksi data ERP/MES | tidak | opsional | impor, biasanya per proyek | wajib | wajib |
| Keluaran | gambar | peta dengan metrik, skenario | evaluasi skenario | jadwal yang dapat dijalankan | laporan, dasbor |
| Usaha yang umum | rendah | rendah hingga sedang | sedang hingga tinggi | tinggi | tinggi |
| Pengguna yang umum | pelatih Lean, tim kaizen | manajer aliran nilai, insinyur industri | insinyur simulasi, perencana fasilitas | perencana produksi, penjadwal | manajemen pabrik, TI, keuangan |

Tabel ini menggambarkan profil yang umum. Produk individual dapat berbeda, dan platform mencakup beberapa kolom. Untuk keputusan Anda, yang menentukan adalah kolom mana yang menjawab pertanyaan terpenting Anda.

### Panduan keputusan singkat

- **Anda ingin mendokumentasikan aliran nilai untuk lokakarya dan pelatihan** dan memetakannya paling banyak setahun sekali: alat gambar dengan templat biasanya sudah cukup.
- **Anda rutin mengerjakan aliran nilai**, membandingkan beberapa aliran nilai atau pabrik, dan menginginkan metrik tanpa pemeliharaan spreadsheet: alat VSM khusus.
- **Titik hambatan Anda berpindah seiring bauran produk**, atau Anda perlu membenarkan investasi pada peralatan, tenaga kerja, atau buffer: simulasi, idealnya pada model yang dipelihara setelah studi selesai.
- **Masalah Anda adalah tanggal jatuh tempo**, karena banyak pesanan bersaing untuk mesin, perkakas, dan keterampilan yang terbatas: sistem APS.
- **Anda tidak tahu apa yang sebenarnya terjadi di lantai produksi**, karena konfirmasi hilang atau tidak andal: kumpulkan data terlebih dahulu (MES, pengumpulan data mesin), baru kemudian analisis.
- **Beberapa di antara ini berlaku:** pertimbangkan platform yang menghubungkan beberapa kategori dalam satu model data, dan bandingkan setiap kategori dengan alat khusus.

## 5. Cara memilih perangkat lunak value stream mapping: kriteria secara rinci

### 5.1 Koneksi data ke ERP, MES, dan lantai produksi

Pertanyaan yang paling penting adalah: data berasal dari mana, dan seberapa sering diperbarui? Alat yang hanya mengenal input manual akan tetap menjadi potret sesaat. Alat yang tidak bisa dimulai tanpa integrasi ERP akan menunda manfaat apa pun selama berbulan-bulan. Solusi yang baik dapat dimulai tanpa integrasi dan kemudian menarik data sesuai kebutuhan. Tanyakan secara spesifik tentang format impor (Excel, CSV), konektor standar ke sistem ERP Anda (SAP, Microsoft Dynamics 365, Epicor, Infor, Oracle, atau apa pun yang Anda gunakan), antarmuka ke MES dan pengumpulan data mesin, serta opsi untuk menghubungkan data mesin melalui gateway IIoT (protokol yang umum digunakan adalah OPC UA, MTConnect, dan MQTT). Selain itu, pastikan siapa yang membangun dan memelihara antarmuka tersebut: vendor, mitra, atau tim TI internal Anda.

### 5.2 Logika perhitungan dan metrik

Periksa metrik apa saja yang dihitung oleh alat tersebut dan apakah rumusnya terlihat. Takt time (waktu tersedia dibagi permintaan pelanggan), hari persediaan, lead time, rasio nilai tambah (sering dilaporkan sebagai process cycle efficiency, PCE), OEE, dan flow ratio harus dapat ditelusuri. Metrik dan rumus khusus itu penting karena setiap pabrik memiliki definisinya sendiri. Perangkat lunak yang hasilnya tidak dapat dihitung ulang oleh siapa pun akan kehilangan kepercayaan dari tim keuangan sejak awal.

### 5.3 Dinamika dan simulasi

Ini adalah perbedaan utama: apakah alat tersebut menghitung dengan rata-rata, atau mensimulasikan operasi dari waktu ke waktu? Banyak vendor menyebut perbandingan skenario sebagai "simulasi" padahal yang dibandingkan hanyalah metrik statis dari dua varian. Tanyakan apakah variabilitas, kerusakan mesin, pola shift, bauran produk, dan sumber daya bersama dimodelkan sepanjang waktu, dan apa yang dihasilkan: rata-rata, distribusi, atau deret waktu utilisasi. Dengan input stokastik (kerusakan, waktu proses yang bervariasi), perangkat lunak harus mampu mengevaluasi beberapa replikasi; satu kali jalan hanyalah salah satu hasil yang mungkin, bukan hasil yang andal.

### 5.4 Variasi produk dan struktur produk

Ketika banyak varian berjalan pada sumber daya yang sama, model membutuhkan bill of materials, routing, dan penugasan sumber daya, bukan sekadar kotak proses. Periksa apakah alat tersebut memodelkan produk, proses, dan sumber daya secara terpisah lalu menghubungkannya (sering disebut model product-process-resource, disingkat PPR), dan apakah alat tersebut memperhitungkan waktu changeover yang bergantung pada urutan antarvarian.

### 5.5 Dari analisis ke eksekusi

Sebagian besar nilai tercipta setelah analisis. Tanyakan apakah tindakan, kartu kaizen, penanggung jawab, dan tenggat waktu dikelola dalam alat yang sama, apakah siklus PDCA dapat didokumentasikan, dan apakah kondisi masa depan dapat diubah menjadi jadwal untuk lantai produksi.

### 5.6 Kolaborasi dan tata kelola

Peran dan izin (baca, edit, administrasi), riwayat versi, multi-tenancy untuk beberapa pabrik atau badan hukum, pengeditan bersamaan, dan jejak audit perubahan wajib ada begitu lebih dari satu tim menggunakan alat tersebut.

### 5.7 Integrasi Microsoft

Banyak produsen di AS menjalankan Microsoft 365 dan Microsoft Entra ID (sebelumnya Azure Active Directory), dan sebagian menggunakan Dynamics 365 sebagai sistem ERP. Pertanyaan yang relevan adalah: Apakah perangkat lunak mendukung single sign-on dengan penyedia identitas Anda? Apakah ada konektor standar ke Dynamics 365, atau hanya impor file? Dapatkah metrik diekspor ke alat BI Anda, seperti Power BI? Dapatkah solusi dibeli melalui Microsoft AppSource atau Azure Marketplace? Daftar di AppSource berarti solusi tersebut ditawarkan di marketplace Microsoft; dengan sendirinya, hal itu tidak menyatakan seberapa dalam integrasinya.

### 5.8 Hosting, perlindungan data, dan keamanan informasi

Data produksi berisi kapasitas, biaya, pesanan pelanggan, dan pemasok. Pastikan di mana data disimpan (wilayah, operator pusat data), bagaimana tenant dipisahkan, dan sertifikasi apa yang dapat ditunjukkan vendor. Bagi pembeli di AS, ada empat poin yang layak ditanyakan:

- **Residensi data.** Tanyakan secara tertulis di wilayah cloud mana data Anda disimpan. Jika vendor hanya meng-hosting di UE, periksa apakah itu sesuai dengan kontrak pelanggan dan kebijakan internal Anda. Jika data aliran nilai Anda mencakup data teknis yang diatur oleh ITAR atau EAR (umum di sektor kedirgantaraan dan pertahanan), libatkan tim kepatuhan ekspor Anda sebelum memasukkan data tersebut ke layanan cloud apa pun.
- **Atestasi.** Banyak tim keamanan di AS meminta laporan SOC 2, yaitu audit berdasarkan kriteria AICPA untuk kontrol yang relevan dengan keamanan, ketersediaan, integritas pemrosesan, kerahasiaan, atau privasi [45]. Alternatif internasionalnya adalah sertifikasi ISO/IEC 27001, yang menunjukkan sistem manajemen keamanan informasi yang telah diaudit. Keduanya bisa diterima; mintalah sertifikat beserta lingkup dan tanggal kedaluwarsanya, atau laporannya langsung. Yang penting adalah apakah pengembangan dan operasi perangkat lunak berada dalam lingkup tersebut.
- **Kerangka risiko Anda sendiri.** Cybersecurity Framework 2.0 dari NIST, dirilis pada 26 Februari 2024, dimaksudkan untuk organisasi dari segala ukuran dan sektor, dan menambahkan fungsi "Govern" ke Identify, Protect, Detect, Respond, dan Recover [44]. Anda dapat menggunakannya untuk menyusun tinjauan vendor Anda sendiri.
- **Hukum perlindungan data UE.** Dengan vendor Eropa, Anda sering menemukan rujukan ke GDPR, yaitu General Data Protection Regulation dari UE, serta data processing agreement (DPA). DPA berdasarkan GDPR adalah kontrak tentang bagaimana vendor memproses data pribadi atas nama Anda; pada alat produksi, data tersebut umumnya berupa akun pengguna dan nama. DPA bukan sertifikasi keamanan.

### 5.9 Biaya, uji coba, dan dukungan

Tanyakan model lisensi (per pengguna, per pabrik, per modul), paket gratis atau uji coba, upaya pelatihan dan implementasi, serta konsultasi dari vendor atau mitra. Untuk pembeli AS yang menggunakan vendor asing, tanyakan juga jam dukungan pada zona waktu Anda dan apakah ada mitra implementasi yang berbasis di AS. Banyak vendor di pasar ini tidak mempublikasikan harga; itu hal yang lumrah tetapi membuat perbandingan lebih sulit. Mintalah penawaran tertulis untuk total biaya selama tiga tahun, termasuk integrasi.

## 6. Daftar periksa pemilihan

**Pertanyaan dan lingkup**
- [ ] Pertanyaan utama sudah dituliskan (dokumentasi, evaluasi, simulasi, penjadwalan, atau pemantauan).
- [ ] Kategori yang sesuai dari Bagian 3 sudah dipilih.
- [ ] Area percontohan dengan satu keluarga produk dan target yang dapat diukur sudah ditentukan.

**Data**
- [ ] Anda dapat memulai tanpa integrasi sistem.
- [ ] Impor Excel/CSV sudah diuji dengan data Anda sendiri.
- [ ] Koneksi ke ERP dan MES Anda sudah dijelaskan (konektor standar atau proyek).
- [ ] Kepemilikan operasi antarmuka sudah ditetapkan.

**Fungsionalitas**
- [ ] Metrik dan rumus terlihat dan dapat disesuaikan.
- [ ] Skenario dapat diberi versi dan dibandingkan.
- [ ] Dinamika (variabilitas, kerusakan mesin, bauran produk) dimodelkan, jika Anda membutuhkannya.
- [ ] Varian, daftar bahan, dan urutan changeover dapat dimodelkan, jika Anda membutuhkannya.
- [ ] Tindakan dan PDCA dilacak di dalam alat.

**Operasi dan keamanan**
- [ ] Wilayah hosting dan operator pusat data sudah dikonfirmasi secara tertulis.
- [ ] Laporan SOC 2 atau sertifikat ISO/IEC 27001 dengan lingkup tersedia.
- [ ] Data processing agreement tersedia, jika menyangkut data pribadi.
- [ ] Pertanyaan kontrol ekspor (ITAR/EAR) sudah diselesaikan, jika relevan.
- [ ] Single sign-on dan model peran sesuai dengan TI Anda.

**Ekonomi**
- [ ] Total biaya selama tiga tahun termasuk integrasi dan pelatihan sudah diketahui.
- [ ] Hipotesis manfaat didukung oleh nilai dasar Anda sendiri (lihat Bagian 9).
- [ ] Anda sudah berbicara dengan pelanggan referensi dari industri Anda.

## 7. Penerapan dalam enam langkah

**Langkah 1: Tetapkan tujuan dan area percontohan.** Pilih satu keluarga produk yang memiliki masalah nyata, misalnya lead time yang panjang atau pengiriman tepat waktu yang buruk, serta target yang dapat diukur. Percontohan di semua pabrik sekaligus biasanya gagal karena sulitnya koordinasi.

**Langkah 2: Petakan kondisi saat ini di gemba.** Datanglah ke lantai produksi, hitung persediaan, dan tanyakan waktu-waktu proses. Perangkat lunak berfungsi untuk merekam data, bukan untuk menggantikan pengamatan langsung.

**Langkah 3: Perkaya data.** Tambahkan data dari ERP, MES, atau pengumpulan data mesin ke dalam penelusuran, untuk tahap awal cukup dalam bentuk file. Perbedaan antara apa yang Anda amati dan apa yang ditunjukkan sistem sudah merupakan hasil tersendiri: perbedaan itu memperlihatkan di mana data master yang salah.

**Langkah 4: Kembangkan kondisi masa depan dan skenario.** Susun kondisi masa depan sebagai tim dan bandingkan beberapa varian. Jika variabilitas atau bauran produk berpengaruh, uji varian tersebut dengan simulasi.

**Langkah 5: Terapkan dan lacak tindakan.** Ubah kondisi masa depan menjadi tindakan dengan penanggung jawab dan tenggat waktu. Jika solusi mencakup penjadwalan dan eksekusi, uji di area percontohan apakah jadwal benar-benar dapat dipertahankan di lantai produksi.

**Langkah 6: Pertahankan dan perluas.** Tentukan siapa yang memelihara value stream, seberapa sering metrik ditinjau, dan kapan analisis diulang. Baru setelah itu perluasan ke value stream lain layak dilakukan.

## 8. Kesalahan umum dalam pemilihan dan penerapan

- **Alat sebelum metode:** Jika tim belum menguasai value stream mapping, perangkat lunak hanya membantu mereka menggambar peta yang salah dengan lebih cepat. Latih metodenya terlebih dahulu.
- **Mencampuradukkan kategori:** Alat penggambar dibeli saat pertanyaan penjadwalan menjadi persoalan, atau sistem APS dibeli ketika belum ada yang memahami value stream.
- **Menganggap perbandingan skenario sebagai simulasi:** Dua peta statis yang disandingkan tidak memperlihatkan bottleneck yang hanya muncul akibat variabilitas.
- **Meremehkan kualitas data:** Routing dengan waktu yang sudah usang menghasilkan hasil yang tidak realistis di perangkat lunak mana pun. Sediakan waktu untuk pembersihan data master.
- **Memaksakan integrasi terlalu dini:** Proyek interface yang berlangsung berbulan-bulan sebelum ada hasil pertama membuang banyak dukungan. Mulailah dengan impor file.
- **Mengadopsi angka manfaat dari vendor:** Persentase seperti "lead time hingga 50 persen lebih pendek" menggambarkan kasus individual dalam kondisi yang tidak diketahui. Angka semacam ini umum di pasar, dari suite APS hingga alat VSM (contohnya ada di Bagian 17). Hitunglah dengan nilai dasar Anda sendiri.
- **Tidak ada yang bertanggung jawab atas value stream:** Tanpa value stream manager, peta digital terbaik pun menjadi usang seperti kertas coklat.
- **Mengabaikan lantai produksi:** Jadwal dan tugas yang tidak dipahami atau tidak dapat dikonfirmasi oleh operator akan tetap hanya teori.

## 9. Studi kasus bisnis tanpa angka yang dikarang

Studi kasus bisnis yang kredibel untuk perangkat lunak value stream mapping harus bertumpu pada nilai baseline Anda sendiri, bukan pada persentase dari brosur. Logikanya dapat dibagi menjadi lima pengungkit dan tiga blok biaya.

**Pengungkit 1: persediaan dan lead time.** Menurut Hukum Little, dalam kondisi tunak: work in process = throughput × lead time. Jika Anda memangkas lead time dengan throughput yang tetap, persediaan yang terikat juga berkurang dalam proporsi yang sama. Hitunglah dengan WIP saat ini, biaya modal Anda, dan hipotesis target yang dapat dipertanggungjawabkan oleh tim proyek.

**Pengungkit 2: ketepatan waktu pengiriman.** Pengiriman yang terlambat menimbulkan penalti kontrak, biaya pengiriman kilat, pesanan mendesak, dan hilangnya kepercayaan pelanggan. Catat ketepatan waktu pengiriman saat ini dan biaya langsung yang diakibatkan oleh pesanan terlambat selama setahun terakhir.

**Pengungkit 3: kapasitas dan penghindaran belanja modal.** Jika simulasi menunjukkan bahwa bottleneck yang tampak dapat diatasi melalui penjadwalan urutan atau buffer, investasi menjadi tidak diperlukan. Pengungkit ini sering kali yang terbesar, tetapi bersifat satu kali dan hanya dihitung jika investasi tersebut benar-benar direncanakan.

**Pengungkit 4: upaya perencanaan dan analisis.** Hitung jam yang saat ini dihabiskan untuk value stream walk, pemeliharaan spreadsheet, dan penjadwalan manual. Nilai penghematannya secara hati-hati: waktu yang dibebaskan hanya menjadi manfaat jika digunakan untuk hal lain.

**Pengungkit 5: kualitas keputusan.** Sulit diukur secara kuantitatif, tetapi nyata: investasi yang buruk yang tidak jadi dilakukan, dan keputusan bauran produk yang diuji terlebih dahulu. Daftarkan pengungkit ini secara kualitatif daripada mengisinya dengan angka yang dikarang.

**Biaya:** (1) lisensi atau langganan selama jangka waktu yang direncanakan, (2) implementasi termasuk persiapan data, antarmuka, pelatihan, dan konsultasi, (3) waktu internal untuk pilot, pemeliharaan master data, dan kepemilikan value stream yang berkelanjutan.

**Cara melanjutkan:** Untuk setiap pengungkit, tetapkan baseline, hipotesis target yang konservatif, dan hipotesis target yang diharapkan, lalu hitung kedua skenario tersebut terhadap biaya. Pilot ada untuk menguji hipotesis dengan data nyata. Vendor yang bersedia menyepakati pilot dengan kriteria yang dapat diukur lebih dapat dipercaya daripada vendor yang menyebutkan angka manfaat tanpa metodologi.

# Bagian B: iFAKT Polaris secara rinci

> **Catatan: Penulis bekerja di iFAKT GmbH.**

Bagian-bagian berikut menjelaskan [iFAKT Polaris](https://www.m365.fm/entity/polaris/) berdasarkan halaman produk [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) (bahasa Inggris dan Jerman, diambil pada 20 November 2026), daftar di Microsoft AppSource, sebuah postingan Microsoft Tech Community, halaman penghargaan WirtschaftsWoche, dan literatur teknis. Jika suatu pernyataan hanya berasal dari vendor, teks menyebutkannya. Penulis tidak mengetahui adanya uji perbandingan independen atau evaluasi analis terhadap Polaris.

## 10. Latar belakang dan metode

iFAKT GmbH berkantor pusat di Curiestrasse 2, 70563 Stuttgart, Jerman (register perusahaan: Pengadilan Negeri Stuttgart, HRB 22661) [5]. Halaman perusahaan berbahasa Inggris menyebutkan bahwa kantornya dekat Bandara Stuttgart [4]. Menurut perusahaan, mereka telah bekerja untuk optimasi proses produksi dan bisnis selama lebih dari 25 tahun [3]. Halaman perusahaan mencantumkan otomotif, dirgantara, teknik mesin, dan teknologi medis sebagai industri [4].

Untuk menilai Polaris, riwayat perusahaan kurang penting dibandingkan pemikiran metodologis di balik perangkat lunak tersebut. Di sini ada jejak yang dapat diverifikasi: Jörg Drees, yang tercantum dengan afiliasi iFAKT GmbH dalam artikel ZWF 2023 [24], menerbitkan beberapa artikel bersama rekan penulis di ZWF antara 2011 dan 2023, yang terakhir bersama Fraunhofer IPA. ZWF (*Zeitschrift für wirtschaftlichen Fabrikbetrieb*) adalah jurnal teknik berbahasa Jerman yang arsipnya kini dikelola oleh De Gruyter Brill; judul-judul di bawah ini diterjemahkan, dan judul asli bahasa Jerman tercantum dalam sumber. Artikel-artikel tersebut menelusuri jalur yang tampak dalam struktur modul Polaris.

| Tahun | Artikel (judul terjemahan) | Penulis | Referensi | Tautan ke Polaris |
|---|---|---|---|---|
| 2011 | Optimasi produksi melalui metrik pemodelan aliran nilai | Jörg Drees, Christoph Sack | ZWF 106 (6), hlm. 466–470, DOI 10.3139/104.110589 [21] | perhitungan metrik dalam aliran nilai (VSM) |
| 2014 | Simulasi dinamis aliran nilai | Stefan Türck, Andreas Weimer, Lars Schubert, Jörg Drees | ZWF 109 (11), hlm. 839–842, DOI 10.3139/104.111242 [22] | langkah dari analisis statis ke simulasi |
| 2018 | Perspektif baru untuk metode aliran nilai: Value Stream Management 4.0, Next Generation | Jörg Drees | ZWF 113 (9), hlm. 605–609, DOI 10.3139/104.111974 [23] | metode aliran nilai dan perangkat lunak untuk produksi terhubung (Industri 4.0, IIoT) |
| 2023 | Antarmuka data universal untuk layanan aliran nilai digital | Markus Böhm, Jörg Drees, Brandon Sai, Klaus Erlach, Steffi Stambera, Tim Teriete | ZWF 118 (5), hlm. 293–297, DOI 10.1515/zwf-2023-1062 [24] | data kejadian dari mesin sebagai dasar data bersama untuk layanan aliran nilai |

**2011: metrik.** Drees dan Sack menjelaskan bagaimana metrik dari pemodelan aliran nilai dapat digunakan untuk mengoptimalkan produksi [21]. Itulah inti dari alat VSM khusus: simbol dengan logika perhitungan di baliknya.

**2014: dinamika.** Menurut abstraknya, artikel oleh Türck, Weimer, [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) dan [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) berangkat dari pandangan bahwa pemodelan aliran nilai beralih dari tinjauan statis terhadap aliran nilai dan metrik menuju simulasi dinamis, dan mempertanyakan opsi baru apa saja, termasuk waktu, yang terbuka untuk optimasi produksi [22]. Gagasan ini hidup terus dalam modul Simulator, yang, bagaimanapun, bekerja pada model produk-proses-sumber daya dari Designer, bukan pada peta aliran nilai (Bagian 12).

**2018: konektivitas.** Drees mempertanyakan bagaimana metode aliran nilai dan perangkat lunaknya perlu berkembang sekarang setelah Industri 4.0 dan IIoT menghubungkan informasi di seluruh pabrik [23].

**2021 hingga 2023: data waktu nyata bersama Fraunhofer IPA.** Dalam proyek penelitian ECOWERT (akronim bahasa Jerman untuk "analisis aliran nilai waktu nyata untuk optimasi produksi berkelanjutan"), Fraunhofer IPA bekerja sama dengan iFAKT GmbH mengembangkan perangkat lunak yang menanyakan dan menampilkan data produksi dari sistem ERP dan sumber lain secara otomatis dan mendekati waktu nyata. Negara bagian Baden-Württemberg membiayai proyek satu tahun yang berjalan hingga 31 Agustus 2022 itu, dengan sekitar EUR 300.000 dari program Invest BW-nya; ESB Business School di Universitas Reutlingen membantu membangun demonstrator [25]. Sebuah artikel media oleh Drees, Stambera dan Böhm menjelaskan jalur teknisnya: data mesin dalam format JSON melalui gateway IIoT (disebutkan OPC UA, MTConnect, IO-Link dan MQTT; proyek ini menggunakan MQTT dengan Sparkplug), basis data deret waktu, dan keterhubungan dengan aplikasi aliran nilai Polaris VSM, yang menghitung metrik melalui pohon KPI untuk periode dan keluarga produk terpilih [26]. Artikel ZWF 2023 menggeneralisasi pendekatan ini menjadi antarmuka data universal; menurut para penulis, sebuah layanan aliran nilai untuk perhitungan dan visualisasi metrik telah dihubungkan dalam ECOWERT [24]. Para penulis termasuk Klaus Erlach dari Fraunhofer IPA, penulis buku teks standar bahasa Jerman tentang perancangan aliran nilai [40].

**Apa yang dibuktikan jejak ini dan apa yang tidak:** Publikasi-publikasi tersebut menunjukkan bahwa para penulis telah lama bekerja pada metrik, simulasi, dan konektivitas data untuk aliran nilai, dan bahwa sebuah lembaga riset bekerja sama dengan iFAKT. Publikasi tersebut tidak menunjukkan bahwa perangkat lunak saat ini lebih baik daripada yang lain. Fraunhofer IPA juga tidak memberi peringkat pada produk mana pun dalam siaran persnya; lembaga itu menggambarkan sebuah proyek riset, dan menurut lembaga tersebut aplikasi pada waktu itu "belum memberikan saran apa pun" (diterjemahkan dari bahasa Jerman) [25].

Pemetaan aliran nilai dengan data langsung dan model data yang berkelanjutan juga menjadi topik episode podcast [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) di m365.fm.

## 11. Prinsip platform: satu model data, tujuh modul

Menurut FAQ vendor, Polaris adalah platform perangkat lunak smart factory modular yang mencakup optimalisasi produksi mulai dari pemetaan aliran nilai, melalui simulasi dan penjadwalan berbasis AI, hingga eksekusi di lantai produksi dan pelaporan [3]. Situs web menyebut tujuh modul: VSM, BSM, Designer, Simulator, Optimizer, Operator, dan Analyzer. Menurut vendor, semua modul bekerja dengan model data yang sama, sehingga simulasi atau penjadwalan dapat ditambahkan kemudian tanpa mengumpulkan data ulang [3]. Vendor menggambarkan alurnya sebagai sebuah loop: "Map → Simulate → Optimize → Execute → Analyze" [3].

Di halaman beranda bahasa Inggris, iFAKT merangkum penawarannya sebagai berikut: "Polaris combines ERP data with a manufacturing digital twin to optimize schedules" [1]. Fitur inti yang tercantum adalah "Constraint-based scheduling (resources, skills, shifts, buffers)", "What-if simulation for disruptions and mix changes", dan "KPI cockpit: lead time, WIP, utilization, OTD" [1]. Halaman tersebut menyoroti tiga prinsip: menghubungkan ERP, Excel, atau data lantai produksi, atau memulai dengan model ramping ("plug and play"); satu platform untuk pemetaan, simulasi, penjadwalan, dan eksekusi tanpa berpindah alat; serta pemodelan kompleksitas seperti bauran produk, changeover, keterampilan, shift, urutan operasi, buffer, dan gangguan [1][2].

Untuk memulai, FAQ menyebutkan dua jalur: modul VSM dan BSM tersedia dalam paket gratis tanpa kartu kredit; untuk Simulator, Optimizer, dan Operator, vendor menawarkan demo dan uji coba yang dipersonalisasi [3]. Anda tidak harus mengadopsi setiap modul; menurut vendor, banyak perusahaan memulai dengan VSM karena tidak memerlukan integrasi sistem [3]. Untuk simulasi dan penjadwalan, FAQ menyebutkan waktu onboarding khas dua hingga empat minggu, termasuk integrasi data, konfigurasi model, dan pelatihan [3]. Durasi tersebut merupakan klaim vendor; dalam praktiknya, durasi itu sangat bergantung pada kualitas master data dan antarmuka.

Untuk memahami arsitekturnya, akan membantu jika modul-modul dipetakan ke kategori dari Bagian A:

| Modul | Kategori dari Bagian A | Dasar data menurut vendor | Keluaran |
|---|---|---|---|
| VSM | alat VSM khusus | pencatatan manual, opsional ERP, MES, pengumpulan data mesin, data warehouse [6] | peta aliran nilai dengan metrik, skenario |
| BSM | pemodelan proses (swimlane) | pemodelan manual [7] | peta proses dengan garis waktu dan metrik |
| Designer | pemodelan (grafik PPR) | data ERP, bill of materials, waktu proses, sumber daya [8] | model produk-proses-sumber daya, diagram jaringan |
| Simulator | simulasi | model PPR dari Designer [9] | utilisasi, bottleneck, skenario sepanjang waktu |
| Optimizer | APS | model PPR, data ERP, ketersediaan sumber daya [10] | jadwal produksi yang dapat dijalankan |
| Operator | eksekusi di lantai produksi | jadwal dari Optimizer [11] | tugas per pekerja, konfirmasi |
| Analyzer | BI / metrik | metrik dari semua modul [12] | dasbor, rencana vs. realisasi |

Untuk klasifikasi sebagai aplikasi bisnis dalam taksonomi m365.fm, lihat halaman entitas [Business Application](https://www.m365.fm/entity/business-application/).

## 12. Modul satu per satu

### 12.1 Polaris VSM: pemetaan aliran nilai digital

**Tujuan:** [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) adalah modul untuk pemetaan aliran nilai (value stream mapping). Posting Microsoft tentang daftar AppSource menggambarkannya sebagai "alat manajemen lean digital" yang digunakan produsen untuk memetakan rantai pasok dan aliran nilai; sistem rumus serta papan Kanban dan Kaizen dimaksudkan untuk menghitung, memeriksa dan menampilkan KPI, dan tim dapat bekerja sama secara jarak jauh [17].

**Fungsi menurut halaman vendor** [6][14]:
- impor dari sistem ERP, MES, pengumpulan data mesin dan data warehouse melalui Polaris IIoT Gateway, dapat dikombinasikan dengan pengamatan manual di lantai produksi
- perhitungan otomatis "25+ KPI VSM standar," termasuk lead time, rasio nilai tambah, persediaan, OEE, dan takt vs. cycle time; metrik dan rumus kustom dimungkinkan
- "50+ simbol Lean yang telah ditentukan" dengan editor dan pengodean warna
- tiga tingkat hierarki: aliran nilai ujung-ke-ujung (Level 1), sub-proses (Level 2), dan operasi terperinci (Level 3)
- "Pembuatan skenario tanpa batas (A, B, C, D…)," analisis sensitivitas dan perbandingan metrik berdampingan; aliran nilai dapat diduplikasi untuk menguji perubahan tanpa menyentuh produksi
- peran Admin, Editor dan Viewer dalam arsitektur multi-tenant, penyuntingan bersamaan, riwayat versi, pelacakan perubahan, dan dokumentasi tindakan PDCA
- "Ekspor multi-format (JPEG, Excel, SVG)" plus ekspor terenkripsi untuk pengarsipan
- dukungan berlabel "AI-Support" di area laporan dan dasbor, tanpa uraian lebih lanjut

**Bukti di luar situs vendor:** daftar AppSource [15][17]; penggunaan sebagai aplikasi aliran nilai yang terhubung ke basis data deret waktu dalam artikel majalah tentang data aliran nilai yang ditangkap secara otomatis [26].

**Klaim vendor tanpa metodologi:** "VSM lengkap dalam 2-4 jam (vs. 2-3 hari brown paper & Excel)," "akurasi data 100% (tanpa kesalahan Excel manual)," dan "pengurangan risiko implementasi 30-40%" [6]. Halaman produk juga menyebutkan penyelesaian proyek aliran nilai dalam sepertiga waktu [14]. Tidak satu pun klaim ini disertai metodologi. "Akurasi data 100%" secara wajar hanya dapat merujuk pada penghapusan kesalahan penyalinan, bukan kualitas data masukan.

**Batasan dan hal yang tidak didokumentasikan:** Halaman VSM menjelaskan skenario dan analisis sensitivitas tetapi **tidak ada simulasi dinamis** dalam pengertian Bagian 5.3 [6]. Jika Anda ingin mempelajari variabilitas, kerusakan, atau bauran produk dari waktu ke waktu, Anda memerlukan Simulator atau alat simulasi lain. Halaman tidak menyebutkan integrasi dengan Microsoft Teams atau Power BI. Harga tidak dipublikasikan; menurut FAQ, VSM tersedia dalam tingkat gratis [3], yang cakupannya tidak dijelaskan oleh halaman modul.

**Bacaan lanjutan:** kompendium [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · posting [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)

### 12.2 Polaris BSM: proses bisnis sebagai swimlane

**Tujuan:** [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) (Business Swimlane Modeling) menerapkan tampilan aliran nilai pada proses bisnis seperti penawaran harga, rekayasa, rekayasa proses manufaktur, atau pemrosesan pesanan (praktisi lean di AS sering menyebut ini office atau transactional value stream mapping). Daftar AppSource menggambarkannya sebagai "alat pemodelan proses bisnis digital untuk analisis proses bisnis dalam manajemen lean digital" [16].

**Fungsi menurut halaman vendor** [7]:
- pool sebagai wadah organisasi, lane untuk peran, keterampilan atau departemen, yang dapat ditampilkan atau disembunyikan
- pemodelan objek data, penyimpanan data dan sistem TI; putus media antara kertas dan digital atau antar sistem menjadi terlihat
- garis waktu dengan durasi aktivitas pada jalur kritis ditambah lead time dan lag time
- bagan keseimbangan operator (batang bertumpuk dari porsi cycle time) untuk mengidentifikasi ketidakseimbangan
- perhitungan otomatis jalur kritis, lead time, cycle time dan rasio nilai tambah; menurut halaman tersebut "10+" metrik proses standar serta metrik kustom
- klasifikasi sebagai bernilai tambah atau tidak bernilai tambah, kuantifikasi biaya pemborosan
- skenario tanpa batas (saat ini, masa depan, alternatif) dengan analisis dampak
- kartu kaizen yang dibuat saat pemodelan dan dikaitkan dengan aktivitas, diatur dalam siklus PDCA atau DMAIC

**Paket menurut AppSource** [16]: P0 "Read Only" (membaca semua konten), P1 "Basic" (rekaman BPMN, templat swimlane, rumus dasar, lead time, diagram keseimbangan, tampilan edit cepat), P2 "Excellence" (semua fitur dari P0 dan P1) dan P3 "Integrate & Customize" (tanpa deskripsi). Daftar AppSource tidak mencantumkan harga.

**Batasan dan hal yang tidak didokumentasikan:** Halaman modul tidak menyebutkan standar notasi apa pun; hanya daftar AppSource yang menyebut rekaman BPMN pada paket P1 [7][16]. Apakah model BSM dapat diimpor atau diekspor dalam format yang sesuai BPMN tidak didokumentasikan. Halaman BSM tidak menyebutkan format ekspor. Jika Anda mencari suite BPM lengkap dengan eksekusi proses (mesin workflow), BSM, menurut deskripsinya, adalah alat analisis dan perbaikan, bukan otomatisasi proses.

### 12.3 Polaris Designer: model produk-proses-sumber daya

**Tujuan:** Menurut vendor, [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) mengubah data masukan menjadi graf pengetahuan produk-proses-sumber daya (graf pengetahuan PPR) yang terstruktur dan menjadi dasar bersama untuk simulasi dan optimisasi [8]. Modul ini menjadi penghubung antara tampilan value stream dan modul simulasi serta penjadwalan.

**Fungsi menurut halaman vendor** [8]:
- pemodelan PPR: produk sebagai bill of materials manufaktur atau rekayasa (MBOM/EBOM), proses dengan waktu setup, mesin dan penanganan, sumber daya sebagai stasiun, tim dan zona
- data masukan: data ERP, BOM manufaktur, waktu proses, struktur sumber daya dan batasan
- pembuatan otomatis diagram jaringan dari logika produksi, perhitungan jalur kritis
- skenario what-if dan perbandingan lead time saat ini dan yang dioptimalkan
- zona berbasis produk yang mengelompokkan proses menurut keluarga produk dan mendukung penyeimbangan kapasitas

**Penilaian:** Untuk masalah varian yang dijelaskan pada Bagian 5.4, model PPR umumnya lebih cocok daripada peta value stream, karena varian direpresentasikan melalui BOM dan routing-nya, bukan kotak proses individual. Halaman beranda menggunakan istilah "digital twin" untuk model ini [1]; untuk berbagai arti "digital twin," lihat kompendium [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

**Batasan dan hal yang tidak didokumentasikan:** Halaman tidak menyebutkan format atau mekanisme impor, hasil kuantitatif, maupun konfigurasi varian yang eksplisit (misalnya rangkaian aturan untuk produk yang dapat dikonfigurasi) [8]. Cara batasan dimodelkan dalam graf masih terbuka.

### 12.4 Polaris Simulator: skenario dari waktu ke waktu

**Tujuan:** Menurut vendor, [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) menjalankan diagram jaringan dari Designer melalui model stasiun, lini dan hall (tingkat bangunan) yang dapat dikonfigurasi, untuk lini tunggal maupun ganda [9].

**Fungsi menurut halaman vendor** [9]:
- simulasi berdasarkan logika proses nyata dari model PPR
- skenario untuk kapasitas, penugasan personel dan buffer
- analisis campuran produk dinamis pada sumber daya bersama
- deteksi bottleneck dan ketidakseimbangan utilisasi dari waktu ke waktu
- utilisasi orang dan sumber daya teknis berbasis waktu, kelebihan dan kekurangan utilisasi
- transparansi kapasitas lintas shift dan skenario
- konfigurasi stasiun dan rute produksi yang fleksibel

**Penilaian:** Modul ini dengan demikian mencakup pertanyaan yang di Bagian A ditetapkan pada kategori simulasi, terutama campuran produk dan sumber daya bersama. Kutipan pelanggan di halaman beranda (Everllance) menyatakan: "The Polaris simulation helped us identify problems in our planning data" [1]; itu adalah satu kutipan di situs vendor, bukan studi.

**Batasan dan hal yang tidak didokumentasikan:** Halaman tidak menyatakan secara eksplisit jenis simulasi (misalnya discrete-event), tidak mendefinisikan secara rinci metrik keluaran seperti throughput atau WIP, dan tidak memberikan informasi tentang masukan stokastik seperti distribusi kerusakan [9]. Tidak dijelaskan apakah hasil disajikan sebagai distribusi atau nilai tunggal. Untuk sistem konveyor, robotika atau virtual commissioning, alat spesialis dari Bagian 3.3 adalah pilihan yang dimaksudkan; Polaris tidak menyebut dirinya sebagai simulator aliran material 3D.

### 12.5 Polaris Optimizer: penjadwalan di bawah batasan

**Tujuan:** Menurut vendor, [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) mengubah graf PPR menjadi jadwal produksi yang dioptimalkan dan dapat dieksekusi berdasarkan data ERP dan ketersediaan sumber daya [10]. Modul ini sesuai dengan kategori APS.

**Fungsi menurut halaman vendor** [10][13]:
- pertimbangan sumber daya, shift, zona, keterampilan dan kapasitas; prioritas order ditetapkan oleh perencana
- penjadwalan mesin, pekerja dan alat
- tampilan order yang terlambat dan risiko pengiriman
- lot sizing per varian dan mesin, pengurutan berdasarkan waktu changeover antarvarian
- trade-off antara persediaan, biaya penyimpanan dan tingkat layanan
- konfirmasi dari lantai produksi melalui Operator, optimisasi ulang otomatis setelah gangguan dengan analisis dampak
- sumber daya yang dibagi antarproyek
- penjadwalan operasional jangka pendek dan gambaran kapasitas jangka panjang

Menurut FAQ, Polaris menggunakan "algoritma optimisasi berbasis constraint" untuk menghasilkan jadwal yang memperhitungkan kapasitas mesin, keterampilan pekerja, shift, material dan tanggal jatuh tempo [3]. Halaman perencanaan dan eksekusi juga menyebutkan constraint multisumber daya, urutan changeover dan penjadwalan berbasis prioritas; untuk pengujian, data dapat diimpor melalui file, Excel atau ekspor ERP, dan dalam produksi terjadi sinkronisasi berkelanjutan dengan ERP, MES atau sistem lain [13].

**Klaim vendor tanpa metodologi:** Halaman perencanaan mengutip lead time 50 persen lebih pendek, optimisasi kapasitas 40 persen dan usaha perencanaan manual hingga 80 persen lebih sedikit [13]; halaman Optimizer berbicara tentang lead time minimal dan efisiensi biaya maksimal hanya dengan satu klik, serta pengurangan waktu changeover yang signifikan [10]. Baseline, sampel dan metode pengukuran tidak disebutkan.

**Batasan dan hal yang tidak terdokumentasi:** Optimizer digambarkan didukung AI (halaman perencanaan berjudul "AI-powered production planning and scheduling"), tanpa menyebutkan algoritma atau metode yang digunakan [10][13]. Halaman modul tidak memberikan rincian konkret tentang integrasi ERP; FAQ menyebutkan antarmuka standar ke SAP dan Microsoft Dynamics [3]. Perencanaan multi-pabrik atau supply chain tidak dijelaskan. Konteks lebih lanjut ada di kompendium [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

### 12.6 Polaris Operator: tugas untuk lantai produksi

**Tujuan:** Menurut vendor, [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) mengambil jadwal yang sudah dioptimalkan langsung dari Optimizer dan menyajikannya di tingkat tugas di lantai produksi [11].

**Fungsi menurut halaman vendor** [11]:
- tampilan tugas individual dan terkini per pekerja
- tampilan jalur kritis untuk shift leader
- instruksi kerja tertanam dalam tugas
- menjeda atau memblokir tugas, atau menandainya dengan umpan balik terstruktur
- konfirmasi real-time atas kemajuan, keterlambatan, gangguan, staf aktual dan istirahat
- gambaran langsung work in progress bagi perencana
- data produksi dikembalikan ke penjadwalan

**Penilaian:** Operator dirancang sebagai saluran balik antara rencana dan eksekusi: sebuah jadwal hanya sebaik umpan balik tentang apakah jadwal itu bertahan di lantai produksi. Secara fungsional ia tumpang tindih dengan sebagian MES (antrean kerja, konfirmasi), tetapi tidak menyebut dirinya sebagai MES.

**Batasan dan hal yang tidak terdokumentasi:** Halaman ini tidak menyebutkan perangkat yang didukung dan tidak ada metrik kinerja [11]. Hubungan dengan MES yang sudah ada (melengkapi, menggantikan, atau berjalan paralel) tidak dijelaskan; tetapkan hal ini sejak awal proyek untuk menghindari konfirmasi ganda. Informasi lebih lanjut tentang rutinitas harian di lantai produksi ada di kompendium [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 12.7 Polaris Analyzer: dashboard KPI

**Tujuan:** Menurut vendor, [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) menghimpun metrik dari seluruh modul Polaris ke dalam dashboard [12].

**Fungsi menurut halaman vendor** [12]:
- metrik terpusat di seluruh modul Polaris
- visualisasi lead time, utilisasi, bottleneck dan status proyek
- perbandingan skenario, jadwal dan kinerja aktual
- deteksi batas kapasitas dan potensi perbaikan

**Batasan dan hal yang tidak terdokumentasi:** Halaman ini tidak menyebutkan sumber data di luar modul Polaris, jenis dashboard, maupun koneksi ke alat BI eksternal seperti Power BI [12]. Jika perusahaan Anda menjalankan sistem BI terpusat, perjelas bagaimana metrik sampai ke sana. Definisi metrik dibahas dalam kompendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### 12.8 Ikhtisar: apa yang terdokumentasi per modul

| Modul | Funktionsbeschreibung auf ifakt.de | Externe Belege | Nutzenkennzahlen mit Methodik | Wichtigste offene Frage |
|---|---|---|---|---|
| VSM | ausführlich [6][14] | AppSource [15], Tech Community [17], Fachartikel [26] | nein | Umfang der kostenlosen Stufe |
| BSM | ausführlich [7] | AppSource mit Tarifen [16] | nein | Notation, Export |
| Designer | mittel [8] | Fachartikel zum Ansatz [22][24] (indirekt) | nein | Importformate, Variantenlogik |
| Simulator | mittel [9] | WirtschaftsWoche-Preis für Polaris IMS [18] (indirekt) | nein | Simulationsart, Stochastik |
| Optimizer | ausführlich [10][13] | WirtschaftsWoche-Preis für Polaris IMS [18] (indirekt) | nein (Kennzahlen ohne Methodik) | Algorithmen, ERP-Integration |
| Operator | mittel [11] | WirtschaftsWoche-Preis für Polaris IMS [18] (indirekt) | nein | Geräte, MES-Grenze |
| Analyzer | knapp [12] | keine | nein | Anbindung an externe BI |

## 13. Polaris IMS und der Best of Technology Award 2025

Neben den sieben Modulnamen begegnet Ihnen der Name **Polaris IMS**. Unter diesem Namen hat die iFAKT GmbH am Best of Technology Award 2025 der WirtschaftsWoche, einem deutschen Wirtschaftswochenmagazin, teilgenommen. Auf der Gewinnerseite der WirtschaftsWoche wird iFAKT mit Polaris IMS (dort als Produktionsplanungssystem beschrieben) in der Kategorie **Produktion auf Platz zwei** geführt, hinter Skeleton Technologies und vor OMRON Electronics [18]. Weitere Finalisten der Kategorie waren remberg und UNWARE [19].

Die Jurybeschreibung (auf Deutsch) nennt Polaris IMS ein intelligentes System, das einen digitalen Zwilling der Produktion aufbaut und den effizienten Ressourceneinsatz automatisch plant; der Plan wird in der Fertigung umgesetzt und mit Echtzeitdaten überwacht, und treten Störungen auf, schlägt KI Verbesserungen vor [18][19]. Nach Einschätzung des Autors entspricht dies funktional dem Zusammenspiel von Designer, Simulator, Optimizer und Operator. Auch ein Kundenzitat auf der Startseite (Silhouette) verwendet den Namen: „The use of Polaris IMS was the next step towards the Smart Factory for our organization“ [1]. Auf der Sponsorenseite der Lean-Veranstaltung Lean Around The Clock 2025 beschreibt sich iFAKT mit einer „POLARIS suite“ aus den Modulen IMS, BSM und VSM [20].

**Interpretation:** Auf Grundlage dieser Quellen ist IMS die Bezeichnung für den Teil der Plattform, der über Wertstrom- und Prozessmodellierung hinausgeht, also Modellierung, Simulation, Ablaufplanung und Ausführung. Die aktuelle Website teilt diesen Teil in einzelne Module auf und verwendet den Namen IMS nur im Kundenzitat [1]. Der Anbieter hat keine offizielle Zuordnung von IMS zu den heutigen Modulnamen veröffentlicht; die Zuordnung ist die Interpretation des Autors.

**Was der Preis aussagt:** Der Best of Technology Award ist ein Jurypreis einer Wirtschaftspublikation. Er zeigt, dass eine Jury das Konzept unter den Einreichungen der Kategorie Produktion hoch bewertet hat. Er ist kein funktionaler oder leistungsbezogener Test und ersetzt keine Prüfung mit den eigenen Daten. Für US-Leser: Es handelt sich um einen Preis einer deutschen Publikation, vergeben an Einreichungen, die sie bewertet hat; betrachten Sie ihn daher als einen Datenpunkt und nicht als Marktbestätigung.

## 14. Industri menurut perusahaan

Informasi berikut berasal dari situs web iFAKT GmbH. Informasi ini dilaporkan sendiri oleh perusahaan; cakupan dan durasi setiap hubungan pelanggan tidak dinyatakan.

| Industri menurut ifakt.de | Deskripsi di situs web | Perusahaan yang disebutkan (logo, referensi, kutipan) |
|---|---|---|
| Kedirgantaraan dan penerbangan | presisi tinggi untuk industri kedirgantaraan [2] | Airbus [1] |
| Otomotif dan mobilitas | produksi just-in-time dan just-in-sequence dari manufaktur komponen hingga perakitan akhir [2] | Magna, Vitesco, ZF, Junghans [1] |
| Teknik mesin dan otomasi | engineer-to-order hingga batch kecil, BOM dan manufaktur varian [2] | Karl Dungs, Pfannenberg, Weidmüller, GRASS [1] |
| Energi dan infrastruktur | perencanaan produksi untuk infrastruktur kritis [2] | MAN Energy, Siemens Energy, Liebherr [1] |

Deretan logo di halaman beranda bahasa Inggris juga menampilkan FFG, Fraunhofer, Helbling, Jumo, Liebherr, Pfannenberg, Silhouette, Airbus, Dungs dan Eismann [1]. Kutipan berasal dari Silhouette, Airbus dan Everllance [1], dan pada halaman produk VSM ditambah dari Siemens Energy mengenai pendampingan oleh iFAKT [14]. Halaman perusahaan juga mencantumkan teknologi medis sebagai industri [4]. FAQ menyatakan Polaris "dibangun untuk perusahaan manufaktur di bidang kedirgantaraan, otomotif, teknik mesin, dan energi", dan menyebutkan manajer produksi, konsultan lean serta tim operasi sebagai pengguna yang dituju [3].

**Yang dapat disimpulkan:** Fokusnya adalah manufaktur diskret dan perakitan dengan variasi tinggi serta produk yang kompleks. Untuk industri proses (kimia, farmasi, pangan dengan resep dan batch), vendor tidak menyebutkan referensi apa pun. Pelanggan yang disebutkan sebagian besar adalah perusahaan Eropa atau lokasi Eropa dari grup internasional; halaman yang ditinjau tidak menyebutkan pabrik di AS sebagai referensi.

## 15. Polaris dalam ekosistem Microsoft

Bagi perusahaan yang sangat bergantung pada Microsoft, poin-poin berikut terdokumentasi:

- **Daftar AppSource:** Polaris VSM ("Polaris VSM - Digital Value Stream Mapping") dan Polaris BSM ("Polaris BSM - Business Swimlane Modeling") terdaftar sebagai solusi iFAKT GmbH di Microsoft AppSource [15][16].
- **Microsoft Tech Community:** Pada 11 Juli 2024, blog Marketplace di Tech Community menerbitkan unggahan tentang Polaris VSM di bawah "ISV Success for Business Applications." Menurut Microsoft, program ini menawarkan "platform, sumber daya, dan dukungan yang dirancang untuk membantu mitra mengembangkan, menerbitkan, dan memasarkan aplikasi bisnis" [17].
- **Hosting:** Halaman modul VSM dan BSM menyatakan "Di-host di Microsoft Azure West Europe" [6][7]. Daftar wilayah Microsoft menempatkan West Europe di Belanda [43]. FAQ berbicara lebih umum tentang "infrastruktur cloud Eropa yang aman" [3].
- **Integrasi ERP:** Menurut FAQ, Polaris dapat terhubung ke SAP, Microsoft Dynamics dan platform ERP lainnya melalui antarmuka standar, serta dapat mengimpor data dari spreadsheet dan file CSV [3].
- **Status mitra:** Halaman perusahaan menyebutkan status Microsoft Gold Partner (dicapai pada 2019) dan kompetensi "Gold Application Development" untuk kesepuluh kalinya berturut-turut [4]. Menurut Microsoft, kompetensi Gold dan Silver hanya dapat diperpanjang hingga 30 September 2022; sejak 3 Oktober 2022, Microsoft memberikan penetapan Solutions Partner sebagai gantinya [38]. Pernyataan ini oleh karena itu menggambarkan status historis.

**Tidak terdokumentasi:** Integrasi native dengan Microsoft Teams, konektor Power BI, single sign-on dengan Microsoft Entra ID, atau ketersediaan sebagai ekstensi Dynamics 365 tidak disebutkan pada halaman yang ditinjau. Daftar AppSource berarti Anda dapat membeli melalui marketplace Microsoft, bukan secara otomatis integrasi mendalam. Jika poin-poin ini penting bagi Anda, minta konfirmasinya secara tertulis selama proses seleksi. Latar belakang lebih lanjut tentang TI manufaktur di Azure tersedia dalam kompendium [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## 16. Keamanan, hosting dan sertifikasi

| Aspek | Pernyataan | Sumber | Status |
|---|---|---|---|
| ISO 9001 | tersertifikasi DIN EN ISO 9001, berlaku sejak Oktober 2014 | halaman perusahaan [4] | pernyataan vendor, didokumentasikan di situs web |
| ISO/IEC 27001 | "TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified" (lencana); FAQ: tersertifikasi ISO 27001 dan ISO 9001, diaudit oleh TÜV SÜD | halaman utama, FAQ [1][2][3] | pernyataan vendor; sertifikat beserta ruang lingkupnya belum dilihat secara publik |
| Hosting | Microsoft Azure West Europe, berlokasi di Belanda (VSM, BSM); "infrastruktur cloud Eropa yang aman" (FAQ) | halaman modul, FAQ, daftar region Microsoft [3][6][7][43] | pernyataan vendor |
| Enkripsi, peran, audit | enkripsi, kontrol akses berbasis peran, dan audit keamanan berkala | FAQ [3] | pernyataan vendor |
| Isolasi tenant, autentikasi | lingkungan tenant yang terisolasi, OAuth 2.0 | halaman BSM [7] | pernyataan vendor |
| GDPR | "100% sesuai GDPR" | halaman VSM dan BSM [6][7] | pernyataan vendor; kepatuhan bukan sertifikasi |
| SOC 2 | tidak disebutkan pada halaman yang ditinjau | t/a | tanyakan ke vendor |
| Region hosting AS | tidak disebutkan pada halaman yang ditinjau | t/a | tanyakan ke vendor |

**Cara membaca ini:** Sertifikasi ISO/IEC 27001 mencakup sistem manajemen sebuah organisasi dalam ruang lingkup yang ditentukan. Selama pemilihan, mintalah untuk melihat sertifikatnya dan periksa apakah pengembangan dan operasi Polaris termasuk dalam ruang lingkup serta berapa lama masa berlakunya. TÜV SÜD adalah badan pengujian dan sertifikasi Jerman. "Sesuai GDPR" adalah penilaian mandiri; yang penting adalah perjanjian pemrosesan data, daftar sub-prosesor, dan langkah-langkah teknis serta organisasi. Jika tim keamanan Anda memerlukan laporan SOC 2 (Bagian 5.8), tanyakan sejak awal; halaman yang ditinjau hanya menyebutkan sertifikasi ISO. Jika Anda membutuhkan instalasi di pusat data sendiri: opsi on-premises tidak disebutkan pada halaman yang ditinjau; FAQ hanya menyebutkan operasi di infrastruktur cloud Eropa [3]. Bagi perusahaan AS, ini juga berarti bahwa menurut halaman yang ditinjau, data dihosting di luar AS; periksa hal itu terhadap kontrak pelanggan dan, di bidang kedirgantaraan dan pertahanan, terhadap aturan pengendalian ekspor.

## 17. Apa yang dijanjikan vendor dan cara mengujinya

Halaman utama mencantumkan sebagai hasil pengurangan waktu tunggu "Up To 50%" (dijelaskan sebagai "Average decrease in production cycle time"), optimalisasi kapasitas "Up To 40%" ("Improvement in machine utilization rates"), dan peningkatan kualitas "Up To 25%" ("Reduction in schedule deviations and missed deadlines") [1]. Halaman perencanaan juga menyebutkan hingga 80 persen pengurangan upaya perencanaan manual [13]. Untuk angka-angka ini tidak dipublikasikan baseline, jumlah proyek, atau metode pengukurannya. Perhatikan redaksi di halaman utama: "Up To 50%" di samping "Average decrease" mencampuradukkan nilai maksimum dengan rata-rata, yang menjadi alasan lain untuk menanyakan bagaimana angka tersebut dihitung.

Klaim semacam ini umum di pasar ini. Siemens, misalnya, menyebutkan hingga 50 persen persediaan lebih rendah dan hingga 50 persen ketepatan pengiriman lebih baik untuk Opcenter APS [36]. Baca angka seperti ini sebagai batas atas dari kasus individual, bukan sebagai nilai yang diharapkan, siapa pun vendornya.

Cara mengubah janji menjadi pernyataan yang dapat diuji:

1. **Minta perhitungannya:** Nilai baseline dan target yang mana, selama periode berapa lama, pada pelanggan yang mana, dengan definisi waktu tunggu yang bagaimana?
2. **Minta panggilan referensi** dengan pengguna dari industri dan jenis manufaktur Anda, idealnya lokasi di AS jika itu penting bagi Anda.
3. **Sepakati pilot dengan kriteria keluar:** satu value stream, data Anda sendiri, metrik dan target yang ditentukan sebelumnya.
4. **Bandingkan rencana dan realisasi** dalam pilot: Apakah jadwal dari Optimizer bertahan di lantai produksi? Seberapa sering Anda harus menjadwal ulang?
5. **Nilai upaya secara jujur:** Berapa lama pembersihan master data memakan waktu, dan berapa lama integrasi antarmuka?

Langkah uji ini berlaku sama untuk setiap vendor di Bagian A.

## 18. Untuk siapa Polaris cocok dan untuk siapa tidak

**Berdasarkan deskripsi fungsinya, Polaris layak dipertimbangkan jika**
- Anda menjalankan manufaktur diskret atau perakitan dengan banyak varian, BOM, dan sumber daya bersama,
- Anda ingin menghubungkan value stream mapping, simulasi, dan penjadwalan pada satu model data bersama, bukan memindahkan data antar alat,
- Anda ingin memulai dengan value stream mapping tanpa integrasi sistem, lalu menambahkan penjadwalan dan eksekusi kemudian,
- Anda ingin meninjau proses bisnis di luar produksi (penawaran harga, teknik, pemrosesan pesanan) dengan logika lean yang sama (BSM),
- solusi cloud yang di-hosting di UE sesuai dengan kebijakan TI Anda.

**Polaris kemungkinan kurang cocok jika**
- Anda hanya mendokumentasikan peta value stream sesekali; dalam kasus itu, alat gambar dengan templat biasanya sudah cukup (Bagian 3.1),
- Anda memerlukan simulasi aliran material 3D yang terperinci dengan konveyor, robotika, atau virtual commissioning; alat simulasi khusus dirancang untuk itu (Bagian 3.3),
- Anda bekerja di industri proses dengan resep dan batch, yang untuknya vendor tidak menyebutkan referensi,
- Anda memerlukan instalasi di pusat data Anda sendiri atau wilayah hosting AS, yang keduanya tidak dijelaskan pada halaman yang ditinjau,
- Anda mensyaratkan laporan SOC 2 sebagai prasyarat, yang tidak disebutkan pada halaman yang ditinjau,
- Anda mencari perencanaan rantai pasok penuh atau multi-pabrik, yang tidak dijelaskan pada halaman modul,
- Anda sudah menjalankan APS dan MES yang menjawab pertanyaan penjadwalan Anda; dalam kasus itu, timbang nilai tambahnya secara terpisah terhadap alat VSM murni,
- Anda memerlukan harga publik atau penilaian analis independen sebelum membuat daftar pendek.

**Alternatif menurut kategori:** untuk dokumentasi murni, Visio, Lucidchart, atau Miro [27][28][29]; untuk value stream dengan metrik dan simulasi opsional, eVSM [42], SimVSM [30][31], atau visTable dengan konteks tata letak [32]; untuk value stream dengan simulasi, Plant Simulation X dengan pustaka VSM [33]; untuk rekonstruksi value stream berbasis data, ONIQ [35]; untuk APS, misalnya Opcenter APS [36]. Ini adalah seleksi sebagai orientasi, bukan peringkat.

## 19. FAQ

### Apa itu perangkat lunak value stream mapping?
Perangkat lunak value stream mapping mendukung value stream mapping dan perancangan kondisi masa depan secara digital. Jangkauannya mulai dari alat gambar dengan simbol lean, melalui alat khusus dengan perhitungan metrik otomatis dan skenario, hingga platform yang mencakup simulasi dan penjadwalan produksi (Bagian 3).

### Apa perangkat lunak value stream mapping terbaik?
Tidak ada satu alat terbaik, karena setiap kategori menjawab pertanyaan yang berbeda. Untuk lokakarya dan dokumentasi, alat gambar dengan templat VSM biasanya sudah cukup. Untuk pekerjaan value stream rutin dengan metrik, alat VSM khusus cocok. Untuk variabilitas dan bauran produk diperlukan simulasi, dan untuk tenggat waktu di bawah kendala diperlukan sistem APS. Gunakan panduan keputusan di Bagian 4 dan daftar periksa di Bagian 6, dan berhati-hatilah terhadap peringkat yang ditulis oleh vendor atau didanai oleh mereka; dua halaman peringkat AS terpanjang untuk kata kunci ini masing-masing termasuk salah satunya [47][48].

### Apakah ada perangkat lunak value stream mapping gratis?
Ya, di beberapa kategori. Alat gambar dan papan tulis seperti Lucidchart dan Miro menawarkan tingkat masuk gratis dengan bentuk atau templat VSM [28][29]. Di iFAKT Polaris, modul VSM dan BSM tersedia dalam tingkat gratis tanpa kartu kredit, menurut FAQ [3]; vendor tidak menjelaskan secara rinci cakupan tingkat tersebut. Untuk penawaran gratis apa pun, periksa batas pengguna, opsi ekspor, dan penyimpanan data.

### Bisakah saya melakukan value stream mapping di Excel atau Visio?
Bisa. Templat Excel cocok untuk peta kecil dan perhitungan sederhana, tetapi setiap perubahan harus dibawa secara manual, dan versinya cepat bertambah (Bagian 2). Microsoft Visio memiliki templat value stream map; menurut Microsoft, templat itu memerlukan Visio Professional (atau edisi Premium yang lebih lama) dan tidak termasuk dalam Visio Standard [27]. Baik Excel maupun Visio tidak mensimulasikan variabilitas.

### Apa perbedaan antara perangkat lunak value stream mapping dan perangkat lunak simulasi?
Perangkat lunak value stream mapping biasanya menghitung secara statis dengan rata-rata: hari persediaan, lead time, rasio nilai tambah. Perangkat lunak simulasi memodelkan operasi dari waktu ke waktu, termasuk variabilitas, kerusakan, bauran produk, dan sumber daya bersama [22][33][37]. Perbandingan dua peta berdampingan bukanlah simulasi.

### Apa perbedaan antara value stream mapping dan process mapping?
Value stream map mengikuti satu product family di seluruh alur, dari supplier hingga customer, dan menunjukkan aliran material, aliran informasi, inventori, serta garis lead time. Process map (seperti swimlane diagram atau model BPMN) menunjukkan langkah, peran, dan keputusan dari satu proses secara rinci. Keduanya bisa digabungkan: di Polaris, VSM mencakup value stream dan BSM mencakup swimlane process map [6][7].

### Apakah "value stream management software" itu sama?
Tidak selalu. Dalam manufaktur, value stream management berarti manajemen berkelanjutan di sepanjang value stream (ISO 22468 [39]). Dalam pengembangan perangkat lunak, platform "value stream management" mengukur aliran work item dari tiket hingga deployment. Beberapa daftar artikel dari AS mencampuradukkan keduanya [50]. Periksa apakah sebuah alat menangani material, inventori, dan mesin sebelum Anda memasukkannya ke daftar pendek.

### Apa itu iFAKT Polaris?
Sebuah platform perangkat lunak modular dari iFAKT GmbH (Stuttgart, Jerman) untuk optimalisasi produksi, mulai dari value stream mapping, melalui simulasi dan penjadwalan, hingga eksekusi di shop floor dan pelaporan. Menurut vendor, platform ini terdiri dari tujuh modul dengan satu model data bersama: VSM, BSM, Designer, Simulator, Optimizer, Operator, dan Analyzer [3].

### Apa itu Polaris IMS?
Dengan nama Polaris IMS, iFAKT meraih peringkat kedua dalam kategori Production pada Best of Technology Award 2025 dari majalah bisnis mingguan Jerman WirtschaftsWoche [18]. Deskripsi juri menyebutkan digital twin produksi, perencanaan sumber daya otomatis, eksekusi shop floor dengan pemantauan real-time, dan usulan AI ketika terjadi gangguan [18][19]. Pada situs web saat ini, cakupan ini tersebar di modul Designer, Simulator, Optimizer, dan Operator (Bagian 13; pemetaan ini merupakan interpretasi penulis).

### Bisakah Polaris VSM melakukan simulasi?
Halaman modul Polaris VSM menjelaskan skenario, analisis sensitivitas, dan perbandingan metrik, tetapi tidak menyebutkan simulasi dinamis [6]. Simulasi disediakan oleh modul Simulator yang terpisah, yang bekerja pada model produk-proses-sumber daya dari Designer [9].

### Data apa yang dibutuhkan Polaris, dan apakah saya harus menghubungkan ERP saya?
Tidak untuk VSM dan BSM: menurut vendor, tidak diperlukan integrasi sistem untuk memulai [3]. Simulasi dan penjadwalan membutuhkan data tentang produk, BOM, waktu proses, dan sumber daya; untuk pengujian melalui file, Excel, atau ekspor ERP, dan di produksi melalui sinkronisasi berkelanjutan dengan ERP, MES, atau sistem lain [13]. Menurut FAQ, tersedia antarmuka standar ke SAP dan Microsoft Dynamics [3].

### Apakah Polaris terintegrasi dengan Microsoft 365 atau Teams?
Yang terdokumentasi adalah listing AppSource untuk Polaris VSM dan BSM [15][16], sebuah posting Microsoft Tech Community [17], dan hosting VSM serta BSM di Microsoft Azure West Europe menurut halaman modul [6][7]. Integrasi dengan Teams atau Power BI tidak disebutkan pada halaman yang ditinjau.

### Di mana Polaris di-hosting, dan apakah iFAKT memiliki SOC 2?
Halaman VSM dan BSM menyebutkan Microsoft Azure West Europe [6][7], sebuah region yang berlokasi di Belanda [43]; FAQ menyebut infrastruktur cloud Eropa [3]. Situs web menyatakan sertifikasi ISO 9001 (sejak Oktober 2014) dan ISO/IEC 27001 oleh TÜV SÜD [1][3][4]. Laporan SOC 2 dan region hosting di AS tidak disebutkan pada halaman yang ditinjau. Mintalah sertifikat beserta lingkupnya, dan tanyakan langsung tentang SOC 2 jika tim keamanan Anda memerlukannya.

### Berapa lama implementasinya?
Menurut vendor, VSM dan BSM tidak memerlukan pengaturan; untuk simulasi dan penjadwalan, FAQ memberikan perkiraan waktu onboarding tipikal dua sampai empat minggu, termasuk integrasi data, konfigurasi model, dan pelatihan [3]. Durasi sebenarnya terutama bergantung pada kualitas master data dan antarmuka.

### Berapa biaya Polaris?
Vendor tidak mempublikasikan harga. Listing AppSource BSM menyebutkan paket dari "Read Only" hingga "Integrate & Customize" tanpa harga [16]; untuk Simulator, Optimizer, dan Operator, FAQ menawarkan demo dengan uji coba [3].

### Apa alternatif dari Polaris?
Itu bergantung pada kategorinya: alat gambar seperti Visio, Lucidchart, atau Miro untuk dokumentasi [27][28][29]; alat khusus seperti eVSM, SimVSM, atau visTable [42][30][32]; simulasi dengan Plant Simulation, AnyLogic, atau FlexSim [33][34]; pendekatan berbasis data seperti ONIQ [35]; dan sistem APS seperti Opcenter APS [36]. Bagian 4 membandingkan kategori-kategori tersebut.

## 20. Kesimpulan

Jika Anda memilih perangkat lunak value stream mapping, jangan mulai dari nama produk; mulailah dari pertanyaan yang harus dijawab oleh perangkat lunak tersebut. Dokumentasi, evaluasi berkala dengan metrik, simulasi dinamis, penjadwalan dengan kendala, dan analisis berkelanjutan atas data aktual adalah pekerjaan yang berbeda, dan ditangani oleh kategori perangkat lunak yang berbeda. Daftar periksa pemilihan di Bagian 6 dan logika studi kelayakan bisnis di Bagian 9 membantu Anda membuat penawaran yang dapat dibandingkan tanpa mengandalkan angka dalam brosur. Untuk pembeli di AS, tambahkan wilayah hosting, cakupan SOC 2 atau ISO/IEC 27001, dan, jika relevan, kontrol ekspor ke dalam daftar sejak awal.

iFAKT Polaris adalah salah satu platform yang menghubungkan beberapa kategori pada model data bersama: analisis value stream dan proses (VSM, BSM), pemodelan produk-proses-sumber daya (Designer), simulasi, penjadwalan berbasis kendala (Optimizer), manajemen tugas di lantai produksi (Operator), dan pelaporan (Analyzer). Yang dapat diverifikasi: deskripsi fungsi di halaman vendor, dua daftar AppSource, sebuah postingan Microsoft Tech Community, peringkat kedua di kategori Production pada 2025 Best of Technology Award, kolaborasi riset ECOWERT dengan Fraunhofer IPA, serta serangkaian artikel jurnal ZWF yang mencakup dua belas tahun. Tidak terdokumentasi: angka manfaat dengan metodologi yang diungkapkan, simulasi dalam modul VSM, integrasi Teams atau Power BI, wilayah hosting di AS, laporan SOC 2, dan harga publik.

Bagi produsen diskret dengan banyak varian yang ingin beralih dari value stream ke jadwal, Polaris, berdasarkan deskripsi fungsinya, merupakan kandidat untuk uji coba (pilot). Untuk dokumentasi murni, simulasi aliran material 3D, atau industri proses, kategori lain lebih sesuai. Dalam setiap kasus: putuskan berdasarkan uji coba dengan data dan metrik Anda sendiri yang didefinisikan sebelumnya, bukan berdasarkan teks ini maupun teks lainnya.

## Bacaan lebih lanjut di m365.fm

**Entitas**
- [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [Business Application](https://www.m365.fm/entity/business-application/)
- Modul: [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)
- Tokoh: [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Postingan dan episode**
- [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- Podcast: [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Kompendium**
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

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Moderator von m365.fm und arbeitet bei iFAKT GmbH. Auf m365.fm schreibt er über Wertstrommanagement, Produktionsplanung und die digitale Transformation der Fertigung im Microsoft-Ökosystem.

> **Hinweis: Der Autor arbeitet bei iFAKT GmbH.**

*iFAKT GmbH ([Entity-Seite](https://www.m365.fm/entity/ifakt/)) ist der Anbieter von iFAKT Polaris.*

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
