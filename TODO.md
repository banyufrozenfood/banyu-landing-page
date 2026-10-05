# TODO — Website Banyu Frozen Food

Checklist pengembangan. Semua item wajib sudah selesai.

---

## Setup Awal
- [x] Buat repository dan struktur folder
- [x] Install tech stack: React 19, Vite, React Router, Supabase
- [x] Setup design system (warna, font, spacing)
- [x] Setup Supabase: buat project, jalankan schema SQL
- [x] Buat akun admin di Supabase Auth

---

## Komponen Global
- [x] Navbar: logo, menu, tombol WhatsApp, ikon keranjang + badge
- [x] Footer: info toko, navigasi, kategori, kontak, sosmed
- [x] Keranjang belanja (CartContext + localStorage)
- [x] Drawer keranjang (slide dari kanan)
- [x] Notifikasi toast

---

## Beranda (`/`)
- [x] Hero carousel otomatis + navigasi panah & dot
- [x] Section keunggulan toko
- [x] Grid produk unggulan (fetch dari Supabase)
- [x] Section marketplace (Tokopedia/Shopee — disembunyikan jika URL kosong)
- [x] Section brand partner
- [x] Footer

---

## Katalog Produk (`/produk`)
- [x] Fetch produk + kategori dari Supabase
- [x] Filter kategori, rentang harga, pencarian nama
- [x] Sorting: terbaru, termurah, termahal
- [x] Pagination (6 produk per halaman)
- [x] Loading state

---

## Detail Produk (`/produk/:id`)
- [x] Fetch produk dari Supabase
- [x] Galeri foto (foto utama + thumbnail, null-safe)
- [x] Info: nama, harga, stok, deskripsi
- [x] Tab spesifikasi (null-safe jika kosong)
- [x] Tombol "Tambah ke Keranjang"
- [x] Produk terkait (kategori sama)

---

## Keranjang & Checkout
- [x] Tambah produk dari ProductCard (tombol +)
- [x] Tambah produk dari halaman detail
- [x] Update jumlah (+/-)
- [x] Hapus item
- [x] Hitung total
- [x] Checkout via WhatsApp: satu pesan berisi semua item + total + info ongkir

---

## Halaman Lokasi (`/lokasi`)
- [x] Google Maps embed (iframe)
- [x] Alamat, jam operasional, telepon, WhatsApp dari CMS Settings

---

## Panel Admin
- [x] Halaman login (`/admin`)
- [x] Layout sidebar admin + proteksi route
- [x] Dashboard ringkasan (produk, kategori, hero slide)
- [x] CRUD produk dengan upload foto
- [x] CRUD kategori
- [x] Kelola hero carousel
- [x] Kelola banner
- [x] Kelola brand partner
- [x] Media library
- [x] Pengaturan situs (nama, logo, kontak, marketplace URL, dll)

---

## Kualitas Kode
- [x] Tidak ada import dummy data di halaman publik
- [x] Semua halaman publik fetch dari Supabase
- [x] File tidak terpakai sudah dihapus
- [x] Build sukses tanpa error
- [x] Lint 0 error
