import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { RADIUS_OPTIONS } from './defaults.js'
import { loadSettingsDoc, persistSettingsDoc } from './store.js'
import './cms.css'

const SiteSettingsContext = createContext(null)

function setMeta(selector, attr, value) {
  if (!value) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    for (const [k, v] of Object.entries(attr)) {
      if (k !== 'content') el.setAttribute(k, v)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function SiteSettingsProvider({ children }) {
  const [doc, setDoc] = useState(null)
  const [isPreview, setIsPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const wantPreview = new URLSearchParams(window.location.search).get('preview') === 'draft'
        let allowed = false
        if (wantPreview) {
          try {
            const { data } = await supabase.auth.getSession()
            allowed = !!data?.session
          } catch {
            allowed = false
          }
        }
        const loaded = await loadSettingsDoc()
        if (cancelled) return
        setIsPreview(allowed)
        setDoc(loaded)
      } catch (e) {
        if (!cancelled) setLoadError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    init()
    return () => { cancelled = true }
  }, [])

  const settings = useMemo(() => (doc ? (isPreview ? doc.draft : doc.published) : null), [doc, isPreview])

  useEffect(() => {
    if (!settings) return
    const a = settings.appearance || {}
    const root = document.documentElement.style
    if (a.primary) root.setProperty('--primary', a.primary)
    if (a.primaryDark) root.setProperty('--primary-dark', a.primaryDark)
    if (a.primaryLight) root.setProperty('--primary-light', a.primaryLight)
    if (a.secondary) root.setProperty('--secondary', a.secondary)
    if (a.accent) root.setProperty('--accent', a.accent)
    if (a.accentDark) root.setProperty('--accent-dark', a.accentDark)
    const radii = (RADIUS_OPTIONS.find((r) => r.value === a.radius) || RADIUS_OPTIONS[1]).radii
    root.setProperty('--radius-sm', radii.sm)
    root.setProperty('--radius-md', radii.md)
    root.setProperty('--radius-lg', radii.lg)
    root.setProperty('--radius-xl', radii.xl)
  }, [settings])

  useEffect(() => {
    if (!settings) return
    const seo = settings.seo || {}
    const identity = settings.identity || {}
    document.title = seo.title || identity.businessName || 'Banyu Frozen Food'
    setMeta('meta[name="description"]', { name: 'description' }, seo.description)
    setMeta('meta[property="og:title"]', { property: 'og:title' }, seo.title)
    setMeta('meta[property="og:description"]', { property: 'og:description' }, seo.description)
    if (seo.ogImage) setMeta('meta[property="og:image"]', { property: 'og:image' }, seo.ogImage)
    if (identity.faviconUrl) {
      let link = document.head.querySelector('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = settings.identity.faviconUrl
    }
  }, [settings])

  const saveDraft = useCallback(async (draft) => {
    const next = { ...doc, draft, updatedAt: new Date().toISOString() }
    try {
      const saved = await persistSettingsDoc(next)
      setDoc({ ...next, ...saved })
    } catch (e) {
      console.error('Gagal menyimpan draft:', e)
      throw e
    }
  }, [doc])

  const publish = useCallback(async (draft) => {
    const now = new Date().toISOString()
    const next = { ...doc, draft, published: draft, updatedAt: now, publishedAt: now }
    try {
      const saved = await persistSettingsDoc(next)
      setDoc({ ...next, ...saved })
    } catch (e) {
      console.error('Gagal menerbitkan:', e)
      throw e
    }
  }, [doc])

  const value = useMemo(() => {
    if (!doc) return null
    return {
      settings,
      loading,
      isPreview,
      storageMode: doc.mode,
      draft: doc.draft,
      published: doc.published,
      updatedAt: doc.updatedAt,
      publishedAt: doc.publishedAt,
      hasUnpublished: JSON.stringify(doc.draft) !== JSON.stringify(doc.published),
      saveDraft,
      publish,
    }
  }, [doc, settings, loading, isPreview, saveDraft, publish])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Memuat pengaturan situs...
      </div>
    )
  }
  if (loadError || !value) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748B' }}>
        <h2>Gagal memuat pengaturan situs</h2>
        <p>{loadError?.message || 'Data pengaturan tidak tersedia.'}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '10px 20px' }}>
          Muat Ulang
        </button>
      </div>
    )
  }

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
      {isPreview && (
        <div className="cms-preview-bar">
          Mode Pratinjau — perubahan belum diterbitkan ke pengunjung.
        </div>
      )}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) throw new Error('useSiteSettings harus dipakai di dalam SiteSettingsProvider')
  return ctx
}
