import logoLight from '../assets/banyu-logo.svg'
import logoWhite from '../assets/banyu-logo-white.svg'

export const NAV_MENU = [
  { id: 'm1', label: 'Beranda', link: '/' },
  { id: 'm2', label: 'Tentang', link: '/#tentang' },
  { id: 'm3', label: 'Cara Pesan', link: '/#cara-pesan' },
  { id: 'm4', label: 'Lokasi', link: '/#lokasi' },
]

export const DEFAULT_SETTINGS = {
  identity: {
    businessName: 'Banyu Frozen Food',
    logoUrl: logoLight,
    logoWhiteUrl: logoWhite,
    faviconUrl: '/favicon.svg',
  },
  contact: {
    whatsapp: '6281234567890',
    whatsappMessage: 'Halo Banyu Frozen Food, saya mau tanya stok dan cara pesan.',
    phone: '',
    email: '',
    address: 'Cigugur Tengah, Cimahi Tengah, Kota Cimahi',
    addressFull:
      'Kawasan Cigugur Tengah, Kecamatan Cimahi Tengah, Kota Cimahi, Jawa Barat — berbatasan dengan Kota Bandung.',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Banyu+Frozen+Food+Cigugur+Tengah+Cimahi',
    mapsEmbed:
      'https://maps.google.com/maps?q=Banyu%20Frozen%20Food%20Cigugur%20Tengah%20Cimahi&t=&z=15&ie=UTF8&iwloc=&output=embed',
    hours: [
      { id: 'h1', day: 'Senin — Jumat', time: '08.00 — 20.00 WIB' },
      { id: 'h2', day: 'Sabtu', time: '08.00 — 21.00 WIB' },
      { id: 'h3', day: 'Minggu', time: '09.00 — 18.00 WIB' },
    ],
  },
  socials: [
    { id: 's1', label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/banyufrozenfood_03' },
    { id: 's2', label: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/@banyu_frozen' },
  ],
  navbar: {
    ctaLabel: 'Pesan Sekarang',
    menu: NAV_MENU,
  },
  footer: {
    description:
      'Toko frozen food UMKM di Cigugur Tengah, Cimahi. Menyediakan makanan instan, frozen food, sosis, camilan Korea, dan oleh-oleh khas Cianjur. Pesan via GoFood, GrabMart, atau WhatsApp.',
    creditNote: 'Project RPL — SMK Negeri 1 Cimahi',
  },
  locationGallery: {
    visible: true,
    title: 'Galeri Toko Kami',
    subtitle: 'Lihat suasana toko Banyu Frozen Food',
    items: [
      { id: 'g1', image: 'https://placehold.co/600x400/0099FF/white?text=Tampak+Depan+Toko', label: 'Tampak depan toko Banyu' },
      { id: 'g2', image: 'https://placehold.co/600x400/66CCFF/white?text=Interior+Toko', label: 'Interior toko Banyu' },
      { id: 'g3', image: 'https://placehold.co/600x400/0077CC/white?text=Rak+Produk', label: 'Rak produk frozen food' },
      { id: 'g4', image: 'https://placehold.co/600x400/0099FF/FFFFFF?text=Area+Freezer', label: 'Area freezer toko' },
    ],
  },
  home: {
    sections: {
      advantages: true,
      about: true,
      marketplace: true,
      brandPartners: true,
      location: true,
    },
    about: {
      title: 'Toko Frozen Food Praktis di Cigugur Tengah',
      subtitle:
        'Banyu Frozen Food adalah toko frozen food skala UMKM di kawasan Cigugur Tengah, Cimahi Tengah — berbatasan dengan Kota Bandung.',
      text:
        'Kami menjual ulang produk dari berbagai merek, bukan memproduksi sendiri. Isinya campuran produk beku dan kering siap santap: makanan instan, frozen food, aneka sosis bakar, produk Cedea dan So Good, saus, camilan Korea seperti Tapokki dan Rabokki, serta oleh-oleh khas Cianjur seperti abon sapi, abon pedas, dan gepuk kering Karwati. Harga per item berkisar Rp10.000–Rp49.000. Cocok untuk rumah tangga, anak kos, pekerja, dan pembeli oleh-oleh.',
      highlights: [
        { id: 'h1', label: 'Lokasi', value: 'Cigugur Tengah, Cimahi' },
        { id: 'h2', label: 'Harga', value: 'Rp10.000 – Rp49.000' },
        { id: 'h3', label: 'Pemesanan', value: 'GoFood, GrabMart, WhatsApp' },
        { id: 'h4', label: 'Oleh-oleh', value: 'Abon & gepuk khas Cianjur' },
      ],
      tags: [
        { id: 't1', label: 'Frozen food' },
        { id: 't2', label: 'Makanan instan' },
        { id: 't3', label: 'Sosis & bakso' },
        { id: 't4', label: 'Camilan Korea' },
        { id: 't5', label: 'Oleh-oleh Cianjur' },
      ],
    },
    marketplaceTitle: 'Pesan Lewat Kanal Favorit',
    marketplaceSubtitle:
      'Tidak perlu katalog di website. Cari Banyu Frozen Food di aplikasi pesan antar, atau langsung chat WhatsApp.',
    marketplace: {
      gofoodEnabled: true,
      grabmartEnabled: true,
      gofoodUrl: 'https://gofood.co.id/bandung',
      grabmartUrl: 'https://food.grab.com/id/en/',
      cards: [
        { id: 'c1', channel: 'gofood', label: 'GoFood', icon: '🛵', description: 'Cari Banyu Frozen Food di GoFood area Bandung. Pesan makanan favoritmu langsung dari aplikasi.', url: 'https://gofood.co.id/bandung', enabled: true },
        { id: 'c2', channel: 'grabmart', label: 'GrabMart', icon: '🛒', description: 'Cari “Banyu Frozen Food - Cigugur Tengah” di kategori Meat & Frozen. Cek promo diskon ongkir di aplikasi.', url: 'https://food.grab.com/id/en/', enabled: true },
        { id: 'c3', channel: 'whatsapp', label: 'WhatsApp', icon: '💬', description: 'Tanya stok terbaru, harga, atau pesan langsung. Cocok untuk konfirmasi item yang sedang kosong.', url: '', enabled: true },
      ],
      socialNote: 'Update stok & promo juga dibagikan di:',
      availabilityNote: 'Stok dan ketersediaan produk bisa berubah. Beberapa item bisa habis terjual atau toko tutup sementara di aplikasi — konfirmasi lewat WhatsApp.',
    },
    location: {
      eyebrow: 'Lokasi Toko',
      title: 'Mampir ke Cigugur Tengah',
      serviceAreaTitle: 'Area Layanan',
      serviceAreaDescription: 'Melayani Cimahi, Bandung, dan sekitarnya melalui aplikasi pesan antar dan WhatsApp.',
      serviceAreas: [
        { id: 'sa1', text: 'GoFood — area Bandung' },
        { id: 'sa2', text: 'GrabMart — Banyu Frozen Food - Cigugur Tengah' },
        { id: 'sa3', text: 'WhatsApp — tanya stok & pesan langsung' },
      ],
    },
    brandPartnersTitle: 'Brand yang Kami Jual',
    brandPartnersSubtitle:
      'Berbagai merek frozen food dan makanan praktis, seperti Cedea, So Good, Kanzler, Pronas, dan Karwati.',
    advantagesTitle: 'Kenapa Belanja di Banyu?',
    advantagesSubtitle:
      'Toko frozen food UMKM di Cigugur Tengah yang siap bantu stok makanan praktis harian.',
    advantages: [
      { id: 'a1', icon: '❄️', title: 'Stok Lengkap', desc: 'Makanan instan, frozen food, sosis bakar, camilan Korea, sampai saus.' },
      { id: 'a2', icon: '💰', title: 'Harga Terjangkau', desc: 'Harga per item berkisar Rp10.000 sampai Rp49.000.' },
      { id: 'a3', icon: '🛵', title: 'Pesan Antar', desc: 'Tersedia di GoFood area Bandung dan GrabMart Banyu Frozen Food - Cigugur Tengah.' },
      { id: 'a4', icon: '🎁', title: 'Oleh-oleh Cianjur', desc: 'Abon sapi, abon pedas, dan gepuk kering merek Karwati.' },
      { id: 'a5', icon: '🏠', title: 'Cocok untuk Harian', desc: 'Praktis untuk rumah tangga, anak kos, dan pekerja yang butuh stok makanan.' },
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
    title: 'Banyu Frozen Food — Frozen Food Praktis di Cigugur Tengah, Cimahi',
    description:
      'Toko frozen food UMKM di Cigugur Tengah, Cimahi. Sosis, nugget, kornet, camilan Korea, dan oleh-oleh khas Cianjur. Pesan via GoFood, GrabMart, atau WhatsApp.',
    ogImage: '',
  },
}

export const RADIUS_OPTIONS = [
  { value: 'sm', label: 'Lebih Kotak', radii: { sm: '4px', md: '6px', lg: '10px', xl: '16px' } },
  { value: 'md', label: 'Standar', radii: { sm: '6px', md: '10px', lg: '16px', xl: '24px' } },
  { value: 'lg', label: 'Lebih Membulat', radii: { sm: '10px', md: '16px', lg: '24px', xl: '32px' } },
]
