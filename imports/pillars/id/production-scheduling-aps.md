# SEO metadata

| Field | Value |
|---|---|
| Meta title | Perangkat Lunak Penjadwalan Produksi: Panduan APS (2026) |
| Meta description | Penjelasan perangkat lunak penjadwalan produksi dan APS: kapasitas terbatas, bottleneck, drum-buffer-rope, EOQ, safety stock, contoh kasus, dan daftar periksa. |
| Slug | `production-scheduling-aps` |

# Perangkat Lunak Penjadwalan Produksi dan APS: Panduan Lengkap untuk Jadwal yang Tetap Berjalan di Lantai Produksi

> **Jawaban singkat:** Perangkat lunak penjadwalan produksi dengan APS (advanced planning and scheduling) merencanakan order manufaktur terhadap kapasitas terbatas dan ketersediaan material secara bersamaan. Logika MRP klasik dalam sistem ERP mengasumsikan kapasitas tak terbatas dan lead time tetap. APS memodelkan mesin, tenaga kerja, perkakas, changeover, shift, dan bottleneck, sehingga urutan serta tanggal yang dihasilkannya adalah tanggal yang benar-benar dapat dicapai oleh pabrik Anda.

Hari Senin pagi di bagian production control. Proses MRP akhir pekan telah membuat 140 work order dengan tanggal mulai "minggu ini." Sel permesinan sudah memiliki hampir dua minggu pekerjaan, assembly menunggu part, dan bagian penjualan menginginkan tanggal pengiriman yang tidak bisa dijamin oleh siapa pun. Maka jadwal pun disusun ulang: di Excel, di papan tulis, dalam percakapan singkat di lorong dengan supervisor shift. Pada hari Rabu jadwal itu sudah usang lagi.

Jika situasi ini terasa familiar, penyebabnya jarang berupa kurangnya disiplin. Penyebabnya adalah logika perencanaan. Material requirements planning (MRP) dirancang untuk menjawab satu pertanyaan: *Material apa yang saya butuhkan, dan kapan?* Pertanyaan *Dapatkah pabrik saya benar-benar menjalankan pekerjaan ini dengan urutan tersebut?* hanya dijawab secara kasar, atau bahkan tidak dijawab sama sekali. Pertanyaan kedua inilah yang menjadi tugas penjadwalan terperinci dan APS.

Panduan ini membahas dasar-dasar production planning and control, kelemahan struktural MRP, fisika pabrik, cara kerja sistem APS, teori kendala (theory of constraints) dengan drum-buffer-rope, elemen dasar lean seperti heijunka dan line balancing, rumus klasik untuk lot size dan safety stock beserta contoh perhitungannya, serta cara memilih dan menerapkan perangkat lunak penjadwalan produksi dengan kemampuan APS. Untuk definisi singkat, lihat halaman entitas m365.fm [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/).

### Poin-poin utama

- **ERP merencanakan material, APS merencanakan kelayakan.** Logika MRP di dalam ERP, dalam bentuk dasarnya, mengasumsikan kapasitas tak terbatas dan planned lead time yang tetap. APS menjadwalkan terhadap kapasitas terbatas dan ketersediaan material secara bersamaan.
- **Lead time sebagian besar adalah waktu menunggu.** Hukum Little menyatakan cycle time = work in process ÷ throughput [9]. Kurangi WIP tanpa membuat bottleneck kekurangan pasokan, dan lead time akan turun.
- **Utilisasi tinggi memakan waktu.** Waktu antrean tumbuh mengikuti faktor u/(1−u), bukan secara linier. Pada utilisasi 95% waktu tunggu hampir lima kali lebih lama dibandingkan pada 80% [10][11].
- **Bottleneck menentukan laju produksi.** Theory of constraints (TOC) dan drum-buffer-rope (DBR) menyelaraskan pelepasan order dan sekuensing dengan kendala [1][2].
- **Rumus klasik adalah titik awal, bukan kebenaran mutlak.** Economic order quantity (EOQ) dan rumus safety stock bertumpu pada asumsi yang disederhanakan. Kurva biaya EOQ relatif datar, dan waktu setup biasanya merupakan pengungkit yang lebih besar.
- **APS hanya sebaik master data-nya.** Routing, waktu standar, matriks changeover, dan kalender kapasitas lebih menentukan kualitas jadwal dibandingkan algoritmanya.

### Mulai dari mana, berdasarkan peran

| Anda adalah … | Baca lebih dulu |
|---|---|
| Perencana produksi atau penjadwal yang terjebak dengan jadwal ERP yang tidak realistis | Bagian 3, 4 dan 5 (kelemahan MRP, fisika pabrik, cara kerja APS) |
| Bagian production control, manufacturing engineering, atau pimpinan lantai produksi | Bagian 7 dan 8 (bottleneck, DBR, takt, heijunka) |
| Bagian supply chain, perencanaan material, atau perencanaan persediaan | Bagian 9 dan 10 (lot size, safety stock) |
| Memimpin pemilihan atau implementasi APS | Bagian 13 sampai 16 (pemilihan, data, peta jalan, kesalahan umum) |
| Plant manager atau eksekutif operasi | Jawaban singkat, Bagian 11 (KPI) dan Bagian 21 (Kesimpulan) |

## Daftar isi

1. [Mengapa jadwal ERP gagal di lantai produksi](#1-mengapa-jadwal-erp-gagal-di-lantai-produksi)
2. [Dasar-dasar: apa yang dicakup perencanaan dan pengendalian produksi](#2-dasar-dasar-apa-yang-dicakup-oleh-production-planning-and-control)
3. [Kelemahan logika MRP klasik](#3-kelemahan-logika-mrp-klasik)
4. [Fisika pabrik: Hukum Little, kurva operasi dan variabilitas](#4-fisika-pabrik-hukum-little-kurva-operasi-dan-variabilitas)
5. [Apa itu sistem APS dan bagaimana cara kerjanya](#5-apa-itu-sistem-aps-dan-cara-perhitungannya)
6. [ERP vs. APS vs. MES](#6-erp-vs-aps-vs-mes)
7. [Teori kendala, drum-buffer-rope dan manajemen buffer](#7-teori-kendala-drum-buffer-rope-dan-manajemen-buffer)
8. [Elemen dasar Lean dalam penjadwalan: takt, heijunka, line balancing, pull](#8-blok-bangunan-lean-dalam-penjadwalan-takt-heijunka-line-balancing-pull)
9. [Penentuan ukuran lot: EOQ, contoh perhitungan dan batasannya](#9-penentuan-ukuran-lot-eoq-contoh-perhitungan-dan-batasannya)
10. [Stok pengaman: rumus dan contoh perhitungan](#10-safety-stock-rumus-dan-contoh-perhitungan)
11. [KPI perencanaan produksi](#11-kpi-perencanaan-produksi)
12. [Digital twin dan simulasi](#12-digital-twin-dan-simulasi)
13. [Cara memilih perangkat lunak penjadwalan produksi: kriteria dan daftar periksa](#13-cara-memilih-perangkat-lunak-penjadwalan-produksi-kriteria-dan-daftar-periksa)
14. [Kebutuhan data dan kualitas data master](#14-persyaratan-data-dan-kualitas-data-induk)
15. [Peta jalan implementasi APS](#15-roadmap-implementasi-aps)
16. [Kesalahan umum dan cara menghindarinya](#16-kesalahan-umum-dan-cara-menghindarinya)
17. [Bukti: apa yang dilaporkan studi dan pengguna](#17-bukti-apa-yang-dilaporkan-studi-dan-pengguna)
18. [Perencanaan berbasis kendala dengan iFAKT Polaris](#18-perencanaan-berbasis-kendala-dengan-ifakt-polaris)
19. [Glosarium](#19-glosarium)
20. [FAQ: perangkat lunak penjadwalan produksi dan APS](#20-faq-perangkat-lunak-penjadwalan-produksi-dan-aps)
21. [Kesimpulan](#21-kesimpulan)

## 1. Mengapa jadwal ERP gagal di lantai produksi

Sebagian besar produsen merencanakan produksi di sistem ERP mereka, dan ada alasannya: di sanalah pesanan pelanggan, bill of material, routing dan persediaan disimpan. Sistem [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) adalah sistem pencatatan utama untuk kuantitas, nilai, dan tanggal. Namun, logika perencanaan di dalam sebagian besar sistem ERP dibangun di atas metode yang dikembangkan pada tahun 1960-an dan 1970-an dan didokumentasikan oleh Joseph Orlicky dalam buku standarnya tahun 1975: material requirements planning [24].

Perencana mengenali gejalanya begitu logika ini mencapai batasnya:

- **Pusat kerja kelebihan beban di atas kertas:** ERP menjadwalkan pesanan ke dalam satu minggu ketika kapasitas pusat kerja tersebut sudah habis.
- **Tanggal pengiriman berdasarkan perkiraan:** Tanggal janji didasarkan pada lead time standar, bukan pada beban yang berjalan saat ini.
- **Penjadwalan bayangan di Excel:** Jadwal detail yang sebenarnya berada di luar ERP, dalam spreadsheet, di papan tulis, atau di kepala supervisor berpengalaman.
- **Pekerjaan mendesak mendorong yang lain keluar:** Setiap percepatan menciptakan pesanan terlambat baru di tempat lain.
- **Persediaan tinggi namun tetap terjadi kekurangan:** Ada banyak material di lantai produksi, hanya saja bukan yang dibutuhkan perakitan saat ini.
- **Perencana sebagai pemadam kebakaran:** Sebagian besar minggu kerja habis untuk penjadwalan ulang, bukan perencanaan.

Seberapa umum masalah ini tampak dalam survei yang dilakukan IDC untuk vendor perangkat lunak perencanaan Kinaxis. IDC mensurvei lebih dari 1.800 pemimpin rantai pasok di sembilan negara, termasuk AS dan Kanada, pada Desember 2023; 83% menyatakan organisasi mereka tidak dapat merespons gangguan rantai pasok dalam 24 jam [32]. Untuk 200 responden Jerman, jurnal perdagangan Jerman Logistik Heute melaporkan bahwa 37% mengandalkan Excel saja atau Excel yang dikombinasikan dengan alat mandiri untuk perencanaan rantai pasok, dan 89% tidak dapat merespons gangguan dalam 24 jam [25]. Studi ini disponsori vendor dan mencakup perencanaan rantai pasok secara umum, bukan penjadwalan lantai produksi secara khusus, dan rilis yang dipublikasikan tidak memberikan angka spreadsheet khusus AS. Meski begitu, studi ini tetap menunjukkan skala masalahnya.

Kabar baiknya: penyebab masalahnya sudah dipahami dengan baik. Penyebabnya berada di tiga area yang dibahas panduan ini secara bergantian: logika perencanaan (Bagian 3), fisika antrean dan persediaan (Bagian 4), dan kurangnya fokus pada bottleneck (Bagian 7). Versi singkat dari argumen pertama dapat dibaca di posting m365.fm [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/).

## 2. Dasar-dasar: apa yang dicakup oleh production planning and control

### 2.1 Definisi

**Production planning and control (PPC)** mencakup setiap tugas yang digunakan perusahaan untuk memutuskan *apa*, *berapa banyak*, *kapan* dan *di mana* memproduksi, serta untuk memicu dan memantau pelaksanaannya. Perencanaan menghasilkan target; kontrol menjalankan target tersebut di lantai produksi dan merespons penyimpangan. Dalam praktik AS, cakupan yang sama sering disebut manufacturing planning and control (MPC). Badan profesional yang memelihara body of knowledge ini adalah ASCM, Association for Supply Chain Management, melalui sertifikasi APICS CPIM, yang modulnya mencakup sales and operations planning, internal supply, inventory, dan detailed schedules [33].

Dua istilah sering membingungkan: **planning** dan **scheduling**. Planning (rough-cut atau aggregate planning) bekerja dengan kuantitas agregat, periode mingguan atau bulanan, dan kelompok work center. **Detailed scheduling** memutuskan untuk setiap operasi individual resource mana yang dipakai, dalam urutan apa dan pada waktu kapan. Ia bekerja dalam satuan hari, shift, atau menit, dan merupakan inti dari apa yang dilakukan sistem APS. Praktik Jerman menggunakan pasangan *Grobplanung* dan *Feinplanung* untuk pembedaan yang sama; istilah "Feinplanung" akan Anda temui dalam literatur vendor berbahasa Jerman.

### 2.2 Ringkasan level perencanaan

Literatur menyusun perencanaan secara hierarkis, dari rencana penjualan dan kapasitas jangka panjang hingga urutan pada satu mesin [7][12]. Tabel berikut merangkum levelnya. Horizon waktu adalah perkiraan umum dan bervariasi menurut industri dan jenis produksi.

| Level | Horizon tipikal | Pertanyaan utama | Keluaran | Sistem tipikal |
|---|---|---|---|---|
| Sales and operations planning (S&OP) | 12 hingga 24 bulan | Apa yang akan kami jual, dan kapasitas apa yang kami butuhkan? | Rencana penjualan dan kapasitas per famili produk | ERP, alat perencanaan, Excel |
| Master production schedule (MPS) | minggu hingga bulan | Produk akhir mana yang kami buat, kapan dan berapa banyak? | Permintaan independen, program produksi | ERP |
| Material requirements planning (MRP) | minggu | Rakitan, komponen dan bahan baku apa yang kami butuhkan, dan kapan? | Permintaan dependen, planned orders, permintaan pembelian | ERP |
| Capacity requirements planning (CRP) | hari hingga minggu | Kapan operasi dijalankan, dan apakah kapasitasnya cukup? | Tanggal milestone, beban kapasitas | ERP (kasar), APS (presisi) |
| Detailed scheduling | jam hingga hari, bergulir hingga beberapa minggu | Operasi mana berjalan di resource mana, dalam urutan apa? | Jadwal resource, urutan (diagram Gantt) | APS, modul penjadwalan MES, papan penjadwalan |
| Production activity control / dispatching | shift hingga menit | Order mana yang dirilis, apa yang terjadi saat ada gangguan? | Rilis, konfirmasi, pemicu penjadwalan ulang | MES, APS, lantai produksi |

Hermann Lödding, peneliti pengendalian produksi asal Jerman, membagi pengendalian produksi menjadi empat tugas: pembangkitan order, pelepasan order, pengendalian kapasitas, dan penentuan urutan [12]. Pembagian ini berguna karena menunjukkan bahwa jadwal yang baik saja tidak cukup. Keputusan *kapan* sebuah order masuk ke lantai produksi sering kali lebih memengaruhi WIP dan lead time daripada urutan pada mesin mana pun.

### 2.3 Model acuan: ISA-95, ASCM, dan model PPC Aachen

Produsen AS biasanya berorientasi pada dua kerangka kerja. Hierarki perencanaan ASCM/APICS yang ditunjukkan pada tabel di atas (S&OP, MPS, MRP, CRP, detailed scheduling, eksekusi) adalah bahasa umum para perencana dan profesional supply chain [33]. ANSI/ISA-95 (dipublikasikan secara internasional sebagai IEC 62264) menarik garis pemisah antara perencanaan bisnis dan logistik (Level 4, biasanya ERP) dan manufacturing operations management (Level 3, biasanya MES dan penjadwalan). Bagian 3, ANSI/ISA-95.00.03-2013, menjelaskan model aktivitas manufacturing operations management dan mendefinisikan finite capacity scheduling sebagai metode di mana pekerjaan dijadwalkan untuk sekumpulan resource produksi sedemikian rupa sehingga tidak ada kapasitas terjadwal yang melebihi kapasitas yang tersedia [31].

Di negara-negara berbahasa Jerman, model referensi yang dominan adalah **model PPC Aachen** (*Aachener PPS-Modell*) dari institut FIR di Universitas RWTH Aachen. Model ini dijelaskan dalam beberapa edisi buku standar berbahasa Jerman *Produktionsplanung und -steuerung*; edisi keempat disunting oleh Günther Schuh dan Volker Stich pada 2012 [7]. Model ini mengelompokkan tugas perencanaan dan pengendalian ke dalam tiga kategori:

- **Tugas jaringan:** desain strategis jaringan produksi, seperti keputusan lokasi dan pemasok.
- **Tugas inti:** tugas yang menggerakkan pesanan, yaitu perencanaan program produksi, perencanaan kebutuhan produksi, perencanaan dan pengendalian produksi internal, serta perencanaan dan pengendalian pengadaan eksternal.
- **Tugas lintas fungsi:** manajemen pesanan, manajemen persediaan dan pengendalian, yang mengintegrasikan dan mengoptimalkan lintas fungsi.

Nilai dari ketiga kerangka ini terletak pada pemisahan tugas yang jelas. Kerangka ini membantu menjawab sistem mana yang seharusnya memegang tugas mana: ERP biasanya mencakup perencanaan program dan kebutuhan, APS mencakup penjadwalan produksi internal yang rinci, dan MES mencakup eksekusi dan konfirmasi.

### 2.4 Dari MRP ke MRP II ke APS

Sejarah sistem perencanaan menjelaskan banyak masalah masa kini:

1. **Titik pemesanan ulang dan rumus ukuran lot (sejak 1913):** Ford Whitman Harris mempublikasikan rumus ukuran lot ekonomis pada 1913 [17]. Di negara-negara berbahasa Jerman, rumus ini dikenal melalui Kurt Andler (1929) dan masih disebut *rumus Andler* di sana [18].
2. **MRP (1960-an dan 1970-an):** Komputer memungkinkan kebutuhan dipecah melalui daftar bahan dan digeser waktunya berdasarkan lead time yang direncanakan. Orlicky menjelaskan metode ini secara komprehensif pada 1975 [24].
3. **MRP II (awal 1980-an):** Manufacturing resource planning menambahkan master scheduling, rough-cut capacity planning, capacity requirements planning (CRP) dan keterkaitan dengan perencanaan keuangan. Namun, pemeriksaan kapasitas tetap merupakan langkah lanjutan: jadwalkan dulu, lalu tampilkan beban [10].
4. **ERP (1990-an):** Sistem ERP mengintegrasikan keuangan, penjualan, pembelian dan SDM. Inti perencanaannya sering tetap berupa MRP II.
5. **APS (sejak 1990-an):** Advanced planning systems menyerang pemeriksaan kapasitas yang dilakukan belakangan dengan merencanakan material dan kapasitas secara bersamaan menggunakan metode optimasi. Sistem ini tidak menggantikan ERP; sistem ini menambahkan perencanaan yang memperhitungkan kapasitas terbatas [13].

## 3. Kelemahan logika MRP klasik

Logika MRP tidak keliru. Untuk menentukan material apa yang dibutuhkan dan dalam jumlah berapa, MRP tidak tergantikan. Masalah muncul ketika keluarannya langsung digunakan sebagai jadwal produksi tanpa pemeriksaan. Wallace Hopp dan Mark Spearman mengkritik dalam *Factory Physics* bahwa model MRP dasar mengasumsikan lead time tetap yang tidak bergantung pada beban. Namun, lead time tetap hanya mungkin jika kapasitas tidak terbatas [10].

### 3.1 Kapasitas tak terbatas

MRP menjadwalkan setiap pesanan terencana dengan memundurkan planned lead time dari tanggal jatuh tempo. MRP tidak memeriksa apakah work center kosong pada waktu tersebut. Hal ini disebut **perencanaan kapasitas tak terbatas (infinite capacity planning)**. Capacity requirements planning (CRP) yang dijalankan kemudian menampilkan kelebihan beban, tetapi tidak menyelesaikannya. Penyelesaiannya diserahkan kepada perencana.

**Contoh kerja: kelebihan beban yang tidak terlihat oleh MRP**

Sebuah machining center beroperasi dua shift, lima hari per minggu, 8 jam per shift: 80 jam kapasitas per minggu. Proses MRP menghasilkan beban berikut:

| Minggu | Kapasitas (jam) | Beban MRP (jam) | Selisih (jam) | Beban |
|---|---|---|---|---|
| Minggu 12 | 80 | 112 | −32 | 140% |
| Minggu 13 | 80 | 54 | +26 | 68% |
| Minggu 14 | 80 | 96 | −16 | 120% |
| **Total** | **240** | **262** | **−22** | **109%** |

Bahkan jika perencana meratakan beban dengan sempurna dan memindahkan pekerjaan dari minggu 12 ke minggu 13, tetap tersisa 22 jam yang tidak dapat diselesaikan dalam tiga minggu tersebut. Lembur, outsourcing, atau mesin alternatif harus direncanakan, atau setidaknya satu pesanan selesai terlambat. Namun, ERP tetap menampilkan setiap pesanan dengan tanggal aslinya, dan tim penjualan menjanjikan tanggal pengiriman berdasarkan data tersebut. APS akan menjadwalkan pesanan terhadap 80 jam per minggu dan melaporkan tanggal penyelesaian paling awal yang realistis.

### 3.2 Planned lead time tetap

Asumsi kedua adalah **planned lead time tetap** per item atau routing, misalnya "pembubutan: 5 hari kerja." Dalam kenyataannya, lead time sangat bergantung pada beban saat ini, seperti ditunjukkan pada Bagian 4. Ketika lantai produksi kosong, sebuah pesanan dapat diselesaikan dalam dua hari. Ketika penuh, butuh dua minggu. Nilai tetap hampir selalu terlalu panjang (akibatnya: persediaan tinggi, rilis terlalu awal) atau terlalu pendek (akibatnya: pesanan terlambat).

Planned lead time juga biasanya mengandung porsi besar waktu pemindahan dan antrean. Peter Nyhuis dan Hans-Peter Wiendahl dari Leibniz University Hannover membedakan antara waktu operasi (setup dan pemrosesan) dan waktu antar-operasi (menunggu sebelum dan sesudah pemrosesan, ditambah transportasi) [8]. Pada job shop, waktu antar-operasi biasanya merupakan bagian yang lebih besar. Memasukkan waktu tunggu tersebut ke dalam master data sebagai konstanta tetap berarti menguncinya.

### 3.3 Lead time syndrome

Apa yang terjadi ketika perencana merespons pesanan terlambat dengan menaikkan planned lead time? Efeknya telah dikenal selama puluhan tahun sebagai **lead time syndrome** dan terutama dibahas dalam konteks MRP [23]:

1. Pesanan selesai terlambat.
2. Perencana menaikkan planned lead time agar aman.
3. Akibatnya, pesanan dirilis lebih awal.
4. Lebih banyak pesanan berada di lantai produksi pada waktu yang sama; WIP meningkat.
5. Menurut Little's Law, dengan throughput yang konstan, lead time aktual meningkat.
6. Pesanan kembali terlambat, dan siklusnya dimulai lagi.

Pada 2023, Matthias Thürer, Nuno Fernandes, Stefan Haeussler, dan Mark Stevenson menggunakan simulasi untuk menguji apakah planned lead time yang disesuaikan secara dinamis merugikan job shop make-to-order. Jawaban mereka: ya, tetapi tidak dengan cara yang biasa diperkirakan. Kerugian terutama berasal dari pemendekan planned lead time pada periode beban rendah, yang kemudian meningkatkan beban pada periode beban tinggi berikutnya [23]. Dalam praktik: menyesuaikan planned lead time tanpa mengendalikan rilis pesanan hanya memindahkan masalah.

Solusi yang tepat adalah rilis pesanan berbasis beban atau berbasis bottleneck (Bagian 7 dan 8) serta penjadwalan finite capacity yang menurunkan lead time dari jadwal aktual alih-alih menetapkannya terlebih dahulu.

### 3.4 Perencanaan berurutan

Kelemahan ketiga adalah **perencanaan berurutan (sequential planning)**: pertama program, lalu material, lalu tanggal, lalu kapasitas. Setiap langkah menganggap hasil langkah sebelumnya sebagai tetap. Umpan balik seperti "mesin ini penuh, jadi saya pindahkan kebutuhan dan dengan itu juga pesanan pembelian" tidak termasuk dalam desainnya. Hasilnya adalah rencana yang konsisten di setiap langkah tetapi tidak layak secara keseluruhan.

| Asumsi MRP | Kenyataan di lantai produksi | Konsekuensi |
|---|---|---|
| Kapasitas tidak terbatas | Kapasitas terbatas di setiap pusat kerja | minggu kelebihan beban, tanggal yang tidak realistis |
| Lead time tetap | Lead time bergantung pada beban | pesanan dilepas terlalu awal atau terlambat |
| Ukuran lot tidak bergantung pada urutan | Waktu setup bergantung pada varian sebelumnya | kapasitas hilang di bottleneck |
| Langkah-langkah perencanaan berjalan satu per satu | Material, kapasitas dan tanggal saling memengaruhi | rencana yang hanya berhasil di atas kertas |
| Permintaan dan persediaan diketahui dengan pasti | Peramalan bervariasi, catatan persediaan mengandung kesalahan | kegelisahan, kekurangan, penambahan stok pengaman |

## 4. Fisika pabrik: Hukum Little, kurva operasi dan variabilitas

Untuk memahami mengapa jadwal gagal, Anda perlu tiga hubungan yang berlaku terlepas dari industri atau perangkat lunak apa pun. Hopp dan Spearman merangkumnya dengan nama *Factory Physics* [10].

### 4.1 Hukum Little: WIP, throughput dan cycle time

Pada tahun 1961, John D. C. Little membuktikan hubungan yang berlaku untuk setiap sistem stabil dengan kedatangan dan keberangkatan [9]. Dalam istilah produksi:

> **Cycle time (CT) = work in process (WIP) ÷ throughput (TH)**

Rumus ini berlaku untuk rata-rata jangka panjang, terlepas dari distribusi waktu proses atau aturan pengurutan. Catatan istilah: dalam Hukum Little, "cycle time" berarti waktu yang dihabiskan sebuah pesanan dalam sistem (waktu alirnya atau manufacturing lead time), bukan station cycle time yang dibandingkan dengan takt time di Bagian 8.

**Contoh perhitungan:** Sebuah bengkel suku cadang rata-rata menyelesaikan 40 pesanan kerja per hari kerja. Rata-rata, 600 pesanan yang sudah dilepas tetapi belum selesai berada di lantai produksi.

- CT = 600 ÷ 40 = **15 hari kerja**

Jika pelepasan pesanan yang terkendali menurunkan WIP menjadi 320 pesanan sementara bottleneck tetap terisi penuh dan throughput tetap 40 pesanan per hari:

- CT = 320 ÷ 40 = **8 hari kerja**

Lead time hampir berkurang separuh tanpa satu mesin pun berjalan lebih cepat. Itulah sebabnya pengendalian WIP dan pelepasan pesanan termasuk tuas yang paling efektif dan paling murah dalam perencanaan produksi. Untuk informasi lebih lanjut tentang metrik ini, lihat halaman entitas [Lead Time](https://www.m365.fm/entity/lead-time/).

**Catatan penting:** Hukum Little tidak menyatakan bahwa setiap pengurangan WIP selalu menurunkan lead time tanpa efek samping. Jika WIP di depan bottleneck turun sedemikian rupa hingga bottleneck kehabisan bahan, throughput juga ikut turun. Kurva operasi menggambarkan hubungan tepat seperti itu.

### 4.2 Kurva operasi dan model corong

Para peneliti di Institute of Production Systems and Logistics (IFA) di Leibniz University Hannover mengembangkan **model corong**: sebuah pusat kerja diperlakukan sebagai corong tempat pesanan masuk dan keluar setelah diproses. **Diagram throughput** yang diturunkan menunjukkan WIP, output dan lead time dari waktu ke waktu [8]. Berdasarkan itu, Nyhuis dan Wiendahl merumuskan **kurva operasi logistik**, yang menunjukkan bagaimana output dan lead time suatu sistem kerja bergantung pada WIP [8]:

- Pada **WIP rendah**, output naik hampir linier seiring setiap pesanan yang ditambahkan, dan lead time tetap dekat dengan waktu operasi murni. Namun pusat kerja berisiko kekurangan bahan.
- Mulai dari **WIP menengah**, output mendekati maksimumnya. Penambahan WIP hampir tidak menambah output.
- Pada **WIP tinggi**, output tetap datar sementara lead time terus bertambah sebanding dengan WIP. WIP tambahan murni menjadi waktu tunggu.

Itu menghasilkan aturan perencanaan inti: setiap pusat kerja memiliki rentang WIP tempat output terjamin dan lead time masih pendek. Penjadwalan dan pelepasan harus berupaya menjaga lantai produksi tetap berada dalam rentang tersebut. Hopp dan Spearman menjelaskan konsep terkait, **critical WIP**: tingkat WIP saat sebuah lini ideal baru mencapai throughput maksimum pada cycle time minimum [10]. Nyhuis dan Wiendahl secara eksplisit menyatukan kedua pendekatan ini dan menghubungkan teori kurva operasi dengan Hukum Little [8].

### 4.3 Variabilitas dan utilisasi: mengapa 95% bisa terlalu tinggi

Hukum ketiga menyangkut waktu tunggu di depan sebuah sumber daya. John Kingman mempublikasikan pendekatan untuk antrean di bawah beban berat pada tahun 1961 [11]. Hopp dan Spearman menggunakannya dalam *Factory Physics* sebagai **persamaan VUT** (variability × utilization × time) [10]:

> **Rata-rata waktu antre di sumber daya ≈ V × U × T**
>
> V = (c_a² + c_e²) ÷ 2 (variabilitas kedatangan dan waktu proses)
> U = u ÷ (1 − u) (faktor utilisasi, u = utilisasi antara 0 dan 1)
> T = t_e (rata-rata waktu proses efektif)

c_a dan c_e adalah koefisien variasi (simpangan baku dibagi rata-rata) dari waktu antar-kedatangan dan waktu proses. Pendekatan ini berlaku untuk satu sumber daya dan paling akurat pada tingkat utilisasi tinggi.

**Contoh perhitungan:** Sebuah mesin memiliki rata-rata waktu proses efektif 1 jam per pesanan. Kedatangan dan waktu proses bervariasi secara sedang; kedua koefisien variasi bernilai 1, sehingga V = (1 + 1) ÷ 2 = 1.

| Utilisasi u | U = u ÷ (1 − u) | Rata-rata waktu antrean (jam) | Waktu di mesin termasuk proses (jam) |
|---|---|---|---|
| 80% | 4,0 | 4,0 | 5,0 |
| 85% | 5,7 | 5,7 | 6,7 |
| 90% | 9,0 | 9,0 | 10,0 |
| 95% | 19,0 | 19,0 | 20,0 |

Naik dari utilisasi 80% ke 95% menambah beban 15 poin persentase, tetapi waktu antrean hampir naik lima kali lipat. Ada tiga pelajaran untuk perencanaan:

1. **Utilisasi penuh di semua tempat bukan tujuan yang masuk akal.** Jika setiap pusat kerja dijadwalkan pada 95%, hasilnya adalah lead time yang panjang dan sangat bervariasi.
2. **Mengurangi variabilitas bekerja seperti menambah kapasitas.** Jika V dipangkas separuh, misalnya melalui setup yang lebih stabil, lot yang lebih kecil dan lebih merata, atau pelepasan order yang dihaluskan, waktu antrean berkurang separuh pada utilisasi yang sama.
3. **Utilisasi tinggi diinginkan di bottleneck, tetapi hanya dengan buffer.** Bottleneck tidak boleh kekurangan pasokan. Hal itu hanya berhasil jika buffer yang dirancang dengan sengaja ditempatkan di depan bottleneck dan sumber daya lain memiliki kapasitas cadangan (Bagian 7).

## 5. Apa itu sistem APS dan cara perhitungannya

### 5.1 Definisi

**Advanced planning and scheduling (APS)** mengacu pada sistem perangkat lunak dan metode yang merencanakan dan menjadwalkan pesanan produksi dengan mempertimbangkan ketersediaan material dan kapasitas terbatas (finite capacity) secara bersamaan. Literatur rantai pasok menggunakan definisi yang lebih luas: Bernhard Fleischmann, Herbert Meyr dan Michael Wagner menempatkan perencanaan lanjutan dalam sebuah matriks perencanaan yang membentang dari desain jaringan jangka panjang hingga penjadwalan jangka pendek di seluruh pengadaan, produksi, distribusi dan penjualan [13]. Di lantai produksi, "APS" biasanya berarti bagian yang bertanggung jawab atas penjadwalan rinci dan sekuensing dalam produksi. Banyak produk yang tercantum di bawah "production scheduling software" dalam direktori perangkat lunak AS mencakup lapisan ini, baik sebagai produk tersendiri maupun sebagai modul ERP atau MES; yang lain dalam daftar yang sama adalah perencana proyek atau sumber daya (Bagian 13.1).

Kata **"advanced"** mengacu pada tiga perbedaan dari logika MRP klasik:

- **Penjadwalan kapasitas terbatas (finite capacity scheduling):** Setiap sumber daya memiliki kapasitas terbatas yang bergantung pada kalender. Suatu operasi hanya dijadwalkan di tempat sumber daya tersebut tersedia. ISA-95 mendefinisikan penjadwalan kapasitas terbatas persis dengan cara ini: tidak ada kapasitas yang dijadwalkan boleh melebihi kapasitas yang tersedia [31].
- **Perencanaan simultan:** Material, kapasitas dan tanggal dipertimbangkan bersamaan. Jika material belum tersedia, operasi bergeser; jika mesin sedang sibuk, kebutuhan material ikut bergeser.
- **Optimisasi:** Alih-alih menghitung satu jawaban, sistem mencari di antara banyak solusi yang layak untuk menemukan solusi yang baik, idealnya yang terbaik menurut tujuan yang ditetapkan.

### 5.2 Penjadwalan berbasis kendala: apa yang dimodelkan APS

APS tidak menjadwalkan terhadap "kapasitas" sebagai satu angka tunggal, melainkan terhadap jaringan kendala. Ini disebut **[penjadwalan berbasis kendala](https://www.m365.fm/entity/constraint-based-scheduling/)**. Kendala tipikal:

| Batasan | Contoh | Mengapa penting |
|---|---|---|
| Kapasitas sumber daya | Mesin A: 2 shift, Senin sampai Jumat | fondasi setiap jadwal detail |
| Sumber daya alternatif | Part dapat dijalankan di mesin A atau B, 20% lebih lambat di B | jalan keluar saat sumber daya kelebihan beban |
| Tenaga kerja dan keterampilan | Hanya tiga operator yang tersertifikasi di test stand | tenaga kerja sering kali menjadi bottleneck yang sebenarnya |
| Alat dan fixture | Hanya satu cetakan injeksi per varian | dua mesin tidak dapat menjalankan varian yang sama pada waktu yang sama |
| Setup yang bergantung pada urutan | Dari warna terang ke gelap: 10 mnt; dari gelap ke terang: 45 mnt | urutan menentukan kapasitas yang tersedia |
| Urutan operasi dan tumpang tindih | Assembly baru dimulai setelah pengecatan; transfer dalam lot parsial diperbolehkan | lead time dan sinkronisasi |
| Waktu tunggu minimum dan maksimum | Adhesive harus mengeras selama 24 jam; part boleh menunggu paling lama 4 jam antara pencucian dan coating | waktu minimum dan maksimum teknologi |
| Material dan part pembelian | Komponen elektronik tiba hari Kamis | keterbatasan material menentukan waktu mulai paling awal |
| Zona dan area lantai | Hanya dua seksi fuselage yang muat di zona assembly sekaligus | lazim pada assembly peralatan besar dan aerospace |
| Kampanye dan batch | Furnace hanya dijalankan dengan batch penuh pada suhu yang sama | pengelompokan versus tanggal jatuh tempo |

Semakin banyak batasan ini berlaku, semakin tidak andal jadwal dapat dibuat secara manual atau di Excel, dan semakin besar manfaat APS.

### 5.3 Seberapa besar masalahnya: ledakan kombinatorial

Bahkan pada satu mesin, jumlah kemungkinan urutan bertambah secara faktorial terhadap jumlah order:

- 4 order: 4! = 24 urutan
- 10 order: 10! = 3.628.800 urutan
- 15 order: 15! = 1.307.674.368.000 urutan, atau sekitar 1,3 triliun

Di job shop nyata dengan puluhan mesin, ratusan order, dan routing multi-langkah, mencoba setiap opsi tidak mungkin dilakukan. Pada 1976, Michael Garey, David Johnson, dan Ravi Sethi menunjukkan bahwa meminimalkan makespan bersifat NP-complete pada flow shop dengan tiga mesin atau lebih dan pada job shop dengan dua mesin atau lebih [14]. Untuk masalah semacam ini, tidak diketahui metode yang dijamin dapat menemukan optimum untuk instans berukuran besar dalam waktu yang wajar. Itulah sebabnya sistem APS menggabungkan aturan, heuristik, dan optimisasi.

### 5.4 Metode: dari aturan dispatching hingga optimisasi matematis

**Aturan dispatching** (aturan prioritas) memutuskan order yang menunggu mana yang dijalankan berikutnya. Aturan ini sederhana, cepat, dan transparan:

| Aturan | Logika | Kekuatan | Kelemahan |
|---|---|---|---|
| FIFO (first in, first out) | siapa datang duluan, dilayani duluan | adil, sederhana, varians rendah | mengabaikan tanggal jatuh tempo |
| EDD (earliest due date) | tanggal jatuh tempo terdekat didahulukan | pada satu mesin, meminimalkan keterlambatan maksimum | mengabaikan waktu proses |
| SPT (shortest processing time) | operasi terpendek didahulukan | pada satu mesin, meminimalkan rata-rata flow time | order panjang bisa tertunda terus-menerus |
| CR (critical ratio) | waktu tersisa hingga jatuh tempo ÷ pekerjaan yang tersisa | mempertimbangkan jatuh tempo dan pekerjaan yang tersisa | tidak stabil jika penjadwalan ulang sering dilakukan |
| Slack | waktu hingga jatuh tempo dikurangi waktu proses yang tersisa, nilai terkecil didahulukan | baik untuk order multi-langkah | membutuhkan perkiraan waktu sisa yang andal |
| Dioptimalkan setup | mengelompokkan job dari famili setup yang sama | menghemat waktu setup di bottleneck | dapat melanggar tanggal jatuh tempo |

Bahwa EDD meminimalkan keterlambatan maksimum dan SPT meminimalkan rata-rata flow time pada satu mesin merupakan hasil klasik dari teori penjadwalan [29].

**Contoh kerja: tiga aturan, empat order, satu mesin**

Empat order menunggu di sebuah mesin pada waktu 0, sesuai urutan kedatangan A, B, C, D. Waktu dalam jam:

| Order | Waktu proses | Jatuh tempo |
|---|---|---|
| A | 4 | 6 |
| B | 2 | 4 |
| C | 6 | 14 |
| D | 3 | 9 |

| Aturan | Urutan | Waktu selesai | Keterlambatan | Order terlambat | Total keterlambatan | Rata-rata flow time |
|---|---|---|---|---|---|---|
| FIFO | A, B, C, D | A 4, B 6, C 12, D 15 | B 2, D 6 | 2 | 8 jam | (4+6+12+15)÷4 = 9,25 jam |
| SPT | B, D, A, C | B 2, D 5, A 9, C 15 | A 3, C 1 | 2 | 4 jam | (2+5+9+15)÷4 = 7,75 jam |
| EDD | B, A, D, C | B 2, A 6, D 9, C 15 | C 1 | 1 | 1 jam | (2+6+9+15)÷4 = 8,00 jam |

Mesin yang sama, pekerjaan yang sama, kapasitas yang sama: urutan saja yang menentukan apakah satu atau dua order terlambat dan apakah total keterlambatan 1 atau 8 jam. SPT memberikan rata-rata flow time terpendek, EDD memberikan kinerja tanggal jatuh tempo terbaik. Aturan mana yang "tepat" bergantung pada tujuannya. Pada shop multi-langkah dengan setup yang bergantung pada urutan, tidak ada satu aturan tunggal yang cukup, dan di situlah APS mulai memberikan manfaat.

**Heuristik** dengan cepat menghasilkan solusi yang baik tetapi tidak dijamin optimal. Termasuk di dalamnya metode konstruksi yang membangun jadwal pesanan demi pesanan (misalnya bottleneck-first: muat bottleneck terlebih dahulu, lalu selaraskan sumber daya lain terhadapnya) dan metode perbaikan yang mengubah jadwal yang sudah ada langkah demi langkah.

**Metaheuristik** seperti algoritma genetika, simulated annealing, atau tabu search menjelajahi ruang solusi secara sistematis dan dapat keluar dari optimum lokal. Metode ini umum digunakan dalam sistem APS komersial untuk optimasi urutan.

**Optimasi matematis** merumuskan masalah penjadwalan sebagai model dengan fungsi objektif dan kendala, misalnya sebagai mixed-integer linear program (MILP) atau model constraint programming (CP). Solver menemukan solusi optimal untuk masalah berukuran kecil dan menengah, atau setidaknya memberikan batas seberapa jauh solusi yang ditemukan dapat menyimpang dari optimum. Masalah penjadwalan rinci berskala besar sering didekomposisi, misalnya berdasarkan jendela waktu atau kelompok sumber daya.

**Kecerdasan buatan** berperan dalam beberapa fungsi pada sistem APS: memprediksi waktu proses dan waktu setup dari data aktual, memprediksi gangguan, mempelajari kebijakan penjadwalan (misalnya dengan reinforcement learning), dan interaksi dalam bahasa alami. Vendor yang kredibel menggunakannya untuk memperbaiki input dan mempercepat pencarian, bukan untuk menggantikan optimasi. Penjadwalan berbasis AI hanya sebaik data konfirmasi dari lantai produksi yang dipelajarinya.

### 5.5 Tujuan dan trade-off

APS tidak pernah mengoptimalkan "jadwal" secara umum; ia mengoptimalkan kombinasi tertimbang dari beberapa tujuan. Tujuan yang umum:

- pengiriman tepat waktu (meminimalkan keterlambatan atau keterlambatan tertimbang)
- lead time yang singkat dan WIP yang rendah
- utilisasi bottleneck yang tinggi
- waktu setup yang rendah
- lembur yang sedikit dan beban kerja orang yang merata
- stabilitas jadwal (sedikit perubahan dibandingkan jadwal sebelumnya)

Tujuan-tujuan ini saling bertentangan. Literatur bisnis Jerman menyebut inti konflik ini sebagai "dilema penjadwalan" (*Dilemma der Ablaufplanung*): utilisasi tinggi membutuhkan antrean, sedangkan lead time pendek membutuhkan kapasitas menganggur. Bagian 4.3 menunjukkan mengapa secara matematis hal itu demikian. Oleh karena itu, salah satu tugas terpenting dalam implementasi APS adalah menyepakati pembobotan tujuan dengan penjualan, produksi, dan logistik.

### 5.6 Arah penjadwalan, ATP, dan CTP

Pertanyaan "apa saja jenis penjadwalan produksi?" biasanya bermuara pada dua pasangan: kapasitas terbatas versus kapasitas tak terbatas (Bagian 3.1) dan arah penjadwalan:

- **Forward scheduling:** Operasi dijadwalkan mulai dari waktu mulai paling awal yang mungkin. Hasilnya adalah tanggal selesai paling awal yang mungkin.
- **Backward scheduling:** Operasi dijadwalkan mundur dari tanggal jatuh tempo. Hasilnya adalah waktu mulai paling lambat yang mungkin, yang menghemat persediaan tetapi tidak menyisakan slack.
- **Bottleneck-based scheduling:** Bottleneck dimuat terlebih dahulu; operasi hulu kemudian dijadwalkan mundur dan operasi hilir dijadwalkan maju.

Dua fungsi sangat berharga bagi penjualan:

- **Available to promise (ATP):** Berapa kuantitas yang dapat dijanjikan pada tanggal berapa dari persediaan dan penerimaan yang direncanakan?
- **Capable to promise (CTP):** Tanggal apa yang dapat dicapai untuk pesanan baru dengan mempertimbangkan material *dan* kapasitas?

CTP adalah fungsi APS yang khas karena ia menguji-jadwal pesanan baru terhadap beban yang berjalan saat ini. Hal ini mengubah janji tanggal pengiriman dari perkiraan menjadi perhitungan.

## 6. ERP vs. APS vs. MES

Ketiga kelas sistem ini tidak saling bersaing; keduanya saling melengkapi. ANSI/ISA-95 menempatkan ERP di Level 4 (perencanaan bisnis dan logistik) dan manajemen operasi manufaktur di Level 3; model aktivitas di Bagian 3 mencakup jadwal kerja (disebut "detailed production schedule" dalam edisi 2005) dan pelaksanaannya [31]. Pedoman Jerman VDI 5600 Bagian 1 (Oktober 2016), yang banyak digunakan di Eropa, lebih jauh lagi dan secara eksplisit mencantumkan "detailed planning and detailed control" sebagai salah satu dari sepuluh tugas sistem manufacturing execution, bersama manajemen pesanan, manajemen peralatan, manajemen material, manajemen personel, akuisisi data, analisis kinerja, manajemen kualitas, manajemen informasi, dan manajemen energi [15]. Dalam praktiknya, penjadwalan detail disediakan baik di MES, di APS yang berdiri sendiri, atau di modul APS pada ERP.

| Fitur | ERP (modul perencanaan) | APS | MES |
|---|---|---|---|
| Tugas utama | kuantitas, nilai, material, tanggal milestone | tanggal dan urutan yang layak di bawah batasan | eksekusi, konfirmasi, visibilitas real-time |
| Horizon perencanaan | minggu hingga bulan | jam hingga minggu, bergulir | shift hingga menit |
| Model kapasitas | tak terbatas dalam bentuk dasarnya, tampilan beban hilir | terbatas, banyak sumber daya sekaligus | mengukur kapasitas yang benar-benar terpakai |
| Granularitas waktu | hari, minggu | menit hingga jam | detik hingga menit |
| Logika perencanaan | MRP, penjadwalan mundur dengan lead time tetap | heuristik, metaheuristik, optimisasi matematis | aturan pelepasan dan dispatching, kadang penjadwal sendiri |
| Pertanyaan khas | Apa yang harus selesai pada kapan, material apa yang kurang? | Operasi apa berjalan kapan pada sumber daya mana? | Apa yang sedang berjalan sekarang, seberapa jauh tiap pesanan, mengapa mesin berhenti? |
| Data | master data, pesanan pelanggan dan pesanan terencana | data ERP ditambah matriks changeover, kalender, batasan, konfirmasi | data mesin, produksi, dan kualitas |
| Respons terhadap gangguan | proses perencanaan berikutnya, sering semalam | penjadwalan ulang dalam hitungan menit, perbandingan skenario | pencatatan, alarm, pemicu penjadwalan ulang |
| Pengguna | perencanaan material, pembelian, penjualan, keuangan | perencanaan produksi, pengendalian produksi, supply chain | supervisor, operator, pemeliharaan, kualitas |
| Keterbatasan | merencanakan berdasarkan asumsi, bukan kenyataan | membutuhkan master data dan konfirmasi yang baik | sering hanya merencanakan jangka pendek dan lokal |

**Cara kerja sistem-sistem ini bersama-sama:** ERP meneruskan pesanan, bill of material, routing, dan persediaan ke APS. APS menjadwalkan berdasarkan kapasitas terbatas dan mengembalikan tanggal serta urutan yang realistis, yang digunakan ERP untuk tanggal pengiriman dan kebutuhan material. MES mengeksekusi urutan tersebut di lantai produksi dan melaporkan waktu aktual, kuantitas, dan gangguan kembali ke APS dan ERP. Hanya loop tertutup ini yang membuat jadwal dapat diandalkan. Cara menutup jalur dari ERP ke lantai produksi dengan digital twin dijelaskan dalam postingan [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/).

**Kapan ERP sudah cukup?** Jika pesanan Anda memiliki sedikit operasi, setup hampir tidak bergantung pada urutan, bottleneck yang jelas dapat dijalankan dengan aturan pelepasan sederhana, dan kapasitas jarang ketat, rencana ERP yang terpelihara dengan baik ditambah papan penjadwalan sering kali sudah memadai. Semakin banyak batasan dari Bagian 5.2 yang berlaku, semakin jelas alasan untuk APS.

## 7. Teori kendala, drum-buffer-rope, dan manajemen buffer

### 7.1 Teori kendala

Eliyahu M. Goldratt memperkenalkan **[teori kendala](https://www.m365.fm/entity/theory-of-constraints/)** (TOC) pada tahun 1984 dalam novel bisnis *The Goal*, yang ditulis bersama Jeff Cox [1]. Pesan utamanya: setiap sistem memiliki setidaknya satu kendala yang membatasi throughput-nya. Satu jam yang hilang di bottleneck berarti satu jam yang hilang bagi seluruh sistem. Satu jam yang dihemat di non-bottleneck tidak bernilai selama tidak meringankan bottleneck.

Goldratt merumuskan lima langkah pemusatan, yang dikenal sebagai proses perbaikan berkelanjutan (POOGI) [3]:

1. **Identifikasi** kendala sistem.
2. **Eksploitasi** kendala: tidak ada waktu menganggur, tidak memproses scrap, setup dilakukan di luar waktu bottleneck jika memungkinkan.
3. **Subordinasikan** semua hal lain pada kendala: pelepasan, ukuran lot, dan urutan sumber daya lainnya mengikuti bottleneck.
4. **Tingkatkan** kendala: baru pada tahap ini menambah shift, berinvestasi, atau melakukan outsourcing.
5. **Cegah inersia:** jika kendala telah berpindah, kembali ke langkah 1.

Urutannya penting. Banyak perusahaan langsung melompat ke langkah 4 dan membeli mesin baru, padahal bottleneck yang ada masih kehilangan kapasitas karena waktu menganggur, menunggu material, urutan yang buruk, atau setup yang tidak perlu.

### 7.2 Menemukan bottleneck: analisis bottleneck dalam praktik

Bottleneck tidak selalu berupa mesin dengan kerusakan terbanyak atau harga termahal. Indikator yang terbukti:

- **Antrean:** Pesanan menumpuk terus-menerus di depan bottleneck, sementara sumber daya di belakangnya menganggur.
- **Beban versus kapasitas:** Untuk setiap sumber daya, bandingkan beban terencana (termasuk waktu setup) dengan kapasitas yang tersedia selama beberapa minggu. Sumber daya dengan rasio tertinggi adalah kandidatnya.
- **Diagram throughput:** Di mana WIP tetap tinggi dan kurva output tetap tidak menanjak, terdapat bottleneck kapasitas [8].
- **Tanyakan kepada para ahli, lalu verifikasi:** Supervisor biasanya tahu di mana terjadi penyumbatan. Verifikasi dengan data, karena bottleneck yang "dirasakan" sering kali merupakan sumber daya dengan banyak kerusakan yang terlihat.

Waspadai **bottleneck yang berpindah**. Dengan bauran produk yang berubah, bottleneck dapat berpindah antar sumber daya dari minggu ke minggu. Pengendalian bottleneck yang statis tidak lagi cukup, sehingga APS yang menghitung beban ke depan per sumber daya untuk daftar pesanan saat ini menjadi sangat berharga. Bottleneck juga tidak selalu berupa mesin: sering kali berupa tenaga kerja terampil, stasiun inspeksi, perkakas, atau departemen perencanaan itu sendiri.

### 7.3 Drum-buffer-rope

Dalam *The Race* (1986), Goldratt dan Robert E. Fox menjelaskan metode pengendalian yang menerjemahkan lima langkah tersebut menjadi pengendalian di lantai produksi: **drum-buffer-rope** (DBR) [2]. Metafora ini berasal dari *The Goal*, di mana sebuah regu pramuka hanya dapat berjalan secepat anggota yang paling lambat:

- **Drum:** Bottleneck menentukan ritme. Jadwalnya adalah satu-satunya jadwal rinci yang wajib ditepati.
- **Buffer:** **Time buffer** berada di depan bottleneck (dan di depan titik pengiriman serta perakitan tempat komponen bottleneck bertemu dengan komponen lain). Buffer ini melindungi bottleneck dari variabilitas di hulu.
- **Rope:** Material dilepas ke lantai produksi hanya secepat bottleneck dapat memprosesnya. Rope mengaitkan pelepasan dengan jadwal bottleneck, dengan selisih waktu buffer.

**Contoh kerja pelepasan DBR:** Bottleneck adalah operasi heat-treating. Pesanan 4711 dijadwalkan mulai di sana pada hari Kamis pukul 06.00. Time buffer di depan bottleneck adalah 3 hari kerja. Maka material untuk pesanan 4711 dilepas pada hari Senin pukul 06.00, tidak lebih awal. Melepasnya lebih awal hanya menaikkan WIP dan, menurut Little's Law, lead time, tanpa menambah throughput.

Time buffer pada awalnya ditetapkan secara pragmatis. Nilai awal yang sering disebut dalam praktik TOC adalah sekitar setengah dari lead time saat ini hingga bottleneck [unverified: nilai ini bersifat umum dalam literatur praktik, belum diverifikasi untuk kondisi pabrik tertentu]. Nilai tersebut kemudian disesuaikan melalui manajemen buffer.

### 7.4 Manajemen buffer

**[Manajemen buffer](https://www.m365.fm/entity/buffer-management/)** adalah mekanisme umpan balik dari DBR [4]. Untuk setiap pesanan yang dilepas, Anda melacak berapa banyak time buffer-nya yang telah terpakai. Pembagian tiga zona lazim digunakan:

| Zona | Buffer terpakai | Arti | Respons |
|---|---|---|---|
| Hijau | hingga sekitar sepertiga | pesanan sesuai rencana | tidak perlu tindakan |
| Kuning | sekitar sepertiga hingga dua pertiga | pesanan mulai ketat | cari penyebabnya, siapkan tindakan |
| Merah | lebih dari dua pertiga | bottleneck berisiko kekurangan material atau tanggal jatuh tempo terancam | percepat: prioritaskan pesanan, hilangkan hambatan |

Pembagian menjadi tiga bagian yang sama besar merupakan konvensi yang luas digunakan, bukan hukum alam. Dua manfaat yang paling penting adalah:

1. **Prioritas harian:** Alih-alih banyak daftar prioritas yang saling bertentangan, ada satu aturan tunggal: pesanan merah dulu, lalu kuning, lalu hijau.
2. **Perbaikan sistematis:** Catat dan analisis penyebab pesanan merah, maka Anda akan memperoleh daftar Pareto sumber gangguan. Jika banyak pesanan terus-menerus berwarna merah, buffer terlalu kecil atau proses terlalu tidak stabil. Jika hampir semua pesanan berwarna hijau, buffer dapat dikurangi, sehingga WIP dan lead time turun.

Varian **simplified DBR** (S-DBR) untuk produsen make-to-order tidak memerlukan jadwal bottleneck yang rinci dan bekerja dengan buffer pengiriman serta pemeriksaan beban bottleneck pada saat penerimaan pesanan. Varian ini dijelaskan dalam *Theory of Constraints Handbook* bersama DBR klasik [4].

### 7.5 DBR dan APS: berlawanan atau saling melengkapi?

Praktisi TOC sejak lama skeptis terhadap perangkat lunak perencanaan yang kompleks, karena jadwal rinci untuk setiap sumber daya cepat usang ketika gangguan terjadi. Namun, sistem APS modern dapat memodelkan prinsip-prinsip DBR dengan baik: penjadwalan berbasis bottleneck, pelepasan dengan time buffer, dan tampilan status buffer dapat dikonfigurasi di banyak sistem. Sebaliknya, DBR mendapat manfaat dari APS ketika bottleneck berpindah, ketika urutan setup di bottleneck perlu dioptimalkan, atau ketika banyak kendala berlaku sekaligus. Sikap yang masuk akal: DBR menyediakan filosofi pengendalian, APS menyediakan daya komputasi.

## 8. Blok bangunan Lean dalam penjadwalan: takt, heijunka, line balancing, pull

Produksi Lean dan APS sering disajikan sebagai dua hal yang berlawanan: pull dan kendali visual di satu sisi, perencanaan terpusat berbasis algoritma di sisi lain. Dalam praktiknya keduanya saling melengkapi. Lean menstabilkan aliran dan mengurangi variabilitas; APS merencanakan di mana aliran saja tidak cukup, misalnya dengan variasi produk yang tinggi, lead time yang panjang, atau sumber daya bersama. Untuk sisi lean secara mendalam, lihat panduan m365.fm [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

### 8.1 Takt time

**[Takt time](https://www.m365.fm/entity/takt-time/)** adalah interval waktu di mana satu unit harus diselesaikan agar memenuhi permintaan pelanggan:

> **Takt time = waktu kerja tersedia per periode ÷ permintaan pelanggan per periode**

**Contoh perhitungan:** Sebuah lini perakitan beroperasi dua shift, masing-masing 7,5 jam waktu kerja bersih (setelah istirahat terjadwal), jadi 900 menit per hari. Permintaan pelanggan adalah 450 unit per hari.

- Takt time = 900 menit ÷ 450 unit = **2,0 menit per unit** (120 detik)

Takt time adalah laju permintaan, bukan ukuran kinerja. Cycle time aktual setiap stasiun harus berada di bawah nilai ini agar permintaan dapat terpenuhi.

### 8.2 Line balancing

**[Line balancing](https://www.m365.fm/entity/line-balancing/)** membagi muatan kerja ke seluruh stasiun sehingga setiap stasiun tetap di bawah takt time dengan waktu menganggur sekecil mungkin. Nils Boysen, Malte Fliedner dan Armin Scholl mengklasifikasikan secara sistematis banyak varian masalah ini [22].

**Contoh perhitungan (lanjutan):** Total muatan kerja per unit adalah 9,6 menit.

- Jumlah stasiun minimum secara teoretis = 9,6 menit ÷ 2,0 menit = 4,8, dibulatkan ke atas menjadi **5 stasiun**
- Karena precedence graph dan elemen kerja yang tidak dapat dibagi, dalam praktik diperlukan **6 stasiun**.
- Efisiensi keseimbangan = 9,6 menit ÷ (6 × 2,0 menit) = 9,6 ÷ 12,0 = **80%**
- Balance delay = 100% − 80% = **20%** dari kapasitas lini

Untuk penjadwalan, artinya: dengan 6 stasiun lini mencakup 450 unit per hari, tetapi setiap stasiun menunggu 20% dari waktu secara rata-rata. Jika permintaan naik, lini harus diseimbangkan ulang atau waktu kerja diperpanjang.

### 8.3 Heijunka

**[Heijunka](https://www.m365.fm/entity/heijunka/)** (bahasa Jepang untuk perataan) adalah prinsip inti Toyota Production System yang dijelaskan oleh Taiichi Ohno [20]. Lean Enterprise Institute mendefinisikannya sebagai perataan jenis dan jumlah produksi selama periode waktu tertentu [34]. Alih-alih membuat lot besar satu varian demi varian, bauran produksi disebar merata sepanjang waktu.

**Contoh:** Sebuah pabrik membuat 200 unit varian A, 100 unit varian B dan 100 unit varian C per minggu selama lima hari.

| Pendekatan | Senin | Selasa | Rabu | Kamis | Jumat |
|---|---|---|---|---|---|
| Batch demi batch | 80 A | 80 A | 40 A, 40 B | 60 B, 20 C | 80 C |
| Diratakan (heijunka) | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C |

Dalam rencana yang diratakan (leveled), beban puncak pada proses hulu berkurang, persediaan barang jadi per varian menyusut, dan pelanggan dari setiap varian dapat dilayani setiap hari. Harganya adalah pergantian produk (changeover) yang lebih sering. Oleh karena itu, Heijunka membutuhkan waktu setup yang singkat, dan di sinilah lean dan APS bertemu: APS dapat menghitung urutan produksi yang paling ramah terhadap setup dalam satu hari untuk campuran yang diratakan.

### 8.4 Kanban, pull dan CONWIP

Sistem **[pull](https://www.m365.fm/entity/pull-system/)** membatasi WIP dengan hanya memulai pekerjaan baru ketika konsumen hilir memberi sinyal permintaan. Bentuk yang paling dikenal adalah **[kanban](https://www.m365.fm/entity/kanban/)**: kartu atau sinyal elektronik antarproses memicu pengisian ulang, dan jumlah kartu membatasi persediaan.

Kanban cocok untuk suku cadang dengan permintaan yang teratur dan jumlah varian yang dapat dikelola. Di job shop dan produksi volume rendah dengan campuran tinggi, kanban mencapai batasnya, karena setiap varian memerlukan stok. Salah satu alternatif adalah **CONWIP** (constant work in process), yang diusulkan pada 1990 oleh Mark Spearman, David Woodruff, dan Wallace Hopp sebagai alternatif pull terhadap kanban [21]. CONWIP tidak membatasi persediaan per suku cadang melainkan jumlah total pesanan dalam satu lini: pesanan baru dilepas hanya ketika pesanan lain selesai. Hukum Little menjadi aturan pengendalian. Metode terkait dari IFA di Hannover adalah **pelepasan pesanan berorientasi beban** (*belastungsorientierte Auftragsfreigabe*), yang melepas pesanan hanya selama beban kerja di depan sebuah pusat kerja tetap di bawah batas beban; Lödding menjelaskannya bersama CONWIP dan pengendalian bottleneck sebagai metode pelepasan pesanan [12]. Dalam penelitian berbahasa Inggris, keluarga metode ini biasanya dibahas di bawah judul workload control.

**Apa artinya untuk penjadwalan:** Kanban dan CONWIP memutuskan *kapan* melepas dan membatasi WIP. APS memutuskan *apa* yang diproduksi dalam urutan apa dan apakah tanggal-tanggalnya dapat dicapai. Banyak pabrik menggunakan keduanya: suku cadang standar berjalan dalam loop kanban, sedangkan pesanan khusus pelanggan dijadwalkan di APS dan dilepas di bawah batas WIP.

## 9. Penentuan ukuran lot: EOQ, contoh perhitungan, dan batasannya

### 9.1 Masalah dasar

Setiap lot membawa biaya tetap untuk setup, penanganan pesanan, dan start-up, terlepas dari kuantitasnya. Lot besar menyebarkan biaya tersebut ke banyak unit tetapi menaikkan persediaan dan modal yang terikat. Lot kecil menurunkan persediaan tetapi berarti setup lebih sering. **[Ukuran batch](https://www.m365.fm/entity/batch-size/)** oleh karena itu merupakan trade-off klasik.

### 9.2 Rumus klasik: Harris (EOQ) dan Andler

Ford Whitman Harris mempublikasikan rumus akar kuadrat untuk ukuran lot ekonomis pada 1913 dalam *Factory, The Magazine of Management*. Kini rumus ini dikenal sebagai economic order quantity (EOQ); Donald Erlenkotter menelusuri kepengarangannya pada 1990 [17]. Ketika rumus digunakan untuk lot produksi dan bukan pesanan pembelian, buku-buku AS sering menyebutnya economic production atau economic lot size. Di negara-negara berbahasa Jerman, rumus ini dikenal sebagai **rumus Andler**, dari buku Kurt Andler tahun 1929 [18]:

> **Q* = √(2 × D × S ÷ H)**
>
> Q* = ukuran lot optimal (unit)
> D = permintaan per periode (unit per tahun)
> S = biaya tetap per lot, yaitu biaya setup dan pemesanan ($ per lot)
> H = biaya penyimpanan per unit dan periode ($ per unit per tahun), sering dihitung sebagai biaya unit × tingkat biaya penyimpanan

Rumus ini meminimalkan jumlah biaya setup (D ÷ Q × S) dan biaya penyimpanan (Q ÷ 2 × H). Pada titik optimum, kedua komponen biaya tersebut sama besar.

### 9.3 Contoh perhitungan

Sebuah suku cadang bubut (lathe) memiliki permintaan tahunan 12.000 unit. Satu setup menelan biaya $300 termasuk waktu mesin dan tenaga kerja. Biaya satuan $40, tingkat biaya penyimpanan 20% per tahun. (Naskah asli berbahasa Jerman menggunakan angka yang sama dalam euro; angka-angka ini bersifat ilustratif, tidak dikonversi.)

- H = $40 × 0,20 = $8 per unit per tahun
- Q* = √(2 × 12.000 × 300 ÷ 8) = √(7.200.000 ÷ 8) = √900.000 ≈ **949 unit**
- Jumlah lot per tahun = 12.000 ÷ 949 ≈ 12,6
- Biaya setup per tahun = 12.000 ÷ 949 × $300 ≈ $3.793
- Biaya penyimpanan per tahun = 949 ÷ 2 × $8 = $3.796
- **Total biaya ≈ $7.589** per tahun

Seberapa sensitif biaya terhadap penyimpangan dari Q*?

| Ukuran lot | Biaya setup ($/thn) | Biaya penyimpanan ($/thn) | Total biaya ($/thn) | Penyimpangan dari optimum |
|---|---|---|---|---|
| 500 | 7.200 | 2.000 | 9.200 | +21,2% |
| 600 | 6.000 | 2.400 | 8.400 | +10,7% |
| 949 | 3.793 | 3.796 | 7.589 | 0% |
| 1.200 | 3.000 | 4.800 | 7.800 | +2,8% |
| 2.000 | 1.800 | 8.000 | 9.800 | +29,1% |

Kurva biaya datar di sekitar titik optimum: ukuran lot sekitar seperempat lebih besar biayanya kurang dari 3% lebih tinggi. Dalam praktik, Anda dapat membulatkan ukuran lot ke nilai praktis, seperti kuantitas kontainer atau permintaan harian, tanpa penalti biaya yang berarti.

**Waktu setup adalah pengungkit yang lebih besar:** Jika pengurangan setup memangkas biaya setup dari $300 menjadi $150, ukuran lot optimal turun menjadi √(2 × 12.000 × 150 ÷ 8) ≈ **671 unit**. Total biaya turun menjadi sekitar $5.367 per tahun, atau kira-kira 29% lebih rendah, karena total biaya pada titik optimum berbanding lurus dengan akar kuadrat dari S. Stok siklus rata-rata juga turun sekitar 29%. Metode pengurangan setup seperti SMED (single-minute exchange of die) dengan demikian menguntungkan dua kali lipat. Selengkapnya di halaman entitas [Setup Time](https://www.m365.fm/entity/setup-time/).

### 9.4 Batasan rumus EOQ

Rumus ini merupakan titik awal yang berguna, tetapi asumsinya hampir tidak pernah terpenuhi di lantai produksi:

- **Permintaan konstan dan diketahui:** Permintaan nyata berfluktuasi dan tidak pasti.
- **Kapasitas tak terbatas:** Rumus ini mengabaikan bahwa setup memakan kapasitas di bottleneck. Di bottleneck, satu jam setup berarti satu jam throughput yang hilang; di non-bottleneck, biayanya hampir nihil. TOC menyimpulkan bahwa lot cenderung lebih besar di bottleneck dan lebih kecil di non-bottleneck.
- **Satu produk, tanpa interaksi:** Beberapa produk berbagi mesin; setup yang bergantung pada urutan tidak dimodelkan.
- **Produksi seketika:** Dalam bentuk dasarnya, seluruh lot tersedia sekaligus. Untuk laju produksi yang terbatas ada rumus yang diperluas (economic production quantity) di mana biaya penyimpanan dibobot dengan faktor (1 − laju permintaan ÷ laju produksi).
- **Tidak ada pengaruh pada lead time:** Lot besar memperpanjang lead time setiap pesanan berikutnya pada mesin yang sama dan meningkatkan variabilitas. Pengaruh itu tidak ada dalam perhitungan biaya.
- **Tarif biaya yang sulit ditentukan:** Biaya setup dan tarif biaya penyimpanan sering merupakan nilai perkiraan dengan keleluasaan yang lebar.

Untuk permintaan dinamis tersedia metode seperti algoritma Wagner-Whitin dan heuristik seperti part-period balancing dan Silver-Meal. APS melangkah lebih jauh dengan memutuskan ukuran lot dan urutan secara bersamaan, dengan mempertimbangkan kapasitas, matriks changeover, dan tanggal jatuh tempo.

## 10. Safety stock: rumus dan contoh perhitungan

### 10.1 Untuk apa safety stock

**[Safety stock](https://www.m365.fm/entity/safety-stock/)** melindungi terhadap dua ketidakpastian: variasi permintaan selama lead time pengisian ulang dan variasi lead time itu sendiri. Ini bukan perbaikan atas perencanaan yang buruk, melainkan asuransi yang sengaja dibayar terhadap keacakan.

### 10.2 Rumus untuk permintaan variabel

Jika permintaan harian kira-kira terdistribusi normal dan lead time pengisian ulang konstan [19]:

> **SS = z × σ_D × √L**
>
> SS = safety stock (unit)
> z = faktor keamanan dari distribusi normal standar untuk tingkat layanan yang diinginkan
> σ_D = simpangan baku permintaan harian (unit)
> L = lead time pengisian ulang (hari)

Tingkat layanan yang digunakan di sini adalah **cycle service level** (probabilitas tidak terjadi kehabisan stok selama satu siklus pengisian ulang, disebut α service level dalam teks berbahasa Jerman). Ini tidak sama dengan **fill rate** (proporsi jumlah permintaan yang dipenuhi segera dari stok, β service level). Mencampuradukkan keduanya menyebabkan ukuran persediaan yang secara sistematis keliru.

**Contoh perhitungan:** Suatu suku cadang yang dibeli dikonsumsi rata-rata 100 unit per hari; simpangan bakunya 30 unit per hari. Lead time pengisian ulang adalah 9 hari kerja.

| Cycle service level | z | Perhitungan | Safety stock |
|---|---|---|---|
| 90% | 1,282 | 1,282 × 30 × √9 = 1,282 × 30 × 3 | ≈ 115 unit |
| 95% | 1,645 | 1,645 × 30 × 3 | ≈ 148 unit |
| 99% | 2,326 | 2,326 × 30 × 3 | ≈ 209 unit |

Beralih dari 95% ke 99% membutuhkan safety stock lebih dari 40% lebih banyak. Tingkat layanan yang tinggi menjadi mahal secara tidak proporsional.

### 10.3 Rumus untuk permintaan variabel dan lead time variabel

Jika lead time juga bervariasi, rumusnya diperluas [19]:

> **SS = z × √(L × σ_D² + d² × σ_L²)**
>
> d = rata-rata permintaan harian, σ_L = simpangan baku lead time (hari)

**Contoh perhitungan (lanjutan):** Pemasok mengirim rata-rata setelah 9 hari, tetapi dengan simpangan baku 2 hari.

- L × σ_D² = 9 × 30² = 8.100
- d² × σ_L² = 100² × 2² = 40.000
- √(8.100 + 40.000) = √48.100 ≈ 219,3
- SS (95%) = 1,645 × 219,3 ≈ **361 unit**

Stok pengaman naik dari 148 menjadi 361 unit, hampir dua setengah kali lipat, semata-mata karena waktu tunggu (lead time) yang tidak dapat diandalkan. Variasi lead time menyumbang sekitar 83% dari varians di sini. Memperbaiki ketepatan waktu pengiriman pemasok sering kali mengurangi persediaan lebih besar dibanding perbaikan peramalan apa pun.

### 10.4 Batasan rumus

- Distribusi normal kurang cocok untuk permintaan intermiten (banyak periode tanpa konsumsi). Distribusi lain atau simulasi lebih tepat untuk kasus tersebut.
- Rumus ini mengasumsikan permintaan yang independen. Untuk suku cadang dengan permintaan dependen dari bill of material, stok pengaman biasanya bukan alat yang tepat; lead time pengaman atau buffer pada titik-titik sasaran lebih efektif.
- Stok pengaman yang terus-menerus dikonsumsi bukanlah stok pengaman melainkan kesalahan perencanaan. Periksa secara berkala seberapa sering dan mengapa stok tersebut terlampaui.

## 11. KPI perencanaan produksi

Tanpa KPI, Anda tidak dapat membuktikan nilai sebuah APS maupun memperbaiki perencanaan. Definisikan setiap KPI secara jelas sebelum penerapan dan ukur baseline-nya. Panduan terpisah dari m365.fm tentang [KPI manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/) membahas kumpulan yang lebih luas.

| KPI | Rumus | Yang ditunjukkannya | Jebakan |
|---|---|---|---|
| On time in full (OTIF) | baris yang dikirim tepat waktu dan lengkap ÷ seluruh baris yang jatuh tempo | sudut pandang pelanggan | tentukan acuannya: tanggal yang diminta atau yang dikonfirmasi; tetapkan jendela toleransi |
| On-time delivery (OTD) | baris yang dikirim tepat waktu ÷ seluruh baris yang jatuh tempo | seperti OTIF tetapi tanpa kriteria kuantitas | pengiriman sebagian mengaburkan gambaran |
| Lead time (waktu siklus manufaktur) | selesai dikurangi rilis (per order), rata-rata dan sebarannya | kecepatan alur | rata-rata saja tidak cukup; sebaran menentukan keandalan tanggal kirim |
| Flow factor | rata-rata lead time ÷ rata-rata waktu operasi | seberapa lama sebuah order menunggu dibanding waktu ketika dikerjakan [8] | gunakan satuan waktu yang sama (jam kerja atau jam kalender) |
| Work in process (WIP) | jumlah atau muatan kerja order yang sudah dirilis namun belum selesai | pendorong lead time menurut Hukum Little | ukur dalam jam muatan kerja, bukan hanya unit |
| Utilisasi | waktu sibuk ÷ waktu tersedia | pemanfaatan kapasitas | utilisasi tinggi pada non-bottleneck bukanlah keberhasilan |
| Utilisasi bottleneck | waktu produktif di bottleneck ÷ waktu tersedia di bottleneck | KPI utilisasi terpenting di bawah TOC | laporkan waktu setup dan waktu menganggur di bottleneck secara terpisah |
| Rasio setup | waktu setup ÷ (waktu setup + waktu proses) | kapasitas yang hilang akibat pergantian produksi | sangat kritis terutama di bottleneck |
| Overall equipment effectiveness (OEE) | ketersediaan × kinerja × kualitas | efektivitas sebuah mesin | cocok untuk peralatan, bukan untuk evaluasi jadwal |
| Kepatuhan jadwal (schedule adherence) | operasi yang dimulai atau selesai sesuai jadwal ÷ seluruh operasi yang dijadwalkan | seberapa realistis dan stabil jadwalnya? | tetapkan toleransi, misalnya ± 1 shift |
| Stabilitas jadwal (schedule stability) | operasi yang berubah dalam horizon beku ÷ seluruh operasi | nervositas perencanaan | terlalu banyak perubahan menunjukkan data yang buruk atau tidak adanya zona beku |
| Status buffer | proporsi order di zona merah, kuning, dan hijau | peringatan dini di bawah buffer management | hanya bermakna jika buffer telah ditetapkan |

**Contoh kerja, kinerja pengiriman:** Pada bulan Oktober, 480 baris order jatuh tempo pada tanggal yang dikonfirmasi. 432 di antaranya dikirim tepat waktu; 410 dari yang tepat waktu tersebut juga dikirim lengkap.

- On-time delivery = 432 ÷ 480 = **90,0%**
- OTIF = 410 ÷ 480 ≈ **85,4%**

**Contoh kerja, rasio setup dan flow factor:** Dalam satu minggu, bottleneck menghabiskan 18 jam untuk setup dan 62 jam untuk pemrosesan. Rasio setup = 18 ÷ (18 + 62) = **22,5%**. Sebuah order dengan 6 jam waktu operasi menghabiskan 120 jam kerja (15 hari, masing-masing 8 jam) di lantai produksi. Flow factor = 120 ÷ 6 = **20**: order tersebut berada di lantai produksi dua puluh kali lebih lama dibanding waktu yang benar-benar dikerjakan.

**Kumpulan KPI untuk penerapan APS:** Minimal, ukur OTIF, lead time (rata-rata dan sebarannya), WIP, dan utilisasi bottleneck sebelum go-live dan secara bulanan setelahnya. Keempat KPI ini saling terkait melalui Hukum Little dan kurva operasi, dan bersama-sama menunjukkan apakah jadwal yang lebih baik telah menghasilkan alur yang lebih baik.

## 12. Digital twin dan simulasi

**Simulasi** memodelkan sistem produksi dan menjalankannya sepanjang waktu. Pedoman Jerman VDI 3633 Part 1 membahas dasar-dasar simulasi sistem logistik, aliran material, dan produksi [16]. Simulasi menjawab pertanyaan yang tidak dapat dijawab oleh perhitungan kapasitas statis, karena memperhitungkan keacakan, gangguan, dan interaksi: Bagaimana kerusakan mesin memengaruhi tanggal pengiriman dalam dua minggu ke depan? Apa hasil dari shift ketiga di bottleneck? Bagaimana perubahan bauran produk memengaruhi lead time?

**Digital twin produksi** melangkah lebih jauh: ini adalah model yang terus disinkronkan dengan data dari ERP, MES, dan mesin. Untuk penjadwalan produksi, twin ini memiliki tiga fungsi:

1. **Dasar perencanaan:** APS menjadwalkan berdasarkan model yang mencerminkan sumber daya, batasan, dan status aktual secara real time.
2. **Analisis skenario:** Sebelum keputusan diambil, seperti menerima pesanan mendesak atau melakukan investasi, alternatif disimulasikan dan dibandingkan berdasarkan KPI.
3. **Loop pembelajaran:** Deviasi antara rencana dan aktual dikembalikan sebagai masukan untuk memperbaiki waktu standar dan batasan.

Bedakan antara model simulasi yang dibangun sekali untuk sebuah studi dan twin yang dipelihara secara terus-menerus dan digunakan dalam operasi. Yang kedua memberikan nilai lebih besar tetapi memerlukan integrasi data yang stabil dan kepemilikan yang jelas atas pemeliharaan model. Cara menghubungkan data ERP, twin, dan shop floor ditunjukkan dalam posting [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Panduan m365.fm [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) membahasnya lebih mendalam; sisi cloud dan data dibahas dalam [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

**Pemetaan value stream terlebih dahulu:** Sebelum memodelkan twin atau APS, petakan value stream. Ini menunjukkan di mana persediaan berada, di mana bottleneck diduga, dan aliran informasi mana yang saat ini mendorong perencanaan. Lihat panduan [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

## 13. Cara memilih perangkat lunak penjadwalan produksi: kriteria dan daftar periksa

### 13.1 Sebelum membuat daftar pendek: perjelas tujuan dan titik awal

Baik Anda mencari "production scheduling software," "APS software," "finite capacity scheduling software," maupun "capacity planning software," yang penting dalam manufaktur adalah apakah sistem menjadwalkan kapasitas secara terbatas dan dengan batasan nyata Anda. Banyak alat yang muncul di peringkat untuk istilah-istilah ini adalah alat manajemen proyek atau perencanaan sumber daya tim. Alat tersebut berguna untuk proyek, tetapi biasanya tidak memodelkan routing, setup yang bergantung pada urutan, atau ketersediaan material. Daftar "best production scheduling software" di google.com mencampur kedua kategori, jadi periksa setiap kandidat terhadap tabel batasan di Bagian 5.2.

Sebelum berbicara dengan vendor, jawab tiga pertanyaan:

1. **Masalah apa yang harus dipecahkan?** Misalnya: menaikkan OTIF dari 78% menjadi di atas 90%, memangkas lead time separuhnya, mengurangi upaya perencanaan, memberikan tanggal pengiriman yang andal saat entri pesanan.
2. **Batasan mana yang benar-benar penting?** Telusuri tabel di Bagian 5.2 dan tandai yang berlaku di pabrik Anda.
3. **Seberapa baik kualitas data Anda?** Periksa routing, waktu standar, dan kualitas konfirmasi sebelum pemilihan (Bagian 14).

### 13.2 Kriteria pemilihan

| Kriteria | Pertanyaan yang perlu diajukan | Bobot (contoh) |
|---|---|---|
| Pemodelan kendala | Apakah sistem memodelkan semua kendala yang relevan tanpa kode kustom? | tinggi |
| Kualitas jadwal | Seberapa baik jadwal untuk data *Anda*, diukur berdasarkan tujuan Anda? | tinggi |
| Waktu proses | Berapa lama penjadwalan ulang penuh membutuhkan waktu pada volume data yang realistis? | sedang hingga tinggi |
| Penjadwalan interaktif | Dapatkah perencana menyeret dan melepas pesanan, dan apakah sistem langsung memeriksa konsekuensinya? | tinggi |
| Keterjelasan | Dapatkah perencana melihat alasan sebuah pesanan dijadwalkan di posisinya? | tinggi |
| Skenario dan simulasi | Dapatkah varian dihitung secara paralel dan dibandingkan berdasarkan KPI? | sedang |
| Integrasi ERP | Apakah tersedia konektor standar ke ERP Anda, dengan arah apa, dan seberapa sering? | tinggi |
| Integrasi MES dan konfirmasi | Bagaimana data aktual sampai ke APS, dan seberapa cepat? | tinggi |
| Kegunaan | Apakah perencana dan supervisor menerima antarmukanya? | tinggi |
| Skalabilitas | Banyak pabrik, lebih banyak sumber daya, lebih banyak pesanan? | sedang |
| Operasi dan keamanan | Cloud atau on-premises, wilayah hosting, sertifikasi (misalnya ISO/IEC 27001, SOC 2), model peran dan izin, kesesuaian dengan kerangka keamanan Anda (misalnya NIST CSF 2.0 [35]); untuk pemasok pertahanan AS, persyaratan CMMC yang berlaku pada data terkait [36] | sedang |
| Vendor dan mitra | Pengalaman di industri, referensi dengan produksi yang sebanding, dukungan, peta jalan | sedang |
| Total biaya kepemilikan | Lisensi, implementasi, pembersihan data, pelatihan, operasi selama 5 tahun | sedang |

**Bagaimana dengan harga?** Harga di kategori ini berkisar dari langganan SaaS per pengguna untuk alat sederhana hingga penawaran perusahaan untuk APS multi-pabrik, dan sebagian besar vendor APS tidak menerbitkan harga daftar. Direktori perangkat lunak yang berada di peringkat teratas untuk istilah utama menunjukkan pola yang sama: banyak daftar menyatakan "harga atas permintaan," dan setidaknya satu direktori peringkat masih menampilkan data harga yang dikumpulkan pada 2019. Bandingkan total biaya kepemilikan selama lima tahun, termasuk upaya internal untuk pembersihan data dan integrasi, dan bukan hanya harga lisensi.

### 13.3 Daftar periksa pemilihan

Gunakan daftar ini sebagai daftar periksa untuk pertemuan dengan vendor dan uji proof-of-concept:

- [ ] Tujuan dan KPI beserta nilai dasarnya terdokumentasi.
- [ ] Kendala yang relevan telah diprioritaskan (wajib, sebaiknya, bagus jika ada).
- [ ] Dataset uji yang representatif dengan pesanan, routing, dan waktu setup yang nyata sudah siap.
- [ ] Setiap vendor menjadwalkan dataset uji yang **sama**; hasilnya dibandingkan berdasarkan KPI yang sama.
- [ ] Skenario gangguan telah diuji (mesin rusak, pesanan mendesak, material terlambat).
- [ ] Waktu proses penjadwalan ulang penuh telah diukur.
- [ ] Perencana Anda sendiri bekerja langsung dengan sistem, tidak hanya menonton demo.
- [ ] Antarmuka ERP telah dispesifikasikan (objek, arah, frekuensi, penanganan kesalahan).
- [ ] Jalur konfirmasi dari lantai produksi telah didefinisikan (MES, terminal, aplikasi seluler).
- [ ] Sistem menjelaskan keputusan penjadwalannya dengan cara yang dapat diikuti perencana.
- [ ] Peran dan izin dapat dimodelkan (siapa yang boleh menjadwalkan, merilis, membekukan?).
- [ ] Setidaknya satu referensi dengan jenis produksi yang sebanding telah diwawancarai secara langsung.
- [ ] Total biaya selama lima tahun telah dihitung, termasuk upaya internal.
- [ ] Perlindungan data, hosting, dan keamanan informasi telah disepakati dengan IT (dan, untuk pekerjaan pertahanan, dengan pihak yang bertanggung jawab atas kepatuhan CMMC).
- [ ] Opsi keluar (ekspor data, masa kontrak) telah diperjelas.

**Tips:** Uji yang paling jelas adalah **pilot dengan data Anda sendiri**. Demo vendor dengan data contoh yang bersih sedikit memberi gambaran tentang bagaimana sistem menangani routing Anda yang tidak lengkap dan kasus-kasus khusus.

## 14. Persyaratan data dan kualitas data induk

APS menghitung dengan presisi, termasuk ketika datanya salah. Jadwal yang didasarkan pada waktu standar yang meleset 30% adalah jadwal yang presisi namun keliru. Kualitas data oleh karena itu merupakan penyebab paling umum mengapa proyek APS memakan waktu lebih lama dari yang direncanakan.

| Objek data | Persyaratan minimum | Celah yang umum | Cara memeriksa |
|---|---|---|---|
| Routing | urutan operasi yang lengkap, grup work center yang benar | operasi yang hilang, sumber daya usang | bandingkan sampel dengan alur produksi aktual |
| Waktu standar (pemrosesan) | deviasi dari realisasi dalam rentang toleransi yang ditetapkan | standar berasal dari costing, bukan pengukuran | rencana vs. realisasi dari konfirmasi |
| Waktu setup | bergantung urutan bila relevan (matriks changeover) | satu waktu setup tetap per operasi | analisis log setup |
| Sumber daya dan kalender | pola shift, istirahat, jendela pemeliharaan, penghentian pabrik | kalender tidak dipelihara di ERP | bandingkan dengan jadwal shift |
| Sumber daya alternatif | alternatif yang diizinkan dengan faktor kinerja | hanya diketahui oleh supervisor | wawancara, kemudian pelihara di sistem |
| Tenaga kerja dan keterampilan | matriks keterampilan, perencanaan kehadiran | tidak tersedia secara digital | susun matriks keterampilan |
| Alat dan fixture | jumlah, penugasan ke operasi | tidak dimodelkan sebagai sumber daya | rekonsiliasi dengan daftar alat |
| Persediaan dan tanggal pembelian | stok yang benar, tanggal pengiriman yang andal | tunggakan posting, tanggal pengiriman yang belum dikonfirmasi | selisih cycle count, ketepatan waktu pengiriman pemasok |
| Konfirmasi | tepat waktu, per operasi, dengan kuantitas dan waktu | konfirmasi batch di akhir shift atau tidak ada sama sekali | ukur tingkat konfirmasi dan keterlambatan |
| Pesanan dan prioritas | tanggal jatuh tempo yang jelas, prioritas pelanggan | tanggal dimajukan "untuk jaga-jaga" | tinjau riwayat tanggal jatuh tempo |

**Aturan praktis untuk urutan kerja:** Mulailah dari bottleneck. Jika routing, waktu standar, dan waktu setup pada sumber daya bottleneck sudah benar, jadwal sudah jauh lebih baik dibanding sebelumnya, meskipun sumber daya non-bottleneck masih memiliki ketidakakuratan. Lalu lanjutkan menyusuri alur material.

**Konfirmasi adalah kuncinya:** Tanpa konfirmasi tepat waktu dari lantai produksi, APS tidak mengetahui di mana posisi sebuah pesanan dan menjadwalkan berdasarkan kondisi yang sudah tidak berlaku. Sama pentingnya: hanya konfirmasi yang memungkinkan perbandingan rencana vs. realisasi, yang dari waktu ke waktu memperbaiki waktu standar.

## 15. Roadmap implementasi APS

Roadmap di bawah ini menjelaskan fase-fase yang telah terbukti. Durasinya merupakan nilai panduan kasar untuk pabrik tunggal berukuran menengah dan sangat bergantung pada kualitas data, besarnya upaya integrasi, serta sumber daya proyek [unverified: tidak ditemukan studi yang kuat mengenai durasi implementasi].

| Fase | Isi | Hasil | Nilai panduan |
|---|---|---|---|
| 1. Asesmen | tujuan, KPI dengan baseline, value stream dan bottleneck, kendala, kualitas data | spesifikasi kebutuhan, temuan data, business case | 4 sampai 8 minggu |
| 2. Seleksi | daftar panjang vendor, dataset uji, proof of concept, referensi pelanggan | keputusan sistem, kontrak | 6 sampai 12 minggu |
| 3. Pembersihan data | routing, waktu standar dan waktu setup, kalender, keterampilan; dimulai dari bottleneck | master data yang dapat dijadwalkan | paralel dengan fase 2 dan 4, sering menjadi blok terpanjang |
| 4. Pemodelan dan integrasi | model sumber daya, kendala, bobot objektif, antarmuka ERP dan MES | model penjadwalan yang berjalan | 8 sampai 16 minggu |
| 5. Pilot | satu area, idealnya termasuk bottleneck; run paralel dengan proses lama | bukti kualitas jadwal, penerimaan pengguna | 6 sampai 12 minggu |
| 6. Rollout | area tambahan, menghentikan shadow scheduling, aturan rilis, frozen zone | operasi langsung | bergantung pada cakupan |
| 7. Perbaikan berkelanjutan | rencana vs. realisasi, pemeliharaan waktu standar, analisis penyebab buffer, tinjauan KPI | sistem perencanaan yang belajar | berkelanjutan |

**Faktor keberhasilan di seluruh fase:**

- **Libatkan planner sejak hari pertama.** APS yang tidak dipercaya planner akan dilewati, dan lembar Excel tetap digunakan.
- **Tetapkan aturan perencanaan sebelum perangkat lunak.** Siapa yang boleh mengubah prioritas? Berapa lama frozen zone? Aturan apa yang mengatur rilis?
- **Mulai kecil, belajar cepat.** Pilot di bottleneck menunjukkan dalam hitungan minggu apakah data dan model memadai.
- **Ukur keberhasilan.** Tanpa baseline, nilai tidak dapat dibuktikan dan diskusi proyek berubah menjadi opini.
- **Libatkan lantai produksi.** Sebuah jadwal hanya berguna jika sampai ke lantai produksi sebagai tugas dan konfirmasi kembali mengalir. Untuk rutinitas harian yang membuat hal itu berjalan, lihat panduan [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 16. Kesalahan umum dan cara menghindarinya

| Kesalahan | Akibat | Lebih baik |
|---|---|---|
| APS sebagai pengganti perbaikan proses | proses yang tidak stabil hanya dijadwalkan dengan lebih presisi | stabilkan setup, kerusakan, dan rilis terlebih dahulu, jadwalkan secara paralel |
| Memodelkan semua kendala sekaligus | proyek molor, model menjadi sulit dipahami | mulai dengan kendala yang berpengaruh pada bottleneck |
| Mengambil waktu standar dari costing | jadwal secara sistematis terlalu optimistis atau terlalu pesimistis | gunakan data realisasi dari konfirmasi dan perbarui secara berkala |
| Menjadwalkan setiap sumber daya pada utilisasi maksimum | antrean panjang, lead time tidak stabil | isi penuh bottleneck, sisakan slack di non-bottleneck |
| Tidak ada frozen horizon | penjadwalan ulang terus-menerus, kegelisahan di lantai produksi | tentukan frozen zone, misalnya 1 sampai 3 shift ke depan |
| Rilis tanpa batas WIP | sindrom lead time, penumpukan persediaan | rilis mengikuti bottleneck atau dalam batas WIP |
| Peningkatan lead time rencana secara menyeluruh saat pesanan terlambat | rilis lebih awal menaikkan WIP dan keterlambatan | atasi penyebab di bottleneck, kendalikan rilis |
| Objektif belum disepakati | penjualan, produksi, dan logistik menilai jadwal secara berbeda | sepakati dan dokumentasikan bobot objektif bersama |
| Planner tidak dilibatkan | sistem dilewati, shadow scheduling tetap berjalan | libatkan planner dalam seleksi, pemodelan, dan pilot |
| Konfirmasi hanya di akhir shift | APS menjadwalkan berdasarkan kondisi yang sudah usang | konfirmasi tepat waktu per operasi |
| Keberhasilan tidak diukur | nilai tetap sekadar klaim | kumpulkan baseline sebelum go-live |
| Optimisasi black-box | planner tidak memahami atau mempercayai jadwal | pilih sistem dengan keputusan penjadwalan yang dapat dijelaskan |

**Quick wins tanpa perangkat lunak baru:** Jika Anda ingin mulai besok, lima langkah berikut tidak memerlukan investasi:

1. Selama delapan minggu terakhir, bandingkan beban dan kapasitas setiap sumber daya, lalu tentukan bottleneck-nya.
2. Hitung WIP dan gunakan Hukum Little untuk menghitung rata-rata lead time. Jika hasilnya jauh berbeda dari lead time rencana di ERP, Anda akan tahu mengapa tanggal tidak terpenuhi.
3. Tetapkan aturan rilis: pesanan baru hanya masuk ke lantai produksi ketika antrean di depan bottleneck berada di bawah batas yang ditentukan.
4. Di bottleneck, prioritaskan berdasarkan tanggal jatuh tempo dan keluarga setup, bukan berdasarkan siapa yang paling keras berteriak.
5. Periksa standar dan waktu setup di bottleneck terhadap data aktual, lalu koreksi penyimpangan terbesar.

## 17. Bukti: apa yang dilaporkan studi dan pengguna

**Theory of Constraints dalam literatur:** Victoria Mabin dan Steven Balderstone menganalisis lebih dari 80 penerapan TOC yang berhasil, dengan hasil kuantitatif yang dilaporkan dalam literatur [5]. Menurut ringkasan Roberto Panizzolo, kasus-kasus tersebut melaporkan rata-rata peningkatan 70% pada lead time dari pesanan hingga pengiriman, 65% pada cycle time manufaktur, 49% pada persediaan, 63% pada throughput atau pendapatan, dan 44% pada kinerja ketepatan tanggal jatuh tempo [6]. Baca angka-angka ini dengan hati-hati: hanya kisah sukses yang sudah dipublikasikan yang dianalisis, dan tidak ada kegagalan yang ditemukan dalam literatur [5]. Ini adalah seleksi positif, bukan rata-rata yang diharapkan dari suatu penerapan. Arah hasilnya tetap konsisten dengan Hukum Little dan kurva operasi: WIP yang lebih sedikit dengan bottleneck yang terlindungi berarti lead time yang lebih pendek.

**Laporan pengguna dari vendor APS:** Vendor mempublikasikan banyak contoh kasus. Vendor MES asal Jerman MPDV, misalnya, melaporkan untuk pelanggannya VACOM, yang menjadwalkan sekitar 1.200 pesanan dengan hingga 20 operasi masing-masing, penghematan waktu perencanaan sekitar 50% [30]. Angka-angka seperti ini adalah klaim vendor tanpa metode pengukuran yang diungkapkan. Angka tersebut menunjukkan efek apa saja yang mungkin terjadi, tetapi tidak menggantikan pilot dengan data Anda sendiri. Hal yang sama berlaku untuk angka studi kasus di halaman vendor AS yang muncul di peringkat untuk "production scheduling software."

**Dirgantara sebagai kasus ekstrem:** Manufaktur dirgantara menggabungkan lead time yang panjang, zona perakitan dengan ruang lantai yang terbatas, persyaratan keahlian dan sertifikasi, serta ketertelusuran penuh. Penjadwalan di sana harus melindungi bukan hanya tanggal, tetapi juga catatan. Persyaratan lead time dan ketertelusuran dijelaskan dalam postingan [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/). Panduan lengkap: [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

**Apa yang dapat digeneralisasi:** Di seluruh studi dan laporan, ada tiga pola yang berulang. Pertama, sebagian besar manfaat berasal bukan dari algoritma, melainkan dari transparansi mengenai kapasitas dan bottleneck. Kedua, batas WIP dan rilis terkendali bekerja dengan cepat dan murah. Ketiga, apakah hasilnya bertahan bergantung pada apakah konfirmasi di lantai produksi serta perbandingan rencana dengan aktual tetap berjalan.

## 18. Perencanaan berbasis kendala dengan iFAKT Polaris

> **Catatan: Penulis bekerja di iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), yang berkantor pusat di Stuttgart, Jerman, mengembangkan rangkaian perangkat lunak [iFAKT Polaris](https://www.m365.fm/entity/polaris/). Menurut situs web perusahaan, Polaris menghubungkan data ERP dengan kembaran digital (digital twin) produksi, dan mencantumkan sebagai fungsi perencanaan berbasis kendala (sumber daya, keterampilan, shift, buffer), simulasi what-if untuk gangguan dan perubahan bauran produk, serta KPI cockpit dengan lead time, WIP, utilisasi, dan ketepatan waktu [28]. Situs web tersebut menyebut industri dirgantara, otomotif, mesin dan otomasi, serta energi dan infrastruktur [28]. Dua modul relevan dengan topik panduan ini:

**[Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/)**, menurut halaman vendor, membuat jadwal produksi yang dioptimalkan dan dapat dijalankan dari data ERP, ketersediaan sumber daya, serta kendala operasional [26]. Kemampuan yang tercantum:

- penjadwalan otomatis mesin, karyawan, dan alat dengan mempertimbangkan shift, zona, keterampilan, dan kapasitas
- deteksi bottleneck, prioritas order, serta visibilitas order terlambat dan risiko pengiriman
- analisis dampak dan optimasi ulang setelah gangguan, termasuk berdasarkan umpan balik dari lantai produksi
- modul optimasi ukuran lot yang menentukan ukuran lot per varian dan mesin, urutan yang dioptimalkan untuk setup, serta tingkat persediaan yang menyeimbangkan biaya penyimpanan dengan kesiapan pengiriman
- dukungan untuk perencanaan operasional jangka pendek dan prakiraan kapasitas jangka panjang

**[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)**, menurut halaman vendor, mengambil jadwal yang telah dioptimalkan dan menyampaikannya sebagai tugas berbasis waktu kepada pekerja dan pengawas shift di lantai produksi [27]. Yang tercantum adalah tampilan tugas individual per pekerja, visibilitas jalur kritis bagi pengawas shift, instruksi kerja yang disematkan dalam tugas, opsi untuk menjeda, memblokir, atau menandai tugas dengan umpan balik terstruktur, serta gambaran WIP langsung bagi perencana. Umpan balik tentang kemajuan, keterlambatan, dan gangguan kembali masuk ke perencanaan [27].

Fungsi-fungsi yang diuraikan tersebut dengan demikian menjawab dua hal yang dinilai kritis dalam panduan ini: penjadwalan terhadap kendala nyata (Bagian 5.2) dan lingkaran tertutup antara rencana, eksekusi, dan umpan balik (Bagian 6 dan 14). iFAKT GmbH menampilkan sertifikasi ISO 9001 dan ISO/IEC 27001 di situs webnya [27]. Halaman produk tidak memberikan jumlah pelanggan atau hasil terukur dengan metode yang diungkapkan [26][27]. Seluruh pernyataan kemampuan di atas adalah klaim vendor.

**Perspektif:** Polaris hanyalah salah satu dari banyak solusi di pasar. Evaluasilah seperti sistem lainnya dengan daftar periksa di Bagian 13.3 dan pilot menggunakan data Anda sendiri. Panduan khusus, [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/), sedang disiapkan.

## 19. Glosarium

| Istilah | Penjelasan |
|---|---|
| APS (advanced planning and scheduling) | perangkat lunak dan metode penjadwalan berdasarkan kapasitas terbatas dan ketersediaan material dengan optimasi |
| ATP (available to promise) | kuantitas yang dapat dijanjikan dari persediaan dan penerimaan yang direncanakan |
| Buffer management | pengendalian berdasarkan konsumsi buffer waktu pada zona (hijau, kuning, merah) |
| Changeover matrix | tabel waktu setup yang bergantung pada urutan antarvarian |
| CONWIP | pengendalian tarik dengan jumlah total order yang konstan dalam satu lini |
| CTP (capable to promise) | tanggal pengiriman yang dapat dicapai dengan mempertimbangkan material dan kapasitas |
| CRP (capacity requirements planning) | langkah perencanaan kapasitas dalam MRP II; menunjukkan beban tetapi tidak menyelesaikan kelebihan beban |
| Cycle time (Little's Law) | waktu yang dihabiskan sebuah order dalam sistem dari pelepasan hingga penyelesaian; lihat [Lead Time](https://www.m365.fm/entity/lead-time/) |
| Detailed scheduling | penjadwalan operasi individual pada sumber daya dengan urutan dan waktu (Jerman: *Feinplanung*) |
| Drum-buffer-rope (DBR) | pengendalian TOC: bottleneck menentukan ritme, buffer waktu melindunginya, dan pelepasan order dikaitkan dengannya |
| EOQ (economic order quantity) | rumus ukuran lot akar kuadrat dari Harris (1913); disebut rumus Andler dalam literatur Jerman |
| Finite capacity scheduling | penjadwalan yang tidak menjadwalkan kapasitas melebihi kapasitas yang tersedia (ISA-95) |
| Flow factor | rasio lead time terhadap waktu operasi |
| Frozen zone | horizon perencanaan beku yang tidak mengalami penjadwalan ulang lagi |
| Heijunka | perataan volume dan campuran produk dari waktu ke waktu |
| Lead time syndrome | lingkaran setan berupa lead time rencana yang makin panjang, pelepasan yang makin awal, WIP yang makin banyak, dan lead time yang makin panjang lagi |
| Little's Law | cycle time = WIP ÷ throughput |
| Lot size | kuantitas yang diproduksi tanpa gangguan oleh satu setup; lihat [Batch Size](https://www.m365.fm/entity/batch-size/) |
| MES (manufacturing execution system) | sistem untuk eksekusi, pengumpulan data, dan pengendalian lantai produksi (ISA-95 Level 3; VDI 5600) |
| MPS (master production schedule) | program produksi untuk produk jadi |
| MRP (material requirements planning) | perencanaan material melalui BOM explosion dengan lead time rencana |
| MRP II (manufacturing resource planning) | perluasan MRP dengan master scheduling, perencanaan kapasitas, dan perencanaan keuangan |
| OTIF (on time in full) | proporsi lini yang dikirim tepat waktu dan lengkap |
| PPC | production planning and control (Jerman: PPS) |
| Setup time | waktu untuk mengganti sumber daya dari satu order ke order berikutnya; lihat [Setup Time](https://www.m365.fm/entity/setup-time/) |
| Safety stock | persediaan yang disimpan untuk melindungi dari variasi permintaan dan lead time |
| Takt time | waktu tersedia ÷ permintaan pelanggan |
| Bottleneck (constraint) | sumber daya yang membatasi throughput seluruh sistem |
| TOC (theory of constraints) | pendekatan manajemen yang menyelaraskan sistem dengan kendalanya |
| WIP (work in process) | order yang sudah dilepaskan namun belum selesai di lantai produksi |

## 20. FAQ: Perangkat Lunak Penjadwalan Produksi dan APS

### Apa itu perangkat lunak penjadwalan produksi?

Perangkat lunak penjadwalan produksi menentukan operasi mana yang berjalan di mesin atau pusat kerja mana, dengan urutan apa dan pada waktu kapan. Alat yang baik menjadwalkan berdasarkan kapasitas terbatas (finite capacity) dan kendala nyata seperti shift, keterampilan, perkakas, dan setup yang bergantung pada urutan. Banyak alat yang dijual dengan nama ini sebenarnya adalah perencana proyek atau sumber daya; untuk manufaktur, periksa apakah alat tersebut memodelkan routing, setup, dan ketersediaan material.

### Apa itu sistem APS?

APS (advanced planning and scheduling) adalah perangkat lunak perencanaan yang menjadwalkan order manufaktur terhadap kapasitas mesin, tenaga kerja, dan perkakas yang terbatas, serta terhadap ketersediaan material. Sistem ini menghasilkan urutan dan tanggal yang layak dengan menggunakan heuristik dan optimisasi matematis.

### Apa perbedaan antara APS dan MRP?

MRP menghitung material apa yang dibutuhkan dan kapan, dengan menguraikan bill of material serta memundurkan waktu tunggu rencana yang tetap. Dalam bentuk dasarnya, MRP mengasumsikan kapasitas tak terbatas. APS menjadwalkan operasi terhadap kapasitas terbatas dan material secara bersamaan, sehingga tanggalnya layak dijalankan. MRP menjawab "apa yang kita butuhkan"; APS menjawab "apa yang benar-benar bisa kita buat, dan kapan."

### Apa perbedaan antara APS dan ERP? Apakah APS menggantikan ERP?

Tidak, APS tidak menggantikan ERP. ERP adalah sistem pencatatan utama untuk order, material, persediaan, dan keuangan. Logika perencanaannya (MRP) dalam bentuk dasarnya mengasumsikan kapasitas tak terbatas dan waktu tunggu yang tetap. APS menambahkan penjadwalan terhadap kapasitas dan kendala nyata, lalu mengembalikan tanggal yang realistis ke ERP.

### Apa perbedaan antara APS dan MES?

APS merencanakan apa yang harus berjalan kapan dan pada sumber daya mana. MES mengendalikan dan mencatat eksekusi secara real time. ISA-95 menempatkan jadwal kerja dan eksekusinya dalam manajemen operasi manufaktur (Level 3) [31], dan VDI 5600 Jerman mencantumkan penjadwalan terperinci sebagai tugas MES [15]. Dalam praktiknya, penjadwalan dilakukan oleh modul MES atau oleh APS mandiri yang bertukar data dengan MES.

### Apa perbedaan antara perencanaan produksi dan penjadwalan produksi?

Perencanaan bekerja dengan kuantitas agregat, periode mingguan atau bulanan, serta kelompok pusat kerja untuk menetapkan program dan kebutuhan material. Penjadwalan menugaskan operasi individual ke sumber daya dengan urutan dan waktu mulai, biasanya dalam satuan jam atau shift.

### Apa saja jenis penjadwalan produksi?

Pembedaan yang paling berguna adalah penjadwalan kapasitas terbatas (finite) versus tak terbatas (infinite), serta arah penjadwalan: forward scheduling (mulai paling awal, selesai paling awal), backward scheduling (dari tanggal jatuh tempo, mulai paling akhir), dan penjadwalan berbasis bottleneck (memuat bottleneck terlebih dahulu, lalu menjadwalkan proses hulu secara mundur dan proses hilir secara maju).

### Apakah Excel cukup untuk penjadwalan produksi?

Kadang-kadang. Dengan order yang sedikit, setup yang hampir tidak bergantung pada urutan, dan bottleneck yang stabil, spreadsheet atau papan penjadwalan ditambah pengendalian bottleneck yang disiplin (DBR) sering sudah memadai. Perangkat lunak menjadi diperlukan ketika jumlah kendala dan penjadwalan ulang melampaui kemampuan perencanaan manual untuk ditangani secara andal; tabel kendala di Bagian 5.2 membantu Anda menilai hal ini.

### Kapan APS memberikan manfaat?

Biasanya ketika beberapa hal berikut berlaku: banyak operasi per order, setup yang bergantung pada urutan, shift atau beberapa bottleneck yang bergantian, tenaga kerja terampil yang terbatas, order mendesak yang sering datang, upaya penjadwalan ulang yang besar, dan ketepatan pengiriman yang mengecewakan meskipun persediaan tinggi. Tidak ada ambang ukuran perusahaan yang berlaku umum.

### Apakah APS cocok untuk produsen kecil dan menengah?

Ya. Kompleksitas perencanaan lebih penting daripada ukuran perusahaan. Bagi produsen kecil dan menengah, sistem dengan konektor ERP standar, konfigurasi tanpa kode khusus, dan awal bertahap yang dimulai dari bottleneck adalah pilihan yang tepat.

### Berapa biaya perangkat lunak penjadwalan produksi?

Tidak ada acuan harga publik yang andal. Alat sederhana dijual sebagai langganan per pengguna; sebagian besar vendor APS memberikan penawaran berdasarkan pabrik, sumber daya, dan lingkup. Anggarkan total biaya kepemilikan selama lima tahun, termasuk pembersihan data, integrasi, pelatihan, dan upaya internal, serta minta setiap vendor memberikan penawaran untuk lingkup yang sama.

### Bagaimana cara menemukan bottleneck di pabrik saya?

Untuk setiap sumber daya, bandingkan beban rencana termasuk setup dengan kapasitas yang tersedia selama beberapa minggu, pantau di mana antrean terbentuk secara permanen, dan periksa sumber daya mana yang membuat area hilir menganggur. Bottleneck juga bisa berupa orang, stasiun inspeksi, atau alat, dan posisinya berpindah ketika bauran produk berubah.

### Apa itu drum-buffer-rope dengan bahasa sederhana?

Bottleneck adalah drum yang menentukan ritme. Buffer waktu di depannya melindunginya dari gangguan. Rope mengikat pelepasan material dengan jadwal bottleneck sehingga tidak ada pekerjaan yang masuk ke lantai produksi melebihi kemampuan bottleneck untuk memprosesnya [2].

### Bagaimana cara mengurangi lead time manufaktur?

Tuas tercepat biasanya adalah membatasi WIP, karena menurut Little's Law lead time turun sebanding dengan WIP pada throughput yang konstan [9]. Tuas lainnya adalah lot yang lebih kecil dengan setup yang singkat, variabilitas yang lebih rendah, dan menjaga utilisasi non-bottleneck di bawah titik ketika antrean membengkak secara tajam.

### Bagaimana cara meningkatkan on-time delivery?

Jadwalkan berdasarkan kapasitas terbatas agar tanggal yang dijanjikan dapat dipenuhi, kendalikan pelepasan di bottleneck, prioritaskan pekerjaan harian berdasarkan status buffer, dan analisis penyebab pesanan terlambat secara sistematis. Ukur kinerja pengiriman secara konsisten, misalnya sebagai OTIF terhadap tanggal yang dikonfirmasi.

### Bagaimana cara menghitung economic order quantity?

Rumus EOQ klasik adalah Q* = √(2 × permintaan tahunan × biaya setup atau pemesanan per lot ÷ biaya penyimpanan per unit per tahun). Dengan permintaan 12.000 unit, biaya setup $300 dan biaya penyimpanan $8, hasilnya sekitar 949 unit. Rumus ini mengabaikan kapasitas dan urutan produksi, dan hanya merupakan nilai awal.

### Bagaimana cara menghitung safety stock?

Dengan permintaan yang bervariasi dan lead time yang konstan: SS = z × σ_D × √L. Dengan simpangan baku 30 unit per hari, lead time 9 hari, dan cycle service level 95% (z = 1,645), diperoleh sekitar 148 unit. Jika lead time juga bervariasi, nilainya naik tajam.

### Dapatkah AI mengambil alih penjadwalan produksi?

AI meningkatkan prediksi waktu proses dan waktu setup, mendeteksi pola gangguan, dan mempercepat pencarian jadwal yang baik. AI tidak menggantikan data master yang bersih atau kesepakatan tentang tujuan dan aturan. Tanpa data konfirmasi yang andal, AI juga belajar dari data yang buruk.

### Berapa lama implementasi APS?

Hal ini bergantung terutama pada kualitas data, besarnya upaya integrasi, dan cakupan. Pilot di area bottleneck dapat berjalan dalam beberapa bulan; penerapan penuh di beberapa area membutuhkan waktu lebih lama. Belum ada studi independen yang kuat tentang waktu implementasi yang khas.

### Apakah APS menggantikan perencana produksi?

Tidak. APS mengambil alih perhitungan, bukan keputusan. Perencana menetapkan prioritas, memelihara aturan dan data, menangani pengecualian, dan memutuskan di antara skenario. Dalam penerapan yang berhasil, perencana menghabiskan lebih sedikit waktu untuk menyusun ulang jadwal dan lebih banyak waktu untuk menangani penyebab keterlambatan.

## 21. Kesimpulan

Jadwal produksi jarang gagal karena perencana tidak cukup berusaha. Jadwal gagal karena logika perencanaannya mengasumsikan kapasitas tak terbatas dan waktu tunggu yang tetap. Fisika pabrik sudah jelas: waktu tunggu mengikuti WIP dan throughput, antrean meledak pada utilisasi tinggi, dan bottleneck menentukan apa yang bisa dikirim pabrik.

APS menjawab persis masalah itu. Ia menjadwalkan berdasarkan kapasitas terbatas dan kendala nyata, membuat tanggal pengiriman dapat dihitung, serta menunjukkan konsekuensi gangguan dan pesanan mendesak sebelum semuanya terjadi. APS hanya memberikan hasil bersama tiga hal yang tidak dapat disediakan perangkat lunak mana pun: fokus yang jelas pada bottleneck, pelepasan pesanan yang terkendali, dan data master serta konfirmasi yang sesuai dengan kenyataan.

Jadi, mulailah dengan urutan sederhana: identifikasi bottleneck, ukur dan batasi WIP, bersihkan data bottleneck, lalu uji perangkat lunak penjadwalan produksi dengan kemampuan APS dalam pilot menggunakan data Anda sendiri. Dengan begitu, jadwal bayangan Excel tidak digantikan oleh kotak hitam baru, melainkan oleh jadwal yang dapat dipercaya produksi, penjualan, dan pelanggan.

## Bacaan lanjutan di m365.fm

**Posts**

- [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/)
- [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)

**Entity pages**

[Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Buffer Management](https://www.m365.fm/entity/buffer-management/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Line Balancing](https://www.m365.fm/entity/line-balancing/) · [Batch Size](https://www.m365.fm/entity/batch-size/) · [Safety Stock](https://www.m365.fm/entity/safety-stock/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [iFAKT](https://www.m365.fm/entity/ifakt/)

**Related guides**

- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** adalah pembawa acara m365.fm dan bekerja di iFAKT GmbH. Di m365.fm, ia menulis tentang perencanaan dan penjadwalan produksi, manufaktur ramping (lean manufacturing), dan transformasi digital di bidang manufaktur. Di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), pengembang [iFAKT Polaris](https://www.m365.fm/entity/polaris/), ia bekerja pada bagaimana perencanaan berbasis kendala, digital twin, dan umpan balik dari lantai produksi saling terkait agar jadwal tetap berjalan di lantai produksi.

**Catatan: Penulis bekerja di iFAKT GmbH.**

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
