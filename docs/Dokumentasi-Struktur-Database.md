# Struktur Database — Banyu Frozen Food

Database PostgreSQL dihost di Supabase (8 tabel). Skema lengkap ada di `supabase-schema.sql`.

---

## Ringkasan Tabel

| Tabel | Fungsi |
|---|---|
| `categories` | Kelompok produk (Nugget, Sosis, Dimsum, dll) |
| `products` | Data produk yang dijual |
| `reviews` | Ulasan pelanggan — sudah disiapkan, belum dipakai di UI |
| `banners` | Banner promosi — data dikelola di panel admin, belum ditampilkan di halaman publik |
| `hero_slides` | Slide carousel di beranda (hanya yang aktif yang tampil) |
| `brand_partners` | Logo brand/supplier di beranda (hanya yang aktif yang tampil) |
| `site_settings` | Pengaturan seluruh konten situs / CMS (satu baris, id = 1) |
| `media_library` | Daftar gambar yang sudah diupload |

---

## Diagram Relasi

```
categories
  id (PK)
  name
  icon
  description
    │
    │ 1 : banyak
    ▼
products
  id (PK)
  name, slug (UNIQUE)
  category_id (FK → categories.id, ON DELETE SET NULL)
  price, stock
  description, specs (JSONB, default '{}')
  images (TEXT[], default '{}')
  is_featured
     │
     │ 1 : banyak
     ▼
reviews
  id (PK)
  product_id (FK → products.id, ON DELETE CASCADE)
  name, rating (1–5), comment
  status ('pending' / 'approved' / 'rejected')
```

> Link Tokopedia/Shopee bukan kolom per produk — melainkan **link toko global** yang tersimpan di `site_settings` (Pengaturan → Isi Beranda) dan dipakai di beranda + halaman detail produk.

Tabel lain (`hero_slides`, `brand_partners`, `banners`, `site_settings`, `media_library`) berdiri sendiri — tidak berelasi ke tabel lain.

---

## Detail Tabel

### `categories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key, auto-increment |
| `name` | TEXT | Nama kategori (wajib) |
| `icon` | TEXT | Kolom emoji ikon (default: 📦) — ada di database, tapi tidak diubah lewat form panel admin |
| `description` | TEXT | Deskripsi singkat |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

### `products`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key, auto-increment |
| `name` | TEXT | Nama produk (wajib) |
| `slug` | TEXT | URL-friendly, unik (wajib, dibuat otomatis dari nama) |
| `category_id` | BIGINT | FK ke `categories.id` (NULL jika kategori dihapus) |
| `price` | INTEGER | Harga dalam Rupiah |
| `stock` | INTEGER | Jumlah stok (`0` = tampil "Habis") |
| `description` | TEXT | Deskripsi produk |
| `specs` | JSONB | Spesifikasi (key-value bebas, default `'{}'`) |
| `images` | TEXT[] | Array URL foto (default `'{}'`, foto pertama = utama) |
| `is_featured` | BOOLEAN | Tampil di Produk Unggulan beranda jika TRUE |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

### `reviews` (belum dipakai di UI)
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key, auto-increment |
| `product_id` | BIGINT | FK ke `products.id` (ikut terhapus jika produk dihapus) |
| `name` | TEXT | Nama pengulas (wajib) |
| `rating` | INTEGER | 1–5 (wajib) |
| `comment` | TEXT | Isi ulasan |
| `status` | TEXT | `pending` / `approved` / `rejected` (default `pending`) |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

### `hero_slides`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `title` | TEXT | Judul slide (wajib) |
| `subtitle` | TEXT | Subjudul |
| `description` | TEXT | Teks penjelasan |
| `image` | TEXT | URL gambar slide (wajib) |
| `cta_text` | TEXT | Teks tombol |
| `cta_link` | TEXT | Link tombol — path internal (`/produk`, `/lokasi`) atau URL lengkap |
| `order` | INTEGER | Urutan tampil (terkecil pertama) |
| `is_active` | BOOLEAN | Tampil di beranda jika TRUE |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

> Berisi 3 slide + 6 brand partner bawaan sebagai seed awal (dengan gambar placeholder).

### `brand_partners`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | TEXT | Nama brand |
| `logo` | TEXT | URL logo |
| `website_url` | TEXT | Link website brand (opsional, dibuka saat logo diklik) |
| `order` | INTEGER | Urutan tampil (terkecil pertama) |
| `is_active` | BOOLEAN | Tampil di beranda jika TRUE |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

### `banners`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `title` | TEXT | Judul banner (wajib) |
| `subtitle` | TEXT | Subjudul |
| `image` | TEXT | URL gambar (wajib) |
| `order` | INTEGER | Urutan tampil (terkecil pertama) |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

> Tidak ada kolom status aktif — dan data banner saat ini belum ditampilkan di halaman publik mana pun.

### `site_settings`
Hanya satu baris (id = 1). Menyimpan seluruh pengaturan situs dalam dua kolom JSONB:

| Kolom | Keterangan |
|---|---|
| `id` | INTEGER primary key, selalu `1` |
| `draft` | Perubahan yang belum diterbitkan |
| `published` | Yang sedang tampil di website |
| `updated_at` | Terakhir disimpan |
| `published_at` | Terakhir diterbitkan |

Isi JSON mencakup: `identity` (nama toko, logo), `contact` (WA, telepon, email, alamat, maps, jam buka), `socials`, `navbar`, `footer`, `home` (toggle section, link Tokopedia/Shopee, keunggulan), `appearance` (warna, radius), `seo`.

### `media_library`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | TEXT | Nama file |
| `url` | TEXT | URL publik file |
| `category` | TEXT | Kategori file: `gambar` / `logo` / `banner` / `toko` (default `gambar`) |
| `size` | INTEGER | Ukuran file dalam byte |
| `storage_path` | TEXT | Path di Supabase Storage (kosong jika ditambah dari link) |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

---

## Row Level Security (RLS)

Semua tabel mengaktifkan RLS. Aturan akses:

| Aksi | Siapa yang boleh |
|---|---|
| Baca (`SELECT`) produk, kategori, banner, media, site_settings | Semua orang (publik) |
| Baca `hero_slides` / `brand_partners` | Publik, hanya yang `is_active = TRUE` |
| Baca `reviews` | Publik, hanya yang `status = 'approved'` |
| Kirim review (`INSERT` ke `reviews`) | Publik ( disiapkan untuk form ulasan fase berikutnya) |
| Tambah/Ubah/Hapus (semua tabel) | Hanya admin yang sudah login (`authenticated`) |

---

## Storage

Bucket `media` di Supabase Storage menyimpan file gambar yang diupload lewat panel admin. Bucket bersifat **publik** — URL gambar bisa diakses langsung tanpa autentikasi. Upload dan hapus file hanya bisa dilakukan oleh admin yang sudah login.
