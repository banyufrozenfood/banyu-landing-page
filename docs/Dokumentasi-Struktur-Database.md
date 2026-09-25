# 🗄️ Dokumentasi Struktur Database — Banyu Frozen Food

Database **PostgreSQL (Supabase)** untuk website katalog Banyu Frozen Food.
Skema resmi ada di file [`supabase-schema.sql`](../supabase-schema.sql).

---

## 📋 Daftar Isi

1. [Ringkasan Tabel](#1-ringkasan-tabel)
2. [Diagram Relasi (ERD)](#2-diagram-relasi-erd)
3. [Detail Setiap Tabel](#3-detail-setiap-tabel)
   - [categories](#31-categories--kategori)
   - [products](#32-products--produk)
   - [reviews](#33-reviews--ulasan)
   - [banners](#34-banners--banner)
4. [Relasi Antar Tabel](#4-relasi-antar-tabel)
5. [Row Level Security (RLS)](#5-row-level-security-rls)
6. [Akses dari Panel Admin](#6-akses-dari-panel-admin)
7. [Catatan Teknis & Best Practice](#7-catatan-teknis--best-practice)

---

## 1. Ringkasan Tabel

| # | Tabel | Fungsi | Baris awal |
|---|---|---|---|
| 1 | `categories` | Pengelompokan produk (mis. Daging Ayam, Nugget) | — |
| 2 | `products` | Data produk yang dijual | — |
| 3 | `reviews` | Ulasan pelanggan per produk | — |
| 4 | `banners` | Banner carousel di halaman beranda | — |

Semua tabel memakai **`BIGINT GENERATED ALWAYS AS IDENTITY`** sebagai primary key (auto-increment, tidak bisa di-update manual).

---

## 2. Diagram Relasi (ERD)

```
┌─────────────────────┐         ┌─────────────────────────┐
│     categories      │         │        products         │
├─────────────────────┤         ├─────────────────────────┤
│ id          (PK) ◄──┼────┐    │ id          (PK)        │
│ name               │    │    │ name                    │
│ icon               │    └────┼─ category_id  (FK)      │
│ description        │         │ slug          (UNIQUE)   │
│ created_at         │         │ price                   │
└─────────────────────┘         │ rating                  │
                                │ review_count            │
                                │ stock                   │
                                │ description             │
                                │ specs        (JSONB)    │
                                │ images        (TEXT[])   │
                                │ tokopedia_url           │
                                │ shopee_url              │
                                │ is_featured             │
                                │ created_at              │
                                └───────────┬─────────────┘
                                            │
                     ON DELETE CASCADE      │
                     ┌──────────────────────┼─────────────┐
                     │                      │             │
              ┌──────┴───────────┐   ┌──────┴─────────────┴──┐
              │     reviews      │   │       banners         │
              ├──────────────────┤   ├───────────────────────┤
              │ id        (PK)   │   │ id          (PK)      │
              │ product_id (FK) ─┘   │ title                 │
              │ name                │ subtitle              │
              │ rating     (1-5)    │ image                 │
              │ comment            │ order                  │
              │ status             │ created_at             │
              │ created_at         └───────────────────────┘
              └──────────────────┘
                   (tanpa relasi ke tabel lain —
                    tabel independen)
```

**Ringkasan relasi:**
- `products.category_id` → `categories.id` — **banyak produk ke satu kategori**
- `reviews.product_id` → `products.id` — **banyak ulasan ke satu produk**
- `banners` — **tidak berelasi** dengan tabel lain (independen)

---

## 3. Detail Setiap Tabel

### 3.1 `categories` — Kategori

Mengelompokkan produk. Digunakan untuk filter di halaman **/produk** dan dropdown form produk di panel admin.

| Kolom | Tipe | Null | Default | Keterangan |
|---|---|---|---|---|
| `id` | `BIGINT` | ❌ | identity | Primary key, auto-increment |
| `name` | `TEXT` | ❌ | — | Nama kategori, wajib diisi. Contoh: `Daging Ayam` |
| `icon` | `TEXT` | ✅ | `'📦'` | Emoji/icon tampilan. Contoh: `🍗` |
| `description` | `TEXT` | ✅ | `NULL` | Deskripsi opsional |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | Waktu pembuatan (zona waktu server) |

**Indeks & constraint:**
- Primary key pada `id`.

**Contoh data:**

| id | name | icon | description |
|---|---|---|---|
| 1 | Nugget | 🍗 | Nugget ayam & sapi |
| 2 | Sosis | 🌭 | Sosis beku |
| 3 | Kentang | 🍟 | Kentang beku siap goreng |

---

### 3.2 `products` — Produk

Tabel utama berisi semua produk katalog.

| Kolom | Tipe | Null | Default | Keterangan |
|---|---|---|---|---|
| `id` | `BIGINT` | ❌ | identity | Primary key |
| `name` | `TEXT` | ❌ | — | Nama produk |
| `slug` | `TEXT` | ❌ | — | **UNIQUE** — dipakai untuk URL `/produk/:slug` |
| `category_id` | `BIGINT` | ✅ | `NULL` | FK → `categories.id`, `ON DELETE SET NULL` |
| `price` | `INTEGER` | ❌ | `0` | Harga dalam **Rupiah** (bilangan bulat) |
| `rating` | `NUMERIC(2,1)` | ✅ | `0` | Rating rata-rata, 1 desimal. Rentang teknis `0.0`–`9.9` (ideal `0.0`–`5.0`) |
| `review_count` | `INTEGER` | ✅ | `0` | Jumlah ulasan |
| `stock` | `INTEGER` | ✅ | `0` | Jumlah stok |
| `description` | `TEXT` | ✅ | `NULL` | Deskripsi panjang produk |
| `specs` | `JSONB` | ✅ | `'{}'` | Spesifikasi teknis format JSON. Contoh: `{"berat": "500g"}` |
| `images` | `TEXT[]` | ✅ | `'{}'` | **Array URL gambar**. Elemen pertama = foto utama |
| `tokopedia_url` | `TEXT` | ✅ | `'#'` | Link produk di Tokopedia |
| `shopee_url` | `TEXT` | ✅ | `'#'` | Link produk di Shopee |
| `is_featured` | `BOOLEAN` | ✅ | `FALSE` | `TRUE` = tampil di bagian *Produk Unggulan* homepage |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | Waktu pembuatan |

**Indeks & constraint:**
- Primary key `id`
- **UNIQUE** pada `slug`
- Foreign key `category_id` → `categories.id`

**Catatan tipe data:**
- `price` memakai `INTEGER` karena Rupiah tidak butuh desimal — hindari nilai desimal.
- `images` bertipe **array PostgreSQL** (`TEXT[]`), di panel admin ditulis sebagai teks dipisah koma lalu dikonversi ke array.
- `specs` bertipe **JSONB** — bisa di-query dengan operator JSON (`->>`, `@>`, dll).

**Contoh data:**

| id | name | slug | category_id | price | stock | is_featured |
|---|---|---|---|---|---|---|
| 1 | Nugget Ayam Premium | nugget-ayam-premium | 1 | 35000 | 50 | `true` |
| 2 | Sosis Sapi Banyu | sosis-sapi-banyu | 2 | 28000 | 30 | `false` |

---

### 3.3 `reviews` — Ulasan

Menyimpan ulasan pelanggan per produk.

| Kolom | Tipe | Null | Default | Keterangan |
|---|---|---|---|---|
| `id` | `BIGINT` | ❌ | identity | Primary key |
| `product_id` | `BIGINT` | ❌ | — | FK → `products.id`, **`ON DELETE CASCADE`** |
| `name` | `TEXT` | ❌ | — | Nama pembeli/pemberi ulasan |
| `rating` | `INTEGER` | ❌ | — | Rating **1–5** (dicegah di luar rentang oleh `CHECK`) |
| `comment` | `TEXT` | ✅ | `NULL` | Isi ulasan |
| `status` | `TEXT` | ✅ | `'pending'` | Status moderasi. Nilai diizinkan: `pending`, `approved`, `rejected` |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | Waktu ulasan dibuat |

**Indeks & constraint:**
- Primary key `id`
- **CHECK** `rating >= 1 AND rating <= 5`
- **CHECK** `status IN ('pending','approved','rejected')`
- Foreign key `product_id` → `products.id` (**hapus produk = hapus semua ulasannya**)

**Alur status review:**

```
Pelanggan submit ulasan
        │
        ▼
   ┌─────────┐   moderasi (via Supabase Table Editor)   ┌───────────┐
   │ pending │ ───────────────────────────────────────► │ approved  │ → tampil di website
   └─────────┘                                          └───────────┘
        │                                                       ▲
        └───────────────────────────────────────────────────────┘
                              (alternatif)                 rejected → tidak tampil
```

> Hanya review berstatus **`approved`** yang bisa dibaca publik (lihat bagian RLS).

---

### 3.4 `banners` — Banner

Menyimpan banner carousel di halaman beranda.

| Kolom | Tipe | Null | Default | Keterangan |
|---|---|---|---|---|
| `id` | `BIGINT` | ❌ | identity | Primary key |
| `title` | `TEXT` | ❌ | — | Judul banner |
| `subtitle` | `TEXT` | ✅ | `NULL` | Subjudul opsional |
| `image` | `TEXT` | ❌ | — | URL gambar banner (wajib) |
| `order` | `INTEGER` | ✅ | `0` | Urutan tampil — **kecil tampil lebih dulu** |
| `created_at` | `TIMESTAMPTZ` | ✅ | `NOW()` | Waktu pembuatan |

**Indeks & constraint:**
- Primary key `id`
- Nama kolom `order` adalah **kata kunci SQL**, sehingga ditulis sebagai `"order"` (dengan tanda kutip) dalam query mentah. Supabase JS menanganinya otomatis.

---

## 4. Relasi Antar Tabel

| Relasi | Kolom | Tipe | Aksi saat parent dihapus |
|---|---|---|---|
| `products` → `categories` | `products.category_id` | Many-to-One (FK) | **`SET NULL`** — produk tetap ada, `category_id` jadi `NULL` |
| `reviews` → `products` | `reviews.product_id` | Many-to-One (FK) | **`CASCADE`** — semua ulasan produk ikut terhapus |

**SQL definisi relasi:**

```sql
-- products → categories
category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL

-- reviews → products
product_id BIGINT REFERENCES products(id) ON DELETE CASCADE
```

---

## 5. Row Level Security (RLS)

RLS diaktifkan untuk **keempat tabel**. Setiap operasi database diperiksa policy berikut.

### 5.1 Matriks Akses

| Tabel | Aksi | Publik (anon) | Admin (authenticated) |
|---|---|---|---|
| `categories` | SELECT | ✅ Semua baris | ✅ |
| `categories` | INSERT / UPDATE / DELETE | ❌ | ✅ |
| `products` | SELECT | ✅ Semua baris | ✅ |
| `products` | INSERT / UPDATE / DELETE | ❌ | ✅ |
| `reviews` | SELECT | ✅ **Hanya `status = 'approved'`** | ✅ Semua baris |
| `reviews` | INSERT | ✅ (ulasan baru selalu `pending`) | ✅ |
| `reviews` | UPDATE / DELETE | ❌ | ✅ |
| `banners` | SELECT | ✅ Semua baris | ✅ |
| `banners` | INSERT / UPDATE / DELETE | ❌ | ✅ |

### 5.2 Daftar Policy

```sql
-- Baca publik
CREATE POLICY "Public read categories"         ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products"           ON products   FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews"   ON reviews    FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read banners"            ON banners    FOR SELECT USING (true);

-- Pelanggan boleh submit ulasan
CREATE POLICY "Public insert reviews"          ON reviews    FOR INSERT WITH CHECK (true);

-- Admin (user login Supabase Auth) akses penuh
CREATE POLICY "Admin full access categories"   ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products"     ON products   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access reviews"      ON reviews    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access banners"      ON banners    FOR ALL USING (auth.role() = 'authenticated');
```

> ⚠️ **`auth.role()` sudah deprecated** di Supabase baru. Jika policy admin bermasalah, ganti kondisinya dengan:
> ```sql
> USING (auth.uid() IS NOT NULL)
> ```
> atau buat policy berbasis role asli:
> ```sql
> USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND role = 'admin'));
> ```

---

## 6. Akses dari Panel Admin

Pemetaan operasi CRUD di panel admin terhadap tabel:

| Halaman Admin | Route | Tabel | Operasi |
|---|---|---|---|
| Dashboard | `/admin/dashboard` | `products`, `categories`, `reviews` | SELECT (count) |
| Manajemen Produk | `/admin/products` | `products`, `categories` | SELECT, INSERT, UPDATE, DELETE |
| Manajemen Kategori | `/admin/categories` | `categories` | SELECT, INSERT, UPDATE, DELETE |
| Manajemen Banner | `/admin/banners` | `banners` | SELECT, INSERT, UPDATE, DELETE |
| *(belum ada UI)* | — | `reviews` | Moderasi via Supabase Table Editor |

Koneksi klien memakai **kunci anon** + sesi auth Supabase:
`src/lib/supabase.js` → `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`.

---

## 7. Catatan Teknis & Best Practice

1. **Timestamps** semua tabel memakai `TIMESTAMPTZ` (zona waktu-aware) dengan default `NOW()` — tidak perlu diisi manual.
2. **Identity columns** (`GENERATED ALWAYS AS IDENTITY`) tidak boleh di-INSERT/di-UPDATE nilai `id`-nya secara manual.
3. **`slug` wajib unik** — panel admin menghasilkannya otomatis dari `name`, tapi bisa bentrok jika dua produk punya nama serupa; ubah manual bila perlu.
4. **`price` dalam integer Rupiah** — jangan simpan nilai desimal; format tampilan (`Rp 35.000`) dilakukan di frontend.
5. **`rating` & `review_count` pada `products`** belum dihitung otomatis dari tabel `reviews` — jika ingin sinkron, buat trigger:
   ```sql
   CREATE OR REPLACE FUNCTION update_product_rating() RETURNS TRIGGER AS $$
   BEGIN
     UPDATE products SET
       review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND status = 'approved'),
       rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 1) FROM reviews WHERE product_id = NEW.product_id AND status = 'approved'), 0)
     WHERE id = NEW.product_id;
     RETURN NEW;
   END; $$ LANGUAGE plpgsql;
   ```
6. **Backup**: gunakan fitur **Database → Backups** di dashboard Supabase, atau export manual via `pg_dump` / Table Editor → CSV.
7. **Migrasi perubahan skema**: jalankan statement SQL baru di **SQL Editor**; jangan jalankan ulang seluruh `supabase-schema.sql` jika tabel sudah ada (akan error *already exists*).

---

**File terkait:**
- [`supabase-schema.sql`](../supabase-schema.sql) — skema mentah siap jalankan
- [`docs/Dokumentasi-Panel-Admin.md`](./Dokumentasi-Panel-Admin.md) — panduan penggunaan panel admin
- [`README.md`](../README.md) — overview project
