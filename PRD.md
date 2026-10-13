# 📋 Product Requirements Document (PRD)
## Website Katalog — Banyu Frozen Food

| | |
|---|---|
| **Nama Produk** | Website Katalog Banyu |
| **Versi Dokumen** | 1.1 |
| **Tanggal** | September 2026 (diperbarui Oktober 2026 sesuai implementasi) |
| **Tim** | Project RPL — SMK Negeri 1 Cimahi, Kelas XII RPL A |
| **Tipe Website** | Katalog Digital (tanpa checkout) |

---

## 1. 🎯 Latar Belakang & Tujuan

### 1.1 Latar Belakang
Banyu adalah toko frozen food yang saat ini menjual produk melalui Tokopedia, Shopee, dan pemesanan langsung via WhatsApp. Toko belum memiliki *brand presence* digital sendiri yang bisa menampilkan seluruh produk secara profesional dan menarik, sekaligus mengarahkan customer ke channel penjualan yang sudah berjalan.

### 1.2 Tujuan Produk
- Membangun katalog digital yang menampilkan seluruh produk Banyu secara informatif dan menarik
- Meningkatkan *brand awareness* & kepercayaan customer terhadap Banyu
- Mengarahkan traffic ke channel penjualan (Tokopedia, Shopee, WhatsApp) tanpa perlu membangun sistem transaksi sendiri
- Memberi customer kemudahan riset produk sebelum memutuskan beli di channel pilihan mereka

### 1.3 Tujuan Bisnis
- Mendorong penjualan via WhatsApp Direct (0% komisi) selain marketplace (komisi 15–20%)
- Meningkatkan kredibilitas toko lewat tampilan profesional, testimonial, dan brand partner
- Mempermudah pengelolaan informasi produk & kategori lewat panel admin

---

## 2. 👥 Target Pengguna

Website Banyu Frozen Food memiliki beberapa kelompok pengguna dengan kebutuhan dan tujuan penggunaan yang berbeda. Setiap kelompok pengguna membutuhkan pengalaman yang disesuaikan dengan kebutuhannya.

| Pengguna | Kebutuhan |
|---|---|
| **Pengunjung / Calon Pembeli** | Melihat katalog, mencari & memfilter produk, memesan via keranjang WhatsApp atau marketplace |
| **Admin / Owner Toko** | Mengelola produk, kategori, carousel, banner, brand partner, media, dan pengaturan situs lewat panel `/admin` |

---

## 3. ⚙️ Ruang Lingkup (Scope)

### 3.1 Masuk Scope ✅
- Website katalog (Home, Produk, Detail Produk, Lokasi)
- Keranjang belanja + form pemesan + checkout tercatat otomatis via database dan terhubung ke WhatsApp
- Integrasi marketplace fleksibel (toggle independen Tokopedia & Shopee di beranda serta per produk)
- Panel admin: kelola produk & kategori (foto, nama, detail, harga, stok, toggle marketplace)
- Manajemen Pesanan WhatsApp (`/admin/orders`) dengan sistem otomatis pengurangan/pengembalian stok produk
- Media library dengan penelusuran status pemakaian gambar (digunakan vs belum digunakan)
- Pengaturan situs (alur draft → pratinjau → terbit)
- Google Maps terintegrasi di halaman Lokasi
- Desain responsif (desktop, tablet, mobile)

### 3.2 Di Luar Scope ❌
- Payment gateway pihak ketiga
- Halaman "Tentang" (dihapus dari scope)
- Sistem login/akun untuk customer
- Real-time sync API marketplace pihak ketiga (Shopee Open API / Tokopedia Developer)
- Moderasi ulasan pelanggan (tabel database disiapkan, UI belum dibangun)

---

## 4. 🧩 Fitur & Kebutuhan Fungsional

### 4.1 Homepage
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-01 | Navbar | Logo, menu (Home, Produk, Lokasi) | Must Have |
| F-02 | Hero Carousel | Looping produk unggulan otomatis + navigasi manual | Must Have |
| F-03 | Section Keunggulan | 4–5 keunggulan toko dengan icon | Must Have |
| F-04 | Produk Unggulan | Grid 4 produk + link "Lihat Semua" | Must Have |
| F-05 | Integrasi Marketplace | Kartu navigasi Tokopedia & Shopee (dapat dinyalakan salah satu, keduanya, atau dinonaktifkan di Pengaturan) | Must Have |
| F-06 | Brand Partner | Logo brand/supplier yang bekerja sama | Should Have |
| F-07 | Footer | Info toko, kontak, sosmed, kategori otomatis, copyright | Must Have |

### 4.2 Halaman Produk (`/produk`)
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-08 | Filter & Search | Filter kategori, rentang harga min–maks; search nama, kategori, deskripsi; filter tersinkron ke URL | Must Have |
| F-09 | Grid Produk | Card produk (foto, kategori, nama, harga, tombol +, badge Unggulan/Habis) | Must Have |
| F-10 | Sorting | Terbaru, termurah, termahal | Should Have |
| F-11 | Pagination | Navigasi antar halaman produk | Should Have |

### 4.3 Detail Produk (`/produk/:id`)
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-12 | Galeri Foto | Foto utama + thumbnail | Must Have |
| F-13 | Info Produk | Nama, kategori, harga, stok, deskripsi & spesifikasi (tab) | Must Have |
| F-14 | CTA Multi-channel | Tombol Tambah ke Keranjang + Beli di Tokopedia / Shopee (diatur per produk, tampil jika aktif & URL terisi) | Must Have |
| F-15 | Ulasan Pelanggan | Rating & review — belum tampil di UI, tabel `reviews` disiapkan untuk fase berikutnya | Should Have |
| F-16 | Produk Terkait | Rekomendasi produk sejenis | Could Have |

### 4.4 Halaman Lokasi (`/lokasi`)
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-17 | Google Maps | Peta interaktif lokasi toko | Must Have |
| F-18 | Detail Kontak | Alamat, jam operasional, telepon, WA | Must Have |

### 4.5 Panel Admin (`/admin`)
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-19 | Login Admin | Autentikasi untuk akses panel | Must Have |
| F-20 | CRUD Produk | Tambah/edit/hapus produk (foto, nama, deskripsi, harga, stok, kategori, toggle & link marketplace Tokopedia/Shopee per produk) | Must Have |
| F-21 | CRUD Kategori | Tambah/edit/hapus kategori (nama, deskripsi) | Must Have |
| F-22 | Kelola Slide Beranda | Atur judul, subjudul, deskripsi, gambar, teks & link tombol, urutan angka, status aktif | Should Have |
| F-23 | Moderasi Review | Approve/reject review customer — belum diimplementasi | Could Have |
| F-24 | Dashboard Ringkas | Total produk, kategori, pesanan menunggu, status website draft/terbit, kartu panduan, aksi cepat | Could Have |
| F-29 | Pesanan WhatsApp & Stok | Halaman kelola pesanan masuk (`/admin/orders`): konfirmasi untuk memotong stok produk secara atomik di database, batalkan untuk mengembalikan stok | Must Have |

### 4.6 Keranjang & Pengaturan Situs
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-25 | Keranjang & Checkout WA | Tambah/ubah/hapus item (localStorage), input nama & alamat pengiriman, tercatat ke database (`whatsapp_orders`), pesan otomatis WA berisi item, total, alamat, dan nomor pesanan | Must Have |
| F-26 | Media Library | Upload gambar, tambah dari link, filter kategori, filter status penggunaan (digunakan vs belum digunakan) + indikator pemakaian, pencarian, salin link, hapus | Must Have |
| F-27 | Pengaturan Website | 5 tab (Kontak & Jam Buka, Sosial Media, Navbar & Footer, Isi Beranda, SEO) + alur Simpan Draft / Pratinjau / Terbitkan | Must Have |
| F-28 | Kelola Banner | CRUD banner (judul, subjudul, gambar, urutan angka) — data tersimpan, belum ditampilkan di halaman publik | Could Have |

---

## 5. 🚫 Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Responsivitas** | Tampil optimal di desktop, tablet, dan mobile (mobile-first) |
| **Performa** | Waktu load halaman < 3 detik, gambar dioptimasi/lazy load |
| **Kompatibilitas Browser** | Chrome, Firefox, Safari, Edge (versi 2 tahun terakhir) |
| **Keamanan** | Login admin terproteksi, validasi input form |
| **Usabilitas** | Navigasi maksimal 3 klik untuk sampai ke produk |
| **SEO** | Meta tag, alt text gambar, struktur heading yang jelas |
| **Maintainability** | Kode terstruktur & mudah dikembangkan untuk fitur lanjutan |

---

## 6. 🔄 User Flow Utama

### 6.1 Flow Customer — Lihat & Beli Produk
```
Landing di Home
   ↓
Lihat Hero Carousel / Produk Unggulan
   ↓
Klik "Lihat Semua" → Halaman Produk
   ↓
Filter/Search produk yang diinginkan
   ↓
Klik produk → Halaman Detail Produk
   ↓
Baca deskripsi & spesifikasi
   ↓
Tambah ke keranjang (dari kartu produk atau halaman detail)
   ↓
Buka drawer keranjang → ubah jumlah / hapus item
   ↓
Klik "Pesan via WhatsApp" → chat terbuka berisi daftar item + total + permintaan info ongkir
   ↓
(Alternatif) Klik CTA Tokopedia / Shopee → lanjut transaksi di marketplace
```

### 6.2 Flow Admin — Tambah Produk Baru
```
Login ke /admin
   ↓
Masuk ke Product Management
   ↓
Klik "Tambah Produk Baru"
   ↓
Isi form: foto, nama, deskripsi, kategori, harga, stok
   ↓
Simpan
   ↓
Produk tampil otomatis di website
```

---

## 7. 🎨 Desain & Branding

| Elemen | Ketentuan |
|---|---|
| Warna Utama | Biru `#0099FF`, Biru Muda `#66CCFF` |
| Warna Aksen | Kuning `#FFD700` |
| Gaya Visual | Clean, playful, food-focused |
| Tipografi | Sans-serif, mudah dibaca di semua ukuran layar |

---

## 8. 📊 Metrik Keberhasilan (Success Metrics)

| Metrik | Target |
|---|---|
| Klik CTA ke WhatsApp | Meningkat dibanding sebelum ada website |
| Klik CTA ke Marketplace | Traffic terukur dari website ke Tokopedia/Shopee |
| Waktu load halaman | < 3 detik |
| Bounce rate | < 50% |
| Kompatibilitas device | Berfungsi baik di 95%+ perangkat customer |

---

## 9. ⚠️ Batasan & Asumsi

**Batasan:**
- Tidak ada sistem pembayaran di website
- Update stok dilakukan manual oleh admin, tidak real-time dengan marketplace

**Asumsi:**
- Owner bersedia mengelola konten produk secara berkala lewat panel admin
- Mayoritas customer lokal lebih nyaman transaksi via WhatsApp
- Marketplace (Tokopedia & Shopee) tetap menjadi channel utama untuk customer luar kota

---

## 10. 🗺️ Roadmap Pengembangan

| Fase | Fokus |
|---|---|
| **Fase 1 (Sekarang)** | Website katalog + keranjang WhatsApp + panel admin lengkap (produk, kategori, carousel, banner, brand partner, media, pengaturan) |
| **Fase 2** | Tambah fitur analytics sederhana, moderasi review |
| **Fase 3** | Evaluasi payment gateway / checkout penuh jika volume order website meningkat |

---

## 11. ✅ Kriteria Penerimaan (Acceptance Criteria)

- [x] Semua halaman (Home, Produk, Detail Produk, Lokasi) dapat diakses dan tampil sesuai desain
- [x] Website responsif di minimal 3 ukuran layar (mobile, tablet, desktop)
- [x] Keranjang: tambah/ubah/hapus item, total otomatis, checkout membuka chat WA berisi daftar item + total
- [x] CTA Tokopedia & Shopee mengarahkan ke link toko yang benar (tersembunyi jika URL kosong)
- [x] Admin dapat menambah, mengedit, dan menghapus produk beserta foto
- [x] Admin dapat menambah, mengedit, dan menghapus kategori
- [x] Google Maps menampilkan lokasi toko dengan akurat

---

## 12. 👨‍💻 Kontributor

Project RPL — SMK Negeri 1 Cimahi, Kelas XII RPL A
