-- ==============================================
-- Migration: WhatsApp Orders & Automatic Stock Management
-- Jalankan di: Supabase Dashboard -> SQL Editor -> Run
-- Prasyarat: supabase-migration-admin-rls.sql (membuat public.is_admin()).
-- Catatan: fitur cart sudah dihapus dari aplikasi. File ini dipertahankan
-- untuk database legacy; function-nya sudah dikunci agar tidak jadi celah.
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

-- Policy: hanya admin terdaftar (lihat supabase-migration-admin-rls.sql)
DROP POLICY IF EXISTS "Admin full access whatsapp_orders" ON whatsapp_orders;
CREATE POLICY "Admin full access whatsapp_orders" ON whatsapp_orders
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
DROP POLICY IF EXISTS "Admin full access whatsapp_order_items" ON whatsapp_order_items;
CREATE POLICY "Admin full access whatsapp_order_items" ON whatsapp_order_items
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Function to create order from public cart (SECURITY DEFINER to allow guest checkout to record order safely)
CREATE OR REPLACE FUNCTION create_whatsapp_order(
  p_customer_name TEXT,
  p_customer_address TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id BIGINT;
  v_order_no TEXT;
  v_total INTEGER := 0;
  v_item JSONB;
  v_prod RECORD;
  v_qty INTEGER;
BEGIN
  IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
    RAISE EXCEPTION 'Nama pemesan minimal 2 karakter';
  END IF;

  IF length(trim(p_customer_name)) > 120 THEN
    RAISE EXCEPTION 'Nama pemesan maksimal 120 karakter';
  END IF;

  IF p_customer_address IS NULL OR length(trim(p_customer_address)) < 5 THEN
    RAISE EXCEPTION 'Alamat pengiriman minimal 5 karakter';
  END IF;

  IF length(trim(p_customer_address)) > 500 THEN
    RAISE EXCEPTION 'Alamat pengiriman maksimal 500 karakter';
  END IF;

  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' THEN
    RAISE EXCEPTION 'Daftar item tidak valid';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Keranjang kosong';
  END IF;

  IF jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'Maksimal 50 jenis item per pesanan';
  END IF;

  v_order_no := 'WA-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));

  INSERT INTO whatsapp_orders (order_number, customer_name, customer_address, total, status)
  VALUES (v_order_no, trim(p_customer_name), trim(p_customer_address), 0, 'pending')
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := LEAST(1000, GREATEST(1, (v_item->>'quantity')::INTEGER));
    SELECT id, name, price, stock INTO v_prod FROM products WHERE id = (v_item->>'id')::BIGINT;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produk dengan ID % tidak ditemukan', (v_item->>'id');
    END IF;

    INSERT INTO whatsapp_order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (v_order_id, v_prod.id, v_prod.name, v_qty, v_prod.price);

    v_total := v_total + (v_prod.price * v_qty);
  END LOOP;

  UPDATE whatsapp_orders SET total = v_total WHERE id = v_order_id;

  RETURN jsonb_build_object('order_id', v_order_id, 'order_number', v_order_no, 'total', v_total);
END;
$$;

-- Fitur checkout sudah dihapus dari aplikasi. Kunci RPC publik ini supaya
-- tidak bisa dipanggil dari luar. Jika nanti checkout diaktifkan lagi,
-- buka akses secara sadar: GRANT EXECUTE ON FUNCTION
-- create_whatsapp_order(TEXT, TEXT, JSONB) TO anon, authenticated;
REVOKE ALL ON FUNCTION create_whatsapp_order(TEXT, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION create_whatsapp_order(TEXT, TEXT, JSONB) FROM anon, authenticated;

-- Function to set order status & deduct or restore stock
CREATE OR REPLACE FUNCTION set_whatsapp_order_status(
  p_order_id BIGINT,
  p_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
  v_current_stock INTEGER;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Akses ditolak: hanya admin terdaftar';
  END IF;

  SELECT * INTO v_order FROM whatsapp_orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pesanan tidak ditemukan';
  END IF;

  IF p_status NOT IN ('confirmed', 'cancelled', 'pending') THEN
    RAISE EXCEPTION 'Status tidak valid';
  END IF;

  IF v_order.status = p_status THEN
    RETURN jsonb_build_object('success', true, 'status', v_order.status);
  END IF;

  -- Transisi ke CONFIRMED: kurangi stok
  IF p_status = 'confirmed' AND v_order.status <> 'confirmed' THEN
    FOR v_item IN SELECT * FROM whatsapp_order_items WHERE order_id = p_order_id
    LOOP
      IF v_item.product_id IS NOT NULL THEN
        SELECT stock INTO v_current_stock FROM products WHERE id = v_item.product_id FOR UPDATE;
        IF v_current_stock < v_item.quantity THEN
          RAISE EXCEPTION 'Stok untuk produk "%" tidak mencukupi (sisa %, butuh %)', v_item.product_name, v_current_stock, v_item.quantity;
        END IF;
        UPDATE products SET stock = stock - v_item.quantity WHERE id = v_item.product_id;
      END IF;
    END LOOP;
  END IF;

  -- Transisi dari CONFIRMED ke CANCELLED / PENDING: kembalikan stok
  IF v_order.status = 'confirmed' AND (p_status = 'cancelled' OR p_status = 'pending') THEN
    FOR v_item IN SELECT * FROM whatsapp_order_items WHERE order_id = p_order_id
    LOOP
      IF v_item.product_id IS NOT NULL THEN
        UPDATE products SET stock = COALESCE(stock, 0) + v_item.quantity WHERE id = v_item.product_id;
      END IF;
    END LOOP;
  END IF;

  UPDATE whatsapp_orders SET status = p_status, updated_at = NOW() WHERE id = p_order_id;

  RETURN jsonb_build_object('success', true, 'status', p_status);
END;
$$;

-- Hanya user login yang boleh mencoba; pemeriksaan is_admin() di dalam
-- function tetap menjadi penentu akhir.
REVOKE ALL ON FUNCTION set_whatsapp_order_status(BIGINT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION set_whatsapp_order_status(BIGINT, TEXT) TO authenticated;
