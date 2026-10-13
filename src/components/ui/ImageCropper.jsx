import { useCallback, useEffect, useRef, useState } from 'react'
import './ImageCropper.css'

const ASPECT_OPTIONS = [
  { label: 'Full (asli)', value: 0 },
  { label: '2:1', value: 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '1:1', value: 1 },
  { label: '3:4', value: 3 / 4 },
]

export default function ImageCropper({
  src,
  aspect: defaultAspect = 2,
  title = 'Sesuaikan Gambar',
  onConfirm,
  onClose,
}) {
  const viewportRef = useRef(null)
  const mountedRef = useRef(true)
  const [img, setImg] = useState(null)
  const [loadState, setLoadState] = useState('loading')
  const [vp, setVp] = useState({ vw: 0, vh: 0 })
  const [aspect, setAspect] = useState(defaultAspect)
  const [zoom, setZoom] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [busy, setBusy] = useState(false)
  const [exportError, setExportError] = useState('')
  const dragRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const isFull = aspect === 0

  useEffect(() => {
    let cancelled = false
    setLoadState('loading')
    setExportError('')
    const im = new Image()
    im.crossOrigin = 'anonymous'
    im.onload = () => { if (!cancelled) { setImg(im); setLoadState('ready'); setZoom(1) } }
    im.onerror = () => { if (!cancelled) setLoadState('error') }
    im.src = src
    return () => { cancelled = true }
  }, [src])

  useEffect(() => {
    const measure = () => {
      const el = viewportRef.current
      if (el) {
        const r = el.getBoundingClientRect()
        setVp({ vw: r.width, vh: r.height })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [loadState, aspect])

  const vpAspect = isFull && img && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : (aspect || 1)

  const coverScale = img && vp.vw
    ? Math.max(vp.vw / img.naturalWidth, vp.vh / img.naturalHeight)
    : 1
  const scale = coverScale * (isFull ? 1 : zoom)
  const dw = img ? img.naturalWidth * scale : 0
  const dh = img ? img.naturalHeight * scale : 0

  const clampPos = useCallback((p) => {
    if (isFull) return { x: 0, y: 0 }
    const minX = vp.vw - dw
    const minY = vp.vh - dh
    return {
      x: Math.min(0, Math.max(minX, p.x)),
      y: Math.min(0, Math.max(minY, p.y)),
    }
  }, [vp.vw, vp.vh, dw, dh, isFull])

  useEffect(() => {
    if (loadState !== 'ready' || !vp.vw) return
    setPos(clampPos({ x: (vp.vw - dw) / 2, y: (vp.vh - dh) / 2 }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadState, vp.vw, vp.vh, img, aspect])

  useEffect(() => {
    if (loadState !== 'ready') return
    setPos((p) => clampPos(p))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  const onPointerDown = (e) => {
    if (isFull) return
    e.preventDefault()
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: pos.x, oy: pos.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragRef.current) return
    const d = dragRef.current
    setPos(clampPos({ x: d.ox + (e.clientX - d.startX), y: d.oy + (e.clientY - d.startY) }))
  }
  const onPointerUp = () => { dragRef.current = null }

  const handleConfirm = () => {
    if (!img || busy) return
    setBusy(true)
    setExportError('')
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      let OW, OH
      if (isFull) {
        OW = img.naturalWidth
        OH = Math.round(OW * img.naturalHeight / img.naturalWidth)
        canvas.width = OW
        canvas.height = OH
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, OW, OH)
      } else {
        const sw = vp.vw / scale
        const sh = vp.vh / scale
        // Export at source crop size. Never upscale or cap large originals.
        OW = Math.max(1, Math.round(sw))
        OH = Math.max(1, Math.round(sh))
        canvas.width = OW
        canvas.height = OH
        const sx = -pos.x / scale
        const sy = -pos.y / scale
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, OW, OH)
      }
      canvas.toBlob((blob) => {
        if (!mountedRef.current) return
        setBusy(false)
        if (!blob) { setExportError('Gagal memproses gambar.'); return }
        const file = new File([blob], `crop-${Date.now()}.jpg`, { type: 'image/jpeg' })
        onConfirm(file)
      }, 'image/jpeg', 0.98)
    } catch {
      if (!mountedRef.current) return
      setBusy(false)
      setExportError('Gambar dari link eksternal ini dibatasi browser (CORS) sehingga tidak bisa di-crop. Upload dulu gambarnya lewat tab Upload, lalu sesuaikan.')
    }
  }

  return (
    <div className="cropper-overlay" onClick={onClose}>
      <div className="cropper-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cropper-header">
          <h3>{title}</h3>
          <button type="button" className="btn-close-modal" onClick={onClose}>✕</button>
        </div>

        <div className="cropper-body">
          {loadState === 'loading' && <p className="cropper-note">Memuat gambar...</p>}
          {loadState === 'error' && <p className="cropper-note error">Gambar tidak bisa dimuat. Periksa link gambar.</p>}

          {loadState === 'ready' && (
            <>
              <div className="cropper-aspects">
                <span className="cropper-label">Proporsi:</span>
                {ASPECT_OPTIONS.map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    className={`cropper-aspect-btn${aspect === o.value ? ' active' : ''}`}
                    onClick={() => { setAspect(o.value); setZoom(1) }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div
                ref={viewportRef}
                className={`cropper-viewport${isFull ? ' is-full' : ''}`}
                style={{ aspectRatio: `${vpAspect} / 1` }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <img
                  src={src}
                  alt="Pratinjau crop"
                  draggable={false}
                  style={{ width: dw, height: dh, left: pos.x, top: pos.y }}
                />
                {!isFull && <div className="cropper-frame" />}
              </div>

              {!isFull && (
                <div className="cropper-controls">
                  <span className="cropper-label">Geser:</span>
                  <span className="cropper-hint-text">tarik / seret gambar di dalam kotak</span>
                  <span className="cropper-label">Zoom:</span>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                  <span className="cropper-zoomval">{zoom.toFixed(2)}×</span>
                </div>
              )}

              <p className="cropper-note">
                {isFull
                  ? 'Mode Full: seluruh gambar dipakai tanpa dipotong. Klik Simpan untuk memakai gambar utuh.'
                  : 'Area di dalam kotak terang adalah bagian yang akan disimpan. Pilih proporsi, geser, dan atur zoom sampai pas, lalu klik Simpan.'}
              </p>
              {exportError && <p className="cropper-note error">{exportError}</p>}
            </>
          )}
        </div>

        <div className="cropper-footer">
          <button type="button" className="btn-admin-secondary" onClick={onClose}>Batal</button>
          <button
            type="button"
            className="btn-admin-primary"
            onClick={handleConfirm}
            disabled={loadState !== 'ready' || busy}
          >
            {busy ? 'Memproses...' : 'Simpan Hasil'}
          </button>
        </div>
      </div>
    </div>
  )
}
