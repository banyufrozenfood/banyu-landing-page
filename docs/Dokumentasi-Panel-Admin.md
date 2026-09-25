# 🛠️ Panduan Panel Admin — Banyu Frozen Food

Dokumentasi lengkap cara menggunakan panel admin untuk mengelola konten website katalog Banyu Frozen Food.

---

## 📋 Daftar Isi

1. [Prasyarat & Persiapan](#1-prasyarat--persiapan)
2. [Cara Login](#2-cara-login)
3. [Kenalan dengan Layout Panel](#3-kenalan-dengan-layout-panel)
4. [Dashboard](#4-dashboard)
5. [Manajemen Produk](#5-manajemen-produk)
6. [Manajemen Kategori](#6-manajemen-kategori)
7. [Manajemen Banner](#7-manajemen-banner)
8. [Logout](#8-logout)
9. [Catatan & Batasan Penting](#9-catatan--batasan-penting)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prasyarat & Persiapan

Sebelum memakai panel admin, pastikan langkah setup berikut sudah dilakukan:

### a. Setup environment variable

Di file `.env` di root project, isi kedua variabel ini (dari dashboard Supabase → **Project Settings → API**):

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### b. Buat tabel database

Jalankan seluruh isi file [`supabase-schema.sql`](../supabase-schema.sql) di **Supabase Dashboard → SQL Editor → New query → Run**.

### c. Buat akun admin

Panel admin memakai **Supabase Auth** (email + password). Buat akun admin:

1. Buka **Supabase Dashboard → Authentication → Users → Add user**.
2. Isi **Email** dan **Password**, centang **Auto Confirm User**.
3. Contoh: `admin@banyu.com` / password pilihanmu.

> ⚠️ Policy RLS memberi akses **penuh (CRUD)** hanya kepada user dengan status `authenticated`. User yang belum login hanya bisa **membaca** data (dan review yang berstatus `approved`).

### d. Jalankan aplikasi

```bash
npm install
npm run dev
```

Buka `http://localhost:5173/admin` (port Vite default adalah **5173**).

---

## 2. Cara Login

1. Akses halaman login di **`/admin`**.
2. Masukkan **Email** dan **Password** akun admin.
3. Klik tombol **Login**.
4. Jika berhasil, kamu akan diarahkan otomatis ke `/admin/dashboard`.
5. Jika gagal, muncul pesan error merah (misal: *Invalid login credentials*).

**Catatan:**
- Jika sudah login dan membuka `/admin`, kamu akan langsung di-redirect ke dashboard.
- Semua route `/admin/*` (kecuali halaman login) dilindungi `AdminLayout`. Jika sesi tidak ada atau habis, kamu akan otomatis dilempar kembali ke halaman login `/admin`.

---

## 3. Kenalan dengan Layout Panel

Setelah login, semua halaman admin memakai layout yang sama:

```
┌────────────┬──────────────────────────────────────────┐
│            │  Header: [☰] Panel Admin  |  Lihat Website  Admin  │
│  SIDEBAR   ├──────────────────────────────────────────┤
│            │                                          │
│ 📊 Dashboard│         KONTEN HALAMAN (Outlet)          │
│ 📦 Produk   │                                          │
│ 🏷️ Kategori │                                          │
│ 🖼️ Banners  │                                          │
│            │                                          │
│ 🚪 Logout  │                                          │
└────────────┴──────────────────────────────────────────┘
```

| Elemen | Fungsi |
|---|---|
| **Sidebar** | Navigasi antar halaman admin. Menu aktif ditandai dengan highlight. |
| **☰ (hamburger)** | Membuka sidebar di tampilan mobile/tablet. |
| **Lihat Website** | Membuka halaman utama website dalam tab baru. |
| **Logout** | Mengakhir sesi dan kembali ke halaman login. |

**Menu sidebar:**

| Ikon | Menu | Route | Fungsi |
|---|---|---|---|
| 📊 | Dashboard | `/admin/dashboard` | Ringkasan statistik |
| 📦 | Produk | `/admin/products` | Kelola produk |
| 🏷️ | Kategori | `/admin/categories` | Kelola kategori |
| 🖼️ | Banners | `/admin/banners` | Kelola banner carousel |

---

## 4. Dashboard

**Route:** `/admin/dashboard`

Halaman ringkasan yang menampilkan:

| Kartu Statistik | Sumber Data |
|---|---|
| 📦 **Total Produk** | Jumlah baris tabel `products` |
| 🏷️ **Kategori** | Jumlah baris tabel `categories` |
| ⭐ **Ulasan** | Jumlah baris tabel `reviews` |

Di bawah kartu statistik terdapat **Panduan Singkat** sebagai pengingat singkat penggunaan menu.

> 💡 Dashboard hanya menampilkan angka (read-only) — tidak ada aksi yang bisa dilakukan dari halaman ini.

---

## 5. Manajemen Produk

**Route:** `/admin/products`

Mengelola semua produk yang tampil di website.

### 5.1 Melihat & Mencari Produk

- Tabel menampilkan: **foto + nama produk, kategori, harga (Rp), stok, aksi**.
- Produk diurutkan dari yang **terbaru** (`created_at` descending).
- Gunakan kolom pencarian **"Cari nama produk..."** untuk filter cepat (berdasarkan nama, tanpa memuat ulang data dari server).

### 5.2 Menambah Produk

1. Klik tombol **`+ Tambah Produk`** di pojok kanan atas.
2. Isi form berikut:

   | Field | Wajib? | Keterangan |
   |---|---|---|
   | **Nama Produk** | ✅ | Mengetik nama otomatis menghasilkan **slug** (bisa diedit manual). |
   | **Slug URL** | ✅ | Dipakai untuk URL bersih (`/produk/nama-produk`). Harus unik. |
   | **Kategori** | ✅ | Pilih dari dropdown kategori yang sudah dibuat. |
   | **Harga (Rp)** | ✅ | Angka dalam Rupiah (tanpa titik/koma), mis. `35000`. |
   | **Stok** | ✅ | Jumlah stok (angka). |
   | **Deskripsi Produk** | ❌ | Teks bebas, mendukung beberapa baris. |
   | **URL Gambar** | ❌ | Pisahkan banyak URL dengan **koma**. Contoh: `https://.../1.jpg, https://.../2.jpg`. Foto pertama jadi foto utama/thumbnail. |
   | **URL Tokopedia** | ❌ | Link marketplace Tokopedia produk ini. |
   | **URL Shopee** | ❌ | Link marketplace Shopee produk ini. |
   | **Produk Unggulan** | ❌ | Centang agar tampil di **Homepage** (Produk Unggulan). |

3. Klik **Simpan**. Tunggu hingga muncul kembali tabel (toast/sukses tidak tampil — form akan tertutup dan tabel termuat ulang).
4. Klik **Batal** jika ingin membatalkan.

### 5.3 Mengedit Produk

1. Klik tombol **✏️** pada baris produk yang diinginkan.
2. Form terbuka dengan data lama yang sudah terisi.
3. Ubah field yang diinginkan, lalu klik **Simpan**.

> ℹ️ Field **Gambar** ditampilkan sebagai teks URL yang dipisah koma (bukan upload file). Saat disimpan, teks itu dikonversi kembali menjadi array.

### 5.4 Menghapus Produk

1. Klik tombol **🗑️** pada baris produk.
2. Konfirmasi dialog **"Yakin ingin menghapus produk ini?"** → klik OK.
3. Produk dihapus permanen.

> ⚠️ Menghapus produk juga **menghapus semua ulasan** yang terkait dengannya (relasi `ON DELETE CASCADE`).

---

## 6. Manajemen Kategori

**Route:** `/admin/categories`

Mengelola pengelompokan produk (dipakai untuk filter halaman produk dan dropdown form produk).

### 6.1 Melihat Kategori

Tabel menampilkan: **ID, Icon, Nama Kategori, Deskripsi, Aksi**, diurutkan berdasarkan ID menaik.

### 6.2 Menambah Kategori

1. Klik **`+ Tambah Kategori`**.
2. Isi form:

   | Field | Wajib? | Keterangan |
   |---|---|---|
   | **Nama Kategori** | ✅ | Contoh: `Daging Ayam`. |
   | **Icon (Emoji/Teks)** | ✅ | Contoh: `🍗`. Default: `📦`. |
   | **Deskripsi** | ❌ | Teks penjelasan opsional. |

3. Klik **Simpan**.

### 6.3 Mengedit Kategori

Klik **✏️** pada baris → ubah data → **Simpan**.

### 6.4 Menghapus Kategori

1. Klik **🗑️** pada baris.
2. Konfirmasi: *"Yakin ingin menghapus kategori ini? (Produk yang terhubung mungkin kehilangan kategori)"*.

> ⚠️ Perilaku database: saat kategori dihapus, kolom `category_id` pada produk terkait di-set menjadi **NULL** (`ON DELETE SET NULL`) — produk **tidak ikut terhapus**, hanya kehilangan kategorinya. Sebaiknya pindahkan produk ke kategori lain terlebih dahulu sebelum menghapus.

---

## 7. Manajemen Banner

**Route:** `/admin/banners`

Mengelola banner carousel di halaman beranda.

### 7.1 Melihat Banner

Tabel menampilkan: **Urutan, Gambar (preview), Judul/Subjudul, Aksi**, diurutkan berdasarkan kolom `order` menaik.

### 7.2 Menambah Banner

1. Klik **`+ Tambah Banner`**.
2. Isi form:

   | Field | Wajib? | Keterangan |
   |---|---|---|
   | **Judul Banner** | ✅ | Contoh: `Promo Spesial Banyu`. |
   | **Subjudul** | ❌ | Contoh: `Diskon 20% untuk pembelian minggu ini`. |
   | **URL Gambar Banner** | ✅ | URL gambar langsung (bukan upload). Disarankan rasio **16:9** / lebar minimal **1200px**. |
   | **Urutan (Angka)** | ✅ | Angka kecil tampil lebih dulu (`0` = paling awal). |

3. Klik **Simpan**.

### 7.3 Mengedit / Menghapus Banner

- **Edit:** klik **✏️** → ubah data → **Simpan**.
- **Hapus:** klik **🗑️** → konfirmasi *"Yakin ingin menghapus banner ini?"* → OK.

---

## 8. Logout

Klik tombol **`🚪 Logout`** di bagian bawah sidebar. Sesi Supabase diakhiri dan kamu diarahkan kembali ke halaman login `/admin`.

---

## 9. Catatan & Batasan Penting

Poin-poin yang perlu diketahui tentang perilaku panel saat ini:

1. **Belum ada halaman kelola Review di panel.**
   Tabel `reviews` ada di database (terhitung di dashboard), tetapi **belum ada UI moderasi**. Saat ini review masuk dengan status `pending` dan hanya tampil di website jika statusnya `approved`. Moderasi review dilakukan langsung via **Supabase Dashboard → Table Editor → reviews** (ubah kolom `status` menjadi `approved` / `rejected`).

2. **Gambar diunggah lewat URL, bukan file upload.**
   Produk dan banner menerima URL gambar eksternal (mis. dari image host). Belum ada fitur upload file ke Supabase Storage.

3. **Tidak ada halaman kelola ulasan/rating manual.**
   Kolom `rating` & `review_count` pada tabel `products` diisi manual (via form edit tidak tersedia — bisa lewat Supabase Table Editor bila perlu).

4. **Keamanan.**
   - Route admin dilindungi pengecekan sesi di `AdminLayout`.
   - Akses tulis (INSERT/UPDATE/DELETE) hanya berhasil untuk user `authenticated` (RLS).
   - Kunci `anon` tetap harus dijaga di `.env` — jangan commit `.env` ke version control.

5. **Field `specs` (JSONB) pada produk belum punya form** di panel saat ini; bisa diisi langsung via Supabase Table Editor bila diperlukan.

---

## 10. Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Login gagal "Invalid login credentials" | Email/password salah atau user belum dibuat | Buat user di Supabase → Authentication → Users |
| Halaman admin kosong / error `supabaseUrl is required` | Variabel `.env` belum diisi | Isi `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`, lalu restart `npm run dev` |
| Data tidak bisa disimpan (pesan permission) | RLS belum aktif / policy belum dibuat | Jalankan ulang `supabase-schema.sql` di SQL Editor |
| Tabel ditemukan tetapi kosong | Belum ada data / policy SELECT memblokir | Cek isi tabel di Supabase → Table Editor |
| Setelah edit, tabel tidak berubah | Cache state lokal | Muat ulang halaman (F5) |
| Slug bentrok/duplikat | Slug harus unik | Ubah slug secara manual pada form |
| Redirect terus ke `/admin` | Sesi login habis | Login ulang |

---

**File terkait:**
- [`supabase-schema.sql`](../supabase-schema.sql) — skema database & policy RLS
- [`docs/Dokumentasi-Struktur-Database.md`](./Dokumentasi-Struktur-Database.md) — dokumentasi struktur database lengkap
- [`README.md`](../README.md) — overview project
