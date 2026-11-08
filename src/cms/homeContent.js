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
        url: ['gofood', 'grabmart'].includes(card.channel) && marketplace[`${card.channel}Url`] && card.url === DEFAULT_CARDS.find((item) => item.channel === card.channel)?.url
          ? marketplace[`${card.channel}Url`]
          : card.url,
      }))
  }

  const marketplace = home.marketplace || {}
  return DEFAULT_CARDS
    .filter((card) => card.channel === 'whatsapp' || marketplace[`${card.channel}Enabled`] !== false)
    .map((card) => ({ ...card, url: marketplace[`${card.channel}Url`] || card.url }))
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

export { DEFAULT_CARDS, DEFAULT_LOCATION, DEFAULT_TAGS }
