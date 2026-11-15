export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((value || '').trim())
}

export function isValidWhatsapp(value) {
  return /^[0-9]{8,15}$/.test((value || '').replace(/[\s-]/g, ''))
}

export function isValidUrl(value) {
  const trimmed = (value || '').trim()
  if (!trimmed) return true
  try {
    const u = new URL(trimmed)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'image/gif']
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024
export const MAX_LOCAL_UPLOAD_BYTES = 400 * 1024

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
