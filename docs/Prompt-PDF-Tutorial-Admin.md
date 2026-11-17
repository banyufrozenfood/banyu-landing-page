# Prompt Canva Pro — Presentasi/PDF Tutorial Panel Admin Banyu Frozen Food

Dokumen ini berisi prompt siap tempel untuk **Canva Pro (Magic Design / Canva AI)** agar
menghasilkan presentasi **24 slide yang padat informasi** dan bisa diunduh sebagai PDF.

**Fokus utama prompt ini: mencegah slide terlihat kosong.** Semua instruksi anti-kosong
sudah ditulis eksplisit, termasuk kuota minimal informasi dan elemen visual per slide.

Cara pakai singkat:

1. Buka Canva → **Magic Design** (atau "Buat presentasi dengan AI").
2. Tempel **Bagian A** (prompt utama) pada kolom deskripsi.
3. Tempel **Bagian B** (skrip isi per slide) untuk mengganti isi tiap slide dengan materi
   yang sudah disiapkan. Bagian ini yang membuat slide tidak kosong.
4. Ganti setiap token `[[SCREENSHOT-xx: ...]]` dengan screenshot asli sesuai **Bagian C**.
5. Unduh sebagai **PDF Standar**.

---

## Bagian A — Prompt utama (tempel ke Canva)

```
Buat presentasi tutorial berbahasa Indonesia berjudul "Panduan Panel Admin Banyu Frozen Food"
untuk PEMILIK TOKO yang tidak mengerti istilah teknis. Ukuran 16:9 (1920x1080). Tepat 24 slide.

=== ATURAN ANTI-KOSONG (PALING PENTING) ===
- Setiap slide WAJIB terisi minimal 75% area. Jangan sisakan area putih besar tanpa elemen.
- Setiap slide WAJIB punya: judul, satu baris subjudul, 4-6 butir isi, DAN satu kotak sorotan.
- Setiap slide WAJIB punya minimal 3 elemen visual: ikon bergaris, kotak berwarna bernomor,
  panah alur, atau tabel kecil.
- Setiap butir isi minimal 12 kata dan maksimal 22 kata. Jangan menulis butir 3-5 kata saja.
- DILARANG membuat slide yang hanya berisi judul, atau judul plus satu baris teks.
- Jika satu topik terasa panjang, TETAP muat di satu slide dengan menambah butir dan kotak,
  bukan dikosongkan dan bukan dipindah ke slide tambahan.
- Jumlah slide harus tepat 24. Jangan menambah atau mengurangi.

=== BLOK PENGISI WAJIB (pakai minimal 2 per slide) ===
1. Kotak "Yang perlu Anda tahu" - latar biru sangat muda #E6F4FF, 2-3 kalimat penjelas.
2. Kotak "Tips" - latar kuning #FFD700, satu tips praktis yang bisa langsung dilakukan.
3. Kotak "Hati-hati" - latar merah muda, satu kesalahan yang sering terjadi.
4. Bilah "Contoh" - latar abu muda #F8FAFC, berisi contoh pengisian memakai data contoh
   toko di bawah.
5. Tabel kecil - dipakai untuk daftar tab, batas karakter, ukuran gambar, atau pesan error.
6. Diagram panah bernomor - dipakai untuk menjelaskan urutan langkah.
7. Strip "Istilah" - satu istilah panel dijelaskan dengan bahasa sehari-hari.

=== GAYA VISUAL ===
- Rapi dan terstruktur, padat informasi, tidak ada ruang menganggur.
- Warna utama: biru #0099FF, biru tua #0077CC, biru sangat muda #E6F4FF.
- Aksen kuning #FFD700 untuk menyorot tombol atau langkah penting.
- Teks gelap #1A1A2E di atas latar putih atau #F8FAFC.
- Judul slide tebal, subjudul satu baris, butir isi rata kiri agar mudah dibaca.
- Sertakan nomor slide dan nama bab di kanan bawah setiap slide.
- Ikon sederhana bergaris, tanpa foto stok orang.

=== DATA CONTOH YANG DIPAKAI (dummy, bukan data asli) ===
- Nama toko: Banyu Frozen Food
- Lokasi: Cigugur Tengah, Cimahi Tengah, Kota Cimahi
- Nomor WhatsApp contoh: 6281234567890
- Jam buka contoh: Senin-Jumat 08.00-20.00 WIB, Sabtu 08.00-21.00, Minggu 09.00-18.00
- Rentang harga contoh: Rp10.000 - Rp49.000 per item
- Kanal pemesanan: GoFood, GrabMart, WhatsApp (Shopee dan Tokopedia opsional)
- Contoh judul slide beranda: "Stok Makanan Praktis"
- Contoh tombol slide: "Cara Pesan"
Pakai data contoh ini di kotak "Contoh" dan di contoh pengisian form.

=== ATURAN BAHASA ===
- Sapa pembaca dengan "Anda". Kalimat pendek, aktif, dan jelas.
- JANGAN pakai istilah teknis: jangan tulis deploy, database, environment, RLS, bucket,
  CMS, cache, token, API, server, hosting. Ganti dengan bahasa sehari-hari.
- JANGAN mengarang fitur. Panel ini HANYA punya 6 menu:
  Ringkasan, Analytics, Pengaturan Website, Media Library, Slide Beranda, Brand Partner.
  Tidak ada menu Produk, Kategori, Keranjang, Pesanan, Banner, atau Checkout.
  Pesanan pelanggan terjadi di GoFood, GrabMart, atau WhatsApp - bukan di panel ini.

=== STRUKTUR 24 SLIDE (ikuti urutan ini persis, jumlah slide harus tepat 24) ===
1.  Cover: Panduan Panel Admin Banyu Frozen Food
2.  Panduan Panel Admin + Apa Itu Panel Admin (pengantar dan manfaat)
3.  Alur Wajib Diingat (Ubah Isi - Pratinjau - Simpan Draft - Terbitkan)
4.  Cara Masuk ke Panel (3 langkah + alamat halaman)
5.  Jika Gagal Masuk (tabel arti 6 pesan)
6.  Mengenal Tampilan Panel + Keluar dengan Aman (sidebar, header, tombol Keluar)
7.  Menu Ringkasan (status, jumlah konten, pantauan pengunjung)
8.  Arti Status Website (Terbit vs Ada draft + tanggal)
9.  Menu Analytics + Apa yang Dihitung (periode, metrik, traffic, minat kanal)
10. 6 Tab Isi Website (tabel 6 tab + fungsi masing-masing)
11. Kontak dan Jam Buka (field penting + contoh pengisian)
12. Galeri Foto Toko (cara menambah foto + tips foto)
13. Simpan dan Terbitkan (4 tombol aksi + beda simpan vs terbit)
14. Pratinjau Sebelum Tayang (cara cek dulu sebelum pelanggan melihat)
15. Media Library (kategori, batas ukuran, upload, tambah dari link)
16. Mencari Gambar (filter, pencarian, badge "Dipakai", salin & hapus)
17. Slide Beranda (field, batas karakter, urutan, aktif/nonaktif)
18. Pratinjau Laptop dan HP (perbedaan tata letak + cara crop)
19. Brand Partner (field + spesifikasi logo 160x80)
20. Panel dari HP (cara buka menu + bagian yang berpindah tempat)
21. Tips Menulis Teks Slide (batas karakter + aturan praktis)
22. Tips Memilih Gambar (ukuran ideal + yang harus dihindari)
23. Masalah Umum (tabel 6 masalah dan solusinya)
24. Lima Langkah Pertama + Penutup (aksi pemilik toko baru dan pesan penguat)

=== KHUSUS SLIDE YANG MEMUAT SCREENSHOT ===
- Token seperti [[SCREENSHOT-01: Halaman Login]] menandai tempat gambar.
- Tampilkan tangkapan layar berukuran sedang (sekitar 45% lebar slide), BUKAN memenuhi slide,
  agar sisa ruang tetap terisi butir isi dan kotak sorotan.
- Di samping screenshot WAJIB ada butir isi atau kotak penjelas, jangan biarkan kosong.
```

---

## Bagian B — Skrip isi per slide (tempel setelah deck jadi)

Bagian ini yang menggantikan isi tiap slide supaya padat. Tempel blok per blok, atau
tempel seluruhnya dan minta Canva "gunakan teks ini untuk mengisi slide secara berurutan".

```
SLIDE 1 - Cover
Subjudul: Panduan lengkap mengelola website toko Anda sendiri
Isi: 24 slide, tanpa perlu mengerti coding
Kotak: Cocok untuk pemilik toko, admin, dan staf yang mengurus website
Visual: logo toko + ilustrasi sederhana laptop dan ponsel

SLIDE 2 - Panduan Panel Admin dan Apa Itu Panel Admin?
Subjudul: Satu tempat untuk mengubah seluruh isi website toko Anda
Butir:
1. Panel admin adalah halaman khusus untuk mengubah isi website toko Anda
2. Semua perubahan dilakukan lewat tombol, tidak ada kode yang perlu ditulis
3. Yang bisa diubah: kontak, jam buka, sosial media, teks beranda, foto galeri,
   slide beranda, dan logo brand
4. Perubahan tidak langsung terlihat pelanggan sampai Anda menerbitkannya
5. Panel ini TIDAK memproses pesanan, pembayaran, atau pengiriman pelanggan
6. Pesanan pelanggan tetap berjalan di aplikasi GoFood, GrabMart, atau WhatsApp
7. Empat hal yang akan Anda pelajari: masuk, mengubah isi, menyimpan, dan menerbitkan
Kotak Hati-hati: Jangan mencari menu Produk atau Keranjang di panel ini karena memang tidak ada
Kotak Yang perlu Anda tahu: Website hanya mencatat berapa kali pelanggan menekan tombol
menuju kanal pemesanan, bukan isi pesan atau data pribadinya
Visual: dua kolom berisi "Bisa diubah di panel" dan "Di luar panel" + 4 kotak bernomor

SLIDE 3 - Alur Wajib Diingat
Subjudul: Empat langkah yang berlaku di semua halaman pengaturan
Butir:
1. Ubah isi: Anda memperbarui teks, nomor kontak, foto, atau logo di halaman pengaturan
2. Pratinjau: lihat dulu hasilnya di tab baru sebelum pelanggan melihat
3. Simpan Draft: perubahan tersimpan tetapi belum tampil ke pengunjung
4. Terbitkan: perubahan baru tayang di website yang dilihat pelanggan
5. Batalkan Perubahan: mengembalikan semua isian ke simpanan terakhir Anda
Kotak Tips: Urutan ini berlaku untuk semua halaman pengaturan, jadi hafalkan empat langkahnya
Kotak Contoh: Ubah jam buka, klik Pratinjau untuk memastikan, Simpan Draft, lalu Terbitkan
Visual: diagram panah bernomor 1 sampai 4 dengan kotak "Terbitkan" berwarna kuning

SLIDE 4 - Cara Masuk ke Panel
Subjudul: Tiga langkah untuk mulai mengelola website
Butir:
1. Buka browser, lalu ketik alamat website toko Anda dan tambahkan /admin di belakangnya
2. Isi kolom Email dengan email yang terdaftar sebagai pengelola website
3. Isi kolom Password, lalu tekan tombol Masuk
4. Bila berhasil, Anda langsung diarahkan ke halaman Ringkasan
5. Jangan bagikan email dan password panel kepada siapa pun
Kotak Contoh: Alamat panel contoh: https://banyufrozenfood.com/admin
Kotak Tips: Simpan alamat /admin di bookmark browser agar cepat dibuka lain waktu
[[SCREENSHOT-01: Halaman Login]]
Visual: 3 kotak langkah bernomor + ikon gembok

SLIDE 5 - Jika Gagal Masuk
Subjudul: Arti pesan yang muncul di layar masuk
Butir:
1. Masukkan email yang valid: pesan ini muncul bila format email belum benar
2. Masukkan password: muncul bila kolom password masih kosong
3. Email atau password salah: kombinasi yang Anda ketik tidak cocok
4. Email belum dikonfirmasi: akun belum diaktifkan, hubungi pengelola website
5. Terlalu banyak percobaan masuk: tunggu beberapa menit lalu coba lagi
6. Tidak dapat terhubung ke server: periksa koneksi internet Anda
7. Perhatikan huruf besar, huruf kecil, dan angka pada password
Kotak Hati-hati: Jangan mencoba berulang kali terlalu cepat karena akan dibatasi sementara
[[SCREENSHOT-02: Pesan Error Login]]
Visual: tabel dua kolom berisi pesan dan artinya

SLIDE 6 - Mengenal Tampilan Panel dan Keluar dengan Aman
Subjudul: Orientasi menu dan cara mengakhiri sesi
Butir:
1. Sidebar kiri berisi daftar menu yang dibagi menjadi dua kelompok
2. Kelompok Workspace berisi Ringkasan dan Analytics
3. Kelompok Konten Website berisi Pengaturan Website, Media Library, Slide Beranda,
   dan Brand Partner
4. Header di atas menampilkan judul halaman yang sedang Anda buka
5. Tombol Buka Website di kanan atas membuka website di tab baru
6. Setelah selesai, tekan tombol Keluar di bagian paling bawah sidebar
7. Periksa dulu apakah masih ada perubahan yang belum diterbitkan sebelum keluar
Kotak Tips: Biasakan menerbitkan perubahan pada hari yang sama agar tidak terlupa
[[SCREENSHOT-03: Sidebar Menu]]
[[SCREENSHOT-04: Header dan Tombol Keluar]]
Visual: ilustrasi sidebar dengan 6 menu berlabel + tombol Keluar disorot

SLIDE 7 - Menu Ringkasan
Subjudul: Kondisi website dalam sekali lihat
Butir:
1. Halaman pembuka yang menampilkan kondisi website secara ringkas
2. Kartu Status Website menunjukkan apakah website sudah terbit atau masih ada draft
3. Bagian Konten yang dikelola menampilkan jumlah Slide Beranda, Brand Partner,
   dan Kanal Pemesanan
4. Bagian Monitoring Website menampilkan pengunjung hari ini, 7 hari, dan 30 hari
5. Aksi cepat berisi jalan pintas ke menu yang paling sering dipakai
6. Tersedia tombol Edit Website dan Lihat Pratinjau untuk mulai bekerja
Kotak Yang perlu Anda tahu: Angka pengunjung bersifat anonim, tanpa isi chat atau data pribadi
[[SCREENSHOT-05: Menu Ringkasan]]
Visual: 3 kartu statistik + 1 baris aksi cepat

SLIDE 8 - Arti Status Website
Subjudul: Membedakan Terbit dan Ada draft
Butir:
1. Status Terbit berarti pelanggan sudah melihat versi terbaru website Anda
2. Status Ada draft berarti ada perubahan yang tersimpan tetapi belum tayang
3. Terakhir Diperbarui menunjukkan kapan isi website terakhir Anda simpan
4. Terakhir Diterbitkan menunjukkan kapan perubahan terakhir tayang ke pelanggan
5. Penyimpanan menunjukkan apakah pengaturan tersimpan online atau hanya di browser
Kotak Hati-hati: Selama status masih Ada draft, pelanggan tetap melihat versi lama,
jadi terbitkan bila ingin perubahan terlihat
[[SCREENSHOT-06: Status Website]]
Visual: dua kartu berdampingan berlabel "Terbit" dan "Ada draft"

SLIDE 9 - Menu Analytics dan Apa yang Dihitung
Subjudul: Melihat minat pelanggan dari data kunjungan
Butir:
1. Anda bisa memilih periode 7 hari, 30 hari, atau 90 hari
2. Pengunjung unik menghitung jumlah orang yang membuka website
3. Page view menghitung total halaman yang dibuka pengunjung
4. Klik kanal menghitung berapa kali tombol menuju WhatsApp, GoFood, dan GrabMart ditekan
5. Grafik Traffic harian membandingkan pengunjung unik dengan jumlah halaman dibuka
6. Panel Minat kanal menunjukkan jumlah klik tiap kanal dan persentasenya
7. Pesanan dan pembayaran tetap diproses di aplikasi merchant masing-masing
Kotak Tips: Bandingkan periode 7 hari dan 30 hari untuk melihat hari yang paling ramai
Kotak Yang perlu Anda tahu: Analytics anonim, tanpa isi chat atau data pribadi pelanggan
[[SCREENSHOT-07: Menu Analytics]]
[[SCREENSHOT-08: Minat Kanal]]
Visual: grafik batang sederhana + 3 kartu metrik + daftar persentase kanal

SLIDE 10 - 6 Tab Isi Website
Subjudul: Peta pengaturan website
Butir:
1. Kontak & Jam Buka: nomor WhatsApp, email, alamat, peta, dan jadwal buka toko
2. Sosial Media: tautan Instagram, TikTok, dan Facebook yang muncul di footer
3. Navbar & Footer: deskripsi singkat toko dan catatan kecil di bagian bawah website
4. Isi Beranda: teks beranda, keunggulan, kanal pemesanan, dan area layanan
5. Galeri Toko: foto suasana toko yang tampil di halaman lokasi
6. SEO: judul, deskripsi, dan gambar yang muncul saat link dibagikan
Kotak Tips: Ubah satu tab, simpan, dan terbitkan agar mudah melacak bila ada kesalahan
[[SCREENSHOT-09: Tab Pengaturan Website]]
Visual: tabel enam baris berisi nama tab dan fungsinya

SLIDE 11 - Kontak dan Jam Buka
Subjudul: Data yang paling sering dipakai website
Butir:
1. Nomor WhatsApp diisi format internasional tanpa tanda plus dan tanpa spasi
2. Nomor ini otomatis dipakai di tombol chat, halaman lokasi, dan footer website
3. Pesan Otomatis WhatsApp adalah teks yang sudah terisi saat pelanggan menekan tombol chat
4. Alamat Singkat tampil di footer, sedangkan Alamat Lengkap tampil di halaman lokasi
5. Link Google Maps membuka peta saat tombol Buka di Google Maps ditekan
6. Jam operasional diisi per baris dan bisa diatur urutannya
Kotak Contoh: Isi nomor seperti 6281234567890, bukan 0812-3456-7890
Kotak Hati-hati: Nomor yang salah format akan ditandai merah dan tidak bisa disimpan
[[SCREENSHOT-10: Tab Kontak dan Jam Buka]]
Visual: potongan form kontak + tabel jam buka

SLIDE 12 - Galeri Foto Toko
Subjudul: Menampilkan suasana toko kepada calon pembeli
Butir:
1. Galeri Toko berisi foto suasana toko yang tampil di halaman lokasi website
2. Ada sakelar untuk menampilkan atau menyembunyikan seluruh galeri
3. Setiap foto diberi label singkat, misalnya Tampak depan toko atau Area freezer
4. Gunakan foto asli toko agar pelanggan mudah mengenali lokasi
5. Foto akan dipotong otomatis oleh website, jadi letakkan bagian penting di tengah
6. Tersedia juga Judul Galeri dan Deskripsi Galeri yang bisa Anda ubah
Kotak Tips: Ambil foto saat toko terang dan rapi supaya hasilnya menarik
[[SCREENSHOT-11: Tab Galeri Toko]]
Visual: contoh susunan tiga foto galeri + kotak label

SLIDE 13 - Simpan dan Terbitkan
Subjudul: Empat tombol aksi yang paling penting
Butir:
1. Simpan Draft menyimpan perubahan Anda tetapi pelanggan belum melihatnya
2. Pratinjau membuka tampilan sementara di tab baru supaya Anda bisa memeriksa hasilnya
3. Terbitkan menayangkan perubahan ke website yang dilihat pelanggan
4. Batalkan Perubahan mengembalikan semua isian ke simpanan terakhir Anda
5. Tombol Terbitkan menampilkan konfirmasi sebelum perubahan ditayangkan
6. Selama draft belum diterbitkan, muncul peringatan di halaman pengaturan
Kotak Yang perlu Anda tahu: Pratinjau tidak mengubah apa pun bagi pelanggan, jadi aman
dipakai berkali-kali sebelum menerbitkan
[[SCREENSHOT-12: Tombol Aksi Pengaturan]]
Kotak Contoh: Simpan Draft untuk besok, Terbitkan setelah Anda yakin teksnya sudah benar
Visual: 4 kotak tombol berwarna berbeda dengan penjelasan singkat

SLIDE 14 - Pratinjau Sebelum Tayang
Subjudul: Memeriksa hasil sebelum pelanggan melihat
Butir:
1. Tekan tombol Pratinjau untuk membuka website versi sementara di tab baru
2. Versi pratinjau menampilkan perubahan yang belum diterbitkan
3. Hanya orang yang sudah masuk panel yang bisa melihat versi pratinjau
4. Di versi pratinjau muncul penanda bahwa ini bukan tampilan untuk pelanggan
5. Periksa ejaan, nomor kontak, dan gambar sebelum menekan Terbitkan
6. Periksa juga tampilan di ponsel karena tata letaknya berbeda dari laptop
Kotak Tips: Minta satu orang lain membaca hasil pratinjau untuk menangkap salah ketik
[[SCREENSHOT-14: Mode Pratinjau]]
Visual: dua bingkai berlabel "Versi pelanggan" dan "Versi pratinjau"

SLIDE 15 - Media Library
Subjudul: Menyimpan gambar sekali untuk dipakai berkali-kali
Butir:
1. Media Library adalah tempat menyimpan gambar sekali lalu dipakai berkali-kali
2. Ada empat kategori gambar: Gambar, Logo, Banner, dan Foto Toko
3. Pilih kategori lebih dulu, lalu tekan tombol upload gambar
4. Di ponsel, tombol upload membuka file atau kamera perangkat Anda
5. Format yang didukung: PNG, JPG, WebP, SVG, dan GIF
6. Selain upload, gambar juga bisa ditambahkan dengan menempelkan tautan dari internet
Kotak Hati-hati: Batas ukuran gambar adalah 2 MB saat penyimpanan online, dan 400 KB
saat penyimpanan masih di browser
[[SCREENSHOT-15: Menu Media Library]]
Visual: toolbar upload + deretan kartu gambar

SLIDE 16 - Mencari Gambar
Subjudul: Menemukan gambar dan mengetahui mana yang sudah dipakai
Butir:
1. Chip kategori di atas daftar berfungsi menyaring gambar: Semua, Gambar, Logo,
   Banner, atau Foto Toko
2. Kotak pencarian dipakai untuk mencari gambar berdasarkan namanya
3. Filter status memisahkan gambar yang sudah dipakai dan belum dipakai
4. Badge Dipakai menandakan gambar tersebut sedang tampil di website
5. Tombol salin menyalin tautan gambar agar bisa dipakai di tempat lain
6. Tombol hapus menghapus gambar dari perpustakaan
Kotak Hati-hati: Menghapus gambar yang masih dipakai akan membuat gambarnya hilang
dari website, jadi periksa badge Dipakai terlebih dahulu
[[SCREENSHOT-17: Kartu Media Terpakai]]
Visual: contoh kartu gambar dengan badge Dipakai dan dua tombol ikon

SLIDE 17 - Slide Beranda
Subjudul: Gambar besar paling atas di halaman depan
Butir:
1. Slide Beranda adalah gambar besar paling atas di halaman depan website
2. Urutan menentukan slide mana yang tampil lebih dulu, mulai dari angka terkecil
3. Sakelar Aktif atau Nonaktif mengatur apakah slide ditampilkan atau disembunyikan
4. Judul slide sebaiknya di bawah 40 karakter agar tetap rapi di layar ponsel
5. Deskripsi slide sebaiknya di bawah 120 karakter agar tidak menutupi gambar
6. Tersedia penghitung karakter di samping kolom, contohnya 42/60
7. Gambar disarankan berukuran 1200x600 piksel dengan ukuran di bawah 500 KB
Kotak Tips: Cukup pakai 5-6 slide agar website tetap cepat dibuka
[[SCREENSHOT-18: Menu Slide Beranda]]
[[SCREENSHOT-19: Form Slide Plus Penghitung]]
Visual: tabel slide + contoh penghitung karakter berwarna kuning

SLIDE 18 - Pratinjau Laptop dan HP
Subjudul: Tata letak slide berbeda di dua ukuran layar
Butir:
1. Di laptop, teks slide berada di kiri tengah dengan tombol berukuran sedang
2. Di HP, teks slide berpindah ke tengah bawah dengan tombol selebar layar
3. Di laptop muncul tombol panah untuk berpindah slide, di HP tidak muncul
4. Perbedaan ini otomatis, Anda tidak perlu membuat dua versi slide
5. Gunakan tombol Sesuaikan Gambar untuk memotong dan menggeser gambar agar pas
6. Letakkan bagian penting gambar di tengah karena sisi gambar akan terpotong
Kotak Yang perlu Anda tahu: Karena tata letak berbeda, selalu periksa pratinjau di
kedua ukuran sebelum menerbitkan
[[SCREENSHOT-20: Pratinjau Laptop dan HP]]
Kotak Tips: Pilih proporsi 2:1 saat memotong gambar slide agar seragam
Visual: dua bingkai berdampingan berlabel Laptop dan HP

SLIDE 19 - Brand Partner
Subjudul: Logo merek yang tampil di halaman beranda
Butir:
1. Brand Partner adalah logo merek yang tampil di bagian brand pada halaman beranda
2. Setiap entri punya nama merek, logo, alamat website opsional, urutan, dan status
3. Ukuran logo yang disarankan 160x80 piksel dengan perbandingan 2:1
4. Gunakan PNG dengan latar transparan agar logo menyatu dengan latar website
5. Alamat website diisi bila logo ingin bisa diklik oleh pengunjung
6. Sakelar Aktif atau Nonaktif bisa diubah langsung dari tabel tanpa membuka form
Kotak Hati-hati: Hindari gambar penuh tulisan atau resolusi rendah karena akan terlihat pecah
[[SCREENSHOT-22: Menu Brand Partner]]
Visual: contoh tiga logo dalam kartu + keterangan ukuran

SLIDE 20 - Panel dari HP
Subjudul: Mengelola website lewat ponsel
Butir:
1. Panel bisa dipakai dari ponsel tanpa aplikasi tambahan, cukup lewat browser
2. Tekan ikon menu berbentuk tiga garis di kiri atas untuk membuka daftar menu
3. Daftar menu muncul dari sisi kiri, tutup dengan tombol silang atau tombol kembali
4. Tabel di panel berubah menjadi susunan kartu agar mudah dibaca di layar sempit
5. Tombol simpan pada halaman pengaturan menempel di bawah layar agar mudah ditekan
6. Judul halaman tetap terlihat di header sehingga Anda tahu sedang berada di menu mana
Kotak Tips: Untuk mengubah teks panjang, lebih nyaman memakai laptop lalu periksa
hasilnya di ponsel
[[SCREENSHOT-23: Panel di HP]]
Visual: dua bingkai ponsel berisi daftar menu dan kartu data

SLIDE 21 - Tips Menulis Teks Slide
Subjudul: Batas karakter agar teks tetap rapi
Butir:
1. Judul slide: maksimal 60 karakter, sebaiknya di bawah 40 karakter
2. Subtitle slide: maksimal 80 karakter
3. Deskripsi slide: maksimal 200 karakter, sebaiknya di bawah 120 karakter
4. Teks tombol: maksimal 25 karakter, contohnya Cara Pesan atau Chat WhatsApp
5. Gunakan kalimat singkat dan hindari huruf kapital semua
6. Isi juga Judul Website sekitar 120 sampai 160 karakter untuk keperluan pencarian
Kotak Tips: Sebelum menerbitkan, periksa empat hal: ejaan, nomor kontak, gambar,
dan tampilan di ponsel
[[SCREENSHOT-21: Crop Gambar]]
Visual: tabel batas karakter + contoh teks yang baik dan terlalu panjang

SLIDE 22 - Tips Memilih Gambar
Subjudul: Ukuran dan jenis gambar yang aman
Butir:
1. Gambar slide berukuran ideal 1200x600 piksel dengan perbandingan 2:1
2. Ukuran berkas sebaiknya di bawah 500 KB dan maksimal 1 MB
3. Format yang disarankan JPG atau WebP, dan PNG untuk gambar berlogo
4. Letakkan bagian penting gambar di area tengah karena sisi gambar akan terpotong
5. Logo brand partner sebaiknya 160x80 piksel dengan latar transparan
6. Hindari gambar penuh tulisan karena tulisan akan sulit dibaca di ponsel
7. Hindari gambar kontras rendah karena teks putih di atasnya jadi tidak terbaca
Kotak Contoh: Foto produk tersusun rapi dengan ruang kosong di sisi kiri untuk teks
Visual: perbandingan gambar baik dan gambar kurang baik + tabel spesifikasi

SLIDE 23 - Masalah Umum
Subjudul: Solusi cepat untuk kendala yang sering terjadi
Butir:
1. Perubahan tidak terlihat pelanggan: Anda belum menekan tombol Terbitkan
2. Tidak bisa masuk panel: periksa email dan password, atau minta atur ulang ke pengelola
3. Upload gambar gagal karena ukuran: perkecil gambar ke bawah 2 MB atau 400 KB
4. Gambar menghilang dari website: gambar dihapus dari perpustakaan padahal masih dipakai
5. Pemotongan gambar dari tautan tidak bisa: unggah dulu gambarnya lalu potong
6. Peta tidak muncul: periksa kembali Link Peta Tertanam di tab Kontak & Jam Buka
7. Data statistik tidak muncul: periksa koneksi internet lalu muat ulang halaman
Kotak Yang perlu Anda tahu: Sebagian besar masalah selesai dengan memeriksa apakah
perubahan sudah diterbitkan
Visual: tabel dua kolom berisi masalah dan solusi

SLIDE 24 - Lima Langkah Pertama dan Penutup
Subjudul: Mulai dari langkah kecil hari ini
Butir:
1. Isi Kontak & Jam Buka supaya tombol chat dan halaman lokasi langsung berfungsi
2. Unggah foto toko ke Media Library dengan kategori Foto Toko
3. Atur Slide Beranda: pilih gambar, tulis judul singkat, dan isi teks tombol
4. Periksa tampilan di ponsel memakai Pratinjau untuk memastikan semuanya rapi
5. Tekan Terbitkan agar semua perubahan tayang ke pelanggan
6. Semua isi website bisa Anda ubah sendiri kapan saja tanpa bantuan developer
7. Cukup ingat empat langkah: Ubah Isi, Pratinjau, Simpan Draft, Terbitkan
Kotak Tips: Kerjakan satu langkah per hari agar tidak kewalahan dan mudah diperiksa
Kotak Yang perlu Anda tahu: Bila menemui kendala, hubungi pengelola website dengan
menyebutkan halaman dan pesan yang muncul
Visual: lima kotak bernomor + kalimat ajakan besar + kontak pengelola

```

---

## Bagian C — Placeholder screenshot

Token di bawah dipakai di Bagian B. Ganti satu per satu dengan screenshot asli.
Kolom **Aspek** adalah rasio yang disarankan agar gambar tidak gepeng.
Semua screenshot berukuran **sedang** (±45% lebar slide), sisanya diisi butir isi dan kotak.

| Token | Isi screenshot | Aspek | Catatan pengambilan |
|---|---|---|---|
| `[[SCREENSHOT-01: Halaman Login]]` | Halaman masuk panel admin | 16:10 | Buka `/admin` tanpa login |
| `[[SCREENSHOT-02: Pesan Error Login]]` | Contoh pesan "Email atau password salah." | 16:10 | Sengaja salah password |
| `[[SCREENSHOT-03: Sidebar Menu]]` | Sidebar dengan 2 kelompok menu | 3:4 | Mode HP lebih jelas, atau potong sisi kiri di laptop |
| `[[SCREENSHOT-04: Header dan Tombol Keluar]]` | Header atas + tombol Keluar di bawah sidebar | 16:10 | Tampilkan keduanya dalam satu tangkapan |
| `[[SCREENSHOT-05: Menu Ringkasan]]` | Halaman Ringkasan penuh | 16:10 | Gulir ke atas |
| `[[SCREENSHOT-06: Status Website]]` | Kartu status: Terbit atau Ada draft | 16:10 | Potong hanya kartunya |
| `[[SCREENSHOT-07: Menu Analytics]]` | Halaman Analytics + grafik traffic harian | 16:10 | Pilih periode 30 hari |
| `[[SCREENSHOT-08: Minat Kanal]]` | Panel "Minat kanal" dengan persentase | 16:10 | Potong hanya panelnya |
| `[[SCREENSHOT-09: Tab Pengaturan Website]]` | Deretan 6 tab Pengaturan Website | 16:10 | Sorot salah satu tab |
| `[[SCREENSHOT-10: Tab Kontak dan Jam Buka]]` | Form kontak dan jam operasional | 16:10 | Buka tab Kontak & Jam Buka |
| `[[SCREENSHOT-11: Tab Galeri Toko]]` | Form galeri foto toko | 16:10 | Buka tab Galeri Toko |
| `[[SCREENSHOT-12: Tombol Aksi Pengaturan]]` | 4 tombol: Simpan Draft, Pratinjau, Terbitkan, Batalkan Perubahan | 16:10 | Gulir ke bawah form |
| `[[SCREENSHOT-14: Mode Pratinjau]]` | Website dengan penanda mode pratinjau | 16:10 | Klik Pratinjau, tangkap tab baru bagian bawah |
| `[[SCREENSHOT-15: Menu Media Library]]` | Toolbar upload + daftar gambar | 16:10 | Tampilkan beberapa gambar |
| `[[SCREENSHOT-17: Kartu Media Terpakai]]` | Kartu gambar dengan badge "Dipakai: ..." | 16:10 | Cari gambar yang sedang dipakai |
| `[[SCREENSHOT-18: Menu Slide Beranda]]` | Tabel daftar slide | 16:10 | Tampilkan 2-3 slide |
| `[[SCREENSHOT-19: Form Slide Plus Penghitung]]` | Form slide dengan penghitung karakter | 16:10 | Isi judul sampai muncul "hampir penuh" |
| `[[SCREENSHOT-20: Pratinjau Laptop dan HP]]` | Dua bingkai pratinjau berdampingan | 16:10 | Bagian paling penting, ambil lebar penuh |
| `[[SCREENSHOT-21: Crop Gambar]]` | Dialog Sesuaikan Gambar | 16:10 | Klik tombol crop di form slide |
| `[[SCREENSHOT-22: Menu Brand Partner]]` | Tabel brand partner | 16:10 | Tampilkan 3-4 logo |
| `[[SCREENSHOT-23: Panel di HP]]` | Panel admin di layar ponsel | 9:16 | Buka di HP asli atau mode perangkat |

**21 screenshot**, bukan 24. Sisanya diisi blok pengisi wajib, jadi tidak ada slide kosong.

### Cara mengambil screenshot yang rapi

1. **Masuk dulu** ke panel admin di `https://<domain-anda>/admin`.
2. **Rapikan tampilan**: tutup notifikasi lain, tunggu data selesai dimuat ("Memuat..." hilang).
3. **Ukuran jendela**: pakai lebar ±1440px untuk tampilan laptop. Untuk tampilan HP, gunakan
   mode perangkat di browser (F12 → ikon ponsel) dan pilih lebar 390px.
4. **Tangkap layar**: Windows `Win + Shift + S` (pilih area), Mac `Cmd + Shift + 4`.
5. **Potong bagian yang penting saja** - hindari menyertakan alamat website, email admin,
   atau data pribadi apa pun.
6. **Simpan** dengan nama sesuai token, mis. `screenshot-01-login.png`, agar mudah dipasangkan.
7. **Jangan sertakan** nomor WhatsApp asli yang sensitif bila tutorial akan dibagikan luas.

### Aset pendukung

- Logo: ambil dari file `src/assets/banyu-logo.svg` (versi berwarna) dan
  `src/assets/banyu-logo-white.svg` (versi putih untuk latar gelap).
- Gambar latar contoh slide: `public/hero-guide-bg.png`.
- Palet warna: `#0099FF`, `#0077CC`, `#E6F4FF`, aksen `#FFD700`, teks `#1A1A2E`, latar `#F8FAFC`.

---

## Bagian D — Kalimat bantu yang bisa dipakai di slide

Kalimat di bawah sudah disesuaikan dengan teks asli aplikasi, jadi aman dikutip.

**Alur kerja (dari kotak bantuan di halaman Pengaturan Website):**

> Ubah isi -> **Pratinjau** (lihat dulu di tab baru) -> **Simpan Draft** (simpan, belum tampil
> ke pengunjung) -> **Terbitkan** (baru tampil ke pengunjung). **Batalkan Perubahan**
> mengembalikan semua isian ke draft terakhir yang kamu simpan.

**Catatan pesanan (dari halaman Ringkasan dan Analytics):**

> Website mencatat klik, bukan detail pesanan. Cek order dan status transaksi langsung
> di WhatsApp Business, GoFood Merchant, atau GrabMerchant.

**Tentang analitik:**

> Analytics anonim, tanpa isi chat atau data pribadi.

**Panduan slide beranda:**

> Gambar dipotong otomatis - letakkan bagian penting di tengah agar aman di laptop
> maupun HP.

**Tentang menu navigasi website:**

> Menu navigasi sudah tetap (Beranda, Tentang, Cara Pesan, Lokasi) dan otomatis muncul
> di bagian atas website serta di footer. Tidak perlu diatur.

**Tentang penyimpanan gambar:**

> Simpan gambar sekali, pakai berulang kali di seluruh website.

**Tentang catatan kecil di footer:**

> Contoh pengisian: nama sekolah atau kredit project.

---

## Catatan penting untuk penulis tutorial

- Panel ini **tidak** punya katalog produk, keranjang, atau checkout. Jangan menampilkan
  tangkapan layar produk karena halamannya sudah tidak ada.
- Semua perubahan hanya terlihat pelanggan **setelah** tombol **Terbitkan** ditekan.
- Data pada prompt ini memakai **contoh (dummy)**, bukan data toko sebenarnya. Ganti sebelum
  dibagikan ke publik bila diperlukan.
- Jika tabel pengaturan di layanan online belum disiapkan, panel menampilkan peringatan
  bahwa perubahan hanya tersimpan di browser yang sedang dipakai. Sampaikan ke pemilik toko
  untuk menghubungi pengelola website bila melihat pesan tersebut.
- Bila hasil Canva masih terasa kosong, ulangi dengan menekan bagian **ATURAN ANTI-KOSONG**
  di Bagian A, dan tempel ulang **Bagian B** sebagai isi slide.
- Untuk panduan teknis (bukan untuk pemilik toko), lihat
  `docs/Dokumentasi-Panel-Admin.md` dan `docs/Dokumentasi-Struktur-Database.md`.
