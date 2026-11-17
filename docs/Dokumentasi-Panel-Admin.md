# Panduan Panel Admin — Banyu Frozen Food

Panduan ini untuk owner/admin toko. Tidak perlu paham coding.

Panel ini hanya untuk mengelola **isi website**: kontak, jam buka, sosial media, teks beranda,
foto galeri, slide beranda, dan logo brand. Pesanan pelanggan tetap diproses di aplikasi
GoFood, GrabMart, atau WhatsApp.

> Ingin versi presentasi/PDF untuk klien? Lihat `docs/Prompt-PDF-Tutorial-Admin.md`.

---

## Daftar Isi

1. [Cara Masuk](#1-cara-masuk)
2. [Tampilan Panel](#2-tampilan-panel)
3. [Ringkasan](#3-ringkasan)
4. [Analytics](#4-analytics)
5. [Pengaturan Website](#5-pengaturan-website)
6. [Alur Simpan Draft & Terbitkan](#6-alur-simpan-draft--terbitkan)
7. [Media Library](#7-media-library)
8. [Slide Beranda](#8-slide-beranda)
9. [Brand Partner](#9-brand-partner)
10. [Cara Keluar](#10-cara-keluar)
11. [Masalah Umum](#11-masalah-umum)

---

## 1. Cara Masuk

1. Buka browser, ketik alamat website diikuti `/admin`. Contoh: `https://banyufrozenfood.com/admin`
2. Isi **Email** dan **Password** yang sudah dibuat.
3. Klik **Masuk**.

Jika berhasil, Anda langsung diarahkan ke halaman **Ringkasan**.

Akun admin dibuat oleh pengelola website di Supabase Dashboard → Authentication → Users.
Pastikan opsi **Allow new users to sign up** dalam keadaan **OFF** agar tidak ada yang bisa
mendaftar sendiri.

### Arti pesan error saat masuk

| Pesan di layar | Artinya |
|---|---|
| `Masukkan email yang valid.` | Format email belum benar |
| `Masukkan password.` | Kolom password masih kosong |
| `Email atau password salah.` | Kombinasi email/password tidak cocok |
| `Email belum dikonfirmasi. Silakan cek inbox email Anda.` | Akun belum diaktifkan |
| `Terlalu banyak percobaan masuk. Tunggu sebentar lagi.` | Kena batas percobaan, tunggu beberapa menit |
| `Tidak dapat terhubung ke server. Periksa koneksi internet Anda.` | Koneksi internet bermasalah |
| `Konfigurasi server belum lengkap. Hubungi pengelola website.` | Pengaturan server belum diisi |

---

## 2. Tampilan Panel

Setelah masuk, ada dua bagian utama:

- **Sidebar kiri** — dua kelompok menu:
  - **Workspace**: `Ringkasan`, `Analytics`
  - **Konten Website**: `Pengaturan Website`, `Media Library`, `Slide Beranda`, `Brand Partner`
  - Tombol `Keluar` ada di bagian bawah sidebar.
- **Area kanan** — isi halaman yang sedang dibuka. Header di atasnya menampilkan judul
  halaman aktif dan tombol `Buka Website` (membuka website di tab baru).

Di layar kecil (HP/tablet), sidebar tersembunyi. Buka lewat tombol hamburger (☰) di header,
tutup dengan tombol `×` atau tekan `Esc`. Sidebar juga otomatis tertutup saat berpindah menu.

Selama sesi belum dipastikan, panel menampilkan `Memuat...` dan belum menampilkan isi apa pun.

---

## 3. Ringkasan

Halaman pembuka berisi:

- **Status Website** — pill `Terbit` atau `Ada draft`, tanggal `Terakhir Diperbarui`,
  `Terakhir Diterbitkan`, dan `Penyimpanan` (`Online (Supabase)` atau `Browser ini saja`).
  Tersedia tombol `Edit Website` dan `Lihat Pratinjau`.
- **Konten yang dikelola** — jumlah `Slide Beranda`, `Brand Partner`, dan `Kanal Pemesanan`.
- **Monitoring Website** — data 30 hari terakhir: `Pengunjung hari ini`, `Pengunjung 7 hari`,
  `Pengunjung 30 hari`, dan `Klik kanal 30 hari` (rincian WA, GoFood, GrabMart).
- **Aksi cepat** — jalan pintas ke Pengaturan Website, Media Library, Slide Beranda,
  Brand Partner, dan Lihat Website.
- **Cara Pakai** — ringkasan alur kerja.
- **Informasi Pengaturan Website** — penjelasan singkat tiap kelompok pengaturan.

> Website mencatat klik, bukan detail pesanan. Cek order dan status transaksi langsung
> di WhatsApp Business, GoFood Merchant, atau GrabMerchant.

---

## 4. Analytics

Menampilkan performa website untuk periode **7 hari**, **30 hari** (bawaan), atau **90 hari**.

- **Pengunjung unik** — jumlah orang yang membuka website.
- **Page view** — total halaman dibuka.
- **Klik kanal** — total klik menuju WhatsApp, GoFood, dan GrabMart.
- **Traffic harian** — grafik pengunjung unik dibandingkan page view.
- **Minat kanal** — jumlah dan persentase klik per kanal.
- **Cek pesanan di aplikasi merchant** — tombol menuju WhatsApp, GoFood, atau GrabMart
  (muncul bila tautannya sudah diisi di Pengaturan Website).

Di bagian bawah tertulis `Analytics anonim, tanpa isi chat atau data pribadi.`

Jika muncul pesan `Tabel analytics belum tersedia...`, minta pengelola website menjalankan
file `supabase-analytics.sql` di Supabase SQL Editor.

---

## 5. Pengaturan Website

Halaman ini punya **6 tab**. Isi tab, lalu simpan atau terbitkan (lihat bagian 6).

### Tab `Kontak & Jam Buka`

| Field | Keterangan |
|---|---|
| `Nomor WhatsApp` | Format internasional tanpa `+` atau spasi. Contoh: `6281234567890` |
| `Pesan Otomatis WhatsApp` | Teks yang otomatis terisi saat pelanggan klik tombol WhatsApp |
| `Email` | Email toko |
| `Alamat Singkat` | Muncul di footer |
| `Alamat Lengkap` | Muncul di halaman Lokasi |
| `Link Google Maps` | Link yang terbuka saat tombol Buka di Google Maps diklik |
| `Link Peta Tertanam` | Dari Google Maps: Bagikan → Sematkan peta → salin link di bagian `src` |

Ada juga daftar **Jam Operasional**. Gunakan `+ Tambah Baris Jam`, isi hari dan jam, lalu
atur urutan dengan `↑` / `↓` atau hapus dengan `🗑`.

Nomor WhatsApp yang diisi di sini otomatis dipakai di tombol chat, halaman Lokasi, dan footer.

### Tab `Sosial Media`

Daftar akun sosial media. Setiap baris punya nama, pilihan ikon
(`Ikon Instagram`, `Ikon TikTok`, `Ikon Facebook`, `Ikon Link Umum`), dan link.
Kosongkan link untuk menyembunyikan ikon di footer.

### Tab `Navbar & Footer`

- `Deskripsi di Footer` — kalimat pendek tentang bisnis di bagian bawah website.
- `Catatan Kecil di Footer` — misalnya nama sekolah atau kredit project.

Menu navigasi **sudah tetap** (Beranda, Tentang, Cara Pesan, Lokasi) dan otomatis muncul
di navbar serta footer. Tidak perlu diatur di sini.

### Tab `Isi Beranda`

- **Bagian yang Ditampilkan di Beranda** — sakelar on/off untuk `Keunggulan Toko`,
  `Tentang Toko`, `Kanal Pemesanan`, `Brand Partner`, dan `Lokasi di Beranda`.
- **Tentang Toko** — judul, kalimat pembuka, deskripsi, daftar `Sorotan Toko`, dan
  `Tag Kategori`.
- **Kanal Pemesanan** — judul, kalimat pendukung, dan `Kartu Kanal Pemesanan`.
  Setiap kartu punya sakelar `Tampilkan`, nama kanal, pilihan kanal (GoFood, GrabMart,
  WhatsApp, Shopee, Tokopedia, Kanal lain), emoji cadangan, deskripsi, dan URL.
  - Logo resmi kanal dipakai otomatis dari `public/logos/`. Emoji hanya tampil bila file
    logonya belum tersedia.
  - Untuk kanal WhatsApp, URL diisi otomatis dari tab `Kontak & Jam Buka`.
- **Brand Partner** — judul dan kalimat pendukung bagian brand.
- **Keunggulan** — judul, kalimat pendukung, dan daftar keunggulan (judul + penjelasan).
- **Lokasi Beranda** — label, judul, judul area layanan, deskripsi, dan daftar area layanan.

### Tab `Galeri Toko`

- Sakelar `Tampilkan Galeri Toko di halaman Lokasi`.
- `Judul Galeri` dan `Deskripsi Galeri`.
- Daftar `Foto Galeri` — setiap foto dipilih lewat pemilih gambar (kategori `toko`) dan
  diberi label, misalnya `Area freezer`. Rasio crop 3:2.

Gunakan foto toko asli agar pelanggan mudah mengenali lokasi.

### Tab `SEO`

- `Judul Website` — judul di tab browser dan hasil pencarian Google.
- `Deskripsi Website` — sekitar 120–160 huruf.
- `Gambar untuk Bagikan Link` — gambar yang muncul saat link dibagikan ke WhatsApp
  atau sosial media.

### Pesan validasi yang sering muncul

| Pesan | Perbaikan |
|---|---|
| `Hanya angka 8–15 digit, diawali kode negara. Contoh: 6281234567890.` | Perbaiki nomor WhatsApp |
| `Format email belum benar.` | Perbaiki email |
| `Link harus diawali http:// atau https://.` | Perbaiki link |
| `Link harus diawali http:// atau https://, atau kosongkan jika belum ada.` | Perbaiki link GoFood/GrabMart |
| `Link harus diawali http:// atau https://, atau kartu bisa dimatikan.` | Isi URL kartu kanal atau matikan kartunya |
| `Judul website wajib diisi.` | Isi judul di tab SEO |
| `Periksa lagi isian yang ditandai merah.` | Ada field yang perlu diperbaiki |

---

## 6. Alur Simpan Draft & Terbitkan

Urutan yang benar:

> Ubah isi → **Pratinjau** (lihat dulu di tab baru) → **Simpan Draft** (simpan, belum tampil
> ke pengunjung) → **Terbitkan** (baru tampil ke pengunjung). **Batalkan Perubahan**
> mengembalikan semua isian ke draft terakhir yang kamu simpan.

| Tombol | Yang terjadi |
|---|---|
| `Simpan Draft` | Tersimpan sebagai draft. Pelanggan **belum** melihat perubahan. |
| `Pratinjau` | Menyimpan draft lalu membuka `/?preview=draft` di tab baru. Wajib login. |
| `Terbitkan` | Menampilkan dialog konfirmasi `Terbitkan perubahan?`, lalu draft menjadi versi live. |
| `Batalkan Perubahan` | Mengembalikan isian ke draft terakhir yang disimpan. |

**Draft** hanya terlihat oleh admin di tab pratinjau. **Terbit** adalah versi yang dilihat
pelanggan. Selama draft berbeda dari versi terbit, halaman ini menampilkan peringatan
`Ada draft yang belum diterbitkan...` dan halaman Ringkasan menampilkan pill `Ada draft`.

Di tab pratinjau muncul banner: `Mode Pratinjau - perubahan belum diterbitkan ke pengunjung.`

Jika tabel pengaturan online belum disiapkan, muncul peringatan bahwa perubahan hanya
tersimpan di browser yang sedang dipakai. Hubungi pengelola website bila melihat pesan itu.

---

## 7. Media Library

Simpan gambar sekali, pakai berulang kali di seluruh website.

### Upload gambar

1. Pilih kategori di dropdown: `Gambar`, `Logo`, `Banner`, atau `Foto Toko`.
2. Klik `+ Upload Gambar` (di HP tombol ini membuka file/kamera perangkat).
3. Format yang didukung: PNG, JPG, WebP, SVG, GIF.

Batas ukuran: **2 MB** bila penyimpanan online aktif, **400 KB** bila masih mode browser.

### Tambah dari link

Tempel link pada kolom `atau tempel link gambar: https://...` lalu klik `Tambah dari Link`.

### Mencari dan memfilter

- Chip kategori: `Semua`, `Gambar`, `Logo`, `Banner`, `Foto Toko`.
- Dropdown status: `Semua status`, `Digunakan`, `Belum digunakan`.
- Kotak pencarian `Cari gambar...`.

### Kartu gambar

Setiap kartu menampilkan nama, kategori, ukuran (bila ada), dan badge penggunaan:
`Dipakai: <lokasi>` atau `Belum digunakan`.

Tersedia tombol `🔗` (salin link) dan `🗑` (hapus). Menghapus gambar yang sedang dipakai
akan membuat gambarnya hilang dari website.

---

## 8. Slide Beranda

Slide adalah gambar besar paling atas di halaman beranda.

### Tabel slide

Kolom `Urutan`, `Pratinjau`, `Konten`, `Status`, dan `Aksi`. Tombol `Aktif`/`Nonaktif`
mengatur apakah slide tampil. Gunakan tombol pensil untuk `Edit` dan ikon sampah untuk
`Hapus`.

Slide diurutkan dari angka terkecil ke terbesar, jadi urutan `1` tampil paling dulu.

### Field pada form slide

| Field | Batas | Catatan |
|---|---|---|
| `Urutan` | angka ≥ 0 | Menentukan urutan tampil |
| `Status` | — | `Aktif (Tampil di Website)` atau `Nonaktif (Disembunyikan)` |
| `Judul Utama` | maks 60 karakter | Sebaiknya di bawah 40 karakter agar rapi di HP |
| `Subtitle` | maks 80 karakter | Teks kecil di atas judul |
| `Deskripsi` | maks 200 karakter | Sebaiknya di bawah 120 karakter agar tidak menutupi gambar |
| `URL Gambar Slide` | wajib | Disarankan 1200×600 px, JPG/WebP, di bawah 500 KB |
| `Teks Tombol (CTA)` | maks 25 karakter | Misalnya `Cara Pesan` |
| `Link Tujuan Tombol` | wajib | Path internal `/#cara-pesan` atau URL lengkap `https://wa.me/...` |

Di samping setiap field ada penghitung karakter, misalnya `42/60`. Warnanya berubah saat
hampir penuh atau melewati batas.

### Pratinjau dan crop

- **Pratinjau Slide (Live)** menampilkan hasil di **laptop** dan **HP** sekaligus.
  Di laptop teks berada di kiri tengah, di HP teks pindah ke tengah bawah dengan tombol
  selebar layar.
- Tombol `✂️ Sesuaikan Gambar (Crop / Geser)` untuk memotong gambar. Pilih proporsi,
  geser, atur zoom, lalu klik `Simpan Hasil`.

Gambar dipotong otomatis oleh website, jadi letakkan bagian penting di tengah agar aman
di laptop maupun HP.

---

## 9. Brand Partner

Logo merek yang tampil di bagian brand pada halaman beranda.

| Field | Batas | Catatan |
|---|---|---|
| `Nama Brand` | maks 80 karakter | Muncul di bawah logo |
| `Logo Brand` | wajib | Disarankan PNG transparan rasio 2:1, misalnya 160×80 px |
| `Website URL` | opsional | Link yang terbuka saat logo diklik |
| `Urutan` | angka ≥ 0 | Urutan `1` tampil paling dulu |
| `Status` | — | `Aktif (Tampil di Website)` atau `Nonaktif (Disembunyikan)` |

Tombol `Aktif`/`Nonaktif` di tabel bisa dipakai langsung tanpa membuka form.

---

## 10. Cara Keluar

Klik tombol `Keluar` di bagian bawah sidebar. Anda akan kembali ke halaman masuk panel.

Setelah keluar, jangan biarkan tab panel terbuka di komputer bersama.

---

## 11. Masalah Umum

| Masalah | Penyebab & solusi |
|---|---|
| Perubahan tidak terlihat di website | Belum klik `Terbitkan`. Menyimpan draft saja tidak menampilkan perubahan ke pelanggan |
| Tidak bisa masuk | Periksa email/password. Jika lupa, minta pengelola website mengatur ulang |
| Muncul pesan tabel analytics belum tersedia | Minta pengelola menjalankan `supabase-analytics.sql` di Supabase SQL Editor |
| Upload gambar gagal karena ukuran | Maksimal 2 MB (online) atau 400 KB (mode browser). Kompres dulu gambarnya |
| Upload gagal dengan pesan soal penyimpanan online | Minta pengelola menyiapkan penyimpanan gambar, atau pakai file di bawah 400 KB |
| Crop gambar dari link tidak bisa | Gambar dari situs lain dibatasi browser. Upload dulu gambarnya, lalu crop |
| Gambar hilang dari website | Gambar dihapus dari Media Library padahal masih dipakai |
| Peta tidak muncul | Periksa `Link Peta Tertanam` di tab `Kontak & Jam Buka` |
| Perubahan hanya ada di satu komputer | Penyimpanan online belum aktif, minta pengelola menyiapkan tabel pengaturan |
| Data statistik tidak dapat dimuat | Periksa koneksi internet lalu muat ulang halaman |

---

## Catatan teknis untuk pengelola website

- Email admin dibatasi lewat variabel `VITE_ADMIN_EMAILS` (dipisah koma). Bila dikosongkan,
  semua pengguna yang berhasil login diizinkan masuk. Pembatasan ini hanya menyaring tampilan;
  pengaman data ada di Row Level Security Supabase.
- Skema tabel dan kebijakan akses: `docs/Dokumentasi-Struktur-Database.md`.
- Audit keamanan: `SECURITY_AUDIT.md`.
- Cara deploy: lihat bagian Deploy di `README.md`.
