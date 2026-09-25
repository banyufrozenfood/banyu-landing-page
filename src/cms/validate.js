export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export function isValidWhatsapp(value) {
  return /^[0-9]{8,15}$/.test(value.replace(/[\s-]/g, ''))
}

export function isValidUrl(value) {
  if (!value.trim()) return true
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidInternalLink(value) {
  return /^\/[a-zA-Z0-9/?=&#_-]*$/.test(value.trim())
}

export function isValidHexColor(value) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim())
}

export function isValidPrice(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0
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
