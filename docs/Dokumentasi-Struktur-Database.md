# Struktur Database — Banyu Frozen Food

Database PostgreSQL dihost di Supabase. Skema lengkap ada di `supabase-schema.sql`.

---

## Ringkasan Tabel

| Tabel | Fungsi |
|---|---|
| `categories` | Kelompok produk (Nugget, Sosis, Dimsum, dll) |
| `products` | Data produk yang dijual |
| `banners` | Banner promosi (dikelola di panel admin) |
| `hero_slides` | Slide carousel di beranda |
| `brand_partners` | Logo brand/supplier di beranda |
| `site_settings` | Pengaturan seluruh konten situs (CMS) |
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
  category_id (FK → categories.id)
  price, stock
  description, specs (JSONB)
  images (TEXT[])
  is_featured
```

Tabel lain (`hero_slides`, `brand_partners`, `banners`, `site_settings`, `media_library`) berdiri sendiri — tidak berelasi ke tabel lain.

---

## Detail Tabel

### `categories`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key, auto-increment |
| `name` | TEXT | Nama kategori (wajib) |
| `icon` | TEXT | Emoji ikon (default: 📦) |
| `description` | TEXT | Deskripsi singkat |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

### `products`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key, auto-increment |
| `name` | TEXT | Nama produk (wajib) |
| `slug` | TEXT | URL-friendly, unik (wajib) |
| `category_id` | BIGINT | FK ke `categories.id` |
| `price` | INTEGER | Harga dalam Rupiah |
| `stock` | INTEGER | Jumlah stok |
| `description` | TEXT | Deskripsi produk |
| `specs` | JSONB | Spesifikasi (key-value bebas) |
| `images` | TEXT[] | Array URL foto |
| `is_featured` | BOOLEAN | Tampil di beranda jika TRUE |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

### `hero_slides`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `title` | TEXT | Judul slide |
| `subtitle` | TEXT | Subjudul |
| `description` | TEXT | Teks penjelasan |
| `image` | TEXT | URL gambar slide |
| `cta_text` | TEXT | Teks tombol |
| `cta_link` | TEXT | Link tombol (`/produk`, `/lokasi`, dll) |
| `order` | INTEGER | Urutan tampil |
| `is_active` | BOOLEAN | Tampil jika TRUE |

### `brand_partners`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | TEXT | Nama brand |
| `logo` | TEXT | URL logo |
| `website_url` | TEXT | Link website brand (opsional) |
| `order` | INTEGER | Urutan tampil |
| `is_active` | BOOLEAN | Tampil jika TRUE |

### `banners`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `title` | TEXT | Judul banner |
| `subtitle` | TEXT | Subjudul |
| `image` | TEXT | URL gambar |
| `order` | INTEGER | Urutan tampil |

### `site_settings`
Hanya satu baris (id = 1). Menyimpan seluruh pengaturan situs dalam dua kolom JSONB:

| Kolom | Keterangan |
|---|---|
| `draft` | Perubahan yang belum diterbitkan |
| `published` | Yang sedang tampil di website |
| `updated_at` | Terakhir disimpan |
| `published_at` | Terakhir diterbitkan |

### `media_library`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | TEXT | Nama file |
| `url` | TEXT | URL publik file |
| `category` | TEXT | Kategori file (gambar, banner, dll) |
| `size` | INTEGER | Ukuran file dalam byte |
| `storage_path` | TEXT | Path di Supabase Storage |

---

## Row Level Security (RLS)

Semua tabel mengaktifkan RLS. Aturan akses:

| Aksi | Siapa yang boleh |
|---|---|
| Baca (`SELECT`) | Semua orang (publik) |
| Tambah/Ubah/Hapus (`INSERT/UPDATE/DELETE`) | Hanya admin yang sudah login (`authenticated`) |

Pengecualian: `reviews` izinkan INSERT publik (pelanggan kirim ulasan) — tapi tabel ini belum dipakai di UI saat ini.

---

## Storage

Bucket `media` di Supabase Storage menyimpan file gambar yang diupload lewat panel admin. Bucket bersifat **publik** — URL gambar bisa diakses langsung tanpa autentikasi. Upload dan hapus file hanya bisa dilakukan oleh admin yang sudah login.
