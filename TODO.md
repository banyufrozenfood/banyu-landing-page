# ✅ TODO — Website Katalog Banyu Frozen Food

> Checklist pengembangan berdasarkan `PRD.md`. Update status seiring progress.

---

## 🏗️ Setup & Persiapan

- [x] Setup repository & struktur folder project
- [x] Pilih & install tech stack (framework, CSS tool, dll)
- [x] Setup design system (warna, font, spacing) sesuai PRD
- [x] Siapkan aset (logo Banyu, foto produk, icon keunggulan, logo brand partner)
- [x] Setup Google Maps API key untuk halaman Lokasi (Menggunakan Iframe Embed gratis)

---

## 🏠 Homepage

- [x] Navbar (logo + menu: Home, Produk, Lokasi)
- [x] Hero Section — carousel produk (looping otomatis + navigasi manual dot/arrow)
- [x] Hero Section — dekorasi produk (nugget/makanan) di sisi kuning
- [x] Section Keunggulan (4–5 icon bulat + judul + deskripsi)
- [x] Section Produk Unggulan (grid 4 produk + tombol "Lihat Semua")
- [x] Section Integrasi Marketplace (2 kotak: Tokopedia & Shopee, klik → link toko)
- [x] Section Brand Partner (logo-logo supplier)
- [x] Footer lengkap (tentang, navigasi, kategori, kontak, newsletter, copyright)
- [ ] Screenshot & review tampilan homepage (desktop, tablet, mobile)

---

## 🛍️ Halaman Produk (`/produk`)

- [x] Header page + breadcrumb
- [x] Sidebar filter (kategori, harga, rating)
- [x] Search bar produk
- [x] Grid produk (card: foto, nama, harga, rating)
- [x] Sorting (terbaru, termurah, termahal, rating tertinggi)
- [x] Pagination
- [ ] Screenshot & review tampilan (desktop, tablet, mobile)

---

## 📄 Detail Produk (`/produk/:id`)

- [x] Galeri foto (foto utama + thumbnail)
- [x] Info produk (nama, harga, rating, status stok)
- [x] Deskripsi & spesifikasi produk
- [x] Tombol CTA: Tokopedia, Shopee, WhatsApp (pesan pre-filled sesuai produk)
- [x] Section ulasan pelanggan (rating breakdown + list review)
- [x] Section produk terkait
- [ ] Screenshot & review tampilan (desktop, tablet, mobile)

---

## 📍 Halaman Lokasi (`/lokasi`)

- [x] Embed Google Maps interaktif
- [x] Detail alamat, jam operasional, kontak
- [x] Tombol CTA (buka di Google Maps, hubungi WA, telepon)
- [x] Galeri foto toko
- [ ] Screenshot & review tampilan (desktop, tablet, mobile)

---

## 🎛️ Panel Admin (`/admin`)

- [x] Halaman login admin (Terhubung ke Supabase Auth)
- [x] Dashboard ringkas (Statistik jumlah produk, kategori, ulasan)
- [x] **Product Management**
  - [x] List produk (tabel + search)
  - [x] Form tambah produk (foto, nama, deskripsi, kategori, harga, stok, spesifikasi)
  - [x] Form edit produk
  - [x] Hapus produk (dengan konfirmasi)
- [x] **Category Management**
  - [x] List kategori
  - [x] Form tambah kategori (icon, nama, deskripsi)
  - [x] Form edit kategori
  - [x] Hapus kategori (dengan konfirmasi)
- [x] Kelola banner/hero carousel (list & delete selesai, form tambah/edit terhubung ke Supabase)
- [ ] Moderasi review (approve/reject) — *opsional*
- [ ] Screenshot & review tampilan admin panel

---

## 📱 Responsif & Cross-Platform

- [x] Test tampilan di mobile (320–767px)
- [x] Test tampilan di tablet (768–1024px)
- [x] Test tampilan di desktop (1280px+)
- [x] Test di Chrome, Firefox, Safari, Edge
- [x] Pastikan tombol/CTA touch-friendly di mobile

---

## ⚡ Optimasi & Quality Check

- [x] Optimasi gambar (compress, lazy load)
- [x] Cek waktu load halaman (target < 3 detik)
- [x] Cek broken link (terutama CTA marketplace & WhatsApp)
- [x] Validasi form admin (input kosong, format salah, dll)
- [x] Cek SEO dasar (meta title, meta description, alt text gambar)
- [x] Cek aksesibilitas dasar (kontras warna, ukuran font)

---

## 🚀 Deployment

- [x] Setup hosting/deployment (Netlify/Vercel/hosting sekolah) (Konfigurasi Vercel & Netlify siap)
- [ ] Konfigurasi domain (jika ada)
- [x] Deploy versi awal untuk testing
- [ ] Final review bersama sebelum go-live
- [ ] Deploy versi production

---

## 📚 Dokumentasi

- [x] `README.md`
- [x] `PRD.md`
- [ ] Dokumentasi cara pakai panel admin (untuk owner toko)
- [ ] Dokumentasi struktur database (jika ada backend)

---

## 🔮 Backlog (Fase Selanjutnya)

- [ ] Analytics sederhana di dashboard admin
- [ ] Evaluasi kebutuhan shopping cart/checkout
- [ ] Integrasi email newsletter
- [ ] Multi-admin dengan role/permission
