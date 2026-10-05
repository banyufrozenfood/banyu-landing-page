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
7. [Kelola Brand Partner](#7-kelola-brand-partner)
8. [Media Library](#8-media-library)
9. [Pengaturan Situs](#9-pengaturan-situs)
10. [Cara Keluar](#10-cara-keluar)
11. [Masalah Umum](#11-masalah-umum)

---

## 1. Cara Masuk

1. Buka browser, ketik alamat website diikuti `/admin`. Contoh: `https://banyufrozenfood.com/admin`
2. Isi **Email** dan **Password** yang sudah dibuat.
3. Klik **Masuk**.

> Akun admin dibuat oleh developer di Supabase Dashboard → Authentication → Users.

---

## 2. Tampilan Panel

Setelah masuk, ada dua bagian utama:

- **Sidebar kiri** — daftar menu: Dashboard, Produk, Kategori, Hero Carousel, Banner, Brand Partner, Media, Pengaturan
- **Area kanan** — konten halaman yang sedang dibuka

---

## 3. Dashboard

Menampilkan ringkasan: jumlah produk, jumlah kategori, jumlah hero slide. Tidak ada aksi di sini, hanya informasi sekilas.

---

## 4. Kelola Produk

### Melihat daftar produk
Menu **Produk** → daftar semua produk dalam tabel.

### Tambah produk baru
1. Klik tombol **Tambah Produk**.
2. Isi form:
   - **Nama** — nama produk (wajib)
   - **Kategori** — pilih dari daftar kategori yang sudah ada
   - **Harga** — angka tanpa titik atau koma (contoh: `25000`)
   - **Stok** — jumlah stok saat ini
   - **Deskripsi** — penjelasan produk
   - **Spesifikasi** — detail teknis produk (opsional)
   - **Foto** — klik area upload atau pilih dari Media Library
   - **Produk Unggulan** — centang jika ingin produk tampil di beranda
3. Klik **Simpan**.

### Edit produk
Klik ikon pensil (✏️) di baris produk yang ingin diubah → ubah isian → klik **Simpan**.

### Hapus produk
Klik ikon tempat sampah (🗑️) → konfirmasi hapus. **Tidak bisa dibatalkan.**

---

## 5. Kelola Kategori

Menu **Kategori** → daftar semua kategori (contoh: Nugget, Sosis, Dimsum).

### Tambah kategori
1. Klik **Tambah Kategori**.
2. Isi nama dan ikon (emoji).
3. Klik **Simpan**.

### Edit / Hapus
Sama seperti produk — ikon pensil untuk edit, ikon tempat sampah untuk hapus.

> Menghapus kategori tidak menghapus produk di dalamnya. Produk tersebut akan kehilangan kategorinya.

---

## 6. Kelola Hero Carousel

Carousel adalah slide gambar besar yang berputar otomatis di bagian atas beranda.

Menu **Hero Carousel** → daftar slide.

### Tambah slide
1. Klik **Tambah Slide**.
2. Isi judul, subjudul, deskripsi, gambar, teks tombol, dan link tombol.
3. Centang **Aktif** agar slide tampil.
4. Klik **Simpan**.

### Mengatur urutan
Gunakan tombol panah atas/bawah di tabel untuk mengubah urutan slide.

---

## 7. Kelola Brand Partner

Mengelola logo brand/supplier yang tampil di bagian bawah beranda.

Menu **Brand Partner** → tambah, edit, hapus logo partner, atur urutan tampil.

---

## 8. Media Library

Tempat menyimpan semua gambar yang diupload.

Menu **Media** → galeri gambar.

### Upload gambar
1. Klik **Upload Gambar**.
2. Pilih file dari komputer (JPG, PNG, WebP).
3. Gambar tersimpan dan siap dipilih saat isi form produk atau hero slide.

### Hapus gambar
Klik gambar → klik **Hapus**. Pastikan gambar tidak sedang dipakai oleh produk lain.

---

## 9. Pengaturan Situs

Semua konten situs yang bisa diubah tanpa sentuh kode.

Menu **Pengaturan** → beberapa tab:

| Tab | Apa yang bisa diubah |
|---|---|
| Identitas | Nama toko, logo, deskripsi singkat |
| Kontak | Nomor WhatsApp, alamat, jam buka, link Google Maps |
| Isi Beranda | Teks sambutan, link Tokopedia, link Shopee |
| Sosial Media | Link Instagram, Facebook, TikTok |
| SEO | Judul halaman, deskripsi untuk Google |

### Cara menyimpan & menerbitkan
- Klik **Simpan Draft** untuk menyimpan tanpa langsung tampil di website.
- Klik **Terbitkan** agar perubahan langsung tampil untuk pengunjung.

> **Catatan Tokopedia/Shopee:** Jika link dikosongkan, tombol marketplace di beranda akan otomatis disembunyikan. Tidak perlu menghapus tombolnya secara manual.

---

## 10. Cara Keluar

Klik nama/foto profil di pojok kiri bawah sidebar → klik **Keluar**.

---

## 11. Masalah Umum

| Masalah | Solusi |
|---|---|
| Tidak bisa login | Periksa email/password. Hubungi developer jika lupa password. |
| Produk tidak tampil di website | Pastikan produk sudah disimpan dan tidak disembunyikan. |
| Foto tidak muncul | Coba upload ulang gambar melalui Media Library. |
| Perubahan di Pengaturan tidak tampil | Pastikan sudah klik **Terbitkan**, bukan hanya **Simpan Draft**. |
| Website error merah | Hubungi developer — kemungkinan ada masalah koneksi ke database. |
