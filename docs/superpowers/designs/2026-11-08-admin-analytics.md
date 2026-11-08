# Desain: Monitoring Admin Mobile-First

## Tujuan

Membuat admin bisa memahami performa website dari HP maupun laptop tanpa
mengembalikan katalog, keranjang, atau form order ke website.

## Keputusan desain

- Analytics disimpan di Supabase agar data sama di semua perangkat.
- Tracking anonim memakai `visitor_id` di `localStorage` dan `session_id` di
  `sessionStorage`; tidak menyimpan nama, nomor telepon, isi chat, atau data
  order.
- Page view dicatat sekali per halaman dalam satu sesi.
- Klik kanal dicatat untuk WhatsApp, GoFood, dan GrabMart.
- Pengunjung unik dihitung dari `visitor_id`; page view dihitung dari event.
- Dashboard menampilkan ringkasan hari ini, 7 hari, dan 30 hari.
- Grafik dibuat dengan CSS/HTML tanpa dependency baru.
- Order aktual tidak dibuat di website. Dashboard menampilkan penjelasan dan
  tautan kanal merchant sebagai pengingat operasional.

## Alur pengunjung

1. `AnalyticsTracker` mengirim event `page_view` saat route publik dibuka.
2. Tombol WhatsApp, GoFood, dan GrabMart mengirim event `channel_click` sebelum
   browser membuka URL tujuan.
3. Jika Supabase gagal atau tabel belum dibuat, website tetap berjalan; tracking
   gagal secara diam-diam dan hanya dicatat di console sebagai warning.

## Struktur data Supabase

Tabel `analytics_events`:

- `id`: identity primary key.
- `event_type`: `page_view` atau `channel_click`.
- `event_name`: path untuk page view, nama kanal untuk click.
- `page_path`: pathname saat event terjadi.
- `visitor_id`: ID anonim dari browser.
- `session_id`: ID anonim per sesi tab.
- `metadata`: JSONB kecil untuk info non-pribadi bila diperlukan.
- `created_at`: waktu server.

RLS:

- Publik hanya boleh `INSERT` event dengan tipe yang valid.
- Admin authenticated boleh membaca data untuk dashboard.
- Tidak ada akses publik untuk membaca analytics.

## UI admin

### Dashboard (`/admin/dashboard`)

- Header jelas: “Ringkasan Website”.
- Status CMS tetap di bagian atas.
- Kartu metrik utama:
  - Pengunjung hari ini.
  - Pengunjung 7 hari.
  - Pengunjung 30 hari.
  - Total klik kanal 30 hari.
- Preview mini kanal dengan jumlah klik WhatsApp, GoFood, dan GrabMart.
- CTA “Buka Analytics Lengkap”.
- Kartu “Pesanan aktual” berisi batasan integrasi dan tautan ke kanal merchant,
  bukan data pesanan palsu.

### Analytics lengkap (`/admin/analytics`)

- Filter periode: 7 hari, 30 hari, 90 hari.
- Grafik batang harian untuk pengunjung unik dan page view.
- Daftar klik kanal dengan total dan persentase.
- Ringkasan terakhir diperbarui.
- State loading, kosong, error, dan offline/local storage dibuat jelas.
- Di layar kecil, semua grid menjadi satu kolom dan tabel menjadi kartu.

### Navigasi admin

Tambahkan menu “Analytics” dengan ikon sederhana dan label yang jelas.
Dashboard tetap menjadi landing page admin; halaman Analytics untuk rincian.

## File yang akan dibuat/diubah

- `supabase-analytics.sql`: migrasi tabel, index, dan RLS analytics.
- `src/lib/analytics.js`: ID anonim, event tracking, dan helper aman.
- `src/components/AnalyticsTracker/AnalyticsTracker.jsx`: tracking route.
- `src/components/AnalyticsTracker/AnalyticsTracker.css`: tidak diperlukan.
- `src/App.jsx`: pasang tracker dan route analytics.
- `src/pages/HomePage.jsx`: pasang tracking klik tiga kanal.
- `src/pages/admin/AdminAnalytics.jsx`: query, agregasi, filter, dan UI detail.
- `src/pages/admin/AdminAnalytics.css`: layout responsive dashboard analytics.
- `src/pages/admin/AdminDashboard.jsx`: metrik ringkas dan link analytics.
- `src/pages/admin/AdminDashboard.css`: card/chart responsive tambahan.
- `src/components/AdminLayout/AdminLayout.jsx`: menu Analytics.
- `src/components/AdminLayout/AdminLayout.css`: penyesuaian nav bila diperlukan.

## Verifikasi

- `npm run build`.
- `npm run lint`.
- `git diff --check`.
- Cek browser mobile: dashboard dan analytics tidak overflow horizontal.
- Cek tanpa tabel analytics: homepage tetap tampil dan admin menampilkan state
  error yang dapat dipahami.
- Cek SQL: anon insert dapat berjalan, public select ditolak, authenticated
  select dapat berjalan setelah migration dijalankan.

## Batasan yang sengaja tidak dibuat

- Tidak ada monitoring isi chat WhatsApp.
- Tidak ada akses order GoFood/GrabMart dari website.
- Tidak ada tracking data pribadi, fingerprint, lokasi presisi, atau rekaman
  sesi.
- Tidak ada realtime subscription atau export CSV sebelum kebutuhan muncul.
