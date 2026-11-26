# SEO metadata

| Field | Value |
|---|---|
| Meta title | Panduan Perencanaan Penjualan dan Operasi (S&OP), MPS, MRP |
| Meta description | Perencanaan penjualan dan operasi, MPS dan MRP dijelaskan: siklus S&OP bulanan, perhitungan netting MRP, DDMRP, opsi ERP, KPI dan templat. |
| Slug | `sop-mrp-production-planning` |

# Perencanaan Penjualan dan Operasi (S&OP) dan MRP: Cara Kerja Perencanaan Produksi dari Rencana hingga Komponen

> **Jawaban singkat:** Sales and operations planning (S&OP) adalah proses manajemen bulanan di mana penjualan, operasi, rantai pasok, dan keuangan menyepakati satu rencana tunggal untuk permintaan, pasokan, dan persediaan per keluarga produk, biasanya pada horizon bergulir 18 hingga 36 bulan [5][6]; sumber akademik menggambarkan inti taktisnya mencapai sekitar 18 bulan [1]. Master production schedule (MPS) menerjemahkan rencana tersebut menjadi kuantitas item akhir per minggu, dan material requirements planning (MRP) menguraikan MPS melalui bill of material menjadi pesanan berjadwal untuk setiap komponen dan bahan baku [7][13]. Di sebagian besar pabrik, MPS dan MRP berjalan di dalam sistem ERP; S&OP berjalan dalam siklus rapat yang didukung oleh spreadsheet, ERP, atau perangkat lunak perencanaan khusus.

> **Poin-poin utama**
> - S&OP memutuskan *berapa banyak* per keluarga produk dan bulan; MPS memutuskan *item akhir mana* per minggu; MRP memutuskan *komponen mana, berapa banyak, dan kapan*. Penjadwalan detail (urutan per mesin dan per jam) berada di bawahnya dan dibahas dalam [panduan penjadwalan produksi dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
> - Konsep S&OP berakar pada perencanaan produksi agregat pada tahun 1950-an; konsultan Oliver Wight membentuk S&OP modern pada tahun 1980-an dan mencetuskan integrated business planning (IBP) pada awal tahun 2000-an [1][2].
> - Joseph Orlicky merumuskan MRP secara formal pada tahun 1964; Black & Decker adalah pengguna pertama, dan pada tahun 1981 sekitar 8.000 perusahaan menjalankan MRP [3][4]. Oliver Wight memperluasnya menjadi MRP II pada tahun 1983 [3].
> - Siklus S&OP bulanan yang umum memiliki lima langkah: pengumpulan data, tinjauan permintaan, tinjauan pasokan, rapat pra-S&OP (rekonsiliasi), dan rapat S&OP eksekutif [1].
> - MRP mengasumsikan kapasitas tak terbatas dan lead time tetap; itulah sebabnya MRP memerlukan pemeriksaan kapasitas kasar di atasnya dan penjadwal berhingga di bawahnya [8][9].
> - Perubahan kecil pada MPS dapat menggeser pesanan pada beberapa level BOM sekaligus ("nervousness"). Membekukan jadwal jangka pendek dan aturan biaya perubahan lebih efektif meredamnya dibandingkan menambah persediaan pengaman [10].
> - DDMRP menggantikan penguraian berbasis peramalan di titik decoupling tertentu dengan buffer berukuran (merah, kuning, hijau) dan persamaan net flow [11][12].
> - Ukur S&OP dengan akurasi peramalan (WMAPE) *dan* bias, pencapaian rencana, stabilitas jadwal, dan tingkat layanan. Peramalan yang akurat 94% tetapi selalu 2% terlalu tinggi tetap menumpuk persediaan.

## Daftar isi

1. [Apa itu sales and operations planning? Definisi dan ruang lingkup](#apa-itu-sales-and-operations-planning-definisi-dan-ruang-lingkup)
2. [Hierarki perencanaan produksi: S&OP, MPS, RCCP, MRP dan penjadwalan](#hierarki-perencanaan-produksi-sop-mps-rccp-mrp-dan-penjadwalan)
3. [Sejarah: dari aggregate planning dan Orlicky ke IBP dan DDMRP](#sejarah-dari-aggregate-planning-dan-orlicky-ke-ibp-dan-ddmrp)
4. [Proses S&OP: siklus bulanan langkah demi langkah](#proses-sop-siklus-bulanan-langkah-demi-langkah)
5. [Strategi pasokan: level, chase atau hybrid (contoh kasus)](#strategi-pasokan-level-chase-atau-hibrida-contoh-terperinci)
6. [S&OP vs. IBP vs. S&OE](#sop-vs-ibp-vs-soe)
7. [Model kematangan S&OP](#model-kematangan-sop)
8. [Master production schedule (MPS) dan available to promise (ATP)](#master-production-schedule-mps-dan-available-to-promise-atp)
9. [Rough-cut capacity planning (RCCP)](#perencanaan-kapasitas-kasar-rccp)
10. [Material requirements planning (MRP): cara kerja perhitungannya](#material-requirements-planning-mrp-cara-kerja-perhitungannya)
11. [MRP II, CRP dan closed loop](#mrp-ii-crp-dan-lingkaran-tertutup)
12. [Nervousness MRP: mengapa rencana melompat dan cara menenangkannya](#nervositas-mrp-mengapa-rencana-melonjak-dan-cara-meredakannya)
13. [Demand driven MRP (DDMRP)](#demand-driven-mrp-ddmrp)
14. [Perencanaan produksi di ERP: apa yang dilakukan sistem dan di mana batasnya](#perencanaan-produksi-di-erp-apa-yang-dilakukan-sistem-dan-di-mana-batasnya)
15. [Templat: kalender S&OP, agenda, family plan, catatan MPS dan MRP](#templat-kalender-sop-agenda-rencana-keluarga-catatan-mps-dan-mrp)
16. [KPI S&OP dan MRP dengan contoh kasus](#kpi-sop-dan-mrp-dengan-contoh-perhitungan)
17. [Peta jalan implementasi: 12 bulan menuju S&OP dan MRP yang berjalan](#roadmap-implementasi-12-bulan-menuju-sop-dan-mrp-yang-berjalan)
18. [Kesalahan umum](#kesalahan-umum)
19. [Batasan S&OP dan MRP](#batasan-sop-dan-mrp)
20. [AI dan perencanaan digital: yang sudah berhasil saat ini](#ai-dan-perencanaan-digital-apa-yang-berhasil-saat-ini)
21. [Glosarium](#glosarium)
22. [FAQ: sales and operations planning dan MRP](#faq-perencanaan-penjualan-dan-operasi-serta-mrp)
23. [Kesimpulan dan langkah awal](#kesimpulan-dan-langkah-pertama)

## Apa itu sales and operations planning? Definisi dan ruang lingkup

**Sales and operations planning (S&OP)** adalah proses pengambilan keputusan berulang yang mengintegrasikan perkiraan permintaan dengan perencanaan pasokan menjadi satu rencana yang menjadi acuan bersama bagi penjualan, pemasaran, operasi, supply chain, dan keuangan [1]. Literatur akademik menggambarkannya sebagai proses taktis dengan horizon hingga sekitar 18 bulan, biasanya dijalankan setiap bulan atau dipicu oleh kejadian tertentu [1]. Sumber vendor dan praktisi sering menggambarkan horizon bergulir 18 hingga 36 bulan [5][6]. Perbedaan ini bukan kontradiksi: bulan-bulan awal direncanakan lebih rinci, sedangkan bulan-bulan berikutnya hanya dalam bentuk keluarga produk dan blok kapasitas.

Tiga ciri membedakan S&OP dari rapat perkiraan penjualan atau rapat produksi:

- **Satu set angka.** Permintaan, pasokan, persediaan atau backlog, serta nilai finansial rencana ditinjau bersama, per keluarga produk, dalam unit dan dolar.
- **Keputusan, bukan laporan.** Hasilnya adalah serangkaian keputusan: menyetujui peningkatan kapasitas, menerima tingkat layanan yang lebih rendah untuk keluarga produk yang lambat, menunda peluncuran, atau membangun persediaan lebih awal sebelum shutdown.
- **Integrasi, bukan koordinasi.** Rogelio Oliva dan Noel Watson menunjukkan dalam sebuah studi kasus bahwa S&OP memberi nilai tambah ketika fungsi-fungsi merencanakan *bersama-sama terhadap target bersama*, bukan ketika mereka hanya mengoordinasikan rencana yang masing-masing dibuat sendiri [21].

Badan profesional untuk body of knowledge S&OP, master scheduling, dan MRP di AS dikelola oleh ASCM (Association for Supply Chain Management, sebelumnya APICS). Program CPIM (Certified in Planning and Inventory Management) mencakup S&OP, demand, supply, persediaan, dan jadwal detail sebagai modul terpisah [24].

### Perencanaan, bukan penjadwalan

S&OP bukan jadwal produksi. Ia bekerja dengan keluarga produk, periode bulanan, dan kapasitas agregat seperti "jam pengelasan" atau "shift lini 2." Pertanyaan "pesanan mana yang berjalan lebih dulu di mesin 14 besok" termasuk penjadwalan detail, yang dibahas secara mendalam dalam [panduan penjadwalan produksi dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/), termasuk finite capacity scheduling dan drum-buffer-rope. Artikel ini tetap berada satu tingkat di atasnya dan menghubungkan S&OP dengan master production schedule dan MRP.

### Untuk apa S&OP digunakan

Tabel berikut menunjukkan keputusan tipikal yang hanya dapat diambil oleh S&OP lintas fungsi, karena tidak ada satu fungsi pun yang memiliki biaya sekaligus manfaatnya.

| Keputusan | Pihak yang diuntungkan | Pihak yang menanggung biaya | Mengapa memerlukan S&OP |
|---|---|---|---|
| Menambah shift kedua di pengelasan mulai Maret | Penjualan (tingkat layanan) | Operasi (biaya tenaga kerja), SDM (perekrutan) | trade-off antara pendapatan dan biaya |
| Memproduksi di muka 2.000 unit sebelum penghentian operasi musim panas | Pelanggan, penjualan | Keuangan (modal kerja), gudang | investasi persediaan harus disetujui |
| Menghentikan varian dengan margin rendah | Operasi (lebih sedikit pergantian produk) | Penjualan (kehilangan pendapatan) | keputusan portofolio dengan dampak margin |
| Menerima pesanan promosi dalam jumlah besar | Penjualan, pemasaran | Operasi (lembur), pengadaan | kelayakan kapasitas dan material |
| Mengkualifikasi pemasok kedua untuk komponen kritis | Rantai pasok (risiko) | Pengadaan, kualitas (biaya kualifikasi) | ketahanan versus biaya satuan, lihat [ketahanan rantai pasok](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/) |

### Siapa yang terlibat

Rapat eksekutif dipimpin oleh general manager atau presiden unit bisnis. Anggota tetap yang umumnya hadir adalah kepala penjualan, pemasaran, operasi, rantai pasok, keuangan, dan, pada produk rekayasa, rekayasa atau manajemen produk. Di bawah rapat eksekutif, perencana permintaan, master scheduler, perencana pasokan, dan analis keuangan melakukan sebagian besar pekerjaan. Bagian 4 merinci peran-peran tersebut langkah demi langkah.

## Hierarki perencanaan produksi: S&OP, MPS, RCCP, MRP, dan penjadwalan

Perencanaan dan pengendalian manufaktur (MPC) disusun sebagai hierarki. Setiap tingkat bekerja dengan horizon yang lebih panjang dan data yang lebih kasar dibandingkan tingkat di bawahnya, lalu meneruskan keputusannya sebagai target. Materi kursus MIT milik Stanley Gershwin merangkum MRP II dengan cara ini: hierarki perencanaan jangka panjang, menengah, dan pendek, dengan manajemen permintaan, peramalan, perencanaan kapasitas, dan pengendalian lantai produksi di sekitar inti MRP [8].

| Tingkat | Horizon tipikal | Periode (bucket) | Objek perencanaan | Pertanyaan utama | Keluaran | Alat tipikal |
|---|---|---|---|---|---|---|
| Rencana strategis dan bisnis | 3–5 tahun | tahun | bisnis, pabrik, jaringan | Pasar, pabrik, dan investasi kapasitas mana yang dipilih? | anggaran, rencana capex | alat keuangan, Excel |
| S&OP / IBP | 18–36 bulan [5][6] | bulan | famili produk, sumber daya agregat | Berapa banyak yang kita jual dan produksi, dengan persediaan dan biaya berapa? | rencana famili yang disetujui | perangkat lunak S&OP, ERP, Excel |
| Jadwal produksi induk (MPS) | beberapa minggu hingga beberapa bulan, minimal sebesar lead time kumulatif | minggu (hari untuk jangka dekat) | produk akhir atau item perencanaan | Produk akhir mana, berapa jumlahnya, di minggu apa? | MPS, ATP | ERP |
| Perencanaan kapasitas kasar (RCCP) | sama dengan MPS | minggu atau bulan | sumber daya kritis | Apakah MPS layak di titik hambatan (bottleneck)? | beban vs. kapasitas per sumber daya kunci | ERP, Excel |
| Perencanaan kebutuhan material (MRP) | sama dengan MPS | hari atau minggu | setiap komponen dan material | Komponen apa, berapa banyak, kapan dipesan atau dimulai? | pesanan terencana, permintaan pembelian, pesan pengecualian | ERP |
| Perencanaan kebutuhan kapasitas (CRP) | minggu | hari atau minggu | setiap pusat kerja | Apakah kapasitas cukup untuk semua pesanan terencana dan yang sudah dilepas? | profil beban terperinci | ERP |
| Penjadwalan rinci dan dispatching | jam hingga beberapa minggu | jam, shift | operasi pada mesin | Dalam urutan apa setiap operasi dijalankan? | jadwal, daftar dispatch | APS, MES |

Dua aturan menjaga hierarki ini tetap utuh:

1. **Disagregasi harus sesuai.** Jumlah MPS untuk semua produk akhir dalam satu famili harus sama dengan rencana famili S&OP untuk bulan yang sama, dalam toleransi yang disepakati (misalnya plus atau minus 5%). Jika tidak, keputusan S&OP tidak berpengaruh di lantai produksi.
2. **Kelayakan diperiksa di setiap tingkat.** S&OP memeriksa kapasitas agregat (perencanaan sumber daya), MPS diperiksa dengan perencanaan kapasitas kasar, dan keluaran MRP diperiksa dengan perencanaan kebutuhan kapasitas atau penjadwal finit. MRP sendiri tidak memeriksa kapasitas [8][9].

### Posisi ERP, APS, dan MES

ANSI/ISA-95 memisahkan perencanaan bisnis dan logistik (Level 4, umumnya ERP) dari manajemen operasi manufaktur (Level 3, umumnya MES dan penjadwalan rinci) [25]. S&OP, MPS, dan MRP adalah fungsi Level 4. [Panduan MES dan ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) menjelaskan sisi Level 3, dan [panduan Azure untuk manufaktur](https://www.m365.fm/en/learn/manufacturing-it-azure/) menunjukkan cara data antar-level dapat diintegrasikan.

### Make-to-stock, assemble-to-order, make-to-order

Lingkungan produksi menentukan di mana MPS berada dalam bill of materials:

| Lingkungan | Pelanggan menunggu | MPS direncanakan pada | Contoh | Fokus S&OP |
|---|---|---|---|---|
| Make-to-stock (MTS) | tidak ada (dikirim dari stok) | produk akhir | barang konsumen, pompa standar | target persediaan per famili |
| Assemble-to-order (ATO) | perakitan akhir | modul dan opsi (planning bill) | meja, truk, dan PC yang dapat dikonfigurasi | bauran modul, persentase opsi |
| Make-to-order (MTO) | manufaktur | produk akhir atau subrakitan kunci setelah pesanan | suku cadang mesin khusus | target backlog, lead time |
| Engineer-to-order (ETO) | desain dan manufaktur | tonggak proyek, item lead time panjang | mesin khusus, interior pesawat terbang | kapasitas teknik dan pengujian, lihat [perencanaan produksi aerospace](https://www.m365.fm/en/learn/aerospace-production-planning/) |

Pada MTS, S&OP menyeimbangkan permintaan dengan target persediaan. Pada MTO dan ETO, S&OP menyeimbangkan permintaan dengan target backlog atau lead time yang dikutip. Mencampur logika ini dalam satu famili adalah penyebab umum angka S&OP yang membingungkan.

## Sejarah: dari aggregate planning dan Orlicky ke IBP dan DDMRP

### Aggregate planning dan sistem MRP pertama (1950-an–1960-an)

S&OP dimulai pada awal 1950-an sebagai aggregate production planning: mencocokkan laju produksi agregat dengan permintaan perkiraan dengan menyeimbangkan persediaan, perubahan tenaga kerja, dan lembur [1]. Pada waktu yang kurang lebih bersamaan, produsen mesin pesawat Rolls-Royce dan General Electric mengomputerisasi perencanaan material [3].

Pada 1964, Joseph Orlicky, seorang insinyur di IBM, merumuskan material requirements planning [4]. Perusahaan pertama yang menerapkannya adalah Black & Decker pada 1964, dengan Dick Alban sebagai ketua proyek [3]. Buku Orlicky *Material Requirements Planning* (McGraw-Hill, 1975) menjadi teks standar [13]. Edisi ketiganya, pembaruan 2011 oleh Carol Ptak dan Chad Smith, memperkenalkan demand driven MRP (DDMRP) [4].

Adopsi tumbuh pesat: sekitar 700 perusahaan menjalankan MRP pada 1975 dan sekitar 8.000 pada 1981, menurut angka yang dikutip dalam Wikipedia [3]. Pada 1967, George Plossl dan Oliver Wight, rekan Orlicky di IBM, menulis bersama sebuah buku tentang pengendalian produksi dan persediaan [4].

### MRP II, ERP dan S&OP (1980-an–1990-an)

Pada 1983, Oliver Wight memperluas MRP menjadi **manufacturing resource planning (MRP II)** dengan menambahkan master scheduling, rough-cut capacity planning, capacity requirements planning, S&OP, dan keterkaitan dengan perencanaan keuangan [3]. Perusahaan Oliver Wight menggambarkan S&OP sebagai sesuatu yang dikembangkan oleh Oliver Wight pada 1980-an [2]; Wikipedia mengaitkan istilah ini dan makna modernnya dengan Richard (Dick) Ling, yang saat itu menjadi konsultan Oliver Wight [1]. Gartner mencetuskan istilah "enterprise resource planning" (ERP) pada 1990 [4]. ERP mengintegrasikan keuangan, penjualan, pembelian, dan SDM di sekitar inti perencanaan yang tetap berupa MRP II.

### IBP, DDMRP dan perencanaan konkuren (2000-an–sekarang)

Pada awal 2000-an, Oliver Wight mencetuskan **integrated business planning (IBP)**, yang memperluas S&OP ke seluruh perusahaan, termasuk perencanaan portofolio dan keuangan, dengan horizon minimal 24 bulan [2]. Pada 2011, Ptak dan Smith menerbitkan edisi ketiga buku Orlicky dengan **demand driven MRP (DDMRP)** [4], dan vendor ERP seperti Microsoft sejak itu telah membangun DDMRP ke dalam mesin perencanaan mereka [11]. Vendor perangkat lunak perencanaan kini mempromosikan perencanaan "konkuren" atau berkelanjutan yang menghitung ulang rencana dalam hitungan menit, bukan dalam batch bulanan [16]; klaim tersebut merupakan klaim vendor dan dibahas dalam bagian AI.

| Tahun | Tonggak | Sumber |
|---|---|---|
| awal 1950-an | aggregate production planning; Rolls-Royce dan GE mengomputerisasi perencanaan material | [1][3] |
| 1964 | Orlicky merumuskan MRP di IBM; Black & Decker adalah pengguna pertama | [3][4] |
| 1967 | Plossl dan Wight menerbitkan tulisan tentang pengendalian produksi dan persediaan | [4] |
| 1975 | *Material Requirements Planning* karya Orlicky; sekitar 700 pengguna MRP | [3][13] |
| 1981 | sekitar 8.000 pengguna MRP | [3] |
| 1983 | Oliver Wight mendefinisikan MRP II | [3] |
| 1980-an | S&OP dikembangkan oleh Oliver Wight (Dick Ling) | [1][2] |
| 1990 | Gartner mencetuskan "ERP" | [4] |
| awal 2000-an | Oliver Wight mencetuskan IBP | [2] |
| 2011 | edisi ketiga buku Orlicky oleh Ptak dan Smith memperkenalkan DDMRP | [4] |

## Proses S&OP: siklus bulanan langkah demi langkah

Deskripsi akademis paling sering dikutip tentang proses S&OP memiliki lima langkah: pengumpulan data, perencanaan permintaan, perencanaan pasokan, pra-rapat dan rapat eksekutif [1][20]. Sebagian penulis menambahkan tinjauan peristiwa atau produk di awal dan langkah revisi di akhir [1]; Anaplan, vendor perangkat lunak perencanaan, menggambarkan enam tinjauan: produk, permintaan, pasokan, keuangan, pra-S&OP dan S&OP eksekutif [15]. Kinaxis menggambarkan siklus bulanan tradisional dengan lima tahap [16]. Perbedaannya sebagian besar hanya pada label: siklus-siklus tersebut mencakup wilayah yang sama dengan urutan yang kurang lebih sama.

Kalender berikut mengasumsikan bulan ditutup pada hari kerja terakhir dan rapat eksekutif berlangsung pada minggu ketiga.

| Hari kerja | Langkah | Penanggung jawab | Masukan | Keluaran | Durasi rapat |
|---|---|---|---|---|---|
| 1–3 | 1. Pengumpulan data dan pembaruan portofolio | perencana permintaan, manajemen produk | realisasi bulan lalu (pengiriman, pesanan, produksi, persediaan), tanggal peluncuran dan penghentian produk baru | riwayat yang diperbarui, paket KPI, perubahan produk | tidak ada (kerja meja) |
| 4–6 | 2. Tinjauan permintaan | VP penjualan atau pemasaran; perencana permintaan menyiapkan | peramalan statistik, masukan penjualan, kegiatan pemasaran, rencana pelanggan utama | rencana permintaan konsensus tanpa batasan per famili, dalam unit dan dolar, dengan asumsi dan risiko | 60–90 menit |
| 7–9 | 3. Tinjauan pasokan | VP operasi atau rantai pasok; master scheduler dan perencana pasokan menyiapkan | permintaan konsensus, target persediaan atau backlog, kapasitas per sumber daya utama, kendala pemasok | rencana pasokan terbatas, masalah kapasitas dan opsi dengan biayanya | 60–90 menit |
| 10–12 | 4. Rapat pra-S&OP (rekonsiliasi) | pemilik proses S&OP; analis keuangan | rencana permintaan dan pasokan, kesenjangan, rencana keuangan | rencana yang direkonsiliasi dalam unit dan dolar, keputusan yang disiapkan dengan opsi, isu terbuka | 90–120 menit |
| 13–15 | 5. Rapat S&OP eksekutif | general manager | rekomendasi pra-S&OP, KPI | rencana yang disetujui, keputusan, eskalasi yang ditutup | 60–120 menit |
| 16–20 | Peluncuran | master scheduler, perencana | rencana famili yang disetujui | MPS diperbarui, MRP dijalankan, tindakan pembelian dan kapasitas | tidak ada |

### Langkah 1: Pengumpulan data dan pembaruan portofolio

Siklus dimulai segera setelah bulan ditutup. Perencana permintaan menarik data pengiriman, pesanan masuk, produksi, persediaan dan backlog per famili dan SKU, membersihkan riwayat dari kejadian satu kali (misalnya kebakaran di pelanggan, tender satu kali) dan menjalankan peramalan statistik. Manajemen produk memperbarui tanggal peluncuran dan penghentian. Peramalan yang tidak mengetahui bahwa suatu varian akan dihentikan pada bulan ke-4 akan terus memesan suku cadangnya.

**Daftar periksa, langkah 1**

| Item | Selesai ketika |
|---|---|
| Realisasi dimuat | pengiriman, pesanan, produksi dan persediaan direkonsiliasi dengan akhir bulan keuangan dalam toleransi yang disepakati |
| Riwayat dibersihkan | pencilan ditandai dengan alasan, tidak dihapus |
| Peramalan statistik dijalankan | model dan parameter didokumentasikan per famili |
| Perubahan portofolio | peluncuran, penghentian, perubahan rekayasa dengan tanggal dan penanggung jawab |
| Paket KPI | akurasi dan bias peramalan, pencapaian rencana, layanan, persediaan vs. target |

### Langkah 2: Tinjauan permintaan

Tinjauan permintaan menghasilkan **rencana permintaan konsensus tanpa batasan**: apa yang akan diinginkan pelanggan jika pasokan tidak terbatas. Penjualan dan pemasaran menyesuaikan peramalan statistik dengan informasi yang tidak ada dalam riwayat: perubahan harga, promosi, pelanggan yang hilang, distributor baru. Setiap penyesuaian dicatat beserta penanggung jawab dan asumsinya. Catatan itu kelak menunjukkan apakah penyesuaian manual meningkatkan atau memperburuk akurasi.

Kesalahan yang umum pada langkah ini adalah meramal hanya dalam pendapatan (operasi tidak dapat membangun dalam dolar), meramal pada tingkat SKU selama 24 bulan (terlalu banyak derau), dan menyamakan target penjualan dengan peramalan. Target adalah apa yang diinginkan perusahaan; peramalan adalah apa yang diharapkan perusahaan. Selisih di antara keduanya adalah isu bisnis untuk rapat eksekutif, bukan angka yang disembunyikan dalam peramalan.

**Agenda tinjauan permintaan (60–90 menit)**

| Waktu | Topik | Penanggung jawab |
|---|---|---|
| 10 menit | bulan lalu: akurasi dan bias peramalan per famili, meleset terbesar beserta akar penyebabnya | perencana permintaan |
| 20 menit | baseline statistik vs. konsensus terakhir, perubahan di atas ambang | perencana permintaan |
| 30 menit | masukan penjualan dan pemasaran per famili: kegiatan, pelanggan, harga | penjualan, pemasaran |
| 15 menit | risiko dan peluang dengan probabilitas dan kuantitas | VP penjualan |
| 5 menit | konsensus per famili, item terbuka, penanggung jawab | perencana permintaan |

### Langkah 3: Tinjauan pasokan

Tinjauan pasokan menguji permintaan konsensus terhadap kapasitas, bahan baku, dan target persediaan. Perencana menerjemahkan volume keluarga produk menjadi beban pada **sumber daya kunci** (pusat kerja penghambat, pemasok kritis, kelompok tenaga kerja terampil) dengan menggunakan bill of resources: jam per unit per sumber daya. Jika beban melebihi kapasitas, mereka menyusun opsi beserta biayanya: lembur, shift tambahan, alih daya (outsourcing), pra-produksi (prebuilding), tanggal pengiriman yang lebih lambat, atau menerima tingkat layanan yang lebih rendah. Tinjauan pasokan tidak memutuskan di antara opsi-opsi yang berdampak finansial signifikan; tinjauan ini mempersiapkannya untuk rapat pra-S&OP. Bagian 5 menunjukkan bagaimana opsi-opsi tersebut dibandingkan.

**Agenda tinjauan pasokan (60–90 menit)**

| Waktu | Topik | Penanggung jawab |
|---|---|---|
| 10 menit | bulan lalu: pencapaian rencana, kepatuhan MPS, kinerja pemasok | master scheduler |
| 25 menit | beban vs. kapasitas per sumber daya kunci dan per bulan (rough-cut) | perencana pasokan |
| 20 menit | proyeksi persediaan dan backlog vs. target per keluarga produk | master scheduler |
| 20 menit | kendala dan opsi dengan biaya serta risiko | VP operasi |
| 5 menit | rencana pasokan terbatas (constrained), isu untuk pra-S&OP | master scheduler |

### Langkah 4: Rapat pra-S&OP (rekonsiliasi)

Rapat pra-S&OP mempertemukan permintaan, pasokan, dan keuangan. Keuangan menilai rencana terbatas pada biaya standar dan harga jual, lalu membandingkannya dengan anggaran atau perkiraan keuangan terbaru. Tim menyelesaikan hal-hal yang dapat diselesaikan dalam batas kewenangan yang disepakati dan menyiapkan sisanya sebagai dokumen keputusan: dua atau tiga opsi, masing-masing dengan dampak volume, layanan, biaya, dan modal kerja, serta sebuah rekomendasi. Dokumen keputusan yang baik muat dalam satu halaman.

### Langkah 5: Rapat S&OP eksekutif

Rapat eksekutif meninjau KPI, menyetujui rencana, dan mengambil keputusan yang telah disiapkan. Rapat ini bukan tempat untuk merombak angka. Agenda tipikal:

| Waktu | Topik |
|---|---|
| 10 menit | tinjauan KPI: layanan, akurasi dan bias peramalan, persediaan dan backlog vs. target, pencapaian rencana |
| 15 menit | gambaran bisnis per keluarga produk: rencana permintaan vs. anggaran, rencana pasokan vs. permintaan |
| 45 menit | keputusan: satu dokumen keputusan per waktu, opsi, rekomendasi, keputusan dicatat |
| 10 menit | risiko untuk 3–6 bulan ke depan, status produk baru |
| 10 menit | tinjauan log keputusan, penanggung jawab, dan tenggat |

### Peluncuran: dari rencana yang disetujui ke MPS

Dalam beberapa hari setelah rapat eksekutif, master scheduler memecah rencana keluarga produk yang disetujui menjadi MPS per item akhir dan per minggu (Bagian 8), memeriksanya dengan rough-cut capacity planning (Bagian 9), dan menjalankan MRP (Bagian 10). Bagian pembelian menerima pesanan terencana baru atau yang berubah, dan keputusan kapasitas (shift kedua, lembur) dirilis melalui HR dan pabrik. Tanpa peluncuran ini, S&OP hanya menjadi kumpulan slide bulanan tanpa dampak di lantai produksi.

### Peran dan hak keputusan

| Peran | Tanggung jawab |
|---|---|
| Sponsor eksekutif (GM atau presiden) | memimpin rapat eksekutif, memegang keputusan akhir, memastikan kehadiran dan disiplin keputusan |
| Pemilik proses S&OP | menjalankan kalender, menyiapkan pra-S&OP, memelihara log keputusan dan asumsi |
| Perencana permintaan | peramalan statistik, proses konsensus, KPI peramalan |
| Pimpinan penjualan dan pemasaran | intelijen pasar, kepemilikan angka permintaan konsensus |
| Master scheduler | MPS, aturan ATP, rough-cut capacity, disagregasi |
| Perencana pasokan dan material | pengecualian MRP, kapasitas pemasok, pesanan pembelian |
| Manajer pabrik atau operasi | rencana kapasitas, tenaga kerja, keputusan lembur dan shift |
| Mitra keuangan | penilaian dalam dolar, rekonsiliasi dengan anggaran, modal kerja |
| Manajemen produk atau teknik | peluncuran, penghentian produk, perubahan teknik |

Hak keputusan sebaiknya dituliskan. Contoh: tinjauan pasokan dapat menyetujui lembur hingga 10% dari kapasitas sebuah pusat kerja; apa pun yang melebihi itu, dan setiap perubahan pada target persediaan, diteruskan ke rapat eksekutif.

## Strategi pasokan: level, chase, atau hibrida (contoh terperinci)

Perencanaan agregat menawarkan tiga strategi pasokan klasik, yang disebutkan dalam panduan S&OP tetapi jarang dihitung [6]:

- **Level:** memproduksi pada laju konstan dan membiarkan persediaan menyerap fluktuasi permintaan.
- **Chase:** mengubah laju produksi setiap bulan agar sesuai dengan permintaan, dengan lembur, tenaga kerja sementara, atau shift, dan menjaga persediaan tetap rata.
- **Hibrida (campuran):** mengubah laju beberapa kali dan menerima sebagian penumpukan persediaan.

**Contoh terperinci (angka ilustratif).** Sebuah produsen meja memproyeksikan keluarga "meja rangka baja" selama enam bulan. Persediaan awal adalah 800 unit, persediaan akhir target adalah 800 unit, dan minimal 500 unit harus tersedia pada setiap akhir bulan (stok pengaman). Laju produksi sebelumnya adalah 3.000 unit per bulan. Pengelasan merupakan titik sempit: 5 sel las × 2 shift × 8 jam × 20 hari = 1.600 jam per bulan; setiap meja membutuhkan 0,4 jam pengelasan, sehingga laju maksimum adalah 1.600 / 0,4 = **4.000 meja per bulan**. Biaya: penyimpanan $4 per unit per bulan pada persediaan akhir; setiap unit perubahan laju bulanan (perekrutan, pelatihan, penyiapan lembur, atau pemutusan hubungan kerja) berbiaya $5.

| Bulan | Permintaan | Level: produksi | Level: persediaan akhir | Chase: produksi | Chase: persediaan akhir | Hibrida: produksi | Hibrida: persediaan akhir |
|---|---|---|---|---|---|---|---|
| Jan | 3.000 | 3.800 | 1.600 | 3.000 | 800 | 3.500 | 1.300 |
| Feb | 3.200 | 3.800 | 2.200 | 3.200 | 800 | 3.500 | 1.600 |
| Mar | 4.200 | 3.800 | 1.800 | **4.200** | 800 | 4.000 | 1.400 |
| Apr | 4.800 | 3.800 | 800 | **4.800** | 800 | 4.000 | 600 |
| Mei | 4.000 | 3.800 | 600 | 4.000 | 800 | 4.000 | 600 |
| Jun | 2.800 | 3.800 | 1.600 | 2.800 | 800 | 3.000 | 800 |
| **Total** | **22.000** | **22.800** | **8.600 unit-bulan** | **22.000** | **4.800 unit-bulan** | **22.000** | **6.300 unit-bulan** |

Mengapa laju level adalah 3.800: permintaan kumulatif hingga Mei adalah 19.200 unit; dengan 500 unit yang dibutuhkan pada akhir Mei dan 800 unit tersedia pada awal, produksi hingga Mei harus minimal 19.200 + 500 − 800 = 18.900, atau 3.780 per bulan. Dibulatkan menjadi 3.800, rencana level berakhir Juni dengan 1.600 unit, 800 di atas target.

| Elemen biaya | Level | Chase | Hibrida |
|---|---|---|---|
| Perubahan laju (unit × $5) | 3.000 → 3.800: 800 → $4.000 | +200, +1.000, +600, −800, −1.200 = 3.800 → $19.000 | +500, +500, −1.000 = 2.000 → $10.000 |
| Penyimpanan (unit-bulan × $4) | 8.600 → $34.400 | 4.800 → $19.200 | 6.300 → $25.200 |
| **Total** | **$38.400** | **$38.200** | **$35.200** |
| Layak pada titik sempit pengelasan (≤ 4.000/bulan)? | ya | **tidak** (Maret 4.200, April 4.800) | ya |
| Persediaan akhir vs. target 800 | +800 | sesuai target | sesuai target |

Rencana chase tampak hampir semurah rencana level di atas kertas, tetapi tidak layak: Maret dan April melampaui kapasitas pengelasan kecuali perusahaan menambah shift ketiga, yang juga membawa biayanya sendiri. Rencana hibrida adalah yang termurah di antara opsi yang layak dan menjalankan pengelasan tepat 100% selama tiga bulan, yang tidak menyisakan kapasitas pengaman. Perubahan laju bukan hanya baris biaya. Rencana chase berarti perekrutan, tenaga kerja sementara, pemutusan hubungan kerja, atau lembur berkelanjutan; kontrak serikat pekerja, aturan pemberitahuan lembur, dan batas kelelahan membatasi seberapa cepat sebuah pabrik dapat mengubah lajunya, dan operator menanggung biaya setiap fluktuasi. Tinjauan pasokan harus menanyakan kepada pabrik dan SDM apa yang realistis sebelum memodelkannya. Keuangan akan menambahkan efek kedua: di bawah costing standar, bulan dengan produksi rendah menyerap overhead tetap lebih sedikit, sehingga rencana chase menimbulkan selisih penyerapan yang dihindari oleh rencana level.

Itulah keputusan yang harus dibawa tinjauan pasokan ke rapat eksekutif: menyetujui rencana hibrida, dan memutuskan apakah akan mengkualifikasi subkontraktor pengelasan untuk 200–400 meja per bulan sebagai asuransi. Menjalankan titik sempit pada utilisasi penuh mendorong antrean dan waktu tunggu naik tajam, seperti ditunjukkan [bagian panduan APS tentang factory physics](https://www.m365.fm/en/learn/production-scheduling-aps/) dengan Hukum Little dan kurva operasi, dan [panduan teori kendala](https://www.m365.fm/en/learn/theory-of-constraints/) menjelaskan cara melindungi drum.

## S&OP vs. IBP vs. S&OE

Ketiga istilah ini menggambarkan cakupan dan horizon yang berbeda.

| Aspek | S&OP | Integrated business planning (IBP) | Sales and operations execution (S&OE) |
|---|---|---|---|
| Pertanyaan | Apakah permintaan dan pasokan sudah sesuai per famili? | Apakah keseluruhan rencana bisnis (portofolio, permintaan, pasokan, keuangan, strategi) saling selaras? | Apa yang kita ubah minggu ini untuk menjalankan rencana? |
| Horizon | Oliver Wight: umumnya 6–12 bulan; SAP dan lainnya: 18–36 bulan bergulir [2][5] | minimal 24 bulan [2] | 0–3 bulan (minggu) [unverified: horizon sebagaimana umumnya dipakai praktisi] |
| Ritme | bulanan | bulanan | mingguan |
| Satuan | unit dan dolar per famili | terutama dolar, ditambah unit | unit per SKU dan pelanggan |
| Ketua | GM atau VP operasi | CEO atau presiden unit bisnis | supply chain atau manajer perencanaan |
| Asal-usul | Oliver Wight, 1980-an [1][2] | Oliver Wight, awal 2000-an [2] | istilah praktisi, tidak ada asal tunggal yang terverifikasi |

Oliver Wight menggambarkan S&OP berpusat pada pertukaran (trade-off) rantai pasok, dan IBP membawa seluruh perusahaan ke dalam pandangan, mencakup portofolio, permintaan, pasokan, dan keuangan [2]. Banyak perusahaan menggunakan kedua istilah ini secara bergantian. Labelnya kurang penting dibanding dua fakta: apakah keuangan dan portofolio menjadi bagian dari proses, dan apakah tim eksekutif mengambil keputusan di dalamnya. S&OE adalah jembatan mingguan antara rencana yang disetujui dan MPS: ia menangani perubahan permintaan jangka pendek, gangguan pasokan, dan alokasi di dalam zona beku (frozen) dan zona lunak (slushy) MPS (Bagian 8).

**Agenda S&OE mingguan (30–45 menit, ilustratif)**

| Waktu | Topik | Penanggung jawab |
|---|---|---|
| 5 menit | minggu lalu: kepatuhan MPS, pengiriman vs. rencana, tiga deviasi teratas | master scheduler |
| 10 menit | perubahan permintaan di dalam planning time fence: pesanan besar baru, pembatalan, alokasi pasokan yang kurang | demand planner, customer service |
| 10 menit | isu pasokan: keterlambatan pemasok, mesin mati, penahanan kualitas, kekurangan material dari pengecualian MRP | supply planner, pabrik |
| 10 menit | keputusan dalam aturan MPS; apa pun di luar aturan dieskalasi ke langkah S&OP berikutnya | supply chain manager |
| 5 menit | tindakan, penanggung jawab, tanggal | master scheduler |

## Model kematangan S&OP

Model kematangan membantu perusahaan melihat posisinya dan langkah berikutnya. Tiga model digunakan secara luas.

**Gartner.** Gartner menerbitkan peta jalan kematangan S&OP lima level [17]. Halaman ikhtisar publiknya tidak mencantumkan nama level; sumber sekunder menggambarkan level secara garis besar sebagai berikut, mulai dari tidak ada tujuan bersama dan perencanaan berbasis spreadsheet yang tidak terkoordinasi (level 1), melalui perencanaan penjualan operasional, penyeimbangan permintaan dan pasokan di seluruh rantai pasok ujung ke ujung, dan bauran produk yang berorientasi permintaan dan menguntungkan, hingga perusahaan yang terhubung di mana S&OP menjadi bagian dari perencanaan bisnis secara keseluruhan dan keputusan berbasis skenario (level 5) [18]. [unverified: nama level resmi Gartner; deskripsi di atas mengikuti ringkasan Jedox, sebuah vendor perangkat lunak perencanaan.]

**Grimson dan Pyke (2007).** J. Andrew Grimson dan David Pyke mengusulkan kerangka kerja dengan lima dimensi dan lima tahap: tidak ada proses S&OP, reaktif, standar, lanjutan, dan proaktif [1][19].

**Wagner, Ullrich dan Transchel (2014).** Stephan Wagner dan rekan-rekannya menggambarkan empat dimensi dan enam tahap dari belum berkembang hingga proaktif, bersama dengan proses lima langkah yang digunakan di Bagian 4 [1][20].

Penilaian diri sederhana, diturunkan dari dimensi yang dimiliki bersama oleh model-model ini (rapat dan kolaborasi, organisasi, pengukuran, teknologi informasi, integrasi rencana):

| Dimensi | Tahap 1: tidak ada atau reaktif | Tahap 2: standar | Tahap 3: lanjutan | Tahap 4: proaktif |
|---|---|---|---|---|
| Rapat | pemadaman kebakaran ad hoc | siklus bulanan, eksekutif kadang hadir | siklus lima langkah penuh, eksekutif memimpin setiap bulan | siklus mencakup skenario dan strategi, eksekutif memutuskan opsi |
| Organisasi | tidak ada pemilik | koordinator paruh waktu | pemilik proses khusus, hak keputusan tertulis | S&OP adalah cara bisnis dijalankan |
| Pengukuran | tidak ada | layanan dan persediaan | akurasi dan bias peramalan, pencapaian rencana | KPI terkait hasil keuangan dan insentif |
| TI | spreadsheet terpisah | spreadsheet bersama atau laporan ERP | alat perencanaan terintegrasi, rekonsiliasi famili/SKU | perencanaan skenario, aliran data otomatis |
| Integrasi rencana | rencana penjualan dan produksi berbeda | satu rencana volume | rencana volume direkonsiliasi dengan rencana keuangan | satu rencana menggerakkan anggaran, MPS, dan capex |

Bukti penelitian tentang dampak S&OP cukup mendukung tetapi tidak seragam. Sebuah tinjauan literatur oleh Antônio Márcio Tavares Thomé dan rekan-rekan penulis dalam *International Journal of Production Economics* merangkum literatur S&OP hingga 2012 [22], dan sebuah studi pendamping menghubungkan S&OP dengan kinerja perusahaan [23]. Penelitian yang lebih baru menekankan bahwa desain S&OP yang tepat bergantung pada konteks, seperti ukuran perusahaan, kompleksitas produk, dan ketidakpastian rantai pasok [34]. Klaim tentang peningkatan persentase tetap dari S&OP di halaman vendor harus dibaca sebagai klaim vendor.

## Master production schedule (MPS) dan available to promise (ATP)

**Master production schedule** adalah pernyataan tentang apa yang diharapkan akan diproduksi perusahaan, berdasarkan rencana taktis dan batasan anggaran, seperti dinyatakan dalam dokumentasi JD Edwards dari Oracle [7]. MPS berada di antara S&OP dan MRP: MPS cukup spesifik (produk akhir, minggu) untuk menggerakkan perencanaan material dan kapasitas, dan cukup stabil untuk melindungi pabrik dari gangguan harian. MRP kemudian menghitung kebutuhan bersih yang dibagi menurut waktu untuk setiap komponen guna mendukung MPS [7].

### Disagregasi: dari famili ke produk akhir

Rencana S&OP yang disetujui untuk "meja rangka baja" pada bulan April adalah 4.000 unit. Penjadwal induk membaginya per produk akhir menggunakan bauran saat ini dan pesanan yang sudah diketahui: 55% D100 (2.200), 30% D120 (1.200) dan 15% D140 (600), kemudian per minggu. Bill of material perencanaan digunakan jika opsi direncanakan sebagai persentase, misalnya 60% rangka hitam dan 40% rangka putih.

### Time fence

MPS dibagi menjadi zona dengan aturan perubahan yang berbeda. Nama zona dan aturan yang umum (definisi tepat dan panjang zona berbeda menurut perusahaan dan ERP):

| Zona | Rentang umum | Yang boleh berubah | Yang menyetujui |
|---|---|---|---|
| Frozen | dari hari ini hingga demand time fence (misalnya lead time perakitan akhir) | tidak ada, kecuali keadaan darurat | manajer pabrik atau rapat S&OE |
| Slushy | dari demand time fence hingga planning time fence (misalnya lead time kumulatif bagian beli dengan lead time panjang) | bauran dalam famili; kuantitas dalam toleransi yang disepakati | penjadwal induk |
| Liquid | melampaui planning time fence | apa pun yang sesuai dengan S&OP | sistem perencanaan dan penjadwal induk |

Zona frozen adalah yang dimaksud Gershwin dalam slide MIT tentang membekukan jadwal jangka dekat: zona ini mengurangi kegelisahan jadwal dengan mengorbankan fleksibilitas [8]. Bagian 12 menghitung besarnya dampak tersebut.

### Catatan MPS dengan available balance terproyeksi dan ATP

**Contoh kerja (angka ilustratif).** Produk akhir D100, stok di tangan 60 unit, ukuran lot MPS 200, stok pengaman 0, demand time fence pada akhir minggu 2. Di dalam demand time fence, permintaan terproyeksi hanya pesanan pelanggan; di luar itu, nilainya adalah yang lebih besar antara ramalan dan pesanan pelanggan.

| Minggu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Ramalan | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| Pesanan pelanggan | 90 | 70 | 40 | 20 | 10 | 0 | 0 | 0 |
| Permintaan terproyeksi | 90 | 70 | 100 | 100 | 100 | 100 | 100 | 100 |
| MPS (penyelesaian) | 200 | | | 200 | | 200 | | 200 |
| Projected available balance (PAB), awal 60 | 170 | 100 | 0 | 100 | 0 | 100 | 0 | 100 |
| ATP diskrit | 60 | | | 170 | | 200 | | 200 |
| ATP kumulatif | 60 | 60 | 60 | 230 | 230 | 430 | 430 | 630 |

Cara angka-angka ini diperoleh:

- **PAB, minggu 1:** 60 + 200 − 90 = 170. Minggu 2: 170 − 70 = 100. Minggu 3: 100 − 100 = 0. Minggu 4 akan menjadi −100, sehingga MPS merencanakan lot sebesar 200: 0 + 200 − 100 = 100. Dan seterusnya.
- **ATP diskrit** hanya dihitung pada minggu yang memiliki penerimaan MPS: stok di tangan (hanya periode pertama) ditambah kuantitas MPS dikurangi seluruh pesanan pelanggan hingga penerimaan MPS berikutnya. Minggu 1: 60 + 200 − (90 + 70 + 40) = 60. Minggu 4: 200 − (20 + 10) = 170. Minggu 6 dan 8: 200 − 0 = 200.
- **ATP kumulatif** menjumlahkan ATP diskrit dari waktu ke waktu: 60, kemudian 60 + 170 = 230, kemudian 430, kemudian 630.
- Beberapa sistem ERP menggunakan varian look-ahead: jika pesanan pelanggan pada periode berikutnya melebihi penerimaan MPS periode tersebut, kekurangannya dikurangkan dari ATP periode sebelumnya agar unit yang sama tidak dijanjikan dua kali. Dalam contoh ini tidak ada periode yang kelebihan janji, sehingga kedua metode memberikan hasil yang sama.

Apa yang bisa dijanjikan Penjualan: pelanggan yang menginginkan 100 meja pada minggu 2 hanya bisa mendapatkan paling banyak 60 dari rencana saat ini; seluruh 100 unit tersedia mulai minggu 4 (ATP kumulatif 230). PAB sebesar 0 pada minggu 3 bukan masalah untuk penjanjian pengiriman, karena ATP menggunakan pesanan pelanggan, bukan ramalan. Ini merupakan sinyal bagi master scheduler bahwa rencana tidak memiliki cadangan jika pesanan minggu 3 melebihi ramalan. Sistem ERP seperti JD Edwards melaporkan ATP dan ATP kumulatif sebagai keluaran MPS standar [7].

### Aturan MPS yang menjaga jadwal tetap kredibel

| Aturan | Alasan |
|---|---|
| Jumlah MPS per famili tetap dalam ±5% dari rencana S&OP (contoh toleransi) | jika tidak, keputusan S&OP tidak sampai ke lantai produksi |
| Tidak ada kelebihan beban: beban RCCP ≤ kapasitas yang terbukti pada sumber daya kunci | MPS yang dilebih-lebihkan membuat tanggal ATP dan MRP menjadi fiktif |
| Perubahan di dalam zona beku memerlukan persetujuan yang ditunjuk | melindungi material dan kapasitas yang sudah dikomitmenkan |
| Firm planned order untuk jangka pendek | proses MRP tidak dapat memindahkannya secara otomatis |
| ATP diperiksa sebelum setiap janji pesanan | mencegah menjanjikan kapasitas yang sama dua kali |
| Tinjauan MPS mingguan dalam rapat S&OE | menangkap deviasi sebelum menjadi pesanan terlambat |

## Perencanaan kapasitas kasar (RCCP)

Perencanaan kapasitas kasar memeriksa MPS terhadap beberapa **sumber daya kritis** sebelum MRP menguraikannya. Disebut "kasar" karena menggunakan bill of resources (jam per produk akhir pada setiap sumber daya kunci), bukan routing lengkap, dan mengabaikan sebagian besar offset lead time.

**Contoh kerja (angka ilustratif).** MPS mingguan untuk tiga model meja dan bill of resources-nya pada tiga sumber daya kunci:

| Model | MPS minggu 14 | Pengelasan (jam/unit) | Pelapisan bubuk (jam/unit) | Perakitan akhir (jam/unit) |
|---|---|---|---|---|
| D100 | 550 | 0,40 | 0,10 | 0,25 |
| D120 | 300 | 0,45 | 0,12 | 0,30 |
| D140 | 150 | 0,60 | 0,15 | 0,40 |

| Sumber daya | Perhitungan beban | Beban (jam) | Kapasitas mingguan (jam) | Utilisasi |
|---|---|---|---|---|
| Pengelasan | 550 × 0,40 + 300 × 0,45 + 150 × 0,60 = 220 + 135 + 90 | 445 | 400 | **111%** |
| Pelapisan bubuk | 550 × 0,10 + 300 × 0,12 + 150 × 0,15 = 55 + 36 + 22,5 | 113,5 | 160 | 71% |
| Perakitan akhir | 550 × 0,25 + 300 × 0,30 + 150 × 0,40 = 137,5 + 90 + 60 | 287,5 | 320 | 90% |

Pengelasan kelebihan beban sebesar 45 jam. Pilihannya: memindahkan 75 meja D140 (75 × 0,60 = 45 jam) ke minggu 15 jika minggu 15 memiliki cadangan dan tanggal pelanggan memungkinkan, merencanakan 45 jam lembur, atau mengalihkan sebagian rangka D100 ke subkontraktor yang disiapkan dalam tinjauan pasokan. Kapasitas pengelasan mingguan sebesar 400 jam sesuai dengan 1.600 jam per bulan yang digunakan dalam S&OP (Bagian 5), dan di situlah intinya: RCCP menggunakan definisi sumber daya yang sama dengan tinjauan pasokan S&OP, sehingga tingkatnya dapat direkonsiliasi.

Tiga teknik RCCP umum dijumpai dalam buku teks dan sistem ERP: perencanaan kapasitas menggunakan faktor keseluruhan (persentase historis dari total jam per pusat kerja), bill of capacity atau bill of resources (jam per unit per sumber daya, seperti di atas), dan profil sumber daya yang menambahkan offset waktu. Semakin rinci metodenya, semakin dekat ia dengan capacity requirements planning (Bagian 11).

## Material requirements planning (MRP): cara kerja perhitungannya

**Material requirements planning (MRP)** menggunakan bill of materials dan catatan persediaan untuk menghitung kebutuhan bersih berdasarkan waktu untuk setiap komponen dan subassembly, lalu menyarankan rencana pengisian ulang yang mendukung MPS [7]. Logikanya bertumpu pada satu gagasan dari Orlicky: permintaan komponen *bergantung* pada permintaan produk jadi, sehingga harus dihitung, bukan diperkirakan [13]. Jika pabrik membuat 150 meja pada minggu ke-3 dan setiap meja memiliki empat kaki, maka dibutuhkan 600 kaki sebelum minggu ke-3, terlepas dari apa yang dikatakan ramalan statistik untuk kaki.

### Masukan

| Masukan | Isi | Masalah kualitas data yang umum |
|---|---|---|
| Master production schedule | produk jadi, jumlah, tanggal | MPS tidak direkonsiliasi dengan S&OP, atau kelebihan beban |
| Bill of materials (BOM) | hubungan induk-komponen, jumlah per unit, faktor scrap, tanggal efektivitas | BOM teknik digunakan alih-alih BOM manufaktur; subassembly phantom tidak tercatat; usang setelah perubahan teknik |
| Catatan persediaan | stok on hand, alokasi, safety stock | hitungan salah; scrap dan konsumsi tidak dicatat |
| Pesanan terbuka (penerimaan terjadwal) | pesanan produksi dan pembelian yang dirilis beserta tanggal jatuh tempo | tanggal jatuh tempo tidak dipelihara; pesanan ditutup terlambat |
| Data perencanaan master item | lead time, aturan lot sizing, kelipatan pesanan, jumlah minimum, yield | lead time ditetapkan bertahun-tahun lalu dan tidak pernah ditinjau |

Slide MIT dari Gershwin mencantumkan blok penyusun yang sama: gross requirements, scheduled receipts, projected on hand, net requirements, planned order receipts dan planned order releases, yang diimbangi dengan lead time [8].

### Lima langkah untuk setiap item

1. **Gross requirements:** MPS untuk produk jadi, atau planned order releases dari semua induk dikalikan jumlah per unit, untuk komponen.
2. **Netting:** projected on hand = on hand sebelumnya + penerimaan terjadwal − gross requirements. Jika nilainya turun di bawah safety stock, kekurangannya adalah **net requirement**.
3. **Lot sizing:** net requirement menjadi **planned order receipt** sesuai aturan lot sizing (lot-for-lot, fixed order quantity, kelipatan, period order quantity).
4. **Offsetting:** planned order receipt digeser mundur sebesar lead time item untuk menghasilkan **planned order release**.
5. **Explosion:** planned order releases menjadi gross requirements untuk level BOM berikutnya.

Item diproses level demi level menurut urutan **low-level code**: setiap item diberi kode yang sama dengan level terendah tempat item itu muncul dalam BOM mana pun, sehingga semua gross requirements dari semua induk dikumpulkan sebelum item itu di-netting [8]. Contoh berikut menunjukkan mengapa hal itu penting.

### Contoh kerja: explosion MRP dan netting di dua level BOM

**Struktur produk (ilustratif).** Meja D100 terdiri dari satu permukaan meja T-20, satu rangka kaki F-10 dan 1 meter pipa baja S-5 untuk penyangga silang. Setiap rangka kaki F-10 dilas dari 4 meter pipa baja S-5. Dengan demikian S-5 muncul di level 1 (langsung di D100) dan di level 2 (di F-10); low-level code-nya adalah 2.

```
D100 Meja (level 0)
├── T-20 Permukaan meja, qty 1 (level 1, dibuat di dalam pabrik, lead time 1 minggu)
├── F-10 Rangka kaki, qty 1 (level 1, dilas di dalam pabrik, lead time 2 minggu)
│   └── S-5 Pipa baja, 4 m (level 2, dibeli, lead time 2 minggu)
└── S-5 Pipa baja, 1 m (level 1, penyangga silang)
```

Agar tabel mudah dibaca, baris MPS menunjukkan minggu ketika perakitan akhir D100 dimulai; komponen harus tersedia pada awal minggu tersebut.

**MPS untuk D100 (perakitan akhir dimulai):**

| Minggu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Total |
|---|---|---|---|---|---|---|---|---|---|
| Perakitan D100 dimulai | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 | 740 |

**Item T-20 Permukaan meja.** Lot-for-lot, lead time 1 minggu, on hand 30, penerimaan terjadwal 100 pada minggu 1, safety stock 0.

| Minggu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Gross requirements | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Penerimaan terjadwal | 100 | | | | | | | |
| Projected on hand (awal 30) | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 |
| Net requirements | | | 140 | 100 | | 150 | 100 | 120 |
| Planned order receipts | | | 140 | 100 | | 150 | 100 | 120 |
| Planned order releases | | 140 | 100 | | 150 | 100 | 120 | |

Minggu 1: 30 + 100 − 120 = 10. Minggu 3: 10 − 150 = −140, sehingga 140 dibutuhkan dan dirilis satu minggu lebih awal, yaitu pada minggu 2.

**Item F-10 Rangka kaki.** Fixed order quantity 200 (satu batch pengelasan), lead time 2 minggu, on hand 120, tanpa penerimaan terjadwal, safety stock 0.

| Minggu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Kebutuhan kotor | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Proyeksi persediaan di tangan (awal 120) | 0 | 0 | 50 | 150 | 150 | 0 | 100 | 180 |
| Kebutuhan bersih | | | 150 | 50 | | | 100 | 20 |
| Penerimaan pesanan terencana | | | 200 | 200 | | | 200 | 200 |
| Pelepasan pesanan terencana | 200 | 200 | | | 200 | 200 | | |

Minggu 3: 0 − 150 = −150, sehingga satu lot sebanyak 200 tiba, menyisakan 50. Minggu 4: 50 − 100 = −50, satu lot lagi sebanyak 200, menyisakan 150. Minggu 6 menghabiskan tepat 150 yang tersisa. Pelepasan diundur dua minggu.

**Item S-5 Pipa baja (kode tingkat rendah 2).** Dibeli, lead time 2 minggu, pemesanan dalam kelipatan 500 m, persediaan di tangan 1.400 m, penerimaan terjadwal 500 m pada minggu 1, stok pengaman 100 m. Kebutuhan kotor menggabungkan kedua induk:

| Minggu | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Dari pelepasan F-10 (× 4 m) | 800 | 800 | | | 800 | 800 | | |
| Dari mulai D100 (× 1 m) | 120 | | 150 | 100 | | 150 | 100 | 120 |
| **Kebutuhan kotor** | **920** | **800** | **150** | **100** | **800** | **950** | **100** | **120** |
| Penerimaan terjadwal | 500 | | | | | | | |
| Proyeksi persediaan di tangan (awal 1.400) | 980 | 180 | 530 | 430 | 130 | 180 | 580 | 460 |
| Kebutuhan bersih | | | 70 | | 470 | 920 | 20 | |
| Penerimaan pesanan terencana | | | 500 | | 500 | 1.000 | 500 | |
| Pelepasan pesanan terencana | 500 | | 500 | 1.000 | 500 | | | |

Minggu 3: 180 − 150 = 30, di bawah stok pengaman 100, sehingga kebutuhan bersih 70 dan satu kelipatan 500 dipesan (proyeksi persediaan di tangan 530). Minggu 6: 130 − 950 = −820; agar akhir periode minimal 100, kebutuhan bersih 920, dibulatkan ke atas menjadi 1.000.

**Yang ditunjukkan contoh ini**

- **Permintaan dependen bersifat bergelombang.** Permintaan meja relatif stabil (100 hingga 150 per minggu), tetapi permintaan pipa melonjak antara 100 dan 950 m per minggu karena lot pengelasan sebanyak 200 rangka sekaligus menarik 800 m. Peramalan statistik atas konsumsi pipa akan melewatkan puncak tersebut; penjabaran BOM tidak.
- **Pengkodean tingkat rendah mencegah kekurangan.** Seandainya S-5 dihitung netto pada tingkat 1 (hanya dengan permintaan batang silang sebesar 120 hingga 150 m per minggu), MRP tidak akan melihat kebutuhan apa pun hingga minggu 7 dan rangka akan kehabisan pipa pada minggu 2.
- **Ukuran lot berlipat ganda.** Dua aturan ukuran lot (200 rangka, kelipatan 500 m) mengubah 740 meja menjadi pesanan pipa 2.500 m dalam lima minggu. [Panduan ukuran lot](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) menjelaskan cara memilih aturan tersebut; [panduan manajemen persediaan manufaktur](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) membahas stok pengaman.
- **Keluaran ERP adalah daftar tindakan:** lepaskan 200 rangka dan beli 500 m pipa minggu ini; lepaskan 140 meja minggu depan. Perencana menangani daftar ini sebagai **pesan pengecualian** (lepas, jadwal ulang masuk, jadwal ulang keluar, batalkan) alih-alih membaca seluruh tabel.

### Pegging dan pesan pengecualian

**Pegging** menghubungkan setiap kebutuhan dengan sumbernya: kebutuhan pipa minggu 6 sebesar 950 m ter-peg ke pelepasan F-10 pada minggu 6 (800 m) dan mulai D100 pada minggu 6 (150 m). Dengan pegging, perencana yang tidak dapat memperoleh 1.000 m pipa pada minggu 6 dapat melihat meja dan pesanan pelanggan mana yang berisiko.

Pesan pengecualian MRP yang umum dan tindakannya:

| Pesan | Arti | Tindakan tipikal |
|---|---|---|
| Lepaskan pesanan | pesanan terencana berada dalam jendela pelepasan | ubah menjadi pesanan produksi atau pembelian setelah memeriksa kapasitas dan material |
| Jadwal ulang masuk (percepatan) | pesanan terbuka jatuh tempo lebih lambat dari yang dibutuhkan | minta pemasok atau pabrik untuk memajukannya; jika tidak mungkin, eskalasikan sebagai perubahan MPS |
| Jadwal ulang keluar (perlambatan) | pesanan terbuka jatuh tempo lebih awal dari yang dibutuhkan | mundurkan untuk mengurangi persediaan dan membebaskan kapasitas |
| Batalkan | pesanan terbuka tidak lagi dibutuhkan | batalkan atau kurangi; periksa ketentuan pembatalan |
| Lewat jatuh tempo | tanggal pelepasan atau tanggal jatuh tempo sudah lewat | rencana tidak layak sebagaimana tertulis: perbaiki MPS, bukan hanya pesanannya |
| Di bawah stok pengaman | proyeksi persediaan di tangan di bawah tingkat pengaman | periksa apakah stok pengaman sudah tepat sebelum melakukan percepatan |

Pabrik yang memiliki ratusan pesanan terencana yang lewat jatuh tempo setelah setiap proses MRP tidak memiliki masalah MRP. Yang dimilikinya adalah MPS yang tidak layak, atau lead time dan ukuran lot yang tidak mencerminkan kenyataan.

### MRP vs. titik pemesanan ulang dan kanban

MRP bukan satu-satunya cara untuk mengisi ulang suku cadang. Sistem titik pemesanan ulang (reorder point) dan kanban melakukan pengisian ulang ketika stok turun ke level pemicu, dan bekerja baik untuk item dengan permintaan yang stabil dan frekuensi tinggi. MRP lebih cocok untuk permintaan dependen yang bergelombang, lead time yang panjang, volume rendah, dan produk rekayasa. Banyak pabrik menggunakan keduanya: kanban untuk baut dan pengikat serta suku cadang yang bergerak cepat di lini produksi, dan MRP untuk suku cadang dengan lead time panjang dan mahal. [Panduan kanban dan sistem tarik](https://www.m365.fm/en/learn/kanban-pull-system/) dan [panduan manufaktur ramping](https://www.m365.fm/en/learn/lean-manufacturing/) menjelaskan sisi sistem tarik.

## MRP II, CRP dan lingkaran tertutup

**Manufacturing resource planning (MRP II)** menutup lingkaran di sekitar MRP: S&OP dan MPS di atasnya, capacity requirements planning (CRP) dan shop floor control di bawahnya, serta keterkaitan dengan perencanaan keuangan [3][8]. Oliver Wight mendeskripsikannya pada tahun 1983 [3].

**Capacity requirements planning (CRP)** mengambil semua pesanan terencana dan terbit dari MRP, menerapkan routing lengkap (waktu setup dan waktu proses per operasi dan pusat kerja), dan menghitung beban per pusat kerja dan per periode. CRP menunjukkan beban berlebih tetapi tidak menyelesaikannya: CRP, seperti MRP, bertumpu pada asumsi kapasitas tak terbatas [8]. Wallace Hopp dan Mark Spearman berargumen dalam *Factory Physics* bahwa model MRP dasar mengasumsikan lead time yang tidak bergantung pada beban, yang hanya mungkin terjadi dengan kapasitas tak terbatas [9]. Panduan APS menunjukkan contoh kerja beban berlebih yang tidak terlihat oleh MRP dan menjelaskan **lead time syndrome**: perencana memperpanjang lead time terencana untuk menutupi pesanan yang terlambat, yang melepas pekerjaan lebih awal, menaikkan WIP dan membuat lead time semakin panjang [26]. Alih-alih mengulang bagian tersebut, panduan ini menautkannya: lihat [kelemahan logika MRP klasik](https://www.m365.fm/en/learn/production-scheduling-aps/).

| Elemen lingkaran tertutup | Memeriksa | Umpan balik jika gagal |
|---|---|---|
| Perencanaan sumber daya di S&OP | kapasitas agregat per bulan | ubah rencana famili, keputusan kapasitas |
| RCCP | sumber daya kunci per minggu | ubah MPS |
| CRP | setiap pusat kerja per hari atau minggu | lembur, routing alternatif, ubah MPS |
| Input/output control dan penjadwalan terbatas | antrean dan urutan aktual | jadwal ulang, kontrol pelepasan, eskalasi ke MPS |
| Umpan balik lantai produksi (MES) | penyelesaian aktual, scrap, downtime | perbarui pesanan terbuka dan persediaan untuk proses MRP berikutnya |

## Nervositas MRP: mengapa rencana melonjak dan cara meredakannya

**Nervositas** berarti perubahan kecil pada MPS atau persediaan menyebabkan perubahan besar atau sering pada pesanan terencana di tingkat yang lebih rendah. Slide Gershwin menggambarkannya sebagai deviasi kecil yang menyebabkan perubahan jadwal yang besar [8]. Penyebabnya adalah interaksi antara lot sizing, offset lead time dan cakrawala perencanaan bergulir, ditambah noise pada data permintaan, pasokan dan catatan persediaan.

### Contoh kerja: 30 meja tambahan di minggu 4

Penjualan menerima pesanan tambahan: mulai perakitan D100 di minggu 4 naik dari 100 menjadi 130, perubahan sebesar 4% dari volume delapan minggu (30 dari 740). Menjalankan ulang contoh di atas menghasilkan:

| Item | Sebelum | Sesudah | Perubahan |
|---|---|---|---|
| T-20 Desktop, rilis terencana | minggu 2: 140, minggu 3: 100, minggu 5: 150, minggu 6: 100, minggu 7: 120 | minggu 2: 140, minggu 3: **130**, minggu 5: 150, minggu 6: 100, minggu 7: 120 | kuantitas +30 |
| F-10 Rangka kaki, rilis terencana | minggu 1, 2, **5**, 6 (masing-masing 200) | minggu 1, 2, **4**, 6 (masing-masing 200) | satu lot pengelasan dimajukan satu minggu |
| S-5 Pipa baja, rilis terencana | minggu 1: 500, **minggu 3: 500**, minggu 4: 1.000, minggu 5: 500 | minggu 1: 500, **minggu 2: 500**, minggu 4: 1.000, minggu 5: 500 | satu pesanan pembelian dimajukan satu minggu, kini jatuh tempo untuk dirilis minggu depan |

Tambahan 30 unit tidak mengubah kuantitas pipa atau rangka mana pun. Yang berubah adalah **tanggal** pada dua tingkat lebih rendah, karena lot tetap 200 rangka kini habis satu minggu lebih awal. Dalam BOM nyata dengan ratusan komponen, beberapa perubahan seperti ini setiap hari menghasilkan ribuan pesan penjadwalan ulang, dan perencana berhenti mempercayai sistem. Itulah nervositas.

### Solusi

Joseph Blackburn, Dean Kropp dan Robert Millen membandingkan lima strategi untuk meredam nervositas dalam studi simulasi yang diterbitkan di *Management Science* pada tahun 1986: membekukan jadwal dalam cakrawala perencanaan, lot-for-lot di bawah produk akhir, safety stock, peramalan melampaui cakrawala perencanaan, dan prosedur biaya perubahan [10]. Untuk nervositas yang disebabkan oleh cakrawala bergulir dan lot sizing, safety stock dan lot-for-lot tidak hemat biaya, sementara strategi biaya perubahan dan pembekuan umumnya berkinerja paling baik [10]. Studi tersebut tidak mencakup nervositas yang disebabkan oleh ketidakpastian permintaan, pasokan atau lead time [10].

| Solusi | Cara kerja | Trade-off |
|---|---|---|
| Zona beku dan time fence | tidak ada perubahan otomatis di dalam zona beku | responsivitas berkurang terhadap perubahan nyata |
| Pesanan terencana tetap | perencana mengunci pesanan terpilih; MRP tidak memindahkannya | perencana harus memeliharanya |
| Aturan biaya perubahan atau "peredaman" | MRP hanya mengusulkan penjadwalan ulang jika perubahan tanggal melebihi ambang (misalnya 3 hari) atau biaya perubahan sepadan | ketidaksesuaian kecil tetap ada |
| Lot-for-lot di tingkat lebih rendah | menghilangkan interaksi ukuran lot | lebih banyak setup dan pesanan; Blackburn dkk. menemukan tidak hemat biaya untuk nervositas yang didorong cakrawala [10] |
| Safety stock | menyerap perubahan kecil | biaya persediaan; juga tidak hemat biaya dalam studi tersebut [10] |
| Data akurat | lebih sedikit perubahan artifisial akibat persediaan atau BOM yang salah | memerlukan cycle counting dan disiplin perubahan rekayasa |
| Decoupling dengan buffer (DDMRP) | memutus rantai ketergantungan pada titik-titik terpilih | persediaan buffer, metode baru yang perlu dipelajari |

## Demand driven MRP (DDMRP)

**Demand driven material requirements planning (DDMRP)** mempertahankan logika BOM pada MRP, tetapi menghentikan penjabaran kebutuhan yang didorong ramalan pada **titik decoupling** terpilih, tempat ditempatkan buffer yang dimensinya ditentukan dan dikelola secara aktif. Pesanan pasokan dibuat dari permintaan aktual dan status buffer, bukan dari ramalan saja. Metode ini berasal dari konsultan Carol Ptak dan Chad Smith: pembaruan mereka pada tahun 2011 atas buku Orlicky, *Orlicky's Material Requirements Planning, Third Edition*, menambahkan panduan perencanaan dari pesanan penjualan aktual, bukan ramalan, dengan nama DDMRP [4]. TechTarget mencatat bahwa sebagian praktisi memandang pendekatan ini kontroversial [4]. Ptak dan Smith juga mendirikan Demand Driven Institute pada tahun 2011; lembaga ini mengevaluasi dan mensertifikasi perangkat lunak untuk kepatuhan DDMRP tanpa biaya bagi vendor, serta memberikan sertifikat dukungan profesional kepada individu [35].

### Lima komponen

Dokumentasi Microsoft untuk Dynamics 365 Supply Chain Management mencantumkan lima komponen DDMRP [11]:

1. **Penempatan inventori strategis:** mengidentifikasi titik decoupling dalam rantai pasokan tempat buffer inventori disimpan, dipantau, dan diisi ulang.
2. **Profil dan level buffer:** menentukan ukuran setiap buffer (minimum, maksimum, titik pemesanan ulang) dan kuantitas pemesanan ulang.
3. **Penyesuaian buffer dinamis:** menyesuaikan level buffer untuk parameter operasi atau peristiwa terencana yang berubah.
4. **Perencanaan didorong permintaan:** membuat pesanan pasokan (produksi, pembelian, transfer) sesuai kebutuhan.
5. **Eksekusi yang sangat kolaboratif dan terlihat:** menjalankan pesanan pasokan dengan prioritas visual, biasanya berdasarkan warna buffer.

### Penentuan ukuran buffer: contoh terperinci

Setiap buffer memiliki tiga zona, dihitung dari rata-rata pemakaian harian (ADU), lead time terdekopel (DLT), faktor lead time dan faktor variabilitas, sebagaimana didokumentasikan oleh Microsoft [12]:

| Zona | Rumus [12] |
|---|---|
| Kuning | ADU × DLT |
| Merah dasar | ADU × DLT × faktor lead time |
| Merah pengaman | merah dasar × faktor variabilitas |
| Merah | merah dasar + merah pengaman |
| Hijau | yang terbesar dari: kuantitas pesanan minimum; ADU × siklus pesanan; ADU × DLT × faktor lead time |

Microsoft merekomendasikan faktor lead time 0,20–0,40 untuk lead time panjang, 0,41–0,60 untuk lead time menengah, dan 0,61–1,00 untuk lead time pendek, serta faktor variabilitas 0,20–0,40 untuk variabilitas rendah, 0,41–0,60 untuk variabilitas menengah, dan 0,61–1,00 untuk variabilitas tinggi [12]. **Lead time terdekopel** adalah waktu yang dibutuhkan untuk memproduksi atau menerima suatu item jika titik decoupling di hulu tersedia stok; biasanya jauh lebih pendek daripada lead time kumulatif [12].

**Contoh (angka ilustratif).** Bracket beli B-7: ADU 40 pcs, lead time terdekopel 10 hari, faktor lead time 0,5 (menengah), faktor variabilitas 0,5 (menengah), kuantitas pesanan minimum 300, siklus pesanan 7 hari.

| Zona | Perhitungan | Ukuran | Kumulatif (batas atas zona) |
|---|---|---|---|
| Merah dasar | 40 × 10 × 0,5 | 200 | |
| Merah pengaman | 200 × 0,5 | 100 | |
| Merah | 200 + 100 | 300 | 300 |
| Kuning | 40 × 10 | 400 | 700 |
| Hijau | maks(300; 40 × 7 = 280; 200) | 300 | 1.000 |

### Persamaan aliran bersih

DDMRP memutuskan pengisian ulang dengan **posisi aliran bersih**: on hand + on order − permintaan pesanan penjualan yang memenuhi syarat [14]. Permintaan yang memenuhi syarat biasanya mencakup pesanan yang jatuh tempo hari ini, pesanan terlambat, dan lonjakan yang memenuhi syarat dalam horizon yang ditentukan. Jika posisi aliran bersih turun di bawah batas atas kuning, sebuah pesanan pasokan dibuat untuk mengembalikannya ke batas atas hijau [14].

Melanjutkan contoh: on hand 350, on order 400, permintaan yang memenuhi syarat 90. Posisi aliran bersih = 350 + 400 − 90 = **660**. Angka itu di bawah batas atas kuning (700), sehingga DDMRP mengusulkan pesanan sebesar 1.000 − 660 = **340** pcs. Pesanan ini melebihi kuantitas pesanan minimum 300, sehingga dapat dilanjutkan. Prioritas eksekusi kemudian ditetapkan berdasarkan status on hand: on hand sebesar 350 hanya sedikit di atas batas atas merah (300), yang oleh perencana akan diperlakukan sebagai mendesak.

### Kapan DDMRP cocok dan kapan tidak

| Situasi | Kecocokan DDMRP | Alasan |
|---|---|---|
| Lead time kumulatif panjang, pelanggan mengharapkan lead time pendek | baik | decoupling memadatkan lead time yang dilihat pelanggan |
| Banyak komponen bersama, variabilitas tinggi, MRP sering nervous | baik | buffer menyerap variabilitas alih-alih meneruskannya ke bawah BOM |
| Permintaan stabil dan dapat diperkirakan, BOM pendek | terbatas | MRP klasik atau kanban mungkin lebih sederhana |
| Proyek engineer-to-order sekali jalan | terbatas | sedikit item berulang untuk di-buffer; perencanaan proyek lebih dominan |
| Akurasi persediaan dan master data lemah | buruk | buffer yang dihitung berdasarkan ADU atau lead time yang salah melindungi item yang salah |

DDMRP bukan pengganti S&OP. Kebijakan buffer, kapasitas, dan investasi persediaan tetap memerlukan keputusan lintas fungsi bulanan, dan ERP tetap memerlukan MPS untuk produk jadi yang tidak di-buffer. Di Dynamics 365, DDMRP merupakan bagian dari modul master planning, menggunakan kode coverage tersendiri, tanpa biaya lisensi tambahan, dan memerlukan add-in Planning Optimization; Microsoft menegaskan bahwa DDMRP tidak menggantikan fungsionalitas perencanaan yang sudah ada [11]. SAP mencantumkan DDMRP di antara topik materi MRP-nya [27], dan IFS mendokumentasikan DDMRP di IFS Cloud [14]. Bukti independen dan telaah sejawat mengenai hasil DDMRP masih lebih sedikit dibandingkan materi kasus dari vendor dan konsultan; perlakukan persentase peningkatan dari vendor DDMRP sebagai klaim vendor.

## Perencanaan produksi di ERP: apa yang dilakukan sistem dan di mana batasnya

Hampir setiap ERP manufaktur memuat mesin MPS dan MRP. S&OP ditangani dengan tiga cara: di dalam ERP itu sendiri, di platform S&OP atau IBP khusus yang terhubung ke ERP, atau di spreadsheet di sekitar ERP.

### Fungsi perencanaan ERP yang umum

| Fungsi | Yang perlu diperhatikan |
|---|---|
| Manajemen permintaan dan peramalan | model statistik, konsumsi forecast oleh pesanan, forecast pada tingkat famili dan SKU |
| MPS | time fence, planned order yang firm, planning bill untuk opsi, ATP dan ATP kumulatif [7] |
| RCCP | bill of resources untuk sumber daya kunci, laporan beban vs. kapasitas |
| MRP | jalankan net change dan regeneratif, low-level code, aturan lot-sizing, pegging, pesan pengecualian |
| CRP | beban per work center dari routing |
| DDMRP | titik decoupling, profil buffer, net flow (jika didukung) [11] |
| Integrasi | ke alat S&OP, APS, MES, portal pemasok, BI |

### Pilihan di pasar (contoh, bukan peringkat)

| Kategori | Contoh yang diverifikasi untuk panduan ini | Catatan |
|---|---|---|
| ERP dengan MPS/MRP | Oracle JD Edwards EnterpriseOne (MPS, MRP, ATP) [7]; Microsoft Dynamics 365 Supply Chain Management (master planning dengan Planning Optimization, DDMRP) [11]; SAP S/4HANA (MRP; materi SAP mencakup predictive MRP dan DDMRP) [27]; IFS Cloud (DDMRP) [14] | banyak vendor ERP lain menawarkan MRP; periksa kedalaman perencanaan dalam demo berskenario |
| S&OP dan IBP terkait ERP | SAP Integrated Business Planning [5]; Oracle Fusion Cloud Sales and Operations Planning [33] | paling kuat bila ERP berasal dari vendor yang sama |
| Platform S&OP / IBP mandiri | Kinaxis, o9 Solutions, Blue Yonder, ToolsGroup, Board, Anaplan (daftar vendor menurut panduan pembeli Board 2026, ditulis oleh salah satu vendor) [29][15] | peringkat vendor oleh vendor tidak independen; gunakan laporan analis dengan metodologi yang dinyatakan |
| Spreadsheet | Excel dengan ekstrak ERP; Power BI untuk pelaporan KPI | memadai untuk siklus S&OP pertama dengan sedikit famili; rapuh pada skala besar |

Bagi perusahaan yang berpusat pada Microsoft, pengaturan praktisnya adalah menjalankan MPS dan MRP di ERP, menyiapkan S&OP di Excel atau alat perencanaan, dan mempublikasikan paket KPI serta log keputusan melalui Power BI dan Teams. Microsoft memposisikan Dynamics 365, Microsoft 365, dan Azure bersama sebagai "Microsoft for Manufacturing" [31], dan data Dataverse dapat dibuat tersedia di Microsoft Fabric tanpa pipeline ETL terpisah [32]. [Panduan Azure untuk manufaktur](https://www.m365.fm/en/learn/manufacturing-it-azure/) membahas arsitekturnya.

### Cara ERP menjalankan MRP

Sebagian besar sistem ERP menawarkan dua mode run: run **regeneratif** yang menghitung ulang semua item dari awal, sering kali setiap malam atau setiap minggu, dan run **net change** yang hanya menghitung ulang item yang permintaan, pasokan, atau data master-nya berubah. Bagaimanapun juga, rencana hanya sebaik data yang dilihat oleh run tersebut: jika MES memposting penyelesaian dan scrap sekali per shift tetapi MRP berjalan pukul 2 pagi, daftar pengecualian di pagi hari mencerminkan kondisi lantai produksi kemarin. Selaraskan waktu run MRP dengan siklus posting MES dan persediaan, dan jaga MPS tetap stabil selama run agar perencana dan sistem tidak bekerja berlawanan satu sama lain. [Panduan MES dan ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) membahas pertukaran data antara Level 3 dan Level 4.

### Titik di mana perencanaan ERP berhenti

- **Kapasitas terbatas (finite).** MRP dan CRP ERP merencanakan berdasarkan kapasitas tak terbatas (infinite) [8]. Jika bottleneck menentukan tanggal pengiriman, diperlukan penjadwal terbatas atau APS; lihat [panduan APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
- **Skenario.** Membandingkan tiga opsi pasokan dengan efek material dan kapasitas secara penuh berjalan lambat pada sebagian besar run MRP ERP. Platform perencanaan mengklaim perhitungan ulang skenario yang cepat; Kinaxis, misalnya, menggambarkan perencanaan konkuren yang memangkas siklus dari minggu menjadi jam (klaim vendor) [16].
- **Respons terhadap gangguan.** Dalam survei IDC yang dipesan oleh Kinaxis (1.800 responden di sembilan negara, dilaksanakan Desember 2023), 83% rantai pasok tidak mampu merespons gangguan dalam 24 jam (riset yang dipesan vendor) [30].
- **Eksekusi.** Dispatching, konfirmasi, dan WIP real-time termasuk ke dalam MES (ISA-95 Level 3) [25].

### Daftar periksa pemilihan perangkat lunak S&OP dan perencanaan

| Pertanyaan | Mengapa penting |
|---|---|
| Apakah dapat merekonsiliasi rencana keluarga produk dengan MPS tingkat SKU secara otomatis? | upaya manual paling umum dalam S&OP |
| Apakah menampilkan rencana dalam unit dan dolar secara berdampingan? | keuangan harus terlibat dalam proses |
| Berapa lama waktu untuk menghitung satu skenario penuh (perubahan permintaan + kapasitas + material)? | menentukan apakah skenario benar-benar digunakan dalam rapat |
| Integrasi ERP mana yang bersifat standar, dan siapa yang memeliharanya? | integrasi sering kali lebih mahal daripada lisensi |
| Dapatkah perencana mengubah data master (lead time, ukuran lot) dengan jejak audit? | kualitas data adalah pendorong utama kualitas rencana |
| Apakah nilai tambah forecast (override manual vs. statistik) diukur? | menunjukkan apakah penyesuaian konsensus membantu |
| Berapa waktu realistis hingga siklus S&OP live pertama? | Anaplan, misalnya, menyarankan untuk mengharapkan nilai yang dapat didemonstrasikan dalam 8–12 minggu (panduan vendor) [15] |
| Total biaya selama 5 tahun termasuk staf internal | biaya lisensi biasanya bagian yang lebih kecil [unverified: tidak ada studi biaya independen yang terverifikasi] |

## Templat: Kalender S&OP, agenda, rencana keluarga, catatan MPS dan MRP

Tabel-tabel di bawah ini dapat disalin ke Excel atau daftar SharePoint sebagai titik awal. Agenda untuk rapat tinjauan permintaan, tinjauan pasokan, dan rapat eksekutif ada di Bagian 4.

### Templat 1: rencana keluarga produk (satu lembar per keluarga, MTS)

| Baris | Aktual M-1 | M1 | M2 | M3 | M4–M6 (kuartal) | M7–M12 (semester) | M13–M18 | Catatan |
|---|---|---|---|---|---|---|---|---|
| Anggaran / rencana keuangan (unit) | | | | | | | | dari keuangan |
| Perkiraan statistik (unit) | | | | | | | | model, versi |
| Rencana permintaan konsensus (unit) | | | | | | | | pemilik: VP penjualan |
| Konsensus bulan lalu (unit) | | | | | | | | perubahan terlihat |
| Rencana pasokan (unit) | | | | | | | | pemilik: VP operasi |
| Persediaan akhir (unit) | | | | | | | | |
| Target persediaan (unit atau hari pasokan) | | | | | | | | kebijakan |
| Beban sumber daya kunci (% kapasitas) | | | | | | | | mis. pengelasan |
| Pendapatan pada harga standar ($) | | | | | | | | keuangan |
| Harga pokok penjualan pada biaya standar ($) | | | | | | | | keuangan |
| Asumsi dan risiko | | | | | | | | tautan ke log |

Untuk keluarga make-to-order, ganti baris persediaan dengan **backlog** dan **target backlog (minggu)**. Backlog akhir = backlog awal + pesanan baru − pengiriman.

### Templat 2: log asumsi

| ID | Keluarga | Asumsi | Pemilik | Tanggal ditambahkan | Dampak jika salah (unit, $) | Status / tanggal tinjauan |
|---|---|---|---|---|---|---|
| A-031 | desks | kenaikan harga pesaing pada April tetap berlaku | VP penjualan | 6 Jan | −400 unit/bulan | tinjauan 3 Feb |
| A-032 | desks | subkontraktor pengelasan terkualifikasi pada Maret | rantai pasok | 8 Jan | −300 unit pada April | sedang berjalan |

### Templat 3: log keputusan

| ID | Rapat / tanggal | Keputusan | Opsi yang dipertimbangkan | Pemilik | Batas waktu | Dampak pada rencana | Status |
|---|---|---|---|---|---|---|---|
| D-014 | S&OP eksekutif, 15 Jan | adopsi rencana hibrida, laju 3.500 / 4.000 / 3.000 | level, chase, hibrida | VP operasi | 31 Jan | +2.000 unit perubahan laju, $35.200 | terbuka |
| D-015 | S&OP eksekutif, 15 Jan | kualifikasi subkontraktor pengelasan untuk 200–400 unit/bulan | tidak ada / kualifikasi / shift ketiga | rantai pasok | 1 Mar | pengurangan risiko untuk Mar–Mei | terbuka |

### Templat 4: catatan MPS

| Item | Minggu | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Perkiraan | | | | |
| | Pesanan pelanggan | | | | |
| | Permintaan proyeksi (aturan per time fence) | | | | |
| | MPS (pasti / rencana) | | | | |
| | Saldo tersedia proyeksi | | | | |
| | ATP / ATP kumulatif | | | | |
| | Zona time fence | frozen | frozen | slushy | liquid |

### Templat 5: catatan MRP (per item)

| Item, LLC, lead time, aturan lot, stok pengaman, stok di tangan | Minggu | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Kebutuhan kotor | | | | |
| | Penerimaan terjadwal | | | | |
| | Stok di tangan proyeksi | | | | |
| | Kebutuhan bersih | | | | |
| | Penerimaan pesanan rencana | | | | |
| | Pelepasan pesanan rencana | | | | |

### Templat 6: daftar periksa kesiapan S&OP sebelum siklus pertama

| Item | Siap ketika |
|---|---|
| Keluarga produk ditetapkan | 5–15 keluarga per unit bisnis, masing-masing dengan sumber daya dan pendorong permintaan yang serupa |
| Sumber daya kunci ditetapkan | 3–8 sumber daya yang membatasi output, dengan kapasitas terbukti per bulan |
| Bill of resources | jam per unit per sumber daya kunci, per keluarga |
| Sumber data | pengiriman, pesanan, persediaan, produksi per keluarga tersedia pada hari kerja 1–2 |
| Kebijakan persediaan atau backlog | target per keluarga disetujui oleh keuangan |
| Kalender | 12 bulan tanggal dipesan untuk kelima langkah |
| Hak keputusan | ambang batas tertulis untuk tinjauan pasokan, pra-S&OP, dan rapat eksekutif |
| Sponsor eksekutif | ditunjuk, hadir langsung pada tiga siklus pertama |

## KPI S&OP dan MRP dengan contoh perhitungan

Paket KPI S&OP yang baik harus ringkas: sekitar sepuluh ukuran, masing-masing dengan definisi, penanggung jawab, dan target. [Panduan KPI manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/) membahas ukuran tingkat pabrik seperti OEE dan ketepatan pengiriman; bagian ini membahas ukuran perencanaan.

### Akurasi peramalan, bias, dan MAPE: satu kumpulan data, lima ukuran

**Data (ilustratif).** Peramalan bulanan (F, dibuat satu bulan sebelumnya) dan permintaan aktual (A) untuk keluarga meja:

| Bulan | Peramalan F | Aktual A | Kesalahan e = F − A | Kesalahan absolut \|e\| | Kesalahan persentase absolut \|e\| / A |
|---|---|---|---|---|---|
| Jan | 3.000 | 2.850 | +150 | 150 | 5,26% |
| Feb | 3.200 | 3.350 | −150 | 150 | 4,48% |
| Mar | 4.200 | 3.900 | +300 | 300 | 7,69% |
| Apr | 4.800 | 5.100 | −300 | 300 | 5,88% |
| Mei | 4.000 | 3.700 | +300 | 300 | 8,11% |
| Jun | 2.800 | 2.650 | +150 | 150 | 5,66% |
| **Jumlah** | **22.000** | **21.550** | **+450** | **1.350** | **37,08%** |

| Ukuran | Rumus | Perhitungan | Hasil |
|---|---|---|---|
| MAPE (mean absolute percentage error) | rata-rata \|e\| / A | 37,08% / 6 | **6,18%** |
| WMAPE (weighted MAPE) | Σ\|e\| / ΣA | 1.350 / 21.550 | **6,26%** |
| Akurasi peramalan | 1 − WMAPE | 1 − 0,0626 | **93,7%** |
| Bias | Σe / ΣA | +450 / 21.550 | **+2,1% (over-forecast)** |
| MAD (mean absolute deviation) | Σ\|e\| / n | 1.350 / 6 | **225 unit** |
| Tracking signal | Σe / MAD | 450 / 225 | **+2,0** |

Cara membacanya:

- **Akurasi dan bias menjawab pertanyaan yang berbeda.** Akurasi 93,7% terdengar baik. Namun empat dari enam bulan diramalkan terlalu tinggi, dan kesalahan kumulatifnya +450 unit. Jika pasokan mengikuti peramalan, persediaan bertambah sekitar 450 unit dalam enam bulan. Bias adalah ukuran yang menunjukkan optimisme sistematis atau sandbagging.
- **MAPE vs. WMAPE.** MAPE memberi bobot yang sama pada setiap bulan; WMAPE memberi bobot berdasarkan volume. Pada tingkat SKU, MAPE membengkak untuk item kecil: SKU dengan peramalan 10 dan aktual 2 memiliki kesalahan 400%. Gunakan WMAPE (atau MAD/rata-rata) untuk pelaporan tingkat SKU dan simpan MAPE untuk deret volume tinggi yang stabil.
- **Tracking signal.** Kesalahan kumulatif dibagi MAD. Nilai yang terus menjauh dari nol menunjukkan bias; aturan praktis umum menganggap model bekerja dengan benar selama tracking signal berada di antara −4 dan +4 [36].
- **Agregasi menyembunyikan kesalahan.** Dua SKU dengan peramalan masing-masing 1.000 dan aktual 1.200 serta 800 memberikan kesalahan keluarga 0, tetapi WMAPE tingkat SKU sebesar 400 / 2.000 = 20%. Laporkan akurasi pada tingkat tempat keputusan dibuat: keluarga untuk S&OP, SKU dan lokasi untuk MPS dan replenishment.
- **Lag itu penting.** Ukur peramalan yang dibekukan pada lead time yang berlaku (misalnya, peramalan yang dibuat tiga bulan sebelum bulan tersebut untuk suku cadang dengan lead time tiga bulan), bukan pembaruan dadakan.

### Forecast value added

Forecast value added (FVA) membandingkan kesalahan setiap tahap dalam proses peramalan dengan tahap sebelumnya. Jika peramalan statistik memiliki WMAPE 7,5% dan peramalan konsensus setelah penyesuaian penjualan memiliki 6,3%, proses konsensus menambah akurasi 1,2 poin persentase. Jika hasilnya 8,5%, rapat tersebut justru memperburuk peramalan. FVA mengubah tinjauan permintaan dari kontes opini menjadi proses yang terukur.

### Set KPI untuk S&OP dan MRP

| KPI | Definisi | Contoh target (ilustratif) | Penanggung jawab |
|---|---|---|---|
| Akurasi peramalan (1 − WMAPE), famili, lag 1–3 | lihat di atas | ≥ 90% | perencana permintaan |
| Bias peramalan, famili | Σ(F − A) / ΣA selama 3–6 bulan | dalam ±3% | VP penjualan |
| Pencapaian rencana pasokan | produksi aktual / produksi rencana per famili dan per bulan | 95–105% | VP operasi |
| Kepatuhan MPS | baris MPS yang selesai pada minggu rencana / seluruh baris MPS | ≥ 95% | master scheduler |
| Stabilitas jadwal | perubahan MPS dalam zona beku per minggu | cenderung turun | master scheduler |
| Layanan pelanggan | on-time in-full (OTIF) atau fill rate per famili | sesuai segmen | VP penjualan / rantai pasok |
| Persediaan vs. target | persediaan akhir / target, atau hari pasokan | 90–110% | rantai pasok |
| Akurasi catatan persediaan | item dalam toleransi hitung / item yang dihitung | akhir 90-an | gudang |
| Akurasi BOM | BOM terverifikasi benar / BOM yang diaudit | akhir 90-an | teknik |
| Beban pengecualian MRP | pesan pengecualian per perencana per minggu | cenderung turun | manajer material |
| Rencana pesanan yang terlambat | jumlah setelah setiap run MRP | mendekati nol | manajer material |
| Penutupan log keputusan | keputusan ditutup tepat waktu / keputusan yang jatuh tempo | ≥ 90% | pemilik proses S&OP |

Beberapa panduan MRP mengutip tolok ukur "Class A" dari Oliver Wight, seperti akurasi catatan persediaan 95% dan akurasi BOM 98% [28]. Ambang batas yang sama muncul dalam literatur penjadwalan induk: akurasi catatan persediaan 95% sebagai ambang batas penerimaan (98% robust) dan akurasi BOM minimal 98% (99+% baik) [37]. Daftar periksa Oliver Wight terkini sendiri tidak dapat diakses untuk panduan ini, sehingga atribusi ke Oliver Wight tetap [unverified: sumber asli daftar periksa belum dapat diakses]. Tetapkan target Anda sendiri berdasarkan baseline yang terukur.

### Sudut pandang keuangan: apa yang dilakukan S&OP bagi modal kerja

Keuangan biasanya menanyakan dua hal: berapa banyak persediaan yang dibawa oleh rencana, dan berapa biayanya? Dengan rencana hibrida dari Bagian 5, rata-rata persediaan akhir bulan adalah 6.300 / 6 = 1.050 meja. Dengan biaya standar $180 per meja (ilustratif), itu berarti $189.000 terikat rata-rata. Rencana level membawa 8.600 / 6 = 1.433 meja, atau $258.000. Dengan tingkat biaya penyimpanan 20% per tahun (ilustratif; gunakan tarif perusahaan Anda), selisih $69.000 dalam persediaan rata-rata menimbulkan biaya sekitar $13.800 per tahun. Angka-angka ini perlu dicantumkan dalam dokumen keputusan pra-S&OP bersama dampak layanan dan kapasitas.

## Roadmap implementasi: 12 bulan menuju S&OP dan MRP yang berjalan

| Fase | Bulan | Aktivitas utama | Kriteria keluar |
|---|---|---|---|
| 0. Asesmen | 0–1 | penilaian mandiri kematangan (Bagian 7), inventaris data, wawancara, komitmen sponsor | sponsor ditetapkan, ruang lingkup disepakati, KPI dasar terukur |
| 1. Desain | 1–2 | famili produk, sumber daya kunci, bill of resources, kalender, hak keputusan, definisi KPI, templat | dokumen desain ditandatangani sponsor |
| 2. Fondasi data | 1–4 (paralel) | akurasi persediaan (cycle counting), audit BOM termasuk efektivitas perubahan teknik, tinjauan lead time, aturan MPS dan time fence di ERP | akurasi persediaan dan akurasi BOM terukur serta membaik; lead time ditinjau untuk 80% nilai teratas |
| 3. Siklus pertama | 3–5 | jalankan siklus lima langkah dengan spreadsheet; tiga siklus berturut-turut dengan kehadiran eksekutif | tiga siklus selesai tepat waktu, log keputusan digunakan |
| 4. Hubungkan ke MPS dan MRP | 4–7 | aturan disagregasi, MPS direkonsiliasi dengan S&OP, RCCP pada sumber daya kunci, disiplin pengecualian MRP | MPS berada dalam toleransi S&OP; pesanan terencana yang terlambat berkurang |
| 5. Ukur dan perbaiki | 6–9 | akurasi dan bias peramalan, FVA, pencapaian rencana; akar penyebab meleset; aturan nervousness | KPI dilaporkan bulanan; minimal satu perubahan proses dari hasil FVA |
| 6. Perluas | 9–12 | integrasi keuangan (arah IBP), skenario, rapat S&OE mingguan, evaluasi alat bila spreadsheet membatasi proses | rencana dalam unit dan dolar; S&OE berjalan; keputusan alat dibuat berdasarkan bukti |

**Catatan praktis**

- **Mulailah dengan spreadsheet.** Alat tidak dapat memperbaiki proses yang belum ada. Kebanyakan perusahaan baru mengetahui apa yang mereka butuhkan dari perangkat lunak setelah tiga hingga enam siklus.
- **Uji coba pada satu unit bisnis atau pabrik.** S&OP di lima pabrik dan dua puluh famili pada hari pertama jarang bertahan hingga bulan kedua.
- **Pekerjaan data berjalan paralel.** Keputusan S&OP hanya sebaik MPS dan MRP di bawahnya; akurasi persediaan dan BOM menentukan apakah keluaran MRP dapat dipercaya.
- **Kualitas dan kontrol konfigurasi.** Dalam lingkungan yang diatur atau bersertifikat (kedirgantaraan, otomotif, medis), perubahan BOM juga merupakan urusan sistem mutu: perubahan teknik harus masuk ke BOM MRP dengan tanggal efektivitas yang tepat, atau MRP akan memesan komponen untuk revisi yang sudah digantikan. Libatkan pimpinan mutu dalam audit BOM; [panduan perencanaan produksi kedirgantaraan](https://www.m365.fm/en/learn/aerospace-production-planning/) membahas manajemen konfigurasi.
- **Manajemen perubahan.** Tim penjualan takut dibebani target peramalan; pabrik takut disalahkan atas kapasitas yang tidak pernah mereka miliki. Buat bias terlihat tanpa menyalahkan orang, dan rayakan keputusan yang diambil lebih awal.
- **Pelatihan.** Perencana dan master scheduler mendapat manfaat dari pelatihan terstruktur dalam dasar-dasar MPC; program ASCM CPIM adalah kredensial AS yang umum [24].

## Kesalahan umum

| Kesalahan | Gejala | Perbaikan |
|---|---|---|
| S&OP sebagai rapat pelaporan | 40 slide, tidak ada keputusan | dokumen keputusan dengan opsi; log keputusan |
| Eksekutif melewatkan rapat | delegasi tidak dapat memutuskan; isu terus ditunda | kehadiran sponsor sebagai aturan; agenda lebih singkat dan berfokus pada keputusan |
| Peramalan = target penjualan | peramalan terlalu tinggi secara sistematis, persediaan meningkat | pisahkan target dan peramalan; ukur bias |
| S&OP tingkat SKU | ratusan baris, tidak ada waktu untuk keputusan | keluarga produk untuk S&OP, SKU untuk MPS |
| Tidak ada keuangan dalam rapat | rencana dalam unit tidak sesuai anggaran | mitra keuangan dalam pra-S&OP; rencanakan dalam unit dan dolar |
| MPS tidak direkonsiliasi dengan S&OP | lantai produksi mengikuti rencana yang berbeda | aturan disagregasi dan pemeriksaan toleransi setiap bulan |
| MPS yang kelebihan beban | pesanan terlambat setelah setiap proses MRP | RCCP pada sumber daya kunci; MPS pada kapasitas yang telah terbukti |
| Lead time rencana tidak pernah ditinjau | rilis terlalu awal atau terlambat, WIP membengkak | tinjauan lead time triwulanan; lihat sindrom lead time [26] |
| Data persediaan dan BOM tidak akurat | percepatan pengiriman, kekurangan meskipun stok "tersedia" | cycle counting, audit BOM, proses perubahan teknik |
| Bereaksi terhadap setiap pesan pengecualian | kegelisahan, kelelahan perencana | fence waktu, pesanan rencana yang tetap, ambang batas peredaman [10] |
| Membeli perangkat lunak terlebih dahulu | alat mahal, perdebatan yang sama | tiga sampai enam siklus manual terlebih dahulu |
| Mengabaikan bottleneck | rencana layak secara rata-rata, tidak layak pada bulan puncak | tinjau beban sumber daya kunci pada setiap tinjauan pasokan; lihat [theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) |

## Batasan S&OP dan MRP

**S&OP adalah proses bulanan di dunia yang berubah setiap minggu.** Rencana yang disetujui pada tanggal 15 bisa sudah usang pada tanggal 25. S&OE dan pembaruan S&OP berbasis peristiwa mengatasi hal ini, tetapi memerlukan disiplin agar tidak perlu merencanakan ulang semuanya setiap minggu.

**Agregasi menyembunyikan masalah.** Rencana keluarga produk bisa layak sementara varian tertentu kekurangan komponen tertentu. Itulah sebabnya MPS dan MRP di bawah S&OP penting, dan mengapa definisi keluarga produk sebaiknya mengelompokkan item yang berbagi sumber daya.

**MRP bersifat deterministik; kenyataan tidak.** MRP memperlakukan peramalan, lead time, dan yield sebagai angka tetap [8]. Persediaan pengaman dan lead time pengaman menutupi sebagian variasi, tetapi MRP tidak dapat merepresentasikan ketidakpastian secara eksplisit. DDMRP, model stokastik, dan simulasi (lihat [simulasi manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)) mengatasinya dari sudut pandang yang berbeda.

**MRP merencanakan dengan kapasitas tak terbatas.** MRP dan CRP menunjukkan kelebihan beban tetapi tidak menyelesaikannya [8][9]. Penjadwalan terbatas dan APS mengisi celah ini pada tingkat operasional.

**MRP menetapkan lead time yang sebenarnya bergantung pada beban.** Lead time rencana adalah masukan bagi MRP tetapi merupakan hasil dari beban kerja bengkel. Sindrom lead time menunjukkan apa yang terjadi ketika perencana memperlakukannya sebagai alat pengungkit [26].

**Ketergantungan pada data.** MRP memperbesar kesalahan data: jumlah per satuan yang salah dalam BOM level 2 akan terus merambat ke setiap induk. Tidak ada algoritma yang dapat mengompensasi catatan persediaan yang salah.

**Budaya.** Literatur akademik mencantumkan hambatan organisasi, seperti silo fungsional dan tidak adanya komitmen eksekutif, sebagai salah satu alasan utama inisiatif S&OP terhenti [1]. Perangkat lunak tidak menghilangkan hambatan tersebut.

**Tidak setiap bisnis memerlukan seluruh rangkaian.** Job shop dengan lead time pendek dan pesanan yang sebagian besar spesifik pelanggan mungkin lebih membutuhkan penerimaan pesanan yang baik dan penjadwalan terbatas daripada S&OP 24 bulan. Distributor mungkin lebih membutuhkan DRP daripada MRP. Sesuaikan metode dengan bisnisnya.

## AI dan perencanaan digital: apa yang berhasil saat ini

Perangkat lunak perencanaan dan vendor ERP kini memasarkan peramalan pembelajaran mesin, "demand sensing", agen perencanaan, dan copilot. Bagi sebuah pabrik, pertanyaan yang berguna adalah keputusan perencanaan mana yang menjadi lebih baik dan bagaimana peningkatan itu diukur.

| Aplikasi | Fungsinya | Di mana membantu | Yang perlu diperiksa |
|---|---|---|---|
| Peramalan pembelajaran mesin | menggunakan banyak pendorong (harga, promosi, cuaca, pesanan) di luar riwayat | banyak SKU dengan pendorong permintaan yang diketahui | ukur FVA terhadap baseline statistik sederhana; ML sering mengungguli baseline untuk sebagian famili dan tidak untuk famili lainnya |
| Demand sensing jangka pendek | menyesuaikan peramalan jangka dekat dengan pesanan terbaru dan data point-of-sale | barang konsumen, distribusi | hanya berguna jika MPS dan S&OE dapat bertindak atas perubahan mingguan |
| Perencanaan skenario dan perhitungan ulang cepat | menghitung ulang dampak permintaan, kapasitas, dan material dari suatu keputusan | supply review, pre-S&OP | waktu kalkulasi, latensi data, siapa yang dapat menjalankan skenario [16] |
| Penyetelan parameter | menyarankan lead time, safety stock, ukuran lot, faktor buffer DDMRP dari data aktual | pemeliharaan master data MRP | perencana meninjau sebelum perubahan; jejak audit |
| Triase pengecualian | memeringkat pesan pengecualian MRP berdasarkan dampak terhadap pesanan pelanggan | perencanaan material | tingkat penerimaan rekomendasi; waktu yang dihemat |
| Asisten AI generatif | merangkum paket S&OP, menyusun dokumen keputusan, menjawab "mengapa rencana ini berubah?" dari data perencanaan | persiapan rapat | jawaban harus mengutip data yang digunakan; tidak ada perubahan rencana otonom tanpa persetujuan |
| Digital twin dan simulasi | menguji opsi kapasitas, buffer, dan tata letak sebelum memutuskan | supply review untuk investasi kapasitas | validasi model terhadap kinerja aktual; lihat [panduan digital twin](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |

Empat aturan menjaga agar AI tetap berguna dalam perencanaan:

1. **Perbaiki proses terlebih dahulu.** Peramalan AI yang dimasukkan ke dalam proses tanpa demand review, tanpa pengukuran bias, dan tanpa hak keputusan hanya menghasilkan kebingungan yang lebih cepat.
2. **Ukur nilai tambah.** Perlakukan setiap model seperti langkah peramalan lainnya dan lacak FVA-nya (Bagian 16).
3. **Pertahankan akuntabilitas manusia atas keputusan.** Keputusan S&OP menyangkut uang, orang, dan pelanggan. Alat dapat menyiapkan opsi; tim eksekutif yang memutuskan.
4. **Fondasi data sebelum model.** Sebagian besar proyek perencanaan AI terhenti karena kualitas riwayat, master data, dan integrasi, bukan karena algoritma. Dalam lingkungan Microsoft, pilihan platform seperti Fabric dan Power BI dibahas dalam [panduan Azure untuk manufaktur](https://www.m365.fm/en/learn/manufacturing-it-azure/) [31][32].

### Pengaturan Microsoft 365 yang realistis untuk S&OP

| Elemen | Alat | Catatan |
|---|---|---|
| Kalender dan rapat | Outlook, Teams | seri berulang untuk kelima langkah, dipesan 12 bulan ke depan |
| Paket KPI | laporan Power BI dari data ERP dan perencanaan | satu halaman per famili; tata letak yang sama setiap bulan |
| Rencana famili dan skenario | Excel (siklus awal), kemudian alat perencanaan | kontrol versi: satu file per siklus, hanya-baca setelah disetujui |
| Asumsi dan log keputusan | Microsoft Lists atau daftar SharePoint | pemilik, tenggat, status; ditautkan dalam agenda eksekutif |
| Dokumen keputusan | Word atau halaman Loop, satu halaman per keputusan | opsi, dampak, rekomendasi |
| Dukungan persiapan | ringkasan Copilot dari paket KPI dan log | ditinjau oleh pemilik proses sebelum didistribusikan |

## Glosarium

| Istilah | Definisi |
|---|---|
| Aggregate planning | perencanaan laju produksi, tenaga kerja, dan persediaan untuk famili produk dalam jangka menengah; asal mula S&OP [1] |
| Available to promise (ATP) | bagian pasokan terencana yang belum dikomitmenkan dan dapat dijanjikan untuk pesanan pelanggan baru (Bagian 8) |
| Bill of materials (BOM) | daftar komponen, kuantitas, dan struktur yang diperlukan untuk membuat item induk |
| Bill of resources | jam per unit produk atau famili pada setiap sumber daya utama; digunakan dalam perencanaan sumber daya S&OP dan RCCP |
| Capacity requirements planning (CRP) | perhitungan beban terperinci per pusat kerja dari pesanan MRP dan routing, dengan kapasitas tak terbatas [8] |
| Cumulative lead time | jalur lead time terpanjang melalui BOM, dari pembelian material pertama hingga penyelesaian item akhir |
| Decoupling point | posisi dalam BOM atau rantai pasok tempat buffer DDMRP memisahkan variabilitas pasokan dari permintaan [11] |
| Demand time fence | batas dalam MPS di dalam mana hanya pesanan pelanggan, bukan ramalan, yang dihitung sebagai permintaan |
| Dependent demand | permintaan yang dihitung dari permintaan item induk, berbeda dengan permintaan independen (ramalan) [13] |
| DDMRP | demand driven material requirements planning: buffer pada titik decoupling, ditentukan ukurannya berdasarkan zona dan diisi ulang dengan persamaan net flow [11][12] |
| Exception message | rekomendasi MRP untuk merilis, menjadwal ulang, atau membatalkan pesanan |
| Firm planned order | pesanan terencana yang ditetapkan oleh perencana agar tidak diubah secara otomatis oleh MRP |
| Forecast bias | ramalan yang secara sistematis terlalu tinggi atau terlalu rendah; Σ(F − A) / ΣA |
| Forecast value added (FVA) | perubahan kesalahan ramalan yang disebabkan oleh suatu tahap dalam proses peramalan |
| Gross requirements | total permintaan untuk suatu item dalam suatu periode sebelum dikurangi persediaan |
| Integrated business planning (IBP) | istilah Oliver Wight untuk perluasan S&OP di seluruh perusahaan yang mencakup portofolio dan keuangan, dengan horizon minimal 24 bulan [2] |
| Low-level code | tingkat BOM terendah tempat suatu item muncul; menentukan urutan pemrosesan MRP [8] |
| Lot-for-lot | aturan penentuan ukuran lot yang memesan tepat sebesar kebutuhan bersih setiap periode [8] |
| MAPE / WMAPE | mean absolute percentage error / weighted MAPE (Bagian 16) |
| Master production schedule (MPS) | pernyataan tentang apa yang diharapkan perusahaan untuk diproduksi menurut item akhir dan periode, berdasarkan rencana taktis [7] |
| MRP | material requirements planning: perhitungan kebutuhan bersih semua komponen yang bertahap waktu dari MPS, BOM, dan persediaan [7] |
| MRP II | manufacturing resource planning: MRP ditambah S&OP, MPS, RCCP, CRP, shop floor control, dan integrasi keuangan [3] |
| Net flow position | DDMRP: on hand + on order − qualified demand [14] |
| Nervousness | perubahan yang sering atau besar pada pesanan terencana akibat perubahan kecil pada masukan [8][10] |
| Net requirements | gross requirements dikurangi persediaan tersedia dan penerimaan terjadwal, ditambah safety stock jika berlaku |
| Pegging | keterkaitan antara suatu kebutuhan dan permintaan sumbernya |
| Planned order release | tanggal dan kuantitas saat pesanan terencana sebaiknya dirilis, dikurangi lead time dari tanggal penerimaannya |
| Planning time fence | batas di luar mana sistem perencanaan dapat membuat atau mengubah pesanan secara otomatis |
| Projected available balance (PAB) | perkiraan persediaan pada akhir suatu periode dalam MPS |
| Rough-cut capacity planning (RCCP) | pemeriksaan MPS terhadap sumber daya utama menggunakan bill of resources |
| S&OE | sales and operations execution: proses mingguan untuk menjalankan rencana S&OP dalam jangka pendek |
| Sales and operations planning (S&OP) | proses lintas fungsi bulanan untuk mengintegrasikan rencana permintaan dan pasokan per famili, dalam unit dan dolar [1] |
| Scheduled receipt | pesanan produksi atau pembelian terbuka dengan tanggal jatuh tempo |
| Tracking signal | kesalahan ramalan kumulatif dibagi MAD; menunjukkan bias |

## FAQ: perencanaan penjualan dan operasi serta MRP

### Apa itu perencanaan penjualan dan operasi dalam istilah sederhana?

S&OP adalah siklus rapat bulanan ketika penjualan, operasi, rantai pasok, dan keuangan menyepakati satu rencana tunggal tentang apa yang akan dijual, diproduksi, dan disimpan perusahaan selama 18 hingga 36 bulan ke depan, per keluarga produk [1][5]. Tim eksekutif menggunakannya untuk membuat pertukaran (trade-off), misalnya menambah shift atau membangun persediaan sebelum penghentian operasi.

### Apa saja langkah-langkah proses S&OP?

Lima langkah umum adalah pengumpulan data, tinjauan permintaan, tinjauan pasokan, pra-S&OP (rekonsiliasi), dan rapat S&OP eksekutif [1][20]. Beberapa perusahaan menambahkan tinjauan produk atau portofolio di awal; Anaplan, misalnya, mencantumkan tinjauan produk, permintaan, pasokan, keuangan, pra-S&OP, dan eksekutif [15].

### Seberapa sering S&OP sebaiknya dilakukan?

Setiap bulan, dengan kalender tetap [1][5]; Anaplan, misalnya, menggambarkan siklus bulanan dengan pertemuan mingguan bagi peserta utama [15]. Rapat S&OE mingguan menangani perubahan jangka pendek di antara siklus, dan kejadian besar (pesanan besar, gangguan pabrik) dapat memicu tinjauan tambahan.

### Siapa yang sebaiknya hadir dalam rapat S&OP eksekutif?

General manager atau presiden unit bisnis sebagai ketua, ditambah kepala penjualan, pemasaran, operasi, rantai pasok, dan keuangan, serta manajemen produk atau teknik jika keputusan portofolio masuk dalam agenda. Pemilik proses S&OP menyiapkan dan mendokumentasikannya.

### Apa perbedaan antara S&OP dan IBP?

IBP memperluas S&OP dari penyeimbangan permintaan-pasokan ke seluruh rencana bisnis, termasuk portofolio, strategi, dan keuangan, dengan horizon minimal 24 bulan [2]. Oliver Wight mengembangkan S&OP pada tahun 1980-an dan mencetuskan istilah IBP pada awal tahun 2000-an [2].

### Apa perbedaan antara S&OP dan MRP?

S&OP memutuskan volume per keluarga produk dan per bulan lintas fungsi. MRP menghitung, untuk setiap komponen, berapa banyak yang harus dibeli atau dibuat dan kapan, dari jadwal produksi induk, BOM, dan persediaan [7]. S&OP menetapkan kerangka; MRP menjalankannya pada tingkat part.

### Apa perbedaan antara MPS dan MRP?

MPS merencanakan produk jadi (atau item perencanaan) per minggu; MRP menguraikan MPS melalui BOM untuk merencanakan komponen dan material [7]. Keduanya menggunakan logika netting yang sama, tetapi MPS ditetapkan oleh master scheduler sedangkan MRP dihitung oleh sistem.

### Bagaimana MRP bekerja?

Untuk setiap item, level demi level: ambil kebutuhan kotor, kurangi persediaan di tangan dan penerimaan terjadwal, terapkan stok pengaman untuk mendapatkan kebutuhan bersih, tentukan ukuran lot, geser sesuai lead time untuk mendapatkan pelepasan pesanan terencana, dan teruskan ke bawah sebagai kebutuhan kotor komponen [8]. Bagian 10 menunjukkan contoh lengkap yang dikerjakan.

### Apa saja input MRP?

Jadwal produksi induk, daftar material (bill of materials), catatan persediaan (on hand, stok pengaman), pesanan terbuka (penerimaan terjadwal), dan data perencanaan item (lead time, aturan lot-sizing) [7][8].

### Apa perbedaan antara MRP dan MRP II?

MRP menghitung kebutuhan material. MRP II, didefinisikan oleh Oliver Wight pada tahun 1983, menambahkan S&OP, penjadwalan induk, perencanaan kapasitas rough-cut dan terperinci, pengendalian lantai produksi, dan keterkaitan dengan perencanaan keuangan [3].

### Apa perbedaan antara MRP dan ERP?

MRP adalah metode perencanaan dan modul ERP. ERP adalah sistem terintegrasi untuk keuangan, penjualan, pembelian, SDM, dan manufaktur, dengan MRP sebagai inti perencanaannya untuk material. Gartner mencetuskan istilah ERP pada tahun 1990 [4].

### Apa itu DDMRP?

Demand driven MRP menempatkan buffer persediaan pada titik decoupling tertentu, menentukan ukurannya dalam zona merah, kuning, dan hijau dari pemakaian harian rata-rata dan lead time, serta mengisi ulangnya dengan persamaan aliran bersih (on hand + on order − permintaan yang memenuhi syarat) [11][12][14]. Metode ini dirancang untuk mengurangi ketergantungan pada peramalan dan ketidakstabilan MRP klasik; bukti independen mengenai hasilnya masih terbatas.

### Apa itu available to promise?

ATP adalah bagian dari pasokan terencana yang belum dikomitmenkan untuk pesanan pelanggan dan dapat dijanjikan untuk pesanan baru. Dalam contoh di Bagian 8, pelanggan yang meminta 100 unit pada minggu ke-2 dapat menerima 60 unit segera dan sisanya dari minggu ke-4.

### KPI apa yang mengukur keberhasilan S&OP?

Akurasi peramalan (1 − WMAPE) dan bias pada tingkat keluarga, pencapaian rencana pasokan, kepatuhan MPS, layanan pelanggan (OTIF atau fill rate), persediaan atau backlog terhadap target, dan tingkat penutupan keputusan. Bagian 16 memberikan rumus dan contoh perhitungan.

### Bagaimana cara menghitung akurasi peramalan?

Rumus yang umum digunakan adalah 1 − WMAPE, dengan WMAPE = Σ|peramalan − aktual| / Σ aktual. Dengan kesalahan absolut 1.350 unit dan permintaan aktual 21.550, WMAPE adalah 6,26% dan akurasi peramalan 93,7%. Selalu laporkan bias bersama angka ini.

### Mengapa proses S&OP gagal?

Penyebab yang paling umum adalah tidak adanya keterlibatan eksekutif, peramalan yang sebenarnya merupakan target penjualan, tidak melibatkan keuangan, terlalu rinci (SKU, bukan famili), tidak terhubung ke MPS, dan membeli perangkat lunak sebelum prosesnya berjalan. Bagian 18 memuat perbaikannya.

### Dapatkah produsen kecil melakukan S&OP tanpa perangkat lunak khusus?

Bisa. Perusahaan dengan sejumlah famili produk dapat menjalankan S&OP menggunakan ekstrak ERP, Excel, dan log keputusan bersama. Perangkat lunak menjadi layak digunakan ketika rekonsiliasi antara famili dan SKU, skenario, atau persiapan data memakan waktu lebih lama daripada keputusan itu sendiri.

### Apa yang dimaksud dengan nervousness pada MRP?

Nervousness adalah kecenderungan rencana MRP sering berubah ketika masukan berubah sedikit. Dalam contoh di Bagian 12, tambahan 30 meja memindahkan pesanan pada dua tingkat BOM yang lebih rendah. Time fence, firm planned order, dan aturan biaya perubahan dapat mengurangi hal ini [10].

### Apa manfaat S&OP?

S&OP menggantikan angka penjualan, produksi, dan keuangan yang terpisah dengan satu rencana yang disepakati untuk setiap famili produk. Keputusan yang memindahkan biaya dari satu fungsi ke fungsi lain, seperti shift kedua, prabangun, atau penghentian varian, dibuat oleh pihak yang memiliki biaya dan manfaatnya sekaligus (Bagian 1). MPS dan MRP menerima rencana yang sudah diperiksa terhadap kapasitas, sehingga lebih sedikit pesanan yang harus dipercepat di kemudian hari. Keuangan dapat melihat dampak modal kerja sebelum terjadi: dalam contoh ilustratif di Bagian 16, rencana hibrida rata-rata membawa sekitar 380 meja lebih sedikit dibandingkan rencana level, yang bernilai sekitar $13.800 per tahun dalam biaya penyimpanan. Persentase manfaat yang dipublikasikan oleh vendor dan survei sangat bervariasi, sehingga ukurlah baseline Anda sendiri sebelum siklus pertama.

### Apa keluaran dari MRP?

Untuk setiap item yang diproduksi dan dibeli, MRP menghasilkan penerimaan pesanan terencana dan pelepasan pesanan terencana yang bertahap menurut waktu, diimbangi dengan lead time [8]. MRP juga menghasilkan pesan pengecualian untuk pesanan terbuka (release, reschedule in, reschedule out, cancel, past due, below safety stock) serta pegging, yaitu tautan setiap kebutuhan ke item induk dan pesanan pelanggan. Bagian 10 memperlihatkan ketiganya dengan contoh yang dikerjakan.

### Apa perbedaan antara MRP dan JIT?

MRP adalah perhitungan perencanaan: ia menguraikan master production schedule melalui bill of materials dan membuat pesanan berjadwal sebelum kebutuhan muncul. Just-in-time (JIT) adalah pendekatan produksi lean yang mengisi ulang sesuai konsumsi aktual, biasanya dengan sinyal kanban, dan bertujuan pada lot kecil serta persediaan rendah. Keduanya tidak saling meniadakan. Banyak pabrik menggunakan MRP untuk suku cadang dengan lead time panjang, mahal, dan permintaan tidak merata, serta kanban untuk suku cadang yang bergerak cepat di lini produksi (Bagian 10). [Panduan kanban dan sistem pull](https://www.m365.fm/en/learn/kanban-pull-system/) membahas sisi pull.

## Kesimpulan dan langkah pertama

Perencanaan penjualan dan operasi (S&OP) serta MRP memecahkan masalah yang sama pada dua tingkat. S&OP memungkinkan tim pimpinan memutuskan, sekali sebulan, berapa banyak yang akan dijual, diproduksi dan disimpan per keluarga produk, serta berapa biayanya. Jadwal produksi induk (MPS) menerjemahkan keputusan itu menjadi produk akhir per minggu, perencanaan kapasitas rough-cut (RCCP) memeriksanya terhadap bottleneck, dan MRP menghitung apa yang dibutuhkan setiap komponen, dan kapan. Setiap tingkat membutuhkan tingkat di atasnya agar realistis dan tingkat di bawahnya agar dapat dijalankan. Penjadwalan detail dan lantai produksi melengkapi rantai ini.

Metodenya sudah lama ada (Orlicky merumuskan MRP pada 1964, Oliver Wight membentuk S&OP pada 1980-an) dan masih menjadi tulang punggung perencanaan ERP [2][3][4]. Kelemahannya sudah diketahui: kapasitas tak terbatas, lead time tetap, nervousness dan ketergantungan pada data. Time fence, RCCP, buffer DDMRP dan penjadwalan terbatas (finite scheduling) menanggulanginya. Alat AI dapat mempercepat peramalan dan kerja skenario, tetapi hanya jika proses, data dan hak keputusan sudah tersedia.

**Langkah pertama Anda dalam 30 hari ke depan**

- [ ] Tetapkan 5–15 keluarga produk dan 3–8 sumber daya utama beserta kapasitas bulanan yang terbukti
- [ ] Tarik data pengiriman dan pesanan 24 bulan per keluarga produk dan ukur akurasi peramalan (1 − WMAPE) serta bias untuk 6 bulan terakhir
- [ ] Periksa apakah jumlah MPS per keluarga produk sesuai dengan rencana penjualan dan produksi Anda saat ini
- [ ] Jalankan MRP Anda dan hitung pesanan terencana yang sudah lewat tenggat serta pesan pengecualian per perencana; itu menjadi dasar pengukuran nervousness Anda
- [ ] Audit akurasi persediaan untuk 50 item teratas berdasarkan nilai dan akurasi BOM untuk 10 produk akhir teratas
- [ ] Pesan kalender lima langkah S&OP untuk 12 bulan ke depan dan tunjuk seorang sponsor eksekutif serta pemilik proses
- [ ] Jalankan siklus pertama dengan spreadsheet menggunakan templat di Bagian 15, dan mulai log keputusan pada rapat eksekutif pertama

---

## Bacaan lanjutan di m365.fm

**Panduan dalam jalur pembelajaran ini**
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/): penjadwalan detail, kelemahan MRP, lead time syndrome, kapasitas terbatas
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/): pull, heijunka, kanban sebagai alternatif perencanaan push
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/): OEE, ketepatan waktu pengiriman, ukuran persediaan
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/): pengujian skenario untuk keputusan kapasitas
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/): integrasi ERP, MES dan platform data
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/): perencanaan di lingkungan engineer-to-order dan lead time panjang
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/): bottleneck dan drum-buffer-rope
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)

**Kajian mendalam**
- [Lot Sizing: EOQ, EPQ and MRP Lot-Sizing Rules](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Manufacturing Inventory Management and Safety Stock](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Supply Chain Resilience](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Manufacturing Simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** adalah pembawa acara m365.fm dan bekerja di iFAKT GmbH. Di m365.fm ia menulis tentang lean manufacturing, perencanaan produksi, dan transformasi digital manufaktur, dengan fokus pada bagaimana proses perencanaan, model aliran nilai, simulasi, dan analisis KPI bekerja bersama dalam praktik.

**Catatan: Penulis bekerja di iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked "via sibling pillar" were opened and verified on the same date for the m365.fm guide on production scheduling and APS or the Azure for manufacturing guide and are reused with their verified bibliographic data.

1. Sales and operations planning (history incl. aggregate production planning and Richard "Dick" Ling; definitions; five process steps after Wagner et al. 2014; tactical horizon up to 18 months; maturity models after Grimson and Pyke 2007 and Wagner et al. 2014; enablers and barriers). Wikipedia. https://en.wikipedia.org/wiki/Sales_and_operations_planning
2. What Is the Difference Between S&OP and IBP? Oliver Wight Americas (blog). https://www.oliverwight-americas.com/blog/difference-between-sop-and-ibp/
3. Material requirements planning (Rolls-Royce and GE in the early 1950s; Orlicky 1964; Black & Decker 1964 with Dick Alban; about 700 users by 1975 and about 8,000 by 1981; Oliver Wight's MRP II 1983). Wikipedia. https://en.wikipedia.org/wiki/Material_requirements_planning
4. Material requirements planning (MRP), definition and history (Harris 1913; Orlicky at IBM 1964; Plossl and Wight 1967; Orlicky's book 1975; Wight's MRP II 1983; Gartner coins ERP 1990; third edition by Ptak and Smith 2011 with DDMRP; re-checked in review round 3). TechTarget. https://www.techtarget.com/searcherp/definition/material-requirements-planning-MRP
5. What is sales and operations planning (S&OP)? (monthly cadence, rolling 18–36 month horizon; page within SAP's Integrated Business Planning section). SAP. https://www.sap.com/resources/sop-sales-and-operations-planning and https://www.sap.com/products/scm/integrated-business-planning/what-is-supply-chain-planning/sop-sales-operations.html
6. Sales and Operations Planning (S&OP): Process, Challenges, and Expert Tips (18–36 month horizon; level, chase and mixed strategies). Smartsheet. https://www.smartsheet.com/sales-operations-planning-101
7. Master Production Scheduling and Material Requirements Planning (definitions of MPS and MRP; ATP and cumulative ATP as outputs). Oracle JD Edwards EnterpriseOne Applications Requirements Planning Implementation Guide, release 9.2. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoarp/master-production-scheduling-and-material-requirements-planning.html
8. Gershwin, Stanley B.: Material Requirements Planning (MRP) and MRP II, lecture slides, MIT 2.854 Introduction to Manufacturing Systems, Fall 2016 (based on Hopp and Spearman, Factory Physics). MIT OpenCourseWare. https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf
9. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337 (via sibling pillar)
10. Blackburn, Joseph D.; Kropp, Dean H.; Millen, Robert A.: A Comparison of Strategies to Dampen Nervousness in MRP Systems. Management Science 32 (1986) 4, pp. 413–429. DOI: 10.1287/mnsc.32.4.413. Record: https://ideas.repec.org/a/inm/ormnsc/v32y1986i4p413-429.html
11. Demand Driven Material Requirements Planning (DDMRP) overview. Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-overview
12. Buffer profile and levels (DDMRP zone formulas, lead time and variability factor ranges, worked example). Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-buffer-profile-and-levels
13. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975. (via sibling pillar; original not consulted)
14. The five steps of DDMRP (net flow equation, buffer zones). IFS blog. https://blog.ifs.com/the-five-steps-of-ddmrp/ ; DDMRP in IFS Cloud documentation: https://docs.ifs.com/ifsclouddocs/24r2/Planning/AboutDDMRP.htm
15. The ultimate guide to the sales and operations planning (S&OP) process (six reviews; deployment guidance of 8–12 weeks). Anaplan (vendor), July 24, 2023. https://anaplan.com/blog/the-myths-of-sop
16. What is sales and operations planning (S&OP)? (traditional monthly cycle with five stages; concurrent planning, vendor claim). Kinaxis (vendor), published January 6, 2023, modified December 3, 2025. https://www.kinaxis.com/en/sop
17. Supply Chain S&OP: Process Improvement (five levels of S&OP maturity). Gartner. https://www.gartner.com/en/supply-chain/trends/supply-chain-sop
18. The 5 S&OP maturity levels (secondary description of the Gartner S&OP maturity model). Jedox (planning software vendor). https://jedox.com/en/blog/5-sop-maturity-levels
19. Grimson, J. Andrew; Pyke, David F.: Sales and operations planning: an exploratory study and framework. The International Journal of Logistics Management 18 (2007) 3, pp. 322–346. DOI: 10.1108/09574090710835093 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
20. Wagner, Stephan M.; Ullrich, Kristoph K. R.; Transchel, Sandra: The game plan for aligning the organization. Business Horizons 57 (2014) 2, pp. 189–201. DOI: 10.1016/j.bushor.2013.11.002 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
21. Oliva, Rogelio; Watson, Noel: Cross-functional alignment in supply chain planning: A case study of sales and operations planning. Journal of Operations Management 29 (2011) 5, pp. 434–448. DOI: 10.1016/j.jom.2010.11.012 (bibliographic data confirmed via Crossref, November 20, 2026; key finding via Wikipedia [1]; full text not consulted)
22. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning: A research synthesis. International Journal of Production Economics 138 (2012) 1, pp. 1–13. DOI: 10.1016/j.ijpe.2011.11.027 (DOI resolution to Elsevier record S0925527311004907 confirmed; bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
23. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning and the firm performance. International Journal of Productivity and Performance Management 61 (2012) 4, pp. 359–381. DOI: 10.1108/17410401211212643 (bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
24. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf (via sibling pillar)
25. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation, preview. https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (via sibling pillar)
26. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193 (via sibling pillar)
27. What is material requirements planning (MRP)? (MRP vs. ERP; FAQ topics incl. MRP II, MPS, DDMRP, predictive MRP, APS). SAP. https://www.sap.com/products/erp/what-is-mrp.html
28. Material requirements planning (MRP) in manufacturing: A complete guide (cites Oliver Wight/APICS Class A benchmarks without link). Zoho Inventory Academy. https://www.zoho.com/inventory/academy/inventory-management/what-is-materials-requirement-planning-mrp-in-manufacturing.html
29. Best S&OP Software in 2026: Sales & Operations Planning Buyer's Guide (vendor list; written by Board, one of the listed vendors). Board International. https://www.board.com/guide/best-sop-software
30. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours (via sibling pillar)
31. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview (via sibling pillar)
32. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric (via sibling pillar)
33. Overview of Sales and Operations Planning. Oracle Fusion Cloud SCM documentation. https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/23d/fasop/overview-of-sales-and-operations-planning.html (existence of the product confirmed from the documentation title in search results; page content not fetched)
34. Kristensen, Jesper; Jonsson, Patrik: Context-based sales and operations planning (S&OP) research: A literature review and future agenda. International Journal of Physical Distribution & Logistics Management 48 (2018) 1, pp. 19–46. DOI: 10.1108/IJPDLM-11-2017-0352. https://www.emerald.com/insight/content/doi/10.1108/IJPDLM-11-2017-0352/full/html
35. About the Demand Driven Institute (founded in 2011 by Carol Ptak and Chad Smith; software compliance certification free of charge to vendors; professional endorsement certificates). Demand Driven Institute. https://demanddriveninstitute.com/about-us (accessed November 20, 2026)
36. Measuring Forecast Accuracy: Approaches to Forecasting: A Tutorial (tracking signal rule of thumb: between −4 and 4). Supply Chain Resource Cooperative, NC State University, January 25, 2011. https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial (accessed November 20, 2026)
37. World Class Master Scheduling: Best Practices and Lean Six Sigma Continuous Improvement, section "Data accuracy" (inventory record accuracy 95% acceptable, 98% robust; BOM accuracy 98% minimum, 99+% good). Excerpt on GlobalSpec Engineering360. https://www.globalspec.com/reference/47612/203279/data-accuracy (accessed November 20, 2026; author and publisher not shown on the excerpt page)
