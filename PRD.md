# 📋 Product Requirements Document (PRD)
## Website Katalog — Banyu Frozen Food

| | |
|---|---|
| **Nama Produk** | Website Katalog Banyu |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | September 2026 |
| **Tim** | Project RPL — SMK Negeri 1 Cimahi, Kelas XI RPL A |
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

---

## 3. ⚙️ Ruang Lingkup (Scope)

### 3.1 Masuk Scope ✅
- Website katalog (Home, Produk, Detail Produk, Lokasi)
- Integrasi CTA ke Tokopedia, Shopee, dan WhatsApp
- Panel admin: kelola produk & kategori (foto, nama, detail, harga, stok)
- Google Maps terintegrasi di halaman Lokasi
- Desain responsif (desktop, tablet, mobile)

### 3.2 Di Luar Scope ❌
- Shopping cart & checkout
- Payment gateway
- Halaman "Tentang" (dihapus dari scope)
- Sistem login/akun untuk customer
- Real-time sync stok dengan marketplace

---

## 4. 🧩 Fitur & Kebutuhan Fungsional

### 4.1 Homepage
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-01 | Navbar | Logo, menu (Home, Produk, Lokasi) | Must Have |
| F-02 | Hero Carousel | Looping produk unggulan otomatis + navigasi manual | Must Have |
| F-03 | Section Keunggulan | 4–5 keunggulan toko dengan icon | Must Have |
| F-04 | Produk Unggulan | Grid 4 produk + link "Lihat Semua" | Must Have |
| F-05 | Integrasi Marketplace | 2 kotak navigasi ke Tokopedia & Shopee | Must Have |
| F-06 | Brand Partner | Logo brand/supplier yang bekerja sama | Should Have |
| F-07 | Footer | Info toko, kontak, sosmed, kategori, newsletter | Must Have |

### 4.2 Halaman Produk (`/produk`)
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-08 | Filter & Search | Filter kategori, harga, rating; search by nama | Must Have |
| F-09 | Grid Produk | Card produk (foto, nama, harga, rating) | Must Have |
| F-10 | Sorting | Terbaru, termurah, termahal, rating tertinggi | Should Have |
| F-11 | Pagination | Navigasi antar halaman produk | Should Have |

### 4.3 Detail Produk (`/produk/:id`)
| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-12 | Galeri Foto | Foto utama + thumbnail | Must Have |
| F-13 | Info Produk | Nama, harga, rating, deskripsi, spesifikasi | Must Have |
| F-14 | CTA Multi-channel | Tombol ke Tokopedia / Shopee / WhatsApp (pre-filled message) | Must Have |
| F-15 | Ulasan Pelanggan | Rating & review dari customer | Should Have |
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
| F-20 | CRUD Produk | Tambah/edit/hapus produk (foto, nama, deskripsi, harga, stok, kategori) | Must Have |
| F-21 | CRUD Kategori | Tambah/edit/hapus kategori (icon, nama, deskripsi) | Must Have |
| F-22 | Kelola Banner Hero | Atur gambar & urutan carousel homepage | Should Have |
| F-23 | Moderasi Review | Approve/reject review customer | Could Have |
| F-24 | Dashboard Ringkas | Statistik jumlah produk, rating rata-rata | Could Have |

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
Baca deskripsi, spesifikasi, ulasan
   ↓
Klik CTA: Tokopedia / Shopee / WhatsApp
   ↓
Lanjut transaksi di platform pilihan
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
| **Fase 1 (Sekarang)** | Website katalog + panel admin dasar (CRUD produk & kategori) |
| **Fase 2** | Tambah fitur analytics sederhana, moderasi review |
| **Fase 3** | Evaluasi kebutuhan shopping cart/checkout jika volume order website meningkat |

---

## 11. ✅ Kriteria Penerimaan (Acceptance Criteria)

- [ ] Semua halaman (Home, Produk, Detail Produk, Lokasi) dapat diakses dan tampil sesuai desain
- [ ] Website responsif di minimal 3 ukuran layar (mobile, tablet, desktop)
- [ ] CTA WhatsApp membuka chat dengan pesan pre-filled sesuai produk
- [ ] CTA Tokopedia & Shopee mengarahkan ke link toko yang benar
- [ ] Admin dapat menambah, mengedit, dan menghapus produk beserta foto
- [ ] Admin dapat menambah, mengedit, dan menghapus kategori
- [ ] Google Maps menampilkan lokasi toko dengan akurat
- [ ] Tidak ada fitur shopping cart/checkout yang tersisa di UI

---

## 12. 👨‍💻 Kontributor

Project RPL — SMK Negeri 1 Cimahi, Kelas XII RPL A
