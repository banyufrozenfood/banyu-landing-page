import { isValidUrl } from './validate.js'

const DEFAULT_TAGS = [
  'Frozen food',
  'Makanan instan',
  'Sosis & bakso',
  'Camilan Korea',
  'Oleh-oleh Cianjur',
]

const DEFAULT_CARDS = [
  {
    id: 'c1', channel: 'gofood', label: 'GoFood', icon: '🛵',
    description: 'Cari Banyu Frozen Food di GoFood area Bandung. Pesan makanan favoritmu langsung dari aplikasi.',
    enabled: true, url: 'https://gofood.co.id/bandung',
  },
  {
    id: 'c2', channel: 'grabmart', label: 'GrabMart', icon: '🛒',
    description: 'Cari “Banyu Frozen Food - Cigugur Tengah” di kategori Meat & Frozen. Cek promo diskon ongkir di aplikasi.',
    enabled: true, url: 'https://food.grab.com/id/en/',
  },
  {
    id: 'c3', channel: 'whatsapp', label: 'WhatsApp', icon: '💬',
    description: 'Tanya stok terbaru, harga, atau pesan langsung. Cocok untuk konfirmasi item yang sedang kosong.',
    enabled: true, url: '',
  },
]

// Logo resmi kanal pemesanan. Taruh file di public/logos/<channel>.svg sesuai
// nama channel yang dipakai CMS. Selama file belum ada, kartu otomatis kembali
// memakai emoji dari field `icon` supaya tampilan tidak rusak.
const CHANNEL_LOGOS = {
  gofood: '/logos/gofood.svg',
  grabmart: '/logos/grabmart.svg',
  whatsapp: '/logos/whatsapp.svg',
  shopee: '/logos/shopee.svg',
  tokopedia: '/logos/tokopedia.svg',
}

export function getChannelLogo(channel) {
  return CHANNEL_LOGOS[channel] || ''
}

const DEFAULT_LOCATION = {
  eyebrow: 'Lokasi Toko',
  title: 'Mampir ke Cigugur Tengah',
  serviceAreaTitle: 'Area Layanan',
  serviceAreaDescription: 'Melayani Cimahi, Bandung, dan sekitarnya melalui aplikasi pesan antar dan WhatsApp.',
  serviceAreas: [
    'GoFood — area Bandung',
    'GrabMart — Banyu Frozen Food - Cigugur Tengah',
    'WhatsApp — tanya stok & pesan langsung',
  ],
}

const DEFAULT_CTA = { text: 'Cara Pesan', link: '/#cara-pesan' }

export const DEFAULT_CTA_TEXT = DEFAULT_CTA.text
export const DEFAULT_CTA_LINK = DEFAULT_CTA.link

// Slide lama di database masih menyimpan tautan ke halaman yang sudah dihapus.
// Arahkan ulang agar pengunjung tidak mendarat di 404.
const LEGACY_CTA_LINKS = {
  '/lokasi': '/#lokasi',
}

export function normalizeCtaLink(link) {
  const clean = typeof link === 'string' ? link.trim() : ''
  if (!clean) return DEFAULT_CTA_LINK
  if (clean === '/produk' || clean.startsWith('/produk/') || clean.startsWith('/produk?')) {
    return DEFAULT_CTA_LINK
  }
  return LEGACY_CTA_LINKS[clean] || clean
}

export function normalizeHeroSlide(slide) {
  return {
    ...slide,
    cta: {
      text: slide?.cta?.text || DEFAULT_CTA_TEXT,
      link: normalizeCtaLink(slide?.cta?.link),
    },
  }
}

// Dipakai HeroCarousel dan HomePage saat Supabase belum mengembalikan slide.
export const DEFAULT_HERO_SLIDES = [
  {
    id: 'default-1',
    title: 'Stok Makanan Praktis',
    subtitle: 'Banyu Frozen Food • Cigugur Tengah',
    description: 'Sosis, nugget, kornet, camilan Korea, sampai abon khas Cianjur. Harga Rp10.000–Rp49.000 per item.',
    image: '',
    cta: { ...DEFAULT_CTA },
  },
  {
    id: 'default-2',
    title: 'Pesan Antar GoFood & GrabMart',
    subtitle: 'Cari Banyu Frozen Food',
    description: 'GoFood area Bandung dan GrabMart dengan nama Banyu Frozen Food - Cigugur Tengah.',
    image: '',
    cta: { ...DEFAULT_CTA },
  },
  {
    id: 'default-3',
    title: 'Oleh-oleh Khas Cianjur',
    subtitle: 'Abon & Gepuk Karwati',
    description: 'Abon sapi, abon pedas, dan gepuk kering — cocok untuk oleh-oleh atau stok lauk praktis.',
    image: '',
    cta: { ...DEFAULT_CTA },
  },
]

// Dipakai galeri toko saat belum ada foto yang diunggah lewat panel admin.
export const DEFAULT_STORE_PHOTOS = [
  { src: 'https://placehold.co/600x400/0099FF/white?text=Tampak+Depan+Toko', alt: 'Tampak depan toko Banyu' },
  { src: 'https://placehold.co/600x400/66CCFF/white?text=Interior+Toko', alt: 'Interior toko Banyu' },
  { src: 'https://placehold.co/600x400/0077CC/white?text=Rak+Produk', alt: 'Rak produk frozen food' },
  { src: 'https://placehold.co/600x400/0099FF/FFFFFF?text=Area+Freezer', alt: 'Area freezer toko' },
]

// Urutan prioritas foto galeri: pengaturan Location Gallery di CMS, lalu media
// library kategori "toko", terakhir placeholder bawaan. Dipakai galeri di
// beranda sekaligus memudahkan pengujian.
export function getStorePhotos(settings = {}, mediaItems = []) {
  const gallery = settings?.locationGallery || {}
  const configured = Array.isArray(gallery.items)
    ? gallery.items
      .filter((item) => item?.image)
      .map((item) => ({ src: item.image, alt: item.label || 'Galeri toko' }))
    : []
  if (configured.length > 0) return configured

  const fromMedia = (Array.isArray(mediaItems) ? mediaItems : [])
    .filter((item) => item?.category === 'toko' && item?.url)
    .map((item) => ({ src: item.url, alt: item.name || 'Foto toko' }))
  return fromMedia.length > 0 ? fromMedia : DEFAULT_STORE_PHOTOS
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim()
}

export function getAboutTags(home = {}) {
  const source = Array.isArray(home.about?.tags) ? home.about.tags : DEFAULT_TAGS.map((label, index) => ({ id: `t${index + 1}`, label }))
  return source.map((item, index) => ({
    id: typeof item === 'string' ? `tag-${index}` : (item?.id || `tag-${index}`),
    label: typeof item === 'string' ? item : item?.label,
  })).filter((item) => nonEmpty(item.label)).map((item) => ({ ...item, label: item.label.trim() }))
}

export function getMarketplaceCards(home = {}) {
  if (Array.isArray(home.marketplace?.cards)) {
    const marketplace = home.marketplace
    return home.marketplace.cards
      .filter((card) => nonEmpty(card?.label))
      .filter((card) => card.channel !== 'gofood' || marketplace.gofoodEnabled !== false || card.url !== DEFAULT_CARDS[0].url)
      .filter((card) => card.channel !== 'grabmart' || marketplace.grabmartEnabled !== false || card.url !== DEFAULT_CARDS[1].url)
      .map((card) => ({
        ...card,
        label: card.label.trim(),
        logo: getChannelLogo(card.channel),
        url: ['gofood', 'grabmart'].includes(card.channel) && marketplace[`${card.channel}Url`] && card.url === DEFAULT_CARDS.find((item) => item.channel === card.channel)?.url
          ? marketplace[`${card.channel}Url`]
          : card.url,
      }))
  }

  const marketplace = home.marketplace || {}
  return DEFAULT_CARDS
    .filter((card) => card.channel === 'whatsapp' || marketplace[`${card.channel}Enabled`] !== false)
    .map((card) => ({ ...card, logo: getChannelLogo(card.channel), url: marketplace[`${card.channel}Url`] || card.url }))
}

export function getHomeLocation(home = {}) {
  const location = home.location || {}
  const configuredAreas = Array.isArray(location.serviceAreas)
    ? location.serviceAreas.map((item) => typeof item === 'string' ? item : item?.text).filter(nonEmpty).map((item) => item.trim())
    : []
  return {
    eyebrow: nonEmpty(location.eyebrow) ? location.eyebrow.trim() : DEFAULT_LOCATION.eyebrow,
    title: nonEmpty(location.title) ? location.title.trim() : DEFAULT_LOCATION.title,
    serviceAreaTitle: nonEmpty(location.serviceAreaTitle) ? location.serviceAreaTitle.trim() : DEFAULT_LOCATION.serviceAreaTitle,
    serviceAreaDescription: nonEmpty(location.serviceAreaDescription) ? location.serviceAreaDescription.trim() : DEFAULT_LOCATION.serviceAreaDescription,
    serviceAreas: configuredAreas.length > 0 ? configuredAreas : DEFAULT_LOCATION.serviceAreas,
  }
}

export function validateMarketplaceCards(cards = []) {
  return cards.flatMap((card, index) => {
    if (!nonEmpty(card?.label) || card?.enabled === false || card?.channel === 'whatsapp') return []
    return card?.url && isValidUrl(card.url) ? [] : [`marketplace.cards.${index}.url`]
  })
}

export { DEFAULT_CARDS, DEFAULT_LOCATION, DEFAULT_TAGS, CHANNEL_LOGOS }