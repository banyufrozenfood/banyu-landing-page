# Audit Keamanan Banyu Frozen Food

Tanggal audit: 2026-11-08  
Branch audit: `security-audit`  
Lingkup: repo lokal dan file SQL di repo. Tidak ada pemindaian atau trafik uji ke produksi maupun layanan pihak ketiga.

## Ringkasan

Stack nyata repo ini adalah **Vite + React + JavaScript + Supabase**, bukan Next.js + TypeScript. Aplikasi tidak memiliki API route, server action, middleware server, atau backend sendiri. Proteksi data bergantung pada Supabase Auth, RLS (aturan akses database), Storage policy, dan konfigurasi dashboard Supabase.

Temuan paling berbahaya adalah policy SQL yang memberi akses penuh kepada **semua user yang sudah login**, bukan hanya admin. Allowlist email di `AdminLayout.jsx` hanya berjalan di browser sehingga bukan pengganti RLS. Dua fungsi `SECURITY DEFINER` juga belum menunjukkan pemeriksaan admin dan pembatasan hak eksekusi.

## Pemetaan akses

### Route publik dan route admin

Route aktif di `src/App.jsx`:

| Route | Akses dari UI | Catatan |
|---|---|---|
| `/` | Publik | Homepage dan konten lokasi satu halaman |
| `/admin` | Publik | Halaman login Supabase Auth |
| `/admin/dashboard` | Guard browser | Query data tetap bergantung pada RLS |
| `/admin/analytics` | Guard browser | Sama |
| `/admin/hero-slides` | Guard browser | Sama |
| `/admin/brand-partners` | Guard browser | Sama |
| `/admin/media` | Guard browser | Sama |
| `/admin/settings` | Guard browser | Sama |
| route lain | Publik ke halaman 404 | Tidak ada route produk/lokasi aktif pada `App.jsx` |

Kode katalog yang tidak terpakai (`ProductsPage`, `ProductDetailPage`, `LocationPage`, `AdminProducts`, `AdminCategories`, `AdminOrders`, serta `CartContext`/`CartDrawer`/`ProductCard`) sudah dihapus pada 2026-11-15 untuk mengurangi permukaan serangan.

### API, server action, middleware

- Tidak ditemukan API route, server action, atau middleware server.
- Operasi database dilakukan langsung dari browser melalui `@supabase/supabase-js`.
- Aplikasi saat ini tidak memanggil RPC apa pun. RPC `create_whatsapp_order` dan `set_whatsapp_order_status` masih ada di SQL legacy, dengan `EXECUTE` sudah dibatasi (lihat SEC-02 dan SEC-07).

### Environment variable

| Nama | Lokasi penggunaan | Status dari repo |
|---|---|---|
| `VITE_SUPABASE_URL` | `src/lib/supabase.js` | `.env` diabaikan Git; perlu set di hosting |
| `VITE_SUPABASE_ANON_KEY` | `src/lib/supabase.js` | Anon/publishable key masuk bundle; RLS wajib benar |
| `VITE_ADMIN_EMAILS` | `src/components/AdminLayout/AdminLayout.jsx` | Allowlist UI saja, bukan otorisasi server |

`.env` tidak tracked pada Git. Pencarian riwayat Git terhadap `service_role` dan `SUPABASE_SERVICE_ROLE` tidak menemukan hasil.

### Tabel dan policy

| Tabel/objek | SQL repo | Akses yang tampak |
|---|---|---|
| `categories`, `products`, `hero_slides`, `brand_partners` | RLS aktif | Publik SELECT; tulis hanya admin terdaftar di `admin_users` |
| `reviews` | RLS aktif | Publik SELECT approved dan INSERT bebas; tulis-admin hanya admin terdaftar |
| `site_settings`, `media_library` | RLS aktif | Publik SELECT; tulis hanya admin terdaftar |
| `whatsapp_orders`, `whatsapp_order_items` | RLS aktif | Hanya admin terdaftar |
| `admin_users` | RLS aktif | User authenticated membaca membership dirinya |
| `analytics_events` | RLS aktif | Publik INSERT; admin terdaftar SELECT |
| `storage.objects` bucket `media` | Policy terlihat | Publik SELECT; INSERT/UPDATE/DELETE hanya admin terdaftar |

## Perbaikan yang tersedia di repo

Diperbarui 2026-11-15. Perubahan ini ada di repo; **file migrasi SQL belum dijalankan di project Supabase**. Selama belum dijalankan, database tetap memakai policy lama (`auth.role() = 'authenticated'`).

Catatan konfirmasi pemilik (2026-11-15): sign-up publik Supabase sudah **dimatikan**, dan hanya ada **satu akun** Supabase Auth. Karena itu risiko guard UI yang hanya memakai `VITE_ADMIN_EMAILS` dinilai rendah (lihat SEC-03).

| Perbaikan | File | Catatan |
|---|---|---|
| Policy tulis admin-only berbasis `admin_users` | `supabase-migration-admin-rls.sql` | Mengganti semua `auth.role() = 'authenticated'`. Dibatalkan otomatis bila `admin_users` kosong agar panel tidak terkunci |
| Fungsi bantu `public.is_admin()` | `supabase-migration-admin-rls.sql`, `supabase-schema.sql` | `SECURITY DEFINER` + `search_path` eksplisit + `REVOKE`/`GRANT` |
| Policy Storage admin-only | `supabase-migration-admin-rls.sql`, `supabase-schema.sql` | INSERT/UPDATE/DELETE bucket `media` |
| RPC legacy dikunci | `supabase-migration-whatsapp-orders.sql` | Cek `is_admin()`, `search_path` eksplisit, batas input, `REVOKE`/`GRANT` |
| Guard UI dipertahankan seperti semula | `src/components/AdminLayout/AdminLayout.jsx` | Hanya memakai `VITE_ADMIN_EMAILS`; otorisasi data tetap bergantung pada RLS |
| Instalasi baru langsung aman | `supabase-schema.sql` | Schema utama tidak lagi memakai `auth.role()` |
| Konfigurasi Supabase gagal terlihat | `src/lib/supabase.js` | Env hilang dilaporkan eksplisit, bukan gagal diam-diam |
| Template env | `.env.example` | Hanya placeholder |
| Script test | `package.json`, `tests/` | `npm test` memakai `node --test` |
| Permukaan serangan katalog dihapus | `src/` | Cart, produk, kategori, dan order tidak lagi ada di aplikasi |

## Temuan

| ID | Tingkat | Lokasi | Risiko dengan bahasa awam | Perbaikan | Status |
|---|---|---|---|---|---|
| SEC-01 | **Kritis** | `supabase-schema.sql:107-111,130,148,203-205`; `supabase-migration-whatsapp-orders.sql:30-34` | Semua user yang berhasil membuat/login akun Supabase dapat mengubah konten website, media, dan data pesanan. Login bukan bukti orang tersebut admin. | Semua policy tulis harus memeriksa membership admin melalui `admin_users` atau claim role yang dikelola server. Pisahkan policy SELECT/INSERT/UPDATE/DELETE dan terapkan pada tabel legacy. | **Siap — belum dijalankan** (`supabase-migration-admin-rls.sql`) |
| SEC-02 | **Kritis** | `supabase-migration-whatsapp-orders.sql:94-146` | RPC `set_whatsapp_order_status` memakai `SECURITY DEFINER`, tetapi tidak terlihat memeriksa admin. Jika dapat dipanggil role luar, orang luar dapat mengubah status dan stok. | Batasi `EXECUTE`, cabut dari `public`/`anon` bila tidak perlu, cek membership admin di dalam fungsi, set `search_path` eksplisit, dan validasi ID/status. | **Siap — belum dijalankan** (`supabase-migration-whatsapp-orders.sql`) |
| SEC-03 | **Tinggi** | `src/components/AdminLayout/AdminLayout.jsx:13-21,23-64` | Pemeriksaan admin hanya React/browser. `VITE_ADMIN_EMAILS` dapat dilihat dan dimanipulasi; saat kosong semua user authenticated masuk UI. | Jadikan `admin_users`/role Supabase sumber otorisasi utama di RLS dan RPC. UI guard hanya untuk pengalaman pengguna. | **Diterima — risiko rendah.** Hanya 1 akun Supabase Auth dan sign-up publik dimatikan; guard UI sengaja hanya `VITE_ADMIN_EMAILS`, otorisasi data tetap bergantung pada RLS |
| SEC-04 | **Tinggi** | `supabase-schema.sql:97-111`; `supabase-analytics.sql:50-56` | `admin_users` dipakai untuk analytics, tetapi policy CMS, hero, brand, produk, kategori, dan order hanya mengecek `auth.role() = 'authenticated'`. | Cek membership admin pada setiap policy tulis dan uji anon, authenticated non-admin, serta admin. | **Siap — belum dijalankan** (fungsi `public.is_admin()`) |
| SEC-05 | **Tinggi** | `supabase-migration-whatsapp-orders.sql:37-91` | RPC order publik tanpa rate limit/CAPTCHA/honeypot. Bot dapat membuat banyak order palsu dan memenuhi database. Batas item, quantity, panjang teks, dan jumlah order belum jelas. | Tambahkan batas input di fungsi, tolak quantity ekstrem, rate limit di edge/server layer, dan anti-bot pada form. Jangan mengandalkan React. | **Siap sebagian — belum dijalankan.** Batas input ada di file migrasi; rate limit/CAPTCHA di luar jangkauan DB |
| SEC-06 | **Tinggi** | `supabase-schema.sql:153-167`; `src/cms/store.js:159-174`; `src/pages/admin/AdminMedia.jsx:91-110` | Upload hanya memeriksa MIME dan ukuran di client. MIME dapat dipalsukan, SVG diizinkan, dan semua authenticated dapat upload/update/delete bucket. | Batasi Storage ke admin membership, validasi tipe/isi file di backend/Edge Function, pertimbangkan menolak SVG, gunakan nama acak, dan batasi ukuran di trust boundary. | **Sebagian — belum dijalankan.** Policy Storage admin-only ada di file migrasi; validasi MIME masih di client |
| SEC-07 | **Tinggi** | `supabase-migration-whatsapp-orders.sql:36-45,94-101` | Kedua RPC `SECURITY DEFINER` belum menetapkan `search_path` dan privilege `EXECUTE` aktual tidak terlihat dari repo. | Tetapkan `search_path` minimum, gunakan schema lengkap, `REVOKE EXECUTE FROM PUBLIC`, lalu `GRANT EXECUTE` hanya role yang perlu. | **Siap — belum dijalankan** (`search_path` + `REVOKE`/`GRANT` eksplisit) |
| SEC-08 | **Sedang** | `supabase-analytics.sql:37-48`; `src/lib/analytics.js:116-142` | Siapa pun dapat mengirim event analytics berulang. Statistik dapat dipalsukan dan tabel/kuota membesar. | Tambahkan rate limit per IP/session, batas request, deduplikasi/agregasi, dan retensi data. | **Terbuka** |
| SEC-09 | **Sedang** | `supabase-schema.sql:103-104` | Public review insert memakai `WITH CHECK (true)` tanpa batas panjang atau anti-spam. Jika fitur aktif lagi, bot dapat mengisi database. | Tambahkan batas panjang, moderasi, rate limit, dan output escaping. | **Terbuka — fitur tidak tampak aktif di route** |
| SEC-10 | **Sedang** | `src/cms/store.js:162-164`; `src/cms/validate.js:32-34` | Validasi upload hanya client dan menerima SVG/GIF. Kontrol dapat dilewati jika Storage diakses langsung dengan anon key. | Pindahkan validasi ke backend/Edge Function atau policy yang didukung, gunakan allowlist minimum, dan pertimbangkan menolak SVG. | **Terbuka** |
| SEC-11 | **Sedang** | `src/components/HeroCarousel/HeroCarousel.jsx:98-113`; `src/pages/admin/AdminHeroSlides.jsx:52-68` | Link CMS yang diawali `/` dapat berpotensi menjadi `//host-asing`, sehingga mengarah ke situs phishing/open redirect. | Izinkan path internal yang diawali satu `/` atau hostname eksternal allowlist. Validasi di backend/database. | **Terbuka** |
| SEC-12 | **Sedang** | `supabase-migration-whatsapp-orders.sql:54-85` | Nama/alamat dikirim ke RPC legacy. Fitur checkout sudah dihapus dari UI, jadi tidak ada jalur aktif dari aplikasi. | Validasi server semua field, rate limit/anti-bot bila fitur diaktifkan kembali. | **Tidak berlaku** — UI cart dihapus; RPC dikunci saat migrasi dijalankan |
| SEC-13 | **Rendah** | `vite.config.js`; `vercel.json`; `public/_redirects` | Tidak ada header keamanan terlihat di repo: CSP, `X-Content-Type-Options`, frame protection, Referrer-Policy, Permissions-Policy, HSTS. Bisa saja dipasang CDN/hosting. | Tambahkan konfigurasi `_headers`/hosting dan verifikasi header dari staging. HSTS setelah HTTPS stabil. | **Perlu verifikasi manual** |
| SEC-14 | **Rendah** | `package.json`; `package-lock.json` | `npm audit` menemukan 2 vulnerability high: direct `vite` dan transitive `source-map-js`. | Upgrade teruji ke versi patched, review lockfile, build/lint ulang, dan jangan buka Vite dev server ke publik. | **Terbuka** |
| SEC-15 | **Info** | `package.json:6-11` | Tidak ada script `test`; `npm test` tidak tersedia sebagai gate CI. | Tambahkan script test jika akan dipakai CI; jalankan test yang ada setiap perubahan security. | **Diperbaiki** — `npm test` memakai `node --test` |

## Hal yang sudah terlihat aman

- `.env` dan `.env.*` masuk `.gitignore`; `.env` tidak tracked pada pemeriksaan.
- Tidak ditemukan `service_role` atau `SUPABASE_SERVICE_ROLE` di kode maupun riwayat Git yang diperiksa.
- Klien memakai anon key, bukan service role key.
- RLS dinyatakan aktif pada tabel yang dibuat SQL repo, termasuk order legacy dan analytics. Status database produksi tetap perlu diverifikasi manual.
- Analytics punya allowlist tipe event, channel, format ID, dan panjang path/event.
- `target="_blank"` yang ditemukan umumnya memakai `rel="noopener noreferrer"`.
- URL helper CMS membatasi URL tertentu ke `http:` atau `https:`.
- Order menghitung harga dari tabel `products` di database, bukan mempercayai harga browser.
- Tidak ditemukan `dangerouslySetInnerHTML`, `innerHTML`, `eval`, atau `new Function` pada source yang dipindai.
- Error boundary mencegah stack trace ditampilkan langsung kepada pengunjung.

## Hal yang tidak dapat dipastikan dari kode saja

Periksa manual sebelum deployment publik:

1. **Supabase Auth:** pendaftaran publik, akun admin, email confirmation, password policy, reset password, session lifetime, refresh token rotation, CAPTCHA/rate limit, dan pesan error. Sign-up publik sudah dikonfirmasi **OFF** per 2026-11-15; pertahankan status itu setidaknya sampai migrasi RLS dijalankan.
2. **Database production:** semua migration, policy tambahan/lama, status RLS setiap tabel `public`, privilege `EXECUTE` RPC, fungsi `SECURITY DEFINER` dan `search_path`, view, trigger, dan extension.
3. **`admin_users`:** membership admin benar dan email lowercase; authenticated non-admin tidak dapat menulis.
4. **Supabase Storage:** bucket `media`, policy aktual, batas ukuran/MIME, anonymous upload, serta content type file SVG/HTML.
5. **Hosting/Netlify:** environment variable hanya URL dan anon key; HTTPS; security headers; source maps; SPA redirect; body/request limit; log retention; branch deploy protection.
6. **Dependensi:** advisory sudah hilang setelah upgrade dan lockfile tetap konsisten.
7. **Uji staging:** gunakan project Supabase staging dan data dummy untuk anonymous read/write, authenticated non-admin, admin, RPC, Storage, order spam, dan header. Jangan uji serangan ke produksi.

## Rencana perbaikan lanjutan

1. Jalankan migrasi helper membership admin dan ubah semua policy tulis dari `auth.role() = 'authenticated'` menjadi admin-only (file SQL sudah tersedia, belum dieksekusi).
2. Kunci privilege kedua RPC: admin-only untuk status order; public hanya create order jika fitur dipertahankan, dengan batas input dan `search_path` eksplisit (file SQL sudah tersedia, belum dieksekusi).
3. Tambahkan validasi order server-side dan rate limit/anti-bot pada boundary yang tersedia.
4. Batasi Storage ke admin, hapus dukungan SVG bila tidak dibutuhkan, dan validasi file di backend/Edge Function.
5. Perbaiki validasi CTA agar tidak menerima protocol-relative URL dan upgrade dependensi vulnerable.
6. Tambahkan test kecil untuk policy contract/SQL lint; verifikasi akses memakai project staging, bukan produksi.

Kode aplikasi sudah dibersihkan dari fitur katalog/cart. Perbaikan Kritis/Tinggi yang tersisa bergantung pada eksekusi file migrasi SQL di Supabase; tanpa itu database tetap memakai policy lama.
