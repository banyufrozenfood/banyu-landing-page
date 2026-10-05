# Panduan Panel Admin — Banyu Frozen Food

Panduan ini untuk owner/admin toko. Tidak perlu paham coding.

---

## Daftar Isi
1. [Cara Masuk](#1-cara-masuk)
2. [Tampilan Panel](#2-tampilan-panel)
3. [Dashboard](#3-dashboard)
4. [Kelola Produk](#4-kelola-produk)
5. [Kelola Kategori](#5-kelola-kategori)
6. [Kelola Hero Carousel](#6-kelola-hero-carousel)
7. [Kelola Banner](#7-kelola-banner)
8. [Kelola Brand Partner](#8-kelola-brand-partner)
9. [Media Library](#9-media-library)
10. [Pengaturan Situs](#10-pengaturan-situs)
11. [Cara Keluar](#11-cara-keluar)
12. [Masalah Umum](#12-masalah-umum)

---

## 1. Cara Masuk

1. Buka browser, ketik alamat website diikuti `/admin`. Contoh: `https://banyufrozenfood.com/admin`
2. Isi **Email** dan **Password** yang sudah dibuat.
3. Klik **Masuk**.

> Akun admin dibuat oleh developer di Supabase Dashboard → Authentication → Users.

---

## 2. Tampilan Panel

Setelah masuk, ada dua bagian utama:

- **Sidebar kiri** — daftar menu: Dashboard, Pengaturan Website, Media Library, Produk, Kategori, Banners, Slide Beranda, Brand Partner
- **Area kanan** — konten halaman yang sedang dibuka. Di atasnya ada header dengan tombol **Lihat Website** (membuka website di tab baru) dan label Admin.

Di layar kecil (HP/tablet), sidebar tersembunyi — buka lewat tombol hamburger (☰) di header.

---

## 3. Dashboard

Halaman pembuka berisi:

- **Kartu panduan** — penjelasan singkat cara mengelola website (muncul saat pertama kali, bisa ditutup).
- **Status Website** — apakah ada draft yang belum diterbitkan, kapan terakhir disimpan dan diterbitkan, serta mode penyimpanan (Online/Supabase atau browser saja). Ada tombol **Edit Website** dan **Lihat Pratinjau**.
- **Statistik** — Total Produk dan Kategori.
- **Aksi Cepat** — jalan pintas ke menu yang sering dipakai (Edit Website, Kelola Media, Kelola Produk, Slide Beranda, Brand Partner, Lihat Website).

---

## 4. Kelola Produk

### Melihat daftar produk
Menu **Produk** → daftar semua produk dalam tabel (foto, nama, kategori, harga, stok). Ada kolom pencarian untuk mencari produk berdasarkan nama.

### Tambah produk baru
1. Klik tombol **Tambah Produk**.
2. Isi form:
   - **Nama Produk** (wajib) — nama produk
   - **Slug URL** (wajib) — terisi otomatis dari nama, boleh diubah manual
   - **Kategori** (wajib) — pilih dari daftar kategori yang sudah ada
   - **Harga (Rp)** (wajib) — angka tanpa titik atau koma (contoh: `25000`)
   - **Stok** (wajib) — jumlah stok saat ini (isi `0` jika habis; produk bertanda "Habis" dan tombol + terkunci)
   - **Deskripsi** — penjelasan produk
   - **URL Gambar** — tempel link gambar langsung. Jika lebih dari satu, pisahkan dengan koma (contoh: `https://.../img1.jpg, https://.../img2.jpg`). Foto pertama menjadi foto utama. Tips: upload dulu ke **Media Library**, lalu salin linknya ke sini.
   - **Jadikan Produk Unggulan** — centang jika ingin produk tampil di section Produk Unggulan beranda
3. Klik **Simpan**.

> Tombol Tokopedia/Shopee di halaman detail produk memakai **link toko global** dari Pengaturan → Isi Beranda, bukan per produk. Jadi tidak ada kolom marketplace di form produk.

### Edit produk
Klik ikon pensil (✏️) di baris produk yang ingin diubah → ubah isian → klik **Simpan**.

### Hapus produk
Klik ikon tempat sampah (🗑️) → konfirmasi hapus. **Tidak bisa dibatalkan.**

---

## 5. Kelola Kategori

Menu **Kategori** → daftar semua kategori (contoh: Nugget, Sosis, Dimsum).

### Tambah kategori
1. Klik **Tambah Kategori**.
2. Isi **nama kategori** (wajib) dan **deskripsi** (opsional).
3. Klik **Simpan**.

> Form kategori hanya berisi nama dan deskripsi — tidak ada kolom ikon/emoji.

### Edit / Hapus
Sama seperti produk — ikon pensil untuk edit, ikon tempat sampah untuk hapus.

> Menghapus kategori tidak menghapus produk di dalamnya. Produk tersebut akan kehilangan kategorinya.

---

## 6. Kelola Hero Carousel

Carousel adalah slide gambar besar yang berputar otomatis di bagian atas beranda.

Menu **Slide Beranda** → daftar slide dalam tabel (urutan, pratinjau gambar, konten, status Aktif/Nonaktif).

### Tambah slide
1. Klik **Tambah Slide Baru**.
2. Isi form:
   - **Urutan** (wajib) — angka; slide dengan angka terkecil tampil pertama
   - **Status** — Aktif (tampil di website) atau Nonaktif (disembunyikan)
   - **Judul Utama** (wajib, maks 60 karakter)
   - **Subtitle** (opsional, maks 80 karakter)
   - **Deskripsi** (opsional, maks 200 karakter)
   - **URL Gambar Slide** (wajib) — disarankan 1200×600 px (rasio 2:1), JPG/WebP, di bawah 500KB. Ada pratinjau gambar langsung saat mengetik URL.
   - **Teks Tombol / CTA** (wajib, maks 25 karakter)
   - **Link Tujuan Tombol** (wajib) — path internal (contoh: `/produk`, `/lokasi`) atau URL lengkap (contoh: `https://tokopedia.com/...`)
3. Klik **Simpan Slide**.

### Mengatur urutan & status
- Ubah angka **Urutan** di form edit — tidak ada tombol geser naik/turun.
- Klik tombol status **Aktif/Nonaktif** langsung di tabel untuk menyembunyikan/menampilkan slide tanpa menghapusnya.

Halaman ini juga menampilkan **panduan visual** (posisi slide di website) dan **referensi cepat** ukuran gambar yang baik.

---

## 7. Kelola Banner

Menu **Banners** → daftar banner dalam tabel (urutan, gambar, judul).

### Tambah banner
1. Klik **Tambah Banner**.
2. Isi **Judul** (wajib), **Subjudul** (opsional), **URL Gambar** (wajib, disarankan rasio 16:9 atau lebar minimal 1200px), dan **Urutan** (angka — terkecil tampil pertama).
3. Klik **Simpan**.

> Catatan: data banner tersimpan di database, tetapi **belum ditampilkan di halaman publik** website. Carousel beranda saat ini memakai data dari menu Slide Beranda.

---

## 8. Kelola Brand Partner

Mengelola logo brand/supplier yang tampil di section "Brand Partner Kami" di beranda (hanya yang berstatus Aktif).

Menu **Brand Partner** → daftar partner dalam tabel (urutan, pratinjau logo, konten, status).

### Tambah brand partner
1. Klik **Tambah Brand Partner**.
2. Isi form:
   - **Nama Brand** (wajib, maks 80 karakter)
   - **Logo Brand** (wajib) — pilih lewat ImagePicker: dari Media Library, upload dari HP/komputer, atau tempel link. Disarankan PNG transparan rasio 2:1 (mis. 160×80px, di bawah 200KB).
   - **Website URL** (opsional) — link yang dibuka saat logo diklik; kosongkan jika tidak ada
   - **Urutan** (angka — terkecil tampil pertama)
   - **Status** — Aktif (tampil) atau Nonaktif (disembunyikan)
3. Klik **Simpan Brand**.

Edit dan hapus sama seperti menu lain (ikon pensil ✏️ dan tempat sampah 🗑️), plus tombol status Aktif/Nonaktif langsung di tabel.

---

## 9. Media Library

Tempat menyimpan semua gambar yang diupload.

Menu **Media Library** → galeri gambar dalam bentuk kartu (nama file, kategori, ukuran).

### Upload gambar
1. Pilih **kategori** dulu: Gambar, Logo, Banner, atau Foto Toko (foto kategori Foto Toko otomatis tampil di galeri halaman Lokasi).
2. Klik **Upload Gambar**, pilih file dari komputer/HP (format: PNG, JPG, WebP, SVG, GIF).
3. Gambar tersimpan dan siap dipakai — salin linknya lewat tombol 🔗 untuk ditempel ke form produk/slide.

### Tambah dari link
Tempel link gambar (`https://...`) di kolom yang tersedia → klik **Tambah dari Link**.

### Cari & filter
Gunakan tombol filter kategori (Semua/Gambar/Logo/Banner/Foto Toko) dan kolom **Cari gambar** berdasarkan nama file.

### Salin & hapus gambar
- Klik ikon **🔗** pada kartu gambar untuk menyalin link gambar.
- Klik ikon **🗑️** untuk menghapus — muncul dialog konfirmasi. **Perhatian:** gambar yang sudah dipakai di website akan ikut hilang tampilannya.

> Jika database/media online belum terhubung, muncul peringatan bahwa gambar hanya tersimpan di browser ini saja.

---

## 10. Pengaturan Situs

Semua konten situs yang bisa diubah tanpa sentuh kode.

Menu **Pengaturan Website** → 5 tab:

| Tab | Apa yang bisa diubah |
|---|---|
| Kontak & Jam Buka | Nomor WhatsApp, pesan otomatis WA, telepon, email, alamat singkat (footer), alamat lengkap (halaman Lokasi), link & peta tertanam Google Maps, daftar jam operasional (tambah/geser/hapus baris) |
| Sosial Media | Daftar akun (nama, ikon, link) — tambah/geser/hapus; link yang dikosongkan menyembunyikan ikon di footer |
| Navbar & Footer | Menu navigasi sudah tetap (Home, Produk, Lokasi) — tidak perlu diatur. Di sini hanya ubah deskripsi footer dan catatan kecil footer |
| Isi Beranda | Nyalakan/matikan section beranda (Keunggulan, Produk Unggulan, Marketplace, Brand Partner); link toko Tokopedia & Shopee; judul, kalimat pendukung, dan daftar keunggulan |
| SEO | Judul website (tab browser & hasil Google), deskripsi website, gambar untuk bagikan link (og image) |

Di bagian atas halaman terlihat kapan terakhir disimpan dan diterbitkan, plus peringatan jika ada draft yang belum diterbitkan.

### Cara menyimpan & menerbitkan
1. Ubah isian → klik **Pratinjau** untuk melihat hasilnya di tab baru.
2. Klik **Simpan Draft** untuk menyimpan tanpa langsung tampil di website.
3. Klik **Terbitkan** (ada dialog konfirmasi) agar perubahan langsung tampil untuk pengunjung.
4. Klik **Batalkan Perubahan** untuk mengembalikan semua isian ke draft terakhir yang disimpan.

> **Catatan Tokopedia/Shopee:** Jika link dikosongkan, tombol marketplace di beranda dan halaman detail produk akan otomatis disembunyikan. Tidak perlu menghapus tombolnya secara manual.

> **Yang tidak bisa diubah dari panel:** nama toko, logo, dan warna tema — tiga hal ini masih diatur lewat kode (`src/cms/defaults.js`). Hubungi developer jika perlu diubah.

---

## 11. Cara Keluar

Klik tombol **🚪 Logout** di bagian bawah sidebar.

---

## 12. Masalah Umum

| Masalah | Solusi |
|---|---|
| Tidak bisa login | Periksa email/password. Hubungi developer jika lupa password. |
| Produk tidak tampil di website | Pastikan produk sudah disimpan (refresh halaman daftar produk). Semua produk tersimpan otomatis tampil — tidak ada tombol sembunyikan produk. |
| Foto produk tidak muncul | Periksa format URL gambar: harus link langsung (`https://...`), pisahkan dengan koma jika lebih dari satu, tanpa spasi berlebih. Coba salin ulang link dari Media Library. |
| Perubahan di Pengaturan tidak tampil | Pastikan sudah klik **Terbitkan**, bukan hanya **Simpan Draft**. |
| Upload gambar gagal | Periksa format file (PNG/JPG/WebP/SVG/GIF) dan ukuran file. Jika muncul peringatan mode browser, database online belum terhubung — hubungi developer. |
| Website error / blank | Hubungi developer — kemungkinan ada masalah koneksi ke database. |
