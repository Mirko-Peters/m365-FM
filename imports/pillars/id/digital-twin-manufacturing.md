# SEO metadata

| Field | Value |
|---|---|
| Meta title | Digital Twin dalam Manufaktur: Panduan Lengkap |
| Meta description | Digital twin dalam manufaktur dijelaskan: twin vs. shadow vs. simulasi, simulasi pabrik, virtual commissioning, AGV, ISO 23247, dan peta jalan. |
| Slug | `digital-twin-manufacturing` |

# Digital Twin dalam Manufaktur: Panduan Lengkap untuk Simulasi Pabrik, Aliran Material, dan Virtual Commissioning

*Terakhir diperbarui: 20 November 2026 · Ditinjau secara teknis terhadap standar, sumber primer dan publikasi yang tercantum di bagian Sumber*

> **Jawaban singkat:** Digital twin dalam manufaktur adalah representasi digital yang dapat dieksekusi dari produk, proses dan sumber daya pabrik, yang diperbarui dengan data dari operasi nyata, idealnya secara otomatis. Anda menggunakannya untuk mensimulasikan operasi, menilai hambatan dan skenario sebelumnya, melakukan commissioning perangkat lunak kontrol secara virtual, dan mengambil keputusan sebelum Anda mengubah apa pun di lantai produksi yang sebenarnya.

Istilah "digital twin" digunakan secara begitu longgar sehingga hampir kehilangan maknanya. Model 3D sebuah bangunan disebut digital twin. Begitu pula dasbor data mesin, dan kadang-kadang lembar kerja kapasitas dengan sel merah, kuning dan hijau. Bagi para pimpinan pabrik dan operasi, ini adalah masalah nyata: jika Anda tidak tahu persis apa yang ingin dibangun, Anda membeli hal yang salah, mengumpulkan data tanpa pertanyaan yang perlu dijawab, dan setahun kemudian berakhir dengan proyek visualisasi yang mahal namun tidak memperbaiki satu pun keputusan.

Panduan ini meluruskan terminologi dan menelusuri setiap lapisannya: dari asal-usul konsep dengan Michael Grieves dan NASA, melalui standar (ISO 23247, ISA-95, Asset Administration Shell, dan pedoman VDI Jerman tentang simulasi dan virtual commissioning yang masih menjadi acuan sebagian besar industri), hingga pertanyaan praktis tentang cara menurunkan production twin yang berguna dari data yang sudah ada di sistem ERP Anda. Fokusnya pada keputusan yang benar-benar diambil tim manufaktur: perencanaan pabrik dan tata letak, kapasitas dan hambatan, bauran produk, kualitas jadwal, virtual commissioning, dan penentuan ukuran armada automated guided vehicle (AGV). Untuk definisi ringkas, lihat halaman entitas [Digital Twin](https://www.m365.fm/entity/digital-twin/).

### Poin-poin utama

- **Digital twin** berbeda dari model digital dan digital shadow karena **aliran data otomatis di kedua arah** [5]. Dalam perencanaan pabrik, banyak solusi produktif sengaja bekerja sebagai model atau shadow, dan itu bukan kekurangan.
- Inti dari production twin adalah **model produk-proses-sumber daya (PPR)**: apa yang dibuat (bill of materials), bagaimana (routing, waktu, urutan) dan dengan apa (mesin, tenaga kerja, ruang lantai, penanganan material). Sebagian besar data ini sudah berada di **sistem ERP** Anda.
- **Simulasi** mengubah model menjadi alat pengambilan keputusan. Dalam manufaktur dan logistik, **simulasi kejadian diskret** mendominasi; rujukan metodologis klasiknya adalah pedoman Jerman VDI 3633 [13], dan teks standar di AS adalah *Simulation Modeling and Analysis* karya Law [41].
- Standar utamanya adalah **ISO 23247** (kerangka kerja digital twin untuk manufaktur, Bagian 1 hingga 4 sejak 2021, Bagian 5 dan 6 sejak 2026) [6][7][8], **IEC 63278-1** (Asset Administration Shell) [10] dan **ISA-95 / IEC 62264** (integrasi enterprise-control) [58]. NIST mendukung ISO 23247 dengan panduan kasus penggunaan dan implementasi referensi bagi produsen di AS [47][48].
- Mulailah dengan **satu keputusan konkret**, bukan dengan platform. Twin tanpa pertanyaan akan menjadi kuburan data.
- **Kualitas data** menentukan keberhasilan atau kegagalan: waktu standar, waktu setup, kalender shift dan catatan downtime sering kali kurang akurat daripada yang disiratkan oleh master data.
- Di Microsoft, **Azure Digital Twins** adalah layanan PaaS yang tersedia umum dan mendukung DTDL v2 dan v3 [21][22]; **digital twin builder di Microsoft Fabric** masih berlabel **preview** pada saat penulisan ini [23].

### Jalur membaca bagi pembaca yang sibuk

| Anda adalah ... | Baca terlebih dahulu |
|---|---|
| Insinyur manufaktur atau perencana pabrik | Bagian 2, 6, 7 dan 10 (definisi, simulasi, kasus penggunaan, peta jalan) |
| Manajer pabrik, VP operasi, eksekutif | Jawaban singkat, bagian 4, 12 dan 13 (tingkat kematangan, biaya dan manfaat, kesalahan umum) |
| Insinyur kontrol atau otomasi | Bagian 7.5 (virtual commissioning) dan 14 (standar) |
| Pemimpin proyek intralogistik, AGV/AMR | Bagian 7.6 (perencanaan armada AGV dan AMR) |
| Admin M365/Azure, arsitek IT/OT | Bagian 5, 8 dan 16 (arsitektur, layanan Microsoft, keamanan) |

## Daftar isi

1. [Apa itu digital twin dalam manufaktur?](#1-apa-itu-digital-twin-dalam-manufaktur)
2. [Model digital vs. bayangan digital vs. digital twin](#2-model-digital-vs-bayangan-digital-vs-digital-twin)
3. [Jenis digital twin dalam manufaktur](#3-jenis-digital-twin-dalam-manufaktur)
4. [Tingkat kematangan: dari representasi hingga sistem yang mengoptimalkan diri sendiri](#4-tingkat-kematangan-dari-representasi-hingga-sistem-yang-mengoptimalkan-diri-sendiri)
5. [Arsitektur dan fondasi data: ERP, MES, PLM, IoT](#5-arsitektur-dan-fondasi-data-erp-mes-plm-iot)
6. [Simulasi sebagai inti: simulasi pabrik, aliran material dan value stream](#6-simulasi-sebagai-inti-simulasi-pabrik-aliran-material-dan-value-stream)
7. [Kasus penggunaan dan data yang dibutuhkan masing-masing](#7-kasus-penggunaan-dan-data-yang-dibutuhkan-masing-masing)
8. [Digital twin dengan Microsoft Azure dan Fabric](#8-digital-twin-dengan-microsoft-azure-dan-fabric)
9. [Kecerdasan buatan dan digital twin](#9-kecerdasan-buatan-dan-digital-twin)
10. [Peta jalan: implementasi dalam enam fase](#10-peta-jalan-implementasi-dalam-enam-fase)
11. [Kualitas data: prasyarat yang kurang dihargai](#11-kualitas-data-prasyarat-yang-kurang-dihargai)
12. [Biaya dan manfaat, dinilai secara jujur](#12-biaya-dan-manfaat-dinilai-secara-jujur)
13. [Kesalahan umum dan cara menghindarinya](#13-kesalahan-umum-dan-cara-menghindarinya)
14. [Standar dan pedoman sekilas](#14-standar-dan-pedoman-sekilas)
15. [Kategori perangkat lunak: perbandingan netral](#15-kategori-perangkat-lunak-perbandingan-netral)
16. [Keamanan, kepemilikan data dan regulasi](#16-keamanan-kepemilikan-data-dan-regulasi)
17. [Membangun twin dari data ERP dan value stream dengan iFAKT Polaris](#17-membangun-twin-dari-data-erp-dan-value-stream-dengan-ifakt-polaris)
18. [Glosarium](#18-glosarium)
19. [FAQ: digital twin dalam manufaktur](#19-faq-digital-twin-dalam-manufaktur)
20. [Kesimpulan](#20-kesimpulan)

## 1. Apa itu digital twin dalam manufaktur?

### Definisi kerja

Dalam praktik manufaktur, definisi kerja dengan tiga syarat telah terbukti berguna:

1. **Ia merepresentasikan pasangan nyata.** Twin mewakili objek tertentu (sebuah mesin, sebuah lini, sebuah pabrik) atau proses tertentu, bukan kelas umum.
2. **Ia dapat dieksekusi.** Ia tidak hanya memuat struktur dan geometri tetapi juga perilaku. Ia dapat memajukan keadaan, memutar ulang operasi dan menjawab pertanyaan "apa yang terjadi jika ...?"
3. **Ia terhubung dengan realitas melalui data.** Ia diperbarui dari data operasi, idealnya secara otomatis, dan hasilnya kembali mengalir ke keputusan atau kendali.

Tanpa poin 2, yang Anda miliki adalah basis data atau model 3D. Tanpa poin 3, yang Anda miliki adalah model simulasi. Keduanya berguna, tetapi tidak satu pun merupakan twin dalam arti sempit.

Lembaga-lembaga AS mendefinisikan istilah ini dengan cara serupa. Definisi Digital Twin Consortium tanggal 3 Desember 2020 menyebut digital twin sebagai "representasi virtual dari entitas dan proses dunia nyata, yang disinkronkan pada frekuensi dan tingkat fidelitas tertentu" [51]. Laporan konsensus 2024 dari National Academies of Sciences, Engineering, and Medicine, yang disponsori oleh US Department of Defense, Department of Energy, National Institutes of Health dan National Science Foundation, menggambarkan digital twin sebagai sekumpulan konstruksi informasi virtual yang meniru struktur, konteks dan perilaku suatu sistem, "diperbarui secara dinamis dengan data dari twin fisiknya, memiliki kemampuan prediktif, dan menginformasikan keputusan yang menghasilkan nilai," dan menambahkan: "Interaksi dua arah antara yang virtual dan yang fisik adalah inti dari digital twin" [50]. NIST menggambarkan digital twin sebagai representasi elektronik dari entitas dunia nyata yang memungkinkan orang mengamati entitas tersebut dan perubahan keadaannya, serta mengkaji isu keamanan dan kepercayaan yang ditimbulkannya [49]. Ketiga definisi tersebut memuat unsur yang sama dengan definisi kerja di atas: pasangan nyata, perilaku, dan koneksi data.

### Digital twin, smart factory, digital factory: istilah yang diluruskan

Dalam bahasa Inggris, Anda akan menemukan istilah "digital twin in manufacturing", "manufacturing digital twin", "factory digital twin", dan "production digital twin" yang digunakan untuk konsep yang sama. **Smart factory** (atau smart manufacturing) adalah hal yang berbeda: pabrik yang terhubung dan sebagian besar mengatur dirinya sendiri, sebagai gambaran target dari Industry 4.0. Digital twin merupakan salah satu alatnya, bukan sinonim. **Digital factory** adalah istilah payung yang lebih lama dan berorientasi perencanaan dari pedoman Jerman VDI 4499 untuk model, metode, dan alat digital (lihat di bawah); di Amerika Utara, istilah sehari-hari yang paling dekat adalah "digital manufacturing" dan "virtual manufacturing". Istilah seperti production simulation, factory simulation, dan material flow simulation menggambarkan metode yang dapat digunakan oleh digital twin. **Digital thread** menggambarkan aliran informasi yang saling terhubung sepanjang siklus hidup; ISO 23247-5 kini membahasnya secara eksplisit [7].

### Asal-usul: dari Grieves dan NASA hingga Industry 4.0

Konsep ini berasal dari product lifecycle management (PLM). Michael Grieves memaparkan sebuah model pada 2002 yang menghubungkan ruang nyata, ruang virtual, dan aliran data serta informasi di antara keduanya. Ia menanggalkan presentasi pertama pada forum manajemen Society of Manufacturing Engineers (SME) pada Oktober 2002 dan presentasi di University of Michigan pada Desember 2002 [2]. Model tersebut pertama kali disebut "Mirrored Spaces Model" (2005), kemudian "Information Mirroring Model" (2006), dan kemudian "Digital Twin"; menurut Grieves, konsepnya sendiri tetap sama [2]. Grieves mengaitkan penamaan "digital twin" dengan John Vickers dari NASA [1][2]. Penulis lain menunjukkan bahwa kisah asal-usul ini tidak dapat didokumentasikan tanpa celah dan bahwa ada pendahulunya, seperti penelitian tentang virtual manufacturing pada 1990-an [4].

Istilah ini mendapat perhatian luas melalui industri dirgantara. NASA menjelaskan digital twin dalam peta jalan teknologinya "Modeling, Simulation, Information Technology & Processing" (Shafto dkk., draf 2010) [4]. Pada 2012, Glaessgen dan Stargel merumuskan definisi yang sering dikutip untuk NASA dan US Air Force, yaitu digital twin sebagai "integrated multiphysics, multiscale, probabilistic simulation of an as-built vehicle or system" yang menggabungkan simulasi berfidelitas sangat tinggi dengan pemantauan kesehatan, riwayat pemeliharaan, dan data armada untuk mencerminkan siklus hidup kembarannya yang terbang [3].

Dalam manufaktur Jerman, istilah ini menjadi terkait dengan Industrie 4.0 sejak pertengahan 2010-an. Di sana, istilah ini bertemu dengan tradisi yang lebih tua dan independen: **Digital Factory** (VDI 4499) dan **discrete event simulation of material flow** (VDI 3633). Di AS, simulasi pabrik berkembang dari operations research dan industrial engineering, dengan buku teks seperti karya Law [41] dan alat discrete event komersial. Di kedua sisi Atlantik, banyak alat yang kini dipasarkan sebagai digital twin secara metodologis merupakan turunan dari simulasi pabrik ini. Untuk konteks lebih lanjut, lihat halaman entitas [Industry 4.0](https://www.m365.fm/entity/industry-4-0/).

### Definisi formal dalam standar

Standar formal telah ada sejak 2021. **ISO 23247** ("Automation systems and integration: Digital twin framework for manufacturing") mendefinisikan kerangka kerja untuk digital twin dalam manufaktur. Bagian 1 hingga 4 (ikhtisar, arsitektur referensi, representasi digital elemen manufaktur, pertukaran informasi) diterbitkan pada Oktober 2021 (Bagian 1 pada 21 Oktober 2021) [6]. Bagian 5 ("Digital thread for digital twin") dan Bagian 6 ("Digital twin composition", diterbitkan 14 Juli 2026) menyusul pada 2026 [7][8]. **ISO/IEC 30173:2023** menetapkan istilah dan konsep lintas industri, termasuk proses siklus hidup, jenis-jenis digital twin, tampilan fungsional, dan pemangku kepentingan [9].

Bagi produsen AS, NIST menawarkan titik awal yang praktis untuk ISO 23247. Laporannya *Use Case Scenarios for Digital Twin Implementation Based on ISO 23247* (NIST AMS 400-2, Guodong Shao, Mei 2021) ditulis secara eksplisit untuk mengurangi kebingungan tentang digital twin di kalangan produsen kecil dan menengah, serta membahas tiga kasus penggunaan yang dibangun di atas kerangka kerja tersebut [47]. Proyek NIST yang sedang berjalan, "Digital Twins for Advanced Manufacturing", berkontribusi pada ISO 23247, mengerjakan implementasi referensi Bagian 5 (digital thread), dan mengusulkan kerangka verification, validation and uncertainty quantification (VVUQ) sebagai Bagian 7 di masa depan; proyek ini menyebut "kurangnya standar" sebagai hambatan utama adopsi [48].

Untuk perencanaan pabrik, definisi Digital Factory dari Jerman dalam VDI 4499 Bagian 1 tetap berpengaruh. Edisi 2008 berbunyi (terjemahan kami): "Digital Factory adalah istilah umum untuk jaringan menyeluruh dari model, metode dan alat digital, termasuk simulasi dan visualisasi tiga dimensi, yang diintegrasikan melalui pengelolaan data yang berkelanjutan. Tujuannya adalah perencanaan holistik, evaluasi, dan peningkatan berkelanjutan atas seluruh struktur, proses, dan sumber daya esensial dari pabrik nyata beserta kaitannya dengan produk." [17] Edisi baru VDI 4499 Bagian 1 terbit pada April 2026, mencakup istilah, tujuan, proses, pengelolaan data, dan arsitektur sistem Digital Factory [16]. Jika Anda mengutipnya, periksa apakah rumusan edisi baru berbeda.

Perhatikan frasa "struktur, proses, dan sumber daya ... beserta kaitannya dengan produk". Frasa ini sudah memuat pemikiran produk-proses-sumber daya yang menjadi dasar production twin (lihat bagian 5, "Model produk-proses-sumber daya sebagai inti").

## 2. Model digital vs. bayangan digital vs. kembaran digital

Pembedaan yang paling sering dikutip untuk manufaktur berasal dari Kritzinger, Karner, Traar, Henjes dan Sihn (Fraunhofer Austria) pada tahun 2018 [5]. Mereka membedakan tiga tingkat integrasi berdasarkan cara data mengalir antara objek fisik dan objek digital.

| Atribut | Model digital | Bayangan digital | Kembaran digital |
|---|---|---|---|
| Aliran data fisik → digital | manual | otomatis | otomatis |
| Aliran data digital → fisik | manual | manual | otomatis |
| Contoh tipikal | model simulasi lini yang direncanakan, tata letak CAD | model simulasi yang diperbarui harian dengan pesanan dan konfirmasi dari ERP/MES | model yang secara otomatis mengirimkan urutan produksi atau parameter kembali ke sistem kendali |
| Keadaan objek fisik | tidak harus sudah ada | ada, diamati | ada, diamati dan dipengaruhi |
| Penggunaan tipikal | perencanaan pabrik, greenfield, keputusan investasi modal | pemantauan, analisis kondisi nyata, peramalan, validasi jadwal | kendali lingkar tertutup, penjadwalan rinci, optimalisasi otonom |
| Tuntutan terhadap TI dan tata kelola | rendah | sedang (antarmuka, kualitas data) | tinggi (waktu nyata, keamanan, proses persetujuan) |

Dalam tinjauan pustakanya, Kritzinger dkk. menemukan bahwa publikasi tentang tingkat tertinggi, yaitu kembaran sejati, jarang, sedangkan model dan bayangan jauh lebih sering dijelaskan [5]. Hal itu sesuai dengan praktik: dalam perencanaan pabrik dan produksi, umpan balik otomatis ke sistem kendali sering kali bahkan tidak diinginkan. Perencana ingin membandingkan skenario lalu memutuskan secara sengaja. Model yang mengubah urutan produksi Anda tanpa persetujuan tidak dapat diterima di banyak pabrik, baik dari sisi organisasi maupun tanggung jawab hukum.

Konsekuensinya untuk proyek Anda: jangan bertanya "Apakah kita punya kembaran sejati?" Tanyakan "Tingkat integrasi apa yang dibutuhkan oleh keputusan yang ingin kita perbaiki?" Untuk keputusan modal pada bangunan perakitan baru, model yang tervalidasi dengan baik sudah cukup. Untuk pemeriksaan harian apakah jadwal minggu ini realistis, Anda memerlukan bayangan dengan umpan data otomatis. Hanya untuk kendali lingkar tertutup, seperti pengurutan otomatis pada stasiun penghambat (bottleneck), upaya membangun kembaran penuh baru sepadan.

**Pandangan kedua tentang "bayangan":** Dalam rekayasa produksi Jerman, "digital shadow" kadang dipakai dalam arti yang lebih sempit, yaitu gambaran data produksi yang cukup akurat dan spesifik untuk tugas tertentu tanpa kemampuan simulasi. Sebagian vendor juga menggambarkan bayangan sebagai "salinan statis data historis". Pembacaan-pembacaan ini berbeda dari Kritzinger dkk. Sumber-sumber AS jarang memakai istilah "digital shadow" dan sering menyebut setiap tingkat sebagai kembaran. Jika Anda menggunakan salah satu istilah ini dalam permintaan penawaran (RFP) atau dokumen persyaratan, definisikan secara eksplisit.

## 3. Jenis-jenis digital twin dalam manufaktur

Digital twin dapat diklasifikasikan berdasarkan objek yang direpresentasikan dan berdasarkan fase siklus hidupnya. Klasifikasi di bawah ini umum dalam literatur dan praktik, tetapi tidak distandarkan; ISO/IEC 30173 menjelaskan jenis-jenis digital twin pada tingkat yang lebih umum [9]. Penjelasan dari AS sering menggunakan skema empat tingkat, yaitu component (atau part) twin, asset twin, system (atau unit) twin dan process twin, yang dipopulerkan oleh IBM [52]. Tabel di bawah ini lebih spesifik untuk manufaktur.

| Jenis | Merepresentasikan | Pertanyaan tipikal | Sumber data utama |
|---|---|---|---|
| Product twin | produk sepanjang siklus hidupnya (geometri, varian, properti, kondisi di lapangan) | Apakah desainnya memenuhi persyaratan? Bagaimana produk berperilaku saat digunakan? | CAD, PLM, analisis (FEA, CFD), data lapangan |
| Process twin | proses manufaktur (milling, pengelasan, injection molding, perakitan) | Parameter mana yang menghasilkan kualitas stabil? Di mana scrap dan rework muncul? | kontrol mesin, sensor, data kualitas, model proses |
| Machine atau asset twin | mesin atau peralatan dengan kinematika, logika kontrol dan kondisinya | Apakah logika PLC berfungsi? Kapan perawatan harus dilakukan? | CAD mekanik, CAD elektrikal, program PLC, data kondisi |
| Production atau factory twin | interaksi antara pesanan, proses, sumber daya, aliran material dan logistik | Apakah kapasitasnya cukup? Di mana bottleneck-nya? Tata letak, buffer, dan jumlah AGV yang bagaimana? | ERP, MES, data value stream, tata letak, pola shift |
| Performance atau operations twin | metrik kinerja berkelanjutan dari suatu sistem | Bagaimana tren OEE, lead time, on-time delivery dan konsumsi energi? | MES, pengumpulan data produksi, meter energi, IoT |
| Supply chain twin | pemasok, lokasi, transportasi, persediaan | Apa yang terjadi jika pemasok gagal? Di mana safety stock sebaiknya disimpan? | ERP, SCM, data logistik |

Jenis-jenis ini tidak terpisah secara tegas; mereka saling bersarang. Factory twin dapat menyematkan asset twin yang lebih rinci untuk satu mesin bottleneck. Komposisi dari beberapa twin inilah yang dicakup oleh Part 6 baru dari ISO 23247 [8].

**Fase siklus hidup:** Banyak penulis juga membedakan twin "as designed" (kondisi perencanaan), "as built" (yang benar-benar dibangun) dan "as operated" atau "as maintained" (dalam operasi). Hal ini penting untuk perencanaan pabrik: model perencanaan menggambarkan pabrik yang belum ada, sehingga tidak boleh dikacaukan dengan data operasi yang belum mungkin ada.

**Tingkat detail:** Dalam discrete event simulation, Anda juga membedakan tingkat agregasi, dari level jaringan dan pabrik, melalui area, lini dan sel, hingga ke mesin tunggal. VDI 3633 mencakup simulasi tingkat mesin dengan gerakan 3D, dan simulasi proses di bagian terpisah [13]. Keahliannya adalah memilih tingkat yang seagregat mungkin dan serinci yang diperlukan.

## 4. Tingkat kematangan: dari representasi ke sistem yang mengoptimalkan diri sendiri

Model kematangan membantu Anda menilai titik awal dan menetapkan tujuan yang realistis. Di negara-negara berbahasa Jerman, **acatech Industrie 4.0 Maturity Index** banyak digunakan (acatech adalah Akademi Nasional Sains dan Teknik Jerman). Model ini menjelaskan enam tahap pengembangan dan menilai sumber daya, sistem informasi, budaya, serta struktur organisasi; edisi yang diperbarui terbit pada 2020 [20]. Tahapannya adalah komputerisasi, konektivitas, visibilitas, transparansi, kemampuan prediktif, dan kemampuan adaptasi.

Untuk digital twin, hal ini diterjemahkan menjadi skala praktis:

| Tingkat | Pertanyaan panduan | Yang diberikan twin | Prasyarat |
|---|---|---|---|
| 1 Merepresentasikan | Apa yang kita miliki? | model terstruktur tentang produk, proses, sumber daya (data induk, tata letak) | data induk yang terpelihara, penamaan yang konsisten |
| 2 Mengamati | Apa yang sedang terjadi? | kondisi terkini dari konfirmasi, data mesin, persediaan (visibilitas) | antarmuka ke ERP/MES, cap waktu |
| 3 Memahami | Mengapa hal itu terjadi? | analisis akar penyebab, identifikasi bottleneck, analisis varians (transparansi) | data yang tercatat secara historis, definisi metrik |
| 4 Memprediksi | Apa yang akan terjadi? | simulasi dan peramalan lead time, utilisasi, tanggal jatuh tempo | model simulasi yang tervalidasi, data perencanaan |
| 5 Merekomendasikan | Apa yang sebaiknya kita lakukan? | perbandingan skenario, optimisasi, tindakan yang direkomendasikan | fungsi objektif, metode optimisasi |
| 6 Bertindak | Apa yang terjadi secara otomatis? | loop tertutup ke kontrol (adaptabilitas) | konsep persetujuan, keamanan TI, akuntabilitas yang jelas |

Dalam materi konsultan dan vendor, Anda sering menemukan pembagian tiga tahap yang lebih pendek, yaitu twin deskriptif, prediktif, dan preskriptif. Pembagian ini kurang lebih sesuai dengan tingkat 2 sampai 3, 4, dan 5 sampai 6 pada tabel.

**Penting:** Tingkat-tingkat tersebut bukan urutan wajib. Digital twin untuk perencanaan pabrik dapat sangat bernilai pada tingkat 4 tanpa pernah mencapai tingkat 2, karena pabrik yang direncanakan belum ada. Sebaliknya, dasbor pemantauan pada tingkat 2 bukanlah batu loncatan menuju simulasi jika model datanya tidak memuat logika proses. Rencanakan tingkat-tingkat tersebut berdasarkan pertanyaan Anda, bukan berdasarkan sebuah model.

## 5. Arsitektur dan fondasi data: ERP, MES, PLM, IoT

### Model referensi ISO 23247

ISO 23247-2 mengorganisasikan digital twin manufaktur ke dalam domain-domain [6][43]:

- **Elemen manufaktur yang dapat diamati:** personel, peralatan, material, proses manufaktur, fasilitas, lingkungan, produk, dan dokumen pendukung [6]. Elemen-elemen ini berada di luar twin tetapi direpresentasikan olehnya.
- **Komunikasi perangkat:** pengumpulan data dan kontrol perangkat, seperti konektivitas pengontrol, sensor, dan gateway.
- **Digital twin (inti):** representasi, sinkronisasi, aplikasi, dan layanan seperti simulasi, analitik, serta validasi jadwal.
- **Pengguna:** orang dan aplikasi yang menggunakan twin, seperti stasiun kerja perencana atau sistem perusahaan seperti ERP dan MES.
- **Fungsi lintas sistem:** penerjemahan data, jaminan data, dan keamanan.

Model ini netral terhadap vendor dan cocok sebagai kerangka dokumen persyaratan atau RFP. NIST menggunakan struktur yang persis sama untuk tiga skenario use case ISO 23247-nya [47]. Yang terpenting, model ini memperjelas satu hal: twin bukanlah visualisasi. Twin adalah lapisan di antaranya yang merepresentasikan, menyinkronkan, dan melakukan perhitungan.

### Sistem menurut tingkat ISA-95: siapa yang memasok data apa?

Standar ISA-95 (ANSI/ISA-95, secara internasional IEC 62264) mengorganisasikan sistem pabrik ke dalam tingkat-tingkat berdasarkan model Purdue [58][19][42]: tingkat 0 adalah proses fisik, tingkat 1 sensing dan aktuasi, tingkat 2 kontrol proses (PLC, SCADA, HMI), tingkat 3 manajemen operasi manufaktur (MES), dan tingkat 4 perencanaan bisnis dan logistik (ERP). ISA mencatat bahwa standar ini terutama membahas antarmuka antara tingkat 3 dan 4 [58]. Untuk digital twin, hal ini memberi Anda peta data yang jelas:

| Sistem (level) | Memasok ke twin | Granularitas tipikal | Kelemahan tipikal |
|---|---|---|---|
| ERP (4) | master material, bill of materials, routing, work center, kapasitas, kalender shift, pesanan penjualan dan produksi, konfirmasi | pesanan, operasi, hari/shift | waktu standar usang, waktu setup datar, kelompok work center terlalu kasar |
| MES (3) | waktu aktual, alasan downtime, kuantitas, scrap, penugasan tenaga kerja, urutan | operasi, menit | kode alasan downtime tidak konsisten, celah pada entri manual |
| PLM/CAD | struktur produk (EBOM), geometri, varian, tingkat revisi | part, versi | EBOM dan manufacturing BOM (MBOM) tidak sinkron |
| Layout/CAD pabrik | ruang lantai, gang, posisi, konveyor | kaki/meter | layout usang, brownfield sering tidak terdokumentasi |
| PLC/SCADA (2) | status, waktu siklus, sinyal | milidetik hingga detik | sedikit makna tanpa konteks (pesanan yang mana?) |
| IoT/sensor (1) | energi, suhu, getaran, posisi (misalnya AGV) | detik | volume data tinggi, pemetaan aset hilang |
| Pergudangan/intralogistik (WMS, manajer armada AGV) | persediaan, order transportasi, waktu tempuh | pesanan, detik | waktu tempuh sering tidak dihistoriskan |

Untuk twin produksi dan pabrik, sebagian besar struktur yang dibutuhkan berada pada level 3 dan 4. Data mesin dari level 1 dan 2 memperbaiki distribusi dan model downtime, tetapi jarang menjadi titik awal. Jika Anda menghubungkan mesin, dua standar terbuka yang paling penting adalah OPC UA (IEC 62541) dan, yang umum di bengkel mesin AS, **MTConnect**, standar terbuka untuk interoperabilitas data manufaktur yang juga diterbitkan sebagai standar ANSI (ANSI/MTC1.4-2018) [57]. NIST mencantumkan antarmuka MTConnect untuk digital twin sebagai bagian dari pekerjaan proyeknya [48]. Posting [From ERP to the shop floor: the digital twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/) menunjukkan seperti apa jembatan dari ERP ke shop floor dalam praktik. Untuk dasar-dasar ERP, lihat halaman entitas [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/).

### Model product-process-resource sebagai inti

Dalam praktik pabrik digital, **model product-process-resource (PPR)** telah menjadi prinsip penataan. Model ini menghubungkan tiga pandangan:

- **Product:** Apa yang dibuat? Produk jadi, rakitan, komponen dan hubungan di antaranya (bill of materials, varian).
- **Process:** Bagaimana cara membuatnya? Operasi, urutan, hubungan predecessor-successor, waktu (setup, run, penanganan), ukuran lot.
- **Resource:** Dengan apa dibuatnya? Mesin, work center, tenaga kerja dengan keterampilan, perkakas, ruang lantai, peralatan penanganan material, pola shift.

Nilainya terletak pada **tepi** antar-simpul: operasi mana mengonsumsi rakitan mana, pada resource apa, dengan waktu berapa, di bawah kendala apa? Modelkan jaringan ini sebagai graf, dan Anda dapat secara otomatis menurunkan diagram jaringan, jalur kritis, resource bottleneck, dan model simulasi darinya. Graf seperti ini juga menjadi fondasi semantik tempat algoritma perencanaan dan layanan AI dapat bekerja.

Keunggulannya dibandingkan twin 3D atau IoT murni bersifat praktis: model PPR menjawab pertanyaan yang setiap hari diajukan perencana produksi dan pabrik (kapasitas, lead time, bottleneck, kebutuhan tenaga kerja), dan sebagian besar dapat dibangun dari data yang sudah ada.

### Membangun twin dari data ERP dan value stream

Cerita digital twin yang biasa dimulai dari sensor. Untuk pertanyaan produksi, itu sering kali titik awal yang keliru. Sistem ERP Anda sudah memuat cetak biru pabrik Anda dalam bentuk terstruktur:

| Objek ERP | Peran dalam twin |
|---|---|
| Master material dan bill of materials (manufacturing BOM, MBOM) | struktur produk, eksplosi kebutuhan, urutan perakitan |
| Routing dengan operasi | logika proses, urutan, waktu standar untuk setup dan run |
| Work center atau kelompok work center | resource, kapasitas tersedia, pusat biaya |
| Kalender pabrik dan pola shift | waktu tersedia, istirahat, shift tambahan |
| Pesanan penjualan dan forecast | beban, bauran produk, tanggal jatuh tempo |
| Pesanan produksi dan konfirmasi | waktu aktual, kuantitas aktual, scrap, kemajuan |
| Parameter persediaan dan MRP | buffer, safety stock, aturan lot-sizing |

**Value stream mapping** memberikan pandangan kedua yang melengkapi: metode ini membuat aliran material dan informasi, persediaan di antara proses, serta logika pengendalian (push, pull, supermarket, FIFO) terlihat jelas, sesuatu yang hanya tersirat secara tidak langsung dalam tabel ERP. Mike Rother dan John Shook mempopulerkan metode ini pada 1998 melalui *Learning to See*, yang diterbitkan oleh Lean Enterprise Institute [40]. Jika logika value stream dipadukan dengan data master ERP dan konfirmasi produksi, Anda memperoleh model yang menangkap baik struktur maupun dinamika sistem produksi. Episode [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) memperlihatkan bagaimana sebuah peta value stream menjadi model data yang hidup; metodenya sendiri dijelaskan pada halaman entitas [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/), dan secara mendalam dalam panduan kami tentang [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

Pembahasan ini tidak baru dalam literatur. Sejak 2014, Türck, Weimer, Schubert dan Drees telah menguraikan dalam jurnal Jerman *Zeitschrift für wirtschaftlichen Fabrikbetrieb* (ZWF) langkah dari value stream mapping statis beserta metriknya menuju simulasi dinamis value stream, dan mempertanyakan opsi optimasi apa yang terbuka ketika waktu ditambahkan sebagai dimensi [31]. Pada 2023, Böhm, Drees, Sai, Erlach, Stambera dan Teriete menyajikan di ZWF sebuah antarmuka data universal untuk layanan value stream digital yang menggunakan data produksi berbasis event sebagai dasar bersama untuk perhitungan metrik dan visualisasi; antarmuka ini diuji dalam proyek riset Jerman ECOWERT [32].

### Semantik dan interoperabilitas: Asset Administration Shell, OPC UA, DTDL

Sebuah kembaran digital yang hanya hidup dalam basis data proprietary sulit diperluas. Tiga standar membentuk interoperabilitas:

- **Asset Administration Shell (AAS):** Konsep dari Plattform Industrie 4.0 Jerman untuk representasi digital terstandar dari sebuah aset. IEC 63278-1:2023 (diterbitkan 14 Desember 2023) mendefinisikan strukturnya dan bertujuan agar aplikasi perangkat lunak dapatertukar informasi secara seragam dan aman; standar ini berlaku untuk aset fisik, digital, dan tak berwujud di seluruh siklus hidup [10]. Konten diatur dalam submodel, misalnya untuk data teknis atau data operasi. German Reference Architecture Model Industrie 4.0 (RAMI 4.0, DIN SPEC 91345:2016) menjelaskan struktur dan perilaku komponen Industrie 4.0 yang merepresentasikan aset secara virtual [12]; dalam konsep Plattform Industrie 4.0, AAS adalah bagian digital dari komponen tersebut. Pengembangan lebih lanjutnya didorong oleh **Industrial Digital Twin Association (IDTA)**, yang didirikan pada 24 September 2020 oleh asosiasi industri teknik dan elektro Jerman VDMA dan ZVEI bersama Bitkom dan 20 perusahaan [11]. Implementasi open-source-nya adalah Eclipse BaSyx, yang dikembangkan antara lain oleh Fraunhofer IESE [29].
- **OPC UA (IEC 62541):** Standar yang luas digunakan untuk komunikasi mesin yang independen dari vendor dengan model informasi. Untuk kembaran digital, OPC UA terutama penting pada level 1 hingga 3.
- **DTDL (Digital Twins Definition Language):** Bahasa pemodelan berbasis JSON milik Microsoft untuk Azure Digital Twins. Azure Digital Twins mendukung DTDL v2 dan v3; Microsoft merekomendasikan v3 [22].

Tidak satu pun dari standar ini saja yang cukup untuk kembaran digital perencanaan produksi, karena standar tersebut terutama mendeskripsikan aset, bukan logika proses dan dinamika pesanan. Dalam praktiknya, Anda karena itu memadukan model perencanaan (PPR, simulasi) dengan deskripsi aset terstandar untuk konektivitas.

## 6. Simulasi sebagai inti: simulasi pabrik, aliran material, dan value stream

### Apa yang dilakukan simulasi dan mengapa perhitungan statis tidak memadai

VDI 3633 Bagian 1 (edisi Desember 2014), pedoman referensi Jerman, menjelaskan dasar-dasar simulasi sistem logistik, aliran material, dan sistem produksi, serta ditujukan kepada perencana, pemasok, dan operator [13]. Pedoman ini mendefinisikan simulasi sebagai proses mereproduksi sebuah sistem beserta proses dinamisnya dalam suatu model yang dapat dieksperimenkan, untuk memperoleh wawasan yang dapat dialihkan ke kenyataan [13][30]. Buku teks Law, yang banyak dipakai dalam program teknik industri di AS, membahas wilayah yang sama dari sisi statistik [41].

Poin yang menentukan adalah **dinamika**. Perhitungan kapasitas dengan spreadsheet bekerja dengan nilai rata-rata: permintaan dikali waktu proses, dibagi waktu yang tersedia, menghasilkan utilisasi. Jika setiap nilai berada di bawah 100 persen, rencana tampak berfungsi. Dalam kenyataannya, kedatangan, waktu proses, waktu setup, dan kerusakan mesin bervariasi. Teori antrean menunjukkan bahwa dengan waktu yang bervariasi, waktu tunggu tumbuh secara tidak proporsional seiring naiknya utilisasi, dan antrean besar terbentuk di depan stasiun yang beroperasi mendekati batas kapasitasnya. Interaksi antarstasiun (blocking, starving, sumber daya bersama seperti operator atau crane) sama sekali tidak dapat ditangkap oleh perhitungan statis.

**Contoh perhitungan:** Untuk satu stasiun, pendekatan Kingman memberikan gambaran skala [46]. Waktu tunggu rata-rata di depan stasiun kira-kira W ≈ (cₐ² + cₛ²) / 2 · u / (1 − u) · t, dengan u adalah utilisasi, t adalah waktu proses rata-rata, dan cₐ serta cₛ adalah koefisien variasi waktu antarkedatangan dan waktu proses. Misalkan waktu proses 10 menit dan variabilitas sedang (kedua koefisien variasi sama dengan 1):

| Utilisasi u | Faktor u / (1 − u) | Rata-rata tunggu di depan stasiun |
|---|---|---|
| 70% | 2,3 | kira-kira 23 menit |
| 80% | 4 | kira-kira 40 menit |
| 90% | 9 | kira-kira 90 menit |
| 95% | 19 | kira-kira 190 menit |

Spreadsheet kapasitas menyatakan "muat" di keempat kasus. Padahal, waktu tunggu hampir naik lima kali lipat antara utilisasi 80 dan 95 persen. Dalam lini dengan beberapa stasiun, setup, dan kerusakan, efeknya menjadi lebih kuat dan sulit ditangani secara analitis. Di sinilah simulasi berperan.

**Hukum Little** tetap menjadi pemeriksaan kewajaran yang berguna: dalam kondisi tunak, persediaan rata-rata dalam sistem sama dengan laju throughput rata-rata dikali lead time rata-rata (L = λ · W) [37]. Hukum Little memberi tahu lead time mana yang sesuai dengan persediaan tertentu, tetapi tidak memberi tahu persediaan apa yang dihasilkan oleh tingkat variabilitas tertentu. Untuk itu diperlukan simulasi.

### Perbandingan jenis simulasi

| Atribut | Discrete event simulation (DES) | Simulasi kontinu / system dynamics | Agent-based simulation (ABS) | Simulasi fisika dan gerak 3D |
|---|---|---|---|---|
| Kemajuan waktu | melompat dari satu kejadian ke kejadian berikutnya (kedatangan, selesai proses, kerusakan) | kontinu dalam langkah waktu kecil, persamaan diferensial | digerakkan kejadian atau langkah waktu, tergantung alat | langkah waktu halus, kinematika dan dinamika |
| Elemen model | sumber, penyerap, stasiun, buffer, konveyor, sumber daya, pesanan | stok, aliran, loop umpan balik | agen otonom dengan aturan dan keadaan (kendaraan, orang, pesanan) | benda kaku, sambungan, sensor, sinyal kendali |
| Pertanyaan tipikal | throughput, lead time, utilisasi, bottleneck, ukuran buffer, kebutuhan tenaga kerja | kapasitas strategis dan perkembangan pasar, efek bullwhip | lalu lintas AGV, arus pejalan kaki, kendali terdesentralisasi, logika negosiasi | keterjangkauan, tabrakan, cycle time sel robot, pengujian kendali |
| Tingkat detail | dari lini hingga pabrik | dari pabrik hingga jaringan, sangat teragregasi | dari lokal hingga jaringan | dari sel hingga mesin |
| Kekuatan | mapan, mudah divalidasi, keacakan sudah termasuk | cepat, baik untuk umpan balik dan horizon panjang | perilaku emergen, aturan individual | geometri dan fisika yang realistis |
| Batasan | geometri biasanya disederhanakan | tidak ada pesanan individual | parameterisasi dan validasi menuntut | intensif komputasi, hanya sebagian kecil sistem |
| Referensi | VDI 3633 [13], Law [41] | Forrester, *Industrial Dynamics* (MIT) [38] | tidak diketahui ada pedoman VDI khusus [unverified: tidak ditemukan pedoman VDI khusus untuk ABS dalam sumber yang tersedia] | VDI 3633 Bagian 8 (simulasi tingkat mesin) [13], VDI/VDE 3693 [14] |

Dalam simulasi produksi dan pabrik, **simulasi kejadian diskret** mendominasi. Banyak alat modern menggabungkan paradigma, misalnya produksi kejadian diskret dengan kendaraan berbasis agen atau model energi kontinu. Buku teks Law menjelaskan secara rinci dasar-dasar metodologis simulasi kejadian diskret, mulai dari bilangan acak dan distribusi input hingga analisis statistik [41].

### Simulasi aliran material dan simulasi pabrik

Istilah-istilah ini sering dipakai secara bergantian, tetapi memiliki penekanan yang berbeda:

- **Simulasi aliran material** menelusuri jalur material dan pesanan melalui produksi dan logistik: konveyor, buffer, penyimpanan, penanganan material, pengambilan barang. Pertanyaan panduannya: Apakah sistem konveyor sudah memadai? Seberapa besar buffer yang dibutuhkan? Di mana material menumpuk?
- **Simulasi pabrik** memandang pabrik secara keseluruhan: bauran produk, kapasitas, pola shift, tenaga kerja, tata letak, logistik, dan aturan pengendalian. Pertanyaan panduannya: Dapatkah pabrik menangani volume produksi? Tata letak mana yang tangguh? Berapa biaya shift ketiga dibandingkan dengan menambah mesin?
- **Simulasi produksi** sering dipakai sebagai istilah payung untuk keduanya.

Untuk informasi lebih lanjut tentang simulasi pabrik, lihat halaman entitas [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Simulasi aliran nilai: value stream mapping dinamis

Value stream mapping klasik adalah potret sesaat yang didasarkan pada rata-rata. Ia menunjukkan persediaan, waktu tunggu, dan aliran pada hari tertentu, tetapi tidak menunjukkan bagaimana aliran nilai berperilaku ketika bauran produk berubah, kerusakan mesin terjadi, atau ukuran lot berubah. Simulasi aliran nilai menutup celah ini dengan memperlakukan peta aliran nilai sebagai model yang dapat dieksekusi. Publikasi ZWF 2014 yang disebutkan di atas menjelaskan langkah tepat dari metrik statis menuju pandangan dinamis dari waktu ke waktu [31].

Keunggulan praktisnya: peta aliran nilai sudah familiar dan diterima di perusahaan. Jika Anda menurunkan model simulasi darinya, tim operasi tidak perlu mempelajari dunia pemodelan yang baru. Batasannya adalah aliran material yang sangat kompleks dengan konveyor dan logika gudang, yang membutuhkan simulasi aliran material klasik.

### Cara menjalankan studi simulasi

VDI 3633 menjelaskan persiapan, pelaksanaan, dan evaluasi studi simulasi [13]. Urutan berikut telah terbukti efektif:

1. **Tujuan:** Keputusan apa yang sedang Anda siapkan? Metrik mana yang menentukannya (throughput, waktu tunggu, ketepatan pengiriman, biaya)?
2. **Batas sistem:** Apa yang termasuk dalam model dan apa yang tidak? Tingkat detail seperti apa yang dibutuhkan?
3. **Pengumpulan dan persiapan data:** data master, waktu, distribusi, kerusakan, pola shift (lihat bagian 11).
4. **Pembangunan model:** model konseptual terlebih dahulu, kemudian model yang dapat dieksekusi.
5. **Verifikasi dan validasi:** Apakah model dibangun dengan benar (verifikasi)? Apakah model cukup akurat merepresentasikan kenyataan (validasi)? Bandingkan dengan data aktual dan periksa kewajarannya bersama pakar di bidangnya.
6. **Desain eksperimen:** skenario, periode pemanasan (warm-up), durasi jalan, dan jumlah replikasi.
7. **Eksekusi dan analisis:** metrik dengan interval kepercayaan, bukan nilai tunggal, serta analisis sensitivitas.
8. **Dokumentasi dan serah terima:** asumsi, batasan, dan rekomendasi.

Dua hal sering diabaikan dalam praktik: **periode pemanasan** (model yang dimulai dalam keadaan kosong menghasilkan metrik yang terdistorsi untuk beberapa hari simulasi pertama) dan **replikasi** (model stokastik memberikan hasil yang berbeda pada setiap kali dijalankan; hanya beberapa kali menjalankan yang mendukung pernyataan yang andal) [41]. Logika verifikasi dan validasi yang sama inilah yang ingin diformalkan NIST untuk digital twin manufaktur melalui kerangka VVUQ yang diusulkannya [48].

## 7. Kasus penggunaan dan data yang dibutuhkan masing-masing

Tabel di bawah mengelompokkan kasus penggunaan manufaktur yang paling penting berdasarkan tingkat integrasi dan kebutuhan datanya. Anggap tabel ini sebagai alat bantu perencanaan. Untuk kasus Anda, periksa kolom "Minimum data" terlebih dahulu.

| Kasus penggunaan | Keputusan tipikal | Tingkat integrasi | Data minimum | Data tambahan yang memberi nilai |
|---|---|---|---|---|
| Perencanaan pabrik dan tata letak | struktur bangunan, susunan, luas lantai, lorong | model | program produk, routing, waktu, kebutuhan ruang, varian tata letak | matriks transportasi, batasan bangunan, pemindaian 3D |
| Perencanaan kapasitas dan investasi modal | mesin tambahan, shift tambahan, atau alih daya | model atau shadow | perkiraan, routing, pusat kerja, pola shift, ketersediaan | distribusi kerusakan, matriks setup |
| Analisis bottleneck | Di mana harus berinvestasi, di mana harus mengurangi beban? | shadow | konfirmasi berstempel waktu, waktu aktual, persediaan | status mesin, alasan downtime |
| Analisis bauran produk dan skenario | produk baru, bauran varian, ukuran lot | model atau shadow | daftar material, routing, skenario bauran | famili setup, aturan penjadwalan urutan |
| Validasi jadwal dan APS | Apakah jadwal minggu ini layak? Urutan mana yang dipakai? | shadow hingga twin | pesanan, tanggal jatuh tempo, routing, kapasitas, kemajuan saat ini | ketersediaan material, tenaga kerja dengan keterampilan |
| Virtual commissioning | menguji perangkat lunak kontrol sebelum commissioning fisik | model (model peralatan dengan kontroler nyata atau emulasi) | desain mekanik dan elektrik, program PLC, daftar I/O, model perilaku | fungsi keselamatan, konsep operasi |
| Perencanaan armada AGV dan AMR | jumlah kendaraan, rute, strategi pengisian daya | model, kemudian shadow | perintah transportasi (asal, tujuan, jumlah, waktu), tata letak, data kendaraan | aturan lalu lintas, infrastruktur pengisian daya, lalu lintas campuran |
| Penilaian energi dan CO2 | beban puncak, pergeseran shift, strategi penghentian | shadow | konsumsi daya per status, data status, pola shift | harga energi, data terukur per mesin |
| Pemeliharaan | waktu pemeliharaan, penyetokan suku cadang | shadow hingga twin | riwayat kegagalan, jam operasi, data kondisi | sensor, model kerusakan |

### 7.1 Perencanaan pabrik dan tata letak

Perencanaan pabrik adalah bidang klasik dari pabrik digital. Dalam proyek greenfield, pabrik belum ada, sehingga tidak ada data operasi. Digital twin di sini adalah **model perencanaan** yang dibangun dari program produk, routing, dan varian tata letak. Tugasnya adalah membandingkan varian dalam kondisi ketidakpastian: tata letak mana yang tetap produktif jika bauran berubah atau volume naik sepertiga?

Proyek brownfield berbeda: ada data, tetapi sering kali tidak ada tata letak yang mutakhir. Pemindaian laser dan point cloud 3D membantu merekam kondisi bangunan sebagaimana dibangun. Namun, logika proses tetap menentukan hasilnya. Model bangunan yang fotorealistik tanpa routing tidak akan menjawab satu pun pertanyaan kapasitas. Sebagian penjelasan berbahasa Inggris menyebutnya "jebakan visualisasi".

Metrik yang sudah terbukti untuk membandingkan varian adalah throughput, lead time, work in process (WIP), upaya transportasi (ton-mil atau perjalanan per jam), luas lantai, dan kebutuhan tenaga kerja.

### 7.2 Analisis kapasitas dan bottleneck

**Theory of Constraints** dari Goldratt berasumsi bahwa kinerja sistem dibatasi oleh satu kendala, dan peningkatan di luar kendala tersebut tidak menaikkan throughput [39]. Masalah praktisnya: bottleneck tidak selalu berada di tempat dengan utilisasi tertinggi pada spreadsheet. Ia berpindah seiring bauran produk, setup, dan kerusakan. Model simulasi menunjukkan di mana pesanan benar-benar menumpuk dan stasiun mana yang menghambat atau membuat stasiun lain kekurangan beban. Untuk informasi lebih lanjut tentang metode ini, lihat halaman entitas [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/).

McKinsey menjelaskan contoh konkret: pada satu lini produksi, urutan yang dioptimalkan di stasiun bottleneck memangkas total waktu pemrosesan sekitar empat persen [26]. Angka seperti itu terdengar kecil, tetapi di bottleneck yang nyata, angka tersebut langsung berpengaruh pada throughput.

### 7.3 Analisis bauran produk dan skenario

Produk baru, lebih banyak varian, ukuran lot yang lebih kecil: masing-masing perubahan ini menggeser beban antar sumber daya. Digital twin yang dibangun di atas model PPR dapat membaca bill of materials dan routing yang baru, lalu menunjukkan sumber daya mana yang menjadi kritis sebelum produk pertama dibuat. McKinsey menggambarkan sebuah pabrik fabrikasi logam yang twin-nya, dengan agen reinforcement learning, mengevaluasi ribuan kemungkinan kombinasi produk di empat lini produksi paralel [26]. Skenario yang umum meliputi:

- pergeseran mix antar famili produk,
- pengenalan produk baru pada sumber daya yang sudah ada,
- pengurangan ukuran lot dan dampaknya terhadap proporsi waktu setup,
- perubahan model shift (dua hingga tiga shift, shift akhir pekan),
- hilangnya sumber daya kunci atau pemasok.

### 7.4 Penjadwalan produksi dan advanced planning and scheduling (APS)

Sistem APS membuat jadwal dan urutan produksi yang dibatasi kapasitas. Simulasi twin melengkapinya dengan dua cara: twin dapat **menjalankan jadwal terlebih dahulu** dan menunjukkan apakah jadwal tersebut tetap berlaku di bawah variabilitas yang realistis, dan twin dapat berfungsi sebagai **fungsi evaluasi** bagi metode optimisasi yang menghasilkan banyak varian jadwal. McKinsey melaporkan sebuah pabrik perakitan di mana jadwal produksi yang dirancang ulang mengurangi lembur dan menghasilkan penghematan biaya bulanan sebesar 5 hingga 7 persen [26]. Halaman entitas [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) menjelaskan dasar-dasar perencanaan yang dibatasi kapasitas, dan panduan kami tentang [perangkat lunak penjadwalan produksi dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/) membahasnya lebih mendalam.

Perjelas peran masing-masing: perencanaan ERP klasik (MRP II) bekerja secara berurutan (kuantitas, lalu tanggal, lalu kapasitas), sering kali dengan asumsi kapasitas tak terbatas. Twin tidak menggantikan sistem ERP. Twin memeriksa dan memperbaiki hasilnya.

### 7.5 Virtual commissioning

**Virtual commissioning** menguji perangkat lunak kontrol sebuah mesin atau lini terhadap model simulasi sebelum peralatan fisik terpasang. Pedoman yang paling rinci berbahasa Jerman: VDI/VDE 3693 Bagian 1 (Agustus 2016) mendefinisikan virtual commissioning untuk otomasi proses dan pabrik, dengan tujuan menemukan dan memperbaiki kesalahan dari tahap rekayasa sistem otomasi, serta menjelaskan jenis model dan istilah [14]. Bagian 2 (Desember 2018) membahas penerapan virtual commissioning di perusahaan; VDI telah mengumumkan revisi [15]. Kami tidak menemukan standar ANSI atau ISA yang khusus untuk virtual commissioning [unverified: tidak ditemukan standar ANSI atau ISA khusus di sumber yang diperiksa]; integrator di AS umumnya bekerja dengan konsep-konsep ini dan dengan metode milik vendor alat mereka sendiri.

Tiga varian kopling yang umum digunakan:

| Varian | Kontroler | Peralatan | Penggunaan |
|---|---|---|---|
| Model-in-the-loop (MiL) | sebagai model | sebagai model | pemeriksaan konsep awal |
| Software-in-the-loop (SiL) | program kontrol nyata pada PLC virtual atau emulasi | sebagai model | pengujian logika PLC tanpa perangkat keras |
| Hardware-in-the-loop (HiL) | perangkat keras kontroler nyata | sebagai model real-time | pengujian termasuk perilaku waktu dan sistem fieldbus |

Manfaatnya adalah memindahkan pemecahan masalah dari fase commissioning di lokasi yang mahal ke fase yang lebih awal dan lebih murah. Angka persentase yang andal untuk penghematan waktu di seluruh industri masih langka; banyak angka yang dipublikasikan merupakan klaim vendor. Satu contoh yang terdokumentasi: di lini pra-perakitan di pabriknya di Saarbrücken, Jerman, ZF, bekerja sama dengan Fraunhofer IESE, memperkirakan commissioning sekitar 30 persen lebih cepat dengan menggunakan digital twin dan middleware Eclipse BaSyx; pada 2021 ini merupakan ekspektasi, bukan nilai yang diukur di banyak proyek [28]. Sebuah studi 2024 dari Fraunhofer IWU di kalangan pembuat mesin dan peralatan di negara bagian Saxony, Jerman, menemukan bahwa lebih dari 90 persen perusahaan yang disurvei mengenal virtual commissioning, tetapi hanya sedikit yang memanfaatkan potensinya dalam praktik [27].

**Virtual commissioning vs. factory twin:** Virtual commissioning bekerja pada tingkat sinyal dan kontrol, sering kali dalam milidetik. Factory twin bekerja pada tingkat order dan sumber daya, dalam hitungan menit hingga shift. Keduanya dapat menggunakan tata letak yang sama tetapi menjawab pertanyaan yang berbeda. Informasi selengkapnya ada di halaman entitas [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/).

### 7.6 Perencanaan armada AGV dan AMR

Automated guided vehicles (AGV) dan autonomous mobile robots (AMR) adalah contoh klasik untuk simulasi, karena perilakunya dipengaruhi oleh interaksi: kendaraan saling menghalangi di persimpangan, menunggu di stasiun transfer, kembali dalam keadaan kosong, dan perlu diisi daya. Perhitungan statis (order transportasi per jam dikali rata-rata waktu tempuh) sering kali meremehkan jumlah kendaraan yang dibutuhkan, karena perjalanan kosong, waktu tunggu, dan jeda pengisian daya tidak ikut diperhitungkan.

Untuk keselamatan, dua standar AS menjadi kerangka proyek-proyek ini. **ANSI/ITSDF B56.5-2024**, *Safety Standard for Guided Industrial Vehicles*, menetapkan persyaratan keselamatan untuk desain, pengoperasian, dan pemeliharaan kendaraan industri terpandu otomatis bertenaga dan tanpa operator, beserta sistem yang menjadi bagiannya [53]. **ANSI/A3 R15.08-1-2020 (R2026)**, *Industrial Mobile Robots: Safety Requirements, Part 1*, ditujukan kepada produsen robot mobile industri dan berlandaskan penilaian risiko dalam lingkungan operasi yang terdokumentasi [54]. Di Jerman, pedoman **VDI 2510** mengatur sistem AGV untuk aliran material di dalam pabrik; edisi yang berlaku berasal dari 2005, dan draf Juli 2025 membahas sistem AGV dan AMR, termasuk jenis kendaraan, kontrol armada, navigasi, catu daya, transmisi data, infrastruktur, dan keselamatan [18]. Simulasi tidak menggantikan penilaian risiko yang diwajibkan oleh standar-standar ini, tetapi simulasi menunjukkan sejak awal di mana aturan lalu lintas, zona kecepatan, dan lalu lintas campuran dengan manusia berpotensi menimbulkan konflik.

Pertanyaan tipikal untuk simulasi AGV:

- Berapa banyak kendaraan yang kita butuhkan pada beban puncak, dan berapa rata-ratanya?
- Rute, aturan satu arah, dan posisi tunggu mana yang menghindari kemacetan?
- Strategi pengisian daya mana (opportunity charging, penukaran baterai) yang menjaga ketersediaan tetap tinggi?
- Bagaimana lalu lintas campuran dengan forklift dan pejalan kaki memengaruhi kinerja?
- Apa yang terjadi jika sebuah kendaraan atau stasiun transfer mengalami kegagalan?

**Contoh perhitungan dengan nilai ilustratif:** Anggap sebuah area perakitan membutuhkan 60 transportasi per jam, dan perjalanan bermuatan rata-rata memakan waktu 3 menit. Perhitungan naif menghasilkan 60 × 3 = 180 menit perjalanan per jam, atau 3 kendaraan. Tambahkan perjalanan kosong menuju pengambilan berikutnya (juga 3 menit di sini) dan masing-masing 1 menit untuk pengambilan dan penurunan, maka setiap transportasi memakan 8 menit, atau 480 menit per jam: 8 kendaraan yang sepenuhnya terpakai. Dengan target utilisasi 80 persen dan ketersediaan 85 persen karena pengisian daya, diperoleh 8 / (0,8 × 0,85) ≈ 11,8, atau 12 kendaraan. Kemacetan di persimpangan dan waktu tunggu di stasiun transfer belum termasuk di sini; hanya simulasi yang dapat menunjukkannya.

Kebutuhan data cukup dapat dikelola tetapi sering diremehkan: Anda memerlukan **matriks transportasi** (dari mana ke mana, seberapa sering, kapan), yang dapat diturunkan dari routing, bill of material, dan konsep pasokan di samping lini. Di sinilah model PPR berguna, karena sudah mengetahui kebutuhan material per operasi. Untuk mengendalikan armada campuran yang nyata, lingkungan 3D berbasis fisika semakin banyak digunakan; NVIDIA, misalnya, menjelaskan blueprint "Mega"-nya (diperkenalkan sebagai pratinjau pada 2025) sebagai alur kerja referensi untuk menguji armada robot dalam digital twin fasilitas [25]. Selengkapnya di halaman entitas [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/).

### 7.7 Energi dan CO2

Production twin dapat memodelkan konsumsi energi berdasarkan status: sebuah mesin menarik daya yang berbeda ketika memproses, idle, melakukan setup, dan berhenti. Dikombinasikan dengan aliran order, simulasi menunjukkan beban puncak dan dampak tindakan seperti memindahkan shift, mematikan otomatis selama istirahat, atau mengubah urutan. Syaratnya adalah nilai daya per status, yang Anda ukur atau turunkan dari data pabrikan. Angka yang andal untuk potensi penghematan sangat bergantung pada kasus masing-masing; bersikaplah skeptis terhadap persentase yang bersifat umum.

### 7.8 Pemeliharaan

Pemeliharaan prediktif sering disebut sebagai contoh utama digital twin. Dalam praktiknya, keduanya merupakan dua disiplin yang berbeda: pemantauan kondisi dan prediksi kegagalan bekerja dengan data sensor dan model kerusakan statistik atau fisik pada tingkat aset. Production twin dapat memperoleh manfaat dengan menjadikan prediksi downtime sebagai skenario dan menunjukkan order mana yang terdampak serta kapan jendela pemeliharaan menimbulkan kerugian paling kecil.

## 8. Digital twin dengan Microsoft Azure dan Fabric

Banyak produsen menjalankan TI perusahaan mereka di Microsoft 365 dan Azure. Bagi mereka, pertanyaannya adalah layanan Microsoft mana yang menjadi kandidat untuk digital twin dan bagaimana statusnya. Episode [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) memberikan gambaran umum tentang peran Azure.

### Azure Digital Twins

**Azure Digital Twins** adalah layanan platform-as-a-service (PaaS) untuk membuat graf twin berdasarkan model digital dari seluruh lingkungan, seperti gedung, pabrik, jaringan energi, atau kota [21]. Model ditulis dalam **Digital Twins Definition Language (DTDL)**. Azure Digital Twins mendukung DTDL v2 dan v3, dan Microsoft merekomendasikan v3 karena kemampuannya yang lebih luas; antarmuka v3 dapat memperluas antarmuka v2, tetapi tidak sebaliknya [22]. Microsoft juga menyediakan ontologi yang mengemas model DTDL berdasarkan standar industri [22]. Halaman ikhtisar tidak memuat pemberitahuan penghentian saat kami memeriksanya [21].

Azure Digital Twins adalah platform pemodelan dan graf, bukan perangkat lunak simulasi. Platform ini merepresentasikan hubungan dan status serta memproses peristiwa; simulasi kejadian diskret, perbandingan skenario, atau optimasi harus berasal dari alat lain.

### Digital twin builder di Microsoft Fabric (pratinjau)

Dengan **digital twin builder**, Microsoft memperkenalkan item dalam beban kerja Real-Time Intelligence di Microsoft Fabric pada 2025. Item ini digunakan untuk memodelkan konsep bisnis seperti aset dan proses dalam **ontologi**, memetakan data dari berbagai sistem sumber ke instans tipe entitas ini, dan membuat hubungan semantik di antaranya; datanya berada di OneLake [23]. Pada saat penulisan ini, Microsoft secara eksplisit menandai digital twin builder sebagai **pratinjau** (Microsoft Learn, halaman terakhir diperbarui 20 Mei 2026; diperiksa 20 November 2026) [23]. Microsoft juga menegaskan bahwa digital twin builder adalah layanan yang berbeda dari Azure Digital Twins [21][23]. Dalam blog Fabric, Microsoft menyebutkan contoh manufaktur seperti twin mesin dan proses untuk analisis akar penyebab dan pertanyaan what-if, serta mitra yang menyediakan skema data manufaktur dan kueri KPI, misalnya untuk overall equipment effectiveness (OEE) [24].

### Layanan mana untuk tujuan apa?

| Kebutuhan | Pendekatan yang sesuai | Catatan |
|---|---|---|
| Graf aset, ruang, dan peralatan dengan pemrosesan peristiwa, dalam produksi | Azure Digital Twins dengan DTDL v3 [21][22] | layanan PaaS yang tersedia secara umum; tambahkan simulasi secara terpisah |
| Ontologi atas data ERP, MES, dan sensor pada platform data Fabric | digital twin builder di Fabric [23] | pratinjau: untuk pilot dan evaluasi; periksa penggunaan produksi terhadap ketentuan pratinjau Microsoft |
| Kapasitas, bottleneck, skenario, tata letak | alat simulasi (bagian 15), hasil di Fabric atau Power BI | baik Azure Digital Twins maupun digital twin builder bukan perangkat lunak simulasi |

### Kontribusi admin M365 dan Azure

Twin produksi bukan proyek OT murni. TI memberikan blok bangunan yang penting:

- **Identitas dan izin:** Siapa yang boleh membuat skenario, dan siapa yang boleh menyetujui hasil? Peran di Microsoft Entra ID, hak terpisah untuk pemodelan, analisis, dan write-back.
- **Platform data:** menghubungkan ERP dan MES ke platform data terpusat, historisasi, aturan kualitas data, katalog.
- **Tata kelola:** klasifikasi data produksi dan pelanggan, retensi, log akses. Untuk pemasok pertahanan, ini mencakup penanganan controlled unclassified information (CUI) berdasarkan DFARS dan CMMC; panduan kami tentang [perencanaan produksi aerospace](https://www.m365.fm/en/learn/aerospace-production-planning/) membahas aturan tersebut.
- **Pelaporan dan kolaborasi:** mempublikasikan hasil simulasi di Power BI, kanal Teams untuk keputusan skenario, versioning status model.
- **Keamanan:** segmentasi jaringan antara TI dan OT, tanpa akses tulis langsung dari cloud ke controller tanpa rantai persetujuan yang ditetapkan (lihat bagian 16).

Panduan kami tentang [Azure untuk manufaktur](https://www.m365.fm/en/learn/manufacturing-it-azure/) membahas TI manufaktur di Azure secara rinci.

## 9. Kecerdasan buatan dan digital twin

AI dan digital twin saling melengkapi ke dua arah: twin memberi AI konteks yang terstruktur dan tempat yang aman untuk bereksperimen, sedangkan AI mempercepat dan memperluas twin. Lima pola penting dalam manufaktur:

1. **Persiapan data:** Machine learning mendeteksi outlier pada konfirmasi, memperkirakan waktu yang hilang, dan menurunkan distribusi dari data aktual. Hasilnya tidak mencolok, tetapi sering kali menjadi pengungkit praktis yang paling besar.
2. **Model surrogate:** Model simulasi yang detail digunakan untuk "melatih" jaringan saraf atau surrogate lain dengan banyak run; surrogate tersebut kemudian menghasilkan perkiraan dalam hitungan detik. Berguna untuk optimisasi yang membutuhkan sangat banyak evaluasi. Batasnya berada di luar rentang yang dilatih.
3. **Optimisasi dan reinforcement learning:** Agen mempelajari aturan kendali di dalam model simulasi, misalnya untuk penjadwalan urutan atau dispatching kendaraan, tanpa mengganggu produksi nyata. Contoh fabrikasi logam dari McKinsey pada bagian 7.3 menggunakan pendekatan ini [26]. Aturan tersebut hanya sebaik fidelitas model.
4. **Generative AI sebagai antarmuka:** Language model menerjemahkan pertanyaan seperti "Apa yang terjadi jika lini 3 berhenti selama seminggu?" menjadi skenario dan menjelaskan hasilnya. Prasyaratnya adalah model yang bersih secara semantik (ontologi, grafik PPR) agar AI tidak menebak.
5. **Physical AI dan robotika:** Twin 3D berbasis fisika berfungsi sebagai lingkungan pelatihan dan pengujian bagi robot dan kendaraan otonom; NVIDIA memposisikan Omniverse dan blueprint Mega, yang berbasis OpenUSD, untuk tujuan ini [25].

**Penilaian yang realistis:** AI tidak menggantikan validasi maupun keahlian domain. Language model yang bekerja dengan routing yang keliru dengan cepat menghasilkan jawaban yang tampak masuk akal tetapi salah. Urutannya karena itu adalah: fondasi data dan model dahulu, baru AI.

## 10. Peta jalan: implementasi dalam enam fase

Peta jalan berikut merupakan panduan untuk twin pabrik atau produksi. Durasinya berdasarkan pengalaman penulis untuk pabrik skala menengah dengan use case pertama yang ruang lingkupnya jelas [unverified: pengalaman penulis untuk pabrik skala menengah]; McKinsey memberikan rentang dua hingga tiga bulan sampai lebih dari satu tahun untuk proyek twin, tergantung kemampuan tim dan kompleksitas pabrik [26]. Posting [Digital twin in manufacturing: where to start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) juga menjelaskan cara mengambil langkah pertama.

| Fase | Isi | Hasil | Durasi tipikal |
|---|---|---|---|
| 1 Pertanyaan | menamai keputusan, menetapkan metrik dan target, menugaskan pemilik | piagam satu halaman dengan pertanyaan panduan, metrik, batas sistem | 2–4 minggu |
| 2 Inventaris data | meninjau data ERP, MES dan tata letak, memeriksa kualitas data, menutup celah | peta data, laporan kualitas, daftar tindakan | 3–6 minggu |
| 3 Model pilot | model PPR untuk satu value stream atau area, model simulasi yang dapat dieksekusi | model pilot tervalidasi | 6–12 minggu |
| 4 Validasi dan keputusan pertama | membandingkan dengan data aktual, menjalankan skenario, menyiapkan keputusan | keputusan terdokumentasi dengan asumsi | 2–6 minggu |
| 5 Operasionalisasi | umpan data otomatis, peran, proses pemeliharaan, validasi jadwal rutin | shadow dalam operasi rutin | 2–6 bulan |
| 6 Penskalaan | lebih banyak area, pabrik, use case, kopling dengan APS, energi, AGV | portofolio twin di atas fondasi data bersama | berkelanjutan |

**Prinsip panduan untuk peta jalan:**

- **Satu keputusan dahulu.** Twin yang memperbaiki keputusan modal atau perencanaan yang konkret akan membiayai fase berikutnya.
- **Data sebelum platform.** Periksa kualitas data sebelum memilih alat.
- **Operasi di depan.** Perencana dan supervisor harus memahami dan mempercayai model. Model yang hanya bisa dioperasikan oleh grup simulasi akan mati bersama pergantian staf berikutnya.
- **Pemeliharaan sejak hari pertama.** Tentukan sejak dini siapa yang memperbarui model ketika routing, tata letak, atau pola shift berubah.

**Bantuan bagi produsen kecil dan menengah:** Di AS, NIST Manufacturing Extension Partnership (MEP), program dari National Institute of Standards and Technology di bawah Department of Commerce dengan lebih dari 450 lokasi layanan di seluruh 50 negara bagian dan Puerto Rico, menjadi titik awal yang umum bagi produsen kecil yang menginginkan dukungan dari luar untuk proyek digitalisasi [60]. Laporan use case ISO 23247 dari NIST ditulis khusus untuk audiens ini [47].

## 11. Kualitas data: prasyarat yang sering diremehkan

Dalam banyak proyek digital twin, tinjauan data pertama sudah menunjukkan hal ini: data master di sistem ERP menggambarkan pabrik sebagaimana direncanakan dahulu, bukan sebagaimana beroperasi saat ini. Itu bukan kritik terhadap manajemen data master. Hal ini timbul karena sistem ERP terutama dipelihara untuk penetapan biaya dan perencanaan material, bukan untuk simulasi.

### Masalah data yang umum

- **Waktu standar** berasal dari penetapan biaya atau dari studi waktu yang dilakukan bertahun-tahun lalu (di Jerman sering studi REFA, padanan Jerman untuk studi waktu teknik industri klasik) dan menyimpang cukup besar dari waktu aktual.
- **Waktu setup** disimpan sebagai nilai tetap, padahal dalam kenyataannya bergantung pada urutan (matriks setup).
- **Kelompok pusat kerja** menggabungkan mesin yang sebenarnya berbeda (usia, ketersediaan, keterampilan operator).
- **Kalender shift** tidak mencerminkan shift tambahan, periode jam kerja berkurang (di Jerman: *Kurzarbeit*, kerja waktu singkat bersubsidi pemerintah) atau kekurangan tenaga kerja.
- **Downtime** sama sekali tidak tercatat di sistem ERP dan dicatat di MES dengan kode alasan yang tidak konsisten.
- **BOM produksi** menyimpang dari BOM rekayasa tanpa penyimpangan tersebut didokumentasikan.
- **Konfirmasi** dicatat secara massal di akhir shift, sehingga stempel waktu tidak mencerminkan urutan kejadian yang sebenarnya.
- **Waktu tempuh** dan rute di dalam pabrik sama sekali tidak tersedia.

### Daftar periksa sebelum membangun model

| Pemeriksaan | Pertanyaan | Metode |
|---|---|---|
| Kelengkapan | Apakah setiap material yang relevan memiliki routing, dan setiap operasi memiliki pusat kerja? | kueri tautan yang hilang |
| Kemutakhiran | Kapan waktu standar terakhir ditinjau? | tanggal perubahan per routing |
| Kewajaran | Seberapa besar selisih antara waktu standar dan waktu aktual? | perbandingan dengan konfirmasi selama tiga hingga enam bulan |
| Granularitas | Apakah pusat kerja cukup rinci untuk pertanyaan yang diajukan? | pencocokan silang dengan tata letak dan gemba walk |
| Konsistensi | Apakah nama cocok antara ERP, MES dan tata letak? | tabel pemetaan |
| Stempel waktu | Apakah konfirmasi dicatat tepat waktu? | distribusi waktu pencatatan selama shift |
| Downtime | Apakah ada satu katalog alasan downtime? | analisis frekuensi alasan |
| Kepemilikan | Siapa memelihara data yang mana, dan siapa menyetujui perubahan? | matriks RACI |

**Aturan praktis:** Model simulasi dapat menjembatani celah data dengan asumsi, selama asumsi tersebut didokumentasikan dan diuji dalam analisis sensitivitas. Twin yang diam-diam menghitung dengan waktu standar yang salah itu berbahaya, karena tampak presisi.

Efek samping yang banyak diremehkan perusahaan: inventarisasi data untuk sebuah twin saja sering kali meningkatkan kualitas perencanaan di sistem ERP, karena mengungkap routing yang sudah usang dan kapasitas yang keliru.

## 12. Biaya dan manfaat, dinilai secara jujur

### Pendorong biaya

Menurut penilaian penulis, biaya production twin biasanya didominasi bukan oleh perangkat lunak, melainkan oleh pekerjaan data dan pemodelan. Pendorong biaya utamanya adalah:

- **Persiapan data:** antarmuka, pembersihan, pemetaan, klarifikasi dengan pihak bisnis.
- **Pemodelan dan validasi:** membangun model PPR dan model simulasi, serta membandingkannya dengan kondisi nyata.
- **Pemeliharaan:** pembaruan ketika produk, proses, atau tata letak berubah. Pos ini sering terlewat dalam business case.
- **Pelatihan:** melatih perencana dan pengguna kunci, serta membangun kapabilitas internal.
- **Perangkat lunak dan infrastruktur:** lisensi, sumber daya cloud, integrasi.

Untuk studi simulasi, sebuah firma layanan simulasi asal Jerman memberikan aturan praktis bahwa biayanya sebaiknya tidak melebihi 1 persen dari investasi yang bersangkutan, dan merujuk pada studi serta benchmark (termasuk VDI) yang menempatkan rasio biaya-manfaat rata-rata sekitar 1:6 [30]. Nilai-nilai ini berasal dari sumber vendor; periksa studi aslinya sebelum menggunakannya dalam business case Anda sendiri.

### Contoh manfaat yang terdokumentasi

Angka manfaat yang andal dan dikumpulkan secara independen jarang tersedia. Nilai-nilai berikut memiliki sumber, tetapi merupakan kasus individual:

| Sumber | Konteks | Nilai |
|---|---|---|
| McKinsey (2024) [26] | pabrik perakitan, jadwal produksi yang dirancang ulang | penghematan biaya bulanan 5–7% melalui pengurangan lembur |
| McKinsey (2024) [26] | optimasi urutan pada stasiun bottleneck | sekitar 4% total waktu proses lebih rendah |
| McKinsey (2024) [26] | survei terhadap 75 eksekutif industri senior (Juni 2022) | 86% menganggap twin dapat diterapkan, 44% sudah pernah menerapkan, 15% berencana menerapkan |
| ZF / Fraunhofer IESE (2021) [28] | lini pra-perakitan, Saarbrücken (Jerman), middleware Eclipse BaSyx | sekitar 30% lebih cepat dalam commissioning (ekspektasi, bukan rata-rata) |
| Fraunhofer IWU (2024) [27] | survei terhadap pembuat mesin dan peralatan di Saxony (Jerman) | lebih dari 90% mengetahui virtual commissioning, hanya sebagian kecil yang memanfaatkan potensinya |

Sebagai konteks iklim investasi di AS: dalam Deloitte 2025 Smart Manufacturing and Operations Survey (600 eksekutif di produsen AS dengan pendapatan 500 juta dolar AS atau lebih, dilakukan Agustus hingga September 2024), 78 persen pemimpin menyatakan mengalokasikan lebih dari 20 persen anggaran peningkatannya untuk inisiatif smart manufacturing; responden melaporkan peningkatan output produksi hingga 20 persen [56]. Ini adalah angka yang dilaporkan sendiri untuk smart manufacturing secara umum, bukan khusus untuk digital twin.

### Business case dalam lima pertanyaan

1. **Keputusan apa** yang diperbaiki oleh twin, dan seberapa sering keputusan itu dibuat (sekali untuk proyek modal, atau mingguan dalam penjadwalan)?
2. **Berapa biaya keputusan yang salah** (investasi yang terlalu besar atau terlalu kecil, pengiriman terlambat, lembur, kehabisan stok)?
3. **Seberapa jauh keputusan menjadi lebih akurat** dengan twin? Sebuah pilot memberi Anda perbandingan awal antara rencana, simulasi, dan hasil aktual.
4. **Berapa biaya twin** selama tiga hingga lima tahun, termasuk pemeliharaannya?
5. **Manfaat lanjutan apa** yang muncul (master data yang lebih baik, pemeriksaan penawaran yang lebih cepat, penggunaan ulang di area lain)?

Untuk keputusan modal bernilai jutaan dolar, satu kesalahan penentuan ukuran yang dihindari dapat membenarkan sebuah proyek simulasi. Untuk twin perencanaan yang berkelanjutan, frekuensi penggunaanlah yang menentukan.

## 13. Kesalahan umum dan cara menghindarinya

| Kesalahan | Akibat | Tindakan pencegahan |
|---|---|---|
| teknologi sebelum pertanyaan | platform mahal tanpa manfaat | piagam satu halaman dengan keputusan konkret dan metrik sebelum pemilihan alat apa pun |
| menyamakan visualisasi 3D dengan kembaran digital | gambar yang bagus, tanpa jawaban atas pertanyaan kapasitas | logika proses (PPR) sebelum geometri |
| memodelkan semuanya sekaligus | proyek tidak pernah selesai | satu value stream atau area sebagai pilot |
| menerima data master tanpa pemeriksaan | hasil yang tampak presisi tetapi salah | pemeriksaan kualitas data (bagian 11), perbandingan dengan waktu aktual |
| tanpa validasi | hilangnya kepercayaan pada penyimpangan pertama | perbandingan sistematis dengan data aktual, asumsi yang terdokumentasi |
| rata-rata sebagai ganti distribusi | bottleneck dan persediaan diremehkan | distribusi dari data aktual, rincian model |
| satu replikasi simulasi | hasil acak dijual sebagai kebenaran | beberapa replikasi, interval kepercayaan [41] |
| tanpa rencana pemeliharaan | model usang dalam beberapa bulan | peran, proses, dan anggaran untuk pemeliharaan |
| model hanya untuk spesialis | pengetahuan hilang bersama satu orang | antarmuka yang mudah dipahami, pelatihan, dokumentasi |
| loop umpan balik tanpa persetujuan | risiko keselamatan dan tanggung jawab hukum | persetujuan manusia, pencatatan log, konsep keamanan TI/OT |
| istilah yang tidak didefinisikan | kesalahpahaman dalam RFP dan kontrak | tentukan secara eksplisit tingkat integrasi (model, shadow, twin) [5] |

## 14. Ikhtisar standar dan pedoman

| Standar/pedoman | Judul (singkat) | Status | Relevansi |
|---|---|---|---|
| ISO 23247-1 sampai -4 | Kerangka kembaran digital untuk manufaktur: ikhtisar, arsitektur referensi, representasi digital, pertukaran informasi | 2021 [6] | kerangka dan struktur untuk kembaran manufaktur |
| ISO 23247-5 | Digital thread untuk kembaran digital | 2026 (tercantum di katalog ISO sebagai Edisi 1, 2026-06, masih ditampilkan sebagai "under publication" pada 20 November 2026) [7] | menghubungkan informasi siklus hidup |
| ISO 23247-6 | Komposisi kembaran digital | diterbitkan 14 Juli 2026 [8] | menyusun beberapa kembaran |
| NIST AMS 400-2 | Use Case Scenarios for Digital Twin Implementation Based on ISO 23247 | Mei 2021 [47] | panduan implementasi AS untuk ISO 23247 |
| ISO/IEC 30173 | Digital twin: Concepts and terminology | November 2023 [9] | istilah lintas industri |
| NIST IR 8356 | Security and Trust Considerations for Digital Twin Technology | Februari 2025 [49] | keamanan dan kepercayaan |
| IEC 63278-1 | Asset Administration Shell for industrial applications, Part 1: Structure | 14 Desember 2023 [10] | Asset Administration Shell |
| DIN SPEC 91345 | Reference Architecture Model Industrie 4.0 (RAMI 4.0) | 2016 [12] | kerangka Industri 4.0 (Jerman) |
| ANSI/ISA-95 (IEC 62264) | Integrasi sistem kendali perusahaan | rangkaian standar [58][19] | tingkat ERP/MES/kendali, model data |
| ANSI/MTC1.4-2018 (MTConnect) | interoperabilitas data manufaktur | edisi 2018 [57] | data mesin, umum di bengkel mesin AS |
| IEC 62541 (OPC UA) | OPC Unified Architecture | rangkaian standar | komunikasi mesin dan model informasi |
| VDI 3633 Bagian 1 | Simulasi sistem dalam penanganan material, logistik, dan produksi: dasar-dasar | Desember 2014 [13] | metode studi simulasi (Jerman) |
| VDI/VDE 3693 Bagian 1 | Virtual commissioning: model types and glossary | Agustus 2016 [14] | istilah virtual commissioning (Jerman) |
| VDI/VDE 3693 Bagian 2 | Virtual commissioning: introduction in companies | Desember 2018, revisi diumumkan [15] | pengenalan virtual commissioning di perusahaan (Jerman) |
| VDI 4499 Bagian 1 | Digital factory: fundamentals | edisi baru April 2026 (edisi pertama Februari 2008) [16] | istilah dan arsitektur pabrik digital (Jerman) |
| ANSI/ITSDF B56.5-2024 | Safety Standard for Guided Industrial Vehicles | 2024 [53] | keselamatan AGV (AS) |
| ANSI/A3 R15.08-1-2020 (R2026) | Industrial Mobile Robots: Safety Requirements, Part 1 | ditegaskan kembali 2026 [54] | keselamatan AMR (AS) |
| VDI 2510 | Automated guided vehicle systems (AGVS) | Oktober 2005, draf Juli 2025 [18] | AGV dan AMR (Jerman) |
| ISA/IEC 62443 | Security for industrial automation and control systems | rangkaian standar [59] | keamanan sistem otomasi |
| NIST SP 800-82 Rev. 3 | Guide to Operational Technology (OT) Security | September 2023 [55] | panduan keamanan OT (AS) |

## 15. Kategori perangkat lunak: perbandingan netral

Pasar ini sulit dinavigasi karena banyak vendor menyebut produk mereka sebagai "digital twin". Klasifikasi berdasarkan fungsi lebih membantu:

| Kategori | Fungsi utama | Kekuatan | Keterbatasan | Pengguna tipikal |
|---|---|---|---|---|
| Alat simulasi kejadian diskret | simulasi aliran material dan pabrik | kebebasan pemodelan tinggi, metode yang sudah mapan | pembuatan model memerlukan usaha, membutuhkan keahlian | pakar simulasi, perencanaan pabrik |
| Alat simulasi multi-metode | kombinasi kejadian diskret, berbasis agen, dinamika sistem | fleksibel untuk pertanyaan campuran | kurva belajar yang curam | pakar simulasi dan logistik |
| Suite pabrik digital dan PLM | tata letak, robotika, perencanaan proses, simulasi dalam konteks PLM | kesinambungan dari desain hingga produksi | kompleksitas, biaya lisensi | perusahaan besar, otomotif |
| Alat virtual commissioning | model peralatan dengan kopling PLC (SiL/HiL) | pengujian kontrol sebelum pemasangan | berfokus pada peralatan, bukan pabrik | insinyur kontrol, produsen mesin |
| Alat perencanaan berbasis value stream dan PPR | model dari data ERP dan value stream, simulasi, skenario | pembangunan cepat dari data yang ada, dekat dengan operasi | kurang cocok untuk sistem konveyor yang rinci | perencanaan produksi, lean, manajemen pabrik |
| Sistem APS | perencanaan dan penjadwalan berkendala kapasitas | penjadwalan operasional | simulasi sering terbatas | perencanaan dan pengendalian produksi |
| Platform IoT dan twin | model aset, pemrosesan event, graf (misalnya Azure Digital Twins) | skala, integrasi, real time | tanpa simulasi bawaan | tim IT, tim platform data |
| Platform 3D dan fisika | adegan fotorealistik, fisika, pelatihan robot (misalnya berbasis OpenUSD) | visualisasi, robotika, pelatihan AI | logika proses dan dinamika pesanan bukan fokus | robotika, proyek besar |

**Kriteria pemilihan:** Apakah alat ini sesuai dengan pertanyaan dan tingkat detail yang dibutuhkan? Seberapa cepat model dapat dibangun dari data Anda yang ada? Dapatkah staf operasional menggunakannya sendiri? Bagaimana perawatannya? Antarmuka apa saja yang tersedia ke ERP, MES, dan platform data Anda? Standar apa saja yang didukung (AAS, OPC UA, MTConnect, DTDL)? Di mana data disimpan, dan siapa yang memiliki akses?

## 16. Keamanan, kepemilikan data, dan regulasi

Sebuah twin produksi menyimpan informasi sensitif: struktur produk, waktu proses, kapasitas, dan pesanan pelanggan menggambarkan pengetahuan dan posisi persaingan sebuah perusahaan. Semakin tinggi tingkat integrasi, semakin besar risikonya.

- **Pemisahan TI/OT:** Twin yang menulis kembali ke kontrol memerlukan konsep zona-dan-conduit sesuai ISA/IEC 62443, seri yang mendefinisikan persyaratan dan proses untuk sistem otomasi dan kontrol industri yang aman [59], serta titik persilangan yang terdefinisi dan pencatatan log. NIST SP 800-82 Rev. 3 (September 2023) adalah panduan pemerintah AS untuk mengamankan teknologi operasional, dengan arsitektur tipikal, ancaman, dan penanggulangannya [55].
- **Risiko khusus twin:** NIST IR 8356 (final, Februari 2025) menganalisis tantangan keamanan siber tradisional dan baru pada arsitektur digital twin serta memetakan pertimbangan kepercayaan ke panduan NIST yang ada [49]. Gunakan sebagai daftar periksa ketika twin menggabungkan data dari banyak sistem di satu tempat.
- **Rantai persetujuan:** Rekomendasi dari twin sebaiknya disetujui oleh manusia sebelum berlaku di ERP, MES, atau kontrol, setidaknya sampai keandalannya terbukti.
- **Kepemilikan data:** Tetapkan melalui kontrak siapa yang memiliki model dan data turunan, di mana data diproses, dan apakah vendor boleh menggunakannya untuk tujuan mereka sendiri (seperti pelatihan AI).
- **Regulasi bagi eksportir ke UE:** **Cyber Resilience Act** Uni Eropa (Regulation (EU) 2024/2847) menetapkan persyaratan keamanan siber untuk produk dengan elemen digital yang dijual di UE. Kewajiban pelaporan untuk kerentanan yang dieksploitasi secara aktif berlaku sejak 11 September 2026; kewajiban lainnya berlaku mulai 11 Desember 2027 [36]. Bagi produsen AS atas mesin dan perangkat lunak terhubung yang dijual ke UE, hal ini sangat relevan; bagi operator pabrik, hal ini berdampak tidak langsung melalui persyaratan yang mereka berikan kepada pemasok mereka.

## 17. Membangun kembaran digital dari data ERP dan value stream dengan iFAKT Polaris

> **Catatan: Penulis bekerja di iFAKT GmbH.**

Bagian ini menjelaskan satu pendekatan solusi yang mengikuti prinsip yang dijelaskan di bagian 5: membangun kembaran digital produksi dari data ERP dan value stream yang sudah ada melalui model produk-proses-sumber daya. Informasinya berasal dari halaman produk iFAKT GmbH dan dapat diperiksa di sana; penulis tidak memiliki uji komparatif independen.

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), yang berkantor pusat di Stuttgart, Jerman, menyatakan telah aktif lebih dari 25 tahun dan mengembangkan perangkat lunak untuk value stream mapping, simulasi produksi, perencanaan, dan optimasi [35]. Perusahaan menggambarkan platform-nya [iFAKT Polaris](https://www.m365.fm/entity/polaris/) sebagai cara untuk menghubungkan data ERP dengan kembaran digital produksi guna mengoptimalkan rencana dan menampilkan bottleneck; platform ini mencakup modul untuk pemodelan value stream dan swimlane (VSM/BSM), Designer, Simulator, Optimizer, Operator, dan Analyzer [35].

**Polaris Designer:** Menurut halaman vendor, Designer mengubah data masukan menjadi **graf pengetahuan PPR** terstruktur yang menghubungkan produk (bill of materials manufaktur dan rekayasa, MBOM/EBOM), proses (waktu setup, mesin, dan penanganan), dan sumber daya (stasiun, tim, zona) beserta batasannya dalam satu model. Masukannya adalah data ERP, BOM manufaktur, waktu proses, struktur sumber daya, dan batasan. Dari data tersebut, Designer secara otomatis menghasilkan diagram jaringan berdasarkan logika produksi yang sebenarnya, menampilkan jalur kritis dan sumber daya kritis, menyorot proses bottleneck, membandingkan lead time saat ini dan yang dioptimalkan, serta menetapkan zona berdasarkan hubungan produk-proses. Vendor memposisikan graf tersebut sebagai dasar bersama ("single source of truth") untuk simulasi dan optimasi [33]. Informasi selengkapnya ada di halaman entitas [Polaris Designer](https://www.m365.fm/entity/polaris-designer/).

**Polaris Simulator:** Menurut vendor, Simulator dibangun di atas graf PPR yang dibuat di Designer dan menjalankan diagram jaringan melalui model stasiun, lini, dan area produksi (hall) yang dapat dikonfigurasi, untuk satu lini maupun banyak lini. Tujuannya adalah membuat pemanfaatan kapasitas lintas shift dan skenario menjadi transparan, mendeteksi bottleneck dan ketidakseimbangan utilisasi dari waktu ke waktu, menampilkan kelebihan dan kekurangan utilisasi serta utilisasi tenaga kerja berbasis waktu, dan mengevaluasi skenario untuk kapasitas, penempatan tenaga kerja, dan buffer serta bauran produk dinamis pada sumber daya bersama [34]. Informasi selengkapnya ada di halaman entitas [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/).

**Latar belakang teknis:** Karyawan iFAKT telah menerbitkan tulisan tentang pertanyaan dasar tersebut di majalah industri Jerman, misalnya tentang simulasi dinamis value stream (ZWF 109(11), 2014) [31] dan, bersama mitra riset, tentang antarmuka data universal untuk layanan value stream digital (ZWF 118(5), 2023) [32].

**Penilaian:** Pendekatan berbasis PPR dan value stream sangat cocok untuk pertanyaan perencanaan produksi, kapasitas, bottleneck, dan penempatan tenaga kerja di area perakitan dan fabrikasi dengan bauran produk yang tinggi. Untuk sistem konveyor yang detail, sel robot, atau virtual commissioning pada tingkat sinyal, kategori khusus di bagian 15 lebih sesuai. Seperti perangkat lain, uji dalam pilot dengan data Anda sendiri apakah hasilnya menjawab pertanyaan Anda. Panduan khusus kami tentang [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) membahas platform ini secara lebih mendalam.

## 18. Glosarium

| Istilah | Penjelasan |
|---|---|
| Advanced planning and scheduling (APS) | perangkat lunak untuk perencanaan dan penjadwalan yang memperhitungkan kapasitas terbatas |
| Agent-based simulation (ABS) | pemodelan unit otonom (agen) dengan aturannya sendiri, yang interaksinya menghasilkan perilaku sistem |
| AGV / AMR | automated guided vehicle / autonomous mobile robot [53][54] |
| Asset Administration Shell (AAS) | representasi digital standar dari aset sesuai IEC 63278 [10] |
| Bottleneck (constraint) | sumber daya yang membatasi throughput sistem secara keseluruhan [39] |
| Digital factory | istilah payung untuk model, metode, dan alat digital untuk merencanakan dan memperbaiki pabrik nyata (pedoman Jerman VDI 4499) [16][17] |
| Digital model | representasi digital tanpa pertukaran data otomatis dengan objek fisik [5] |
| Digital shadow | representasi dengan aliran data otomatis dari fisik ke digital, tetapi aliran balik secara manual [5] |
| Digital thread | keterkaitan informasi yang tersambung sepanjang siklus hidup; dibahas dalam ISO 23247-5 [7] |
| Digital twin | representasi dengan aliran data otomatis di kedua arah [5]; dalam praktik sering dipakai dengan makna yang lebih luas |
| Discrete event simulation (DES) | simulasi yang jam simulasinya melompat dari satu kejadian ke kejadian berikutnya; standar dalam simulasi produksi |
| DTDL | Digital Twins Definition Language, bahasa pemodelan berbasis JSON untuk Azure Digital Twins [22] |
| ERP | enterprise resource planning, sistem bisnis inti dengan data induk, pesanan, dan perencanaan material |
| HiL / SiL / MiL | hardware-, software-, model-in-the-loop: varian integrasi untuk virtual commissioning |
| ISA-95 / IEC 62264 | rangkaian standar untuk mengintegrasikan sistem perusahaan dan sistem kendali [58] |
| Little's Law | L = λ · W: rata-rata persediaan sama dengan laju throughput dikali lead time dalam kondisi tunak [37] |
| Material flow simulation | simulasi aliran material dan pesanan melalui produksi dan logistik, biasanya bersifat discrete event |
| MBOM / EBOM | manufacturing bill of materials / engineering bill of materials |
| MES | manufacturing execution system, manajemen operasi pada level 3 ISA-95 |
| MTConnect | standar terbuka untuk interoperabilitas data manufaktur, diterbitkan sebagai ANSI/MTC1.4-2018 [57] |
| OPC UA | standar komunikasi independen vendor dengan model informasi (IEC 62541) |
| PPR model | model produk-proses-sumber daya, prinsip penyusunan dari digital factory |
| Replication | pengulangan run simulasi dengan bilangan acak yang berbeda untuk kepastian statistik [41] |
| Validation | pemeriksaan apakah model cukup akurat merepresentasikan kenyataan untuk tujuannya |
| Value stream simulation | simulasi dinamis dari value stream map sepanjang waktu [31] |
| Verification | pemeriksaan apakah model telah diimplementasikan dengan benar |
| Virtual commissioning | pengujian perangkat lunak kendali terhadap model simulasi sebelum commissioning fisik [14] |
| VVUQ | verification, validation and uncertainty quantification; diusulkan oleh NIST sebagai bagian ISO 23247 di masa depan [48] |
| Warm-up period | fase awal run simulasi yang hasilnya dibuang karena kondisi awal yang kosong |

## 19. FAQ: digital twin dalam manufaktur

### Apa itu digital twin dalam manufaktur, secara sederhana?
Digital twin adalah model komputer yang dapat dijalankan dari produksi Anda dan diperbarui dengan data dari operasi nyata. Anda dapat menggunakannya untuk memainkan skenario operasi, menemukan bottleneck, dan menguji perubahan sebelum dilakukan di lantai produksi yang sebenarnya.

### Apa saja 4 jenis digital twin?
Skema empat tingkat yang umum membedakan twin komponen (bagian), twin aset, twin sistem (unit) dan twin proses [52]. Untuk keputusan manufaktur, pembagian yang lebih berguna adalah twin produk, proses, aset, pabrik, kinerja, dan rantai pasok (lihat bagian 3). Tidak ada klasifikasi ini yang terstandar; ISO/IEC 30173 hanya menjelaskan jenis twin secara umum [9].

### Apa perbedaan antara digital twin dan digital shadow?
Menurut Kritzinger dkk., pada digital shadow data mengalir secara otomatis dari objek fisik ke objek digital, tetapi jalur kembalinya dilakukan secara manual. Pada digital twin, data mengalir secara otomatis di kedua arah [5]. Model digital sama sekali tidak memiliki pertukaran data otomatis.

### Apa contoh digital twin dalam manufaktur?
Contoh yang umum adalah model pabrik yang membandingkan varian tata letak sebelum gedung baru disetujui, simulasi yang diisi setiap hari dari ERP dan MES untuk memeriksa apakah jadwal minggu ini dapat dipertahankan, model virtual commissioning yang menguji kode PLC sebelum lini dipasang, dan model armada AGV yang menentukan jumlah kendaraan serta pengisian dayanya. McKinsey mendokumentasikan kasus seperti jadwal perakitan yang didesain ulang dengan penghematan biaya 5 hingga 7 persen per bulan dan urutan bottleneck yang memangkas waktu proses sekitar empat persen [26].

### Apa perbedaan antara digital twin dan simulasi?
Simulasi adalah model yang Anda gunakan untuk menjalankan eksperimen. Ia menjadi digital shadow atau twin ketika diisi secara otomatis dengan data operasi dan hasilnya kembali memengaruhi keputusan atau kendali. Banyak twin memiliki simulasi sebagai intinya.

### Apakah model 3D atau model BIM merupakan digital twin?
Tidak dengan sendirinya. Pemindaian 3D, tata letak CAD, atau building information model (BIM) hanya merekam geometri. Tanpa logika proses (routing, waktu, sumber daya) dan koneksi data ke operasi, model tersebut tidak dapat menjawab pertanyaan tentang kapasitas atau lead time. Model tersebut dapat menjadi lapisan yang berguna dari sebuah twin, terutama dalam perencanaan tata letak brownfield.

### Apa perbedaan antara simulasi produksi dan virtual commissioning?
Simulasi produksi mengevaluasi operasi pada tingkat order dan sumber daya (throughput, lead time, bottleneck). Virtual commissioning menguji perangkat lunak kendali mesin pada tingkat sinyal terhadap model peralatan sebelum peralatan fisiknya dibangun [14].

### Data apa yang dibutuhkan digital twin manufaktur?
Untuk twin produksi dan pabrik, Anda terutama membutuhkan bill of materials, routing dengan waktu, work center dan kapasitas, pola shift, order, serta konfirmasi. Data ini sebagian besar berasal dari ERP dan MES. Data mesin dan sensor memperbaiki model, tetapi jarang menjadi titik awal.

### Bisakah membangun digital twin dari data ERP?
Bisa. Untuk pertanyaan kapasitas, lead time, dan penjadwalan, sistem ERP adalah sumber terpenting. Sistem ini menyimpan data produk, proses, dan sumber daya dalam bentuk terstruktur. Pemeriksaan kualitas data sangat penting, karena waktu standar dan waktu setup sering berbeda dari kenyataan.

### Jenis simulasi apa yang digunakan dalam manufaktur?
Sebagian besar discrete event simulation, yang penghitung waktunya melompat dari satu peristiwa ke peristiwa berikutnya. System dynamics ditambahkan untuk pertanyaan strategis, agent-based simulation untuk kendaraan dan manusia, dan simulasi 3D berbasis fisika untuk sel robot serta pengujian kendali.

### Seberapa akurat digital twin harus dibuat?
Cukup akurat untuk keputusan yang didukungnya, dan tidak lebih. Validasi model terhadap data aktual untuk metrik yang penting (misalnya throughput atau lead time), dokumentasikan asumsi, dan jalankan analisis sensitivitas. NIST sedang mengembangkan kerangka kerja verifikasi, validasi, dan kuantifikasi ketidakpastian untuk twin manufaktur [48].

### Standar apa yang berlaku untuk digital twin di manufaktur?
Standar inti adalah ISO 23247 (kerangka kerja digital twin untuk manufaktur, Bagian 1 sampai 6) [6][7][8], ISO/IEC 30173 (terminologi) [9], IEC 63278-1 (Asset Administration Shell) [10], dan ISA-95 / IEC 62264 [58]. Untuk keamanan, gunakan ISA/IEC 62443 [59] dan NIST SP 800-82 [55]. NIST AMS 400-2 menunjukkan cara menerapkan ISO 23247 [47]. Pedoman Jerman (VDI 3633 untuk simulasi, VDI/VDE 3693 untuk virtual commissioning, VDI 4499 untuk pabrik digital) menambahkan detail metode [13][14][16].

### Apakah digital twin cocok untuk produsen kecil dan menengah?
Ya, jika Anda memulai dengan pertanyaan yang ruang lingkupnya jelas. Pilot untuk satu value stream atau satu area berbasis data ERP yang sudah ada membutuhkan upaya jauh lebih kecil dibandingkan proyek IoT skala seluruh pabrik, dan memberikan manfaat yang dapat diverifikasi lebih cepat. Laporan kasus penggunaan ISO 23247 dari NIST menyasar kelompok ini secara tepat [47], dan pusat NIST MEP menawarkan dukungan dari luar [60].

### Berapa biaya digital twin?
Itu bergantung pada ruang lingkup, kondisi data, dan tingkat integrasi. Item biaya terbesar biasanya adalah persiapan data, pemodelan, validasi, dan pemeliharaan, bukan perangkat lunaknya. Sebuah perusahaan jasa simulasi Jerman memberikan aturan praktis sebesar paling tinggi 1 persen dari investasi terkait untuk studi simulasi [30].

### Berapa lama implementasinya?
McKinsey memberikan rentang dua hingga tiga bulan sampai lebih dari satu tahun untuk proyek twin, tergantung kemampuan tim dan kompleksitas pabrik [26]. Pilot yang berfokus pada satu keputusan konkret biasanya dapat dilakukan dalam beberapa bulan.

### Bagaimana digital twin membantu merencanakan armada AGV dan AMR?
Digital twin mensimulasikan kendaraan dengan perjalanan, perjalanan kosong, waktu tunggu, konflik persimpangan, dan jeda pengisian daya. Dengan cara itu Anda menentukan jumlah kendaraan, rute, dan strategi pengisian daya, yang sering kali diremehkan oleh perhitungan statis.

### Apa peran kecerdasan buatan?
AI membantu menyiapkan data, mempercepat simulasi melalui model surrogat, mempelajari aturan kendali di dalam model, dan membuat twin dapat digunakan melalui bahasa alami. AI memerlukan model yang tervalidasi dan data yang bersih.

### Apakah Azure Digital Twins sama dengan digital twin builder di Fabric?
Tidak. Microsoft secara eksplisit menyatakan bahwa keduanya adalah layanan yang berbeda [21][23]. Azure Digital Twins adalah layanan PaaS untuk graf twin dengan DTDL; digital twin builder adalah alat ontologi dan pemetaan di Microsoft Fabric dan saat ini masih dalam pratinjau [23].

### Siapa yang menemukan digital twin?
Konsep ini berasal dari Michael Grieves, yang memaparkannya pada tahun 2002 dalam konteks product lifecycle management; Grieves menyebut John Vickers dari NASA sebagai pencetus nama "digital twin" [1][2]. Penulis lain menunjuk pada pendahulu yang lebih awal, misalnya dalam penelitian tentang manufaktur virtual [4].

## 20. Kesimpulan

Digital twin dalam manufaktur bukanlah teknologi baru, melainkan kombinasi konsisten dari tiga blok bangunan yang sudah terbukti: model terstruktur tentang produk, proses, dan sumber daya; simulasi yang menangkap dinamika dan variabilitas; serta umpan data dari operasi nyata. Standarnya sudah ada, mulai dari ISO 23247 dan ISA-95 hingga Asset Administration Shell, NIST menyediakan panduan implementasi di AS, dan metode simulasi pabrik telah diuji selama puluhan tahun.

Kesalahan yang paling umum bukanlah teknologi yang keliru, melainkan tidak adanya tujuan. Mulailah dari keputusan yang saat ini terlalu sering bergantung pada intuisi atau spreadsheet: investasi modal, bauran produk baru, armada AGV, atau jadwal mingguan yang sering tidak tepat. Periksa data ERP Anda secara jujur, bangun model percontohan yang tervalidasi, lalu putuskan tingkat integrasi mana yang dibenarkan oleh langkah berikutnya. Dengan cara itulah Anda mendapatkan twin yang tidak hanya tampak baik, tetapi juga meningkatkan kualitas keputusan.

## Bacaan lanjutan di m365.fm

**Postingan blog dan episode**

- [Digital twin dalam manufaktur: dari mana memulai](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Dari ERP ke lantai produksi: digital twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Episode: Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Episode: Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Halaman entitas**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/) · [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/)
- [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/)
- [iFAKT](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

**Panduan terkait**

- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** adalah pembawa acara m365.fm dan bekerja di iFAKT GmbH. Di m365.fm, ia menulis tentang digitalisasi manufaktur dengan Microsoft 365 dan Azure, metode value stream, perencanaan produksi, dan digital twin. Fokusnya adalah bagaimana menurunkan model yang andal untuk perencanaan dan keputusan modal dari data ERP dan value stream yang sudah ada.

**Catatan: Penulis bekerja di iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources [1] to [46] are carried over from the German version; [47] to [61] are new US/English sources, each opened and verified for this version.

1. Grieves, M.; Vickers, J. (2017): Digital Twin: Mitigating Unpredictable, Undesirable Emergent Behavior in Complex Systems. In: Kahlen, F.-J.; Flumerfelt, S.; Alves, A. (eds.): Transdisciplinary Perspectives on Complex Systems. Springer, Cham. DOI: [10.1007/978-3-319-38756-7_4](https://doi.org/10.1007/978-3-319-38756-7_4)
2. Grieves, M.: Digital and Physical Twins (book chapter, provided in the ASME resource library). https://event.asme.org/Events/media/library/resources/digital-twin/Digital-and-Physical-Twins.pdf
3. Glaessgen, E. H.; Stargel, D. S. (2012): The Digital Twin Paradigm for Future NASA and U.S. Air Force Vehicles. 53rd AIAA/ASME/ASCE/AHS/ASC Structures, Structural Dynamics and Materials Conference, Honolulu, April 23–26, 2012. NASA Technical Reports Server 20120008178. https://ntrs.nasa.gov/citations/20120008178
4. Zhou, J.; Zhang, S.; Gu, M. (2022): Revisiting Digital Twins: Origins, Fundamentals and Practices. arXiv:2203.12867 (with reference to Shafto et al. 2010, NASA Modeling, Simulation, Information Technology & Processing Roadmap). https://arxiv.org/abs/2203.12867
5. Kritzinger, W.; Karner, M.; Traar, G.; Henjes, J.; Sihn, W. (2018): Digital Twin in manufacturing: A categorical literature review and classification. IFAC-PapersOnLine 51(11), pp. 1016–1022. DOI: [10.1016/j.ifacol.2018.08.474](https://doi.org/10.1016/j.ifacol.2018.08.474)
6. ISO 23247-1:2021 Automation systems and integration: Digital twin framework for manufacturing, Part 1: Overview and general principles (Parts 2 to 4 also 2021). Catalog entry: https://iteh.eu/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021
7. ISO 23247-5 Automation systems and integration: Digital twin framework for manufacturing, Part 5: Digital thread for digital twin (Edition 1, 2026-06; status "under publication" when checked on November 20, 2026). https://www.iso.org/standard/87425.html
8. ISO 23247-6:2026 Automation systems and integration: Digital twin framework for manufacturing, Part 6: Digital twin composition (published July 14, 2026, stage 60.60). https://committee.iso.org/standard/87426.html
9. ISO/IEC 30173:2023 Digital twin: Concepts and terminology (November 2023). https://www.iso.org/standard/81442.html
10. IEC 63278-1:2023 Asset Administration Shell for industrial applications, Part 1: Asset Administration Shell structure (December 14, 2023). https://webstore.iec.ch/en/publication/65628
11. ZVEI (2020): User organization Industrial Digital Twin Association founded (founded September 24, 2020). https://www.zvei.org/en/press-media/pressarea/user-organization-industrial-digital-twin-association-founded
12. DIN SPEC 91345:2016-04 Reference Architecture Model Industrie 4.0 (RAMI4.0). https://www.dinmedia.de/de/technische-regel/din-spec-91345/250940128
13. VDI 3633 Part 1:2014-12 Simulation of systems in materials handling, logistics and production: Fundamentals. https://vdi.de/richtlinien/details/vdi-3633-blatt-1-simulation-of-systems-in-materials-handling-logistics-and-production-fundamentals ; VDI 3633 Part 8 (machine-oriented simulation, 3D motion and process simulation): https://www.vdi.de/mitgliedschaft/vdi-richtlinien/details/vdi-3633-blatt-8-simulation-of-systems-in-materials-handling-logistics-and-production-machine-oriented-simulation-3d-motion-and-process-simulation
14. VDI/VDE 3693 Part 1:2016-08 Virtual commissioning: Model types and glossary. https://vdi.de/richtlinien/details/vdivde-3693-blatt-1-virtual-commissioning-model-types-and-glossary
15. VDI/VDE 3693 Part 2:2018-12 Virtual commissioning: Introduction of virtual commissioning in companies; revision announced. https://vdi.de/en/home/vdi-standards/details/vdivde-3693-blatt-2-virtual-commissioning-introduction-of-virtual-commissioning-in-companies ; edition history: https://dinmedia.de/en/draft-technical-rule/vdi-vde-3693-blatt-2/276110751
16. VDI 4499 Part 1:2026-04 Digital factory: Fundamentals. https://vdi.de/richtlinien/details/vdi-4499-blatt-1-digital-factory-fundamentals
17. University of Duisburg-Essen, Chair VIP: lecture notes "Digitale Fabrik" (quotes the definition from VDI 4499 Part 1:2008; in German). https://www.uni-due.de/imperia/md/content/vip/scriptum_digitalefabrik.pdf
18. VDI 2510:2005-10 Automated guided vehicle systems (AGVS). https://vdi.de/richtlinien/details/vdi-2510-automated-guided-vehicle-systems-agvs ; draft VDI 2510:2025-07: https://www.dinmedia.de/de/technische-regel-entwurf/vdi-2510/388587666
19. OPC Foundation: OPC 10030 ISA-95 Common Object Model, section 4.2.3 ISA-95. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
20. Schuh, G.; Anderl, R.; Dumitrescu, R.; Krüger, A.; ten Hompel, M. (2020): Industrie 4.0 Maturity Index. Managing the Digital Transformation of Companies. Update 2020 (acatech STUDY). https://en.acatech.de/publication/industrie-4-0-maturity-index-update-2020/
21. Microsoft Learn: What is Azure Digital Twins? https://learn.microsoft.com/azure/digital-twins/overview
22. Microsoft Learn: Learn about twin models and how to define them in Azure Digital Twins (DTDL v2 and v3). https://learn.microsoft.com/en-ca/azure/digital-twins/concepts-models
23. Microsoft Learn: What Is Digital Twin Builder (Preview)? (last updated May 20, 2026; preview label re-checked November 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
24. Microsoft Fabric Blog: Digital twin builder in Microsoft Fabric Real-Time Intelligence. https://blog.fabric.microsoft.com/en-us/blog/digital-twin-builder-in-microsoft-fabric-real-time-intelligence-revolutionizing-digital-twin-creation-and-management
25. NVIDIA Blog (March 31, 2025): Industrial Ecosystem Adopts Mega NVIDIA Omniverse Blueprint to Train Physical AI in Digital Twins. https://blogs.nvidia.com/blog/mega-omniverse-blueprint-industrial-digital-twins/
26. Camarella, S.; Conway, M. P.; Goering, K.; Huntington, M. (2024): Digital twins: The next frontier of factory optimization. McKinsey & Company, January 10, 2024. https://www.mckinsey.com/capabilities/operations/our-insights/digital-twins-the-next-frontier-of-factory-optimization
27. Fraunhofer IWU (2024): Sächsische Maschinenbauer nutzen Vorteile der Virtuellen Inbetriebnahme oft noch nicht (press release on the SaxoVI study, August 13, 2024; in German). https://www.iwu.fraunhofer.de/content/dam/iwu/de/documents/Presse/2024-Saechsische-Maschinenbauer-nutzen-Vorteile-der-Virtuellen-Inbetriebnahme-oft-noch-nicht.pdf
28. Poll, D. (2021): Digitalisierung bei ZF: Neue Methode spart 30 Prozent Zeit. produktion.de, June 16, 2021 (in German). https://www.produktion.de/technik/digitalisierung-bei-zf-neue-methode-spart-30-prozent-zeit/1656151
29. Fraunhofer IESE: Digitaler Zwilling in der Produktion & Industrie 4.0 (in German). https://www.iese.fraunhofer.de/de/leistungen/digitaler-zwilling.html
30. SimPlan AG: FAQ Simulation (definition according to VDI 3633, cost-benefit rules of thumb). https://www.simplan.de/en/knowledge/faq-simulation-en
31. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (2014): Dynamische Simulation von Wertströmen [Dynamic simulation of value streams]. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109(11), pp. 839–842. DOI: [10.3139/104.111242](https://doi.org/10.3139/104.111242)
32. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (2023): Universelle Datenschnittstelle für digitale Wertstromdienste [Universal data interface for digital value stream services]. ZWF 118(5), pp. 293–297. DOI: [10.1515/zwf-2023-1062](https://doi.org/10.1515/zwf-2023-1062)
33. iFAKT GmbH: Polaris Designer (product page). https://www.ifakt.de/en/solutions/designer
34. iFAKT GmbH: Polaris Simulator (product page). https://www.ifakt.de/en/solutions/simulator
35. iFAKT GmbH: home page (company and Polaris platform). https://www.ifakt.de/
36. European Commission: Cyber Resilience Act, summary (Regulation (EU) 2024/2847). https://digital-strategy.ec.europa.eu/en/policies/cra-summary
37. Little, J. D. C. (1961): A Proof for the Queuing Formula: L = λW. Operations Research 9(3), pp. 383–387. DOI: [10.1287/opre.9.3.383](https://doi.org/10.1287/opre.9.3.383)
38. Forrester, J. W. (1961): Industrial Dynamics. MIT Press, Cambridge, MA.
39. Goldratt, E. M.; Cox, J. (1984): The Goal: A Process of Ongoing Improvement. North River Press.
40. Rother, M.; Shook, J. (1998): Learning to See: Value Stream Mapping to Add Value and Eliminate Muda. Lean Enterprise Institute, Brookline, MA.
41. Law, A. M. (2015): Simulation Modeling and Analysis. 5th ed., McGraw-Hill Education, New York.
42. SYMESTIC: Was ist ISA-95? (level model, relation to IEC 62264; in German). https://www.symestic.com/de-de/was-ist/isa-95
43. Umbrex: ISO 23247 Digital Twin Framework for Manufacturing (overview of parts and reference architecture). https://umbrex.com/resources/frameworks/manufacturing-industrial-equipment-frameworks/iso-23247-digital-twin-framework-for-manufacturing/
44. NEURONwriter: analysis "digitaler zwilling fertigung", google.de, query f5135b90c13e4c59 (internal analysis for the German version, accessed November 20, 2026).
45. NEURONwriter: analysis "produktionssimulation", google.de, query 3ee168d2a2cb38f1 (internal analysis for the German version, accessed November 20, 2026).
46. Kingman, J. F. C. (1961): The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57(4), pp. 902 ff. DOI: [10.1017/S0305004100036094](https://doi.org/10.1017/S0305004100036094)
47. Shao, G. (2021): Use Case Scenarios for Digital Twin Implementation Based on ISO 23247. NIST Advanced Manufacturing Series (NIST AMS) 400-2, May 4, 2021. DOI: [10.6028/NIST.AMS.400-2](https://doi.org/10.6028/NIST.AMS.400-2); publication page: https://www.nist.gov/publications/use-case-scenarios-digital-twin-implementation-based-iso-23247
48. NIST: Digital Twins for Advanced Manufacturing (project page; ISO 23247 Part 5 reference implementation, proposed VVUQ framework as Part 7, MTConnect interface, NIST Digital Twin Testbed). https://nist.gov/programs-projects/digital-twins-advanced-manufacturing
49. Voas, J.; Mell, P.; Laplante, P.; Piroumian, V. (2025): Security and Trust Considerations for Digital Twin Technology. NIST IR 8356 (final), February 14, 2025 (initial public draft 2021 titled "Considerations for Digital Twin Technology and Emerging Standards"). DOI: [10.6028/NIST.IR.8356](https://doi.org/10.6028/NIST.IR.8356); https://csrc.nist.gov/pubs/ir/8356/final
50. National Academies of Sciences, Engineering, and Medicine (2024): Foundational Research Gaps and Future Directions for Digital Twins. Consensus Study Report, The National Academies Press, Washington, DC (definition and quotes on p. 22). https://www.nationalacademies.org/our-work/foundational-research-gaps-and-future-directions-for-digital-twins ; chapter: https://www.nationalacademies.org/read/26894/chapter/4
51. Digital Twin Consortium (2020): Digital Twin Consortium Defines Digital Twin (definition released December 3, 2020). https://www.digitaltwinconsortium.org/2020/12/digital-twin-consortium-defines-digital-twin ; current definition page: https://www.digitaltwinconsortium.org/initiatives/the-definition-of-a-digital-twin/
52. IBM: What Is a Digital Twin? (component, asset, system and process twins). https://www.ibm.com/think/topics/what-is-a-digital-twin
53. ANSI/ITSDF B56.5-2024: Safety Standard for Guided Industrial Vehicles. ANSI Blog summary: https://blog.ansi.org/ansi/ansi-itsdf-b56-5-2024-guided-industrial-vehicles/
54. ANSI/A3 R15.08-1-2020 (R2026): Industrial Mobile Robots, Safety Requirements, Part 1: Requirements for the Industrial Mobile Robot (reaffirmed 2026, no technical changes). ANSI Webstore: https://webstore.ansi.org/standards/ria/ansia3r15082020r2026
55. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3); https://csrc.nist.gov/pubs/sp/800/82/r3/final
56. Deloitte (2025): 2025 Smart Manufacturing and Operations Survey, press release May 1, 2025 (600 executives, US manufacturers with $500 million+ revenue, survey August–September 2024). https://www.deloitte.com/us/en/about/press-room/deloitte-2025-smart-manufacturing-survey.html
57. MTConnect Institute: MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals, Version 1.4.0. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf ; about MTConnect: https://www.mtconnect.org/about
58. International Society of Automation (ISA): ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
59. International Society of Automation (ISA): ISA/IEC 62443 Series of Standards. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
60. NIST: Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep
61. Federal Trade Commission: Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, § 255.5 (disclosure of material connections, including an employee example); FTC notice on the revised Guides. https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf
