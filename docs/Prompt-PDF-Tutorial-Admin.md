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

## Bagian E — Prompt versi EXTRA LENGKAP (pakai ini bila hasil pertama masih terlalu sedikit)

Gunakan bagian ini bila dua prompt sebelumnya masih menghasilkan slide yang terasa sedikit.
Bagian E menaikkan kuota isi secara agresif: **8–10 butir per slide**, **3 blok pengisi wajib**,
**minimal 4 elemen visual**, plus tambahan **tabel rinci** dan **daftar istilah**.

Cara pakai: tempel **E-1** sebagai prompt utama, lalu **E-2** sebagai isi slide.
Jangan campur dengan Bagian A/B agar tidak saling bertentangan.

### E-1 — Prompt utama versi extra lengkap

```
Buat presentasi tutorial berbahasa Indonesia berjudul "Panduan Panel Admin Banyu Frozen Food"
untuk PEMILIK TOKO yang tidak mengerti istilah teknis. Ukuran 16:9 (1920x1080). Tepat 24 slide.

=== KUOTA ISI (WAJIB DIPENUHI SEMUA) ===
- Setiap slide WAJIB terisi minimal 85% area. Area putih kosong maksimal 15%.
- Setiap slide WAJIB punya 8 butir isi. Tidak boleh kurang dari 8.
- Setiap butir isi WAJIB berupa kalimat lengkap, panjang 15 sampai 25 kata.
- Setiap butir isi WAJIB diawali kata kerja atau kata benda konkret, bukan kata samar.
- Setiap slide WAJIB punya judul + subjudul + 8 butir isi + 3 blok pengisi + 1 tabel atau diagram.
- Setiap slide WAJIB punya minimal 4 elemen visual.
- DILARANG menulis butir yang hanya 3 sampai 6 kata.
- DILARANG membuat slide yang hanya berisi judul dan satu baris teks.
- Bila ruang terasa sempit, KECILKAN ukuran huruf isi menjadi 14 sampai 16 poin,
  JANGAN kurangi jumlah butir.
- Jumlah slide harus tepat 24. Jangan menambah atau mengurangi.

=== CARA MEMENUHI KUOTA BILA MATERI TERASA KURANG ===
Bila suatu topik hanya punya sedikit materi, tambahkan isi dengan cara berikut:
1. Tambahkan satu butir "Apa yang Anda lihat di layar" yang menjelaskan tampilan halaman.
2. Tambahkan satu butir "Apa yang terjadi bila salah" yang menjelaskan akibat kesalahan.
3. Tambahkan satu butir "Kapan dipakai" yang menjelaskan situasi pemakaiannya.
4. Tambahkan satu butir "Berapa lama" yang menjelaskan perkiraan waktu pengerjaan.
5. Tambahkan satu butir "Siapa yang mengerjakan" bila ada pembagian tugas.
6. Tambahkan baris tabel berisi contoh pengisian yang benar dan yang salah.
7. Tambahkan blok istilah yang menjelaskan satu istilah panel dengan bahasa sehari-hari.
Jangan pernah mengosongkan slide. Selalu tambah, jangan kurangi.

=== 3 BLOK PENGISI WAJIB PER SLIDE (ketiganya harus ada) ===
1. Kotak "Yang perlu Anda tahu" - latar #E6F4FF, 3 kalimat penjelas.
2. Kotak "Tips" - latar kuning #FFD700, 2 tips praktis bernomor.
3. Kotak "Hati-hati" ATAU "Contoh" - latar merah muda atau abu #F8FAFC, 2 kalimat.
Tambahan yang dianjurkan bila masih longgar:
4. Strip "Istilah" - satu istilah panel dijelaskan singkat.
5. Baris "Waktu pengerjaan" - perkiraan menit yang dibutuhkan.
6. Bilah "Tahukah Anda" - satu fakta singkat tentang website toko.

=== TABEL DAN DIAGRAM WAJIB ===
Setiap slide harus memuat SALAH SATU dari berikut, minimal 4 baris:
- Tabel dua kolom: "Yang Anda lakukan" dan "Yang terjadi"
- Tabel tiga kolom: "Tombol", "Fungsinya", "Kapan dipakai"
- Tabel batas karakter: "Bagian", "Batas", "Saran"
- Tabel spesifikasi gambar: "Jenis gambar", "Ukuran", "Format", "Batas berkas"
- Tabel pesan error: "Pesan di layar", "Artinya", "Yang harus dilakukan"
- Diagram panah bernomor 4 sampai 6 langkah
- Daftar centang 5 langkah dengan ikon centang

=== GAYA VISUAL ===
- Padat informasi, rapi, terstruktur, tanpa ruang menganggur.
- Warna utama: biru #0099FF, biru tua #0077CC, biru sangat muda #E6F4FF.
- Aksen kuning #FFD700 untuk tombol dan langkah penting.
- Teks gelap #1A1A2E di atas latar putih atau #F8FAFC.
- Judul slide tebal 32 sampai 36 poin, subjudul 18 poin, isi 14 sampai 16 poin.
- Butir isi rata kiri, jarak antarbutir cukup agar tetap terbaca.
- Susun isi dalam DUA KOLOM bila butir lebih dari 6 agar tidak ada ruang kosong di bawah.
- Sertakan nomor slide, nama bab, dan nama toko di footer setiap slide.
- Ikon garis sederhana, tanpa foto stok orang.

=== DATA CONTOH (dummy, pakai konsisten di semua slide) ===
- Nama toko: Banyu Frozen Food
- Lokasi: Cigugur Tengah, Cimahi Tengah, Kota Cimahi
- Nomor WhatsApp contoh: 6281234567890
- Jam buka: Senin-Jumat 08.00-20.00 WIB, Sabtu 08.00-21.00 WIB, Minggu 09.00-18.00 WIB
- Rentang harga: Rp10.000 - Rp49.000 per item
- Kanal pemesanan: GoFood, GrabMart, WhatsApp (Shopee dan Tokopedia opsional)
- Contoh judul slide beranda: "Stok Makanan Praktis"
- Contoh tombol slide: "Cara Pesan"
- Contoh nama foto galeri: "Tampak depan toko", "Area freezer"

=== ATURAN BAHASA ===
- Sapa pembaca dengan "Anda". Kalimat pendek, aktif, dan jelas.
- JANGAN pakai istilah teknis: deploy, database, environment, RLS, bucket, CMS, cache,
  token, API, server, hosting. Ganti dengan bahasa sehari-hari.
- JANGAN mengarang fitur. Panel ini HANYA punya 6 menu: Ringkasan, Analytics,
  Pengaturan Website, Media Library, Slide Beranda, Brand Partner.
  Tidak ada menu Produk, Kategori, Keranjang, Pesanan, Banner, atau Checkout.
  Pesanan pelanggan terjadi di GoFood, GrabMart, atau WhatsApp.

=== STRUKTUR 24 SLIDE (ikuti persis) ===
1.  Cover: Panduan Panel Admin Banyu Frozen Food
2.  Panduan Panel Admin + Apa Itu Panel Admin
3.  Alur Wajib Diingat (Ubah Isi - Pratinjau - Simpan Draft - Terbitkan)
4.  Cara Masuk ke Panel
5.  Jika Gagal Masuk (tabel arti 6 pesan)
6.  Mengenal Tampilan Panel + Keluar dengan Aman
7.  Menu Ringkasan
8.  Arti Status Website (Terbit vs Ada draft)
9.  Menu Analytics + Apa yang Dihitung
10. 6 Tab Isi Website
11. Kontak dan Jam Buka
12. Galeri Foto Toko
13. Simpan dan Terbitkan (4 tombol aksi)
14. Pratinjau Sebelum Tayang
15. Media Library
16. Mencari Gambar (filter, badge "Dipakai")
17. Slide Beranda (field, batas karakter, urutan)
18. Pratinjau Laptop dan HP
19. Brand Partner (logo 160x80)
20. Panel dari HP
21. Tips Menulis Teks Slide (batas karakter)
22. Tips Memilih Gambar
23. Masalah Umum (tabel 6 masalah)
24. Lima Langkah Pertama + Penutup

=== KHUSUS SCREENSHOT ===
- Token seperti [[SCREENSHOT-01: Halaman Login]] menandai tempat gambar.
- Ukuran tangkapan layar sedang (sekitar 40% lebar slide), jangan memenuhi slide.
- Di sekitar screenshot WAJIB ada minimal 4 butir isi dan 2 blok pengisi.
- Bila satu slide punya dua token, susun keduanya berdampingan agar hemat ruang.
```

### E-2 — Skrip isi versi extra lengkap

Setiap blok di bawah sudah berisi 8 butir + 3 blok pengisi + arahan tabel/diagram.
Materi di sini lebih rinci daripada Bagian B, termasuk akibat kesalahan, perkiraan waktu,
dan contoh pengisian.

```
SLIDE 1 - Cover
Subjudul: Panduan lengkap mengelola website toko Anda sendiri
Butir:
1. Panduan ini disusun untuk pemilik toko Banyu Frozen Food dan staf yang mengurus website
2. Seluruh isi website bisa Anda ubah sendiri tanpa perlu memahami bahasa pemrograman
3. Ada 24 halaman penjelasan yang tersusun dari cara masuk sampai cara menerbitkan perubahan
4. Setiap halaman dilengkapi contoh pengisian memakai data contoh agar mudah diikuti
5. Anda akan belajar membedakan perubahan yang masih tersimpan dan yang sudah tayang
6. Anda juga akan belajar mengelola gambar, slide beranda, dan logo merek dengan rapi
7. Bagian akhir berisi daftar masalah yang sering terjadi beserta cara mengatasinya
8. Simpan panduan ini agar bisa dibuka kembali setiap kali Anda ingin mengubah isi website
Blok Yang perlu Anda tahu: Tidak ada satu pun langkah di panduan ini yang memerlukan
bantuan teknis. Semua dilakukan lewat tombol di halaman panel admin.
Blok Tips: (1) Bacalah berurutan sekali dari awal sampai akhir. (2) Tandai halaman yang
paling sering Anda butuhkan, misalnya halaman kontak dan slide beranda.
Blok Hati-hati: Perubahan tidak akan terlihat pelanggan sampai Anda menekan tombol
Terbitkan, jadi jangan mengira perubahan Anda gagal hanya karena belum terlihat.
Tabel: "Bab", "Isi", "Halaman" - tiga baris berisi bab pengenalan, pengaturan, dan penutup
Visual: logo toko di tengah, enam ikon menu panel di sekelilingnya

SLIDE 2 - Panduan Panel Admin dan Apa Itu Panel Admin?
Subjudul: Satu tempat untuk mengubah seluruh isi website toko Anda
Butir:
1. Panel admin adalah halaman khusus yang hanya bisa dibuka oleh pengelola website toko
2. Semua perubahan dilakukan lewat tombol dan kolom isian, tanpa menulis kode apa pun
3. Isi yang bisa Anda ubah: nomor kontak, jam buka, alamat, sosial media, dan tautan peta
4. Anda juga bisa mengubah teks beranda, daftar keunggulan, dan area layanan toko
5. Foto galeri, slide beranda, dan logo merek juga dikelola dari panel yang sama
6. Perubahan tidak langsung terlihat pelanggan sampai Anda menekan tombol Terbitkan
7. Panel ini TIDAK memproses pesanan, pembayaran, pengiriman, atau pembatalan pesanan
8. Pesanan pelanggan tetap berjalan di aplikasi GoFood, GrabMart, atau WhatsApp
Blok Yang perlu Anda tahu: Website hanya mencatat berapa kali pelanggan menekan tombol
menuju kanal pemesanan. Isi percakapan dan data pribadi pelanggan tidak pernah disimpan.
Blok Tips: (1) Mulailah dari tab Kontak & Jam Buka karena datanya dipakai di banyak tempat.
(2) Kerjakan satu bagian per hari agar tidak kewalahan saat pertama kali memakai panel.
Blok Hati-hati: Jangan mencari menu Produk, Keranjang, atau Pesanan di panel ini karena
menu tersebut memang tidak ada. Transaksi selalu terjadi di aplikasi pemesanan.
Tabel: "Bisa diubah di panel" dan "Tidak ada di panel" - empat baris perbandingan
Visual: dua kolom bersebelahan dengan tanda centang dan tanda silang

SLIDE 3 - Alur Wajib Diingat
Subjudul: Empat langkah yang berlaku di semua halaman pengaturan
Butir:
1. Langkah pertama, ubah isi: Anda memperbarui teks, nomor kontak, foto, atau logo merek
2. Langkah kedua, pratinjau: buka versi sementara di tab baru untuk memeriksa hasilnya
3. Langkah ketiga, simpan draft: perubahan tersimpan tetapi belum tampil ke pengunjung
4. Langkah keempat, terbitkan: perubahan baru tayang di website yang dilihat pelanggan
5. Ada juga tombol Batalkan Perubahan untuk kembali ke simpanan terakhir Anda
6. Tombol Simpan Draft tidak mengubah apa pun bagi pelanggan, jadi aman ditekan berkali-kali
7. Tombol Terbitkan menampilkan konfirmasi lebih dulu sebelum perubahan ditayangkan
8. Selama draft belum diterbitkan, halaman pengaturan menampilkan peringatan kuning
Blok Yang perlu Anda tahu: Simpan Draft berguna saat Anda belum yakin dengan teksnya.
Anda bisa menyimpan dulu, menutup panel, lalu melanjutkannya keesokan hari.
Blok Tips: (1) Selalu klik Pratinjau sebelum Terbitkan, terutama untuk perubahan teks panjang.
(2) Biasakan menerbitkan pada hari yang sama agar tidak ada draft yang terlupakan.
Blok Hati-hati: Tombol Batalkan Perubahan mengembalikan SEMUA isian, bukan hanya satu kolom.
Pastikan Anda sudah menyimpan yang penting sebelum menekannya.
Tabel: "Tombol", "Yang terjadi", "Aman ditekan?" - empat baris untuk empat tombol
Visual: diagram panah bernomor 1 sampai 4, kotak Terbitkan berwarna kuning

SLIDE 4 - Cara Masuk ke Panel
Subjudul: Tiga langkah untuk mulai mengelola website
Butir:
1. Buka aplikasi browser di komputer atau ponsel Anda, misalnya Chrome, Edge, atau Safari
2. Ketik alamat website toko, lalu tambahkan garis miring dan kata admin di belakangnya
3. Contoh alamat yang benar: https://banyufrozenfood.com/admin
4. Isi kolom Email dengan alamat email yang terdaftar sebagai pengelola website
5. Isi kolom Password dengan kata sandi akun tersebut, lalu tekan tombol Masuk
6. Bila berhasil, Anda langsung diarahkan ke halaman Ringkasan di dalam panel
7. Bila gagal, muncul kotak merah berisi penjelasan penyebabnya di atas formulir
8. Jangan bagikan email dan password panel kepada siapa pun, termasuk staf baru
Blok Yang perlu Anda tahu: Akun admin dibuat oleh pengelola website, bukan didaftarkan
sendiri. Bila Anda belum punya akun, mintalah dibuatkan terlebih dahulu.
Blok Tips: (1) Simpan alamat panel di bookmark browser agar tidak perlu mengetik ulang.
(2) Gunakan kata sandi yang panjang dan tidak dipakai di akun lain.
Blok Hati-hati: Perhatikan huruf besar, huruf kecil, dan angka pada kata sandi. Kesalahan
huruf besar sering menjadi penyebab gagal masuk yang paling umum.
[[SCREENSHOT-01: Halaman Login]]
Tabel: "Kolom", "Isi dengan", "Contoh" - dua baris untuk email dan password
Visual: tiga kotak langkah bernomor dengan ikon gembok di langkah terakhir

SLIDE 5 - Jika Gagal Masuk
Subjudul: Arti pesan yang muncul di layar masuk
Butir:
1. Masukkan email yang valid: muncul bila format email belum benar, misalnya tanpa tanda at
2. Masukkan password: muncul bila kolom kata sandi masih kosong saat tombol Masuk ditekan
3. Email atau password salah: kombinasi keduanya tidak cocok dengan data yang tersimpan
4. Email belum dikonfirmasi: akun belum diaktifkan, hubungi pengelola website Anda
5. Terlalu banyak percobaan masuk: tunggu beberapa menit sebelum mencoba kembali
6. Tidak dapat terhubung ke server: periksa koneksi internet lalu muat ulang halaman
7. Konfigurasi server belum lengkap: pengaturan website belum selesai, hubungi pengelola
8. Setelah beberapa kali gagal, tunggu lima menit agar batas percobaan direset otomatis
Blok Yang perlu Anda tahu: Pesan yang muncul selalu berada di kotak merah di atas formulir
masuk. Bacalah kalimatnya karena pesan itu menunjukkan penyebab yang berbeda-beda.
Blok Tips: (1) Periksa kembali apakah tombol Caps Lock menyala. (2) Coba ketik ulang kata
sandi di kolom lain yang terlihat agar Anda bisa memastikan ejaannya.
Blok Hati-hati: Jangan menghubungi pengelola website hanya dengan pesan tidak bisa masuk.
Sebutkan pesan merah yang muncul agar penanganannya lebih cepat.
[[SCREENSHOT-02: Pesan Error Login]]
Tabel: "Pesan di layar", "Artinya", "Yang harus dilakukan" - enam baris lengkap
Visual: daftar pesan dengan ikon tanda seru, kotak solusi berwarna hijau

SLIDE 6 - Mengenal Tampilan Panel dan Keluar dengan Aman
Subjudul: Orientasi menu dan cara mengakhiri sesi
Butir:
1. Panel terdiri dari dua bagian utama: daftar menu di kiri dan isi halaman di kanan
2. Daftar menu dikelompokkan menjadi Workspace dan Konten Website
3. Kelompok Workspace berisi menu Ringkasan dan menu Analytics
4. Kelompok Konten Website berisi Pengaturan Website, Media Library, Slide Beranda,
   dan Brand Partner
5. Header di bagian atas menampilkan judul halaman yang sedang Anda buka
6. Tombol Buka Website di kanan atas membuka website toko di tab baru browser
7. Setelah selesai bekerja, tekan tombol Keluar di bagian paling bawah daftar menu
8. Tombol Keluar mengembalikan Anda ke halaman masuk dan mengakhiri sesi Anda
Blok Yang perlu Anda tahu: Judul di header berubah mengikuti menu yang sedang dibuka,
sehingga Anda selalu tahu sedang berada di halaman mana tanpa harus mengingat-ingat.
Blok Tips: (1) Periksa dulu apakah masih ada peringatan draft sebelum keluar.
(2) Biasakan menutup sesi bila memakai komputer bersama orang lain.
Blok Hati-hati: Menutup tab browser tanpa menekan Keluar tidak selalu mengakhiri sesi.
Pada komputer bersama, orang lain bisa membuka kembali panel tanpa diminta masuk.
[[SCREENSHOT-03: Sidebar Menu]]
[[SCREENSHOT-04: Header dan Tombol Keluar]]
Tabel: "Bagian panel", "Isinya", "Fungsinya" - empat baris untuk lima bagian tampilan
Visual: ilustrasi panel dengan nomor penunjuk pada sidebar, header, dan tombol Keluar

SLIDE 7 - Menu Ringkasan
Subjudul: Kondisi website dalam sekali lihat
Butir:
1. Halaman Ringkasan adalah halaman pertama yang terbuka setelah Anda berhasil masuk
2. Kartu Status Website menunjukkan apakah website sudah terbit atau masih ada draft
3. Kartu yang sama juga menampilkan tanggal terakhir diperbarui dan terakhir diterbitkan
4. Bagian Konten yang dikelola menampilkan jumlah Slide Beranda dan Brand Partner
5. Bagian yang sama menampilkan jumlah Kanal Pemesanan yang sedang aktif
6. Bagian Monitoring Website menampilkan pengunjung hari ini, tujuh hari, dan tiga puluh hari
7. Bagian monitoring juga menampilkan jumlah klik kanal selama tiga puluh hari terakhir
8. Aksi cepat berisi jalan pintas ke menu yang paling sering dipakai pengelola website
Blok Yang perlu Anda tahu: Angka pengunjung bersifat anonim. Website hanya menghitung
jumlah orang yang membuka halaman, tanpa menyimpan nama atau identitas mereka.
Blok Tips: (1) Buka Ringkasan setiap pagi untuk melihat apakah ada draft yang tertinggal.
(2) Gunakan tombol Edit Website untuk langsung menuju halaman pengaturan.
Blok Hati-hati: Jumlah pengunjung yang besar tidak otomatis berarti banyak pesanan.
Lihat jumlah klik kanal untuk mengetahui berapa yang benar-benar berminat memesan.
[[SCREENSHOT-05: Menu Ringkasan]]
Tabel: "Bagian di Ringkasan", "Yang ditampilkan", "Kapan berguna" - lima baris
Visual: tiga kartu statistik berwarna + satu baris tombol aksi cepat

SLIDE 8 - Arti Status Website
Subjudul: Membedakan Terbit dan Ada draft
Butir:
1. Status Terbit berarti pelanggan sudah melihat versi terbaru website toko Anda
2. Status Ada draft berarti ada perubahan tersimpan yang belum tayang ke pelanggan
3. Terakhir Diperbarui menunjukkan waktu Anda terakhir menyimpan perubahan
4. Terakhir Diterbitkan menunjukkan waktu perubahan terakhir mulai terlihat pelanggan
5. Baris Penyimpanan menunjukkan pengaturan tersimpan online atau hanya di browser
6. Bila tertulis Online, perubahan bisa dibuka dari perangkat lain memakai akun yang sama
7. Bila tertulis Browser ini saja, perubahan hanya tersimpan di komputer yang Anda pakai
8. Status berubah menjadi Terbit setelah Anda menekan tombol Terbitkan dan proses selesai
Blok Yang perlu Anda tahu: Selama status masih Ada draft, pelanggan tetap melihat versi
lama. Jadi perubahan Anda tidak hilang, hanya belum ditayangkan.
Blok Tips: (1) Terbitkan segera setelah Anda yakin agar tidak lupa. (2) Bila berpindah
komputer, periksa kembali status penyimpanan sebelum mulai mengubah isi.
Blok Hati-hati: Menganggap perubahan gagal padahal statusnya masih Ada draft adalah
kebingungan yang paling sering terjadi. Periksa status dulu sebelum menyimpulkan.
[[SCREENSHOT-06: Status Website]]
Tabel: "Status", "Artinya", "Yang dilihat pelanggan" - tiga baris perbandingan
Visual: dua kartu berdampingan berlabel Terbit berwarna hijau dan Ada draft berwarna kuning

SLIDE 9 - Menu Analytics dan Apa yang Dihitung
Subjudul: Melihat minat pelanggan dari data kunjungan
Butir:
1. Menu Analytics menampilkan seberapa banyak orang melihat website toko Anda
2. Anda bisa memilih periode tujuh hari, tiga puluh hari, atau sembilan puluh hari
3. Pengunjung unik menghitung jumlah orang berbeda yang membuka website
4. Page view menghitung total halaman yang dibuka, termasuk kunjungan berulang
5. Klik kanal menghitung berapa kali tombol menuju kanal pemesanan ditekan pelanggan
6. Grafik Traffic harian membandingkan pengunjung unik dengan jumlah halaman dibuka
7. Panel Minat kanal menampilkan jumlah klik tiap kanal beserta persentasenya
8. Kanal yang dihitung hanya WhatsApp, GoFood, dan GrabMart
Blok Yang perlu Anda tahu: Analytics anonim, tanpa isi chat atau data pribadi. Data ini
membantu Anda menilai konten mana yang paling menarik perhatian pengunjung.
Blok Tips: (1) Bandingkan periode tujuh hari dan tiga puluh hari untuk menemukan pola.
(2) Perhatikan kanal dengan persentase klik terbesar, itulah kanal favorit pelanggan.
Blok Hati-hati: Website mencatat klik sebagai tanda minat, bukan jumlah pesanan sebenarnya.
Pesanan dan pembayaran tetap diproses di aplikasi masing-masing kanal.
[[SCREENSHOT-07: Menu Analytics]]
[[SCREENSHOT-08: Minat Kanal]]
Tabel: "Metrik", "Artinya", "Cara membacanya" - tiga baris lengkap
Visual: grafik batang sederhana + tiga kartu metrik + daftar persentase kanal

SLIDE 10 - 6 Tab Isi Website
Subjudul: Peta pengaturan website
Butir:
1. Tab Kontak & Jam Buka berisi nomor WhatsApp, email, alamat, peta, dan jadwal buka toko
2. Tab Sosial Media berisi tautan Instagram, TikTok, dan Facebook yang muncul di footer
3. Tab Navbar & Footer berisi deskripsi singkat toko dan catatan kecil di bagian bawah
4. Tab Isi Beranda berisi teks beranda, daftar keunggulan, kanal pemesanan, dan area layanan
5. Tab Galeri Toko berisi foto suasana toko yang tampil di halaman lokasi website
6. Tab SEO berisi judul, deskripsi, dan gambar yang muncul saat link dibagikan
7. Setiap tab menyimpan isian sendiri, sehingga Anda bisa mengerjakannya satu per satu
8. Perubahan pada satu tab tidak menghapus isian pada tab lain
Blok Yang perlu Anda tahu: Enam tab ini menutup seluruh isi website yang bisa diubah.
Bila ada bagian website yang ingin Anda ubah, kemungkinan besar pengaturannya ada di sini.
Blok Tips: (1) Ubah satu tab, simpan draft, lalu lanjut ke tab berikutnya agar tidak keliru.
(2) Buka tab Isi Beranda bila ingin menyembunyikan salah satu bagian beranda.
Blok Hati-hati: Beberapa bagian beranda punya sakelar tampil atau sembunyi. Bagian yang
dimatikan tetap tersimpan isinya, jadi Anda bisa menyalakannya kembali kapan saja.
[[SCREENSHOT-09: Tab Pengaturan Website]]
Tabel: "Tab", "Isinya", "Muncul di halaman mana" - enam baris lengkap
Visual: enam kartu tab berwarna dengan ikon berbeda dan nomor urut

SLIDE 11 - Kontak dan Jam Buka
Subjudul: Data yang paling sering dipakai website
Butir:
1. Nomor WhatsApp diisi memakai format internasional tanpa tanda plus dan tanpa spasi
2. Contoh penulisan yang benar adalah 6281234567890, bukan 0812-3456-7890
3. Nomor ini otomatis dipakai di tombol chat, halaman lokasi, dan footer website
4. Pesan Otomatis WhatsApp adalah teks yang sudah terisi saat pelanggan menekan tombol chat
5. Alamat Singkat tampil di footer, sedangkan Alamat Lengkap tampil di halaman lokasi
6. Link Google Maps dipakai saat pengunjung menekan tombol buka peta di halaman lokasi
7. Link Peta Tertanam membuat peta tampil langsung di halaman, bukan hanya berupa tautan
8. Jam operasional diisi per baris, bisa ditambah, diurutkan, atau dihapus sesuai kebutuhan
Blok Yang perlu Anda tahu: Perubahan nomor WhatsApp langsung berlaku di seluruh website
setelah diterbitkan, jadi pastikan nomornya sudah benar sebelum menekan Terbitkan.
Blok Tips: (1) Salin nomor dari buku kontak ponsel agar tidak salah ketik.
(2) Coba tekan tombol chat di website setelah terbit untuk memastikan nomornya aktif.
Blok Hati-hati: Nomor yang salah format akan ditandai merah dan menyimpan perubahan akan
ditolak. Perbaiki tandanya sebelum menyimpan.
[[SCREENSHOT-10: Tab Kontak dan Jam Buka]]
Tabel: "Kolom", "Contoh benar", "Catatan" - lima baris untuk lima kolom utama
Visual: potongan formulir kontak + tabel jam buka tiga baris dengan tombol urut

SLIDE 12 - Galeri Foto Toko
Subjudul: Menampilkan suasana toko kepada calon pembeli
Butir:
1. Galeri Toko berisi foto suasana toko yang tampil di halaman lokasi website
2. Ada sakelar untuk menampilkan atau menyembunyikan seluruh galeri sekaligus
3. Setiap foto diberi label singkat, misalnya Tampak depan toko atau Area freezer
4. Gunakan foto asli toko agar pelanggan mudah mengenali lokasi saat berkunjung
5. Foto akan dipotong otomatis, jadi letakkan bagian penting di tengah gambar
6. Rasio pemotongan galeri adalah tiga banding dua, sama seperti foto lanskap
7. Tersedia kolom Judul Galeri dan Deskripsi Galeri yang bisa Anda ubah
8. Jumlah foto tidak dibatasi, tetapi enam sampai delapan foto sudah cukup mewakili
Blok Yang perlu Anda tahu: Foto galeri membantu pelanggan memastikan lokasi toko sesuai
dengan yang mereka lihat di peta sebelum berangkat.
Blok Tips: (1) Ambil foto saat toko terang dan barang tersusun rapi.
(2) Ambil dari beberapa sudut: depan toko, rak produk, area freezer, dan meja kasir.
Blok Hati-hati: Hindari foto yang memuat wajah orang lain tanpa izin, dan hindari foto
yang terlalu gelap karena label putih di atasnya akan sulit terbaca.
[[SCREENSHOT-11: Tab Galeri Toko]]
Tabel: "Jenis foto", "Isi yang bagus", "Contoh label" - empat baris saran
Visual: susunan tiga foto galeri berlabel dengan penanda area tengah

SLIDE 13 - Simpan dan Terbitkan
Subjudul: Empat tombol aksi yang paling penting
Butir:
1. Tombol Simpan Draft menyimpan perubahan Anda tetapi pelanggan belum melihatnya
2. Tombol Pratinjau membuka tampilan sementara di tab baru untuk Anda periksa
3. Tombol Terbitkan menayangkan perubahan ke website yang dilihat pelanggan
4. Tombol Batalkan Perubahan mengembalikan semua isian ke simpanan terakhir Anda
5. Keempat tombol berada di bagian bawah halaman pengaturan, setelah semua kolom isian
6. Tombol Simpan Draft dan Batalkan Perubahan tidak aktif bila belum ada perubahan
7. Tombol Terbitkan selalu bisa ditekan dan menampilkan konfirmasi sebelum ditayangkan
8. Bila penyimpanan gagal, muncul pemberitahuan merah dan perubahan Anda tidak hilang
Blok Yang perlu Anda tahu: Pratinjau menyimpan draft terlebih dahulu supaya tab pratinjau
memiliki data yang bisa ditampilkan. Jadi jangan khawatir bila draft ikut tersimpan.
Blok Tips: (1) Simpan draft saat istirahat, terbitkan saat sudah selesai semuanya.
(2) Gunakan Pratinjau berkali-kali, karena tidak mengubah apa pun bagi pelanggan.
Blok Hati-hati: Jangan menekan Batalkan Perubahan setelah mengubah banyak kolom bila
Anda belum menyimpan, karena semua isian akan kembali ke kondisi sebelumnya.
Kotak Contoh: Simpan Draft hari ini untuk diperiksa besok, Terbitkan setelah teksnya benar
[[SCREENSHOT-12: Tombol Aksi Pengaturan]]
Tabel: "Tombol", "Yang terjadi pada pelanggan", "Aman ditekan?" - empat baris
Visual: empat kotak tombol berwarna berbeda dengan penjelasan singkat di bawahnya

SLIDE 14 - Pratinjau Sebelum Tayang
Subjudul: Memeriksa hasil sebelum pelanggan melihat
Butir:
1. Tekan tombol Pratinjau untuk membuka website versi sementara di tab baru browser
2. Versi pratinjau menampilkan perubahan yang belum diterbitkan ke pelanggan
3. Hanya orang yang sudah masuk ke panel yang bisa melihat versi pratinjau ini
4. Di bagian bawah versi pratinjau muncul penanda bahwa ini bukan tampilan pelanggan
5. Gunakan versi pratinjau untuk memeriksa ejaan, nomor kontak, alamat, dan gambar
6. Periksa juga tampilan di ponsel karena tata letaknya berbeda dari tampilan laptop
7. Bila ada yang salah, tutup tab pratinjau, perbaiki di panel, lalu buka pratinjau lagi
8. Setelah semuanya benar, barulah tekan tombol Terbitkan di halaman pengaturan
Blok Yang perlu Anda tahu: Versi pratinjau terpisah dari website pelanggan, sehingga
Anda bisa mencoba beberapa kali tanpa membuat website terlihat berantakan.
Blok Tips: (1) Periksa di dua ukuran layar: laptop dan ponsel.
(2) Minta satu orang lain membaca untuk menangkap salah ketik yang Anda lewatkan.
Blok Hati-hati: Jangan menganggap pratinjau sudah final. Pratinjau hanya alat bantu
pemeriksaan, dan perubahan baru benar-benar tayang setelah tombol Terbitkan ditekan.
[[SCREENSHOT-14: Mode Pratinjau]]
Tabel: "Yang diperiksa", "Contoh kesalahan", "Cara memperbaiki" - empat baris
Visual: dua bingkai berdampingan berlabel Versi pelanggan dan Versi pratinjau

SLIDE 15 - Media Library
Subjudul: Menyimpan gambar sekali untuk dipakai berkali-kali
Butir:
1. Media Library adalah tempat menyimpan gambar agar bisa dipakai berulang kali
2. Ada empat kategori gambar: Gambar, Logo, Banner, dan Foto Toko
3. Pilih kategori lebih dulu, lalu tekan tombol unggah gambar di sebelahnya
4. Di ponsel, tombol unggah akan membuka file atau kamera perangkat Anda
5. Format yang didukung: PNG, JPG, WebP, SVG, dan GIF
6. Selain mengunggah dari perangkat, gambar bisa ditambahkan dengan menempelkan tautan
7. Gambar yang tersimpan di sini bisa dipakai di slide beranda, galeri, dan logo merek
8. Batas ukuran berkas adalah dua megabita saat penyimpanan online sudah aktif
Blok Yang perlu Anda tahu: Bila penyimpanan online belum aktif, batas ukuran berkas
menjadi empat ratus kilobita dan gambar hanya tersimpan di browser yang Anda pakai.
Blok Tips: (1) Beri nama berkas yang jelas sebelum mengunggah, misalnya foto-depan-toko.
(2) Gunakan kategori yang tepat agar pencarian gambar nanti lebih mudah.
Blok Hati-hati: Berkas yang lebih besar dari batas akan ditolak dan muncul pemberitahuan
merah. Perkecil gambar terlebih dahulu sebelum mencoba mengunggah lagi.
[[SCREENSHOT-15: Menu Media Library]]
Tabel: "Kategori", "Dipakai untuk", "Contoh berkas" - empat baris lengkap
Visual: bilah alat unggah + deretan kartu gambar dengan label kategori

SLIDE 16 - Mencari Gambar
Subjudul: Menemukan gambar dan mengetahui mana yang sudah dipakai
Butir:
1. Chip kategori di atas daftar menyaring gambar: Semua, Gambar, Logo, Banner, Foto Toko
2. Kotak pencarian dipakai untuk mencari gambar berdasarkan nama berkasnya
3. Menu status memisahkan gambar yang sudah dipakai dan yang belum dipakai
4. Badge Dipakai menandakan gambar tersebut sedang tampil di website toko Anda
5. Badge tersebut juga menyebutkan di bagian mana gambar itu dipakai
6. Tombol salin menyalin tautan gambar agar bisa dipakai di tempat lain
7. Tombol hapus menghapus gambar dari perpustakaan secara permanen
8. Menghapus gambar yang sedang dipakai akan membuat tampilannya hilang dari website
Blok Yang perlu Anda tahu: Karena satu gambar bisa dipakai di beberapa tempat sekaligus,
periksa badge Dipakai sebelum menghapus agar tidak ada bagian website yang rusak.
Blok Tips: (1) Gunakan kotak pencarian bila gambar sudah banyak.
(2) Gunakan tombol salin saat ingin memakai gambar yang sama di beberapa tempat.
Blok Hati-hati: Gambar yang sudah dihapus tidak bisa dikembalikan. Bila ragu, biarkan
gambar tetap tersimpan karena tidak mengganggu tampilan website.
[[SCREENSHOT-17: Kartu Media Terpakai]]
Tabel: "Tombol atau filter", "Fungsinya", "Kapan dipakai" - lima baris lengkap
Visual: contoh kartu gambar dengan badge Dipakai kuning dan dua tombol ikon

SLIDE 17 - Slide Beranda
Subjudul: Gambar besar paling atas di halaman depan
Butir:
1. Slide Beranda adalah gambar besar yang muncul paling atas di halaman depan website
2. Urutan menentukan slide mana yang tampil lebih dahulu, dimulai dari angka terkecil
3. Sakelar aktif atau nonaktif mengatur apakah slide ditampilkan atau disembunyikan
4. Judul slide dibatasi enam puluh karakter, tetapi disarankan di bawah empat puluh
5. Deskripsi slide dibatasi dua ratus karakter, tetapi disarankan di bawah seratus dua puluh
6. Teks tombol dibatasi dua puluh lima karakter, contohnya Cara Pesan atau Chat WhatsApp
7. Tersedia penghitung karakter di samping setiap kolom, misalnya tertulis 42 dari 60
8. Gambar slide disarankan berukuran 1200 x 600 piksel dengan berkas di bawah 500 kilobita
Blok Yang perlu Anda tahu: Penghitung karakter berubah warna saat mendekati batas,
sehingga Anda tahu teksnya sudah terlalu panjang sebelum menyimpan.
Blok Tips: (1) Cukup pakai lima sampai enam slide agar website tetap cepat dibuka.
(2) Letakkan kata penting di awal judul karena mata pembaca menangkap bagian depan dulu.
Blok Hati-hati: Judul yang terlalu panjang akan memakan tiga baris atau lebih di ponsel
dan menutupi gambar. Perpendek judulnya bila muncul peringatan kuning.
[[SCREENSHOT-18: Menu Slide Beranda]]
[[SCREENSHOT-19: Form Slide Plus Penghitung]]
Tabel: "Bagian slide", "Batas karakter", "Saran praktis" - empat baris lengkap
Visual: tabel daftar slide + contoh penghitung karakter berwarna kuning dan merah

SLIDE 18 - Pratinjau Laptop dan HP
Subjudul: Tata letak slide berbeda di dua ukuran layar
Butir:
1. Di laptop, teks slide berada di kiri tengah dengan tombol berukuran sedang
2. Di ponsel, teks slide berpindah ke tengah bawah dengan tombol selebar layar
3. Di laptop muncul tombol panah untuk berpindah slide, di ponsel tidak muncul
4. Di ponsel, perpindahan slide dilakukan dengan menekan titik di bawah gambar
5. Perbedaan ini otomatis, Anda tidak perlu membuat dua versi slide yang berbeda
6. Tombol Sesuaikan Gambar dipakai untuk memotong dan menggeser gambar agar pas
7. Saat memotong, pilih proporsi dua banding satu agar seragam dengan slide lain
8. Letakkan bagian penting gambar di tengah karena sisi gambar akan terpotong otomatis
Blok Yang perlu Anda tahu: Karena tata letaknya berbeda, selalu periksa pratinjau di
kedua ukuran sebelum menerbitkan agar teks tidak terpotong di salah satunya.
Blok Tips: (1) Pilih gambar dengan ruang kosong di sisi kiri agar teks laptop tetap jelas.
(2) Hindari menaruh tulisan di bagian tepi gambar karena akan terpotong di ponsel.
Blok Hati-hati: Gambar yang baik di laptop belum tentu baik di ponsel. Selalu periksa
keduanya, terutama bila gambar memuat tulisan atau logo.
[[SCREENSHOT-20: Pratinjau Laptop dan HP]]
Tabel: "Bagian", "Di laptop", "Di ponsel" - empat baris perbandingan tata letak
Visual: dua bingkai berdampingan berlabel Laptop dan HP dengan penanda posisi teks

SLIDE 19 - Brand Partner
Subjudul: Logo merek yang tampil di halaman beranda
Butir:
1. Brand Partner adalah logo merek dagang yang tampil di bagian brand pada halaman beranda
2. Setiap entri punya nama merek, gambar logo, alamat website, urutan, dan status
3. Ukuran logo yang disarankan 160 x 80 piksel dengan perbandingan dua banding satu
4. Gunakan berkas PNG dengan latar transparan agar logo menyatu dengan latar website
5. Nama merek akan muncul di bawah logo, jadi tulis singkat dan tanpa salah ketik
6. Alamat website diisi bila logo ingin bisa diklik oleh pengunjung
7. Sakelar aktif atau nonaktif bisa diubah langsung dari daftar tanpa membuka formulir
8. Urutan menentukan posisi logo dalam barisan, dimulai dari angka terkecil
Blok Yang perlu Anda tahu: Logo yang tidak aktif tetap tersimpan datanya, jadi Anda bisa
menyalakannya kembali kapan saja tanpa mengunggah ulang gambarnya.
Blok Tips: (1) Samakan tinggi semua logo agar barisannya terlihat rapi.
(2) Gunakan versi logo berwarna agar lebih menarik dibanding hitam putih.
Blok Hati-hati: Hindari gambar penuh tulisan kecil atau resolusi rendah, karena logo
akan terlihat pecah saat ditampilkan di website.
[[SCREENSHOT-22: Menu Brand Partner]]
Tabel: "Kolom", "Contoh isian", "Catatan" - lima baris lengkap
Visual: contoh tiga logo dalam kartu + keterangan ukuran 160 x 80 piksel

SLIDE 20 - Panel dari HP
Subjudul: Mengelola website lewat ponsel
Butir:
1. Panel bisa dipakai dari ponsel tanpa aplikasi tambahan, cukup lewat browser
2. Tekan ikon menu berbentuk tiga garis di kiri atas untuk membuka daftar menu
3. Daftar menu muncul dari sisi kiri layar dan bisa ditutup dengan tombol silang
4. Menekan salah satu menu akan menutup daftar menu secara otomatis
5. Tabel di panel berubah menjadi susunan kartu agar mudah dibaca di layar sempit
6. Tombol simpan pada halaman pengaturan menempel di bawah layar agar mudah ditekan
7. Judul halaman tetap terlihat di header sehingga Anda tahu sedang berada di menu mana
8. Semua kolom isian dan tombol tetap berfungsi sama seperti saat memakai laptop
Blok Yang perlu Anda tahu: Panel disesuaikan untuk layar kecil, tetapi mengubah teks
panjang tetap lebih nyaman memakai laptop karena layarnya lebih luas.
Blok Tips: (1) Gunakan laptop untuk mengubah teks panjang, lalu periksa hasilnya di ponsel.
(2) Gunakan ponsel untuk membalas kebutuhan cepat, misalnya memperbarui jam buka.
Blok Hati-hati: Periksa selalu tampilan website di ponsel setelah menerbitkan perubahan,
karena sebagian besar pengunjung toko membuka website dari ponsel.
[[SCREENSHOT-23: Panel di HP]]
Tabel: "Bagian", "Cara memakainya di ponsel", "Catatan" - empat baris
Visual: dua bingkai ponsel berisi daftar menu dan susunan kartu data

SLIDE 21 - Tips Menulis Teks Slide
Subjudul: Batas karakter agar teks tetap rapi
Butir:
1. Judul slide dibatasi enam puluh karakter, tetapi sebaiknya di bawah empat puluh
2. Subtitle slide dibatasi delapan puluh karakter dan tampil sebagai label kecil
3. Deskripsi slide dibatasi dua ratus karakter, sebaiknya di bawah seratus dua puluh
4. Teks tombol dibatasi dua puluh lima karakter, contohnya Cara Pesan atau Chat WhatsApp
5. Judul website pada tab SEO disarankan sekitar seratus dua puluh sampai seratus enam puluh
6. Deskripsi website pada tab SEO disarankan pada rentang yang sama agar tidak terpotong
7. Gunakan kalimat singkat dan hindari menulis seluruh kalimat dengan huruf kapital
8. Tempatkan kata yang paling penting di awal kalimat agar cepat terbaca
Blok Yang perlu Anda tahu: Setiap kolom teks punya penghitung karakter di sampingnya.
Angka itu menunjukkan jumlah karakter yang sudah dipakai dari batas maksimalnya.
Blok Tips: (1) Tulislah teksnya di aplikasi catatan dulu, lalu salin ke panel.
(2) Bacalah teks Anda dengan suara lantang untuk memastikan kalimatnya mudah dipahami.
Blok Hati-hati: Teks yang pas di laptop bisa menjadi terlalu banyak baris di ponsel.
Periksa pratinjau di ponsel bila judul Anda lebih dari empat puluh karakter.
[[SCREENSHOT-21: Crop Gambar]]
Tabel: "Bagian teks", "Batas maksimal", "Saran" - lima baris lengkap
Visual: tabel batas karakter + contoh teks pendek yang baik dan teks panjang yang kurang baik

SLIDE 22 - Tips Memilih Gambar
Subjudul: Ukuran dan jenis gambar yang aman
Butir:
1. Gambar slide berukuran ideal 1200 x 600 piksel dengan perbandingan dua banding satu
2. Ukuran berkas sebaiknya di bawah lima ratus kilobita dan maksimal satu megabita
3. Format yang disarankan JPG atau WebP, dan PNG untuk gambar berlogo
4. Letakkan bagian penting gambar di area tengah karena sisi gambar akan terpotong
5. Logo brand partner sebaiknya berukuran 160 x 80 piksel dengan latar transparan
6. Foto galeri dipotong dengan perbandingan tiga banding dua
7. Hindari gambar penuh tulisan karena tulisan akan sulit dibaca di ponsel
8. Hindari gambar kontras rendah karena teks putih di atasnya menjadi tidak terbaca
Blok Yang perlu Anda tahu: Gambar yang terlalu besar membuat website lambat dibuka.
Pengunjung cenderung menutup website yang lambat, jadi perkecil gambar sebelum diunggah.
Blok Tips: (1) Pilih foto produk yang tersusun rapi dengan ruang kosong untuk teks.
(2) Gunakan alat pengompres gambar sebelum mengunggah bila berkasnya terlalu besar.
Blok Hati-hati: Hindari gambar yang memuat tulisan panjang, kontras rendah, atau berkas
lebih dari satu megabita, karena ketiganya menurunkan kenyamanan pengunjung.
Tabel: "Jenis gambar", "Ukuran", "Format", "Batas berkas" - empat baris lengkap
Visual: perbandingan gambar baik dan gambar kurang baik berdampingan

SLIDE 23 - Masalah Umum
Subjudul: Solusi cepat untuk kendala yang sering terjadi
Butir:
1. Perubahan tidak terlihat pelanggan: Anda belum menekan tombol Terbitkan
2. Tidak bisa masuk panel: periksa email dan kata sandi, atau minta atur ulang ke pengelola
3. Unggahan gagal karena ukuran: perkecil gambar ke bawah dua megabita atau empat ratus kilobita
4. Gambar menghilang dari website: gambar dihapus dari perpustakaan padahal masih dipakai
5. Pemotongan gambar dari tautan tidak bisa: unggah dulu gambarnya, lalu potong dari panel
6. Peta tidak muncul: periksa kembali kolom Link Peta Tertanam di tab Kontak & Jam Buka
7. Data statistik tidak muncul: periksa koneksi internet lalu muat ulang halaman
8. Perubahan hanya ada di satu komputer: penyimpanan online belum aktif, hubungi pengelola
Blok Yang perlu Anda tahu: Sebagian besar masalah selesai hanya dengan memeriksa apakah
perubahan sudah diterbitkan atau belum. Periksa itu terlebih dahulu sebelum panik.
Blok Tips: (1) Muat ulang halaman dengan menekan tombol F5 bila data tidak muncul.
(2) Catat pesan yang muncul di layar sebelum menghubungi pengelola website.
Blok Hati-hati: Jangan mengunggah ulang gambar berkali-kali saat gagal. Periksa dulu
pesan yang muncul karena penyebabnya bisa berbeda-beda.
Tabel: "Masalah", "Penyebab paling mungkin", "Solusi" - delapan baris lengkap
Visual: daftar masalah dengan ikon peringatan dan kotak solusi berwarna hijau

SLIDE 24 - Lima Langkah Pertama dan Penutup
Subjudul: Mulai dari langkah kecil hari ini
Butir:
1. Langkah pertama, isi Kontak & Jam Buka agar tombol chat dan halaman lokasi berfungsi
2. Langkah kedua, unggah foto toko ke Media Library dengan kategori Foto Toko
3. Langkah ketiga, atur Slide Beranda: pilih gambar, tulis judul, isi teks tombolnya
4. Langkah keempat, periksa tampilan di ponsel memakai Pratinjau sebelum menerbitkan
5. Langkah kelima, tekan Terbitkan agar semua perubahan tayang ke pelanggan
6. Semua isi website bisa Anda ubah sendiri kapan saja tanpa bantuan developer
7. Cukup ingat empat langkah: Ubah Isi, Pratinjau, Simpan Draft, dan Terbitkan
8. Bila menemui kendala, hubungi pengelola website dengan menyebutkan halaman dan pesannya
Blok Yang perlu Anda tahu: Anda tidak perlu menyelesaikan semuanya hari ini. Kerjakan
satu langkah per hari agar setiap perubahan bisa diperiksa dengan tenang.
Blok Tips: (1) Simpan panduan ini dan buka kembali setiap kali ingin mengubah isi.
(2) Tandai tanggal setiap kali Anda menerbitkan perubahan agar mudah dilacak.
Blok Hati-hati: Jangan mengubah banyak bagian sekaligus sebelum memastikan satu bagian
sudah tampil benar. Perubahan bertahap lebih mudah diperiksa bila ada kesalahan.
Tabel: "Langkah", "Dikerjakan di menu", "Perkiraan waktu" - lima baris lengkap
Visual: lima kotak bernomor + kalimat ajakan besar + kontak pengelola website
```

### Kapan memakai Bagian E

| Kondisi | Yang dipakai |
|---|---|
| Hasil masih terasa sedikit setelah Bagian A+B | Pakai **Bagian E-1 + E-2** |
| Sudah cukup padat | Cukup Bagian A + Bagian B |
| Ingin hasil paling padat | Tempel **E-1**, lalu **E-2**, lalu tambahkan perintah berikut |
| Ingin lebih rapi | Tambahkan perintah "kurangi jumlah slide menjadi 20 dengan menggabungkan topik serumpun, tanpa mengurangi jumlah butir per slide" |

Perintah tambahan bila masih ingin lebih padat lagi:

```
Tolong periksa ulang seluruh slide. Untuk setiap slide yang butir isinya kurang dari 8,
tambahkan butir baru dari materi berikut:
- Apa yang Anda lihat di layar tersebut
- Apa yang terjadi bila kolomnya salah diisi
- Kapan bagian ini paling sering dipakai
- Berapa lama pengerjaannya dan siapa yang sebaiknya mengerjakan
- Satu contoh pengisian yang benar dan satu contoh yang salah
Pastikan setiap slide juga memuat satu tabel atau diagram dengan minimal empat baris.
Jangan mengurangi jumlah slide. Jangan mengosongkan slide mana pun.
```

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
