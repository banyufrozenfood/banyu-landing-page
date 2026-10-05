-- ==============================================
-- Supabase Schema — Banyu Frozen Food
-- Jalankan di: Supabase Dashboard → SQL Editor → New query → Run
-- ==============================================

-- Tabel Kategori
CREATE TABLE categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📦',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Produk
CREATE TABLE products (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER DEFAULT 0,
  description TEXT,
  specs JSONB DEFAULT '{}',    -- spesifikasi bebas, format: {"Berat": "500g", "Isi": "10 pcs"}
  images TEXT[] DEFAULT '{}',  -- array URL foto produk
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Review (tidak dipakai di UI saat ini — disiapkan untuk fase berikutnya)
CREATE TABLE reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Banner
CREATE TABLE banners (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- BARU: Hero Slides untuk Carousel Homepage
-- ==============================================
CREATE TABLE hero_slides (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default hero slides
INSERT INTO hero_slides (title, subtitle, description, image, cta_text, cta_link, "order", is_active) VALUES
('Frozen Food Berkualitas', 'Untuk Keluarga Indonesia', 'Produk beku pilihan dengan bahan terbaik, diproses higienis dan dikemas vakum untuk menjaga kesegaran.', 'https://placehold.co/1200x600/0099FF/white?text=Banyu+Frozen+Food', 'Lihat Produk', '/produk', 1, TRUE),
('Praktis & Lezat', 'Siap Saji dalam Hitungan Menit', 'Nugget, sosis, dimsum, bakso — tinggal goreng atau kukus. Cocok untuk bekal sekolah dan menu harian.', 'https://placehold.co/1200x600/66CCFF/003366?text=Praktis+%26+Lezat', 'Pesan Sekarang', '/produk', 2, TRUE),
('Pesan Mudah', 'Via Tokopedia, Shopee & WhatsApp', 'Pilih channel favorit kamu untuk memesan. Pengiriman cepat ke seluruh Indonesia.', 'https://placehold.co/1200x600/0077CC/white?text=Pesan+Mudah', 'Hubungi Kami', '/lokasi', 3, TRUE);

-- ==============================================
-- BARU: Brand Partners untuk Section "Brand Partner Kami"
-- ==============================================
CREATE TABLE brand_partners (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  website_url TEXT,
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default brand partners
INSERT INTO brand_partners (name, logo, website_url, "order", is_active) VALUES
('Fiesta', 'https://placehold.co/160x80/F8FAFC/6B7280?text=Fiesta', 'https://fiesta.co.id', 1, TRUE),
('So Good', 'https://placehold.co/160x80/F8FAFC/6B7280?text=So+Good', 'https://sogoodfood.co.id', 2, TRUE),
('Bernardi', 'https://placehold.co/160x80/F8FAFC/6B7280?text=Bernardi', 'https://bernardi.co.id', 3, TRUE),
('Belfoods', 'https://placehold.co/160x80/F8FAFC/6B7280?text=Belfoods', 'https://belfoods.co.id', 4, TRUE),
('Cedea', 'https://placehold.co/160x80/F8FAFC/6B7280?text=Cedea', 'https://cedea.co.id', 5, TRUE),
('Golden Farm', 'https://placehold.co/160x80/F8FAFC/6B7280?text=Golden+Farm', 'https://goldenfarm.co.id', 6, TRUE);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_partners ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read brand_partners" ON brand_partners FOR SELECT USING (is_active = TRUE);

-- Public insert for reviews (customer submit review)
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Authenticated (admin) full access
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access hero_slides" ON hero_slides FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access brand_partners" ON brand_partners FOR ALL USING (auth.role() = 'authenticated');

-- ==============================================
-- BARU: CMS — Pengaturan Website (draft & publish)
-- Satu baris saja (id = 1) berisi JSON draft dan published
-- ==============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY,
  draft JSONB NOT NULL DEFAULT '{}',
  published JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Publik boleh membaca (website menampilkan isi published)
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
-- Hanya admin login yang boleh menyimpan/menerbitkan
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ==============================================
-- BARU: CMS — Media Library (daftar gambar)
-- ==============================================
CREATE TABLE IF NOT EXISTS media_library (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'gambar',
  size INTEGER DEFAULT 0,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read media_library" ON media_library FOR SELECT USING (true);
CREATE POLICY "Admin write media_library" ON media_library FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- ==============================================
-- BARU: Storage bucket "media" untuk upload gambar
-- ==============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Publik boleh melihat file di bucket media
CREATE POLICY "Public read media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Hanya admin login yang boleh upload/hapus file di bucket media
CREATE POLICY "Admin upload media files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admin update media files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Admin delete media files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');