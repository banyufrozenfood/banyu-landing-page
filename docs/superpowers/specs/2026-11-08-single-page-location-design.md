# Single-Page Location Design

## Intent

Publik website hanya memakai satu halaman utama. Konten lokasi—peta, alamat, jam operasional, email, WhatsApp, dan galeri—dipindahkan ke section `#lokasi` paling bawah homepage.

## Scope

- Navigasi `Lokasi` menuju `/#lokasi`.
- Hapus route publik `/lokasi` dari aplikasi.
- Render detail lokasi dan galeri di section homepage paling bawah.
- Pertahankan sumber data CMS `contact` dan `locationGallery`.
- Pertahankan tracking klik WhatsApp.
- Tidak mengubah route atau flow admin.

## Approach

Reuse CSS dan struktur konten lokasi yang sudah ada, lalu render langsung di `HomePage`. Pendekatan ini menghindari page baru, dependency baru, dan migrasi data. `LocationPage.jsx` dibiarkan sebagai legacy source agar perubahan tidak menghapus file pengguna secara destruktif, tetapi tidak lagi terhubung ke route publik.

## Acceptance

- Tidak ada link publik aktif ke `/lokasi`.
- Klik `Lokasi` scroll ke section lokasi di homepage.
- Homepage tetap menampilkan map, info toko, CTA, dan galeri.
- Build, focused content test, analytics test, lint, dan diff check tetap pass.
