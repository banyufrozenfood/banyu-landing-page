import assert from 'node:assert/strict'
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_STORE_PHOTOS,
  normalizeCtaLink,
  normalizeHeroSlide,
  getAboutTags,
  getHomeLocation,
  getMarketplaceCards,
  validateMarketplaceCards,
} from '../src/cms/homeContent.js'

// Fallback hero dipakai HeroCarousel dan HomePage. Keduanya harus mendapat
// objek yang sama supaya tidak ada dua sumber kebenaran.
assert.equal(DEFAULT_HERO_SLIDES.length, 3)
assert.ok(DEFAULT_HERO_SLIDES.every((slide) => slide.id && slide.title && slide.cta?.link))
assert.ok(DEFAULT_HERO_SLIDES.every((slide) => slide.cta.link === '/#cara-pesan'))

// Setiap slide harus punya objek cta sendiri, bukan berbagi referensi yang sama,
// agar kustomisasi di satu tempat tidak bocor ke slide lain.
const links = new Set(DEFAULT_HERO_SLIDES.map((slide) => slide.cta))
assert.equal(links.size, DEFAULT_HERO_SLIDES.length)

const immutableSnapshot = JSON.stringify(DEFAULT_HERO_SLIDES)
const firstSlideCta = DEFAULT_HERO_SLIDES[0].cta
firstSlideCta.link = '/diubah'
assert.equal(DEFAULT_HERO_SLIDES[1].cta.link, '/#cara-pesan')
firstSlideCta.link = '/#cara-pesan'
assert.equal(JSON.stringify(DEFAULT_HERO_SLIDES), immutableSnapshot)

// Fallback galeri dipakai LocationSection di beranda.
assert.equal(DEFAULT_STORE_PHOTOS.length, 4)
assert.ok(DEFAULT_STORE_PHOTOS.every((photo) => photo.src.startsWith('https://') && photo.alt))
const srcs = new Set(DEFAULT_STORE_PHOTOS.map((photo) => photo.src))
assert.equal(srcs.size, DEFAULT_STORE_PHOTOS.length)

// Helper lama harus tetap memberi default saat settings kosong.
assert.equal(getAboutTags({}).length, 5)
assert.equal(getMarketplaceCards({}).length, 3)
assert.equal(getHomeLocation({}).serviceAreas.length, 3)
assert.deepEqual(validateMarketplaceCards([]), [])

// Tautan lama dari database tidak boleh menghasilkan 404.
assert.equal(normalizeCtaLink('/produk'), '/#cara-pesan')
assert.equal(normalizeCtaLink('/produk/12'), '/#cara-pesan')
assert.equal(normalizeCtaLink('/produk?kategori=frozen'), '/#cara-pesan')
assert.equal(normalizeCtaLink('/lokasi'), '/#lokasi')
assert.equal(normalizeCtaLink('  /lokasi  '), '/#lokasi')

// Tautan yang masih valid dipertahankan apa adanya.
assert.equal(normalizeCtaLink('/#cara-pesan'), '/#cara-pesan')
assert.equal(normalizeCtaLink('https://wa.me/6281234567890'), 'https://wa.me/6281234567890')

// Input kosong atau bukan string jatuh ke default.
assert.equal(normalizeCtaLink(''), '/#cara-pesan')
assert.equal(normalizeCtaLink('   '), '/#cara-pesan')
assert.equal(normalizeCtaLink(null), '/#cara-pesan')
assert.equal(normalizeCtaLink(undefined), '/#cara-pesan')

// normalizeHeroSlide mengisi teks CTA default tanpa merusak data lain.
const normalized = normalizeHeroSlide({ id: 'x', title: 'Judul', cta: { link: '/produk' } })
assert.equal(normalized.id, 'x')
assert.equal(normalized.title, 'Judul')
assert.equal(normalized.cta.text, 'Cara Pesan')
assert.equal(normalized.cta.link, '/#cara-pesan')
assert.equal(normalizeHeroSlide({}).cta.link, '/#cara-pesan')

console.log('shared fallback content: ok')
