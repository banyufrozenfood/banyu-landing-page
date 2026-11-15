-- ==============================================
-- Banyu Frozen Food — Perketat hak akses admin (RLS)
-- Jalankan di: Supabase Dashboard → SQL Editor → New query → Run
-- Urutan: supabase-schema.sql → supabase-analytics.sql → file ini
-- ==============================================
--
-- MASALAH YANG DIPERBAIKI
-- Policy lama memakai syarat:
--     auth.role() = 'authenticated'
-- Artinya SEMUA pengguna yang punya sesi login boleh menulis ke tabel —
-- termasuk orang asing yang mendaftar sendiri lewat Supabase Auth.
-- Pengecekan VITE_ADMIN_EMAILS di sisi React tidak menolong karena
-- nilainya ikut terkirim ke browser.
--
-- SESUDAH MIGRASI
-- Hanya email yang terdaftar di tabel admin_users yang boleh menulis.
--
-- WAJIB DIBACA SEBELUM MENJALANKAN
-- Daftarkan dulu email admin (huruf kecil semua). Kalau tabelnya masih
-- kosong, migrasi ini sengaja dibatalkan agar panel admin tidak terkunci:
--
--     INSERT INTO public.admin_users (email) VALUES ('emailkamu@contoh.com');
--
-- Cek dulu siapa saja yang saat ini terdaftar:
--
--     SELECT * FROM public.admin_users;
-- ==============================================

BEGIN;

-- ==============================================
-- 1. Pastikan tabel admin_users tersedia
-- ==============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  email TEXT PRIMARY KEY CHECK (email = lower(email))
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read own membership" ON public.admin_users;
CREATE POLICY "Admin read own membership" ON public.admin_users
  FOR SELECT TO authenticated
  USING (email = lower(auth.jwt() ->> 'email'));

-- ==============================================
-- 2. Pengaman: batalkan seluruh migrasi kalau belum ada admin
-- ==============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    RAISE EXCEPTION
      'Dibatalkan: admin_users masih kosong. Jalankan dulu INSERT INTO public.admin_users (email) VALUES (''emailkamu@contoh.com'');';
  END IF;
END $$;

-- ==============================================
-- 3. Fungsi bantu pengecekan admin
-- SECURITY DEFINER supaya pembacaan admin_users tidak terhalang RLS-nya
-- sendiri. Hanya mengembalikan boolean, tidak membocorkan data.
-- ==============================================
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

-- ==============================================
-- 4. Ganti policy tulis pada tabel konten
-- ==============================================

-- categories
DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;
CREATE POLICY "Admin full access categories" ON public.categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- products
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
CREATE POLICY "Admin full access products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- reviews
DROP POLICY IF EXISTS "Admin full access reviews" ON public.reviews;
CREATE POLICY "Admin full access reviews" ON public.reviews
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- hero_slides
DROP POLICY IF EXISTS "Admin full access hero_slides" ON public.hero_slides;
CREATE POLICY "Admin full access hero_slides" ON public.hero_slides
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- brand_partners
DROP POLICY IF EXISTS "Admin full access brand_partners" ON public.brand_partners;
CREATE POLICY "Admin full access brand_partners" ON public.brand_partners
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- site_settings
DROP POLICY IF EXISTS "Admin write site_settings" ON public.site_settings;
CREATE POLICY "Admin write site_settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- media_library
DROP POLICY IF EXISTS "Admin write media_library" ON public.media_library;
CREATE POLICY "Admin write media_library" ON public.media_library
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- whatsapp_orders
DROP POLICY IF EXISTS "Admin full access whatsapp_orders" ON public.whatsapp_orders;
CREATE POLICY "Admin full access whatsapp_orders" ON public.whatsapp_orders
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- whatsapp_order_items
DROP POLICY IF EXISTS "Admin full access whatsapp_order_items" ON public.whatsapp_order_items;
CREATE POLICY "Admin full access whatsapp_order_items" ON public.whatsapp_order_items
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ==============================================
-- 5. Ganti policy tulis pada Storage bucket "media"
-- ==============================================
DROP POLICY IF EXISTS "Admin upload media files" ON storage.objects;
CREATE POLICY "Admin upload media files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update media files" ON storage.objects;
CREATE POLICY "Admin update media files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete media files" ON storage.objects;
CREATE POLICY "Admin delete media files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());

COMMIT;

-- ==============================================
-- 6. Verifikasi setelah migrasi
-- ==============================================
-- a) Pastikan tidak ada lagi policy yang bergantung pada auth.role().
--    Hasil yang diharapkan: 0 baris.
SELECT schemaname AS skema, tablename AS tabel, policyname AS policy
FROM pg_policies
WHERE qual LIKE '%auth.role()%' OR with_check LIKE '%auth.role()%';

-- b) Lihat policy admin yang sekarang terpasang.
SELECT tablename AS tabel, policyname AS policy, cmd AS perintah, roles
FROM pg_policies
WHERE policyname ILIKE '%Admin%'
ORDER BY tablename, policyname;

-- ==============================================
-- 7. Uji cepat dari sisi aplikasi
-- ==============================================
-- Login sebagai admin lalu buka /admin/settings dan simpan perubahan.
-- Lalu login dengan akun lain (atau tanpa login) dan coba:
--   UPDATE site_settings SET draft = '{}' WHERE id = 1;
-- Hasil yang diharapkan: 0 baris terpengaruh / ditolak RLS.
