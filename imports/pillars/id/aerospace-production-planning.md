# SEO metadata

| Field | Value |
|---|---|
| Meta title | Perencanaan Produksi Dirgantara: Panduan Lengkap Pemasok |
| Meta description | Perencanaan produksi dirgantara dijelaskan: AS9100, FAA Bagian 21/145, ketertelusuran, kurva pembelajaran, peningkatan laju, APS dan perencanaan MRO, dengan contoh. |
| Slug | `aerospace-production-planning` |

# Perencanaan Produksi Dirgantara: Panduan Lengkap untuk Pemasok dan Bengkel MRO

*Per 20 November 2026 · Berdasarkan data industri dan perusahaan, standar IAQG/SAE, regulasi FAA dan EASA, serta literatur teknis (lihat Sumber)*

> **Jawaban singkat:** Perencanaan produksi dirgantara berarti menyelaraskan laju permintaan pelanggan dengan kapasitas yang terbatas, waktu tunggu yang panjang, proses khusus yang tersertifikasi, dan ketertelusuran yang lengkap. Berbeda dengan industri volume tinggi, tidak cukup hanya memenuhi tanggal. Anda juga harus membuktikan bagaimana suku cadang dibuat: setiap suku cadang memerlukan asal-usul yang terdokumentasi, konfigurasi yang dirilis, dan proses yang terkendali, dan bukti tersebut harus direncanakan sama seperti jam mesin.

Selasa pagi di pemasok Tier 2 untuk suku cadang struktural. Pelanggan telah menaikkan jadwal rilis kuartal depan sebesar seperlima karena produsen pesawat meningkatkan lajunya. Sel mesin lima sumbu sudah beroperasi tiga shift. Perlakuan panas dialihdayakan ke prosesor eksternal yang terakreditasi Nadcap dengan waktu tunggu tiga minggu. Perubahan rekayasa baru saja datang untuk dua nomor suku cadang, yang memicu inspeksi artikel pertama parsial. Dan sejak kemarin, departemen mutu sedang mencari sertifikat material untuk satu lot panas titanium karena seorang pelanggan memiliki pertanyaan tentang lot yang sudah dikirim.

Setiap tugas ini bisa diselesaikan secara terpisah. Kesulitannya, semuanya masuk ke dalam rencana yang sama pada waktu yang sama. Di situlah perencanaan produksi dirgantara berbeda dari perencanaan di banyak industri lain: ia merencanakan bukan hanya kuantitas dan tanggal, tetapi juga bukti, persetujuan, dan konfigurasi. Dan itu dilakukan di pasar tempat buku pesanan produsen pesawat penuh selama bertahun-tahun sementara rantai pasok macet di beberapa titik sekaligus.

Panduan ini ditulis untuk manajer pabrik, manajer perencanaan dan penjadwalan, serta manajer mutu di pemasok dirgantara, dan untuk perencana di bengkel pemeliharaan, perbaikan, dan overhaul (MRO) serta stasiun perbaikan. Pembaca yang mencari penjadwalan produksi dirgantara akan menemukan sisi penjadwalan (kapasitas terbatas, APS, pengendalian bottleneck) di Bagian 5, 10, dan 11. Panduan ini mencakup situasi pasar pada 2026 dengan angka yang bersumber, apa yang membuat industri ini berbeda, standar dan regulasi yang relevan di kedua sisi Atlantik (FAA dan EASA), ketertelusuran dan genealogi, kurva belajar Wright dengan contoh kerja, cara merencanakan peningkatan laju, perencanaan kapasitas dengan APS dan simulasi, perencanaan MRO dengan temuan tak terjadwal, KPI, pendekatan langkah demi langkah, dan kesalahan umum. Pengantar singkat tentang keterkaitan antara waktu tunggu dan ketertelusuran juga tersedia dalam posting [Aerospace production planning: lead time and traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) di m365.fm.

Catatan tentang konteks Eropa: versi asli panduan ini ditulis untuk pemasok Jerman, dan sebagian besar rantai pasok global untuk Airbus melewati Eropa. Jika aturan Eropa (EASA, standar EN) penting bagi perusahaan AS, misalnya saat memasok pelanggan Eropa atau memegang persetujuan ganda FAA/EASA, panduan ini menjelaskannya berdampingan dengan padanan AS-nya.

### Poin-poin utama

- **Permintaan ada, kapasitas belum.** Airbus memiliki backlog 9.310 pesawat komersial pada akhir September 2026 [3]; Boeing melaporkan backlog komersial lebih dari 6.300 pesawat pada tanggal yang sama [47]. Laju produksi naik lebih lambat dari rencana karena mesin, coran dan tempa, bahan baku, serta tenaga kerja terampil kekurangan [4][10].
- **Perencanaan di sini berarti perencanaan dengan beban pembuktian.** AS9100D antara lain mensyaratkan manajemen konfigurasi, ketertelusuran, dan pencegahan suku cadang palsu [14][44]. Pemegang persetujuan produksi FAA harus menjalankan sistem mutu yang mencakup pengendalian pemasok, catatan mutu, dan lolosnya cacat mutu (quality escape) [41]. Setiap perubahan desain dapat memicu inspeksi artikel pertama penuh atau parsial menurut AS9102 [18][46].
- **Waktu tunggu (lead time) sebagian besar adalah waktu menunggu.** Hukum Little menyatakan: lead time = persediaan barang dalam proses ÷ throughput [27]. Di luar proses khusus, loop inspeksi dan persetujuan adalah sumber penungguan yang lazim.
- **Kurva belajar adalah masukan perencanaan.** Wright menunjukkan pada 1936 bahwa jam kerja per pesawat turun sekitar 20 % setiap kali output kumulatif berlipat dua [24][25]. Jika Anda merencanakan peluncuran dengan jam standar laju matang, Anda merencanakan kapasitas terlalu sedikit.
- **Peningkatan produksi gagal di titik hambatan, bukan rata-rata.** Kenaikan laju 20 % memukul sumber daya yang beroperasi pada utilisasi 85 % jauh lebih keras daripada yang ditunjukkan total kapasitas.
- **Perencanaan MRO harus memperhitungkan hal yang tidak diketahui.** Cakupan kunjungan bengkel baru diketahui setelah inspeksi. Perencanaan MRO yang baik bekerja dengan probabilitas temuan, penyangga, dan ketersediaan suku cadang.
- **Tidak ada algoritma yang memperbaiki data master yang buruk.** APS, simulasi, dan digital twin membutuhkan rute produksi, waktu standar, kapasitas, dan data sertifikasi yang benar.

### Jalur baca cepat

| Anda adalah … | Baca lebih dulu |
|---|---|
| Manajer pabrik pemasok yang menghadapi kenaikan laju produksi | Bagian 1, 9 dan 10 (pasar, kurva belajar, ramp-up dengan daftar periksa) |
| Perencana produksi atau penjadwal dengan rencana ERP yang tidak realistis | Bagian 5, 6 dan 11 (tingkat perencanaan, lead time, APS dan simulasi) |
| Manajer mutu | Bagian 3, 4 dan 8 (standar dan regulasi, ketertelusuran, perubahan rekayasa) |
| Perencana MRO di stasiun perbaikan | Bagian 3, 4 dan 13 (Part 145, suku cadang dengan batas usia pakai, perencanaan MRO) |
| Pimpinan TI, digital, atau keamanan siber | Bagian 3.6, 4, 11, 14 dan 16 (ITAR/CMMC, model data, APS, digital twin, pendekatan) |

## Daftar isi

1. [Pasar 2026: mengapa perencanaan menjadi hambatan](#1-pasar-2026-mengapa-perencanaan-menjadi-hambatan)
2. [Apa yang membedakan perencanaan produksi dirgantara dari industri lain](#2-apa-yang-membuat-perencanaan-produksi-dirgantara-berbeda-dari-industri-lain)
3. [Standar dan regulasi yang penting untuk perencanaan](#3-standar-dan-regulasi-yang-penting-untuk-perencanaan)
4. [Ketertelusuran dan genealogi](#4-traceability-dan-genealogy)
5. [Tingkat perencanaan: dari laju pelanggan hingga operasi](#5-tingkat-perencanaan-dari-rate-pelanggan-hingga-operasi)
6. [Memahami dan mengurangi lead time](#6-memahami-dan-mengurangi-lead-time)
7. [Perencanaan proses khusus dan operasi outsourcing](#7-perencanaan-proses-khusus-dan-operasi-pihak-luar)
8. [Perubahan teknik dan manajemen konfigurasi](#8-perubahan-rekayasa-dan-manajemen-konfigurasi)
9. [Kurva pembelajaran Wright: teori dan contoh perhitungan](#9-kurva-pembelajaran-wright-teori-dan-contoh-kerja)
10. [Merencanakan kenaikan laju produksi: perhitungan dan daftar periksa](#10-perencanaan-kenaikan-laju-perhitungan-dan-daftar-periksa)
11. [Perencanaan kapasitas dengan APS, manajemen bottleneck, dan simulasi](#11-perencanaan-kapasitas-dengan-aps-manajemen-bottleneck-dan-simulasi)
12. [Risiko rantai pasok 2022 hingga 2026 dan implikasinya bagi perencanaan](#12-risiko-rantai-pasok-2022-hingga-2026-dan-implikasinya-bagi-perencanaan)
13. [Perencanaan MRO: pemeliharaan dengan temuan tak terduga](#13-perencanaan-mro-pemeliharaan-dengan-temuan-tak-terduga)
14. [Digital twin dan digital thread](#14-kembaran-digital-dan-benang-digital)
15. [KPI untuk perencanaan dan pengendalian](#15-kpi-untuk-perencanaan-dan-pengendalian)
16. [Pendekatan: enam langkah menuju rencana yang andal](#16-pendekatan-enam-langkah-menuju-perencanaan-yang-andal)
17. [Kesalahan umum dan cara menghindarinya](#17-kesalahan-umum-dan-cara-menghindarinya)
18. [iFAKT dan dirgantara](#18-ifakt-dan-kedirgantaraan)
19. [Glosarium](#19-glosarium)
20. [FAQ: pertanyaan umum tentang perencanaan produksi dirgantara](#20-faq-pertanyaan-umum-tentang-perencanaan-produksi-dirgantara)
21. [Kesimpulan](#21-kesimpulan)

## 1. Pasar 2026: mengapa perencanaan menjadi hambatan

### 1.1 Permintaan rekor, kapasitas pengiriman yang terbatas

Penerbangan komersial berada dalam situasi yang tidak biasa: permintaan pesawat baru belum pernah setinggi ini, tetapi industri tidak mampu mengirim sesuai laju yang diinginkan pelanggan. Menurut studi yang dipresentasikan asosiasi maskapai IATA bersama Oliver Wyman pada Oktober 2025, backlog global pesawat komersial mencapai rekor lebih dari 17.000 pesawat pada 2024. Antara 2010 dan 2019 rata-ratanya sekitar 13.000 [9]. Studi tersebut memperkirakan keterlambatan pengiriman merugikan maskapai lebih dari $11 miliar pada 2025. Pos terbesarnya adalah konsumsi bahan bakar berlebih dari pesawat lama (sekitar $4,2 miliar), tambahan pemeliharaan ($3,1 miliar), sewa mesin ($2,6 miliar), dan persediaan suku cadang yang lebih tinggi ($1,4 miliar) [9].

Angka dari dua produsen besar memperlihatkan gambaran rincinya:

| Metrik | Airbus | Boeing |
|---|---|---|
| Pengiriman 2025 | 793 pesawat komersial, di antaranya 607 keluarga A320 [2] | 600 pesawat terbang komersial, di antaranya 447 Boeing 737 [6] |
| Backlog | 8.754 pada akhir 2025 [2]; 9.310 pada akhir September 2026 [3] | lebih dari 6.100 pada akhir 2025, bernilai sekitar $567 miliar [6]; lebih dari 6.300 pada akhir September 2026, bernilai $611,8 miliar [47] |
| Target 2026 | sekitar 870 pengiriman [3] | tidak ada perkiraan unit dalam sumber yang dikutip |
| Status 2026 | 547 pengiriman hingga 30 September [3]; 621 hingga akhir Oktober [5] | 161 pengiriman pada Q3 2026, di antaranya 124 Boeing 737 [47]; program 737 masih berkembang menuju produksi stabil 47 per bulan; 787 stabil pada 8 per bulan [47] |

### 1.2 Target laju dan mengapa terus bergeser

Bagi pemasok, laju bulanan produsen pesawat adalah masukan perencanaan yang paling penting, karena laju ini menggerakkan pelepasan pesanan di setiap tingkat rantai pasok. Dalam laporannya tentang sembilan bulan pertama 2026, Airbus menyatakan target berikut: 70 hingga 75 pesawat keluarga A320 per bulan pada akhir 2027, kemudian stabil pada laju 75; laju 12 untuk A350 pada 2028; laju 13 untuk A220 pada 2028; dan laju 5 untuk A330 pada 2029 [3].

Sejarah target "rate 75" menunjukkan betapa mudahnya asumsi semacam ini berubah. Airbus awalnya ingin mencapai rate ini pada 2025 hingga 2026. Pada akhir 2024 target itu bergeser ke 2027 [4]. Pada April 2026, CEO Airbus Guillaume Faury secara terbuka menyalahkan Pratt & Whitney karena tidak mengirimkan jumlah mesin yang dipesan, dan berbicara tentang kekurangan pasokan yang tidak sesuai dengan permintaan maupun pesanan [4]. Media industri menganggap kemungkinan target rate 75 mundur ke 2028 [4]. Kisaran target 70 hingga 75 pada akhir 2027 mencerminkan status per 28 Oktober 2026 [3].

Di Boeing, FAA membatasi produksi 737 MAX pada 38 pesawat per bulan setelah insiden lepasnya door plug pada penerbangan Alaska Airlines pada Januari 2024. Pada Oktober 2025 FAA menyetujui kenaikan menjadi 42 [7]. Pada Mei 2026, CEO Boeing Kelly Ortberg mengatakan lini produksi kini berjalan pada rate 47; ia menggambarkan langkah berikutnya menuju 52 sebagai beban yang lebih berat karena tingkat persediaan dalam rantai pasok [8]. Rilis kuartal ketiga Boeing tanggal 27 Oktober 2026 menggambarkan program 737 yang masih berproses menuju produksi stabil 47 per bulan [47].

**Apa artinya bagi perencanaan Anda:** Target rate bukanlah komitmen. Target itu adalah asumsi perencanaan dengan ketidakpastian yang signifikan. Pemasok yang membangun kapasitas semata-mata sesuai target resmi berisiko menanggung biaya menganggur. Pemasok yang membangun terlambat justru menjadi hambatan itu sendiri, dalam industri di mana satu suku cadang yang hilang dapat menahan seluruh pesawat. Perencanaan yang tangguh karena itu bekerja dengan skenario (misalnya rate 60, 67 dan 75) serta dengan pemicu investasi yang ditetapkan sebelumnya.

### 1.3 Industri dalam angka: Amerika Serikat dan Jerman

Industri dirgantara dan pertahanan Amerika Serikat adalah yang terbesar di dunia. Menurut Aerospace Industries Association (AIA) dan S&P Global Market Intelligence, industri ini mencatat total penjualan sebesar $988,6 miliar pada 2025 (AIA menempatkan total aktivitas usaha pada $1 triliun) dan menopang sekitar 2,1 juta lapangan kerja. Sekitar 1,1 juta dari lapangan kerja tersebut dan hampir $483 miliar aktivitas berada dalam rantai pasok domestik. Ekspor mencapai $172,7 miliar, naik 25 % year over year [48]. Dengan kata lain, sekitar separuh lapangan kerja berada pada pemasok, dan kelompok inilah yang menjadi sasaran panduan ini.

Jerman adalah bagian yang lebih kecil namun penting dari rantai pasok Airbus, dan merupakan pasar asal versi awal panduan ini. Asosiasi Industri Dirgantara Jerman (BDLI) melaporkan angka rekor pada Mei 2026: pendapatan EUR 62 miliar pada 2025 (2024: EUR 52 miliar, naik 19 %) dan 130.000 karyawan (tahun sebelumnya: 120.000). Penerbangan sipil adalah segmen terbesar dengan pendapatan EUR 45 miliar (naik 15 %), disusul penerbangan militer dengan EUR 13,5 miliar (naik 35 %) dan antariksa dengan EUR 3,5 miliar. Pangsa ekspor adalah 66 %, dan belanja riset dan pengembangan sekitar EUR 4 miliar [1].

Di balik angka-angka ini, di kedua sisi Atlantik, terdapat banyak pemasok kecil dan menengah di samping OEM dan rumah sistem besar. Mereka membuat komponen struktural, komponen kabin, suku cadang mesin, sistem dan proses khusus, atau menyediakan layanan pemeliharaan. Bagi perusahaan-perusahaan ini khususnya, peralihan dari utilisasi rendah (2020 hingga 2022) ke beban berlebih yang berkelanjutan merupakan tantangan perencanaan.

### 1.4 Sudut pandang pemasok: apa yang ditunjukkan survei

Perusahaan konsultan Roland Berger menyurvei 95 perusahaan dalam rantai pasok dirgantara pada awal 2026 [10]. Hasilnya penting bagi siapa pun yang bertanggung jawab atas perencanaan:

- 55 % perusahaan melaporkan gangguan rantai pasok (2025: 64 %).
- Sekitar 80 % melihat risiko sedang hingga tinggi terhadap kelangkaan bahan baku kritis; titanium, baja, tembaga, logam tanah jarang dan magnet paling sering disebut.
- 56 % melaporkan kekurangan staf yang berkualifikasi (tahun sebelumnya: 65 %). Ini tetap menjadi penghambat paling umum bagi peningkatan produksi.
- Hampir 40 % kekurangan kapasitas produksi.
- Sekitar sepertiga beroperasi dengan margin EBIT di bawah 5 %, dan 40 % menumpuk persediaan yang lebih tinggi untuk dimulainya produksi, yang menambah tekanan pada margin.
- Waktu tunggu yang panjang tidak hanya memengaruhi material, tetapi juga layanan seperti pengujian, perlakuan permukaan dan penyelesaian akhir.

Sebuah survei sebelumnya menunjuk ke arah yang sama dari sudut pandang perencanaan. Dalam penilaian kesiapan laju produksi terhadap lebih dari 100 pemasok di Asia, Eropa, dan AS, konsultan Vendigital menemukan bahwa 38 % memiliki proses perencanaan kapasitas yang tidak memadai. Mereka menyebut kekurangan keterampilan, kondisi pabrik dan mesin yang tidak diketahui, program pemeliharaan yang terabaikan, serta komunikasi yang buruk antara perencana senior dan lantai produksi sebagai penyebabnya [55]. Artikel tersebut tidak mencantumkan tanggal terbit; artikel itu merujuk pada rencana Airbus tahun 2021 untuk mencapai laju 75 pada tahun 2025, sehingga datanya sudah beberapa tahun usianya.

Poin terakhir dalam daftar Roland Berger adalah yang paling penting bagi perencanaan: proses khusus dan inspeksi itu sendiri telah menjadi hambatan (bottleneck) di banyak rantai pasok. Bagian 7 membahas cara menanganinya.

## 2. Apa yang membuat perencanaan produksi dirgantara berbeda dari industri lain

Banyak prinsip perencanaan berlaku untuk manufaktur diskrit apa pun. Namun, dirgantara memadukan beberapa karakteristik yang masing-masing sudah dikenal, tetapi jika digabungkan memerlukan logika perencanaan tersendiri.

### 2.1 Bauran tinggi, volume rendah, dan banyak varian

Pemasok dirgantara biasanya membuat banyak nomor part dalam jumlah kecil. Bahkan pada laju 75 pesawat per bulan, itu berarti sekitar 3,5 pesawat per hari kerja (dengan sekitar 21 hari kerja per bulan). Sebuah part yang dipasang sekali per pesawat karenanya memiliki jumlah harian dalam satuan digit tunggal. Tambahkan varian khusus pelanggan (konfigurasi kabin), permintaan suku cadang, dan part untuk model lama. Hasilnya adalah lingkungan high-mix, low-volume (HMLV) yang mana setup, pergantian program, dan upaya inspeksi menyerap sebagian besar kapasitas.

### 2.2 Lead time panjang dan bill of materials yang dalam

Sebuah part struktural titanium dapat memakan waktu berminggu-minggu antara bahan baku dan pengiriman: penempaan atau pengecoran, pemesinan kasar, perlakuan panas, pemesinan akhir, pengujian tak merusak (NDT), perlakuan permukaan, inspeksi akhir. Beberapa langkah ini sering dilakukan oleh spesialis luar. Bill of materials dari rakitan besar tersusun sangat bertingkat; pesawat terdiri dari jutaan part yang disatukan melintasi banyak tingkat pemasok. Konsekuensinya: keterlambatan di tingkat bawah sering baru muncul berminggu-minggu kemudian di lini perakitan akhir. Jika Anda tidak memahami dan secara aktif mengelola [lead time](https://www.m365.fm/entity/lead-time/), Anda sedang merencanakan dengan penyangga yang tidak Anda ketahui.

### 2.3 Sertifikasi, kualifikasi, dan bukti

Dalam dirgantara, tidak cukup membuat part sesuai dimensi. Part harus dibuat dengan proses yang telah dirilis, pada peralatan yang terkualifikasi, oleh personel yang terkualifikasi, dari material bersertifikat, dan dalam konfigurasi yang telah dirilis, dan semua itu harus terdokumentasi. Ini memiliki konsekuensi langsung bagi perencanaan: sebuah pesanan tidak bisa begitu saja dipindahkan ke mesin yang sedang kosong tetapi belum terkualifikasi. Karyawan tanpa kualifikasi yang berlaku untuk proses khusus bukanlah kapasitas dari sudut pandang perencanaan. Pergantian pemasok dapat memerlukan inspeksi artikel pertama yang baru.

### 2.4 Logika laju, bukan logika ukuran lot

Produsen pesawat merencanakan dalam laju bulanan yang diumumkan bertahun-tahun sebelumnya dan dinaikkan secara bertahap. Pemasok harus menerjemahkan laju ini ke dalam lot produksinya sendiri tanpa kehilangan ritme pelanggannya. Pada saat yang sama, kenaikan laju jarang berlangsung mulus: pelanggan membangun persediaan, menunda rilis, atau mempercepatnya. Oleh karena itu, perencanaan yang baik memisahkan laju pelanggan (apa yang dibutuhkan pelanggan dalam jangka panjang) dari rilis (apa yang dipesan pelanggan dalam jangka pendek) dan melacak selisihnya.

### 2.5 Siklus hidup produk yang panjang

Sebuah tipe pesawat sering dibangun selama puluhan tahun dan dioperasikan lebih lama lagi. Artinya, revisi gambar, spesifikasi material, dan persetujuan proses tetap berlaku untuk waktu yang lama tetapi terus berubah. Suku cadang untuk konfigurasi lama harus tetap tersedia. Dan catatan harus disimpan dalam jangka waktu yang sangat panjang. Berdasarkan aturan FAA, pemegang persetujuan produksi harus menyimpan catatan kualitas selama minimal 5 tahun untuk produk dan artikel yang dibuat di bawah persetujuan tersebut, dan minimal 10 tahun untuk komponen kritis [41]; persyaratan pelanggan sering kali lebih jauh dari itu. Dalam praktiknya, periode retensi mengikuti persyaratan turunan dari pelanggan dan peraturan yang berlaku.

### 2.6 Biaya tinggi dari sebuah kesalahan

Produk cacat yang sampai ke pelanggan (escape) dapat memicu pengerjaan ulang di lini perakitan akhir, inspeksi ulang pesawat yang sudah dikirim, atau dalam kasus ekstrem, penghentian operasi (grounding). FAA memperlakukan hal ini sebagai topik sistem mutu tersendiri: 14 CFR 21.137 mencantumkan "quality escapes" sebagai salah satu elemen wajib dalam sistem mutu pemegang persetujuan produksi [41]. Mesin GTF Pratt & Whitney menunjukkan apa yang dapat ditimbulkan oleh cacat material (Bagian 12). Untuk perencanaan, ini berarti: inspeksi mutu bukanlah penyangga yang dapat dipangkas ketika jadwal ketat. Inspeksi merupakan bagian tetap dari routing.

## 3. Standar dan regulasi yang penting untuk perencanaan

### 3.1 Gambaran umum keluarga standar IAQG

International Aerospace Quality Group (IAQG) menyusun standar mutu industri dirgantara. Standar tersebut dipublikasikan di Amerika sebagai standar AS (oleh SAE International), di Eropa sebagai standar EN, dan di Asia sebagai standar JISQ; isinya identik. Standar inti adalah 9100, yang dilengkapi standar untuk organisasi pemeliharaan (9110), distributor (9120), inspeksi artikel pertama (9102), manajemen variasi karakteristik kunci (9103), dan lainnya [13]. Di AS, penomoran AS yang biasa dijumpai adalah AS9100D, AS9102C, AS9145; pelanggan dan dokumen Eropa menggunakan EN 9100 dan seterusnya. Semuanya merujuk pada persyaratan yang sama.

Di sisi regulasi, dua sistem penting bagi sebagian besar pemasok: Federal Aviation Administration (FAA) Amerika Serikat, yang aturannya termuat dalam Title 14 of the Code of Federal Regulations (14 CFR), dan European Union Aviation Safety Agency (EASA). Yang membingungkan, keduanya memiliki "Part 21" dan "Part 145", dan dalam kedua sistem Subpart G dari Part 21 mencakup persetujuan produksi. Tujuannya serupa tetapi isinya tidak identik.

Tabel berikut merangkum hal-hal yang perlu diketahui oleh manajer perencanaan:

| Standar / regulasi | Isi | Dampak pada perencanaan |
|---|---|---|
| **AS9100D** (EN 9100:2018, JISQ 9100:2016) | Sistem manajemen mutu untuk penerbangan, antariksa dan pertahanan; mencakup ISO 9001:2015 ditambah sekitar 105 persyaratan tambahan khusus industri, termasuk manajemen konfigurasi, manajemen risiko, keselamatan produk, pencegahan suku cadang palsu, ketertelusuran dan pengiriman tepat waktu [14][44] | Pengiriman tepat waktu menjadi metrik yang diaudit; ketertelusuran material, proses, perkakas dan personel harus mengikuti aliran order [14] |
| **AS9102C** (2023; EN 9102:2024) | First article inspection (FAI): verifikasi lengkap terhadap part pertama dari proses produksi terhadap seluruh karakteristik desain [17][18][46] | Rencanakan upaya FAI sebagai operasi tersendiri; perubahan pada desain, material, sumber, proses, perkakas atau lokasi, serta jeda produksi lebih dari dua tahun, memicu FAI penuh atau sebagian [18][34] |
| **AS9103 / EN 9103:2023** | Manajemen variasi karakteristik kunci [19] | Karakteristik kunci memerlukan studi kemampuan proses dan peta kendali; hal ini menyerap kapasitas inspeksi dan memengaruhi ukuran lot serta frekuensi inspeksi |
| **AS9145** (2016; EN 9145:2018) | Advanced Product Quality Planning (APQP) dan Production Part Approval Process (PPAP) untuk penerbangan, lima fase dari perencanaan hingga produksi berkelanjutan [16][35][45] | Kesiapan produksi harus dibuktikan pada laju yang disyaratkan pelanggan (production readiness review, run pada laju); perencanaan peluncuran dan bukti kapasitas menjadi bagian dari persetujuan [35] |
| **AS9110 / EN 9110:2018** | Sistem manajemen mutu untuk organisasi pemeliharaan penerbangan [20] | Menambahkan persyaratan sistem mutu untuk Part 145; relevan untuk proses perencanaan, kendali pemasok dan KPI di MRO |
| **AS9120 / EN 9120** | Sistem manajemen mutu untuk distributor dan stockist [13][14] | Ketertelusuran dan rantai sertifikat untuk suku cadang standar dan bahan baku yang dibeli |
| **Nadcap** | Program akreditasi yang dikelola industri untuk proses khusus, didirikan pada 1990 di bawah SAE dan dikelola oleh Performance Review Institute (PRI); bidangnya meliputi heat treating, chemical processing, NDT, welding, coatings dan composites [21][54] | Banyak pelanggan hanya mengizinkan bengkel terakreditasi untuk melakukan proses khusus; hal ini membatasi pilihan sumber dan sering menjadikan proses khusus sebagai bottleneck |
| **FAA 14 CFR Part 21, Subpart G** (sertifikat produksi); juga Subpart K (Parts Manufacturer Approval, PMA) dan Subpart O (otorisasi TSO) | Persetujuan produksi; 14 CFR 21.137 mewajibkan sistem mutu tertulis dengan 14 elemen, termasuk kendali data desain, kendali pemasok, kendali proses manufaktur, kendali produk tidak sesuai, catatan mutu dan quality escape [41] | Pemegang persetujuan mengendalikan pemasoknya; catatan harus disimpan minimal 5 tahun (10 tahun untuk komponen kritis) [41]. Sebagian besar pemasok Tier 2 dan Tier 3 tidak memegang persetujuan produksi sendiri tetapi bekerja di bawah kendali pemasok pelanggan mereka |
| **FAA 14 CFR Part 145** | Sertifikat stasiun perbaikan; hanya bekerja dalam rating dan operations specifications, dengan data pemeliharaan terkini, program pelatihan yang disetujui FAA dan catatan yang disimpan minimal 2 tahun [42] | Perencanaan hanya dapat menugaskan pekerjaan yang sesuai dengan rating stasiun, kepada staf terlatih, dengan manual dan data terkini tersedia |
| **EASA Part 21 Subpart G** | Production Organisation Approval (POA) di Uni Eropa [22] | Pemegang persetujuan melepas part dengan EASA Form 1 dan mengawasi pemasoknya; proses dan staf harus sesuai dengan persetujuan. Relevan untuk pemasok AS ke pelanggan Eropa |
| **EASA Part 145** | Persetujuan organisasi pemeliharaan (Annex II Regulasi (EU) No 1321/2014) [23] | Bekerja hanya dalam lingkup yang disetujui (rating), dengan staf bersertifikat dan data pemeliharaan yang valid. Fasilitas yang memegang persetujuan FAA dan EASA sekaligus dapat menerbitkan dual release pada FAA Form 8130-3 [43] |
| **EASA Part-CAMO** | Continuing airworthiness management organization, diperkenalkan oleh Regulasi (EU) 2019/1383 [23] | Merencanakan program pemeliharaan, airworthiness directive dan life-limited part di Eropa serta menyerahkan paket pekerjaan ke MRO |
| **ITAR / EAR** (AS) | Kontrol ekspor untuk defense article (ITAR, 22 CFR 120–130) dan item dual-use (EAR, 15 CFR 730–774) [36] | Akses ke data teknis dan part dapat dibatasi berdasarkan orang dan lokasi; hal ini juga berlaku untuk sistem perencanaan dan TI |
| **DFARS / CMMC 2.0** (program pertahanan AS) | Cybersecurity Maturity Model Certification; klausul DFARS 252.204-7021 berlaku sejak 10 November 2025, diterapkan bertahap selama tiga tahun; aturan program 32 CFR Part 170 [49][50] | Pemasok yang memproses federal contract information (FCI) atau controlled unclassified information (CUI) dalam sistem perencanaan, ERP atau MES mereka memerlukan tingkat CMMC yang disyaratkan; prime harus memeriksa status CMMC subkontraktor sebelum penghargaan kontrak [49] |
| **DFARS 252.225-7009** (logam khusus) | Logam khusus, termasuk titanium dan paduan titanium, dalam item yang dikirim berdasarkan kontrak DoD harus dilebur atau diproduksi di AS atau negara yang memenuhi syarat; diteruskan ke subkontrak untuk item yang mengandung logam khusus [51] | Perencanaan material harus melacak asal peleburan per heat lot, bukan hanya paduan dan jumlah; lot yang lebih murah atau lebih cepat dari sumber yang tidak memenuhi syarat mungkin tidak dapat digunakan |

### 3.2 AS9100 secara rinci: apa arti standar ini bagi perencanaan

AS9100D mengadopsi struktur ISO 9001 dan menambahkan persyaratan yang langsung menjangkau perencanaan [44]. Tiga di antaranya sangat penting.

**Manajemen konfigurasi.** Anda harus mengetahui setiap saat revisi desain mana yang berlaku untuk pesanan mana dan revisi mana yang benar-benar dibuat. Hal ini memengaruhi pelepasan pesanan (hanya melepaskan revisi yang valid), penanganan pesanan terbuka ketika perubahan masuk, dan dokumentasi penyimpangan.

**Ketertelusuran.** Standar ini mewajibkan ketertelusuran semua bahan baku, material dan proses yang digunakan, serta perkakas dan orang [14]. Untuk perencanaan, ini berarti setiap konfirmasi operasi setidaknya harus mencatat siapa yang bekerja, kapan, pada mesin mana, dengan material apa dan pada revisi proses yang mana. Bagian 4 membahasnya lebih dalam.

**Pengiriman tepat waktu.** AS9100 secara eksplisit menyebut pengiriman tepat waktu sebagai persyaratan [14]. Pelanggan menilai pemasoknya berdasarkan pengiriman tepat waktu (OTD) dan kualitas. OTD yang buruk karena itu bukan hanya masalah komersial, tetapi juga masalah audit.

### 3.3 Persetujuan produksi FAA: apa arti 14 CFR 21.137 bagi perencana

Jika Anda memegang sertifikat produksi FAA atau Persetujuan Pembuat Suku Cadang (pemegang PMA harus memenuhi persyaratan sistem mutu yang sama berdasarkan 14 CFR 21.307), atau jika Anda memasok kepada pemegang seperti itu, persyaratan sistem mutu dalam 14 CFR 21.137 membentuk perencanaan Anda [41]. Peraturan ini mewajibkan setiap pemohon atau pemegang sertifikat produksi untuk membangun sistem mutu tertulis "yang memastikan setiap produk dan artikel sesuai dengan desain yang disetujui dan berada dalam kondisi aman untuk dioperasikan" [41]. Ke-14 elemennya terbaca seperti daftar periksa untuk proses perencanaan yang berfungsi:

- **Pengendalian data desain dan pengendalian dokumen:** hanya revisi terkini yang telah disetujui boleh dilepaskan ke lantai produksi.
- **Pengendalian pemasok:** prosedur yang memastikan setiap produk, artikel, atau layanan yang disediakan pemasok sesuai dengan persyaratan pemegang persetujuan, ditambah proses pelaporan untuk ketidaksesuaian yang ditemukan setelah pelepasan [41].
- **Pengendalian proses manufaktur, pemeriksaan dan pengujian, status pemeriksaan dan pengujian:** routing harus menunjukkan pemeriksaan mana yang dilakukan di mana, dan status setiap bagian harus terlihat.
- **Pengendalian produk tidak sesuai dan tindakan korektif:** skrap, pengerjaan ulang dan penyimpangan harus direncanakan dan didokumentasikan, tidak ditangani secara informal.
- **Pengendalian catatan mutu:** minimal 5 tahun untuk produk dan artikel, minimal 10 tahun untuk komponen kritis [41].
- **Umpan balik dari layanan lapangan dan lolos mutu:** temuan dari lapangan dan lolosnya cacat kembali mengalir ke dalam sistem.

Bagi pemasok Tier 2 atau Tier 3 yang tidak memiliki persetujuan sendiri, persyaratan ini datang sebagai flow-down dalam purchase order pelanggan dan manual mutu pemasok. Konsekuensi bagi perencanaan tetap sama: bukti harus dihasilkan dalam alur pesanan, bukan disusun ulang setelahnya.

### 3.4 Prospek: AS9100D menjadi IA9100

IAQG sedang mengerjakan revisi 9100 yang akan diterbitkan sebagai IA9100. Nama baru ini dimaksudkan untuk menyatukan penamaan regional (AS, EN, JISQ). Per pertengahan Oktober 2026, menurut tinjauan atas informasi yang tersedia, belum ada publikasi resmi dan tidak ada tanggal yang terkonfirmasi; perkiraan berkisar dari akhir 2026 hingga awal 2027. Masa transisi untuk sertifikat juga belum ditetapkan [15]. Hingga saat itu, AS9100D (EN 9100:2018) tetap menjadi edisi yang berlaku, dan sertifikat yang ada tetap berlaku [15]. Rencanakan transisi sebagai proyek tersendiri setelah IAQG menerbitkan standar tersebut, dan sepakati waktunya dengan registrar Anda.

### 3.5 AS9145: membuktikan kesiapan produksi pada laju pelanggan

AS9145 membawa APQP dan PPAP, metode yang familiar dari industri otomotif, ke dunia aerospace [45]. Standar ini menyusun jalur menuju produksi dalam lima fase: perencanaan; desain dan pengembangan produk; desain dan pengembangan proses; validasi produk dan proses; serta produksi berkelanjutan, penggunaan, dan layanan pasca-pengiriman [35]. Paket PPAP antara lain mencakup catatan desain, diagram alir proses, FMEA proses, rencana pengendalian, analisis sistem pengukuran, studi kemampuan proses awal, dan laporan inspeksi artikel pertama (FAIR) [35].

Fase 3 dan 4 menentukan untuk perencanaan. Pada fase 3, kesiapan produksi dinilai dalam production readiness review, dan proses harus memenuhi persyaratan pada laju permintaan pelanggan. Pada fase 4, run produksi harus menunjukkan bahwa proses menghasilkan part yang sesuai pada laju pelanggan [35]. Dengan kata lain: bukti kapasitas merupakan bagian dari persetujuan. Jika kapasitas Anda hanya ada di atas kertas, di sinilah hal itu akan terlihat.

### 3.6 Program pertahanan: CMMC 2.0, kontrol ekspor, dan logam khusus

Banyak pemasok aerospace melayani pelanggan komersial dan pertahanan sekaligus, sering kali pada mesin dan sistem ERP yang sama. Tiga persyaratan AS berikut kemudian memengaruhi perencanaan:

- **CMMC 2.0.** Aturan DFARS "Assessing Contractor Implementation of Cybersecurity Requirements" berlaku sejak 10 November 2025. Aturan ini menambahkan klausul 252.204-7021 dan menerapkan persyaratan CMMC secara bertahap selama lebih dari tiga tahun; aturan program yang mendasarinya, 32 CFR Part 170, berlaku sejak 16 Desember 2024 [49]. Model ini memiliki tiga level dan selaras dengan NIST SP 800-171 [50]. Flow-down ke subkontraktor berlaku ketika subkontrak melibatkan FCI atau CUI, dan prime harus memastikan status CMMC terkini subkontraktor sebelum award [49]. Jika gambar, routing, atau instruksi kerja dengan CUI tersimpan dalam sistem perencanaan Anda, sistem tersebut termasuk dalam cakupan.
- **ITAR dan EAR.** Data teknis untuk defense article hanya boleh diakses oleh pihak yang berwenang [36]. Penjadwal, dukungan TI lepas pantai, dan tenant cloud semuanya perlu diperiksa. Hal ini memengaruhi lokasi penyimpanan data perencanaan dan siapa yang dapat melihat order mana.
- **Logam khusus.** Berdasarkan DFARS 252.225-7009, titanium dan paduan titanium (antara lain logam khusus lainnya) dalam item yang dikirim di bawah kontrak DoD harus dilebur atau diproduksi di AS atau di negara yang memenuhi syarat, dan klausul ini diteruskan ke subkontrak untuk item yang mengandung logam khusus [51]. Alokasi material karena itu harus mengetahui asal peleburan dari setiap heat lot.

## 4. Traceability dan genealogy

### 4.1 Mengapa traceability merupakan tugas perencanaan

Traceability sering dianggap semata-mata sebagai topik kualitas. Padahal, traceability dibentuk dalam alur order, tempat pekerjaan direncanakan, dijalankan, dan dikonfirmasi. Ketika seorang planner memindahkan order ke mesin lain, memecah lot, atau mengalihkan rute operasi outside, genealogy part ikut berubah. Jika informasi tersebut kemudian hilang, part dalam kasus terburuk mungkin tidak lagi dapat dikirim karena catatannya tidak lengkap.

Sebuah artikel terbaru di jurnal perdagangan Jerman *Produktion* menggambarkan bahwa bukti dan kualitas data merupakan hambatan sebenarnya bagi pemasok menengah ke industri pertahanan. Artikel itu mengutip survei BearingPoint yang menyebutkan bahwa hanya 10 % perusahaan yang disurvei di Jerman memiliki arsitektur data yang sepenuhnya terintegrasi, sementara 38 % bekerja dengan sistem yang terfragmentasi [37]. Episode podcast m365.fm [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) membahas bagaimana traceability dan genealogy dapat diterapkan secara teknis dan organisasional dalam manufaktur.

### 4.2 Istilah: traceability, genealogy, as-designed dan as-built

- **Traceability** adalah kemampuan untuk menelusuri asal sebuah part (ke depan dan ke belakang): dari material apa, dari pemasok mana, dengan proses apa, kapan, dan oleh siapa?
- **Genealogy** menggambarkan hubungan induk-anak antara part, lot, dan assembly. Ini menjawab pertanyaan seperti: assembly mana yang berisi material dari heat lot X? Nomor seri mana yang terdampak oleh run heat treat yang cacat?
- **As-designed** adalah konfigurasi yang ditetapkan oleh engineering; **as-built** adalah konfigurasi yang benar-benar dibuat, termasuk deviasi yang disetujui. **As-maintained** menggambarkan kondisi setelah perawatan di MRO.

### 4.3 Model data: apa yang minimal harus dicatat

| Objek | Atribut tipikal | Mengapa perencanaan membutuhkannya |
|---|---|---|
| Nomor part / nomor seri | nomor part, revisi, nomor seri, konfigurasi | menghubungkan ke pesanan pelanggan dan revisi desain |
| Lot / batch | nomor lot, kuantitas, pemisahan dan penggabungan | penentuan ukuran lot, pembatasan lingkup recall |
| Bahan baku | material, spesifikasi, heat, pemasok, sertifikat material, asal peleburan (untuk logam khusus DFARS [51]) | pelepasan material sebelum pesanan dimulai |
| Operasi | mesin, revisi program NC, alat, parameter proses, mulai/selesai | konfirmasi, lead time, rekonsiliasi kapasitas |
| Personel | karyawan, kualifikasi, masa berlaku | penugasan hanya kepada orang yang berkualifikasi |
| Proses khusus | prosesor, akreditasi, nomor muatan tungku/tangki, sertifikat | perencanaan langkah eksternal, penahanan deviasi |
| Inspeksi | rencana inspeksi, alat ukur, hasil, inspektur | pelepasan, FAI, bukti untuk karakteristik kunci |
| Deviasi | konsesi, rework, persetujuan deviasi | dokumentasi as-built, kelayakan kirim |
| Dokumen pelepasan | sertifikat kesesuaian (C of C); pada organisasi yang disetujui, FAA Form 8130-3 atau EASA Form 1 [22][23][43] | pelepasan pengiriman; pemasok tanpa persetujuan produksi sendiri biasanya mengirim ke pemegang persetujuan dengan sertifikat kesesuaian |

Catatan tentang dokumen pelepasan bagi pembaca AS: FAA Form 8130-3 (Authorized Release Certificate, Airworthiness Approval Tag) mendokumentasikan persetujuan kelaikudaraan domestik, persetujuan untuk kembali beroperasi, dan persetujuan ekspor. Dokumen ini hanya boleh diterbitkan oleh orang dan organisasi yang berwenang dari FAA, dan FAA Order 8130.21H menyatakan bahwa pemasok tanpa persetujuan produksi umumnya tidak boleh menerbitkannya untuk part yang dikirim ke pemegang persetujuan produksinya; order tersebut juga menyebutkan bahwa dokumen ini "bukan dokumen pengiriman atau dokumen pengapalan" [43]. Fasilitas yang disetujui oleh FAA dan EASA sekaligus dapat menerbitkan pelepasan ganda pada 8130-3 yang membuat part memenuhi syarat untuk dipasang pada pesawat AS dan UE [43]. Padanan Eropa untuk pelepasan EASA tunggal adalah EASA Form 1 [22][23].

### 4.4 Part dengan batas umur pakai

Part tertentu, terutama part mesin berputar seperti disk dan poros, memiliki umur pakai yang disetujui dalam siklus atau jam (life-limited parts, LLP). Pemakaiannya harus didokumentasikan tanpa celah sepanjang umur part. Di AS, pemilik dan operator wajib menyimpan catatan "status terkini dari life-limited parts" untuk setiap airframe, mesin, propeller, rotor, dan appliance, dan catatan ini disimpan serta dialihkan bersama pesawat saat dijual [53]. Di Eropa, tugas yang sama menjadi bagian dari continuing airworthiness berdasarkan aturan EASA [23]. Jika sebagian riwayat hilang (yang disebut back-to-birth traceability), part yang secara teknis sempurna bisa menjadi tidak dapat digunakan. Bagi produsen, ini berarti: catatan kelahiran part, yaitu material, heat, lot forging, dan data manufaktur, harus lengkap. Bagi bengkel MRO, ini berarti: tanpa riwayat yang lengkap, part tidak dapat dipasang kembali, dan perencanaan harus mencari penggantinya.

### 4.5 Part palsu dan part tidak disetujui

AS9100 secara eksplisit mewajibkan tindakan untuk mencegah part palsu [14]. Advisory Circular AC 21-29D (2016) dari FAA menjelaskan cara mendeteksi dan melaporkan dugaan part tidak disetujui (suspected unapproved parts, SUP); AC tersebut mendefinisikan part tidak disetujui sebagai part yang tidak memenuhi kriteria 14 CFR 21.8 atau 21.9, yang mencakup part yang sengaja disalahartikan dan part palsu [52]. Panduannya untuk pembelian langsung relevan bagi perencana: beli dari sumber yang dokumentasinya dapat menelusuri part hingga sumber yang disetujui FAA, dan waspadai tanda peringatan seperti harga jauh di bawah penjual lain, waktu pengiriman yang tidak wajar singkat, atau dokumentasi yang tidak ada [52]. Dugaan part tidak disetujui dilaporkan dengan FAA Form 8120-11 [52].

Bagi perencanaan, ini berarti: pembelian hanya boleh berasal dari sumber yang disetujui, sertifikat harus diperiksa pada inspeksi penerimaan, dan pengadaan cepat dari sumber tidak dikenal bukan pilihan, bahkan di bawah tekanan jadwal. Kekurangan pasokan meningkatkan risiko ini, karena tekanan untuk beralih ke sumber gray-market menjadi lebih besar.

### 4.6 Dalam praktik: membangun traceability ke dalam proses perencanaan

1. **Pesan dan lepaskan material sebelum order dimulai.** Sebuah order baru boleh dimulai setelah material spesifik (heat lot, sertifikat) ditetapkan dan diperiksa.
2. **Modelkan kualifikasi dalam model kapasitas.** Perencanaan hanya menugaskan operasi kepada orang dan mesin yang memiliki kualifikasi yang masih berlaku.
3. **Catat pemecahan dan penggabungan lot dalam sistem.** Setiap pemecahan lot menghasilkan nomor lot baru yang terhubung dengan lot asalnya.
4. **Rencanakan operasi alih daya (outside operations) termasuk pengembalian sertifikat.** Sebuah part dianggap kembali hanya jika sertifikatnya sudah kembali.
5. **Catat konfirmasi di stasiun kerja, bukan di akhir shift.** Semakin lama pencatatan ditunda, semakin banyak data yang hilang.
6. **Uji query Anda secara berkala.** Jalankan simulasi recall: berapa lama waktu yang dibutuhkan untuk menemukan semua nomor seri dari sebuah heat lot?

## 5. Tingkat perencanaan: dari rate pelanggan hingga operasi

### 5.1 Empat tingkat, empat horizon waktu

Perencanaan produksi aerospace dapat dibagi menjadi empat tingkat. Setiap tingkat menjawab pertanyaan yang berbeda dan membutuhkan data yang berbeda pula.

| Tingkat | Horizon | Pertanyaan utama | Alat yang umum digunakan |
|---|---|---|---|
| Perencanaan rate dan kapasitas strategis | 2 sampai 5 tahun | Rate berapa yang dapat kita penuhi dengan investasi apa? | kalkulasi skenario, simulasi pabrik, perencanaan modal |
| Sales and operations planning (S&OP) dan master production scheduling | 6 sampai 24 bulan | Bagaimana kita menerjemahkan rate pelanggan menjadi program yang layak? | ERP, rough-cut capacity planning, APS |
| Perencanaan material dan kapasitas | 1 sampai 6 bulan | Material dan kapasitas apa yang kita butuhkan, dan kapan? | ERP/MRP, portal pemasok, APS |
| Penjadwalan detail dan kontrol lantai produksi | jam hingga 4 minggu | Order mana yang berjalan kapan, di mesin mana, dengan siapa? | APS, MES, papan lantai produksi |

Penyebab umum buruknya ketepatan waktu pengiriman bukanlah satu tingkat yang lemah, melainkan keterputusan antar tingkat: jadwal induk berkomitmen pada rate 75, jadwal detail mengetahui bottleneck yang membuat hal itu mustahil, dan tidak ada yang mendamaikan keduanya secara sistematis.

### 5.2 ERP, APS dan MES: siapa melakukan apa

Di sebagian besar perusahaan, [enterprise resource planning (ERP)](https://www.m365.fm/entity/enterprise-resource-planning/) adalah sistem utama untuk order, bill of materials, routing, persediaan, dan pembelian. Material requirements planning (MRP) klasiknya, dalam bentuk dasarnya, menghitung dengan lead time rencana yang tetap dan tanpa batas kapasitas. Itu sudah cukup untuk menentukan kebutuhan material, tetapi tidak cukup untuk membuat jadwal produksi yang layak.

Sebaliknya, sistem [advanced planning and scheduling (APS)](https://www.m365.fm/entity/advanced-planning-and-scheduling/) menjadwalkan berdasarkan kapasitas terbatas: mesin, orang dengan kualifikasi, alat, shift, dan ketersediaan material dipertimbangkan secara bersamaan. Metode yang mendasarinya disebut [constraint-based scheduling](https://www.m365.fm/entity/constraint-based-scheduling/). Terakhir, manufacturing execution system (MES) mengontrol dan mendokumentasikan eksekusi di lantai produksi serta menyediakan konfirmasi tanpa mana pun perencanaan maupun traceability tidak dapat berjalan.

Panduan pendamping [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) membahas secara rinci perbedaan antara ERP, APS, dan MES, keterbatasan logika MRP, serta cara memilih perangkat lunak perencanaan.

### 5.3 Apa yang harus dicakup model perencanaan aerospace selain itu

Dibandingkan dengan manufaktur umum, model perencanaan di aerospace memerlukan beberapa batasan tambahan:

- **Matriks kualifikasi** untuk orang (special processes, otorisasi inspeksi, otorisasi rilis)
- **Kualifikasi mesin** berdasarkan part number (tidak setiap mesin disetujui untuk setiap part)
- **Operasi alih daya (outside operations)** dengan lead time yang realistis dan komitmen kapasitas dari prosesor
- **Langkah inspeksi dan rilis** sebagai operasi yang dapat dijadwalkan dengan kapasitasnya sendiri (laboratorium inspeksi, inspektur, FAI)
- **Data konfigurasi dan effectivity** (revisi mana yang berlaku mulai dari nomor seri atau pesawat mana)
- **Alokasi material pada tingkat heat lot** dan bukan hanya ketersediaan kuantitas (termasuk asal peleburan jika aturan DFARS specialty metals berlaku [51])
- **Batasan batch** untuk tanur, autoklaf, dan tangki proses (muatan minimum, kompatibilitas part dan material)
- **Pembatasan akses data** untuk order yang dikendalikan ITAR atau CUI (siapa yang boleh melihat dan menjadwalkan pekerjaan yang mana) [36][49]

## 6. Memahami dan Mengurangi Lead Time

### 6.1 Hukum Little: Hubungan antara Persediaan dan Waktu

Pada tahun 1961, John D. C. Little membuktikan suatu hubungan yang berlaku untuk setiap sistem produksi yang stabil: persediaan rata-rata dalam sistem sama dengan throughput dikalikan dengan waktu rata-rata di dalam sistem [27]. Disusun ulang:

**Lead time = work in process (WIP) ÷ throughput**

**Contoh perhitungan:** Sebuah bengkel komponen mesin rata-rata mengirimkan 40 part per minggu. Terdapat 320 part dalam sistem (sedang diproses, menunggu, berada di proses luar, dalam inspeksi). Lead time rata-rata kemudian adalah 320 ÷ 40 = 8 minggu. Jika WIP dapat dikurangi menjadi 200 part dengan throughput yang sama, lead time turun menjadi 5 minggu. Throughput tidak berubah selama bottleneck tetap terpasok penuh.

Hukum ini menjelaskan mengapa melepaskan lebih banyak order ke lantai produksi tidak memperpendek waktu pengiriman, melainkan memperpanjangnya: WIP naik, throughput tetap, lead time bertambah.

### 6.2 Ke Mana Waktu Itu Pergi

Di banyak pabrik, waktu proses aktual hanya merupakan bagian kecil dari lead time; bagian yang lebih besar adalah waktu tunggu. Ini adalah aturan praktis yang banyak dipakai, bukan rasio yang didokumentasikan secara umum [unverified: aturan praktis yang beredar luas, tidak ada sumber yang dapat diverifikasi]. Besarnya proporsi ini sangat bergantung pada perusahaan dan sebaiknya diukur di pabrik Anda sendiri, misalnya dengan [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/). Dalam industri dirgantara, penyebab yang umum antara lain:

- **Menunggu proses khusus di luar** (transportasi bolak-balik, antrean di prosesor, pengembalian sertifikat)
- **Menunggu inspeksi dan pelepasan** (laboratorium inspeksi, FAI, inspeksi di tempat pelanggan, konsesi)
- **Menunggu material atau dokumen** (sertifikat yang hilang, perubahan teknik yang belum selesai)
- **Pengelompokan batch** (part menunggu sampai tungku atau batch terisi penuh)
- **Bottleneck yang kelebihan beban** (utilisasi tinggi menciptakan antrean yang panjang secara tidak proporsional)
- **Gangguan oleh order prioritas** (expediting menggeser order reguler)

### 6.3 Pengungkit untuk Lead Time yang Lebih Pendek

1. **Batasi WIP.** Lepaskan hanya sejumlah order yang dapat diproses oleh bottleneck. Theory of Constraints menyebutnya "rope" (Bagian 11).
2. **Gabungkan dan jadwalkan proses di luar.** Hari pengambilan dan pengiriman yang tetap dengan prosesor mengurangi variabilitas.
3. **Rencanakan kapasitas inspeksi.** Laboratorium inspeksi dan inspektur adalah kapasitas seperti mesin dan harus masuk dalam rencana kapasitas.
4. **Lengkapi dokumen sebelum mulai.** Tidak ada order tanpa dokumen lengkap, material dengan sertifikat, dan revisi desain yang valid.
5. **Jangan membebani bottleneck di atas 85 hingga 90 % dalam jangka waktu lama** ketika variabilitasnya tinggi. Aturan praktis ini mengikuti teori antrean (Bagian 11.1); nilai yang tepat bergantung pada variabilitas di pabrik Anda. Cadangan kapasitas yang kecil sering kali lebih murah daripada antrean yang panjang.

## 7. Perencanaan proses khusus dan operasi pihak luar

### 7.1 Mengapa proses khusus sering menjadi bottleneck

Proses khusus adalah proses yang hasilnya tidak dapat diverifikasi sepenuhnya pada part jadi tanpa merusaknya, misalnya perlakuan panas, perlakuan permukaan, pengelasan, atau pelapisan tertentu. Oleh karena itu, mutunya harus dijamin melalui proses, peralatan, dan personel yang tersertifikasi. Di industri aerospace, banyak pelanggan mensyaratkan akreditasi Nadcap untuk proses-proses tersebut [21][54].

Hal ini membawa tiga konsekuensi bagi perencanaan. Pertama, jumlah sumber yang disetujui terbatas; perubahan memerlukan kualifikasi dan sering kali inspeksi artikel pertama yang baru. Kedua, banyak proses ini berjalan dalam batch (tungku, tangki, autoklaf), yang menimbulkan waktu pengumpulan batch dan waktu tunggu. Ketiga, pemasok melaporkan bahwa pengujian dan perlakuan permukaan khususnya memiliki lead time yang panjang [10].

### 7.2 Aturan perencanaan untuk proses khusus

- **Modelkan proses khusus sebagai sumber daya,** bukan sebagai lead time datar. Perlakuan panas pihak luar dengan dua kali proses tungku per minggu adalah kapasitas dengan ritme, bukan "lead time 10 hari".
- **Sepakati komitmen kapasitas melalui kontrak** (slot per minggu) dan simpan dalam perencanaan sebagai kendala keras.
- **Rencanakan batching secara sengaja.** Part mana yang boleh diproses bersama? Muatan minimum mana yang masuk akal? Berapa lama maksimal part boleh menunggu batch?
- **Jadikan konfirmasi termasuk sertifikat** sebagai syarat untuk operasi berikutnya.
- **Kualifikasikan sumber kedua** sebelum bottleneck menjadi akut. Kualifikasi sering memakan waktu berbulan-bulan.

### 7.3 Proses khusus internal: membuat atau membeli dari sudut pandang kapasitas

Banyak pemasok mempertimbangkan untuk membawa proses khusus ke dalam perusahaan guna mengurangi ketergantungan. Hal ini dapat masuk akal, tetapi merupakan proyek dengan lead time panjang tersendiri: peralatan, kualifikasi, akreditasi, staf, dan persetujuan pelanggan. Simulasi utilisasi di masa depan (Bagian 11.4) membantu memastikan apakah investasi tersebut menguntungkan atau apakah peralatan internal hanya akan menciptakan bottleneck baru dengan utilisasi rendah.

## 8. Perubahan rekayasa dan manajemen konfigurasi

### 8.1 Perubahan itu normal di aerospace

Selama masa pakai panjang sebuah program pesawat, gambar, material, proses, dan pemasok terus berubah. Setiap perubahan harus dinilai, disetujui, dan diberi efektivitas: mulai dari nomor seri, pesawat, atau tanggal yang mana revisi baru berlaku? Bagi perencanaan, hal ini merupakan sumber gangguan yang permanen.

### 8.2 Dampak perubahan terhadap perencanaan

| Dampak | Konsekuensi perencanaan |
|---|---|
| Revisi desain baru | tinjau pesanan terbuka: habiskan, kerjakan ulang, buang sebagai scrap, atau kirim dengan konsesi |
| Operasi baru atau yang berubah | perbarui routing, waktu standar, program NC, dan rencana inspeksi |
| Inspeksi artikel pertama (penuh atau sebagian) | jadwalkan FAI sebagai operasi tersendiri dengan kapasitas inspeksi; persetujuan sebelum pengiriman produksi [18][34] |
| Perubahan material atau pemasok | kualifikasi, mungkin FAI baru, sertifikat baru, dan lead time pengadaan |
| Perkakas atau fixture baru | lead time pengadaan, penerimaan, mungkin FAI untuk perkakas yang berubah |

Berdasarkan AS9102, perubahan desain yang memengaruhi bentuk, kesesuaian, atau fungsi, perubahan sumber, proses, lokasi, atau perkakas manufaktur, serta jeda produksi lebih dari dua tahun, antara lain, memicu inspeksi artikel pertama penuh atau sebagian [34]. Revisi C dari AS9102, yang diterbitkan pada 2023, lebih menekankan perencanaan, evaluasi, dan pengulangan inspeksi artikel pertama [18][46]. Di Eropa, edisi yang sesuai diterbitkan sebagai EN 9102:2024 (di Jerman sebagai DIN EN 9102:2025-01) [17].

### 8.3 Aturan praktis untuk menangani perubahan

1. **Gabungkan perubahan jika pelanggan mengizinkan.** Banyak perubahan kecil yang berdiri sendiri lebih mahal daripada beberapa perubahan yang digabung.
2. **Tetapkan efektivitas sejak dini dan teruskan ke perencanaan.** Sebuah pesanan harus mengetahui sejak awal revisi mana yang sedang dibangunnya.
3. **Kelola persediaan revisi lama secara aktif.** Meluncurkan lot besar revisi lama ketika perubahan sudah dapat diperkirakan akan menghasilkan scrap.
4. **Pesan kapasitas FAI.** Sumber daya inspeksi untuk artikel pertama cepat kelebihan beban selama ramp-up dan gelombang perubahan.
5. **Tampilkan status perubahan pada papan perencanaan.** Pesanan dengan perubahan yang masih terbuka adalah pesanan berisiko.

## 9. Kurva pembelajaran Wright: teori dan contoh kerja

### 9.1 Penemuan tahun 1936

Pada tahun 1936, Theodore Paul Wright menerbitkan makalah "Factors Affecting the Cost of Airplanes" dalam *Journal of the Aeronautical Sciences* (vol. 3, no. 4, hlm. 122–128) [24]. Ia menemukan bahwa jam kerja yang dibutuhkan per pesawat turun sekitar 20 % setiap kali produksi kumulatif berlipat dua [25]. Pola ini kini dikenal sebagai Hukum Wright atau kurva pembelajaran. Penurunan 20 % per penggandaan disebut kurva pembelajaran 80 %; nama tersebut menyatakan sisa persentasenya [25].

Kurva pembelajaran masih menjadi alat standar untuk estimasi biaya dan perencanaan kapasitas di industri dirgantara. Badan Akuntabilitas Pemerintah AS (GAO) menjelaskannya dalam Cost Estimating and Assessment Guide [26].

### 9.2 Dua varian: model rata-rata kumulatif dan model unit

Ada dua formulasi yang umum digunakan [26]:

- **Model rata-rata kumulatif (Wright):** jam *rata-rata* untuk seluruh unit yang telah dibuat turun dengan persentase tetap setiap penggandaan.
- **Model unit (model Crawford):** jam untuk *unit individual* turun dengan persentase tetap setiap penggandaan.

Keduanya menggunakan rumus yang sama tetapi besaran acuan yang berbeda [26][40]. Tentukan varian mana yang Anda gunakan dan konsisten dengannya. Jika Anda memindahkan laju pembelajaran dari model rata-rata kumulatif ke model unit, Anda membandingkan nilai aktual dan nilai target yang tidak sepadan.

Rumusnya adalah: **Y = A · X^b**, dengan A = jam untuk unit pertama, X = unit kumulatif dan b = log(laju pembelajaran) ÷ log(2) [26].

### 9.3 Contoh kerja: meluncurkan perakitan baru

Sebuah pemasok mengambil alih perakitan sub-rakitan baru. Unit pertama membutuhkan 1.000 jam perakitan. Berdasarkan program sejenis, diasumsikan kurva pembelajaran 85 % (model rata-rata kumulatif).

**Langkah 1: Hitung eksponen.** b = log(0,85) ÷ log(2) = −0,2345.

**Langkah 2: Jam rata-rata dan jam per unit.** Jam untuk unit ke-N diperoleh dari selisih total kumulatif: T(N) = N · rata-rata(N) − (N−1) · rata-rata(N−1).

| Unit kumulatif N | Rata-rata jam per unit | Jam kumulatif | Jam untuk unit N |
|---|---|---|---|
| 1 | 1.000,0 | 1.000 | 1.000,0 |
| 2 | 850,0 | 1.700 | 700,0 |
| 4 | 722,5 | 2.890 | 571,3 |
| 8 | 614,1 | 4.913 | 477,4 |
| 16 | 522,0 | 8.352 | 402,6 |
| 32 | 443,7 | 14.199 | 340,9 |
| 50 | 399,6 | 19.981 | 306,6 |
| 100 | 339,7 | 33.968 | 260,3 |

**Langkah 3: Implikasinya bagi perencanaan kapasitas.** Jika pemasok merencanakan sepuluh unit pertama dengan jam unit ke-100 (260 jam), totalnya menjadi 2.603 jam. Menurut kurva pembelajaran, sepuluh unit pertama sebenarnya membutuhkan 5.828 jam, lebih dari dua kali lipat. Peluncuran yang direncanakan dengan jam standar tingkat matang karena itu secara sistematis kurang direncanakan.

**Langkah 4: Periksa sensitivitas.** Seberapa kuat hasil bergantung pada laju pembelajaran yang diasumsikan? Dengan kurva 90 % alih-alih 85 %, kebutuhan untuk 100 unit pertama naik dari 33.968 menjadi 49.659 jam, peningkatan sebesar 46 %. Pemilihan laju pembelajaran dengan demikian merupakan salah satu asumsi paling berpengaruh dalam keseluruhan rencana peluncuran.

### 9.4 Aturan praktis untuk kurva pembelajaran

- **Turunkan laju pembelajaran dari data Anda sendiri,** jangan menyalinnya dari literatur. Catat jam aktual per unit sejak awal.
- **Bedakan kurva pembelajaran berdasarkan muatan kerja.** Perakitan manual lebih banyak belajar dibanding pemesinan, di mana waktu mesin hampir tidak menurun.
- **Perhitungkan gangguan.** Setelah jeda panjang, pergantian staf atau relokasi, sebagian efek pembelajaran hilang.
- **Pantau aktual terhadap target.** Jika jam aktual tetap di atas kurva, berarti asumsi atau prosesnya keliru. Perencanaan perlu mengetahui yang mana.
- **Perubahan rekayasa sebagian mengatur ulang kurva.** Perubahan besar dapat memicu proses pembelajaran baru.

## 10. Perencanaan kenaikan laju: perhitungan dan daftar periksa

### 10.1 Mengapa kenaikan laju gagal di bottleneck

Kenaikan laju sering dinilai berdasarkan kapasitas total: "Rata-rata kami berada di 75 % utilisasi, jadi kami bisa menangani 20 % lebih banyak." Hal itu jarang benar, karena throughput ditentukan oleh bottleneck, bukan oleh rata-rata. [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) karya Eliyahu M. Goldratt mempopulerkan prinsip ini pada tahun 1980-an [28].

### 10.2 Contoh kerja: laju 60 ke laju 72

Seorang pemasok mengirimkan satu set komponen fitting per pesawat. Laju pelanggan akan dinaikkan dari 60 menjadi 72 pesawat per bulan (naik 20 %). Tiga sumber daya terpenting terlihat seperti ini:

| Sumber daya | Jam tersedia/bulan | Beban pada laju 60 | Utilisasi laju 60 | Beban pada laju 72 | Utilisasi laju 72 |
|---|---|---|---|---|---|
| Pemesinan 5-sumbu | 1.400 | 1.190 | 85 % | 1.428 | 102 % |
| Deburring dan perakitan | 2.000 | 1.300 | 65 % | 1.560 | 78 % |
| Laboratorium inspeksi (CMM) | 600 | 420 | 70 % | 504 | 84 % |
| Total (berbobot jam) | 4.000 | 2.910 | 73 % | 3.492 | 87 % |

Utilisasi total 87 % terdengar layak. Namun pemesinan 5-sumbu, dengan 102 %, berada di atas kapasitasnya, dan itu belum memperhitungkan gangguan, setup untuk varian tambahan, atau first article inspection setelah perubahan. Di atas itu, berlaku efek dari Bagian 6: semakin utilisasi mendekati 100 %, semakin panjang antrean. Tanpa tindakan, lead time dan keterlambatan pengiriman meningkat meskipun secara matematis kapasitas total mencukupi.

**Kemungkinan tindakan, diurutkan berdasarkan lead time:**

1. **Segera:** lindungi bottleneck (tanpa waktu henti selama istirahat, siapkan setup di luar waktu mesin, pisahkan inspeksi dari mesin).
2. **Minggu:** shift tambahan pada akhir pekan, pindahkan komponen dengan kompleksitas lebih rendah ke mesin lain yang memenuhi syarat.
3. **Bulan:** optimalisasi program (cycle time), fixture untuk beberapa setup, alih daya komponen tertentu ke mitra yang memenuhi syarat (dengan FAI).
4. **Kuartal hingga tahun:** mesin tambahan termasuk waktu pengiriman, instalasi, kualifikasi dan persetujuan pelanggan.

Poin terakhir menunjukkan mengapa kenaikan laju di industri aerospace membutuhkan lead time yang panjang: antara keputusan untuk membeli mesin baru dan pengiriman produksi pertama yang disetujui biasanya terdapat banyak bulan.

### 10.3 Daftar periksa: apakah pabrik Anda siap untuk laju berikutnya?

**Permintaan dan skenario**

- [ ] Laju pelanggan, release, dan permintaan suku cadang per nomor komponen tersedia untuk setidaknya 18 bulan.
- [ ] Setidaknya tiga skenario laju telah dihitung (konservatif, rencana, ambisius).
- [ ] Pemicu untuk investasi dan perekrutan telah ditetapkan sebelumnya.

**Kapasitas**

- [ ] Bottleneck diketahui untuk setiap skenario, bukan hanya utilisasi rata-rata.
- [ ] Utilisasi bottleneck pada skenario rencana berada di bawah 85 hingga 90 %.
- [ ] Kurva pembelajaran untuk komponen baru telah direncanakan (Bagian 9).
- [ ] Kapasitas inspeksi dan pengukuran direncanakan untuk produksi, FAI, dan perubahan.

**Sumber daya manusia**

- [ ] Matriks kualifikasi menunjukkan berapa banyak orang yang tersedia untuk setiap special process dan inspeksi.
- [ ] Waktu onboarding dan kualifikasi bagi karyawan baru dimasukkan dalam rencana.
- [ ] Single point of failure (kualifikasi satu orang) telah diidentifikasi.

**Material dan pemasok**

- [ ] Kontrak bahan baku mencakup laju yang lebih tinggi termasuk lead time.
- [ ] Special process yang dialihdayakan memiliki komitmen kapasitas untuk laju baru.
- [ ] Sumber kedua untuk material dan proses kritis telah dikualifikasi atau sedang dalam proses kualifikasi.
- [ ] Untuk pekerjaan pertahanan: sumber material memenuhi aturan specialty metals DFARS [51].

**Kualitas dan persetujuan**

- [ ] Mesin baru, fixture, dan sumber baru direncanakan dengan waktu FAI dan persetujuan pelanggan.
- [ ] Bukti kesiapan produksi pada laju pelanggan (AS9145) telah disiapkan [35].
- [ ] Traceability berfungsi pada volume yang lebih tinggi tanpa rework manual.

**Pengendalian**

- [ ] KPI (OTD, lead time, WIP, utilisasi bottleneck) dipantau setiap minggu.
- [ ] Jalur eskalasi untuk gangguan bottleneck telah ditetapkan.
- [ ] Rencana secara berkala direkonsiliasi dengan konfirmasi aktual.

## 11. Perencanaan kapasitas dengan APS, manajemen bottleneck dan simulasi

### 11.1 Mengapa utilisasi tinggi memakan waktu

Teori antrean memberikan aturan praktis sederhana: waktu tunggu rata-rata pada suatu sumber daya meningkat sebanding dengan faktor u ÷ (1 − u), di mana u adalah utilisasi. Pendekatan ini berasal dari J. F. C. Kingman (1961); bentuk lengkapnya juga memasukkan variabilitas kedatangan dan waktu proses [38]. Pada utilisasi 80 %, faktornya adalah 4; pada 90 % sudah 9; dan pada 95 % menjadi 19. Dengan demikian, waktu tunggu pada sumber daya dengan utilisasi 95 % hampir lima kali lebih lama dibandingkan pada 80 %, dengan asumsi semua kondisi lain sama.

Hal ini sangat relevan untuk industri dirgantara karena variabilitasnya yang tinggi (perubahan, pengerjaan ulang, proses luar, pesanan mendesak). Jika Anda merencanakan bottleneck pada utilisasi 98 %, Anda sekaligus merencanakan lead time yang panjang.

### 11.2 Manajemen bottleneck dengan Theory of Constraints

Theory of Constraints (TOC) menjelaskan lima langkah pemusatan: identifikasi kendala, eksploitasi kendala, subordinasi semua hal lain terhadap kendala tersebut, peningkatan kendala, lalu mulai lagi dari awal, karena kendala itu berpindah [28]. Untuk pengendalian lantai produksi, prinsip drum-buffer-rope (DBR) telah menjadi standar:

- **Drum:** bottleneck menentukan laju. Jadwalnya adalah jadwal induk untuk seluruh area produksi.
- **Buffer:** buffer waktu ditempatkan di depan bottleneck agar gangguan di hulu tidak membuatnya kekurangan material.
- **Rope:** pelepasan material di awal produksi dikaitkan dengan bottleneck. Hanya yang dapat diproses bottleneck dalam waktu dekat yang dilepaskan. Ini membatasi WIP.

Dalam industri dirgantara, bottleneck sering kali tidak berada di dalam pabrik sendiri, melainkan pada proses khusus oleh pihak luar atau di laboratorium inspeksi. DBR tetap berfungsi jika Anda memperlakukan langkah luar sebagai drum dan mengaitkan pelepasan internal Anda dengan slotnya.

### 11.3 APS di industri dirgantara: apa yang harus dilakukannya

Sistem APS untuk pemasok dirgantara setidaknya harus mampu melakukan hal-hal berikut:

| Kemampuan | Mengapa penting di industri dirgantara |
|---|---|
| Penjadwalan terhadap kapasitas terbatas | Bottleneck adalah aturan, bukan pengecualian |
| Kualifikasi orang dan mesin | Hanya sumber daya yang berkualifikasi boleh dijadwalkan |
| Operasi luar dengan slot | Proses khusus sering kali merupakan bottleneck yang sebenarnya |
| Pembentukan batch | Tungku, tangki dan autoklaf bekerja dalam batch |
| Langkah inspeksi dan pelepasan | FAI dan inspeksi menyerap kapasitas |
| Penjadwalan ulang yang cepat | Perubahan, pengerjaan ulang dan pesanan mendesak sering terjadi |
| Skenario (what-if) | Mengevaluasi skenario laju, investasi, kegagalan pemasok |
| Umpan balik dari lantai produksi | Tanpa data aktual, setiap rencana cepat usang |
| Integrasi dengan ERP dan MES | Data master dan pesanan berasal dari ERP, data aktual dari MES |
| Kontrol akses untuk data terkendali | Pesanan ITAR dan CUI hanya boleh terlihat oleh pengguna yang berwenang [36][49] |

Panduan saudara [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) berisi daftar periksa pemilihan dan peta jalan implementasi untuk sistem APS.

### 11.4 Simulasi: uji keputusan kapasitas sebelum Anda mengambilnya

[Simulasi pabrik](https://www.m365.fm/entity/factory-simulation/) merepresentasikan sumber daya, pesanan, variabilitas dan aturan dalam sebuah model, lalu memainkan beberapa minggu atau bulan dalam hitungan menit. Simulasi menjawab pertanyaan yang tidak dapat dijawab oleh perhitungan kapasitas statis:

- Bagaimana lead time dan ketepatan pengiriman berkembang pada laju 67 dan laju 75?
- Apa yang dibawa oleh tambahan satu mesin, dan di mana bottleneck berikutnya muncul?
- Apa yang terjadi jika tungku perlakuan panas luar berhenti selama dua minggu?
- Aturan pelepasan mana yang menjaga WIP paling rendah pada ketepatan pengiriman yang sama?
- Apakah proses khusus di dalam perusahaan sepadan, atau peralatan akan kurang dimanfaatkan?

Simulasi tidak menggantikan penjadwalan rinci; simulasi mempersiapkan keputusan strategis dan taktis. Simulasi sangat berharga sebelum investasi dengan lead time panjang, yang justru merupakan situasi yang dihadapi banyak pemasok dengan rencana laju saat ini. Di m365.fm Anda juga akan menemukan halaman entitas [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) mengenai topik perencanaan dan simulasi.

## 12. Risiko rantai pasok 2022 hingga 2026 dan implikasinya bagi perencanaan

### 12.1 Apa yang terjadi dalam beberapa tahun terakhir

**Mesin.** Pada 2023, Pratt & Whitney mengungkapkan adanya cacat pada logam serbuk di beberapa komponen mesin geared turbofan (GTF) yang dapat menyebabkan retak. Pada September 2023, perusahaan induk RTX mengumumkan bahwa tambahan 600 hingga 700 mesin harus dilepas untuk kunjungan bengkel hingga 2026 dan memperkirakan rata-rata 350 pesawat keluarga A320 per tahun akan ditahan di darat. RTX mencatat beban pajak sebelum pajak sebesar $3 miliar; total biaya diperkirakan mencapai $7 miliar, sebagian di antaranya ditanggung mitra seperti MTU [11]. Pada 2026, Airbus menuduh Pratt & Whitney lebih memprioritaskan perawatan di lapangan daripada mesin baru dan tidak mengirimkan jumlah yang dipesan [4]. Pada pertengahan 2026, Airbus menyatakan bahwa mereka tidak lagi memiliki pesawat jadi yang hanya menunggu mesin, tetapi juga tidak memiliki cadangan [39].

**Titanium.** Setelah serangan Rusia ke Ukraina, Boeing menghentikan pembelian dari produsen titanium Rusia VSMPO-Avisma pada Maret 2022. Airbus, yang saat itu menyatakan bahwa sekitar separuh titaniumnya berasal dari Rusia, awalnya tetap melanjutkan pembelian [12]. Titanium tetap menjadi salah satu risiko bahan baku yang paling sering disebut pada 2026 [10]. Bagi pemasok pada program pertahanan AS, klausul logam khusus DFARS menambahkan pembatasan sumber di atas masalah ketersediaan [51].

**Coran dan tempa.** Roland Berger melaporkan adanya kesenjangan yang terus berlanjut pada 2026 untuk coran dan tempa bagi komponen mesin dan sistem (seperti roda pendarat) serta untuk pengencang struktur. Untuk bilah turbin, industri penerbangan bersaing dengan turbin gas industri, yang permintaannya juga meningkat karena kebutuhan daya pusat data [10].

**Tenaga kerja terampil.** Kekurangan staf yang berkualifikasi tetap menjadi hambatan paling umum bagi peningkatan produksi (56 % responden) [10]. Situasi di bidang perawatan serupa (Bagian 13).

**Perubahan struktural di antara pemasok.** Airbus mengambil alih paket pekerjaan dari mantan Spirit AeroSystems. Integrasi tersebut mengurangi hasil Airbus untuk sembilan bulan pertama 2026 sebesar EUR 235 juta [3]. Pergeseran seperti ini mengubah hubungan pasok di semua tingkat di bawahnya.

### 12.2 Respons perencanaan

| Risiko | Respons perencanaan |
|---|---|
| Waktu tunggu bahan yang panjang dan bervariasi | kesepakatan jangka panjang dengan komitmen kapasitas, stok pengaman yang diarahkan pada bahan kritis, perbarui waktu tunggu pengisian ulang secara berkala |
| Sumber tunggal untuk proses khusus | kualifikasikan sumber kedua, amankan slot melalui kontrak, modelkan bottleneck dalam rencana |
| Pelepasan pesanan pelanggan yang berfluktuasi | pantau laju dan pelepasan pelanggan secara terpisah, angkat deviasi sejak dini |
| Kekurangan tenaga kerja | matriks kualifikasi, pelatihan silang, orientasi dimasukkan dalam rencana kapasitas |
| Kegagalan pemasok | simulasikan skenario, pantau indikator peringatan dini (keterlambatan pengiriman, kualitas, kesehatan keuangan) |
| Penumpukan persediaan sebagai antisipasi gangguan | tahan persediaan secara sengaja dan dalam jumlah terbatas bila melindungi bottleneck; setiap unit persediaan memperpanjang waktu tunggu sesuai Hukum Little |

Catatan penting untuk poin terakhir: persediaan bukanlah perlindungan yang gratis. Menurut Roland Berger, 40 % pemasok menumpuk persediaan lebih tinggi untuk memulai produksi, yang menekan margin mereka yang memang sudah tipis [10]. Penyangga yang ditargetkan di depan bottleneck lebih efektif daripada stok pengaman yang menyeluruh untuk semua suku cadang.

## 13. Perencanaan MRO: pemeliharaan dengan temuan tak terduga

### 13.1 Pasar MRO pada 2026

Pemeliharaan, perbaikan dan overhaul (MRO) merupakan pasar yang besar dan terus tumbuh. Dalam prakiraannya yang diterbitkan bersama US Aeronautical Repair Station Association (ARSA), Oliver Wyman memperkirakan pasar MRO penerbangan komersial global bernilai $139,6 miliar pada 2026 dan akan tumbuh menjadi $193,1 miliar pada 2036. Pemeliharaan mesin merupakan segmen terbesar dengan nilai $70,1 miliar. Armada diperkirakan tumbuh dari sekitar 30.000 pesawat komersial pada awal 2026 menjadi sekitar 41.100 pada 2036 [30]. Dalam analisis terpisah dari September 2026, Oliver Wyman menunjuk kekurangan material, waktu tunggu panjang untuk coran dan tempa, serta sedikitnya pemasok untuk suku cadang mesin kritis; hampir 30 % responden memperkirakan rantai pasok baru akan pulih sepenuhnya dalam lebih dari tiga tahun [29].

Keterlambatan pengiriman pesawat baru menambah tekanan: maskapai mengoperasikan pesawat tua lebih lama, dan pesawat-pesawat ini memerlukan lebih banyak pemeliharaan. Studi IATA memperkirakan tambahan biaya pemeliharaan pada 2025 saja sebesar $3,1 miliar [9]. Pada saat yang sama, produksi baru dan pemeliharaan bersaing untuk suku cadang dan kapasitas yang sama, seperti yang ditunjukkan oleh sengketa antara Airbus dan Pratt & Whitney [4].

### 13.2 Kerangka regulasi

Di AS, bengkel pemeliharaan umumnya beroperasi berdasarkan sertifikat repair station yang diterbitkan di bawah 14 CFR Part 145. Repair station hanya boleh mengerjakan artikel yang menjadi lingkup peringkatnya dan berada dalam spesifikasi operasinya, serta "tidak boleh memelihara atau mengubah artikel apa pun yang tidak menjadi lingkup peringkatnya" [42]. Repair station harus menyimpan data pemeliharaan terkini seperti airworthiness directive, manual pemeliharaan, manual overhaul dan service bulletin, "terkini dan dapat diakses ketika pekerjaan terkait sedang dilakukan", menjalankan program pelatihan yang disetujui FAA, serta menyimpan catatan pekerjaan selama minimal dua tahun sejak persetujuan untuk kembali beroperasi [42]. Paket kerja umumnya berasal dari operator pesawat, yang juga bertanggung jawab atas catatan seperti status terkini suku cadang berbatas umur di bawah 14 CFR 91.417 [53]. Banyak repair station juga bersertifikat AS9110 [20].

Di Eropa, organisasi pemeliharaan bekerja dengan persetujuan berdasarkan EASA Part 145. Paket kerja sering berasal dari organisasi manajemen kelaikudaraan berkelanjutan (Part-CAMO), yang mengelola program pemeliharaan, airworthiness directive, dan suku cadang berbatas umur [23]. Repair station AS yang juga memegang persetujuan EASA dapat menerbitkan rilis ganda pada FAA Form 8130-3 [43].

Untuk perencanaan, kedua sistem berarti hal yang sama: pekerjaan hanya diizinkan dalam lingkup yang disetujui, oleh staf yang berwenang dan berdasarkan data pemeliharaan yang sah, seperti Aircraft Maintenance Manual (AMM) atau Component Maintenance Manual (CMM) dalam revisi terkininya. Teknisi tanpa otorisasi atau pelatihan yang tepat juga tidak dihitung sebagai kapasitas di sini.

### 13.3 Apa yang membuat perencanaan MRO benar-benar berbeda

Dalam produksi baru, isi pekerjaan diketahui sebelum pesanan dimulai. Dalam pemeliharaan, isi pekerjaan baru diketahui setelah pesawat, mesin atau komponen dibuka dan diperiksa. Perencanaan karena itu harus menangani tiga jenis pekerjaan:

- **Pekerjaan rutin:** tugas terjadwal dari program pemeliharaan atau manual bengkel, mudah direncanakan
- **Pekerjaan non-rutin (temuan):** korosi, retak, aus atau kerusakan yang ditemukan selama inspeksi; lingkup dan waktunya tidak pasti
- **Pekerjaan tambahan:** modifikasi, airworthiness directive, atau permintaan pelanggan yang ditambahkan ke paket kerja

KPI utama adalah turnaround time (TAT), yaitu waktu dari induksi hingga pengembalian kepada pelanggan. Setiap hari pesawat atau mesin berada lebih lama di bengkel menimbulkan biaya bagi operator. TAT sering ditentukan kurang oleh jam kerja dibandingkan oleh waktu tunggu suku cadang, keputusan atas temuan, persetujuan dan tenaga ahli.

### 13.4 Contoh penerapan: merencanakan temuan alih-alih berharap

Sebuah bengkel MRO komponen merencanakan overhaul satu jenis komponen. Pekerjaan rutinnya 80 jam. Dari riwayat bengkel sendiri atas 50 pesanan terakhir, terdapat tiga temuan yang umum (semua nilai adalah asumsi untuk contoh ini):

| Temuan | Frekuensi | Jam tambahan | Suku cadang diperlukan |
|---|---|---|---|
| Korosi, dapat diperbaiki | 40 % | 12 jam | tidak |
| Retak, penggantian komponen | 10 % | 20 jam | ya, waktu tunggu 15 hari kerja, tidak ada stok |
| Aus, suku cadang pengganti | 30 % | 6 jam | ya, dari stok |

**Jam tambahan yang diharapkan:** 0,4 × 12 + 0,1 × 20 + 0,3 × 6 = 4,8 + 2,0 + 1,8 = 8,6 jam. Rata-rata, sekitar 88,6 jam per pesanan dapat direncanakan. Untuk perencanaan kapasitas di banyak pesanan, nilai harapan ini berguna.

**Untuk komitmen TAT, hal ini tidak cukup.** Untuk 10 % pesanan, ditambahkan waktu tunggu 15 hari kerja untuk suku cadang pengganti. Jika Anda berkomitmen pada TAT sebagai rata-rata (secara matematis, toleransi 1,5 hari), Anda akan meleset cukup jauh pada setiap pesanan kesepuluh. Opsi yang lebih baik adalah:

1. **Simpan suku cadang di stok:** satu atau dua suku cadang di stok sangat mengurangi risiko TAT. Bandingkan biaya persediaan dengan biaya keterlambatan.
2. **Lakukan inspeksi lebih awal:** semakin cepat temuan diketahui, semakin cepat Anda dapat memesan. Jadwalkan inspeksi sebagai langkah pertama dengan prioritas.
3. **Komitmen TAT berdasarkan persentil:** misalnya TAT yang dipenuhi dalam 80 atau 90 % kasus, dengan aturan yang transparan untuk temuan yang memerlukan waktu tunggu suku cadang yang panjang.
4. **Kumpulan pertukaran:** untuk temuan yang sering terjadi, kumpulan pertukaran komponen rotable dapat memisahkan TAT dari siklus perbaikan.

### 13.5 Aturan praktis untuk perencanaan MRO

- **Catat riwayat temuan secara sistematis.** Tanpa data tentang frekuensi dan upaya temuan, setiap rencana tetap berupa perkiraan.
- **Sisihkan kapasitas untuk pekerjaan non-rutin.** Jika Anda membebani hanggar atau bengkel 100 % dengan pekerjaan rutin, tidak akan ada ruang untuk temuan.
- **Periksa ketersediaan suku cadang sebelum menerima pesanan.** Suku cadang kritis dengan lead time panjang merupakan risiko TAT terbesar.
- **Periksa umur dan riwayat suku cadang.** Suku cadang tanpa ketertelusuran yang lengkap tidak dapat dipasang kembali (Bagian 4.4).
- **Jadwalkan spesialis penghambat secara terlihat.** Inspektur NDT, staf yang berwenang menyetujui untuk kembali beroperasi, dan bengkel khusus sering menjadi penghambat.
- **Informasikan pelanggan lebih awal tentang temuan.** Keputusan persetujuan pelanggan sering kali merupakan penantian terpanjang dalam proses.

## 14. Kembaran digital dan benang digital

### 14.1 Istilah

[Kembaran digital](https://www.m365.fm/entity/digital-twin/) produksi adalah model pabrik nyata yang diisi dengan data terkini dan digunakan untuk analisis, perencanaan, dan simulasi. Model ini mencakup sumber daya, pesanan, rute produksi, persediaan, dan aturan. Benang digital adalah tautan berkelanjutan dari data produk sepanjang siklus hidupnya: mulai dari desain melalui manufaktur dan inspeksi hingga operasi dan pemeliharaan. Dalam dirgantara, benang digital terkait erat dengan ketertelusuran dan manajemen konfigurasi, karena menghubungkan kondisi sebagaimana dirancang, sebagaimana dibangun, dan sebagaimana dirawat.

### 14.2 Manfaat untuk perencanaan dan kualitas

- **Perencanaan:** kembaran pabrik memungkinkan skenario dan optimasi berdasarkan kondisi terkini (lihat Bagian 11.4).
- **Ketertelusuran:** benang digital menjawab pertanyaan tentang lot, proses, dan konfigurasi dalam hitungan menit, bukan hari.
- **Perubahan:** dampak perubahan desain terhadap pesanan terbuka, persediaan, dan rute produksi menjadi terlihat.
- **MRO:** menghubungkan riwayat manufaktur dan temuan pemeliharaan memungkinkan kesimpulan tentang kelemahan proses dan desain.

### 14.3 Prasyarat

Kembaran digital hanya sebaik datanya. Sebelum berinvestasi pada model, periksa rute produksi, waktu standar, kalender kapasitas, kualifikasi, dan kualitas konfirmasi. Konsultan 4flow menyebut daftar material yang tidak tepat, lead time yang sudah usang, dan data yang tersebar di platform ERP, PLM, dan MES yang tidak terhubung sebagai hambatan tipikal di dirgantara, yang sering membuat perencana kembali ke spreadsheet yang terpisah [33]. Panduan pendamping [Kembaran digital dalam manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/) membahas topik ini secara lebih mendalam; pertanyaan arsitektur TI, seperti menghubungkan data mesin dan perencanaan ke platform cloud, dibahas dalam panduan [TI manufaktur dengan Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/). Untuk data yang tunduk pada kontrol ekspor atau aturan CUI, lokasi penyimpanan dan hak akses harus diperjelas sejak awal [36][37][49]. Dalam program pertahanan AS, ini mencakup tingkat CMMC yang disyaratkan untuk sistem yang menyimpan data tersebut [49][50].

## 15. KPI untuk perencanaan dan pengendalian

| KPI | Definisi | Mengapa penting di industri dirgantara |
|---|---|---|
| On-time delivery (OTD) | proporsi pengiriman yang tiba tepat pada tanggal yang disepakati (sepakati definisi dan jendela toleransi dengan pelanggan) | kriteria utama penilaian pemasok; disebut sebagai persyaratan dalam AS9100 [14] |
| Lead time | waktu dari mulai pesanan hingga selesai, sebagai rata-rata dan sebarannya | menentukan kemampuan pengiriman dan persediaan (Hukum Little) [27] |
| Work in process (WIP) | jumlah atau nilai pesanan di lantai produksi | indikator awal dari naiknya lead time |
| Utilisasi bottleneck | waktu terpakai ÷ waktu tersedia di bottleneck | menentukan throughput; di atas 90 % waktu tunggu meningkat tajam [38] |
| Kepatuhan jadwal | proporsi operasi yang selesai dalam jendela waktu yang direncanakan | menunjukkan apakah rencana realistis |
| Escapes | jumlah part cacat yang sampai ke pelanggan | dampak biaya tertinggi, sering menjadi metrik pelanggan; elemen sistem mutu yang wajib bagi pemegang persetujuan produksi FAA [41] |
| First pass yield (FPY) | proporsi part tanpa pengerjaan ulang atau scrap | pengerjaan ulang menghabiskan kapasitas bottleneck |
| Lead time FAI | waktu dari penyelesaian first article hingga persetujuan | faktor yang sering diremehkan dalam ramp-up dan perubahan |
| Deviasi kurva pembelajaran | jam aktual per unit dibandingkan kurva target | menunjukkan apakah asumsi peluncuran terpenuhi |
| Turnaround time (TAT) | waktu dari masuk hingga kembali pada MRO, sebagai rata-rata dan persentil | kriteria utama bagi pelanggan MRO |
| Finding rate | proporsi pesanan dengan pekerjaan non-rutin dan usahanya | dasar perencanaan kapasitas MRO |

**Catatan tentang pengukuran:** Definisikan setiap KPI secara tidak ambigu dan terapkan definisi tersebut secara konsisten. Definisi OTD khususnya berbeda antar pelanggan (acuan pada tanggal pertama yang diminta atau yang dikonfirmasi, pengiriman lebih awal yang diizinkan, pengiriman sebagian atau lengkap). Metrik yang dihitung setiap orang dengan cara berbeda tidak mengendalikan apa pun. Panduan pendamping [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) membahas definisi KPI secara lebih rinci.

## 16. Pendekatan: enam langkah menuju perencanaan yang andal

**Langkah 1: Ukur kondisi saat ini.** Kumpulkan lead time, WIP, OTD dan utilisasi per sumber daya selama minimal tiga bulan. Peta aliran nilai untuk famili part yang paling penting menunjukkan di mana waktu terbuang.

**Langkah 2: Identifikasi bottleneck.** Di mana pesanan menumpuk? Sumber daya mana yang menentukan throughput? Sertakan proses khusus oleh pihak luar, inspeksi dan kualifikasi staf.

**Langkah 3: Bersihkan data master.** Routing, waktu standar, waktu setup, kalender kapasitas, kualifikasi, lead time pengadaan ulang. Tanpa dasar ini, setiap alat perencanaan menghasilkan hasil yang salah.

**Langkah 4: Terapkan aturan pengendalian.** Batasi WIP, kaitkan pelepasan pesanan dengan bottleneck, lindungi bottleneck dengan buffer dan tetapkan aturan prioritas.

**Langkah 5: Terapkan penjadwalan berbasis kendala.** Tambahkan penjadwalan rinci ke ERP yang memperhitungkan kapasitas terbatas, kualifikasi dan slot pihak luar. Mulailah dengan area percontohan, idealnya di bottleneck.

**Langkah 6: Tetapkan skenario dan umpan balik.** Gunakan simulasi untuk keputusan laju dan investasi, dan rekonsiliasi rencana dengan realisasi setiap minggu. Terus perbaiki parameter perencanaan berdasarkan konfirmasi.

> **Pemeriksaan cepat untuk manajer pabrik dan perencanaan: lima pertanyaan yang dapat Anda jawab minggu ini**
>
> 1. Sumber daya mana yang menjadi bottleneck Anda saat ini, dan berapa utilisasinya selama empat minggu terakhir?
> 2. Berapa banyak pesanan yang ada di lantai produksi saat ini, dan berapa banyak yang menunggu proses khusus pihak luar atau inspeksi?
> 3. Berapa lama waktu yang dibutuhkan untuk menemukan semua nomor seri untuk satu lot heat bahan baku tertentu?
> 4. Waktu standar mana yang Anda gunakan untuk part yang baru diluncurkan: waktu laju matang atau kurva pembelajaran?
> 5. Apa yang terjadi pada on-time delivery Anda jika pemroses pihak luar yang paling penting berhenti beroperasi selama dua minggu?
>
> Jika Anda tidak dapat menjawab salah satu pertanyaan ini dengan data dalam sehari, mulailah dari Langkah 1.

**Garis waktu:** Langkah 1 hingga 4 tidak memerlukan perangkat lunak baru dan, menurut pengalaman penulis, dapat diterapkan di banyak perusahaan dalam beberapa bulan [unverified: pengalaman penulis tidak didukung data terukur]. Langkah 5 dan 6 memerlukan implementasi perangkat lunak; durasinya bergantung terutama pada kualitas data master. Angka industri yang andal mengenai durasi tidak tersedia.

## 17. Kesalahan umum dan cara menghindarinya

1. **Merencanakan dengan kapasitas tak terbatas.** Logika MRP di ERP mengabaikan bottleneck. Akibatnya: rencana yang sejak awal tidak dapat dijalankan. *Perbaikan:* penjadwalan terperinci berdasarkan kapasitas terbatas.
2. **Melepas lebih banyak order agar pengiriman lebih cepat.** Menurut Hukum Little, WIP yang lebih tinggi memperpanjang lead time. *Perbaikan:* kaitkan pelepasan order dengan bottleneck.
3. **Memodelkan proses eksternal (outside processes) sebagai lead time tetap.** Proses eksternal memiliki kapasitas, kadensi, dan variabilitas. *Perbaikan:* sepakati slot dan rencanakan sebagai sumber daya.
4. **Melupakan inspeksi dan FAI.** Laboratorium inspeksi dan inspektur tidak direncanakan dan menjadi bottleneck tersembunyi. *Perbaikan:* langkah inspeksi sebagai operasi dengan kapasitas.
5. **Menggunakan waktu standar laju matang selama peluncuran.** Kurva pembelajaran diabaikan, peluncuran direncanakan kurang. *Perbaikan:* kurva pembelajaran dari data Anda sendiri.
6. **Menilai rata-rata alih-alih bottleneck.** Utilisasi rata-rata 75 % tidak mengatakan apa pun tentang sumber daya bottleneck. *Perbaikan:* nilai sumber daya demi sumber daya, fokus pada bottleneck.
7. **Merekonstruksi ketelusuran setelah kejadian.** Konfirmasi yang hilang disusun ulang di akhir. *Perbaikan:* catat dalam proses, tetapkan material sebelum mulai.
8. **Mengabaikan kualifikasi.** Rencana menugaskan tugas kepada orang yang tidak memiliki kualifikasi yang sah. *Perbaikan:* matriks kualifikasi sebagai batasan.
9. **Memperlakukan target laju sebagai komitmen.** Kapasitas dibangun berdasarkan target resmi yang kemudian meleset. *Perbaikan:* skenario dengan pemicu (trigger).
10. **Berkomitmen pada rata-rata dalam MRO.** Komitmen TAT berdasarkan rata-rata secara rutin meleset ketika temuan muncul. *Perbaikan:* persentil dan strategi suku cadang.
11. **Membiarkan order prioritas menjadi aturan.** Ekspedisi yang terus-menerus merusak stabilitas jadwal. *Perbaikan:* aturan prioritas yang jelas dan hak intervensi.
12. **Perangkat lunak sebelum data.** APS diperkenalkan sebelum data master benar. *Perbaikan:* kualitas data sebagai paket kerja pertama.
13. **Memperlakukan data terkendali sebagai pemikiran belakangan bagi TI.** Order ITAR atau CUI berakhir di sistem perencanaan atau tenant cloud yang tidak disiapkan untuk itu. *Perbaikan:* jelaskan cakupan kontrol ekspor dan CMMC sebelum memilih atau menerapkan perangkat lunak perencanaan [36][49].

## 18. iFAKT dan kedirgantaraan

> **Catatan: Penulis bekerja di iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), yang berkantor pusat di Stuttgart, Jerman, mengembangkan perangkat lunak [Polaris](https://www.m365.fm/entity/polaris/). Menurut situs web perusahaan, Polaris menghubungkan data ERP dengan digital twin produksi untuk mengoptimalkan rencana. Platform ini mencakup modul untuk pemodelan value stream dan proses bisnis, simulasi, optimasi perencanaan (Optimizer), eksekusi shop floor (Operator), dan analitik (Analyzer) [31]. Situs web mencantumkan kedirgantaraan sebagai industri tersendiri dan menjelaskan dukungan bagi pemasok serta produsen dengan proses manufaktur yang kompleks [31].

Sebagai referensi kedirgantaraan, iFAKT menerbitkan studi kasus dengan Airbus Netherlands. Sejak 2018, lokasi tersebut membangun thrust frame untuk modul propulsi kendaraan peluncur Ariane 6 (Vulcain Aft Bay dan Vinci Thrust Frame). Menurut studi kasus tersebut, modul Polaris Optimizer, Operator, dan Analyzer telah mendukung produksi ini selama tujuh tahun. Persyaratan yang dinyatakan meliputi dokumentasi digital, jaminan kualitas dalam proses, lead time yang lebih pendek, penjadwalan order otomatis, dan alokasi sumber daya yang dioptimalkan. Studi kasus ini menggambarkan hasil kualitatif seperti waktu tunggu yang lebih pendek berkat respons yang lebih cepat terhadap perubahan tak terjadwal, waktu serah terima yang lebih singkat, serta status order yang tersedia setiap saat; tidak ada angka yang diberikan [32]. Manajer AIT Airbus Netherlands dikutip mengatakan bahwa alat Polaris membantu membawa lebih banyak struktur ke dalam produksi [32].

Pada halaman beranda, iFAKT juga mencantumkan angka peningkatan dengan kualifikasi "hingga" (misalnya untuk lead time dan kapasitas). Karena belum ada metodologi yang dipublikasikan untuk angka-angka tersebut, angka ini tidak digunakan di sini [31].

**Konteks:** Persyaratan yang dijelaskan dalam panduan ini (penjadwalan berbasis batasan, kualifikasi, operasi eksternal, simulasi skenario laju, umpan balik shop floor) bersifat netral terhadap vendor. Polaris hanyalah salah satu dari beberapa solusi di pasar. Evaluasi sistem apa pun terhadap kriteria di Bagian 11.3 dan dengan pilot menggunakan data Anda sendiri. Artikel pendamping [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) menjelaskan perangkat lunak ini secara lebih rinci.

## 19. Glosarium

**APQP (Advanced Product Quality Planning):** Perencanaan kualitas terstruktur untuk produk dan proses baru; di sektor dirgantara diatur oleh AS9145 / EN 9145.

**APS (Advanced Planning and Scheduling):** Perangkat lunak perencanaan yang menjadwalkan berdasarkan kapasitas terbatas dan ketersediaan material.

**As-built / as-designed:** Konfigurasi yang benar-benar dibangun dibandingkan dengan konfigurasi yang ditetapkan oleh rekayasa.

**Bottleneck (constraint):** Sumber daya yang membatasi throughput seluruh sistem.

**CAMO (Continuing Airworthiness Management Organisation):** Organisasi yang disetujui EASA dan mengelola kelaikudaraan berkelanjutan sebuah pesawat (EASA Part-CAMO).

**CMMC (Cybersecurity Maturity Model Certification):** Program Departemen Pertahanan AS untuk memverifikasi keamanan siber kontraktor yang menangani FCI atau CUI; klausul kontrak DFARS 252.204-7021.

**CUI (Controlled Unclassified Information):** Informasi pemerintah yang memerlukan pengamanan tetapi tidak berstatus rahasia; keberadaannya dalam sistem perencanaan membuat sistem tersebut masuk dalam cakupan CMMC.

**Digital thread:** Keterkaitan berkelanjutan dari seluruh data produk sepanjang siklus hidupnya.

**Drum-buffer-rope (DBR):** Prinsip pengendalian Theory of Constraints, di mana bottleneck menentukan laju dan membatasi pelepasan pekerjaan.

**EASA Form 1:** Sertifikat pelepasan resmi untuk suku cadang pesawat yang diterbitkan oleh organisasi produksi atau pemeliharaan yang disetujui EASA.

**Effectivity:** Pernyataan nomor seri, pesawat, atau tanggal sejak kapan konfigurasi atau perubahan berlaku.

**Escape:** Suku cadang cacat yang telah sampai ke pelanggan.

**FAA Form 8130-3:** Sertifikat pelepasan resmi FAA (Airworthiness Approval Tag) untuk persetujuan kelaikudaraan domestik, pengembalian ke layanan, dan ekspor; hanya diterbitkan oleh orang dan organisasi yang berwenang FAA.

**FAI (First Article Inspection):** Inspeksi lengkap terhadap suku cadang produksi pertama terhadap seluruh karakteristik desain menurut AS9102 / EN 9102.

**Genealogy:** Hubungan induk-anak antara material, lot, suku cadang, dan rakitan.

**HMLV (high mix, low volume):** Produksi banyak varian dalam jumlah kecil.

**Key characteristic:** Fitur yang variasinya secara signifikan memengaruhi kesesuaian, fungsi, kinerja, atau umur pakai; diatur oleh AS9103 / EN 9103.

**Learning curve:** Hubungan antara jumlah kumulatif dan usaha per unit; berdasarkan Wright (1936).

**LLP (life-limited part):** Suku cadang dengan batas maksimum siklus atau jam operasi yang telah disetujui.

**MRO (maintenance, repair and overhaul):** Layanan pemeliharaan, perbaikan, dan overhaul pesawat dan komponen.

**Nadcap:** Program akreditasi yang dikelola industri untuk proses khusus, dikelola oleh Performance Review Institute (PRI).

**OTD (on-time delivery):** Proporsi pengiriman yang dilakukan pada tanggal yang dijanjikan.

**Part 145:** Di AS, sertifikat stasiun perbaikan FAA (14 CFR Part 145); di UE, persetujuan organisasi pemeliharaan EASA.

**Part 21 Subpart G:** Di AS, sertifikat produksi FAA (14 CFR 21.131 hingga 21.150); di UE, Production Organisation Approval (POA) EASA.

**PMA (Parts Manufacturer Approval):** Persetujuan produksi FAA untuk suku cadang pengganti dan modifikasi (14 CFR Part 21, Subpart K).

**PPAP (Production Part Approval Process):** Prosedur persetujuan untuk suku cadang produksi; dalam dirgantara menjadi bagian dari AS9145 / EN 9145.

**Rate:** Jumlah produksi per bulan, misalnya rate 75 = 75 pesawat per bulan.

**Repair station:** Organisasi pemeliharaan yang disertifikasi FAA berdasarkan 14 CFR Part 145.

**Special process:** Proses yang hasilnya tidak dapat diverifikasi sepenuhnya pada suku cadang jadi tanpa merusaknya, seperti perlakuan panas atau perlakuan permukaan.

**TAT (turnaround time):** Waktu dari masuknya order pemeliharaan hingga pengembalian ke pelanggan.

**Tier 1 / Tier 2:** Tingkatan pemasok; Tier 1 memasok langsung ke pembuat pesawat, Tier 2 memasok ke Tier 1.

**WIP (work in process):** Persediaan di lantai produksi.

## 20. FAQ: Pertanyaan umum tentang perencanaan produksi dirgantara

**Apa itu perencanaan produksi dirgantara?**
Ini adalah perencanaan jumlah, tanggal, kapasitas, dan material untuk manufaktur pesawat terbang, mesin, dan komponen, sesuai dengan persyaratan bukti industri. Perencanaan ini menggabungkan produksi campuran tinggi dengan volume rendah, waktu tunggu yang panjang, dan proses khusus yang dialihdayakan, dengan ketertelusuran yang ketat serta pengendalian konfigurasi. Laju produksi pelanggan dari produsen pesawat menentukan kecepatan di seluruh tingkat pemasok.

**Mengapa penjadwalan ERP tidak cukup untuk industri dirgantara?**
Logika MRP klasik menghitung dengan waktu tunggu yang tetap dan tanpa batas kapasitas. Jadwal produksi yang layak harus memperhitungkan kapasitas terbatas, kualifikasi orang dan mesin, serta slot di pemroses eksternal. Sistem APS atau lapisan penjadwalan rinci yang diperluas melakukan hal ini.

**Berapa laju produksi yang direncanakan Airbus untuk keluarga A320?**
Menurut laporannya untuk sembilan bulan pertama 2026, Airbus menargetkan 70 hingga 75 pesawat per bulan pada akhir 2027, lalu menstabilkan pada laju 75 [3]. Target ini telah beberapa kali mundur, sebagian karena kekurangan mesin [4].

**Berapa laju produksi 737 milik Boeing?**
Pada Mei 2026, CEO Boeing menyatakan bahwa lini 737 beroperasi pada laju 47 [8]. Rilis kuartal ketiga 2026 Boeing menggambarkan program ini sedang menuju produksi stabil 47 per bulan [47]. FAA sebelumnya membatasi laju pada 38 setelah Januari 2024 dan menyetujui 42 pada Oktober 2025 [7].

**Standar apa yang perlu diketahui oleh pemasok dirgantara?**
Intinya adalah AS9100D (EN 9100:2018). Bergantung pada pekerjaannya, tambahkan AS9102 (inspeksi artikel pertama), AS9103 (karakteristik kunci), AS9145 (APQP/PPAP), AS9120 (distributor), dan sering kali akreditasi Nadcap untuk proses khusus. Pemegang persetujuan produksi bekerja berdasarkan FAA 14 CFR Part 21 (atau EASA Part 21 Subpart G); pemasok pertahanan juga menghadapi persyaratan ITAR/EAR, DFARS, dan CMMC.

**Apa perbedaan antara AS9100 dan EN 9100?**
Tidak ada perbedaan isi. Standar IAQG diterbitkan sebagai AS9100 oleh SAE International di Amerika, sebagai EN 9100 di Eropa, dan sebagai JISQ 9100 di Asia [13][14].

**Apakah AS9100D masih berlaku?**
Ya. IAQG sedang mengerjakan revisi yang akan diterbitkan sebagai IA9100. Hingga Oktober 2026, tanggal penerbitan dan masa transisi belum dikonfirmasi, dan sertifikat AS9100D tetap berlaku [15].

**Apa yang dipersyaratkan AS9100 untuk ketertelusuran?**
Standar ini mensyaratkan ketertelusuran bahan baku, material, dan proses yang digunakan, serta alat dan orang [14]. Pelanggan menambahkan persyaratan spesifik dalam persyaratan kualitas pemasok mereka, dan pemegang persetujuan produksi FAA meneruskan persyaratan sistem kualitas mereka sendiri [41].

**Kapan inspeksi artikel pertama (AS9102) diperlukan?**
Untuk suku cadang baru dan untuk perubahan yang dapat memengaruhi bentuk, kesesuaian, atau fungsi, misalnya pada desain, material, sumber manufaktur, proses, perkakas, atau lokasi, dan setelah jeda produksi lebih dari dua tahun. Bergantung pada cakupannya, FAI penuh atau sebagian diperlukan [34].

**Apa itu kurva belajar dalam manufaktur pesawat, dan mengapa penting untuk perencanaan?**
Kurva belajar menggambarkan bagaimana usaha per unit menurun seiring meningkatnya kuantitas kumulatif. Wright menunjukkan penurunan sekitar 20 % setiap kali jumlah digandakan pada 1936 [25]. Jika Anda merencanakan peluncuran dengan waktu laju matang, Anda akan sangat meremehkan kapasitas yang dibutuhkan (contoh perhitungan di Bagian 9).

**Bagaimana saya merencanakan kenaikan laju dengan benar?**
Nilai setiap sumber daya secara individual, terutama bottleneck, alih-alih pemanfaatan rata-rata. Hitung beberapa skenario laju,perhitungkan kurva belajar, kapasitas inspeksi, waktu kualifikasi, dan persetujuan, serta amankan kapasitas eksternal melalui kontrak. Daftar periksa di Bagian 10.3 membantu.

**Apa itu Nadcap?**
Nadcap adalah program akreditasi yang dikelola industri untuk proses khusus seperti perlakuan panas, pemrosesan kimia, pengelasan, dan pengujian tanpa merusak, didirikan pada 1990 dan dikelola oleh Performance Review Institute [21][54]. Banyak pelanggan mensyaratkan akreditasi Nadcap untuk proses khusus.

**Bisakah APS menangani proses eksternal seperti perlakuan panas?**
Bisa, jika dimodelkan sebagai sumber daya dengan kapasitas dan slot, bukan sebagai waktu tunggu yang datar. Sepakati slot mingguan dengan pemroses, simpan sebagai kendala, dan jadikan sertifikat yang dikembalikan sebagai syarat untuk operasi berikutnya (Bagian 7.2).

**Apakah CMMC berlaku untuk pemasok aerospace?**
Berlaku untuk kontraktor pertahanan dan subkontraktor yang kontraknya melibatkan federal contract information (FCI) atau controlled unclassified information (CUI). Klausul DFARS berlaku efektif sejak 10 November 2025 dan diterapkan secara bertahap selama tiga tahun; klausul ini diteruskan (flow down) ke subkontrak yang melibatkan FCI atau CUI [49].

**Apa perbedaan perencanaan MRO dengan perencanaan produksi?**
Dalam pemeliharaan, lingkup pekerjaan baru diketahui setelah inspeksi. Perencanaan harus memperhitungkan probabilitas temuan, ketersediaan suku cadang, dan penyangga (buffer). KPI utamanya adalah turnaround time.

**Bagaimana sebuah repair station dapat memangkas turnaround time?**
Dengan melakukan inspeksi lebih awal, menyediakan suku cadang kritis atau memasoknya melalui exchange pool, memesan kapasitas untuk pekerjaan non-rutin, dan mempercepat persetujuan pelanggan. Komitmen TAT sebaiknya didasarkan pada persentil, bukan rata-rata.

**KPI apa yang paling penting bagi pemasok aerospace?**
On-time delivery (OTD), lead time, work in process, utilisasi bottleneck, escapes, dan first pass yield. Dalam pemeliharaan, ditambahkan turnaround time dan finding rate.

**Apa yang dibawa digital twin ke manufaktur aerospace?**
Digital twin memungkinkan simulasi skenario untuk rate dan investasi, penjadwalan ulang yang lebih cepat saat terjadi gangguan, dan, bersama digital thread, jawaban yang cepat atas pertanyaan keterlacakan. Prasyaratnya adalah master data dan data konfirmasi yang bersih.

**Di mana risiko rantai pasok terbesar pada 2026?**
Menurut Roland Berger, risikonya ada pada tenaga kerja terampil, bahan baku seperti titanium, casting dan forging, fastener, serta layanan pengujian dan perlakuan permukaan [10]. Untuk mesin, kekurangan pasokan membatasi rate produksi pabrikan pesawat [4].

## 21. Kesimpulan

Pada 2026 industri aerospace memiliki buku pesanan yang penuh, tetapi rantai pasoknya hanya mampu menyelesaikannya secara lambat. Bagi pemasok dan bengkel pemeliharaan, perencanaan produksi telah menjadi faktor daya saing. Mereka yang mengetahui bottleneck-nya, merencanakan kurva belajar serta proses khusus secara realistis, membangun keterlacakan ke dalam alur pesanan, dan menghitung skenario rate sebelumnya, dapat mengikuti ramp-up tanpa mengorbankan on-time delivery dan kualitas.

Jalan menuju ke sana jarang dimulai dari perangkat lunak. Ia dimulai dari pengukuran, master data yang bersih, dan aturan kendali sederhana seperti pembatasan WIP dan pelepasan pekerjaan berbasis bottleneck. APS, simulasi, dan digital twin memperkuat fondasi ini; mereka tidak menggantikannya. Mekanismenya sudah lama dikenal dan didokumentasikan selama puluhan tahun, mulai dari kurva belajar Wright hingga Hukum Little dan Teori Kendala. Tugas yang sebenarnya adalah menerapkannya secara konsisten.

## Bacaan lanjutan di m365.fm

**Artikel dan podcast**

- [Perencanaan produksi dirgantara: lead time dan keterlacakan](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- Episode podcast [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/)

**Halaman entitas**

[Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [iFAKT](https://www.m365.fm/entity/ifakt/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Panduan terkait**

- [Penjadwalan produksi dan APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Digital twin dalam manufaktur](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI manufaktur dengan Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI manufaktur](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Manajemen shop floor](https://www.m365.fm/en/learn/shop-floor-management/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** adalah pembawa acara m365.fm dan bekerja di iFAKT GmbH. Di m365.fm ia menulis tentang perencanaan produksi, ketertelusuran, simulasi, dan digitalisasi manufaktur. Ia berfokus pada cara perencanaan berbasis kendala, kembaran digital, dan umpan balik dari lantai produksi bekerja bersama agar rencana tetap berlaku di lantai produksi, bahkan di industri yang menuntut seperti dirgantara.

**Catatan: Penulis bekerja di iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources 41 to 55 were added for the US version and verified online on that date.

1. BDLI (German Aerospace Industries Association): BDLI Industry Data 2026: Aerospace Industry Sets New Records for Revenue and Employment. Press release, Berlin, May 27, 2026. https://www.bdli.de/en/meldungen/bdli-branchendaten-2026-luft-und-raumfahrtindustrie-erreicht-neue-rekorde-bei-umsatz-und
2. Nasdaq/RTTNews: Airbus Delivers 793 Aircraft In 2025 As Order Backlog Reaches Record Level. January 2026. https://www.nasdaq.com/articles/airbus-delivers-793-aircraft-2025-order-backlog-reaches-record-level
3. Airbus: Airbus reports Nine-Month (9m) 2026 results. Press release, October 28, 2026. https://www.airbus.com/en/newsroom/press-releases/2026-10-airbus-reports-nine-month-9m-2026-results
4. Aerospace Global News: Airbus accuses Pratt & Whitney of failing to deliver as A320 ramp up stalls. April 15, 2026. https://aerospaceglobalnews.com/news/airbus-pratt-whitney-a320-ramp-up/
5. Terminair: Airbus delivers 74 aircraft in October, needs 249 more by year-end for its 870 target. November 5, 2026. https://terminair.com/story/113485-airbus-delivers-74-aircraft-in-october-needs-249
6. Boeing: Boeing Reports Fourth-Quarter Results. Press release, January 27, 2026. https://boeing.mediaroom.com/2026-01-27-Boeing-Reports-Fourth-Quarter-Results
7. Assembly Magazine: Boeing Cleared to Boost Production of 737 MAX. October 22, 2025. https://www.assemblymag.com/articles/99622-boeing-cleared-to-boost-production-of-737-max
8. CAPA Centre for Aviation: Boeing testing production rate of 47 aircraft per month, cautious of increasing to 52: CEO. May 28, 2026. https://centreforaviation.com/news/boeing-testing-production-rate-of-47-aircraft-per-month-cautious-of-increasing-to-52-ceo-1360867
9. ADS Group (summary of the IATA release): Supply chain challenges could cost airlines over $11bn in 2025. October 14, 2025; study "Reviving the Commercial Aircraft Supply Chain" by IATA and Oliver Wyman. https://www.adsgroup.org.uk/knowledge/industry-member-news/supply-chain-challenges-could-cost-airlines-over-11bn-in-2025/
10. Roland Berger: Global Aerospace Supply Chain Study 2026. June 2026 (survey of 95 companies, January/February 2026). https://mailing.rolandberger.com/hubfs/07_presse/Aerospace%20Supply%20Chain%20Study%202026%20Roland%20Berger.pdf
11. CNBC: RTX to take $3 billion charge on Pratt & Whitney engine problem. September 11, 2023. https://www.cnbc.com/2023/09/11/rtx-to-take-3-billion-charge-on-pratt-whitney-engine-problem.html
12. Malay Mail (Reuters): Boeing suspends Russian titanium as Airbus keeps buying. March 8, 2022. https://www.malaymail.com/news/money---international/2022/03/08/boeing-suspends-russian-titanium-as-airbus-keeps-buying/2046061
13. IAQG: Standards (overview of the 9100 family). https://ma.iaqg.org/standards
14. TÜV Rheinland: FAQ EN/AS 9100ff. series of standards (German). https://certification.tuv.com/content-media-files/master-content/services/systems/0403-tuv-rheinland-en-as-9100ff-series-of-standards/tuv-rheinland-en-as-9100-faq-de.pdf
15. The QMS Collective: The Current AS9100 Revision, and How to Read Dates That Keep Slipping. October 16, 2026. https://theqmscollective.com/blog/current-as9100-revision-confirmed-vs-expected-ia9100
16. Estonian Centre for Standardisation (EVS): EVS-EN 9145:2018 Aerospace series – Requirements for Advanced Product Quality Planning and Production Part Approval Process. https://www.evs.ee/en/evs-en-9145-2018
17. DIN Media: DIN EN 9102:2025-01, Aerospace series – Quality management systems – First article inspection requirement (EN 9102:2024). https://www.dinmedia.de/en/standard/din-en-9102/377807227
18. Net-Inspect: AS9102 First Article Inspection Report Rev B vs Rev C. https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/
19. IAQG: 9103 Variation Management of Key Characteristics. https://iaqg.org/standard/9103-variation-management-of-key-characteristics/ ; EVS-EN 9103:2023: https://www.evs.ee/en/evs-en-9103-2023
20. EVS: EVS-EN 9110:2018 Quality Management Systems – Requirements for Aviation Maintenance Organizations. https://www.evs.ee/en/evs-en-9110-2018
21. Wikipedia: Nadcap. https://en.wikipedia.org/wiki/Nadcap
22. EASA: Easy Access Rules for Initial Airworthiness and Environmental Protection (Part 21), 21.A.131 Scope (Subpart G). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-initial-airworthiness-and?page=13
23. EASA: Easy Access Rules for Continuing Airworthiness (Regulation (EU) No 1321/2014 with Part-M, Part-145, Part-CAMO; amending Regulation (EU) 2019/1383). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness?page=66
24. Wright, T. P.: Factors Affecting the Cost of Airplanes. Journal of the Aeronautical Sciences, vol. 3, no. 4 (1936), pp. 122–128. Reference: https://en.wikipedia.org/wiki/Theodore_Paul_Wright
25. Wikipedia: Experience curve effect. https://en.wikipedia.org/wiki/Experience_curve_effect
26. U.S. Government Accountability Office (GAO): Cost Estimating and Assessment Guide, Cumulative Average Formulation. https://gaoinnovations.gov/cost-guide/cumulative-average-formulation.html
27. Little, John D. C.: A Proof for the Queuing Formula L = λW. Operations Research, vol. 9, no. 3 (1961), pp. 383–387.
28. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press, 1984.
29. Oliver Wyman: Why engine availability is a growing challenge for aviation. September 24, 2026. https://www.oliverwyman.com/our-expertise/insights/2026/sep/aviation-engine-availaibility-bottlenecks.html
30. Oliver Wyman / ARSA: Global Fleet & MRO Market Forecast 2026–2036, Executive Summary. 2026. https://arsa.org/wp-content/uploads/2026/03/ARSA-OW-2026FleetMROMarketReport-ExecSum-2026.pdf
31. iFAKT GmbH: website (home page, solutions, contact, imprint). https://www.ifakt.de/
32. iFAKT GmbH: Customer Reference Airbus Netherlands. https://www.ifakt.de/references/Airbus_Netherlands_Reference.pdf
33. 4flow: Advanced planning in multi-level production networks in aviation and aerospace. https://4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace
34. InspectionXpert: When to Conduct a First Article Inspection. https://www.inspectionxpert.com/blog/when-to-conduct-a-first-article-inspection
35. IAQG: 9145 Guidance Presentation (APQP phases, PPAP elements). https://ma.iaqg.org/wp-content/uploads/2019/10/9145-Guidance-Presentation.pdf
36. Electronic Code of Federal Regulations: International Traffic in Arms Regulations, 22 CFR Parts 120–130 (https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M); Export Administration Regulations, 15 CFR Parts 730–774 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C).
37. Produktion (German trade journal): Nachweispflicht als Nadelöhr: Warum die Rückverfolgbarkeit über Millionenaufträge in der Verteidigungsindustrie entscheidet ("Evidence requirements as a bottleneck: why traceability decides multi-million defense contracts"). October 27, 2026. https://www.produktion.de/ruestung-aerospace/nachweispflicht-als-nadeloehr-warum-die-rueckverfolgbarkeit-ueber-millionenauftraege-in-der-verteidigungsindustrie-entscheidet/2758489
38. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society, vol. 57, no. 4 (1961), pp. 902–904.
39. Defence Agenda: Airbus Keeps Production Ramp-Up Targets Unchanged. August 1, 2026. https://defenceagenda.com/airbus-production-ramp-up-targets-h1-2026
40. Martin, James R.: Learning Curve Summary (cumulative average model after Wright, incremental unit model after Crawford). Management And Accounting Web. https://maaw.info/LearningCurveSummary.htm
41. 14 CFR 21.137 Quality system (production certificates), 14 CFR 21.307 Quality system (PMA), and table of subparts of 14 CFR Part 21. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/21.137 ; https://www.law.cornell.edu/cfr/text/14/21.307 ; https://www.law.cornell.edu/cfr/text/14/part-21 (official text: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-21/subpart-G)
42. Electronic Code of Federal Regulations: 14 CFR Part 145 Repair Stations (145.1, 145.59, 145.109, 145.163, 145.201, 145.219). https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
43. FAA: Order 8130.21H, Procedures for Completion and Use of the Authorized Release Certificate, FAA Form 8130-3, Airworthiness Approval Tag. Effective February 1, 2014. https://www.faa.gov/documentLibrary/media/Order/FAA_Order_8130.21H.pdf
44. SAE International: AS9100D Quality Management Systems – Requirements for Aviation, Space, and Defense Organizations (revised September 20, 2016). https://saemobilus.sae.org/standards/as9100d-quality-management-systems-requirements-aviation-space-defense-organizations
45. SAE International: AS9145 Aerospace Series – Requirements for Advanced Product Quality Planning and Production Part Approval Process (issued November 8, 2016). https://saemobilus.sae.org/standards/as9145-aerospace-series-requirements-advanced-product-quality-planning-production-part-approval-process
46. ANSI Webstore: SAE AS9102C-2023, Aerospace Series – First Article Inspection Requirements. https://webstore.ansi.org/standards/sae/sae9102c2023
47. Boeing: Boeing Reports Third-Quarter Results. Press release, Arlington, Va., October 27, 2026. https://boeing.mediaroom.com/2026-10-27-Boeing-Reports-Third-Quarter-Results
48. Aerospace Industries Association (AIA): 2026 AIA Facts & Figures: U.S. Aerospace & Defense Industry Leads the World with $1 Trillion in Sales. June 25, 2026 (with S&P Global Market Intelligence, 2025 data). https://www.aia-aerospace.org/?p=27492 ; overview: https://aia-aerospace.org/industry-impact
49. Federal Register, vol. 90, no. 173 (September 10, 2025): Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
50. U.S. Department of Defense, Office of Small Business Programs: Cybersecurity Maturity Model Certification (CMMC) 2.0. https://business.defense.gov/Programs/Cyber-Security-Resources/CMMC-20
51. 48 CFR 252.225-7009 Restriction on Acquisition of Certain Articles Containing Specialty Metals. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/48/252.225-7009
52. FAA: Advisory Circular AC 21-29D, Detecting and Reporting Suspected Unapproved Parts. July 12, 2016. https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_21-29D.pdf
53. 14 CFR 91.417 Maintenance records. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/91.417
54. Boeing Suppliers: Nadcap Accreditation FAQ (Nadcap as an "industry-managed approach to conformity assessment of 'special processes'", administered by PRI). https://www.boeingsuppliers.com/nadcap/nadcap_faq.htm
55. Aerospace Manufacturing (aero-mag.com): Lack of capacity planning adding to ramp-up challenge, report reveals (Vendigital rate readiness assessment, 100+ suppliers). Undated. https://www.aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals
