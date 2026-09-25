# 🧊 Banyu Frozen Food — Website Katalog

Website resmi **Banyu**, toko frozen food yang menyediakan produk beku berkualitas untuk keluarga Indonesia. Website ini berfungsi sebagai **katalog produk digital** — customer bisa melihat produk & detail lengkap, lalu melanjutkan pembelian melalui **Tokopedia**, **Shopee**, atau **WhatsApp**.

---

## 📌 Tentang Project

Banyu Website adalah landing page yang dirancang untuk menampilkan produk frozen food secara menarik dan informatif, tanpa fitur shopping cart/checkout. Tujuannya adalah membangun *brand presence* yang kuat sambil tetap mengarahkan transaksi ke channel penjualan yang sudah berjalan (marketplace & WhatsApp), sehingga menghindari kompleksitas payment gateway dan biaya development yang tinggi.

### Kenapa Katalog Only?
- ✅ Development lebih cepat & sederhana
- ✅ Tidak perlu payment gateway atau sync inventory real-time
- ✅ Owner tetap fokus berjualan lewat channel yang sudah familiar
- ✅ Risiko keamanan transaksi rendah (dihandle oleh marketplace)

---

## ✨ Fitur Utama

- 🏠 **Homepage** — Hero carousel produk, keunggulan toko, produk unggulan, integrasi marketplace, brand partner
- 🛍️ **Halaman Produk** — Daftar seluruh produk dengan filter kategori, harga, dan rating
- 📄 **Detail Produk** — Galeri foto, deskripsi, spesifikasi, ulasan pelanggan, produk terkait
- 📍 **Halaman Lokasi** — Google Maps terintegrasi + info kontak & jam operasional
- 🔗 **CTA Multi-channel** — Tombol langsung ke Tokopedia, Shopee, dan WhatsApp di setiap produk
- 📱 **Fully Responsive** — Tampilan optimal di desktop, tablet, dan mobile

---

## 🖥️ Kompatibilitas Platform

Website ini dibangun dengan pendekatan **mobile-first & responsive design**, sehingga tampil optimal di berbagai perangkat dan browser:

| Platform | Status | Catatan |
|---|---|---|
| 💻 Desktop (1920px+) | ✅ Optimal | Layout grid penuh (4-6 kolom) |
| 💻 Laptop (1280–1440px) | ✅ Optimal | Layout menyesuaikan (3-4 kolom) |
| 📱 Tablet (768–1024px) | ✅ Optimal | Layout 2 kolom, navbar collapsible |
| 📱 Mobile (320–767px) | ✅ Optimal | Layout 1 kolom, hamburger menu, tombol full-width |
| 🌐 Chrome, Firefox, Safari, Edge | ✅ Didukung | Cross-browser tested |

**Teknik responsif yang digunakan:**
- CSS Flexbox & Grid untuk layout adaptif
- Media queries di breakpoint utama (`480px`, `768px`, `1024px`, `1440px`)
- Gambar responsif (`max-width: 100%`, lazy loading)
- Font size & spacing menggunakan unit relatif (`rem`, `%`, `vw`)
- Touch-friendly button size (minimal 44x44px) untuk mobile

---

## 🗂️ Struktur Halaman

```
📁 Banyu Website
├── 🏠 Home (/)
│   ├── Navbar
│   ├── Hero Section (carousel produk + dekorasi)
│   ├── Keunggulan Toko
│   ├── Produk Unggulan
│   ├── Integrasi Marketplace (Tokopedia & Shopee)
│   ├── Brand Partner
│   └── Footer
├── 🛍️ Produk (/produk)
│   ├── Filter & Search
│   └── Grid Produk
├── 📄 Detail Produk (/produk/:id)
│   ├── Galeri Foto
│   ├── Info & Spesifikasi
│   ├── CTA (Tokopedia / Shopee / WhatsApp)
│   └── Ulasan Pelanggan
└── 📍 Lokasi (/lokasi)
    ├── Google Maps
    └── Detail Kontak
```

---

## 🎨 Design System

| Elemen | Value |
|---|---|
| Primary Color | `#0099FF` (Biru) |
| Secondary Color | `#66CCFF` (Biru Muda) |
| Accent Color | `#FFD700` (Kuning) |
| Font | Sans-serif, modern & mudah dibaca |
| Style | Clean, playful, food-focused |

---

## 🛠️ Tech Stack

> *(Sesuaikan dengan stack yang dipakai)*
- **Frontend:** HTML5, CSS3, JavaScript
- **Framework (opsional):** React / Vue / Tailwind CSS
- **Maps:** Google Maps Embed API
- **Deployment:** Netlify / Vercel / Hosting sekolah

---

## 🚀 Cara Menjalankan Project

```bash
# Clone repository
git clone <repo-url>

# Masuk ke folder project
cd banyu-website

# Install dependencies (jika pakai framework)
npm install

# Jalankan development server
npm run dev
```

Buka browser di `http://localhost:3000` (atau port sesuai konfigurasi).

---

## 🔗 Channel Penjualan

| Channel | Link |
|---|---|
| 🛒 Tokopedia | `[isi link toko]` |
| 🛒 Shopee | `[isi link toko]` |
| 📱 WhatsApp | `[isi nomor WA]` |
| 📍 Lokasi Toko | Jl. Raya Cimahi No. 123, Cimahi, Jawa Barat |

---

## 👨‍💻 Kontributor

Project RPL — SMK Negeri 1 Cimahi, Kelas XI RPL A

---

## 📄 Lisensi

Project ini dibuat untuk keperluan tugas sekolah (RPL) dan penggunaan bisnis Banyu Frozen Food.
