# Banyu Frozen Food — Website Katalog

Website resmi Banyu, toko frozen food lokal Cimahi. Pengunjung bisa melihat produk, menambah ke keranjang, lalu memesan sekaligus lewat satu pesan WhatsApp. Admin mengelola seluruh konten lewat panel tanpa menyentuh kode.

---

## Fitur

### Halaman Publik
- **Beranda** — Hero carousel, keunggulan toko, produk unggulan, tombol marketplace (Tokopedia/Shopee), brand partner
- **Katalog Produk** (`/produk`) — Filter kategori, rentang harga, pencarian, urutan, pagination
- **Detail Produk** (`/produk/:id`) — Galeri foto, deskripsi, spesifikasi, produk terkait
- **Lokasi** (`/lokasi`) — Google Maps, jam operasional, kontak

### Keranjang Belanja
Pengunjung menambah produk ke keranjang, lalu menekan tombol "Pesan via WhatsApp". Satu pesan otomatis terkirim berisi seluruh item, jumlah, harga total, dan permintaan info ongkir.

### Panel Admin (`/admin`)
- Login dengan email + password (Supabase Auth)
- Kelola produk: tambah, edit, hapus — termasuk upload foto
- Kelola kategori, hero carousel, banner, brand partner
- Kelola pengaturan situs: nama toko, logo, kontak, warna, teks, link marketplace — semua tanpa sentuh kode
- Media library untuk upload dan pilih gambar

---

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | React 19 + Vite |
| Styling | CSS murni (tanpa framework CSS) |
| Routing | React Router v7 |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Storage | Supabase Storage (bucket `media`) |
| Deploy | Netlify |

---

## Struktur Folder

```
src/
├── assets/          # Logo SVG
├── cms/             # Sistem CMS: context, store, validasi, defaults
├── components/
│   ├── AdminLayout/ # Layout sidebar admin
│   ├── CartContext.jsx  # State keranjang belanja (localStorage)
│   ├── Footer/
│   ├── HeroCarousel/
│   ├── Navbar/
│   ├── ProductCard/
│   └── ui/          # CartDrawer, ImagePicker, ScrollToTop, Toast
├── lib/
│   ├── ordering.js  # Helper urutan drag-and-drop
│   └── supabase.js  # Inisialisasi Supabase client
└── pages/
    ├── admin/       # Semua halaman panel admin
    ├── HomePage.jsx
    ├── LocationPage.jsx
    ├── ProductDetailPage.jsx
    └── ProductsPage.jsx
```

---

## Cara Menjalankan

### Prasyarat
- Node.js 18+
- Akun Supabase (gratis)

### Setup

**1. Clone & install**
```bash
git clone <url-repo>
cd banyu-landing-page
npm install
```

**2. Buat file `.env`**
```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
Nilai diambil dari Supabase Dashboard → Project Settings → API.

**3. Setup database**

Jalankan seluruh isi `supabase-schema.sql` di Supabase Dashboard → SQL Editor → New query → Run.

**4. Buat akun admin**

Supabase Dashboard → Authentication → Users → Add user. Isi email dan password, centang *Auto Confirm User*.

**5. Jalankan**
```bash
npm run dev
```
Buka `http://localhost:5173`. Admin panel di `http://localhost:5173/admin`.

---

## Deploy ke Netlify

1. Push repo ke GitHub
2. Hubungkan repo di Netlify → *New site from Git*
3. Build command: `npm run build`, publish directory: `dist`
4. Tambahkan environment variable `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Netlify → Site settings → Environment variables
5. File `public/_redirects` sudah ada untuk menangani client-side routing

---

## Kompatibilitas Browser

Chrome, Firefox, Safari, Edge — versi dua tahun terakhir. Dioptimasi untuk mobile-first.
