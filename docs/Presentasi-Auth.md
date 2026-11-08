# Presentasi Autentikasi — Banyu Frozen Food

Bahan presentasi auth admin: cara kerja, keamanan, dan skenario demo live.
Durasi saran: ±5 menit.

---

## 1. Ringkasan (slide pembuka)

- Login admin memakai **Supabase Auth** (email + password).
- Session berupa **JWT** yang disimpan per-browser (`localStorage`), auto-refresh ±1 jam.
- Semua route `/admin/*` dijaga **guard** — konten tidak di-render sebelum session terkonfirmasi.
- Data dilindungi **Row Level Security (RLS)** di database: publik hanya baca, tulis hanya user terautentikasi.

```
Browser → /admin (login) → Supabase Auth → JWT session
→ /admin/* (guard cek session) → Supabase DB (cek RLS)
```

---

## 2. Komponen yang terlibat

| Lapisan | File | Peran |
|---|---|---|
| Halaman login | `src/pages/admin/AdminLoginPage.jsx` | Form login, validasi, pesan error ramah |
| Penjaga route | `src/components/AdminLayout/AdminLayout.jsx` | Cek session, whitelist email, logout |
| Routing | `src/App.jsx:83-96` | `/admin` publik, `/admin/*` di dalam `<AdminLayout />` |
| Klien DB | `src/lib/supabase.js` | Koneksi Supabase via `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| Kebijakan DB | `supabase-schema.sql:90-111` | RLS: public read vs admin write |

---

## 3. Alur login (`AdminLoginPage.jsx`)

1. User buka `/admin`, isi email + password.
2. Validasi format email di frontend (`AdminLoginPage.jsx:41`).
3. `supabase.auth.signInWithPassword()` (`AdminLoginPage.jsx:53`).
4. Gagal → pesan ramah bahasa Indonesia (`AdminLoginPage.jsx:6-12`):
   - salah kredensial → "Email atau password salah."
   - rate limit, email belum konfirmasi, network → pesan masing-masing.
5. Sukses → redirect `/admin/dashboard` (`AdminLoginPage.jsx:64`).
6. Sudah login lalu buka `/admin` → otomatis redirect ke dashboard (`AdminLoginPage.jsx:21-36`).

**Demo:** login salah 1x (tunjukkan error), lalu login benar.

---

## 4. Guard protected routes (`AdminLayout.jsx`)

1. Semua `/admin/*` dibungkus `<AdminLayout />` (`App.jsx:87`).
2. Saat mounted: `supabase.auth.getSession()` (`AdminLayout.jsx:27`).
3. Status `loading` → tampil "Memuat...", **konten tidak di-render** (`AdminLayout.jsx:80-82`).
4. Hasil:
   - tanpa session → `unauthed` → redirect `/admin` (`AdminLayout.jsx:29-31`).
   - email tidak di-whitelist → `signOut` + `forbidden` → redirect `/admin` (`AdminLayout.jsx:32-35`).
   - lolos → `authed` → sidebar + `<Outlet />` tampil.
5. Listener `onAuthStateChange` (`AdminLayout.jsx:46`) — kalau token dicabut/kedaluwarsa di tab lain, langsung redirect login.

**Demo:** incognito buka `/admin/dashboard` langsung → mental ke `/admin`.

---

## 5. Whitelist email (`VITE_ADMIN_EMAILS`)

- Format: `VITE_ADMIN_EMAILS="admin@x.com,owner@y.com"` (`AdminLayout.jsx:15-20`).
- Perbandingan case-insensitive, spasi diabaikan.
- **Kosong = semua user terautentikasi boleh masuk** (perilaku lama).
- Catatan jujur untuk presentasi: cek ini di **frontend saja**, pengaman server tetap RLS.

**Demo:** tunjukkan file `.env` / Netlify Environment variables berisi 3 key:
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_EMAILS`.

---

## 6. Logout (`AdminLayout.jsx:70-73`)

- Tombol **Keluar** di sidebar → `supabase.auth.signOut()` → redirect `/admin`.
- Session lokal dihapus, guard langsung `unauthed`.

**Demo:** logout → refresh `/admin/dashboard` → kembali ke login.

---

## 7. Keamanan data — RLS (`supabase-schema.sql`)

| Tabel | Publik | Terautentikasi |
|---|---|---|
| `categories`, `products` | `SELECT` bebas (`:97-98`) | `ALL` (`:107-108`) |
| `hero_slides`, `brand_partners` | `SELECT` hanya `is_active` (`:100-101`) | `ALL` (`:110-111`) |
| `site_settings`, `media_library` | `SELECT` bebas (`:128`, `:147`) | tulis `authenticated` (`:130`, `:148`) |
| `whatsapp_orders` + items | via RPC `SECURITY DEFINER` (guest checkout aman) | `ALL` (`:203-206`) |

Poin presentasi: **frontend guard = UX, RLS = keamanan sebenarnya**. API langsung tanpa token tetap ditolak untuk tulis.

---

## 8. Skenario demo live (±5 menit)

1. **Guard (30 dtk):** incognito → `/admin/dashboard` → redirect login.
2. **Error ramah (30 dtk):** password salah → "Email atau password salah."
3. **Login sukses (30 dtk):** login benar → dashboard → refresh tetap login.
4. **Session per-browser (1 mnt):** jelaskan tab baru tidak perlu login itu normal (satu `localStorage`); browser/HP lain wajib login ulang.
5. **Logout (30 dtk):** Keluar → akses dashboard → mental ke login.
6. **RLS (1 mnt):** tunjukkan `supabase-schema.sql:107` — tulis butuh `authenticated`; publik hanya baca.
7. **Deploy (30 dtk):** `https://banyu-frozen-food.netlify.app/admin` live, env di Netlify.

---

## 9. Keterbatasan & rekomendasi (jujur, nilai plus)

1. Whitelist email hanya di frontend — rekomendasi: matikan **Allow new signups** di Supabase Auth + password kuat.
2. Policy tulis = semua `authenticated` — ideal berikutnya: role `admin` di tabel profil + policy `auth.uid()`.
3. Belum ada 2FA / lockout brute-force selain rate limit Supabase.

---

## 10. Pertanyaan yang mungkin muncul

- *"Ganti browser kok langsung masuk?"* → Tidak seharusnya; yang tanpa login ulang hanya tab/window **satu browser yang sama**. Beda browser/profil = wajib login.
- *"Netlify mati kalau 12 menit tidak ada request?"* → Tidak. Itu Render. Netlify static selalu on.
- *"Env di frontend aman?"* → `VITE_*` memang ter-embed ke client (anon key publik by design); yang rahasia (`service_role`) tidak pernah dipakai di frontend.
