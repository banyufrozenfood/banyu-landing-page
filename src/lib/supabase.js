import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnvMissing = !supabaseUrl || !supabaseAnonKey

if (supabaseEnvMissing) {
  console.error(
    'Supabase env hilang: set VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di .env / Vercel Environment Variables.'
  )
}

// Jangan throw di top-level agar import tidak memutihkan seluruh app.
// Pakai placeholder bila env hilang; semua query akan gagal graceful dan
// ditangani try/catch + layar error di SiteSettingsContext.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
