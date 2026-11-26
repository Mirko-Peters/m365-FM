# SEO metadata

| Field | Value |
|---|---|
| Meta title | Theorie der Engpässe in der Fertigung: 5 Schritte, Engpass |
| Meta description | Theorie der Engpässe in der Fertigung: fünf Fokussierungsschritte, Engpassanalyse, Drum-Buffer-Rope mit Zahlen, Durchsatzrechnung und Vorlagen. |
| Slug | `theory-of-constraints` |

# Theorie der Engpässe: Die fünf Fokussierungsschritte, Engpässe und Drum-Buffer-Rope

> **Jawaban singkat:** Teori kendala (theory of constraints, TOC) adalah pendekatan manajemen yang dikembangkan oleh Eliyahu M. Goldratt dan diperkenalkan dalam novel bisnis *The Goal* tahun 1984. Teori ini menyatakan bahwa output suatu sistem dibatasi oleh sangat sedikit kendala, sering kali satu bottleneck, sehingga upaya perbaikan harus diarahkan ke sana terlebih dahulu. TOC menerapkannya melalui lima langkah pemusatan (identifikasi, eksploitasi, subordinasi, elevasi, mencegah inersia), metode penjadwalan drum-buffer-rope, dan akuntansi throughput [1][4][6].

> **Poin-poin utama**
> - *The Goal* karya Eliyahu M. Goldratt dan Jeff Cox pertama kali diterbitkan tahun 1984 oleh North River Press; pada 2011 buku ini telah terjual lebih dari 5 juta eksemplar dalam 35 bahasa [1][2].
> - Lima langkah pemusatan adalah: identifikasi kendala, eksploitasi kendala tersebut, subordinasikan semua hal lain terhadapnya, elevasi kendala tersebut, dan cegah inersia agar tidak menjadi kendala [4].
> - Satu jam yang hilang pada kendala berarti satu jam yang hilang bagi seluruh pabrik. Satu jam yang dihemat pada non-kendala tidak mengubah apa pun kecuali jika meringankan kendala.
> - Drum-buffer-rope (DBR) menjadwalkan kendala (drum), melindunginya dengan buffer waktu (buffer), dan melepas material hanya sesuai kecepatan yang dapat diserap kendala (rope) [6][8].
> - Akuntansi throughput menilai keputusan berdasarkan throughput (penjualan dikurangi biaya variabel sesungguhnya), persediaan/investasi, dan biaya operasi, serta memeringkat produk berdasarkan throughput per menit kendala, yang dapat membalik peringkat yang diberikan oleh akuntansi biaya standar [6][19][20].
> - Deteksi bottleneck harus berbasis data: pemeriksaan beban kapasitas, pengamatan antrean, dan, jika tersedia data status mesin, metode periode aktif, yang juga memperlihatkan bottleneck yang berpindah [13][14][15].
> - Sebuah tinjauan tahun 2003 atas lebih dari 80 penerapan TOC yang dipublikasikan menemukan keuntungan operasional dan finansial yang besar dan tidak ada kegagalan yang dilaporkan, yang juga menunjukkan sesuatu tentang kasus mana yang dipublikasikan [10].
> - TOC, lean, dan Six Sigma paling efektif jika digabungkan: TOC menentukan di mana fokus harus diarahkan, lean menghilangkan pemborosan dan menciptakan aliran, Six Sigma mengurangi variasi di titik yang paling menentukan.

## Daftar isi

1. [Apa itu teori kendala? Definisi dan gagasan inti](#apa-itu-teori-kendala-definisi-dan-gagasan-inti)
2. [Sejarah: Eliyahu Goldratt, OPT dan The Goal](#sejarah-eliyahu-goldratt-opt-dan-the-goal)
3. [Kendala vs. bottleneck: jenis-jenis kendala](#constraint-vs-bottleneck-jenis-jenis-kendala)
4. [Lima langkah pemusatan](#lima-langkah-pemusatan)
5. [Contoh teori kendala: lima langkah pemusatan di pabrik manifold](#contoh-teori-kendala-lima-langkah-pemusatan-di-pabrik-manifold)
6. [Analisis bottleneck: cara mengidentifikasi bottleneck (enam metode)](#analisis-bottleneck-cara-mengidentifikasi-bottleneck-enam-metode)
7. [Penjadwalan drum-buffer-rope dengan angka](#penjadwalan-drum-buffer-rope-dengan-angka)
8. [Simplified drum-buffer-rope (S-DBR) untuk make-to-order](#simplified-drum-buffer-rope-s-dbr-untuk-make-to-order)
9. [Manajemen buffer: loop umpan balik](#manajemen-buffer-loop-umpan-balik)
10. [Fisika pabrik di balik TOC: Hukum Little dan variabilitas](#fisika-pabrik-di-balik-toc-hukum-little-dan-variabilitas)
11. [Akuntansi throughput vs. akuntansi biaya](#akuntansi-throughput-vs-akuntansi-biaya)
12. [Proses berpikir](#proses-berpikir)
13. [TOC vs. lean vs. Six Sigma](#toc-vs-lean-vs-six-sigma)
14. [Di luar pabrik: critical chain dan replenishment](#di-luar-pabrik-rantai-kritis-dan-pengisian-ulang)
15. [Templat untuk pekerjaan TOC](#templat-untuk-pekerjaan-toc)
16. [Peta jalan implementasi: enam bulan pertama](#roadmap-implementasi-enam-bulan-pertama)
17. [KPI TOC: cara mengukur kemajuan](#kpi-toc-cara-mengukur-kemajuan)
18. [Kesalahan umum](#kesalahan-umum)
19. [Kritik dan batasan teori kendala](#kritik-dan-batasan-teori-kendala)
20. [Manusia dan keselamatan di kendala](#orang-dan-keselamatan-di-titik-kendala)
21. [TOC di pabrik digital: data, simulasi dan APS](#toc-di-pabrik-digital-data-simulasi-dan-aps)
22. [Glosarium](#glosarium)
23. [FAQ: pertanyaan tentang teori kendala](#faq-pertanyaan-tentang-teori-kendala)
24. [Kesimpulan dan langkah pertama](#kesimpulan-dan-langkah-pertama)

**Bagian mana yang sesuai dengan peran Anda?**

| Anda adalah ... | Mulai dengan |
|---|---|
| Plant manager atau direktur operasi | Bagian 4, 5, 16 dan 18 |
| Perencana produksi atau penjadwal | Bagian 6 sampai 10 |
| Plant controller atau CFO | Bagian 11 dan 17 |
| Pemimpin CI, lean atau Six Sigma | Bagian 12, 13 dan 15 |
| Mahasiswa atau yang baru mengenal TOC | Bagian 1 sampai 5, lalu glosarium |

## Apa itu teori kendala? Definisi dan gagasan inti

Teori kendala adalah cara mengelola organisasi sebagai rantai langkah yang saling bergantung. Titik awalnya sederhana: setiap sistem yang memiliki tujuan memiliki setidaknya satu faktor yang membatasi seberapa jauh tujuan itu dapat dicapai. TOC Institute memakai analogi rantai: sebuah rantai hanya sekuat mata rantai terlemahnya, dan memperkuat mata rantai lain tidak membuat rantai itu menjadi lebih kuat [4]. Buku-buku Goldratt berikutnya dan komunitas TOC memperluas gagasan ini dari lantai produksi ke distribusi, proyek, keuangan dan strategi [6].

Untuk pabrik manufaktur, tujuannya biasanya dinyatakan sebagai menghasilkan uang saat ini dan di masa depan. Faktor pembatas dapat berupa mesin, keterampilan, pemasok, kebijakan, atau pasar itu sendiri. TOC menyebutnya kendala. Klaim intinya adalah bahwa sebagian besar sistem hanya memiliki satu atau sangat sedikit kendala pada waktu tertentu. TOC Institute menyatakan bahwa sebagian besar sistem memiliki satu sumber daya yang dibatasi kapasitasnya dan jarang lebih dari dua atau tiga [4].

### Gagasan inti dalam satu paragraf

Jika output pabrik dibatasi oleh satu sumber daya, maka output pabrik sama dengan output sumber daya tersebut. Setiap menit yang hilang pada sumber daya itu adalah menit output pabrik yang hilang selamanya. Setiap menit yang dihemat di tempat lain hanya menjadi kapasitas cadangan paling baik, dan paling buruk menciptakan persediaan yang menunggu di depan kendala. Inilah sebabnya TOC mengatakan bahwa efisiensi lokal di non-kendala tidak menjumlahkan menjadi kinerja pabrik. Mencoba mengoptimalkan setiap langkah secara terpisah adalah usaha yang sia-sia; TOC memperbaiki keseluruhan sistem melalui kendalanya.

### Teori kendala dalam manufaktur: mengapa penting dalam praktik

Tiga situasi pabrik sehari-hari menunjukkan gagasan ini:

| Situasi | Reaksi umum tanpa TOC | Reaksi dengan TOC |
|---|---|---|
| Pesanan terlambat, WIP ada di mana-mana | mempercepat pengerjaan, menambah lembur di semua area, memulai pesanan lebih awal | temukan satu sumber daya yang membatasi output, lepaskan pekerjaan sesuai kecepatannya |
| Mesin non-kendala menganggur | mencari pekerjaan agar "efisiensi" tetap tinggi | biarkan mesin menunggu; waktu menganggur di non-kendala itu normal dan murah |
| Usulan mesin baru | disetujui karena departemen sedang sibuk | tanyakan apakah mesin itu menambah kapasitas di kendala dan apa dampaknya terhadap throughput |

### Manfaat teori kendala

Manfaat yang paling sering dilaporkan adalah waktu tunggu yang lebih singkat, kinerja ketepatan waktu pengiriman yang lebih baik, persediaan yang lebih rendah, dan throughput yang lebih tinggi. Tinjauan atas penerapan yang dipublikasikan oleh Mabin dan Balderstone, sebagaimana diringkas oleh Panizzolo, melaporkan rata-rata peningkatan 70 persen pada waktu tunggu order-to-delivery, 65 persen pada waktu siklus manufaktur, 49 persen pada persediaan, 63 persen pada throughput atau pendapatan, dan 44 persen pada kinerja ketepatan waktu pengiriman [11]. Panizzolo mengaitkan rata-rata ini dengan tinjauan Mabin dan Balderstone dalam bentuk buku *The World of the Theory of Constraints* (2000); artikel jurnal 2003 dari penulis yang sama menganalisis kumpulan lebih dari 80 kasus yang sama [10][11]. Perlakukan angka-angka tersebut sebagai batas atas dari yang mungkin dicapai: angka itu berasal dari kisah sukses yang dipublikasikan, dan tinjauan asli tidak menemukan laporan kegagalan sama sekali [10]. Bagian 19 membahas apa artinya hal itu.

Di luar angka-angka tersebut, TOC memberi pabrik satu jawaban bersama atas pertanyaan "di mana kita harus bekerja lebih dulu?" Itu sering kali menjadi perubahan terbesar: lebih sedikit proyek perbaikan proses, yang diarahkan ke tempat yang benar-benar mengubah hasil.

## Sejarah: Eliyahu Goldratt, OPT dan The Goal

Eliyahu M. Goldratt lahir pada 31 Maret 1947 dan meninggal pada 11 Juni 2011 di rumahnya di Israel. Ia memperoleh gelar BSc dari Universitas Tel Aviv serta MSc dan PhD dari Universitas Bar-Ilan [2][3]. Sebelum TOC memiliki nama, ia bekerja dengan Creative Output, perusahaan yang menjual Optimized Production Technology (OPT), sebuah perangkat lunak penjadwalan produksi [3].

| Tahun | Tonggak | Sumber |
|---|---|---|
| sebelum 1984 | Perangkat lunak penjadwalan OPT dijual oleh Creative Output, akar teknis drum-buffer-rope (tahun peluncuran pastinya [unverified: tahun peluncuran pastinya belum terverifikasi]) | [3] |
| 1984 | *The Goal: Excellence in Manufacturing* karya Goldratt dan Jeff Cox, North River Press, 262 halaman | [1] |
| sekitar 1985 | Avraham Y. Goldratt Institute didirikan setelah Goldratt meninggalkan Creative Output | [3] |
| 1986 | *The Race* (bersama Robert E. Fox) menjelaskan drum-buffer-rope secara rinci; edisi pertama *The Goal* yang direvisi | [3][7][8] |
| 1990 hingga 1991 | *The Haystack Syndrome*: throughput, inventory dan operating expense sebagai ukuran pengambilan keputusan | [3][20] |
| 1992 | edisi kedua *The Goal* yang direvisi | [3][7] |
| 1994 | *It's Not Luck*: proses berpikir untuk pemasaran dan strategi | [3][12] |
| 1997 | *Critical Chain*: TOC diterapkan pada manajemen proyek | [3] |
| 2000 | *Necessary But Not Sufficient*: TOC dan perangkat lunak perusahaan | [3] |
| 2004 | edisi ketiga *The Goal* yang direvisi | [7] |
| 2009 | *Isn't It Obvious?* (ritel dan distribusi) | [3] |
| 2010 | *Theory of Constraints Handbook* (disunting oleh Cox dan Schleier), referensi standar tentang DBR, S-DBR dan buffer management | [9] |
| 2011 | Goldratt meninggal; *The Goal* dicantumkan oleh Time di antara 25 buku manajemen bisnis paling berpengaruh (daftar Time sebagaimana dikutip Wikipedia) | [2][7] |
| 2014 | edisi keempat *The Goal* yang direvisi (peringatan 30 tahun) (daftar edisi dari infobox yang tidak dikutip) | [7] |

### The Goal: novel sebagai buku teks

*The Goal* mengisahkan Alex Rogo, seorang manajer pabrik yang punya waktu tiga bulan untuk membalikkan keadaan pabriknya. Mantan dosen fisikanya, Jonah, membimbingnya melalui pertanyaan, bukan jawaban [7]. Adegan yang paling sering dikutip adalah perjalanan pramuka: regu hanya bisa bergerak secepat anggota termuda yang paling lambat, yaitu Herbie, dan celah dalam barisan makin panjang ketika pejalan cepat menentukan kecepatan. Solusi Rogo adalah menempatkan Herbie di depan, meringankan ranselnya, dan mengikat kelompok menjadi satu. Itulah lima langkah pemfokusan dan drum-buffer-rope dalam satu sore: identifikasi Herbie, eksploitasi dia (ransel lebih ringan), subordinasikan regu pada langkahnya, dan jaga agar barisan tetap pendek.

Format novel membuat gagasan ini mudah dipahami oleh supervisor dan operator, tidak hanya oleh insinyur. North River Press melaporkan pada 2011 bahwa buku ini telah terjual lebih dari 5 juta eksemplar dalam 35 bahasa [2].

### Dari OPT menjadi filosofi manajemen

TOC berkembang secara bertahap. Tahap pertama adalah penjadwalan (OPT, lalu DBR). Tahap kedua adalah pengukuran (throughput accounting). Tahap ketiga adalah metode pemecahan masalah umum (thinking processes). Tahap keempat menerapkan logika ini pada proyek (critical chain) dan distribusi (replenishment) [6][12]. Saat ini Theory of Constraints International Certification Organization (TOCICO), sebuah organisasi nirlaba 501(c)(3) di AS, memberikan sertifikasi kepada praktisi dalam tiga tingkat: ujian dasar, ujian praktisi, dan penilaian implementer [5].

## Constraint vs. bottleneck: jenis-jenis kendala

Kata "constraint" dan "bottleneck" sering dipakai sebagai sinonim. Keduanya sebenarnya tidak sama.

- **Bottleneck** adalah sumber daya yang kapasitasnya lebih kecil daripada permintaan yang dibebankan kepadanya. Ini adalah istilah kapasitas.
- **Constraint** adalah apa pun yang membatasi kinerja sistem terhadap tujuannya. Bisa berupa bottleneck, tetapi juga bisa berupa pasar, material, kebijakan, atau cara berpikir.
- **Capacity constrained resource (CCR)** adalah sumber daya yang rata-rata bukan bottleneck tetapi akan menjadi bottleneck jika tidak dikelola dengan cermat, misalnya karena lonjakan pada bauran produk.

Setiap bottleneck hanya membatasi throughput jika berada pada jalur pesanan yang penting. Sebuah pabrik bisa memiliki mesin "bottleneck" yang kelebihan beban dengan pekerjaan berprioritas rendah, sementara kendala yang sebenarnya adalah pasar. Oleh karena itu, TOC terlebih dahulu bertanya: apa yang membatasi tujuan?

### Jenis-jenis kendala

| Jenis | Contoh | Cara mengenalinya | Langkah pertama yang umum |
|---|---|---|---|
| Fisik: peralatan | pusat permesinan 5-sumbu, tungku heat-treat, lini pengecatan | antrean permanen di depannya, sumber daya menganggur di belakangnya | exploit: tidak ada menit yang terbuang |
| Fisik: orang dan keterampilan | hanya dua juru las bersertifikat per shift | pekerjaan menunggu orang tertentu | cross-training, jadwalkan berdasarkan keterampilan |
| Material | coran dengan lead time 16 minggu | perakitan menunggu satu komponen | buffer pengisian ulang, sumber pasokan kedua |
| Pasar | permintaan di bawah kapasitas pabrik | kapasitas berlebih di mana-mana, penjualan di bawah rencana | kendalanya ada di luar; perbaiki penawaran dan lead time |
| Kebijakan | "jalankan hanya batch penuh", "jaga setiap mesin di atas efisiensi 85%" | aturan yang memaksa perilaku yang keliru | proses berpikir, ubah aturannya |
| Paradigma | "persediaan adalah aset", "pabrik yang sibuk adalah pabrik yang baik" | penolakan terhadap non-constraint yang menganggur | edukasi, permainan simulasi |

Dalam praktiknya, kendala kebijakan layak mendapat perhatian khusus: kendala fisik sering kali tertahan oleh aturan (batch minimum, aturan pelepasan, target utilisasi), bukan oleh kapasitas aslinya. Contoh kerja di Bagian 5 menunjukkan dua aturan seperti itu.

### Bottleneck statis, dinamis, dan berpindah

Bottleneck **statis** tetap berada pada sumber daya yang sama selama berbulan-bulan. Bottleneck **dinamis** atau **berpindah** bergerak di antara sumber daya seiring dengan bauran produk, kerusakan mesin, atau penugasan staf. Perbedaan ini penting untuk pemilihan metode: bottleneck statis dapat dijalankan dengan pengaturan DBR yang tetap, sedangkan bottleneck berpindah memerlukan data dan sering kali APS untuk menghitung beban per sumber daya untuk daftar pesanan saat ini [13][14]. Bagian 6 menunjukkan cara membedakan keduanya.

### VATI: jenis pabrik membentuk kendala

TOC mengklasifikasikan pabrik berdasarkan bentuk aliran material, yang dikenal sebagai analisis VATI [6][9]:

| Jenis | Bentuk aliran | Contoh | Masalah umum |
|---|---|---|---|
| V | sedikit bahan baku bercabang menjadi banyak produk | baja, kertas, bahan kimia, ekstrusi | salah alokasi: material dikomitmenkan ke produk yang keliru terlalu dini |
| A | banyak komponen menyatu menjadi sedikit produk | perakitan dirgantara, pembuatan mesin | komponen datang tidak sinkron, perakitan menunggu komponen terakhir |
| T | sedikit komponen, dirakit belakangan menjadi banyak varian | elektronik, peralatan rumah tangga | komponen tercuri antarvarian, ketidaksesuaian barang jadi |
| I | garis lurus | lini permesinan sederhana | perilaku bottleneck klasik |

Sebagian besar pabrik nyata merupakan kombinasi. Jenis pabrik menunjukkan di mana buffer harus diletakkan: sebelum perakitan pada pabrik tipe A, sebelum percabangan pada pabrik tipe V.

## Lima langkah pemusatan

Lima langkah pemusatan adalah inti prosedur TOC. TOC Institute merumuskannya sebagai berikut: identifikasi kendala sistem, eksploitasi kendala, subordinasikan segala sesuatu yang lain pada kendala, tinggikan kendala, dan cegah inersia menjadi kendala [4]. Goldratt menyebut siklus ini proses perbaikan berkelanjutan (POOGI), yang juga menjadi subjudul edisi-edisi berikutnya dari *The Goal* [6]. Karena langkah 5 kembali ke langkah 1, kelima langkah ini membentuk siklus perbaikan berkelanjutan: setelah satu kendala sistem dipecahkan, kendala baru muncul di tempat lain, dan pekerjaan dimulai lagi.

Sebelum langkah 1, dua pertanyaan perlu dijawab: apa tujuan sistem, dan bagaimana kita mengukur kemajuan menuju tujuan itu? Dalam bisnis, TOC menggunakan throughput, persediaan (atau investasi) dan beban operasi sebagai ukurannya (Bagian 11).

| Langkah | Pertanyaan | Artinya di pabrik | Bukan artinya |
|---|---|---|---|
| 1. Identifikasi | Apa yang membatasi throughput saat ini? | temukan sumber daya, material, pasar atau kebijakan yang menentukan laju | memilih mesin dengan kerusakan terbanyak atau harga termahal |
| 2. Eksploitasi | Bagaimana memaksimalkan hasil dengan apa yang kita miliki? | tidak ada menit yang hilang, tidak ada pekerjaan cacat, bauran produk yang tepat | membeli kapasitas |
| 3. Subordinasi | Bagaimana segala sesuatu yang lain mendukung langkah 2? | pelepasan, ukuran batch, pemeliharaan, kualitas dan staf mengikuti kendala | menjaga setiap sumber daya tetap sibuk |
| 4. Tinggikan | Jika masih belum cukup, bagaimana kita menambah kapasitas? | lembur, alih daya, mesin kedua, pemasok baru | refleks pertama |
| 5. Cegah inersia | Apakah kendala sudah bergeser? Apakah aturan lama kini menjadi kendala? | kembali ke langkah 1, tinjau aturan yang dibuat untuk kendala lama | menyatakan kemenangan |

### Langkah 1: Identifikasi kendala

Kendala adalah sumber daya yang kapasitasnya paling rendah relatif terhadap permintaan yang dibebankan padanya. Dalam praktiknya, mulailah dengan perhitungan beban (permintaan dikali waktu proses dibandingkan waktu tersedia), lalu konfirmasi di lantai produksi: di mana pekerjaan mengantre, di mana operator menunggu sumber daya, sumber daya mana yang selalu ditanyakan supervisor? TOC Institute menambahkan bahwa kendala yang salah diidentifikasi mudah diperbaiki tanpa kerusakan jangka panjang, dan ini alasan yang baik untuk tidak menunggu data yang sempurna [4]. Bagian 6 membahas enam metode deteksi.

### Langkah 2: Eksploitasi kendala

Eksploitasi berarti membuat kendala seproduktif mungkin tanpa mengeluarkan biaya besar. TOC Institute menyatakan bahwa kendala sering digunakan kurang dari 50 persen waktu pada basis 24/7, dan bahwa tiga langkah pertama biasanya mengungkap setidaknya 30 persen kapasitas tersembunyi dalam beberapa bulan; keduanya merupakan klaim tanpa kumpulan data yang dipublikasikan, jadi verifikasilah di pabrik Anda sendiri [4]. Tindakan eksploitasi yang umum:

- tutup waktu istirahat, pergantian shift dan rapat agar kendala terus berjalan;
- pindahkan persiapan setup ke luar waktu operasi kendala (setup eksternal, lihat panduan [SMED and changeover reduction](https://www.m365.fm/en/learn/smed-changeover-reduction/));
- inspeksi sebelum kendala agar kendala tidak pernah memproses part yang sudah menjadi scrap (di lingkungan AS9100 atau IATF 16949, memindahkan titik inspeksi berarti memperbarui control plan dan PFMEA);
- periksa kualitas langsung setelah kendala, karena part yang di-scrap kemudian menghabiskan waktu kendala;
- pertahankan buffer pekerjaan di depan kendala agar tidak pernah kekurangan pasokan;
- berikan prioritas untuk pemeliharaan, pemrograman, perkakas dan penanganan material;
- pilih bauran produk berdasarkan throughput per menit kendala (Bagian 11);
- alihkan pekerjaan yang dapat dilakukan sumber daya lain, meskipun kurang efisien.

### Langkah 3: Subordinasikan segala sesuatu yang lain

Subordinasi adalah langkah tersulit karena bertentangan dengan metrik efisiensi lokal. Non-kendala harus memiliki kapasitas cadangan, dan mereka harus menggunakannya untuk melindungi kendala, bukan untuk menumpuk persediaan. Contoh:

- **Pelepasan:** material masuk ke pabrik sesuai laju kendala (tali dalam DBR).
- **Ukuran batch:** non-kendala dapat menjalankan batch kecil dan lebih banyak setup karena memiliki kapasitas cadangan; kendala mungkin memerlukan batch yang lebih besar untuk menghemat waktu setup.
- **Pemeliharaan:** kerusakan di kendala mendapat teknisi berikutnya; pemeliharaan preventif di kendala dijadwalkan pada waktu henti yang direncanakan.
- **Kualitas:** persetujuan piece pertama di kendala lebih diprioritaskan daripada pemeriksaan piece pertama lainnya.
- **Pengukuran:** berhenti memberi penghargaan kepada departemen non-kendala atas utilisasi atau "jam yang diperoleh."

Institut TOC mencatat bahwa kendala yang sering berpindah mengganggu kebijakan, prosedur, dan orang [4]. Subordinasi karena itu harus mencakup perlindungan posisi kendala, misalnya dengan menjaga sumber daya lain jauh di atas kapasitas kendala.

### Langkah 4: Tingkatkan kendala

Hanya setelah langkah 2 dan 3 dijalankan, Anda boleh mengeluarkan uang untuk menambah kapasitas. Opsi peningkatan meliputi lembur atau shift tambahan khusus di kendala, mengalihdayakan sebagian pekerjaannya, menambah tenaga kerja, membeli peralatan, atau mendesain ulang produk agar membutuhkan waktu kendala lebih sedikit. Banyak pabrik langsung melompat ke langkah ini dan membeli mesin, padahal kendala yang ada masih kehilangan seperempat waktunya untuk istirahat, setup, dan kekurangan material.

### Langkah 5: Cegah inersia menjadi kendala

Ketika eksploitasi dan peningkatan berjalan, kendala sering berpindah dan muncul kendala baru: di mesin lain, di pemasok, atau di pasar. Aturan yang tepat untuk kendala lama kini menimbulkan kerugian. Contoh inersia yang umum: ukuran batch besar dari kendala lama tetap ada di routing, aturan pelepasan pekerjaan yang terikat pada drum lama tetap tersimpan di ERP, atau tim penjualan terus membatasi pesanan padahal pabrik sudah memiliki kapasitas cadangan. Kembali ke langkah 1 dan tinjau aturan-aturannya.

## Contoh teori kendala: lima langkah pemusatan di pabrik manifold

Contoh berikut disusun khusus untuk panduan ini. Angka-angkanya masuk akal untuk bengkel mesin kecil di AS, tetapi bukan data dari perusahaan nyata.

### Pabriknya

Sebuah pabrik dengan 60 karyawan di Midwest memproduksi blok manifold hidrolik dalam dua famili produk:

- **Produk A** (manifold standar): harga $900, bahan baku dan komponen beli $400.
- **Produk B** (manifold custom): harga $1.200, bahan baku dan komponen beli $450.

Pabrik beroperasi dengan dua shift 8 jam, lima hari seminggu: 80 jam atau 4.800 menit waktu tersedia per sumber daya per minggu. Permintaan mingguan adalah 100 unit A dan 60 unit B. Biaya operasi (semua tenaga kerja, gaji, sewa, energi, depresiasi; semua kecuali material yang benar-benar variabel) sebesar $62.000 per minggu.

### Langkah 1: Identifikasi kendala dengan tabel beban

Waktu proses dalam menit per unit, dari routing dan diverifikasi dengan pengukuran waktu di lantai produksi:

| Sumber daya | A (menit/unit) | B (menit/unit) | Beban A (100 unit) | Beban B (60 unit) | Total beban (menit) | Beban vs. 4.800 menit |
|---|---|---|---|---|---|---|
| Gergaji | 8 | 10 | 800 | 600 | 1.400 | 29% |
| Sel CNC 5-sumbu | 25 | 40 | 2.500 | 2.400 | 4.900 | **102%** |
| Deburr dan cuci | 12 | 12 | 1.200 | 720 | 1.920 | 40% |
| Perakitan | 15 | 20 | 1.500 | 1.200 | 2.700 | 56% |
| Uji tekanan | 10 | 15 | 1.000 | 900 | 1.900 | 40% |

**Perhitungan untuk sel CNC:** 100 × 25 + 60 × 40 = 2.500 + 2.400 = 4.900 menit dibandingkan 4.800 menit tersedia, beban 4.900 ÷ 4.800 = 102 persen. Bahkan di atas kertas, sel CNC tidak dapat memenuhi permintaan.

Tabel beban hanya menggunakan waktu teoretis. Gambaran nyatanya lebih buruk. Studi waktu selama dua minggu di sel CNC (log shift dan data status mesin) menunjukkan ke mana 4.800 menit itu pergi:

| Penggunaan waktu CNC per minggu | Menit | Porsi |
|---|---|---|
| Pemesinan produktif untuk part baik | 3.600 | 75,0% |
| Istirahat dan serah terima shift yang tidak tertutup (2 shift × 30 menit × 5 hari) | 300 | 6,3% |
| Pergantian produk (15 kali per minggu × 30 menit) | 450 | 9,4% |
| Kekurangan (starved): menunggu material, program, atau fixture | 250 | 5,2% |
| Downtime tak terjadwal | 100 | 2,1% |
| Part hasil pemesinan yang kemudian di-scrap di uji tekanan | 100 | 2,1% |
| **Total** | **4.800** | **100%** |

Jadi kapasitas efektif kendala adalah 3.600 menit per minggu, dibandingkan permintaan 4.900. Pabrik hanya dapat memenuhi sekitar 73 persen permintaan (3.600 ÷ 4.900).

Lantai produksi membenarkan angka-angka ini: rata-rata 2,5 hari kerja menunggu di depan sel CNC, sementara perakitan dan uji tekanan secara rutin menunggu part. Supervisor menunjuk perakitan sebagai kendala karena perakitan "selalu tertinggal," padahal perakitan tertinggal karena kekurangan part dari sel CNC.

### Langkah 2a: Eksploitasi melalui bauran produk

Dengan 3.600 menit efektif, pabrik tidak dapat memproduksi semuanya. Produk mana yang harus dibuat lebih dulu? Di sini akuntansi throughput dan akuntansi biaya standar memberikan jawaban yang berbeda (Bagian 11 menjelaskan logikanya secara rinci).

| | Produk A | Produk B |
|---|---|---|
| Harga | $900 | $1.200 |
| Biaya variabel sesungguhnya (material) | $400 | $450 |
| Throughput per unit (T) | $500 | $750 |
| Menit CNC per unit | 25 | 40 |
| **Throughput per menit CNC** | **$20,00** | **$18,75** |
| Margin biaya standar per unit (lihat Bagian 11) | $161,20 | $280,52 |

Produk B tampak lebih baik per unit, menurut kedua metode. Namun per menit kendala, A menghasilkan lebih banyak.

- **Bauran 1, B lebih dulu (yang disarankan laporan biaya):** 60 B menggunakan 2.400 menit; 1.200 menit sisanya menghasilkan 48 A. Throughput = 60 × $750 + 48 × $500 = $45.000 + $24.000 = **$69.000**. Laba bersih = $69.000 − $62.000 = **$7.000 per minggu**.
- **Bauran 2, A lebih dulu (throughput per menit kendala):** 100 A menggunakan 2.500 menit; 1.100 menit sisanya menghasilkan 27 B (27 × 40 = 1.080 menit). Throughput = 100 × $500 + 27 × $750 = $50.000 + $20.250 = **$70.250**. Laba bersih = $70.250 − $62.000 = **$8.250 per minggu**.

Bauran berbasis kendala menghasilkan $1.250 lebih banyak per minggu, sekitar $65.000 per tahun pada 52 minggu, tanpa investasi apa pun. Hal ini juga mengubah pembicaraan dengan tim penjualan: pelanggan B memerlukan waktu tunggu penawaran yang lebih panjang atau harga yang mencerminkan penggunaan kendala oleh B.

### Langkah 2b: Eksploitasi melalui waktu yang hilang

Tim kemudian menangani kerugian waktu dalam studi waktu:

| Ukuran | Biaya | Menit yang dipulihkan per minggu |
|---|---|---|
| Istirahat dibergantian; operator pengganti terlatih menjaga sel tetap berjalan | $1.500 per minggu (sebagian dari operator pengganti) | 300 |
| Persiapan setup eksternal: alat, fixture dan program disiapkan sebelum mesin berhenti; changeover dari 30 menjadi 18 menit | sekitar $6.000 sekali bayar untuk tool presetter dan troli | 180 (15 × 12 menit) |
| Material dan program disiapkan satu shift lebih awal (penyangga waktu, lihat Bagian 7) | tidak ada | 200 |
| Dimensi lubang kritis diperiksa tepat setelah pemesinan, bukan pada uji tekanan | gauge, sekitar $2.500 sekali bayar | 70 |
| Perawatan preventif dipindahkan ke jendela akhir pekan yang terjadwal | tidak ada | 50 |
| **Total** | | **800** |

Kapasitas efektif naik dari 3.600 menjadi 4.400 menit per minggu, peningkatan 22 persen (800 ÷ 3.600). Dengan Bauran 2, pabrik kini membuat 100 A (2.500 menit) dan 47 B (47 × 40 = 1.880 menit, total 4.380 menit).

Throughput = 100 × $500 + 47 × $750 = $50.000 + $35.250 = **$85.250 per minggu**. Beban operasional naik karena operator pengganti: $62.000 + $1.500 = $63.500. Laba bersih = $85.250 − $63.500 = **$21.750 per minggu**, naik dari $8.250. Pengeluaran sekali bayar sekitar $8.500 kembali dalam kurang dari seminggu.

Ini adalah pola TOC yang umum: karena beban operasional sebagian besar tetap dalam jangka pendek, setiap menit kendala tambahan hampir seluruhnya mengalir menjadi laba.

### Langkah 3: Subordinasi bagian pabrik lainnya

Untuk mempertahankan 800 menit tersebut, bagian lain pabrik harus berubah:

- Gergaji berhenti memotong "agar tetap sibuk." Kini hanya memotong sesuai kebutuhan jadwal CNC, dilepas satu shift lebih awal (tali).
- Sel CNC menjalankan urutan mingguan tetap yang mengelompokkan produk berdasarkan keluarga fixture; gergaji dan deburring mengikuti urutan tersebut.
- Perawatan menangani panggilan CNC lebih dulu; target respons adalah 10 menit.
- Laboratorium mutu melakukan pemeriksaan benda pertama CNC sebelum permintaan lain.
- Supervisor gergaji dan deburring tidak lagi diukur berdasarkan utilisasi. Ukuran mereka adalah "CNC tidak pernah menunggu kami."

Utilisasi di gergaji turun dari sekitar 45 persen (saat itu sedang membangun persediaan) menjadi 29 persen. Ini disengaja. Dalam istilah TOC, waktu menganggur gergaji adalah harga dari kendala yang dilindungi.

### Langkah 4: Tingkatkan kendala

Setelah eksploitasi, 13 unit B per minggu masih belum terpenuhi (60 − 47). Tiga opsi peningkatan:

| Opsi | Menit kendala tambahan | Throughput tambahan per minggu | Beban operasional tambahan per minggu | Efek bersih per minggu | Catatan |
|---|---|---|---|---|---|
| Shift Sabtu hanya di sel CNC (8 jam, diisi dengan sukarelawan atau aturan lembur dalam perjanjian kerja) | 480 | 12 B × $750 = $9.000 | $1.200 premi lembur dan dukungan | **+$7.800** | cepat, dapat dibalik |
| Alih daya pemesinan kasar B ke job shop, $180 per unit | 13 B tidak memerlukan 40 menit penuh | 13 × ($750 − $180) = $7.410 | koordinasi, sekitar $300 | **+$7.110** | T per unit turun menjadi $570 karena biaya job shop bersifat variabel sesungguhnya |
| Membeli mesin 5-axis kedua, $650.000 | 4.800 | 13 B × $750 = $9.750 (permintaan membatasi keuntungan) | $4.000 (operator, depresiasi, servis) | **+$5.750** | pengembalian modal sekitar $650.000 ÷ $5.750 = 113 minggu, kecuali permintaan tumbuh |

Shift Sabtu memenangkan persaingan. Mesin kedua hanya masuk akal jika penjualan mampu mengisinya, karena begitu terpasang, kendala bergeser ke pasar. Pemeriksaan keuangannya sederhana: apakah opsi ini menaikkan T minus OE, dan seberapa besar dibandingkan dengan investasinya? Bagian 11 menunjukkan rumusnya.

### Langkah 5: Cegah kelembaman

Dengan shift Sabtu, sel CNC memiliki 4.880 menit efektif, cukup untuk permintaan penuh sebesar 4.900 dikurangi beberapa menit, dan sekarang permintaan menjadi batasnya. Gambaran beban yang baru:

| Sumber daya | Beban pada permintaan penuh | Beban dibanding waktu tersedia |
|---|---|---|
| Sel CNC (dengan Sabtu) | 4.900 | sekitar 100% dari waktu efektif |
| Perakitan | 2.700 | 56% |
| Uji tekan | 1.900 | 40% |

Kendala hampir berpindah ke pasar. Dua jebakan kelembaman muncul dalam tinjauan:

1. ERP masih menyimpan ukuran batch minimum 40 untuk B, yang ditetapkan bertahun-tahun lalu untuk menghemat setup CNC. Dengan pergantian yang lebih cepat, aturan itu menghalangi waktu tunggu yang singkat. Batch dipangkas menjadi 10.
2. Penjualan masih menawarkan waktu tunggu enam minggu untuk B "karena pabrik selalu penuh." Waktu tunggu yang ditawarkan dipangkas menjadi tiga minggu, yang dalam satu kuartal memenangkan dua pelanggan B baru.

Kembali ke langkah 1: jika pelanggan B baru mendorong permintaan naik, sel CNC kembali menjadi kendala dan opsi mesin kedua memerlukan perhitungan baru. Siklus itu adalah proses perbaikan berkelanjutan.

### Pelajaran dari contoh

| Pelajaran | Bukti dalam contoh |
|---|---|
| Bottleneck yang terlihat mungkin bukan kendala | supervisor menyalahkan perakitan, padahal perakitan kekurangan pasokan |
| Pemanfaatan lebih baik daripada investasi | 800 menit dengan biaya $8.500 sekali plus $1.500 per minggu, versus $650.000 |
| Akuntansi biaya dapat salah meranking produk | B tampak lebih baik per unit, A menghasilkan lebih banyak per menit kendala |
| Non-kendala harus memiliki waktu menganggur | gergaji turun dari utilisasi 45% menjadi 29% |
| Aturan lama bertahan lebih lama dari kendala lama | batch 40 dan penawaran enam minggu |

## Analisis bottleneck: cara mengidentifikasi bottleneck (enam metode)

Analisis bottleneck adalah pekerjaan menemukan sumber daya yang membatasi throughput, mengukur seberapa besar output yang hilang karenanya, dan memeriksa apakah posisinya berpindah. Ini adalah langkah 1 dari lima langkah pemusatan, dan harus diulang setiap kali bauran produk, permintaan, atau jadwal produksi berubah.

Bottleneck tidak selalu mesin paling mahal, mesin dengan kerusakan terbanyak, atau departemen dengan supervisor paling lantang. Gunakan lebih dari satu metode dan periksa apakah hasilnya sejalan.

### Metode 1: Perhitungan beban kapasitas

Untuk setiap sumber daya, bandingkan waktu yang dibutuhkan permintaan dengan waktu yang tersedia.

**Rumus:** Beban (%) = Σ (permintaan per produk × waktu proses per unit, termasuk setup) ÷ waktu tersedia × 100

Sumber daya dengan beban tertinggi adalah kandidat bottleneck. Bagian 5 menunjukkan perhitungannya; sel CNC berada pada 102 persen berdasarkan waktu teoretis. Dua penyempurnaan membuat metode ini andal:

1. **Gunakan waktu efektif, bukan waktu nominal.** Bagi beban teoretis dengan porsi waktu ketika sumber daya benar-benar menghasilkan produk baik (ketersediaan × kualitas, atau porsi produktif yang diukur). Sumber daya dengan beban 85 persen di atas kertas dan porsi produktif 75 persen sebenarnya berada pada 113 persen (85 ÷ 0,75).
2. **Gunakan bauran produk nyata untuk periode yang direncanakan.** Sebuah sumber daya bisa menjadi bottleneck pada minggu yang didominasi B dan tidak pada minggu yang didominasi A.

Kekuatan: hanya membutuhkan routing, permintaan, dan kalender. Kelemahan: routing sering keliru, dan metode ini mengabaikan variabilitas serta bottleneck yang berpindah.

### Metode 2: Observasi antrean dan WIP

Pekerjaan menumpuk di depan bottleneck, dan sumber daya setelahnya menunggu. Hitung pekerjaan di depan setiap sumber daya (dalam jam kerja, bukan jumlah potong) pada waktu yang sama selama beberapa hari. Sumber daya dengan antrean besar dan terus-menerus, serta sumber daya hilir yang kekurangan pasokan, adalah kemungkinan bottleneck. Perhatian: antrean juga bisa muncul di depan sumber daya yang diumpan dalam batch besar atau yang menerapkan kebijakan membangun persediaan di depan.

### Metode 3: Jalan kaki bottleneck

Christoph Roser merekomendasikan bottleneck walk sebagai metode di lantai produksi ketika data status mesin tidak tersedia [15]. Berjalanlah melewati lini beberapa kali per shift dan catat untuk setiap proses apakah sedang bekerja, kekurangan pasokan (menunggu input), atau terblokir (tidak dapat meneruskan pekerjaan). Proses yang sebagian besar bekerja, dengan proses terblokir sebelumnya dan proses kekurangan pasokan sesudahnya, adalah bottleneck. Ulangi selama beberapa hari untuk melihat apakah posisinya berpindah.

| Jalan pada | Gergaji | Sel CNC | Penghilang geram | Perakitan | Pengujian |
|---|---|---|---|---|---|
| 07:30 | terblokir | bekerja | kekurangan | kekurangan | bekerja |
| 09:00 | bekerja | bekerja | bekerja | kekurangan | kekurangan |
| 10:30 | terblokir | bekerja | kekurangan | bekerja | kekurangan |
| 13:00 | terblokir | mati (perkakas) | kekurangan | kekurangan | kekurangan |
| Pola | sering terblokir | selalu bekerja | sering kekurangan | sering kekurangan | sering kekurangan |

### Metode 4: Utilisasi (persen aktif)

Data mesin dari MES, platform IIoT, atau kontrol mesin menunjukkan porsi waktu setiap sumber daya aktif. Sumber daya dengan porsi waktu aktif tertinggi adalah kandidat hambatan. Roser, Nakano, dan Tanaka menyebut ini metode beban kerja dan menggunakannya sebagai pembanding dalam makalah mereka tahun 2001 [13]. Metode ini mudah diotomatisasi, tetapi tidak mampu melihat urutan sumber daya saling menghentikan: dua sumber daya pada 85 persen tampak sama meskipun salah satunya menghentikan yang lain.

### Metode 5: Metode periode aktif

Metode periode aktif dipublikasikan oleh Roser, Nakano, dan Tanaka pada Winter Simulation Conference 2001 dan diperluas ke hambatan yang berpindah pada 2002 [13][14]. Metode ini memerlukan log status berstempel waktu untuk setiap sumber daya.

- **Status aktif** adalah status ketika sumber daya dapat membuat yang lain menunggu: pemrosesan, tetapi juga pergantian perkakas (changeover), kerusakan, perbaikan, dan pemeliharaan [14][15].
- **Status tidak aktif** adalah status ketika sumber daya menunggu yang lain: kekurangan (menunggu material atau transportasi) dan terblokir [14][15].
- **Periode aktif** adalah rangkaian status aktif yang tidak terputus [13].
- Pada setiap saat, **sumber daya dengan periode aktif tidak terputus terpanjang adalah hambatan sesaat** [14].
- Bila periode aktif hambatan saat ini tumpang tindih dengan periode hambatan sebelumnya atau berikutnya, hambatan **berpindah** di antara keduanya; di luar tumpang tindih, sumber daya tersebut adalah hambatan **tunggal** [14].

**Contoh kerja (dua jam dari log shift ilustratif):**

| Sumber daya | Periode aktif | Periode tidak aktif |
|---|---|---|
| Gergaji | 08:00–08:20, 08:35–08:55, 09:10–09:30, 09:45–10:00 | terblokir di antara periode tersebut |
| Sel CNC | 08:00–09:05 (65 menit), 09:15–10:00 (45 menit) | 09:05–09:15 kekurangan |
| Perakitan | 08:00–08:10, 08:30–09:10 (40 menit), 09:40–10:00 | kekurangan 08:10–08:30 dan 09:10–09:40 |

Langkah demi langkah:

1. 08:00–09:05: periode aktif 65 menit milik sel CNC adalah periode berjalan terpanjang, sehingga sel CNC adalah hambatan sesaat.
2. 09:05–09:10: sel CNC kekurangan. Periode aktif terpanjang pada saat ini adalah milik perakitan (08:30–09:10). Perakitan adalah hambatannya.
3. 09:10–09:15: hanya gergaji yang aktif (09:10–09:30). Gergaji adalah hambatannya.
4. 09:15–10:00: periode kedua sel CNC (45 menit) adalah yang terpanjang. Sel CNC adalah hambatannya.
5. Tumpang tindih: periode CNC 08:00–09:05 tumpang tindih dengan periode perakitan 08:30–09:10 selama 35 menit (08:30–09:05), sehingga hambatan berpindah antara CNC dan perakitan di sana. Periode gergaji 09:10–09:30 tumpang tindih dengan periode CNC 09:15–10:00 selama 15 menit, yaitu perpindahan antara gergaji dan CNC.

| Sumber daya | Hambatan tunggal | Hambatan berpindah | Jumlah | Porsi dari 120 menit (tunggal / jumlah) |
|---|---|---|---|---|
| Sel CNC | 08:00–08:30 dan 09:30–10:00 = 60 menit | 35 + 15 = 50 menit | 110 menit | 50% / 92% |
| Perakitan | 09:05–09:10 = 5 menit | 35 menit | 40 menit | 4% / 33% |
| Gergaji | 09:10–09:15 = 5 menit | 15 menit | 20 menit | 4% / 17% |

Roser menafsirkan porsi tunggal sebagai batas bawah dan jumlah sebagai batas atas untuk dampak perbaikan: jika sel CNC menjadi hambatan tunggal 50 persen dan hambatan tunggal atau berpindah 92 persen waktu, peningkatan satu menit di sel CNC seharusnya meningkatkan output sistem sekitar 0,5 hingga 0,9 menit [15]. Dua jam data hanya cukup untuk menunjukkan mekanismenya; analisis nyata menggunakan log selama berminggu-minggu.

Bandingkan dengan Metode 4: sel CNC aktif 110 dari 120 menit (92 persen), gergaji 80 (67 persen), dan perakitan 70 (58 persen). Utilisasi menunjuk ke sumber daya yang sama di sini, tetapi akan menempatkan gergaji di atas perakitan padahal perakitan lebih sering menjadi bagian dari hambatan berpindah.

**Asal data:** status mesin dari MES, gateway IIoT yang membaca kontroler, atau log peristiwa dari simulasi peristiwa diskret. Roser mencatat bahwa metode ini paling mudah diterapkan dengan simulasi atau sistem yang sangat otomatis, dan merekomendasikan jalan hambatan bila data tersebut tidak tersedia [15]. Panduan [MES dan ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) menjelaskan bagaimana pabrik mengumpulkan status peralatan.

### Metode 6: Simulasi dan uji sensitivitas

Model simulasi kejadian diskrit untuk lini produksi memungkinkan Anda menguji pertanyaan ini secara langsung: jika setiap sumber daya secara bergantian mendapat kapasitas 10 persen lebih besar, perubahan mana yang meningkatkan output? Sumber daya yang peningkatannya paling besar menaikkan output adalah kendala untuk bauran produk tersebut. Simulasi juga memperlihatkan pergeseran bottleneck akibat variabilitas, yang tidak terlihat dalam tabel beban statis. Panduan [simulasi manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) menjelaskan cara membangun model seperti itu.

### Penyebab umum bottleneck

Analisis bottleneck sebaiknya berakhir dengan penyebab, bukan hanya lokasi. Penyebab yang biasa ditemui di pabrik:

- kapasitas di bawah permintaan untuk bauran produk saat ini (kendala kapasitas yang sebenarnya)
- downtime yang tidak direncanakan dan perbaikan yang lambat pada sumber daya kritis
- changeover yang panjang dikombinasikan dengan aturan batch yang besar
- keterampilan atau staf yang kurang: hanya sedikit orang yang bisa menjalankan atau menyiapkan sumber daya tersebut
- kehilangan kualitas: scrap dan rework yang memakan waktu kendala dua kali
- starvation: material, perkakas, program, atau pekerjaan hulu yang datang terlambat
- kebijakan, seperti target utilisasi yang membuat non-kendala tetap sibuk sementara pekerjaan menumpuk di tempat yang salah

Penyebabnya menentukan perbaikannya. Lima penyebab pertama membutuhkan eksploitasi terlebih dahulu (Bagian 4, langkah 2) dan elevasi hanya jika itu belum cukup; starvation membutuhkan subordinasi (langkah 3); kebijakan membutuhkan perubahan aturan, sering kali dengan proses berpikir (Bagian 12).

### Metode mana yang digunakan kapan?

| Metode | Data yang dibutuhkan | Menemukan bottleneck yang berpindah | Upaya | Penggunaan terbaik |
|---|---|---|---|---|
| Beban kapasitas | routing, permintaan, kalender | tidak | rendah | pemeriksaan awal, perencanaan, penawaran |
| Observasi antrean | hitungan di lantai produksi | sebagian | rendah | konfirmasi |
| Penelusuran bottleneck | penelusuran berulang | sebagian | rendah hingga sedang | pabrik tanpa data mesin |
| Utilisasi | status mesin | tidak | rendah setelah aliran data berjalan | dasbor |
| Periode aktif | status ber-stempel waktu | ya | sedang | lini otomatis, data MES, simulasi |
| Simulasi | model plus data | ya | sedang hingga tinggi | bauran tinggi, keputusan investasi |

### Enam pertanyaan yang mengungkap bottleneck palsu

1. Apakah sumber daya tersebut benar-benar beroperasi sepanjang waktu yang tersedia, atau sering mengalami starvation?
2. Apakah antrean di depannya bersifat permanen atau hanya batch yang datang?
3. Apakah sumber daya di hilir menunggu karena dia, atau karena hal lain?
4. Jika besok ia mendapat kapasitas 10 persen lebih besar, apakah pengiriman akan naik?
5. Apakah "bottleneck" tersebut sibuk dengan pekerjaan yang saat ini tidak dibutuhkan?
6. Apakah batas yang sebenarnya berupa aturan, seperti ukuran batch minimum atau pola shift tetap?

## Penjadwalan drum-buffer-rope dengan angka

Drum-buffer-rope (DBR) adalah metode TOC untuk penjadwalan dan pengendalian produksi. Goldratt dan Robert E. Fox menjelaskannya dalam *The Race* (1986), dengan membangun di atas metafora regu pramuka dalam *The Goal* [3][8]. *Theory of Constraints Handbook* menjelaskan bentuk terkini, termasuk manajemen buffer dan klasifikasi aliran VATI [9].

- **Drum:** jadwal kendala. Ini adalah satu-satunya jadwal rinci di pabrik yang wajib dijaga.
- **Buffer:** buffer waktu yang melindungi throughput pabrik dari variabilitas. DBR tradisional menggunakan buffer di kendala, di titik perakitan tempat part kendala bertemu part non-kendala, dan di pengiriman [6].
- **Rope:** mekanisme pelepasan. Material masuk ke pabrik satu buffer waktu sebelum dibutuhkan di kendala; melepaskannya lebih awal hanya menaikkan WIP [6].

Buffer dalam DBR diukur dalam **waktu**, bukan dalam jumlah pieces [6]. Buffer kendala 16 jam berarti material dilepaskan 16 jam kerja sebelum jadwal mulainya di kendala.

### Langkah 1: Susun jadwal drum

Kembali ke pabrik manifold, sel CNC adalah drum. Jadwalnya untuk hari Rabu (shift 1: 06:00–14:00, shift 2: 14:00–22:00), dengan changeover 18 menit dari Bagian 5:

| Urutan | Produk dan jumlah | Setup + run (menit) | Mulai CNC | Selesai CNC |
|---|---|---|---|---|
| 1041 | A × 10 | 18 + 250 = 268 | Rab 06:00 | Rab 10:28 |
| 1042 | B × 5 | 18 + 200 = 218 | Rab 10:28 | Rab 14:06 |
| 1043 | A × 10 | 268 | Rab 14:06 | Rab 18:34 |
| 1044 | B × 4 | 18 + 160 = 178 | Rab 18:34 | Rab 21:32 |

Urutannya mengikuti keputusan bauran produk dari Bagian 5 dan permintaan mingguan, dengan batch yang cukup kecil untuk menjaga lead time tetap pendek. Sisa 28 menit di akhir shift digunakan untuk pemeriksaan tool yang terjadwal.

### Langkah 2: Tetapkan buffer

- **Buffer kendala:** 16 jam kerja (dua shift). Gergaji dan penanganan material membutuhkan kurang dari satu jam waktu sentuh per order; sisanya melindungi dari masalah gergaji, material yang hilang, dan program.
- **Buffer pengiriman:** 16 jam kerja setelah sel CNC. Deburring, perakitan, dan pengujian membutuhkan sekitar satu jam waktu sentuh per order.
- **Area buffer fisik:** area lantai yang diberi tanda di depan sel CNC, berukuran sekitar satu hari kerja, dengan lajur FIFO per keluarga fixture. Jika area meluap, pelepasan mendahului rope; jika kosong, sel CNC berisiko berhenti.

Seberapa besar buffer di awal? Gray, Felan, Umble, dan Umble mencatat bahwa aturan praktis memang ada, tetapi menurut pengalaman mereka, ukuran buffer biasanya ditetapkan untuk mencapai sistem yang stabil lalu disesuaikan [24]; manajemen buffer (Bagian 9) yang melakukan penyesuaian. Nilai awal yang sering disebut dalam praktik TOC adalah sekitar setengah dari lead time saat ini untuk segmen tersebut [unverified: sumber nilai ini belum dapat dipastikan]. Dalam contoh, pekerjaan dulu menunggu 2,5 hari di depan sel CNC; tim memulai dengan satu hari dan berencana menyesuaikannya.

### Langkah 3: Pasang rope

Waktu pelepasan = mulai kendala yang dijadwalkan − buffer kendala.

| Urutan | Mulai CNC | Buffer kendala | Lepas ke gergaji | Tanggal kirim (selesai CNC + buffer pengiriman) |
|---|---|---|---|---|
| 1041 | Rab 06:00 | 16 jam | Sel 06:00 | Kam 10:28 |
| 1042 | Rab 10:28 | 16 jam | Sel 10:28 | Kam 14:06 |
| 1043 | Rab 14:06 | 16 jam | Sel 14:06 | Kam 18:34 |
| 1044 | Rab 18:34 | 16 jam | Sel 18:34 | Kam 21:32 |

Tidak ada material yang dilepaskan sebelum waktu pelepasannya, meskipun gergaji sedang menganggur. Inilah yang menjaga WIP dan lead time tetap rendah.

### Langkah 4: Jalankan pabrik sesuai status buffer

Non-kendala tidak mendapat jadwal rinci. Mereka bekerja sesuai urutan status buffer (Bagian 9): order dengan buffer yang paling banyak terpakai didahulukan. Sel CNC mengikuti urutannya sendiri.

### DBR vs. push MRP: apa yang berubah

| Topik | Push MRP | DBR |
|---|---|---|
| Pelepasan | lead time terencana per operasi, sering diperbesar | jadwal kendala dikurangi buffer |
| Jadwal rinci | untuk setiap work center | hanya untuk kendala |
| WIP | tumbuh ketika lead time diperbesar | dibatasi oleh rope |
| Prioritas di lantai produksi | daftar prioritas, expediting | warna status buffer |
| Respons terhadap variabilitas | lebih banyak lead time, lebih banyak WIP | buffer di beberapa titik, ditetapkan dan disesuaikan |

Panduan [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) menjelaskan bagaimana DBR cocok dengan penjadwalan finite capacity dan kapan APS memberikan nilai tambah.

### DBR di pabrik perakitan (tipe A)

Di pabrik tipe A, bagian constraint bertemu dengan bagian non-constraint di proses perakitan. DBR tradisional menambahkan **buffer perakitan**: bagian non-constraint dilepas sedemikian rupa sehingga menunggu di perakitan sebelum bagian constraint tiba, sehingga output constraint tidak pernah menunggu braket yang belum lengkap [6][9]. Di industri dirgantara dan permesinan, di mana perakitan membutuhkan ratusan bagian, di sinilah DBR sering memberikan manfaat terbesar; panduan [perencanaan produksi dirgantara](https://www.m365.fm/en/learn/aerospace-production-planning/) membahas lingkungan tersebut.

## Simplified drum-buffer-rope (S-DBR) untuk make-to-order

Simplified DBR (S-DBR) dikembangkan untuk pabrik make-to-order di mana pasar biasanya menjadi constraint, bukan sumber daya internal, atau di mana constraint internal tidak terbebani berat. Metode ini hanya menggunakan satu buffer, yaitu **buffer pengiriman**, dan menggantikan jadwal drum yang terperinci dengan pemeriksaan **beban terencana** pada sumber daya pembatas kapasitas (CCR) [6][9].

### Cara kerja S-DBR

1. **Buffer pengiriman:** setiap pesanan dilepas sejumlah waktu buffer tetap sebelum tanggal jatuh temponya.
2. **Beban terencana:** pabrik mencatat total berjalan dari pekerjaan yang sudah dijadwalkan pada CCR, dinyatakan dalam hari.
3. **Penentuan tanggal jatuh tempo:** pesanan baru mendapat tanggal jatuh tempo yang tidak lebih awal dari tanggal ketika CCR dapat memprosesnya ditambah sebagian buffer pengiriman untuk pekerjaan setelah CCR. Konvensi yang umum adalah tanggal beban terencana ditambah setengah buffer pengiriman [unverified: sumber konvensi ini belum dikonfirmasi].
4. **Manajemen buffer** menetapkan prioritas di lantai produksi berdasarkan proporsi buffer pengiriman yang sudah terpakai.

### Contoh kerja: menentukan tanggal jatuh tempo dengan S-DBR

Anggaplah pabrik manifold telah beralih ke make-to-order dan pasar menjadi constraint pada sebagian besar minggu. Sel CNC diperlakukan sebagai CCR dengan 4.400 menit efektif per minggu, atau 880 menit per hari kerja.

- Pesanan yang sudah dijadwalkan pada sel CNC: 3.520 menit. Beban terencana = 3.520 ÷ 880 = **4,0 hari kerja**.
- Buffer pengiriman: **6 hari kerja** (total lead time saat ini 12 hari; tim memulai dengan setengahnya).
- Pesanan baru: 10 unit B, 40 menit masing-masing = 400 menit = 0,45 hari pada sel CNC.

Tanggal jatuh tempo yang aman = hari ini + beban terencana + waktu CNC pesanan baru + setengah buffer pengiriman = 0 + 4,0 + 0,45 + 3,0 = **7,45, jadi 8 hari kerja**. Tanggal rilis = tanggal jatuh tempo − buffer pengiriman = hari ke-8 − 6 = **hari ke-2**.

Jika tim penjualan ingin menjanjikan 5 hari, pemeriksaan menunjukkan pesanan tersebut akan menyerobot antrean di sel CNC dan membuat pesanan lain terlambat. Pembicaraan itu terjadi saat pesanan dicatat, bukan di lantai produksi dua minggu kemudian.

### DBR atau S-DBR?

| Kriteria | DBR tradisional | S-DBR |
|---|---|---|
| Constraint | internal dan terbebani berat | pasar, atau internal tetapi terbebani sedang |
| Buffer | constraint, perakitan, pengiriman | hanya pengiriman |
| Jadwal constraint | urutan terperinci | pemeriksaan beban terencana |
| Upaya | lebih tinggi | lebih rendah |
| Kecocokan umum | bottleneck yang stabil, pabrik tipe A atau I | toko kerja make-to-order, bauran tinggi |

## Manajemen buffer: loop umpan balik

Manajemen buffer adalah loop kontrol dan perbaikan dari DBR dan S-DBR [9]. Untuk setiap pesanan yang masih terbuka, pabrik melacak seberapa banyak buffernya sudah terpakai dan memberinya warna sesuai kondisi. Ringkasan Wikipedia tentang TOC menjelaskan pengkodean merah, kuning dan hijau berdasarkan penetrasi buffer [6].

**Rumus (untuk pesanan yang belum mencapai titik terlindungi):**
Penetrasi buffer (%) = (1 − sisa waktu hingga kedatangan terjadwal di titik terlindungi ÷ ukuran buffer) × 100

| Zona | Penetrasi buffer | Arti | Respons |
|---|---|---|---|
| Hijau | 0 hingga 33% | sesuai rencana | tidak ada |
| Kuning | 33 hingga 67% | mulai ketat | periksa posisi pesanan, siapkan tindakan |
| Merah | 67 hingga 100% | titik terlindungi mungkin menunggu | percepat: pindahkan pesanan ke depan, perbaiki penyebabnya |
| Hitam (beberapa pabrik) | di atas 100% | sudah terlambat | eskalasi, beri tahu pelanggan jika ini buffer pengiriman |

Pembagian menjadi tiga bagian adalah konvensi, bukan hukum alam.

### Contoh kerja: status buffer pada Rabu pukul 06:00

Buffer kendala: 16 jam kerja. Pada awal shift, tidak satu pun dari empat pesanan telah mencapai sel CNC.

| Pesanan | Mulai CNC terjadwal | Sisa jam kerja | Penetrasi | Zona | Tindakan |
|---|---|---|---|---|---|
| 1041 | Rab 06:00 | 0 | 100% | merah/hitam | CNC akan menunggu; cari pesanan ini sekarang |
| 1042 | Rab 10:28 | 4,5 | 1 − 4,5 ÷ 16 = 72% | merah | percepat di gergaji |
| 1043 | Rab 14:06 | 8,1 | 1 − 8,1 ÷ 16 = 49% | kuning | periksa status |
| 1044 | Rab 18:34 | 12,6 | 1 − 12,6 ÷ 16 = 21% | hijau | tidak ada |

Pada hari yang berjalan normal, pesanan yang jatuh tempo dalam beberapa jam ke depan sudah berada di buffer di depan sel CNC. Jika pesanan 1041 tidak ada di sana pada pukul 06:00, sel CNC akan segera kehilangan waktu.

### Menggunakan data buffer untuk perbaikan

Catat alasan setiap kali sebuah pesanan berubah menjadi merah: material kurang, gergaji rusak, program belum dirilis, penahanan kualitas. Setelah beberapa minggu, diagram Pareto penyebab menjadi daftar perbaikan untuk proses non-kendala. Dua aturan praktis untuk menentukan ukuran:

- Jika banyak pesanan berwarna merah, buffer terlalu kecil atau proses hulu terlalu tidak stabil. Perbaiki penyebab utama terlebih dahulu, lalu pertimbangkan buffer yang lebih besar.
- Jika hampir semua pesanan tetap hijau, buffer terlalu besar. Kurangi secara bertahap; WIP dan lead time akan ikut turun.

Untuk buffer stok di distribusi, aturan manajemen buffer dinamis yang diringkas di Wikipedia adalah mengurangi buffer sebesar sepertiga jika stok tetap berada di sepertiga teratas selama satu waktu pengisian ulang penuh, dan menambahkannya sebesar sepertiga jika stok terlalu lama berada di sepertiga terbawah [6].

## Fisika pabrik di balik TOC: Hukum Little dan variabilitas

TOC kadang diajarkan sebagai filosofi. Aturan penjadwalannya juga berasal dari teori antrean.

### Hukum Little

John D. C. Little membuktikan pada 1961 bahwa, dalam sistem yang stabil, jumlah rata-rata item dalam sistem sama dengan laju kedatangan dikali waktu rata-rata item berada dalam sistem [16]. Dalam istilah pabrik (Hopp dan Spearman) [17]:

**WIP = throughput × cycle time**, atau **cycle time = WIP ÷ throughput**

**Contoh perhitungan (pabrik manifold, sebelum dan sesudah DBR):**

| | Sebelum (push) | Sesudah (DBR) |
|---|---|---|
| WIP antara gergaji dan pengiriman | 640 unit | 90 unit |
| Throughput | 127 unit per minggu | 147 unit per minggu |
| Cycle time = WIP ÷ throughput | 640 ÷ 127 = 5,0 minggu | 90 ÷ 147 = 0,61 minggu, sekitar 3 hari kerja |

WIP turun karena rope menghentikan pelepasan material lebih awal; throughput naik karena kendala dimanfaatkan secara maksimal. Lead time turun lebih dari 80 persen. Hukum Little juga memperingatkan batasnya: jika WIP di depan kendala turun sedemikian rupa sehingga kekurangan material, throughput ikut turun. Itulah sebabnya DBR hanya mempertahankan buffer di kendala, dan tidak di tempat lain.

### Variabilitas dan utilisasi

Pendekatan Kingman untuk satu stasiun kerja menunjukkan mengapa non-kendala membutuhkan kapasitas cadangan [17][18]:

**Waktu tunggu ≈ ((ca² + ce²) ÷ 2) × (u ÷ (1 − u)) × te**

di mana ca dan ce adalah koefisien variasi kedatangan dan waktu proses, u adalah utilisasi dan te adalah waktu proses rata-rata. Ini adalah pendekatan untuk satu stasiun kerja dengan distribusi kedatangan dan waktu proses yang umum (G/G/1), dan paling akurat pada utilisasi tinggi [17][18].

| Utilisasi u | u ÷ (1 − u) | Waktu tunggu dengan ca = ce = 1, te = 40 menit |
|---|---|---|
| 70% | 2,3 | 93 menit |
| 85% | 5,7 | 227 menit |
| 95% | 19,0 | 760 menit |

Dari utilisasi 85 hingga 95 persen, waktu tunggu lebih dari tiga kali lipat. Pabrik yang mendorong setiap sumber daya hingga 95 persen menciptakan antrean panjang di mana-mana. Jawaban TOC adalah menjalankan kendala pada utilisasi yang sangat tinggi, dilindungi oleh buffer yang sengaja disediakan, dan menjaga non-kendala jauh di bawah tingkat tersebut.

## Akuntansi throughput vs. akuntansi biaya

Akuntansi throughput adalah sistem pengukuran TOC. Goldratt memaparkan ketiga ukurannya dalam *The Goal* dan *The Haystack Syndrome* [20]; *Throughput Accounting* karya Thomas Corbett (North River Press) adalah pembahasan lengkap dalam bentuk buku yang menjadi acuan standar [21].

### Tiga ukuran

| Ukuran | Definisi (Goldratt, sebagaimana diringkas oleh MAAW) [20] | Definisi praktis di pabrik |
|---|---|---|
| Throughput (T) | laju sistem menghasilkan uang melalui penjualan | penjualan dikurangi biaya yang sepenuhnya variabel, biasanya bahan baku, komponen beli, komisi dan proses luar per unit [6][22] |
| Inventory (I), kemudian sering disebut "investment" | uang yang diinvestasikan sistem untuk membeli barang yang akan dijual | bahan baku, WIP dan barang jadi dinilai pada biaya material, ditambah, dalam definisi yang lebih luas, peralatan dan bangunan [22] |
| Operating expense (OE) | semua uang yang dibelanjakan sistem untuk mengubah inventory menjadi throughput | upah dan gaji (termasuk tenaga kerja langsung), sewa, energi, pemeliharaan, depresiasi |

Tenaga kerja langsung termasuk OE, bukan T. Di situlah perbedaan utama dengan standard costing: di sebagian besar pabrik, biaya tenaga kerja tidak naik atau turun mengikuti setiap unit tambahan dalam jangka pendek.

### Ukuran turunan

| Ukuran | Rumus | Pabrik manifold setelah eksploitasi (mingguan) |
|---|---|---|
| Net profit (NP) | T − OE | $85.250 − $63.500 = $21.750 |
| Return on investment (ROI) | (T − OE) ÷ I | dengan I = $1,2 juta: $21.750 × 52 ÷ $1.200.000 = 94% per tahun |
| Productivity | T ÷ OE | $85.250 ÷ $63.500 = 1,34 |
| Investment turns | T ÷ I | $85.250 × 52 ÷ $1.200.000 = 3,7 per tahun |

Ringkasan Lean Production mencantumkan ukuran turunan yang sama dan prioritas keputusan TOC: tingkatkan throughput terlebih dahulu, kemudian kurangi investasi, lalu kurangi operating expense [22]. Angka investasi $1,2 juta merupakan asumsi untuk contoh ini.

### Aturan keputusan: throughput per unit kendala

Ketika ada kendala, produk harus diurutkan berdasarkan throughput per unit waktu kendala, bukan berdasarkan margin per unit. Dalam buku teks akuntansi, ini dikenal sebagai "kontribusi per unit faktor pembatas"; tim penguji ACCA menjelaskan versi throughput dengan return per jam pabrik dan throughput accounting ratio (TPAR) [19]:

- **Pengembalian per jam pabrik** = throughput per unit ÷ jam per unit pada bottleneck
- **Biaya per jam pabrik** = total biaya pabrik ÷ total jam yang tersedia pada bottleneck
- **TPAR** = pengembalian per jam pabrik ÷ biaya per jam pabrik; nilainya normalnya harus lebih besar dari 1 [19].

### Contoh kerja: biaya standar vs. akuntansi throughput

Biaya standar di pabrik manifold mengalokasikan biaya operasi ke produk berdasarkan menit tenaga kerja standar. Menit standar yang dianggarkan pada tingkat permintaan: A 70 menit per unit (8 + 25 + 12 + 15 + 10) × 100 unit = 7.000; B 97 menit (10 + 40 + 12 + 20 + 15) × 60 unit = 5.820; total 12.820 menit. Tarif beban = $62.000 ÷ 12.820 = **$4,84 per menit standar**.

| | Produk A | Produk B |
|---|---|---|
| Harga | $900,00 | $1.200,00 |
| Material | $400,00 | $450,00 |
| Tenaga kerja dan overhead (70 × $4,84; 97 × $4,84) | $338,80 | $469,48 |
| **Margin standar per unit** | **$161,20** | **$280,52** |
| Margin standar % | 17,9% | 23,4% |
| Throughput per unit | $500 | $750 |
| Jam CNC per unit | 0,417 | 0,667 |
| **Pengembalian per jam CNC** | **$1.200** | **$1.125** |

Biaya per jam pabrik, menggunakan biaya operasi setelah eksploitasi: $63.500 ÷ (4.400 ÷ 60 = 73,3 jam CNC) = **$865,91**. TPAR A = 1.200 ÷ 865,91 = **1,39**; TPAR B = 1.125 ÷ 865,91 = **1,30**. Kedua produk menghasilkan uang, tetapi A menghasilkan lebih banyak per jam kendala.

Biaya standar menyatakan "dorong B": B memiliki margin per unit dan persentase yang lebih tinggi. Akuntansi throughput menyatakan "isi kendala dengan A terlebih dahulu." Bagian 5 menunjukkan hasilnya: laba bersih $1.250 lebih tinggi per minggu dengan peringkat throughput. Biaya standar bukan salah secara aritmetika. Ia menjawab pertanyaan yang berbeda (rata-rata biaya penuh per unit selama satu periode), dan pertanyaan itu bukan yang dibutuhkan keputusan bauran produk di bawah kendala.

### Contoh kerja: pesanan yang hanya memakai kapasitas sisa

Seorang pelanggan meminta 40 pelat adaptor per minggu dengan harga $260 per unit. Material $150. Pelat memerlukan gergaji (15 menit), deburring (10 menit) dan perakitan (25 menit), tetapi **tidak memerlukan waktu CNC**. Total: 50 menit standar.

| | Tampilan biaya standar | Tampilan throughput |
|---|---|---|
| Material | $150,00 | $150,00 |
| Tenaga kerja dan overhead (50 × $4,84) | $242,00 | tidak per unit: biaya operasi tidak berubah, sumber daya memiliki kapasitas sisa |
| Margin per unit | $260 − $392 = **−$132** | T = $260 − $150 = **+$110** |
| Keputusan | tolak | terima |
| Dampak pada laba bersih mingguan (40 pelat) | | +$4.400, selama gergaji, deburring dan perakitan tetap di bawah kapasitasnya |

Periksa beban: gergaji +600 menit (menjadi 2.000, 42 persen), deburring +400 (menjadi 2.320, 48 persen), perakitan +1.000 (menjadi 3.700, 77 persen). Perakitan semakin mendekati menjadi kendala, sehingga pesanan sebaiknya diterima dengan batas volume dan dipantau. Dengan biaya standar, pabrik akan menolak $4.400 per minggu.

### Persediaan dan laba yang dilaporkan

Di bawah absorption costing, overhead dibebankan ke persediaan. Jika pabrik manifold membuat 50 unit tambahan A untuk stok, 50 × $338,80 = **$16.940** dari overhead periode tersebut berpindah ke neraca, bukan ke laporan laba rugi, dan laba yang dilaporkan naik sebesar jumlah tersebut. Kas berkurang sebesar material yang dibeli, 50 × $400 = $20.000. Di bawah akuntansi throughput, laba bersih tidak berubah dan persediaan naik $20.000. Inilah sebabnya praktisi TOC memperingatkan bahwa membangun persediaan dapat membuat pabrik tampak lebih baik di atas kertas sementara kondisi kas dan waktu tunggunya memburuk.

Pelaporan keuangan eksternal di AS mengharuskan biaya overhead produksi dimasukkan ke dalam biaya persediaan (absorption costing): berdasarkan ASC 330, biaya persediaan adalah jumlah pengeluaran dan beban yang secara langsung atau tidak langsung ditanggung untuk membawa suatu barang ke kondisi dan lokasinya saat ini, dan overhead produksi tetap dialokasikan ke persediaan berdasarkan kapasitas normal fasilitas produksi [28][29]. Pengendali keuangan Anda yang menentukan bagaimana pabrik menerapkannya. Akuntansi throughput karena itu merupakan alat keputusan internal. Sebagian besar pabrik yang menggunakannya tetap menyusun laporan GAAP untuk pelaporan eksternal dan merekonsiliasi keduanya.

### Apa yang harus diawasi pengendali pabrik

| Risiko | Mengapa penting | Mitigasi |
|---|---|---|
| "Benar-benar variabel" didefinisikan terlalu sempit atau terlalu luas | T dilebihkan atau dikurangi | sepakati daftar tertulis: bahan baku, komponen beli, proses luar, ongkos angkut keluar jika per unit, komisi penjualan |
| OE diperlakukan tetap dalam jangka panjang | perubahan volume besar memang mengubah OE | periksa ulang asumsi OE untuk keputusan yang melampaui satu kuartal |
| Mengabaikan lokasi kendala | throughput per menit kendala tidak bermakna jika kendala berpindah | hitung ulang saat tabel beban berubah |
| Penetapan harga di bawah biaya penuh secara permanen | kapasitas cadangan hilang dan OE harus naik | batas volume, tinjau setiap kuartal |
| Dua set angka | kebingungan dalam rapat manajemen | satu lembar rekonsiliasi; TA untuk keputusan, GAAP untuk laporan keuangan |
| Tenaga kerja yang benar-benar bervariasi per unit | upah borongan atau tenaga kerja alih daya yang dicatat per unit benar-benar variabel | masukkan dalam biaya benar-benar variabel; upah reguler tetap di OE |

Panduan [KPI manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/) membahas perputaran persediaan dan ukuran finansial-operasional lainnya.

## Proses berpikir

Proses berpikir (thinking processes/TP) adalah alat TOC untuk masalah yang bukan masalah kapasitas: kendala kebijakan, konflik, dan manajemen perubahan. Novel Goldratt *It's Not Luck* (1994) memperkenalkannya kepada khalayak luas; Kim, Mabin, dan Davies meninjau literatur penelitian tentangnya sejak 1994, setelah buku tersebut, hingga awal 2006, dan menemukan bahwa TOC berkembang terutama melalui praktik, dengan banyak bidang penerapan dan pendekatan multi-metode [12].

TP menjawab tiga pertanyaan: apa yang harus diubah, diubah menjadi apa, dan bagaimana menyebabkan perubahan itu.

| Alat | Pertanyaan | Logika | Keluaran |
|---|---|---|---|
| Pohon realitas saat ini (CRT) | apa yang harus diubah? | sebab-akibat ("jika ... maka ...") dari beberapa akar penyebab ke banyak efek tidak diinginkan (UDE) | inti masalah |
| Awan yang menguap (EC), diagram penyelesaian konflik | diubah menjadi apa? | keniscayaan ("untuk ... kita harus ...") | asumsi yang, jika dilanggar, menyelesaikan konflik |
| Pohon realitas masa depan (FRT) | diubah menjadi apa? | kecukupan, dengan injeksi | solusi beserta efek sampingnya (cabang negatif) |
| Pohon prasyarat (PRT) | bagaimana menyebabkan perubahan itu? | hambatan dan sasaran antara | urutan tonggak pencapaian |
| Pohon transisi (TrT) | bagaimana menyebabkan perubahan itu? | tindakan, alasan, efek | rencana langkah demi langkah |

### Contoh kerja: awan yang menguap pada ukuran batch

Di pabrik manifold, supervisor CNC dan manajer penjualan berselisih tentang ukuran batch untuk B.

| Kotak | Isi |
|---|---|
| A (tujuan bersama) | menjalankan pabrik yang menguntungkan |
| B (kebutuhan 1) | memanfaatkan kapasitas sel CNC dengan baik |
| C (kebutuhan 2) | mengirim pesanan B dengan cepat |
| D (keinginan 1, melayani B) | menjalankan batch B besar (40) untuk menghemat setup |
| D' (keinginan 2, melayani C) | menjalankan batch B kecil (10) |
| Konflik | D dan D' tidak bisa dilakukan bersamaan |

Asumsi di antara B–D: "setup di sel CNC memakan waktu 30 menit, sehingga setiap setup tambahan menelan 30 menit waktu kendala." Injeksinya: memangkas setup menjadi 18 menit dengan persiapan eksternal dan mengelompokkan varian B berdasarkan famili fixture, sehingga batch kecil hanya memakan sedikit waktu kendala. Awan itu "menguap" karena asumsi yang melandasi konflik tidak lagi benar.

### Contoh kerja: pohon realitas saat ini yang kecil

Efek tidak diinginkan (UDE) yang didaftar oleh tim pimpinan: pesanan terlambat, WIP tinggi, sering melakukan percepatan (expediting), lembur di perakitan, supervisor berebut prioritas. Membaca pohon dari bawah:

1. Jika supervisor diukur berdasarkan utilisasi, maka mereka melepas pekerjaan lebih awal agar mesin mereka tetap sibuk.
2. Jika pekerjaan dilepas lebih awal, maka WIP bertambah dan antrean di depan sel CNC memanjang.
3. Jika antrean panjang, maka sel CNC menjalankan apa pun yang ada di atas, bukan yang jatuh tempo.
4. Jika sel CNC menjalankan pesanan yang salah, maka pesanan jatuh tempo terlambat, dan percepatan serta lembur perakitan mengikuti.

Inti masalah: ukuran utilisasi (kendala kebijakan). Perbaikannya bukan menambah kapasitas, melainkan ukuran yang berbeda dan aturan pelepasan, yaitu DBR.

### Menggunakan TP dengan baik

- Buat pohon kecil di awal. Lima sampai sepuluh UDE sudah cukup untuk satu area.
- Periksa setiap panah: apakah penyebab benar-benar mengarah ke efek? Adakah penyebab lain?
- Bekerjalah dalam kelompok yang menyertakan operator; mereka mengetahui efek yang tidak terlihat oleh manajer.
- Awan yang menguap adalah alat yang paling mudah untuk dimulai dan paling berguna dalam konflik sehari-hari.

## TOC vs. lean vs. Six Sigma

TOC, lean dan Six Sigma sering disajikan sebagai pesaing. Dalam praktiknya, ketiganya menjawab pertanyaan yang berbeda.

| Topik | Theory of constraints | Lean | Six Sigma |
|---|---|---|---|
| Asal | Goldratt, 1980-an, Israel dan AS [1][3] | Toyota Production System, Jepang | Motorola, 1980-an, AS [27] |
| Pertanyaan inti | di mana letak daya ungkitnya? | di mana letak pemborosannya? | di mana letak variasinya? |
| Fokus | kendala dan throughput global | aliran dan nilai bagi pelanggan di sepanjang value stream | cacat dan kemampuan proses |
| Alat utama | lima langkah pemfokusan, DBR, manajemen buffer, akuntansi throughput, proses berpikir | value stream mapping, 5S, SMED, kanban, standard work, kaizen | DMAIC, statistik, control chart, desain eksperimen |
| Pandangan tentang kapasitas | melindungi kapasitas berlebih di non-kendala | menyeimbangkan dengan takt, mengurangi kelebihan kapasitas sebagai pemborosan | tidak menjadi pusat perhatian |
| Pandangan tentang persediaan | buffer di beberapa titik terpilih, dalam bentuk waktu | diminimalkan di mana-mana | tidak menjadi pusat perhatian |
| Pandangan keuangan | throughput, persediaan, biaya operasi | lead time, biaya, kualitas | biaya kualitas buruk |
| Kelemahan umum | fokus yang sempit dapat mengabaikan pemborosan di luar kendala | menerapkan alat di mana-mana sekaligus | proyek dipilih tanpa pandangan sistem |

### Cara ketiganya bekerja sama

1. **TOC menetapkan fokus.** Lima langkah pemfokusan memilih titik di mana perbaikan mengubah hasil pabrik.
2. **Lean memanfaatkan kendala.** SMED memangkas waktu changeover pada kendala, TPM meningkatkan ketersediaannya, standard work dan 5S menstabilkannya. Lihat panduan [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/), [SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) dan [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/).
3. **Six Sigma menghilangkan variasi di kendala dan sebelumnya.** Scrap di kendala dan pasokan yang terlambat serta tidak stabil ke dalam buffernya adalah proyek DMAIC yang baik. Lihat [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).
4. **TOC mengukur hasilnya.** Akuntansi throughput menunjukkan apa yang dilakukan setiap proyek terhadap T, I dan OE.

### Di mana lean dan TOC benar-benar berselisih

- **Penyeimbangan lini.** Lean menyeimbangkan muatan kerja dengan takt. TOC sengaja membiarkan non-kendala tidak seimbang, dengan kapasitas cadangan, untuk melindungi kendala. Pada lini perakitan yang diatur takt, lini secara keseluruhan bertindak sebagai kendala; perbedaan ini lebih terasa di job shop.
- **Buffer.** Lean memandang persediaan sebagai pemborosan dan buffer sebagai tindakan sementara. TOC memandang buffer waktu yang diukur dengan tepat di kendala sebagai perlindungan permanen. Keduanya sama-sama menurunkan WIP total secara tajam dibandingkan sistem push.
- **Mekanisme pull.** Kanban membatasi WIP di antara setiap pasangan proses; DBR membatasinya di antara pelepasan dan kendala, mirip dengan CONWIP, yang diusulkan Spearman, Woodruff dan Hopp sebagai alternatif pull bagi kanban [23]. Lihat panduan [kanban and pull system](https://www.m365.fm/en/learn/kanban-pull-system/).

### OEE di kendala

OEE (ketersediaan × performa × kualitas) paling berguna di kendala, tempat setiap menit yang hilang mengurangi throughput. Di non-kendala, OEE yang rendah mungkin hanya berarti mesin menunggu, dan memang seharusnya begitu. Jika pabrik Anda melaporkan satu angka OEE untuk semua mesin, pisahkan kendalanya.

## Di luar pabrik: rantai kritis dan pengisian ulang

### Manajemen proyek rantai kritis

Dalam *Critical Chain* (1997), Goldratt menerapkan TOC pada proyek [3]. Gagasan pokoknya secara ringkas:

- **Rantai kritis** adalah rantai tugas yang saling bergantung paling panjang, dengan memperhitungkan ketergantungan tugas maupun ketergantungan sumber daya. Jalur kritis mengabaikan konflik sumber daya.
- **Estimasi tugas yang agresif.** Waktu pengaman dihapus dari masing-masing tugas.
- **Buffer yang digabungkan.** Waktu pengaman yang dihapus dikumpulkan menjadi **project buffer** di akhir dan **feeding buffer** di titik ketika rantai non-kritis bergabung dengan rantai kritis.
- **Manajemen buffer.** Kemajuan dipantau dengan fever chart: buffer yang terpakai dibandingkan dengan rantai yang telah diselesaikan.
- **Tanpa multitasking yang merugikan.** Sumber daya menyelesaikan satu tugas sebelum memulai tugas berikutnya.

Perbandingan PMI antara DBR dan buffering rantai kritis menjelaskan logika yang sama: keduanya melindungi kendala sistem dengan buffer waktu yang digabungkan, bukan pengaman lokal di setiap langkah [24]. Untuk proyek perkakas, ekspansi pabrik, dan pengenalan produk baru, rantai kritis sering menjadi penerapan TOC kedua setelah DBR.

### Pengisian ulang dan distribusi

Untuk item make-to-stock dan suku cadang, TOC menggantikan peramalan di setiap lokasi dengan buffer yang diisi ulang sesuai konsumsi aktual. Buffer ditentukan ukurannya berdasarkan konsumsi maksimum yang diperkirakan selama waktu pengisian ulang rata-rata, ditambah margin untuk pasokan yang tidak andal; kemudian disesuaikan naik atau turun sebesar sepertiga, bergantung pada berapa lama stok berada di zona merah atau hijau [6]. Panduan [manufacturing inventory management](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) membandingkan pendekatan ini dengan rumus safety stock klasik, dan panduan [S&OP and MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) menunjukkan posisinya dalam perencanaan.

## Templat untuk pekerjaan TOC

Salin tabel-tabel ini ke spreadsheet atau papan lantai produksi. Templat ini sengaja dibuat sederhana.

### Templat 1: Lembar identifikasi kendala

| Sumber daya | Beban yang didorong permintaan (menit/minggu) | Tersedia (menit/minggu) | Porsi produktif | Persentase beban efektif | Antrean rata-rata di depan (jam kerja) | Penelusuran bottleneck: % bekerja | Periode aktif: % tunggal / jumlah | Keputusan |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Templat 2: Catatan kehilangan kendala (per shift)

| Tanggal | Shift | Menit terencana | Menit produktif | Istirahat tidak tercakup | Changeover | Starved | Blocked | Down | Scrap/rework | Catatan |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

### Templat 3: Bauran produk berdasarkan throughput per menit kendala

| Produk | Harga | Biaya variabel sesungguhnya | T per unit | Menit kendala per unit | T per menit kendala | Permintaan | Peringkat | Kuantitas rencana |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Templat 4: Papan status buffer

| Pesanan | Titik yang dilindungi (kendala / perakitan / pengiriman) | Jatuh tempo di titik yang dilindungi | Ukuran buffer (jam) | Sisa (jam) | Penetrasi % | Zona | Lokasi saat ini | Penanggung jawab |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Templat 5: Catatan penyebab pesanan merah

| Tanggal | Pesanan | Zona yang dicapai | Kategori penyebab (material, mesin, kualitas, program, manusia, lainnya) | Rincian penyebab | Menit hilang di kendala | Tindakan penanggulangan | Penanggung jawab |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Templat 6: Lembar keputusan elevasi

| Opsi | Menit kendala tambahan/minggu | Δ T per minggu | Δ OE per minggu | Δ I (sekali) | Δ NP per minggu (ΔT − ΔOE) | Periode pengembalian (minggu) (ΔI ÷ ΔNP) | Ke mana kendala berpindah berikutnya? |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Templat 7: Evaporating cloud

| A: tujuan bersama | B: kebutuhan 1 | C: kebutuhan 2 | D: yang diinginkan untuk melayani B | D': yang diinginkan untuk melayani C | Asumsi B–D | Asumsi C–D' | Asumsi D vs. D' | Injeksi |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Templat 8: Rapat kendala harian (10 menit, di kendala)

| Menit | Topik | Masukan |
|---|---|---|
| 0–2 | kemarin: menit produktif vs. rencana, kehilangan terbesar | Templat 2 |
| 2–5 | buffer: pesanan merah dan kuning, siapa yang bertindak | Templat 4 |
| 5–8 | penyebab pesanan merah, tindakan penanggulangan yang masih terbuka | Templat 5 |
| 8–10 | hari ini: urutan, penugasan staf, jendela pemeliharaan | jadwal drum |

Panduan [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/) menunjukkan cara menanamkan rapat seperti ini dalam rapat berjenjang.

## Roadmap implementasi: enam bulan pertama

Roadmap di bawah ini untuk satu pabrik atau satu value stream. Roadmap ini mengasumsikan adanya kendala fisik di dalam pabrik; jika analisis pada bulan 1 menunjukkan bahwa pasar merupakan kendala, lompat ke S-DBR dan sisi penjualan.

| Fase | Minggu | Tujuan | Kegiatan utama | Kriteria keluar |
|---|---|---|---|---|
| 0. Persiapan | 1–2 | pemahaman bersama | pimpinan membaca *The Goal* atau menjalankan simulasi permainan TOC; menyepakati tujuan dan ukuran (T, I, OE); melibatkan perwakilan serikat pekerja atau karyawan sejak awal | sponsor ditetapkan, tim inti dibentuk, ukuran disepakati |
| 1. Identifikasi | 3–6 | menemukan kendala dengan data | tabel beban (Metode 1), penghitungan antrean, penelusuran bottleneck, data mesin atau analisis periode aktif jika tersedia | kendala disepakati berdasarkan data dan oleh lantai produksi |
| 2. Eksploitasi | 5–12 | memulihkan waktu kendala yang hilang | catatan kehilangan kendala, istirahat cakupan, setup eksternal, kualitas sebelum dan sesudah kendala, prioritas pemeliharaan, bauran produk berdasarkan T per menit kendala | menit produktif meningkat, Pareto kehilangan digunakan |
| 3. Subordinasi | 9–16 | melindungi kendala, mengurangi WIP | uji coba DBR atau S-DBR: jadwal drum, buffer, pelepasan rope; hentikan target utilisasi di non-kendala | aturan pelepasan digunakan setiap hari, WIP menurun |
| 4. Manajemen buffer | 12–20 | pengendalian harian dan pembelajaran | papan status buffer, catatan penyebab pesanan merah, rapat kendala harian 10 menit, penyesuaian pertama ukuran buffer | pesanan merah berkurang, penyebab sedang diperbaiki |
| 5. Ukur dan putuskan | 16–24 | keuangan terlibat dalam dewan | pandangan akuntansi throughput untuk keputusan bauran dan pesanan, rekonsiliasi dengan biaya standar | TA digunakan dalam minimal satu keputusan nyata |
| 6. Tingkatkan dan tinjau | 20–26 | menambah kapasitas hanya jika dibenarkan; periksa inersia | lembar keputusan peningkatan (Templat 6), tinjau rute, aturan batch, aturan penawaran | lokasi kendala diperiksa ulang, siklus berikutnya direncanakan |

### Peran

| Peran | Tanggung jawab |
|---|---|
| Sponsor (manajer pabrik) | tujuan, ukuran, menghapus kendala kebijakan seperti target utilisasi |
| Pemilik kendala (supervisor kendala) | menit produktif harian, catatan kehilangan, rapat kendala |
| Perencana atau penjadwal | jadwal drum, pelepasan, ukuran buffer, penawaran tanggal jatuh tempo |
| Pengendali pabrik (plant controller) | definisi T, I, OE; keputusan bauran produk dan pesanan; rekonsiliasi |
| Pimpinan pemeliharaan | waktu respons kendala, jendela pemeliharaan terencana |
| Pimpinan kualitas | inspeksi sebelum dan sesudah kendala, penyebab pesanan merah dalam kualitas |
| Operator di dan sekitar kendala | alasan kehilangan, peningkatan setup, ide; mereka memiliki tindakan perbaikan |

### Kriteria area percontohan

Pilih value stream di mana (1) satu kendala terlihat jelas, (2) pengiriman atau waktu tunggu merugikan pelanggan, (3) supervisor bersedia, dan (4) data tersedia atau dapat dikumpulkan secara manual selama beberapa minggu. Panduan [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) menunjukkan cara memetakan alur dan melihat di mana kendala berada dalam value stream.

## KPI TOC: cara mengukur kemajuan

| KPI | Rumus | Tingkat | Frekuensi | Keterangan |
|---|---|---|---|---|
| Throughput (T) | penjualan − biaya yang benar-benar variabel | pabrik | mingguan, bulanan | ukuran tujuan utama |
| Beban operasional (OE) | semua pengeluaran lainnya | pabrik | bulanan | harus tumbuh lebih lambat dari T |
| Persediaan/investasi (I) | nilai material stok dan WIP (ditambah aset dalam pandangan luas) | pabrik | bulanan | bagian WIP seharusnya turun dengan DBR |
| Laba bersih | T − OE | pabrik | bulanan | |
| ROI | (T − OE) ÷ I | pabrik | kuartalan | |
| Menit produktif kendala | menit part baik di kendala ÷ menit tersedia | kendala | per shift | detak jantung harian |
| Kepatuhan jadwal kendala | order yang dimulai dalam jendela rencana ÷ order yang direncanakan | kendala | harian | menunjukkan apakah drum tetap terjaga |
| Porsi order merah | order merah ÷ order terbuka | buffer | harian | terlalu tinggi: buffer terlalu kecil atau proses tidak stabil |
| Kinerja tanggal jatuh tempo | order yang dikirim pada atau sebelum tanggal yang dijanjikan ÷ order yang dikirim | pelanggan | mingguan | hasil yang paling terlihat |
| Lead time | dari rilis hingga kirim, median dan persentil ke-90 | value stream | mingguan | periksa dengan Hukum Little |
| WIP dalam hari | WIP ÷ rata-rata throughput harian | value stream | mingguan | |
| Throughput-dollar-days (TDD) | Σ (nilai T order terlambat × hari keterlambatan) | akuntabilitas | mingguan | ukuran TOC tentang "hal-hal yang seharusnya sudah dilakukan"; asal dari pekerjaan pengukuran Goldratt [unverified] |
| Inventory-dollar-days (IDD) | Σ (nilai persediaan × hari disimpan) | akuntabilitas | mingguan | mengukur "hal-hal yang seharusnya tidak dilakukan" [unverified] |

Dua aturan untuk papan KPI: tampilkan KPI kendala di kendala, dan jangan tampilkan utilisasi non-kendala sebagai target kinerja. Panduan [KPI manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/) mendefinisikan KPI produksi standar yang berada di samping KPI ini.

## Kesalahan umum

| Kesalahan | Mengapa merugikan | Lebih baik |
|---|---|---|
| Memilih kendala berdasarkan perasaan | masalah yang terlihat sering kali hanya gejala (perakitan kekurangan pasokan) | tabel beban ditambah pemeriksaan lantai produksi, data periode aktif jika tersedia |
| Langsung melompat ke langkah 4 | uang dikeluarkan sementara kendala masih kehilangan 20 sampai 25% waktunya | eksploitasi dan subordinasi lebih dulu |
| Mempertahankan target utilisasi di non-kendala | rilis dini, WIP bertambah, kendala menjalankan pekerjaan yang keliru | ukur non-kendala dengan "kendala tidak pernah menunggu kita" |
| Merilis pekerjaan lebih awal "agar aman" | WIP dan lead time bertambah; prioritas hilang | rilis ketat berdasarkan rope |
| Buffer ditetapkan sekali lalu dilupakan | terlalu besar: WIP tetap tinggi; terlalu kecil: order merah terus-menerus | sesuaikan berdasarkan data order merah |
| Tidak ada gerbang kualitas sebelum kendala | kendala memproses part yang sudah menjadi scrap | inspeksi atau poka-yoke sebelum kendala |
| Scrap ditemukan jauh di hilir | waktu kendala terbuang diam-diam | periksa fitur kritis tepat setelah kendala |
| Mengabaikan kendala pasar | pabrik dengan kapasitas berlebih di mana-mana terus "mengoptimalkan" mesin | S-DBR, penawaran lead time, keterlibatan penjualan |
| Bauran produk berdasarkan margin per unit | laba lebih rendah dengan kapasitas yang sama | urutkan berdasarkan T per menit kendala |
| Dua sistem prioritas yang bersaing | daftar prioritas mendadak dan warna buffer saling bertentangan | satu aturan: status buffer |
| Kendala berpindah, aturan tetap sama | ukuran batch dan penawaran lama menghalangi peningkatan berikutnya | tinjauan langkah 5 di setiap siklus |
| Operator di kendala dibiarkan begitu saja | orang yang melihat kerugian tidak pernah diminta pendapatnya | operator bertanggung jawab atas alasan kerugian dan tindakan penanggulangan |

## Kritik dan batasan teori kendala

TOC memiliki hasil yang kuat dalam praktik dan dukungan yang lebih lemah dalam penelitian. Panduan yang serius harus membahas keduanya.

### 1. Bukti: kisah sukses dan bias publikasi

Mabin dan Balderstone menganalisis lebih dari 80 penerapan TOC yang sukses dan dipublikasikan, dan menemukan peningkatan operasional dan finansial yang signifikan; meskipun telah melakukan pencarian yang luas, mereka tidak menemukan laporan kegagalan [10]. Hal ini merupakan peringatan sekaligus dukungan. Kasus yang dipublikasikan ditulis oleh konsultan, vendor, dan perusahaan yang antusias; implementasi yang gagal jarang sampai ke publikasi. Gupta dan Snyder (2009) berpendapat bahwa TOC belum menunjukkan efektivitasnya dalam literatur akademik dan menyerukan studi yang menghubungkan implementasi dengan kinerja finansial, sebagaimana dirangkum di Wikipedia [6]. Survei Panizzolo terhadap 61 pabrik di Eropa menemukan bahwa beberapa praktik TOC, khususnya DBR, non-kendala dengan kapasitas berlebih, dan jadwal induk berbasis kendala, dikaitkan dengan kinerja yang lebih baik, tetapi hasilnya berbeda antarnegara dan bergantung pada penilaian mandiri para manajer [11].

### 2. Optimalitas dan penelitian penjadwalan

Peneliti riset operasi telah mengkritik heuristik TOC karena tidak optimal. Trietsch berpendapat bahwa DBR lebih rendah dibandingkan metode pesaing, dan Linhares (2009) berpendapat bahwa aturan bauran produk TOC (peringkat berdasarkan throughput per unit kendala) tidak dapat menjamin hasil yang optimal secara umum, karena masalah bauran produk dengan beberapa kendala sulit secara komputasi [6]. Pelajaran praktisnya: aturan "T per menit kendala" dapat diandalkan dengan satu kendala yang jelas. Dengan dua atau lebih kendala yang saling berinteraksi, gunakan pemrograman linier atau APS.

### 3. Orisinalitas

Para kritikus menunjukkan bahwa banyak gagasan TOC sudah ada sebelumnya: kontribusi per faktor pembatas dalam akuntansi manajemen (Noreen, Smith and Mackey, 1995), unsur dinamika sistem dan pengendalian proses statistik, PERT/CPM dalam manajemen proyek [6]. Goldratt sendiri mengakui karya-karya sebelumnya, khususnya Toyota Production System dan gagasan aliran Ford, dalam makalahnya tahun 2009 "Standing on the Shoulders of Giants" [6]. Bagi praktisi, orisinalitas kurang penting dibandingkan apakah kombinasinya berhasil; bagi mahasiswa, penting untuk mengetahui dari mana potongan-potongan itu berasal.

### 4. Orang dan kebijakan

Nave (2002) berpendapat bahwa TOC cenderung mengabaikan karyawan dan tidak memperlakukan kebijakan yang gagal sebagai kendala, sebagaimana dirangkum di Wikipedia [6]. Dalam praktik, risikonya adalah "subordinate" dimaknai sebagai "patuh," dan operator di titik kendala menanggung seluruh tekanan. Bagian 20 membahas hal ini.

### 5. Di mana TOC kurang sesuai

- **Lini yang seimbang dan berirama** dengan takt dan variabilitas yang rendah: lini itu sendiri adalah kendala, dan penyeimbangan lini lean adalah alat yang lebih tepat.
- **Hambatan yang sangat berpindah-pindah** di job shop dengan campuran tinggi: sulit menentukan satu drum. S-DBR, kontrol beban kerja, atau APS lebih sesuai.
- **Pabrik di mana pasar menjadi kendala** selama bertahun-tahun: DBR internal menambah sedikit nilai; pengungkit ada pada penjualan, lead time, dan desain penawaran.
- **Kematangan pengukuran:** akuntansi throughput memerlukan tim keuangan yang bersedia menjalankan sudut pandang kedua. Tanpa itu, keputusan kembali ke biaya standar.

### 6. Konteks komersial

Sebagian besar literatur TOC diterbitkan oleh North River Press dan oleh konsultan yang didirikan oleh Goldratt atau rekan-rekannya. Hal itu tidak membuatnya salah, tetapi berarti banyak sumber tidak independen. Panduan ini menggunakan sumber yang telah ditinjau sejawat jika tersedia dan memberi label pada klaim praktisi (seperti angka "kapasitas tersembunyi 30 persen" dari TOC Institute) sebagaimana adanya [4].

## Orang dan keselamatan di titik kendala

TOC dapat membuat pekerjaan di titik kendala menjadi lebih baik atau lebih buruk bagi orang-orangnya. Metodenya sendiri netral; cara pengenalannya yang menentukan.

### Hal pertama yang diperhatikan operator

- **Perhatian yang lebih besar:** manajer tiba-tiba peduli pada setiap menit di satu mesin. Hal itu bisa terasa seperti pengawasan. Jelaskan alasannya, dan biarkan operator mencatat kehilangan waktu mereka sendiri.
- **Istirahat:** "istirahat pengganti" berarti operator pengganti menjalankan mesin, bukan berarti orang melewatkan istirahat.
- **Waktu menganggur di tempat lain:** operator di area non-kendala mungkin khawatir akan pekerjaan mereka ketika diberi tahu untuk tidak menumpuk persediaan. Jelaskan bahwa kapasitas cadangan memang disengaja dan gunakan untuk pelatihan, perbaikan setup, 5S, pelatihan silang untuk kendala, dan pekerjaan kualitas.
- **Pengakuan:** perbaikan dari tim kendala (seperti pergantian dari 30 menjadi 18 menit) harus terlihat di papan, dengan nama jika mereka setuju.

### Aturan keselamatan tidak dikompromikan demi kendala

Tekanan untuk menjaga kendala tetap berjalan tidak boleh mengarah pada jalan pintas dalam keselamatan. Servis dan perawatan pada mesin yang bisa menimbulkan cedera akibat energi yang tidak terduga termasuk dalam standar OSHA tentang pengendalian energi berbahaya (lockout/tagout, 29 CFR 1910.147) [25]. Pergantian yang lebih cepat harus dirancang ke dalam prosedur (fiksasi lepas-cepat, perkakas yang sudah disiapkan, material yang dikirim bertahap), bukan dicapai dengan melewati lockout. Hal yang sama berlaku untuk pengaman dan ergonomi: operator pengganti memerlukan pelatihan dan kualifikasi yang sama dengan operator reguler.

### Konteks serikat pekerja dan tenaga kerja

Di pabrik yang memiliki serikat pekerja, jadwal istirahat yang diatur bergantian, operator pengganti, shift Sabtu, dan perubahan pengukuran sering menyentuh perjanjian kerja bersama. Libatkan serikat pekerja atau perwakilan karyawan pada fase 0 dari peta jalan, jelaskan tujuannya dan sepakati bagaimana lembur dan peran pengganti ditetapkan. Penerapan TOC yang dimulai dengan keluhan soal jadwal istirahat akan kehilangan waktu berbulan-bulan.

### Penghormatan terhadap manusia dalam istilah TOC

Awan yang menguap (Bagian 12) adalah alat praktis untuk penghormatan terhadap manusia: ia berangkat dari asumsi bahwa kedua pihak dalam suatu konflik memiliki kebutuhan yang sah, lalu mencari asumsi keliru yang mendasari konflik tersebut. Jika digunakan dalam tim yang mencakup operator, ia mengubah "operator versus perencana" menjadi masalah bersama dengan tujuan bersama.

## TOC di pabrik digital: data, simulasi, dan APS

TOC lahir bersama perangkat lunak: OPT adalah program penjadwalan sebelum menjadi sebuah filosofi [3]. Saat ini, alat digital membantu di empat bidang.

### 1. Data untuk deteksi bottleneck

Platform MES dan IIoT menyediakan status mesin ber-timestamp yang dibutuhkan metode active period (Bagian 6). Sebagian besar pabrik sudah memiliki status (berjalan, menganggur, rusak, setup), tetapi belum memisahkan "kekurangan pasokan" dan "terblokir" dari "menganggur." Menambahkan dua status tersebut sering kali menjadi perubahan tunggal yang paling berguna untuk analisis TOC. Sepakati dengan operator dan, jika berlaku, serikat pekerja bahwa data status mesin digunakan untuk menemukan kerugian sistem, bukan untuk menilai kinerja individu. Kumpulkan data secara read-only dari kontroler dan jaga segmentasi jaringan OT; panduan [keamanan siber OT dan ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) menjelaskan caranya. Pastikan jam di seluruh mesin tersinkronisasi, karena metode active period membandingkan timestamp antar sumber daya. Panduan [MES dan ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) dan [predictive maintenance dan IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) menjelaskan jalur data; panduan [manufacturing IT dengan Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) membahas analitik cloud untuk data semacam ini.

### 2. Simulasi untuk pergeseran bottleneck dan penentuan ukuran buffer

Simulasi discrete event memungkinkan Anda menguji ukuran buffer, aturan pelepasan, dan opsi peningkatan kapasitas sebelum Anda mengubah lantai produksi. Roser, Nakano, dan Tanaka mengembangkan metode active period berdasarkan data simulasi [13][14]. Pertanyaan yang lazim: Seberapa sering bottleneck bergeser dengan bauran produk kuartal depan? Seberapa besar buffer constraint harus dibuat agar porsi pesanan merah tetap di bawah 10 persen? Apakah mesin kedua akan memindahkan constraint ke perakitan? Panduan [digital twin dalam manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/) menjelaskan kapan sebuah model simulasi menjadi digital twin.

### 3. APS untuk penjadwalan drum

APS dapat menjadwalkan drum dengan setup yang bergantung pada urutan, menghitung tanggal pelepasan dari buffer, dan menampilkan status buffer. DBR memberikan logika kendali; APS memberikan daya komputasi, terutama ketika constraint bergeser atau beberapa constraint saling berinteraksi (di situlah aturan bauran produk sederhana gagal, lihat Bagian 19). Panduan [penjadwalan produksi dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/) membahas hal ini secara mendalam, termasuk kapan ERP sudah cukup.

### 4. Model value stream untuk pandangan sistem

Model value stream digital menampilkan constraint dalam konteks seluruh aliran: cycle time, availability, ukuran batch, dan persediaan. Salah satu contoh perangkat lunak tersebut adalah iFAKT Polaris, yang menggabungkan pemodelan value stream dan simulasi; menurut vendor, modul-modulnya mencakup optimasi penjadwalan [26]. Itu merupakan deskripsi vendor, bukan pengujian independen. **Catatan: Penulis bekerja di iFAKT GmbH.** Panduan [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) menguraikannya lebih rinci; alat value stream dan simulasi lainnya juga dapat melakukan analisis TOC yang sama.

### Urutan: metode lebih dulu, baru perangkat lunak

Mulailah dengan log kehilangan constraint dan papan buffer di atas kertas atau spreadsheet. Otomatiskan ketika metodenya sudah berjalan dan orang-orang mempercayai angkanya. Layar status buffer yang tidak ditindaklanjuti siapa pun lebih buruk daripada papan tulis yang memandu rapat harian.

## Glosarium

| Istilah | Definisi |
|---|---|
| Periode aktif | rangkaian keadaan aktif yang tidak terputus dari sebuah sumber daya; dasar metode periode aktif [13] |
| Metode periode aktif | metode deteksi bottleneck: pada setiap saat, sumber daya dengan periode aktif tidak terputus paling panjang adalah bottleneck [13][14] |
| Buffer perakitan | buffer waktu yang membuat bagian non-kendala menunggu di perakitan untuk bagian kendala |
| Bottleneck | sumber daya yang kapasitasnya lebih rendah daripada permintaan yang dibebankan kepadanya |
| Bottleneck walk | metode di lantai produksi dengan mencatat keadaan bekerja, kekurangan pasokan (starved), dan terblokir (blocked) pada putaran pengamatan berulang [15] |
| Manajemen buffer | pelacakan konsumsi buffer berdasarkan zona warna untuk menentukan prioritas dan menemukan penyebab perbaikan [9] |
| Penetrasi buffer | bagian dari buffer waktu yang sudah terpakai |
| Sumber daya terbatas kapasitas (CCR) | sumber daya yang mendekati kapasitasnya dan dapat menjadi kendala jika tidak dikelola |
| Kendala | apa pun yang membatasi kinerja sistem terhadap tujuannya |
| Buffer kendala | buffer waktu di depan kendala |
| CONWIP | constant work in process; sistem tarik yang membatasi total WIP dalam lini [23] |
| Rantai kritis | rantai tugas dependen terpanjang dengan mempertimbangkan ketergantungan tugas dan sumber daya |
| Pohon realitas saat ini (CRT) | alat proses berpikir yang menghubungkan efek tidak diinginkan dengan akar penyebab |
| Drum | jadwal kendala, yang menentukan ritme pabrik |
| Drum-buffer-rope (DBR) | metode penjadwalan TOC: jadwalkan kendala, lindungi dengan buffer waktu, lepaskan sesuai ritmenya [6][8] |
| Tingkatkan (Elevate) | langkah 4: tambahkan kapasitas pada kendala |
| Awan yang menguap (EC) | alat proses berpikir untuk menyelesaikan konflik dengan menantang suatu asumsi |
| Manfaatkan (Exploit) | langkah 2: memaksimalkan kendala dengan sumber daya yang ada |
| Feeding buffer | dalam rantai kritis, buffer tempat rantai non-kritis bergabung dengan rantai kritis |
| Lima langkah pemusatan | identifikasi, manfaatkan, subordinasikan, tingkatkan, cegah inersia [4] |
| Pohon realitas masa depan (FRT) | alat proses berpikir untuk menguji suatu solusi beserta efek sampingnya |
| Inersia | aturan dan kebiasaan yang bertahan lebih lama daripada kendala yang menjadi alasan pembuatannya |
| Persediaan/investasi (I) | uang yang terikat pada barang yang dimaksudkan sistem untuk dijual (dan, dalam pandangan luas, pada aset) [20] |
| Hukum Little | WIP = throughput × waktu siklus [16] |
| Beban operasi (OE) | seluruh uang yang dikeluarkan untuk mengubah persediaan menjadi throughput [20] |
| Beban rencana | dalam S-DBR, pekerjaan yang dijadwalkan pada CCR yang dinyatakan dalam satuan waktu |
| POOGI | process of ongoing improvement; lima langkah pemusatan sebagai siklus |
| Pohon prasyarat (PRT) | alat proses berpikir yang mendaftar hambatan dan tujuan antara |
| Buffer proyek | dalam rantai kritis, waktu pengaman agregat di akhir proyek |
| Rope | mekanisme pelepasan yang menghubungkan pelepasan material dengan jadwal kendala |
| S-DBR (simplified drum-buffer-rope) | varian DBR dengan buffer pengiriman dan pemeriksaan beban rencana, untuk make-to-order [6][9] |
| Bottleneck berpindah (shifting bottleneck) | bottleneck yang berpindah antarsumber daya seiring waktu [14] |
| Buffer pengiriman | buffer waktu yang melindungi tanggal jatuh tempo |
| Subordinasi (Subordinate) | langkah 3: menyelaraskan semua non-kendala dengan kendala |
| Throughput (T) | laju sistem menghasilkan uang melalui penjualan: penjualan dikurangi biaya variabel sesungguhnya [20] |
| Akuntansi throughput | akuntansi manajemen yang didasarkan pada T, I, dan OE |
| Rasio akuntansi throughput (TPAR) | pengembalian per jam pabrik ÷ biaya per jam pabrik [19] |
| Pohon transisi (TrT) | alat proses berpikir untuk implementasi langkah demi langkah |
| TOCICO | Theory of Constraints International Certification Organization, organisasi nonprofit 501(c)(3) asal AS [5] |
| Efek tidak diinginkan (UDE) | efek negatif yang diamati, digunakan sebagai masukan untuk pohon realitas saat ini |
| VATI | klasifikasi pabrik berdasarkan bentuk aliran material: V, A, T, I [6] |

## FAQ: pertanyaan tentang teori kendala

### Apa itu teori kendala secara sederhana?

Setiap sistem memiliki satu atau beberapa titik lemah yang membatasi seberapa banyak yang dapat dihasilkannya. Teori kendala menyatakan: temukan titik lemah itu, manfaatkan sebaik-baiknya, selaraskan semua bagian lain dengannya, dan baru setelah itu berinvestasi padanya. Teori ini dikembangkan oleh Eliyahu M. Goldratt dan diperkenalkan dalam *The Goal* pada 1984 [1].

### Apa 5 langkah dalam teori kendala?

Identifikasi kendala, eksploitasi kendala, subordinasikan semua hal lain pada kendala, elevasi kendala, dan cegah inersia menjadi kendala, lalu mulai lagi dari awal [4].

### Apa contoh teori kendala?

Pada pabrik manifold di Bagian 5, sebuah sel CNC membatasi output. Dengan menutup waktu istirahat, mempercepat pergantian produk, menata material secara bertahap, dan memajukan pemeriksaan kualitas, waktu produktifnya naik 800 menit per minggu (22 persen). Mengubah bauran produk ke throughput per menit kendala menambah laba tanpa investasi. Mesin kedua seharga $650.000 ternyata menjadi pilihan terlemah.

### Apa perbedaan antara bottleneck dan kendala?

Bottleneck adalah sumber daya dengan kapasitas lebih kecil daripada permintaan terhadapnya. Kendala adalah apa pun yang membatasi tujuan sistem: bisa bottleneck, tetapi juga pasar, material, kebijakan, atau pola pikir. Setiap bottleneck yang membatasi output adalah kendala; tidak setiap kendala adalah bottleneck.

### Bagaimana cara mengidentifikasi bottleneck dalam suatu proses?

Mulailah dengan tabel beban kapasitas (permintaan × waktu proses dibandingkan dengan waktu tersedia), lalu konfirmasi di lantai produksi dengan jumlah antrean dan penelusuran bottleneck. Jika Anda memiliki data status mesin yang diberi cap waktu, gunakan metode periode aktif, yang juga memperlihatkan bottleneck yang berpindah [13][14][15]. Bagian 6 membandingkan enam metode.

### Apa itu analisis bottleneck?

Analisis bottleneck menemukan sumber daya yang membatasi suatu proses, mengukur berapa output yang hilang karenanya, dan memeriksa apakah posisinya berpindah dari waktu ke waktu. Di pabrik, mulailah dengan perhitungan beban kapasitas, konfirmasi dengan jumlah antrean dan penelusuran bottleneck, serta gunakan data status mesin dengan metode periode aktif jika tersedia (Bagian 6).

### Bagaimana cara memperbaiki bottleneck?

Ikuti lima langkah pemusatan. Pertama, eksploitasi bottleneck (tanpa menit yang terbuang, tanpa pekerjaan cacat, dengan bauran produk yang tepat), lalu subordinasikan sisa pabrik pada ritmenya, dan baru kemudian elevasi dengan lembur, alih daya, atau peralatan baru. Dalam contoh manifold di Bagian 5, eksploitasi saja menaikkan waktu produktif pada kendala sebesar 22 persen sebelum ada investasi apa pun.

### Apa itu kendala produksi?

Segala sesuatu yang membatasi seberapa banyak pabrik dapat memproduksi dan mengirimkan: kapasitas peralatan, tenaga kerja dan keterampilan, material dan pemasok, pasar, serta kebijakan pabrik sendiri, seperti aturan ukuran batch atau tingkat utilisasi. Kendala produksi tidak selalu berupa mesin (Bagian 3).

### Apa saja empat jenis kendala?

Daftarnya berbeda-beda. Jika dikelompokkan menjadi empat, jenis-jenis dalam Bagian 3 adalah kendala fisik (peralatan, tenaga kerja, material), kendala pasar, kendala kebijakan, dan kendala paradigma. Tabel di Bagian 3 memecah kendala fisik menjadi tiga, sehingga jumlahnya menjadi enam.

### Apa itu drum-buffer-rope?

Drum-buffer-rope adalah metode penjadwalan TOC. Drum adalah jadwal kendala, buffer adalah penyangga waktu yang melindungi kendala dan tanggal pengiriman, sedangkan rope melepaskan material hanya satu waktu buffer sebelum kendala membutuhkannya [6][8]. Bagian 7 menunjukkan jadwal pelepasan dengan angka.

### Apa itu simplified drum-buffer-rope (S-DBR)?

S-DBR adalah varian untuk pabrik make-to-order. Metode ini hanya menggunakan buffer pengiriman dan memeriksa beban rencana pada sumber daya pembatas kapasitas saat tanggal jatuh tempo dijanjikan, alih-alih menyimpan jadwal kendala yang rinci [6][9].

### Apa itu manajemen buffer?

Manajemen buffer melacak seberapa banyak waktu buffer tiap pesanan telah terpakai dan memberi warna hijau, kuning, atau merah pada pesanan. Pesanan merah mendapat prioritas, dan penyebab pesanan merah menjadi daftar perbaikan [9].

### Apa itu akuntansi throughput?

Akuntansi throughput adalah akuntansi manajemen TOC. Metode ini menggunakan throughput (penjualan dikurangi biaya variabel murni), persediaan atau investasi, dan biaya operasi; laba bersih adalah T − OE dan ROI adalah (T − OE) ÷ I [20][22]. Di bawah kendala, metode ini memeringkat produk berdasarkan throughput per menit kendala.

### Bagaimana akuntansi throughput berbeda dengan akuntansi biaya?

Akuntansi biaya standar membebankan tenaga kerja dan overhead ke setiap unit, lalu meranking produk berdasarkan margin per unit. Akuntansi throughput memperlakukan tenaga kerja dan overhead sebagai biaya operasi, yang dalam jangka pendek tidak berubah seiring setiap unit, dan meranking produk berdasarkan throughput per unit waktu kendala. Keduanya bisa memberikan jawaban yang berlawanan, seperti ditunjukkan contoh di Bagian 11.

### Apa perbedaan antara lean dan teori kendala?

Lean mencari pemborosan di seluruh rantai nilai dan menciptakan aliran serta tarikan (pull). TOC mencari satu kendala dan memusatkan perbaikan di sana. Lean menyeimbangkan pekerjaan dengan takt; TOC menjaga kapasitas cadangan di titik non-kendala. Jika digunakan bersama, TOC memberi tahu alat lean seperti SMED dan TPM di mana harus bekerja lebih dulu.

### Apakah TOC dan Six Sigma bisa dikombinasikan?

Bisa. TOC memilih lokasinya, Six Sigma mengurangi variasi di lokasi tersebut, misalnya scrap pada kendala atau pasokan yang tidak stabil ke buffer-nya. Akuntansi throughput kemudian menunjukkan dampak finansial setiap proyek.

### Apa saja proses berpikir dalam TOC?

Sekumpulan alat logika untuk masalah non-fisik: current reality tree, evaporating cloud, future reality tree, prerequisite tree, dan transition tree. Alat-alat ini menjawab apa yang harus diubah, menjadi apa, dan bagaimana menyebabkan perubahan tersebut [12].

### Apa itu critical chain project management?

Penerapan TOC oleh Goldratt pada proyek, dari bukunya tahun 1997 *Critical Chain* [3]. Metode ini menjadwalkan rantai terpanjang dependensi tugas dan sumber daya, menghilangkan keamanan waktu dari tiap tugas, dan mengumpulkannya dalam project buffer dan feeding buffer.

### Apa itu teori kendala dalam supply chain management?

Dalam rantai pasok, TOC mengganti stok yang didorong peramalan di setiap lokasi dengan buffer yang diisi ulang sesuai konsumsi aktual dan diukur ulang berdasarkan status buffer [6]. TOC memandang mata rantai terlemah, sering kali pemasok, pabrik, atau pasar, sebagai kendala yang menentukan laju seluruh sistem. Bagian 14 merangkum aturan replenishment.

### Apa kritik terhadap teori kendala?

Kritik utamanya adalah bias publikasi dalam studi keberhasilan, heuristik TOC yang tidak optimal ketika beberapa kendala saling berinteraksi, keaslian sebagian gagasan yang terbatas, dan kecenderungan mengabaikan manusia serta kebijakan [6][10]. Bagian 19 membahas setiap kritik tersebut.

### Apakah teori kendala masih relevan?

Ya. Pabrik masih memiliki kendala, dan kombinasi data mesin yang lebih baik, simulasi, dan APS memudahkan pencarian bottleneck yang berpindah-pindah serta penjadwalan drum. Yang berubah adalah TOC jarang dipakai sendirian; biasanya dikombinasikan dengan lean, Six Sigma, dan perencanaan digital.

### Siapa yang menciptakan teori kendala?

Eliyahu M. Goldratt (1947 hingga 2011), fisikawan dan penulis bisnis asal Israel. Ia memperkenalkan TOC dalam *The Goal* (1984), yang ditulis bersama Jeff Cox [1][2].

### Berapa lama waktu yang dibutuhkan untuk menerapkan teori kendala?

Di satu pabrik atau satu rantai nilai, hasil terukur pertama biasanya muncul dari exploitation dalam beberapa minggu, karena membutuhkan sedikit biaya. Rutinitas DBR atau S-DBR yang stabil dengan manajemen buffer membutuhkan beberapa bulan; peta jalan di Bagian 16 merencanakan enam bulan untuk siklus penuh pertama. Durasi ini adalah asumsi perencanaan, bukan tolok ukur dari suatu studi.

### Apakah ada sertifikasi teori kendala?

TOCICO menawarkan sertifikasi dalam tiga tingkat: ujian dasar (fundamentals), ujian praktisi, dan asesmen implementer, di bidang seperti operasi, supply chain, manajemen proyek (CCPM), proses berpikir, dan keuangan [5].

## Kesimpulan dan langkah pertama

Teori kendala (theory of constraints) berangkat dari satu pengamatan sederhana: output pabrik ditentukan oleh sejumlah kecil kendala, biasanya hanya satu. Hal ini mengubah apa yang harus dilakukan manajer. Alih-alih memperbaiki semuanya sekaligus, temukan kendalanya, hentikan pemborosan waktunya, buat sisa pabrik melayaninya, dan keluarkan biaya hanya setelah itu selesai. Drum-buffer-rope menerjemahkan logika ini menjadi jadwal, manajemen buffer menerjemahkannya menjadi prioritas harian, dan akuntansi throughput menerjemahkannya menjadi keputusan keuangan yang bisa keliru jika hanya mengandalkan laporan biaya standar.

Contoh kasus menunjukkan skala peningkatan yang sering kali dapat dicapai tanpa investasi: 22 persen tambahan waktu kendala dari pengaturan istirahat, setup, penyiapan material, dan pemeriksaan kualitas, serta perubahan bauran produk yang tidak akan disarankan oleh costing standar. Contoh ini juga menunjukkan batasannya: setelah kendala dimanfaatkan, kendala itu berpindah, dan aturan lama menjadi masalah berikutnya. TOC paling kuat ketika ada satu kendala yang jelas, dan memerlukan alat lain (optimasi, APS, line balancing lean) ketika kendala berpindah-pindah atau saling berinteraksi. Basis buktinya sebagian besar berupa kisah sukses, jadi uji klaim tersebut di pabrik Anda sendiri.

**Langkah Anda dalam 30 hari ke depan**

- [ ] Susun tabel beban untuk keluarga produk utama Anda (permintaan × waktu proses vs. waktu tersedia) dan tetapkan kandidat kendalanya
- [ ] Konfirmasi dengan jumlah antrean dan tiga kali penelusuran bottleneck per shift selama satu minggu
- [ ] Mulai catatan kehilangan kendala (Templat 2) pada kandidat tersebut dan isi setiap shift selama dua minggu
- [ ] Hitung throughput per menit kendala untuk 10 produk teratas Anda (Templat 3) bersama pengendali (controller) keuangan Anda
- [ ] Pilih dua kerugian terbesar dan tangani (pengaturan istirahat, external setup, kualitas sebelum kendala)
- [ ] Hentikan setidaknya satu target utilisasi di non-kendala
- [ ] Berikan pengarahan kepada perwakilan serikat pekerja atau karyawan tentang tujuan, pengaturan istirahat, dan peran kapasitas cadangan
- [ ] Tanyakan kepada tim IT apakah data mesin dapat membedakan "starved" dan "blocked" dari "idle" untuk metode periode aktif
- [ ] Adakan rapat harian 10 menit di kendala (Templat 8)

---

## Bacaan lanjutan di m365.fm

**Panduan terkait**
- [Penjadwalan Produksi dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI Manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Manajemen Shop Floor dan Gemba Walk](https://www.m365.fm/en/learn/shop-floor-management/)
- [Digital Twin dalam Manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [IT Manufaktur dengan Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Perencanaan Produksi Aerospace](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Panduan baru dalam seri ini**
- [SMED dan Pengurangan Changeover](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM dan OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban dan Sistem Pull](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma dan Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP, dan Perencanaan Produksi](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES dan ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Predictive Maintenance dan IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [Simulasi Manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Lot Sizing](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Manajemen Persediaan Manufaktur](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)

**Istilah glosarium (entitas)**
[Teori kendala](https://www.m365.fm/entity/theory-of-constraints/) · [Penjadwalan berbasis kendala](https://www.m365.fm/entity/constraint-based-scheduling/) · [Manajemen buffer](https://www.m365.fm/entity/buffer-management/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [SMED](https://www.m365.fm/entity/smed/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Sistem pull](https://www.m365.fm/entity/pull-system/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** ist Gastgeber von m365.fm und arbeitet bei iFAKT GmbH. Auf m365.fm schreibt er über Lean Manufacturing, operative Exzellenz, Produktionsplanung und die digitale Transformation der Produktion, mit Schwerpunkt darauf, wie Wertstrommodelle, Simulation und KPI-Analysen Werken helfen, ihre Engpässe zu finden und zu steuern.

**Hinweis: Der Autor arbeitet bei iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked (S) were taken over from the source list of the related guide *Production Scheduling and APS* (`production-scheduling-aps.md`), where they were verified on the same date; they could not be re-fetched in this session because the shared web search and fetch budget ran out.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal: Excellence in Manufacturing. North River Press, Croton-on-Hudson (NY) 1984, 262 pp., ISBN 978-0-88427-060-7, LCCN 85021827. Catalog record: Open Library. https://openlibrary.org/books/OL2540561M/The_goal
2. North River Press: Eliyahu M. Goldratt, Renowned Business Guru and Author of International Best Selling Business Novel The Goal, Dies at Age 64. Press release via PR Newswire, June 14, 2011. https://prnewswire.com/news-releases/eliyahu-m-goldratt-renowned-business-guru-and-author-of-international-best-selling-business-novel-the-goal-dies-at-age-64-123796619.html
3. Eliyahu M. Goldratt (biography, Creative Output and OPT, Avraham Y. Goldratt Institute, bibliography with years). Wikipedia. https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt
4. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html (and the overview page https://www.tocinstitute.org/theory-of-constraints.html)
5. Theory of Constraints International Certification Organization (TOCICO): About us (501(c)(3) status, certification levels, TOC Innovation Summit). https://www.tocico.org/about-us
6. Theory of constraints (five focusing steps, buffers and buffer management, DBR and S-DBR, VATI, throughput accounting, critical chain, criticism section citing Trietsch, Linhares 2009, Noreen/Smith/Mackey 1995, Gupta/Snyder 2009, Nave 2002 and Goldratt 2009). Wikipedia. https://en.wikipedia.org/wiki/Theory_of_constraints
7. The Goal (novel) (editions, characters, Time 2011 list citing Rawlings, N.: The 25 Most Influential Business Management Books, Time, August 9, 2011). Wikipedia. https://en.wikipedia.org/wiki/The_Goal_(novel)
8. (S) Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
9. (S) Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, M. L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
10. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636. https://www.emeraldinsight.com/doi/abs/10.1108/01443570310476636
11. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
12. Kim, Sanghyun; Mabin, Victoria J.; Davies, John: The theory of constraints thinking processes: retrospect and prospect. International Journal of Operations & Production Management 28 (2008) 2, pp. 155–184. DOI: 10.1108/01443570810846883
13. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: A Practical Bottleneck Detection Method. In: Peters, B. A.; Smith, J. S.; Medeiros, D. J.; Rohrer, M. W. (eds.): Proceedings of the 2001 Winter Simulation Conference, pp. 949–953. https://informs-sim.org/wsc01papers/126.PDF
14. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: Shifting Bottleneck Detection. In: Yücesan, E.; Chen, C.-H.; Snowdon, J. L.; Charnes, J. M. (eds.): Proceedings of the 2002 Winter Simulation Conference, pp. 1079–1086. https://www.informs-sim.org/wsc02papers/145.pdf
15. Roser, Christoph: Mathematically Accurate Bottleneck Detection 2 – The Active Period Method. AllAboutLean.com, June 29, 2014 (updated May 13, 2026). https://www.allaboutlean.com/active-period-method
16. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383 (bibliographic data confirmed via Crossref, November 20, 2026)
17. (S) Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
18. (S) Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
19. ACCA (Performance Management examining team): Throughput accounting and the theory of constraints, part 2. Association of Chartered Certified Accountants, technical article. https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/throughput-constraints2.html
20. Murphy, Sean: Summary of Goldratt, E. M.: The Haystack Syndrome: Sifting Information Out of the Data Ocean. North River Press, New York 1990. Management and Accounting Web (MAAW, J. R. Martin). https://maaw.info/ArticleSummaries/ArtSumHaystackSyndrome90.htm
21. Corbett, Thomas: Throughput Accounting. North River Press, 174 pp., ISBN 978-0-88427-158-1 (retailer listing dated January 1, 1999; publisher page: https://www.toc-goldratt.com/en/product/Throughput-Accounting). Listing: https://www.booktopia.com.au/throughput-accounting-thomas-corbett/book/9780884271581.html
22. Theory of Constraints (TOC): throughput accounting measures, derived measures and decision priority. Lean Production (Vorne Industries). https://www.leanproduction.com/theory-of-constraints/
23. (S) Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
24. Gray, Virginia; Felan, Joe; Umble, Elisabeth; Umble, Michael: A comparison of drum-buffer-rope (DBR) and critical chain (CC) buffering techniques. Paper presented at PMI Research Conference 2000, Paris. Project Management Institute. https://www.pmi.org/learning/library/drum-buffer-rope-critical-chain-buffering-8526
25. Occupational Safety and Health Administration (OSHA): 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
26. iFAKT GmbH: Polaris Optimizer (vendor page; site navigation also lists Simulator and Value Stream Mapping). https://www.ifakt.de/en/solutions/optimizer
27. National Institute of Standards and Technology (NIST): Malcolm Baldrige National Quality Award 1988 recipient profile, Motorola Inc. ("Six Sigma Quality"). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
28. PwC Viewpoint: Inventory guide, section 1.3 Cost (definition of inventory cost as the sum of applicable expenditures and charges directly or indirectly incurred; references ASC 330-10-30-3 to 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html (accessed November 20, 2026)
29. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (fixed production overhead allocated based on normal capacity; ASC 330-10-30-6 on abnormally low production). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf (accessed November 20, 2026)
