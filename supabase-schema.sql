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
  tokopedia_url TEXT,
  shopee_url TEXT,
  tokopedia_enabled BOOLEAN DEFAULT FALSE,
  shopee_enabled BOOLEAN DEFAULT FALSE,
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
('Frozen Food Berkualitas', 'Untuk Keluarga Indonesia', 'Produk beku pilihan dengan bahan terbaik, diproses higienis dan dikemas vakum untuk menjaga kesegaran.', 'https://placehold.co/1200x600/0099FF/white?text=Banyu+Frozen+Food', 'Cara Pesan', '/#cara-pesan', 1, TRUE),
('Praktis & Lezat', 'Siap Saji dalam Hitungan Menit', 'Nugget, sosis, dimsum, bakso — tinggal goreng atau kukus. Cocok untuk bekal sekolah dan menu harian.', 'https://placehold.co/1200x600/66CCFF/003366?text=Praktis+%26+Lezat', 'Cara Pesan', '/#cara-pesan', 2, TRUE),
('Pesan Mudah', 'Via GoFood, GrabMart & WhatsApp', 'Pilih channel favorit kamu untuk memesan. Pengiriman cepat ke area Cimahi dan Bandung.', 'https://placehold.co/1200x600/0077CC/white?text=Pesan+Mudah', 'Lihat Lokasi', '/#lokasi', 3, TRUE);

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

-- ==============================================
-- Daftar admin & fungsi pengecekan akses
-- Policy tulis di bawah hanya berlaku untuk email yang terdaftar di sini.
-- WAJIB: daftarkan email admin setelah membuat akun Supabase Auth.
--   INSERT INTO public.admin_users (email) VALUES ('emailkamu@contoh.com');
-- ==============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY CHECK (email = lower(email))
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read own membership" ON public.admin_users;
CREATE POLICY "Admin read own membership" ON public.admin_users
  FOR SELECT TO authenticated
  USING (email = lower(auth.jwt() ->> 'email'));

-- SECURITY DEFINER supaya pembacaan admin_users tidak terhalang RLS-nya sendiri.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE email = lower(auth.jwt() ->> 'email')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_partners ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read hero_slides" ON hero_slides FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read brand_partners" ON brand_partners FOR SELECT USING (is_active = TRUE);

-- Public insert for reviews (customer submit review)
CREATE POLICY "Public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Admin (email terdaftar di admin_users) full access
CREATE POLICY "Admin full access categories" ON categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access hero_slides" ON hero_slides FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access brand_partners" ON brand_partners FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

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
-- Hanya admin terdaftar yang boleh menyimpan/menerbitkan
CREATE POLICY "Admin write site_settings" ON site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

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
CREATE POLICY "Admin write media_library" ON media_library FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ==============================================
-- BARU: Storage bucket "media" untuk upload gambar
-- ==============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Publik boleh melihat file di bucket media
CREATE POLICY "Public read media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Hanya admin terdaftar yang boleh upload/hapus file di bucket media
CREATE POLICY "Admin upload media files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admin update media files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin()) WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "Admin delete media files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());

-- Jika tabel products sudah dibuat sebelum kolom marketplace ditambahkan,
-- jalankan blok ini juga. Aman dijalankan berulang.
ALTER TABLE products ADD COLUMN IF NOT EXISTS tokopedia_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shopee_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tokopedia_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shopee_enabled BOOLEAN DEFAULT FALSE;

-- ==============================================
-- BARU: Pesanan WhatsApp & Manajemen Stok Otomatis
-- ==============================================
CREATE TABLE IF NOT EXISTS whatsapp_orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_order_items (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id BIGINT REFERENCES whatsapp_orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE whatsapp_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access whatsapp_orders" ON whatsapp_orders
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access whatsapp_order_items" ON whatsapp_order_items
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
