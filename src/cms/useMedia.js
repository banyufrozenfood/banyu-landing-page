import { useEffect, useState, useCallback } from 'react'
import { loadMedia } from './store.js'

export function useMediaLibrary() {
  const [items, setItems] = useState([])
  const [mode, setMode] = useState('local')
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await loadMedia()
      setMode(res.mode)
      setItems(res.items || [])
    } catch (e) {
      console.error('Gagal memuat media:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, mode, loading, refresh }
}
