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
- [x] Navbar: logo, menu (diambil dari CMS Settings), ikon keranjang + badge, hamburger di mobile
- [x] Footer: info toko, navigasi, kategori (otomatis dari database), kontak, sosmed
- [x] Keranjang belanja (CartContext + localStorage `banyu_cart`)
- [x] Drawer keranjang (slide dari kanan)
- [x] Notifikasi toast
- [x] Halaman 404 untuk URL yang tidak ada

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
- [x] Filter kategori, rentang harga (min–maks + tombol Terapkan), pencarian nama/kategori/deskripsi
- [x] Filter tersinkron ke URL (link kategori dari footer langsung memfilter)
- [x] Sorting: terbaru, termurah, termahal
- [x] Pagination (6 produk per halaman)
- [x] Loading state + empty state dengan tombol reset filter

---

## Detail Produk (`/produk/:id`)
- [x] Fetch produk dari Supabase
- [x] Galeri foto (foto utama + thumbnail, null-safe)
- [x] Info: nama, kategori, harga, stok, deskripsi
- [x] Tab deskripsi & spesifikasi (null-safe jika kosong)
- [x] Tombol "Tambah ke Keranjang" + tombol Tokopedia/Shopee (link global dari Settings, tersembunyi jika kosong)
- [x] Breadcrumb Home / Produk / nama produk
- [x] Produk terkait (kategori sama, maks 4)
- [x] State loading & halaman "Produk Tidak Ditemukan"

---

## Keranjang & Checkout
- [x] Tambah produk dari ProductCard (tombol +)
- [x] Tambah produk dari halaman detail
- [x] Update jumlah (+/-)
- [x] Hapus item
- [x] Hitung total
- [x] Form data pemesan (nama & alamat pengiriman) sebelum checkout WhatsApp
- [x] Pencatatan pesanan otomatis ke database (`whatsapp_orders` status pending)
- [x] Checkout via WhatsApp: pesan otomatis berisi rincian item, nomor pesanan, dan alamat pemesan
- [x] Keranjang otomatis kosong setelah checkout berhasil

---

## Halaman Lokasi (`/lokasi`)
- [x] Google Maps embed (iframe) + tombol "Buka di Google Maps"
- [x] Alamat, jam operasional, telepon, email, tombol WhatsApp & telepon dari CMS Settings
- [x] Galeri foto toko (dari Media Library kategori Foto Toko, fallback gambar default)

---

## Panel Admin
- [x] Halaman login (`/admin`)
- [x] Layout sidebar admin + proteksi route
- [x] Dashboard: total produk, kategori, pesanan menunggu, status website draft/terbit, kartu panduan, aksi cepat
- [x] CRUD produk (nama, slug otomatis, kategori, harga, stok, deskripsi, URL gambar, opsi marketplace Tokopedia/Shopee per produk, unggulan) + pencarian
- [x] CRUD kategori (nama + deskripsi)
- [x] Kelola hero carousel (validasi form, live preview, urutan angka, toggle aktif)
- [x] Kelola banner (judul, gambar, urutan) — data tersimpan, belum ditampilkan di halaman publik
- [x] Kelola brand partner (ImagePicker, panduan visual, urutan, toggle aktif)
- [x] Media library (upload, tambah dari link, filter kategori, filter status digunakan/belum digunakan + deteksi lokasi pakai, pencarian, salin link, hapus dengan konfirmasi)
- [x] Manajemen Pesanan WhatsApp (`/admin/orders`): lihat pesanan masuk, konfirmasi pesanan (stok otomatis terpotong di DB), batalkan pesanan (stok otomatis dikembalikan)
- [x] Pengaturan situs: kontak, sosmed, footer, isi beranda (toggle mandiri Tokopedia & Shopee, keunggulan, produk unggulan, partner), SEO + draft/publish flow

---

## Kualitas Kode
- [x] Tidak ada import dummy data di halaman publik
- [x] Semua halaman publik fetch dari Supabase
- [x] File tidak terpakai sudah dihapus
- [x] Build sukses tanpa error
- [x] Lint 0 error
