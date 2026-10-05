# Checklist Testing — Banyu Frozen Food

Panduan uji manual sebelum presentasi atau deploy.

Cara pakai:
1. Jalankan `npm run dev`, buka `http://localhost:5173`
2. Buka DevTools (F12) → tab **Console** — tidak boleh ada error merah selama pengujian
3. Centang tiap item setelah dicek

---

## 1. Persiapan
- [ ] `npm run dev` berjalan tanpa error kompilasi
- [ ] `npm run build` sukses tanpa error
- [ ] Halaman `/` terbuka dan tidak blank

---

## 2. Navbar & Global
- [ ] Logo tampil, klik → kembali ke beranda
- [ ] Menu Home, Produk, Lokasi berfungsi (diambil dari CMS Settings)
- [ ] Ikon keranjang tampil — klik membuka drawer, badge muncul setelah produk ditambahkan
- [ ] Di mobile: hamburger membuka/menutup menu

---

## 3. Beranda (`/`)
- [ ] Hero carousel tampil dan berputar otomatis
- [ ] Tombol panah (‹ ›) dan dot di carousel berfungsi
- [ ] Tombol CTA carousel mengarah ke link yang benar
- [ ] Section keunggulan tampil
- [ ] Produk unggulan tampil (diambil dari Supabase)
- [ ] Tombol marketplace tampil hanya jika URL diisi di Settings — tersembunyi jika kosong
- [ ] Section brand partner tampil (hanya logo yang berstatus Aktif)
- [ ] Footer tampil: deskripsi, navigasi, kategori (otomatis dari database), kontak, sosmed, copyright
- [ ] Toggle section di Pengaturan → Isi Beranda menyembunyikan/menampilkan section beranda setelah Terbitkan

---

## 4. Katalog Produk (`/produk`)
- [ ] Daftar produk muncul (dari Supabase)
- [ ] Spinner/loading tampil saat data belum siap
- [ ] Filter kategori berfungsi — klik kategori memfilter produk
- [ ] Search berfungsi — ketik nama produk, hasil berubah
- [ ] Filter rentang harga berfungsi — isi min/maks lalu klik Terapkan
- [ ] Sorting (terbaru, termurah, termahal) berfungsi
- [ ] Filter tersimpan di URL — klik kategori dari footer langsung memfilter walau halaman sudah terbuka
- [ ] Pagination berfungsi — halaman berikutnya menampilkan produk berbeda
- [ ] Tombol "+" di setiap produk menambah ke keranjang + notifikasi toast muncul
- [ ] Klik kartu produk → masuk ke halaman detail produk

---

## 5. Detail Produk (`/produk/:id`)
- [ ] Data produk tampil: nama, harga, stok, deskripsi
- [ ] Galeri foto tampil — klik thumbnail mengubah foto utama
- [ ] Produk tanpa foto tidak crash (tampilkan placeholder)
- [ ] Tab Spesifikasi berfungsi — tidak crash jika spesifikasi kosong
- [ ] Tombol "Tambah ke Keranjang" bekerja + toast muncul
- [ ] Tombol Tokopedia/Shopee tampil jika URL diisi di Pengaturan, tersembunyi jika kosong
- [ ] Produk terkait tampil di bawah (maks 4, kategori yang sama)
- [ ] Breadcrumb Home / Produk / nama produk berfungsi
- [ ] Buka ID produk yang tidak ada → tampil "Produk Tidak Ditemukan", bukan crash

---

## 6. Keranjang Belanja
- [ ] Klik ikon keranjang → drawer terbuka dari kanan
- [ ] Item yang ditambahkan tampil dengan nama, jumlah, harga
- [ ] Tombol (+) dan (−) mengubah jumlah
- [ ] Tombol hapus (✕) menghapus item
- [ ] Total harga berubah sesuai isi keranjang
- [ ] Keranjang tidak kosong setelah refresh halaman (tersimpan di localStorage)
- [ ] Tombol "Pesan via WhatsApp" membuka chat WA dengan pesan otomatis berisi daftar item + total
- [ ] Keranjang kosong menampilkan pesan "Keranjang Anda kosong"

---

## 7. Halaman Lokasi (`/lokasi`)
- [ ] Peta Google Maps tampil + tombol "Buka di Google Maps" membuka link yang benar
- [ ] Alamat lengkap, jam operasional, nomor telepon, email tampil dari Settings
- [ ] Tombol "Hubungi via WhatsApp" membuka chat dengan pesan otomatis; "Telepon Langsung" memanggil nomor toko
- [ ] Galeri toko tampil (dari Media Library kategori Foto Toko)

---

## 8. Panel Admin

### Login
- [ ] Halaman `/admin` tampil form login
- [ ] Login dengan email/password yang salah → muncul pesan error
- [ ] Login dengan kredensial benar → masuk ke dashboard

### Dashboard
- [ ] Angka Total Produk dan Kategori tampil
- [ ] Status website tampil (Published / Ada draft belum terbit) + tanggal simpan & terbit
- [ ] Kartu panduan tampil saat pertama kali (bisa ditutup)

### Produk
- [ ] Daftar produk tampil + pencarian nama berfungsi
- [ ] Tambah produk baru → produk muncul di daftar dan di website
- [ ] Slug terisi otomatis dari nama (bisa diubah manual)
- [ ] Edit produk → perubahan tersimpan
- [ ] Hapus produk → konfirmasi muncul, produk hilang dari daftar dan website

### Kategori
- [ ] Tambah/edit/hapus kategori (nama + deskripsi) berfungsi
- [ ] Kategori baru muncul di filter halaman Produk dan footer

### Hero Carousel
- [ ] Tambah/edit/hapus slide berfungsi (judul, gambar, teks & link tombol wajib diisi)
- [ ] Toggle Aktif/Nonaktif berfungsi — slide nonaktif tidak tampil di beranda
- [ ] Urutan angka terkecil tampil pertama

### Banner
- [ ] Tambah/edit/hapus banner berfungsi (data tersimpan; banner belum tampil di halaman publik)

### Brand Partner
- [ ] Tambah/edit/hapus partner + toggle aktif berfungsi
- [ ] Logo aktif tampil di beranda; klik logo membuka website partner (jika URL diisi)

### Media Library
- [ ] Upload gambar (PNG/JPG/WebP/SVG/GIF) dan tambah dari link berfungsi
- [ ] Filter kategori (Gambar/Logo/Banner/Foto Toko) dan pencarian berfungsi
- [ ] Tombol salin link (🔗) menyalin URL gambar
- [ ] Hapus gambar menampilkan dialog konfirmasi

### Pengaturan
- [ ] 5 tab tampil: Kontak & Jam Buka, Sosial Media, Navbar & Footer, Isi Beranda, SEO
- [ ] Ubah teks footer → setelah Terbitkan, teks berubah di website
- [ ] Kosongkan URL Tokopedia → tombol Tokopedia hilang dari beranda dan halaman detail
- [ ] Alur Pratinjau → Simpan Draft → Terbitkan berfungsi; Batalkan Perubahan mengembalikan isian
- [ ] Isian salah (mis. nomor WA bukan angka) menampilkan pesan error merah

---

## 9. Responsivitas
- [ ] Beranda tampil baik di mobile (lebar < 480px)
- [ ] Navbar berubah menjadi menu hamburger di mobile
- [ ] Halaman produk: filter mobile bisa dibuka dan ditutup
- [ ] Keranjang drawer tampil penuh di mobile
- [ ] Detail produk tampil satu kolom di mobile

---

## 10. Halaman Error
- [ ] Akses URL yang tidak ada (misal `/abc`) → halaman 404 tampil, bukan blank
