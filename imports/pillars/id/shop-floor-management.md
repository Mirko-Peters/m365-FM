# SEO metadata

| Field | Value |
|---|---|
| Meta title | Shopfloor Management & Gemba Walk: Panduan Praktis |
| Meta description | Shopfloor management dijelaskan: rapat tier, papan SQDCP, KPI, checklist gemba walk, roadmap penerapan, dan papan digital di Microsoft 365. |
| Slug | `shop-floor-management` |

# Shopfloor-Management dan Gemba Walk: Panduan Lengkap untuk Memimpin di Tempat Pekerjaan Berlangsung

*Terakhir diperbarui: 20 November 2026 · Detail Microsoft telah diverifikasi di Microsoft Learn per tanggal ini*

> **Jawaban singkat:** Shop floor management (juga ditulis shopfloor management, sering disebut daily management system atau tiered management) adalah sistem kepemimpinan yang membuat manajer memimpin operasi di tempat nilai benar-benar diciptakan: di lantai produksi, di gudang atau di laboratorium. Sistem ini menggabungkan kehadiran pemimpin di gemba (“tempat yang sebenarnya”), KPI visual pada papan shop floor, rapat tier harian yang singkat yang meneruskan masalah ke atas organisasi, serta pemecahan masalah yang terstruktur, sehingga penyimpangan terdeteksi setiap hari dan diperbaiki secara tuntas. Gemba walk adalah rutinitas kepemimpinan yang menjadi inti sistem ini.

Hampir setiap produsen memiliki papan tulis berisi angka di suatu tempat. Peter Gelbrich, sebagaimana dikutip dari lembaga pelatihan Jerman CETPM, memperkirakan dari kunjungan ke perusahaan bahwa sekitar 80 persen perusahaan manufaktur memiliki semacam alat visual shop floor management [3]. Jadi pertanyaan sebenarnya bukan lagi apakah Anda memiliki papan, melainkan apakah papan itu berfungsi. Apakah penyimpangan ditangani dalam hitungan jam, bukan minggu? Apakah para pemimpin datang ke gemba dengan pertanyaan atau dengan jawaban? Dan apakah masalah yang tidak dapat diselesaikan tim benar-benar sampai ke tingkat berikutnya pada hari yang sama?

Panduan ini menjelaskan asal-usul dan prinsip-prinsipnya, menguraikan setiap elemen secara rinci, dan menyajikan matriks rapat tier, tata letak papan, panduan gemba walk beserta daftar periksa, standar kerja pemimpin, peta jalan penerapan, serta arsitektur referensi untuk papan shop floor digital yang dibangun dengan Microsoft Teams, Power BI, Power Apps dan Microsoft Fabric. Banyak riset tentang shop floor management berasal dari Jerman, tempat istilah “Shopfloor Management” menjadi kosakata standar di pabrik; panduan ini memanfaatkan sumber-sumber tersebut bila memberi nilai tambah dan menjelaskan konteksnya bagi pembaca AS. Definisi ringkas juga tersedia di halaman entitas [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Poin-poin utama

- Shop floor management adalah sistem kepemimpinan, bukan papan dan bukan perangkat lunak. Sistem ini terdiri dari pemimpin yang hadir di lantai produksi, manajemen visual, sejumlah KPI, ritme rapat yang tetap, pemecahan masalah, dan standar.
- Rapat tier di tingkat tim berlangsung 10 hingga 15 menit dan dijadwalkan secara bertahap sehingga masalah dari shift pertama sampai ke manajer pabrik pada hari yang sama.
- Sebuah papan sebaiknya memuat empat hingga enam KPI yang benar-benar dapat dipengaruhi tim, biasanya disusun menurut SQDCP (safety, quality, delivery, cost, people).
- Gemba walk adalah rutinitas kepemimpinan utama: memiliki topik, mengandalkan observasi dan pertanyaan terbuka, dan selalu diakhiri dengan tindak lanjut.
- Sebuah tindakan baru ditutup ketika dampaknya terlihat pada KPI dan standar telah diperbarui.
- Rutinitas dulu, digital kemudian. Papan digital di Microsoft 365 adalah perangkat bantu; lisensi, interval penyegaran, desain data, dan aturan pemantauan karyawan menentukan besarnya usaha yang diperlukan.

### Jalur baca bagi pembaca yang sibuk

| Anda adalah … | Baca lebih dulu |
|---|---|
| Ketua tim, supervisor, atau shift lead | Bagian 5 (rapat tier), 6 (papan), 9 (gemba walk), 10 (standar kerja pemimpin) |
| Manajer pabrik atau VP operations | Bagian 3 (manfaat), 13 (budaya dan aturan pemantauan karyawan), 14 (penerapan), 15 (kesalahan umum) |
| Admin Microsoft 365 atau Azure | Bagian 16 (analog atau digital), 17 (Microsoft 365 termasuk rencana pembangunan), 18 (integrasi data) |
| Coach Lean, manajer CI, atau ketua proyek | Bagian 4 (elemen), 8 (pemecahan masalah), 14 (peta jalan dengan pemeriksaan tingkat kematangan) |

## Daftar isi

1. [Apa itu manajemen shop floor? Definisi dan ruang lingkup](#apa-itu-manajemen-shop-floor-definisi-dan-ruang-lingkup)
2. [Asal-usul: gemba, genchi genbutsu dan Toyota Production System](#asal-usul-gemba-genchi-genbutsu-dan-toyota-production-system)
3. [Tujuan dan manfaat](#tujuan-dan-manfaat)
4. [Enam elemen manajemen shop floor](#enam-elemen-manajemen-lantai-produksi)
5. [Rapat berjenjang: kaskade harian](#rapat-berjenjang-kaskade-harian)
6. [Papan shop floor: struktur, bidang dan contoh tata letak](#papan-lantai-produksi-struktur-kolom-dan-contoh-tata-letak)
7. [KPI shop floor: memilih metrik SQDCP yang efektif](#kpi-lantai-produksi-memilih-metrik-sqdcp-yang-berhasil)
8. [Pemecahan masalah di shop floor: dari containment hingga standar](#pemecahan-masalah-di-lantai-produksi-dari-containment-hingga-standar)
9. [Gemba walk: langkah, pertanyaan dan daftar periksa](#gemba-walk-langkah-pertanyaan-dan-daftar-periksa)
10. [Standard work pemimpin: kepemimpinan sebagai rutinitas](#standar-kerja-pemimpin-kepemimpinan-sebagai-rutinitas)
11. [Andon: membuat penyimpangan terlihat secara real time](#andon-membuat-penyimpangan-terlihat-secara-real-time)
12. [Peran dan tanggung jawab](#peran-dan-tanggung-jawab)
13. [Budaya, keamanan psikologis dan aturan pemantauan karyawan](#budaya-keamanan-psikologis-dan-aturan-pemantauan-karyawan)
14. [Cara menerapkan manajemen shop floor: peta jalan enam fase](#cara-menerapkan-manajemen-lantai-produksi-peta-jalan-enam-fase)
15. [Kesalahan umum dan cara memperbaikinya](#kesalahan-umum-dan-cara-memperbaikinya)
16. [Analog atau digital? Perbandingan manajemen shop floor digital](#analog-atau-digital-perbandingan-manajemen-shop-floor-digital)
17. [Membangun papan shop floor digital dengan Microsoft 365](#membangun-papan-lantai-produksi-digital-dengan-microsoft-365)
18. [Integrasi data: MES, ERP dan data mesin](#datenintegration-mes-erp-und-maschinendaten)
19. [Dukungan perangkat lunak: contoh iFAKT Polaris](#dukungan-perangkat-lunak-contoh-ifakt-polaris)
20. [Glosarium](#glosarium)
21. [FAQ: manajemen shop floor dan gemba walk](#faq-manajemen-lantai-produksi-dan-gemba-walk)
22. [Kesimpulan](#kesimpulan)

## Apa itu manajemen shop floor? Definisi dan ruang lingkup

Istilah ini menggabungkan "shop floor" (area produksi, secara lebih luas tempat nilai diciptakan) dan "management" (manajemen). Di pabrik-pabrik AS, praktik yang sama sering disebut dengan nama lain: daily management system, tiered accountability, tier meeting, atau huddle board. Gagasan dasarnya tetap sama.

Institut riset Jerman untuk ilmu kerja terapan (ifaa, lembaga riset untuk teknik industri dan ergonomi) menggambarkan manajemen shop floor sebagai kepemimpinan di titik penciptaan nilai, dengan menyatukan tugas perencanaan, pengendalian, perbaikan dan pelaksanaan di shop floor agar pengetahuan "para ahli di lokasi" dapat dimanfaatkan [2]. Asosiasi akademik Jerman untuk teknologi produksi (WGP) menyebutnya sistem manajemen terpadu untuk pengembangan proses dan karyawan secara sistematis di shop floor [4]. Remco Peters, yang bukunya tahun 2009 menjadi referensi standar di negara-negara berbahasa Jerman, menekankan bahwa manajemen shop floor "bukan sekadar alat pengendalian melainkan instrumen kepemimpinan holistik" [1][6].

Tiga karakteristik mengikuti dari definisi-definisi ini dan membedakan manajemen shop floor yang sesungguhnya dari sekadar dinding KPI:

1. **Tempat:** Kepemimpinan terjadi di tempat nilai diciptakan, bukan di ruang rapat.
2. **Ritme:** Komunikasi dijadwalkan, singkat dan terstandar. Komunikasi mengikuti kaskade tetap melalui tingkatan organisasi.
3. **Efek:** Setiap penyimpangan mengarah pada tindakan dengan penanggung jawab dan tenggat waktu, serta efeknya diperiksa.

### Apa yang bukan manajemen shop floor

Dalam praktiknya, manajemen shop floor sering dikacaukan dengan istilah terkait. Di AS khususnya, "shop floor management" juga dipakai oleh vendor ERP dan penjadwalan untuk berarti shop floor control: melepas, mengurutkan dan melacak work order. Tabel di bawah ini memisahkan konsep-konsep tersebut.

| Istilah | Isinya | Hubungan dengan manajemen lantai produksi |
|---|---|---|
| Shop floor control / production control | Penjadwalan urutan, pelepasan order, penyeimbangan kapasitas, pelacakan work order | Subtugas; manajemen lantai produksi memakai hasilnya tetapi merupakan sistem kepemimpinan |
| MES (manufacturing execution system) | Sistem TI untuk mencatat dan mengendalikan produksi | Sumber data dan alat, bukan sistem kepemimpinan itu sendiri |
| Visual management | Membuat status dan penyimpangan terlihat | Salah satu elemen manajemen lantai produksi |
| Gemba walk | Pemimpin pergi ke tempat pekerjaan dilakukan, mengamati dan bertanya | Elemen dan rutinitas kepemimpinan dalam manajemen lantai produksi |
| Continuous improvement / kaizen | Perbaikan dalam langkah kecil dan berkelanjutan | Hasil dan pendorong; manajemen lantai produksi menyediakan platform harian |
| Lean manufacturing | Filosofi menyeluruh untuk menghilangkan pemborosan | Kerangka yang lebih luas; manajemen lantai produksi adalah sistem kepemimpinan hariannya |

Untuk kerangka yang lebih luas, lihat halaman entitas [Lean management](https://www.m365.fm/entity/lean-management/) dan kompendium m365.fm [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/). Di Jerman, kerangka ini sering disebut "sistem produksi holistik" (Ganzheitliches Produktionssystem). Seri pedoman VDI 2870 dari Association of German Engineers (VDI) menjelaskan dasar-dasarnya (Bagian 1, Juli 2012) dan katalog metode (Bagian 2, Februari 2013). VDI telah menggolongkan kedua bagian tersebut sebagai sebagian perlu direvisi, dan edisi baru Bagian 2 sedang disusun [27].

### Lantai produksi, lantai kantor, dan area lainnya

Manajemen lantai produksi dimulai di manufaktur, tetapi dapat diterapkan di area mana pun dengan pekerjaan berulang dan hasil yang dapat diukur: logistik, pemeliharaan, laboratorium, bangsal rumah sakit, layanan pelanggan, teknik. Untuk area tidak langsung, istilah "office floor management" sudah mapan [3]. Prinsipnya tetap sama; KPI-nya yang berubah. Alih-alih output dan scrap, papan menampilkan misalnya lead time kasus, rilis gambar tepat waktu, atau tumpukan tiket.

## Asal-usul: gemba, genchi genbutsu, dan Toyota Production System

### Gemba: "tempat nyata"

"Gemba" (kadang ditulis "genba") adalah bahasa Jepang untuk "tempat yang sebenarnya." Dalam lean, istilah ini berarti tempat di mana pekerjaan yang menciptakan nilai benar-benar dilakukan, biasanya lantai produksi [7][8]. Terkait erat adalah **genchi genbutsu**, kurang lebih "tempat nyata, benda nyata." Lean Lexicon dari Lean Enterprise Institute (LEI) mendefinisikannya sebagai pergi ke sumber untuk memeriksa fakta dengan mata sendiri [8]. Michael Ballé dari LEI membedakannya begini: gemba adalah sebuah tempat, genchi genbutsu adalah sebuah tindakan [8].

Seberapa sentral prinsip ini bagi Toyota terlihat dalam "The Toyota Way 2001." Pada April 2001 Toyota memaparkan dua pilar (perbaikan berkelanjutan dan penghormatan terhadap manusia) dan lima nilai utama. Di samping tantangan, kaizen, penghormatan, dan kerja tim, genchi genbutsu secara eksplisit menjadi salah satunya, diterjemahkan sebagai "pergi ke sumber untuk menemukan fakta" [9].

### Taiichi Ohno dan lingkaran kapur

Taiichi Ohno (1912–1990) dianggap sebagai arsitek Toyota Production System; bukunya "Toyota Production System: Beyond Large-Scale Production" diterbitkan dalam bahasa Inggris oleh Productivity Press pada 1988 [13]. Sebuah kisah terkenal dikaitkan dengannya: konon ia menempatkan insinyur baru di dalam lingkaran yang digambar dengan kapur di lantai produksi dan menyuruh mereka mengamati selama berjam-jam sampai benar-benar melihat masalah dalam proses. Kisah ini mungkin dibumbui [12], tetapi ia menangkap inti persoalannya: pemahaman datang dari pengamatan di lokasi, bukan dari laporan.

### Masaaki Imai dan "Gemba Kaizen"

Masaaki Imai memperkenalkan istilah ini di Barat lewat bukunya "Gemba Kaizen: A Commonsense, Low-Cost Approach to Management" (McGraw-Hill, 1997) [10]. "Aturan emas manajemen gemba" yang terkait berbunyi sebagai berikut dalam ringkasan Kaizen Institute [11]:

1. Ketika muncul masalah, pergi ke gemba terlebih dahulu.
2. Periksa gembutsu (mesin, alat, bahan, bagian cacat).
3. Lakukan tindakan sementara di tempat.
4. Temukan akar penyebabnya.
5. Standarisasi untuk mencegah terulangnya masalah.

Kelima langkah ini masih menjadi cetak biru pemecahan masalah dalam manajemen lantai produksi (lihat bagian 8).

### Suzaki dan penyebaran istilah

Kiyoshi Suzaki dianggap sebagai pelopor istilah "shop floor management" melalui bukunya "The New Shop Floor Management: Empowering People for Continuous Improvement" (Free Press, 1993) [5]. Lembaga pelatihan Jerman CETPM mengutip Constantin May, yang menyebut Suzaki sebagai "bapak shop floor management" [3]. Suzaki menambahkan pada kepemimpinan di lapangan: komunikasi yang baik antara manajer dan karyawan, pemahaman seluruh perusahaan tentang pelanggan, kemampuan untuk belajar, dan tuntutan akan kualitas tertinggi [1]. Di negara-negara berbahasa Jerman, Remco Peters (2009) [6] dan kegiatan di Technische Universität Darmstadt (termasuk Hertle dkk. tentang pengembangan kompetensi dalam shop floor management [26]) membentuk diskusi. Di AS, praktik yang sama menyebar terutama dengan label lean management system, daily management, dan leader standard work, terutama melalui buku David Mann "Creating a Lean Culture" [19].

### Seberapa luas penerapannya saat ini?

Menurut sebuah studi 2018 yang dikutip WGP, sekitar 82,5 persen perusahaan peserta telah menerapkan shop floor management, naik sekitar 20 persen dibandingkan tiga tahun sebelumnya. Metode ini sebagian besar digunakan di produksi dan area terkait, tetapi tidak di semua tingkat hierarki [4]. WGP tidak menyebutkan nama studi tersebut, sehingga sampel dan metodenya tidak dapat diperiksa. Temuan ini menunjukkan masalah inti di banyak pabrik, yang dibahas di bagian 5: papan tingkat tim tanpa kaskade yang berfungsi di atasnya hanya berdampak kecil. Angka representatif AS yang sebanding tidak ditemukan dalam riset untuk artikel ini.

## Tujuan dan manfaat

Shop floor management memiliki lima tujuan yang saling bergantung:

| Tujuan | Yang sebenarnya terjadi | Diukur dengan |
|---|---|---|
| Transparansi | Target dan aktual terlihat oleh semua orang sekilas | Seberapa mutakhir papan, proporsi KPI yang memiliki target |
| Respons cepat | Penyimpangan dikenali dan ditangani dalam satu shift | Waktu dari penyimpangan ke tindakan, waktu tunggu eskalasi |
| Pemecahan masalah yang berkelanjutan | Akar penyebab dihilangkan, bukan gejala | Tingkat pengulangan cacat yang sama |
| Keterlibatan karyawan | Pengetahuan orang yang melakukan pekerjaan mengalir ke dalam keputusan | Jumlah ide yang diterapkan, partisipasi dalam huddle |
| Pengembangan kepemimpinan | Pemimpin beralih dari pemadam kebakaran menjadi pelatih | Proporsi leader standard work yang diselesaikan, tingkat gemba walk |

### Apa buktinya?

Angka yang kuat dan independen tentang manfaat shop floor management jarang ditemukan, karena efeknya sulit dipisahkan dari langkah lean lainnya. Contoh-contoh yang terdokumentasi tetap bermanfaat:

- **fischer (produsen pengencang asal Jerman, fischerwerke):** Setelah proyek sembilan bulan, tingkat keluhan turun 13 persen dan biaya proses turun 9 persen; jumlah pengiriman naik 11 persen, dengan jumlah tenaga kerja yang sama dan tepat waktu [3].
- **Schinko (produsen selungkup logam lembaran asal Austria):** Setelah memperkenalkan shop floor management digital, produktivitas pemotongan naik 20 persen; di pembengkokan, yang sistemnya lebih baru, kenaikannya pada saat laporan adalah 10 persen. Artikel ini ditulis oleh kepala pemasaran vendor perangkat lunak yang terlibat, GFT, dan sebaiknya dibaca dengan pertimbangan tersebut [42].
- **Riset tentang shop floor management digital:** Studi dari Institut wbk Ilmu Produksi di Karlsruhe Institute of Technology (KIT) dan institut IPRI dalam proyek ShopfloorPulse menunjukkan bahwa informasi digital hampir real-time dapat secara "signifikan" mengurangi jeda hingga kerusakan diperbaiki, sementara pelacakan tindakan analog bergantung pada disiplin individu [24][25]. Studi ini didasarkan pada 18 perusahaan dan karena itu merupakan potret kualitatif, bukan survei representatif.

Banyak halaman vendor di google.com mengutip peningkatan yang jauh lebih besar (misalnya produktivitas 25 hingga 35 persen lebih tinggi) tanpa menyebutkan sumbernya. Panduan ini tidak mengulangi angka-angka tersebut. Kesimpulannya yang realistis: shop floor management bukanlah alat dengan ROI yang terjamin, melainkan sistem kepemimpinan yang efeknya bergantung pada seberapa konsisten ia dijalankan. Bagian-bagian berikutnya menunjukkan apa yang menentukan konsistensi tersebut.

## Enam elemen manajemen lantai produksi

Literatur menyusun manajemen lantai produksi dengan cara yang berbeda-beda. ifaa membedakan empat blok bangunan yang terlihat (manajemen visual, KPI, komunikasi standar, pemecahan masalah sistematis) dan tiga fondasi yang "tidak terlihat" (prinsip kerja, pemahaman peran, keberlanjutan) [2]. Peters mengidentifikasi empat elemen inti: memimpin di lokasi, mengenali deviasi, memecahkan masalah secara berkelanjutan, dan memanfaatkan sumber daya secara optimal [1]. WGP menyebut stabilitas dan standardisasi sebagai prasyarat, serta manajemen kinerja, pemecahan masalah dan manajemen perbaikan, kepemimpinan di lokasi, manajemen visual, dan pengembangan kompetensi sebagai elemen manajemen [4]. Banyak halaman berbahasa Inggris AS biasanya mencantumkan lima "pilar" dengan isi yang serupa.

Model berikut menyatukan pandangan-pandangan tersebut dan telah terbukti efektif dalam praktik:

| Elemen | Pertanyaan kunci | Alat utama |
|---|---|---|
| 1. Pemimpin hadir di lantai produksi | Apakah pemimpin melihat kenyataan dengan mata sendiri? | Gemba walk, standar kerja pemimpin |
| 2. Manajemen visual | Dapatkah siapa pun melihat dalam hitungan detik apakah segala sesuatunya sesuai rencana? | Papan lantai produksi, andon, 5S, lampu status |
| 3. KPI | Apakah kita mengukur hal-hal yang dapat dipengaruhi tim? | SQDCP, OEE, first pass yield |
| 4. Ritme rapat (komunikasi berjenjang) | Apakah informasi mengalir andal ke atas dan ke bawah setiap hari? | Rapat berjenjang, aturan eskalasi |
| 5. Pemecahan masalah | Apakah akar penyebab dihilangkan secara tuntas? | PDCA, 5 Whys, diagram tulang ikan (Ishikawa), A3 |
| 6. Standardisasi | Apakah yang telah kita pelajari dikunci dengan baik? | Standar kerja, instruksi kerja |

### Elemen 1: Pemimpin hadir di lantai produksi

LEI menggambarkan pola pikir gemba sebagai berikut: Anda pergi ke gemba untuk memahami pekerjaan, untuk memimpin, dan untuk belajar [15]. Fujio Cho, mantan presiden dan kemudian ketua Toyota, merangkum sikap pemimpin lean dalam tiga keharusan: "Pergi dan lihat, tanyakan mengapa, tunjukkan rasa hormat" [15]. Kehadiran tidak berarti pengendalian; kehadiran berarti dapat dijangkau dan menunjukkan minat. Bagian 9 menjelaskan secara rinci seperti apa kehadiran itu dalam bentuk gemba walk.

### Elemen 2: Manajemen visual

LEI mendefinisikan manajemen visual sebagai penempatan semua alat, suku cadang, aktivitas produksi, dan indikator kinerja "di tempat yang terlihat jelas," sehingga status sistem dapat dipahami sekilas oleh semua pihak yang terlibat [20]. Manajemen visual oleh karena itu jauh lebih dari sekadar papan: penanda lantai, papan bayangan, kartu kanban, lampu andon, dan lampu tumpuk pada mesin semuanya merupakan bagian darinya. [5S](https://www.m365.fm/entity/5s/) sering menjadi fondasinya, karena deviasi hanya menonjol di lingkungan yang tertata. Selengkapnya: [Manajemen visual](https://www.m365.fm/entity/visual-management/).

### Elemen 3: KPI

KPI membuat deviasi menjadi objektif. KPI harus memenuhi tiga kriteria: tim dapat memengaruhinya, datanya tersedia tepat waktu, dan memiliki target. Bagian 7 membahas cara memilihnya. Dasar-dasarnya tersedia di halaman entitas [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) dan dalam kompendium [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Elemen 4: Ritme rapat

Ritme rapat (sumber-sumber berbahasa Jerman menyebutnya "Regelkommunikation", komunikasi standar) berarti rapat singkat, terjadwal, dan terstandar di papan. Ciri khasnya adalah kaskade: informasi dan masalah mengalir dari tingkat tim melalui tingkat departemen ke tingkat pabrik, dan dukungan serta keputusan mengalir kembali [3][58]. Bagian 5 menyediakan matriks lengkap.

### Elemen 5: Pemecahan masalah

Tanpa pemecahan masalah, manajemen lantai produksi merosot menjadi sesi pelaporan. Yang penting adalah memisahkan penahanan cepat dari penghapusan akar penyebab secara permanen. Bagian 8 menelusuri jalur dari titik merah di papan hingga standar yang diperbarui.

### Elemen 6: Standardisasi

Standar merupakan sekaligus prasyarat dan hasil. Tanpa standar tidak ada deviasi, dan tanpa pembaruan standar setiap perbaikan akan hilang lagi. WGP oleh karena itu secara eksplisit menyebut stabilitas dan standardisasi sebagai prasyarat [4]. Selengkapnya: [Standar kerja](https://www.m365.fm/entity/standard-work/).

## Rapat berjenjang: kaskade harian

> **Ringkasnya:** Setiap tingkat mengadakan rapat singkat di papan kerjanya, menyelesaikan apa yang bisa diselesaikan dan meneruskan sisanya ke tingkat berikutnya pada hari yang sama. Itu memerlukan jadwal rapat yang tetap, pemicu eskalasi yang jelas dan kewajiban untuk merespons.

Rapat berjenjang (juga disebut tier meeting, tiered huddle, stand-up atau rapat akuntabilitas harian) adalah tulang punggung ritme rapat. Gagasannya: setiap tingkat mengadakan rapat singkat, meninjau KPI-nya, menyelesaikan apa yang bisa diselesaikan dan mengeskalasi sisanya ke tingkat berikutnya, yang bertemu sedikit kemudian. Kaizen Institute menggambarkan struktur tipikal di AS sebagai empat tingkat, mulai dari tim lini depan (tingkat 1) melalui supervisor (tingkat 2) dan manajer departemen (tingkat 3) hingga kepemimpinan pabrik (tingkat 4), dengan masalah dieskalasi pada hari yang sama kepada pemilik yang ditunjuk [58]. CETPM menggambarkan ritme klasik di pabrik Jerman sebagai harian atau per shift di tingkat tim, mingguan di tingkat departemen dan bulanan atau triwulanan di tingkat pabrik [3]. Di banyak pabrik lean, rapat harian kini juga umum di tingkat 2 dan 3, sehingga masalah dari shift pertama mencapai manajer pabrik pada pagi hari yang sama. Studi ShopfloorPulse menggambarkan struktur yang sama: rapat berjenjang naik dari lantai produksi dalam ritme harian, mingguan atau bulanan [25]. Penjelasan lebih lanjut tentang istilah ini ada di halaman entitas [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### Berapa lama rapat berjenjang sebaiknya berlangsung?

Ada nilai panduan yang terdokumentasi. Gelbrich menyebutkan sekitar 10 hingga 12 menit di tingkat operasional dan 20 hingga 30 menit di tingkat manajemen; Orth menyebutkan 10, paling lama 20 menit untuk rapat stand-up di area tidak langsung; Schwarz menyebutkan maksimal 15 menit dalam contoh praktisnya, tetapi menunjukkan bahwa rapat awal selama peluncuran sering memakan 30 menit atau lebih [3]. Gelbrich menghitung rapat yang berlangsung terlalu lama, terutama selama peluncuran, sebagai salah satu dari sepuluh penyebab paling umum kegagalan shop floor management [3].

### Matriks rapat berjenjang (contoh desain)

Matriks berikut adalah contoh desain untuk pabrik yang beroperasi dengan shift, berdasarkan praktik umum. Ritme dan durasi mengikuti nilai panduan yang terdokumentasi di atas; waktu dan peserta adalah saran yang perlu disesuaikan dengan model shift dan organisasi Anda.

| Fitur | Tingkat 1: tim | Tingkat 2: area / supervisor | Tingkat 3: departemen / manajer produksi | Tingkat 4: pabrik |
|---|---|---|---|---|
| Ritme | setiap shift, saat awal shift | harian | harian (atau mingguan) | harian atau mingguan, plus tinjauan bulanan |
| Waktu (contoh: shift pertama mulai pukul 06.00) | 06.10 hingga 06.30, dibuat bertahap per lini | 08.30 | 09.15 | 10.00 |
| Durasi | 10 hingga 15 menit | 15 menit | 15 hingga 20 menit | 20 hingga 30 menit |
| Lokasi | papan di lini | papan area | papan departemen di lantai produksi | papan pabrik (ruang obeya atau di lantai produksi) |
| Fasilitator | team leader | supervisor / shift lead | manajer produksi atau departemen | manajer pabrik |
| Peserta | tim dari lini atau sel | team leader area, maintenance dan quality sesuai kebutuhan | supervisor, perwakilan quality, maintenance, logistik, EHS (environment, health and safety) | kepala departemen, fungsi pendukung (quality, supply chain, purchasing, HR, finance) |
| Horizon waktu | shift terakhir, shift berjalan | 24 jam terakhir, hari ini | kemarin, hari ini, minggu ini | minggu, bulan, tren |
| KPI umum | kejadian keselamatan, target vs. aktual unit per jam, scrap, downtime, kehadiran | output, OEE bottleneck, first pass yield, backlog | on-time delivery, cost of quality, produktivitas, eskalasi terbuka | tampilan SQDCP pabrik, keluhan pelanggan, biaya, status proyek |
| Keputusan | penugasan personel, containment, ide | realokasi orang antarlini, prioritas maintenance | sumber daya lintas area, shift tambahan, tim pemecahan masalah | belanja modal, prioritas, perubahan target |
| Eskalasi ke atas ketika | masalah tidak dapat diselesaikan dalam shift atau sumber daya tidak tersedia | masalah memengaruhi beberapa lini atau memerlukan fungsi pendukung | masalah memengaruhi pelanggan, anggaran atau beberapa departemen | korporat, pelanggan, pemasok |

**Shift kedua dan ketiga:** Tingkat 1 berjalan setiap shift; tingkat 2 hingga 4 biasanya hanya pada siang hari. Agar isu dari shift kedua dan ketiga tidak hilang, shift lead memasukkan eskalasi yang masih terbuka ke papan atau log shift dan menyerahkannya secara langsung kepada shift pertama. Rapat tingkat 2 pagi hari dimulai dengan butir-butir ini.

### Aturan eskalasi yang efektif

Kaskade hanya sebaik aturan eskalasinya. Empat prinsip telah terbukti efektif:

1. **Pemicu yang jelas, bukan perasaan semata.** Tentukan untuk setiap KPI kapan harus dieskalasi, misalnya: "lini berhenti lebih dari 30 menit," "scrap melebihi batas dalam dua jam berturut-turut," "cedera atau nyaris celaka: selalu."
2. **Waktu yang saling terkait.** Rapat tingkat yang lebih tinggi dilaksanakan setelah rapat tingkat yang lebih rendah, sehingga eskalasi sampai pada hari yang sama. Fasilitator rapat tingkat bawah meneruskan eskalasi secara langsung atau melalui papan.
3. **Kewajiban untuk menanggapi.** Setiap eskalasi mendapat jawaban, paling lambat pada rapat berikutnya di tingkat bawah. Diam adalah cara tercepat untuk menghancurkan budaya eskalasi.
4. **Keselamatan didahulukan.** Masalah keselamatan dieskalasi segera, terlepas dari alur berjenjang.

CETPM menggambarkan terputusnya hubungan antartingkat manajemen lantai produksi sebagai hambatan yang khas [3]. Hal ini sejalan dengan studi KIT dan IPRI: ketika tindakan dicatat di atas kertas, eskalasi ke tingkat yang lebih tinggi terhenti dan pelacakan tindakan "bergantung pada disiplin individu" [24].

### Agenda standar rapat tingkat 1 (maksimal 15 menit)

Agenda memakai batas atas 15 menit. Tim yang sudah terlatih menyelesaikannya dalam 10 hingga 12 menit, kisaran yang disebut Gelbrich untuk tingkat operasional [3].

| Menit | Butir | Pertanyaan panduan |
|---|---|---|
| 0–2 | Keselamatan | Adakah cedera, nyaris celaka, atau kondisi tidak aman? |
| 2–6 | KPI kemarin / shift terakhir | Di mana kita merah, dan mengapa? |
| 6–9 | Rencana hari ini | Berapa target hari ini? Adakah kendala pada orang, material, peralatan? |
| 9–12 | Tindakan | Tindakan terbuka mana yang jatuh tempo, apa yang sudah selesai, apa yang perlu bantuan? |
| 12–14 | Eskalasi | Apa yang kita teruskan ke tingkat 2? |
| 14–15 | Penutup | Siapa melakukan apa, paling lambat kapan? Adakah pengakuan atas kerja yang baik? |

Penting: rapat tingkat menamai masalah, menetapkan penanggung jawab, dan menyepakati penahanan (containment). Analisis akar penyebab dilakukan kemudian, dalam kelompok kecil tepat di dekat peralatan.

## Papan lantai produksi: struktur, kolom, dan contoh tata letak

> **Ringkasnya:** Papan yang baik dapat dibaca dari jarak sekitar 10 kaki (3 m), menampilkan empat hingga enam KPI dengan target, mengikuti agenda rapat dari kiri ke kanan, dan menghubungkan setiap KPI merah dengan suatu tindakan. Tim memeliharanya sendiri.

Papan lantai produksi (juga disebut huddle board, tier board, SQDCP board, atau performance board) adalah alat utama dari ritme rapat. ifaa menjelaskan tugasnya sebagai berikut: papan ini memvisualisasikan KPI terpilih dari suatu area, menampilkan tindakan perbaikan beserta statusnya agar pengaruhnya terhadap KPI dapat dilacak, dan memuat informasi kendali harian, terutama situasi pesanan dan kapasitas terkini [2]. Sebagai contoh kategori, ifaa menyebutkan mutu, biaya, logistik, keselamatan, personel, kapasitas, dan situasi pesanan, serta sasaran dan tindakan (perbaikan berkelanjutan); contoh KPI meliputi first pass yield, tingkat ppm, OEE, on-time delivery, angka kecelakaan, status 5S, dan tingkat kehadiran [2].

### Aturan desain

- **Dapat dibaca dari jarak sekitar 10 kaki (3 m):** Status merah/hijau dan angka besar, bukan tabel dengan 30 kolom.
- **Empat hingga enam KPI:** CETPM merekomendasikan sekitar empat hingga enam KPI yang dapat dipengaruhi tim [3]; lembaga pelatihan Jerman Haufe Akademie menyebut lima hingga tujuh sebagai batas atas [43].
- **Target di samping aktual:** Setiap KPI memiliki target dan tren.
- **Ceritakan dari kiri ke kanan:** Papan mengikuti agenda rapat, sehingga fasilitator cukup bergerak dari kiri ke kanan.
- **Tindakan terlihat:** Setiap KPI merah dihubungkan dengan suatu tindakan atau lembar penyelesaian masalah.
- **Dimiliki tim:** Tim memelihara papan itu sendiri. Papan yang diisi oleh keuangan atau TI, yang tidak dipahami siapa pun di tim, akan diabaikan.

### Contoh tata letak papan tingkat 1

Tata letak berikut menunjukkan papan untuk lini perakitan dengan tiga baris dan lima kolom. Papan ini berfungsi sama baiknya di papan tulis (sekitar 6,5 × 4 kaki, atau 2 × 1,2 m) maupun di layar.

| | Kolom A: Keselamatan (S) | Kolom B: Kualitas (Q) | Kolom C: Pengiriman (D) | Kolom D: Biaya / produktivitas (C) | Kolom E: Sumber daya manusia (P) |
|---|---|---|---|---|---|
| **Baris 1: status hari ini** | Kalender silang keselamatan (bulanan, tiap hari hijau, kuning atau merah) | Scrap dan rework per shift vs. target | Target rencana harian vs. aktual, backlog | Target unit per jam vs. aktual (grafik per jam) | Kehadiran, matriks keterampilan (siapa bisa melakukan apa) |
| **Baris 2: tren** | Near miss selama 4 minggu terakhir | First pass yield, 3 jenis cacat teratas (Pareto) | On-time delivery minggu ini | OEE pada bottleneck, 3 penyebab downtime teratas, [micro stops](https://www.m365.fm/entity/micro-stops/) | Rencana cuti dan pelatihan |
| **Baris 3: tindakan** | Tindakan keselamatan yang masih terbuka | Lembar pemecahan masalah / A3 yang sedang berjalan | Eskalasi ke tier 2 dan tanggapannya | Daftar tindakan (apa, siapa, sampai kapan, status) | Ide dan saran beserta statusnya |

Sebagian besar papan juga memiliki header dengan nama tim, target area, dan waktu pembaruan terakhir, serta kolom "standar dan audit" (misalnya hasil audit 5S terakhir). Catatan tentang urutan kolom: versi asli Jerman dari panduan ini menggunakan SQCDP, yang menempatkan biaya sebelum pengiriman; pabrik di AS lebih sering menulis SQDCP. Urutan C dan D kurang penting dibandingkan menempatkan keselamatan di urutan pertama.

### Isi papan menurut level

Pada setiap level, papan menjadi lebih teragregasi dan horizon waktunya lebih panjang. Vendor MES Symestic menggambarkan hal ini sebagai dua aturan konsistensi: KPI diringkas dan ditinjau lebih jarang seiring naiknya level, tetapi harus dapat ditelusuri kembali ke data yang sama di setiap level [41].

| Level | Detail | Horizon waktu tipikal | Contoh kualitas |
|---|---|---|---|
| Tier 1 | stasiun, jam | shift | cacat per jam di stasiun 3 |
| Tier 2 | lini, shift | hari | scrap rate per lini |
| Tier 3 | area, hari | minggu | first pass yield dan cost of quality per area |
| Tier 4 | pabrik, minggu | bulan | keluhan pelanggan dalam ppm, cost of poor quality |

## KPI lantai produksi: memilih metrik SQDCP yang berhasil

Sebagian besar papan mengikuti urutan dimensi yang tetap. Yang paling umum adalah **SQDCP** (atau SQCDP): safety (keselamatan), quality (kualitas), delivery (pengiriman), cost (biaya) dan people (sumber daya manusia) [41]. Varian yang ada adalah SQDC (tanpa P), SQDCM (M untuk morale) atau SQDCE dengan environment. CETPM mencantumkan topik keselamatan, kualitas, biaya, keandalan pengiriman dan sumber daya manusia sebagai dimensi tipikal [3]. Urutannya disengaja: keselamatan selalu di urutan pertama.

### Tiga pertanyaan panduan untuk memilih KPI

Gelbrich menyarankan tiga pertanyaan yang dapat digunakan untuk menurunkan KPI yang sesuai [3]:

1. Seperti apa keluaran proses saya dari sisi waktu dan kualitas?
2. Bagaimana saya dapat menunjukkan efisiensi tindakan saya dari sisi biaya dan sumber daya?
3. Apa yang mencerminkan pelaksanaan proses saya yang bertanggung jawab dari sisi keselamatan dan lingkungan?

Prinsip utamanya, yang dirumuskan sebagai variasi dari kutipan terkenal Drucker: apa yang tidak dapat dipengaruhi tim tidak boleh diukur di papan mereka [3].

### Katalog KPI untuk papan lantai produksi

| Dimensi | KPI | Definisi / perhitungan | Tier |
|---|---|---|---|
| S | Hari sejak cedera tercatat terakhir | hari kalender sejak kasus yang dapat dicatat OSHA terakhir (lihat catatan di bawah) | 1–4 |
| S | Total recordable incident rate (TRIR) | jumlah cedera dan penyakit yang dapat dicatat × 200.000 / total jam kerja; 200.000 jam setara dengan 100 pekerja penuh waktu selama setahun [51] | 3–4 |
| S | Near miss (dilaporkan) | laporan per minggu (lebih banyak laporan pada awalnya merupakan tanda baik) | 1–3 |
| Q | Scrap rate | jumlah scrap / total jumlah; lihat [scrap rate](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | First pass yield (FPY) | part baik pada percobaan pertama / part yang dimulai | 1–3 |
| Q | Keluhan pelanggan | jumlah atau ppm | 3–4 |
| D | Target vs. aktual unit | per jam atau per shift | 1–2 |
| D | On-time delivery | pesanan yang dikirim tepat waktu / seluruh pesanan | 2–4 |
| D | Backlog | jumlah terbuka vs. rencana | 1–3 |
| C | OEE | availability × performance × quality [22] | 1–3 |
| C | Produktivitas | part baik per jam kerja | 2–4 |
| C | Waktu changeover | waktu dari part baik terakhir hingga part baik pertama pada order berikutnya | 1–2 |
| P | Kehadiran / staffing | karyawan hadir / karyawan terjadwal | 1–2 |
| P | Tingkat cross-training | proporsi tugas yang tercakup dalam matriks keterampilan | 1–2 |
| P | Ide yang diimplementasikan | saran perbaikan yang diimplementasikan per bulan | 1–3 |

**Catatan tentang KPI keselamatan di pabrik AS:** Penghitung "hari tanpa cedera" sangat populer, tetapi OSHA telah memperingatkan bahwa insentif berbasis rasio (misalnya, hadiah untuk bulan tanpa cedera) dapat mengurangi pelaporan. Dalam memorandum OSHA tanggal 11 Oktober 2018, OSHA menyatakan bahwa program semacam itu diperbolehkan berdasarkan 29 CFR 1904.35(b)(1)(iv) hanya jika tidak diterapkan dengan cara yang mengurangi pelaporan, dan bahwa kebijakan anti-pembalasan saja "mungkin, dengan sendirinya, tidak memadai" [50]. OSHA merekomendasikan proses untuk melaporkan cedera, penyakit, kejadian nyaris celaka (close calls/near misses), dan bahaya, termasuk opsi anonim [49]. Bagi dewan direksi, ini berarti: tampilkan kejadian nyaris celaka dan laporan bahaya di samping jumlah cedera, dan jangan pernah mengaitkan hadiah tim hanya dengan catatan keselamatan yang bersih.

OEE (overall equipment effectiveness) berasal dari total productive maintenance; LEI menyebutkan enam kerugian besar: kerusakan, setup dan penyesuaian, henti kecil, pengurangan kecepatan, scrap dan rework [22]. Pada papan kendali, angka OEE itu sendiri kurang penting dibandingkan rincian menurut jenis kerugian, karena tim dapat menurunkan tindakan dari rincian tersebut. Kompendium m365.fm [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) membahas metrik-metrik ini secara mendalam.

### Temuan riset tentang KPI dalam manajemen lantai produksi

Dalam studi KIT dan IPRI, 94 persen perusahaan yang disurvei melacak KPI kualitas dan produktivitas dalam manajemen lantai produksi, sedangkan KPI biaya jarang digunakan [24][25]. Penggunaan KPI digital hampir real-time merupakan pengecualian, yaitu sedikit di atas 15 persen dari penyebutan, dan peramalan deviasi tidak menjadi kenyataan di perusahaan mana pun yang disurvei [24].

## Pemecahan masalah di lantai produksi: dari containment hingga standar

Kolom merah pada papan kendali adalah awal, bukan akhir. Pemecahan masalah dalam manajemen lantai produksi mengikuti pola yang diturunkan langsung dari aturan emas manajemen gemba [11]:

| Langkah | Yang terjadi | Siapa | Kapan |
|---|---|---|---|
| 1. Deteksi | Deviasi terlihat pada papan kendali atau melalui andon | tim | segera atau dalam rapat tingkat |
| 2. Containment | Containment melindungi pelanggan (mis. inspeksi 100 persen, karantina, suku cadang pengganti) | pemimpin tim | dalam shift yang sama |
| 3. Memahami | Periksa gembutsu di lokasi, kumpulkan data, amati proses | tim kecil di peralatan | setelah rapat |
| 4. Menemukan akar masalah | 5 Whys, diagram fishbone, A3 untuk masalah kompleks | tim pemecahan masalah | hari hingga minggu |
| 5. Memperbaiki | Terapkan tindakan korektif permanen | pemilik per daftar tindakan | sesuai rencana |
| 6. Verifikasi efek | Pantau KPI selama periode yang ditentukan | pemimpin tim | setelah penerapan |
| 7. Standarisasi | Perbarui standar, instruksi kerja, dan pelatihan; bagikan ke seluruh lini (yokoten) | supervisor, pemilik proses | setelah efek terbukti |

Suatu tindakan dianggap selesai hanya ketika efeknya terlihat pada KPI. Aturan ini terdengar sepele, tetapi banyak pabrik melanggarnya: daftar tindakan dilaporkan "hijau" sementara cacat itu kembali pada minggu berikutnya.

### Metode mana untuk masalah apa?

| Jenis masalah | Karakteristik | Metode | Waktu yang dibutuhkan |
|---|---|---|---|
| Sederhana, penyebab jelas | penyebab dan perbaikan jelas dalam rapat | tindakan langsung dengan tenggat | menit |
| Berulang, penyebab belum jelas | terjadi berulang kali, tim tidak yakin penyebabnya | 5 Whys, fishbone | jam |
| Kompleks, lintas fungsi | beberapa penyebab, beberapa departemen | pemecahan masalah A3 berbasis PDCA | minggu |
| Sistemik, strategis | memengaruhi value stream, tata letak, produk | kegiatan kaizen, value stream mapping | minggu hingga bulan |

A3 sangat berharga karena menempatkan masalah, kondisi saat ini, analisis akar masalah, kondisi target, tindakan korektif, dan tindak lanjut pada satu lembar kertas A3 (297 × 420 mm, mendekati format tabloid 11 × 17 in. di AS yang digunakan sebagian besar pabrik AS). Halaman entitas [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) menawarkan pengantar, dan kompendium [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) membahas tingkat sistemik. Siklus PDCA (plan, do, check, act), yang biasanya dikaitkan dengan W. Edwards Deming (Deming sendiri memberi kredit kepada Walter A. Shewhart), menjadi dasar dari semua proses pemecahan masalah [1].

## Gemba walk: langkah, pertanyaan, dan daftar periksa

> **Singkatnya:** Gemba walk memiliki topik, dimulai di papan, mengamati pekerjaan selama beberapa siklus, mengajukan pertanyaan terbuka, dan diakhiri dengan umpan balik yang disepakati kepada tim. Tanpa topik dan tindak lanjut, kegiatan ini hanya jalan-jalan biasa.

Gemba walk adalah rutinitas kepemimpinan yang paling penting dalam manajemen lantai produksi. Lean Lexicon mendefinisikannya sebagai "praktik manajemen untuk memahami situasi terkini melalui pengamatan langsung dan pertanyaan sebelum mengambil tindakan" [7]. Pengantar ringkas juga tersedia dalam posting [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) dan di halaman entitas [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Tiga jenis gemba walk

Jim Womack, pendiri LEI, menyatakan bahwa dia dan Dan Jones pertama kali menggunakan istilah "gemba walk" pada awal 1990-an, awalnya untuk manajer yang menelusuri seluruh value stream suatu produk lintas departemen dan perusahaan [14]. Saat ini Womack membedakan dua bentuk dan memisahkan satu penggunaan ketiga yang kini sudah meluas [14]:

| Jenis | Tujuan | Frekuensi umum | Siapa |
|---|---|---|---|
| Value stream walk | meningkatkan kesadaran akan perbaikan fundamental dari ujung ke ujung | sesuai kebutuhan, misalnya triwulanan | pimpinan pabrik dan area, semua fungsi di sepanjang value stream |
| Management system walk | memeriksa apakah sistem manajemen mampu menjaga stabilitas (papan, standar, eskalasi) | mingguan hingga harian | pimpinan di semua tingkat |
| Problem-focused walk (genchi genbutsu) | menuntaskan masalah spesifik di lokasi | sesuai kebutuhan | pemilik masalah, spesialis |

Womack mengkritik penggunaan ketiga dan menempatkannya dekat dengan "management by walking around": jika manajemen harian berjalan dengan baik, masalah seharusnya sudah terpecahkan dalam cascade, bukan manajer puncak dan staf perbaikan bergegas ke gemba untuk memadamkan api. Waktu mereka lebih baik diinvestasikan pada value stream walk dan management system walk [14].

### Tiga pertanyaan panduan LEI: tujuan, proses, orang

LEI merekomendasikan agar gemba walk disusun di sekitar tiga dimensi [7]:

1. **Tujuan:** Masalah apa yang diselesaikan proses ini bagi pelanggan?
2. **Proses:** Bagaimana pekerjaan sebenarnya berjalan, dibandingkan dengan cara standar menggambarkannya?
3. **Orang:** Apakah karyawan terlibat dalam menciptakan, mempertahankan, dan memperbaiki proses?

LEI juga merekomendasikan untuk mengikuti satu product family atau proses yang berhadapan dengan pelanggan dari awal hingga akhir, dan melibatkan semua pihak terkait, karena nilai mengalir secara horizontal lintas departemen [7].

### Gemba walk vs. management by walking around

Gemba walk sering disamakan dengan "management by walking around" (MBWA). MBWA berawal di Hewlett-Packard; salah satu pendirinya, David Packard, telah mempelajari praktik ini di General Electric. Praktik ini menjadi terkenal melalui buku "In Search of Excellence" karya Tom Peters dan Robert Waterman (1982) [16]. Perbedaannya masih cukup besar:

| Aspek | Gemba walk | Management by walking around |
|---|---|---|
| Tujuan | memahami proses, mengenali penyimpangan dari standar, membangun kemampuan pemecahan masalah | kedekatan dengan karyawan, pertukaran informal, merasakan suasana |
| Struktur | topik, rute, pertanyaan panduan, tindak lanjut | sebagian besar tidak terstruktur dan spontan |
| Titik acuan | standar, KPI, papan | orang dan percakapan |
| Hasil | pengamatan spesifik, coaching, tindakan | hubungan, informasi |
| Berlandaskan pada | standard work pemimpin, ritme tetap | gaya kepemimpinan pribadi |

Keduanya tidak saling meniadakan: obrolan informal sambil lalu tidak menggantikan gemba walk, tetapi juga tidak merugikannya. Posting [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) membandingkan kedua konsep ini secara lebih rinci.

### Cara melakukan gemba walk dalam tujuh langkah

**1. Tetapkan topik.** Setiap gemba walk memiliki fokus, misalnya "changeover di lini 4," "penggunaan instruksi inspeksi yang baru," atau "dampak tindakan dari rapat tier 3." Tanpa topik, kegiatan ini menjadi sekadar tur.

**2. Persiapkan.** Tinjau KPI dan papan area, periksa tindakan yang masih terbuka, bawa standar (instruksi kerja, lembar standard work). Beri tahu tim sebelumnya agar kunjungan tidak dianggap sebagai inspeksi mendadak. Posting [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) berisi tipsnya.

**3. Mulai di papan.** Papan menunjukkan apa yang menurut tim itu sendiri sebagai masalah. Tanyakan: "Apa yang disampaikan papan kalian hari ini?"

**4. Amati.** Tetaplah di satu stasiun kerja dan amati beberapa siklus. Bandingkan apa yang Anda lihat dengan standar. Catat fakta, bukan interpretasi.

**5. Ajukan pertanyaan.** Ajukan pertanyaan terbuka dan penuh hormat kepada orang yang melakukan pekerjaan. Jangan memberikan solusi begitu saja.

**6. Rangkum dan ucapkan terima kasih.** Di akhir, sampaikan kembali secara singkat apa yang Anda pelajari dan sepakati apa yang akan terjadi dengan hasil pengamatan tersebut.

**7. Tindak lanjut.** Dokumentasikan pengamatan, masukkan tindakan ke rapat tingkat yang tepat, dan berikan umpan balik kepada tim. Walk tanpa umpan balik merusak kepercayaan.

**Jangan lupakan shift kedua dan ketiga.** Di pabrik dengan tiga shift, pemimpin yang hanya berkeliling pada shift siang hanya melihat sepertiga operasi. Jadwalkan walk pada shift non-siang setidaknya sesekali; masalah terkait staffing, dukungan pemeliharaan, dan serah terima sering muncul di sana lebih dulu (rekomendasi praktik).

**Berapa lama gemba walk sebaiknya berlangsung?** Sumber yang digunakan di sini tidak memberikan nilai tetap. Dalam praktiknya, walk sistem manajemen yang terfokus di satu area memakan waktu 20 sampai 45 menit; walk aliran nilai di seluruh keluarga produk bisa memakan waktu setengah hari. Contoh hari di bagian 10 merencanakan 30 menit. Ini adalah nilai praktik, bukan pernyataan sumber.

### Bank pertanyaan gemba walk

**Tujuan dan sasaran**
- Siapa pelanggan dari proses ini, dan apa yang mereka butuhkan?
- Apa target shift Anda hari ini, dan bagaimana Anda tahu apakah target itu tercapai?
- KPI mana yang paling penting bagi Anda saat ini, dan mengapa?

**Proses dan standar**
- Bagaimana langkah ini biasanya berjalan? Bisakah Anda menunjukkannya?
- Di mana standar tertulis, dan apakah sesuai dengan kenyataan?
- Bagaimana Anda bisa langsung tahu ketika ada yang tidak beres di sini?
- Apa yang terjadi ketika material kurang atau mesin berhenti?
- Di mana Anda menunggu, mencari barang, atau harus mengerjakan ulang sesuatu?

**Masalah dan pemecahan masalah**
- Apa masalah terakhir yang Anda selesaikan di sini?
- Masalah mana yang saat ini paling banyak menghabiskan waktu Anda?
- Apa yang terjadi ketika Anda melaporkan masalah? Seberapa cepat bantuan datang?
- Tindakan mana di papan yang sudah lewat tenggat, dan apa yang dibutuhkannya?

**Orang**
- Apa yang menghalangi Anda untuk bekerja dengan baik?
- Apa yang akan Anda ubah jika keputusan ada di tangan Anda?
- Siapa selain Anda yang bisa mengerjakan tugas ini?
- Apa yang bisa saya lakukan untuk mendukung Anda?

### Daftar periksa gemba walk

Cetak atau ubah menjadi formulir digital (lihat bagian 17). Versi yang lebih panjang dengan pertanyaan khusus peran ada di posting [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] Topik dan area sudah ditetapkan.
- [ ] KPI, status papan, dan tindakan terbuka sudah ditinjau sebelumnya.
- [ ] Standar yang relevan tersedia (dicetak atau di tablet).
- [ ] Tim atau pemimpin tim sudah diberi tahu.
- [ ] Alat pelindung diri (APD) dan aturan keselamatan area dipatuhi.
- [ ] Setidaknya satu stasiun kerja diamati selama beberapa siklus.
- [ ] Pertanyaan bersifat terbuka; tidak ada solusi yang didiktekan.
- [ ] Pengamatan dicatat sebagai fakta (tempat, waktu, apa yang terlihat).
- [ ] Praktik baik diakui.
- [ ] Kesepakatan dirangkum.
- [ ] Tindakan dimasukkan ke daftar tindakan atau rapat tingkat berikutnya.
- [ ] Umpan balik kepada tim dijadwalkan.

### Kesalahan umum gemba walk

| Kesalahan | Mengapa merugikan | Lebih baik |
|---|---|---|
| Gemba walk sebagai inspeksi | orang menyembunyikan masalah | bertanya alih-alih mengaudit; anggap masalah sebagai pemberian |
| Mendikte solusi di tempat | tim berhenti belajar memecahkan masalah, pemimpin menjadi hambatan | bimbing dengan pertanyaan, biarkan tim mengembangkan solusi |
| Tanpa topik, tanpa rute | walk tetap dangkal | tetapkan fokus, bawa standarnya |
| Hanya pemimpin yang berbicara | pengetahuan para ahli tidak terpakai | dengarkan 80 persen waktu |
| Tanpa tindak lanjut | hilangnya kepercayaan, "toh tidak pernah ada yang terjadi" | umpan balik dalam satu minggu |
| Walk tidak teratur | walk terlihat seperti acara khusus | ritme tetap dalam standard work pemimpin |
| Menyalahkan | rasa takut, masalah disembunyikan | pertanyakan proses dan sistem, bukan orang |

Banyak dari kesalahan ini memiliki akar penyebab yang sama: walk dipahami sebagai kontrol. Posting [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) membahasnya lebih dalam. Womack menggambarkan sikapnya sendiri seperti ini: "I've never invented anything. I just take walks, comment on what I see, and give courage to people to try" (sebagaimana dikutip dalam kata pengantar oleh John Shook) [15].

## Standar kerja pemimpin: kepemimpinan sebagai rutinitas

Standar kerja pemimpin menerapkan prinsip standar kerja kepada para pemimpin. LEI menggambarkannya sebagai "kaizen untuk manajemen": dikombinasikan dengan perilaku kepemimpinan yang tepat, standar kerja pemimpin menggeser peran manajer dari pemecah masalah utama menuju pembangunan kemampuan pemecahan masalah pada timnya [18].

Dalam "Creating a Lean Culture," David Mann menyebutkan empat elemen utama sistem manajemen lean: standar kerja pemimpin, kendali visual, proses akuntabilitas harian, dan disiplin kepemimpinan [19]. Porsi pekerjaan yang distandarisasi menurun seiring naiknya tingkat hierarki: operator dapat bekerja sesuai standar 100 persen dari waktu, seorang supervisor sekitar 80 persen dari hari kerja; di tingkat yang lebih tinggi, porsinya turun lebih jauh [19].

### Contoh: standar kerja pemimpin untuk supervisor produksi

| Waktu | Aktivitas | Bukti |
|---|---|---|
| 06.00–06.10 | Serah terima shift, pemeriksaan papan di semua lini | Log serah terima yang ditandatangani |
| 06.10–06.30 | Menghadiri dua dari rapat tier 1 yang bertahap (bergilir) | Daftar kehadiran |
| 06.30–06.45 | Konfirmasi proses: memeriksa satu standar pada satu lini | Kartu audit |
| 06.45–08.15 | Hadir di lantai produksi: membantu saat terjadi kerusakan, mengatasi kekurangan material dan personel, memeriksa papan | Catatan, daftar tindakan |
| 08.30–08.45 | Memfasilitasi rapat tier 2 | Papan tier 2 |
| 08.45–09.00 | Menyiapkan eskalasi untuk tier 3 | Daftar eskalasi |
| 09.15–09.35 | Menghadiri rapat tier 3 | Papan tier 3 |
| 10.00–11.00 | Membimbing tim pemecahan masalah (A3) | Status A3 |
| 13.00–13.30 | Gemba walk pada topik fokus | Catatan, tindakan |
| 13.30–14.00 | Menyiapkan serah terima shift | Log serah terima |

Rencana ini adalah contoh praktik, bukan pernyataan sumber. Pada shift pukul 06.00 hingga 14.00, rencana ini menyusun lebih dari dua pertiga hari kerja; Mann menggambarkan sekitar 80 persen sebagai sesuatu yang dapat dicapai pada tingkat ini [19]. Sisanya sengaja dibiarkan terbuka untuk hal-hal tak terduga, persoalan personel, dan proyek. Standar kerja pemimpin itu sendiri terlihat jelas: banyak pabrik memasang rutinitas standar para pemimpin mereka di papan dan mencentang item yang telah diselesaikan. Hal itu menciptakan akuntabilitas di kedua arah.

### Konfirmasi proses (layered process audit)

Salah satu elemen utama standar kerja pemimpin adalah konfirmasi proses: para pemimpin di berbagai tingkat memeriksa secara singkat dan dengan ritme tetap apakah suatu standar diikuti dan apakah standar tersebut masih sesuai. Beberapa tingkat memeriksa proses yang sama dengan frekuensi berbeda, misalnya ketua tim setiap hari, supervisor setiap minggu, dan manajer pabrik setiap bulan. Di pabrik-pabrik AS, terutama dalam rantai pasok otomotif, praktik ini biasanya dikenal dengan nama layered process audit (LPA). Penyimpangan tidak dihukum; penyimpangan diperlakukan sebagai tanda bahwa standar tidak sesuai atau pelatihan belum memadai.

## Andon: membuat penyimpangan terlihat secara real time

LEI mendefinisikan andon sebagai alat manajemen visual yang menunjukkan status operasi di suatu area sekilas dan memberi sinyal setiap kali terjadi ketidaknormalan [17]. Sinyal dipicu oleh tali tarik atau tombol di stasiun kerja, atau secara otomatis oleh sensor mesin. Di Toyota, lini tetap berjalan setelah tali ditarik sementara tim berupaya memperbaiki masalah; jika tidak berhasil dalam siklus tersebut, lini berhenti pada posisi tetap di ujung stasiun [17]. Nomor stasiun yang menyala memanggil team leader, yang diharapkan segera merespons [17].

Dalam shop floor management, andon menjembatani celah antara rapat yang terjadwal: rapat tier melihat hari kemarin dan merencanakan hari ini, sedangkan andon menangani saat ini juga. Di Toyota, seorang team leader (hancho) memimpin tim beranggotakan lima sampai delapan orang, merespons penghentian lini dan panggilan andon, memimpin kegiatan perbaikan, dan memeriksa kepatuhan terhadap standard work setiap hari dengan lembar audit [21]. Hal ini penting saat mentransfer model ke pabrik di Barat: team leader Toyota adalah karyawan per jam tanpa wewenang disipliner dan tanpa posisi tetap di lini; mereka menguasai seluruh tugas tim dan menggantikan saat istirahat, ketidakhadiran, atau tumpukan pekerjaan [21]. Jika peran ini ditambahkan pada lead operator yang sepenuhnya terikat pada cycle time lini, respons andon tidak akan cepat. Hal yang sama berlaku untuk team leader yang bertanggung jawab atas 25 orang.

Kejadian andon harus ditampilkan di papan: jumlah panggilan per shift, rata-rata waktu respons, dan alasan yang paling sering terjadi. Banyak panggilan pada awalnya bukan tanda buruk; itu menunjukkan bahwa tim sedang membuat masalah menjadi terlihat.

## Peran dan tanggung jawab

| Peran | Tugas dalam shop floor management |
|---|---|
| Plant manager | menjadi teladan, memfasilitasi tier 4, rutin turun ke gemba, memutuskan sumber daya untuk eskalasi, menyebarkan sasaran (misalnya melalui hoshin kanri) |
| Department / production manager | memfasilitasi tier 3, membina supervisor, memastikan tingkatan saling terhubung |
| Supervisor / shift lead | memfasilitasi tier 2, process confirmation, membina team leader |
| Team leader | memfasilitasi tier 1, memelihara papan bersama tim, merespons andon, menerapkan containment |
| Operator dan teknisi | melaporkan penyimpangan, menyumbang ide, memiliki tindakan, memelihara bagian papan |
| Fungsi pendukung (quality, maintenance, supply chain, EHS) | hadir di tier 2 dan 3, menangani masalah yang dieskalasi, menyediakan data |
| Shop floor coach / spesialis lean atau CI | hadir dalam rapat, memberi umpan balik tentang fasilitasi, melatih problem solving |
| Perwakilan karyawan (serikat pekerja, komite keselamatan; di Jerman dewan pekerja) | dilibatkan sejak awal; memastikan KPI tidak digunakan untuk memantau perilaku atau kinerja individu (lihat bagian 13) |

CETPM menggambarkan shop floor coach yang mengamati rapat dan memberi umpan balik setelahnya [3]. Peran ini sering diremehkan selama rollout: team leader yang belum pernah memfasilitasi rapat membutuhkan umpan balik yang konkret pada minggu-minggu pertama.

### Bagaimana peran pemimpin berubah

| Sebelumnya | Dalam shop floor management |
|---|---|
| memecahkan masalah secara pribadi | mengembangkan kemampuan problem solving tim |
| menerima laporan di kantor | melihat kenyataan di lantai produksi |
| bertanya "Siapa yang melakukan ini?" | bertanya "Apa dalam proses yang memungkinkan ini terjadi?" |
| menjawab eskalasi melalui email | menjawab eskalasi di rapat berikutnya |
| menilai KPI | menggunakan KPI untuk memulai percakapan |

## Budaya, keamanan psikologis, dan aturan pemantauan karyawan

Manajemen lantai produksi hanya berjalan jika masalah diungkapkan secara terbuka. Itu terdengar jelas, tetapi di banyak organisasi tidak demikian. Kolom merah di papan yang berujung pada kritik terhadap tim akan dicat hijau pada kesempatan berikutnya.

Peneliti organisasi Amy Edmondson dari Harvard membentuk konsep keamanan psikologis tim: "keyakinan bersama yang dimiliki anggota tim bahwa tim aman untuk mengambil risiko interpersonal" [23]. Studinya terhadap 51 tim kerja di sebuah produsen furnitur dengan sekitar 5.000 karyawan dimuat di Administrative Science Quarterly pada 1999 [23] dan merupakan salah satu karya yang paling banyak dikutip tentang perilaku belajar dalam tim. Implikasinya bagi manajemen lantai produksi: hanya di tim yang aman secara psikologis kesalahan dilaporkan, nyaris celaka didokumentasikan, dan standar dipertanyakan.

### Cara pemimpin membangun keamanan psikologis di papan

- **Merah diterima.** Ucapkan terima kasih atas setiap masalah yang dibuat terlihat. Reaksi terhadap kolom merah pertama menentukan semua kolom berikutnya.
- **Proses, bukan orang.** Tanyakan tentang kondisi, bukan tentang pihak yang bersalah.
- **Tunjukkan kesalahan Anda sendiri.** Pemimpin yang secara terbuka mengakui kegagalannya sendiri menurunkan ambang batas.
- **Jawab eskalasi.** Orang yang mengeskalasi dan tidak pernah mendapat jawaban akan berhenti mengeskalasi.
- **Implementasikan ide.** Implementasi saran yang terlihat adalah bentuk penghargaan yang paling kuat. Studi KIT dan IPRI mengkritik bahwa karyawan sering tidak dapat melihat status saran mereka, yang menurunkan motivasi [24].
- **Jangan menghukum laporan keselamatan.** OSHA mengharapkan bahwa pekerja "tidak mengalami pembalasan" ketika mereka melaporkan cedera, penyakit, dan bahaya [49]; reaksi di papan adalah tempat harapan itu menjadi nyata.

Artikel [Budaya operational excellence di lantai produksi](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) menjelaskan cara menanamkan budaya semacam itu dalam jangka panjang; kompendium [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/) menempatkannya dalam konteks yang lebih luas. Haufe Akademie menyebut hansei, praktik Jepang berupa refleksi diri yang kritis, sebagai salah satu fondasi budaya kesalahan yang positif [43].

### Aturan pemantauan karyawan: hukum ketenagakerjaan AS dan dewan pekerja Jerman

Papan digital yang menampilkan data mesin berdampingan dengan login pengguna dapat dibaca sebagai sistem pemantauan. Seberapa besar hal itu penting bergantung pada lokasi pabrik. Berikut adalah informasi umum, bukan nasihat hukum; mintalah konsultan hukum ketenagakerjaan meninjau setiap penerapan digital.

**Di AS.** Tidak ada hak co-determination umum yang sebanding dengan Jerman, tetapi beberapa aturan berlaku:

- **Pabrik yang berserikat:** NLRB telah memperlakukan pemasangan dan penggunaan kamera pengawas tersembunyi sebagai subjek wajib perundingan (Colgate-Palmolive, 1997), pandangan yang didukung Sirkuit Ketujuh dalam National Steel Corp. v. NLRB (2003) [54]. Apakah papan digital tertentu yang memuat data pribadi termasuk kewajiban berunding merupakan pertanyaan kasus per kasus; jalan yang aman adalah melibatkan serikat pekerja sebelum peluncuran.
- **Pabrik yang tidak berserikat:** Pada Oktober 2022, Penasihat Umum NLRB saat itu mengeluarkan memo GC 23-02, yang berargumen bahwa pemantauan elektronik yang mengganggu dapat menghalangi hak Bagian 7 karyawan berdasarkan NLRA dan mendesak pengungkapan teknologi pemantauan [52]. Pada 14 Februari 2025, Penasihat Umum Pelaksana mencabut memo tersebut (GC 25-05) [53]. NLRA sendiri tidak berubah, sehingga pemantauan yang cenderung membekukan aktivitas yang dilindungi tetap menjadi risiko.
- **Undang-undang pemberitahuan negara bagian:** Beberapa negara bagian mewajibkan pemberitahuan pemantauan elektronik. New York, misalnya, mewajibkan pemberi kerja memberikan pemberitahuan tertulis sebelumnya saat perekrutan kepada karyawan yang penggunaan teleponnya, emailnya, atau internetnya dipantau [55]. Aplikasi lantai produksi yang mencatat penggunaan sistem individual dapat termasuk dalam aturan semacam itu.
- **Pelaporan keselamatan:** Seperti ditunjukkan di bagian 7, aturan OSHA melindungi karyawan yang melaporkan cedera [49][50]. Papan yang menyoroti orang yang melaporkan insiden bekerja melawan perlindungan tersebut.

**Di Jerman (relevan bagi perusahaan AS dengan pabrik di Jerman atau induk perusahaan Jerman).** Melibatkan dewan pekerja (Betriebsrat, badan karyawan terpilih dengan hak codetermination menurut hukum) bukanlah formalitas. ifaa merekomendasikan pelibatan sejak awal dan merancang KPI sedemikian rupa sehingga tidak timbul kekhawatiran akan pengawasan [2]. Dengan papan digital yang menggunakan data mesin dan data pribadi, Pasal 87(1) No. 6 Undang-Undang Konstitusi Kerja Jerman (BetrVG) berlaku: dewan pekerja memiliki hak suara dalam "pengenalan dan penggunaan perangkat teknis yang dirancang untuk memantau perilaku atau kinerja karyawan" [44]. Menurut Pengadilan Ketenagakerjaan Federal (BAG), cukup bahwa suatu sistem secara objektif sesuai untuk mengumpulkan data perilaku atau kinerja; niat pemberi kerja untuk memantau tidak menjadi soal [48]. Hal itu umumnya berlaku untuk Power BI, Power Apps, atau MES dengan login pengguna. GDPR berlaku di samping itu. Dalam praktik, perjanjian kerja (Betriebsvereinbarung) mengatur rinciannya.

**Yang berhasil di kedua negara:** aturan tertulis yang menentukan data mana yang ditampilkan pada tingkat agregasi mana, siapa yang boleh melihat laporan mana, berapa lama data disimpan, dan bahwa KPI menilai proses, bukan orang. Itu adalah isi yang sama dengan yang dicakup perjanjian kerja Jerman, dan itu memberi serikat pekerja atau tenaga kerja AS jawaban yang jelas atas pertanyaan "Apakah ini akan dipakai untuk melawan kami?"

## Cara menerapkan manajemen lantai produksi: peta jalan enam fase

> **Ringkasnya:** Mulailah dengan area percontohan, rancang papan bersama tim, jalankan selama sekitar tiga bulan dengan pendampingan, dan bangun tingkat berikutnya hanya ketika tingkat di bawahnya berjalan andal.

ifaa telah menguraikan model peluncuran enam fase dan mengujinya di beberapa perusahaan kecil dan menengah; evaluasinya menunjukkan bahwa konsep ini dapat diperkenalkan dengan sarana sederhana [2]. Peta jalan di bawah ini dibangun di atas model tersebut dan menambahkan gemba walk, kaskade, serta digitalisasi.

| Fase | Isi | Peserta | Durasi (nilai panduan) |
|---|---|---|---|
| 1. Tetapkan tujuan | tentukan tujuan, area percontohan, dan kriteria keberhasilan; tinjauan keliling pabrik | pimpinan eksekutif, manajemen produksi, pemimpin proyek, fasilitator | setengah hari menurut ifaa [2] |
| 2. Informasikan dan bangun kesadaran | sesi informasi dengan tanya jawab; libatkan perwakilan karyawan | pimpinan, manajer, karyawan area percontohan, serikat atau dewan pekerja bila ada | setengah hari menurut angka ifaa [2] |
| 3. Perkenalkan | rancang papan bersama tim, pilih KPI, latih fasilitasi | manajer dan karyawan area percontohan, 6 sampai 8 orang | dua blok setengah hari, masing-masing paling lama 4 jam menurut ifaa [2] |
| 4. Uji coba | rapat lantai produksi harian, pendampingan, perbaikan papan secara bertahap | tim percontohan, pendamping | sekitar 3 bulan menurut ifaa [2] |
| 5. Pemeriksaan | pengamatan netral terhadap rapat, umpan balik | pengamat internal atau eksternal | secara berkala selama uji coba [2] |
| 6. Validasi dan peluncuran | lokakarya evaluasi, standarisasi papan dan rapat, bangun kaskade, area lainnya | seluruh peserta proyek, lalu area lainnya | lokakarya 2 sampai 3 jam menurut ifaa [2], peluncuran bergantung pada ukuran pabrik |

### Rekomendasi praktis untuk setiap fase

**Fase 1:** Pilih area percontohan dengan proses yang stabil, kepemimpinan yang termotivasi, dan masalah yang terlihat. ifaa berbicara tentang "mercusuar" yang membawa peluncuran berikutnya [2]. Area yang tenggelam dalam kekacauan tidak cocok, karena di sana stabilitas harus didahulukan.

**Fase 2:** Jelaskan alasannya, bukan hanya apanya. Tegaskan bahwa KPI menilai proses, bukan orang.

**Fase 3:** Biarkan tim merancang papan. Mulailah dengan paling banyak empat sampai enam KPI [3] dan daftar tindakan sederhana. Papan yang sempurna pada hari pertama tidak perlu dan tidak berguna.

**Fase 4:** Minggu-minggu pertama menentukan. Rapat pada awalnya memakan waktu lebih lama dari seharusnya [3]. Seorang pendamping mengamati rapat dan memberi umpan balik pribadi kepada fasilitator setelahnya. Orth menyebutkan sekitar 15 menit untuk ini, mencakup satu kekuatan, satu area pengembangan, dan satu penugasan konkret [3]. Pada minggu-minggu awal hal ini berguna setiap hari, kemudian setiap minggu. Gemba walk oleh tingkat kepemimpinan berikutnya dimulai pada fase ini.

**Fase 5:** Gunakan penilaian sederhana (lihat pemeriksaan kematangan di bawah) untuk memastikan sistem berfungsi.

**Fase 6:** Bangun tingkat 2 hanya ketika tingkat 1 berjalan andal, lalu tingkat 3 dan 4. Gantikan rapat yang ada alih-alih menambah rapat baru. Gelbrich menyebutnya sebagai kesalahan umum ketika manajemen lantai produksi tidak digunakan untuk menggantikan rapat yang ada [3].

### Prasyarat dan faktor keberhasilan menurut ifaa

ifaa menyebutkan sebagai prasyarat: komitmen manajemen, anggaran waktu dan uang, komunikasi proyek di dalam perusahaan, kondisi target yang jelas (visi dan misi), keyakinan dari orang-orang yang terlibat, serta keterlibatan dewan pekerja (works council) [2]. Untuk keberhasilan, ifaa juga menekankan manajemen yang hadir dalam rapat di lokasi kerja, tujuan yang dikomunikasikan dengan jelas dan diteruskan ke semua tingkatan, partisipasi dan pelatihan karyawan, serta disiplin, konsistensi, dan daya tahan, karena shop floor management bukan kampanye sekali jalan [2]. Di pabrik AS tanpa dewan pekerja, logika yang sama berlaku bagi serikat pekerja atau, di pabrik tanpa serikat, komunikasi dini dan terbuka dengan tenaga kerja.

### Pemeriksaan kematangan: apakah shop floor management Anda berjalan?

- [ ] Papan diperbarui hari ini, dan tim dapat menjelaskan setiap KPI.
- [ ] Setiap KPI merah memiliki tindakan dengan penanggung jawab dan tenggat waktu.
- [ ] Rapat dimulai tepat waktu dan tetap dalam batas waktu.
- [ ] Eskalasi sampai ke tingkat berikutnya pada hari yang sama dan mendapat jawaban.
- [ ] Pimpinan melakukan gemba walk dengan ritme tetap.
- [ ] Tindakan hanya ditutup setelah efeknya terbukti.
- [ ] Jumlah masalah dan near miss yang dilaporkan naik, bukan turun.
- [ ] Setidaknya satu rapat yang ada telah digantikan oleh rapat tingkat (tier meeting).
- [ ] Proses yang diperbaiki didokumentasikan dalam standar yang diperbarui.
- [ ] Karyawan dapat melihat status ide mereka.

Delapan atau lebih jawaban "ya" menunjukkan sistem yang efektif; kurang dari lima menunjukkan papan yang lebih merupakan ritual daripada alat kepemimpinan.

## Kesalahan umum dan cara memperbaikinya

Dari pengamatan sejak 2015 di sekitar 50 perusahaan Jerman lintas industri, Gelbrich menurunkan sepuluh alasan umum mengapa shop floor management gagal [3]. Tabel berikut memasangkannya dengan langkah penanggulangan.

| Kesalahan (menurut Gelbrich [3]) | Langkah penanggulangan |
|---|---|
| ekspektasi yang tidak realistis tanpa keterlibatan langsung manajemen | plant manager memimpin tier 4 secara pribadi dan rutin turun ke gemba |
| keterkaitan yang keliru antar tingkat shop floor management | kaskade yang saling terkait, pemicu eskalasi yang ditetapkan, kewajiban untuk merespons |
| kelebihan konten dengan informasi yang tidak perlu | empat sampai enam KPI, hapus semua yang lain dari papan |
| pembaruan informasi yang rumit dan memakan waktu | sederhanakan pengumpulan data, otomatisasi bila masuk akal |
| KPI yang tidak relevan dengan proses | turunkan ulang KPI dengan tiga pertanyaan panduan |
| KPI yang tidak dapat dipengaruhi tim | pindahkan ke tingkat yang lebih tinggi |
| siklus pembaruan yang panjang dan informasi yang usang | jadikan pembaruan sebagai butir tetap dalam serah terima shift |
| tidak ada tindakan korektif saat ditemukan penyimpangan | aturan: tidak ada merah tanpa tindakan |
| rapat shop floor yang berlangsung terlalu lama, terutama selama peluncuran | batas waktu, stand up, pindahkan pemecahan masalah ke luar rapat |
| shop floor management tidak menggantikan rapat yang sudah ada | inventarisasi rapat, pangkas duplikasi |

Tiga kesalahan lain sering muncul dalam praktik:

- **KPI theater:** KPI dipresentasikan tetapi tidak didiskusikan. Pertanyaan "Apa yang harus kita lakukan sekarang?" tidak pernah muncul.
- **Gemba tourism:** Pimpinan berkeliling pabrik tanpa topik, tanpa pertanyaan, dan tanpa tindak lanjut.
- **Terlalu cepat digital:** Pabrik memperkenalkan perangkat lunak sebelum rutinitas terbentuk. Yang didigitalkan adalah proses yang tidak benar-benar dijalankan siapa pun.

## Analog atau digital? Perbandingan manajemen shop floor digital

Pertanyaan "papan tulis atau layar?" sering diperlakukan sebagai soal prinsip. Padahal pertanyaan ini bisa dijawab secara objektif. Riset yang tersedia menunjukkan bahwa kondisi saat ini sebagian besar masih analog: dalam studi KIT dan IPRI (18 perusahaan), manajemen shop floor dijalankan terutama di atas kertas dan hanya sebagian kecil didukung digital; hanya sekitar 10 persen rapat yang menggunakan papan shop floor digital, dan tampilan KPI digital biasanya baru dimulai di tingkat manajemen menengah [24][25]. Studi tersebut juga menggambarkan serah terima informasi yang terputus antara kertas, Excel dan OneNote tanpa sistem utama, sehingga pelacakan lintas tingkat menjadi lebih sulit [24].

| Kriteria | Papan analog | Papan digital |
|---|---|---|
| Biaya awal | sangat rendah | lisensi, perangkat keras, integrasi |
| Kepemilikan langsung | tim menulis langsung di papan, identifikasi kuat | risiko tim hanya menjadi konsumen |
| Kemutakhiran | bergantung pada pembaruan manual | otomatis, hingga mendekati waktu nyata |
| Kualitas data | kesalahan penyalinan, data yang kosong | konsisten, asalkan sumber datanya bersih |
| Eskalasi lintas tingkat | manual, rawan kesalahan | menyeluruh, dapat ditelusuri |
| Pelacakan tindakan | disiplin individu | didukung sistem dengan tenggat dan pengingat |
| Tim tersebar, banyak lokasi | tidak memungkinkan | memungkinkan |
| Riwayat dan analisis | foto, binder | dapat dianalisis, tren, pola |
| Ketahanan | selalu berfungsi | bergantung pada jaringan dan sistem |
| Aturan pemantauan karyawan | biasanya tidak bermasalah | aturan data tertulis dianjurkan (serikat pekerja, hukum negara; perjanjian kerja di Jerman) |
| Keamanan OT | bukan masalah | diperlukan segmentasi jaringan dan kontrol akses (lihat bagian 18) |

### Pendekatan mana yang tepat dan kapan?

- **Mulai dengan analog** ketika rutinitasnya baru, tim kecil dan KPI mudah dicatat secara manual. Papan tulis memaksa Anda untuk menjaganya tetap ramping.
- **Gunakan hibrida** ketika data mesin mengalir otomatis ke layar tetapi tindakan dan ide masih dikelola secara manual di papan. Bagi banyak pabrik, ini adalah kompromi terbaik.
- **Perluas secara digital** ketika beberapa tingkat, shift, atau lokasi harus saling terhubung, ketika pencatatan data manual terlalu memakan usaha, atau ketika tindakan hilang di antara tingkatan.

CETPM mengacu pada model digitalisasi lima fase oleh Müller-Seegers: penetapan proyek dan tujuan, pengujian vendor dan pemilihan alat, pilot (paling lama empat minggu), fase penyesuaian (hanya jika diperlukan), peluncuran dan operasi; secara keseluruhan ia memperkirakan sekitar enam bulan [3]. Yang lebih penting daripada alatnya adalah urutannya: rutinitas dulu, digital kemudian. Artikel [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) menunjukkan cara memperbaiki aliran material secara paralel.

## Membangun papan lantai produksi digital dengan Microsoft 365

> **Ringkasnya:** Teams menyediakan ruang kerja, Power BI dinding KPI, Power Apps untuk pencatatan data, Lists untuk daftar tindakan, dan Fabric untuk peringatan real-time. Faktor terbesar yang memengaruhi biaya dan kinerja adalah lisensi untuk pemirsa, interval penyegaran Power BI, dan model data.

Banyak produsen sudah menggunakan Microsoft 365 untuk email, Teams, dan dokumen. Masuk akal untuk membangun papan lantai produksi digital di tempat karyawan sudah bekerja. Komponen-komponen berikut didokumentasikan di Microsoft Learn; periksa persyaratan lisensi dan ketersediaan untuk tenant Anda sendiri sebelum memulai proyek. Pemasok sektor publik dan pertahanan AS di cloud pemerintah Microsoft (GCC, GCC High) sebaiknya memeriksa ketersediaan fitur di sana secara terpisah.

### Gambaran arsitektur referensi

| Fungsi papan | Komponen Microsoft | Fungsinya (menurut dokumentasi Microsoft) |
|---|---|---|
| Ruang komunikasi per area | Microsoft Teams (satu tim per area, satu saluran per lini atau tingkat) | saluran dengan tab untuk papan, tindakan, dan aplikasi |
| Memvisualisasikan KPI | Power BI, disematkan sebagai tab di Teams | laporan interaktif di saluran dan obrolan, pratinjau tautan, notifikasi di umpan aktivitas [28] |
| KPI dengan target | Power BI Metrics (scorecard) | metrik dengan pemilik, nilai saat ini dan target, status, pemeriksaan; sebagai tab di saluran atau rapat [31] |
| Pencatatan data di stasiun kerja | Power Apps (aplikasi kanvas sebagai tab Teams) | layar input khusus, misalnya untuk alasan downtime, scrap, ide [30] |
| Daftar tindakan, pelacak masalah | Microsoft Lists (misalnya templat "Issue tracker") atau Planner | daftar dengan tampilan, aturan, dan notifikasi, disimpan di SharePoint [38] |
| Tugas standar lintas lokasi | Planner dengan publikasi tugas | mendistribusikan daftar tugas ke banyak tim dan melacak penyelesaian per lokasi [37] |
| Komunikasi shift | Aplikasi Teams untuk pekerja lini depan (Shifts, Walkie Talkie, Approvals, Updates) | jadwal shift, push-to-talk, persetujuan, pembaruan berulang [35][36] |
| Data real-time dan peringatan | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Real-Time Dashboard, Activator) | menangkap, menganalisis, dan memvisualisasikan data streaming serta bertindak otomatis berdasarkan kondisi [32][33] |

### Power BI sebagai dinding KPI

Laporan Power BI dapat disematkan sebagai tab di saluran Teams, sehingga tim melihat dan membahas KPI di tempat mereka sudah berkomunikasi [28]. Tiga hal penting dalam praktik:

1. **Izin:** Menyematkan laporan di Teams tidak otomatis memberi pengguna izin untuk melihatnya; izin harus diberikan secara eksplisit [28].
2. **Lisensi:** Pengguna dengan lisensi Fabric gratis dapat melihat konten di ruang kerja pada kapasitas Premium (SKU P) atau kapasitas Fabric F64 atau lebih besar; membuat dan membagikan memerlukan Power BI Pro atau Premium Per User [28]. Di bawah F64, setiap pemirsa karena itu memerlukan lisensi Pro atau PPU. Dengan banyak pemirsa di lantai produksi, ini menjadi pendorong biaya utama; perjelas lisensi untuk layar tampilan di lini produksi bersama mitra lisensi Microsoft Anda.
3. **Keterbatasan:** Dasbor Power BI (berbeda dengan laporan) tidak dapat disematkan di tab Power BI, dan tab tersebut tidak mendukung filter URL [28].

**Seberapa mutakhir papan Power BI dapat berada?** Penyegaran halaman otomatis berfungsi untuk sumber DirectQuery, Direct Lake, dan beberapa skenario live connection, tetapi tidak untuk mode import [29]. Pada kapasitas bersama (umum dengan lisensi Pro saja), interval minimum adalah 30 menit dan deteksi perubahan tidak tersedia. Pada kapasitas khusus (Fabric F, Premium P) dan dengan Premium Per User, interval hingga satu detik dimungkinkan dengan DirectQuery jika admin kapasitas mengizinkan; interval minimum default adalah lima menit, dan lima detik untuk deteksi perubahan [29]. Itu cukup untuk papan yang menampilkan unit per jam; untuk fungsi andon sejati, Real-Time Intelligence lebih sesuai.

### Power Apps untuk pencatatan data di stasiun kerja

Aplikasi kanvas yang dibangun dengan Power Apps dapat ditambahkan ke saluran Teams melalui tab "Power Apps", asalkan aplikasi tersebut telah dibagikan kepada pengguna terlebih dahulu [30]. Aplikasi lantai produksi yang umum:

- pencatatan alasan downtime dengan beberapa tombol besar (misalnya "material tidak tersedia," "kerusakan alat," "kualitas"),
- pencatatan scrap dan rework per jam,
- ide dan saran perbaikan dengan foto,
- daftar periksa gemba walk digital dengan observasi dan tindakan,
- konfirmasi proses (layered process audit) di tablet.

Microsoft mencantumkan keterbatasan yang sudah diketahui, misalnya bahwa sensor seperti lokasi atau kompas tidak didukung di aplikasi desktop Teams, dan lampiran tidak dapat diunduh di aplikasi seluler Teams [30]. Penting untuk keputusan arsitektur: lingkungan Dataverse for Teams sudah tidak digunakan lagi (deprecated) [30]. Menurut Microsoft, sejak 15 November 2026 tidak ada lagi lingkungan Dataverse for Teams baru yang dapat dibuat; lingkungan yang belum ditingkatkan akan ditangguhkan pada 15 September 2027 dan dihentikan permanen pada 30 Oktober 2027 [45]. Oleh karena itu, solusi baru sebaiknya dibangun di atas lingkungan Dataverse reguler, daftar SharePoint, atau sumber data lainnya.

**Pertanyaan lisensi Power Apps:** Tabel Dataverse, konektor premium, dan gateway data lokal (misalnya, untuk database MES di pabrik) memerlukan hak Power Apps premium [46]. Aplikasi pencatatan berbasis daftar SharePoint biasanya dapat berjalan dengan hak yang sudah termasuk dalam Microsoft 365; Power Platform Licensing Guide menjelaskan ruang lingkup yang tepat. Perbedaan ini sering menentukan biaya per pengguna di lini produksi.

### Tindakan dan tugas

Microsoft Lists, yang dapat digunakan sebagai tab di Teams, cocok untuk daftar tindakan. Microsoft menggambarkan Lists sebagai alat untuk melacak informasi seperti masalah, aset, rutinitas, atau insiden, dengan tampilan, aturan, dan notifikasi yang dapat disesuaikan; tersedia templat "Issue tracker", dan datanya disimpan di situs tim SharePoint [38]. Daftar dengan kolom masalah, KPI, akar penyebab, tindakan, penanggung jawab, tenggat waktu, status, efek terverifikasi, dan tingkat eskalasi mencerminkan kolom tindakan pada papan. Filter per tingkat menampilkan item yang relevan persis untuk setiap rapat tingkat.

Rutinitas terstandar, seperti pemeriksaan 5S harian atau konfirmasi proses mingguan di semua lini, dapat didistribusikan dengan publikasi tugas di Planner. Microsoft menjelaskan bagaimana manajer operasi dapat mempublikasikan daftar tugas ke tim dalam hierarki yang ditetapkan dan memantau penyelesaian melalui laporan per tugas dan per daftar; tugas dapat memuat daftar periksa hingga 20 item [37].

### Waktu nyata dan peringatan dengan Microsoft Fabric

Untuk pabrik yang ingin menggunakan data mesin secara real time, Microsoft Fabric Real-Time Intelligence menawarkan beberapa blok bangunan [32]:

- **Eventstream** menangkap, mentransformasi, dan merutekan volume besar data real-time tanpa kode; konektor mencakup MQTT, Apache Kafka, dan change data capture dari database. Sumber Azure seperti Event Hubs dan IoT Hub tersedia di Real-Time hub.
- **Eventhouse** dioptimalkan untuk peristiwa streaming berbasis waktu; kueri menggunakan KQL (Kusto Query Language) atau, dalam KQL queryset, T-SQL.
- **Real-Time Dashboard** memvisualisasikan data yang sedang bergerak.
- **Activator** memantau aliran data dengan latensi rendah (sub-detik untuk aturan stateless pada data streaming) dan memicu tindakan ketika ambang batas tercapai atau pola terdeteksi, termasuk ketiadaan data. Tindakan meliputi pesan Teams ke individu, grup, atau channel, email, alur Power Automate, dan item Fabric seperti pipeline atau notebook [33].

Microsoft secara eksplisit menyebut manufaktur dan IoT sebagai skenario [32]. Untuk manajemen lantai produksi, ini berarti aturan Activator dapat, misalnya, mengirim pesan ke channel Teams lini ketika sebuah mesin berhenti lebih lama dari waktu yang ditentukan. Itulah andon digital yang sampai ke team leader di ponsel pintar. Ini melengkapi tali penarik dan lampu tumpuk di lini, tetapi tidak menggantikannya, selama tidak setiap team leader membawa ponsel perusahaan.

### Contoh: papan tingkat 1 di Teams

| Tab channel | Konten | Blok bangunan |
|---|---|---|
| "Board" | Halaman SQDCP dengan status merah/hijau, target vs. aktual per jam, 3 penyebab downtime teratas | Laporan Power BI |
| "Capture" | penyebab downtime, scrap, ide | Aplikasi kanvas Power Apps |
| "Actions" | daftar tindakan yang difilter untuk tingkat 1 | Microsoft Lists |
| "Routines" | pemeriksaan harian, 5S, konfirmasi proses | Planner (tugas yang dipublikasikan) |
| "Goals" | tujuan area dengan check-in | Power BI Metrics |
| Postingan channel | eskalasi, pesan andon, serah terima shift | Teams, Activator, Power Automate |

### Rencana pembangunan: enam langkah menuju papan tingkat 1 digital pertama Anda

Untuk admin Microsoft 365, urutan berikut telah terbukti efektif. Ini mengasumsikan tim percontohan sudah bekerja dengan papan analog.

1. **Fotografieren Sie das Board und definieren Sie die KPIs.** Übernehmen Sie die Felder und KPIs des analogen Boards; definieren Sie für jeden KPI Formel, Datenquelle, Zielwert und den nötigen Aktualisierungsrhythmus.
2. **Teams und Kanäle anlegen.** Ein Team pro Bereich, ein Kanal pro Linie oder Ebene; Berechtigungen über Gruppen statt über einzelne Personen.
3. **Maßnahmenliste in Microsoft Lists aufbauen.** Spalten wie unter „Maßnahmen und Aufgaben“ oben, eine Ansicht pro Ebene, Erinnerung am Fälligkeitsdatum.
4. **Erfassungs-App erstellen.** Eine Canvas-App mit wenigen großen Schaltflächen für Stillstandsgründe und Ausschuss, Daten in SharePoint-Listen oder Dataverse (die Lizenzfrage beachten).
5. **Power-BI-Bericht anbinden.** Eine Berichtsseite pro Board, Rot/Grün-Logik gegenüber den Zielwerten, DirectQuery oder Direct Lake, falls eine Seitenaktualisierung nötig ist; als Registerkarte im Kanal einbetten und Leserechte vergeben.
6. **Vier Wochen in der Besprechung testen, dann erweitern.** Erst wenn das Team das digitale Board in der Besprechung der Ebene 1 selbst betreibt, folgen Activator-Warnungen, Planner-Routinen und die Anbindung an Ebene 2.

Vereinbaren Sie die Datenregeln mit den Arbeitnehmervertretern, bevor Schritt 4 beginnt (in Deutschland zusätzlich mit dem Betriebsrat), denn ab diesem Schritt können Daten entstehen, die sich einzelnen Personen zuordnen lassen.

### Was Microsoft 365 nicht ersetzt

Microsoft 365 ist ein Werkzeugkasten, kein fertiges System für das Shopfloor Management. Die Kaskadenlogik, die Eskalationsregeln, die Verbindung von KPI, Maßnahme und nachgewiesener Wirkung sowie die Moderationsdisziplin müssen Sie selbst gestalten. Ohne klares Datenmodell entstehen schnell eine Sammlung unverbundener Listen und Berichte – genau die gebrochenen Übergaben zwischen Werkzeugen, die die Forschung am analogen Shopfloor Management kritisiert [24]. Klären Sie außerdem früh die Hardwarefrage: große Bildschirme an der Linie, robuste Tablets und Gerätekonten für gemeinsam genutzte Geräte verursachen eigenen Aufwand.

## Datenintegration: MES, ERP und Maschinendaten

> **Kurz gesagt:** Stückzahlen und Stillstände kommen automatisch von der Maschine oder aus dem MES; Stillstandsgründe und Ideen werden einfach von Hand erfasst. Jeder KPI wird einmal definiert und auf jeder Ebene gleich berechnet.

Ein digitales Board ist nur so gut wie seine Daten. Typische Quellen:

| Quelle | Daten für das Board | Typischer Weg |
|---|---|---|
| ERP (z. B. SAP, Microsoft Dynamics 365) | Aufträge, geplante Mengen, Liefertermine, Rückstand | Datenexport oder Konnektor in Power BI oder Fabric |
| MES / Betriebsdatenerfassung | Stückzahlen, Stillstände, Stillstandsgründe, OEE, Ausschuss | Datenbank- oder API-Anbindung, Replikation nach Fabric |
| Maschinensteuerungen (SPS, OPC UA) | Zustände, Zähler, Prozesswerte | Edge-Gateway, z. B. Azure IoT Operations mit dem OPC-UA-Konnektor, danach über MQTT |
| Qualitätsmanagementsystem (QMS) | Prüfergebnisse, Reklamationen | Datenbank- oder API-Anbindung |
| HR- und Schichtplanungssysteme | Anwesenheit, Schichtplan | Schnittstelle, aggregiert |
| Manuelle Erfassung | Stillstandsgründe, Ideen, Sicherheitsereignisse | Power Apps, Microsoft Lists |

In der Terminologie von ISA-95 (ANSI/ISA-95, international IEC 62264) sitzt das Board über Ebene 3 (Betriebsleitsysteme der Fertigung, etwa MES) und Ebene 4 (Geschäftsplanung und Logistik, etwa ERP); der Standard regelt vor allem die Schnittstelle zwischen diesen beiden Ebenen [56]. Wenn Sie sein Vokabular für Aufträge, Materialien und Betriebsmittel verwenden, lässt sich das Datenmodell des Boards leichter mit MES und ERP abstimmen.

Für die Maschinenanbindung beschreibt Microsoft den OPC-UA-Konnektor in Azure IoT Operations: Er verbindet sich mit OPC-UA-Servern, liest Daten und veröffentlicht sie als JSON-Nachrichten im OPC-UA-PubSub-Format an den MQTT-Broker; zudem kann er Assets automatisch erkennen [34]. Von dort leiten Datenflüsse in Azure IoT Operations die Daten an Ziele wie Microsoft Fabric OneLake, Azure Data Explorer oder einen Kafka-Endpunkt weiter [47]. Die hier geprüfte Dokumentation beschreibt keinen OPC-UA-Konnektor direkt in Fabric; der Weg führt über das Edge-Gateway.

Sobald Maschinennetze mit Cloud-Diensten verbunden werden, wird die OT-Sicherheit Teil des Projekts. Die Normenreihe ISA/IEC 62443 behandelt die Sicherheit industrieller Automatisierungs- und Steuerungssysteme und verbindet Betrieb und IT [57]; das NIST Cybersecurity Framework (CSF) 2.0, veröffentlicht am 26. Februar 2024, beschreibt sich selbst als Taxonomie übergeordneter Cybersicherheitsziele und kann als Referenz für die Steuerung dieser Arbeit dienen [59]. Ein Shopfloor-Board sollte Daten aus dem OT-Netz lesen, nicht einen Zugang in dieses Netz öffnen.

### Grundsätze für die Datenarchitektur

1. **Satu kebenaran per KPI.** Definisikan setiap KPI sekali (rumus, sumber, granularitas) dan gunakan definisi itu di setiap tingkat. Dengan begitu, OEE pada papan tingkat 1 sama dengan OEE dalam laporan pabrik.
2. **Otomatiskan yang sudah stabil.** Jumlah unit dan downtime berasal dari mesin atau MES. Alasan downtime yang perlu dinilai manusia dicatat secara manual, dengan cara yang sederhana dan cepat.
3. **Latensi yang sesuai dengan keputusan.** Tingkat 1 membutuhkan nilai per jam atau real-time, tingkat 4 nilai harian atau mingguan. Tidak semua hal harus real-time.
4. **Privasi dan aturan karyawan sejak awal.** Data pribadi diagregasi; peran dan izin didokumentasikan.

Kompendium [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) membahas pertanyaan TI manufaktur ini secara mendalam, dan [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) menunjukkan ke mana data pabrik real-time mengarah selanjutnya.

## Dukungan perangkat lunak: contoh iFAKT Polaris

> **Catatan: Penulis bekerja di iFAKT GmbH.**

Selain membangun papan sendiri dengan Microsoft 365, tersedia perangkat lunak khusus untuk digital lean management. Salah satu contohnya adalah [Polaris](https://www.m365.fm/entity/polaris/) dari [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), yang berkantor pusat di Stuttgart, Jerman. Solusi Polaris terdaftar di Microsoft AppSource, termasuk Polaris VSM untuk pemetaan aliran nilai digital [39] dan Polaris BSM untuk pemodelan proses bisnis dalam digital lean management [40]. Kompendium [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) menjelaskan keluarga produk ini secara rinci.

Menurut vendor, dua modul relevan untuk shop floor management [unverified: informasi berasal dari vendor dan belum diverifikasi secara independen]:

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** membawa tugas langsung ke lantai produksi, misalnya tindakan dari rapat tingkat atau gemba walk, sehingga tindakan itu sampai ke penanggung jawabnya di lini dan penyelesaiannya dapat dilacak.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** menampilkan KPI dalam dasbor dan mendukung KPI wall pada papan di berbagai tingkat.

Penilaian: solusi khusus tidak lebih mendesain kaskade, aturan eskalasi, dan disiplin fasilitasi untuk Anda dibandingkan solusi buatan sendiri. Namun, solusi ini dapat menyusun terlebih dahulu hubungan antara KPI, tindakan, dan dampak yang terverifikasi sehingga mengurangi pekerjaan pada model data Anda sendiri. Yang penting adalah apakah solusi tersebut cocok dengan lanskap TI Anda yang ada; daftar di AppSource menunjukkan fokus pada ekosistem Microsoft.

Selain Polaris, ada banyak vendor lain, seperti modul shop floor dari vendor MES atau platform lean dan rapat berjenjang yang berdiri sendiri. Terlepas dari vendornya, pertanyaan berikut membantu dalam pemilihan:

- Apakah perangkat lunak memetakan kaskade dengan eskalasi dan respons di beberapa tingkat?
- Dapatkah sebuah tindakan ditutup hanya setelah dampaknya terbukti?
- Antarmuka apa saja yang tersedia ke ERP, MES, dan mesin, dan siapa yang memeliharanya?
- Dapatkah perangkat lunak mengagregasi KPI sesuai dengan aturan data Anda (perjanjian serikat pekerja, hukum negara bagian, atau perjanjian kerja bersama)?
- Apa yang terjadi ketika jaringan di lini produksi terputus?
- Bagaimana lisensi untuk pengguna tampilan diatur, dan berapa biaya sebuah layar di lini produksi?

Tentang perusahaan: iFAKT GmbH berkantor pusat di Curiestrasse 2, 70563 Stuttgart, Jerman (daftar perusahaan Stuttgart HRB 22661) [61]. Menurut perusahaan, didirikan pada 2001 dan memiliki sekitar 25 karyawan (informasi perusahaan, tidak diverifikasi secara independen). Situs webnya menampilkan segel TÜV SÜD untuk sertifikasi ISO 9001 dan ISO/IEC 27001 [61], dan perusahaan ini meraih peringkat kedua di kategori produksi pada Best of Technology Award 2025 dari majalah bisnis mingguan Jerman WirtschaftsWoche dengan sistem Polaris IMS [60].

## Glosarium

| Istilah | Arti |
|---|---|
| A3 | pemecahan masalah pada satu lembar kertas A3 (di AS biasanya 11 × 17 in.): masalah, kondisi saat ini, akar penyebab, target, tindakan perbaikan, tindak lanjut |
| Andon | sinyal (tali tarik, tombol, lampu) yang langsung membuat penyimpangan terlihat dan meminta bantuan |
| Eskalasi | meneruskan masalah ke tingkat berikutnya ketika tim tidak mampu menyelesaikannya sendiri |
| Gemba | bahasa Jepang untuk "tempat sebenarnya"; tempat nilai diciptakan |
| Gembutsu | "benda sebenarnya" di gemba: mesin, alat, bahan, suku cadang cacat |
| Genchi genbutsu | pergi melihat sendiri dan memeriksa fakta di lokasi |
| Hoshin kanri | metode untuk menurunkan sasaran perusahaan ke semua tingkat (juga disebut policy deployment) |
| Layered process audit (process confirmation) | pemeriksaan singkat terhadap standar oleh pimpinan di beberapa tingkat dengan ritme tetap |
| Leader standard work | rutinitas harian pimpinan yang tetap dan terlihat |
| Obeya | "ruang besar"; ruang rapat dengan semua KPI dan proyek terpasang di dinding |
| OEE | overall equipment effectiveness: ketersediaan × kinerja × kualitas |
| SQDCP | struktur papan berdasarkan keselamatan, kualitas, pengiriman, biaya, sumber daya manusia (juga SQCDP) |
| Tier meeting | rapat rutin singkat di papan pada tingkat tertentu dalam hierarki |
| TRIR | total recordable incident rate: kasus yang tercatat OSHA × 200.000 / jam kerja |
| Yokoten | mentransfer solusi yang terbukti ke lini atau pabrik lain |
| DirectQuery / Direct Lake | mode koneksi Power BI yang data-nya diquery langsung, bukan diimpor; diperlukan untuk penyegaran halaman otomatis |
| F64 | ukuran kapasitas Microsoft Fabric yang memungkinkan penampil melihat konten tanpa lisensi Power BI berbayar |

## FAQ: manajemen lantai produksi dan gemba walk

### Apa itu manajemen lantai produksi dalam istilah sederhana?

Manajemen lantai produksi berarti pimpinan memimpin di tempat pekerjaan dilakukan. Tim bertemu singkat setiap hari di papan dengan beberapa KPI, membahas penyimpangan, menyepakati tindakan, dan meneruskan masalah yang tidak dapat mereka selesaikan ke tingkat pimpinan berikutnya. Pimpinan secara rutin turun ke lantai produksi untuk melihat sendiri.

### Apa saja elemen manajemen lantai produksi?

Enam elemen: pimpinan hadir di lantai produksi (gemba), manajemen visual, beberapa KPI yang dapat dipengaruhi tim, ritme rapat tetap dalam tier meeting, pemecahan masalah yang terstruktur, dan standardisasi. Lembaga riset Jerman mengelompokkannya sedikit berbeda [2][4], dan halaman vendor AS sering berbicara tentang lima pilar, tetapi isinya sama.

### Apa arti gemba?

Gemba (juga genba) adalah bahasa Jepang untuk "tempat sebenarnya." Dalam lean, artinya tempat nilai diciptakan, biasanya lantai produksi [7][8]. Genchi genbutsu, "pergi dan lihat sendiri," adalah tindakan terkait: gemba adalah tempatnya, genchi genbutsu adalah apa yang dilakukan di sana [8].

### Apa itu gemba walk?

Gemba walk adalah kunjungan terencana oleh pimpinan ke tempat nilai diciptakan. Pimpinan mengamati pekerjaan, membandingkannya dengan standar, dan mengajukan pertanyaan terbuka untuk memahami situasi sebelum mengambil tindakan [7]. Gemba walk yang baik memiliki topik, dimulai dari papan, dan diakhiri dengan umpan balik kepada tim.

### Apa tiga prinsip gemba walk?

Versi yang paling sering dikutip berasal dari mantan ketua Toyota Fujio Cho: "Go see, ask why, show respect" [15]. LEI menambahkan tiga hal yang diperhatikan dalam gemba walk: tujuan (masalah apa yang dipecahkan proses bagi pelanggan), proses (bagaimana sebenarnya cara kerjanya), dan orang (apakah mereka terlibat dalam memperbaikinya) [7].

### Apa perbedaan antara manajemen lantai produksi dan gemba walk?

Manajemen lantai produksi adalah keseluruhan sistem kepemimpinan: papan, KPI, tier meeting, pemecahan masalah, dan standar. Gemba walk adalah salah satu rutinitas dalam sistem itu: pimpinan pergi ke tempat pekerjaan dilakukan, mengamati, dan mengajukan pertanyaan untuk memahami situasi sebelum bertindak [7].

### Berapa lama rapat lantai produksi sebaiknya berlangsung?

Sekitar 10 sampai 15 menit di tingkat tim dan 20 sampai 30 menit di tingkat manajemen. Gelbrich menyebutkan 10 sampai 12 menit di tingkat operasional dan 20 sampai 30 menit di tingkat manajemen; selama penerapan, rapat sering berlangsung lebih lama [3].

### Apa itu rapat tier 1, tier 2, dan tier 3?

Tier meeting adalah rapat singkat dan terstandar di papan pada satu tingkat organisasi. Tier 1 adalah tim lini depan, tier 2 adalah supervisor suatu area, tier 3 adalah manajer departemen, dan tier 4 adalah pimpinan pabrik [58]. Rapat-rapat ini dijadwalkan berjenjang sehingga masalah dapat dieskalasi ke atas pada hari yang sama.

### Apa itu papan lantai produksi?

Papan lantai produksi (juga disebut huddle board atau papan SQDCP) adalah papan tulis atau layar tempat tim berkumpul untuk rapat tier. Papan ini menampilkan beberapa KPI dengan target dan tren, tindakan terbuka beserta penanggung jawab dan tenggat waktunya, serta eskalasi ke level berikutnya. Tata letak yang umum memiliki kolom berdasarkan SQDCP dan baris untuk status, tren, dan tindakan.

### Apa kepanjangan SQDCP?

SQDCP adalah singkatan dari safety (keselamatan), quality (kualitas), delivery (pengiriman), cost (biaya) dan people (sumber daya manusia), juga ditulis SQCDP. Urutannya adalah pesan itu sendiri: keselamatan dibahas pertama dalam setiap rapat. Varian yang ada adalah SQDC, SQDCM (moral) atau SQDCE (lingkungan).

### KPI apa saja yang sebaiknya ada di papan lantai produksi?

Empat sampai enam KPI yang dapat dipengaruhi tim [3], disusun berdasarkan SQDCP: keselamatan (cedera yang tercatat, nyaris celaka), kualitas (scrap, first pass yield), pengiriman (target vs. realisasi, on-time delivery), biaya atau produktivitas (OEE, unit per jam) dan sumber daya manusia (kehadiran, cross-training, ide perbaikan).

### Seberapa sering gemba walk sebaiknya dilakukan?

Tidak ada angka universal. Yang penting adalah ritme tetap dan andal yang berakar pada standard work pemimpin. Dalam praktiknya, supervisor dan shift leader melakukan gemba walk berbasis topik setiap hari, manajer departemen beberapa kali seminggu, dan manajer pabrik minimal sekali seminggu; value stream walk dilakukan sesuai kebutuhan. Team leader berada di gemba sepanjang hari dan menggunakan process confirmation harian sebagai gantinya. Lebih penting daripada frekuensi adalah bahwa setiap walk memiliki topik dan tindak lanjut.

### Siapa yang sebaiknya melakukan gemba walk?

Pemimpin di setiap level, masing-masing dengan fokus yang berbeda: supervisor dan manajer departemen terutama melakukan management system walk (apakah papan, standar, dan eskalasi berjalan dengan baik?), kepemimpinan pabrik melakukan value stream walk lintas fungsi, dan spesialis melakukan walk yang berfokus pada masalah [14]. Team leader tetap bekerja di gemba dan menggunakan process confirmation sebagai gantinya. Libatkan orang yang menyentuh proses, sebagaimana direkomendasikan LEI [7].

### Berapa lama gemba walk sebaiknya berlangsung?

Sumber yang ditinjau tidak memberikan durasi tetap. Walk yang terfokus di satu area biasanya memakan waktu 20 sampai 45 menit; value stream walk lintas satu product family dapat memakan waktu setengah hari. Mengamati beberapa siklus di satu workstation lebih penting daripada menjangkau area yang luas.

### Pertanyaan apa yang sebaiknya diajukan dalam gemba walk?

Pertanyaan terbuka paling efektif, misalnya "Bagaimana langkah ini biasanya berjalan?", "Bagaimana Anda tahu ada yang tidak beres?", "Apa masalah terakhir yang Anda selesaikan di sini?" dan "Apa yang bisa saya lakukan untuk mendukung Anda?" Bank pertanyaan lengkapnya ada di bagian gemba walk.

### Apakah gemba walk sama dengan management by walking around?

Tidak. MBWA berasal dari Hewlett-Packard dan menjadi dikenal melalui "In Search of Excellence" (1982) [16]; intinya adalah kedekatan dan pertukaran informal. Gemba walk lebih terstruktur, mengacu pada standar dan KPI, serta berfungsi untuk memahami proses dan membangun kemampuan pemecahan masalah.

### Apakah shop floor management cocok untuk perusahaan kecil?

Ya. ifaa menguji model penerapannya di beberapa perusahaan kecil dan menengah dan menemukan bahwa model ini dapat diperkenalkan dengan sarana sederhana [2]. Di perusahaan kecil, dua level sering sudah cukup: rapat tim dan rapat kepemimpinan.

### Apakah saya memerlukan perangkat lunak untuk shop floor management?

Tidak untuk memulai. Papan tulis, magnet, dan spidol sudah cukup untuk membangun rutinitas. Perangkat lunak menjadi bermanfaat ketika beberapa level, shift, atau situs harus dihubungkan, ketika pencatatan data manual menjadi terlalu memberatkan, atau ketika tindakan hilang di antara level [24].

### Dapatkah saya membangun papan lantai produksi digital dengan Microsoft Teams dan Power BI?

Bisa. Laporan Power BI dapat disematkan sebagai tab di channel Teams [28], Power Apps menangani pencatatan data di workstation [30], Microsoft Lists untuk daftar tindakan [38], dan Microsoft Fabric Real-Time Intelligence untuk peringatan real-time [32][33]. Perhatikan persyaratan lisensi untuk viewer (viewer gratis hanya tersedia dari Fabric F64 atau kapasitas Premium), interval minimum penyegaran halaman otomatis di Power BI (30 menit pada kapasitas bersama), dan penghentian Dataverse for Teams [28][29][45].

### Berapa lama waktu yang dibutuhkan untuk menerapkan shop floor management?

Untuk area percontohan, model ifaa menyediakan fase uji coba sekitar tiga bulan setelah penetapan tujuan, lokakarya informasi dan pengenalan [2]. Penerapan ke seluruh pabrik dengan cascade yang berfungsi di semua level membutuhkan waktu jauh lebih lama tergantung ukuran, karena setiap level sebaiknya berjalan andal sebelum level berikutnya dibangun.

## Kesimpulan

Shop floor management bukanlah papan tulis dan bukan perangkat lunak, melainkan sebuah sistem kepemimpinan dengan mekanisme yang jelas: pemimpin pergi ke tempat nilai diciptakan, tim membuat penyimpangan terlihat dengan beberapa KPI yang dapat mereka pengaruhi, rapat tier singkat yang terjadwal membawa masalah pada hari yang sama ke tempat masalah itu dapat dipecahkan, dan setiap solusi menjadi standar baru hanya setelah efeknya terbukti. Gemba walk adalah rutinitas tempat pemimpin memahami, bukan berasumsi.

Pengalaman yang terdokumentasi menunjukkan dua hal. Pertama, shop floor management sudah luas diterapkan tetapi sering gagal dengan pola yang sama: tidak adanya keterkaitan antar-level, papan yang terlalu penuh, rapat yang berlangsung terlalu lama, dan kurangnya keterlibatan manajemen [3]. Kedua, kondisi saat ini sebagian besar masih analog, dengan serah terima yang terputus antar alat yang membuat eskalasi dan pelacakan tindakan lebih sulit [24]. Digitalisasi dapat membantu, tetapi hanya ketika rutinitasnya sudah dijalankan.

Bagi perusahaan yang menggunakan Microsoft 365, papan digital dengan Teams, Power BI, Power Apps, Lists dan Fabric adalah pilihan yang jelas. Rencanakan model data, lisensi, interval penyegaran, dan aturan data karyawan sejak awal. Dan mulailah dari tempat setiap penerapan seharusnya dimulai: dengan satu tim percontohan, satu papan sederhana, batas waktu 15 menit, dan seorang pemimpin yang mendengarkan.

## Bacaan lebih lanjut di m365.fm

**Postingan blog**
- [Apa itu gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Daftar periksa dan pertanyaan gemba walk](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Persiapan gemba walk: tim dan peran](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Kesalahan gemba walk: ketika walk berubah menjadi inspeksi](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Budaya operational excellence di shop floor](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Optimalisasi shop floor: cara meningkatkan aliran](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Istilah**
[Shop floor management](https://www.m365.fm/entity/shop-floor-management/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [Tier meeting](https://www.m365.fm/entity/tier-meeting/) · [Visual management](https://www.m365.fm/entity/visual-management/) · [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) · [Micro stops](https://www.m365.fm/entity/micro-stops/) · [Scrap rate](https://www.m365.fm/entity/scrap-rate/) · [Lean management](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**Panduan terkait**
- [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** adalah pembawa acara m365.fm dan bekerja di [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) di Stuttgart, Jerman. Di m365.fm ia menulis tentang lean management, operational excellence, dan digitalisasi manufaktur dengan Microsoft 365 dan Azure. Fokusnya adalah bagaimana rutinitas lean yang terbukti, seperti shopfloor management dan gemba walk, dapat berjalan bersama platform data modern tanpa kehilangan inti utamanya.

**Catatan: Penulis bekerja di iFAKT GmbH.**

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
