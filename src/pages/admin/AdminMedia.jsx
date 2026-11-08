import { useEffect, useMemo, useRef, useState } from 'react'
import { useMediaLibrary } from '../../cms/useMedia.js'
import { addMediaItem, removeMediaItem, uploadMediaFile } from '../../cms/store.js'
import { IMAGE_TYPES, MAX_LOCAL_UPLOAD_BYTES, MAX_UPLOAD_BYTES, formatBytes, isValidUrl } from '../../cms/validate.js'
import { useToast } from '../../components/ui/Toast.jsx'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { supabase } from '../../lib/supabase.js'
import './AdminShared.css'
import './AdminMedia.css'

const CATEGORIES = [
  { value: 'gambar', label: 'Gambar' },
  { value: 'logo', label: 'Logo' },
  { value: 'banner', label: 'Banner' },
  { value: 'toko', label: 'Foto Toko' },
]

const FILTERS = [{ value: 'all', label: 'Semua' }, ...CATEGORIES]

function addReference(references, url, location) {
  const value = (url || '').trim()
  if (!value) return
  if (!references.has(value)) references.set(value, new Set())
  references.get(value).add(location)
}

export default function AdminMedia() {
  const { items, mode, loading, refresh } = useMediaLibrary()
  const cms = useSiteSettings()
  const toast = useToast()
  const fileRef = useRef(null)
  const [category, setCategory] = useState('gambar')
  const [filter, setFilter] = useState('all')
  const [usageFilter, setUsageFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const [references, setReferences] = useState(new Map())
  const [usageLoading, setUsageLoading] = useState(true)

  // Pakai mode aktual dari media library agar limit konsisten dengan tempat upload.
  const maxBytes = mode === 'supabase' ? MAX_UPLOAD_BYTES : MAX_LOCAL_UPLOAD_BYTES

  useEffect(() => {
    let cancelled = false
    async function loadReferences() {
      setUsageLoading(true)
      const next = new Map()
      const addSettingsReferences = (value, path = 'Pengaturan website') => {
        if (typeof value === 'string') {
          addReference(next, value, path)
          return
        }
        if (Array.isArray(value)) value.forEach((item, index) => addSettingsReferences(item, `${path} ${index + 1}`))
        else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => addSettingsReferences(item, `${path}: ${key}`))
      }

      addSettingsReferences(cms.draft)
      addSettingsReferences(cms.published, 'Pengaturan website terbit')
      try {
        const [slides, partners] = await Promise.all([
          supabase.from('hero_slides').select('image'),
          supabase.from('brand_partners').select('logo'),
        ])
        ;(slides.data || []).forEach((slide) => addReference(next, slide.image, 'Slide beranda'))
        ;(partners.data || []).forEach((partner) => addReference(next, partner.logo, 'Brand partner'))
      } catch (error) {
        console.error('Gagal memeriksa penggunaan media:', error)
      } finally {
        if (!cancelled) {
          setReferences(next)
          setUsageLoading(false)
        }
      }
    }
    loadReferences()
    return () => { cancelled = true }
  }, [cms.draft, cms.published])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((m) => {
      const used = references.has((m.url || '').trim())
      return (filter === 'all' || m.category === filter)
        && (usageFilter === 'all' || (usageFilter === 'used' ? used : !used))
        && (!q || (m.name || '').toLowerCase().includes(q))
    })
  }, [items, filter, usageFilter, search, references])

  const handleUpload = async (file) => {
    if (!file) return
    if (!IMAGE_TYPES.includes(file.type)) {
      toast.error('Format tidak didukung. Gunakan PNG, JPG, WebP, SVG, atau GIF.')
      return
    }
    if (file.size > maxBytes) {
      toast.error(`Ukuran file maksimal ${formatBytes(maxBytes)}.`)
      return
    }
    setBusy(true)
    try {
      await uploadMediaFile(mode, file, category)
      await refresh()
      toast.success('Gambar berhasil diupload.')
    } catch (e) {
      console.error('Upload gagal:', e)
      toast.error('Gagal mengupload gambar. Silakan coba lagi.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleAddUrl = async () => {
    const trimmed = (urlInput || '').trim()
    if (!trimmed || !isValidUrl(trimmed)) {
      toast.error('Link gambar tidak valid.')
      return
    }
    setBusy(true)
    try {
      const cleanUrl = trimmed.split('?')[0].split('#')[0] || trimmed
      const fallbackName = (cleanUrl.split('/').pop() || 'gambar').slice(0, 100)
      await addMediaItem(mode, { name: fallbackName, url: trimmed, category, size: 0 })
      await refresh()
      setUrlInput('')
      toast.success('Gambar dari link berhasil ditambahkan.')
    } catch (e) {
      console.error('Gagal menambah link:', e)
      toast.error('Gagal menambahkan gambar.')
    } finally {
      setBusy(false)
    }
  }

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.url)
      toast.success('Link gambar disalin.')
    } catch {
      toast.error('Gagal menyalin link.')
    }
  }

  const handleDelete = async () => {
    const item = toDelete
    if (!item?.id) {
      setToDelete(null)
      return
    }
    if (busy) {
      toast.error('Tunggu proses sebelumnya selesai.')
      return
    }
    setToDelete(null)
    setBusy(true)
    try {
      await removeMediaItem(mode, item)
      await refresh()
      toast.success('Gambar berhasil dihapus.')
    } catch (e) {
      console.error('Gagal menghapus:', e)
      toast.error('Gagal menghapus gambar.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-page admin-media">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media Library</h1>
          <p className="admin-page-subtitle">Simpan gambar sekali, pakai berulang kali di seluruh website.</p>
        </div>
      </div>

      {mode === 'local' && (
        <div className="media-notice">
          Penyimpanan online belum terhubung. Gambar disimpan di browser ini saja (maksimal {formatBytes(MAX_LOCAL_UPLOAD_BYTES)} per file).
          Jalankan <code>supabase-schema.sql</code> di Supabase SQL Editor untuk penyimpanan online.
        </div>
      )}

      <div className="admin-card">
        <div className="media-toolbar">
          <div className="media-upload">
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Kategori upload">
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <button type="button" className="btn-admin-primary" disabled={busy} onClick={() => fileRef.current?.click()}>
              {busy ? 'Mengupload...' : '+ Upload Gambar'}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={IMAGE_TYPES.join(',')}
              hidden
              onChange={(e) => handleUpload(e.target.files[0])}
            />
          </div>
          <div className="media-add-url">
            <input
              type="url"
              placeholder="atau tempel link gambar: https://..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button type="button" className="btn-admin-secondary" disabled={busy} onClick={handleAddUrl}>
              Tambah dari Link
            </button>
          </div>
        </div>

        <div className="media-filters">
          <div className="media-chips">
            {FILTERS.map((f) => (
              <button key={f.value} type="button" className={filter === f.value ? 'active' : ''} onClick={() => setFilter(f.value)}>
                {f.label}
              </button>
            ))}
          </div>
          <select className="media-usage-filter" value={usageFilter} onChange={(e) => setUsageFilter(e.target.value)} aria-label="Status penggunaan media">
            <option value="all">Semua status</option>
            <option value="used">Digunakan</option>
            <option value="unused">Belum digunakan</option>
          </select>
          <input
            className="admin-search-input"
            type="search"
            placeholder="Cari gambar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="media-empty">Memuat media...</p>
        ) : visible.length === 0 ? (
          <div className="media-empty-state">
            <p><strong>Belum ada gambar di sini.</strong></p>
            <p>Upload gambar produk, logo, atau banner supaya bisa dipakai ulang tanpa upload berulang.</p>
            <button type="button" className="btn-admin-primary" onClick={() => fileRef.current?.click()}>
              + Upload Gambar Pertama
            </button>
          </div>
        ) : (
          <div className="media-grid">
            {(visible || []).filter(Boolean).map((m) => (
              <div className="media-card" key={m.id}>
                <div className="media-card__thumb">
                  <img src={m?.url} alt={m?.name || 'Gambar'} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/E5E7EB/9CA3AF?text=Error'; }} />
                </div>
                <div className="media-card__info">
                  <span className="media-card__name" title={m?.name || ''}>{m?.name || 'Gambar'}</span>
                  <span className="media-card__meta">
                    {(CATEGORIES.find((c) => c.value === m?.category) || { label: m?.category || 'Lainnya' }).label}
                    {m?.size ? ` · ${formatBytes(m.size)}` : ''}
                  </span>
                  <span className={`media-card__usage ${references.has((m?.url || '').trim()) ? 'media-card__usage--used' : 'media-card__usage--unused'}`}>
                    {usageLoading ? 'Memeriksa penggunaan...' : references.has((m?.url || '').trim()) ? `Dipakai: ${[...references.get((m?.url || '').trim())].join(', ')}` : 'Belum digunakan'}
                  </span>
                </div>
                <div className="media-card__actions">
                  <button type="button" title="Salin link" onClick={() => handleCopy(m)}>🔗</button>
                  <button type="button" title="Hapus" className="danger" onClick={() => setToDelete(m)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toDelete && (
        <div className="confirm-overlay" onClick={() => setToDelete(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Hapus gambar ini?</h3>
            <p>Gambar "{toDelete.name}" akan dihapus dari Media Library. Gambar yang sudah terpakai di website akan hilang tampilannya.</p>
            <div className="confirm-actions">
              <button type="button" className="btn-admin-secondary" onClick={() => setToDelete(null)}>Batal</button>
              <button type="button" className="btn-admin-primary" onClick={handleDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
