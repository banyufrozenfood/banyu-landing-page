 Panduan Presentasi — Website Banyu Frozen Food

> File ini dibuat khusus untuk latihan presentasi. Bahasanya dibuat sesederhana mungkin.
> Cara pakai: baca Bagian 1–3 dulu sampai paham, lalu hafalkan jawaban singkat di Bagian 7.

## Daftar Isi

1. [Penjelasan 1 Menit (hafalkan ini)](#1-penjelasan-1-menit-hafalkan-ini)
2. [Kamus Istilah — baca dulu sebelum yang lain](#2-kamus-istilah--baca-dulu-sebelum-yang-lain)
3. [Cara Kerja Aplikasi (alur besar)](#3-cara-kerja-aplikasi-alur-besar)
4. [Fitur 1 — Beranda](#4-fitur-1--beranda)
5. [Fitur 2 — Katalog Produk](#5-fitur-2--katalog-produk)
6. [Fitur 3 — Detail Produk](#6-fitur-3--detail-produk)
7. [Fitur 4 — Keranjang & Checkout WhatsApp](#7-fitur-4--keranjang--checkout-whatsapp)
8. [Fitur 5 — Halaman Lokasi](#8-fitur-5--halaman-lokasi)
9. [Fitur 6 — Panel Admin](#9-fitur-6--panel-admin)
10. [Fitur 7 — Pengaturan Situs (sistem draft–terbit)](#10-fitur-7--pengaturan-situs-sistem-draftterbit)
11. [Potongan Kode yang Paling Mungkin Ditanyakan](#11-potongan-kode-yang-paling-mungkin-ditanyakan)
12. [Bank Pertanyaan Guru + Jawaban](#12-bank-pertanyaan-guru--jawaban)
13. [Skenario Demo Saat Presentasi](#13-skenario-demo-saat-presentasi)
14. [Kalimat Aman Jika Tidak Bisa Menjawab](#14-kalimat-aman-jika-tidak-bisa-menjawab)

---

## 1. Penjelasan 1 Menit (hafalkan ini)

> "Website saya adalah **website katalog untuk Banyu, toko frozen food di Cimahi**.
> Pengunjung bisa melihat-lihat produk, mencari dan memfilter produk, memasukkan produk ke keranjang, lalu memesan semuanya sekaligus lewat **satu pesan WhatsApp otomatis**.
> Website ini **bukan toko online dengan pembayaran** — tidak ada transfer atau checkout uang di website. Pembayarannya tetap dilakukan di WhatsApp atau marketplace seperti Tokopedia dan Shopee.
> Ada juga **panel admin** di alamat `/admin`, supaya pemilik toko bisa menambah produk, mengganti foto, dan mengubah tulisan website **tanpa harus bisa coding**.
> Data produk disimpan di **Supabase**, yaitu database online gratis, dan tampilannya dibuat dengan **React**."

Hafalkan paragraf di atas. Itu jawaban untuk pertanyaan pembuka seperti "Coba jelaskan project kamu."

---

## 2. Kamus Istilah — baca dulu sebelum yang lain

| Istilah | Arti sederhana |
|---|---|
| **Frontend** | Bagian yang **dilihat pengunjung**: tulisan, gambar, tombol, warna. Dibuat dengan React. Analogi: **etalase dan interior toko**. |
| **Backend** | Bagian yang **tidak terlihat** tapi menyimpan dan mengatur data. Di project ini backend-nya adalah Supabase. Analogi: **gudang dan ruang staf** toko. |
| **Database** | **Lemari arsip digital** tempat semua data disimpan dalam bentuk tabel (seperti tabel Excel): tabel produk, tabel kategori, dll. |
| **API** | **Pelayan/perantara** antara tampilan (frontend) dan gudang data (backend). Saat website butuh data produk, ia "memesan" lewat API. Kamu tidak menulis API sendiri — Supabase sudah menyediakannya. |
| **Supabase** | Layanan online gratis yang menyediakan database + login admin + tempat menyimpan foto. Project ini memakai Supabase supaya tidak perlu membuat server sendiri. |
| **React** | Alat (library) untuk membuat tampilan website. Cara pikirnya: website dipecah menjadi **komponen-komponen kecil** (misal komponen tombol, komponen kartu produk) yang disusun seperti Lego. |
| **Komponen** | Satu potongan tampilan yang bisa dipakai ulang. Contoh: `ProductCard` (kartu produk) dipakai di beranda dan di katalog — tulis sekali, pakai berkali-kali. |
| **State** | **Ingatan sementara** sebuah halaman. Contoh: isi keranjang, kata yang diketik di pencarian, halaman ke berapa. Kalau state berubah, tampilan otomatis ikut berubah. |
| **Fetch / mengambil data** | Website **meminta data ke database**, lalu menampilkannya. Contoh: halaman produk "fetch" daftar produk dari Supabase. |
| **localStorage** | **Catatan kecil yang disimpan browser** di HP/komputer pengunjung. Isi keranjang disimpan di sini, makanya keranjang tidak hilang walau halaman di-refresh. |
| **Route / Routing** | **Alamat-alamat** website. `/` = beranda, `/produk` = katalog, `/produk/5` = detail produk nomor 5, `/admin` = panel admin. |
| **Context** | **Tas bersama**: data yang bisa diambil dari halaman mana pun tanpa oper-operan manual. Contoh: data keranjang (`CartContext`) bisa dipakai navbar, kartu produk, dan drawer sekaligus. |
| **RLS (Row Level Security)** | **Aturan satpam database**: siapa boleh baca, siapa boleh ubah. Di project ini: semua orang boleh *membaca*, tapi hanya admin yang login boleh *menambah/mengubah/menghapus*. |
| **CRUD** | Singkatan **Create, Read, Update, Delete** = tambah, baca, ubah, hapus data. Kalau guru bilang "fitur CRUD produk", artinya "fitur tambah-baca-ubah-hapus produk". |
| **Deploy** | **Menerbitkan website ke internet** supaya bisa dibuka orang lain (project ini siap deploy ke Netlify atau Vercel). |
| **Pagination** | **Halaman 1, 2, 3...** pada daftar produk — produk dibagi 6 per halaman supaya tidak menumpuk. |
| **Draft / Terbit** | **Konsep buram vs final**: perubahan di Pengaturan disimpan dulu sebagai draft (buram, belum terlihat pengunjung), baru terlihat setelah diklik Terbitkan. |

---

## 3. Cara Kerja Aplikasi (alur besar)

Hubungan frontend – backend – database dalam project ini:

```
PENGUNJUNG (browser)
    │
    │ 1. Membuka halaman (misal /produk)
    ▼
FRONTEND (React — etalase toko)
    │ 2. "Minta data produk" lewat API Supabase
    ▼
SUPABASE (gudang online)
    │ 3. Mengecek aturan satpam (RLS):
    │    "orang biasa? boleh baca saja"
    ▼
DATABASE (lemari arsip: tabel products, categories, ...)
    │ 4. Mengirim data produk kembali
    ▼
FRONTEND menampilkan kartu-kartu produk ke pengunjung
```

**Tiga hal yang terjadi di browser pengunjung (tanpa internet ke database pun tetap jalan):**

1. **Keranjang belanja** — disimpan di `localStorage` (catatan browser), bukan di database.
2. **Checkout WhatsApp** — website hanya *menyusun pesan* lalu membuka aplikasi WhatsApp. Tidak ada uang berpindah di website.
3. **Pengaturan situs** — dibaca dari database sekali saat website dibuka, lalu dipakai semua halaman (nama toko, nomor WA, warna, link Tokopedia).

**File-file fondasi (wajib tahu):**

| File | Peran sederhana |
|---|---|
| `src/main.jsx` | **Pintu masuk pertama.** Menyalakan website dan membungkusnya dengan 3 "tas bersama": notifikasi (`ToastProvider`), pengaturan situs (`SiteSettingsProvider`), keranjang (`CartProvider`). |
| `src/App.jsx` | **Peta alamat (denah gedung).** Menentukan alamat `/` buka halaman apa, `/produk` buka apa, `/admin/*` buka apa, dan alamat ngawur tampil 404. |
| `src/lib/supabase.js` | **Nomor telepon gudang.** Menyimpan alamat + kunci Supabase, dipakai semua file yang butuh data. |
| `src/cms/defaults.js` | **Isi bawaan website** jika database belum ada: nama toko, nomor WA contoh, jam buka, warna, 5 keunggulan. |
| `supabase-schema.sql` | **Cetak biru gudang.** File SQL untuk membuat semua tabel + aturan satpam di Supabase. Dijalankan sekali di awal. |

---

## 4. Fitur 1 — Beranda

**Tujuan:** Kesan pertama. Pengunjung langsung paham ini toko apa, produk apa yang dijual, dan ke mana harus memesan.

**Alur pengguna:** Buka `/` → lihat gambar slide berputar → baca keunggulan toko → lihat 4 produk unggulan → klik "Lihat Semua Produk" → (opsional) klik kartu Tokopedia/Shopee → lihat logo brand partner.

**File yang bertanggung jawab:**

| File | Fungsi sederhana |
|---|---|
| `src/pages/HomePage.jsx` | **Halaman beranda itu sendiri.** Mengambil 3 data dari database (slide, brand partner, produk unggulan), lalu menyusun section-sectionnya. |
| `src/components/HeroCarousel/HeroCarousel.jsx` | **Slide gambar yang berputar otomatis** tiap 4 detik, bisa digeser pakai panah/titik. Kalau disentuh, berhenti sebentar lalu jalan lagi setelah 5 detik. |
| `src/components/ProductCard/ProductCard.jsx` | **Satu kartu produk**: foto, nama kategori, nama, harga, tombol `+`. Dipakai di beranda dan katalog. Tombol `+` terkunci jika stok 0 (tampil badge "Habis"). |
| `src/components/Navbar/Navbar.jsx` | **Menu atas**: logo, link Home/Produk/Lokasi (diambil dari pengaturan), ikon keranjang + angka, hamburger di HP. |
| `src/components/Footer/Footer.jsx` | **Bagian bawah**: deskripsi toko, navigasi, daftar kategori (otomatis dari database!), kontak, ikon sosmed, copyright. |

**Bagian kode penting (di `HomePage.jsx`):**

```js
const { data: products } = await supabase
  .from('products')          // ambil dari tabel products
  .select('*, categories(name)')  // + ikutkan nama kategorinya
  .eq('is_featured', true)   // hanya yang dicentang "unggulan"
  .limit(4);                 // maksimal 4
```

Artinya: "Ambil maksimal 4 produk yang ditandai unggulan, beserta nama kategorinya."

**Kemungkinan ditanya guru:** "Kenapa tombol Tokopedia kadang hilang?" → Jawab: "Karena tombolnya hanya tampil jika linknya diisi di Pengaturan. Kalau dikosongkan, otomatis disembunyikan — dicek di kode dengan `hasTokopedia`."

---

## 5. Fitur 2 — Katalog Produk

**Tujuan:** Pengunjung bisa **menemukan** produk yang dicari dengan cepat, walau produknya banyak.

**Alur pengguna:** Buka `/produk` → ketik pencarian / pilih kategori / isi harga min–maks + Terapkan → pilih urutan (Terbaru/Termurah/Termahal) → pindah halaman 1-2-3 → klik kartu → masuk detail. Filter juga **tersimpan di alamat URL**, jadi link kategori dari footer langsung memfilter.

**File yang bertanggung jawab:**

| File | Fungsi sederhana |
|---|---|
| `src/pages/ProductsPage.jsx` | **Satu-satunya file halaman katalog.** Mengambil semua produk + kategori sekali, lalu memfilter, mengurutkan, dan membagi halaman — semuanya di browser. |

**Bagian kode penting 1 — filter (cara menyaring):**

```js
if (selectedCategory) {
  result = result.filter((p) => p.category_id === selectedCategory)
}
```

Artinya: "Buang semua produk yang kategorinya tidak cocok dengan yang dipilih." Filter harga dan pencarian caranya sama: saring daftar satu per satu.

**Bagian kode penting 2 — pagination (membagi halaman):**

```js
const PRODUCTS_PER_PAGE = 6
const paginatedProducts = filtered.slice(
  (currentPage - 1) * PRODUCTS_PER_PAGE,
  currentPage * PRODUCTS_PER_PAGE
)
```

Artinya: "Halaman 1 ambil produk ke 1–6, halaman 2 ambil ke 7–12." (`slice` = memotong daftar.)

**Kemungkinan ditanya guru:** "Datanya difilter di database atau di browser?" → Jawab: "Di browser. Semua produk diambil sekali, lalu disaring dengan JavaScript. Kelebihannya simpel dan cepat untuk data yang tidak terlalu besar."

---

## 6. Fitur 3 — Detail Produk

**Tujuan:** Meyakinkan pengunjung sebelum membeli: foto jelas, harga, stok, deskripsi, dan tombol beli.

**Alur pengguna:** Klik produk → baca breadcrumb (Home/Produk/Nama) → lihat galeri foto (klik thumbnail) → cek harga & stok → klik "Tambah ke Keranjang" atau "Beli di Tokopedia/Shopee" → baca tab Deskripsi/Spesifikasi → lihat Produk Terkait (maks 4, kategori sama).

**File yang bertanggung jawab:**

| File | Fungsi sederhana |
|---|---|
| `src/pages/ProductDetailPage.jsx` | **Satu file untuk seluruh halaman detail.** Mengambil 1 produk berdasarkan ID dari alamat URL, plus produk se-kategori untuk "Produk Terkait". |

**Hal penting untuk dijelaskan ke guru:**

1. **Link Tokopedia/Shopee kini individual per produk** — diatur langsung dari form Edit Produk di panel admin (lengkap dengan toggle aktif/nonaktif). Jika diaktifkan dan link diisi, tombol langsung mengarah ke halaman spesifik produk tersebut di Tokopedia/Shopee.
2. **Aman dari data kosong** — produk tanpa foto menampilkan gambar pengganti ("No Image"), spesifikasi kosong menampilkan tulisan "Belum ada spesifikasi", ID yang tidak ada menampilkan halaman "Produk Tidak Ditemukan". Website tidak crash.
3. **Stok 0** menampilkan "Stok habis" dan tombol `+` di kartu ikut terkunci.

---

## 7. Fitur 4 — Keranjang & Checkout WhatsApp

**Tujuan:** Pengunjung bisa memesan **banyak produk sekaligus dalam satu pesan**, dan data pesanannya otomatis tercatat di sistem toko.

**Alur pengguna:** Klik `+` di kartu / "Tambah ke Keranjang" di detail → angka badge di navbar bertambah + notifikasi muncul → klik ikon keranjang → drawer terbuka dari kanan → atur jumlah (+/−) atau hapus → **isi nama pemesan & alamat pengiriman lengkap** → klik "Pesan via WhatsApp" → data pesanan tercatat ke tabel `whatsapp_orders` dengan status *menunggu konfirmasi* → WhatsApp terbuka dengan pesan rapi berisi rincian pesanan dan nomor order → keranjang belanja dikosongkan.

**Isi pesan otomatisnya** (hafalkan bentuknya):

```
Halo Banyu, saya mau pesan produk dari website:

📋 *DETAIL PESANAN*
• Nugget Ayam (2x) — Rp 50.000
• Sosis Sapi (1x) — Rp 25.000
Total Produk: Rp 75.000

📍 INFORMASI PENGIRIMAN
• Nama: Budi
• Alamat Lengkap: Jl. Sukajadi No. 12, Cimahi

Nomor pesanan website: WA-20261011-A1B2C3
```

**File yang bertanggung jawab:**

| File | Fungsi sederhana |
|---|---|
| `src/components/CartContext.jsx` | **Otak keranjang.** Menyimpan daftar belanja, fungsi tambah/hapus/ubah jumlah, menghitung total & jumlah item, dan menyimpan ke `localStorage` supaya tidak hilang saat refresh. |
| `src/components/ui/CartDrawer.jsx` | **Laci keranjang yang geser dari kanan.** Menampilkan form pemesan (nama & alamat), memanggil fungsi pencatatan pesanan di Supabase, dan menyusun link WhatsApp otomatis. |

**Bagian kode penting 1 — tambah ke keranjang (`CartContext.jsx`):**

```js
const addToCart = (product, quantity = 1) => {
  setCartItems(prev => {
    const existing = prev.find(item => item.id === product.id)
    if (existing) {
      // kalau produknya sudah ada → tambah jumlahnya saja
      return prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    }
    // kalau belum ada → taruh sebagai item baru
    return [...prev, { ...product, quantity }]
  })
  toast.success('Produk ditambahkan ke keranjang!')
}
```

**Bagian kode penting 2 — keranjang tidak hilang saat refresh:**

```js
// saat dibuka: baca catatan browser
const saved = localStorage.getItem('banyu_cart')
// setiap isi berubah: tulis ke catatan browser
localStorage.setItem('banyu_cart', JSON.stringify(cartItems))
```

**Bagian kode penting 3 — pesan WhatsApp (`CartDrawer.jsx`):**

```js
const message = encodeURIComponent(intro + itemsText + totalText + addressInfo)
const waUrl = `https://wa.me/${settings.contact.whatsapp}?text=${message}`
window.open(waUrl, '_blank')
```

Artinya: "Susun teks pesanan, ubah jadi format link (`encodeURIComponent`), tempel ke nomor WA toko dari Pengaturan, buka di tab baru." Nomor WA-nya **bisa diganti admin** tanpa coding.

**Kemungkinan ditanya guru:** "Kenapa pakai WhatsApp, bukan payment gateway?" → Jawab: "Karena targetnya toko lokal — pelanggan lebih nyaman chat WA, tidak ada komisi marketplace 15–20%, dan tidak perlu sistem pembayaran yang mahal/rumit. Ini juga tertulis di PRD bagian Tujuan Bisnis."

---

## 8. Fitur 5 — Halaman Lokasi

**Tujuan:** Pelanggan yang mau datang langsung tahu alamat, jam buka, dan bisa menghubungi toko.

**Alur pengguna:** Buka `/lokasi` → lihat peta Google Maps → baca alamat lengkap & jam operasional → klik "Buka di Google Maps" / "Hubungi via WhatsApp" / "Telepon Langsung" → lihat galeri foto toko.

**File yang bertanggung jawab:**

| File | Fungsi sederhana |
|---|---|
| `src/pages/LocationPage.jsx` | **Satu file halaman lokasi.** Peta, alamat, jam, telepon, email semuanya diambil dari Pengaturan (bukan tulisan mati di kode). Galeri foto diambil dari Media Library kategori "Foto Toko" — kalau belum ada foto, tampil gambar default. |

**Kemungkinan ditanya guru:** "Bagaimana cara ganti alamat/jam buka?" → Jawab: "Lewat panel admin → Pengaturan → tab Kontak & Jam Buka, lalu Terbitkan. Tidak perlu edit kode."

---

## 9. Fitur 6 — Panel Admin

**Tujuan:** Pemilik toko yang **tidak bisa coding** tetap bisa mengelola seluruh isi website sendiri.

**Alur pengguna:** Buka `/admin` → login email + password → masuk dashboard → pilih menu di sidebar → tambah/edit/hapus data → data langsung berubah di website (kecuali Pengaturan yang memakai sistem draft–terbit).

**Keamanan (penting!):** Ada 2 lapis pengaman.

1. **Di website** (`AdminLayout.jsx`): kalau belum login, otomatis dilempar ke halaman login. Dicek lewat `supabase.auth.getSession()` (tanya ke Supabase: "apakah orang ini sudah login?").
2. **Di database** (RLS): aturan satpam — orang biasa hanya boleh *membaca*, hanya yang login boleh *menambah/mengubah/menghapus*.

**File yang bertanggung jawab:**

| File | Fungsi sederhana |
|---|---|
| `src/pages/admin/AdminLoginPage.jsx` | **Form login.** Email + password dicek ke Supabase. Kalau salah, muncul pesan ramah. Kalau sudah login, langsung dilempar ke dashboard. |
| `src/components/AdminLayout/AdminLayout.jsx` | **Penjaga + kerangka panel.** Mengecek login, menampilkan sidebar 8 menu, tombol Logout, dan tombol "Lihat Website". |
| `src/pages/admin/AdminDashboard.jsx` | **Ringkasan:** kartu panduan pertama kali, status website (sudah terbit/belum), total produk, kategori, jumlah **pesanan menunggu**, jalan pintas. |
| `src/pages/admin/AdminOrders.jsx` | **Pesanan WhatsApp & Stok:** daftar order masuk dari web. Konfirmasi pesanan otomatis memotong stok produk secara aman di database; batalkan pesanan otomatis mengembalikan stok. |
| `src/pages/admin/AdminProducts.jsx` | **CRUD produk:** tabel + pencarian, form (nama, slug otomatis, kategori, harga, stok, deskripsi, URL gambar koma-pisah, centang unggulan, serta opsi toggle & link marketplace Tokopedia & Shopee per produk). |
| `src/pages/admin/AdminCategories.jsx` | **CRUD kategori:** hanya nama + deskripsi. Kategori baru otomatis muncul di filter katalog dan footer. |
| `src/pages/admin/AdminHeroSlides.jsx` | **CRUD slide beranda:** judul, gambar, teks & link tombol, urutan angka, toggle Aktif/Nonaktif. Ada panduan visual + pratinjau gambar langsung + validasi form. |
| `src/pages/admin/AdminBrandPartners.jsx` | **CRUD logo partner:** nama, logo (pilih via ImagePicker), link website opsional, urutan, toggle aktif. Hanya yang Aktif tampil di beranda. |
| `src/pages/admin/AdminMedia.jsx` | **Media Library:** upload gambar, tambah dari link, filter kategori, serta **filter status foto (digunakan vs belum digunakan)** lengkap dengan badge tempat foto tersebut dipakai. |
| `src/components/ui/ImagePicker.jsx` | **Jendela pilih gambar** 3 tab: dari Media Library, upload baru, atau tempel link. Dipakai di form brand partner & SEO. |

**Bagian kode penting — penjaga halaman admin (`AdminLayout.jsx`):**

```js
const { data: { session } } = await supabase.auth.getSession();
if (!session) {
  navigate('/admin', { replace: true });  // belum login → usir ke login
}
```

**Kemungkinan ditanya guru:** "Bagaimana kalau orang menebak alamat `/admin/products` langsung?" → Jawab: "Tetap ditolak, karena setiap halaman admin dibungkus penjaga ini. Tanpa sesi login, langsung dialihkan ke halaman login."

---

## 10. Fitur 7 — Pengaturan Situs (sistem draft–terbit)

**Tujuan:** Admin bisa mengubah tulisan/kontak/link website dengan aman — **salah ketik tidak langsung terlihat pengunjung**.

**Alur pengguna (4 langkah, hafalkan!):** Ubah isian → **Pratinjau** (cek di tab baru) → **Simpan Draft** (tersimpan, belum tampil) → **Terbitkan** (baru tampil ke pengunjung). Ada juga **Batalkan Perubahan** untuk mengembalikan isian.

**Cara kerjanya (analogi fotokopi):** Tabel `site_settings` hanya punya **1 baris** berisi 2 kolom: `draft` (konsep) dan `published` (yang ditempel di etalase). Website pengunjung selalu membaca kolom `published`. Tombol Terbitkan = menyalin `draft` ke `published`.

**File yang bertanggung jawab:**

| File | Fungsi sederhana |
|---|---|
| `src/pages/admin/AdminSettings.jsx` | **Form 5 tab:** Kontak & Jam Buka, Sosial Media, Navbar & Footer, Isi Beranda, SEO. Ada validasi (misal nomor WA harus angka) dan dialog konfirmasi saat Terbitkan. |
| `src/cms/SiteSettingsContext.jsx` | **Penyalur pengaturan ke seluruh website.** Dibaca sekali saat buka website, lalu dipakai navbar, footer, beranda, lokasi, drawer. Juga memasang warna, judul tab browser, dan SEO otomatis. |
| `src/cms/store.js` | **Tukang simpan.** Menyimpan ke Supabase jika online, atau ke browser jika database belum terhubung. |
| `src/cms/validate.js` | **Pemeriksa isian.** Email, nomor WA, link, warna, harga — dicek formatnya sebelum disimpan. |

**Bagian kode penting — fungsi Terbitkan (`SiteSettingsContext.jsx`):**

```js
const publish = async (draft) => {
  const next = { ...doc, draft, published: draft, ... }
  // draft disalin menjadi published → pengunjung melihat versi baru
}
```

**Kemungkinan ditanya guru:** "Kenapa perlu draft segala, langsung simpan saja?" → Jawab: "Supaya aman. Admin bisa salah ketik nomor WA atau menghapus link — kalau langsung tampil, pengunjung melihat kesalahan itu. Dengan draft + pratinjau, kesalahan bisa dicek dulu sebelum diterbitkan."

---

## 11. Potongan Kode yang Paling Mungkin Ditanyakan

Kumpulkan di sini supaya cepat dibuka saat guru bertanya. (Nomor baris sesuai kode saat ini.)

| # | Kalau guru tanya... | Buka file ini | Inti jawaban |
|---|---|---|---|
| 1 | "Routing-nya di mana?" | `src/App.jsx:24-56` | Daftar alamat: `/`, `/produk`, `/produk/:id`, `/lokasi`, `/admin`, `/admin/*`, dan 404. Tanda `*` di `path="*"` artinya "alamat apa pun selain yang di atas". |
| 2 | "Koneksi databasenya di mana?" | `src/lib/supabase.js` | Membuat client Supabase dari 2 kunci di file `.env`. Semua file yang butuh data mengimpor dari sini. |
| 3 | "Keranjang disimpan di mana?" | `src/components/CartContext.jsx:7-21` | Di `localStorage` browser (`banyu_cart`), bukan database. Makanya tetap ada setelah refresh. |
| 4 | "Total belanja dihitung bagaimana?" | `src/components/CartContext.jsx:56` | `reduce` = menjumlahkan satu per satu: harga × jumlah tiap item, lalu ditotal. |
| 5 | "Pesan WA-nya dibuat bagaimana?" | `src/components/ui/CartDrawer.jsx:11-27` | Teks disusun dari isi keranjang + total, ditempel ke `wa.me/NOMOR?text=PESAN`, dibuka di tab baru. |
| 6 | "Filter produk kerjanya bagaimana?" | `src/pages/ProductsPage.jsx:55-93` | Daftar disaring berurutan: pencarian → kategori → harga min → harga maks → diurutkan. |
| 7 | "Produk unggulan diambil bagaimana?" | `src/pages/HomePage.jsx:49-53` | Query: dari tabel `products`, yang `is_featured = true`, maksimal 4. |
| 8 | "Halaman admin dilindungi bagaimana?" | `src/components/AdminLayout/AdminLayout.jsx:13-24` | Dicek sesi login; tidak ada sesi → dialihkan ke `/admin` (login). |
| 9 | "Terbitkan itu ngapain?" | `src/cms/SiteSettingsContext.jsx:95-100` | Menyalin `draft` menjadi `published` + mencatat waktu terbit. |
| 10 | "Carousel berputar otomatis bagaimana?" | `src/components/HeroCarousel/HeroCarousel.jsx:52-61` | Timer 4 detik pindah slide; disentuh → jeda, 5 detik kemudian jalan lagi. |
| 11 | "Warna website diatur di mana?" | `src/cms/defaults.js:67-75` + `SiteSettingsContext.jsx:54-69` | Nilai warna disimpan di pengaturan, lalu dipasang sebagai variabel CSS (`--primary` dll) yang dipakai semua file CSS. |

---

## 12. Bank Pertanyaan Guru + Jawaban

Hafalkan yang bertanda ⭐ (paling sering ditanyakan).

**⭐ "Jelaskan project kamu."**
→ Pakai Penjelasan 1 Menit di Bagian 1.

**⭐ "Teknologi apa saja yang dipakai?"**
→ "Frontend React + Vite, routing React Router, database + login + penyimpanan foto pakai Supabase, styling CSS murni tanpa framework, deploy ke Netlify/Vercel. Total hanya 4 library utama."

**⭐ "Kenapa pakai Supabase, bukan bikin backend sendiri?"**
→ "Supabase sudah menyediakan database, login, dan penyimpanan foto yang siap pakai dan gratis. Membuat server sendiri butuh waktu lama dan ilmu yang lebih dalam — untuk skala toko lokal, Supabase sudah cukup dan aman karena ada aturan RLS."

**⭐ "Apa itu RLS?"**
→ "Row Level Security — aturan satpam di database. Di project saya: semua orang boleh membaca data produk, tapi hanya admin yang login boleh menambah, mengubah, dan menghapus."

**⭐ "Alur pemesanannya bagaimana?"**
→ "Pilih produk → masuk keranjang → buka drawer → klik Pesan via WhatsApp → chat terbuka berisi daftar + total → kirim → lanjut chat dengan admin toko. Tidak ada pembayaran di website."

**⭐ "Data keranjang disimpan di mana? Kenapa tidak hilang saat refresh?"**
→ "Di localStorage browser dengan kunci `banyu_cart`. Setiap isi berubah langsung dicatat, dan saat halaman dibuka catatannya dibaca lagi."

**⭐ "Bagaimana admin menambah produk?"**
→ "Login di `/admin` → menu Produk → Tambah Produk → isi nama, kategori, harga, stok, deskripsi, URL foto → Simpan. Produk langsung tampil di website. Foto diisi berupa link; tipsnya upload dulu ke Media Library lalu salin linknya."

**⭐ "Apa guna sistem draft dan terbit?"**
→ "Supaya perubahan dicek dulu sebelum dilihat pengunjung. Alurnya: ubah → Pratinjau → Simpan Draft → Terbitkan. Website pengunjung selalu membaca versi published."

**"Kenapa tidak ada pembayaran online?"**
→ "Keputusan disengaja sesuai PRD: targetnya pelanggan lokal yang nyaman via WhatsApp, menghindari komisi marketplace 15–20%, dan menghindari kerumitan payment gateway. Website fokus sebagai katalog + pemesanan."

**"Bagaimana filter tersinkron dengan URL?"**
→ "Setiap filter diubah, alamat URL ikut diubah (misal `?category=3`). Jadi link bisa dibagikan dan footer kategori langsung memfilter. Pakai `useSearchParams` dari React Router."

**"Apa itu komponen? Beri contoh."**
→ "Potongan tampilan yang dipakai ulang. Contoh `ProductCard` — satu file dipakai di beranda dan katalog, jadi kalau tampilannya diubah sekali, berubah di semua tempat."

**"Apa itu Context? Kenapa keranjang pakai Context?"**
→ "Tas data bersama yang bisa diambil halaman mana pun. Keranjang dipakai navbar (badge angka), kartu produk (tombol +), dan drawer (isi + total) — tanpa Context, datanya harus dioper manual satu per satu."

**"Tabel apa saja di database? Relasinya?"**
→ "8 tabel: categories, products, reviews (belum dipakai), banners, hero_slides, brand_partners, site_settings, media_library. Relasi utama: satu kategori punya banyak produk (`category_id`), satu produk bisa punya banyak review (`product_id`, ikut terhapus jika produk dihapus)."

**"Fitur apa yang belum selesai?"**
→ (Jujur itu nilai plus!) "Dua: tabel banner sudah bisa dikelola admin tapi belum ditampilkan di halaman publik, dan tabel review/ulasan sudah disiapkan tapi form ulasannya belum dibangun — direncanakan fase berikutnya."

**"Kalau produknya ribuan, filter di browser masih kuat?"**
→ "Untuk sekarang (puluhan–ratusan produk) masih ringan. Kalau sampai ribuan, filternya harus dipindah ke database dengan query + pagination server. Itu rencana pengembangan."

**"Siapa yang mengerjakan? Peranmu apa?"**
→ (Jawab jujur sesuai kenyataan — contoh:) "Project kelompok kelas XII RPL A. Saya mengerjakan [isi bagianmu sendiri]."

---

## 13. Skenario Demo Saat Presentasi

Lakukan urutan ini (total ±5 menit). Sambil klik, jelaskan dengan kalimat sendiri.

1. **Buka beranda** → "Ini beranda: slide otomatis, keunggulan, produk unggulan, marketplace, brand partner."
2. **Klik "Lihat Semua Produk"** → "Masuk katalog. Coba saya cari 'nugget'..." (ketik) → "Bisa filter kategori, harga, urutan, dan ada halaman 1-2-3."
3. **Klik satu produk** → "Halaman detail: galeri foto, stok, tab deskripsi/spesifikasi, tombol keranjang dan marketplace, produk terkait."
4. **Klik `+` / Tambah ke Keranjang** → tunjuk badge navbar bertambah + notifikasi → "Keranjang tersimpan di browser, tidak hilang walau di-refresh." (buktikan: tekan F5!)
5. **Buka drawer → Pesan via WhatsApp** → "Chat terbuka dengan pesanan sudah diketik otomatis." (tidak perlu benar-benar kirim)
6. **Buka `/lokasi`** → "Peta, jam buka, tombol WA/telepon, galeri toko."
7. **Buka `/admin`, login** → "Panel admin. Dashboard, tambah produk..." (tambah 1 produk contoh, lalu tunjukkan langsung muncul di katalog!)
8. **Pengaturan → ubah sesuatu → Pratinjau → Terbitkan** → "Perubahan teks tanpa coding, aman karena ada draft."
9. **Penutup:** "Kekurangannya: banner belum tampil publik dan ulasan belum dibangun — itu rencana fase berikutnya."

---

## 14. Kalimat Aman Jika Tidak Bisa Menjawab

Jangan mengarang! Pakai salah satu ini dengan tenang:

- "Untuk bagian itu saya belum mendalami, tapi cara kerjanya secara umum adalah [...]. Saya akan pelajari lebih lanjut setelah ini."
- "Itu di luar fokus yang saya kerjakan, tapi yang saya pahami [...]."
- "Boleh saya tunjukkan langsung di kodenya?" (lalu buka file dari Bagian 11 — menunjukkan kode selalu lebih baik daripada diam)

**Tips terakhir:** guru lebih menghargai jawaban jujur + bisa menunjukkan file/kodenya, daripada jawaban panjang tapi mengarang. Semangat! 🎓
