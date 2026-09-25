// Utilitas pengurutan yang aman untuk kolom `order`.
// Tahan terhadap nilai kosong/NaN/tipe salah, dan menghasilkan urutan stabil.

export function toOrderNumber(value) {
  const n = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
}

// Urutkan naik berdasarkan `key` (default: order). Nilai tidak valid ditaruh paling akhir.
// Seri dipecah oleh `tieKey` (default: id), lalu oleh posisi awal agar stabil.
export function sortByOrder(items, { key = 'order', tieKey = 'id' } = {}) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const oa = toOrderNumber(a.item?.[key]);
      const ob = toOrderNumber(b.item?.[key]);
      if (oa !== ob) return oa < ob ? -1 : 1;
      const ta = toOrderNumber(a.item?.[tieKey]);
      const tb = toOrderNumber(b.item?.[tieKey]);
      if (ta !== tb) return ta < tb ? -1 : 1;
      return a.index - b.index;
    })
    .map((entry) => entry.item);
}

// Urutan berikutnya untuk item baru = order valid terbesar + 1 (minimal 1).
export function nextOrder(items, key = 'order') {
  if (!Array.isArray(items)) return 1;
  let max = 0;
  for (const item of items) {
    const n = toOrderNumber(item?.[key]);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}

// Ubah input order (string/angka) menjadi integer aman >= min.
export function normalizeOrderInput(value, { min = 0, fallback = 0 } = {}) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return Math.max(min, fallback);
  return Math.max(min, n);
}
