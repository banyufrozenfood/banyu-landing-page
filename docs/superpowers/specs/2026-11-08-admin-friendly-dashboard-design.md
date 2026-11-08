# Desain: Admin Dashboard Friendly dan Mobile-First

## Intent

Admin Banyu Frozen Food harus terasa seperti dashboard kerja harian, bukan halaman teknis. Pengguna utama adalah pemilik/admin non-teknis yang perlu cepat memahami status website, analytics, dan lokasi pengaturan dari laptop maupun HP.

Screenshot saat ini menunjukkan fungsi sudah berjalan, tetapi hierarchy visual lemah: canvas biru terlalu dominan, header memotong judul, sidebar kosong, card datar, dan empty state analytics terlalu besar.

## Goals

- Buat admin mudah dipindai dalam 5–10 detik.
- Tampilkan status penting dengan bahasa Indonesia yang jelas.
- Kurangi ruang kosong dan scroll yang tidak perlu.
- Pastikan tombol dan kontrol nyaman disentuh di HP.
- Samakan visual Dashboard, Analytics, Settings, Media, Hero, dan Brand.
- Pertahankan route, autentikasi, CMS, analytics, dan storage mode yang ada.

## Non-goals

- Tidak mengubah struktur data Supabase.
- Tidak mengubah alur draft, preview, save, publish, atau cancel.
- Tidak menambah katalog, keranjang, order form, atau fitur POS.
- Tidak menambah dependency UI/chart.
- Tidak membuat sidebar collapse desktop yang kompleks.

## Anti-goals

- Jangan memakai gradient berlebihan atau dekorasi yang mengalahkan konten.
- Jangan membuat dashboard lebih padat dengan istilah teknis.
- Jangan menyembunyikan error database; tampilkan sebagai status yang dapat ditindaklanjuti.
- Jangan menghapus menu admin yang masih dipakai.

## Pendekatan yang dipilih

### A — Clean dan friendly (dipilih)

- Sidebar putih tetap fixed dengan ikon sederhana, label, dan kelompok menu.
- Canvas utama abu-abu sangat terang; biru hanya menjadi aksen aktif.
- Header ringkas dengan breadcrumb/judul halaman dan CTA Lihat Website.
- Card menggunakan border halus, shadow tipis, radius konsisten, dan whitespace terukur.
- Dashboard memakai welcome header, status website, metrik, quick actions, dan bantuan singkat.
- Analytics memakai metric cards yang lebih ringkas, grafik dengan tinggi proporsional, dan empty/error state yang tidak mengambil seluruh layar.
- Mobile menjadi satu kolom; sidebar berubah menjadi drawer dengan overlay.

### B — Modern SaaS dashboard

Sidebar collapse, breadcrumb interaktif, dan shell lebih kompleks. Ditunda karena memperbesar perubahan tanpa kebutuhan operasional sekarang.

### C — Premium dark sidebar

Kontras tinggi dan terlihat premium, tetapi kurang sesuai dengan identitas biru terang Banyu dan membutuhkan perubahan visual lebih luas.

## Visual system

- Canvas: `#F6F9FC`.
- Surface: `#FFFFFF`.
- Primary: gunakan `--primary` yang sudah berasal dari settings.
- Text utama: navy gelap, bukan hitam murni.
- Text sekunder: slate dengan kontras aksesibel.
- Success: hijau untuk published/online.
- Warning: amber untuk draft/data kosong.
- Danger: merah hanya untuk error/keluar.
- Border radius: gunakan token admin bersama, sekitar 12–16px.
- Shadow: satu level lembut, bukan shadow berat.
- Minimum touch target: 44px.

## Struktur shell

Desktop:

```text
┌───────────────┬──────────────────────────────────────────┐
│ BANYU         │ Header: breadcrumb        Lihat Website  │
│ Workspace     ├──────────────────────────────────────────┤
│ • Ringkasan   │                                            │
│ • Analytics   │  Page content                               │
│               │                                            │
│ Konten        │                                            │
│ • Pengaturan  │                                            │
│ • Media       │                                            │
│ • Slide       │                                            │
│ • Brand       │                                            │
│               │                                            │
│ Keluar        │                                            │
└───────────────┴──────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────────────┐
│ ☰  BANYU ADMIN       Lihat Site  │
├──────────────────────────────────┤
│ Page title + context              │
│ status / metrics / content        │
└──────────────────────────────────┘
```

## Halaman dashboard

Urutan visual:

1. Welcome header: “Selamat datang kembali” dan konteks singkat.
2. Status website dalam compact status card:
   - Published/Draft.
   - Terakhir diperbarui.
   - Penyimpanan online/browser.
   - CTA Edit Website dan Preview.
3. Metrik analytics 4 kartu dengan icon badge:
   - Pengunjung hari ini.
   - Pengunjung 7 hari.
   - Pengunjung 30 hari.
   - Klik kanal 30 hari.
4. Quick actions sebagai kartu dengan nomor/icon, judul, dan deskripsi pendek.
5. Merchant note yang menjelaskan lokasi pengecekan order aktual.
6. Bantuan workflow CMS dalam accordion-like compact cards; tetap tanpa javascript accordion jika tidak diperlukan.

## Halaman analytics

- Header tidak terpotong dan filter periode berada di sisi kanan desktop, full-width di mobile.
- Error migration menjadi alert compact di bawah header.
- Metric card memakai label, angka, dan caption yang lebih pendek.
- Traffic chart memiliki tinggi maksimum sekitar 280px desktop dan 220px mobile.
- Empty chart menampilkan ikon/ilustrasi CSS kecil, pesan, dan langkah berikutnya.
- Panel “Minat kanal” memakai bar yang lebih tebal dan angka yang mudah dibaca.
- Merchant note dipindah sebagai panel sekunder, tidak mengambil fokus utama.

## Halaman konten lain

- Semua halaman memakai `admin-page-header`, `admin-card`, form spacing, dan tombol yang sama.
- Tab Settings dapat scroll horizontal dengan scrollbar tersembunyi/halus di HP.
- Form dua kolom berubah satu kolom di bawah 760px.
- Media/Brand/Hero menampilkan item sebagai card grid yang tidak overflow.
- Login memakai surface putih terpusat dengan branding Banyu dan status error yang jelas.

## Accessibility dan usability

- Sidebar link memiliki state active yang tidak hanya bergantung warna.
- Tombol mobile memiliki label aria yang jelas.
- Focus-visible outline tetap terlihat.
- Teks error tidak memakai warna sebagai satu-satunya pembeda.
- Kontras teks dan status mengikuti WCAG AA sejauh token yang ada.

## File yang kemungkinan diubah

- `src/components/AdminLayout/AdminLayout.jsx`
- `src/components/AdminLayout/AdminLayout.css`
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/AdminDashboard.css`
- `src/pages/admin/AdminAnalytics.jsx`
- `src/pages/admin/AdminAnalytics.css`
- `src/pages/admin/AdminShared.css`
- `src/pages/admin/AdminSettings.css`
- `src/pages/admin/AdminMedia.css`
- `src/pages/admin/AdminHeroSlides.css`
- `src/pages/admin/AdminBrandPartners.css`
- `src/pages/admin/AdminLoginPage.css`

Tambahkan file lain hanya jika halaman memang tidak dapat mengikuti token bersama. Hindari mengubah logic data kecuali dibutuhkan untuk label/status UI.

## Verifikasi keberhasilan

- `npm run build` berhasil.
- `npm run lint` tetap exit 0 dengan warning yang ada.
- `node scripts/test-analytics.mjs` tetap berhasil.
- Desktop: tidak ada judul/header terpotong dan tidak ada gap besar yang tidak perlu.
- Mobile 390px: tidak ada horizontal overflow; drawer dapat dibuka/ditutup; cards, tabs, form, dan tombol tetap terbaca.
- Semua route admin tetap bisa dirender tanpa mengubah autentikasi.
