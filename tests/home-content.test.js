import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import {
  CHANNEL_LOGOS,
  DEFAULT_STORE_PHOTOS,
  getAboutTags,
  getChannelLogo,
  getMarketplaceCards,
  getHomeLocation,
  getStorePhotos,
  validateMarketplaceCards,
} from '../src/cms/homeContent.js'

const legacyHome = {
  about: {},
  marketplace: {
    gofoodEnabled: true,
    grabmartEnabled: true,
    gofoodUrl: 'https://gofood.example/store',
    grabmartUrl: 'https://grab.example/store',
  },
}

assert.deepEqual(getAboutTags(legacyHome).map((item) => item.label), [
  'Frozen food',
  'Makanan instan',
  'Sosis & bakso',
  'Camilan Korea',
  'Oleh-oleh Cianjur',
])

const legacyCards = getMarketplaceCards(legacyHome)
assert.deepEqual(legacyCards.map(({ channel, label, url, enabled }) => ({ channel, label, url, enabled })), [
  { channel: 'gofood', label: 'GoFood', url: 'https://gofood.example/store', enabled: true },
  { channel: 'grabmart', label: 'GrabMart', url: 'https://grab.example/store', enabled: true },
  { channel: 'whatsapp', label: 'WhatsApp', url: '', enabled: true },
])

const mergedLegacyCards = getMarketplaceCards({
  ...legacyHome,
  marketplace: {
    ...legacyHome.marketplace,
    cards: [
      { id: 'c1', channel: 'gofood', label: 'GoFood', icon: '🛵', description: 'Cari Banyu Frozen Food di GoFood area Bandung. Pesan makanan favoritmu langsung dari aplikasi.', enabled: true, url: 'https://gofood.co.id/bandung' },
      { id: 'c2', channel: 'grabmart', label: 'GrabMart', icon: '🛒', description: 'Cari “Banyu Frozen Food - Cigugur Tengah” di kategori Meat & Frozen. Cek promo diskon ongkir di aplikasi.', enabled: true, url: 'https://food.grab.com/id/en/' },
      { id: 'c3', channel: 'whatsapp', label: 'WhatsApp', icon: '💬', description: 'Tanya stok terbaru, harga, atau pesan langsung. Cocok untuk konfirmasi item yang sedang kosong.', enabled: true, url: '' },
    ],
  },
})
assert.equal(mergedLegacyCards[0].url, 'https://gofood.example/store')
assert.equal(mergedLegacyCards[1].url, 'https://grab.example/store')
assert.equal(getMarketplaceCards({ marketplace: { cards: [
  { ...mergedLegacyCards[0], url: 'https://gofood.co.id/bandung' },
  mergedLegacyCards[1],
  mergedLegacyCards[2],
], gofoodEnabled: false } }).some((card) => card.channel === 'gofood'), false)

const configuredHome = {
  about: { tags: [{ id: 't1', label: 'Tag baru' }, { id: 't2', label: '  ' }, null] },
  marketplace: {
    cards: [
      { id: 'c1', channel: 'gofood', label: 'Toko GoFood', enabled: true, url: 'https://example.com' },
      { id: 'c2', channel: 'grabmart', label: 'Nonaktif', enabled: false, url: 'https://example.com' },
      { id: 'c3', channel: 'custom', label: '', enabled: true, url: 'https://example.com' },
    ],
  },
  location: { title: 'Judul baru', serviceAreas: [{ id: 'a1', text: 'Cimahi' }, { id: 'a2', text: ' ' }] },
}

assert.deepEqual(getAboutTags(configuredHome).map((item) => item.label), ['Tag baru'])
assert.deepEqual(getAboutTags({ about: { tags: [{ id: 'same-1', label: 'Tag sama' }, { id: 'same-2', label: 'Tag sama' }] } }).map((item) => item.id), ['same-1', 'same-2'])
assert.equal(getMarketplaceCards(configuredHome).length, 2)
assert.deepEqual(getHomeLocation(configuredHome), {
  eyebrow: 'Lokasi Toko',
  title: 'Judul baru',
  serviceAreaTitle: 'Area Layanan',
  serviceAreaDescription: 'Melayani Cimahi, Bandung, dan sekitarnya melalui aplikasi pesan antar dan WhatsApp.',
  serviceAreas: ['Cimahi'],
})
assert.equal(getHomeLocation({ location: { serviceAreas: [] } }).serviceAreas.length, 3)

const renderedCards = getMarketplaceCards(configuredHome)
  .filter((card) => card.enabled !== false)
  .map((card) => ({ ...card, url: card.channel === 'whatsapp' ? 'https://wa.me/6281234567890' : card.url }))
  .filter((card) => card.url)
assert.equal(renderedCards.length, 1)
assert.equal(renderedCards[0].url, 'https://example.com')

assert.deepEqual(validateMarketplaceCards([
  { channel: 'gofood', label: 'GoFood', enabled: true, url: 'not-a-url' },
  { channel: 'grabmart', label: 'GrabMart', enabled: false, url: 'not-a-url' },
  { channel: 'whatsapp', label: 'WhatsApp', enabled: true, url: '' },
  { channel: 'custom', enabled: true, label: ' ', url: 'not-a-url' },
]), ['marketplace.cards.0.url'])

// Setiap kanal resmi dipetakan ke file logo di public/logos/. Kanal yang tidak
// dikenal tidak boleh memaksa render gambar (biar emoji CMS yang dipakai).
assert.equal(getChannelLogo('gofood'), '/logos/gofood.svg')
assert.equal(getChannelLogo('grabmart'), '/logos/grabmart.svg')
assert.equal(getChannelLogo('whatsapp'), '/logos/whatsapp.svg')
assert.equal(getChannelLogo('shopee'), '/logos/shopee.svg')
assert.equal(getChannelLogo('tokopedia'), '/logos/tokopedia.svg')
assert.equal(getChannelLogo('custom'), '')
assert.equal(getChannelLogo(undefined), '')

// Setiap channel yang dipetakan harus benar-benar punya file di public/logos/.
// Ini mencegah kartu diam-diam kembali ke emoji karena nama file salah.
for (const [channel, path] of Object.entries(CHANNEL_LOGOS)) {
  const file = new URL(`../public${path}`, import.meta.url)
  assert.ok(existsSync(file), `Logo untuk "${channel}" tidak ditemukan: public${path}`)
}

// Kartu hasil resolver harus membawa field logo supaya view tinggal memakai.
assert.ok(legacyCards.every((card) => card.logo.startsWith('/logos/')))
assert.equal(legacyCards.find((card) => card.channel === 'whatsapp').logo, '/logos/whatsapp.svg')

const customCards = getMarketplaceCards({ marketplace: { cards: [{ channel: 'custom', label: 'Toko A', url: 'https://a.example' }] } })
assert.equal(customCards[0].logo, '')

// Foto galeri: pengaturan CMS menang atas media library, media library menang
// atas placeholder. Item tanpa gambar/hasil harus dilewati.
const configuredPhotos = getStorePhotos(
  { locationGallery: { items: [{ image: 'https://img.example/1.jpg', label: 'Depan' }, { label: 'Tanpa gambar' }] } },
  [{ category: 'toko', url: 'https://img.example/media.jpg', name: 'Media' }],
)
assert.deepEqual(configuredPhotos, [{ src: 'https://img.example/1.jpg', alt: 'Depan' }])

const mediaPhotos = getStorePhotos({ locationGallery: { items: [] } }, [
  { category: 'toko', url: 'https://img.example/media.jpg', name: 'Media Toko' },
  { category: 'produk', url: 'https://img.example/produk.jpg', name: 'Produk' },
  { category: 'toko' },
])
assert.deepEqual(mediaPhotos, [{ src: 'https://img.example/media.jpg', alt: 'Media Toko' }])

assert.equal(getStorePhotos(), DEFAULT_STORE_PHOTOS)
assert.equal(getStorePhotos({}, []), DEFAULT_STORE_PHOTOS)

console.log('home content helpers: ok')
