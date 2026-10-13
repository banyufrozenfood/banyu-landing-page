-- Jalankan sekali di Supabase Dashboard → SQL Editor untuk database yang sudah ada.
ALTER TABLE products ADD COLUMN IF NOT EXISTS tokopedia_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shopee_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tokopedia_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shopee_enabled BOOLEAN DEFAULT FALSE;
