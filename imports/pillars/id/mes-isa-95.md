# SEO metadata

| Field | Value |
|---|---|
| Meta title | Manufacturing Execution System (MES) & ISA-95: Leitfaden |
| Meta description | Was ein Manufacturing Execution System leistet, wie ISA-95-Ebenen und Aktivitätsmodelle es einordnen, MES vs. ERP vs. SCADA, Anbieter-Checkliste, Roadmap und ROI. |
| Slug | `mes-isa-95` |

# Manufacturing Execution System (MES) und ISA-95: Funktionen, Ebenen, Auswahl und ROI

> **Jawaban singkat:** Manufacturing execution system (MES) adalah lapisan perangkat lunak yang mengelola, memantau, dan mencatat pelaksanaan pesanan produksi di lantai produksi secara real time, berada di antara sistem ERP yang merencanakan dan sistem kendali yang menjalankan mesin [8]. ISA-95 (ANSI/ISA-95, secara internasional IEC 62264) adalah standar yang menentukan letak lapisan ini (Level 3, manajemen operasi manufaktur), aktivitas apa yang dicakupnya, dan informasi apa yang dipertukarkannya dengan ERP [1][3].

> **Poin-poin utama**
> - Gartner mendefinisikan MES sebagai perangkat lunak berorientasi produksi yang "mengelola, memantau, dan menyinkronkan pelaksanaan proses fisik secara real-time" serta mengoordinasikan pesanan kerja dengan sistem penjadwalan, ERP, PLM, dan kualitas [8].
> - ISA-95 terdiri atas delapan bagian. Bagian 1 (model dan terminologi) diterbitkan ulang pada 2025; Bagian 3 (model aktivitas) berasal dari 2013 [1][2].
> - ISA-95 menjelaskan lima level. Level 0 hingga 2 adalah proses fisik dan kendalinya, Level 3 adalah manajemen operasi manufaktur (MES dan sistem terkait), Level 4 adalah perencanaan bisnis dan logistik (ERP) [1].
> - Model aktivitas Bagian 3 membagi Level 3 menjadi empat kategori (produksi, pemeliharaan, uji kualitas, persediaan) dan mengulang delapan aktivitas yang sama di tiap kategori: manajemen definisi, manajemen sumber daya, penjadwalan rinci, dispatching, manajemen eksekusi, pengumpulan data, pelacakan, dan analisis kinerja [3].
> - Model MESA International tahun 1997 menyebutkan 11 fungsi MES; ISA-95 kemudian mengadopsi pemikiran tersebut [9][12]. MESA berhenti beroperasi pada 30 Juni 2026, dan isinya diserahkan ke ISA [11].
> - Unified namespace (UNS) mengubah cara data bergerak; ia tidak menggantikan logika MES maupun kosakata ISA-95.
> - Business case MES biasanya bergantung pada satu atau dua jalur manfaat. Dalam contoh perhitungan di bawah, proyek yang sama memiliki NPV lima tahun yang positif pada kasus dasar dan negatif pada kasus konservatif.
> - Mulailah dari model data dan satu value stream, bukan dari daftar fitur lengkap.

## Daftar isi

1. [Apa itu manufacturing execution system (MES)?](#apa-itu-manufacturing-execution-system-mes)
2. [Sejarah singkat: dari AMR dan MESA-11 hingga ISA-95 dan seterusnya](#sejarah-singkat-dari-amr-dan-mesa-11-hingga-isa-95-dan-seterusnya)
3. [ISA-95 dijelaskan: standar, bagian, dan levelnya](#isa-95-dijelaskan-standar-bagian-dan-levelnya)
4. [Model ISA-95 yang penting untuk proyek MES](#model-isa-95-yang-penting-untuk-proyek-mes)
5. [MES vs. ERP vs. MOM vs. SCADA dan sistem pabrik lainnya](#mes-vs-erp-vs-mom-vs-scada-dan-sistem-pabrik-lainnya)
6. [Fungsi MES secara rinci](#fungsi-mes-secara-rinci)
7. [Integrasi: B2MML, OPC UA, MTConnect, dan unified namespace](#integrasi-b2mml-opc-ua-mtconnect-dan-unified-namespace)
8. [MES di industri yang diatur](#mes-di-industri-yang-diatur)
9. [Opsi penerapan dan arsitektur: suite, platform, modul ERP, cloud](#opsi-penerapan-dan-arsitektur)
10. [Bangun vs. beli](#bangun-vs-beli)
11. [Daftar periksa pemilihan vendor MES](#daftar-periksa-pemilihan-vendor-mes)
12. [Peta jalan implementasi MES](#peta-jalan-implementasi-mes)
13. [Biaya dan ROI MES dengan contoh perhitungan](#biaya-dan-roi-mes-dengan-contoh-perhitungan)
14. [KPI MES: apa yang diukur dan bagaimana](#kpi-mes-apa-yang-diukur-dan-bagaimana)
15. [Orang dan lantai produksi](#orang-dan-lantai-produksi)
16. [Kesalahan umum implementasi MES](#kesalahan-umum-implementasi-mes)
17. [Batasan MES dan ISA-95](#batasan-mes-dan-isa-95)
18. [Glosarium](#glosarium)
19. [FAQ](#faq)
20. [Kesimpulan dan langkah pertama](#kesimpulan-dan-langkah-pertama)

## Apa itu manufacturing execution system (MES)?

Manufacturing execution system adalah perangkat lunak yang mengubah perintah produksi menjadi barang jadi yang terdokumentasi. ERP memberi tahu pabrik *apa* yang harus dibuat, berapa jumlahnya dan kapan harus selesai. Mesin dan pengendalinya membuat komponennya. MES berada di tengah: ia melepaskan dan mengurutkan pekerjaan, memberi tahu operator dan mesin apa yang harus dikerjakan berikutnya, mengumpulkan apa yang benar-benar terjadi (jumlah, waktu, parameter, material, cacat, siapa yang mengerjakan) dan melaporkan hasilnya kembali.

Definisi pasar dari Gartner merupakan titik acuan yang baik karena netral terhadap vendor dan presisi. Gartner menyebut MES sebagai "kelas khusus perangkat lunak yang berorientasi produksi" yang "mengelola, memantau dan menyinkronkan eksekusi proses fisik secara real-time yang terlibat dalam mengubah bahan baku menjadi barang setengah jadi dan/atau barang jadi." Gartner menambahkan bahwa sistem ini mengoordinasikan perintah kerja dengan penjadwalan produksi dan dengan sistem perusahaan seperti ERP, product lifecycle management dan quality management, serta memberikan umpan balik tentang kinerja proses dan mendukung ketertelusuran dan genealogi hingga level komponen dan material [8].

### Gagasan inti dalam satu kalimat

MES menutup lingkaran antara rencana dan kenyataan, shift demi shift, sehingga semua pihak dari operator hingga pengendali bekerja dari catatan yang sama dan tepat waktu tentang apa yang terjadi di lantai produksi.

### Apa yang dilakukan MES dalam satu shift tipikal

Gambaran konkret lebih membantu daripada daftar fitur. Ambil contoh sebuah pabrik menengah yang memesin dan merakit katup hidrolik pada empat lini:

1. **06.00, awal shift.** MES menampilkan kepada supervisor daftar dispatch untuk Lini 2: dua belas perintah yang dirilis dari ERP, diurutkan oleh penjadwal untuk meminimalkan pergantian. Dua perintah ditandai karena sebuah gauge sudah melewati jadwal kalibrasi.
2. **06.10.** Operator memindai traveler perintah pertama (atau memilihnya di terminal). MES memeriksa bahwa operator berkualifikasi untuk operasi ini, bahwa versi program pada CNC sesuai dengan routing yang dirilis dan bahwa lot bahan baku di rak termasuk dalam perintah tersebut. MES menampilkan revisi instruksi kerja terkini.
3. **06.12 hingga 13.30.** Mesin melaporkan siklus dan status (berjalan, idle, alarm) melalui OPC UA atau MTConnect. MES menghitung part yang baik dan yang ditolak, mencatat downtime dan meminta operator memberikan kode alasan ketika berhenti lebih dari dua menit. Pengukuran dalam proses masuk ke grafik SPC; titik yang berada di luar kendali menghentikan operasi berikutnya hingga teknisi menyetujuinya.
4. **11.45.** Sebuah lot seal ternyata mencurigakan. Karena MES mencatat lot mana yang masuk ke nomor seri katup yang mana, bagian quality dapat mengisolasi 140 katup alih-alih seluruh produksi satu minggu.
5. **14.00, serah terima shift.** MES melaporkan jumlah, scrap, OEE dan isu terbuka kepada shift berikutnya, serta memposting jumlah yang telah dikonfirmasi dan konsumsi material ke ERP.

Tanpa MES, sebagian besar kegiatan ini dilakukan dengan traveler kertas, papan tulis dan spreadsheet, lalu diketik ke ERP berjam-jam atau berhari-hari kemudian. Cara ini berfungsi, sampai batas tertentu. Biayanya muncul dalam bentuk data yang terlambat atau keliru, penarikan produk yang lambat, quality escape dan investigasi yang panjang. Pembahasan mendalam tentang [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) membahas langkah dari traveler kertas ke instruksi kerja digital, yang sering kali menjadi modul MES pertama yang digunakan pabrik.

### Posisi MES di antara sistem pabrik

ISA-95 menempatkan MES pada **Level 3**, manufacturing operations management, di antara perencanaan bisnis dan logistik pada Level 4 (ERP) serta lapisan kendali pada Level 0 hingga 2 (sensor, PLC, DCS, SCADA) [1]. Level 3 bukan satu sistem. Lapisan yang sama memuat laboratory information management (LIMS), warehouse management (WMS), maintenance management (CMMS) dan lainnya; bersama-sama sering disebut manufacturing operations management systems [14]. Bagian 5 membandingkannya.

### Manfaat MES, dan apa kata bukti

Sebagian besar halaman MES mencantumkan manfaat dengan persentase yang mengesankan tanpa sumber. Berikut hal-hal yang dapat dinyatakan dengan hati-hati:

| Manfaat | Mekanisme | Yang diukur | Catatan |
|---|---|---|---|
| Data produksi lebih cepat dan akurat | Data ditangkap di sumbernya, tidak diketik ulang | Latensi data, entri manual per pesanan | Hanya jika master data (routing, BOM) benar |
| Waktu siklus lebih singkat | Lebih sedikit menunggu dokumen, rilis dan pengiriman lebih cepat | Lead time pesanan, waktu antre | *Control Engineering* melaporkan bahwa MESA International menempatkan rata-rata pengurangan waktu siklus manufaktur pada 45 persen; anggap ini sebagai klaim asosiasi, bukan tolok ukur [9] |
| Lebih sedikit lolos kualitas | Pemeriksaan wajib, SPC, interlock sebelum langkah berikutnya | First pass yield, keluhan pelanggan | Bergantung pada apakah pemeriksaan benar-benar dikonfigurasi sebagai penghenti keras |
| Penarikan produk (recall) lebih cepat dan lebih sempit | Genealogi lot dan serial | Waktu untuk mengidentifikasi unit terdampak | Memerlukan pemindaian material yang disiplin |
| OEE lebih tinggi pada constraint | Alasan downtime yang terlihat, respons lebih cepat | OEE, MTTR | Hanya bernilai uang jika output tambahan dapat dijual |
| Kesiapan audit | Catatan elektronik, jejak audit, tanda tangan elektronik | Jam per audit, temuan | Upaya validasi di industri yang diatur cukup besar |

Artikel *Automation World* tahun 2006 melaporkan bahwa lebih dari 40 produsen global telah menggunakan ISA-95 untuk menentukan persyaratan MES mereka, dan bahwa waktu untuk mendefinisikan persyaratan turun dari beberapa bulan menjadi empat hingga enam minggu [10]. Itu merupakan efek yang sederhana dan masuk akal dari kosakata bersama, dan alasan yang baik untuk membaca bagian-bagian berikutnya sebelum menulis dokumen persyaratan.

## Sejarah singkat: dari AMR dan MESA-11 ke ISA-95 dan seterusnya

Sejarah ini menjelaskan mengapa vendor, analis, dan standar menggunakan kata-kata yang sedikit berbeda untuk hal yang sama.

### Awal 1990-an: istilah MES

Menurut *Automation World*, firma analis Boston AMR Research memperkenalkan konsep MES pada 1992 sebagai lapisan di antara sistem perusahaan dan sistem kontrol, yang menyediakan visibilitas dan kendali [10]. Pabrik sebelumnya telah menggunakan shop floor control, pengumpulan data, dan sistem kualitas, yang sering dibangun secara internal untuk satu tujuan saja; fungsinya saling tumpang tindih dan jarang saling terhubung [14].

### 1997: MESA-11

MESA International (Manufacturing Enterprise Solutions Association) menerbitkan white paper tentang MES pada 1997 [15] dan bersamanya model fungsional yang dikenal sebagai **MESA-11** [12]. Sebelas fungsi tersebut adalah [9]:

1. Alokasi dan status sumber daya
2. Penjadwalan operasi/detail
3. Dispatching unit produksi
4. Pengendalian dokumen
5. Akuisisi data
6. Manajemen tenaga kerja
7. Manajemen kualitas
8. Manajemen proses
9. Manajemen pemeliharaan
10. Pelacakan produk dan genealogi
11. Analisis kinerja

Definisi MESA tahun 1997 menekankan bahwa MES harus "menyampaikan informasi yang memungkinkan optimalisasi kegiatan produksi," rumusan yang oleh *Automation World* pada 2006 masih dianggap praktis [10]. Beberapa dari sebelas fungsi (pemeliharaan, tenaga kerja, pengendalian dokumen) kini sering ditangani oleh sistem terpisah, itulah sebabnya model ini dikritik sebagai "terlalu luas" bahkan pada masanya [9].

### 2000 hingga 2013: ISA-95

Komite ISA95 membangun di atas Purdue Reference Model untuk computer integrated manufacturing [1]. Bagian 1 terbit pada 2000 dan Bagian 3, dengan model aktivitas Level 3, pada 2005; sumber sekunder menggambarkan ISA-95 sebagai penggabungan pandangan fungsional MESA dengan hierarki Purdue [12][14]. Bagian-bagian lain menyusul hingga 2020, dan Bagian 1 diterbitkan ulang pada 2025 [1][2]. Bagian 3 mencantumkannya.

### Sejak 2004: MOM, MES kolaboratif, dan model-model berikutnya

Karena ISA-95 menamai Level 3 "manufacturing operations management," istilah MOM menjadi umum untuk cakupan yang lebih luas (produksi plus operasi kualitas, pemeliharaan, dan inventaris), dengan MES sebagai inti produksinya [10]. MESA sendiri menerbitkan beberapa model lanjutan; artikel *Control Engineering* tentang model asli mencatat bahwa model itu adalah salah satu dari delapan model MESA pada saat itu [9]. Kami tidak dapat memverifikasi nama dan tahun model lanjutan MESA (sering dikutip sebagai c-MES pada 2004 dan model MESA 2008) dari sumber primer [unverified]. Halaman riwayat model MESA kini mengarahkan ke ISA, dan pengumuman MESA tahun 2022 tentang model terbarunya hanya menyebutkan bahwa MESA telah merilis "three (now four) MESA models" [43].

### 2026: MESA dibubarkan, ISA mengambil alih isinya

MESA International memutuskan untuk menghentikan operasinya efektif 30 Juni 2026; ISA menyatakan bahwa "konten dan program pendidikan MESA akan diambil alih oleh ISA" [11]. Hal ini penting dalam praktik karena MESA mengelola **B2MML**, implementasi XML dari ISA-95 yang digunakan dalam banyak antarmuka ERP-MES [5]. Periksa dengan ISA di mana skema B2MML dan versi mendatang akan dihosting sebelum Anda menetapkannya dalam kontrak. Per November 2026, skema B2MML dan BatchML masih dipublikasikan di repositori MESAInternational di GitHub, dan README-nya tidak menyebutkan pengalihan tersebut [36] [unverified: hosting di masa depan setelah pengalihan tidak didokumentasikan].

### Tahun 2020-an: IIoT, cloud, dan MES yang dapat disusun

Tiga pergeseran membentuk proyek MES saat ini: data mesin menjadi lebih murah untuk dikumpulkan (OPC UA, MTConnect, MQTT), penerapan cloud dan hibrida telah menjadi hal yang lazim, dan vendor semakin banyak menjual MES sebagai platform dari aplikasi-aplikasi yang lebih kecil alih-alih suite monolitik ("composable" atau MES "generasi berikutnya"). Bagian 9 membahas apa artinya hal itu bagi arsitektur dan kontrak Anda.

## ISA-95 dijelaskan: standar, bagian-bagiannya, dan levelnya

ISA menggambarkan ISA-95, "juga dikenal sebagai ANSI/ISA-95 atau IEC 62264," sebagai seperangkat standar internasional untuk mengintegrasikan sistem logistik dengan sistem kontrol manufaktur [1]. Standar ini mengatur teknologi dan proses bisnis ke dalam lapisan-lapisan yang didefinisikan oleh aktivitas yang berlangsung di sana, dan menjelaskan bagaimana sebuah perusahaan dapat membangun antarmuka di antara lapisan-lapisan tersebut. ISA menegaskan bahwa arsitektur, yang didasarkan pada model Purdue, dapat diterapkan "terlepas dari teknologi yang digunakan," dan bahwa hierarki peralatan berlaku untuk industri diskret, kontinu, dan logistik [1].

Dua konsekuensi mengikuti dari hal ini. Pertama, ISA-95 bersifat **netral terhadap teknologi**: standar ini tidak mengatakan apa pun tentang basis data, protokol, atau vendor yang Anda gunakan. Kedua, fokus utamanya adalah **antarmuka antara Level 3 dan Level 4** [1], yang persis menjadi titik di mana sebagian besar proyek MES tersendat (siapa yang memiliki routing, kapan kuantitas dianggap "terkonfirmasi," bagaimana scrap dicatat).

### ISA-95 dan IEC 62264: isi yang sama, penomoran berbeda

ISA mengembangkan seri ini sebagai ANSI/ISA-95; IEC menerbitkannya sebagai IEC 62264. Edisi 2025 untuk Bagian 1 memiliki penunjukan ANSI/ISA-95.00.01-2025 (IEC 62264-1 Mod), di mana "Mod" menandakan adopsi yang dimodifikasi [1][2]. Edisi-edisinya tidak selalu sinkron. IEC 62264-1 dan -2 diterbitkan pada 2013, Bagian 3 pada 2016, Bagian 4 pada 2015, dan Bagian 5 pada 2016 [7]; IEC 62264-6, model layanan pesan, muncul sebagai edisi 1.0 pada 26 Juni 2020 [6]. Ketika sebuah kontrak atau dokumen persyaratan mengutip "ISA-95," sebutkan bagian dan edisinya.

### Delapan bagian ISA-95

| Bagian | Judul (ANSI/ISA-95) | Edisi terkini menurut ISA | Cakupan dalam bahasa sederhana |
|---|---|---|---|
| 1 | Models and Terminology | 2025 (IEC 62264-1 Mod) | Cakupan operasi dan kontrol manufaktur, cara aset fisik diorganisasi, fungsi antarmuka, informasi bersama |
| 2 | Objects and Attributes for Enterprise-Control System Integration | 2018 | Objek dan atribut yang dipertukarkan pada antarmuka Level 3 / Level 4 |
| 3 | Activity Models of Manufacturing Operations Management | 2013 | Aktivitas di dalam Level 3 dan sebagian data yang mereka pertukarkan |
| 4 | Objects and Attributes for Manufacturing Operations Management Integration | 2018 | Model objek untuk informasi yang mengalir antara aktivitas Level 3, terlepas dari tingkat otomasi |
| 5 | Business-to-Manufacturing Transactions | 2018 | Transaksi antara Level 3 dan Level 4 (kata kerja seperti get, process, sync) |
| 6 | Messaging Service Model | 2014 | Pesan lintas Level 3 dan Level 4 serta di dalam Level 3 |
| 7 | Alias Service Model | 2017 | Pemetaan pengenal yang setara antara operasi manufaktur dan domain lain |
| 8 | Information Exchange Profiles | 2020 | Profil untuk antarmuka tertentu antara Level 4 dan Level 3 atau antara aktivitas Level 3 |

Sumber: halaman ISA-95 dari ISA [1]. Perhatikan bahwa ISA mencantumkan 2014 untuk Bagian 6 sementara edisi IEC untuk Bagian 6 berasal dari 2020 [6].
Untuk sebagian besar proyek MES, Bagian 1 sampai 3 melakukan pekerjaan berat: mereka memberi Anda kosakata, model level, dan model aktivitas yang Anda butuhkan untuk dokumen persyaratan. Bagian 2, 4, dan 5 penting ketika Anda merancang antarmuka dan model data. Bagian 6 sampai 8 terutama penting bagi arsitek integrasi dan vendor perangkat lunak.

### Apa yang berubah dalam edisi 2025 Bagian 1

ISA mengumumkan Bagian 1 yang baru pada 10 April 2025. Edisi ini memperbarui versi 2010, mencerminkan fungsi perusahaan yang spesifik, memperjelas batas antara domain perusahaan dan domain manufaktur/kontrol, serta meningkatkan konsistensi dengan bagian-bagian lainnya [2]. Ketua komite ISA95, Christian Monchinski, mengaitkannya dengan "arsitektur modular yang semakin meningkat di seluruh operasi bisnis dan manufaktur" serta pergeseran ke desain yang berpusat pada data, dan menyatakan bahwa pembaruan ini "menegaskan kembali pentingnya antarmuka integrasi yang terstandarisasi" [2]. Bagi praktisi, ini adalah sinyal: ISA-95 dimaksudkan tetap menjadi kosakata bersama untuk arsitektur modular dan berbasis peristiwa, bukan digantikan olehnya.

### Lima level ISA-95

ISA-95 mewarisi model level dari Purdue. Level-level tersebut menggambarkan *fungsi*, bukan komputer atau segmen jaringan [1][4].

| Level | Nama | Apa yang terjadi di sini (ringkasan kami) | Sistem tipikal | Kerangka waktu tipikal |
|---|---|---|---|---|
| 4 | Perencanaan dan logistik bisnis | Pesanan, kebutuhan material, persediaan, pengiriman, penghitungan biaya untuk pabrik | ERP, perencanaan rantai pasok | Bulan, minggu, hari [4] |
| 3 | Manajemen operasi manufaktur | Kontrol alur kerja dan resep untuk memproduksi produk akhir; penjadwalan rinci, dispatching, catatan, kualitas, pemeliharaan, dan operasi persediaan | MES, LIMS, WMS, CMMS, QMS, historian, APS (penjadwalan rinci) | Hari, shift, jam, menit, detik [4] |
| 2 | Pemantauan dan kontrol supervisi | Memantau dan mengendalikan proses fisik | SCADA, HMI, DCS, PLC | Respons real-time diukur dalam sub-detik [4] |
| 1 | Penginderaan dan manipulasi | Sensor, aktuator, perangkat pintar, katup | Perangkat lapangan | Tidak ditentukan dalam sumber yang digunakan di sini |
| 0 | Proses fisik | Mesin dan material yang sedang diolah | Mesin, lini, peralatan proses | Tidak berlaku |

Dua catatan. Halaman ISA sendiri menempatkan SCADA pada baris Level 3 sebagai contoh sistem Level 3 di samping MES [1], sedangkan ringkasan OPC Foundation menempatkan otomasi dan kontrol pada Level 1 dan 2, serta MOM pada Level 3 [4]. Dalam praktik, SCADA mencakup batas 2/3: layar dan penanganan alarmnya merupakan kontrol supervisi (Level 2), sementara fungsi historian dan pelaporannya sering melayani Level 3. Jangan memperdebatkan kotaknya; tentukan sistem mana yang menjadi sistem rujukan (system of record) untuk setiap data. Kedua, OPC Foundation menekankan bahwa "setiap level memiliki definisinya sendiri untuk real-time" [4]. MES yang memperbarui dasbor setiap 30 detik bersifat real-time bagi seorang supervisor, tetapi terlalu lambat untuk interlock mesin.

### Level bukan zona jaringan

Kesalahan yang umum adalah memperlakukan level ISA-95 dan level Purdue yang digunakan dalam keamanan OT sebagai hal yang sama. ISA-95 menggambarkan fungsi dan informasi; segmentasi jaringan mengikuti logika yang berbeda, yang kini diatur dalam ISA/IEC 62443 dengan zona dan conduit [23]. ISA mencatat bahwa ISA-95 mengandalkan model referensi Purdue untuk menggambarkan segmentasi jaringan dalam sistem kontrol industri [1], tetapi sebuah *fungsi* Level 3 dapat berjalan di tenant cloud, sedangkan sebuah *server* Level 3 di pabrik Anda berada dalam zona keamanan tertentu. Panduan [OT cybersecurity dan ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) membahas zona, conduit, dan DMZ; NIST SP 800-82 Rev. 3 adalah panduan AS untuk keamanan OT [24].

### Apakah ISA-95 masih relevan?

Jawaban ISA sendiri: level-level tersebut tetap membantu menggambarkan batas sistem untuk Industri 4.0 dan manufaktur cerdas, meskipun model ini berasal dari sebuah hierarki [1]. Itu sesuai dengan praktik. Hierarki sebagai *jalur data* (setiap nilai naik level demi level melalui antarmuka titik-ke-titik) sudah usang, dan bagian 7 menunjukkan alternatifnya. Hierarki sebagai *peta tanggung jawab dan kosakata* belum usang.

## Model ISA-95 yang penting untuk proyek MES

ISA-95 memuat beberapa model. Empat di antaranya perlu Anda ketahui namanya sebelum menulis dokumen kebutuhan MES.

### 1. Hierarki fungsional (level)

Sudah dibahas di atas. Gunakan untuk menggambar diagram konteks sistem dengan setiap sistem yang ada ditempatkan pada levelnya dan setiap antarmuka digambarkan sebagai panah berlabel.

### 2. Hierarki peralatan

ISA-95 mengatur fasilitas fisik pabrik ke dalam hierarki peralatan berbasis peran: **enterprise, site, area, work center, work unit** (nama yang digunakan oleh penjelasan umum dan oleh panduan saudara tentang Azure) [1][27]. Work center selanjutnya dikelompokkan jenisnya, misalnya sebagai process cell (batch), production unit (kontinu), production line (diskrit) dan storage zone, dengan work unit yang sesuai seperti unit, work cell dan storage unit. Model informasi ISA-95 dari OPC Foundation mencantumkan persis nama-nama level ini [32], dan draf publik Part 1 tahun 1999 menetapkan process cell dan unit untuk batch, production unit untuk kontinu, serta production line dan work cell untuk manufaktur diskrit [33]. Pemetaan OPC Foundation mencatat bahwa peralatan dapat disarangkan dan bahwa model ini menggambarkan *peran* yang dimainkan peralatan dalam produksi, terpisah dari aset fisik yang menyusunnya [5].

Mengapa ini penting: hierarki peralatan menjadi konvensi penamaan Anda di MES, historian, CMMS, topik unified namespace, dan platform data. Pabrik yang memberi nama mesin yang sama "L2-CNC3", "Line 2 Mazak", dan "WC-4711" di tiga sistem akan menanggung akibatnya pada setiap laporan dan setiap integrasi.

**Contoh hierarki untuk pabrik katup:**

| Level | Contoh |
|---|---|
| Enterprise | Acme Fluid Power |
| Site | Pabrik Dayton |
| Area | Machining; Assembly and test; Warehouse |
| Work center | Line 2 (production line); Test cell T1 (work cell group); Raw material store (storage zone) |
| Work unit | CNC 3; Wash station; Leak tester LT-1; Rack zone A |

### 3. Model objek (Part 2 dan Part 4)

ISA-95 menggambarkan informasi yang dipertukarkan antara ERP dan MES, serta antara aktivitas MES, sebagai model objek dengan atribut. Spesifikasi pendamping dari OPC Foundation menyebutkan empat model sumber daya yang dipertukarkan oleh sistem ERP dan MOM: **material** (termasuk properti material dan lot), **equipment** (sejauh berkaitan dengan operasi yang dilakukan), **physical assets** (aset yang menyusun peralatan), dan **personnel** (peran dan kualifikasi) [4][5]. Di sekitarnya, ISA-95 mengatur pertukaran ke dalam empat kategori informasi yang mencerminkan siklus hidup sebuah order: **product definition** (cara membuatnya), **production capability** (sumber daya apa yang tersedia), **production schedule** (apa yang dibuat, dan kapan), dan **production performance** (apa yang telah dibuat). Kategori-kategori ini sesuai dengan nama aktivitas Part 3 [3]; draf publik Part 1 tahun 1999 mengelompokkan schedule dan performance sebagai "production information" [33].

Aturan praktis dari model ini: ERP memiliki "apa dan kapan," MES memiliki "bagaimana dan apa yang benar-benar terjadi." Ketika ERP menyimpan routing dengan waktu operasi dan MES menyimpan definisi kerja yang lebih rinci dengan parameter dan instruksi, tentukan secara eksplisit mana yang menjadi master untuk atribut mana, dan bagaimana perubahan mengalir.

### 4. Model aktivitas (Part 3)

Ini adalah bagian ISA-95 yang paling berguna namun paling sedikit dijelaskan. Part 3 membagi manajemen operasi manufaktur ke dalam empat kategori: **production operations, maintenance operations, quality test operations dan inventory operations**. Di dalam setiap kategori, digunakan delapan aktivitas generik yang sama [3]:

| Aktivitas generik | Operasi produksi | Operasi pemeliharaan | Operasi uji kualitas | Operasi persediaan |
|---|---|---|---|---|
| Manajemen definisi | Manajemen definisi produk (routing, resep, instruksi kerja) | Manajemen definisi pemeliharaan (daftar tugas, prosedur) | Manajemen definisi uji kualitas (spesifikasi uji, rencana pengambilan sampel) | Manajemen definisi persediaan (aturan penyimpanan dan pemindahan) |
| Manajemen sumber daya | Manajemen sumber daya produksi (orang, peralatan, ketersediaan dan kualifikasi material) | Manajemen sumber daya pemeliharaan (teknisi, suku cadang, alat) | Manajemen sumber daya uji kualitas (peralatan laboratorium, analis) | Manajemen sumber daya persediaan (lokasi penyimpanan, peralatan penanganan material) |
| Penjadwalan detail | Penjadwalan produksi detail (urutan pada sumber daya) | Penjadwalan pemeliharaan detail | Penjadwalan uji kualitas detail | Penjadwalan persediaan detail (pemindahan, pengisian ulang) |
| Dispatching | Dispatching produksi (melepas pekerjaan ke stasiun) | Dispatching pemeliharaan (perintah kerja ke teknisi) | Dispatching uji kualitas (sampel ke laboratorium) | Dispatching persediaan (perintah transfer) |
| Manajemen eksekusi | Manajemen eksekusi produksi (memandu dan memverifikasi eksekusi) | Manajemen eksekusi pemeliharaan | Manajemen eksekusi uji kualitas | Manajemen eksekusi persediaan |
| Pengumpulan data | Pengumpulan data produksi (hitungan, waktu, parameter) | Pengumpulan data pemeliharaan (temuan, jam kerja, suku cadang) | Pengumpulan data uji kualitas (hasil) | Pengumpulan data persediaan (pergerakan, hitungan) |
| Pelacakan | Pelacakan produksi (WIP, genealogi, pelaporan ke ERP) | Pelacakan pemeliharaan (riwayat per aset) | Pelacakan uji kualitas (hasil per lot atau serial) | Pelacakan persediaan (lokasi dan status material) |
| Analisis kinerja | Analisis kinerja produksi (OEE, yield, waktu siklus) | Analisis kinerja pemeliharaan (MTBF, MTTR) | Analisis kinerja uji kualitas (kapabilitas, tren) | Analisis kinerja persediaan (perputaran, akurasi) |

Nama baris dan kolom mengikuti judul klausul ANSI/ISA-95.00.03-2013 (klausul 6 sampai 9) [3]; contoh dalam tanda kurung adalah buatan kami. *Automation World* merangkum pembagian yang sama sebagai "produksi, pemeliharaan, kualitas, dan persediaan" [13].

**Cara menggunakan matriks dalam proyek:** Cetak sebagai kisi 4 × 8. Untuk masing-masing dari 32 sel, tuliskan sistem mana yang melakukan ini saat ini (kertas, Excel, ERP, MES, CMMS, LIMS, WMS, tidak ada) dan sistem mana yang seharusnya melakukannya setelah proyek. Sel kosong dan sel dengan tiga sistem adalah bahan diskusi cakupan Anda. Hasil khas untuk pabrik diskrit: kolom produksi sebagian besar MES, kolom pemeliharaan berada di CMMS, uji kualitas dibagi antara MES (pemeriksaan dalam proses) dan LIMS atau QMS (uji laboratorium, CAPA), persediaan dibagi antara ERP (tingkat stok) dan WMS atau MES (pemindahan ke lini). Penjadwalan detail pada kolom produksi sering diserahkan ke APS (lihat [penjadwalan produksi dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/)).

### Catatan tentang ISA-88 dan VDI 5600

Dua kerangka kerja terkait sering muncul dalam proyek MES. **ISA-88** adalah standar kontrol batch; model kontrol prosedurnya (prosedur, unit prosedur, operasi, fase) diadopsi oleh IEC sebagai IEC 61512-1 [34] dan merupakan cara yang lazim untuk menyusun resep di farmasi, makanan, dan kimia. BatchML, pendamping B2MML, mengimplementasikan ISA-88 [36], dan banyak produk MES mengimplementasikan catatan batch elektronik di atasnya [unverified: observasi praktik]. **VDI 5600**, pedoman Asosiasi Insinyur Jerman (Bagian 1 tertanggal Oktober 2016), mencantumkan tugas MES dengan cara yang mirip dengan MESA-11 dan umum di pabrik-pabrik Jerman serta RFP dari perusahaan induk Jerman [21].

## MES vs. ERP vs. MOM vs. SCADA dan sistem pabrik lainnya

"Apa perbedaan antara MES dan ERP?" adalah salah satu pertanyaan MES yang paling umum, disusul MES vs. SCADA. Versi singkatnya: ERP merencanakan dan membukukan, MES mengeksekusi dan mencatat, SCADA mengawasi dan mengendalikan mesin. Versi lebih panjangnya memerlukan tabel, karena batasan antar sistem bergantung pada industri dan pada produk yang sudah Anda miliki.

### Tabel perbandingan

| Dimensi | ERP (Level 4) | MES (Level 3) | MOM (Level 3, lebih luas) | SCADA / HMI (Level 2, sebagian 3) | Historian |
|---|---|---|---|---|---|
| Pertanyaan utama | Apa yang harus kita buat, beli dan kirim, dan berapa biayanya? | Bagaimana tepatnya pesanan ini dibuat, dan apa yang sebenarnya terjadi? | Bagaimana produksi, kualitas, pemeliharaan dan operasi persediaan saling bekerja sama? | Apa yang dilakukan mesin atau proses saat ini, dan bagaimana saya mengendalikannya? | Berapa nilai proses dari waktu ke waktu? |
| Kerangka waktu | Bulan, minggu, hari [4] | Shift, jam, menit, detik [4] | Sama seperti MES | Sub-detik hingga detik [4] | Detik hingga tahun |
| Satuan kerja | Pesanan produksi, pesanan pembelian, pesanan penjualan | Operasi, langkah, lot, nomor seri | Pesanan plus pengujian, pesanan kerja pemeliharaan, pesanan pemindahan | Tag, alarm, setpoint | Tag deret waktu |
| Data khas | BOM, routing, biaya standar, stok, permintaan | Instruksi kerja, waktu dan kuantitas aktual, parameter, genealogi, cacat, persetujuan | Data MES plus hasil laboratorium, riwayat pemeliharaan, pergerakan material | Nilai langsung, alarm, perintah operator | Deret waktu terkompresi |
| Pengguna | Perencanaan, pembelian, keuangan, penjualan | Operator, supervisor, kualitas, insinyur proses | Manajemen pabrik, semua fungsi operasi | Operator ruang kontrol, teknisi pemeliharaan | Insinyur, analis |
| Catatan kebenaran untuk | Posting keuangan, nilai persediaan, permintaan | Catatan sesuai bangunan (as-built), riwayat eksekusi | Catatan operasi lintas kategori | Status kontrol dan alarm | Riwayat proses |
| Kegagalan khas jika disalahgunakan | Konfirmasi dari lantai produksi diketik berhari-hari kemudian | Digunakan sebagai alat perencanaan atau tempat pembuangan data tanpa logika proses | Cakupan yang begitu luas sehingga tidak ada yang berjalan | Digunakan sebagai sistem manajemen pesanan | Diperlakukan sebagai sistem catatan untuk kuantitas |

MOM adalah nama ISA-95 untuk seluruh Level 3; MES biasanya dipahami sebagai inti produksinya [10][14]. Banyak vendor menjual "MOM suite" yang mencakup modul kualitas dan pemeliharaan. Apakah Anda menyebutnya MES atau MOM kurang penting dibandingkan apakah matriks aktivitas dari bagian 4 memiliki satu pemilik untuk setiap sel.

### Sistem Level 3 lainnya dan di mana batas MES biasanya berada

| Sistem | Tugas inti | Batas tipikal dengan MES |
|---|---|---|
| QMS (sistem manajemen kualitas) | Ketidaksesuaian, CAPA, audit, kontrol dokumen, kualitas pemasok | MES menangkap hasil dan penahanan dalam proses; QMS mengelola investigasi dan tindakan korektif. Integrasi: ketidaksesuaian dibuat di MES, dikerjakan di QMS |
| LIMS (manajemen informasi laboratorium) | Sampel, pengujian laboratorium, spesifikasi, sertifikat analisis | MES meminta sampel dan menerima keputusan rilis; LIMS memiliki catatan pengujian |
| CMMS / EAM | Pesanan kerja pemeliharaan, suku cadang, riwayat aset | MES melaporkan status mesin dan penghitung; CMMS menjadwalkan pemeliharaan. ID aset bersama sangat penting |
| WMS | Penyimpanan, pengambilan, pergerakan gudang | MES meminta material ke lini dan mengonfirmasi konsumsi; WMS menjalankan pergerakan |
| APS | Penjadwalan kapasitas terbatas dan sekuensing | APS menghasilkan urutan; MES mendispatch dan melaporkan kembali aktual. Beberapa produk MES menyertakan modul APS |
| PLM | Desain produk, BOM teknik, manajemen perubahan | PLM merilis definisi teknik; MES menggunakan definisi manufaktur (sering melalui ERP atau alat perencanaan proses manufaktur) |
| Platform data / analitik | Analisis lintas pabrik, AI, penyimpanan jangka panjang | MES adalah sumber; ia tidak seharusnya menjadi data lake perusahaan. Lihat [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) |

### Apakah SAP itu MES? Apakah ERP sudah cukup?

Vendor ERP menawarkan fungsi eksekusi manufaktur, baik di dalam ERP (konfirmasi lantai produksi, daftar dispatch sederhana) maupun sebagai produk terpisah. SAP, misalnya, menggambarkan SAP Digital Manufacturing sebagai platform manajemen operasi manufaktur (MOM) berbasis cloud dan meminta pelanggan SAP Manufacturing Execution yang lebih lama untuk beralih ke sana (deskripsi vendor) [35]. Apakah ERP saja sudah cukup bergantung pada empat pertanyaan berikut:

1. **Granularitas:** Apakah Anda perlu mencatat per operasi dan per pesanan, atau per langkah, nomor seri, dan parameter?
2. **Latensi:** Apakah konfirmasi di akhir shift sudah cukup, atau keputusan bergantung pada hitungan menit?
3. **Penegakan:** Apakah sistem harus *mencegah* langkah yang salah (material salah, operator tidak berkualifikasi, pemeriksaan yang terlewat), atau cukup mencatatnya saja?
4. **Regulasi:** Apakah Anda memerlukan catatan batch elektronik atau catatan riwayat perangkat dengan jejak audit dan tanda tangan elektronik?

**Tanda bahwa Anda sudah melampaui eksekusi hanya dengan ERP:** konfirmasi diketik lebih dari satu shift terlambat; lebih dari satu spreadsheet bayangan per area; pelanggan atau regulator meminta ketertelusuran yang baru bisa Anda susun dalam hitungan hari; kebocoran kualitas yang disebabkan oleh revisi atau material yang salah; supervisor menghabiskan jam pertama setiap shift untuk mengumpulkan angka.

Jika keempat jawaban Anda adalah "kasar, akhir shift, hanya mencatat, tidak," maka kontrol shop floor ERP ditambah disiplin yang baik mungkin sudah cukup, terutama untuk pabrik kecil. Jika dua atau lebih jawaban mengarah sebaliknya, Anda memerlukan fungsi MES, baik dari vendor ERP, vendor MES, maupun platform.

## Fungsi MES secara rinci

Fungsi-fungsi di bawah ini mengikuti kolom produksi dari model aktivitas ISA-95 [3], diperluas dengan fungsi MESA-11 yang masih dicakup oleh sebagian besar produk [9]. Untuk setiap fungsi: apa yang dilakukannya, apa yang dibutuhkannya, dan bagaimana biasanya gagal.

### 1. Manajemen definisi produk (definisi kerja, routing, resep)

**Apa yang dilakukannya:** Menyimpan definisi manufaktur setiap produk: operasi, langkah, parameter, material yang dibutuhkan, alat, keterampilan, instruksi kerja, dan pemeriksaan. Di industri batch, ini disebut resep induk.

**Apa yang dibutuhkannya:** Pembagian data master yang jelas dengan ERP dan PLM, kontrol versi, dan proses perubahan teknik yang sampai ke lantai produksi sebelum pesanan berikutnya dimulai.

**Kegagalan yang umum:** Dua master. Routing ERP menyebutkan 12 operasi, MES menyebutkan 14, dan tidak ada yang tahu waktu mana yang digunakan untuk perhitungan biaya.

### 2. Manajemen sumber daya (orang, peralatan, material)

**Apa yang dilakukannya:** Mengetahui sumber daya mana yang tersedia dan berkualifikasi: status mesin, umur pakai alat, pelatihan dan sertifikasi operator, lot material yang tersedia di lini.

**Apa yang dibutuhkannya:** Catatan pelatihan (sering dari HR atau sistem pembelajaran), status peralatan dari CMMS dan kontrol, status material dari ERP atau WMS.

**Kegagalan yang umum:** MES memblokir operator karena catatan pelatihan di HR tertinggal tiga bulan. Perbaiki proses pembaruan kualifikasi sebelum mengaktifkan penegakan yang ketat. Pembahasan mendalam tentang [keterampilan tenaga kerja manufaktur](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) membahas matriks keterampilan.

### 3. Penjadwalan rinci

**Apa yang dilakukannya:** Mengubah pesanan yang telah dirilis menjadi urutan per sumber daya, dengan memperhatikan kapasitas, perpindahan produksi (changeover), ketersediaan material, dan tanggal jatuh tempo. MESA-11 menyebutnya penjadwalan operasi/rinci [9].

**Apa yang dibutuhkannya:** Waktu proses dan changeover yang akurat, kalender sumber daya yang nyata, dan kemajuan aktual dari lantai produksi.

**Kegagalan yang umum:** "Jadwal" yang sebenarnya hanyalah daftar dispatch ERP yang diurutkan berdasarkan tanggal jatuh tempo. Jika penjadwalan merupakan kendala nyata di pabrik Anda, bandingkan modul MES dengan APS mandiri.

### 4. Dispatching

**Apa yang dilakukannya:** Merilis pekerjaan berikutnya ke pusat kerja atau operator pada saat yang tepat, dengan semua dokumen dan material sudah siap. MESA-11: dispatching unit produksi [9].

**Kegagalan yang umum:** Daftar dispatch yang diabaikan operator karena tidak mencerminkan kenyataan (material hilang, mesin rusak). Solusinya adalah menutup lingkaran: dispatching harus menggunakan status sumber daya secara langsung.

### 5. Manajemen eksekusi dan instruksi kerja

**Apa yang dilakukannya:** Memandu operator atau mesin melalui setiap langkah, menegakkan urutan dan pemeriksaan, mengumpulkan persetujuan, dan menghentikan proses ketika suatu kondisi yang disyaratkan tidak terpenuhi. Di sinilah MES paling berbeda dari alat pelaporan.

**Apa yang dibutuhkannya:** Instruksi kerja yang ditulis dengan baik dan bersifat visual; keputusan tentang pemeriksaan mana yang merupakan penghentian keras dan mana yang hanya peringatan; terminal atau tablet di setiap stasiun.

**Batas keselamatan:** Fungsi keselamatan (pelindung, tombol henti darurat, interlock keselamatan) termasuk dalam kontrol berperingkat keselamatan di Level 1 dan 2, tidak pernah di MES. MES boleh memblokir *langkah pesanan berikutnya*; MES tidak boleh menjadi satu-satunya hal yang menjaga keselamatan seseorang.

**Kegagalan yang umum:** Mendigitalkan prosedur kertas 40 halaman satu per satu. Tulis ulang instruksi untuk layar, uji dengan operator dan buat tetap singkat. Lihat [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) dan [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/).

### 6. Pengumpulan data (data acquisition)

**Fungsinya:** Menangkap jumlah, waktu, status, parameter dan pengukuran, secara otomatis dari mesin jika memungkinkan dan secara manual jika tidak.

**Kebutuhannya:** Konektivitas mesin (OPC UA, MTConnect, protokol vendor, atau I/O sederhana untuk penghitung dan status), model waktu (apa yang dihitung sebagai downtime terencana) dan daftar kode alasan yang benar-benar dapat digunakan operator.

**Kegagalan yang umum:** 120 kode alasan downtime. Operator memilih yang pertama dalam daftar. Mulailah dengan delapan sampai lima belas kode per area dan perbaiki bersama orang-orang yang menggunakannya.

### 7. Manajemen kualitas dalam eksekusi

**Fungsinya:** Inspeksi dalam proses, SPC, rencana sampling, hold dan release, pencatatan ketidaksesuaian, serta tautan ke QMS untuk investigasi.

**Kebutuhannya:** Control plan dan karakteristik dari quality engineering (di otomotif, PFMEA dan control plan), integrasi gauge, serta aturan untuk apa yang terjadi saat pemeriksaan gagal.

**Kegagalan yang umum:** Hasil inspeksi dikumpulkan tetapi tidak pernah digunakan untuk menghentikan proses. Pemeriksaan yang tidak dapat menghentikan lini hanyalah catatan, bukan kontrol. Pekerjaan akar masalah termasuk dalam sistem kualitas; lihat [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### 8. Pelacakan, ketertelusuran dan genealogi

**Fungsinya:** Melacak pekerjaan dalam proses dan membangun catatan as-built: lot material dan komponen mana, dari pemasok mana, yang masuk ke nomor serial atau batch mana, diproses di peralatan mana dengan parameter apa dan oleh siapa. MESA-11: product tracking and genealogy [9].

**Kebutuhannya:** Identifikasi unik (barcode, kode 2D, RFID), pemindaian yang disiplin di setiap titik konsumsi material, serta aturan yang jelas untuk material curah (tingkat lot vs. tingkat serial).

**Kegagalan yang umum:** Genealogi direkonstruksi setelah kejadian dari dokumen pengiriman. Genealogi harus ditangkap dalam proses. Sebuah uji sederhana: pilih nomor serial produk jadi secara acak dan tanyakan berapa lama waktu yang dibutuhkan untuk mendaftar semua lot komponennya. Lalu balik: pilih lot komponen dan daftar semua unit jadi yang mengandungnya.

### 9. Analisis kinerja

**Fungsinya:** OEE, yield, scrap, cycle time, kepatuhan jadwal dan analisis downtime per shift, lini dan produk; masukan untuk rapat shop floor harian. Bagian 14 membahas KPI.

**Kegagalan yang umum:** Dashboard yang tidak ada seorang pun bahas. Kaitkan setiap KPI dengan sebuah rapat dan seorang penanggung jawab, sebagaimana diuraikan dalam [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### 10. Kontrol dokumen

**Fungsinya:** Menyampaikan revisi terkini gambar, instruksi dan spesifikasi ke stasiun kerja serta mencatat revisi mana yang digunakan. Sering dibagikan kepada atau didelegasikan ke sistem manajemen dokumen atau QMS.

### 11. Manajemen tenaga kerja

**Fungsinya:** Mencatat siapa yang mengerjakan pesanan mana dan berapa lama, untuk costing, pemeriksaan kualifikasi dan antarmuka penggajian. Perhatikan aspek manusia di bagian 15: pelacakan tenaga kerja pada tingkat operasi bersifat sensitif dan di pabrik berserikat dapat tunduk pada perundingan.

### 12. Fungsi terkait pemeliharaan

**Fungsinya:** Status mesin, penghitung dan alarm dari MES mendukung pemeliharaan berbasis kondisi atau pemakaian di CMMS. Manajemen pemeliharaan penuh biasanya tetap berada di CMMS. Lihat [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) dan [predictive maintenance and IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/).

### 13. Persediaan dan aliran material di lini

**Fungsinya:** Meminta material ke lini, mengonfirmasi konsumsi, melacak buffer WIP dan stok di samping lini. Sinyal kanban dapat dipicu dari data konsumsi MES; lihat [kanban and pull systems](https://www.m365.fm/en/learn/kanban-pull-system/) dan [intralogistics](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

### Diskrit, proses, dan batch: bagaimana penekanannya bergeser

| Jenis industri | Penekanan MES yang umum | Contoh |
|---|---|---|
| Diskrit, volume tinggi (otomotif, elektronik) | Genealogi serial, interlock, data mesin, OEE, Andon | Body shop, perakitan PCB |
| Diskrit, mix tinggi, volume rendah (mesin, dirgantara) | Instruksi kerja, traveler, nonconformance, kualifikasi operator, konfigurasi as-built | Perakitan mesin perkakas, struktur pesawat terbang |
| Batch (farmasi, makanan, kimia khusus) | Electronic batch record, eksekusi resep, penimbangan dan dispensing, tinjauan berdasarkan pengecualian, kepatuhan | Manufaktur tablet, saus |
| Kontinu (kertas, baja, pemurnian) | Pelacakan produksi berdasarkan waktu dan lot, kualitas berdasarkan sampel, energi, integrasi dengan DCS dan LIMS | Mesin kertas, hot strip mill |

Untuk spesifik dirgantara (AS9100, first article inspection, configuration control), lihat [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

## Integrasi: B2MML, OPC UA, MTConnect, dan unified namespace

Sebuah MES hanya sebaik antarmukanya. Ia membutuhkan order dan master data dari atas, data mesin dari bawah, dan harus mengembalikan hasil yang telah dikonfirmasi. Empat blok bangunan selalu berulang.

### Ke atas: integrasi ERP dan B2MML

Antarmuka ERP-MES membawa sejumlah kecil tipe pesan, yang dipetakan dengan rapi ke kategori informasi ISA-95:

| Arah | Pesan | Isi | Pemicu |
|---|---|---|---|
| ERP -> MES | Definisi produk / routing | Operasi, BOM, work center, waktu standar | Rilis perubahan teknik |
| ERP -> MES | Production order (jadwal) | Material, kuantitas, tanggal jatuh tempo, referensi routing | Rilis order |
| ERP -> MES | Master material, lot | ID material, karakteristik batch | Perubahan, penerimaan |
| MES -> ERP | Konfirmasi operasi (kinerja) | Kuantitas baik dan scrap, waktu, tenaga kerja | Akhir operasi atau berkala |
| MES -> ERP | Pergerakan barang | Konsumsi, penerimaan barang dari produksi | Pemindaian konsumsi, penyelesaian order |
| MES -> ERP | Notifikasi kualitas | Cacat, hold | Nonconformance |
| MES <-> ERP | Kapabilitas / status | Ketersediaan sumber daya, status order | Perubahan status |

**B2MML** (Business To Manufacturing Markup Language) adalah implementasi XML MESA atas model objek ISA-95; spesifikasi pendamping ISA-95 dari OPC Foundation mengikuti pemetaan B2MML bila memungkinkan untuk mempermudah terjemahan [5]. Menggunakan B2MML atau ekuivalen JSON tidak membuat antarmuka menjadi plug-and-play, tetapi memberi kedua sisi nama dan struktur objek yang sama, sehingga mempersingkat pekerjaan spesifikasi. Dengan bubarnya MESA, pastikan di mana skema dipelihara (lihat bagian 2) [11].

**Aturan yang menghemat berbulan-bulan:**

- Tentukan untuk setiap atribut sistem mana yang menjadi master, dan jangan pernah membiarkan dua sistem menulis field yang sama.
- Sepakati *peristiwa* yang memicu konfirmasi (akhir operasi, setiap 15 menit, akhir order), tidak hanya formatnya.
- Buat antarmuka bersifat idempoten: pesan yang terkirim dua kali tidak boleh memposting kuantitas dua kali.
- Rencanakan untuk kondisi ERP tidak tersedia. MES harus tetap berjalan dan mengantrikan posting.

### Ke bawah: integrasi mesin dan kontrol dengan OPC UA dan MTConnect

**OPC UA** adalah antarmuka vendor-netral yang dominan antara kontrol dan perangkat lunak Level 3. OPC Foundation memelihara spesifikasi pendamping yang mendefinisikan model informasi untuk domain tertentu, termasuk OPC 10030, yang memetakan model objek umum ISA-95 ke dalam OPC UA [4][5]. Di Azure IoT Operations milik Microsoft, misalnya, konektor OPC UA membaca titik data yang dikonfigurasi dan mempublikasikannya ke broker MQTT [26]; panduan saudara [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) membahas tumpukan tersebut.

**MTConnect** adalah standar terbuka untuk data mesin perkakas dan peralatan manufaktur, dipublikasikan sebagai ANSI/MTC1.4-2018 [22]. Banyak pembuat mesin perkakas di AS mendukungnya secara native, sehingga menarik bagi job shop dengan peralatan CNC.

Untuk lini pengemasan, model state PackML (dari technical report ISA-TR88.00.02, edisi terkini 2022) memberikan mesin satu kumpulan state dan mode yang sama [37], yang menyederhanakan perhitungan OEE di berbagai OEM.

**Yang Anda butuhkan dari mesin, minimal:** sebuah state (berjalan, berhenti, gangguan, dalam setup), penghitung part baik, penghitung reject, program atau resep yang aktif, dan kode alarm. Semua yang lain adalah tambahan untuk kasus penggunaan di kemudian hari.

### Ke samping dan ke luar: unified namespace (UNS)

**Unified namespace** adalah pola arsitektur, bukan standar: sistem mempublikasikan kondisi terkininya sebagai event ke sebuah broker pusat, umumnya MQTT, yang diatur dalam pohon topik hierarkis, dan sistem lain berlangganan pada data yang mereka butuhkan. Pohon topik biasanya mengikuti hierarki peralatan ISA-95. [Pilar Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) menunjukkan contoh topik lengkap dan layanan Azure yang mengimplementasikannya; bagian ini berfokus pada arti UNS bagi MES.

```
acme/dayton/machining/line-2/cnc-3/state
acme/dayton/machining/line-2/cnc-3/counts
acme/dayton/machining/line-2/order/current
acme/dayton/assembly/test-cell-t1/lt-1/result
```

**MQTT** adalah protokol publish/subscribe yang ringan; broker saat ini mendukung versi 3.1.1 dan 5, seperti yang didokumentasikan Microsoft untuk broker di Azure IoT Operations [25]. **Sparkplug**, yang dikelola oleh Eclipse Sparkplug Working Group, menambahkan konvensi payload dan status di atas MQTT; versi 3.0 adalah versi terkini. "Sertifikat lahir dan mati"-nya memberi tahu subscriber apakah data perangkat masih valid [28]. Struktur topik Sparkplug sendiri (group, edge node, device) bukan hierarki ISA-95, sehingga pabrik yang menggunakannya biasanya memetakan hierarki ke dalam ID group (misalnya `spBv1.0/Plant1:Area3:Line4:Cell2/NDATA/<edge node>`) atau memisahkan level ke beberapa broker atau namespace kedua yang terstruktur ISA-95; sebuah vendor broker menjelaskan kedua pola tersebut dan memperingatkan bahwa jumlah elemen topik Sparkplug yang terbatas membuat pemetaannya ketat [44].

**Yang berubah bagi MES dengan UNS:**

| Tanpa UNS | Dengan UNS |
|---|---|
| MES terhubung point-to-point ke setiap mesin, ERP, QMS, dashboard | MES berlangganan pada topik mesin dan order serta mempublikasikan event sendiri (order dimulai, operasi selesai, hold ditempatkan) |
| Konsumen baru (dashboard, model AI) memerlukan antarmuka baru ke MES | Konsumen baru berlangganan pada topik yang sudah ada |
| Kondisi terkini tersebar di berbagai sistem | Kondisi terkini terlihat di satu tempat |

**Yang tidak berubah dengan UNS:**

- **Logika bisnis tetap berada di MES.** Broker memindahkan pesan; broker tidak memastikan bahwa material yang benar digunakan, bahwa operator memiliki kualifikasi, atau bahwa batch record sudah lengkap.
- **Catatan kebenaran tetap berada di sistem of record.** Broker menyimpan kondisi terkini, bukan riwayat yang dapat diaudit. Genealogi, batch record, dan konfirmasi harus disimpan secara transaksional di MES (dan di ERP), dengan audit trail jika diatur regulasi.
- **Semantik tetap memerlukan model.** Topik bernama `counts` tidak berguna jika satu mesin menghitung siklus dan mesin lain menghitung part yang baik. Objek ISA-95 dan spesifikasi companion OPC UA menyediakan semantik payload.
- **Keamanan justru menjadi lebih sulit.** Broker yang dapat ditulisi oleh setiap sistem merupakan target bernilai tinggi; kontrol akses per topik, klien yang terautentikasi, dan segmentasi sesuai ISA/IEC 62443 bersifat wajib [23][24].

**Perdebatan: "UNS menggantikan ISA-95."** Anda akan membaca klaim ini. Klaim tersebut mencampuradukkan dua hal. Posisi ISA sendiri adalah bahwa level-level tersebut tetap membantu menjelaskan batas sistem meskipun data tidak lagi mengalir level demi level [1], dan edisi Part 1 tahun 2025 secara eksplisit menargetkan arsitektur yang berorientasi data dan modular [2]. Sintesis yang dapat diterapkan: ISA-95 untuk kosakata, hierarki peralatan, dan tanggung jawab; UNS (atau backbone event lain) untuk transport; MES dan ERP sebagai sistem transaksional of record.

### Arsitektur integrasi: perbandingan tiga pola

| Pola | Cara kerja | Cocok untuk | Perhatikan |
|---|---|---|---|
| Point-to-point | Setiap sistem memiliki antarmuka langsung ke sistem lain | Pabrik kecil dengan 3 sampai 5 sistem | Hingga n × (n − 1) ÷ 2 antarmuka: 10 untuk 5 sistem, 45 untuk 10; rapuh saat upgrade |
| Middleware integrasi / ESB | Lapisan integrasi terpusat mentransformasi dan merutekan pesan | Perusahaan yang berpusat pada ERP dengan tim integrasi TI | Dapat menjadi hambatan yang dikelola oleh tim yang jauh |
| Event backbone / UNS | Broker publish/subscribe dengan konvensi topik dan payload bersama | Pabrik dengan banyak mesin dan banyak konsumen data | Memerlukan tata kelola topik, payload, dan akses; alur transaksional tetap memerlukan pengiriman yang terjamin |

Sebagian besar pabrik akhirnya menggunakan kombinasi: UNS untuk data mesin dan kondisi, dan integrasi dengan pengiriman terjamin untuk transaksi ERP.

## MES di industri yang diatur regulasi

Di industri yang diatur regulasi, MES merupakan bagian dari sistem mutu, dan catatannya adalah catatan hukum. Bagian ini menjelaskan aturan AS yang harus Anda rancang; bagian ini tidak menggantikan saran dari tim urusan regulasi Anda.

### FDA 21 CFR Part 11: catatan dan tanda tangan elektronik

Untuk sistem tertutup, 21 CFR 11.10 mensyaratkan, antara lain, validasi sistem untuk akurasi, keandalan dan kinerja yang konsisten sesuai tujuan; kemampuan menghasilkan salinan catatan yang akurat dan lengkap; perlindungan catatan sepanjang periode retensi; pembatasan akses sistem hanya bagi individu yang berwenang; dan "jejak audit yang aman, dihasilkan komputer, dan diberi cap waktu" yang merekam tanggal dan waktu entri serta tindakan operator yang membuat, mengubah atau menghapus catatan, tanpa mengaburkan informasi yang sudah tercatat sebelumnya [19]. Paragraf lain mencakup pemeriksaan operasional dan kewenangan, pemeriksaan perangkat, pelatihan, serta kebijakan tertulis.

**Artinya bagi MES:** akun pengguna per orang (tidak ada login bersama di terminal), jejak audit pada setiap catatan yang diatur, tanda tangan elektronik yang terhubung dengan catatan dan menampilkan nama penandatangan, tanggal, waktu serta makna tanda tangan, dan paket validasi. Rencanakan pekerjaan validasi dalam waktu dan anggaran; di farmasi, pekerjaan ini sering menyumbang porsi besar dari upaya implementasi [unverified: tidak ada tolok ukur publik untuk porsi tersebut].

### Farmasi: catatan batch elektronik

Produsen obat wajib menyimpan catatan produksi dan pengendalian batch untuk setiap batch berdasarkan peraturan good manufacturing practice saat ini dalam 21 CFR Part 211; bagian 211.188 menyatakan bahwa "catatan produksi dan pengendalian batch harus disiapkan untuk setiap batch produk obat yang diproduksi" [38]. MES dengan catatan batch elektronik (eBR) menegakkan urutan resep, menangkap berat dan parameter langsung dari sumbernya, serta mendukung **tinjauan berdasarkan pengecualian**: peninjau QA memeriksa penyimpangan yang ditandai oleh sistem, bukan membaca setiap halaman. Ini merupakan salah satu dasar bisnis MES paling kuat di industri mana pun, karena waktu tinjauan catatan batch sering membatasi pelepasan produk.

### Perangkat medis: QMSR dan catatan riwayat perangkat

Sejak 2 Februari 2026, Quality Management System Regulation (21 CFR Part 820) dari FDA memasukkan ISO 13485:2016 sebagai acuan, termasuk persyaratan identifikasi dan keterlacakannya [20]. Istilah lama "device history record" (DHR) masih muncul di banyak deskripsi produk MES dan prosedur pabrik; halaman QMSR dari FDA tidak menggunakan istilah ini, jadi rekomendasi kami adalah memetakan catatan Anda ke persyaratan ISO 13485:2016 yang dimasukkan oleh QMSR, bukan ke nomor bagian Part 820 yang lama, dan mengonfirmasi pemetaan tersebut bersama urusan regulasi. MES biasanya menghasilkan catatan as-built per lot atau nomor seri: komponen, operasi, inspeksi, peralatan dan personel.

### Pangan: keterlacakan FSMA 204

Food Traceability Rule dari FDA (FSMA Section 204) mensyaratkan elemen data utama untuk peristiwa pelacakan kritis (penerimaan, transformasi, pengiriman) yang terhubung dengan traceability lot code, dengan catatan yang diserahkan kepada FDA dalam 24 jam setelah permintaan; FDA tidak akan menegakkannya sebelum 20 Juli 2028 [29]. Peristiwa transformasi terjadi dalam produksi, sehingga MES atau modul keterlacakan merupakan tempat yang tepat untuk membuat lot code dan menghubungkan input dengan output.

### Otomotif dan dirgantara

IATF 16949 dan AS9100 menambahkan persyaratan keterlacakan, control plan, dan first article; persyaratan spesifik pelanggan sering kali lebih jauh lagi. Dalam IATF 16949, klausul 8.5.2.1 melengkapi persyaratan identifikasi dan keterlacakan ISO 9001 dengan rencana keterlacakan terdokumentasi yang didasarkan pada "tingkat risiko atau tingkat keparahan kegagalan bagi karyawan, pelanggan, dan konsumen," menurut matriks perbandingan sebuah badan sertifikasi [39] (sumber sekunder; standar ini merupakan teks berbayar). Kedua standar tersebut adalah teks berbayar; panduan [perencanaan produksi dirgantara](https://www.m365.fm/en/learn/aerospace-production-planning/) membahas AS9100 dan AS9102 secara mendalam.

### Pendekatan validasi

Panduan final FDA *Computer Software Assurance for Production and Quality Management System Software* (CDRH dan CBER, Februari 2026) menjelaskan pendekatan berbasis risiko untuk membangun keyakinan terhadap perangkat lunak produksi dan sistem manajemen mutu, serta untuk menentukan di mana diperlukan ketelitian yang lebih tinggi [40]. Panduan ini ditujukan untuk produsen perangkat medis di bawah 21 CFR Part 820; produsen obat dapat menggunakannya sebagai orientasi, bukan sebagai aturan mereka sendiri. Dalam praktiknya: klasifikasikan setiap fungsi MES berdasarkan risiko, uji secara menyeluruh fungsi berisiko tinggi (tanda tangan elektronik, interlock, perhitungan, genealogi) dengan uji terskrip, dan gunakan pengujian tidak terskrip atau pengujian yang disediakan vendor untuk konfigurasi berisiko rendah. Mintalah vendor menyediakan akselerator validasi mereka dan sertifikasi sistem mutu mereka sendiri.

## Opsi penerapan dan arsitektur

Pasar telah bergeser dari "satu suite MES besar per pabrik" ke rangkaian opsi yang lebih luas. Opsi-opsi ini berbeda dalam tempat perangkat lunak dijalankan dan dalam cara strukturnya.

### Tempat dijalankan: on-premises, cloud, hybrid

| Opsi | Deskripsi | Kelebihan | Kekurangan |
|---|---|---|---|
| On-premises | Server MES di pabrik atau pusat data perusahaan | Tetap berjalan saat WAN mati; kontrol penuh; familiar bagi tim validasi | Perangkat keras, patching, dan upgrade menjadi tanggung jawab Anda; upgrade sering ditunda bertahun-tahun |
| Cloud (SaaS) | Vendor menjalankan MES di cloud-nya; pabrik terhubung melalui gateway | Mulai lebih cepat, upgrade dikelola vendor, biaya berlangganan | Ketergantungan pada WAN; latensi untuk interlock; residensi data; ritme upgrade yang dipaksakan harus sesuai dengan validasi |
| Hybrid / edge plus cloud | Eksekusi yang kritis waktu berjalan di node edge di pabrik, analitik dan manajemen di cloud | Tetap berjalan saat gangguan; analitik dapat diskalakan | Dua lingkungan yang harus dioperasikan dan diamankan; logika sinkronisasi |

**Aturan praktis:** apa pun yang harus menghentikan langkah yang salah atau menjaga lini tetap berjalan harus dapat berfungsi ketika koneksi internet terputus. Mintalah setiap vendor cloud untuk mendemonstrasikan perilaku offline, bukan hanya menjelaskannya.

### Cara strukturnya: suite, platform, modul ERP

| Pendekatan | Yang Anda dapatkan | Cocok untuk | Risiko |
|---|---|---|---|
| Suite MES industri | Fungsionalitas luas dan siap pakai untuk satu atau beberapa industri, sering dengan fitur regulasi | Pabrik yang diatur dan kompleks; standardisasi multi-situs | Proyek panjang, kustomisasi berat, ketergantungan pada vendor, biaya lisensi tinggi |
| Composable / platform aplikasi ("MES generasi berikutnya") | Platform dengan alat low-code dan konektor; pabrik membangun atau mengkonfigurasi aplikasi untuk kasus penggunaan tertentu | Pabrik yang ingin memulai dari kecil dan berkembang; operasi high-mix; tim internal yang kuat | Banyak aplikasi kecil tanpa model data bersama; tata kelola; validasi aplikasi yang dibangun oleh pengguna non-IT |
| MES terintegrasi ERP | Modul MES atau produk pendamping dari vendor ERP | Perusahaan yang berpusat pada ERP dengan kompleksitas lantai produksi sedang | Kegunaan lantai produksi dan integrasi mesin bisa tertinggal dibanding produk spesialis |
| Pembangunan kustom | Perangkat lunak sendiri di atas platform umum | Proses yang unik, tim perangkat lunak yang kuat | Anda memiliki beban pemeliharaan selamanya (bagian 10) |

"Composable MES" adalah istilah pemasaran vendor dan analis, bukan kategori standar. Gagasan dasarnya, yaitu fungsi-fungsi kecil yang berbagi satu model data dan dapat ditambahkan seiring waktu, sudah tepat dan sejalan dengan pandangan ISA-95 yang berbasis aktivitas. Risikonya justru kebalikan dari monolit: dua puluh aplikasi yang masing-masing mendefinisikan "order" dan "mesin" secara berbeda. Hierarki peralatan dan model objek ISA-95 adalah penawarnya.

### Templat multi-situs

Bagi perusahaan dengan beberapa pabrik, pertanyaannya bukan lagi "MES yang mana" melainkan "seberapa besar standardisasinya." Pendekatan yang umum adalah **templat global** (model data, proses inti, antarmuka, KPI) dengan ekstensi lokal. Batasi templat pada hal-hal yang harus dapat dibandingkan antar situs (definisi KPI sesuai ISO 22400, genealogi, antarmuka ERP); biarkan situs berbeda di tempat prosesnya memang berbeda.

## Build vs. buy

Sebagian besar pabrik sebaiknya membeli (atau berlangganan) dan melakukan konfigurasi. Membangun sendiri masuk akal dalam lebih sedikit kasus daripada yang dipercaya tim engineering, tetapi lebih banyak daripada yang diakui vendor.

### Faktor keputusan

| Faktor | Mengarah ke beli | Mengarah ke bangun atau bangun di atas platform |
|---|---|---|
| Keunikan proses | Proses menyerupai praktik industri | Proses merupakan diferensiator kompetitif yang nyata dan sering berubah |
| Regulasi | Lingkungan tervalidasi dan diatur (Part 11, GMP) | Tidak diatur atau diatur secara ringan |
| Kapabilitas internal | Tidak ada tim perangkat lunak, atau tim yang sepenuhnya sibuk dengan ERP | Tim berpengalaman yang mampu memelihara perangkat lunak selama 10+ tahun |
| Cakupan | Luas: eksekusi, kualitas, genealogi, penjadwalan | Sempit: pengumpulan data dan OEE, instruksi kerja digital |
| Waktu | Perlu hasil dalam hitungan bulan | Dapat berinvestasi dalam pembangunan yang lebih panjang |
| Total biaya selama 10 tahun | Lisensi plus konfigurasi lebih rendah daripada biaya tim | Biaya tim sudah tenggelam dan stabil |
| Risiko ketergantungan pada individu kunci | Tidak dapat diterima | Dimitigasi dengan dokumentasi dan ukuran tim |

### Biaya tersembunyi dari membangun sendiri

MES buatan sendiri tidak memiliki biaya lisensi, tetapi Anda tetap membayar untuk kebutuhan, pengembangan, pengujian, dokumentasi, hosting, patch keamanan, peningkatan platform yang mendasarinya, dukungan pada pukul 3 pagi, dan, di industri yang diatur, validasi setiap perubahan. Kegagalan yang paling umum bukan pada versi pertama; melainkan pada tahun kelima, ketika pengembang asli sudah pergi dan pabrik menjalankan perangkat lunak yang tidak ada orang berani ubah.

### Jalan tengah

Banyak pabrik membeli platform atau MES untuk inti (eksekusi, genealogi, antarmuka ERP) lalu membangun aplikasi atau dasbor khusus di atasnya menggunakan API-nya atau alat low-code. Pendekatan ini berhasil ketika inti yang dibeli memiliki model data dan bagian kustom hanya membaca darinya atau menggunakan API yang terdokumentasi.

## Daftar periksa pemilihan vendor MES

Tabel di bawah ini adalah daftar periksa pemilihan dengan 30 kriteria dalam delapan kelompok. Berikan bobot pada kelompok sesuai situasi Anda (bobot yang disarankan cocok untuk pabrik diskrit berukuran menengah dengan regulasi ringan), beri skor setiap vendor dari 0 sampai 4 per kriteria, dan yang terpenting, gunakan kolom **metode uji**: tidak ada kriteria yang boleh diberi skor hanya berdasarkan slide presentasi.

| # | Grup (bobot yang disarankan) | Kriteria | Cara menguji |
|---|---|---|---|
| 1 | Kesesuaian fungsional (25%) | Mencakup kasus penggunaan utama Anda dari matriks aktivitas ISA-95 | Demo terskrip dengan produk, routing, dan satu pesanan nyata milik Anda |
| 2 | Kesesuaian fungsional | Instruksi kerja: visual, berversi, penegakan langkah | Operator membuat dan menjalankan satu instruksi selama demo |
| 3 | Kesesuaian fungsional | Genealogi pada tingkat yang Anda butuhkan (lot, serial, atau keduanya) | Pelacakan maju dan mundur pada data demo dalam 60 detik |
| 4 | Kesesuaian fungsional | Kualitas dalam eksekusi: pemeriksaan, SPC, penahanan, ketidaksesuaian | Paksa satu pemeriksaan gagal dan tunjukkan apa yang menghentikan proses |
| 5 | Kesesuaian fungsional | Downtime dan OEE sesuai model waktu Anda | Konfigurasikan kode alasan dan aturan henti terencana Anda |
| 6 | Kesesuaian fungsional | Kedalaman penjadwalan dan dispatching (atau integrasi dengan APS) | Atur ulang urutan setelah mesin rusak |
| 7 | Integrasi (15%) | Konektor ERP untuk ERP dan versi Anda | Referensi pelanggan dengan ERP yang sama; tinjau dokumentasi antarmuka |
| 8 | Integrasi | Konektivitas mesin: OPC UA, MTConnect, merek PLC Anda | Hubungkan satu mesin Anda dalam proof of concept |
| 9 | Integrasi | API terbuka (REST, event), terdokumentasi dan berversi | Pengembang membaca dokumentasi API dan membuat satu kueri kecil |
| 10 | Integrasi | Dukungan objek ISA-95 atau B2MML | Minta pemetaan model data ke ISA-95 |
| 11 | Integrasi | Publikasi event ke MQTT / UNS | Tampilkan event pada broker dalam demo |
| 12 | Data dan arsitektur (10%) | Model data mengikuti atau memetakan ke hierarki peralatan ISA-95 | Tinjau konfigurasi model peralatan |
| 13 | Data dan arsitektur | Kemampuan offline di edge | Putuskan WAN selama proof of concept |
| 14 | Data dan arsitektur | Ekspor data dan kepemilikan: Anda dapat memperoleh semua data dalam format terbuka | Klausul kontrak ditambah uji ekspor |
| 15 | Data dan arsitektur | Kemampuan templat multi-situs | Referensi dengan tiga situs atau lebih |
| 16 | Kegunaan (10%) | Layar operator dapat digunakan dengan sarung tangan, pada tablet, di lingkungan bising | Dua operator menguji tanpa pelatihan selama 30 menit |
| 17 | Kegunaan | Konfigurasi oleh supervisor dan insinyur tanpa kode | Insinyur mengubah satu langkah routing dan satu pemeriksaan |
| 18 | Kegunaan | Bahasa yang dibaca tenaga kerja Anda | Tampilkan layar dalam setiap bahasa |
| 19 | Kepatuhan dan keamanan (10%) | Fitur Part 11 jika diperlukan (jejak audit, tanda tangan elektronik) | Demo jejak audit pada satu catatan yang diubah |
| 20 | Kepatuhan dan keamanan | Pengembangan aman dan sertifikasi keamanan produk (mis., ISA/IEC 62443-4-1/4-2) | Sertifikat dan kebijakan pengungkapan kerentanan vendor [23] |
| 21 | Kepatuhan dan keamanan | Integrasi identitas (SSO, MFA untuk admin, model peran) | Konfigurasikan peran untuk operator, supervisor, kualitas |
| 22 | Kepatuhan dan keamanan | Dokumen pendukung validasi | Tinjau paket validasi |
| 23 | Vendor dan mitra (10%) | Stabilitas keuangan dan kepemilikan | Laporan tahunan atau pemeriksaan kredit; perubahan kepemilikan dalam lima tahun terakhir |
| 24 | Vendor dan mitra | Mitra implementasi dengan referensi di industri dan wilayah Anda | Hubungi dua referensi tanpa kehadiran vendor |
| 25 | Vendor dan mitra | Peta jalan produk dan ritme rilis | Peta jalan di bawah NDA; seberapa sering pelanggan benar-benar meningkatkan versi? |
| 26 | Vendor dan mitra | Model dukungan dan jam layanan | Teks SLA; siapa yang menjawab pukul 2 pagi pada hari Sabtu? |
| 27 | Biaya (15%) | Total biaya kepemilikan lima tahun | Model TCO Anda (bagian 13) diisi dengan penawaran vendor |
| 28 | Biaya | Model lisensi sesuai pertumbuhan (per situs, per pengguna, per mesin, konsumsi) | Hitung harga skenario ekspansi tiga tahun sekarang |
| 29 | Biaya | Biaya peningkatan dan kustomisasi | Tanyakan berapa biaya peningkatan untuk pelanggan referensi |
| 30 | Keluar (5%) | Rencana keluar: data, konfigurasi, dokumentasi saat pengakhiran | Klausul kontrak; tanyakan bagaimana pelanggan terdahulu bermigrasi keluar |

**Penilaian:** skor tertimbang = jumlah dari (bobot grup × rata-rata skor kriteria ÷ 4) untuk semua grup. Vendor dengan 78 persen mengungguli vendor dengan 72 persen hanya jika keduanya tidak memiliki kriteria gugur: nilai 0 pada kesesuaian fungsional, kemampuan offline (jika diwajibkan), atau kepatuhan harus menggugurkan vendor tersebut, terlepas dari total skornya.

**Tips proses:**

- Susun permintaan proposal (RFP) berdasarkan use case dan matriks aktivitas, bukan daftar fitur 600 baris. Daftar fitur cenderung mendapat "ya" untuk setiap baris.
- Tuntut proof of concept (PoC) berbayar pada satu lini dengan data Anda sendiri sebelum keputusan akhir. Rentang tipikal dua sampai enam minggu [unverified: perkiraan praktisi].
- Biarkan operator dan supervisor menilai kegunaan (usability); biarkan tim keuangan menilai biaya; pisahkan penilaian tersebut sampai tahap akhir.
- Sebagai titik awal yang netral terhadap vendor, ulasan analis (Gartner Peer Insights mencantumkan pasar MES [8]) dan referensi dari pabrik sejawat lebih berguna daripada peringkat vendor yang diterbitkan oleh vendor itu sendiri.

## Peta jalan implementasi MES

Peta jalan di bawah ini dibuat untuk satu pabrik berukuran menengah. Durasi yang tercantum adalah asumsi perencanaan untuk produk yang sudah dikonfigurasi, bukan tolok ukur; pabrik yang diatur regulasi dan pembangunan kustom membutuhkan waktu lebih lama [unverified: perkiraan praktisi].

| Fase | Durasi (asumsi tipikal) | Aktivitas utama | Kriteria keluar |
|---|---|---|---|
| 0. Kasus dan lingkup | 4 sampai 8 minggu | Pernyataan masalah, penelusuran value stream, matriks aktivitas ISA-95 kondisi saat ini, baseline KPI, draf business case | Sponsor, rentang anggaran, dan satu value stream pilot disetujui |
| 1. Persyaratan dan seleksi | 8 sampai 16 minggu | Use case, model data (hierarki peralatan, kepemilikan master data), RFP, demo terskrip, proof of concept | Vendor dan mitra terpilih, kontrak dengan klausul keluar dan data |
| 2. Desain | 6 sampai 10 minggu | Desain solusi, spesifikasi antarmuka, model waktu dan kode alasan, standar instruksi kerja, rencana validasi (jika diatur regulasi), desain keamanan | Desain yang ditandatangani, rencana pengujian |
| 3. Pembangunan dan pengujian pilot | 10 sampai 20 minggu | Konfigurasi, konektivitas mesin, antarmuka ERP, migrasi data, siklus pengujian, pelatihan operator | Penerimaan pengguna pada lini pilot |
| 4. Go-live pilot dan stabilisasi | 6 sampai 12 minggu | Go-live dengan hypercare, tinjauan isu harian, perbandingan KPI dengan baseline | KPI stabil selama 4 minggu berturut-turut; cacat terbuka di bawah ambang yang disepakati |
| 5. Peluncuran (rollout) | 3 sampai 6 bulan per gelombang | Lini dan area lainnya; templat disempurnakan | Semua area dalam lingkup sudah live |
| 6. Perbaikan berkelanjutan | Berkelanjutan | Use case baru, pembaruan, perbaikan berbasis KPI | Dimiliki oleh pabrik, bukan oleh proyek |

### Fase 0 secara rinci: mulai dari value stream

Telusuri value stream terlebih dahulu. Petakan di mana informasi tertunda, diketik ulang, atau hilang, serta di mana cacat lolos atau waktu tunggu yang panjang berasal. Panduan [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) menjelaskan caranya; peta kondisi saat ini dengan alur informasi tergambar merupakan dokumen persyaratan MES terbaik yang dapat Anda hasilkan dalam satu minggu. Pilih pilot yang cukup penting untuk berarti dan cukup terbatas untuk diselesaikan: satu lini atau satu keluarga produk dengan titik masalah yang jelas.

### Fase 1 secara rinci: model data sebelum perangkat lunak

Tentukan hierarki peralatan (bagian 4), pemilik master data untuk setiap objek (material, routing, peralatan, personel), model waktu untuk OEE (apa yang disebut waktu produksi terencana), dan model status order serta operasi. Jika Anda tidak dapat menyepakatinya dengan tim ERP, kualitas, dan pemeliharaan sebelum seleksi, tidak ada vendor yang dapat menyelesaikannya untuk Anda.

### Daftar periksa go-live

| Pemeriksaan | Selesai |
|---|---|
| Master data untuk produk pilot diverifikasi di lantai produksi (langkah routing, BOM, instruksi) | ☐ |
| Setiap operator dilatih di stasiun kerjanya sendiri dengan order nyata, tidak hanya di ruang kelas | ☐ |
| Prosedur cadangan (traveler kertas) dicetak dan diuji untuk kondisi MES mati | ☐ |
| Antarmuka ERP diuji dengan kasus kesalahan (ERP mati, pesan duplikat, jumlah salah) | ☐ |
| Kode alasan dan pemeriksaan ditinjau bersama operator | ☐ |
| Jadwal hypercare untuk dua minggu pertama, semua shift | ☐ |
| Baseline KPI dibekukan untuk perbandingan | ☐ |
| Keamanan: akun, peran, MFA untuk admin, cadangan diuji | ☐ |
| Diatur regulasi: laporan ringkasan validasi disetujui sebelum digunakan dalam produksi | ☐ |

### Peran

| Peran | Tanggung jawab |
|---|---|
| Sponsor eksekutif (manajer pabrik atau VP operasi) | Memutuskan konflik lingkup, melindungi sumber daya |
| Product owner dari operasi | Memiliki use case dan prioritas, menandatangani penerimaan |
| Pimpinan MES / arsitek solusi | Desain, model data, integrasi |
| Insinyur IT/OT | Infrastruktur, jaringan, konektivitas mesin, keamanan |
| Kualitas dan regulasi | Pemeriksaan, catatan, validasi |
| Pengguna kunci per area dan shift | Menguji, melatih rekan, memberi umpan balik |
| Mitra keuangan | Business case, pelacakan manfaat |
| Vendor / integrator | Konfigurasi, pengetahuan produk |

## Biaya MES dan ROI dengan contoh perhitungan

"Berapa biaya MES?" tidak memiliki satu angka yang jujur. Harga bergantung pada cakupan, jumlah lini dan pengguna, model penerapan, regulasi, dan besarnya upaya integrasi, dan vendor jarang mempublikasikannya. Beberapa halaman web mencantumkan rentang tanpa sumber; kami tidak mengutipnya. Sebagai gantinya, berikut adalah struktur untuk total biaya kepemilikan (TCO) Anda sendiri serta contoh perhitungan dengan **asumsi ilustratif** yang Anda ganti dengan penawaran dan baseline Anda sendiri.

### Struktur biaya

| Blok biaya | Sekali bayar | Berulang | Catatan |
|---|---|---|---|
| Perangkat lunak | Lisensi perpetual (jika ada) | Langganan atau pemeliharaan (sering kali persentase lisensi per tahun) | Periksa metriknya: situs, pengguna, mesin, konsumsi |
| Jasa implementasi | Konfigurasi, antarmuka, migrasi data, manajemen proyek | Permintaan perubahan | Biasanya blok sekali bayar terbesar |
| Perangkat keras dan jaringan | Terminal, tablet, pemindai, printer label, edge server, Wi-Fi, kabel | Siklus penggantian | Sering diremehkan di pabrik lama |
| Konektivitas mesin | Gateway, pemrograman PLC, retrofit untuk mesin lama | Pemeliharaan | Harga per jenis mesin, bukan per mesin |
| Tim internal | Tim proyek, key user, pengganti pekerjaan rutin mereka | Dukungan MES, administrasi, perbaikan berkelanjutan | Hitung biaya yang dibebankan |
| Pelatihan | Desain dan sesi pelatihan | Karyawan baru, penyegaran | |
| Validasi (yang diatur regulasi) | Rencana validasi, protokol, pelaksanaan | Validasi ulang setelah perubahan dan peningkatan | |
| Hosting dan operasional | Penyiapan | Biaya cloud atau operasional server, cadangan, pemantauan keamanan | |

**Capex vs. opex:** MES berlangganan umumnya termasuk opex; lisensi perpetual, perangkat keras, dan sebagian biaya implementasi dapat dikapitalisasi tergantung kebijakan akuntansi Anda. Berdasarkan US GAAP, ASC 350-40 mengatur perangkat lunak untuk penggunaan internal. Sejak ASU 2018-15 (Agustus 2018), biaya implementasi dari pengaturan cloud yang merupakan kontrak layanan mengikuti tahapan kapitalisasi yang sama, tetapi biaya yang dikapitalisasi disajikan seperti biaya hosting dibayar di muka, diamortisasi selama masa hosting dan ditampilkan pada baris laporan laba rugi yang sama dengan biaya langganan [41]. ASU 2025-06 (September 2025) kembali mengubah ASC 350-40, berlaku untuk periode tahunan yang dimulai setelah 15 Desember 2027, dengan penerapan dini diizinkan [42]. Sepakati perlakuannya dengan auditor Anda. Pilihan akuntansi ini mengubah EBITDA dan waktu pengakuan biaya, bukan keekonomiannya.

### Struktur manfaat

| Lini manfaat | Rumus | Sumber data |
|---|---|---|
| Tambahan throughput pada constraint | Jam produktif tambahan × margin kontribusi per jam | Log downtime MES atau manual, keuangan (hanya jika permintaan tersedia) |
| Pengurangan scrap dan rework | Biaya tahunan scrap dan rework × pengurangan yang diharapkan | Laporan biaya kualitas |
| Waktu tenaga kerja untuk administrasi dan entri data | Jam yang dihemat × tarif yang dibebankan × proporsi yang benar-benar dialihkan | Studi waktu, wawancara |
| Pengurangan WIP dan persediaan | Pelepasan kas sekali; biaya penyimpanan × pengurangan per tahun | Valuasi persediaan |
| Pelepasan batch atau pesanan yang lebih cepat | Pengurangan lead time × nilai (persediaan, pengiriman tepat waktu) | Waktu tinjauan QA, data pesanan |
| Biaya kepatuhan dan recall yang dihindari | Probabilitas × dampak, biasanya tidak masuk kasus dasar | Register risiko |

### Contoh perhitungan: pabrik katup dengan 220 karyawan

**Situasi (semua angka ilustratif):** empat lini, dua shift, pendapatan $85 juta. Lini 2 adalah constraint. Traveler kertas, konfirmasi ERP di akhir shift, tanpa pencatatan downtime otomatis.

**Biaya sekali bayar (tahun 0):**

| Item | Jumlah |
|---|---|
| Jasa implementasi | $450.000 |
| Perangkat keras, jaringan, konektivitas mesin | $160.000 |
| Tim proyek internal (2,5 FTE selama 12 bulan dengan biaya yang dibebankan $120.000) | $300.000 |
| Pelatihan dan pengganti | $60.000 |
| **Total sekali bayar** | **$970.000** |

**Biaya berulang (mulai tahun 1):** langganan $180.000 + dukungan MES internal 1 FTE $120.000 = **$300.000 per tahun**.

**Manfaat pada efek penuh (kasus dasar):**

| Manfaat | Perhitungan | Per tahun |
|---|---|---|
| OEE Lini 2 dari 62% ke 67% | 4.000 jam terencana × 5 poin = 200 jam produktif tambahan × margin kontribusi $2.000 per jam | $400.000 |
| Pengurangan scrap | Biaya scrap $1,2 juta × 15% | $180.000 |
| Waktu administrasi | 4.000 jam × $45 tarif yang dibebankan × 50% dialihkan | $90.000 |
| Biaya penyimpanan WIP | WIP $3,0 juta × pengurangan 10% × tingkat biaya penyimpanan 20% | $60.000 |
| **Total manfaat tahunan** | | **$730.000** |

Ditambah pelepasan kas sekali dari WIP: $3,0 juta × 10% = $300.000 (diasumsikan pada tahun 2).

**Masa peningkatan:** tahun 1 memberikan 40 persen dari manfaat tahunan (pilot dan penerapan bertahap), tahun 2 hingga 5 memberikan 100 persen.

**Arus kas (dalam ribuan $), tingkat diskonto 10%:**

| Tahun | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Kasus dasar | −970 | 730 × 0,4 − 300 = −8 | 730 − 300 + 300 = 730 | 430 | 430 | 430 |
| Kumulatif | −970 | −978 | −248 | 182 | 612 | 1.042 |

NPV pada 10% = −970 − 8/1,1 + 730/1,1² + 430/1,1³ + 430/1,1⁴ + 430/1,1⁵ ≈ **+$510.000**. Simple payback: kas kumulatif menjadi positif selama tahun ke-3, sekitar 2,6 tahun setelah proyek dimulai (248 ÷ 430 = 0,58 dari tahun ke-3).

**Kasus konservatif:** peningkatan OEE hanya setengahnya (atau output tambahan tidak seluruhnya dapat dijual): $200.000 alih-alih $400.000; pengurangan scrap 10 persen ($120.000) alih-alih 15 persen. Manfaat tahunan $470.000, bersih $170.000 per tahun.

| Tahun | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Kasus konservatif | −970 | 470 × 0,4 − 300 = −112 | 470 − 300 + 300 = 470 | 170 | 170 | 170 |
| Kumulatif | −970 | −1.082 | −612 | −442 | −272 | −102 |

NPV pada 10% ≈ **−$334.000**; tidak ada payback dalam lima tahun.

**Analisis sensitivitas:** dengan manfaat scrap, administrasi, dan WIP tetap pada kasus dasar, proyek mencapai titik impas (NPV = 0 pada 10%) dengan manfaat throughput sekitar $243.000 per tahun, yaitu sekitar 121 jam produktif tambahan atau sekitar 3 poin OEE pada Line 2 alih-alih 5. Jika hanya setengah dari peningkatan OEE yang terwujud dan semua yang lain tetap, NPV sekitar −$139.000. Sensitivitas terhadap satu asumsi itulah temuan yang sebenarnya.

**Pelajaran dari contoh ini:**

1. **Satu lini mendominasi.** Manfaat throughput lebih dari separuh kasus dasar. Sebelum menghitungnya, pastikan dengan penjualan bahwa pabrik memang terkendala kapasitas pada lini tersebut, atau gunakan panduan [theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) untuk menemukan kendala yang sebenarnya terlebih dahulu.
2. **Biaya berulang lebih penting daripada yang tampak dari baris lisensi.** Dukungan internal merupakan 40 persen dari biaya berulang di sini dan sering diabaikan.
3. **Peningkatan yang berlarut-larut menggerus NPV.** Pilot yang memakan waktu 18 bulan alih-alih 12 bulan mendorong kasus konservatif semakin merah. Kecepatan mencapai lini stabil pertama adalah variabel finansial.
4. **Manfaat yang tidak dikuantifikasi itu nyata tetapi terpisah.** Pengurangan ruang lingkup penarikan produk, kesiapan audit, dan persyaratan pelanggan dapat membenarkan MES dengan sendirinya dalam rantai pasok yang diatur atau didorong oleh OEM. Tampilkan di samping angka-angka, bukan di dalamnya.
5. **Lacak manfaat setelah go-live** terhadap baseline yang dibekukan, bersama keuangan, selama minimal dua tahun.

Untuk definisi KPI dan biaya di balik baris-baris ini, lihat [KPI manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/).

## KPI MES: apa yang diukur dan bagaimana

MES menghasilkan data untuk sebagian besar KPI lantai produksi. Ada dua kelompok yang penting: KPI operasional yang dihitung MES, dan KPI yang menunjukkan apakah MES itu sendiri berfungsi.

### Definisi standar: ISO 22400

ISO 22400-2:2014 mendefinisikan indikator kinerja utama untuk manajemen operasi manufaktur, dengan rumus, satuan, waktu, dan kelompok pengguna untuk setiap KPI [16]; sumber sekunder menghitung 34 KPI dalam standar tersebut [18], dan amandemen 2017 menambahkan KPI manajemen energi [16]. Menggunakan definisinya membuat KPI dapat dibandingkan antarlini dan antarpabrik. Peneliti NIST menerbitkan struktur hierarkis KPI ini beserta rumusnya, yang tersedia secara gratis [17].

### KPI operasional dari MES

| KPI | Rumus (disederhanakan) | Penggunaan umum |
|---|---|---|
| OEE | Ketersediaan × performa × kualitas | Kendala dan peralatan kunci |
| Ketersediaan | Waktu operasi ÷ waktu produksi terencana | Fokus pada downtime |
| Performa | (Waktu siklus ideal × jumlah total) ÷ waktu operasi | Kehilangan kecepatan, micro-stop |
| Kualitas (tingkat) | Jumlah baik ÷ jumlah total | Scrap dan rework |
| First pass yield | Unit lolos tanpa rework ÷ unit dimulai | Kemampuan proses |
| Rasio scrap | Jumlah scrap ÷ jumlah yang diproduksi | Kehilangan material |
| Kepatuhan jadwal | Pesanan (atau kuantitas) yang selesai sesuai jadwal ÷ yang dijadwalkan | Stabilitas rencana |
| Throughput | Unit baik per jam | Kapasitas |
| WIP | Unit atau nilai antara operasi pertama dan terakhir | Aliran |
| Lead time pesanan | Waktu selesai − waktu rilis | Responsivitas pelanggan |
| MTBF / MTTR | Waktu operasi ÷ kegagalan; waktu perbaikan ÷ kegagalan | Pemeliharaan |

**Contoh perhitungan OEE (satu shift di Line 2):** waktu produksi terencana 450 menit, downtime tidak terencana 60 menit, sehingga waktu operasi 390 menit. Waktu siklus ideal 1,0 menit, jumlah total 340, jumlah baik 323.

- Ketersediaan = 390 ÷ 450 = 86,7%
- Performa = (1,0 × 340) ÷ 390 = 87,2%
- Kualitas = 323 ÷ 340 = 95,0%
- OEE = 0,867 × 0,872 × 0,950 = **71,8%**

Pemeriksaan silang: jumlah baik × waktu siklus ideal ÷ waktu produksi terencana = 323 ÷ 450 = 71,8%. Jika MES Anda tidak lolos pemeriksaan ini, model waktunya tidak konsisten. Muchiri dan Pintelon meninjau definisi OEE yang digunakan beserta jebakannya [30]; panduan [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) membahasnya lebih mendalam.

### KPI untuk MES itu sendiri

| KPI | Definisi | Arah target |
|---|---|---|
| Latensi data | Waktu dari kejadian di lantai produksi hingga tersedia di MES / ERP | Turun (menit, bukan hari) |
| Tingkat penangkapan otomatis | Porsi kuantitas dan status yang ditangkap dari mesin dibanding yang diketik | Naik |
| Tingkat koreksi manual | Koreksi per 100 pesanan | Turun |
| Cakupan kode alasan | Porsi menit downtime dengan alasan yang valid | Naik (di atas 90% adalah target umum) |
| Waktu traceability | Menit untuk menghasilkan trace mundur lengkap untuk satu serial atau lot | Turun |
| Adopsi | Porsi pesanan yang dijalankan sepenuhnya di MES (tanpa jalur kertas, kecuali cadangan gangguan yang terdokumentasi) | Naik (kondisi akhir adalah 100%; bypass yang terus berulang menunjukkan masalah desain, bukan masalah operator) |
| Tingkat error antarmuka | Posting yang gagal atau ditolak per hari | Turun |
| Ketersediaan MES | Uptime selama jam produksi | Naik |

## Orang dan lantai produksi

MES mengubah cara kerja operator setiap menit selama shift. Pabrik yang memperlakukannya sebagai proyek TI cenderung mendapatkan cara-cara pintas; pabrik yang memperlakukannya sebagai perubahan cara kerja akan berhasil mengadopsinya.

**Yang didapat operator:** instruksi terkini di stasiun kerja alih-alih binder, formulir yang lebih sedikit, bantuan yang lebih cepat saat terjadi masalah (panggilan andon dari terminal; lihat pembahasan mendalam tentang [andon](https://www.m365.fm/en/learn/shop-floor-management/andon/)), dan lebih sedikit menyalahkan operator ketika sistem menunjukkan bahwa penghentian disebabkan oleh proses di hulu.

**Yang ditakutkan operator, sering kali dengan alasan yang masuk akal:** diawasi setiap menit, diblokir oleh sistem yang keliru, dan kehilangan penilaian karena bergantung pada layar. Tangani masing-masing secara langsung:

- **Pengawasan:** Tetapkan dan umumkan data tenaga kerja apa yang dicatat MES, siapa yang dapat melihatnya, dan untuk apa digunakan. Gunakan data kinerja untuk memperbaiki proses, bukan untuk meranking individu. Di pabrik yang beserikat, pengenalan pemantauan elektronik dan perubahan aturan kerja dapat menjadi subjek perundingan wajib; libatkan serikat pekerja sejak awal dan dapatkan pandangan dari penasihat hukum ketenagakerjaan [unverified: penilaian hukum bergantung pada kontrak dan doktrin NLRB yang berlaku saat ini].
- **Diblokir oleh sistem yang keliru:** Berikan operator cara yang cepat dan terlihat untuk melaporkan instruksi yang salah atau blokir yang salah, dan selesaikan laporan tersebut dalam hitungan hari. Setiap laporan yang belum diselesaikan mengajarkan lantai produksi untuk mencari cara pintas.
- **Penilaian:** Gunakan penghentian keras hanya untuk langkah yang kritis bagi keselamatan dan kualitas. Untuk sisanya, berikan peringatan dan catat.

**Libatkan operator dalam perancangan.** Dua atau tiga operator per area dalam lokakarya desain, operator yang menguji layar sebelum go-live, dan operator sebagai pelatih rekan kerja adalah langkah yang murah dan efektif. Menghormati manusia adalah masukan desain, bukan slide manajemen perubahan; lihat [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) untuk prinsipnya.

**Ergonomi dan keselamatan di terminal:** tempatkan terminal di lokasi kerja, pada ketinggian berdiri, dapat dibaca di bawah pencahayaan pabrik, dan dapat digunakan dengan sarung tangan. Pemindai tidak boleh menambah jarak berjalan. MES yang menambah 30 detik per operasi pada takt time 60 detik sudah gagal sebelum go-live.

## Kesalahan umum dalam implementasi MES

| # | Kesalahan | Yang terjadi | Lebih baik |
|---|---|---|---|
| 1 | Membeli fitur sebelum mendefinisikan model data | Antarmuka rusak karena ID yang tidak cocok, KPI berbeda antar sistem | Hierarki peralatan, pemilik master data, dan model waktu terlebih dahulu |
| 2 | Mendigitalkan proses kertas yang ada secara satu-satu | Pemborosan yang sama, kini ada di layar | Sederhanakan proses dalam penelusuran aliran nilai terlebih dahulu |
| 3 | Lingkup "semua yang ada dalam daftar MESA-11" | Proyek bertahun-tahun, tidak ada yang berjalan | Satu aliran nilai, tiga sampai lima kasus penggunaan, aktif dalam hitungan bulan |
| 4 | Kustomisasi alih-alih konfigurasi | Pembaruan menjadi proyek; vendor menolak dukungan | Terima proses standar jika tidak menjadi pembeda |
| 5 | Tidak melibatkan operator | Cara pintas, sistem bayangan berbasis kertas | Operator dalam perancangan, pengujian, dan pelatihan |
| 6 | ERP dan MES sama-sama menguasai data yang sama | Jumlah dan waktu yang saling bertentangan | Satu master per atribut, terdokumentasi |
| 7 | Penghentian keras di mana-mana | Lini berhenti karena alasan sepele; kepercayaan runtuh | Penghentian keras hanya jika diperlukan oleh keselamatan atau kualitas |
| 8 | Mengabaikan jaringan dan terminal | Layar lambat, pemindaian gagal | Survei lokasi dan peningkatan jaringan pada fase 2 |
| 9 | Tidak ada cadangan saat gangguan | Produksi berhenti ketika MES atau WAN gagal | Cadangan kertas yang diuji dan kemampuan edge luring |
| 10 | Desain keamanan yang lemah | Jaringan datar antara kantor dan mesin | Zona dan conduit sesuai ISA/IEC 62443; hak akses minimum [23][24] |
| 11 | Tidak ada pemilik setelah go-live | MES menurun; kualitas data turun | Tim MES yang dimiliki pabrik dan KPI untuk adopsi |
| 12 | Manfaat tidak pernah diukur | Studi kasus bisnis untuk situs berikutnya tidak memiliki bukti | Baseline yang dibekukan, keuangan melacak manfaat selama dua tahun |
| 13 | Validasi yang diremehkan (industri regulasi) | Penundaan hingga berbulan-bulan | Validasi berbasis risiko direncanakan sejak fase 1 |
| 14 | Menganggap UNS atau platform data sebagai MES | Data ada di mana-mana, tanpa penegakan, tanpa catatan | MES untuk eksekusi dan catatan; UNS untuk distribusi |

## Batasan MES dan ISA-95

Bersikap jujur tentang batasannya membantu Anda memutuskan apa yang tidak perlu dibeli.

### Batasan MES

1. **MES tidak memperbaiki proses yang rusak.** Jika routing salah, material kurang, atau pabrik berjalan tanpa standard work, MES hanya membuat masalah ini terlihat lebih cepat. Itu berguna, tetapi bukan solusinya. Dasar-dasar Lean sebaiknya dibenahi terlebih dahulu; lihat [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) dan [5S and visual management](https://www.m365.fm/en/learn/5s-visual-management/).
2. **Kualitas data bergantung pada manusia.** Entri manual, pemindaian, dan kode alasan hanya sebaik disiplin dan desain layar yang digunakan.
3. **Sistem yang kaku sulit berubah.** MES yang sangat dikustomisasi dapat memperlambat pengenalan produk dan perubahan proses, padahal pabrik dengan high-mix membutuhkan hal yang sebaliknya.
4. **Biaya dan usaha tinggi untuk pabrik kecil.** Untuk job shop dengan 30 orang, kontrol shop floor ERP, alat pengumpulan data sederhana, dan visual management yang baik mungkin sudah memberikan sebagian besar nilainya.
5. **Perencanaan bukan eksekusi.** MES dengan modul penjadwalan tidak menggantikan sales and operations planning atau MRP; lihat [S&OP, MRP and production planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/).
6. **Analitik sebaiknya berada di tempat lain dalam skala besar.** Analitik lintas pabrik, AI, dan riwayat jangka panjang biasanya lebih tepat berada di platform data yang diisi oleh MES, bukan di dalam MES. Panduan [digital twin](https://www.m365.fm/en/learn/digital-twin-manufacturing/) dan pembahasan mendalam [process mining](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) menunjukkan apa saja yang dapat diisi oleh data MES.

### Batasan ISA-95

1. **Standar ini bersifat abstrak.** ISA-95 secara desain tidak bergantung pada teknologi [1]. Standar ini menjelaskan apa yang perlu dinamai dan dipertukarkan, bukan cara membangunnya, sehingga dua produk yang sama-sama "ISA-95 compliant" tetap bisa sulit diintegrasikan.
2. **Model level bukan jalur data.** Dibaca secara harfiah, hierarki ini menyiratkan data bergerak level demi level melalui antarmuka point-to-point. Arsitektur modern (UNS, event streaming, cloud) tidak bekerja seperti itu; ISA sendiri kini menekankan level sebagai batas, bukan sebagai pipa [1][2].
3. **Teks standarnya berbayar dan panjang.** Banyak tim bekerja dari ringkasan sekunder, yang menghasilkan interpretasi yang tidak konsisten. Belilah setidaknya Bagian 1 dan 3 untuk pustaka proyek.
4. **Kepatuhan tidak bersertifikat.** Tidak ada sertifikasi ISA-95 formal untuk produk, seperti skema sertifikasi keamanan produk yang dimiliki ISA/IEC 62443 [unverified: tidak ditemukan program sertifikasi produk ISA-95]. "ISA-95 compliant" dalam brosur adalah klaim vendor.
5. **Batas antarmuka ditarik secara berbeda dalam praktik.** Aktivitas penjadwalan, kualitas, dan pemeliharaan berada di sistem yang berbeda di setiap pabrik; model aktivitas mengakomodasi hal itu, tetapi tidak memutuskannya untuk Anda.

## Glosarium

| Istilah | Arti |
|---|---|
| Model aktivitas | Model aktivitas Level 3 dari ISA-95 Bagian 3: empat kategori operasi, masing-masing delapan aktivitas generik [3] |
| APS | Advanced planning and scheduling; perangkat lunak penjadwalan dengan kapasitas terbatas (finite capacity scheduling) |
| Catatan as-built | Catatan tentang bagaimana satu unit atau batch tertentu benar-benar diproduksi |
| B2MML | Business To Manufacturing Markup Language; implementasi XML untuk objek ISA-95, dibuat oleh MESA [5] |
| Catatan batch (eBR) | Catatan produksi dan kendali untuk satu batch; catatan batch elektronik bila disimpan dalam MES |
| CMMS / EAM | Sistem manajemen pemeliharaan terkomputerisasi / manajemen aset perusahaan |
| MES yang dapat disusun (composable MES) | Istilah vendor untuk MES yang dibangun dari aplikasi-aplikasi kecil di atas platform bersama |
| Penjadwalan rinci | Aktivitas ISA-95 yang mengurutkan pekerjaan pada sumber daya dalam Level 3 [3] |
| Catatan riwayat perangkat (DHR) | Istilah perangkat medis untuk catatan produksi suatu perangkat atau lot; lihat QMSR [20] |
| Dispatching | Melepaskan pekerjaan berikutnya ke suatu sumber daya [3] |
| Hierarki peralatan | Struktur berbasis peran ISA-95: enterprise, site, area, work center, work unit |
| ERP | Enterprise resource planning; sistem bisnis ISA-95 Level 4 |
| Genealogi | Keterkaitan antara material masukan dan unit keluaran (penelusuran maju dan mundur) |
| Historian | Basis data deret waktu untuk nilai proses |
| IEC 62264 | Publikasi internasional dari ISA-95 [1][7] |
| ISA-88 | Standar kendali batch, digunakan untuk struktur resep |
| ISA-95 | ANSI/ISA-95, Enterprise-Control System Integration, delapan bagian [1] |
| ISA/IEC 62443 | Rangkaian standar untuk keamanan sistem otomasi dan kendali industri [23] |
| ISO 22400 | Standar KPI dalam manajemen operasi manufaktur [16] |
| LIMS | Laboratory information management system (sistem informasi manajemen laboratorium) |
| MES | Manufacturing execution system; perangkat lunak Level 3 berorientasi produksi untuk menjalankan dan mencatat produksi [8] |
| MESA-11 | Model 11 fungsi MES dari MESA International tahun 1997 [9][12] |
| MOM | Manufacturing operations management; ISA-95 Level 3 secara keseluruhan |
| MQTT | Protokol pesan publish/subscribe yang ringan, umum di IIoT |
| MTConnect | Standar terbuka untuk data peralatan manufaktur (ANSI/MTC1.4-2018) [22] |
| OEE | Overall equipment effectiveness = ketersediaan × kinerja × kualitas |
| OPC UA | Standar komunikasi dan pemodelan informasi industri yang netral terhadap vendor, milik OPC Foundation |
| Bagian 11 | 21 CFR Part 11, aturan FDA untuk catatan dan tanda tangan elektronik [19] |
| Model Purdue | Purdue Reference Model for computer integrated manufacturing, dasar dari level ISA-95 [1] |
| QMS | Quality management system (perangkat lunak untuk ketidaksesuaian, CAPA, dokumen, audit) |
| Tinjauan berdasarkan pengecualian (review by exception) | Tinjauan catatan batch yang berfokus pada penyimpangan yang ditandai sistem |
| SCADA | Supervisory control and data acquisition; perangkat lunak supervisi Level 2 |
| Sparkplug | Spesifikasi Eclipse di atas MQTT untuk muatan dan status (sertifikat kelahiran dan kematian) [28] |
| Unified namespace (UNS) | Pola arsitektur: broker pusat dengan pohon topik hierarkis yang memuat kondisi terkini bisnis |
| WMS | Warehouse management system (sistem manajemen gudang) |
| Work center / work unit | Level hierarki peralatan ISA-95 di bawah area |

## FAQ

### Apa itu sistem eksekusi manufaktur dalam istilah sederhana?

Ini adalah perangkat lunak yang memberi tahu lantai produksi apa yang harus dikerjakan berikutnya dan mencatat apa yang sebenarnya terjadi, pesanan demi pesanan dan langkah demi langkah. Gartner mendefinisikannya sebagai perangkat lunak berorientasi produksi yang mengelola, memantau, dan menyinkronkan eksekusi proses fisik secara real-time yang mengubah bahan baku menjadi produk [8].

### Apa fungsi utama MES?

Model aktivitas ISA-95 mencantumkan delapan aktivitas generik untuk operasi produksi: manajemen definisi produk, manajemen sumber daya, penjadwalan rinci, dispatching, manajemen eksekusi, pengumpulan data, pelacakan, dan analisis kinerja [3]. Model MESA tahun 1997 mencantumkan 11 fungsi, dengan menambahkan kontrol dokumen, manajemen tenaga kerja, manajemen kualitas, manajemen proses, dan manajemen pemeliharaan [9].

### Apa manfaat MES?

Data produksi yang ditangkap langsung di sumbernya alih-alih diketik ulang, waktu tunggu pesanan yang lebih singkat melalui rilis dan dispatch yang lebih cepat, lebih sedikit lolosnya cacat kualitas melalui pemeriksaan yang diberlakukan, penarikan produk (recall) yang lebih cepat dan lebih sempit melalui genealogi lot dan nomor seri, downtime pada titik kendala yang lebih terlihat, serta catatan elektronik yang siap diaudit. Setiap manfaat bergantung pada suatu syarat: data induk yang benar, pemeriksaan yang dikonfigurasi sebagai penghentian keras (hard stop), pemindaian material yang disiplin, dan keluaran yang benar-benar dapat dijual. Bagian 1 mencantumkan apa yang perlu diukur untuk masing-masing manfaat tersebut.

### Apa itu ISA-95 dalam istilah sederhana?

ISA-95 (IEC 62264) adalah standar internasional untuk mengintegrasikan sistem perusahaan seperti ERP dengan sistem kontrol manufaktur. Standar ini mendefinisikan level, hierarki peralatan, model objek, dan model aktivitas agar TI, OT, dan bisnis menggunakan kosakata yang sama [1].

### Apa saja lima level ISA-95?

Level 0 adalah proses fisik, Level 1 sensing dan manipulasi, Level 2 pemantauan dan kontrol supervisi, Level 3 manajemen operasi manufaktur (MES dan sistem terkait), dan Level 4 perencanaan bisnis dan logistik (ERP) [1].

### Apakah ISA-95 sama dengan IEC 62264?

Isinya selaras: ISA menerbitkan ANSI/ISA-95, IEC menerbitkan IEC 62264. Edisi dan penomorannya berbeda; ANSI/ISA-95 Part 1 tahun 2025 merupakan adopsi termodifikasi dari IEC 62264-1 [1][2], dan IEC 62264-6 terbit pada 2020 [6]. Selalu sebutkan bagian dan edisinya.

### Berapa bagian yang dimiliki ISA-95?

Delapan: model dan terminologi; objek dan atribut untuk integrasi enterprise-control; model aktivitas MOM; objek dan atribut untuk integrasi MOM; transaksi bisnis-ke-manufaktur; model layanan pesan; model layanan alias; profil pertukaran informasi [1].

### Apa itu Level 3 dalam ISA-95?

Level 3 adalah manajemen operasi manufaktur: aktivitas yang mengubah rencana menjadi produk, dalam kerangka waktu hari, shift, jam, menit, dan detik [4]. Level ini mencakup operasi produksi, pemeliharaan, pengujian kualitas, dan persediaan [3]. MES adalah sistem Level 3 yang paling umum.

### Apa perbedaan antara MES dan ERP?

ERP (Level 4) merencanakan apa yang akan dibuat dan mencatatnya secara akuntansi dalam kerangka waktu bulan hingga hari. MES (Level 3) mengeksekusi dan mencatat bagaimana setiap pesanan sebenarnya dibuat, dalam kerangka shift hingga detik [4]. ERP menyimpan catatan keuangan; MES menyimpan catatan as-built. Keduanya saling bertukar pesanan, konfirmasi, dan pergerakan material.

### Apakah saya memerlukan MES jika sudah memiliki ERP?

Belum tentu. Ajukan empat pertanyaan: apakah Anda perlu mencatat per langkah, nomor seri, dan parameter, bukan hanya per operasi; apakah keputusan bergantung pada menit, bukan konfirmasi di akhir shift; apakah sistem harus mencegah langkah yang salah, bukan sekadar mencatatnya; dan apakah Anda memerlukan catatan riwayat batch dan perangkat secara elektronik? Jika keempat jawabannya tidak, kontrol lantai produksi ERP mungkin sudah cukup. Jika dua atau lebih jawabannya ya, Anda memerlukan fungsi MES, dari vendor ERP, vendor MES, atau sebuah platform (bagian 5).

### Apa perbedaan antara MES dan SCADA?

SCADA mengawasi dan mengontrol mesin serta proses secara real-time (tag, alarm, setpoint). MES mengelola pesanan, material, tenaga kerja, kualitas, dan catatan. SCADA mengetahui bahwa sebuah mesin sedang berjalan; MES mengetahui pesanan mana, lot material mana, dan operator mana yang sedang dilayaninya.

### Apa perbedaan antara MES dan MOM?

MOM (manufacturing operations management) adalah istilah ISA-95 untuk seluruh Level 3, termasuk operasi produksi, kualitas, pemeliharaan, dan persediaan. MES biasanya merujuk pada inti produksi; banyak "MOM suite" sebenarnya adalah produk MES dengan modul tambahan [10].

### Apa itu B2MML?

B2MML adalah implementasi XML dari model objek ISA-95, dibuat oleh MESA International dan digunakan di banyak antarmuka ERP-MES; pemetaan ISA-95 pada OPC UA mengikuti B2MML bila memungkinkan [5]. Setelah MESA dibubarkan pada 30 Juni 2026, ISA mengambil alih konten MESA [11].

### Bagaimana ISA-95 terintegrasi dengan sistem ERP?

ISA-95 mendefinisikan antarmuka antara Level 4 (ERP) dan Level 3 (MES dan sistem operasi lainnya). Bagian 2 dan 4 mendefinisikan objek yang dipertukarkan, dan Bagian 5 mendefinisikan transaksinya. Dalam praktik, ERP mengirim definisi produk, perintah produksi, dan data material ke bawah; MES mengirim konfirmasi operasi, pergerakan barang, notifikasi kualitas, dan status ke atas. B2MML mengimplementasikan model objek ISA-95 dalam XML [5]. Model bersama mempersingkat pekerjaan spesifikasi, tetapi setiap proyek tetap harus memutuskan sistem mana yang menjadi master untuk setiap field dan peristiwa mana yang memicu posting (bagian 7).

### Apakah unified namespace menggantikan ISA-95 atau MES?

Tidak. UNS adalah cara untuk memindahkan dan membagikan data kondisi terkini melalui broker. UNS membutuhkan ISA-95 (atau model serupa) untuk penamaan dan semantik, serta membutuhkan MES dan ERP untuk logika bisnis dan catatan yang dapat diaudit.

### Berapa biaya MES?

Biayanya bergantung pada cakupan, jumlah lini, model penerapan, integrasi, dan regulasi, dan vendor jarang mempublikasikan harga. Susun total biaya kepemilikan lima tahun Anda sendiri dengan blok biaya di bagian 13; di pabrik ilustratif kami dengan 220 karyawan, biaya satu kali sebesar $970.000 dan biaya berulang $300.000 per tahun.

### Berapa lama implementasi MES?

Untuk satu pabrik dengan produk yang sudah dikonfigurasi, rencanakan sekitar enam hingga dua belas bulan untuk mencapai pilot yang stabil, dan gelombang berikutnya tiga hingga enam bulan [unverified: asumsi perencanaan praktisi]. Pabrik yang diatur regulasi dan pembangunan kustom membutuhkan waktu lebih lama.

### Apakah SAP adalah MES?

ERP inti SAP memiliki fungsi pengendalian shop floor; SAP juga menjual produk manufacturing execution terpisah. Apakah fungsi ERP sudah cukup bergantung pada granularitas, latensi, penegakan, dan kebutuhan regulasi yang dijelaskan di bagian 5.

### Apakah produsen kecil membutuhkan MES?

Tidak selalu. Bengkel kerja kecil sering kali dapat memperoleh sebagian besar nilai dari konfirmasi shop floor ERP, pemantauan mesin sederhana, dan manajemen visual yang baik. MES menjadi perlu ketika Anda membutuhkan penegakan langkah, silsilah serial, catatan batch elektronik, atau keputusan hampir real-time. Manufacturing Extension Partnership (MEP) NIST, yang berfokus pada produsen kecil dan menengah, adalah tempat netral vendor untuk meminta penilaian [31].

### Apa itu cloud MES atau composable MES?

Cloud MES berjalan sebagai layanan di cloud vendor; composable MES dibangun dari aplikasi-aplikasi kecil di atas platform bersama. Keduanya dapat berfungsi; periksa perilaku offline di edge, model data bersama, dan jika diatur regulasi, bagaimana siklus rilis vendor sesuai dengan validasi Anda.

### Apakah ISA-95 masih relevan dengan IIoT dan platform cloud?

Ya. ISA menyatakan bahwa level-level tersebut masih membantu menggambarkan batas sistem untuk Industri 4.0 [1], dan edisi Bagian 1 tahun 2025 ditulis untuk arsitektur modular yang berpusat pada data [2]. Yang sudah usang adalah gagasan bahwa data harus naik level demi level.

### Apa kelemahan ISA-95?

Standar ini bersifat abstrak dan memberi tahu Anda apa yang harus dinamai dan dipertukarkan, bukan cara membangunnya. Dibaca secara harfiah, model levelnya menyiratkan data harus naik level demi level, yang tidak dilakukan oleh arsitektur modern berbasis peristiwa. Teks standar berbayar dan panjang, sehingga tim sering bekerja dari ringkasan yang tidak konsisten. "Sesuai ISA-95" adalah klaim vendor, bukan sertifikasi. Dan standar ini tidak memutuskan di mana pabrik Anda menarik batas antara sistem MES, kualitas, dan pemeliharaan (bagian 17).

### KPI apa yang harus dilacak MES?

OEE dan komponennya, first pass yield, rasio scrap, kepatuhan jadwal, throughput, WIP, lead time, dan MTBF/MTTR, didefinisikan sesuai ISO 22400-2 [16][17]. Lacak juga MES itu sendiri: latensi data, tingkat penangkapan otomatis, adopsi, dan waktu telusur.

### Apa yang diwajibkan 21 CFR Part 11 dari MES?

Untuk sistem tertutup: validasi, salinan rekaman yang akurat, perlindungan rekaman, akses terbatas pada individu yang berwenang, dan jejak audit yang aman, dihasilkan komputer, dan bercap waktu yang tidak mengaburkan entri sebelumnya, di antara kontrol lainnya [19]. Tanda tangan elektronik harus ditautkan ke rekamannya.

## Kesimpulan dan langkah pertama

Sistem manufacturing execution (MES) layak dengan biayanya ketika sistem itu menutup lingkaran antara rencana dan kenyataan lebih cepat dan lebih andal daripada yang bisa dilakukan orang dengan kertas dan spreadsheet. ISA-95 memberi Anda peta untuk itu: levelnya menunjukkan di mana MES berada, hierarki peralatan memberi setiap sistem nama yang sama, model objek mendefinisikan apa yang dipertukarkan ERP dan MES, dan matriks 4 × 8 pada model aktivitas menunjukkan sistem mana yang harus memiliki tiap pekerjaan. Unified namespace dan platform cloud mengubah infrastrukturnya, bukan pembagian tanggung jawab tersebut.

Proyek yang berhasil memiliki pola yang sama: mereka mulai dari value stream dan model data, melakukan pilot pada satu lini dengan baseline yang dibekukan, melibatkan operator sejak lokakarya pertama, mempertahankan hard stop untuk hal-hal yang benar-benar penting, dan mengukur manfaat bersama keuangan selama bertahun-tahun. Contoh kerja menunjukkan alasannya: MES yang sama bisa menjadi investasi yang baik atau buruk, tergantung pada apakah keuntungan dari constraint dapat dijual dan seberapa cepat pilot menjadi stabil.

**30 hari pertama Anda:**

- [ ] Telusuri satu value stream dan tandai setiap tempat di mana informasi diketik ulang, tertunda, atau hilang
- [ ] Isi matriks aktivitas ISA-95 (4 × 8) untuk value stream tersebut: siapa yang melakukan setiap aktivitas saat ini?
- [ ] Susun draf hierarki peralatan untuk area pilot dan sepakati nama-namanya bersama tim maintenance dan IT
- [ ] Bekukan baseline: OEE pada constraint, biaya scrap, lead time order, waktu ketertelusuran
- [ ] Tanyakan kepada penjualan dan keuangan apakah output tambahan dari constraint dapat dijual, dan pada contribution margin berapa
- [ ] Daftarkan kebutuhan catatan regulasi Anda (Part 11, QMSR, FSMA 204, persyaratan pelanggan)
- [ ] Bicarakan dengan dua pabrik sejawat yang menjalankan MES, tanpa kehadiran vendor
- [ ] Beli ISA-95 Bagian 1 dan 3 untuk pustaka proyek

---

## Bacaan lanjutan di m365.fm

**Panduan terkait**
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/): arsitektur cloud, unified namespace di Azure IoT Operations, platform data
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

**Kajian mendalam**
- [Paperless Manufacturing and Digital Work Instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Andon System](https://www.m365.fm/en/learn/shop-floor-management/andon/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Process Mining in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/)
- [Manufacturing Workforce Skills](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Istilah glosarium (entitas)**
[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Gastgeber von m365.fm und arbeitet bei iFAKT GmbH. Auf m365.fm schreibt er über Lean Manufacturing, operative Exzellenz und die digitale Transformation der Produktion, einschließlich der Systeme und Datenmodelle, die den Shopfloor mit der Planung verbinden.

**Hinweis: Der Autor arbeitet bei iFAKT GmbH.**

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
