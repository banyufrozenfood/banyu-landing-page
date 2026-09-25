import logoLight from '../assets/banyu-logo.svg'
import logoWhite from '../assets/banyu-logo-white.svg'

export const DEFAULT_SETTINGS = {
  identity: {
    businessName: 'Banyu Frozen Food',
    logoUrl: logoLight,
    logoWhiteUrl: logoWhite,
    faviconUrl: '/favicon.svg',
  },
  contact: {
    whatsapp: '6281234567890',
    whatsappMessage: 'Halo Banyu, saya ingin bertanya tentang produk',
    phone: '(022) 123-4567',
    email: 'banyu.frozenfood@gmail.com',
    address: 'Jl. Raya Cimahi No. 123, Cimahi, Jawa Barat',
    addressFull:
      'Jl. Raya Cimahi No. 123, Kelurahan Cimahi Tengah, Kecamatan Cimahi Tengah, Kota Cimahi, Jawa Barat 40511',
    mapsUrl: 'https://www.google.com/maps/place/Cimahi,+Kota+Cimahi,+Jawa+Barat/',
    mapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31700.45!2d107.5302!3d-6.8841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e4b6a1b2c8e1%3A0x301576d14feb970!2sCimahi%2C+Kota+Cimahi%2C+Jawa+Barat!5e0!3m2!1sen!2sid!4v1695000000000',
    hours: [
      { id: 'h1', day: 'Senin — Jumat', time: '08.00 — 20.00 WIB' },
      { id: 'h2', day: 'Sabtu', time: '08.00 — 21.00 WIB' },
      { id: 'h3', day: 'Minggu', time: '09.00 — 18.00 WIB' },
    ],
  },
  socials: [
    { id: 's1', label: 'Instagram', icon: 'instagram', url: 'https://instagram.com' },
    { id: 's2', label: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com' },
    { id: 's3', label: 'Facebook', icon: 'facebook', url: 'https://facebook.com' },
  ],
  navbar: {
    ctaLabel: 'WhatsApp',
    menu: [
      { id: 'm1', label: 'Home', link: '/', visible: true },
      { id: 'm2', label: 'Produk', link: '/produk', visible: true },
      { id: 'm3', label: 'Lokasi', link: '/lokasi', visible: true },
    ],
  },
  footer: {
    description:
      'Toko frozen food berkualitas untuk keluarga Indonesia. Produk beku pilihan dengan bahan terbaik, diproses higienis.',
    creditNote: 'Project RPL — SMK Negeri 1 Cimahi',
  },
  home: {
    sections: {
      advantages: true,
      featured: true,
      marketplace: true,
      brandPartners: true,
    },
    marketplace: {
      tokopediaUrl: '#',
      shopeeUrl: '#',
    },
    advantagesTitle: 'Kenapa Pilih Banyu?',
    advantagesSubtitle: 'Kami berkomitmen memberikan produk frozen food terbaik untuk keluarga Anda',
    advantages: [
      { id: 'a1', icon: '❄️', title: 'Beku Segar', desc: 'Diproses dan dikemas vakum segera untuk menjaga kesegaran dan nutrisi produk.' },
      { id: 'a2', icon: '✅', title: 'Halal & Higienis', desc: 'Semua produk terjamin halal dan diproses dalam lingkungan yang higienis.' },
      { id: 'a3', icon: '🚚', title: 'Pengiriman Cepat', desc: 'Dikirim dengan packaging khusus frozen agar tetap beku sampai tujuan.' },
      { id: 'a4', icon: '💰', title: 'Harga Terjangkau', desc: 'Produk berkualitas dengan harga yang ramah di kantong keluarga Indonesia.' },
      { id: 'a5', icon: '⭐', title: 'Terpercaya', desc: 'Dipercaya ratusan pelanggan dengan rating rata-rata 4.5+ di marketplace.' },
    ],
  },
  appearance: {
    primary: '#0099FF',
    primaryDark: '#0077CC',
    primaryLight: '#E6F4FF',
    secondary: '#66CCFF',
    accent: '#FFD700',
    accentDark: '#E6C200',
    radius: 'md',
  },
  seo: {
    title: 'Banyu Frozen Food — Katalog Produk Frozen Food Berkualitas',
    description:
      'Banyu Frozen Food — Toko frozen food berkualitas untuk keluarga Indonesia. Lihat katalog produk kami dan pesan via Tokopedia, Shopee, atau WhatsApp.',
    ogImage: '',
  },
}

export const RADIUS_OPTIONS = [
  { value: 'sm', label: 'Lebih Kotak', radii: { sm: '4px', md: '6px', lg: '10px', xl: '16px' } },
  { value: 'md', label: 'Standar', radii: { sm: '6px', md: '10px', lg: '16px', xl: '24px' } },
  { value: 'lg', label: 'Lebih Membulat', radii: { sm: '10px', md: '16px', lg: '24px', xl: '32px' } },
]
