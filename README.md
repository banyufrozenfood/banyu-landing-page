# Banyu Frozen Food — Landing Page & Panel Admin

Website resmi Banyu, toko frozen food lokal Cimahi. Pengunjung melihat profil toko, keunggulan, tautan marketplace, dan lokasi dalam satu halaman. Admin mengelola seluruh konten lewat panel tanpa menyentuh kode.

---

## Fitur

### Halaman Publik (`/`)

Satu halaman (single page) berisi:

- **Hero carousel** — slide gambar dengan teks dan tombol CTA
- **Tentang & keunggulan** — teks toko dan poin keunggulan
- **Kartu marketplace** — tautan GoFood, GrabMart, dan WhatsApp (Shopee/Tokopedia opsional)
- **Brand partner** — logo mitra
- **Lokasi** — peta, alamat, jam operasional, kontak, WhatsApp, dan galeri foto toko
- **Footer** — kontak dan sosial media

Tidak ada halaman katalog, keranjang, atau checkout. Pesanan dilakukan langsung lewat marketplace atau WhatsApp.

### Panel Admin (`/admin`)

- Login email + password (Supabase Auth)
- **Ringkasan** — statistik konten dan status website (draft/terbit)
- **Analytics** — kunjungan dan klik kanal
- **Pengaturan Website** — kontak, jam buka, sosial media, teks footer, isi beranda, dan SEO dengan alur Simpan Draft → Pratinjau → Terbitkan
- **Media Library** — upload gambar, tambah dari link, filter kategori dan status pemakaian, salin link
- **Slide Beranda** — kelola hero carousel
- **Brand Partner** — kelola logo mitra

Nama toko, logo, dan warna tema masih diatur lewat `src/cms/defaults.js`.

---

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | CSS murni (tanpa framework CSS) |
| Routing | React Router v7 |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Storage | Supabase Storage (bucket `media`) |
| Lint | oxlint |
| Test | `node --test` (tanpa framework) |
| Deploy | Netlify & Vercel |

---

## Struktur Folder

```
src/
├── assets/              # Logo SVG
├── cms/                 # Context CMS, store Supabase, defaults, validasi, konten beranda
├── components/
│   ├── AdminLayout/     # Layout sidebar admin
│   ├── AnalyticsTracker/
│   ├── Footer/
│   ├── HeroCarousel/
│   ├── LocationSection/ # Peta, info, dan galeri lokasi (dipakai beranda)
│   ├── Navbar/
│   └── ui/              # ImagePicker, ImageCropper, Toast, ScrollToTop, Icons
├── lib/
│   ├── analytics.js     # Helper event analytics
│   ├── ordering.js      # Helper kolom urutan numerik
│   └── supabase.js      # Inisialisasi Supabase client
└── pages/
    ├── admin/           # Halaman panel admin
    ├── HomePage.jsx
    └── HomePage.css
tests/                   # Test node:test
docs/                    # Dokumentasi tambahan
```

---

## Cara Menjalankan

### Prasyarat

- Node.js `^20.19.0` atau `>=22.12.0` (syarat Vite 8)
- Akun Supabase (gratis)

### Setup

**1. Clone & install**

```bash
git clone <url-repo>
cd banyu-landing-page
npm install
```

**2. Buat file `.env`**

Salin dari `.env.example`:

```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
# Opsional: batasi tampilan panel admin ke email tertentu (dipisah koma)
# VITE_ADMIN_EMAILS=admin@contoh.com
```

Nilai diambil dari Supabase Dashboard → Project Settings → API. `VITE_ADMIN_EMAILS` hanya menyaring tampilan di browser, bukan pengaman data.

**3. Setup database**

Jalankan di Supabase Dashboard → SQL Editor:

1. `supabase-schema.sql` — tabel dan policy dasar
2. `supabase-analytics.sql` — tabel `admin_users` dan `analytics_events`
3. `supabase-migration-admin-rls.sql` — **opsional tetapi disarankan**: mengubah policy tulis menjadi admin-only berbasis tabel `admin_users`. Migrasi ini membatalkan diri jika `admin_users` masih kosong, jadi isi dulu:

```sql
insert into public.admin_users (email)
values (lower('emailkamu@contoh.com'))
on conflict (email) do nothing;
```

4. `supabase-migration-whatsapp-orders.sql` — **legacy**, hanya untuk database lama. Fitur checkout sudah dihapus dari aplikasi.

**4. Buat akun admin**

Supabase Dashboard → Authentication → Users → Add user. Isi email dan password, centang *Auto Confirm User*.

Pastikan **Allow new users to sign up** dalam keadaan **OFF** agar tidak ada akun baru yang bisa dibuat sendiri.

**5. Jalankan**

```bash
npm run dev
```

Buka `http://localhost:5173`. Panel admin di `http://localhost:5173/admin`.

---

## Scripts

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan dev server Vite |
| `npm run build` | Build produksi ke `dist/` |
| `npm run preview` | Pratinjau hasil build |
| `npm run lint` | Jalankan oxlint |
| `npm test` | Jalankan test `node --test` |

---

## Logo Kanal Pemesanan

Kartu "Kanal Favorit" di beranda memakai logo resmi tiap platform. Taruh file
logo di `public/logos/` dengan nama sesuai channel:

| Channel | File yang dibutuhkan |
|---|---|
| GoFood | `public/logos/gofood.svg` |
| GrabMart | `public/logos/grabmart.svg` |
| WhatsApp | `public/logos/whatsapp.svg` |
| Shopee | `public/logos/shopee.svg` |
| Tokopedia | `public/logos/tokopedia.svg` |

Ketentuan:

- Format SVG paling ideal karena tajam di semua ukuran. PNG juga boleh: simpan dengan ekstensi yang benar (mis. `shopee.png`) lalu sesuaikan nilainya di `CHANNEL_LOGOS`. 
- Latar transparan, rasio 1:1, area gambar memenuhi kanvas.
- Logo akan diskalakan ke kotak 58×58 px (50×50 px di mobile) dengan `object-fit: contain`.
- Bila file belum ada atau gagal dimuat, kartu otomatis kembali memakai emoji dari CMS, jadi tampilan tidak rusak.

Pemetaan channel ke file ada di `CHANNEL_LOGOS` pada `src/cms/homeContent.js`.
Menambah platform baru = tambah entri di peta itu, tambah opsi di
`AdminSettings.jsx`, dan taruh filenya.

---

## Deploy

### Netlify

Netlify **membangun situs dari GitHub**, bukan dari folder lokal. Perubahan hanya
muncul di situs setelah di-commit dan di-push ke branch yang dipantau Netlify.

**Pengaturan build** (Netlify → Site configuration → Build & deploy → Build settings):

| Pengaturan | Nilai |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Production branch | `master` (sesuaikan dengan branch yang ingin dianggap produksi) |
| Node version | `22` (Vite 8 membutuhkan Node `^20.19.0` atau `>=22.12.0`) |

Node version bisa diatur lewat environment variable `NODE_VERSION=22`, atau
dengan menambahkan `netlify.toml` bila ingin pengaturan ikut tersimpan di repo.

**Environment variables** (Site configuration → Environment variables):

| Key | Wajib | Keterangan |
|---|---|---|
| `VITE_SUPABASE_URL` | Ya | Project URL Supabase |
| `VITE_SUPABASE_ANON_KEY` | Ya | Anon/publishable key Supabase |
| `VITE_ADMIN_EMAILS` | Tidak | Filter email admin, pisahkan dengan koma |
| `NODE_VERSION` | Tidak | Isi `22` bila build gagal karena versi Node |

Nilai `VITE_*` ditanam saat proses build, jadi **setiap kali env var diubah,
situs harus di-deploy ulang** agar perubahan terpakai.

**Cara deploy perubahan:**

1. Commit dan push ke branch produksi:

   ```bash
   git add .
   git commit -m "pesan perubahan"
   git push origin master
   ```

   Ganti `master` bila Netlify memantau branch lain.

2. Buka Netlify → pilih site → **Deploys**. Deploy baru biasanya otomatis muncul.
3. Untuk memaksa build ulang: **Trigger deploy → Clear cache and deploy site**.
4. Cocokkan commit di log deploy dengan `git log -1 --oneline`.

**Jika "Trigger deploy" tidak mengubah apa pun:**

| Penyebab | Solusi |
|---|---|
| Perubahan belum di-commit/di-push | Netlify hanya membaca GitHub. Commit lalu push dulu. |
| Branch salah | Cek **Production branch**. Repo ini punya `master` dan `security-audit`; perubahan di branch non-produksi hanya menjadi Deploy Preview, bukan situs utama. |
| Trigger pada commit yang sama | Build ulang tetap menghasilkan kode yang sama. Push commit baru. |
| Deploy gagal | Buka deploy terbaru → lihat log. Deploy gagal tidak mengganti situs yang sedang live. |
| Env var berubah tapi build lama | `VITE_*` dibaca saat build. Redeploy setelah mengubahnya. |
| Cache lama | **Trigger deploy → Clear cache and deploy site**. |

**Aset & routing:**

- `public/_redirects` berisi `/* /index.html 200` agar refresh di `/admin` tidak
  404. Pastikan publish directory `dist` supaya file ini ikut tersalin.
- Logo kanal pemesanan di `public/logos/` juga harus ikut ter-commit; file yang
  hanya ada di laptop tidak akan ikut ter-deploy.

**Deploy langsung dari laptop (opsional):**

```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

Login sekali dengan `npx netlify-cli login`, lalu hubungkan folder proyek dengan
`npx netlify-cli link`. Cara ini mengunggah hasil build lokal tanpa lewat
GitHub; cocok untuk tes cepat, tetapi commit + push tetap cara utama agar
riwayat dan Deploy Preview tetap sinkron.

**Setelah deploy:**

- Tambahkan domain Netlify ke Supabase → Authentication → URL Configuration
  (Site URL) agar tautan autentikasi mengarah ke domain yang benar.
- Buka `/admin`, login, dan pastikan data termuat. Halaman kosong dengan error
  env di console berarti `VITE_SUPABASE_*` belum diisi atau build belum diulang.

### Vercel (alternatif)

1. Import repo di Vercel → *Add New Project*
2. Framework preset: Vite. Tambahkan environment variable yang sama
3. File `vercel.json` menangani rewrite semua route ke `/index.html`

---

## Keamanan

- Anon key Supabase memang publik; pengaman data ada di RLS.
- Jangan pernah memakai `service_role` key di frontend.
- Sign-up publik Supabase harus tetap **OFF** selama policy database masih mengizinkan semua user login untuk menulis.
- Audit lengkap dan status temuan: lihat `SECURITY_AUDIT.md`.
- Ringkasan RLS dan cara menentukan admin: lihat `docs/Dokumentasi-Struktur-Database.md`.

---

## Kompatibilitas Browser

Chrome, Firefox, Safari, Edge — versi dua tahun terakhir. Dioptimasi untuk mobile-first.
