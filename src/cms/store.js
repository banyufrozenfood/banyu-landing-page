import { supabase } from '../lib/supabase.js'
import { DEFAULT_SETTINGS } from './defaults.js'

const LS_SETTINGS = 'banyu_cms_settings_v1'
const LS_MEDIA = 'banyu_cms_media_v1'

export const STORAGE_MODE = { SUPABASE: 'supabase', LOCAL: 'local' }

function deepMerge(base, override) {
  if (override === null || override === undefined) return base
  if (Array.isArray(base) || Array.isArray(override)) return override ?? base
  if (base && typeof base === 'object' && override && typeof override === 'object') {
    const out = { ...base }
    for (const key of Object.keys(base)) {
      out[key] = key in override ? deepMerge(base[key], override[key]) : base[key]
    }
    for (const key of Object.keys(override)) {
      if (!(key in out)) out[key] = override[key]
    }
    return out
  }
  return override === undefined ? base : override
}

export function withDefaults(settings) {
  return deepMerge(DEFAULT_SETTINGS, settings || {})
}

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Gagal menyimpan ke localStorage:', e)
  }
}

async function probeSupabase() {
  const probe = supabase
    .from('site_settings')
    .select('id')
    .limit(1)
    .then(({ error }) => !error)
    .catch(() => false)
  const timeout = new Promise((resolve) => setTimeout(() => resolve(false), 4000))
  return Promise.race([probe, timeout])
}

export async function loadSettingsDoc() {
  const local = readLocal(LS_SETTINGS, null)
  let mode = STORAGE_MODE.LOCAL
  let remote = null
  try {
    if (await probeSupabase()) {
      mode = STORAGE_MODE.SUPABASE
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
      if (!error && data) remote = data
    }
  } catch {
    mode = STORAGE_MODE.LOCAL
  }

  if (mode === STORAGE_MODE.SUPABASE && remote) {
    return {
      mode,
      draft: withDefaults(remote.draft),
      published: withDefaults(remote.published),
      updatedAt: remote.updated_at,
      publishedAt: remote.published_at,
    }
  }
  if (local) {
    return {
      mode,
      draft: withDefaults(local.draft),
      published: withDefaults(local.published),
      updatedAt: local.updatedAt,
      publishedAt: local.publishedAt,
    }
  }
  const now = new Date().toISOString()
  return { mode, draft: withDefaults({}), published: withDefaults({}), updatedAt: now, publishedAt: now }
}

export async function persistSettingsDoc(doc) {
  const payload = {
    draft: doc.draft,
    published: doc.published,
    updatedAt: new Date().toISOString(),
    publishedAt: doc.publishedAt,
  }
  if (doc.mode === STORAGE_MODE.SUPABASE) {
    const { error } = await supabase.from('site_settings').upsert({
      id: 1,
      draft: payload.draft,
      published: payload.published,
      updated_at: payload.updatedAt,
      published_at: payload.publishedAt,
    })
    if (error) throw error
    return payload
  }
  writeLocal(LS_SETTINGS, payload)
  return payload
}

// ---------- Media library ----------

export async function loadMedia() {
  try {
    const { error } = await supabase.from('media_library').select('id').limit(1)
    if (!error) {
      const { data, error: fetchErr } = await supabase.from('media_library').select('*').order('created_at', { ascending: false })
      if (!fetchErr) return { mode: STORAGE_MODE.SUPABASE, items: data || [] }
    }
  } catch {
    // fall through to local
  }
  return { mode: STORAGE_MODE.LOCAL, items: readLocal(LS_MEDIA, []) }
}

export async function addMediaItem(mode, item) {
  if (mode === STORAGE_MODE.SUPABASE) {
    const { data, error } = await supabase
      .from('media_library')
      .insert({ name: item.name, url: item.url, category: item.category, size: item.size || 0 })
      .select()
      .single()
    if (error) throw error
    return data
  }
  const items = readLocal(LS_MEDIA, [])
  const saved = { ...item, id: item.id || `m${Date.now()}`, created_at: new Date().toISOString() }
  writeLocal(LS_MEDIA, [saved, ...items])
  return saved
}

export async function removeMediaItem(mode, item) {
  if (!item?.id) return
  if (mode === STORAGE_MODE.SUPABASE) {
    const { error } = await supabase.from('media_library').delete().eq('id', item.id)
    if (error) throw error
    if (item.storage_path) {
      await supabase.storage.from('media').remove([item.storage_path])
    }
    return
  }
  writeLocal(LS_MEDIA, readLocal(LS_MEDIA, []).filter((m) => m.id !== item.id))
}

export async function uploadMediaFile(mode, file, category) {
  if (!file?.name) throw new Error('File tidak valid')
  if (mode === STORAGE_MODE.SUPABASE) {
    const ext = file.name.split('.').pop()
    const path = `${category}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, upsert: false })
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(path)
      const item = await addMediaItem(mode, {
        name: file.name,
        url: data.publicUrl,
        category,
        size: file.size,
        storage_path: path,
        ext,
      })
      return item
    }
    // Upload online gagal (mis. bucket 'media' belum ada): jangan diam-diam
    // menulis data-URL raksasa ke localStorage. Hanya fallback untuk file kecil.
    const MAX_FALLBACK_BYTES = 400 * 1024
    if ((file.size || 0) > MAX_FALLBACK_BYTES) {
      throw new Error(
        `Upload online gagal (${error?.message || 'storage error'}). Buat bucket 'media' di Supabase Storage atau pakai file < 400 KB.`
      )
    }
    console.warn('Upload Supabase gagal, fallback ke penyimpanan lokal:', error?.message)
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Gagal membaca file'))
    reader.readAsDataURL(file)
  })
  return addMediaItem(mode, {
    name: file.name,
    url: dataUrl,
    category,
    size: file.size,
  })
}
