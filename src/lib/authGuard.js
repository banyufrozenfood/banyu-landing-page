// Logika guard panel admin, dipisah dari komponen agar bisa diuji tanpa DOM.
//
// PENTING: guard di sini hanya mengatur tampilan, bukan pengaman data.
// Pengaman sesungguhnya ada di Row Level Security Supabase. Daftar email di
// VITE_ADMIN_EMAILS ikut ter-bundle ke browser sehingga bisa dibaca publik.

export const ADMIN_STATUS = {
  loading: 'loading',
  authed: 'authed',
  unauthed: 'unauthed',
  forbidden: 'forbidden',
}

/**
 * Cek apakah email termasuk admin.
 * Jika daftar kosong, semua user terautentikasi diizinkan (perilaku lama).
 */
export function isEmailAllowed(email, allowList = '') {
  const allow = (typeof allowList === 'string' ? allowList : '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  // Daftar kosong (termasuk yang hanya berisi koma) berarti tanpa pembatasan.
  if (allow.length === 0) return true
  return allow.includes((email || '').toLowerCase())
}

/** Ambil daftar email admin dari environment Vite. */
export function getAdminAllowList() {
  return import.meta.env?.VITE_ADMIN_EMAILS || ''
}

/**
 * Petakan sesi Supabase menjadi status panel admin.
 * Dipakai di mount, popstate, dan onAuthStateChange supaya aturannya satu sumber.
 */
export function resolveAdminStatus(session, allowList = '') {
  if (!session || !session.user) return ADMIN_STATUS.unauthed
  return isEmailAllowed(session.user.email, allowList) ? ADMIN_STATUS.authed : ADMIN_STATUS.forbidden
}

/**
 * Verifikasi sesi ke server Supabase (bukan sekadar baca localStorage).
 * Dipakai hemat: sekali saat mount dan saat halaman dipulihkan dari bfcache.
 */
export async function getVerifiedSession(supabaseClient) {
  if (!supabaseClient) return { session: null, verified: false }
  try {
    const { data, error } = await supabaseClient.auth.getUser()
    if (error || !data?.user) {
      // Server menolak: sesi lokal sudah tidak sah, jangan dipakai lagi.
      return { session: null, verified: true }
    }
    const { data: sessionData } = await supabaseClient.auth.getSession()
    return { session: sessionData?.session || null, verified: true }
  } catch {
    // Jaringan bermasalah: jangan buang sesi yang masih tersimpan di lokal.
    return { session: null, verified: false }
  }
}

/**
 * Baca sesi dari penyimpanan lokal (instan, tanpa permintaan jaringan).
 * Dipakai pada popstate agar tombol back/forward tidak terasa lambat.
 */
export async function getLocalSession(supabaseClient) {
  if (!supabaseClient) return null
  try {
    const { data } = await supabaseClient.auth.getSession()
    return data?.session || null
  } catch {
    return null
  }
}
