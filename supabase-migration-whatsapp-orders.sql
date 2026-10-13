-- ==============================================
-- Migration: WhatsApp Orders & Automatic Stock Management
-- Jalankan di: Supabase Dashboard -> SQL Editor -> Run
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

-- Policy: Admin full access
CREATE POLICY "Admin full access whatsapp_orders" ON whatsapp_orders
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access whatsapp_order_items" ON whatsapp_order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to create order from public cart (SECURITY DEFINER to allow guest checkout to record order safely)
CREATE OR REPLACE FUNCTION create_whatsapp_order(
  p_customer_name TEXT,
  p_customer_address TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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

  IF p_customer_address IS NULL OR length(trim(p_customer_address)) < 5 THEN
    RAISE EXCEPTION 'Alamat pengiriman minimal 5 karakter';
  END IF;

  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Keranjang kosong';
  END IF;

  v_order_no := 'WA-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substr(md5(random()::text), 1, 6));

  INSERT INTO whatsapp_orders (order_number, customer_name, customer_address, total, status)
  VALUES (v_order_no, trim(p_customer_name), trim(p_customer_address), 0, 'pending')
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := GREATEST(1, (v_item->>'quantity')::INTEGER);
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

-- Function to set order status & deduct or restore stock
CREATE OR REPLACE FUNCTION set_whatsapp_order_status(
  p_order_id BIGINT,
  p_status TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_item RECORD;
  v_current_stock INTEGER;
BEGIN
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
