import { useMemo, useRef, useState } from 'react'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { useMediaLibrary } from '../../cms/useMedia.js'
import { addMediaItem, removeMediaItem, uploadMediaFile } from '../../cms/store.js'
import { IMAGE_TYPES, MAX_LOCAL_UPLOAD_BYTES, MAX_UPLOAD_BYTES, formatBytes, isValidUrl } from '../../cms/validate.js'
import { useToast } from '../../components/ui/Toast.jsx'
import './AdminShared.css'
import './AdminMedia.css'

const CATEGORIES = [
  { value: 'gambar', label: 'Gambar' },
  { value: 'logo', label: 'Logo' },
  { value: 'banner', label: 'Banner' },
  { value: 'toko', label: 'Foto Toko' },
]

const FILTERS = [{ value: 'all', label: 'Semua' }, ...CATEGORIES]

export default function AdminMedia() {
  const { storageMode } = useSiteSettings()
  const { items, mode, loading, refresh } = useMediaLibrary()
  const toast = useToast()
  const fileRef = useRef(null)
  const [category, setCategory] = useState('gambar')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const maxBytes = storageMode === 'supabase' ? MAX_UPLOAD_BYTES : MAX_LOCAL_UPLOAD_BYTES

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((m) => (filter === 'all' || m.category === filter) && (!q || (m.name || '').toLowerCase().includes(q)))
  }, [items, filter, search])

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
    if (!urlInput.trim() || !isValidUrl(urlInput)) {
      toast.error('Link gambar tidak valid.')
      return
    }
    setBusy(true)
    try {
      await addMediaItem(mode, { name: urlInput.split('/').pop() || 'gambar', url: urlInput.trim(), category, size: 0 })
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
    setToDelete(null)
    try {
      await removeMediaItem(mode, item)
      await refresh()
      toast.success('Gambar berhasil dihapus.')
    } catch (e) {
      console.error('Gagal menghapus:', e)
      toast.error('Gagal menghapus gambar.')
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
            {visible.map((m) => (
              <div className="media-card" key={m.id}>
                <div className="media-card__thumb">
                  <img src={m.url} alt={m.name} loading="lazy" />
                </div>
                <div className="media-card__info">
                  <span className="media-card__name" title={m.name}>{m.name}</span>
                  <span className="media-card__meta">
                    {(CATEGORIES.find((c) => c.value === m.category) || { label: m.category || 'Lainnya' }).label}
                    {m.size ? ` · ${formatBytes(m.size)}` : ''}
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
