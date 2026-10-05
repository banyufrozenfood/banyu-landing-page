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
- [ ] Menu Home, Produk, Lokasi berfungsi
- [ ] Tombol WhatsApp di navbar membuka chat dengan nomor yang benar
- [ ] Ikon keranjang tampil — badge muncul setelah produk ditambahkan

---

## 3. Beranda (`/`)
- [ ] Hero carousel tampil dan berputar otomatis
- [ ] Tombol panah (‹ ›) dan dot di carousel berfungsi
- [ ] Tombol CTA carousel mengarah ke link yang benar
- [ ] Section keunggulan tampil
- [ ] Produk unggulan tampil (diambil dari Supabase)
- [ ] Tombol marketplace tampil hanya jika URL diisi di Settings — tersembunyi jika kosong
- [ ] Section brand partner tampil
- [ ] Footer tampil lengkap: deskripsi, navigasi, kontak, copyright

---

## 4. Katalog Produk (`/produk`)
- [ ] Daftar produk muncul (dari Supabase)
- [ ] Spinner/loading tampil saat data belum siap
- [ ] Filter kategori berfungsi — klik kategori memfilter produk
- [ ] Search berfungsi — ketik nama produk, hasil berubah
- [ ] Filter rentang harga berfungsi
- [ ] Sorting (terbaru, termurah, termahal) berfungsi
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
- [ ] Produk terkait tampil di bawah (jika ada di kategori yang sama)
- [ ] Tombol Back/breadcrumb berfungsi

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
- [ ] Peta Google Maps tampil
- [ ] Alamat, jam operasional, nomor telepon, WhatsApp tampil dari Settings

---

## 8. Panel Admin

### Login
- [ ] Halaman `/admin` tampil form login
- [ ] Login dengan email/password yang salah → muncul pesan error
- [ ] Login dengan kredensial benar → masuk ke dashboard

### Dashboard
- [ ] Angka produk, kategori, hero slide tampil

### Produk
- [ ] Daftar produk tampil
- [ ] Tambah produk baru → produk muncul di daftar dan di website
- [ ] Edit produk → perubahan tersimpan
- [ ] Hapus produk → produk hilang dari daftar dan website

### Kategori
- [ ] Tambah/edit/hapus kategori berfungsi
- [ ] Kategori baru muncul di filter halaman Produk

### Hero Carousel
- [ ] Tambah/edit/hapus slide berfungsi
- [ ] Slide aktif tampil di beranda

### Pengaturan
- [ ] Ubah nama toko → setelah Terbitkan, nama berubah di website
- [ ] Kosongkan URL Tokopedia → tombol Tokopedia hilang dari beranda
- [ ] Isi URL Tokopedia → tombol Tokopedia muncul kembali

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
