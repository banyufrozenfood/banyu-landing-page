import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY

export const supabaseEnvMissing = !supabaseUrl || !supabaseAnonKey

export const SUPABASE_ENV_MESSAGE =
  'Konfigurasi Supabase belum lengkap. Set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY ' +
  'di file .env (lokal) atau Environment Variables (Vercel), lalu muat ulang aplikasi.'

// Client tetap dibuat supaya aplikasi tidak melempar TypeError yang membingungkan
// saat modul ini diimpor tanpa env. Namun setiap kegagalan konfigurasi sekarang
// dilaporkan secara eksplisit lewat flag di bawah, bukan gagal diam-diam.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)

if (supabaseEnvMissing) {
  console.error(SUPABASE_ENV_MESSAGE)
}

/**
 * True jika Supabase benar-benar bisa dipakai.
 * Pakai untuk memutuskan perlu fallback lokal atau tidak.
 */
export const supabaseReady = !supabaseEnvMissing
