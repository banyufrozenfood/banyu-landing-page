import { useRef, useState } from 'react'
import { useSiteSettings } from '../../cms/SiteSettingsContext.jsx'
import { useMediaLibrary } from '../../cms/useMedia.js'
import { addMediaItem, uploadMediaFile } from '../../cms/store.js'
import { IMAGE_TYPES, MAX_LOCAL_UPLOAD_BYTES, MAX_UPLOAD_BYTES, formatBytes, isValidUrl } from '../../cms/validate.js'
import { useToast } from './Toast.jsx'
import './ImagePicker.css'

export default function ImagePicker({ value, onChange, category = 'gambar', hint }) {
  const { storageMode } = useSiteSettings()
  const { items, refresh } = useMediaLibrary()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('library')
  const [urlInput, setUrlInput] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  const maxBytes = storageMode === 'supabase' ? MAX_UPLOAD_BYTES : MAX_LOCAL_UPLOAD_BYTES

  const handleFile = async (file) => {
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
      const item = await uploadMediaFile(storageMode, file, category)
      await refresh()
      onChange(item.url)
      setOpen(false)
      toast.success('Gambar berhasil dipasang.')
    } catch (err) {
      console.error('Upload gagal:', err)
      toast.error('Gagal mengupload gambar. Silakan coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  const handleAddUrl = async () => {
    if (!isValidUrl(urlInput) || !urlInput.trim()) {
      toast.error('Link gambar tidak valid.')
      return
    }
    setBusy(true)
    try {
      const item = await addMediaItem(storageMode, { name: urlInput.split('/').pop() || 'gambar', url: urlInput.trim(), category, size: 0 })
      await refresh()
      onChange(item.url)
      setUrlInput('')
      setOpen(false)
      toast.success('Gambar berhasil dipasang.')
    } catch (err) {
      console.error('Gagal menyimpan link:', err)
      toast.error('Gagal menyimpan link gambar.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="image-picker">
      <div className="image-picker__preview">
        {value ? <img src={value} alt="Pratinjau gambar" /> : <span className="image-picker__empty">Belum ada gambar</span>}
      </div>
      <div className="image-picker__actions">
        <button type="button" className="btn-admin-secondary" onClick={() => setOpen(true)}>
          {value ? 'Ganti Gambar' : 'Pilih Gambar'}
        </button>
        {value && (
          <button type="button" className="btn-admin-secondary" onClick={() => onChange('')}>
            Hapus
          </button>
        )}
      </div>
      {hint && <p className="image-picker__hint">{hint}</p>}

      {open && (
        <div className="image-picker__modal-overlay" onClick={() => setOpen(false)}>
          <div className="image-picker__modal" onClick={(e) => e.stopPropagation()}>
            <div className="image-picker__modal-header">
              <h3>Pilih Gambar</h3>
              <button type="button" className="btn-close-modal" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="image-picker__tabs">
              <button type="button" className={tab === 'library' ? 'active' : ''} onClick={() => setTab('library')}>Media Library</button>
              <button type="button" className={tab === 'upload' ? 'active' : ''} onClick={() => setTab('upload')}>Upload</button>
              <button type="button" className={tab === 'url' ? 'active' : ''} onClick={() => setTab('url')}>Dari Link</button>
            </div>

            {tab === 'library' && (
              <div className="image-picker__grid">
                {items.length === 0 && <p className="image-picker__empty-note">Belum ada gambar di Media Library. Upload dulu atau pakai link.</p>}
                {items.map((m) => (
                  <button type="button" key={m.id} className="image-picker__item" onClick={() => { onChange(m.url); setOpen(false); }}>
                    <img src={m.url} alt={m.name} loading="lazy" />
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === 'upload' && (
              <div className="image-picker__upload">
                <input
                  ref={fileRef}
                  type="file"
                  accept={IMAGE_TYPES.join(',')}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <p className="image-picker__hint">
                  Format: PNG, JPG, WebP, SVG, GIF. Maksimal {formatBytes(maxBytes)}.
                </p>
                {busy && <p className="image-picker__hint">Mengupload...</p>}
              </div>
            )}

            {tab === 'url' && (
              <div className="image-picker__url">
                <input
                  type="url"
                  placeholder="https://contoh.com/gambar.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <button type="button" className="btn-admin-primary" onClick={handleAddUrl} disabled={busy}>
                  Pakai Gambar Ini
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
