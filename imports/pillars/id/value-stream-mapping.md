# SEO metadata

| Field | Value |
|---|---|
| Meta title | Pemetaan Aliran Nilai: Simbol, Metrik & Contoh Lengkap |
| Meta description | Pemetaan aliran nilai (VSM) langkah demi langkah: simbol, rumus takt time dan lead time, contoh perhitungan lengkap, desain kondisi masa depan, dan perangkat lunak VSM. |
| Slug | `value-stream-mapping` |

# Pemetaan Aliran Nilai: Panduan Lengkap Simbol VSM, Metrik, Desain Kondisi Masa Depan, dan Manajemen Aliran Nilai

> **Jawaban singkat:** Value stream mapping (VSM) adalah metode Lean untuk menggambarkan aliran material dan informasi dari satu famili produk, dari pemasok hingga pelanggan, dalam satu halaman dengan simbol standar. Sebuah garis waktu dengan lead time, waktu proses, dan hari persediaan menunjukkan betapa kecilnya bagian dari total waktu yang benar-benar menambah nilai. Peta kondisi masa depan kemudian merancang aliran yang lebih ramping, dan rencana implementasi memastikan hal itu terwujud.

Di banyak pabrik, sebuah pesanan berada di dalam pabrik selama tiga atau empat minggu, sementara pekerjaan aktual pada pesanan tersebut hanya menghabiskan beberapa menit. Wikipedia berbahasa Jerman memberikan contoh khas: empat minggu lead time berbanding sepuluh menit waktu proses murni [27]. Jika Anda hanya melihat mesin satu per satu, kesenjangan ini tidak akan terlihat. Value stream mapping memaksa Anda melihat keseluruhan aliran: Di mana material menumpuk? Mengapa ia menumpuk di sana? Siapa yang memberi tahu setiap proses apa yang harus diproduksi berikutnya, dan kapan?

Panduan ini menjelaskan metode tersebut dari dasar. Anda mendapatkan seluruh kumpulan simbol, panduan langkah demi langkah, setiap metrik penting beserta rumus dan contoh perhitungan lengkap, pedoman desain untuk kondisi masa depan, batasan metode berbasis kertas, value stream mapping dinamis dan digital, Value Stream 4.0, manajemen value stream sebagai tugas kepemimpinan, serta ikhtisar netral kategori perangkat lunak. Untuk definisi ringkas, lihat halaman entitas m365.fm [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/).

Catatan tentang sumber: value stream mapping (dalam bahasa Jerman: *Wertstromanalyse*) memiliki tradisi riset yang kuat di Jerman, di antaranya di Fraunhofer IPA dan TU Darmstadt. Jika sebuah sumber berbahasa Jerman menambahkan sesuatu yang tidak ada dalam literatur berbahasa Inggris, hal itu tetap dicantumkan dalam teks dengan penjelasan singkat.

### Poin-poin kunci

- Value stream mapping selalu menelaah satu **famili produk** dan seluruh aliran dari pintu ke pintu, bukan mesin atau departemen secara terpisah.
- Anda menggambar **dari pelanggan ke arah hulu**, dengan pensil, di lantai produksi pada gemba (istilah Jepang yang berarti "tempat yang sebenarnya", di sini lantai produksi).
- Metrik inti adalah **takt time, cycle time, hari persediaan, lead time, dan flow ratio** (juga disebut process cycle efficiency atau activity ratio). Hari persediaan mengikuti Hukum Little: persediaan dibagi permintaan.
- Peta kondisi saat ini hanyalah separuh dari metode. Hasil diperoleh dari **peta kondisi masa depan** yang dibangun dengan pedoman desain yang jelas, dan **rencana implementasi** dengan penanggung jawab dan tanggal.
- Peta klasik adalah **potret sesaat** yang dibangun dari rata-rata. Dengan variasi produk yang tinggi dan permintaan yang fluktuatif, simulasi dinamis serta data yang dikumpulkan secara otomatis memperluas analisis.
- **Manajemen value stream** mengubah lokakarya sekali jalan menjadi tugas kepemimpinan yang berkelanjutan dengan manajer value stream yang bertanggung jawab.

### Jalur baca bagi pembaca yang sibuk

| Anda adalah … | Baca lebih dahulu |
|---|---|
| Baru mengenal Lean, atau mahasiswa | Bagian 1 sampai 4 (definisi, sejarah, tujuan, simbol) |
| Fasilitator pertama kali atau coach Lean | Bagian 5 sampai 8 (panduan langkah demi langkah dengan agenda lokakarya, metrik, contoh, desain kondisi masa depan) dan 14 (kesalahan umum) |
| Manajer pabrik atau pemimpin operasi | Bagian 7 (contoh dengan angka kondisi saat ini dan masa depan), bagian 10 sampai 13 (batasan, VSM dinamis dan digital, Value Stream 4.0, manajemen value stream) |
| Pimpinan TI, MES, atau Microsoft 365/Azure | Bagian 11 (VSM dinamis dan digital), 12 (Value Stream 4.0), dan 15 (kategori perangkat lunak) |

## Daftar Isi

1. Apa Itu Value Stream Mapping? Definisi dan Perbedaannya dengan Process Mapping
2. Sejarah: Dari Diagram Aliran Material dan Informasi Toyota hingga "Learning to See"
3. Tujuan dan Manfaat Value Stream Mapping
4. Simbol Value Stream Mapping: Tabel Referensi Lengkap
5. Cara Membuat Value Stream Map: Panduan Langkah demi Langkah untuk Kondisi Saat Ini
6. Metrik dan Rumus Value Stream Mapping
7. Contoh Value Stream Mapping: Satu Value Stream Dihitung Secara Lengkap
8. Future State Mapping: Pedoman Desain dari Rother/Shook dan Erlach
9. Menemukan Pemborosan: 8 Pemborosan dan Spaghetti Diagram
10. Keterbatasan Value Stream Mapping Tradisional
11. Value Stream Mapping Dinamis dan Digital
12. Value Stream 4.0: Logistik Informasi sebagai Dimensi Kedua
13. Value Stream Management: Menjalankan Value Stream sebagai Tugas Kepemimpinan
14. Kesalahan Umum dalam Value Stream Mapping dan Cara Menghindarinya
15. Perangkat Lunak Value Stream Mapping: Perbandingan Kategori
16. Digital Value Stream Mapping dengan iFAKT Polaris VSM dan BSM
17. Value Stream Management dalam Pengembangan Perangkat Lunak: Perbedaannya
18. Bukti dan Publikasi Penelitian
19. FAQ: Jawaban atas Pertanyaan tentang Value Stream Mapping
20. Kesimpulan

## 1. Apa Itu Value Stream Mapping? Definisi dan Perbedaannya dengan Process Mapping

Lean Enterprise Institute (LEI) mendefinisikan value stream mapping sebagai "menggambarkan setiap langkah yang terlibat dalam aliran material dan informasi yang diperlukan untuk membawa produk dari pesanan hingga pengiriman" [45]. ASQ menyebutnya "alat lean yang menggunakan diagram alir yang mendokumentasikan setiap langkah dalam proses" [46]. Secara lebih tepat: untuk satu keluarga produk, value stream map menunjukkan setiap aktivitas yang diperlukan untuk membawa produk dari bahan baku hingga ke pelanggan. Itu mencakup aktivitas yang menambah nilai dan yang tidak menambah nilai, aliran material fisik, serta aliran informasi yang mengendalikannya. Hasilnya muat dalam satu lembar besar, biasanya 11 × 17 in (tabloid, mendekati ukuran A3 yang digunakan di Eropa), dan digambar dengan simbol standar.

**Value stream** adalah jumlah dari aktivitas-aktivitas tersebut. Dalam bahasa Inggris, "value stream mapping" dan "VSM" adalah istilah standar; "value stream analysis" juga digunakan, terutama untuk pekerjaan kondisi saat ini. Klaus Erlach dari Fraunhofer Institute for Manufacturing Engineering and Automation IPA di Stuttgart menarik garis tegas antara **value stream analysis** (mencatat dan menilai kondisi saat ini) dan **value stream design** (merancang kondisi masa depan) [3][4]. Keduanya bersama-sama membentuk metode value stream. Asosiasi teknik industri Jerman REFA mendefinisikan analisis dengan cara serupa, yaitu sebagai metode untuk menunjukkan semua proses dan aliran dari suatu proses bernilai tambah [37].

Sejak Maret 2020 ada standar internasional, **ISO 22468:2020 "Value stream management (VSM)"**. ISO menggambarkannya sebagai pedoman untuk mengumpulkan, mengevaluasi, dan terus meningkatkan data value stream serta menilai value stream dengan KPI yang ditetapkan, berlaku untuk proses yang berkaitan dengan material, energi, dan data [40]. Daftar isi (diterbitkan oleh DIN, badan standar Jerman) menyusun value stream management menjadi prosedur dasar, value stream analysis, value stream design, value stream planning, serta penilaian dan penyesuaian value stream, dengan lampiran informatif tentang data box dan contoh penerapan [40]. ISO mengonfirmasi standar ini masih berlaku dalam tinjauan 2025 [40]. Ini merupakan referensi yang berguna jika Anda ingin menempatkan metode ini dalam sistem produksi di seluruh perusahaan.

### Perbedaan VSM dengan metode terkait

| Metode | Fokus | Perbedaan dengan value stream mapping |
|---|---|---|
| Process mapping / diagram alir | prosedur individual, sering dalam satu departemen | tidak ada aliran informasi, tidak ada persediaan, tidak ada garis waktu |
| Material flow analysis | rute transportasi, kuantitas, tata letak | melihat logistik, bukan bagaimana informasi mengendalikan aliran |
| Value analysis / value engineering (di Jerman: VDI 2800) | fungsi dan biaya produk | berkaitan dengan produk, bukan dengan aliran |
| Porter's value chain | aktivitas strategis perusahaan | model manajemen, bukan diagram aliran operasional; Wikipedia berbahasa Inggris membuat perbedaan yang sama [49] |
| Swimlane diagram / BPMN | proses bisnis dengan penanggung jawab | kuat di kantor, lebih lemah dalam hal persediaan dan takt |
| Simulation | perilaku sistem yang bergantung pada waktu | dinamis dan terperinci tetapi memerlukan lebih banyak usaha; melengkapi VSM (lihat bagian 11) |

Yang membuat value stream mapping berbeda adalah kombinasi tiga hal dalam satu halaman: aliran material, aliran informasi, dan garis waktu. Pengantar *Learning to See* menjelaskan bahwa Toyota mengajarkan tiga aliran dalam manufaktur (material, informasi, dan orang/proses), dan metode pemetaan ini mencakup dua yang pertama sehingga produsen "berpikir tentang aliran alih-alih proses produksi yang terpisah-pisah" [1].

## 2. Sejarah: Dari Diagram Aliran Material dan Informasi Toyota ke "Learning to See"

Value stream mapping berasal dari Toyota Production System. Di Toyota, alat ini disebut "Material and Information Flow Mapping". Praktisi Toyota menggunakannya untuk menggambarkan kondisi saat ini dan kondisi ideal ketika merencanakan implementasi Lean, bukan sebagai alat pelatihan [1]. Istilah "value stream" sendiri jarang terdengar di Toyota [1]. Leksikon LEI juga menggambarkan alat ini sebagai pengembangan Toyota yang oleh Toyota disebut diagram aliran material dan informasi [45].

Mike Rother menemukan metode pemetaan ini saat mempelajari praktik implementasi Lean Toyota, merumuskannya secara formal, dan membangun metode pelatihan di sekitarnya [1]. Bersama John Shook, yang telah menghabiskan sebelas tahun bersama Toyota di Jepang dan AS [1], ia menerbitkan buku kerja **"Learning to See"** bersama LEI pada 1998 (pengantar ditandatangani di Ann Arbor, Michigan, dan bertanggal Mei 1998; subjudul edisi pertama adalah "Value Stream Mapping to Create Value and Eliminate Muda", sedangkan edisi sekarang berbunyi "… to Add Value and Eliminate Muda") [1]. Buku ini menerima Shingo Research and Professional Publication Award pada 1999 [1]. Studi kasusnya tentang pabrik stamping fiktif "Acme Stamping" membawa pembaca dari kondisi saat ini, melalui pencarian pemborosan, hingga kondisi masa depan [1]. Edisi LEI saat ini bertanggal 2018 (ISBN 978-0-9667843-0-5, 148 halaman) [1].

Di negara-negara berbahasa Jerman, tiga buku membentuk cara metode ini menyebar; salah satunya kemudian terbit dalam bahasa Inggris:

- **Rother/Shook: "Sehen lernen"**, edisi bahasa Jerman dari buku kerja LEI, diterbitkan oleh Lean Management Institut di Aachen (versi 1.1, 2004, ISBN 978-3-9809521-1-8) [2].
- **Klaus Erlach: "Wertstromdesign. Der Weg zur schlanken Fabrik"** (Springer; cetakan ke-1 2007, cetakan ke-2 2010, ISBN 978-3-540-89867-2; cetakan ke-3 2020, ISBN 978-3-662-58906-9) [3]. Erlach mensistematisasi metode ini untuk perencanaan pabrik. Edisi bahasa Inggris, **"Value Stream Design: The Way Towards a Lean Factory"**, terbit bersama Springer pada 2012 (hak cipta 2013, ISBN 978-3-642-12568-3) [4].
- **Thomas Klevers: "Wertstrom-Mapping und Wertstrom-Design"** (mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9) [5].

Metode ini kemudian dialihkan ke pekerjaan kantor dan pekerjaan berbasis pengetahuan, yang paling menonjol oleh Karen Martin dan Mike Osterling dalam "Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation" (McGraw-Hill, terbit Oktober 2013, hak cipta 2014, ISBN 978-0-07-182891-8) [6].

Di AS, metode ini menjadi bagian dari perangkat Lean standar yang diajarkan oleh LEI, ASQ, dan NIST Manufacturing Extension Partnership (MEP). NIST MEP menyebut VSM "sering kali merupakan langkah pertama dalam menerapkan perbaikan proses lean" [47]. Di Jerman, metode ini menjadi bagian dari apa yang disebut sistem produksi holistik, yang dasarnya dijelaskan dalam pedoman **VDI 2870 Bagian 1** (Juli 2012) dari Association of German Engineers (VDI). Menurut VDI, pedoman tersebut sebagian masih berlaku dan sedang direvisi [7].

## 3. Tujuan dan Manfaat Value Stream Mapping

Tujuan utamanya adalah aliran yang berorientasi pada pelanggan: material harus bergerak melalui pabrik dengan waktu tunggu seminimal mungkin, dan setiap proses hanya membuat apa yang benar-benar dibutuhkan proses berikutnya. Dari situ muncul tujuan-tujuan konkret berikut:

- **Memperpendek lead time.** Timeline menunjukkan berapa bagian dari total lead time yang merupakan waktu tunggu. Karena persediaan biasanya menyumbang sebagian besar lead time, pengurangannya adalah pengungkit yang paling kuat.
- **Membuat pemborosan terlihat.** Overproduction, persediaan, waktu tunggu, dan transportasi yang tidak perlu langsung tampak di peta.
- **Menyederhanakan penjadwalan.** Peta menunjukkan berapa titik tempat sistem ERP mengirimkan perintah kerja. Tujuannya adalah menjadwalkan hanya di satu titik, sedapat mungkin.
- **Menciptakan bahasa yang sama.** Produksi, logistik, perencanaan, dan penjualan membahas alur yang sama pada satu halaman.
- **Memprioritaskan perbaikan.** Alih-alih optimasi lokal, Anda mendapatkan rencana implementasi yang menargetkan keseluruhan alur.

### Kapan value stream mapping layak dilakukan?

Metode ini paling cocok untuk produksi repetitif dan produksi model campuran dengan produk yang berulang, persediaan tinggi, dan waktu pengiriman yang panjang; sebelum perubahan tata letak, desain pabrik baru, atau investasi kapasitas; ketika ketepatan pengiriman buruk meskipun utilisasi tinggi; dan sebagai titik masuk ke dalam program Lean. Bentuk klasiknya kurang cocok untuk produksi job-shop murni atau engineer-to-order dengan routing yang berubah-ubah, karena keluarga produk yang stabil sulit didefinisikan di sana. Pendekatan yang lebih luas, seperti simulasi atau analisis berbasis data, membantu dalam kasus tersebut (lihat bagian 11). Produsen manufaktur kecil dan menengah di AS yang menginginkan fasilitasi dari luar dapat menghubungi NIST MEP Centers, yang mencantumkan value stream mapping sebagai salah satu metode lean yang mereka bantu terapkan [47].

### Kelebihan dan kekurangan sekilas

| Kelebihan | Kekurangan |
|---|---|
| gambaran menyeluruh tentang alur dari sudut pandang pelanggan | gambaran sesaat yang berbasis rata-rata |
| simbol yang sederhana dan standar | sedikit detail tentang varian dan urutan changeover |
| hambatan masuk yang rendah: kertas, pensil, stopwatch | pengumpulan data manual memakan waktu dan cepat usang |
| hasil kuantitatif (lead time, flow ratio) | variabilitas, kerusakan mesin, dan efek ukuran batch tidak ditampilkan |
| menghubungkan aliran material dan informasi | kondisi masa depan tidak dapat diuji di atas kertas |
| dasar yang kuat untuk tindakan perbaikan dan komunikasi | dampaknya bergantung pada implementasi yang disiplin |

Kolom sebelah kanan menjelaskan mengapa penelitian dan industri selama lebih dari sepuluh tahun terakhir terus memperluas metode ini ke arah dinamis dan digital [16][23]. Pembahasan lebih lanjut dimulai dari bagian 10.

## 4. Simbol Value Stream Mapping: Tabel Referensi Lengkap

Simbol-simbol ini berasal dari *Learning to See* [1][2] dan sengaja dibuat sederhana agar siapa pun dapat menggambarnya dengan pensil. Buku dan pustaka perangkat lunak sedikit berbeda. Yang penting adalah tim Anda menyepakati satu legenda dan menggunakannya secara konsisten. Tabel di bawah ini menjelaskan simbol umum seperti yang digunakan oleh Rother/Shook dan Erlach [1][3].

### Simbol aliran proses dan material

| Simbol (bentuknya) | Nama | Arti dan penggunaan |
|---|---|---|
| bangunan pabrik dengan atap bergerigi | pelanggan / pemasok (sumber luar) | pelanggan di kanan atas, pemasok di kiri atas; di bawahnya kotak data dengan permintaan, frekuensi pengiriman, dan kemasan |
| persegi panjang dengan garis judul dan nama proses | kotak proses | satu proses tempat material mengalir terus-menerus; kotak baru dimulai di tempat aliran berhenti dan persediaan menumpuk |
| persegi panjang di bawah kotak proses | kotak data | data proses: waktu siklus, waktu changeover, uptime/ketersediaan, ukuran batch, jumlah operator, shift, scrap |
| segitiga dengan huruf "I" | persediaan | material yang berada di antara dua proses; jumlah dan hari persediaan ditulis di bawahnya |
| panah bergaris tebal | panah dorong (push) | material didorong oleh proses hulu sesuai jadwalnya sendiri, bukan sesuai kebutuhan proses berikutnya |
| panah tebal berongga | pengiriman | bahan baku dari pemasok ke pabrik, atau barang jadi dari pabrik ke pelanggan |
| truk (atau kereta, pesawat, kapal) | pengiriman eksternal | moda transportasi dengan frekuensi pengiriman, misalnya "2× per minggu" |
| rak terbuka di sisi kiri | supermarket | persediaan penyangga yang terkendali, dari mana proses pelanggan mengambil; proses pemasok hanya mengganti apa yang telah diambil |
| panah melingkar | penarikan (pull) | pengambilan fisik dari supermarket oleh proses hilir |
| panah dengan "FIFO" dan jumlah maksimum | jalur FIFO | antrean terbatas di antara dua proses; part berjalan sesuai urutan kedatangan, dan proses pemasok berhenti ketika maksimum tercapai |
| segitiga dengan catatan pengaman | persediaan pengaman atau penyangga | persediaan terhadap fluktuasi permintaan (penyangga) atau gangguan proses (pengaman) |
| lingkaran dengan kepala operator | operator | jumlah orang di suatu proses |

### Simbol aliran informasi

| Simbol (bentuknya) | Nama | Arti dan penggunaan |
|---|---|---|
| panah tipis lurus | aliran informasi manual | informasi di atas kertas atau lisan, misalnya route card, surat jalan, instruksi lisan |
| panah berbentuk petir (zigzag) | aliran informasi elektronik | pesan EDI, ERP atau MES, email |
| persegi panjang "Production Control" | kontrol produksi | perencanaan, MRP atau ERP, sering disertai frekuensi perencanaan |
| kartu dengan sudut terpotong, berwarna penuh | kanban produksi | sinyal ke suatu proses untuk membuat kuantitas tertentu |
| kartu dengan sudut terpotong, diarsir atau ditandai lain tergantung pustaka | kanban penarikan | instruksi kepada petugas material untuk mengambil part dari supermarket |
| segitiga berdiri di atas ujungnya | kanban sinyal | memicu batch ketika persediaan supermarket mencapai titik pemesanan ulang; umum untuk proses dengan changeover |
| simbol menyerupai kotak pos | pos kanban | tempat kanban dikumpulkan untuk diambil |
| panah putus-putus dengan kanban | jalur kanban | rute kartu kembali ke proses pemasok |
| kotak dengan kisi slot "OXOX" | kotak heijunka (kotak perataan beban) | alat untuk meratakan volume dan campuran di proses pacemaker |
| kacamata | penjadwalan go-see | penjadwalan berdasarkan pemeriksaan visual alih-alih sinyal sistematis; tanda bahwa perbaikan diperlukan |

### Simbol umum

| Simbol (bentuknya) | Nama | Arti dan penggunaan |
|---|---|---|
| bintang bergerigi ("kaizen burst") | kebutuhan perbaikan | menandai titik pada peta kondisi saat ini atau masa depan yang memerlukan perbaikan |
| gelombang persegi di sepanjang bagian bawah | garis waktu (tangga lead time) | waktu tunggu (hari persediaan) pada satu tingkat, waktu proses pada tingkat lainnya; total lead time dan waktu proses di sebelah kanan |

Beberapa panduan daring menggambarkan panah putus-putus sebagai aliran informasi elektronik [38]. Dalam *Learning to See*, panah berbentuk petir mewakili informasi elektronik dan panah tipis lurus mewakili informasi manual [1]. Patuhi konvensi tersebut agar peta tetap mudah dibaca di seluruh pabrik dan alat perangkat lunak. Penjelasan bergambar tentang simbol-simbol ini ada di tulisan [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/).

Untuk proses kantor, seperti penanganan pesanan sebelum produksi, Polaris BSM menambahkan swimlane BPMN pada simbol value stream [30]. Penelitian juga sudah mengangkat gagasan yang sama: pendekatan Value Stream Mapping 4.0 dari TU Darmstadt secara eksplisit mencakup semua departemen penanganan pesanan, dimulai dari kontak pertama dengan pelanggan [14].

## 5. Cara Membuat Value Stream Map: Panduan Langkah demi Langkah untuk Kondisi Saat Ini

Panduan di bawah ini mengikuti logika Rother/Shook dan Erlach [1][3] dan menambahkan detail praktis. Untuk peta pertama dari value stream yang masih terkelola, rencanakan satu hingga dua hari dengan tim kecil [unverified: perkiraan berdasarkan pengalaman praktik]. Rekomendasi ukuran tim berbeda-beda: ASQ menyebut sekitar 10 anggota sebagai ideal dan menyarankan acara kaizen selama tiga hari sebagai kick-off [46], sedangkan panduan praktisi Jerman dari Mind Logistik lebih memilih tim kecil dengan maksimal enam orang [42]. Keduanya merupakan rekomendasi praktik, bukan temuan penelitian. Pilih tim yang lebih kecil jika value stream-nya pendek dan tim yang lebih besar jika banyak departemen terlibat.

> **Jika Anda memfasilitasi untuk pertama kalinya: agenda yang sudah teruji**
>
> - **Tim:** orang dari produksi (supervisor atau shift lead), logistik, perencanaan produksi, pemeliharaan, dan kualitas; tambahkan penjualan atau manajemen pesanan jika waktu pengiriman menjadi masalah. Calon pemilik value stream ikut serta.
> - **Perlengkapan:** kertas 11 × 17 in atau gulungan kertas cokelat, pensil dan penghapus, papan klip, stopwatch, lembar hitung persediaan, dan legenda simbol yang disepakati sebelumnya.
> - **Perjelas di awal:** famili produk, permintaan pelanggan selama beberapa bulan terakhir, pola shift dan istirahat. Umumkan penelusuran di area terkait dan jelaskan bahwa yang dinilai adalah proses, bukan orang.
> - **Hari 1:** pengantar tujuan dan simbol (sekitar satu jam), telusuri alur secara mundur dari pengiriman secara berpasangan, gabungkan data menjadi satu peta, hitung metrik.
> - **Hari 2 atau sesi lanjutan:** validasi peta bersama area terkait, tambahkan kaizen burst, bahas pertanyaan kondisi masa depan (bagian 8), mulai rencana implementasi dengan penanggung jawab.
>
> Durasi dan komposisi tim adalah nilai berdasarkan pengalaman dan bergantung pada ukuran value stream [unverified: nilai berdasarkan pengalaman praktik].

### Langkah 1: Tentukan tujuan dan ruang lingkup

Sebelum penelusuran pertama, tentukan pertanyaan apa yang harus dijawab peta tersebut. Contoh: Mengapa waktu pengiriman kita 15 hari padahal pelanggan mengharapkan 5 hari? Berapa luas lantai yang bisa kita dapatkan dengan memangkas persediaan? Tetapkan batasannya. Ruang lingkup yang umum adalah "door to door", dari penerimaan hingga pengiriman dalam satu pabrik [1]. Value stream yang melintasi beberapa pabrik atau pemasok (extended value stream) adalah langkah kedua, bukan yang pertama.

Tunjuk juga seorang pemilik. Rother/Shook merekomendasikan agar tanggung jawab atas value stream diberikan kepada satu orang, yaitu value stream manager, dan bukan dibagi-bagi ke beberapa departemen. LEI mendefinisikan peran ini sebagai "seorang individu yang diberi tanggung jawab yang jelas atas keberhasilan sebuah value stream" [10]. Selengkapnya di bagian 13.

### Langkah 2: Tentukan famili produk

Famili produk adalah sekelompok produk yang melalui langkah pemrosesan serupa pada peralatan bersama. Alat untuk ini adalah **matriks produk-proses**: produk atau varian di baris, proses di kolom. Produk yang sebagian besar memiliki tanda centang yang sama membentuk satu famili. ASQ menyarankan untuk mencari produk yang berbagi sekitar 80% langkahnya [46]. Sebagai aturan praktis, muatan kerja produk dalam satu famili seharusnya tidak berbeda jauh [unverified: aturan praktis]. Wikipedia berbahasa Jerman menekankan bahwa value stream dibentuk sepanjang rantai proses atau aliran material, dan memecahnya berdasarkan fungsi tidak lazim karena bertentangan dengan lead time yang singkat [27].

Untuk peta pertama Anda, pilih famili dengan porsi pendapatan yang tinggi atau masalah yang mendesak. Analisis Pareto (ABC) berdasarkan volume dan pendapatan akan membantu.

### Langkah 3: Catat permintaan pelanggan

Mulai peta di kanan atas dengan simbol pelanggan. Dalam kotak data, tulis permintaan (misalnya pieces per bulan), campuran varian, ukuran batch atau kuantitas kemasan, frekuensi pengiriman, dan waktu pengiriman yang diminta. Dari permintaan dan waktu kerja yang tersedia, hitung **takt time** (rumus di bagian 6). Takt time adalah acuan untuk setiap penilaian lainnya.

### Langkah 4: Telusuri proses di gemba, mundur dari pengiriman

Telusuri alur berlawanan arah, dari pengiriman ke penerimaan. Rother/Shook menjelaskan bahwa dengan cara ini Anda mulai dari proses yang paling dekat dengan pelanggan, yang seharusnya menentukan ritme [1]. Wikipedia berbahasa Jerman juga menggambarkan pencatatan mundur dari pelanggan melalui produsen hingga pemasok [27].

Gambarlah sebuah kotak proses untuk setiap bagian di mana material mengalir secara terus-menerus. Di tempat material diam, kotak proses berakhir dan segitiga persediaan dimulai. Gunakan pengamatan Anda sendiri dan stopwatch, bukan data ERP. Sistem ERP mengetahui waktu standar dari routing, bukan apa yang sebenarnya terjadi di stasiun kerja.

### Langkah 5: Isi kotak data

Catat setidaknya data berikut untuk setiap proses:

| Kolom data | Singkatan | Penjelasan |
|---|---|---|
| Waktu siklus | C/T | waktu antara dua part good di akhir proses |
| Waktu proses (waktu bernilai tambah) | P/T, VA | waktu selama pekerjaan benar-benar menambah nilai pada part |
| Waktu changeover | C/O | waktu dari part good terakhir batch lama hingga part good pertama batch baru |
| Uptime / ketersediaan | | porsi waktu terencana di mana peralatan benar-benar dapat berproduksi; tentukan apakah changeover disertakan atau dicatat secara terpisah |
| Ukuran batch / EPEI | | jumlah pieces per batch, atau "every part every interval": seberapa sering setiap varian diproduksi |
| Operator | | jumlah orang per shift |
| Shift | | jumlah shift dan waktu tersedia per shift setelah istirahat |
| Scrap / rework | | porsi part cacat |

Untuk proses dengan beberapa mesin paralel, catat jumlah mesin dan hitung waktu siklus efektif proses (waktu siklus per mesin dibagi jumlah mesin).

### Langkah 6: Hitung persediaan

Hitung persediaan di lantai produksi, bukan di sistem. Tuliskan jumlahnya di bawah setiap segitiga persediaan dan konversikan menjadi **hari persediaan** menggunakan permintaan harian. Hitung juga persediaan yang "tidak terhitung": part di area tunggu, di troli, di pojok rework. Di situlah sebagian besar waktu tunggu biasanya tersembunyi.

### Langkah 7: Tambahkan aliran material eksternal

Di kiri atas, gambarkan pemasok utama (atau pemasok bahan baku terpenting) dan hubungkan pemasok, penerimaan, pengiriman, dan pelanggan dengan simbol truk serta frekuensi pengiriman.

### Langkah 8: Gambarkan aliran informasi

Aliran informasi adalah bagian yang paling sering diabaikan tim, padahal bagian inilah yang menjelaskan mengapa material menumpuk. Tanyakan pada setiap proses: Bagaimana proses ini tahu apa yang harus diproduksi berikutnya? Jawaban yang umum adalah jadwal mingguan dari sistem ERP, daftar harian dari supervisor, kanban, teriakan lintas lorong, atau "apa pun yang ada di sana". Gambarkan kontrol produksi di tengah atas, hubungkan pelanggan dan pemasok dengan panah elektronik atau manual, dan tunjukkan informasi apa yang sampai ke setiap proses. Jika suatu proses menerima beberapa sinyal atau jadwal dengan cara melihat langsung, tambahkan ikon kacamata untuk go-see scheduling.

Kemudian tandai aliran material antarproses sebagai push (panah bergaris), FIFO, atau pull (supermarket dan withdrawal).

### Langkah 9: Gambarkan timeline dan hitung metrik

Timeline diletakkan di bawah proses. Pada satu tingkat, masukkan hari persediaan; pada tingkat lainnya, masukkan waktu proses dari setiap proses. Di sebelah kanan, jumlahkan keduanya menjadi **lead time** dan **waktu proses**, lalu hitung **flow ratio**. Pada value stream yang bercabang, jalur terpanjanglah yang menentukan lead time [41].

### Langkah 10: Tandai pemborosan dan validasi

Tandai masalah dengan kaizen burst: proses dengan waktu siklus di atas takt, persediaan tinggi, changeover panjang, uptime rendah, beberapa titik penjadwalan. Tinjau peta yang sudah selesai bersama karyawan di area terkait. Validasi oleh orang-orang di lantai produksi mencegah tim lokakarya menggambar value stream yang tidak ada di pabrik.

### Daftar periksa kondisi saat ini

- [ ] Tujuan, ruang lingkup, dan pemilik value stream ditetapkan
- [ ] Product family ditetapkan dengan product-process matrix
- [ ] Permintaan pelanggan, varian, dan takt time ditentukan
- [ ] Semua proses dicatat di lantai produksi dan secara mundur
- [ ] Kotak data diisi dengan nilai hasil pengukuran
- [ ] Persediaan dihitung dan dikonversi menjadi hari
- [ ] Pemasok, pelanggan, dan transportasi digambarkan
- [ ] Aliran informasi diperjelas untuk setiap proses
- [ ] Timeline, lead time, waktu proses, dan flow ratio dihitung
- [ ] Kaizen burst ditambahkan dan peta divalidasi bersama karyawan

## 6. Rumus dan Metrik Peta Aliran Nilai

Metrik membuat peta aliran nilai dapat dibandingkan. Dalam ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb, jurnal teknik produksi berbahasa Jerman yang diterbitkan De Gruyter), Jörg Drees dan Christoph Sack menunjukkan bahwa metrik aliran nilai seperti pengurangan persediaan, pemanfaatan sumber daya, kemampuan pengiriman, dan lead time yang singkat tampak mengejar tujuan yang saling bertentangan, tetapi jika diterapkan dengan benar, memberikan rekomendasi yang konsisten. Mereka mengusulkan seperangkat metrik inti yang membentuk loop kendali bersama dengan metode Lean yang terarah [19]. Rumus di bawah ini mencakup kumpulan metrik inti tersebut. Definisi lebih lanjut tersedia di halaman entitas [Lead Time](https://www.m365.fm/entity/lead-time/), [Cycle Time](https://www.m365.fm/entity/cycle-time/) dan [Takt Time](https://www.m365.fm/entity/takt-time/).

**Catatan tentang terminologi.** Panduan AS menggunakan beberapa nama untuk rasio yang sama. Yang disebut *Flussgrad* dalam teks Jerman muncul dalam bahasa Inggris sebagai flow ratio, process cycle efficiency (PCE), value-added ratio, flow efficiency, atau, dalam terminologi Karen Martin, activity ratio ("jumlah Process Time untuk semua langkah individual dibagi dengan Total Lead Time") [44]. Panduan ini menggunakan **flow ratio** secara konsisten. Demikian pula, "inventory days", "days of supply", dan "days of inventory" memiliki arti yang sama.

### Takt time

> **Takt time = waktu kerja tersedia per periode ÷ permintaan pelanggan per periode**

LEI memberikan contoh pabrik widget yang beroperasi 480 menit per hari sementara pelanggan meminta 240 widget per hari, yang menghasilkan takt time dua menit [8]. ASQ menggunakan rumus yang sama dengan 22.000 detik dan 200 pieces, yang menghasilkan 110 detik per piece [46]. Waktu kerja tersedia adalah waktu shift dikurangi istirahat terencana. Downtime tidak terencana tidak dikurangkan; ia termasuk dalam availability. Kata "takt" berasal dari bahasa Jerman (artinya ketukan atau denyut, seperti dalam musik). Menurut LEI, takt pertama kali digunakan sebagai alat manajemen produksi di industri pesawat terbang Jerman pada tahun 1930-an dan banyak digunakan di Toyota pada tahun 1950-an [8].

### Cycle time dan effective cycle time

Cycle time adalah waktu antara dua part baik di akhir suatu proses. Untuk membandingkannya dengan takt time, perhitungkan availability dan scrap:

> **Effective cycle time = cycle time ÷ (availability × first-pass yield)**

Proses dengan cycle time 98 detik dan availability 85% secara efektif menghasilkan satu part setiap 115 detik. Dibandingkan dengan takt time 117 detik, proses ini hampir sepenuhnya terbebani, meskipun nominal cycle time menunjukkan ruang cadangan 16%.

Waspadai kekeliruan yang umum: beberapa panduan berbahasa Inggris menggunakan "cycle time" untuk total waktu yang dihabiskan sebuah unit dalam proses, atau bahkan untuk waktu pengiriman pemasok. Pada peta aliran nilai, cycle time selalu berarti interval antara dua part baik di akhir satu proses.

### Inventory days dan Little's Law

> **Inventory days = persediaan (pieces) ÷ permintaan harian (pieces per hari)**

Wikipedia berbahasa Jerman menghitung 280 pieces dengan permintaan harian 80 pieces sebagai 3,5 hari persediaan [27]. Perhitungan ini menerapkan **Little's Law**, yang dibuktikan John D. C. Little pada tahun 1961 dalam jurnal Operations Research [12]:

> **L = λ × W**, disusun ulang: **W = L ÷ λ**

L adalah rata-rata persediaan dalam sistem, λ rata-rata laju throughput, dan W rata-rata waktu dalam sistem. Diterapkan pada aliran nilai: rata-rata waktu sebuah part menunggu di buffer sama dengan persediaan dibagi laju konsumsi. Little's Law berlaku untuk sistem yang stabil dalam jangka panjang. Untuk hari tertentu dengan lonjakan permintaan, atau untuk sistem saat ramp-up, rumus ini hanya merupakan perkiraan. Itu salah satu alasan untuk dynamic value stream mapping (bagian 11).

### Lead time

> **Production lead time = Σ inventory days + Σ processing times (sepanjang jalur terpanjang)**

Karena processing time biasanya diukur dalam detik atau menit dan persediaan dalam hari, jumlah inventory days mendominasi hasilnya. Sebuah skripsi diploma di Hochschule Mittweida (perguruan tinggi terapan Jerman) merangkum definisi Erlach tentang production lead time sebagai jumlah processing time dan process time ditambah rentang persediaan, dengan jalur terpanjang sebagai penentu [41]. Glosarium Martin merumuskannya lebih umum: lead time sama dengan process time ditambah wait time [44].

### Processing time dan process time

**Waktu pemrosesan** adalah waktu selama bagian tersebut sedang dikerjakan. Erlach juga membedakan **waktu proses** untuk tahapan seperti pengeringan, pengerasan (curing), atau perlakuan panas, yang memakan waktu tanpa ada orang yang mengerjakan bagian tersebut [41]. Keduanya dihitung dalam rasio aliran.

### Rasio aliran (efisiensi siklus proses)

> **Rasio aliran = (waktu pemrosesan + waktu proses) ÷ lead time × 100%**

Wikipedia berbahasa Jerman menggambarkan rasio aliran sebagai porsi waktu pemrosesan murni dalam total lead time dan menyebutnya sebagai metrik kunci analisis aliran nilai [27]. Perhatikan basis waktunya. Jika lead time diberikan dalam hari kerja, konversikan ke detik menggunakan waktu kerja harian, seperti yang dilakukan rumus Erlach dengan faktor "waktu kerja harian" [41]. Jika Anda menghitung dalam hari kalender, rasio aliran akan turun lebih jauh. Pilih satu konvensi dan konsisten dengannya, atau kondisi saat ini dan kondisi masa depan tidak dapat dibandingkan.

### Metrik lainnya

| Metrik | Rumus / definisi | Kegunaan |
|---|---|---|
| Beban terhadap takt | cycle time efektif ÷ takt time | nilai di atas 100% menunjukkan bottleneck |
| Jumlah operator yang dibutuhkan | Σ work content ÷ takt time | dasar untuk line balancing |
| EPEI | waktu hingga setiap varian telah diproduksi satu kali | menunjukkan fleksibilitas dan efek ukuran batch |
| Porsi changeover | (jumlah changeover × waktu changeover) ÷ waktu tersedia | menunjukkan seberapa besar kapasitas yang tersisa untuk batch yang lebih kecil |
| Beban termasuk changeover | (permintaan harian × cycle time + jumlah changeover × waktu changeover) ÷ (waktu tersedia × availability) | memeriksa apakah kondisi masa depan dengan batch kecil masih dapat memenuhi takt (contoh di bagian 7) |
| On-time delivery | pesanan yang dikirim tepat waktu ÷ seluruh pesanan | metrik hasil dari sudut pandang pelanggan |
| %C&A (percent complete and accurate) | porsi pekerjaan yang diterima langkah hilir dalam keadaan lengkap dan bebas kesalahan | kualitas serah terima; sebagian besar digunakan dalam aliran nilai perkantoran [44] |
| OEE | availability × performance × quality | efektivitas peralatan; kotak data sering menyingkatnya menjadi uptime |

Diagram keseimbangan operator (diagram batang cycle time efektif dengan garis horizontal untuk takt time) membuat bottleneck dan kelebihan kapasitas terlihat sekilas. Erlach menggunakannya untuk menunjukkan seberapa baik kapasitas diselaraskan dengan takt [3]. Wikipedia berbahasa Jerman mencatat bahwa cycle time yang mendekati takt menunjukkan bottleneck, dan cycle time yang jauh di bawah takt menunjukkan kelebihan kapasitas dan pemborosan [27].

## 7. Contoh Value Stream Mapping: Satu Value Stream yang Dihitung Secara Lengkap

Contoh berikut bersifat **fiktif dan dibuat khusus untuk panduan ini**. Contoh ini menunjukkan bagaimana metrik saling terhubung dan menjalankan kondisi saat ini serta kondisi masa depan dengan data dasar yang sama.

### Titik awal

Sebuah pemasok membuat keluarga produk berupa rumah katup hidrolik dalam lima varian dengan routing yang sama: pemotongan, pembubutan, pengefraisan, pencucian, perakitan. Pelanggan melakukan pemesanan rata-rata 9.200 pcs per bulan, yang tersebar dalam 20 hari kerja. Pabrik beroperasi dengan dua shift masing-masing 8 jam, dengan istirahat 30 menit di setiap shift.

**Langkah A: Hitung takt time**

- Permintaan harian: 9.200 pcs ÷ 20 hari = **460 pcs per hari**
- Waktu kerja tersedia: 2 × (480 menit − 30 menit) = 900 menit = **54.000 detik per hari**
- Takt time: 54.000 detik ÷ 460 pcs = **117,4 detik per pcs**

### Kondisi saat ini: data proses

| Proses | Cycle time | Waktu changeover | Availability | Effective cycle time | Beban vs. takt |
|---|---|---|---|---|---|
| Pemotongan | 45 detik | 30 menit | 95% | 47,4 detik | 40% |
| Pembubutan | 98 detik | 60 menit | 85% | 115,3 detik | 98% |
| Pengefraisan | 125 detik | 45 menit | 90% | 138,9 detik | **118%** |
| Pencucian | 40 detik | 0 menit | 98% | 40,8 detik | 35% |
| Perakitan | 105 detik | 15 menit | 95% | 110,5 detik | 94% |

Penyederhanaan: waktu proses sama dengan cycle time di sini karena setiap proses mengerjakan satu part secara berurutan. Scrap diabaikan. Availability hanya mencakup kerusakan mesin; changeover diperlakukan secara terpisah.

**Temuan bottleneck:** Pengefraisan sudah melampaui takt pada nominal 125 detik, dan pada effective 138,9 detik beban-nya 18% di atas takt. Dalam satu hari, pengefraisan menghasilkan 54.000 detik × 0,90 ÷ 125 detik = **389 pcs**, bukan 460 pcs yang dibutuhkan. Changeover menurunkan angka itu lebih jauh lagi. Pabrik menutup kekurangan dengan shift lembur pada hari Sabtu. Pembubutan secara kertas tampak tidak kritis (98 detik), tetapi bebannya mencapai 98% setelah availability diperhitungkan. Jika availability diabaikan, Anda akan melewatkan near-bottleneck kedua ini.

### Kondisi saat ini: inventori dan timeline

| Inventori | Jumlah | Hari inventori (jumlah ÷ 460) |
|---|---|---|
| Bahan baku sebelum pemotongan | 4.600 pcs | 10,0 hari |
| Setelah pemotongan | 1.380 pcs | 3,0 hari |
| Setelah pembubutan | 920 pcs | 2,0 hari |
| Setelah pengefraisan | 690 pcs | 1,5 hari |
| Setelah pencucian | 460 pcs | 1,0 hari |
| Barang jadi | 1.150 pcs | 2,5 hari |
| **Total** | **9.200 pcs** | **20,0 hari** |

- **Waktu proses:** 45 + 98 + 125 + 40 + 105 = **413 detik** (sedikit di bawah 7 menit)
- **Lead time:** 20,0 hari kerja + 413 detik ≈ **20 hari kerja**
- **Flow ratio (berdasarkan waktu kerja):** 413 detik ÷ (20 × 54.000 detik) = 413 ÷ 1.080.000 = **0,038%**
- **Flow ratio (berdasarkan kalender):** 20 hari kerja sesuai dengan sekitar 28 hari kalender; 413 detik ÷ (28 × 86.400 detik) = **0,017%**

**Pemeriksaan kewajaran dengan Hukum Little:** total inventori 9.200 pcs ÷ throughput 460 pcs per hari = 20 hari [12]. Jumlah hari inventori per proses dan perhitungan keseluruhan sesuai. Jika pemeriksaan ini tidak cocok pada peta Anda, berarti Anda telah melewatkan inventori atau mencampuradukkan nilai referensi.

**Temuan aliran informasi:** Perencanaan produksi mengirimkan jadwal mingguan ke kelima proses. Setiap proses memproduksi sesuai jadwalnya sendiri dan mendorong material ke proses berikutnya. Tidak ada batas kuantitas antarproses, sehingga inventori menumpuk di depan bottleneck. Supervisor perakitan turun tangan setiap hari dengan pesanan mendesak (go-see scheduling).

### Kondisi masa depan: tindakan perbaikan

Dengan menggunakan panduan desain dari bagian 8, tim merancang kondisi masa depan berikut:

1. **Menghilangkan hambatan pada milling:** perbaikan perkakas dan fixture memangkas waktu siklus dari 125 menjadi 95 s; inisiatif TPM (total productive maintenance, pemeliharaan preventif dengan keterlibatan operator) menaikkan ketersediaan dari 90 menjadi 95%.
2. **Menstabilkan turning:** optimasi program memangkas waktu siklus dari 98 menjadi 90 s; TPM menaikkan ketersediaan dari 85 menjadi 92%.
3. **Menyeimbangkan assembly:** beban kerja didistribusikan ulang, dan waktu siklus turun dari 105 menjadi 95 s.
4. **Memangkas waktu changeover (SMED):** karena setiap varian akan dibuat setiap hari, setiap proses memerlukan lima changeover per hari. SMED (single-minute exchange of die: mempersiapkan changeover selagi mesin masih berjalan) memangkas waktu changeover di turning dari 60 menjadi 10 menit, di milling dari 45 menjadi 10 menit, dan di assembly dari 15 menjadi 5 menit. Tanpa langkah ini, kondisi masa depan tidak akan layak: lima changeover masing-masing 60 menit tidak muat dalam kapasitas kosong turning.
5. **Penghubung FIFO:** turning, milling, washing, dan assembly dihubungkan oleh tiga lajur FIFO dengan kuantitas maksimum 60, 30, dan 30 pcs.
6. **Supermarket setelah sawing:** karena sawing jauh lebih cepat dan harus melakukan changeover, sebuah supermarket yang menampung persediaan setengah hari (230 pcs) memisahkannya. Kanban sinyal memicu batch baru.
7. **Assembly sebagai pacemaker:** perencanaan hanya mengirimkan pesanan pelanggan ke assembly. Kotak heijunka menyebarkan kelima varian secara merata sepanjang hari. Dengan kuantitas kemasan 20 pcs, pitch-nya adalah 20 × 117,4 s ≈ 39 menit.
8. **Supermarket barang jadi:** persediaan satu hari (460 pcs) menyangga fluktuasi panggilan pengiriman pelanggan.
9. **Penghubung pemasok:** pengiriman bahan baku meningkat dari sekali menjadi dua kali seminggu; persediaan bahan baku turun menjadi lima hari (2.300 pcs).

### Kondisi masa depan: pemeriksaan kapasitas dengan changeover

Kondisi masa depan harus memenuhi takt time bahkan dengan changeover harian. Pemeriksaan ini karena itu menghitung dua nilai: waktu siklus efektif dibandingkan dengan takt, dan beban termasuk changeover.

> **Beban termasuk changeover = (permintaan harian × waktu siklus + changeover × waktu changeover) ÷ (waktu tersedia × ketersediaan)**

| Proses | Waktu siklus | Waktu changeover | Ketersediaan | Waktu siklus efektif | Beban vs. takt | Beban termasuk 5 changeover |
|---|---|---|---|---|---|---|
| Sawing | 45 s | 30 menit | 95% | 47,4 s | 40% | 58% |
| Turning | 90 s | 10 menit | 92% | 97,8 s | 83% | 89% |
| Milling | 95 s | 10 menit | 95% | 100,0 s | 85% | **91%** |
| Washing | 40 s | 0 menit | 98% | 40,8 s | 35% | 35% |
| Assembly | 95 s | 5 menit | 95% | 100,0 s | 85% | 88% |

Perhitungan untuk milling: (460 × 95 s + 5 × 600 s) ÷ (54.000 s × 0,95) = 46.700 ÷ 51.300 = 91%. Semua proses tetap di bawah 100%, dengan nilai tertinggi di milling. Pacemaker, assembly, masih memiliki cadangan untuk fluktuasi panggilan pengiriman pada 88%.

### Kondisi masa depan: hasil

| Metrik | Saat ini | Masa depan | Perubahan |
|---|---|---|---|
| Total persediaan | 9.200 pcs | 2.300 + 230 + 120 + 460 = 3.110 pcs | −66% |
| Lead time (Little) | 20,0 hari kerja | 3.110 ÷ 460 = 6,8 hari kerja | −66% |
| Waktu proses | 413 s | 45 + 90 + 95 + 40 + 95 = 365 s | −12% |
| Rasio aliran (berbasis waktu kerja) | 0,038% | 365 ÷ (6,76 × 54.000) = 0,100% | faktor 2,6 |
| Bottleneck | milling 118% (tanpa changeover) | beban tertinggi milling 91% termasuk changeover | takt tercapai tanpa shift Sabtu |
| Titik penjadwalan | 5 (jadwal mingguan ke semua) | 1 (pacemaker assembly) | perencanaan lebih sederhana |

Lajur FIFO dihitung pada kuantitas maksimumnya (60 + 30 + 30 = 120 pcs). Dalam operasi, lajur ini jarang penuh, sehingga persediaan masa depan merupakan batas atas yang berhati-hati.

Dua pelajaran dari contoh ini. Pertama, langkah penjadwalan dan persediaan memberikan sebagian besar pengurangan lead time, bukan mesin yang lebih cepat. Waktu proses turun 12%, lead time turun 66%. Kedua, rasio aliran yang membaik menjadi 0,1% masih rendah. Hal itu lazim untuk pabrik dengan penyangga bahan baku. Yang penting adalah arahnya, dan takt time yang dapat dipenuhi secara andal bahkan dengan changeover harian.

## 8. Pemetaan Kondisi Masa Depan: Pedoman Desain dari Rother/Shook dan Erlach

Desain kondisi masa depan menjawab pertanyaan tentang bagaimana aliran nilai seharusnya mengalir. *Learning to See* membawa pembaca dari kondisi saat ini ke "peta kondisi masa depan yang lebih ramping" dan ke rencana aliran nilai yang memandu implementasi serta ditinjau secara berkala [1].

### Pertanyaan kunci untuk kondisi masa depan menurut Rother/Shook

Rother/Shook menyusun desain melalui serangkaian pertanyaan kunci [1] (diparafrasekan):

1. Berapa takt time-nya?
2. Apakah kita membangun untuk supermarket barang jadi atau langsung ke pengiriman?
3. Di mana kita bisa menggunakan aliran kontinu?
4. Di mana kita memerlukan sistem tarik supermarket?
5. Di titik tunggal mana dalam rantai produksi (proses pacemaker) kita menjadwalkan produksi?
6. Bagaimana kita meratakan bauran produksi pada proses pacemaker?
7. Berapa besar tambahan pekerjaan yang secara konsisten kita lepaskan dan ambil di pacemaker?
8. Perbaikan proses apa yang diperlukan agar kondisi masa depan dapat berjalan?

### Pedoman Rother dan Shook

Dalam artikel untuk Lean Post LEI (19 Oktober 2022), Mike Rother dan John Shook merangkum pedoman untuk aliran nilai yang ramping sebagai berikut [11]:

| No. | Pedoman (kalimat asli) | Artinya |
|---|---|---|
| 1 | "Produce to your takt time" | selaraskan produksi dengan permintaan pelanggan |
| 2 | "Develop continuous flow wherever possible" | ciptakan aliran satu-satu di mana pun memungkinkan |
| 3 | "Use supermarkets to control production where continuous flow does not extend upstream" | gunakan supermarket di tempat aliran tidak dapat meluas ke hulu |
| 4 | "Try to send the customer schedule only to one production process" | kirim pesanan pelanggan hanya ke satu proses (pacemaker) |
| 5 | "Distribute the production of different products evenly over a set time at the pacemaker process" | ratakan bauran produk di pacemaker (heijunka) |
| 6 | "Create an 'initial pull' by releasing and withdrawing small, consistent increments of work at the pacemaker process" | ratakan volume produksi |

Sumber sekunder menyebut pedoman ketujuh dari *Learning to See*: kemampuan membuat setiap part setiap hari pada proses di hulu pacemaker ("every part every day"), dan kemudian setiap shift atau setiap jam [1] [unverified: belum diperiksa terhadap teks buku]. Contoh di bagian 7 menunjukkan mengapa pedoman ini memerlukan waktu changeover yang singkat.

### Pedoman desain Erlach

Klaus Erlach menyusun desain aliran nilai menjadi delapan pedoman desain yang saling membangun [3]. Pedoman ini terbagi dalam tiga kelompok: desain proses produksi (pedoman 1 dan 2), pengendalian produksi (3 hingga 5) dan perencanaan produksi (6 hingga 8). Nama-nama di bawah mengikuti buku berbahasa Jerman karya Erlach dan ikhtisar di situs webnya; edisi berbahasa Inggris (Springer 2012/2013) dijelaskan oleh penerbitnya sebagai memuat "ten design guidelines" [4], sehingga penomorannya mungkin berbeda dalam teks bahasa Inggris.

| No. | Pedoman desain [3] | Pertanyaan kunci untuk aliran nilai Anda |
|---|---|---|
| 1 | Penyelarasan dengan takt time | Apakah semua proses dirancang untuk memenuhi takt time secara andal, dan di mana terdapat kelebihan kapasitas? |
| 2 | Integrasi proses | Langkah proses mana yang dapat digabungkan secara fisik dan organisasi menjadi aliran kontinu? |
| 3 | Kopling FIFO | Di mana proses dapat dihubungkan oleh jalur FIFO terbatas, bukan penyimpanan tanpa batas? |
| 4 | Pengendalian kanban | Di mana supermarket dengan kanban diperlukan karena proses memiliki waktu siklus atau changeover yang berbeda? |
| 5 | Proses pacemaker | Di proses tunggal mana pesanan pelanggan dijadwalkan? |
| 6 | Penentuan unit pelepasan | Dalam kenaikan waktu berapa pekerjaan dilepaskan di pacemaker (pitch)? |
| 7 | Peratan bauran produksi | Bagaimana varian disebarkan secara merata, dan di mana pembentukan kampanye masuk akal? |
| 8 | Pengendalian bottleneck | Bagaimana bottleneck yang tersisa dikendalikan agar tidak pernah kosong? |

Urutannya mengikuti logika ketiga kelompok tersebut: bauran produksi yang diratakan (pedoman 7) mengandaikan bahwa proses telah selaras dengan takt dan bahwa pengendalian melalui FIFO, kanban dan pacemaker berfungsi (pedoman 1 hingga 5).

### Istilah kondisi masa depan secara ringkas

- **Aliran kontinu (one-piece flow):** part bergerak satu per satu dari proses ke proses tanpa penyimpanan antara.
- **Supermarket dan kanban:** proses hilir mengambil barang, proses pemasok hanya mengganti jumlah yang diambil. Informasi lebih lanjut di halaman entitas [Kanban](https://www.m365.fm/entity/kanban/) dan [Pull System](https://www.m365.fm/entity/pull-system/).
- **Jalur FIFO:** antrean dengan jumlah maksimum; saat penuh, proses pemasok berhenti. FIFO lebih sederhana daripada kanban dan cocok untuk part dengan variasi tinggi yang tidak boleh dibuat untuk stok.
- **Proses pacemaker:** satu-satunya proses yang menerima pesanan pelanggan. Proses hulu dikendalikan oleh pull supermarket atau jalur FIFO; proses hilir berjalan dalam aliran kontinu atau FIFO.
- **Heijunka:** perataan volume dan campuran produk, misalnya dengan heijunka box yang memiliki slot per interval waktu.
- **Pitch / release unit:** interval waktu saat pekerjaan dilepas dan produk jadi diambil: takt time × kuantitas kemasan, pada contoh bagian 7 adalah 20 × 117,4 s ≈ 39 menit.
- **SMED dan TPM:** SMED memangkas waktu changeover dengan menyiapkan pekerjaan changeover selagi mesin masih berjalan; TPM meningkatkan availability melalui pemeliharaan preventif. Keduanya sering menjadi prasyarat untuk kondisi masa depan dengan batch kecil.

### Dari kondisi masa depan ke rencana implementasi

Kondisi masa depan tanpa rencana hanyalah poster yang bagus. Pecah kondisi masa depan menjadi **loop value stream**: loop pacemaker (dari pacemaker ke pelanggan) dan loop hulu hingga setiap supermarket. Setiap loop memiliki sasaran, tindakan, penanggung jawab, dan tanggal. Rother/Shook merekomendasikan memulai dengan loop pacemaker karena paling dekat dengan pelanggan [unverified: sumber tidak memuat rujukan halaman spesifik]. Rencanakan dalam siklus beberapa bulan dan tinjau kemajuan secara berkala, misalnya dalam tinjauan value stream bulanan.

Valuasi adalah kendala yang umum. Busch, Niehues, dan Maassen menjelaskan di ZWF bahwa industri sering gagal merealisasikan potensi value stream karena manfaatnya kurang terukur. Mereka memperluas metode value stream dengan model valuasi berbasis biaya yang menghubungkan metrik operasional dan strategis [25]. Untuk rencana implementasi Anda, artinya: terjemahkan pengurangan persediaan, ruang lantai yang dihemat, dan pengurangan lead time ke dalam nilai uang sebelum Anda mengajukan anggaran.

## 9. Menemukan Pemborosan: 8 Pemborosan dan Diagram Spageti

Pemetaan aliran nilai adalah alat untuk menemukan pemborosan (bahasa Jepang: muda). Klasifikasi tujuh pemborosan berasal dari Taiichi Ohno [9][32]; LEI mencantumkannya sebagai produksi berlebih, menunggu, pengangkutan, pemrosesan, persediaan, gerakan, dan koreksi [9]. Jeffrey Liker menambahkan yang kedelapan dalam "The Toyota Way" (2004): kreativitas dan keterampilan karyawan yang tidak dimanfaatkan [33]. Di AS, kedelapan pemborosan tersebut sering diajarkan dengan akronim DOWNTIME: cacat, produksi berlebih, menunggu, bakat yang tidak dimanfaatkan, transportasi, persediaan, gerakan, pemrosesan berlebih [51]. Ikhtisar singkat tersedia di halaman entitas [Eight Wastes](https://www.m365.fm/entity/eight-wastes/).

| No. | Pemborosan | Cara mengenalinya pada peta aliran nilai |
|---|---|---|
| 1 | Produksi berlebih | panah dorong, batch besar, persediaan setelah proses cepat; menurut LEI "bentuk pemborosan terburuk karena berkontribusi pada enam lainnya" [9] |
| 2 | Menunggu | operator menunggu mesin, material, atau persetujuan; beban rendah dibandingkan takt |
| 3 | Transportasi | banyak panah truk dan transportasi, penyimpanan antara di antara proses |
| 4 | Pemrosesan berlebih | langkah proses tanpa nilai bagi pelanggan, inspeksi ganda |
| 5 | Persediaan | segitiga persediaan dengan banyak hari, supermarket tanpa kuantitas maksimum |
| 6 | Gerakan | jalan jauh bagi karyawan, mencari suku cadang dan alat (lebih terlihat pada diagram spageti) |
| 7 | Cacat / koreksi | scrap dan rework pada kotak data, panah aliran balik |
| 8 | Bakat yang tidak dimanfaatkan | penjadwalan go-see, tidak dilibatkan dalam menggambar peta, tidak ada usulan perbaikan |

### Diagram spageti sebagai pelengkap

Peta aliran nilai menunjukkan aliran pada tingkat abstrak. Peta ini tidak menunjukkan seberapa jauh suku cadang dan orang sebenarnya bergerak. Untuk itulah **diagram spageti** digunakan: pada denah lantai berskala, telusuri setiap rute suku cadang atau orang dengan pena. Hasilnya sering terlihat seperti sepiring spageti dan membuat pemborosan transportasi serta gerakan terlihat sekaligus. LEI melaporkan kasus Thrustmaster of Texas, produsen peralatan propulsi kelautan yang berbasis di Houston, di mana bagan spageti area perakitan thruster mengungkapkan lebih dari tujuh mil berjalan kaki dan hampir 10 jam waktu tanpa nilai tambah per unit; setelah redesain tata letak yang berfokus pada aliran dan kerja standar, perusahaan melaporkan pengiriman tepat waktu 100% 18 bulan kemudian [43]. Gunakan diagram spageti setelah peta aliran nilai untuk proses dengan ledakan kaizen yang paling menonjol. Rincian ada di halaman entitas [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/).

## 10. Batasan Value Stream Mapping Tradisional

Value stream mapping berbasis kertas sengaja dibuat sederhana. Kesederhanaan itu adalah kekuatannya sekaligus batasnya. Literatur terutama membahas lima kelemahan.

**1. Potret sesaat.** Peta menunjukkan kondisi satu hari atau satu minggu. Dalam ZWF, Lugert dan Winkler mencatat bahwa sifat statis value stream mapping menjadi masalah yang makin besar di bawah megatren produksi saat ini, dan mereka menyerukan manajemen value stream yang dinamis [23]. Fraunhofer IPA mempertanyakan apakah potret-potret individual cukup untuk menganalisis proses produksi secara utuh [22].

**2. Rata-rata alih-alih distribusi.** Kotak data berisi rata-rata. Waktu siklus yang berfluktuasi, kerusakan mesin, dan lonjakan permintaan lenyap dalam nilai rata-rata. Hukum Little berlaku untuk rata-rata jangka panjang pada sistem yang stabil [12], tetapi tidak menjelaskan sebaran pada pesanan individual.

**3. Varian produk.** Sejak 2011, Drees dan Sack sudah menunjuk rantai nilai yang makin kompleks, jumlah varian produk yang meningkat, dan fluktuasi permintaan sehari-hari [19]. Dengan ratusan varian dan rute produksi yang berbeda, hampir mustahil membentuk keluarga produk dengan waktu siklus yang seragam.

**4. Pengumpulan data manual.** Menurut Fraunhofer IPA, data dari papan catatan dan rata-rata perkiraan kurang mutakhir, akurat, dan lengkap dibandingkan data yang dikumpulkan secara digital [22]. Di banyak perusahaan, data untuk value stream mapping dikumpulkan secara manual dan hanya sebagai potret sesaat [21]. Usaha itu membuat peta jarang diperbarui.

**5. Tidak ada uji kondisi masa depan.** Apakah lajur FIFO berisi 30 buah sudah cukup, atau apakah supermarket kosong selama lonjakan permintaan, tidak dapat diperiksa di atas kertas. Oleh karena itu Türck, Weimer, Schubert, dan Drees (iFAKT GmbH) mempertanyakan peluang optimisasi baru apa yang muncul ketika faktor waktu diperhitungkan [16].

Ada juga kesenjangan isi: metode klasik terutama memperbaiki aliran material. Aliran informasi digambar tetapi hampir tidak dinilai. Di sinilah Value Stream Mapping 4.0 berperan (bagian 12) [13][15].

## 11. Value Stream Mapping Dinamis dan Digital

Metode ini berkembang sepanjang dua sumbu: **dinamis** (mensimulasikan perilaku waktu dan variabilitas) dan **digital** (mengumpulkan data secara otomatis dan menghitung metrik secara terus-menerus). Kedua sumbu ini menambah metode klasik; keduanya tidak menggantikannya.

### Dari peta statis ke simulasi

Sejak 2014, Stefan Türck, Andreas Weimer, Lars Schubert, dan Jörg Drees dari iFAKT GmbH menguraikan dalam ZWF jalur dari analisis statis value stream dan metriknya menuju **simulasi dinamis** [16]. Titik awal mereka adalah bahwa pemodelan value stream sudah mapan di banyak perusahaan manufaktur dan bahwa alat digital untuknya semakin diterima [16]. Value stream mapping dinamis tidak hanya menanyakan seberapa tinggi rata-rata persediaan, tetapi bagaimana persediaan itu berkembang seiring waktu ketika pesanan berfluktuasi, mesin rusak, atau urutan pergantian berubah.

Dalam praktik, peta value stream menjadi model yang setiap simbolnya memiliki perilaku. Sebuah proses tidak lagi memiliki waktu siklus tetap melainkan distribusi; sebuah supermarket memiliki titik pemesanan ulang dan maksimum; permintaan pelanggan mengikuti deret waktu. Simulasi menunjukkan apakah kondisi masa depan berfungsi dalam keadaan realistis, di mana buffer terlalu kecil, dan distribusi lead time apa yang diharapkan. Informasi lebih lanjut tentang simulasi pabrik secara umum ada di halaman entitas [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Perbandingan: value stream mapping statis vs. dinamis

| Kriteria | VSM statis (klasik) | VSM dinamis / simulasi |
|---|---|---|
| Dasar data | rata-rata dari satu perekaman di lokasi | distribusi, deret waktu, data kejadian |
| Acuan waktu | potret sesaat | perkembangan selama hari, minggu, bulan |
| Keragaman produk | keluarga produk dengan nilai seragam | varian dengan rute dan urutan changeover sendiri |
| Variabilitas dan kerusakan | tidak ditampilkan | dimodelkan melalui distribusi dan profil kerusakan |
| Metrik | lead time, rasio aliran, hari persediaan sebagai nilai tunggal | ditambah sebaran, persentil, beban dari waktu ke waktu |
| Pengujian kondisi masa depan | tidak mungkin, hanya berdasarkan penilaian ahli | skenario dapat dibandingkan sebelum implementasi |
| Upaya | rendah: kertas dan stopwatch | lebih tinggi: pemodelan dan pemeliharaan data |
| Alat | kertas, papan tulis, perangkat lunak diagram | perangkat lunak VSM khusus dengan tautan simulasi, paket simulasi |
| Kekuatan | pemahaman, komunikasi, keterlibatan | mengurangi risiko investasi dan ukuran buffer |
| Penggunaan tipikal | pengenalan, lokakarya, pelatihan Lean | perencanaan pabrik, produksi high-mix, keputusan kapasitas |

### Digital value stream mapping: data dari pabrik, bukan papan klip

Sumbu kedua adalah pengumpulan data. Dalam ZWF, Christian Urnauer menunjukkan bagaimana **process mining** dapat menurunkan proses, keterkaitannya, dan metrik kinerja dari stempel waktu produksi, sehingga value stream mapping memperoleh perspektif yang berbasis data [24].

Fraunhofer IPA menempuh jalur serupa dengan motto "We are automating the gemba walk": dari penangkapan data digital di lantai produksi hingga metrik value stream yang divisualisasikan, dengan analisis terkini, metrik berbasis data yang konsisten, serta integrasi sederhana KPI energi dan jejak karbon [22]. Produsen di AS juga memiliki referensi publik untuk sisi lingkungan: Lean & Environment Toolkit dari EPA merekomendasikan memilih "satu atau dua metrik kinerja lingkungan untuk diukur pada setiap proses dalam value stream", misalnya jumlah limbah berbahaya per shift, dan mencantumkannya di kotak proses di samping cycle time dan uptime [48].

Dalam istilah ISA-95 (ANSI/ISA-95, dikenal secara internasional sebagai IEC 62264), data untuk value stream digital berasal dari sistem bisnis Level 4 seperti ERP, sistem operasi manufaktur Level 3 seperti MES, serta sistem kontrol dan sensor Level 2 [50]. Pelapisan tersebut membantu saat Anda berdiskusi dengan tim TI tentang sistem mana yang menyediakan kolom data mana pada kotak data.

Contoh konkret adalah proyek riset **ECOWERT** ("analisis value stream berorientasi real-time untuk optimalisasi produksi berkelanjutan") oleh Fraunhofer IPA dan iFAKT GmbH. Proyek berjalan dari 1 September 2021 hingga 31 Agustus 2022, dengan volume €500.000 dan didanai oleh negara bagian Baden-Württemberg, Jerman, melalui program Invest BW [20]. Tujuannya adalah analisis value stream yang mengumpulkan data ERP, MES, mesin, dan sensor secara otomatis, memperbaruinya secara berkelanjutan, dan menambahkan data value stream energi [20]. Jörg Drees dan Steffi Stambera (iFAKT) serta Markus Böhm (Fraunhofer IPA) menjelaskan arsitekturnya: data mentah diteruskan melalui gateway IIoT dan MQTT (dengan spesifikasi payload Sparkplug) ke basis data deret waktu, lalu dievaluasi oleh perangkat lunak Polaris VSM. Kesimpulan mereka: hasilnya adalah pendekatan yang dapat menghasilkan analisis value stream hampir secara real-time, dan memasang sensor sederhana pada mesin yang sudah ada saja sudah cukup untuk menghasilkan data [21].

Untuk memanfaatkan ulang data ini, Böhm, Drees, Sai, Erlach, Stambera, dan Teriete mengembangkan **universal data interface untuk layanan value stream digital**. Mereka memperlakukan kejadian di lantai produksi sebagai data mentah terstruktur untuk layanan optimasi dan menstandarkan aliran data agar layanan dapat terhubung melalui satu antarmuka. Sebuah layanan untuk menghitung dan memvisualisasikan metrik dihubungkan dalam proyek ECOWERT [18]. Para penulis termasuk Klaus Erlach (Fraunhofer IPA), penulis karya standar tentang desain value stream [18][3].

### Dari value stream digital ke digital twin

Ketika value stream map diperbarui secara terus-menerus dari data real-time dan digabungkan dengan model simulasi, peta tersebut menjadi bagian pembentuk digital twin produksi. Siemens, misalnya, menawarkan add-on VSM Library untuk Plant Simulation X yang memungkinkan pengguna "menjalankan simulasi dinamis dari value stream" dan "membuat serta membandingkan beberapa skenario", seperti kondisi saat ini dan kondisi masa depan [35]. Penjelasan lebih lanjut tentang konsep ini dapat dilihat di halaman entitas [Digital Twin](https://www.m365.fm/entity/digital-twin/) dan di panduan [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

Cara value stream berfungsi sebagai model data yang hidup juga dibahas dalam episode m365.fm [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

**Catatan penting:** digitalisasi tidak memperbaiki alur yang buruk. TU Darmstadt secara eksplisit merekomendasikan agar alur yang stabil dan lean dibangun terlebih dahulu melalui desain value stream klasik, dan baru kemudian perbaikan digital dikerjakan. TU Darmstadt menyarankan agar proses yang kompleks tidak didigitalkan sebelum proses tersebut stabil [14].

## 12. Value Stream 4.0: Logistik Informasi sebagai Dimensi Kedua

**Value Stream Mapping 4.0** dikembangkan di Institute of Production Management, Technology and Machine Tools (PTW) di TU Darmstadt, Jerman. Tobias Meudt, Joachim Metternich, dan Eberhard Abele memaparkannya pada 2017 di CIRP Annals dengan judul "Value stream mapping 4.0: Holistic examination of value stream and information logistics in production" [13]. Sebuah buku berbahasa Inggris kemudian terbit: "Value Stream 4.0: A Systems View of Information Flow for Digitalization" karya Metternich, Meudt, dan Hartmann (CRC Press, dirilis Juli 2025, hak cipta 2026) [15].

Gagasan intinya: selain aliran material, **logistik informasi** dianalisis secara sistematis. Informasi harus tersedia pada waktu yang tepat, di tempat yang tepat, dalam jumlah dan kualitas yang tepat, dengan pemborosan seminimal mungkin [14]. Menurut panduan "Industrie 4.0 trifft Lean" (Industry 4.0 bertemu Lean) dari Asosiasi Industri Teknik Mesin Jerman (VDMA), yang dikembangkan secara ilmiah oleh Metternich, Meudt, dan Hartmann, metode ini mencakup elemen-elemen berikut [14]:

- **Cakupan yang lebih luas:** dari kontak pertama dengan pelanggan hingga penggunaan produk, di seluruh departemen yang menangani pesanan.
- **Kotak proses yang diperluas:** dengan sumber informasi, interval pencatatan, jenis pencatatan (otomatis, semi-otomatis, manual), dan nilai terkini.
- **Media penyimpanan sebagai garis:** kertas, ERP, MES, Excel, dan media penyimpanan lainnya digambarkan sebagai garis horizontal dan dihubungkan ke sumbernya dengan garis vertikal.
- **Delapan jenis pemborosan logistik informasi**, disusun sepanjang siklus hidup data: pada saat pembuatan dan transfer (pemilihan data, kualitas data, pengambilan data, transfer data), pada saat pemrosesan dan penyimpanan (menunggu dan persediaan informasi; transportasi, gerakan, dan pencarian), serta pada saat penggunaan (analisis data, dukungan keputusan).
- **Metrik:** ketersediaan informasi, penggunaan informasi, dan tingkat digitalisasi.

Dalam contoh sebuah produsen mesin khusus, analisis menemukan dua belas media penyimpanan yang digunakan, entri data ganda secara manual, serta tingkat digitalisasi dan penggunaan data masing-masing sebesar nol persen [14].

Bega dan rekan-rekannya memperluas Value Stream Mapping 4.0 pada 2023 dalam jurnal Production Engineering untuk identifikasi menyeluruh aliran data dan informasi [26]. Hal ini menunjukkan bahwa Value Stream 4.0 bukanlah metode yang sudah final, melainkan bidang riset yang masih aktif.

Pada 2018, Jörg Drees mengambil sudut pandang terkait dari perspektif vendor perangkat lunak dalam ZWF dengan judul "Wertstrom Management 4.0: Next Generation": meningkatnya keterhubungan informasi melalui Industry 4.0 dan industrial internet of things (IIoT) menciptakan ekspektasi baru, dan metode serta perangkat lunak harus menyesuaikan diri dengan bentuk baru pengorganisasian dan pengendalian rantai nilai [17].

## 13. Value Stream Management: Menjalankan Value Stream sebagai Tugas Kepemimpinan

Proyek value stream mapping memiliki awal dan akhir. **Value stream management** bersifat berkelanjutan. Artinya memimpin sebuah value stream lintas batas departemen dalam jangka panjang, dengan pembaruan peta secara berkala, sasaran di tingkat value stream, dan tanggung jawab yang jelas. Pengantar yang lebih rinci ada dalam artikel [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

Lugert dan Winkler berpendapat bahwa solusi teknis Industry 4.0 saja tidak cukup untuk mengubah value stream mapping yang statis menjadi pendekatan manajemen yang dinamis. Organisasi dan manusia harus dipertimbangkan secara setara [23]. ISO 22468:2020 mencerminkan siklus ini dalam strukturnya: analisis, desain, perencanaan, penilaian, dan penyesuaian value stream [40].

### Siklus value stream management

1. **Analisis:** catat kondisi saat ini, sebaiknya dengan data yang dikumpulkan secara otomatis.
2. **Desain:** gambarkan kondisi masa depan menggunakan pedoman desain, sebaiknya divalidasi melalui simulasi.
3. **Perencanaan:** rencana implementasi per loop value stream, dengan sasaran dan penanggung jawab.
4. **Implementasi:** tindakan dalam kegiatan kaizen dan pekerjaan harian.
5. **Penilaian:** pantau metrik secara terus-menerus dan nilai dampaknya dalam bentuk uang [25].
6. **Penyesuaian:** perbarui peta dan turunkan kondisi masa depan berikutnya.

### Peran value stream manager

LEI menggambarkan value-stream manager sebagai "seseorang yang diberi tanggung jawab yang jelas atas keberhasilan sebuah value stream". Orang ini mengidentifikasi nilai dari perspektif pelanggan, merancang value stream, dan mendorong menuju aliran yang semakin cepat. Karena uang, aset, dan orang biasanya berada di bawah departemen fungsional, value stream manager "memimpin melalui pengaruh, bukan jabatan". LEI menjadikan chief engineer Toyota sebagai model untuk peran ini [10].

Dalam praktiknya, value stream manager biasanya:

- memiliki peta kondisi saat ini dan masa depan serta rencana implementasi
- memfasilitasi tinjauan value stream secara berkala
- melacak metrik value stream (lead time, persediaan, pengiriman tepat waktu, produktivitas)
- menyelesaikan konflik sasaran antar departemen
- meneruskan hambatan kepada manajemen pabrik

Artikel [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/) menjelaskan secara rinci profil, wewenang, dan jebakan umum dari peran ini. Bagaimana value stream management didukung perangkat lunak di manufaktur dibahas dalam [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/).

Value stream management terkait erat dengan [Lean management](https://www.m365.fm/entity/lean-management/) secara keseluruhan; lihat panduan [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) dan [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Rutinitas harian yang menjaga kondisi masa depan tetap hidup, seperti rapat berjenjang dan gemba walk, menjadi topik panduan [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 14. Kesalahan Umum dalam Value Stream Mapping dan Cara Menghindarinya

| Kesalahan | Akibat | Langkah Penanggulangan |
|---|---|---|
| memetakan dari meja dengan data ERP | peta menunjukkan waktu standar, bukan kenyataan | catat di gemba dengan stopwatch dan penghitungan |
| tidak ada product family yang ditentukan | peta menjadi semrawut dan tidak dapat dievaluasi | matriks produk-proses sebelum penelusuran pertama |
| terlalu banyak detail | tim workshop kehilangan arah pada langkah-langkah tunggal | gambar kotak proses hanya di tempat aliran berhenti |
| aliran informasi diabaikan | penyebab persediaan tetap tidak jelas | tanyakan di setiap proses: dari mana ia tahu apa yang harus dibuat? |
| availability tidak diperhitungkan | bottleneck terlewatkan | bandingkan effective cycle time dengan takt time |
| hanya kondisi saat ini, tanpa kondisi masa depan | analisis tanpa dampak | desain kondisi masa depan dan rencana implementasi wajib ada |
| kondisi masa depan hanya berupa gambaran ideal tanpa rencana | frustrasi, tidak ada yang terjadi | value stream loop dengan target, penanggung jawab, dan tanggal |
| karyawan tidak dilibatkan | resistensi, data yang salah | validasi peta bersama-sama dengan area terkait |
| proyek sekali jalan tanpa penanggung jawab | peta usang dalam hitungan minggu | tunjuk value stream manager, tetapkan ritme tinjauan |
| digitalisasi sebelum stabilisasi | pemborosan ikut terotomatisasi | stabilkan aliran terlebih dahulu, baru digitalisasi [14] |
| basis waktu berbeda untuk kondisi saat ini dan masa depan | rasio aliran tidak dapat dibandingkan | tetapkan konvensi (hari kerja atau hari kalender) sekali untuk selamanya |

## 15. Perangkat Lunak Value Stream Mapping: Perbandingan Kategori

Orang yang mencari "value stream mapping software" umumnya ingin tahu alat mana yang cocok, fitur apa yang sebaiknya dimiliki, dan apakah ada opsi gratis. Alih-alih peringkat produk tunggal, pembagian ke dalam kategori lebih membantu, karena alat-alat tersebut berbeda bukan terutama dalam hal menggambar, melainkan dalam apa yang terjadi setelah peta digambar.

| Kategori | Contoh tipikal | Kekuatan | Keterbatasan | Paling cocok untuk |
|---|---|---|---|---|
| Kertas dan papan tulis | kertas cokelat, sticky notes, pensil | keterlibatan maksimal, tidak perlu keterampilan alat, gratis | tidak ada perhitungan, sulit dibagikan dan diversi | peta pertama di gemba, pelatihan |
| Perangkat lunak diagram dan papan tulis umum | Microsoft Visio, Lucidchart, Miro, EdrawMax | pustaka simbol, kolaborasi, sering tersedia tingkat gratis | metrik umumnya manual, tidak ada logika di balik simbol | dokumentasi, tim tersebar |
| Perangkat lunak VSM khusus dengan perhitungan metrik | iFAKT Polaris VSM, SimVSM (SimPlan), visTable | simbol dengan rumus bawaan, timeline otomatis, perbandingan varian dan skenario | biaya lisensi, kurva belajar | pekerjaan value stream rutin, value stream management |
| Perangkat lunak VSM dengan tautan simulasi | SimVSM Pro [34], Plant Simulation X dengan VSM Library [35] | analisis dinamis, pengujian kondisi masa depan | upaya pemodelan dan data lebih besar | produksi high-mix, keputusan investasi |
| Analisis berbasis data / process mining | ONIQ [36], pendekatan riset seperti ECOWERT [20] | metrik dari data produksi, analisis berkelanjutan alih-alih sekali jalan | kualitas data dan integrasi TI menentukan | pabrik dengan fondasi data MES/ERP |
| Platform value stream management (pengiriman perangkat lunak) | platform sesuai definisi pasar Gartner [31] | pengukuran end-to-end rantai pengiriman perangkat lunak | tidak dirancang untuk produksi fisik | organisasi TI dan perangkat lunak |

Baca klaim vendor secara kritis. ONIQ, misalnya, menyatakan bahwa otomatisasi mengurangi upaya analisis value stream hingga 90% [36]; tidak ada metodologi independen yang dipublikasikan. SimPlan menjelaskan bahwa SimVSM mencakup pencatatan digital dan angka kunci statis, dengan SimVSM Pro menambahkan parameter dinamis dan antarmuka ke simulasi [34].

### Kriteria pemilihan

- **Simbol:** Apakah alat ini mendukung simbol Rother/Shook yang umum, dan dapatkah Anda menambahkan simbol sendiri?
- **Logika perhitungan:** Apakah takt time, persediaan dalam hari, lead time, dan flow ratio dihitung secara otomatis? Apakah rumusnya transparan dan dapat disesuaikan?
- **Skenario:** Dapatkah Anda membuat versi dan membandingkan kondisi saat ini, kondisi masa depan, dan kondisi antara?
- **Dinamika:** Apakah tersedia simulasi atau tautan ke alat simulasi?
- **Koneksi data:** Dapatkah alat ini dimulai tanpa koneksi ERP atau MES dan mengambil alih data secara otomatis di kemudian hari?
- **Implementasi:** Apakah tindakan, kaizen burst, dan penanggung jawab dikelola dalam alat yang sama?
- **Kolaborasi dan operasi:** peran dan izin, multi-tenancy, cloud atau on-premises, integrasi ke dalam lanskap TI yang ada (untuk pabrik berbasis Microsoft, lihat panduan [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)).
- **Biaya:** model lisensi, uji coba, dan upaya pelatihan.

Satu pertanyaan uji yang baik: apakah alat ini hanya membantu mendokumentasikan kondisi saat ini, atau juga mendukung pengarahan kondisi masa depan selama pabrik berubah dari minggu ke minggu?

## 16. Digital Value Stream Mapping dengan iFAKT Polaris VSM dan BSM

> **Catatan: Penulis bekerja di iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), yang berkantor pusat di Stuttgart, Jerman, menurut perusahaan didirikan pada 2001 [19]. Karyawan perusahaan ini menulis beberapa makalah ZWF tentang dynamic dan digital value stream mapping yang dikutip dalam panduan ini (ikhtisar di bagian 18, "Publikasi penelitian"). Keluarga perangkat lunak [iFAKT Polaris](https://www.m365.fm/entity/polaris/) berkembang dari pekerjaan ini; panduan terpisah tersedia di [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). Dua modul relevan untuk value stream mapping:

**[Polaris VSM](https://www.m365.fm/entity/polaris-vsm/)** adalah alat manajemen Lean digital yang digunakan produsen untuk memetakan rantai pasok dan value stream. Menurut unggahan Microsoft tentang daftar AppSource-nya, metrik dapat dihitung, diperiksa, dan divisualisasikan melalui sistem rumus, dilengkapi papan Kanban dan Kaizen serta kolaborasi dari lokasi mana pun [29]. Di ifakt.de, vendor mencantumkan fungsi-fungsi berikut [28]:

- peta value stream drag-and-drop dengan simbol standar dan hierarki multi-level
- metrik otomatis seperti lead time, cycle time, rasio nilai tambah, dan OEE dalam dashboard, dengan laporan siap ekspor
- skenario tanpa batas, analisis sensitivitas, riwayat versi dengan rollback, dan perbandingan metrik berdampingan
- izin berbasis peran, multi-tenancy, dan dokumentasi PDCA
- dimulai tanpa koneksi ERP atau MES, dengan koneksi data opsional di kemudian hari

Dalam proyek riset ECOWERT, Polaris VSM digunakan sebagai alat evaluasi untuk data yang dikumpulkan secara otomatis (lihat bagian 11) [21]. Vendor tidak mencantumkan fungsi simulasi dalam arti sempit; untuk analisis dinamis Anda memerlukan alat dari kategori "tautan simulasi" (bagian 15). Angka manfaat di halaman vendor (misalnya lead time 25% lebih singkat) tidak diulang di sini karena tidak disertai metodologi.

**[Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)** (Business Swimlane Modeling) menambahkan proses bisnis ke tampilan value stream. Menurut daftar AppSource, langkah-langkah proses dikelompokkan dalam pool dan lane, serta faktor waktu dan metrik dicatat dan dibandingkan; paket yang tersedia mulai dari "Read Only" hingga "Basic" (rekaman BPMN, template swimlane, rumus dasar, lead time, dan grafik keseimbangan), lalu "Excellence" dan "Integrate & Customize" [30]. Ini berguna ketika value stream tidak dimulai di produksi, melainkan di penawaran, rekayasa, dan penanganan pesanan.

Kedua modul terdaftar di Microsoft AppSource [29][30]. Vendor tidak mempublikasikan harga; demo tersedia atas permintaan [30].

**Penilaian:** Alat seperti Polaris VSM tidak menggantikan turun langsung ke gemba atau merancang kondisi masa depan. Alat ini mengambil alih perhitungan, membuat skenario dapat dibandingkan, dan dapat menjaga peta tetap mutakhir ketika data mengalir secara otomatis. Apakah alat ini cocok untuk pabrik Anda bergantung pada keragaman produk, data yang tersedia, dan lanskap TI. Periksa alat ini terhadap kriteria seleksi di bagian 15 seperti solusi lainnya.

## 17. Manajemen Aliran Nilai dalam Pengiriman Perangkat Lunak: Perbedaannya

Jika Anda mencari "value stream mapping" atau "value stream management" di google.com, banyak hasilnya berasal dari pengembangan perangkat lunak dan DevOps. Gartner menggambarkan platform value stream management sebagai alat yang "memungkinkan organisasi untuk mengoptimalkan pengiriman produk dari ujung ke ujung dan meningkatkan hasil bisnis"; alat ini bersifat agnostik terhadap teknologi dan terhubung dengan alat yang sudah ada di seluruh siklus hidup pengiriman perangkat lunak [31]. Mik Kersten, dalam "Project to Product" (IT Revolution, 2018), memperkenalkan Flow Framework dengan metrik seperti flow time dan flow load untuk dunia ini [39].

Ide dasarnya sama seperti di pabrik: membuat aliran dari permintaan pelanggan hingga pengiriman menjadi terlihat dan memangkas waktu tunggu. Namun perbedaannya cukup besar. Dalam pengiriman perangkat lunak, yang mengalir adalah item pekerjaan, bukan material; persediaan berupa tiket yang belum selesai; dan takt time sulit didefinisikan secara bermakna. Martin dan Osterling mentransfer metode ini ke pekerjaan kantor dan pekerjaan berbasis pengetahuan, dan menempatkan metrik seperti percent complete and accurate (%C&A) di pusatnya: bagian pekerjaan yang ditemukan lengkap dan bebas kesalahan oleh langkah berikutnya. Jika dikalikan di seluruh langkah, hasilnya disebut rolled %C&A, yang dalam glosarium Martin disebut rolled first pass yield [6][44]. Untuk manufaktur, metode klasik dengan takt time, persediaan, dan timeline tetap menjadi titik acuan.

## 18. Bukti dan Publikasi Penelitian

Angka studi kasus yang kokoh dan dipublikasikan secara independen untuk value stream mapping lebih jarang daripada klaim keberhasilan yang banyak beredar di internet. Berikut yang terdokumentasi:

- **Pembuat mesin khusus (TU Darmstadt / VDMA):** dua belas media penyimpanan dan tingkat digitalisasi nol persen (rincian di bagian 12) [14].
- **ECOWERT (Fraunhofer IPA dan iFAKT):** analisis value stream hampir real-time dengan sensor yang dipasang kemudian (rincian di bagian 11) [20][21].
- **HELLA (ZWF 2018):** pengembangan model valuasi berbasis biaya untuk tindakan value stream bersama pemasok otomotif Jerman HELLA GmbH & Co. KGaA, untuk memprioritaskan perbaikan yang saling bersaing dalam istilah bisnis [25].
- **Schaeffler (ZWF 2017):** Andreas Lugert, manajemen Lean di Schaeffler AG, dan Herwig Winkler (BTU Cottbus-Senftenberg) menggambarkan jalur dari value stream mapping statis ke value stream management dinamis [23].
- **Thrustmaster of Texas (LEI):** laporan kasus tentang spaghetti chart sebagai pelengkap analisis aliran, dengan pengiriman tepat waktu 100% yang dilaporkan 18 bulan kemudian [43].

Studi kasus buku teks yang terkenal, "Acme Stamping" dari *Learning to See*, bersifat fiktif [1] tetapi cocok untuk praktik.

### Publikasi penelitian tentang value stream mapping dinamis dan digital

Makalah berikut ditulis oleh penulis dari iFAKT GmbH, sebagian bersama Fraunhofer IPA. Makalah tersebut berbahasa Jerman dan dapat diperiksa melalui DOI di penerbit. Secara bersama-sama, makalah ini menelusuri perkembangan dari perhitungan metrik, melalui simulasi, hingga antarmuka data berbasis peristiwa:

| Tahun | Judul (terjemahan Inggris) | Penulis | Publikasi |
|---|---|---|---|
| 2011 | Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (Optimisasi produksi melalui metrik pemodelan value stream) | J. Drees, C. Sack | ZWF 106 (6), hlm. 466–470, DOI 10.3139/104.110589 [19] |
| 2014 | Dynamische Simulation von Wertströmen (Simulasi dinamis value stream) | S. Türck, A. Weimer, [L. Schubert](https://www.m365.fm/entity/lars-schubert/), [J. Drees](https://www.m365.fm/entity/jorg-drees/) | ZWF 109 (11), hlm. 839–842, DOI 10.3139/104.111242 [16] |
| 2018 | Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation (Perspektif baru untuk metode value stream) | J. Drees | ZWF 113 (9), hlm. 605–609, DOI 10.3139/104.111974 [17] |
| 2023 | Universelle Datenschnittstelle für digitale Wertstromdienste (Antarmuka data universal untuk layanan value stream digital) | M. Böhm, J. Drees, B. Sai, K. Erlach, S. Stambera, T. Teriete | ZWF 118 (5), hlm. 293–297, DOI 10.1515/zwf-2023-1062 [18] |
| 2023 | Daten für Wertstromanalysen automatisch erfassen (Mengumpulkan data untuk analisis value stream secara otomatis) | J. Drees, S. Stambera, M. Böhm | IT&Production, 12 Januari 2023 [21] |

Makalah ZWF independen lainnya tentang perluasan metode ini mencakup Lugert/Winkler (2017) [23], Busch/Niehues/Maassen (2018) [25] dan Urnauer (2019) [24]. Dalam bahasa Inggris, jalur penelitian utamanya adalah Meudt dkk. di CIRP Annals (2017) [13] dan Bega dkk. di Production Engineering (2023) [26].

## 19. FAQ: Pertanyaan Seputar Value Stream Mapping Dijawab

### Apa itu value stream mapping dengan bahasa sederhana?
Value stream map adalah peta satu halaman dari alur produksi Anda. Simbol sederhana menunjukkan proses apa saja yang dilalui sebuah produk, di mana material menunggu, berapa lama itu berlangsung, dan informasi apa yang mengendalikan proses-proses tersebut. Peta ini memperlihatkan betapa kecilnya bagian dari lead time yang benar-benar menambah nilai.

### Apa saja langkah-langkah value stream mapping?
Tentukan tujuan dan lingkup, tentukan product family, catat permintaan pelanggan dan takt time, telusuri proses mundur dari pengiriman, isi kotak data, hitung persediaan, tambahkan pemasok dan transportasi, gambar alur informasi, gambar timeline dan hitung metrik, lalu tandai pemborosan dan validasi peta. Setelah itu menyusul future state map dan rencana implementasi. Bagian 5 menjelaskan setiap langkah.

### Apa perbedaan antara current state map dan future state map?
Current state map mencatat bagaimana material dan informasi mengalir saat ini, dengan data hasil pengukuran. Future state map merancang bagaimana seharusnya aliran itu, dengan mengikuti pedoman seperti memproduksi sesuai takt time, aliran kontinu jika memungkinkan, supermarket jika aliran tidak mungkin, dan satu pacemaker process [11]. Keduanya bersama-sama membentuk metode value stream, yang diikuti oleh rencana implementasi.

### Apa perbedaan antara value stream mapping dan process mapping?
Process map menunjukkan langkah-langkah dari satu prosedur, sering kali di dalam satu departemen. Value stream map mencakup satu product family dari awal hingga akhir dan menambahkan apa yang tidak ada pada process map: persediaan di antara langkah, alur informasi yang mengendalikan produksi, dan timeline dengan lead time serta processing time.

### Apa perbedaan antara value stream mapping dan value stream management?
Value stream mapping adalah sebuah proyek: tim mencatat kondisi saat ini dan merancang kondisi masa depan. Value stream management adalah kepemimpinan berkelanjutan atas value stream oleh value stream manager yang bertanggung jawab, dengan peta yang diperbarui secara berkala, metrik, dan tinjauan. ISO 22468:2020 menggambarkan siklus analisis, perancangan, perencanaan, penilaian, dan penyesuaian ini [40].

### Simbol apa saja yang digunakan dalam value stream mapping?
Yang paling penting adalah process box, data box, inventory triangle, push arrow, supermarket, FIFO lane, truk, simbol kanban, panah informasi manual dan elektronik, heijunka box, kaizen burst, dan timeline. Tabel lengkapnya ada di bagian 4.

### Metrik apa saja yang dicantumkan pada value stream map?
Per proses: cycle time, changeover time, availability (uptime), ukuran batch, dan jumlah tenaga kerja. Per titik persediaan: jumlah dan days of inventory. Untuk seluruh stream: takt time, lead time, processing time, dan flow ratio. Rumusnya ada di bagian 6.

### Bagaimana cara menghitung process cycle efficiency (flow ratio)?
Bagi processing time (ditambah process time seperti curing) dengan lead time, lalu kalikan 100%. Nyatakan keduanya dalam satuan dan dasar yang sama (hari kerja atau hari kalender). Pada contoh di bagian 7: 413 s ÷ 1.080.000 s = 0,038%.

### Mengapa pemetaan dilakukan dari pelanggan ke arah mundur?
Karena pelangganlah yang menentukan ritme. Jika Anda mulai dari pengiriman dan bergerak ke hulu, Anda lebih dulu mencatat proses-proses yang seharusnya mengendalikan aliran, lalu menilai semua proses lain terhadap permintaan pelanggan [1][27].

### Berapa lama value stream mapping memakan waktu?
Untuk value stream yang dapat dikelola di satu pabrik, satu hingga dua hari untuk current state dan satu lokakarya lagi untuk future state adalah hal yang realistis [unverified: estimasi berdasarkan pengalaman tipikal, tanpa sumber yang dapat diverifikasi]. ASQ menjelaskan kaizen event tiga hari sebagai pembuka [46]. Usaha yang sesungguhnya adalah implementasinya, yang memakan waktu berbulan-bulan.

### Apakah value stream mapping termasuk Lean atau Six Sigma?
Ini adalah alat Lean dari Toyota Production System, dan ASQ mengelompokkannya ke dalam Lean [46]. Wikipedia berbahasa Inggris menyebutnya "metode yang diakui sebagai bagian dari metodologi Lean Six Sigma" [49]. Alat ini tidak memerlukan statistik Six Sigma untuk dapat bekerja.

### Apa kelemahan value stream mapping?
Ini adalah potret yang didasarkan pada rata-rata, kurang mampu menunjukkan variasi produk dan variabilitas, memerlukan pengumpulan data secara manual, dan tidak memungkinkan Anda menguji future state. Simulasi dinamis dan pengumpulan data otomatis menutup sebagian dari celah ini [22][23].

### Apa itu dynamic value stream mapping?
Value stream mapping yang memperhitungkan perilaku waktu. Proses diberi distribusi alih-alih rata-rata, permintaan mengikuti deret waktu, dan simulasi menunjukkan bagaimana persediaan dan lead time berkembang seiring waktu [16].

### Apakah ada standar untuk value stream mapping?
Ya. ISO 22468:2020 "Value stream management (VSM)" mencakup analisis value stream, desain value stream, perencanaan value stream, serta penilaian dan penyesuaian value stream [40]. ISO mengonfirmasi standar ini masih berlaku pada 2025. Di Jerman, pedoman VDI 2870 tentang sistem produksi holistik juga relevan [7].

### Apakah ada perangkat lunak value stream mapping gratis?
Banyak alat diagram umum menawarkan paket gratis dengan simbol VSM, dan templat spreadsheet juga umum digunakan. Alat tersebut biasanya tidak menghitung metrik secara otomatis. Perangkat lunak VSM khusus umumnya berbayar, sering kali dengan uji coba. Untuk peta pertama Anda, kertas dan pensil tetap menjadi pilihan gratis yang terbaik.

### Apakah MES dapat menggantikan value stream mapping?
Tidak. MES menyediakan data berharga seperti waktu siklus, waktu henti, dan persediaan, yang dapat menjadi masukan bagi peta value stream digital [20]. Merancang aliran, yaitu menentukan supermarket, jalur FIFO, dan pacemaker, tetap menjadi tugas metode value stream dan orang-orang yang menerapkannya.

## 20. Kesimpulan

Sejak "Learning to See" terbit pada 1998, value stream mapping menjadi alat standar untuk membuat aliran dalam produksi terlihat [1]. Nilainya bukan pada peta itu sendiri, melainkan pada apa yang dipicunya: pemahaman bersama tentang keseluruhan aliran, angka yang jujur untuk rasio aliran, serta keadaan masa depan yang dirancang sesuai pedoman yang jelas [3][11].

Ada tiga poin yang perlu diingat. Pertama, hitung dengan cermat. Takt time, effective cycle time, hari persediaan dari Hukum Little, dan rasio aliran pada basis waktu tetap mengubah sebuah gambar menjadi dasar keputusan yang andal. Kedua, jangan berhenti pada keadaan saat ini. Desain keadaan masa depan, rencana implementasi, dan value stream manager yang bertanggung jawab menentukan apakah sesuatu benar-benar berubah. Ketiga, gunakan ekstensi di tempat metode klasik mencapai batasnya. Simulasi dinamis, data yang dikumpulkan secara otomatis, dan sudut pandang logistik informasi dari Value Stream 4.0 mempersiapkan metode ini untuk variasi produk yang tinggi dan pabrik digital [13][16][18], asalkan aliran dibuat stabil terlebih dahulu [14].

Mulailah dengan kertas, pensil, dan satu keluarga produk. Beralihlah ke digital ketika Anda ingin memperbarui peta secara rutin.

## Bacaan lanjutan di m365.fm

**Postingan blog**
- [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/)
- [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/)

**Episode podcast**
- [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Glosarium**
[Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Eight Wastes](https://www.m365.fm/entity/eight-wastes/) · [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)

**Perusahaan dan orang**
[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Panduan terkait**
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** adalah pembawa acara m365.fm dan bekerja di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) di Stuttgart, Jerman. Di m365.fm ia menulis tentang manajemen lean, pemetaan aliran nilai, dan digitalisasi manufaktur dengan Microsoft 365 dan Azure. Fokusnya adalah bagaimana alat Lean yang sudah teruji seperti pemetaan aliran nilai bekerja bersama data real-time, simulasi, dan platform data modern tanpa kehilangan inti metodisnya.

**Catatan: Penulis bekerja di iFAKT GmbH.** Makalah penelitian iFAKT yang dikutip dapat diperiksa melalui DOI di ZWF.

# Sources

All sources accessed November 20, 2026. Sources marked "verified 11/20/2026" were opened for this English version; the others were verified for the German original on the same date and spot-checked.

1. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, 1998 (introduction dated May 1998, Ann Arbor); current edition subtitled "… to Add Value and Eliminate Muda", LEI, September 2018, 148 pages, ISBN 978-0-9667843-0-5. Publisher page (Shingo award 1999, Shook eleven years at Toyota): https://www.lean.org/store/workbooks/learning-to-see/ · Introduction (PDF): https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-introduction.pdf (verified 11/20/2026)
2. Rother, M.; Shook, J.: Sehen lernen. Mit Wertstromdesign die Wertschöpfung erhöhen und Verschwendung beseitigen. German edition, version 1.1. Lean Management Institut, Aachen 2004, ISBN 978-3-9809521-1-8 (German Digital Library catalog).
3. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. Springer, 1st ed. 2007; 2nd ed. 2010 (VDI-Buch), ISBN 978-3-540-89867-2; 3rd ed. Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (eBook 978-3-662-58907-6). Sample of 2nd ed.: https://lesejury.de/media/samples/672/9783540898672_leseprobe.pdf · Overview with the eight design guidelines: http://www.wertstromdesign.de/wertstromdesign.html (verified 11/20/2026)
4. Erlach, K.: Value Stream Design: The Way Towards a Lean Factory. Springer, Lecture Notes in Logistics, published September 2012 (copyright 2013), ISBN 978-3-642-12568-3 (hardcover), eBook 978-3-642-12569-0. https://link.springer.com/978-3-642-12568-3 · Publisher description ("ten design guidelines") via https://ebooks.mpdl.mpg.de/ebooks/Record/EB000384257 (verified 11/20/2026)
5. Klevers, T.: Wertstrom-Mapping und Wertstrom-Design. Verschwendung erkennen – Wertschöpfung steigern. mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9 (bibliographic data per [27]).
6. Martin, K.; Osterling, M.: Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation. McGraw-Hill, New York, published October 2013 (copyright 2014), ISBN 978-0-07-182891-8. https://www.mheducation.com/highered/mhp/product/value-stream-mapping-how-visualize-work-align-leadership-organizational-transformation.html (verified 11/20/2026)
7. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review. VDI (Association of German Engineers), July 2012. https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
8. Takt Time (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/ (verified 11/20/2026)
9. Seven Wastes (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/ (verified 11/20/2026)
10. Value-Stream Manager (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-manager/ (verified 11/20/2026)
11. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/ (verified 11/20/2026)
12. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://econpapers.repec.org/RePEc:inm:oropre:v:9:y:1961:i:3:p:383-387 (verified 11/20/2026)
13. Meudt, T.; Metternich, J.; Abele, E.: Value stream mapping 4.0: Holistic examination of value stream and information logistics in production. CIRP Annals 66 (1), 2017, pp. 413–416. DOI: 10.1016/j.cirp.2017.04.005 (bibliographic data per the reference list of [26]).
14. VDMA / PTW TU Darmstadt (Metternich, J.; Meudt, T.; Hartmann, L.): Leitfaden Industrie 4.0 trifft Lean, excerpt on Value Stream Mapping 4.0 (German). https://www.ptw.tu-darmstadt.de/media/fachgebietptw/dokumente_3/wissenssammlung_ptw/leitfaeden_2/Leitfaden_I40_Lean.pdf
15. Metternich, J.; Meudt, T.; Hartmann, L.: Value Stream 4.0: A Systems View of Information Flow for Digitalization. CRC Press, released July 20, 2025 (copyright 2026), ISBN 978-1-032-95831-6. https://www.routledge.com/Value-Stream-40-A-Systems-View-of-Information-Flow-for-Digitalization/Metternich-Meudt-Hartmann/p/book/9781032958316 (verified 11/20/2026)
16. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (iFAKT GmbH): Dynamische Simulation von Wertströmen. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html (verified 11/20/2026)
17. Drees, J. (iFAKT GmbH): Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
18. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
19. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
20. ECOWERT – Echtzeitorientierte Wertstromanalyse für die nachhaltige Produktionsoptimierung (reference project). Fraunhofer IPA. https://www.ipa.fraunhofer.de/de/referenzprojekte/ECOWERT.html (verified 11/20/2026)
21. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen. IT&Production, January 12, 2023 (updated July 23, 2024). https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/ (verified 11/20/2026)
22. Digitalized value stream analysis: We are automating the gemba walk. Fraunhofer IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/production-management-and-value-stream-mapping-and-design/WertstromDigital.html (verified 11/20/2026)
23. Lugert, A.; Winkler, H.: Von der Wertstromanalyse zum Wertstrommanagement. ZWF 112 (4), 2017, pp. 261–265. DOI: 10.3139/104.111703. https://www.degruyterbrill.com/document/doi/10.3139/104.111703/html
24. Urnauer, C.: Die digitale Wertstrommethode. ZWF 114, 2019 (issue and pages not shown at access). DOI: 10.3139/104.112203. https://www.degruyterbrill.com/document/doi/10.3139/104.112203/html
25. Busch, O.; Niehues, M.; Maassen, K.: Die monetäre Bewertung von Wertströmen. ZWF 113 (6), 2018, pp. 389–392. DOI: 10.3139/104.111935. https://www.degruyterbrill.com/document/doi/10.3139/104.111935/html
26. Bega, M.; Sapel, P.; Ercan, F.; Schramm, T.; Spitz, M.; Kuhlenkötter, B.; Hopmann, C.: Extension of value stream mapping 4.0 for comprehensive identification of data and information flows within the manufacturing domain. Production Engineering 17 (6), 2023, pp. 915–927. DOI: 10.1007/s11740-023-01207-5. https://link.springer.com/10.1007/s11740-023-01207-5
27. Wertstromanalyse. Wikipedia (German-language). https://de.wikipedia.org/wiki/Wertstromanalyse (verified 11/20/2026)
28. Polaris VSM – Digital Value Stream Tool in Lean Management (vendor page). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/ (verified 11/20/2026)
29. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536 (verified 11/20/2026)
30. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1 (verified 11/20/2026)
31. Value Stream Management Platforms. Gartner Peer Insights. https://www.gartner.com/reviews/market/value-stream-management-platforms (verified 11/20/2026)
32. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (Japanese original 1978). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
33. Liker, J. K.: The Toyota Way: 14 Management Principles from the World's Greatest Manufacturer. McGraw-Hill, New York 2004, ISBN 978-0-07-139231-0.
34. SimVSM – digital value stream analysis. SimPlan AG. https://www.simplan.de/en/software/simvsm (verified 11/20/2026)
35. Plant Simulation X – Value Stream Mapping. Siemens. https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/ (verified 11/20/2026)
36. Was ist eine Wertstromanalyse? (What is a value stream analysis?) ONIQ (German). https://oniq.com/de/ressourcen/was-ist-eine-wertstromanalyse (verified 11/20/2026)
37. Wertstromanalyse (REFA lexicon). REFA Bundesverband. https://refa.de/service/refa-lexikon/wertstromanalyse
38. Wertstromanalyse: Anleitung, Kennzahlen, Symbole. Industriezeitschrift (German). https://industriezeitschrift.de/qualitaet/wertstromanalyse/
39. Kersten, M.: Project to Product: How to Survive and Thrive in the Age of Digital Disruption with the Flow Framework. IT Revolution Press, Portland 2018, ISBN 978-1-942788-39-3.
40. ISO 22468:2020 Value stream management (VSM). ISO/TC 154, published March 9, 2020, confirmed June 25, 2025. https://committee.iso.org/standard/73292.html (verified 11/20/2026) · Table of contents (DIN): https://www.din.de/de/mitwirken/normenausschuesse/nia/veroeffentlichungen/wdc-beuth:din21:322285827/toc-3156892/download
41. Fuchs, H.-W.: Wertstrom-Methode (diploma thesis). Hochschule Mittweida. https://monami.hs-mittweida.de/frontdoor/deliver/index/docId/796/file/DA_Wertstrommethode.pdf
42. Wertstromanalyse (Value Stream Mapping). Mind Logistik (German). https://mind-logistik.de/knowhow/wertstromanalyse/
43. Small Chart, Big Impact: How a Simple Spaghetti Chart Led to Huge Wins at Thrustmaster of Texas. Lean Enterprise Institute, The Lean Post, February 4, 2016. https://www.lean.org/the-lean-post/articles/small-chart-big-impact-how-a-simple-spaghetti-chart-led-to-huge-wins-at-thrustmaster-of-texas/ (verified 11/20/2026)
44. The Karen Martin Group: Lean Terminology (glossary, PDF, 2014): definitions of activity ratio, lead time, process time, %C&A and rolled first pass yield. https://tkmg.com/wp-content/files/Lean-Terminology.pdf (verified 11/20/2026)
45. Value-Stream Mapping (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/ (verified 11/20/2026)
46. Value Stream Mapping. ASQ, Quality Resources (adapted from "Lean Lessons: Value Stream Mapping – An Introduction", Quality Progress). https://asq.org/quality-resources/lean/value-stream-mapping (verified 11/20/2026)
47. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (verified 11/20/2026)
48. Lean & Environment Toolkit, Chapter 3 (Value Stream Mapping). US Environmental Protection Agency. https://epa.gov/sustainability/lean-environment-toolkit-chapter-3 (verified 11/20/2026)
49. Value-stream mapping. Wikipedia (English). https://en.wikipedia.org/wiki/Value-stream_mapping (verified 11/20/2026)
50. ISA-95 framework and layers. Siemens. https://www.siemens.com/en-us/technology/isa-95-framework-layers/ (verified 11/20/2026)
51. 8 Wastes (DOWNTIME). GoLeanSixSigma.com. https://goleansixsigma.com/8-wastes/ (verified 11/20/2026)
