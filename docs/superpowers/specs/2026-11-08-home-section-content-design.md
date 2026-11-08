# Desain: Editor Konten Section Beranda

## Intent

Admin dapat mengelola teks dan item yang terlihat pada section Tentang, Kanal
Pemesanan, dan Lokasi Beranda tanpa coding. Pengalaman mengikuti editor CMS
yang sudah ada: toggle, field, dan `EditableList` untuk tambah, edit, hapus,
serta urutkan item.

## Scope

### Tambahan yang dikelola

- **Tentang Toko**
  - Tag kategori: tambah, edit, hapus, urutkan.
- **Kanal Pemesanan**
  - Kartu kanal: tambah, edit, hapus, urutkan, aktif/nonaktif.
  - Nama, icon/emoji, deskripsi, dan link.
  - WhatsApp tetap memakai nomor dan pesan otomatis dari tab Kontak.
  - Catatan sosial media dan catatan stok/ketersediaan.
- **Lokasi Beranda**
  - Label kecil, judul, judul area layanan, deskripsi area layanan.
  - Daftar area layanan: tambah, edit, hapus, urutkan.

Kontrol section yang sudah ada tetap dipakai untuk menampilkan atau
menyembunyikan Keunggulan, Tentang, Kanal Pemesanan, Brand Partner, dan Lokasi.

## Non-goals

- Tidak membuat page builder atau drag-and-drop layout.
- Tidak mengubah urutan antar-section beranda.
- Tidak mengubah alur order, cart, katalog, atau integrasi merchant.
- Tidak mengubah struktur tabel Supabase; data tambahan tetap berada di JSON
  `site_settings.draft` dan `site_settings.published`.
- Tidak menambah dependency.

## Data contract

Tambahkan default berikut di `DEFAULT_SETTINGS.home`:

```js
about: {
  tags: [
    { id: 't1', label: 'Frozen food' },
  ],
}
marketplace: {
  cards: [
    {
      id: 'c1',
      channel: 'gofood',
      label: 'GoFood',
      icon: '🛵',
      description: '...',
      url: 'https://...',
      enabled: true,
    },
  ],
  socialNote: 'Update stok & promo juga dibagikan di:',
  availabilityNote: 'Stok dan ketersediaan produk bisa berubah...',
}
location: {
  eyebrow: 'Lokasi Toko',
  title: 'Mampir ke Cigugur Tengah',
  serviceAreaTitle: 'Area Layanan',
  serviceAreaDescription: '...',
  serviceAreas: [
    { id: 'a1', text: 'Melayani Cimahi, Bandung, dan sekitarnya.' },
  ],
}
```

Existing `gofoodEnabled`, `grabmartEnabled`, `gofoodUrl`, dan `grabmartUrl`
remain supported as fallback for old saved settings. When `cards` is absent,
public rendering builds the three current cards from existing fields and the
WhatsApp contact. This prevents old drafts from losing visible content.

For cards with `channel: 'whatsapp'`, the public URL is always generated from
`contact.whatsapp` and `contact.whatsappMessage`; the stored `url` is ignored.
Other cards use stored `url`. Only known analytics channels (`whatsapp`,
`gofood`, `grabmart`) are tracked; custom cards still work as links without
inventing analytics categories.

## Admin UI

Keep all new controls in existing **Isi Beranda** tab:

```text
TENTANG TOKO
[judul] [pembuka] [deskripsi]
Sorotan Toko       + Tambah Sorotan
Tag Kategori       + Tambah Tag

KANAL PEMESANAN
[judul] [deskripsi]
Kartu Kanal        + Tambah Kartu
  [aktif] [nama] [channel] [icon] [deskripsi] [link]
[catatan sosial]
[catatan stok/ketersediaan]

LOKASI BERANDA
[label kecil] [judul]
[judul area layanan] [deskripsi area layanan]
Area Layanan       + Tambah Area
```

Use existing `EditableList`, `Field`, `Toggle`, and validation patterns. Keep
minimum touch target and responsive one-column behavior already used by admin.

## Public rendering

- `HomePage.jsx` reads configured tags instead of the hardcoded `ABOUT_TAGS`.
- Marketplace maps enabled configured cards. WhatsApp URL remains derived from
  contact. Empty cards are filtered so blank draft rows do not render.
- Location reads configured copy and service areas. Existing contact address,
  hours, Maps link, and WhatsApp CTA remain unchanged.
- Missing new values use current visible text as fallback, so partial old data
  remains readable.

## Validation

- Existing URL validation remains for marketplace URLs.
- New enabled non-WhatsApp card with a non-empty URL must use `http://` or
  `https://`.
- Blank labels/descriptions are allowed in draft but blank cards/areas/tags are
  not rendered publicly.
- Save, preview, publish, cancel, local fallback, and Supabase JSON persistence
  remain unchanged.

## Verification

- `node scripts/test-analytics.mjs`
- `npm run build`
- `npm run lint` exits 0 with existing warnings only.
- Manual check: add/edit/delete/reorder tags, cards, and service areas; toggle
  cards and section visibility; preview and cancel.
- Public check: old settings without new arrays still render current content;
  new settings render configured content without horizontal overflow at 390px.
