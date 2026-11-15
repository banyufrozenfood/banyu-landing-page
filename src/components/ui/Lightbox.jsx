import { useEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons.jsx'
import './Lightbox.css'

const SWIPE_THRESHOLD = 48

export default function Lightbox({ photos = [], index = 0, onClose, onNavigate }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const touchStartX = useRef(null)
  const photo = photos[index]
  const multiple = photos.length > 1

  const goPrev = () => onNavigate((index - 1 + photos.length) % photos.length)
  const goNext = () => onNavigate((index + 1) % photos.length)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'Tab') {
        const buttons = dialogRef.current ? Array.from(dialogRef.current.querySelectorAll('button')) : []
        if (buttons.length === 0) return
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
        return
      }
      if (!multiple) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onNavigate((index - 1 + photos.length) % photos.length)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNavigate((index + 1) % photos.length)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [index, multiple, photos.length, onClose, onNavigate])

  if (!photo) return null

  function handleTouchStart(event) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current
    touchStartX.current = null
    if (!multiple || Math.abs(delta) < SWIPE_THRESHOLD) return
    if (delta > 0) goPrev()
    else goNext()
  }

  return (
    <div
      ref={dialogRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri foto: ${photo.alt || 'Foto toko'}`}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button ref={closeRef} type="button" className="lightbox__close" aria-label="Tutup galeri" onClick={onClose}>
        <CloseIcon size={22} />
      </button>

      {multiple && (
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          aria-label="Foto sebelumnya"
          onClick={(event) => { event.stopPropagation(); goPrev() }}
        >
          <ChevronLeftIcon size={26} />
        </button>
      )}

      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img className="lightbox__image" src={photo.src} alt={photo.alt || 'Foto toko'} />
        {photo.alt && <figcaption className="lightbox__caption">{photo.alt}</figcaption>}
      </figure>

      {multiple && (
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          aria-label="Foto berikutnya"
          onClick={(event) => { event.stopPropagation(); goNext() }}
        >
          <ChevronRightIcon size={26} />
        </button>
      )}

      {multiple && <p className="lightbox__counter" aria-live="polite">{index + 1} / {photos.length}</p>}
    </div>
  )
}
