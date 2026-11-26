# SEO metadata

| Field | Value |
|---|---|
| Meta title | SMED: Schnelles Rüsten und Reduzierung der Rüstzeit im Lean |
| Meta description | SMED (Single-Minute Exchange of Die) erklärt: schnelles Umrüsten in 8 Schritten, interne vs. externe Rüstzeit, Formeln, Beispiele und OSHA LOTO. |
| Slug | `smed-changeover-reduction` |

# SMED: Reduzierung der Rüstzeit in einem Schritt nach dem anderen

> **Jawaban singkat:** SMED (single-minute exchange of die) adalah metode untuk mengganti mesin atau lini dari satu produk ke produk berikutnya dalam waktu sesingkat mungkin, dengan target di bawah sepuluh menit, yaitu jumlah menit satu digit. Gagasan intinya berasal dari Shigeo Shingo: pisahkan pekerjaan persiapan yang hanya bisa dilakukan saat mesin berhenti (internal setup) dari pekerjaan yang bisa dilakukan saat mesin berjalan (external setup), ubah sebanyak mungkin pekerjaan internal menjadi eksternal, lalu rampingkan semua yang tersisa [1][6].

> **Poin-poin utama**
> - Waktu changeover berjalan dari unit baik terakhir pada run lama hingga unit baik pertama pada run baru, dengan kecepatan normal. Run-up dan penyesuaian dihitung sebagai waktu changeover [2][21].
> - SMED bekerja dalam urutan tetap: amati, pisahkan internal dari eksternal, ubah internal menjadi eksternal, rampingkan internal, rampingkan eksternal, standarisasi, ulangi [5].
> - Sebagian besar peningkatan awal berasal dari pengorganisasian (staging, daftar periksa, troli, pekerjaan paralel), bukan dari perangkat keras yang mahal [19][20].
> - Changeover yang lebih singkat baru memberi manfaat penuh jika waktunya dimanfaatkan: lot yang lebih kecil, changeover yang lebih sering dan EPEI yang lebih pendek, atau kapasitas tambahan di bottleneck. Tentukan mana yang dituju sebelum proyek dimulai.
> - Ukuran lot dan persediaan bergantung pada waktu changeover. Dalam rumus ukuran lot klasik, memangkas biaya setup sebesar 75 persen akan memangkas separuh ukuran lot ekonomis.
> - Setiap langkah internal setup dilakukan pada peralatan yang berhenti. Di AS, pekerjaan setup termasuk "servicing" berdasarkan standar lockout/tagout OSHA, kecuali ada pengecualian sempit yang berlaku [8][9].
> - Keuntungan changeover akan memudar tanpa standard work, audit, dan KPI changeover yang ditampilkan di papan lantai produksi. Penelitian mengkritik praktik SMED karena kurang memanfaatkan desain peralatan dan lemahnya keberlanjutan [12][13].
> - KPI yang baik: rata-rata waktu changeover dan sebarannya, persentase changeover yang sesuai standar, scrap run-up, jumlah changeover per minggu, EPEI, dan hari persediaan.

## Daftar isi

1. [Apa itu SMED? Definisi dan gagasan inti](#apa-itu-smed-definisi-dan-gagasan-inti)
2. [Mengapa waktu changeover penting: ukuran lot, persediaan, fleksibilitas dan OEE](#mengapa-waktu-changeover-penting-ukuran-lot-persediaan-fleksibilitas-dan-oee)
3. [Sejarah: dari Taylor dan Ford hingga Shingo dan Toyota](#sejarah-dari-taylor-dan-ford-ke-shingo-dan-toyota)
4. [Cara mengukur waktu changeover dengan benar](#cara-mengukur-waktu-changeover-dengan-benar)
5. [Metode SMED dalam 8 langkah](#metode-smed-dalam-8-langkah)
6. [Delapan teknik Shingo dengan contoh](#delapan-teknik-shingo-dengan-contoh)
7. [Teknik changeover menurut jenis peralatan](#teknik-changeover-berdasarkan-jenis-peralatan)
8. [Contoh SMED: proyek lengkap pada mesin injection molding](#contoh-smed-proyek-lengkap-pada-mesin-injection-molding)
9. [Dari changeover yang lebih singkat ke lot yang lebih kecil: EPEI dan penentuan ukuran lot](#dari-changeover-yang-lebih-singkat-ke-lot-yang-lebih-kecil-epei-dan-lot-sizing)
10. [Keselamatan: changeover, lockout/tagout dan ergonomi](#keselamatan-changeover-lockouttagout-dan-ergonomi)
11. [Kualitas: persetujuan produk pertama, error proofing dan line clearance yang diatur](#kualitas-persetujuan-produk-pertama-error-proofing-dan-line-clearance-yang-diatur)
12. [Orang dan peran: siapa mengerjakan apa dalam changeover](#orang-dan-peran-siapa-mengerjakan-apa-dalam-changeover)
13. [Templat dan daftar periksa SMED](#template-smed-dan-daftar-periksa)
14. [Peta jalan penerapan: dari pilot hingga sistem changeover di seluruh pabrik](#peta-jalan-penerapan-dari-pilot-hingga-sistem-changeover-di-seluruh-pabrik)
15. [KPI changeover: cara mengukur kemajuan](#kpi-perubahan-produksi-cara-mengukur-kemajuan)
16. [Dasar bisnis: biaya, ROI dan akuntansi persediaan](#kasus-bisnis-biaya-roi-dan-akuntansi-persediaan)
17. [SMED dan alat lean lainnya](#smed-dan-alat-lean-lainnya)
18. [Contoh SMED yang terdokumentasi](#contoh-smed-yang-terdokumentasi)
19. [Kesalahan umum SMED](#kesalahan-umum-dalam-smed)
20. [Batasan dan kritik terhadap SMED](#batasan-dan-kritik-terhadap-smed)
21. [SMED go digital: data, video, MES dan penjadwalan](#smed-go-digital-data-video-mes-dan-penjadwalan)
22. [Glosarium SMED](#glosarium-smed)
23. [FAQ: pertanyaan tentang SMED dan changeover](#faq-smed-dan-pertanyaan-tentang-changeover)
24. [Kesimpulan dan langkah pertama](#kesimpulan-dan-langkah-pertama)

## Apa itu SMED? Definisi dan gagasan inti

Lean Enterprise Institute (LEI) mendefinisikan [SMED](https://www.m365.fm/entity/smed/) sebagai proses untuk mengganti peralatan produksi dari satu nomor komponen ke nomor komponen lain dalam waktu sesingkat mungkin [1]. "Single-minute" tidak berarti satu menit. Maksudnya adalah angka satu digit dalam satuan menit, yaitu di bawah sepuluh menit [1]. Istilah "die" berasal dari mesin press stamping tempat metode ini pertama kali diterapkan, tetapi SMED berlaku untuk setiap pergantian produk: cetakan, fixture, alat potong, pelat cetak, komponen format pada lini pengemasan, resep pada mesin pengisian.

[Changeover](https://www.m365.fm/entity/setup-time/) (juga disebut setup) adalah kegiatan mengalihkan sebuah mesin atau sekelompok mesin yang saling terhubung, seperti sel atau lini perakitan, dari satu produk ke produk lain [2]. LEI mengukur waktu changeover sejak unit terakhir dari run yang selesai keluar dari proses hingga unit pertama yang dapat diterima dari run berikutnya keluar [2]. Batas ini penting, dan kita akan kembali membahasnya pada bagian pengukuran.

### Setup internal dan setup eksternal

Wawasan kunci Shingo adalah membagi setiap changeover menjadi dua jenis pekerjaan [1]:

| Jenis | Definisi | Contoh |
|---|---|---|
| **Setup internal** | Pekerjaan yang hanya dapat dilakukan saat mesin berhenti | Melepas dan mengeluarkan die lama, memasang die baru, mengganti komponen format di dalam pelindung, penyesuaian produk pertama |
| **Setup eksternal** | Pekerjaan yang dapat dilakukan saat mesin masih menjalankan job sebelumnya atau sudah menjalankan job berikutnya | Mengambil die, alat, dan material baru; memanaskan cetakan terlebih dahulu; memeriksa die baru dari kerusakan; mengembalikan die lama ke penyimpanan; administrasi |

Pada changeover yang belum diperbaiki, hampir semua pekerjaan dilakukan saat mesin berhenti: operator menghentikan mesin lalu mencari die, crane, kunci yang tepat, dan gambarnya. SMED memindahkan kegiatan "mencari" dan "mengambil" dari waktu berhenti, kemudian menyerang pekerjaan yang benar-benar memerlukan mesin berhenti.

### SMED, quick changeover, dan pengurangan setup: istilahnya

Istilah-istilah ini saling tumpang tindih, dan pabrik di AS menggunakannya secara bergantian:

- **SMED (single-minute exchange of die):** nama Shingo untuk metode ini dan tujuannya berupa angka satu digit dalam menit [1][6].
- **Quick changeover (QCO):** istilah umum di lantai produksi AS untuk praktik yang sama, digunakan misalnya oleh pusat NIST MEP [18].
- **Setup reduction / setup time reduction:** label umum yang mencakup SMED ditambah perubahan rekayasa pada peralatan.
- **OTED (one-touch exchange of die):** target yang lebih ketat, yaitu changeover di bawah 100 detik [5].
- **Changeover time reduction:** hasilnya. SMED adalah metode yang paling luas digunakan untuk itu, tetapi bukan satu-satunya cara; desain produk, desain peralatan, dan penjadwalan juga berkontribusi [13][15].

### Gagasan inti dalam satu kalimat

Jangan menghentikan mesin untuk hal yang bisa dilakukan saat mesin berjalan, dan buat apa pun yang harus dilakukan selama mesin berhenti sesederhana mungkin sehingga tidak memerlukan pencarian, penyesuaian, dan percobaan produk.

Dalam praktiknya, pendekatan SMED memisahkan tugas setup yang memerlukan mesin berhenti dari tugas yang dapat dilakukan saat mesin masih berjalan, memindahkan sebanyak mungkin pekerjaan ke kelompok kedua, lalu memperpendek sisanya. Dengan demikian SMED menjadi metode perbaikan berkelanjutan untuk proses changeover, dan salah satu alat standar dalam lean manufacturing.

### Manfaat SMED

Banyak halaman web mencantumkan manfaat dengan persentase yang jarang disertai sumber. Manfaat di bawah ini adalah mekanismenya; besarnya setiap manfaat bergantung pada titik awal Anda.

1. **Kapasitas:** setiap menit yang dipangkas dari setup internal mengembalikan satu menit waktu mesin. Pada bottleneck, itu berarti output yang dapat dinikmati seluruh pabrik.
2. **Lot lebih kecil dan persediaan lebih rendah:** ketika changeover murah, Anda dapat menjalankan setiap produk lebih sering dalam jumlah lebih kecil. LEI mencatat bahwa EPEx (every product every interval) sebuah mesin bergantung langsung pada waktu changeover-nya [3].
3. **Lead time lebih pendek dan pengiriman lebih baik:** work-in-process yang lebih sedikit berarti antrean lebih pendek; lot kecil memungkinkan Anda merespons perubahan permintaan dalam hitungan hari, bukan minggu.
4. **Kualitas:** changeover yang distandarisasi dengan pengaturan tetap mengurangi trial-and-error, scrap saat run-up, dan kegagalan produk pertama. Jumlah part yang dibuat per lot yang lebih sedikit juga berarti lebih sedikit part yang berisiko ketika cacat ditemukan.
5. **Keselamatan dan ergonomi:** changeover yang dirancang dengan baik menghilangkan pengangkatan yang canggung, menjangkau ke dalam die, dan terburu-buru, asalkan keselamatan dirancang sejak awal dan tidak diabaikan (lihat bagian keselamatan).

## Mengapa waktu changeover penting: ukuran lot, persediaan, fleksibilitas, dan OEE

Waktu changeover yang panjang mendorong pabrik masuk ke jebakan yang dapat diprediksi. Jika sebuah changeover memakan waktu dua jam, tidak ada yang ingin sering melakukannya, sehingga pabrik menjalankan batch besar. Batch besar menciptakan persediaan, waktu tunggu (lead time) yang panjang, dan kebutuhan untuk meramalkan permintaan pelanggan lebih jauh ke depan. Ramalan semakin sering meleset semakin jauh jangkauannya, sehingga pabrik menumpuk lebih banyak stok pengaman. Changeover menjadi penyebab tersembunyi dari separuh persediaan di dalam gedung.

### Jebakan ukuran batch dalam angka

**Contoh perhitungan (ilustratif):** Sebuah mesin press stamping beroperasi 16 jam sehari (960 menit). Setiap changeover memakan waktu 90 menit. Mesin tersebut membuat 8 nomor part.

- Jika mesin melakukan changeover dua kali sehari, ia kehilangan 180 menit, atau 18,8 persen dari waktunya (180 / 960). Menjalankan seluruh 8 nomor part kemudian membutuhkan 4 hari, sehingga setiap part dibuat sekitar setiap 4 hari, dan pabrik harus menyimpan sekitar 4 hari stok untuk setiap part, ditambah stok pengaman.
- Untuk membuat setiap part setiap hari, mesin perlu melakukan 8 changeover sehari: 8 × 90 = 720 menit, 75 persen dari waktunya. Itu tidak mungkin jika part tersebut membutuhkan lebih dari 240 menit waktu produksi.
- Pangkas changeover menjadi 15 menit, dan 8 changeover memakan 120 menit, 12,5 persen dari sehari. Setiap part dapat dibuat setiap hari, dan stok siklus turun dari sekitar 4 hari menjadi sekitar 1 hari.

Itulah alasan Toyota berinvestasi dalam pengurangan changeover jauh sebelum hal itu menjadi tren: tanpa changeover yang cepat, produksi just-in-time dengan lot kecil tidak dapat berjalan.

### Waktu changeover dalam OEE

Overall equipment effectiveness (OEE) mengalikan availability, performance, dan quality [4]. LEI memasukkan penyesuaian (adjustment) ke dalam enam kerugian utama yang disasar OEE [4]; dalam sebagian besar skema OEE, changeover terencana dicatat sebagai kerugian availability, dan scrap saat start-up setelah changeover sebagai kerugian quality. Hal itu menimbulkan dua konsekuensi:

- Pengurangan changeover hanya terlihat pada availability OEE jika waktu yang dihemat digunakan untuk berproduksi. Jika pabrik sekadar menjalankan lebih sedikit jam, availability OEE tidak bergerak.
- Jika pabrik menggunakan waktu yang dihemat untuk changeover yang lebih sering (untuk memangkas ukuran lot), availability OEE mungkin tetap datar atau bahkan turun, sementara persediaan dan lead time membaik. Itu adalah hasil yang baik. Nilai SMED berdasarkan tujuan yang Anda pilih, bukan dari OEE saja.

Definisi OEE yang lebih rinci dibahas dalam panduan [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/), dan sisi pemeliharaan dari OEE dalam panduan tentang [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/).

### Tiga cara memanfaatkan waktu yang Anda peroleh

| Opsi | Kapan cocok | Yang diukur |
|---|---|---|
| **Kapasitas lebih besar** (jumlah changeover sama) | Mesin menjadi bottleneck, permintaan melebihi kapasitas | Output per minggu, jam lembur, availability OEE |
| **Lot lebih kecil** (changeover lebih banyak, total waktu changeover sama) | Mesin memiliki kapasitas lebih, persediaan tinggi, lead time panjang, banyak varian | EPEI, ukuran lot, hari persediaan, lead time |
| **Campuran** (sebagian kapasitas, sebagian lot lebih kecil) | Sebagian besar pabrik nyata | Kedua set ukuran, dengan pembagian eksplisit yang disepakati bersama perencanaan |

Alasan paling umum mengapa proyek SMED mengecewakan adalah karena tidak ada yang membuat keputusan ini. Changeover menjadi lebih cepat, perencanaan tetap mempertahankan ukuran lot lama, dan waktu yang dihemat lenyap menjadi periode idle yang lebih panjang. Kami kembali ke hal itu di bagian kesalahan.

## Sejarah: dari Taylor dan Ford ke Shingo dan Toyota

Pengurangan waktu setup sudah ada jauh sebelum namanya dikenal. Frederick Winslow Taylor menganalisis bagian setup yang tidak menambah nilai dalam *Shop Management* (1911), Frank Gilbreth menjelaskan pengurangan waktu setup dalam *Motion Study* (1911), dan pabrik-pabrik Henry Ford mendokumentasikan pengurangan setup dalam *Ford Methods and Ford Shops* (1915) [5]. Tak satu pun dari mereka menjadikannya metode yang terstruktur dan luas digunakan [5]. Selama sebagian besar abad ke-20, jawaban standar untuk setup yang panjang bersifat matematis: economic order quantity, yang menerima biaya setup sebagai data tetap dan menghitung ukuran batch besar yang "tepat" [5].

### Toyota dan quick die change

Di Toyota, pergantian perkakas dilaporkan memakan waktu dua hingga delapan jam pada awal masa pascaperang; artikel Wikipedia menandai angka ini sebagai perlu dikutip [5]. Taiichi Ohno menjadi manajer bengkel mesin Toyota pada 1945 dan, pada 1955, mengamati mesin press stamping Danly di Amerika Serikat; Toyota kemudian membeli beberapa unit untuk pabrik Motomachi-nya [5]. Program "quick die change" internal Toyota menggunakan pertanyaan ECRS (eliminate, combine, rearrange, simplify), yang berasal dari program Training Within Industry di Amerika Serikat pada Perang Dunia II [5][33]. Menurut sumber yang sama, waktu pergantian Toyota turun dari hitungan jam menjadi 15 menit pada 1960-an dan menjadi 3 menit pada 1970-an [5].

### Shigeo Shingo

Shigeo Shingo (1909–1990) adalah insinyur industri dan konsultan di Japan Management Association sejak 1945 [6]. Ia mengumpulkan pengalaman perbaikan di Toyo Kogyo (sekarang Mazda) pada 1950 dan di Mitsubishi Heavy Industries di Hiroshima pada 1957, dan sejak 1969 ia bekerja di Toyota untuk mengurangi waktu pergantian die pada mesin press, di mana pergantian die yang memakan waktu satu hingga dua jam, kadang setengah hari, turun menjadi beberapa menit [6]. LEI menempatkan wawasan utamanya, yaitu pemisahan setup internal dan eksternal serta konversi pekerjaan internal menjadi eksternal, pada 1950-an dan 1960-an [1].

Shingo mempublikasikan metode ini dalam bahasa Inggris pada 1985 sebagai *A Revolution in Manufacturing: The SMED System* (Productivity Press) [6][7]. Buku tersebut melaporkan bahwa dari kasus-kasusnya antara 1975 dan 1985, waktu setup rata-rata turun menjadi sekitar 2,5 persen dari semula, atau faktor 40 [5]. Anggap angka itu sebagai ringkasan Shingo sendiri atas kasus konsultasinya, bukan tolok ukur independen.

Pada 1988, sekolah bisnis Utah State University menciptakan Shingo Prize untuk menghormatinya; kini Shingo Institute di Jon M. Huntsman School of Business yang menyelenggarakannya [6][30].

### SMED di AS

Produsen Amerika Serikat mengenal SMED melalui terjemahan buku-buku Shingo pada 1980-an, penyebaran just-in-time, dan keberhasilan produsen mobil Jepang. Kini SMED menjadi modul standar dalam pelatihan lean, termasuk layanan quick changeover dari pusat NIST Manufacturing Extension Partnership (MEP) [18][31]. Konteks lean yang lebih luas dibahas dalam panduan [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

## Cara mengukur waktu changeover dengan benar

Sebagian besar data changeover di pabrik keliru, dan bukan karena orang sengaja berbohong. Data itu keliru karena tidak ada kesepakatan tentang kapan changeover dimulai dan kapan berakhir. Sistem ERP sering mencatat "setup" sebagai waktu antara dua konfirmasi order; operator sering mencatat waktu ketika mesin "terbongkar"; insinyur sering hanya mengukur waktu penggantian die. Ketiganya lebih pendek daripada kerugian yang sebenarnya.

### Definisinya: dari bagian bagus terakhir ke bagian bagus pertama

Gunakan batasan LEI: dari unit bagus terakhir pada run lama sampai unit bagus pertama pada run baru [2]. Dua penyempurnaan membuatnya tidak bisa dibantah:

1. **Pada kecepatan normal.** Run baru baru dianggap "berjalan" ketika menghasilkan bagian bagus pada laju standar. Leanproduction.com mendefinisikan akhir sebagai bagian bagus pertama pada kecepatan penuh [19]. Jika lini berjalan dengan setengah kecepatan selama 20 menit setelah dinyalakan kembali, 20 menit tersebut termasuk kerugian changeover.
2. **Termasuk perlambatan akhir.** Jika run lama melambat sebelum berhenti (misalnya lini dikosongkan dan berjalan secara parsial), hitung juga bagian itu. Sebagian pabrik menyebutnya "3 Ups": pembersihan, setup, dan start-up [24].

### Tiga fase changeover

| Fase | Yang terjadi | Kerugian tersembunyi yang umum |
|---|---|---|
| **Run-down / pembersihan** | Bagian terakhir dari order lama, pengosongan lini, pengeluaran material, pembersihan | Lini berjalan dengan kecepatan berkurang; operator pergi mengambil pekerjaan berikutnya |
| **Setup (pertukaran)** | Melepas dan memasang alat, die, komponen format; mengubah pengaturan | Mencari-cari, menunggu crane atau forklift, komponen yang hilang, baut |
| **Run-up / start-up** | Bagian pertama, pengukuran, penyesuaian, persetujuan, peningkatan sampai kecepatan penuh | Penyesuaian coba-coba, menunggu persetujuan kualitas, scrap |

Rincian setup konvensional menurut Shingo, sebagaimana dilaporkan di Wikipedia, membagi sekitar 30 persen untuk persiapan, pemeriksaan material dan alat; sekitar 5 persen untuk pemasangan dan pelepasan; sekitar 15 persen untuk pemusatan, pengukuran dimensi, dan pengaturan kondisi; dan sekitar 50 persen untuk uji coba dan penyesuaian [5]. Sebuah buku teks rekayasa lean terbuka memberikan gambaran serupa untuk stamping logam, dengan sekitar 20 sampai 50 persen waktu setup dihabiskan untuk penyesuaian [36]. Pelajaran praktisnya: pertukarannya sendiri adalah bagian yang kecil. Bagian besarnya adalah persiapan dan run-up.

### Rumus changeover

**Waktu changeover (per kejadian):**
Waktu changeover = waktu bagian bagus pertama pada kecepatan standar − waktu bagian bagus terakhir dari run sebelumnya

**Rata-rata waktu changeover:**
Rata-rata waktu changeover = jumlah semua waktu changeover / jumlah changeover

**Porsi changeover dari waktu tersedia:**
Porsi changeover = total waktu changeover / waktu produksi terencana × 100%

**Rasio internal:**
Rasio internal = waktu setup internal / total beban kerja setup × 100%

**Biaya satu changeover (model sederhana):**
Biaya per changeover = margin kontribusi yang hilang (hanya jika mesin adalah bottleneck atau penjualan habis) + biaya tenaga kerja tim changeover + scrap run-up + bahan habis pakai

MachineMetrics, vendor pemantauan mesin, menggunakan pembagian yang sebanding: biaya tenaga kerja yang hilang = jam berhenti × jumlah staf × biaya tenaga kerja per jam, dan nilai produk yang hilang = harga satuan × laju standar × jam berhenti [21]. Berhati-hatilah dengan suku kedua: ia hanya dihitung sebagai kerugian nyata jika output yang hilang seharusnya bisa dijual. Pada mesin dengan kapasitas cadangan, biaya changeover terutama berupa tenaga kerja dan scrap, dan manfaat SMED terletak pada lot yang lebih kecil, bukan pada output yang kembali diperoleh.

**Contoh perhitungan (ilustratif):** Sebuah pusat permesinan CNC bekerja dua shift 8 jam, 5 hari seminggu, dengan istirahat terencana 60 menit per hari: waktu produksi terencana = (16 − 1) × 60 × 5 = 4.500 menit per minggu. Minggu lalu terjadi 9 changeover yang memakan waktu 52, 68, 47, 95, 61, 58, 73, 49, dan 87 menit.

- Total = 590 menit; rata-rata = 590 / 9 = 65,6 menit.
- Porsi changeover = 590 / 4.500 = 13,1 persen.
- Sebaran: tersingkat 47, terpanjang 95 menit, rentang 48 menit. Rentang selebar itu biasanya berarti tidak ada standar; yang paling lama adalah yang kekurangan alat atau program.
- Biaya: tim satu orang setter dengan tarif beban $48 per jam (ilustratif) = 590 / 60 × $48 = $472 per minggu untuk tenaga kerja. Jika mesin adalah bottleneck dengan margin kontribusi $180 per jam, margin yang hilang adalah 590 / 60 × $180 = $1.770 per minggu, atau sekitar $92.000 setahun pada 52 minggu. Angka inilah yang membenarkan sebuah proyek.

### Cara mengumpulkan data

1. **Video dulu.** Rekam satu pergantian lengkap dari part bagus terakhir sampai part bagus pertama, dengan jam yang terlihat. Satu kamera di mesin, idealnya kamera kedua yang mengikuti setter. Minta izin tim terlebih dahulu dan jelaskan tujuannya: video ini tentang prosesnya, bukan tentang orang. Pusat Michigan dari NIST MEP menggunakan video, diagram spaghetti, dan bagan analisis setup dalam proyek Brighton NC Machine [17].
2. **Diagram spaghetti.** Lacak jalur berjalan setter pada denah tata letak. Pergantian sering mencakup berjalan ratusan atau ribuan kaki; dalam contoh Brighton, jaraknya 9.121 kaki per pergantian sebelum perbaikan [17].
3. **Daftar elemen.** Pecah video menjadi elemen dari beberapa detik sampai beberapa menit: "berjalan ke tool crib, 3:20", "melonggarkan 8 baut klem, 4:10". Pergantian yang khas terurai menjadi sekitar 30 sampai 50 elemen, menurut leanproduction.com [19].
4. **Baseline dua minggu.** Kumpulkan waktu mulai dan selesai untuk semua pergantian selama minimal dua minggu sebelum Anda mengubah apa pun, agar Anda mengetahui rata-rata dan sebarannya [19]. Vorne memperingatkan bahwa tim mengubah perilakunya ketika mengetahui sedang diamati (efek Hawthorne), sehingga pergantian pertama yang direkam bisa lebih cepat dari biasanya [20].

Templat untuk daftar elemen ada di [bagian templat](#template-smed-dan-daftar-periksa).

## Metode SMED dalam 8 langkah

Shingo menjelaskan empat tahap konseptual, yang sering disebut tahap SMED: pada tahap awal, setup internal dan eksternal bercampur; tahap 1 memisahkannya; tahap 2 mengubah internal menjadi eksternal; tahap 3 merampingkan semua aspek setup [5]. Sumber praktisi menjabarkannya menjadi tujuh langkah dasar: amati, pisahkan, ubah, rampingkan internal, rampingkan eksternal, dokumentasikan, ulangi [5]. Delapan langkah di bawah menambahkan langkah yang paling sering dilewatkan oleh sebagian besar panduan: menyiapkan proyek, termasuk keselamatan dan keputusan tentang bagaimana waktu yang dihemat akan digunakan.

| Langkah | Tahap Shingo | Keluaran |
|---|---|---|
| 0. Persiapan: pilih mesin, tim, tujuan, dan penggunaan waktu yang dihemat | (awal) | Piagam, data baseline, tinjauan keselamatan |
| 1. Catat pergantian saat ini | tahap awal | Video, daftar elemen dengan waktu, diagram spaghetti |
| 2. Pisahkan elemen internal dan eksternal | tahap 1 | Setiap elemen ditandai I atau E; daftar periksa dan rencana staging |
| 3. Ubah internal menjadi eksternal | tahap 2 | Daftar tindakan: persiapan, standardisasi fungsi, jig antara |
| 4. Rampingkan elemen internal | tahap 3 | Klem cepat, penyesuaian yang dihilangkan, kerja paralel |
| 5. Rampingkan elemen eksternal | tahap 3 | Troli, shadow board, penyimpanan di dekat mesin |
| 6. Standarisasi dan latih | (tindak lanjut) | Lembar pergantian standar, catatan pelatihan |
| 7. Pertahankan dan ulangi | (tindak lanjut) | KPI di papan, audit, siklus berikutnya |

### Langkah 0: Siapkan proyek

**Pilih mesin percontohan.** Percontohan yang baik memiliki pergantian sekitar 30 sampai 90 menit yang terjadi beberapa kali seminggu, tim yang kooperatif, dan masalah bisnis yang terlihat (bottleneck, persediaan tinggi, pesanan terlambat). Vorne menyarankan pergantian percontohan 30 sampai 60 menit [20]; leanproduction.com merekomendasikan SMED ketika pergantian menyumbang setidaknya 20 persen waktu produktif yang hilang, dan TPM lebih dulu jika tidak [19]. Keduanya adalah aturan praktis dari vendor, bukan standar, tetapi keduanya menunjuk ke arah yang benar: jangan mulai dengan pergantian 12 jam atau pergantian 5 menit.

**Bentuk tim.** Operator dan setter yang melakukan pergantian setiap hari, teknisi pemeliharaan, insinyur manufaktur, teknisi kualitas untuk persetujuan part pertama, dan perwakilan keselamatan. Seorang supervisor menjadi sponsor tim. Empat sampai tujuh orang adalah ukuran yang layak.

**Sepakati tujuan dan penggunaan waktu yang dihemat.** Tuliskan baseline (rata-rata dan rentang), target (misalnya, pengurangan 50 persen pada siklus pertama, seperti yang disarankan Vorne [20]), dan apa yang akan dilakukan perencanaan dengan waktu tersebut: kapasitas, lot yang lebih kecil, atau pembagian.

**Tinjauan keselamatan.** Daftarkan sumber energi (listrik, hidrolik, pneumatik, gravitasi, termal) dan prosedur pengendalian energi yang berlaku saat ini. Tentukan sebelum lokakarya langkah mana yang termasuk dalam lockout/tagout. Jangan pernah menerima ide "lebih cepat" yang melewati isolasi energi (lihat bagian keselamatan).

### Langkah 1: Catat changeover saat ini

Rekam dengan video, susun daftar elemen, dan gambar diagram spaghetti. Tulis elemen-elemen sesuai urutan kejadiannya, dengan waktu mulai, durasi, dan siapa yang melakukannya. Tandai langsung pemborosan yang jelas: mencari, berjalan, menunggu crane, percobaan berulang.

Pertanyaan yang diajukan untuk setiap elemen (pertanyaan gaya "five whys" klasik juga dapat digunakan):

- Mengapa ini dilakukan sama sekali? (Bisakah dihilangkan?)
- Mengapa dilakukan sekarang, ketika mesin berhenti? (Bisakah dilakukan secara eksternal?)
- Mengapa dilakukan dengan cara ini? (Bisakah dibuat lebih sederhana?)
- Mengapa dilakukan oleh orang ini? (Bisakah dua orang melakukannya secara paralel, atau bisakah operator yang melakukannya?)

### Langkah 2: Pisahkan elemen internal dan eksternal

Beri tanda setiap elemen sebagai I (memerlukan mesin berhenti) atau E (dapat dilakukan saat mesin berjalan). Jangan ubah metode dulu; cukup hentikan pekerjaan eksternal selama mesin berhenti. Langkah ini terutama bersifat organisasional:

- **Daftar periksa pra-changeover:** semua yang dibutuhkan pekerjaan berikutnya (die, alat, fixture, insert, material, program, gambar, gauge, kemasan) didaftar dan diperiksa sebelum mesin berhenti.
- **Pemeriksaan fungsi:** die baru diperiksa kerusakan dan kelengkapannya sebelum dipasang, bukan setelah bagian buruk pertama dihasilkan.
- **Transportasi:** die baru disiapkan di mesin sebelum penghentian; die lama dikembalikan ke penyimpanan setelah mesin dijalankan kembali.

Leanproduction.com mencatat bahwa memindahkan elemen ke kategori eksternal dapat hampir memangkas separuh waktu changeover [19]. Hal ini sesuai dengan pengalaman praktisi, tetapi sepenuhnya bergantung pada seberapa banyak pencarian dan pengambilan yang terjadi saat ini.

### Langkah 3: Ubah internal menjadi eksternal

Sekarang tinjau kembali setiap elemen I yang tersisa dan tanyakan apa yang harus berubah agar elemen tersebut menjadi eksternal. Teknik Shingo di sini adalah menyiapkan kondisi operasi sebelumnya, menstandarkan fungsi, dan menggunakan jig antara [5]:

- **Panaskan** cetakan dan die di luar mesin agar tembakan pertama tidak perlu membawanya ke suhu kerja.
- **Atur awal** alat di presetter atau pada fixture kedua saat mesin berjalan.
- **Standarkan** dimensi yang penting bagi mesin (tinggi penjepit, posisi pengunci, titik sambungan) sehingga die baru tidak memerlukan penyesuaian.
- **Jig antara**: pasang benda kerja atau die berikutnya pada pallet atau subplate standar di luar mesin, lalu tukar seluruh pallet.

### Langkah 4: Sederhanakan elemen internal

Elemen yang tersisa sebagai internal dibuat cepat dan sederhana:

- **Klem fungsional** sebagai ganti baut: pengencang seperempat putaran, klem cam, slot-U sehingga baut hanya perlu diputar setengah putaran, klem hidrolik atau magnetik.
- **Hilangkan penyesuaian:** stopper tetap, pin pengunci, skala dan tanda, pengaturan yang disimpan sebagai resep. Penyesuaian adalah kategori waktu setup terbesar dalam rincian Shingo [5].
- **Operasi paralel:** dua orang di sisi berlawanan mesin, masing-masing dengan urutan yang jelas, dapat memangkas waktu total lebih dari separuh dengan menghilangkan jalan memutari mesin. Mereka memerlukan sistem sinyal yang jelas dan, di bawah lockout/tagout, setiap orang memasang gemboknya sendiri.
- **Satu alat, satu ukuran:** standarkan ukuran baut sehingga satu alat dapat digunakan di mana saja.

### Langkah 5: Sederhanakan elemen eksternal

Pekerjaan eksternal tidak menghentikan mesin, tetapi menyita tenaga kerja dan dapat menunda dimulainya changeover. Sederhanakan dengan troli changeover yang disusun menurut urutan, papan bayangan (shadow board), penyimpanan die dan alat di titik pemakaian mengikuti [5S](https://www.m365.fm/en/learn/5s-visual-management/), serta sinyal visual yang jelas ("pekerjaan berikutnya siap").

### Langkah 6: Standarkan dan latih

Tulis metode baru sebagai lembar changeover standar: urutan elemen, siapa melakukan apa, poin kunci (keselamatan, kualitas), waktu, dan alat yang dibutuhkan. LEI menjelaskan [standardized work](https://www.m365.fm/entity/standard-work/) sebagai penetapan prosedur yang presisi untuk pekerjaan setiap operator [26]. Latih semua orang yang melakukan changeover, bukan hanya tim percontohan; metode TWI Job Instruction, yang memecah pekerjaan menjadi langkah penting dan poin kunci, adalah format yang praktis [33]. Klaster tentang [standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) membahas format ini secara rinci.

### Langkah 7: Pertahankan dan ulangi

Pasang waktu changeover di papan lantai produksi, tinjau penyimpangan setiap hari dan audit standar secara berkala. SMED adalah siklus perbaikan berkelanjutan, bukan kegiatan sekali jalan. Jalankan siklus berikutnya: ringkasan Wikipedia tentang praktik SMED menyatakan bahwa beberapa iterasi mungkin diperlukan untuk mencapai di bawah sepuluh menit [5]. Siklus kedua biasanya menargetkan elemen yang bergantung pada perangkat keras yang ditunda pada siklus pertama.

## Delapan teknik Shingo dengan contoh

Shingo merangkum pendekatannya dalam delapan teknik [5]. Tabel berikut memberikan penjelasan sederhana untuk masing-masing teknik beserta contoh dari berbagai industri.

| # | Teknik | Maknanya | Contoh |
|---|---|---|---|
| 1 | Pisahkan setup internal dari setup eksternal | Jangan menghentikan mesin untuk pekerjaan yang bisa dilakukan saat mesin berjalan | Daftar periksa, penyiapan die dan material sebelum mesin dihentikan |
| 2 | Ubah setup internal menjadi eksternal | Ubah metodenya agar pekerjaan berpindah ke luar saat henti | Memanaskan awal cetakan, presetting alat, perakitan awal bagian format |
| 3 | Standarkan fungsi, bukan bentuk | Standarkan hanya fitur yang berinteraksi dengan mesin, bukan seluruh alat | Tinggi penjepitan dan tepi pengarah yang sama pada setiap die melalui blok spacer; kopling yang sama pada setiap cetakan |
| 4 | Gunakan klem fungsional atau hilangkan pengencang | Kencangkan dengan satu gerakan, atau tidak perlu sama sekali | Sekrup seperempat putaran, tuas cam, lubang berbentuk buah pir, klem hidraulik, platen magnetik |
| 5 | Gunakan jig antara | Persiapkan pada pembawa standar di luar mesin dan tukar pembawanya | Palet penjepitan titik-nol pada pusat pemesinan, subplat untuk die press |
| 6 | Terapkan operasi paralel | Lebih dari satu orang bekerja bersamaan pada urutan yang ditetapkan | Dua setter di kedua sisi press, operator menyiapkan material sementara setter menukar die |
| 7 | Hilangkan penyesuaian | Ganti coba-coba dengan posisi tetap dan pengaturan tersimpan | Pin penentu posisi, stopper, skala, unduhan resep, pembacaan digital |
| 8 | Mekanisasi | Gunakan bantuan tenaga jika benar-benar membantu, setelah tujuh teknik lainnya | Kereta die dengan roller, pengangkat die, sumbu penyesuaian bermotor |

Dua catatan tentang daftar ini. Pertama, mekanisasi sengaja ditempatkan terakhir. Perangkat keras yang dibeli sebelum langkah organisasi sering kali mengotomatisasi pemborosan. Kedua, "standarkan fungsi, bukan bentuk" adalah teknik yang paling kurang dimanfaatkan. Pabrik tidak perlu membangun ulang 200 die; sering kali, seperangkat blok spacer atau pelat adaptor yang menyamakan tinggi penjepitan dan tepi pengarah semua die sudah cukup.

## Teknik changeover berdasarkan jenis peralatan

Prinsipnya sama di mana pun, tetapi pengungkit utamanya berbeda menurut proses. Tabel-tabel di bawah ini adalah daftar periksa praktisi, bukan tolok ukur yang bersumber dari referensi.

### Mesin press stamping

| Pengungkit | Contoh |
|---|---|
| Tinggi die standar dan penempatan | Parallel atau balok spacer membawa semua die ke tinggi tutup (shut height) yang sama; pin penempat atau back stop memusatkan die |
| Transportasi die | Troli die atau bolster bergulir disiapkan di dekat press; jalur roller atau bola pada bolster |
| Penjepitan | Klem hidraulik atau mekanik kerja cepat; slot-U dan satu ukuran baut jika masih menggunakan baut |
| Pengaturan | Shut height, tekanan counterbalance, dan pengaturan feed disimpan per die; skala yang diberi tanda |
| Keselamatan | Safety block setiap kali die disesuaikan atau diperbaiki di dalam press, sebagaimana diwajibkan OSHA [10]; prosedur pengaturan die sesuai 29 CFR 1910.217(d)(9) |

### Injection molding

| Pengungkit | Contoh |
|---|---|
| Pemanasan awal | Mold dipanaskan terlebih dahulu pada unit kontrol suhu terpisah sebelum penggantian |
| Sambungan | Multi-coupling untuk sambungan air dan hot runner, diberi kode warna |
| Material | Material berikutnya sudah dikeringkan dan siap; senyawa purge dan prosedurnya distandarkan |
| Penjepitan | Sistem penggantian mold cepat (platen magnetik atau hidraulik), ketebalan pelat mold yang distandarkan |
| Pengaturan | Parameter proses diunduh dari resep, bukan disetel dari ingatan |

### Permesinan CNC

| Pengungkit | Contoh |
|---|---|
| Presetting alat | Alat diukur secara offline di presetter, offset dipindahkan ke kontrol |
| Penahan benda kerja | Penjepitan zero-point, pallet yang distandarkan, fixture khusus yang disimpan di mesin |
| Program | Program yang telah terbukti dirilis dan dimuat terlebih dahulu; tidak ada pengeditan di mesin |
| Benda pertama | Probing di dalam mesin menggantikan pengukuran manual untuk menetapkan work offset |
| Keluarga alat | Pustaka alat standar sehingga sebagian besar pekerjaan membutuhkan sedikit penggantian alat |

### Lini pengemasan dan pengisian

| Pengungkit | Contoh |
|---|---|
| Format parts | Format parts berkode warna per ukuran produk, disimpan di troli sesuai urutan changeover |
| Penyesuaian | Stopper tetap dan skala bernomor sebagai pengganti penyesuaian bebas; sumbu servo dengan posisi tersimpan |
| Pembersihan | Urutan pembersihan distandarkan; pembersihan kering dilakukan lebih dulu; pembersihan paralel untuk bagian yang dilepas |
| Label dan material | Daftar periksa line clearance; penyiapan label, karton, dan tutup sebelum penghentian |
| Run-up | Pemeriksaan first-off yang ditetapkan; prosedur peningkatan kecepatan bertahap |

### Changeover yang didominasi pembersihan dan diatur regulasi (makanan, farmasi, kimia)

Di pabrik makanan, minuman, farmasi, dan kimia, "pergantian" sering kali kecil sementara pembersihan dan verifikasinya besar. Pemikiran SMED tetap berlaku: siapkan bahan pembersih, alat, dan dokumen sebelumnya; bersihkan bagian yang dapat dilepas secara offline sementara mesin dirakit kembali dengan set kedua; atur urutan produk untuk meminimalkan pembersihan penuh (dari yang terang ke yang gelap, yang bebas alergen sebelum yang mengandung alergen). Perbedaannya adalah bahwa beberapa langkah diwajibkan dan tidak dapat dipersingkat dengan melewatinya:

- Produsen obat di AS harus memeriksa fasilitas pengemasan dan pelabelan segera sebelum digunakan untuk memastikan bahwa semua produk obat dan bahan pengemasan serta pelabelan yang tidak sesuai dari operasi sebelumnya telah disingkirkan, dan mendokumentasikan hasilnya dalam catatan produksi batch (21 CFR 211.130(e)) [11].
- Fasilitas pangan di AS berdasarkan aturan preventive controls harus memiliki pengendalian alergen pangan yang mencakup prosedur untuk melindungi pangan dari kontaminasi silang alergen selama penyimpanan, penanganan, dan penggunaan (21 CFR 117.135(c)(2)) [37].

Di sini SMED memperpendek pekerjaan di sekitar langkah-langkah yang diwajibkan dan membuat langkah-langkah tersebut lebih cepat dan lebih andal, misalnya dengan daftar periksa line clearance dan urutan yang tetap. SMED tidak pernah menghapus langkah-langkah tersebut.

### Lini dan sel perakitan

Changeover perakitan terutama menyangkut material dan informasi: kit yang berbeda, instruksi kerja yang berbeda, fixture yang berbeda di beberapa stasiun. Pengungkitnya adalah kitting varian berikutnya sebelum changeover, fixture yang mencakup beberapa varian, instruksi kerja digital yang berganti mengikuti pesanan, dan changeover "bergulir" di mana setiap stasiun berganti ketika unit pertama varian baru tiba, sehingga lini tidak berhenti secara keseluruhan.

## Contoh SMED: proyek lengkap pada mesin injection molding

Contoh berikut bersifat ilustratif. Angka-angkanya realistis untuk bengkel molding skala menengah, tetapi tidak menggambarkan pabrik nyata. Contoh ini menunjukkan bagaimana langkah-langkahnya saling terkait dan cara menghitung dampaknya.

**Situasi.** Mesin injection molding 300 ton menjalankan 6 cetakan untuk satu keluarga rumah (housing). Mesin bekerja 3 shift masing-masing 8 jam dengan istirahat 30 menit per shift, 5 hari seminggu: waktu produksi terencana = 3 × 7,5 × 60 × 5 = 6.750 menit per minggu. Mesin mengganti cetakan 5 kali seminggu. Baseline selama dua minggu: rata-rata waktu changeover 96 menit, rentang 78 sampai 131 menit. Mesin bukan bottleneck; masalahnya adalah persediaan barang jadi 11 hari dan seringnya pesanan mendesak.

**Sasaran yang disepakati dengan perencanaan.** Memangkas rata-rata waktu changeover minimal 50 persen pada siklus pertama dan menggunakan waktu tersebut untuk lebih banyak changeover, sehingga setiap cetakan berjalan setidaknya setiap 3 hari, bukan setiap 6 hari.

### Langkah 1: daftar elemen (sebelum)

| # | Elemen | Waktu (menit) | I/E saat ini | Bisa menjadi |
|---|---|---|---|---|
| 1 | Shot terakhir, kosongkan hopper, hentikan mesin | 6 | I | I (sebagian E: kosongkan hopper sebelum akhir run) |
| 2 | Jalan ke penyimpanan cetakan, cari cetakan berikutnya, ambil crane | 14 | I | E |
| 3 | Lepaskan saluran air dan hot runner (12 kopling tunggal) | 8 | I | I, disederhanakan |
| 4 | Lepaskan klem cetakan (8 baut), angkat keluar | 9 | I | I, disederhanakan |
| 5 | Angkat cetakan baru masuk, sejajarkan dengan mata, klem (8 baut) | 13 | I | I, disederhanakan |
| 6 | Sambungkan saluran air dan hot runner, cari selang yang tepat untuk setiap port | 10 | I | I, disederhanakan |
| 7 | Cari material, keringkan | 7 | I | E |
| 8 | Panaskan cetakan hingga suhu | 12 | I | E (preheat) |
| 9 | Atur parameter dari lembar setup, sesuaikan | 9 | I | I, hilangkan penyesuaian |
| 10 | Shot percobaan, sesuaikan, tunggu persetujuan kualitas | 8 | I | I, disederhanakan |
| **Total internal (waktu berjalan)** | | **96** | | |

Dua kandidat eksternal (elemen 2 dan 7) serta pemanasan awal (elemen 8) menambah hingga 33 menit waktu henti mesin yang sebenarnya tidak memerlukan mesin berhenti.

### Langkah 2 dan 3: pisahkan dan konversikan

- Elemen 2 dan 7 menjadi eksternal dengan daftar periksa pra-changeover yang dipicu 45 menit sebelum akhir run yang direncanakan: cetakan, slot crane, material (sudah kering), selang, dokumen, gauge first-off. Penghematan: 21 menit.
- Elemen 8 menjadi eksternal dengan stasiun preheating tempat cetakan berikutnya dipanaskan sementara cetakan lama masih berjalan. Penghematan: sekitar 10 menit (2 menit tersisa untuk stabilisasi di mesin).
- Elemen 1: hopper dikosongkan pada menit-menit terakhir run, bukan setelah mesin berhenti. Penghematan: 3 menit.

Hasil setelah dua langkah pertama: 96 − 21 − 10 − 3 = **62 menit**, dicapai terutama dengan daftar periksa, preheater, dan disiplin.

### Langkah 4: sederhanakan internal

| # | Tindakan | Sebelum (menit) | Sesudah (menit) |
|---|---|---|---|
| 3 + 6 | Pelat kopling multi untuk air dan hot runner, diberi kode warna | 18 | 4 |
| 4 + 5 | Ring penempatan dan slot klem yang distandarisasi, klem cepat; orang kedua untuk pekerjaan paralel | 22 | 9 |
| 9 | Parameter proses disimpan per cetakan dan dimuat dari controller | 9 | 2 |
| 10 | Pemeriksaan first-off dengan gauge khusus di mesin, teknisi kualitas diberi tahu sebelumnya | 8 | 5 |
| 1 | Run-down dengan hopper yang sudah kosong | 3 | 3 |
| 8 | Stabilisasi setelah preheating | 2 | 2 |
| **Total** | | **62** | **25** |

Waktu berjalan sekarang 25 menit. Perlu dicatat bahwa pekerjaan paralel oleh dua orang mengurangi waktu berjalan tetapi tidak mengurangi waktu kerja tenaga kerja: beban kerja pada elemen 4 dan 5 tetap sekitar 18 menit-orang.

### Langkah 6: standarisasi

Urutan baru ditulis sebagai lembar changeover standar dengan dua kolom (setter A, setter B), dilatihkan kepada semua tiga shift, dan diaudit setiap minggu selama sebulan. Setelah empat minggu, rata-rata menjadi 27 menit dengan rentang 23 sampai 34 menit.

### Dampaknya

| Indikator | Sebelum | Sesudah |
|---|---|---|
| Rata-rata waktu changeover | 96 mnt | 27 mnt (−72%) |
| Rentang changeover | 78–131 mnt | 23–34 mnt |
| Changeover per minggu | 5 | 10 |
| Total waktu changeover per minggu | 480 mnt | 270 mnt |
| Porsi changeover dari waktu terencana | 7,1% | 4,0% |
| Interval setiap cetakan berjalan (EPEI) | sekitar 6 hari | sekitar 3 hari |
| Persediaan barang jadi (cycle stock) | sekitar 11 hari | sekitar 6 hari (target) |

Mesin kini berganti produk dua kali lebih sering dan tetap menghabiskan 210 menit lebih sedikit per minggu untuk changeover. Stok siklus turun kira-kira sebanding dengan interval. Investasinya: stasiun pemanasan awal, enam set multi-coupling, standardisasi clamp, dan dua hari waktu tim. Business case untuk proyek jenis ini dihitung di [bagian business case](#kasus-bisnis-biaya-roi-dan-akuntansi-persediaan).

## Dari changeover yang lebih singkat ke lot yang lebih kecil: EPEI dan lot sizing

SMED menciptakan potensi; penjadwalan mengubahnya menjadi hasil. Dua alat menghubungkan waktu changeover dengan ukuran lot dan persediaan: EPEI dan rumus ukuran lot klasik.

### Arti EPEI

EPEI adalah singkatan dari "every part every interval" (leksikon LEI kini menggunakan istilah EPEx, "every product every interval"). Istilah ini menggambarkan seberapa sering sebuah mesin atau proses bergilir melewati semua nomor part-nya: jika sebuah mesin di-changeover sehingga memproduksi setiap nomor part setiap tiga hari, EPEx-nya adalah tiga hari [3]. LEI mencatat bahwa EPEx bergantung pada waktu changeover dan jumlah nomor part; changeover yang panjang dan banyaknya nomor part menaikkannya, kecuali waktu changeover dikurangi [3]. EPEI yang lebih pendek berarti lot yang lebih kecil dan persediaan yang lebih sedikit. Dalam [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/), EPEI merupakan entri standar dalam data box sebuah proses dengan changeover [35].

### Cara menghitung EPEI

Sebuah rumus yang umum dipakai praktisi (diturunkan dari neraca waktu sebuah proses; bukan rumus LEI):

EPEI = total waktu changeover untuk satu siklus penuh melalui semua part / (waktu tersedia per hari − waktu run yang dibutuhkan per hari)

Gagasannya: setiap hari, mesin membutuhkan jumlah waktu run tetap untuk memenuhi permintaan. Sisa waktunya dapat dipakai untuk changeover. Semakin lama waktu changeover yang dibutuhkan satu siklus penuh untuk semua part, semakin banyak hari yang dibutuhkan siklus tersebut.

**Contoh terperinci (ilustratif):** Sebuah mesin memiliki 900 menit waktu tersedia per hari. Mesin ini membuat 4 part dengan permintaan harian dan waktu siklus sebagai berikut:

| Part | Permintaan harian (pcs) | Waktu siklus (menit/pcs) | Waktu run per hari (menit) | Waktu changeover (menit) |
|---|---|---|---|---|
| A | 400 | 0,8 | 320 | 40 |
| B | 300 | 0,8 | 240 | 40 |
| C | 150 | 1,0 | 150 | 60 |
| D | 50 | 1,2 | 60 | 60 |
| **Total** | | | **770** | **200** |

- Waktu yang tersisa untuk changeover per hari: 900 − 770 = 130 menit.
- Satu siklus penuh melalui keempat part membutuhkan 200 menit waktu changeover.
- EPEI = 200 / 130 = 1,54 hari, dibulatkan ke atas dalam praktik menjadi **2 hari**: setiap part dibuat setiap 2 hari.
- Ukuran lot pada EPEI 2 hari = 2 hari permintaan: A 800, B 600, C 300, D 100 pcs.

**Sekarang terapkan SMED.** Changeover turun menjadi 15 menit untuk A dan B serta 20 menit untuk C dan D: total = 70 menit.

- EPEI = 70 / 130 = 0,54 hari, dibulatkan ke atas menjadi **1 hari**: setiap part setiap hari.
- Ukuran lot berkurang separuh: A 400, B 300, C 150, D 50 pcs.
- Rata-rata stok siklus (sekitar setengah lot, jika permintaannya stabil) turun dari sekitar 1 hari permintaan menjadi sekitar setengah hari.
- Waktu cadangan: pada EPEI 1 hari, changeover membutuhkan 70 dari 130 menit yang tersedia; 60 menit tersisa sebagai penyangga untuk kerusakan dan lonjakan permintaan.

Dua catatan praktis. Pertama, jangan pernah merencanakan tanpa waktu cadangan; mesin nyata mengalami kerusakan, dan EPEI yang memakai setiap menit yang tersedia akan runtuh pada hari yang buruk pertama. Kedua, EPEI dapat berbeda untuk part dengan volume tinggi dan part dengan volume rendah: A dan B setiap hari, C dan D setiap dua hari sering kali merupakan kompromi yang lebih baik daripada interval yang seragam. Di sinilah SMED bertemu dengan [heijunka](https://www.m365.fm/entity/heijunka/), yaitu peratakan produksi berdasarkan volume dan campuran produk [25].

### Rumus ukuran lot dan mengapa biaya setup penting

Economic order quantity (EOQ), yang dikembangkan oleh Ford W. Harris pada tahun 1913 [39] dan selama beberapa dekade menjadi pendekatan standar untuk ukuran lot [5], menyeimbangkan biaya setup dengan biaya penyimpanan:

EOQ = √(2 × D × S / H)

dengan D = permintaan tahunan, S = biaya per setup (atau per pesanan), H = biaya penyimpanan tahunan per unit. Untuk produksi dengan laju produksi terbatas, economic production quantity (EPQ) menambahkan faktor koreksi √(1 / (1 − d/p)), dengan d adalah laju permintaan dan p laju produksi. Rincian kedua rumus, termasuk asumsinya, dibahas dalam klaster tentang [lot sizing](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

Poin kunci bagi SMED adalah akar kuadratnya. Jika biaya setup S turun menjadi seperempat, ukuran lot ekonomis berkurang separuh (√0,25 = 0,5). Jika S turun menjadi sepersembilan, ukuran lot turun menjadi sepertiga.

**Contoh kerja (ilustratif):** D = 24.000 pieces per tahun, H = $2,40 per piece per tahun (misalnya, biaya penyimpanan 20 persen pada suku cadang $12), S = $160 per setup (dua jam kerja tim dua orang dengan biaya $40 per jam yang sudah termasuk beban).

- EOQ = √(2 × 24.000 × 160 / 2,40) = √3.200.000 ≈ **1.789 pieces**, sekitar 13 lot per tahun (24.000 / 1.789 ≈ 13,4).
- Setelah SMED, changeover memakan waktu 30 menit dengan tim yang sama: S = $40.
- EOQ = √(2 × 24.000 × 40 / 2,40) = √800.000 ≈ **894 pieces**, sekitar 27 lot per tahun (24.000 / 894 ≈ 26,8).
- Rata-rata stok siklus (EOQ / 2) turun dari sekitar 894 menjadi sekitar 447 pieces; dengan harga $12 per piece, itu membebaskan sekitar $5.400 persediaan untuk satu suku cadang ini.

Rumus ini memiliki batasan yang sudah dikenal: rumus mengasumsikan permintaan konstan, biaya yang diketahui, dan tidak ada kendala kapasitas, serta "biaya per setup" sulit ditentukan ketika operator tetap dibayar. Praktisi Lean karena itu menggunakannya sebagai argumen arah ("biaya setup yang lebih rendah membenarkan lot yang lebih kecil"), bukan sebagai aturan penjadwalan. Sistem tarik dengan [kanban](https://www.m365.fm/en/learn/kanban-pull-system/) dan jadwal berbasis EPEI biasanya menggantikannya [34].

### Pemeriksaan kapasitas: mampukah Anda menanggung lebih banyak changeover?

Sebelum merencanakan pemotongan ukuran lot, periksa keseimbangan kapasitas:

Waktu yang dibutuhkan per minggu = Σ (permintaan × waktu siklus) + jumlah changeover × rata-rata waktu changeover

Angka ini harus tetap jauh di bawah waktu yang tersedia. Pada bottleneck, changeover yang lebih singkat pertama-tama merupakan peningkatan kapasitas; apakah Anda menggunakannya untuk lot yang lebih kecil adalah keputusan yang disengaja, yang dibahas secara rinci dalam panduan [theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/). Pada non-bottleneck, kapasitas cadangan memang ada menurut definisinya, dan biasanya lebih bijaksana menggunakan waktu changeover yang dihemat untuk changeover yang lebih sering.

## Keselamatan: changeover, lockout/tagout, dan ergonomi

Tidak satu pun dari dua belas halaman yang banyak dibaca dan dianalisis untuk panduan ini membahas lockout/tagout, meskipun hampir setiap elemen setup internal terjadi di dalam zona bahaya mesin. Di AS, hal ini bukan pilihan.

### Melakukan setup adalah servicing berdasarkan standar lockout/tagout OSHA

Standar OSHA untuk pengendalian energi berbahaya, 29 CFR 1910.147, mencakup servicing dan pemeliharaan mesin dan peralatan yang energisasi, start-up, atau pelepasan energi tersimpan yang tidak terduga dapat membahayakan karyawan [8]. Definisinya tentang "servicing and/or maintenance" secara eksplisit mencakup setting up dan adjusting, dan "setting up" didefinisikan sebagai setiap pekerjaan yang dilakukan untuk mempersiapkan mesin atau peralatan agar dapat menjalankan operasi produksi normalnya [8]. Dengan demikian, changeover secara default merupakan aktivitas servicing berdasarkan standar tersebut.

Standar ini mensyaratkan prosedur pengendalian energi yang terdokumentasi, pelatihan, dan urutan penerapan yang tetap: persiapan untuk shutdown, shutdown mesin, isolasi sumber energi, pemasangan perangkat lockout atau tagout, pelepasan energi tersimpan, dan verifikasi isolasi [8]. Pemberi kerja harus memeriksa setiap prosedur pengendalian energi minimal setahun sekali [8].

### Pengecualian servicing minor: sempit, bukan celah

Sebuah catatan pada paragraf ruang lingkup membebaskan perubahan alat dan penyesuaian minor serta aktivitas servicing minor lainnya yang berlangsung selama operasi produksi normal, jika bersifat rutin, berulang, dan terintegrasi dengan penggunaan peralatan untuk produksi, serta hanya jika pekerjaan dilakukan dengan tindakan alternatif yang memberikan perlindungan efektif [8]. eTool lockout/tagout OSHA menjelaskan bahwa aktivitas tersebut kemudian berada di bawah persyaratan pengamanan mesin Subpart O, dan mencantumkan contoh tindakan alternatif: alat yang dirancang khusus, perangkat jarak jauh, pelindung penghalang yang terkunci (interlocked), pemutus lokal dan sakelar kendali yang berada di bawah kendali eksklusif karyawan yang melakukan pekerjaan [9]. Jika ada bagian dari pengecualian yang tidak terpenuhi, lockout/tagout berlaku [9].

Apa artinya bagi SMED:

- Penggantian die atau mold penuh umumnya bukan penggantian alat "kecil" selama produksi normal; rencanakan dengan lockout/tagout. Apakah tugas tertentu memenuhi syarat pengecualian adalah penilaian hukum dan keselamatan untuk profesional keselamatan Anda, bukan untuk tim SMED.
- SMED harus membuat lockout lebih cepat dan lebih mudah, bukan melewatinya. Contohnya: titik lockout dikelompokkan dan diberi label di mesin, stasiun lockout di troli changeover, kotak lockout grup untuk pekerjaan paralel di mana setiap orang memasang gembok sendiri, dan langkah verifikasi yang ditulis dalam lembar standar changeover.
- Standar waktu changeover yang hanya bisa dicapai dengan melewatkan isolasi energi adalah standar yang salah. Tuliskan waktu lockout ke dalam target.

### Mesin press mekanis

Untuk mesin press mekanis, OSHA mewajibkan prosedur pemasangan die yang memastikan kepatuhan terhadap aturan pengamanan titik operasi, turnover bar berpegas di mana mesin dirancang untuk itu, die stop pada mesin press miring, safety block setiap kali die disesuaikan atau diperbaiki di dalam mesin, dan alat seperti sikat atau pressure gun agar operator dan petugas pemasangan die tidak menjangkau titik operasi untuk melumasi [10]. Hal-hal ini wajib ada dalam setiap standar changeover press.

### Ergonomi

Changeover melibatkan penanganan berat dan canggung: mengangkat die, bagian format dan fixture, bekerja dalam posisi membungkuk di dalam pelindung, serta menjangkau baut. OSHA menggambarkan ergonomi sebagai upaya menyesuaikan pekerjaan dengan pekerja untuk mengurangi gangguan muskuloskeletal [32]. SMED dan ergonomi biasanya mengarah ke arah yang sama: troli die, jalur roller, alat bantu angkat, fixture setinggi pinggang, dan lebih sedikit baut membuat pekerjaan lebih cepat dan lebih ringan bagi tubuh. Risikonya terletak pada target kecepatan: ketika tim didorong untuk mengalahkan waktu, teknik mengangkat dan pengangkatan dua orang sering terlewat. Target waktu harus ditetapkan agar dapat dicapai dengan ritme yang berkelanjutan.

### Daftar periksa keselamatan untuk proyek SMED

| Pemeriksaan | Selesai |
|---|---|
| Sumber energi mesin dicatat (listrik, hidrolik, pneumatik, gravitasi, termal, kimia) | ☐ |
| Prosedur pengendalian energi saat ini ditinjau; langkah changeover di bawah lockout/tagout diidentifikasi | ☐ |
| Profesional keselamatan telah meninjau setiap klaim bahwa suatu langkah termasuk pengecualian servis minor | ☐ |
| Langkah lockout dan verifikasi ditulis dalam lembar standar changeover, beserta waktunya | ☐ |
| Pekerjaan paralel: setiap orang memasang gemboknya sendiri; sinyal komunikasi ditetapkan | ☐ |
| Press: prosedur pemasangan die, safety block, turnover bar, die stop diperiksa [10] | ☐ |
| Pengangkatan berat diidentifikasi; alat bantu angkat atau pengangkatan dua orang ditetapkan | ☐ |
| Permukaan panas (mold yang dipanaskan, die berpemanas) diidentifikasi; sarung tangan dan penanganannya ditetapkan | ☐ |
| Hardware penjepit cepat yang baru diperiksa gaya jepitnya dan perilaku fail-safe-nya | ☐ |
| Changeover pertama dengan standar baru diamati oleh supervisor | ☐ |

## Kualitas: persetujuan produk pertama, error proofing dan line clearance yang diatur

Proses run-up dan penyesuaian merupakan bagian terbesar dari banyak changeover [5]. Masalah kualitas setelah changeover biasanya memiliki penyebab yang sama: alat atau program yang salah, pengaturan yang diambil dari ingatan, tidak adanya pemeriksaan produk pertama, atau persetujuan produk pertama yang harus menunggu inspektur yang sedang sibuk di tempat lain.

### Persetujuan produk pertama tanpa menunggu

- **Tentukan pemeriksaan** dalam lembar changeover standar: karakteristik apa, alat ukur apa, dan ukuran sampel berapa.
- **Bawa alat ukur ke mesin** dan latih operator untuk melakukan pengukuran, dengan teknisi kualitas hanya memberikan persetujuan jika diwajibkan oleh control plan.
- **Beritahu bagian kualitas sebelumnya** melalui daftar periksa pra-changeover, sehingga inspektur sudah berada di tempat ketika produk pertama keluar.
- **Catat hasil produk pertama** bersama dengan order, agar dapat ditelusuri.

### Error proofing pada changeover

Perangkat [poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) mencegah atau mendeteksi kesalahan [28]. Dalam changeover, contoh yang umum adalah:

| Kesalahan | Poka-yoke |
|---|---|
| Die atau cetakan yang salah untuk order | Die berkode (RFID, barcode atau kunci mekanis) yang dicocokkan oleh kontrol mesin dengan order |
| Program atau resep yang salah | Resep dipanggil secara otomatis dari nomor order |
| Selang terhubung ke port yang salah | Pelat multi-coupling atau coupling yang hanya dapat dipasang dengan satu cara, diberi kode warna |
| Bagian format dipasang di posisi yang salah | Pin penempatan yang asimetris |
| Label atau material lama tertinggal di lini | Daftar periksa line clearance dengan tanda tangan persetujuan; wadah khusus untuk material yang dilepas |

### Industri yang diatur

Di pabrik yang diatur, changeover merupakan bagian dari sistem mutu. Dalam pengemasan farmasi di AS, pemeriksaan line clearance sebelum digunakan dan pendokumentasiannya dalam batch record diwajibkan oleh 21 CFR 211.130(e) [11]. Dalam pangan, changeover alergen merupakan bagian dari pengendalian alergen pangan yang diwajibkan oleh 21 CFR 117.135(c)(2) [37]. Dalam rantai pasok otomotif (IATF 16949) dan aerospace (AS9100), control plan dan persyaratan khusus pelanggan dapat mewajibkan verifikasi setup atau verifikasi produk pertama setelah setup; periksa kontrak dan control plan Anda alih-alih mengasumsikan aturan umum. Panduan [perencanaan produksi aerospace](https://www.m365.fm/en/learn/aerospace-production-planning/) membahas konteks aerospace. Proyek SMED di lingkungan ini sebaiknya melibatkan kepala kualitas sejak hari pertama dan memvalidasi setiap perubahan pada langkah pembersihan atau verifikasi sebelum digunakan.

### Pandangan statistik

Changeover juga merupakan sumber variasi. Jika produk dari awal setiap run berbeda secara sistematis, control chart yang dibagi menurut "30 menit pertama setelah changeover" dan "sisa run" akan membuat hal ini terlihat. Cakmakci menggunakan process capability (Cpk) dalam studi SMED otomotif untuk mengevaluasi keterkaitan antara pengurangan setup dan desain peralatan [16]. Panduan [Six Sigma dan analisis akar masalah](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) membahas analisis kapabilitas dan control chart.

## Orang dan peran: siapa mengerjakan apa dalam changeover

SMED sering digambarkan sebagai metode teknis. Dalam praktiknya, SMED mengubah pekerjaan operator dan setter lebih dari alat Lean lainnya, sehingga keberhasilannya bergantung pada mereka.

### Peran

| Peran | Dalam proyek SMED | Dalam changeover harian |
|---|---|---|
| Operator | Anggota tim; memahami detail, merekam dan direkam | Melakukan persiapan eksternal, sebagian pekerjaan internal, pengukuran produk pertama |
| Setter / die setter | Anggota inti tim; memiliki metode | Melakukan pertukaran internal, memimpin pekerjaan paralel |
| Teknisi pemeliharaan | Membangun dan memelihara perangkat quick-change, kopling, klem | Mendukung changeover yang kompleks; menjaga die dan cetakan tetap dalam kondisi baik |
| Insinyur manufaktur | Memfasilitasi, menganalisis video, merancang solusi teknis | Memiliki standar; meningkatkannya |
| Teknisi kualitas | Menentukan pemeriksaan produk pertama dan error proofing | Menyetujui produk pertama bila diperlukan |
| Supervisor | Menjadi sponsor; menyediakan waktu bagi tim | Merencanakan changeover bersama jadwal; memeriksa kepatuhan |
| Perencana produksi | Menyepakati pemanfaatan waktu yang dihemat; mengubah ukuran lot | Mengurutkan pesanan untuk meminimalkan upaya changeover |
| Perwakilan keselamatan | Meninjau kontrol energi, ergonomi | Mengaudit lockout selama changeover |

### Apa yang berubah bagi operator dan setter

SMED biasanya menggeser pekerjaan: operator mengambil alih persiapan eksternal dan sebagian setup internal, sementara setter menghabiskan lebih sedikit waktu untuk mencari dan lebih banyak waktu untuk langkah-langkah teknis. Itu adalah perubahan isi pekerjaan. Di pabrik yang berserikat, deskripsi pekerjaan, klasifikasi, dan tingkat upah sering ditetapkan dalam kontrak, sehingga pembagian baru harus disepakati dengan serikat pekerja sebelum standar baru diberlakukan. Di pabrik yang tidak berserikat, pertanyaan yang sama muncul secara informal: siapa yang dilatih, siapa yang bertanggung jawab jika produk pertama gagal, dan apakah tugas baru diakui.

### Menghormati manusia

Tiga aturan dari praktik membuat perbedaan antara proyek SMED yang didukung lantai produksi dan yang ditolaknya:

1. **Rekam prosesnya, bukan orangnya.** Jelaskan tujuannya sebelum merekam. Biarkan setter memberi komentar pada video terlebih dahulu; biasanya dia tahu persis di mana pemborosan terjadi. Di pabrik yang berserikat, beri tahu perwakilan serikat sejak awal dan sepakati cara penyimpanan dan penggunaan video.
2. **Jangan mengubah waktu yang dihemat menjadi pemotongan jumlah karyawan.** Jika SMED menyebabkan PHK, proyek perbaikan berikutnya tidak akan mendapat ide dari lantai produksi. Gunakan waktu tersebut untuk kapasitas, lot yang lebih kecil, atau pelatihan.
3. **Tetapkan target yang dapat dicapai dengan aman.** Standar changeover menggambarkan metode yang baik pada kecepatan normal. Analogi pit stop membantu menjelaskan pekerjaan paralel dan persiapan, tetapi tim pit stop berlatih untuk satu pemberhentian dalam kondisi balapan; seorang setter melakukan changeover yang sama di akhir shift panjang, berkali-kali dalam setahun.

Vorne merekomendasikan untuk memulai dengan perbaikan "manusiawi", yaitu persiapan dan pengorganisasian, sebelum perubahan teknis [20]; leanproduction.com memberikan rekomendasi yang sama [19]. Urutan ini juga membangun kepercayaan: tim melihat hasil cepat dari ide mereka sendiri sebelum uang dikeluarkan.

## Template SMED dan daftar periksa

Template di bawah ini dapat disalin ke dalam spreadsheet atau dicetak pada lembar A3 atau 11 × 17 inci. Format ini merupakan format kerja dari praktik, bukan standar.

### Template 1: lembar observasi pergantian produksi (daftar elemen)

| # | Elemen (kata kerja + objek) | Mulai (mm:ss) | Durasi (menit) | Orang | I/E saat ini | Jenis pemborosan (cari, jalan, tunggu, atur, lainnya) | Ide | Dapat menjadi I/E |
|---|---|---|---|---|---|---|---|---|
| 1 | Hentikan mesin, bagian baik terakhir | 00:00 | | | I | | | |
| 2 | | | | | | | | |
| … | | | | | | | | |
| | **Total internal** | | | | | | | |
| | **Total eksternal** | | | | | | | |

Tips: satu baris per elemen, kata kerja di awal ("kendurkan", "berjalan", "mencari"), waktu dibaca dari video. Tambahkan kolom "jarak yang ditempuh" jika berjalan kaki cukup signifikan.

### Template 2: lembar kerja konversi internal ke eksternal

| Elemen internal | Mengapa mesin harus dihentikan? | Apa yang harus berubah agar menjadi eksternal? | Teknik (persiapkan, standarisasi fungsi, jig antara) | Biaya (rendah / sedang / tinggi) | Penanggung jawab | Tenggat |
|---|---|---|---|---|---|---|
| Panaskan cetakan | Cetakan hanya memanas di dalam mesin | Stasiun pemanasan terpisah | Siapkan kondisi operasi | Sedang | | |
| Sejajarkan die dengan mata | Tidak ada referensi | Pin penentu posisi dan penahan belakang | Standarisasi fungsi | Rendah | | |
| | | | | | | |

### Template 3: daftar periksa sebelum pergantian (persiapan eksternal)

| Item untuk pekerjaan berikutnya | Lokasi | Diperiksa oleh | Waktu | OK |
|---|---|---|---|---|
| Die / cetakan / nomor set format … (diperiksa, lengkap, bersih) | Disiapkan di mesin, posisi … | | | ☐ |
| Alat (daftar), klem, baut cadangan | Kereta pergantian | | | ☐ |
| Bahan / komponen (jumlah, lot, dikeringkan jika perlu) | | | | ☐ |
| Program / resep dirilis dan dimuat | Kontroler | | | ☐ |
| Gambar, rencana kontrol, alat ukur bagian pertama | Kereta | | | ☐ |
| Kemasan dan label untuk pekerjaan berikutnya | | | | ☐ |
| Crane / forklift / orang kedua dipesan untuk waktu … | | | | ☐ |
| Teknisi kualitas diberitahu (jika perlu persetujuan) | | | | ☐ |
| Perangkat lockout dan prosedur lockout tersedia | Stasiun lockout | | | ☐ |

Pemicu: waktu tetap sebelum akhir proses berjalan saat ini (misalnya, ketika 45 menit terakhir dimulai), ditampilkan di mesin atau dalam jadwal.

### Template 4: lembar pergantian standar (versi dua orang)

| Langkah | Setter A | Waktu (menit) | Setter B | Waktu (menit) | Poin kunci (keselamatan / kualitas) |
|---|---|---|---|---|---|
| 1 | Hentikan mesin, pasang kunci | 0–2 | Pasang kunci sendiri | 0–2 | Pastikan energi nol sebelum masuk |
| 2 | Lepaskan sambungan (sisi operator) | 2–4 | Lepaskan sambungan (sisi belakang) | 2–4 | Permukaan panas: gunakan sarung tangan |
| 3 | Lepaskan klem, angkat cetakan lama | 4–8 | Pandu crane, letakkan di kereta | 4–8 | Sinyal angkat dua orang |
| … | | | | | |
| n | Pemeriksaan bagian pertama, rilis | | Kembalikan cetakan lama ke penyimpanan | | Catat hasil bagian pertama |
| | **Target waktu berlalu** | | | | |

### Template 5: audit pergantian (mingguan selama bulan pertama, bulanan setelahnya)

| Pertanyaan | Ya / Tidak | Komentar |
|---|---|---|
| Apakah daftar periksa sebelum pergantian diselesaikan sebelum penghentian? | | |
| Apakah urutan standar diikuti? | | |
| Apakah lockout dan verifikasi dilakukan sesuai tertulis? | | |
| Apakah semua alat dan bahan berada di titik penggunaan (tanpa mencari)? | | |
| Apakah pemeriksaan bagian pertama dilakukan sebagaimana ditetapkan? | | |
| Apakah waktu pergantian dicatat (dari bagian baik terakhir hingga bagian baik pertama)? | | |
| Penyimpangan dari target, penyebab dicatat? | | |
| Ide perbaikan dari kru ditangkap? | | |

### Template 6: piagam proyek SMED (satu halaman)

| Bidang | Isi |
|---|---|
| Mesin / lini | |
| Masalah (dengan data) | mis. rata-rata pergantian 96 menit, rentang 78–131 menit, persediaan 11 hari |
| Tujuan | mis. −50% pada siklus pertama, setiap cetakan setiap 3 hari |
| Penggunaan waktu yang dihemat (disepakati dengan perencanaan) | kapasitas / lot lebih kecil / pemisahan |
| Tim | nama dan peran |
| Tinjauan keselamatan dilakukan oleh | |
| Jadwal | tanggal baseline, workshop, implementasi, standardisasi |
| Batas anggaran untuk perangkat keras | |
| Sponsor | |

## Peta jalan penerapan: dari pilot hingga sistem changeover di seluruh pabrik

Jadwal di bawah ini adalah perkiraan praktisi untuk pabrik diskrit berukuran menengah; kerangka waktu bergantung pada peralatan, waktu tunggu perangkat keras, dan seberapa banyak waktu yang diberikan kepada tim [unverified: perkiraan ini belum diverifikasi].

| Fase | Kerangka waktu | Aktivitas | Hasil |
|---|---|---|---|
| 1. Persiapan | Minggu 1–3 | Memilih mesin pilot, mengumpulkan data dasar selama minimal dua minggu [19], piagam proyek, tinjauan keselamatan, menyepakati penggunaan waktu yang dihemat | Piagam proyek ditandatangani, data dasar diketahui |
| 2. Lokakarya pilot | Minggu 4 (3–5 hari) | Merekam dan menganalisis changeover, memisahkan dan mengonversi, perbaikan cepat di lantai produksi, uji coba pertama urutan baru | Standar baru pertama, daftar tindakan |
| 3. Implementasi | Minggu 5–10 | Perangkat keras (kopling, klem, troli), pemanasan awal atau presetting, uji coba kedua, pelatihan untuk semua shift | Standar baru dilatihkan |
| 4. Stabilisasi | Minggu 11–16 | KPI harian di papan, audit mingguan, penyesuaian ukuran lot dan jadwal | Waktu yang stabil, ukuran lot berkurang |
| 5. Penyebaran | Bulan 5–12 | 3–5 mesin berikutnya, pelatih SMED internal dilatih, standar changeover menjadi bagian dari spesifikasi peralatan baru | Sistem changeover di seluruh area |

### Memilih mesin berikutnya

Urutkan kandidat berdasarkan dampak dan usaha:

| Kriteria | Bobot | Pertanyaan |
|---|---|---|
| Bottleneck | Tinggi | Apakah mesin tersebut merupakan kendala dalam aliran nilai? |
| Frekuensi changeover × durasi | Tinggi | Berapa jam per minggu yang hilang akibat changeover? |
| Tekanan persediaan / waktu tunggu | Sedang | Apakah mesin ini mendorong lot besar dan persediaan tinggi di hilir? |
| Variasi waktu changeover | Sedang | Apakah rentangnya lebar (tanda standar yang belum ada)? |
| Kesiapan tim | Sedang | Apakah kru bersedia, dan apakah supervisor mendukung? |
| Usaha perangkat keras | Rendah (negatif) | Apakah diperlukan investasi besar sebelum hasil terlihat? |

### Jadikan changeover sebagai persyaratan desain

Proyek SMED yang paling murah adalah proyek yang tidak perlu dilakukan. Tuliskan persyaratan changeover ke dalam spesifikasi untuk peralatan, perkakas, dan cetakan baru: waktu changeover maksimum, ketinggian klem dan kopling yang distandarkan, pengaturan yang tersimpan, tanpa penyesuaian. Braglia dan rekan-rekannya mengusulkan metode terstruktur, quick changeover design (QCD), untuk membantu pembuat mesin merancang untuk changeover cepat sejak awal [15]. Pembelian dan teknik perlu memiliki tanggung jawab ini, tidak hanya tim lean.

## KPI perubahan produksi: cara mengukur kemajuan

| KPI | Rumus / definisi | Mengapa penting | Tinjauan tipikal |
|---|---|---|---|
| Rata-rata waktu perubahan produksi | Σ waktu perubahan produksi / jumlah perubahan produksi (dari bagian bagus terakhir ke bagian bagus pertama) | Hasil utama | Harian per mesin, tren mingguan |
| Rentang atau simpangan baku waktu perubahan produksi | Maks − min, atau simpangan baku dari 20 perubahan produksi terakhir | Menunjukkan apakah ada standar dan apakah standar itu diikuti | Mingguan |
| Perubahan produksi sesuai standar | Perubahan produksi ≤ waktu target / seluruh perubahan produksi × 100% | Kepatuhan | Harian di papan kendali |
| Waktu setup internal | Jumlah elemen internal | Kemajuan pemisahan dan konversi | Per siklus SMED |
| Waktu run-up dan scrap | Waktu dan scrap dari restart hingga kecepatan dan kualitas standar tercapai | Sering kali menjadi kerugian tersembunyi terbesar | Per perubahan produksi |
| First-piece first-time-right | Bagian pertama yang disetujui pada pemeriksaan pertama / seluruh bagian pertama × 100% | Kualitas perubahan produksi | Mingguan |
| Jumlah perubahan produksi per minggu | Hitungan | Menunjukkan apakah peningkatan dimanfaatkan untuk lot yang lebih kecil | Mingguan bersama perencanaan |
| Porsi perubahan produksi dari waktu terencana | Σ waktu perubahan produksi / waktu produksi terencana × 100% | Pandangan kapasitas | Mingguan |
| EPEI | Interval saat seluruh bagian diproduksi sekali | Fleksibilitas | Bulanan |
| Rata-rata ukuran lot dan hari persediaan | Pcs per lot; persediaan / rata-rata permintaan harian | Hasil bisnis | Bulanan |
| Availability OEE | Sesuai definisi dalam skema OEE Anda | Dampak di tingkat mesin, jika waktu digunakan untuk produksi | Mingguan |

Buat papan kendali tetap sederhana: satu grafik per mesin dengan waktu perubahan produksi harian dibandingkan target, dan satu baris alasan setiap kali perubahan produksi melampaui target. Aturan umum untuk papan KPI dibahas dalam panduan [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

**Catatan tentang target:** "di bawah sepuluh menit" adalah aspirasi Shingo, bukan tolok ukur universal. Waktu perubahan produksi yang baik adalah waktu yang stabil, aman, dan cukup singkat untuk mendukung EPEI yang dibutuhkan pelanggan Anda. Untuk lini press besar, 20 menit mungkin sangat baik; untuk mesin bubut CNC kecil, 20 menit mungkin lambat.

## Kasus bisnis: biaya, ROI, dan akuntansi persediaan

Tim keuangan mengajukan tiga pertanyaan tentang SMED: berapa biayanya, apa imbalannya, dan kapan hasilnya tampak dalam angka. Jawabannya sangat bergantung pada apakah mesin tersebut merupakan bottleneck.

### Biaya

| Item biaya | Sifat tipikal | Akuntansi |
|---|---|---|
| Waktu tim untuk lokakarya dan tindak lanjut | Jam kerja operator, setter, insinyur | Beban operasional |
| Perangkat keras berbiaya rendah (troli, shadow board, balok spacer, pengodean warna) | Kecil | Umumnya beban operasional, tergantung ambang kapitalisasi Anda |
| Perangkat keras quick-change (kopling, sistem penjepit, pemanas awal, presetter) | Sedang hingga tinggi | Sering kali belanja modal jika di atas ambang Anda |
| Pelatihan | Jam | Beban operasional |
| Kehilangan produksi selama uji coba | Biasanya kecil jika uji coba dijalankan selama perubahan produksi yang terencana | Beban operasional |

### Imbalan

1. **Kapasitas di bottleneck:** jam perubahan produksi yang dihemat × margin kontribusi per jam, jika output tambahan dapat dijual. Pada contoh CNC di atas, 590 menit perubahan produksi per minggu merugikan sekitar $92.000 per tahun dalam margin yang hilang; memangkasnya separuh akan memulihkan sekitar $46.000 per tahun, tetapi hanya jika output tambahan menemukan pembeli.
2. **Pengurangan persediaan:** pelepasan kas satu kali (neraca) plus penghematan berkelanjutan dalam biaya penyimpanan (laba rugi).
3. **Lebih sedikit expedite dan perubahan produksi mendadak:** lembur, pengiriman premium, dan gangguan pada pekerjaan terencana.
4. **Scrap dan pengerjaan ulang:** run-up yang lebih singkat dan lebih stabil.
5. **Tenaga kerja:** kadang lebih rendah, sering kali serupa; pekerjaan paralel memperpendek waktu berjalan tetapi tidak selalu mengurangi konten tenaga kerja.

### Contoh ROI yang dikerjakan (ilustratif, melanjutkan contoh cetak injeksi)

| Item | Jumlah |
|---|---|
| Investasi: stasiun pemanasan awal | $12.000 |
| Investasi: 6 set multi-coupling seharga $1.500 | $9.000 |
| Investasi: standardisasi klem dan locating | $6.000 |
| Waktu tim: 6 orang × 16 jam × $45 biaya beban | $4.320 |
| **Total biaya satu kali** | **$31.320** |
| Persediaan barang jadi berkurang 5 hari pada $6.000 per hari biaya barang yang dijual | $30.000 pelepasan kas satu kali |
| Biaya penyimpanan yang dihemat 20% per tahun atas $30.000 | $6.000 per tahun |
| Pengurangan expedite dan lembur (estimasi dari catatan tahun lalu) | $8.000 per tahun |
| Scrap saat run-up: 15 shot scrap lebih sedikit per changeover × 10 changeover × 50 minggu × $0,90 | $6.750 per tahun |
| **Manfaat berulang** | **$20.750 per tahun** |
| **Simple payback atas manfaat berulang** | 31.320 / 20.750 ≈ 1,5 tahun |

Kas yang dilepaskan dari persediaan ($30.000) hampir menutup investasi pada tahun pertama, tetapi itu adalah efek neraca, bukan laba. Pisahkan keduanya dalam business case, dan jangan menghitung penghematan yang sama dua kali.

### Efek absorption costing

Di bawah absorption costing [38], yang secara substansi diwajibkan US GAAP untuk pelaporan persediaan eksternal (ASC 330-10-30-1 dan 30-3 mencakup alokasi overhead produksi tetap berdasarkan kapasitas normal, dan 330-10-30-8 menyatakan bahwa mengecualikan seluruh overhead dari biaya persediaan bukan prosedur akuntansi yang diterima [40]; tanyakan kepada controller Anda bagaimana perusahaan menerapkannya), sebagian overhead manufaktur tetap dikapitalisasi ke dalam persediaan. Ketika persediaan turun, overhead yang telah dikapitalisasi dalam persediaan yang berkurang itu dilepaskan ke harga pokok penjualan pada periode tersebut. Laba yang dilaporkan dapat karena itu turun sementara selama persediaan berkurang, meskipun kas membaik.

**Contoh yang dikerjakan (ilustratif):** Jika 30 persen dari nilai persediaan $30.000 adalah overhead tetap, pengurangan persediaan melepaskan sekitar $9.000 overhead ke harga pokok penjualan periode tersebut. Controller pabrik sebaiknya menjelaskan hal ini kepada manajemen sebelum program SMED dimulai, agar keberhasilan lean tidak terlihat seperti kelebihan biaya. Panduan [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) membahas cara menyajikan efek semacam ini pada scorecard pabrik.

## SMED dan alat lean lainnya

SMED jarang bekerja sendirian. Ia bergantung pada beberapa alat dan juga memungkinkan alat lain bekerja.

| Alat | Hubungan dengan SMED |
|---|---|
| [5S](https://www.m365.fm/en/learn/5s-visual-management/) | Prasyarat: perkakas dan cetakan yang memiliki tempat tetap menghilangkan pencarian, pemborosan eksternal terbesar [27] |
| [Standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) | Mempertahankan hasil: pergantian baru menjadi standar [26] |
| [TPM](https://www.m365.fm/en/learn/tpm-oee/) | Menjaga cetakan, die, dan perangkat ganti cepat tetap dalam kondisi baik; leanproduction.com merekomendasikan TPM lebih dulu ketika kerusakan, bukan pergantian, mendominasi waktu yang hilang [19][29] |
| [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) | Mencegah perkakas, program, atau sambungan yang salah [28] |
| [Kanban dan pull](https://www.m365.fm/en/learn/kanban-pull-system/) | Menggunakan lot yang lebih kecil; kuantitas kanban menyusut seiring pergantian yang makin singkat [34] |
| [Heijunka](https://www.m365.fm/entity/heijunka/) | Perataan berdasarkan campuran produk memerlukan pergantian yang sering dan singkat [25] |
| [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) | Menunjukkan pergantian mana yang mendorong persediaan dan lead time; waktu pergantian dan EPEI merupakan entri kotak data [35] |
| [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) | Workshop SMED adalah format kegiatan kaizen yang klasik |
| [Theory of constraints](https://www.m365.fm/en/learn/theory-of-constraints/) | Mengarahkan upaya SMED ke kendala terlebih dahulu, tempat waktu yang dihemat menjadi output sistem |
| [Production scheduling dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/) | Mengurutkan pesanan untuk meminimalkan upaya pergantian dan mengubah pergantian yang lebih singkat menjadi lot yang lebih kecil |

## Contoh SMED yang terdokumentasi

Banyak halaman web mengutip pengurangan "tipikal" sebesar 50 hingga 90 persen tanpa sumber. Contoh-contoh di bawah ini terdokumentasi, beserta batasannya.

### Pergantian mesin press Toyota

Wikipedia, dengan merujuk pada buku-buku Shingo, melaporkan bahwa pergantian di Toyota turun dari hitungan jam menjadi 15 menit pada 1960-an dan menjadi 3 menit pada 1970-an [5]; catatan Shingo sendiri menggambarkan pergantian die yang memakan waktu satu hingga dua jam, kadang setengah hari, dipangkas menjadi beberapa menit setelah ia mulai bekerja di Toyota pada 1969 [6]. Sebuah buku teks rekayasa terbuka melaporkan pergantian mesin press 1.000 ton di Toyota dikurangi dari empat jam menjadi tiga menit [36]. Angka-angka ini berasal dari catatan Shingo dan Toyota dan tidak diaudit secara independen, tetapi konsisten di berbagai sumber.

### Brighton NC Machine Corporation (Michigan, NIST MEP)

Brighton NC Machine, produsen di Michigan dengan lebih dari 100 karyawan, bekerja sama dengan Michigan Manufacturing Technology Center, bagian dari NIST MEP National Network [17]. Sebelum proyek, pergantian hanya bisa dilakukan pada shift pertama, memakan waktu 8 jam 20 menit dan membutuhkan perjalanan karyawan sejauh 9.121 kaki [17]. Sebuah kegiatan kaizen dengan video, diagram spaghetti, dan bagan analisis setup menghasilkan pengurangan waktu pergantian sebesar 70 persen dan pengurangan waktu perjalanan 98 persen, dan perusahaan melaporkan penjualan baru sebesar $460.000 serta penghematan biaya $125.000 [17]. Hasil ini sebagaimana dilaporkan oleh perusahaan dan MEP; kisah sukses MEP bersumber dari laporan klien.

### Kasus konsultasi Shingo

Shingo melaporkan bahwa dari kasus pengurangan setup yang ia tangani antara 1975 dan 1985, waktu setup turun rata-rata menjadi sekitar 2,5 persen dari semula [5]. Itu adalah rata-rata dari kasus terpilih oleh penemu metode ini, sehingga merupakan tolok ukur atas, bukan ekspektasi.

### Tinjauan riset

Tinjauan state-of-the-art oleh da Silva dan Godinho Filho dalam *International Journal of Advanced Manufacturing Technology* (2019) mengklasifikasikan 130 artikel tentang SMED berdasarkan bidang, metode, alat, implementasi, dan hasil [14]. Literatur menunjukkan SMED diterapkan di lingkungan otomotif, pengerjaan logam, pengemasan, percetakan, makanan, dan farmasi. Satu kasus dari industri percetakan yang dikutip dalam buku teks terbuka melaporkan pengurangan waktu setup internal sebesar 46 persen [36]. Kasus yang dipublikasikan cenderung melaporkan keberhasilan; proyek yang gagal atau memudar jarang dituliskan, sehingga rata-rata dari literatur kasus perlu disikapi dengan hati-hati.

## Kesalahan umum dalam SMED

| Kesalahan | Mengapa merugikan | Yang lebih baik |
|---|---|---|
| Tidak ada keputusan tentang penggunaan waktu yang dihemat | Keuntungan hilang menjadi waktu menganggur; ukuran lot tetap sama | Sepakati dengan perencanaan sebelum proyek: kapasitas, lot lebih kecil, atau pemisahan |
| Membeli perangkat keras terlebih dahulu | Mengotomatisasi pemborosan; anggaran habis sebelum organisasi dibenahi | Selesaikan pemisahan dan konversi terlebih dahulu; mekanisasi di akhir [5] |
| Hanya mengukur "pergantian" | Melewatkan run-up dan penyesuaian, yang sering kali merupakan bagian terbesar | Dari bagian baik terakhir hingga bagian baik pertama pada kecepatan standar [2] |
| Merekam tanpa penjelasan | Tim merasa diawasi; muncul resistensi | Jelaskan tujuannya, libatkan setter dalam analisis, sepakati penggunaan video |
| Percontohan pada mesin tersulit | Hasil lama, mahal, dan lambat | Lakukan percontohan dengan changeover 30–90 menit yang sering terjadi |
| Satu changeover "unggulan" | Waktu tercatat dengan kehadiran insinyur, tidak dapat diulang | Standarisasi, latih semua shift, ukur selama beberapa minggu |
| Melewatkan lockout/tagout untuk menghemat waktu | Risiko cedera serius; pelanggaran OSHA | Tulis lockout ke dalam standar; buat lebih cepat, jangan pernah dilewati [8] |
| Tidak ada standar dan tidak ada audit | Waktu kembali menyimpang dalam hitungan bulan | Lembar changeover standar, audit, KPI di papan |
| Mengabaikan jadwal | Urutan acak memicu changeover penuh yang sebenarnya bisa parsial | Urutkan berdasarkan famili produk; rencanakan changeover pada waktu tetap |
| Memulai changeover tepat sebelum pergantian shift | Serah terima terjadi di tengah setup internal; langkah terlewati atau diulang, gembok berpindah tangan | Rencanakan changeover agar satu tim menyelesaikannya, atau tetapkan titik serah terima formal dengan transfer lockout sebagaimana diwajibkan prosedur pengendalian energi Anda |
| Biaya setup dalam sistem perencanaan tidak pernah diperbarui | ERP terus menghitung lot besar | Perbarui waktu setup dan aturan ukuran lot di ERP setelah SMED |
| Memperlakukan SMED sebagai proyek sekali jadi | Tidak ada siklus kedua; tahap perangkat keras tidak pernah terjadi | Rencanakan siklus; jadikan SMED bagian dari rutinitas perbaikan |

Poin kedua dari belakang mudah terlewat. Banyak sistem ERP menghitung ukuran lot dari waktu setup yang tersimpan dalam routing. Jika nilai tersebut tetap pada angka lama, sistem perencanaan akan terus merekomendasikan lot besar yang lama. Panduan [S&OP dan MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) menjelaskan di mana parameter-parameter ini disimpan.

## Batasan dan kritik terhadap SMED

SMED adalah salah satu alat lean yang paling terdokumentasi, tetapi ia memiliki batasan, dan literatur penelitian telah menunjukkannya.

### 1. Terlalu banyak organisasi, terlalu sedikit desain

McIntosh dan rekan-rekannya berpendapat pada 1996 bahwa interpretasi SMED yang meluas telah membuat praktisi lebih memilih perubahan organisasi berbasis tim yang berbiaya rendah dan mengabaikan solusi berbasis desain yang dapat memperbaiki pergantian produksi secara lebih mendasar; mereka memberi perhatian khusus pada masalah menjaga keberlanjutan perbaikan [13]. Kelompok peneliti yang sama kemudian menerbitkan evaluasi kritis terhadap metodologi Shingo di *International Journal of Production Research* (2000) [12]. Studi otomotif Cakmakci serupa dalam menghubungkan masalah setup dengan peralatan dan desain cetakan yang tidak memadai [16], dan Braglia dan rekan-rekannya mengembangkan desain pergantian cepat untuk membawa kemampuan pergantian produksi ke dalam desain mesin [15]. Kesimpulan praktisnya: jalankan lokakarya SMED, tetapi juga tuliskan persyaratan pergantian produksi ke dalam spesifikasi untuk peralatan baru dan desain produk.

### 2. Menjaga keberlanjutan hasil

Waktu pergantian produksi cenderung kembali memburuk ketika standar tidak dilatihkan kepada staf baru, troli pergantian kehilangan perkakasnya, atau perangkat pergantian cepat tidak dirawat. McIntosh dan rekan-rekannya menyoroti keberlanjutan sebagai kelemahan utama [13]. Langkah penanggulangannya sederhana: pekerjaan standar, audit, KPI yang dipajang di papan, dan perawatan perangkat keras di bawah TPM.

### 3. Tidak setiap proses memperoleh manfaat yang sama

- **Industri proses** (kimia, makanan, farmasi) sering kali memiliki pergantian produksi yang didominasi oleh pembersihan, validasi, dan pemeriksaan wajib. SMED memperpendek pekerjaan di sekitarnya, tetapi perencanaan kampanye dan urutan produk (dari terang ke gelap, bebas alergen terlebih dahulu) mungkin lebih penting.
- **Job shop dengan campuran tinggi dan volume rendah** memiliki banyak setup unik yang hanya terjadi sekali. Analisis elemen demi elemen pada satu setup memberi manfaat yang lebih kecil; penjepitan benda kerja yang distandarkan, perpustakaan perkakas, pemrograman offline, dan pengelompokan berdasarkan famili part memberi manfaat yang lebih besar.
- **Mesin dengan kapasitas cadangan dan persediaan rendah** sedikit memperoleh manfaat dari SMED. Periksa dahulu porsi pergantian produksi dalam waktu yang hilang [19].

### 4. Manfaat yang tidak sampai ke laba bersih

Jika waktu yang dihemat tidak digunakan (lihat tiga pilihan di atas), SMED hanya memperbaiki angka pada grafik dan tidak ada yang lain. Metode ini tidak dapat mencegah hal itu; manajemen harus melakukannya, dan inilah alasan paling umum mengapa SMED mengecewakan.

### 5. Tekanan pada manusia

Target kecepatan dan pengukuran dengan stopwatch dapat menciptakan tekanan, pekerjaan yang tergesa-gesa, dan jalan pintas yang mengabaikan keselamatan. Metode itu sendiri tidak mewajibkan hal tersebut, tetapi implementasinya bisa. Praktik yang baik menetapkan target pada kecepatan yang berkelanjutan, melindungi waktu lockout, dan tidak menggunakan waktu yang dihemat untuk memangkas pekerjaan.

## SMED go digital: data, video, MES dan penjadwalan

Alat digital tidak menggantikan metode SMED, tetapi membuat analisis lebih cepat dan hasilnya lebih mudah dipertahankan.

### Mengukur changeover secara otomatis

Catatan changeover manual sering tidak lengkap. Sistem pemantauan mesin dapat mendeteksi changeover dari status mesin dan jumlah part, sehingga setiap changeover memiliki waktu mulai, waktu selesai, dan durasi tanpa pekerjaan administrasi; vendor seperti MachineMetrics berpendapat bahwa pencatatan data otomatis lebih andal dibandingkan pencatatan manual [21] (klaim vendor). Operator tetap perlu memasukkan alasan ketika changeover berlangsung lama. Panduan [manufacturing execution system (MES) dan ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) menjelaskan bagaimana data tersebut sesuai dengan arsitektur sistem pabrik, dan [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) membahas opsi cloud untuk mengumpulkannya.

Perangkat quick-change semakin terhubung: die dan cetakan berkode yang diperiksa controller terhadap order, unduhan resep, sistem clamping dengan sensor. Masing-masing merupakan aset OT pada jaringan pabrik, dengan pertanyaan patching dan akses yang sama seperti controller lainnya; panduan tentang [OT cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) membahas cara mengamankannya.

### Analisis video

Video dari smartphone atau action camera sudah cukup untuk sebagian besar workshop SMED. Perangkat lunak yang memungkinkan tim memotong video menjadi elemen dan menandainya sebagai internal atau eksternal menghemat berjam-jam pengukuran waktu manual. Sepakati perlindungan data: siapa yang melihat video, berapa lama disimpan, dan bahwa video tidak digunakan untuk evaluasi kinerja individu.

### Instruksi kerja dan resep digital

Instruksi kerja digital dapat berganti otomatis mengikuti order, menampilkan lembar standar changeover langkah demi langkah dengan gambar, dan mencatat hasil first-piece; hal ini dibahas dalam klaster tentang [paperless manufacturing](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/). Manajemen resep, di mana pengaturan mesin disimpan per produk dan diunduh dari order, menghilangkan penyesuaian sebagai sumber waktu dan kesalahan. Di industri yang diatur regulasi, keduanya harus divalidasi.

### Penjadwalan dengan setup yang bergantung pada urutan

Ketika waktu changeover bergantung pada urutan (warna terang ke gelap, format kecil ke besar, bebas alergen didahulukan), alat penjadwalan dapat mengurutkan order untuk meminimalkan total waktu changeover. Sistem advanced planning and scheduling (APS) dapat memodelkan matriks setup yang bergantung pada urutan; panduan [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) membahas cara kerjanya dan kebutuhannya dari lantai produksi. Matriks setup di APS harus diperbarui setelah setiap siklus SMED, jika tidak penjadwal akan mengoptimalkan berdasarkan waktu lama.

### Simulasi dan model value stream

Sebelum pabrik mengurangi ukuran lot di sepanjang value stream, pabrik dapat menguji dampak changeover yang lebih singkat terhadap EPEI, persediaan, dan lead time dalam model value stream atau discrete event simulation. Panduan [digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) dan klaster tentang [manufacturing simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) menjelaskan pendekatannya. Perangkat lunak value stream seperti iFAKT Polaris adalah salah satu contoh alat yang menyimpan waktu changeover dan ukuran lot per langkah proses serta menghitung dampaknya terhadap value stream; lihat profil [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). **Catatan: Penulis bekerja di iFAKT GmbH.**

### Batasan

Alat digital memperkuat standar kerja; alat digital tidak menciptakannya. Dashboard pemantauan mesin yang menampilkan changeover 90 menit tidak mengubah apa pun sampai tim merekam changeover dan memperbaikinya. Mulailah dengan kertas dan video, dan digitalisasikan pengumpulan data setelah standar dan rutinitas KPI berjalan.

## Glosarium SMED

| Istilah | Arti |
|---|---|
| **Penyesuaian** | Pengaturan secara coba-coba setelah memasang alat; kategori waktu setup terbesar dalam pembagian Shingo [5] |
| **Changeover** | Peralihan mesin atau lini dari satu produk ke produk lain; juga disebut setup [2] |
| **Waktu changeover** | Waktu dari unit baik terakhir pada proses lama hingga unit baik pertama pada proses baru [2], idealnya pada kecepatan standar |
| **Troli changeover** | Troli yang berisi semua alat dan suku cadang untuk changeover, disusun sesuai urutan pemakaian |
| **Stok siklus** | Persediaan yang tercipta dari ukuran lot; rata-rata sekitar setengah lot jika permintaan stabil |
| **Die** | Alat yang dipakai pada press untuk memotong atau membentuk material; asal huruf "D" dalam SMED |
| **ECRS** | Eliminate, combine, rearrange, simplify: pertanyaan perbaikan dari Training Within Industry, digunakan dalam program quick die change Toyota [5] |
| **EOQ / EPQ** | Economic order quantity / economic production quantity: rumus ukuran lot yang menyeimbangkan biaya setup dan biaya penyimpanan |
| **EPEI / EPEx** | Every part (product) every interval: seberapa sering suatu proses menjalankan siklus untuk semua bagiannya (produknya) [3] |
| **Setup eksternal** | Pekerjaan setup yang dapat dilakukan saat mesin beroperasi [1] |
| **Persetujuan benda pertama** | Pemeriksaan benda pertama setelah changeover sebelum produksi dilanjutkan |
| **Klem fungsional** | Pengencang yang menjepit dengan satu gerakan, seperti tuas cam atau sekrup seperempat putaran [5] |
| **Jig antara** | Pembawa standar (pallet, subplate) tempat alat atau benda kerja berikutnya disiapkan di luar mesin [5] |
| **Setup internal** | Pekerjaan setup yang hanya dapat dilakukan saat mesin berhenti [1] |
| **Line clearance** | Pemeriksaan bahwa semua material dari proses sebelumnya telah dikeluarkan sebelum proses berikutnya dimulai; wajib dalam pengemasan obat di AS [11] |
| **Lockout/tagout (LOTO)** | Prosedur dan perangkat untuk mengendalikan energi berbahaya selama perawatan, termasuk saat setup, berdasarkan 29 CFR 1910.147 [8] |
| **Pengecualian perawatan minor** | Pengecualian sempit dari lockout/tagout untuk pergantian alat minor yang rutin, berulang, dan terintegrasi selama produksi normal dengan perlindungan alternatif yang efektif [8][9] |
| **OTED** | One-touch exchange of die: changeover di bawah 100 detik [5] |
| **Operasi paralel** | Dua orang atau lebih bekerja pada changeover secara bersamaan dengan urutan yang telah ditentukan [5] |
| **Quick changeover (QCO)** | Istilah umum di AS untuk praktik SMED [18] |
| **Resep** | Kumpulan parameter mesin tersimpan per produk, diunduh alih-alih diatur secara manual |
| **Run-up** | Fase setelah restart hingga bagian baik dihasilkan pada kecepatan standar |
| **Blok pengaman** | Blok yang dipasang di antara kedua belahan die press saat die disesuaikan atau diperbaiki; diwajibkan oleh OSHA untuk mesin press bertenaga mekanis [10] |
| **Bagan analisis setup** | Daftar elemen changeover dengan waktu dan klasifikasi internal/eksternal [17] |
| **Diagram spageti** | Gambar jalur perjalanan operator pada tata letak |
| **Standarkan fungsi, bukan bentuk** | Hanya menstandarkan fitur alat yang berinteraksi dengan mesin, seperti tinggi penjepitan [5] |
| **3 Ups** | Clean-up, set-up, start-up: model sederhana fase-fase changeover [24] |

## FAQ: SMED dan pertanyaan tentang changeover

### Apa kepanjangan SMED?

SMED adalah singkatan dari single-minute exchange of die (kadang ditulis "dies"). "Single-minute" berarti satu digit menit, sehingga changeover kurang dari sepuluh menit [1]. Metode ini berlaku untuk setiap changeover, tidak hanya untuk die pada mesin press.

### Siapa yang menciptakan SMED?

Shigeo Shingo (1909–1990), seorang insinyur industri asal Jepang, mengembangkan metode ini sejak tahun 1950-an, dengan pekerjaan di Toyo Kogyo (Mazda), Mitsubishi Heavy Industries dan, mulai 1969, Toyota [6]. Ia menerbitkannya dalam bahasa Inggris pada 1985 sebagai *A Revolution in Manufacturing: The SMED System* [6].

### Apa saja langkah-langkah SMED?

Mengamati dan mencatat changeover, memisahkan elemen internal dari eksternal, mengubah internal menjadi eksternal, merampingkan elemen internal, merampingkan elemen eksternal, menstandarkan, dan mengulanginya [5]. Panduan ini menambahkan langkah persiapan di depannya (percobaan awal, tim, tinjauan keselamatan, pemanfaatan waktu yang dihemat).

### Apa perbedaan setup internal dan eksternal?

Setup internal hanya dapat dilakukan saat mesin berhenti, misalnya memasang die. Setup eksternal dapat dilakukan saat mesin berjalan, misalnya mengambil dan memeriksa die berikutnya [1]. SMED memindahkan sebanyak mungkin pekerjaan dari internal ke eksternal.

### Bagaimana cara menghitung waktu changeover?

Ukur dari bagian baik terakhir pada produksi sebelumnya hingga bagian baik pertama pada produksi baru dengan kecepatan standar [2][21]. Waktu changeover rata-rata adalah jumlah seluruh waktu changeover dibagi jumlah changeover; porsi changeover adalah total waktu changeover dibagi waktu produksi yang direncanakan. Lihat rumus dan contoh CNC di bagian pengukuran.

### Apa perbedaan antara waktu changeover dan waktu setup?

Dalam penggunaan sehari-hari, keduanya sering dianggap sama, meskipun sejumlah sumber memisahkannya secara eksplisit [23]. Secara ketat, banyak praktisi menggunakan "waktu setup" untuk proses pertukaran itu sendiri dan "waktu changeover" untuk seluruh kehilangan waktu dari bagian baik terakhir hingga bagian baik pertama, termasuk run-down dan run-up. Gunakan definisi yang lebih luas untuk pekerjaan perbaikan.

### Berapa waktu changeover yang baik?

Target Shingo adalah di bawah sepuluh menit [1]. Jawaban praktisnya: waktu changeover yang baik itu stabil (rentang sempit), aman, dan cukup singkat untuk mendukung ukuran lot dan EPEI yang dibutuhkan pelanggan Anda. Untuk lini press besar, 20 menit bisa sangat baik; untuk mesin kecil, bisa dianggap lambat.

### Apa itu OTED?

One-touch exchange of die: changeover kurang dari 100 detik [5]. Ini adalah target berikutnya setelah SMED, biasanya hanya tercapai dengan perangkat quick-change khusus.

### Bagaimana hubungan SMED dengan OEE?

Changeover biasanya dicatat sebagai kehilangan ketersediaan dan scrap run-up sebagai kehilangan kualitas dalam OEE [4]. Changeover yang lebih singkat hanya meningkatkan ketersediaan OEE jika waktu yang dihemat digunakan untuk berproduksi. Jika digunakan untuk changeover yang lebih sering, OEE mungkin tetap stagnan sementara persediaan dan lead time membaik.

### Apakah SMED memerlukan lockout/tagout?

Di Amerika Serikat, pengaturan mesin termasuk bagian dari "servicing and/or maintenance" menurut standar lockout/tagout OSHA, 29 CFR 1910.147, sehingga langkah changeover internal pada peralatan dengan energi berbahaya secara default tercakup di dalamnya [8]. Pengecualian sempit berlaku untuk penggantian alat kecil selama produksi normal yang bersifat rutin, berulang dan terintegrasi, dan hanya dengan perlindungan alternatif yang efektif [8][9]. Serahkan kepada profesional keselamatan Anda untuk memutuskan langkah mana yang memenuhi syarat.

### Apa itu EPEI dan bagaimana SMED mengubahnya?

EPEI (every part every interval; LEI: EPEx) adalah waktu yang dibutuhkan suatu proses untuk memproduksi seluruh nomor part-nya satu kali [3]. Nilainya bergantung pada waktu changeover dan jumlah part. Rumus umumnya adalah total waktu changeover untuk semua part dibagi sisa waktu harian setelah waktu run. Dalam contoh panduan ini, memangkas changeover dari 200 menjadi 70 menit per siklus menurunkan EPEI dari 2 hari menjadi 1 hari dan memangkas lot menjadi setengahnya.

### Mengapa perbaikan changeover gagal seiring waktu?

Karena standar tidak dilatih ke semua shift, troli changeover kehilangan alatnya, perangkat quick-change tidak dirawat, atau tidak ada yang memantau KPI. Penelitian menempatkan sustainment sebagai kelemahan utama praktik SMED [13]. Sumber praktisi menunjuk penyebab yang sama, seperti eksekusi yang tidak konsisten dan peralatan yang belum siap [22]. Standard work, audit, dan KPI changeover harian di papan informasi adalah langkah penanggulangannya.

### Apakah SMED bagian dari TPM?

Tidak. SMED dan TPM adalah dua metode lean yang terpisah, tetapi saling bergantung. TPM menjaga die, mold, dan perangkat quick-change tetap dalam kondisi baik, dan leanproduction.com merekomendasikan memulai dengan TPM ketika kerusakan mesin, bukan changeover, mendominasi waktu yang hilang [19][29]. Dalam sebagian besar skema OEE, changeover dan kerusakan mesin sama-sama dicatat sebagai kerugian availability.

### Apakah SMED hanya berlaku untuk die dan mesin press?

Tidak. Namanya berasal dari mesin press stamping, tetapi LEI mendefinisikan SMED sebagai proses untuk mengganti peralatan produksi apa pun dari satu part number ke part number lain dalam waktu sesingkat mungkin [1]. Langkah-langkah yang sama dapat diterapkan pada changeover lini di pengemasan, penggantian mold, penggantian fixture pada machining center, atau perubahan produk pada lini perakitan.

### Apa perbedaan antara event SMED dan program SMED?

Event SMED adalah workshop terfokus, biasanya kaizen event, pada satu mesin atau lini. Program SMED adalah sistem di tingkat pabrik yang mendasarinya: template changeover standar, tim yang terlatih, KPI changeover pada papan shop floor, dan rencana penyebaran dari mesin ke mesin. Event menghasilkan hasil pertama; program menjaga dan menyebarkan hasil tersebut (lihat roadmap penyebaran).

### Industri apa saja yang menggunakan SMED?

Setiap industri yang memiliki changeover: otomotif dan stamping logam, plastik, machining, pengemasan, percetakan, elektronik, makanan dan minuman, serta farmasi. Sebuah tinjauan terhadap 130 artikel SMED mencakup berbagai sektor [14]. Di industri proses, pembersihan dan pemeriksaan wajib sering kali mendominasi, sehingga SMED dikombinasikan dengan perencanaan urutan dan perencanaan campaign.

### Berapa lama proyek SMED berlangsung?

Siklus SMED pertama pada satu mesin sering memakan waktu sekitar tiga sampai empat bulan dari baseline hingga standar baru yang stabil: beberapa minggu untuk persiapan dan baseline, workshop selama tiga sampai lima hari, beberapa minggu untuk perangkat keras dan pelatihan, serta satu bulan stabilisasi [unverified: estimasi praktisi]. Waktu tunggu perangkat keras dapat memperpanjang durasi ini.

### Berapa biaya SMED?

Siklus pertama sering kali murah: waktu tim, checklist, troli, pengkodean warna, dan balok spacer. Perangkat keras quick-change seperti multi-coupling, pengencang hidrolik, atau stasiun pemanasan awal membutuhkan biaya lebih besar dan sebaiknya dilakukan setelah langkah-langkah organisasi. Contoh perhitungan ROI dalam panduan ini memperkirakan periode pengembalian sekitar 1,5 tahun untuk mesin molding; angka Anda akan berbeda.

### Dapatkah SMED diterapkan di job shop dengan high-mix, low-volume?

Bisa, tetapi dengan fokus yang berbeda. Ketika sebagian besar setup bersifat unik, standarkan apa yang berulang: workholding, pustaka alat, pemrograman offline, presetting, dan famili part. Analisis proses setup, bukan satu setup tertentu.

## Kesimpulan dan langkah pertama

SMED adalah salah satu metode lean yang paling praktis karena logikanya sederhana dan hasilnya dapat diukur: jangan menghentikan mesin untuk pekerjaan yang bisa dilakukan saat mesin berjalan, dan buat apa pun yang harus dilakukan selama penghentian menjadi sederhana, aman, dan bebas penyetelan. Wawasan Shingo dari tahun 1950-an dan 1960-an masih berlaku, dan keuntungan besar pertama masih datang dari daftar periksa, staging, dan pekerjaan paralel, bukan dari perangkat keras yang mahal.

Metode ini hanya memberi manfaat jika waktu yang dihemat benar-benar digunakan. Waktu changeover yang lebih singkat adalah potensi kapasitas atau potensi fleksibilitas; pabrik harus memutuskan yang mana, lalu mengubah ukuran lot, rangkaian produksi, jadwal, dan parameter ERP agar sesuai dengan permintaan pelanggan. Angka-angka dalam panduan ini menunjukkan mengapa hal itu layak dilakukan: dalam contoh EPEI, memangkas waktu changeover per siklus dari 200 menjadi 70 menit membuat ukuran lot setengahnya, dan dalam rumus ukuran lot, biaya setup seperempat berarti lot ekonomis setengahnya.

Batasannya juga perlu diperhatikan. SMED organisasi mencapai batas ketika desain peralatan dan produk mengambil alih, keuntungan memudar tanpa standar dan audit, dan kecepatan tidak boleh mengorbankan lockout/tagout atau ergonomi.

**Langkah pertama Anda dalam 30 hari ke depan**

- [ ] Pilih satu mesin dengan changeover yang sering, berkisar 30 hingga 90 menit, dan memiliki masalah bisnis yang terlihat
- [ ] Catat awal dan akhir setiap changeover selama dua minggu (dari bagian baik terakhir hingga bagian baik pertama)
- [ ] Sepakati dengan perencanaan bagaimana waktu yang dihemat akan digunakan: kapasitas, lot yang lebih kecil, atau pemisahan
- [ ] Tinjau prosedur pengendalian energi mesin tersebut bersama profesional keselamatan Anda
- [ ] Rekam satu changeover dengan persetujuan kru dan susun daftar elemen
- [ ] Tandai setiap elemen sebagai internal atau eksternal dan perkenalkan daftar periksa pra-changeover
- [ ] Hitung EPEI saat ini dan ukuran lot yang diimplikasikannya
- [ ] Pasang waktu changeover di papan lantai produksi dengan target dan kolom alasan
- [ ] Periksa apakah pusat NIST MEP di negara bagian Anda menawarkan workshop changeover cepat [18][31]

---

## Bacaan lanjutan di m365.fm

**Panduan dalam jalur pembelajaran ini**
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

**Pembahasan mendalam**
- [Kaizen and kaizen events](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)
- [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/)
- [PDCA cycle](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/)
- [Standard work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Paperless manufacturing and digital work instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Lot sizing: EOQ and EPQ](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Manufacturing inventory management](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Manufacturing simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Manufacturing workforce skills and TWI](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Istilah glosarium (entitas)**
[SMED](https://www.m365.fm/entity/smed/) · [Setup time](https://www.m365.fm/entity/setup-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [5S](https://www.m365.fm/entity/5s/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/) · [TPM](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Lean management](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Gastgeber von m365.fm und arbeitet bei iFAKT GmbH. Auf m365.fm schreibt er über Lean Manufacturing, operative Exzellenz und die digitale Transformation der Produktion, mit Schwerpunkt darauf, wie Wertstrommodelle, Simulation und KPI-Analysen Werken helfen, Methoden wie SMED in die Praxis umzusetzen.

**Hinweis: Der Autor arbeitet bei iFAKT GmbH.**

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
